import { Account, CreditData } from './account'
import { IdentityResponse } from './identity'
import { Investment, InvestmentTransaction } from './investment'
import { CreateItemOptions, Item } from './item'
import { Transaction } from './transaction'

export type DeserializedAccount = Omit<Account, 'creditData'> & {
  creditData: Omit<CreditData, 'balanceCloseDate' | 'balanceDueDate'> & {
    balanceCloseDate?: string
    balanceDueDate?: string
  }
}

export type DeserializedIdentityResponse = Omit<IdentityResponse, 'birthDate' | 'createdAt' | 'updatedAt'> & {
  birthDate?: string
  createdAt: string
  updatedAt: string
}

export type DeserializedInvestmentTransaction = Omit<
  InvestmentTransaction,
  'date' | 'tradeDate'
> & {
  date: string
  tradeDate: string
}

export type DeserializedInvestment = Omit<
  Investment,
  'date' | 'dueDate' | 'issueDate' | 'transactions'
> & {
  date?: string
  dueDate?: string
  issueDate?: string
  transactions: DeserializedInvestmentTransaction[]
}

export type DeserializedItem = CreateItemOptions &
  Omit<Item, 'createdAt' | 'lastUpdatedAt'> & {
    createdAt: string
    lastUpdatedAt?: string
  }

export type DeserializedTransaction = Omit<Transaction, 'date'> & {
  date: string
}
