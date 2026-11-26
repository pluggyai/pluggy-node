import {
  WEBHOOK_EVENTS,
  WebhookEventPayload,
  PIX_BIOMETRIC_ENROLLMENT_STATUS,
  PIX_BIOMETRIC_DATA_CONSENT_STATUS,
  PaymentRequest,
  PaymentIntentsFilters,
} from '../../src/types'

describe('PIX por biometria types', () => {
  it('lists the three enrollment webhook events', () => {
    expect(WEBHOOK_EVENTS).toEqual(
      expect.arrayContaining([
        'pix_biometric_enrollment/authorized',
        'pix_biometric_enrollment/revoked',
        'pix_biometric_enrollment/error',
      ])
    )
  })

  it('narrows the enrollment webhook payload by event', () => {
    const payload = {
      event: 'pix_biometric_enrollment/authorized',
      eventId: 'evt-1',
      enrollmentId: 'enr-1',
      customerId: null,
      paymentRequestId: 'pr-1',
    } as WebhookEventPayload
    if (payload.event !== 'pix_biometric_enrollment/authorized') throw new Error('unreachable')
    expect(payload.enrollmentId).toBe('enr-1')
    expect(payload.customerId).toBeNull()
  })

  it('exposes the enrollment and data consent statuses', () => {
    expect(PIX_BIOMETRIC_ENROLLMENT_STATUS).toEqual(['CREATED', 'AUTHORIZED', 'REJECTED', 'REVOKED', 'EXPIRED'])
    expect(PIX_BIOMETRIC_DATA_CONSENT_STATUS).toEqual(['AWAITING_AUTHORISATION', 'AUTHORISED', 'REJECTED', 'REVOKED'])
  })

  it('lets a payment request of another type omit or null pixBiometric', () => {
    const other: Pick<PaymentRequest, 'pixBiometric'> = {}
    const nulled: Pick<PaymentRequest, 'pixBiometric'> = { pixBiometric: null }
    expect(other.pixBiometric ?? nulled.pixBiometric).toBeNull()
  })

  it('filters payment intents by enrollment or payment request', () => {
    const byEnrollment: PaymentIntentsFilters = { enrollmentId: 'enr-1' }
    const byRequest: PaymentIntentsFilters = { paymentRequestId: 'pr-1' }
    expect([byEnrollment.enrollmentId, byRequest.paymentRequestId]).toEqual(['enr-1', 'pr-1'])
  })
})
