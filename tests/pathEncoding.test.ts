import nock from 'nock'
import { MOCK_API_KEY, recordRequests, setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { assertSafeEndpoint } from '../src/baseApi'

const API_URL = process.env.PLUGGY_API_URL!
const UUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

describe('assertSafeEndpoint', () => {
  it.each([`accounts/${UUID}`, `items/${UUID}/mfa`, 'connectors', 'payments/requests'])(
    'accepts %s',
    endpoint => {
      expect(() => assertSafeEndpoint(endpoint)).not.toThrow()
    }
  )

  it.each([
    ['a query delimiter', 'accounts/abc?x=1&y=2'],
    ['a fragment', 'accounts/abc#frag'],
    ['a percent-encoded sequence', 'accounts/abc%2F..'],
    ['a dot segment', 'accounts/../items'],
    ['a current-dir segment', 'accounts/./x'],
    ['an empty segment', 'accounts//x'],
    ['a trailing slash (empty id)', 'accounts/'],
    ['a leading slash', '/accounts'],
    ['whitespace', 'accounts/a b'],
    ['a control character', 'accounts/a\nb'],
    ['a backslash', 'accounts/a\\b'],
    ['an empty endpoint', ''],
  ])('rejects an endpoint with %s', (_label, endpoint) => {
    expect(() => assertSafeEndpoint(endpoint)).toThrow('unsafe endpoint')
  })
})

describe('requests with caller-provided ids', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

  it('sends a plain UUID unchanged', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${UUID}`)
      .reply(200, { id: UUID })

    await client.fetchAccount(UUID)

    expect(mock.isDone()).toBeTruthy()
  })

  it('refuses an id that would add a query string, without sending a request', async () => {
    const mock = nock(API_URL)
      .get(/.*/)
      .reply(200, {})

    await expect(client.fetchAccount(`${UUID}?accountId=other`)).rejects.toThrow('unsafe endpoint')
    expect(mock.isDone()).toBeFalsy()
  })

  it('refuses an empty id on a mutation', async () => {
    const mock = nock(API_URL)
      .delete(/.*/)
      .reply(204)

    await expect(client.deleteItem('')).rejects.toThrow('unsafe endpoint')
    expect(mock.isDone()).toBeFalsy()
  })

  it('sends the identity itemId as an encoded query parameter', async () => {
    const mock = nock(API_URL)
      .get('/identity')
      .query({ itemId: 'a&b=c' })
      .reply(200, {})

    await client.fetchIdentityByItemId('a&b=c')

    expect(mock.isDone()).toBeTruthy()
  })

  it('sends a numeric id unchanged', async () => {
    const mock = nock(API_URL)
      .get('/connectors/201')
      .reply(200, { id: 201 })

    await client.fetchConnector(201)

    expect(mock.isDone()).toBeTruthy()
  })
})

describe('an id that holds a path separator', () => {
  const PLAIN_ID = 'plainid'
  const ID_WITH_SLASH = 'plain/id'
  const FILLER = 'filler'
  // No SDK method takes more than three arguments, and none puts more than two ids in a path.
  const POSITIONS = [0, 1, 2]

  type SdkMethod = { name: string; call: (args: string[]) => Promise<unknown> }

  // Every public method, so a method added later is covered without touching this test.
  function allSdkMethods(): SdkMethod[] {
    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    return [client, client.payments].flatMap(owner =>
      Object.getOwnPropertyNames(Object.getPrototypeOf(owner))
        .filter(name => name !== 'constructor')
        .map(name => ({
          name,
          call: async (args: string[]): Promise<unknown> =>
            ((owner as unknown) as Record<string, (...args: string[]) => Promise<unknown>>)[name](
              ...args
            ),
        }))
    )
  }

  /** Arguments that hold `value` at `position` and a valid id everywhere else. */
  const argsWith = (position: number, value: string): string[] =>
    POSITIONS.map(index => (index === position ? value : FILLER))

  const pathsOf = (requests: string[]): string[] => requests.map(request => request.split('?')[0])

  let requests: string[]

  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    requests = recordRequests(API_URL, {
      apiKey: MOCK_API_KEY,
      results: [],
      next: null,
      page: 1,
      totalPages: 1,
    })
  })

  /** Each method and argument position whose value ends up in the request path. */
  async function idArguments(): Promise<{ method: SdkMethod; position: number }[]> {
    const found: { method: SdkMethod; position: number }[] = []
    for (const method of allSdkMethods()) {
      for (const position of POSITIONS) {
        requests.length = 0
        await method.call(argsWith(position, PLAIN_ID)).catch(() => undefined)
        if (pathsOf(requests).some(path => path.includes(`/${PLAIN_ID}`))) {
          found.push({ method, position })
        }
      }
    }
    return found
  }

  it('finds the id arguments this suite relies on', async () => {
    const found = (await idArguments()).map(({ method, position }) => `${method.name}#${position}`)

    expect(found).toEqual(
      expect.arrayContaining([
        'fetchItem#0',
        'updateItemMFA#0',
        'deleteItem#0',
        'validateParameters#0',
        'cancelBoleto#0',
        'deleteWebhook#0',
        'fetchPaymentRequest#0',
        'deletePaymentRecipient#0',
        'revokePixBiometricEnrollment#0',
        'cancelScheduledPayment#0',
        'cancelScheduledPayment#1',
        'fetchScheduledPayment#1',
        'retryAutomaticPixPayment#1',
        'cancelAutomaticPixPayment#1',
      ])
    )
  })

  it('is refused at every argument that puts an id in the path', async () => {
    const accepted: string[] = []
    for (const { method, position } of await idArguments()) {
      requests.length = 0
      const refused = await method.call(argsWith(position, ID_WITH_SLASH)).then(
        () => false,
        error => String(error.message).includes('Invalid resource id')
      )
      if (!refused || pathsOf(requests).some(path => path.includes(ID_WITH_SLASH))) {
        accepted.push(`${method.name}#${position}`)
      }
    }

    expect(accepted).toEqual([])
  })
})
