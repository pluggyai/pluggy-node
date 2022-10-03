import {
  DeserializedAccount,
  DeserializedIdentityResponse,
  DeserializedInvestment,
  DeserializedItem,
  DeserializedTransaction,
} from './types/deserialized'
import { PageResponse } from './types/common'
import { Account } from './types/account'
import { IdentityResponse } from './types/identity'
import { Item } from './types/item'
import { Investment } from './types/investment'
import { Transaction } from './types/transaction'

// these functions works very similar to React/Redux Reducers, it transform a remote response to a typed object instances

export function transformAccount(account: DeserializedAccount): Account {
  return {
    ...account,
    creditData: account.creditData && {
      ...account.creditData,
      balanceCloseDate:
        account.creditData.balanceCloseDate && new Date(account.creditData.balanceCloseDate),
      balanceDueDate:
        account.creditData.balanceDueDate && new Date(account.creditData.balanceDueDate),
    },
  }
}

export function transformIdentity(identity: DeserializedIdentityResponse): IdentityResponse {
  return {
    ...identity,
    birthDate: identity.birthDate && new Date(identity.birthDate),
    createdAt: new Date(identity.createdAt),
    updatedAt: new Date(identity.updatedAt)
  }
}

export function transformInvestment(investment: DeserializedInvestment): Investment {
  return {
    ...investment,
    date: investment.date && new Date(investment.date),
    dueDate: investment.dueDate && new Date(investment.dueDate),
    issueDate: investment.issueDate && new Date(investment.issueDate),
    transactions: investment.transactions.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date),
      tradeDate: new Date(transaction.tradeDate),
    })),
  }
}

export function transformItem(item: DeserializedItem): Item {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    lastUpdatedAt: item.lastUpdatedAt && new Date(item.lastUpdatedAt),
  }
}

export function transformTransaction(transaction: DeserializedTransaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  }
}

export function transformPageResponse<T, K>(transformCb: (data: T) => K) {
  const finalTransform = (response: PageResponse<T>): PageResponse<K> => ({
    ...response,
    results: response.results.map(transformCb),
  })

  return finalTransform
}
