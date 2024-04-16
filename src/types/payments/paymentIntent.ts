import { Connector } from '../connector'
import { BulkPayment } from './bulkPayment'
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

export type PaymentIntentPixQrData = {
  qr: string
  value: string
}

export type PaymentIntent = {
  id: string
  connector: Connector | null
  consentUrl: string | null
  pixData: PaymentIntentPixQrData | null
  paymentRequest: PaymentRequest | null
  bulkPayment: Omit<BulkPayment, 'smartAccount' | 'paymentRequests'> | null
  status: PaymentIntentStatus
  createdAt: Date
  updatedAt: Date
}

type BaseCreatePaymentIntentParams = {
  connectorId: number
  parameters: {
    cpf: string
    cnpj?: string
  }
}

export type CreatePaymentIntentPaymentRequestsParams = BaseCreatePaymentIntentParams & {
  paymentRequestId: string
}

export type CreatePaymentIntentBulkParmas = BaseCreatePaymentIntentParams & {
  bulkPaymentId: string
}

export type CreatePaymentIntentBulkPixQrParams = {
  bulkPaymentId: string
  paymentMethod: 'PIX'
}

export type CreatePaymentIntent =
  | CreatePaymentIntentPaymentRequestsParams
  | CreatePaymentIntentBulkParmas
  | CreatePaymentIntentBulkPixQrParams
