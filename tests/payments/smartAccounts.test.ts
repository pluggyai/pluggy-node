import {
  SmartAccount,
  SmartAccountBalance,
  CreateSmartAccount,
  PageResponse,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — smart accounts', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createSmartAccount POSTs payments/smart-accounts with payload', async () => {
    const payload = mockAs<CreateSmartAccount>({ name: 'sa' })
    const mock = nock(API_URL)
      .post('/payments/smart-accounts', payload as Record<string, unknown>)
      .reply(200, mockAs<SmartAccount>({ id: 'sa-1' }))

    const client = createPaymentsClient()
    const result = await client.createSmartAccount(payload)

    expect(result.id).toBe('sa-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchSmartAccount GETs payments/smart-accounts/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/smart-accounts/sa-1')
      .reply(200, mockAs<SmartAccount>({ id: 'sa-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchSmartAccount('sa-1')

    expect(result.id).toBe('sa-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchSmartAccountBalance GETs payments/smart-accounts/:id/balance', async () => {
    const mock = nock(API_URL)
      .get('/payments/smart-accounts/sa-1/balance')
      .reply(200, mockAs<SmartAccountBalance>({ amount: 12345 }))

    const client = createPaymentsClient()
    const result = await client.fetchSmartAccountBalance('sa-1')

    expect(result).toEqual(expect.objectContaining({ amount: 12345 }))
    expect(mock.isDone()).toBe(true)
  })

  it('fetchSmartAccounts GETs payments/smart-accounts', async () => {
    const page: PageResponse<SmartAccount> = {
      page: 1,
      total: 0,
      totalPages: 0,
      results: [],
    }
    const mock = nock(API_URL).get('/payments/smart-accounts').reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchSmartAccounts()

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })
})
