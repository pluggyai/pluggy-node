import {
  SmartTransferPreauthorization,
  CreateSmartTransferPreauthorization,
  SmartTransferPayment,
  CreateSmartTransferPayment,
  PageResponse,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — smart transfers', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('fetchSmartTransferPreauthorizations GETs smart-transfers/preauthorizations', async () => {
    const page: PageResponse<SmartTransferPreauthorization> = {
      page: 1,
      total: 0,
      totalPages: 0,
      results: [],
    }
    const mock = nock(API_URL).get('/smart-transfers/preauthorizations').reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchSmartTransferPreauthorizations()

    expect(result.results).toEqual([])
    expect(mock.isDone()).toBe(true)
  })

  it('createSmartTransferPreauthorization POSTs smart-transfers/preauthorizations with payload', async () => {
    const payload = mockAs<CreateSmartTransferPreauthorization>({ amount: 100 })
    const mock = nock(API_URL)
      .post('/smart-transfers/preauthorizations', payload as Record<string, unknown>)
      .reply(200, mockAs<SmartTransferPreauthorization>({ id: 'pre-1' }))

    const client = createPaymentsClient()
    const result = await client.createSmartTransferPreauthorization(payload)

    expect(result.id).toBe('pre-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchSmartTransferPreauthorization GETs smart-transfers/preauthorizations/:id', async () => {
    const mock = nock(API_URL)
      .get('/smart-transfers/preauthorizations/pre-1')
      .reply(200, mockAs<SmartTransferPreauthorization>({ id: 'pre-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchSmartTransferPreauthorization('pre-1')

    expect(result.id).toBe('pre-1')
    expect(mock.isDone()).toBe(true)
  })

  it('createSmartTransferPayment POSTs smart-transfers/payments with payload', async () => {
    const payload = mockAs<CreateSmartTransferPayment>({ preauthorizationId: 'pre-1' })
    const mock = nock(API_URL)
      .post('/smart-transfers/payments', payload as Record<string, unknown>)
      .reply(200, mockAs<SmartTransferPayment>({ id: 'pay-1' }))

    const client = createPaymentsClient()
    const result = await client.createSmartTransferPayment(payload)

    expect(result.id).toBe('pay-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchSmartTransferPayment GETs smart-transfers/payments/:id', async () => {
    const mock = nock(API_URL)
      .get('/smart-transfers/payments/pay-1')
      .reply(200, mockAs<SmartTransferPayment>({ id: 'pay-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchSmartTransferPayment('pay-1')

    expect(result.id).toBe('pay-1')
    expect(mock.isDone()).toBe(true)
  })
})
