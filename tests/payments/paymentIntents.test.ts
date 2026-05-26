import { PaymentIntent, CreatePaymentIntent, PageResponse } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — payment intents', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentIntent POSTs payments/intents with payload', async () => {
    const payload = mockAs<CreatePaymentIntent>({ paymentRequestId: 'req-1' })
    const mock = nock(API_URL)
      .post('/payments/intents', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentIntent>({ id: 'intent-1' }))

    const client = createPaymentsClient()
    const result = await client.createPaymentIntent(payload)

    expect(result.id).toBe('intent-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentIntent GETs payments/intents/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/intents/intent-1')
      .reply(200, mockAs<PaymentIntent>({ id: 'intent-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchPaymentIntent('intent-1')

    expect(result.id).toBe('intent-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentIntents GETs payments/intents with filters', async () => {
    const page: PageResponse<PaymentIntent> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [mockAs<PaymentIntent>({ id: 'intent-1' })],
    }
    const mock = nock(API_URL)
      .get('/payments/intents')
      .query({ page: '1', pageSize: '20' })
      .reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchPaymentIntents({ page: 1, pageSize: 20 })

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBe(true)
  })
})
