import { Connector } from '../connector'
import { PaymentRequest } from './paymentRequest'

export const PAYMENT_INTENT_ERROR_STATUSES = [
  'PAYMENT_REJECTED',
  'ERROR',
  'CANCELED',
  'CONSENT_REJECTED',
  'EXPIRED',
] as const

export const PAYMENT_INTENT_STATUSES = [
  ...PAYMENT_INTENT_ERROR_STATUSES,
  'STARTED',
  'ENQUEUED',
  'CONSENT_AWAITING_AUTHORIZATION',
  'CONSENT_AUTHORIZED',
  'PAYMENT_PENDING',
  'PAYMENT_PARTIALLY_ACCEPTED',
  'PAYMENT_SETTLEMENT_PROCESSING',
  'PAYMENT_SETTLEMENT_DEBTOR_ACCOUNT',
  'PAYMENT_COMPLETED',
] as const

export type PaymentIntentErrorStatus = typeof PAYMENT_INTENT_ERROR_STATUSES[number]

export type PaymentIntentStatus = typeof PAYMENT_INTENT_STATUSES[number]

export type PaymentIntent = {
  id: string
  connector: Connector
  consentUrl: string | null
  paymentRequest: PaymentRequest
  status: PaymentIntentStatus
  createdAt: Date
  updatedAt: Date
}

export type CreatePaymentIntent = {
  connectorId: number
  parameters: Record<string, string>
  paymentRequestId: string
}
