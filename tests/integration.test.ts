/**
 * Integration tests that validate SDK endpoints against Pluggy's sandbox environment.
 * These tests create a real sandbox item, validate all endpoints, and clean up.
 *
 * Required environment variables:
 * - PLUGGY_CLIENT_ID: Your Pluggy API client ID
 * - PLUGGY_CLIENT_SECRET: Your Pluggy API client secret
 *
 * Run with: npm run test:integration
 */

import { PluggyClient } from '../src/client'
import { Item, ItemStatus } from '../src/types'

// Skip these tests if credentials are not provided
const runIntegrationTests = process.env.PLUGGY_CLIENT_ID && process.env.PLUGGY_CLIENT_SECRET

const describeIf = runIntegrationTests ? describe : describe.skip

// Pluggy Sandbox connector ID (Pluggy Bank)
const SANDBOX_CONNECTOR_ID = 0

// Sandbox credentials
const SANDBOX_USER = 'user-ok'
const SANDBOX_PASSWORD = 'password-ok'

// Increase timeout for integration tests
jest.setTimeout(300000) // 5 minutes

describeIf('Integration Tests', () => {
  let client: PluggyClient
  let item: Item | null = null

  beforeAll(async () => {
    client = new PluggyClient({
      clientId: process.env.PLUGGY_CLIENT_ID!,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
    })

    console.log('Creating sandbox item...')

    // Create item
    item = await client.createItem(SANDBOX_CONNECTOR_ID, {
      user: SANDBOX_USER,
      password: SANDBOX_PASSWORD,
    })

    console.log(`Item created with ID: ${item.id}`)

    // Wait for item to finish syncing
    const maxWaitTime = 5 * 60 * 1000 // 5 minutes
    const startTime = Date.now()

    while (item.status !== 'UPDATED' && item.status !== 'LOGIN_ERROR') {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error('Item sync timed out after 5 minutes')
      }

      await new Promise(resolve => setTimeout(resolve, 3000))
      item = await client.fetchItem(item.id)
      console.log(`Item status: ${item.status}`)
    }

    if (item.status !== 'UPDATED') {
      throw new Error(`Item sync failed with status: ${item.status}`)
    }

    console.log('Item sync completed successfully')
  })

  afterAll(async () => {
    if (item) {
      console.log(`Cleaning up - deleting item ${item.id}`)
      await client.deleteItem(item.id)
      console.log('Item deleted successfully')
    }
  })

  describe('Connectors', () => {
    it('fetchConnectors returns connectors', async () => {
      const connectors = await client.fetchConnectors({ sandbox: true })

      expect(connectors).toBeDefined()
      expect(connectors.results.length).toBeGreaterThan(0)
      console.log(`Found ${connectors.total} sandbox connectors`)
    })

    it('fetchConnector returns sandbox connector', async () => {
      const connector = await client.fetchConnector(SANDBOX_CONNECTOR_ID)

      expect(connector).toBeDefined()
      expect(connector.isSandbox).toBe(true)
      console.log(`Connector: ${connector.name}`)
    })
  })

  describe('Items', () => {
    it('fetchItem returns the created item', async () => {
      expect(item).not.toBeNull()

      const fetchedItem = await client.fetchItem(item!.id)

      expect(fetchedItem).toBeDefined()
      expect(fetchedItem.id).toBe(item!.id)
      expect(fetchedItem.status).toBe('UPDATED')
      console.log(`Item fetched: ${fetchedItem.id}, Status: ${fetchedItem.status}`)
    })
  })

  describe('Accounts', () => {
    it('fetchAccounts returns accounts', async () => {
      expect(item).not.toBeNull()

      const accounts = await client.fetchAccounts(item!.id)

      expect(accounts).toBeDefined()
      expect(accounts.results.length).toBeGreaterThan(0)

      for (const account of accounts.results) {
        console.log(`Account: ${account.id}, Number: ${account.number}, Balance: ${account.balance}`)

        // Verify we can fetch individual account
        const fetchedAccount = await client.fetchAccount(account.id)
        expect(fetchedAccount).toBeDefined()
        expect(fetchedAccount.id).toBe(account.id)
      }
    })
  })

  describe('Transactions', () => {
    it('fetchTransactions returns transactions', async () => {
      expect(item).not.toBeNull()

      const accounts = await client.fetchAccounts(item!.id)
      expect(accounts.results.length).toBeGreaterThan(0)

      const account = accounts.results[0]
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const transactions = await client.fetchTransactions(account.id, {
        from: oneYearAgo.toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
      })

      expect(transactions).toBeDefined()
      console.log(`Found ${transactions.total} transactions for account ${account.id}`)

      if (transactions.results.length > 0) {
        const tx = transactions.results[0]
        console.log(`Transaction: ${tx.id}, Date: ${tx.date}, Amount: ${tx.amount}`)

        // Verify we can fetch individual transaction
        const fetchedTx = await client.fetchTransaction(tx.id)
        expect(fetchedTx).toBeDefined()
        expect(fetchedTx.id).toBe(tx.id)
      }
    })
  })

  describe('Investments', () => {
    it('fetchInvestments returns investments', async () => {
      expect(item).not.toBeNull()

      const investments = await client.fetchInvestments(item!.id)

      expect(investments).toBeDefined()
      console.log(`Found ${investments.total} investments`)

      for (const investment of investments.results) {
        console.log(`Investment: ${investment.id}, Name: ${investment.name}, Balance: ${investment.balance}`)

        // Verify we can fetch individual investment
        const fetchedInvestment = await client.fetchInvestment(investment.id)
        expect(fetchedInvestment).toBeDefined()
        expect(fetchedInvestment.id).toBe(investment.id)

        // Fetch investment transactions
        const investmentTxs = await client.fetchInvestmentTransactions(investment.id)
        console.log(`  Investment transactions: ${investmentTxs.total}`)
      }
    })
  })

  describe('Identity', () => {
    it('fetchIdentityByItemId returns identity', async () => {
      expect(item).not.toBeNull()

      const identity = await client.fetchIdentityByItemId(item!.id)

      expect(identity).toBeDefined()
      console.log(`Identity: ${identity.fullName}, Document: ${identity.document}`)

      // Verify we can fetch by identity ID
      const fetchedIdentity = await client.fetchIdentity(identity.id)
      expect(fetchedIdentity).toBeDefined()
      expect(fetchedIdentity.id).toBe(identity.id)
    })
  })

  describe('Consents', () => {
    it('fetchConsents returns consents', async () => {
      expect(item).not.toBeNull()

      const consents = await client.fetchConsents(item!.id)

      expect(consents).toBeDefined()
      console.log(`Found ${consents.total} consents for item`)

      for (const consent of consents.results) {
        console.log(`Consent: ${consent.id}, Created: ${consent.createdAt}, Expires: ${consent.expiresAt}`)
      }
    })
  })

  describe('Loans', () => {
    it('fetchLoans returns loans', async () => {
      expect(item).not.toBeNull()

      const loans = await client.fetchLoans(item!.id)

      expect(loans).toBeDefined()
      console.log(`Found ${loans.total} loans for item`)

      for (const loan of loans.results) {
        console.log(`Loan: ${loan.id}, Product: ${loan.productName}, Amount: ${loan.contractAmount}`)
      }
    })
  })

  describe('Categories', () => {
    it('fetchCategories returns categories', async () => {
      const categories = await client.fetchCategories()

      expect(categories).toBeDefined()
      expect(categories.results.length).toBeGreaterThan(0)
      console.log(`Found ${categories.total} categories`)

      const category = categories.results[0]
      const fetchedCategory = await client.fetchCategory(category.id)
      expect(fetchedCategory).toBeDefined()
      expect(fetchedCategory.id).toBe(category.id)
    })
  })

  describe('Connect Token', () => {
    it('createConnectToken returns token', async () => {
      const response = await client.createConnectToken(undefined, { clientUserId: 'integration-test' })

      expect(response).toBeDefined()
      expect(response.accessToken).toBeDefined()
      expect(response.accessToken.length).toBeGreaterThan(0)
      console.log(`Connect token created successfully (length: ${response.accessToken.length})`)
    })
  })

  describe('Webhooks', () => {
    it('webhook operations work correctly', async () => {
      // Create webhook
      const webhook = await client.createWebhook(
        'item/updated',
        'https://example.com/webhook-test'
      )

      expect(webhook).toBeDefined()
      console.log(`Webhook created: ${webhook.id}`)

      try {
        // Fetch webhooks
        const webhooks = await client.fetchWebhooks()
        expect(webhooks).toBeDefined()
        expect(webhooks.results.some(w => w.id === webhook.id)).toBe(true)

        // Fetch single webhook
        const fetchedWebhook = await client.fetchWebhook(webhook.id)
        expect(fetchedWebhook).toBeDefined()
        expect(fetchedWebhook.id).toBe(webhook.id)

        // Update webhook
        const updatedWebhook = await client.updateWebhook(webhook.id, {
          url: 'https://example.com/webhook-test-updated',
          event: 'all',
        })
        expect(updatedWebhook).toBeDefined()
      } finally {
        // Clean up - delete webhook
        await client.deleteWebhook(webhook.id)
        console.log(`Webhook deleted: ${webhook.id}`)
      }
    })
  })
})
