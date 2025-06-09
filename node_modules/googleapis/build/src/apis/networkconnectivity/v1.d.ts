import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace networkconnectivity_v1 {
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
     * Network Connectivity API
     *
     * This API enables connectivity with and between Google Cloud resources.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const networkconnectivity = google.networkconnectivity('v1');
     * ```
     */
    export class Networkconnectivity {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The request for HubService.AcceptHubSpoke.
     */
    export interface Schema$AcceptHubSpokeRequest {
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The URI of the spoke to accept into the hub.
         */
        spokeUri?: string | null;
    }
    /**
     * The response for HubService.AcceptHubSpoke.
     */
    export interface Schema$AcceptHubSpokeResponse {
        /**
         * The spoke that was operated on.
         */
        spoke?: Schema$Spoke;
    }
    /**
     * The request for HubService.AcceptSpokeUpdate.
     */
    export interface Schema$AcceptSpokeUpdateRequest {
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The etag of the spoke to accept update.
         */
        spokeEtag?: string | null;
        /**
         * Required. The URI of the spoke to accept update.
         */
        spokeUri?: string | null;
    }
    /**
     * Range auto-allocation options, to be optionally used when CIDR block is not explicitly set.
     */
    export interface Schema$AllocationOptions {
        /**
         * Optional. Allocation strategy Not setting this field when the allocation is requested means an implementation defined strategy is used.
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
     * The auto-accept setting for a group controls whether proposed spokes are automatically attached to the hub. If auto-accept is enabled, the spoke immediately is attached to the hub and becomes part of the group. In this case, the new spoke is in the ACTIVE state. If auto-accept is disabled, the spoke goes to the INACTIVE state, and it must be reviewed and accepted by a hub administrator.
     */
    export interface Schema$AutoAccept {
        /**
         * Optional. A list of project ids or project numbers for which you want to enable auto-accept. The auto-accept setting is applied to spokes being created or updated in these projects.
         */
        autoAcceptProjects?: string[] | null;
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
     * Allow the producer to specify which consumers can connect to it.
     */
    export interface Schema$ConsumerPscConfig {
        /**
         * Required. The project ID or project number of the consumer project. This project is the one that the consumer uses to interact with the producer instance. From the perspective of a consumer who's created a producer instance, this is the project of the producer instance. Format: 'projects/' Eg. 'projects/consumer-project' or 'projects/1234'
         */
        consumerInstanceProject?: string | null;
        /**
         * This is used in PSC consumer ForwardingRule to control whether the PSC endpoint can be accessed from another region.
         */
        disableGlobalAccess?: boolean | null;
        /**
         * The requested IP version for the PSC connection.
         */
        ipVersion?: string | null;
        /**
         * The resource path of the consumer network where PSC connections are allowed to be created in. Note, this network does not need be in the ConsumerPscConfig.project in the case of SharedVPC. Example: projects/{projectNumOrId\}/global/networks/{networkId\}.
         */
        network?: string | null;
        /**
         * Immutable. Deprecated. Use producer_instance_metadata instead. An immutable identifier for the producer instance.
         */
        producerInstanceId?: string | null;
        /**
         * Immutable. An immutable map for the producer instance metadata.
         */
        producerInstanceMetadata?: {
            [key: string]: string;
        } | null;
        /**
         * The consumer project where PSC connections are allowed to be created in.
         */
        project?: string | null;
        /**
         * Output only. A map to store mapping between customer vip and target service attachment. Only service attachment with producer specified ip addresses are stored here.
         */
        serviceAttachmentIpAddressMap?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Overall state of PSC Connections management for this consumer psc config.
         */
        state?: string | null;
    }
    /**
     * PSC connection details on consumer side.
     */
    export interface Schema$ConsumerPscConnection {
        /**
         * The most recent error during operating this connection.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Output only. The error info for the latest error during operating this connection.
         */
        errorInfo?: Schema$GoogleRpcErrorInfo;
        /**
         * The error type indicates whether the error is consumer facing, producer facing or system internal.
         */
        errorType?: string | null;
        /**
         * The URI of the consumer forwarding rule created. Example: projects/{projectNumOrId\}/regions/us-east1/networks/{resourceId\}.
         */
        forwardingRule?: string | null;
        /**
         * The last Compute Engine operation to setup PSC connection.
         */
        gceOperation?: string | null;
        /**
         * The IP literal allocated on the consumer network for the PSC forwarding rule that is created to connect to the producer service attachment in this service connection map.
         */
        ip?: string | null;
        /**
         * The requested IP version for the PSC connection.
         */
        ipVersion?: string | null;
        /**
         * The consumer network whose PSC forwarding rule is connected to the service attachments in this service connection map. Note that the network could be on a different project (shared VPC).
         */
        network?: string | null;
        /**
         * Immutable. Deprecated. Use producer_instance_metadata instead. An immutable identifier for the producer instance.
         */
        producerInstanceId?: string | null;
        /**
         * Immutable. An immutable map for the producer instance metadata.
         */
        producerInstanceMetadata?: {
            [key: string]: string;
        } | null;
        /**
         * The consumer project whose PSC forwarding rule is connected to the service attachments in this service connection map.
         */
        project?: string | null;
        /**
         * The PSC connection id of the PSC forwarding rule connected to the service attachments in this service connection map.
         */
        pscConnectionId?: string | null;
        /**
         * Output only. The URI of the selected subnetwork selected to allocate IP address for this connection.
         */
        selectedSubnetwork?: string | null;
        /**
         * The URI of a service attachment which is the target of the PSC connection.
         */
        serviceAttachmentUri?: string | null;
        /**
         * The state of the PSC connection.
         */
        state?: string | null;
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
     * Filter matches L4 traffic.
     */
    export interface Schema$Filter {
        /**
         * Optional. The destination IP range of outgoing packets that this policy-based route applies to. Default is "0.0.0.0/0" if protocol version is IPv4.
         */
        destRange?: string | null;
        /**
         * Optional. The IP protocol that this policy-based route applies to. Valid values are 'TCP', 'UDP', and 'ALL'. Default is 'ALL'.
         */
        ipProtocol?: string | null;
        /**
         * Required. Internet protocol versions this policy-based route applies to. For this version, only IPV4 is supported. IPV6 is supported in preview.
         */
        protocolVersion?: string | null;
        /**
         * Optional. The source IP range of outgoing packets that this policy-based route applies to. Default is "0.0.0.0/0" if protocol version is IPv4.
         */
        srcRange?: string | null;
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
     * Describes the cause of the error with structured details. Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled: { "reason": "API_DISABLED" "domain": "googleapis.com" "metadata": { "resource": "projects/123", "service": "pubsub.googleapis.com" \} \} This response indicates that the pubsub.googleapis.com API is not enabled. Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock: { "reason": "STOCKOUT" "domain": "spanner.googleapis.com", "metadata": { "availableRegions": "us-central1,us-east2" \} \}
     */
    export interface Schema$GoogleRpcErrorInfo {
        /**
         * The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".
         */
        domain?: string | null;
        /**
         * Additional structured details about this error. Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value. For example, rather than `{"instanceLimit": "100/request"\}`, should be returned as, `{"instanceLimitPerRequest": "100"\}`, if the client exceeds the number of instances that can be created in a single (batch) request.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.
         */
        reason?: string | null;
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
     * A group represents a subset of spokes attached to a hub.
     */
    export interface Schema$Group {
        /**
         * Optional. The auto-accept setting for this group.
         */
        autoAccept?: Schema$AutoAccept;
        /**
         * Output only. The time the group was created.
         */
        createTime?: string | null;
        /**
         * Optional. The description of the group.
         */
        description?: string | null;
        /**
         * Optional. Labels in key-value pair format. For more information about labels, see [Requirements for labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of the group. Group names must be unique. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub\}/groups/{group_id\}`
         */
        name?: string | null;
        /**
         * Output only. The name of the route table that corresponds to this group. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub_id\}/routeTables/{route_table_id\}`
         */
        routeTable?: string | null;
        /**
         * Output only. The current lifecycle state of this group.
         */
        state?: string | null;
        /**
         * Output only. The Google-generated UUID for the group. This value is unique across all group resources. If a group is deleted and another with the same name is created, the new route table is assigned a different unique_id.
         */
        uid?: string | null;
        /**
         * Output only. The time the group was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A Network Connectivity Center hub is a global management resource to which you attach spokes. A single hub can contain spokes from multiple regions. However, if any of a hub's spokes use the site-to-site data transfer feature, the resources associated with those spokes must all be in the same VPC network. Spokes that do not use site-to-site data transfer can be associated with any VPC network in your project.
     */
    export interface Schema$Hub {
        /**
         * Output only. The time the hub was created.
         */
        createTime?: string | null;
        /**
         * Optional. An optional description of the hub.
         */
        description?: string | null;
        /**
         * Optional. Whether Private Service Connect connection propagation is enabled for the hub. If true, Private Service Connect endpoints in VPC spokes attached to the hub are made accessible to other VPC spokes attached to the hub. The default value is false.
         */
        exportPsc?: boolean | null;
        /**
         * Optional labels in key-value pair format. For more information about labels, see [Requirements for labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of the hub. Hub names must be unique. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub_id\}`
         */
        name?: string | null;
        /**
         * Optional. The policy mode of this hub. This field can be either PRESET or CUSTOM. If unspecified, the policy_mode defaults to PRESET.
         */
        policyMode?: string | null;
        /**
         * Optional. The topology implemented in this hub. Currently, this field is only used when policy_mode = PRESET. The available preset topologies are MESH and STAR. If preset_topology is unspecified and policy_mode = PRESET, the preset_topology defaults to MESH. When policy_mode = CUSTOM, the preset_topology is set to PRESET_TOPOLOGY_UNSPECIFIED.
         */
        presetTopology?: string | null;
        /**
         * Output only. The route tables that belong to this hub. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub_id\}/routeTables/{route_table_id\}` This field is read-only. Network Connectivity Center automatically populates it based on the route tables nested under the hub.
         */
        routeTables?: string[] | null;
        /**
         * The VPC networks associated with this hub's spokes. This field is read-only. Network Connectivity Center automatically populates it based on the set of spokes attached to the hub.
         */
        routingVpcs?: Schema$RoutingVPC[];
        /**
         * Output only. A summary of the spokes associated with a hub. The summary includes a count of spokes according to type and according to state. If any spokes are inactive, the summary also lists the reasons they are inactive, including a count for each reason.
         */
        spokeSummary?: Schema$SpokeSummary;
        /**
         * Output only. The current lifecycle state of this hub.
         */
        state?: string | null;
        /**
         * Output only. The Google-generated UUID for the hub. This value is unique across all hub resources. If a hub is deleted and another with the same name is created, the new hub is assigned a different unique_id.
         */
        uniqueId?: string | null;
        /**
         * Output only. The time the hub was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A hub status entry represents the status of a set of propagated Private Service Connect connections grouped by certain fields.
     */
    export interface Schema$HubStatusEntry {
        /**
         * The number of propagated Private Service Connect connections with this status. If the `group_by` field was not set in the request message, the value of this field is 1.
         */
        count?: number | null;
        /**
         * The fields that this entry is grouped by. This has the same value as the `group_by` field in the request message.
         */
        groupBy?: string | null;
        /**
         * The Private Service Connect propagation status.
         */
        pscPropagationStatus?: Schema$PscPropagationStatus;
    }
    /**
     * InterconnectAttachment that this route applies to.
     */
    export interface Schema$InterconnectAttachment {
        /**
         * Optional. Cloud region to install this policy-based route on interconnect attachment. Use `all` to install it on all interconnect attachments.
         */
        region?: string | null;
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
         * The IP range that this internal range defines. NOTE: IPv6 ranges are limited to usage=EXTERNAL_TO_VPC and peering=FOR_SELF. NOTE: For IPv6 Ranges this field is compulsory, i.e. the address range must be specified explicitly.
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
         * An alternate to ip_cidr_range. Can be set when trying to create an IPv4 reservation that automatically finds a free range of the given size. If both ip_cidr_range and prefix_length are set, there is an error if the range sizes do not match. Can also be used during updates to change the range size. NOTE: For IPv6 this field only works if ip_cidr_range is set as well, and both fields must match. In other words, with IPv6 this field only works as a redundant parameter.
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
         * The type of usage set for this InternalRange.
         */
        usage?: string | null;
        /**
         * Output only. The list of resources that refer to this internal range. Resources that use the internal range for their range allocation are referred to as users of the range. Other resources mark themselves as users while doing so by creating a reference to this internal range. Having a user, based on this reference, prevents deletion of the internal range referred to. Can be empty.
         */
        users?: string[] | null;
    }
    /**
     * A collection of VLAN attachment resources. These resources should be redundant attachments that all advertise the same prefixes to Google Cloud. Alternatively, in active/passive configurations, all attachments should be capable of advertising the same prefixes.
     */
    export interface Schema$LinkedInterconnectAttachments {
        /**
         * Optional. IP ranges allowed to be included during import from hub (does not control transit connectivity). The only allowed value for now is "ALL_IPV4_RANGES".
         */
        includeImportRanges?: string[] | null;
        /**
         * A value that controls whether site-to-site data transfer is enabled for these resources. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URIs of linked interconnect attachment resources
         */
        uris?: string[] | null;
        /**
         * Output only. The VPC network where these VLAN attachments are located.
         */
        vpcNetwork?: string | null;
    }
    export interface Schema$LinkedProducerVpcNetwork {
        /**
         * Optional. IP ranges encompassing the subnets to be excluded from peering.
         */
        excludeExportRanges?: string[] | null;
        /**
         * Optional. IP ranges allowed to be included from peering.
         */
        includeExportRanges?: string[] | null;
        /**
         * Immutable. The URI of the Service Consumer VPC that the Producer VPC is peered with.
         */
        network?: string | null;
        /**
         * Immutable. The name of the VPC peering between the Service Consumer VPC and the Producer VPC (defined in the Tenant project) which is added to the NCC hub. This peering must be in ACTIVE state.
         */
        peering?: string | null;
        /**
         * Output only. The URI of the Producer VPC.
         */
        producerNetwork?: string | null;
        /**
         * Output only. The proposed exclude export IP ranges waiting for hub administration's approval.
         */
        proposedExcludeExportRanges?: string[] | null;
        /**
         * Optional. The proposed include export IP ranges waiting for hub administration's approval.
         */
        proposedIncludeExportRanges?: string[] | null;
        /**
         * Output only. The Service Consumer Network spoke.
         */
        serviceConsumerVpcSpoke?: string | null;
    }
    /**
     * A collection of router appliance instances. If you configure multiple router appliance instances to receive data from the same set of sites outside of Google Cloud, we recommend that you associate those instances with the same spoke.
     */
    export interface Schema$LinkedRouterApplianceInstances {
        /**
         * Optional. IP ranges allowed to be included during import from hub (does not control transit connectivity). The only allowed value for now is "ALL_IPV4_RANGES".
         */
        includeImportRanges?: string[] | null;
        /**
         * The list of router appliance instances.
         */
        instances?: Schema$RouterApplianceInstance[];
        /**
         * A value that controls whether site-to-site data transfer is enabled for these resources. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * Output only. The VPC network where these router appliance instances are located.
         */
        vpcNetwork?: string | null;
    }
    /**
     * An existing VPC network.
     */
    export interface Schema$LinkedVpcNetwork {
        /**
         * Optional. IP ranges encompassing the subnets to be excluded from peering.
         */
        excludeExportRanges?: string[] | null;
        /**
         * Optional. IP ranges allowed to be included from peering.
         */
        includeExportRanges?: string[] | null;
        /**
         * Output only. The list of Producer VPC spokes that this VPC spoke is a service consumer VPC spoke for. These producer VPCs are connected through VPC peering to this spoke's backing VPC network. Because they are directly connected through VPC peering, NCC export filters do not apply between the service consumer VPC spoke and any of its producer VPC spokes. This VPC spoke cannot be deleted as long as any of these producer VPC spokes are connected to the NCC Hub.
         */
        producerVpcSpokes?: string[] | null;
        /**
         * Output only. The proposed exclude export IP ranges waiting for hub administration's approval.
         */
        proposedExcludeExportRanges?: string[] | null;
        /**
         * Optional. The proposed include export IP ranges waiting for hub administration's approval.
         */
        proposedIncludeExportRanges?: string[] | null;
        /**
         * Required. The URI of the VPC network resource.
         */
        uri?: string | null;
    }
    /**
     * A collection of Cloud VPN tunnel resources. These resources should be redundant HA VPN tunnels that all advertise the same prefixes to Google Cloud. Alternatively, in a passive/active configuration, all tunnels should be capable of advertising the same prefixes.
     */
    export interface Schema$LinkedVpnTunnels {
        /**
         * Optional. IP ranges allowed to be included during import from hub (does not control transit connectivity). The only allowed value for now is "ALL_IPV4_RANGES".
         */
        includeImportRanges?: string[] | null;
        /**
         * A value that controls whether site-to-site data transfer is enabled for these resources. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URIs of linked VPN tunnel resources.
         */
        uris?: string[] | null;
        /**
         * Output only. The VPC network where these VPN tunnels are located.
         */
        vpcNetwork?: string | null;
    }
    /**
     * Response for HubService.ListGroups method.
     */
    export interface Schema$ListGroupsResponse {
        /**
         * The requested groups.
         */
        groups?: Schema$Group[];
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Hubs that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * The response for HubService.ListHubSpokes.
     */
    export interface Schema$ListHubSpokesResponse {
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * The requested spokes. The spoke fields can be partially populated based on the `view` field in the request message.
         */
        spokes?: Schema$Spoke[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for HubService.ListHubs method.
     */
    export interface Schema$ListHubsResponse {
        /**
         * The requested hubs.
         */
        hubs?: Schema$Hub[];
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
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
         * Internal ranges to be returned.
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
     * Response for PolicyBasedRoutingService.ListPolicyBasedRoutes method.
     */
    export interface Schema$ListPolicyBasedRoutesResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * Policy-based routes to be returned.
         */
        policyBasedRoutes?: Schema$PolicyBasedRoute[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListRegionalEndpoints.
     */
    export interface Schema$ListRegionalEndpointsResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * Regional endpoints to be returned.
         */
        regionalEndpoints?: Schema$RegionalEndpoint[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for HubService.ListRoutes method.
     */
    export interface Schema$ListRoutesResponse {
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * The requested routes.
         */
        routes?: Schema$Route[];
        /**
         * RouteTables that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for HubService.ListRouteTables method.
     */
    export interface Schema$ListRouteTablesResponse {
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * The requested route tables.
         */
        routeTables?: Schema$RouteTable[];
        /**
         * Hubs that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListServiceClasses.
     */
    export interface Schema$ListServiceClassesResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * ServiceClasses to be returned.
         */
        serviceClasses?: Schema$ServiceClass[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListServiceConnectionMaps.
     */
    export interface Schema$ListServiceConnectionMapsResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * ServiceConnectionMaps to be returned.
         */
        serviceConnectionMaps?: Schema$ServiceConnectionMap[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListServiceConnectionPolicies.
     */
    export interface Schema$ListServiceConnectionPoliciesResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * ServiceConnectionPolicies to be returned.
         */
        serviceConnectionPolicies?: Schema$ServiceConnectionPolicy[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListServiceConnectionTokens.
     */
    export interface Schema$ListServiceConnectionTokensResponse {
        /**
         * The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result.
         */
        nextPageToken?: string | null;
        /**
         * ServiceConnectionTokens to be returned.
         */
        serviceConnectionTokens?: Schema$ServiceConnectionToken[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * The response for HubService.ListSpokes.
     */
    export interface Schema$ListSpokesResponse {
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * The requested spokes.
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
     * Metadata about locations
     */
    export interface Schema$LocationMetadata {
        /**
         * List of supported features
         */
        locationFeatures?: string[] | null;
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
     * A route next hop that leads to an interconnect attachment resource.
     */
    export interface Schema$NextHopInterconnectAttachment {
        /**
         * Indicates whether site-to-site data transfer is allowed for this interconnect attachment resource. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URI of the interconnect attachment resource.
         */
        uri?: string | null;
        /**
         * The VPC network where this interconnect attachment is located.
         */
        vpcNetwork?: string | null;
    }
    /**
     * A route next hop that leads to a Router appliance instance.
     */
    export interface Schema$NextHopRouterApplianceInstance {
        /**
         * Indicates whether site-to-site data transfer is allowed for this Router appliance instance resource. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URI of the Router appliance instance.
         */
        uri?: string | null;
        /**
         * The VPC network where this VM is located.
         */
        vpcNetwork?: string | null;
    }
    /**
     * A route next hop that leads to a spoke resource.
     */
    export interface Schema$NextHopSpoke {
        /**
         * Indicates whether site-to-site data transfer is allowed for this spoke resource. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations). Whether this route is accessible to other hybrid spokes with site-to-site data transfer enabled. If this is false, the route is only accessible to VPC spokes of the connected Hub.
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URI of the spoke resource.
         */
        uri?: string | null;
    }
    export interface Schema$NextHopVpcNetwork {
        /**
         * The URI of the VPC network resource
         */
        uri?: string | null;
    }
    /**
     * A route next hop that leads to a VPN tunnel resource.
     */
    export interface Schema$NextHopVPNTunnel {
        /**
         * Indicates whether site-to-site data transfer is allowed for this VPN tunnel resource. Data transfer is available only in [supported locations](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/locations).
         */
        siteToSiteDataTransfer?: boolean | null;
        /**
         * The URI of the VPN tunnel resource.
         */
        uri?: string | null;
        /**
         * The VPC network where this VPN tunnel is located.
         */
        vpcNetwork?: string | null;
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
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have been cancelled successfully have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
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
     * Policy-based routes route L4 network traffic based on not just destination IP address, but also source IP address, protocol, and more. If a policy-based route conflicts with other types of routes, the policy-based route always takes precedence.
     */
    export interface Schema$PolicyBasedRoute {
        /**
         * Output only. Time when the policy-based route was created.
         */
        createTime?: string | null;
        /**
         * Optional. An optional description of this resource. Provide this field when you create the resource.
         */
        description?: string | null;
        /**
         * Required. The filter to match L4 traffic.
         */
        filter?: Schema$Filter;
        /**
         * Optional. The interconnect attachments that this policy-based route applies to.
         */
        interconnectAttachment?: Schema$InterconnectAttachment;
        /**
         * Output only. Type of this resource. Always networkconnectivity#policyBasedRoute for policy-based Route resources.
         */
        kind?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. A unique name of the resource in the form of `projects/{project_number\}/locations/global/PolicyBasedRoutes/{policy_based_route_id\}`
         */
        name?: string | null;
        /**
         * Required. Fully-qualified URL of the network that this route applies to, for example: projects/my-project/global/networks/my-network.
         */
        network?: string | null;
        /**
         * Optional. The IP address of a global-access-enabled L4 ILB that is the next hop for matching packets. For this version, only nextHopIlbIp is supported.
         */
        nextHopIlbIp?: string | null;
        /**
         * Optional. Other routes that will be referenced to determine the next hop of the packet.
         */
        nextHopOtherRoutes?: string | null;
        /**
         * Optional. The priority of this policy-based route. Priority is used to break ties in cases where there are more than one matching policy-based routes found. In cases where multiple policy-based routes are matched, the one with the lowest-numbered priority value wins. The default value is 1000. The priority value must be from 1 to 65535, inclusive.
         */
        priority?: number | null;
        /**
         * Output only. Server-defined fully-qualified URL for this resource.
         */
        selfLink?: string | null;
        /**
         * Output only. Time when the policy-based route was updated.
         */
        updateTime?: string | null;
        /**
         * Optional. VM instances that this policy-based route applies to.
         */
        virtualMachine?: Schema$VirtualMachine;
        /**
         * Output only. If potential misconfigurations are detected for this route, this field will be populated with warning messages.
         */
        warnings?: Schema$Warnings[];
    }
    /**
     * The PSC configurations on producer side.
     */
    export interface Schema$ProducerPscConfig {
        /**
         * The resource path of a service attachment. Example: projects/{projectNumOrId\}/regions/{region\}/serviceAttachments/{resourceId\}.
         */
        serviceAttachmentUri?: string | null;
    }
    /**
     * Configuration used for Private Service Connect connections. Used when Infrastructure is PSC.
     */
    export interface Schema$PscConfig {
        /**
         * Optional. List of Projects, Folders, or Organizations from where the Producer instance can be within. For example, a network administrator can provide both 'organizations/foo' and 'projects/bar' as allowed_google_producers_resource_hierarchy_levels. This allowlists this network to connect with any Producer instance within the 'foo' organization or the 'bar' project. By default, allowed_google_producers_resource_hierarchy_level is empty. The format for each allowed_google_producers_resource_hierarchy_level is / where is one of 'projects', 'folders', or 'organizations' and is either the ID or the number of the resource type. Format for each allowed_google_producers_resource_hierarchy_level value: 'projects/' or 'folders/' or 'organizations/' Eg. [projects/my-project-id, projects/567, folders/891, organizations/123]
         */
        allowedGoogleProducersResourceHierarchyLevel?: string[] | null;
        /**
         * Optional. Max number of PSC connections for this policy.
         */
        limit?: string | null;
        /**
         * Required. ProducerInstanceLocation is used to specify which authorization mechanism to use to determine which projects the Producer instance can be within.
         */
        producerInstanceLocation?: string | null;
        /**
         * The resource paths of subnetworks to use for IP address management. Example: projects/{projectNumOrId\}/regions/{region\}/subnetworks/{resourceId\}.
         */
        subnetworks?: string[] | null;
    }
    /**
     * Information about a specific Private Service Connect connection.
     */
    export interface Schema$PscConnection {
        /**
         * The resource reference of the consumer address.
         */
        consumerAddress?: string | null;
        /**
         * The resource reference of the PSC Forwarding Rule within the consumer VPC.
         */
        consumerForwardingRule?: string | null;
        /**
         * The project where the PSC connection is created.
         */
        consumerTargetProject?: string | null;
        /**
         * The most recent error during operating this connection. Deprecated, please use error_info instead.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Output only. The error info for the latest error during operating this connection.
         */
        errorInfo?: Schema$GoogleRpcErrorInfo;
        /**
         * The error type indicates whether the error is consumer facing, producer facing or system internal.
         */
        errorType?: string | null;
        /**
         * The last Compute Engine operation to setup PSC connection.
         */
        gceOperation?: string | null;
        /**
         * The requested IP version for the PSC connection.
         */
        ipVersion?: string | null;
        /**
         * Immutable. Deprecated. Use producer_instance_metadata instead. An immutable identifier for the producer instance.
         */
        producerInstanceId?: string | null;
        /**
         * Immutable. An immutable map for the producer instance metadata.
         */
        producerInstanceMetadata?: {
            [key: string]: string;
        } | null;
        /**
         * The PSC connection id of the PSC forwarding rule.
         */
        pscConnectionId?: string | null;
        /**
         * Output only. The URI of the subnetwork selected to allocate IP address for this connection.
         */
        selectedSubnetwork?: string | null;
        /**
         * Output only. [Output only] The service class associated with this PSC Connection. The value is derived from the SCPolicy and matches the service class name provided by the customer.
         */
        serviceClass?: string | null;
        /**
         * State of the PSC Connection
         */
        state?: string | null;
    }
    /**
     * The status of one or more propagated Private Service Connect connections in a hub.
     */
    export interface Schema$PscPropagationStatus {
        /**
         * The propagation status.
         */
        code?: string | null;
        /**
         * The human-readable summary of the Private Service Connect connection propagation status.
         */
        message?: string | null;
        /**
         * The name of the forwarding rule exported to the hub.
         */
        sourceForwardingRule?: string | null;
        /**
         * The name of the group that the source spoke belongs to.
         */
        sourceGroup?: string | null;
        /**
         * The name of the spoke that the source forwarding rule belongs to.
         */
        sourceSpoke?: string | null;
        /**
         * The name of the group that the target spoke belongs to.
         */
        targetGroup?: string | null;
        /**
         * The name of the spoke that the source forwarding rule propagates to.
         */
        targetSpoke?: string | null;
    }
    /**
     * The response for HubService.QueryHubStatus.
     */
    export interface Schema$QueryHubStatusResponse {
        /**
         * The list of hub status.
         */
        hubStatusEntries?: Schema$HubStatusEntry[];
        /**
         * The token for the next page of the response. To see more results, use this value as the page_token for your next request. If this value is empty, there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * The RegionalEndpoint resource.
     */
    export interface Schema$RegionalEndpoint {
        /**
         * Required. The access type of this regional endpoint. This field is reflected in the PSC Forwarding Rule configuration to enable global access.
         */
        accessType?: string | null;
        /**
         * Optional. The IP Address of the Regional Endpoint. When no address is provided, an IP from the subnetwork is allocated. Use one of the following formats: * IPv4 address as in `10.0.0.1` * Address resource URI as in `projects/{project\}/regions/{region\}/addresses/{address_name\}` for an IPv4 or IPv6 address.
         */
        address?: string | null;
        /**
         * Output only. Time when the RegionalEndpoint was created.
         */
        createTime?: string | null;
        /**
         * Optional. A description of this resource.
         */
        description?: string | null;
        /**
         * Output only. The literal IP address of the PSC Forwarding Rule created on behalf of the customer. This field is deprecated. Use address instead.
         */
        ipAddress?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The name of a RegionalEndpoint. Pattern: `projects/{project\}/locations/{location\}/regionalEndpoints/^[-a-z0-9](?:[-a-z0-9]{0,44\})[a-z0-9]$`.
         */
        name?: string | null;
        /**
         * The name of the VPC network for this private regional endpoint. Format: `projects/{project\}/global/networks/{network\}`
         */
        network?: string | null;
        /**
         * Output only. The resource reference of the PSC Forwarding Rule created on behalf of the customer. Format: `//compute.googleapis.com/projects/{project\}/regions/{region\}/forwardingRules/{forwarding_rule_name\}`
         */
        pscForwardingRule?: string | null;
        /**
         * The name of the subnetwork from which the IP address will be allocated. Format: `projects/{project\}/regions/{region\}/subnetworks/{subnetwork\}`
         */
        subnetwork?: string | null;
        /**
         * Required. The service endpoint this private regional endpoint connects to. Format: `{apiname\}.{region\}.p.rep.googleapis.com` Example: "cloudkms.us-central1.p.rep.googleapis.com".
         */
        targetGoogleApi?: string | null;
        /**
         * Output only. Time when the RegionalEndpoint was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The request for HubService.RejectHubSpoke.
     */
    export interface Schema$RejectHubSpokeRequest {
        /**
         * Optional. Additional information provided by the hub administrator.
         */
        details?: string | null;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The URI of the spoke to reject from the hub.
         */
        spokeUri?: string | null;
    }
    /**
     * The response for HubService.RejectHubSpoke.
     */
    export interface Schema$RejectHubSpokeResponse {
        /**
         * The spoke that was operated on.
         */
        spoke?: Schema$Spoke;
    }
    /**
     * The request for HubService.RejectSpokeUpdate.
     */
    export interface Schema$RejectSpokeUpdateRequest {
        /**
         * Optional. Additional information provided by the hub administrator.
         */
        details?: string | null;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The etag of the spoke to reject update.
         */
        spokeEtag?: string | null;
        /**
         * Required. The URI of the spoke to reject update.
         */
        spokeUri?: string | null;
    }
    /**
     * A route defines a path from VM instances within a spoke to a specific destination resource. Only VPC spokes have routes.
     */
    export interface Schema$Route {
        /**
         * Output only. The time the route was created.
         */
        createTime?: string | null;
        /**
         * An optional description of the route.
         */
        description?: string | null;
        /**
         * The destination IP address range.
         */
        ipCidrRange?: string | null;
        /**
         * Optional labels in key-value pair format. For more information about labels, see [Requirements for labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The origin location of the route. Uses the following form: "projects/{project\}/locations/{location\}" Example: projects/1234/locations/us-central1
         */
        location?: string | null;
        /**
         * Immutable. The name of the route. Route names must be unique. Route names use the following form: `projects/{project_number\}/locations/global/hubs/{hub\}/routeTables/{route_table_id\}/routes/{route_id\}`
         */
        name?: string | null;
        /**
         * Immutable. The next-hop VLAN attachment for packets on this route.
         */
        nextHopInterconnectAttachment?: Schema$NextHopInterconnectAttachment;
        /**
         * Immutable. The next-hop Router appliance instance for packets on this route.
         */
        nextHopRouterApplianceInstance?: Schema$NextHopRouterApplianceInstance;
        /**
         * Immutable. The next-hop spoke for packets on this route.
         */
        nextHopSpoke?: Schema$NextHopSpoke;
        /**
         * Immutable. The destination VPC network for packets on this route.
         */
        nextHopVpcNetwork?: Schema$NextHopVpcNetwork;
        /**
         * Immutable. The next-hop VPN tunnel for packets on this route.
         */
        nextHopVpnTunnel?: Schema$NextHopVPNTunnel;
        /**
         * Output only. The priority of this route. Priority is used to break ties in cases where a destination matches more than one route. In these cases the route with the lowest-numbered priority value wins.
         */
        priority?: string | null;
        /**
         * Immutable. The spoke that this route leads to. Example: projects/12345/locations/global/spokes/SPOKE
         */
        spoke?: string | null;
        /**
         * Output only. The current lifecycle state of the route.
         */
        state?: string | null;
        /**
         * Output only. The route's type. Its type is determined by the properties of its IP address range.
         */
        type?: string | null;
        /**
         * Output only. The Google-generated UUID for the route. This value is unique across all Network Connectivity Center route resources. If a route is deleted and another with the same name is created, the new route is assigned a different `uid`.
         */
        uid?: string | null;
        /**
         * Output only. The time the route was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A router appliance instance is a Compute Engine virtual machine (VM) instance that acts as a BGP speaker. A router appliance instance is specified by the URI of the VM and the internal IP address of one of the VM's network interfaces.
     */
    export interface Schema$RouterApplianceInstance {
        /**
         * The IP address on the VM to use for peering.
         */
        ipAddress?: string | null;
        /**
         * The URI of the VM.
         */
        virtualMachine?: string | null;
    }
    export interface Schema$RouteTable {
        /**
         * Output only. The time the route table was created.
         */
        createTime?: string | null;
        /**
         * An optional description of the route table.
         */
        description?: string | null;
        /**
         * Optional labels in key-value pair format. For more information about labels, see [Requirements for labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of the route table. Route table names must be unique. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub\}/routeTables/{route_table_id\}`
         */
        name?: string | null;
        /**
         * Output only. The current lifecycle state of this route table.
         */
        state?: string | null;
        /**
         * Output only. The Google-generated UUID for the route table. This value is unique across all route table resources. If a route table is deleted and another with the same name is created, the new route table is assigned a different `uid`.
         */
        uid?: string | null;
        /**
         * Output only. The time the route table was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * RoutingVPC contains information about the VPC networks associated with the spokes of a Network Connectivity Center hub.
     */
    export interface Schema$RoutingVPC {
        /**
         * Output only. If true, indicates that this VPC network is currently associated with spokes that use the data transfer feature (spokes where the site_to_site_data_transfer field is set to true). If you create new spokes that use data transfer, they must be associated with this VPC network. At most, one VPC network will have this field set to true.
         */
        requiredForNewSiteToSiteDataTransferSpokes?: boolean | null;
        /**
         * The URI of the VPC network.
         */
        uri?: string | null;
    }
    /**
     * The ServiceClass resource.
     */
    export interface Schema$ServiceClass {
        /**
         * Output only. Time when the ServiceClass was created.
         */
        createTime?: string | null;
        /**
         * A description of this resource.
         */
        description?: string | null;
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of a ServiceClass resource. Format: projects/{project\}/locations/{location\}/serviceClasses/{service_class\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string | null;
        /**
         * Output only. The generated service class name. Use this name to refer to the Service class in Service Connection Maps and Service Connection Policies.
         */
        serviceClass?: string | null;
        /**
         * Output only. Time when the ServiceClass was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The ServiceConnectionMap resource.
     */
    export interface Schema$ServiceConnectionMap {
        /**
         * The PSC configurations on consumer side.
         */
        consumerPscConfigs?: Schema$ConsumerPscConfig[];
        /**
         * Output only. PSC connection details on consumer side.
         */
        consumerPscConnections?: Schema$ConsumerPscConnection[];
        /**
         * Output only. Time when the ServiceConnectionMap was created.
         */
        createTime?: string | null;
        /**
         * A description of this resource.
         */
        description?: string | null;
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Output only. The infrastructure used for connections between consumers/producers.
         */
        infrastructure?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of a ServiceConnectionMap. Format: projects/{project\}/locations/{location\}/serviceConnectionMaps/{service_connection_map\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string | null;
        /**
         * The PSC configurations on producer side.
         */
        producerPscConfigs?: Schema$ProducerPscConfig[];
        /**
         * The service class identifier this ServiceConnectionMap is for. The user of ServiceConnectionMap create API needs to have networkconnecitivty.serviceclasses.use iam permission for the service class.
         */
        serviceClass?: string | null;
        /**
         * Output only. The service class uri this ServiceConnectionMap is for.
         */
        serviceClassUri?: string | null;
        /**
         * The token provided by the consumer. This token authenticates that the consumer can create a connection within the specified project and network.
         */
        token?: string | null;
        /**
         * Output only. Time when the ServiceConnectionMap was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The ServiceConnectionPolicy resource.
     */
    export interface Schema$ServiceConnectionPolicy {
        /**
         * Output only. Time when the ServiceConnectionPolicy was created.
         */
        createTime?: string | null;
        /**
         * A description of this resource.
         */
        description?: string | null;
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Output only. The type of underlying resources used to create the connection.
         */
        infrastructure?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of a ServiceConnectionPolicy. Format: projects/{project\}/locations/{location\}/serviceConnectionPolicies/{service_connection_policy\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string | null;
        /**
         * The resource path of the consumer network. Example: - projects/{projectNumOrId\}/global/networks/{resourceId\}.
         */
        network?: string | null;
        /**
         * Configuration used for Private Service Connect connections. Used when Infrastructure is PSC.
         */
        pscConfig?: Schema$PscConfig;
        /**
         * Output only. [Output only] Information about each Private Service Connect connection.
         */
        pscConnections?: Schema$PscConnection[];
        /**
         * The service class identifier for which this ServiceConnectionPolicy is for. The service class identifier is a unique, symbolic representation of a ServiceClass. It is provided by the Service Producer. Google services have a prefix of gcp or google-cloud. For example, gcp-memorystore-redis or google-cloud-sql. 3rd party services do not. For example, test-service-a3dfcx.
         */
        serviceClass?: string | null;
        /**
         * Output only. Time when the ServiceConnectionPolicy was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The ServiceConnectionToken resource.
     */
    export interface Schema$ServiceConnectionToken {
        /**
         * Output only. Time when the ServiceConnectionToken was created.
         */
        createTime?: string | null;
        /**
         * A description of this resource.
         */
        description?: string | null;
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Output only. The time to which this token is valid.
         */
        expireTime?: string | null;
        /**
         * User-defined labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of a ServiceConnectionToken. Format: projects/{project\}/locations/{location\}/ServiceConnectionTokens/{service_connection_token\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string | null;
        /**
         * The resource path of the network associated with this token. Example: projects/{projectNumOrId\}/global/networks/{resourceId\}.
         */
        network?: string | null;
        /**
         * Output only. The token generated by Automation.
         */
        token?: string | null;
        /**
         * Output only. Time when the ServiceConnectionToken was updated.
         */
        updateTime?: string | null;
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
     * A Network Connectivity Center spoke represents one or more network connectivity resources. When you create a spoke, you associate it with a hub. You must also identify a value for exactly one of the following fields: * linked_vpn_tunnels * linked_interconnect_attachments * linked_router_appliance_instances * linked_vpc_network
     */
    export interface Schema$Spoke {
        /**
         * Output only. The time the spoke was created.
         */
        createTime?: string | null;
        /**
         * Optional. An optional description of the spoke.
         */
        description?: string | null;
        /**
         * Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Optional. The list of fields waiting for hub administration's approval.
         */
        fieldPathsPendingUpdate?: string[] | null;
        /**
         * Optional. The name of the group that this spoke is associated with.
         */
        group?: string | null;
        /**
         * Immutable. The name of the hub that this spoke is attached to.
         */
        hub?: string | null;
        /**
         * Optional labels in key-value pair format. For more information about labels, see [Requirements for labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements).
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. VLAN attachments that are associated with the spoke.
         */
        linkedInterconnectAttachments?: Schema$LinkedInterconnectAttachments;
        /**
         * Optional. The linked producer VPC that is associated with the spoke.
         */
        linkedProducerVpcNetwork?: Schema$LinkedProducerVpcNetwork;
        /**
         * Optional. Router appliance instances that are associated with the spoke.
         */
        linkedRouterApplianceInstances?: Schema$LinkedRouterApplianceInstances;
        /**
         * Optional. VPC network that is associated with the spoke.
         */
        linkedVpcNetwork?: Schema$LinkedVpcNetwork;
        /**
         * Optional. VPN tunnels that are associated with the spoke.
         */
        linkedVpnTunnels?: Schema$LinkedVpnTunnels;
        /**
         * Immutable. The name of the spoke. Spoke names must be unique. They use the following form: `projects/{project_number\}/locations/{region\}/spokes/{spoke_id\}`
         */
        name?: string | null;
        /**
         * Output only. The reasons for current state of the spoke.
         */
        reasons?: Schema$StateReason[];
        /**
         * Output only. The type of resource associated with the spoke.
         */
        spokeType?: string | null;
        /**
         * Output only. The current lifecycle state of this spoke.
         */
        state?: string | null;
        /**
         * Output only. The Google-generated UUID for the spoke. This value is unique across all spoke resources. If a spoke is deleted and another with the same name is created, the new spoke is assigned a different `unique_id`.
         */
        uniqueId?: string | null;
        /**
         * Output only. The time the spoke was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The number of spokes that are in a particular state and associated with a given hub.
     */
    export interface Schema$SpokeStateCount {
        /**
         * Output only. The total number of spokes that are in this state and associated with a given hub.
         */
        count?: string | null;
        /**
         * Output only. The state of the spokes.
         */
        state?: string | null;
    }
    /**
     * The number of spokes in the hub that are inactive for this reason.
     */
    export interface Schema$SpokeStateReasonCount {
        /**
         * Output only. The total number of spokes that are inactive for a particular reason and associated with a given hub.
         */
        count?: string | null;
        /**
         * Output only. The reason that a spoke is inactive.
         */
        stateReasonCode?: string | null;
    }
    /**
     * Summarizes information about the spokes associated with a hub. The summary includes a count of spokes according to type and according to state. If any spokes are inactive, the summary also lists the reasons they are inactive, including a count for each reason.
     */
    export interface Schema$SpokeSummary {
        /**
         * Output only. Counts the number of spokes that are in each state and associated with a given hub.
         */
        spokeStateCounts?: Schema$SpokeStateCount[];
        /**
         * Output only. Counts the number of spokes that are inactive for each possible reason and associated with a given hub.
         */
        spokeStateReasonCounts?: Schema$SpokeStateReasonCount[];
        /**
         * Output only. Counts the number of spokes of each type that are associated with a specific hub.
         */
        spokeTypeCounts?: Schema$SpokeTypeCount[];
    }
    /**
     * The number of spokes of a given type that are associated with a specific hub. The type indicates what kind of resource is associated with the spoke.
     */
    export interface Schema$SpokeTypeCount {
        /**
         * Output only. The total number of spokes of this type that are associated with the hub.
         */
        count?: string | null;
        /**
         * Output only. The type of the spokes.
         */
        spokeType?: string | null;
    }
    /**
     * The reason a spoke is inactive.
     */
    export interface Schema$StateReason {
        /**
         * The code associated with this reason.
         */
        code?: string | null;
        /**
         * Human-readable details about this reason.
         */
        message?: string | null;
        /**
         * Additional information provided by the user in the RejectSpoke call.
         */
        userDetails?: string | null;
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
    /**
     * VM instances that this policy-based route applies to.
     */
    export interface Schema$VirtualMachine {
        /**
         * Optional. A list of VM instance tags that this policy-based route applies to. VM instances that have ANY of tags specified here installs this PBR.
         */
        tags?: string[] | null;
    }
    /**
     * Informational warning message.
     */
    export interface Schema$Warnings {
        /**
         * Output only. A warning code, if applicable.
         */
        code?: string | null;
        /**
         * Output only. Metadata about this warning in key: value format. The key should provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement.
         */
        data?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. A human-readable description of the warning code.
         */
        warningMessage?: string | null;
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
        regionalEndpoints: Resource$Projects$Locations$Regionalendpoints;
        serviceClasses: Resource$Projects$Locations$Serviceclasses;
        serviceConnectionMaps: Resource$Projects$Locations$Serviceconnectionmaps;
        serviceConnectionPolicies: Resource$Projects$Locations$Serviceconnectionpolicies;
        serviceConnectionTokens: Resource$Projects$Locations$Serviceconnectiontokens;
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
        policyBasedRoutes: Resource$Projects$Locations$Global$Policybasedroutes;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Global$Hubs {
        context: APIRequestContext;
        groups: Resource$Projects$Locations$Global$Hubs$Groups;
        routeTables: Resource$Projects$Locations$Global$Hubs$Routetables;
        constructor(context: APIRequestContext);
        /**
         * Accepts a proposal to attach a Network Connectivity Center spoke to a hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        acceptSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        acceptSpoke(params?: Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        acceptSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acceptSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        acceptSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        acceptSpoke(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Accepts a proposal to update a Network Connectivity Center spoke in a hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        acceptSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        acceptSpokeUpdate(params?: Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        acceptSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acceptSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        acceptSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        acceptSpokeUpdate(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
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
         * Lists the Network Connectivity Center spokes associated with a specified hub and location. The list includes both spokes that are attached to the hub and spokes that have been proposed but not yet accepted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listSpokes(params: Params$Resource$Projects$Locations$Global$Hubs$Listspokes, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listSpokes(params?: Params$Resource$Projects$Locations$Global$Hubs$Listspokes, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListHubSpokesResponse>>;
        listSpokes(params: Params$Resource$Projects$Locations$Global$Hubs$Listspokes, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listSpokes(params: Params$Resource$Projects$Locations$Global$Hubs$Listspokes, options: MethodOptions | BodyResponseCallback<Schema$ListHubSpokesResponse>, callback: BodyResponseCallback<Schema$ListHubSpokesResponse>): void;
        listSpokes(params: Params$Resource$Projects$Locations$Global$Hubs$Listspokes, callback: BodyResponseCallback<Schema$ListHubSpokesResponse>): void;
        listSpokes(callback: BodyResponseCallback<Schema$ListHubSpokesResponse>): void;
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
         * Query the Private Service Connect propagation status of a Network Connectivity Center hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryStatus(params: Params$Resource$Projects$Locations$Global$Hubs$Querystatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryStatus(params?: Params$Resource$Projects$Locations$Global$Hubs$Querystatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$QueryHubStatusResponse>>;
        queryStatus(params: Params$Resource$Projects$Locations$Global$Hubs$Querystatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryStatus(params: Params$Resource$Projects$Locations$Global$Hubs$Querystatus, options: MethodOptions | BodyResponseCallback<Schema$QueryHubStatusResponse>, callback: BodyResponseCallback<Schema$QueryHubStatusResponse>): void;
        queryStatus(params: Params$Resource$Projects$Locations$Global$Hubs$Querystatus, callback: BodyResponseCallback<Schema$QueryHubStatusResponse>): void;
        queryStatus(callback: BodyResponseCallback<Schema$QueryHubStatusResponse>): void;
        /**
         * Rejects a Network Connectivity Center spoke from being attached to a hub. If the spoke was previously in the `ACTIVE` state, it transitions to the `INACTIVE` state and is no longer able to connect to other spokes that are attached to the hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rejectSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rejectSpoke(params?: Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        rejectSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rejectSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        rejectSpoke(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        rejectSpoke(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Rejects a proposal to update a Network Connectivity Center spoke in a hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rejectSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rejectSpokeUpdate(params?: Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        rejectSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rejectSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        rejectSpokeUpdate(params: Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        rejectSpokeUpdate(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
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
    export interface Params$Resource$Projects$Locations$Global$Hubs$Acceptspoke extends StandardParameters {
        /**
         * Required. The name of the hub into which to accept the spoke.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AcceptHubSpokeRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Acceptspokeupdate extends StandardParameters {
        /**
         * Required. The name of the hub to accept spoke update.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AcceptSpokeUpdateRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Create extends StandardParameters {
        /**
         * Required. A unique identifier for the hub.
         */
        hubId?: string;
        /**
         * Required. The parent resource.
         */
        parent?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hub;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Delete extends StandardParameters {
        /**
         * Required. The name of the hub to delete.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Get extends StandardParameters {
        /**
         * Required. The name of the hub resource to get.
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
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results per page to return.
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
    export interface Params$Resource$Projects$Locations$Global$Hubs$Listspokes extends StandardParameters {
        /**
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Required. The name of the hub.
         */
        name?: string;
        /**
         * Sort the results by name or create_time.
         */
        orderBy?: string;
        /**
         * The maximum number of results to return per page.
         */
        pageSize?: number;
        /**
         * The page token.
         */
        pageToken?: string;
        /**
         * A list of locations. Specify one of the following: `[global]`, a single region (for example, `[us-central1]`), or a combination of values (for example, `[global, us-central1, us-west1]`). If the spoke_locations field is populated, the list of results includes only spokes in the specified location. If the spoke_locations field is not populated, the list of results includes spokes in all locations.
         */
        spokeLocations?: string[];
        /**
         * The view of the spoke to return. The view that you use determines which spoke fields are included in the response.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Patch extends StandardParameters {
        /**
         * Immutable. The name of the hub. Hub names must be unique. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub_id\}`
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. In the case of an update to an existing hub, field mask is used to specify the fields to be overwritten. The fields specified in the update_mask are relative to the resource, not the full request. A field is overwritten if it is in the mask. If the user does not provide a mask, then all fields are overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hub;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Querystatus extends StandardParameters {
        /**
         * Optional. An expression that filters the list of results. The filter can be used to filter the results by the following fields: * `psc_propagation_status.source_spoke` * `psc_propagation_status.source_group` * `psc_propagation_status.source_forwarding_rule` * `psc_propagation_status.target_spoke` * `psc_propagation_status.target_group` * `psc_propagation_status.code` * `psc_propagation_status.message`
         */
        filter?: string;
        /**
         * Optional. Aggregate the results by the specified fields. A comma-separated list of any of these fields: * `psc_propagation_status.source_spoke` * `psc_propagation_status.source_group` * `psc_propagation_status.source_forwarding_rule` * `psc_propagation_status.target_spoke` * `psc_propagation_status.target_group` * `psc_propagation_status.code`
         */
        groupBy?: string;
        /**
         * Required. The name of the hub.
         */
        name?: string;
        /**
         * Optional. Sort the results in ascending order by the specified fields. A comma-separated list of any of these fields: * `psc_propagation_status.source_spoke` * `psc_propagation_status.source_group` * `psc_propagation_status.source_forwarding_rule` * `psc_propagation_status.target_spoke` * `psc_propagation_status.target_group` * `psc_propagation_status.code` If `group_by` is set, the value of the `order_by` field must be the same as or a subset of the `group_by` field.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of results to return per page.
         */
        pageSize?: number;
        /**
         * Optional. The page token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Rejectspoke extends StandardParameters {
        /**
         * Required. The name of the hub from which to reject the spoke.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RejectHubSpokeRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Rejectspokeupdate extends StandardParameters {
        /**
         * Required. The name of the hub to reject spoke update.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RejectSpokeUpdateRequest;
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
    export class Resource$Projects$Locations$Global$Hubs$Groups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets details about a Network Connectivity Center group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Group>>;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Get, options: MethodOptions | BodyResponseCallback<Schema$Group>, callback: BodyResponseCallback<Schema$Group>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Get, callback: BodyResponseCallback<Schema$Group>): void;
        get(callback: BodyResponseCallback<Schema$Group>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists groups in a given hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListGroupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$List, options: MethodOptions | BodyResponseCallback<Schema$ListGroupsResponse>, callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$List, callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        /**
         * Updates the parameters of a Network Connectivity Center group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$Get extends StandardParameters {
        /**
         * Required. The name of the route table resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$List extends StandardParameters {
        /**
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results to return per page.
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
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$Patch extends StandardParameters {
        /**
         * Immutable. The name of the group. Group names must be unique. They use the following form: `projects/{project_number\}/locations/global/hubs/{hub\}/groups/{group_id\}`
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. In the case of an update to an existing group, field mask is used to specify the fields to be overwritten. The fields specified in the update_mask are relative to the resource, not the full request. A field is overwritten if it is in the mask. If the user does not provide a mask, then all fields are overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Group;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Groups$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Global$Hubs$Routetables {
        context: APIRequestContext;
        routes: Resource$Projects$Locations$Global$Hubs$Routetables$Routes;
        constructor(context: APIRequestContext);
        /**
         * Gets details about a Network Connectivity Center route table.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RouteTable>>;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get, options: MethodOptions | BodyResponseCallback<Schema$RouteTable>, callback: BodyResponseCallback<Schema$RouteTable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get, callback: BodyResponseCallback<Schema$RouteTable>): void;
        get(callback: BodyResponseCallback<Schema$RouteTable>): void;
        /**
         * Lists route tables in a given hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Global$Hubs$Routetables$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRouteTablesResponse>>;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$List, options: MethodOptions | BodyResponseCallback<Schema$ListRouteTablesResponse>, callback: BodyResponseCallback<Schema$ListRouteTablesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$List, callback: BodyResponseCallback<Schema$ListRouteTablesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRouteTablesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Routetables$Get extends StandardParameters {
        /**
         * Required. The name of the route table resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Routetables$List extends StandardParameters {
        /**
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results to return per page.
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
    export class Resource$Projects$Locations$Global$Hubs$Routetables$Routes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets details about the specified route.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Route>>;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get, options: MethodOptions | BodyResponseCallback<Schema$Route>, callback: BodyResponseCallback<Schema$Route>): void;
        get(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get, callback: BodyResponseCallback<Schema$Route>): void;
        get(callback: BodyResponseCallback<Schema$Route>): void;
        /**
         * Lists routes in a given route table.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRoutesResponse>>;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List, options: MethodOptions | BodyResponseCallback<Schema$ListRoutesResponse>, callback: BodyResponseCallback<Schema$ListRoutesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List, callback: BodyResponseCallback<Schema$ListRoutesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRoutesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$Get extends StandardParameters {
        /**
         * Required. The name of the route resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Hubs$Routetables$Routes$List extends StandardParameters {
        /**
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results to return per page.
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
    export class Resource$Projects$Locations$Global$Policybasedroutes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new policy-based route in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single policy-based route.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single policy-based route.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PolicyBasedRoute>>;
        get(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Get, options: MethodOptions | BodyResponseCallback<Schema$PolicyBasedRoute>, callback: BodyResponseCallback<Schema$PolicyBasedRoute>): void;
        get(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Get, callback: BodyResponseCallback<Schema$PolicyBasedRoute>): void;
        get(callback: BodyResponseCallback<Schema$PolicyBasedRoute>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists policy-based routes in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPolicyBasedRoutesResponse>>;
        list(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$List, options: MethodOptions | BodyResponseCallback<Schema$ListPolicyBasedRoutesResponse>, callback: BodyResponseCallback<Schema$ListPolicyBasedRoutesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$List, callback: BodyResponseCallback<Schema$ListPolicyBasedRoutesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPolicyBasedRoutesResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Create extends StandardParameters {
        /**
         * Required. The parent resource's name of the PolicyBasedRoute.
         */
        parent?: string;
        /**
         * Required. Unique id for the policy-based route to create. Provided by the client when the resource is created. The name must comply with https://google.aip.dev/122#resource-id-segments. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([a-z0-9-]*[a-z0-9])?. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.
         */
        policyBasedRouteId?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, ignores the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PolicyBasedRoute;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Delete extends StandardParameters {
        /**
         * Required. Name of the policy-based route resource to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, ignores the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Get extends StandardParameters {
        /**
         * Required. Name of the PolicyBasedRoute resource to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$List extends StandardParameters {
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
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Global$Policybasedroutes$Testiampermissions extends StandardParameters {
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
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Create extends StandardParameters {
        /**
         * Optional. Resource ID (i.e. 'foo' in '[...]/projects/p/locations/l/internalRanges/foo') See https://google.aip.dev/122#resource-id-segments Unique per location.
         */
        internalRangeId?: string;
        /**
         * Required. The parent resource's name of the internal range.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InternalRange;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Delete extends StandardParameters {
        /**
         * Required. The name of the internal range to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Internalranges$Get extends StandardParameters {
        /**
         * Required. Name of the InternalRange to get.
         */
        name?: string;
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
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the InternalRange resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InternalRange;
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
    export class Resource$Projects$Locations$Regionalendpoints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new RegionalEndpoint in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Regionalendpoints$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Regionalendpoints$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Regionalendpoints$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Regionalendpoints$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Regionalendpoints$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single RegionalEndpoint.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Regionalendpoints$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Regionalendpoints$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Regionalendpoints$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Regionalendpoints$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Regionalendpoints$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single RegionalEndpoint.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Regionalendpoints$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Regionalendpoints$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RegionalEndpoint>>;
        get(params: Params$Resource$Projects$Locations$Regionalendpoints$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Regionalendpoints$Get, options: MethodOptions | BodyResponseCallback<Schema$RegionalEndpoint>, callback: BodyResponseCallback<Schema$RegionalEndpoint>): void;
        get(params: Params$Resource$Projects$Locations$Regionalendpoints$Get, callback: BodyResponseCallback<Schema$RegionalEndpoint>): void;
        get(callback: BodyResponseCallback<Schema$RegionalEndpoint>): void;
        /**
         * Lists RegionalEndpoints in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Regionalendpoints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Regionalendpoints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRegionalEndpointsResponse>>;
        list(params: Params$Resource$Projects$Locations$Regionalendpoints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Regionalendpoints$List, options: MethodOptions | BodyResponseCallback<Schema$ListRegionalEndpointsResponse>, callback: BodyResponseCallback<Schema$ListRegionalEndpointsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Regionalendpoints$List, callback: BodyResponseCallback<Schema$ListRegionalEndpointsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRegionalEndpointsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Regionalendpoints$Create extends StandardParameters {
        /**
         * Required. The parent resource's name of the RegionalEndpoint.
         */
        parent?: string;
        /**
         * Required. Unique id of the Regional Endpoint to be created. @pattern: ^[-a-z0-9](?:[-a-z0-9]{0,44\})[a-z0-9]$
         */
        regionalEndpointId?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if the original operation with the same request ID was received, and if so, ignores the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RegionalEndpoint;
    }
    export interface Params$Resource$Projects$Locations$Regionalendpoints$Delete extends StandardParameters {
        /**
         * Required. The name of the RegionalEndpoint to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if the original operation with the same request ID was received, and if so, ignores the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Regionalendpoints$Get extends StandardParameters {
        /**
         * Required. Name of the RegionalEndpoint resource to get. Format: `projects/{project\}/locations/{location\}/regionalEndpoints/{regional_endpoint\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Regionalendpoints$List extends StandardParameters {
        /**
         * A filter expression that filters the results listed in the response.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource's name of the RegionalEndpoint.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Serviceclasses {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a single ServiceClass.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Serviceclasses$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Serviceclasses$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Serviceclasses$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceclasses$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceclasses$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single ServiceClass.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Serviceclasses$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Serviceclasses$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceClass>>;
        get(params: Params$Resource$Projects$Locations$Serviceclasses$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Serviceclasses$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceClass>, callback: BodyResponseCallback<Schema$ServiceClass>): void;
        get(params: Params$Resource$Projects$Locations$Serviceclasses$Get, callback: BodyResponseCallback<Schema$ServiceClass>): void;
        get(callback: BodyResponseCallback<Schema$ServiceClass>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists ServiceClasses in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Serviceclasses$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Serviceclasses$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceClassesResponse>>;
        list(params: Params$Resource$Projects$Locations$Serviceclasses$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Serviceclasses$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceClassesResponse>, callback: BodyResponseCallback<Schema$ListServiceClassesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Serviceclasses$List, callback: BodyResponseCallback<Schema$ListServiceClassesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceClassesResponse>): void;
        /**
         * Updates the parameters of a single ServiceClass.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Serviceclasses$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Serviceclasses$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Serviceclasses$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceclasses$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceclasses$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Delete extends StandardParameters {
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string;
        /**
         * Required. The name of the ServiceClass to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Get extends StandardParameters {
        /**
         * Required. Name of the ServiceClass to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$List extends StandardParameters {
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
         * Required. The parent resource's name. ex. projects/123/locations/us-east1
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Patch extends StandardParameters {
        /**
         * Immutable. The name of a ServiceClass resource. Format: projects/{project\}/locations/{location\}/serviceClasses/{service_class\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the ServiceClass resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceClass;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Serviceclasses$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Serviceconnectionmaps {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ServiceConnectionMap in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single ServiceConnectionMap.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single ServiceConnectionMap.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceConnectionMap>>;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceConnectionMap>, callback: BodyResponseCallback<Schema$ServiceConnectionMap>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Get, callback: BodyResponseCallback<Schema$ServiceConnectionMap>): void;
        get(callback: BodyResponseCallback<Schema$ServiceConnectionMap>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists ServiceConnectionMaps in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceConnectionMapsResponse>>;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceConnectionMapsResponse>, callback: BodyResponseCallback<Schema$ListServiceConnectionMapsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$List, callback: BodyResponseCallback<Schema$ListServiceConnectionMapsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceConnectionMapsResponse>): void;
        /**
         * Updates the parameters of a single ServiceConnectionMap.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Create extends StandardParameters {
        /**
         * Required. The parent resource's name of the ServiceConnectionMap. ex. projects/123/locations/us-east1
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Resource ID (i.e. 'foo' in '[...]/projects/p/locations/l/serviceConnectionMaps/foo') See https://google.aip.dev/122#resource-id-segments Unique per location. If one is not provided, one will be generated.
         */
        serviceConnectionMapId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceConnectionMap;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Delete extends StandardParameters {
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string;
        /**
         * Required. The name of the ServiceConnectionMap to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Get extends StandardParameters {
        /**
         * Required. Name of the ServiceConnectionMap to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$List extends StandardParameters {
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
         * Required. The parent resource's name. ex. projects/123/locations/us-east1
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Patch extends StandardParameters {
        /**
         * Immutable. The name of a ServiceConnectionMap. Format: projects/{project\}/locations/{location\}/serviceConnectionMaps/{service_connection_map\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the ServiceConnectionMap resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceConnectionMap;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionmaps$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Serviceconnectionpolicies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ServiceConnectionPolicy in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single ServiceConnectionPolicy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single ServiceConnectionPolicy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceConnectionPolicy>>;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceConnectionPolicy>, callback: BodyResponseCallback<Schema$ServiceConnectionPolicy>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get, callback: BodyResponseCallback<Schema$ServiceConnectionPolicy>): void;
        get(callback: BodyResponseCallback<Schema$ServiceConnectionPolicy>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists ServiceConnectionPolicies in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceConnectionPoliciesResponse>>;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceConnectionPoliciesResponse>, callback: BodyResponseCallback<Schema$ListServiceConnectionPoliciesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$List, callback: BodyResponseCallback<Schema$ListServiceConnectionPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceConnectionPoliciesResponse>): void;
        /**
         * Updates the parameters of a single ServiceConnectionPolicy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Create extends StandardParameters {
        /**
         * Required. The parent resource's name of the ServiceConnectionPolicy. ex. projects/123/locations/us-east1
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Resource ID (i.e. 'foo' in '[...]/projects/p/locations/l/serviceConnectionPolicies/foo') See https://google.aip.dev/122#resource-id-segments Unique per location.
         */
        serviceConnectionPolicyId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceConnectionPolicy;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Delete extends StandardParameters {
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string;
        /**
         * Required. The name of the ServiceConnectionPolicy to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Get extends StandardParameters {
        /**
         * Required. Name of the ServiceConnectionPolicy to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$List extends StandardParameters {
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
         * Required. The parent resource's name. ex. projects/123/locations/us-east1
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Patch extends StandardParameters {
        /**
         * Immutable. The name of a ServiceConnectionPolicy. Format: projects/{project\}/locations/{location\}/serviceConnectionPolicies/{service_connection_policy\} See: https://google.aip.dev/122#fields-representing-resource-names
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Field mask is used to specify the fields to be overwritten in the ServiceConnectionPolicy resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then all fields will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceConnectionPolicy;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectionpolicies$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Serviceconnectiontokens {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ServiceConnectionToken in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Serviceconnectiontokens$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single ServiceConnectionToken.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single ServiceConnectionToken.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Serviceconnectiontokens$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceConnectionToken>>;
        get(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceConnectionToken>, callback: BodyResponseCallback<Schema$ServiceConnectionToken>): void;
        get(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$Get, callback: BodyResponseCallback<Schema$ServiceConnectionToken>): void;
        get(callback: BodyResponseCallback<Schema$ServiceConnectionToken>): void;
        /**
         * Lists ServiceConnectionTokens in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Serviceconnectiontokens$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceConnectionTokensResponse>>;
        list(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceConnectionTokensResponse>, callback: BodyResponseCallback<Schema$ListServiceConnectionTokensResponse>): void;
        list(params: Params$Resource$Projects$Locations$Serviceconnectiontokens$List, callback: BodyResponseCallback<Schema$ListServiceConnectionTokensResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceConnectionTokensResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectiontokens$Create extends StandardParameters {
        /**
         * Required. The parent resource's name of the ServiceConnectionToken. ex. projects/123/locations/us-east1
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Resource ID (i.e. 'foo' in '[...]/projects/p/locations/l/ServiceConnectionTokens/foo') See https://google.aip.dev/122#resource-id-segments Unique per location. If one is not provided, one will be generated.
         */
        serviceConnectionTokenId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceConnectionToken;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectiontokens$Delete extends StandardParameters {
        /**
         * Optional. The etag is computed by the server, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string;
        /**
         * Required. The name of the ServiceConnectionToken to delete.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectiontokens$Get extends StandardParameters {
        /**
         * Required. Name of the ServiceConnectionToken to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Serviceconnectiontokens$List extends StandardParameters {
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
         * Required. The parent resource's name. ex. projects/123/locations/us-east1
         */
        parent?: string;
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
         * Required. The parent resource.
         */
        parent?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Unique id for the spoke to create.
         */
        spokeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Spoke;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Delete extends StandardParameters {
        /**
         * Required. The name of the spoke to delete.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Get extends StandardParameters {
        /**
         * Required. The name of the spoke resource.
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
         * An expression that filters the list of results.
         */
        filter?: string;
        /**
         * Sort the results by a certain order.
         */
        orderBy?: string;
        /**
         * The maximum number of results to return per page.
         */
        pageSize?: number;
        /**
         * The page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Spokes$Patch extends StandardParameters {
        /**
         * Immutable. The name of the spoke. Spoke names must be unique. They use the following form: `projects/{project_number\}/locations/{region\}/spokes/{spoke_id\}`
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server knows to ignore the request if it has already been completed. The server guarantees that a request doesn't result in creation of duplicate commitments for at least 60 minutes. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check to see whether the original operation was received. If it was, the server ignores the second request. This behavior prevents clients from mistakenly creating duplicate commitments. The request ID must be a valid UUID, with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. In the case of an update to an existing spoke, field mask is used to specify the fields to be overwritten. The fields specified in the update_mask are relative to the resource, not the full request. A field is overwritten if it is in the mask. If the user does not provide a mask, then all fields are overwritten.
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
