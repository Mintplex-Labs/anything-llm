import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace policyanalyzer_v1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1beta1';
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
     * Policy Analyzer API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const policyanalyzer = google.policyanalyzer('v1beta1');
     * ```
     */
    export class Policyanalyzer {
        context: APIRequestContext;
        folders: Resource$Folders;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents Activity on a GCP resource over specific observation period.
     */
    export interface Schema$GoogleCloudPolicyanalyzerV1beta1Activity {
        /**
         * A struct of custom fields to explain the activity.
         */
        activity?: {
            [key: string]: any;
        } | null;
        /**
         * The type of the activity.
         */
        activityType?: string | null;
        /**
         * The full resource name that identifies the resource. For examples of full resource names for Google Cloud services, see https://cloud.google.com/iam/help/troubleshooter/full-resource-names.
         */
        fullResourceName?: string | null;
        /**
         * The data observation period to build the activity.
         */
        observationPeriod?: Schema$GoogleCloudPolicyanalyzerV1beta1ObservationPeriod;
    }
    /**
     * Represents data observation period.
     */
    export interface Schema$GoogleCloudPolicyanalyzerV1beta1ObservationPeriod {
        /**
         * The observation end time.
         */
        endTime?: string | null;
        /**
         * The observation start time.
         */
        startTime?: string | null;
    }
    /**
     * Response to the `QueryActivity` method.
     */
    export interface Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse {
        /**
         * The set of activities that match the filter included in the request.
         */
        activities?: Schema$GoogleCloudPolicyanalyzerV1beta1Activity[];
        /**
         * If there might be more results than those appearing in this response, then `nextPageToken` is included. To get the next set of results, call this method again using the value of `nextPageToken` as `pageToken`.
         */
        nextPageToken?: string | null;
    }
    export class Resource$Folders {
        context: APIRequestContext;
        locations: Resource$Folders$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Folders$Locations {
        context: APIRequestContext;
        activityTypes: Resource$Folders$Locations$Activitytypes;
        constructor(context: APIRequestContext);
    }
    export class Resource$Folders$Locations$Activitytypes {
        context: APIRequestContext;
        activities: Resource$Folders$Locations$Activitytypes$Activities;
        constructor(context: APIRequestContext);
    }
    export class Resource$Folders$Locations$Activitytypes$Activities {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Queries policy activities on GCP resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        query(params: Params$Resource$Folders$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Folders$Locations$Activitytypes$Activities$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>>;
        query(params: Params$Resource$Folders$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Folders$Locations$Activitytypes$Activities$Query, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(params: Params$Resource$Folders$Locations$Activitytypes$Activities$Query, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Activitytypes$Activities$Query extends StandardParameters {
        /**
         * Optional. Optional filter expression to restrict the activities returned. Supported filters are: - service_account_last_authn.full_resource_name {=\} - service_account_key_last_authn.full_resource_name {=\}
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Max limit is 1000. Non-positive values are ignored. The presence of `nextPageToken` in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. `pageToken` must be the value of `nextPageToken` from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The container resource on which to execute the request. Acceptable formats: `projects/[PROJECT_ID|PROJECT_NUMBER]/locations/[LOCATION]/activityTypes/[ACTIVITY_TYPE]` LOCATION here refers to GCP Locations: https://cloud.google.com/about/locations/
         */
        parent?: string;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        locations: Resource$Organizations$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations {
        context: APIRequestContext;
        activityTypes: Resource$Organizations$Locations$Activitytypes;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations$Activitytypes {
        context: APIRequestContext;
        activities: Resource$Organizations$Locations$Activitytypes$Activities;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations$Activitytypes$Activities {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Queries policy activities on GCP resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        query(params: Params$Resource$Organizations$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Organizations$Locations$Activitytypes$Activities$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>>;
        query(params: Params$Resource$Organizations$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Organizations$Locations$Activitytypes$Activities$Query, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(params: Params$Resource$Organizations$Locations$Activitytypes$Activities$Query, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Activitytypes$Activities$Query extends StandardParameters {
        /**
         * Optional. Optional filter expression to restrict the activities returned. Supported filters are: - service_account_last_authn.full_resource_name {=\} - service_account_key_last_authn.full_resource_name {=\}
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Max limit is 1000. Non-positive values are ignored. The presence of `nextPageToken` in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. `pageToken` must be the value of `nextPageToken` from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The container resource on which to execute the request. Acceptable formats: `projects/[PROJECT_ID|PROJECT_NUMBER]/locations/[LOCATION]/activityTypes/[ACTIVITY_TYPE]` LOCATION here refers to GCP Locations: https://cloud.google.com/about/locations/
         */
        parent?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        activityTypes: Resource$Projects$Locations$Activitytypes;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Activitytypes {
        context: APIRequestContext;
        activities: Resource$Projects$Locations$Activitytypes$Activities;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Activitytypes$Activities {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Queries policy activities on GCP resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        query(params: Params$Resource$Projects$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Projects$Locations$Activitytypes$Activities$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>>;
        query(params: Params$Resource$Projects$Locations$Activitytypes$Activities$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Projects$Locations$Activitytypes$Activities$Query, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(params: Params$Resource$Projects$Locations$Activitytypes$Activities$Query, callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
        query(callback: BodyResponseCallback<Schema$GoogleCloudPolicyanalyzerV1beta1QueryActivityResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Activitytypes$Activities$Query extends StandardParameters {
        /**
         * Optional. Optional filter expression to restrict the activities returned. Supported filters are: - service_account_last_authn.full_resource_name {=\} - service_account_key_last_authn.full_resource_name {=\}
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Max limit is 1000. Non-positive values are ignored. The presence of `nextPageToken` in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. `pageToken` must be the value of `nextPageToken` from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The container resource on which to execute the request. Acceptable formats: `projects/[PROJECT_ID|PROJECT_NUMBER]/locations/[LOCATION]/activityTypes/[ACTIVITY_TYPE]` LOCATION here refers to GCP Locations: https://cloud.google.com/about/locations/
         */
        parent?: string;
    }
    export {};
}
