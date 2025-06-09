import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace homegraph_v1 {
    export interface Options extends GlobalOptions {
        version: 'v1';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | BaseExternalAccountClient | GoogleAuth;
        /**
         * V1 error format.
         */
        '$.xgafv'?: string;
        /**
         * OAuth access token.
         */
        access_token?: string;
        /**
         * Data format for response.
         */
        alt?: string;
        /**
         * JSONP
         */
        callback?: string;
        /**
         * Selector specifying which fields to include in a partial response.
         */
        fields?: string;
        /**
         * API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
         */
        key?: string;
        /**
         * OAuth 2.0 token for the current user.
         */
        oauth_token?: string;
        /**
         * Returns response with indentations and line breaks.
         */
        prettyPrint?: boolean;
        /**
         * Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Legacy upload protocol for media (e.g. "media", "multipart").
         */
        uploadType?: string;
        /**
         * Upload protocol for media (e.g. "raw", "multipart").
         */
        upload_protocol?: string;
    }
    /**
     * HomeGraph API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const homegraph = google.homegraph('v1');
     * ```
     */
    export class Homegraph {
        context: APIRequestContext;
        agentUsers: Resource$Agentusers;
        devices: Resource$Devices;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Third-party device ID for one device.
     */
    export interface Schema$AgentDeviceId {
        /**
         * Third-party device ID.
         */
        id?: string | null;
    }
    /**
     * Alternate third-party device ID.
     */
    export interface Schema$AgentOtherDeviceId {
        /**
         * Project ID for your smart home Action.
         */
        agentId?: string | null;
        /**
         * Unique third-party device ID.
         */
        deviceId?: string | null;
    }
    /**
     * Third-party device definition.
     */
    export interface Schema$Device {
        /**
         * Attributes for the traits supported by the device.
         */
        attributes?: {
            [key: string]: any;
        } | null;
        /**
         * Custom device attributes stored in Home Graph and provided to your smart home Action in each [QUERY](https://developers.home.google.com/cloud-to-cloud/intents/query) and [EXECUTE](https://developers.home.google.com/cloud-to-cloud/intents/execute) intent. Data in this object has a few constraints: No sensitive information, including but not limited to Personally Identifiable Information.
         */
        customData?: {
            [key: string]: any;
        } | null;
        /**
         * Device manufacturer, model, hardware version, and software version.
         */
        deviceInfo?: Schema$DeviceInfo;
        /**
         * Third-party device ID.
         */
        id?: string | null;
        /**
         * Names given to this device by your smart home Action.
         */
        name?: Schema$DeviceNames;
        /**
         * Indicates whether your smart home Action will report notifications to Google for this device via ReportStateAndNotification. If your smart home Action enables users to control device notifications, you should update this field and call RequestSyncDevices.
         */
        notificationSupportedByAgent?: boolean | null;
        /**
         * Alternate IDs associated with this device. This is used to identify cloud synced devices enabled for [local fulfillment](https://developers.home.google.com/local-home/overview).
         */
        otherDeviceIds?: Schema$AgentOtherDeviceId[];
        /**
         * Suggested name for the room where this device is installed. Google attempts to use this value during user setup.
         */
        roomHint?: string | null;
        /**
         * Suggested name for the structure where this device is installed. Google attempts to use this value during user setup.
         */
        structureHint?: string | null;
        /**
         * Traits supported by the device. See [device traits](https://developers.home.google.com/cloud-to-cloud/traits).
         */
        traits?: string[] | null;
        /**
         * Hardware type of the device. See [device types](https://developers.home.google.com/cloud-to-cloud/guides).
         */
        type?: string | null;
        /**
         * Indicates whether your smart home Action will report state of this device to Google via ReportStateAndNotification.
         */
        willReportState?: boolean | null;
    }
    /**
     * Device information.
     */
    export interface Schema$DeviceInfo {
        /**
         * Device hardware version.
         */
        hwVersion?: string | null;
        /**
         * Device manufacturer.
         */
        manufacturer?: string | null;
        /**
         * Device model.
         */
        model?: string | null;
        /**
         * Device software version.
         */
        swVersion?: string | null;
    }
    /**
     * Identifiers used to describe the device.
     */
    export interface Schema$DeviceNames {
        /**
         * List of names provided by the manufacturer rather than the user, such as serial numbers, SKUs, etc.
         */
        defaultNames?: string[] | null;
        /**
         * Primary name of the device, generally provided by the user.
         */
        name?: string | null;
        /**
         * Additional names provided by the user for the device.
         */
        nicknames?: string[] | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Request type for the [`Query`](#google.home.graph.v1.HomeGraphApiService.Query) call.
     */
    export interface Schema$QueryRequest {
        /**
         * Required. Third-party user ID.
         */
        agentUserId?: string | null;
        /**
         * Required. Inputs containing third-party device IDs for which to get the device states.
         */
        inputs?: Schema$QueryRequestInput[];
        /**
         * Request ID used for debugging.
         */
        requestId?: string | null;
    }
    /**
     * Device ID inputs to QueryRequest.
     */
    export interface Schema$QueryRequestInput {
        /**
         * Payload containing third-party device IDs.
         */
        payload?: Schema$QueryRequestPayload;
    }
    /**
     * Payload containing device IDs.
     */
    export interface Schema$QueryRequestPayload {
        /**
         * Third-party device IDs for which to get the device states.
         */
        devices?: Schema$AgentDeviceId[];
    }
    /**
     * Response type for the [`Query`](#google.home.graph.v1.HomeGraphApiService.Query) call. This should follow the same format as the Google smart home `action.devices.QUERY` [response](https://developers.home.google.com/cloud-to-cloud/intents/query). Example: ```json { "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf", "payload": { "devices": { "123": { "on": true, "online": true \}, "456": { "on": true, "online": true, "brightness": 80, "color": { "name": "cerulean", "spectrumRGB": 31655 \} \} \} \} \} ```
     */
    export interface Schema$QueryResponse {
        /**
         * Device states for the devices given in the request.
         */
        payload?: Schema$QueryResponsePayload;
        /**
         * Request ID used for debugging. Copied from the request.
         */
        requestId?: string | null;
    }
    /**
     * Payload containing device states information.
     */
    export interface Schema$QueryResponsePayload {
        /**
         * States of the devices. Map of third-party device ID to struct of device states.
         */
        devices?: {
            [key: string]: {
                [key: string]: any;
            };
        } | null;
    }
    /**
     * The states and notifications specific to a device.
     */
    export interface Schema$ReportStateAndNotificationDevice {
        /**
         * Notifications metadata for devices. See the **Device NOTIFICATIONS** section of the individual trait [reference guides](https://developers.home.google.com/cloud-to-cloud/traits).
         */
        notifications?: {
            [key: string]: any;
        } | null;
        /**
         * States of devices to update. See the **Device STATES** section of the individual trait [reference guides](https://developers.home.google.com/cloud-to-cloud/traits).
         */
        states?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Request type for the [`ReportStateAndNotification`](#google.home.graph.v1.HomeGraphApiService.ReportStateAndNotification) call. It may include states, notifications, or both. States and notifications are defined per `device_id` (for example, "123" and "456" in the following example). Example: ```json { "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf", "agentUserId": "1234", "payload": { "devices": { "states": { "123": { "on": true \}, "456": { "on": true, "brightness": 10 \}, \}, \} \} \} ```
     */
    export interface Schema$ReportStateAndNotificationRequest {
        /**
         * Required. Third-party user ID.
         */
        agentUserId?: string | null;
        /**
         * Unique identifier per event (for example, a doorbell press).
         */
        eventId?: string | null;
        /**
         * Deprecated.
         */
        followUpToken?: string | null;
        /**
         * Required. State of devices to update and notification metadata for devices.
         */
        payload?: Schema$StateAndNotificationPayload;
        /**
         * Request ID used for debugging.
         */
        requestId?: string | null;
    }
    /**
     * Response type for the [`ReportStateAndNotification`](#google.home.graph.v1.HomeGraphApiService.ReportStateAndNotification) call.
     */
    export interface Schema$ReportStateAndNotificationResponse {
        /**
         * Request ID copied from ReportStateAndNotificationRequest.
         */
        requestId?: string | null;
    }
    /**
     * Request type for the [`RequestSyncDevices`](#google.home.graph.v1.HomeGraphApiService.RequestSyncDevices) call.
     */
    export interface Schema$RequestSyncDevicesRequest {
        /**
         * Required. Third-party user ID.
         */
        agentUserId?: string | null;
        /**
         * Optional. If set, the request will be added to a queue and a response will be returned immediately. This enables concurrent requests for the given `agent_user_id`, but the caller will not receive any error responses.
         */
        async?: boolean | null;
    }
    /**
     * Response type for the [`RequestSyncDevices`](#google.home.graph.v1.HomeGraphApiService.RequestSyncDevices) call. Intentionally empty upon success. An HTTP response code is returned with more details upon failure.
     */
    export interface Schema$RequestSyncDevicesResponse {
    }
    /**
     * Payload containing the state and notification information for devices.
     */
    export interface Schema$StateAndNotificationPayload {
        /**
         * The devices for updating state and sending notifications.
         */
        devices?: Schema$ReportStateAndNotificationDevice;
    }
    /**
     * Request type for the [`Sync`](#google.home.graph.v1.HomeGraphApiService.Sync) call.
     */
    export interface Schema$SyncRequest {
        /**
         * Required. Third-party user ID.
         */
        agentUserId?: string | null;
        /**
         * Request ID used for debugging.
         */
        requestId?: string | null;
    }
    /**
     * Response type for the [`Sync`](#google.home.graph.v1.HomeGraphApiService.Sync) call. This should follow the same format as the Google smart home `action.devices.SYNC` [response](https://developers.home.google.com/cloud-to-cloud/intents/sync). Example: ```json { "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf", "payload": { "agentUserId": "1836.15267389", "devices": [{ "id": "123", "type": "action.devices.types.OUTLET", "traits": [ "action.devices.traits.OnOff" ], "name": { "defaultNames": ["My Outlet 1234"], "name": "Night light", "nicknames": ["wall plug"] \}, "willReportState": false, "deviceInfo": { "manufacturer": "lights-out-inc", "model": "hs1234", "hwVersion": "3.2", "swVersion": "11.4" \}, "customData": { "fooValue": 74, "barValue": true, "bazValue": "foo" \} \}] \} \} ```
     */
    export interface Schema$SyncResponse {
        /**
         * Devices associated with the third-party user.
         */
        payload?: Schema$SyncResponsePayload;
        /**
         * Request ID used for debugging. Copied from the request.
         */
        requestId?: string | null;
    }
    /**
     * Payload containing device information.
     */
    export interface Schema$SyncResponsePayload {
        /**
         * Third-party user ID
         */
        agentUserId?: string | null;
        /**
         * Devices associated with the third-party user.
         */
        devices?: Schema$Device[];
    }
    export class Resource$Agentusers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Unlinks the given third-party user from your smart home Action. All data related to this user will be deleted. For more details on how users link their accounts, see [fulfillment and authentication](https://developers.home.google.com/cloud-to-cloud/primer/fulfillment). The third-party user's identity is passed in via the `agent_user_id` (see DeleteAgentUserRequest). This request must be authorized using service account credentials from your Actions console project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Agentusers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Agentusers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Agentusers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Agentusers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Agentusers$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Agentusers$Delete extends StandardParameters {
        /**
         * Required. Third-party user ID.
         */
        agentUserId?: string;
        /**
         * Request ID used for debugging.
         */
        requestId?: string;
    }
    export class Resource$Devices {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the current states in Home Graph for the given set of the third-party user's devices. The third-party user's identity is passed in via the `agent_user_id` (see QueryRequest). This request must be authorized using service account credentials from your Actions console project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        query(params: Params$Resource$Devices$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Devices$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$QueryResponse>>;
        query(params: Params$Resource$Devices$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Devices$Query, options: MethodOptions | BodyResponseCallback<Schema$QueryResponse>, callback: BodyResponseCallback<Schema$QueryResponse>): void;
        query(params: Params$Resource$Devices$Query, callback: BodyResponseCallback<Schema$QueryResponse>): void;
        query(callback: BodyResponseCallback<Schema$QueryResponse>): void;
        /**
         * Reports device state and optionally sends device notifications. Called by your smart home Action when the state of a third-party device changes or you need to send a notification about the device. See [Implement Report State](https://developers.home.google.com/cloud-to-cloud/integration/report-state) for more information. This method updates the device state according to its declared [traits](https://developers.home.google.com/cloud-to-cloud/primer/device-types-and-traits). Publishing a new state value outside of these traits will result in an `INVALID_ARGUMENT` error response. The third-party user's identity is passed in via the `agent_user_id` (see ReportStateAndNotificationRequest). This request must be authorized using service account credentials from your Actions console project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reportStateAndNotification(params: Params$Resource$Devices$Reportstateandnotification, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reportStateAndNotification(params?: Params$Resource$Devices$Reportstateandnotification, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReportStateAndNotificationResponse>>;
        reportStateAndNotification(params: Params$Resource$Devices$Reportstateandnotification, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reportStateAndNotification(params: Params$Resource$Devices$Reportstateandnotification, options: MethodOptions | BodyResponseCallback<Schema$ReportStateAndNotificationResponse>, callback: BodyResponseCallback<Schema$ReportStateAndNotificationResponse>): void;
        reportStateAndNotification(params: Params$Resource$Devices$Reportstateandnotification, callback: BodyResponseCallback<Schema$ReportStateAndNotificationResponse>): void;
        reportStateAndNotification(callback: BodyResponseCallback<Schema$ReportStateAndNotificationResponse>): void;
        /**
         * Requests Google to send an `action.devices.SYNC` [intent](https://developers.home.google.com/cloud-to-cloud/intents/sync) to your smart home Action to update device metadata for the given user. The third-party user's identity is passed via the `agent_user_id` (see RequestSyncDevicesRequest). This request must be authorized using service account credentials from your Actions console project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        requestSync(params: Params$Resource$Devices$Requestsync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        requestSync(params?: Params$Resource$Devices$Requestsync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RequestSyncDevicesResponse>>;
        requestSync(params: Params$Resource$Devices$Requestsync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        requestSync(params: Params$Resource$Devices$Requestsync, options: MethodOptions | BodyResponseCallback<Schema$RequestSyncDevicesResponse>, callback: BodyResponseCallback<Schema$RequestSyncDevicesResponse>): void;
        requestSync(params: Params$Resource$Devices$Requestsync, callback: BodyResponseCallback<Schema$RequestSyncDevicesResponse>): void;
        requestSync(callback: BodyResponseCallback<Schema$RequestSyncDevicesResponse>): void;
        /**
         * Gets all the devices associated with the given third-party user. The third-party user's identity is passed in via the `agent_user_id` (see SyncRequest). This request must be authorized using service account credentials from your Actions console project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        sync(params: Params$Resource$Devices$Sync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        sync(params?: Params$Resource$Devices$Sync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SyncResponse>>;
        sync(params: Params$Resource$Devices$Sync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        sync(params: Params$Resource$Devices$Sync, options: MethodOptions | BodyResponseCallback<Schema$SyncResponse>, callback: BodyResponseCallback<Schema$SyncResponse>): void;
        sync(params: Params$Resource$Devices$Sync, callback: BodyResponseCallback<Schema$SyncResponse>): void;
        sync(callback: BodyResponseCallback<Schema$SyncResponse>): void;
    }
    export interface Params$Resource$Devices$Query extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryRequest;
    }
    export interface Params$Resource$Devices$Reportstateandnotification extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReportStateAndNotificationRequest;
    }
    export interface Params$Resource$Devices$Requestsync extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RequestSyncDevicesRequest;
    }
    export interface Params$Resource$Devices$Sync extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$SyncRequest;
    }
    export {};
}
