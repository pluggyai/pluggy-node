export const CONNECTOR_TYPES = ['PERSONAL_BANK', 'BUSINESS_BANK', 'INVESTMENT'] as const
/**
 * @typedef ConnectorType
 * Type of connectors available
 */
export type ConnectorType = typeof CONNECTOR_TYPES[number]

export const PRODUCT_TYPES = [
  'ACCOUNTS',
  'CREDIT_CARDS',
  'TRANSACTIONS',
  'PAYMENT_DATA',
  'INVESTMENTS',
  'INVESTMENTS_TRANSACTIONS',
  'IDENTITY',
  'BROKERAGE_NOTE',
  'OPPORTUNITIES',
] as const

export type ProductType = typeof PRODUCT_TYPES[number]

export const CREDENTIAL_TYPES = ['number', 'password', 'text', 'image', 'select'] as const
/**
 * @typedef CredentialType
 * credential type, used to show a proper form input to the user
 *  'number' -> numeric only data
 *  'text' -> alpha-numeric data
 *  'password' -> alpha-numeric password, must be obfuscated
 *  'image' -> a QR code needs to be decoded (QR is provided in the credential.data field)
 *  'select' -> credential has to be picked from values listed in credential.options field
 */
export type CredentialType = typeof CREDENTIAL_TYPES[number]

export type CredentialSelectOption = {
  /** Value of the option */
  value: string
  /** Displayable text or label of the option */
  label: string
}

export type ConnectorCredential = {
  /** parameter label that describes it */
  label: string
  /** parameter key name */
  name: string
  /** type of parameter to create the form */
  type?: CredentialType
  /** If parameter is used for MFA. */
  mfa?: boolean
  /** If parameter is image, base64 string is provided */
  data?: string
  /** Assistive information to help the user provide us the credential */
  assistiveText?: string
  /** Available options if credential is of type 'select' */
  options?: CredentialSelectOption[]
  /** Regex to validate input */
  validation?: string
  /** Error message of input validation on institution language */
  validationMessage?: string
  /** Input's placeholder for help */
  placeholder?: string
  /** Is this credential optional? */
  optional?: boolean
  /** Applies to MFA credential only - Detailed information that includes details/hints that the user should be aware of */
  instructions?: string
  /** Parameter expiration date, input value should be submitted before this date. */
  expiresAt?: Date
}

export type Connector = {
  /** Primary identifier of the connector */
  id: number
  /** Financial institution name */
  name: string
  /** Url of the institution that the connector represents */
  institutionUrl: string
  /** Image url of the institution. */
  imageUrl: string
  /** Primary color of the institution */
  primaryColor: string
  /** Type of the connector */
  type: ConnectorType
  /** Country of the institution */
  country: string
  /** List of parameters needed to execute the connector */
  credentials: ConnectorCredential[]
  /** Has MFA steps */
  hasMFA: boolean
  /** (only for OAuth connector) this URL is used to connect the user and on success it will redirect to create the new item */
  oauthUrl?: string
  /** object with information that descirbes current state of the institution connector
   * ONLINE - the connector is working as expected
   * OFFLINE - the connector is not currently available (API will refuse all connections with 400 status error)
   * UNSTABLE - the connector is working but with degraded performance
   */
  health?: {
    status: 'ONLINE' | 'OFFLINE' | 'UNSTABLE'
    stage: 'BETA' | null
  }
  /** list of products supported by the institution */
  products: ProductType[]
  /** Connector creation date */
  createdAt: Date
}

export type ConnectorFilters = {
  /** Connector´s name or alike name */
  name?: string
  /** list of countries to filter available connectors */
  countries?: string[]
  /** list of types to filter available connectors */
  types?: ConnectorType[]
  /** recovers sandbox connectors. Default: false */
  sandbox?: boolean
}
