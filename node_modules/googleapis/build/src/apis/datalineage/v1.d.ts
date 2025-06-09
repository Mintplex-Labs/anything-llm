import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace datalineage_v1 {
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
     * Data Lineage API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const datalineage = google.datalineage('v1');
     * ```
     */
    export class Datalineage {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request message for BatchSearchLinkProcesses.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesRequest {
        /**
         * Required. An array of links to check for their associated LineageProcesses. The maximum number of items in this array is 100. If the request contains more than 100 links, it returns the `INVALID_ARGUMENT` error. Format: `projects/{project\}/locations/{location\}/links/{link\}`.
         */
        links?: string[] | null;
        /**
         * The maximum number of processes to return in a single page of the response. A page may contain fewer results than this value.
         */
        pageSize?: number | null;
        /**
         * The page token received from a previous `BatchSearchLinkProcesses` call. Use it to get the next page. When requesting subsequent pages of a response, remember that all parameters must match the values you provided in the original request.
         */
        pageToken?: string | null;
    }
    /**
     * Response message for BatchSearchLinkProcesses.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse {
        /**
         * The token to specify as `page_token` in the subsequent call to get the next page. Omitted if there are no more pages in the response.
         */
        nextPageToken?: string | null;
        /**
         * An array of processes associated with the specified links.
         */
        processLinks?: Schema$GoogleCloudDatacatalogLineageV1ProcessLinks[];
    }
    /**
     * The soft reference to everything you can attach a lineage event to.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1EntityReference {
        /**
         * Required. [Fully Qualified Name (FQN)](https://cloud.google.com/data-catalog/docs/fully-qualified-names) of the entity.
         */
        fullyQualifiedName?: string | null;
    }
    /**
     * A lineage between source and target entities.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1EventLink {
        /**
         * Required. Reference to the source entity
         */
        source?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
        /**
         * Required. Reference to the target entity
         */
        target?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
    }
    /**
     * A lineage event represents an operation on assets. Within the operation, the data flows from the source to the target defined in the links field.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1LineageEvent {
        /**
         * Optional. The end of the transformation which resulted in this lineage event. For streaming scenarios, it should be the end of the period from which the lineage is being reported.
         */
        endTime?: string | null;
        /**
         * Optional. List of source-target pairs. Can't contain more than 100 tuples.
         */
        links?: Schema$GoogleCloudDatacatalogLineageV1EventLink[];
        /**
         * Immutable. The resource name of the lineage event. Format: `projects/{project\}/locations/{location\}/processes/{process\}/runs/{run\}/lineageEvents/{lineage_event\}`. Can be specified or auto-assigned. {lineage_event\} must be not longer than 200 characters and only contain characters in a set: `a-zA-Z0-9_-:.`
         */
        name?: string | null;
        /**
         * Required. The beginning of the transformation which resulted in this lineage event. For streaming scenarios, it should be the beginning of the period from which the lineage is being reported.
         */
        startTime?: string | null;
    }
    /**
     * Links represent the data flow between **source** (upstream) and **target** (downstream) assets in transformation pipelines. Links are created when LineageEvents record data transformation between related assets.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1Link {
        /**
         * The end of the last event establishing this link.
         */
        endTime?: string | null;
        /**
         * Output only. Immutable. The name of the link. Format: `projects/{project\}/locations/{location\}/links/{link\}`.
         */
        name?: string | null;
        /**
         * The pointer to the entity that is the **source** of this link.
         */
        source?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
        /**
         * The start of the first event establishing this link.
         */
        startTime?: string | null;
        /**
         * The pointer to the entity that is the **target** of this link.
         */
        target?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
    }
    /**
     * Response message for ListLineageEvents.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse {
        /**
         * Lineage events from the specified project and location.
         */
        lineageEvents?: Schema$GoogleCloudDatacatalogLineageV1LineageEvent[];
        /**
         * The token to specify as `page_token` in the next call to get the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListProcesses.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse {
        /**
         * The token to specify as `page_token` in the next call to get the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The processes from the specified project and location.
         */
        processes?: Schema$GoogleCloudDatacatalogLineageV1Process[];
    }
    /**
     * Response message for ListRuns.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse {
        /**
         * The token to specify as `page_token` in the next call to get the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The runs from the specified project and location.
         */
        runs?: Schema$GoogleCloudDatacatalogLineageV1Run[];
    }
    /**
     * Metadata describing the operation.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1OperationMetadata {
        /**
         * Output only. The timestamp of the operation submission to the server.
         */
        createTime?: string | null;
        /**
         * Output only. The timestamp of the operation termination, regardless of its success. This field is unset if the operation is still ongoing.
         */
        endTime?: string | null;
        /**
         * Output only. The type of the operation being performed.
         */
        operationType?: string | null;
        /**
         * Output only. The [relative name] (https://cloud.google.com//apis/design/resource_names#relative_resource_name) of the resource being operated on.
         */
        resource?: string | null;
        /**
         * Output only. The UUID of the resource being operated on.
         */
        resourceUuid?: string | null;
        /**
         * Output only. The current operation state.
         */
        state?: string | null;
    }
    /**
     * Origin of a process.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1Origin {
        /**
         * If the source_type isn't CUSTOM, the value of this field should be a GCP resource name of the system, which reports lineage. The project and location parts of the resource name must match the project and location of the lineage resource being created. Examples: - `{source_type: COMPOSER, name: "projects/foo/locations/us/environments/bar"\}` - `{source_type: BIGQUERY, name: "projects/foo/locations/eu"\}` - `{source_type: CUSTOM, name: "myCustomIntegration"\}`
         */
        name?: string | null;
        /**
         * Type of the source. Use of a source_type other than `CUSTOM` for process creation or updating is highly discouraged, and may be restricted in the future without notice.
         */
        sourceType?: string | null;
    }
    /**
     * A process is the definition of a data transformation operation.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1Process {
        /**
         * Optional. The attributes of the process. Should only be used for the purpose of non-semantic management (classifying, describing or labeling the process). Up to 100 attributes are allowed.
         */
        attributes?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. A human-readable name you can set to display in a user interface. Must be not longer than 200 characters and only contain UTF-8 letters or numbers, spaces or characters like `_-:&.`
         */
        displayName?: string | null;
        /**
         * Immutable. The resource name of the lineage process. Format: `projects/{project\}/locations/{location\}/processes/{process\}`. Can be specified or auto-assigned. {process\} must be not longer than 200 characters and only contain characters in a set: `a-zA-Z0-9_-:.`
         */
        name?: string | null;
        /**
         * Optional. The origin of this process and its runs and lineage events.
         */
        origin?: Schema$GoogleCloudDatacatalogLineageV1Origin;
    }
    /**
     * Link details.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1ProcessLinkInfo {
        /**
         * The end of the last event establishing this link-process tuple.
         */
        endTime?: string | null;
        /**
         * The name of the link in the format of `projects/{project\}/locations/{location\}/links/{link\}`.
         */
        link?: string | null;
        /**
         * The start of the first event establishing this link-process tuple.
         */
        startTime?: string | null;
    }
    /**
     * Links associated with a specific process.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1ProcessLinks {
        /**
         * An array containing link details objects of the links provided in the original request. A single process can result in creating multiple links. If any of the links you provide in the request are created by the same process, they all are included in this array.
         */
        links?: Schema$GoogleCloudDatacatalogLineageV1ProcessLinkInfo[];
        /**
         * The process name in the format of `projects/{project\}/locations/{location\}/processes/{process\}`.
         */
        process?: string | null;
    }
    /**
     * A lineage run represents an execution of a process that creates lineage events.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1Run {
        /**
         * Optional. The attributes of the run. Should only be used for the purpose of non-semantic management (classifying, describing or labeling the run). Up to 100 attributes are allowed.
         */
        attributes?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. A human-readable name you can set to display in a user interface. Must be not longer than 1024 characters and only contain UTF-8 letters or numbers, spaces or characters like `_-:&.`
         */
        displayName?: string | null;
        /**
         * Optional. The timestamp of the end of the run.
         */
        endTime?: string | null;
        /**
         * Immutable. The resource name of the run. Format: `projects/{project\}/locations/{location\}/processes/{process\}/runs/{run\}`. Can be specified or auto-assigned. {run\} must be not longer than 200 characters and only contain characters in a set: `a-zA-Z0-9_-:.`
         */
        name?: string | null;
        /**
         * Required. The timestamp of the start of the run.
         */
        startTime?: string | null;
        /**
         * Required. The state of the run.
         */
        state?: string | null;
    }
    /**
     * Request message for SearchLinks.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1SearchLinksRequest {
        /**
         * Optional. The maximum number of links to return in a single page of the response. A page may contain fewer links than this value. If unspecified, at most 10 links are returned. Maximum value is 100; values greater than 100 are reduced to 100.
         */
        pageSize?: number | null;
        /**
         * Optional. The page token received from a previous `SearchLinksRequest` call. Use it to get the next page. When requesting subsequent pages of a response, remember that all parameters must match the values you provided in the original request.
         */
        pageToken?: string | null;
        /**
         * Optional. Send asset information in the **source** field to retrieve all links that lead from the specified asset to downstream assets.
         */
        source?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
        /**
         * Optional. Send asset information in the **target** field to retrieve all links that lead from upstream assets to the specified asset.
         */
        target?: Schema$GoogleCloudDatacatalogLineageV1EntityReference;
    }
    /**
     * Response message for SearchLinks.
     */
    export interface Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse {
        /**
         * The list of links for a given asset. Can be empty if the asset has no relations of requested type (source or target).
         */
        links?: Schema$GoogleCloudDatacatalogLineageV1Link[];
        /**
         * The token to specify as `page_token` in the subsequent call to get the next page. Omitted if there are no more pages in the response.
         */
        nextPageToken?: string | null;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$GoogleLongrunningCancelOperationRequest {
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$GoogleLongrunningListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$GoogleLongrunningOperation[];
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id\}`.
         */
        name?: string | null;
        /**
         * The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$GoogleRpcStatus {
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
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Operations;
        processes: Resource$Projects$Locations$Processes;
        constructor(context: APIRequestContext);
        /**
         * Retrieve information about LineageProcesses associated with specific links. LineageProcesses are transformation pipelines that result in data flowing from **source** to **target** assets. Links between assets represent this operation. If you have specific link names, you can use this method to verify which LineageProcesses contribute to creating those links. See the SearchLinks method for more information on how to retrieve link name. You can retrieve the LineageProcess information in every project where you have the `datalineage.events.get` permission. The project provided in the URL is used for Billing and Quota.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchSearchLinkProcesses(params: Params$Resource$Projects$Locations$Batchsearchlinkprocesses, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchSearchLinkProcesses(params?: Params$Resource$Projects$Locations$Batchsearchlinkprocesses, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse>>;
        batchSearchLinkProcesses(params: Params$Resource$Projects$Locations$Batchsearchlinkprocesses, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchSearchLinkProcesses(params: Params$Resource$Projects$Locations$Batchsearchlinkprocesses, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse>): void;
        batchSearchLinkProcesses(params: Params$Resource$Projects$Locations$Batchsearchlinkprocesses, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse>): void;
        batchSearchLinkProcesses(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesResponse>): void;
        /**
         * Retrieve a list of links connected to a specific asset. Links represent the data flow between **source** (upstream) and **target** (downstream) assets in transformation pipelines. Links are stored in the same project as the Lineage Events that create them. You can retrieve links in every project where you have the `datalineage.events.get` permission. The project provided in the URL is used for Billing and Quota.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchLinks(params: Params$Resource$Projects$Locations$Searchlinks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchLinks(params?: Params$Resource$Projects$Locations$Searchlinks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse>>;
        searchLinks(params: Params$Resource$Projects$Locations$Searchlinks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchLinks(params: Params$Resource$Projects$Locations$Searchlinks, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse>): void;
        searchLinks(params: Params$Resource$Projects$Locations$Searchlinks, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse>): void;
        searchLinks(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1SearchLinksResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Batchsearchlinkprocesses extends StandardParameters {
        /**
         * Required. The project and location where you want to search.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1BatchSearchLinkProcessesRequest;
    }
    export interface Params$Resource$Projects$Locations$Searchlinks extends StandardParameters {
        /**
         * Required. The project and location you want search in.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1SearchLinksRequest;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleLongrunningCancelOperationRequest;
    }
    export interface Params$Resource$Projects$Locations$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Processes {
        context: APIRequestContext;
        runs: Resource$Projects$Locations$Processes$Runs;
        constructor(context: APIRequestContext);
        /**
         * Creates a new process.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Processes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Processes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Process>>;
        create(params: Params$Resource$Projects$Locations$Processes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        /**
         * Deletes the process with the specified name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Processes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Processes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Processes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets the details of the specified process.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Processes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Processes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Process>>;
        get(params: Params$Resource$Projects$Locations$Processes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        /**
         * List processes in the given project and location. List order is descending by insertion time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Processes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Processes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse>>;
        list(params: Params$Resource$Projects$Locations$Processes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Processes$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Processes$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListProcessesResponse>): void;
        /**
         * Updates a process.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Processes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Processes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Process>>;
        patch(params: Params$Resource$Projects$Locations$Processes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Processes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        patch(params: Params$Resource$Projects$Locations$Processes$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Process>): void;
    }
    export interface Params$Resource$Projects$Locations$Processes$Create extends StandardParameters {
        /**
         * Required. The name of the project and its location that should own the process.
         */
        parent?: string;
        /**
         * A unique identifier for this request. Restricted to 36 ASCII characters. A random UUID is recommended. This request is idempotent only if a `request_id` is provided.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1Process;
    }
    export interface Params$Resource$Projects$Locations$Processes$Delete extends StandardParameters {
        /**
         * If set to true and the process is not found, the request succeeds but the server doesn't perform any actions.
         */
        allowMissing?: boolean;
        /**
         * Required. The name of the process to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Get extends StandardParameters {
        /**
         * Required. The name of the process to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$List extends StandardParameters {
        /**
         * The maximum number of processes to return. The service may return fewer than this value. If unspecified, at most 50 processes are returned. The maximum value is 100; values greater than 100 are cut to 100.
         */
        pageSize?: number;
        /**
         * The page token received from a previous `ListProcesses` call. Specify it to get the next page. When paginating, all other parameters specified in this call must match the parameters of the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The name of the project and its location that owns this collection of processes.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Patch extends StandardParameters {
        /**
         * If set to true and the process is not found, the request inserts it.
         */
        allowMissing?: boolean;
        /**
         * Immutable. The resource name of the lineage process. Format: `projects/{project\}/locations/{location\}/processes/{process\}`. Can be specified or auto-assigned. {process\} must be not longer than 200 characters and only contain characters in a set: `a-zA-Z0-9_-:.`
         */
        name?: string;
        /**
         * The list of fields to update. Currently not used. The whole message is updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1Process;
    }
    export class Resource$Projects$Locations$Processes$Runs {
        context: APIRequestContext;
        lineageEvents: Resource$Projects$Locations$Processes$Runs$Lineageevents;
        constructor(context: APIRequestContext);
        /**
         * Creates a new run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Processes$Runs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Run>>;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        /**
         * Deletes the run with the specified name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Processes$Runs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets the details of the specified run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Processes$Runs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Run>>;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        /**
         * Lists runs in the given project and location. List order is descending by `start_time`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Processes$Runs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Processes$Runs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse>>;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListRunsResponse>): void;
        /**
         * Updates a run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Processes$Runs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Processes$Runs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1Run>>;
        patch(params: Params$Resource$Projects$Locations$Processes$Runs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Processes$Runs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        patch(params: Params$Resource$Projects$Locations$Processes$Runs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1Run>): void;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Create extends StandardParameters {
        /**
         * Required. The name of the process that should own the run.
         */
        parent?: string;
        /**
         * A unique identifier for this request. Restricted to 36 ASCII characters. A random UUID is recommended. This request is idempotent only if a `request_id` is provided.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1Run;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Delete extends StandardParameters {
        /**
         * If set to true and the run is not found, the request succeeds but the server doesn't perform any actions.
         */
        allowMissing?: boolean;
        /**
         * Required. The name of the run to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Get extends StandardParameters {
        /**
         * Required. The name of the run to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$List extends StandardParameters {
        /**
         * The maximum number of runs to return. The service may return fewer than this value. If unspecified, at most 50 runs are returned. The maximum value is 100; values greater than 100 are cut to 100.
         */
        pageSize?: number;
        /**
         * The page token received from a previous `ListRuns` call. Specify it to get the next page. When paginating, all other parameters specified in this call must match the parameters of the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The name of process that owns this collection of runs.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Patch extends StandardParameters {
        /**
         * If set to true and the run is not found, the request creates it.
         */
        allowMissing?: boolean;
        /**
         * Immutable. The resource name of the run. Format: `projects/{project\}/locations/{location\}/processes/{process\}/runs/{run\}`. Can be specified or auto-assigned. {run\} must be not longer than 200 characters and only contain characters in a set: `a-zA-Z0-9_-:.`
         */
        name?: string;
        /**
         * The list of fields to update. Currently not used. The whole message is updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1Run;
    }
    export class Resource$Projects$Locations$Processes$Runs$Lineageevents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new lineage event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>>;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        create(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        /**
         * Deletes the lineage event with the specified name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets details of a specified lineage event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>>;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        get(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1LineageEvent>): void;
        /**
         * Lists lineage events in the given project and location. The list order is not defined.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse>>;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogLineageV1ListLineageEventsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Create extends StandardParameters {
        /**
         * Required. The name of the run that should own the lineage event.
         */
        parent?: string;
        /**
         * A unique identifier for this request. Restricted to 36 ASCII characters. A random UUID is recommended. This request is idempotent only if a `request_id` is provided.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogLineageV1LineageEvent;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Delete extends StandardParameters {
        /**
         * If set to true and the lineage event is not found, the request succeeds but the server doesn't perform any actions.
         */
        allowMissing?: boolean;
        /**
         * Required. The name of the lineage event to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$Get extends StandardParameters {
        /**
         * Required. The name of the lineage event to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Processes$Runs$Lineageevents$List extends StandardParameters {
        /**
         * The maximum number of lineage events to return. The service may return fewer events than this value. If unspecified, at most 50 events are returned. The maximum value is 100; values greater than 100 are cut to 100.
         */
        pageSize?: number;
        /**
         * The page token received from a previous `ListLineageEvents` call. Specify it to get the next page. When paginating, all other parameters specified in this call must match the parameters of the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The name of the run that owns the collection of lineage events to get.
         */
        parent?: string;
    }
    export {};
}
