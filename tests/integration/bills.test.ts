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

describeIntegration('Credit card bills (integration)', () => {
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

  it('fetchCreditCardBills returns bills for a credit card account if any exist', async () => {
    const accounts = await client.fetchAccounts(item.id)
    const creditCard = accounts.results.find(a => a.type === 'CREDIT')
    if (!creditCard) {
      // Sandbox returns a credit card account in some configurations but
      // not all. If absent, skip silently rather than fail — coverage of
      // the endpoint shape happens whenever a CREDIT account is present.
      return
    }

    const bills = await client.fetchCreditCardBills(creditCard.id)
    expect(Array.isArray(bills.results)).toBe(true)
    for (const bill of bills.results) {
      expect(bill.id).toBeTruthy()
    }
  })

  it('fetchCreditCardBill returns the same bill when fetched by id', async () => {
    const accounts = await client.fetchAccounts(item.id)
    const creditCard = accounts.results.find(a => a.type === 'CREDIT')
    if (!creditCard) return

    const bills = await client.fetchCreditCardBills(creditCard.id)
    if (bills.results.length === 0) return

    const first = bills.results[0]
    const fetched = await client.fetchCreditCardBill(first.id)
    expect(fetched.id).toBe(first.id)
  })
})
