export declare const WEBHOOK_EVENTS: readonly ["item/created", "item/updated", "item/error", "all"];
/**
 * @typedef WebhookEvent
 * Type of events that can be subscribed
 */
export declare type WebhookEvent = typeof WEBHOOK_EVENTS[number];
export declare type Webhook = {
    /*! Primary identifier of the entity */
    id: string;
    /** Type of event subscribed */
    event: WebhookEvent;
    /** Url where notifications of events will be sent */
    url: string;
};
