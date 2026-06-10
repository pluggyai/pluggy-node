import { PaymentInstitution, PageResponse } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — payment institutions', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('fetchPaymentInstitution GETs payments/recipients/institutions/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/recipients/institutions/inst-1')
      .reply(200, mockAs<PaymentInstitution>({ id: 'inst-1', name: 'Bank' }))

    const client = createPaymentsClient()
    const result = await client.fetchPaymentInstitution('inst-1')

    expect(result.id).toBe('inst-1')
    expect(result.name).toBe('Bank')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentInstitutions GETs payments/recipients/institutions and forwards name filter', async () => {
    const page: PageResponse<PaymentInstitution> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [mockAs<PaymentInstitution>({ id: 'inst-1', name: 'Itaú' })],
    }
    const mock = nock(API_URL)
      .get('/payments/recipients/institutions')
      .query({ name: 'Itaú' })
      .reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchPaymentInstitutions({ name: 'Itaú' })

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBe(true)
  })
})
