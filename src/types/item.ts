import { Connector, ConnectorCredential } from './connector'
import { ExecutionErrorResult, ExecutionStatus } from './execution'

const ITEM_STATUSES = [
  'UPDATED',
  'UPDATING',
  'WAITING_USER_INPUT',
  'LOGIN_ERROR',
  'OUTDATED',
] as const
/**
 * The current Item status.
 *  UPDATED: The last sync process has completed successfully and all new data is available to collect.
 *  UPDATING: An update process is in progress and will be updated soon.
 *  WAITING_USER_INPUT: The connection requires user's input to continue the sync process, this is common for MFA authentication connectors
 *  LOGIN_ERROR: The connection must be updated to execute again, it won't trigger updates until the parameters are updated.
 *  OUTDATED: The parameters were correctly validated but there was an error in the last execution. It can be retried.
 */
export type ItemStatus = typeof ITEM_STATUSES[number]

export type ItemProductState = {
  /** Whether product was collected in this last execution or not */
  isUpdated: boolean
  /** Date when product was last collected for this Item, null if it has never been. */
  lastUpdatedAt: Date | null
}

/**
 * Only available when item.status is 'PARTIAL_SUCCESS'.
 * Provides fine-grained information, per product, about their latest collection state.
 *
 * If a product was not requested at all, its entry will be null.
 * If it was requested, it's entry will reflect if it has been collected or not.
 *  If collected, isUpdated will be true, and lastUpdatedAt will be the Date when it happened
 *  If not collected, isUpdated will be false, and lastUpdatedAt will be null it wasn't ever collected before, or the previous date if it was.
 */
export type ItemProductsStatusDetail = {
  /** Collection details for 'ACCOUNTS' product, or null if it was not requested at all. */
  accounts: ItemProductState | null
  /** Collection details for 'CREDIT_CARDS' product, or null if it was not requested at all. */
  creditCards: ItemProductState | null
  /** Collection details for account 'TRANSACTIONS' product, or null if it was not requested at all. */
  transactions: ItemProductState | null
  /** Collection details for 'INVESTMENTS' product, or null if it was not requested at all. */
  investments: ItemProductState | null
  /** Collection details for 'IDENTITY' product, or null if it was not requested at all. */
  identity: ItemProductState | null
  /** Collection details for 'PAYMENT_DATA' product, or null if it was not requested at all. */
  paymentData: ItemProductState | null
}

export type Item = {
  /** primary identifier of the Item */
  id: string
  /** Connector's associated with item */
  connector: Connector
  /** Current status of the item */
  status: ItemStatus
  /** If status is 'PARTIAL_SUCCESS', this field will provide more detailed info about which products have been recovered or failed. */
  statusDetail: ItemProductsStatusDetail | null
  /** Item error details, if finished in an error status */
  error: ExecutionErrorResult | null
  /** Current execution status of item. */
  executionStatus: ExecutionStatus
  /** Date of the first connection */
  createdAt: Date
  /** Date of last item related data update */
  updatedAt: Date
  /** Last connection sync date with the institution. */
  lastUpdatedAt: Date | null
  /** In case of MFA connections, extra parameter will be available. */
  parameter: ConnectorCredential | null
  /** Url where notifications will be sent at any item's event */
  webhookUrl: string | null
  /** A unique identifier for the User, to be able to identify it on your app */
  clientUserId: string | null
}

/**
 * The Item Create/Update parameters object to submit, which contains the needed user credentials.
 */
export type Parameters = Record<string, string>

export type CreateItemOptions = {
  /** Url where notifications will be sent at any item's event */
  webhookUrl?: string
  /** A unique identifier for the User, to be able to identify it on your app */
  clientUserId?: string
}
