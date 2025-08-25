import { CurrencyCode } from './common'

export type AccountStatement = {
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
  /*! Primary identifier of the entity */
  id: string
  /*! Month and year of the account statement */
  monthYear: string
  /*! Signed URL to download the account statement file, valid for 30 minutes*/
  url: string
}
