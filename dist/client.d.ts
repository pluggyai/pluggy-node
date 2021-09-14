import { BaseApi } from './baseApi';
import { TransactionFilters, AccountType, InvestmentType, Category, Investment, Transaction, Account, Connector, ConnectorFilters, Item, PageResponse, Webhook, WebhookEvent, IdentityResponse, ConnectTokenOptions, CreateItemOptions } from './types';
import { ValidationResult } from './types/validation';
/**
 * Creates a new client instance for interacting with Pluggy API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyClient} a client for making requests
 */
export declare class PluggyClient extends BaseApi {
    /**
     * Fetch all available connectors
     * @returns {Connector[]} an array of connectors
     */
    fetchConnectors(options?: ConnectorFilters): Promise<PageResponse<Connector>>;
    /**
     * Fetch a single Connector
     * @param id The Connector ID
     * @returns {Connector} a connector object
     */
    fetchConnector(id: number): Promise<Connector>;
    /**
     * Fetch all items from the client
     * @returns {Item[]} list of connected items
     */
    fetchItems(): Promise<PageResponse<Item>>;
    /**
     * Fetch a single item
     * @param id The Item ID
     * @returns {Item} a item object
     */
    fetchItem(id: string): Promise<Item>;
    /**
     * Check that connector parameters are valid
     * @param id The Connector ID
     * @param parameters A map of name and value for the credentials to be validated
     * @returns {ValidationResult} an object with the info of which parameters are wrong
     */
    validateParameters(id: number, parameters: Record<string, string>): Promise<ValidationResult>;
    /**
     * Creates an item
     * @param connectorId The Connector's id
     * @param parameters A map of name and value for the needed credentials
     * @param options Options available to set to the item
     * @returns {Item} a item object
     */
    createItem(connectorId: number, parameters: Record<string, string>, options?: CreateItemOptions): Promise<Item>;
    /**
     * Updates an item
     * @param id The Item ID
     * @param parameters A map of name and value for the credentials to be updated
     * @returns {Item} a item object
     */
    updateItem(id: string, parameters?: {
        [key: string]: string;
    }): Promise<Item>;
    /**
     * Send MFA for item execution
     * @param id The Item ID
     * @param parameters A map of name and value for the mfa requested
     * @returns {Item} a item object
     */
    updateItemMFA(id: string, parameters?: {
        [key: string]: string;
    }): Promise<Item>;
    /**
     * Deletes an item
     */
    deleteItem(id: string): Promise<void>;
    /**
     * Fetch accounts from an Item
     * @param itemId The Item id
     * @returns {Account[]} an array of accounts
     */
    fetchAccounts(itemId: string, type?: AccountType): Promise<PageResponse<Account>>;
    /**
     * Fetch a single account
     * @returns {Account} an account object
     */
    fetchAccount(id: string): Promise<Account>;
    /**
     * Fetch transactions from an account
     * @param accountId The account id
     * @param {TransactionFilters} options Transaction options to filter
     * @returns {Transaction[]} an array of transactions
     */
    fetchTransactions(accountId: string, options?: TransactionFilters): Promise<PageResponse<Transaction>>;
    /**
     * Fetch a single transaction
     * @returns {Transaction} an transaction object
     */
    fetchTransaction(id: string): Promise<Transaction>;
    /**
     * Fetch investments from an Item
     * @param itemId The Item id
     * @returns {Investment[]} an array of investments
     */
    fetchInvestments(itemId: string, type?: InvestmentType): Promise<PageResponse<Investment>>;
    /**
     * Fetch a single investment
     * @returns {Investment} an investment object
     */
    fetchInvestment(id: string): Promise<Investment>;
    /**
     * Fetch the identity resource
     * @returns {IdentityResponse} an identity object
     */
    fetchIdentity(id: string): Promise<IdentityResponse>;
    /**
     * Fetch the identity resource by it's Item ID
     * @returns {IdentityResponse} an identity object
     */
    fetchIdentityByItemId(itemId: string): Promise<IdentityResponse>;
    /**
     * Fetch all available categories
     * @returns {Categories[]} an paging response of categories
     */
    fetchCategories(): Promise<PageResponse<Category>>;
    /**
     * Fetch a single category
     * @returns {Category} a category object
     */
    fetchCategory(id: string): Promise<Category>;
    /**
     * Fetch a single webhook
     * @returns {Webhook} a webhook object
     */
    fetchWebhook(id: string): Promise<Webhook>;
    /**
     * Fetch all available webhooks
     * @returns {Webhook[]} an paging response of webhooks
     */
    fetchWebhooks(): Promise<PageResponse<Webhook>>;
    /**
     * Creates a Webhook
     * @param event The type of event to listen
     * @param url The url where will receive notifications
     * @returns {Webhook} a webhook object
     */
    createWebhook(event: WebhookEvent, url: string): Promise<Webhook>;
    /**
     * Updates a Webhook
     * @param id The Webhook ID
     * @param webhook The webhook params to update
     * @returns {Item} a item object
     */
    updateWebhook(id: string, webhook: Partial<Webhook>): Promise<Webhook>;
    /**
     * Deletes a Webhook
     */
    deleteWebhook(id: string): Promise<void>;
    /**
     * Creates a connect token that can be used as API KEY to connect items from the Frontend
     * @returns {string} Access token to connect items with restrict access
     */
    createConnectToken(itemId?: string, options?: ConnectTokenOptions): Promise<{
        accessToken: string;
    }>;
}
