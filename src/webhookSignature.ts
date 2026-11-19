import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Name of the HTTP header that carries the webhook signature (`X-Pluggy-Signature`).
 *
 * HTTP header names are case-insensitive; Node.js exposes them lowercased in
 * `req.headers`, so this constant is lowercase and can be used directly as
 * `req.headers[WEBHOOK_SIGNATURE_HEADER]` or `req.get(WEBHOOK_SIGNATURE_HEADER)`.
 */
export const WEBHOOK_SIGNATURE_HEADER = 'x-pluggy-signature'

/** Default maximum age (and clock skew), in seconds, accepted for a signature timestamp. */
export const WEBHOOK_SIGNATURE_DEFAULT_TOLERANCE_IN_SECONDS = 300

/** Why a webhook signature was rejected. */
export type WebhookSignatureFailureReason =
  /** No signing secret was provided (empty string, empty list, or not a string). */
  | 'no_secret'
  /** The payload is not a raw `string` / `Buffer` (e.g. an already-parsed JSON object). */
  | 'invalid_payload'
  /** The signature header is absent or empty. */
  | 'missing_header'
  /** The signature header could not be parsed (bad format, bad timestamp or bad `v1`). */
  | 'malformed_header'
  /** The signature timestamp is too far in the past or in the future. */
  | 'timestamp_out_of_tolerance'
  /** The signature does not match the payload with any of the given secrets. */
  | 'signature_mismatch'

export type WebhookSignatureValidationResult =
  | { valid: true }
  | { valid: false; reason: WebhookSignatureFailureReason }

export type VerifyWebhookSignatureOptions = {
  /**
   * The raw request body, exactly as received, before any JSON parsing
   * (e.g. the `Buffer` produced by `express.raw({ type: 'application/json' })`).
   */
  payload: string | Buffer | Uint8Array
  /** The value of the `X-Pluggy-Signature` header. */
  header: string | string[] | undefined | null
  /**
   * The signing secret as shown in the Pluggy Dashboard (`whsec_...`, used as-is,
   * prefix included). Pass a list to accept more than one secret, e.g. the old
   * and the new one while a secret is being rotated. Empty, `undefined` and
   * `null` entries are skipped (so unset environment variables can be passed
   * as-is); if no usable secret is left the result is `no_secret`.
   */
  secrets: string | ReadonlyArray<string | undefined | null> | undefined | null
  /**
   * Maximum difference, in seconds, between the signature timestamp and the
   * current time, in either direction. Defaults to 300 (5 minutes).
   * Values that are not a finite, non-negative number fall back to the default.
   */
  toleranceInSeconds?: number
  /** Current time. Defaults to `new Date()`; mostly useful for tests. */
  now?: Date
}

const SIGNATURE_BYTES = 32
// 12 digits covers every timestamp until the year 33658; anything longer is rejected.
const TIMESTAMP_PATTERN = /^(0|[1-9][0-9]{0,11})$/
const V1_PATTERN = /^[0-9a-fA-F]{64}$/
const KEY_PATTERN = /^[A-Za-z0-9_-]+$/

type ParsedHeader = { timestamp: number; rawTimestamp: string; signature: Buffer }

function parseSignatureHeader(header: string): ParsedHeader | null {
  let rawTimestamp: string | undefined
  let rawSignature: string | undefined

  for (const rawPart of header.split(',')) {
    const part = rawPart.trim()
    const separator = part.indexOf('=')
    if (separator <= 0) {
      return null
    }
    const key = part.slice(0, separator)
    const value = part.slice(separator + 1)
    if (!KEY_PATTERN.test(key)) {
      return null
    }
    if (key === 't') {
      if (rawTimestamp !== undefined) {
        return null
      }
      rawTimestamp = value
    } else if (key === 'v1') {
      if (rawSignature !== undefined) {
        return null
      }
      rawSignature = value
    }
    // Unknown keys (e.g. a future `v2=`) are ignored on purpose.
  }

  if (rawTimestamp === undefined || rawSignature === undefined) {
    return null
  }
  if (!TIMESTAMP_PATTERN.test(rawTimestamp) || !V1_PATTERN.test(rawSignature)) {
    return null
  }
  const timestamp = Number(rawTimestamp)
  if (!Number.isSafeInteger(timestamp) || timestamp <= 0) {
    return null
  }
  return { timestamp, rawTimestamp, signature: Buffer.from(rawSignature, 'hex') }
}

function normalizeSecrets(secrets: unknown): string[] {
  const list = Array.isArray(secrets) ? secrets : [secrets]
  return list.filter((secret): secret is string => typeof secret === 'string' && secret !== '')
}

