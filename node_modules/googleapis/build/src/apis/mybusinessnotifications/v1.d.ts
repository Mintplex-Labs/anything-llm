import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace mybusinessnotifications_v1 {
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
     * My Business Notifications API
     *
     * The My Business Notification Settings API enables managing notification settings for business accounts. Note - If you have a quota of 0 after enabling the API, please request for GBP API access.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const mybusinessnotifications = google.mybusinessnotifications('v1');
     * ```
     */
    export class Mybusinessnotifications {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A Google Pub/Sub topic where notifications can be published when a location is updated or has a new review. There will be only one notification setting resource per-account.
     */
    export interface Schema$NotificationSetting {
        /**
         * Required. The resource name this setting is for. This is of the form `accounts/{account_id\}/notificationSetting`.
         */
        name?: string | null;
        /**
         * The types of notifications that will be sent to the Pub/Sub topic. To stop receiving notifications entirely, use NotificationSettings.UpdateNotificationSetting with an empty notification_types or set the pubsub_topic to an empty string.
         */
        notificationTypes?: string[] | null;
        /**
         * Optional. The Google Pub/Sub topic that will receive notifications when locations managed by this account are updated. If unset, no notifications will be posted. The account mybusiness-api-pubsub@system.gserviceaccount.com must have at least Publish permissions on the Pub/Sub topic.
         */
        pubsubTopic?: string | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns the pubsub notification settings for the account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getNotificationSetting(params: Params$Resource$Accounts$Getnotificationsetting, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getNotificationSetting(params?: Params$Resource$Accounts$Getnotificationsetting, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationSetting>>;
        getNotificationSetting(params: Params$Resource$Accounts$Getnotificationsetting, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getNotificationSetting(params: Params$Resource$Accounts$Getnotificationsetting, options: MethodOptions | BodyResponseCallback<Schema$NotificationSetting>, callback: BodyResponseCallback<Schema$NotificationSetting>): void;
        getNotificationSetting(params: Params$Resource$Accounts$Getnotificationsetting, callback: BodyResponseCallback<Schema$NotificationSetting>): void;
        getNotificationSetting(callback: BodyResponseCallback<Schema$NotificationSetting>): void;
        /**
         * Sets the pubsub notification setting for the account informing Google which topic to send pubsub notifications for. Use the notification_types field within notification_setting to manipulate the events an account wants to subscribe to. An account will only have one notification setting resource, and only one pubsub topic can be set. To delete the setting, update with an empty notification_types
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateNotificationSetting(params: Params$Resource$Accounts$Updatenotificationsetting, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateNotificationSetting(params?: Params$Resource$Accounts$Updatenotificationsetting, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationSetting>>;
        updateNotificationSetting(params: Params$Resource$Accounts$Updatenotificationsetting, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateNotificationSetting(params: Params$Resource$Accounts$Updatenotificationsetting, options: MethodOptions | BodyResponseCallback<Schema$NotificationSetting>, callback: BodyResponseCallback<Schema$NotificationSetting>): void;
        updateNotificationSetting(params: Params$Resource$Accounts$Updatenotificationsetting, callback: BodyResponseCallback<Schema$NotificationSetting>): void;
        updateNotificationSetting(callback: BodyResponseCallback<Schema$NotificationSetting>): void;
    }
    export interface Params$Resource$Accounts$Getnotificationsetting extends StandardParameters {
        /**
         * Required. The resource name of the notification setting we are trying to fetch.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Updatenotificationsetting extends StandardParameters {
        /**
         * Required. The resource name this setting is for. This is of the form `accounts/{account_id\}/notificationSetting`.
         */
        name?: string;
        /**
         * Required. The specific fields that should be updated. The only editable field is notification_setting.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NotificationSetting;
    }
    export {};
}
