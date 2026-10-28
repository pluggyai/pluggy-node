import {
  PageResponse,
  PaymentRequest,
  PixBiometricEnrollment,
  PixBiometricBalance,
} from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — PIX por biometria', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPaymentRequestPixBiometric POSTs the body as is', async () => {
    const mock = nock(API_URL)
      .post('/payments/requests/pix-biometric', {
        amount: 0.01,
        recipientId: 'rec-1',
        linkedJourney: true,
      })
      .reply(
        200,
        mockAs<PaymentRequest>({
          id: 'pr-1',
          pixBiometric: { linkedJourney: true, enrollment: null },
        })
      )

    const client = createPaymentsClient()
    const result = await client.createPaymentRequestPixBiometric({
      amount: 0.01,
      recipientId: 'rec-1',
      linkedJourney: true,
    })

    expect(result.pixBiometric?.enrollment).toBeNull()
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPixBiometricEnrollments sends the filters as query', async () => {
    const mock = nock(API_URL)
      .get('/pix-biometric/enrollments')
      .query({ customerId: 'cus-1', status: 'AUTHORIZED', page: '1' })
      .reply(200, {
        total: 1,
        totalPages: 1,
        page: 1,
        results: [mockAs<PixBiometricEnrollment>({ id: 'enr-1', status: 'AUTHORIZED' })],
      } as PageResponse<PixBiometricEnrollment>)

    const client = createPaymentsClient()
    const result = await client.fetchPixBiometricEnrollments({
      customerId: 'cus-1',
      status: 'AUTHORIZED',
      page: 1,
    })

    expect(result.results[0].id).toBe('enr-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPixBiometricEnrollment GETs one enrollment', async () => {
    const mock = nock(API_URL)
      .get('/pix-biometric/enrollments/enr-1')
      .reply(
        200,
        mockAs<PixBiometricEnrollment>({ id: 'enr-1' })
      )

    const client = createPaymentsClient()
    const result = await client.fetchPixBiometricEnrollment('enr-1')

    expect(result.id).toBe('enr-1')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPixBiometricEnrollmentBalance GETs the balance', async () => {
    const mock = nock(API_URL)
      .get('/pix-biometric/enrollments/enr-1/balance')
      .reply(200, {
        balance: 5.48,
        overdraft: { contracted: 1000, used: 0, available: 1000 },
      } as PixBiometricBalance)

    const client = createPaymentsClient()
    const result = await client.fetchPixBiometricEnrollmentBalance('enr-1')

    expect(result).toEqual({
      balance: 5.48,
      overdraft: { contracted: 1000, used: 0, available: 1000 },
    })
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPixBiometricEnrollmentBalance returns a null overdraft as is', async () => {
    nock(API_URL)
      .get('/pix-biometric/enrollments/enr-1/balance')
      .reply(200, { balance: 5.48, overdraft: null } as PixBiometricBalance)

    const client = createPaymentsClient()
    const result = await client.fetchPixBiometricEnrollmentBalance('enr-1')

    expect(result.overdraft).toBeNull()
  })

  it('revokePixBiometricEnrollment POSTs to revoke', async () => {
    const mock = nock(API_URL)
      .post('/pix-biometric/enrollments/enr-1/revoke')
      .reply(
        200,
        mockAs<PixBiometricEnrollment>({ id: 'enr-1', status: 'REVOKED', revokedBy: 'CLIENT' })
      )

    const client = createPaymentsClient()
    const result = await client.revokePixBiometricEnrollment('enr-1')

    expect(result.revokedBy).toBe('CLIENT')
    expect(mock.isDone()).toBe(true)
  })

  it('cancelPixBiometricEnrollmentDataConsent DELETEs the data consent', async () => {
    const mock = nock(API_URL)
      .delete('/pix-biometric/enrollments/enr-1/data-consent')
      .reply(
        200,
        mockAs<PixBiometricEnrollment>({ id: 'enr-1', dataConsent: { status: 'REVOKED' } })
      )

    const client = createPaymentsClient()
    const result = await client.cancelPixBiometricEnrollmentDataConsent('enr-1')

    expect(result.dataConsent?.status).toBe('REVOKED')
    expect(mock.isDone()).toBe(true)
  })

  it('fetchPaymentIntents filters by enrollmentId', async () => {
    const mock = nock(API_URL)
      .get('/payments/intents')
      .query({ enrollmentId: 'enr-1' })
      .reply(200, { total: 0, totalPages: 0, page: 1, results: [] })

    const client = createPaymentsClient()
    await client.fetchPaymentIntents({ enrollmentId: 'enr-1' })

    expect(mock.isDone()).toBe(true)
  })
})
