import { PageFilters } from './common'
import { Connector, ConnectorCredential, ProductType } from './connector'
import { ExecutionErrorResult, ExecutionStatus } from './execution'

const ITEM_STATUSES = [
  'UPDATED',
  'UPDATING',
  'WAITING_USER_INPUT',
  'WAITING_USER_ACTION',
  'MERGING',
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

export const ITEM_PRODUCT_STEP_WARNING_CODES = ['001'] as const
export type ItemProductStepWarningCode = typeof ITEM_PRODUCT_STEP_WARNING_CODES[number]

export type ItemProductStepWarning = {
  /** The specific warning code */
  code: ItemProductStepWarningCode
  /** Human readable message that explains the warning */
  message: string
  /** Related error message exactly as found in the institution (if any). */
  providerMessage?: string
}

export type ItemProductState = {
  /** Whether product was collected in this last execution or not */
  isUpdated: boolean
  /** Date when product was last collected for this Item, null if it has never been. */
  lastUpdatedAt: Date | null
  /** If product was not collected, this field will provide more detailed info about the reason. */
  warnings?: ItemProductStepWarning[]
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
  /** Collection details for 'INESTMENT_TRANSACTIONS' product, or null if it was not requested at all. */
  investmentTransactions: ItemProductState | null
  /** Collection details for 'IDENTITY' product, or null if it was not requested at all. */
  identity: ItemProductState | null
  /** Collection details for 'PAYMENT_DATA' product, or null if it was not requested at all. */
  paymentData: ItemProductState | null
  /** Collection details for 'LOAN' product, or null if it was not requested at all. */
  loans: ItemProductState | null
  /** Collection details for 'ACCOUNT_STATEMENTS' product, or null if it was not requested at all. */
  accountStatements: ItemProductState | null
}

export type UserAction = {
  /** Human readble instructions that explains the user action to be done. */
  instructions: string
  /** Type of user action to be done */
  type: 'qr' | 'authorize-access'
  /** Unstructured properties that provide additional context of the user action. */
  attributes?: Record<string, string>
  /** Parameter expiration date, action should be done before this time. */
  expiresAt?: Date
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
  /** Useful info when item execution status is "WAITING_USER_ACTION" */
  userAction: UserAction | null
  /** The number of consecutive failed login attempts for this item. */
  consecutiveFailedLoginAttempts: number
  /** The date when the next Pluggy's auto-sync update will be attempted (if item is updatable). */
  nextAutoSyncAt: Date | null
  /** Consent expiration date (Open Finance connections). */
  consentExpiresAt: Date | null
  /**
   * Open Finance only. When the financial institution's resource list was last read for this Item,
   * or null if it never was. See `fetchItemResources`.
   */
  resourcesCollectedAt: Date | null
  /**
   * Open Finance only. True when the financial institution declares at least one of this Item's
   * resources as 'PENDING_AUTHORISATION', meaning the user still has to approve it at their
   * institution; false when the resource list was read and none is. Null for non Open Finance
   * connectors, and while the resource list has not been read yet (`resourcesCollectedAt` is null).
   */
  hasResourcesPendingAuthorization: boolean | null
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
  /**
   * Products to include in item execution and collection steps. Optional.
   * If not specified, all products available to your subscription level will be collected.
   */
  products?: ProductType[]
  /** Avoid duplicate items per user */
  avoidDuplicates?: boolean
  /** Redirect URI required for the Oauth flow */
  oauthRedirectUri?: string
}

export const ITEM_RESOURCE_STATUSES = [
  'AVAILABLE',
  'UNAVAILABLE',
  'TEMPORARILY_UNAVAILABLE',
  'PENDING_AUTHORISATION',
] as const
/**
 * What the financial institution reports about a resource of the Item's Open Finance consent.
 *  AVAILABLE: The institution shares the resource.
 *  UNAVAILABLE: The institution reports the resource as unavailable.
 *  TEMPORARILY_UNAVAILABLE: The institution reports the resource as temporarily unavailable.
 *  PENDING_AUTHORISATION: The user still has to approve sharing the resource at their institution.
 * Note the British spelling of 'PENDING_AUTHORISATION': it is Open Finance's, kept verbatim.
 */
export type ItemResourceStatus = typeof ITEM_RESOURCE_STATUSES[number]

export const ITEM_RESOURCE_TYPES = [
  'ACCOUNT',
  'CREDIT_CARD_ACCOUNT',
  'LOAN',
  'FINANCING',
  'UNARRANGED_ACCOUNT_OVERDRAFT',
  'INVOICE_FINANCING',
  'BANK_FIXED_INCOME',
  'CREDIT_FIXED_INCOME',
  'VARIABLE_INCOME',
  'TREASURE_TITLE',
  'FUND',
] as const
/**
 * Open Finance resource type, reported verbatim by the financial institution.
 * The listed values are the documented ones, but others can appear: handle unknown strings.
 */
export type ItemResourceType = typeof ITEM_RESOURCE_TYPES[number] | (string & {})

/** A resource the financial institution declared for the Item's Open Finance consent. */
export type ItemResource = {
  /** The institution's identifier for the resource. */
  resourceId: string
  /** Open Finance resource type. */
  type: ItemResourceType
  /** What the institution reports about this resource. */
  status: ItemResourceStatus
}

export type ItemResourceFilters = PageFilters & {
  /** Only return resources with this status. */
  status?: ItemResourceStatus
}

/**
 * Filters for {@link PluggyClient.fetchItemsCursor} / {@link PluggyClient.fetchAllItems}
 * (`GET /v2/items`).
 *
 * ⚠️ Opt-in, paid plans only. Listing items is disabled by default and is only available to
 * paid-plan teams that have explicitly requested it from Pluggy support. Teams without it
 * enabled get `403 LIST_ITEMS_FEATURE_NOT_ENABLED`. For most integrations, store each `itemId`
 * when it is created (Pluggy Connect `onSuccess` or the `item/created` webhook) and use
 * `fetchItem(id)` instead.
 *
 * Only these fields are sent; the endpoint rejects any other query parameter.
 */
export type ItemCursorFilters = {
  /** Only return items created with this `clientUserId`. Max 255 characters. */
  clientUserId?: string
  /** Only return items of this connector. Integer >= 0. */
  connectorId?: number
  /** Opaque cursor taken from the `after` query parameter of the previous page's `next` field */
  after?: string
}
