import { CurrencyCode } from './common'

export const INVESTMENT_TYPES = [
  'MUTUAL_FUND',
  'SECURITY',
  'EQUITY',
  'COE',
  'FIXED_INCOME',
  'ETF',
  'OTHER',
] as const
/**
 * @typedef InvestmentType
 * Type of investment
 */
export type InvestmentType = typeof INVESTMENT_TYPES[number]

export const INVESTMENT_STATUS = ['ACTIVE', 'PENDING', 'TOTAL_WITHDRAWAL'] as const
/**
 * @typedef InvestmentStatus
 * Status of investment
 */
export type InvestmentStatus = typeof INVESTMENT_STATUS[number]

export const COE_INVESTMENT_SUBTYPES = [
  /*! COE */
  'STRUCTURED_NOTE',
] as const
export type CoeInvestmentSubtype = typeof COE_INVESTMENT_SUBTYPES[number]

export const MUTUAL_FUND_INVESTMENT_SUBTYPES = [
  /*! Default subtype */
  'INVESTMENT_FUND',
  /*! Multimercados */
  'MULTIMARKET_FUND',
  /*! Fundos de Renda Fixa */
  'FIXED_INCOME_FUND',
  /*! Fundos de Acoes */
  'STOCK_FUND',
  /*! Fundos de ETF */
  'ETF_FUND',
  /*! Fundos Offshores */
  'OFFSHORE_FUND',
  /*! Fundos de Multiestratégia */
  'FIP_FUND',
  /*! Fundos de Cambio/Cambial */
  'EXCHANGE_FUND',
] as const
export type MutualFundInvestmentSubtype = typeof MUTUAL_FUND_INVESTMENT_SUBTYPES[number]

export const SECURITY_INVESTMENT_SUBTYPES = ['RETIREMENT'] as const
export type SecurityInvestmentSubtype = typeof SECURITY_INVESTMENT_SUBTYPES[number]

export const EQUITY_INVESTMENT_SUBTYPES = [
  'STOCK',
  'ETF',
  'REAL_ESTATE_FUND',
  /*! BRAZILIAN_DEPOSITARY_RECEIPT */
  'BDR',
  'DERIVATIVES',
  'OPTION',
] as const
export type EquityInvestmentSubtype = typeof EQUITY_INVESTMENT_SUBTYPES[number]

export const FIXED_INCOME_INVESTMENT_SUBTYPES = [
  /*! FIXED_INCOME */
  'TREASURY',
  /*! Real State Credit Bill */
  'LCI',
  /*! AGRICULTURAL_CREDIT_BILL */
  'LCA',
  /*! CERTIFICATE_OF_DEPOSIT */
  'CDB',
  /*! REAL_ESTATE_RECEIVABLE_CERTIFICATE */
  'CRI',
  /*! AGRICULTURAL_RECEIVABLE_CERTIFICATE */
  'CRA',
  'CORPORATE_DEBT',
  /*! BILL_OF_EXCHANGE */
  'LC',
  'DEBENTURES',
] as const
export type FixedIncomeInvestmentSubtype = typeof FIXED_INCOME_INVESTMENT_SUBTYPES[number]

export const INVESTMENT_SUBTYPES = [
  ...MUTUAL_FUND_INVESTMENT_SUBTYPES,
  ...SECURITY_INVESTMENT_SUBTYPES,
  ...EQUITY_INVESTMENT_SUBTYPES,
  ...FIXED_INCOME_INVESTMENT_SUBTYPES,
  ...COE_INVESTMENT_SUBTYPES,
  'OTHER',
] as const

export type InvestmentSubtype = typeof INVESTMENT_SUBTYPES[number]

export const INVESTMENT_TRANSACTION_TYPE = [
  'BUY',
  'SELL',
  /*! Tax applied to the investment ie. "Come Contas" */
  'TAX',
  'TRANSFER',
] as const
export type InvestmentTransactionType = typeof INVESTMENT_TRANSACTION_TYPE[number]

/*!
  For extra details visit: https://docs.pluggy.ai/docs/investment-1
  RateTypes represent the index from where the rate is based.
*/
export const INVESTMENT_RATE_TYPES = ['SELIC', 'CDI', 'EURO', 'DOLAR', 'IGPM', 'IPCA']

export type InvestmentRateType = typeof INVESTMENT_RATE_TYPES[number]

export type Expenses = {
  /** Service tax that varies according to state */
  serviceTax: number | null
  /** Commission charged by the brokerage for carrying out transactions on the stock market */
  brokerageFee: number | null
  /** Income Tax Withholding, amount paid to the Internal Revenue Service */
  incomeTax: number | null
  /** Sum of other not defined expenses */
  other: number | null
  /** Fee of Notice of Trading in Assets */
  tradingAssetsNoticeFee: number | null
  /** Fees charged by BM&F Bovespa in negotiations */
  maintenanceFee: number | null
  /** Liquidation fee for the settlement of a position on the expiration date or the financial settlement of physical delivery */
  settlementFee: number | null
  /** Registration fee */
  clearingFee: number | null
  /** Fees charged by BM&F Bovespa as a source of operating income  */
  stockExchangeFee: number | null
  /** Fee by brokers to keep recordsin their home broker systems or on the trading desk */
  custodyFee: number | null
  /** Amount paid to the Operator for the intermediation service  */
  operatingFee: number | null
}

