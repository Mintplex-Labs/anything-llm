import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace doubleclickbidmanager_v1_1 {
    export interface Options extends GlobalOptions {
        version: 'v1.1';
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
     * DoubleClick Bid Manager API
     *
     * DoubleClick Bid Manager API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
     * ```
     */
    export class Doubleclickbidmanager {
        context: APIRequestContext;
        queries: Resource$Queries;
        reports: Resource$Reports;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A channel grouping defines a set of rules that can be used to categorize events in a path report.
     */
    export interface Schema$ChannelGrouping {
        /**
         * The name to apply to an event that does not match any of the rules in the channel grouping.
         */
        fallbackName?: string | null;
        /**
         * Channel Grouping name.
         */
        name?: string | null;
        /**
         * Rules within Channel Grouping. There is a limit of 100 rules that can be set per channel grouping.
         */
        rules?: Schema$Rule[];
    }
    /**
     * DisjunctiveMatchStatement that OR's all contained filters.
     */
    export interface Schema$DisjunctiveMatchStatement {
        /**
         * Filters. There is a limit of 100 filters that can be set per disjunctive match statement.
         */
        eventFilters?: Schema$EventFilter[];
    }
    /**
     * Defines the type of filter to be applied to the path, a DV360 event dimension filter.
     */
    export interface Schema$EventFilter {
        /**
         * Filter on a dimension.
         */
        dimensionFilter?: Schema$PathQueryOptionsFilter;
    }
    /**
     * Filter used to match traffic data in your report.
     */
    export interface Schema$FilterPair {
        /**
         * Filter type.
         */
        type?: string | null;
        /**
         * Filter value.
         */
        value?: string | null;
    }
    /**
     * List queries response.
     */
    export interface Schema$ListQueriesResponse {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "doubleclickbidmanager#listQueriesResponse".
         */
        kind?: string | null;
        /**
         * Next page's pagination token if one exists.
         */
        nextPageToken?: string | null;
        /**
         * Retrieved queries.
         */
        queries?: Schema$Query[];
    }
    /**
     * List reports response.
     */
    export interface Schema$ListReportsResponse {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "doubleclickbidmanager#listReportsResponse".
         */
        kind?: string | null;
        /**
         * Next page's pagination token if one exists.
         */
        nextPageToken?: string | null;
        /**
         * Retrieved reports.
         */
        reports?: Schema$Report[];
    }
    /**
     * Additional query options.
     */
    export interface Schema$Options {
        /**
         * Set to true and filter your report by `FILTER_INSERTION_ORDER` or `FILTER_LINE_ITEM` to include data for audience lists specifically targeted by those items.
         */
        includeOnlyTargetedUserLists?: boolean | null;
        /**
         * Options that contain Path Filters and Custom Channel Groupings.
         */
        pathQueryOptions?: Schema$PathQueryOptions;
    }
    /**
     * Parameters of a query or report.
     */
    export interface Schema$Parameters {
        /**
         * Filters used to match traffic data in your report.
         */
        filters?: Schema$FilterPair[];
        /**
         * Data is grouped by the filters listed in this field.
         */
        groupBys?: string[] | null;
        /**
         * Deprecated. This field is no longer in use.
         */
        includeInviteData?: boolean | null;
        /**
         * Metrics to include as columns in your report.
         */
        metrics?: string[] | null;
        /**
         * Additional query options.
         */
        options?: Schema$Options;
        /**
         * Report type.
         */
        type?: string | null;
    }
    /**
     * Path filters specify which paths to include in a report. A path is the result of combining DV360 events based on User ID to create a workflow of users' actions. When a path filter is set, the resulting report will only include paths that match the specified event at the specified position. All other paths will be excluded.
     */
    export interface Schema$PathFilter {
        /**
         * Filter on an event to be applied to some part of the path.
         */
        eventFilters?: Schema$EventFilter[];
        /**
         * Indicates the position of the path the filter should match to (first, last, or any event in path).
         */
        pathMatchPosition?: string | null;
    }
    /**
     * Path Query Options for Report Options.
     */
    export interface Schema$PathQueryOptions {
        /**
         * Custom Channel Groupings.
         */
        channelGrouping?: Schema$ChannelGrouping;
        /**
         * Path Filters. There is a limit of 100 path filters that can be set per report.
         */
        pathFilters?: Schema$PathFilter[];
    }
    /**
     * Dimension Filter on path events.
     */
    export interface Schema$PathQueryOptionsFilter {
        /**
         * Dimension the filter is applied to.
         */
        filter?: string | null;
        /**
         * Indicates how the filter should be matched to the value.
         */
        match?: string | null;
        /**
         * Value to filter on.
         */
        values?: string[] | null;
    }
    /**
     * Represents a query.
     */
    export interface Schema$Query {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "doubleclickbidmanager#query".
         */
        kind?: string | null;
        /**
         * Query metadata.
         */
        metadata?: Schema$QueryMetadata;
        /**
         * Query parameters.
         */
        params?: Schema$Parameters;
        /**
         * Query ID.
         */
        queryId?: string | null;
        /**
         * The ending time for the data that is shown in the report. Note, reportDataEndTimeMs is required if metadata.dataRange is CUSTOM_DATES and ignored otherwise.
         */
        reportDataEndTimeMs?: string | null;
        /**
         * The starting time for the data that is shown in the report. Note, reportDataStartTimeMs is required if metadata.dataRange is CUSTOM_DATES and ignored otherwise.
         */
        reportDataStartTimeMs?: string | null;
        /**
         * Information on how often and when to run a query.
         */
        schedule?: Schema$QuerySchedule;
        /**
         * Canonical timezone code for report data time. Defaults to America/New_York.
         */
        timezoneCode?: string | null;
    }
    /**
     * Query metadata.
     */
    export interface Schema$QueryMetadata {
        /**
         * Range of report data.
         */
        dataRange?: string | null;
        /**
         * Format of the generated report.
         */
        format?: string | null;
        /**
         * The path to the location in Google Cloud Storage where the latest report is stored.
         */
        googleCloudStoragePathForLatestReport?: string | null;
        /**
         * The path in Google Drive for the latest report.
         */
        googleDrivePathForLatestReport?: string | null;
        /**
         * The time when the latest report started to run.
         */
        latestReportRunTimeMs?: string | null;
        /**
         * Locale of the generated reports. Valid values are cs CZECH de GERMAN en ENGLISH es SPANISH fr FRENCH it ITALIAN ja JAPANESE ko KOREAN pl POLISH pt-BR BRAZILIAN_PORTUGUESE ru RUSSIAN tr TURKISH uk UKRAINIAN zh-CN CHINA_CHINESE zh-TW TAIWAN_CHINESE An locale string not in the list above will generate reports in English.
         */
        locale?: string | null;
        /**
         * Number of reports that have been generated for the query.
         */
        reportCount?: number | null;
        /**
         * Whether the latest report is currently running.
         */
        running?: boolean | null;
        /**
         * Whether to send an email notification when a report is ready. Default to false.
         */
        sendNotification?: boolean | null;
        /**
         * List of email addresses which are sent email notifications when the report is finished. Separate from sendNotification.
         */
        shareEmailAddress?: string[] | null;
        /**
         * Query title. It is used to name the reports generated from this query.
         */
        title?: string | null;
    }
    /**
     * Information on how frequently and when to run a query.
     */
    export interface Schema$QuerySchedule {
        /**
         * Datetime to periodically run the query until.
         */
        endTimeMs?: string | null;
        /**
         * How often the query is run.
         */
        frequency?: string | null;
        /**
         * Time of day at which a new report will be generated, represented as minutes past midnight. Range is 0 to 1439. Only applies to scheduled reports.
         */
        nextRunMinuteOfDay?: number | null;
        /**
         * Canonical timezone code for report generation time. Defaults to America/New_York.
         */
        nextRunTimezoneCode?: string | null;
        /**
         * When to start running the query. Not applicable to `ONE_TIME` frequency.
         */
        startTimeMs?: string | null;
    }
    /**
     * Represents a report.
     */
    export interface Schema$Report {
        /**
         * Key used to identify a report.
         */
        key?: Schema$ReportKey;
        /**
         * Report metadata.
         */
        metadata?: Schema$ReportMetadata;
        /**
         * Report parameters.
         */
        params?: Schema$Parameters;
    }
    /**
     * An explanation of a report failure.
     */
    export interface Schema$ReportFailure {
        /**
         * Error code that shows why the report was not created.
         */
        errorCode?: string | null;
    }
    /**
     * Key used to identify a report.
     */
    export interface Schema$ReportKey {
        /**
         * Query ID.
         */
        queryId?: string | null;
        /**
         * Report ID.
         */
        reportId?: string | null;
    }
    /**
     * Report metadata.
     */
    export interface Schema$ReportMetadata {
        /**
         * The path to the location in Google Cloud Storage where the report is stored.
         */
        googleCloudStoragePath?: string | null;
        /**
         * The ending time for the data that is shown in the report.
         */
        reportDataEndTimeMs?: string | null;
        /**
         * The starting time for the data that is shown in the report.
         */
        reportDataStartTimeMs?: string | null;
        /**
         * Report status.
         */
        status?: Schema$ReportStatus;
    }
    /**
     * Report status.
     */
    export interface Schema$ReportStatus {
        /**
         * If the report failed, this records the cause.
         */
        failure?: Schema$ReportFailure;
        /**
         * The time when this report either completed successfully or failed.
         */
        finishTimeMs?: string | null;
        /**
         * The file type of the report.
         */
        format?: string | null;
        /**
         * The state of the report.
         */
        state?: string | null;
    }
    /**
     * A Rule defines a name, and a boolean expression in [conjunctive normal form](http: //mathworld.wolfram.com/ConjunctiveNormalForm.html){.external\} that can be // applied to a path event to determine if that name should be applied.
     */
    export interface Schema$Rule {
        disjunctiveMatchStatements?: Schema$DisjunctiveMatchStatement[];
        /**
         * Rule name.
         */
        name?: string | null;
    }
    /**
     * Request to run a stored query to generate a report.
     */
    export interface Schema$RunQueryRequest {
        /**
         * Report data range used to generate the report.
         */
        dataRange?: string | null;
        /**
         * The ending time for the data that is shown in the report. Note, reportDataEndTimeMs is required if dataRange is CUSTOM_DATES and ignored otherwise.
         */
        reportDataEndTimeMs?: string | null;
        /**
         * The starting time for the data that is shown in the report. Note, reportDataStartTimeMs is required if dataRange is CUSTOM_DATES and ignored otherwise.
         */
        reportDataStartTimeMs?: string | null;
        /**
         * Canonical timezone code for report data time. Defaults to America/New_York.
         */
        timezoneCode?: string | null;
    }
    export class Resource$Queries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a query.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.queries.createquery({
         *     // If true, tries to run the query asynchronously. Only applicable when the frequency is ONE_TIME.
         *     asynchronous: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "kind": "my_kind",
         *       //   "metadata": {},
         *       //   "params": {},
         *       //   "queryId": "my_queryId",
         *       //   "reportDataEndTimeMs": "my_reportDataEndTimeMs",
         *       //   "reportDataStartTimeMs": "my_reportDataStartTimeMs",
         *       //   "schedule": {},
         *       //   "timezoneCode": "my_timezoneCode"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "params": {},
         *   //   "queryId": "my_queryId",
         *   //   "reportDataEndTimeMs": "my_reportDataEndTimeMs",
         *   //   "reportDataStartTimeMs": "my_reportDataStartTimeMs",
         *   //   "schedule": {},
         *   //   "timezoneCode": "my_timezoneCode"
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
        createquery(params: Params$Resource$Queries$Createquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createquery(params?: Params$Resource$Queries$Createquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Query>>;
        createquery(params: Params$Resource$Queries$Createquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createquery(params: Params$Resource$Queries$Createquery, options: MethodOptions | BodyResponseCallback<Schema$Query>, callback: BodyResponseCallback<Schema$Query>): void;
        createquery(params: Params$Resource$Queries$Createquery, callback: BodyResponseCallback<Schema$Query>): void;
        createquery(callback: BodyResponseCallback<Schema$Query>): void;
        /**
         * Deletes a stored query as well as the associated stored reports.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.queries.deletequery({
         *     // Query ID to delete.
         *     queryId: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        deletequery(params: Params$Resource$Queries$Deletequery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deletequery(params?: Params$Resource$Queries$Deletequery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        deletequery(params: Params$Resource$Queries$Deletequery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deletequery(params: Params$Resource$Queries$Deletequery, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        deletequery(params: Params$Resource$Queries$Deletequery, callback: BodyResponseCallback<void>): void;
        deletequery(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves a stored query.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.queries.getquery({
         *     // Query ID to retrieve.
         *     queryId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "params": {},
         *   //   "queryId": "my_queryId",
         *   //   "reportDataEndTimeMs": "my_reportDataEndTimeMs",
         *   //   "reportDataStartTimeMs": "my_reportDataStartTimeMs",
         *   //   "schedule": {},
         *   //   "timezoneCode": "my_timezoneCode"
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
        getquery(params: Params$Resource$Queries$Getquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getquery(params?: Params$Resource$Queries$Getquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Query>>;
        getquery(params: Params$Resource$Queries$Getquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getquery(params: Params$Resource$Queries$Getquery, options: MethodOptions | BodyResponseCallback<Schema$Query>, callback: BodyResponseCallback<Schema$Query>): void;
        getquery(params: Params$Resource$Queries$Getquery, callback: BodyResponseCallback<Schema$Query>): void;
        getquery(callback: BodyResponseCallback<Schema$Query>): void;
        /**
         * Retrieves stored queries.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.queries.listqueries({
         *     // Maximum number of results per page. Must be between 1 and 100. Defaults to 100 if unspecified.
         *     pageSize: 'placeholder-value',
         *     // Optional pagination token.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "queries": []
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
        listqueries(params: Params$Resource$Queries$Listqueries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listqueries(params?: Params$Resource$Queries$Listqueries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListQueriesResponse>>;
        listqueries(params: Params$Resource$Queries$Listqueries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listqueries(params: Params$Resource$Queries$Listqueries, options: MethodOptions | BodyResponseCallback<Schema$ListQueriesResponse>, callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        listqueries(params: Params$Resource$Queries$Listqueries, callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        listqueries(callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        /**
         * Runs a stored query to generate a report.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.queries.runquery({
         *     // If true, tries to run the query asynchronously.
         *     asynchronous: 'placeholder-value',
         *     // Query ID to run.
         *     queryId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dataRange": "my_dataRange",
         *       //   "reportDataEndTimeMs": "my_reportDataEndTimeMs",
         *       //   "reportDataStartTimeMs": "my_reportDataStartTimeMs",
         *       //   "timezoneCode": "my_timezoneCode"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
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
        runquery(params: Params$Resource$Queries$Runquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runquery(params?: Params$Resource$Queries$Runquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        runquery(params: Params$Resource$Queries$Runquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runquery(params: Params$Resource$Queries$Runquery, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        runquery(params: Params$Resource$Queries$Runquery, callback: BodyResponseCallback<void>): void;
        runquery(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Queries$Createquery extends StandardParameters {
        /**
         * If true, tries to run the query asynchronously. Only applicable when the frequency is ONE_TIME.
         */
        asynchronous?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Query;
    }
    export interface Params$Resource$Queries$Deletequery extends StandardParameters {
        /**
         * Query ID to delete.
         */
        queryId?: string;
    }
    export interface Params$Resource$Queries$Getquery extends StandardParameters {
        /**
         * Query ID to retrieve.
         */
        queryId?: string;
    }
    export interface Params$Resource$Queries$Listqueries extends StandardParameters {
        /**
         * Maximum number of results per page. Must be between 1 and 100. Defaults to 100 if unspecified.
         */
        pageSize?: number;
        /**
         * Optional pagination token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Queries$Runquery extends StandardParameters {
        /**
         * If true, tries to run the query asynchronously.
         */
        asynchronous?: boolean;
        /**
         * Query ID to run.
         */
        queryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunQueryRequest;
    }
    export class Resource$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves stored reports.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/doubleclickbidmanager.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await doubleclickbidmanager.reports.listreports({
         *     // Maximum number of results per page. Must be between 1 and 100. Defaults to 100 if unspecified.
         *     pageSize: 'placeholder-value',
         *     // Optional pagination token.
         *     pageToken: 'placeholder-value',
         *     // Query ID with which the reports are associated.
         *     queryId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "reports": []
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
        listreports(params: Params$Resource$Reports$Listreports, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listreports(params?: Params$Resource$Reports$Listreports, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListReportsResponse>>;
        listreports(params: Params$Resource$Reports$Listreports, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listreports(params: Params$Resource$Reports$Listreports, options: MethodOptions | BodyResponseCallback<Schema$ListReportsResponse>, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        listreports(params: Params$Resource$Reports$Listreports, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        listreports(callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
    }
    export interface Params$Resource$Reports$Listreports extends StandardParameters {
        /**
         * Maximum number of results per page. Must be between 1 and 100. Defaults to 100 if unspecified.
         */
        pageSize?: number;
        /**
         * Optional pagination token.
         */
        pageToken?: string;
        /**
         * Query ID with which the reports are associated.
         */
        queryId?: string;
    }
    export {};
}
