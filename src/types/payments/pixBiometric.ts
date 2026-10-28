import type { PageFilters } from '../common'
import type { CreatePaymentRequest } from './paymentRequest'
import type { SmartTransferOverdraft } from './smartTransfers'

export const PIX_BIOMETRIC_ENROLLMENT_STATUS = [
  'CREATED',
  'AUTHORIZED',
  'REJECTED',
  'REVOKED',
  'EXPIRED',
] as const

/**
 * Status of a linked account (enrollment) where:
 * CREATED - The payer started linking and has not finished
 * AUTHORIZED - The link is active
 * REJECTED - The link was not completed (rejected, or not finished in time)
 * REVOKED - Revoked at the bank or through the API
 * EXPIRED - The link reached its expiration date or became inactive at the institution
 * REJECTED, REVOKED and EXPIRED are final.
 */
export type PixBiometricEnrollmentStatus = typeof PIX_BIOMETRIC_ENROLLMENT_STATUS[number]

export const PIX_BIOMETRIC_DATA_CONSENT_STATUS = [
  'AWAITING_AUTHORISATION',
  'AUTHORISED',
  'REJECTED',
  'REVOKED',
] as const

export type PixBiometricDataConsentStatus = typeof PIX_BIOMETRIC_DATA_CONSENT_STATUS[number]

export type PixBiometricDataConsent = {
  /** Status of the permission to read the account balance. */
  status: PixBiometricDataConsentStatus
  /** Why the permission was rejected; null otherwise. */
  rejectionReason: string | null
  /** Last time the permission changed. */
  updatedAt: Date
}

export type PixBiometricEnrollmentConnector = {
  /** Connector primary identifier. */
  id: number
  /** Institution name. */
  name: string
  /** Institution logo. */
  imageUrl: string
}

/** The linked account, as the institution reported it. */
export type PixBiometricDebtor = {
  /** Account holder name. */
  name: string | null
  /** Account holder CPF/CNPJ, masked. */
  taxNumber: string | null
  bankAccount: {
    /** Branch number. */
    agency: string | null
    /** Account number, masked. */
    account: string | null
    /** Institution name. */
    name: string | null
  }
}

export type PixBiometricEnrollmentLimits = {
  /** Per-payment limit, in BRL. */
  transaction: number | null
  /** Daily limit, in BRL. */
  daily: number | null
  /** Part of the daily limit already used, in BRL. */
  dailyUsed: number | null
}

export type PixBiometricEnrollmentSummary = {
  /** Enrollment primary identifier. */
  id: string
  /** Status of the enrollment. */
  status: PixBiometricEnrollmentStatus
  /** Institution where the account is held. */
  connector: PixBiometricEnrollmentConnector | null
  /** The linked account. Null until the institution reports it. */
  debtor: PixBiometricDebtor | null
}

/**
 * A linked account (enrollment): the payer's account at one institution, linked to the device
 * and browser where they created the passkey. Only the payer creates one, on the payment page.
 */
export type PixBiometricEnrollment = PixBiometricEnrollmentSummary & {
  /** Payer's CPF, masked. */
  cpf: string | null
  /** Payer's CNPJ, masked. */
  cnpj: string | null
  /** Payment Customer of the payment request where the link was created. Null when the payer typed their CPF. */
  customerId: string | null
  /** Limits the payer set at the bank, in BRL. Null until the institution reports them. */
  limits: PixBiometricEnrollmentLimits | null
  /** When the link expires. Null until the institution reports it. */
  expiresAt: Date | null
  /** Permission to read the account balance; null when the payer was not offered it. */
  dataConsent: PixBiometricDataConsent | null
  /** Who revoked the link; null while it was not revoked. */
  revokedBy: 'BANK' | 'CLIENT' | 'PAYER' | null
  /** Why the link failed; null when it did not. */
  errorDetail: { code: string; description: string } | null
  createdAt: Date
  updatedAt: Date
}

export type PixBiometricBalance = {
  /** Account balance in BRL. */
  balance: number
  /** Overdraft limit of the account. Null when the institution does not share it. */
  overdraft: SmartTransferOverdraft | null
}

export type PixBiometricEnrollmentsFilters = PageFilters & {
  /** Filter by Payment Customer. */
  customerId?: string
  /** Filter by payer CPF. */
  cpf?: string
  /** Filter by payer CNPJ. */
  cnpj?: string
  /** Filter by enrollment status. */
  status?: PixBiometricEnrollmentStatus
}

/** Present on Pix por biometria payment requests; null on every other kind. */
export type PaymentRequestPixBiometricDetails = {
  /** Whether the payer was offered balance sharing. */
  linkedJourney: boolean
  /** The linked account the request was paid with. Null until the request is paid. */
  enrollment: PixBiometricEnrollmentSummary | null
}

/** Pix por biometria has no sandbox, so `isSandbox` is not accepted. */
export type CreatePaymentRequestPixBiometric = Pick<
  CreatePaymentRequest,
  'amount' | 'description' | 'recipientId' | 'customerId' | 'callbackUrls' | 'clientPaymentId'
> & {
  /** Recipient that receives the payment. Bank account recipients only. */
  recipientId: string
  /** Offer the payer to also share their account balance and overdraft limit while the link lasts. */
  linkedJourney?: boolean
}
