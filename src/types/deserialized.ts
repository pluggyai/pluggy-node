import { Account, CreditData } from './account'
import { IdentityResponse } from './identity'
import { Investment, InvestmentTransaction } from './investment'
import { CreateItemOptions, Item, ItemProductsStatusDetail, ItemProductState } from './item'
import { Transaction } from './transaction'
import { Opportunity } from './opportunity'
import { ConnectorCredential } from './connector'

export type DeserializedAccount = Omit<Account, 'creditData'> & {
  creditData: Omit<CreditData, 'balanceCloseDate' | 'balanceDueDate'> & {
    balanceCloseDate?: string
    balanceDueDate?: string
  }
}

export type DeserializedIdentityResponse = Omit<
  IdentityResponse,
  'birthDate' | 'createdAt' | 'updatedAt'
> & {
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

type DeserializedConnectorCredential = Omit<ConnectorCredential, 'expiresAt'> & {
  expiresAt?: string
}

export type DeserializedItemProductState = Omit<ItemProductState, 'lastUpdatedAt'> & {
  lastUpdatedAt: string | null
}

export type DeserializedItemProductsStatusDetail = Omit<
  ItemProductsStatusDetail,
  'accounts' | 'creditCards' | 'transactions' | 'investments' | 'identity' | 'paymentData'
> & {
  accounts: DeserializedItemProductState | null
  creditCards: DeserializedItemProductState | null
  transactions: DeserializedItemProductState | null
  investments: DeserializedItemProductState | null
  identity: DeserializedItemProductState | null
  paymentData: DeserializedItemProductState | null
}

export type DeserializedItem = Omit<
  Item,
  'createdAt' | 'updatedAt' | 'lastUpdatedAt' | 'parameter' | 'statusDetail'
> & {
  parameter: DeserializedConnectorCredential | null
  createdAt: string
  updatedAt: string
  lastUpdatedAt: string | null
  statusDetail: DeserializedItemProductsStatusDetail | null
}

export type DeserializedTransaction = Omit<Transaction, 'date'> & {
  date: string
}

export type DeserializedOpportunity = Omit<Opportunity, 'date'> & {
  date: string
}
