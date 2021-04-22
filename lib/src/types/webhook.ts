/**
 * Type of events that can be subscribed
 */
export type WebhookEvent = 'item/created' | 'item/updated' | 'item/error' | 'all'

export type Webhook = {
  /** Primary identifier of the entity */
  id: string
  /** Type of event subscribed */
  event: WebhookEvent
  /** Url where notifications of events will be sent */
  url: string
}
