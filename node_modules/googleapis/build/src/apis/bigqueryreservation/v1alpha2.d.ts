import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace bigqueryreservation_v1alpha2 {
    export interface Options extends GlobalOptions {
        version: 'v1alpha2';
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
     * BigQuery Reservation API
     *
     * A service to modify your BigQuery flat-rate reservations.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
     * ```
     */
    export class Bigqueryreservation {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The metadata for operation returned from ReservationService.CreateSlotPool.
     */
    export interface Schema$CreateSlotPoolMetadata {
        /**
         * Resource name of the slot pool that is being created. E.g., projects/myproject/locations/us-central1/reservations/foo/slotPools/123
         */
        slotPool?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * The response for ReservationService.ListReservationGrants.
     */
    export interface Schema$ListReservationGrantsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * List of reservation grants visible to the user.
         */
        reservationGrants?: Schema$ReservationGrant[];
    }
    /**
     * The response for ReservationService.ListReservations.
     */
    export interface Schema$ListReservationsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * List of reservations visible to the user.
         */
        reservations?: Schema$Reservation[];
    }
    /**
     * The response for ReservationService.ListSlotPools.
     */
    export interface Schema$ListSlotPoolsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * List of slot pools visible to the user.
         */
        slotPools?: Schema$SlotPool[];
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
     * A reservation is a mechanism used to guarantee slots to users.
     */
    export interface Schema$Reservation {
        /**
         * The resource name of the reservation, e.g., "projects/x/locations/x/reservations/dev/team/product". Reservation names (e.g., "dev/team/product") exceeding a depth of six will fail with `google.rpc.Code.INVALID_ARGUMENT`.
         */
        name?: string | null;
        /**
         * Maximum slots available to this reservation and its children. A slot is a unit of computational power in BigQuery, and serves as the unit of parallelism. In a scan of a multi-partitioned table, a single slot operates on a single partition of the table. If the new reservation's slot capacity exceed the parent's slot capacity or if total slot capacity of the new reservation and its siblings exceeds the parent's slot capacity, the request will fail with `google.rpc.Code.RESOURCE_EXHAUSTED`.
         */
        slotCapacity?: string | null;
        /**
         * If true, any query using this reservation will also be submitted to the parent reservation. This allows the query to share the additional slot capacity of the parent with other queries in the parent reservation. If the parent also has this field set to true, then this process will continue until it encounters a reservation for which this is false. If false, a query using this reservation will execute with the maximum slot capacity as specified above. If not specified, default value is true. Ignored for top-level reservation.
         */
        useParentReservation?: boolean | null;
    }
    /**
     * A ReservationGrant allows a project to submit jobs of a certain type using slots from the specified reservation.
     */
    export interface Schema$ReservationGrant {
        /**
         * The resource which will use the reservation. E.g. projects/myproject, folders/123, organizations/456.
         */
        grantee?: string | null;
        /**
         * Which type of jobs will use the reservation.
         */
        jobType?: string | null;
        /**
         * Output only. Name of the resource. E.g.: projects/myproject/locations/eu/reservationGrants/123.
         */
        name?: string | null;
        /**
         * Resource name of the reservation. E.g., projects/myproject/locations/eu/reservations/my_reservation. This reservation must be in the same location as the grant. This reservation should belong to the same parent project.
         */
        reservation?: string | null;
        /**
         * Output only. State of the ReservationGrant.
         */
        state?: string | null;
    }
    /**
     * The response for ReservationService.SearchReservationGrants.
     */
    export interface Schema$SearchReservationGrantsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * List of reservation grants visible to the user.
         */
        reservationGrants?: Schema$ReservationGrant[];
    }
    /**
     * Slot pool is a way to purchase slots with some minimum committed period of usage. Slot pool is immutable and cannot be deleted until the end of the commitment period. After the end of the commitment period, slots are still available but can be freely removed any time. Annual commitments will automatically be downgraded to monthly after the commitment ends. A slot pool resource exists as a child resource of a top-level reservation. Sum of all the ACTIVE pools slot_count is always equal to the reservation slot_capacity.
     */
    export interface Schema$SlotPool {
        /**
         * Output only. The end of the commitment period. Slot pool cannot be removed before commitment_end_time. It is applicable only for ACTIVE slot pools and is computed as a combination of the plan and the time when the slot pool became ACTIVE.
         */
        commitmentEndTime?: string | null;
        /**
         * Output only. For FAILED slot pool, provides the reason of failure.
         */
        failureStatus?: Schema$Status;
        /**
         * Output only. The resource name of the slot pool, e.g., projects/myproject/locations/us-central1/reservations/myreservation/slotPools/123
         */
        name?: string | null;
        /**
         * Slot pool commitment plan.
         */
        plan?: string | null;
        /**
         * Number of slots in this pool.
         */
        slotCount?: string | null;
        /**
         * Output only.
         */
        state?: string | null;
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
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Operations;
        reservationGrants: Resource$Projects$Locations$Reservationgrants;
        reservations: Resource$Projects$Locations$Reservations;
        constructor(context: APIRequestContext);
        /**
         * Look up grants for a specified resource for a particular region. If the request is about a project: 1) Grants created on the project will be returned if they exist. 2) Otherwise grants created on the closest ancestor will be returned. 3) Grants for different JobTypes will all be returned. Same logic applies if the request is about a folder. If the request is about an organization, then grants created on the organization will be returned (organization doesn't have ancestors). Comparing to ListReservationGrants, there are two behavior differences: 1) permission on the grantee will be verified in this API. 2) Hierarchy lookup (project-\>folder-\>organization) happens in this API.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.searchReservationGrants(
         *     {
         *       // The maximum number of items to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous List request, if any.
         *       pageToken: 'placeholder-value',
         *       // The parent resource name (containing project and location), which owns the grants. e.g.: "projects/myproject/locations/us-central1".
         *       parent: 'projects/my-project/locations/my-location',
         *       // Please specify resource name as grantee in the query. e.g., "grantee=projects/myproject" "grantee=folders/123" "grantee=organizations/456"
         *       query: 'placeholder-value',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "reservationGrants": []
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
        searchReservationGrants(params: Params$Resource$Projects$Locations$Searchreservationgrants, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchReservationGrants(params?: Params$Resource$Projects$Locations$Searchreservationgrants, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchReservationGrantsResponse>>;
        searchReservationGrants(params: Params$Resource$Projects$Locations$Searchreservationgrants, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchReservationGrants(params: Params$Resource$Projects$Locations$Searchreservationgrants, options: MethodOptions | BodyResponseCallback<Schema$SearchReservationGrantsResponse>, callback: BodyResponseCallback<Schema$SearchReservationGrantsResponse>): void;
        searchReservationGrants(params: Params$Resource$Projects$Locations$Searchreservationgrants, callback: BodyResponseCallback<Schema$SearchReservationGrantsResponse>): void;
        searchReservationGrants(callback: BodyResponseCallback<Schema$SearchReservationGrantsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Searchreservationgrants extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * The parent resource name (containing project and location), which owns the grants. e.g.: "projects/myproject/locations/us-central1".
         */
        parent?: string;
        /**
         * Please specify resource name as grantee in the query. e.g., "grantee=projects/myproject" "grantee=folders/123" "grantee=organizations/456"
         */
        query?: string;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.operations.cancel({
         *     // The name of the operation resource to be cancelled.
         *     name: 'projects/my-project/locations/my-location/operations/my-operation',
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
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.operations.get({
         *     // The name of the operation resource.
         *     name: 'projects/my-project/locations/my-location/operations/my-operation',
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
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Reservationgrants {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns `google.rpc.Code.PERMISSION_DENIED` if user does not have 'bigquery.admin' permissions on the project using the reservation and the project that owns this reservation. Returns `google.rpc.Code.INVALID_ARGUMENT` when location of the grant does not match location of the reservation.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservationGrants.create(
         *     {
         *       // The parent resource name of the reservation grant E.g.: projects/myproject/location/eu.
         *       parent: 'projects/my-project/locations/my-location',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "grantee": "my_grantee",
         *         //   "jobType": "my_jobType",
         *         //   "name": "my_name",
         *         //   "reservation": "my_reservation",
         *         //   "state": "my_state"
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "grantee": "my_grantee",
         *   //   "jobType": "my_jobType",
         *   //   "name": "my_name",
         *   //   "reservation": "my_reservation",
         *   //   "state": "my_state"
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
        create(params: Params$Resource$Projects$Locations$Reservationgrants$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Reservationgrants$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReservationGrant>>;
        create(params: Params$Resource$Projects$Locations$Reservationgrants$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Reservationgrants$Create, options: MethodOptions | BodyResponseCallback<Schema$ReservationGrant>, callback: BodyResponseCallback<Schema$ReservationGrant>): void;
        create(params: Params$Resource$Projects$Locations$Reservationgrants$Create, callback: BodyResponseCallback<Schema$ReservationGrant>): void;
        create(callback: BodyResponseCallback<Schema$ReservationGrant>): void;
        /**
         * Deletes a reservation grant. No expansion will happen. E.g: organizationA contains project1 and project2. Reservation res1 exists. CreateReservationGrant was invoked previously and following grants were created explicitly: Then deletion of won't affect . After deletion of , queries from project1 will still use res1, while queries from project2 will use on-demand mode.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservationGrants.delete(
         *     {
         *       // Name of the resource, e.g.: projects/myproject/locations/eu/reservationGrants/123
         *       name:
         *         'projects/my-project/locations/my-location/reservationGrants/my-reservationGrant',
         *     }
         *   );
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
        delete(params: Params$Resource$Projects$Locations$Reservationgrants$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Reservationgrants$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Reservationgrants$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Reservationgrants$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Reservationgrants$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists reservation grants. Only explicitly created grants will be returned. E.g: organizationA contains project1 and project2. Reservation res1 exists. CreateReservationGrant was invoked previously and following grants were created explicitly: Then this API will just return the above two grants for reservation res1, and no expansion/merge will happen.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservationGrants.list(
         *     {
         *       // The maximum number of items to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous List request, if any.
         *       pageToken: 'placeholder-value',
         *       // The parent resource name e.g.: projects/myproject/location/eu.
         *       parent: 'projects/my-project/locations/my-location',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "reservationGrants": []
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
        list(params: Params$Resource$Projects$Locations$Reservationgrants$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Reservationgrants$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListReservationGrantsResponse>>;
        list(params: Params$Resource$Projects$Locations$Reservationgrants$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Reservationgrants$List, options: MethodOptions | BodyResponseCallback<Schema$ListReservationGrantsResponse>, callback: BodyResponseCallback<Schema$ListReservationGrantsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Reservationgrants$List, callback: BodyResponseCallback<Schema$ListReservationGrantsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListReservationGrantsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Reservationgrants$Create extends StandardParameters {
        /**
         * The parent resource name of the reservation grant E.g.: projects/myproject/location/eu.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReservationGrant;
    }
    export interface Params$Resource$Projects$Locations$Reservationgrants$Delete extends StandardParameters {
        /**
         * Name of the resource, e.g.: projects/myproject/locations/eu/reservationGrants/123
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservationgrants$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * The parent resource name e.g.: projects/myproject/location/eu.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Reservations {
        context: APIRequestContext;
        slotPools: Resource$Projects$Locations$Reservations$Slotpools;
        constructor(context: APIRequestContext);
        /**
         * Creates a new reservation resource. Multiple reservations are created if the ancestor reservations do not exist.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.create({
         *     // Project, location, and (optionally) reservation name. E.g., projects/myproject/locations/us-central1/reservations/parent
         *     parent: 'projects/my-project/locations/my-location',
         *     // The reservation ID relative to the parent, e.g., "dev". This field must only contain alphanumeric characters.
         *     reservationId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "name": "my_name",
         *       //   "slotCapacity": "my_slotCapacity",
         *       //   "useParentReservation": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "useParentReservation": false
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
        create(params: Params$Resource$Projects$Locations$Reservations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Reservations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Reservation>>;
        create(params: Params$Resource$Projects$Locations$Reservations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Reservations$Create, options: MethodOptions | BodyResponseCallback<Schema$Reservation>, callback: BodyResponseCallback<Schema$Reservation>): void;
        create(params: Params$Resource$Projects$Locations$Reservations$Create, callback: BodyResponseCallback<Schema$Reservation>): void;
        create(callback: BodyResponseCallback<Schema$Reservation>): void;
        /**
         * Creates a new reservation resource. Multiple reservations are created if the ancestor reservations do not exist.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.createReservation(
         *     {
         *       // Project, location, and (optionally) reservation name. E.g., projects/myproject/locations/us-central1/reservations/parent
         *       parent: 'projects/my-project/locations/my-location/reservations/.*',
         *       // The reservation ID relative to the parent, e.g., "dev". This field must only contain alphanumeric characters.
         *       reservationId: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "name": "my_name",
         *         //   "slotCapacity": "my_slotCapacity",
         *         //   "useParentReservation": false
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "useParentReservation": false
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
        createReservation(params: Params$Resource$Projects$Locations$Reservations$Createreservation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createReservation(params?: Params$Resource$Projects$Locations$Reservations$Createreservation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Reservation>>;
        createReservation(params: Params$Resource$Projects$Locations$Reservations$Createreservation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createReservation(params: Params$Resource$Projects$Locations$Reservations$Createreservation, options: MethodOptions | BodyResponseCallback<Schema$Reservation>, callback: BodyResponseCallback<Schema$Reservation>): void;
        createReservation(params: Params$Resource$Projects$Locations$Reservations$Createreservation, callback: BodyResponseCallback<Schema$Reservation>): void;
        createReservation(callback: BodyResponseCallback<Schema$Reservation>): void;
        /**
         * Deletes a reservation. Returns `google.rpc.Code.FAILED_PRECONDITION` in the following cases: 1. When reservation has child reservations. This check can be bypassed by setting DeleteReservationRequest.force flag to true. 2. When top-level reservation with slot pools is being deleted.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.delete({
         *     // If true, deletes all the child reservations of the given reservation. Otherwise, attempting to delete a reservation that has child reservations will fail with error code `google.rpc.Code.FAILED_PRECONDITION`.
         *     force: 'placeholder-value',
         *     // Resource name of the reservation to retrieve. E.g., projects/myproject/locations/us-central1/reservations/my_reservation
         *     name: 'projects/my-project/locations/my-location/reservations/.*',
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
        delete(params: Params$Resource$Projects$Locations$Reservations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Reservations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Reservations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about the reservation.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.get({
         *     // Resource name of the reservation to retrieve. E.g., projects/myproject/locations/us-central1/reservations/path/to/reserv
         *     name: 'projects/my-project/locations/my-location/reservations/.*',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "useParentReservation": false
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
        get(params: Params$Resource$Projects$Locations$Reservations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Reservations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Reservation>>;
        get(params: Params$Resource$Projects$Locations$Reservations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Reservations$Get, options: MethodOptions | BodyResponseCallback<Schema$Reservation>, callback: BodyResponseCallback<Schema$Reservation>): void;
        get(params: Params$Resource$Projects$Locations$Reservations$Get, callback: BodyResponseCallback<Schema$Reservation>): void;
        get(callback: BodyResponseCallback<Schema$Reservation>): void;
        /**
         * Lists all the reservations for the project in the specified location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.list({
         *     // Can be used to filter out reservations based on names, capacity, etc, e.g.: filter="reservation.slot_capacity \> 200" filter="reservation.name = \"*dev/x\"" Advanced filtering syntax can be [here](https://cloud.google.com/logging/docs/view/advanced-filters).
         *     filter: 'placeholder-value',
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The next_page_token value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // The parent resource name containing project and location, e.g.: "projects/myproject/locations/us-central1"
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "reservations": []
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
        list(params: Params$Resource$Projects$Locations$Reservations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Reservations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListReservationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Reservations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$List, options: MethodOptions | BodyResponseCallback<Schema$ListReservationsResponse>, callback: BodyResponseCallback<Schema$ListReservationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$List, callback: BodyResponseCallback<Schema$ListReservationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListReservationsResponse>): void;
        /**
         * Updates an existing reservation resource. Applicable only for child reservations.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.patch({
         *     // The resource name of the reservation, e.g., "projects/x/locations/x/reservations/dev/team/product". Reservation names (e.g., "dev/team/product") exceeding a depth of six will fail with `google.rpc.Code.INVALID_ARGUMENT`.
         *     name:
         *       'projects/my-project/locations/my-location/reservations/my-reservation/.*',
         *     // Standard field mask for the set of fields to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "name": "my_name",
         *       //   "slotCapacity": "my_slotCapacity",
         *       //   "useParentReservation": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "useParentReservation": false
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
        patch(params: Params$Resource$Projects$Locations$Reservations$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Reservations$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Reservation>>;
        patch(params: Params$Resource$Projects$Locations$Reservations$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Reservations$Patch, options: MethodOptions | BodyResponseCallback<Schema$Reservation>, callback: BodyResponseCallback<Schema$Reservation>): void;
        patch(params: Params$Resource$Projects$Locations$Reservations$Patch, callback: BodyResponseCallback<Schema$Reservation>): void;
        patch(callback: BodyResponseCallback<Schema$Reservation>): void;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Create extends StandardParameters {
        /**
         * Project, location, and (optionally) reservation name. E.g., projects/myproject/locations/us-central1/reservations/parent
         */
        parent?: string;
        /**
         * The reservation ID relative to the parent, e.g., "dev". This field must only contain alphanumeric characters.
         */
        reservationId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Reservation;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Createreservation extends StandardParameters {
        /**
         * Project, location, and (optionally) reservation name. E.g., projects/myproject/locations/us-central1/reservations/parent
         */
        parent?: string;
        /**
         * The reservation ID relative to the parent, e.g., "dev". This field must only contain alphanumeric characters.
         */
        reservationId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Reservation;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Delete extends StandardParameters {
        /**
         * If true, deletes all the child reservations of the given reservation. Otherwise, attempting to delete a reservation that has child reservations will fail with error code `google.rpc.Code.FAILED_PRECONDITION`.
         */
        force?: boolean;
        /**
         * Resource name of the reservation to retrieve. E.g., projects/myproject/locations/us-central1/reservations/my_reservation
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Get extends StandardParameters {
        /**
         * Resource name of the reservation to retrieve. E.g., projects/myproject/locations/us-central1/reservations/path/to/reserv
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$List extends StandardParameters {
        /**
         * Can be used to filter out reservations based on names, capacity, etc, e.g.: filter="reservation.slot_capacity \> 200" filter="reservation.name = \"*dev/x\"" Advanced filtering syntax can be [here](https://cloud.google.com/logging/docs/view/advanced-filters).
         */
        filter?: string;
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * The parent resource name containing project and location, e.g.: "projects/myproject/locations/us-central1"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Patch extends StandardParameters {
        /**
         * The resource name of the reservation, e.g., "projects/x/locations/x/reservations/dev/team/product". Reservation names (e.g., "dev/team/product") exceeding a depth of six will fail with `google.rpc.Code.INVALID_ARGUMENT`.
         */
        name?: string;
        /**
         * Standard field mask for the set of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Reservation;
    }
    export class Resource$Projects$Locations$Reservations$Slotpools {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a slot pool. Attempting to delete slot pool before its commitment_end_time will fail with the error code `google.rpc.Code.FAILED_PRECONDITION`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.slotPools.delete(
         *     {
         *       // Resource name of the slot pool to delete. E.g., projects/myproject/locations/us-central1/reservations/my_reservation/slotPools/123
         *       name:
         *         'projects/my-project/locations/my-location/reservations/my-reservation/slotPools/my-slotPool',
         *     }
         *   );
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
        delete(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Reservations$Slotpools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about the slot pool.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.slotPools.get(
         *     {
         *       // Resource name of the slot pool to retrieve. E.g., projects/myproject/locations/us-central1/reservations/my_reservation/slotPools/123
         *       name:
         *         'projects/my-project/locations/my-location/reservations/my-reservation/slotPools/my-slotPool',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "commitmentEndTime": "my_commitmentEndTime",
         *   //   "failureStatus": {},
         *   //   "name": "my_name",
         *   //   "plan": "my_plan",
         *   //   "slotCount": "my_slotCount",
         *   //   "state": "my_state"
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
        get(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Reservations$Slotpools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SlotPool>>;
        get(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Get, options: MethodOptions | BodyResponseCallback<Schema$SlotPool>, callback: BodyResponseCallback<Schema$SlotPool>): void;
        get(params: Params$Resource$Projects$Locations$Reservations$Slotpools$Get, callback: BodyResponseCallback<Schema$SlotPool>): void;
        get(callback: BodyResponseCallback<Schema$SlotPool>): void;
        /**
         * Lists all the slot pools for the reservation.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/bigqueryreservation.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const bigqueryreservation = google.bigqueryreservation('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/bigquery',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await bigqueryreservation.projects.locations.reservations.slotPools.list(
         *     {
         *       // The maximum number of items to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous List request, if any.
         *       pageToken: 'placeholder-value',
         *       // Resource name of the parent reservation. Only top-level reservations can have slot pools. E.g., projects/myproject/locations/us-central1/reservations/my_reservation
         *       parent:
         *         'projects/my-project/locations/my-location/reservations/my-reservation',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "slotPools": []
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
        list(params: Params$Resource$Projects$Locations$Reservations$Slotpools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Reservations$Slotpools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSlotPoolsResponse>>;
        list(params: Params$Resource$Projects$Locations$Reservations$Slotpools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$Slotpools$List, options: MethodOptions | BodyResponseCallback<Schema$ListSlotPoolsResponse>, callback: BodyResponseCallback<Schema$ListSlotPoolsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$Slotpools$List, callback: BodyResponseCallback<Schema$ListSlotPoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSlotPoolsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Slotpools$Delete extends StandardParameters {
        /**
         * Resource name of the slot pool to delete. E.g., projects/myproject/locations/us-central1/reservations/my_reservation/slotPools/123
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Slotpools$Get extends StandardParameters {
        /**
         * Resource name of the slot pool to retrieve. E.g., projects/myproject/locations/us-central1/reservations/my_reservation/slotPools/123
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Slotpools$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Resource name of the parent reservation. Only top-level reservations can have slot pools. E.g., projects/myproject/locations/us-central1/reservations/my_reservation
         */
        parent?: string;
    }
    export {};
}
