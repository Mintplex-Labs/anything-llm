import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudtrace_v2beta1 {
    export interface Options extends GlobalOptions {
        version: 'v2beta1';
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
     * Cloud Trace API
     *
     * Sends application trace data to Cloud Trace for viewing. Trace data is collected for all App Engine applications by default. Trace data from other applications can be provided using this API. This library is used to interact with the Cloud Trace API directly. If you are looking to instrument your application for Cloud Trace, we recommend using OpenTelemetry.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudtrace = google.cloudtrace('v2beta1');
     * ```
     */
    export class Cloudtrace {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Result returned from `ListTraceSinks`.
     */
    export interface Schema$ListTraceSinksResponse {
        /**
         * A paginated response where more pages might be available has `next_page_token` set. To get the next set of results, call the same method again using the value of `next_page_token` as `page_token`.
         */
        nextPageToken?: string | null;
        /**
         * A list of sinks.
         */
        sinks?: Schema$TraceSink[];
    }
    /**
     * OutputConfig contains a destination for writing trace data.
     */
    export interface Schema$OutputConfig {
        /**
         * Required. The destination for writing trace data. Supported formats include: "bigquery.googleapis.com/projects/[PROJECT_ID]/datasets/[DATASET]"
         */
        destination?: string | null;
    }
    /**
     * Describes a sink used to export traces to a BigQuery dataset. The sink must be created within a project.
     */
    export interface Schema$TraceSink {
        /**
         * Identifier. The canonical sink resource name, unique within the project. Must be of the form: projects/[PROJECT_NUMBER]/traceSinks/[SINK_ID]. E.g.: `"projects/12345/traceSinks/my-project-trace-sink"`. Sink identifiers are limited to 256 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, and periods.
         */
        name?: string | null;
        /**
         * Required. The export destination.
         */
        outputConfig?: Schema$OutputConfig;
        /**
         * Output only. A service account name for exporting the data. This field is set by sinks.create and sinks.update. The service account will need to be granted write access to the destination specified in the output configuration, see [Granting access for a resource](/iam/docs/granting-roles-to-service-accounts#granting_access_to_a_service_account_for_a_resource). To create tables and to write data, this account needs the `dataEditor` role. Read more about roles in the [BigQuery documentation](https://cloud.google.com/bigquery/docs/access-control). E.g.: "service-00000001@00000002.iam.gserviceaccount.com"
         */
        writerIdentity?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        traceSinks: Resource$Projects$Tracesinks;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Tracesinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports trace spans to a destination. The export of newly-ingested traces begins immediately, unless the sink's `writer_identity` is not permitted to write to the destination. A sink can export traces only from the resource owning the sink (the 'parent').
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Tracesinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Tracesinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TraceSink>>;
        create(params: Params$Resource$Projects$Tracesinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Tracesinks$Create, options: MethodOptions | BodyResponseCallback<Schema$TraceSink>, callback: BodyResponseCallback<Schema$TraceSink>): void;
        create(params: Params$Resource$Projects$Tracesinks$Create, callback: BodyResponseCallback<Schema$TraceSink>): void;
        create(callback: BodyResponseCallback<Schema$TraceSink>): void;
        /**
         * Deletes a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Tracesinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Tracesinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Tracesinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Tracesinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Tracesinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get a trace sink by name under the parent resource (GCP project).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Tracesinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Tracesinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TraceSink>>;
        get(params: Params$Resource$Projects$Tracesinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Tracesinks$Get, options: MethodOptions | BodyResponseCallback<Schema$TraceSink>, callback: BodyResponseCallback<Schema$TraceSink>): void;
        get(params: Params$Resource$Projects$Tracesinks$Get, callback: BodyResponseCallback<Schema$TraceSink>): void;
        get(callback: BodyResponseCallback<Schema$TraceSink>): void;
        /**
         * List all sinks for the parent resource (GCP project).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Tracesinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Tracesinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTraceSinksResponse>>;
        list(params: Params$Resource$Projects$Tracesinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Tracesinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListTraceSinksResponse>, callback: BodyResponseCallback<Schema$ListTraceSinksResponse>): void;
        list(params: Params$Resource$Projects$Tracesinks$List, callback: BodyResponseCallback<Schema$ListTraceSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTraceSinksResponse>): void;
        /**
         * Updates a sink. This method updates fields in the existing sink according to the provided update mask. The sink's name cannot be changed nor any output-only fields (e.g. the writer_identity).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Tracesinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Tracesinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TraceSink>>;
        patch(params: Params$Resource$Projects$Tracesinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Tracesinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$TraceSink>, callback: BodyResponseCallback<Schema$TraceSink>): void;
        patch(params: Params$Resource$Projects$Tracesinks$Patch, callback: BodyResponseCallback<Schema$TraceSink>): void;
        patch(callback: BodyResponseCallback<Schema$TraceSink>): void;
    }
    export interface Params$Resource$Projects$Tracesinks$Create extends StandardParameters {
        /**
         * Required. The resource in which to create the sink (currently only project sinks are supported): "projects/[PROJECT_ID]" Examples: `"projects/my-trace-project"`, `"projects/123456789"`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TraceSink;
    }
    export interface Params$Resource$Projects$Tracesinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_NUMBER]/traceSinks/[SINK_ID]" Example: `"projects/12345/traceSinks/my-sink-id"`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Tracesinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_NUMBER]/traceSinks/[SINK_ID]" Example: `"projects/12345/traceSinks/my-sink-id"`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Tracesinks$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of `next_page_token` in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. `page_token` must be the value of `next_page_token` from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed (currently only project parent resources are supported): "projects/[PROJECT_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Tracesinks$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_NUMBER]/traceSinks/[SINK_ID]" Example: `"projects/12345/traceSinks/my-sink-id"`.
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in `trace_sink` that are to be updated. A sink field is overwritten if, and only if, it is in the update mask. `name` and `writer_identity` fields cannot be updated. An empty `update_mask` is considered an error. For a detailed `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask Example: `updateMask=output_config`.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TraceSink;
    }
    export {};
}
