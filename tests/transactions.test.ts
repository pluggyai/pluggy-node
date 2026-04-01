import * as nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { CursorPageResponse, Transaction } from '../src/types'

const ACCOUNT_ID = 'account-abc'
const API_URL = process.env.PLUGGY_API_URL!

const mockTransaction = (id: string): Transaction =>
  ({
    id,
    accountId: ACCOUNT_ID,
    description: `Transaction ${id}`,
    descriptionRaw: null,
    currencyCode: 'BRL',
    amount: 100.0,
    amountInAccountCurrency: null,
    date: new Date('2024-01-15'),
    balance: 1000.0,
    category: 'Transfer',
    categoryId: 'cat-1',
    providerCode: null,
    status: 'POSTED',
    paymentData: null,
    merchant: null,
    type: 'DEBIT',
    creditCardMetadata: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  } as unknown as Transaction)

const mockCursorPage = (
  ids: string[],
  next: string | null
): CursorPageResponse<Transaction> => ({
  results: ids.map(mockTransaction),
  next,
})

describe('fetchTransactionsCursor', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('fetches the first page with only accountId', async () => {
    const responseBody = mockCursorPage(['tx-1', 'tx-2'], null)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchTransactionsCursor(ACCOUNT_ID)

    expect(result.results).toHaveLength(2)
    expect(result.results[0].id).toBe('tx-1')
    expect(result.next).toBeNull()
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes dateFrom filter as query param', async () => {
    const responseBody = mockCursorPage(['tx-3'], `${API_URL}/v2/transactions?accountId=${ACCOUNT_ID}&after=cursor-xyz`)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, dateFrom: '2024-01-01' })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchTransactionsCursor(ACCOUNT_ID, { dateFrom: '2024-01-01' })

    expect(result.results).toHaveLength(1)
    expect(result.next).toContain('cursor-xyz')
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes after cursor as query param', async () => {
    const responseBody = mockCursorPage(['tx-4', 'tx-5'], null)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, after: 'cursor-xyz' })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchTransactionsCursor(ACCOUNT_ID, { after: 'cursor-xyz' })

    expect(result.results).toHaveLength(2)
    expect(result.next).toBeNull()
    expect(mock.isDone()).toBeTruthy()
  })

  it('passes createdAtFrom filter as query param', async () => {
    const responseBody = mockCursorPage(['tx-6'], null)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, createdAtFrom: '2024-01-01T00:00:00.000Z' })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchTransactionsCursor(ACCOUNT_ID, {
      createdAtFrom: '2024-01-01T00:00:00.000Z',
    })

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBeTruthy()
  })
})

describe('fetchAllTransactions (cursor-based)', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('returns all results when there is only one page', async () => {
    const responseBody = mockCursorPage(['tx-1', 'tx-2', 'tx-3'], null)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const transactions = await client.fetchAllTransactions(ACCOUNT_ID)

    expect(transactions).toHaveLength(3)
    expect(transactions.map(t => t.id)).toEqual(['tx-1', 'tx-2', 'tx-3'])
    expect(mock.isDone()).toBeTruthy()
  })

  it('follows cursor across multiple pages and aggregates all results', async () => {
    const cursor1 = 'cursor-page2'
    const page1 = mockCursorPage(
      ['tx-1', 'tx-2'],
      `${API_URL}/v2/transactions?accountId=${ACCOUNT_ID}&after=${cursor1}`
    )
    const page2 = mockCursorPage(['tx-3', 'tx-4'], null)

    const mock1 = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID })
      .reply(200, page1)

    const mock2 = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, after: cursor1 })
      .reply(200, page2)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const transactions = await client.fetchAllTransactions(ACCOUNT_ID)

    expect(transactions).toHaveLength(4)
    expect(transactions.map(t => t.id)).toEqual(['tx-1', 'tx-2', 'tx-3', 'tx-4'])
    expect(mock1.isDone()).toBeTruthy()
    expect(mock2.isDone()).toBeTruthy()
  })

  it('follows cursor across three pages', async () => {
    const cursor1 = 'cursor-page2'
    const cursor2 = 'cursor-page3'
    const page1 = mockCursorPage(
      ['tx-1'],
      `${API_URL}/v2/transactions?accountId=${ACCOUNT_ID}&after=${cursor1}`
    )
    const page2 = mockCursorPage(
      ['tx-2'],
      `${API_URL}/v2/transactions?accountId=${ACCOUNT_ID}&after=${cursor2}`
    )
    const page3 = mockCursorPage(['tx-3'], null)

    nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID })
      .reply(200, page1)
    nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, after: cursor1 })
      .reply(200, page2)
    nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, after: cursor2 })
      .reply(200, page3)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const transactions = await client.fetchAllTransactions(ACCOUNT_ID)

    expect(transactions).toHaveLength(3)
    expect(transactions.map(t => t.id)).toEqual(['tx-1', 'tx-2', 'tx-3'])
  })

  it('forwards dateFrom filter on every page request', async () => {
    const cursor1 = 'cursor-page2'
    const page1 = mockCursorPage(
      ['tx-1'],
      `${API_URL}/v2/transactions?accountId=${ACCOUNT_ID}&dateFrom=2024-01-01&after=${cursor1}`
    )
    const page2 = mockCursorPage(['tx-2'], null)

    const mock1 = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, dateFrom: '2024-01-01' })
      .reply(200, page1)

    const mock2 = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID, dateFrom: '2024-01-01', after: cursor1 })
      .reply(200, page2)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const transactions = await client.fetchAllTransactions(ACCOUNT_ID, { dateFrom: '2024-01-01' })

    expect(transactions).toHaveLength(2)
    expect(mock1.isDone()).toBeTruthy()
    expect(mock2.isDone()).toBeTruthy()
  })

  it('stops immediately when first page has next=null and no results', async () => {
    const responseBody = mockCursorPage([], null)

    const mock = nock(API_URL)
      .get('/v2/transactions')
      .query({ accountId: ACCOUNT_ID })
      .reply(200, responseBody)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const transactions = await client.fetchAllTransactions(ACCOUNT_ID)

    expect(transactions).toHaveLength(0)
    expect(mock.isDone()).toBeTruthy()
  })
})
