import { BulkPayment, CreateBulkPaymentFields, PageResponse } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — bulk payments', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createBulkPayment POSTs payments/bulk with payload', async () => {
    const payload = mockAs<CreateBulkPaymentFields>({ smartAccountId: 'sa-1', payments: [] })
    const mock = nock(API_URL)
      .post('/payments/bulk', payload as Record<string, unknown>)
      .reply(200, mockAs<BulkPayment>({ id: 'bulk-1' }))

    const client = createPaymentsClient()
    const result = await client.createBulkPayment(payload)

    expect(result.id).toBe('bulk-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchBulkPayment GETs payments/bulk/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/bulk/bulk-1')
      .reply(200, mockAs<BulkPayment>({ id: 'bulk-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchBulkPayment('bulk-1')

    expect(result.id).toBe('bulk-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchBulkPayments GETs payments/bulk', async () => {
    const page: PageResponse<BulkPayment> = {
      page: 1,
      total: 0,
      totalPages: 0,
      results: [],
    }
    const mock = nock(API_URL).get('/payments/bulk').reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchBulkPayments()

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })

  it('deleteBulkPayment DELETEs payments/bulk/:id', async () => {
    const mock = nock(API_URL).delete('/payments/bulk/bulk-1').reply(200, {})

    const client = createPaymentsClient()
    await client.deleteBulkPayment('bulk-1')

    expect(mock.isDone()).toBe(true)
  })
})
