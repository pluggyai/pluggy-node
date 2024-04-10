type BankAccount = {
  account: string | null
  agency: string | null
  name: string | null
}

export type PaymentReceipt = {
  amount: number
  creditor: {
    bankAccount: BankAccount
    name: string | null
    taxNumber: string | null
  }
  date: string | null
  debtor: {
    bankAccount: BankAccount
    name: string | null
    taxNumber: string | null
  }
  description: string | null
  expiresAt: string
  id: string
  paymentRequestId: string
  receiptUrl: string
  referenceId: string
}
