import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace resourcesettings_v1 {
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
     * Resource Settings API
     *
     * The Resource Settings API allows users to control and modify the behavior of their GCP resources (e.g., VM, firewall, Project, etc.) across the Cloud Resource Hierarchy.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const resourcesettings = google.resourcesettings('v1');
     * ```
     */
    export class Resourcesettings {
        context: APIRequestContext;
        folders: Resource$Folders;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The response from ListSettings.
     */
    export interface Schema$GoogleCloudResourcesettingsV1ListSettingsResponse {
        /**
         * Unused. A page token used to retrieve the next page.
         */
        nextPageToken?: string | null;
        /**
         * A list of settings that are available at the specified Cloud resource.
         */
        settings?: Schema$GoogleCloudResourcesettingsV1Setting[];
    }
    /**
     * The schema for settings.
     */
    export interface Schema$GoogleCloudResourcesettingsV1Setting {
        /**
         * Output only. The effective value of the setting at the given parent resource, evaluated based on the resource hierarchy The effective value evaluates to one of the following options, in this order. If an option is not valid or doesn't exist, then the next option is used: 1. The local setting value on the given resource: Setting.local_value 2. If one of the given resource's ancestors in the resource hierarchy have a local setting value, the local value at the nearest such ancestor. 3. The setting's default value: SettingMetadata.default_value 4. An empty value, defined as a `Value` with all fields unset. The data type of Value must always be consistent with the data type defined in Setting.metadata.
         */
        effectiveValue?: Schema$GoogleCloudResourcesettingsV1Value;
        /**
         * A fingerprint used for optimistic concurrency. See UpdateSetting for more details.
         */
        etag?: string | null;
        /**
         * The configured value of the setting at the given parent resource, ignoring the resource hierarchy. The data type of Value must always be consistent with the data type defined in Setting.metadata.
         */
        localValue?: Schema$GoogleCloudResourcesettingsV1Value;
        /**
         * Output only. Metadata about a setting which is not editable by the end user.
         */
        metadata?: Schema$GoogleCloudResourcesettingsV1SettingMetadata;
        /**
         * The resource name of the setting. Must be in one of the following forms: * `projects/{project_number\}/settings/{setting_name\}` * `folders/{folder_id\}/settings/{setting_name\}` * `organizations/{organization_id\}/settings/{setting_name\}` For example, "/projects/123/settings/gcp-enableMyFeature"
         */
        name?: string | null;
    }
    /**
     * Metadata about a setting which is not editable by the end user.
     */
    export interface Schema$GoogleCloudResourcesettingsV1SettingMetadata {
        /**
         * The data type for this setting.
         */
        dataType?: string | null;
        /**
         * The value provided by Setting.effective_value if no setting value is explicitly set. Note: not all settings have a default value.
         */
        defaultValue?: Schema$GoogleCloudResourcesettingsV1Value;
        /**
         * A detailed description of what this setting does.
         */
        description?: string | null;
        /**
         * The human readable name for this setting.
         */
        displayName?: string | null;
        /**
         * A flag indicating that values of this setting cannot be modified. See documentation for the specific setting for updates and reasons.
         */
        readOnly?: boolean | null;
    }
    /**
     * The data in a setting value.
     */
    export interface Schema$GoogleCloudResourcesettingsV1Value {
        /**
         * Defines this value as being a boolean value.
         */
        booleanValue?: boolean | null;
        /**
         * Defines this value as being a Duration.
         */
        durationValue?: string | null;
        /**
         * Defines this value as being a Enum.
         */
        enumValue?: Schema$GoogleCloudResourcesettingsV1ValueEnumValue;
        /**
         * Defines this value as being a StringMap.
         */
        stringMapValue?: Schema$GoogleCloudResourcesettingsV1ValueStringMap;
        /**
         * Defines this value as being a StringSet.
         */
        stringSetValue?: Schema$GoogleCloudResourcesettingsV1ValueStringSet;
        /**
         * Defines this value as being a string value.
         */
        stringValue?: string | null;
    }
    /**
     * A enum value that can hold any enum type setting values. Each enum type is represented by a number, this representation is stored in the definitions.
     */
    export interface Schema$GoogleCloudResourcesettingsV1ValueEnumValue {
        /**
         * The value of this enum
         */
        value?: string | null;
    }
    /**
     * A string-\>string map value that can hold a map of string keys to string values. The maximum length of each string is 200 characters and there can be a maximum of 50 key-value pairs in the map.
     */
    export interface Schema$GoogleCloudResourcesettingsV1ValueStringMap {
        /**
         * The key-value pairs in the map
         */
        mappings?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A string set value that can hold a set of strings. The maximum length of each string is 200 characters and there can be a maximum of 50 strings in the string set.
     */
    export interface Schema$GoogleCloudResourcesettingsV1ValueStringSet {
        /**
         * The strings in the set
         */
        values?: string[] | null;
    }
    export class Resource$Folders {
        context: APIRequestContext;
        settings: Resource$Folders$Settings;
        constructor(context: APIRequestContext);
    }
    export class Resource$Folders$Settings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Settings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Settings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        get(params: Params$Resource$Folders$Settings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Settings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(params: Params$Resource$Folders$Settings$Get, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        /**
         * Lists all the settings that are available on the Cloud resource `parent`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Settings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Settings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>>;
        list(params: Params$Resource$Folders$Settings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Settings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(params: Params$Resource$Folders$Settings$List, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        /**
         * Updates a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.FAILED_PRECONDITION` if the setting is flagged as read only. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the setting value. On success, the response will contain only `name`, `local_value` and `etag`. The `metadata` and `effective_value` cannot be updated through this API. Note: the supplied setting will perform a full overwrite of the `local_value` field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Settings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Settings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        patch(params: Params$Resource$Folders$Settings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Settings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(params: Params$Resource$Folders$Settings$Patch, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
    }
    export interface Params$Resource$Folders$Settings$Get extends StandardParameters {
        /**
         * Required. The name of the setting to get. See Setting for naming requirements.
         */
        name?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Folders$Settings$List extends StandardParameters {
        /**
         * Unused. The size of the page to be returned.
         */
        pageSize?: number;
        /**
         * Unused. A page token used to retrieve the next page.
         */
        pageToken?: string;
        /**
         * Required. The project, folder, or organization that is the parent resource for this setting. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Folders$Settings$Patch extends StandardParameters {
        /**
         * The resource name of the setting. Must be in one of the following forms: * `projects/{project_number\}/settings/{setting_name\}` * `folders/{folder_id\}/settings/{setting_name\}` * `organizations/{organization_id\}/settings/{setting_name\}` For example, "/projects/123/settings/gcp-enableMyFeature"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudResourcesettingsV1Setting;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        settings: Resource$Organizations$Settings;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Settings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Settings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Settings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        get(params: Params$Resource$Organizations$Settings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Settings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(params: Params$Resource$Organizations$Settings$Get, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        /**
         * Lists all the settings that are available on the Cloud resource `parent`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Settings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Settings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>>;
        list(params: Params$Resource$Organizations$Settings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Settings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(params: Params$Resource$Organizations$Settings$List, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        /**
         * Updates a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.FAILED_PRECONDITION` if the setting is flagged as read only. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the setting value. On success, the response will contain only `name`, `local_value` and `etag`. The `metadata` and `effective_value` cannot be updated through this API. Note: the supplied setting will perform a full overwrite of the `local_value` field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Settings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Settings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        patch(params: Params$Resource$Organizations$Settings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Settings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(params: Params$Resource$Organizations$Settings$Patch, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
    }
    export interface Params$Resource$Organizations$Settings$Get extends StandardParameters {
        /**
         * Required. The name of the setting to get. See Setting for naming requirements.
         */
        name?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Organizations$Settings$List extends StandardParameters {
        /**
         * Unused. The size of the page to be returned.
         */
        pageSize?: number;
        /**
         * Unused. A page token used to retrieve the next page.
         */
        pageToken?: string;
        /**
         * Required. The project, folder, or organization that is the parent resource for this setting. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Organizations$Settings$Patch extends StandardParameters {
        /**
         * The resource name of the setting. Must be in one of the following forms: * `projects/{project_number\}/settings/{setting_name\}` * `folders/{folder_id\}/settings/{setting_name\}` * `organizations/{organization_id\}/settings/{setting_name\}` For example, "/projects/123/settings/gcp-enableMyFeature"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudResourcesettingsV1Setting;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        settings: Resource$Projects$Settings;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Settings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Settings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Settings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        get(params: Params$Resource$Projects$Settings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Settings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(params: Params$Resource$Projects$Settings$Get, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        /**
         * Lists all the settings that are available on the Cloud resource `parent`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Settings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Settings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>>;
        list(params: Params$Resource$Projects$Settings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Settings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(params: Params$Resource$Projects$Settings$List, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1ListSettingsResponse>): void;
        /**
         * Updates a specified setting. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the setting does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.FAILED_PRECONDITION` if the setting is flagged as read only. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the setting value. On success, the response will contain only `name`, `local_value` and `etag`. The `metadata` and `effective_value` cannot be updated through this API. Note: the supplied setting will perform a full overwrite of the `local_value` field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Settings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Settings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudResourcesettingsV1Setting>>;
        patch(params: Params$Resource$Projects$Settings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Settings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(params: Params$Resource$Projects$Settings$Patch, callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudResourcesettingsV1Setting>): void;
    }
    export interface Params$Resource$Projects$Settings$Get extends StandardParameters {
        /**
         * Required. The name of the setting to get. See Setting for naming requirements.
         */
        name?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Settings$List extends StandardParameters {
        /**
         * Unused. The size of the page to be returned.
         */
        pageSize?: number;
        /**
         * Unused. A page token used to retrieve the next page.
         */
        pageToken?: string;
        /**
         * Required. The project, folder, or organization that is the parent resource for this setting. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * The SettingView for this request.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Settings$Patch extends StandardParameters {
        /**
         * The resource name of the setting. Must be in one of the following forms: * `projects/{project_number\}/settings/{setting_name\}` * `folders/{folder_id\}/settings/{setting_name\}` * `organizations/{organization_id\}/settings/{setting_name\}` For example, "/projects/123/settings/gcp-enableMyFeature"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudResourcesettingsV1Setting;
    }
    export {};
}
