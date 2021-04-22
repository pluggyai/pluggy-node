import { CurrencyCode } from './common'


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

export type TransactionFilters = {
  /** Filter greater than date. Format (ISO Date | yyyy-mm-dd) */
  to?: string
  /** Filter greater than date. Format (ISO Date | yyyy-mm-dd) */
  from?: string
  /** Amount of transactions to retrieve */
  pageSize?: number
  /** Page of transactions to retrieve, this calculates the offset */
  page?: number
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
  /** Amount of the transaction */
  amount: number
  /** Current balance of the trasaction, after transaction was made. */
  balance: number
  /** ISO Currency code of the Transaction */
  currencyCode: CurrencyCode
  /** Assigned category of the transaction. */
  category?: string
  /** Code provided by the financial institution for the transaction type, not unique. */
  providerCode?: string
  /** Additional data related to payment or transfers */
  paymentData?: TransactionPaymentData
}
