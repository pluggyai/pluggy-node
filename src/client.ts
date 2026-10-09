import { BaseApi, ClientParams } from './baseApi'
import { PluggyPaymentsClient } from './paymentsClient'
import {
  Account,
  AccountBalance,
  AccountType,
  Category,
  Connector,
  ConnectorFilters,
  ConnectTokenOptions,
  Consent,
  ConsentFilters,
  CreateItemOptions,
  CreateWebhook,
  IdentityResponse,
  Investment,
  InvestmentTransaction,
  InvestmentType,
  Item,
  ItemResource,
  ItemResourceFilters,
  ItemCursorFilters,
  CursorPageResponse,
  PageResponse,
  Parameters,
  Transaction,
  TransactionCursorFilters,
  TransactionFilters,
  UpdateWebhook,
  Webhook,
  Loan,
  PageFilters,
  InvestmentsFilters,
  AccountStatement,
  ScrFilters,
  ScrResponse,
  MerchantsResponse,
  ClientCategoryRule,
  CreateClientCategoryRule,
  BoletoConnection,
  CreateBoletoConnection,
  CreateBoletoConnectionFromItem,
  CreateBoleto,
  IssuedBoleto,
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
   * Fetch a single page of the team's items using cursor-based pagination (`GET /v2/items`),
   * newest first.
   *
   * ⚠️ Opt-in, paid plans only. Listing items is disabled by default and is only available to
   * paid-plan teams that have explicitly requested it from Pluggy support. Teams without it
   * enabled get `403 LIST_ITEMS_FEATURE_NOT_ENABLED`. For most integrations, store each `itemId`
   * when it is created (Pluggy Connect `onSuccess` or the `item/created` webhook) and use
   * {@link fetchItem} instead.
   *
   * @param {ItemCursorFilters} options Optional filters (clientUserId, connectorId, after cursor)
   * @returns {CursorPageResponse<Item>} object with results and the `next` page query string
   *   (e.g. `?connectorId=1&after=<cursor>`), or null on the last page
   */
  async fetchItemsCursor(options: ItemCursorFilters = {}): Promise<CursorPageResponse<Item>> {
    // Only whitelisted params are sent: the endpoint rejects unknown query parameters.
    const { clientUserId, connectorId, after } = options
    return await this.createGetRequest('v2/items', { clientUserId, connectorId, after })
  }

  /**
   * Fetch all of the team's items, following the cursor across every page (`GET /v2/items`),
   * newest first.
   *
   * ⚠️ Opt-in, paid plans only. Listing items is disabled by default and is only available to
   * paid-plan teams that have explicitly requested it from Pluggy support. Teams without it
   * enabled get `403 LIST_ITEMS_FEATURE_NOT_ENABLED`. For most integrations, store each `itemId`
   * when it is created (Pluggy Connect `onSuccess` or the `item/created` webhook) and use
   * {@link fetchItem} instead.
   *
   * @param {ItemCursorFilters} options Optional filters (clientUserId, connectorId)
   * @returns {Item[]} an array of all matching items
   */
  async fetchAllItems(options: Omit<ItemCursorFilters, 'after'> = {}): Promise<Item[]> {
    const firstPage = await this.fetchItemsCursor(options)
    const items: Item[] = [...firstPage.results]

    let next = firstPage.next

    while (next !== null) {
      const afterParam = new URL(next, this.baseUrl).searchParams.get('after')
      if (!afterParam) {
        break
      }
      const page = await this.fetchItemsCursor({ ...options, after: afterParam })
      items.push(...page.results)
      next = page.next
    }

    return items
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
   * Fetch the resources the financial institution declared for an Item's Open Finance consent.
   * Items on non Open Finance connectors return an empty page.
   * An empty list means the institution declared nothing only when the Item's
   * `resourcesCollectedAt` is set; when it is null, the list was never obtained.
   * @param itemId The Item id
   * @param {ItemResourceFilters} options - request search filters (page size defaults to 500)
   * @returns {PageResponse<ItemResource>} paged response of item resources
   */
  async fetchItemResources(
    itemId: string,
    options: ItemResourceFilters = {}
  ): Promise<PageResponse<ItemResource>> {
    return await this.createGetRequest(`items/${itemId}/resources`, options)
  }

  /**
   * Fetch the SCR (Bacen's Sistema de Informações de Crédito) for the document behind an Item.
   *
   * Opt-in: requires the SCR feature to be enabled for your team (ask Pluggy support); otherwise
   * 403 SCR_FEATURE_NOT_ENABLED. Only available for Open Finance items with a known CPF/CNPJ
   * (otherwise 422 SCR_ITEM_NOT_SUPPORTED).
   *
   * The response is Bacen's own payload, forwarded unchanged. Base dates are months (YYYYMM) and
   * Bacen consolidates each one with a few months of delay: when `from` and `to` are omitted the
   * last 4 available base dates are consulted, ending 2 months before the current one.
   * @param itemId The Item id
   * @param {ScrFilters} options - optional `from` / `to` base dates, as YYYYMM
   * @returns {ScrResponse} the SCR data for the Item's document
   */
  async fetchItemScr(itemId: string, options: ScrFilters = {}): Promise<ScrResponse> {
    return await this.createGetRequest(`items/${itemId}/scr`, { ...options })
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
   * Fetch the real-time balance of an account directly from the financial
   * institution connector, without requiring a full item sync.
   * @param id The Account ID
   * @returns {AccountBalance} an account balance object
   */
  async fetchAccountBalance(id: string): Promise<AccountBalance> {
    return await this.createGetRequest(`accounts/${id}/balance`)
  }

  /**
   * Fetch transactions from an account using page-based pagination.
   *
   * @deprecated Use {@link fetchTransactionsCursor} (single page) or
   * {@link fetchAllTransactions} (full sweep) instead. Both rely on the
   * `GET /v2/transactions` endpoint with cursor-based pagination, which
   * is more stable for long lists and supports the full filter set
   * (`dateTo`, `ids`, etc.). This page-based method is kept for
   * backward compatibility and will be removed in a future major
   * release.
   *
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
   * Fetch transactions from an account using cursor-based pagination
   * @param accountId The account id
   * @param {TransactionCursorFilters} options Optional filters (dateFrom, createdAtFrom, after cursor)
   * @returns {CursorPageResponse<Transaction>} object with results and next cursor link
   */
  async fetchTransactionsCursor(
    accountId: string,
    options: TransactionCursorFilters = {}
  ): Promise<CursorPageResponse<Transaction>> {
    return await this.createGetRequest('v2/transactions', { ...options, accountId })
  }

  /**
   * Fetch all transactions from an account using cursor-based pagination
   * @param accountId The account id
   * @param {TransactionCursorFilters} options Optional filters (dateFrom, createdAtFrom)
   * @returns {Transaction[]} an array of all transactions
   */
  async fetchAllTransactions(
    accountId: string,
    options: Omit<TransactionCursorFilters, 'after'> = {}
  ): Promise<Transaction[]> {
    const firstPage = await this.fetchTransactionsCursor(accountId, options)
    const transactions: Transaction[] = [...firstPage.results]

    let next = firstPage.next

    while (next !== null) {
      const afterParam = new URL(next, this.baseUrl).searchParams.get('after')
      if (!afterParam) {
        break
      }
      const page = await this.fetchTransactionsCursor(accountId, { ...options, after: afterParam })
      transactions.push(...page.results)
      next = page.next
    }

    return transactions
  }

  /**
   * Fetch account statements from an account
   * @param accountId The account id
   * @returns {PageResponse<AccountStatement[]>} object which contains the Account statements list and related paging data
   */
  async fetchAccountStatements(accountId: string): Promise<PageResponse<AccountStatement>> {
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
   * Fetch consents from an Item
   *
   * @param {string} itemId - the item id
   * @param {ConsentFilters} options - request search filters
   * @returns {Promise<PageResponse<Consent>>} - paged response of consents
   */
  async fetchConsents(itemId: string, options: ConsentFilters = {}): Promise<PageResponse<Consent>> {
    return await this.createGetRequest('consents', { ...options, itemId })
  }

  /**
   * Fetch consent by id
   *
   * @param {string} id - the consent id
   * @returns {Promise<Consent>} - consent object, if found
   */
  async fetchConsent(id: string): Promise<Consent> {
    return await this.createGetRequest(`consents/${id}`)
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
   * Fetch the category rules of your client
   * @returns {PageResponse<ClientCategoryRule>} paged response of category rules
   */
  async fetchCategoryRules(): Promise<PageResponse<ClientCategoryRule>> {
    return await this.createGetRequest('categories/rules')
  }

  /**
   * Create a category rule: transactions matching the description are assigned the given category
   * @param rule - the rule to create
   * @returns {ClientCategoryRule} the created category rule
   */
  async createCategoryRule(rule: CreateClientCategoryRule): Promise<ClientCategoryRule> {
    return await this.createPostRequest('categories/rules', null, rule)
  }

  /**
   * Delete a category rule. Clients can only delete their own rules.
   * @param id - the category rule id
   */
  async deleteCategoryRule(id: string): Promise<void> {
    await this.createDeleteRequest(`categories/rules/${id}`)
  }

  /**
   * Fetch merchant information for a list of CNPJs
   * @param cnpjs - list of CNPJs to look up (sent as a comma-separated list)
   * @returns {MerchantsResponse} found merchants, valid CNPJs that were not found, and invalid CNPJs
   */
  async fetchMerchants(cnpjs: string[]): Promise<MerchantsResponse> {
    return await this.createGetRequest('merchants', { cnpjs: cnpjs.join(',') })
  }

  /**
   * BETA: Boleto Management is in beta and may change.
   *
   * Create a boleto connection from the institution's credentials
   * @param payload - the connector id (with `supportsBoletoManagement`) and its credentials
   * @returns {BoletoConnection} the created boleto connection
   */
  async createBoletoConnection(payload: CreateBoletoConnection): Promise<BoletoConnection> {
    return await this.createPostRequest('boleto-connections', null, payload)
  }

  /**
   * BETA: Boleto Management is in beta and may change.
   *
   * Create a boleto connection from an existing Item
   * @param payload - the Item id
   * @returns {BoletoConnection} the created boleto connection
   */
  async createBoletoConnectionFromItem(
    payload: CreateBoletoConnectionFromItem
  ): Promise<BoletoConnection> {
    return await this.createPostRequest('boleto-connections/from-item', null, payload)
  }

  /**
   * BETA: Boleto Management is in beta and may change.
   *
   * Issue a boleto through a boleto connection
   * @param payload - the boleto connection id and the boleto data
   * @returns {IssuedBoleto} the issued boleto
   */
  async createBoleto(payload: CreateBoleto): Promise<IssuedBoleto> {
    return await this.createPostRequest('boletos', null, payload)
  }

  /**
   * BETA: Boleto Management is in beta and may change.
   *
   * Fetch a single issued boleto
   * @param id - the boleto id
   * @returns {IssuedBoleto} the issued boleto
   */
  async fetchBoleto(id: string): Promise<IssuedBoleto> {
    return await this.createGetRequest(`boletos/${id}`)
  }

  /**
   * BETA: Boleto Management is in beta and may change.
   *
   * Cancel an issued boleto
   * @param id - the boleto id
   * @returns {IssuedBoleto} the cancelled boleto
   */
  async cancelBoleto(id: string): Promise<IssuedBoleto> {
    return await this.createPostRequest(`boletos/${id}/cancel`)
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
