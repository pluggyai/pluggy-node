import { BaseApi } from './baseApi'
import {
  PageResponse,
} from './types'
import { AcquirerAnticipation, AcquirerReceivable, AcquirerSale } from './types/acquirerOperations'
/**
 * Creates a new client instance for interacting with Pluggy API for the Acquirer API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyAcquirerClient} a client for making requests
 */
export class PluggyAcquirerClient extends BaseApi {
  
  /**
   * Fetch acquirer sale operations
   * @returns {PageResponse<AcquirerSale>} a paging response of AcquirerSale
   */
  async fetchSales(itemId: string): Promise<PageResponse<AcquirerSale>> {
    return this.createGetRequest('acquirer-sales', { itemId })
  }

    /**
   * Fetch acquirer sale receivables
   * @returns {PageResponse<AcquirerReceivable>} a paging response of AcquirerReceivable
   */
    async fetchReceivables(itemId: string): Promise<PageResponse<AcquirerReceivable>> {
      return this.createGetRequest('acquirer-receivables', { itemId })
    }

  /**
   * Fetch acquirer sale anticipations
   * @returns {PageResponse<AcquirerAnticipation>} a paging response of AcquirerAnticipation
   */
  async fetchAnticipations(itemId: string): Promise<PageResponse<AcquirerAnticipation>> {
    return this.createGetRequest('acquirer-anticipations', { itemId })
  }
}
