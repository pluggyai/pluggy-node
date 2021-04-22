export type ConnectorType = 'PERSONAL_BANK' | 'BUSINESS_BANK' | 'INVESTMENT'

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
  type?: 'text' | 'password' | 'number' | 'image' | 'select'
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
