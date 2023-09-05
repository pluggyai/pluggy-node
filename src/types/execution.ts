export type TriggeredBy = 'CLIENT' | 'USER' | 'SYNC' | 'INTERNAL'

const CONNECTOR_EXECUTION_STATUSES = [
  'LOGIN_IN_PROGRESS',
  'WAITING_USER_INPUT',
  'WAITING_USER_ACTION',
  'LOGIN_MFA_IN_PROGRESS',
  'ACCOUNTS_IN_PROGRESS',
  'TRANSACTIONS_IN_PROGRESS',
  'PAYMENT_DATA_IN_PROGRESS',
  'CREDITCARDS_IN_PROGRESS',
  'INVESTMENTS_IN_PROGRESS',
  'INVESTMENTS_TRANSACTIONS_IN_PROGRESS',
  'OPPORTUNITIES_IN_PROGRESS',
  'IDENTITY_IN_PROGRESS',
  'PORTFOLIO_IN_PROGRESS',
  'INCOME_REPORTS_IN_PROGRESS',
  'LOANS_IN_PROGRESS',
] as const

export type ConnectorExecutionStatus = typeof CONNECTOR_EXECUTION_STATUSES[number]

const EXECUTION_ERROR_CODES = [
  'INVALID_CREDENTIALS',
  'ALREADY_LOGGED_IN',
  'UNEXPECTED_ERROR',
  'INVALID_CREDENTIALS_MFA',
  'SITE_NOT_AVAILABLE',
  'ACCOUNT_LOCKED',
  'ACCOUNT_CREDENTIALS_RESET',
  'CONNECTION_ERROR',
  'ACCOUNT_NEEDS_ACTION',
  'USER_AUTHORIZATION_PENDING',
  'USER_AUTHORIZATION_NOT_GRANTED',
  'USER_NOT_SUPPORTED',
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

export type ExecutionErrorResult = {
  /** The specific execution error code */
  code: ExecutionErrorCode
  /** A human-readable, short description of the error */
  message: string
  /** The exact error message returned by the institution, if any was provided. */
  providerMessage?: string
  /** Unstructured properties that provide additional context/information of the error.
   * Used for some specific cases only, such as Caixa PF & PJ.
   * @see https://docs.pluggy.ai/docs/errors-validations for more info. */
  attributes?: Record<string, string>
}
