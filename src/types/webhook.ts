import { TriggeredBy } from './execution'

export const WEBHOOK_EVENTS = [
  'item/created',
  'item/updated',
  'item/error',
  'item/deleted',
  'item/waiting_user_input',
  'item/waiting_user_action',
  'item/login_succeeded',
  'connector/status_updated',
  'transactions/created',
  'transactions/updated',
  'transactions/deleted',
  'payment_intent/created',
  'payment_intent/completed',
  'payment_intent/waiting_payer_authorization',
  'payment_intent/error',
  'scheduled_payment/created',
  'scheduled_payment/completed',
  'scheduled_payment/error',
  'scheduled_payment/canceled',
  'scheduled_payment/all_completed',
  'scheduled_payment/all_created',
  'boleto/updated',
  'all',
  'automatic_pix_payment/created',
  'automatic_pix_payment/completed',
  'automatic_pix_payment/error',
  'automatic_pix_payment/canceled',
  'payment_request/updated',
  "smart_transfer_preauthorization/completed",
  "smart_transfer_preauthorization/error",
  "smart_transfer_payment/completed",
  "smart_transfer_payment/error"
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
  headers?: Record<string, string> | null
}

export type UpdateWebhook = Partial<CreateWebhook> & {
  /** Boolean to enable or disable the webhook */
  enabled?: boolean
}

export type WebhookEventPayload = {
  /** @deprecated id of the entity related to the event (use eventId to uniquely identify a webhook event)*/
  id: string
  /** Primary identifier of the event that was notified */
  eventId: string
} & (
    | {
      /** Type of event subscribed */
      event:
      | 'item/created'
      | 'item/updated'
      | 'item/waiting_user_input'
      | 'item/waiting_user_action'
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
    | {
      /** Type of event subscribed */
      event: 'transactions/deleted' | 'transactions/updated'
      /** Primary identifier of the item related to the event */
      itemId: string
      /** Primary identifier of the client related to the event */
      clientId: string
      /** Primary identifier of the account related to the event */
      accountId: string
      /** Primary identifier of the transactions related to the event */
      transactionIds: string[]
    }
    | {
      event: 'transactions/created'
      /** Primary identifier of the item related to the event */
      itemId: string
      /** Primary identifier of the account related to the event */
      accountId: string
      /** Filter transactions created after date. Format is ISO Date. */
      transactionsCreatedAtFrom: string
      /** Link to get the created transactions of the sync */
      createdTransactionsLink: string
    }
    | {
      event: 'payment_intent/created' | 'payment_intent/completed' | 'payment_intent/error'
      paymentIntentId: string
      paymentRequestId: string
    }
    | {
      event:
      | 'scheduled_payment/created'
      | 'scheduled_payment/completed'
      | 'scheduled_payment/error'
      | 'scheduled_payment/canceled'
      paymentRequestId: string
      scheduledPaymentId: string
    }
    | {
      event: 'payment_request/updated'
      paymentRequestId: string
      data: {
        status: 'AUTHORIZED' | 'CANCELED' | 'COMPLETED' | 'ERROR'
      }
    }
    | {
      event: 'smart_transfer_preauthorization/completed' | 'smart_transfer_preauthorization/error',
      smartTransferPreauthorizationId: string
      clientId: string
      status: string
      error?: {
        code: string
        description: string
        detail: string
      }
    }
    | {
      event: 'smart_transfer_payment/completed' | 'smart_transfer_payment/error',
      smartTransferPaymentId: string
      smartTransferPreauthorizationId: string
      clientId: string
      status: string
      error?: {
        code: string
        description: string
        detail: string
      }
    }
  )
