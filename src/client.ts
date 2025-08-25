import { BaseApi, ClientParams } from './baseApi'
import { PluggyPaymentsClient } from './paymentsClient'
import {
  Account,
  AccountType,
  Category,
  Connector,
  ConnectorFilters,
  ConnectTokenOptions,
  CreateItemOptions,
  CreateWebhook,
  IdentityResponse,
  Investment,
  InvestmentTransaction,
  InvestmentType,
  Item,
  PageResponse,
  Parameters,
  Transaction,
  TransactionFilters,
  UpdateWebhook,
  Webhook,
  Loan,
  PageFilters,
  InvestmentsFilters,
  AccountStatement,
} from './types'
import { CreditCardBills } from './types/creditCardBills'
import { ValidationResult } from './types/validation'

/**
 * Creates a new client instance for interacting with Pluggy API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyClient} a client for making requests
 */
export class PluggyClient extends BaseApi {
  public payments: PluggyPaymentsClient

  constructor(params: ClientParams) {
    super(params)
    this.payments = new PluggyPaymentsClient(params)
  }

  /**
   * Fetch all available connectors
   * @returns {PageResponse<Connector>} paged response of connectors
   */
  async fetchConnectors(options: ConnectorFilters = {}): Promise<PageResponse<Connector>> {
    return await this.createGetRequest('connectors', options)
  }

  /**
   * Fetch a single Connector
   * @param id The Connector ID
   * @returns {Connector} a connector object
   */
  async fetchConnector(id: number): Promise<Connector> {
    return await this.createGetRequest(`connectors/${id}`)
  }

  /**
   * Fetch a single item
   * @param id The Item ID
   * @returns {Item} a item object
   */
  async fetchItem(id: string): Promise<Item> {
    return await this.createGetRequest(`items/${id}`)
  }

  /**
   * Check that connector parameters are valid
   * @param id The Connector ID
   * @param parameters A map of name and value for the credentials to be validated
   * @returns {ValidationResult} an object with the info of which parameters are wrong
   */
  async validateParameters(id: number, parameters: Parameters): Promise<ValidationResult> {
    return await this.createPostRequest(`connectors/${id}/validate`, null, parameters)
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
    return await this.createPostRequest(`items`, null, {
      connectorId,
      parameters,
      ...(options || {}),
    })
  }

  /**
   * Updates an item
   * @param id The Item ID
   * @param parameters A map of name and value for the credentials to be updated.
   *                   Optional; if none submitted, an Item update will be attempted with the latest used credentials.
   * @returns {Item} a item object
   */
  async updateItem(
    id: string,
    parameters?: Parameters,
    options?: CreateItemOptions
  ): Promise<Item> {
    return await this.createPatchRequest(`items/${id}`, null, {
      id,
      parameters,
      ...(options || {}),
    })
  }

