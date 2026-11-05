import nock from 'nock'
import { MOCK_API_KEY } from './utils'
import { PluggyClient } from '../src/client'

// The candidates differ by path prefix on the API host instead of by hostname. With other
// hostnames, nock refused these requests as disallowed net connections when the whole suite ran.
const DEFAULT_URL = 'https://api.pluggy.ai'
const ENV_PREFIX = '/from-env'
const PARAM_PREFIX = '/from-param'
const ENV_URL = `${DEFAULT_URL}${ENV_PREFIX}`
const PARAM_URL = `${DEFAULT_URL}${PARAM_PREFIX}`

function mockApi(prefix = ''): nock.Scope {
  return nock(DEFAULT_URL)
    .post(`${prefix}/auth`)
    .reply(200, { apiKey: MOCK_API_KEY })
    .get(`${prefix}/connectors/1`)
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
    const param = mockApi(PARAM_PREFIX)
    const env = mockApi(ENV_PREFIX)

    await new PluggyClient({ ...credentials, baseUrl: PARAM_URL }).fetchConnector(1)

    expect(param.isDone()).toBe(true)
    expect(env.pendingMocks()).toHaveLength(2)
  })

  it('applies baseUrl to the payments client too', async () => {
    const scope = nock(DEFAULT_URL)
      .post(`${PARAM_PREFIX}/auth`)
      .reply(200, { apiKey: MOCK_API_KEY })
      .get(`${PARAM_PREFIX}/payments/requests/dummy-request`)
      .reply(200, { id: 'dummy-request' })

    await new PluggyClient({ ...credentials, baseUrl: PARAM_URL }).payments.fetchPaymentRequest(
      'dummy-request'
    )

    expect(scope.isDone()).toBe(true)
  })

  it('tolerates a trailing slash on baseUrl', async () => {
    const scope = mockApi(PARAM_PREFIX)

    await new PluggyClient({ ...credentials, baseUrl: `${PARAM_URL}/` }).fetchConnector(1)

    expect(scope.isDone()).toBe(true)
  })

  it('uses the environment variable when baseUrl is undefined', async () => {
    const env = mockApi(ENV_PREFIX)

    await new PluggyClient({ ...credentials, baseUrl: undefined }).fetchConnector(1)

    expect(env.isDone()).toBe(true)
  })

  it('uses the production API when neither is set', async () => {
    delete process.env.PLUGGY_API_URL
    const production = mockApi()

    await new PluggyClient(credentials).fetchConnector(1)

    expect(production.isDone()).toBe(true)
  })
})
