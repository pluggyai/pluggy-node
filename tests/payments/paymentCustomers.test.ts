import {
  PaymentCustomer,
  CreatePaymentCustomer,
  PageResponse,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — payment customers', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentCustomer POSTs payments/customers with payload', async () => {
    const payload = mockAs<CreatePaymentCustomer>({ name: 'John', email: 'j@example.com' })
    const mock = nock(API_URL)
      .post('/payments/customers', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentCustomer>({ id: 'cust-1' }))

    const client = createPaymentsClient()
    const result = await client.createPaymentCustomer(payload)

    expect(result.id).toBe('cust-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentCustomer GETs payments/customers/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/customers/cust-1')
      .reply(200, mockAs<PaymentCustomer>({ id: 'cust-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchPaymentCustomer('cust-1')

    expect(result.id).toBe('cust-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentCustomers GETs payments/customers', async () => {
    const page: PageResponse<PaymentCustomer> = {
      page: 1,
      total: 0,
      totalPages: 0,
      results: [],
    }
    const mock = nock(API_URL).get('/payments/customers').reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchPaymentCustomers()

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })

  it('updatePaymentCustomer PATCHes payments/customers/:id with payload', async () => {
    const payload: Partial<CreatePaymentCustomer> = mockAs({ name: 'Jane' })
    const mock = nock(API_URL)
      .patch('/payments/customers/cust-1', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentCustomer>({ id: 'cust-1' }))

    const client = createPaymentsClient()
    const result = await client.updatePaymentCustomer('cust-1', payload)

    expect(result.id).toBe('cust-1')
    expect(mock.isDone()).toBe(true)
  })

  it('deletePaymentCustomer DELETEs payments/customers/:id', async () => {
    const mock = nock(API_URL).delete('/payments/customers/cust-1').reply(200, {})

    const client = createPaymentsClient()
    await client.deletePaymentCustomer('cust-1')

    expect(mock.isDone()).toBe(true)
  })
})