  /**
   * Send MFA for item execution
   * @param id The Item ID
   * @param parameters A map of name and value for the mfa requested
   * @returns {Item} a item object
   */
  async updateItemMFA(id: string, parameters: Parameters = undefined): Promise<Item> {
    return await this.createPostRequest(`items/${id}/mfa`, null, parameters)
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
   * @returns {PageResponse<Account>} paged response of accounts
   */
  async fetchAccounts(itemId: string, type?: AccountType): Promise<PageResponse<Account>> {
    return await this.createGetRequest('accounts', { itemId, type })
  }

  /**
   * Fetch a single account
   * @returns {Account} an account object
   */
  async fetchAccount(id: string): Promise<Account> {
    return await this.createGetRequest(`accounts/${id}`)
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
    return await this.createGetRequest('transactions', { ...options, accountId })
  }

  /**
   * Fetch all transactions from an account
   * @param accountId The account id
   * @returns {Transaction[]} an array of transactions
   */
  async fetchAllTransactions(accountId: string): Promise<Transaction[]> {
    const MAX_PAGE_SIZE = 500
    const { totalPages, results: firstPageResults } = await this.fetchTransactions(accountId, {
      pageSize: MAX_PAGE_SIZE,
    })
    if (totalPages === 1) {
      // just one page return transactions
      return firstPageResults
    }

    const transactions: Transaction[] = [...firstPageResults]

    // first page already fetched
    let page = 1

    while (page < totalPages) {
      page++
      const paginatedTransactions = await this.fetchTransactions(accountId, {
        page,
        pageSize: MAX_PAGE_SIZE,
      })
      transactions.push(...paginatedTransactions.results)
    }

    return transactions
  }

  /**
   * Fetch account statements from an account
   * @param accountId The account id
   * @returns {PageResponse<AccountStatement[]>} object which contains the Account statements list and related paging data
   */
    async fetchAccountStatements(
      accountId: string
    ): Promise<PageResponse<AccountStatement>> {
      return await this.createGetRequest(`accounts/${accountId}/statements`)
    }

  /**
   * Post transaction user category for transactin
   * @param id The Transaction id
   *
   * @returns {Transaction} updated transaction object
   */
  async updateTransactionCategory(id: string, categoryId: string): Promise<Transaction> {
    return await this.createPatchRequest(`transactions/${id}`, null, {
      categoryId,
    })
  }

  /**
   * Fetch a single transaction
   *
   * @returns {Transaction} an transaction object
   */
  async fetchTransaction(id: string): Promise<Transaction> {
    return await this.createGetRequest(`transactions/${id}`)
  }

  /**
   * Fetch investments from an Item
   *
   * @param itemId The Item id
   * @returns {PageResponse<Investment>} paged response of investments
   */
  async fetchInvestments(
    itemId: string,
    type?: InvestmentType,
    options: InvestmentsFilters = {}
  ): Promise<PageResponse<Investment>> {
    return await this.createGetRequest('investments', {
      ...options,
      itemId,
      type,
    })
  }

  /**
   * Fetch a single investment
   *
   * @returns {Investment} an investment object
   */
  async fetchInvestment(id: string): Promise<Investment> {
    return await this.createGetRequest(`investments/${id}`)
  }

  /**
   * Fetch transactions from an investment
   *
   * @param investmentId The investment id
   * @param {TransactionFilters} options Transaction options to filter
   * @returns {PageResponse<InvestmentTransaction[]>} object which contains the transactions list and related paging data
   */
  async fetchInvestmentTransactions(
    investmentId: string,
    options: TransactionFilters = {}
  ): Promise<PageResponse<InvestmentTransaction>> {
    return await this.createGetRequest(`investments/${investmentId}/transactions`, {
      ...options,
      investmentId,
    })
  }

  /**
   * Fetch all investment transactions from an investment
   * @param investmentId The investment id
   * @returns {InvestmentTransaction[]} an array of investment transactions
   */
  async fetchAllInvestmentTransactions(investmentId: string): Promise<InvestmentTransaction[]> {
    const MAX_PAGE_SIZE = 500
    const {
      totalPages,
      results: firstPageResults,
    } = await this.fetchInvestmentTransactions(investmentId, { pageSize: MAX_PAGE_SIZE })
    if (totalPages === 1) {
      return firstPageResults
    }

    const transactions: InvestmentTransaction[] = [...firstPageResults]

    let page = 1

    while (page < totalPages) {
      page++
      const paginatedTransactions = await this.fetchInvestmentTransactions(investmentId, {
        page,
        pageSize: MAX_PAGE_SIZE,
      })
      transactions.push(...paginatedTransactions.results)
    }

    return transactions
  }

  /**
   * Fetch loans from an Item
   *
   * @param {string} itemId
   * @param {PageFilters} options - request search filters
   * @returns {Promise<PageResponse<Loan>>} - paged response of loans
   */
  async fetchLoans(itemId: string, options: PageFilters = {}): Promise<PageResponse<Loan>> {
    return await this.createGetRequest('loans', { ...options, itemId })
  }

  /**
   * Fetch loan by id
   *
   * @param {string} id - the loan id
   * @returns {Promise<Loan>} - loan object, if found
   */
  async fetchLoan(id: string): Promise<Loan> {
    return await this.createGetRequest(`loans/${id}`)
  }

  /**
   * Fetch the identity resource
   * @returns {IdentityResponse} an identity object
   */
  async fetchIdentity(id: string): Promise<IdentityResponse> {
    return await this.createGetRequest(`identity/${id}`)
  }

  /**
   * Fetch the identity resource by it's Item ID
   * @returns {IdentityResponse} an identity object
   */
  async fetchIdentityByItemId(itemId: string): Promise<IdentityResponse> {
    return await this.createGetRequest(`identity?itemId=${itemId}`)
  }

  /**
   * Fetch credit card bills from an accountId
   * @returns {PageResponse<CreditCardBills>} an credit card bills object
   */
  async fetchCreditCardBills(
    accountId: string,
    options: PageFilters = {}
  ): Promise<PageResponse<CreditCardBills>> {
    return await this.createGetRequest('bills', { ...options, accountId })
  }

  /**
   * Fetch a single credit card bill by its id
   * @param {string} id - the credit card bill id
   * @returns {Promise<CreditCardBills>} - credit card bill object, if found
   */
  async fetchCreditCardBill(id: string): Promise<CreditCardBills> {
    return await this.createGetRequest(`bills/${id}`)
  }

  /**
   * Fetch all available categories
   * @returns {Categories[]} an paging response of categories
   */
  async fetchCategories(): Promise<PageResponse<Category>> {
    return await this.createGetRequest('categories')
  }

  /**
   * Fetch a single category
   * @returns {Category} a category object
   */
  async fetchCategory(id: string): Promise<Category> {
    return await this.createGetRequest(`categories/${id}`)
  }

  /**
   * Fetch a single webhook
   * @returns {Webhook} a webhook object
   */
  async fetchWebhook(id: string): Promise<Webhook> {
    return await this.createGetRequest(`webhooks/${id}`)
  }

  /**
   * Fetch all available webhooks
   * @returns {Webhook[]} a paging response of webhooks
   */
  async fetchWebhooks(): Promise<PageResponse<Webhook>> {
    return await this.createGetRequest('webhooks')
  }

  /**
   * Creates a Webhook
   * @param webhookParams - The webhook params to create, this includes:
   * - url: The url where will receive notifications
   * - event: The event to listen for
   * - headers (optional): The headers to send with the webhook
   * @returns {Webhook} the created webhook object
   */
  async createWebhook(
    event: CreateWebhook['event'],
    url: CreateWebhook['url'],
    headers?: CreateWebhook['headers']
  ): Promise<Webhook> {
    return await this.createPostRequest(`webhooks`, null, {
      event,
      url,
      headers,
    })
  }

  /**
   * Updates a Webhook
   * @param id - The Webhook ID
   * @param updatedWebhookParams - The webhook params to update
   * @returns {Webhook} The webhook updated
   */
  async updateWebhook(id: string, updatedWebhookParams: UpdateWebhook): Promise<Webhook> {
    return await this.createPatchRequest(`webhooks/${id}`, null, updatedWebhookParams)
  }

  /**
   * Deletes a Webhook
   */
  async deleteWebhook(id: string): Promise<void> {
    return await this.createDeleteRequest(`webhooks/${id}`)
  }

  /**
   * Creates a connect token that can be used as API KEY to connect items from the Frontend
   * @returns {string} Access token to connect items with restrict access
   */
  async createConnectToken(
    itemId?: string,
    options?: ConnectTokenOptions
  ): Promise<{ accessToken: string }> {
    return await this.createPostRequest(`connect_token`, null, { itemId, options })
  }
}
