import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace bigquerydatatransfer_v1 {
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
     * BigQuery Data Transfer API
     *
     * Schedule queries or transfer external data from SaaS applications to Google BigQuery on a regular basis.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const bigquerydatatransfer = google.bigquerydatatransfer('v1');
     * ```
     */
    export class Bigquerydatatransfer {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A request to determine whether the user has valid credentials. This method is used to limit the number of OAuth popups in the user interface. The user id is inferred from the API call context. If the data source has the Google+ authorization type, this method returns false, as it cannot be determined whether the credentials are already valid merely based on the user id.
     */
    export interface Schema$CheckValidCredsRequest {
    }
    /**
     * A response indicating whether the credentials exist and are valid.
     */
    export interface Schema$CheckValidCredsResponse {
        /**
         * If set to `true`, the credentials exist and are valid.
         */
        hasValidCreds?: boolean | null;
    }
    /**
     * Defines the properties and custom parameters for a data source.
     */
    export interface Schema$DataSource {
        /**
         * Indicates the type of authorization.
         */
        authorizationType?: string | null;
        /**
         * Data source client id which should be used to receive refresh token.
         */
        clientId?: string | null;
        /**
         * Specifies whether the data source supports automatic data refresh for the past few days, and how it's supported. For some data sources, data might not be complete until a few days later, so it's useful to refresh data automatically.
         */
        dataRefreshType?: string | null;
        /**
         * Data source id.
         */
        dataSourceId?: string | null;
        /**
         * Default data refresh window on days. Only meaningful when `data_refresh_type` = `SLIDING_WINDOW`.
         */
        defaultDataRefreshWindowDays?: number | null;
        /**
         * Default data transfer schedule. Examples of valid schedules include: `1st,3rd monday of month 15:30`, `every wed,fri of jan,jun 13:15`, and `first sunday of quarter 00:00`.
         */
        defaultSchedule?: string | null;
        /**
         * User friendly data source description string.
         */
        description?: string | null;
        /**
         * User friendly data source name.
         */
        displayName?: string | null;
        /**
         * Url for the help document for this data source.
         */
        helpUrl?: string | null;
        /**
         * Disables backfilling and manual run scheduling for the data source.
         */
        manualRunsDisabled?: boolean | null;
        /**
         * The minimum interval for scheduler to schedule runs.
         */
        minimumScheduleInterval?: string | null;
        /**
         * Output only. Data source resource name.
         */
        name?: string | null;
        /**
         * Data source parameters.
         */
        parameters?: Schema$DataSourceParameter[];
        /**
         * Api auth scopes for which refresh token needs to be obtained. These are scopes needed by a data source to prepare data and ingest them into BigQuery, e.g., https://www.googleapis.com/auth/bigquery
         */
        scopes?: string[] | null;
        /**
         * Specifies whether the data source supports a user defined schedule, or operates on the default schedule. When set to `true`, user can override default schedule.
         */
        supportsCustomSchedule?: boolean | null;
        /**
         * Deprecated. This field has no effect.
         */
        supportsMultipleTransfers?: boolean | null;
        /**
         * Deprecated. This field has no effect.
         */
        transferType?: string | null;
        /**
         * The number of seconds to wait for an update from the data source before the Data Transfer Service marks the transfer as FAILED.
         */
        updateDeadlineSeconds?: number | null;
    }
    /**
     * A parameter used to define custom fields in a data source definition.
     */
    export interface Schema$DataSourceParameter {
        /**
         * All possible values for the parameter.
         */
        allowedValues?: string[] | null;
        /**
         * If true, it should not be used in new transfers, and it should not be visible to users.
         */
        deprecated?: boolean | null;
        /**
         * Parameter description.
         */
        description?: string | null;
        /**
         * Parameter display name in the user interface.
         */
        displayName?: string | null;
        /**
         * Deprecated. This field has no effect.
         */
        fields?: Schema$DataSourceParameter[];
        /**
         * Cannot be changed after initial creation.
         */
        immutable?: boolean | null;
        /**
         * For integer and double values specifies maximum allowed value.
         */
        maxValue?: number | null;
        /**
         * For integer and double values specifies minimum allowed value.
         */
        minValue?: number | null;
        /**
         * Parameter identifier.
         */
        paramId?: string | null;
        /**
         * Deprecated. This field has no effect.
         */
        recurse?: boolean | null;
        /**
         * Deprecated. This field has no effect.
         */
        repeated?: boolean | null;
        /**
         * Is parameter required.
         */
        required?: boolean | null;
        /**
         * Parameter type.
         */
        type?: string | null;
        /**
         * Description of the requirements for this field, in case the user input does not fulfill the regex pattern or min/max values.
         */
        validationDescription?: string | null;
        /**
         * URL to a help document to further explain the naming requirements.
         */
        validationHelpUrl?: string | null;
        /**
         * Regular expression which can be used for parameter validation.
         */
        validationRegex?: string | null;
    }
    /**
     * Represents preferences for sending email notifications for transfer run events.
     */
    export interface Schema$EmailPreferences {
        /**
         * If true, email notifications will be sent on transfer run failures.
         */
        enableFailureEmail?: boolean | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Represents the encryption configuration for a transfer.
     */
    export interface Schema$EncryptionConfiguration {
        /**
         * The name of the KMS key used for encrypting BigQuery data.
         */
        kmsKeyName?: string | null;
    }
    /**
     * A request to enroll a set of data sources so they are visible in the BigQuery UI's `Transfer` tab.
     */
    export interface Schema$EnrollDataSourcesRequest {
        /**
         * Data sources that are enrolled. It is required to provide at least one data source id.
         */
        dataSourceIds?: string[] | null;
    }
    /**
     * Options customizing EventDriven transfers schedule.
     */
    export interface Schema$EventDrivenSchedule {
        /**
         * Pub/Sub subscription name used to receive events. Only Google Cloud Storage data source support this option. Format: projects/{project\}/subscriptions/{subscription\}
         */
        pubsubSubscription?: string | null;
    }
    /**
     * Returns list of supported data sources and their metadata.
     */
    export interface Schema$ListDataSourcesResponse {
        /**
         * List of supported data sources and their transfer settings.
         */
        dataSources?: Schema$DataSource[];
        /**
         * Output only. The next-pagination token. For multiple-page list results, this token can be used as the `ListDataSourcesRequest.page_token` to request the next page of list results.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Locations.ListLocations.
     */
    export interface Schema$ListLocationsResponse {
        /**
         * A list of locations that matches the specified filter in the request.
         */
        locations?: Schema$Location[];
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * The returned list of pipelines in the project.
     */
    export interface Schema$ListTransferConfigsResponse {
        /**
         * Output only. The next-pagination token. For multiple-page list results, this token can be used as the `ListTransferConfigsRequest.page_token` to request the next page of list results.
         */
        nextPageToken?: string | null;
        /**
         * Output only. The stored pipeline transfer configurations.
         */
        transferConfigs?: Schema$TransferConfig[];
    }
    /**
     * The returned list transfer run messages.
     */
    export interface Schema$ListTransferLogsResponse {
        /**
         * Output only. The next-pagination token. For multiple-page list results, this token can be used as the `GetTransferRunLogRequest.page_token` to request the next page of list results.
         */
        nextPageToken?: string | null;
        /**
         * Output only. The stored pipeline transfer messages.
         */
        transferMessages?: Schema$TransferMessage[];
    }
    /**
     * The returned list of pipelines in the project.
     */
    export interface Schema$ListTransferRunsResponse {
        /**
         * Output only. The next-pagination token. For multiple-page list results, this token can be used as the `ListTransferRunsRequest.page_token` to request the next page of list results.
         */
        nextPageToken?: string | null;
        /**
         * Output only. The stored pipeline transfer runs.
         */
        transferRuns?: Schema$TransferRun[];
    }
    /**
     * A resource that represents a Google Cloud location.
     */
    export interface Schema$Location {
        /**
         * The friendly name for this location, typically a nearby city name. For example, "Tokyo".
         */
        displayName?: string | null;
        /**
         * Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"\}
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The canonical id for this location. For example: `"us-east1"`.
         */
        locationId?: string | null;
        /**
         * Service-specific metadata. For example the available capacity at the given location.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`
         */
        name?: string | null;
    }
    /**
     * Options customizing manual transfers schedule.
     */
    export interface Schema$ManualSchedule {
    }
    /**
     * Options customizing the data transfer schedule.
     */
    export interface Schema$ScheduleOptions {
        /**
         * If true, automatic scheduling of data transfer runs for this configuration will be disabled. The runs can be started on ad-hoc basis using StartManualTransferRuns API. When automatic scheduling is disabled, the TransferConfig.schedule field will be ignored.
         */
        disableAutoScheduling?: boolean | null;
        /**
         * Defines time to stop scheduling transfer runs. A transfer run cannot be scheduled at or after the end time. The end time can be changed at any moment. The time when a data transfer can be triggered manually is not limited by this option.
         */
        endTime?: string | null;
        /**
         * Specifies time to start scheduling transfer runs. The first run will be scheduled at or after the start time according to a recurrence pattern defined in the schedule string. The start time can be changed at any moment. The time when a data transfer can be triggered manually is not limited by this option.
         */
        startTime?: string | null;
    }
    /**
     * V2 options customizing different types of data transfer schedule. This field supports existing time-based and manual transfer schedule. Also supports Event-Driven transfer schedule. ScheduleOptionsV2 cannot be used together with ScheduleOptions/Schedule.
     */
    export interface Schema$ScheduleOptionsV2 {
        /**
         * Event driven transfer schedule options. If set, the transfer will be scheduled upon events arrial.
         */
        eventDrivenSchedule?: Schema$EventDrivenSchedule;
        /**
         * Manual transfer schedule. If set, the transfer run will not be auto-scheduled by the system, unless the client invokes StartManualTransferRuns. This is equivalent to disable_auto_scheduling = true.
         */
        manualSchedule?: Schema$ManualSchedule;
        /**
         * Time based transfer schedule options. This is the default schedule option.
         */
        timeBasedSchedule?: Schema$TimeBasedSchedule;
    }
    /**
     * A request to schedule transfer runs for a time range.
     */
    export interface Schema$ScheduleTransferRunsRequest {
        /**
         * Required. End time of the range of transfer runs. For example, `"2017-05-30T00:00:00+00:00"`.
         */
        endTime?: string | null;
        /**
         * Required. Start time of the range of transfer runs. For example, `"2017-05-25T00:00:00+00:00"`.
         */
        startTime?: string | null;
    }
    /**
     * A response to schedule transfer runs for a time range.
     */
    export interface Schema$ScheduleTransferRunsResponse {
        /**
         * The transfer runs that were scheduled.
         */
        runs?: Schema$TransferRun[];
    }
    /**
     * A request to start manual transfer runs.
     */
    export interface Schema$StartManualTransferRunsRequest {
        /**
         * A run_time timestamp for historical data files or reports that are scheduled to be transferred by the scheduled transfer run. requested_run_time must be a past time and cannot include future time values.
         */
        requestedRunTime?: string | null;
        /**
         * A time_range start and end timestamp for historical data files or reports that are scheduled to be transferred by the scheduled transfer run. requested_time_range must be a past time and cannot include future time values.
         */
        requestedTimeRange?: Schema$TimeRange;
    }
    /**
     * A response to start manual transfer runs.
     */
    export interface Schema$StartManualTransferRunsResponse {
        /**
         * The transfer runs that were created.
         */
        runs?: Schema$TransferRun[];
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$Status {
        /**
         * The status code, which should be an enum value of google.rpc.Code.
         */
        code?: number | null;
        /**
         * A list of messages that carry the error details. There is a common set of message types for APIs to use.
         */
        details?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
         */
        message?: string | null;
    }
    /**
     * Options customizing the time based transfer schedule. Options are migrated from the original ScheduleOptions message.
     */
    export interface Schema$TimeBasedSchedule {
        /**
         * Defines time to stop scheduling transfer runs. A transfer run cannot be scheduled at or after the end time. The end time can be changed at any moment.
         */
        endTime?: string | null;
        /**
         * Data transfer schedule. If the data source does not support a custom schedule, this should be empty. If it is empty, the default value for the data source will be used. The specified times are in UTC. Examples of valid format: `1st,3rd monday of month 15:30`, `every wed,fri of jan,jun 13:15`, and `first sunday of quarter 00:00`. See more explanation about the format here: https://cloud.google.com/appengine/docs/flexible/python/scheduling-jobs-with-cron-yaml#the_schedule_format NOTE: The minimum interval time between recurring transfers depends on the data source; refer to the documentation for your data source.
         */
        schedule?: string | null;
        /**
         * Specifies time to start scheduling transfer runs. The first run will be scheduled at or after the start time according to a recurrence pattern defined in the schedule string. The start time can be changed at any moment.
         */
        startTime?: string | null;
    }
    /**
     * A specification for a time range, this will request transfer runs with run_time between start_time (inclusive) and end_time (exclusive).
     */
    export interface Schema$TimeRange {
        /**
         * End time of the range of transfer runs. For example, `"2017-05-30T00:00:00+00:00"`. The end_time must not be in the future. Creates transfer runs where run_time is in the range between start_time (inclusive) and end_time (exclusive).
         */
        endTime?: string | null;
        /**
         * Start time of the range of transfer runs. For example, `"2017-05-25T00:00:00+00:00"`. The start_time must be strictly less than the end_time. Creates transfer runs where run_time is in the range between start_time (inclusive) and end_time (exclusive).
         */
        startTime?: string | null;
    }
    /**
     * Represents a data transfer configuration. A transfer configuration contains all metadata needed to perform a data transfer. For example, `destination_dataset_id` specifies where data should be stored. When a new transfer configuration is created, the specified `destination_dataset_id` is created when needed and shared with the appropriate data source service account.
     */
    export interface Schema$TransferConfig {
        /**
         * The number of days to look back to automatically refresh the data. For example, if `data_refresh_window_days = 10`, then every day BigQuery reingests data for [today-10, today-1], rather than ingesting data for just [today-1]. Only valid if the data source supports the feature. Set the value to 0 to use the default value.
         */
        dataRefreshWindowDays?: number | null;
        /**
         * Output only. Region in which BigQuery dataset is located.
         */
        datasetRegion?: string | null;
        /**
         * Data source ID. This cannot be changed once data transfer is created. The full list of available data source IDs can be returned through an API call: https://cloud.google.com/bigquery-transfer/docs/reference/datatransfer/rest/v1/projects.locations.dataSources/list
         */
        dataSourceId?: string | null;
        /**
         * The BigQuery target dataset id.
         */
        destinationDatasetId?: string | null;
        /**
         * Is this config disabled. When set to true, no runs will be scheduled for this transfer config.
         */
        disabled?: boolean | null;
        /**
         * User specified display name for the data transfer.
         */
        displayName?: string | null;
        /**
         * Email notifications will be sent according to these preferences to the email address of the user who owns this transfer config.
         */
        emailPreferences?: Schema$EmailPreferences;
        /**
         * The encryption configuration part. Currently, it is only used for the optional KMS key name. The BigQuery service account of your project must be granted permissions to use the key. Read methods will return the key name applied in effect. Write methods will apply the key if it is present, or otherwise try to apply project default keys if it is absent.
         */
        encryptionConfiguration?: Schema$EncryptionConfiguration;
        /**
         * Output only. Error code with detailed information about reason of the latest config failure.
         */
        error?: Schema$Status;
        /**
         * Identifier. The resource name of the transfer config. Transfer config names have the form either `projects/{project_id\}/locations/{region\}/transferConfigs/{config_id\}` or `projects/{project_id\}/transferConfigs/{config_id\}`, where `config_id` is usually a UUID, even though it is not guaranteed or required. The name is ignored when creating a transfer config.
         */
        name?: string | null;
        /**
         * Output only. Next time when data transfer will run.
         */
        nextRunTime?: string | null;
        /**
         * Pub/Sub topic where notifications will be sent after transfer runs associated with this transfer config finish. The format for specifying a pubsub topic is: `projects/{project_id\}/topics/{topic_id\}`
         */
        notificationPubsubTopic?: string | null;
        /**
         * Output only. Information about the user whose credentials are used to transfer data. Populated only for `transferConfigs.get` requests. In case the user information is not available, this field will not be populated.
         */
        ownerInfo?: Schema$UserInfo;
        /**
         * Parameters specific to each data source. For more information see the bq tab in the 'Setting up a data transfer' section for each data source. For example the parameters for Cloud Storage transfers are listed here: https://cloud.google.com/bigquery-transfer/docs/cloud-storage-transfer#bq
         */
        params?: {
            [key: string]: any;
        } | null;
        /**
         * Data transfer schedule. If the data source does not support a custom schedule, this should be empty. If it is empty, the default value for the data source will be used. The specified times are in UTC. Examples of valid format: `1st,3rd monday of month 15:30`, `every wed,fri of jan,jun 13:15`, and `first sunday of quarter 00:00`. See more explanation about the format here: https://cloud.google.com/appengine/docs/flexible/python/scheduling-jobs-with-cron-yaml#the_schedule_format NOTE: The minimum interval time between recurring transfers depends on the data source; refer to the documentation for your data source.
         */
        schedule?: string | null;
        /**
         * Options customizing the data transfer schedule.
         */
        scheduleOptions?: Schema$ScheduleOptions;
        /**
         * Options customizing different types of data transfer schedule. This field replaces "schedule" and "schedule_options" fields. ScheduleOptionsV2 cannot be used together with ScheduleOptions/Schedule.
         */
        scheduleOptionsV2?: Schema$ScheduleOptionsV2;
        /**
         * Output only. State of the most recently updated transfer run.
         */
        state?: string | null;
        /**
         * Output only. Data transfer modification time. Ignored by server on input.
         */
        updateTime?: string | null;
        /**
         * Deprecated. Unique ID of the user on whose behalf transfer is done.
         */
        userId?: string | null;
    }
    /**
     * Represents a user facing message for a particular data transfer run.
     */
    export interface Schema$TransferMessage {
        /**
         * Message text.
         */
        messageText?: string | null;
        /**
         * Time when message was logged.
         */
        messageTime?: string | null;
        /**
         * Message severity.
         */
        severity?: string | null;
    }
    /**
     * Represents a data transfer run.
     */
    export interface Schema$TransferRun {
        /**
         * Output only. Data source id.
         */
        dataSourceId?: string | null;
        /**
         * Output only. The BigQuery target dataset id.
         */
        destinationDatasetId?: string | null;
        /**
         * Output only. Email notifications will be sent according to these preferences to the email address of the user who owns the transfer config this run was derived from.
         */
        emailPreferences?: Schema$EmailPreferences;
        /**
         * Output only. Time when transfer run ended. Parameter ignored by server for input requests.
         */
        endTime?: string | null;
        /**
         * Status of the transfer run.
         */
        errorStatus?: Schema$Status;
        /**
         * Identifier. The resource name of the transfer run. Transfer run names have the form `projects/{project_id\}/locations/{location\}/transferConfigs/{config_id\}/runs/{run_id\}`. The name is ignored when creating a transfer run.
         */
        name?: string | null;
        /**
         * Output only. Pub/Sub topic where a notification will be sent after this transfer run finishes. The format for specifying a pubsub topic is: `projects/{project_id\}/topics/{topic_id\}`
         */
        notificationPubsubTopic?: string | null;
        /**
         * Output only. Parameters specific to each data source. For more information see the bq tab in the 'Setting up a data transfer' section for each data source. For example the parameters for Cloud Storage transfers are listed here: https://cloud.google.com/bigquery-transfer/docs/cloud-storage-transfer#bq
         */
        params?: {
            [key: string]: any;
        } | null;
        /**
         * For batch transfer runs, specifies the date and time of the data should be ingested.
         */
        runTime?: string | null;
        /**
         * Output only. Describes the schedule of this transfer run if it was created as part of a regular schedule. For batch transfer runs that are scheduled manually, this is empty. NOTE: the system might choose to delay the schedule depending on the current load, so `schedule_time` doesn't always match this.
         */
        schedule?: string | null;
        /**
         * Minimum time after which a transfer run can be started.
         */
        scheduleTime?: string | null;
        /**
         * Output only. Time when transfer run was started. Parameter ignored by server for input requests.
         */
        startTime?: string | null;
        /**
         * Data transfer run state. Ignored for input requests.
         */
        state?: string | null;
        /**
         * Output only. Last time the data transfer run state was updated.
         */
        updateTime?: string | null;
        /**
         * Deprecated. Unique ID of the user on whose behalf transfer is done.
         */
        userId?: string | null;
    }
    /**
     * A request to unenroll a set of data sources so they are no longer visible in the BigQuery UI's `Transfer` tab.
     */
    export interface Schema$UnenrollDataSourcesRequest {
        /**
         * Data sources that are unenrolled. It is required to provide at least one data source id.
         */
        dataSourceIds?: string[] | null;
    }
    /**
     * Information about a user.
     */
    export interface Schema$UserInfo {
        /**
         * E-mail address of the user.
         */
        email?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        dataSources: Resource$Projects$Datasources;
        locations: Resource$Projects$Locations;
        transferConfigs: Resource$Projects$Transferconfigs;
        constructor(context: APIRequestContext);
        /**
         * Enroll data sources in a user project. This allows users to create transfer configurations for these data sources. They will also appear in the ListDataSources RPC and as such, will appear in the [BigQuery UI](https://console.cloud.google.com/bigquery), and the documents can be found in the public guide for [BigQuery Web UI](https://cloud.google.com/bigquery/bigquery-web-ui) and [Data Transfer Service](https://cloud.google.com/bigquery/docs/working-with-transfers).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enrollDataSources(params: Params$Resource$Projects$Enrolldatasources, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enrollDataSources(params?: Params$Resource$Projects$Enrolldatasources, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        enrollDataSources(params: Params$Resource$Projects$Enrolldatasources, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enrollDataSources(params: Params$Resource$Projects$Enrolldatasources, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        enrollDataSources(params: Params$Resource$Projects$Enrolldatasources, callback: BodyResponseCallback<Schema$Empty>): void;
        enrollDataSources(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Projects$Enrolldatasources extends StandardParameters {
        /**
         * Required. The name of the project resource in the form: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnrollDataSourcesRequest;
    }
    export class Resource$Projects$Datasources {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns true if valid credentials exist for the given data source and requesting user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkValidCreds(params: Params$Resource$Projects$Datasources$Checkvalidcreds, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkValidCreds(params?: Params$Resource$Projects$Datasources$Checkvalidcreds, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckValidCredsResponse>>;
        checkValidCreds(params: Params$Resource$Projects$Datasources$Checkvalidcreds, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkValidCreds(params: Params$Resource$Projects$Datasources$Checkvalidcreds, options: MethodOptions | BodyResponseCallback<Schema$CheckValidCredsResponse>, callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        checkValidCreds(params: Params$Resource$Projects$Datasources$Checkvalidcreds, callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        checkValidCreds(callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        /**
         * Retrieves a supported data source and returns its settings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Datasources$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Datasources$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DataSource>>;
        get(params: Params$Resource$Projects$Datasources$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Datasources$Get, options: MethodOptions | BodyResponseCallback<Schema$DataSource>, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(params: Params$Resource$Projects$Datasources$Get, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(callback: BodyResponseCallback<Schema$DataSource>): void;
        /**
         * Lists supported data sources and returns their settings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Datasources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Datasources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDataSourcesResponse>>;
        list(params: Params$Resource$Projects$Datasources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Datasources$List, options: MethodOptions | BodyResponseCallback<Schema$ListDataSourcesResponse>, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(params: Params$Resource$Projects$Datasources$List, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
    }
    export interface Params$Resource$Projects$Datasources$Checkvalidcreds extends StandardParameters {
        /**
         * Required. The name of the data source. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/dataSources/{data_source_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/dataSources/{data_source_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CheckValidCredsRequest;
    }
    export interface Params$Resource$Projects$Datasources$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/dataSources/{data_source_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/dataSources/{data_source_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Datasources$List extends StandardParameters {
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListDataSourcesRequest` list results. For multiple-page results, `ListDataSourcesResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. The BigQuery project id for which data sources should be returned. Must be in the form: `projects/{project_id\}` or `projects/{project_id\}/locations/{location_id\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        dataSources: Resource$Projects$Locations$Datasources;
        transferConfigs: Resource$Projects$Locations$Transferconfigs;
        constructor(context: APIRequestContext);
        /**
         * Enroll data sources in a user project. This allows users to create transfer configurations for these data sources. They will also appear in the ListDataSources RPC and as such, will appear in the [BigQuery UI](https://console.cloud.google.com/bigquery), and the documents can be found in the public guide for [BigQuery Web UI](https://cloud.google.com/bigquery/bigquery-web-ui) and [Data Transfer Service](https://cloud.google.com/bigquery/docs/working-with-transfers).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enrollDataSources(params: Params$Resource$Projects$Locations$Enrolldatasources, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enrollDataSources(params?: Params$Resource$Projects$Locations$Enrolldatasources, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        enrollDataSources(params: Params$Resource$Projects$Locations$Enrolldatasources, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enrollDataSources(params: Params$Resource$Projects$Locations$Enrolldatasources, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        enrollDataSources(params: Params$Resource$Projects$Locations$Enrolldatasources, callback: BodyResponseCallback<Schema$Empty>): void;
        enrollDataSources(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Projects$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        /**
         * Unenroll data sources in a user project. This allows users to remove transfer configurations for these data sources. They will no longer appear in the ListDataSources RPC and will also no longer appear in the [BigQuery UI](https://console.cloud.google.com/bigquery). Data transfers configurations of unenrolled data sources will not be scheduled.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unenrollDataSources(params: Params$Resource$Projects$Locations$Unenrolldatasources, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unenrollDataSources(params?: Params$Resource$Projects$Locations$Unenrolldatasources, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        unenrollDataSources(params: Params$Resource$Projects$Locations$Unenrolldatasources, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unenrollDataSources(params: Params$Resource$Projects$Locations$Unenrolldatasources, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        unenrollDataSources(params: Params$Resource$Projects$Locations$Unenrolldatasources, callback: BodyResponseCallback<Schema$Empty>): void;
        unenrollDataSources(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Projects$Locations$Enrolldatasources extends StandardParameters {
        /**
         * Required. The name of the project resource in the form: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnrollDataSourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * The resource that owns the locations collection, if applicable.
         */
        name?: string;
        /**
         * The maximum number of results to return. If not set, the service selects a default.
         */
        pageSize?: number;
        /**
         * A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Locations$Unenrolldatasources extends StandardParameters {
        /**
         * Required. The name of the project resource in the form: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UnenrollDataSourcesRequest;
    }
    export class Resource$Projects$Locations$Datasources {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns true if valid credentials exist for the given data source and requesting user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkValidCreds(params: Params$Resource$Projects$Locations$Datasources$Checkvalidcreds, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkValidCreds(params?: Params$Resource$Projects$Locations$Datasources$Checkvalidcreds, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckValidCredsResponse>>;
        checkValidCreds(params: Params$Resource$Projects$Locations$Datasources$Checkvalidcreds, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkValidCreds(params: Params$Resource$Projects$Locations$Datasources$Checkvalidcreds, options: MethodOptions | BodyResponseCallback<Schema$CheckValidCredsResponse>, callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        checkValidCreds(params: Params$Resource$Projects$Locations$Datasources$Checkvalidcreds, callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        checkValidCreds(callback: BodyResponseCallback<Schema$CheckValidCredsResponse>): void;
        /**
         * Retrieves a supported data source and returns its settings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasources$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasources$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DataSource>>;
        get(params: Params$Resource$Projects$Locations$Datasources$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasources$Get, options: MethodOptions | BodyResponseCallback<Schema$DataSource>, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(params: Params$Resource$Projects$Locations$Datasources$Get, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(callback: BodyResponseCallback<Schema$DataSource>): void;
        /**
         * Lists supported data sources and returns their settings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDataSourcesResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasources$List, options: MethodOptions | BodyResponseCallback<Schema$ListDataSourcesResponse>, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasources$List, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasources$Checkvalidcreds extends StandardParameters {
        /**
         * Required. The name of the data source. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/dataSources/{data_source_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/dataSources/{data_source_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CheckValidCredsRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasources$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/dataSources/{data_source_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/dataSources/{data_source_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasources$List extends StandardParameters {
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListDataSourcesRequest` list results. For multiple-page results, `ListDataSourcesResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. The BigQuery project id for which data sources should be returned. Must be in the form: `projects/{project_id\}` or `projects/{project_id\}/locations/{location_id\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Transferconfigs {
        context: APIRequestContext;
        runs: Resource$Projects$Locations$Transferconfigs$Runs;
        constructor(context: APIRequestContext);
        /**
         * Creates a new data transfer configuration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Transferconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Transferconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        create(params: Params$Resource$Projects$Locations$Transferconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Transferconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        create(params: Params$Resource$Projects$Locations$Transferconfigs$Create, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        create(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Deletes a data transfer configuration, including any associated transfer runs and logs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Transferconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about a data transfer config.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Transferconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Get, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        get(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Returns information about all transfer configs owned by a project in the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Transferconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Transferconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferConfigsResponse>>;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferConfigsResponse>, callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$List, callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        /**
         * Updates a data transfer configuration. All fields must be set, even if they are not updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Transferconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Transferconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        patch(params: Params$Resource$Projects$Locations$Transferconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Transferconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        patch(params: Params$Resource$Projects$Locations$Transferconfigs$Patch, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        patch(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Creates transfer runs for a time range [start_time, end_time]. For each date - or whatever granularity the data source supports - in the range, one transfer run is created. Note that runs are created per UTC time in the time range. DEPRECATED: use StartManualTransferRuns instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        scheduleRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        scheduleRuns(params?: Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ScheduleTransferRunsResponse>>;
        scheduleRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        scheduleRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns, options: MethodOptions | BodyResponseCallback<Schema$ScheduleTransferRunsResponse>, callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        scheduleRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns, callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        scheduleRuns(callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        /**
         * Manually initiates transfer runs. You can schedule these runs in two ways: 1. For a specific point in time using the 'requested_run_time' parameter. 2. For a period between 'start_time' (inclusive) and 'end_time' (exclusive). If scheduling a single run, it is set to execute immediately (schedule_time equals the current time). When scheduling multiple runs within a time range, the first run starts now, and subsequent runs are delayed by 15 seconds each.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startManualRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startManualRuns(params?: Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StartManualTransferRunsResponse>>;
        startManualRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startManualRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns, options: MethodOptions | BodyResponseCallback<Schema$StartManualTransferRunsResponse>, callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
        startManualRuns(params: Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns, callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
        startManualRuns(callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Create extends StandardParameters {
        /**
         * Deprecated: Authorization code was required when `transferConfig.dataSourceId` is 'youtube_channel' but it is no longer used in any data sources. Use `version_info` instead. Optional OAuth2 authorization code to use with this transfer configuration. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' and new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain authorization_code, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=authorization_code&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to create the transfer config.
         */
        authorizationCode?: string;
        /**
         * Required. The BigQuery project id where the transfer configuration should be created. Must be in the format projects/{project_id\}/locations/{location_id\} or projects/{project_id\}. If specified location and location of the destination bigquery dataset do not match - the request will fail.
         */
        parent?: string;
        /**
         * Optional service account email. If this field is set, the transfer config will be created with this service account's credentials. It requires that the requesting user calling this API has permissions to act as this service account. Note that not all data sources support service account credentials when creating a transfer config. For the latest list of data sources, read about [using service accounts](https://cloud.google.com/bigquery-transfer/docs/use-service-accounts).
         */
        serviceAccountName?: string;
        /**
         * Optional version info. This parameter replaces `authorization_code` which is no longer used in any data sources. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' *or* new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain version info, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=version_info&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to create the transfer config.
         */
        versionInfo?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TransferConfig;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Delete extends StandardParameters {
        /**
         * Required. The name of the resource to delete. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$List extends StandardParameters {
        /**
         * When specified, only configurations of requested data sources are returned.
         */
        dataSourceIds?: string[];
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransfersRequest` list results. For multiple-page results, `ListTransfersResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. The BigQuery project id for which transfer configs should be returned. If you are using the regionless method, the location must be `US` and `parent` should be in the following form: * `projects/{project_id\} If you are using the regionalized method, `parent` should be in the following form: * `projects/{project_id\}/locations/{location_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Patch extends StandardParameters {
        /**
         * Deprecated: Authorization code was required when `transferConfig.dataSourceId` is 'youtube_channel' but it is no longer used in any data sources. Use `version_info` instead. Optional OAuth2 authorization code to use with this transfer configuration. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' and new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain authorization_code, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=authorization_code&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to update the transfer config.
         */
        authorizationCode?: string;
        /**
         * Identifier. The resource name of the transfer config. Transfer config names have the form either `projects/{project_id\}/locations/{region\}/transferConfigs/{config_id\}` or `projects/{project_id\}/transferConfigs/{config_id\}`, where `config_id` is usually a UUID, even though it is not guaranteed or required. The name is ignored when creating a transfer config.
         */
        name?: string;
        /**
         * Optional service account email. If this field is set, the transfer config will be created with this service account's credentials. It requires that the requesting user calling this API has permissions to act as this service account. Note that not all data sources support service account credentials when creating a transfer config. For the latest list of data sources, read about [using service accounts](https://cloud.google.com/bigquery-transfer/docs/use-service-accounts).
         */
        serviceAccountName?: string;
        /**
         * Required. Required list of fields to be updated in this request.
         */
        updateMask?: string;
        /**
         * Optional version info. This parameter replaces `authorization_code` which is no longer used in any data sources. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' *or* new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain version info, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=version_info&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to update the transfer config.
         */
        versionInfo?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TransferConfig;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Scheduleruns extends StandardParameters {
        /**
         * Required. Transfer configuration name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ScheduleTransferRunsRequest;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Startmanualruns extends StandardParameters {
        /**
         * Required. Transfer configuration name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartManualTransferRunsRequest;
    }
    export class Resource$Projects$Locations$Transferconfigs$Runs {
        context: APIRequestContext;
        transferLogs: Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs;
        constructor(context: APIRequestContext);
        /**
         * Deletes the specified transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about the particular transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Transferconfigs$Runs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferRun>>;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Get, options: MethodOptions | BodyResponseCallback<Schema$TransferRun>, callback: BodyResponseCallback<Schema$TransferRun>): void;
        get(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Get, callback: BodyResponseCallback<Schema$TransferRun>): void;
        get(callback: BodyResponseCallback<Schema$TransferRun>): void;
        /**
         * Returns information about running and completed transfer runs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Transferconfigs$Runs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferRunsResponse>>;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferRunsResponse>, callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$List, callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Runs$Delete extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Runs$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Runs$List extends StandardParameters {
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransferRunsRequest` list results. For multiple-page results, `ListTransferRunsResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. Name of transfer configuration for which transfer runs should be retrieved. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Indicates how run attempts are to be pulled.
         */
        runAttempt?: string;
        /**
         * When specified, only transfer runs with requested states are returned.
         */
        states?: string[];
    }
    export class Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns log messages for the transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferLogsResponse>>;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferLogsResponse>, callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List, callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Transferconfigs$Runs$Transferlogs$List extends StandardParameters {
        /**
         * Message types to return. If not populated - INFO, WARNING and ERROR messages are returned.
         */
        messageTypes?: string[];
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransferLogsRequest` list results. For multiple-page results, `ListTransferLogsResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. Transfer run name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Transferconfigs {
        context: APIRequestContext;
        runs: Resource$Projects$Transferconfigs$Runs;
        constructor(context: APIRequestContext);
        /**
         * Creates a new data transfer configuration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Transferconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Transferconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        create(params: Params$Resource$Projects$Transferconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Transferconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        create(params: Params$Resource$Projects$Transferconfigs$Create, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        create(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Deletes a data transfer configuration, including any associated transfer runs and logs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Transferconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Transferconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Transferconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Transferconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Transferconfigs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about a data transfer config.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Transferconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Transferconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        get(params: Params$Resource$Projects$Transferconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Transferconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        get(params: Params$Resource$Projects$Transferconfigs$Get, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        get(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Returns information about all transfer configs owned by a project in the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Transferconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Transferconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferConfigsResponse>>;
        list(params: Params$Resource$Projects$Transferconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Transferconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferConfigsResponse>, callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        list(params: Params$Resource$Projects$Transferconfigs$List, callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferConfigsResponse>): void;
        /**
         * Updates a data transfer configuration. All fields must be set, even if they are not updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Transferconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Transferconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferConfig>>;
        patch(params: Params$Resource$Projects$Transferconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Transferconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$TransferConfig>, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        patch(params: Params$Resource$Projects$Transferconfigs$Patch, callback: BodyResponseCallback<Schema$TransferConfig>): void;
        patch(callback: BodyResponseCallback<Schema$TransferConfig>): void;
        /**
         * Creates transfer runs for a time range [start_time, end_time]. For each date - or whatever granularity the data source supports - in the range, one transfer run is created. Note that runs are created per UTC time in the time range. DEPRECATED: use StartManualTransferRuns instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        scheduleRuns(params: Params$Resource$Projects$Transferconfigs$Scheduleruns, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        scheduleRuns(params?: Params$Resource$Projects$Transferconfigs$Scheduleruns, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ScheduleTransferRunsResponse>>;
        scheduleRuns(params: Params$Resource$Projects$Transferconfigs$Scheduleruns, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        scheduleRuns(params: Params$Resource$Projects$Transferconfigs$Scheduleruns, options: MethodOptions | BodyResponseCallback<Schema$ScheduleTransferRunsResponse>, callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        scheduleRuns(params: Params$Resource$Projects$Transferconfigs$Scheduleruns, callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        scheduleRuns(callback: BodyResponseCallback<Schema$ScheduleTransferRunsResponse>): void;
        /**
         * Manually initiates transfer runs. You can schedule these runs in two ways: 1. For a specific point in time using the 'requested_run_time' parameter. 2. For a period between 'start_time' (inclusive) and 'end_time' (exclusive). If scheduling a single run, it is set to execute immediately (schedule_time equals the current time). When scheduling multiple runs within a time range, the first run starts now, and subsequent runs are delayed by 15 seconds each.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startManualRuns(params: Params$Resource$Projects$Transferconfigs$Startmanualruns, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startManualRuns(params?: Params$Resource$Projects$Transferconfigs$Startmanualruns, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StartManualTransferRunsResponse>>;
        startManualRuns(params: Params$Resource$Projects$Transferconfigs$Startmanualruns, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startManualRuns(params: Params$Resource$Projects$Transferconfigs$Startmanualruns, options: MethodOptions | BodyResponseCallback<Schema$StartManualTransferRunsResponse>, callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
        startManualRuns(params: Params$Resource$Projects$Transferconfigs$Startmanualruns, callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
        startManualRuns(callback: BodyResponseCallback<Schema$StartManualTransferRunsResponse>): void;
    }
    export interface Params$Resource$Projects$Transferconfigs$Create extends StandardParameters {
        /**
         * Deprecated: Authorization code was required when `transferConfig.dataSourceId` is 'youtube_channel' but it is no longer used in any data sources. Use `version_info` instead. Optional OAuth2 authorization code to use with this transfer configuration. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' and new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain authorization_code, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=authorization_code&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to create the transfer config.
         */
        authorizationCode?: string;
        /**
         * Required. The BigQuery project id where the transfer configuration should be created. Must be in the format projects/{project_id\}/locations/{location_id\} or projects/{project_id\}. If specified location and location of the destination bigquery dataset do not match - the request will fail.
         */
        parent?: string;
        /**
         * Optional service account email. If this field is set, the transfer config will be created with this service account's credentials. It requires that the requesting user calling this API has permissions to act as this service account. Note that not all data sources support service account credentials when creating a transfer config. For the latest list of data sources, read about [using service accounts](https://cloud.google.com/bigquery-transfer/docs/use-service-accounts).
         */
        serviceAccountName?: string;
        /**
         * Optional version info. This parameter replaces `authorization_code` which is no longer used in any data sources. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' *or* new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain version info, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=version_info&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to create the transfer config.
         */
        versionInfo?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TransferConfig;
    }
    export interface Params$Resource$Projects$Transferconfigs$Delete extends StandardParameters {
        /**
         * Required. The name of the resource to delete. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Transferconfigs$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Transferconfigs$List extends StandardParameters {
        /**
         * When specified, only configurations of requested data sources are returned.
         */
        dataSourceIds?: string[];
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransfersRequest` list results. For multiple-page results, `ListTransfersResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. The BigQuery project id for which transfer configs should be returned. If you are using the regionless method, the location must be `US` and `parent` should be in the following form: * `projects/{project_id\} If you are using the regionalized method, `parent` should be in the following form: * `projects/{project_id\}/locations/{location_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Transferconfigs$Patch extends StandardParameters {
        /**
         * Deprecated: Authorization code was required when `transferConfig.dataSourceId` is 'youtube_channel' but it is no longer used in any data sources. Use `version_info` instead. Optional OAuth2 authorization code to use with this transfer configuration. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' and new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain authorization_code, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=authorization_code&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to update the transfer config.
         */
        authorizationCode?: string;
        /**
         * Identifier. The resource name of the transfer config. Transfer config names have the form either `projects/{project_id\}/locations/{region\}/transferConfigs/{config_id\}` or `projects/{project_id\}/transferConfigs/{config_id\}`, where `config_id` is usually a UUID, even though it is not guaranteed or required. The name is ignored when creating a transfer config.
         */
        name?: string;
        /**
         * Optional service account email. If this field is set, the transfer config will be created with this service account's credentials. It requires that the requesting user calling this API has permissions to act as this service account. Note that not all data sources support service account credentials when creating a transfer config. For the latest list of data sources, read about [using service accounts](https://cloud.google.com/bigquery-transfer/docs/use-service-accounts).
         */
        serviceAccountName?: string;
        /**
         * Required. Required list of fields to be updated in this request.
         */
        updateMask?: string;
        /**
         * Optional version info. This parameter replaces `authorization_code` which is no longer used in any data sources. This is required only if `transferConfig.dataSourceId` is 'youtube_channel' *or* new credentials are needed, as indicated by `CheckValidCreds`. In order to obtain version info, make a request to the following URL: https://bigquery.cloud.google.com/datatransfer/oauthz/auth?redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=version_info&client_id=client_id&scope=data_source_scopes * The client_id is the OAuth client_id of the data source as returned by ListDataSources method. * data_source_scopes are the scopes returned by ListDataSources method. Note that this should not be set when `service_account_name` is used to update the transfer config.
         */
        versionInfo?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TransferConfig;
    }
    export interface Params$Resource$Projects$Transferconfigs$Scheduleruns extends StandardParameters {
        /**
         * Required. Transfer configuration name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ScheduleTransferRunsRequest;
    }
    export interface Params$Resource$Projects$Transferconfigs$Startmanualruns extends StandardParameters {
        /**
         * Required. Transfer configuration name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartManualTransferRunsRequest;
    }
    export class Resource$Projects$Transferconfigs$Runs {
        context: APIRequestContext;
        transferLogs: Resource$Projects$Transferconfigs$Runs$Transferlogs;
        constructor(context: APIRequestContext);
        /**
         * Deletes the specified transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Transferconfigs$Runs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Transferconfigs$Runs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Transferconfigs$Runs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Transferconfigs$Runs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Transferconfigs$Runs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about the particular transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Transferconfigs$Runs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Transferconfigs$Runs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TransferRun>>;
        get(params: Params$Resource$Projects$Transferconfigs$Runs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Transferconfigs$Runs$Get, options: MethodOptions | BodyResponseCallback<Schema$TransferRun>, callback: BodyResponseCallback<Schema$TransferRun>): void;
        get(params: Params$Resource$Projects$Transferconfigs$Runs$Get, callback: BodyResponseCallback<Schema$TransferRun>): void;
        get(callback: BodyResponseCallback<Schema$TransferRun>): void;
        /**
         * Returns information about running and completed transfer runs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Transferconfigs$Runs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Transferconfigs$Runs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferRunsResponse>>;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferRunsResponse>, callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$List, callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferRunsResponse>): void;
    }
    export interface Params$Resource$Projects$Transferconfigs$Runs$Delete extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Transferconfigs$Runs$Get extends StandardParameters {
        /**
         * Required. The name of the resource requested. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Transferconfigs$Runs$List extends StandardParameters {
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransferRunsRequest` list results. For multiple-page results, `ListTransferRunsResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. Name of transfer configuration for which transfer runs should be retrieved. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}`
         */
        parent?: string;
        /**
         * Indicates how run attempts are to be pulled.
         */
        runAttempt?: string;
        /**
         * When specified, only transfer runs with requested states are returned.
         */
        states?: string[];
    }
    export class Resource$Projects$Transferconfigs$Runs$Transferlogs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns log messages for the transfer run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTransferLogsResponse>>;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List, options: MethodOptions | BodyResponseCallback<Schema$ListTransferLogsResponse>, callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
        list(params: Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List, callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTransferLogsResponse>): void;
    }
    export interface Params$Resource$Projects$Transferconfigs$Runs$Transferlogs$List extends StandardParameters {
        /**
         * Message types to return. If not populated - INFO, WARNING and ERROR messages are returned.
         */
        messageTypes?: string[];
        /**
         * Page size. The default page size is the maximum value of 1000 results.
         */
        pageSize?: number;
        /**
         * Pagination token, which can be used to request a specific page of `ListTransferLogsRequest` list results. For multiple-page results, `ListTransferLogsResponse` outputs a `next_page` token, which can be used as the `page_token` value to request the next page of list results.
         */
        pageToken?: string;
        /**
         * Required. Transfer run name. If you are using the regionless method, the location must be `US` and the name should be in the following form: * `projects/{project_id\}/transferConfigs/{config_id\}/runs/{run_id\}` If you are using the regionalized method, the name should be in the following form: * `projects/{project_id\}/locations/{location_id\}/transferConfigs/{config_id\}/runs/{run_id\}`
         */
        parent?: string;
    }
    export {};
}
