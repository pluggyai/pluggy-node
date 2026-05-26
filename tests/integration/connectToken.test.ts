import { PluggyClient } from '../../src/client'
import {
  createClient,
  describeIntegration,
  INTEGRATION_TIMEOUT_MS,
  TEST_TAG,
} from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Connect Token (integration)', () => {
  let client: PluggyClient

  beforeAll(() => {
    client = createClient()
  })

  it('createConnectToken returns a non-empty accessToken', async () => {
    const response = await client.createConnectToken(undefined, { clientUserId: TEST_TAG })

    expect(typeof response.accessToken).toBe('string')
    expect(response.accessToken.length).toBeGreaterThan(0)
  })
})
