import { Connector } from '../connector'
import { PaymentInstitution } from './paymentInstitution'
import {
  PaymentRecipient,
  PaymentRecipientAccount,
  PaymentRecipientBankAccountType,
} from './paymentRecipient'
import { Parameters } from '../item'

export const SMART_TRANSFER_PREAUTHORIZATION_STATUS = [
  'CREATED',
  'COMPLETED',
  'REVOKED',
  'REJECTED',
  'ERROR',
] as const

export type SmartTransferPreauthorizationStatus = typeof SMART_TRANSFER_PREAUTHORIZATION_STATUS[number]

export const SMART_TRANSFER_PAYMENT_STATUS = [
  'PAYMENT_REJECTED',
  'ERROR',
  'CANCELED',
  'CONSENT_REJECTED',
  'CONSENT_AUTHORIZED',
  'PAYMENT_PENDING',
  'PAYMENT_PARTIALLY_ACCEPTED',
  'PAYMENT_SETTLEMENT_PROCESSING',
  'PAYMENT_SETTLEMENT_DEBTOR_ACCOUNT',
  'PAYMENT_COMPLETED',
] as const

export type SmartTransferPaymentStatus = typeof SMART_TRANSFER_PAYMENT_STATUS[number]

export type SmartTransferRecipient = Pick<
  PaymentRecipient,
  'id' | 'name' | 'taxNumber' | 'isDefault' | 'paymentInstitution' | 'account'
> & {
  pixKey: string | null
}

export const SMART_TRANSFER_DATA_CONSENT_STATUS = [
  'AWAITING_AUTHORISATION',
  'AUTHORISED',
  'REJECTED',
] as const

export type SmartTransferDataConsentStatus = typeof SMART_TRANSFER_DATA_CONSENT_STATUS[number]

export type SmartTransferDataConsent = {
  status: SmartTransferDataConsentStatus
  /** Why the permission is REJECTED (e.g. CUSTOMER_MANUALLY_REVOKED); null otherwise. */
  rejectionReason: string | null
  updatedAt: Date
}

export type SmartTransferOverdraft = {
  /** Overdraft limit contracted, in BRL. */
  contracted: number
  /** Part of the overdraft limit in use, in BRL. */
  used: number
  /** Part of the overdraft limit still available, in BRL. */
  available: number
}

export type SmartTransferPreauthorizationBalance = {
  /** Source account balance in BRL. */
  balance: number
  /** Overdraft limit of the source account; null when the institution does not share it. */
  overdraft: SmartTransferOverdraft | null
}

export type SmartTransferPreauthorization = {
  id: string
  status: SmartTransferPreauthorizationStatus
  consentUrl: string | null
  clientPreauthorizationId: string | null
  callbackUrls: {
    success?: string
    error?: string
  } | null
  recipients: SmartTransferRecipient[]
  connector: Connector
  /** Permission to read the source account balance; null when it was not requested. */
  dataConsent: SmartTransferDataConsent | null
  createdAt: Date
  updatedAt: Date
}

export type CreateSmartTransferPreauthorization = {
  connectorId: number
  parameters: Parameters
  recipientIds: string[]
  callbackUrls?: {
    success?: string
    error?: string
  }
  /** Also ask the customer for permission to read the source account balance. */
  linkedJourney?: boolean
}

export type CreateSmartTransferPayment = {
  preauthorizationId: string
  recipientId: string
  amount: number
  description?: string
  clientPaymentId?: string
}

export type SmartTransferPayment = {
  id: string
  preauthorizationId: string
  status: SmartTransferPaymentStatus
  amount: number
  description: string | null
  recipient: SmartTransferRecipient
  createdAt: Date
  updatedAt: Date
  clientPaymentId: string | null
}
