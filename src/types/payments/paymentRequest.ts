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
  description?: string
  recipientId?: string
  customerId?: string
}

export type PaymentRequest = {
  /**! primary identifier */
  id: string
  /**! payment to send the user to pay */
  paymentUrl: string
  /**! amount to be paid */
  amount: number
  /**! description of the payment */
  description: string | null
  /**! status of the payment request */
  status: PaymentRequestStatus
  /**! where the user will be redirected when the payment finishes */
  callbackUrls: CallbackUrls | null
  /** if the payment request is inside a bulk payment, primary identifier of the bulk */
  bulkPaymentId: string | null
  /**! recipient of the payment */
  recipient: PaymentRecipient | null
  /**! customer that will pay the payment */
  customer: PaymentCustomer | null
  /**! fees that will be charged to the customer (related to bulk) */
  fees: number | null
  createdAt: Date
  updatedAt: Date
}

export type CallbackUrls = {
  success?: string
  error?: string
}
