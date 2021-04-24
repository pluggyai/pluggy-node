export const WEBHOOK_EVENTS = ['item/created', 'item/updated', 'item/error', 'all'] as const
/**
 * @typedef WebhookEvent
 * Type of events that can be subscribed
 */
export type WebhookEvent = typeof WEBHOOK_EVENTS[number]

export type Webhook = {
  /*! Primary identifier of the entity */
  id: string
  /** Type of event subscribed */
  event: WebhookEvent
  /** Url where notifications of events will be sent */
  url: string
}
