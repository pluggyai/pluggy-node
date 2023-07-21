import { CurrencyCode } from './common'

const LOAN_INSTALLMENT_PERIODICITIES = [
  'WITHOUT_REGULAR_PERIODICITY',
  'WEEKLY',
  'FORTNIGHTLY',
  'MONTHLY',
  'BIMONTHLY',
  'QUARTERLY',
  'SEMESTERLY',
  'YEARLY',
  'OTHERS',
] as const

export type LoanInstallmentPeriodicity = typeof LOAN_INSTALLMENT_PERIODICITIES[number]

const LOAN_AMORTIZATION_TYPES = [
  'SAC',
  'PRICE',
  'SAM',
  'WITHOUT_AMORTIZATION_SYSTEM',
  'OTHERS',
] as const

export type LoanAmortizationScheduled = typeof LOAN_AMORTIZATION_TYPES[number]

const LOAN_TAX_TYPES = [
  'NOMINAL',
  'EFFECTIVE',
] as const

export type LoanTaxType = typeof LOAN_TAX_TYPES[number]

const LOAN_INTEREST_RATE_TYPES = [
  'SIMPLE',
  'COMPOUND',
] as const

export type LoanInterestRateType = typeof LOAN_INTEREST_RATE_TYPES[number]

const LOAN_TAX_PERIODICITIES = [
  'MONTHLY', // a.m - ao mês
  'YEARLY' // a.a. - ao ano
] as const

export type LoanTaxPeriodicity = typeof LOAN_TAX_PERIODICITIES[number]

const LOAN_FEE_CHARGE_TYPES = [
  'UNIQUE',
  'BY_INSTALLMENT',
] as const

export type LoanFeeChargeType = typeof LOAN_FEE_CHARGE_TYPES[number]

const LOAN_FEE_CHARGES = [
  'MINIMUM',
  'MAXIMUM',
  'FIXED',
  'PERCENTAGE',
] as const

export type LoanFeeCharge = typeof LOAN_FEE_CHARGES[number]

const LOAN_NUMBER_OF_INSTALLMENTS_TYPES = [
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
  'WITHOUT_TOTAL_PERIOD'
] as const

export type LoanNumberOfInstallmentsType = typeof LOAN_NUMBER_OF_INSTALLMENTS_TYPES[number]

const LOAN_CONTRACT_REMAINING_TYPES = [
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
  'WITHOUT_TOTAL_PERIOD',
  'WITHOUT REMAINING PERIOD',
] as const

export type LoanContractRemainingType = typeof LOAN_CONTRACT_REMAINING_TYPES[number]

export type LoanInterestRate = {
  /*! Tax type */
  taxType: LoanTaxType | null
  /*! Interest rate type */
  interestRateType: LoanInterestRateType | null
  /*! Tax periodicity */
  taxPeriodicity: LoanTaxPeriodicity | null
  /*! Calculation basis */
  calculation: string | null
  /*! Types of benchmark rates or indexers (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractReferentialRateIndexerType) */
  referentialRateIndexerType: string | null
  /*! Subtypes of benchmark rates or indexers (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractReferentialRateIndexerSubType) */
  referentialRateIndexerSubType: string | null
  /*! Free field to complement the information regarding the Type of reference rate or indexer */
  referentialRateIndexerAdditionalInfo: string | null
  /*! Pre-fixed rate applied under the credit modality contract. 1 = 100% */
  preFixedRate: number | null
  /*! Post-fixed rate applied under the credit modality contract. 1 = 100% */
  postFixedRate: number | null
  /*! Text with additional information on the composition of agreed interest rates */
  additionalInfo: string | null
}

export type LoanContractedFee = {
  /*! Agreed rate denomination */
  name: string | null
  /*! Acronym identifying the agreed rate */
  code: string | null
  /*! Charge type for the rate agreed in the contract */
  chargeType: LoanFeeChargeType | null
  /*! Billing method related to the tariff agreed in the contract */
  charge: LoanFeeCharge | null
  /*! Monetary value of the tariff agreed in the contract */
  amount: number | null
  /*! Rate value in percentage agreed in the contract */
  rate: number | null
}

export type LoanContractedFinanceCharge = {
  /*! Charge type agreed in the contract (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractFinanceChargeType) */
  type: string | null
  /*! Field for additional information */
  additionalInfo: string | null
  /*! Charge value in percentage agreed in the contract */
  rate: number | null
}

export type LoanWarranty = {
  /*! Code referencing the currency of the warranty */
  currencyCode: CurrencyCode | null
  /*! Denomination / Identification of the type of warranty that guarantees the Type of Credit Operation contracted (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumWarrantyType) */
  type: string | null
  /*! Denomination / Identification of the subtype of warranty that guarantees the Type of Credit Operation contracted (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumWarrantySubType) */
  subtype: string | null
  /*! Warranty original value */
  amount: number | null
}

export type LoanInstallmentBalloonPaymentAmount = {
  /*! Monetary value of the non-regular installment due */
  value: number | null
  /*! Code referencing the currency of the installment */
  currencyCode: CurrencyCode | null
}

export type LoanInstallmentBalloonPayment = {
  /*! Expiration date of the non-regular installment to expire from the contract of the consulted credit modality */
  dueDate: Date | null
  /*! Balloon payment amount */
  amount: LoanInstallmentBalloonPaymentAmount | null
}

