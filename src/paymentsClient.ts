import { BaseApi } from './baseApi'
import {
  PageResponse,
  CreatePaymentIntent,
  CreatePaymentRequest,
  PaymentIntent,
  PaymentIntentsFilters,
  PaymentRequest,
  PaymentRequestsFilters,
} from './types'
/**
 * Creates a new client instance for interacting with Pluggy API for the Payments API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {PluggyPaymentsClient} a client for making requests
 */
export class PluggyPaymentsClient extends BaseApi {
  /**
   * Creates a payment request
   * @returns {PaymentRequest} PaymentRequest object
   */
  async createPaymentRequest(paymentRequest: CreatePaymentRequest): Promise<PaymentRequest> {
    return this.createPostRequest(`payments/requests`, null, paymentRequest)
  }

  /**
   * Fetch a single payment request
   * @returns {PaymentRequest} PaymentRequest object
   */
  async fetchPaymentRequest(id: string): Promise<PaymentRequest> {
    return this.createGetRequest(`payments/requests/${id}`)
  }

  /**
   * Fetch all payment requests
   * @returns {PageResponse<PaymentRequest>} paged response of payment requests
   */
  async fetchPaymentRequests(
    options: PaymentRequestsFilters = {}
  ): Promise<PageResponse<PaymentRequest>> {
    return this.createGetRequest('payments/requests', { ...options })
  }

  /**
   * Delete a payment request
   */
  async deletePaymentRequest(id: string): Promise<void> {
    await this.createDeleteRequest(`payments/requests/${id}`)
  }

  /**
   * Creates a payment intent
   * @returns {PaymentIntent} PaymentIntent object
   */
  async createPaymentIntent(paymentIntent: CreatePaymentIntent): Promise<PaymentIntent> {
    return this.createPostRequest(`payments/intents`, null, paymentIntent)
  }

  /**
   * Fetch a single payment intent
   * @returns {PaymentIntent} PaymentIntent object
   */
  async fetchPaymentIntent(id: string): Promise<PaymentIntent> {
    return this.createGetRequest(`payments/intents/${id}`)
  }

  /**
   * Fetch all payment intents
   * @returns {PageResponse<PaymentIntent>} paged response of payment intents
   */
  async fetchPaymentIntents(
    options: PaymentIntentsFilters = {}
  ): Promise<PageResponse<PaymentIntent>> {
    return this.createGetRequest('payments/intents', { ...options })
  }
}
