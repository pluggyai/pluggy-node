import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { MerchantsResponse } from '../src/types'

const API_URL = process.env.PLUGGY_API_URL!

describe('fetchMerchants', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
  })

  it('GETs merchants with the CNPJs as a comma-separated list', async () => {
    const response: MerchantsResponse = {
      foundMerchants: [
        {
          businessName: 'BANCO DO BRASIL SA',
          cnpj: '00000000000191',
          name: 'BANCO DO BRASIL',
          cnae: '6422100',
          category: 'Banking',
        },
      ],
      notFoundMerchants: ['60701190000104'],
      invalidCnpjs: ['123'],
    }
    const mock = nock(API_URL)
      .get('/merchants')
      .query({ cnpjs: '00000000000191,60701190000104,123' })
      .reply(200, response)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchMerchants(['00000000000191', '60701190000104', '123'])

    expect(result).toEqual(response)
    expect(mock.isDone()).toBe(true)
  })
})
