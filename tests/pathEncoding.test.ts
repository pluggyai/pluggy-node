import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { assertSafeEndpoint } from '../src/baseApi'

const API_URL = process.env.PLUGGY_API_URL!
const UUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

describe('assertSafeEndpoint', () => {
  it.each([`accounts/${UUID}`, `items/${UUID}/mfa`, 'connectors', 'payments/requests'])(
    'accepts %s',
    endpoint => {
      expect(() => assertSafeEndpoint(endpoint)).not.toThrow()
    }
  )

  it.each([
    ['a query delimiter', 'accounts/abc?x=1&y=2'],
    ['a fragment', 'accounts/abc#frag'],
    ['a percent-encoded sequence', 'accounts/abc%2F..'],
    ['a dot segment', 'accounts/../items'],
    ['a current-dir segment', 'accounts/./x'],
    ['an empty segment', 'accounts//x'],
    ['a trailing slash (empty id)', 'accounts/'],
    ['a leading slash', '/accounts'],
    ['whitespace', 'accounts/a b'],
    ['a control character', 'accounts/a\nb'],
    ['a backslash', 'accounts/a\\b'],
    ['an empty endpoint', ''],
  ])('rejects an endpoint with %s', (_label, endpoint) => {
    expect(() => assertSafeEndpoint(endpoint)).toThrow('unsafe endpoint')
  })
})

describe('requests with caller-provided ids', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

  it('sends a plain UUID unchanged', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${UUID}`)
      .reply(200, { id: UUID })

    await client.fetchAccount(UUID)

    expect(mock.isDone()).toBeTruthy()
  })

  it('refuses an id that would add a query string, without sending a request', async () => {
    const mock = nock(API_URL)
      .get(/.*/)
      .reply(200, {})

    await expect(client.fetchAccount(`${UUID}?accountId=other`)).rejects.toThrow('unsafe endpoint')
    expect(mock.isDone()).toBeFalsy()
  })

  it('refuses an empty id on a mutation', async () => {
    const mock = nock(API_URL)
      .delete(/.*/)
      .reply(204)

    await expect(client.deleteItem('')).rejects.toThrow('unsafe endpoint')
    expect(mock.isDone()).toBeFalsy()
  })

  it('sends the identity itemId as an encoded query parameter', async () => {
    const mock = nock(API_URL)
      .get('/identity')
      .query({ itemId: 'a&b=c' })
      .reply(200, {})

    await client.fetchIdentityByItemId('a&b=c')

    expect(mock.isDone()).toBeTruthy()
  })
})
