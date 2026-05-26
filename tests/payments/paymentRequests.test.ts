import { PaymentRequest, CreatePaymentRequest, PageResponse } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — payment requests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentRequest POSTs payments/requests with payload', async () => {
    const payload = mockAs<CreatePaymentRequest>({ amount: 1000, description: 'Test payment' })
    const response = mockAs<PaymentRequest>({ id: 'req-1', amount: 1000, status: 'CREATED' })

    const mock = nock(API_URL)
      .post('/payments/requests', payload as Record<string, unknown>)
      .reply(200, response)

    const client = createPaymentsClient()
    const result = await client.createPaymentRequest(payload)

    expect(result.id).toBe('req-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentRequest GETs payments/requests/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/requests/req-1')
      .reply(200, mockAs<PaymentRequest>({ id: 'req-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchPaymentRequest('req-1')

    expect(result.id).toBe('req-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentRequests GETs payments/requests and forwards filters', async () => {
    const page: PageResponse<PaymentRequest> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [mockAs<PaymentRequest>({ id: 'req-1' })],
    }
    const mock = nock(API_URL)
      .get('/payments/requests')
      .query({ page: '2', pageSize: '50' })
      .reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchPaymentRequests({ page: 2, pageSize: 50 })

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBe(true)
  })

  it('deletePaymentRequest DELETEs payments/requests/:id', async () => {
    const mock = nock(API_URL).delete('/payments/requests/req-1').reply(200, {})

    const client = createPaymentsClient()
    await client.deletePaymentRequest('req-1')

    expect(mock.isDone()).toBe(true)
  })
})
