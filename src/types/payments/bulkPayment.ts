import { PaymentRequest } from './paymentRequest'
import { SmartAccount } from './smartAccount'

export const BULK_PAYMENT_STATUS = [
  'CREATED',
  'TOP_UP_STARTED',
  'WAITING_PAYER_AUTHORIZATION',
  'TOP_UP_IN_PROGRESS',
  'PAYMENT_IN_PROGRESS',
  'ERROR',
  'COMPLETED',
] as const
export type BulkPaymentStatus = typeof BULK_PAYMENT_STATUS[number]

export type BulkPayment = {
  id: string
  status: BulkPaymentStatus
  referenceId: string | null
  createdAt: Date
  updatedAt: Date
  totalAmount: number
  paymentUrl: string
  paymentRequests: PaymentRequest[]
  smartAccount: SmartAccount
}

export type CreateBulkPaymentFields = {
  smartAccountId: string
  paymentRequestsIds: string[]
}