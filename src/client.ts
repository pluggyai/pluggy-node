import { BaseApi } from './baseApi'
import {
  TransactionFilters,
  AccountType,
  InvestmentType,
  Category,
  Investment,
  Transaction,
  Account,
  Connector,
  ConnectorFilters,
  Item,
  PageResponse,
  CreateWebhook,
  WebhookEvent,
  IdentityResponse,
  ConnectTokenOptions,
  CreateItemOptions,
  Webhook,
} from './types'
import {
  transformAccount,
  transformIdentity,
  transformInvestment,
  transformItem,
  transformPageResponse,
  transformTransaction,
} from './transforms'
import { ValidationResult } from './types/validation'

/**
 * Creates a new client instance for interacting with Pluggy API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyClient} a client for making requests
 */
export class PluggyClient extends BaseApi {
  /**
   * Fetch all available connectors
   * @returns {Connector[]} an array of connectors
   */
  async fetchConnectors(options: ConnectorFilters = {}): Promise<PageResponse<Connector>> {
    return this.createGetRequest('connectors', { ...options })
  }

  /**
   * Fetch a single Connector
   * @param id The Connector ID
   * @returns {Connector} a connector object
   */
  async fetchConnector(id: number): Promise<Connector> {
    return this.createGetRequest(`connectors/${id}`)
  }

  /**
   * Fetch a single item
   * @param id The Item ID
   * @returns {Item} a item object
   */
  async fetchItem(id: string): Promise<Item> {
    return this.createGetRequest(`items/${id}`, null, transformItem)
  }

  /**
   * Check that connector parameters are valid
   * @param id The Connector ID
   * @param parameters A map of name and value for the credentials to be validated
   * @returns {ValidationResult} an object with the info of which parameters are wrong
   */
  async validateParameters(
    id: number,
    parameters: Record<string, string>
  ): Promise<ValidationResult> {
    return this.createPostRequest(`connectors/${id}/validate`, null, parameters)
  }

  /**
   * Creates an item
   * @param connectorId The Connector's id
   * @param parameters A map of name and value for the needed credentials
   * @param options Options available to set to the item
   * @returns {Item} a item object
   */
  async createItem(
    connectorId: number,
    parameters: Record<string, string>,
    options?: CreateItemOptions
  ): Promise<Item> {
    return this.createPostRequest(`items`, null, {
      connectorId,
      parameters,
      ...(options || {}),
      transformItem,
    })
  }

  /**
   * Updates an item
   * @param id The Item ID
   * @param parameters A map of name and value for the credentials to be updated
   * @returns {Item} a item object
   */
  async updateItem(id: string, parameters: { [key: string]: string } = undefined): Promise<Item> {
    return this.createPatchRequest(
      `items/${id}`,
      null,
      {
        id,
        parameters,
      },
      transformItem
    )
  }

  /**
   * Send MFA for item execution
   * @param id The Item ID
   * @param parameters A map of name and value for the mfa requested
   * @returns {Item} a item object
   */
  async updateItemMFA(
    id: string,
    parameters: { [key: string]: string } = undefined
  ): Promise<Item> {
    return this.createPostRequest(`items/${id}/mfa`, null, parameters, transformItem)
  }

  /**
   * Deletes an item
   */
  async deleteItem(id: string): Promise<void> {
    await this.createDeleteRequest(`items/${id}`)
  }

  /**
   * Fetch accounts from an Item
   * @param itemId The Item id
   * @returns {Account[]} an array of accounts
   */
  async fetchAccounts(itemId: string, type?: AccountType): Promise<PageResponse<Account>> {
    return this.createGetRequest(
      'accounts',
      { itemId, type },
      transformPageResponse(transformAccount)
    )
  }

  /**
   * Fetch a single account
   * @returns {Account} an account object
   */
  async fetchAccount(id: string): Promise<Account> {
    return this.createGetRequest(`accounts/${id}`, null, transformAccount)
  }

  /**
   * Fetch transactions from an account
   * @param accountId The account id
   * @param {TransactionFilters} options Transaction options to filter
   * @returns {PageResponse<Transaction[]>} object which contains the transactions list and related paging data
   */
  async fetchTransactions(
    accountId: string,
    options: TransactionFilters = {}
  ): Promise<PageResponse<Transaction>> {
    return this.createGetRequest(
      'transactions',
      { ...options, accountId },
      transformPageResponse(transformTransaction)
    )
  }

