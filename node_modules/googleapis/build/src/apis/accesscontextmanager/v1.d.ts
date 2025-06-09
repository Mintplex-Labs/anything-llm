import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace accesscontextmanager_v1 {
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
     * Access Context Manager API
     *
     * An API for setting attribute based access control to requests to Google Cloud services. *Warning:* Do not mix *v1alpha* and *v1* API usage in the same access policy. The v1alpha API supports new Access Context Manager features, which may have different attributes or behaviors that are not supported by v1. The practice of mixed API usage within a policy may result in the inability to update that policy, including any access levels or service perimeters belonging to it. It is not recommended to use both v1 and v1alpha for modifying policies with critical service perimeters. Modifications using v1alpha should be limited to policies with non-production/non-critical service perimeters.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const accesscontextmanager = google.accesscontextmanager('v1');
     * ```
     */
    export class Accesscontextmanager {
        context: APIRequestContext;
        accessPolicies: Resource$Accesspolicies;
        operations: Resource$Operations;
        organizations: Resource$Organizations;
        services: Resource$Services;
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
         * Identifier. Resource name for the `AccessLevel`. Format: `accessPolicies/{access_policy\}/accessLevels/{access_level\}`. The `access_level` component must begin with a letter, followed by alphanumeric characters or `_`. Its maximum length is 50 characters. After you create an `AccessLevel`, you cannot change its `name`.
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
         * Output only. An opaque identifier for the current version of the `AccessPolicy`. This will always be a strongly validated etag, meaning that two Access Policies will be identical if and only if their etags are identical. Clients should not expect this to be in any specific format.
         */
        etag?: string | null;
        /**
         * Output only. Identifier. Resource name of the `AccessPolicy`. Format: `accessPolicies/{access_policy\}`
         */
        name?: string | null;
        /**
         * Required. The parent of this `AccessPolicy` in the Cloud Resource Hierarchy. Currently immutable once created. Format: `organizations/{organization_id\}`
         */
        parent?: string | null;
        /**
         * The scopes of the AccessPolicy. Scopes define which resources a policy can restrict and where its resources can be referenced. For example, policy A with `scopes=["folders/123"]` has the following behavior: - ServicePerimeter can only restrict projects within `folders/123`. - ServicePerimeter within policy A can only reference access levels defined within policy A. - Only one policy can include a given scope; thus, attempting to create a second policy which includes `folders/123` will result in an error. If no scopes are provided, then any resource within the organization can be restricted. Scopes cannot be modified after a policy is created. Policies can only have a single scope. Format: list of `folders/{folder_number\}` or `projects/{project_number\}`
         */
        scopes?: string[] | null;
        /**
         * Required. Human readable title. Does not affect behavior.
         */
        title?: string | null;
    }
    /**
     * Access scope represents the client scope, etc. to which the settings will be applied to.
     */
    export interface Schema$AccessScope {
        /**
         * Optional. Client scope for this access scope.
         */
        clientScope?: Schema$ClientScope;
    }
    /**
     * Access settings represent the set of conditions that must be met for access to be granted. At least one of the fields must be set.
     */
    export interface Schema$AccessSettings {
        /**
         * Optional. Access level that a user must have to be granted access. Only one access level is supported, not multiple. This repeated field must have exactly one element. Example: "accessPolicies/9522/accessLevels/device_trusted"
         */
        accessLevels?: string[] | null;
        /**
         * Optional. Session settings applied to user access on a given AccessScope.
         */
        sessionSettings?: Schema$SessionSettings;
    }
    /**
     * Identification for an API Operation.
     */
    export interface Schema$ApiOperation {
        /**
         * API methods or permissions to allow. Method or permission must belong to the service specified by `service_name` field. A single MethodSelector entry with `*` specified for the `method` field will allow all methods AND permissions for the service specified in `service_name`.
         */
        methodSelectors?: Schema$MethodSelector[];
        /**
         * The name of the API whose methods or permissions the IngressPolicy or EgressPolicy want to allow. A single ApiOperation with `service_name` field set to `*` will allow all methods AND permissions for all services.
         */
        serviceName?: string | null;
    }
    /**
     * An application that accesses Google Cloud APIs.
     */
    export interface Schema$Application {
        /**
         * The OAuth client ID of the application.
         */
        clientId?: string | null;
        /**
         * The name of the application. Example: "Cloud Console"
         */
        name?: string | null;
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
     * `AuthorizedOrgsDesc` contains data for an organization's authorization policy.
     */
    export interface Schema$AuthorizedOrgsDesc {
        /**
         * The asset type of this authorized orgs desc. Valid values are `ASSET_TYPE_DEVICE`, and `ASSET_TYPE_CREDENTIAL_STRENGTH`.
         */
        assetType?: string | null;
        /**
         * The direction of the authorization relationship between this organization and the organizations listed in the `orgs` field. The valid values for this field include the following: `AUTHORIZATION_DIRECTION_FROM`: Allows this organization to evaluate traffic in the organizations listed in the `orgs` field. `AUTHORIZATION_DIRECTION_TO`: Allows the organizations listed in the `orgs` field to evaluate the traffic in this organization. For the authorization relationship to take effect, all of the organizations must authorize and specify the appropriate relationship direction. For example, if organization A authorized organization B and C to evaluate its traffic, by specifying `AUTHORIZATION_DIRECTION_TO` as the authorization direction, organizations B and C must specify `AUTHORIZATION_DIRECTION_FROM` as the authorization direction in their `AuthorizedOrgsDesc` resource.
         */
        authorizationDirection?: string | null;
        /**
         * A granular control type for authorization levels. Valid value is `AUTHORIZATION_TYPE_TRUST`.
         */
        authorizationType?: string | null;
        /**
         * Identifier. Resource name for the `AuthorizedOrgsDesc`. Format: `accessPolicies/{access_policy\}/authorizedOrgsDescs/{authorized_orgs_desc\}`. The `authorized_orgs_desc` component must begin with a letter, followed by alphanumeric characters or `_`. After you create an `AuthorizedOrgsDesc`, you cannot change its `name`.
         */
        name?: string | null;
        /**
         * The list of organization ids in this AuthorizedOrgsDesc. Format: `organizations/` Example: `organizations/123456`
         */
        orgs?: string[] | null;
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
     * Client scope represents the application, etc. subject to this binding's restrictions.
     */
    export interface Schema$ClientScope {
        /**
         * Optional. The application that is subject to this binding's scope.
         */
        restrictedClientApplication?: Schema$Application;
    }
    /**
     * A request to commit dry-run specs in all Service Perimeters belonging to an Access Policy.
     */
    export interface Schema$CommitServicePerimetersRequest {
        /**
         * Optional. The etag for the version of the Access Policy that this commit operation is to be performed on. If, at the time of commit, the etag for the Access Policy stored in Access Context Manager is different from the specified etag, then the commit operation will not be performed and the call will fail. This field is not required. If etag is not provided, the operation will be performed as if a valid etag is provided.
         */
        etag?: string | null;
    }
    /**
     * A response to CommitServicePerimetersRequest. This will be put inside of Operation.response field.
     */
    export interface Schema$CommitServicePerimetersResponse {
        /**
         * List of all the Service Perimeter instances in the Access Policy.
         */
        servicePerimeters?: Schema$ServicePerimeter[];
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
        /**
         * The request must originate from one of the provided VPC networks in Google Cloud. Cannot specify this field together with `ip_subnetworks`.
         */
        vpcNetworkSources?: Schema$VpcNetworkSource[];
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
     * Defines the conditions under which an EgressPolicy matches a request. Conditions based on information about the source of the request. Note that if the destination of the request is also protected by a ServicePerimeter, then that ServicePerimeter must have an IngressPolicy which allows access in order for this request to succeed.
     */
    export interface Schema$EgressFrom {
        /**
         * A list of identities that are allowed access through [EgressPolicy]. Identities can be an individual user, service account, Google group, or third-party identity. For third-party identity, only single identities are supported and other identity types are not supported. The `v1` identities that have the prefix `user`, `group`, `serviceAccount`, and `principal` in https://cloud.google.com/iam/docs/principal-identifiers#v1 are supported.
         */
        identities?: string[] | null;
        /**
         * Specifies the type of identities that are allowed access to outside the perimeter. If left unspecified, then members of `identities` field will be allowed access.
         */
        identityType?: string | null;
        /**
         * Whether to enforce traffic restrictions based on `sources` field. If the `sources` fields is non-empty, then this field must be set to `SOURCE_RESTRICTION_ENABLED`.
         */
        sourceRestriction?: string | null;
        /**
         * Sources that this EgressPolicy authorizes access from. If this field is not empty, then `source_restriction` must be set to `SOURCE_RESTRICTION_ENABLED`.
         */
        sources?: Schema$EgressSource[];
    }
    /**
     * Policy for egress from perimeter. EgressPolicies match requests based on `egress_from` and `egress_to` stanzas. For an EgressPolicy to match, both `egress_from` and `egress_to` stanzas must be matched. If an EgressPolicy matches a request, the request is allowed to span the ServicePerimeter boundary. For example, an EgressPolicy can be used to allow VMs on networks within the ServicePerimeter to access a defined set of projects outside the perimeter in certain contexts (e.g. to read data from a Cloud Storage bucket or query against a BigQuery dataset). EgressPolicies are concerned with the *resources* that a request relates as well as the API services and API actions being used. They do not related to the direction of data movement. More detailed documentation for this concept can be found in the descriptions of EgressFrom and EgressTo.
     */
    export interface Schema$EgressPolicy {
        /**
         * Defines conditions on the source of a request causing this EgressPolicy to apply.
         */
        egressFrom?: Schema$EgressFrom;
        /**
         * Defines the conditions on the ApiOperation and destination resources that cause this EgressPolicy to apply.
         */
        egressTo?: Schema$EgressTo;
        /**
         * Optional. Human-readable title for the egress rule. The title must be unique within the perimeter and can not exceed 100 characters. Within the access policy, the combined length of all rule titles must not exceed 240,000 characters.
         */
        title?: string | null;
    }
    /**
     * The source that EgressPolicy authorizes access from inside the ServicePerimeter to somewhere outside the ServicePerimeter boundaries.
     */
    export interface Schema$EgressSource {
        /**
         * An AccessLevel resource name that allows protected resources inside the ServicePerimeters to access outside the ServicePerimeter boundaries. AccessLevels listed must be in the same policy as this ServicePerimeter. Referencing a nonexistent AccessLevel will cause an error. If an AccessLevel name is not specified, only resources within the perimeter can be accessed through Google Cloud calls with request origins within the perimeter. Example: `accessPolicies/MY_POLICY/accessLevels/MY_LEVEL`. If a single `*` is specified for `access_level`, then all EgressSources will be allowed.
         */
        accessLevel?: string | null;
        /**
         * A Google Cloud resource from the service perimeter that you want to allow to access data outside the perimeter. This field supports only projects. The project format is `projects/{project_number\}`. You can't use `*` in this field to allow all Google Cloud resources.
         */
        resource?: string | null;
    }
    /**
     * Defines the conditions under which an EgressPolicy matches a request. Conditions are based on information about the ApiOperation intended to be performed on the `resources` specified. Note that if the destination of the request is also protected by a ServicePerimeter, then that ServicePerimeter must have an IngressPolicy which allows access in order for this request to succeed. The request must match `operations` AND `resources` fields in order to be allowed egress out of the perimeter.
     */
    export interface Schema$EgressTo {
        /**
         * A list of external resources that are allowed to be accessed. Only AWS and Azure resources are supported. For Amazon S3, the supported formats are s3://BUCKET_NAME, s3a://BUCKET_NAME, and s3n://BUCKET_NAME. For Azure Storage, the supported format is azure://myaccount.blob.core.windows.net/CONTAINER_NAME. A request matches if it contains an external resource in this list (Example: s3://bucket/path). Currently '*' is not allowed.
         */
        externalResources?: string[] | null;
        /**
         * A list of ApiOperations allowed to be performed by the sources specified in the corresponding EgressFrom. A request matches if it uses an operation/service in this list.
         */
        operations?: Schema$ApiOperation[];
        /**
         * A list of resources, currently only projects in the form `projects/`, that are allowed to be accessed by sources defined in the corresponding EgressFrom. A request matches if it contains a resource in this list. If `*` is specified for `resources`, then this EgressTo rule will authorize access to all resources outside the perimeter.
         */
        resources?: string[] | null;
        /**
         * IAM roles that represent the set of operations that the sources specified in the corresponding EgressFrom. are allowed to perform in this ServicePerimeter.
         */
        roles?: string[] | null;
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
     * Restricts access to Cloud Console and Google Cloud APIs for a set of users using Context-Aware Access.
     */
    export interface Schema$GcpUserAccessBinding {
        /**
         * Optional. Access level that a user must have to be granted access. Only one access level is supported, not multiple. This repeated field must have exactly one element. Example: "accessPolicies/9522/accessLevels/device_trusted"
         */
        accessLevels?: string[] | null;
        /**
         * Optional. Dry run access level that will be evaluated but will not be enforced. The access denial based on dry run policy will be logged. Only one access level is supported, not multiple. This list must have exactly one element. Example: "accessPolicies/9522/accessLevels/device_trusted"
         */
        dryRunAccessLevels?: string[] | null;
        /**
         * Required. Immutable. Google Group id whose members are subject to this binding's restrictions. See "id" in the [G Suite Directory API's Groups resource] (https://developers.google.com/admin-sdk/directory/v1/reference/groups#resource). If a group's email address/alias is changed, this resource will continue to point at the changed group. This field does not accept group email addresses or aliases. Example: "01d520gv4vjcrht"
         */
        groupKey?: string | null;
        /**
         * Immutable. Assigned by the server during creation. The last segment has an arbitrary length and has only URI unreserved characters (as defined by [RFC 3986 Section 2.3](https://tools.ietf.org/html/rfc3986#section-2.3)). Should not be specified by the client during creation. Example: "organizations/256/gcpUserAccessBindings/b3-BhcX_Ud5N"
         */
        name?: string | null;
        /**
         * Optional. A list of applications that are subject to this binding's restrictions. If the list is empty, the binding restrictions will universally apply to all applications.
         */
        restrictedClientApplications?: Schema$Application[];
        /**
         * Optional. A list of scoped access settings that set this binding's restrictions on a subset of applications. This field cannot be set if restricted_client_applications is set.
         */
        scopedAccessSettings?: Schema$ScopedAccessSettings[];
        /**
         * Optional. The Google Cloud session length (GCSL) policy for the group key.
         */
        sessionSettings?: Schema$SessionSettings;
    }
    /**
     * Metadata of Google Cloud Access Binding Long Running Operations.
     */
    export interface Schema$GcpUserAccessBindingOperationMetadata {
    }
    /**
     * Request message for `GetIamPolicy` method.
     */
    export interface Schema$GetIamPolicyRequest {
        /**
         * OPTIONAL: A `GetPolicyOptions` object for specifying options to `GetIamPolicy`.
         */
        options?: Schema$GetPolicyOptions;
    }
    /**
     * Encapsulates settings provided to GetIamPolicy.
     */
    export interface Schema$GetPolicyOptions {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        requestedPolicyVersion?: number | null;
    }
    /**
     * Defines the conditions under which an IngressPolicy matches a request. Conditions are based on information about the source of the request. The request must satisfy what is defined in `sources` AND identity related fields in order to match.
     */
    export interface Schema$IngressFrom {
        /**
         * A list of identities that are allowed access through [IngressPolicy]. Identities can be an individual user, service account, Google group, or third-party identity. For third-party identity, only single identities are supported and other identity types are not supported. The `v1` identities that have the prefix `user`, `group`, `serviceAccount`, and `principal` in https://cloud.google.com/iam/docs/principal-identifiers#v1 are supported.
         */
        identities?: string[] | null;
        /**
         * Specifies the type of identities that are allowed access from outside the perimeter. If left unspecified, then members of `identities` field will be allowed access.
         */
        identityType?: string | null;
        /**
         * Sources that this IngressPolicy authorizes access from.
         */
        sources?: Schema$IngressSource[];
    }
    /**
     * Policy for ingress into ServicePerimeter. IngressPolicies match requests based on `ingress_from` and `ingress_to` stanzas. For an ingress policy to match, both the `ingress_from` and `ingress_to` stanzas must be matched. If an IngressPolicy matches a request, the request is allowed through the perimeter boundary from outside the perimeter. For example, access from the internet can be allowed either based on an AccessLevel or, for traffic hosted on Google Cloud, the project of the source network. For access from private networks, using the project of the hosting network is required. Individual ingress policies can be limited by restricting which services and/or actions they match using the `ingress_to` field.
     */
    export interface Schema$IngressPolicy {
        /**
         * Defines the conditions on the source of a request causing this IngressPolicy to apply.
         */
        ingressFrom?: Schema$IngressFrom;
        /**
         * Defines the conditions on the ApiOperation and request destination that cause this IngressPolicy to apply.
         */
        ingressTo?: Schema$IngressTo;
        /**
         * Optional. Human-readable title for the ingress rule. The title must be unique within the perimeter and can not exceed 100 characters. Within the access policy, the combined length of all rule titles must not exceed 240,000 characters.
         */
        title?: string | null;
    }
    /**
     * The source that IngressPolicy authorizes access from.
     */
    export interface Schema$IngressSource {
        /**
         * An AccessLevel resource name that allow resources within the ServicePerimeters to be accessed from the internet. AccessLevels listed must be in the same policy as this ServicePerimeter. Referencing a nonexistent AccessLevel will cause an error. If no AccessLevel names are listed, resources within the perimeter can only be accessed via Google Cloud calls with request origins within the perimeter. Example: `accessPolicies/MY_POLICY/accessLevels/MY_LEVEL`. If a single `*` is specified for `access_level`, then all IngressSources will be allowed.
         */
        accessLevel?: string | null;
        /**
         * A Google Cloud resource that is allowed to ingress the perimeter. Requests from these resources will be allowed to access perimeter data. Currently only projects and VPCs are allowed. Project format: `projects/{project_number\}` VPC network format: `//compute.googleapis.com/projects/{PROJECT_ID\}/global/networks/{NAME\}`. The project may be in any Google Cloud organization, not just the organization that the perimeter is defined in. `*` is not allowed, the case of allowing all Google Cloud resources only is not supported.
         */
        resource?: string | null;
    }
    /**
     * Defines the conditions under which an IngressPolicy matches a request. Conditions are based on information about the ApiOperation intended to be performed on the target resource of the request. The request must satisfy what is defined in `operations` AND `resources` in order to match.
     */
    export interface Schema$IngressTo {
        /**
         * A list of ApiOperations allowed to be performed by the sources specified in corresponding IngressFrom in this ServicePerimeter.
         */
        operations?: Schema$ApiOperation[];
        /**
         * A list of resources, currently only projects in the form `projects/`, protected by this ServicePerimeter that are allowed to be accessed by sources defined in the corresponding IngressFrom. If a single `*` is specified, then access to all resources inside the perimeter are allowed.
         */
        resources?: string[] | null;
        /**
         * IAM roles that represent the set of operations that the sources specified in the corresponding IngressFrom are allowed to perform in this ServicePerimeter.
         */
        roles?: string[] | null;
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
     * A response to `ListAuthorizedOrgsDescsRequest`.
     */
    export interface Schema$ListAuthorizedOrgsDescsResponse {
        /**
         * List of all the Authorized Orgs Desc instances.
         */
        authorizedOrgsDescs?: Schema$AuthorizedOrgsDesc[];
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response of ListGcpUserAccessBindings.
     */
    export interface Schema$ListGcpUserAccessBindingsResponse {
        /**
         * GcpUserAccessBinding
         */
        gcpUserAccessBindings?: Schema$GcpUserAccessBinding[];
        /**
         * Token to get the next page of items. If blank, there are no more items.
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
     * A response to `ListSupportedServicesRequest`.
     */
    export interface Schema$ListSupportedServicesResponse {
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
        /**
         * List of services supported by VPC Service Controls instances.
         */
        supportedServices?: Schema$SupportedService[];
    }
    /**
     * An allowed method or permission of a service specified in ApiOperation.
     */
    export interface Schema$MethodSelector {
        /**
         * A valid method name for the corresponding `service_name` in ApiOperation. If `*` is used as the value for the `method`, then ALL methods and permissions are allowed.
         */
        method?: string | null;
        /**
         * A valid Cloud IAM permission for the corresponding `service_name` in ApiOperation.
         */
        permission?: string | null;
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
     * A request to replace all existing Access Levels in an Access Policy with the Access Levels provided. This is done atomically.
     */
    export interface Schema$ReplaceAccessLevelsRequest {
        /**
         * Required. The desired Access Levels that should replace all existing Access Levels in the Access Policy.
         */
        accessLevels?: Schema$AccessLevel[];
        /**
         * Optional. The etag for the version of the Access Policy that this replace operation is to be performed on. If, at the time of replace, the etag for the Access Policy stored in Access Context Manager is different from the specified etag, then the replace operation will not be performed and the call will fail. This field is not required. If etag is not provided, the operation will be performed as if a valid etag is provided.
         */
        etag?: string | null;
    }
    /**
     * A response to ReplaceAccessLevelsRequest. This will be put inside of Operation.response field.
     */
    export interface Schema$ReplaceAccessLevelsResponse {
        /**
         * List of the Access Level instances.
         */
        accessLevels?: Schema$AccessLevel[];
    }
    /**
     * A request to replace all existing Service Perimeters in an Access Policy with the Service Perimeters provided. This is done atomically.
     */
    export interface Schema$ReplaceServicePerimetersRequest {
        /**
         * Optional. The etag for the version of the Access Policy that this replace operation is to be performed on. If, at the time of replace, the etag for the Access Policy stored in Access Context Manager is different from the specified etag, then the replace operation will not be performed and the call will fail. This field is not required. If etag is not provided, the operation will be performed as if a valid etag is provided.
         */
        etag?: string | null;
        /**
         * Required. The desired Service Perimeters that should replace all existing Service Perimeters in the Access Policy.
         */
        servicePerimeters?: Schema$ServicePerimeter[];
    }
    /**
     * A response to ReplaceServicePerimetersRequest. This will be put inside of Operation.response field.
     */
    export interface Schema$ReplaceServicePerimetersResponse {
        /**
         * List of the Service Perimeter instances.
         */
        servicePerimeters?: Schema$ServicePerimeter[];
    }
    /**
     * A relationship between access settings and its scope.
     */
    export interface Schema$ScopedAccessSettings {
        /**
         * Optional. Access settings for this scoped access settings. This field may be empty if dry_run_settings is set.
         */
        activeSettings?: Schema$AccessSettings;
        /**
         * Optional. Dry-run access settings for this scoped access settings. This field may be empty if active_settings is set.
         */
        dryRunSettings?: Schema$AccessSettings;
        /**
         * Optional. Application, etc. to which the access settings will be applied to. Implicitly, this is the scoped access settings key; as such, it must be unique and non-empty.
         */
        scope?: Schema$AccessScope;
    }
    /**
     * `ServicePerimeter` describes a set of Google Cloud resources which can freely import and export data amongst themselves, but not export outside of the `ServicePerimeter`. If a request with a source within this `ServicePerimeter` has a target outside of the `ServicePerimeter`, the request will be blocked. Otherwise the request is allowed. There are two types of Service Perimeter - Regular and Bridge. Regular Service Perimeters cannot overlap, a single Google Cloud project or VPC network can only belong to a single regular Service Perimeter. Service Perimeter Bridges can contain only Google Cloud projects as members, a single Google Cloud project may belong to multiple Service Perimeter Bridges.
     */
    export interface Schema$ServicePerimeter {
        /**
         * Description of the `ServicePerimeter` and its use. Does not affect behavior.
         */
        description?: string | null;
        /**
         * Optional. An opaque identifier for the current version of the `ServicePerimeter`. This identifier does not follow any specific format. If an etag is not provided, the operation will be performed as if a valid etag is provided.
         */
        etag?: string | null;
        /**
         * Identifier. Resource name for the `ServicePerimeter`. Format: `accessPolicies/{access_policy\}/servicePerimeters/{service_perimeter\}`. The `service_perimeter` component must begin with a letter, followed by alphanumeric characters or `_`. After you create a `ServicePerimeter`, you cannot change its `name`.
         */
        name?: string | null;
        /**
         * Perimeter type indicator. A single project or VPC network is allowed to be a member of single regular perimeter, but multiple service perimeter bridges. A project cannot be a included in a perimeter bridge without being included in regular perimeter. For perimeter bridges, the restricted service list as well as access level lists must be empty.
         */
        perimeterType?: string | null;
        /**
         * Proposed (or dry run) ServicePerimeter configuration. This configuration allows to specify and test ServicePerimeter configuration without enforcing actual access restrictions. Only allowed to be set when the "use_explicit_dry_run_spec" flag is set.
         */
        spec?: Schema$ServicePerimeterConfig;
        /**
         * Current ServicePerimeter configuration. Specifies sets of resources, restricted services and access levels that determine perimeter content and boundaries.
         */
        status?: Schema$ServicePerimeterConfig;
        /**
         * Human readable title. Must be unique within the Policy.
         */
        title?: string | null;
        /**
         * Use explicit dry run spec flag. Ordinarily, a dry-run spec implicitly exists for all Service Perimeters, and that spec is identical to the status for those Service Perimeters. When this flag is set, it inhibits the generation of the implicit spec, thereby allowing the user to explicitly provide a configuration ("spec") to use in a dry-run version of the Service Perimeter. This allows the user to test changes to the enforced config ("status") without actually enforcing them. This testing is done through analyzing the differences between currently enforced and suggested restrictions. use_explicit_dry_run_spec must bet set to True if any of the fields in the spec are set to non-default values.
         */
        useExplicitDryRunSpec?: boolean | null;
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
         * List of EgressPolicies to apply to the perimeter. A perimeter may have multiple EgressPolicies, each of which is evaluated separately. Access is granted if any EgressPolicy grants it. Must be empty for a perimeter bridge.
         */
        egressPolicies?: Schema$EgressPolicy[];
        /**
         * List of IngressPolicies to apply to the perimeter. A perimeter may have multiple IngressPolicies, each of which is evaluated separately. Access is granted if any Ingress Policy grants it. Must be empty for a perimeter bridge.
         */
        ingressPolicies?: Schema$IngressPolicy[];
        /**
         * A list of Google Cloud resources that are inside of the service perimeter. Currently only projects and VPCs are allowed. Project format: `projects/{project_number\}` VPC network format: `//compute.googleapis.com/projects/{PROJECT_ID\}/global/networks/{NAME\}`.
         */
        resources?: string[] | null;
        /**
         * Google Cloud services that are subject to the Service Perimeter restrictions. For example, if `storage.googleapis.com` is specified, access to the storage buckets inside the perimeter must meet the perimeter's access restrictions.
         */
        restrictedServices?: string[] | null;
        /**
         * Configuration for APIs allowed within Perimeter.
         */
        vpcAccessibleServices?: Schema$VpcAccessibleServices;
    }
    /**
     * Stores settings related to Google Cloud Session Length including session duration, the type of challenge (i.e. method) they should face when their session expires, and other related settings.
     */
    export interface Schema$SessionSettings {
        /**
         * Optional. How long a user is allowed to take between actions before a new access token must be issued. Only set for Google Cloud apps.
         */
        maxInactivity?: string | null;
        /**
         * Optional. The session length. Setting this field to zero is equal to disabling session. Also can set infinite session by flipping the enabled bit to false below. If use_oidc_max_age is true, for OIDC apps, the session length will be the minimum of this field and OIDC max_age param.
         */
        sessionLength?: string | null;
        /**
         * Optional. This field enables or disables Google Cloud session length. When false, all fields set above will be disregarded and the session length is basically infinite.
         */
        sessionLengthEnabled?: boolean | null;
        /**
         * Optional. Session method when user's Google Cloud session is up.
         */
        sessionReauthMethod?: string | null;
        /**
         * Optional. Only useful for OIDC apps. When false, the OIDC max_age param, if passed in the authentication request will be ignored. When true, the re-auth period will be the minimum of the session_length field and the max_age OIDC param.
         */
        useOidcMaxAge?: boolean | null;
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
     * `SupportedService` specifies the VPC Service Controls and its properties.
     */
    export interface Schema$SupportedService {
        /**
         * True if the service is available on the restricted VIP. Services on the restricted VIP typically either support VPC Service Controls or are core infrastructure services required for the functioning of Google Cloud.
         */
        availableOnRestrictedVip?: boolean | null;
        /**
         * True if the service is supported with some limitations. Check [documentation](https://cloud.google.com/vpc-service-controls/docs/supported-products) for details.
         */
        knownLimitations?: boolean | null;
        /**
         * The service name or address of the supported service, such as `service.googleapis.com`.
         */
        name?: string | null;
        /**
         * The support stage of the service.
         */
        serviceSupportStage?: string | null;
        /**
         * The list of the supported methods. This field exists only in response to GetSupportedService
         */
        supportedMethods?: Schema$MethodSelector[];
        /**
         * The support stage of the service.
         */
        supportStage?: string | null;
        /**
         * The name of the supported product, such as 'Cloud Product API'.
         */
        title?: string | null;
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
    /**
     * The originating network source in Google Cloud.
     */
    export interface Schema$VpcNetworkSource {
        /**
         * Sub-segment ranges of a VPC network.
         */
        vpcSubnetwork?: Schema$VpcSubNetwork;
    }
    /**
     * Sub-segment ranges inside of a VPC Network.
     */
    export interface Schema$VpcSubNetwork {
        /**
         * Required. Network name. If the network is not part of the organization, the `compute.network.get` permission must be granted to the caller. Format: `//compute.googleapis.com/projects/{PROJECT_ID\}/global/networks/{NETWORK_NAME\}` Example: `//compute.googleapis.com/projects/my-project/global/networks/network-1`
         */
        network?: string | null;
        /**
         * CIDR block IP subnetwork specification. The IP address must be an IPv4 address and can be a public or private IP address. Note that for a CIDR IP address block, the specified IP address portion must be properly truncated (i.e. all the host bits must be zero) or the input is considered malformed. For example, "192.0.2.0/24" is accepted but "192.0.2.1/24" is not. If empty, all IP addresses are allowed.
         */
        vpcIpSubnetworks?: string[] | null;
    }
    export class Resource$Accesspolicies {
        context: APIRequestContext;
        accessLevels: Resource$Accesspolicies$Accesslevels;
        authorizedOrgsDescs: Resource$Accesspolicies$Authorizedorgsdescs;
        servicePerimeters: Resource$Accesspolicies$Serviceperimeters;
        constructor(context: APIRequestContext);
        /**
         * Creates an access policy. This method fails if the organization already has an access policy. The long-running operation has a successful status after the access policy propagates to long-lasting storage. Syntactic and basic semantic errors are returned in `metadata` as a BadRequest proto.
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
         * Deletes an access policy based on the resource name. The long-running operation has a successful status after the access policy is removed from long-lasting storage.
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
         * Returns an access policy based on the name.
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
         * Gets the IAM policy for the specified Access Context Manager access policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Accesspolicies$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Accesspolicies$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Accesspolicies$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Accesspolicies$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Accesspolicies$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists all access policies in an organization.
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
         * Updates an access policy. The long-running operation from this RPC has a successful status after the changes to the access policy propagate to long-lasting storage.
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
        /**
         * Sets the IAM policy for the specified Access Context Manager access policy. This method replaces the existing IAM policy on the access policy. The IAM policy controls the set of users who can perform specific operations on the Access Context Manager access policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Accesspolicies$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Accesspolicies$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Accesspolicies$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Accesspolicies$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Accesspolicies$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the IAM permissions that the caller has on the specified Access Context Manager resource. The resource can be an AccessPolicy, AccessLevel, or ServicePerimeter. This method does not support other resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Accesspolicies$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Accesspolicies$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Accesspolicies$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
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
    export interface Params$Resource$Accesspolicies$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
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
         * Output only. Identifier. Resource name of the `AccessPolicy`. Format: `accessPolicies/{access_policy\}`
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
    export interface Params$Resource$Accesspolicies$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Accesspolicies$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Accesspolicies$Accesslevels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an access level. The long-running operation from this RPC has a successful status after the access level propagates to long-lasting storage. If access levels contain errors, an error response is returned for the first error encountered.
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
         * Deletes an access level based on the resource name. The long-running operation from this RPC has a successful status after the access level has been removed from long-lasting storage.
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
         * Gets an access level based on the resource name.
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
         * Lists all access levels for an access policy.
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
         * Updates an access level. The long-running operation from this RPC has a successful status after the changes to the access level propagate to long-lasting storage. If access levels contain errors, an error response is returned for the first error encountered.
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
        /**
         * Replaces all existing access levels in an access policy with the access levels provided. This is done atomically. The long-running operation from this RPC has a successful status after all replacements propagate to long-lasting storage. If the replacement contains errors, an error response is returned for the first error encountered. Upon error, the replacement is cancelled, and existing access levels are not affected. The Operation.response field contains ReplaceAccessLevelsResponse. Removing access levels contained in existing service perimeters result in an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        replaceAll(params: Params$Resource$Accesspolicies$Accesslevels$Replaceall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        replaceAll(params?: Params$Resource$Accesspolicies$Accesslevels$Replaceall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        replaceAll(params: Params$Resource$Accesspolicies$Accesslevels$Replaceall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        replaceAll(params: Params$Resource$Accesspolicies$Accesslevels$Replaceall, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        replaceAll(params: Params$Resource$Accesspolicies$Accesslevels$Replaceall, callback: BodyResponseCallback<Schema$Operation>): void;
        replaceAll(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the IAM permissions that the caller has on the specified Access Context Manager resource. The resource can be an AccessPolicy, AccessLevel, or ServicePerimeter. This method does not support other resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Accesspolicies$Accesslevels$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Accesspolicies$Accesslevels$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Accesspolicies$Accesslevels$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Accesslevels$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Accesslevels$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
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
         * Identifier. Resource name for the `AccessLevel`. Format: `accessPolicies/{access_policy\}/accessLevels/{access_level\}`. The `access_level` component must begin with a letter, followed by alphanumeric characters or `_`. Its maximum length is 50 characters. After you create an `AccessLevel`, you cannot change its `name`.
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
    export interface Params$Resource$Accesspolicies$Accesslevels$Replaceall extends StandardParameters {
        /**
         * Required. Resource name for the access policy which owns these Access Levels. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReplaceAccessLevelsRequest;
    }
    export interface Params$Resource$Accesspolicies$Accesslevels$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Accesspolicies$Authorizedorgsdescs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an authorized orgs desc. The long-running operation from this RPC has a successful status after the authorized orgs desc propagates to long-lasting storage. If a authorized orgs desc contains errors, an error response is returned for the first error encountered. The name of this `AuthorizedOrgsDesc` will be assigned during creation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accesspolicies$Authorizedorgsdescs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes an authorized orgs desc based on the resource name. The long-running operation from this RPC has a successful status after the authorized orgs desc is removed from long-lasting storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an authorized orgs desc based on the resource name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accesspolicies$Authorizedorgsdescs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AuthorizedOrgsDesc>>;
        get(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Get, options: MethodOptions | BodyResponseCallback<Schema$AuthorizedOrgsDesc>, callback: BodyResponseCallback<Schema$AuthorizedOrgsDesc>): void;
        get(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Get, callback: BodyResponseCallback<Schema$AuthorizedOrgsDesc>): void;
        get(callback: BodyResponseCallback<Schema$AuthorizedOrgsDesc>): void;
        /**
         * Lists all authorized orgs descs for an access policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accesspolicies$Authorizedorgsdescs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAuthorizedOrgsDescsResponse>>;
        list(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$List, options: MethodOptions | BodyResponseCallback<Schema$ListAuthorizedOrgsDescsResponse>, callback: BodyResponseCallback<Schema$ListAuthorizedOrgsDescsResponse>): void;
        list(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$List, callback: BodyResponseCallback<Schema$ListAuthorizedOrgsDescsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAuthorizedOrgsDescsResponse>): void;
        /**
         * Updates an authorized orgs desc. The long-running operation from this RPC has a successful status after the authorized orgs desc propagates to long-lasting storage. If a authorized orgs desc contains errors, an error response is returned for the first error encountered. Only the organization list in `AuthorizedOrgsDesc` can be updated. The name, authorization_type, asset_type and authorization_direction cannot be updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accesspolicies$Authorizedorgsdescs$Create extends StandardParameters {
        /**
         * Required. Resource name for the access policy which owns this Authorized Orgs Desc. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AuthorizedOrgsDesc;
    }
    export interface Params$Resource$Accesspolicies$Authorizedorgsdescs$Delete extends StandardParameters {
        /**
         * Required. Resource name for the Authorized Orgs Desc. Format: `accessPolicies/{policy_id\}/authorizedOrgsDesc/{authorized_orgs_desc_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Authorizedorgsdescs$Get extends StandardParameters {
        /**
         * Required. Resource name for the Authorized Orgs Desc. Format: `accessPolicies/{policy_id\}/authorizedOrgsDescs/{authorized_orgs_descs_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Accesspolicies$Authorizedorgsdescs$List extends StandardParameters {
        /**
         * Number of Authorized Orgs Descs to include in the list. Default 100.
         */
        pageSize?: number;
        /**
         * Next page token for the next batch of Authorized Orgs Desc instances. Defaults to the first page of results.
         */
        pageToken?: string;
        /**
         * Required. Resource name for the access policy to list Authorized Orgs Desc from. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Accesspolicies$Authorizedorgsdescs$Patch extends StandardParameters {
        /**
         * Identifier. Resource name for the `AuthorizedOrgsDesc`. Format: `accessPolicies/{access_policy\}/authorizedOrgsDescs/{authorized_orgs_desc\}`. The `authorized_orgs_desc` component must begin with a letter, followed by alphanumeric characters or `_`. After you create an `AuthorizedOrgsDesc`, you cannot change its `name`.
         */
        name?: string;
        /**
         * Required. Mask to control which fields get updated. Must be non-empty.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AuthorizedOrgsDesc;
    }
    export class Resource$Accesspolicies$Serviceperimeters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Commits the dry-run specification for all the service perimeters in an access policy. A commit operation on a service perimeter involves copying its `spec` field to the `status` field of the service perimeter. Only service perimeters with `use_explicit_dry_run_spec` field set to true are affected by a commit operation. The long-running operation from this RPC has a successful status after the dry-run specifications for all the service perimeters have been committed. If a commit fails, it causes the long-running operation to return an error response and the entire commit operation is cancelled. When successful, the Operation.response field contains CommitServicePerimetersResponse. The `dry_run` and the `spec` fields are cleared after a successful commit operation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        commit(params: Params$Resource$Accesspolicies$Serviceperimeters$Commit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        commit(params?: Params$Resource$Accesspolicies$Serviceperimeters$Commit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        commit(params: Params$Resource$Accesspolicies$Serviceperimeters$Commit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        commit(params: Params$Resource$Accesspolicies$Serviceperimeters$Commit, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        commit(params: Params$Resource$Accesspolicies$Serviceperimeters$Commit, callback: BodyResponseCallback<Schema$Operation>): void;
        commit(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a service perimeter. The long-running operation from this RPC has a successful status after the service perimeter propagates to long-lasting storage. If a service perimeter contains errors, an error response is returned for the first error encountered.
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
         * Deletes a service perimeter based on the resource name. The long-running operation from this RPC has a successful status after the service perimeter is removed from long-lasting storage.
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
         * Gets a service perimeter based on the resource name.
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
         * Lists all service perimeters for an access policy.
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
         * Updates a service perimeter. The long-running operation from this RPC has a successful status after the service perimeter propagates to long-lasting storage. If a service perimeter contains errors, an error response is returned for the first error encountered.
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
        /**
         * Replace all existing service perimeters in an access policy with the service perimeters provided. This is done atomically. The long-running operation from this RPC has a successful status after all replacements propagate to long-lasting storage. Replacements containing errors result in an error response for the first error encountered. Upon an error, replacement are cancelled and existing service perimeters are not affected. The Operation.response field contains ReplaceServicePerimetersResponse.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        replaceAll(params: Params$Resource$Accesspolicies$Serviceperimeters$Replaceall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        replaceAll(params?: Params$Resource$Accesspolicies$Serviceperimeters$Replaceall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        replaceAll(params: Params$Resource$Accesspolicies$Serviceperimeters$Replaceall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        replaceAll(params: Params$Resource$Accesspolicies$Serviceperimeters$Replaceall, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        replaceAll(params: Params$Resource$Accesspolicies$Serviceperimeters$Replaceall, callback: BodyResponseCallback<Schema$Operation>): void;
        replaceAll(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the IAM permissions that the caller has on the specified Access Context Manager resource. The resource can be an AccessPolicy, AccessLevel, or ServicePerimeter. This method does not support other resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Commit extends StandardParameters {
        /**
         * Required. Resource name for the parent Access Policy which owns all Service Perimeters in scope for the commit operation. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CommitServicePerimetersRequest;
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
         * Identifier. Resource name for the `ServicePerimeter`. Format: `accessPolicies/{access_policy\}/servicePerimeters/{service_perimeter\}`. The `service_perimeter` component must begin with a letter, followed by alphanumeric characters or `_`. After you create a `ServicePerimeter`, you cannot change its `name`.
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
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Replaceall extends StandardParameters {
        /**
         * Required. Resource name for the access policy which owns these Service Perimeters. Format: `accessPolicies/{policy_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReplaceServicePerimetersRequest;
    }
    export interface Params$Resource$Accesspolicies$Serviceperimeters$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Operations {
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
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
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
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Operations$List extends StandardParameters {
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
    export class Resource$Organizations {
        context: APIRequestContext;
        gcpUserAccessBindings: Resource$Organizations$Gcpuseraccessbindings;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Gcpuseraccessbindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a GcpUserAccessBinding. If the client specifies a name, the server ignores it. Fails if a resource already exists with the same group_key. Completion of this long-running operation does not necessarily signify that the new binding is deployed onto all affected users, which may take more time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Gcpuseraccessbindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Gcpuseraccessbindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Organizations$Gcpuseraccessbindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Gcpuseraccessbindings$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Organizations$Gcpuseraccessbindings$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a GcpUserAccessBinding. Completion of this long-running operation does not necessarily signify that the binding deletion is deployed onto all affected users, which may take more time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Gcpuseraccessbindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Gcpuseraccessbindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Organizations$Gcpuseraccessbindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Gcpuseraccessbindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Organizations$Gcpuseraccessbindings$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the GcpUserAccessBinding with the given name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Gcpuseraccessbindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Gcpuseraccessbindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GcpUserAccessBinding>>;
        get(params: Params$Resource$Organizations$Gcpuseraccessbindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Gcpuseraccessbindings$Get, options: MethodOptions | BodyResponseCallback<Schema$GcpUserAccessBinding>, callback: BodyResponseCallback<Schema$GcpUserAccessBinding>): void;
        get(params: Params$Resource$Organizations$Gcpuseraccessbindings$Get, callback: BodyResponseCallback<Schema$GcpUserAccessBinding>): void;
        get(callback: BodyResponseCallback<Schema$GcpUserAccessBinding>): void;
        /**
         * Lists all GcpUserAccessBindings for a Google Cloud organization.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Gcpuseraccessbindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Gcpuseraccessbindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListGcpUserAccessBindingsResponse>>;
        list(params: Params$Resource$Organizations$Gcpuseraccessbindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Gcpuseraccessbindings$List, options: MethodOptions | BodyResponseCallback<Schema$ListGcpUserAccessBindingsResponse>, callback: BodyResponseCallback<Schema$ListGcpUserAccessBindingsResponse>): void;
        list(params: Params$Resource$Organizations$Gcpuseraccessbindings$List, callback: BodyResponseCallback<Schema$ListGcpUserAccessBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListGcpUserAccessBindingsResponse>): void;
        /**
         * Updates a GcpUserAccessBinding. Completion of this long-running operation does not necessarily signify that the changed binding is deployed onto all affected users, which may take more time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Gcpuseraccessbindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Gcpuseraccessbindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Organizations$Gcpuseraccessbindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Gcpuseraccessbindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Organizations$Gcpuseraccessbindings$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Organizations$Gcpuseraccessbindings$Create extends StandardParameters {
        /**
         * Required. Example: "organizations/256"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GcpUserAccessBinding;
    }
    export interface Params$Resource$Organizations$Gcpuseraccessbindings$Delete extends StandardParameters {
        /**
         * Required. Example: "organizations/256/gcpUserAccessBindings/b3-BhcX_Ud5N"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Gcpuseraccessbindings$Get extends StandardParameters {
        /**
         * Required. Example: "organizations/256/gcpUserAccessBindings/b3-BhcX_Ud5N"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Gcpuseraccessbindings$List extends StandardParameters {
        /**
         * Optional. Maximum number of items to return. The server may return fewer items. If left blank, the server may return any number of items.
         */
        pageSize?: number;
        /**
         * Optional. If left blank, returns the first page. To enumerate all items, use the next_page_token from your previous list operation.
         */
        pageToken?: string;
        /**
         * Required. Example: "organizations/256"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Gcpuseraccessbindings$Patch extends StandardParameters {
        /**
         * Optional. This field controls whether or not certain repeated settings in the update request overwrite or append to existing settings on the binding. If true, then append. Otherwise overwrite. So far, only scoped_access_settings with session_settings supports appending. Global access_levels, access_levels in scoped_access_settings, dry_run_access_levels, and session_settings are not compatible with append functionality, and the request will return an error if append=true when these settings are in the update_mask. The request will also return an error if append=true when "scoped_access_settings" is not set in the update_mask.
         */
        append?: boolean;
        /**
         * Immutable. Assigned by the server during creation. The last segment has an arbitrary length and has only URI unreserved characters (as defined by [RFC 3986 Section 2.3](https://tools.ietf.org/html/rfc3986#section-2.3)). Should not be specified by the client during creation. Example: "organizations/256/gcpUserAccessBindings/b3-BhcX_Ud5N"
         */
        name?: string;
        /**
         * Required. Only the fields specified in this mask are updated. Because name and group_key cannot be changed, update_mask is required and may only contain the following fields: `access_levels`, `dry_run_access_levels`, `session_settings`, `scoped_access_settings`. update_mask { paths: "access_levels" \}
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GcpUserAccessBinding;
    }
    export class Resource$Services {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a VPC-SC supported service based on the service name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Services$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Services$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SupportedService>>;
        get(params: Params$Resource$Services$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Services$Get, options: MethodOptions | BodyResponseCallback<Schema$SupportedService>, callback: BodyResponseCallback<Schema$SupportedService>): void;
        get(params: Params$Resource$Services$Get, callback: BodyResponseCallback<Schema$SupportedService>): void;
        get(callback: BodyResponseCallback<Schema$SupportedService>): void;
        /**
         * Lists all VPC-SC supported services.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Services$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Services$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSupportedServicesResponse>>;
        list(params: Params$Resource$Services$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Services$List, options: MethodOptions | BodyResponseCallback<Schema$ListSupportedServicesResponse>, callback: BodyResponseCallback<Schema$ListSupportedServicesResponse>): void;
        list(params: Params$Resource$Services$List, callback: BodyResponseCallback<Schema$ListSupportedServicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSupportedServicesResponse>): void;
    }
    export interface Params$Resource$Services$Get extends StandardParameters {
        /**
         * The name of the service to get information about. The names must be in the same format as used in defining a service perimeter, for example, `storage.googleapis.com`.
         */
        name?: string;
    }
    export interface Params$Resource$Services$List extends StandardParameters {
        /**
         * This flag specifies the maximum number of services to return per page. Default is 100.
         */
        pageSize?: number;
        /**
         * Token to start on a later page. Default is the first page.
         */
        pageToken?: string;
    }
    export {};
}
