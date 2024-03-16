import { PaymentInstitution } from './paymentInstitution'

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

export type PaymentRecipientAccount = {
  type: PaymentRecipientBankAccountType
  number: string
  branch: string
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
