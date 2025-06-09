import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace displayvideo_v1beta2 {
    export interface Options extends GlobalOptions {
        version: 'v1beta2';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
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
     * Display &amp; Video 360 API
     *
     * Display &amp; Video 360 API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const displayvideo = google.displayvideo('v1beta2');
     * ```
     */
    export class Displayvideo {
        context: APIRequestContext;
        media: Resource$Media;
        sdfdownloadtasks: Resource$Sdfdownloadtasks;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Media resource.
     */
    export interface Schema$GoogleBytestreamMedia {
        /**
         * Name of the media resource.
         */
        resourceName?: string | null;
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
         * The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
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
    export class Resource$Media {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Downloads media. Download is supported on the URI `/download/{resource_name=**\}?alt=media.` **Note**: Download requests will not be successful without including `alt=media` query string.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/displayvideo.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const displayvideo = google.displayvideo('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/display-video',
         *       'https://www.googleapis.com/auth/doubleclickbidmanager',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await displayvideo.media.download({
         *     // Name of the media that is being downloaded. See ReadRequest.resource_name.
         *     resourceName: '.*',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "resourceName": "my_resourceName"
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
        download(params: Params$Resource$Media$Download, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        download(params?: Params$Resource$Media$Download, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleBytestreamMedia>>;
        download(params: Params$Resource$Media$Download, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        download(params: Params$Resource$Media$Download, options: MethodOptions | BodyResponseCallback<Schema$GoogleBytestreamMedia>, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        download(params: Params$Resource$Media$Download, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        download(callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
    }
    export interface Params$Resource$Media$Download extends StandardParameters {
        /**
         * Name of the media that is being downloaded. See ReadRequest.resource_name.
         */
        resourceName?: string;
    }
    export class Resource$Sdfdownloadtasks {
        context: APIRequestContext;
        operations: Resource$Sdfdownloadtasks$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Sdfdownloadtasks$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of an asynchronous SDF download task operation. Clients should poll this method at intervals of 30 seconds.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/displayvideo.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const displayvideo = google.displayvideo('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/display-video',
         *       'https://www.googleapis.com/auth/doubleclickbidmanager',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await displayvideo.sdfdownloadtasks.operations.get({
         *     // The name of the operation resource.
         *     name: 'sdfdownloadtasks/operations/my-operation',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sdfdownloadtasks$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Sdfdownloadtasks$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export {};
}
