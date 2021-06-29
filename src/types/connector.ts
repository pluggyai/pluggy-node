export const CONNECTOR_TYPES = ['PERSONAL_BANK', 'BUSINESS_BANK', 'INVESTMENT'] as const
/**
 * @typedef ConnectorType
 * Type of connectors available
 */
export type ConnectorType = typeof CONNECTOR_TYPES[number]

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
  hasMfa: boolean
}

export type ConnectorFilters = {
  /** Connector´s name or alike name */
  name?: string
  /** list of countries to filter available connectors */
  countries?: string[]
  /** list of types to filter available connectors */
  types?: string[]
  /** recovers sandbox connectors. Default: false */
  sandbox?: boolean
}
