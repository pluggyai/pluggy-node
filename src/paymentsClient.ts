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
  CreateBulkPaymentFields,
  BulkPayment,
  CreateSmartAccount,
  SmartAccount,
  SmartAccountBalance,
  PaymentReceipt,
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

  /**
   * Create a bulk payment
   * @returns {BulkPayment} BulkPayment object
   */
  async createBulkPayment(payload: CreateBulkPaymentFields): Promise<BulkPayment> {
    return this.createPostRequest(`payments/bulk`, null, payload)
  }

  /**
   * Fetch a single bulk payment
   * @returns {BulkPayment} BulkPayment object
   */
  async fetchBulkPayment(id: string): Promise<BulkPayment> {
    return this.createGetRequest(`payments/bulk/${id}`)
  }

  /**
   * Fetch all bulk payments
   * @returns {PageResponse<BulkPayment>} paged response of bulk payments
   */
  async fetchBulkPayments(
    options: PaymentCustomersFilters = {}
  ): Promise<PageResponse<BulkPayment>> {
    return this.createGetRequest('payments/bulk', options)
  }

  /** Deletes the bulk payment */
  async deleteBulkPayment(id: string): Promise<void> {
    await this.createDeleteRequest(`payments/bulk/${id}`)
  }

  /**
   * Creates a smart account
   * @returns {SmartAccount} SmartAccount object
   */
  async createSmartAccount(payload: CreateSmartAccount): Promise<SmartAccount> {
    return this.createPostRequest(`payments/smart-accounts`, null, payload)
  }

  /**
   * Fetch a single smart account
   * @returns {SmartAccount} SmartAccount object
   */
  async fetchSmartAccount(id: string): Promise<SmartAccount> {
    return this.createGetRequest(`payments/smart-accounts/${id}`)
  }

  /**
   * Fetch a smart account current balance
   * @returns {SmartAccountBalance} SmartAccountBalance object
   */
  async fetchSmartAccountBalance(id: string): Promise<SmartAccountBalance> {
    return this.createGetRequest(`payments/smart-accounts/${id}/balance`)
  }

  /**
   * Fetch all smart accounts
   * @returns {PageResponse<SmartAccount>} paged response of smart accounts
   */
  async fetchSmartAccounts(
    options: PaymentCustomersFilters = {}
  ): Promise<PageResponse<SmartAccount>> {
    return this.createGetRequest('payments/smart-accounts', options)
  }

  /**
   * Creates a payment request receipt
   * @param id ID of the payment request
   */
  async createPaymentRequestReceipt(id: string): Promise<PaymentReceipt> {
    return await this.createPostRequest(`payments/requests/${id}/receipt`)
  }

  /**
   * Fetch all payment request receipts
   * @param id ID of the payment request
   */
  async fetchPaymentRequestReceipts(id: string): Promise<PageResponse<PaymentReceipt>> {
    return this.createGetRequest(`payments/requests/${id}/receipts`)
  }

  /**
   * Fetch a single payment request receipt
   * @param requestId ID of the payment request
   * @param receiptId ID of the payment request receipt
   */
  async fetchPaymentRequestReceipt(requestId: string, receiptId: string): Promise<PaymentReceipt> {
    return this.createGetRequest(`payments/requests/${requestId}/receipts/${receiptId}`)
  }
}
