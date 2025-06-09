import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace webrisk_v1 {
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
     * Web Risk API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const webrisk = google.webrisk('v1');
     * ```
     */
    export class Webrisk {
        context: APIRequestContext;
        hashes: Resource$Hashes;
        projects: Resource$Projects;
        threatLists: Resource$Threatlists;
        uris: Resource$Uris;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse {
        /**
         * A set of entries to add to a local threat type's list.
         */
        additions?: Schema$GoogleCloudWebriskV1ThreatEntryAdditions;
        /**
         * The expected SHA256 hash of the client state; that is, of the sorted list of all hashes present in the database after applying the provided diff. If the client state doesn't match the expected state, the client must discard this diff and retry later.
         */
        checksum?: Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponseChecksum;
        /**
         * The new opaque client version token. This should be retained by the client and passed into the next call of ComputeThreatListDiff as 'version_token'. A separate version token should be stored and used for each threatList.
         */
        newVersionToken?: string | null;
        /**
         * The soonest the client should wait before issuing any diff request. Querying sooner is unlikely to produce a meaningful diff. Waiting longer is acceptable considering the use case. If this field is not set clients may update as soon as they want.
         */
        recommendedNextDiff?: string | null;
        /**
         * A set of entries to remove from a local threat type's list. This field may be empty.
         */
        removals?: Schema$GoogleCloudWebriskV1ThreatEntryRemovals;
        /**
         * The type of response. This may indicate that an action must be taken by the client when the response is received.
         */
        responseType?: string | null;
    }
    /**
     * The expected state of a client's local database.
     */
    export interface Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponseChecksum {
        /**
         * The SHA256 hash of the client state; that is, of the sorted list of all hashes present in the database.
         */
        sha256?: string | null;
    }
    /**
     * The uncompressed threat entries in hash format. Hashes can be anywhere from 4 to 32 bytes in size. A large majority are 4 bytes, but some hashes are lengthened if they collide with the hash of a popular URI. Used for sending ThreatEntryAdditons to clients that do not support compression, or when sending non-4-byte hashes to clients that do support compression.
     */
    export interface Schema$GoogleCloudWebriskV1RawHashes {
        /**
         * The number of bytes for each prefix encoded below. This field can be anywhere from 4 (shortest prefix) to 32 (full SHA256 hash). In practice this is almost always 4, except in exceptional circumstances.
         */
        prefixSize?: number | null;
        /**
         * The hashes, in binary format, concatenated into one long string. Hashes are sorted in lexicographic order. For JSON API users, hashes are base64-encoded.
         */
        rawHashes?: string | null;
    }
    /**
     * A set of raw indices to remove from a local list.
     */
    export interface Schema$GoogleCloudWebriskV1RawIndices {
        /**
         * The indices to remove from a lexicographically-sorted local list.
         */
        indices?: number[] | null;
    }
    /**
     * The Rice-Golomb encoded data. Used for sending compressed 4-byte hashes or compressed removal indices.
     */
    export interface Schema$GoogleCloudWebriskV1RiceDeltaEncoding {
        /**
         * The encoded deltas that are encoded using the Golomb-Rice coder.
         */
        encodedData?: string | null;
        /**
         * The number of entries that are delta encoded in the encoded data. If only a single integer was encoded, this will be zero and the single value will be stored in `first_value`.
         */
        entryCount?: number | null;
        /**
         * The offset of the first entry in the encoded data, or, if only a single integer was encoded, that single integer's value. If the field is empty or missing, assume zero.
         */
        firstValue?: string | null;
        /**
         * The Golomb-Rice parameter, which is a number between 2 and 28. This field is missing (that is, zero) if `num_entries` is zero.
         */
        riceParameter?: number | null;
    }
    export interface Schema$GoogleCloudWebriskV1SearchHashesResponse {
        /**
         * For requested entities that did not match the threat list, how long to cache the response until.
         */
        negativeExpireTime?: string | null;
        /**
         * The full hashes that matched the requested prefixes. The hash will be populated in the key.
         */
        threats?: Schema$GoogleCloudWebriskV1SearchHashesResponseThreatHash[];
    }
    /**
     * Contains threat information on a matching hash.
     */
    export interface Schema$GoogleCloudWebriskV1SearchHashesResponseThreatHash {
        /**
         * The cache lifetime for the returned match. Clients must not cache this response past this timestamp to avoid false positives.
         */
        expireTime?: string | null;
        /**
         * A 32 byte SHA256 hash. This field is in binary format. For JSON requests, hashes are base64-encoded.
         */
        hash?: string | null;
        /**
         * The ThreatList this threat belongs to. This must contain at least one entry.
         */
        threatTypes?: string[] | null;
    }
    export interface Schema$GoogleCloudWebriskV1SearchUrisResponse {
        /**
         * The threat list matches. This might be empty if the URI is on no list.
         */
        threat?: Schema$GoogleCloudWebriskV1SearchUrisResponseThreatUri;
    }
    /**
     * Contains threat information on a matching uri.
     */
    export interface Schema$GoogleCloudWebriskV1SearchUrisResponseThreatUri {
        /**
         * The cache lifetime for the returned match. Clients must not cache this response past this timestamp to avoid false positives.
         */
        expireTime?: string | null;
        /**
         * The ThreatList this threat belongs to.
         */
        threatTypes?: string[] | null;
    }
    /**
     * Wraps a URI that might be displaying malicious content.
     */
    export interface Schema$GoogleCloudWebriskV1Submission {
        /**
         * Required. The URI that is being reported for malicious content to be analyzed.
         */
        uri?: string | null;
    }
    /**
     * Contains the set of entries to add to a local database. May contain a combination of compressed and raw data in a single response.
     */
    export interface Schema$GoogleCloudWebriskV1ThreatEntryAdditions {
        /**
         * The raw SHA256-formatted entries. Repeated to allow returning sets of hashes with different prefix sizes.
         */
        rawHashes?: Schema$GoogleCloudWebriskV1RawHashes[];
        /**
         * The encoded 4-byte prefixes of SHA256-formatted entries, using a Golomb-Rice encoding. The hashes are converted to uint32, sorted in ascending order, then delta encoded and stored as encoded_data.
         */
        riceHashes?: Schema$GoogleCloudWebriskV1RiceDeltaEncoding;
    }
    /**
     * Contains the set of entries to remove from a local database.
     */
    export interface Schema$GoogleCloudWebriskV1ThreatEntryRemovals {
        /**
         * The raw removal indices for a local list.
         */
        rawIndices?: Schema$GoogleCloudWebriskV1RawIndices;
        /**
         * The encoded local, lexicographically-sorted list indices, using a Golomb-Rice encoding. Used for sending compressed removal indices. The removal indices (uint32) are sorted in ascending order, then delta encoded and stored as encoded_data.
         */
        riceIndices?: Schema$GoogleCloudWebriskV1RiceDeltaEncoding;
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
         * Contains a `SubmitUriMetadata` object.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Matches the `/v1/{project-name\}/operations/{operation-id\}` pattern.
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
    export class Resource$Hashes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the full hashes that match the requested hash prefix. This is used after a hash prefix is looked up in a threatList and there is a match. The client side threatList only holds partial hashes so the client must query this method to determine if there is a full hash match of a threat.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Hashes$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Hashes$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudWebriskV1SearchHashesResponse>>;
        search(params: Params$Resource$Hashes$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Hashes$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchHashesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchHashesResponse>): void;
        search(params: Params$Resource$Hashes$Search, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchHashesResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchHashesResponse>): void;
    }
    export interface Params$Resource$Hashes$Search extends StandardParameters {
        /**
         * A hash prefix, consisting of the most significant 4-32 bytes of a SHA256 hash. For JSON requests, this field is base64-encoded. Note that if this parameter is provided by a URI, it must be encoded using the web safe base64 variant (RFC 4648).
         */
        hashPrefix?: string;
        /**
         * Required. The ThreatLists to search in. Multiple ThreatLists may be specified.
         */
        threatTypes?: string[];
    }
    export class Resource$Projects {
        context: APIRequestContext;
        operations: Resource$Projects$Operations;
        submissions: Resource$Projects$Submissions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Operations {
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
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(params: Params$Resource$Projects$Operations$Cancel, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Operations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleLongrunningCancelOperationRequest;
    }
    export interface Params$Resource$Projects$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Operations$List extends StandardParameters {
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
    export class Resource$Projects$Submissions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Submission of a URI suspected of containing phishing content to be reviewed. If the result verifies the existence of malicious phishing content, the site will be added to the [Google's Social Engineering lists](https://support.google.com/webmasters/answer/6350487/) in order to protect users that could get exposed to this threat in the future. Only allowlisted projects can use this method during Early Access. Please reach out to Sales or your customer engineer to obtain access.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Submissions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Submissions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudWebriskV1Submission>>;
        create(params: Params$Resource$Projects$Submissions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Submissions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudWebriskV1Submission>, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1Submission>): void;
        create(params: Params$Resource$Projects$Submissions$Create, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1Submission>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1Submission>): void;
    }
    export interface Params$Resource$Projects$Submissions$Create extends StandardParameters {
        /**
         * Required. The name of the project that is making the submission. This string is in the format "projects/{project_number\}".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudWebriskV1Submission;
    }
    export class Resource$Threatlists {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the most recent threat list diffs. These diffs should be applied to a local database of hashes to keep it up-to-date. If the local database is empty or excessively out-of-date, a complete snapshot of the database will be returned. This Method only updates a single ThreatList at a time. To update multiple ThreatList databases, this method needs to be called once for each list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        computeDiff(params: Params$Resource$Threatlists$Computediff, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        computeDiff(params?: Params$Resource$Threatlists$Computediff, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse>>;
        computeDiff(params: Params$Resource$Threatlists$Computediff, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        computeDiff(params: Params$Resource$Threatlists$Computediff, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse>, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse>): void;
        computeDiff(params: Params$Resource$Threatlists$Computediff, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse>): void;
        computeDiff(callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1ComputeThreatListDiffResponse>): void;
    }
    export interface Params$Resource$Threatlists$Computediff extends StandardParameters {
        /**
         * Sets the maximum number of entries that the client is willing to have in the local database. This should be a power of 2 between 2**10 and 2**20. If zero, no database size limit is set.
         */
        'constraints.maxDatabaseEntries'?: number;
        /**
         * The maximum size in number of entries. The diff will not contain more entries than this value. This should be a power of 2 between 2**10 and 2**20. If zero, no diff size limit is set.
         */
        'constraints.maxDiffEntries'?: number;
        /**
         * The compression types supported by the client.
         */
        'constraints.supportedCompressions'?: string[];
        /**
         * Required. The threat list to update. Only a single ThreatType should be specified per request. If you want to handle multiple ThreatTypes, you must make one request per ThreatType.
         */
        threatType?: string;
        /**
         * The current version token of the client for the requested list (the client version that was received from the last successful diff). If the client does not have a version token (this is the first time calling ComputeThreatListDiff), this may be left empty and a full database snapshot will be returned.
         */
        versionToken?: string;
    }
    export class Resource$Uris {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * This method is used to check whether a URI is on a given threatList. Multiple threatLists may be searched in a single query. The response will list all requested threatLists the URI was found to match. If the URI is not found on any of the requested ThreatList an empty response will be returned.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Uris$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Uris$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudWebriskV1SearchUrisResponse>>;
        search(params: Params$Resource$Uris$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Uris$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchUrisResponse>, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchUrisResponse>): void;
        search(params: Params$Resource$Uris$Search, callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchUrisResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleCloudWebriskV1SearchUrisResponse>): void;
    }
    export interface Params$Resource$Uris$Search extends StandardParameters {
        /**
         * Required. The ThreatLists to search in. Multiple ThreatLists may be specified.
         */
        threatTypes?: string[];
        /**
         * Required. The URI to be checked for matches.
         */
        uri?: string;
    }
    export {};
}
