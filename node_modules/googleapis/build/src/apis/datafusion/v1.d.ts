import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace datafusion_v1 {
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
     * Cloud Data Fusion API
     *
     * Cloud Data Fusion is a fully-managed, cloud native, enterprise data integration service for quickly building and managing data pipelines. It provides a graphical interface to increase time efficiency and reduce complexity, and allows business users, developers, and data scientists to easily and reliably build scalable data integration solutions to cleanse, prepare, blend, transfer and transform data without having to wrestle with infrastructure.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const datafusion = google.datafusion('v1');
     * ```
     */
    export class Datafusion {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Identifies Data Fusion accelerators for an instance.
     */
    export interface Schema$Accelerator {
        /**
         * Optional. The type of an accelator for a Cloud Data Fusion instance.
         */
        acceleratorType?: string | null;
        /**
         * Output only. The state of the accelerator.
         */
        state?: string | null;
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
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * The crypto key configuration. This field is used by the Customer-managed encryption keys (CMEK) feature.
     */
    export interface Schema$CryptoKeyConfig {
        /**
         * Optional. The name of the key which is used to encrypt/decrypt customer data. For key in Cloud KMS, the key should be in the format of `projects/x/locations/x/keyRings/x/cryptoKeys/x`.
         */
        keyReference?: string | null;
    }
    /**
     * DNS peering configuration. These configurations are used to create DNS peering with the customer Cloud DNS.
     */
    export interface Schema$DnsPeering {
        /**
         * Optional. Optional description of the dns zone.
         */
        description?: string | null;
        /**
         * Required. The dns name suffix of the zone.
         */
        domain?: string | null;
        /**
         * Identifier. The resource name of the dns peering zone. Format: projects/{project\}/locations/{location\}/instances/{instance\}/dnsPeerings/{dns_peering\}
         */
        name?: string | null;
        /**
         * Optional. Optional target network to which dns peering should happen.
         */
        targetNetwork?: string | null;
        /**
         * Optional. Optional target project to which dns peering should happen.
         */
        targetProject?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Confirguration of PubSubEventWriter.
     */
    export interface Schema$EventPublishConfig {
        /**
         * Required. Option to enable Event Publishing.
         */
        enabled?: boolean | null;
        /**
         * Required. The resource name of the Pub/Sub topic. Format: projects/{project_id\}/topics/{topic_id\}
         */
        topic?: string | null;
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
     * Represents a Data Fusion instance.
     */
    export interface Schema$Instance {
        /**
         * Output only. List of accelerators enabled for this CDF instance.
         */
        accelerators?: Schema$Accelerator[];
        /**
         * Output only. Endpoint on which the REST APIs is accessible.
         */
        apiEndpoint?: string | null;
        /**
         * Output only. Available versions that the instance can be upgraded to using UpdateInstanceRequest.
         */
        availableVersion?: Schema$Version[];
        /**
         * Output only. The time the instance was created.
         */
        createTime?: string | null;
        /**
         * Optional. The crypto key configuration. This field is used by the Customer-Managed Encryption Keys (CMEK) feature.
         */
        cryptoKeyConfig?: Schema$CryptoKeyConfig;
        /**
         * Optional. Option to enable the Dataplex Lineage Integration feature.
         */
        dataplexDataLineageIntegrationEnabled?: boolean | null;
        /**
         * Optional. User-managed service account to set on Dataproc when Cloud Data Fusion creates Dataproc to run data processing pipelines. This allows users to have fine-grained access control on Dataproc's accesses to cloud resources.
         */
        dataprocServiceAccount?: string | null;
        /**
         * Optional. A description of this instance.
         */
        description?: string | null;
        /**
         * Output only. If the instance state is DISABLED, the reason for disabling the instance.
         */
        disabledReason?: string[] | null;
        /**
         * Optional. Display name for an instance.
         */
        displayName?: string | null;
        /**
         * Optional. Option to enable granular role-based access control.
         */
        enableRbac?: boolean | null;
        /**
         * Optional. Option to enable Dataproc Stackdriver Logging.
         */
        enableStackdriverLogging?: boolean | null;
        /**
         * Optional. Option to enable Stackdriver Monitoring.
         */
        enableStackdriverMonitoring?: boolean | null;
        /**
         * Output only. Option to enable granular zone separation.
         */
        enableZoneSeparation?: boolean | null;
        /**
         * Optional. Option to enable and pass metadata for event publishing.
         */
        eventPublishConfig?: Schema$EventPublishConfig;
        /**
         * Output only. Cloud Storage bucket generated by Data Fusion in the customer project.
         */
        gcsBucket?: string | null;
        /**
         * The resource labels for instance to use to annotate any related underlying resources such as Compute Engine VMs. The character '=' is not allowed to be used within the labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The logging configuration for this instance. This field is supported only in CDF versions 6.11.0 and above.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Output only. The maintenance events for this instance.
         */
        maintenanceEvents?: Schema$MaintenanceEvent[];
        /**
         * Optional. Configure the maintenance policy for this instance.
         */
        maintenancePolicy?: Schema$MaintenancePolicy;
        /**
         * Output only. The name of this instance is in the form of projects/{project\}/locations/{location\}/instances/{instance\}.
         */
        name?: string | null;
        /**
         * Optional. Network configuration options. These are required when a private Data Fusion instance is to be created.
         */
        networkConfig?: Schema$NetworkConfig;
        /**
         * Optional. Map of additional options used to configure the behavior of Data Fusion instance.
         */
        options?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Service agent for the customer project.
         */
        p4ServiceAccount?: string | null;
        /**
         * Optional. Current patch revision of the Data Fusion.
         */
        patchRevision?: string | null;
        /**
         * Optional. Specifies whether the Data Fusion instance should be private. If set to true, all Data Fusion nodes will have private IP addresses and will not be able to access the public internet.
         */
        privateInstance?: boolean | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Output only. Deprecated. Use tenant_project_id instead to extract the tenant project ID.
         */
        serviceAccount?: string | null;
        /**
         * Output only. Endpoint on which the Data Fusion UI is accessible.
         */
        serviceEndpoint?: string | null;
        /**
         * Output only. The current state of this Data Fusion instance.
         */
        state?: string | null;
        /**
         * Output only. Additional information about the current state of this Data Fusion instance if available.
         */
        stateMessage?: string | null;
        /**
         * Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing"
         */
        tags?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The name of the tenant project.
         */
        tenantProjectId?: string | null;
        /**
         * Required. Instance type.
         */
        type?: string | null;
        /**
         * Output only. The time the instance was last updated.
         */
        updateTime?: string | null;
        /**
         * Optional. Current version of the Data Fusion. Only specifiable in Update.
         */
        version?: string | null;
        /**
         * Output only. Endpoint on which the Data Fusion UI is accessible to third-party users
         */
        workforceIdentityServiceEndpoint?: string | null;
        /**
         * Optional. Name of the zone in which the Data Fusion instance will be created. Only DEVELOPER instances use this field.
         */
        zone?: string | null;
    }
    /**
     * Response message for the list available versions request.
     */
    export interface Schema$ListAvailableVersionsResponse {
        /**
         * Represents a list of versions that are supported. Deprecated: Use versions field instead.
         */
        availableVersions?: Schema$Version[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * Represents a list of all versions.
         */
        versions?: Schema$Version[];
    }
    /**
     * Response message for list DNS peerings.
     */
    export interface Schema$ListDnsPeeringsResponse {
        /**
         * List of dns peering.
         */
        dnsPeerings?: Schema$DnsPeering[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for the list instance request.
     */
    export interface Schema$ListInstancesResponse {
        /**
         * Represents a list of Data Fusion instances.
         */
        instances?: Schema$Instance[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
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
     * Logging configuration for a Data Fusion instance.
     */
    export interface Schema$LoggingConfig {
        /**
         * Optional. Option to determine whether instance logs should be written to Cloud Logging. By default, instance logs are written to Cloud Logging.
         */
        instanceCloudLoggingDisabled?: boolean | null;
    }
    /**
     * Represents a maintenance event.
     */
    export interface Schema$MaintenanceEvent {
        /**
         * Output only. The end time of the maintenance event provided in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Example: "2024-01-02T12:04:06-06:00" This field will be empty if the maintenance event is not yet complete.
         */
        endTime?: string | null;
        /**
         * Output only. The start time of the maintenance event provided in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Example: "2024-01-01T12:04:06-04:00"
         */
        startTime?: string | null;
        /**
         * Output only. The state of the maintenance event.
         */
        state?: string | null;
    }
    /**
     * Maintenance policy of the instance.
     */
    export interface Schema$MaintenancePolicy {
        /**
         * Optional. The maintenance exclusion window of the instance.
         */
        maintenanceExclusionWindow?: Schema$TimeWindow;
        /**
         * Optional. The maintenance window of the instance.
         */
        maintenanceWindow?: Schema$MaintenanceWindow;
    }
    /**
     * Maintenance window of the instance.
     */
    export interface Schema$MaintenanceWindow {
        /**
         * Required. The recurring time window of the maintenance window.
         */
        recurringTimeWindow?: Schema$RecurringTimeWindow;
    }
    /**
     * Network configuration for a Data Fusion instance. These configurations are used for peering with the customer network. Configurations are optional when a public Data Fusion instance is to be created. However, providing these configurations allows several benefits, such as reduced network latency while accessing the customer resources from managed Data Fusion instance nodes, as well as access to the customer on-prem resources.
     */
    export interface Schema$NetworkConfig {
        /**
         * Optional. Type of connection for establishing private IP connectivity between the Data Fusion customer project VPC and the corresponding tenant project from a predefined list of available connection modes. If this field is unspecified for a private instance, VPC peering is used.
         */
        connectionType?: string | null;
        /**
         * Optional. The IP range in CIDR notation to use for the managed Data Fusion instance nodes. This range must not overlap with any other ranges used in the Data Fusion instance network. This is required only when using connection type VPC_PEERING. Format: a.b.c.d/22 Example: 192.168.0.0/22
         */
        ipAllocation?: string | null;
        /**
         * Optional. Name of the network in the customer project with which the Tenant Project will be peered for executing pipelines. In case of shared VPC where the network resides in another host project the network should specified in the form of projects/{host-project-id\}/global/networks/{network\}. This is only required for connectivity type VPC_PEERING.
         */
        network?: string | null;
        /**
         * Optional. Configuration for Private Service Connect. This is required only when using connection type PRIVATE_SERVICE_CONNECT_INTERFACES.
         */
        privateServiceConnectConfig?: Schema$PrivateServiceConnectConfig;
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
     * Represents the metadata of a long-running operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Map to hold any additional status info for the operation If there is an accelerator being enabled/disabled/deleted, this will be populated with accelerator name as key and status as ENABLING, DISABLING or DELETING
         */
        additionalStatus?: {
            [key: string]: string;
        } | null;
        /**
         * API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * The time the operation was created.
         */
        createTime?: string | null;
        /**
         * The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        requestedCancellation?: boolean | null;
        /**
         * Human-readable status of the operation if any.
         */
        statusDetail?: string | null;
        /**
         * Server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Name of the verb executed by the operation.
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
     * Configuration for using Private Service Connect to establish connectivity between the Data Fusion consumer project and the corresponding tenant project.
     */
    export interface Schema$PrivateServiceConnectConfig {
        /**
         * Output only. The CIDR block to which the CDF instance can't route traffic to in the consumer project VPC. The size of this block is /25. The format of this field is governed by RFC 4632. Example: 240.0.0.0/25
         */
        effectiveUnreachableCidrBlock?: string | null;
        /**
         * Required. The reference to the network attachment used to establish private connectivity. It will be of the form projects/{project-id\}/regions/{region\}/networkAttachments/{network-attachment-id\}.
         */
        networkAttachment?: string | null;
        /**
         * Optional. Input only. The CIDR block to which the CDF instance can't route traffic to in the consumer project VPC. The size of this block should be at least /25. This range should not overlap with the primary address range of any subnetwork used by the network attachment. This range can be used for other purposes in the consumer VPC as long as there is no requirement for CDF to reach destinations using these addresses. If this value is not provided, the server chooses a non RFC 1918 address range. The format of this field is governed by RFC 4632. Example: 192.168.0.0/25
         */
        unreachableCidrBlock?: string | null;
    }
    /**
     * Represents an arbitrary window of time that recurs.
     */
    export interface Schema$RecurringTimeWindow {
        /**
         * Required. An RRULE with format [RFC-5545](https://tools.ietf.org/html/rfc5545#section-3.8.5.3) for how this window reccurs. They go on for the span of time between the start and end time. The only supported FREQ value is "WEEKLY". To have something repeat every weekday, use: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR". This specifies how frequently the window starts. To have a 9 am - 5 pm UTC-4 window every weekday, use something like: ``` start time = 2019-01-01T09:00:00-0400 end time = 2019-01-01T17:00:00-0400 recurrence = FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR ```
         */
        recurrence?: string | null;
        /**
         * Required. The window representing the start and end time of recurrences. This field ignores the date components of the provided timestamps. Only the time of day and duration between start and end time are relevant.
         */
        window?: Schema$TimeWindow;
    }
    /**
     * Request message for restarting a Data Fusion instance.
     */
    export interface Schema$RestartInstanceRequest {
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
     * Represents an arbitrary window of time.
     */
    export interface Schema$TimeWindow {
        /**
         * Required. The end time of the time window provided in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. The end time should take place after the start time. Example: "2024-01-02T12:04:06-06:00"
         */
        endTime?: string | null;
        /**
         * Required. The start time of the time window provided in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Example: "2024-01-01T12:04:06-04:00"
         */
        startTime?: string | null;
    }
    /**
     * The Data Fusion version. This proto message stores information about certain Data Fusion version, which is used for Data Fusion version upgrade.
     */
    export interface Schema$Version {
        /**
         * Represents a list of available feature names for a given version.
         */
        availableFeatures?: string[] | null;
        /**
         * Whether this is currently the default version for Cloud Data Fusion
         */
        defaultVersion?: boolean | null;
        /**
         * Type represents the release availability of the version
         */
        type?: string | null;
        /**
         * The version number of the Data Fusion instance, such as '6.0.1.0'.
         */
        versionNumber?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        instances: Resource$Projects$Locations$Instances;
        operations: Resource$Projects$Locations$Operations;
        versions: Resource$Projects$Locations$Versions;
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
    export class Resource$Projects$Locations$Instances {
        context: APIRequestContext;
        dnsPeerings: Resource$Projects$Locations$Instances$Dnspeerings;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Data Fusion instance in the specified project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Instances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single Date Fusion instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single Data Fusion instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Instance>>;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$Instance>, callback: BodyResponseCallback<Schema$Instance>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, callback: BodyResponseCallback<Schema$Instance>): void;
        get(callback: BodyResponseCallback<Schema$Instance>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Instances$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Instances$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Instances$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Instances$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Instances$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists Data Fusion instances in the specified project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$ListInstancesResponse>, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        /**
         * Updates a single Data Fusion instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Instances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Restart a single Data Fusion instance. At the end of an operation instance is fully restarted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restart(params: Params$Resource$Projects$Locations$Instances$Restart, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restart(params?: Params$Resource$Projects$Locations$Instances$Restart, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restart(params: Params$Resource$Projects$Locations$Instances$Restart, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restart(params: Params$Resource$Projects$Locations$Instances$Restart, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(params: Params$Resource$Projects$Locations$Instances$Restart, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Instances$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Instances$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Instances$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Instances$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Instances$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Instances$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Instances$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Instances$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Instances$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Instances$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Instances$Create extends StandardParameters {
        /**
         * Required. The name of the instance to create. Instance name can only contain lowercase alphanumeric characters and hyphens. It must start with a letter and must not end with a hyphen. It can have a maximum of 30 characters.
         */
        instanceId?: string;
        /**
         * Required. The instance's project and location in the format projects/{project\}/locations/{location\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Delete extends StandardParameters {
        /**
         * Required. The instance resource name in the format projects/{project\}/locations/{location\}/instances/{instance\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Get extends StandardParameters {
        /**
         * Required. The instance resource name in the format projects/{project\}/locations/{location\}/instances/{instance\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$List extends StandardParameters {
        /**
         * List filter.
         */
        filter?: string;
        /**
         * Sort results. Supported values are "name", "name desc", or "" (unsorted).
         */
        orderBy?: string;
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value to use if there are additional results to retrieve for this list request.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve instance information in the format projects/{project\}/locations/{location\}. If the location is specified as '-' (wildcard), then all regions available to the project are queried, and the results are aggregated.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Patch extends StandardParameters {
        /**
         * Output only. The name of this instance is in the form of projects/{project\}/locations/{location\}/instances/{instance\}.
         */
        name?: string;
        /**
         * Field mask is used to specify the fields that the update will overwrite in an instance resource. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask, the label field will be overwritten.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Restart extends StandardParameters {
        /**
         * Required. Name of the Data Fusion instance which need to be restarted in the form of projects/{project\}/locations/{location\}/instances/{instance\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RestartInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Instances$Dnspeerings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates DNS peering on the given resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Instances$Dnspeerings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DnsPeering>>;
        create(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Create, options: MethodOptions | BodyResponseCallback<Schema$DnsPeering>, callback: BodyResponseCallback<Schema$DnsPeering>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Create, callback: BodyResponseCallback<Schema$DnsPeering>): void;
        create(callback: BodyResponseCallback<Schema$DnsPeering>): void;
        /**
         * Deletes DNS peering on the given resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists DNS peerings for a given resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Instances$Dnspeerings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDnsPeeringsResponse>>;
        list(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$List, options: MethodOptions | BodyResponseCallback<Schema$ListDnsPeeringsResponse>, callback: BodyResponseCallback<Schema$ListDnsPeeringsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Instances$Dnspeerings$List, callback: BodyResponseCallback<Schema$ListDnsPeeringsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDnsPeeringsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Instances$Dnspeerings$Create extends StandardParameters {
        /**
         * Required. The name of the peering to create.
         */
        dnsPeeringId?: string;
        /**
         * Required. The resource on which DNS peering will be created.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DnsPeering;
    }
    export interface Params$Resource$Projects$Locations$Instances$Dnspeerings$Delete extends StandardParameters {
        /**
         * Required. The name of the DNS peering zone to delete. Format: projects/{project\}/locations/{location\}/instances/{instance\}/dnsPeerings/{dns_peering\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Dnspeerings$List extends StandardParameters {
        /**
         * The maximum number of dns peerings to return. The service may return fewer than this value. If unspecified, at most 50 dns peerings will be returned. The maximum value is 200; values above 200 will be coerced to 200.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListDnsPeerings` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDnsPeerings` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of dns peerings. Format: projects/{project\}/locations/{location\}/instances/{instance\}
         */
        parent?: string;
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
    export class Resource$Projects$Locations$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists possible versions for Data Fusion instances in the specified project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAvailableVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$ListAvailableVersionsResponse>, callback: BodyResponseCallback<Schema$ListAvailableVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Versions$List, callback: BodyResponseCallback<Schema$ListAvailableVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAvailableVersionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Versions$List extends StandardParameters {
        /**
         * Whether or not to return the latest patch of every available minor version. If true, only the latest patch will be returned. Ex. if allowed versions is [6.1.1, 6.1.2, 6.2.0] then response will be [6.1.2, 6.2.0]
         */
        latestPatchOnly?: boolean;
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value to use if there are additional results to retrieve for this list request.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve instance information in the format projects/{project\}/locations/{location\}.
         */
        parent?: string;
    }
    export {};
}
