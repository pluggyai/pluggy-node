import { PaymentCustomer } from './paymentCustomer'
import { PaymentRecipient } from './paymentRecipient'

export const PAYMENT_REQUEST_STATUS = [
  'CREATED',
  'IN_PROGRESS',
  'WAITING_PAYER_AUTHORIZATION',
  'COMPLETED',
  'ERROR',
] as const
/**
 * @typedef PaymentRequestStatus
 * Status of payment request where:
 * CREATED - Payment request was created
 * IN_PROGRESS - User started the payment process
 * WAITING_PAYER_AUTHORIZATION - User needs to authorize the payment in the payment institution
 * COMPLETED - Payment request was completed
 * ERROR - Payment request has an error
 */
export type PaymentRequestStatus = typeof PAYMENT_REQUEST_STATUS[number]

export type CreatePaymentRequest = {
  amount: number
  callbackUrls?: CallbackUrls
  description: string
  recipientId?: string
  customerId?: string
}

export type PaymentRequest = CreatePaymentRequest & {
  id: string
  paymentUrl: string
  status: PaymentRequestStatus
  recipient?: PaymentRecipient
  customer?: PaymentCustomer
  createdAt: Date
  updatedAt: Date
}

export type CallbackUrls = {
  success?: string
  error?: string
}
