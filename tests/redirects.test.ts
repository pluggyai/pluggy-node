import nock from 'nock'
import { MOCK_API_KEY, recordRequests, setupAuth } from './utils'
import { PluggyClient } from '../src/client'

const API_URL = process.env.PLUGGY_API_URL!
const OTHER_ORIGIN = 'https://other-host.example.com'
const REFUSED = 'configured API origin'

const newClient = (): PluggyClient =>
  new PluggyClient({ clientId: 'dummy-id', clientSecret: 'dummy-secret' })

describe('redirects', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
  })

  describe.each([300, 301, 302, 303, 304, 307, 308])('a %i to another origin', code => {
    const redirect = { Location: `${OTHER_ORIGIN}/collect` }

    it('does not send the client credentials', async () => {
      nock(API_URL)
        .post('/auth')
        .reply(code, '', redirect)
      const other = recordRequests(OTHER_ORIGIN, { apiKey: MOCK_API_KEY })

      await expect(newClient().fetchItem('dummy-item')).rejects.toThrow(REFUSED)

      expect(other).toEqual([])
    })

    it('does not send the API key on a read', async () => {
      setupAuth()
      nock(API_URL)
        .get('/items/dummy-item')
        .reply(code, '', redirect)
      const other = recordRequests(OTHER_ORIGIN)

      await expect(newClient().fetchItem('dummy-item')).rejects.toThrow(REFUSED)

      expect(other).toEqual([])
    })

    it('does not send the API key or body on a write', async () => {
      setupAuth()
      nock(API_URL)
        .post('/items')
        .reply(code, '', redirect)
      const other = recordRequests(OTHER_ORIGIN)

      await expect(
        newClient().createItem(0, { user: 'dummy-user', password: 'dummy-password' })
      ).rejects.toThrow(REFUSED)

      expect(other).toEqual([])
    })
  })

  it.each([
    ['plain http on the same host', API_URL.replace(/^https:/, 'http:')],
    ['another port on the same host', `${API_URL}:8443`],
  ])('refuses a redirect to %s', async (_label, origin) => {
    setupAuth()
    nock(API_URL)
      .get('/items/dummy-item')
      .reply(307, '', { Location: `${origin}/collect` })
    const other = recordRequests(origin)

    await expect(newClient().fetchItem('dummy-item')).rejects.toThrow(REFUSED)

    expect(other).toEqual([])
  })

  it.each([
    ['an absolute', `${API_URL}/items/moved`],
    ['a relative', '/items/moved'],
  ])('follows %s redirect within the API origin', async (_label, location) => {
    setupAuth()
    nock(API_URL)
      .get('/items/dummy-item')
      .reply(307, '', { Location: location })
    nock(API_URL)
      .get('/items/moved')
      .matchHeader('X-API-KEY', MOCK_API_KEY)
      .reply(200, { id: 'moved' })

    await expect(newClient().fetchItem('dummy-item')).resolves.toEqual({ id: 'moved' })
  })
})
