import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { ClientCategoryRule, CreateClientCategoryRule, PageResponse } from '../src/types'

const API_URL = process.env.PLUGGY_API_URL!

const rule: ClientCategoryRule = {
  description: 'uber payment',
  category: 'Taxi and ride-hailing',
  categoryId: '19050000',
  transactionType: 'DEBIT',
  accountType: 'CHECKING_ACCOUNT',
}

describe('category rules', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
  })

  it('fetchCategoryRules GETs categories/rules', async () => {
    const page: PageResponse<ClientCategoryRule> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [rule],
    }
    const mock = nock(API_URL)
      .get('/categories/rules')
      .reply(200, page)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.fetchCategoryRules()

    expect(result).toEqual(page)
    expect(mock.isDone()).toBe(true)
  })

  it('createCategoryRule POSTs categories/rules with the rule as body', async () => {
    const payload: CreateClientCategoryRule = {
      description: 'uber payment',
      categoryId: '19050000',
      transactionType: 'DEBIT',
      accountType: 'CHECKING_ACCOUNT',
      matchType: 'contains',
    }
    const mock = nock(API_URL)
      .post('/categories/rules', payload)
      .reply(200, rule)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const result = await client.createCategoryRule(payload)

    expect(result).toEqual(rule)
    expect(mock.isDone()).toBe(true)
  })

  it('deleteCategoryRule DELETEs categories/rules/:id and resolves on 204', async () => {
    const mock = nock(API_URL)
      .delete('/categories/rules/rule-1')
      .reply(204)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    await expect(client.deleteCategoryRule('rule-1')).resolves.toBeUndefined()

    expect(mock.isDone()).toBe(true)
  })
})
