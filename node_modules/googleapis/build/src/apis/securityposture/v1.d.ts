import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace securityposture_v1 {
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
     * Security Posture API
     *
     * Defines, assesses, and monitors the overall status of your security in Google Cloud. You can use security postures to evaluate your current cloud security against defined benchmarks and help maintain the level of security that your organization requires.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const securityposture = google.securityposture('v1');
     * ```
     */
    export class Securityposture {
        context: APIRequestContext;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Details of a Cloud Asset Inventory asset that caused a violation.
     */
    export interface Schema$AssetDetails {
        /**
         * Information about the Cloud Asset Inventory asset that violated a policy. The format of this information can change at any time without prior notice. Your application must not depend on this information in any way.
         */
        asset?: string | null;
        /**
         * The type of Cloud Asset Inventory asset. For a list of asset types, see [Supported asset types](https://cloud.google.com/asset-inventory/docs/supported-asset-types).
         */
        assetType?: string | null;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Information about a compliance standard that the policy helps enforce.
     */
    export interface Schema$ComplianceStandard {
        /**
         * Optional. The control in the compliance standard that the policy helps enforce. For example, `AC-3`.
         */
        control?: string | null;
        /**
         * Optional. The compliance standard that the policy helps enforce. For example, `NIST SP 800-53`.
         */
        standard?: string | null;
    }
    /**
     * Metadata for a constraint in a Policy.
     */
    export interface Schema$Constraint {
        /**
         * Optional. A predefined organization policy constraint.
         */
        orgPolicyConstraint?: Schema$OrgPolicyConstraint;
        /**
         * Optional. A custom organization policy constraint.
         */
        orgPolicyConstraintCustom?: Schema$OrgPolicyConstraintCustom;
        /**
         * Optional. A custom module for Security Health Analytics.
         */
        securityHealthAnalyticsCustomModule?: Schema$SecurityHealthAnalyticsCustomModule;
        /**
         * Optional. A built-in detector for Security Health Analytics.
         */
        securityHealthAnalyticsModule?: Schema$SecurityHealthAnalyticsModule;
    }
    /**
     * Request message for CreateIaCValidationReport.
     */
    export interface Schema$CreateIaCValidationReportRequest {
        /**
         * Required. The infrastructure-as-code (IaC) configuration to validate.
         */
        iac?: Schema$IaC;
    }
    /**
     * A custom module configuration for Security Health Analytics. Use `CustomConfig` to create custom detectors that generate custom findings for resources that you specify.
     */
    export interface Schema$CustomConfig {
        /**
         * Optional. Definitions of custom source properties to include in findings.
         */
        customOutput?: Schema$CustomOutputSpec;
        /**
         * Optional. A description of the vulnerability or misconfiguration that the custom module detects. The description appears in each finding. Provide enough information to help an investigator understand the finding. The value must be enclosed in quotation marks.
         */
        description?: string | null;
        /**
         * Required. The Common Expression Language (CEL) expression to evaluate. When the expression evaluates to `true` for a resource, a finding is generated.
         */
        predicate?: Schema$Expr;
        /**
         * Required. An explanation of the steps that security teams can take to resolve the detected issue. The explanation appears in each finding.
         */
        recommendation?: string | null;
        /**
         * Required. The resource types that the custom module operates on.
         */
        resourceSelector?: Schema$ResourceSelector;
        /**
         * Required. The severity of findings generated by the custom module.
         */
        severity?: string | null;
    }
    /**
     * Definitions of custom source properties that can appear in findings.
     */
    export interface Schema$CustomOutputSpec {
        /**
         * Optional. The custom source properties that can appear in findings.
         */
        properties?: Schema$Property[];
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
     * Request message for ExtractPosture.
     */
    export interface Schema$ExtractPostureRequest {
        /**
         * Required. An identifier for the posture.
         */
        postureId?: string | null;
        /**
         * Required. The organization, folder, or project from which policies are extracted. Must be within the organization defined in parent. Use one of the following formats: * `organization/{organization_number\}` * `folder/{folder_number\}` * `project/{project_number\}`
         */
        workload?: string | null;
    }
    /**
     * A custom, user-defined constraint. You can apply the constraint only to the resource types specified in the constraint, and only within the organization where the constraint is defined. _When you create a custom constraint, it is not enforced automatically._ You must use an organization policy to [enforce the constraint](https://cloud.google.com/resource-manager/help/organization-policy/constraints/enforce).
     */
    export interface Schema$GoogleCloudSecuritypostureV1CustomConstraint {
        /**
         * Whether to allow or deny the action.
         */
        actionType?: string | null;
        /**
         * A Common Expression Language (CEL) condition expression that must evaluate to `true` for the constraint to be enforced. The maximum length is 1000 characters. For example: + `resource.instanceName.matches('(production|test)_(.+_)?[\d]+')`: Evaluates to `true` if the resource's `instanceName` attribute contains the following: + The prefix `production` or `test` + An underscore (`_`) + Optional: One or more characters, followed by an underscore (`_`) + One or more digits + `resource.management.auto_upgrade == true`: Evaluates to `true` if the resource's `management.auto_upgrade` attribute is `true`.
         */
        condition?: string | null;
        /**
         * A description of the constraint. The maximum length is 2000 characters.
         */
        description?: string | null;
        /**
         * A display name for the constraint. The maximum length is 200 characters.
         */
        displayName?: string | null;
        /**
         * The types of operations that the constraint applies to.
         */
        methodTypes?: string[] | null;
        /**
         * Immutable. The name of the constraint, in the format `organizations/{organization_id\}/customConstraints/custom.{custom_constraint_id\}`. For example, `organizations/123456789012/customConstraints/custom.createOnlyE2TypeVms`. Must contain 1 to 62 characters, excluding the prefix `organizations/{organization_id\}/customConstraints/custom.`.
         */
        name?: string | null;
        /**
         * Immutable. The resource type that the constraint applies to, in the format `{canonical_service_name\}/{resource_type_name\}`. For example, `compute.googleapis.com/Instance`.
         */
        resourceTypes?: string[] | null;
        /**
         * Output only. The last time at which the constraint was updated or created.
         */
        updateTime?: string | null;
    }
    /**
     * A rule that defines the allowed and denied values for an organization policy constraint.
     */
    export interface Schema$GoogleCloudSecuritypostureV1PolicyRule {
        /**
         * Whether to allow any value for a list constraint. Valid only for list constraints.
         */
        allowAll?: boolean | null;
        /**
         * A condition that determines whether this rule is used to evaluate the policy. When set, the google.type.Expr.expression field must contain 1 to 10 subexpressions, joined by the `||` or `&&` operators. Each subexpression must use the `resource.matchTag()` or `resource.matchTagId()` Common Expression Language (CEL) function. The `resource.matchTag()` function takes the following arguments: * `key_name`: the namespaced name of the tag key, with the organization ID and a slash (`/`) as a prefix; for example, `123456789012/environment` * `value_name`: the short name of the tag value For example: `resource.matchTag('123456789012/environment, 'prod')` The `resource.matchTagId()` function takes the following arguments: * `key_id`: the permanent ID of the tag key; for example, `tagKeys/123456789012` * `value_id`: the permanent ID of the tag value; for example, `tagValues/567890123456` For example: `resource.matchTagId('tagKeys/123456789012', 'tagValues/567890123456')`
         */
        condition?: Schema$Expr;
        /**
         * Whether to deny all values for a list constraint. Valid only for list constraints.
         */
        denyAll?: boolean | null;
        /**
         * Whether to enforce the constraint. Valid only for boolean constraints.
         */
        enforce?: boolean | null;
        /**
         * Optional. Required for managed constraints if parameters are defined. Passes parameter values when policy enforcement is enabled. Ensure that parameter value types match those defined in the constraint definition. For example: { "allowedLocations" : ["us-east1", "us-west1"], "allowAll" : true \}
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. The resource types policies can support, only used for managed constraints. Method type is `GOVERN_TAGS`.
         */
        resourceTypes?: Schema$ResourceTypes;
        /**
         * The allowed and denied values for a list constraint. Valid only for list constraints.
         */
        values?: Schema$GoogleCloudSecuritypostureV1PolicyRuleStringValues;
    }
    /**
     * The allowed and denied values for a list constraint. For all constraints, these fields can contain literal values. Optionally, you can add the `is:` prefix to these values. If the value contains a colon (`:`), then the `is:` prefix is required. Some constraints allow you to specify a portion of the resource hierarchy, known as a [_hierarchy subtree_](https://cloud.google.com/resource-manager/help/organization-policy/hierarchy-subtree), that the constraint applies to. To specify a hierarchy subtree, use the `under:` prefix, followed by a value with one of these formats: - `projects/{project_id\}` (for example, `projects/tokyo-rain-123`) - `folders/{folder_id\}` (for example, `folders/1234567890123`) - `organizations/{organization_id\}` (for example, `organizations/123456789012`) A constraint's `supports_under` field indicates whether you can specify a hierarchy subtree. To learn which predefined constraints let you specify a hierarchy subtree, see the [constraints reference](https://cloud.google.com/resource-manager/help/organization-policy/constraints/reference).
     */
    export interface Schema$GoogleCloudSecuritypostureV1PolicyRuleStringValues {
        /**
         * The allowed values for the constraint.
         */
        allowedValues?: string[] | null;
        /**
         * The denied values for the constraint.
         */
        deniedValues?: string[] | null;
    }
    /**
     * Details of an infrastructure-as-code (IaC) configuration.
     */
    export interface Schema$IaC {
        /**
         * Optional. A Terraform plan file, formatted as a stringified JSON object. To learn how to generate a Terraform plan file in JSON format, see [JSON output format](https://developer.hashicorp.com/terraform/internals/json-format) in the Terraform documentation.
         */
        tfPlan?: string | null;
    }
    /**
     * Details of an infrastructure-as-code (IaC) validation report.
     */
    export interface Schema$IaCValidationReport {
        /**
         * Additional information about the report.
         */
        note?: string | null;
        /**
         * A list of every Violation found in the IaC configuration.
         */
        violations?: Schema$Violation[];
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
     * Response message for ListPostureDeployments.
     */
    export interface Schema$ListPostureDeploymentsResponse {
        /**
         * A pagination token. To retrieve the next page of results, call the method again with this token.
         */
        nextPageToken?: string | null;
        /**
         * The list of PostureDeployment resources.
         */
        postureDeployments?: Schema$PostureDeployment[];
        /**
         * Locations that were temporarily unavailable and could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for ListPostureRevisions.
     */
    export interface Schema$ListPostureRevisionsResponse {
        /**
         * A pagination token. To retrieve the next page of results, call the method again with this token.
         */
        nextPageToken?: string | null;
        /**
         * The list of revisions for the Posture.
         */
        revisions?: Schema$Posture[];
    }
    /**
     * Response message for ListPostures.
     */
    export interface Schema$ListPosturesResponse {
        /**
         * A pagination token. To retrieve the next page of results, call the method again with this token.
         */
        nextPageToken?: string | null;
        /**
         * The list of Posture resources.
         */
        postures?: Schema$Posture[];
        /**
         * Locations that were temporarily unavailable and could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for ListPostureTemplates.
     */
    export interface Schema$ListPostureTemplatesResponse {
        /**
         * A pagination token. To retrieve the next page of results, call the method again with this token.
         */
        nextPageToken?: string | null;
        /**
         * The list of PostureTemplate resources.
         */
        postureTemplates?: Schema$PostureTemplate[];
    }
    /**
     * Response message for ListReports.
     */
    export interface Schema$ListReportsResponse {
        /**
         * A pagination token. To retrieve the next page of results, call the method again with this token.
         */
        nextPageToken?: string | null;
        /**
         * The list of Report resources.
         */
        reports?: Schema$Report[];
        /**
         * Locations that were temporarily unavailable and could not be reached.
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
     * Metadata for an Operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. The API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. The time at which the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time at which the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. An error message. Returned when a PostureDeployment enters a failure state like UPDATE_FAILED.
         */
        errorMessage?: string | null;
        /**
         * Output only. Whether a request to cancel the operation has been received. For operations that have been cancelled successfully, the Operation.error field contains the error code CANCELLED.
         */
        requestedCancellation?: boolean | null;
        /**
         * Output only. The status of the operation, if any.
         */
        statusMessage?: string | null;
        /**
         * Output only. The server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Output only. The name of the action executed by the operation.
         */
        verb?: string | null;
    }
    /**
     * A predefined organization policy constraint.
     */
    export interface Schema$OrgPolicyConstraint {
        /**
         * Required. A unique identifier for the constraint.
         */
        cannedConstraintId?: string | null;
        /**
         * Required. The rules enforced by the constraint.
         */
        policyRules?: Schema$GoogleCloudSecuritypostureV1PolicyRule[];
    }
    /**
     * A custom organization policy constraint.
     */
    export interface Schema$OrgPolicyConstraintCustom {
        /**
         * Required. Metadata for the constraint.
         */
        customConstraint?: Schema$GoogleCloudSecuritypostureV1CustomConstraint;
        /**
         * Required. The rules enforced by the constraint.
         */
        policyRules?: Schema$GoogleCloudSecuritypostureV1PolicyRule[];
    }
    /**
     * The details of a policy, including the constraints that it includes.
     */
    export interface Schema$Policy {
        /**
         * Optional. The compliance standards that the policy helps enforce.
         */
        complianceStandards?: Schema$ComplianceStandard[];
        /**
         * Required. The constraints that the policy includes.
         */
        constraint?: Schema$Constraint;
        /**
         * Optional. A description of the policy.
         */
        description?: string | null;
        /**
         * Required. A user-specified identifier for the policy. In a PolicySet, each policy must have a unique identifier.
         */
        policyId?: string | null;
    }
    /**
     * Details of a policy that was violated.
     */
    export interface Schema$PolicyDetails {
        /**
         * The compliance standards that the policy maps to. For example, `CIS-2.0 1.15`.
         */
        complianceStandards?: string[] | null;
        /**
         * Information about the constraint that was violated. The format of this information can change at any time without prior notice. Your application must not depend on this information in any way.
         */
        constraint?: string | null;
        /**
         * The type of constraint that was violated.
         */
        constraintType?: string | null;
        /**
         * A description of the policy.
         */
        description?: string | null;
    }
    /**
     * A group of one or more Policy resources.
     */
    export interface Schema$PolicySet {
        /**
         * Optional. A description of the policy set.
         */
        description?: string | null;
        /**
         * Required. The Policy resources in the policy set. Each policy must have a policy_id that's unique within the policy set.
         */
        policies?: Schema$Policy[];
        /**
         * Required. An identifier for the policy set.
         */
        policySetId?: string | null;
    }
    /**
     * The details of a posture.
     */
    export interface Schema$Posture {
        /**
         * Optional. The user-specified annotations for the posture. For details about the values you can use in an annotation, see [AIP-148: Standard fields](https://google.aip.dev/148#annotations).
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The categories that the posture belongs to, as determined by the Security Posture API.
         */
        categories?: string[] | null;
        /**
         * Output only. The time at which the posture was created.
         */
        createTime?: string | null;
        /**
         * Optional. A description of the posture.
         */
        description?: string | null;
        /**
         * Optional. An opaque identifier for the current version of the posture at the specified `revision_id`. To prevent concurrent updates from overwriting each other, always provide the `etag` when you update a posture. You can also provide the `etag` when you delete a posture, to help ensure that you're deleting the intended version of the posture.
         */
        etag?: string | null;
        /**
         * Required. Identifier. The name of the posture, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        name?: string | null;
        /**
         * Required. The PolicySet resources that the posture includes.
         */
        policySets?: Schema$PolicySet[];
        /**
         * Output only. Whether the posture is in the process of being updated.
         */
        reconciling?: boolean | null;
        /**
         * Output only. Immutable. An opaque eight-character string that identifies the revision of the posture. A posture can have multiple revisions; when you deploy a posture, you deploy a specific revision of the posture.
         */
        revisionId?: string | null;
        /**
         * Required. The state of the posture at the specified `revision_id`.
         */
        state?: string | null;
        /**
         * Output only. The time at which the posture was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Details for a Posture deployment on an organization, folder, or project. You can deploy at most one posture to each organization, folder, or project. The parent resource for a posture deployment is always the organization, even if the deployment applies to a folder or project.
     */
    export interface Schema$PostureDeployment {
        /**
         * Optional. The user-specified annotations for the posture deployment. For details about the values you can use in an annotation, see [AIP-148: Standard fields](https://google.aip.dev/148#annotations).
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The categories that the posture deployment belongs to, as determined by the Security Posture API.
         */
        categories?: string[] | null;
        /**
         * Output only. The time at which the posture deployment was created.
         */
        createTime?: string | null;
        /**
         * Optional. A description of the posture deployment.
         */
        description?: string | null;
        /**
         * Output only. The posture ID that was specified for the deployment. Present only if the posture deployment is in a failed state.
         */
        desiredPostureId?: string | null;
        /**
         * Output only. The revision ID of the posture that was specified for the deployment. Present only if the deployment is in a failed state.
         */
        desiredPostureRevisionId?: string | null;
        /**
         * Optional. An opaque identifier for the current version of the posture deployment. To prevent concurrent updates from overwriting each other, always provide the `etag` when you update a posture deployment. You can also provide the `etag` when you delete a posture deployment, to help ensure that you're deleting the intended posture deployment.
         */
        etag?: string | null;
        /**
         * Output only. A description of why the posture deployment failed. Present only if the deployment is in a failed state.
         */
        failureMessage?: string | null;
        /**
         * Required. Identifier. The name of the posture deployment, in the format `organizations/{organization\}/locations/global/postureDeployments/{deployment_id\}`.
         */
        name?: string | null;
        /**
         * Required. The posture used in the deployment, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        postureId?: string | null;
        /**
         * Required. The revision ID of the posture used in the deployment.
         */
        postureRevisionId?: string | null;
        /**
         * Output only. Whether the posture deployment is in the process of being updated.
         */
        reconciling?: boolean | null;
        /**
         * Output only. The state of the posture deployment.
         */
        state?: string | null;
        /**
         * Required. The organization, folder, or project where the posture is deployed. Uses one of the following formats: * `organizations/{organization_number\}` * `folders/{folder_number\}` * `projects/{project_number\}`
         */
        targetResource?: string | null;
        /**
         * Output only. The time at which the posture deployment was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Details of a posture deployment.
     */
    export interface Schema$PostureDetails {
        /**
         * The identifier for the PolicySet that the relevant policy belongs to.
         */
        policySet?: string | null;
        /**
         * The posture used in the deployment, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        posture?: string | null;
        /**
         * The name of the posture deployment, in the format `organizations/{organization\}/locations/global/postureDeployments/{deployment_id\}`.
         */
        postureDeployment?: string | null;
        /**
         * The organization, folder, or project where the posture is deployed. Uses one of the following formats: * `organizations/{organization_number\}` * `folders/{folder_number\}` * `projects/{project_number\}`
         */
        postureDeploymentTargetResource?: string | null;
        /**
         * The revision ID of the posture used in the deployment.
         */
        postureRevisionId?: string | null;
    }
    /**
     * The details of a posture template.
     */
    export interface Schema$PostureTemplate {
        /**
         * Output only. The categories that the posture template belongs to, as determined by the Security Posture API.
         */
        categories?: string[] | null;
        /**
         * Output only. A description of the posture template.
         */
        description?: string | null;
        /**
         * Output only. Identifier. The name of the posture template, in the format `organizations/{organization\}/locations/global/postureTemplates/{posture_template\}`.
         */
        name?: string | null;
        /**
         * Output only. The PolicySet resources that the posture template includes.
         */
        policySets?: Schema$PolicySet[];
        /**
         * Output only. A string that identifies the revision of the posture template.
         */
        revisionId?: string | null;
        /**
         * Output only. The state of the posture template at the specified `revision_id`.
         */
        state?: string | null;
    }
    /**
     * A name-value pair used as a custom source property.
     */
    export interface Schema$Property {
        /**
         * Required. The name of the custom source property.
         */
        name?: string | null;
        /**
         * Optional. The CEL expression for the value of the custom source property. For resource properties, you can return the value of the property or a string enclosed in quotation marks.
         */
        valueExpression?: Schema$Expr;
    }
    /**
     * Details of a report.
     */
    export interface Schema$Report {
        /**
         * Output only. The time at which the report was created.
         */
        createTime?: string | null;
        /**
         * Output only. An infrastructure-as-code (IaC) validation report.
         */
        iacValidationReport?: Schema$IaCValidationReport;
        /**
         * Required. The name of the report, in the format `organizations/{organization\}/locations/global/reports/{report_id\}`.
         */
        name?: string | null;
        /**
         * Output only. The time at which the report was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A selector for the resource types to run the detector on.
     */
    export interface Schema$ResourceSelector {
        /**
         * Required. The resource types to run the detector on. Each custom module can specify up to 5 resource types.
         */
        resourceTypes?: string[] | null;
    }
    /**
     * Set multiple resource types for one policy, for example: resourceTypes: included: - compute.googleapis.com/Instance - compute.googleapis.com/Disk Constraint definition contains an empty resource type in order to support multiple resource types in the policy. Only supports managed constraints. Method type is `GOVERN_TAGS`. Refer go/multi-resource-support-force-tags-gmc to get more details.
     */
    export interface Schema$ResourceTypes {
        /**
         * Optional. The resource types we currently support. cloud/orgpolicy/customconstraintconfig/prod/resource_types.prototext
         */
        included?: string[] | null;
    }
    /**
     * A custom module for Security Health Analytics.
     */
    export interface Schema$SecurityHealthAnalyticsCustomModule {
        /**
         * Required. Configuration settings for the custom module.
         */
        config?: Schema$CustomConfig;
        /**
         * Optional. The display name of the custom module. This value is used as the finding category for all the asset violation findings that the custom module returns. The display name must contain between 1 and 128 alphanumeric characters or underscores, and it must start with a lowercase letter.
         */
        displayName?: string | null;
        /**
         * Output only. Immutable. The unique identifier for the custom module. Contains 1 to 20 digits.
         */
        id?: string | null;
        /**
         * Whether the custom module is enabled at a specified level of the resource hierarchy.
         */
        moduleEnablementState?: string | null;
    }
    /**
     * A built-in detector for Security Health Analytics.
     */
    export interface Schema$SecurityHealthAnalyticsModule {
        /**
         * Whether the detector is enabled at a specified level of the resource hierarchy.
         */
        moduleEnablementState?: string | null;
        /**
         * Required. The name of the detector. For example, `BIGQUERY_TABLE_CMEK_DISABLED`. This field is also used as the finding category for all the asset violation findings that the detector returns.
         */
        moduleName?: string | null;
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
     * Details of a violation.
     */
    export interface Schema$Violation {
        /**
         * The full resource name of the asset that caused the violation. For details about the format of the full resource name for each asset type, see [Resource name format](https://cloud.google.com/asset-inventory/docs/resource-name-format).
         */
        assetId?: string | null;
        /**
         * A description of the steps that you can take to fix the violation.
         */
        nextSteps?: string | null;
        /**
         * The policy that was violated.
         */
        policyId?: string | null;
        /**
         * The severity of the violation.
         */
        severity?: string | null;
        /**
         * Details of the Cloud Asset Inventory asset that caused the violation.
         */
        violatedAsset?: Schema$AssetDetails;
        /**
         * Details of the policy that was violated.
         */
        violatedPolicy?: Schema$PolicyDetails;
        /**
         * Details for the posture that was violated. This field is present only if the violated policy belongs to a deployed posture.
         */
        violatedPosture?: Schema$PostureDetails;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        locations: Resource$Organizations$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations {
        context: APIRequestContext;
        operations: Resource$Organizations$Locations$Operations;
        postureDeployments: Resource$Organizations$Locations$Posturedeployments;
        postures: Resource$Organizations$Locations$Postures;
        postureTemplates: Resource$Organizations$Locations$Posturetemplates;
        reports: Resource$Organizations$Locations$Reports;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations$Operations {
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
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Organizations$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Locations$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Locations$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Organizations$Locations$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Operations$List extends StandardParameters {
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
    export class Resource$Organizations$Locations$Posturedeployments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new PostureDeployment in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Posturedeployments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Posturedeployments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Organizations$Locations$Posturedeployments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Posturedeployments$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Organizations$Locations$Posturedeployments$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a PostureDeployment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Posturedeployments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Posturedeployments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Organizations$Locations$Posturedeployments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Posturedeployments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Organizations$Locations$Posturedeployments$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details for a PostureDeployment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Posturedeployments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Posturedeployments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PostureDeployment>>;
        get(params: Params$Resource$Organizations$Locations$Posturedeployments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Posturedeployments$Get, options: MethodOptions | BodyResponseCallback<Schema$PostureDeployment>, callback: BodyResponseCallback<Schema$PostureDeployment>): void;
        get(params: Params$Resource$Organizations$Locations$Posturedeployments$Get, callback: BodyResponseCallback<Schema$PostureDeployment>): void;
        get(callback: BodyResponseCallback<Schema$PostureDeployment>): void;
        /**
         * Lists every PostureDeployment in a project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Posturedeployments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Posturedeployments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPostureDeploymentsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Posturedeployments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Posturedeployments$List, options: MethodOptions | BodyResponseCallback<Schema$ListPostureDeploymentsResponse>, callback: BodyResponseCallback<Schema$ListPostureDeploymentsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Posturedeployments$List, callback: BodyResponseCallback<Schema$ListPostureDeploymentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPostureDeploymentsResponse>): void;
        /**
         * Updates an existing PostureDeployment. To prevent concurrent updates from overwriting each other, always follow the read-modify-write pattern when you update a posture deployment: 1. Call GetPostureDeployment to get the current version of the deployment. 2. Update the fields in the deployment as needed. 3. Call UpdatePostureDeployment to update the deployment. Ensure that your request includes the `etag` value from the GetPostureDeployment response. **Important:** If you omit the `etag` when you call UpdatePostureDeployment, then the updated deployment unconditionally overwrites the existing deployment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Posturedeployments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Posturedeployments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Organizations$Locations$Posturedeployments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Posturedeployments$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Organizations$Locations$Posturedeployments$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Organizations$Locations$Posturedeployments$Create extends StandardParameters {
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
        /**
         * Required. An identifier for the posture deployment.
         */
        postureDeploymentId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PostureDeployment;
    }
    export interface Params$Resource$Organizations$Locations$Posturedeployments$Delete extends StandardParameters {
        /**
         * Optional. An opaque identifier for the current version of the posture deployment. If you provide this value, then it must match the existing value. If the values don't match, then the request fails with an ABORTED error. If you omit this value, then the posture deployment is deleted regardless of its current `etag` value.
         */
        etag?: string;
        /**
         * Required. The name of the posture deployment, in the format `organizations/{organization\}/locations/global/postureDeployments/{posture_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Posturedeployments$Get extends StandardParameters {
        /**
         * Required. The name of the PostureDeployment, in the format `organizations/{organization\}/locations/global/postureDeployments/{posture_deployment_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Posturedeployments$List extends StandardParameters {
        /**
         * Optional. A filter to apply to the list of postures, in the format defined in [AIP-160: Filtering](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * Optional. The maximum number of posture deployments to return. The default value is `500`. If you exceed the maximum value of `1000`, then the service uses the maximum value.
         */
        pageSize?: number;
        /**
         * Optional. A pagination token returned from a previous request to list posture deployments. Provide this token to retrieve the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Posturedeployments$Patch extends StandardParameters {
        /**
         * Required. Identifier. The name of the posture deployment, in the format `organizations/{organization\}/locations/global/postureDeployments/{deployment_id\}`.
         */
        name?: string;
        /**
         * Required. The fields in the PostureDeployment to update. You can update only the following fields: * PostureDeployment.posture_id * PostureDeployment.posture_revision_id
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PostureDeployment;
    }
    export class Resource$Organizations$Locations$Postures {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Posture.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Postures$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Postures$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Organizations$Locations$Postures$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Postures$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Organizations$Locations$Postures$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes all revisions of a Posture. You can only delete a posture if none of its revisions are deployed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Postures$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Postures$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Organizations$Locations$Postures$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Postures$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Organizations$Locations$Postures$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Extracts existing policies from an organization, folder, or project, and applies them to another organization, folder, or project as a Posture. If the other organization, folder, or project already has a posture, then the result of the long-running operation is an ALREADY_EXISTS error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        extract(params: Params$Resource$Organizations$Locations$Postures$Extract, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        extract(params?: Params$Resource$Organizations$Locations$Postures$Extract, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        extract(params: Params$Resource$Organizations$Locations$Postures$Extract, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        extract(params: Params$Resource$Organizations$Locations$Postures$Extract, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        extract(params: Params$Resource$Organizations$Locations$Postures$Extract, callback: BodyResponseCallback<Schema$Operation>): void;
        extract(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a single revision of a Posture.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Postures$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Postures$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Posture>>;
        get(params: Params$Resource$Organizations$Locations$Postures$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Postures$Get, options: MethodOptions | BodyResponseCallback<Schema$Posture>, callback: BodyResponseCallback<Schema$Posture>): void;
        get(params: Params$Resource$Organizations$Locations$Postures$Get, callback: BodyResponseCallback<Schema$Posture>): void;
        get(callback: BodyResponseCallback<Schema$Posture>): void;
        /**
         * Lists the most recent revisions of all Posture resources in a specified organization and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Postures$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Postures$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPosturesResponse>>;
        list(params: Params$Resource$Organizations$Locations$Postures$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Postures$List, options: MethodOptions | BodyResponseCallback<Schema$ListPosturesResponse>, callback: BodyResponseCallback<Schema$ListPosturesResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Postures$List, callback: BodyResponseCallback<Schema$ListPosturesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPosturesResponse>): void;
        /**
         * Lists all revisions of a single Posture.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listRevisions(params: Params$Resource$Organizations$Locations$Postures$Listrevisions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listRevisions(params?: Params$Resource$Organizations$Locations$Postures$Listrevisions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPostureRevisionsResponse>>;
        listRevisions(params: Params$Resource$Organizations$Locations$Postures$Listrevisions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listRevisions(params: Params$Resource$Organizations$Locations$Postures$Listrevisions, options: MethodOptions | BodyResponseCallback<Schema$ListPostureRevisionsResponse>, callback: BodyResponseCallback<Schema$ListPostureRevisionsResponse>): void;
        listRevisions(params: Params$Resource$Organizations$Locations$Postures$Listrevisions, callback: BodyResponseCallback<Schema$ListPostureRevisionsResponse>): void;
        listRevisions(callback: BodyResponseCallback<Schema$ListPostureRevisionsResponse>): void;
        /**
         * Updates a revision of an existing Posture. If the posture revision that you update is currently deployed, then a new revision of the posture is created. To prevent concurrent updates from overwriting each other, always follow the read-modify-write pattern when you update a posture: 1. Call GetPosture to get the current version of the posture. 2. Update the fields in the posture as needed. 3. Call UpdatePosture to update the posture. Ensure that your request includes the `etag` value from the GetPosture response. **Important:** If you omit the `etag` when you call UpdatePosture, then the updated posture unconditionally overwrites the existing posture.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Postures$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Postures$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Organizations$Locations$Postures$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Postures$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Organizations$Locations$Postures$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Create extends StandardParameters {
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
        /**
         * Required. An identifier for the posture.
         */
        postureId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Posture;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Delete extends StandardParameters {
        /**
         * Optional. An opaque identifier for the current version of the posture. If you provide this value, then it must match the existing value. If the values don't match, then the request fails with an ABORTED error. If you omit this value, then the posture is deleted regardless of its current `etag` value.
         */
        etag?: string;
        /**
         * Required. The name of the Posture, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Extract extends StandardParameters {
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExtractPostureRequest;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Get extends StandardParameters {
        /**
         * Required. The name of the Posture, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        name?: string;
        /**
         * Optional. The posture revision to retrieve. If not specified, the most recently updated revision is retrieved.
         */
        revisionId?: string;
    }
    export interface Params$Resource$Organizations$Locations$Postures$List extends StandardParameters {
        /**
         * Optional. A filter to apply to the list of postures, in the format defined in [AIP-160: Filtering](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * The maximum number of postures to return. The default value is `500`. If you exceed the maximum value of `1000`, then the service uses the maximum value.
         */
        pageSize?: number;
        /**
         * A pagination token returned from a previous request to list postures. Provide this token to retrieve the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Listrevisions extends StandardParameters {
        /**
         * Required. The name of the Posture, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        name?: string;
        /**
         * Optional. The maximum number of posture revisions to return. The default value is `500`. If you exceed the maximum value of `1000`, then the service uses the maximum value.
         */
        pageSize?: number;
        /**
         * Optional. A pagination token from a previous request to list posture revisions. Provide this token to retrieve the next page of results.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Organizations$Locations$Postures$Patch extends StandardParameters {
        /**
         * Required. Identifier. The name of the posture, in the format `organizations/{organization\}/locations/global/postures/{posture_id\}`.
         */
        name?: string;
        /**
         * Required. The revision ID of the posture to update. If the posture revision that you update is currently deployed, then a new revision of the posture is created.
         */
        revisionId?: string;
        /**
         * Required. The fields in the Posture to update. You can update only the following fields: * Posture.description * Posture.policy_sets * Posture.state
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Posture;
    }
    export class Resource$Organizations$Locations$Posturetemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a single revision of a PostureTemplate.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Posturetemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Posturetemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PostureTemplate>>;
        get(params: Params$Resource$Organizations$Locations$Posturetemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Posturetemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$PostureTemplate>, callback: BodyResponseCallback<Schema$PostureTemplate>): void;
        get(params: Params$Resource$Organizations$Locations$Posturetemplates$Get, callback: BodyResponseCallback<Schema$PostureTemplate>): void;
        get(callback: BodyResponseCallback<Schema$PostureTemplate>): void;
        /**
         * Lists every PostureTemplate in a given organization and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Posturetemplates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Posturetemplates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPostureTemplatesResponse>>;
        list(params: Params$Resource$Organizations$Locations$Posturetemplates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Posturetemplates$List, options: MethodOptions | BodyResponseCallback<Schema$ListPostureTemplatesResponse>, callback: BodyResponseCallback<Schema$ListPostureTemplatesResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Posturetemplates$List, callback: BodyResponseCallback<Schema$ListPostureTemplatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPostureTemplatesResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Posturetemplates$Get extends StandardParameters {
        /**
         * Required. The name of the PostureTemplate, in the format `organizations/{organization\}/locations/global/postureTemplates/{posture_template\}`.
         */
        name?: string;
        /**
         * Optional. The posture template revision to retrieve. If not specified, the most recently updated revision is retrieved.
         */
        revisionId?: string;
    }
    export interface Params$Resource$Organizations$Locations$Posturetemplates$List extends StandardParameters {
        /**
         * Optional. A filter to apply to the list of postures, in the format defined in [AIP-160: Filtering](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * Optional. The maximum number of posture templates to return. The default value is `500`. If you exceed the maximum value of `1000`, then the service uses the maximum value.
         */
        pageSize?: number;
        /**
         * Optional. A pagination token returned from a previous request to list posture templates. Provide this token to retrieve the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
    }
    export class Resource$Organizations$Locations$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Validates a specified infrastructure-as-code (IaC) configuration, and creates a Report with the validation results. Only Terraform configurations are supported. Only modified assets are validated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createIaCValidationReport(params: Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createIaCValidationReport(params?: Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createIaCValidationReport(params: Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createIaCValidationReport(params: Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createIaCValidationReport(params: Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport, callback: BodyResponseCallback<Schema$Operation>): void;
        createIaCValidationReport(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details for a Report.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Reports$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Reports$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Report>>;
        get(params: Params$Resource$Organizations$Locations$Reports$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Reports$Get, options: MethodOptions | BodyResponseCallback<Schema$Report>, callback: BodyResponseCallback<Schema$Report>): void;
        get(params: Params$Resource$Organizations$Locations$Reports$Get, callback: BodyResponseCallback<Schema$Report>): void;
        get(callback: BodyResponseCallback<Schema$Report>): void;
        /**
         * Lists every Report in a given organization and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Reports$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Reports$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListReportsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Reports$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Reports$List, options: MethodOptions | BodyResponseCallback<Schema$ListReportsResponse>, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Reports$List, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Reports$Createiacvalidationreport extends StandardParameters {
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateIaCValidationReportRequest;
    }
    export interface Params$Resource$Organizations$Locations$Reports$Get extends StandardParameters {
        /**
         * Required. The name of the report, in the format `organizations/{organization\}/locations/global/reports/{report_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Reports$List extends StandardParameters {
        /**
         * Optional. A filter to apply to the list of reports, in the format defined in [AIP-160: Filtering](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * Optional. The maximum number of reports to return. The default value is `500`. If you exceed the maximum value of `1000`, then the service uses the maximum value.
         */
        pageSize?: number;
        /**
         * Optional. A pagination token returned from a previous request to list reports. Provide this token to retrieve the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name, in the format `organizations/{organization\}/locations/global`.
         */
        parent?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
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
    export {};
}
