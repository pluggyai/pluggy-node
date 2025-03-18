import { CurrencyCode, PageFilters } from './common'

/**
 * @typedef TransactionType
 * The direction of the transaction.
 * If DEBIT money going out of the account.
 * If CREDIT money going into the account.
 */
export const TRANSACTION_TYPES = ['DEBIT', 'CREDIT'] as const
export type TransactionType = typeof TRANSACTION_TYPES[number]

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
}

export type TransactionPaymentParticipantDocument = {
  /** document number */
  value?: string
  /** Type of document provided, ie. CPF / CNPJ */
  type?: 'CPF' | 'CNPJ'
}

export type TransactionPaymentParticipant = {
  /** Document number object */
  documentNumber?: TransactionPaymentParticipantDocument
  /** Name of the participant */
  name?: string
  /** Number of the account */
  accountNumber?: string
  /** Number of the agency / branch */
  branchNumber?: string
  /** Number of the bank */
  routingNumber?: string
}

export type TransactionBoletoMetadataResponse = {
  /** Digitable line of the boleto */
  digitableLine: string | null
  /** Barcode of the boleto */
  barcode: string | null
  /** Base amount of the boleto */
  baseAmount: number | null
  /** Penalty amount of the boleto */
  penaltyAmount: number | null
  /** Interest amount of the boleto */
  interestAmount: number | null
  /** Discount amount of the boleto */
  discountAmount: number | null
}

export type TransactionPaymentData = {
  /** The identity of the sender of the transfer */
  payer?: TransactionPaymentParticipant
  /** The identity of the receiver of the transfer */
  receiver?: TransactionPaymentParticipant
  /**
   * String submitted by the receiver associated with the payment when generating the payment request.
   * i.e., When generating a Pix QR code, the receiver creates the request using their internal reference identifier.
   * This way, when the payment is done, they can map the payment to their internal reference.
   */
  receiverReferenceId?: string
  /** Identifier for the transaction provided by the institution */
  paymentMethod?: string
  /** The type of transfer used "PIX", "TED", "DOC". */
  referenceNumber?: string
  /** The payer description / motive of the transfer */
  reason?: string
  /** Additional data related to boleto transaction */
  boletoMetadata: TransactionBoletoMetadataResponse | null
}

export type TransactionMerchantData = {
  /** Name of the merchant */
  name: string
  /** Legal business name of the merchant */
  businessName: string
  /** Cnpj number associated to the merchant */
  cnpj: string
  /** Cnae number associated to the merchant */
  cnae?: string
  /** Category of the merchant */
  category?: string
}

export type CreditCardMetadata = {
  /** The number of the installment */
  installmentNumber?: number
  /** The total number of installments */
  totalInstallments?: number
  /** The amount of the installment */
  totalAmount?: number
  /** The MCC code of the counterpart */
  payeeMCC?: number
  /** The original date of the purchase */
  purchaseDate?: Date
}

export type TransactionFilters = PageFilters & {
  /** Filter less than date. Format can be ISO Date or 'YYYY-MM-dd' string. */
  to?: string
  /** Filter greater than date. Format can be ISO Date, or 'YYYY-MM-dd' string. */
  from?: string
}

export type Transaction = {
  /** Primary identifier of the transaction */
  id: string
  /** Primary identifier of the Account */
  accountId: string
  /** Date of the transaction that was made. */
  date: Date
  /** Transaction original description */
  description: string
  /** If available, raw description provided by the financial institution */
  descriptionRaw: string | null
  /** Transation type of movement */
  type: TransactionType
  /** Amount of the transaction */
  amount: number
  /** Amount of the transaction in account's currency */
  amountInAccountCurrency: number | null
  /** Current balance of the trasaction, after transaction was made. */
  balance: number
  /** ISO Currency code of the Transaction */
  currencyCode: CurrencyCode
  /** Assigned category of the transaction. */
  category: string | null
  /** Status of the transaction, default to `POSTED` */
  status?: TransactionStatus
  /** Code provided by the financial institution for the transaction type, not unique. */
  providerCode?: string
  /** Additional data related to payment or transfers */
  paymentData?: TransactionPaymentData
  /** Additional data related to credit card transaction */
  creditCardMetadata: CreditCardMetadata | null
  /** Additional data related to the merchant associated to the transaction */
  merchant?: TransactionMerchantData
  /** Category ID of the transaction */
  categoryId: string | null
  /** Operation type of the transaction */
  operationType: string | null
  /** Provider ID of the transaction. Only returned for Open Finance connectors */
  providerId: string | null
}