function computeSignature(secret: string, rawTimestamp: string, payload: Buffer): Buffer {
  return createHmac('sha256', Buffer.from(secret, 'utf8'))
    .update(`${rawTimestamp}.`, 'utf8')
    .update(payload)
    .digest()
}

/**
 * Validates the `X-Pluggy-Signature` header of a webhook notification and
 * explains why it was rejected, for callers who want to log the reason.
 *
 * The header has the form `t=<unix timestamp in seconds>,v1=<hex HMAC-SHA256>`,
 * where `v1` is computed with the signing secret over `<t>.<raw request body>`.
 * Unknown `key=value` pairs are ignored. The comparison is constant-time.
 *
 * Never throws: any malformed input yields `{ valid: false, reason }`.
 *
 * @see https://docs.pluggy.ai/docs/developer-tools/webhook-security
 */
export function validateWebhookSignature(
  options: VerifyWebhookSignatureOptions
): WebhookSignatureValidationResult {
  try {
    const { payload, header, secrets, toleranceInSeconds, now } = options || ({} as never)

    const secretList = normalizeSecrets(secrets)
    if (secretList.length === 0) {
      return { valid: false, reason: 'no_secret' }
    }

    let body: Buffer
    if (typeof payload === 'string') {
      body = Buffer.from(payload, 'utf8')
    } else if (payload instanceof Uint8Array) {
      body = Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength)
    } else {
      return { valid: false, reason: 'invalid_payload' }
    }

    let headerValue: unknown = header
    if (Array.isArray(headerValue)) {
      if (headerValue.length > 1) {
        return { valid: false, reason: 'malformed_header' }
      }
      headerValue = headerValue[0]
    }
    if (headerValue === undefined || headerValue === null || headerValue === '') {
      return { valid: false, reason: 'missing_header' }
    }
    if (typeof headerValue !== 'string') {
      return { valid: false, reason: 'malformed_header' }
    }
    if (headerValue.trim() === '') {
      return { valid: false, reason: 'missing_header' }
    }

    const parsed = parseSignatureHeader(headerValue)
    if (!parsed) {
      return { valid: false, reason: 'malformed_header' }
    }

    const tolerance =
      typeof toleranceInSeconds === 'number' &&
      Number.isFinite(toleranceInSeconds) &&
      toleranceInSeconds >= 0
        ? toleranceInSeconds
        : WEBHOOK_SIGNATURE_DEFAULT_TOLERANCE_IN_SECONDS
    const nowMs = now instanceof Date ? now.getTime() : Date.now()
    if (!Number.isFinite(nowMs)) {
      return { valid: false, reason: 'timestamp_out_of_tolerance' }
    }
    const nowInSeconds = Math.floor(nowMs / 1000)
    if (Math.abs(nowInSeconds - parsed.timestamp) > tolerance) {
      return { valid: false, reason: 'timestamp_out_of_tolerance' }
    }

    let matched = false
    for (const secret of secretList) {
      const expected = computeSignature(secret, parsed.rawTimestamp, body)
      if (
        expected.length === SIGNATURE_BYTES &&
        parsed.signature.length === SIGNATURE_BYTES &&
        timingSafeEqual(expected, parsed.signature)
      ) {
        matched = true
      }
    }
    return matched ? { valid: true } : { valid: false, reason: 'signature_mismatch' }
  } catch {
    return { valid: false, reason: 'malformed_header' }
  }
}

/**
 * Verifies the `X-Pluggy-Signature` header of a webhook notification.
 *
 * Returns `true` only when the header parses, its timestamp is within
 * `toleranceInSeconds` of the current time (past or future), and the signature
 * matches the raw `payload` with one of the given `secrets`. Never throws.
 *
 * Use {@link validateWebhookSignature} to also get the reason of a failure.
 *
 * @example
 * app.post('/webhooks/pluggy', express.raw({ type: 'application/json' }), (req, res) => {
 *   const ok = verifyWebhookSignature({
 *     payload: req.body,
 *     header: req.get(WEBHOOK_SIGNATURE_HEADER),
 *     secrets: [process.env.PLUGGY_WEBHOOK_SECRET, process.env.PLUGGY_WEBHOOK_SECRET_OLD],
 *   })
 *   if (!ok) return res.sendStatus(401)
 *   // ...
 * })
 *
 * @see https://docs.pluggy.ai/docs/developer-tools/webhook-security
 */
export function verifyWebhookSignature(options: VerifyWebhookSignatureOptions): boolean {
  return validateWebhookSignature(options).valid
}
