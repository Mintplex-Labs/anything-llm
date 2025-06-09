import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace container_v1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1beta1';
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
     * Kubernetes Engine API
     *
     * Builds and manages container-based applications, powered by the open source Kubernetes technology.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const container = google.container('v1beta1');
     * ```
     */
    export class Container {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * AcceleratorConfig represents a Hardware Accelerator request.
     */
    export interface Schema$AcceleratorConfig {
        /**
         * The number of the accelerator cards exposed to an instance.
         */
        acceleratorCount?: string | null;
        /**
         * The accelerator type resource name. List of supported accelerators [here](https://cloud.google.com/compute/docs/gpus)
         */
        acceleratorType?: string | null;
        /**
         * The configuration for auto installation of GPU driver.
         */
        gpuDriverInstallationConfig?: Schema$GPUDriverInstallationConfig;
        /**
         * Size of partitions to create on the GPU. Valid values are described in the NVIDIA [mig user guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/#partitioning).
         */
        gpuPartitionSize?: string | null;
        /**
         * The configuration for GPU sharing options.
         */
        gpuSharingConfig?: Schema$GPUSharingConfig;
        /**
         * The number of time-shared GPU resources to expose for each physical GPU.
         */
        maxTimeSharedClientsPerGpu?: string | null;
    }
    /**
     * AdditionalNodeNetworkConfig is the configuration for additional node networks within the NodeNetworkConfig message
     */
    export interface Schema$AdditionalNodeNetworkConfig {
        /**
         * Name of the VPC where the additional interface belongs
         */
        network?: string | null;
        /**
         * Name of the subnetwork where the additional interface belongs
         */
        subnetwork?: string | null;
    }
    /**
     * AdditionalPodNetworkConfig is the configuration for additional pod networks within the NodeNetworkConfig message
     */
    export interface Schema$AdditionalPodNetworkConfig {
        /**
         * The maximum number of pods per node which use this pod network.
         */
        maxPodsPerNode?: Schema$MaxPodsConstraint;
        /**
         * The name of the network attachment for pods to communicate to; cannot be specified along with subnetwork or secondary_pod_range.
         */
        networkAttachment?: string | null;
        /**
         * The name of the secondary range on the subnet which provides IP address for this pod range.
         */
        secondaryPodRange?: string | null;
        /**
         * Name of the subnetwork where the additional pod network belongs.
         */
        subnetwork?: string | null;
    }
    /**
     * AdditionalPodRangesConfig is the configuration for additional pod secondary ranges supporting the ClusterUpdate message.
     */
    export interface Schema$AdditionalPodRangesConfig {
        /**
         * Output only. Information for additional pod range.
         */
        podRangeInfo?: Schema$RangeInfo[];
        /**
         * Name for pod secondary ipv4 range which has the actual range defined ahead.
         */
        podRangeNames?: string[] | null;
    }
    /**
     * Configuration for the addons that can be automatically spun up in the cluster, enabling additional functionality.
     */
    export interface Schema$AddonsConfig {
        /**
         * Configuration for the Cloud Run addon. The `IstioConfig` addon must be enabled in order to enable Cloud Run addon. This option can only be enabled at cluster creation time.
         */
        cloudRunConfig?: Schema$CloudRunConfig;
        /**
         * Configuration for the ConfigConnector add-on, a Kubernetes extension to manage hosted GCP services through the Kubernetes API
         */
        configConnectorConfig?: Schema$ConfigConnectorConfig;
        /**
         * Configuration for NodeLocalDNS, a dns cache running on cluster nodes
         */
        dnsCacheConfig?: Schema$DnsCacheConfig;
        /**
         * Configuration for the Compute Engine Persistent Disk CSI driver.
         */
        gcePersistentDiskCsiDriverConfig?: Schema$GcePersistentDiskCsiDriverConfig;
        /**
         * Configuration for the GCP Filestore CSI driver.
         */
        gcpFilestoreCsiDriverConfig?: Schema$GcpFilestoreCsiDriverConfig;
        /**
         * Configuration for the Cloud Storage Fuse CSI driver.
         */
        gcsFuseCsiDriverConfig?: Schema$GcsFuseCsiDriverConfig;
        /**
         * Configuration for the Backup for GKE agent addon.
         */
        gkeBackupAgentConfig?: Schema$GkeBackupAgentConfig;
        /**
         * Configuration for the horizontal pod autoscaling feature, which increases or decreases the number of replica pods a replication controller has based on the resource usage of the existing pods.
         */
        horizontalPodAutoscaling?: Schema$HorizontalPodAutoscaling;
        /**
         * Configuration for the HTTP (L7) load balancing controller addon, which makes it easy to set up HTTP load balancers for services in a cluster.
         */
        httpLoadBalancing?: Schema$HttpLoadBalancing;
        /**
         * Configuration for Istio, an open platform to connect, manage, and secure microservices.
         */
        istioConfig?: Schema$IstioConfig;
        /**
         * Configuration for the KALM addon, which manages the lifecycle of k8s applications.
         */
        kalmConfig?: Schema$KalmConfig;
        /**
         * Configuration for the Kubernetes Dashboard. This addon is deprecated, and will be disabled in 1.15. It is recommended to use the Cloud Console to manage and monitor your Kubernetes clusters, workloads and applications. For more information, see: https://cloud.google.com/kubernetes-engine/docs/concepts/dashboards
         */
        kubernetesDashboard?: Schema$KubernetesDashboard;
        /**
         * Configuration for NetworkPolicy. This only tracks whether the addon is enabled or not on the Master, it does not track whether network policy is enabled for the nodes.
         */
        networkPolicyConfig?: Schema$NetworkPolicyConfig;
        /**
         * Configuration for the Cloud Storage Parallelstore CSI driver.
         */
        parallelstoreCsiDriverConfig?: Schema$ParallelstoreCsiDriverConfig;
        /**
         * Optional. Configuration for Ray Operator addon.
         */
        rayOperatorConfig?: Schema$RayOperatorConfig;
        /**
         * Optional. Configuration for the StatefulHA add-on.
         */
        statefulHaConfig?: Schema$StatefulHAConfig;
    }
    /**
     * AdvancedDatapathObservabilityConfig specifies configuration of observability features of advanced datapath.
     */
    export interface Schema$AdvancedDatapathObservabilityConfig {
        /**
         * Expose flow metrics on nodes
         */
        enableMetrics?: boolean | null;
        /**
         * Enable Relay component
         */
        enableRelay?: boolean | null;
        /**
         * Method used to make Relay available
         */
        relayMode?: string | null;
    }
    /**
     * Specifies options for controlling advanced machine features.
     */
    export interface Schema$AdvancedMachineFeatures {
        /**
         * Whether or not to enable nested virtualization (defaults to false).
         */
        enableNestedVirtualization?: boolean | null;
        /**
         * The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed.
         */
        threadsPerCore?: string | null;
    }
    /**
     * Configuration for returning group information from authenticators.
     */
    export interface Schema$AuthenticatorGroupsConfig {
        /**
         * Whether this cluster should return group membership lookups during authentication using a group of security groups.
         */
        enabled?: boolean | null;
        /**
         * The name of the security group-of-groups to be used. Only relevant if enabled = true.
         */
        securityGroup?: string | null;
    }
    /**
     * AutoMonitoringConfig defines the configuration for GKE Workload Auto-Monitoring.
     */
    export interface Schema$AutoMonitoringConfig {
        /**
         * Scope for GKE Workload Auto-Monitoring.
         */
        scope?: string | null;
    }
    /**
     * Autopilot is the configuration for Autopilot settings on the cluster.
     */
    export interface Schema$Autopilot {
        /**
         * Output only. ConversionStatus shows conversion status.
         */
        conversionStatus?: Schema$AutopilotConversionStatus;
        /**
         * Enable Autopilot
         */
        enabled?: boolean | null;
        /**
         * WorkloadPolicyConfig is the configuration related to GCW workload policy
         */
        workloadPolicyConfig?: Schema$WorkloadPolicyConfig;
    }
    /**
     * AutopilotCompatibilityIssue contains information about a specific compatibility issue with Autopilot mode.
     */
    export interface Schema$AutopilotCompatibilityIssue {
        /**
         * The constraint type of the issue.
         */
        constraintType?: string | null;
        /**
         * The description of the issue.
         */
        description?: string | null;
        /**
         * A URL to a public documentation, which addresses resolving this issue.
         */
        documentationUrl?: string | null;
        /**
         * The incompatibility type of this issue.
         */
        incompatibilityType?: string | null;
        /**
         * The last time when this issue was observed.
         */
        lastObservation?: string | null;
        /**
         * The name of the resources which are subject to this issue.
         */
        subjects?: string[] | null;
    }
    /**
     * AutopilotConfig contains configuration of autopilot feature for this nodepool.
     */
    export interface Schema$AutopilotConfig {
        /**
         * Denotes that nodes belonging to this node pool are Autopilot nodes.
         */
        enabled?: boolean | null;
    }
    /**
     * AutopilotConversionStatus represents conversion status.
     */
    export interface Schema$AutopilotConversionStatus {
        /**
         * Output only. The current state of the conversion.
         */
        state?: string | null;
    }
    /**
     * AutoprovisioningNodePoolDefaults contains defaults for a node pool created by NAP.
     */
    export interface Schema$AutoprovisioningNodePoolDefaults {
        /**
         *  The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption
         */
        bootDiskKmsKey?: string | null;
        /**
         * Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. If unspecified, the default disk size is 100GB.
         */
        diskSizeGb?: number | null;
        /**
         * Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') If unspecified, the default disk type is 'pd-standard'
         */
        diskType?: string | null;
        /**
         * The image type to use for NAP created node. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.
         */
        imageType?: string | null;
        /**
         * DEPRECATED. Use NodePoolAutoConfig.NodeKubeletConfig instead.
         */
        insecureKubeletReadonlyPortEnabled?: boolean | null;
        /**
         * NodeManagement configuration for this NodePool.
         */
        management?: Schema$NodeManagement;
        /**
         * Deprecated. Minimum CPU platform to be used for NAP created node pools. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: Intel Haswell or minCpuPlatform: Intel Sandy Bridge. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform). This field is deprecated, min_cpu_platform should be specified using `cloud.google.com/requested-min-cpu-platform` label selector on the pod. To unset the min cpu platform field pass "automatic" as field value.
         */
        minCpuPlatform?: string | null;
        /**
         * The set of Google API scopes to be made available on all of the node VMs under the "default" service account. The following scopes are recommended, but not required, and by default are not included: * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Google Container Registry](https://cloud.google.com/container-registry/)). If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.
         */
        oauthScopes?: string[] | null;
        /**
         * The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.
         */
        serviceAccount?: string | null;
        /**
         * Shielded Instance options.
         */
        shieldedInstanceConfig?: Schema$ShieldedInstanceConfig;
        /**
         * Upgrade settings control disruption and speed of the upgrade.
         */
        upgradeSettings?: Schema$UpgradeSettings;
    }
    /**
     * Autoscaled rollout policy uses cluster autoscaler during blue-green upgrades to scale both the green and blue pools.
     */
    export interface Schema$AutoscaledRolloutPolicy {
    }
    /**
     * AutoUpgradeOptions defines the set of options for the user to control how the Auto Upgrades will proceed.
     */
    export interface Schema$AutoUpgradeOptions {
        /**
         * Output only. This field is set when upgrades are about to commence with the approximate start time for the upgrades, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        autoUpgradeStartTime?: string | null;
        /**
         * Output only. This field is set when upgrades are about to commence with the description of the upgrade.
         */
        description?: string | null;
    }
    /**
     * Deprecated.
     */
    export interface Schema$AvailableVersion {
        /**
         * Reason for availability.
         */
        reason?: string | null;
        /**
         * Kubernetes version.
         */
        version?: string | null;
    }
    /**
     * Best effort provisioning.
     */
    export interface Schema$BestEffortProvisioning {
        /**
         * When this is enabled, cluster/node pool creations will ignore non-fatal errors like stockout to best provision as many nodes as possible right now and eventually bring up all target number of nodes
         */
        enabled?: boolean | null;
        /**
         * Minimum number of nodes to be provisioned to be considered as succeeded, and the rest of nodes will be provisioned gradually and eventually when stockout issue has been resolved.
         */
        minProvisionNodes?: number | null;
    }
    /**
     * Parameters for using BigQuery as the destination of resource usage export.
     */
    export interface Schema$BigQueryDestination {
        /**
         * The ID of a BigQuery Dataset.
         */
        datasetId?: string | null;
    }
    /**
     * Configuration for Binary Authorization.
     */
    export interface Schema$BinaryAuthorization {
        /**
         * This field is deprecated. Leave this unset and instead configure BinaryAuthorization using evaluation_mode. If evaluation_mode is set to anything other than EVALUATION_MODE_UNSPECIFIED, this field is ignored.
         */
        enabled?: boolean | null;
        /**
         * Mode of operation for binauthz policy evaluation. If unspecified, defaults to DISABLED.
         */
        evaluationMode?: string | null;
        /**
         * Optional. Binauthz policies that apply to this cluster.
         */
        policyBindings?: Schema$PolicyBinding[];
    }
    /**
     * Information relevant to blue-green upgrade.
     */
    export interface Schema$BlueGreenInfo {
        /**
         * The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with blue pool.
         */
        blueInstanceGroupUrls?: string[] | null;
        /**
         * Time to start deleting blue pool to complete blue-green upgrade, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        bluePoolDeletionStartTime?: string | null;
        /**
         * The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with green pool.
         */
        greenInstanceGroupUrls?: string[] | null;
        /**
         * Version of green pool.
         */
        greenPoolVersion?: string | null;
        /**
         * Current blue-green upgrade phase.
         */
        phase?: string | null;
    }
    /**
     * Settings for blue-green upgrade.
     */
    export interface Schema$BlueGreenSettings {
        /**
         * Autoscaled policy for cluster autoscaler enabled blue-green upgrade.
         */
        autoscaledRolloutPolicy?: Schema$AutoscaledRolloutPolicy;
        /**
         * Time needed after draining entire blue pool. After this period, blue pool will be cleaned up.
         */
        nodePoolSoakDuration?: string | null;
        /**
         * Standard policy for the blue-green upgrade.
         */
        standardRolloutPolicy?: Schema$StandardRolloutPolicy;
    }
    /**
     * CancelOperationRequest cancels a single operation.
     */
    export interface Schema$CancelOperationRequest {
        /**
         * The name (project, location, operation id) of the operation to cancel. Specified in the format `projects/x/locations/x/operations/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.
         */
        operationId?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * CertificateAuthorityDomainConfig configures one or more fully qualified domain names (FQDN) to a specific certificate.
     */
    export interface Schema$CertificateAuthorityDomainConfig {
        /**
         * List of fully qualified domain names (FQDN). Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000
         */
        fqdns?: string[] | null;
        /**
         * Google Secret Manager (GCP) certificate configuration.
         */
        gcpSecretManagerCertificateConfig?: Schema$GCPSecretManagerCertificateConfig;
    }
    /**
     * CheckAutopilotCompatibilityResponse has a list of compatibility issues.
     */
    export interface Schema$CheckAutopilotCompatibilityResponse {
        /**
         * The list of issues for the given operation.
         */
        issues?: Schema$AutopilotCompatibilityIssue[];
        /**
         * The summary of the autopilot compatibility response.
         */
        summary?: string | null;
    }
    /**
     * CidrBlock contains an optional name and one CIDR block.
     */
    export interface Schema$CidrBlock {
        /**
         * cidr_block must be specified in CIDR notation.
         */
        cidrBlock?: string | null;
        /**
         * display_name is an optional field for users to identify CIDR blocks.
         */
        displayName?: string | null;
    }
    /**
     * Configuration for client certificates on the cluster.
     */
    export interface Schema$ClientCertificateConfig {
        /**
         * Issue a client certificate.
         */
        issueClientCertificate?: boolean | null;
    }
    /**
     * Configuration options for the Cloud Run feature.
     */
    export interface Schema$CloudRunConfig {
        /**
         * Whether Cloud Run addon is enabled for this cluster.
         */
        disabled?: boolean | null;
        /**
         * Which load balancer type is installed for Cloud Run.
         */
        loadBalancerType?: string | null;
    }
    /**
     * A Google Kubernetes Engine cluster.
     */
    export interface Schema$Cluster {
        /**
         * Configurations for the various addons available to run in the cluster.
         */
        addonsConfig?: Schema$AddonsConfig;
        /**
         * Configuration controlling RBAC group membership information.
         */
        authenticatorGroupsConfig?: Schema$AuthenticatorGroupsConfig;
        /**
         * Autopilot configuration for the cluster.
         */
        autopilot?: Schema$Autopilot;
        /**
         * Cluster-level autoscaling configuration.
         */
        autoscaling?: Schema$ClusterAutoscaling;
        /**
         * Configuration for Binary Authorization.
         */
        binaryAuthorization?: Schema$BinaryAuthorization;
        /**
         * The IP address range of the container pods in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`). Leave blank to have one automatically chosen or specify a `/14` block in `10.0.0.0/8`.
         */
        clusterIpv4Cidr?: string | null;
        /**
         * Telemetry integration for the cluster.
         */
        clusterTelemetry?: Schema$ClusterTelemetry;
        /**
         * Enable/Disable Compliance Posture features for the cluster.
         */
        compliancePostureConfig?: Schema$CompliancePostureConfig;
        /**
         * Which conditions caused the current cluster state.
         */
        conditions?: Schema$StatusCondition[];
        /**
         * Configuration of Confidential Nodes. All the nodes in the cluster will be Confidential VM once enabled.
         */
        confidentialNodes?: Schema$ConfidentialNodes;
        /**
         * Configuration for all cluster's control plane endpoints.
         */
        controlPlaneEndpointsConfig?: Schema$ControlPlaneEndpointsConfig;
        /**
         * Configuration for the fine-grained cost management feature.
         */
        costManagementConfig?: Schema$CostManagementConfig;
        /**
         * Output only. The time the cluster was created, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        createTime?: string | null;
        /**
         * Output only. The current software version of the master endpoint.
         */
        currentMasterVersion?: string | null;
        /**
         * Output only. The number of nodes currently in the cluster. Deprecated. Call Kubernetes API directly to retrieve node information.
         */
        currentNodeCount?: number | null;
        /**
         * Output only. Deprecated, use [NodePool.version](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1beta1/projects.locations.clusters.nodePools) instead. The current version of the node software components. If they are currently at multiple versions because they're in the process of being upgraded, this reflects the minimum version of all nodes.
         */
        currentNodeVersion?: string | null;
        /**
         * Configuration of etcd encryption.
         */
        databaseEncryption?: Schema$DatabaseEncryption;
        /**
         * The default constraint on the maximum number of pods that can be run simultaneously on a node in the node pool of this cluster. Only honored if cluster created with IP Alias support.
         */
        defaultMaxPodsConstraint?: Schema$MaxPodsConstraint;
        /**
         * An optional description of this cluster.
         */
        description?: string | null;
        /**
         * Kubernetes open source beta apis enabled on the cluster. Only beta apis.
         */
        enableK8sBetaApis?: Schema$K8sBetaAPIConfig;
        /**
         * Kubernetes alpha features are enabled on this cluster. This includes alpha API groups (e.g. v1beta1) and features that may not be production ready in the kubernetes version of the master and nodes. The cluster has no SLA for uptime and master/node upgrades are disabled. Alpha enabled clusters are automatically deleted thirty days after creation.
         */
        enableKubernetesAlpha?: boolean | null;
        /**
         * Enable the ability to use Cloud TPUs in this cluster. This field is deprecated, use tpu_config.enabled instead. This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.
         */
        enableTpu?: boolean | null;
        /**
         * Output only. The IP address of this cluster's master endpoint. The endpoint can be accessed from the internet at `https://username:password@endpoint/`. See the `masterAuth` property of this resource for username and password information.
         */
        endpoint?: string | null;
        /**
         * GKE Enterprise Configuration.
         */
        enterpriseConfig?: Schema$EnterpriseConfig;
        /**
         * This checksum is computed by the server based on the value of cluster fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Output only. The time the cluster will be automatically deleted in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        expireTime?: string | null;
        /**
         * Fleet information for the cluster.
         */
        fleet?: Schema$Fleet;
        /**
         * Output only. Unique id for the cluster.
         */
        id?: string | null;
        /**
         * Configuration for Identity Service component.
         */
        identityServiceConfig?: Schema$IdentityServiceConfig;
        /**
         * The initial Kubernetes version for this cluster. Valid versions are those found in validMasterVersions returned by getServerConfig. The version can be upgraded over time; such upgrades are reflected in currentMasterVersion and currentNodeVersion. Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "","-": picks the default Kubernetes version
         */
        initialClusterVersion?: string | null;
        /**
         * The number of nodes to create in this cluster. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota. For requests, this field should only be used in lieu of a "node_pool" object, since this configuration (along with the "node_config") will be used to create a "NodePool" object with an auto-generated name. Do not use this and a node_pool at the same time. This field is deprecated, use node_pool.initial_node_count instead.
         */
        initialNodeCount?: number | null;
        /**
         * Output only. Deprecated. Use node_pools.instance_group_urls.
         */
        instanceGroupUrls?: string[] | null;
        /**
         * Configuration for cluster IP allocation.
         */
        ipAllocationPolicy?: Schema$IPAllocationPolicy;
        /**
         * The fingerprint of the set of labels for this cluster.
         */
        labelFingerprint?: string | null;
        /**
         * Configuration for the legacy ABAC authorization mode.
         */
        legacyAbac?: Schema$LegacyAbac;
        /**
         * Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.
         */
        location?: string | null;
        /**
         * The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located. This field provides a default value if [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) are not specified during node pool creation. Warning: changing cluster locations will update the [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) of all node pools and will result in nodes being added and/or removed.
         */
        locations?: string[] | null;
        /**
         * Logging configuration for the cluster.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * The logging service the cluster should use to write logs. Currently available options: * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer available as of GKE 1.15). * `none` - no logs will be exported from the cluster. If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.
         */
        loggingService?: string | null;
        /**
         * Configure the maintenance policy for this cluster.
         */
        maintenancePolicy?: Schema$MaintenancePolicy;
        /**
         * Configuration for master components.
         */
        master?: Schema$Master;
        /**
         * The authentication information for accessing the master endpoint. If unspecified, the defaults are used: For clusters before v1.12, if master_auth is unspecified, `username` will be set to "admin", a random password will be generated, and a client certificate will be issued.
         */
        masterAuth?: Schema$MasterAuth;
        /**
         * The configuration options for master authorized networks feature. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.authorized_networks_config instead.
         */
        masterAuthorizedNetworksConfig?: Schema$MasterAuthorizedNetworksConfig;
        /**
         * The IP prefix in CIDR notation to use for the hosted master network. This prefix will be used for assigning private IP addresses to the master or set of masters, as well as the ILB VIP. This field is deprecated, use private_cluster_config.master_ipv4_cidr_block instead.
         */
        masterIpv4CidrBlock?: string | null;
        /**
         * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
         */
        meshCertificates?: Schema$MeshCertificates;
        /**
         * Monitoring configuration for the cluster.
         */
        monitoringConfig?: Schema$MonitoringConfig;
        /**
         * The monitoring service the cluster should use to write metrics. Currently available options: * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster. If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.
         */
        monitoringService?: string | null;
        /**
         * The name of this cluster. The name must be unique within this project and location (e.g. zone or region), and can be up to 40 characters with the following restrictions: * Lowercase letters, numbers, and hyphens only. * Must start with a letter. * Must end with a number or a letter.
         */
        name?: string | null;
        /**
         * The name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. If left unspecified, the `default` network will be used. On output this shows the network ID instead of the name.
         */
        network?: string | null;
        /**
         * Configuration for cluster networking.
         */
        networkConfig?: Schema$NetworkConfig;
        /**
         * Configuration options for the NetworkPolicy feature.
         */
        networkPolicy?: Schema$NetworkPolicy;
        /**
         * Parameters used in creating the cluster's nodes. For requests, this field should only be used in lieu of a "node_pool" object, since this configuration (along with the "initial_node_count") will be used to create a "NodePool" object with an auto-generated name. Do not use this and a node_pool at the same time. For responses, this field will be populated with the node configuration of the first node pool. (For configuration of each node pool, see `node_pool.config`) If unspecified, the defaults are used. This field is deprecated, use node_pool.config instead.
         */
        nodeConfig?: Schema$NodeConfig;
        /**
         * Output only. The size of the address space on each node for hosting containers. This is provisioned from within the `container_ipv4_cidr` range. This field will only be set when cluster is in route-based network mode.
         */
        nodeIpv4CidrSize?: number | null;
        /**
         * Node pool configs that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.
         */
        nodePoolAutoConfig?: Schema$NodePoolAutoConfig;
        /**
         * Default NodePool settings for the entire cluster. These settings are overridden if specified on the specific NodePool object.
         */
        nodePoolDefaults?: Schema$NodePoolDefaults;
        /**
         * The node pools associated with this cluster. This field should not be set if "node_config" or "initial_node_count" are specified.
         */
        nodePools?: Schema$NodePool[];
        /**
         * Notification configuration of the cluster.
         */
        notificationConfig?: Schema$NotificationConfig;
        /**
         * The configuration of the parent product of the cluster. This field is used by Google internal products that are built on top of the GKE cluster and take the ownership of the cluster.
         */
        parentProductConfig?: Schema$ParentProductConfig;
        /**
         * The config for pod autoscaling.
         */
        podAutoscaling?: Schema$PodAutoscaling;
        /**
         * Configuration for the PodSecurityPolicy feature.
         */
        podSecurityPolicyConfig?: Schema$PodSecurityPolicyConfig;
        /**
         * If this is a private cluster setup. Private clusters are clusters that, by default have no external IP addresses on the nodes and where nodes and the master communicate over private IP addresses. This field is deprecated, use private_cluster_config.enable_private_nodes instead.
         */
        privateCluster?: boolean | null;
        /**
         * Configuration for private cluster.
         */
        privateClusterConfig?: Schema$PrivateClusterConfig;
        /**
         * Deprecated: Use SecurityPostureConfig instead. Enable/Disable Protect API features for the cluster.
         */
        protectConfig?: Schema$ProtectConfig;
        /**
         * RBACBindingConfig allows user to restrict ClusterRoleBindings an RoleBindings that can be created.
         */
        rbacBindingConfig?: Schema$RBACBindingConfig;
        /**
         * Release channel configuration. If left unspecified on cluster creation and a version is specified, the cluster is enrolled in the most mature release channel where the version is available (first checking STABLE, then REGULAR, and finally RAPID). Otherwise, if no release channel configuration and no version is specified, the cluster is enrolled in the REGULAR channel with its default version.
         */
        releaseChannel?: Schema$ReleaseChannel;
        /**
         * The resource labels for the cluster to use to annotate any related Google Compute Engine resources.
         */
        resourceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Configuration for exporting resource usages. Resource usage export is disabled when this config unspecified.
         */
        resourceUsageExportConfig?: Schema$ResourceUsageExportConfig;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Secret CSI driver configuration.
         */
        secretManagerConfig?: Schema$SecretManagerConfig;
        /**
         * Enable/Disable Security Posture API features for the cluster.
         */
        securityPostureConfig?: Schema$SecurityPostureConfig;
        /**
         * Output only. Server-defined URL for the resource.
         */
        selfLink?: string | null;
        /**
         * Output only. The IP address range of the Kubernetes services in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). Service addresses are typically put in the last `/16` from the container CIDR.
         */
        servicesIpv4Cidr?: string | null;
        /**
         * Shielded Nodes configuration.
         */
        shieldedNodes?: Schema$ShieldedNodes;
        /**
         * Output only. The current status of this cluster.
         */
        status?: string | null;
        /**
         * Output only. Deprecated. Use conditions instead. Additional information about the current status of this cluster, if available.
         */
        statusMessage?: string | null;
        /**
         * The name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/subnetworks) to which the cluster is connected. On output this shows the subnetwork ID instead of the name.
         */
        subnetwork?: string | null;
        /**
         * Configuration for Cloud TPU support; This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.
         */
        tpuConfig?: Schema$TpuConfig;
        /**
         * Output only. The IP address range of the Cloud TPUs in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.
         */
        tpuIpv4CidrBlock?: string | null;
        /**
         * The Custom keys configuration for the cluster.
         */
        userManagedKeysConfig?: Schema$UserManagedKeysConfig;
        /**
         * Cluster-level Vertical Pod Autoscaling configuration.
         */
        verticalPodAutoscaling?: Schema$VerticalPodAutoscaling;
        /**
         * Configuration for direct-path (via ALTS) with workload identity.
         */
        workloadAltsConfig?: Schema$WorkloadALTSConfig;
        /**
         * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
         */
        workloadCertificates?: Schema$WorkloadCertificates;
        /**
         * Configuration for the use of Kubernetes Service Accounts in GCP IAM policies.
         */
        workloadIdentityConfig?: Schema$WorkloadIdentityConfig;
        /**
         * Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field is deprecated, use location instead.
         */
        zone?: string | null;
    }
    /**
     * ClusterAutoscaling contains global, per-cluster information required by Cluster Autoscaler to automatically adjust the size of the cluster and create/delete node pools based on the current needs.
     */
    export interface Schema$ClusterAutoscaling {
        /**
         * The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes can be created by NAP.
         */
        autoprovisioningLocations?: string[] | null;
        /**
         * AutoprovisioningNodePoolDefaults contains defaults for a node pool created by NAP.
         */
        autoprovisioningNodePoolDefaults?: Schema$AutoprovisioningNodePoolDefaults;
        /**
         * Defines autoscaling behaviour.
         */
        autoscalingProfile?: string | null;
        /**
         * Enables automatic node pool creation and deletion.
         */
        enableNodeAutoprovisioning?: boolean | null;
        /**
         * Contains global constraints regarding minimum and maximum amount of resources in the cluster.
         */
        resourceLimits?: Schema$ResourceLimit[];
    }
    /**
     * Configuration of all network bandwidth tiers
     */
    export interface Schema$ClusterNetworkPerformanceConfig {
        /**
         * Specifies the total network bandwidth tier for the NodePool.
         */
        totalEgressBandwidthTier?: string | null;
    }
    /**
     * Telemetry integration for the cluster.
     */
    export interface Schema$ClusterTelemetry {
        /**
         * Type of the integration.
         */
        type?: string | null;
    }
    /**
     * ClusterUpdate describes an update to the cluster. Exactly one update can be applied to a cluster with each request, so at most one field can be provided.
     */
    export interface Schema$ClusterUpdate {
        /**
         * The additional pod ranges to be added to the cluster. These pod ranges can be used by node pools to allocate pod IPs.
         */
        additionalPodRangesConfig?: Schema$AdditionalPodRangesConfig;
        /**
         * Configurations for the various addons available to run in the cluster.
         */
        desiredAddonsConfig?: Schema$AddonsConfig;
        /**
         * AuthenticatorGroupsConfig specifies the config for the cluster security groups settings.
         */
        desiredAuthenticatorGroupsConfig?: Schema$AuthenticatorGroupsConfig;
        /**
         * WorkloadPolicyConfig is the configuration related to GCW workload policy
         */
        desiredAutopilotWorkloadPolicyConfig?: Schema$WorkloadPolicyConfig;
        /**
         * The desired configuration options for the Binary Authorization feature.
         */
        desiredBinaryAuthorization?: Schema$BinaryAuthorization;
        /**
         * Cluster-level autoscaling configuration.
         */
        desiredClusterAutoscaling?: Schema$ClusterAutoscaling;
        /**
         * The desired telemetry integration for the cluster.
         */
        desiredClusterTelemetry?: Schema$ClusterTelemetry;
        /**
         * Enable/Disable Compliance Posture features for the cluster.
         */
        desiredCompliancePostureConfig?: Schema$CompliancePostureConfig;
        /**
         * The desired containerd config for the cluster.
         */
        desiredContainerdConfig?: Schema$ContainerdConfig;
        /**
         * Control plane endpoints configuration.
         */
        desiredControlPlaneEndpointsConfig?: Schema$ControlPlaneEndpointsConfig;
        /**
         * The desired configuration for the fine-grained cost management feature.
         */
        desiredCostManagementConfig?: Schema$CostManagementConfig;
        /**
         * Configuration of etcd encryption.
         */
        desiredDatabaseEncryption?: Schema$DatabaseEncryption;
        /**
         * The desired datapath provider for the cluster.
         */
        desiredDatapathProvider?: string | null;
        /**
         * Override the default setting of whether future created nodes have private IP addresses only, namely NetworkConfig.default_enable_private_nodes
         */
        desiredDefaultEnablePrivateNodes?: boolean | null;
        /**
         * The desired status of whether to disable default sNAT for this cluster.
         */
        desiredDefaultSnatStatus?: Schema$DefaultSnatStatus;
        /**
         * Enable/Disable L4 LB VPC firewall reconciliation for the cluster.
         */
        desiredDisableL4LbFirewallReconciliation?: boolean | null;
        /**
         * DNSConfig contains clusterDNS config for this cluster.
         */
        desiredDnsConfig?: Schema$DNSConfig;
        /**
         * Enable/Disable Cilium Clusterwide Network Policy for the cluster.
         */
        desiredEnableCiliumClusterwideNetworkPolicy?: boolean | null;
        /**
         * Enable/Disable FQDN Network Policy for the cluster.
         */
        desiredEnableFqdnNetworkPolicy?: boolean | null;
        /**
         * Enable/Disable Multi-Networking for the cluster
         */
        desiredEnableMultiNetworking?: boolean | null;
        /**
         * Enable/Disable private endpoint for the cluster's master. Deprecated: Use desired_control_plane_endpoints_config.ip_endpoints_config.enable_public_endpoint instead. Note that the value of enable_public_endpoint is reversed: if enable_private_endpoint is false, then enable_public_endpoint will be true.
         */
        desiredEnablePrivateEndpoint?: boolean | null;
        /**
         * The desired enterprise configuration for the cluster.
         */
        desiredEnterpriseConfig?: Schema$DesiredEnterpriseConfig;
        /**
         * The desired fleet configuration for the cluster.
         */
        desiredFleet?: Schema$Fleet;
        /**
         * The desired config of Gateway API on this cluster.
         */
        desiredGatewayApiConfig?: Schema$GatewayAPIConfig;
        /**
         * The desired GCFS config for the cluster.
         */
        desiredGcfsConfig?: Schema$GcfsConfig;
        /**
         * HostMaintenancePolicy contains the desired maintenance policy for the Google Compute Engine hosts.
         */
        desiredHostMaintenancePolicy?: Schema$HostMaintenancePolicy;
        /**
         * The desired Identity Service component configuration.
         */
        desiredIdentityServiceConfig?: Schema$IdentityServiceConfig;
        /**
         * The desired image type for the node pool. NOTE: Set the "desired_node_pool" field as well.
         */
        desiredImageType?: string | null;
        /**
         * The desired config of Intra-node visibility.
         */
        desiredIntraNodeVisibilityConfig?: Schema$IntraNodeVisibilityConfig;
        /**
         * Specify the details of in-transit encryption. Now named inter-node transparent encryption.
         */
        desiredInTransitEncryptionConfig?: string | null;
        /**
         * Beta APIs enabled for cluster.
         */
        desiredK8sBetaApis?: Schema$K8sBetaAPIConfig;
        /**
         * The desired L4 Internal Load Balancer Subsetting configuration.
         */
        desiredL4ilbSubsettingConfig?: Schema$ILBSubsettingConfig;
        /**
         * The desired list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located. This list must always include the cluster's primary zone. Warning: changing cluster locations will update the locations of all node pools and will result in nodes being added and/or removed.
         */
        desiredLocations?: string[] | null;
        /**
         * The desired logging configuration.
         */
        desiredLoggingConfig?: Schema$LoggingConfig;
        /**
         * The logging service the cluster should use to write logs. Currently available options: * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer available as of GKE 1.15). * `none` - no logs will be exported from the cluster. If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.
         */
        desiredLoggingService?: string | null;
        /**
         * Configuration for master components.
         */
        desiredMaster?: Schema$Master;
        /**
         * The desired configuration options for master authorized networks feature. Deprecated: Use desired_control_plane_endpoints_config.ip_endpoints_config.authorized_networks_config instead.
         */
        desiredMasterAuthorizedNetworksConfig?: Schema$MasterAuthorizedNetworksConfig;
        /**
         * The Kubernetes version to change the master to. The only valid value is the latest supported version. Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the default Kubernetes version
         */
        desiredMasterVersion?: string | null;
        /**
         * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
         */
        desiredMeshCertificates?: Schema$MeshCertificates;
        /**
         * The desired monitoring configuration.
         */
        desiredMonitoringConfig?: Schema$MonitoringConfig;
        /**
         * The monitoring service the cluster should use to write metrics. Currently available options: * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster. If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.
         */
        desiredMonitoringService?: string | null;
        /**
         * The desired network performance config.
         */
        desiredNetworkPerformanceConfig?: Schema$ClusterNetworkPerformanceConfig;
        /**
         * The desired node kubelet config for the cluster.
         */
        desiredNodeKubeletConfig?: Schema$NodeKubeletConfig;
        /**
         * The desired node kubelet config for all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.
         */
        desiredNodePoolAutoConfigKubeletConfig?: Schema$NodeKubeletConfig;
        /**
         * The desired Linux node config for all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters. Currently only `cgroup_mode` can be set here.
         */
        desiredNodePoolAutoConfigLinuxNodeConfig?: Schema$LinuxNodeConfig;
        /**
         * The desired network tags that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.
         */
        desiredNodePoolAutoConfigNetworkTags?: Schema$NetworkTags;
        /**
         * The desired resource manager tags that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.
         */
        desiredNodePoolAutoConfigResourceManagerTags?: Schema$ResourceManagerTags;
        /**
         * Autoscaler configuration for the node pool specified in desired_node_pool_id. If there is only one pool in the cluster and desired_node_pool_id is not provided then the change applies to that single node pool.
         */
        desiredNodePoolAutoscaling?: Schema$NodePoolAutoscaling;
        /**
         * The node pool to be upgraded. This field is mandatory if "desired_node_version", "desired_image_family", "desired_node_pool_autoscaling", or "desired_workload_metadata_config" is specified and there is more than one node pool on the cluster.
         */
        desiredNodePoolId?: string | null;
        /**
         * The desired node pool logging configuration defaults for the cluster.
         */
        desiredNodePoolLoggingConfig?: Schema$NodePoolLoggingConfig;
        /**
         * The Kubernetes version to change the nodes to (typically an upgrade). Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the Kubernetes master version
         */
        desiredNodeVersion?: string | null;
        /**
         * The desired notification configuration.
         */
        desiredNotificationConfig?: Schema$NotificationConfig;
        /**
         * The desired parent product config for the cluster.
         */
        desiredParentProductConfig?: Schema$ParentProductConfig;
        /**
         * The desired config for pod autoscaling.
         */
        desiredPodAutoscaling?: Schema$PodAutoscaling;
        /**
         * The desired configuration options for the PodSecurityPolicy feature.
         */
        desiredPodSecurityPolicyConfig?: Schema$PodSecurityPolicyConfig;
        /**
         * The desired private cluster configuration. master_global_access_config is the only field that can be changed via this field. See also ClusterUpdate.desired_enable_private_endpoint for modifying other fields within PrivateClusterConfig. Deprecated: Use desired_control_plane_endpoints_config.ip_endpoints_config.global_access instead.
         */
        desiredPrivateClusterConfig?: Schema$PrivateClusterConfig;
        /**
         * The desired state of IPv6 connectivity to Google Services.
         */
        desiredPrivateIpv6GoogleAccess?: string | null;
        /**
         * Deprecated: Use DesiredSecurityPostureConfig instead. Enable/Disable Protect API features for the cluster.
         */
        desiredProtectConfig?: Schema$ProtectConfig;
        /**
         * RBACBindingConfig allows user to restrict ClusterRoleBindings an RoleBindings that can be created.
         */
        desiredRbacBindingConfig?: Schema$RBACBindingConfig;
        /**
         * The desired release channel configuration.
         */
        desiredReleaseChannel?: Schema$ReleaseChannel;
        /**
         * The desired configuration for exporting resource usage.
         */
        desiredResourceUsageExportConfig?: Schema$ResourceUsageExportConfig;
        /**
         * Enable/Disable Secret Manager Config.
         */
        desiredSecretManagerConfig?: Schema$SecretManagerConfig;
        /**
         * Enable/Disable Security Posture API features for the cluster.
         */
        desiredSecurityPostureConfig?: Schema$SecurityPostureConfig;
        /**
         * ServiceExternalIPsConfig specifies the config for the use of Services with ExternalIPs field.
         */
        desiredServiceExternalIpsConfig?: Schema$ServiceExternalIPsConfig;
        /**
         * Configuration for Shielded Nodes.
         */
        desiredShieldedNodes?: Schema$ShieldedNodes;
        /**
         * The desired stack type of the cluster. If a stack type is provided and does not match the current stack type of the cluster, update will attempt to change the stack type to the new type.
         */
        desiredStackType?: string | null;
        /**
         * The desired Cloud TPU configuration. This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.
         */
        desiredTpuConfig?: Schema$TpuConfig;
        /**
         * Cluster-level Vertical Pod Autoscaling configuration.
         */
        desiredVerticalPodAutoscaling?: Schema$VerticalPodAutoscaling;
        /**
         * Configuration for direct-path (via ALTS) with workload identity.
         */
        desiredWorkloadAltsConfig?: Schema$WorkloadALTSConfig;
        /**
         * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
         */
        desiredWorkloadCertificates?: Schema$WorkloadCertificates;
        /**
         * Configuration for Workload Identity.
         */
        desiredWorkloadIdentityConfig?: Schema$WorkloadIdentityConfig;
        /**
         * Kubernetes open source beta apis enabled on the cluster. Only beta apis
         */
        enableK8sBetaApis?: Schema$K8sBetaAPIConfig;
        /**
         * The current etag of the cluster. If an etag is provided and does not match the current etag of the cluster, update will be blocked and an ABORTED error will be returned.
         */
        etag?: string | null;
        /**
         * The desired private cluster configuration. Has no effect. Use desired_private_cluster_config instead.
         */
        privateClusterConfig?: Schema$PrivateClusterConfig;
        /**
         * The additional pod ranges that are to be removed from the cluster. The pod ranges specified here must have been specified earlier in the 'additional_pod_ranges_config' argument.
         */
        removedAdditionalPodRangesConfig?: Schema$AdditionalPodRangesConfig;
        /**
         * The Custom keys configuration for the cluster.
         */
        userManagedKeysConfig?: Schema$UserManagedKeysConfig;
    }
    /**
     * ClusterUpgradeInfo contains the upgrade information of a cluster.
     */
    export interface Schema$ClusterUpgradeInfo {
        /**
         * The auto upgrade status.
         */
        autoUpgradeStatus?: string[] | null;
        /**
         * The cluster's current minor version's end of extended support timestamp.
         */
        endOfExtendedSupportTimestamp?: string | null;
        /**
         * The cluster's current minor version's end of standard support timestamp.
         */
        endOfStandardSupportTimestamp?: string | null;
        /**
         * minor_target_version indicates the target version for minor upgrade.
         */
        minorTargetVersion?: string | null;
        /**
         * patch_target_version indicates the target version for patch upgrade.
         */
        patchTargetVersion?: string | null;
        /**
         * The auto upgrade paused reason.
         */
        pausedReason?: string[] | null;
        /**
         * The list of past auto upgrades.
         */
        upgradeDetails?: Schema$UpgradeDetails[];
    }
    /**
     * CompleteIPRotationRequest moves the cluster master back into single-IP mode.
     */
    export interface Schema$CompleteIPRotationRequest {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster name) of the cluster to complete IP rotation. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * CompleteNodePoolUpgradeRequest sets the name of target node pool to complete upgrade.
     */
    export interface Schema$CompleteNodePoolUpgradeRequest {
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
    /**
     * Defines the details of a compliance standard.
     */
    export interface Schema$ComplianceStandard {
        /**
         * Name of the compliance standard.
         */
        standard?: string | null;
    }
    /**
     * ConfidentialNodes is configuration for the confidential nodes feature, which makes nodes run on confidential VMs.
     */
    export interface Schema$ConfidentialNodes {
        /**
         * Defines the type of technology used by the confidential node.
         */
        confidentialInstanceType?: string | null;
        /**
         * Whether Confidential Nodes feature is enabled.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration options for the Config Connector add-on.
     */
    export interface Schema$ConfigConnectorConfig {
        /**
         * Whether Cloud Connector is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * Parameters for controlling consumption metering.
     */
    export interface Schema$ConsumptionMeteringConfig {
        /**
         * Whether to enable consumption metering for this cluster. If enabled, a second BigQuery table will be created to hold resource consumption records.
         */
        enabled?: boolean | null;
    }
    /**
     * ContainerdConfig contains configuration to customize containerd.
     */
    export interface Schema$ContainerdConfig {
        /**
         * PrivateRegistryAccessConfig is used to configure access configuration for private container registries.
         */
        privateRegistryAccessConfig?: Schema$PrivateRegistryAccessConfig;
    }
    /**
     * Configuration for all of the cluster's control plane endpoints.
     */
    export interface Schema$ControlPlaneEndpointsConfig {
        /**
         * DNS endpoint configuration.
         */
        dnsEndpointConfig?: Schema$DNSEndpointConfig;
        /**
         * IP endpoints configuration.
         */
        ipEndpointsConfig?: Schema$IPEndpointsConfig;
    }
    /**
     * Configuration for fine-grained cost management feature.
     */
    export interface Schema$CostManagementConfig {
        /**
         * Whether the feature is enabled or not.
         */
        enabled?: boolean | null;
    }
    /**
     * CreateClusterRequest creates a cluster.
     */
    export interface Schema$CreateClusterRequest {
        /**
         * Required. A [cluster resource](https://cloud.google.com/container-engine/reference/rest/v1beta1/projects.locations.clusters)
         */
        cluster?: Schema$Cluster;
        /**
         * The parent (project and location) where the cluster will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string | null;
    }
    /**
     * CreateNodePoolRequest creates a node pool for a cluster.
     */
    export interface Schema$CreateNodePoolRequest {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the parent field.
         */
        clusterId?: string | null;
        /**
         * Required. The node pool to create.
         */
        nodePool?: Schema$NodePool;
        /**
         * The parent (project, location, cluster name) where the node pool will be created. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string | null;
    }
    /**
     * Time window specified for daily maintenance operations.
     */
    export interface Schema$DailyMaintenanceWindow {
        /**
         * Output only. Duration of the time window, automatically chosen to be smallest possible in the given scenario.
         */
        duration?: string | null;
        /**
         * Time within the maintenance window to start the maintenance operations. It must be in format "HH:MM", where HH : [00-23] and MM : [00-59] GMT.
         */
        startTime?: string | null;
    }
    /**
     * Configuration of etcd encryption.
     */
    export interface Schema$DatabaseEncryption {
        /**
         * Output only. The current state of etcd encryption.
         */
        currentState?: string | null;
        /**
         * Output only. Keys in use by the cluster for decrypting existing objects, in addition to the key in `key_name`. Each item is a CloudKMS key resource.
         */
        decryptionKeys?: string[] | null;
        /**
         * Name of CloudKMS key to use for the encryption of secrets in etcd. Ex. projects/my-project/locations/global/keyRings/my-ring/cryptoKeys/my-key
         */
        keyName?: string | null;
        /**
         * Output only. Records errors seen during DatabaseEncryption update operations.
         */
        lastOperationErrors?: Schema$OperationError[];
        /**
         * The desired state of etcd encryption.
         */
        state?: string | null;
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$Date {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        day?: number | null;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        month?: number | null;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        year?: number | null;
    }
    /**
     * DefaultSnatStatus contains the desired state of whether default sNAT should be disabled on the cluster.
     */
    export interface Schema$DefaultSnatStatus {
        /**
         * Disables cluster default sNAT rules.
         */
        disabled?: boolean | null;
    }
    /**
     * DesiredEnterpriseConfig is a wrapper used for updating enterprise_config.
     */
    export interface Schema$DesiredEnterpriseConfig {
        /**
         * desired_tier specifies the desired tier of the cluster.
         */
        desiredTier?: string | null;
    }
    /**
     * Configuration for NodeLocal DNSCache
     */
    export interface Schema$DnsCacheConfig {
        /**
         * Whether NodeLocal DNSCache is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * DNSConfig contains the desired set of options for configuring clusterDNS.
     */
    export interface Schema$DNSConfig {
        /**
         * Optional. The domain used in Additive VPC scope.
         */
        additiveVpcScopeDnsDomain?: string | null;
        /**
         * cluster_dns indicates which in-cluster DNS provider should be used.
         */
        clusterDns?: string | null;
        /**
         * cluster_dns_domain is the suffix used for all cluster service records.
         */
        clusterDnsDomain?: string | null;
        /**
         * cluster_dns_scope indicates the scope of access to cluster DNS records.
         */
        clusterDnsScope?: string | null;
    }
    /**
     * Describes the configuration of a DNS endpoint.
     */
    export interface Schema$DNSEndpointConfig {
        /**
         * Controls whether user traffic is allowed over this endpoint. Note that GCP-managed services may still use the endpoint even if this is false.
         */
        allowExternalTraffic?: boolean | null;
        /**
         * Output only. The cluster's DNS endpoint configuration. A DNS format address. This is accessible from the public internet. Ex: uid.us-central1.gke.goog. Always present, but the behavior may change according to the value of DNSEndpointConfig.allow_external_traffic.
         */
        endpoint?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * EnterpriseConfig is the cluster enterprise configuration.
     */
    export interface Schema$EnterpriseConfig {
        /**
         * Output only. cluster_tier indicates the effective tier of the cluster.
         */
        clusterTier?: string | null;
        /**
         * desired_tier specifies the desired tier of the cluster.
         */
        desiredTier?: string | null;
    }
    /**
     * EphemeralStorageConfig contains configuration for the ephemeral storage filesystem.
     */
    export interface Schema$EphemeralStorageConfig {
        /**
         * Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.
         */
        localSsdCount?: number | null;
    }
    /**
     * EphemeralStorageLocalSsdConfig contains configuration for the node ephemeral storage using Local SSDs.
     */
    export interface Schema$EphemeralStorageLocalSsdConfig {
        /**
         * Number of local SSDs to use for GKE Data Cache.
         */
        dataCacheCount?: number | null;
        /**
         * Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.
         */
        localSsdCount?: number | null;
    }
    /**
     * Configuration of Fast Socket feature.
     */
    export interface Schema$FastSocket {
        /**
         * Whether Fast Socket features are enabled in the node pool.
         */
        enabled?: boolean | null;
    }
    /**
     * Allows filtering to one or more specific event types. If event types are present, those and only those event types will be transmitted to the cluster. Other types will be skipped. If no filter is specified, or no event types are present, all event types will be sent
     */
    export interface Schema$Filter {
        /**
         * Event types to allowlist.
         */
        eventType?: string[] | null;
    }
    /**
     * Fleet is the fleet configuration for the cluster.
     */
    export interface Schema$Fleet {
        /**
         * Output only. The full resource name of the registered fleet membership of the cluster, in the format `//gkehub.googleapis.com/projects/x/locations/x/memberships/x`.
         */
        membership?: string | null;
        /**
         * Output only. Whether the cluster has been registered through the fleet API.
         */
        preRegistered?: boolean | null;
        /**
         * The Fleet host project(project ID or project number) where this cluster will be registered to. This field cannot be changed after the cluster has been registered.
         */
        project?: string | null;
    }
    /**
     * GatewayAPIConfig contains the desired config of Gateway API on this cluster.
     */
    export interface Schema$GatewayAPIConfig {
        /**
         * The Gateway API release channel to use for Gateway API.
         */
        channel?: string | null;
    }
    /**
     * Configuration for the Compute Engine PD CSI driver.
     */
    export interface Schema$GcePersistentDiskCsiDriverConfig {
        /**
         * Whether the Compute Engine PD CSI driver is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * GcfsConfig contains configurations of Google Container File System.
     */
    export interface Schema$GcfsConfig {
        /**
         * Whether to use GCFS.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration for the GCP Filestore CSI driver.
     */
    export interface Schema$GcpFilestoreCsiDriverConfig {
        /**
         * Whether the GCP Filestore CSI driver is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * GCPSecretManagerCertificateConfig configures a secret from [Google Secret Manager](https://cloud.google.com/secret-manager).
     */
    export interface Schema$GCPSecretManagerCertificateConfig {
        /**
         * Secret URI, in the form "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION". Version can be fixed (e.g. "2") or "latest"
         */
        secretUri?: string | null;
    }
    /**
     * Configuration for the Cloud Storage Fuse CSI driver.
     */
    export interface Schema$GcsFuseCsiDriverConfig {
        /**
         * Whether the Cloud Storage Fuse CSI driver is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * GetJSONWebKeysResponse is a valid JSON Web Key Set as specified in rfc 7517
     */
    export interface Schema$GetJSONWebKeysResponse {
        /**
         * For HTTP requests, this field is automatically extracted into the Cache-Control HTTP header.
         */
        cacheHeader?: Schema$HttpCacheControlResponseHeader;
        /**
         * The public component of the keys used by the cluster to sign token requests.
         */
        keys?: Schema$Jwk[];
    }
    /**
     * GetOpenIDConfigResponse is an OIDC discovery document for the cluster. See the OpenID Connect Discovery 1.0 specification for details.
     */
    export interface Schema$GetOpenIDConfigResponse {
        /**
         * For HTTP requests, this field is automatically extracted into the Cache-Control HTTP header.
         */
        cacheHeader?: Schema$HttpCacheControlResponseHeader;
        /**
         * Supported claims.
         */
        claims_supported?: string[] | null;
        /**
         * Supported grant types.
         */
        grant_types?: string[] | null;
        /**
         * supported ID Token signing Algorithms.
         */
        id_token_signing_alg_values_supported?: string[] | null;
        /**
         * OIDC Issuer.
         */
        issuer?: string | null;
        /**
         * JSON Web Key uri.
         */
        jwks_uri?: string | null;
        /**
         * Supported response types.
         */
        response_types_supported?: string[] | null;
        /**
         * Supported subject types.
         */
        subject_types_supported?: string[] | null;
    }
    /**
     * Configuration for the Backup for GKE Agent.
     */
    export interface Schema$GkeBackupAgentConfig {
        /**
         * Whether the Backup for GKE agent is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * GPUDriverInstallationConfig specifies the version of GPU driver to be auto installed.
     */
    export interface Schema$GPUDriverInstallationConfig {
        /**
         * Mode for how the GPU driver is installed.
         */
        gpuDriverVersion?: string | null;
    }
    /**
     * GPUSharingConfig represents the GPU sharing configuration for Hardware Accelerators.
     */
    export interface Schema$GPUSharingConfig {
        /**
         * The type of GPU sharing strategy to enable on the GPU node.
         */
        gpuSharingStrategy?: string | null;
        /**
         * The max number of containers that can share a physical GPU.
         */
        maxSharedClientsPerGpu?: string | null;
    }
    /**
     * Configuration options for the horizontal pod autoscaling feature, which increases or decreases the number of replica pods a replication controller has based on the resource usage of the existing pods.
     */
    export interface Schema$HorizontalPodAutoscaling {
        /**
         * Whether the Horizontal Pod Autoscaling feature is enabled in the cluster. When enabled, it ensures that metrics are collected into Stackdriver Monitoring.
         */
        disabled?: boolean | null;
    }
    /**
     * HostMaintenancePolicy contains the maintenance policy for the hosts on which the GKE VMs run on.
     */
    export interface Schema$HostMaintenancePolicy {
        /**
         * Specifies the frequency of planned maintenance events.
         */
        maintenanceInterval?: string | null;
        /**
         * Strategy that will trigger maintenance on behalf of the customer.
         */
        opportunisticMaintenanceStrategy?: Schema$OpportunisticMaintenanceStrategy;
    }
    /**
     * RFC-2616: cache control support
     */
    export interface Schema$HttpCacheControlResponseHeader {
        /**
         * 14.6 response cache age, in seconds since the response is generated
         */
        age?: string | null;
        /**
         * 14.9 request and response directives
         */
        directive?: string | null;
        /**
         * 14.21 response cache expires, in RFC 1123 date format
         */
        expires?: string | null;
    }
    /**
     * Configuration options for the HTTP (L7) load balancing controller addon, which makes it easy to set up HTTP load balancers for services in a cluster.
     */
    export interface Schema$HttpLoadBalancing {
        /**
         * Whether the HTTP Load Balancing controller is enabled in the cluster. When enabled, it runs a small pod in the cluster that manages the load balancers.
         */
        disabled?: boolean | null;
    }
    /**
     * Hugepages amount in both 2m and 1g size
     */
    export interface Schema$HugepagesConfig {
        /**
         * Optional. Amount of 1G hugepages
         */
        hugepageSize1g?: number | null;
        /**
         * Optional. Amount of 2M hugepages
         */
        hugepageSize2m?: number | null;
    }
    /**
     * IdentityServiceConfig is configuration for Identity Service which allows customers to use external identity providers with the K8S API
     */
    export interface Schema$IdentityServiceConfig {
        /**
         * Whether to enable the Identity Service component
         */
        enabled?: boolean | null;
    }
    /**
     * ILBSubsettingConfig contains the desired config of L4 Internal LoadBalancer subsetting on this cluster.
     */
    export interface Schema$ILBSubsettingConfig {
        /**
         * Enables l4 ILB subsetting for this cluster
         */
        enabled?: boolean | null;
    }
    /**
     * IntraNodeVisibilityConfig contains the desired config of the intra-node visibility on this cluster.
     */
    export interface Schema$IntraNodeVisibilityConfig {
        /**
         * Enables intra node visibility for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration for controlling how IPs are allocated in the cluster.
     */
    export interface Schema$IPAllocationPolicy {
        /**
         * Output only. The additional pod ranges that are added to the cluster. These pod ranges can be used by new node pools to allocate pod IPs automatically. Once the range is removed it will not show up in IPAllocationPolicy.
         */
        additionalPodRangesConfig?: Schema$AdditionalPodRangesConfig;
        /**
         * If true, allow allocation of cluster CIDR ranges that overlap with certain kinds of network routes. By default we do not allow cluster CIDR ranges to intersect with any user declared routes. With allow_route_overlap == true, we allow overlapping with CIDR ranges that are larger than the cluster CIDR range. If this field is set to true, then cluster and services CIDRs must be fully-specified (e.g. `10.96.0.0/14`, but not `/14`), which means: 1) When `use_ip_aliases` is true, `cluster_ipv4_cidr_block` and `services_ipv4_cidr_block` must be fully-specified. 2) When `use_ip_aliases` is false, `cluster.cluster_ipv4_cidr` muse be fully-specified.
         */
        allowRouteOverlap?: boolean | null;
        /**
         * This field is deprecated, use cluster_ipv4_cidr_block.
         */
        clusterIpv4Cidr?: string | null;
        /**
         * The IP address range for the cluster pod IPs. If this field is set, then `cluster.cluster_ipv4_cidr` must be left blank. This field is only applicable when `use_ip_aliases` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.
         */
        clusterIpv4CidrBlock?: string | null;
        /**
         * The name of the secondary range to be used for the cluster CIDR block. The secondary range will be used for pod IP addresses. This must be an existing secondary range associated with the cluster subnetwork. This field is only applicable with use_ip_aliases and create_subnetwork is false.
         */
        clusterSecondaryRangeName?: string | null;
        /**
         * Whether a new subnetwork will be created automatically for the cluster. This field is only applicable when `use_ip_aliases` is true.
         */
        createSubnetwork?: boolean | null;
        /**
         * Output only. The utilization of the cluster default IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode.
         */
        defaultPodIpv4RangeUtilization?: number | null;
        /**
         * The ipv6 access type (internal or external) when create_subnetwork is true
         */
        ipv6AccessType?: string | null;
        /**
         * This field is deprecated, use node_ipv4_cidr_block.
         */
        nodeIpv4Cidr?: string | null;
        /**
         * The IP address range of the instance IPs in this cluster. This is applicable only if `create_subnetwork` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.
         */
        nodeIpv4CidrBlock?: string | null;
        /**
         * [PRIVATE FIELD] Pod CIDR size overprovisioning config for the cluster. Pod CIDR size per node depends on max_pods_per_node. By default, the value of max_pods_per_node is doubled and then rounded off to next power of 2 to get the size of pod CIDR block per node. Example: max_pods_per_node of 30 would result in 64 IPs (/26). This config can disable the doubling of IPs (we still round off to next power of 2) Example: max_pods_per_node of 30 will result in 32 IPs (/27) when overprovisioning is disabled.
         */
        podCidrOverprovisionConfig?: Schema$PodCIDROverprovisionConfig;
        /**
         * This field is deprecated, use services_ipv4_cidr_block.
         */
        servicesIpv4Cidr?: string | null;
        /**
         * The IP address range of the services IPs in this cluster. If blank, a range will be automatically chosen with the default size. This field is only applicable when `use_ip_aliases` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.
         */
        servicesIpv4CidrBlock?: string | null;
        /**
         * Output only. The services IPv6 CIDR block for the cluster.
         */
        servicesIpv6CidrBlock?: string | null;
        /**
         * The name of the secondary range to be used as for the services CIDR block. The secondary range will be used for service ClusterIPs. This must be an existing secondary range associated with the cluster subnetwork. This field is only applicable with use_ip_aliases and create_subnetwork is false.
         */
        servicesSecondaryRangeName?: string | null;
        /**
         * IP stack type
         */
        stackType?: string | null;
        /**
         * Output only. The subnet's IPv6 CIDR block used by nodes and pods.
         */
        subnetIpv6CidrBlock?: string | null;
        /**
         * A custom subnetwork name to be used if `create_subnetwork` is true. If this field is empty, then an automatic name will be chosen for the new subnetwork.
         */
        subnetworkName?: string | null;
        /**
         * The IP address range of the Cloud TPUs in this cluster. If unspecified, a range will be automatically chosen with the default size. This field is only applicable when `use_ip_aliases` is true. If unspecified, the range will use the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use. This field is deprecated, use cluster.tpu_config.ipv4_cidr_block instead.
         */
        tpuIpv4CidrBlock?: string | null;
        /**
         * Whether alias IPs will be used for pod IPs in the cluster. This is used in conjunction with use_routes. It cannot be true if use_routes is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode
         */
        useIpAliases?: boolean | null;
        /**
         * Whether routes will be used for pod IPs in the cluster. This is used in conjunction with use_ip_aliases. It cannot be true if use_ip_aliases is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode
         */
        useRoutes?: boolean | null;
    }
    /**
     * IP endpoints configuration.
     */
    export interface Schema$IPEndpointsConfig {
        /**
         * Configuration of authorized networks. If enabled, restricts access to the control plane based on source IP. It is invalid to specify both Cluster.masterAuthorizedNetworksConfig and this field at the same time.
         */
        authorizedNetworksConfig?: Schema$MasterAuthorizedNetworksConfig;
        /**
         * Controls whether to allow direct IP access.
         */
        enabled?: boolean | null;
        /**
         * Controls whether the control plane allows access through a public IP. It is invalid to specify both PrivateClusterConfig.enablePrivateEndpoint and this field at the same time.
         */
        enablePublicEndpoint?: boolean | null;
        /**
         * Controls whether the control plane's private endpoint is accessible from sources in other regions. It is invalid to specify both PrivateClusterMasterGlobalAccessConfig.enabled and this field at the same time.
         */
        globalAccess?: boolean | null;
        /**
         * Output only. The internal IP address of this cluster's control plane. Only populated if enabled.
         */
        privateEndpoint?: string | null;
        /**
         * Subnet to provision the master's private endpoint during cluster creation. Specified in projects/x/regions/x/subnetworks/x format. It is invalid to specify both PrivateClusterConfig.privateEndpointSubnetwork and this field at the same time.
         */
        privateEndpointSubnetwork?: string | null;
        /**
         * Output only. The external IP address of this cluster's control plane. Only populated if enabled.
         */
        publicEndpoint?: string | null;
    }
    /**
     * Configuration options for Istio addon.
     */
    export interface Schema$IstioConfig {
        /**
         * The specified Istio auth mode, either none, or mutual TLS.
         */
        auth?: string | null;
        /**
         * Whether Istio is enabled for this cluster.
         */
        disabled?: boolean | null;
    }
    /**
     * Jwk is a JSON Web Key as specified in RFC 7517
     */
    export interface Schema$Jwk {
        /**
         * Algorithm.
         */
        alg?: string | null;
        /**
         * Used for ECDSA keys.
         */
        crv?: string | null;
        /**
         * Used for RSA keys.
         */
        e?: string | null;
        /**
         * Key ID.
         */
        kid?: string | null;
        /**
         * Key Type.
         */
        kty?: string | null;
        /**
         * Used for RSA keys.
         */
        n?: string | null;
        /**
         * Permitted uses for the public keys.
         */
        use?: string | null;
        /**
         * Used for ECDSA keys.
         */
        x?: string | null;
        /**
         * Used for ECDSA keys.
         */
        y?: string | null;
    }
    /**
     * Kubernetes open source beta apis enabled on the cluster.
     */
    export interface Schema$K8sBetaAPIConfig {
        /**
         * api name, e.g. storage.k8s.io/v1beta1/csistoragecapacities.
         */
        enabledApis?: string[] | null;
    }
    /**
     * Configuration options for the KALM addon.
     */
    export interface Schema$KalmConfig {
        /**
         * Whether KALM is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration for the Kubernetes Dashboard.
     */
    export interface Schema$KubernetesDashboard {
        /**
         * Whether the Kubernetes Dashboard is enabled for this cluster.
         */
        disabled?: boolean | null;
    }
    /**
     * Configuration for the legacy Attribute Based Access Control authorization mode.
     */
    export interface Schema$LegacyAbac {
        /**
         * Whether the ABAC authorizer is enabled for this cluster. When enabled, identities in the system, including service accounts, nodes, and controllers, will have statically granted permissions beyond those provided by the RBAC configuration or IAM.
         */
        enabled?: boolean | null;
    }
    /**
     * Parameters that can be configured on Linux nodes.
     */
    export interface Schema$LinuxNodeConfig {
        /**
         * cgroup_mode specifies the cgroup mode to be used on the node.
         */
        cgroupMode?: string | null;
        /**
         * Optional. Amounts for 2M and 1G hugepages
         */
        hugepages?: Schema$HugepagesConfig;
        /**
         * The Linux kernel parameters to be applied to the nodes and all pods running on the nodes. The following parameters are supported. net.core.busy_poll net.core.busy_read net.core.netdev_max_backlog net.core.rmem_max net.core.rmem_default net.core.wmem_default net.core.wmem_max net.core.optmem_max net.core.somaxconn net.ipv4.tcp_rmem net.ipv4.tcp_wmem net.ipv4.tcp_tw_reuse net.netfilter.nf_conntrack_max net.netfilter.nf_conntrack_buckets net.netfilter.nf_conntrack_tcp_timeout_close_wait net.netfilter.nf_conntrack_tcp_timeout_time_wait net.netfilter.nf_conntrack_tcp_timeout_established net.netfilter.nf_conntrack_acct kernel.shmmni kernel.shmmax kernel.shmall vm.max_map_count
         */
        sysctls?: {
            [key: string]: string;
        } | null;
    }
    /**
     * ListClustersResponse is the result of ListClustersRequest.
     */
    export interface Schema$ListClustersResponse {
        /**
         * A list of clusters in the project in the specified zone, or across all ones.
         */
        clusters?: Schema$Cluster[];
        /**
         * If any zones are listed here, the list of clusters returned may be missing those zones.
         */
        missingZones?: string[] | null;
    }
    /**
     * ListLocationsResponse returns the list of all GKE locations and their recommendation state.
     */
    export interface Schema$ListLocationsResponse {
        /**
         * A full list of GKE locations.
         */
        locations?: Schema$Location[];
        /**
         * Only return ListLocationsResponse that occur after the page_token. This value should be populated from the ListLocationsResponse.next_page_token if that response token was set (which happens when listing more Locations than fit in a single ListLocationsResponse).
         */
        nextPageToken?: string | null;
    }
    /**
     * ListNodePoolsResponse is the result of ListNodePoolsRequest.
     */
    export interface Schema$ListNodePoolsResponse {
        /**
         * A list of node pools for a cluster.
         */
        nodePools?: Schema$NodePool[];
    }
    /**
     * ListOperationsResponse is the result of ListOperationsRequest.
     */
    export interface Schema$ListOperationsResponse {
        /**
         * If any zones are listed here, the list of operations returned may be missing the operations from those zones.
         */
        missingZones?: string[] | null;
        /**
         * A list of operations in the project in the specified zone.
         */
        operations?: Schema$Operation[];
    }
    /**
     * ListUsableSubnetworksResponse is the response of ListUsableSubnetworksRequest.
     */
    export interface Schema$ListUsableSubnetworksResponse {
        /**
         * This token allows you to get the next page of results for list requests. If the number of results is larger than `page_size`, use the `next_page_token` as a value for the query parameter `page_token` in the next request. The value will become empty when there are no more pages.
         */
        nextPageToken?: string | null;
        /**
         * A list of usable subnetworks in the specified network project.
         */
        subnetworks?: Schema$UsableSubnetwork[];
    }
    /**
     * LocalNvmeSsdBlockConfig contains configuration for using raw-block local NVMe SSDs
     */
    export interface Schema$LocalNvmeSsdBlockConfig {
        /**
         * Number of local NVMe SSDs to use. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.
         */
        localSsdCount?: number | null;
    }
    /**
     * Location returns the location name, and if the location is recommended for GKE cluster scheduling.
     */
    export interface Schema$Location {
        /**
         * Contains the name of the resource requested. Specified in the format `projects/x/locations/x`.
         */
        name?: string | null;
        /**
         * Whether the location is recommended for GKE cluster scheduling.
         */
        recommended?: boolean | null;
        /**
         * Contains the type of location this Location is for. Regional or Zonal.
         */
        type?: string | null;
    }
    /**
     * LoggingComponentConfig is cluster logging component configuration.
     */
    export interface Schema$LoggingComponentConfig {
        /**
         * Select components to collect logs. An empty set would disable all logging.
         */
        enableComponents?: string[] | null;
    }
    /**
     * LoggingConfig is cluster logging configuration.
     */
    export interface Schema$LoggingConfig {
        /**
         * Logging components configuration
         */
        componentConfig?: Schema$LoggingComponentConfig;
    }
    /**
     * LoggingVariantConfig specifies the behaviour of the logging component.
     */
    export interface Schema$LoggingVariantConfig {
        /**
         * Logging variant deployed on nodes.
         */
        variant?: string | null;
    }
    /**
     * Represents the Maintenance exclusion option.
     */
    export interface Schema$MaintenanceExclusionOptions {
        /**
         * Scope specifies the upgrade scope which upgrades are blocked by the exclusion.
         */
        scope?: string | null;
    }
    /**
     * MaintenancePolicy defines the maintenance policy to be used for the cluster.
     */
    export interface Schema$MaintenancePolicy {
        /**
         * A hash identifying the version of this policy, so that updates to fields of the policy won't accidentally undo intermediate changes (and so that users of the API unaware of some fields won't accidentally remove other fields). Make a `get()` request to the cluster to get the current resource version and include it with requests to set the policy.
         */
        resourceVersion?: string | null;
        /**
         * Specifies the maintenance window in which maintenance may be performed.
         */
        window?: Schema$MaintenanceWindow;
    }
    /**
     * MaintenanceWindow defines the maintenance window to be used for the cluster.
     */
    export interface Schema$MaintenanceWindow {
        /**
         * DailyMaintenanceWindow specifies a daily maintenance operation window.
         */
        dailyMaintenanceWindow?: Schema$DailyMaintenanceWindow;
        /**
         * Exceptions to maintenance window. Non-emergency maintenance should not occur in these windows.
         */
        maintenanceExclusions?: {
            [key: string]: Schema$TimeWindow;
        } | null;
        /**
         * RecurringWindow specifies some number of recurring time periods for maintenance to occur. The time windows may be overlapping. If no maintenance windows are set, maintenance can occur at any time.
         */
        recurringWindow?: Schema$RecurringTimeWindow;
    }
    /**
     * ManagedPrometheusConfig defines the configuration for Google Cloud Managed Service for Prometheus.
     */
    export interface Schema$ManagedPrometheusConfig {
        /**
         * GKE Workload Auto-Monitoring Configuration.
         */
        autoMonitoringConfig?: Schema$AutoMonitoringConfig;
        /**
         * Enable Managed Collection.
         */
        enabled?: boolean | null;
    }
    /**
     * Master is the configuration for components on master.
     */
    export interface Schema$Master {
    }
    /**
     * The authentication information for accessing the master endpoint. Authentication can be done using HTTP basic auth or using client certificates.
     */
    export interface Schema$MasterAuth {
        /**
         * Output only. Base64-encoded public certificate used by clients to authenticate to the cluster endpoint. Issued only if client_certificate_config is set.
         */
        clientCertificate?: string | null;
        /**
         * Configuration for client certificate authentication on the cluster. For clusters before v1.12, if no configuration is specified, a client certificate is issued.
         */
        clientCertificateConfig?: Schema$ClientCertificateConfig;
        /**
         * Output only. Base64-encoded private key used by clients to authenticate to the cluster endpoint.
         */
        clientKey?: string | null;
        /**
         * Output only. Base64-encoded public certificate that is the root of trust for the cluster.
         */
        clusterCaCertificate?: string | null;
        /**
         * The password to use for HTTP basic authentication to the master endpoint. Because the master endpoint is open to the Internet, you should create a strong password. If a password is provided for cluster creation, username must be non-empty. Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication
         */
        password?: string | null;
        /**
         * The username to use for HTTP basic authentication to the master endpoint. For clusters v1.6.0 and later, basic authentication can be disabled by leaving username unspecified (or setting it to the empty string). Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication
         */
        username?: string | null;
    }
    /**
     * Configuration options for the master authorized networks feature. Enabled master authorized networks will disallow all external traffic to access Kubernetes master through HTTPS except traffic from the given CIDR blocks, Google Compute Engine Public IPs and Google Prod IPs.
     */
    export interface Schema$MasterAuthorizedNetworksConfig {
        /**
         * cidr_blocks define up to 10 external networks that could access Kubernetes master through HTTPS.
         */
        cidrBlocks?: Schema$CidrBlock[];
        /**
         * Whether or not master authorized networks is enabled.
         */
        enabled?: boolean | null;
        /**
         * Whether master is accessible via Google Compute Engine Public IP addresses.
         */
        gcpPublicCidrsAccessEnabled?: boolean | null;
        /**
         * Whether master authorized networks is enforced on private endpoint or not.
         */
        privateEndpointEnforcementEnabled?: boolean | null;
    }
    /**
     * Constraints applied to pods.
     */
    export interface Schema$MaxPodsConstraint {
        /**
         * Constraint enforced on the max num of pods per node.
         */
        maxPodsPerNode?: string | null;
    }
    /**
     * The option enables the Kubernetes NUMA-aware Memory Manager feature. Detailed description about the feature can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/).
     */
    export interface Schema$MemoryManager {
        /**
         * Controls the memory management policy on the Node. See https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#policies The following values are allowed. * "none" * "static" The default value is 'none' if unspecified.
         */
        policy?: string | null;
    }
    /**
     * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
     */
    export interface Schema$MeshCertificates {
        /**
         * enable_certificates controls issuance of workload mTLS certificates. If set, the GKE Workload Identity Certificates controller and node agent will be deployed in the cluster, which can then be configured by creating a WorkloadCertificateConfig Custom Resource. Requires Workload Identity (workload_pool must be non-empty).
         */
        enableCertificates?: boolean | null;
    }
    /**
     * Progress metric is (string, int|float|string) pair.
     */
    export interface Schema$Metric {
        /**
         * For metrics with floating point value.
         */
        doubleValue?: number | null;
        /**
         * For metrics with integer value.
         */
        intValue?: string | null;
        /**
         * Required. Metric name, e.g., "nodes total", "percent done".
         */
        name?: string | null;
        /**
         * For metrics with custom values (ratios, visual progress, etc.).
         */
        stringValue?: string | null;
    }
    /**
     * MonitoringComponentConfig is cluster monitoring component configuration.
     */
    export interface Schema$MonitoringComponentConfig {
        /**
         * Select components to collect metrics. An empty set would disable all monitoring.
         */
        enableComponents?: string[] | null;
    }
    /**
     * MonitoringConfig is cluster monitoring configuration.
     */
    export interface Schema$MonitoringConfig {
        /**
         * Configuration of Advanced Datapath Observability features.
         */
        advancedDatapathObservabilityConfig?: Schema$AdvancedDatapathObservabilityConfig;
        /**
         * Monitoring components configuration
         */
        componentConfig?: Schema$MonitoringComponentConfig;
        /**
         * Enable Google Cloud Managed Service for Prometheus in the cluster.
         */
        managedPrometheusConfig?: Schema$ManagedPrometheusConfig;
    }
    /**
     * NetworkConfig reports the relative names of network & subnetwork.
     */
    export interface Schema$NetworkConfig {
        /**
         * The desired datapath provider for this cluster. By default, uses the IPTables-based kube-proxy implementation.
         */
        datapathProvider?: string | null;
        /**
         * Controls whether by default nodes have private IP addresses only. It is invalid to specify both PrivateClusterConfig.enablePrivateNodes and this field at the same time. To update the default setting, use ClusterUpdate.desired_default_enable_private_nodes
         */
        defaultEnablePrivateNodes?: boolean | null;
        /**
         * Whether the cluster disables default in-node sNAT rules. In-node sNAT rules will be disabled when default_snat_status is disabled. When disabled is set to false, default IP masquerade rules will be applied to the nodes to prevent sNAT on cluster internal traffic.
         */
        defaultSnatStatus?: Schema$DefaultSnatStatus;
        /**
         * Disable L4 load balancer VPC firewalls to enable firewall policies.
         */
        disableL4LbFirewallReconciliation?: boolean | null;
        /**
         * DNSConfig contains clusterDNS config for this cluster.
         */
        dnsConfig?: Schema$DNSConfig;
        /**
         * Whether CiliumClusterWideNetworkPolicy is enabled on this cluster.
         */
        enableCiliumClusterwideNetworkPolicy?: boolean | null;
        /**
         * Whether FQDN Network Policy is enabled on this cluster.
         */
        enableFqdnNetworkPolicy?: boolean | null;
        /**
         * Whether Intra-node visibility is enabled for this cluster. This makes same node pod to pod traffic visible for VPC network.
         */
        enableIntraNodeVisibility?: boolean | null;
        /**
         * Whether L4ILB Subsetting is enabled for this cluster.
         */
        enableL4ilbSubsetting?: boolean | null;
        /**
         * Whether multi-networking is enabled for this cluster.
         */
        enableMultiNetworking?: boolean | null;
        /**
         * GatewayAPIConfig contains the desired config of Gateway API on this cluster.
         */
        gatewayApiConfig?: Schema$GatewayAPIConfig;
        /**
         * Specify the details of in-transit encryption.
         */
        inTransitEncryptionConfig?: string | null;
        /**
         * Output only. The relative name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. Example: projects/my-project/global/networks/my-network
         */
        network?: string | null;
        /**
         * Network bandwidth tier configuration.
         */
        networkPerformanceConfig?: Schema$ClusterNetworkPerformanceConfig;
        /**
         * The desired state of IPv6 connectivity to Google Services. By default, no private IPv6 access to or from Google Services (all access will be via IPv4)
         */
        privateIpv6GoogleAccess?: string | null;
        /**
         * ServiceExternalIPsConfig specifies if services with externalIPs field are blocked or not.
         */
        serviceExternalIpsConfig?: Schema$ServiceExternalIPsConfig;
        /**
         * Output only. The relative name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/vpc) to which the cluster is connected. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet
         */
        subnetwork?: string | null;
    }
    /**
     * Configuration of all network bandwidth tiers
     */
    export interface Schema$NetworkPerformanceConfig {
        /**
         * Specifies the network bandwidth tier for the NodePool for traffic to external/public IP addresses.
         */
        externalIpEgressBandwidthTier?: string | null;
        /**
         * Specifies the total network bandwidth tier for the NodePool.
         */
        totalEgressBandwidthTier?: string | null;
    }
    /**
     * Configuration options for the NetworkPolicy feature. https://kubernetes.io/docs/concepts/services-networking/networkpolicies/
     */
    export interface Schema$NetworkPolicy {
        /**
         * Whether network policy is enabled on the cluster.
         */
        enabled?: boolean | null;
        /**
         * The selected network policy provider.
         */
        provider?: string | null;
    }
    /**
     * Configuration for NetworkPolicy. This only tracks whether the addon is enabled or not on the Master, it does not track whether network policy is enabled for the nodes.
     */
    export interface Schema$NetworkPolicyConfig {
        /**
         * Whether NetworkPolicy is enabled for this cluster.
         */
        disabled?: boolean | null;
    }
    /**
     * Collection of Compute Engine network tags that can be applied to a node's underlying VM instance. (See `tags` field in [`NodeConfig`](/kubernetes-engine/docs/reference/rest/v1/NodeConfig)).
     */
    export interface Schema$NetworkTags {
        /**
         * List of network tags.
         */
        tags?: string[] | null;
    }
    /**
     * Specifies the NodeAffinity key, values, and affinity operator according to [shared sole tenant node group affinities](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes#node_affinity_and_anti-affinity).
     */
    export interface Schema$NodeAffinity {
        /**
         * Key for NodeAffinity.
         */
        key?: string | null;
        /**
         * Operator for NodeAffinity.
         */
        operator?: string | null;
        /**
         * Values for NodeAffinity.
         */
        values?: string[] | null;
    }
    /**
     * Parameters that describe the nodes in a cluster. GKE Autopilot clusters do not recognize parameters in `NodeConfig`. Use AutoprovisioningNodePoolDefaults instead.
     */
    export interface Schema$NodeConfig {
        /**
         * A list of hardware accelerators to be attached to each node. See https://cloud.google.com/compute/docs/gpus for more information about support for GPUs.
         */
        accelerators?: Schema$AcceleratorConfig[];
        /**
         * Advanced features for the Compute Engine VM.
         */
        advancedMachineFeatures?: Schema$AdvancedMachineFeatures;
        /**
         *  The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption
         */
        bootDiskKmsKey?: string | null;
        /**
         * Confidential nodes config. All the nodes in the node pool will be Confidential VM once enabled.
         */
        confidentialNodes?: Schema$ConfidentialNodes;
        /**
         * Parameters for containerd customization.
         */
        containerdConfig?: Schema$ContainerdConfig;
        /**
         * Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. TODO(b/395671893) - Deprecate disk_size_gb and disk_type fields. If unspecified, the default disk size is 100GB.
         */
        diskSizeGb?: number | null;
        /**
         * Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') If unspecified, the default disk type is 'pd-standard'
         */
        diskType?: string | null;
        /**
         * Output only. effective_cgroup_mode is the cgroup mode actually used by the node pool. It is determined by the cgroup mode specified in the LinuxNodeConfig or the default cgroup mode based on the cluster creation version.
         */
        effectiveCgroupMode?: string | null;
        /**
         * Optional. Reserved for future use.
         */
        enableConfidentialStorage?: boolean | null;
        /**
         * Parameters for the ephemeral storage filesystem. If unspecified, ephemeral storage is backed by the boot disk.
         */
        ephemeralStorageConfig?: Schema$EphemeralStorageConfig;
        /**
         * Parameters for the node ephemeral storage using Local SSDs. If unspecified, ephemeral storage is backed by the boot disk. This field is functionally equivalent to the ephemeral_storage_config
         */
        ephemeralStorageLocalSsdConfig?: Schema$EphemeralStorageLocalSsdConfig;
        /**
         * Enable or disable NCCL fast socket for the node pool.
         */
        fastSocket?: Schema$FastSocket;
        /**
         * Flex Start flag for enabling Flex Start VM.
         */
        flexStart?: boolean | null;
        /**
         * GCFS (Google Container File System) configs.
         */
        gcfsConfig?: Schema$GcfsConfig;
        /**
         * Enable or disable gvnic on the node pool.
         */
        gvnic?: Schema$VirtualNIC;
        /**
         * HostMaintenancePolicy contains the desired maintenance policy for the Google Compute Engine hosts.
         */
        hostMaintenancePolicy?: Schema$HostMaintenancePolicy;
        /**
         * The image type to use for this node. Note that for a given image type, the latest version of it will be used. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.
         */
        imageType?: string | null;
        /**
         * Node kubelet configs.
         */
        kubeletConfig?: Schema$NodeKubeletConfig;
        /**
         * The map of Kubernetes labels (key/value pairs) to be applied to each node. These will added in addition to any default label(s) that Kubernetes may apply to the node. In case of conflict in label keys, the applied set may differ depending on the Kubernetes version -- it's best to assume the behavior is undefined and conflicts should be avoided. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Parameters that can be configured on Linux nodes.
         */
        linuxNodeConfig?: Schema$LinuxNodeConfig;
        /**
         * Parameters for using raw-block Local NVMe SSDs.
         */
        localNvmeSsdBlockConfig?: Schema$LocalNvmeSsdBlockConfig;
        /**
         * The number of local SSD disks to be attached to the node. The limit for this value is dependent upon the maximum number of disks available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information.
         */
        localSsdCount?: number | null;
        /**
         * Specifies which method should be used for encrypting the Local SSDs attached to the node.
         */
        localSsdEncryptionMode?: string | null;
        /**
         * Logging configuration.
         */
        loggingConfig?: Schema$NodePoolLoggingConfig;
        /**
         * The name of a Google Compute Engine [machine type](https://cloud.google.com/compute/docs/machine-types). If unspecified, the default machine type is `e2-medium`.
         */
        machineType?: string | null;
        /**
         * The maximum duration for the nodes to exist. If unspecified, the nodes can exist indefinitely.
         */
        maxRunDuration?: string | null;
        /**
         * The metadata key/value pairs assigned to instances in the cluster. Keys must conform to the regexp `[a-zA-Z0-9-_]+` and be less than 128 bytes in length. These are reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project or be one of the reserved keys: - "cluster-location" - "cluster-name" - "cluster-uid" - "configure-sh" - "containerd-configure-sh" - "enable-oslogin" - "gci-ensure-gke-docker" - "gci-metrics-enabled" - "gci-update-strategy" - "instance-template" - "kube-env" - "startup-script" - "user-data" - "disable-address-manager" - "windows-startup-script-ps1" - "common-psm1" - "k8s-node-setup-psm1" - "install-ssh-psm1" - "user-profile-psm1" Values are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on them is that each value's size must be less than or equal to 32 KB. The total size of all keys and values must be less than 512 KB.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Minimum CPU platform to be used by this instance. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: "Intel Haswell"` or `minCpuPlatform: "Intel Sandy Bridge"`. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform).
         */
        minCpuPlatform?: string | null;
        /**
         * Setting this field will assign instances of this pool to run on the specified node group. This is useful for running workloads on [sole tenant nodes](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes).
         */
        nodeGroup?: string | null;
        /**
         * The set of Google API scopes to be made available on all of the node VMs under the "default" service account. The following scopes are recommended, but not required, and by default are not included: * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Google Container Registry](https://cloud.google.com/container-registry/)). If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.
         */
        oauthScopes?: string[] | null;
        /**
         * Whether the nodes are created as preemptible VM instances. See: https://cloud.google.com/compute/docs/instances/preemptible for more information about preemptible VM instances.
         */
        preemptible?: boolean | null;
        /**
         * The optional reservation affinity. Setting this field will apply the specified [Zonal Compute Reservation](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) to this node pool.
         */
        reservationAffinity?: Schema$ReservationAffinity;
        /**
         * The resource labels for the node pool to use to annotate any related Google Compute Engine resources.
         */
        resourceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * A map of resource manager tag keys and values to be attached to the nodes.
         */
        resourceManagerTags?: Schema$ResourceManagerTags;
        /**
         * Sandbox configuration for this node.
         */
        sandboxConfig?: Schema$SandboxConfig;
        /**
         * List of secondary boot disks attached to the nodes.
         */
        secondaryBootDisks?: Schema$SecondaryBootDisk[];
        /**
         * Secondary boot disk update strategy.
         */
        secondaryBootDiskUpdateStrategy?: Schema$SecondaryBootDiskUpdateStrategy;
        /**
         * The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.
         */
        serviceAccount?: string | null;
        /**
         * Shielded Instance options.
         */
        shieldedInstanceConfig?: Schema$ShieldedInstanceConfig;
        /**
         * Parameters for node pools to be backed by shared sole tenant node groups.
         */
        soleTenantConfig?: Schema$SoleTenantConfig;
        /**
         * Spot flag for enabling Spot VM, which is a rebrand of the existing preemptible flag.
         */
        spot?: boolean | null;
        /**
         * List of Storage Pools where boot disks are provisioned.
         */
        storagePools?: string[] | null;
        /**
         * The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster or node pool creation. Each tag within the list must comply with RFC1035.
         */
        tags?: string[] | null;
        /**
         * List of kubernetes taints to be applied to each node. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
         */
        taints?: Schema$NodeTaint[];
        /**
         * Parameters that can be configured on Windows nodes.
         */
        windowsNodeConfig?: Schema$WindowsNodeConfig;
        /**
         * The workload metadata configuration for this node.
         */
        workloadMetadataConfig?: Schema$WorkloadMetadataConfig;
    }
    /**
     * Subset of NodeConfig message that has defaults.
     */
    export interface Schema$NodeConfigDefaults {
        /**
         * Parameters for containerd customization.
         */
        containerdConfig?: Schema$ContainerdConfig;
        /**
         * GCFS (Google Container File System, also known as Riptide) options.
         */
        gcfsConfig?: Schema$GcfsConfig;
        /**
         * HostMaintenancePolicy contains the desired maintenance policy for the Google Compute Engine hosts.
         */
        hostMaintenancePolicy?: Schema$HostMaintenancePolicy;
        /**
         * Logging configuration for node pools.
         */
        loggingConfig?: Schema$NodePoolLoggingConfig;
        /**
         * NodeKubeletConfig controls the defaults for new node-pools. Currently only `insecure_kubelet_readonly_port_enabled` can be set here.
         */
        nodeKubeletConfig?: Schema$NodeKubeletConfig;
    }
    /**
     * Node kubelet configs.
     */
    export interface Schema$NodeKubeletConfig {
        /**
         * Optional. Defines a comma-separated allowlist of unsafe sysctls or sysctl patterns (ending in `*`). The unsafe namespaced sysctl groups are `kernel.shm*`, `kernel.msg*`, `kernel.sem`, `fs.mqueue.*`, and `net.*`. Leaving this allowlist empty means they cannot be set on Pods. To allow certain sysctls or sysctl patterns to be set on Pods, list them separated by commas. For example: `kernel.msg*,net.ipv4.route.min_pmtu`. See https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/ for more details.
         */
        allowedUnsafeSysctls?: string[] | null;
        /**
         * Optional. Defines the maximum number of container log files that can be present for a container. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation The value must be an integer between 2 and 10, inclusive. The default value is 5 if unspecified.
         */
        containerLogMaxFiles?: number | null;
        /**
         * Optional. Defines the maximum size of the container log file before it is rotated. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation Valid format is positive number + unit, e.g. 100Ki, 10Mi. Valid units are Ki, Mi, Gi. The value must be between 10Mi and 500Mi, inclusive. Note that the total container log size (container_log_max_size * container_log_max_files) cannot exceed 1% of the total storage of the node, to avoid disk pressure caused by log files. The default value is 10Mi if unspecified.
         */
        containerLogMaxSize?: string | null;
        /**
         * Enable CPU CFS quota enforcement for containers that specify CPU limits. This option is enabled by default which makes kubelet use CFS quota (https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt) to enforce container CPU limits. Otherwise, CPU limits will not be enforced at all. Disable this option to mitigate CPU throttling problems while still having your pods to be in Guaranteed QoS class by specifying the CPU limits. The default value is 'true' if unspecified.
         */
        cpuCfsQuota?: boolean | null;
        /**
         * Set the CPU CFS quota period value 'cpu.cfs_period_us'. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration.
         */
        cpuCfsQuotaPeriod?: string | null;
        /**
         * Control the CPU management policy on the node. See https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/ The following values are allowed. * "none": the default, which represents the existing scheduling behavior. * "static": allows pods with certain resource characteristics to be granted increased CPU affinity and exclusivity on the node. The default value is 'none' if unspecified.
         */
        cpuManagerPolicy?: string | null;
        /**
         * Optional. Defines the percent of disk usage after which image garbage collection is always run. The percent is calculated as this field value out of 100. The value must be between 10 and 85, inclusive and greater than image_gc_low_threshold_percent. The default value is 85 if unspecified.
         */
        imageGcHighThresholdPercent?: number | null;
        /**
         * Optional. Defines the percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. The percent is calculated as this field value out of 100. The value must be between 10 and 85, inclusive and smaller than image_gc_high_threshold_percent. The default value is 80 if unspecified.
         */
        imageGcLowThresholdPercent?: number | null;
        /**
         * Optional. Defines the maximum age an image can be unused before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration greater than image_minimum_gc_age or "0s". The default value is "0s" if unspecified, which disables this field, meaning images won't be garbage collected based on being unused for too long.
         */
        imageMaximumGcAge?: string | null;
        /**
         * Optional. Defines the minimum age for an unused image before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration less than or equal to 2 minutes. The default value is "2m0s" if unspecified.
         */
        imageMinimumGcAge?: string | null;
        /**
         * Enable or disable Kubelet read only port.
         */
        insecureKubeletReadonlyPortEnabled?: boolean | null;
        /**
         * Optional. Controls NUMA-aware Memory Manager configuration on the node. For more information, see: https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/
         */
        memoryManager?: Schema$MemoryManager;
        /**
         * Set the Pod PID limits. See https://kubernetes.io/docs/concepts/policy/pid-limiting/#pod-pid-limits Controls the maximum number of processes allowed to run in a pod. The value must be greater than or equal to 1024 and less than 4194304.
         */
        podPidsLimit?: string | null;
        /**
         * Optional. Controls Topology Manager configuration on the node. For more information, see: https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/
         */
        topologyManager?: Schema$TopologyManager;
    }
    /**
     * Collection of node-level [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels).
     */
    export interface Schema$NodeLabels {
        /**
         * Map of node label keys and node label values.
         */
        labels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * NodeManagement defines the set of node management services turned on for the node pool.
     */
    export interface Schema$NodeManagement {
        /**
         * Whether the nodes will be automatically repaired.
         */
        autoRepair?: boolean | null;
        /**
         * Whether the nodes will be automatically upgraded.
         */
        autoUpgrade?: boolean | null;
        /**
         * Specifies the Auto Upgrade knobs for the node pool.
         */
        upgradeOptions?: Schema$AutoUpgradeOptions;
    }
    /**
     * Parameters for node pool-level network config.
     */
    export interface Schema$NodeNetworkConfig {
        /**
         * We specify the additional node networks for this node pool using this list. Each node network corresponds to an additional interface
         */
        additionalNodeNetworkConfigs?: Schema$AdditionalNodeNetworkConfig[];
        /**
         * We specify the additional pod networks for this node pool using this list. Each pod network corresponds to an additional alias IP range for the node
         */
        additionalPodNetworkConfigs?: Schema$AdditionalPodNetworkConfig[];
        /**
         * Input only. Whether to create a new range for pod IPs in this node pool. Defaults are provided for `pod_range` and `pod_ipv4_cidr_block` if they are not specified. If neither `create_pod_range` or `pod_range` are specified, the cluster-level default (`ip_allocation_policy.cluster_ipv4_cidr_block`) is used. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.
         */
        createPodRange?: boolean | null;
        /**
         * Whether nodes have internal IP addresses only. If enable_private_nodes is not specified, then the value is derived from Cluster.NetworkConfig.default_enable_private_nodes
         */
        enablePrivateNodes?: boolean | null;
        /**
         * Network bandwidth tier configuration.
         */
        networkPerformanceConfig?: Schema$NetworkPerformanceConfig;
        /**
         * [PRIVATE FIELD] Pod CIDR size overprovisioning config for the nodepool. Pod CIDR size per node depends on max_pods_per_node. By default, the value of max_pods_per_node is rounded off to next power of 2 and we then double that to get the size of pod CIDR block per node. Example: max_pods_per_node of 30 would result in 64 IPs (/26). This config can disable the doubling of IPs (we still round off to next power of 2) Example: max_pods_per_node of 30 will result in 32 IPs (/27) when overprovisioning is disabled.
         */
        podCidrOverprovisionConfig?: Schema$PodCIDROverprovisionConfig;
        /**
         * The IP address range for pod IPs in this node pool. Only applicable if `create_pod_range` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) to pick a specific range to use. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.
         */
        podIpv4CidrBlock?: string | null;
        /**
         * Output only. The utilization of the IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode.
         */
        podIpv4RangeUtilization?: number | null;
        /**
         * The ID of the secondary range for pod IPs. If `create_pod_range` is true, this ID is used for the new range. If `create_pod_range` is false, uses an existing secondary range with this ID. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.
         */
        podRange?: string | null;
    }
    /**
     * NodePool contains the name and configuration for a cluster's node pool. Node pools are a set of nodes (i.e. VM's), with a common configuration and specification, under the control of the cluster master. They may have a set of Kubernetes labels applied to them, which may be used to reference them during pod scheduling. They may also be resized up or down, to accommodate the workload.
     */
    export interface Schema$NodePool {
        /**
         * Specifies the autopilot configuration for this node pool. This field is exclusively reserved for Cluster Autoscaler.
         */
        autopilotConfig?: Schema$AutopilotConfig;
        /**
         * Autoscaler configuration for this NodePool. Autoscaler is enabled only if a valid configuration is present.
         */
        autoscaling?: Schema$NodePoolAutoscaling;
        /**
         * Enable best effort provisioning for nodes
         */
        bestEffortProvisioning?: Schema$BestEffortProvisioning;
        /**
         * Which conditions caused the current node pool state.
         */
        conditions?: Schema$StatusCondition[];
        /**
         * The node configuration of the pool.
         */
        config?: Schema$NodeConfig;
        /**
         * This checksum is computed by the server based on the value of node pool fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * The initial node count for the pool. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota.
         */
        initialNodeCount?: number | null;
        /**
         * Output only. The resource URLs of the [managed instance groups](https://cloud.google.com/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with this node pool. During the node pool blue-green upgrade operation, the URLs contain both blue and green resources.
         */
        instanceGroupUrls?: string[] | null;
        /**
         * The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes should be located. If this value is unspecified during node pool creation, the [Cluster.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.FIELDS.locations) value will be used, instead. Warning: changing node pool locations will result in nodes being added and/or removed.
         */
        locations?: string[] | null;
        /**
         * NodeManagement configuration for this NodePool.
         */
        management?: Schema$NodeManagement;
        /**
         * The constraint on the maximum number of pods that can be run simultaneously on a node in the node pool.
         */
        maxPodsConstraint?: Schema$MaxPodsConstraint;
        /**
         * The name of the node pool.
         */
        name?: string | null;
        /**
         * Networking configuration for this NodePool. If specified, it overrides the cluster-level defaults.
         */
        networkConfig?: Schema$NodeNetworkConfig;
        /**
         * Specifies the node placement policy.
         */
        placementPolicy?: Schema$PlacementPolicy;
        /**
         * Output only. The pod CIDR block size per node in this node pool.
         */
        podIpv4CidrSize?: number | null;
        /**
         * Specifies the configuration of queued provisioning.
         */
        queuedProvisioning?: Schema$QueuedProvisioning;
        /**
         * Output only. Server-defined URL for the resource.
         */
        selfLink?: string | null;
        /**
         * Output only. The status of the nodes in this pool instance.
         */
        status?: string | null;
        /**
         * Output only. Deprecated. Use conditions instead. Additional information about the current status of this node pool instance, if available.
         */
        statusMessage?: string | null;
        /**
         * Output only. Update info contains relevant information during a node pool update.
         */
        updateInfo?: Schema$UpdateInfo;
        /**
         * Upgrade settings control disruption and speed of the upgrade.
         */
        upgradeSettings?: Schema$UpgradeSettings;
        /**
         * The version of Kubernetes running on this NodePool's nodes. If unspecified, it defaults as described [here](https://cloud.google.com/kubernetes-engine/versioning#specifying_node_version).
         */
        version?: string | null;
    }
    /**
     * node pool configs that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters
     */
    export interface Schema$NodePoolAutoConfig {
        /**
         * Output only. Configuration options for Linux nodes.
         */
        linuxNodeConfig?: Schema$LinuxNodeConfig;
        /**
         * The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster creation. Each tag within the list must comply with RFC1035.
         */
        networkTags?: Schema$NetworkTags;
        /**
         * NodeKubeletConfig controls the defaults for autoprovisioned node-pools. Currently only `insecure_kubelet_readonly_port_enabled` can be set here.
         */
        nodeKubeletConfig?: Schema$NodeKubeletConfig;
        /**
         * Resource manager tag keys and values to be attached to the nodes for managing Compute Engine firewalls using Network Firewall Policies.
         */
        resourceManagerTags?: Schema$ResourceManagerTags;
    }
    /**
     * NodePoolAutoscaling contains information required by cluster autoscaler to adjust the size of the node pool to the current cluster usage.
     */
    export interface Schema$NodePoolAutoscaling {
        /**
         * Can this node pool be deleted automatically.
         */
        autoprovisioned?: boolean | null;
        /**
         * Is autoscaling enabled for this node pool.
         */
        enabled?: boolean | null;
        /**
         * Location policy used when scaling up a nodepool.
         */
        locationPolicy?: string | null;
        /**
         * Maximum number of nodes for one location in the node pool. Must be \>= min_node_count. There has to be enough quota to scale up the cluster.
         */
        maxNodeCount?: number | null;
        /**
         * Minimum number of nodes for one location in the node pool. Must be greater than or equal to 0 and less than or equal to max_node_count.
         */
        minNodeCount?: number | null;
        /**
         * Maximum number of nodes in the node pool. Must be greater than or equal to total_min_node_count. There has to be enough quota to scale up the cluster. The total_*_node_count fields are mutually exclusive with the *_node_count fields.
         */
        totalMaxNodeCount?: number | null;
        /**
         * Minimum number of nodes in the node pool. Must be greater than or equal to 0 and less than or equal to total_max_node_count. The total_*_node_count fields are mutually exclusive with the *_node_count fields.
         */
        totalMinNodeCount?: number | null;
    }
    /**
     * Subset of Nodepool message that has defaults.
     */
    export interface Schema$NodePoolDefaults {
        /**
         * Subset of NodeConfig message that has defaults.
         */
        nodeConfigDefaults?: Schema$NodeConfigDefaults;
    }
    /**
     * NodePoolLoggingConfig specifies logging configuration for nodepools.
     */
    export interface Schema$NodePoolLoggingConfig {
        /**
         * Logging variant configuration.
         */
        variantConfig?: Schema$LoggingVariantConfig;
    }
    /**
     * NodePoolUpgradeInfo contains the upgrade information of a nodepool.
     */
    export interface Schema$NodePoolUpgradeInfo {
        /**
         * The auto upgrade status.
         */
        autoUpgradeStatus?: string[] | null;
        /**
         * The nodepool's current minor version's end of extended support timestamp.
         */
        endOfExtendedSupportTimestamp?: string | null;
        /**
         * The nodepool's current minor version's end of standard support timestamp.
         */
        endOfStandardSupportTimestamp?: string | null;
        /**
         * minor_target_version indicates the target version for minor upgrade.
         */
        minorTargetVersion?: string | null;
        /**
         * patch_target_version indicates the target version for patch upgrade.
         */
        patchTargetVersion?: string | null;
        /**
         * The auto upgrade paused reason.
         */
        pausedReason?: string[] | null;
        /**
         * The list of past auto upgrades.
         */
        upgradeDetails?: Schema$UpgradeDetails[];
    }
    /**
     * Kubernetes taint is composed of three fields: key, value, and effect. Effect can only be one of three types: NoSchedule, PreferNoSchedule or NoExecute. See [here](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration) for more information, including usage and the valid values.
     */
    export interface Schema$NodeTaint {
        /**
         * Effect for taint.
         */
        effect?: string | null;
        /**
         * Key for taint.
         */
        key?: string | null;
        /**
         * Value for taint.
         */
        value?: string | null;
    }
    /**
     * Collection of Kubernetes [node taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration).
     */
    export interface Schema$NodeTaints {
        /**
         * List of node taints.
         */
        taints?: Schema$NodeTaint[];
    }
    /**
     * NotificationConfig is the configuration of notifications.
     */
    export interface Schema$NotificationConfig {
        /**
         * Notification config for Pub/Sub.
         */
        pubsub?: Schema$PubSub;
    }
    /**
     * This operation resource represents operations that may have happened or are happening on the cluster. All fields are output only.
     */
    export interface Schema$Operation {
        /**
         * Which conditions caused the current cluster state. Deprecated. Use field error instead.
         */
        clusterConditions?: Schema$StatusCondition[];
        /**
         * Output only. Detailed operation progress, if available.
         */
        detail?: string | null;
        /**
         * Output only. The time the operation completed, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        endTime?: string | null;
        /**
         * The error result of the operation in case of failure.
         */
        error?: Schema$Status;
        /**
         * Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.
         */
        location?: string | null;
        /**
         * Output only. The server-assigned ID for the operation.
         */
        name?: string | null;
        /**
         * Which conditions caused the current node pool state. Deprecated. Use field error instead.
         */
        nodepoolConditions?: Schema$StatusCondition[];
        /**
         * Output only. The operation type.
         */
        operationType?: string | null;
        /**
         * Output only. Progress information for an operation.
         */
        progress?: Schema$OperationProgress;
        /**
         * Output only. Server-defined URI for the operation. Example: `https://container.googleapis.com/v1alpha1/projects/123/locations/us-central1/operations/operation-123`.
         */
        selfLink?: string | null;
        /**
         * Output only. The time the operation started, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.
         */
        startTime?: string | null;
        /**
         * Output only. The current status of the operation.
         */
        status?: string | null;
        /**
         * Output only. If an error has occurred, a textual description of the error. Deprecated. Use field error instead.
         */
        statusMessage?: string | null;
        /**
         * Output only. Server-defined URI for the target of the operation. The format of this is a URI to the resource being modified (such as a cluster, node pool, or node). For node pool repairs, there may be multiple nodes being repaired, but only one will be the target. Examples: - ## `https://container.googleapis.com/v1/projects/123/locations/us-central1/clusters/my-cluster` ## `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np` `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np/node/my-node`
         */
        targetLink?: string | null;
        /**
         * Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation is taking place. This field is deprecated, use location instead.
         */
        zone?: string | null;
    }
    /**
     * OperationError records errors seen from CloudKMS keys encountered during updates to DatabaseEncryption configuration.
     */
    export interface Schema$OperationError {
        /**
         * Description of the error seen during the operation.
         */
        errorMessage?: string | null;
        /**
         * CloudKMS key resource that had the error.
         */
        keyName?: string | null;
        /**
         * Time when the CloudKMS error was seen.
         */
        timestamp?: string | null;
    }
    /**
     * Information about operation (or operation stage) progress.
     */
    export interface Schema$OperationProgress {
        /**
         * Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15\}, {name: "nodes total", int_value: 32\}] or metrics: [{name: "progress", double_value: 0.56\}, {name: "progress scale", double_value: 1.0\}]
         */
        metrics?: Schema$Metric[];
        /**
         * A non-parameterized string describing an operation stage. Unset for single-stage operations.
         */
        name?: string | null;
        /**
         * Substages of an operation or a stage.
         */
        stages?: Schema$OperationProgress[];
        /**
         * Status of an operation stage. Unset for single-stage operations.
         */
        status?: string | null;
    }
    /**
     * Strategy that will trigger maintenance on behalf of the customer.
     */
    export interface Schema$OpportunisticMaintenanceStrategy {
        /**
         * The window of time that opportunistic maintenance can run. Example: A setting of 14 days implies that opportunistic maintenance can only be ran in the 2 weeks leading up to the scheduled maintenance date. Setting 28 days allows opportunistic maintenance to run at any time in the scheduled maintenance window (all `PERIODIC` maintenance is set 28 days in advance).
         */
        maintenanceAvailabilityWindow?: string | null;
        /**
         * The minimum nodes required to be available in a pool. Blocks maintenance if it would cause the number of running nodes to dip below this value.
         */
        minNodesPerPool?: string | null;
        /**
         * The amount of time that a node can remain idle (no customer owned workloads running), before triggering maintenance.
         */
        nodeIdleTimeWindow?: string | null;
    }
    /**
     * Configuration for the Cloud Storage Parallelstore CSI driver.
     */
    export interface Schema$ParallelstoreCsiDriverConfig {
        /**
         * Whether the Cloud Storage Parallelstore CSI driver is enabled for this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * ParentProductConfig is the configuration of the parent product of the cluster. This field is used by Google internal products that are built on top of a GKE cluster and take the ownership of the cluster.
     */
    export interface Schema$ParentProductConfig {
        /**
         * Labels contain the configuration of the parent product.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Name of the parent product associated with the cluster.
         */
        productName?: string | null;
    }
    /**
     * PlacementPolicy defines the placement policy used by the node pool.
     */
    export interface Schema$PlacementPolicy {
        /**
         * If set, refers to the name of a custom resource policy supplied by the user. The resource policy must be in the same project and region as the node pool. If not found, InvalidArgument error is returned.
         */
        policyName?: string | null;
        /**
         * TPU placement topology for pod slice node pool. https://cloud.google.com/tpu/docs/types-topologies#tpu_topologies
         */
        tpuTopology?: string | null;
        /**
         * The type of placement.
         */
        type?: string | null;
    }
    /**
     * PodAutoscaling is used for configuration of parameters for workload autoscaling.
     */
    export interface Schema$PodAutoscaling {
        /**
         * Selected Horizontal Pod Autoscaling profile.
         */
        hpaProfile?: string | null;
    }
    /**
     * [PRIVATE FIELD] Config for pod CIDR size overprovisioning.
     */
    export interface Schema$PodCIDROverprovisionConfig {
        /**
         * Whether Pod CIDR overprovisioning is disabled. Note: Pod CIDR overprovisioning is enabled by default.
         */
        disable?: boolean | null;
    }
    /**
     * Configuration for the PodSecurityPolicy feature.
     */
    export interface Schema$PodSecurityPolicyConfig {
        /**
         * Enable the PodSecurityPolicy controller for this cluster. If enabled, pods must be valid under a PodSecurityPolicy to be created.
         */
        enabled?: boolean | null;
    }
    /**
     * Binauthz policy that applies to this cluster.
     */
    export interface Schema$PolicyBinding {
        /**
         * The relative resource name of the binauthz platform policy to evaluate. GKE platform policies have the following format: `projects/{project_number\}/platforms/gke/policies/{policy_id\}`.
         */
        name?: string | null;
    }
    /**
     * Configuration options for private clusters.
     */
    export interface Schema$PrivateClusterConfig {
        /**
         * Whether the master's internal IP address is used as the cluster endpoint. Use ControlPlaneEndpointsConfig.IPEndpointsConfig.enable_public_endpoint instead. Note that the value of enable_public_endpoint is reversed: if enable_private_endpoint is false, then enable_public_endpoint will be true.
         */
        enablePrivateEndpoint?: boolean | null;
        /**
         * Whether nodes have internal IP addresses only. If enabled, all nodes are given only RFC 1918 private addresses and communicate with the master via private networking. Deprecated: Use NetworkConfig.default_enable_private_nodes instead.
         */
        enablePrivateNodes?: boolean | null;
        /**
         * Controls master global access settings. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.enable_global_access instead.
         */
        masterGlobalAccessConfig?: Schema$PrivateClusterMasterGlobalAccessConfig;
        /**
         * The IP range in CIDR notation to use for the hosted master network. This range will be used for assigning internal IP addresses to the master or set of masters, as well as the ILB VIP. This range must not overlap with any other ranges in use within the cluster's network.
         */
        masterIpv4CidrBlock?: string | null;
        /**
         * Output only. The peering name in the customer VPC used by this cluster.
         */
        peeringName?: string | null;
        /**
         * Output only. The internal IP address of this cluster's master endpoint. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint instead.
         */
        privateEndpoint?: string | null;
        /**
         * Subnet to provision the master's private endpoint during cluster creation. Specified in projects/x/regions/x/subnetworks/x format. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint_subnetwork instead.
         */
        privateEndpointSubnetwork?: string | null;
        /**
         * Output only. The external IP address of this cluster's master endpoint. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.public_endpoint instead.
         */
        publicEndpoint?: string | null;
    }
    /**
     * Configuration for controlling master global access settings.
     */
    export interface Schema$PrivateClusterMasterGlobalAccessConfig {
        /**
         * Whenever master is accessible globally or not.
         */
        enabled?: boolean | null;
    }
    /**
     * PrivateRegistryAccessConfig contains access configuration for private container registries.
     */
    export interface Schema$PrivateRegistryAccessConfig {
        /**
         * Private registry access configuration.
         */
        certificateAuthorityDomainConfig?: Schema$CertificateAuthorityDomainConfig[];
        /**
         * Private registry access is enabled.
         */
        enabled?: boolean | null;
    }
    /**
     * ProtectConfig defines the flags needed to enable/disable features for the Protect API.
     */
    export interface Schema$ProtectConfig {
        /**
         * WorkloadConfig defines which actions are enabled for a cluster's workload configurations.
         */
        workloadConfig?: Schema$WorkloadConfig;
        /**
         * Sets which mode to use for Protect workload vulnerability scanning feature.
         */
        workloadVulnerabilityMode?: string | null;
    }
    /**
     * Pub/Sub specific notification config.
     */
    export interface Schema$PubSub {
        /**
         * Enable notifications for Pub/Sub.
         */
        enabled?: boolean | null;
        /**
         * Allows filtering to one or more specific event types. If no filter is specified, or if a filter is specified with no event types, all event types will be sent
         */
        filter?: Schema$Filter;
        /**
         * The desired Pub/Sub topic to which notifications will be sent by GKE. Format is `projects/{project\}/topics/{topic\}`.
         */
        topic?: string | null;
    }
    /**
     * QueuedProvisioning defines the queued provisioning used by the node pool.
     */
    export interface Schema$QueuedProvisioning {
        /**
         * Denotes that this nodepool is QRM specific, meaning nodes can be only obtained through queuing via the Cluster Autoscaler ProvisioningRequest API.
         */
        enabled?: boolean | null;
    }
    /**
     * RangeInfo contains the range name and the range utilization by this cluster.
     */
    export interface Schema$RangeInfo {
        /**
         * Output only. Name of a range.
         */
        rangeName?: string | null;
        /**
         * Output only. The utilization of the range.
         */
        utilization?: number | null;
    }
    /**
     * RayClusterLoggingConfig specifies logging configuration for Ray clusters.
     */
    export interface Schema$RayClusterLoggingConfig {
        /**
         * Enable log collection for Ray clusters.
         */
        enabled?: boolean | null;
    }
    /**
     * RayClusterMonitoringConfig specifies monitoring configuration for Ray clusters.
     */
    export interface Schema$RayClusterMonitoringConfig {
        /**
         * Enable metrics collection for Ray clusters.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration options for the Ray Operator add-on.
     */
    export interface Schema$RayOperatorConfig {
        /**
         * Whether the Ray addon is enabled for this cluster.
         */
        enabled?: boolean | null;
        /**
         * Optional. Logging configuration for Ray clusters.
         */
        rayClusterLoggingConfig?: Schema$RayClusterLoggingConfig;
        /**
         * Optional. Monitoring configuration for Ray clusters.
         */
        rayClusterMonitoringConfig?: Schema$RayClusterMonitoringConfig;
    }
    /**
     * RBACBindingConfig allows user to restrict ClusterRoleBindings an RoleBindings that can be created.
     */
    export interface Schema$RBACBindingConfig {
        /**
         * Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjects system:authenticated.
         */
        enableInsecureBindingSystemAuthenticated?: boolean | null;
        /**
         * Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjets system:anonymous or system:unauthenticated.
         */
        enableInsecureBindingSystemUnauthenticated?: boolean | null;
    }
    /**
     * Represents an arbitrary window of time that recurs.
     */
    export interface Schema$RecurringTimeWindow {
        /**
         * An RRULE (https://tools.ietf.org/html/rfc5545#section-3.8.5.3) for how this window reccurs. They go on for the span of time between the start and end time. For example, to have something repeat every weekday, you'd use: `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR` To repeat some window daily (equivalent to the DailyMaintenanceWindow): `FREQ=DAILY` For the first weekend of every month: `FREQ=MONTHLY;BYSETPOS=1;BYDAY=SA,SU` This specifies how frequently the window starts. Eg, if you wanted to have a 9-5 UTC-4 window every weekday, you'd use something like: ``` start time = 2019-01-01T09:00:00-0400 end time = 2019-01-01T17:00:00-0400 recurrence = FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR ``` Windows can span multiple days. Eg, to make the window encompass every weekend from midnight Saturday till the last minute of Sunday UTC: ``` start time = 2019-01-05T00:00:00Z end time = 2019-01-07T23:59:00Z recurrence = FREQ=WEEKLY;BYDAY=SA ``` Note the start and end time's specific dates are largely arbitrary except to specify duration of the window and when it first starts. The FREQ values of HOURLY, MINUTELY, and SECONDLY are not supported.
         */
        recurrence?: string | null;
        /**
         * The window of the first recurrence.
         */
        window?: Schema$TimeWindow;
    }
    /**
     * ReleaseChannel indicates which release channel a cluster is subscribed to. Release channels are arranged in order of risk. When a cluster is subscribed to a release channel, Google maintains both the master version and the node version. Node auto-upgrade defaults to true and cannot be disabled.
     */
    export interface Schema$ReleaseChannel {
        /**
         * channel specifies which release channel the cluster is subscribed to.
         */
        channel?: string | null;
    }
    /**
     * ReleaseChannelConfig exposes configuration for a release channel.
     */
    export interface Schema$ReleaseChannelConfig {
        /**
         * Deprecated. This field has been deprecated and replaced with the valid_versions field.
         */
        availableVersions?: Schema$AvailableVersion[];
        /**
         * The release channel this configuration applies to.
         */
        channel?: string | null;
        /**
         * The default version for newly created clusters on the channel.
         */
        defaultVersion?: string | null;
        /**
         * The auto upgrade target version for clusters on the channel.
         */
        upgradeTargetVersion?: string | null;
        /**
         * List of valid versions for the channel.
         */
        validVersions?: string[] | null;
    }
    /**
     * [ReservationAffinity](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) is the configuration of desired reservation which instances could take capacity from.
     */
    export interface Schema$ReservationAffinity {
        /**
         * Corresponds to the type of reservation consumption.
         */
        consumeReservationType?: string | null;
        /**
         * Corresponds to the label key of a reservation resource. To target a SPECIFIC_RESERVATION by name, specify "compute.googleapis.com/reservation-name" as the key and specify the name of your reservation as its value.
         */
        key?: string | null;
        /**
         * Corresponds to the label value(s) of reservation resource(s).
         */
        values?: string[] | null;
    }
    /**
     * Collection of [GCP labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels).
     */
    export interface Schema$ResourceLabels {
        /**
         * Map of node label keys and node label values.
         */
        labels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Contains information about amount of some resource in the cluster. For memory, value should be in GB.
     */
    export interface Schema$ResourceLimit {
        /**
         * Maximum amount of the resource in the cluster.
         */
        maximum?: string | null;
        /**
         * Minimum amount of the resource in the cluster.
         */
        minimum?: string | null;
        /**
         * Resource name "cpu", "memory" or gpu-specific string.
         */
        resourceType?: string | null;
    }
    /**
     * A map of resource manager tag keys and values to be attached to the nodes for managing Compute Engine firewalls using Network Firewall Policies. Tags must be according to specifications in https://cloud.google.com/vpc/docs/tags-firewalls-overview#specifications. A maximum of 5 tag key-value pairs can be specified. Existing tags will be replaced with new values.
     */
    export interface Schema$ResourceManagerTags {
        /**
         * Tags must be in one of the following formats ([KEY]=[VALUE]) 1. `tagKeys/{tag_key_id\}=tagValues/{tag_value_id\}` 2. `{org_id\}/{tag_key_name\}={tag_value_name\}` 3. `{project_id\}/{tag_key_name\}={tag_value_name\}`
         */
        tags?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Configuration for exporting cluster resource usages.
     */
    export interface Schema$ResourceUsageExportConfig {
        /**
         * Configuration to use BigQuery as usage export destination.
         */
        bigqueryDestination?: Schema$BigQueryDestination;
        /**
         * Configuration to enable resource consumption metering.
         */
        consumptionMeteringConfig?: Schema$ConsumptionMeteringConfig;
        /**
         * Whether to enable network egress metering for this cluster. If enabled, a daemonset will be created in the cluster to meter network egress traffic.
         */
        enableNetworkEgressMetering?: boolean | null;
    }
    /**
     * RollbackNodePoolUpgradeRequest rollbacks the previously Aborted or Failed NodePool upgrade. This will be an no-op if the last upgrade successfully completed.
     */
    export interface Schema$RollbackNodePoolUpgradeRequest {
        /**
         * Required. Deprecated. The name of the cluster to rollback. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster, node pool id) of the node poll to rollback upgrade. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The name of the node pool to rollback. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Option for rollback to ignore the PodDisruptionBudget. Default value is false.
         */
        respectPdb?: boolean | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * RotationConfig is config for secret manager auto rotation.
     */
    export interface Schema$RotationConfig {
        /**
         * Whether the rotation is enabled.
         */
        enabled?: boolean | null;
        /**
         * The interval between two consecutive rotations. Default rotation interval is 2 minutes.
         */
        rotationInterval?: string | null;
    }
    /**
     * SandboxConfig contains configurations of the sandbox to use for the node.
     */
    export interface Schema$SandboxConfig {
        /**
         * Type of the sandbox to use for the node (e.g. 'gvisor')
         */
        sandboxType?: string | null;
        /**
         * Type of the sandbox to use for the node.
         */
        type?: string | null;
    }
    /**
     * SecondaryBootDisk represents a persistent disk attached to a node with special configurations based on its mode.
     */
    export interface Schema$SecondaryBootDisk {
        /**
         * Fully-qualified resource ID for an existing disk image.
         */
        diskImage?: string | null;
        /**
         * Disk mode (container image cache, etc.)
         */
        mode?: string | null;
    }
    /**
     * SecondaryBootDiskUpdateStrategy is a placeholder which will be extended in the future to define different options for updating secondary boot disks.
     */
    export interface Schema$SecondaryBootDiskUpdateStrategy {
    }
    /**
     * SecretManagerConfig is config for secret manager enablement.
     */
    export interface Schema$SecretManagerConfig {
        /**
         * Enable/Disable Secret Manager Config.
         */
        enabled?: boolean | null;
        /**
         * Rotation config for secret manager.
         */
        rotationConfig?: Schema$RotationConfig;
    }
    /**
     * SecurityBulletinEvent is a notification sent to customers when a security bulletin has been posted that they are vulnerable to.
     */
    export interface Schema$SecurityBulletinEvent {
        /**
         * The GKE minor versions affected by this vulnerability.
         */
        affectedSupportedMinors?: string[] | null;
        /**
         * A brief description of the bulletin. See the bulletin pointed to by the bulletin_uri field for an expanded description.
         */
        briefDescription?: string | null;
        /**
         * The ID of the bulletin corresponding to the vulnerability.
         */
        bulletinId?: string | null;
        /**
         * The URI link to the bulletin on the website for more information.
         */
        bulletinUri?: string | null;
        /**
         * The CVEs associated with this bulletin.
         */
        cveIds?: string[] | null;
        /**
         * If this field is specified, it means there are manual steps that the user must take to make their clusters safe.
         */
        manualStepsRequired?: boolean | null;
        /**
         * The GKE versions where this vulnerability is mitigated.
         */
        mitigatedVersions?: string[] | null;
        /**
         * The GKE versions where this vulnerability is patched.
         */
        patchedVersions?: string[] | null;
        /**
         * The resource type (node/control plane) that has the vulnerability. Multiple notifications (1 notification per resource type) will be sent for a vulnerability that affects \> 1 resource type.
         */
        resourceTypeAffected?: string | null;
        /**
         * The severity of this bulletin as it relates to GKE.
         */
        severity?: string | null;
        /**
         * This represents a version selected from the patched_versions field that the cluster receiving this notification should most likely want to upgrade to based on its current version. Note that if this notification is being received by a given cluster, it means that this version is currently available as an upgrade target in that cluster's location.
         */
        suggestedUpgradeTarget?: string | null;
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
     * Kubernetes Engine service configuration.
     */
    export interface Schema$ServerConfig {
        /**
         * List of release channel configurations.
         */
        channels?: Schema$ReleaseChannelConfig[];
        /**
         * Version of Kubernetes the service deploys by default.
         */
        defaultClusterVersion?: string | null;
        /**
         * Default image type.
         */
        defaultImageType?: string | null;
        /**
         * List of valid image types.
         */
        validImageTypes?: string[] | null;
        /**
         * List of valid master versions, in descending order.
         */
        validMasterVersions?: string[] | null;
        /**
         * List of valid node upgrade target versions, in descending order.
         */
        validNodeVersions?: string[] | null;
        /**
         * Maps of Kubernetes version and supported Windows server versions.
         */
        windowsVersionMaps?: {
            [key: string]: Schema$WindowsVersions;
        } | null;
    }
    /**
     * Config to block services with externalIPs field.
     */
    export interface Schema$ServiceExternalIPsConfig {
        /**
         * Whether Services with ExternalIPs field are allowed or not.
         */
        enabled?: boolean | null;
    }
    /**
     * SetAddonsRequest sets the addons associated with the cluster.
     */
    export interface Schema$SetAddonsConfigRequest {
        /**
         * Required. The desired configurations for the various addons available to run in the cluster.
         */
        addonsConfig?: Schema$AddonsConfig;
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to set addons. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetLabelsRequest sets the Google Cloud Platform labels on a Google Container Engine cluster, which will in turn set them for Google Compute Engine resources used by that cluster
     */
    export interface Schema$SetLabelsRequest {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. The fingerprint of the previous set of labels for this resource, used to detect conflicts. The fingerprint is initially generated by Kubernetes Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash when updating or changing labels. Make a `get()` request to the resource to get the latest fingerprint.
         */
        labelFingerprint?: string | null;
        /**
         * The name (project, location, cluster name) of the cluster to set labels. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. The labels to set for that cluster.
         */
        resourceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetLegacyAbacRequest enables or disables the ABAC authorization mechanism for a cluster.
     */
    export interface Schema$SetLegacyAbacRequest {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. Whether ABAC authorization will be enabled in the cluster.
         */
        enabled?: boolean | null;
        /**
         * The name (project, location, cluster name) of the cluster to set legacy abac. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetLocationsRequest sets the locations of the cluster.
     */
    export interface Schema$SetLocationsRequest {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. The desired list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located. Changing the locations a cluster is in will result in nodes being either created or removed from the cluster, depending on whether locations are being added or removed. This list must always include the cluster's primary zone.
         */
        locations?: string[] | null;
        /**
         * The name (project, location, cluster) of the cluster to set locations. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetLoggingServiceRequest sets the logging service of a cluster.
     */
    export interface Schema$SetLoggingServiceRequest {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. The logging service the cluster should use to write logs. Currently available options: * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer available as of GKE 1.15). * `none` - no logs will be exported from the cluster. If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.
         */
        loggingService?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to set logging. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetMaintenancePolicyRequest sets the maintenance policy for a cluster.
     */
    export interface Schema$SetMaintenancePolicyRequest {
        /**
         * Required. The name of the cluster to update.
         */
        clusterId?: string | null;
        /**
         * Required. The maintenance policy to be set for the cluster. An empty field clears the existing maintenance policy.
         */
        maintenancePolicy?: Schema$MaintenancePolicy;
        /**
         * The name (project, location, cluster name) of the cluster to set maintenance policy. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects).
         */
        projectId?: string | null;
        /**
         * Required. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides.
         */
        zone?: string | null;
    }
    /**
     * SetMasterAuthRequest updates the admin password of a cluster.
     */
    export interface Schema$SetMasterAuthRequest {
        /**
         * Required. The exact form of action to be taken on the master auth.
         */
        action?: string | null;
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to set auth. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. A description of the update.
         */
        update?: Schema$MasterAuth;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetMonitoringServiceRequest sets the monitoring service of a cluster.
     */
    export interface Schema$SetMonitoringServiceRequest {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. The monitoring service the cluster should use to write metrics. Currently available options: * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster. If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.
         */
        monitoringService?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to set monitoring. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetNetworkPolicyRequest enables/disables network policy for a cluster.
     */
    export interface Schema$SetNetworkPolicyRequest {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster name) of the cluster to set networking policy. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Configuration options for the NetworkPolicy feature.
         */
        networkPolicy?: Schema$NetworkPolicy;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetNodePoolAutoscalingRequest sets the autoscaler settings of a node pool.
     */
    export interface Schema$SetNodePoolAutoscalingRequest {
        /**
         * Required. Autoscaling configuration for the node pool.
         */
        autoscaling?: Schema$NodePoolAutoscaling;
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster, node pool) of the node pool to set autoscaler settings. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The name of the node pool to upgrade. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetNodePoolManagementRequest sets the node management properties of a node pool.
     */
    export interface Schema$SetNodePoolManagementRequest {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. NodeManagement configuration for the node pool.
         */
        management?: Schema$NodeManagement;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to set management properties. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The name of the node pool to update. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetNodePoolSizeRequest sets the size of a node pool.
     */
    export interface Schema$SetNodePoolSizeRequest {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to set size. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string | null;
        /**
         * Required. The desired node count for the pool.
         */
        nodeCount?: number | null;
        /**
         * Required. Deprecated. The name of the node pool to update. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * A set of Shielded Instance options.
     */
    export interface Schema$ShieldedInstanceConfig {
        /**
         * Defines whether the instance has integrity monitoring enabled. Enables monitoring and attestation of the boot integrity of the instance. The attestation is performed against the integrity policy baseline. This baseline is initially derived from the implicitly trusted boot image when the instance is created.
         */
        enableIntegrityMonitoring?: boolean | null;
        /**
         * Defines whether the instance has Secure Boot enabled. Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.
         */
        enableSecureBoot?: boolean | null;
    }
    /**
     * Configuration of Shielded Nodes feature.
     */
    export interface Schema$ShieldedNodes {
        /**
         * Whether Shielded Nodes features are enabled on all nodes in this cluster.
         */
        enabled?: boolean | null;
    }
    /**
     * SoleTenantConfig contains the NodeAffinities to specify what shared sole tenant node groups should back the node pool.
     */
    export interface Schema$SoleTenantConfig {
        /**
         * NodeAffinities used to match to a shared sole tenant node group.
         */
        nodeAffinities?: Schema$NodeAffinity[];
    }
    /**
     * Standard rollout policy is the default policy for blue-green.
     */
    export interface Schema$StandardRolloutPolicy {
        /**
         * Number of blue nodes to drain in a batch.
         */
        batchNodeCount?: number | null;
        /**
         * Percentage of the blue pool nodes to drain in a batch. The range of this field should be (0.0, 1.0].
         */
        batchPercentage?: number | null;
        /**
         * Soak time after each batch gets drained. Default to zero.
         */
        batchSoakDuration?: string | null;
    }
    /**
     * StartIPRotationRequest creates a new IP for the cluster and then performs a node upgrade on each node pool to point to the new IP.
     */
    export interface Schema$StartIPRotationRequest {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster name) of the cluster to start IP rotation. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Whether to rotate credentials during IP rotation.
         */
        rotateCredentials?: boolean | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * Configuration for the Stateful HA add-on.
     */
    export interface Schema$StatefulHAConfig {
        /**
         * Whether the Stateful HA add-on is enabled for this cluster.
         */
        enabled?: boolean | null;
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
     * StatusCondition describes why a cluster or a node pool has a certain status (e.g., ERROR or DEGRADED).
     */
    export interface Schema$StatusCondition {
        /**
         * Canonical code of the condition.
         */
        canonicalCode?: string | null;
        /**
         * Machine-friendly representation of the condition Deprecated. Use canonical_code instead.
         */
        code?: string | null;
        /**
         * Human-friendly representation of the condition
         */
        message?: string | null;
    }
    /**
     * Represents an arbitrary window of time.
     */
    export interface Schema$TimeWindow {
        /**
         * The time that the window ends. The end time should take place after the start time.
         */
        endTime?: string | null;
        /**
         * MaintenanceExclusionOptions provides maintenance exclusion related options.
         */
        maintenanceExclusionOptions?: Schema$MaintenanceExclusionOptions;
        /**
         * The time that the window first starts.
         */
        startTime?: string | null;
    }
    /**
     * TopologyManager defines the configuration options for Topology Manager feature. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/
     */
    export interface Schema$TopologyManager {
        /**
         * Configures the strategy for resource alignment. Allowed values are: * none: the default policy, and does not perform any topology alignment. * restricted: the topology manager stores the preferred NUMA node affinity for the container, and will reject the pod if the affinity if not preferred. * best-effort: the topology manager stores the preferred NUMA node affinity for the container. If the affinity is not preferred, the topology manager will admit the pod to the node anyway. * single-numa-node: the topology manager determines if the single NUMA node affinity is possible. If it is, Topology Manager will store this and the Hint Providers can then use this information when making the resource allocation decision. If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a Terminated state with a pod admission failure. The default policy value is 'none' if unspecified. Details about each strategy can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies).
         */
        policy?: string | null;
        /**
         * The Topology Manager aligns resources in following scopes: * container * pod The default scope is 'container' if unspecified. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes
         */
        scope?: string | null;
    }
    /**
     * Configuration for Cloud TPU. This message is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.
     */
    export interface Schema$TpuConfig {
        /**
         * Whether Cloud TPU integration is enabled or not.
         */
        enabled?: boolean | null;
        /**
         * IPv4 CIDR block reserved for Cloud TPU in the VPC.
         */
        ipv4CidrBlock?: string | null;
        /**
         * Whether to use service networking for Cloud TPU or not.
         */
        useServiceNetworking?: boolean | null;
    }
    /**
     * UpdateClusterRequest updates the settings of a cluster.
     */
    export interface Schema$UpdateClusterRequest {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to update. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. A description of the update.
         */
        update?: Schema$ClusterUpdate;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * UpdateInfo contains resource (instance groups, etc), status and other intermediate information relevant to a node pool upgrade.
     */
    export interface Schema$UpdateInfo {
        /**
         * Information of a blue-green upgrade.
         */
        blueGreenInfo?: Schema$BlueGreenInfo;
    }
    /**
     * UpdateMasterRequest updates the master of the cluster.
     */
    export interface Schema$UpdateMasterRequest {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Required. The Kubernetes version to change the master to. Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the default Kubernetes version
         */
        masterVersion?: string | null;
        /**
         * The name (project, location, cluster) of the cluster to update. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * SetNodePoolVersionRequest updates the version of a node pool.
     */
    export interface Schema$UpdateNodePoolRequest {
        /**
         * A list of hardware accelerators to be attached to each node. See https://cloud.google.com/compute/docs/gpus for more information about support for GPUs.
         */
        accelerators?: Schema$AcceleratorConfig[];
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string | null;
        /**
         * Confidential nodes config. All the nodes in the node pool will be Confidential VM once enabled.
         */
        confidentialNodes?: Schema$ConfidentialNodes;
        /**
         * The desired containerd config for nodes in the node pool. Initiates an upgrade operation that recreates the nodes with the new config.
         */
        containerdConfig?: Schema$ContainerdConfig;
        /**
         * Optional. The desired disk size for nodes in the node pool. Initiates an upgrade operation that migrates the nodes in the node pool to the specified disk size.
         */
        diskSizeGb?: string | null;
        /**
         * Optional. The desired disk type for nodes in the node pool. Initiates an upgrade operation that migrates the nodes in the node pool to the specified disk type.
         */
        diskType?: string | null;
        /**
         * The current etag of the node pool. If an etag is provided and does not match the current etag of the node pool, update will be blocked and an ABORTED error will be returned.
         */
        etag?: string | null;
        /**
         * Enable or disable NCCL fast socket for the node pool.
         */
        fastSocket?: Schema$FastSocket;
        /**
         * Flex Start flag for enabling Flex Start VM.
         */
        flexStart?: boolean | null;
        /**
         * GCFS config.
         */
        gcfsConfig?: Schema$GcfsConfig;
        /**
         * Enable or disable gvnic on the node pool.
         */
        gvnic?: Schema$VirtualNIC;
        /**
         * Required. The desired image type for the node pool. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.
         */
        imageType?: string | null;
        /**
         * Node kubelet configs.
         */
        kubeletConfig?: Schema$NodeKubeletConfig;
        /**
         * The desired node labels to be applied to all nodes in the node pool. If this field is not present, the labels will not be changed. Otherwise, the existing node labels will be *replaced* with the provided labels.
         */
        labels?: Schema$NodeLabels;
        /**
         * Parameters that can be configured on Linux nodes.
         */
        linuxNodeConfig?: Schema$LinuxNodeConfig;
        /**
         * The desired list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the node pool's nodes should be located. Changing the locations for a node pool will result in nodes being either created or removed from the node pool, depending on whether locations are being added or removed.
         */
        locations?: string[] | null;
        /**
         * Logging configuration.
         */
        loggingConfig?: Schema$NodePoolLoggingConfig;
        /**
         * Optional. The desired machine type for nodes in the node pool. Initiates an upgrade operation that migrates the nodes in the node pool to the specified machine type.
         */
        machineType?: string | null;
        /**
         * The maximum duration for the nodes to exist. If unspecified, the nodes can exist indefinitely.
         */
        maxRunDuration?: string | null;
        /**
         * The name (project, location, cluster, node pool) of the node pool to update. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string | null;
        /**
         * Node network config.
         */
        nodeNetworkConfig?: Schema$NodeNetworkConfig;
        /**
         * Required. Deprecated. The name of the node pool to upgrade. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string | null;
        /**
         * Required. The Kubernetes version to change the nodes to (typically an upgrade). Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the Kubernetes master version
         */
        nodeVersion?: string | null;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string | null;
        /**
         * Specifies the configuration of queued provisioning.
         */
        queuedProvisioning?: Schema$QueuedProvisioning;
        /**
         * The resource labels for the node pool to use to annotate any related Google Compute Engine resources.
         */
        resourceLabels?: Schema$ResourceLabels;
        /**
         * Desired resource manager tag keys and values to be attached to the nodes for managing Compute Engine firewalls using Network Firewall Policies. Existing tags will be replaced with new values.
         */
        resourceManagerTags?: Schema$ResourceManagerTags;
        /**
         * List of Storage Pools where boot disks are provisioned. Existing Storage Pools will be replaced with storage-pools.
         */
        storagePools?: string[] | null;
        /**
         * The desired network tags to be applied to all nodes in the node pool. If this field is not present, the tags will not be changed. Otherwise, the existing network tags will be *replaced* with the provided tags.
         */
        tags?: Schema$NetworkTags;
        /**
         * The desired node taints to be applied to all nodes in the node pool. If this field is not present, the taints will not be changed. Otherwise, the existing node taints will be *replaced* with the provided taints.
         */
        taints?: Schema$NodeTaints;
        /**
         * Upgrade settings control disruption and speed of the upgrade.
         */
        upgradeSettings?: Schema$UpgradeSettings;
        /**
         * Parameters that can be configured on Windows nodes.
         */
        windowsNodeConfig?: Schema$WindowsNodeConfig;
        /**
         * The desired workload metadata config for the node pool.
         */
        workloadMetadataConfig?: Schema$WorkloadMetadataConfig;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string | null;
    }
    /**
     * UpgradeAvailableEvent is a notification sent to customers when a new available version is released.
     */
    export interface Schema$UpgradeAvailableEvent {
        /**
         * The release channel of the version. If empty, it means a non-channel release.
         */
        releaseChannel?: Schema$ReleaseChannel;
        /**
         * Optional relative path to the resource. For example, the relative path of the node pool.
         */
        resource?: string | null;
        /**
         * The resource type of the release version.
         */
        resourceType?: string | null;
        /**
         * The release version available for upgrade.
         */
        version?: string | null;
        /**
         * Windows node versions info.
         */
        windowsVersions?: Schema$WindowsVersions;
    }
    /**
     * UpgradeDetails contains detailed information of each individual upgrade operation.
     */
    export interface Schema$UpgradeDetails {
        /**
         * The end timestamp of the upgrade.
         */
        endTime?: string | null;
        /**
         * The version before the upgrade.
         */
        initialVersion?: string | null;
        /**
         * The start timestamp of the upgrade.
         */
        startTime?: string | null;
        /**
         * The start type of the upgrade.
         */
        startType?: string | null;
        /**
         * Output only. The state of the upgrade.
         */
        state?: string | null;
        /**
         * The version after the upgrade.
         */
        targetVersion?: string | null;
    }
    /**
     * UpgradeEvent is a notification sent to customers by the cluster server when a resource is upgrading.
     */
    export interface Schema$UpgradeEvent {
        /**
         * The current version before the upgrade.
         */
        currentVersion?: string | null;
        /**
         * The operation associated with this upgrade.
         */
        operation?: string | null;
        /**
         * The time when the operation was started.
         */
        operationStartTime?: string | null;
        /**
         * Optional relative path to the resource. For example in node pool upgrades, the relative path of the node pool.
         */
        resource?: string | null;
        /**
         * The resource type that is upgrading.
         */
        resourceType?: string | null;
        /**
         * The target version for the upgrade.
         */
        targetVersion?: string | null;
    }
    /**
     * UpgradeInfoEvent is a notification sent to customers about the upgrade information of a resource.
     */
    export interface Schema$UpgradeInfoEvent {
        /**
         * The current version before the upgrade.
         */
        currentVersion?: string | null;
        /**
         * A brief description of the event.
         */
        description?: string | null;
        /**
         * The time when the operation ended.
         */
        endTime?: string | null;
        /**
         * The type of the event.
         */
        eventType?: string | null;
        /**
         * The end of extended support timestamp.
         */
        extendedSupportEndTime?: string | null;
        /**
         * The operation associated with this upgrade.
         */
        operation?: string | null;
        /**
         * Optional relative path to the resource. For example in node pool upgrades, the relative path of the node pool.
         */
        resource?: string | null;
        /**
         * The resource type associated with the upgrade.
         */
        resourceType?: string | null;
        /**
         * The end of standard support timestamp.
         */
        standardSupportEndTime?: string | null;
        /**
         * The time when the operation was started.
         */
        startTime?: string | null;
        /**
         * Output only. The state of the upgrade.
         */
        state?: string | null;
        /**
         * The target version for the upgrade.
         */
        targetVersion?: string | null;
    }
    /**
     * These upgrade settings control the level of parallelism and the level of disruption caused by an upgrade. maxUnavailable controls the number of nodes that can be simultaneously unavailable. maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes. (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time). Note: upgrades inevitably introduce some disruption since workloads need to be moved from old nodes to new, upgraded ones. Even if maxUnavailable=0, this holds true. (Disruption stays within the limits of PodDisruptionBudget, if it is configured.) Consider a hypothetical node pool with 5 nodes having maxSurge=2, maxUnavailable=1. This means the upgrade process upgrades 3 nodes simultaneously. It creates 2 additional (upgraded) nodes, then it brings down 3 old (not yet upgraded) nodes at the same time. This ensures that there are always at least 4 nodes available. These upgrade settings configure the upgrade strategy for the node pool. Use strategy to switch between the strategies applied to the node pool. If the strategy is SURGE, use max_surge and max_unavailable to control the level of parallelism and the level of disruption caused by upgrade. 1. maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes. 2. maxUnavailable controls the number of nodes that can be simultaneously unavailable. 3. (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time). If the strategy is BLUE_GREEN, use blue_green_settings to configure the blue-green upgrade related settings. 1. standard_rollout_policy is the default policy. The policy is used to control the way blue pool gets drained. The draining is executed in the batch mode. The batch size could be specified as either percentage of the node pool size or the number of nodes. batch_soak_duration is the soak time after each batch gets drained. 2. node_pool_soak_duration is the soak time after all blue nodes are drained. After this period, the blue pool nodes will be deleted.
     */
    export interface Schema$UpgradeSettings {
        /**
         * Settings for blue-green upgrade strategy.
         */
        blueGreenSettings?: Schema$BlueGreenSettings;
        /**
         * The maximum number of nodes that can be created beyond the current size of the node pool during the upgrade process.
         */
        maxSurge?: number | null;
        /**
         * The maximum number of nodes that can be simultaneously unavailable during the upgrade process. A node is considered available if its status is Ready.
         */
        maxUnavailable?: number | null;
        /**
         * Update strategy of the node pool.
         */
        strategy?: string | null;
    }
    /**
     * UsableSubnetwork resource returns the subnetwork name, its associated network and the primary CIDR range.
     */
    export interface Schema$UsableSubnetwork {
        /**
         * The range of internal addresses that are owned by this subnetwork.
         */
        ipCidrRange?: string | null;
        /**
         * Network Name. Example: projects/my-project/global/networks/my-network
         */
        network?: string | null;
        /**
         * Secondary IP ranges.
         */
        secondaryIpRanges?: Schema$UsableSubnetworkSecondaryRange[];
        /**
         * A human readable status message representing the reasons for cases where the caller cannot use the secondary ranges under the subnet. For example if the secondary_ip_ranges is empty due to a permission issue, an insufficient permission message will be given by status_message.
         */
        statusMessage?: string | null;
        /**
         * Subnetwork Name. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet
         */
        subnetwork?: string | null;
    }
    /**
     * Secondary IP range of a usable subnetwork.
     */
    export interface Schema$UsableSubnetworkSecondaryRange {
        /**
         * The range of IP addresses belonging to this subnetwork secondary range.
         */
        ipCidrRange?: string | null;
        /**
         * The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance.
         */
        rangeName?: string | null;
        /**
         * This field is to determine the status of the secondary range programmably.
         */
        status?: string | null;
    }
    /**
     * UserManagedKeysConfig holds the resource address to Keys which are used for signing certs and token that are used for communication within cluster.
     */
    export interface Schema$UserManagedKeysConfig {
        /**
         * The Certificate Authority Service caPool to use for the aggregation CA in this cluster.
         */
        aggregationCa?: string | null;
        /**
         * The Certificate Authority Service caPool to use for the cluster CA in this cluster.
         */
        clusterCa?: string | null;
        /**
         * The Cloud KMS cryptoKey to use for Confidential Hyperdisk on the control plane nodes.
         */
        controlPlaneDiskEncryptionKey?: string | null;
        /**
         * Resource path of the Certificate Authority Service caPool to use for the etcd API CA in this cluster.
         */
        etcdApiCa?: string | null;
        /**
         * Resource path of the Certificate Authority Service caPool to use for the etcd peer CA in this cluster.
         */
        etcdPeerCa?: string | null;
        /**
         * Resource path of the Cloud KMS cryptoKey to use for encryption of internal etcd backups.
         */
        gkeopsEtcdBackupEncryptionKey?: string | null;
        /**
         * The Cloud KMS cryptoKeyVersions to use for signing service account JWTs issued by this cluster. Format: `projects/{project\}/locations/{location\}/keyRings/{keyring\}/cryptoKeys/{cryptoKey\}/cryptoKeyVersions/{cryptoKeyVersion\}`
         */
        serviceAccountSigningKeys?: string[] | null;
        /**
         * The Cloud KMS cryptoKeyVersions to use for verifying service account JWTs issued by this cluster. Format: `projects/{project\}/locations/{location\}/keyRings/{keyring\}/cryptoKeys/{cryptoKey\}/cryptoKeyVersions/{cryptoKeyVersion\}`
         */
        serviceAccountVerificationKeys?: string[] | null;
    }
    /**
     * VerticalPodAutoscaling contains global, per-cluster information required by Vertical Pod Autoscaler to automatically adjust the resources of pods controlled by it.
     */
    export interface Schema$VerticalPodAutoscaling {
        /**
         * Enables vertical pod autoscaling.
         */
        enabled?: boolean | null;
    }
    /**
     * Configuration of gVNIC feature.
     */
    export interface Schema$VirtualNIC {
        /**
         * Whether gVNIC features are enabled in the node pool.
         */
        enabled?: boolean | null;
    }
    /**
     * Parameters that can be configured on Windows nodes. Windows Node Config that define the parameters that will be used to configure the Windows node pool settings.
     */
    export interface Schema$WindowsNodeConfig {
        /**
         * OSVersion specifies the Windows node config to be used on the node.
         */
        osVersion?: string | null;
    }
    /**
     * Windows server version.
     */
    export interface Schema$WindowsVersion {
        /**
         * Windows server image type
         */
        imageType?: string | null;
        /**
         * Windows server build number
         */
        osVersion?: string | null;
        /**
         * Mainstream support end date
         */
        supportEndDate?: Schema$Date;
    }
    /**
     * Windows server versions.
     */
    export interface Schema$WindowsVersions {
        /**
         * List of Windows server versions.
         */
        windowsVersions?: Schema$WindowsVersion[];
    }
    /**
     * Configuration for direct-path (via ALTS) with workload identity.
     */
    export interface Schema$WorkloadALTSConfig {
        /**
         * enable_alts controls whether the alts handshaker should be enabled or not for direct-path. Requires Workload Identity (workload_pool must be non-empty).
         */
        enableAlts?: boolean | null;
    }
    /**
     * Configuration for issuance of mTLS keys and certificates to Kubernetes pods.
     */
    export interface Schema$WorkloadCertificates {
        /**
         * enable_certificates controls issuance of workload mTLS certificates. If set, the GKE Workload Identity Certificates controller and node agent will be deployed in the cluster, which can then be configured by creating a WorkloadCertificateConfig Custom Resource. Requires Workload Identity (workload_pool must be non-empty).
         */
        enableCertificates?: boolean | null;
    }
    /**
     * WorkloadConfig defines the flags to enable or disable the workload configurations for the cluster.
     */
    export interface Schema$WorkloadConfig {
        /**
         * Sets which mode of auditing should be used for the cluster's workloads.
         */
        auditMode?: string | null;
    }
    /**
     * Configuration for the use of Kubernetes Service Accounts in GCP IAM policies.
     */
    export interface Schema$WorkloadIdentityConfig {
        /**
         * IAM Identity Namespace to attach all Kubernetes Service Accounts to.
         */
        identityNamespace?: string | null;
        /**
         * identity provider is the third party identity provider.
         */
        identityProvider?: string | null;
        /**
         * The workload pool to attach all Kubernetes service accounts to.
         */
        workloadPool?: string | null;
    }
    /**
     * WorkloadMetadataConfig defines the metadata configuration to expose to workloads on the node pool.
     */
    export interface Schema$WorkloadMetadataConfig {
        /**
         * Mode is the configuration for how to expose metadata to workloads running on the node pool.
         */
        mode?: string | null;
        /**
         * NodeMetadata is the configuration for how to expose metadata to the workloads running on the node.
         */
        nodeMetadata?: string | null;
    }
    /**
     * WorkloadPolicyConfig is the configuration related to GCW workload policy
     */
    export interface Schema$WorkloadPolicyConfig {
        /**
         * If true, workloads can use NET_ADMIN capability.
         */
        allowNetAdmin?: boolean | null;
        /**
         * If true, enables the GCW Auditor that audits workloads on standard clusters.
         */
        autopilotCompatibilityAuditingEnabled?: boolean | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        aggregated: Resource$Projects$Aggregated;
        locations: Resource$Projects$Locations;
        zones: Resource$Projects$Zones;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Aggregated {
        context: APIRequestContext;
        usableSubnetworks: Resource$Projects$Aggregated$Usablesubnetworks;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Aggregated$Usablesubnetworks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists subnetworks that can be used for creating clusters in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Aggregated$Usablesubnetworks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Aggregated$Usablesubnetworks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListUsableSubnetworksResponse>>;
        list(params: Params$Resource$Projects$Aggregated$Usablesubnetworks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Aggregated$Usablesubnetworks$List, options: MethodOptions | BodyResponseCallback<Schema$ListUsableSubnetworksResponse>, callback: BodyResponseCallback<Schema$ListUsableSubnetworksResponse>): void;
        list(params: Params$Resource$Projects$Aggregated$Usablesubnetworks$List, callback: BodyResponseCallback<Schema$ListUsableSubnetworksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListUsableSubnetworksResponse>): void;
    }
    export interface Params$Resource$Projects$Aggregated$Usablesubnetworks$List extends StandardParameters {
        /**
         * Filtering currently only supports equality on the networkProjectId and must be in the form: "networkProjectId=[PROJECTID]", where `networkProjectId` is the project which owns the listed subnetworks. This defaults to the parent project ID.
         */
        filter?: string;
        /**
         * The max number of results per page that should be returned. If the number of available results is larger than `page_size`, a `next_page_token` is returned which can be used to get the next page of results in subsequent requests. Acceptable values are 0 to 500, inclusive. (Default: 500)
         */
        pageSize?: number;
        /**
         * Specifies a page token to use. Set this to the nextPageToken returned by previous list requests to get the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The parent project where subnetworks are usable. Specified in the format `projects/x`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        clusters: Resource$Projects$Locations$Clusters;
        operations: Resource$Projects$Locations$Operations;
        constructor(context: APIRequestContext);
        /**
         * Returns configuration info about the Google Kubernetes Engine service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getServerConfig(params: Params$Resource$Projects$Locations$Getserverconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getServerConfig(params?: Params$Resource$Projects$Locations$Getserverconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServerConfig>>;
        getServerConfig(params: Params$Resource$Projects$Locations$Getserverconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getServerConfig(params: Params$Resource$Projects$Locations$Getserverconfig, options: MethodOptions | BodyResponseCallback<Schema$ServerConfig>, callback: BodyResponseCallback<Schema$ServerConfig>): void;
        getServerConfig(params: Params$Resource$Projects$Locations$Getserverconfig, callback: BodyResponseCallback<Schema$ServerConfig>): void;
        getServerConfig(callback: BodyResponseCallback<Schema$ServerConfig>): void;
        /**
         * Fetches locations that offer Google Kubernetes Engine.
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
    export interface Params$Resource$Projects$Locations$Getserverconfig extends StandardParameters {
        /**
         * The name (project and location) of the server config to get, specified in the format `projects/x/locations/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$List extends StandardParameters {
        /**
         * Required. Contains the name of the resource requested. Specified in the format `projects/x`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Clusters {
        context: APIRequestContext;
        nodePools: Resource$Projects$Locations$Clusters$Nodepools;
        wellKnown: Resource$Projects$Locations$Clusters$WellKnown;
        constructor(context: APIRequestContext);
        /**
         * Checks the cluster compatibility with Autopilot mode, and returns a list of compatibility issues.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkAutopilotCompatibility(params: Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkAutopilotCompatibility(params?: Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckAutopilotCompatibilityResponse>>;
        checkAutopilotCompatibility(params: Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkAutopilotCompatibility(params: Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility, options: MethodOptions | BodyResponseCallback<Schema$CheckAutopilotCompatibilityResponse>, callback: BodyResponseCallback<Schema$CheckAutopilotCompatibilityResponse>): void;
        checkAutopilotCompatibility(params: Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility, callback: BodyResponseCallback<Schema$CheckAutopilotCompatibilityResponse>): void;
        checkAutopilotCompatibility(callback: BodyResponseCallback<Schema$CheckAutopilotCompatibilityResponse>): void;
        /**
         * Completes master IP rotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeIpRotation(params: Params$Resource$Projects$Locations$Clusters$Completeiprotation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeIpRotation(params?: Params$Resource$Projects$Locations$Clusters$Completeiprotation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        completeIpRotation(params: Params$Resource$Projects$Locations$Clusters$Completeiprotation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeIpRotation(params: Params$Resource$Projects$Locations$Clusters$Completeiprotation, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        completeIpRotation(params: Params$Resource$Projects$Locations$Clusters$Completeiprotation, callback: BodyResponseCallback<Schema$Operation>): void;
        completeIpRotation(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a cluster, consisting of the specified number and type of Google Compute Engine instances. By default, the cluster is created in the project's [default network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks). One firewall is added for the cluster. After cluster creation, the Kubelet creates routes for each node to allow the containers on that node to communicate with all other instances in the cluster. Finally, an entry is added to the project's global metadata indicating which CIDR range the cluster is using.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Clusters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Clusters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Clusters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Clusters$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Clusters$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the cluster, including the Kubernetes endpoint and all worker nodes. Firewalls and routes that were configured during cluster creation are also deleted. Other Google Compute Engine resources that might be in use by the cluster, such as load balancer resources, are not deleted if they weren't present when the cluster was initially created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Clusters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Clusters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Clusters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Clusters$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Clusters$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Fetch upgrade information of a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchClusterUpgradeInfo(params?: Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClusterUpgradeInfo>>;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo, options: MethodOptions | BodyResponseCallback<Schema$ClusterUpgradeInfo>, callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo, callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        fetchClusterUpgradeInfo(callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        /**
         * Gets the details for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Clusters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Clusters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Cluster>>;
        get(params: Params$Resource$Projects$Locations$Clusters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Clusters$Get, options: MethodOptions | BodyResponseCallback<Schema$Cluster>, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(params: Params$Resource$Projects$Locations$Clusters$Get, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(callback: BodyResponseCallback<Schema$Cluster>): void;
        /**
         * Gets the public component of the cluster signing keys in JSON Web Key format.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getJwks(params: Params$Resource$Projects$Locations$Clusters$Getjwks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getJwks(params?: Params$Resource$Projects$Locations$Clusters$Getjwks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetJSONWebKeysResponse>>;
        getJwks(params: Params$Resource$Projects$Locations$Clusters$Getjwks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getJwks(params: Params$Resource$Projects$Locations$Clusters$Getjwks, options: MethodOptions | BodyResponseCallback<Schema$GetJSONWebKeysResponse>, callback: BodyResponseCallback<Schema$GetJSONWebKeysResponse>): void;
        getJwks(params: Params$Resource$Projects$Locations$Clusters$Getjwks, callback: BodyResponseCallback<Schema$GetJSONWebKeysResponse>): void;
        getJwks(callback: BodyResponseCallback<Schema$GetJSONWebKeysResponse>): void;
        /**
         * Lists all clusters owned by a project in either the specified zone or all zones.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Clusters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Clusters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClustersResponse>>;
        list(params: Params$Resource$Projects$Locations$Clusters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Clusters$List, options: MethodOptions | BodyResponseCallback<Schema$ListClustersResponse>, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(params: Params$Resource$Projects$Locations$Clusters$List, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        /**
         * Sets the addons for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAddons(params: Params$Resource$Projects$Locations$Clusters$Setaddons, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAddons(params?: Params$Resource$Projects$Locations$Clusters$Setaddons, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setAddons(params: Params$Resource$Projects$Locations$Clusters$Setaddons, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAddons(params: Params$Resource$Projects$Locations$Clusters$Setaddons, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setAddons(params: Params$Resource$Projects$Locations$Clusters$Setaddons, callback: BodyResponseCallback<Schema$Operation>): void;
        setAddons(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Enables or disables the ABAC authorization mechanism on a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setLegacyAbac(params: Params$Resource$Projects$Locations$Clusters$Setlegacyabac, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setLegacyAbac(params?: Params$Resource$Projects$Locations$Clusters$Setlegacyabac, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setLegacyAbac(params: Params$Resource$Projects$Locations$Clusters$Setlegacyabac, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setLegacyAbac(params: Params$Resource$Projects$Locations$Clusters$Setlegacyabac, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setLegacyAbac(params: Params$Resource$Projects$Locations$Clusters$Setlegacyabac, callback: BodyResponseCallback<Schema$Operation>): void;
        setLegacyAbac(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the locations for a specific cluster. Deprecated. Use [projects.locations.clusters.update](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1beta1/projects.locations.clusters/update) instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setLocations(params: Params$Resource$Projects$Locations$Clusters$Setlocations, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setLocations(params?: Params$Resource$Projects$Locations$Clusters$Setlocations, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setLocations(params: Params$Resource$Projects$Locations$Clusters$Setlocations, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setLocations(params: Params$Resource$Projects$Locations$Clusters$Setlocations, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setLocations(params: Params$Resource$Projects$Locations$Clusters$Setlocations, callback: BodyResponseCallback<Schema$Operation>): void;
        setLocations(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the logging service for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setLogging(params: Params$Resource$Projects$Locations$Clusters$Setlogging, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setLogging(params?: Params$Resource$Projects$Locations$Clusters$Setlogging, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setLogging(params: Params$Resource$Projects$Locations$Clusters$Setlogging, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setLogging(params: Params$Resource$Projects$Locations$Clusters$Setlogging, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setLogging(params: Params$Resource$Projects$Locations$Clusters$Setlogging, callback: BodyResponseCallback<Schema$Operation>): void;
        setLogging(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the maintenance policy for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setMaintenancePolicy(params: Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setMaintenancePolicy(params?: Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setMaintenancePolicy(params: Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setMaintenancePolicy(params: Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setMaintenancePolicy(params: Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy, callback: BodyResponseCallback<Schema$Operation>): void;
        setMaintenancePolicy(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets master auth materials. Currently supports changing the admin password or a specific cluster, either via password generation or explicitly setting the password.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setMasterAuth(params: Params$Resource$Projects$Locations$Clusters$Setmasterauth, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setMasterAuth(params?: Params$Resource$Projects$Locations$Clusters$Setmasterauth, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setMasterAuth(params: Params$Resource$Projects$Locations$Clusters$Setmasterauth, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setMasterAuth(params: Params$Resource$Projects$Locations$Clusters$Setmasterauth, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setMasterAuth(params: Params$Resource$Projects$Locations$Clusters$Setmasterauth, callback: BodyResponseCallback<Schema$Operation>): void;
        setMasterAuth(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the monitoring service for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setMonitoring(params: Params$Resource$Projects$Locations$Clusters$Setmonitoring, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setMonitoring(params?: Params$Resource$Projects$Locations$Clusters$Setmonitoring, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setMonitoring(params: Params$Resource$Projects$Locations$Clusters$Setmonitoring, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setMonitoring(params: Params$Resource$Projects$Locations$Clusters$Setmonitoring, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setMonitoring(params: Params$Resource$Projects$Locations$Clusters$Setmonitoring, callback: BodyResponseCallback<Schema$Operation>): void;
        setMonitoring(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Enables or disables Network Policy for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setNetworkPolicy(params: Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setNetworkPolicy(params?: Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setNetworkPolicy(params: Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setNetworkPolicy(params: Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setNetworkPolicy(params: Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy, callback: BodyResponseCallback<Schema$Operation>): void;
        setNetworkPolicy(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets labels on a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setResourceLabels(params: Params$Resource$Projects$Locations$Clusters$Setresourcelabels, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setResourceLabels(params?: Params$Resource$Projects$Locations$Clusters$Setresourcelabels, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setResourceLabels(params: Params$Resource$Projects$Locations$Clusters$Setresourcelabels, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setResourceLabels(params: Params$Resource$Projects$Locations$Clusters$Setresourcelabels, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setResourceLabels(params: Params$Resource$Projects$Locations$Clusters$Setresourcelabels, callback: BodyResponseCallback<Schema$Operation>): void;
        setResourceLabels(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Starts master IP rotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startIpRotation(params: Params$Resource$Projects$Locations$Clusters$Startiprotation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startIpRotation(params?: Params$Resource$Projects$Locations$Clusters$Startiprotation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startIpRotation(params: Params$Resource$Projects$Locations$Clusters$Startiprotation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startIpRotation(params: Params$Resource$Projects$Locations$Clusters$Startiprotation, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startIpRotation(params: Params$Resource$Projects$Locations$Clusters$Startiprotation, callback: BodyResponseCallback<Schema$Operation>): void;
        startIpRotation(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the settings for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Clusters$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Clusters$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Projects$Locations$Clusters$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Clusters$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Projects$Locations$Clusters$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the master for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateMaster(params: Params$Resource$Projects$Locations$Clusters$Updatemaster, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateMaster(params?: Params$Resource$Projects$Locations$Clusters$Updatemaster, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateMaster(params: Params$Resource$Projects$Locations$Clusters$Updatemaster, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateMaster(params: Params$Resource$Projects$Locations$Clusters$Updatemaster, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateMaster(params: Params$Resource$Projects$Locations$Clusters$Updatemaster, callback: BodyResponseCallback<Schema$Operation>): void;
        updateMaster(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Checkautopilotcompatibility extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Completeiprotation extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to complete IP rotation. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CompleteIPRotationRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Create extends StandardParameters {
        /**
         * The parent (project and location) where the cluster will be created. Specified in the format `projects/x/locations/x`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateClusterRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Delete extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to delete. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster) of the cluster to delete. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Fetchclusterupgradeinfo extends StandardParameters {
        /**
         * Required. The name (project, location, cluster) of the cluster to get. Specified in the format `projects/x/locations/x/clusters/x` or `projects/x/zones/x/clusters/x`.
         */
        name?: string;
        /**
         * API request version that initiates this operation.
         */
        version?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Get extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to retrieve. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Getjwks extends StandardParameters {
        /**
         * The cluster (project, location, cluster name) to get keys for. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$List extends StandardParameters {
        /**
         * The parent (project and location) where the clusters will be listed. Specified in the format `projects/x/locations/x`. Location "-" matches all zones and all regions.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides, or "-" for all zones. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setaddons extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to set addons. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetAddonsConfigRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setlegacyabac extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to set legacy abac. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLegacyAbacRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setlocations extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to set locations. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLocationsRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setlogging extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to set logging. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLoggingServiceRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setmaintenancepolicy extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to set maintenance policy. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMaintenancePolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setmasterauth extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to set auth. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMasterAuthRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setmonitoring extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to set monitoring. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMonitoringServiceRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setnetworkpolicy extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to set networking policy. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNetworkPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Setresourcelabels extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to set labels. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLabelsRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Startiprotation extends StandardParameters {
        /**
         * The name (project, location, cluster name) of the cluster to start IP rotation. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartIPRotationRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Update extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to update. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateClusterRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Updatemaster extends StandardParameters {
        /**
         * The name (project, location, cluster) of the cluster to update. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateMasterRequest;
    }
    export class Resource$Projects$Locations$Clusters$Nodepools {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * CompleteNodePoolUpgrade will signal an on-going node pool upgrade to complete.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeUpgrade(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeUpgrade(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        completeUpgrade(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeUpgrade(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        completeUpgrade(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade, callback: BodyResponseCallback<Schema$Empty>): void;
        completeUpgrade(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Creates a node pool for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a node pool from a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Fetch upgrade information of a specific nodepool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchNodePoolUpgradeInfo(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NodePoolUpgradeInfo>>;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: MethodOptions | BodyResponseCallback<Schema$NodePoolUpgradeInfo>, callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo, callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        fetchNodePoolUpgradeInfo(callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        /**
         * Retrieves the requested node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NodePool>>;
        get(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Get, options: MethodOptions | BodyResponseCallback<Schema$NodePool>, callback: BodyResponseCallback<Schema$NodePool>): void;
        get(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Get, callback: BodyResponseCallback<Schema$NodePool>): void;
        get(callback: BodyResponseCallback<Schema$NodePool>): void;
        /**
         * Lists the node pools for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Clusters$Nodepools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNodePoolsResponse>>;
        list(params: Params$Resource$Projects$Locations$Clusters$Nodepools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Clusters$Nodepools$List, options: MethodOptions | BodyResponseCallback<Schema$ListNodePoolsResponse>, callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Clusters$Nodepools$List, callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        /**
         * Rolls back a previously Aborted or Failed NodePool upgrade. This makes no changes if the last upgrade successfully completed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rollback(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rollback(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rollback(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rollback(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the autoscaling settings of a specific node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAutoscaling(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAutoscaling(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setAutoscaling(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAutoscaling(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setAutoscaling(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling, callback: BodyResponseCallback<Schema$Operation>): void;
        setAutoscaling(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the NodeManagement options for a node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setManagement(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setManagement(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setManagement(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setManagement(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setManagement(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement, callback: BodyResponseCallback<Schema$Operation>): void;
        setManagement(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * SetNodePoolSizeRequest sets the size of a node pool. The new size will be used for all replicas, including future replicas created by modifying NodePool.locations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setSize(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setSize(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setSize(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setSize(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setSize(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize, callback: BodyResponseCallback<Schema$Operation>): void;
        setSize(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the version and/or image type of a specific node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Clusters$Nodepools$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Projects$Locations$Clusters$Nodepools$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Completeupgrade extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool id) of the node pool to complete upgrade. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CompleteNodePoolUpgradeRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Create extends StandardParameters {
        /**
         * The parent (project, location, cluster name) where the node pool will be created. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateNodePoolRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Delete extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to delete. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The name of the node pool to delete. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Fetchnodepoolupgradeinfo extends StandardParameters {
        /**
         * Required. The name (project, location, cluster, nodepool) of the nodepool to get. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x` or `projects/x/zones/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * API request version that initiates this operation.
         */
        version?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Get extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to get. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The name of the node pool. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$List extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the parent field.
         */
        clusterId?: string;
        /**
         * The parent (project, location, cluster name) where the node pools will be listed. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Rollback extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool id) of the node poll to rollback upgrade. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RollbackNodePoolUpgradeRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Setautoscaling extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool) of the node pool to set autoscaler settings. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolAutoscalingRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Setmanagement extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool id) of the node pool to set management properties. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolManagementRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Setsize extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool id) of the node pool to set size. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolSizeRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Nodepools$Update extends StandardParameters {
        /**
         * The name (project, location, cluster, node pool) of the node pool to update. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateNodePoolRequest;
    }
    export class Resource$Projects$Locations$Clusters$WellKnown {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the OIDC discovery document for the cluster. See the [OpenID Connect Discovery 1.0 specification](https://openid.net/specs/openid-connect-discovery-1_0.html) for details.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getOpenidConfiguration(params: Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getOpenidConfiguration(params?: Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetOpenIDConfigResponse>>;
        getOpenidConfiguration(params: Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getOpenidConfiguration(params: Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration, options: MethodOptions | BodyResponseCallback<Schema$GetOpenIDConfigResponse>, callback: BodyResponseCallback<Schema$GetOpenIDConfigResponse>): void;
        getOpenidConfiguration(params: Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration, callback: BodyResponseCallback<Schema$GetOpenIDConfigResponse>): void;
        getOpenidConfiguration(callback: BodyResponseCallback<Schema$GetOpenIDConfigResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Clusters$WellKnown$Getopenidconfiguration extends StandardParameters {
        /**
         * The cluster (project, location, cluster name) to get the discovery document for. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Cancels the specified operation.
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
         * Gets the specified operation.
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
         * Lists all operations in a project in the specified zone or all zones.
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
         * The name (project, location, operation id) of the operation to cancel. Specified in the format `projects/x/locations/x/operations/x`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name (project, location, operation id) of the operation to get. Specified in the format `projects/x/locations/x/operations/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.
         */
        operationId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$List extends StandardParameters {
        /**
         * The parent (project and location) where the operations will be listed. Specified in the format `projects/x/locations/x`. Location "-" matches all zones and all regions.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for, or `-` for all zones. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export class Resource$Projects$Zones {
        context: APIRequestContext;
        clusters: Resource$Projects$Zones$Clusters;
        operations: Resource$Projects$Zones$Operations;
        constructor(context: APIRequestContext);
        /**
         * Returns configuration info about the Google Kubernetes Engine service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getServerconfig(params: Params$Resource$Projects$Zones$Getserverconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getServerconfig(params?: Params$Resource$Projects$Zones$Getserverconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServerConfig>>;
        getServerconfig(params: Params$Resource$Projects$Zones$Getserverconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getServerconfig(params: Params$Resource$Projects$Zones$Getserverconfig, options: MethodOptions | BodyResponseCallback<Schema$ServerConfig>, callback: BodyResponseCallback<Schema$ServerConfig>): void;
        getServerconfig(params: Params$Resource$Projects$Zones$Getserverconfig, callback: BodyResponseCallback<Schema$ServerConfig>): void;
        getServerconfig(callback: BodyResponseCallback<Schema$ServerConfig>): void;
    }
    export interface Params$Resource$Projects$Zones$Getserverconfig extends StandardParameters {
        /**
         * The name (project and location) of the server config to get, specified in the format `projects/x/locations/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export class Resource$Projects$Zones$Clusters {
        context: APIRequestContext;
        nodePools: Resource$Projects$Zones$Clusters$Nodepools;
        constructor(context: APIRequestContext);
        /**
         * Sets the addons for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        addons(params: Params$Resource$Projects$Zones$Clusters$Addons, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addons(params?: Params$Resource$Projects$Zones$Clusters$Addons, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        addons(params: Params$Resource$Projects$Zones$Clusters$Addons, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addons(params: Params$Resource$Projects$Zones$Clusters$Addons, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        addons(params: Params$Resource$Projects$Zones$Clusters$Addons, callback: BodyResponseCallback<Schema$Operation>): void;
        addons(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Completes master IP rotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeIpRotation(params: Params$Resource$Projects$Zones$Clusters$Completeiprotation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeIpRotation(params?: Params$Resource$Projects$Zones$Clusters$Completeiprotation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        completeIpRotation(params: Params$Resource$Projects$Zones$Clusters$Completeiprotation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeIpRotation(params: Params$Resource$Projects$Zones$Clusters$Completeiprotation, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        completeIpRotation(params: Params$Resource$Projects$Zones$Clusters$Completeiprotation, callback: BodyResponseCallback<Schema$Operation>): void;
        completeIpRotation(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a cluster, consisting of the specified number and type of Google Compute Engine instances. By default, the cluster is created in the project's [default network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks). One firewall is added for the cluster. After cluster creation, the Kubelet creates routes for each node to allow the containers on that node to communicate with all other instances in the cluster. Finally, an entry is added to the project's global metadata indicating which CIDR range the cluster is using.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Zones$Clusters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Zones$Clusters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Zones$Clusters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Zones$Clusters$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Zones$Clusters$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the cluster, including the Kubernetes endpoint and all worker nodes. Firewalls and routes that were configured during cluster creation are also deleted. Other Google Compute Engine resources that might be in use by the cluster, such as load balancer resources, are not deleted if they weren't present when the cluster was initially created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Zones$Clusters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Zones$Clusters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Zones$Clusters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Zones$Clusters$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Zones$Clusters$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Fetch upgrade information of a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchClusterUpgradeInfo(params?: Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClusterUpgradeInfo>>;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo, options: MethodOptions | BodyResponseCallback<Schema$ClusterUpgradeInfo>, callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        fetchClusterUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo, callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        fetchClusterUpgradeInfo(callback: BodyResponseCallback<Schema$ClusterUpgradeInfo>): void;
        /**
         * Gets the details for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Zones$Clusters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Zones$Clusters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Cluster>>;
        get(params: Params$Resource$Projects$Zones$Clusters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Zones$Clusters$Get, options: MethodOptions | BodyResponseCallback<Schema$Cluster>, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(params: Params$Resource$Projects$Zones$Clusters$Get, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(callback: BodyResponseCallback<Schema$Cluster>): void;
        /**
         * Enables or disables the ABAC authorization mechanism on a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        legacyAbac(params: Params$Resource$Projects$Zones$Clusters$Legacyabac, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        legacyAbac(params?: Params$Resource$Projects$Zones$Clusters$Legacyabac, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        legacyAbac(params: Params$Resource$Projects$Zones$Clusters$Legacyabac, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        legacyAbac(params: Params$Resource$Projects$Zones$Clusters$Legacyabac, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        legacyAbac(params: Params$Resource$Projects$Zones$Clusters$Legacyabac, callback: BodyResponseCallback<Schema$Operation>): void;
        legacyAbac(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all clusters owned by a project in either the specified zone or all zones.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Zones$Clusters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Zones$Clusters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClustersResponse>>;
        list(params: Params$Resource$Projects$Zones$Clusters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Zones$Clusters$List, options: MethodOptions | BodyResponseCallback<Schema$ListClustersResponse>, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(params: Params$Resource$Projects$Zones$Clusters$List, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        /**
         * Sets the locations for a specific cluster. Deprecated. Use [projects.locations.clusters.update](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1beta1/projects.locations.clusters/update) instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        locations(params: Params$Resource$Projects$Zones$Clusters$Locations, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        locations(params?: Params$Resource$Projects$Zones$Clusters$Locations, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        locations(params: Params$Resource$Projects$Zones$Clusters$Locations, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        locations(params: Params$Resource$Projects$Zones$Clusters$Locations, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        locations(params: Params$Resource$Projects$Zones$Clusters$Locations, callback: BodyResponseCallback<Schema$Operation>): void;
        locations(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the logging service for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        logging(params: Params$Resource$Projects$Zones$Clusters$Logging, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        logging(params?: Params$Resource$Projects$Zones$Clusters$Logging, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        logging(params: Params$Resource$Projects$Zones$Clusters$Logging, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        logging(params: Params$Resource$Projects$Zones$Clusters$Logging, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        logging(params: Params$Resource$Projects$Zones$Clusters$Logging, callback: BodyResponseCallback<Schema$Operation>): void;
        logging(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the master for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        master(params: Params$Resource$Projects$Zones$Clusters$Master, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        master(params?: Params$Resource$Projects$Zones$Clusters$Master, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        master(params: Params$Resource$Projects$Zones$Clusters$Master, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        master(params: Params$Resource$Projects$Zones$Clusters$Master, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        master(params: Params$Resource$Projects$Zones$Clusters$Master, callback: BodyResponseCallback<Schema$Operation>): void;
        master(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the monitoring service for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        monitoring(params: Params$Resource$Projects$Zones$Clusters$Monitoring, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        monitoring(params?: Params$Resource$Projects$Zones$Clusters$Monitoring, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        monitoring(params: Params$Resource$Projects$Zones$Clusters$Monitoring, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        monitoring(params: Params$Resource$Projects$Zones$Clusters$Monitoring, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        monitoring(params: Params$Resource$Projects$Zones$Clusters$Monitoring, callback: BodyResponseCallback<Schema$Operation>): void;
        monitoring(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets labels on a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resourceLabels(params: Params$Resource$Projects$Zones$Clusters$Resourcelabels, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resourceLabels(params?: Params$Resource$Projects$Zones$Clusters$Resourcelabels, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resourceLabels(params: Params$Resource$Projects$Zones$Clusters$Resourcelabels, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resourceLabels(params: Params$Resource$Projects$Zones$Clusters$Resourcelabels, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resourceLabels(params: Params$Resource$Projects$Zones$Clusters$Resourcelabels, callback: BodyResponseCallback<Schema$Operation>): void;
        resourceLabels(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the maintenance policy for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setMaintenancePolicy(params: Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setMaintenancePolicy(params?: Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setMaintenancePolicy(params: Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setMaintenancePolicy(params: Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setMaintenancePolicy(params: Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy, callback: BodyResponseCallback<Schema$Operation>): void;
        setMaintenancePolicy(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets master auth materials. Currently supports changing the admin password or a specific cluster, either via password generation or explicitly setting the password.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setMasterAuth(params: Params$Resource$Projects$Zones$Clusters$Setmasterauth, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setMasterAuth(params?: Params$Resource$Projects$Zones$Clusters$Setmasterauth, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setMasterAuth(params: Params$Resource$Projects$Zones$Clusters$Setmasterauth, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setMasterAuth(params: Params$Resource$Projects$Zones$Clusters$Setmasterauth, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setMasterAuth(params: Params$Resource$Projects$Zones$Clusters$Setmasterauth, callback: BodyResponseCallback<Schema$Operation>): void;
        setMasterAuth(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Enables or disables Network Policy for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setNetworkPolicy(params: Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setNetworkPolicy(params?: Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setNetworkPolicy(params: Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setNetworkPolicy(params: Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setNetworkPolicy(params: Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy, callback: BodyResponseCallback<Schema$Operation>): void;
        setNetworkPolicy(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Starts master IP rotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startIpRotation(params: Params$Resource$Projects$Zones$Clusters$Startiprotation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startIpRotation(params?: Params$Resource$Projects$Zones$Clusters$Startiprotation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startIpRotation(params: Params$Resource$Projects$Zones$Clusters$Startiprotation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startIpRotation(params: Params$Resource$Projects$Zones$Clusters$Startiprotation, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startIpRotation(params: Params$Resource$Projects$Zones$Clusters$Startiprotation, callback: BodyResponseCallback<Schema$Operation>): void;
        startIpRotation(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the settings for a specific cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Zones$Clusters$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Zones$Clusters$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Projects$Zones$Clusters$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Zones$Clusters$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Projects$Zones$Clusters$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Addons extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetAddonsConfigRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Completeiprotation extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CompleteIPRotationRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Create extends StandardParameters {
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateClusterRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Delete extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to delete. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster) of the cluster to delete. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Fetchclusterupgradeinfo extends StandardParameters {
        /**
         * Required. The name (project, location, cluster) of the cluster to get. Specified in the format `projects/x/locations/x/clusters/x` or `projects/x/zones/x/clusters/x`.
         */
        name?: string;
        /**
         * API request version that initiates this operation.
         */
        version?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Get extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to retrieve. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Legacyabac extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLegacyAbacRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$List extends StandardParameters {
        /**
         * The parent (project and location) where the clusters will be listed. Specified in the format `projects/x/locations/x`. Location "-" matches all zones and all regions.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides, or "-" for all zones. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Locations extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLocationsRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Logging extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLoggingServiceRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Master extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateMasterRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Monitoring extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMonitoringServiceRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Resourcelabels extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetLabelsRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Setmaintenancepolicy extends StandardParameters {
        /**
         * Required. The name of the cluster to update.
         */
        clusterId?: string;
        /**
         * Required. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects).
         */
        projectId?: string;
        /**
         * Required. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMaintenancePolicyRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Setmasterauth extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetMasterAuthRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Setnetworkpolicy extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNetworkPolicyRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Startiprotation extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartIPRotationRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Update extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateClusterRequest;
    }
    export class Resource$Projects$Zones$Clusters$Nodepools {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Sets the autoscaling settings of a specific node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        autoscaling(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        autoscaling(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        autoscaling(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        autoscaling(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        autoscaling(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling, callback: BodyResponseCallback<Schema$Operation>): void;
        autoscaling(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a node pool for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a node pool from a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Fetch upgrade information of a specific nodepool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchNodePoolUpgradeInfo(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NodePoolUpgradeInfo>>;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo, options: MethodOptions | BodyResponseCallback<Schema$NodePoolUpgradeInfo>, callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        fetchNodePoolUpgradeInfo(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo, callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        fetchNodePoolUpgradeInfo(callback: BodyResponseCallback<Schema$NodePoolUpgradeInfo>): void;
        /**
         * Retrieves the requested node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NodePool>>;
        get(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Get, options: MethodOptions | BodyResponseCallback<Schema$NodePool>, callback: BodyResponseCallback<Schema$NodePool>): void;
        get(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Get, callback: BodyResponseCallback<Schema$NodePool>): void;
        get(callback: BodyResponseCallback<Schema$NodePool>): void;
        /**
         * Lists the node pools for a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Zones$Clusters$Nodepools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNodePoolsResponse>>;
        list(params: Params$Resource$Projects$Zones$Clusters$Nodepools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Zones$Clusters$Nodepools$List, options: MethodOptions | BodyResponseCallback<Schema$ListNodePoolsResponse>, callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        list(params: Params$Resource$Projects$Zones$Clusters$Nodepools$List, callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNodePoolsResponse>): void;
        /**
         * Rolls back a previously Aborted or Failed NodePool upgrade. This makes no changes if the last upgrade successfully completed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rollback(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rollback(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rollback(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rollback(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the NodeManagement options for a node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setManagement(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setManagement(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setManagement(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setManagement(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setManagement(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement, callback: BodyResponseCallback<Schema$Operation>): void;
        setManagement(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * SetNodePoolSizeRequest sets the size of a node pool. The new size will be used for all replicas, including future replicas created by modifying NodePool.locations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setSize(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setSize(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setSize(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setSize(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setSize(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize, callback: BodyResponseCallback<Schema$Operation>): void;
        setSize(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates the version and/or image type of a specific node pool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Zones$Clusters$Nodepools$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Projects$Zones$Clusters$Nodepools$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Autoscaling extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The name of the node pool to upgrade. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolAutoscalingRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Create extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the parent field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateNodePoolRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Delete extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to delete. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The name of the node pool to delete. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Fetchnodepoolupgradeinfo extends StandardParameters {
        /**
         * Required. The name (project, location, cluster, nodepool) of the nodepool to get. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x` or `projects/x/zones/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * API request version that initiates this operation.
         */
        version?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Get extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * The name (project, location, cluster, node pool id) of the node pool to get. Specified in the format `projects/x/locations/x/clusters/x/nodePools/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The name of the node pool. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$List extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster. This field has been deprecated and replaced by the parent field.
         */
        clusterId?: string;
        /**
         * The parent (project, location, cluster name) where the node pools will be listed. Specified in the format `projects/x/locations/x/clusters/x`.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Rollback extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to rollback. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The name of the node pool to rollback. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RollbackNodePoolUpgradeRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Setmanagement extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The name of the node pool to update. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolManagementRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Setsize extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to update. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The name of the node pool to update. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetNodePoolSizeRequest;
    }
    export interface Params$Resource$Projects$Zones$Clusters$Nodepools$Update extends StandardParameters {
        /**
         * Required. Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.
         */
        clusterId?: string;
        /**
         * Required. Deprecated. The name of the node pool to upgrade. This field has been deprecated and replaced by the name field.
         */
        nodePoolId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateNodePoolRequest;
    }
    export class Resource$Projects$Zones$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Cancels the specified operation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Zones$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Zones$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Zones$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Zones$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Zones$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the specified operation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Zones$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Zones$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Zones$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Zones$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Zones$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all operations in a project in the specified zone or all zones.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Zones$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Zones$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Projects$Zones$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Zones$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Zones$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Zones$Operations$Cancel extends StandardParameters {
        /**
         * Required. Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.
         */
        operationId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Projects$Zones$Operations$Get extends StandardParameters {
        /**
         * The name (project, location, operation id) of the operation to get. Specified in the format `projects/x/locations/x/operations/x`.
         */
        name?: string;
        /**
         * Required. Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.
         */
        operationId?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.
         */
        zone?: string;
    }
    export interface Params$Resource$Projects$Zones$Operations$List extends StandardParameters {
        /**
         * The parent (project and location) where the operations will be listed. Specified in the format `projects/x/locations/x`. Location "-" matches all zones and all regions.
         */
        parent?: string;
        /**
         * Required. Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the parent field.
         */
        projectId?: string;
        /**
         * Required. Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for, or `-` for all zones. This field has been deprecated and replaced by the parent field.
         */
        zone?: string;
    }
    export {};
}
