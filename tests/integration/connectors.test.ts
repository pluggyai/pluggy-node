import { PluggyClient } from '../../src/client'
import {
  createClient,
  describeIntegration,
  INTEGRATION_TIMEOUT_MS,
  SANDBOX_CONNECTOR_ID,
  SANDBOX_CREDENTIALS,
} from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Connectors (integration)', () => {
  let client: PluggyClient

  beforeAll(() => {
    client = createClient()
  })

  describe('fetchConnectors', () => {
    it('returns the sandbox connector when filtered by sandbox=true', async () => {
      const page = await client.fetchConnectors({ sandbox: true })

      expect(page.results.length).toBeGreaterThan(0)
      const sandbox = page.results.find(c => c.id === SANDBOX_CONNECTOR_ID)
      expect(sandbox).toBeDefined()
      expect(sandbox!.isSandbox).toBe(true)
    })

    it('returns at least one production connector when sandbox filter omitted', async () => {
      const page = await client.fetchConnectors()
      expect(page.results.length).toBeGreaterThan(0)
      // Without the filter we should see real connectors (isSandbox=false).
      expect(page.results.some(c => c.isSandbox === false)).toBe(true)
    })
  })

  describe('fetchConnector', () => {
    it('returns the sandbox connector with the expected shape', async () => {
      const connector = await client.fetchConnector(SANDBOX_CONNECTOR_ID)

      expect(connector.id).toBe(SANDBOX_CONNECTOR_ID)
      expect(connector.isSandbox).toBe(true)
      expect(typeof connector.name).toBe('string')
      expect(connector.name.length).toBeGreaterThan(0)
      expect(Array.isArray(connector.credentials)).toBe(true)
    })
  })

  describe('validateParameters', () => {
    it('accepts valid sandbox credentials', async () => {
      const result = await client.validateParameters(SANDBOX_CONNECTOR_ID, SANDBOX_CREDENTIALS)
      expect(Array.isArray(result.errors)).toBe(true)
      expect(result.errors).toEqual([])
    })
  })
})
