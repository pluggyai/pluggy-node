/**
 * Body of an API error. On a non-2xx response the SDK rejects with this body, as returned by the
 * API, so callers can branch on `codeDescription`.
 */
export type ApiErrorResponse = {
  /** HTTP status code of the response */
  code: number
  /** Machine-readable error code, such as `CLIENT_IP_NOT_ALLOWED` */
  codeDescription?: string
  /** Human-readable description of the error */
  message: string
  /** Additional details, present for some errors only */
  data?: unknown
}

/**
 * `codeDescription` of the 403 the API answers when the application has an IP allowlist
 * ("Allowed IPs", configured in the Dashboard) and the request comes from an IP that is not on it.
 * It applies to `POST /auth` and to every request made with the application's API key.
 * @see https://docs.pluggy.ai/docs/security/ip-allowlist
 */
export const CLIENT_IP_NOT_ALLOWED = 'CLIENT_IP_NOT_ALLOWED'

/**
 * Whether an error rejected by the SDK is the API's `CLIENT_IP_NOT_ALLOWED` 403: the request came
 * from an IP that is not on the application's allowlist.
 * @see https://docs.pluggy.ai/docs/security/ip-allowlist
 */
export function isClientIpNotAllowedError(
  error: unknown
): error is ApiErrorResponse & { codeDescription: typeof CLIENT_IP_NOT_ALLOWED } {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as ApiErrorResponse).codeDescription === CLIENT_IP_NOT_ALLOWED
  )
}
