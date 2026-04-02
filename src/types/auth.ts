export type ConnectTokenOptions = {
  /** Url where notifications will be sent at any item's event */
  webhookUrl?: string
  /** A unique identifier of the user, usually used the UserId of your app */
  clientUserId?: string
  /** Url where the user will be redirected to after the oauth flow */
  oauthRedirectUri?: string
  /** Avoid duplicate items per user */
  avoidDuplicates?: boolean
  /** If true, connectors are sorted alphabetically (A-Z) within each tab. Default: false (analytics-based order) */
  connectorSortAlphabetically?: boolean
}