export type InvestmentMetadata = {
  /** Regime of the tax used for the asset */
  taxRegime: string | null
  /** Asset proposal number identification */
  proposalNumber: string | null
  /** Process identification number from the institution (susep) */
  processNumber: string | null
}

export type InvestmentTransaction = {
  /** Primary identifier of the transacion */
  id: string
  /** Type of the transaction */
  type: InvestmentTransactionType | null
  /** Identifier of the related operation */
  operationId: string | null
  /** Description of the transaction */
  description: string | null
  /** Investment identifier related to the transaction */
  investmentId: string | null
  /** Quantity of quotas purchased */
  quantity: number | null
  /** Value of the purchased quotas */
  value: number | null
  /** Amount spent or withrawaled from the investment. */
  amount: number | null
  /** Date the transaction was placed. */
  date: Date
  /** Date the transaction was confirmed */
  tradeDate: Date | null
  /** Number of the corresponding brokerage note */
  brokerageNumber: string | null
  /** Value including expenses */
  netAmount: number | null
  /** Taxes and fees that apply */
  expenses: Expenses | null
}

/** institution holding the investment */
export type InvestmentInstitution = {
  /** Full name of the institution */
  name: string | null
  /** Number identifier for the institution CNPJ / Other */
  number: string | null
}

export type Investment = {
  id: string
  /** Unique primary identifier for the investment available for the hole country. In brazil is CNPJ. */
  code: string
  /** Unique FI provider identifier that attach's the owner to an investment and its available as a reference. */
  number: string
  /** 12-character ISIN, a globally unique identifier */
  isin: string | null
  /** Item identifier asscoiated with the investment */
  itemId: string
  /** Type of investment associated. */
  type: InvestmentType
  /** Subtype of investment */
  subtype: InvestmentSubtype | null
  /** Primary name for the investment */
  name: string
  /** Currency ISO code where amounts are shown */
  currencyCode: CurrencyCode
  /** Quota's date | Value's Date. (Quota's are related to MUTUAL_FUNDS or ETF, others use the investment amount reference date) */
  date: Date | null
  /** Value of the adquired quantity. (Quota's are related to MUTUAL_FUNDS or ETF, others usually default to the amount) */
  value: number | null
  /** Quota's quantity adquired. (Quota's are related to MUTUAL_FUNDS or ETF, others usually default to 1) */
  quantity: number | null
  /** Rent type taxes associated (I.R , Ingresos Brutos) */
  taxes: number | null
  /** Financial type taxes associated (Impuesto Operaciones Financieras) */
  taxes2: number | null
  /** Net worth balance / amount of the investment. Is the real current value. */
  balance: number
  /** Current gross amount of the investment pre-taxes. (As a general rule, `Value` * `Quantity` = `Amount`) */
  amount: number | null
  /** Available for withdraw balance. */
  amountWithdrawal: number | null
  /** Amount that was gained / loss from the investment */
  amountProfit: number | null
  /** Original amount deposited in the investment */
  amountOriginal: number | null
  /** Date when the investment is due. (Normally FIXED_INCOME investments have a dueDate) */
  dueDate: Date | null
  /** Entity name that issued the investment. (Normally FIXED_INCOME investments are issued by an entity) */
  issuer: string | null
  /** Date when the investment was issued. (Normally FIXED_INCOME investments are issued by an entity) */
  issueDate: Date | null
  /** Fixed rate for the investment. (Normally only available in FIXED_INCOME types) */
  rate: number | null
  /** Fixed rate type for the investment, ie. CDI. (Normally only available in FIXED_INCOME types) */
  rateType: InvestmentRateType | null
  /** Fixed annual rate for the investment, ie. 10.5. (Normally only available in FIXED_INCOME types) */
  fixedAnnualRate: number | null
  /** Previous months rate value of the investment */
  lastMonthRate: number | null
  /** Calendar annual rate, is a percentage of how it performed. (Normally only available in MUTUAL_FUNDS or ETF types) */
  annualRate: number | null
  /**  Last 12 month rate, is a percentage of how it performed. (Normally only available in MUTUAL_FUNDS or ETF types) */
  lastTwelveMonthsRate: number | null
  /** Current status of the investment */
  status: InvestmentStatus | null
  /** Transactions made related to the investment, like adquisitions (BUY) or withdrawals (SELL). */
  transactions: InvestmentTransaction[] | null
  /** Investment tax information */
  metadata: InvestmentMetadata | null
  /** Name of the owner */
  owner: string | null
  /** Provider institution internal identifier for the investment */
  providerId: string | null
  /** Financial institution holder  of the investment */
  institution: InvestmentInstitution | null
}
