import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace firebaseml_v1beta2 {
    export interface Options extends GlobalOptions {
        version: 'v1beta2';
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
     * Firebase ML API
     *
     * Access custom machine learning models hosted via Firebase ML.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const firebaseml = google.firebaseml('v1beta2');
     * ```
     */
    export class Firebaseml {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The response for downloading a model to device.
     */
    export interface Schema$DownloadModelResponse {
        /**
         * Output only. A download URI for the model/zip file.
         */
        downloadUri?: string | null;
        /**
         * Output only. The time that the download URI link expires. If the link has expired, the REST call must be repeated.
         */
        expireTime?: string | null;
        /**
         * Output only. The format of the model being downloaded.
         */
        modelFormat?: string | null;
        /**
         * Output only. The size of the file(s), if this information is available.
         */
        sizeBytes?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The response for list models
     */
    export interface Schema$ListModelsResponse {
        /**
         * The list of models
         */
        models?: Schema$Model[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * An ML model hosted in Firebase ML
     */
    export interface Schema$Model {
        /**
         * Output only. Lists operation ids associated with this model whose status is NOT done.
         */
        activeOperations?: Schema$Operation[];
        /**
         * Output only. Timestamp when this model was created in Firebase ML.
         */
        createTime?: string | null;
        /**
         * Required. The name of the model to create. The name can be up to 32 characters long and can consist only of ASCII Latin letters A-Z and a-z, underscores(_) and ASCII digits 0-9. It must start with a letter.
         */
        displayName?: string | null;
        /**
         * Output only. See RFC7232 https://tools.ietf.org/html/rfc7232#section-2.3
         */
        etag?: string | null;
        /**
         * Output only. The model_hash will change if a new file is available for download.
         */
        modelHash?: string | null;
        /**
         * The resource name of the Model. Model names have the form `projects/{project_id\}/models/{model_id\}` The name is ignored when creating a model.
         */
        name?: string | null;
        /**
         * State common to all model types. Includes publishing and validation information.
         */
        state?: Schema$ModelState;
        /**
         * User defined tags which can be used to group/filter models during listing
         */
        tags?: string[] | null;
        /**
         * A TFLite Model
         */
        tfliteModel?: Schema$TfLiteModel;
        /**
         * Output only. Timestamp when this model was updated in Firebase ML.
         */
        updateTime?: string | null;
    }
    /**
     * This is returned in the longrunning operations for create/update.
     */
    export interface Schema$ModelOperationMetadata {
        basicOperationStatus?: string | null;
        /**
         * The name of the model we are creating/updating The name must have the form `projects/{project_id\}/models/{model_id\}`
         */
        name?: string | null;
    }
    /**
     * State common to all model types. Includes publishing and validation information.
     */
    export interface Schema$ModelState {
        /**
         * Indicates if this model has been published.
         */
        published?: boolean | null;
        /**
         * Output only. Indicates the latest validation error on the model if any. A model may have validation errors if there were problems during the model creation/update. e.g. in the case of a TfLiteModel, if a tflite model file was missing or in the wrong format. This field will be empty for valid models.
         */
        validationError?: Schema$Status;
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
     * Information that is specific to TfLite models.
     */
    export interface Schema$TfLiteModel {
        /**
         * The AutoML model id referencing a model you created with the AutoML API. The name should have format 'projects//locations//models/' (This is the model resource name returned from the AutoML API)
         */
        automlModel?: string | null;
        /**
         * The TfLite file containing the model. (Stored in Google Cloud). The gcs_tflite_uri should have form: gs://some-bucket/some-model.tflite Note: If you update the file in the original location, it is necessary to call UpdateModel for ML to pick up and validate the updated file.
         */
        gcsTfliteUri?: string | null;
        /**
         * Output only. The size of the TFLite model
         */
        sizeBytes?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        models: Resource$Projects$Models;
        operations: Resource$Projects$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Models {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a model in Firebase ML. The longrunning operation will eventually return a Model
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Models$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Models$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Models$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Models$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Models$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a model
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Models$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Models$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Models$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Models$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Models$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets Download information for a model. This is meant for downloading model resources onto devices. It gives very limited information about the model.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        download(params: Params$Resource$Projects$Models$Download, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        download(params?: Params$Resource$Projects$Models$Download, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DownloadModelResponse>>;
        download(params: Params$Resource$Projects$Models$Download, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        download(params: Params$Resource$Projects$Models$Download, options: MethodOptions | BodyResponseCallback<Schema$DownloadModelResponse>, callback: BodyResponseCallback<Schema$DownloadModelResponse>): void;
        download(params: Params$Resource$Projects$Models$Download, callback: BodyResponseCallback<Schema$DownloadModelResponse>): void;
        download(callback: BodyResponseCallback<Schema$DownloadModelResponse>): void;
        /**
         * Gets a model resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Models$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Models$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Model>>;
        get(params: Params$Resource$Projects$Models$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Models$Get, options: MethodOptions | BodyResponseCallback<Schema$Model>, callback: BodyResponseCallback<Schema$Model>): void;
        get(params: Params$Resource$Projects$Models$Get, callback: BodyResponseCallback<Schema$Model>): void;
        get(callback: BodyResponseCallback<Schema$Model>): void;
        /**
         * Lists the models
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Models$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Models$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListModelsResponse>>;
        list(params: Params$Resource$Projects$Models$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Models$List, options: MethodOptions | BodyResponseCallback<Schema$ListModelsResponse>, callback: BodyResponseCallback<Schema$ListModelsResponse>): void;
        list(params: Params$Resource$Projects$Models$List, callback: BodyResponseCallback<Schema$ListModelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListModelsResponse>): void;
        /**
         * Updates a model. The longrunning operation will eventually return a Model.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Models$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Models$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Models$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Models$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Models$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Models$Create extends StandardParameters {
        /**
         * Required. The parent project resource where the model is to be created. The parent must have the form `projects/{project_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Model;
    }
    export interface Params$Resource$Projects$Models$Delete extends StandardParameters {
        /**
         * Required. The name of the model to delete. The name must have the form `projects/{project_id\}/models/{model_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Models$Download extends StandardParameters {
        /**
         * Required. The name of the model to download. The name must have the form `projects/{project\}/models/{model\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Models$Get extends StandardParameters {
        /**
         * Required. The name of the model to get. The name must have the form `projects/{project_id\}/models/{model_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Models$List extends StandardParameters {
        /**
         * A filter for the list e.g. 'tags: abc' to list models which are tagged with "abc"
         */
        filter?: string;
        /**
         * The maximum number of items to return
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The name of the parent to list models for. The parent must have the form `projects/{project_id\}'
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Models$Patch extends StandardParameters {
        /**
         * The resource name of the Model. Model names have the form `projects/{project_id\}/models/{model_id\}` The name is ignored when creating a model.
         */
        name?: string;
        /**
         * The update mask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Model;
    }
    export class Resource$Projects$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export {};
}
