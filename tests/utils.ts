import nock from 'nock'

// A non-expiring JWT (exp: 9999999999 = year 2286) — used to allow the SDK
// to reuse the cached apiKey across multiple requests in the same test.
// Only the payload is decoded (not verified), so the signature is irrelevant.
export const MOCK_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.FAKE'

export function setupAuth(): void {
  nock(process.env.PLUGGY_API_URL!)
    .post('/auth')
    .reply(200, { apiKey: MOCK_API_KEY })
}

/** Answers every request to `origin` with `body` and records each one as `METHOD uri`. */
export function recordRequests(origin: string, body: nock.Body = {}): string[] {
  const seen: string[] = []
  const reply = function(this: nock.ReplyFnContext, uri: string): nock.ReplyFnResult {
    seen.push(`${this.req.method} ${uri}`)
    return [200, body]
  }
  nock(origin)
    .persist()
    .get(/.*/)
    .reply(reply)
    .post(/.*/)
    .reply(reply)
    .patch(/.*/)
    .reply(reply)
    .delete(/.*/)
    .reply(reply)
  return seen
}
