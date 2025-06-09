import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace bigqueryreservation_v1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1beta1';
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
     * const bigqueryreservation = google.bigqueryreservation('v1beta1');
     * ```
     */
    export class Bigqueryreservation {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An assignment allows a project to submit jobs of a certain type using slots from the specified reservation.
     */
    export interface Schema$Assignment {
        /**
         * The resource which will use the reservation. E.g. `projects/myproject`, `folders/123`, or `organizations/456`.
         */
        assignee?: string | null;
        /**
         * Which type of jobs will use the reservation.
         */
        jobType?: string | null;
        /**
         * Output only. Name of the resource. E.g.: `projects/myproject/locations/US/reservations/team1-prod/assignments/123`. The assignment_id must only contain lower case alphanumeric characters or dashes and the max length is 64 characters.
         */
        name?: string | null;
        /**
         * Output only. State of the assignment.
         */
        state?: string | null;
    }
    /**
     * Represents a BI Reservation.
     */
    export interface Schema$BiReservation {
        /**
         * The resource name of the singleton BI reservation. Reservation names have the form `projects/{project_id\}/locations/{location_id\}/biReservation`.
         */
        name?: string | null;
        /**
         * Preferred tables to use BI capacity for.
         */
        preferredTables?: Schema$TableReference[];
        /**
         * Size of a reservation, in bytes.
         */
        size?: string | null;
        /**
         * Output only. The last update timestamp of a reservation.
         */
        updateTime?: string | null;
    }
    /**
     * Capacity commitment is a way to purchase compute capacity for BigQuery jobs (in the form of slots) with some committed period of usage. Annual commitments renew by default. Commitments can be removed after their commitment end time passes. In order to remove annual commitment, its plan needs to be changed to monthly or flex first. A capacity commitment resource exists as a child resource of the admin project.
     */
    export interface Schema$CapacityCommitment {
        /**
         * Output only. The end of the current commitment period. It is applicable only for ACTIVE capacity commitments.
         */
        commitmentEndTime?: string | null;
        /**
         * Output only. The start of the current commitment period. It is applicable only for ACTIVE capacity commitments.
         */
        commitmentStartTime?: string | null;
        /**
         * Output only. For FAILED commitment plan, provides the reason of failure.
         */
        failureStatus?: Schema$Status;
        /**
         * Applicable only for commitments located within one of the BigQuery multi-regions (US or EU). If set to true, this commitment is placed in the organization's secondary region which is designated for disaster recovery purposes. If false, this commitment is placed in the organization's default region.
         */
        multiRegionAuxiliary?: boolean | null;
        /**
         * Output only. The resource name of the capacity commitment, e.g., `projects/myproject/locations/US/capacityCommitments/123` The commitment_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         */
        name?: string | null;
        /**
         * Capacity commitment commitment plan.
         */
        plan?: string | null;
        /**
         * The plan this capacity commitment is converted to after commitment_end_time passes. Once the plan is changed, committed period is extended according to commitment plan. Only applicable for ANNUAL commitments.
         */
        renewalPlan?: string | null;
        /**
         * Number of slots in this commitment.
         */
        slotCount?: string | null;
        /**
         * Output only. State of the commitment.
         */
        state?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The response for ReservationService.ListAssignments.
     */
    export interface Schema$ListAssignmentsResponse {
        /**
         * List of assignments visible to the user.
         */
        assignments?: Schema$Assignment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response for ReservationService.ListCapacityCommitments.
     */
    export interface Schema$ListCapacityCommitmentsResponse {
        /**
         * List of capacity commitments visible to the user.
         */
        capacityCommitments?: Schema$CapacityCommitment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
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
     * The request for ReservationService.MergeCapacityCommitments.
     */
    export interface Schema$MergeCapacityCommitmentsRequest {
        /**
         * Ids of capacity commitments to merge. These capacity commitments must exist under admin project and location specified in the parent. ID is the last portion of capacity commitment name e.g., 'abc' for projects/myproject/locations/US/capacityCommitments/abc
         */
        capacityCommitmentIds?: string[] | null;
    }
    /**
     * The request for ReservationService.MoveAssignment. **Note**: "bigquery.reservationAssignments.create" permission is required on the destination_id. **Note**: "bigquery.reservationAssignments.create" and "bigquery.reservationAssignments.delete" permission are required on the related assignee.
     */
    export interface Schema$MoveAssignmentRequest {
        /**
         * The new reservation ID, e.g.: `projects/myotherproject/locations/US/reservations/team2-prod`
         */
        destinationId?: string | null;
    }
    /**
     * A reservation is a mechanism used to guarantee slots to users.
     */
    export interface Schema$Reservation {
        /**
         * Maximum number of queries that are allowed to run concurrently in this reservation. This is a soft limit due to asynchronous nature of the system and various optimizations for small queries. Default value is 0 which means that concurrency will be automatically set based on the reservation size.
         */
        concurrency?: string | null;
        /**
         * Output only. Creation time of the reservation.
         */
        creationTime?: string | null;
        /**
         * If false, any query or pipeline job using this reservation will use idle slots from other reservations within the same admin project. If true, a query or pipeline job using this reservation will execute with the slot capacity specified in the slot_capacity field at most.
         */
        ignoreIdleSlots?: boolean | null;
        /**
         * Applicable only for reservations located within one of the BigQuery multi-regions (US or EU). If set to true, this reservation is placed in the organization's secondary region which is designated for disaster recovery purposes. If false, this reservation is placed in the organization's default region.
         */
        multiRegionAuxiliary?: boolean | null;
        /**
         * The resource name of the reservation, e.g., `projects/x/locations/x/reservations/team1-prod`. The reservation_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         */
        name?: string | null;
        /**
         * Minimum slots available to this reservation. A slot is a unit of computational power in BigQuery, and serves as the unit of parallelism. Queries using this reservation might use more slots during runtime if ignore_idle_slots is set to false. If the new reservation's slot capacity exceeds the project's slot capacity or if total slot capacity of the new reservation and its siblings exceeds the project's slot capacity, the request will fail with `google.rpc.Code.RESOURCE_EXHAUSTED`. NOTE: for reservations in US or EU multi-regions, slot capacity constraints are checked separately for default and auxiliary regions. See multi_region_auxiliary flag for more details.
         */
        slotCapacity?: string | null;
        /**
         * Output only. Last update time of the reservation.
         */
        updateTime?: string | null;
    }
    /**
     * The response for ReservationService.SearchAssignments.
     */
    export interface Schema$SearchAssignmentsResponse {
        /**
         * List of assignments visible to the user.
         */
        assignments?: Schema$Assignment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The request for ReservationService.SplitCapacityCommitment.
     */
    export interface Schema$SplitCapacityCommitmentRequest {
        /**
         * Number of slots in the capacity commitment after the split.
         */
        slotCount?: string | null;
    }
    /**
     * The response for ReservationService.SplitCapacityCommitment.
     */
    export interface Schema$SplitCapacityCommitmentResponse {
        /**
         * First capacity commitment, result of a split.
         */
        first?: Schema$CapacityCommitment;
        /**
         * Second capacity commitment, result of a split.
         */
        second?: Schema$CapacityCommitment;
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
     * Fully qualified reference to BigQuery table. Internally stored as google.cloud.bi.v1.BqTableReference.
     */
    export interface Schema$TableReference {
        /**
         * The ID of the dataset in the above project.
         */
        datasetId?: string | null;
        /**
         * The assigned project ID of the project.
         */
        projectId?: string | null;
        /**
         * The ID of the table in the above dataset.
         */
        tableId?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        capacityCommitments: Resource$Projects$Locations$Capacitycommitments;
        reservations: Resource$Projects$Locations$Reservations;
        constructor(context: APIRequestContext);
        /**
         * Retrieves a BI reservation.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res = await bigqueryreservation.projects.locations.getBiReservation({
         *     // Required. Name of the requested reservation, for example: `projects/{project_id\}/locations/{location_id\}/biReservation`
         *     name: 'projects/my-project/locations/my-location/biReservation',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "preferredTables": [],
         *   //   "size": "my_size",
         *   //   "updateTime": "my_updateTime"
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
        getBiReservation(params: Params$Resource$Projects$Locations$Getbireservation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getBiReservation(params?: Params$Resource$Projects$Locations$Getbireservation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BiReservation>>;
        getBiReservation(params: Params$Resource$Projects$Locations$Getbireservation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getBiReservation(params: Params$Resource$Projects$Locations$Getbireservation, options: MethodOptions | BodyResponseCallback<Schema$BiReservation>, callback: BodyResponseCallback<Schema$BiReservation>): void;
        getBiReservation(params: Params$Resource$Projects$Locations$Getbireservation, callback: BodyResponseCallback<Schema$BiReservation>): void;
        getBiReservation(callback: BodyResponseCallback<Schema$BiReservation>): void;
        /**
         * Looks up assignments for a specified resource for a particular region. If the request is about a project: 1. Assignments created on the project will be returned if they exist. 2. Otherwise assignments created on the closest ancestor will be returned. 3. Assignments for different JobTypes will all be returned. The same logic applies if the request is about a folder. If the request is about an organization, then assignments created on the organization will be returned (organization doesn't have ancestors). Comparing to ListAssignments, there are some behavior differences: 1. permission on the assignee will be verified in this API. 2. Hierarchy lookup (project-\>folder-\>organization) happens in this API. 3. Parent here is `projects/x/locations/x`, instead of `projects/x/locations/xreservations/x`. **Note** "-" cannot be used for projects nor locations.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res = await bigqueryreservation.projects.locations.searchAssignments({
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The next_page_token value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // Required. The resource name of the admin project(containing project and location), e.g.: `projects/myproject/locations/US`.
         *     parent: 'projects/my-project/locations/my-location',
         *     // Please specify resource name as assignee in the query. Examples: * `assignee=projects/myproject` * `assignee=folders/123` * `assignee=organizations/456`
         *     query: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assignments": [],
         *   //   "nextPageToken": "my_nextPageToken"
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
        searchAssignments(params: Params$Resource$Projects$Locations$Searchassignments, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchAssignments(params?: Params$Resource$Projects$Locations$Searchassignments, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchAssignmentsResponse>>;
        searchAssignments(params: Params$Resource$Projects$Locations$Searchassignments, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchAssignments(params: Params$Resource$Projects$Locations$Searchassignments, options: MethodOptions | BodyResponseCallback<Schema$SearchAssignmentsResponse>, callback: BodyResponseCallback<Schema$SearchAssignmentsResponse>): void;
        searchAssignments(params: Params$Resource$Projects$Locations$Searchassignments, callback: BodyResponseCallback<Schema$SearchAssignmentsResponse>): void;
        searchAssignments(callback: BodyResponseCallback<Schema$SearchAssignmentsResponse>): void;
        /**
         * Updates a BI reservation. Only fields specified in the `field_mask` are updated. A singleton BI reservation always exists with default size 0. In order to reserve BI capacity it needs to be updated to an amount greater than 0. In order to release BI capacity reservation size must be set to 0.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res = await bigqueryreservation.projects.locations.updateBiReservation({
         *     // The resource name of the singleton BI reservation. Reservation names have the form `projects/{project_id\}/locations/{location_id\}/biReservation`.
         *     name: 'projects/my-project/locations/my-location/biReservation',
         *     // A list of fields to be updated in this request.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "name": "my_name",
         *       //   "preferredTables": [],
         *       //   "size": "my_size",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "preferredTables": [],
         *   //   "size": "my_size",
         *   //   "updateTime": "my_updateTime"
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
        updateBiReservation(params: Params$Resource$Projects$Locations$Updatebireservation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateBiReservation(params?: Params$Resource$Projects$Locations$Updatebireservation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BiReservation>>;
        updateBiReservation(params: Params$Resource$Projects$Locations$Updatebireservation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateBiReservation(params: Params$Resource$Projects$Locations$Updatebireservation, options: MethodOptions | BodyResponseCallback<Schema$BiReservation>, callback: BodyResponseCallback<Schema$BiReservation>): void;
        updateBiReservation(params: Params$Resource$Projects$Locations$Updatebireservation, callback: BodyResponseCallback<Schema$BiReservation>): void;
        updateBiReservation(callback: BodyResponseCallback<Schema$BiReservation>): void;
    }
    export interface Params$Resource$Projects$Locations$Getbireservation extends StandardParameters {
        /**
         * Required. Name of the requested reservation, for example: `projects/{project_id\}/locations/{location_id\}/biReservation`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Searchassignments extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the admin project(containing project and location), e.g.: `projects/myproject/locations/US`.
         */
        parent?: string;
        /**
         * Please specify resource name as assignee in the query. Examples: * `assignee=projects/myproject` * `assignee=folders/123` * `assignee=organizations/456`
         */
        query?: string;
    }
    export interface Params$Resource$Projects$Locations$Updatebireservation extends StandardParameters {
        /**
         * The resource name of the singleton BI reservation. Reservation names have the form `projects/{project_id\}/locations/{location_id\}/biReservation`.
         */
        name?: string;
        /**
         * A list of fields to be updated in this request.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BiReservation;
    }
    export class Resource$Projects$Locations$Capacitycommitments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new capacity commitment resource.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.create({
         *       // The optional capacity commitment ID. Capacity commitment name will be generated automatically if this field is empty. This field must only contain lower case alphanumeric characters or dashes. The first and last character cannot be a dash. Max length is 64 characters. NOTE: this ID won't be kept if the capacity commitment is split or merged.
         *       capacityCommitmentId: 'placeholder-value',
         *       // If true, fail the request if another project in the organization has a capacity commitment.
         *       enforceSingleAdminProjectPerOrg: 'placeholder-value',
         *       // Required. Resource name of the parent reservation. E.g., `projects/myproject/locations/US`
         *       parent: 'projects/my-project/locations/my-location',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "commitmentEndTime": "my_commitmentEndTime",
         *         //   "commitmentStartTime": "my_commitmentStartTime",
         *         //   "failureStatus": {},
         *         //   "multiRegionAuxiliary": false,
         *         //   "name": "my_name",
         *         //   "plan": "my_plan",
         *         //   "renewalPlan": "my_renewalPlan",
         *         //   "slotCount": "my_slotCount",
         *         //   "state": "my_state"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "commitmentEndTime": "my_commitmentEndTime",
         *   //   "commitmentStartTime": "my_commitmentStartTime",
         *   //   "failureStatus": {},
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "plan": "my_plan",
         *   //   "renewalPlan": "my_renewalPlan",
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
        create(params: Params$Resource$Projects$Locations$Capacitycommitments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Capacitycommitments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CapacityCommitment>>;
        create(params: Params$Resource$Projects$Locations$Capacitycommitments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Capacitycommitments$Create, options: MethodOptions | BodyResponseCallback<Schema$CapacityCommitment>, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        create(params: Params$Resource$Projects$Locations$Capacitycommitments$Create, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        create(callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        /**
         * Deletes a capacity commitment. Attempting to delete capacity commitment before its commitment_end_time will fail with the error code `google.rpc.Code.FAILED_PRECONDITION`.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.delete({
         *       // Can be used to force delete commitments even if assignments exist. Deleting commitments with assignments may cause queries to fail if they no longer have access to slots.
         *       force: 'placeholder-value',
         *       // Required. Resource name of the capacity commitment to delete. E.g., `projects/myproject/locations/US/capacityCommitments/123`
         *       name: 'projects/my-project/locations/my-location/capacityCommitments/my-capacityCommitment',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Capacitycommitments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Capacitycommitments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Capacitycommitments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Capacitycommitments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Capacitycommitments$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns information about the capacity commitment.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.get({
         *       // Required. Resource name of the capacity commitment to retrieve. E.g., `projects/myproject/locations/US/capacityCommitments/123`
         *       name: 'projects/my-project/locations/my-location/capacityCommitments/my-capacityCommitment',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "commitmentEndTime": "my_commitmentEndTime",
         *   //   "commitmentStartTime": "my_commitmentStartTime",
         *   //   "failureStatus": {},
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "plan": "my_plan",
         *   //   "renewalPlan": "my_renewalPlan",
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
        get(params: Params$Resource$Projects$Locations$Capacitycommitments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Capacitycommitments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CapacityCommitment>>;
        get(params: Params$Resource$Projects$Locations$Capacitycommitments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Capacitycommitments$Get, options: MethodOptions | BodyResponseCallback<Schema$CapacityCommitment>, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        get(params: Params$Resource$Projects$Locations$Capacitycommitments$Get, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        get(callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        /**
         * Lists all the capacity commitments for the admin project.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.list({
         *       // The maximum number of items to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous List request, if any.
         *       pageToken: 'placeholder-value',
         *       // Required. Resource name of the parent reservation. E.g., `projects/myproject/locations/US`
         *       parent: 'projects/my-project/locations/my-location',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "capacityCommitments": [],
         *   //   "nextPageToken": "my_nextPageToken"
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
        list(params: Params$Resource$Projects$Locations$Capacitycommitments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Capacitycommitments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCapacityCommitmentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Capacitycommitments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Capacitycommitments$List, options: MethodOptions | BodyResponseCallback<Schema$ListCapacityCommitmentsResponse>, callback: BodyResponseCallback<Schema$ListCapacityCommitmentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Capacitycommitments$List, callback: BodyResponseCallback<Schema$ListCapacityCommitmentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCapacityCommitmentsResponse>): void;
        /**
         * Merges capacity commitments of the same plan into a single commitment. The resulting capacity commitment has the greater commitment_end_time out of the to-be-merged capacity commitments. Attempting to merge capacity commitments of different plan will fail with the error code `google.rpc.Code.FAILED_PRECONDITION`.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.merge({
         *       // Parent resource that identifies admin project and location e.g., `projects/myproject/locations/us`
         *       parent: 'projects/my-project/locations/my-location',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "capacityCommitmentIds": []
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "commitmentEndTime": "my_commitmentEndTime",
         *   //   "commitmentStartTime": "my_commitmentStartTime",
         *   //   "failureStatus": {},
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "plan": "my_plan",
         *   //   "renewalPlan": "my_renewalPlan",
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
        merge(params: Params$Resource$Projects$Locations$Capacitycommitments$Merge, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        merge(params?: Params$Resource$Projects$Locations$Capacitycommitments$Merge, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CapacityCommitment>>;
        merge(params: Params$Resource$Projects$Locations$Capacitycommitments$Merge, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        merge(params: Params$Resource$Projects$Locations$Capacitycommitments$Merge, options: MethodOptions | BodyResponseCallback<Schema$CapacityCommitment>, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        merge(params: Params$Resource$Projects$Locations$Capacitycommitments$Merge, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        merge(callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        /**
         * Updates an existing capacity commitment. Only `plan` and `renewal_plan` fields can be updated. Plan can only be changed to a plan of a longer commitment period. Attempting to change to a plan with shorter commitment period will fail with the error code `google.rpc.Code.FAILED_PRECONDITION`.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.patch({
         *       // Output only. The resource name of the capacity commitment, e.g., `projects/myproject/locations/US/capacityCommitments/123` The commitment_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         *       name: 'projects/my-project/locations/my-location/capacityCommitments/my-capacityCommitment',
         *       // Standard field mask for the set of fields to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "commitmentEndTime": "my_commitmentEndTime",
         *         //   "commitmentStartTime": "my_commitmentStartTime",
         *         //   "failureStatus": {},
         *         //   "multiRegionAuxiliary": false,
         *         //   "name": "my_name",
         *         //   "plan": "my_plan",
         *         //   "renewalPlan": "my_renewalPlan",
         *         //   "slotCount": "my_slotCount",
         *         //   "state": "my_state"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "commitmentEndTime": "my_commitmentEndTime",
         *   //   "commitmentStartTime": "my_commitmentStartTime",
         *   //   "failureStatus": {},
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "plan": "my_plan",
         *   //   "renewalPlan": "my_renewalPlan",
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
        patch(params: Params$Resource$Projects$Locations$Capacitycommitments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Capacitycommitments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CapacityCommitment>>;
        patch(params: Params$Resource$Projects$Locations$Capacitycommitments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Capacitycommitments$Patch, options: MethodOptions | BodyResponseCallback<Schema$CapacityCommitment>, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        patch(params: Params$Resource$Projects$Locations$Capacitycommitments$Patch, callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        patch(callback: BodyResponseCallback<Schema$CapacityCommitment>): void;
        /**
         * Splits capacity commitment to two commitments of the same plan and `commitment_end_time`. A common use case is to enable downgrading commitments. For example, in order to downgrade from 10000 slots to 8000, you might split a 10000 capacity commitment into commitments of 2000 and 8000. Then, you delete the first one after the commitment end time passes.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.capacityCommitments.split({
         *       // Required. The resource name e.g.,: `projects/myproject/locations/US/capacityCommitments/123`
         *       name: 'projects/my-project/locations/my-location/capacityCommitments/my-capacityCommitment',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "slotCount": "my_slotCount"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "first": {},
         *   //   "second": {}
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
        split(params: Params$Resource$Projects$Locations$Capacitycommitments$Split, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        split(params?: Params$Resource$Projects$Locations$Capacitycommitments$Split, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SplitCapacityCommitmentResponse>>;
        split(params: Params$Resource$Projects$Locations$Capacitycommitments$Split, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        split(params: Params$Resource$Projects$Locations$Capacitycommitments$Split, options: MethodOptions | BodyResponseCallback<Schema$SplitCapacityCommitmentResponse>, callback: BodyResponseCallback<Schema$SplitCapacityCommitmentResponse>): void;
        split(params: Params$Resource$Projects$Locations$Capacitycommitments$Split, callback: BodyResponseCallback<Schema$SplitCapacityCommitmentResponse>): void;
        split(callback: BodyResponseCallback<Schema$SplitCapacityCommitmentResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Create extends StandardParameters {
        /**
         * The optional capacity commitment ID. Capacity commitment name will be generated automatically if this field is empty. This field must only contain lower case alphanumeric characters or dashes. The first and last character cannot be a dash. Max length is 64 characters. NOTE: this ID won't be kept if the capacity commitment is split or merged.
         */
        capacityCommitmentId?: string;
        /**
         * If true, fail the request if another project in the organization has a capacity commitment.
         */
        enforceSingleAdminProjectPerOrg?: boolean;
        /**
         * Required. Resource name of the parent reservation. E.g., `projects/myproject/locations/US`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CapacityCommitment;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Delete extends StandardParameters {
        /**
         * Can be used to force delete commitments even if assignments exist. Deleting commitments with assignments may cause queries to fail if they no longer have access to slots.
         */
        force?: boolean;
        /**
         * Required. Resource name of the capacity commitment to delete. E.g., `projects/myproject/locations/US/capacityCommitments/123`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Get extends StandardParameters {
        /**
         * Required. Resource name of the capacity commitment to retrieve. E.g., `projects/myproject/locations/US/capacityCommitments/123`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the parent reservation. E.g., `projects/myproject/locations/US`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Merge extends StandardParameters {
        /**
         * Parent resource that identifies admin project and location e.g., `projects/myproject/locations/us`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MergeCapacityCommitmentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the capacity commitment, e.g., `projects/myproject/locations/US/capacityCommitments/123` The commitment_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         */
        name?: string;
        /**
         * Standard field mask for the set of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CapacityCommitment;
    }
    export interface Params$Resource$Projects$Locations$Capacitycommitments$Split extends StandardParameters {
        /**
         * Required. The resource name e.g.,: `projects/myproject/locations/US/capacityCommitments/123`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SplitCapacityCommitmentRequest;
    }
    export class Resource$Projects$Locations$Reservations {
        context: APIRequestContext;
        assignments: Resource$Projects$Locations$Reservations$Assignments;
        constructor(context: APIRequestContext);
        /**
         * Creates a new reservation resource.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *     // Required. Project, location. E.g., `projects/myproject/locations/US`
         *     parent: 'projects/my-project/locations/my-location',
         *     // The reservation ID. It must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         *     reservationId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "concurrency": "my_concurrency",
         *       //   "creationTime": "my_creationTime",
         *       //   "ignoreIdleSlots": false,
         *       //   "multiRegionAuxiliary": false,
         *       //   "name": "my_name",
         *       //   "slotCapacity": "my_slotCapacity",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "concurrency": "my_concurrency",
         *   //   "creationTime": "my_creationTime",
         *   //   "ignoreIdleSlots": false,
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "updateTime": "my_updateTime"
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
         * Deletes a reservation. Returns `google.rpc.Code.FAILED_PRECONDITION` when reservation has assignments.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *     // Required. Resource name of the reservation to retrieve. E.g., `projects/myproject/locations/US/reservations/team1-prod`
         *     name: 'projects/my-project/locations/my-location/reservations/my-reservation',
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *     // Required. Resource name of the reservation to retrieve. E.g., `projects/myproject/locations/US/reservations/team1-prod`
         *     name: 'projects/my-project/locations/my-location/reservations/my-reservation',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "concurrency": "my_concurrency",
         *   //   "creationTime": "my_creationTime",
         *   //   "ignoreIdleSlots": false,
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "updateTime": "my_updateTime"
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *     // Required. The parent resource name containing project and location, e.g.: `projects/myproject/locations/US`
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
         * Updates an existing reservation resource.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *     // The resource name of the reservation, e.g., `projects/x/locations/x/reservations/team1-prod`. The reservation_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         *     name: 'projects/my-project/locations/my-location/reservations/my-reservation',
         *     // Standard field mask for the set of fields to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "concurrency": "my_concurrency",
         *       //   "creationTime": "my_creationTime",
         *       //   "ignoreIdleSlots": false,
         *       //   "multiRegionAuxiliary": false,
         *       //   "name": "my_name",
         *       //   "slotCapacity": "my_slotCapacity",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "concurrency": "my_concurrency",
         *   //   "creationTime": "my_creationTime",
         *   //   "ignoreIdleSlots": false,
         *   //   "multiRegionAuxiliary": false,
         *   //   "name": "my_name",
         *   //   "slotCapacity": "my_slotCapacity",
         *   //   "updateTime": "my_updateTime"
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
         * Required. Project, location. E.g., `projects/myproject/locations/US`
         */
        parent?: string;
        /**
         * The reservation ID. It must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
         */
        reservationId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Reservation;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Delete extends StandardParameters {
        /**
         * Required. Resource name of the reservation to retrieve. E.g., `projects/myproject/locations/US/reservations/team1-prod`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Get extends StandardParameters {
        /**
         * Required. Resource name of the reservation to retrieve. E.g., `projects/myproject/locations/US/reservations/team1-prod`
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
         * Required. The parent resource name containing project and location, e.g.: `projects/myproject/locations/US`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Patch extends StandardParameters {
        /**
         * The resource name of the reservation, e.g., `projects/x/locations/x/reservations/team1-prod`. The reservation_id must only contain lower case alphanumeric characters or dashes. It must start with a letter and must not end with a dash. Its maximum length is 64 characters.
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
    export class Resource$Projects$Locations$Reservations$Assignments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an assignment object which allows the given project to submit jobs of a certain type using slots from the specified reservation. Currently a resource (project, folder, organization) can only have one assignment per each (job_type, location) combination, and that reservation will be used for all jobs of the matching type. Different assignments can be created on different levels of the projects, folders or organization hierarchy. During query execution, the assignment is looked up at the project, folder and organization levels in that order. The first assignment found is applied to the query. When creating assignments, it does not matter if other assignments exist at higher levels. Example: * The organization `organizationA` contains two projects, `project1` and `project2`. * Assignments for all three entities (`organizationA`, `project1`, and `project2`) could all be created and mapped to the same or different reservations. "None" assignments represent an absence of the assignment. Projects assigned to None use on-demand pricing. To create a "None" assignment, use "none" as a reservation_id in the parent. Example parent: `projects/myproject/locations/US/reservations/none`. Returns `google.rpc.Code.PERMISSION_DENIED` if user does not have 'bigquery.admin' permissions on the project using the reservation and the project that owns this reservation. Returns `google.rpc.Code.INVALID_ARGUMENT` when location of the assignment does not match location of the reservation.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.reservations.assignments.create(
         *       {
         *         // The optional assignment ID. Assignment name will be generated automatically if this field is empty. This field must only contain lower case alphanumeric characters or dashes. Max length is 64 characters.
         *         assignmentId: 'placeholder-value',
         *         // Required. The parent resource name of the assignment E.g. `projects/myproject/locations/US/reservations/team1-prod`
         *         parent:
         *           'projects/my-project/locations/my-location/reservations/my-reservation',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "assignee": "my_assignee",
         *           //   "jobType": "my_jobType",
         *           //   "name": "my_name",
         *           //   "state": "my_state"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assignee": "my_assignee",
         *   //   "jobType": "my_jobType",
         *   //   "name": "my_name",
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
        create(params: Params$Resource$Projects$Locations$Reservations$Assignments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Reservations$Assignments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Assignment>>;
        create(params: Params$Resource$Projects$Locations$Reservations$Assignments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Reservations$Assignments$Create, options: MethodOptions | BodyResponseCallback<Schema$Assignment>, callback: BodyResponseCallback<Schema$Assignment>): void;
        create(params: Params$Resource$Projects$Locations$Reservations$Assignments$Create, callback: BodyResponseCallback<Schema$Assignment>): void;
        create(callback: BodyResponseCallback<Schema$Assignment>): void;
        /**
         * Deletes a assignment. No expansion will happen. Example: * Organization `organizationA` contains two projects, `project1` and `project2`. * Reservation `res1` exists and was created previously. * CreateAssignment was used previously to define the following associations between entities and reservations: `` and `` In this example, deletion of the `` assignment won't affect the other assignment ``. After said deletion, queries from `project1` will still use `res1` while queries from `project2` will switch to use on-demand mode.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.reservations.assignments.delete(
         *       {
         *         // Required. Name of the resource, e.g. `projects/myproject/locations/US/reservations/team1-prod/assignments/123`
         *         name: 'projects/my-project/locations/my-location/reservations/my-reservation/assignments/my-assignment',
         *       }
         *     );
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
        delete(params: Params$Resource$Projects$Locations$Reservations$Assignments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Reservations$Assignments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Reservations$Assignments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Assignments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Reservations$Assignments$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists assignments. Only explicitly created assignments will be returned. Example: * Organization `organizationA` contains two projects, `project1` and `project2`. * Reservation `res1` exists and was created previously. * CreateAssignment was used previously to define the following associations between entities and reservations: `` and `` In this example, ListAssignments will just return the above two assignments for reservation `res1`, and no expansion/merge will happen. The wildcard "-" can be used for reservations in the request. In that case all assignments belongs to the specified project and location will be listed. **Note** "-" cannot be used for projects nor locations.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.reservations.assignments.list({
         *       // The maximum number of items to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous List request, if any.
         *       pageToken: 'placeholder-value',
         *       // Required. The parent resource name e.g.: `projects/myproject/locations/US/reservations/team1-prod` Or: `projects/myproject/locations/US/reservations/-`
         *       parent:
         *         'projects/my-project/locations/my-location/reservations/my-reservation',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assignments": [],
         *   //   "nextPageToken": "my_nextPageToken"
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
        list(params: Params$Resource$Projects$Locations$Reservations$Assignments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Reservations$Assignments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAssignmentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Reservations$Assignments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$Assignments$List, options: MethodOptions | BodyResponseCallback<Schema$ListAssignmentsResponse>, callback: BodyResponseCallback<Schema$ListAssignmentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Reservations$Assignments$List, callback: BodyResponseCallback<Schema$ListAssignmentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAssignmentsResponse>): void;
        /**
         * Moves an assignment under a new reservation. This differs from removing an existing assignment and recreating a new one by providing a transactional change that ensures an assignee always has an associated reservation.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.reservations.assignments.move({
         *       // Required. The resource name of the assignment, e.g. `projects/myproject/locations/US/reservations/team1-prod/assignments/123`
         *       name: 'projects/my-project/locations/my-location/reservations/my-reservation/assignments/my-assignment',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "destinationId": "my_destinationId"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assignee": "my_assignee",
         *   //   "jobType": "my_jobType",
         *   //   "name": "my_name",
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
        move(params: Params$Resource$Projects$Locations$Reservations$Assignments$Move, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        move(params?: Params$Resource$Projects$Locations$Reservations$Assignments$Move, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Assignment>>;
        move(params: Params$Resource$Projects$Locations$Reservations$Assignments$Move, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        move(params: Params$Resource$Projects$Locations$Reservations$Assignments$Move, options: MethodOptions | BodyResponseCallback<Schema$Assignment>, callback: BodyResponseCallback<Schema$Assignment>): void;
        move(params: Params$Resource$Projects$Locations$Reservations$Assignments$Move, callback: BodyResponseCallback<Schema$Assignment>): void;
        move(callback: BodyResponseCallback<Schema$Assignment>): void;
        /**
         * Updates an existing assignment. Only the `priority` field can be updated.
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
         * const bigqueryreservation = google.bigqueryreservation('v1beta1');
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
         *   const res =
         *     await bigqueryreservation.projects.locations.reservations.assignments.patch(
         *       {
         *         // Output only. Name of the resource. E.g.: `projects/myproject/locations/US/reservations/team1-prod/assignments/123`. The assignment_id must only contain lower case alphanumeric characters or dashes and the max length is 64 characters.
         *         name: 'projects/my-project/locations/my-location/reservations/my-reservation/assignments/my-assignment',
         *         // Standard field mask for the set of fields to be updated.
         *         updateMask: 'placeholder-value',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "assignee": "my_assignee",
         *           //   "jobType": "my_jobType",
         *           //   "name": "my_name",
         *           //   "state": "my_state"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assignee": "my_assignee",
         *   //   "jobType": "my_jobType",
         *   //   "name": "my_name",
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
        patch(params: Params$Resource$Projects$Locations$Reservations$Assignments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Reservations$Assignments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Assignment>>;
        patch(params: Params$Resource$Projects$Locations$Reservations$Assignments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Reservations$Assignments$Patch, options: MethodOptions | BodyResponseCallback<Schema$Assignment>, callback: BodyResponseCallback<Schema$Assignment>): void;
        patch(params: Params$Resource$Projects$Locations$Reservations$Assignments$Patch, callback: BodyResponseCallback<Schema$Assignment>): void;
        patch(callback: BodyResponseCallback<Schema$Assignment>): void;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Assignments$Create extends StandardParameters {
        /**
         * The optional assignment ID. Assignment name will be generated automatically if this field is empty. This field must only contain lower case alphanumeric characters or dashes. Max length is 64 characters.
         */
        assignmentId?: string;
        /**
         * Required. The parent resource name of the assignment E.g. `projects/myproject/locations/US/reservations/team1-prod`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Assignment;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Assignments$Delete extends StandardParameters {
        /**
         * Required. Name of the resource, e.g. `projects/myproject/locations/US/reservations/team1-prod/assignments/123`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Assignments$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name e.g.: `projects/myproject/locations/US/reservations/team1-prod` Or: `projects/myproject/locations/US/reservations/-`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Assignments$Move extends StandardParameters {
        /**
         * Required. The resource name of the assignment, e.g. `projects/myproject/locations/US/reservations/team1-prod/assignments/123`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MoveAssignmentRequest;
    }
    export interface Params$Resource$Projects$Locations$Reservations$Assignments$Patch extends StandardParameters {
        /**
         * Output only. Name of the resource. E.g.: `projects/myproject/locations/US/reservations/team1-prod/assignments/123`. The assignment_id must only contain lower case alphanumeric characters or dashes and the max length is 64 characters.
         */
        name?: string;
        /**
         * Standard field mask for the set of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Assignment;
    }
    export {};
}
