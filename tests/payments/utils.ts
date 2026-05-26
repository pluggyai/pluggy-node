import nock from 'nock'
import { PluggyPaymentsClient } from '../../src/paymentsClient'
import { setupAuth } from '../utils'

export const API_URL = process.env.PLUGGY_API_URL!

/**
 * Sets up the auth mock and returns a fresh PluggyPaymentsClient. Call
 * from `beforeEach` after `nock.cleanAll()`.
 */
export function createPaymentsClient(): PluggyPaymentsClient {
  setupAuth()
  return new PluggyPaymentsClient({ clientId: '123', clientSecret: '456' })
}

/**
 * Forces a value into a typed mock without spelling out every required
 * field. Mirrors the `as unknown as T` pattern already used in
 * tests/transactions.test.ts.
 */
export function mockAs<T>(partial: Record<string, unknown>): T {
  return partial as unknown as T
}

export { nock }
