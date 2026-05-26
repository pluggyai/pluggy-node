import { PluggyClient } from '../../src/client'
import { createClient, describeIntegration, INTEGRATION_TIMEOUT_MS, TEST_TAG } from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Webhooks (integration)', () => {
  let client: PluggyClient

  beforeAll(() => {
    client = createClient()
  })

  it('supports the full CRUD lifecycle', async () => {
    const createUrl = `https://example.com/webhooks/${TEST_TAG}`
    const updateUrl = `https://example.com/webhooks/${TEST_TAG}-updated`

    const created = await client.createWebhook('item/updated', createUrl)
    expect(created.id).toBeTruthy()
    expect(created.url).toBe(createUrl)
    expect(created.event).toBe('item/updated')

    try {
      const list = await client.fetchWebhooks()
      expect(list.results.some(w => w.id === created.id)).toBe(true)

      const fetched = await client.fetchWebhook(created.id)
      expect(fetched.id).toBe(created.id)
      expect(fetched.url).toBe(createUrl)

      const updated = await client.updateWebhook(created.id, {
        url: updateUrl,
        event: 'all',
      })
      expect(updated.id).toBe(created.id)
      expect(updated.url).toBe(updateUrl)
      expect(updated.event).toBe('all')
    } finally {
      await client.deleteWebhook(created.id)
    }
  })
})
