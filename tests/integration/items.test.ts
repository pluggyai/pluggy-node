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

describeIntegration('Items (integration)', () => {
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

  it('fetchItem returns the created item with UPDATED status', async () => {
    const fetched = await client.fetchItem(item.id)

    expect(fetched.id).toBe(item.id)
    expect(fetched.connector.id).toBe(item.connector.id)
    expect(fetched.status).toBe('UPDATED')
    expect(fetched.createdAt).toBeInstanceOf(Date)
    expect(fetched.updatedAt).toBeInstanceOf(Date)
  })
})
