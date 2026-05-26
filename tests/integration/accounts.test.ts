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

describeIntegration('Accounts (integration)', () => {
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

  it('fetchAccounts returns accounts linked to the item', async () => {
    const page = await client.fetchAccounts(item.id)

    expect(page.results.length).toBeGreaterThan(0)
    for (const account of page.results) {
      expect(account.id).toBeTruthy()
      expect(account.itemId).toBe(item.id)
      expect(typeof account.balance).toBe('number')
      expect(account.type).toBeTruthy()
      expect(account.currencyCode).toBeTruthy()
    }
  })

  it('fetchAccount returns the same account when fetched by id', async () => {
    const page = await client.fetchAccounts(item.id)
    const first = page.results[0]

    const fetched = await client.fetchAccount(first.id)
    expect(fetched.id).toBe(first.id)
    expect(fetched.itemId).toBe(first.itemId)
    expect(fetched.type).toBe(first.type)
  })

  it('fetchAccountStatements does not throw for a valid account', async () => {
    const page = await client.fetchAccounts(item.id)
    const first = page.results[0]

    // Sandbox may not produce statements; we only verify the call succeeds
    // and returns a well-formed page response.
    const statements = await client.fetchAccountStatements(first.id)
    expect(Array.isArray(statements.results)).toBe(true)
  })
})
