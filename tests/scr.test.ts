import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { ScrResponse } from '../src/types'

const ITEM_ID = 'item-abc'
const API_URL = process.env.PLUGGY_API_URL!

const scrResponse: ScrResponse = {
  dtbConsult: '202604 a 202607',
  cdCli: '12345678900',
  tpCli: '1',
  lsDtb: [
    {
      dtb: 202607,
      qtdIfs: 2,
      lsOp: [{ mod: '0203', resVenc: { v20: 1500.5, v110: 120 }, lsGar: [{ tp: '0101', qtd: 1 }] }],
    },
  ],
}

describe('fetchItemScr', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
  })

  it('GETs items/:id/scr with no query when no range is given', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}/scr`)
      .reply(200, scrResponse)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchItemScr(ITEM_ID)

    expect(result).toEqual(scrResponse)
    expect(mock.isDone()).toBe(true)
  })

  it('passes from and to as query params', async () => {
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}/scr`)
      .query({ from: '202604', to: '202607' })
      .reply(200, scrResponse)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchItemScr(ITEM_ID, { from: '202604', to: '202607' })

    expect(result).toEqual(scrResponse)
    expect(mock.isDone()).toBe(true)
  })

  it('rejects with the API error body when the SCR feature is not enabled (403)', async () => {
    const errorBody = {
      code: 403,
      codeDescription: 'SCR_FEATURE_NOT_ENABLED',
      message: 'This client is not enabled to query SCR data.',
    }
    const mock = nock(API_URL)
      .get(`/items/${ITEM_ID}/scr`)
      .reply(403, errorBody)
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    await expect(client.fetchItemScr(ITEM_ID)).rejects.toEqual(errorBody)

    expect(mock.isDone()).toBe(true)
    consoleError.mockRestore()
  })
})
