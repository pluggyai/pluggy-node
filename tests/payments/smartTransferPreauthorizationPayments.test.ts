import { PageResponse, SmartTransferPayment } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — smart transfer preauthorization payments', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('fetchSmartTransferPreauthorizationPayments GETs smart-transfers/preauthorizations/:id/payments', async () => {
    const page: PageResponse<SmartTransferPayment> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [mockAs<SmartTransferPayment>({ id: 'pay-1', preauthorizationId: 'pre-1' })],
    }
    const mock = nock(API_URL)
      .get('/smart-transfers/preauthorizations/pre-1/payments')
      .reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchSmartTransferPreauthorizationPayments('pre-1')

    expect(result).toEqual(page)
    expect(mock.isDone()).toBe(true)
  })

  it('passes from, to, page and pageSize as query params', async () => {
    const mock = nock(API_URL)
      .get('/smart-transfers/preauthorizations/pre-1/payments')
      .query({ from: '2026-01-01', to: '2026-12-31', page: '2', pageSize: '50' })
      .reply(200, { page: 2, total: 0, totalPages: 0, results: [] })

    const client = createPaymentsClient()
    const result = await client.fetchSmartTransferPreauthorizationPayments('pre-1', {
      from: '2026-01-01',
      to: '2026-12-31',
      page: 2,
      pageSize: 50,
    })

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })
})
