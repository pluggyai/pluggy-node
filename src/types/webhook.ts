export const WEBHOOK_EVENTS = [
  'item/created',
  'item/updated',
  'item/error',
  'item/deleted',
  'item/waiting_user_input',
  'item/login_succeeded',
  'connector/status_updated',
  'all',
] as const
/**
 * @typedef WebhookEvent
 * Type of events that can be subscribed
 */
export type WebhookEvent = typeof WEBHOOK_EVENTS[number]

export type Webhook = {
  /*! Primary identifier of the entity */
  id: string
  /*! Type of event subscribed */
  event: WebhookEvent
  /*! Url where notifications of events will be sent */
  url: string
  /*! Object to specify headers in your webhook notifications */
  headers: Record<string, string>
}

export type WebhookEventPayload = {
  /*! Primary identifier of the resource that was notified */
  id: string
  /*! Type of event subscribed */
  event: WebhookEvent
  /*! Url where notifications of events will be sent */
  url?: string
  /*! Primary identifier of the item related to the event */
  itemId?: string
  /*! Object related to item/error event */
  error?: Record<string, unknown>
  /*! Object to specify headers in webhook notifications */
  headers?: Record<string, string>
}
