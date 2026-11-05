import nock from 'nock'
import { MOCK_API_KEY } from './utils'
import { PluggyClient } from '../src/client'

const ENV_URL = 'https://env-host.example.com'
const PARAM_URL = 'https://param-host.example.com'
const DEFAULT_URL = 'https://api.pluggy.ai'

function mockApi(origin: string): nock.Scope {
  return nock(origin)
    .post('/auth')
    .reply(200, { apiKey: MOCK_API_KEY })
    .get('/connectors/1')
    .reply(200, { id: 1 })
}

describe('base URL', () => {
  const originalEnv = process.env.PLUGGY_API_URL

  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    process.env.PLUGGY_API_URL = ENV_URL
  })

  afterEach(() => {
    process.env.PLUGGY_API_URL = originalEnv
  })

  const credentials = { clientId: 'dummy-id', clientSecret: 'dummy-secret' }

  it('sends the credentials to baseUrl, over the environment variable', async () => {
    const param = mockApi(PARAM_URL)
    const env = mockApi(ENV_URL)

    await new PluggyClient({ ...credentials, baseUrl: PARAM_URL }).fetchConnector(1)

    expect(param.isDone()).toBe(true)
    expect(env.pendingMocks()).toHaveLength(2)
  })

  it('applies baseUrl to the payments client too', async () => {
    const scope = nock(PARAM_URL)
      .post('/auth')
      .reply(200, { apiKey: MOCK_API_KEY })
      .get('/payments/requests/dummy-request')
      .reply(200, { id: 'dummy-request' })

    await new PluggyClient({ ...credentials, baseUrl: PARAM_URL }).payments.fetchPaymentRequest(
      'dummy-request'
    )

    expect(scope.isDone()).toBe(true)
  })

  it('tolerates a trailing slash on baseUrl', async () => {
    const scope = mockApi(PARAM_URL)

    await new PluggyClient({ ...credentials, baseUrl: `${PARAM_URL}/` }).fetchConnector(1)

    expect(scope.isDone()).toBe(true)
  })

  it('uses the environment variable when baseUrl is undefined', async () => {
    const env = mockApi(ENV_URL)

    await new PluggyClient({ ...credentials, baseUrl: undefined }).fetchConnector(1)

    expect(env.isDone()).toBe(true)
  })

  it('uses the production API when neither is set', async () => {
    delete process.env.PLUGGY_API_URL
    const production = mockApi(DEFAULT_URL)

    await new PluggyClient(credentials).fetchConnector(1)

    expect(production.isDone()).toBe(true)
  })
})
