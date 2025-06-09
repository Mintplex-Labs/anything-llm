import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudtrace_v1 {
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
     * Cloud Trace API
     *
     * Sends application trace data to Cloud Trace for viewing. Trace data is collected for all App Engine applications by default. Trace data from other applications can be provided using this API. This library is used to interact with the Cloud Trace API directly. If you are looking to instrument your application for Cloud Trace, we recommend using OpenTelemetry.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudtrace = google.cloudtrace('v1');
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
     * The response message for the `ListTraces` method.
     */
    export interface Schema$ListTracesResponse {
        /**
         * If defined, indicates that there are more traces that match the request and that this value should be passed to the next request to continue retrieving additional traces.
         */
        nextPageToken?: string | null;
        /**
         * List of trace records as specified by the view parameter.
         */
        traces?: Schema$Trace[];
    }
    /**
     * A trace describes how long it takes for an application to perform an operation. It consists of a set of spans, each of which represent a single timed event within the operation.
     */
    export interface Schema$Trace {
        /**
         * Project ID of the Cloud project where the trace data is stored.
         */
        projectId?: string | null;
        /**
         * Collection of spans in the trace.
         */
        spans?: Schema$TraceSpan[];
        /**
         * Globally unique identifier for the trace. This identifier is a 128-bit numeric value formatted as a 32-byte hex string. For example, `382d4f4c6b7bb2f4a972559d9085001d`. The numeric value should not be zero.
         */
        traceId?: string | null;
    }
    /**
     * List of new or updated traces.
     */
    export interface Schema$Traces {
        /**
         * List of traces.
         */
        traces?: Schema$Trace[];
    }
    /**
     * A span represents a single timed event within a trace. Spans can be nested and form a trace tree. Often, a trace contains a root span that describes the end-to-end latency of an operation and, optionally, one or more subspans for its suboperations. Spans do not need to be contiguous. There may be gaps between spans in a trace.
     */
    export interface Schema$TraceSpan {
        /**
         * End time of the span in seconds and nanoseconds from the UNIX epoch.
         */
        endTime?: string | null;
        /**
         * Distinguishes between spans generated in a particular context. For example, two spans with the same name may be distinguished using `RPC_CLIENT` and `RPC_SERVER` to identify queueing latency associated with the span.
         */
        kind?: string | null;
        /**
         * Collection of labels associated with the span. Label keys must be less than 128 bytes. Label values must be less than 16 KiB. Some keys might have predefined meaning, and you can also create your own. For more information, see [Cloud Trace labels](https://cloud.google.com/trace/docs/trace-labels).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Name of the span. Must be less than 128 bytes. The span name is sanitized and displayed in the Trace tool in the Google Cloud Platform Console. The name may be a method name or some other per-call site name. For the same executable and the same call point, a best practice is to use a consistent name, which makes it easier to correlate cross-trace spans.
         */
        name?: string | null;
        /**
         * Optional. ID of the parent span, if any.
         */
        parentSpanId?: string | null;
        /**
         * Identifier for the span. Must be a 64-bit integer other than 0 and unique within a trace. For example, `2205310701640571284`.
         */
        spanId?: string | null;
        /**
         * Start time of the span in seconds and nanoseconds from the UNIX epoch.
         */
        startTime?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        traces: Resource$Projects$Traces;
        constructor(context: APIRequestContext);
        /**
         * Sends trace spans to Cloud Trace. Spans cannot be updated. If the trace ID and span ID already exist, an additional copy of the span will be stored.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patchTraces(params: Params$Resource$Projects$Patchtraces, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patchTraces(params?: Params$Resource$Projects$Patchtraces, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        patchTraces(params: Params$Resource$Projects$Patchtraces, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patchTraces(params: Params$Resource$Projects$Patchtraces, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        patchTraces(params: Params$Resource$Projects$Patchtraces, callback: BodyResponseCallback<Schema$Empty>): void;
        patchTraces(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Projects$Patchtraces extends StandardParameters {
        /**
         * Required. ID of the Cloud project where the trace data is stored.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Traces;
    }
    export class Resource$Projects$Traces {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a single trace by its ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Traces$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Traces$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Trace>>;
        get(params: Params$Resource$Projects$Traces$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Traces$Get, options: MethodOptions | BodyResponseCallback<Schema$Trace>, callback: BodyResponseCallback<Schema$Trace>): void;
        get(params: Params$Resource$Projects$Traces$Get, callback: BodyResponseCallback<Schema$Trace>): void;
        get(callback: BodyResponseCallback<Schema$Trace>): void;
        /**
         * Returns a list of traces that match the specified filter conditions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Traces$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Traces$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTracesResponse>>;
        list(params: Params$Resource$Projects$Traces$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Traces$List, options: MethodOptions | BodyResponseCallback<Schema$ListTracesResponse>, callback: BodyResponseCallback<Schema$ListTracesResponse>): void;
        list(params: Params$Resource$Projects$Traces$List, callback: BodyResponseCallback<Schema$ListTracesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTracesResponse>): void;
    }
    export interface Params$Resource$Projects$Traces$Get extends StandardParameters {
        /**
         * Required. ID of the Cloud project where the trace data is stored.
         */
        projectId?: string;
        /**
         * Required. ID of the trace to return.
         */
        traceId?: string;
    }
    export interface Params$Resource$Projects$Traces$List extends StandardParameters {
        /**
         * End of the time interval (inclusive) during which the trace data was collected from the application.
         */
        endTime?: string;
        /**
         * Optional. A filter against labels for the request. By default, searches use prefix matching. To specify exact match, prepend a plus symbol (`+`) to the search term. Multiple terms are ANDed. Syntax: * `root:NAME_PREFIX` or `NAME_PREFIX`: Return traces where any root span starts with `NAME_PREFIX`. * `+root:NAME` or `+NAME`: Return traces where any root span's name is exactly `NAME`. * `span:NAME_PREFIX`: Return traces where any span starts with `NAME_PREFIX`. * `+span:NAME`: Return traces where any span's name is exactly `NAME`. * `latency:DURATION`: Return traces whose overall latency is greater or equal to than `DURATION`. Accepted units are nanoseconds (`ns`), milliseconds (`ms`), and seconds (`s`). Default is `ms`. For example, `latency:24ms` returns traces whose overall latency is greater than or equal to 24 milliseconds. * `label:LABEL_KEY`: Return all traces containing the specified label key (exact match, case-sensitive) regardless of the key:value pair's value (including empty values). * `LABEL_KEY:VALUE_PREFIX`: Return all traces containing the specified label key (exact match, case-sensitive) whose value starts with `VALUE_PREFIX`. Both a key and a value must be specified. * `+LABEL_KEY:VALUE`: Return all traces containing a key:value pair exactly matching the specified text. Both a key and a value must be specified. * `method:VALUE`: Equivalent to `/http/method:VALUE`. * `url:VALUE`: Equivalent to `/http/url:VALUE`.
         */
        filter?: string;
        /**
         * Optional. Field used to sort the returned traces. Can be one of the following: * `trace_id` * `name` (`name` field of root span in the trace) * `duration` (difference between `end_time` and `start_time` fields of the root span) * `start` (`start_time` field of the root span) Descending order can be specified by appending `desc` to the sort field (for example, `name desc`). Only one sort field is permitted.
         */
        orderBy?: string;
        /**
         * Optional. Maximum number of traces to return. If not specified or <= 0, the implementation selects a reasonable value. The implementation may return fewer traces than the requested page size.
         */
        pageSize?: number;
        /**
         * Token identifying the page of results to return. If provided, use the value of the `next_page_token` field from a previous request.
         */
        pageToken?: string;
        /**
         * Required. ID of the Cloud project where the trace data is stored.
         */
        projectId?: string;
        /**
         * Start of the time interval (inclusive) during which the trace data was collected from the application.
         */
        startTime?: string;
        /**
         * Optional. Type of data returned for traces in the list. Default is `MINIMAL`.
         */
        view?: string;
    }
    export {};
}
