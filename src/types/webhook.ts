import { TriggeredBy } from './execution'

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
  /** Primary identifier of the entity */
  id: string
  /** Url where notifications of events will be sent */
  url: string
  /** Type of event subscribed */
  event: WebhookEvent
  /** Time of the creation of the webhook */
  createdAt: Date
  /** Time of last time the webhook was updated
   * (note: if it was never updated it will be equal to createdAt) */
  updatedAt: Date
  /** Time of when the webhook was disabled */
  disabledAt: Date | null
}

export type CreateWebhook = {
  /** Type of event subscribed */
  event: WebhookEvent
  /** Url where notifications of events will be sent */
  url: string
  /** Object to specify headers in your webhook notifications */
  headers: Record<string, string>
}

export type WebhookEventPayload = {
  /** Primary identifier of the resource that was notified */
  id: string
} & (
  | {
      /** Type of event subscribed */
      event:
        | 'item/created'
        | 'item/updated'
        | 'item/waiting_user_input'
        | 'item/login_succeeded'
        | 'item/deleted'
      /** Primary identifier of the item related to the event */
      itemId: string
      /** Who trigger the event */
      triggeredBy?: TriggeredBy | null
    }
  | {
      /** Type of event subscribed */
      event: 'item/error'
      /** Primary identifier of the item related to the event */
      itemId: string
      /** Object related to item/error event */
      error: {
        code: string
        message: string
      }
      /** Who trigger the event */
      triggeredBy?: TriggeredBy | null
    }
  | {
      /** Type of event subscribed */
      event: 'connector/status_updated'
      /** Object with extra information of the connector updated */
      data: {
        status: string
      }
    }
)
