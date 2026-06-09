import { CurrencyCode } from './common'

export const CREDIT_CARD_BILL_FINANCE_CHARGE_TYPES = [
  'LATE_PAYMENT_REMUNERATIVE_INTEREST',
  'LATE_PAYMENT_FEE',
  'LATE_PAYMENT_INTEREST',
  'IOF',
  'OTHER',
] as const

export type CreditCardBillFinanceChargeType = typeof CREDIT_CARD_BILL_FINANCE_CHARGE_TYPES[number]

export const CREDIT_CARD_BILL_PAYMENT_VALUE_TYPES = [
  'INSTALLMENT_PAYMENT',
  'FULL_PAYMENT',
  'OTHER_PAYMENT',
] as const

export type CreditCardBillPaymentValueType = typeof CREDIT_CARD_BILL_PAYMENT_VALUE_TYPES[number]

export const CREDIT_CARD_BILL_PAYMENT_MODES = [
  'DEBIT_ACCOUNT',
  'BANK_SLIP',
  'PAYROLL_DEDUCTION',
  'PIX',
] as const

export type CreditCardBillPaymentMode = typeof CREDIT_CARD_BILL_PAYMENT_MODES[number]

export type CreditCardBills = {
  id: string
  dueDate: Date
  totalAmount: number
  totalAmountCurrencyCode: CurrencyCode
  minimumPaymentAmount: number | null
  allowsInstallments: boolean | null
  financeCharges: CreditCardBillFinanceChargeResponseItem[]
  /** List of payments associated to the bill */
  payments: CreditCardBillPayment[]
  createdAt: Date
  updatedAt: Date
}

export type CreditCardBillPayment = {
  id: string
  /** Classifies the payment value type */
  valueType: CreditCardBillPaymentValueType
  /** Date when the payment was made */
  paymentDate: Date
  /** Payment mode used */
  paymentMode: CreditCardBillPaymentMode | null
  /** Payment amount */
  amount: number
  /** Code referencing the currency of the payment */
  currencyCode: CurrencyCode
}

export type CreditCardBillFinanceChargeResponseItem = {
  id: string
  type: CreditCardBillFinanceChargeType
  amount: number
  currencyCode: CurrencyCode
  additionalInfo: string | null
}
