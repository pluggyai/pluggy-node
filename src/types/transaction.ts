import { CurrencyCode, PageFilters } from './common'

export const TRANSACTION_TYPES = ['DEBIT', 'CREDIT'] as const

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
}

/**
 * @typedef TransactionType
 * The direction of the transaction.
 * If DEBIT money going out of the account.
 * If CREDIT money going into the account.
 */
export type TransactionType = typeof TRANSACTION_TYPES[number]

export type TransactionPaymentParticipantDocument = {
  /** document number */
  value?: string
  /** Type of document provided, ie. CPF / CNPJ */
  type?: 'CPF' | 'CNPJ'
}

export type TransactionPaymentParticipant = {
  /** Document number object */
  documentNumber?: TransactionPaymentParticipantDocument
  /** Name of the participant */
  name?: string
  /** Number of the account */
  accountNumber?: string
  /** Number of the agency / branch */
  branchNumber?: string
  /** Number of the bank */
  routingNumber?: string
}

export type TransactionPaymentData = {
  /** The identity of the sender of the transfer */
  payer?: TransactionPaymentParticipant
  /** The identity of the receiver of the transfer */
  receiver?: TransactionPaymentParticipant
  /** Identifier for the transaction provided by the institution */
  paymentMethod?: string
  /** The type of transfer used "PIX", "TED", "DOC". */
  referenceNumber?: string
  /** The payer description / motive of the transfer */
  reason?: string
}

export type TransactionMerchantData = {
  /** Name of the merchant */
  name: string
  /** Legal business name of the merchant */
  businessName: string
  /** Cnpj number associated to the merchant */
  cnpj: string
  /** Cnae number associated to the merchant */
  cnae?: string
  /** Category of the merchant */
  category?: string
}

export type TransactionFilters = PageFilters & {
  /** Filter less than date. Format can be ISO Date or 'YYYY-MM-dd' string. */
  to?: string
  /** Filter greater than date. Format can be ISO Date, or 'YYYY-MM-dd' string. */
  from?: string
}

export type Transaction = {
  /** Primary identifier of the transaction */
  id: string
  /** Primary identifier of the Account */
  accountId: string
  /** Date of the transaction that was made. */
  date: Date
  /** Transaction original description */
  description: string
  /** Transation type of movement */
  type: TransactionType
  /** Amount of the transaction */
  amount: number
  /** Current balance of the trasaction, after transaction was made. */
  balance: number
  /** ISO Currency code of the Transaction */
  currencyCode: CurrencyCode
  /** Assigned category of the transaction. */
  category?: string
  /** Status of the transaction, default to `POSTED` */
  status?: TransactionStatus
  /** Code provided by the financial institution for the transaction type, not unique. */
  providerCode?: string
  /** Additional data related to payment or transfers */
  paymentData?: TransactionPaymentData
  /** Additional data related to the merchant associated to the transaction */
  merchant?: TransactionMerchantData
}
