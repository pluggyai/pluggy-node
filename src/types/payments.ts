import { DateFilters, PageFilters } from './common'
import { Connector } from './connector'

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

export const PAYMENT_RECIPIENT_BANK_ACCOUNT_TYPES = [
  'SAVINGS_ACCOUNT',
  'CHECKING_ACCOUNT',
  'GUARANTEED_ACCOUNT',
] as const

/**
 * @typedef PaymentRecipientBankAccountType
 * Type of Bank Account for the Recipient
 */
export type PaymentRecipientBankAccountType = typeof PAYMENT_RECIPIENT_BANK_ACCOUNT_TYPES[number]

export const PAYMENT_CUSTOMER_TYPE = ['INDIVIDUAL', 'BUSINESS'] as const

/**
 * @typedef PaymentCustomerType
 * Types of customers
 */
export type PaymentCustomerType = typeof PAYMENT_CUSTOMER_TYPE[number]

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

export type PaymentRecipientAccount = {
  type: PaymentRecipientBankAccountType
  number: string
  branch: string
}

export type CreatePaymentRecipient = {
  name: string
  taxNumber: string
  paymentInstitutionId: string
  isDefault?: boolean
  account: PaymentRecipientAccount
}

export type UpdatePaymentRecipient = {
  name: string
  taxNumber: string
  isDefault?: boolean
  account?: PaymentRecipientAccount
}

export type CreatePaymentCustomer = {
  name: string
  email: string
  cpf: string
  cnpj: string
  type: PaymentCustomerType
}

export type PaymentInstitution = {
  id: string
  name: string
  tradeName: string
  ispb: string
  compe: string | null
  createdAt: Date
  updatedAt: Date
}

export type PaymentRecipient = {
  id: string
  name: string
  taxNumber: string
  isDefault: boolean
  paymentInstitution: PaymentInstitution
  account: PaymentRecipientAccount
  createdAt: Date
  updatedAt: Date
}

export type PaymentCustomer = {
  id: string
  name: string
  email: string
  cpf: string
  cnpj: string
  type: PaymentCustomerType
  createdAt: Date
  updatedAt: Date
}

export type PaymentRequestsFilters = PageFilters & DateFilters

export type PaymentIntentsFilters = PageFilters & DateFilters

export type PaymentRecipientsFilters = PageFilters

export type PaymentCustomersFilters = PageFilters

export type PaymentInstitutionsFilters = PageFilters & { name?: string }
