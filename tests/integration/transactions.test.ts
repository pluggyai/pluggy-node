import { PluggyClient } from '../../src/client'
import { Item } from '../../src/types'
import {
  createClient,
  createSandboxItem,
  deleteItemSafely,
  describeIntegration,
  INTEGRATION_TIMEOUT_MS,
  retry,
} from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

const oneYearAgo = (): string => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().split('T')[0]
}

describeIntegration('Transactions (integration, cursor-based)', () => {
  let client: PluggyClient
  let item: Item
  let accountId: string

  beforeAll(async () => {
    client = createClient()
    item = await createSandboxItem(client)

    // Transactions can lag behind the item flipping UPDATED by a beat,
    // so the first lookup is retried.
    accountId = await retry(
      async () => {
        const page = await client.fetchAccounts(item.id)
        if (page.results.length === 0) throw new Error('no accounts yet')
        return page.results[0].id
      },
      { attempts: 10, delayMs: 1_000, description: 'fetchAccounts initial' }
    )
  })

  afterAll(async () => {
    if (item) {
      await deleteItemSafely(client, item.id)
    }
  })

  it('fetchTransactionsCursor returns a page with a next cursor or null', async () => {
    const page = await client.fetchTransactionsCursor(accountId, { dateFrom: oneYearAgo() })

    expect(Array.isArray(page.results)).toBe(true)
    expect('next' in page).toBe(true)

    for (const tx of page.results) {
      expect(tx.id).toBeTruthy()
      expect(tx.accountId).toBe(accountId)
      expect(typeof tx.amount).toBe('number')
      expect(tx.date).toBeInstanceOf(Date)
    }
  })

  it('fetchAllTransactions returns the full deduplicated list', async () => {
    const all = await client.fetchAllTransactions(accountId, { dateFrom: oneYearAgo() })

    expect(Array.isArray(all)).toBe(true)
    const uniqueIds = new Set(all.map(t => t.id))
    expect(uniqueIds.size).toBe(all.length)
  })

  it('fetchTransaction returns the same transaction when fetched by id', async () => {
    const page = await client.fetchTransactionsCursor(accountId, { dateFrom: oneYearAgo() })
    if (page.results.length === 0) {
      // Nothing to look up — skip silently. Sandbox sometimes returns 0
      // transactions for a fresh item.
      return
    }
    const tx = page.results[0]
    const fetched = await client.fetchTransaction(tx.id)
    expect(fetched.id).toBe(tx.id)
    expect(fetched.accountId).toBe(tx.accountId)
  })

  it('updateTransactionCategory persists a new category on a transaction', async () => {
    const page = await client.fetchTransactionsCursor(accountId, { dateFrom: oneYearAgo() })
    if (page.results.length === 0) return

    const tx = page.results[0]
    const categories = await client.fetchCategories()
    // Pick any category different from the transaction's current one.
    // Compare against `tx.categoryId` (the id) — `tx.category` is the name.
    const newCategory = categories.results.find(c => c.id !== tx.categoryId)
    if (!newCategory) return

    const updated = await client.updateTransactionCategory(tx.id, newCategory.id)
    expect(updated.id).toBe(tx.id)
    expect(updated.categoryId).toBe(newCategory.id)
  })
})
