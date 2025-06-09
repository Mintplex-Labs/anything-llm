import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace gkehub_v1alpha {
    export interface Options extends GlobalOptions {
        version: 'v1alpha';
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
     * GKE Hub API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const gkehub = google.gkehub('v1alpha');
     * ```
     */
    export class Gkehub {
        context: APIRequestContext;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Spec for App Dev Experience Feature.
     */
    export interface Schema$AppDevExperienceFeatureSpec {
    }
    /**
     * State for App Dev Exp Feature.
     */
    export interface Schema$AppDevExperienceFeatureState {
        /**
         * Status of subcomponent that detects configured Service Mesh resources.
         */
        networkingInstallSucceeded?: Schema$Status;
    }
    /**
     * ApplianceCluster contains information specific to GDC Edge Appliance Clusters.
     */
    export interface Schema$ApplianceCluster {
        /**
         * Immutable. Self-link of the Google Cloud resource for the Appliance Cluster. For example: //transferappliance.googleapis.com/projects/my-project/locations/us-west1-a/appliances/my-appliance
         */
        resourceLink?: string | null;
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
     * Authority encodes how Google will recognize identities from this Membership. See the workload identity documentation for more details: https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity
     */
    export interface Schema$Authority {
        /**
         * Output only. An identity provider that reflects the `issuer` in the workload identity pool.
         */
        identityProvider?: string | null;
        /**
         * Optional. A JSON Web Token (JWT) issuer URI. `issuer` must start with `https://` and be a valid URL with length <2000 characters, it must use `location` rather than `zone` for GKE clusters. If set, then Google will allow valid OIDC tokens from this issuer to authenticate within the workload_identity_pool. OIDC discovery will be performed on this URI to validate tokens from the issuer. Clearing `issuer` disables Workload Identity. `issuer` cannot be directly modified; it must be cleared (and Workload Identity disabled) before using a new issuer (and re-enabling Workload Identity).
         */
        issuer?: string | null;
        /**
         * Optional. OIDC verification keys for this Membership in JWKS format (RFC 7517). When this field is set, OIDC discovery will NOT be performed on `issuer`, and instead OIDC tokens will be validated using this field.
         */
        oidcJwks?: string | null;
        /**
         * Optional. Output only. The identity provider for the scope-tenancy workload identity pool.
         */
        scopeTenancyIdentityProvider?: string | null;
        /**
         * Optional. Output only. The name of the scope-tenancy workload identity pool. This pool is set in the fleet-level feature.
         */
        scopeTenancyWorkloadIdentityPool?: string | null;
        /**
         * Output only. The name of the workload identity pool in which `issuer` will be recognized. There is a single Workload Identity Pool per Hub that is shared between all Memberships that belong to that Hub. For a Hub hosted in {PROJECT_ID\}, the workload pool format is `{PROJECT_ID\}.hub.id.goog`, although this is subject to change in newer versions of this API.
         */
        workloadIdentityPool?: string | null;
    }
    /**
     * BinaryAuthorizationConfig defines the fleet level configuration of binary authorization feature.
     */
    export interface Schema$BinaryAuthorizationConfig {
        /**
         * Optional. Mode of operation for binauthz policy evaluation.
         */
        evaluationMode?: string | null;
        /**
         * Optional. Binauthz policies that apply to this cluster.
         */
        policyBindings?: Schema$PolicyBinding[];
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
     * **Cloud Audit Logging**: Spec for Audit Logging Allowlisting.
     */
    export interface Schema$CloudAuditLoggingFeatureSpec {
        /**
         * Service account that should be allowlisted to send the audit logs; eg cloudauditlogging@gcp-project.iam.gserviceaccount.com. These accounts must already exist, but do not need to have any permissions granted to them. The customer's entitlements will be checked prior to allowlisting (i.e. the customer must be an Anthos customer.)
         */
        allowlistedServiceAccounts?: string[] | null;
    }
    /**
     * **Cloud Build**: Configurations for each Cloud Build enabled cluster.
     */
    export interface Schema$CloudBuildMembershipSpec {
        /**
         * Whether it is allowed to run the privileged builds on the cluster or not.
         */
        securityPolicy?: string | null;
        /**
         * Version of the cloud build software on the cluster.
         */
        version?: string | null;
    }
    /**
     * **ClusterUpgrade**: The configuration for the fleet-level ClusterUpgrade feature.
     */
    export interface Schema$ClusterUpgradeFleetSpec {
        /**
         * Allow users to override some properties of each GKE upgrade.
         */
        gkeUpgradeOverrides?: Schema$ClusterUpgradeGKEUpgradeOverride[];
        /**
         * Required. Post conditions to evaluate to mark an upgrade COMPLETE. Required.
         */
        postConditions?: Schema$ClusterUpgradePostConditions;
        /**
         * This fleet consumes upgrades that have COMPLETE status code in the upstream fleets. See UpgradeStatus.Code for code definitions. The fleet name should be either fleet project number or id. This is defined as repeated for future proof reasons. Initial implementation will enforce at most one upstream fleet.
         */
        upstreamFleets?: string[] | null;
    }
    /**
     * **ClusterUpgrade**: The state for the fleet-level ClusterUpgrade feature.
     */
    export interface Schema$ClusterUpgradeFleetState {
        /**
         * This fleets whose upstream_fleets contain the current fleet. The fleet name should be either fleet project number or id.
         */
        downstreamFleets?: string[] | null;
        /**
         * Feature state for GKE clusters.
         */
        gkeState?: Schema$ClusterUpgradeGKEUpgradeFeatureState;
        /**
         * A list of memberships ignored by the feature. For example, manually upgraded clusters can be ignored if they are newer than the default versions of its release channel. The membership resource is in the format: `projects/{p\}/locations/{l\}/membership/{m\}`.
         */
        ignored?: {
            [key: string]: Schema$ClusterUpgradeIgnoredMembership;
        } | null;
    }
    /**
     * GKEUpgrade represents a GKE provided upgrade, e.g., control plane upgrade.
     */
    export interface Schema$ClusterUpgradeGKEUpgrade {
        /**
         * Name of the upgrade, e.g., "k8s_control_plane". It should be a valid upgrade name. It must not exceet 99 characters.
         */
        name?: string | null;
        /**
         * Version of the upgrade, e.g., "1.22.1-gke.100". It should be a valid version. It must not exceet 99 characters.
         */
        version?: string | null;
    }
    /**
     * GKEUpgradeFeatureCondition describes the condition of the feature for GKE clusters at a certain point of time.
     */
    export interface Schema$ClusterUpgradeGKEUpgradeFeatureCondition {
        /**
         * Reason why the feature is in this status.
         */
        reason?: string | null;
        /**
         * Status of the condition, one of True, False, Unknown.
         */
        status?: string | null;
        /**
         * Type of the condition, for example, "ready".
         */
        type?: string | null;
        /**
         * Last timestamp the condition was updated.
         */
        updateTime?: string | null;
    }
    /**
     * GKEUpgradeFeatureState contains feature states for GKE clusters in the scope.
     */
    export interface Schema$ClusterUpgradeGKEUpgradeFeatureState {
        /**
         * Current conditions of the feature.
         */
        conditions?: Schema$ClusterUpgradeGKEUpgradeFeatureCondition[];
        /**
         * Upgrade state. It will eventually replace `state`.
         */
        upgradeState?: Schema$ClusterUpgradeGKEUpgradeState[];
    }
    /**
     * Properties of a GKE upgrade that can be overridden by the user. For example, a user can skip soaking by overriding the soaking to 0.
     */
    export interface Schema$ClusterUpgradeGKEUpgradeOverride {
        /**
         * Required. Post conditions to override for the specified upgrade (name + version). Required.
         */
        postConditions?: Schema$ClusterUpgradePostConditions;
        /**
         * Required. Which upgrade to override. Required.
         */
        upgrade?: Schema$ClusterUpgradeGKEUpgrade;
    }
    /**
     * GKEUpgradeState is a GKEUpgrade and its state at the scope and fleet level.
     */
    export interface Schema$ClusterUpgradeGKEUpgradeState {
        /**
         * Number of GKE clusters in each status code.
         */
        stats?: {
            [key: string]: string;
        } | null;
        /**
         * Status of the upgrade.
         */
        status?: Schema$ClusterUpgradeUpgradeStatus;
        /**
         * Which upgrade to track the state.
         */
        upgrade?: Schema$ClusterUpgradeGKEUpgrade;
    }
    /**
     * IgnoredMembership represents a membership ignored by the feature. A membership can be ignored because it was manually upgraded to a newer version than RC default.
     */
    export interface Schema$ClusterUpgradeIgnoredMembership {
        /**
         * Time when the membership was first set to ignored.
         */
        ignoredTime?: string | null;
        /**
         * Reason why the membership is ignored.
         */
        reason?: string | null;
    }
    /**
     * ScopeGKEUpgradeState is a GKEUpgrade and its state per-membership.
     */
    export interface Schema$ClusterUpgradeMembershipGKEUpgradeState {
        /**
         * Status of the upgrade.
         */
        status?: Schema$ClusterUpgradeUpgradeStatus;
        /**
         * Which upgrade to track the state.
         */
        upgrade?: Schema$ClusterUpgradeGKEUpgrade;
    }
    /**
     * Per-membership state for this feature.
     */
    export interface Schema$ClusterUpgradeMembershipState {
        /**
         * Whether this membership is ignored by the feature. For example, manually upgraded clusters can be ignored if they are newer than the default versions of its release channel.
         */
        ignored?: Schema$ClusterUpgradeIgnoredMembership;
        /**
         * Fully qualified scope names that this clusters is bound to which also have rollout sequencing enabled.
         */
        scopes?: string[] | null;
        /**
         * Actual upgrade state against desired.
         */
        upgrades?: Schema$ClusterUpgradeMembershipGKEUpgradeState[];
    }
    /**
     * Post conditional checks after an upgrade has been applied on all eligible clusters.
     */
    export interface Schema$ClusterUpgradePostConditions {
        /**
         * Required. Amount of time to "soak" after a rollout has been finished before marking it COMPLETE. Cannot exceed 30 days. Required.
         */
        soaking?: string | null;
    }
    /**
     * **ClusterUpgrade**: The configuration for the scope-level ClusterUpgrade feature.
     */
    export interface Schema$ClusterUpgradeScopeSpec {
        /**
         * Allow users to override some properties of each GKE upgrade.
         */
        gkeUpgradeOverrides?: Schema$ClusterUpgradeGKEUpgradeOverride[];
        /**
         * Required. Post conditions to evaluate to mark an upgrade COMPLETE. Required.
         */
        postConditions?: Schema$ClusterUpgradePostConditions;
        /**
         * This scope consumes upgrades that have COMPLETE status code in the upstream scopes. See UpgradeStatus.Code for code definitions. The scope name should be in the form: `projects/{p\}/locations/global/scopes/{s\}` Where {p\} is the project, {s\} is a valid Scope in this project. {p\} WILL match the Feature's project. This is defined as repeated for future proof reasons. Initial implementation will enforce at most one upstream scope.
         */
        upstreamScopes?: string[] | null;
    }
    /**
     * **ClusterUpgrade**: The state for the scope-level ClusterUpgrade feature.
     */
    export interface Schema$ClusterUpgradeScopeState {
        /**
         * This scopes whose upstream_scopes contain the current scope. The scope name should be in the form: `projects/{p\}/locations/gloobal/scopes/{s\}` Where {p\} is the project, {s\} is a valid Scope in this project. {p\} WILL match the Feature's project.
         */
        downstreamScopes?: string[] | null;
        /**
         * Feature state for GKE clusters.
         */
        gkeState?: Schema$ClusterUpgradeGKEUpgradeFeatureState;
        /**
         * A list of memberships ignored by the feature. For example, manually upgraded clusters can be ignored if they are newer than the default versions of its release channel. The membership resource is in the format: `projects/{p\}/locations/{l\}/membership/{m\}`.
         */
        ignored?: {
            [key: string]: Schema$ClusterUpgradeIgnoredMembership;
        } | null;
    }
    /**
     * UpgradeStatus provides status information for each upgrade.
     */
    export interface Schema$ClusterUpgradeUpgradeStatus {
        /**
         * Status code of the upgrade.
         */
        code?: string | null;
        /**
         * Reason for this status.
         */
        reason?: string | null;
        /**
         * Last timestamp the status was updated.
         */
        updateTime?: string | null;
    }
    /**
     * CommonFeatureSpec contains Fleet-wide configuration information
     */
    export interface Schema$CommonFeatureSpec {
        /**
         * Appdevexperience specific spec.
         */
        appdevexperience?: Schema$AppDevExperienceFeatureSpec;
        /**
         * Cloud Audit Logging-specific spec.
         */
        cloudauditlogging?: Schema$CloudAuditLoggingFeatureSpec;
        /**
         * ClusterUpgrade (fleet-based) feature spec.
         */
        clusterupgrade?: Schema$ClusterUpgradeFleetSpec;
        /**
         * DataplaneV2 feature spec.
         */
        dataplanev2?: Schema$DataplaneV2FeatureSpec;
        /**
         * FleetObservability feature spec.
         */
        fleetobservability?: Schema$FleetObservabilityFeatureSpec;
        /**
         * Multicluster Ingress-specific spec.
         */
        multiclusteringress?: Schema$MultiClusterIngressFeatureSpec;
        /**
         * Namespace Actuation feature spec
         */
        namespaceactuation?: Schema$NamespaceActuationFeatureSpec;
        /**
         * RBAC Role Binding Actuation feature spec
         */
        rbacrolebindingactuation?: Schema$RBACRoleBindingActuationFeatureSpec;
        /**
         * Workload Certificate spec.
         */
        workloadcertificate?: Schema$FeatureSpec;
        /**
         * Workload Identity feature spec.
         */
        workloadidentity?: Schema$WorkloadIdentityFeatureSpec;
    }
    /**
     * CommonFeatureState contains Fleet-wide Feature status information.
     */
    export interface Schema$CommonFeatureState {
        /**
         * Appdevexperience specific state.
         */
        appdevexperience?: Schema$AppDevExperienceFeatureState;
        /**
         * ClusterUpgrade fleet-level state.
         */
        clusterupgrade?: Schema$ClusterUpgradeFleetState;
        /**
         * FleetObservability feature state.
         */
        fleetobservability?: Schema$FleetObservabilityFeatureState;
        /**
         * Namespace Actuation feature state.
         */
        namespaceactuation?: Schema$NamespaceActuationFeatureState;
        /**
         * RBAC Role Binding Actuation feature state
         */
        rbacrolebindingactuation?: Schema$RBACRoleBindingActuationFeatureState;
        /**
         * Service Mesh-specific state.
         */
        servicemesh?: Schema$ServiceMeshFeatureState;
        /**
         * Output only. The "running state" of the Feature in this Fleet.
         */
        state?: Schema$FeatureState;
        /**
         * WorkloadIdentity fleet-level state.
         */
        workloadidentity?: Schema$WorkloadIdentityFeatureState;
    }
    /**
     * CommonFleetDefaultMemberConfigSpec contains default configuration information for memberships of a fleet
     */
    export interface Schema$CommonFleetDefaultMemberConfigSpec {
        /**
         * Config Management-specific spec.
         */
        configmanagement?: Schema$ConfigManagementMembershipSpec;
        /**
         * Identity Service-specific spec.
         */
        identityservice?: Schema$IdentityServiceMembershipSpec;
        /**
         * Anthos Service Mesh-specific spec
         */
        mesh?: Schema$ServiceMeshMembershipSpec;
        /**
         * Policy Controller spec.
         */
        policycontroller?: Schema$PolicyControllerMembershipSpec;
    }
    /**
     * CompliancePostureConfig defines the settings needed to enable/disable features for the Compliance Posture.
     */
    export interface Schema$CompliancePostureConfig {
        /**
         * List of enabled compliance standards.
         */
        complianceStandards?: Schema$ComplianceStandard[];
        /**
         * Defines the enablement mode for Compliance Posture.
         */
        mode?: string | null;
    }
    export interface Schema$ComplianceStandard {
        /**
         * Name of the compliance standard.
         */
        standard?: string | null;
    }
    /**
     * Configuration for Binauthz
     */
    export interface Schema$ConfigManagementBinauthzConfig {
        /**
         * Whether binauthz is enabled in this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * State for Binauthz
     */
    export interface Schema$ConfigManagementBinauthzState {
        /**
         * The version of binauthz that is installed.
         */
        version?: Schema$ConfigManagementBinauthzVersion;
        /**
         * The state of the binauthz webhook.
         */
        webhook?: string | null;
    }
    /**
     * The version of binauthz.
     */
    export interface Schema$ConfigManagementBinauthzVersion {
        /**
         * The version of the binauthz webhook.
         */
        webhookVersion?: string | null;
    }
    /**
     * Configuration for Config Sync
     */
    export interface Schema$ConfigManagementConfigSync {
        /**
         * Optional. Configuration for deployment overrides.
         */
        deploymentOverrides?: Schema$ConfigManagementDeploymentOverride[];
        /**
         * Optional. Enables the installation of ConfigSync. If set to true, ConfigSync resources will be created and the other ConfigSync fields will be applied if exist. If set to false, all other ConfigSync fields will be ignored, ConfigSync resources will be deleted. If omitted, ConfigSync resources will be managed depends on the presence of the git or oci field.
         */
        enabled?: boolean | null;
        /**
         * Optional. Git repo configuration for the cluster.
         */
        git?: Schema$ConfigManagementGitConfig;
        /**
         * Optional. The Email of the Google Cloud Service Account (GSA) used for exporting Config Sync metrics to Cloud Monitoring and Cloud Monarch when Workload Identity is enabled. The GSA should have the Monitoring Metric Writer (roles/monitoring.metricWriter) IAM role. The Kubernetes ServiceAccount `default` in the namespace `config-management-monitoring` should be bound to the GSA. Deprecated: If Workload Identity Federation for GKE is enabled, Google Cloud Service Account is no longer needed for exporting Config Sync metrics: https://cloud.google.com/kubernetes-engine/enterprise/config-sync/docs/how-to/monitor-config-sync-cloud-monitoring#custom-monitoring.
         */
        metricsGcpServiceAccountEmail?: string | null;
        /**
         * Optional. OCI repo configuration for the cluster
         */
        oci?: Schema$ConfigManagementOciConfig;
        /**
         * Optional. Set to true to enable the Config Sync admission webhook to prevent drifts. If set to `false`, disables the Config Sync admission webhook and does not prevent drifts.
         */
        preventDrift?: boolean | null;
        /**
         * Optional. Specifies whether the Config Sync Repo is in "hierarchical" or "unstructured" mode.
         */
        sourceFormat?: string | null;
        /**
         * Optional. Set to true to stop syncing configs for a single cluster. Default to false.
         */
        stopSyncing?: boolean | null;
    }
    /**
     * The state of ConfigSync's deployment on a cluster
     */
    export interface Schema$ConfigManagementConfigSyncDeploymentState {
        /**
         * Deployment state of admission-webhook
         */
        admissionWebhook?: string | null;
        /**
         * Deployment state of the git-sync pod
         */
        gitSync?: string | null;
        /**
         * Deployment state of the importer pod
         */
        importer?: string | null;
        /**
         * Deployment state of the monitor pod
         */
        monitor?: string | null;
        /**
         * Deployment state of otel-collector
         */
        otelCollector?: string | null;
        /**
         * Deployment state of reconciler-manager pod
         */
        reconcilerManager?: string | null;
        /**
         * Deployment state of resource-group-controller-manager
         */
        resourceGroupControllerManager?: string | null;
        /**
         * Deployment state of root-reconciler
         */
        rootReconciler?: string | null;
        /**
         * Deployment state of the syncer pod
         */
        syncer?: string | null;
    }
    /**
     * Errors pertaining to the installation of Config Sync
     */
    export interface Schema$ConfigManagementConfigSyncError {
        /**
         * A string representing the user facing error message
         */
        errorMessage?: string | null;
    }
    /**
     * State information for ConfigSync
     */
    export interface Schema$ConfigManagementConfigSyncState {
        /**
         * Output only. Whether syncing resources to the cluster is stopped at the cluster level.
         */
        clusterLevelStopSyncingState?: string | null;
        /**
         * Output only. The number of RootSync and RepoSync CRs in the cluster.
         */
        crCount?: number | null;
        /**
         * Output only. Information about the deployment of ConfigSync, including the version of the various Pods deployed
         */
        deploymentState?: Schema$ConfigManagementConfigSyncDeploymentState;
        /**
         * Output only. Errors pertaining to the installation of Config Sync.
         */
        errors?: Schema$ConfigManagementConfigSyncError[];
        /**
         * Output only. The state of the Reposync CRD
         */
        reposyncCrd?: string | null;
        /**
         * Output only. The state of the RootSync CRD
         */
        rootsyncCrd?: string | null;
        /**
         * Output only. The state of CS This field summarizes the other fields in this message.
         */
        state?: string | null;
        /**
         * Output only. The state of ConfigSync's process to sync configs to a cluster
         */
        syncState?: Schema$ConfigManagementSyncState;
        /**
         * Output only. The version of ConfigSync deployed
         */
        version?: Schema$ConfigManagementConfigSyncVersion;
    }
    /**
     * Specific versioning information pertaining to ConfigSync's Pods
     */
    export interface Schema$ConfigManagementConfigSyncVersion {
        /**
         * Version of the deployed admission-webhook pod
         */
        admissionWebhook?: string | null;
        /**
         * Version of the deployed git-sync pod
         */
        gitSync?: string | null;
        /**
         * Version of the deployed importer pod
         */
        importer?: string | null;
        /**
         * Version of the deployed monitor pod
         */
        monitor?: string | null;
        /**
         * Version of the deployed otel-collector pod
         */
        otelCollector?: string | null;
        /**
         * Version of the deployed reconciler-manager pod
         */
        reconcilerManager?: string | null;
        /**
         * Version of the deployed resource-group-controller-manager pod
         */
        resourceGroupControllerManager?: string | null;
        /**
         * Version of the deployed reconciler container in root-reconciler pod
         */
        rootReconciler?: string | null;
        /**
         * Version of the deployed syncer pod
         */
        syncer?: string | null;
    }
    /**
     * Configuration for a container override.
     */
    export interface Schema$ConfigManagementContainerOverride {
        /**
         * Required. The name of the container.
         */
        containerName?: string | null;
        /**
         * Optional. The cpu limit of the container.
         */
        cpuLimit?: string | null;
        /**
         * Optional. The cpu request of the container.
         */
        cpuRequest?: string | null;
        /**
         * Optional. The memory limit of the container.
         */
        memoryLimit?: string | null;
        /**
         * Optional. The memory request of the container.
         */
        memoryRequest?: string | null;
    }
    /**
     * Configuration for a deployment override.
     */
    export interface Schema$ConfigManagementDeploymentOverride {
        /**
         * Optional. The containers of the deployment resource to be overridden.
         */
        containers?: Schema$ConfigManagementContainerOverride[];
        /**
         * Required. The name of the deployment resource to be overridden.
         */
        deploymentName?: string | null;
        /**
         * Required. The namespace of the deployment resource to be overridden..
         */
        deploymentNamespace?: string | null;
    }
    /**
     * Model for a config file in the git repo with an associated Sync error
     */
    export interface Schema$ConfigManagementErrorResource {
        /**
         * Group/version/kind of the resource that is causing an error
         */
        resourceGvk?: Schema$ConfigManagementGroupVersionKind;
        /**
         * Metadata name of the resource that is causing an error
         */
        resourceName?: string | null;
        /**
         * Namespace of the resource that is causing an error
         */
        resourceNamespace?: string | null;
        /**
         * Path in the git repo of the erroneous config
         */
        sourcePath?: string | null;
    }
    /**
     * State of Policy Controller installation.
     */
    export interface Schema$ConfigManagementGatekeeperDeploymentState {
        /**
         * Status of gatekeeper-audit deployment.
         */
        gatekeeperAudit?: string | null;
        /**
         * Status of gatekeeper-controller-manager pod.
         */
        gatekeeperControllerManagerState?: string | null;
        /**
         * Status of the pod serving the mutation webhook.
         */
        gatekeeperMutation?: string | null;
    }
    /**
     * Git repo configuration for a single cluster.
     */
    export interface Schema$ConfigManagementGitConfig {
        /**
         * Optional. The Google Cloud Service Account Email used for auth when secret_type is gcpServiceAccount.
         */
        gcpServiceAccountEmail?: string | null;
        /**
         * Optional. URL for the HTTPS proxy to be used when communicating with the Git repo.
         */
        httpsProxy?: string | null;
        /**
         * Optional. The path within the Git repository that represents the top level of the repo to sync. Default: the root directory of the repository.
         */
        policyDir?: string | null;
        /**
         * Required. Type of secret configured for access to the Git repo. Must be one of ssh, cookiefile, gcenode, token, gcpserviceaccount, githubapp or none. The validation of this is case-sensitive.
         */
        secretType?: string | null;
        /**
         * Optional. The branch of the repository to sync from. Default: master.
         */
        syncBranch?: string | null;
        /**
         * Required. The URL of the Git repository to use as the source of truth.
         */
        syncRepo?: string | null;
        /**
         * Optional. Git revision (tag or hash) to check out. Default HEAD.
         */
        syncRev?: string | null;
        /**
         * Optional. Period in seconds between consecutive syncs. Default: 15.
         */
        syncWaitSecs?: string | null;
    }
    /**
     * A Kubernetes object's GVK
     */
    export interface Schema$ConfigManagementGroupVersionKind {
        /**
         * Kubernetes Group
         */
        group?: string | null;
        /**
         * Kubernetes Kind
         */
        kind?: string | null;
        /**
         * Kubernetes Version
         */
        version?: string | null;
    }
    /**
     * Configuration for Hierarchy Controller
     */
    export interface Schema$ConfigManagementHierarchyControllerConfig {
        /**
         * Whether Hierarchy Controller is enabled in this cluster.
         */
        enabled?: boolean | null;
        /**
         * Whether hierarchical resource quota is enabled in this cluster.
         */
        enableHierarchicalResourceQuota?: boolean | null;
        /**
         * Whether pod tree labels are enabled in this cluster.
         */
        enablePodTreeLabels?: boolean | null;
    }
    /**
     * Deployment state for Hierarchy Controller
     */
    export interface Schema$ConfigManagementHierarchyControllerDeploymentState {
        /**
         * The deployment state for Hierarchy Controller extension (e.g. v0.7.0-hc.1)
         */
        extension?: string | null;
        /**
         * The deployment state for open source HNC (e.g. v0.7.0-hc.0)
         */
        hnc?: string | null;
    }
    /**
     * State for Hierarchy Controller
     */
    export interface Schema$ConfigManagementHierarchyControllerState {
        /**
         * The deployment state for Hierarchy Controller
         */
        state?: Schema$ConfigManagementHierarchyControllerDeploymentState;
        /**
         * The version for Hierarchy Controller
         */
        version?: Schema$ConfigManagementHierarchyControllerVersion;
    }
    /**
     * Version for Hierarchy Controller
     */
    export interface Schema$ConfigManagementHierarchyControllerVersion {
        /**
         * Version for Hierarchy Controller extension
         */
        extension?: string | null;
        /**
         * Version for open source HNC
         */
        hnc?: string | null;
    }
    /**
     * Errors pertaining to the installation of ACM
     */
    export interface Schema$ConfigManagementInstallError {
        /**
         * A string representing the user facing error message
         */
        errorMessage?: string | null;
    }
    /**
     * **Anthos Config Management**: Configuration for a single cluster. Intended to parallel the ConfigManagement CR.
     */
    export interface Schema$ConfigManagementMembershipSpec {
        /**
         * Optional. Binauthz conifguration for the cluster. Deprecated: This field will be ignored and should not be set.
         */
        binauthz?: Schema$ConfigManagementBinauthzConfig;
        /**
         * Optional. The user-specified cluster name used by Config Sync cluster-name-selector annotation or ClusterSelector, for applying configs to only a subset of clusters. Omit this field if the cluster's fleet membership name is used by Config Sync cluster-name-selector annotation or ClusterSelector. Set this field if a name different from the cluster's fleet membership name is used by Config Sync cluster-name-selector annotation or ClusterSelector.
         */
        cluster?: string | null;
        /**
         * Optional. Config Sync configuration for the cluster.
         */
        configSync?: Schema$ConfigManagementConfigSync;
        /**
         * Optional. Hierarchy Controller configuration for the cluster. Deprecated: Configuring Hierarchy Controller through the configmanagement feature is no longer recommended. Use https://github.com/kubernetes-sigs/hierarchical-namespaces instead.
         */
        hierarchyController?: Schema$ConfigManagementHierarchyControllerConfig;
        /**
         * Optional. Enables automatic Feature management.
         */
        management?: string | null;
        /**
         * Optional. Policy Controller configuration for the cluster. Deprecated: Configuring Policy Controller through the configmanagement feature is no longer recommended. Use the policycontroller feature instead.
         */
        policyController?: Schema$ConfigManagementPolicyController;
        /**
         * Optional. Version of ACM installed.
         */
        version?: string | null;
    }
    /**
     * **Anthos Config Management**: State for a single cluster.
     */
    export interface Schema$ConfigManagementMembershipState {
        /**
         * Output only. Binauthz status
         */
        binauthzState?: Schema$ConfigManagementBinauthzState;
        /**
         * Output only. This field is set to the `cluster_name` field of the Membership Spec if it is not empty. Otherwise, it is set to the cluster's fleet membership name.
         */
        clusterName?: string | null;
        /**
         * Output only. Current sync status
         */
        configSyncState?: Schema$ConfigManagementConfigSyncState;
        /**
         * Output only. Hierarchy Controller status
         */
        hierarchyControllerState?: Schema$ConfigManagementHierarchyControllerState;
        /**
         * Output only. Membership configuration in the cluster. This represents the actual state in the cluster, while the MembershipSpec in the FeatureSpec represents the intended state
         */
        membershipSpec?: Schema$ConfigManagementMembershipSpec;
        /**
         * Output only. Current install status of ACM's Operator
         */
        operatorState?: Schema$ConfigManagementOperatorState;
        /**
         * Output only. PolicyController status
         */
        policyControllerState?: Schema$ConfigManagementPolicyControllerState;
    }
    /**
     * OCI repo configuration for a single cluster
     */
    export interface Schema$ConfigManagementOciConfig {
        /**
         * Optional. The Google Cloud Service Account Email used for auth when secret_type is gcpServiceAccount.
         */
        gcpServiceAccountEmail?: string | null;
        /**
         * Optional. The absolute path of the directory that contains the local resources. Default: the root directory of the image.
         */
        policyDir?: string | null;
        /**
         * Required. Type of secret configured for access to the OCI repo. Must be one of gcenode, gcpserviceaccount, k8sserviceaccount or none. The validation of this is case-sensitive.
         */
        secretType?: string | null;
        /**
         * Required. The OCI image repository URL for the package to sync from. e.g. `LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/PACKAGE_NAME`.
         */
        syncRepo?: string | null;
        /**
         * Optional. Period in seconds between consecutive syncs. Default: 15.
         */
        syncWaitSecs?: string | null;
    }
    /**
     * State information for an ACM's Operator
     */
    export interface Schema$ConfigManagementOperatorState {
        /**
         * The state of the Operator's deployment
         */
        deploymentState?: string | null;
        /**
         * Install errors.
         */
        errors?: Schema$ConfigManagementInstallError[];
        /**
         * The semenatic version number of the operator
         */
        version?: string | null;
    }
    /**
     * Configuration for Policy Controller
     */
    export interface Schema$ConfigManagementPolicyController {
        /**
         * Sets the interval for Policy Controller Audit Scans (in seconds). When set to 0, this disables audit functionality altogether.
         */
        auditIntervalSeconds?: string | null;
        /**
         * Enables the installation of Policy Controller. If false, the rest of PolicyController fields take no effect.
         */
        enabled?: boolean | null;
        /**
         * The set of namespaces that are excluded from Policy Controller checks. Namespaces do not need to currently exist on the cluster.
         */
        exemptableNamespaces?: string[] | null;
        /**
         * Logs all denies and dry run failures.
         */
        logDeniesEnabled?: boolean | null;
        /**
         * Monitoring specifies the configuration of monitoring.
         */
        monitoring?: Schema$ConfigManagementPolicyControllerMonitoring;
        /**
         * Enable or disable mutation in policy controller. If true, mutation CRDs, webhook and controller deployment will be deployed to the cluster.
         */
        mutationEnabled?: boolean | null;
        /**
         * Enables the ability to use Constraint Templates that reference to objects other than the object currently being evaluated.
         */
        referentialRulesEnabled?: boolean | null;
        /**
         * Installs the default template library along with Policy Controller.
         */
        templateLibraryInstalled?: boolean | null;
        /**
         * Output only. Last time this membership spec was updated.
         */
        updateTime?: string | null;
    }
    /**
     * State for the migration of PolicyController from ACM -\> PoCo Hub.
     */
    export interface Schema$ConfigManagementPolicyControllerMigration {
        /**
         * Last time this membership spec was copied to PoCo feature.
         */
        copyTime?: string | null;
        /**
         * Stage of the migration.
         */
        stage?: string | null;
    }
    /**
     * PolicyControllerMonitoring specifies the backends Policy Controller should export metrics to. For example, to specify metrics should be exported to Cloud Monitoring and Prometheus, specify backends: ["cloudmonitoring", "prometheus"]
     */
    export interface Schema$ConfigManagementPolicyControllerMonitoring {
        /**
         * Specifies the list of backends Policy Controller will export to. An empty list would effectively disable metrics export.
         */
        backends?: string[] | null;
    }
    /**
     * State for PolicyControllerState.
     */
    export interface Schema$ConfigManagementPolicyControllerState {
        /**
         * The state about the policy controller installation.
         */
        deploymentState?: Schema$ConfigManagementGatekeeperDeploymentState;
        /**
         * Record state of ACM -\> PoCo Hub migration for this feature.
         */
        migration?: Schema$ConfigManagementPolicyControllerMigration;
        /**
         * The version of Gatekeeper Policy Controller deployed.
         */
        version?: Schema$ConfigManagementPolicyControllerVersion;
    }
    /**
     * The build version of Gatekeeper Policy Controller is using.
     */
    export interface Schema$ConfigManagementPolicyControllerVersion {
        /**
         * The gatekeeper image tag that is composed of ACM version, git tag, build number.
         */
        version?: string | null;
    }
    /**
     * An ACM created error representing a problem syncing configurations
     */
    export interface Schema$ConfigManagementSyncError {
        /**
         * An ACM defined error code
         */
        code?: string | null;
        /**
         * A description of the error
         */
        errorMessage?: string | null;
        /**
         * A list of config(s) associated with the error, if any
         */
        errorResources?: Schema$ConfigManagementErrorResource[];
    }
    /**
     * State indicating an ACM's progress syncing configurations to a cluster
     */
    export interface Schema$ConfigManagementSyncState {
        /**
         * Sync status code
         */
        code?: string | null;
        /**
         * A list of errors resulting from problematic configs. This list will be truncated after 100 errors, although it is unlikely for that many errors to simultaneously exist.
         */
        errors?: Schema$ConfigManagementSyncError[];
        /**
         * Token indicating the state of the importer.
         */
        importToken?: string | null;
        /**
         * Deprecated: use last_sync_time instead. Timestamp of when ACM last successfully synced the repo The time format is specified in https://golang.org/pkg/time/#Time.String
         */
        lastSync?: string | null;
        /**
         * Timestamp type of when ACM last successfully synced the repo
         */
        lastSyncTime?: string | null;
        /**
         * Token indicating the state of the repo.
         */
        sourceToken?: string | null;
        /**
         * Token indicating the state of the syncer.
         */
        syncToken?: string | null;
    }
    /**
     * ConnectAgentResource represents a Kubernetes resource manifest for Connect Agent deployment.
     */
    export interface Schema$ConnectAgentResource {
        /**
         * YAML manifest of the resource.
         */
        manifest?: string | null;
        /**
         * Kubernetes type of the resource.
         */
        type?: Schema$TypeMeta;
    }
    /**
     * **Dataplane V2**: Spec
     */
    export interface Schema$DataplaneV2FeatureSpec {
        /**
         * Enable dataplane-v2 based encryption for multiple clusters.
         */
        enableEncryption?: boolean | null;
    }
    /**
     * DefaultClusterConfig describes the default cluster configurations to be applied to all clusters born-in-fleet.
     */
    export interface Schema$DefaultClusterConfig {
        /**
         * Optional. Enable/Disable binary authorization features for the cluster.
         */
        binaryAuthorizationConfig?: Schema$BinaryAuthorizationConfig;
        /**
         * Optional. Enable/Disable Compliance Posture features for the cluster. Note that on UpdateFleet, only full replacement of this field is allowed. Users are not allowed for partial updates through field mask.
         */
        compliancePostureConfig?: Schema$CompliancePostureConfig;
        /**
         * Enable/Disable Security Posture features for the cluster.
         */
        securityPostureConfig?: Schema$SecurityPostureConfig;
    }
    /**
     * EdgeCluster contains information specific to Google Edge Clusters.
     */
    export interface Schema$EdgeCluster {
        /**
         * Immutable. Self-link of the Google Cloud resource for the Edge Cluster. For example: //edgecontainer.googleapis.com/projects/my-project/locations/us-west1-a/clusters/my-cluster
         */
        resourceLink?: string | null;
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
     * Feature represents the settings and status of any Fleet Feature.
     */
    export interface Schema$Feature {
        /**
         * Output only. When the Feature resource was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the Feature resource was deleted.
         */
        deleteTime?: string | null;
        /**
         * Optional. Feature configuration applicable to all memberships of the fleet.
         */
        fleetDefaultMemberConfig?: Schema$CommonFleetDefaultMemberConfigSpec;
        /**
         * Labels for this Feature.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Membership-specific configuration for this Feature. If this Feature does not support any per-Membership configuration, this field may be unused. The keys indicate which Membership the configuration is for, in the form: `projects/{p\}/locations/{l\}/memberships/{m\}` Where {p\} is the project, {l\} is a valid location and {m\} is a valid Membership in this project at that location. {p\} WILL match the Feature's project. {p\} will always be returned as the project number, but the project ID is also accepted during input. If the same Membership is specified in the map twice (using the project ID form, and the project number form), exactly ONE of the entries will be saved, with no guarantees as to which. For this reason, it is recommended the same format be used for all entries when mutating a Feature.
         */
        membershipSpecs?: {
            [key: string]: Schema$MembershipFeatureSpec;
        } | null;
        /**
         * Output only. Membership-specific Feature status. If this Feature does report any per-Membership status, this field may be unused. The keys indicate which Membership the state is for, in the form: `projects/{p\}/locations/{l\}/memberships/{m\}` Where {p\} is the project number, {l\} is a valid location and {m\} is a valid Membership in this project at that location. {p\} MUST match the Feature's project number.
         */
        membershipStates?: {
            [key: string]: Schema$MembershipFeatureState;
        } | null;
        /**
         * Output only. The full, unique name of this Feature resource in the format `projects/x/locations/x/features/x`.
         */
        name?: string | null;
        /**
         * Output only. State of the Feature resource itself.
         */
        resourceState?: Schema$FeatureResourceState;
        /**
         * Optional. Scope-specific configuration for this Feature. If this Feature does not support any per-Scope configuration, this field may be unused. The keys indicate which Scope the configuration is for, in the form: `projects/{p\}/locations/global/scopes/{s\}` Where {p\} is the project, {s\} is a valid Scope in this project. {p\} WILL match the Feature's project. {p\} will always be returned as the project number, but the project ID is also accepted during input. If the same Scope is specified in the map twice (using the project ID form, and the project number form), exactly ONE of the entries will be saved, with no guarantees as to which. For this reason, it is recommended the same format be used for all entries when mutating a Feature.
         */
        scopeSpecs?: {
            [key: string]: Schema$ScopeFeatureSpec;
        } | null;
        /**
         * Output only. Scope-specific Feature status. If this Feature does report any per-Scope status, this field may be unused. The keys indicate which Scope the state is for, in the form: `projects/{p\}/locations/global/scopes/{s\}` Where {p\} is the project, {s\} is a valid Scope in this project. {p\} WILL match the Feature's project.
         */
        scopeStates?: {
            [key: string]: Schema$ScopeFeatureState;
        } | null;
        /**
         * Optional. Fleet-wide Feature configuration. If this Feature does not support any Fleet-wide configuration, this field may be unused.
         */
        spec?: Schema$CommonFeatureSpec;
        /**
         * Output only. The Fleet-wide Feature state.
         */
        state?: Schema$CommonFeatureState;
        /**
         * Output only. List of locations that could not be reached while fetching this feature.
         */
        unreachable?: string[] | null;
        /**
         * Output only. When the Feature resource was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * FeatureResourceState describes the state of a Feature *resource* in the GkeHub API. See `FeatureState` for the "running state" of the Feature in the Fleet and across Memberships.
     */
    export interface Schema$FeatureResourceState {
        /**
         * The current state of the Feature resource in the Hub API.
         */
        state?: string | null;
    }
    /**
     * **Workload Certificate**: The Hub-wide input for the WorkloadCertificate feature.
     */
    export interface Schema$FeatureSpec {
        /**
         * Specifies default membership spec. Users can override the default in the member_configs for each member.
         */
        defaultConfig?: Schema$MembershipSpec;
        /**
         * Immutable. Specifies CA configuration.
         */
        provisionGoogleCa?: string | null;
    }
    /**
     * FeatureState describes the high-level state of a Feature. It may be used to describe a Feature's state at the environ-level, or per-membershop, depending on the context.
     */
    export interface Schema$FeatureState {
        /**
         * The high-level, machine-readable status of this Feature.
         */
        code?: string | null;
        /**
         * A human-readable description of the current status.
         */
        description?: string | null;
        /**
         * The time this status and any related Feature-specific details were updated.
         */
        updateTime?: string | null;
    }
    /**
     * Fleet contains the Fleet-wide metadata and configuration.
     */
    export interface Schema$Fleet {
        /**
         * Output only. When the Fleet was created.
         */
        createTime?: string | null;
        /**
         * Optional. The default cluster configurations to apply across the fleet.
         */
        defaultClusterConfig?: Schema$DefaultClusterConfig;
        /**
         * Output only. When the Fleet was deleted.
         */
        deleteTime?: string | null;
        /**
         * Optional. A user-assigned display name of the Fleet. When present, it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, single-quote, double-quote, space, and exclamation point. Example: `Production Fleet`
         */
        displayName?: string | null;
        /**
         * Optional. Labels for this Fleet.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The full, unique resource name of this fleet in the format of `projects/{project\}/locations/{location\}/fleets/{fleet\}`. Each Google Cloud project can have at most one fleet resource, named "default".
         */
        name?: string | null;
        /**
         * Output only. State of the namespace resource.
         */
        state?: Schema$FleetLifecycleState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all Fleet resources. If a Fleet resource is deleted and another resource with the same name is created, it gets a different uid.
         */
        uid?: string | null;
        /**
         * Output only. When the Fleet was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * FleetLifecycleState describes the state of a Fleet resource.
     */
    export interface Schema$FleetLifecycleState {
        /**
         * Output only. The current state of the Fleet resource.
         */
        code?: string | null;
    }
    /**
     * All error details of the fleet observability feature.
     */
    export interface Schema$FleetObservabilityFeatureError {
        /**
         * The code of the error.
         */
        code?: string | null;
        /**
         * A human-readable description of the current status.
         */
        description?: string | null;
    }
    /**
     * **Fleet Observability**: The Hub-wide input for the FleetObservability feature.
     */
    export interface Schema$FleetObservabilityFeatureSpec {
        /**
         * Specified if fleet logging feature is enabled for the entire fleet. If UNSPECIFIED, fleet logging feature is disabled for the entire fleet.
         */
        loggingConfig?: Schema$FleetObservabilityLoggingConfig;
    }
    /**
     * **FleetObservability**: Hub-wide Feature for FleetObservability feature. state.
     */
    export interface Schema$FleetObservabilityFeatureState {
        /**
         * The feature state of default logging.
         */
        logging?: Schema$FleetObservabilityFleetObservabilityLoggingState;
        /**
         * The feature state of fleet monitoring.
         */
        monitoring?: Schema$FleetObservabilityFleetObservabilityMonitoringState;
    }
    /**
     * Base state for fleet observability feature.
     */
    export interface Schema$FleetObservabilityFleetObservabilityBaseFeatureState {
        /**
         * The high-level, machine-readable status of this Feature.
         */
        code?: string | null;
        /**
         * Errors after reconciling the monitoring and logging feature if the code is not OK.
         */
        errors?: Schema$FleetObservabilityFeatureError[];
    }
    /**
     * Feature state for logging feature.
     */
    export interface Schema$FleetObservabilityFleetObservabilityLoggingState {
        /**
         * The base feature state of fleet default log.
         */
        defaultLog?: Schema$FleetObservabilityFleetObservabilityBaseFeatureState;
        /**
         * The base feature state of fleet scope log.
         */
        scopeLog?: Schema$FleetObservabilityFleetObservabilityBaseFeatureState;
    }
    /**
     * Feature state for monitoring feature.
     */
    export interface Schema$FleetObservabilityFleetObservabilityMonitoringState {
        /**
         * The base feature state of fleet monitoring feature.
         */
        state?: Schema$FleetObservabilityFleetObservabilityBaseFeatureState;
    }
    /**
     * LoggingConfig defines the configuration for different types of logs.
     */
    export interface Schema$FleetObservabilityLoggingConfig {
        /**
         * Specified if applying the default routing config to logs not specified in other configs.
         */
        defaultConfig?: Schema$FleetObservabilityRoutingConfig;
        /**
         * Specified if applying the routing config to all logs for all fleet scopes.
         */
        fleetScopeLogsConfig?: Schema$FleetObservabilityRoutingConfig;
    }
    /**
     * **FleetObservability**: The membership-specific input for FleetObservability feature.
     */
    export interface Schema$FleetObservabilityMembershipSpec {
    }
    /**
     * **FleetObservability**: Membership-specific Feature state for fleetobservability.
     */
    export interface Schema$FleetObservabilityMembershipState {
    }
    /**
     * RoutingConfig configures the behaviour of fleet logging feature.
     */
    export interface Schema$FleetObservabilityRoutingConfig {
        /**
         * mode configures the logs routing mode.
         */
        mode?: string | null;
    }
    /**
     * GenerateConnectManifestResponse contains manifest information for installing/upgrading a Connect agent.
     */
    export interface Schema$GenerateConnectManifestResponse {
        /**
         * The ordered list of Kubernetes resources that need to be applied to the cluster for GKE Connect agent installation/upgrade.
         */
        manifest?: Schema$ConnectAgentResource[];
    }
    /**
     * The response of the exclusivity artifacts manifests for the client to apply.
     */
    export interface Schema$GenerateExclusivityManifestResponse {
        /**
         * The YAML manifest of the membership CRD to apply if a newer version of the CRD is available. Empty if no update needs to be applied.
         */
        crdManifest?: string | null;
        /**
         * The YAML manifest of the membership CR to apply if a new version of the CR is available. Empty if no update needs to be applied.
         */
        crManifest?: string | null;
    }
    /**
     * Response for GenerateRBACRoleBindingYAML.
     */
    export interface Schema$GenerateMembershipRBACRoleBindingYAMLResponse {
        /**
         * a yaml text blob including the RBAC policies.
         */
        roleBindingsYaml?: string | null;
    }
    /**
     * GkeCluster contains information specific to GKE clusters.
     */
    export interface Schema$GkeCluster {
        /**
         * Output only. If cluster_missing is set then it denotes that the GKE cluster no longer exists in the GKE Control Plane.
         */
        clusterMissing?: boolean | null;
        /**
         * Immutable. Self-link of the Google Cloud resource for the GKE cluster. For example: //container.googleapis.com/projects/my-project/locations/us-west1-a/clusters/my-cluster Zonal clusters are also supported.
         */
        resourceLink?: string | null;
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
     * Configuration of an auth method for a member/cluster. Only one authentication method (e.g., OIDC and LDAP) can be set per AuthMethod.
     */
    export interface Schema$IdentityServiceAuthMethod {
        /**
         * AzureAD specific Configuration.
         */
        azureadConfig?: Schema$IdentityServiceAzureADConfig;
        /**
         * GoogleConfig specific configuration.
         */
        googleConfig?: Schema$IdentityServiceGoogleConfig;
        /**
         * LDAP specific configuration.
         */
        ldapConfig?: Schema$IdentityServiceLdapConfig;
        /**
         * Identifier for auth config.
         */
        name?: string | null;
        /**
         * OIDC specific configuration.
         */
        oidcConfig?: Schema$IdentityServiceOidcConfig;
        /**
         * Proxy server address to use for auth method.
         */
        proxy?: string | null;
        /**
         * SAML specific configuration.
         */
        samlConfig?: Schema$IdentityServiceSamlConfig;
    }
    /**
     * Configuration for the AzureAD Auth flow.
     */
    export interface Schema$IdentityServiceAzureADConfig {
        /**
         * ID for the registered client application that makes authentication requests to the Azure AD identity provider.
         */
        clientId?: string | null;
        /**
         * Input only. Unencrypted AzureAD client secret will be passed to the GKE Hub CLH.
         */
        clientSecret?: string | null;
        /**
         * Output only. Encrypted AzureAD client secret.
         */
        encryptedClientSecret?: string | null;
        /**
         * Optional. Format of the AzureAD groups that the client wants for auth.
         */
        groupFormat?: string | null;
        /**
         * The redirect URL that kubectl uses for authorization.
         */
        kubectlRedirectUri?: string | null;
        /**
         * Kind of Azure AD account to be authenticated. Supported values are or for accounts belonging to a specific tenant.
         */
        tenant?: string | null;
        /**
         * Optional. Claim in the AzureAD ID Token that holds the user details.
         */
        userClaim?: string | null;
    }
    /**
     * Configuration options for the AIS diagnostic interface.
     */
    export interface Schema$IdentityServiceDiagnosticInterface {
        /**
         * Determines whether to enable the diagnostic interface.
         */
        enabled?: boolean | null;
        /**
         * Determines the expiration time of the diagnostic interface enablement. When reached, requests to the interface would be automatically rejected.
         */
        expirationTime?: string | null;
    }
    /**
     * Configuration for the Google Plugin Auth flow.
     */
    export interface Schema$IdentityServiceGoogleConfig {
        /**
         * Disable automatic configuration of Google Plugin on supported platforms.
         */
        disable?: boolean | null;
    }
    /**
     * Contains the properties for locating and authenticating groups in the directory.
     */
    export interface Schema$IdentityServiceGroupConfig {
        /**
         * Required. The location of the subtree in the LDAP directory to search for group entries.
         */
        baseDn?: string | null;
        /**
         * Optional. Optional filter to be used when searching for groups a user belongs to. This can be used to explicitly match only certain groups in order to reduce the amount of groups returned for each user. This defaults to "(objectClass=Group)".
         */
        filter?: string | null;
        /**
         * Optional. The identifying name of each group a user belongs to. For example, if this is set to "distinguishedName" then RBACs and other group expectations should be written as full DNs. This defaults to "distinguishedName".
         */
        idAttribute?: string | null;
    }
    /**
     * Holds non-protocol-related configuration options.
     */
    export interface Schema$IdentityServiceIdentityServiceOptions {
        /**
         * Configuration options for the AIS diagnostic interface.
         */
        diagnosticInterface?: Schema$IdentityServiceDiagnosticInterface;
        /**
         * Determines the lifespan of STS tokens issued by Anthos Identity Service.
         */
        sessionDuration?: string | null;
    }
    /**
     * Configuration for the LDAP Auth flow.
     */
    export interface Schema$IdentityServiceLdapConfig {
        /**
         * Optional. Contains the properties for locating and authenticating groups in the directory.
         */
        group?: Schema$IdentityServiceGroupConfig;
        /**
         * Required. Server settings for the external LDAP server.
         */
        server?: Schema$IdentityServiceServerConfig;
        /**
         * Required. Contains the credentials of the service account which is authorized to perform the LDAP search in the directory. The credentials can be supplied by the combination of the DN and password or the client certificate.
         */
        serviceAccount?: Schema$IdentityServiceServiceAccountConfig;
        /**
         * Required. Defines where users exist in the LDAP directory.
         */
        user?: Schema$IdentityServiceUserConfig;
    }
    /**
     * **Anthos Identity Service**: Configuration for a single Membership.
     */
    export interface Schema$IdentityServiceMembershipSpec {
        /**
         * A member may support multiple auth methods.
         */
        authMethods?: Schema$IdentityServiceAuthMethod[];
        /**
         * Optional. non-protocol-related configuration options.
         */
        identityServiceOptions?: Schema$IdentityServiceIdentityServiceOptions;
    }
    /**
     * **Anthos Identity Service**: State for a single Membership.
     */
    export interface Schema$IdentityServiceMembershipState {
        /**
         * The reason of the failure.
         */
        failureReason?: string | null;
        /**
         * Installed AIS version. This is the AIS version installed on this member. The values makes sense iff state is OK.
         */
        installedVersion?: string | null;
        /**
         * Last reconciled membership configuration
         */
        memberConfig?: Schema$IdentityServiceMembershipSpec;
        /**
         * Deployment state on this member
         */
        state?: string | null;
    }
    /**
     * Configuration for OIDC Auth flow.
     */
    export interface Schema$IdentityServiceOidcConfig {
        /**
         * PEM-encoded CA for OIDC provider.
         */
        certificateAuthorityData?: string | null;
        /**
         * ID for OIDC client application.
         */
        clientId?: string | null;
        /**
         * Input only. Unencrypted OIDC client secret will be passed to the GKE Hub CLH.
         */
        clientSecret?: string | null;
        /**
         * Flag to denote if reverse proxy is used to connect to auth provider. This flag should be set to true when provider is not reachable by Google Cloud Console.
         */
        deployCloudConsoleProxy?: boolean | null;
        /**
         * Enable access token.
         */
        enableAccessToken?: boolean | null;
        /**
         * Output only. Encrypted OIDC Client secret
         */
        encryptedClientSecret?: string | null;
        /**
         * Comma-separated list of key-value pairs.
         */
        extraParams?: string | null;
        /**
         * Prefix to prepend to group name.
         */
        groupPrefix?: string | null;
        /**
         * Claim in OIDC ID token that holds group information.
         */
        groupsClaim?: string | null;
        /**
         * URI for the OIDC provider. This should point to the level below .well-known/openid-configuration.
         */
        issuerUri?: string | null;
        /**
         * Registered redirect uri to redirect users going through OAuth flow using kubectl plugin.
         */
        kubectlRedirectUri?: string | null;
        /**
         * Comma-separated list of identifiers.
         */
        scopes?: string | null;
        /**
         * Claim in OIDC ID token that holds username.
         */
        userClaim?: string | null;
        /**
         * Prefix to prepend to user name.
         */
        userPrefix?: string | null;
    }
    /**
     * Configuration for the SAML Auth flow.
     */
    export interface Schema$IdentityServiceSamlConfig {
        /**
         * Optional. The mapping of additional user attributes like nickname, birthday and address etc.. `key` is the name of this additional attribute. `value` is a string presenting as CEL(common expression language, go/cel) used for getting the value from the resources. Take nickname as an example, in this case, `key` is "attribute.nickname" and `value` is "assertion.nickname".
         */
        attributeMapping?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Prefix to prepend to group name.
         */
        groupPrefix?: string | null;
        /**
         * Optional. The SAML attribute to read groups from. This value is expected to be a string and will be passed along as-is (with the option of being prefixed by the `group_prefix`).
         */
        groupsAttribute?: string | null;
        /**
         * Required. The list of IdP certificates to validate the SAML response against.
         */
        identityProviderCertificates?: string[] | null;
        /**
         * Required. The entity ID of the SAML IdP.
         */
        identityProviderId?: string | null;
        /**
         * Required. The URI where the SAML IdP exposes the SSO service.
         */
        identityProviderSsoUri?: string | null;
        /**
         * Optional. The SAML attribute to read username from. If unspecified, the username will be read from the NameID element of the assertion in SAML response. This value is expected to be a string and will be passed along as-is (with the option of being prefixed by the `user_prefix`).
         */
        userAttribute?: string | null;
        /**
         * Optional. Prefix to prepend to user name.
         */
        userPrefix?: string | null;
    }
    /**
     * Server settings for the external LDAP server.
     */
    export interface Schema$IdentityServiceServerConfig {
        /**
         * Optional. Contains a Base64 encoded, PEM formatted certificate authority certificate for the LDAP server. This must be provided for the "ldaps" and "startTLS" connections.
         */
        certificateAuthorityData?: string | null;
        /**
         * Optional. Defines the connection type to communicate with the LDAP server. If `starttls` or `ldaps` is specified, the certificate_authority_data should not be empty.
         */
        connectionType?: string | null;
        /**
         * Required. Defines the hostname or IP of the LDAP server. Port is optional and will default to 389, if unspecified. For example, "ldap.server.example" or "10.10.10.10:389".
         */
        host?: string | null;
    }
    /**
     * Contains the credentials of the service account which is authorized to perform the LDAP search in the directory. The credentials can be supplied by the combination of the DN and password or the client certificate.
     */
    export interface Schema$IdentityServiceServiceAccountConfig {
        /**
         * Credentials for basic auth.
         */
        simpleBindCredentials?: Schema$IdentityServiceSimpleBindCredentials;
    }
    /**
     * The structure holds the LDAP simple binding credential.
     */
    export interface Schema$IdentityServiceSimpleBindCredentials {
        /**
         * Required. The distinguished name(DN) of the service account object/user.
         */
        dn?: string | null;
        /**
         * Output only. The encrypted password of the service account object/user.
         */
        encryptedPassword?: string | null;
        /**
         * Required. Input only. The password of the service account object/user.
         */
        password?: string | null;
    }
    /**
     * Defines where users exist in the LDAP directory.
     */
    export interface Schema$IdentityServiceUserConfig {
        /**
         * Required. The location of the subtree in the LDAP directory to search for user entries.
         */
        baseDn?: string | null;
        /**
         * Optional. Filter to apply when searching for the user. This can be used to further restrict the user accounts which are allowed to login. This defaults to "(objectClass=User)".
         */
        filter?: string | null;
        /**
         * Optional. Determines which attribute to use as the user's identity after they are authenticated. This is distinct from the loginAttribute field to allow users to login with a username, but then have their actual identifier be an email address or full Distinguished Name (DN). For example, setting loginAttribute to "sAMAccountName" and identifierAttribute to "userPrincipalName" would allow a user to login as "bsmith", but actual RBAC policies for the user would be written as "bsmith@example.com". Using "userPrincipalName" is recommended since this will be unique for each user. This defaults to "userPrincipalName".
         */
        idAttribute?: string | null;
        /**
         * Optional. The name of the attribute which matches against the input username. This is used to find the user in the LDAP database e.g. "(=)" and is combined with the optional filter field. This defaults to "userPrincipalName".
         */
        loginAttribute?: string | null;
    }
    /**
     * KubernetesMetadata provides informational metadata for Memberships representing Kubernetes clusters.
     */
    export interface Schema$KubernetesMetadata {
        /**
         * Output only. Kubernetes API server version string as reported by `/version`.
         */
        kubernetesApiServerVersion?: string | null;
        /**
         * Output only. The total memory capacity as reported by the sum of all Kubernetes nodes resources, defined in MB.
         */
        memoryMb?: number | null;
        /**
         * Output only. Node count as reported by Kubernetes nodes resources.
         */
        nodeCount?: number | null;
        /**
         * Output only. Node providerID as reported by the first node in the list of nodes on the Kubernetes endpoint. On Kubernetes platforms that support zero-node clusters (like GKE-on-GCP), the node_count will be zero and the node_provider_id will be empty.
         */
        nodeProviderId?: string | null;
        /**
         * Output only. The time at which these details were last updated. This update_time is different from the Membership-level update_time since EndpointDetails are updated internally for API consumers.
         */
        updateTime?: string | null;
        /**
         * Output only. vCPU count as reported by Kubernetes nodes resources.
         */
        vcpuCount?: number | null;
    }
    /**
     * KubernetesResource contains the YAML manifests and configuration for Membership Kubernetes resources in the cluster. After CreateMembership or UpdateMembership, these resources should be re-applied in the cluster.
     */
    export interface Schema$KubernetesResource {
        /**
         * Output only. The Kubernetes resources for installing the GKE Connect agent This field is only populated in the Membership returned from a successful long-running operation from CreateMembership or UpdateMembership. It is not populated during normal GetMembership or ListMemberships requests. To get the resource manifest after the initial registration, the caller should make a UpdateMembership call with an empty field mask.
         */
        connectResources?: Schema$ResourceManifest[];
        /**
         * Input only. The YAML representation of the Membership CR. This field is ignored for GKE clusters where Hub can read the CR directly. Callers should provide the CR that is currently present in the cluster during CreateMembership or UpdateMembership, or leave this field empty if none exists. The CR manifest is used to validate the cluster has not been registered with another Membership.
         */
        membershipCrManifest?: string | null;
        /**
         * Output only. Additional Kubernetes resources that need to be applied to the cluster after Membership creation, and after every update. This field is only populated in the Membership returned from a successful long-running operation from CreateMembership or UpdateMembership. It is not populated during normal GetMembership or ListMemberships requests. To get the resource manifest after the initial registration, the caller should make a UpdateMembership call with an empty field mask.
         */
        membershipResources?: Schema$ResourceManifest[];
        /**
         * Optional. Options for Kubernetes resource generation.
         */
        resourceOptions?: Schema$ResourceOptions;
    }
    /**
     * Response message for the `GkeHub.ListAdminClusterMemberships` method.
     */
    export interface Schema$ListAdminClusterMembershipsResponse {
        /**
         * The list of matching Memberships of admin clusters.
         */
        adminClusterMemberships?: Schema$Membership[];
        /**
         * A token to request the next page of resources from the `ListAdminClusterMemberships` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * List of locations that could not be reached while fetching this list.
         */
        unreachable?: string[] | null;
    }
    /**
     * List of Memberships bound to a Scope.
     */
    export interface Schema$ListBoundMembershipsResponse {
        /**
         * The list of Memberships bound to the given Scope.
         */
        memberships?: Schema$Membership[];
        /**
         * A token to request the next page of resources from the `ListBoundMemberships` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * List of locations that could not be reached while fetching this list.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for the `GkeHub.ListFeatures` method.
     */
    export interface Schema$ListFeaturesResponse {
        /**
         * A token to request the next page of resources from the `ListFeatures` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of matching Features
         */
        resources?: Schema$Feature[];
    }
    /**
     * Response message for the `GkeHub.ListFleetsResponse` method.
     */
    export interface Schema$ListFleetsResponse {
        /**
         * The list of matching fleets.
         */
        fleets?: Schema$Fleet[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. The token is only valid for 1h.
         */
        nextPageToken?: string | null;
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
     * List of MembershipBindings.
     */
    export interface Schema$ListMembershipBindingsResponse {
        /**
         * The list of membership_bindings
         */
        membershipBindings?: Schema$MembershipBinding[];
        /**
         * A token to request the next page of resources from the `ListMembershipBindings` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * List of locations that could not be reached while fetching this list.
         */
        unreachable?: string[] | null;
    }
    /**
     * List of Membership RBACRoleBindings.
     */
    export interface Schema$ListMembershipRBACRoleBindingsResponse {
        /**
         * A token to request the next page of resources from the `ListMembershipRBACRoleBindings` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of Membership RBACRoleBindings.
         */
        rbacrolebindings?: Schema$RBACRoleBinding[];
        /**
         * List of locations that could not be reached while fetching this list.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for the `GkeHub.ListMemberships` method.
     */
    export interface Schema$ListMembershipsResponse {
        /**
         * A token to request the next page of resources from the `ListMemberships` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of matching Memberships.
         */
        resources?: Schema$Membership[];
        /**
         * List of locations that could not be reached while fetching this list.
         */
        unreachable?: string[] | null;
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
     * List of permitted Scopes.
     */
    export interface Schema$ListPermittedScopesResponse {
        /**
         * A token to request the next page of resources from the `ListPermittedScopes` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of permitted Scopes
         */
        scopes?: Schema$Scope[];
    }
    /**
     * List of fleet namespaces.
     */
    export interface Schema$ListScopeNamespacesResponse {
        /**
         * A token to request the next page of resources from the `ListNamespaces` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of fleet namespaces
         */
        scopeNamespaces?: Schema$Namespace[];
    }
    /**
     * List of Scope RBACRoleBindings.
     */
    export interface Schema$ListScopeRBACRoleBindingsResponse {
        /**
         * A token to request the next page of resources from the `ListScopeRBACRoleBindings` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of Scope RBACRoleBindings.
         */
        rbacrolebindings?: Schema$RBACRoleBinding[];
    }
    /**
     * List of Scopes.
     */
    export interface Schema$ListScopesResponse {
        /**
         * A token to request the next page of resources from the `ListScopes` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of Scopes
         */
        scopes?: Schema$Scope[];
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
     * Membership contains information about a member cluster.
     */
    export interface Schema$Membership {
        /**
         * Optional. How to identify workloads from this Membership. See the documentation on Workload Identity for more details: https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity
         */
        authority?: Schema$Authority;
        /**
         * Output only. The tier of the cluster.
         */
        clusterTier?: string | null;
        /**
         * Output only. When the Membership was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the Membership was deleted.
         */
        deleteTime?: string | null;
        /**
         * Output only. Description of this membership, limited to 63 characters. Must match the regex: `a-zA-Z0-9*` This field is present for legacy purposes.
         */
        description?: string | null;
        /**
         * Optional. Endpoint information to reach this member.
         */
        endpoint?: Schema$MembershipEndpoint;
        /**
         * Optional. An externally-generated and managed ID for this Membership. This ID may be modified after creation, but this is not recommended. The ID must match the regex: `a-zA-Z0-9*` If this Membership represents a Kubernetes cluster, this value should be set to the UID of the `kube-system` namespace object.
         */
        externalId?: string | null;
        /**
         * Optional. Labels for this membership. These labels are not leveraged by multi-cluster features, instead, we prefer cluster labels, which can be set on GKE cluster or other cluster types.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. For clusters using Connect, the timestamp of the most recent connection established with Google Cloud. This time is updated every several minutes, not continuously. For clusters that do not use GKE Connect, or that have never connected successfully, this field will be unset.
         */
        lastConnectionTime?: string | null;
        /**
         * Optional. The monitoring config information for this membership.
         */
        monitoringConfig?: Schema$MonitoringConfig;
        /**
         * Output only. The full, unique name of this Membership resource in the format `projects/x/locations/x/memberships/{membership_id\}`, set during creation. `membership_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        name?: string | null;
        /**
         * Output only. State of the Membership resource.
         */
        state?: Schema$MembershipState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all Membership resources. If a Membership resource is deleted and another resource with the same name is created, it gets a different unique_id.
         */
        uniqueId?: string | null;
        /**
         * Output only. When the Membership was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * MembershipBinding is a subresource of a Membership, representing what Fleet Scopes (or other, future Fleet resources) a Membership is bound to.
     */
    export interface Schema$MembershipBinding {
        /**
         * Output only. When the membership binding was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the membership binding was deleted.
         */
        deleteTime?: string | null;
        /**
         * Optional. Labels for this MembershipBinding.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The resource name for the membershipbinding itself `projects/{project\}/locations/{location\}/memberships/{membership\}/bindings/{membershipbinding\}`
         */
        name?: string | null;
        /**
         * A Scope resource name in the format `projects/x/locations/x/scopes/x`.
         */
        scope?: string | null;
        /**
         * Output only. State of the membership binding resource.
         */
        state?: Schema$MembershipBindingLifecycleState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all membershipbinding resources. If a membershipbinding resource is deleted and another resource with the same name is created, it gets a different uid.
         */
        uid?: string | null;
        /**
         * Output only. When the membership binding was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * MembershipBindingLifecycleState describes the state of a Binding resource.
     */
    export interface Schema$MembershipBindingLifecycleState {
        /**
         * Output only. The current state of the MembershipBinding resource.
         */
        code?: string | null;
    }
    /**
     * MembershipEndpoint contains information needed to contact a Kubernetes API, endpoint and any additional Kubernetes metadata.
     */
    export interface Schema$MembershipEndpoint {
        /**
         * Optional. Specific information for a GDC Edge Appliance cluster.
         */
        applianceCluster?: Schema$ApplianceCluster;
        /**
         * Optional. Specific information for a Google Edge cluster.
         */
        edgeCluster?: Schema$EdgeCluster;
        /**
         * Optional. Specific information for a GKE-on-GCP cluster.
         */
        gkeCluster?: Schema$GkeCluster;
        /**
         * Output only. Whether the lifecycle of this membership is managed by a google cluster platform service.
         */
        googleManaged?: boolean | null;
        /**
         * Output only. Useful Kubernetes-specific metadata.
         */
        kubernetesMetadata?: Schema$KubernetesMetadata;
        /**
         * Optional. The in-cluster Kubernetes Resources that should be applied for a correctly registered cluster, in the steady state. These resources: * Ensure that the cluster is exclusively registered to one and only one Hub Membership. * Propagate Workload Pool Information available in the Membership Authority field. * Ensure proper initial configuration of default Hub Features.
         */
        kubernetesResource?: Schema$KubernetesResource;
        /**
         * Optional. Specific information for a GKE Multi-Cloud cluster.
         */
        multiCloudCluster?: Schema$MultiCloudCluster;
        /**
         * Optional. Specific information for a GKE On-Prem cluster. An onprem user-cluster who has no resourceLink is not allowed to use this field, it should have a nil "type" instead.
         */
        onPremCluster?: Schema$OnPremCluster;
    }
    /**
     * MembershipFeatureSpec contains configuration information for a single Membership.
     */
    export interface Schema$MembershipFeatureSpec {
        /**
         * Cloud Build-specific spec
         */
        cloudbuild?: Schema$CloudBuildMembershipSpec;
        /**
         * Config Management-specific spec.
         */
        configmanagement?: Schema$ConfigManagementMembershipSpec;
        /**
         * Fleet observability membership spec
         */
        fleetobservability?: Schema$FleetObservabilityMembershipSpec;
        /**
         * Identity Service-specific spec.
         */
        identityservice?: Schema$IdentityServiceMembershipSpec;
        /**
         * Anthos Service Mesh-specific spec
         */
        mesh?: Schema$ServiceMeshMembershipSpec;
        /**
         * FNS Actuation membership spec
         */
        namespaceactuation?: Schema$NamespaceActuationMembershipSpec;
        /**
         * Whether this per-Membership spec was inherited from a fleet-level default. This field can be updated by users by either overriding a Membership config (updated to USER implicitly) or setting to FLEET explicitly.
         */
        origin?: Schema$Origin;
        /**
         * Policy Controller spec.
         */
        policycontroller?: Schema$PolicyControllerMembershipSpec;
        /**
         * Workload Certificate spec.
         */
        workloadcertificate?: Schema$MembershipSpec;
    }
    /**
     * MembershipFeatureState contains Feature status information for a single Membership.
     */
    export interface Schema$MembershipFeatureState {
        /**
         * Appdevexperience specific state.
         */
        appdevexperience?: Schema$AppDevExperienceFeatureState;
        /**
         * ClusterUpgrade state.
         */
        clusterupgrade?: Schema$ClusterUpgradeMembershipState;
        /**
         * Config Management-specific state.
         */
        configmanagement?: Schema$ConfigManagementMembershipState;
        /**
         * Fleet observability membership state.
         */
        fleetobservability?: Schema$FleetObservabilityMembershipState;
        /**
         * Identity Service-specific state.
         */
        identityservice?: Schema$IdentityServiceMembershipState;
        /**
         * Metering-specific state.
         */
        metering?: Schema$MeteringMembershipState;
        /**
         * FNS Actuation membership state
         */
        namespaceactuation?: Schema$NamespaceActuationMembershipState;
        /**
         * Policycontroller-specific state.
         */
        policycontroller?: Schema$PolicyControllerMembershipState;
        /**
         * Service Mesh-specific state.
         */
        servicemesh?: Schema$ServiceMeshMembershipState;
        /**
         * The high-level state of this Feature for a single membership.
         */
        state?: Schema$FeatureState;
        /**
         * Workload Identity membership specific state.
         */
        workloadidentity?: Schema$WorkloadIdentityMembershipState;
    }
    /**
     * **Workload Certificate**: The membership-specific input for WorkloadCertificate feature.
     */
    export interface Schema$MembershipSpec {
        /**
         * Specifies workload certificate management.
         */
        certificateManagement?: string | null;
    }
    /**
     * MembershipState describes the state of a Membership resource.
     */
    export interface Schema$MembershipState {
        /**
         * Output only. The current state of the Membership resource.
         */
        code?: string | null;
    }
    /**
     * **Metering**: Per-Membership Feature State.
     */
    export interface Schema$MeteringMembershipState {
        /**
         * The time stamp of the most recent measurement of the number of vCPUs in the cluster.
         */
        lastMeasurementTime?: string | null;
        /**
         * The vCPUs capacity in the cluster according to the most recent measurement (1/1000 precision).
         */
        preciseLastMeasuredClusterVcpuCapacity?: number | null;
    }
    /**
     * MonitoringConfig informs Fleet-based applications/services/UIs how the metrics for the underlying cluster is reported to cloud monitoring services. It can be set from empty to non-empty, but can't be mutated directly to prevent accidentally breaking the constinousty of metrics.
     */
    export interface Schema$MonitoringConfig {
        /**
         * Optional. Cluster name used to report metrics. For Anthos on VMWare/Baremetal/MultiCloud clusters, it would be in format {cluster_type\}/{cluster_name\}, e.g., "awsClusters/cluster_1".
         */
        cluster?: string | null;
        /**
         * Optional. For GKE and Multicloud clusters, this is the UUID of the cluster resource. For VMWare and Baremetal clusters, this is the kube-system UID.
         */
        clusterHash?: string | null;
        /**
         * Optional. Kubernetes system metrics, if available, are written to this prefix. This defaults to kubernetes.io for GKE, and kubernetes.io/anthos for Anthos eventually. Noted: Anthos MultiCloud will have kubernetes.io prefix today but will migration to be under kubernetes.io/anthos.
         */
        kubernetesMetricsPrefix?: string | null;
        /**
         * Optional. Location used to report Metrics
         */
        location?: string | null;
        /**
         * Optional. Project used to report Metrics
         */
        projectId?: string | null;
    }
    /**
     * MultiCloudCluster contains information specific to GKE Multi-Cloud clusters.
     */
    export interface Schema$MultiCloudCluster {
        /**
         * Output only. If cluster_missing is set then it denotes that API(gkemulticloud.googleapis.com) resource for this GKE Multi-Cloud cluster no longer exists.
         */
        clusterMissing?: boolean | null;
        /**
         * Immutable. Self-link of the Google Cloud resource for the GKE Multi-Cloud cluster. For example: //gkemulticloud.googleapis.com/projects/my-project/locations/us-west1-a/awsClusters/my-cluster //gkemulticloud.googleapis.com/projects/my-project/locations/us-west1-a/azureClusters/my-cluster //gkemulticloud.googleapis.com/projects/my-project/locations/us-west1-a/attachedClusters/my-cluster
         */
        resourceLink?: string | null;
    }
    /**
     * **Multi-cluster Ingress**: The configuration for the MultiClusterIngress feature.
     */
    export interface Schema$MultiClusterIngressFeatureSpec {
        /**
         * Deprecated: This field will be ignored and should not be set. Customer's billing structure.
         */
        billing?: string | null;
        /**
         * Fully-qualified Membership name which hosts the MultiClusterIngress CRD. Example: `projects/foo-proj/locations/global/memberships/bar`
         */
        configMembership?: string | null;
    }
    /**
     * Namespace represents a namespace across the Fleet
     */
    export interface Schema$Namespace {
        /**
         * Output only. When the namespace was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the namespace was deleted.
         */
        deleteTime?: string | null;
        /**
         * Optional. Labels for this Namespace.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The resource name for the namespace `projects/{project\}/locations/{location\}/namespaces/{namespace\}`
         */
        name?: string | null;
        /**
         * Optional. Namespace-level cluster namespace labels. These labels are applied to the related namespace of the member clusters bound to the parent Scope. Scope-level labels (`namespace_labels` in the Fleet Scope resource) take precedence over Namespace-level labels if they share a key. Keys and values must be Kubernetes-conformant.
         */
        namespaceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. Scope associated with the namespace
         */
        scope?: string | null;
        /**
         * Output only. State of the namespace resource.
         */
        state?: Schema$NamespaceLifecycleState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all namespace resources. If a namespace resource is deleted and another resource with the same name is created, it gets a different uid.
         */
        uid?: string | null;
        /**
         * Output only. When the namespace was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * An empty spec for actuation feature. This is required since Feature proto requires a spec.
     */
    export interface Schema$NamespaceActuationFeatureSpec {
        /**
         * actuation_mode controls the behavior of the controller
         */
        actuationMode?: string | null;
    }
    /**
     * NamespaceActuation Feature State.
     */
    export interface Schema$NamespaceActuationFeatureState {
    }
    /**
     * **Namespace Actuation**: The membership-specific input for NamespaceActuation feature.
     */
    export interface Schema$NamespaceActuationMembershipSpec {
    }
    /**
     * **Namespace Actuation**: An empty state left as an example membership-specific Feature state.
     */
    export interface Schema$NamespaceActuationMembershipState {
    }
    /**
     * NamespaceLifecycleState describes the state of a Namespace resource.
     */
    export interface Schema$NamespaceLifecycleState {
        /**
         * Output only. The current state of the Namespace resource.
         */
        code?: string | null;
    }
    /**
     * OnPremCluster contains information specific to GKE On-Prem clusters.
     */
    export interface Schema$OnPremCluster {
        /**
         * Immutable. Whether the cluster is an admin cluster.
         */
        adminCluster?: boolean | null;
        /**
         * Output only. If cluster_missing is set then it denotes that API(gkeonprem.googleapis.com) resource for this GKE On-Prem cluster no longer exists.
         */
        clusterMissing?: boolean | null;
        /**
         * Immutable. The on prem cluster's type.
         */
        clusterType?: string | null;
        /**
         * Immutable. Self-link of the Google Cloud resource for the GKE On-Prem cluster. For example: //gkeonprem.googleapis.com/projects/my-project/locations/us-west1-a/vmwareClusters/my-cluster //gkeonprem.googleapis.com/projects/my-project/locations/us-west1-a/bareMetalClusters/my-cluster
         */
        resourceLink?: string | null;
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
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
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
     * Origin defines where this MembershipFeatureSpec originated from.
     */
    export interface Schema$Origin {
        /**
         * Type specifies which type of origin is set.
         */
        type?: string | null;
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
     * Binauthz policy that applies to this cluster.
     */
    export interface Schema$PolicyBinding {
        /**
         * The relative resource name of the binauthz platform policy to audit. GKE platform policies have the following format: `projects/{project_number\}/platforms/gke/policies/{policy_id\}`.
         */
        name?: string | null;
    }
    /**
     * BundleInstallSpec is the specification configuration for a single managed bundle.
     */
    export interface Schema$PolicyControllerBundleInstallSpec {
        /**
         * The set of namespaces to be exempted from the bundle.
         */
        exemptedNamespaces?: string[] | null;
    }
    /**
     * Configuration for Policy Controller
     */
    export interface Schema$PolicyControllerHubConfig {
        /**
         * Sets the interval for Policy Controller Audit Scans (in seconds). When set to 0, this disables audit functionality altogether.
         */
        auditIntervalSeconds?: string | null;
        /**
         * The maximum number of audit violations to be stored in a constraint. If not set, the internal default (currently 20) will be used.
         */
        constraintViolationLimit?: string | null;
        /**
         * Map of deployment configs to deployments ("admission", "audit", "mutation').
         */
        deploymentConfigs?: {
            [key: string]: Schema$PolicyControllerPolicyControllerDeploymentConfig;
        } | null;
        /**
         * The set of namespaces that are excluded from Policy Controller checks. Namespaces do not need to currently exist on the cluster.
         */
        exemptableNamespaces?: string[] | null;
        /**
         * The install_spec represents the intended state specified by the latest request that mutated install_spec in the feature spec, not the lifecycle state of the feature observed by the Hub feature controller that is reported in the feature state.
         */
        installSpec?: string | null;
        /**
         * Logs all denies and dry run failures.
         */
        logDeniesEnabled?: boolean | null;
        /**
         * Monitoring specifies the configuration of monitoring.
         */
        monitoring?: Schema$PolicyControllerMonitoringConfig;
        /**
         * Enables the ability to mutate resources using Policy Controller.
         */
        mutationEnabled?: boolean | null;
        /**
         * Specifies the desired policy content on the cluster
         */
        policyContent?: Schema$PolicyControllerPolicyContentSpec;
        /**
         * Enables the ability to use Constraint Templates that reference to objects other than the object currently being evaluated.
         */
        referentialRulesEnabled?: boolean | null;
    }
    /**
     * **Policy Controller**: Configuration for a single cluster. Intended to parallel the PolicyController CR.
     */
    export interface Schema$PolicyControllerMembershipSpec {
        /**
         * Policy Controller configuration for the cluster.
         */
        policyControllerHubConfig?: Schema$PolicyControllerHubConfig;
        /**
         * Version of Policy Controller installed.
         */
        version?: string | null;
    }
    /**
     * **Policy Controller**: State for a single cluster.
     */
    export interface Schema$PolicyControllerMembershipState {
        /**
         * Currently these include (also serving as map keys): 1. "admission" 2. "audit" 3. "mutation"
         */
        componentStates?: {
            [key: string]: Schema$PolicyControllerOnClusterState;
        } | null;
        /**
         * The overall content state observed by the Hub Feature controller.
         */
        policyContentState?: Schema$PolicyControllerPolicyContentState;
        /**
         * The overall Policy Controller lifecycle state observed by the Hub Feature controller.
         */
        state?: string | null;
    }
    /**
     * MonitoringConfig specifies the backends Policy Controller should export metrics to. For example, to specify metrics should be exported to Cloud Monitoring and Prometheus, specify backends: ["cloudmonitoring", "prometheus"]
     */
    export interface Schema$PolicyControllerMonitoringConfig {
        /**
         * Specifies the list of backends Policy Controller will export to. An empty list would effectively disable metrics export.
         */
        backends?: string[] | null;
    }
    /**
     * OnClusterState represents the state of a sub-component of Policy Controller.
     */
    export interface Schema$PolicyControllerOnClusterState {
        /**
         * Surface potential errors or information logs.
         */
        details?: string | null;
        /**
         * The lifecycle state of this component.
         */
        state?: string | null;
    }
    /**
     * PolicyContentSpec defines the user's desired content configuration on the cluster.
     */
    export interface Schema$PolicyControllerPolicyContentSpec {
        /**
         * map of bundle name to BundleInstallSpec. The bundle name maps to the `bundleName` key in the `policycontroller.gke.io/constraintData` annotation on a constraint.
         */
        bundles?: {
            [key: string]: Schema$PolicyControllerBundleInstallSpec;
        } | null;
        /**
         * Configures the installation of the Template Library.
         */
        templateLibrary?: Schema$PolicyControllerTemplateLibraryConfig;
    }
    /**
     * The state of the policy controller policy content
     */
    export interface Schema$PolicyControllerPolicyContentState {
        /**
         * The state of the any bundles included in the chosen version of the manifest
         */
        bundleStates?: {
            [key: string]: Schema$PolicyControllerOnClusterState;
        } | null;
        /**
         * The state of the referential data sync configuration. This could represent the state of either the syncSet object(s) or the config object, depending on the version of PoCo configured by the user.
         */
        referentialSyncConfigState?: Schema$PolicyControllerOnClusterState;
        /**
         * The state of the template library
         */
        templateLibraryState?: Schema$PolicyControllerOnClusterState;
    }
    /**
     * Deployment-specific configuration.
     */
    export interface Schema$PolicyControllerPolicyControllerDeploymentConfig {
        /**
         * Container resource requirements.
         */
        containerResources?: Schema$PolicyControllerResourceRequirements;
        /**
         * Pod affinity configuration.
         */
        podAffinity?: string | null;
        /**
         * Pod anti-affinity enablement. Deprecated: use `pod_affinity` instead.
         */
        podAntiAffinity?: boolean | null;
        /**
         * Pod tolerations of node taints.
         */
        podTolerations?: Schema$PolicyControllerToleration[];
        /**
         * Pod replica count.
         */
        replicaCount?: string | null;
    }
    /**
     * ResourceList contains container resource requirements.
     */
    export interface Schema$PolicyControllerResourceList {
        /**
         * CPU requirement expressed in Kubernetes resource units.
         */
        cpu?: string | null;
        /**
         * Memory requirement expressed in Kubernetes resource units.
         */
        memory?: string | null;
    }
    /**
     * ResourceRequirements describes the compute resource requirements.
     */
    export interface Schema$PolicyControllerResourceRequirements {
        /**
         * Limits describes the maximum amount of compute resources allowed for use by the running container.
         */
        limits?: Schema$PolicyControllerResourceList;
        /**
         * Requests describes the amount of compute resources reserved for the container by the kube-scheduler.
         */
        requests?: Schema$PolicyControllerResourceList;
    }
    /**
     * The config specifying which default library templates to install.
     */
    export interface Schema$PolicyControllerTemplateLibraryConfig {
        /**
         * Configures the manner in which the template library is installed on the cluster.
         */
        installation?: string | null;
    }
    /**
     * Toleration of a node taint.
     */
    export interface Schema$PolicyControllerToleration {
        /**
         * Matches a taint effect.
         */
        effect?: string | null;
        /**
         * Matches a taint key (not necessarily unique).
         */
        key?: string | null;
        /**
         * Matches a taint operator.
         */
        operator?: string | null;
        /**
         * Matches a taint value.
         */
        value?: string | null;
    }
    /**
     * RBACRoleBinding represents a rbacrolebinding across the Fleet
     */
    export interface Schema$RBACRoleBinding {
        /**
         * Output only. When the rbacrolebinding was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the rbacrolebinding was deleted.
         */
        deleteTime?: string | null;
        /**
         * group is the group, as seen by the kubernetes cluster.
         */
        group?: string | null;
        /**
         * Optional. Labels for this RBACRolebinding.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The resource name for the rbacrolebinding `projects/{project\}/locations/{location\}/scopes/{scope\}/rbacrolebindings/{rbacrolebinding\}` or `projects/{project\}/locations/{location\}/memberships/{membership\}/rbacrolebindings/{rbacrolebinding\}`
         */
        name?: string | null;
        /**
         * Required. Role to bind to the principal
         */
        role?: Schema$Role;
        /**
         * Output only. State of the rbacrolebinding resource.
         */
        state?: Schema$RBACRoleBindingLifecycleState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all rbacrolebinding resources. If a rbacrolebinding resource is deleted and another resource with the same name is created, it gets a different uid.
         */
        uid?: string | null;
        /**
         * Output only. When the rbacrolebinding was last updated.
         */
        updateTime?: string | null;
        /**
         * user is the name of the user as seen by the kubernetes cluster, example "alice" or "alice@domain.tld"
         */
        user?: string | null;
    }
    /**
     * **RBAC RoleBinding Actuation**: The Hub-wide input for the RBACRoleBindingActuation feature.
     */
    export interface Schema$RBACRoleBindingActuationFeatureSpec {
        /**
         * The list of allowed custom roles (ClusterRoles). If a ClusterRole is not part of this list, it cannot be used in a Scope RBACRoleBinding. If a ClusterRole in this list is in use, it cannot be removed from the list.
         */
        allowedCustomRoles?: string[] | null;
    }
    /**
     * **RBAC RoleBinding Actuation**: An empty state left as an example Hub-wide Feature state.
     */
    export interface Schema$RBACRoleBindingActuationFeatureState {
    }
    /**
     * RBACRoleBindingLifecycleState describes the state of a RbacRoleBinding resource.
     */
    export interface Schema$RBACRoleBindingLifecycleState {
        /**
         * Output only. The current state of the rbacrolebinding resource.
         */
        code?: string | null;
    }
    /**
     * ResourceManifest represents a single Kubernetes resource to be applied to the cluster.
     */
    export interface Schema$ResourceManifest {
        /**
         * Output only. Whether the resource provided in the manifest is `cluster_scoped`. If unset, the manifest is assumed to be namespace scoped. This field is used for REST mapping when applying the resource in a cluster.
         */
        clusterScoped?: boolean | null;
        /**
         * Output only. YAML manifest of the resource.
         */
        manifest?: string | null;
    }
    /**
     * ResourceOptions represent options for Kubernetes resource generation.
     */
    export interface Schema$ResourceOptions {
        /**
         * Optional. The Connect agent version to use for connect_resources. Defaults to the latest GKE Connect version. The version must be a currently supported version, obsolete versions will be rejected.
         */
        connectVersion?: string | null;
        /**
         * Optional. Major version of the Kubernetes cluster. This is only used to determine which version to use for the CustomResourceDefinition resources, `apiextensions/v1beta1` or`apiextensions/v1`.
         */
        k8sVersion?: string | null;
        /**
         * Optional. Use `apiextensions/v1beta1` instead of `apiextensions/v1` for CustomResourceDefinition resources. This option should be set for clusters with Kubernetes apiserver versions <1.16.
         */
        v1beta1Crd?: boolean | null;
    }
    /**
     * Role is the type for Kubernetes roles
     */
    export interface Schema$Role {
        /**
         * Optional. custom_role is the name of a custom KubernetesClusterRole to use.
         */
        customRole?: string | null;
        /**
         * predefined_role is the Kubernetes default role to use
         */
        predefinedRole?: string | null;
    }
    /**
     * Scope represents a Scope in a Fleet.
     */
    export interface Schema$Scope {
        /**
         * Output only. When the scope was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the scope was deleted.
         */
        deleteTime?: string | null;
        /**
         * Optional. Labels for this Scope.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The resource name for the scope `projects/{project\}/locations/{location\}/scopes/{scope\}`
         */
        name?: string | null;
        /**
         * Optional. Scope-level cluster namespace labels. For the member clusters bound to the Scope, these labels are applied to each namespace under the Scope. Scope-level labels take precedence over Namespace-level labels (`namespace_labels` in the Fleet Namespace resource) if they share a key. Keys and values must be Kubernetes-conformant.
         */
        namespaceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. State of the scope resource.
         */
        state?: Schema$ScopeLifecycleState;
        /**
         * Output only. Google-generated UUID for this resource. This is unique across all scope resources. If a scope resource is deleted and another resource with the same name is created, it gets a different uid.
         */
        uid?: string | null;
        /**
         * Output only. When the scope was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * ScopeFeatureSpec contains feature specs for a fleet scope.
     */
    export interface Schema$ScopeFeatureSpec {
        /**
         * Spec for the ClusterUpgrade feature at the scope level
         */
        clusterupgrade?: Schema$ClusterUpgradeScopeSpec;
    }
    /**
     * ScopeFeatureState contains Scope-wide Feature status information.
     */
    export interface Schema$ScopeFeatureState {
        /**
         * State for the ClusterUpgrade feature at the scope level
         */
        clusterupgrade?: Schema$ClusterUpgradeScopeState;
        /**
         * Output only. The "running state" of the Feature in this Scope.
         */
        state?: Schema$FeatureState;
    }
    /**
     * ScopeLifecycleState describes the state of a Scope resource.
     */
    export interface Schema$ScopeLifecycleState {
        /**
         * Output only. The current state of the scope resource.
         */
        code?: string | null;
    }
    /**
     * SecurityPostureConfig defines the flags needed to enable/disable features for the Security Posture API.
     */
    export interface Schema$SecurityPostureConfig {
        /**
         * Sets which mode to use for Security Posture features.
         */
        mode?: string | null;
        /**
         * Sets which mode to use for vulnerability scanning.
         */
        vulnerabilityMode?: string | null;
    }
    /**
     * AnalysisMessage is a single message produced by an analyzer, and it used to communicate to the end user about the state of their Service Mesh configuration.
     */
    export interface Schema$ServiceMeshAnalysisMessage {
        /**
         * A UI can combine these args with a template (based on message_base.type) to produce an internationalized message.
         */
        args?: {
            [key: string]: any;
        } | null;
        /**
         * A human readable description of what the error means. It is suitable for non-internationalize display purposes.
         */
        description?: string | null;
        /**
         * Details common to all types of Istio and ServiceMesh analysis messages.
         */
        messageBase?: Schema$ServiceMeshAnalysisMessageBase;
        /**
         * A list of strings specifying the resource identifiers that were the cause of message generation. A "path" here may be: * MEMBERSHIP_ID if the cause is a specific member cluster * MEMBERSHIP_ID/(NAMESPACE\/)?RESOURCETYPE/NAME if the cause is a resource in a cluster
         */
        resourcePaths?: string[] | null;
    }
    /**
     * AnalysisMessageBase describes some common information that is needed for all messages.
     */
    export interface Schema$ServiceMeshAnalysisMessageBase {
        /**
         * A url pointing to the Service Mesh or Istio documentation for this specific error type.
         */
        documentationUrl?: string | null;
        /**
         * Represents how severe a message is.
         */
        level?: string | null;
        /**
         * Represents the specific type of a message.
         */
        type?: Schema$ServiceMeshType;
    }
    /**
     * Condition being reported.
     */
    export interface Schema$ServiceMeshCondition {
        /**
         * Unique identifier of the condition which describes the condition recognizable to the user.
         */
        code?: string | null;
        /**
         * A short summary about the issue.
         */
        details?: string | null;
        /**
         * Links contains actionable information.
         */
        documentationLink?: string | null;
        /**
         * Severity level of the condition.
         */
        severity?: string | null;
    }
    /**
     * Status of control plane management.
     */
    export interface Schema$ServiceMeshControlPlaneManagement {
        /**
         * Explanation of state.
         */
        details?: Schema$ServiceMeshStatusDetails[];
        /**
         * Output only. Implementation of managed control plane.
         */
        implementation?: string | null;
        /**
         * LifecycleState of control plane management.
         */
        state?: string | null;
    }
    /**
     * Status of data plane management. Only reported per-member.
     */
    export interface Schema$ServiceMeshDataPlaneManagement {
        /**
         * Explanation of the status.
         */
        details?: Schema$ServiceMeshStatusDetails[];
        /**
         * Lifecycle status of data plane management.
         */
        state?: string | null;
    }
    /**
     * Condition being reported.
     */
    export interface Schema$ServiceMeshFeatureCondition {
        /**
         * Unique identifier of the condition which describes the condition recognizable to the user.
         */
        code?: string | null;
        /**
         * A short summary about the issue.
         */
        details?: string | null;
        /**
         * Links contains actionable information.
         */
        documentationLink?: string | null;
        /**
         * Severity level of the condition.
         */
        severity?: string | null;
    }
    /**
     * **Service Mesh**: State for the whole Hub, as analyzed by the Service Mesh Hub Controller.
     */
    export interface Schema$ServiceMeshFeatureState {
        /**
         * Output only. Results of running Service Mesh analyzers.
         */
        analysisMessages?: Schema$ServiceMeshAnalysisMessage[];
        /**
         * Output only. List of conditions reported for this feature.
         */
        conditions?: Schema$ServiceMeshFeatureCondition[];
    }
    /**
     * **Service Mesh**: Spec for a single Membership for the servicemesh feature
     */
    export interface Schema$ServiceMeshMembershipSpec {
        /**
         * Optional. Specifies the API that will be used for configuring the mesh workloads.
         */
        configApi?: string | null;
        /**
         * Deprecated: use `management` instead Enables automatic control plane management.
         */
        controlPlane?: string | null;
        /**
         * Determines which release channel to use for default injection and service mesh APIs.
         */
        defaultChannel?: string | null;
        /**
         * Optional. Enables automatic Service Mesh management.
         */
        management?: string | null;
    }
    /**
     * **Service Mesh**: State for a single Membership, as analyzed by the Service Mesh Hub Controller.
     */
    export interface Schema$ServiceMeshMembershipState {
        /**
         * Output only. Results of running Service Mesh analyzers.
         */
        analysisMessages?: Schema$ServiceMeshAnalysisMessage[];
        /**
         * Output only. List of conditions reported for this membership.
         */
        conditions?: Schema$ServiceMeshCondition[];
        /**
         * The API version (i.e. Istio CRD version) for configuring service mesh in this cluster. This version is influenced by the `default_channel` field.
         */
        configApiVersion?: string | null;
        /**
         * Output only. Status of control plane management
         */
        controlPlaneManagement?: Schema$ServiceMeshControlPlaneManagement;
        /**
         * Output only. Status of data plane management.
         */
        dataPlaneManagement?: Schema$ServiceMeshDataPlaneManagement;
    }
    /**
     * Structured and human-readable details for a status.
     */
    export interface Schema$ServiceMeshStatusDetails {
        /**
         * A machine-readable code that further describes a broad status.
         */
        code?: string | null;
        /**
         * Human-readable explanation of code.
         */
        details?: string | null;
    }
    /**
     * A unique identifier for the type of message. Display_name is intended to be human-readable, code is intended to be machine readable. There should be a one-to-one mapping between display_name and code. (i.e. do not re-use display_names or codes between message types.) See istio.analysis.v1alpha1.AnalysisMessageBase.Type
     */
    export interface Schema$ServiceMeshType {
        /**
         * A 7 character code matching `^IST[0-9]{4\}$` or `^ASM[0-9]{4\}$`, intended to uniquely identify the message type. (e.g. "IST0001" is mapped to the "InternalError" message type.)
         */
        code?: string | null;
        /**
         * A human-readable name for the message type. e.g. "InternalError", "PodMissingProxy". This should be the same for all messages of the same type. (This corresponds to the `name` field in open-source Istio.)
         */
        displayName?: string | null;
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
     * Status specifies state for the subcomponent.
     */
    export interface Schema$Status {
        /**
         * Code specifies AppDevExperienceFeature's subcomponent ready state.
         */
        code?: string | null;
        /**
         * Description is populated if Code is Failed, explaining why it has failed.
         */
        description?: string | null;
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
     * TypeMeta is the type information needed for content unmarshalling of Kubernetes resources in the manifest.
     */
    export interface Schema$TypeMeta {
        /**
         * APIVersion of the resource (e.g. v1).
         */
        apiVersion?: string | null;
        /**
         * Kind of the resource (e.g. Deployment).
         */
        kind?: string | null;
    }
    /**
     * Request message for the `GkeHub.ValidateCreateMembership` method.
     */
    export interface Schema$ValidateCreateMembershipRequest {
        /**
         * Required. Membership resource to be created.
         */
        membership?: Schema$Membership;
        /**
         * Required. Client chosen membership id.
         */
        membershipId?: string | null;
    }
    /**
     * Response message for the `GkeHub.ValidateCreateMembership` method.
     */
    export interface Schema$ValidateCreateMembershipResponse {
        /**
         * Wraps all the validator results.
         */
        validationResults?: Schema$ValidationResult[];
    }
    /**
     * The response of exclusivity artifacts validation result status.
     */
    export interface Schema$ValidateExclusivityResponse {
        /**
         * The validation result. * `OK` means that exclusivity is validated, assuming the manifest produced by GenerateExclusivityManifest is successfully applied. * `ALREADY_EXISTS` means that the Membership CRD is already owned by another Hub. See `status.message` for more information.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * ValidationResults are results set by each validator running during ValidateCreateMembership.
     */
    export interface Schema$ValidationResult {
        /**
         * Additional information for the validation.
         */
        result?: string | null;
        /**
         * Whether the validation is passed or not.
         */
        success?: boolean | null;
        /**
         * Validator type to validate membership with.
         */
        validator?: string | null;
    }
    /**
     * **WorkloadIdentity**: Global feature specification.
     */
    export interface Schema$WorkloadIdentityFeatureSpec {
        /**
         * Pool to be used for Workload Identity. This pool in trust-domain mode is used with Fleet Tenancy, so that sameness can be enforced. ex: projects/example/locations/global/workloadidentitypools/custompool
         */
        scopeTenancyPool?: string | null;
    }
    /**
     * **WorkloadIdentity**: Global feature state.
     */
    export interface Schema$WorkloadIdentityFeatureState {
        /**
         * The state of the IAM namespaces for the fleet.
         */
        namespaceStateDetails?: {
            [key: string]: Schema$WorkloadIdentityNamespaceStateDetail;
        } | null;
        /**
         * Deprecated, will erase after code is changed to use the new field.
         */
        namespaceStates?: {
            [key: string]: string;
        } | null;
        /**
         * The full name of the scope-tenancy pool for the fleet.
         */
        scopeTenancyWorkloadIdentityPool?: string | null;
        /**
         * The full name of the svc.id.goog pool for the fleet.
         */
        workloadIdentityPool?: string | null;
        /**
         * The state of the Workload Identity Pools for the fleet.
         */
        workloadIdentityPoolStateDetails?: {
            [key: string]: Schema$WorkloadIdentityWorkloadIdentityPoolStateDetail;
        } | null;
    }
    /**
     * **WorkloadIdentity**: The membership-specific state for WorkloadIdentity feature.
     */
    export interface Schema$WorkloadIdentityMembershipState {
        /**
         * Deprecated, will erase after code is changed to use the new field.
         */
        description?: string | null;
    }
    /**
     * NamespaceStateDetail represents the state of a IAM namespace.
     */
    export interface Schema$WorkloadIdentityNamespaceStateDetail {
        /**
         * The state of the IAM namespace.
         */
        code?: string | null;
        /**
         * A human-readable description of the current state or returned error.
         */
        description?: string | null;
    }
    /**
     * WorkloadIdentityPoolStateDetail represents the state of the Workload Identity Pools for the fleet.
     */
    export interface Schema$WorkloadIdentityWorkloadIdentityPoolStateDetail {
        /**
         * The state of the Workload Identity Pool.
         */
        code?: string | null;
        /**
         * A human-readable description of the current state or returned error.
         */
        description?: string | null;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        locations: Resource$Organizations$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations {
        context: APIRequestContext;
        fleets: Resource$Organizations$Locations$Fleets;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Locations$Fleets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns all fleets within an organization or a project that the caller has access to.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Fleets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Fleets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFleetsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Fleets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Fleets$List, options: MethodOptions | BodyResponseCallback<Schema$ListFleetsResponse>, callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Fleets$List, callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Fleets$List extends StandardParameters {
        /**
         * Optional. The maximum number of fleets to return. The service may return fewer than this value. If unspecified, at most 200 fleets will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListFleets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListFleets` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The organization or project to list for Fleets under, in the format `organizations/x/locations/x` or `projects/x/locations/x`.
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
        features: Resource$Projects$Locations$Features;
        fleets: Resource$Projects$Locations$Fleets;
        memberships: Resource$Projects$Locations$Memberships;
        operations: Resource$Projects$Locations$Operations;
        scopes: Resource$Projects$Locations$Scopes;
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
    export class Resource$Projects$Locations$Features {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Adds a new Feature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Features$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Features$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Features$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Features$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Features$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Removes a Feature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Features$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Features$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Features$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Features$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Features$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single Feature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Features$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Features$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Feature>>;
        get(params: Params$Resource$Projects$Locations$Features$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Features$Get, options: MethodOptions | BodyResponseCallback<Schema$Feature>, callback: BodyResponseCallback<Schema$Feature>): void;
        get(params: Params$Resource$Projects$Locations$Features$Get, callback: BodyResponseCallback<Schema$Feature>): void;
        get(callback: BodyResponseCallback<Schema$Feature>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Features$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Features$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Features$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Features$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Features$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists Features in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Features$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Features$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFeaturesResponse>>;
        list(params: Params$Resource$Projects$Locations$Features$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Features$List, options: MethodOptions | BodyResponseCallback<Schema$ListFeaturesResponse>, callback: BodyResponseCallback<Schema$ListFeaturesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Features$List, callback: BodyResponseCallback<Schema$ListFeaturesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFeaturesResponse>): void;
        /**
         * Updates an existing Feature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Features$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Features$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Features$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Features$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Features$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Features$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Features$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Features$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Features$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Features$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Features$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Features$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Features$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Features$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Features$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Features$Create extends StandardParameters {
        /**
         * The ID of the feature to create.
         */
        featureId?: string;
        /**
         * Required. The parent (project and location) where the Feature will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Feature;
    }
    export interface Params$Resource$Projects$Locations$Features$Delete extends StandardParameters {
        /**
         * If set to true, the delete will ignore any outstanding resources for this Feature (that is, `FeatureState.has_resources` is set to true). These resources will NOT be cleaned up or modified in any way.
         */
        force?: boolean;
        /**
         * Required. The Feature resource name in the format `projects/x/locations/x/features/x`.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Features$Get extends StandardParameters {
        /**
         * Required. The Feature resource name in the format `projects/x/locations/x/features/x`
         */
        name?: string;
        /**
         * Optional. If set to true, the response will return partial results when some regions are unreachable and the unreachable field in Feature proto will be populated. If set to false, the request will fail when some regions are unreachable.
         */
        returnPartialSuccess?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Features$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Features$List extends StandardParameters {
        /**
         * Lists Features that match the filter expression, following the syntax outlined in https://google.aip.dev/160. Examples: - Feature with the name "servicemesh" in project "foo-proj": name = "projects/foo-proj/locations/global/features/servicemesh" - Features that have a label called `foo`: labels.foo:* - Features that have a label called `foo` whose value is `bar`: labels.foo = bar
         */
        filter?: string;
        /**
         * One or more fields to compare and use to sort the output. See https://google.aip.dev/132#ordering.
         */
        orderBy?: string;
        /**
         * When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Token returned by previous call to `ListFeatures` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Features will be listed. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Optional. If set to true, the response will return partial results when some regions are unreachable and the unreachable field in Feature proto will be populated. If set to false, the request will fail when some regions are unreachable.
         */
        returnPartialSuccess?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Features$Patch extends StandardParameters {
        /**
         * Required. The Feature resource name in the format `projects/x/locations/x/features/x`.
         */
        name?: string;
        /**
         * A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Mask of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Feature;
    }
    export interface Params$Resource$Projects$Locations$Features$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Features$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Fleets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a fleet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Fleets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Fleets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Fleets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Fleets$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Fleets$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Removes a Fleet. There must be no memberships remaining in the Fleet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Fleets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Fleets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Fleets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Fleets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Fleets$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the details of a fleet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Fleets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Fleets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Fleet>>;
        get(params: Params$Resource$Projects$Locations$Fleets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Fleets$Get, options: MethodOptions | BodyResponseCallback<Schema$Fleet>, callback: BodyResponseCallback<Schema$Fleet>): void;
        get(params: Params$Resource$Projects$Locations$Fleets$Get, callback: BodyResponseCallback<Schema$Fleet>): void;
        get(callback: BodyResponseCallback<Schema$Fleet>): void;
        /**
         * Returns all fleets within an organization or a project that the caller has access to.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Fleets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Fleets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFleetsResponse>>;
        list(params: Params$Resource$Projects$Locations$Fleets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Fleets$List, options: MethodOptions | BodyResponseCallback<Schema$ListFleetsResponse>, callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Fleets$List, callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFleetsResponse>): void;
        /**
         * Updates a fleet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Fleets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Fleets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Fleets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Fleets$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Fleets$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Fleets$Create extends StandardParameters {
        /**
         * Required. The parent (project and location) where the Fleet will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Fleet;
    }
    export interface Params$Resource$Projects$Locations$Fleets$Delete extends StandardParameters {
        /**
         * Required. The Fleet resource name in the format `projects/x/locations/x/fleets/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Fleets$Get extends StandardParameters {
        /**
         * Required. The Fleet resource name in the format `projects/x/locations/x/fleets/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Fleets$List extends StandardParameters {
        /**
         * Optional. The maximum number of fleets to return. The service may return fewer than this value. If unspecified, at most 200 fleets will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListFleets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListFleets` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The organization or project to list for Fleets under, in the format `organizations/x/locations/x` or `projects/x/locations/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Fleets$Patch extends StandardParameters {
        /**
         * Output only. The full, unique resource name of this fleet in the format of `projects/{project\}/locations/{location\}/fleets/{fleet\}`. Each Google Cloud project can have at most one fleet resource, named "default".
         */
        name?: string;
        /**
         * Required. The fields to be updated;
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Fleet;
    }
    export class Resource$Projects$Locations$Memberships {
        context: APIRequestContext;
        bindings: Resource$Projects$Locations$Memberships$Bindings;
        rbacrolebindings: Resource$Projects$Locations$Memberships$Rbacrolebindings;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Membership. **This is currently only supported for GKE clusters on Google Cloud**. To register other clusters, follow the instructions at https://cloud.google.com/anthos/multicluster-management/connect/registering-a-cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Memberships$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Memberships$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Memberships$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Removes a Membership. **This is currently only supported for GKE clusters on Google Cloud**. To unregister other clusters, follow the instructions at https://cloud.google.com/anthos/multicluster-management/connect/unregistering-a-cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Memberships$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Memberships$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Memberships$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Generates the manifest for deployment of the GKE connect agent. **This method is used internally by Google-provided libraries.** Most clients should not need to call this method directly.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateConnectManifest(params: Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateConnectManifest(params?: Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateConnectManifestResponse>>;
        generateConnectManifest(params: Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateConnectManifest(params: Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest, options: MethodOptions | BodyResponseCallback<Schema$GenerateConnectManifestResponse>, callback: BodyResponseCallback<Schema$GenerateConnectManifestResponse>): void;
        generateConnectManifest(params: Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest, callback: BodyResponseCallback<Schema$GenerateConnectManifestResponse>): void;
        generateConnectManifest(callback: BodyResponseCallback<Schema$GenerateConnectManifestResponse>): void;
        /**
         * GenerateExclusivityManifest generates the manifests to update the exclusivity artifacts in the cluster if needed. Exclusivity artifacts include the Membership custom resource definition (CRD) and the singleton Membership custom resource (CR). Combined with ValidateExclusivity, exclusivity artifacts guarantee that a Kubernetes cluster is only registered to a single GKE Hub. The Membership CRD is versioned, and may require conversion when the GKE Hub API server begins serving a newer version of the CRD and corresponding CR. The response will be the converted CRD and CR if there are any differences between the versions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateExclusivityManifest(params: Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateExclusivityManifest(params?: Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateExclusivityManifestResponse>>;
        generateExclusivityManifest(params: Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateExclusivityManifest(params: Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest, options: MethodOptions | BodyResponseCallback<Schema$GenerateExclusivityManifestResponse>, callback: BodyResponseCallback<Schema$GenerateExclusivityManifestResponse>): void;
        generateExclusivityManifest(params: Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest, callback: BodyResponseCallback<Schema$GenerateExclusivityManifestResponse>): void;
        generateExclusivityManifest(callback: BodyResponseCallback<Schema$GenerateExclusivityManifestResponse>): void;
        /**
         * Gets the details of a Membership.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Memberships$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Memberships$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Membership>>;
        get(params: Params$Resource$Projects$Locations$Memberships$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Get, options: MethodOptions | BodyResponseCallback<Schema$Membership>, callback: BodyResponseCallback<Schema$Membership>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Get, callback: BodyResponseCallback<Schema$Membership>): void;
        get(callback: BodyResponseCallback<Schema$Membership>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Memberships$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists Memberships in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Memberships$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Memberships$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMembershipsResponse>>;
        list(params: Params$Resource$Projects$Locations$Memberships$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$List, options: MethodOptions | BodyResponseCallback<Schema$ListMembershipsResponse>, callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$List, callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        /**
         * Lists Memberships of admin clusters in a given project and location. **This method is only used internally**.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listAdmin(params: Params$Resource$Projects$Locations$Memberships$Listadmin, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listAdmin(params?: Params$Resource$Projects$Locations$Memberships$Listadmin, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAdminClusterMembershipsResponse>>;
        listAdmin(params: Params$Resource$Projects$Locations$Memberships$Listadmin, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listAdmin(params: Params$Resource$Projects$Locations$Memberships$Listadmin, options: MethodOptions | BodyResponseCallback<Schema$ListAdminClusterMembershipsResponse>, callback: BodyResponseCallback<Schema$ListAdminClusterMembershipsResponse>): void;
        listAdmin(params: Params$Resource$Projects$Locations$Memberships$Listadmin, callback: BodyResponseCallback<Schema$ListAdminClusterMembershipsResponse>): void;
        listAdmin(callback: BodyResponseCallback<Schema$ListAdminClusterMembershipsResponse>): void;
        /**
         * Updates an existing Membership.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Memberships$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Memberships$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Memberships$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Memberships$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Memberships$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Memberships$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Memberships$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Memberships$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Memberships$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Memberships$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * ValidateCreateMembership is a preflight check for CreateMembership. It checks the following: 1. Caller has the required `gkehub.memberships.create` permission. 2. The membership_id is still available.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        validateCreate(params: Params$Resource$Projects$Locations$Memberships$Validatecreate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        validateCreate(params?: Params$Resource$Projects$Locations$Memberships$Validatecreate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ValidateCreateMembershipResponse>>;
        validateCreate(params: Params$Resource$Projects$Locations$Memberships$Validatecreate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        validateCreate(params: Params$Resource$Projects$Locations$Memberships$Validatecreate, options: MethodOptions | BodyResponseCallback<Schema$ValidateCreateMembershipResponse>, callback: BodyResponseCallback<Schema$ValidateCreateMembershipResponse>): void;
        validateCreate(params: Params$Resource$Projects$Locations$Memberships$Validatecreate, callback: BodyResponseCallback<Schema$ValidateCreateMembershipResponse>): void;
        validateCreate(callback: BodyResponseCallback<Schema$ValidateCreateMembershipResponse>): void;
        /**
         * ValidateExclusivity validates the state of exclusivity in the cluster. The validation does not depend on an existing Hub membership resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        validateExclusivity(params: Params$Resource$Projects$Locations$Memberships$Validateexclusivity, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        validateExclusivity(params?: Params$Resource$Projects$Locations$Memberships$Validateexclusivity, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ValidateExclusivityResponse>>;
        validateExclusivity(params: Params$Resource$Projects$Locations$Memberships$Validateexclusivity, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        validateExclusivity(params: Params$Resource$Projects$Locations$Memberships$Validateexclusivity, options: MethodOptions | BodyResponseCallback<Schema$ValidateExclusivityResponse>, callback: BodyResponseCallback<Schema$ValidateExclusivityResponse>): void;
        validateExclusivity(params: Params$Resource$Projects$Locations$Memberships$Validateexclusivity, callback: BodyResponseCallback<Schema$ValidateExclusivityResponse>): void;
        validateExclusivity(callback: BodyResponseCallback<Schema$ValidateExclusivityResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Create extends StandardParameters {
        /**
         * Required. Client chosen ID for the membership. `membership_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        membershipId?: string;
        /**
         * Required. The parent (project and location) where the Memberships will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Membership;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Delete extends StandardParameters {
        /**
         * Optional. If set to true, any subresource from this Membership will also be deleted. Otherwise, the request will only work if the Membership has no subresource.
         */
        force?: boolean;
        /**
         * Required. The Membership resource name in the format `projects/x/locations/x/memberships/x`.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Generateconnectmanifest extends StandardParameters {
        /**
         * Optional. The image pull secret content for the registry, if not public.
         */
        imagePullSecretContent?: string;
        /**
         * Optional. If true, generate the resources for upgrade only. Some resources generated only for installation (e.g. secrets) will be excluded.
         */
        isUpgrade?: boolean;
        /**
         * Required. The Membership resource name the Agent will associate with, in the format `projects/x/locations/x/memberships/x`.
         */
        name?: string;
        /**
         * Optional. Namespace for GKE Connect agent resources. Defaults to `gke-connect`. The Connect Agent is authorized automatically when run in the default namespace. Otherwise, explicit authorization must be granted with an additional IAM binding.
         */
        namespace?: string;
        /**
         * Optional. URI of a proxy if connectivity from the agent to gkeconnect.googleapis.com requires the use of a proxy. Format must be in the form `http(s)://{proxy_address\}`, depending on the HTTP/HTTPS protocol supported by the proxy. This will direct the connect agent's outbound traffic through a HTTP(S) proxy.
         */
        proxy?: string;
        /**
         * Optional. The registry to fetch the connect agent image from. Defaults to gcr.io/gkeconnect.
         */
        registry?: string;
        /**
         * Optional. The Connect agent version to use. Defaults to the most current version.
         */
        version?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Generateexclusivitymanifest extends StandardParameters {
        /**
         * Optional. The YAML manifest of the membership CRD retrieved by `kubectl get customresourcedefinitions membership`. Leave empty if the resource does not exist.
         */
        crdManifest?: string;
        /**
         * Optional. The YAML manifest of the membership CR retrieved by `kubectl get memberships membership`. Leave empty if the resource does not exist.
         */
        crManifest?: string;
        /**
         * Required. The Membership resource name in the format `projects/x/locations/x/memberships/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Get extends StandardParameters {
        /**
         * Required. The Membership resource name in the format `projects/x/locations/x/memberships/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$List extends StandardParameters {
        /**
         * Optional. Lists Memberships that match the filter expression, following the syntax outlined in https://google.aip.dev/160. Examples: - Name is `bar` in project `foo-proj` and location `global`: name = "projects/foo-proj/locations/global/membership/bar" - Memberships that have a label called `foo`: labels.foo:* - Memberships that have a label called `foo` whose value is `bar`: labels.foo = bar - Memberships in the CREATING state: state = CREATING
         */
        filter?: string;
        /**
         * Optional. One or more fields to compare and use to sort the output. See https://google.aip.dev/132#ordering.
         */
        orderBy?: string;
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListMemberships` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Memberships will be listed. Specified in the format `projects/x/locations/x`. `projects/x/locations/-` list memberships in all the regions.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Listadmin extends StandardParameters {
        /**
         * Optional. Lists Memberships of admin clusters that match the filter expression.
         */
        filter?: string;
        /**
         * Optional. One or more fields to compare and use to sort the output. See https://google.aip.dev/132#ordering.
         */
        orderBy?: string;
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListAdminClusterMemberships` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Memberships of admin cluster will be listed. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Patch extends StandardParameters {
        /**
         * Required. The Membership resource name in the format `projects/x/locations/x/memberships/x`.
         */
        name?: string;
        /**
         * Optional. A request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Mask of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Membership;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Validatecreate extends StandardParameters {
        /**
         * Required. The parent (project and location) where the Memberships will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ValidateCreateMembershipRequest;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Validateexclusivity extends StandardParameters {
        /**
         * Optional. The YAML of the membership CR in the cluster. Empty if the membership CR does not exist.
         */
        crManifest?: string;
        /**
         * Required. The intended membership name under the `parent`. This method only does validation in anticipation of a CreateMembership call with the same name.
         */
        intendedMembership?: string;
        /**
         * Required. The parent (project and location) where the Memberships will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Memberships$Bindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a MembershipBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Memberships$Bindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Memberships$Bindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Memberships$Bindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Bindings$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Bindings$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a MembershipBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Memberships$Bindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Memberships$Bindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Memberships$Bindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Bindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Bindings$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the details of a MembershipBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Memberships$Bindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Memberships$Bindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$MembershipBinding>>;
        get(params: Params$Resource$Projects$Locations$Memberships$Bindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Bindings$Get, options: MethodOptions | BodyResponseCallback<Schema$MembershipBinding>, callback: BodyResponseCallback<Schema$MembershipBinding>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Bindings$Get, callback: BodyResponseCallback<Schema$MembershipBinding>): void;
        get(callback: BodyResponseCallback<Schema$MembershipBinding>): void;
        /**
         * Lists MembershipBindings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Memberships$Bindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Memberships$Bindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMembershipBindingsResponse>>;
        list(params: Params$Resource$Projects$Locations$Memberships$Bindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Bindings$List, options: MethodOptions | BodyResponseCallback<Schema$ListMembershipBindingsResponse>, callback: BodyResponseCallback<Schema$ListMembershipBindingsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Bindings$List, callback: BodyResponseCallback<Schema$ListMembershipBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMembershipBindingsResponse>): void;
        /**
         * Updates a MembershipBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Memberships$Bindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Memberships$Bindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Memberships$Bindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Bindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Bindings$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Bindings$Create extends StandardParameters {
        /**
         * Required. The ID to use for the MembershipBinding.
         */
        membershipBindingId?: string;
        /**
         * Required. The parent (project and location) where the MembershipBinding will be created. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MembershipBinding;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Bindings$Delete extends StandardParameters {
        /**
         * Required. The MembershipBinding resource name in the format `projects/x/locations/x/memberships/x/bindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Bindings$Get extends StandardParameters {
        /**
         * Required. The MembershipBinding resource name in the format `projects/x/locations/x/memberships/x/bindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Bindings$List extends StandardParameters {
        /**
         * Optional. Lists MembershipBindings that match the filter expression, following the syntax outlined in https://google.aip.dev/160.
         */
        filter?: string;
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListMembershipBindings` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent Membership for which the MembershipBindings will be listed. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Bindings$Patch extends StandardParameters {
        /**
         * The resource name for the membershipbinding itself `projects/{project\}/locations/{location\}/memberships/{membership\}/bindings/{membershipbinding\}`
         */
        name?: string;
        /**
         * Required. The fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MembershipBinding;
    }
    export class Resource$Projects$Locations$Memberships$Rbacrolebindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Membership RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a Membership RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Generates a YAML of the RBAC policies for the specified RoleBinding and its associated impersonation resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateMembershipRBACRoleBindingYAML(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateMembershipRBACRoleBindingYAML(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateMembershipRBACRoleBindingYAMLResponse>>;
        generateMembershipRBACRoleBindingYAML(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateMembershipRBACRoleBindingYAML(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml, options: MethodOptions | BodyResponseCallback<Schema$GenerateMembershipRBACRoleBindingYAMLResponse>, callback: BodyResponseCallback<Schema$GenerateMembershipRBACRoleBindingYAMLResponse>): void;
        generateMembershipRBACRoleBindingYAML(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml, callback: BodyResponseCallback<Schema$GenerateMembershipRBACRoleBindingYAMLResponse>): void;
        generateMembershipRBACRoleBindingYAML(callback: BodyResponseCallback<Schema$GenerateMembershipRBACRoleBindingYAMLResponse>): void;
        /**
         * Returns the details of a Membership RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RBACRoleBinding>>;
        get(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get, options: MethodOptions | BodyResponseCallback<Schema$RBACRoleBinding>, callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get, callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        get(callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        /**
         * Lists all Membership RBACRoleBindings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMembershipRBACRoleBindingsResponse>>;
        list(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List, options: MethodOptions | BodyResponseCallback<Schema$ListMembershipRBACRoleBindingsResponse>, callback: BodyResponseCallback<Schema$ListMembershipRBACRoleBindingsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List, callback: BodyResponseCallback<Schema$ListMembershipRBACRoleBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMembershipRBACRoleBindingsResponse>): void;
        /**
         * Updates a Membership RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Create extends StandardParameters {
        /**
         * Required. The parent (project and location) where the RBACRoleBinding will be created. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
        /**
         * Required. Client chosen ID for the RBACRoleBinding. `rbacrolebinding_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        rbacrolebindingId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RBACRoleBinding;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Delete extends StandardParameters {
        /**
         * Required. The RBACRoleBinding resource name in the format `projects/x/locations/x/memberships/x/rbacrolebindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Generatemembershiprbacrolebindingyaml extends StandardParameters {
        /**
         * Required. The parent (project and location) where the RBACRoleBinding will be created. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
        /**
         * Required. Client chosen ID for the RBACRoleBinding. `rbacrolebinding_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        rbacrolebindingId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RBACRoleBinding;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Get extends StandardParameters {
        /**
         * Required. The RBACRoleBinding resource name in the format `projects/x/locations/x/memberships/x/rbacrolebindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$List extends StandardParameters {
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListMembershipRBACRoleBindings` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Features will be listed. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Rbacrolebindings$Patch extends StandardParameters {
        /**
         * The resource name for the rbacrolebinding `projects/{project\}/locations/{location\}/scopes/{scope\}/rbacrolebindings/{rbacrolebinding\}` or `projects/{project\}/locations/{location\}/memberships/{membership\}/rbacrolebindings/{rbacrolebinding\}`
         */
        name?: string;
        /**
         * Required. The fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RBACRoleBinding;
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
    export class Resource$Projects$Locations$Scopes {
        context: APIRequestContext;
        namespaces: Resource$Projects$Locations$Scopes$Namespaces;
        rbacrolebindings: Resource$Projects$Locations$Scopes$Rbacrolebindings;
        constructor(context: APIRequestContext);
        /**
         * Creates a Scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Scopes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Scopes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Scopes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a Scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Scopes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Scopes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Scopes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the details of a Scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Scopes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Scopes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Scope>>;
        get(params: Params$Resource$Projects$Locations$Scopes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Get, options: MethodOptions | BodyResponseCallback<Schema$Scope>, callback: BodyResponseCallback<Schema$Scope>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Get, callback: BodyResponseCallback<Schema$Scope>): void;
        get(callback: BodyResponseCallback<Schema$Scope>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Scopes$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists Scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Scopes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Scopes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListScopesResponse>>;
        list(params: Params$Resource$Projects$Locations$Scopes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$List, options: MethodOptions | BodyResponseCallback<Schema$ListScopesResponse>, callback: BodyResponseCallback<Schema$ListScopesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$List, callback: BodyResponseCallback<Schema$ListScopesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListScopesResponse>): void;
        /**
         * Lists Memberships bound to a Scope. The response includes relevant Memberships from all regions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listMemberships(params: Params$Resource$Projects$Locations$Scopes$Listmemberships, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listMemberships(params?: Params$Resource$Projects$Locations$Scopes$Listmemberships, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBoundMembershipsResponse>>;
        listMemberships(params: Params$Resource$Projects$Locations$Scopes$Listmemberships, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listMemberships(params: Params$Resource$Projects$Locations$Scopes$Listmemberships, options: MethodOptions | BodyResponseCallback<Schema$ListBoundMembershipsResponse>, callback: BodyResponseCallback<Schema$ListBoundMembershipsResponse>): void;
        listMemberships(params: Params$Resource$Projects$Locations$Scopes$Listmemberships, callback: BodyResponseCallback<Schema$ListBoundMembershipsResponse>): void;
        listMemberships(callback: BodyResponseCallback<Schema$ListBoundMembershipsResponse>): void;
        /**
         * Lists permitted Scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listPermitted(params: Params$Resource$Projects$Locations$Scopes$Listpermitted, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listPermitted(params?: Params$Resource$Projects$Locations$Scopes$Listpermitted, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPermittedScopesResponse>>;
        listPermitted(params: Params$Resource$Projects$Locations$Scopes$Listpermitted, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listPermitted(params: Params$Resource$Projects$Locations$Scopes$Listpermitted, options: MethodOptions | BodyResponseCallback<Schema$ListPermittedScopesResponse>, callback: BodyResponseCallback<Schema$ListPermittedScopesResponse>): void;
        listPermitted(params: Params$Resource$Projects$Locations$Scopes$Listpermitted, callback: BodyResponseCallback<Schema$ListPermittedScopesResponse>): void;
        listPermitted(callback: BodyResponseCallback<Schema$ListPermittedScopesResponse>): void;
        /**
         * Updates a scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Scopes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Scopes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Scopes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Scopes$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Scopes$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Scopes$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Scopes$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Scopes$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Scopes$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Scopes$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Create extends StandardParameters {
        /**
         * Required. The parent (project and location) where the Scope will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Required. Client chosen ID for the Scope. `scope_id` must be a ????
         */
        scopeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Scope;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Delete extends StandardParameters {
        /**
         * Required. The Scope resource name in the format `projects/x/locations/x/scopes/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Get extends StandardParameters {
        /**
         * Required. The Scope resource name in the format `projects/x/locations/x/scopes/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$List extends StandardParameters {
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListScopes` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Scope will be listed. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Listmemberships extends StandardParameters {
        /**
         * Optional. Lists Memberships that match the filter expression, following the syntax outlined in https://google.aip.dev/160. Currently, filtering can be done only based on Memberships's `name`, `labels`, `create_time`, `update_time`, and `unique_id`.
         */
        filter?: string;
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned. Pagination is currently not supported; therefore, setting this field does not have any impact for now.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListBoundMemberships` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. Name of the Scope, in the format `projects/x/locations/global/scopes/x`, to which the Memberships are bound.
         */
        scopeName?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Listpermitted extends StandardParameters {
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListPermittedScopes` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Scope will be listed. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Patch extends StandardParameters {
        /**
         * The resource name for the scope `projects/{project\}/locations/{location\}/scopes/{scope\}`
         */
        name?: string;
        /**
         * Required. The fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Scope;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Scopes$Namespaces {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a fleet namespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Scopes$Namespaces$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a fleet namespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Scopes$Namespaces$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the details of a fleet namespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Scopes$Namespaces$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Namespace>>;
        get(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Get, options: MethodOptions | BodyResponseCallback<Schema$Namespace>, callback: BodyResponseCallback<Schema$Namespace>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Get, callback: BodyResponseCallback<Schema$Namespace>): void;
        get(callback: BodyResponseCallback<Schema$Namespace>): void;
        /**
         * Lists fleet namespaces.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Scopes$Namespaces$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Scopes$Namespaces$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListScopeNamespacesResponse>>;
        list(params: Params$Resource$Projects$Locations$Scopes$Namespaces$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$Namespaces$List, options: MethodOptions | BodyResponseCallback<Schema$ListScopeNamespacesResponse>, callback: BodyResponseCallback<Schema$ListScopeNamespacesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$Namespaces$List, callback: BodyResponseCallback<Schema$ListScopeNamespacesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListScopeNamespacesResponse>): void;
        /**
         * Updates a fleet namespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Scopes$Namespaces$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Namespaces$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Namespaces$Create extends StandardParameters {
        /**
         * Required. The parent (project and location) where the Namespace will be created. Specified in the format `projects/x/locations/x/scopes/x`.
         */
        parent?: string;
        /**
         * Required. Client chosen ID for the Namespace. `namespace_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        scopeNamespaceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Namespace;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Namespaces$Delete extends StandardParameters {
        /**
         * Required. The Namespace resource name in the format `projects/x/locations/x/scopes/x/namespaces/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Namespaces$Get extends StandardParameters {
        /**
         * Required. The Namespace resource name in the format `projects/x/locations/x/scopes/x/namespaces/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Namespaces$List extends StandardParameters {
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListFeatures` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Features will be listed. Specified in the format `projects/x/locations/x/scopes/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Namespaces$Patch extends StandardParameters {
        /**
         * The resource name for the namespace `projects/{project\}/locations/{location\}/namespaces/{namespace\}`
         */
        name?: string;
        /**
         * Required. The fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Namespace;
    }
    export class Resource$Projects$Locations$Scopes$Rbacrolebindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Scope RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a Scope RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the details of a Scope RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RBACRoleBinding>>;
        get(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get, options: MethodOptions | BodyResponseCallback<Schema$RBACRoleBinding>, callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        get(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get, callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        get(callback: BodyResponseCallback<Schema$RBACRoleBinding>): void;
        /**
         * Lists all Scope RBACRoleBindings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListScopeRBACRoleBindingsResponse>>;
        list(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List, options: MethodOptions | BodyResponseCallback<Schema$ListScopeRBACRoleBindingsResponse>, callback: BodyResponseCallback<Schema$ListScopeRBACRoleBindingsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List, callback: BodyResponseCallback<Schema$ListScopeRBACRoleBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListScopeRBACRoleBindingsResponse>): void;
        /**
         * Updates a Scope RBACRoleBinding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Create extends StandardParameters {
        /**
         * Required. The parent (project and location) where the RBACRoleBinding will be created. Specified in the format `projects/x/locations/x/scopes/x`.
         */
        parent?: string;
        /**
         * Required. Client chosen ID for the RBACRoleBinding. `rbacrolebinding_id` must be a valid RFC 1123 compliant DNS label: 1. At most 63 characters in length 2. It must consist of lower case alphanumeric characters or `-` 3. It must start and end with an alphanumeric character Which can be expressed as the regex: `[a-z0-9]([-a-z0-9]*[a-z0-9])?`, with a maximum length of 63 characters.
         */
        rbacrolebindingId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RBACRoleBinding;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Delete extends StandardParameters {
        /**
         * Required. The RBACRoleBinding resource name in the format `projects/x/locations/x/scopes/x/rbacrolebindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Get extends StandardParameters {
        /**
         * Required. The RBACRoleBinding resource name in the format `projects/x/locations/x/scopes/x/rbacrolebindings/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$List extends StandardParameters {
        /**
         * Optional. When requesting a 'page' of resources, `page_size` specifies number of resources to return. If unspecified or set to 0, all resources will be returned.
         */
        pageSize?: number;
        /**
         * Optional. Token returned by previous call to `ListScopeRBACRoleBindings` which specifies the position in the list from where to continue listing the resources.
         */
        pageToken?: string;
        /**
         * Required. The parent (project and location) where the Features will be listed. Specified in the format `projects/x/locations/x/scopes/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Scopes$Rbacrolebindings$Patch extends StandardParameters {
        /**
         * The resource name for the rbacrolebinding `projects/{project\}/locations/{location\}/scopes/{scope\}/rbacrolebindings/{rbacrolebinding\}` or `projects/{project\}/locations/{location\}/memberships/{membership\}/rbacrolebindings/{rbacrolebinding\}`
         */
        name?: string;
        /**
         * Required. The fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RBACRoleBinding;
    }
    export {};
}
