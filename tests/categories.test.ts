import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'

const API_URL = process.env.PLUGGY_API_URL!

describe('ids that would reach another route under the same prefix', () => {
  const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
  })

  it('fetchCategory GETs categories/<id> for a numeric id', async () => {
    const mock = nock(API_URL)
      .get('/categories/01000000')
      .reply(200, { id: '01000000', description: 'Income' })

    const category = await client.fetchCategory('01000000')

    expect(category.id).toBe('01000000')
    expect(mock.isDone()).toBeTruthy()
  })

  it.each(['rules', 'rules ', '', 'abc', '0100000a', '-1', '1.5'])(
    'fetchCategory refuses %p without sending a request',
    async id => {
      const mock = nock(API_URL)
        .get(/.*/)
        .reply(200, {})

      await expect(client.fetchCategory(id)).rejects.toThrow('Invalid resource id')
      expect(mock.isDone()).toBeFalsy()
    }
  )

  it('fetchConnector refuses a non-numeric id such as "unavailable"', async () => {
    const mock = nock(API_URL)
      .get(/.*/)
      .reply(200, {})

    await expect(
      client.fetchConnector(('unavailable' as unknown) as number)
    ).rejects.toThrow('Invalid resource id')
    expect(mock.isDone()).toBeFalsy()
  })

  it('validateParameters refuses a non-numeric connector id', async () => {
    const mock = nock(API_URL)
      .post(/.*/)
      .reply(200, {})

    await expect(
      client.validateParameters(('unavailable' as unknown) as number, {})
    ).rejects.toThrow('Invalid resource id')
    expect(mock.isDone()).toBeFalsy()
  })

  it.each(['fetchPaymentRecipient', 'deletePaymentRecipient'] as const)(
    '%s refuses the reserved "institutions" segment',
    async method => {
      const mock = nock(API_URL)
        .intercept(/.*/, method === 'deletePaymentRecipient' ? 'DELETE' : 'GET')
        .reply(200, {})

      await expect(client.payments[method]('institutions')).rejects.toThrow(
        'Invalid resource id'
      )
      expect(mock.isDone()).toBeFalsy()
    }
  )
})
