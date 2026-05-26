import { PluggyClient } from '../../src/client'
import { createClient, describeIntegration, INTEGRATION_TIMEOUT_MS } from './helpers'

jest.setTimeout(INTEGRATION_TIMEOUT_MS)

describeIntegration('Categories (integration)', () => {
  let client: PluggyClient

  beforeAll(() => {
    client = createClient()
  })

  it('fetchCategories returns the catalog with required fields', async () => {
    const page = await client.fetchCategories()

    expect(page.results.length).toBeGreaterThan(0)
    for (const category of page.results) {
      expect(category.id).toBeTruthy()
      expect(typeof category.description).toBe('string')
    }
  })

  it('fetchCategory returns the same category when fetched by id', async () => {
    const page = await client.fetchCategories()
    const sample = page.results[0]

    const fetched = await client.fetchCategory(sample.id)
    expect(fetched.id).toBe(sample.id)
    expect(fetched.description).toBe(sample.description)
  })
})
