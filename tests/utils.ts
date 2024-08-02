import * as nock from 'nock'

export function setupAuth(): void {
  nock(process.env.PLUGGY_API_URL!)
    .post('/auth')
    .reply(200, { apiKey: '123' })
}
