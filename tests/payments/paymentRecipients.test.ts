import {
  PaymentRecipient,
  CreatePaymentRecipient,
  UpdatePaymentRecipient,
  PageResponse,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — payment recipients', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentRecipient POSTs payments/recipients with payload', async () => {
    const payload = mockAs<CreatePaymentRecipient>({ name: 'Recipient' })
    const mock = nock(API_URL)
      .post('/payments/recipients', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentRecipient>({ id: 'rcp-1' }))

    const client = createPaymentsClient()
    const result = await client.createPaymentRecipient(payload)

    expect(result.id).toBe('rcp-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentRecipient GETs payments/recipients/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/recipients/rcp-1')
      .reply(200, mockAs<PaymentRecipient>({ id: 'rcp-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchPaymentRecipient('rcp-1')

    expect(result.id).toBe('rcp-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentRecipients GETs payments/recipients', async () => {
    const page: PageResponse<PaymentRecipient> = {
      page: 1,
      total: 0,
      totalPages: 0,
      results: [],
    }
    const mock = nock(API_URL).get('/payments/recipients').reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchPaymentRecipients()

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })

  it('updatePaymentRecipient PATCHes payments/recipients/:id', async () => {
    const payload = mockAs<UpdatePaymentRecipient>({ name: 'New name' })
    const mock = nock(API_URL)
      .patch('/payments/recipients/rcp-1', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentRecipient>({ id: 'rcp-1' }))

    const client = createPaymentsClient()
    const result = await client.updatePaymentRecipient('rcp-1', payload)

    expect(result.id).toBe('rcp-1')
    expect(mock.isDone()).toBe(true)
  })

  it('deletePaymentRecipient DELETEs payments/recipients/:id', async () => {
    const mock = nock(API_URL).delete('/payments/recipients/rcp-1').reply(200, {})

    const client = createPaymentsClient()
    await client.deletePaymentRecipient('rcp-1')

    expect(mock.isDone()).toBe(true)
  })
})