export type LoanInstallments = {
  /*! Warranty original value */
  typeNumberOfInstallments: LoanNumberOfInstallmentsType | null
  /*! Total term according to the type referring to the type of credit informed */
  totalNumberOfInstallments: number | null
  /*! Type of remaining term of the contract referring to the type of credit informed */
  typeContractRemaining: LoanContractRemainingType | null
  /*! Remaining term according to the type referring to the credit type informed */
  contractRemainingNumber: number | null
  /*! Number of paid installments */
  paidInstallments: number | null
  /*! Number of due installments */
  dueInstallments: number | null
  /*! Number of overdue installments */
  pastDueInstallments: number | null
  /*! List that brings the due dates and value of the non-regular installments of the contract of the type of credit consulted */
  balloonPayments: LoanInstallmentBalloonPayment[] | null
}

export type LoanPaymentReleaseOverParcelFee = Pick<LoanContractedFee, 'name' | 'code' | 'amount'>

export type LoanPaymentReleaseOverParcelCharge = {
  /*! Charge type agreed in the contract (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractFinanceChargeType) */
  type: string | null
  /*! Free field to fill in additional information regarding the charge */
  additionalInfo: string | null
  /*! Payment amount of the charge paid outside the installment */
  amount: number | null
}

export type LoanPaymentReleaseOverParcel = {
  /*! List of fees that were paid outside the installment, only for single paymentPayment identifier under the responsibility of each transmitting Institution */
  fees: LoanPaymentReleaseOverParcelFee[] | null
  /*! List of charges that were paid out of installment */
  charges: LoanPaymentReleaseOverParcelCharge[] | null
}

export type LoanPaymentRelease = {
  /*! Payment identifier under the responsibility of each transmitting Institution */
  providerId: string | null
  /*! Identifies whether it is an agreed payment (false) or a one-time payment (true) */
  isOverParcelPayment: boolean | null
  /*! Installment identifier, responsibility of each transmitting Institution */
  installmentId: string | null
  /*! Effective date of payment referring to the contract of the credit modality consulted */
  paidDate: Date | null
  /*! Code referencing the currency of the payment */
  currencyCode: CurrencyCode | null
  /*! Payment amount referring to the contract of the credit modality consulted */
  paidAmount: number | null
  /*! Object of fees and charges that were paid outside the installment */
  overParcel: LoanPaymentReleaseOverParcel | null
}

export type LoanPayments = {
  /*! Amount required for the customer to settle the debt */
  contractOutstandingBalance: number | null
  /*! List of payments made in the period */
  releases: LoanPaymentRelease[] | null
}

export type Loan = {
  /*! Contract number given by the contracting institution */
  contractNumber: string | null
  /*! Standard contract number - IPOC (Identificação Padronizada da Operação de Crédito) */
  ipocCode: string | null
  /*! Denomination/Identification of the name of the credit operation disclosed to the customer */
  productName: string
  /*! Loan identifier under the responsibility of each transmitting Institution */
  providerId: string | null
  /*! Loan type (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractProductSubTypeLoans) */
  type: string | null
  /*! Date when the loan data was collected */
  date: Date | null
  /*! Date when the loan was contracted */
  contractDate: Date | null
  /*! Date when the loan was contracted */
  disbursementDates: Date[] | null
  /*! Loan settlement date */
  settlementDate: Date | null
  /*! Loan contracted value */
  contractAmount: number | null
  /*! Currency ISO code of the loan, ie BRL, USD. */
  currencyCode: CurrencyCode
  /*! Loan due date */
  dueDate: Date | null
  /*! Installments regular frequency */
  installmentPeriodicity: LoanInstallmentPeriodicity | null
  /*! Mandatory field to complement the information regarding the regular payment frequency when installmentPeriodicity has value 'OTHERS' */
  installmentPeriodicityAdditionalInfo: string | null
  /*! First installment due date */
  firstInstallmentDueDate: Date | null
  /*! CET - Custo Efetivo Total must be expressed as an annual percentage rate and incorporates all charges and expenses incurred in credit operations (interest rate, but also tariffs, taxes, insurance and other expenses charged) */
  CET: number | null
  /*! Amortization system (https://openbanking-brasil.github.io/openapi/swagger-apis/loans/?urls.primaryName=2.0.1#model-EnumContractAmortizationScheduled) */
  amortizationScheduled: LoanAmortizationScheduled | null
  /*! Mandatory field to complement the information regarding the scheduled amortization when it has value 'OTHERS' */
  amortizationScheduledAdditionalInfo: string | null
  /*! Consignor CNPJ */
  cnpjConsignee: string | null
  /*! Loan interest rates */
  interestRates: LoanInterestRate[] | null
  /*! List that brings the information of the tariffs agreed in the contract. */
  contractedFees: LoanContractedFee[] | null
  /*! List that brings the charges agreed in the contract */
  contractedFinanceCharges: LoanContractedFinanceCharge[] | null
  /*! Loan warranties */
  warranties: LoanWarranty[] | null
  /*! Set of information regarding the remaining term and the installments of a loan credit operation */
  installments: LoanInstallments | null
  /*! Loan contract payment data */
  payments: LoanPayments | null
}
