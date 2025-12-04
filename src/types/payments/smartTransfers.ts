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
