import * as nock from 'nock'

// A non-expiring JWT (exp: 9999999999 = year 2286) — used to allow the SDK
// to reuse the cached apiKey across multiple requests in the same test.
// Only the payload is decoded (not verified), so the signature is irrelevant.
export const MOCK_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.FAKE'

export function setupAuth(): void {
  nock(process.env.PLUGGY_API_URL!)
    .post('/auth')
    .reply(200, { apiKey: MOCK_API_KEY })
}
