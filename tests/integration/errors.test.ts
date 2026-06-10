import { PluggyClient } from '../../src/client'
import {
  captureRejection,
  createClient,
  describeIntegration,
  INTEGRATION_TIMEOUT_MS,
  NON_EXISTENT_UUID,
  PluggyErrorBody,
} from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Error paths (integration)', () => {
  let client: PluggyClient

  beforeAll(() => {
    client = createClient()
  })

  it('fetchItem rejects when the id does not exist', async () => {
    const body = await captureRejection<PluggyErrorBody>(client.fetchItem(NON_EXISTENT_UUID))
    expect(body).toBeDefined()
    expect(body.message || body.code).toBeTruthy()
  })

  it('fetchAccount rejects when the id does not exist', async () => {
    const body = await captureRejection<PluggyErrorBody>(client.fetchAccount(NON_EXISTENT_UUID))
    expect(body).toBeDefined()
    expect(body.message || body.code).toBeTruthy()
  })

  it('fetchTransaction rejects when the id does not exist', async () => {
    const body = await captureRejection<PluggyErrorBody>(
      client.fetchTransaction(NON_EXISTENT_UUID)
    )
    expect(body).toBeDefined()
    expect(body.message || body.code).toBeTruthy()
  })

  it('fetchConnector rejects when the connector id does not exist', async () => {
    const body = await captureRejection<PluggyErrorBody>(client.fetchConnector(99_999_999))
    expect(body).toBeDefined()
    expect(body.message || body.code).toBeTruthy()
  })
})
