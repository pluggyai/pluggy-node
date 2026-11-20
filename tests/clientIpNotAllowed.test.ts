import nock from 'nock'
import { MOCK_API_KEY, setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { ApiErrorResponse, CLIENT_IP_NOT_ALLOWED, isClientIpNotAllowedError } from '../src'

const API_URL = process.env.PLUGGY_API_URL!

const IP_NOT_ALLOWED_BODY = {
  code: 403,
  codeDescription: 'CLIENT_IP_NOT_ALLOWED',
  message:
    'The request IP address is not in the list of allowed IPs configured for this application.',
}

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

/** Answers `method path` with a 403 CLIENT_IP_NOT_ALLOWED as many times as asked, counting calls. */
function replyIpNotAllowed(method: 'get' | 'post', path: string): { calls: number } {
  const counter = { calls: 0 }
  const scope = nock(API_URL).persist()
  const route = method === 'get' ? scope.get(path) : scope.post(path)
  route.reply(() => {
    counter.calls += 1
    return [403, IP_NOT_ALLOWED_BODY]
  })
  return counter
}

describe('a request from an IP outside the application allowlist', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    consoleError.mockRestore()
    nock.cleanAll()
  })

  describe('when POST /auth answers 403', () => {
    it('rejects with the API error body, codeDescription intact, and does not retry', async () => {
      const auth = replyIpNotAllowed('post', '/auth')

      const rejected = await rejectionOf(newClient().fetchItem('dummy-item'))

      expect(rejected).toEqual(IP_NOT_ALLOWED_BODY)
      expect((rejected as ApiErrorResponse).code).toBe(403)
      expect((rejected as ApiErrorResponse).codeDescription).toBe(CLIENT_IP_NOT_ALLOWED)
      expect(isClientIpNotAllowedError(rejected)).toBe(true)
      expect(auth.calls).toBe(1)
    })

    it('rejects the same way on a write, such as creating a connect token', async () => {
      const auth = replyIpNotAllowed('post', '/auth')

      const rejected = await rejectionOf(newClient().createConnectToken())

      expect(isClientIpNotAllowedError(rejected)).toBe(true)
      expect(auth.calls).toBe(1)
    })

    it('does not cache anything, so a later call authenticates again', async () => {
      const client = newClient()
      replyIpNotAllowed('post', '/auth')
      await rejectionOf(client.fetchItem('dummy-item'))

      nock.cleanAll()
      setupAuth()
      nock(API_URL)
        .get('/items/dummy-item')
        .matchHeader('X-API-KEY', MOCK_API_KEY)
        .reply(200, { id: 'dummy-item' })

      await expect(client.fetchItem('dummy-item')).resolves.toEqual({ id: 'dummy-item' })
    })
  })

  describe('when a request made with the API key answers 403', () => {
    beforeEach(() => setupAuth())

    it('rejects a read with the API error body and does not retry', async () => {
      const read = replyIpNotAllowed('get', '/items/dummy-item')

      const rejected = await rejectionOf(newClient().fetchItem('dummy-item'))

      expect(rejected).toEqual(IP_NOT_ALLOWED_BODY)
      expect(isClientIpNotAllowedError(rejected)).toBe(true)
      expect(read.calls).toBe(1)
    })

    it('rejects POST /connect_token with the API error body and does not retry', async () => {
      const write = replyIpNotAllowed('post', '/connect_token')

      const rejected = await rejectionOf(newClient().createConnectToken())

      expect(rejected).toEqual(IP_NOT_ALLOWED_BODY)
      expect(isClientIpNotAllowedError(rejected)).toBe(true)
      expect(write.calls).toBe(1)
    })
  })
})

describe('isClientIpNotAllowedError', () => {
  it.each([
    ['another 403', { code: 403, codeDescription: 'SOMETHING_ELSE', message: 'x' }],
    ['a body without codeDescription', { code: 403, message: 'x' }],
    ['an Error', new Error('CLIENT_IP_NOT_ALLOWED')],
    ['a string', 'CLIENT_IP_NOT_ALLOWED'],
    ['null', null],
    ['undefined', undefined],
  ])('is false for %s', (_label, value) => {
    expect(isClientIpNotAllowedError(value)).toBe(false)
  })
})
