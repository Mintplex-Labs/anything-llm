import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace gkehub_v2beta {
    export interface Options extends GlobalOptions {
        version: 'v2beta';
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
     * const gkehub = google.gkehub('v2beta');
     * ```
     */
    export class Gkehub {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * State for App Dev Exp Feature.
     */
    export interface Schema$AppDevExperienceState {
        /**
         * Status of subcomponent that detects configured Service Mesh resources.
         */
        networkingInstallSucceeded?: Schema$AppDevExperienceStatus;
    }
    /**
     * Status specifies state for the subcomponent.
     */
    export interface Schema$AppDevExperienceStatus {
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
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * **Cloud Build**: Configurations for each Cloud Build enabled cluster.
     */
    export interface Schema$CloudBuildSpec {
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
     * GKEUpgrade represents a GKE provided upgrade, e.g., control plane upgrade.
     */
    export interface Schema$ClusterUpgradeGKEUpgrade {
        /**
         * Name of the upgrade, e.g., "k8s_control_plane".
         */
        name?: string | null;
        /**
         * Version of the upgrade, e.g., "1.22.1-gke.100".
         */
        version?: string | null;
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
     * MembershipGKEUpgradeState is a GKEUpgrade and its state per-membership.
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
    export interface Schema$ClusterUpgradeState {
        /**
         * Whether this membership is ignored by the feature. For example, manually upgraded clusters can be ignored if they are newer than the default versions of its release channel.
         */
        ignored?: Schema$ClusterUpgradeIgnoredMembership;
        /**
         * Actual upgrade state against desired.
         */
        upgrades?: Schema$ClusterUpgradeMembershipGKEUpgradeState[];
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
     * Configuration for Binauthz.
     */
    export interface Schema$ConfigManagementBinauthzConfig {
        /**
         * Whether binauthz is enabled in this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * State for Binauthz.
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
         * Optional. OCI repo configuration for the cluster.
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
     * The state of ConfigSync's deployment on a cluster.
     */
    export interface Schema$ConfigManagementConfigSyncDeploymentState {
        /**
         * Deployment state of admission-webhook.
         */
        admissionWebhook?: string | null;
        /**
         * Deployment state of the git-sync pod.
         */
        gitSync?: string | null;
        /**
         * Deployment state of the importer pod.
         */
        importer?: string | null;
        /**
         * Deployment state of the monitor pod.
         */
        monitor?: string | null;
        /**
         * Deployment state of otel-collector
         */
        otelCollector?: string | null;
        /**
         * Deployment state of reconciler-manager pod.
         */
        reconcilerManager?: string | null;
        /**
         * Deployment state of resource-group-controller-manager
         */
        resourceGroupControllerManager?: string | null;
        /**
         * Deployment state of root-reconciler.
         */
        rootReconciler?: string | null;
        /**
         * Deployment state of the syncer pod.
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
     * State information for ConfigSync.
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
         * Output only. Information about the deployment of ConfigSync, including the version. of the various Pods deployed
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
         * Output only. The state of ConfigSync's process to sync configs to a cluster.
         */
        syncState?: Schema$ConfigManagementSyncState;
        /**
         * Output only. The version of ConfigSync deployed.
         */
        version?: Schema$ConfigManagementConfigSyncVersion;
    }
    /**
     * Specific versioning information pertaining to ConfigSync's Pods.
     */
    export interface Schema$ConfigManagementConfigSyncVersion {
        /**
         * Version of the deployed admission-webhook pod.
         */
        admissionWebhook?: string | null;
        /**
         * Version of the deployed git-sync pod.
         */
        gitSync?: string | null;
        /**
         * Version of the deployed importer pod.
         */
        importer?: string | null;
        /**
         * Version of the deployed monitor pod.
         */
        monitor?: string | null;
        /**
         * Version of the deployed otel-collector pod
         */
        otelCollector?: string | null;
        /**
         * Version of the deployed reconciler-manager pod.
         */
        reconcilerManager?: string | null;
        /**
         * Version of the deployed resource-group-controller-manager pod
         */
        resourceGroupControllerManager?: string | null;
        /**
         * Version of the deployed reconciler container in root-reconciler pod.
         */
        rootReconciler?: string | null;
        /**
         * Version of the deployed syncer pod.
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
     * Model for a config file in the git repo with an associated Sync error.
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
     * A Kubernetes object's GVK.
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
     * Configuration for Hierarchy Controller.
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
         * The deployment state for Hierarchy Controller extension (e.g. v0.7.0-hc.1).
         */
        extension?: string | null;
        /**
         * The deployment state for open source HNC (e.g. v0.7.0-hc.0).
         */
        hnc?: string | null;
    }
    /**
     * State for Hierarchy Controller.
     */
    export interface Schema$ConfigManagementHierarchyControllerState {
        /**
         * The deployment state for Hierarchy Controller.
         */
        state?: Schema$ConfigManagementHierarchyControllerDeploymentState;
        /**
         * The version for Hierarchy Controller.
         */
        version?: Schema$ConfigManagementHierarchyControllerVersion;
    }
    /**
     * Version for Hierarchy Controller.
     */
    export interface Schema$ConfigManagementHierarchyControllerVersion {
        /**
         * Version for Hierarchy Controller extension.
         */
        extension?: string | null;
        /**
         * Version for open source HNC.
         */
        hnc?: string | null;
    }
    /**
     * Errors pertaining to the installation of ACM.
     */
    export interface Schema$ConfigManagementInstallError {
        /**
         * A string representing the user facing error message.
         */
        errorMessage?: string | null;
    }
    /**
     * OCI repo configuration for a single cluster.
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
     * State information for an ACM's Operator.
     */
    export interface Schema$ConfigManagementOperatorState {
        /**
         * The state of the Operator's deployment.
         */
        deploymentState?: string | null;
        /**
         * Install errors.
         */
        errors?: Schema$ConfigManagementInstallError[];
        /**
         * The semenatic version number of the operator.
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
     * **Anthos Config Management**: Configuration for a single cluster. Intended to parallel the ConfigManagement CR.
     */
    export interface Schema$ConfigManagementSpec {
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
    export interface Schema$ConfigManagementState {
        /**
         * Output only. Binauthz status.
         */
        binauthzState?: Schema$ConfigManagementBinauthzState;
        /**
         * Output only. This field is set to the `cluster_name` field of the Membership Spec if it is not empty. Otherwise, it is set to the cluster's fleet membership name.
         */
        clusterName?: string | null;
        /**
         * Output only. Current sync status.
         */
        configSyncState?: Schema$ConfigManagementConfigSyncState;
        /**
         * Output only. Hierarchy Controller status.
         */
        hierarchyControllerState?: Schema$ConfigManagementHierarchyControllerState;
        /**
         * Output only. Membership configuration in the cluster. This represents the actual state in the cluster, while the MembershipSpec in the FeatureSpec represents the intended state.
         */
        membershipSpec?: Schema$ConfigManagementSpec;
        /**
         * Output only. Current install status of ACM's Operator.
         */
        operatorState?: Schema$ConfigManagementOperatorState;
        /**
         * Output only. PolicyController status.
         */
        policyControllerState?: Schema$ConfigManagementPolicyControllerState;
    }
    /**
     * An ACM created error representing a problem syncing configurations.
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
     * State indicating an ACM's progress syncing configurations to a cluster.
     */
    export interface Schema$ConfigManagementSyncState {
        /**
         * Sync status code.
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
         * Deprecated: use last_sync_time instead. Timestamp of when ACM last successfully synced the repo. The time format is specified in https://golang.org/pkg/time/#Time.String
         */
        lastSync?: string | null;
        /**
         * Timestamp type of when ACM last successfully synced the repo.
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
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * FeatureSpec contains user input per-feature spec information.
     */
    export interface Schema$FeatureSpec {
        /**
         * Cloudbuild-specific FeatureSpec.
         */
        cloudbuild?: Schema$CloudBuildSpec;
        /**
         * Config Management FeatureSpec.
         */
        configmanagement?: Schema$ConfigManagementSpec;
        /**
         * IdentityService FeatureSpec.
         */
        identityservice?: Schema$IdentityServiceSpec;
        /**
         * Whether this per-Feature spec was inherited from a fleet-level default. This field can be updated by users by either overriding a Feature config (updated to USER implicitly) or setting to FLEET explicitly.
         */
        origin?: Schema$Origin;
        /**
         * Policycontroller-specific FeatureSpec.
         */
        policycontroller?: Schema$PolicyControllerSpec;
        /**
         * Rbacrolebindingactuation-specific FeatureSpec.
         */
        rbacrolebindingactuation?: Schema$RBACRoleBindingActuationSpec;
        /**
         * ServiceMesh Feature Spec.
         */
        servicemesh?: Schema$ServiceMeshSpec;
        /**
         * Workloadcertificate-specific FeatureSpec.
         */
        workloadcertificate?: Schema$WorkloadCertificateSpec;
    }
    /**
     * FeatureState contains high-level state information and per-feature state information for this MembershipFeature.
     */
    export interface Schema$FeatureState {
        /**
         * Appdevexperience specific state.
         */
        appdevexperience?: Schema$AppDevExperienceState;
        /**
         * Cluster upgrade state.
         */
        clusterupgrade?: Schema$ClusterUpgradeState;
        /**
         * Config Management state
         */
        configmanagement?: Schema$ConfigManagementState;
        /**
         * Identity service state
         */
        identityservice?: Schema$IdentityServiceState;
        /**
         * Metering state
         */
        metering?: Schema$MeteringState;
        /**
         * Policy Controller state
         */
        policycontroller?: Schema$PolicyControllerState;
        /**
         * RBAC Role Binding Actuation state
         */
        rbacrolebindingactuation?: Schema$RBACRoleBindingActuationState;
        /**
         * Service mesh state
         */
        servicemesh?: Schema$ServiceMeshState;
        /**
         * The high-level state of this MembershipFeature.
         */
        state?: Schema$State;
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
         * GoogleConfig specific configuration
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
     * **IdentityService**: Configuration for a single membership.
     */
    export interface Schema$IdentityServiceSpec {
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
     * **IdentityService**: State for a single membership, analyzed and reported by feature controller.
     */
    export interface Schema$IdentityServiceState {
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
        memberConfig?: Schema$IdentityServiceSpec;
        /**
         * Deployment state on this member
         */
        state?: string | null;
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
     * LifecycleState describes the state of a MembershipFeature *resource* in the GkeHub API. See `FeatureState` for the "running state" of the MembershipFeature.
     */
    export interface Schema$LifecycleState {
        /**
         * Output only. The current state of the Feature resource in the Hub API.
         */
        state?: string | null;
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
     * Response message for the `GkeHubFeature.ListMembershipFeatures` method.
     */
    export interface Schema$ListMembershipFeaturesResponse {
        /**
         * The list of matching MembershipFeatures.
         */
        membershipFeatures?: Schema$MembershipFeature[];
        /**
         * A token to request the next page of resources from the `ListMembershipFeatures` method. The value of an empty string means that there are no more resources to return.
         */
        nextPageToken?: string | null;
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
     * MembershipFeature represents the settings and status of a Fleet Feature enabled on a single Fleet Membership.
     */
    export interface Schema$MembershipFeature {
        /**
         * Output only. When the MembershipFeature resource was created.
         */
        createTime?: string | null;
        /**
         * Output only. When the MembershipFeature resource was deleted.
         */
        deleteTime?: string | null;
        /**
         * GCP labels for this MembershipFeature.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Lifecycle information of the resource itself.
         */
        lifecycleState?: Schema$LifecycleState;
        /**
         * Output only. The resource name of the membershipFeature, in the format: `projects/{project\}/locations/{location\}/memberships/{membership\}/features/{feature\}`. Note that `membershipFeatures` is shortened to `features` in the resource name. (see http://go/aip/122#collection-identifiers)
         */
        name?: string | null;
        /**
         * Optional. Spec of this membershipFeature.
         */
        spec?: Schema$FeatureSpec;
        /**
         * Output only. State of the this membershipFeature.
         */
        state?: Schema$FeatureState;
        /**
         * Output only. When the MembershipFeature resource was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * **Metering**: State for a single membership, analyzed and reported by feature controller.
     */
    export interface Schema$MeteringState {
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
     * Metadata of the long-running operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
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
     * Origin defines where this FeatureSpec originated from.
     */
    export interface Schema$Origin {
        /**
         * Type specifies which type of origin is set.
         */
        type?: string | null;
    }
    /**
     * BundleInstallSpec is the specification configuration for a single managed bundle.
     */
    export interface Schema$PolicyControllerBundleInstallSpec {
        /**
         * the set of namespaces to be exempted from the bundle
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
         * Map of deployment configs to deployments (“admission”, “audit”, “mutation”).
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
     * **Policy Controller**: Configuration for a single cluster. Intended to parallel the PolicyController CR.
     */
    export interface Schema$PolicyControllerSpec {
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
    export interface Schema$PolicyControllerState {
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
     * RBACRoleBindingState is the status of an RBACRoleBinding which exists on a membership.
     */
    export interface Schema$RBACRoleBindingActuationRBACRoleBindingState {
        /**
         * The reason for the failure.
         */
        description?: string | null;
        /**
         * Output only. The state of the RBACRoleBinding.
         */
        state?: string | null;
        /**
         * The time the RBACRoleBinding status was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * **RBAC RoleBinding Actuation**: The membership-specific input for RBACRoleBindingActuation feature.
     */
    export interface Schema$RBACRoleBindingActuationSpec {
    }
    /**
     * **RBAC RoleBinding Actuation**: A membership-specific Feature state for the RBACRoleBindingActuation fleet feature.
     */
    export interface Schema$RBACRoleBindingActuationState {
        /**
         * Output only. The state of RBACRoleBindings using custom roles that exist on the cluster, keyed by RBACRoleBinding resource name with format: projects/{project\}/locations/{location\}/scopes/{scope\}/rbacrolebindings/{rbacrolebinding\}.
         */
        rbacrolebindingStates?: {
            [key: string]: Schema$RBACRoleBindingActuationRBACRoleBindingState;
        } | null;
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
     * **Service Mesh**: Spec for a single Membership for the servicemesh feature
     */
    export interface Schema$ServiceMeshSpec {
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
    export interface Schema$ServiceMeshState {
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
     * High-level state of a MembershipFeature.
     */
    export interface Schema$State {
        /**
         * The high-level, machine-readable status of this MembershipFeature.
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
     * **WorkloadCertificate**: The membership-specific input for WorkloadCertificate feature.
     */
    export interface Schema$WorkloadCertificateSpec {
        /**
         * CertificateManagement specifies workload certificate management.
         */
        certificateManagement?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        memberships: Resource$Projects$Locations$Memberships;
        operations: Resource$Projects$Locations$Operations;
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
    export class Resource$Projects$Locations$Memberships {
        context: APIRequestContext;
        features: Resource$Projects$Locations$Memberships$Features;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Memberships$Features {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates membershipFeature under a given parent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Memberships$Features$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Memberships$Features$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Memberships$Features$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Features$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Memberships$Features$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Removes a membershipFeature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Memberships$Features$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Memberships$Features$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Memberships$Features$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Features$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Memberships$Features$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * ========= MembershipFeature Services ========= Gets details of a membershipFeature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Memberships$Features$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Memberships$Features$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$MembershipFeature>>;
        get(params: Params$Resource$Projects$Locations$Memberships$Features$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Features$Get, options: MethodOptions | BodyResponseCallback<Schema$MembershipFeature>, callback: BodyResponseCallback<Schema$MembershipFeature>): void;
        get(params: Params$Resource$Projects$Locations$Memberships$Features$Get, callback: BodyResponseCallback<Schema$MembershipFeature>): void;
        get(callback: BodyResponseCallback<Schema$MembershipFeature>): void;
        /**
         * Lists MembershipFeatures in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Memberships$Features$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Memberships$Features$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMembershipFeaturesResponse>>;
        list(params: Params$Resource$Projects$Locations$Memberships$Features$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Features$List, options: MethodOptions | BodyResponseCallback<Schema$ListMembershipFeaturesResponse>, callback: BodyResponseCallback<Schema$ListMembershipFeaturesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Memberships$Features$List, callback: BodyResponseCallback<Schema$ListMembershipFeaturesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMembershipFeaturesResponse>): void;
        /**
         * Updates an existing MembershipFeature.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Memberships$Features$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Memberships$Features$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Memberships$Features$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Features$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Memberships$Features$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Features$Create extends StandardParameters {
        /**
         * Required. The ID of the membership_feature to create.
         */
        featureId?: string;
        /**
         * Required. The name of parent where the MembershipFeature will be created. Specified in the format `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
        /**
         * Idempotent request UUID.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MembershipFeature;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Features$Delete extends StandardParameters {
        /**
         * Required. The name of the membershipFeature to be deleted. Specified in the format `projects/x/locations/x/memberships/x/features/x`.
         */
        name?: string;
        /**
         * Idempotent request UUID.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Features$Get extends StandardParameters {
        /**
         * Required. The MembershipFeature resource name in the format `projects/x/locations/x/memberships/x/features/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Features$List extends StandardParameters {
        /**
         * Lists MembershipFeatures that match the filter expression, following the syntax outlined in https://google.aip.dev/160. Examples: - Feature with the name "helloworld" in project "foo-proj" and membership "member-bar": name = "projects/foo-proj/locations/global/memberships/member-bar/features/helloworld" - Features that have a label called `foo`: labels.foo:* - Features that have a label called `foo` whose value is `bar`: labels.foo = bar
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
         * Required. The parent where the MembershipFeature will be listed. In the format: `projects/x/locations/x/memberships/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Memberships$Features$Patch extends StandardParameters {
        /**
         * Optional. If set to true, and the MembershipFeature is not found, a new MembershipFeature will be created. In this situation, `update_mask` is ignored.
         */
        allowMissing?: boolean;
        /**
         * Output only. The resource name of the membershipFeature, in the format: `projects/{project\}/locations/{location\}/memberships/{membership\}/features/{feature\}`. Note that `membershipFeatures` is shortened to `features` in the resource name. (see http://go/aip/122#collection-identifiers)
         */
        name?: string;
        /**
         * Idempotent request UUID.
         */
        requestId?: string;
        /**
         * Required. Mask of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MembershipFeature;
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
    export {};
}
