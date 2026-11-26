import { createHmac } from 'crypto'
import { WEBHOOK_SIGNATURE_HEADER, validateWebhookSignature, verifyWebhookSignature } from '../src'

const SECRET = 'whsec_' + 'a1b2c3d4'.repeat(8)
const OTHER_SECRET = 'whsec_' + 'f0e1d2c3'.repeat(8)
const T = 1763560800
const NOW = new Date(T * 1000)
const BODY = '{"event":"item/updated","eventId":"evt_1","itemId":"item_1"}'

const sign = (secret: string, t: number | string, body: string | Buffer): string =>
  createHmac('sha256', secret)
    .update(Buffer.concat([Buffer.from(`${t}.`, 'utf8'), Buffer.from(body as string)]))
    .digest('hex')

const header = (t: number | string = T, body: string | Buffer = BODY, secret = SECRET): string =>
  `t=${t},v1=${sign(secret, t, body)}`

const validate = (overrides: Partial<Parameters<typeof validateWebhookSignature>[0]> = {}) =>
  validateWebhookSignature({
    payload: BODY,
    header: header(),
    secrets: SECRET,
    now: NOW,
    ...overrides,
  })

describe('webhook signature', () => {
  it('exports the header name', () => {
    expect(WEBHOOK_SIGNATURE_HEADER).toBe('x-pluggy-signature')
  })

  it('matches a fixed known-answer vector', () => {
    const secret = 'whsec_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const body = '{"event":"item/updated","eventId":"evt_test","itemId":"item_test","note":"ação"}'
    const v1 = '002c330ef76a9209f11870843509b1ac0f3df0f3b00b0a16712abdd0eff15a34'
    expect(
      validateWebhookSignature({
        payload: body,
        header: `t=1763560800,v1=${v1}`,
        secrets: secret,
        now: new Date(1763560800 * 1000),
      })
    ).toEqual({ valid: true })
  })

  it('accepts a valid signature', () => {
    expect(validate()).toEqual({ valid: true })
    expect(
      verifyWebhookSignature({ payload: BODY, header: header(), secrets: SECRET, now: NOW })
    ).toBe(true)
  })

  it('accepts a Buffer payload and a string payload alike', () => {
    expect(validate({ payload: Buffer.from(BODY, 'utf8') })).toEqual({ valid: true })
    expect(validate({ payload: new Uint8Array(Buffer.from(BODY, 'utf8')) })).toEqual({
      valid: true,
    })
  })

  it('accepts a non-ASCII body', () => {
    const body = '{"description":"Pagamento à vista — café ☕ 日本"}'
    expect(validate({ payload: body, header: header(T, body) })).toEqual({ valid: true })
    expect(validate({ payload: Buffer.from(body, 'utf8'), header: header(T, body) })).toEqual({
      valid: true,
    })
  })

  it('accepts an empty body', () => {
    expect(validate({ payload: '', header: header(T, '') })).toEqual({ valid: true })
  })

  it('rejects a body altered by one byte', () => {
    const altered = Buffer.from(BODY, 'utf8')
    altered[altered.length - 2] ^= 0x01
    expect(validate({ payload: altered })).toEqual({ valid: false, reason: 'signature_mismatch' })
    expect(validate({ payload: BODY + ' ' })).toEqual({
      valid: false,
      reason: 'signature_mismatch',
    })
  })

  it('rejects a re-serialized body', () => {
    const reserialized = JSON.stringify(JSON.parse(BODY), null, 2)
    expect(validate({ payload: reserialized })).toEqual({
      valid: false,
      reason: 'signature_mismatch',
    })
  })

  it('rejects a parsed (non-raw) payload', () => {
    expect(validate({ payload: JSON.parse(BODY) })).toEqual({
      valid: false,
      reason: 'invalid_payload',
    })
    expect(validate({ payload: undefined })).toEqual({ valid: false, reason: 'invalid_payload' })
  })

  it('rejects a wrong secret', () => {
    expect(validate({ secrets: OTHER_SECRET })).toEqual({
      valid: false,
      reason: 'signature_mismatch',
    })
  })

  it('uses the whole secret, prefix included', () => {
    expect(validate({ secrets: SECRET.replace('whsec_', '') })).toEqual({
      valid: false,
      reason: 'signature_mismatch',
    })
  })

  it('accepts any secret of a list (rotation)', () => {
    expect(validate({ secrets: [OTHER_SECRET, SECRET] })).toEqual({ valid: true })
    expect(validate({ secrets: [SECRET, OTHER_SECRET] })).toEqual({ valid: true })
    expect(validate({ secrets: [OTHER_SECRET, '', 'whsec_x'] })).toEqual({
      valid: false,
      reason: 'signature_mismatch',
    })
  })

  it('skips unset entries of the secrets list', () => {
    const unset: string | undefined = undefined
    expect(validate({ secrets: [unset, SECRET, null] })).toEqual({ valid: true })
  })

  it('reports no_secret when there is no usable secret', () => {
    expect(validate({ secrets: [] })).toEqual({ valid: false, reason: 'no_secret' })
    expect(validate({ secrets: '' })).toEqual({ valid: false, reason: 'no_secret' })
    expect(validate({ secrets: [''] })).toEqual({ valid: false, reason: 'no_secret' })
    expect(validate({ secrets: undefined })).toEqual({ valid: false, reason: 'no_secret' })
  })

  describe('timestamp tolerance', () => {
    it('rejects a timestamp too old', () => {
      expect(validate({ header: header(T - 301) })).toEqual({
        valid: false,
        reason: 'timestamp_out_of_tolerance',
      })
    })

    it('rejects a timestamp in the future beyond tolerance', () => {
      expect(validate({ header: header(T + 301) })).toEqual({
        valid: false,
        reason: 'timestamp_out_of_tolerance',
      })
    })

    it('accepts both boundaries (inclusive) with the default 5 minutes', () => {
      expect(validate({ header: header(T - 300) })).toEqual({ valid: true })
      expect(validate({ header: header(T + 300) })).toEqual({ valid: true })
    })

    it('honours a custom tolerance', () => {
      expect(validate({ header: header(T - 10), toleranceInSeconds: 10 })).toEqual({
        valid: true,
      })
      expect(validate({ header: header(T - 11), toleranceInSeconds: 10 })).toEqual({
        valid: false,
        reason: 'timestamp_out_of_tolerance',
      })
      expect(validate({ header: header(T), toleranceInSeconds: 0 })).toEqual({ valid: true })
      expect(validate({ header: header(T - 1), toleranceInSeconds: 0 })).toEqual({
        valid: false,
        reason: 'timestamp_out_of_tolerance',
      })
    })

    it('falls back to the default for an invalid tolerance', () => {
      for (const toleranceInSeconds of [-1, NaN, Infinity]) {
        expect(validate({ header: header(T - 300), toleranceInSeconds })).toEqual({ valid: true })
        expect(validate({ header: header(T - 301), toleranceInSeconds })).toEqual({
          valid: false,
          reason: 'timestamp_out_of_tolerance',
        })
      }
    })

    it('uses the current time when now is omitted', () => {
      const t = Math.floor(Date.now() / 1000)
      expect(verifyWebhookSignature({ payload: BODY, header: header(t), secrets: SECRET })).toBe(
        true
      )
      expect(
        verifyWebhookSignature({ payload: BODY, header: header(t - 3600), secrets: SECRET })
      ).toBe(false)
    })
  })

  describe('header parsing', () => {
    it('reports a missing or empty header', () => {
      for (const value of [undefined, null, '', '   ', []]) {
        expect(validate({ header: value as string })).toEqual({
          valid: false,
          reason: 'missing_header',
        })
      }
    })

    it('accepts a single-element header array (Node IncomingHttpHeaders)', () => {
      expect(validate({ header: [header()] })).toEqual({ valid: true })
      expect(validate({ header: [header(), header()] })).toEqual({
        valid: false,
        reason: 'malformed_header',
      })
    })

    it('tolerates whitespace around pairs and any pair order', () => {
      const v1 = sign(SECRET, T, BODY)
      expect(validate({ header: ` t=${T} , v1=${v1} ` })).toEqual({ valid: true })
      expect(validate({ header: `v1=${v1},t=${T}` })).toEqual({ valid: true })
    })

    it('accepts an uppercase hex signature', () => {
      expect(validate({ header: `t=${T},v1=${sign(SECRET, T, BODY).toUpperCase()}` })).toEqual({
        valid: true,
      })
    })

    it('ignores unknown pairs', () => {
      const v1 = sign(SECRET, T, BODY)
      expect(validate({ header: `t=${T},v1=${v1},v2=${'b'.repeat(128)}` })).toEqual({
        valid: true,
      })
      expect(validate({ header: `v0=abc,t=${T},foo=bar=baz,v1=${v1}` })).toEqual({ valid: true })
    })

    const v1 = sign(SECRET, T, BODY)
    it.each([
      ['no pairs', 'garbage'],
      ['only t', `t=${T}`],
      ['only v1', `v1=${v1}`],
      ['empty pair', `t=${T},,v1=${v1}`],
      ['trailing comma', `t=${T},v1=${v1},`],
      ['pair without key', `t=${T},=x,v1=${v1}`],
      ['key with whitespace', `t=${T},v 1=${v1}`],
      ['duplicate t', `t=${T},t=${T},v1=${v1}`],
      ['duplicate v1', `t=${T},v1=${v1},v1=${v1}`],
      ['empty t', `t=,v1=${v1}`],
      ['negative t', `t=-${T},v1=${v1}`],
      ['signed t', `t=+${T},v1=${v1}`],
      ['decimal t', `t=${T}.5,v1=${v1}`],
      ['exponent t', `t=1.7e9,v1=${v1}`],
      ['hex t', `t=0x${T.toString(16)},v1=${v1}`],
      ['leading zero t', `t=0${T},v1=${v1}`],
      ['zero t', `t=0,v1=${v1}`],
      ['absurd t', `t=${'9'.repeat(13)},v1=${v1}`],
      ['t with inner whitespace', `t= ${T},v1=${v1}`],
      ['milliseconds t', `t=${T * 1000},v1=${v1}`],
      ['empty v1', `t=${T},v1=`],
      ['non-hex v1', `t=${T},v1=${'z'.repeat(64)}`],
      ['short v1', `t=${T},v1=${v1.slice(0, 62)}`],
      ['long v1', `t=${T},v1=${v1}00`],
      ['odd-length v1', `t=${T},v1=${v1.slice(0, 63)}`],
      ['base64 v1', `t=${T},v1=${Buffer.from(v1, 'hex').toString('base64')}`],
      ['v1 with inner whitespace', `t=${T},v1= ${v1}`],
    ])('rejects a malformed header: %s', (_name, value) => {
      const result = validate({ header: value })
      expect(result).toEqual({ valid: false, reason: 'malformed_header' })
    })

    it('never throws on hostile input', () => {
      const inputs: unknown[] = [42, {}, [42], Symbol('x'), 'x'.repeat(100000)]
      for (const value of inputs) {
        expect(() => validate({ header: value as string })).not.toThrow()
        expect(validate({ header: value as string }).valid).toBe(false)
      }
      expect(() => validateWebhookSignature(undefined)).not.toThrow()
      expect(verifyWebhookSignature(null)).toBe(false)
      expect(validate({ now: new Date('invalid') })).toEqual({
        valid: false,
        reason: 'timestamp_out_of_tolerance',
      })
    })
  })
})
