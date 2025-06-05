import type { PaymentCustomer } from './paymentCustomer'
import { PaymentRecipient } from './paymentRecipient'

export declare const DAYS_OF_WEEK: readonly [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
]
export type DaysOfWeek = typeof DAYS_OF_WEEK[number]

export const PAYMENT_REQUEST_STATUS = [
  'CREATED',
  'IN_PROGRESS',
  'COMPLETED',
  'SCHEDULED',
  'WAITING_PAYER_AUTHORIZATION',
  'ERROR',
  'REFUND_IN_PROGRESS',
  'REFUNDED',
  'REFUND_ERROR',
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
  schedule?: PaymentRequestSchedule
  smartAccountId?: string
  clientPaymentId?: string
}

export type PaymentRequestSchedule =
  | SingleSchedule
  | DailySchedule
  | WeeklySchedule
  | MonthlySchedule
  | CustomSchedule

export type SingleSchedule = {
  type: 'SINGLE'
  date: string
}

export type DailySchedule = {
  type: 'DAILY'
  startDate: string
  occurrences: number
}

export type WeeklySchedule = {
  type: 'WEEKLY'
  startDate: string
  occurrences: number
  dayOfWeek: DaysOfWeek
}

export type MonthlySchedule = {
  type: 'MONTHLY'
  startDate: string
  occurrences: number
  dayOfMonth: number
}

export type CustomSchedule = {
  type: 'CUSTOM'
  dates: string[]
  additionalInformation?: string
}

export const AUTOMATIC_PIX_INTERVALS = ["WEEKLY", "MONTHLY", "QUARTERLY", "SEMESTER", "YEARLY"] as const;
export type AutomaticPixInterval = typeof AUTOMATIC_PIX_INTERVALS[number];

export type AutomaticPixFirstPayment = {
  date?: string;
  amount: number;
  description?: string;
};

export type PaymentRequestAutomaticPix = {
  interval: AutomaticPixInterval;
  startDate: string;
  minimumVariableAmount?: number;
  maximumVariableAmount?: number;
  expiresAt?: string;
  isRetryAccepted?: boolean;
  firstPayment?: AutomaticPixFirstPayment;
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
  /**! schedule of the payment */
  schedule: PaymentRequestSchedule | null
  /**! automaticPix of the payment */
  automaticPix: PaymentRequestAutomaticPix | null
  /**! createdAt date */
  createdAt: Date
  /**! updatedAt date */
  updatedAt: Date
  /**! Identification from client that can be used to track payment */
  clientPaymentId: string | null
}

export type CallbackUrls = {
  success?: string
  error?: string
}
