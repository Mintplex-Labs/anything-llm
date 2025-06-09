import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace securitycenter_v1p1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1p1beta1';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
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
     * Security Command Center API
     *
     * Security Command Center API provides access to temporal views of assets and findings within an organization.
     *
     * @example
     * const {google} = require('googleapis');
     * const securitycenter = google.securitycenter('v1p1beta1');
     *
     * @namespace securitycenter
     * @type {Function}
     * @version v1p1beta1
     * @variation v1p1beta1
     * @param {object=} options Options for Securitycenter
     */
    export class Securitycenter {
        context: APIRequestContext;
        organizations: Resource$Organizations;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The configuration used for Asset Discovery runs.
     */
    export interface Schema$AssetDiscoveryConfig {
        /**
         * The mode to use for filtering asset discovery.
         */
        inclusionMode?: string | null;
        /**
         * The project ids to use for filtering asset discovery.
         */
        projectIds?: string[] | null;
    }
    /**
     * Specifies the audit configuration for a service. The configuration determines which permission types are logged, and what identities, if any, are exempted from logging. An AuditConfig must have one or more AuditLogConfigs. If there are AuditConfigs for both `allServices` and a specific service, the union of the two AuditConfigs is used for that service: the log_types specified in each AuditConfig are enabled, and the exempted_members in each AuditLogConfig are exempted. Example Policy with multiple AuditConfigs: { &quot;audit_configs&quot;: [ { &quot;service&quot;: &quot;allServices&quot;, &quot;audit_log_configs&quot;: [ { &quot;log_type&quot;: &quot;DATA_READ&quot;, &quot;exempted_members&quot;: [ &quot;user:jose@example.com&quot; ] }, { &quot;log_type&quot;: &quot;DATA_WRITE&quot; }, { &quot;log_type&quot;: &quot;ADMIN_READ&quot; } ] }, { &quot;service&quot;: &quot;sampleservice.googleapis.com&quot;, &quot;audit_log_configs&quot;: [ { &quot;log_type&quot;: &quot;DATA_READ&quot; }, { &quot;log_type&quot;: &quot;DATA_WRITE&quot;, &quot;exempted_members&quot;: [ &quot;user:aliya@example.com&quot; ] } ] } ] } For sampleservice, this policy enables DATA_READ, DATA_WRITE and ADMIN_READ logging. It also exempts jose@example.com from DATA_READ logging, and aliya@example.com from DATA_WRITE logging.
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
     * Provides the configuration for logging a type of permissions. Example: { &quot;audit_log_configs&quot;: [ { &quot;log_type&quot;: &quot;DATA_READ&quot;, &quot;exempted_members&quot;: [ &quot;user:jose@example.com&quot; ] }, { &quot;log_type&quot;: &quot;DATA_WRITE&quot; } ] } This enables &#39;DATA_READ&#39; and &#39;DATA_WRITE&#39; logging, while exempting jose@example.com from DATA_READ logging.
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
     * Associates `members` with a `role`.
     */
    export interface Schema$Binding {
        /**
         * The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the members in this binding. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$Expr;
        /**
         * Specifies the identities requesting access for a Cloud Platform resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. * `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account. * `user:{emailid}`: An email address that represents a specific Google account. For example, `alice@example.com` . * `serviceAccount:{emailid}`: An email address that represents a service account. For example, `my-other-app@appspot.gserviceaccount.com`. * `group:{emailid}`: An email address that represents a Google group. For example, `admins@example.com`. * `deleted:user:{emailid}?uid={uniqueid}`: An email address (plus unique identifier) representing a user that has been recently deleted. For example, `alice@example.com?uid=123456789012345678901`. If the user is recovered, this value reverts to `user:{emailid}` and the recovered user retains the role in the binding. * `deleted:serviceAccount:{emailid}?uid={uniqueid}`: An email address (plus unique identifier) representing a service account that has been recently deleted. For example, `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`. If the service account is undeleted, this value reverts to `serviceAccount:{emailid}` and the undeleted service account retains the role in the binding. * `deleted:group:{emailid}?uid={uniqueid}`: An email address (plus unique identifier) representing a Google group that has been recently deleted. For example, `admins@example.com?uid=123456789012345678901`. If the group is recovered, this value reverts to `group:{emailid}` and the recovered group retains the role in the binding. * `domain:{domain}`: The G Suite domain (primary) that represents all the users of that domain. For example, `google.com` or `example.com`.
         */
        members?: string[] | null;
        /**
         * Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
         */
        role?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } The JSON representation for `Empty` is empty JSON object `{}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: &quot;Summary size limit&quot; description: &quot;Determines if a summary is less than 100 chars&quot; expression: &quot;document.summary.size() &lt; 100&quot; Example (Equality): title: &quot;Requestor is owner&quot; description: &quot;Determines if requestor is the document owner&quot; expression: &quot;document.owner == request.auth.claims.email&quot; Example (Logic): title: &quot;Public documents&quot; description: &quot;Determine whether the document should be publicly visible&quot; expression: &quot;document.type != &#39;private&#39; &amp;&amp; document.type != &#39;internal&#39;&quot; Example (Data Manipulation): title: &quot;Notification string&quot; description: &quot;Create a notification string with a timestamp.&quot; expression: &quot;&#39;New message received at &#39; + string(document.create_time)&quot; The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
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
     * Security Command Center finding. A finding is a record of assessment data like security, risk, health, or privacy, that is ingested into Security Command Center for presentation, notification, analysis, policy testing, and enforcement. For example, a cross-site scripting (XSS) vulnerability in an App Engine application is a finding.
     */
    export interface Schema$Finding {
        /**
         * The additional taxonomy group within findings from a given source. This field is immutable after creation time. Example: &quot;XSS_FLASH_INJECTION&quot;
         */
        category?: string | null;
        /**
         * The time at which the finding was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * The time at which the event took place. For example, if the finding represents an open firewall it would capture the time the detector believes the firewall became open. The accuracy is determined by the detector.
         */
        eventTime?: string | null;
        /**
         * The URI that, if available, points to a web page outside of Security Command Center where additional information about the finding can be found. This field is guaranteed to be either empty or a well formed URL.
         */
        externalUri?: string | null;
        /**
         * The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}&quot;
         */
        name?: string | null;
        /**
         * The relative resource name of the source the finding belongs to. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name This field is immutable after creation time. For example: &quot;organizations/{organization_id}/sources/{source_id}&quot;
         */
        parent?: string | null;
        /**
         * For findings on Google Cloud resources, the full resource name of the Google Cloud resource this finding is for. See: https://cloud.google.com/apis/design/resource_names#full_resource_name When the finding is for a non-Google Cloud resource, the resourceName can be a customer or partner defined string. This field is immutable after creation time.
         */
        resourceName?: string | null;
        /**
         * Output only. User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the finding.
         */
        securityMarks?: Schema$SecurityMarks;
        /**
         * Source specific properties. These properties are managed by the source that writes the finding. The key names in the source_properties map must be between 1 and 255 characters, and must start with a letter and contain alphanumeric characters or underscores only.
         */
        sourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * The state of the finding.
         */
        state?: string | null;
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
         * Optional. The policy format version to be returned. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional bindings must specify version 3. Policies without any conditional bindings may specify any valid value or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        requestedPolicyVersion?: number | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1beta1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
    }
    /**
     * Cloud SCC&#39;s Notification
     */
    export interface Schema$GoogleCloudSecuritycenterV1NotificationMessage {
        /**
         * If it&#39;s a Finding based notification config, this field will be populated.
         */
        finding?: Schema$Finding;
        /**
         * Name of the notification config that generated current notification.
         */
        notificationConfigName?: string | null;
        /**
         * The Cloud resource tied to this notification&#39;s Finding.
         */
        resource?: Schema$GoogleCloudSecuritycenterV1Resource;
    }
    /**
     * Security Command Center representation of a Google Cloud resource. The Asset is a Security Command Center resource that captures information about a single Google Cloud resource. All modifications to an Asset are only within the context of Security Command Center and don&#39;t affect the referenced Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Asset {
        /**
         * The time at which the asset was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * Cloud IAM Policy information associated with the Google Cloud resource described by the Security Command Center asset. This information is managed and defined by the Google Cloud resource and cannot be modified by the user.
         */
        iamPolicy?: Schema$GoogleCloudSecuritycenterV1p1beta1IamPolicy;
        /**
         * The relative resource name of this asset. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/assets/{asset_id}&quot;.
         */
        name?: string | null;
        /**
         * Resource managed properties. These properties are managed and defined by the Google Cloud resource and cannot be modified by the user.
         */
        resourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * Security Command Center managed properties. These properties are managed by Security Command Center and cannot be modified by the user.
         */
        securityCenterProperties?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityCenterProperties;
        /**
         * User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the asset.
         */
        securityMarks?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
        /**
         * The time at which the asset was last updated, added, or deleted in Cloud SCC.
         */
        updateTime?: string | null;
    }
    /**
     * Security Command Center finding. A finding is a record of assessment data (security, risk, health or privacy) ingested into Security Command Center for presentation, notification, analysis, policy testing, and enforcement. For example, an XSS vulnerability in an App Engine application is a finding.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Finding {
        /**
         * The additional taxonomy group within findings from a given source. This field is immutable after creation time. Example: &quot;XSS_FLASH_INJECTION&quot;
         */
        category?: string | null;
        /**
         * The time at which the finding was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * The time at which the event took place. For example, if the finding represents an open firewall it would capture the time the detector believes the firewall became open. The accuracy is determined by the detector.
         */
        eventTime?: string | null;
        /**
         * The URI that, if available, points to a web page outside of Security Command Center where additional information about the finding can be found. This field is guaranteed to be either empty or a well formed URL.
         */
        externalUri?: string | null;
        /**
         * The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}&quot;
         */
        name?: string | null;
        /**
         * The relative resource name of the source the finding belongs to. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name This field is immutable after creation time. For example: &quot;organizations/{organization_id}/sources/{source_id}&quot;
         */
        parent?: string | null;
        /**
         * For findings on Google Cloud resources, the full resource name of the Google Cloud resource this finding is for. See: https://cloud.google.com/apis/design/resource_names#full_resource_name When the finding is for a non-Google Cloud resource, the resourceName can be a customer or partner defined string. This field is immutable after creation time.
         */
        resourceName?: string | null;
        /**
         * Output only. User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the finding.
         */
        securityMarks?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
        /**
         * The severity of the finding.
         */
        severity?: string | null;
        /**
         * Source specific properties. These properties are managed by the source that writes the finding. The key names in the source_properties map must be between 1 and 255 characters, and must start with a letter and contain alphanumeric characters or underscores only.
         */
        sourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * The state of the finding.
         */
        state?: string | null;
    }
    /**
     * Cloud IAM Policy information associated with the Google Cloud resource described by the Security Command Center asset. This information is managed and defined by the Google Cloud resource and cannot be modified by the user.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1IamPolicy {
        /**
         * The JSON representation of the Policy associated with the asset. See https://cloud.google.com/iam/docs/reference/rest/v1/Policy for format details.
         */
        policyBlob?: string | null;
    }
    /**
     * Security Command Center&#39;s Notification
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1NotificationMessage {
        /**
         * If it&#39;s a Finding based notification config, this field will be populated.
         */
        finding?: Schema$GoogleCloudSecuritycenterV1p1beta1Finding;
        /**
         * Name of the notification config that generated current notification.
         */
        notificationConfigName?: string | null;
        /**
         * The Cloud resource tied to the notification.
         */
        resource?: Schema$GoogleCloudSecuritycenterV1p1beta1Resource;
        /**
         * If it&#39;s an asset based notification config, this field will be populated.
         */
        temporalAsset?: Schema$GoogleCloudSecuritycenterV1p1beta1TemporalAsset;
    }
    /**
     *  Information related to the Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Resource {
        /**
         * The full resource name of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        name?: string | null;
        /**
         * The full resource name of resource&#39;s parent.
         */
        parent?: string | null;
        /**
         *  The human readable name of resource&#39;s parent.
         */
        parentDisplayName?: string | null;
        /**
         * The full resource name of project that the resource belongs to.
         */
        project?: string | null;
        /**
         *  The human readable name of project that the resource belongs to.
         */
        projectDisplayName?: string | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
    }
    /**
     * Security Command Center managed properties. These properties are managed by Security Command Center and cannot be modified by the user.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1SecurityCenterProperties {
        /**
         * The user defined display name for this resource.
         */
        resourceDisplayName?: string | null;
        /**
         * The full resource name of the Google Cloud resource this asset represents. This field is immutable after create time. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceName?: string | null;
        /**
         * Owners of the Google Cloud resource.
         */
        resourceOwners?: string[] | null;
        /**
         * The full resource name of the immediate parent of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceParent?: string | null;
        /**
         * The user defined display name for the parent of this resource.
         */
        resourceParentDisplayName?: string | null;
        /**
         * The full resource name of the project the resource belongs to. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceProject?: string | null;
        /**
         * The user defined display name for the project of this resource.
         */
        resourceProjectDisplayName?: string | null;
        /**
         * The type of the Google Cloud resource. Examples include: APPLICATION, PROJECT, and ORGANIZATION. This is a case insensitive field defined by Security Command Center and/or the producer of the resource and is immutable after create time.
         */
        resourceType?: string | null;
    }
    /**
     * User specified security marks that are attached to the parent Security Command Center resource. Security marks are scoped within a Security Command Center organization -- they can be modified and viewed by all users who have proper permissions on the organization.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks {
        /**
         * Mutable user specified security marks belonging to the parent resource. Constraints are as follows: * Keys and values are treated as case insensitive * Keys must be between 1 - 256 characters (inclusive) * Keys must be letters, numbers, underscores, or dashes * Values have leading and trailing whitespace trimmed, remaining characters must be between 1 - 4096 characters (inclusive)
         */
        marks?: {
            [key: string]: string;
        } | null;
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: &quot;organizations/{organization_id}/assets/{asset_id}/securityMarks&quot; &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks&quot;.
         */
        name?: string | null;
    }
    /**
     * Wrapper over asset object that also captures the state change for the asset e.g. if it was a newly created asset vs updated or deleted asset.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1TemporalAsset {
        /**
         * Asset data that includes attributes, properties and marks about the asset.
         */
        asset?: Schema$GoogleCloudSecuritycenterV1p1beta1Asset;
        /**
         * Represents if the asset was created/updated/deleted.
         */
        changeType?: string | null;
    }
    /**
     *  Information related to the Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1Resource {
        /**
         * The full resource name of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        name?: string | null;
        /**
         * The full resource name of resource&#39;s parent.
         */
        parent?: string | null;
        /**
         *  The human readable name of resource&#39;s parent.
         */
        parentDisplayName?: string | null;
        /**
         * The full resource name of project that the resource belongs to.
         */
        project?: string | null;
        /**
         *  The human readable name of project that the resource belongs to.
         */
        projectDisplayName?: string | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
    }
    /**
     * Request message for grouping by assets.
     */
    export interface Schema$GroupAssetsRequest {
        /**
         * When compare_duration is set, the GroupResult&#39;s &quot;state_change&quot; property is updated to indicate whether the asset was added, removed, or remained present during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state change value is derived based on the presence of the asset at the two points in time. Intermediate state changes between the two times don&#39;t affect the result. For example, the results aren&#39;t affected if the asset is removed and re-created again. Possible &quot;state_change&quot; values when compare_duration is specified: * &quot;ADDED&quot;: indicates that the asset was not present at the start of compare_duration, but present at reference_time. * &quot;REMOVED&quot;: indicates that the asset was present at the start of compare_duration, but not present at reference_time. * &quot;ACTIVE&quot;: indicates that the asset was present at both the start and the end of the time period defined by compare_duration and reference_time. If compare_duration is not specified, then the only possible state_change is &quot;UNUSED&quot;, which will be the state_change set for all assets present at read_time. If this field is set then `state_change` must be a specified field in `group_by`.
         */
        compareDuration?: string | null;
        /**
         * Expression that defines the filter to apply across assets. The expression is a list of zero or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. The fields map to those defined in the Asset resource. Examples include: * name * security_center_properties.resource_name * resource_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `&gt;`, `&lt;`, `&gt;=`, `&lt;=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following field and operator combinations are supported: * name: `=` * update_time: `=`, `&gt;`, `&lt;`, `&gt;=`, `&lt;=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `update_time = &quot;2019-06-10T16:07:18-07:00&quot;` `update_time = 1560208038000` * create_time: `=`, `&gt;`, `&lt;`, `&gt;=`, `&lt;=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `create_time = &quot;2019-06-10T16:07:18-07:00&quot;` `create_time = 1560208038000` * iam_policy.policy_blob: `=`, `:` * resource_properties: `=`, `:`, `&gt;`, `&lt;`, `&gt;=`, `&lt;=` * security_marks.marks: `=`, `:` * security_center_properties.resource_name: `=`, `:` * security_center_properties.resource_name_display_name: `=`, `:` * security_center_properties.resource_type: `=`, `:` * security_center_properties.resource_parent: `=`, `:` * security_center_properties.resource_parent_display_name: `=`, `:` * security_center_properties.resource_project: `=`, `:` * security_center_properties.resource_project_display_name: `=`, `:` * security_center_properties.resource_owners: `=`, `:` For example, `resource_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `resource_properties.my_property : &quot;&quot;` Use a negated partial match on the empty string to filter based on a property not existing: `-resource_properties.my_property : &quot;&quot;`
         */
        filter?: string | null;
        /**
         * Required. Expression that defines what assets fields to use for grouping. The string value should follow SQL syntax: comma separated list of fields. For example: &quot;security_center_properties.resource_project,security_center_properties.project&quot;. The following fields are supported when compare_duration is not set: * security_center_properties.resource_project * security_center_properties.resource_project_display_name * security_center_properties.resource_type * security_center_properties.resource_parent * security_center_properties.resource_parent_display_name The following fields are supported when compare_duration is set: * security_center_properties.resource_type * security_center_properties.resource_project_display_name * security_center_properties.resource_parent_display_name
         */
        groupBy?: string | null;
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number | null;
        /**
         * The value returned by the last `GroupAssetsResponse`; indicates that this is a continuation of a prior `GroupAssets` call, and that the system should return the next page of data.
         */
        pageToken?: string | null;
        /**
         * Time used as a reference point when filtering assets. The filter is limited to assets existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API&#39;s version of NOW.
         */
        readTime?: string | null;
    }
    /**
     * Response message for grouping by assets.
     */
    export interface Schema$GroupAssetsResponse {
        /**
         * Group results. There exists an element for each existing unique combination of property/values. The element contains a count for the number of times those specific property/values appear.
         */
        groupByResults?: Schema$GroupResult[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Time used for executing the groupBy request.
         */
        readTime?: string | null;
        /**
         * The total number of results matching the query.
         */
        totalSize?: number | null;
    }
    /**
     * Request message for grouping by findings.
     */
    export interface Schema$GroupFindingsRequest {
        /**
         * When compare_duration is set, the GroupResult&#39;s &quot;state_change&quot; attribute is updated to indicate whether the finding had its state changed, the finding&#39;s state remained unchanged, or if the finding was added during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence and state of the finding at the two points in time. Intermediate state changes between the two times don&#39;t affect the result. For example, the results aren&#39;t affected if the finding is made inactive and then active again. Possible &quot;state_change&quot; values when compare_duration is specified: * &quot;CHANGED&quot;: indicates that the finding was present and matched the given filter at the start of compare_duration, but changed its state at read_time. * &quot;UNCHANGED&quot;: indicates that the finding was present and matched the given filter at the start of compare_duration and did not change state at read_time. * &quot;ADDED&quot;: indicates that the finding did not match the given filter or was not present at the start of compare_duration, but was present at read_time. * &quot;REMOVED&quot;: indicates that the finding was present and matched the filter at the start of compare_duration, but did not match the filter at read_time. If compare_duration is not specified, then the only possible state_change is &quot;UNUSED&quot;, which will be the state_change set for all findings present at read_time. If this field is set then `state_change` must be a specified field in `group_by`.
         */
        compareDuration?: string | null;
        /**
         * Expression that defines the filter to apply across findings. The expression is a list of one or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. Examples include: * name * source_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `&gt;`, `&lt;`, `&gt;=`, `&lt;=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following field and operator combinations are supported: * name: `=` * parent: `=`, `:` * resource_name: `=`, `:` * state: `=`, `:` * category: `=`, `:` * external_uri: `=`, `:` * event_time: `=`, `&gt;`, `&lt;`, `&gt;=`, `&lt;=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `event_time = &quot;2019-06-10T16:07:18-07:00&quot;` `event_time = 1560208038000` * security_marks.marks: `=`, `:` * source_properties: `=`, `:`, `&gt;`, `&lt;`, `&gt;=`, `&lt;=` For example, `source_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `source_properties.my_property : &quot;&quot;` Use a negated partial match on the empty string to filter based on a property not existing: `-source_properties.my_property : &quot;&quot;`
         */
        filter?: string | null;
        /**
         * Required. Expression that defines what assets fields to use for grouping (including `state_change`). The string value should follow SQL syntax: comma separated list of fields. For example: &quot;parent,resource_name&quot;. The following fields are supported: * resource_name * category * state * parent The following fields are supported when compare_duration is set: * state_change
         */
        groupBy?: string | null;
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number | null;
        /**
         * The value returned by the last `GroupFindingsResponse`; indicates that this is a continuation of a prior `GroupFindings` call, and that the system should return the next page of data.
         */
        pageToken?: string | null;
        /**
         * Time used as a reference point when filtering findings. The filter is limited to findings existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API&#39;s version of NOW.
         */
        readTime?: string | null;
    }
    /**
     * Response message for group by findings.
     */
    export interface Schema$GroupFindingsResponse {
        /**
         * Group results. There exists an element for each existing unique combination of property/values. The element contains a count for the number of times those specific property/values appear.
         */
        groupByResults?: Schema$GroupResult[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Time used for executing the groupBy request.
         */
        readTime?: string | null;
        /**
         * The total number of results matching the query.
         */
        totalSize?: number | null;
    }
    /**
     * Result containing the properties and count of a groupBy request.
     */
    export interface Schema$GroupResult {
        /**
         * Total count of resources for the given properties.
         */
        count?: string | null;
        /**
         * Properties matching the groupBy fields in the request.
         */
        properties?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Response message for listing assets.
     */
    export interface Schema$ListAssetsResponse {
        /**
         * Assets matching the list request.
         */
        listAssetsResults?: Schema$ListAssetsResult[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Time used for executing the list request.
         */
        readTime?: string | null;
        /**
         * The total number of assets matching the query.
         */
        totalSize?: number | null;
    }
    /**
     * Result containing the Asset and its State.
     */
    export interface Schema$ListAssetsResult {
        /**
         * Asset matching the search request.
         */
        asset?: Schema$GoogleCloudSecuritycenterV1p1beta1Asset;
        /**
         * State change of the asset between the points in time.
         */
        stateChange?: string | null;
    }
    /**
     * Response message for listing findings.
     */
    export interface Schema$ListFindingsResponse {
        /**
         * Findings matching the list request.
         */
        listFindingsResults?: Schema$ListFindingsResult[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Time used for executing the list request.
         */
        readTime?: string | null;
        /**
         * The total number of findings matching the query.
         */
        totalSize?: number | null;
    }
    /**
     * Result containing the Finding and its StateChange.
     */
    export interface Schema$ListFindingsResult {
        /**
         * Finding matching the search request.
         */
        finding?: Schema$GoogleCloudSecuritycenterV1p1beta1Finding;
        /**
         * Output only. Resource that is associated with this finding.
         */
        resource?: Schema$Resource;
        /**
         * State change of the finding between the points in time.
         */
        stateChange?: string | null;
    }
    /**
     * Response message for listing notification configs.
     */
    export interface Schema$ListNotificationConfigsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Notification configs belonging to the requested parent.
         */
        notificationConfigs?: Schema$NotificationConfig[];
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
     * Response message for listing sources.
     */
    export interface Schema$ListSourcesResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Sources belonging to the requested parent.
         */
        sources?: Schema$Source[];
    }
    /**
     * Security Command Center notification configs. A notification config is a Security Command Center resource that contains the configuration to send notifications for create/update events of findings, assets and etc.
     */
    export interface Schema$NotificationConfig {
        /**
         * The description of the notification config (max of 1024 characters).
         */
        description?: string | null;
        /**
         * The type of events the config is for, e.g. FINDING.
         */
        eventType?: string | null;
        /**
         * The relative resource name of this notification config. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/notificationConfigs/notify_public_bucket&quot;.
         */
        name?: string | null;
        /**
         * The Pub/Sub topic to send notifications to. Its format is &quot;projects/[project_id]/topics/[topic]&quot;.
         */
        pubsubTopic?: string | null;
        /**
         * Output only. The service account that needs &quot;pubsub.topics.publish&quot; permission to publish to the Pub/Sub topic.
         */
        serviceAccount?: string | null;
        /**
         * The config for triggering streaming-based notifications.
         */
        streamingConfig?: Schema$StreamingConfig;
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
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`.
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
     * User specified settings that are attached to the Security Command Center organization.
     */
    export interface Schema$OrganizationSettings {
        /**
         * The configuration used for Asset Discovery runs.
         */
        assetDiscoveryConfig?: Schema$AssetDiscoveryConfig;
        /**
         * A flag that indicates if Asset Discovery should be enabled. If the flag is set to `true`, then discovery of assets will occur. If it is set to `false, all historical assets will remain, but discovery of future assets will not occur.
         */
        enableAssetDiscovery?: boolean | null;
        /**
         * The relative resource name of the settings. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/organizationSettings&quot;.
         */
        name?: string | null;
    }
    /**
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members` to a single `role`. Members can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** { &quot;bindings&quot;: [ { &quot;role&quot;: &quot;roles/resourcemanager.organizationAdmin&quot;, &quot;members&quot;: [ &quot;user:mike@example.com&quot;, &quot;group:admins@example.com&quot;, &quot;domain:google.com&quot;, &quot;serviceAccount:my-project-id@appspot.gserviceaccount.com&quot; ] }, { &quot;role&quot;: &quot;roles/resourcemanager.organizationViewer&quot;, &quot;members&quot;: [ &quot;user:eve@example.com&quot; ], &quot;condition&quot;: { &quot;title&quot;: &quot;expirable access&quot;, &quot;description&quot;: &quot;Does not grant access after Sep 2020&quot;, &quot;expression&quot;: &quot;request.time &lt; timestamp(&#39;2020-10-01T00:00:00.000Z&#39;)&quot;, } } ], &quot;etag&quot;: &quot;BwWWja0YfJA=&quot;, &quot;version&quot;: 3 } **YAML example:** bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time &lt; timestamp(&#39;2020-10-01T00:00:00.000Z&#39;) - etag: BwWWja0YfJA= - version: 3 For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
        /**
         * Specifies cloud audit logging configuration for this policy.
         */
        auditConfigs?: Schema$AuditConfig[];
        /**
         * Associates a list of `members` to a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one member.
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
     * Information related to the Google Cloud resource that is associated with this finding. LINT.IfChange
     */
    export interface Schema$Resource {
        /**
         * The full resource name of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        name?: string | null;
        /**
         * The human readable name of resource&#39;s parent.
         */
        parentDisplayName?: string | null;
        /**
         * The full resource name of resource&#39;s parent.
         */
        parentName?: string | null;
        /**
         * The human readable name of project that the resource belongs to.
         */
        projectDisplayName?: string | null;
        /**
         * The full resource name of project that the resource belongs to.
         */
        projectName?: string | null;
    }
    /**
     * Request message for running asset discovery for an organization.
     */
    export interface Schema$RunAssetDiscoveryRequest {
    }
    /**
     * User specified security marks that are attached to the parent Security Command Center resource. Security marks are scoped within a Security Command Center organization -- they can be modified and viewed by all users who have proper permissions on the organization.
     */
    export interface Schema$SecurityMarks {
        /**
         * Mutable user specified security marks belonging to the parent resource. Constraints are as follows: * Keys and values are treated as case insensitive * Keys must be between 1 - 256 characters (inclusive) * Keys must be letters, numbers, underscores, or dashes * Values have leading and trailing whitespace trimmed, remaining characters must be between 1 - 4096 characters (inclusive)
         */
        marks?: {
            [key: string]: string;
        } | null;
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: &quot;organizations/{organization_id}/assets/{asset_id}/securityMarks&quot; &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks&quot;.
         */
        name?: string | null;
    }
    /**
     * Request message for updating a finding&#39;s state.
     */
    export interface Schema$SetFindingStateRequest {
        /**
         * Required. The time at which the updated state takes effect.
         */
        startTime?: string | null;
        /**
         * Required. The desired State of the finding.
         */
        state?: string | null;
    }
    /**
     * Request message for `SetIamPolicy` method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Cloud Platform services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
        /**
         * OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only the fields in the mask will be modified. If no mask is provided, the following default mask is used: `paths: &quot;bindings, etag&quot;`
         */
        updateMask?: string | null;
    }
    /**
     * Security Command Center finding source. A finding source is an entity or a mechanism that can produce a finding. A source is like a container of findings that come from the same scanner, logger, monitor, etc.
     */
    export interface Schema$Source {
        /**
         * The description of the source (max of 1024 characters). Example: &quot;Web Security Scanner is a web security scanner for common vulnerabilities in App Engine applications. It can automatically scan and detect four common vulnerabilities, including cross-site-scripting (XSS), Flash injection, mixed content (HTTP in HTTPS), and outdated/insecure libraries.&quot;
         */
        description?: string | null;
        /**
         * The source&#39;s display name. A source&#39;s display name must be unique amongst its siblings, for example, two sources with the same parent can&#39;t share the same display name. The display name must have a length between 1 and 64 characters (inclusive).
         */
        displayName?: string | null;
        /**
         * The relative resource name of this source. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/sources/{source_id}&quot;
         */
        name?: string | null;
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
     * The config for streaming-based notifications, which send each event as soon as it is detected.
     */
    export interface Schema$StreamingConfig {
        /**
         * Expression that defines the filter to apply across create/update events of assets or findings as specified by the event type. The expression is a list of zero or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. The fields map to those defined in the corresponding resource. The supported operators are: * `=` for all value types. * `&gt;`, `&lt;`, `&gt;=`, `&lt;=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes.
         */
        filter?: string | null;
    }
    /**
     * Request message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the `resource`. Permissions with wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
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
    export class Resource$Organizations {
        context: APIRequestContext;
        assets: Resource$Organizations$Assets;
        notificationConfigs: Resource$Organizations$Notificationconfigs;
        operations: Resource$Organizations$Operations;
        sources: Resource$Organizations$Sources;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.getOrganizationSettings
         * @desc Gets the settings for an organization.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.getOrganizationSettings({
         *     // Required. Name of the organization to get organization settings for. Its format is "organizations/[organization_id]/organizationSettings".
         *     name: 'organizations/my-organization/organizationSettings',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assetDiscoveryConfig": {},
         *   //   "enableAssetDiscovery": false,
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.getOrganizationSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. Name of the organization to get organization settings for. Its format is "organizations/[organization_id]/organizationSettings".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getOrganizationSettings(params: Params$Resource$Organizations$Getorganizationsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getOrganizationSettings(params?: Params$Resource$Organizations$Getorganizationsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OrganizationSettings>>;
        getOrganizationSettings(params: Params$Resource$Organizations$Getorganizationsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getOrganizationSettings(params: Params$Resource$Organizations$Getorganizationsettings, options: MethodOptions | BodyResponseCallback<Schema$OrganizationSettings>, callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
        getOrganizationSettings(params: Params$Resource$Organizations$Getorganizationsettings, callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
        getOrganizationSettings(callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
        /**
         * securitycenter.organizations.updateOrganizationSettings
         * @desc  Updates an organization's settings.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.updateOrganizationSettings({
         *     // The relative resource name of the settings. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/organizationSettings".
         *     name: 'organizations/my-organization/organizationSettings',
         *     // The FieldMask to use when updating the settings resource. If empty all mutable fields will be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "assetDiscoveryConfig": {},
         *       //   "enableAssetDiscovery": false,
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "assetDiscoveryConfig": {},
         *   //   "enableAssetDiscovery": false,
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.updateOrganizationSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of the settings. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/organizationSettings".
         * @param {string=} params.updateMask The FieldMask to use when updating the settings resource. If empty all mutable fields will be updated.
         * @param {().OrganizationSettings} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateOrganizationSettings(params: Params$Resource$Organizations$Updateorganizationsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateOrganizationSettings(params?: Params$Resource$Organizations$Updateorganizationsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OrganizationSettings>>;
        updateOrganizationSettings(params: Params$Resource$Organizations$Updateorganizationsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateOrganizationSettings(params: Params$Resource$Organizations$Updateorganizationsettings, options: MethodOptions | BodyResponseCallback<Schema$OrganizationSettings>, callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
        updateOrganizationSettings(params: Params$Resource$Organizations$Updateorganizationsettings, callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
        updateOrganizationSettings(callback: BodyResponseCallback<Schema$OrganizationSettings>): void;
    }
    export interface Params$Resource$Organizations$Getorganizationsettings extends StandardParameters {
        /**
         * Required. Name of the organization to get organization settings for. Its format is "organizations/[organization_id]/organizationSettings".
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Updateorganizationsettings extends StandardParameters {
        /**
         * The relative resource name of the settings. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/organizationSettings".
         */
        name?: string;
        /**
         * The FieldMask to use when updating the settings resource. If empty all mutable fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$OrganizationSettings;
    }
    export class Resource$Organizations$Assets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.assets.group
         * @desc Filters an organization's assets and groups them by their specified properties.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.assets.group({
         *     // Required. Name of the organization to groupBy. Its format is "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "compareDuration": "my_compareDuration",
         *       //   "filter": "my_filter",
         *       //   "groupBy": "my_groupBy",
         *       //   "pageSize": 0,
         *       //   "pageToken": "my_pageToken",
         *       //   "readTime": "my_readTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "groupByResults": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "readTime": "my_readTime",
         *   //   "totalSize": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.assets.group
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent Required. Name of the organization to groupBy. Its format is "organizations/[organization_id]".
         * @param {().GroupAssetsRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        group(params: Params$Resource$Organizations$Assets$Group, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        group(params?: Params$Resource$Organizations$Assets$Group, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GroupAssetsResponse>>;
        group(params: Params$Resource$Organizations$Assets$Group, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        group(params: Params$Resource$Organizations$Assets$Group, options: MethodOptions | BodyResponseCallback<Schema$GroupAssetsResponse>, callback: BodyResponseCallback<Schema$GroupAssetsResponse>): void;
        group(params: Params$Resource$Organizations$Assets$Group, callback: BodyResponseCallback<Schema$GroupAssetsResponse>): void;
        group(callback: BodyResponseCallback<Schema$GroupAssetsResponse>): void;
        /**
         * securitycenter.organizations.assets.list
         * @desc Lists an organization's assets.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.assets.list({
         *     // When compare_duration is set, the ListAssetsResult's "state_change" attribute is updated to indicate whether the asset was added, removed, or remained present during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence of the asset at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the asset is removed and re-created again. Possible "state_change" values when compare_duration is specified: * "ADDED": indicates that the asset was not present at the start of compare_duration, but present at read_time. * "REMOVED": indicates that the asset was present at the start of compare_duration, but not present at read_time. * "ACTIVE": indicates that the asset was present at both the start and the end of the time period defined by compare_duration and read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all assets present at read_time.
         *     compareDuration: 'placeholder-value',
         *     //  A field mask to specify the ListAssetsResult fields to be listed in the response. An empty field mask will list all fields.
         *     fieldMask: 'placeholder-value',
         *     // Expression that defines the filter to apply across assets. The expression is a list of zero or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. The fields map to those defined in the Asset resource. Examples include: * name * security_center_properties.resource_name * resource_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following are the allowed field and operator combinations: * name: `=` * update_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `update_time = "2019-06-10T16:07:18-07:00"` `update_time = 1560208038000` * create_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `create_time = "2019-06-10T16:07:18-07:00"` `create_time = 1560208038000` * iam_policy.policy_blob: `=`, `:` * resource_properties: `=`, `:`, `>`, `<`, `>=`, `<=` * security_marks.marks: `=`, `:` * security_center_properties.resource_name: `=`, `:` * security_center_properties.resource_display_name: `=`, `:` * security_center_properties.resource_type: `=`, `:` * security_center_properties.resource_parent: `=`, `:` * security_center_properties.resource_parent_display_name: `=`, `:` * security_center_properties.resource_project: `=`, `:` * security_center_properties.resource_project_display_name: `=`, `:` * security_center_properties.resource_owners: `=`, `:` For example, `resource_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `resource_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-resource_properties.my_property : ""`
         *     filter: 'placeholder-value',
         *     // Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,resource_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,resource_properties.a_property" and " name desc , resource_properties.a_property " are equivalent. The following fields are supported: name update_time resource_properties security_marks.marks security_center_properties.resource_name security_center_properties.resource_display_name security_center_properties.resource_parent security_center_properties.resource_parent_display_name security_center_properties.resource_project security_center_properties.resource_project_display_name security_center_properties.resource_type
         *     orderBy: 'placeholder-value',
         *     // The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListAssetsResponse`; indicates that this is a continuation of a prior `ListAssets` call, and that the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. Name of the organization assets should belong to. Its format is "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *     // Time used as a reference point when filtering assets. The filter is limited to assets existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         *     readTime: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "listAssetsResults": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "readTime": "my_readTime",
         *   //   "totalSize": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.assets.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.compareDuration When compare_duration is set, the ListAssetsResult's "state_change" attribute is updated to indicate whether the asset was added, removed, or remained present during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence of the asset at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the asset is removed and re-created again. Possible "state_change" values when compare_duration is specified: * "ADDED": indicates that the asset was not present at the start of compare_duration, but present at read_time. * "REMOVED": indicates that the asset was present at the start of compare_duration, but not present at read_time. * "ACTIVE": indicates that the asset was present at both the start and the end of the time period defined by compare_duration and read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all assets present at read_time.
         * @param {string=} params.fieldMask  A field mask to specify the ListAssetsResult fields to be listed in the response. An empty field mask will list all fields.
         * @param {string=} params.filter Expression that defines the filter to apply across assets. The expression is a list of zero or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. The fields map to those defined in the Asset resource. Examples include: * name * security_center_properties.resource_name * resource_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following are the allowed field and operator combinations: * name: `=` * update_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `update_time = "2019-06-10T16:07:18-07:00"` `update_time = 1560208038000` * create_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `create_time = "2019-06-10T16:07:18-07:00"` `create_time = 1560208038000` * iam_policy.policy_blob: `=`, `:` * resource_properties: `=`, `:`, `>`, `<`, `>=`, `<=` * security_marks.marks: `=`, `:` * security_center_properties.resource_name: `=`, `:` * security_center_properties.resource_display_name: `=`, `:` * security_center_properties.resource_type: `=`, `:` * security_center_properties.resource_parent: `=`, `:` * security_center_properties.resource_parent_display_name: `=`, `:` * security_center_properties.resource_project: `=`, `:` * security_center_properties.resource_project_display_name: `=`, `:` * security_center_properties.resource_owners: `=`, `:` For example, `resource_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `resource_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-resource_properties.my_property : ""`
         * @param {string=} params.orderBy Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,resource_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,resource_properties.a_property" and " name desc , resource_properties.a_property " are equivalent. The following fields are supported: name update_time resource_properties security_marks.marks security_center_properties.resource_name security_center_properties.resource_display_name security_center_properties.resource_parent security_center_properties.resource_parent_display_name security_center_properties.resource_project security_center_properties.resource_project_display_name security_center_properties.resource_type
         * @param {integer=} params.pageSize The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         * @param {string=} params.pageToken The value returned by the last `ListAssetsResponse`; indicates that this is a continuation of a prior `ListAssets` call, and that the system should return the next page of data.
         * @param {string} params.parent Required. Name of the organization assets should belong to. Its format is "organizations/[organization_id]".
         * @param {string=} params.readTime Time used as a reference point when filtering assets. The filter is limited to assets existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Assets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Assets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAssetsResponse>>;
        list(params: Params$Resource$Organizations$Assets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Assets$List, options: MethodOptions | BodyResponseCallback<Schema$ListAssetsResponse>, callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
        list(params: Params$Resource$Organizations$Assets$List, callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
        /**
         * securitycenter.organizations.assets.runDiscovery
         * @desc Runs asset discovery. The discovery is tracked with a long-running operation. // This API can only be called with limited frequency for an organization. If it is called too frequently the caller will receive a TOO_MANY_REQUESTS error.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.assets.runDiscovery({
         *     // Required. Name of the organization to run asset discovery for. Its format is "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {}
         *     },
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
         * @alias securitycenter.organizations.assets.runDiscovery
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent Required. Name of the organization to run asset discovery for. Its format is "organizations/[organization_id]".
         * @param {().RunAssetDiscoveryRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        runDiscovery(params: Params$Resource$Organizations$Assets$Rundiscovery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runDiscovery(params?: Params$Resource$Organizations$Assets$Rundiscovery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        runDiscovery(params: Params$Resource$Organizations$Assets$Rundiscovery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runDiscovery(params: Params$Resource$Organizations$Assets$Rundiscovery, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        runDiscovery(params: Params$Resource$Organizations$Assets$Rundiscovery, callback: BodyResponseCallback<Schema$Operation>): void;
        runDiscovery(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * securitycenter.organizations.assets.updateSecurityMarks
         * @desc  Updates security marks.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.assets.updateSecurityMarks({
         *     // The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         *     name: 'organizations/my-organization/assets/my-asset/securityMarks',
         *     // The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         *     startTime: 'placeholder-value',
         *     // The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "marks": {},
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "marks": {},
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.assets.updateSecurityMarks
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         * @param {string=} params.startTime The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         * @param {string=} params.updateMask The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         * @param {().GoogleCloudSecuritycenterV1p1beta1SecurityMarks} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateSecurityMarks(params: Params$Resource$Organizations$Assets$Updatesecuritymarks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSecurityMarks(params?: Params$Resource$Organizations$Assets$Updatesecuritymarks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>>;
        updateSecurityMarks(params: Params$Resource$Organizations$Assets$Updatesecuritymarks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSecurityMarks(params: Params$Resource$Organizations$Assets$Updatesecuritymarks, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
        updateSecurityMarks(params: Params$Resource$Organizations$Assets$Updatesecuritymarks, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
        updateSecurityMarks(callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
    }
    export interface Params$Resource$Organizations$Assets$Group extends StandardParameters {
        /**
         * Required. Name of the organization to groupBy. Its format is "organizations/[organization_id]".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GroupAssetsRequest;
    }
    export interface Params$Resource$Organizations$Assets$List extends StandardParameters {
        /**
         * When compare_duration is set, the ListAssetsResult's "state_change" attribute is updated to indicate whether the asset was added, removed, or remained present during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence of the asset at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the asset is removed and re-created again. Possible "state_change" values when compare_duration is specified: * "ADDED": indicates that the asset was not present at the start of compare_duration, but present at read_time. * "REMOVED": indicates that the asset was present at the start of compare_duration, but not present at read_time. * "ACTIVE": indicates that the asset was present at both the start and the end of the time period defined by compare_duration and read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all assets present at read_time.
         */
        compareDuration?: string;
        /**
         *  A field mask to specify the ListAssetsResult fields to be listed in the response. An empty field mask will list all fields.
         */
        fieldMask?: string;
        /**
         * Expression that defines the filter to apply across assets. The expression is a list of zero or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. The fields map to those defined in the Asset resource. Examples include: * name * security_center_properties.resource_name * resource_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following are the allowed field and operator combinations: * name: `=` * update_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `update_time = "2019-06-10T16:07:18-07:00"` `update_time = 1560208038000` * create_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `create_time = "2019-06-10T16:07:18-07:00"` `create_time = 1560208038000` * iam_policy.policy_blob: `=`, `:` * resource_properties: `=`, `:`, `>`, `<`, `>=`, `<=` * security_marks.marks: `=`, `:` * security_center_properties.resource_name: `=`, `:` * security_center_properties.resource_display_name: `=`, `:` * security_center_properties.resource_type: `=`, `:` * security_center_properties.resource_parent: `=`, `:` * security_center_properties.resource_parent_display_name: `=`, `:` * security_center_properties.resource_project: `=`, `:` * security_center_properties.resource_project_display_name: `=`, `:` * security_center_properties.resource_owners: `=`, `:` For example, `resource_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `resource_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-resource_properties.my_property : ""`
         */
        filter?: string;
        /**
         * Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,resource_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,resource_properties.a_property" and " name desc , resource_properties.a_property " are equivalent. The following fields are supported: name update_time resource_properties security_marks.marks security_center_properties.resource_name security_center_properties.resource_display_name security_center_properties.resource_parent security_center_properties.resource_parent_display_name security_center_properties.resource_project security_center_properties.resource_project_display_name security_center_properties.resource_type
         */
        orderBy?: string;
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListAssetsResponse`; indicates that this is a continuation of a prior `ListAssets` call, and that the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. Name of the organization assets should belong to. Its format is "organizations/[organization_id]".
         */
        parent?: string;
        /**
         * Time used as a reference point when filtering assets. The filter is limited to assets existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         */
        readTime?: string;
    }
    export interface Params$Resource$Organizations$Assets$Rundiscovery extends StandardParameters {
        /**
         * Required. Name of the organization to run asset discovery for. Its format is "organizations/[organization_id]".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunAssetDiscoveryRequest;
    }
    export interface Params$Resource$Organizations$Assets$Updatesecuritymarks extends StandardParameters {
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         */
        name?: string;
        /**
         * The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         */
        startTime?: string;
        /**
         * The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
    }
    export class Resource$Organizations$Notificationconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.notificationConfigs.create
         * @desc Creates a notification config.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.notificationConfigs.create({
         *     // Required. Unique identifier provided by the client within the parent scope. It must be between 1 and 128 characters, and contains alphanumeric characters, underscores or hyphens only.
         *     configId: 'placeholder-value',
         *     // Required. Resource name of the new notification config's parent. Its format is "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "eventType": "my_eventType",
         *       //   "name": "my_name",
         *       //   "pubsubTopic": "my_pubsubTopic",
         *       //   "serviceAccount": "my_serviceAccount",
         *       //   "streamingConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "eventType": "my_eventType",
         *   //   "name": "my_name",
         *   //   "pubsubTopic": "my_pubsubTopic",
         *   //   "serviceAccount": "my_serviceAccount",
         *   //   "streamingConfig": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.notificationConfigs.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.configId Required. Unique identifier provided by the client within the parent scope. It must be between 1 and 128 characters, and contains alphanumeric characters, underscores or hyphens only.
         * @param {string} params.parent Required. Resource name of the new notification config's parent. Its format is "organizations/[organization_id]".
         * @param {().NotificationConfig} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Organizations$Notificationconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Notificationconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationConfig>>;
        create(params: Params$Resource$Organizations$Notificationconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Notificationconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$NotificationConfig>, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        create(params: Params$Resource$Organizations$Notificationconfigs$Create, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        create(callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        /**
         * securitycenter.organizations.notificationConfigs.delete
         * @desc Deletes a notification config.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.notificationConfigs.delete({
         *     // Required. Name of the notification config to delete. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         *     name:
         *       'organizations/my-organization/notificationConfigs/my-notificationConfig',
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
         * @alias securitycenter.organizations.notificationConfigs.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. Name of the notification config to delete. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Organizations$Notificationconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Notificationconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Notificationconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Notificationconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Notificationconfigs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * securitycenter.organizations.notificationConfigs.get
         * @desc Gets a notification config.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.notificationConfigs.get({
         *     // Required. Name of the notification config to get. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         *     name:
         *       'organizations/my-organization/notificationConfigs/my-notificationConfig',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "eventType": "my_eventType",
         *   //   "name": "my_name",
         *   //   "pubsubTopic": "my_pubsubTopic",
         *   //   "serviceAccount": "my_serviceAccount",
         *   //   "streamingConfig": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.notificationConfigs.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. Name of the notification config to get. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Organizations$Notificationconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Notificationconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationConfig>>;
        get(params: Params$Resource$Organizations$Notificationconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Notificationconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$NotificationConfig>, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        get(params: Params$Resource$Organizations$Notificationconfigs$Get, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        get(callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        /**
         * securitycenter.organizations.notificationConfigs.list
         * @desc Lists notification configs.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.notificationConfigs.list({
         *     // The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListNotificationConfigsResponse`; indicates that this is a continuation of a prior `ListNotificationConfigs` call, and that the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. Name of the organization to list notification configs. Its format is "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "notificationConfigs": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.notificationConfigs.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         * @param {string=} params.pageToken The value returned by the last `ListNotificationConfigsResponse`; indicates that this is a continuation of a prior `ListNotificationConfigs` call, and that the system should return the next page of data.
         * @param {string} params.parent Required. Name of the organization to list notification configs. Its format is "organizations/[organization_id]".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Notificationconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Notificationconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNotificationConfigsResponse>>;
        list(params: Params$Resource$Organizations$Notificationconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Notificationconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$ListNotificationConfigsResponse>, callback: BodyResponseCallback<Schema$ListNotificationConfigsResponse>): void;
        list(params: Params$Resource$Organizations$Notificationconfigs$List, callback: BodyResponseCallback<Schema$ListNotificationConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNotificationConfigsResponse>): void;
        /**
         * securitycenter.organizations.notificationConfigs.patch
         * @desc  Updates a notification config. The following update fields are allowed: description, pubsub_topic, streaming_config.filter
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.notificationConfigs.patch({
         *     // The relative resource name of this notification config. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/notificationConfigs/notify_public_bucket".
         *     name:
         *       'organizations/my-organization/notificationConfigs/my-notificationConfig',
         *     // The FieldMask to use when updating the notification config. If empty all mutable fields will be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "eventType": "my_eventType",
         *       //   "name": "my_name",
         *       //   "pubsubTopic": "my_pubsubTopic",
         *       //   "serviceAccount": "my_serviceAccount",
         *       //   "streamingConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "eventType": "my_eventType",
         *   //   "name": "my_name",
         *   //   "pubsubTopic": "my_pubsubTopic",
         *   //   "serviceAccount": "my_serviceAccount",
         *   //   "streamingConfig": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.notificationConfigs.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of this notification config. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/notificationConfigs/notify_public_bucket".
         * @param {string=} params.updateMask The FieldMask to use when updating the notification config. If empty all mutable fields will be updated.
         * @param {().NotificationConfig} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Organizations$Notificationconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Notificationconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationConfig>>;
        patch(params: Params$Resource$Organizations$Notificationconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Notificationconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$NotificationConfig>, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        patch(params: Params$Resource$Organizations$Notificationconfigs$Patch, callback: BodyResponseCallback<Schema$NotificationConfig>): void;
        patch(callback: BodyResponseCallback<Schema$NotificationConfig>): void;
    }
    export interface Params$Resource$Organizations$Notificationconfigs$Create extends StandardParameters {
        /**
         * Required. Unique identifier provided by the client within the parent scope. It must be between 1 and 128 characters, and contains alphanumeric characters, underscores or hyphens only.
         */
        configId?: string;
        /**
         * Required. Resource name of the new notification config's parent. Its format is "organizations/[organization_id]".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NotificationConfig;
    }
    export interface Params$Resource$Organizations$Notificationconfigs$Delete extends StandardParameters {
        /**
         * Required. Name of the notification config to delete. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Notificationconfigs$Get extends StandardParameters {
        /**
         * Required. Name of the notification config to get. Its format is "organizations/[organization_id]/notificationConfigs/[config_id]".
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Notificationconfigs$List extends StandardParameters {
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListNotificationConfigsResponse`; indicates that this is a continuation of a prior `ListNotificationConfigs` call, and that the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. Name of the organization to list notification configs. Its format is "organizations/[organization_id]".
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Notificationconfigs$Patch extends StandardParameters {
        /**
         * The relative resource name of this notification config. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/notificationConfigs/notify_public_bucket".
         */
        name?: string;
        /**
         * The FieldMask to use when updating the notification config. If empty all mutable fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NotificationConfig;
    }
    export class Resource$Organizations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.operations.cancel
         * @desc Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.operations.cancel({
         *     // The name of the operation resource to be cancelled.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.cancel
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource to be cancelled.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Organizations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * securitycenter.organizations.operations.delete
         * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.operations.delete({
         *     // The name of the operation resource to be deleted.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource to be deleted.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Organizations$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * securitycenter.organizations.operations.get
         * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.operations.get({
         *     // The name of the operation resource.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Organizations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Organizations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Organizations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * securitycenter.organizations.operations.list
         * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding allows API services to override the binding to use different resource name schemes, such as `users/x/operations`. To override the binding, API services can add a binding such as `"/v1/{name=users/x}/operations"` to their service configuration. For backwards compatibility, the default name includes the operations collection id, however overriding users must ensure the name binding is the parent resource, without the operations collection id.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.operations.list({
         *     // The standard list filter.
         *     filter: 'placeholder-value',
         *     // The name of the operation's parent resource.
         *     name: 'organizations/my-organization/operations',
         *     // The standard list page size.
         *     pageSize: 'placeholder-value',
         *     // The standard list page token.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "operations": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.operations.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter The standard list filter.
         * @param {string} params.name The name of the operation's parent resource.
         * @param {integer=} params.pageSize The standard list page size.
         * @param {string=} params.pageToken The standard list page token.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Organizations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Organizations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Organizations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$List extends StandardParameters {
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
    export class Resource$Organizations$Sources {
        context: APIRequestContext;
        findings: Resource$Organizations$Sources$Findings;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.sources.create
         * @desc Creates a source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.create({
         *     // Required. Resource name of the new source's parent. Its format should be "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent Required. Resource name of the new source's parent. Its format should be "organizations/[organization_id]".
         * @param {().Source} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Organizations$Sources$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Sources$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Source>>;
        create(params: Params$Resource$Organizations$Sources$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Sources$Create, options: MethodOptions | BodyResponseCallback<Schema$Source>, callback: BodyResponseCallback<Schema$Source>): void;
        create(params: Params$Resource$Organizations$Sources$Create, callback: BodyResponseCallback<Schema$Source>): void;
        create(callback: BodyResponseCallback<Schema$Source>): void;
        /**
         * securitycenter.organizations.sources.get
         * @desc Gets a source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.get({
         *     // Required. Relative resource name of the source. Its format is "organizations/[organization_id]/source/[source_id]".
         *     name: 'organizations/my-organization/sources/my-source',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. Relative resource name of the source. Its format is "organizations/[organization_id]/source/[source_id]".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Organizations$Sources$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Sources$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Source>>;
        get(params: Params$Resource$Organizations$Sources$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Sources$Get, options: MethodOptions | BodyResponseCallback<Schema$Source>, callback: BodyResponseCallback<Schema$Source>): void;
        get(params: Params$Resource$Organizations$Sources$Get, callback: BodyResponseCallback<Schema$Source>): void;
        get(callback: BodyResponseCallback<Schema$Source>): void;
        /**
         * securitycenter.organizations.sources.getIamPolicy
         * @desc Gets the access control policy on the specified Source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.getIamPolicy({
         *     // REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         *     resource: 'organizations/my-organization/sources/my-source',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "options": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "auditConfigs": [],
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.getIamPolicy
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         * @param {().GetIamPolicyRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getIamPolicy(params: Params$Resource$Organizations$Sources$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Organizations$Sources$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Organizations$Sources$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Organizations$Sources$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Organizations$Sources$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * securitycenter.organizations.sources.list
         * @desc Lists all sources belonging to an organization.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.list({
         *     // The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListSourcesResponse`; indicates that this is a continuation of a prior `ListSources` call, and that the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. Resource name of the parent of sources to list. Its format should be "organizations/[organization_id]".
         *     parent: 'organizations/my-organization',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sources": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         * @param {string=} params.pageToken The value returned by the last `ListSourcesResponse`; indicates that this is a continuation of a prior `ListSources` call, and that the system should return the next page of data.
         * @param {string} params.parent Required. Resource name of the parent of sources to list. Its format should be "organizations/[organization_id]".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Sources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Sources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSourcesResponse>>;
        list(params: Params$Resource$Organizations$Sources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Sources$List, options: MethodOptions | BodyResponseCallback<Schema$ListSourcesResponse>, callback: BodyResponseCallback<Schema$ListSourcesResponse>): void;
        list(params: Params$Resource$Organizations$Sources$List, callback: BodyResponseCallback<Schema$ListSourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSourcesResponse>): void;
        /**
         * securitycenter.organizations.sources.patch
         * @desc  Updates a source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.patch({
         *     // The relative resource name of this source. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}"
         *     name: 'organizations/my-organization/sources/my-source',
         *     // The FieldMask to use when updating the source resource. If empty all mutable fields will be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of this source. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}"
         * @param {string=} params.updateMask The FieldMask to use when updating the source resource. If empty all mutable fields will be updated.
         * @param {().Source} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Organizations$Sources$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Sources$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Source>>;
        patch(params: Params$Resource$Organizations$Sources$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Sources$Patch, options: MethodOptions | BodyResponseCallback<Schema$Source>, callback: BodyResponseCallback<Schema$Source>): void;
        patch(params: Params$Resource$Organizations$Sources$Patch, callback: BodyResponseCallback<Schema$Source>): void;
        patch(callback: BodyResponseCallback<Schema$Source>): void;
        /**
         * securitycenter.organizations.sources.setIamPolicy
         * @desc Sets the access control policy on the specified Source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.setIamPolicy({
         *     // REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         *     resource: 'organizations/my-organization/sources/my-source',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "policy": {},
         *       //   "updateMask": "my_updateMask"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "auditConfigs": [],
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.setIamPolicy
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         * @param {().SetIamPolicyRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setIamPolicy(params: Params$Resource$Organizations$Sources$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Organizations$Sources$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Organizations$Sources$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Organizations$Sources$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Organizations$Sources$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * securitycenter.organizations.sources.testIamPermissions
         * @desc Returns the permissions that a caller has on the specified source.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.testIamPermissions({
         *     // REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         *     resource: 'organizations/my-organization/sources/my-source',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "permissions": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "permissions": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.testIamPermissions
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         * @param {().TestIamPermissionsRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        testIamPermissions(params: Params$Resource$Organizations$Sources$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Organizations$Sources$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Organizations$Sources$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Organizations$Sources$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Organizations$Sources$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Organizations$Sources$Create extends StandardParameters {
        /**
         * Required. Resource name of the new source's parent. Its format should be "organizations/[organization_id]".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Source;
    }
    export interface Params$Resource$Organizations$Sources$Get extends StandardParameters {
        /**
         * Required. Relative resource name of the source. Its format is "organizations/[organization_id]/source/[source_id]".
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Sources$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Organizations$Sources$List extends StandardParameters {
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListSourcesResponse`; indicates that this is a continuation of a prior `ListSources` call, and that the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the parent of sources to list. Its format should be "organizations/[organization_id]".
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Sources$Patch extends StandardParameters {
        /**
         * The relative resource name of this source. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}"
         */
        name?: string;
        /**
         * The FieldMask to use when updating the source resource. If empty all mutable fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Source;
    }
    export interface Params$Resource$Organizations$Sources$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Organizations$Sources$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Organizations$Sources$Findings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.sources.findings.create
         * @desc  Creates a finding. The corresponding source must exist for finding creation to succeed.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.create({
         *     // Required. Unique identifier provided by the client within the parent scope.
         *     findingId: 'placeholder-value',
         *     // Required. Resource name of the new finding's parent. Its format should be "organizations/[organization_id]/sources/[source_id]".
         *     parent: 'organizations/my-organization/sources/my-source',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "category": "my_category",
         *       //   "createTime": "my_createTime",
         *       //   "eventTime": "my_eventTime",
         *       //   "externalUri": "my_externalUri",
         *       //   "name": "my_name",
         *       //   "parent": "my_parent",
         *       //   "resourceName": "my_resourceName",
         *       //   "securityMarks": {},
         *       //   "severity": "my_severity",
         *       //   "sourceProperties": {},
         *       //   "state": "my_state"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "category": "my_category",
         *   //   "createTime": "my_createTime",
         *   //   "eventTime": "my_eventTime",
         *   //   "externalUri": "my_externalUri",
         *   //   "name": "my_name",
         *   //   "parent": "my_parent",
         *   //   "resourceName": "my_resourceName",
         *   //   "securityMarks": {},
         *   //   "severity": "my_severity",
         *   //   "sourceProperties": {},
         *   //   "state": "my_state"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.findingId Required. Unique identifier provided by the client within the parent scope.
         * @param {string} params.parent Required. Resource name of the new finding's parent. Its format should be "organizations/[organization_id]/sources/[source_id]".
         * @param {().GoogleCloudSecuritycenterV1p1beta1Finding} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Organizations$Sources$Findings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Sources$Findings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>>;
        create(params: Params$Resource$Organizations$Sources$Findings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Sources$Findings$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        create(params: Params$Resource$Organizations$Sources$Findings$Create, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        /**
         * securitycenter.organizations.sources.findings.group
         * @desc Filters an organization or source's findings and groups them by their specified properties. To group across all sources provide a `-` as the source id. Example: /v1p1beta1/organizations/{organization_id}/sources/-/findings
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.group({
         *     // Required. Name of the source to groupBy. Its format is "organizations/[organization_id]/sources/[source_id]". To groupBy across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         *     parent: 'organizations/my-organization/sources/my-source',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "compareDuration": "my_compareDuration",
         *       //   "filter": "my_filter",
         *       //   "groupBy": "my_groupBy",
         *       //   "pageSize": 0,
         *       //   "pageToken": "my_pageToken",
         *       //   "readTime": "my_readTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "groupByResults": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "readTime": "my_readTime",
         *   //   "totalSize": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.group
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent Required. Name of the source to groupBy. Its format is "organizations/[organization_id]/sources/[source_id]". To groupBy across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         * @param {().GroupFindingsRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        group(params: Params$Resource$Organizations$Sources$Findings$Group, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        group(params?: Params$Resource$Organizations$Sources$Findings$Group, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GroupFindingsResponse>>;
        group(params: Params$Resource$Organizations$Sources$Findings$Group, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        group(params: Params$Resource$Organizations$Sources$Findings$Group, options: MethodOptions | BodyResponseCallback<Schema$GroupFindingsResponse>, callback: BodyResponseCallback<Schema$GroupFindingsResponse>): void;
        group(params: Params$Resource$Organizations$Sources$Findings$Group, callback: BodyResponseCallback<Schema$GroupFindingsResponse>): void;
        group(callback: BodyResponseCallback<Schema$GroupFindingsResponse>): void;
        /**
         * securitycenter.organizations.sources.findings.list
         * @desc Lists an organization or source's findings. To list across all sources provide a `-` as the source id. Example: /v1p1beta1/organizations/{organization_id}/sources/-/findings
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.list({
         *     // When compare_duration is set, the ListFindingsResult's "state_change" attribute is updated to indicate whether the finding had its state changed, the finding's state remained unchanged, or if the finding was added in any state during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence and state of the finding at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the finding is made inactive and then active again. Possible "state_change" values when compare_duration is specified: * "CHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration, but changed its state at read_time. * "UNCHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration and did not change state at read_time. * "ADDED": indicates that the finding did not match the given filter or was not present at the start of compare_duration, but was present at read_time. * "REMOVED": indicates that the finding was present and matched the filter at the start of compare_duration, but did not match the filter at read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all findings present at read_time.
         *     compareDuration: 'placeholder-value',
         *     //  A field mask to specify the Finding fields to be listed in the response. An empty field mask will list all fields.
         *     fieldMask: 'placeholder-value',
         *     // Expression that defines the filter to apply across findings. The expression is a list of one or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. Examples include: * name * source_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following field and operator combinations are supported: name: `=` parent: `=`, `:` resource_name: `=`, `:` state: `=`, `:` category: `=`, `:` external_uri: `=`, `:` event_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `event_time = "2019-06-10T16:07:18-07:00"` `event_time = 1560208038000` security_marks.marks: `=`, `:` source_properties: `=`, `:`, `>`, `<`, `>=`, `<=` For example, `source_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `source_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-source_properties.my_property : ""`
         *     filter: 'placeholder-value',
         *     // Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,source_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,source_properties.a_property" and " name desc , source_properties.a_property " are equivalent. The following fields are supported: name parent state category resource_name event_time source_properties security_marks.marks
         *     orderBy: 'placeholder-value',
         *     // The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListFindingsResponse`; indicates that this is a continuation of a prior `ListFindings` call, and that the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. Name of the source the findings belong to. Its format is "organizations/[organization_id]/sources/[source_id]". To list across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         *     parent: 'organizations/my-organization/sources/my-source',
         *     // Time used as a reference point when filtering findings. The filter is limited to findings existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         *     readTime: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "listFindingsResults": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "readTime": "my_readTime",
         *   //   "totalSize": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.compareDuration When compare_duration is set, the ListFindingsResult's "state_change" attribute is updated to indicate whether the finding had its state changed, the finding's state remained unchanged, or if the finding was added in any state during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence and state of the finding at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the finding is made inactive and then active again. Possible "state_change" values when compare_duration is specified: * "CHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration, but changed its state at read_time. * "UNCHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration and did not change state at read_time. * "ADDED": indicates that the finding did not match the given filter or was not present at the start of compare_duration, but was present at read_time. * "REMOVED": indicates that the finding was present and matched the filter at the start of compare_duration, but did not match the filter at read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all findings present at read_time.
         * @param {string=} params.fieldMask  A field mask to specify the Finding fields to be listed in the response. An empty field mask will list all fields.
         * @param {string=} params.filter Expression that defines the filter to apply across findings. The expression is a list of one or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. Examples include: * name * source_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following field and operator combinations are supported: name: `=` parent: `=`, `:` resource_name: `=`, `:` state: `=`, `:` category: `=`, `:` external_uri: `=`, `:` event_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `event_time = "2019-06-10T16:07:18-07:00"` `event_time = 1560208038000` security_marks.marks: `=`, `:` source_properties: `=`, `:`, `>`, `<`, `>=`, `<=` For example, `source_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `source_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-source_properties.my_property : ""`
         * @param {string=} params.orderBy Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,source_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,source_properties.a_property" and " name desc , source_properties.a_property " are equivalent. The following fields are supported: name parent state category resource_name event_time source_properties security_marks.marks
         * @param {integer=} params.pageSize The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         * @param {string=} params.pageToken The value returned by the last `ListFindingsResponse`; indicates that this is a continuation of a prior `ListFindings` call, and that the system should return the next page of data.
         * @param {string} params.parent Required. Name of the source the findings belong to. Its format is "organizations/[organization_id]/sources/[source_id]". To list across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         * @param {string=} params.readTime Time used as a reference point when filtering findings. The filter is limited to findings existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Sources$Findings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Sources$Findings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFindingsResponse>>;
        list(params: Params$Resource$Organizations$Sources$Findings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Sources$Findings$List, options: MethodOptions | BodyResponseCallback<Schema$ListFindingsResponse>, callback: BodyResponseCallback<Schema$ListFindingsResponse>): void;
        list(params: Params$Resource$Organizations$Sources$Findings$List, callback: BodyResponseCallback<Schema$ListFindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFindingsResponse>): void;
        /**
         * securitycenter.organizations.sources.findings.patch
         * @desc  Creates or updates a finding. The corresponding source must exist for a finding creation to succeed.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.patch({
         *     // The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}"
         *     name: 'organizations/my-organization/sources/my-source/findings/my-finding',
         *     // The FieldMask to use when updating the finding resource. This field should not be specified when creating a finding. When updating a finding, an empty mask is treated as updating all mutable fields and replacing source_properties. Individual source_properties can be added/updated by using "source_properties." in the field mask.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "category": "my_category",
         *       //   "createTime": "my_createTime",
         *       //   "eventTime": "my_eventTime",
         *       //   "externalUri": "my_externalUri",
         *       //   "name": "my_name",
         *       //   "parent": "my_parent",
         *       //   "resourceName": "my_resourceName",
         *       //   "securityMarks": {},
         *       //   "severity": "my_severity",
         *       //   "sourceProperties": {},
         *       //   "state": "my_state"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "category": "my_category",
         *   //   "createTime": "my_createTime",
         *   //   "eventTime": "my_eventTime",
         *   //   "externalUri": "my_externalUri",
         *   //   "name": "my_name",
         *   //   "parent": "my_parent",
         *   //   "resourceName": "my_resourceName",
         *   //   "securityMarks": {},
         *   //   "severity": "my_severity",
         *   //   "sourceProperties": {},
         *   //   "state": "my_state"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}"
         * @param {string=} params.updateMask The FieldMask to use when updating the finding resource. This field should not be specified when creating a finding. When updating a finding, an empty mask is treated as updating all mutable fields and replacing source_properties. Individual source_properties can be added/updated by using "source_properties." in the field mask.
         * @param {().GoogleCloudSecuritycenterV1p1beta1Finding} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Organizations$Sources$Findings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Sources$Findings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>>;
        patch(params: Params$Resource$Organizations$Sources$Findings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Sources$Findings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        patch(params: Params$Resource$Organizations$Sources$Findings$Patch, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        /**
         * securitycenter.organizations.sources.findings.setState
         * @desc  Updates the state of a finding.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.setState({
         *     // Required. The relative resource name of the finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/finding/{finding_id}".
         *     name: 'organizations/my-organization/sources/my-source/findings/my-finding',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "startTime": "my_startTime",
         *       //   "state": "my_state"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "category": "my_category",
         *   //   "createTime": "my_createTime",
         *   //   "eventTime": "my_eventTime",
         *   //   "externalUri": "my_externalUri",
         *   //   "name": "my_name",
         *   //   "parent": "my_parent",
         *   //   "resourceName": "my_resourceName",
         *   //   "securityMarks": {},
         *   //   "severity": "my_severity",
         *   //   "sourceProperties": {},
         *   //   "state": "my_state"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.setState
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. The relative resource name of the finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/finding/{finding_id}".
         * @param {().SetFindingStateRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setState(params: Params$Resource$Organizations$Sources$Findings$Setstate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setState(params?: Params$Resource$Organizations$Sources$Findings$Setstate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>>;
        setState(params: Params$Resource$Organizations$Sources$Findings$Setstate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setState(params: Params$Resource$Organizations$Sources$Findings$Setstate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        setState(params: Params$Resource$Organizations$Sources$Findings$Setstate, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        setState(callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1Finding>): void;
        /**
         * securitycenter.organizations.sources.findings.updateSecurityMarks
         * @desc  Updates security marks.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await securitycenter.organizations.sources.findings.updateSecurityMarks(
         *     {
         *       // The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         *       name:
         *         'organizations/my-organization/sources/my-source/findings/my-finding/securityMarks',
         *       // The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         *       startTime: 'placeholder-value',
         *       // The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "marks": {},
         *         //   "name": "my_name"
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "marks": {},
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias securitycenter.organizations.sources.findings.updateSecurityMarks
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         * @param {string=} params.startTime The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         * @param {string=} params.updateMask The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         * @param {().GoogleCloudSecuritycenterV1p1beta1SecurityMarks} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateSecurityMarks(params: Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSecurityMarks(params?: Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>>;
        updateSecurityMarks(params: Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSecurityMarks(params: Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
        updateSecurityMarks(params: Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks, callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
        updateSecurityMarks(callback: BodyResponseCallback<Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks>): void;
    }
    export interface Params$Resource$Organizations$Sources$Findings$Create extends StandardParameters {
        /**
         * Required. Unique identifier provided by the client within the parent scope.
         */
        findingId?: string;
        /**
         * Required. Resource name of the new finding's parent. Its format should be "organizations/[organization_id]/sources/[source_id]".
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudSecuritycenterV1p1beta1Finding;
    }
    export interface Params$Resource$Organizations$Sources$Findings$Group extends StandardParameters {
        /**
         * Required. Name of the source to groupBy. Its format is "organizations/[organization_id]/sources/[source_id]". To groupBy across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GroupFindingsRequest;
    }
    export interface Params$Resource$Organizations$Sources$Findings$List extends StandardParameters {
        /**
         * When compare_duration is set, the ListFindingsResult's "state_change" attribute is updated to indicate whether the finding had its state changed, the finding's state remained unchanged, or if the finding was added in any state during the compare_duration period of time that precedes the read_time. This is the time between (read_time - compare_duration) and read_time. The state_change value is derived based on the presence and state of the finding at the two points in time. Intermediate state changes between the two times don't affect the result. For example, the results aren't affected if the finding is made inactive and then active again. Possible "state_change" values when compare_duration is specified: * "CHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration, but changed its state at read_time. * "UNCHANGED": indicates that the finding was present and matched the given filter at the start of compare_duration and did not change state at read_time. * "ADDED": indicates that the finding did not match the given filter or was not present at the start of compare_duration, but was present at read_time. * "REMOVED": indicates that the finding was present and matched the filter at the start of compare_duration, but did not match the filter at read_time. If compare_duration is not specified, then the only possible state_change is "UNUSED", which will be the state_change set for all findings present at read_time.
         */
        compareDuration?: string;
        /**
         *  A field mask to specify the Finding fields to be listed in the response. An empty field mask will list all fields.
         */
        fieldMask?: string;
        /**
         * Expression that defines the filter to apply across findings. The expression is a list of one or more restrictions combined via logical operators `AND` and `OR`. Parentheses are supported, and `OR` has higher precedence than `AND`. Restrictions have the form ` ` and may have a `-` character in front of them to indicate negation. Examples include: * name * source_properties.a_property * security_marks.marks.marka The supported operators are: * `=` for all value types. * `>`, `<`, `>=`, `<=` for integer values. * `:`, meaning substring matching, for strings. The supported value types are: * string literals in quotes. * integer literals without quotes. * boolean literals `true` and `false` without quotes. The following field and operator combinations are supported: name: `=` parent: `=`, `:` resource_name: `=`, `:` state: `=`, `:` category: `=`, `:` external_uri: `=`, `:` event_time: `=`, `>`, `<`, `>=`, `<=` Usage: This should be milliseconds since epoch or an RFC3339 string. Examples: `event_time = "2019-06-10T16:07:18-07:00"` `event_time = 1560208038000` security_marks.marks: `=`, `:` source_properties: `=`, `:`, `>`, `<`, `>=`, `<=` For example, `source_properties.size = 100` is a valid filter string. Use a partial match on the empty string to filter based on a property existing: `source_properties.my_property : ""` Use a negated partial match on the empty string to filter based on a property not existing: `-source_properties.my_property : ""`
         */
        filter?: string;
        /**
         * Expression that defines what fields and order to use for sorting. The string value should follow SQL syntax: comma separated list of fields. For example: "name,resource_properties.a_property". The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be appended to the field name. For example: "name desc,source_properties.a_property". Redundant space characters in the syntax are insignificant. "name desc,source_properties.a_property" and " name desc , source_properties.a_property " are equivalent. The following fields are supported: name parent state category resource_name event_time source_properties security_marks.marks
         */
        orderBy?: string;
        /**
         * The maximum number of results to return in a single response. Default is 10, minimum is 1, maximum is 1000.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListFindingsResponse`; indicates that this is a continuation of a prior `ListFindings` call, and that the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. Name of the source the findings belong to. Its format is "organizations/[organization_id]/sources/[source_id]". To list across all sources provide a source_id of `-`. For example: organizations/{organization_id}/sources/-
         */
        parent?: string;
        /**
         * Time used as a reference point when filtering findings. The filter is limited to findings existing at the supplied time and their values are those at that specific time. Absence of this field will default to the API's version of NOW.
         */
        readTime?: string;
    }
    export interface Params$Resource$Organizations$Sources$Findings$Patch extends StandardParameters {
        /**
         * The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}"
         */
        name?: string;
        /**
         * The FieldMask to use when updating the finding resource. This field should not be specified when creating a finding. When updating a finding, an empty mask is treated as updating all mutable fields and replacing source_properties. Individual source_properties can be added/updated by using "source_properties." in the field mask.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudSecuritycenterV1p1beta1Finding;
    }
    export interface Params$Resource$Organizations$Sources$Findings$Setstate extends StandardParameters {
        /**
         * Required. The relative resource name of the finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: "organizations/{organization_id}/sources/{source_id}/finding/{finding_id}".
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetFindingStateRequest;
    }
    export interface Params$Resource$Organizations$Sources$Findings$Updatesecuritymarks extends StandardParameters {
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: "organizations/{organization_id}/assets/{asset_id}/securityMarks" "organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks".
         */
        name?: string;
        /**
         * The time at which the updated SecurityMarks take effect. If not set uses current server time. Updates will be applied to the SecurityMarks that are active immediately preceding this time.
         */
        startTime?: string;
        /**
         * The FieldMask to use when updating the security marks resource. The field mask must not contain duplicate fields. If empty or set to "marks", all marks will be replaced. Individual marks can be updated using "marks.".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
    }
    export {};
}
