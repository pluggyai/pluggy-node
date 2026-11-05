import { Got, RequestError, RetryObject } from 'got'
import { retryDelay } from '../src/baseApi'
import { PluggyClient } from '../src/client'

// Delay got computed from its own rules, which retryDelay keeps or discards.
const GOT_DELAY = 1000

// Network errors are not simulated through nock here: nock's replyWithError hangs when another test
// file using nock ran earlier in the same Jest worker.
function attempt(method: string, statusCode?: number): RetryObject {
  const error = {
    code: statusCode ? undefined : 'ECONNRESET',
    options: { method },
    response: statusCode ? { statusCode } : undefined,
  }
  return {
    attemptCount: 1,
    retryOptions: undefined,
    error: (error as unknown) as RequestError,
    computedValue: GOT_DELAY,
  }
}

describe('retryDelay', () => {
  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
    'does not resend a %s after a network error or timeout',
    method => {
      expect(retryDelay(attempt(method))).toBe(0)
    }
  )

  it('resends a GET after a network error or timeout', () => {
    expect(retryDelay(attempt('GET'))).toBe(GOT_DELAY)
  })

  it.each(['GET', 'POST', 'PATCH', 'DELETE'])(
    'keeps the delay for a %s answered with 429',
    method => {
      expect(retryDelay(attempt(method, 429))).toBe(GOT_DELAY)
    }
  )

  it('is the policy the client requests use', () => {
    const client = new PluggyClient({ clientId: 'dummy-id', clientSecret: 'dummy-secret' })
    const instance = ((client as unknown) as { getServiceInstance(): Got }).getServiceInstance()

    expect(instance.defaults.options.retry.calculateDelay).toBe(retryDelay)
  })
})
