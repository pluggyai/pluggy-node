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

describeIntegration('Loans (integration)', () => {
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

  it('fetchLoans returns a well-formed page', async () => {
    const page = await client.fetchLoans(item.id)
    expect(Array.isArray(page.results)).toBe(true)

    for (const loan of page.results) {
      expect(loan.id).toBeTruthy()
      expect(loan.itemId).toBe(item.id)
    }
  })

  it('fetchLoan returns the same record when fetched by id', async () => {
    const page = await client.fetchLoans(item.id)
    if (page.results.length === 0) return

    const first = page.results[0]
    const fetched = await client.fetchLoan(first.id)
    expect(fetched.id).toBe(first.id)
    expect(fetched.itemId).toBe(first.itemId)
  })
})
