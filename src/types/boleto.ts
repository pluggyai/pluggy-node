export type CreateBoletoConnection = {
  /** Connector identifier. The connector must have `supportsBoletoManagement` set to true */
  connectorId: number
  /** Credentials required for the connection (for Inter: clientId, clientSecret, certificate and privateKey) */
  credentials: Record<string, string>
}

export type CreateBoletoConnectionFromItem = {
  /** Item ID */
  itemId: string
}

export type BoletoConnection = {
  /** Primary identifier */
  id: string
  /** Primary identifier of the connector associated with this connection */
  connectorId: number
  /** Date when the connection was created */
  createdAt: Date
  /** Date when the connection was last updated */
  updatedAt: Date
}

export const BOLETO_FINE_TYPES = ['PERCENTAGE', 'FIXED'] as const
export type BoletoFineType = typeof BOLETO_FINE_TYPES[number]

export const BOLETO_INTEREST_TYPES = ['PERCENTAGE'] as const
export type BoletoInterestType = typeof BOLETO_INTEREST_TYPES[number]

export type BoletoFine = {
  /** Fine value */
  value: number
  /** Type of fine calculation */
  type: BoletoFineType
}

export type BoletoInterest = {
  /** Interest value */
  value: number
  /** Type of interest calculation */
  type: BoletoInterestType
}

export type CreateBoletoPayer = {
  /** Payer tax number (CPF/CNPJ) */
  taxNumber: string
  /** Payer name */
  name: string
  /** Payer street address */
  addressStreet?: string
  /** Payer city */
  addressCity?: string
  /** Payer state */
  addressState: string
  /** Payer ZIP code */
  addressZipCode: string
}

export type CreateBoleto = {
  /** Primary identifier of the boleto connection */
  boletoConnectionId: string
  boleto: {
    /** Your identifier for this boleto (max 10 characters) */
    seuNumero: string
    /** Boleto amount (minimum 2.5) */
    amount: number
    /** Due date for the boleto (ISO date-time). Must be today or in the future */
    dueDate: string
    payer: CreateBoletoPayer
    /** Fine information for late payment */
    fine?: BoletoFine
    /** Interest information for late payment */
    interest?: BoletoInterest
  }
}

export const BOLETO_STATUSES = ['OPEN', 'PAID', 'OVERDUE', 'CANCELLED', 'PROTESTED'] as const
/**
 * @typedef BoletoStatus
 * - OPEN: issued and awaiting payment
 * - PAID: paid (see `paidAt`, `amountPaid`, `paymentOrigin`)
 * - OVERDUE: the due date has passed and the boleto has not been paid
 * - CANCELLED: canceled by the issuer
 * - PROTESTED: sent to a protesto/credit-bureau process
 */
export type BoletoStatus = typeof BOLETO_STATUSES[number]

export const BOLETO_PAYMENT_ORIGINS = ['PIX', 'BOLETO'] as const
export type BoletoPaymentOrigin = typeof BOLETO_PAYMENT_ORIGINS[number]

export type IssuedBoletoPayer = CreateBoletoPayer & {
  /** Type of person (individual or business) */
  personType?: string
  /** Payer address number */
  addressNumber?: string
  /** Additional address information */
  addressComplement?: string
  /** Payer neighborhood */
  addressNeighborhood?: string
  /** Payer email */
  email?: string
  /** Payer area code */
  ddd?: string
  /** Payer phone number */
  phoneNumber?: string
}

export type IssuedBoleto = {
  /** Primary identifier */
  id: string
  /** Boleto amount */
  amount: number
  /** Current status of the boleto */
  status: BoletoStatus
  /** Your identifier for this boleto */
  seuNumero: string
  /** Due date of the boleto */
  dueDate: Date
  payer: IssuedBoletoPayer
  /** PIX QR code for payment */
  pixQr?: string
  /** Boleto digitable line */
  digitableLine: string
  /** Bank's internal identifier for the boleto */
  nossoNumero?: string
  /** Boleto barcode */
  barcode: string
  /** ID of the boleto connection used to create this boleto */
  boletoConnectionId: string
  /** Date when the boleto was created */
  createdAt: Date
  /** Amount that was paid for this boleto */
  amountPaid?: number | null
  /** Origin of the payment when the boleto is paid */
  paymentOrigin?: BoletoPaymentOrigin | null
  /** Fine information for late payment */
  fine?: BoletoFine | null
  /** Interest information for late payment */
  interest?: BoletoInterest
  /** Date when the boleto was paid */
  paidAt?: Date
}
