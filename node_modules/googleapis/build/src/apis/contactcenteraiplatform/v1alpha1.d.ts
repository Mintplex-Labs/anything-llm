import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace contactcenteraiplatform_v1alpha1 {
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
     * Contact Center AI Platform API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const contactcenteraiplatform = google.contactcenteraiplatform('v1alpha1');
     * ```
     */
    export class Contactcenteraiplatform {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Message storing info about the first admin user. Next ID: 3
     */
    export interface Schema$AdminUser {
        /**
         * Optional. Last/family name of the first admin user.
         */
        familyName?: string | null;
        /**
         * Optional. First/given name of the first admin user.
         */
        givenName?: string | null;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Defines a logical CCAIP component that e.g. “EMAIL”, "CRM". For more information see go/ccaip-private-path-v2. Each logical component is associated with a list of service attachments.
     */
    export interface Schema$Component {
        /**
         * Name of the component.
         */
        name?: string | null;
        /**
         * Associated service attachments. The service attachment names that will be used for sending private traffic to the CCAIP tenant project. Example service attachment name: "projects/${TENANT_PROJECT_ID\}/regions/${REGION\}/serviceAttachments/ingress-default".
         */
        serviceAttachmentNames?: string[] | null;
    }
    /**
     * Message describing ContactCenter object
     */
    export interface Schema$ContactCenter {
        /**
         * Optional. Info about the first admin user, such as given name and family name.
         */
        adminUser?: Schema$AdminUser;
        /**
         * Optional. Whether the advanced reporting feature is enabled.
         */
        advancedReportingEnabled?: boolean | null;
        /**
         * Optional. Whether to enable users to be created in the CCAIP-instance concurrently to having users in Cloud identity
         */
        ccaipManagedUsers?: boolean | null;
        /**
         * Output only. [Output only] Create time stamp
         */
        createTime?: string | null;
        /**
         * Optional. Critical release channel.
         */
        critical?: Schema$Critical;
        /**
         * Required. Immutable. At least 2 and max 16 char long, must conform to [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt).
         */
        customerDomainPrefix?: string | null;
        /**
         * Required. A user friendly name for the ContactCenter.
         */
        displayName?: string | null;
        /**
         * Optional. Early release channel.
         */
        early?: Schema$Early;
        /**
         * The configuration of this instance, it is currently immutable once created.
         */
        instanceConfig?: Schema$InstanceConfig;
        /**
         * Immutable. The KMS key name to encrypt the user input (`ContactCenter`).
         */
        kmsKey?: string | null;
        /**
         * Labels as key value pairs
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * name of resource
         */
        name?: string | null;
        /**
         * Optional. Normal release channel.
         */
        normal?: Schema$Normal;
        /**
         * Optional. VPC-SC related networking configuration.
         */
        privateAccess?: Schema$PrivateAccess;
        /**
         * Output only. TODO(b/283407860) Deprecate this field.
         */
        privateComponents?: string[] | null;
        /**
         * Optional. Params that sets up Google as IdP.
         */
        samlParams?: Schema$SAMLParams;
        /**
         * Output only. The state of this contact center.
         */
        state?: string | null;
        /**
         * Output only. [Output only] Update time stamp
         */
        updateTime?: string | null;
        /**
         * Output only. URIs to access the deployed ContactCenters.
         */
        uris?: Schema$URIs;
        /**
         * Optional. Email address of the first admin user.
         */
        userEmail?: string | null;
    }
    /**
     * Represents a quota for contact centers.
     */
    export interface Schema$ContactCenterQuota {
        /**
         * Deprecated: Use the Quota fields instead. Reflects the count limit of contact centers on a billing account.
         */
        contactCenterCountLimit?: number | null;
        /**
         * Deprecated: Use the Quota fields instead. Reflects the count sum of contact centers on a billing account.
         */
        contactCenterCountSum?: number | null;
        /**
         * Quota details per contact center instance type.
         */
        quotas?: Schema$Quota[];
    }
    /**
     * Instances in this Channel will receive updates after all instances in `Normal` were updated. They also will only be updated outside of their peak hours.
     */
    export interface Schema$Critical {
        /**
         * Required. Hours during which the instance should not be updated.
         */
        peakHours?: Schema$WeeklySchedule[];
    }
    /**
     * LINT.IfChange First Channel to receive the updates. Meant to dev/test instances
     */
    export interface Schema$Early {
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$GoogleCloudCommonOperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have been cancelled successfully have google.longrunning.Operation.error value with a google.rpc.Status.code of `1`, corresponding to `Code.CANCELLED`.
         */
        cancelRequested?: boolean | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Human-readable status of the operation, if any.
         */
        statusDetail?: string | null;
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
     * Message storing the instance configuration.
     */
    export interface Schema$InstanceConfig {
        /**
         * The instance size of this the instance configuration.
         */
        instanceSize?: string | null;
    }
    /**
     * Message for response to listing ContactCenters
     */
    export interface Schema$ListContactCentersResponse {
        /**
         * The list of ContactCenter
         */
        contactCenters?: Schema$ContactCenter[];
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
     * Instances in this Channel will receive updates after all instances in `Early` were updated + 2 days.
     */
    export interface Schema$Normal {
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
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Contact center information for this request
         */
        contactCenter?: Schema$ContactCenter;
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
     * Defines ingress and egress private traffic settings for CCAIP instances.
     */
    export interface Schema$PrivateAccess {
        /**
         * List of egress components that should not be accessed via the Internet. For more information see go/ccaip-private-path-v2.
         */
        egressSettings?: Schema$Component[];
        /**
         * List of ingress components that should not be accessed via the Internet. For more information see go/ccaip-private-path-v2.
         */
        ingressSettings?: Schema$Component[];
        /**
         * Private service connect settings.
         */
        pscSetting?: Schema$PscSetting;
    }
    /**
     * Private service connect settings.
     */
    export interface Schema$PscSetting {
        /**
         * The list of project ids that are allowed to send traffic to the service attachment. This field should be filled only for the ingress components.
         */
        allowedConsumerProjectIds?: string[] | null;
        /**
         * Output only. The CCAIP tenant project ids.
         */
        producerProjectIds?: string[] | null;
    }
    /**
     * Quota details.
     */
    export interface Schema$Quota {
        /**
         * Reflects the count limit of contact centers on a billing account.
         */
        contactCenterCountLimit?: number | null;
        /**
         * Reflects the count sum of contact centers on a billing account.
         */
        contactCenterCountSum?: number | null;
        /**
         * Contact center instance type.
         */
        contactCenterInstanceSize?: string | null;
    }
    /**
     * Message storing SAML params to enable Google as IDP.
     */
    export interface Schema$SAMLParams {
        /**
         * Additional contexts used for authentication.
         */
        authenticationContexts?: string[] | null;
        /**
         * SAML certificate
         */
        certificate?: string | null;
        /**
         * IdP field that maps to the user’s email address
         */
        emailMapping?: string | null;
        /**
         * Entity id URL
         */
        entityId?: string | null;
        /**
         * Single sign-on URL
         */
        ssoUri?: string | null;
        /**
         * Email address of the first admin users.
         */
        userEmail?: string | null;
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
     * Represents a time of day. The date and time zone are either not significant or are specified elsewhere. An API may choose to allow leap seconds. Related types are google.type.Date and `google.protobuf.Timestamp`.
     */
    export interface Schema$TimeOfDay {
        /**
         * Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.
         */
        minutes?: number | null;
        /**
         * Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.
         */
        nanos?: number | null;
        /**
         * Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
    }
    /**
     * Message storing the URIs of the ContactCenter.
     */
    export interface Schema$URIs {
        /**
         * Chat Bot Uri of the ContactCenter
         */
        chatBotUri?: string | null;
        /**
         * Media Uri of the ContactCenter.
         */
        mediaUri?: string | null;
        /**
         * Root Uri of the ContactCenter.
         */
        rootUri?: string | null;
        /**
         * Virtual Agent Streaming Service Uri of the ContactCenter.
         */
        virtualAgentStreamingServiceUri?: string | null;
    }
    /**
     * Message representing a weekly schedule.
     */
    export interface Schema$WeeklySchedule {
        /**
         * Required. Days of the week this schedule applies to.
         */
        days?: string[] | null;
        /**
         * Optional. Duration of the schedule.
         */
        duration?: string | null;
        /**
         * Optional. Daily end time of the schedule. If `end_time` is before `start_time`, the schedule will be considered as ending on the next day.
         */
        endTime?: Schema$TimeOfDay;
        /**
         * Required. Daily start time of the schedule.
         */
        startTime?: Schema$TimeOfDay;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        contactCenters: Resource$Projects$Locations$Contactcenters;
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
        /**
         * Queries the contact center quota, an aggregation over all the projects, that belongs to the billing account, which the input project belongs to.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryContactCenterQuota(params: Params$Resource$Projects$Locations$Querycontactcenterquota, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryContactCenterQuota(params?: Params$Resource$Projects$Locations$Querycontactcenterquota, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ContactCenterQuota>>;
        queryContactCenterQuota(params: Params$Resource$Projects$Locations$Querycontactcenterquota, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryContactCenterQuota(params: Params$Resource$Projects$Locations$Querycontactcenterquota, options: MethodOptions | BodyResponseCallback<Schema$ContactCenterQuota>, callback: BodyResponseCallback<Schema$ContactCenterQuota>): void;
        queryContactCenterQuota(params: Params$Resource$Projects$Locations$Querycontactcenterquota, callback: BodyResponseCallback<Schema$ContactCenterQuota>): void;
        queryContactCenterQuota(callback: BodyResponseCallback<Schema$ContactCenterQuota>): void;
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
    export interface Params$Resource$Projects$Locations$Querycontactcenterquota extends StandardParameters {
        /**
         * Required. Parent project resource id.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Contactcenters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ContactCenter in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Contactcenters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Contactcenters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Contactcenters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Contactcenters$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Contactcenters$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single ContactCenter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Contactcenters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Contactcenters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Contactcenters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Contactcenters$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Contactcenters$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single ContactCenter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Contactcenters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Contactcenters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ContactCenter>>;
        get(params: Params$Resource$Projects$Locations$Contactcenters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Contactcenters$Get, options: MethodOptions | BodyResponseCallback<Schema$ContactCenter>, callback: BodyResponseCallback<Schema$ContactCenter>): void;
        get(params: Params$Resource$Projects$Locations$Contactcenters$Get, callback: BodyResponseCallback<Schema$ContactCenter>): void;
        get(callback: BodyResponseCallback<Schema$ContactCenter>): void;
        /**
         * Lists ContactCenters in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Contactcenters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Contactcenters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListContactCentersResponse>>;
        list(params: Params$Resource$Projects$Locations$Contactcenters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Contactcenters$List, options: MethodOptions | BodyResponseCallback<Schema$ListContactCentersResponse>, callback: BodyResponseCallback<Schema$ListContactCentersResponse>): void;
        list(params: Params$Resource$Projects$Locations$Contactcenters$List, callback: BodyResponseCallback<Schema$ListContactCentersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListContactCentersResponse>): void;
        /**
         * Updates the parameters of a single ContactCenter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Contactcenters$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Contactcenters$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Contactcenters$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Contactcenters$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Contactcenters$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Contactcenters$Create extends StandardParameters {
        /**
         * Required. Id of the requesting object If auto-generating Id server-side, remove this field and contact_center_id from the method_signature of Create RPC
         */
        contactCenterId?: string;
        /**
         * Required. Value for parent.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ContactCenter;
    }
    export interface Params$Resource$Projects$Locations$Contactcenters$Delete extends StandardParameters {
        /**
         * Required. Name of the resource
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Contactcenters$Get extends StandardParameters {
        /**
         * Required. Name of the resource
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Contactcenters$List extends StandardParameters {
        /**
         * Filtering results
         */
        filter?: string;
        /**
         * Hint for how to order the results
         */
        orderBy?: string;
        /**
         * Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListContactCentersRequest
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Contactcenters$Patch extends StandardParameters {
        /**
         * name of resource
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Field mask is used to specify the fields to be overwritten in the ContactCenter resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ContactCenter;
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
        cancel(params?: Params$Resource$Projects$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
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
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
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
