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

describeIntegration('Consents (integration)', () => {
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

  it('fetchConsents returns a well-formed page', async () => {
    const page = await client.fetchConsents(item.id)
    expect(Array.isArray(page.results)).toBe(true)

    for (const consent of page.results) {
      expect(consent.id).toBeTruthy()
    }
  })

  it('fetchConsent returns the same record when fetched by id', async () => {
    const page = await client.fetchConsents(item.id)
    if (page.results.length === 0) return

    const first = page.results[0]
    const fetched = await client.fetchConsent(first.id)
    expect(fetched.id).toBe(first.id)
  })
})
