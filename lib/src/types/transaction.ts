import { CurrencyCode } from './common'


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
}
