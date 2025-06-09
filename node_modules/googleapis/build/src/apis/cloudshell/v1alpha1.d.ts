import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudshell_v1alpha1 {
    export interface Options extends GlobalOptions {
        version: 'v1alpha1';
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
     * Cloud Shell API
     *
     * Allows users to start, configure, and connect to interactive shell sessions running in the cloud.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudshell = google.cloudshell('v1alpha1');
     * ```
     */
    export class Cloudshell {
        context: APIRequestContext;
        users: Resource$Users;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request message for AuthorizeEnvironment.
     */
    export interface Schema$AuthorizeEnvironmentRequest {
        /**
         * The OAuth access token that should be sent to the environment.
         */
        accessToken?: string | null;
        /**
         * The time when the credentials expire. If not set, defaults to one hour from when the server received the request.
         */
        expireTime?: string | null;
        /**
         * The OAuth ID token that should be sent to the environment.
         */
        idToken?: string | null;
    }
    /**
     * Request message for CreatePublicKey.
     */
    export interface Schema$CreatePublicKeyRequest {
        /**
         * Key that should be added to the environment.
         */
        key?: Schema$PublicKey;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * A Cloud Shell environment, which is defined as the combination of a Docker image specifying what is installed on the environment and a home directory containing the user's data that will remain across sessions. Each user has a single environment with the ID "default".
     */
    export interface Schema$Environment {
        /**
         * Required. Full path to the Docker image used to run this environment, e.g. "gcr.io/dev-con/cloud-devshell:latest".
         */
        dockerImage?: string | null;
        /**
         * Output only. The environment's identifier, unique among the user's environments.
         */
        id?: string | null;
        /**
         * Output only. Full name of this resource, in the format `users/{owner_email\}/environments/{environment_id\}`. `{owner_email\}` is the email address of the user to whom this environment belongs, and `{environment_id\}` is the identifier of this environment. For example, `users/someone@example.com/environments/default`.
         */
        name?: string | null;
        /**
         * Output only. Public keys associated with the environment. Clients can connect to this environment via SSH only if they possess a private key corresponding to at least one of these public keys. Keys can be added to or removed from the environment using the CreatePublicKey and DeletePublicKey methods.
         */
        publicKeys?: Schema$PublicKey[];
        /**
         * Indicates the size of the backing VM running the environment. If set to something other than DEFAULT, it will be reverted to the default VM size after vm_size_expire_time.
         */
        size?: string | null;
        /**
         * Output only. Host to which clients can connect to initiate SSH sessions with the environment.
         */
        sshHost?: string | null;
        /**
         * Output only. Port to which clients can connect to initiate SSH sessions with the environment.
         */
        sshPort?: number | null;
        /**
         * Output only. Username that clients should use when initiating SSH sessions with the environment.
         */
        sshUsername?: string | null;
        /**
         * Output only. Current execution state of this environment.
         */
        state?: string | null;
        /**
         * Output only. The time when the Environment will expire back to the default VM size.
         */
        vmSizeExpireTime?: string | null;
        /**
         * Output only. Host to which clients can connect to initiate HTTPS or WSS connections with the environment.
         */
        webHost?: string | null;
        /**
         * Output only. Ports to which clients can connect to initiate HTTPS or WSS connections with the environment.
         */
        webPorts?: number[] | null;
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
     * A public SSH key, corresponding to a private SSH key held by the client.
     */
    export interface Schema$PublicKey {
        /**
         * Required. Format of this key's content.
         */
        format?: string | null;
        /**
         * Required. Content of this key.
         */
        key?: string | null;
        /**
         * Output only. Full name of this resource, in the format `users/{owner_email\}/environments/{environment_id\}/publicKeys/{key_id\}`. `{owner_email\}` is the email address of the user to whom the key belongs. `{environment_id\}` is the identifier of the environment to which the key grants access. `{key_id\}` is the unique identifier of the key. For example, `users/someone@example.com/environments/default/publicKeys/myKey`.
         */
        name?: string | null;
    }
    /**
     * Message included in the metadata field of operations returned from StartEnvironment.
     */
    export interface Schema$StartEnvironmentMetadata {
        /**
         * Current state of the environment being started.
         */
        state?: string | null;
    }
    /**
     * Request message for StartEnvironment.
     */
    export interface Schema$StartEnvironmentRequest {
        /**
         * The initial access token passed to the environment. If this is present and valid, the environment will be pre-authenticated with gcloud so that the user can run gcloud commands in Cloud Shell without having to log in. This code can be updated later by calling AuthorizeEnvironment.
         */
        accessToken?: string | null;
        /**
         * Public keys that should be added to the environment before it is started.
         */
        publicKeys?: Schema$PublicKey[];
    }
    /**
     * Message included in the response field of operations returned from StartEnvironment once the operation is complete.
     */
    export interface Schema$StartEnvironmentResponse {
        /**
         * Environment that was started.
         */
        environment?: Schema$Environment;
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
    export class Resource$Users {
        context: APIRequestContext;
        environments: Resource$Users$Environments;
        constructor(context: APIRequestContext);
    }
    export class Resource$Users$Environments {
        context: APIRequestContext;
        publicKeys: Resource$Users$Environments$Publickeys;
        constructor(context: APIRequestContext);
        /**
         * Sends OAuth credentials to a running environment on behalf of a user. When this completes, the environment will be authorized to run various Google Cloud command line tools without requiring the user to manually authenticate.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.authorize({
         *     // Name of the resource that should receive the credentials, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         *     name: 'users/my-user/environments/my-environment',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "accessToken": "my_accessToken",
         *       //   "expireTime": "my_expireTime",
         *       //   "idToken": "my_idToken"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        authorize(params: Params$Resource$Users$Environments$Authorize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        authorize(params?: Params$Resource$Users$Environments$Authorize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        authorize(params: Params$Resource$Users$Environments$Authorize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        authorize(params: Params$Resource$Users$Environments$Authorize, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        authorize(params: Params$Resource$Users$Environments$Authorize, callback: BodyResponseCallback<Schema$Empty>): void;
        authorize(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an environment. Returns NOT_FOUND if the environment does not exist.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.get({
         *     // Name of the requested resource, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         *     name: 'users/my-user/environments/my-environment',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dockerImage": "my_dockerImage",
         *   //   "id": "my_id",
         *   //   "name": "my_name",
         *   //   "publicKeys": [],
         *   //   "size": "my_size",
         *   //   "sshHost": "my_sshHost",
         *   //   "sshPort": 0,
         *   //   "sshUsername": "my_sshUsername",
         *   //   "state": "my_state",
         *   //   "vmSizeExpireTime": "my_vmSizeExpireTime",
         *   //   "webHost": "my_webHost",
         *   //   "webPorts": []
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
        get(params: Params$Resource$Users$Environments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Users$Environments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Environment>>;
        get(params: Params$Resource$Users$Environments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Users$Environments$Get, options: MethodOptions | BodyResponseCallback<Schema$Environment>, callback: BodyResponseCallback<Schema$Environment>): void;
        get(params: Params$Resource$Users$Environments$Get, callback: BodyResponseCallback<Schema$Environment>): void;
        get(callback: BodyResponseCallback<Schema$Environment>): void;
        /**
         * Updates an existing environment.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.patch({
         *     // Name of the resource to be updated, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         *     name: 'users/my-user/environments/my-environment',
         *     // Mask specifying which fields in the environment should be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dockerImage": "my_dockerImage",
         *       //   "id": "my_id",
         *       //   "name": "my_name",
         *       //   "publicKeys": [],
         *       //   "size": "my_size",
         *       //   "sshHost": "my_sshHost",
         *       //   "sshPort": 0,
         *       //   "sshUsername": "my_sshUsername",
         *       //   "state": "my_state",
         *       //   "vmSizeExpireTime": "my_vmSizeExpireTime",
         *       //   "webHost": "my_webHost",
         *       //   "webPorts": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dockerImage": "my_dockerImage",
         *   //   "id": "my_id",
         *   //   "name": "my_name",
         *   //   "publicKeys": [],
         *   //   "size": "my_size",
         *   //   "sshHost": "my_sshHost",
         *   //   "sshPort": 0,
         *   //   "sshUsername": "my_sshUsername",
         *   //   "state": "my_state",
         *   //   "vmSizeExpireTime": "my_vmSizeExpireTime",
         *   //   "webHost": "my_webHost",
         *   //   "webPorts": []
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
        patch(params: Params$Resource$Users$Environments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Users$Environments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Environment>>;
        patch(params: Params$Resource$Users$Environments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Users$Environments$Patch, options: MethodOptions | BodyResponseCallback<Schema$Environment>, callback: BodyResponseCallback<Schema$Environment>): void;
        patch(params: Params$Resource$Users$Environments$Patch, callback: BodyResponseCallback<Schema$Environment>): void;
        patch(callback: BodyResponseCallback<Schema$Environment>): void;
        /**
         * Starts an existing environment, allowing clients to connect to it. The returned operation will contain an instance of StartEnvironmentMetadata in its metadata field. Users can wait for the environment to start by polling this operation via GetOperation. Once the environment has finished starting and is ready to accept connections, the operation will contain a StartEnvironmentResponse in its response field.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.start({
         *     // Name of the resource that should be started, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         *     name: 'users/my-user/environments/my-environment',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "accessToken": "my_accessToken",
         *       //   "publicKeys": []
         *       // }
         *     },
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
        start(params: Params$Resource$Users$Environments$Start, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        start(params?: Params$Resource$Users$Environments$Start, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        start(params: Params$Resource$Users$Environments$Start, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        start(params: Params$Resource$Users$Environments$Start, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        start(params: Params$Resource$Users$Environments$Start, callback: BodyResponseCallback<Schema$Operation>): void;
        start(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Users$Environments$Authorize extends StandardParameters {
        /**
         * Name of the resource that should receive the credentials, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AuthorizeEnvironmentRequest;
    }
    export interface Params$Resource$Users$Environments$Get extends StandardParameters {
        /**
         * Name of the requested resource, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         */
        name?: string;
    }
    export interface Params$Resource$Users$Environments$Patch extends StandardParameters {
        /**
         * Name of the resource to be updated, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         */
        name?: string;
        /**
         * Mask specifying which fields in the environment should be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Environment;
    }
    export interface Params$Resource$Users$Environments$Start extends StandardParameters {
        /**
         * Name of the resource that should be started, for example `users/me/environments/default` or `users/someone@example.com/environments/default`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartEnvironmentRequest;
    }
    export class Resource$Users$Environments$Publickeys {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Adds a public SSH key to an environment, allowing clients with the corresponding private key to connect to that environment via SSH. If a key with the same format and content already exists, this will return the existing key.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.publicKeys.create({
         *     // Parent resource name, e.g. `users/me/environments/default`.
         *     parent: 'users/my-user/environments/my-environment',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "key": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "format": "my_format",
         *   //   "key": "my_key",
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
        create(params: Params$Resource$Users$Environments$Publickeys$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Users$Environments$Publickeys$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PublicKey>>;
        create(params: Params$Resource$Users$Environments$Publickeys$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Users$Environments$Publickeys$Create, options: MethodOptions | BodyResponseCallback<Schema$PublicKey>, callback: BodyResponseCallback<Schema$PublicKey>): void;
        create(params: Params$Resource$Users$Environments$Publickeys$Create, callback: BodyResponseCallback<Schema$PublicKey>): void;
        create(callback: BodyResponseCallback<Schema$PublicKey>): void;
        /**
         * Removes a public SSH key from an environment. Clients will no longer be able to connect to the environment using the corresponding private key.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudshell.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudshell = google.cloudshell('v1alpha1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudshell.users.environments.publicKeys.delete({
         *     // Name of the resource to be deleted, e.g. `users/me/environments/default/publicKeys/my-key`.
         *     name: 'users/my-user/environments/my-environment/publicKeys/my-publicKey',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        delete(params: Params$Resource$Users$Environments$Publickeys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Users$Environments$Publickeys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Users$Environments$Publickeys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Users$Environments$Publickeys$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Users$Environments$Publickeys$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Users$Environments$Publickeys$Create extends StandardParameters {
        /**
         * Parent resource name, e.g. `users/me/environments/default`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreatePublicKeyRequest;
    }
    export interface Params$Resource$Users$Environments$Publickeys$Delete extends StandardParameters {
        /**
         * Name of the resource to be deleted, e.g. `users/me/environments/default/publicKeys/my-key`.
         */
        name?: string;
    }
    export {};
}
