import { CurrencyCode } from './common'

export const ACCOUNT_TYPES = ['BANK', 'CREDIT'] as const
/**
 * @typedef AccountType
 * Type of account
 */
export type AccountType = typeof ACCOUNT_TYPES[number]

export const ACCOUNT_SUBTYPES = ['SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT', 'CREDIT_CARD'] as const
/**
 * @typedef AccountSubType
 * Type of account
 */
export type AccountSubType = typeof ACCOUNT_SUBTYPES[number]

export type Account = {
  /** Primary identifier of the account */
  id: string
  /** Primary identifier of the Item */
  itemId: string
  /** Type of the account */
  type: AccountType
  /** Sub type of the account */
  subtype: AccountSubType
  /** Account's financial institution number */
  number: string
  /** Current balance of the account */
  balance: number
  /** Account's name or description */
  name: string
  /** Account's name provided by the institution based on the level of client. */
  marketingName: string | null
  /** Account's owner´s fullname */
  owner: string | null
  /** Account's owner´s tax number */
  taxNumber: string | null
  /** ISO Currency code of the account's amounts */
  currencyCode: CurrencyCode
  /** Account related bank data, when account is BANK type */
  bankData: BankData | null
  /** Account related credit data, when account is CREDIT type */
  creditData: CreditData | null
}

export type BankData = {
  /** primary identifier of the account to make bank transfers */
  transferNumber: string | null
  /** available balance of the account */
  closingBalance: number | null
}

export type CreditData = {
  /** Credit card end user's level */
  level: string | null
  /** Credit card brand, ie. Mastercard, Visa */
  brand: string | null
  /** Current balance close date */
  balanceCloseDate: Date | null
  /** Current balance due date */
  balanceDueDate: Date | null
  /** Available credit limit to use. */
  availableCreditLimit: number | null
  /** Current balance in foreign currency */
  balanceForeignCurrency: number | null
  /** Current balance minimum payment due */
  minimumPayment: number | null
  /** Maximum credit card limit. */
  creditLimit: number | null
}
