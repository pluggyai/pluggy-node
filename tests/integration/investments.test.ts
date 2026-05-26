import { PluggyClient } from '../../src/client'
import { Item } from '../../src/types'
import {
  createClient,
  createSandboxItem,
  deleteItemSafely,
  describeIntegration,
  INTEGRATION_TIMEOUT_MS,
} from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Investments (integration)', () => {
  let client: PluggyClient
  let item: Item

  beforeAll(async () => {
    client = createClient()
    item = await createSandboxItem(client)
  })

  afterAll(async () => {
    if (item) {
      await deleteItemSafely(client, item.id)
    }
  })

  it('fetchInvestments returns investments tied to the item', async () => {
    const page = await client.fetchInvestments(item.id)
    expect(Array.isArray(page.results)).toBe(true)

    for (const investment of page.results) {
      expect(investment.id).toBeTruthy()
      expect(investment.itemId).toBe(item.id)
      expect(typeof investment.balance).toBe('number')
    }
  })

  it('fetchInvestment returns the same investment when fetched by id', async () => {
    const page = await client.fetchInvestments(item.id)
    if (page.results.length === 0) return

    const first = page.results[0]
    const fetched = await client.fetchInvestment(first.id)
    expect(fetched.id).toBe(first.id)
    expect(fetched.itemId).toBe(first.itemId)
  })

  it('fetchAllInvestmentTransactions paginates without duplicates', async () => {
    const page = await client.fetchInvestments(item.id)
    if (page.results.length === 0) return

    const first = page.results[0]
    const txs = await client.fetchAllInvestmentTransactions(first.id)
    expect(Array.isArray(txs)).toBe(true)
    const uniqueIds = new Set(txs.map(t => t.id))
    expect(uniqueIds.size).toBe(txs.length)
  })
})
