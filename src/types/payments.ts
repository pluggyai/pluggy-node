import { DateFilters, PageFilters } from './common'
import { Connector } from './connector'

export const PAYMENT_REQUEST_STATUS = ['CREATED', 'IN_PROGRESS', 'COMPLETED', 'ERROR'] as const
/**
 * @typedef PaymentRequestStatus
 * Status of payment request
 */
export type PaymentRequestStatus = typeof PAYMENT_REQUEST_STATUS[number]

export const PAYMENT_INTENT_ERROR_STATUSES = [
  'PAYMENT_REJECTED',
  'ERROR',
  'CANCELED',
  'CONSENT_REJECTED',
] as const
export type PaymentIntentErrorStatus = typeof PAYMENT_INTENT_ERROR_STATUSES[number]

export const PAYMENT_INTENT_STATUSES = [
  'PAYMENT_REJECTED',
  'ERROR',
  'CANCELED',
  'CONSENT_REJECTED',
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
export type PaymentIntentStatus = typeof PAYMENT_INTENT_STATUSES[number]

export type CreatePaymentRequest = {
  amount: number
  callbackUrls?: CallbackUrls
  description: string
  recipientId?: string
}

export type PaymentRequest = CreatePaymentRequest & {
  id: string
  paymentUrl: string
  status: PaymentRequestStatus
  createdAt: Date
  updatedAt: Date
}

export type CallbackUrls = {
  success: string | null
  error: string | null
}

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

export type PaymentRequestsFilters = PageFilters & DateFilters

export type PaymentIntentsFilters = PageFilters & DateFilters
