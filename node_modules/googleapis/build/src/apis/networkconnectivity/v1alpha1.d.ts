import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace networkconnectivity_v1alpha1 {
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
     * Network Connectivity API
     *
     * This API enables connectivity with and between Google Cloud resources.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const networkconnectivity = google.networkconnectivity('v1alpha1');
     * ```
     */
    export class Networkconnectivity {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Range auto-allocation options, to be optionally used when CIDR block is not explicitly set.
     */
    export interface Schema$AllocationOptions {
        /**
         * Optional. Allocation strategy. Not setting this field when the allocation is requested means an implementation defined strategy is used.
         */
        allocationStrategy?: string | null;
        /**
         * Optional. This field must be set only when allocation_strategy is set to RANDOM_FIRST_N_AVAILABLE. The value should be the maximum expected parallelism of range creation requests issued to the same space of peered netwroks.
         */
        firstAvailableRangesLookupSize?: number | null;
    }
    /**
     * Specifies the audit configuration for a service. The configuration determines which permission types are logged, and what identities, if any, are exempted from logging. An AuditConfig must have one or more AuditLogConfigs. If there are AuditConfigs for both `allServices` and a specific service, the union of the two AuditConfigs is used for that service: the log_types specified in each AuditConfig are enabled, and the exempted_members in each AuditLogConfig are exempted. Example Policy with multiple AuditConfigs: { "audit_configs": [ { "service": "allServices", "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members": [ "user:jose@example.com" ] \}, { "log_type": "DATA_WRITE" \}, { "log_type": "ADMIN_READ" \} ] \}, { "service": "sampleservice.googleapis.com", "audit_log_configs": [ { "log_type": "DATA_READ" \}, { "log_type": "DATA_WRITE", "exempted_members": [ "user:aliya@example.com" ] \} ] \} ] \} For sampleservice, this policy enables DATA_READ, DATA_WRITE and ADMIN_READ logging. It also exempts `jose@example.com` from DATA_READ logging, and `aliya@example.com` from DATA_WRITE logging.
     */
    export interface Schema$AuditConfig {
        /**
         * The configuration for logging of each type of permission.
         */
        auditLogConfigs?: Schema$AuditLogConfig[];
        /**
         * Specifies a service that will be enabled for audit logging. For example, `storage.googleapis.com`, `cloudsql.googleapis.com`. `allServices` is a special value that covers all services.
         */
        service?: string | null;
    }
    /**
     * Provides the configuration for logging a type of permissions. Example: { "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members": [ "user:jose@example.com" ] \}, { "log_type": "DATA_WRITE" \} ] \} This enables 'DATA_READ' and 'DATA_WRITE' logging, while exempting jose@example.com from DATA_READ logging.
     */
    export interface Schema$AuditLogConfig {
        /**
         * Specifies the identities that do not cause logging for this type of permission. Follows the same format of Binding.members.
         */
        exemptedMembers?: string[] | null;
        /**
         * The log type that this config enables.
         */
        logType?: string | null;
    }
    /**
     * Associates `members`, or principals, with a `role`.
     */
    export interface Schema$Binding {
        /**
         * The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the principals in this binding. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$Expr;
        /**
         * Specifies the principals requesting access for a Google Cloud resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. * `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account. Does not include identities that come from external identity providers (IdPs) through identity federation. * `user:{emailid\}`: An email address that represents a specific Google account. For example, `alice@example.com` . * `serviceAccount:{emailid\}`: An email address that represents a Google service account. For example, `my-other-app@appspot.gserviceaccount.com`. * `serviceAccount:{projectid\}.svc.id.goog[{namespace\}/{kubernetes-sa\}]`: An identifier for a [Kubernetes service account](https://cloud.google.com/kubernetes-engine/docs/how-to/kubernetes-service-accounts). For example, `my-project.svc.id.goog[my-namespace/my-kubernetes-sa]`. * `group:{emailid\}`: An email address that represents a Google group. For example, `admins@example.com`. * `domain:{domain\}`: The G Suite domain (primary) that represents all the users of that domain. For example, `google.com` or `example.com`. * `principal://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/subject/{subject_attribute_value\}`: A single identity in a workforce identity pool. * `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/group/{group_id\}`: All workforce identities in a group. * `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/attribute.{attribute_name\}/{attribute_value\}`: All workforce identities with a specific attribute value. * `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/x`: All identities in a workforce identity pool. * `principal://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/subject/{subject_attribute_value\}`: A single identity in a workload identity pool. * `principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/group/{group_id\}`: A workload identity pool group. * `principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/attribute.{attribute_name\}/{attribute_value\}`: All identities in a workload identity pool with a certain attribute. * `principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/x`: All identities in a workload identity pool. * `deleted:user:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a user that has been recently deleted. For example, `alice@example.com?uid=123456789012345678901`. If the user is recovered, this value reverts to `user:{emailid\}` and the recovered user retains the role in the binding. * `deleted:serviceAccount:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a service account that has been recently deleted. For example, `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`. If the service account is undeleted, this value reverts to `serviceAccount:{emailid\}` and the undeleted service account retains the role in the binding. * `deleted:group:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a Google group that has been recently deleted. For example, `admins@example.com?uid=123456789012345678901`. If the group is recovered, this value reverts to `group:{emailid\}` and the recovered group retains the role in the binding. * `deleted:principal://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/subject/{subject_attribute_value\}`: Deleted single identity in a workforce identity pool. For example, `deleted:principal://iam.googleapis.com/locations/global/workforcePools/my-pool-id/subject/my-subject-attribute-value`.
         */
        members?: string[] | null;
        /**
         * Role that is assigned to the list of `members`, or principals. For example, `roles/viewer`, `roles/editor`, or `roles/owner`. For an overview of the IAM roles and permissions, see the [IAM documentation](https://cloud.google.com/iam/docs/roles-overview). For a list of the available pre-defined roles, see [here](https://cloud.google.com/iam/docs/understanding-roles).
         */
        role?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
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
    /**
     * Network Connectivity Center is a hub-and-spoke abstraction for network connectivity management in Google Cloud. It reduces operational complexity through a simple, centralized connectivity management model. Following is the resource message of a hub.
     */
    export interface Schema$Hub {
        /**
         * Time when the Hub was created.
         */
        createTime?: string | null;
        /**
         * Short description of the hub resource.
         */
        description?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of a Hub resource.
         */
        name?: string | null;
        /**
         * Output only. A list of the URIs of all attached spokes. This field is deprecated and will not be included in future API versions. Call ListSpokes on each region instead.
         */
        spokes?: string[] | null;
        /**
         * Output only. The current lifecycle state of this Hub.
         */
        state?: string | null;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all Hub resources. If a Hub resource is deleted and another with the same name is created, it gets a different unique_id.
         */
        uniqueId?: string | null;
        /**
         * Time when the Hub was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The internal range resource for IPAM operations within a VPC network. Used to represent a private address range along with behavioral characteristics of that range (its usage and peering behavior). Networking resources can link to this range if they are created as belonging to it.
     */
    export interface Schema$InternalRange {
        /**
         * Optional. Range auto-allocation options, may be set only when auto-allocation is selected by not setting ip_cidr_range (and setting prefix_length).
         */
        allocationOptions?: Schema$AllocationOptions;
        /**
         * Time when the internal range was created.
         */
        createTime?: string | null;
        /**
         * A description of this resource.
         */
        description?: string | null;
        /**
         * Optional. ExcludeCidrRanges flag. Specifies a set of CIDR blocks that allows exclusion of particular CIDR ranges from the auto-allocation process, without having to reserve these blocks
         */
        excludeCidrRanges?: string[] | null;
        /**
         * Optional. Immutable ranges cannot have their fields modified, except for labels and description.
         */
        immutable?: boolean | null;
        /**
         * IP range that this internal range defines. NOTE: IPv6 ranges are limited to usage=EXTERNAL_TO_VPC and peering=FOR_SELF. NOTE: For IPv6 Ranges this field is compulsory, i.e. the address range must be specified explicitly.
         */
        ipCidrRange?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Must be present if usage is set to FOR_MIGRATION.
         */
        migration?: Schema$Migration;
        /**
         * Immutable. The name of an internal range. Format: projects/{project\}/locations/{location\}/internalRanges/{internal_range\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string | null;
        /**
         * The URL or resource ID of the network in which to reserve the internal range. The network cannot be deleted if there are any reserved internal ranges referring to it. Legacy networks are not supported. For example: https://www.googleapis.com/compute/v1/projects/{project\}/locations/global/networks/{network\} projects/{project\}/locations/global/networks/{network\} {network\}
         */
        network?: string | null;
        /**
         * Optional. Types of resources that are allowed to overlap with the current internal range.
         */
        overlaps?: string[] | null;
        /**
         * The type of peering set for this internal range.
         */
        peering?: string | null;
        /**
         * An alternative to ip_cidr_range. Can be set when trying to create an IPv4 reservation that automatically finds a free range of the given size. If both ip_cidr_range and prefix_length are set, there is an error if the range sizes do not match. Can also be used during updates to change the range size. NOTE: For IPv6 this field only works if ip_cidr_range is set as well, and both fields must match. In other words, with IPv6 this field only works as a redundant parameter.
         */
        prefixLength?: number | null;
        /**
         * Optional. Can be set to narrow down or pick a different address space while searching for a free range. If not set, defaults to the "10.0.0.0/8" address space. This can be used to search in other rfc-1918 address spaces like "172.16.0.0/12" and "192.168.0.0/16" or non-rfc-1918 address spaces used in the VPC.
         */
        targetCidrRange?: string[] | null;
        /**
         * Time when the internal range was updated.
         */
        updateTime?: string | null;
        /**
         * The type of usage set for this internal range.
         */
        usage?: string | null;
        /**
         * Output only. The list of resources that refer to this internal range. Resources that use the internal range for their range allocation are referred to as users of the range. Other resources mark themselves as users while doing so by creating a reference to this internal range. Having a user, based on this reference, prevents deletion of the internal range that is referred to. Can be empty.
         */
        users?: string[] | null;
    }
    /**
     * Response for HubService.ListHubs method.
     */
    export interface Schema$ListHubsResponse {
        /**
         * Hubs to be returned.
         */
        hubs?: Schema$Hub[];
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for InternalRange.ListInternalRanges
     */
    export interface Schema$ListInternalRangesResponse {
        /**
         * Internal range to be returned.
         */
        internalRanges?: Schema$InternalRange[];
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
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
     * The response for HubService.ListSpokes.
     */
    export interface Schema$ListSpokesResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * Spokes to be returned.
         */
        spokes?: Schema$Spoke[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
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
     * Specification for migration with source and target resource names.
     */
    export interface Schema$Migration {
        /**
         * Immutable. Resource path as an URI of the source resource, for example a subnet. The project for the source resource should match the project for the InternalRange. An example: /projects/{project\}/regions/{region\}/subnetworks/{subnet\}
         */
        source?: string | null;
        /**
         * Immutable. Resource path of the target resource. The target project can be different, as in the cases when migrating to peer networks. For example: /projects/{project\}/regions/{region\}/subnetworks/{subnet\}
         */
        target?: string | null;
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
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
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
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** ``` { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} ``` **YAML example:** ``` bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') etag: BwWWja0YfJA= version: 3 ``` For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
        /**
         * Specifies cloud audit logging configuration for this policy.
         */
        auditConfigs?: Schema$AuditConfig[];
        /**
         * Associates a list of `members`, or principals, with a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one principal. The `bindings` in a `Policy` can refer to up to 1,500 principals; up to 250 of these principals can be Google groups. Each occurrence of a principal counts towards these limits. For example, if the `bindings` grant 50 different roles to `user:alice@example.com`, and not to any other principal, then you can add another 1,450 principals to the `bindings` in the `Policy`.
         */
        bindings?: Schema$Binding[];
        /**
         * `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy. **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost.
         */
        etag?: string | null;
        /**
         * Specifies the format of the policy. Valid values are `0`, `1`, and `3`. Requests that specify an invalid value are rejected. Any operation that affects conditional role bindings must specify version `3`. This requirement applies to the following operations: * Getting a policy that includes a conditional role binding * Adding a conditional role binding to a policy * Changing a conditional role binding in a policy * Removing any role binding, with or without a condition, from a policy that includes conditions **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost. If a policy does not include any conditions, operations on that policy may specify any valid version or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        version?: number | null;
    }
    /**
     * RouterAppliance represents a Router appliance which is specified by a VM URI and a NIC address.
     */
    export interface Schema$RouterApplianceInstance {
        /**
         * The IP address of the network interface to use for peering.
         */
        ipAddress?: string | null;
        networkInterface?: string | null;
        /**
         * The URI of the virtual machine resource
         */
        virtualMachine?: string | null;
    }
    /**
     * Request message for `SetIamPolicy` method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
        /**
         * OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only the fields in the mask will be modified. If no mask is provided, the following default mask is used: `paths: "bindings, etag"`
         */
        updateMask?: string | null;
    }
    /**
     * A Spoke is an abstraction of a network attachment being attached to a Hub. A Spoke can be underlying a VPN tunnel, a VLAN (interconnect) attachment, a Router appliance, etc.
     */
    export interface Schema$Spoke {
        /**
         * The time when the Spoke was created.
         */
        createTime?: string | null;
        /**
         * Short description of the spoke resource
         */
        description?: string | null;
        /**
         * The resource URL of the hub resource that the spoke is attached to
         */
        hub?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The URIs of linked interconnect attachment resources
         */
        linkedInterconnectAttachments?: string[] | null;
        /**
         * The URIs of linked Router appliance resources
         */
        linkedRouterApplianceInstances?: Schema$RouterApplianceInstance[];
        /**
         * The URIs of linked VPN tunnel resources
         */
        linkedVpnTunnels?: string[] | null;
        /**
         * Immutable. The name of a Spoke resource.
         */
        name?: string | null;
        /**
         * Output only. The current lifecycle state of this Hub.
         */
        state?: string | null;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all Spoke resources. If a Spoke resource is deleted and another with the same name is created, it gets a different unique_id.
         */
        uniqueId?: string | null;
        /**
         * The time when the Spoke was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Request message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the `resource`. Permissions with wildcards (such as `*` or `storage.*`) are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         */
        permissions?: string[] | null;
    }
    /**
     * Response message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsResponse {
        /**
         * A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
         */
        permissions?: string[] | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        global: Resource$Projects$Locations$Global;
        internalRanges: Resource$Projects$Locations$Internalranges;
        operations: Resource$Projects$Locations$Operations;
        spokes: Resource$Projects$Locations$Spokes;
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
    export class Resource$Projects$Locations$Global {
        context: APIRequestContext;
        hubs: Resource$Projects$Locations$Global$Hubs;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Global$Hubs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Network Connectivity Center hub in the specified project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Global$Hubs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Global$Hubs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Global$Hubs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Global$Hubs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Global$Hubs$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a Network Connectivity Center hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Global$Hubs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Global$Hubs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Global$Hubs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Global$Hubs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Global$Hubs$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details about a Network Connectivity Center hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Global$Hubs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Hub>>;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Get, options: MethodOptions | BodyResponseCallback<Schema$Hub>, callback: BodyResponseCallback<Schema$Hub>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Get, callback: BodyResponseCallback<Schema$Hub>): void;
        get(callback: BodyResponseCallback<Schema$Hub>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists the Network Connectivity Center hubs associated with a given project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Global$Hubs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Global$Hubs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListHubsResponse>>;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$List, options: MethodOptions | BodyResponseCallback<Schema$ListHubsResponse>, callback: BodyResponseCallback<Schema$ListHubsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$List, callback: BodyResponseCallback<Schema$ListHubsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListHubsResponse>): void;
        /**
         * Updates the description and/or labels of a Network Connectivity Center hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Global$Hubs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Create extends StandardParameters {
        /**
         * Optional. Unique id for the Hub to create.
         */
        hubId?: string;
        /**
         * Required. The parent resource's name of the Hub.
         */
        parent?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hub;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Delete extends StandardParameters {
        /**
         * Required. The name of the Hub to delete.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Get extends StandardParameters {
        /**
         * Required. Name of the Hub resource to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$List extends StandardParameters {
        /**
         * A filter expression that filters the results listed in the response.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results per page that should be returned.
         */
        pageSize?: number;
        /**
         * The page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource's name.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Patch extends StandardParameters {
        /**
         * Immutable. The name of a Hub resource.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the Hub resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hub;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Internalranges {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new internal range in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Internalranges$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Internalranges$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Internalranges$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Internalranges$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Internalranges$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single internal range.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Internalranges$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Internalranges$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Internalranges$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Internalranges$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Internalranges$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single internal range.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Internalranges$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Internalranges$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InternalRange>>;
        get(params: Params$Resource$Projects$Locations$Internalranges$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Internalranges$Get, options: MethodOptions | BodyResponseCallback<Schema$InternalRange>, callback: BodyResponseCallback<Schema$InternalRange>): void;
        get(params: Params$Resource$Projects$Locations$Internalranges$Get, callback: BodyResponseCallback<Schema$InternalRange>): void;
        get(callback: BodyResponseCallback<Schema$InternalRange>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Internalranges$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists internal ranges in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Internalranges$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Internalranges$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInternalRangesResponse>>;
        list(params: Params$Resource$Projects$Locations$Internalranges$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Internalranges$List, options: MethodOptions | BodyResponseCallback<Schema$ListInternalRangesResponse>, callback: BodyResponseCallback<Schema$ListInternalRangesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Internalranges$List, callback: BodyResponseCallback<Schema$ListInternalRangesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInternalRangesResponse>): void;
        /**
         * Updates the parameters of a single internal range.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Internalranges$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Internalranges$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Internalranges$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Internalranges$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Internalranges$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Internalranges$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Internalranges$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Internalranges$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Internalranges$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Internalranges$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Internalranges$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Internalranges$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Create extends StandardParameters {
        /**
         * Optional. Resource ID (i.e. 'foo' in '[...]/projects/p/locations/l/internalRanges/foo') See https://google.aip.dev/122#resource-id-segments Unique per location.
         */
        internalRangeId?: string;
        /**
         * Required. The parent resource's name of the InternalRange.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if the original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InternalRange;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Delete extends StandardParameters {
        /**
         * Required. The name of the InternalRange to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if the original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Get extends StandardParameters {
        /**
         * Required. Name of the InternalRange to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$List extends StandardParameters {
        /**
         * A filter expression that filters the results listed in the response.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results per page that should be returned.
         */
        pageSize?: number;
        /**
         * The page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource's name.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Patch extends StandardParameters {
        /**
         * Immutable. The name of an internal range. Format: projects/{project\}/locations/{location\}/internalRanges/{internal_range\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if the original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the internal range resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InternalRange;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
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
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleLongrunningCancelOperationRequest;
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
    export class Resource$Projects$Locations$Spokes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Network Connectivity Center spoke.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Spokes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Spokes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Spokes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Spokes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Spokes$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a Network Connectivity Center spoke.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Spokes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Spokes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Spokes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Spokes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Spokes$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details about a Network Connectivity Center spoke.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Spokes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Spokes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Spoke>>;
        get(params: Params$Resource$Projects$Locations$Spokes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Spokes$Get, options: MethodOptions | BodyResponseCallback<Schema$Spoke>, callback: BodyResponseCallback<Schema$Spoke>): void;
        get(params: Params$Resource$Projects$Locations$Spokes$Get, callback: BodyResponseCallback<Schema$Spoke>): void;
        get(callback: BodyResponseCallback<Schema$Spoke>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Spokes$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists the Network Connectivity Center spokes in a specified project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Spokes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Spokes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSpokesResponse>>;
        list(params: Params$Resource$Projects$Locations$Spokes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Spokes$List, options: MethodOptions | BodyResponseCallback<Schema$ListSpokesResponse>, callback: BodyResponseCallback<Schema$ListSpokesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Spokes$List, callback: BodyResponseCallback<Schema$ListSpokesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSpokesResponse>): void;
        /**
         * Updates the parameters of a Network Connectivity Center spoke.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Spokes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Spokes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Spokes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Spokes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Spokes$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Spokes$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Spokes$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Spokes$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Spokes$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Spokes$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Spokes$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Spokes$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Create extends StandardParameters {
        /**
         * Required. The parent's resource name of the Spoke.
         */
        parent?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Unique id for the Spoke to create.
         */
        spokeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Spoke;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Delete extends StandardParameters {
        /**
         * Required. The name of the Spoke to delete.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Get extends StandardParameters {
        /**
         * Required. The name of Spoke resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$List extends StandardParameters {
        /**
         * A filter expression that filters the results listed in the response.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results per page that should be returned.
         */
        pageSize?: number;
        /**
         * The page token.
         */
        pageToken?: string;
        /**
         * Required. The parent's resource name.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Patch extends StandardParameters {
        /**
         * Immutable. The name of a Spoke resource.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the Spoke resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Spoke;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export {};
}
