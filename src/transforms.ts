import {
  DeserializedAccount,
  DeserializedIdentityResponse,
  DeserializedInvestment,
  DeserializedItem,
  DeserializedOpportunity,
  DeserializedTransaction,
} from './types/deserialized'
import { Account, IdentityResponse, Investment, Item, PageResponse, Transaction } from './types'
import { Opportunity } from './types/opportunity'

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
    updatedAt: new Date(identity.updatedAt),
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
    updatedAt: new Date(item.updatedAt),
    lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
  }
}

export function transformTransaction(transaction: DeserializedTransaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  }
}

export function transformOpportunity(opportunity: DeserializedOpportunity): Opportunity {
  return {
    ...opportunity,
    date: new Date(opportunity.date),
  }
}

/**
 * Helper to apply data transform, onto PageResponse results values.
 *
 * @param {(pageResults: T) => K} transformPageResults
 * @return {(response: PageResponse<T>) => PageResponse<K>}
 */
export function transformPageResponse<T, K>(
  transformPageResults: (pageResults: T) => K
): (response: PageResponse<T>) => PageResponse<K> {
  return (response: PageResponse<T>): PageResponse<K> => ({
    ...response,
    results: response.results.map(transformPageResults),
  })
}
