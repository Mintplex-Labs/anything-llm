import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace iam_v1 {
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
     * Identity and Access Management (IAM) API
     *
     * Manages identity and access control for Google Cloud resources, including the creation of service accounts, which you can use to authenticate to Google and make API calls. Enabling this API also enables the IAM Service Account Credentials API (iamcredentials.googleapis.com). However, disabling this API doesn&#39;t disable the IAM Service Account Credentials API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const iam = google.iam('v1');
     * ```
     */
    export class Iam {
        context: APIRequestContext;
        iamPolicies: Resource$Iampolicies;
        locations: Resource$Locations;
        organizations: Resource$Organizations;
        permissions: Resource$Permissions;
        projects: Resource$Projects;
        roles: Resource$Roles;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Access related restrictions on the workforce pool.
     */
    export interface Schema$AccessRestrictions {
        /**
         * Optional. Immutable. Services allowed for web sign-in with the workforce pool. If not set by default there are no restrictions.
         */
        allowedServices?: Schema$ServiceConfig[];
        /**
         * Optional. Disable programmatic sign-in by disabling token issue via the Security Token API endpoint. See [Security Token Service API] (https://cloud.google.com/iam/docs/reference/sts/rest).
         */
        disableProgrammaticSignin?: boolean | null;
    }
    /**
     * Request message for AddAttestationRule.
     */
    export interface Schema$AddAttestationRuleRequest {
        /**
         * Required. The attestation rule to be added.
         */
        attestationRule?: Schema$AttestationRule;
    }
    /**
     * Audit log information specific to Cloud IAM admin APIs. This message is serialized as an `Any` type in the `ServiceData` message of an `AuditLog` message.
     */
    export interface Schema$AdminAuditData {
        /**
         * The permission_delta when when creating or updating a Role.
         */
        permissionDelta?: Schema$PermissionDelta;
    }
    /**
     * Defines which workloads can receive an identity within a pool. When an AttestationRule is defined under a managed identity, matching workloads may receive that identity.
     */
    export interface Schema$AttestationRule {
        /**
         * Optional. A single workload operating on Google Cloud. For example: `//compute.googleapis.com/projects/123/uid/zones/us-central1-a/instances/12345`.
         */
        googleCloudResource?: string | null;
    }
    /**
     * Contains information about an auditable service.
     */
    export interface Schema$AuditableService {
        /**
         * Public name of the service. For example, the service name for IAM is 'iam.googleapis.com'.
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
     * Audit log information specific to Cloud IAM. This message is serialized as an `Any` type in the `ServiceData` message of an `AuditLog` message.
     */
    export interface Schema$AuditData {
        /**
         * Policy delta between the original policy and the newly set policy.
         */
        policyDelta?: Schema$PolicyDelta;
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
     * Represents an Amazon Web Services identity provider.
     */
    export interface Schema$Aws {
        /**
         * Required. The AWS account ID.
         */
        accountId?: string | null;
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
     * One delta entry for Binding. Each individual change (only one member in each entry) to a binding will be a separate entry.
     */
    export interface Schema$BindingDelta {
        /**
         * The action that was performed on a Binding. Required
         */
        action?: string | null;
        /**
         * The condition that is associated with this binding.
         */
        condition?: Schema$Expr;
        /**
         * A single identity requesting access for a Google Cloud resource. Follows the same format of Binding.members. Required
         */
        member?: string | null;
        /**
         * Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`. Required
         */
        role?: string | null;
    }
    /**
     * The request to create a new role.
     */
    export interface Schema$CreateRoleRequest {
        /**
         * The Role resource to create.
         */
        role?: Schema$Role;
        /**
         * The role ID to use for this role. A role ID may contain alphanumeric characters, underscores (`_`), and periods (`.`). It must contain a minimum of 3 characters and a maximum of 64 characters.
         */
        roleId?: string | null;
    }
    /**
     * The service account key create request.
     */
    export interface Schema$CreateServiceAccountKeyRequest {
        /**
         * Which type of key and algorithm to use for the key. The default is currently a 2K RSA key. However this may change in the future.
         */
        keyAlgorithm?: string | null;
        /**
         * The output format of the private key. The default value is `TYPE_GOOGLE_CREDENTIALS_FILE`, which is the Google Credentials File format.
         */
        privateKeyType?: string | null;
    }
    /**
     * The service account create request.
     */
    export interface Schema$CreateServiceAccountRequest {
        /**
         * Required. The account id that is used to generate the service account email address and a stable unique id. It is unique within a project, must be 6-30 characters long, and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])` to comply with RFC1035.
         */
        accountId?: string | null;
        /**
         * The ServiceAccount resource to create. Currently, only the following values are user assignable: `display_name` and `description`.
         */
        serviceAccount?: Schema$ServiceAccount;
    }
    /**
     * The service account key disable request.
     */
    export interface Schema$DisableServiceAccountKeyRequest {
        /**
         * Optional. Usable by internal google services only. An extended_status_message can be used to include additional information about the key, such as its private key data being exposed on a public repository like GitHub.
         */
        extendedStatusMessage?: string | null;
        /**
         * Optional. Describes the reason this key is being disabled. If unspecified, the default value of SERVICE_ACCOUNT_KEY_DISABLE_REASON_USER_INITIATED will be used.
         */
        serviceAccountKeyDisableReason?: string | null;
    }
    /**
     * The service account disable request.
     */
    export interface Schema$DisableServiceAccountRequest {
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The service account key enable request.
     */
    export interface Schema$EnableServiceAccountKeyRequest {
    }
    /**
     * The service account enable request.
     */
    export interface Schema$EnableServiceAccountRequest {
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
     * Extended status can store additional metadata. For example, for keys disabled due to their private key data being expoesed we may include a message with more information about the exposure.
     */
    export interface Schema$ExtendedStatus {
        /**
         * The key for this extended status.
         */
        key?: string | null;
        /**
         * The value for the extended status.
         */
        value?: string | null;
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
     * Represents the OAuth 2.0 client credential configuration for retrieving additional user attributes that are not present in the initial authentication credentials from the identity provider, e.g. groups. See https://datatracker.ietf.org/doc/html/rfc6749#section-4.4 for more details on client credentials grant flow.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderExtraAttributesOAuth2Client {
        /**
         * Required. Represents the IdP and type of claims that should be fetched.
         */
        attributesType?: string | null;
        /**
         * Required. The OAuth 2.0 client ID for retrieving extra attributes from the identity provider. Required to get the Access Token using client credentials grant flow.
         */
        clientId?: string | null;
        /**
         * Required. The OAuth 2.0 client secret for retrieving extra attributes from the identity provider. Required to get the Access Token using client credentials grant flow.
         */
        clientSecret?: Schema$GoogleIamAdminV1WorkforcePoolProviderOidcClientSecret;
        /**
         * Required. The OIDC identity provider's issuer URI. Must be a valid URI using the `https` scheme. Required to get the OIDC discovery document.
         */
        issuerUri?: string | null;
        /**
         * Optional. Represents the parameters to control which claims are fetched from an IdP.
         */
        queryParameters?: Schema$GoogleIamAdminV1WorkforcePoolProviderExtraAttributesOAuth2ClientQueryParameters;
    }
    /**
     * Represents the parameters to control which claims are fetched from an IdP.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderExtraAttributesOAuth2ClientQueryParameters {
        /**
         * Optional. The filter used to request specific records from the IdP. By default, all of the groups that are associated with a user are fetched. For Microsoft Entra ID, you can add `$search` query parameters using [Keyword Query Language] (https://learn.microsoft.com/en-us/sharepoint/dev/general-development/keyword-query-language-kql-syntax-reference). To learn more about `$search` querying in Microsoft Entra ID, see [Use the `$search` query parameter] (https://learn.microsoft.com/en-us/graph/search-query-parameter). Additionally, Workforce Identity Federation automatically adds the following [`$filter` query parameters] (https://learn.microsoft.com/en-us/graph/filter-query-parameter), based on the value of `attributes_type`. Values passed to `filter` are converted to `$search` query parameters. Additional `$filter` query parameters cannot be added using this field. * `AZURE_AD_GROUPS_MAIL`: `mailEnabled` and `securityEnabled` filters are applied. * `AZURE_AD_GROUPS_ID`: `securityEnabled` filter is applied.
         */
        filter?: string | null;
    }
    /**
     * Represents an OpenId Connect 1.0 identity provider.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderOidc {
        /**
         * Required. The client ID. Must match the audience claim of the JWT issued by the identity provider.
         */
        clientId?: string | null;
        /**
         * Optional. The optional client secret. Required to enable Authorization Code flow for web sign-in.
         */
        clientSecret?: Schema$GoogleIamAdminV1WorkforcePoolProviderOidcClientSecret;
        /**
         * Required. The OIDC issuer URI. Must be a valid URI using the `https` scheme.
         */
        issuerUri?: string | null;
        /**
         * Optional. OIDC JWKs in JSON String format. For details on the definition of a JWK, see https://tools.ietf.org/html/rfc7517. If not set, the `jwks_uri` from the discovery document(fetched from the .well-known path of the `issuer_uri`) will be used. Currently, RSA and EC asymmetric keys are supported. The JWK must use following format and include only the following fields: { "keys": [ { "kty": "RSA/EC", "alg": "", "use": "sig", "kid": "", "n": "", "e": "", "x": "", "y": "", "crv": "" \} ] \}
         */
        jwksJson?: string | null;
        /**
         * Required. Configuration for web single sign-on for the OIDC provider. Here, web sign-in refers to console sign-in and gcloud sign-in through the browser.
         */
        webSsoConfig?: Schema$GoogleIamAdminV1WorkforcePoolProviderOidcWebSsoConfig;
    }
    /**
     * Representation of a client secret configured for the OIDC provider.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderOidcClientSecret {
        /**
         * The value of the client secret.
         */
        value?: Schema$GoogleIamAdminV1WorkforcePoolProviderOidcClientSecretValue;
    }
    /**
     * Representation of the value of the client secret.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderOidcClientSecretValue {
        /**
         * Optional. Input only. The plain text of the client secret value. For security reasons, this field is only used for input and will never be populated in any response.
         */
        plainText?: string | null;
        /**
         * Output only. A thumbprint to represent the current client secret value.
         */
        thumbprint?: string | null;
    }
    /**
     * Configuration for web single sign-on for the OIDC provider.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderOidcWebSsoConfig {
        /**
         * Optional. Additional scopes to request for in the OIDC authentication request on top of scopes requested by default. By default, the `openid`, `profile` and `email` scopes that are supported by the identity provider are requested. Each additional scope may be at most 256 characters. A maximum of 10 additional scopes may be configured.
         */
        additionalScopes?: string[] | null;
        /**
         * Required. The behavior for how OIDC Claims are included in the `assertion` object used for attribute mapping and attribute condition.
         */
        assertionClaimsBehavior?: string | null;
        /**
         * Required. The Response Type to request for in the OIDC Authorization Request for web sign-in. The `CODE` Response Type is recommended to avoid the Implicit Flow, for security reasons.
         */
        responseType?: string | null;
    }
    /**
     * Represents a SAML identity provider.
     */
    export interface Schema$GoogleIamAdminV1WorkforcePoolProviderSaml {
        /**
         * Required. SAML Identity provider configuration metadata xml doc. The xml document should comply with [SAML 2.0 specification](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf). The max size of the acceptable xml document will be bounded to 128k characters. The metadata xml document should satisfy the following constraints: 1) Must contain an Identity Provider Entity ID. 2) Must contain at least one non-expired signing key certificate. 3) For each signing key: a) Valid from should be no more than 7 days from now. b) Valid to should be no more than 20 years in the future. 4) Up to 3 IdP signing keys are allowed in the metadata xml. When updating the provider's metadata xml, at least one non-expired signing key must overlap with the existing metadata. This requirement is skipped if there are no non-expired signing keys present in the existing metadata.
         */
        idpMetadataXml?: string | null;
    }
    /**
     * Represents configuration for generating mutual TLS (mTLS) certificates for the identities within this pool.
     */
    export interface Schema$InlineCertificateIssuanceConfig {
        /**
         * Optional. A required mapping of a Google Cloud region to the CA pool resource located in that region. The CA pool is used for certificate issuance, adhering to the following constraints: * Key format: A supported cloud region name equivalent to the location identifier in the corresponding map entry's value. * Value format: A valid CA pool resource path format like: "projects/{project\}/locations/{location\}/caPools/{ca_pool\}" * Region Matching: Workloads are ONLY issued certificates from CA pools within the same region. Also the CA pool region (in value) must match the workload's region (key).
         */
        caPools?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Key algorithm to use when generating the key pair. This key pair will be used to create the certificate. If not specified, this will default to ECDSA_P256.
         */
        keyAlgorithm?: string | null;
        /**
         * Optional. Lifetime of the workload certificates issued by the CA pool. Must be between 10 hours and 30 days. If not specified, this will be defaulted to 24 hours.
         */
        lifetime?: string | null;
        /**
         * Optional. Rotation window percentage indicating when certificate rotation should be initiated based on remaining lifetime. Must be between 10 and 80. If not specified, this will be defaulted to 50.
         */
        rotationWindowPercentage?: number | null;
    }
    /**
     * Defines configuration for extending trust to additional trust domains. By establishing trust with another domain, the current domain will recognize and accept certificates issued by entities within the trusted domains. Note that a trust domain automatically trusts itself, eliminating the need for explicit configuration.
     */
    export interface Schema$InlineTrustConfig {
        /**
         * Optional. Maps specific trust domains (e.g., "example.com") to their corresponding TrustStore, which contain the trusted root certificates for that domain. There can be a maximum of 10 trust domain entries in this map. Note that a trust domain automatically trusts itself and don't need to be specified here. If however, this WorkloadIdentityPool's trust domain contains any trust anchors in the additional_trust_bundles map, those trust anchors will be *appended to* the trust bundle automatically derived from your InlineCertificateIssuanceConfig's ca_pools.
         */
        additionalTrustBundles?: {
            [key: string]: Schema$TrustStore;
        } | null;
    }
    /**
     * Intermediate CA certificates used for building the trust chain to trust anchor
     */
    export interface Schema$IntermediateCA {
        /**
         * PEM certificate of the PKI used for validation. Must only contain one ca certificate.
         */
        pemCertificate?: string | null;
    }
    /**
     * Represents a public key data along with its format.
     */
    export interface Schema$KeyData {
        /**
         * Output only. The format of the key.
         */
        format?: string | null;
        /**
         * Output only. The key data. The format of the key is represented by the format field.
         */
        key?: string | null;
        /**
         * Required. The specifications for the key.
         */
        keySpec?: string | null;
        /**
         * Output only. Latest timestamp when this key is valid. Attempts to use this key after this time will fail. Only present if the key data represents a X.509 certificate.
         */
        notAfterTime?: string | null;
        /**
         * Output only. Earliest timestamp when this key is valid. Attempts to use this key before this time will fail. Only present if the key data represents a X.509 certificate.
         */
        notBeforeTime?: string | null;
    }
    /**
     * The request to lint an IAM policy object.
     */
    export interface Schema$LintPolicyRequest {
        /**
         * google.iam.v1.Binding.condition object to be linted.
         */
        condition?: Schema$Expr;
        /**
         * The full resource name of the policy this lint request is about. The name follows the Google Cloud format for full resource names. For example, a Google Cloud project with ID `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`. The resource name is not used to read a policy from IAM. Only the data in the request object is linted.
         */
        fullResourceName?: string | null;
    }
    /**
     * The response of a lint operation. An empty response indicates the operation was able to fully execute and no lint issue was found.
     */
    export interface Schema$LintPolicyResponse {
        /**
         * List of lint results sorted by `severity` in descending order.
         */
        lintResults?: Schema$LintResult[];
    }
    /**
     * Structured response of a single validation unit.
     */
    export interface Schema$LintResult {
        /**
         * Human readable debug message associated with the issue.
         */
        debugMessage?: string | null;
        /**
         * The name of the field for which this lint result is about. For nested messages `field_name` consists of names of the embedded fields separated by period character. The top-level qualifier is the input object to lint in the request. For example, the `field_name` value `condition.expression` identifies a lint result for the `expression` field of the provided condition.
         */
        fieldName?: string | null;
        /**
         * The validation unit level.
         */
        level?: string | null;
        /**
         * 0-based character position of problematic construct within the object identified by `field_name`. Currently, this is populated only for condition expression.
         */
        locationOffset?: number | null;
        /**
         * The validation unit severity.
         */
        severity?: string | null;
        /**
         * The validation unit name, for instance "lintValidationUnits/ConditionComplexityCheck".
         */
        validationUnitName?: string | null;
    }
    /**
     * Response message for ListAttestationRules.
     */
    export interface Schema$ListAttestationRulesResponse {
        /**
         * A list of AttestationRules.
         */
        attestationRules?: Schema$AttestationRule[];
        /**
         * Optional. A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListOauthClientCredentials.
     */
    export interface Schema$ListOauthClientCredentialsResponse {
        /**
         * A list of OauthClientCredentials.
         */
        oauthClientCredentials?: Schema$OauthClientCredential[];
    }
    /**
     * Response message for ListOauthClients.
     */
    export interface Schema$ListOauthClientsResponse {
        /**
         * Optional. A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of OauthClients.
         */
        oauthClients?: Schema$OauthClient[];
    }
    /**
     * The response containing the roles defined under a resource.
     */
    export interface Schema$ListRolesResponse {
        /**
         * To retrieve the next page of results, set `ListRolesRequest.page_token` to this value.
         */
        nextPageToken?: string | null;
        /**
         * The Roles defined on this resource.
         */
        roles?: Schema$Role[];
    }
    /**
     * The service account keys list response.
     */
    export interface Schema$ListServiceAccountKeysResponse {
        /**
         * The public keys for the service account.
         */
        keys?: Schema$ServiceAccountKey[];
    }
    /**
     * The service account list response.
     */
    export interface Schema$ListServiceAccountsResponse {
        /**
         * The list of matching service accounts.
         */
        accounts?: Schema$ServiceAccount[];
        /**
         * To retrieve the next page of results, set ListServiceAccountsRequest.page_token to this value.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListWorkforcePoolProviderKeys.
     */
    export interface Schema$ListWorkforcePoolProviderKeysResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of WorkforcePoolProviderKeys.
         */
        workforcePoolProviderKeys?: Schema$WorkforcePoolProviderKey[];
    }
    /**
     * Response message for ListWorkforcePoolProviders.
     */
    export interface Schema$ListWorkforcePoolProvidersResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of providers.
         */
        workforcePoolProviders?: Schema$WorkforcePoolProvider[];
    }
    /**
     * Response message for ListWorkforcePools.
     */
    export interface Schema$ListWorkforcePoolsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of pools.
         */
        workforcePools?: Schema$WorkforcePool[];
    }
    /**
     * Response message for ListWorkloadIdentityPoolManagedIdentities.
     */
    export interface Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of managed identities.
         */
        workloadIdentityPoolManagedIdentities?: Schema$WorkloadIdentityPoolManagedIdentity[];
    }
    /**
     * Response message for ListWorkloadIdentityPoolNamespaces.
     */
    export interface Schema$ListWorkloadIdentityPoolNamespacesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of namespaces.
         */
        workloadIdentityPoolNamespaces?: Schema$WorkloadIdentityPoolNamespace[];
    }
    /**
     * Response message for ListWorkloadIdentityPoolProviderKeys.
     */
    export interface Schema$ListWorkloadIdentityPoolProviderKeysResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of WorkloadIdentityPoolProviderKey
         */
        workloadIdentityPoolProviderKeys?: Schema$WorkloadIdentityPoolProviderKey[];
    }
    /**
     * Response message for ListWorkloadIdentityPoolProviders.
     */
    export interface Schema$ListWorkloadIdentityPoolProvidersResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of providers.
         */
        workloadIdentityPoolProviders?: Schema$WorkloadIdentityPoolProvider[];
    }
    /**
     * Response message for ListWorkloadIdentityPools.
     */
    export interface Schema$ListWorkloadIdentityPoolsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of pools.
         */
        workloadIdentityPools?: Schema$WorkloadIdentityPool[];
    }
    /**
     * Represents an OauthClient. Used to access Google Cloud resources on behalf of a Workforce Identity Federation user by using OAuth 2.0 Protocol to obtain an access token from Google Cloud.
     */
    export interface Schema$OauthClient {
        /**
         * Required. The list of OAuth grant types is allowed for the OauthClient.
         */
        allowedGrantTypes?: string[] | null;
        /**
         * Required. The list of redirect uris that is allowed to redirect back when authorization process is completed.
         */
        allowedRedirectUris?: string[] | null;
        /**
         * Required. The list of scopes that the OauthClient is allowed to request during OAuth flows. The following scopes are supported: * `https://www.googleapis.com/auth/cloud-platform`: See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account. * `openid`: The OAuth client can associate you with your personal information on Google Cloud. * `email`: The OAuth client can read a federated identity's email address. * `groups`: The OAuth client can read a federated identity's groups.
         */
        allowedScopes?: string[] | null;
        /**
         * Output only. The system-generated OauthClient id.
         */
        clientId?: string | null;
        /**
         * Immutable. The type of OauthClient. Either public or private. For private clients, the client secret can be managed using the dedicated OauthClientCredential resource.
         */
        clientType?: string | null;
        /**
         * Optional. A user-specified description of the OauthClient. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Optional. Whether the OauthClient is disabled. You cannot use a disabled OAuth client.
         */
        disabled?: boolean | null;
        /**
         * Optional. A user-specified display name of the OauthClient. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Time after which the OauthClient will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Immutable. Identifier. The resource name of the OauthClient. Format:`projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}`.
         */
        name?: string | null;
        /**
         * Output only. The state of the OauthClient.
         */
        state?: string | null;
    }
    /**
     * Represents an OauthClientCredential. Used to authenticate an OauthClient while accessing Google Cloud resources on behalf of a user by using OAuth 2.0 Protocol.
     */
    export interface Schema$OauthClientCredential {
        /**
         * Output only. The system-generated OAuth client secret. The client secret must be stored securely. If the client secret is leaked, you must delete and re-create the client credential. To learn more, see [OAuth client and credential security risks and mitigations](https://cloud.google.com/iam/docs/workforce-oauth-app#security)
         */
        clientSecret?: string | null;
        /**
         * Optional. Whether the OauthClientCredential is disabled. You cannot use a disabled OauthClientCredential.
         */
        disabled?: boolean | null;
        /**
         * Optional. A user-specified display name of the OauthClientCredential. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Immutable. Identifier. The resource name of the OauthClientCredential. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}/credentials/{credential\}`
         */
        name?: string | null;
    }
    /**
     * Represents an OpenId Connect 1.0 identity provider.
     */
    export interface Schema$Oidc {
        /**
         * Optional. Acceptable values for the `aud` field (audience) in the OIDC token. Token exchange requests are rejected if the token audience does not match one of the configured values. Each audience may be at most 256 characters. A maximum of 10 audiences may be configured. If this list is empty, the OIDC token audience must be equal to the full canonical resource name of the WorkloadIdentityPoolProvider, with or without the HTTPS prefix. For example: ``` //iam.googleapis.com/projects//locations//workloadIdentityPools//providers/ https://iam.googleapis.com/projects//locations//workloadIdentityPools//providers/ ```
         */
        allowedAudiences?: string[] | null;
        /**
         * Required. The OIDC issuer URL. Must be an HTTPS endpoint. Per OpenID Connect Discovery 1.0 spec, the OIDC issuer URL is used to locate the provider's public keys (via `jwks_uri`) for verifying tokens like the OIDC ID token. These public key types must be 'EC' or 'RSA'.
         */
        issuerUri?: string | null;
        /**
         * Optional. OIDC JWKs in JSON String format. For details on the definition of a JWK, see https://tools.ietf.org/html/rfc7517. If not set, the `jwks_uri` from the discovery document(fetched from the .well-known path of the `issuer_uri`) will be used. Currently, RSA and EC asymmetric keys are supported. The JWK must use following format and include only the following fields: { "keys": [ { "kty": "RSA/EC", "alg": "", "use": "sig", "kid": "", "n": "", "e": "", "x": "", "y": "", "crv": "" \} ] \}
         */
        jwksJson?: string | null;
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
     * The Google Cloud service that owns this namespace.
     */
    export interface Schema$OwnerService {
        /**
         * Required. The service agent principal subject, e.g. "serviceAccount:service-1234@gcp-sa-gkehub.iam.gserviceaccount.com".
         */
        principalSubject?: string | null;
    }
    /**
     * The service account patch request. You can patch only the `display_name` and `description` fields. You must use the `update_mask` field to specify which of these fields you want to patch. Only the fields specified in the request are guaranteed to be returned in the response. Other fields may be empty in the response.
     */
    export interface Schema$PatchServiceAccountRequest {
        serviceAccount?: Schema$ServiceAccount;
        updateMask?: string | null;
    }
    /**
     * A permission which can be included by a role.
     */
    export interface Schema$Permission {
        /**
         * The service API associated with the permission is not enabled.
         */
        apiDisabled?: boolean | null;
        /**
         * The current custom role support level.
         */
        customRolesSupportLevel?: string | null;
        /**
         * A brief description of what this Permission is used for.
         */
        description?: string | null;
        /**
         * The name of this Permission.
         */
        name?: string | null;
        onlyInPredefinedRoles?: boolean | null;
        /**
         * The preferred name for this permission. If present, then this permission is an alias of, and equivalent to, the listed primary_permission.
         */
        primaryPermission?: string | null;
        /**
         * The current launch stage of the permission.
         */
        stage?: string | null;
        /**
         * The title of this Permission.
         */
        title?: string | null;
    }
    /**
     * A PermissionDelta message to record the added_permissions and removed_permissions inside a role.
     */
    export interface Schema$PermissionDelta {
        /**
         * Added permissions.
         */
        addedPermissions?: string[] | null;
        /**
         * Removed permissions.
         */
        removedPermissions?: string[] | null;
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
     * The difference delta between two policies.
     */
    export interface Schema$PolicyDelta {
        /**
         * The delta for Bindings between two policies.
         */
        bindingDeltas?: Schema$BindingDelta[];
    }
    /**
     * A request to get the list of auditable services for a resource.
     */
    export interface Schema$QueryAuditableServicesRequest {
        /**
         * Required. The full resource name to query from the list of auditable services. The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.
         */
        fullResourceName?: string | null;
    }
    /**
     * A response containing a list of auditable services for a resource.
     */
    export interface Schema$QueryAuditableServicesResponse {
        /**
         * The auditable services for a resource.
         */
        services?: Schema$AuditableService[];
    }
    /**
     * The grantable role query request.
     */
    export interface Schema$QueryGrantableRolesRequest {
        /**
         * Required. Required. The full resource name to query from the list of grantable roles. The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.
         */
        fullResourceName?: string | null;
        /**
         * Optional limit on the number of roles to include in the response. The default is 300, and the maximum is 2,000.
         */
        pageSize?: number | null;
        /**
         * Optional pagination token returned in an earlier QueryGrantableRolesResponse.
         */
        pageToken?: string | null;
        view?: string | null;
    }
    /**
     * The grantable role query response.
     */
    export interface Schema$QueryGrantableRolesResponse {
        /**
         * To retrieve the next page of results, set `QueryGrantableRolesRequest.page_token` to this value.
         */
        nextPageToken?: string | null;
        /**
         * The list of matching roles.
         */
        roles?: Schema$Role[];
    }
    /**
     * A request to get permissions which can be tested on a resource.
     */
    export interface Schema$QueryTestablePermissionsRequest {
        /**
         * Required. The full resource name to query from the list of testable permissions. The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.
         */
        fullResourceName?: string | null;
        /**
         * Optional limit on the number of permissions to include in the response. The default is 100, and the maximum is 1,000.
         */
        pageSize?: number | null;
        /**
         * Optional pagination token returned in an earlier QueryTestablePermissionsRequest.
         */
        pageToken?: string | null;
    }
    /**
     * The response containing permissions which can be tested on a resource.
     */
    export interface Schema$QueryTestablePermissionsResponse {
        /**
         * To retrieve the next page of results, set `QueryTestableRolesRequest.page_token` to this value.
         */
        nextPageToken?: string | null;
        /**
         * The Permissions testable on the requested resource.
         */
        permissions?: Schema$Permission[];
    }
    /**
     * Operation metadata returned by the CLH during resource state reconciliation.
     */
    export interface Schema$ReconciliationOperationMetadata {
        /**
         * DEPRECATED. Use exclusive_action instead.
         */
        deleteResource?: boolean | null;
        /**
         * Excluisive action returned by the CLH.
         */
        exclusiveAction?: string | null;
    }
    /**
     * Request message for RemoveAttestationRule.
     */
    export interface Schema$RemoveAttestationRuleRequest {
        /**
         * Required. The attestation rule to be removed.
         */
        attestationRule?: Schema$AttestationRule;
    }
    /**
     * A role in the Identity and Access Management API.
     */
    export interface Schema$Role {
        /**
         * The current deleted state of the role. This field is read only. It will be ignored in calls to CreateRole and UpdateRole.
         */
        deleted?: boolean | null;
        /**
         * Optional. A human-readable description for the role.
         */
        description?: string | null;
        /**
         * Used to perform a consistent read-modify-write.
         */
        etag?: string | null;
        /**
         * The names of the permissions this role grants when bound in an IAM policy.
         */
        includedPermissions?: string[] | null;
        /**
         * The name of the role. When `Role` is used in `CreateRole`, the role name must not be set. When `Role` is used in output and other input such as `UpdateRole`, the role name is the complete path. For example, `roles/logging.viewer` for predefined roles, `organizations/{ORGANIZATION_ID\}/roles/myRole` for organization-level custom roles, and `projects/{PROJECT_ID\}/roles/myRole` for project-level custom roles.
         */
        name?: string | null;
        /**
         * The current launch stage of the role. If the `ALPHA` launch stage has been selected for a role, the `stage` field will not be included in the returned definition for the role.
         */
        stage?: string | null;
        /**
         * Optional. A human-readable title for the role. Typically this is limited to 100 UTF-8 bytes.
         */
        title?: string | null;
    }
    /**
     * Represents an SAML 2.0 identity provider.
     */
    export interface Schema$Saml {
        /**
         * Required. SAML identity provider (IdP) configuration metadata XML doc. The XML document must comply with the [SAML 2.0 specification](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf). The maximum size of an acceptable XML document is 128K characters. The SAML metadata XML document must satisfy the following constraints: * Must contain an IdP Entity ID. * Must contain at least one non-expired signing certificate. * For each signing certificate, the expiration must be: * From no more than 7 days in the future. * To no more than 20 years in the future. * Up to three IdP signing keys are allowed. When updating the provider's metadata XML, at least one non-expired signing key must overlap with the existing metadata. This requirement is skipped if there are no non-expired signing keys present in the existing metadata.
         */
        idpMetadataXml?: string | null;
    }
    /**
     * An IAM service account. A service account is an account for an application or a virtual machine (VM) instance, not a person. You can use a service account to call Google APIs. To learn more, read the [overview of service accounts](https://cloud.google.com/iam/help/service-accounts/overview). When you create a service account, you specify the project ID that owns the service account, as well as a name that must be unique within the project. IAM uses these values to create an email address that identifies the service account. //
     */
    export interface Schema$ServiceAccount {
        /**
         * Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.
         */
        description?: string | null;
        /**
         * Output only. Whether the service account is disabled.
         */
        disabled?: boolean | null;
        /**
         * Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The email address of the service account.
         */
        email?: string | null;
        /**
         * Deprecated. Do not use.
         */
        etag?: string | null;
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string | null;
        /**
         * Output only. The OAuth 2.0 client ID for the service account.
         */
        oauth2ClientId?: string | null;
        /**
         * Output only. The ID of the project that owns the service account.
         */
        projectId?: string | null;
        /**
         * Output only. The unique, stable numeric ID for the service account. Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.
         */
        uniqueId?: string | null;
    }
    /**
     * Represents a service account key. A service account has two sets of key-pairs: user-managed, and system-managed. User-managed key-pairs can be created and deleted by users. Users are responsible for rotating these keys periodically to ensure security of their service accounts. Users retain the private key of these key-pairs, and Google retains ONLY the public key. System-managed keys are automatically rotated by Google, and are used for signing for a maximum of two weeks. The rotation process is probabilistic, and usage of the new key will gradually ramp up and down over the key's lifetime. If you cache the public key set for a service account, we recommend that you update the cache every 15 minutes. User-managed keys can be added and removed at any time, so it is important to update the cache frequently. For Google-managed keys, Google will publish a key at least 6 hours before it is first used for signing and will keep publishing it for at least 6 hours after it was last used for signing. Public keys for all service accounts are also published at the OAuth2 Service Account API.
     */
    export interface Schema$ServiceAccountKey {
        /**
         * The key status.
         */
        disabled?: boolean | null;
        /**
         * Output only. optional. If the key is disabled, it may have a DisableReason describing why it was disabled.
         */
        disableReason?: string | null;
        /**
         * Output only. Extended Status provides permanent information about a service account key. For example, if this key was detected as exposed or compromised, that information will remain for the lifetime of the key in the extended_status.
         */
        extendedStatus?: Schema$ExtendedStatus[];
        /**
         * Specifies the algorithm (and possibly key size) for the key.
         */
        keyAlgorithm?: string | null;
        /**
         * The key origin.
         */
        keyOrigin?: string | null;
        /**
         * The key type.
         */
        keyType?: string | null;
        /**
         * The resource name of the service account key in the following format `projects/{PROJECT_ID\}/serviceAccounts/{ACCOUNT\}/keys/{key\}`.
         */
        name?: string | null;
        /**
         * The private key data. Only provided in `CreateServiceAccountKey` responses. Make sure to keep the private key data secure because it allows for the assertion of the service account identity. When base64 decoded, the private key data can be used to authenticate with Google API client libraries and with gcloud auth activate-service-account.
         */
        privateKeyData?: string | null;
        /**
         * The output format for the private key. Only provided in `CreateServiceAccountKey` responses, not in `GetServiceAccountKey` or `ListServiceAccountKey` responses. Google never exposes system-managed private keys, and never retains user-managed private keys.
         */
        privateKeyType?: string | null;
        /**
         * The public key data. Only provided in `GetServiceAccountKey` responses.
         */
        publicKeyData?: string | null;
        /**
         * The key can be used after this timestamp.
         */
        validAfterTime?: string | null;
        /**
         * The key can be used before this timestamp. For system-managed key pairs, this timestamp is the end time for the private key signing operation. The public key could still be used for verification for a few hours after this time.
         */
        validBeforeTime?: string | null;
    }
    /**
     * Configuration for a service.
     */
    export interface Schema$ServiceConfig {
        /**
         * Optional. Domain name of the service. Example: console.cloud.google
         */
        domain?: string | null;
    }
    /**
     * Request message for SetAttestationRules.
     */
    export interface Schema$SetAttestationRulesRequest {
        /**
         * Required. The attestation rules to be set. At most 50 attestation rules can be set.
         */
        attestationRules?: Schema$AttestationRule[];
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
     * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The service account sign blob request.
     */
    export interface Schema$SignBlobRequest {
        /**
         * Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The bytes to sign.
         */
        bytesToSign?: string | null;
    }
    /**
     * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The service account sign blob response.
     */
    export interface Schema$SignBlobResponse {
        /**
         * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The id of the key used to sign the blob.
         */
        keyId?: string | null;
        /**
         * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The signed blob.
         */
        signature?: string | null;
    }
    /**
     * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The service account sign JWT request.
     */
    export interface Schema$SignJwtRequest {
        /**
         * Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The JWT payload to sign. Must be a serialized JSON object that contains a JWT Claims Set. For example: `{"sub": "user@example.com", "iat": 313435\}` If the JWT Claims Set contains an expiration time (`exp`) claim, it must be an integer timestamp that is not in the past and no more than 12 hours in the future. If the JWT Claims Set does not contain an expiration time (`exp`) claim, this claim is added automatically, with a timestamp that is 1 hour in the future.
         */
        payload?: string | null;
    }
    /**
     * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The service account sign JWT response.
     */
    export interface Schema$SignJwtResponse {
        /**
         * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The id of the key used to sign the JWT.
         */
        keyId?: string | null;
        /**
         * Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The signed JWT.
         */
        signedJwt?: string | null;
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
     * Represents a root of trust.
     */
    export interface Schema$TrustAnchor {
        /**
         * PEM certificate of the PKI used for validation. Must only contain one ca certificate(either root or intermediate cert).
         */
        pemCertificate?: string | null;
    }
    /**
     * Trust store that contains trust anchors and optional intermediate CAs used in PKI to build trust chain and verify a client's identity.
     */
    export interface Schema$TrustStore {
        /**
         * Optional. Set of intermediate CA certificates used for building the trust chain to the trust anchor. Important: Intermediate CAs are only supported for X.509 federation.
         */
        intermediateCas?: Schema$IntermediateCA[];
        /**
         * Required. List of trust anchors to be used while performing validation against a given TrustStore. The incoming end entity's certificate must be in the trust chain of one of the trust anchors here.
         */
        trustAnchors?: Schema$TrustAnchor[];
    }
    /**
     * Request message for UndeleteOauthClient.
     */
    export interface Schema$UndeleteOauthClientRequest {
    }
    /**
     * The request to undelete an existing role.
     */
    export interface Schema$UndeleteRoleRequest {
        /**
         * Used to perform a consistent read-modify-write.
         */
        etag?: string | null;
    }
    /**
     * The service account undelete request.
     */
    export interface Schema$UndeleteServiceAccountRequest {
    }
    export interface Schema$UndeleteServiceAccountResponse {
        /**
         * Metadata for the restored service account.
         */
        restoredAccount?: Schema$ServiceAccount;
    }
    /**
     * Request message for UndeleteWorkforcePoolProviderKey.
     */
    export interface Schema$UndeleteWorkforcePoolProviderKeyRequest {
    }
    /**
     * Request message for UndeleteWorkforcePoolProvider.
     */
    export interface Schema$UndeleteWorkforcePoolProviderRequest {
    }
    /**
     * Request message for UndeleteWorkforcePool.
     */
    export interface Schema$UndeleteWorkforcePoolRequest {
    }
    /**
     * Request message for UndeleteWorkforcePoolSubject.
     */
    export interface Schema$UndeleteWorkforcePoolSubjectRequest {
    }
    /**
     * Request message for UndeleteWorkloadIdentityPoolManagedIdentity.
     */
    export interface Schema$UndeleteWorkloadIdentityPoolManagedIdentityRequest {
    }
    /**
     * Request message for UndeleteWorkloadIdentityPoolNamespace.
     */
    export interface Schema$UndeleteWorkloadIdentityPoolNamespaceRequest {
    }
    /**
     * Request message for UndeleteWorkloadIdentityPoolProviderKey.
     */
    export interface Schema$UndeleteWorkloadIdentityPoolProviderKeyRequest {
    }
    /**
     * Request message for UndeleteWorkloadIdentityPoolProvider.
     */
    export interface Schema$UndeleteWorkloadIdentityPoolProviderRequest {
    }
    /**
     * Request message for UndeleteWorkloadIdentityPool.
     */
    export interface Schema$UndeleteWorkloadIdentityPoolRequest {
    }
    /**
     * The service account key upload request.
     */
    export interface Schema$UploadServiceAccountKeyRequest {
        /**
         * The public key to associate with the service account. Must be an RSA public key that is wrapped in an X.509 v3 certificate. Include the first line, `-----BEGIN CERTIFICATE-----`, and the last line, `-----END CERTIFICATE-----`.
         */
        publicKeyData?: string | null;
    }
    /**
     * Represents a collection of external workforces. Provides namespaces for federated users that can be referenced in IAM policies.
     */
    export interface Schema$WorkforcePool {
        /**
         * Optional. Configure access restrictions on the workforce pool users. This is an optional field. If specified web sign-in can be restricted to given set of services or programmatic sign-in can be disabled for pool users.
         */
        accessRestrictions?: Schema$AccessRestrictions;
        /**
         * Optional. A user-specified description of the pool. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Optional. Disables the workforce pool. You cannot use a disabled pool to exchange tokens, or use existing tokens to access resources. If the pool is re-enabled, existing tokens grant access again.
         */
        disabled?: boolean | null;
        /**
         * Optional. A user-specified display name of the pool in Google Cloud Console. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Time after which the workforce pool will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Identifier. The resource name of the pool. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        name?: string | null;
        /**
         * Immutable. The resource name of the parent. Format: `organizations/{org-id\}`.
         */
        parent?: string | null;
        /**
         * Optional. Duration that the Google Cloud access tokens, console sign-in sessions, and `gcloud` sign-in sessions from this pool are valid. Must be greater than 15 minutes (900s) and less than 12 hours (43200s). If `session_duration` is not configured, minted credentials have a default duration of one hour (3600s). For SAML providers, the lifetime of the token is the minimum of the `session_duration` and the `SessionNotOnOrAfter` claim in the SAML assertion.
         */
        sessionDuration?: string | null;
        /**
         * Output only. The state of the pool.
         */
        state?: string | null;
    }
    /**
     * A configuration for an external identity provider.
     */
    export interface Schema$WorkforcePoolProvider {
        /**
         * Optional. A [Common Expression Language](https://opensource.google/projects/cel) expression, in plain text, to restrict what otherwise valid authentication credentials issued by the provider should not be accepted. The expression must output a boolean representing whether to allow the federation. The following keywords may be referenced in the expressions: * `assertion`: JSON representing the authentication credential issued by the provider. * `google`: The Google attributes mapped from the assertion in the `attribute_mappings`. `google.profile_photo`, `google.display_name` and `google.posix_username` are not supported. * `attribute`: The custom attributes mapped from the assertion in the `attribute_mappings`. The maximum length of the attribute condition expression is 4096 characters. If unspecified, all valid authentication credentials will be accepted. The following example shows how to only allow credentials with a mapped `google.groups` value of `admins`: ``` "'admins' in google.groups" ```
         */
        attributeCondition?: string | null;
        /**
         * Required. Maps attributes from the authentication credentials issued by an external identity provider to Google Cloud attributes, such as `subject` and `segment`. Each key must be a string specifying the Google Cloud IAM attribute to map to. The following keys are supported: * `google.subject`: The principal IAM is authenticating. You can reference this value in IAM bindings. This is also the subject that appears in Cloud Logging logs. This is a required field and the mapped subject cannot exceed 127 bytes. * `google.groups`: Groups the authenticating user belongs to. You can grant groups access to resources using an IAM `principalSet` binding; access applies to all members of the group. * `google.display_name`: The name of the authenticated user. This is an optional field and the mapped display name cannot exceed 100 bytes. If not set, `google.subject` will be displayed instead. This attribute cannot be referenced in IAM bindings. * `google.profile_photo`: The URL that specifies the authenticated user's thumbnail photo. This is an optional field. When set, the image will be visible as the user's profile picture. If not set, a generic user icon will be displayed instead. This attribute cannot be referenced in IAM bindings. * `google.posix_username`: The Linux username used by OS Login. This is an optional field and the mapped POSIX username cannot exceed 32 characters, The key must match the regex "^a-zA-Z0-9._{0,31\}$". This attribute cannot be referenced in IAM bindings. You can also provide custom attributes by specifying `attribute.{custom_attribute\}`, where {custom_attribute\} is the name of the custom attribute to be mapped. You can define a maximum of 50 custom attributes. The maximum length of a mapped attribute key is 100 characters, and the key may only contain the characters [a-z0-9_]. You can reference these attributes in IAM policies to define fine-grained access for a workforce pool to Google Cloud resources. For example: * `google.subject`: `principal://iam.googleapis.com/locations/global/workforcePools/{pool\}/subject/{value\}` * `google.groups`: `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool\}/group/{value\}` * `attribute.{custom_attribute\}`: `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool\}/attribute.{custom_attribute\}/{value\}` Each value must be a [Common Expression Language] (https://opensource.google/projects/cel) function that maps an identity provider credential to the normalized attribute specified by the corresponding map key. You can use the `assertion` keyword in the expression to access a JSON representation of the authentication credential issued by the provider. The maximum length of an attribute mapping expression is 2048 characters. When evaluated, the total size of all mapped attributes must not exceed 4KB. For OIDC providers, you must supply a custom mapping that includes the `google.subject` attribute. For example, the following maps the `sub` claim of the incoming credential to the `subject` attribute on a Google token: ``` {"google.subject": "assertion.sub"\} ```
         */
        attributeMapping?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. A user-specified description of the provider. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Optional. If true, populates additional debug information in Cloud Audit Logs for this provider. Logged attribute mappings and values can be found in `sts.googleapis.com` data access logs. Default value is false.
         */
        detailedAuditLogging?: boolean | null;
        /**
         * Optional. Disables the workforce pool provider. You cannot use a disabled provider to exchange tokens. However, existing tokens still grant access.
         */
        disabled?: boolean | null;
        /**
         * Optional. A user-specified display name for the provider. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Time after which the workload pool provider will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Optional. The configuration for OAuth 2.0 client used to get the additional user attributes. This should be used when users can't get the desired claims in authentication credentials. Currently this configuration is only supported with OIDC protocol.
         */
        extraAttributesOauth2Client?: Schema$GoogleIamAdminV1WorkforcePoolProviderExtraAttributesOAuth2Client;
        /**
         * Identifier. The resource name of the provider. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        name?: string | null;
        /**
         * An OpenId Connect 1.0 identity provider configuration.
         */
        oidc?: Schema$GoogleIamAdminV1WorkforcePoolProviderOidc;
        /**
         * A SAML identity provider configuration.
         */
        saml?: Schema$GoogleIamAdminV1WorkforcePoolProviderSaml;
        /**
         * Output only. The state of the provider.
         */
        state?: string | null;
    }
    /**
     * Represents a public key configuration for a Workforce Pool Provider. The key can be configured in your identity provider to encrypt SAML assertions. Google holds the corresponding private key, which it uses to decrypt encrypted tokens.
     */
    export interface Schema$WorkforcePoolProviderKey {
        /**
         * Output only. The time after which the key will be permanently deleted and cannot be recovered. Note that the key may get purged before this time if the total limit of keys per provider is exceeded.
         */
        expireTime?: string | null;
        /**
         * Immutable. Public half of the asymmetric key.
         */
        keyData?: Schema$KeyData;
        /**
         * Identifier. The resource name of the key. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}/keys/{key_id\}`
         */
        name?: string | null;
        /**
         * Output only. The state of the key.
         */
        state?: string | null;
        /**
         * Required. The purpose of the key.
         */
        use?: string | null;
    }
    /**
     * Represents a collection of workload identities. You can define IAM policies to grant these identities access to Google Cloud resources.
     */
    export interface Schema$WorkloadIdentityPool {
        /**
         * Optional. A description of the pool. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Optional. Whether the pool is disabled. You cannot use a disabled pool to exchange tokens, or use existing tokens to access resources. If the pool is re-enabled, existing tokens grant access again.
         */
        disabled?: boolean | null;
        /**
         * Optional. A display name for the pool. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Time after which the workload identity pool will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Optional. Defines the Certificate Authority (CA) pool resources and configurations required for issuance and rotation of mTLS workload certificates.
         */
        inlineCertificateIssuanceConfig?: Schema$InlineCertificateIssuanceConfig;
        /**
         * Optional. Represents config to add additional trusted trust domains.
         */
        inlineTrustConfig?: Schema$InlineTrustConfig;
        /**
         * Immutable. The mode the pool is operating in.
         */
        mode?: string | null;
        /**
         * Output only. The resource name of the pool.
         */
        name?: string | null;
        /**
         * Output only. The state of the pool.
         */
        state?: string | null;
    }
    /**
     * Represents a managed identity for a workload identity pool namespace.
     */
    export interface Schema$WorkloadIdentityPoolManagedIdentity {
        /**
         * A description of the managed identity. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Whether the managed identity is disabled. If disabled, credentials may no longer be issued for the identity, however existing credentials will still be accepted until they expire.
         */
        disabled?: boolean | null;
        /**
         * Output only. Time after which the managed identity will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Output only. The resource name of the managed identity.
         */
        name?: string | null;
        /**
         * Output only. The state of the managed identity.
         */
        state?: string | null;
    }
    /**
     * Represents a namespace for a workload identity pool. Namespaces are used to segment identities within the pool.
     */
    export interface Schema$WorkloadIdentityPoolNamespace {
        /**
         * A description of the namespace. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Whether the namespace is disabled. If disabled, credentials may no longer be issued for identities within this namespace, however existing credentials will still be accepted until they expire.
         */
        disabled?: boolean | null;
        /**
         * Output only. Time after which the namespace will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Output only. The resource name of the namespace.
         */
        name?: string | null;
        /**
         * Output only. The Google Cloud service that owns this namespace.
         */
        ownerService?: Schema$OwnerService;
        /**
         * Output only. The state of the namespace.
         */
        state?: string | null;
    }
    /**
     * Metadata for long-running WorkloadIdentityPool operations.
     */
    export interface Schema$WorkloadIdentityPoolOperationMetadata {
    }
    /**
     * A configuration for an external identity provider.
     */
    export interface Schema$WorkloadIdentityPoolProvider {
        /**
         * Optional. [A Common Expression Language](https://opensource.google/projects/cel) expression, in plain text, to restrict what otherwise valid authentication credentials issued by the provider should not be accepted. The expression must output a boolean representing whether to allow the federation. The following keywords may be referenced in the expressions: * `assertion`: JSON representing the authentication credential issued by the provider. * `google`: The Google attributes mapped from the assertion in the `attribute_mappings`. * `attribute`: The custom attributes mapped from the assertion in the `attribute_mappings`. The maximum length of the attribute condition expression is 4096 characters. If unspecified, all valid authentication credential are accepted. The following example shows how to only allow credentials with a mapped `google.groups` value of `admins`: ``` "'admins' in google.groups" ```
         */
        attributeCondition?: string | null;
        /**
         * Optional. Maps attributes from authentication credentials issued by an external identity provider to Google Cloud attributes, such as `subject` and `segment`. Each key must be a string specifying the Google Cloud IAM attribute to map to. The following keys are supported: * `google.subject`: The principal IAM is authenticating. You can reference this value in IAM bindings. This is also the subject that appears in Cloud Logging logs. Cannot exceed 127 bytes. * `google.groups`: Groups the external identity belongs to. You can grant groups access to resources using an IAM `principalSet` binding; access applies to all members of the group. You can also provide custom attributes by specifying `attribute.{custom_attribute\}`, where `{custom_attribute\}` is the name of the custom attribute to be mapped. You can define a maximum of 50 custom attributes. The maximum length of a mapped attribute key is 100 characters, and the key may only contain the characters [a-z0-9_]. You can reference these attributes in IAM policies to define fine-grained access for a workload to Google Cloud resources. For example: * `google.subject`: `principal://iam.googleapis.com/projects/{project\}/locations/{location\}/workloadIdentityPools/{pool\}/subject/{value\}` * `google.groups`: `principalSet://iam.googleapis.com/projects/{project\}/locations/{location\}/workloadIdentityPools/{pool\}/group/{value\}` * `attribute.{custom_attribute\}`: `principalSet://iam.googleapis.com/projects/{project\}/locations/{location\}/workloadIdentityPools/{pool\}/attribute.{custom_attribute\}/{value\}` Each value must be a [Common Expression Language] (https://opensource.google/projects/cel) function that maps an identity provider credential to the normalized attribute specified by the corresponding map key. You can use the `assertion` keyword in the expression to access a JSON representation of the authentication credential issued by the provider. The maximum length of an attribute mapping expression is 2048 characters. When evaluated, the total size of all mapped attributes must not exceed 8KB. For AWS providers, if no attribute mapping is defined, the following default mapping applies: ``` { "google.subject":"assertion.arn", "attribute.aws_role": "assertion.arn.contains('assumed-role')" " ? assertion.arn.extract('{account_arn\}assumed-role/')" " + 'assumed-role/'" " + assertion.arn.extract('assumed-role/{role_name\}/')" " : assertion.arn", \} ``` If any custom attribute mappings are defined, they must include a mapping to the `google.subject` attribute. For OIDC providers, you must supply a custom mapping, which must include the `google.subject` attribute. For example, the following maps the `sub` claim of the incoming credential to the `subject` attribute on a Google token: ``` {"google.subject": "assertion.sub"\} ```
         */
        attributeMapping?: {
            [key: string]: string;
        } | null;
        /**
         * An Amazon Web Services identity provider.
         */
        aws?: Schema$Aws;
        /**
         * Optional. A description for the provider. Cannot exceed 256 characters.
         */
        description?: string | null;
        /**
         * Optional. Whether the provider is disabled. You cannot use a disabled provider to exchange tokens. However, existing tokens still grant access.
         */
        disabled?: boolean | null;
        /**
         * Optional. A display name for the provider. Cannot exceed 32 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Time after which the workload identity pool provider will be permanently purged and cannot be recovered.
         */
        expireTime?: string | null;
        /**
         * Output only. The resource name of the provider.
         */
        name?: string | null;
        /**
         * An OpenId Connect 1.0 identity provider.
         */
        oidc?: Schema$Oidc;
        /**
         * An SAML 2.0 identity provider.
         */
        saml?: Schema$Saml;
        /**
         * Output only. The state of the provider.
         */
        state?: string | null;
        /**
         * An X.509-type identity provider.
         */
        x509?: Schema$X509;
    }
    /**
     * Represents a public key configuration for your workload identity pool provider. The key can be configured in your identity provider to encrypt the SAML assertions. Google holds the corresponding private key which it uses to decrypt encrypted tokens.
     */
    export interface Schema$WorkloadIdentityPoolProviderKey {
        /**
         * Output only. Time after which the key will be permanently purged and cannot be recovered. Note that the key may get purged before this timestamp if the total limit of keys per provider is crossed.
         */
        expireTime?: string | null;
        /**
         * Immutable. Public half of the asymmetric key.
         */
        keyData?: Schema$KeyData;
        /**
         * Output only. The resource name of the key.
         */
        name?: string | null;
        /**
         * Output only. The state of the key.
         */
        state?: string | null;
        /**
         * Required. The purpose of the key.
         */
        use?: string | null;
    }
    /**
     * An X.509-type identity provider represents a CA. It is trusted to assert a client identity if the client has a certificate that chains up to this CA.
     */
    export interface Schema$X509 {
        /**
         * Required. A TrustStore. Use this trust store as a wrapper to config the trust anchor and optional intermediate cas to help build the trust chain for the incoming end entity certificate. Follow the X.509 guidelines to define those PEM encoded certs. Only one trust store is currently supported.
         */
        trustStore?: Schema$TrustStore;
    }
    export class Resource$Iampolicies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lints, or validates, an IAM policy. Currently checks the google.iam.v1.Binding.condition field, which contains a condition expression for a role binding. Successful calls to this method always return an HTTP `200 OK` status code, even if the linter detects an issue in the IAM policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lintPolicy(params: Params$Resource$Iampolicies$Lintpolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lintPolicy(params?: Params$Resource$Iampolicies$Lintpolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LintPolicyResponse>>;
        lintPolicy(params: Params$Resource$Iampolicies$Lintpolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lintPolicy(params: Params$Resource$Iampolicies$Lintpolicy, options: MethodOptions | BodyResponseCallback<Schema$LintPolicyResponse>, callback: BodyResponseCallback<Schema$LintPolicyResponse>): void;
        lintPolicy(params: Params$Resource$Iampolicies$Lintpolicy, callback: BodyResponseCallback<Schema$LintPolicyResponse>): void;
        lintPolicy(callback: BodyResponseCallback<Schema$LintPolicyResponse>): void;
        /**
         * Returns a list of services that allow you to opt into audit logs that are not generated by default. To learn more about audit logs, see the [Logging documentation](https://cloud.google.com/logging/docs/audit).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryAuditableServices(params: Params$Resource$Iampolicies$Queryauditableservices, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryAuditableServices(params?: Params$Resource$Iampolicies$Queryauditableservices, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$QueryAuditableServicesResponse>>;
        queryAuditableServices(params: Params$Resource$Iampolicies$Queryauditableservices, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryAuditableServices(params: Params$Resource$Iampolicies$Queryauditableservices, options: MethodOptions | BodyResponseCallback<Schema$QueryAuditableServicesResponse>, callback: BodyResponseCallback<Schema$QueryAuditableServicesResponse>): void;
        queryAuditableServices(params: Params$Resource$Iampolicies$Queryauditableservices, callback: BodyResponseCallback<Schema$QueryAuditableServicesResponse>): void;
        queryAuditableServices(callback: BodyResponseCallback<Schema$QueryAuditableServicesResponse>): void;
    }
    export interface Params$Resource$Iampolicies$Lintpolicy extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$LintPolicyRequest;
    }
    export interface Params$Resource$Iampolicies$Queryauditableservices extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryAuditableServicesRequest;
    }
    export class Resource$Locations {
        context: APIRequestContext;
        workforcePools: Resource$Locations$Workforcepools;
        constructor(context: APIRequestContext);
    }
    export class Resource$Locations$Workforcepools {
        context: APIRequestContext;
        operations: Resource$Locations$Workforcepools$Operations;
        providers: Resource$Locations$Workforcepools$Providers;
        subjects: Resource$Locations$Workforcepools$Subjects;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkforcePool. You cannot reuse the name of a deleted pool until 30 days after deletion.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Workforcepools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Workforcepools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Locations$Workforcepools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Workforcepools$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Locations$Workforcepools$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkforcePool. You cannot use a deleted WorkforcePool to exchange external credentials for Google Cloud credentials. However, deletion does not revoke credentials that have already been issued. Credentials issued for a deleted pool do not grant access to resources. If the pool is undeleted, and the credentials are not expired, they grant access again. You can undelete a pool for 30 days. After 30 days, deletion is permanent. You cannot update deleted pools. However, you can view and list them.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Workforcepools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Workforcepools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Workforcepools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkforcePool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Workforcepools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkforcePool>>;
        get(params: Params$Resource$Locations$Workforcepools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkforcePool>, callback: BodyResponseCallback<Schema$WorkforcePool>): void;
        get(params: Params$Resource$Locations$Workforcepools$Get, callback: BodyResponseCallback<Schema$WorkforcePool>): void;
        get(callback: BodyResponseCallback<Schema$WorkforcePool>): void;
        /**
         * Gets IAM policies on a WorkforcePool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Locations$Workforcepools$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Locations$Workforcepools$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Locations$Workforcepools$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Locations$Workforcepools$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Locations$Workforcepools$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists all non-deleted WorkforcePools under the specified parent. If `show_deleted` is set to `true`, then deleted pools are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Workforcepools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Workforcepools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkforcePoolsResponse>>;
        list(params: Params$Resource$Locations$Workforcepools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Workforcepools$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkforcePoolsResponse>, callback: BodyResponseCallback<Schema$ListWorkforcePoolsResponse>): void;
        list(params: Params$Resource$Locations$Workforcepools$List, callback: BodyResponseCallback<Schema$ListWorkforcePoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkforcePoolsResponse>): void;
        /**
         * Updates an existing WorkforcePool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Locations$Workforcepools$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Locations$Workforcepools$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Locations$Workforcepools$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Locations$Workforcepools$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Locations$Workforcepools$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets IAM policies on a WorkforcePool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Locations$Workforcepools$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Locations$Workforcepools$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Locations$Workforcepools$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Locations$Workforcepools$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Locations$Workforcepools$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the caller's permissions on the WorkforcePool. If the pool doesn't exist, this call returns an empty set of permissions. It doesn't return a `NOT_FOUND` error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Locations$Workforcepools$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Locations$Workforcepools$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Locations$Workforcepools$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Locations$Workforcepools$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Locations$Workforcepools$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Undeletes a WorkforcePool, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Locations$Workforcepools$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Locations$Workforcepools$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Locations$Workforcepools$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Create extends StandardParameters {
        /**
         * Optional. The location of the pool to create. Format: `locations/{location\}`.
         */
        location?: string;
        /**
         * Optional. The ID to use for the pool, which becomes the final component of the resource name. The IDs must be a globally unique string of 6 to 63 lowercase letters, digits, or hyphens. It must start with a letter, and cannot have a trailing hyphen. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        workforcePoolId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkforcePool;
    }
    export interface Params$Resource$Locations$Workforcepools$Delete extends StandardParameters {
        /**
         * Required. The name of the pool to delete. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Get extends StandardParameters {
        /**
         * Required. The name of the pool to retrieve. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Locations$Workforcepools$List extends StandardParameters {
        /**
         * The location of the pool. Format: `locations/{location\}`.
         */
        location?: string;
        /**
         * The maximum number of pools to return. If unspecified, at most 50 pools will be returned. The maximum value is 1000; values above 1000 are truncated to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkforcePools` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent resource to list pools for. Format: `organizations/{org-id\}`.
         */
        parent?: string;
        /**
         * Whether to return soft-deleted pools.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Locations$Workforcepools$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the pool. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkforcePool;
    }
    export interface Params$Resource$Locations$Workforcepools$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Locations$Workforcepools$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Locations$Workforcepools$Undelete extends StandardParameters {
        /**
         * Required. The name of the pool to undelete. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkforcePoolRequest;
    }
    export class Resource$Locations$Workforcepools$Operations {
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
        get(params: Params$Resource$Locations$Workforcepools$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Locations$Workforcepools$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Locations$Workforcepools$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Locations$Workforcepools$Providers {
        context: APIRequestContext;
        keys: Resource$Locations$Workforcepools$Providers$Keys;
        operations: Resource$Locations$Workforcepools$Providers$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkforcePoolProvider in a WorkforcePool. You cannot reuse the name of a deleted provider until 30 days after deletion.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Workforcepools$Providers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Workforcepools$Providers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkforcePoolProvider. Deleting a provider does not revoke credentials that have already been issued; they continue to grant access. You can undelete a provider for 30 days. After 30 days, deletion is permanent. You cannot update deleted providers. However, you can view and list them.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Workforcepools$Providers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkforcePoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Workforcepools$Providers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Providers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkforcePoolProvider>>;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkforcePoolProvider>, callback: BodyResponseCallback<Schema$WorkforcePoolProvider>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Get, callback: BodyResponseCallback<Schema$WorkforcePoolProvider>): void;
        get(callback: BodyResponseCallback<Schema$WorkforcePoolProvider>): void;
        /**
         * Lists all non-deleted WorkforcePoolProviders in a WorkforcePool. If `show_deleted` is set to `true`, then deleted providers are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Workforcepools$Providers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Workforcepools$Providers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkforcePoolProvidersResponse>>;
        list(params: Params$Resource$Locations$Workforcepools$Providers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Workforcepools$Providers$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkforcePoolProvidersResponse>, callback: BodyResponseCallback<Schema$ListWorkforcePoolProvidersResponse>): void;
        list(params: Params$Resource$Locations$Workforcepools$Providers$List, callback: BodyResponseCallback<Schema$ListWorkforcePoolProvidersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkforcePoolProvidersResponse>): void;
        /**
         * Updates an existing WorkforcePoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Locations$Workforcepools$Providers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Locations$Workforcepools$Providers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Locations$Workforcepools$Providers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Locations$Workforcepools$Providers$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Locations$Workforcepools$Providers$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Undeletes a WorkforcePoolProvider, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Locations$Workforcepools$Providers$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Create extends StandardParameters {
        /**
         * Required. The pool to create this provider in. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        parent?: string;
        /**
         * Required. The ID for the provider, which becomes the final component of the resource name. This value must be 4-32 characters, and may contain the characters [a-z0-9-]. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        workforcePoolProviderId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkforcePoolProvider;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Delete extends StandardParameters {
        /**
         * Required. The name of the provider to delete. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Get extends StandardParameters {
        /**
         * Required. The name of the provider to retrieve. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$List extends StandardParameters {
        /**
         * The maximum number of providers to return. If unspecified, at most 50 providers are returned. The maximum value is 100; values above 100 are truncated to 100.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkforcePoolProviders` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The pool to list providers for. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}`
         */
        parent?: string;
        /**
         * Whether to return soft-deleted providers.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the provider. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkforcePoolProvider;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Undelete extends StandardParameters {
        /**
         * Required. The name of the provider to undelete. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkforcePoolProviderRequest;
    }
    export class Resource$Locations$Workforcepools$Providers$Keys {
        context: APIRequestContext;
        operations: Resource$Locations$Workforcepools$Providers$Keys$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkforcePoolProviderKey in a WorkforcePoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkforcePoolProviderKey. You can undelete a key for 30 days. After 30 days, deletion is permanent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a WorkforcePoolProviderKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkforcePoolProviderKey>>;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkforcePoolProviderKey>, callback: BodyResponseCallback<Schema$WorkforcePoolProviderKey>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Get, callback: BodyResponseCallback<Schema$WorkforcePoolProviderKey>): void;
        get(callback: BodyResponseCallback<Schema$WorkforcePoolProviderKey>): void;
        /**
         * Lists all non-deleted WorkforcePoolProviderKeys in a WorkforcePoolProvider. If `show_deleted` is set to `true`, then deleted keys are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Workforcepools$Providers$Keys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkforcePoolProviderKeysResponse>>;
        list(params: Params$Resource$Locations$Workforcepools$Providers$Keys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Workforcepools$Providers$Keys$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkforcePoolProviderKeysResponse>, callback: BodyResponseCallback<Schema$ListWorkforcePoolProviderKeysResponse>): void;
        list(params: Params$Resource$Locations$Workforcepools$Providers$Keys$List, callback: BodyResponseCallback<Schema$ListWorkforcePoolProviderKeysResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkforcePoolProviderKeysResponse>): void;
        /**
         * Undeletes a WorkforcePoolProviderKey, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$Create extends StandardParameters {
        /**
         * Required. The provider to create this key in.
         */
        parent?: string;
        /**
         * Required. The ID to use for the key, which becomes the final component of the resource name. This value must be 4-32 characters, and may contain the characters [a-z0-9-].
         */
        workforcePoolProviderKeyId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkforcePoolProviderKey;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$Delete extends StandardParameters {
        /**
         * Required. The name of the key to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$Get extends StandardParameters {
        /**
         * Required. The name of the key to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$List extends StandardParameters {
        /**
         * The maximum number of keys to return. If unspecified, all keys are returned. The maximum value is 10; values above 10 are truncated to 10.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkforcePoolProviderKeys` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The provider resource to list encryption keys for. Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/providers/{provider_id\}`
         */
        parent?: string;
        /**
         * Whether to return soft-deleted keys.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$Undelete extends StandardParameters {
        /**
         * Required. The name of the key to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkforcePoolProviderKeyRequest;
    }
    export class Resource$Locations$Workforcepools$Providers$Keys$Operations {
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
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Keys$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Locations$Workforcepools$Providers$Operations {
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
        get(params: Params$Resource$Locations$Workforcepools$Providers$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Providers$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Locations$Workforcepools$Providers$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Providers$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Locations$Workforcepools$Subjects {
        context: APIRequestContext;
        operations: Resource$Locations$Workforcepools$Subjects$Operations;
        constructor(context: APIRequestContext);
        /**
         * Deletes a WorkforcePoolSubject. Subject must not already be in a deleted state. A WorkforcePoolSubject is automatically created the first time an external credential is exchanged for a Google Cloud credential using a mapped `google.subject` attribute. There is no endpoint to manually create a WorkforcePoolSubject. For 30 days after a WorkforcePoolSubject is deleted, using the same `google.subject` attribute in token exchanges with Google Cloud STS fails. Call UndeleteWorkforcePoolSubject to undelete a WorkforcePoolSubject that has been deleted, within within 30 days of deleting it. After 30 days, the WorkforcePoolSubject is permanently deleted. At this point, a token exchange with Google Cloud STS that uses the same mapped `google.subject` attribute automatically creates a new WorkforcePoolSubject that is unrelated to the previously deleted WorkforcePoolSubject but has the same `google.subject` value.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Workforcepools$Subjects$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Workforcepools$Subjects$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Workforcepools$Subjects$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Subjects$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Workforcepools$Subjects$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Undeletes a WorkforcePoolSubject, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Locations$Workforcepools$Subjects$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Locations$Workforcepools$Subjects$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Locations$Workforcepools$Subjects$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Subjects$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Locations$Workforcepools$Subjects$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Subjects$Delete extends StandardParameters {
        /**
         * Required. The resource name of the WorkforcePoolSubject. Special characters, like `/` and `:`, must be escaped, because all URLs need to conform to the "When to Escape and Unescape" section of [RFC3986](https://www.ietf.org/rfc/rfc2396.txt). Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/subjects/{subject_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Workforcepools$Subjects$Undelete extends StandardParameters {
        /**
         * Required. The resource name of the WorkforcePoolSubject. Special characters, like `/` and `:`, must be escaped, because all URLs need to conform to the "When to Escape and Unescape" section of [RFC3986](https://www.ietf.org/rfc/rfc2396.txt). Format: `locations/{location\}/workforcePools/{workforce_pool_id\}/subjects/{subject_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkforcePoolSubjectRequest;
    }
    export class Resource$Locations$Workforcepools$Subjects$Operations {
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
        get(params: Params$Resource$Locations$Workforcepools$Subjects$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Workforcepools$Subjects$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Locations$Workforcepools$Subjects$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Workforcepools$Subjects$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Locations$Workforcepools$Subjects$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Workforcepools$Subjects$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        roles: Resource$Organizations$Roles;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Roles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Roles$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Roles$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        create(params: Params$Resource$Organizations$Roles$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Roles$Create, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        create(params: Params$Resource$Organizations$Roles$Create, callback: BodyResponseCallback<Schema$Role>): void;
        create(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Deletes a custom Role. When you delete a custom role, the following changes occur immediately: * You cannot bind a principal to the custom role in an IAM Policy. * Existing bindings to the custom role are not changed, but they have no effect. * By default, the response from ListRoles does not include the custom role. A deleted custom role still counts toward the [custom role limit](https://cloud.google.com/iam/help/limits) until it is permanently deleted. You have 7 days to undelete the custom role. After 7 days, the following changes occur: * The custom role is permanently deleted and cannot be recovered. * If an IAM policy contains a binding to the custom role, the binding is permanently removed. * The custom role no longer counts toward your custom role limit.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Roles$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Roles$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        delete(params: Params$Resource$Organizations$Roles$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Roles$Delete, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        delete(params: Params$Resource$Organizations$Roles$Delete, callback: BodyResponseCallback<Schema$Role>): void;
        delete(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Gets the definition of a Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Roles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Roles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        get(params: Params$Resource$Organizations$Roles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Roles$Get, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        get(params: Params$Resource$Organizations$Roles$Get, callback: BodyResponseCallback<Schema$Role>): void;
        get(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Lists every predefined Role that IAM supports, or every custom role that is defined for an organization or project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Roles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Roles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRolesResponse>>;
        list(params: Params$Resource$Organizations$Roles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Roles$List, options: MethodOptions | BodyResponseCallback<Schema$ListRolesResponse>, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(params: Params$Resource$Organizations$Roles$List, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        /**
         * Updates the definition of a custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Roles$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Roles$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        patch(params: Params$Resource$Organizations$Roles$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Roles$Patch, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        patch(params: Params$Resource$Organizations$Roles$Patch, callback: BodyResponseCallback<Schema$Role>): void;
        patch(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Undeletes a custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Organizations$Roles$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Organizations$Roles$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        undelete(params: Params$Resource$Organizations$Roles$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Organizations$Roles$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        undelete(params: Params$Resource$Organizations$Roles$Undelete, callback: BodyResponseCallback<Schema$Role>): void;
        undelete(callback: BodyResponseCallback<Schema$Role>): void;
    }
    export interface Params$Resource$Organizations$Roles$Create extends StandardParameters {
        /**
         * The `parent` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below: * [projects.roles.create](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/create): `projects/{PROJECT_ID\}`. This method creates project-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles` * [organizations.roles.create](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/create): `organizations/{ORGANIZATION_ID\}`. This method creates organization-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateRoleRequest;
    }
    export interface Params$Resource$Organizations$Roles$Delete extends StandardParameters {
        /**
         * Used to perform a consistent read-modify-write.
         */
        etag?: string;
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.delete](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/delete): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method deletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.delete](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/delete): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method deletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Roles$Get extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/roles/get): `roles/{ROLE_NAME\}`. This method returns results from all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles/{ROLE_NAME\}` * [projects.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/get): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/get): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Roles$List extends StandardParameters {
        /**
         * Optional limit on the number of roles to include in the response. The default is 300, and the maximum is 1,000.
         */
        pageSize?: number;
        /**
         * Optional pagination token returned in an earlier ListRolesResponse.
         */
        pageToken?: string;
        /**
         * The `parent` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below: * [roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/roles/list): An empty string. This method doesn't require a resource; it simply returns all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles` * [projects.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/list): `projects/{PROJECT_ID\}`. This method lists all project-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles` * [organizations.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/list): `organizations/{ORGANIZATION_ID\}`. This method lists all organization-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        parent?: string;
        /**
         * Include Roles that have been deleted.
         */
        showDeleted?: boolean;
        /**
         * Optional view for the returned Role objects. When `FULL` is specified, the `includedPermissions` field is returned, which includes a list of all permissions in the role. The default value is `BASIC`, which does not return the `includedPermissions` field.
         */
        view?: string;
    }
    export interface Params$Resource$Organizations$Roles$Patch extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.patch](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/patch): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method updates only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.patch](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/patch): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method updates only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
        /**
         * A mask describing which fields in the Role have changed.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Role;
    }
    export interface Params$Resource$Organizations$Roles$Undelete extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.undelete](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/undelete): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method undeletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.undelete](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/undelete): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method undeletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteRoleRequest;
    }
    export class Resource$Permissions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists every permission that you can test on a resource. A permission is testable if you can check whether a principal has that permission on the resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryTestablePermissions(params: Params$Resource$Permissions$Querytestablepermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryTestablePermissions(params?: Params$Resource$Permissions$Querytestablepermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$QueryTestablePermissionsResponse>>;
        queryTestablePermissions(params: Params$Resource$Permissions$Querytestablepermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryTestablePermissions(params: Params$Resource$Permissions$Querytestablepermissions, options: MethodOptions | BodyResponseCallback<Schema$QueryTestablePermissionsResponse>, callback: BodyResponseCallback<Schema$QueryTestablePermissionsResponse>): void;
        queryTestablePermissions(params: Params$Resource$Permissions$Querytestablepermissions, callback: BodyResponseCallback<Schema$QueryTestablePermissionsResponse>): void;
        queryTestablePermissions(callback: BodyResponseCallback<Schema$QueryTestablePermissionsResponse>): void;
    }
    export interface Params$Resource$Permissions$Querytestablepermissions extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryTestablePermissionsRequest;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        roles: Resource$Projects$Roles;
        serviceAccounts: Resource$Projects$Serviceaccounts;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        oauthClients: Resource$Projects$Locations$Oauthclients;
        workloadIdentityPools: Resource$Projects$Locations$Workloadidentitypools;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Oauthclients {
        context: APIRequestContext;
        credentials: Resource$Projects$Locations$Oauthclients$Credentials;
        constructor(context: APIRequestContext);
        /**
         * Creates a new OauthClient. You cannot reuse the name of a deleted OauthClient until 30 days after deletion.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Oauthclients$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Oauthclients$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClient>>;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Create, options: MethodOptions | BodyResponseCallback<Schema$OauthClient>, callback: BodyResponseCallback<Schema$OauthClient>): void;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Create, callback: BodyResponseCallback<Schema$OauthClient>): void;
        create(callback: BodyResponseCallback<Schema$OauthClient>): void;
        /**
         * Deletes an OauthClient. You cannot use a deleted OauthClient. However, deletion does not revoke access tokens that have already been issued. They continue to grant access. Deletion does revoke refresh tokens that have already been issued. They cannot be used to renew an access token. If the OauthClient is undeleted, and the refresh tokens are not expired, they are valid for token exchange again. You can undelete an OauthClient for 30 days. After 30 days, deletion is permanent. You cannot update deleted OauthClients. However, you can view and list them.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Oauthclients$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClient>>;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Delete, options: MethodOptions | BodyResponseCallback<Schema$OauthClient>, callback: BodyResponseCallback<Schema$OauthClient>): void;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Delete, callback: BodyResponseCallback<Schema$OauthClient>): void;
        delete(callback: BodyResponseCallback<Schema$OauthClient>): void;
        /**
         * Gets an individual OauthClient.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Oauthclients$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Oauthclients$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClient>>;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Get, options: MethodOptions | BodyResponseCallback<Schema$OauthClient>, callback: BodyResponseCallback<Schema$OauthClient>): void;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Get, callback: BodyResponseCallback<Schema$OauthClient>): void;
        get(callback: BodyResponseCallback<Schema$OauthClient>): void;
        /**
         * Lists all non-deleted OauthClients in a project. If `show_deleted` is set to `true`, then deleted OauthClients are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Oauthclients$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Oauthclients$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOauthClientsResponse>>;
        list(params: Params$Resource$Projects$Locations$Oauthclients$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Oauthclients$List, options: MethodOptions | BodyResponseCallback<Schema$ListOauthClientsResponse>, callback: BodyResponseCallback<Schema$ListOauthClientsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Oauthclients$List, callback: BodyResponseCallback<Schema$ListOauthClientsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOauthClientsResponse>): void;
        /**
         * Updates an existing OauthClient.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Oauthclients$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClient>>;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Patch, options: MethodOptions | BodyResponseCallback<Schema$OauthClient>, callback: BodyResponseCallback<Schema$OauthClient>): void;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Patch, callback: BodyResponseCallback<Schema$OauthClient>): void;
        patch(callback: BodyResponseCallback<Schema$OauthClient>): void;
        /**
         * Undeletes an OauthClient, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Oauthclients$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Oauthclients$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClient>>;
        undelete(params: Params$Resource$Projects$Locations$Oauthclients$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Oauthclients$Undelete, options: MethodOptions | BodyResponseCallback<Schema$OauthClient>, callback: BodyResponseCallback<Schema$OauthClient>): void;
        undelete(params: Params$Resource$Projects$Locations$Oauthclients$Undelete, callback: BodyResponseCallback<Schema$OauthClient>): void;
        undelete(callback: BodyResponseCallback<Schema$OauthClient>): void;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Create extends StandardParameters {
        /**
         * Required. The ID to use for the OauthClient, which becomes the final component of the resource name. This value should be a string of 6 to 63 lowercase letters, digits, or hyphens. It must start with a letter, and cannot have a trailing hyphen. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        oauthClientId?: string;
        /**
         * Required. The parent resource to create the OauthClient in. The only supported location is `global`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$OauthClient;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Delete extends StandardParameters {
        /**
         * Required. The name of the OauthClient to delete. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Get extends StandardParameters {
        /**
         * Required. The name of the OauthClient to retrieve. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$List extends StandardParameters {
        /**
         * Optional. The maximum number of OauthClients to return. If unspecified, at most 50 OauthClients will be returned. The maximum value is 100; values above 100 are truncated to 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListOauthClients` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent to list OauthClients for.
         */
        parent?: string;
        /**
         * Optional. Whether to return soft-deleted OauthClients.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Patch extends StandardParameters {
        /**
         * Immutable. Identifier. The resource name of the OauthClient. Format:`projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}`.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$OauthClient;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Undelete extends StandardParameters {
        /**
         * Required. The name of the OauthClient to undelete. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteOauthClientRequest;
    }
    export class Resource$Projects$Locations$Oauthclients$Credentials {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new OauthClientCredential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Oauthclients$Credentials$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClientCredential>>;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Create, options: MethodOptions | BodyResponseCallback<Schema$OauthClientCredential>, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        create(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Create, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        create(callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        /**
         * Deletes an OauthClientCredential. Before deleting an OauthClientCredential, it should first be disabled.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an individual OauthClientCredential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Oauthclients$Credentials$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClientCredential>>;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Get, options: MethodOptions | BodyResponseCallback<Schema$OauthClientCredential>, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        get(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Get, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        get(callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        /**
         * Lists all OauthClientCredentials in an OauthClient.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Oauthclients$Credentials$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOauthClientCredentialsResponse>>;
        list(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$List, options: MethodOptions | BodyResponseCallback<Schema$ListOauthClientCredentialsResponse>, callback: BodyResponseCallback<Schema$ListOauthClientCredentialsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$List, callback: BodyResponseCallback<Schema$ListOauthClientCredentialsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOauthClientCredentialsResponse>): void;
        /**
         * Updates an existing OauthClientCredential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OauthClientCredential>>;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch, options: MethodOptions | BodyResponseCallback<Schema$OauthClientCredential>, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        patch(params: Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch, callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
        patch(callback: BodyResponseCallback<Schema$OauthClientCredential>): void;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Credentials$Create extends StandardParameters {
        /**
         * Required. The ID to use for the OauthClientCredential, which becomes the final component of the resource name. This value should be 4-32 characters, and may contain the characters [a-z0-9-]. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        oauthClientCredentialId?: string;
        /**
         * Required. The parent resource to create the OauthClientCredential in.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$OauthClientCredential;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Credentials$Delete extends StandardParameters {
        /**
         * Required. The name of the OauthClientCredential to delete. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}/credentials/{credential\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Credentials$Get extends StandardParameters {
        /**
         * Required. The name of the OauthClientCredential to retrieve. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}/credentials/{credential\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Credentials$List extends StandardParameters {
        /**
         * Required. The parent to list OauthClientCredentials for.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Oauthclients$Credentials$Patch extends StandardParameters {
        /**
         * Immutable. Identifier. The resource name of the OauthClientCredential. Format: `projects/{project\}/locations/{location\}/oauthClients/{oauth_client\}/credentials/{credential\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$OauthClientCredential;
    }
    export class Resource$Projects$Locations$Workloadidentitypools {
        context: APIRequestContext;
        namespaces: Resource$Projects$Locations$Workloadidentitypools$Namespaces;
        operations: Resource$Projects$Locations$Workloadidentitypools$Operations;
        providers: Resource$Projects$Locations$Workloadidentitypools$Providers;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkloadIdentityPool. You cannot reuse the name of a deleted pool until 30 days after deletion.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkloadIdentityPool. You cannot use a deleted pool to exchange external credentials for Google Cloud credentials. However, deletion does not revoke credentials that have already been issued. Credentials issued for a deleted pool do not grant access to resources. If the pool is undeleted, and the credentials are not expired, they grant access again. You can undelete a pool for 30 days. After 30 days, deletion is permanent. You cannot update deleted pools. However, you can view and list them.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkloadIdentityPool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkloadIdentityPool>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkloadIdentityPool>, callback: BodyResponseCallback<Schema$WorkloadIdentityPool>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Get, callback: BodyResponseCallback<Schema$WorkloadIdentityPool>): void;
        get(callback: BodyResponseCallback<Schema$WorkloadIdentityPool>): void;
        /**
         * Gets the IAM policy of a WorkloadIdentityPool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists all non-deleted WorkloadIdentityPools in a project. If `show_deleted` is set to `true`, then deleted pools are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workloadidentitypools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkloadIdentityPoolsResponse>>;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkloadIdentityPoolsResponse>, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$List, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolsResponse>): void;
        /**
         * Updates an existing WorkloadIdentityPool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the IAM policies on a WorkloadIdentityPool
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the caller's permissions on a WorkloadIdentityPool
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Undeletes a WorkloadIdentityPool, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Create extends StandardParameters {
        /**
         * Required. The parent resource to create the pool in. The only supported location is `global`.
         */
        parent?: string;
        /**
         * Required. The ID to use for the pool, which becomes the final component of the resource name. This value should be 4-32 characters, and may contain the characters [a-z0-9-]. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        workloadIdentityPoolId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPool;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Delete extends StandardParameters {
        /**
         * Required. The name of the pool to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Get extends StandardParameters {
        /**
         * Required. The name of the pool to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$List extends StandardParameters {
        /**
         * The maximum number of pools to return. If unspecified, at most 50 pools are returned. The maximum value is 1000; values above are 1000 truncated to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkloadIdentityPools` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent resource to list pools for.
         */
        parent?: string;
        /**
         * Whether to return soft-deleted pools.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the pool.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPool;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Undelete extends StandardParameters {
        /**
         * Required. The name of the pool to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkloadIdentityPoolRequest;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces {
        context: APIRequestContext;
        managedIdentities: Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities;
        operations: Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkloadIdentityPoolNamespace in a WorkloadIdentityPool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkloadIdentityPoolNamespace. You can undelete a namespace for 30 days. After 30 days, deletion is permanent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkloadIdentityPoolNamespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkloadIdentityPoolNamespace>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkloadIdentityPoolNamespace>, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolNamespace>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolNamespace>): void;
        get(callback: BodyResponseCallback<Schema$WorkloadIdentityPoolNamespace>): void;
        /**
         * Lists all non-deleted WorkloadIdentityPoolNamespaces in a workload identity pool. If `show_deleted` is set to `true`, then deleted namespaces are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkloadIdentityPoolNamespacesResponse>>;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkloadIdentityPoolNamespacesResponse>, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolNamespacesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolNamespacesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolNamespacesResponse>): void;
        /**
         * Updates an existing WorkloadIdentityPoolNamespace in a WorkloadIdentityPool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Undeletes a WorkloadIdentityPoolNamespace, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Create extends StandardParameters {
        /**
         * Required. The parent resource to create the namespace in. The only supported location is `global`.
         */
        parent?: string;
        /**
         * Required. The ID to use for the namespace. This value must: * contain at most 63 characters * contain only lowercase alphanumeric characters or `-` * start with an alphanumeric character * end with an alphanumeric character The prefix "gcp-" will be reserved for future uses.
         */
        workloadIdentityPoolNamespaceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolNamespace;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Delete extends StandardParameters {
        /**
         * Required. The name of the namespace to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Get extends StandardParameters {
        /**
         * Required. The name of the namespace to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$List extends StandardParameters {
        /**
         * The maximum number of namespaces to return. If unspecified, at most 50 namespaces are returned. The maximum value is 1000; values above are 1000 truncated to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkloadIdentityPoolNamespaces` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent resource to list namespaces for.
         */
        parent?: string;
        /**
         * Whether to return soft-deleted namespaces.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the namespace.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolNamespace;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Undelete extends StandardParameters {
        /**
         * Required. The name of the namespace to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkloadIdentityPoolNamespaceRequest;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations;
        workloadSources: Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources;
        constructor(context: APIRequestContext);
        /**
         * Add an AttestationRule on a WorkloadIdentityPoolManagedIdentity. The total attestation rules after addition must not exceed 50.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        addAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addAttestationRule(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        addAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        addAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule, callback: BodyResponseCallback<Schema$Operation>): void;
        addAttestationRule(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a new WorkloadIdentityPoolManagedIdentity in a WorkloadIdentityPoolNamespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkloadIdentityPoolManagedIdentity. You can undelete a managed identity for 30 days. After 30 days, deletion is permanent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkloadIdentityPoolManagedIdentity.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkloadIdentityPoolManagedIdentity>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkloadIdentityPoolManagedIdentity>, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolManagedIdentity>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolManagedIdentity>): void;
        get(callback: BodyResponseCallback<Schema$WorkloadIdentityPoolManagedIdentity>): void;
        /**
         * Lists all non-deleted WorkloadIdentityPoolManagedIdentitys in a namespace. If `show_deleted` is set to `true`, then deleted managed identities are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse>>;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse>, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolManagedIdentitiesResponse>): void;
        /**
         * List all AttestationRule on a WorkloadIdentityPoolManagedIdentity.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listAttestationRules(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAttestationRulesResponse>>;
        listAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules, options: MethodOptions | BodyResponseCallback<Schema$ListAttestationRulesResponse>, callback: BodyResponseCallback<Schema$ListAttestationRulesResponse>): void;
        listAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules, callback: BodyResponseCallback<Schema$ListAttestationRulesResponse>): void;
        listAttestationRules(callback: BodyResponseCallback<Schema$ListAttestationRulesResponse>): void;
        /**
         * Updates an existing WorkloadIdentityPoolManagedIdentity in a WorkloadIdentityPoolNamespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Remove an AttestationRule on a WorkloadIdentityPoolManagedIdentity.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        removeAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        removeAttestationRule(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        removeAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        removeAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        removeAttestationRule(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule, callback: BodyResponseCallback<Schema$Operation>): void;
        removeAttestationRule(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Set all AttestationRule on a WorkloadIdentityPoolManagedIdentity. A maximum of 50 AttestationRules can be set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAttestationRules(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setAttestationRules(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules, callback: BodyResponseCallback<Schema$Operation>): void;
        setAttestationRules(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Undeletes a WorkloadIdentityPoolManagedIdentity, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Addattestationrule extends StandardParameters {
        /**
         * Required. The resource name of the managed identity or namespace resource to add an attestation rule to.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddAttestationRuleRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Create extends StandardParameters {
        /**
         * Required. The parent resource to create the manage identity in. The only supported location is `global`.
         */
        parent?: string;
        /**
         * Required. The ID to use for the managed identity. This value must: * contain at most 63 characters * contain only lowercase alphanumeric characters or `-` * start with an alphanumeric character * end with an alphanumeric character The prefix "gcp-" will be reserved for future uses.
         */
        workloadIdentityPoolManagedIdentityId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolManagedIdentity;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Delete extends StandardParameters {
        /**
         * Required. The name of the managed identity to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Get extends StandardParameters {
        /**
         * Required. The name of the managed identity to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$List extends StandardParameters {
        /**
         * The maximum number of managed identities to return. If unspecified, at most 50 managed identities are returned. The maximum value is 1000; values above are 1000 truncated to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkloadIdentityPoolManagedIdentities` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent resource to list managed identities for.
         */
        parent?: string;
        /**
         * Whether to return soft-deleted managed identities.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Listattestationrules extends StandardParameters {
        /**
         * Optional. A query filter. Supports the following function: * `container_ids()`: Returns only the AttestationRules under the specific container ids. The function expects a comma-delimited list with only project numbers and must use the format `projects/`. For example: `container_ids(projects/, projects/,...)`.
         */
        filter?: string;
        /**
         * Optional. The maximum number of AttestationRules to return. If unspecified, at most 50 AttestationRules are returned. The maximum value is 100; values above 100 are truncated to 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListWorkloadIdentityPoolProviderKeys` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the managed identity or namespace resource to list attestation rules of.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the managed identity.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolManagedIdentity;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Removeattestationrule extends StandardParameters {
        /**
         * Required. The resource name of the managed identity or namespace resource to remove an attestation rule from.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RemoveAttestationRuleRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Setattestationrules extends StandardParameters {
        /**
         * Required. The resource name of the managed identity or namespace resource to add an attestation rule to.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetAttestationRulesRequest;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Undelete extends StandardParameters {
        /**
         * Required. The name of the managed identity to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkloadIdentityPoolManagedIdentityRequest;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Managedidentities$Workloadsources$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Namespaces$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Providers {
        context: APIRequestContext;
        keys: Resource$Projects$Locations$Workloadidentitypools$Providers$Keys;
        operations: Resource$Projects$Locations$Workloadidentitypools$Providers$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new WorkloadIdentityPoolProvider in a WorkloadIdentityPool. You cannot reuse the name of a deleted provider until 30 days after deletion.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a WorkloadIdentityPoolProvider. Deleting a provider does not revoke credentials that have already been issued; they continue to grant access. You can undelete a provider for 30 days. After 30 days, deletion is permanent. You cannot update deleted providers. However, you can view and list them.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkloadIdentityPoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkloadIdentityPoolProvider>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkloadIdentityPoolProvider>, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProvider>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProvider>): void;
        get(callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProvider>): void;
        /**
         * Lists all non-deleted WorkloadIdentityPoolProviders in a WorkloadIdentityPool. If `show_deleted` is set to `true`, then deleted providers are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkloadIdentityPoolProvidersResponse>>;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkloadIdentityPoolProvidersResponse>, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProvidersResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProvidersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProvidersResponse>): void;
        /**
         * Updates an existing WorkloadIdentityPoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Undeletes a WorkloadIdentityPoolProvider, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Create extends StandardParameters {
        /**
         * Required. The pool to create this provider in.
         */
        parent?: string;
        /**
         * Required. The ID for the provider, which becomes the final component of the resource name. This value must be 4-32 characters, and may contain the characters [a-z0-9-]. The prefix `gcp-` is reserved for use by Google, and may not be specified.
         */
        workloadIdentityPoolProviderId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolProvider;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Delete extends StandardParameters {
        /**
         * Required. The name of the provider to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Get extends StandardParameters {
        /**
         * Required. The name of the provider to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$List extends StandardParameters {
        /**
         * The maximum number of providers to return. If unspecified, at most 50 providers are returned. The maximum value is 100; values above 100 are truncated to 100.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkloadIdentityPoolProviders` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The pool to list providers for.
         */
        parent?: string;
        /**
         * Whether to return soft-deleted providers.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the provider.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolProvider;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Undelete extends StandardParameters {
        /**
         * Required. The name of the provider to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkloadIdentityPoolProviderRequest;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Providers$Keys {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations;
        constructor(context: APIRequestContext);
        /**
         * Create a new WorkloadIdentityPoolProviderKey in a WorkloadIdentityPoolProvider.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes an WorkloadIdentityPoolProviderKey. You can undelete a key for 30 days. After 30 days, deletion is permanent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an individual WorkloadIdentityPoolProviderKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkloadIdentityPoolProviderKey>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkloadIdentityPoolProviderKey>, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProviderKey>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get, callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProviderKey>): void;
        get(callback: BodyResponseCallback<Schema$WorkloadIdentityPoolProviderKey>): void;
        /**
         * Lists all non-deleted WorkloadIdentityPoolProviderKeys in a project. If show_deleted is set to `true`, then deleted pools are also listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkloadIdentityPoolProviderKeysResponse>>;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkloadIdentityPoolProviderKeysResponse>, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProviderKeysResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List, callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProviderKeysResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkloadIdentityPoolProviderKeysResponse>): void;
        /**
         * Undeletes an WorkloadIdentityPoolProviderKey, as long as it was deleted fewer than 30 days ago.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete, callback: BodyResponseCallback<Schema$Operation>): void;
        undelete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Create extends StandardParameters {
        /**
         * Required. The parent provider resource to create the key in.
         */
        parent?: string;
        /**
         * Required. The ID to use for the key, which becomes the final component of the resource name. This value should be 4-32 characters, and may contain the characters [a-z0-9-].
         */
        workloadIdentityPoolProviderKeyId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkloadIdentityPoolProviderKey;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Delete extends StandardParameters {
        /**
         * Required. The name of the encryption key to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Get extends StandardParameters {
        /**
         * Required. The name of the key to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$List extends StandardParameters {
        /**
         * The maximum number of keys to return. If unspecified, all keys are returned. The maximum value is 10; values above 10 are truncated to 10.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListWorkloadIdentityPoolProviderKeys` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent provider resource to list encryption keys for.
         */
        parent?: string;
        /**
         * Whether to return soft deleted resources as well.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Undelete extends StandardParameters {
        /**
         * Required. The name of the encryption key to undelete.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteWorkloadIdentityPoolProviderKeyRequest;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Keys$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Workloadidentitypools$Providers$Operations {
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
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Workloadidentitypools$Providers$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Roles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Roles$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Roles$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        create(params: Params$Resource$Projects$Roles$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Roles$Create, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        create(params: Params$Resource$Projects$Roles$Create, callback: BodyResponseCallback<Schema$Role>): void;
        create(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Deletes a custom Role. When you delete a custom role, the following changes occur immediately: * You cannot bind a principal to the custom role in an IAM Policy. * Existing bindings to the custom role are not changed, but they have no effect. * By default, the response from ListRoles does not include the custom role. A deleted custom role still counts toward the [custom role limit](https://cloud.google.com/iam/help/limits) until it is permanently deleted. You have 7 days to undelete the custom role. After 7 days, the following changes occur: * The custom role is permanently deleted and cannot be recovered. * If an IAM policy contains a binding to the custom role, the binding is permanently removed. * The custom role no longer counts toward your custom role limit.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Roles$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Roles$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        delete(params: Params$Resource$Projects$Roles$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Roles$Delete, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        delete(params: Params$Resource$Projects$Roles$Delete, callback: BodyResponseCallback<Schema$Role>): void;
        delete(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Gets the definition of a Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Roles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Roles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        get(params: Params$Resource$Projects$Roles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Roles$Get, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        get(params: Params$Resource$Projects$Roles$Get, callback: BodyResponseCallback<Schema$Role>): void;
        get(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Lists every predefined Role that IAM supports, or every custom role that is defined for an organization or project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Roles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Roles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRolesResponse>>;
        list(params: Params$Resource$Projects$Roles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Roles$List, options: MethodOptions | BodyResponseCallback<Schema$ListRolesResponse>, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(params: Params$Resource$Projects$Roles$List, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        /**
         * Updates the definition of a custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Roles$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Roles$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        patch(params: Params$Resource$Projects$Roles$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Roles$Patch, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        patch(params: Params$Resource$Projects$Roles$Patch, callback: BodyResponseCallback<Schema$Role>): void;
        patch(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Undeletes a custom Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Roles$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Roles$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        undelete(params: Params$Resource$Projects$Roles$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Roles$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        undelete(params: Params$Resource$Projects$Roles$Undelete, callback: BodyResponseCallback<Schema$Role>): void;
        undelete(callback: BodyResponseCallback<Schema$Role>): void;
    }
    export interface Params$Resource$Projects$Roles$Create extends StandardParameters {
        /**
         * The `parent` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below: * [projects.roles.create](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/create): `projects/{PROJECT_ID\}`. This method creates project-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles` * [organizations.roles.create](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/create): `organizations/{ORGANIZATION_ID\}`. This method creates organization-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateRoleRequest;
    }
    export interface Params$Resource$Projects$Roles$Delete extends StandardParameters {
        /**
         * Used to perform a consistent read-modify-write.
         */
        etag?: string;
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.delete](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/delete): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method deletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.delete](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/delete): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method deletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Roles$Get extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/roles/get): `roles/{ROLE_NAME\}`. This method returns results from all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles/{ROLE_NAME\}` * [projects.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/get): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/get): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Roles$List extends StandardParameters {
        /**
         * Optional limit on the number of roles to include in the response. The default is 300, and the maximum is 1,000.
         */
        pageSize?: number;
        /**
         * Optional pagination token returned in an earlier ListRolesResponse.
         */
        pageToken?: string;
        /**
         * The `parent` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below: * [roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/roles/list): An empty string. This method doesn't require a resource; it simply returns all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles` * [projects.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/list): `projects/{PROJECT_ID\}`. This method lists all project-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles` * [organizations.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/list): `organizations/{ORGANIZATION_ID\}`. This method lists all organization-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        parent?: string;
        /**
         * Include Roles that have been deleted.
         */
        showDeleted?: boolean;
        /**
         * Optional view for the returned Role objects. When `FULL` is specified, the `includedPermissions` field is returned, which includes a list of all permissions in the role. The default value is `BASIC`, which does not return the `includedPermissions` field.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Roles$Patch extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.patch](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/patch): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method updates only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.patch](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/patch): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method updates only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
        /**
         * A mask describing which fields in the Role have changed.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Role;
    }
    export interface Params$Resource$Projects$Roles$Undelete extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles) or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [projects.roles.undelete](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/undelete): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method undeletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.undelete](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/undelete): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method undeletes only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteRoleRequest;
    }
    export class Resource$Projects$Serviceaccounts {
        context: APIRequestContext;
        keys: Resource$Projects$Serviceaccounts$Keys;
        constructor(context: APIRequestContext);
        /**
         * Creates a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Serviceaccounts$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Serviceaccounts$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccount>>;
        create(params: Params$Resource$Projects$Serviceaccounts$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Serviceaccounts$Create, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccount>, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        create(params: Params$Resource$Projects$Serviceaccounts$Create, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        create(callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        /**
         * Deletes a ServiceAccount. **Warning:** After you delete a service account, you might not be able to undelete it. If you know that you need to re-enable the service account in the future, use DisableServiceAccount instead. If you delete a service account, IAM permanently removes the service account 30 days later. Google Cloud cannot recover the service account after it is permanently removed, even if you file a support request. To help avoid unplanned outages, we recommend that you disable the service account before you delete it. Use DisableServiceAccount to disable the service account, then wait at least 24 hours and watch for unintended consequences. If there are no unintended consequences, you can delete the service account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Serviceaccounts$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Serviceaccounts$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Serviceaccounts$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Serviceaccounts$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Serviceaccounts$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Disables a ServiceAccount immediately. If an application uses the service account to authenticate, that application can no longer call Google APIs or access Google Cloud resources. Existing access tokens for the service account are rejected, and requests for new access tokens will fail. To re-enable the service account, use EnableServiceAccount. After you re-enable the service account, its existing access tokens will be accepted, and you can request new access tokens. To help avoid unplanned outages, we recommend that you disable the service account before you delete it. Use this method to disable the service account, then wait at least 24 hours and watch for unintended consequences. If there are no unintended consequences, you can delete the service account with DeleteServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        disable(params: Params$Resource$Projects$Serviceaccounts$Disable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        disable(params?: Params$Resource$Projects$Serviceaccounts$Disable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        disable(params: Params$Resource$Projects$Serviceaccounts$Disable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        disable(params: Params$Resource$Projects$Serviceaccounts$Disable, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        disable(params: Params$Resource$Projects$Serviceaccounts$Disable, callback: BodyResponseCallback<Schema$Empty>): void;
        disable(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Enables a ServiceAccount that was disabled by DisableServiceAccount. If the service account is already enabled, then this method has no effect. If the service account was disabled by other means—for example, if Google disabled the service account because it was compromised—you cannot use this method to enable the service account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enable(params: Params$Resource$Projects$Serviceaccounts$Enable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enable(params?: Params$Resource$Projects$Serviceaccounts$Enable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        enable(params: Params$Resource$Projects$Serviceaccounts$Enable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enable(params: Params$Resource$Projects$Serviceaccounts$Enable, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        enable(params: Params$Resource$Projects$Serviceaccounts$Enable, callback: BodyResponseCallback<Schema$Empty>): void;
        enable(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Serviceaccounts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Serviceaccounts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccount>>;
        get(params: Params$Resource$Projects$Serviceaccounts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Serviceaccounts$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccount>, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        get(params: Params$Resource$Projects$Serviceaccounts$Get, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        get(callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        /**
         * Gets the IAM policy that is attached to a ServiceAccount. This IAM policy specifies which principals have access to the service account. This method does not tell you whether the service account has been granted any roles on other resources. To check whether a service account has role grants on a resource, use the `getIamPolicy` method for that resource. For example, to view the role grants for a project, call the Resource Manager API's [projects.getIamPolicy](https://cloud.google.com/resource-manager/reference/rest/v1/projects/getIamPolicy) method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Serviceaccounts$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists every ServiceAccount that belongs to a specific project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Serviceaccounts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Serviceaccounts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceAccountsResponse>>;
        list(params: Params$Resource$Projects$Serviceaccounts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Serviceaccounts$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceAccountsResponse>, callback: BodyResponseCallback<Schema$ListServiceAccountsResponse>): void;
        list(params: Params$Resource$Projects$Serviceaccounts$List, callback: BodyResponseCallback<Schema$ListServiceAccountsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceAccountsResponse>): void;
        /**
         * Patches a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Serviceaccounts$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Serviceaccounts$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccount>>;
        patch(params: Params$Resource$Projects$Serviceaccounts$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Serviceaccounts$Patch, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccount>, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        patch(params: Params$Resource$Projects$Serviceaccounts$Patch, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        patch(callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        /**
         * Sets the IAM policy that is attached to a ServiceAccount. Use this method to grant or revoke access to the service account. For example, you could grant a principal the ability to impersonate the service account. This method does not enable the service account to access other resources. To grant roles to a service account on a resource, follow these steps: 1. Call the resource's `getIamPolicy` method to get its current IAM policy. 2. Edit the policy so that it binds the service account to an IAM role for the resource. 3. Call the resource's `setIamPolicy` method to update its IAM policy. For detailed instructions, see [Manage access to project, folders, and organizations](https://cloud.google.com/iam/help/service-accounts/granting-access-to-service-accounts) or [Manage access to other resources](https://cloud.google.com/iam/help/access/manage-other-resources).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Serviceaccounts$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Serviceaccounts$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         *  Signs a blob using the system-managed private key for a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        signBlob(params?: Params$Resource$Projects$Serviceaccounts$Signblob, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SignBlobResponse>>;
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, options: MethodOptions | BodyResponseCallback<Schema$SignBlobResponse>, callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        signBlob(callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        /**
         *  Signs a JSON Web Token (JWT) using the system-managed private key for a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        signJwt(params?: Params$Resource$Projects$Serviceaccounts$Signjwt, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SignJwtResponse>>;
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, options: MethodOptions | BodyResponseCallback<Schema$SignJwtResponse>, callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
        signJwt(callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
        /**
         * Tests whether the caller has the specified permissions on a ServiceAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Serviceaccounts$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Serviceaccounts$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Serviceaccounts$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Serviceaccounts$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Serviceaccounts$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Restores a deleted ServiceAccount. **Important:** It is not always possible to restore a deleted service account. Use this method only as a last resort. After you delete a service account, IAM permanently removes the service account 30 days later. There is no way to restore a deleted service account that has been permanently removed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Serviceaccounts$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Serviceaccounts$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UndeleteServiceAccountResponse>>;
        undelete(params: Params$Resource$Projects$Serviceaccounts$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Serviceaccounts$Undelete, options: MethodOptions | BodyResponseCallback<Schema$UndeleteServiceAccountResponse>, callback: BodyResponseCallback<Schema$UndeleteServiceAccountResponse>): void;
        undelete(params: Params$Resource$Projects$Serviceaccounts$Undelete, callback: BodyResponseCallback<Schema$UndeleteServiceAccountResponse>): void;
        undelete(callback: BodyResponseCallback<Schema$UndeleteServiceAccountResponse>): void;
        /**
         * **Note:** We are in the process of deprecating this method. Use PatchServiceAccount instead. Updates a ServiceAccount. You can update only the `display_name` field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Serviceaccounts$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Serviceaccounts$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccount>>;
        update(params: Params$Resource$Projects$Serviceaccounts$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Serviceaccounts$Update, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccount>, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        update(params: Params$Resource$Projects$Serviceaccounts$Update, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        update(callback: BodyResponseCallback<Schema$ServiceAccount>): void;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Create extends StandardParameters {
        /**
         * Required. The resource name of the project associated with the service accounts, such as `projects/my-project-123`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateServiceAccountRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Delete extends StandardParameters {
        /**
         * Required. The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Disable extends StandardParameters {
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DisableServiceAccountRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Enable extends StandardParameters {
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnableServiceAccountRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Get extends StandardParameters {
        /**
         * Required. The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$List extends StandardParameters {
        /**
         * Required. The resource name of the project associated with the service accounts, such as `projects/my-project-123`.
         */
        name?: string;
        /**
         * Optional limit on the number of service accounts to include in the response. Further accounts can subsequently be obtained by including the ListServiceAccountsResponse.next_page_token in a subsequent request. The default is 20, and the maximum is 100.
         */
        pageSize?: number;
        /**
         * Optional pagination token returned in an earlier ListServiceAccountsResponse.next_page_token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Patch extends StandardParameters {
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PatchServiceAccountRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Signblob extends StandardParameters {
        /**
         * Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SignBlobRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Signjwt extends StandardParameters {
        /**
         * Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api). The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SignJwtRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Undelete extends StandardParameters {
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteServiceAccountRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Update extends StandardParameters {
        /**
         * The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceAccount;
    }
    export class Resource$Projects$Serviceaccounts$Keys {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a ServiceAccountKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Serviceaccounts$Keys$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Serviceaccounts$Keys$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccountKey>>;
        create(params: Params$Resource$Projects$Serviceaccounts$Keys$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Serviceaccounts$Keys$Create, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccountKey>, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        create(params: Params$Resource$Projects$Serviceaccounts$Keys$Create, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        create(callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        /**
         * Deletes a ServiceAccountKey. Deleting a service account key does not revoke short-lived credentials that have been issued based on the service account key.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Serviceaccounts$Keys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Serviceaccounts$Keys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Serviceaccounts$Keys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Serviceaccounts$Keys$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Serviceaccounts$Keys$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Disable a ServiceAccountKey. A disabled service account key can be re-enabled with EnableServiceAccountKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        disable(params: Params$Resource$Projects$Serviceaccounts$Keys$Disable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        disable(params?: Params$Resource$Projects$Serviceaccounts$Keys$Disable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        disable(params: Params$Resource$Projects$Serviceaccounts$Keys$Disable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        disable(params: Params$Resource$Projects$Serviceaccounts$Keys$Disable, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        disable(params: Params$Resource$Projects$Serviceaccounts$Keys$Disable, callback: BodyResponseCallback<Schema$Empty>): void;
        disable(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Enable a ServiceAccountKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enable(params: Params$Resource$Projects$Serviceaccounts$Keys$Enable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enable(params?: Params$Resource$Projects$Serviceaccounts$Keys$Enable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        enable(params: Params$Resource$Projects$Serviceaccounts$Keys$Enable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enable(params: Params$Resource$Projects$Serviceaccounts$Keys$Enable, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        enable(params: Params$Resource$Projects$Serviceaccounts$Keys$Enable, callback: BodyResponseCallback<Schema$Empty>): void;
        enable(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a ServiceAccountKey.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Serviceaccounts$Keys$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Serviceaccounts$Keys$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccountKey>>;
        get(params: Params$Resource$Projects$Serviceaccounts$Keys$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Serviceaccounts$Keys$Get, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccountKey>, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        get(params: Params$Resource$Projects$Serviceaccounts$Keys$Get, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        get(callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        /**
         * Lists every ServiceAccountKey for a service account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Serviceaccounts$Keys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Serviceaccounts$Keys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListServiceAccountKeysResponse>>;
        list(params: Params$Resource$Projects$Serviceaccounts$Keys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Serviceaccounts$Keys$List, options: MethodOptions | BodyResponseCallback<Schema$ListServiceAccountKeysResponse>, callback: BodyResponseCallback<Schema$ListServiceAccountKeysResponse>): void;
        list(params: Params$Resource$Projects$Serviceaccounts$Keys$List, callback: BodyResponseCallback<Schema$ListServiceAccountKeysResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListServiceAccountKeysResponse>): void;
        /**
         * Uploads the public key portion of a key pair that you manage, and associates the public key with a ServiceAccount. After you upload the public key, you can use the private key from the key pair as a service account key.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        upload(params: Params$Resource$Projects$Serviceaccounts$Keys$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Projects$Serviceaccounts$Keys$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccountKey>>;
        upload(params: Params$Resource$Projects$Serviceaccounts$Keys$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Projects$Serviceaccounts$Keys$Upload, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccountKey>, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        upload(params: Params$Resource$Projects$Serviceaccounts$Keys$Upload, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        upload(callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Create extends StandardParameters {
        /**
         * Required. The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateServiceAccountKeyRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Delete extends StandardParameters {
        /**
         * Required. The resource name of the service account key. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account key `projects/-/serviceAccounts/fake@example.com/keys/fake-key`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Disable extends StandardParameters {
        /**
         * Required. The resource name of the service account key. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account key `projects/-/serviceAccounts/fake@example.com/keys/fake-key`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DisableServiceAccountKeyRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Enable extends StandardParameters {
        /**
         * Required. The resource name of the service account key. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account key `projects/-/serviceAccounts/fake@example.com/keys/fake-key`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnableServiceAccountKeyRequest;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Get extends StandardParameters {
        /**
         * Required. The resource name of the service account key. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}/keys/{KEY_ID\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}/keys/{KEY_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account key `projects/-/serviceAccounts/fake@example.com/keys/fake-key`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Optional. The output format of the public key. The default is `TYPE_NONE`, which means that the public key is not returned.
         */
        publicKeyType?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$List extends StandardParameters {
        /**
         * Filters the types of keys the user wants to include in the list response. Duplicate key types are not allowed. If no key type is provided, all keys are returned.
         */
        keyTypes?: string[];
        /**
         * Required. The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Serviceaccounts$Keys$Upload extends StandardParameters {
        /**
         * The resource name of the service account key. Use one of the following formats: * `projects/{PROJECT_ID\}/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/{PROJECT_ID\}/serviceAccounts/{UNIQUE_ID\}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS\}` * `projects/-/serviceAccounts/{UNIQUE_ID\}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UploadServiceAccountKeyRequest;
    }
    export class Resource$Roles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the definition of a Role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Roles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Roles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Role>>;
        get(params: Params$Resource$Roles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Roles$Get, options: MethodOptions | BodyResponseCallback<Schema$Role>, callback: BodyResponseCallback<Schema$Role>): void;
        get(params: Params$Resource$Roles$Get, callback: BodyResponseCallback<Schema$Role>): void;
        get(callback: BodyResponseCallback<Schema$Role>): void;
        /**
         * Lists every predefined Role that IAM supports, or every custom role that is defined for an organization or project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Roles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Roles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRolesResponse>>;
        list(params: Params$Resource$Roles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Roles$List, options: MethodOptions | BodyResponseCallback<Schema$ListRolesResponse>, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(params: Params$Resource$Roles$List, callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRolesResponse>): void;
        /**
         * Lists roles that can be granted on a Google Cloud resource. A role is grantable if the IAM policy for the resource can contain bindings to the role.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryGrantableRoles(params: Params$Resource$Roles$Querygrantableroles, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryGrantableRoles(params?: Params$Resource$Roles$Querygrantableroles, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$QueryGrantableRolesResponse>>;
        queryGrantableRoles(params: Params$Resource$Roles$Querygrantableroles, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryGrantableRoles(params: Params$Resource$Roles$Querygrantableroles, options: MethodOptions | BodyResponseCallback<Schema$QueryGrantableRolesResponse>, callback: BodyResponseCallback<Schema$QueryGrantableRolesResponse>): void;
        queryGrantableRoles(params: Params$Resource$Roles$Querygrantableroles, callback: BodyResponseCallback<Schema$QueryGrantableRolesResponse>): void;
        queryGrantableRoles(callback: BodyResponseCallback<Schema$QueryGrantableRolesResponse>): void;
    }
    export interface Params$Resource$Roles$Get extends StandardParameters {
        /**
         * The `name` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below: * [roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/roles/get): `roles/{ROLE_NAME\}`. This method returns results from all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles/{ROLE_NAME\}` * [projects.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/get): `projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the project level. Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles/{CUSTOM_ROLE_ID\}` * [organizations.roles.get](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/get): `organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}`. This method returns only [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that have been created at the organization level. Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles/{CUSTOM_ROLE_ID\}` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        name?: string;
    }
    export interface Params$Resource$Roles$List extends StandardParameters {
        /**
         * Optional limit on the number of roles to include in the response. The default is 300, and the maximum is 1,000.
         */
        pageSize?: number;
        /**
         * Optional pagination token returned in an earlier ListRolesResponse.
         */
        pageToken?: string;
        /**
         * The `parent` parameter's value depends on the target resource for the request, namely [roles](https://cloud.google.com/iam/docs/reference/rest/v1/roles), [projects](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles), or [organizations](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below: * [roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/roles/list): An empty string. This method doesn't require a resource; it simply returns all [predefined roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles) in IAM. Example request URL: `https://iam.googleapis.com/v1/roles` * [projects.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/projects.roles/list): `projects/{PROJECT_ID\}`. This method lists all project-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/projects/{PROJECT_ID\}/roles` * [organizations.roles.list](https://cloud.google.com/iam/docs/reference/rest/v1/organizations.roles/list): `organizations/{ORGANIZATION_ID\}`. This method lists all organization-level [custom roles](https://cloud.google.com/iam/docs/understanding-custom-roles). Example request URL: `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID\}/roles` Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.
         */
        parent?: string;
        /**
         * Include Roles that have been deleted.
         */
        showDeleted?: boolean;
        /**
         * Optional view for the returned Role objects. When `FULL` is specified, the `includedPermissions` field is returned, which includes a list of all permissions in the role. The default value is `BASIC`, which does not return the `includedPermissions` field.
         */
        view?: string;
    }
    export interface Params$Resource$Roles$Querygrantableroles extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryGrantableRolesRequest;
    }
    export {};
}
