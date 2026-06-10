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

describeIntegration('Identity (integration)', () => {
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

  it('fetchIdentityByItemId returns the identity record', async () => {
    const identity = await client.fetchIdentityByItemId(item.id)

    expect(identity.id).toBeTruthy()
    // PF (individual) or PJ (legal entity) — at least one identifier
    // must be present.
    expect(identity.document || identity.fullName).toBeTruthy()
  })

  it('fetchIdentity returns the same record when fetched by id', async () => {
    const byItem = await client.fetchIdentityByItemId(item.id)
    const byId = await client.fetchIdentity(byItem.id)

    expect(byId.id).toBe(byItem.id)
  })
})
