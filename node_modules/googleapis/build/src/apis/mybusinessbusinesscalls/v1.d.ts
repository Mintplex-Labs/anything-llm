import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace mybusinessbusinesscalls_v1 {
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
     * My Business Business Calls API
     *
     * The My Business Business Calls API manages business calls information of a location on Google and collect insights like the number of missed calls to their location. Additional information about Business calls can be found at https://support.google.com/business/answer/9688285?p=call_history. If the Google Business Profile links to a Google Ads account and call history is turned on, calls that last longer than a specific time, and that can be attributed to an ad interaction, will show in the linked Google Ads account under the &quot;Calls from Ads&quot; conversion. If smart bidding and call conversions are used in the optimization strategy, there could be a change in ad spend. Learn more about smart bidding. To view and perform actions on a location&#39;s calls, you need to be a `OWNER`, `CO_OWNER` or `MANAGER` of the location. Note - If you have a quota of 0 after enabling the API, please request for GBP API access.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const mybusinessbusinesscalls = google.mybusinessbusinesscalls('v1');
     * ```
     */
    export class Mybusinessbusinesscalls {
        context: APIRequestContext;
        locations: Resource$Locations;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Metrics aggregated over the input time range.
     */
    export interface Schema$AggregateMetrics {
        /**
         * Total count of answered calls.
         */
        answeredCallsCount?: number | null;
        /**
         * End date for this metric.
         */
        endDate?: Schema$Date;
        /**
         * A list of metrics by hour of day.
         */
        hourlyMetrics?: Schema$HourlyMetrics[];
        /**
         * Total count of missed calls.
         */
        missedCallsCount?: number | null;
        /**
         * Date for this metric. If metric is monthly, only year and month are used.
         */
        startDate?: Schema$Date;
        /**
         * A list of metrics by day of week.
         */
        weekdayMetrics?: Schema$WeekDayMetrics[];
    }
    /**
     * Insights for calls made to a location.
     */
    export interface Schema$BusinessCallsInsights {
        /**
         * Metric for the time range based on start_date and end_date.
         */
        aggregateMetrics?: Schema$AggregateMetrics;
        /**
         * The metric for which the value applies.
         */
        metricType?: string | null;
        /**
         * Required. The resource name of the calls insights. Format: locations/{location\}/businesscallsinsights
         */
        name?: string | null;
    }
    /**
     * Business calls settings for a location.
     */
    export interface Schema$BusinessCallsSettings {
        /**
         * Required. The state of this location's enrollment in Business calls.
         */
        callsState?: string | null;
        /**
         * Input only. Time when the end user provided consent to the API user to enable business calls.
         */
        consentTime?: string | null;
        /**
         * Required. The resource name of the calls settings. Format: locations/{location\}/businesscallssettings
         */
        name?: string | null;
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$Date {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        day?: number | null;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        month?: number | null;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        year?: number | null;
    }
    /**
     * Metrics for an hour.
     */
    export interface Schema$HourlyMetrics {
        /**
         * Hour of the day. Allowed values are 0-23.
         */
        hour?: number | null;
        /**
         * Total count of missed calls for this hour.
         */
        missedCallsCount?: number | null;
    }
    /**
     * Response message for ListBusinessCallsInsights.
     */
    export interface Schema$ListBusinessCallsInsightsResponse {
        /**
         * A collection of business calls insights for the location.
         */
        businessCallsInsights?: Schema$BusinessCallsInsights[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. Some of the metric_types (e.g, AGGREGATE_COUNT) returns a single page. For these metrics, the next_page_token will be empty.
         */
        nextPageToken?: string | null;
    }
    /**
     * Metrics for a week day.
     */
    export interface Schema$WeekDayMetrics {
        /**
         * Day of the week. Allowed values are Sunday - Saturday.
         */
        day?: string | null;
        /**
         * Total count of missed calls for this hour.
         */
        missedCallsCount?: number | null;
    }
    export class Resource$Locations {
        context: APIRequestContext;
        businesscallsinsights: Resource$Locations$Businesscallsinsights;
        constructor(context: APIRequestContext);
        /**
         * Returns the Business calls settings resource for the given location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/mybusinessbusinesscalls.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const mybusinessbusinesscalls = google.mybusinessbusinesscalls('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await mybusinessbusinesscalls.locations.getBusinesscallssettings({
         *     // Required. The BusinessCallsSettings to get. The `name` field is used to identify the business call settings to get. Format: locations/{location_id\}/businesscallssettings.
         *     name: 'locations/my-location/businesscallssettings',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "callsState": "my_callsState",
         *   //   "consentTime": "my_consentTime",
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getBusinesscallssettings(params: Params$Resource$Locations$Getbusinesscallssettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getBusinesscallssettings(params?: Params$Resource$Locations$Getbusinesscallssettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BusinessCallsSettings>>;
        getBusinesscallssettings(params: Params$Resource$Locations$Getbusinesscallssettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getBusinesscallssettings(params: Params$Resource$Locations$Getbusinesscallssettings, options: MethodOptions | BodyResponseCallback<Schema$BusinessCallsSettings>, callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
        getBusinesscallssettings(params: Params$Resource$Locations$Getbusinesscallssettings, callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
        getBusinesscallssettings(callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
        /**
         * Updates the Business call settings for the specified location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/mybusinessbusinesscalls.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const mybusinessbusinesscalls = google.mybusinessbusinesscalls('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await mybusinessbusinesscalls.locations.updateBusinesscallssettings({
         *       // Required. The resource name of the calls settings. Format: locations/{location\}/businesscallssettings
         *       name: 'locations/my-location/businesscallssettings',
         *       // Required. The list of fields to update.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "callsState": "my_callsState",
         *         //   "consentTime": "my_consentTime",
         *         //   "name": "my_name"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "callsState": "my_callsState",
         *   //   "consentTime": "my_consentTime",
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateBusinesscallssettings(params: Params$Resource$Locations$Updatebusinesscallssettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateBusinesscallssettings(params?: Params$Resource$Locations$Updatebusinesscallssettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BusinessCallsSettings>>;
        updateBusinesscallssettings(params: Params$Resource$Locations$Updatebusinesscallssettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateBusinesscallssettings(params: Params$Resource$Locations$Updatebusinesscallssettings, options: MethodOptions | BodyResponseCallback<Schema$BusinessCallsSettings>, callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
        updateBusinesscallssettings(params: Params$Resource$Locations$Updatebusinesscallssettings, callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
        updateBusinesscallssettings(callback: BodyResponseCallback<Schema$BusinessCallsSettings>): void;
    }
    export interface Params$Resource$Locations$Getbusinesscallssettings extends StandardParameters {
        /**
         * Required. The BusinessCallsSettings to get. The `name` field is used to identify the business call settings to get. Format: locations/{location_id\}/businesscallssettings.
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Updatebusinesscallssettings extends StandardParameters {
        /**
         * Required. The resource name of the calls settings. Format: locations/{location\}/businesscallssettings
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BusinessCallsSettings;
    }
    export class Resource$Locations$Businesscallsinsights {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns insights for Business calls for a location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/mybusinessbusinesscalls.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const mybusinessbusinesscalls = google.mybusinessbusinesscalls('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await mybusinessbusinesscalls.locations.businesscallsinsights.list({
         *       // Optional. A filter constraining the calls insights to return. The response includes only entries that match the filter. If the MetricType is not provided, AGGREGATE_COUNT is returned. If no end_date is provided, the last date for which data is available is used. If no start_date is provided, we will default to the first date for which data is available, which is currently 6 months. If start_date is before the date when data is available, data is returned starting from the date when it is available. At this time we support following filters. 1. start_date="DATE" where date is in YYYY-MM-DD format. 2. end_date="DATE" where date is in YYYY-MM-DD format. 3. metric_type=XYZ where XYZ is a valid MetricType. 4. Conjunctions(AND) of all of the above. e.g., "start_date=2021-08-01 AND end_date=2021-08-10 AND metric_type=AGGREGATE_COUNT" The AGGREGATE_COUNT metric_type ignores the DD part of the date.
         *       filter: 'placeholder-value',
         *       // Optional. The maximum number of BusinessCallsInsights to return. If unspecified, at most 20 will be returned. Some of the metric_types(e.g, AGGREGATE_COUNT) returns a single page. For these metrics, the page_size is ignored.
         *       pageSize: 'placeholder-value',
         *       // Optional. A page token, received from a previous `ListBusinessCallsInsights` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBusinessCallsInsights` must match the call that provided the page token. Some of the metric_types (e.g, AGGREGATE_COUNT) returns a single page. For these metrics, the pake_token is ignored.
         *       pageToken: 'placeholder-value',
         *       // Required. The parent location to fetch calls insights for. Format: locations/{location_id\}
         *       parent: 'locations/my-location',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "businessCallsInsights": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Businesscallsinsights$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Businesscallsinsights$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBusinessCallsInsightsResponse>>;
        list(params: Params$Resource$Locations$Businesscallsinsights$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Businesscallsinsights$List, options: MethodOptions | BodyResponseCallback<Schema$ListBusinessCallsInsightsResponse>, callback: BodyResponseCallback<Schema$ListBusinessCallsInsightsResponse>): void;
        list(params: Params$Resource$Locations$Businesscallsinsights$List, callback: BodyResponseCallback<Schema$ListBusinessCallsInsightsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBusinessCallsInsightsResponse>): void;
    }
    export interface Params$Resource$Locations$Businesscallsinsights$List extends StandardParameters {
        /**
         * Optional. A filter constraining the calls insights to return. The response includes only entries that match the filter. If the MetricType is not provided, AGGREGATE_COUNT is returned. If no end_date is provided, the last date for which data is available is used. If no start_date is provided, we will default to the first date for which data is available, which is currently 6 months. If start_date is before the date when data is available, data is returned starting from the date when it is available. At this time we support following filters. 1. start_date="DATE" where date is in YYYY-MM-DD format. 2. end_date="DATE" where date is in YYYY-MM-DD format. 3. metric_type=XYZ where XYZ is a valid MetricType. 4. Conjunctions(AND) of all of the above. e.g., "start_date=2021-08-01 AND end_date=2021-08-10 AND metric_type=AGGREGATE_COUNT" The AGGREGATE_COUNT metric_type ignores the DD part of the date.
         */
        filter?: string;
        /**
         * Optional. The maximum number of BusinessCallsInsights to return. If unspecified, at most 20 will be returned. Some of the metric_types(e.g, AGGREGATE_COUNT) returns a single page. For these metrics, the page_size is ignored.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListBusinessCallsInsights` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBusinessCallsInsights` must match the call that provided the page token. Some of the metric_types (e.g, AGGREGATE_COUNT) returns a single page. For these metrics, the pake_token is ignored.
         */
        pageToken?: string;
        /**
         * Required. The parent location to fetch calls insights for. Format: locations/{location_id\}
         */
        parent?: string;
    }
    export {};
}
