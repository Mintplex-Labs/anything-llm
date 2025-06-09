import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace realtimebidding_v1alpha {
    export interface Options extends GlobalOptions {
        version: 'v1alpha';
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
     * Real-time Bidding API
     *
     * Allows external bidders to manage their RTB integration with Google. This includes managing bidder endpoints, QPS quotas, configuring what ad inventory to receive via pretargeting, submitting creatives for verification, and accessing creative metadata such as approval status.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const realtimebidding = google.realtimebidding('v1alpha');
     * ```
     */
    export class Realtimebidding {
        context: APIRequestContext;
        bidders: Resource$Bidders;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The request to activate a bidding function.
     */
    export interface Schema$ActivateBiddingFunctionRequest {
    }
    /**
     * A request to archive a bidding function.
     */
    export interface Schema$ArchiveBiddingFunctionRequest {
    }
    /**
     * The bidding function to be executed as part of the TURTLEDOVE simulation experiment bidding flow.
     */
    export interface Schema$BiddingFunction {
        /**
         * The raw Javascript source code of the bidding function.
         */
        biddingFunction?: string | null;
        /**
         * The name of the bidding function that must follow the pattern: `bidders/{bidder_account_id\}/biddingFunctions/{bidding_function_name\}`.
         */
        name?: string | null;
        /**
         * Output only. The state of the bidding function.
         */
        state?: string | null;
        /**
         * The type of the bidding function to be created.
         */
        type?: string | null;
    }
    /**
     * A response containing a list of a bidder's bidding functions.
     */
    export interface Schema$ListBiddingFunctionsResponse {
        /**
         * A list of a bidder's bidding functions.
         */
        biddingFunctions?: Schema$BiddingFunction[];
        /**
         * A token which can be passed to a subsequent call to the `ListBiddingFunctions` method to retrieve the next page of results in ListBiddingFunctionsRequest.pageToken.
         */
        nextPageToken?: string | null;
    }
    export class Resource$Bidders {
        context: APIRequestContext;
        biddingFunctions: Resource$Bidders$Biddingfunctions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Bidders$Biddingfunctions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Activates an existing bidding function. An activated function is available for invocation for the server-side TURTLEDOVE simulations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        activate(params: Params$Resource$Bidders$Biddingfunctions$Activate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        activate(params?: Params$Resource$Bidders$Biddingfunctions$Activate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BiddingFunction>>;
        activate(params: Params$Resource$Bidders$Biddingfunctions$Activate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        activate(params: Params$Resource$Bidders$Biddingfunctions$Activate, options: MethodOptions | BodyResponseCallback<Schema$BiddingFunction>, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        activate(params: Params$Resource$Bidders$Biddingfunctions$Activate, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        activate(callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        /**
         * Archives an existing bidding function. An archived function will not be available for function invocation for the server-side TURTLEDOVE simulations unless it is activated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        archive(params: Params$Resource$Bidders$Biddingfunctions$Archive, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        archive(params?: Params$Resource$Bidders$Biddingfunctions$Archive, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BiddingFunction>>;
        archive(params: Params$Resource$Bidders$Biddingfunctions$Archive, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        archive(params: Params$Resource$Bidders$Biddingfunctions$Archive, options: MethodOptions | BodyResponseCallback<Schema$BiddingFunction>, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        archive(params: Params$Resource$Bidders$Biddingfunctions$Archive, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        archive(callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        /**
         * Creates a new bidding function.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Bidders$Biddingfunctions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Bidders$Biddingfunctions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BiddingFunction>>;
        create(params: Params$Resource$Bidders$Biddingfunctions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Bidders$Biddingfunctions$Create, options: MethodOptions | BodyResponseCallback<Schema$BiddingFunction>, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        create(params: Params$Resource$Bidders$Biddingfunctions$Create, callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        create(callback: BodyResponseCallback<Schema$BiddingFunction>): void;
        /**
         * Lists the bidding functions that a bidder currently has registered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Biddingfunctions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Biddingfunctions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBiddingFunctionsResponse>>;
        list(params: Params$Resource$Bidders$Biddingfunctions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Biddingfunctions$List, options: MethodOptions | BodyResponseCallback<Schema$ListBiddingFunctionsResponse>, callback: BodyResponseCallback<Schema$ListBiddingFunctionsResponse>): void;
        list(params: Params$Resource$Bidders$Biddingfunctions$List, callback: BodyResponseCallback<Schema$ListBiddingFunctionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBiddingFunctionsResponse>): void;
    }
    export interface Params$Resource$Bidders$Biddingfunctions$Activate extends StandardParameters {
        /**
         * Required. The name of the bidding function to activate. Format: `bidders/{bidder_account_id\}/biddingFunction/{bidding_function_name\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ActivateBiddingFunctionRequest;
    }
    export interface Params$Resource$Bidders$Biddingfunctions$Archive extends StandardParameters {
        /**
         * Required. The name of the bidding function to archive. Format: `bidders/{bidder_account_id\}/biddingFunction/{bidding_function_name\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ArchiveBiddingFunctionRequest;
    }
    export interface Params$Resource$Bidders$Biddingfunctions$Create extends StandardParameters {
        /**
         * Required. The name of the bidder for which to create the bidding function. Format: `bidders/{bidderAccountId\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BiddingFunction;
    }
    export interface Params$Resource$Bidders$Biddingfunctions$List extends StandardParameters {
        /**
         * The maximum number of bidding functions to return.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. This value is received from a previous `ListBiddingFunctions` call in ListBiddingFunctionsResponse.nextPageToken.
         */
        pageToken?: string;
        /**
         * Required. Name of the bidder whose bidding functions will be listed. Format: `bidders/{bidder_account_id\}`
         */
        parent?: string;
    }
    export {};
}
