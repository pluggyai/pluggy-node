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
  /** Automatically invested balance */
  automaticallyInvestedBalance: number | null
  /** Overdraft contracted limit */
  overdraftContractedLimit: number | null
  /** Overdraft used limit */
  overdraftUsedLimit: number | null
  /** Unarranged overdraft amount */
  unarrangedOverdraftAmount: number | null
  /** Whether the account has any active reserved balances ("saldo reservado"),
   * such as goal-based savings ("caixinhas") or judicial holds */
  hasReservedBalance: boolean | null
  /** Funds reserved/earmarked on the account. Only present when hasReservedBalance
   * is true and the institution exposes the data */
  reservedBalances: ReservedBalance[] | null
}

export type ReservedBalance = {
  /** User-given name for the reservation (for example, 'Caixinha Para Férias') */
  name: string | null
  /** Unique identifier of the reservation */
  identification: string
  /** Available amount(s) in the reservation, one entry per remuneration band */
  amounts: ReservedBalanceAmount[]
}

export type ReservedBalanceAmount = {
  /** Reserved amount */
  amount: number
  /** Amount currency code (for example, BRL) */
  currencyCode: CurrencyCode
  /** Remuneration applied to the reserved amount */
  remuneration: ReservedBalanceRemuneration | null
}

export type ReservedBalanceRemuneration = {
  /** Pre-fixed remuneration rate, as a fraction (for example, 0.3 = 30%) */
  preFixedRate: number | null
  /** Post-fixed indexer percentage, as a fraction (for example, 1.1 = 110% of the indexer) */
  postFixedIndexerPercentage: number | null
  /** Rate type */
  rateType: 'LINEAR' | 'EXPONENCIAL' | null
  /** Indexer used as remuneration reference (for example, CDI, IPCA, SELIC) */
  indexer: string | null
  /** Calculation basis */
  calculation: 'DIAS_UTEIS' | 'DIAS_CORRIDOS' | null
  /** Rate periodicity */
  ratePeriodicity: 'MENSAL' | 'ANUAL' | 'DIARIO' | 'SEMESTRAL' | null
  /** Additional indexer info, required when indexer is OUTROS */
  indexerAdditionalInfo: string | null
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
  /** If the credit card limit is flexible. */
  isLimitFlexible: boolean | null
  /** Credit card status. */
  status: 'ACTIVE' | 'BLOCKED' | 'CANCELLED' | null
  /** Credit card holder type. */
  holderType: 'MAIN' | 'ADDITIONAL' | null
}
