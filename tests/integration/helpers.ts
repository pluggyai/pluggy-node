/**
 * Shared helpers for integration tests.
 *
 * Patterned after plaid-node's test/clientHelper.ts: a client factory, a
 * fixture builder that creates a sandbox item and waits for it to sync,
 * a defensive cleanup helper, and a small retry utility for endpoints
 * that are eventually consistent in sandbox.
 */
import { PluggyClient } from '../../src/client'
import { Item } from '../../src/types'

/** Pluggy Bank — the sandbox connector. */
export const SANDBOX_CONNECTOR_ID = 0

/** Sandbox login that produces an UPDATED item with full aggregation data. */
export const SANDBOX_CREDENTIALS = { user: 'user-ok', password: 'password-ok' }

/**
 * Identifier shared across all resources created in a single test run.
 * Lets us spot orphans from failed runs (`integration-test-<runId>` shows
 * up in connectToken's clientUserId, webhook URLs, etc.).
 */
export const RUN_ID =
  process.env.GITHUB_RUN_ID || process.env.GITHUB_RUN_NUMBER || `local-${Date.now()}`

/** Tag every test-owned resource so orphans can be identified later. */
export const TEST_TAG = `integration-test-${RUN_ID}`

/** Max time we wait for an item to leave the pending sync states. */
const ITEM_SYNC_TIMEOUT_MS = 5 * 60 * 1000
const ITEM_SYNC_POLL_INTERVAL_MS = 3_000

/** True when credentials are present — drives `describeIntegration`. */
export const HAS_CREDENTIALS = Boolean(
  process.env.PLUGGY_CLIENT_ID && process.env.PLUGGY_CLIENT_SECRET
)

/** `describe` that skips when credentials are missing (local dev, forks). */
export const describeIntegration = HAS_CREDENTIALS ? describe : describe.skip

export function createClient(): PluggyClient {
  return new PluggyClient({
    clientId: process.env.PLUGGY_CLIENT_ID!,
    clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
    baseUrl: process.env.PLUGGY_API_URL,
  })
}

/**
 * Create a sandbox item and poll until it reaches a terminal status.
 * Throws on timeout or on any non-UPDATED terminal state.
 */
export async function createSandboxItem(client: PluggyClient): Promise<Item> {
  let item = await client.createItem(SANDBOX_CONNECTOR_ID, SANDBOX_CREDENTIALS)
  const deadline = Date.now() + ITEM_SYNC_TIMEOUT_MS

  while (item.status !== 'UPDATED' && item.status !== 'LOGIN_ERROR') {
    if (Date.now() > deadline) {
      // Best-effort cleanup before bubbling the error.
      await deleteItemSafely(client, item.id)
      throw new Error(`Item ${item.id} sync timed out after ${ITEM_SYNC_TIMEOUT_MS}ms`)
    }
    await sleep(ITEM_SYNC_POLL_INTERVAL_MS)
    item = await client.fetchItem(item.id)
  }

  if (item.status !== 'UPDATED') {
    await deleteItemSafely(client, item.id)
    throw new Error(`Item ${item.id} reached terminal status ${item.status}, expected UPDATED`)
  }

  return item
}

/**
 * Delete an item without throwing — used in `afterAll` so cleanup never
 * masks the real failure. Logs to stderr so leaks are visible in CI.
 */
export async function deleteItemSafely(client: PluggyClient, itemId: string): Promise<void> {
  try {
    await client.deleteItem(itemId)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[integration] failed to delete item ${itemId}:`, err)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry `fn` up to `attempts` times with a fixed delay between attempts.
 * Pluggy sandbox is eventually consistent for some endpoints (e.g.
 * transactions surface after the item flips UPDATED but may lag a beat).
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delayMs?: number; description?: string } = {}
): Promise<T> {
  const { attempts = 10, delayMs = 1_000, description = 'operation' } = options
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await sleep(delayMs)
      }
    }
  }
  throw new Error(
    `${description} failed after ${attempts} attempts: ${(lastError as Error)?.message ?? lastError}`
  )
}

/**
 * Assert that a promise rejects with an API error body. Pluggy's BaseApi
 * rejects with `error.response.body` — the parsed JSON error body, NOT a
 * thrown Error with statusCode — so we can't assert HTTP status directly.
 * Instead we capture the rejection value and let the caller inspect it.
 *
 * Returns the rejection body for further assertions.
 */
export async function captureRejection<T = unknown>(promise: Promise<unknown>): Promise<T> {
  try {
    await promise
  } catch (err) {
    return err as T
  }
  throw new Error('expected promise to reject, but it resolved')
}

/**
 * Pluggy error bodies typically include at least a `message` field and
 * sometimes a `code`. Used to sanity-check error-path tests without
 * over-fitting to one specific shape.
 */
export type PluggyErrorBody = {
  message?: string
  code?: string | number
  [key: string]: unknown
}

/** Fake but well-formed UUID — guaranteed not to match a real resource. */
export const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000'

/** Default Jest timeout for integration files. Item sync alone can be ~3 min. */
export const INTEGRATION_TIMEOUT_MS = 6 * 60 * 1000
