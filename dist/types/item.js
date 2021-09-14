"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemStatus = void 0;
/**
 * Item status:
 * UPDATED: The last sync process has completed succesfully and all new data is available to collect.
 * OUTDATED: The parameters were correctly validated but there was an error in the last execution. It can be retried.
 * LOGIN_ERROR: The connection must be updated to execute again, it won't trigger updates until the parameters are updated.
 * WAITING_USER_INPUT: The connection requires user's input to continue the sync process, this is common for MFA authentication connectors
 * UPDATING: An update process is in progress and will be updated soon.
 */
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["LOGIN_ERROR"] = "LOGIN_ERROR";
    ItemStatus["OUTDATED"] = "OUTDATED";
    ItemStatus["UPDATED"] = "UPDATED";
    ItemStatus["UPDATING"] = "UPDATING";
    ItemStatus["WAITING_USER_INPUT"] = "WAITING_USER_INPUT";
})(ItemStatus = exports.ItemStatus || (exports.ItemStatus = {}));
