import { BaseApi } from './baseApi'
import {
  PageResponse,
  CreatePaymentIntent,
  CreatePaymentRequest,
  PaymentIntent,
  PaymentIntentsFilters,
  PaymentRequest,
  PaymentRequestsFilters,
  PaymentCustomer,
  CreatePaymentCustomer,
  PaymentCustomersFilters,
  CreatePaymentRecipient,
  PaymentRecipient,
  PaymentRecipientsFilters,
  UpdatePaymentRecipient,
  PaymentInstitution,
  PaymentInstitutionsFilters,
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

  /**
   * Creates a payment customer
   * @returns {PaymentCustomer} PaymentCustomer object
   */
  async createPaymentCustomer(payload: CreatePaymentCustomer): Promise<PaymentCustomer> {
    return this.createPostRequest(`payments/customers`, null, payload)
  }

  /**
   * Fetch a single payment customer
   * @returns {PaymentCustomer} PaymentCustomer object
   */
  async fetchPaymentCustomer(id: string): Promise<PaymentCustomer> {
    return this.createGetRequest(`payments/customers/${id}`)
  }

  /**
   * Fetch all payment customers
   * @returns {PageResponse<PaymentCustomer>} paged response of payment customers
   */
  async fetchPaymentCustomers(
    options: PaymentCustomersFilters = {}
  ): Promise<PageResponse<PaymentCustomer>> {
    return this.createGetRequest('payments/customers', { ...options })
  }

  /**
   * Delete a payment customer
   */
  async deletePaymentCustomer(id: string): Promise<void> {
    await this.createDeleteRequest(`payments/customers/${id}`)
  }

  async updatePaymentCustomer(
    id: string,
    payload: Partial<CreatePaymentCustomer>
  ): Promise<PaymentCustomer> {
    return this.createPatchRequest(`payments/customers/${id}`, null, payload)
  }

  /**
   * Creates a payment recipient (bank account)
   * @returns {PaymentRecipient} PaymentRecipient object
   */
  async createPaymentRecipient(payload: CreatePaymentRecipient): Promise<PaymentRecipient> {
    return this.createPostRequest(`payments/recipients`, null, payload)
  }

  /**
   * Fetch a single payment recipient
   * @returns {PaymentRecipient} PaymentRecipient object
   */
  async fetchPaymentRecipient(id: string): Promise<PaymentRecipient> {
    return this.createGetRequest(`payments/recipients/${id}`)
  }

  /**
   * Fetch all payment recipients
   * @returns {PageResponse<PaymentRecipient>} paged response of payment recipients
   */
  async fetchPaymentRecipients(
    options: PaymentRecipientsFilters = {}
  ): Promise<PageResponse<PaymentRecipient>> {
    return this.createGetRequest('payments/recipients', { ...options })
  }

  /**
   * Delete a payment recipient
   */
  async deletePaymentRecipient(id: string): Promise<void> {
    await this.createDeleteRequest(`payments/recipients/${id}`)
  }

  /**
   * Update a payment recipient
   * @param id ID of the payment recipient
   * @param payload Fields to update
   * @returns {PaymentRecipient} PaymentRecipient object
   */
  async updatePaymentRecipient(
    id: string,
    payload: UpdatePaymentRecipient
  ): Promise<PaymentRecipient> {
    return this.createPatchRequest(`payments/recipients/${id}`, null, payload)
  }

  /**
   * Fetch a single payment recipient institution
   * @returns {PaymentInstitution} PaymentInstitution object
   */
  async fetchPaymentInstitution(id: string): Promise<PaymentInstitution> {
    return this.createGetRequest(`payments/recipients/institutions/${id}`)
  }

  /**
   * Fetch all payment recipient institutions
   * @returns {PageResponse<PaymentInstitution>} paged response of payment recipient institutions
   */
  async fetchPaymentInstitutions(
    options: PaymentInstitutionsFilters
  ): Promise<PageResponse<PaymentInstitution>> {
    return this.createGetRequest('payments/recipients/institutions', { ...options })
  }
}