  /**
   * Fetch all transactions from an account
   * @param accountId The account id
   * @returns {Transaction[]} an array of transactions
   */
  async fetchAllTransactions(accountId: string): Promise<Transaction[]> {
    const { totalPages, results: firstPageResults } = await this.fetchTransactions(accountId)
    if (totalPages === 1) {
      // just one page return transactions
      return firstPageResults
    }

    const transactions: Transaction[] = [...firstPageResults]

    // first page already fetched
    let page = 1

    while (page < totalPages) {
      page++
      const paginatedTransactions = await this.fetchTransactions(accountId, { page })
      transactions.push(...paginatedTransactions.results)
    }

    return transactions
  }

  /**
   * Post transaction user category for transactin
   * @param id The Transaction id
   *
   * @returns {Transaction} updated transaction object
   */
  async updateTransactionCategory(id: string, categoryId: string): Promise<Transaction> {
    return this.createPatchRequest(
      `transactions/${id}`,
      null,
      {
        categoryId,
      },
      transformTransaction
    )
  }

  /**
   * Fetch a single transaction
   * @returns {Transaction} an transaction object
   */
  async fetchTransaction(id: string): Promise<Transaction> {
    return this.createGetRequest(`transactions/${id}`, null, transformTransaction)
  }

  /**
   * Fetch investments from an Item
   * @param itemId The Item id
   * @returns {Investment[]} an array of investments
   */
  async fetchInvestments(itemId: string, type?: InvestmentType): Promise<PageResponse<Investment>> {
    return this.createGetRequest(
      'investments',
      { itemId, type },
      transformPageResponse(transformInvestment)
    )
  }

  /**
   * Fetch a single investment
   * @returns {Investment} an investment object
   */
  async fetchInvestment(id: string): Promise<Investment> {
    return this.createGetRequest(`investments/${id}`, null, transformInvestment)
  }

  /**
   * Fetch the identity resource
   * @returns {IdentityResponse} an identity object
   */
  async fetchIdentity(id: string): Promise<IdentityResponse> {
    return this.createGetRequest(`identity/${id}`, null, transformIdentity)
  }

  /**
   * Fetch the identity resource by it's Item ID
   * @returns {IdentityResponse} an identity object
   */
  async fetchIdentityByItemId(itemId: string): Promise<IdentityResponse> {
    return this.createGetRequest(`identity?itemId=${itemId}`, null, transformIdentity)
  }

  /**
   * Fetch all available categories
   * @returns {Categories[]} an paging response of categories
   */
  async fetchCategories(): Promise<PageResponse<Category>> {
    return this.createGetRequest('categories')
  }

  /**
   * Fetch a single category
   * @returns {Category} a category object
   */
  async fetchCategory(id: string): Promise<Category> {
    return this.createGetRequest(`categories/${id}`)
  }

  /**
   * Fetch a single webhook
   * @returns {Webhook} a webhook object
   */
  async fetchWebhook(id: string): Promise<Webhook> {
    return this.createGetRequest(`webhooks/${id}`)
  }

  /**
   * Fetch all available webhooks
   * @returns {Webhook[]} an paging response of webhooks
   */
  async fetchWebhooks(): Promise<PageResponse<Webhook>> {
    return this.createGetRequest('webhooks')
  }

  /**
   * Creates a Webhook
   * @param event The type of event to listen
   * @param url The url where will receive notifications
   * @returns {Webhook} a webhook object
   */
  async createWebhook(event: WebhookEvent, url: string): Promise<Webhook> {
    return this.createPostRequest(`webhooks`, null, {
      event,
      url,
    })
  }

  /**
   * Updates a Webhook
   * @param id The Webhook ID
   * @param webhook The webhook params to update
   * @returns {Webhook} The webhook updated
   */
  async updateWebhook(id: string, webhook: Partial<CreateWebhook>): Promise<Webhook> {
    return this.createPatchRequest(`webhooks/${id}`, null, webhook)
  }

  /**
   * Deletes a Webhook
   */
  async deleteWebhook(id: string): Promise<void> {
    return this.createDeleteRequest(`webhooks/${id}`)
  }

  /**
   * Creates a connect token that can be used as API KEY to connect items from the Frontend
   * @returns {string} Access token to connect items with restrict access
   */
  async createConnectToken(
    itemId?: string,
    options?: ConnectTokenOptions
  ): Promise<{ accessToken: string }> {
    return this.createPostRequest(`connect_token`, null, { itemId, options })
  }
}
