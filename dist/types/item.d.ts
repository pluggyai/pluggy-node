import { Connector, ConnectorCredential } from './connector';
/**
 * Item status:
 * UPDATED: The last sync process has completed succesfully and all new data is available to collect.
 * OUTDATED: The parameters were correctly validated but there was an error in the last execution. It can be retried.
 * LOGIN_ERROR: The connection must be updated to execute again, it won't trigger updates until the parameters are updated.
 * WAITING_USER_INPUT: The connection requires user's input to continue the sync process, this is common for MFA authentication connectors
 * UPDATING: An update process is in progress and will be updated soon.
 */
export declare enum ItemStatus {
    LOGIN_ERROR = "LOGIN_ERROR",
    OUTDATED = "OUTDATED",
    UPDATED = "UPDATED",
    UPDATING = "UPDATING",
    WAITING_USER_INPUT = "WAITING_USER_INPUT"
}
export declare type CreateItemOptions = {
    /** Url where notifications will be sent at any item's event */
    webhookUrl?: string;
    /** An unique identifier of the user, usually used the UserId of your app */
    clientUserId?: string;
};
export declare type Item = CreateItemOptions & {
    /** primary identifier of the Item */
    id: string;
    /** Connector's associated with item */
    connector: Connector;
    /** Current status of the item */
    status: ItemStatus;
    /** Current execution status of item. */
    executionStatus: string;
    /** Date of the first connection */
    createdAt: Date;
    /** Last connection sync date with the institution. */
    lastUpdatedAt?: Date;
    /** In case of MFA connections, extra parameter will be available. */
    parameter?: ConnectorCredential;
};
