import { BaseApi } from './baseApi'

/**
 * Creates a new client instance for interacting with Pluggy API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyClient} a client for making requests
 */
export class PluggyClient extends BaseApi{

  /**
   * Fetch all available connectors
   * @returns {Connector[]} an array of connectors
   */
  async fetchConnectors() {
    return this.createGetRequest('connectors')
  }
 
  /**
   * Fetch a single Connector
   * @param id The Connector ID
   * @returns {Connector} a connector object
   */
  async fetchConnector(id: number) {
    return this.createGetRequest(`connectors/${id}`)
  }

  /**
   * Fetch a single item
   * @param id The Item ID
   * @returns {Item} a item object
   */
  async fetchItem(id: string) {
    return this.createGetRequest(`items/${id}`)
  }

  /*
   * Fetch accounts from an Item
   * @param itemId The Item id
   * @returns {Account[]} an array of transactions
   */
  async fetchAccounts(itemId: string, type: string) {
    return this.createGetRequest(`accounts${this.mapToQueryString({ itemId, type })}`)
  }

  /**
   * Fetch transactions from an account
   * @param accountId The account id
   * @param from filter greater than date. Format (mm/dd/yyyy | yyyy-mm-dd)
   * @param to filter lower than date. Format (mm/dd/yyyy | yyyy-mm-dd)
   * @returns {Transaction[]} an array of transactions
   */
  async fetchTransactions(accountId: string, from: string | undefined, to: string | undefined) {
    return this.createGetRequest(`transactions${this.mapToQueryString({ from, to, accountId })}`)
  }
}
