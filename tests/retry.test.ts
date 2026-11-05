import nock from 'nock'
import { MOCK_API_KEY, setupAuth } from './utils'
import { PluggyClient } from '../src/client'

const API_URL = process.env.PLUGGY_API_URL!
const CONNECTION_RESET = Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' })
const TIMED_OUT = Object.assign(new Error('Timeout awaiting request'), { code: 'ETIMEDOUT' })

const newClient = (): PluggyClient =>
  new PluggyClient({ clientId: 'dummy-id', clientSecret: 'dummy-secret' })

describe('retries after a network error', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
  })

  describe('on writes, where the API may already have processed the request', () => {
    beforeEach(() => setupAuth())

    const payment = { preauthorizationId: 'dummy-pre', recipientId: 'dummy-rcp', amount: 1 }

    it.each([
      [
        'POST',
        CONNECTION_RESET,
        (): nock.Interceptor => nock(API_URL).post('/smart-transfers/payments'),
        (client: PluggyClient): Promise<unknown> =>
          client.payments.createSmartTransferPayment(payment),
      ],
      [
        'POST',
        TIMED_OUT,
        (): nock.Interceptor => nock(API_URL).post('/smart-transfers/payments'),
        (client: PluggyClient): Promise<unknown> =>
          client.payments.createSmartTransferPayment(payment),
      ],
      [
        'PATCH',
        CONNECTION_RESET,
        (): nock.Interceptor => nock(API_URL).patch('/items/dummy-item'),
        (client: PluggyClient): Promise<unknown> => client.updateItem('dummy-item'),
      ],
      [
        'DELETE',
        CONNECTION_RESET,
        (): nock.Interceptor => nock(API_URL).delete('/items/dummy-item'),
        (client: PluggyClient): Promise<unknown> => client.deleteItem('dummy-item'),
      ],
    ])(
      'rejects a %s after a network error without sending it again',
      async (_method, error, route, call) => {
        route().replyWithError(error)
        const secondSend = route().reply(200, { id: 'second-send' })

        await expect(call(newClient())).rejects.toMatchObject({ code: error.code })

        expect(secondSend.isDone()).toBe(false)
      }
    )
  })

  it('still retries a GET', async () => {
    setupAuth()
    nock(API_URL)
      .get('/items/dummy-item')
      .replyWithError(CONNECTION_RESET)
    nock(API_URL)
      .get('/items/dummy-item')
      .reply(200, { id: 'dummy-item' })

    await expect(newClient().fetchItem('dummy-item')).resolves.toEqual({ id: 'dummy-item' })
  })

  it('still retries the token exchange, which only mints a key', async () => {
    nock(API_URL)
      .post('/auth')
      .replyWithError(CONNECTION_RESET)
    nock(API_URL)
      .post('/auth')
      .reply(200, { apiKey: MOCK_API_KEY })
    nock(API_URL)
      .get('/items/dummy-item')
      .reply(200, { id: 'dummy-item' })

    await expect(newClient().fetchItem('dummy-item')).resolves.toEqual({ id: 'dummy-item' })
  })
})
