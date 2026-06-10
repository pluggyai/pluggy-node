import {
  PaymentRequestAutomaticPix,
  CreatePaymentRequestAutomaticPix,
  AutomaticPixPayment,
  AutomaticPixPaymentListResponse,
  ScheduleAutomaticPixPaymentRequest,
  RetryAutomaticPixPaymentRequest,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — automatic PIX', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentRequestPixAutomatico POSTs payments/requests/automatic-pix', async () => {
    const payload = mockAs<CreatePaymentRequestAutomaticPix>({ amount: 100 })
    const mock = nock(API_URL)
      .post('/payments/requests/automatic-pix', payload as Record<string, unknown>)
      .reply(200, mockAs<PaymentRequestAutomaticPix>({ id: 'pix-1' }))

    const client = createPaymentsClient()
    const result = await client.createPaymentRequestPixAutomatico(payload)

    expect(result.id).toBe('pix-1')
    expect(mock.isDone()).toBe(true)
  })

  it('scheduleAutomaticPixPayment POSTs .../automatic-pix/schedule with payload', async () => {
    const payload = mockAs<ScheduleAutomaticPixPaymentRequest>({ amount: 50 })
    const mock = nock(API_URL)
      .post('/payments/requests/auth-1/automatic-pix/schedule', payload as Record<string, unknown>)
      .reply(200, mockAs<AutomaticPixPayment>({ id: 'apix-1' }))

    const client = createPaymentsClient()
    const result = await client.scheduleAutomaticPixPayment('auth-1', payload)

    expect(result.id).toBe('apix-1')
    expect(mock.isDone()).toBe(true)
  })

  it('retryAutomaticPixPayment POSTs .../automatic-pix/schedules/:id/retry', async () => {
    const payload = mockAs<RetryAutomaticPixPaymentRequest>({})
    const mock = nock(API_URL)
      .post(
        '/payments/requests/req-1/automatic-pix/schedules/apix-1/retry',
        payload as Record<string, unknown>
      )
      .reply(200, mockAs<AutomaticPixPayment>({ id: 'apix-1' }))

    const client = createPaymentsClient()
    const result = await client.retryAutomaticPixPayment('req-1', 'apix-1', payload)

    expect(result.id).toBe('apix-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchAutomaticPixPayments GETs .../automatic-pix/schedules with filters', async () => {
    const mock = nock(API_URL)
      .get('/payments/requests/auth-1/automatic-pix/schedules')
      .query({ page: '1' })
      .reply(200, mockAs<AutomaticPixPaymentListResponse>({ results: [] }))

    const client = createPaymentsClient()
    await client.fetchAutomaticPixPayments('auth-1', mockAs({ page: 1 }))

    expect(mock.isDone()).toBe(true)
  })

  it('fetchAutomaticPixPayment GETs .../automatic-pix/schedules/:id', async () => {
    const mock = nock(API_URL)
      .get('/payments/requests/req-1/automatic-pix/schedules/apix-1')
      .reply(200, mockAs<AutomaticPixPayment>({ id: 'apix-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchAutomaticPixPayment('req-1', 'apix-1')

    expect(result.id).toBe('apix-1')
    expect(mock.isDone()).toBe(true)
  })

  it('cancelAutomaticPixPayment POSTs .../automatic-pix/schedules/:id/cancel', async () => {
    const mock = nock(API_URL)
      .post('/payments/requests/req-1/automatic-pix/schedules/apix-1/cancel')
      .reply(200, {})

    const client = createPaymentsClient()
    await client.cancelAutomaticPixPayment('req-1', 'apix-1')

    expect(mock.isDone()).toBe(true)
  })

  it('cancelAutomaticPixAuthorization POSTs .../automatic-pix/cancel', async () => {
    const mock = nock(API_URL)
      .post('/payments/requests/req-1/automatic-pix/cancel')
      .reply(200, {})

    const client = createPaymentsClient()
    await client.cancelAutomaticPixAuthorization('req-1')

    expect(mock.isDone()).toBe(true)
  })
})
