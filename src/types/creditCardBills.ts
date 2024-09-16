import { CurrencyCode } from './common'

export const CREDIT_CARD_BILL_FINANCE_CHARGE_TYPES = [
  'LATE_PAYMENT_REMUNERATIVE_INTEREST',
  'LATE_PAYMENT_FEE',
  'LATE_PAYMENT_INTEREST',
  'IOF',
  'OTHER',
] as const

export type CreditCardBillFinanceChargeType = typeof CREDIT_CARD_BILL_FINANCE_CHARGE_TYPES[number]

export type CreditCardBills = {
  id: string
  dueDate: Date
  totalAmount: number
  totalAmountCurrencyCode: CurrencyCode
  minimumPaymentAmount: number | null
  allowsInstallments: boolean | null
  financeCharges: CreditCardBillFinanceChargeResponseItem[]
  createdAt: Date
  updatedAt: Date
}

export type CreditCardBillFinanceChargeResponseItem = {
  id: string
  type: CreditCardBillFinanceChargeType
  amount: number
  currencyCode: CurrencyCode
  additionalInfo: string | null
}
