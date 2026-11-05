import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'

const API_URL = process.env.PLUGGY_API_URL!

const newClient = (): PluggyClient =>
  new PluggyClient({ clientId: 'dummy-id', clientSecret: 'dummy-secret' })

/** Runs `call` and returns what it rejected with, failing if it resolved. */
async function rejectionOf(call: Promise<unknown>): Promise<unknown> {
  try {
    await call
  } catch (rejected) {
    return rejected
  }
  throw new Error('expected the call to reject')
}

describe('error handling', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => consoleError.mockRestore())

  describe('a 304 on a write', () => {
    it('does not reject with the bank credentials from the request', async () => {
      nock(API_URL)
        .post('/items')
        .reply(304)

      const rejected = await rejectionOf(
        newClient().createItem(0, { user: 'dummy-user', password: 'dummy-password' })
      )

      expect(JSON.stringify(rejected) ?? '').not.toContain('dummy-password')
    })

    it('does not reject with the MFA value from the request', async () => {
      nock(API_URL)
        .post('/items/dummy-item/mfa')
        .reply(304)

      const rejected = await rejectionOf(
        newClient().updateItemMFA('dummy-item', { token: 'dummy-mfa' })
      )

      expect(JSON.stringify(rejected) ?? '').not.toContain('dummy-mfa')
    })
  })

  describe('an HTTP error', () => {
    const body = { code: 400, message: 'dummy-body-text', parameters: { token: 'dummy-mfa' } }

    it.each([
      [
        'read',
        (): nock.Interceptor => nock(API_URL).get('/items/dummy-item'),
        (client: PluggyClient): Promise<unknown> => client.fetchItem('dummy-item'),
      ],
      [
        'write',
        (): nock.Interceptor => nock(API_URL).post('/items/dummy-item/mfa'),
        (client: PluggyClient): Promise<unknown> =>
          client.updateItemMFA('dummy-item', { token: 'dummy-mfa' }),
      ],
    ])('on a %s logs the status but not the response body', async (_label, route, call) => {
      route().reply(400, body)

      await rejectionOf(call(newClient()))

      const logged = JSON.stringify(consoleError.mock.calls)
      expect(logged).toContain('400')
      expect(logged).not.toContain('dummy-body-text')
      expect(logged).not.toContain('dummy-mfa')
    })

    it('still rejects with the response body, so callers can read it', async () => {
      nock(API_URL)
        .get('/items/dummy-item')
        .reply(400, body)

      await expect(rejectionOf(newClient().fetchItem('dummy-item'))).resolves.toEqual(body)
    })
  })
})
