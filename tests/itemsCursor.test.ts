import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { CursorPageResponse, Item } from '../src/types'

const API_URL = process.env.PLUGGY_API_URL!

const mockItem = (id: string): Item =>
  ({
    id,
    clientUserId: 'user-1',
    status: 'UPDATED',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  } as unknown as Item)

const mockCursorPage = (ids: string[], next: string | null): CursorPageResponse<Item> => ({
  results: ids.map(mockItem),
  next,
})

const forbiddenBody = {
  code: 403,
  codeDescription: 'LIST_ITEMS_FEATURE_NOT_ENABLED',
  message: 'This client is not enabled to list its items.',
}

describe('fetchItemsCursor', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('fetches the first page without query params', async () => {
    const mock = nock(API_URL)
      .get('/v2/items')
      .query(query => Object.keys(query).length === 0)
      .reply(200, mockCursorPage(['item-1', 'item-2'], null))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchItemsCursor()

    expect(result.results.map(i => i.id)).toEqual(['item-1', 'item-2'])
    expect(result.next).toBeNull()
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes clientUserId and connectorId filters as query params', async () => {
    const mock = nock(API_URL)
      .get('/v2/items')
      .query({ clientUserId: 'user 1+test@example.com', connectorId: '201' })
      .reply(
        200,
        mockCursorPage(['item-3'], '?clientUserId=user-1&connectorId=201&after=cursor-xyz')
      )

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchItemsCursor({
      clientUserId: 'user 1+test@example.com',
      connectorId: 201,
    })

    expect(result.results).toHaveLength(1)
    expect(result.next).toContain('after=cursor-xyz')
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes the after cursor as query param, preserving base64 characters', async () => {
    const cursor = 'eyJpZCI6+abc/def=='
    const mock = nock(API_URL)
      .get('/v2/items')
      .query({ after: cursor })
      .reply(200, mockCursorPage(['item-4'], null))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchItemsCursor({ after: cursor })

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBeTruthy()
  })

  it('does not send query params outside the whitelist', async () => {
    const mock = nock(API_URL)
      .get('/v2/items')
      .query({ connectorId: '1' })
      .reply(200, mockCursorPage([], null))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await client.fetchItemsCursor({ connectorId: 1, pageSize: 50 } as any)

    expect(mock.isDone()).toBeTruthy()
  })

  it('rejects with the API error body when the feature is not enabled (403)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    nock(API_URL).get('/v2/items').query(true).reply(403, forbiddenBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

    await expect(client.fetchItemsCursor()).rejects.toMatchObject({
      code: 403,
      codeDescription: 'LIST_ITEMS_FEATURE_NOT_ENABLED',
    })
    consoleSpy.mockRestore()
  })
})

describe('fetchAllItems (cursor-based)', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('returns all results when there is only one page', async () => {
    const mock = nock(API_URL)
      .get('/v2/items')
      .query(query => Object.keys(query).length === 0)
      .reply(200, mockCursorPage(['item-1', 'item-2'], null))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const items = await client.fetchAllItems()

    expect(items.map(i => i.id)).toEqual(['item-1', 'item-2'])
    expect(mock.isDone()).toBeTruthy()
  })

  it('follows the cursor across three pages forwarding filters on every request', async () => {
    const filters = { clientUserId: 'user-1', connectorId: 201 }
    const cursor1 = 'cursor+page2=='
    const cursor2 = 'cursor/page3'

    const mock1 = nock(API_URL)
      .get('/v2/items')
      .query({ clientUserId: 'user-1', connectorId: '201' })
      .reply(
        200,
        mockCursorPage(
          ['item-1', 'item-2'],
          `?clientUserId=user-1&connectorId=201&after=${encodeURIComponent(cursor1)}`
        )
      )
    const mock2 = nock(API_URL)
      .get('/v2/items')
      .query({ clientUserId: 'user-1', connectorId: '201', after: cursor1 })
      .reply(
        200,
        mockCursorPage(
          ['item-3'],
          `?clientUserId=user-1&connectorId=201&after=${encodeURIComponent(cursor2)}`
        )
      )
    const mock3 = nock(API_URL)
      .get('/v2/items')
      .query({ clientUserId: 'user-1', connectorId: '201', after: cursor2 })
      .reply(200, mockCursorPage(['item-4'], null))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const items = await client.fetchAllItems(filters)

    expect(items.map(i => i.id)).toEqual(['item-1', 'item-2', 'item-3', 'item-4'])
    expect(mock1.isDone()).toBeTruthy()
    expect(mock2.isDone()).toBeTruthy()
    expect(mock3.isDone()).toBeTruthy()
  })

  it('stops when next has no after param', async () => {
    const mock = nock(API_URL)
      .get('/v2/items')
      .query(true)
      .reply(200, mockCursorPage(['item-1'], '?connectorId=1'))

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const items = await client.fetchAllItems()

    expect(items.map(i => i.id)).toEqual(['item-1'])
    expect(mock.isDone()).toBeTruthy()
  })

  it('propagates the 403 when the feature is not enabled', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    nock(API_URL).get('/v2/items').query(true).reply(403, forbiddenBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

    await expect(client.fetchAllItems()).rejects.toMatchObject({
      codeDescription: 'LIST_ITEMS_FEATURE_NOT_ENABLED',
    })
    consoleSpy.mockRestore()
  })
})
