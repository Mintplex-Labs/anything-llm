import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudtrace_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
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
     * const cloudtrace = google.cloudtrace('v2');
     * ```
     */
    export class Cloudtrace {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Text annotation with a set of attributes.
     */
    export interface Schema$Annotation {
        /**
         * A set of attributes on the annotation. You can have up to 4 attributes per Annotation.
         */
        attributes?: Schema$Attributes;
        /**
         * A user-supplied message describing the event. The maximum length for the description is 256 bytes.
         */
        description?: Schema$TruncatableString;
    }
    /**
     * A set of attributes as key-value pairs.
     */
    export interface Schema$Attributes {
        /**
         * A set of attributes. Each attribute's key can be up to 128 bytes long. The value can be a string up to 256 bytes, a signed 64-bit integer, or the boolean values `true` or `false`. For example: "/instance_id": { "string_value": { "value": "my-instance" \} \} "/http/request_bytes": { "int_value": 300 \} "example.com/myattribute": { "bool_value": false \}
         */
        attributeMap?: {
            [key: string]: Schema$AttributeValue;
        } | null;
        /**
         * The number of attributes that were discarded. Attributes can be discarded because their keys are too long or because there are too many attributes. If this value is 0 then all attributes are valid.
         */
        droppedAttributesCount?: number | null;
    }
    /**
     * The allowed types for `[VALUE]` in a `[KEY]:[VALUE]` attribute.
     */
    export interface Schema$AttributeValue {
        /**
         * A Boolean value represented by `true` or `false`.
         */
        boolValue?: boolean | null;
        /**
         * A 64-bit signed integer.
         */
        intValue?: string | null;
        /**
         * A string up to 256 bytes long.
         */
        stringValue?: Schema$TruncatableString;
    }
    /**
     * The request message for the `BatchWriteSpans` method.
     */
    export interface Schema$BatchWriteSpansRequest {
        /**
         * Required. A list of new spans. The span names must not match existing spans, otherwise the results are undefined.
         */
        spans?: Schema$Span[];
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * A pointer from the current span to another span in the same trace or in a different trace. For example, this can be used in batching operations, where a single batch handler processes multiple requests from different traces or when the handler receives a request from a different project.
     */
    export interface Schema$Link {
        /**
         * A set of attributes on the link. Up to 32 attributes can be specified per link.
         */
        attributes?: Schema$Attributes;
        /**
         * The `[SPAN_ID]` for a span within a trace.
         */
        spanId?: string | null;
        /**
         * The `[TRACE_ID]` for a trace within a project.
         */
        traceId?: string | null;
        /**
         * The relationship of the current span relative to the linked span.
         */
        type?: string | null;
    }
    /**
     * A collection of links, which are references from this span to a span in the same or different trace.
     */
    export interface Schema$Links {
        /**
         * The number of dropped links after the maximum size was enforced. If this value is 0, then no links were dropped.
         */
        droppedLinksCount?: number | null;
        /**
         * A collection of links.
         */
        link?: Schema$Link[];
    }
    /**
     * An event describing a message sent/received between Spans.
     */
    export interface Schema$MessageEvent {
        /**
         * The number of compressed bytes sent or received. If missing, the compressed size is assumed to be the same size as the uncompressed size.
         */
        compressedSizeBytes?: string | null;
        /**
         * An identifier for the MessageEvent's message that can be used to match `SENT` and `RECEIVED` MessageEvents.
         */
        id?: string | null;
        /**
         * Type of MessageEvent. Indicates whether the message was sent or received.
         */
        type?: string | null;
        /**
         * The number of uncompressed bytes sent or received.
         */
        uncompressedSizeBytes?: string | null;
    }
    /**
     * Binary module.
     */
    export interface Schema$Module {
        /**
         * A unique identifier for the module, usually a hash of its contents (up to 128 bytes).
         */
        buildId?: Schema$TruncatableString;
        /**
         * For example: main binary, kernel modules, and dynamic libraries such as libc.so, sharedlib.so (up to 256 bytes).
         */
        module?: Schema$TruncatableString;
    }
    /**
     * A span represents a single operation within a trace. Spans can be nested to form a trace tree. Often, a trace contains a root span that describes the end-to-end latency, and one or more subspans for its sub-operations. A trace can also contain multiple root spans, or none at all. Spans do not need to be contiguous. There might be gaps or overlaps between spans in a trace.
     */
    export interface Schema$Span {
        /**
         * A set of attributes on the span. You can have up to 32 attributes per span.
         */
        attributes?: Schema$Attributes;
        /**
         * Optional. The number of child spans that were generated while this span was active. If set, allows implementation to detect missing child spans.
         */
        childSpanCount?: number | null;
        /**
         * Required. A description of the span's operation (up to 128 bytes). Cloud Trace displays the description in the Cloud console. For example, the display name can be a qualified method name or a file name and a line number where the operation is called. A best practice is to use the same display name within an application and at the same call point. This makes it easier to correlate spans in different traces.
         */
        displayName?: Schema$TruncatableString;
        /**
         * Required. The end time of the span. On the client side, this is the time kept by the local machine where the span execution ends. On the server side, this is the time when the server application handler stops running.
         */
        endTime?: string | null;
        /**
         * Links associated with the span. You can have up to 128 links per Span.
         */
        links?: Schema$Links;
        /**
         * Required. The resource name of the span in the following format: * `projects/[PROJECT_ID]/traces/[TRACE_ID]/spans/[SPAN_ID]` `[TRACE_ID]` is a unique identifier for a trace within a project; it is a 32-character hexadecimal encoding of a 16-byte array. It should not be zero. `[SPAN_ID]` is a unique identifier for a span within a trace; it is a 16-character hexadecimal encoding of an 8-byte array. It should not be zero. .
         */
        name?: string | null;
        /**
         * The `[SPAN_ID]` of this span's parent span. If this is a root span, then this field must be empty.
         */
        parentSpanId?: string | null;
        /**
         * Optional. Set this parameter to indicate whether this span is in the same process as its parent. If you do not set this parameter, Trace is unable to take advantage of this helpful information.
         */
        sameProcessAsParentSpan?: boolean | null;
        /**
         * Required. The `[SPAN_ID]` portion of the span's resource name.
         */
        spanId?: string | null;
        /**
         * Optional. Distinguishes between spans generated in a particular context. For example, two spans with the same name may be distinguished using `CLIENT` (caller) and `SERVER` (callee) to identify an RPC call.
         */
        spanKind?: string | null;
        /**
         * Stack trace captured at the start of the span.
         */
        stackTrace?: Schema$StackTrace;
        /**
         * Required. The start time of the span. On the client side, this is the time kept by the local machine where the span execution starts. On the server side, this is the time when the server's application handler starts running.
         */
        startTime?: string | null;
        /**
         * Optional. The final status for this span.
         */
        status?: Schema$Status;
        /**
         * A set of time events. You can have up to 32 annotations and 128 message events per span.
         */
        timeEvents?: Schema$TimeEvents;
    }
    /**
     * Represents a single stack frame in a stack trace.
     */
    export interface Schema$StackFrame {
        /**
         * The column number where the function call appears, if available. This is important in JavaScript because of its anonymous functions.
         */
        columnNumber?: string | null;
        /**
         * The name of the source file where the function call appears (up to 256 bytes).
         */
        fileName?: Schema$TruncatableString;
        /**
         * The fully-qualified name that uniquely identifies the function or method that is active in this frame (up to 1024 bytes).
         */
        functionName?: Schema$TruncatableString;
        /**
         * The line number in `file_name` where the function call appears.
         */
        lineNumber?: string | null;
        /**
         * The binary module from where the code was loaded.
         */
        loadModule?: Schema$Module;
        /**
         * An un-mangled function name, if `function_name` is mangled. To get information about name mangling, run [this search](https://www.google.com/search?q=cxx+name+mangling). The name can be fully-qualified (up to 1024 bytes).
         */
        originalFunctionName?: Schema$TruncatableString;
        /**
         * The version of the deployed source code (up to 128 bytes).
         */
        sourceVersion?: Schema$TruncatableString;
    }
    /**
     * A collection of stack frames, which can be truncated.
     */
    export interface Schema$StackFrames {
        /**
         * The number of stack frames that were dropped because there were too many stack frames. If this value is 0, then no stack frames were dropped.
         */
        droppedFramesCount?: number | null;
        /**
         * Stack frames in this call stack.
         */
        frame?: Schema$StackFrame[];
    }
    /**
     * A call stack appearing in a trace.
     */
    export interface Schema$StackTrace {
        /**
         * Stack frames in this stack trace. A maximum of 128 frames are allowed.
         */
        stackFrames?: Schema$StackFrames;
        /**
         * The hash ID is used to conserve network bandwidth for duplicate stack traces within a single trace. Often multiple spans will have identical stack traces. The first occurrence of a stack trace should contain both the `stackFrame` content and a value in `stackTraceHashId`. Subsequent spans within the same request can refer to that stack trace by only setting `stackTraceHashId`.
         */
        stackTraceHashId?: string | null;
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
     * A time-stamped annotation or message event in the Span.
     */
    export interface Schema$TimeEvent {
        /**
         * Text annotation with a set of attributes.
         */
        annotation?: Schema$Annotation;
        /**
         * An event describing a message sent/received between Spans.
         */
        messageEvent?: Schema$MessageEvent;
        /**
         * The timestamp indicating the time the event occurred.
         */
        time?: string | null;
    }
    /**
     * A collection of `TimeEvent`s. A `TimeEvent` is a time-stamped annotation on the span, consisting of either user-supplied key:value pairs, or details of a message sent/received between Spans.
     */
    export interface Schema$TimeEvents {
        /**
         * The number of dropped annotations in all the included time events. If the value is 0, then no annotations were dropped.
         */
        droppedAnnotationsCount?: number | null;
        /**
         * The number of dropped message events in all the included time events. If the value is 0, then no message events were dropped.
         */
        droppedMessageEventsCount?: number | null;
        /**
         * A collection of `TimeEvent`s.
         */
        timeEvent?: Schema$TimeEvent[];
    }
    /**
     * Represents a string that might be shortened to a specified length.
     */
    export interface Schema$TruncatableString {
        /**
         * The number of bytes removed from the original string. If this value is 0, then the string was not shortened.
         */
        truncatedByteCount?: number | null;
        /**
         * The shortened string. For example, if the original string is 500 bytes long and the limit of the string is 128 bytes, then `value` contains the first 128 bytes of the 500-byte string. Truncation always happens on a UTF8 character boundary. If there are multi-byte characters in the string, then the length of the shortened string might be less than the size limit.
         */
        value?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        traces: Resource$Projects$Traces;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Traces {
        context: APIRequestContext;
        spans: Resource$Projects$Traces$Spans;
        constructor(context: APIRequestContext);
        /**
         * Batch writes new spans to new or existing traces. You cannot update existing spans. If a span ID already exists, an additional copy of the span will be stored.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchWrite(params: Params$Resource$Projects$Traces$Batchwrite, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchWrite(params?: Params$Resource$Projects$Traces$Batchwrite, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        batchWrite(params: Params$Resource$Projects$Traces$Batchwrite, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchWrite(params: Params$Resource$Projects$Traces$Batchwrite, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        batchWrite(params: Params$Resource$Projects$Traces$Batchwrite, callback: BodyResponseCallback<Schema$Empty>): void;
        batchWrite(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Projects$Traces$Batchwrite extends StandardParameters {
        /**
         * Required. The name of the project where the spans belong. The format is `projects/[PROJECT_ID]`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BatchWriteSpansRequest;
    }
    export class Resource$Projects$Traces$Spans {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new span. If a span ID already exists, an additional copy of the span will be stored.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createSpan(params: Params$Resource$Projects$Traces$Spans$Createspan, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createSpan(params?: Params$Resource$Projects$Traces$Spans$Createspan, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Span>>;
        createSpan(params: Params$Resource$Projects$Traces$Spans$Createspan, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createSpan(params: Params$Resource$Projects$Traces$Spans$Createspan, options: MethodOptions | BodyResponseCallback<Schema$Span>, callback: BodyResponseCallback<Schema$Span>): void;
        createSpan(params: Params$Resource$Projects$Traces$Spans$Createspan, callback: BodyResponseCallback<Schema$Span>): void;
        createSpan(callback: BodyResponseCallback<Schema$Span>): void;
    }
    export interface Params$Resource$Projects$Traces$Spans$Createspan extends StandardParameters {
        /**
         * Required. The resource name of the span in the following format: * `projects/[PROJECT_ID]/traces/[TRACE_ID]/spans/[SPAN_ID]` `[TRACE_ID]` is a unique identifier for a trace within a project; it is a 32-character hexadecimal encoding of a 16-byte array. It should not be zero. `[SPAN_ID]` is a unique identifier for a span within a trace; it is a 16-character hexadecimal encoding of an 8-byte array. It should not be zero. .
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Span;
    }
    export {};
}
