export type TriggeredBy = 'CLIENT' | 'USER' | 'SYNC' | 'INTERNAL'

const CONNECTOR_EXECUTION_STATUSES = [
  'LOGIN_IN_PROGRESS',
  'WAITING_USER_INPUT',
  'LOGIN_MFA_IN_PROGRESS',
  'ACCOUNTS_IN_PROGRESS',
  'TRANSACTIONS_IN_PROGRESS',
  'PAYMENT_DATA_IN_PROGRESS',
  'CREDITCARDS_IN_PROGRESS',
  'INVESTMENTS_IN_PROGRESS',
  'INVESTMENTS_TRANSACTIONS_IN_PROGRESS',
  'OPPORTUNITIES_IN_PROGRESS',
  'IDENTITY_IN_PROGRESS',
] as const

export type ConnectorExecutionStatus = typeof CONNECTOR_EXECUTION_STATUSES[number]

const EXECUTION_ERROR_CODES = [
  'INVALID_CREDENTIALS',
  'ALREADY_LOGGED_IN',
  'UNEXPECTED_ERROR',
  'INVALID_CREDENTIALS_MFA',
  'SITE_NOT_AVAILABLE',
  'ACCOUNT_LOCKED',
  'CONNECTION_ERROR',
  'ACCOUNT_NEEDS_ACTION',
  'USER_AUTHORIZATION_PENDING',
  'USER_AUTHORIZATION_NOT_GRANTED',
  'USER_INPUT_TIMEOUT',
] as const

export type ExecutionErrorCode = typeof EXECUTION_ERROR_CODES[number]

export const EXECUTION_FINISHED_STATUSES = [
  ...EXECUTION_ERROR_CODES,
  'MERGE_ERROR',
  'ERROR',
  'SUCCESS',
  'PARTIAL_SUCCESS',
] as const

export type ExecutionFinishedStatus = typeof EXECUTION_FINISHED_STATUSES[number]

const EXECUTION_STATUSES = [
  'CREATING',
  'CREATE_ERROR',
  'CREATED',
  ...CONNECTOR_EXECUTION_STATUSES,
  ...EXECUTION_FINISHED_STATUSES,
] as const

export type ExecutionStatus = typeof EXECUTION_STATUSES[number]

export type ExecutionErrorResultMetadata = {
  /** a provider id to relate the execution with an item, for example 'user_id'. useful to match webhook notifications with items */
  providerId?: string
  /** if the connector is MFA, this indicates if MFA credentials are required or not to continue the current execution */
  hasMFA?: boolean
  /** Credentials to be used in future executions. May differ or expand from the current execution credentials */
  credentials?: Record<string, string>
}

export type ExecutionErrorResult = {
  /** The specific execution error code */
  code: ExecutionErrorCode
  /** A human-readable, short description of the error */
  message: string
  /** The exact error message returned by the institution, if any was provided. */
  providerMessage?: string
  /** Only used in Caixa Connector, for the device authorization flow */
  metadata?: ExecutionErrorResultMetadata
  /** Unstructured properties that provide additional context/information of the error.
   * Used for some specific cases only, such as Caixa PF & PJ.
   * @see https://docs.pluggy.ai/docs/errors-validations for more info. */
  attributes?: Record<string, string>
}
