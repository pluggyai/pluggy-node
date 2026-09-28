import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { ItemResource, PageResponse } from '../src/types'

const ITEM_ID = 'item-abc'
const API_URL = process.env.PLUGGY_API_URL!

const resourcesPage: PageResponse<ItemResource> = {
  page: 1,
  total: 3,
  totalPages: 1,
  results: [
    { resourceId: 'resource-1', type: 'ACCOUNT', status: 'AVAILABLE' },
    { resourceId: 'resource-2', type: 'CREDIT_CARD_ACCOUNT', status: 'PENDING_AUTHORISATION' },
    // Not one of the documented types: the SDK must pass it through untouched.
    { resourceId: 'resource-3', type: 'SOME_NEW_TYPE', status: 'UNAVAILABLE' },
  ],
}

describe('fetchItem resource fields', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('deserializes resourcesCollectedAt into a Date', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}`)
      .reply(200, {
        id: ITEM_ID,
        resourcesCollectedAt: '2026-09-01T12:00:00.000Z',
        hasResourcesPendingAuthorization: true,
      })

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const item = await client.fetchItem(ITEM_ID)

    expect(item.resourcesCollectedAt).toEqual(new Date('2026-09-01T12:00:00.000Z'))
    expect(item.hasResourcesPendingAuthorization).toBe(true)
    expect(mock.isDone()).toBeTruthy()
  })

  it('keeps resourcesCollectedAt null when the resource list was never read', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}`)
      .reply(200, {
        id: ITEM_ID,
        resourcesCollectedAt: null,
        hasResourcesPendingAuthorization: false,
      })

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const item = await client.fetchItem(ITEM_ID)

    expect(item.resourcesCollectedAt).toBeNull()
    expect(item.hasResourcesPendingAuthorization).toBe(false)
    expect(mock.isDone()).toBeTruthy()
  })
})

describe('fetchItemResources', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('fetches the first page with no filters', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}/resources`)
      .reply(200, resourcesPage)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const page = await client.fetchItemResources(ITEM_ID)

    expect(page).toEqual(resourcesPage)
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes page, pageSize and status as query params', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}/resources`)
      .query({ page: '2', pageSize: '50', status: 'PENDING_AUTHORISATION' })
      .reply(200, { page: 2, total: 51, totalPages: 2, results: [resourcesPage.results[1]] })

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const page = await client.fetchItemResources(ITEM_ID, {
      page: 2,
      pageSize: 50,
      status: 'PENDING_AUTHORISATION',
    })

    expect(page.page).toBe(2)
    expect(page.results).toEqual([resourcesPage.results[1]])
    expect(mock.isDone()).toBeTruthy()
  })
})
