import { CurrencyCode } from './common'

export type InvestmentType =
  | 'MUTUAL_FUND'
  | 'SECURITY'
  | 'EQUITY'
  | 'FIXED_INCOME'
  | 'ETF'
  | 'OTHER'

export type InvestmentStatus = 'ACTIVE' | 'PENDING' | 'TOTAL_WITHDRAWAL'

export type InvestmentTransaction = {
  /** Primary identifier of the transacion */
  id: string
  /** Type of the transaction */
  type: string
  /** Identifier of the related operation */
  operationId?: string
  /** Investment identifier related to the transaction */
  investmentId?: string
  /** Quantity of quotas purchased */
  quantity?: number
  /** Value of the purchased quotas */
  value?: number
  /** Amount spent or withrawaled from the investment. */
  amount: number
  /** Date the transaction was placed. */
  date: Date
  /** Date the transaction was confirmed */
  tradeDate: Date
}

export type Investment = {
  id: string
  /** Unique primary identifier for the investment available for the hole country. In brazil is CNPJ. */
  code: string
  /** Unique FI provider identifier that attach's the owner to an investment and its available as a reference. */
  number: string
  /** 12-character ISIN, a globally unique identifier */
  isin?: string
  /** Item identifier asscoiated with the investment */
  itemId: string
  /** Type of investment associated. */
  type: InvestmentType
  /** Primary name for the investment */
  name: string
  /** Currency ISO code where amounts are shown */
  currencyCode: CurrencyCode
  /** Quota's date | Value's Date. (Quota's are related to MUTUAL_FUNDS or ETF, others use the investment amount reference date) */
  date?: Date
  /** Value of the adquired quantity. (Quota's are related to MUTUAL_FUNDS or ETF, others usually default to the amount) */
  value?: number
  /** Quota's quantity adquired. (Quota's are related to MUTUAL_FUNDS or ETF, others usually default to 1) */
  quantity?: number
  /** Rent type taxes associated (I.R , Ingresos Brutos) */
  taxes?: number
  /** Financial type taxes associated (Impuesto Operaciones Financieras) */
  taxes2?: number
  /** Net worth balance / amount of the investment. Is the real current value. */
  balance: number
  /** Current gross amount of the investment pre-taxes. (As a general rule, `Value` * `Quantity` = `Amount`) */
  amount?: number
  /** Available for withdraw balance. */
  amountWithdrawal?: number
  /** Amount that was gained / loss from the investment */
  amountProfit?: number
  /** Original amount deposited in the investment */
  amountOriginal?: number
  /** Date when the investment is due. (Normally FIXED_INCOME investments have a dueDate) */
  dueDate?: Date
  /** Entity name that issued the investment. (Normally FIXED_INCOME investments are issued by an entity) */
  issuer?: string
  /** Date when the investment was issued. (Normally FIXED_INCOME investments are issued by an entity) */
  issueDate?: Date
  /** Fixed rate for the investment. (Normally only available in FIXED_INCOME types) */
  rate?: number
  /** Fixed rate type for the investment, ie. CDI. (Normally only available in FIXED_INCOME types) */
  rateType?: string
  /** Previous months rate value of the investment */
  lastMonthRate?: number
  /** Calendar annual rate, is a percentage of how it performed. (Normally only available in MUTUAL_FUNDS or ETF types) */
  annualRate?: number
  /**  Last 12 month rate, is a percentage of how it performed. (Normally only available in MUTUAL_FUNDS or ETF types) */
  lastTwelveMonthsRate?: number
  /** Current status of the investment */
  status?: InvestmentStatus
  /** Transactions made related to the investment, like adquisitions (BUY) or withdrawals (SELL). */
  transactions?: InvestmentTransaction[]
}
