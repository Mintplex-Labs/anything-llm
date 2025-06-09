import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace parallelstore_v1beta {
    export interface Options extends GlobalOptions {
        version: 'v1beta';
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
     * Parallelstore API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const parallelstore = google.parallelstore('v1beta');
     * ```
     */
    export class Parallelstore {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Cloud Storage as the destination of a data transfer.
     */
    export interface Schema$DestinationGcsBucket {
        /**
         * Required. URI to a Cloud Storage bucket in the format: `gs:///`. The path inside the bucket is optional.
         */
        uri?: string | null;
    }
    /**
     * Parallelstore as the destination of a data transfer.
     */
    export interface Schema$DestinationParallelstore {
        /**
         * Optional. Root directory path to the Paralellstore filesystem, starting with `/`. Defaults to `/` if unset.
         */
        path?: string | null;
    }
    /**
     * Export data from Parallelstore to Cloud Storage.
     */
    export interface Schema$ExportDataRequest {
        /**
         * Cloud Storage destination.
         */
        destinationGcsBucket?: Schema$DestinationGcsBucket;
        /**
         * Optional. The metadata options for the export data.
         */
        metadataOptions?: Schema$TransferMetadataOptions;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Optional. User-specified Service Account (SA) credentials to be used when performing the transfer. Use one of the following formats: * `{EMAIL_ADDRESS_OR_UNIQUE_ID\}` * `projects/{PROJECT_ID_OR_NUMBER\}/serviceAccounts/{EMAIL_ADDRESS_OR_UNIQUE_ID\}` * `projects/-/serviceAccounts/{EMAIL_ADDRESS_OR_UNIQUE_ID\}` If unspecified, the Parallelstore service agent is used: `service-@gcp-sa-parallelstore.iam.gserviceaccount.com`
         */
        serviceAccount?: string | null;
        /**
         * Parallelstore source.
         */
        sourceParallelstore?: Schema$SourceParallelstore;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * Import data from Cloud Storage into a Parallelstore instance.
     */
    export interface Schema$ImportDataRequest {
        /**
         * Parallelstore destination.
         */
        destinationParallelstore?: Schema$DestinationParallelstore;
        /**
         * Optional. The transfer metadata options for the import data.
         */
        metadataOptions?: Schema$TransferMetadataOptions;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Optional. User-specified service account credentials to be used when performing the transfer. Use one of the following formats: * `{EMAIL_ADDRESS_OR_UNIQUE_ID\}` * `projects/{PROJECT_ID_OR_NUMBER\}/serviceAccounts/{EMAIL_ADDRESS_OR_UNIQUE_ID\}` * `projects/-/serviceAccounts/{EMAIL_ADDRESS_OR_UNIQUE_ID\}` If unspecified, the Parallelstore service agent is used: `service-@gcp-sa-parallelstore.iam.gserviceaccount.com`
         */
        serviceAccount?: string | null;
        /**
         * The Cloud Storage source bucket and, optionally, path inside the bucket.
         */
        sourceGcsBucket?: Schema$SourceGcsBucket;
    }
    /**
     * A Parallelstore instance.
     */
    export interface Schema$Instance {
        /**
         * Output only. A list of IPv4 addresses used for client side configuration.
         */
        accessPoints?: string[] | null;
        /**
         * Required. Immutable. The instance's storage capacity in Gibibytes (GiB). Allowed values are between 12000 and 100000, in multiples of 4000; e.g., 12000, 16000, 20000, ...
         */
        capacityGib?: string | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * Output only. Deprecated: The version of DAOS software running in the instance.
         */
        daosVersion?: string | null;
        /**
         * Optional. Immutable. The deployment type of the instance. Allowed values are: * `SCRATCH`: the instance is a scratch instance. * `PERSISTENT`: the instance is a persistent instance.
         */
        deploymentType?: string | null;
        /**
         * Optional. The description of the instance. 2048 characters or less.
         */
        description?: string | null;
        /**
         * Optional. Immutable. Stripe level for directories. Allowed values are: * `DIRECTORY_STRIPE_LEVEL_MIN`: recommended when directories contain a small number of files. * `DIRECTORY_STRIPE_LEVEL_BALANCED`: balances performance for workloads involving a mix of small and large directories. * `DIRECTORY_STRIPE_LEVEL_MAX`: recommended for directories with a large number of files.
         */
        directoryStripeLevel?: string | null;
        /**
         * Output only. Immutable. The ID of the IP address range being used by the instance's VPC network. This field is populated by the service and contains the value currently used by the service.
         */
        effectiveReservedIpRange?: string | null;
        /**
         * Optional. Immutable. Stripe level for files. Allowed values are: * `FILE_STRIPE_LEVEL_MIN`: offers the best performance for small size files. * `FILE_STRIPE_LEVEL_BALANCED`: balances performance for workloads involving a mix of small and large files. * `FILE_STRIPE_LEVEL_MAX`: higher throughput performance for larger files.
         */
        fileStripeLevel?: string | null;
        /**
         * Optional. Cloud Labels are a flexible and lightweight mechanism for organizing cloud resources into groups that reflect a customer's organizational needs and deployment strategies. See https://cloud.google.com/resource-manager/docs/labels-overview for details.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. The resource name of the instance, in the format `projects/{project\}/locations/{location\}/instances/{instance_id\}`.
         */
        name?: string | null;
        /**
         * Optional. Immutable. The name of the Compute Engine [VPC network](https://cloud.google.com/vpc/docs/vpc) to which the instance is connected.
         */
        network?: string | null;
        /**
         * Optional. Immutable. The ID of the IP address range being used by the instance's VPC network. See [Configure a VPC network](https://cloud.google.com/parallelstore/docs/vpc#create_and_configure_the_vpc). If no ID is provided, all ranges are considered.
         */
        reservedIpRange?: string | null;
        /**
         * Output only. The instance state.
         */
        state?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Response from ListInstances.
     */
    export interface Schema$ListInstancesResponse {
        /**
         * The list of Parallelstore instances.
         */
        instances?: Schema$Instance[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
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
     * The response message for Operations.ListOperations.
     */
    export interface Schema$ListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$Operation[];
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
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$Operation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$Status;
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
         * The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Long-running operation metadata.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have been cancelled successfully have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        requestedCancellation?: boolean | null;
        /**
         * Output only. Human-readable status of the operation, if any.
         */
        statusMessage?: string | null;
        /**
         * Output only. Server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Output only. Name of the verb executed by the operation.
         */
        verb?: string | null;
    }
    /**
     * Operation metadata returned by the CLH during resource state reconciliation.
     */
    export interface Schema$ReconciliationOperationMetadata {
        /**
         * DEPRECATED. Use exclusive_action instead.
         */
        deleteResource?: boolean | null;
        /**
         * Excluisive action returned by the CLH.
         */
        exclusiveAction?: string | null;
    }
    /**
     * Cloud Storage as the source of a data transfer.
     */
    export interface Schema$SourceGcsBucket {
        /**
         * Required. URI to a Cloud Storage bucket in the format: `gs:///`. The path inside the bucket is optional.
         */
        uri?: string | null;
    }
    /**
     * Parallelstore as the source of a data transfer.
     */
    export interface Schema$SourceParallelstore {
        /**
         * Optional. Root directory path to the Paralellstore filesystem, starting with `/`. Defaults to `/` if unset.
         */
        path?: string | null;
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
     * Transfer metadata options for the instance.
     */
    export interface Schema$TransferMetadataOptions {
        /**
         * Optional. The GID preservation behavior.
         */
        gid?: string | null;
        /**
         * Optional. The mode preservation behavior.
         */
        mode?: string | null;
        /**
         * Optional. The UID preservation behavior.
         */
        uid?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        instances: Resource$Projects$Locations$Instances;
        operations: Resource$Projects$Locations$Operations;
        constructor(context: APIRequestContext);
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
    export class Resource$Projects$Locations$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Parallelstore instance in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Instances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Copies data from Parallelstore to Cloud Storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        exportData(params: Params$Resource$Projects$Locations$Instances$Exportdata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        exportData(params?: Params$Resource$Projects$Locations$Instances$Exportdata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        exportData(params: Params$Resource$Projects$Locations$Instances$Exportdata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        exportData(params: Params$Resource$Projects$Locations$Instances$Exportdata, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        exportData(params: Params$Resource$Projects$Locations$Instances$Exportdata, callback: BodyResponseCallback<Schema$Operation>): void;
        exportData(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Instance>>;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$Instance>, callback: BodyResponseCallback<Schema$Instance>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, callback: BodyResponseCallback<Schema$Instance>): void;
        get(callback: BodyResponseCallback<Schema$Instance>): void;
        /**
         * Copies data from Cloud Storage to Parallelstore.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        importData(params: Params$Resource$Projects$Locations$Instances$Importdata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        importData(params?: Params$Resource$Projects$Locations$Instances$Importdata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        importData(params: Params$Resource$Projects$Locations$Instances$Importdata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        importData(params: Params$Resource$Projects$Locations$Instances$Importdata, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        importData(params: Params$Resource$Projects$Locations$Instances$Importdata, callback: BodyResponseCallback<Schema$Operation>): void;
        importData(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all instances in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$ListInstancesResponse>, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        /**
         * Updates the parameters of a single instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Instances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Instances$Create extends StandardParameters {
        /**
         * Required. The name of the Parallelstore instance. * Must contain only lowercase letters, numbers, and hyphens. * Must start with a letter. * Must be between 1-63 characters. * Must end with a number or a letter. * Must be unique within the customer project / location
         */
        instanceId?: string;
        /**
         * Required. The instance's project and location, in the format `projects/{project\}/locations/{location\}`. Locations map to Google Cloud zones; for example, `us-west1-b`.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Delete extends StandardParameters {
        /**
         * Required. Name of the resource
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Exportdata extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportDataRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Get extends StandardParameters {
        /**
         * Required. The instance resource name, in the format `projects/{project_id\}/locations/{location\}/instances/{instance_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Importdata extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportDataRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve instance information, in the format `projects/{project_id\}/locations/{location\}`. To retrieve instance information for all locations, use "-" as the value of `{location\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the instance, in the format `projects/{project\}/locations/{location\}/instances/{instance_id\}`.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Mask of fields to update. Field mask is used to specify the fields to be overwritten in the Instance resource by the update. At least one path must be supplied in this field. The fields specified in the update_mask are relative to the resource, not the full request.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of `1`, corresponding to `Code.CANCELLED`.
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
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
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
    export {};
}
