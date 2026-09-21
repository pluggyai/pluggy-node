import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { AccountBalance } from '../src/types'

const ACCOUNT_ID = 'account-abc'
const API_URL = process.env.PLUGGY_API_URL!

const fullBalance: AccountBalance = {
  balance: 1500.5,
  blockedBalance: 100,
  automaticallyInvestedBalance: 500,
  currencyCode: 'BRL',
  updateDateTime: '2026-09-21T15:00:00Z',
}

const minimalBalance: AccountBalance = {
  balance: 1500.5,
  currencyCode: 'BRL',
  updateDateTime: '2026-09-21T15:00:00Z',
}

describe('fetchAccountBalance', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('GETs /accounts/{id}/balance and deserializes all fields', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${ACCOUNT_ID}/balance`)
      .reply(200, fullBalance)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const balance = await client.fetchAccountBalance(ACCOUNT_ID)

    expect(balance.balance).toBe(1500.5)
    expect(balance.blockedBalance).toBe(100)
    expect(balance.automaticallyInvestedBalance).toBe(500)
    expect(balance.currencyCode).toBe('BRL')
    expect(balance.updateDateTime).toBe('2026-09-21T15:00:00Z')
    expect(mock.isDone()).toBeTruthy()
  })

  it('handles a response without optional blockedBalance and automaticallyInvestedBalance', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${ACCOUNT_ID}/balance`)
      .reply(200, minimalBalance)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const balance = await client.fetchAccountBalance(ACCOUNT_ID)

    expect(balance.balance).toBe(1500.5)
    expect(balance.currencyCode).toBe('BRL')
    expect(balance.updateDateTime).toBe('2026-09-21T15:00:00Z')
    expect(balance.blockedBalance).toBeUndefined()
    expect(balance.automaticallyInvestedBalance).toBeUndefined()
    expect(mock.isDone()).toBeTruthy()
  })

  it('propagates API errors through the existing error mechanism', async () => {
    nock(API_URL)
      .get(`/accounts/${ACCOUNT_ID}/balance`)
      .reply(404, {
        message: 'account not found for the given id',
        code: 404,
      })

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

    await expect(client.fetchAccountBalance(ACCOUNT_ID)).rejects.toEqual({
      message: 'account not found for the given id',
      code: 404,
    })
  })
})