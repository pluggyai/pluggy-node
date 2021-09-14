"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluggyClient = void 0;
const baseApi_1 = require("./baseApi");
const transforms_1 = require("./transforms");
/**
 * Creates a new client instance for interacting with Pluggy API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyClient} a client for making requests
 */
class PluggyClient extends baseApi_1.BaseApi {
    /**
     * Fetch all available connectors
     * @returns {Connector[]} an array of connectors
     */
    fetchConnectors(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('connectors', Object.assign({}, options));
        });
    }
    /**
     * Fetch a single Connector
     * @param id The Connector ID
     * @returns {Connector} a connector object
     */
    fetchConnector(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`connectors/${id}`);
        });
    }
    /**
     * Fetch all items from the client
     * @returns {Item[]} list of connected items
     */
    fetchItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`items`, null, transforms_1.transformPageResponse(transforms_1.transformItem));
        });
    }
    /**
     * Fetch a single item
     * @param id The Item ID
     * @returns {Item} a item object
     */
    fetchItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`items/${id}`, null, transforms_1.transformItem);
        });
    }
    /**
     * Check that connector parameters are valid
     * @param id The Connector ID
     * @param parameters A map of name and value for the credentials to be validated
     * @returns {ValidationResult} an object with the info of which parameters are wrong
     */
    validateParameters(id, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPostRequest(`connectors/${id}/validate`, null, parameters);
        });
    }
    /**
     * Creates an item
     * @param connectorId The Connector's id
     * @param parameters A map of name and value for the needed credentials
     * @param options Options available to set to the item
     * @returns {Item} a item object
     */
    createItem(connectorId, parameters, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPostRequest(`items`, null, Object.assign(Object.assign({ connectorId,
                parameters }, (options || {})), { transformItem: transforms_1.transformItem }));
        });
    }
    /**
     * Updates an item
     * @param id The Item ID
     * @param parameters A map of name and value for the credentials to be updated
     * @returns {Item} a item object
     */
    updateItem(id, parameters = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPatchRequest(`items/${id}`, null, {
                id,
                parameters,
            }, transforms_1.transformItem);
        });
    }
    /**
     * Send MFA for item execution
     * @param id The Item ID
     * @param parameters A map of name and value for the mfa requested
     * @returns {Item} a item object
     */
    updateItemMFA(id, parameters = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPostRequest(`items/${id}/mfa`, null, parameters, transforms_1.transformItem);
        });
    }
    /**
     * Deletes an item
     */
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDeleteRequest(`items/${id}`);
        });
    }
    /**
     * Fetch accounts from an Item
     * @param itemId The Item id
     * @returns {Account[]} an array of accounts
     */
    fetchAccounts(itemId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('accounts', { itemId, type });
        });
    }
    /**
     * Fetch a single account
     * @returns {Account} an account object
     */
    fetchAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`accounts/${id}`);
        });
    }
    /**
     * Fetch transactions from an account
     * @param accountId The account id
     * @param {TransactionFilters} options Transaction options to filter
     * @returns {Transaction[]} an array of transactions
     */
    fetchTransactions(accountId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('transactions', Object.assign(Object.assign({}, options), { accountId }), transforms_1.transformPageResponse(transforms_1.transformTransaction));
        });
    }
    /**
     * Fetch a single transaction
     * @returns {Transaction} an transaction object
     */
    fetchTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`transactions/${id}`, null, transforms_1.transformTransaction);
        });
    }
    /**
     * Fetch investments from an Item
     * @param itemId The Item id
     * @returns {Investment[]} an array of investments
     */
    fetchInvestments(itemId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('investments', { itemId, type });
        });
    }
    /**
     * Fetch a single investment
     * @returns {Investment} an investment object
     */
    fetchInvestment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`investments/${id}`);
        });
    }
    /**
     * Fetch the identity resource
     * @returns {IdentityResponse} an identity object
     */
    fetchIdentity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`identity/${id}`);
        });
    }
    /**
     * Fetch the identity resource by it's Item ID
     * @returns {IdentityResponse} an identity object
     */
    fetchIdentityByItemId(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`identity?itemId=${itemId}`);
        });
    }
    /**
     * Fetch all available categories
     * @returns {Categories[]} an paging response of categories
     */
    fetchCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('categories');
        });
    }
    /**
     * Fetch a single category
     * @returns {Category} a category object
     */
    fetchCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`categories/${id}`);
        });
    }
    /**
     * Fetch a single webhook
     * @returns {Webhook} a webhook object
     */
    fetchWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest(`webhooks/${id}`);
        });
    }
    /**
     * Fetch all available webhooks
     * @returns {Webhook[]} an paging response of webhooks
     */
    fetchWebhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createGetRequest('webhooks');
        });
    }
    /**
     * Creates a Webhook
     * @param event The type of event to listen
     * @param url The url where will receive notifications
     * @returns {Webhook} a webhook object
     */
    createWebhook(event, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPostRequest(`webhooks`, null, {
                event,
                url,
            });
        });
    }
    /**
     * Updates a Webhook
     * @param id The Webhook ID
     * @param webhook The webhook params to update
     * @returns {Item} a item object
     */
    updateWebhook(id, webhook) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPatchRequest(`webhooks/${id}`, null, webhook);
        });
    }
    /**
     * Deletes a Webhook
     */
    deleteWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createDeleteRequest(`webhooks/${id}`);
        });
    }
    /**
     * Creates a connect token that can be used as API KEY to connect items from the Frontend
     * @returns {string} Access token to connect items with restrict access
     */
    createConnectToken(itemId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createPostRequest(`connect_token`, null, { itemId, options });
        });
    }
}
exports.PluggyClient = PluggyClient;
