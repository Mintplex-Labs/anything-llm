import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace orgpolicy_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
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
     * Organization Policy API
     *
     * The Organization Policy API allows users to configure governance rules on their Google Cloud resources across the resource hierarchy.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const orgpolicy = google.orgpolicy('v2');
     * ```
     */
    export class Orgpolicy {
        context: APIRequestContext;
        folders: Resource$Folders;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Similar to PolicySpec but with an extra 'launch' field for launch reference. The PolicySpec here is specific for dry-run.
     */
    export interface Schema$GoogleCloudOrgpolicyV2AlternatePolicySpec {
        /**
         * Reference to the launch that will be used while audit logging and to control the launch. Should be set only in the alternate policy.
         */
        launch?: string | null;
        /**
         * Specify constraint for configurations of Google Cloud resources.
         */
        spec?: Schema$GoogleCloudOrgpolicyV2PolicySpec;
    }
    /**
     * A constraint describes a way to restrict resource's configuration. For example, you could enforce a constraint that controls which Google Cloud services can be activated across an organization, or whether a Compute Engine instance can have serial port connections established. Constraints can be configured by the organization policy administrator to fit the needs of the organization by setting a policy that includes constraints at different locations in the organization's resource hierarchy. Policies are inherited down the resource hierarchy from higher levels, but can also be overridden. For details about the inheritance rules, see `Policy`. Constraints have a default behavior determined by the `constraint_default` field, which is the enforcement behavior that is used in the absence of a policy being defined or inherited for the resource in question.
     */
    export interface Schema$GoogleCloudOrgpolicyV2Constraint {
        /**
         * Defines this constraint as being a boolean constraint.
         */
        booleanConstraint?: Schema$GoogleCloudOrgpolicyV2ConstraintBooleanConstraint;
        /**
         * The evaluation behavior of this constraint in the absence of a policy.
         */
        constraintDefault?: string | null;
        /**
         * Detailed description of what this constraint controls as well as how and where it is enforced. Mutable.
         */
        description?: string | null;
        /**
         * The human readable name. Mutable.
         */
        displayName?: string | null;
        /**
         * Managed constraint and canned constraint sometimes can have equivalents. This field is used to store the equivalent constraint name.
         */
        equivalentConstraint?: string | null;
        /**
         * Defines this constraint as being a list constraint.
         */
        listConstraint?: Schema$GoogleCloudOrgpolicyV2ConstraintListConstraint;
        /**
         * Immutable. The resource name of the constraint. Must be in one of the following forms: * `projects/{project_number\}/constraints/{constraint_name\}` * `folders/{folder_id\}/constraints/{constraint_name\}` * `organizations/{organization_id\}/constraints/{constraint_name\}` For example, "/projects/123/constraints/compute.disableSerialPortAccess".
         */
        name?: string | null;
        /**
         * Shows if dry run is supported for this constraint or not.
         */
        supportsDryRun?: boolean | null;
        /**
         * Shows if simulation is supported for this constraint or not.
         */
        supportsSimulation?: boolean | null;
    }
    /**
     * A constraint type is enforced or not enforced, which is configured in the `PolicyRule`. If `customConstraintDefinition` is defined, this constraint is a managed constraint.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ConstraintBooleanConstraint {
        /**
         * Custom constraint definition. Defines this as a managed constraint.
         */
        customConstraintDefinition?: Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinition;
    }
    /**
     * Custom constraint definition. Defines this as a managed constraint.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinition {
        /**
         * Allow or deny type.
         */
        actionType?: string | null;
        /**
         * Org policy condition/expression. For example: `resource.instanceName.matches("[production|test]_.*_(\d)+")` or, `resource.management.auto_upgrade == true` The max length of the condition is 1000 characters.
         */
        condition?: string | null;
        /**
         * All the operations being applied for this constraint.
         */
        methodTypes?: string[] | null;
        /**
         * Stores the structure of `Parameters` used by the constraint condition. The key of `map` represents the name of the parameter.
         */
        parameters?: {
            [key: string]: Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinitionParameter;
        } | null;
        /**
         * The resource instance type on which this policy applies. Format will be of the form : `/` Example: * `compute.googleapis.com/Instance`.
         */
        resourceTypes?: string[] | null;
    }
    /**
     * Defines a parameter structure.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinitionParameter {
        /**
         * Sets the value of the parameter in an assignment if no value is given.
         */
        defaultValue?: any | null;
        /**
         * Determines the parameter's value structure. For example, `LIST` can be specified by defining `type: LIST`, and `item: STRING`.
         */
        item?: string | null;
        /**
         * Defines subproperties primarily used by the UI to display user-friendly information.
         */
        metadata?: Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinitionParameterMetadata;
        /**
         * Type of the parameter.
         */
        type?: string | null;
        /**
         * Provides a CEL expression to specify the acceptable parameter values during assignment. For example, parameterName in ("parameterValue1", "parameterValue2")
         */
        validValuesExpr?: string | null;
    }
    /**
     * Defines Metadata structure.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ConstraintCustomConstraintDefinitionParameterMetadata {
        /**
         * Detailed description of what this `parameter` is and use of it. Mutable.
         */
        description?: string | null;
    }
    /**
     * A constraint type that allows or disallows a list of string values, which are configured in the `PolicyRule`.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ConstraintListConstraint {
        /**
         * Indicates whether values grouped into categories can be used in `Policy.allowed_values` and `Policy.denied_values`. For example, `"in:Python"` would match any value in the 'Python' group.
         */
        supportsIn?: boolean | null;
        /**
         * Indicates whether subtrees of the Resource Manager resource hierarchy can be used in `Policy.allowed_values` and `Policy.denied_values`. For example, `"under:folders/123"` would match any resource under the 'folders/123' folder.
         */
        supportsUnder?: boolean | null;
    }
    /**
     * A custom constraint defined by customers which can *only* be applied to the given resource types and organization. By creating a custom constraint, customers can apply policies of this custom constraint. *Creating a custom constraint itself does NOT apply any policy enforcement*.
     */
    export interface Schema$GoogleCloudOrgpolicyV2CustomConstraint {
        /**
         * Allow or deny type.
         */
        actionType?: string | null;
        /**
         * A Common Expression Language (CEL) condition which is used in the evaluation of the constraint. For example: `resource.instanceName.matches("[production|test]_.*_(\d)+")` or, `resource.management.auto_upgrade == true` The max length of the condition is 1000 characters.
         */
        condition?: string | null;
        /**
         * Detailed information about this custom policy constraint. The max length of the description is 2000 characters.
         */
        description?: string | null;
        /**
         * One line display name for the UI. The max length of the display_name is 200 characters.
         */
        displayName?: string | null;
        /**
         * All the operations being applied for this constraint.
         */
        methodTypes?: string[] | null;
        /**
         * Immutable. Name of the constraint. This is unique within the organization. Format of the name should be * `organizations/{organization_id\}/customConstraints/{custom_constraint_id\}` Example: `organizations/123/customConstraints/custom.createOnlyE2TypeVms` The max length is 70 characters and the minimum length is 1. Note that the prefix `organizations/{organization_id\}/customConstraints/` is not counted.
         */
        name?: string | null;
        /**
         * Immutable. The resource instance type on which this policy applies. Format will be of the form : `/` Example: * `compute.googleapis.com/Instance`.
         */
        resourceTypes?: string[] | null;
        /**
         * Output only. The last time this custom constraint was updated. This represents the last time that the `CreateCustomConstraint` or `UpdateCustomConstraint` methods were called.
         */
        updateTime?: string | null;
    }
    /**
     * The response returned from the ListConstraints method.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse {
        /**
         * The collection of constraints that are available on the targeted resource.
         */
        constraints?: Schema$GoogleCloudOrgpolicyV2Constraint[];
        /**
         * Page token used to retrieve the next page. This is currently not used.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response returned from the ListCustomConstraints method. It will be empty if no custom or managed constraints are set on the organization resource.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse {
        /**
         * All custom and managed constraints that exist on the organization resource. It will be empty if no custom constraints are set.
         */
        customConstraints?: Schema$GoogleCloudOrgpolicyV2CustomConstraint[];
        /**
         * Page token used to retrieve the next page. This is currently not used, but the server may at any point start supplying a valid token.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response returned from the ListPolicies method. It will be empty if no policies are set on the resource.
     */
    export interface Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse {
        /**
         * Page token used to retrieve the next page. This is currently not used, but the server may at any point start supplying a valid token.
         */
        nextPageToken?: string | null;
        /**
         * All policies that exist on the resource. It will be empty if no policies are set.
         */
        policies?: Schema$GoogleCloudOrgpolicyV2Policy[];
    }
    /**
     * Defines an organization policy which is used to specify constraints for configurations of Google Cloud resources.
     */
    export interface Schema$GoogleCloudOrgpolicyV2Policy {
        /**
         * Deprecated.
         */
        alternate?: Schema$GoogleCloudOrgpolicyV2AlternatePolicySpec;
        /**
         * Dry-run policy. Audit-only policy, can be used to monitor how the policy would have impacted the existing and future resources if it's enforced.
         */
        dryRunSpec?: Schema$GoogleCloudOrgpolicyV2PolicySpec;
        /**
         * Optional. An opaque tag indicating the current state of the policy, used for concurrency control. This 'etag' is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Immutable. The resource name of the policy. Must be one of the following forms, where `constraint_name` is the name of the constraint which this policy configures: * `projects/{project_number\}/policies/{constraint_name\}` * `folders/{folder_id\}/policies/{constraint_name\}` * `organizations/{organization_id\}/policies/{constraint_name\}` For example, `projects/123/policies/compute.disableSerialPortAccess`. Note: `projects/{project_id\}/policies/{constraint_name\}` is also an acceptable name for API requests, but responses will return the name using the equivalent project number.
         */
        name?: string | null;
        /**
         * Basic information about the organization policy.
         */
        spec?: Schema$GoogleCloudOrgpolicyV2PolicySpec;
    }
    /**
     * Defines a Google Cloud policy specification which is used to specify constraints for configurations of Google Cloud resources.
     */
    export interface Schema$GoogleCloudOrgpolicyV2PolicySpec {
        /**
         * An opaque tag indicating the current version of the policySpec, used for concurrency control. This field is ignored if used in a `CreatePolicy` request. When the policy is returned from either a `GetPolicy` or a `ListPolicies` request, this `etag` indicates the version of the current policySpec to use when executing a read-modify-write loop. When the policy is returned from a `GetEffectivePolicy` request, the `etag` will be unset.
         */
        etag?: string | null;
        /**
         * Determines the inheritance behavior for this policy. If `inherit_from_parent` is true, policy rules set higher up in the hierarchy (up to the closest root) are inherited and present in the effective policy. If it is false, then no rules are inherited, and this policy becomes the new root for evaluation. This field can be set only for policies which configure list constraints.
         */
        inheritFromParent?: boolean | null;
        /**
         * Ignores policies set above this resource and restores the `constraint_default` enforcement behavior of the specific constraint at this resource. This field can be set in policies for either list or boolean constraints. If set, `rules` must be empty and `inherit_from_parent` must be set to false.
         */
        reset?: boolean | null;
        /**
         * In policies for boolean constraints, the following requirements apply: - There must be one and only one policy rule where condition is unset. - Boolean policy rules with conditions must set `enforced` to the opposite of the policy rule without a condition. - During policy evaluation, policy rules with conditions that are true for a target resource take precedence.
         */
        rules?: Schema$GoogleCloudOrgpolicyV2PolicySpecPolicyRule[];
        /**
         * Output only. The time stamp this was previously updated. This represents the last time a call to `CreatePolicy` or `UpdatePolicy` was made for that policy.
         */
        updateTime?: string | null;
    }
    /**
     * A rule used to express this policy.
     */
    export interface Schema$GoogleCloudOrgpolicyV2PolicySpecPolicyRule {
        /**
         * Setting this to true means that all values are allowed. This field can be set only in policies for list constraints.
         */
        allowAll?: boolean | null;
        /**
         * A condition which determines whether this rule is used in the evaluation of the policy. When set, the `expression` field in the `Expr' must include from 1 to 10 subexpressions, joined by the "||" or "&&" operators. Each subexpression must be of the form "resource.matchTag('/tag_key_short_name, 'tag_value_short_name')". or "resource.matchTagId('tagKeys/key_id', 'tagValues/value_id')". where key_name and value_name are the resource names for Label Keys and Values. These names are available from the Tag Manager Service. An example expression is: "resource.matchTag('123456789/environment, 'prod')". or "resource.matchTagId('tagKeys/123', 'tagValues/456')".
         */
        condition?: Schema$GoogleTypeExpr;
        /**
         * Setting this to true means that all values are denied. This field can be set only in policies for list constraints.
         */
        denyAll?: boolean | null;
        /**
         * If `true`, then the policy is enforced. If `false`, then any configuration is acceptable. This field can be set only in policies for boolean constraints.
         */
        enforce?: boolean | null;
        /**
         * Optional. Required for managed constraints if parameters are defined. Passes parameter values when policy enforcement is enabled. Ensure that parameter value types match those defined in the constraint definition. For example: { "allowedLocations" : ["us-east1", "us-west1"], "allowAll" : true \}
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * List of values to be used for this policy rule. This field can be set only in policies for list constraints.
         */
        values?: Schema$GoogleCloudOrgpolicyV2PolicySpecPolicyRuleStringValues;
    }
    /**
     * A message that holds specific allowed and denied values. This message can define specific values and subtrees of the Resource Manager resource hierarchy (`Organizations`, `Folders`, `Projects`) that are allowed or denied. This is achieved by using the `under:` and optional `is:` prefixes. The `under:` prefix is used to denote resource subtree values. The `is:` prefix is used to denote specific values, and is required only if the value contains a ":". Values prefixed with "is:" are treated the same as values with no prefix. Ancestry subtrees must be in one of the following formats: - `projects/` (for example, `projects/tokyo-rain-123`) - `folders/` (for example, `folders/1234`) - `organizations/` (for example, `organizations/1234`) The `supports_under` field of the associated `Constraint` defines whether ancestry prefixes can be used.
     */
    export interface Schema$GoogleCloudOrgpolicyV2PolicySpecPolicyRuleStringValues {
        /**
         * List of values allowed at this resource.
         */
        allowedValues?: string[] | null;
        /**
         * List of values denied at this resource.
         */
        deniedValues?: string[] | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
     */
    export interface Schema$GoogleTypeExpr {
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
    export class Resource$Folders {
        context: APIRequestContext;
        constraints: Resource$Folders$Constraints;
        policies: Resource$Folders$Policies;
        constructor(context: APIRequestContext);
    }
    export class Resource$Folders$Constraints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists constraints that could be applied on the specified resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Constraints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Constraints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>>;
        list(params: Params$Resource$Folders$Constraints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Constraints$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(params: Params$Resource$Folders$Constraints$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
    }
    export interface Params$Resource$Folders$Constraints$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The Google Cloud resource that parents the constraint. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export class Resource$Folders$Policies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ALREADY_EXISTS` if the policy already exists on the given Google Cloud resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Policies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Policies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        create(params: Params$Resource$Folders$Policies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Policies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(params: Params$Resource$Folders$Policies$Create, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Deletes a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or organization policy does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Policies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Policies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Folders$Policies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Policies$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Folders$Policies$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a policy on a resource. If no policy is set on the resource, `NOT_FOUND` is returned. The `etag` value can be used with `UpdatePolicy()` to update a policy during read-modify-write.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Policies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Policies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        get(params: Params$Resource$Folders$Policies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Policies$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(params: Params$Resource$Folders$Policies$Get, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Gets the effective policy on a resource. This is the result of merging policies in the resource hierarchy and evaluating conditions. The returned policy will not have an `etag` or `condition` set because it is an evaluated policy across multiple resources. Subtrees of Resource Manager resource hierarchy with 'under:' prefix will not be expanded.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEffectivePolicy(params: Params$Resource$Folders$Policies$Geteffectivepolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEffectivePolicy(params?: Params$Resource$Folders$Policies$Geteffectivepolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        getEffectivePolicy(params: Params$Resource$Folders$Policies$Geteffectivepolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEffectivePolicy(params: Params$Resource$Folders$Policies$Geteffectivepolicy, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(params: Params$Resource$Folders$Policies$Geteffectivepolicy, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Retrieves all of the policies that exist on a particular resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>>;
        list(params: Params$Resource$Folders$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(params: Params$Resource$Folders$Policies$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        /**
         * Updates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or the policy do not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the policy Note: the supplied policy will perform a full overwrite of all fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Policies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Policies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        patch(params: Params$Resource$Folders$Policies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Policies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(params: Params$Resource$Folders$Policies$Patch, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
    }
    export interface Params$Resource$Folders$Policies$Create extends StandardParameters {
        /**
         * Required. The Google Cloud resource that will parent the new policy. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export interface Params$Resource$Folders$Policies$Delete extends StandardParameters {
        /**
         * Optional. The current etag of policy. If an etag is provided and does not match the current etag of the policy, deletion will be blocked and an ABORTED error will be returned.
         */
        etag?: string;
        /**
         * Required. Name of the policy to delete. See the policy entry for naming rules.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Policies$Get extends StandardParameters {
        /**
         * Required. Resource name of the policy. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Policies$Geteffectivepolicy extends StandardParameters {
        /**
         * Required. The effective policy to compute. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Policies$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The target Google Cloud resource that parents the set of constraints and policies that will be returned from this call. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Policies$Patch extends StandardParameters {
        /**
         * Immutable. The resource name of the policy. Must be one of the following forms, where `constraint_name` is the name of the constraint which this policy configures: * `projects/{project_number\}/policies/{constraint_name\}` * `folders/{folder_id\}/policies/{constraint_name\}` * `organizations/{organization_id\}/policies/{constraint_name\}` For example, `projects/123/policies/compute.disableSerialPortAccess`. Note: `projects/{project_id\}/policies/{constraint_name\}` is also an acceptable name for API requests, but responses will return the name using the equivalent project number.
         */
        name?: string;
        /**
         * Field mask used to specify the fields to be overwritten in the policy by the set. The fields specified in the update_mask are relative to the policy, not the full request.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        constraints: Resource$Organizations$Constraints;
        customConstraints: Resource$Organizations$Customconstraints;
        policies: Resource$Organizations$Policies;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Constraints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists constraints that could be applied on the specified resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Constraints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Constraints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>>;
        list(params: Params$Resource$Organizations$Constraints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Constraints$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(params: Params$Resource$Organizations$Constraints$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
    }
    export interface Params$Resource$Organizations$Constraints$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The Google Cloud resource that parents the constraint. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export class Resource$Organizations$Customconstraints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a custom constraint. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the organization does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ALREADY_EXISTS` if the constraint already exists on the given organization.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Customconstraints$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Customconstraints$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2CustomConstraint>>;
        create(params: Params$Resource$Organizations$Customconstraints$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Customconstraints$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        create(params: Params$Resource$Organizations$Customconstraints$Create, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        /**
         * Deletes a custom constraint. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Customconstraints$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Customconstraints$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Organizations$Customconstraints$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Customconstraints$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Organizations$Customconstraints$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a custom or managed constraint. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the custom or managed constraint does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Customconstraints$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Customconstraints$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2CustomConstraint>>;
        get(params: Params$Resource$Organizations$Customconstraints$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Customconstraints$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        get(params: Params$Resource$Organizations$Customconstraints$Get, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        /**
         * Retrieves all of the custom constraints that exist on a particular organization resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Customconstraints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Customconstraints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse>>;
        list(params: Params$Resource$Organizations$Customconstraints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Customconstraints$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse>): void;
        list(params: Params$Resource$Organizations$Customconstraints$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListCustomConstraintsResponse>): void;
        /**
         * Updates a custom constraint. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint does not exist. Note: the supplied policy will perform a full overwrite of all fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Customconstraints$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Customconstraints$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2CustomConstraint>>;
        patch(params: Params$Resource$Organizations$Customconstraints$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Customconstraints$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        patch(params: Params$Resource$Organizations$Customconstraints$Patch, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2CustomConstraint>): void;
    }
    export interface Params$Resource$Organizations$Customconstraints$Create extends StandardParameters {
        /**
         * Required. Must be in the following form: * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2CustomConstraint;
    }
    export interface Params$Resource$Organizations$Customconstraints$Delete extends StandardParameters {
        /**
         * Required. Name of the custom constraint to delete. See the custom constraint entry for naming rules.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Customconstraints$Get extends StandardParameters {
        /**
         * Required. Resource name of the custom or managed constraint. See the custom constraint entry for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Customconstraints$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The target Google Cloud resource that parents the set of custom constraints that will be returned from this call. Must be in one of the following forms: * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Customconstraints$Patch extends StandardParameters {
        /**
         * Immutable. Name of the constraint. This is unique within the organization. Format of the name should be * `organizations/{organization_id\}/customConstraints/{custom_constraint_id\}` Example: `organizations/123/customConstraints/custom.createOnlyE2TypeVms` The max length is 70 characters and the minimum length is 1. Note that the prefix `organizations/{organization_id\}/customConstraints/` is not counted.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2CustomConstraint;
    }
    export class Resource$Organizations$Policies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ALREADY_EXISTS` if the policy already exists on the given Google Cloud resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Policies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Policies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        create(params: Params$Resource$Organizations$Policies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Policies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(params: Params$Resource$Organizations$Policies$Create, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Deletes a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or organization policy does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Policies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Policies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Organizations$Policies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Policies$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Organizations$Policies$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a policy on a resource. If no policy is set on the resource, `NOT_FOUND` is returned. The `etag` value can be used with `UpdatePolicy()` to update a policy during read-modify-write.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Policies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Policies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        get(params: Params$Resource$Organizations$Policies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Policies$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(params: Params$Resource$Organizations$Policies$Get, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Gets the effective policy on a resource. This is the result of merging policies in the resource hierarchy and evaluating conditions. The returned policy will not have an `etag` or `condition` set because it is an evaluated policy across multiple resources. Subtrees of Resource Manager resource hierarchy with 'under:' prefix will not be expanded.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEffectivePolicy(params: Params$Resource$Organizations$Policies$Geteffectivepolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEffectivePolicy(params?: Params$Resource$Organizations$Policies$Geteffectivepolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        getEffectivePolicy(params: Params$Resource$Organizations$Policies$Geteffectivepolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEffectivePolicy(params: Params$Resource$Organizations$Policies$Geteffectivepolicy, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(params: Params$Resource$Organizations$Policies$Geteffectivepolicy, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Retrieves all of the policies that exist on a particular resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>>;
        list(params: Params$Resource$Organizations$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(params: Params$Resource$Organizations$Policies$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        /**
         * Updates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or the policy do not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the policy Note: the supplied policy will perform a full overwrite of all fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Policies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Policies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        patch(params: Params$Resource$Organizations$Policies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Policies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(params: Params$Resource$Organizations$Policies$Patch, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
    }
    export interface Params$Resource$Organizations$Policies$Create extends StandardParameters {
        /**
         * Required. The Google Cloud resource that will parent the new policy. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export interface Params$Resource$Organizations$Policies$Delete extends StandardParameters {
        /**
         * Optional. The current etag of policy. If an etag is provided and does not match the current etag of the policy, deletion will be blocked and an ABORTED error will be returned.
         */
        etag?: string;
        /**
         * Required. Name of the policy to delete. See the policy entry for naming rules.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Policies$Get extends StandardParameters {
        /**
         * Required. Resource name of the policy. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Policies$Geteffectivepolicy extends StandardParameters {
        /**
         * Required. The effective policy to compute. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Policies$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The target Google Cloud resource that parents the set of constraints and policies that will be returned from this call. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Policies$Patch extends StandardParameters {
        /**
         * Immutable. The resource name of the policy. Must be one of the following forms, where `constraint_name` is the name of the constraint which this policy configures: * `projects/{project_number\}/policies/{constraint_name\}` * `folders/{folder_id\}/policies/{constraint_name\}` * `organizations/{organization_id\}/policies/{constraint_name\}` For example, `projects/123/policies/compute.disableSerialPortAccess`. Note: `projects/{project_id\}/policies/{constraint_name\}` is also an acceptable name for API requests, but responses will return the name using the equivalent project number.
         */
        name?: string;
        /**
         * Field mask used to specify the fields to be overwritten in the policy by the set. The fields specified in the update_mask are relative to the policy, not the full request.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        constraints: Resource$Projects$Constraints;
        policies: Resource$Projects$Policies;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Constraints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists constraints that could be applied on the specified resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Constraints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Constraints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>>;
        list(params: Params$Resource$Projects$Constraints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Constraints$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(params: Params$Resource$Projects$Constraints$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListConstraintsResponse>): void;
    }
    export interface Params$Resource$Projects$Constraints$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The Google Cloud resource that parents the constraint. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Policies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint does not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ALREADY_EXISTS` if the policy already exists on the given Google Cloud resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Policies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Policies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        create(params: Params$Resource$Projects$Policies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Policies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(params: Params$Resource$Projects$Policies$Create, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Deletes a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or organization policy does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Policies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Policies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Policies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Policies$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Policies$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a policy on a resource. If no policy is set on the resource, `NOT_FOUND` is returned. The `etag` value can be used with `UpdatePolicy()` to update a policy during read-modify-write.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Policies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Policies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        get(params: Params$Resource$Projects$Policies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Policies$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(params: Params$Resource$Projects$Policies$Get, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Gets the effective policy on a resource. This is the result of merging policies in the resource hierarchy and evaluating conditions. The returned policy will not have an `etag` or `condition` set because it is an evaluated policy across multiple resources. Subtrees of Resource Manager resource hierarchy with 'under:' prefix will not be expanded.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEffectivePolicy(params: Params$Resource$Projects$Policies$Geteffectivepolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEffectivePolicy(params?: Params$Resource$Projects$Policies$Geteffectivepolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        getEffectivePolicy(params: Params$Resource$Projects$Policies$Geteffectivepolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEffectivePolicy(params: Params$Resource$Projects$Policies$Geteffectivepolicy, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(params: Params$Resource$Projects$Policies$Geteffectivepolicy, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        getEffectivePolicy(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        /**
         * Retrieves all of the policies that exist on a particular resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>>;
        list(params: Params$Resource$Projects$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(params: Params$Resource$Projects$Policies$List, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2ListPoliciesResponse>): void;
        /**
         * Updates a policy. Returns a `google.rpc.Status` with `google.rpc.Code.NOT_FOUND` if the constraint or the policy do not exist. Returns a `google.rpc.Status` with `google.rpc.Code.ABORTED` if the etag supplied in the request does not match the persisted etag of the policy Note: the supplied policy will perform a full overwrite of all fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Policies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Policies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudOrgpolicyV2Policy>>;
        patch(params: Params$Resource$Projects$Policies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Policies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(params: Params$Resource$Projects$Policies$Patch, callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudOrgpolicyV2Policy>): void;
    }
    export interface Params$Resource$Projects$Policies$Create extends StandardParameters {
        /**
         * Required. The Google Cloud resource that will parent the new policy. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export interface Params$Resource$Projects$Policies$Delete extends StandardParameters {
        /**
         * Optional. The current etag of policy. If an etag is provided and does not match the current etag of the policy, deletion will be blocked and an ABORTED error will be returned.
         */
        etag?: string;
        /**
         * Required. Name of the policy to delete. See the policy entry for naming rules.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Policies$Get extends StandardParameters {
        /**
         * Required. Resource name of the policy. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Policies$Geteffectivepolicy extends StandardParameters {
        /**
         * Required. The effective policy to compute. See Policy for naming requirements.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Policies$List extends StandardParameters {
        /**
         * Size of the pages to be returned. This is currently unsupported and will be ignored. The server may at any point start using this field to limit page size.
         */
        pageSize?: number;
        /**
         * Page token used to retrieve the next page. This is currently unsupported and will be ignored. The server may at any point start using this field.
         */
        pageToken?: string;
        /**
         * Required. The target Google Cloud resource that parents the set of constraints and policies that will be returned from this call. Must be in one of the following forms: * `projects/{project_number\}` * `projects/{project_id\}` * `folders/{folder_id\}` * `organizations/{organization_id\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Policies$Patch extends StandardParameters {
        /**
         * Immutable. The resource name of the policy. Must be one of the following forms, where `constraint_name` is the name of the constraint which this policy configures: * `projects/{project_number\}/policies/{constraint_name\}` * `folders/{folder_id\}/policies/{constraint_name\}` * `organizations/{organization_id\}/policies/{constraint_name\}` For example, `projects/123/policies/compute.disableSerialPortAccess`. Note: `projects/{project_id\}/policies/{constraint_name\}` is also an acceptable name for API requests, but responses will return the name using the equivalent project number.
         */
        name?: string;
        /**
         * Field mask used to specify the fields to be overwritten in the policy by the set. The fields specified in the update_mask are relative to the policy, not the full request.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudOrgpolicyV2Policy;
    }
    export {};
}
