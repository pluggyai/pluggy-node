import { CurrencyCode } from './common'

export enum CreditCardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  CABAL = 'CABAL',
  ELO = 'ELO',
  OTHER = 'OTHER',
}

export const SALE_STATUSES = ['APPROVED', 'CANCELLED'] as const
export type SaleStatus = (typeof SALE_STATUSES)[number]

export const RECEIVABLE_SETTLEMENT_STATUSES = [
  'PAID',
  'SENT',
  'REJECTED',
  'EXPECTED',
  'OTHER',
] as const
export type ReceivableSettlementStatus = (typeof RECEIVABLE_SETTLEMENT_STATUSES)[number]

export const ANTICIPATION_STATUSES = [
  'SIMULATED',
  'REQUESTED',
  'CANCELLED',
  'IN_ANALYSIS',
  'APPROVED',
] as const
export type AnticipationStatus = (typeof ANTICIPATION_STATUSES)[number]

export const CARD_FUNDING_SOURCES = ['CREDIT', 'DEBIT'] as const
export type CardFundingSource = (typeof CARD_FUNDING_SOURCES)[number]

export const SALE_PAYMENT_METHODS = ['CARD', 'PIX'] as const
export type SalePaymentMethod = (typeof SALE_PAYMENT_METHODS)[number]

export type SaleInstallment = {
  number: number
  netAmount: number
  grossAmount: number
  receiptDate: Date
}

export type DestinationAccount = {
  receivingBank: string
  agency: string
  account: string
}

export type AcquirerSale = {
  id: string
  itemId: string
  description: string
  date: Date
  currencyCode: CurrencyCode
  grossAmount: number
  installmentCount?: number
  paymentMethod?: SalePaymentMethod
  authorizationCode?: string
  cardFlag?: CreditCardBrand
  cardNumber?: string
  cardFundingSource?: CardFundingSource
  nsu?: string
  status?: SaleStatus
  netAmount?: number
  mdrFee?: number
  mdrFeeAmount?: number
  installments?: SaleInstallment[]
  terminalId?: string
  operationId?: string
}

export type AcquirerReceivable = {
  id: string
  itemId: string
  description: string
  date: Date
  currencyCode: CurrencyCode
  grossAmount: number
  netAmount: number
  paymentId?: string
  settlementStatus?: ReceivableSettlementStatus
  destinationAccount?: DestinationAccount
  cardFlag?: CreditCardBrand
  operationId?: string
}

export type AcquirerAnticipation = {
  id: string
  itemId: string
  description: string
  date: Date
  currencyCode: CurrencyCode
  grossAmount: number
  status?: AnticipationStatus
  netAmount?: number
  fee?: number
  feeAmount?: number
  operationId?: string
}
