import * as nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'

describe('Auth', () => {
  beforeEach(() => {
    nock.cleanAll() // Clear previous mocks first
    setupAuth()
  })

  it('creates a connect token', async () => {
    const mockConnectTokenRequest = nock(process.env.PLUGGY_API_URL!)
      .post('/connect_token')
      .reply(200, { accessToken: '123' })

    const client = new PluggyClient({
      clientId: '123',
      clientSecret: '456',
    })

    const token = await client.createConnectToken()

    expect(token.accessToken).toEqual('123')

    expect(mockConnectTokenRequest.isDone()).toBeTruthy()
  })

  it('with 429 status code, retries the request', async () => {
    const mockConnectTokenRequest = nock(process.env.PLUGGY_API_URL!)
      .post('/connect_token')
      .reply(429, 'Rate limit exceeded', {
        'Retry-After': '1',
      })
      .post('/connect_token')
      .reply(200, { accessToken: '123' })

    const client = new PluggyClient({
      clientId: '123',
      clientSecret: '456',
    })

    const token = await client.createConnectToken()

    expect(token.accessToken).toEqual('123')

    expect(mockConnectTokenRequest.isDone()).toBeTruthy()
  })
})
