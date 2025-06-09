import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace accesscontextmanager_v1beta {
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
     * Access Context Manager API
     *
     * An API for setting attribute based access control to requests to Google Cloud services.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const accesscontextmanager = google.accesscontextmanager('v1beta');
     * ```
     */
    export class Accesscontextmanager {
        context: APIRequestContext;
        accessPolicies: Resource$Accesspolicies;
        operations: Resource$Operations;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Metadata of Access Context Manager's Long Running Operations.
     */
    export interface Schema$AccessContextManagerOperationMetadata {
    }
    /**
     * An `AccessLevel` is a label that can be applied to requests to Google Cloud services, along with a list of requirements necessary for the label to be applied.
     */
    export interface Schema$AccessLevel {
        /**
         * A `BasicLevel` composed of `Conditions`.
         */
        basic?: Schema$BasicLevel;
        /**
         * A `CustomLevel` written in the Common Expression Language.
         */
        custom?: Schema$CustomLevel;
        /**
         * Description of the `AccessLevel` and its use. Does not affect behavior.
         */
        description?: string | null;
        /**
         * Resource name for the `AccessLevel`. Format: `accessPolicies/{access_policy\}/accessLevels/{access_level\}`. The `access_level` component must begin with a letter, followed by alphanumeric characters or `_`. Its maximum length is 50 characters. After you create an `AccessLevel`, you cannot change its `name`.
         */
        name?: string | null;
        /**
         * Human readable title. Must be unique within the Policy.
         */
        title?: string | null;
    }
    /**
     * `AccessPolicy` is a container for `AccessLevels` (which define the necessary attributes to use Google Cloud services) and `ServicePerimeters` (which define regions of services able to freely pass data within a perimeter). An access policy is globally visible within an organization, and the restrictions it specifies apply to all projects within an organization.
     */
    export interface Schema$AccessPolicy {
        /**
         * Output only. Resource name of the `AccessPolicy`. Format: `accessPolicies/{policy_id\}`
         */
        name?: string | null;
        /**
         * Required. The parent of this `AccessPolicy` in the Cloud Resource Hierarchy. Currently immutable once created. Format: `organizations/{organization_id\}`
         */
        parent?: string | null;
        /**
         * Required. Human readable title. Does not affect behavior.
         */
        title?: string | null;
    }
    /**
     * `BasicLevel` is an `AccessLevel` using a set of recommended features.
     */
    export interface Schema$BasicLevel {
        /**
         * How the `conditions` list should be combined to determine if a request is granted this `AccessLevel`. If AND is used, each `Condition` in `conditions` must be satisfied for the `AccessLevel` to be applied. If OR is used, at least one `Condition` in `conditions` must be satisfied for the `AccessLevel` to be applied. Default behavior is AND.
         */
        combiningFunction?: string | null;
        /**
         * Required. A list of requirements for the `AccessLevel` to be granted.
         */
        conditions?: Schema$Condition[];
    }
    /**
     * A condition necessary for an `AccessLevel` to be granted. The Condition is an AND over its fields. So a Condition is true if: 1) the request IP is from one of the listed subnetworks AND 2) the originating device complies with the listed device policy AND 3) all listed access levels are granted AND 4) the request was sent at a time allowed by the DateTimeRestriction.
     */
    export interface Schema$Condition {
        /**
         * Device specific restrictions, all restrictions must hold for the Condition to be true. If not specified, all devices are allowed.
         */
        devicePolicy?: Schema$DevicePolicy;
        /**
         * CIDR block IP subnetwork specification. May be IPv4 or IPv6. Note that for a CIDR IP address block, the specified IP address portion must be properly truncated (i.e. all the host bits must be zero) or the input is considered malformed. For example, "192.0.2.0/24" is accepted but "192.0.2.1/24" is not. Similarly, for IPv6, "2001:db8::/32" is accepted whereas "2001:db8::1/32" is not. The originating IP of a request must be in one of the listed subnets in order for this Condition to be true. If empty, all IP addresses are allowed.
         */
        ipSubnetworks?: string[] | null;
        /**
         * The request must be made by one of the provided user or service accounts. Groups are not supported. Syntax: `user:{emailid\}` `serviceAccount:{emailid\}` If not specified, a request may come from any user.
         */
        members?: string[] | null;
        /**
         * Whether to negate the Condition. If true, the Condition becomes a NAND over its non-empty fields. Any non-empty field criteria evaluating to false will result in the Condition to be satisfied. Defaults to false.
         */
        negate?: boolean | null;
        /**
         * The request must originate from one of the provided countries/regions. Must be valid ISO 3166-1 alpha-2 codes.
         */
        regions?: string[] | null;
        /**
         * A list of other access levels defined in the same `Policy`, referenced by resource name. Referencing an `AccessLevel` which does not exist is an error. All access levels listed must be granted for the Condition to be true. Example: "`accessPolicies/MY_POLICY/accessLevels/LEVEL_NAME"`
         */
        requiredAccessLevels?: string[] | null;
    }
    /**
     * `CustomLevel` is an `AccessLevel` using the Cloud Common Expression Language to represent the necessary conditions for the level to apply to a request. See CEL spec at: https://github.com/google/cel-spec
     */
    export interface Schema$CustomLevel {
        /**
         * Required. A Cloud CEL expression evaluating to a boolean.
         */
        expr?: Schema$Expr;
    }
    /**
     * `DevicePolicy` specifies device specific restrictions necessary to acquire a given access level. A `DevicePolicy` specifies requirements for requests from devices to be granted access levels, it does not do any enforcement on the device. `DevicePolicy` acts as an AND over all specified fields, and each repeated field is an OR over its elements. Any unset fields are ignored. For example, if the proto is { os_type : DESKTOP_WINDOWS, os_type : DESKTOP_LINUX, encryption_status: ENCRYPTED\}, then the DevicePolicy will be true for requests originating from encrypted Linux desktops and encrypted Windows desktops.
     */
    export interface Schema$DevicePolicy {
        /**
         * Allowed device management levels, an empty list allows all management levels.
         */
        allowedDeviceManagementLevels?: string[] | null;
        /**
         * Allowed encryptions statuses, an empty list allows all statuses.
         */
        allowedEncryptionStatuses?: string[] | null;
        /**
         * Allowed OS versions, an empty list allows all types and all versions.
         */
        osConstraints?: Schema$OsConstraint[];
        /**
         * Whether the device needs to be approved by the customer admin.
         */
        requireAdminApproval?: boolean | null;
        /**
         * Whether the device needs to be corp owned.
         */
        requireCorpOwned?: boolean | null;
        /**
         * Whether or not screenlock is required for the DevicePolicy to be true. Defaults to `false`.
         */
        requireScreenlock?: boolean | null;
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
     */
    export interface Schema$Expr {
        /**
         * Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.
         */
        description?: string | null;
        /**
         * Textual representation of an expression in Common Expression Language syntax.
         */
        expression?: string | null;
        /**
         * Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.
         */
        location?: string | null;
        /**
         * Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.
         */
        title?: string | null;
    }
    /**
     * A response to `ListAccessLevelsRequest`.
     */
    export interface Schema$ListAccessLevelsResponse {
        /**
         * List of the Access Level instances.
         */
        accessLevels?: Schema$AccessLevel[];
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
    }
    /**
     * A response to `ListAccessPoliciesRequest`.
     */
    export interface Schema$ListAccessPoliciesResponse {
        /**
         * List of the AccessPolicy instances.
         */
        accessPolicies?: Schema$AccessPolicy[];
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
    }
    /**
     * A response to `ListServicePerimetersRequest`.
     */
    export interface Schema$ListServicePerimetersResponse {
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
        /**
         * List of the Service Perimeter instances.
         */
        servicePerimeters?: Schema$ServicePerimeter[];
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
     * A restriction on the OS type and version of devices making requests.
     */
    export interface Schema$OsConstraint {
        /**
         * The minimum allowed OS version. If not set, any version of this OS satisfies the constraint. Format: `"major.minor.patch"`. Examples: `"10.5.301"`, `"9.2.1"`.
         */
        minimumVersion?: string | null;
        /**
         * Required. The allowed OS type.
         */
        osType?: string | null;
        /**
         * Only allows requests from devices with a verified Chrome OS. Verifications includes requirements that the device is enterprise-managed, conformant to domain policies, and the caller has permission to call the API targeted by the request.
         */
        requireVerifiedChromeOs?: boolean | null;
    }
    /**
     * `ServicePerimeter` describes a set of Google Cloud resources which can freely import and export data amongst themselves, but not export outside of the `ServicePerimeter`. If a request with a source within this `ServicePerimeter` has a target outside of the `ServicePerimeter`, the request will be blocked. Otherwise the request is allowed. There are two types of Service Perimeter - Regular and Bridge. Regular Service Perimeters cannot overlap, a single Google Cloud project can only belong to a single regular Service Perimeter. Service Perimeter Bridges can contain only Google Cloud projects as members, a single Google Cloud project may belong to multiple Service Perimeter Bridges.
     */
    export interface Schema$ServicePerimeter {
        /**
         * Description of the `ServicePerimeter` and its use. Does not affect behavior.
         */
        description?: string | null;
        /**
         * Resource name for the `ServicePerimeter`. Format: `accessPolicies/{access_policy\}/servicePerimeters/{service_perimeter\}`. The `service_perimeter` component must begin with a letter, followed by alphanumeric characters or `_`. After you create a `ServicePerimeter`, you cannot change its `name`.
         */
        name?: string | null;
        /**
         * Perimeter type indicator. A single project is allowed to be a member of single regular perimeter, but multiple service perimeter bridges. A project cannot be a included in a perimeter bridge without being included in regular perimeter. For perimeter bridges, restricted/unrestricted service lists as well as access lists must be empty.
         */
        perimeterType?: string | null;
        /**
         * Current ServicePerimeter configuration. Specifies sets of resources, restricted/unrestricted services and access levels that determine perimeter content and boundaries.
         */
        status?: Schema$ServicePerimeterConfig;
        /**
         * Human readable title. Must be unique within the Policy.
         */
        title?: string | null;
    }
    /**
     * `ServicePerimeterConfig` specifies a set of Google Cloud resources that describe specific Service Perimeter configuration.
     */
    export interface Schema$ServicePerimeterConfig {
        /**
         * A list of `AccessLevel` resource names that allow resources within the `ServicePerimeter` to be accessed from the internet. `AccessLevels` listed must be in the same policy as this `ServicePerimeter`. Referencing a nonexistent `AccessLevel` is a syntax error. If no `AccessLevel` names are listed, resources within the perimeter can only be accessed via Google Cloud calls with request origins within the perimeter. Example: `"accessPolicies/MY_POLICY/accessLevels/MY_LEVEL"`. For Service Perimeter Bridge, must be empty.
         */
        accessLevels?: string[] | null;
        /**
         * A list of Google Cloud resources that are inside of the service perimeter. Currently only projects are allowed. Format: `projects/{project_number\}`
         */
        resources?: string[] | null;
        /**
         * Google Cloud services that are subject to the Service Perimeter restrictions. Must contain a list of services. For example, if `storage.googleapis.com` is specified, access to the storage buckets inside the perimeter must meet the perimeter's access restrictions.
         */
        restrictedServices?: string[] | null;
        /**
         * Google Cloud services that are not subject to the Service Perimeter restrictions. Deprecated. Must be set to a single wildcard "*". The wildcard means that unless explicitly specified by "restricted_services" list, any service is treated as unrestricted.
         */
        unrestrictedServices?: string[] | null;
        /**
         * Beta. Configuration for APIs allowed within Perimeter.
         */
        vpcAccessibleServices?: Schema$VpcAccessibleServices;
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
     * Specifies how APIs are allowed to communicate within the Service Perimeter.
     */
    export interface Schema$VpcAccessibleServices {
        /**
         * The list of APIs usable within the Service Perimeter. Must be empty unless 'enable_restriction' is True. You can specify a list of individual services, as well as include the 'RESTRICTED-SERVICES' value, which automatically includes all of the services protected by the perimeter.
         */
        allowedServices?: string[] | null;
        /**
         * Whether to restrict API calls within the Service Perimeter to the list of APIs specified in 'allowed_services'.
         */
        enableRestriction?: boolean | null;
    }
    export class Resource$Accesspolicies {
        context: APIRequestContext;
        accessLevels: Resource$Accesspolicies$Accesslevels;
        servicePerimeters: Resource$Accesspolicies$Serviceperimeters;
        constructor(context: APIRequestContext);
        /**
         * Create an `AccessPolicy`. Fails if this organization already has a `AccessPolicy`. The longrunning Operation will have a successful status once the `AccessPolicy` has propagated to long-lasting storage. Syntactic and basic semantic errors will be returned in `metadata` as a BadRequest proto.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accesspolicies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accesspolicies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Accesspolicies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accesspolicies$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Accesspolicies$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Delete an AccessPolicy by resource name. The longrunning Operation will have a successful status once the AccessPolicy has been removed from long-lasting storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accesspolicies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accesspolicies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Accesspolicies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accesspolicies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Accesspolicies$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get an AccessPolicy by name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accesspolicies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accesspolicies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessPolicy>>;
        get(params: Params$Resource$Accesspolicies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accesspolicies$Get, options: MethodOptions | BodyResponseCallback<Schema$AccessPolicy>, callback: BodyResponseCallback<Schema$AccessPolicy>): void;
        get(params: Params$Resource$Accesspolicies$Get, callback: BodyResponseCallback<Schema$AccessPolicy>): void;
        get(callback: BodyResponseCallback<Schema$AccessPolicy>): void;
        /**
         * List all AccessPolicies under a container.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accesspolicies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accesspolicies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAccessPoliciesResponse>>;
        list(params: Params$Resource$Accesspolicies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accesspolicies$List, options: MethodOptions | BodyResponseCallback<Schema$ListAccessPoliciesResponse>, callback: BodyResponseCallback<Schema$ListAccessPoliciesResponse>): void;
        list(params: Params$Resource$Accesspolicies$List, callback: BodyResponseCallback<Schema$ListAccessPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAccessPoliciesResponse>): void;
        /**
         * Update an AccessPolicy. The longrunning Operation from this RPC will have a successful status once the changes to the AccessPolicy have propagated to long-lasting storage. Syntactic and basic semantic errors will be returned in `metadata` as a BadRequest proto.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accesspolicies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accesspolicies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Accesspolicies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accesspolicies$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Accesspolicies$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accesspolicies$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessPolicy;
    }
    export interface Params$Resource$Accesspolicies$Delete extends StandardParameters {
        /**
         * Required. Resource name for the access policy to delete. Format `accessPolicies/{policy_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Get extends StandardParameters {
        /**
         * Required. Resource name for the access policy to get. Format `accessPolicies/{policy_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$List extends StandardParameters {
        /**
         * Number of AccessPolicy instances to include in the list. Default 100.
         */
        pageSize?: number;
        /**
         * Next page token for the next batch of AccessPolicy instances. Defaults to the first page of results.
         */
        pageToken?: string;
        /**
         * Required. Resource name for the container to list AccessPolicy instances from. Format: `organizations/{org_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Accesspolicies$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the `AccessPolicy`. Format: `accessPolicies/{policy_id\}`
         */
        name?: string;
        /**
         * Required. Mask to control which fields get updated. Must be non-empty.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessPolicy;
    }
    export class Resource$Accesspolicies$Accesslevels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an Access Level. The longrunning operation from this RPC will have a successful status once the Access Level has propagated to long-lasting storage. Access Levels containing errors will result in an error response for the first error encountered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accesspolicies$Accesslevels$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accesspolicies$Accesslevels$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Accesspolicies$Accesslevels$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accesspolicies$Accesslevels$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Accesspolicies$Accesslevels$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Delete an Access Level by resource name. The longrunning operation from this RPC will have a successful status once the Access Level has been removed from long-lasting storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accesspolicies$Accesslevels$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accesspolicies$Accesslevels$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Accesspolicies$Accesslevels$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accesspolicies$Accesslevels$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Accesspolicies$Accesslevels$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get an Access Level by resource name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accesspolicies$Accesslevels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accesspolicies$Accesslevels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessLevel>>;
        get(params: Params$Resource$Accesspolicies$Accesslevels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accesspolicies$Accesslevels$Get, options: MethodOptions | BodyResponseCallback<Schema$AccessLevel>, callback: BodyResponseCallback<Schema$AccessLevel>): void;
        get(params: Params$Resource$Accesspolicies$Accesslevels$Get, callback: BodyResponseCallback<Schema$AccessLevel>): void;
        get(callback: BodyResponseCallback<Schema$AccessLevel>): void;
        /**
         * List all Access Levels for an access policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accesspolicies$Accesslevels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accesspolicies$Accesslevels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAccessLevelsResponse>>;
        list(params: Params$Resource$Accesspolicies$Accesslevels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accesspolicies$Accesslevels$List, options: MethodOptions | BodyResponseCallback<Schema$ListAccessLevelsResponse>, callback: BodyResponseCallback<Schema$ListAccessLevelsResponse>): void;
        list(params: Params$Resource$Accesspolicies$Accesslevels$List, callback: BodyResponseCallback<Schema$ListAccessLevelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAccessLevelsResponse>): void;
        /**
         * Update an Access Level. The longrunning operation from this RPC will have a successful status once the changes to the Access Level have propagated to long-lasting storage. Access Levels containing errors will result in an error response for the first error encountered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accesspolicies$Accesslevels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accesspolicies$Accesslevels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Accesspolicies$Accesslevels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accesspolicies$Accesslevels$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Accesspolicies$Accesslevels$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$Create extends StandardParameters {
        /**
         * Required. Resource name for the access policy which owns this Access Level. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessLevel;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$Delete extends StandardParameters {
        /**
         * Required. Resource name for the Access Level. Format: `accessPolicies/{policy_id\}/accessLevels/{access_level_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$Get extends StandardParameters {
        /**
         * Whether to return `BasicLevels` in the Cloud Common Expression Language rather than as `BasicLevels`. Defaults to AS_DEFINED, where Access Levels are returned as `BasicLevels` or `CustomLevels` based on how they were created. If set to CEL, all Access Levels are returned as `CustomLevels`. In the CEL case, `BasicLevels` are translated to equivalent `CustomLevels`.
         */
        accessLevelFormat?: string;
        /**
         * Required. Resource name for the Access Level. Format: `accessPolicies/{policy_id\}/accessLevels/{access_level_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$List extends StandardParameters {
        /**
         * Whether to return `BasicLevels` in the Cloud Common Expression language, as `CustomLevels`, rather than as `BasicLevels`. Defaults to returning `AccessLevels` in the format they were defined.
         */
        accessLevelFormat?: string;
        /**
         * Number of Access Levels to include in the list. Default 100.
         */
        pageSize?: number;
        /**
         * Next page token for the next batch of Access Level instances. Defaults to the first page of results.
         */
        pageToken?: string;
        /**
         * Required. Resource name for the access policy to list Access Levels from. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$Patch extends StandardParameters {
        /**
         * Resource name for the `AccessLevel`. Format: `accessPolicies/{access_policy\}/accessLevels/{access_level\}`. The `access_level` component must begin with a letter, followed by alphanumeric characters or `_`. Its maximum length is 50 characters. After you create an `AccessLevel`, you cannot change its `name`.
         */
        name?: string;
        /**
         * Required. Mask to control which fields get updated. Must be non-empty.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessLevel;
    }
    export class Resource$Accesspolicies$Serviceperimeters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a Service Perimeter. The longrunning operation from this RPC will have a successful status once the Service Perimeter has propagated to long-lasting storage. Service Perimeters containing errors will result in an error response for the first error encountered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accesspolicies$Serviceperimeters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accesspolicies$Serviceperimeters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Accesspolicies$Serviceperimeters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accesspolicies$Serviceperimeters$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Accesspolicies$Serviceperimeters$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Delete a Service Perimeter by resource name. The longrunning operation from this RPC will have a successful status once the Service Perimeter has been removed from long-lasting storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accesspolicies$Serviceperimeters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accesspolicies$Serviceperimeters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Accesspolicies$Serviceperimeters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accesspolicies$Serviceperimeters$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Accesspolicies$Serviceperimeters$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get a Service Perimeter by resource name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accesspolicies$Serviceperimeters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accesspolicies$Serviceperimeters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServicePerimeter>>;
        get(params: Params$Resource$Accesspolicies$Serviceperimeters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accesspolicies$Serviceperimeters$Get, options: MethodOptions | BodyResponseCallback<Schema$ServicePerimeter>, callback: BodyResponseCallback<Schema$ServicePerimeter>): void;
        get(params: Params$Resource$Accesspolicies$Serviceperimeters$Get, callback: BodyResponseCallback<Schema$ServicePerimeter>): void;
        get(callback: BodyResponseCallback<Schema$ServicePerimeter>): void;
        /**
         * List all Service Perimeters for an access policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accesspolicies$Serviceperimeters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accesspolicies$Serviceperimeters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServicePerimetersResponse>>;
        list(params: Params$Resource$Accesspolicies$Serviceperimeters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accesspolicies$Serviceperimeters$List, options: MethodOptions | BodyResponseCallback<Schema$ListServicePerimetersResponse>, callback: BodyResponseCallback<Schema$ListServicePerimetersResponse>): void;
        list(params: Params$Resource$Accesspolicies$Serviceperimeters$List, callback: BodyResponseCallback<Schema$ListServicePerimetersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServicePerimetersResponse>): void;
        /**
         * Update a Service Perimeter. The longrunning operation from this RPC will have a successful status once the changes to the Service Perimeter have propagated to long-lasting storage. Service Perimeter containing errors will result in an error response for the first error encountered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accesspolicies$Serviceperimeters$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accesspolicies$Serviceperimeters$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Accesspolicies$Serviceperimeters$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accesspolicies$Serviceperimeters$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Accesspolicies$Serviceperimeters$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Create extends StandardParameters {
        /**
         * Required. Resource name for the access policy which owns this Service Perimeter. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServicePerimeter;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Delete extends StandardParameters {
        /**
         * Required. Resource name for the Service Perimeter. Format: `accessPolicies/{policy_id\}/servicePerimeters/{service_perimeter_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Get extends StandardParameters {
        /**
         * Required. Resource name for the Service Perimeter. Format: `accessPolicies/{policy_id\}/servicePerimeters/{service_perimeters_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$List extends StandardParameters {
        /**
         * Number of Service Perimeters to include in the list. Default 100.
         */
        pageSize?: number;
        /**
         * Next page token for the next batch of Service Perimeter instances. Defaults to the first page of results.
         */
        pageToken?: string;
        /**
         * Required. Resource name for the access policy to list Service Perimeters from. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Patch extends StandardParameters {
        /**
         * Resource name for the `ServicePerimeter`. Format: `accessPolicies/{access_policy\}/servicePerimeters/{service_perimeter\}`. The `service_perimeter` component must begin with a letter, followed by alphanumeric characters or `_`. After you create a `ServicePerimeter`, you cannot change its `name`.
         */
        name?: string;
        /**
         * Required. Mask to control which fields get updated. Must be non-empty.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServicePerimeter;
    }
    export class Resource$Operations {
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
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export {};
}
