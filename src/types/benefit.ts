import { CurrencyCode } from './common'

export type Benefit = {
  /*! Primary identifier of the entity */
  id: string
  /*! Related item id */
  itemId: string
  /*! Number of the benefit */
  number: number
  /*! Benefit type */
  type: string
  /*! Name of the beneficiary */
  beneficiaryName: string
  /*! Base value of the margin */
  marginBaseValue?: number
  /*! Available margin value */
  availableMarginValue?: number
  /*! Used margin value */
  usedMarginValue?: number
  /*! Reserved margin value */
  reservedMarginValue?: number
  /*! Available margin value for take new deductible loans */
  deductibleAvailableMarginValue?: number
  /*! Paying institution */
  payingInstitution?: BenefitPayingInstitution
  /*! Loans asociated to the benefit */
  loans?: BenefitLoan[]
}

export type BenefitPayingInstitution = {
  /*! Institution code in which the benefits is paid */
  code?: number
  /*! Institution name in which the benefits is paid */
  name?: string
  /* Agency in which the benefit is paid */
  agency?: string
  /* Account in which the benefit is paid */
  account?: string
}

export type BenefitLoan = {
  /*! Unique identifier for the contract */
  contractCode: string
  /*! CNPJ (Brazilian company ID) of the original contract creditor */
  cnpjOriginalContractCreditor?: string
  /*! Effective interest rate of the contract */
  effectiveInterestRate?: number
  /*! Total Effective Cost (CET) annual rate */
  cetAnnualRate?: number
  /*! Total Effective Cost (CET) month rate */
  cetMonthRate?: number
  /*! Currency code in which the contract is denominated */
  currencyCode: CurrencyCode
  /*! Amortization regime of the loan (e.g., SAC, Price) */
  amortizationRegime?: string
  /*! Date when the contract was signed */
  operationHiringDate: Date
  /*! Total number of installments for the loan */
  installmentsQuantity: number
  /*! Value of each installment */
  installmentsValue: number
  /*! Due date of the first installment */
  dueDateFirstInstallment?: Date
  /*! Due date of the last installment */
  dueDateLastInstallment?: Date
  /*! CNPJ of the corresponding banking institution */
  cnpjCorrespondentBanking?: string
  /*! Client information */
  client: BenefitLoanClientContractInformation
  /*! PDF Contract in base 64 */
  pdfContract?: string
}

export type BenefitLoanClientContractInformation = {
  /*! Document ID of the client (e.g., CPF or CNPJ) */
  document: string
  /*! Name of the client */
  name: string
  /*! Phone number of the client */
  phone?: string
  /*! Street address of the client */
  addressStreet?: string
  /*! Street number of the client's address */
  addressNumber?: string
  /*! City of the client's address */
  addressCity?: string
  /*! ZIP code of the client's address */
  addressZipCode?: string
  /*! State of the client's address */
  addressState?: string
}
