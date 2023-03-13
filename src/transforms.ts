import {
  DeserializedAccount,
  DeserializedIdentityResponse,
  DeserializedInvestment,
  DeserializedItem,
  DeserializedOpportunity,
  DeserializedItemProductsStatusDetail,
  DeserializedTransaction,
  DeserializedItemProductState,
  DeserializedInvestmentTransaction,
} from './types/deserialized'
import {
  Account,
  IdentityResponse,
  Investment,
  InvestmentTransaction,
  Item,
  ItemProductsStatusDetail,
  ItemProductState,
  Opportunity,
  PageResponse,
  Transaction,
} from './types'

// these functions works very similar to React/Redux Reducers, it transform a remote response to a typed object instances

export function transformAccount(account: DeserializedAccount): Account {
  return {
    ...account,
    creditData: account.creditData && {
      ...account.creditData,
      balanceCloseDate: account.creditData.balanceCloseDate
        ? new Date(account.creditData.balanceCloseDate)
        : null,
      balanceDueDate: account.creditData.balanceDueDate
        ? new Date(account.creditData.balanceDueDate)
        : null,
    },
  }
}

export function transformIdentity(identity: DeserializedIdentityResponse): IdentityResponse {
  return {
    ...identity,
    birthDate: identity.birthDate ? new Date(identity.birthDate) : null,
    createdAt: new Date(identity.createdAt),
    updatedAt: new Date(identity.updatedAt),
  }
}

export function transformInvestment(investment: DeserializedInvestment): Investment {
  return {
    ...investment,
    date: investment.date ? new Date(investment.date) : null,
    dueDate: investment.dueDate ? new Date(investment.dueDate) : null,
    issueDate: investment.issueDate ? new Date(investment.issueDate) : null,
    transactions: investment.transactions.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date),
      tradeDate: new Date(transaction.tradeDate),
    })),
  }
}

function transformItemStatusDetailProductState(
  itemProductState: DeserializedItemProductState
): ItemProductState {
  return {
    ...itemProductState,
    lastUpdatedAt: itemProductState.lastUpdatedAt ? new Date(itemProductState.lastUpdatedAt) : null,
  }
}

function transformItemStatusDetail(
  statusDetail: DeserializedItemProductsStatusDetail
): ItemProductsStatusDetail {
  const { accounts, creditCards, identity, investments, paymentData, transactions } = statusDetail

  return {
    accounts: accounts ? transformItemStatusDetailProductState(accounts) : null,
    creditCards: creditCards ? transformItemStatusDetailProductState(creditCards) : null,
    identity: identity ? transformItemStatusDetailProductState(identity) : null,
    investments: investments ? transformItemStatusDetailProductState(investments) : null,
    paymentData: paymentData ? transformItemStatusDetailProductState(paymentData) : null,
    transactions: transactions ? transformItemStatusDetailProductState(transactions) : null,
  }
}

export function transformItem(item: DeserializedItem): Item {
  return {
    ...item,
    parameter: item.parameter
      ? {
          ...item.parameter,
          expiresAt: item.parameter.expiresAt ? new Date(item.parameter.expiresAt) : undefined,
        }
      : null,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
    statusDetail: item.statusDetail ? transformItemStatusDetail(item.statusDetail) : null,
  }
}

export function transformTransaction(transaction: DeserializedTransaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  }
}

export function transformInvestmentTransaction(
  transaction: DeserializedInvestmentTransaction
): InvestmentTransaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
    tradeDate: new Date(transaction.tradeDate),
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
