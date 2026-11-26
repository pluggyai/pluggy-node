import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'

const INVESTMENT_ID = 'investment-abc'
const API_URL = process.env.PLUGGY_API_URL!

describe('fetchInvestmentTransactions', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('sends the investment id only in the path', async () => {
    let query: Record<string, string> = {}
    const mock = nock(API_URL)
      .get(`/investments/${INVESTMENT_ID}/transactions`)
      .query((actual) => {
        query = actual as Record<string, string>
        return true
      })
      .reply(200, { results: [], total: 0, totalPages: 1, page: 1 })

    const client = new PluggyClient({ clientId: 'id', clientSecret: 'secret' })
    await client.fetchInvestmentTransactions(INVESTMENT_ID, { pageSize: 500 })

    expect(mock.isDone()).toBe(true)
    expect(query).toEqual({ pageSize: '500' })
  })
})
