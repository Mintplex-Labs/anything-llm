import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace dataproc_v1 {
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
     * Cloud Dataproc API
     *
     * Manages Hadoop-based clusters and jobs on Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const dataproc = google.dataproc('v1');
     * ```
     */
    export class Dataproc {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Specifies the type and number of accelerator cards attached to the instances of an instance. See GPUs on Compute Engine (https://cloud.google.com/compute/docs/gpus/).
     */
    export interface Schema$AcceleratorConfig {
        /**
         * The number of the accelerator cards of this type exposed to this instance.
         */
        acceleratorCount?: number | null;
        /**
         * Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using the Dataproc Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement) feature, you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.
         */
        acceleratorTypeUri?: string | null;
    }
    /**
     * Environment details of a Saprk Application.
     */
    export interface Schema$AccessSessionSparkApplicationEnvironmentInfoResponse {
        /**
         * Details about the Environment that the application is running in.
         */
        applicationEnvironmentInfo?: Schema$ApplicationEnvironmentInfo;
    }
    /**
     * Details of a particular job associated with Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationJobResponse {
        /**
         * Output only. Data corresponding to a spark job.
         */
        jobData?: Schema$JobData;
    }
    /**
     * Details of a native build info for a Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationNativeBuildInfoResponse {
        /**
         * Native SQL Execution Data
         */
        executionData?: Schema$NativeBuildInfoUiData;
    }
    /**
     * Details of a native query for a Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationNativeSqlQueryResponse {
        /**
         * Native SQL Execution Data
         */
        executionData?: Schema$NativeSqlExecutionUiData;
    }
    /**
     * A summary of Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationResponse {
        /**
         * Output only. High level information corresponding to an application.
         */
        application?: Schema$ApplicationInfo;
    }
    /**
     * Details of a query for a Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationSqlQueryResponse {
        /**
         * SQL Execution Data
         */
        executionData?: Schema$SqlExecutionUiData;
    }
    /**
     * SparkPlanGraph for a Spark Application execution limited to maximum 10000 clusters.
     */
    export interface Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse {
        /**
         * SparkPlanGraph for a Spark Application execution.
         */
        sparkPlanGraph?: Schema$SparkPlanGraph;
    }
    /**
     * Stage Attempt for a Stage of a Spark Application
     */
    export interface Schema$AccessSessionSparkApplicationStageAttemptResponse {
        /**
         * Output only. Data corresponding to a stage.
         */
        stageData?: Schema$StageData;
    }
    /**
     * RDD operation graph for a Spark Application Stage limited to maximum 10000 clusters.
     */
    export interface Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse {
        /**
         * RDD operation graph for a Spark Application Stage.
         */
        rddOperationGraph?: Schema$RddOperationGraph;
    }
    /**
     * Environment details of a Saprk Application.
     */
    export interface Schema$AccessSparkApplicationEnvironmentInfoResponse {
        /**
         * Details about the Environment that the application is running in.
         */
        applicationEnvironmentInfo?: Schema$ApplicationEnvironmentInfo;
    }
    /**
     * Details of a particular job associated with Spark Application
     */
    export interface Schema$AccessSparkApplicationJobResponse {
        /**
         * Output only. Data corresponding to a spark job.
         */
        jobData?: Schema$JobData;
    }
    /**
     * Details of Native Build Info for a Spark Application
     */
    export interface Schema$AccessSparkApplicationNativeBuildInfoResponse {
        /**
         * Native Build Info Data
         */
        buildInfo?: Schema$NativeBuildInfoUiData;
    }
    /**
     * Details of a query for a Spark Application
     */
    export interface Schema$AccessSparkApplicationNativeSqlQueryResponse {
        /**
         * Native SQL Execution Data
         */
        executionData?: Schema$NativeSqlExecutionUiData;
    }
    /**
     * A summary of Spark Application
     */
    export interface Schema$AccessSparkApplicationResponse {
        /**
         * Output only. High level information corresponding to an application.
         */
        application?: Schema$ApplicationInfo;
    }
    /**
     * Details of a query for a Spark Application
     */
    export interface Schema$AccessSparkApplicationSqlQueryResponse {
        /**
         * SQL Execution Data
         */
        executionData?: Schema$SqlExecutionUiData;
    }
    /**
     * SparkPlanGraph for a Spark Application execution limited to maximum 10000 clusters.
     */
    export interface Schema$AccessSparkApplicationSqlSparkPlanGraphResponse {
        /**
         * SparkPlanGraph for a Spark Application execution.
         */
        sparkPlanGraph?: Schema$SparkPlanGraph;
    }
    /**
     * Stage Attempt for a Stage of a Spark Application
     */
    export interface Schema$AccessSparkApplicationStageAttemptResponse {
        /**
         * Output only. Data corresponding to a stage.
         */
        stageData?: Schema$StageData;
    }
    /**
     * RDD operation graph for a Spark Application Stage limited to maximum 10000 clusters.
     */
    export interface Schema$AccessSparkApplicationStageRddOperationGraphResponse {
        /**
         * RDD operation graph for a Spark Application Stage.
         */
        rddOperationGraph?: Schema$RddOperationGraph;
    }
    export interface Schema$AccumulableInfo {
        accumullableInfoId?: string | null;
        name?: string | null;
        update?: string | null;
        value?: string | null;
    }
    /**
     * A request to analyze a batch workload.
     */
    export interface Schema$AnalyzeBatchRequest {
        /**
         * Optional. A unique ID used to identify the request. If the service receives two AnalyzeBatchRequest (http://cloud/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.AnalyzeBatchRequest)s with the same request_id, the second request is ignored and the Operation that corresponds to the first request created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The value must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Metadata describing the Analyze operation.
     */
    export interface Schema$AnalyzeOperationMetadata {
        /**
         * Output only. name of the workload being analyzed.
         */
        analyzedWorkloadName?: string | null;
        /**
         * Output only. Type of the workload being analyzed.
         */
        analyzedWorkloadType?: string | null;
        /**
         * Output only. unique identifier of the workload typically generated by control plane. E.g. batch uuid.
         */
        analyzedWorkloadUuid?: string | null;
        /**
         * Output only. The time when the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. Short description of the operation.
         */
        description?: string | null;
        /**
         * Output only. The time when the operation finished.
         */
        doneTime?: string | null;
        /**
         * Output only. Labels associated with the operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Warnings encountered during operation execution.
         */
        warnings?: string[] | null;
    }
    /**
     * Specific attempt of an application.
     */
    export interface Schema$ApplicationAttemptInfo {
        appSparkVersion?: string | null;
        attemptId?: string | null;
        completed?: boolean | null;
        durationMillis?: string | null;
        endTime?: string | null;
        lastUpdated?: string | null;
        sparkUser?: string | null;
        startTime?: string | null;
    }
    /**
     * Details about the Environment that the application is running in.
     */
    export interface Schema$ApplicationEnvironmentInfo {
        classpathEntries?: {
            [key: string]: string;
        } | null;
        hadoopProperties?: {
            [key: string]: string;
        } | null;
        metricsProperties?: {
            [key: string]: string;
        } | null;
        resourceProfiles?: Schema$ResourceProfileInfo[];
        runtime?: Schema$SparkRuntimeInfo;
        sparkProperties?: {
            [key: string]: string;
        } | null;
        systemProperties?: {
            [key: string]: string;
        } | null;
    }
    /**
     * High level information corresponding to an application.
     */
    export interface Schema$ApplicationInfo {
        applicationContextIngestionStatus?: string | null;
        applicationId?: string | null;
        attempts?: Schema$ApplicationAttemptInfo[];
        coresGranted?: number | null;
        coresPerExecutor?: number | null;
        maxCores?: number | null;
        memoryPerExecutorMb?: number | null;
        name?: string | null;
        quantileDataStatus?: string | null;
    }
    export interface Schema$AppSummary {
        numCompletedJobs?: number | null;
        numCompletedStages?: number | null;
    }
    /**
     * Authentication configuration for a workload is used to set the default identity for the workload execution. The config specifies the type of identity (service account or user) that will be used by workloads to access resources on the project(s).
     */
    export interface Schema$AuthenticationConfig {
        /**
         * Optional. Authentication type for the user workload running in containers.
         */
        userWorkloadAuthenticationType?: string | null;
    }
    /**
     * Autoscaling Policy config associated with the cluster.
     */
    export interface Schema$AutoscalingConfig {
        /**
         * Optional. The autoscaling policy used by the cluster.Only resource names including projectid and location (region) are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id] projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id]Note that the policy must be in the same project and Dataproc region.
         */
        policyUri?: string | null;
    }
    /**
     * Describes an autoscaling policy for Dataproc cluster autoscaler.
     */
    export interface Schema$AutoscalingPolicy {
        basicAlgorithm?: Schema$BasicAutoscalingAlgorithm;
        /**
         * Required. The policy id.The id must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of between 3 and 50 characters.
         */
        id?: string | null;
        /**
         * Optional. The labels to associate with this autoscaling policy. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with an autoscaling policy.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string | null;
        /**
         * Optional. Describes how the autoscaler will operate for secondary workers.
         */
        secondaryWorkerConfig?: Schema$InstanceGroupAutoscalingPolicyConfig;
        /**
         * Required. Describes how the autoscaler will operate for primary workers.
         */
        workerConfig?: Schema$InstanceGroupAutoscalingPolicyConfig;
    }
    /**
     * Autotuning configuration of the workload.
     */
    export interface Schema$AutotuningConfig {
        /**
         * Optional. Scenarios for which tunings are applied.
         */
        scenarios?: string[] | null;
    }
    /**
     * Node group identification and configuration information.
     */
    export interface Schema$AuxiliaryNodeGroup {
        /**
         * Required. Node group configuration.
         */
        nodeGroup?: Schema$NodeGroup;
        /**
         * Optional. A node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.
         */
        nodeGroupId?: string | null;
    }
    /**
     * Auxiliary services configuration for a Cluster.
     */
    export interface Schema$AuxiliaryServicesConfig {
        /**
         * Optional. The Hive Metastore configuration for this workload.
         */
        metastoreConfig?: Schema$MetastoreConfig;
        /**
         * Optional. The Spark History Server configuration for the workload.
         */
        sparkHistoryServerConfig?: Schema$SparkHistoryServerConfig;
    }
    /**
     * Basic algorithm for autoscaling.
     */
    export interface Schema$BasicAutoscalingAlgorithm {
        /**
         * Optional. Duration between scaling events. A scaling period starts after the update operation from the previous event has completed.Bounds: 2m, 1d. Default: 2m.
         */
        cooldownPeriod?: string | null;
        /**
         * Optional. Spark Standalone autoscaling configuration
         */
        sparkStandaloneConfig?: Schema$SparkStandaloneAutoscalingConfig;
        /**
         * Optional. YARN autoscaling configuration.
         */
        yarnConfig?: Schema$BasicYarnAutoscalingConfig;
    }
    /**
     * Basic autoscaling configurations for YARN.
     */
    export interface Schema$BasicYarnAutoscalingConfig {
        /**
         * Required. Timeout for YARN graceful decommissioning of Node Managers. Specifies the duration to wait for jobs to complete before forcefully removing workers (and potentially interrupting jobs). Only applicable to downscaling operations.Bounds: 0s, 1d.
         */
        gracefulDecommissionTimeout?: string | null;
        /**
         * Required. Fraction of average YARN pending memory in the last cooldown period for which to remove workers. A scale-down factor of 1 will result in scaling down so that there is no available memory remaining after the update (more aggressive scaling). A scale-down factor of 0 disables removing workers, which can be beneficial for autoscaling a single job. See How autoscaling works (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/autoscaling#how_autoscaling_works) for more information.Bounds: 0.0, 1.0.
         */
        scaleDownFactor?: number | null;
        /**
         * Optional. Minimum scale-down threshold as a fraction of total cluster size before scaling occurs. For example, in a 20-worker cluster, a threshold of 0.1 means the autoscaler must recommend at least a 2 worker scale-down for the cluster to scale. A threshold of 0 means the autoscaler will scale down on any recommended change.Bounds: 0.0, 1.0. Default: 0.0.
         */
        scaleDownMinWorkerFraction?: number | null;
        /**
         * Required. Fraction of average YARN pending memory in the last cooldown period for which to add workers. A scale-up factor of 1.0 will result in scaling up so that there is no pending memory remaining after the update (more aggressive scaling). A scale-up factor closer to 0 will result in a smaller magnitude of scaling up (less aggressive scaling). See How autoscaling works (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/autoscaling#how_autoscaling_works) for more information.Bounds: 0.0, 1.0.
         */
        scaleUpFactor?: number | null;
        /**
         * Optional. Minimum scale-up threshold as a fraction of total cluster size before scaling occurs. For example, in a 20-worker cluster, a threshold of 0.1 means the autoscaler must recommend at least a 2-worker scale-up for the cluster to scale. A threshold of 0 means the autoscaler will scale up on any recommended change.Bounds: 0.0, 1.0. Default: 0.0.
         */
        scaleUpMinWorkerFraction?: number | null;
    }
    /**
     * A representation of a batch workload in the service.
     */
    export interface Schema$Batch {
        /**
         * Output only. The time when the batch was created.
         */
        createTime?: string | null;
        /**
         * Output only. The email address of the user who created the batch.
         */
        creator?: string | null;
        /**
         * Optional. Environment configuration for the batch execution.
         */
        environmentConfig?: Schema$EnvironmentConfig;
        /**
         * Optional. The labels to associate with this batch. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a batch.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The resource name of the batch.
         */
        name?: string | null;
        /**
         * Output only. The resource name of the operation associated with this batch.
         */
        operation?: string | null;
        /**
         * Optional. PySpark batch config.
         */
        pysparkBatch?: Schema$PySparkBatch;
        /**
         * Optional. Runtime configuration for the batch execution.
         */
        runtimeConfig?: Schema$RuntimeConfig;
        /**
         * Output only. Runtime information about batch execution.
         */
        runtimeInfo?: Schema$RuntimeInfo;
        /**
         * Optional. Spark batch config.
         */
        sparkBatch?: Schema$SparkBatch;
        /**
         * Optional. SparkR batch config.
         */
        sparkRBatch?: Schema$SparkRBatch;
        /**
         * Optional. SparkSql batch config.
         */
        sparkSqlBatch?: Schema$SparkSqlBatch;
        /**
         * Output only. The state of the batch.
         */
        state?: string | null;
        /**
         * Output only. Historical state information for the batch.
         */
        stateHistory?: Schema$StateHistory[];
        /**
         * Output only. Batch state details, such as a failure description if the state is FAILED.
         */
        stateMessage?: string | null;
        /**
         * Output only. The time when the batch entered a current state.
         */
        stateTime?: string | null;
        /**
         * Output only. A batch UUID (Unique Universal Identifier). The service generates this value when it creates the batch.
         */
        uuid?: string | null;
    }
    /**
     * Metadata describing the Batch operation.
     */
    export interface Schema$BatchOperationMetadata {
        /**
         * Name of the batch for the operation.
         */
        batch?: string | null;
        /**
         * Batch UUID for the operation.
         */
        batchUuid?: string | null;
        /**
         * The time when the operation was created.
         */
        createTime?: string | null;
        /**
         * Short description of the operation.
         */
        description?: string | null;
        /**
         * The time when the operation finished.
         */
        doneTime?: string | null;
        /**
         * Labels associated with the operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The operation type.
         */
        operationType?: string | null;
        /**
         * Warnings encountered during operation execution.
         */
        warnings?: string[] | null;
    }
    /**
     * Associates members, or principals, with a role.
     */
    export interface Schema$Binding {
        /**
         * The condition that is associated with this binding.If the condition evaluates to true, then this binding applies to the current request.If the condition evaluates to false, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the principals in this binding.To learn which resources support conditions in their IAM policies, see the IAM documentation (https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$Expr;
        /**
         * Specifies the principals requesting access for a Google Cloud resource. members can have the following values: allUsers: A special identifier that represents anyone who is on the internet; with or without a Google account. allAuthenticatedUsers: A special identifier that represents anyone who is authenticated with a Google account or a service account. Does not include identities that come from external identity providers (IdPs) through identity federation. user:{emailid\}: An email address that represents a specific Google account. For example, alice@example.com . serviceAccount:{emailid\}: An email address that represents a Google service account. For example, my-other-app@appspot.gserviceaccount.com. serviceAccount:{projectid\}.svc.id.goog[{namespace\}/{kubernetes-sa\}]: An identifier for a Kubernetes service account (https://cloud.google.com/kubernetes-engine/docs/how-to/kubernetes-service-accounts). For example, my-project.svc.id.goog[my-namespace/my-kubernetes-sa]. group:{emailid\}: An email address that represents a Google group. For example, admins@example.com. domain:{domain\}: The G Suite domain (primary) that represents all the users of that domain. For example, google.com or example.com. principal://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/subject/{subject_attribute_value\}: A single identity in a workforce identity pool. principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/group/{group_id\}: All workforce identities in a group. principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/attribute.{attribute_name\}/{attribute_value\}: All workforce identities with a specific attribute value. principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/x: All identities in a workforce identity pool. principal://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/subject/{subject_attribute_value\}: A single identity in a workload identity pool. principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/group/{group_id\}: A workload identity pool group. principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/attribute.{attribute_name\}/{attribute_value\}: All identities in a workload identity pool with a certain attribute. principalSet://iam.googleapis.com/projects/{project_number\}/locations/global/workloadIdentityPools/{pool_id\}/x: All identities in a workload identity pool. deleted:user:{emailid\}?uid={uniqueid\}: An email address (plus unique identifier) representing a user that has been recently deleted. For example, alice@example.com?uid=123456789012345678901. If the user is recovered, this value reverts to user:{emailid\} and the recovered user retains the role in the binding. deleted:serviceAccount:{emailid\}?uid={uniqueid\}: An email address (plus unique identifier) representing a service account that has been recently deleted. For example, my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901. If the service account is undeleted, this value reverts to serviceAccount:{emailid\} and the undeleted service account retains the role in the binding. deleted:group:{emailid\}?uid={uniqueid\}: An email address (plus unique identifier) representing a Google group that has been recently deleted. For example, admins@example.com?uid=123456789012345678901. If the group is recovered, this value reverts to group:{emailid\} and the recovered group retains the role in the binding. deleted:principal://iam.googleapis.com/locations/global/workforcePools/{pool_id\}/subject/{subject_attribute_value\}: Deleted single identity in a workforce identity pool. For example, deleted:principal://iam.googleapis.com/locations/global/workforcePools/my-pool-id/subject/my-subject-attribute-value.
         */
        members?: string[] | null;
        /**
         * Role that is assigned to the list of members, or principals. For example, roles/viewer, roles/editor, or roles/owner.For an overview of the IAM roles and permissions, see the IAM documentation (https://cloud.google.com/iam/docs/roles-overview). For a list of the available pre-defined roles, see here (https://cloud.google.com/iam/docs/understanding-roles).
         */
        role?: string | null;
    }
    /**
     * Native Build Info
     */
    export interface Schema$BuildInfo {
        /**
         * Optional. Build key.
         */
        buildKey?: string | null;
        /**
         * Optional. Build value.
         */
        buildValue?: string | null;
    }
    /**
     * A request to cancel a job.
     */
    export interface Schema$CancelJobRequest {
    }
    /**
     * Describes the identifying information, config, and status of a Dataproc cluster
     */
    export interface Schema$Cluster {
        /**
         * Required. The cluster name, which must be unique within a project. The name must start with a lowercase letter, and can contain up to 51 lowercase letters, numbers, and hyphens. It cannot end with a hyphen. The name of a deleted cluster can be reused.
         */
        clusterName?: string | null;
        /**
         * Output only. A cluster UUID (Unique Universal Identifier). Dataproc generates this value when it creates the cluster.
         */
        clusterUuid?: string | null;
        /**
         * Optional. The cluster config for a cluster of Compute Engine Instances. Note that Dataproc may set default values, and values may change when clusters are updated.Exactly one of ClusterConfig or VirtualClusterConfig must be specified.
         */
        config?: Schema$ClusterConfig;
        /**
         * Optional. The labels to associate with this cluster. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a cluster.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Contains cluster daemon metrics such as HDFS and YARN stats.Beta Feature: This report is available for testing purposes only. It may be changed before final release.
         */
        metrics?: Schema$ClusterMetrics;
        /**
         * Required. The Google Cloud Platform project ID that the cluster belongs to.
         */
        projectId?: string | null;
        /**
         * Output only. Cluster status.
         */
        status?: Schema$ClusterStatus;
        /**
         * Output only. The previous cluster status.
         */
        statusHistory?: Schema$ClusterStatus[];
        /**
         * Optional. The virtual cluster config is used when creating a Dataproc cluster that does not directly control the underlying compute resources, for example, when creating a Dataproc-on-GKE cluster (https://cloud.google.com/dataproc/docs/guides/dpgke/dataproc-gke-overview). Dataproc may set default values, and values may change when clusters are updated. Exactly one of config or virtual_cluster_config must be specified.
         */
        virtualClusterConfig?: Schema$VirtualClusterConfig;
    }
    /**
     * The cluster config.
     */
    export interface Schema$ClusterConfig {
        /**
         * Optional. Autoscaling config for the policy associated with the cluster. Cluster does not autoscale if this field is unset.
         */
        autoscalingConfig?: Schema$AutoscalingConfig;
        /**
         * Optional. The node group settings.
         */
        auxiliaryNodeGroups?: Schema$AuxiliaryNodeGroup[];
        /**
         * Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, Cloud Dataproc will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see Dataproc staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.
         */
        configBucket?: string | null;
        /**
         * Optional. The config for Dataproc metrics.
         */
        dataprocMetricConfig?: Schema$DataprocMetricConfig;
        /**
         * Optional. Encryption settings for the cluster.
         */
        encryptionConfig?: Schema$EncryptionConfig;
        /**
         * Optional. Port/endpoint configuration for this cluster
         */
        endpointConfig?: Schema$EndpointConfig;
        /**
         * Optional. The shared Compute Engine config settings for all instances in a cluster.
         */
        gceClusterConfig?: Schema$GceClusterConfig;
        /**
         * Optional. BETA. The Kubernetes Engine config for Dataproc clusters deployed to The Kubernetes Engine config for Dataproc clusters deployed to Kubernetes. These config settings are mutually exclusive with Compute Engine-based options, such as gce_cluster_config, master_config, worker_config, secondary_worker_config, and autoscaling_config.
         */
        gkeClusterConfig?: Schema$GkeClusterConfig;
        /**
         * Optional. Commands to execute on each node after config is completed. By default, executables are run on master and all worker nodes. You can test a node's role metadata to run an executable on a master or worker node, as shown below using curl (you can also use wget): ROLE=$(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/dataproc-role) if [[ "${ROLE\}" == 'Master' ]]; then ... master specific actions ... else ... worker specific actions ... fi
         */
        initializationActions?: Schema$NodeInitializationAction[];
        /**
         * Optional. Lifecycle setting for the cluster.
         */
        lifecycleConfig?: Schema$LifecycleConfig;
        /**
         * Optional. The Compute Engine config settings for the cluster's master instance.
         */
        masterConfig?: Schema$InstanceGroupConfig;
        /**
         * Optional. Metastore configuration.
         */
        metastoreConfig?: Schema$MetastoreConfig;
        /**
         * Optional. The Compute Engine config settings for a cluster's secondary worker instances
         */
        secondaryWorkerConfig?: Schema$InstanceGroupConfig;
        /**
         * Optional. Security settings for the cluster.
         */
        securityConfig?: Schema$SecurityConfig;
        /**
         * Optional. The config settings for cluster software.
         */
        softwareConfig?: Schema$SoftwareConfig;
        /**
         * Optional. A Cloud Storage bucket used to store ephemeral cluster and jobs data, such as Spark and MapReduce history files. If you do not specify a temp bucket, Dataproc will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's temp bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket. The default bucket has a TTL of 90 days, but you can use any TTL (or none) if you specify a bucket (see Dataproc staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.
         */
        tempBucket?: string | null;
        /**
         * Optional. The Compute Engine config settings for the cluster's worker instances.
         */
        workerConfig?: Schema$InstanceGroupConfig;
    }
    /**
     * Contains cluster daemon metrics, such as HDFS and YARN stats.Beta Feature: This report is available for testing purposes only. It may be changed before final release.
     */
    export interface Schema$ClusterMetrics {
        /**
         * The HDFS metrics.
         */
        hdfsMetrics?: {
            [key: string]: string;
        } | null;
        /**
         * YARN metrics.
         */
        yarnMetrics?: {
            [key: string]: string;
        } | null;
    }
    /**
     * The cluster operation triggered by a workflow.
     */
    export interface Schema$ClusterOperation {
        /**
         * Output only. Indicates the operation is done.
         */
        done?: boolean | null;
        /**
         * Output only. Error, if operation failed.
         */
        error?: string | null;
        /**
         * Output only. The id of the cluster operation.
         */
        operationId?: string | null;
    }
    /**
     * Metadata describing the operation.
     */
    export interface Schema$ClusterOperationMetadata {
        /**
         * Output only. Child operation ids
         */
        childOperationIds?: string[] | null;
        /**
         * Output only. Name of the cluster for the operation.
         */
        clusterName?: string | null;
        /**
         * Output only. Cluster UUID for the operation.
         */
        clusterUuid?: string | null;
        /**
         * Output only. Short description of operation.
         */
        description?: string | null;
        /**
         * Output only. Labels associated with the operation
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The operation type.
         */
        operationType?: string | null;
        /**
         * Output only. Current operation status.
         */
        status?: Schema$ClusterOperationStatus;
        /**
         * Output only. The previous operation status.
         */
        statusHistory?: Schema$ClusterOperationStatus[];
        /**
         * Output only. Errors encountered during operation execution.
         */
        warnings?: string[] | null;
    }
    /**
     * The status of the operation.
     */
    export interface Schema$ClusterOperationStatus {
        /**
         * Output only. A message containing any operation metadata details.
         */
        details?: string | null;
        /**
         * Output only. A message containing the detailed operation state.
         */
        innerState?: string | null;
        /**
         * Output only. A message containing the operation state.
         */
        state?: string | null;
        /**
         * Output only. The time this state was entered.
         */
        stateStartTime?: string | null;
    }
    /**
     * A selector that chooses target cluster for jobs based on metadata.
     */
    export interface Schema$ClusterSelector {
        /**
         * Required. The cluster labels. Cluster must have all labels to match.
         */
        clusterLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The zone where workflow process executes. This parameter does not affect the selection of the cluster.If unspecified, the zone of the first cluster matching the selector is used.
         */
        zone?: string | null;
    }
    /**
     * The status of a cluster and its instances.
     */
    export interface Schema$ClusterStatus {
        /**
         * Optional. Output only. Details of cluster's state.
         */
        detail?: string | null;
        /**
         * Output only. The cluster's state.
         */
        state?: string | null;
        /**
         * Output only. Time when this state was entered (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        stateStartTime?: string | null;
        /**
         * Output only. Additional state information that includes status reported by the agent.
         */
        substate?: string | null;
    }
    /**
     * Cluster to be repaired
     */
    export interface Schema$ClusterToRepair {
        /**
         * Required. Repair action to take on the cluster resource.
         */
        clusterRepairAction?: string | null;
    }
    /**
     * Confidential Instance Config for clusters using Confidential VMs (https://cloud.google.com/compute/confidential-vm/docs)
     */
    export interface Schema$ConfidentialInstanceConfig {
        /**
         * Optional. Defines whether the instance should have confidential compute enabled.
         */
        enableConfidentialCompute?: boolean | null;
    }
    /**
     * Consolidated summary about executors used by the application.
     */
    export interface Schema$ConsolidatedExecutorSummary {
        activeTasks?: number | null;
        completedTasks?: number | null;
        count?: number | null;
        diskUsed?: string | null;
        failedTasks?: number | null;
        isExcluded?: number | null;
        maxMemory?: string | null;
        memoryMetrics?: Schema$MemoryMetrics;
        memoryUsed?: string | null;
        rddBlocks?: number | null;
        totalCores?: number | null;
        totalDurationMillis?: string | null;
        totalGcTimeMillis?: string | null;
        totalInputBytes?: string | null;
        totalShuffleRead?: string | null;
        totalShuffleWrite?: string | null;
        totalTasks?: number | null;
    }
    /**
     * Dataproc metric config.
     */
    export interface Schema$DataprocMetricConfig {
        /**
         * Required. Metrics sources to enable.
         */
        metrics?: Schema$Metric[];
    }
    /**
     * A request to collect cluster diagnostic information.
     */
    export interface Schema$DiagnoseClusterRequest {
        /**
         * Optional. Time interval in which diagnosis should be carried out on the cluster.
         */
        diagnosisInterval?: Schema$Interval;
        /**
         * Optional. DEPRECATED Specifies the job on which diagnosis is to be performed. Format: projects/{project\}/regions/{region\}/jobs/{job\}
         */
        job?: string | null;
        /**
         * Optional. Specifies a list of jobs on which diagnosis is to be performed. Format: projects/{project\}/regions/{region\}/jobs/{job\}
         */
        jobs?: string[] | null;
        /**
         * Optional. (Optional) The access type to the diagnostic tarball. If not specified, falls back to default access of the bucket
         */
        tarballAccess?: string | null;
        /**
         * Optional. (Optional) The output Cloud Storage directory for the diagnostic tarball. If not specified, a task-specific directory in the cluster's staging bucket will be used.
         */
        tarballGcsDir?: string | null;
        /**
         * Optional. DEPRECATED Specifies the yarn application on which diagnosis is to be performed.
         */
        yarnApplicationId?: string | null;
        /**
         * Optional. Specifies a list of yarn applications on which diagnosis is to be performed.
         */
        yarnApplicationIds?: string[] | null;
    }
    /**
     * The location of diagnostic output.
     */
    export interface Schema$DiagnoseClusterResults {
        /**
         * Output only. The Cloud Storage URI of the diagnostic output. The output report is a plain text file with a summary of collected diagnostics.
         */
        outputUri?: string | null;
    }
    /**
     * Specifies the config of disk options for a group of VM instances.
     */
    export interface Schema$DiskConfig {
        /**
         * Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.
         */
        bootDiskProvisionedIops?: string | null;
        /**
         * Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.
         */
        bootDiskProvisionedThroughput?: string | null;
        /**
         * Optional. Size in GB of the boot disk (default is 500GB).
         */
        bootDiskSizeGb?: number | null;
        /**
         * Optional. Type of the boot disk (default is "pd-standard"). Valid values: "pd-balanced" (Persistent Disk Balanced Solid State Drive), "pd-ssd" (Persistent Disk Solid State Drive), or "pd-standard" (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).
         */
        bootDiskType?: string | null;
        /**
         * Optional. Interface type of local SSDs (default is "scsi"). Valid values: "scsi" (Small Computer System Interface), "nvme" (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).
         */
        localSsdInterface?: string | null;
        /**
         * Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.
         */
        numLocalSsds?: number | null;
    }
    /**
     * Driver scheduling configuration.
     */
    export interface Schema$DriverSchedulingConfig {
        /**
         * Required. The amount of memory in MB the driver is requesting.
         */
        memoryMb?: number | null;
        /**
         * Required. The number of vCPUs the driver is requesting.
         */
        vcores?: number | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Encryption settings for the cluster.
     */
    export interface Schema$EncryptionConfig {
        /**
         * Optional. The Cloud KMS key resource name to use for persistent disk encryption for all instances in the cluster. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.
         */
        gcePdKmsKeyName?: string | null;
        /**
         * Optional. The Cloud KMS key resource name to use for cluster persistent disk and job argument encryption. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.When this key resource name is provided, the following job arguments of the following job types submitted to the cluster are encrypted using CMEK: FlinkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/FlinkJob) HadoopJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/HadoopJob) SparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkJob) SparkRJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkRJob) PySparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/PySparkJob) SparkSqlJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkSqlJob) scriptVariables and queryList.queries HiveJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/HiveJob) scriptVariables and queryList.queries PigJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PigJob) scriptVariables and queryList.queries PrestoJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PrestoJob) scriptVariables and queryList.queries
         */
        kmsKey?: string | null;
    }
    /**
     * Endpoint config for this cluster
     */
    export interface Schema$EndpointConfig {
        /**
         * Optional. If true, enable http access to specific ports on the cluster from external sources. Defaults to false.
         */
        enableHttpPortAccess?: boolean | null;
        /**
         * Output only. The map of port descriptions to URLs. Will only be populated if enable_http_port_access is true.
         */
        httpPorts?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Environment configuration for a workload.
     */
    export interface Schema$EnvironmentConfig {
        /**
         * Optional. Execution configuration for a workload.
         */
        executionConfig?: Schema$ExecutionConfig;
        /**
         * Optional. Peripherals configuration that workload has access to.
         */
        peripheralsConfig?: Schema$PeripheralsConfig;
    }
    /**
     * Execution configuration for a workload.
     */
    export interface Schema$ExecutionConfig {
        /**
         * Optional. Authentication configuration used to set the default identity for the workload execution. The config specifies the type of identity (service account or user) that will be used by workloads to access resources on the project(s).
         */
        authenticationConfig?: Schema$AuthenticationConfig;
        /**
         * Optional. Applies to sessions only. The duration to keep the session alive while it's idling. Exceeding this threshold causes the session to terminate. This field cannot be set on a batch workload. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)). Defaults to 1 hour if not set. If both ttl and idle_ttl are specified for an interactive session, the conditions are treated as OR conditions: the workload will be terminated when it has been idle for idle_ttl or when ttl has been exceeded, whichever occurs first.
         */
        idleTtl?: string | null;
        /**
         * Optional. The Cloud KMS key to use for encryption.
         */
        kmsKey?: string | null;
        /**
         * Optional. Tags used for network traffic control.
         */
        networkTags?: string[] | null;
        /**
         * Optional. Network URI to connect workload to.
         */
        networkUri?: string | null;
        /**
         * Optional. Service account that used to execute workload.
         */
        serviceAccount?: string | null;
        /**
         * Optional. A Cloud Storage bucket used to stage workload dependencies, config files, and store workload output and other ephemeral data, such as Spark history files. If you do not specify a staging bucket, Cloud Dataproc will determine a Cloud Storage location according to the region where your workload is running, and then create and manage project-level, per-location staging and temporary buckets. This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.
         */
        stagingBucket?: string | null;
        /**
         * Optional. Subnetwork URI to connect workload to.
         */
        subnetworkUri?: string | null;
        /**
         * Optional. The duration after which the workload will be terminated, specified as the JSON representation for Duration (https://protobuf.dev/programming-guides/proto3/#json). When the workload exceeds this duration, it will be unconditionally terminated without waiting for ongoing work to finish. If ttl is not specified for a batch workload, the workload will be allowed to run until it exits naturally (or run forever without exiting). If ttl is not specified for an interactive session, it defaults to 24 hours. If ttl is not specified for a batch that uses 2.1+ runtime version, it defaults to 4 hours. Minimum value is 10 minutes; maximum value is 14 days. If both ttl and idle_ttl are specified (for an interactive session), the conditions are treated as OR conditions: the workload will be terminated when it has been idle for idle_ttl or when ttl has been exceeded, whichever occurs first.
         */
        ttl?: string | null;
    }
    export interface Schema$ExecutorMetrics {
        metrics?: {
            [key: string]: string;
        } | null;
    }
    export interface Schema$ExecutorMetricsDistributions {
        diskBytesSpilled?: number[] | null;
        failedTasks?: number[] | null;
        inputBytes?: number[] | null;
        inputRecords?: number[] | null;
        killedTasks?: number[] | null;
        memoryBytesSpilled?: number[] | null;
        outputBytes?: number[] | null;
        outputRecords?: number[] | null;
        peakMemoryMetrics?: Schema$ExecutorPeakMetricsDistributions;
        quantiles?: number[] | null;
        shuffleRead?: number[] | null;
        shuffleReadRecords?: number[] | null;
        shuffleWrite?: number[] | null;
        shuffleWriteRecords?: number[] | null;
        succeededTasks?: number[] | null;
        taskTimeMillis?: number[] | null;
    }
    export interface Schema$ExecutorPeakMetricsDistributions {
        executorMetrics?: Schema$ExecutorMetrics[];
        quantiles?: number[] | null;
    }
    /**
     * Resources used per executor used by the application.
     */
    export interface Schema$ExecutorResourceRequest {
        amount?: string | null;
        discoveryScript?: string | null;
        resourceName?: string | null;
        vendor?: string | null;
    }
    /**
     * Executor resources consumed by a stage.
     */
    export interface Schema$ExecutorStageSummary {
        diskBytesSpilled?: string | null;
        executorId?: string | null;
        failedTasks?: number | null;
        inputBytes?: string | null;
        inputRecords?: string | null;
        isExcludedForStage?: boolean | null;
        killedTasks?: number | null;
        memoryBytesSpilled?: string | null;
        outputBytes?: string | null;
        outputRecords?: string | null;
        peakMemoryMetrics?: Schema$ExecutorMetrics;
        shuffleRead?: string | null;
        shuffleReadRecords?: string | null;
        shuffleWrite?: string | null;
        shuffleWriteRecords?: string | null;
        stageAttemptId?: number | null;
        stageId?: string | null;
        succeededTasks?: number | null;
        taskTimeMillis?: string | null;
    }
    /**
     * Details about executors used by the application.
     */
    export interface Schema$ExecutorSummary {
        activeTasks?: number | null;
        addTime?: string | null;
        attributes?: {
            [key: string]: string;
        } | null;
        completedTasks?: number | null;
        diskUsed?: string | null;
        excludedInStages?: string[] | null;
        executorId?: string | null;
        executorLogs?: {
            [key: string]: string;
        } | null;
        failedTasks?: number | null;
        hostPort?: string | null;
        isActive?: boolean | null;
        isExcluded?: boolean | null;
        maxMemory?: string | null;
        maxTasks?: number | null;
        memoryMetrics?: Schema$MemoryMetrics;
        memoryUsed?: string | null;
        peakMemoryMetrics?: Schema$ExecutorMetrics;
        rddBlocks?: number | null;
        removeReason?: string | null;
        removeTime?: string | null;
        resourceProfileId?: number | null;
        resources?: {
            [key: string]: Schema$ResourceInformation;
        } | null;
        totalCores?: number | null;
        totalDurationMillis?: string | null;
        totalGcTimeMillis?: string | null;
        totalInputBytes?: string | null;
        totalShuffleRead?: string | null;
        totalShuffleWrite?: string | null;
        totalTasks?: number | null;
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec.Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
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
     * Native SQL Execution Data
     */
    export interface Schema$FallbackReason {
        /**
         * Optional. Fallback node information.
         */
        fallbackNode?: string | null;
        /**
         * Optional. Fallback to Spark reason.
         */
        fallbackReason?: string | null;
    }
    /**
     * A Dataproc job for running Apache Flink applications on YARN.
     */
    export interface Schema$FlinkJob {
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision might occur that causes an incorrect job submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of jar files to add to the CLASSPATHs of the Flink driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * The name of the driver's main class. The jar file that contains the class must be in the default CLASSPATH or specified in jarFileUris.
         */
        mainClass?: string | null;
        /**
         * The HCFS URI of the jar file that contains the main class.
         */
        mainJarFileUri?: string | null;
        /**
         * Optional. A mapping of property names to values, used to configure Flink. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/flink/conf/flink-defaults.conf and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. HCFS URI of the savepoint, which contains the last saved progress for starting the current job.
         */
        savepointUri?: string | null;
    }
    /**
     * Common config settings for resources of Compute Engine cluster instances, applicable to all instances in the cluster.
     */
    export interface Schema$GceClusterConfig {
        /**
         * Optional. Confidential Instance Config for clusters using Confidential VMs (https://cloud.google.com/compute/confidential-vm/docs).
         */
        confidentialInstanceConfig?: Schema$ConfidentialInstanceConfig;
        /**
         * Optional. This setting applies to subnetwork-enabled networks. It is set to true by default in clusters created with image versions 2.2.x.When set to true: All cluster VMs have internal IP addresses. Google Private Access (https://cloud.google.com/vpc/docs/private-google-access) must be enabled to access Dataproc and other Google Cloud APIs. Off-cluster dependencies must be configured to be accessible without external IP addresses.When set to false: Cluster VMs are not restricted to internal IP addresses. Ephemeral external IP addresses are assigned to each cluster VM.
         */
        internalIpOnly?: boolean | null;
        /**
         * Optional. The Compute Engine metadata entries to add to all instances (see Project and instance metadata (https://cloud.google.com/compute/docs/storing-retrieving-metadata#project_and_instance_metadata)).
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The Compute Engine network to be used for machine communications. Cannot be specified with subnetwork_uri. If neither network_uri nor subnetwork_uri is specified, the "default" network of the project is used, if it exists. Cannot be a "Custom Subnet Network" (see Using Subnetworks (https://cloud.google.com/compute/docs/subnetworks) for more information).A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/networks/default projects/[project_id]/global/networks/default default
         */
        networkUri?: string | null;
        /**
         * Optional. Node Group Affinity for sole-tenant clusters.
         */
        nodeGroupAffinity?: Schema$NodeGroupAffinity;
        /**
         * Optional. The type of IPv6 access for a cluster.
         */
        privateIpv6GoogleAccess?: string | null;
        /**
         * Optional. Reservation Affinity for consuming Zonal reservation.
         */
        reservationAffinity?: Schema$ReservationAffinity;
        /**
         * Optional. Resource manager tags (https://cloud.google.com/resource-manager/docs/tags/tags-creating-and-managing) to add to all instances (see Use secure tags in Dataproc (https://cloud.google.com/dataproc/docs/guides/attach-secure-tags)).
         */
        resourceManagerTags?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The Dataproc service account (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/service-accounts#service_accounts_in_dataproc) (also see VM Data Plane identity (https://cloud.google.com/dataproc/docs/concepts/iam/dataproc-principals#vm_service_account_data_plane_identity)) used by Dataproc cluster VM instances to access Google Cloud Platform services.If not specified, the Compute Engine default service account (https://cloud.google.com/compute/docs/access/service-accounts#default_service_account) is used.
         */
        serviceAccount?: string | null;
        /**
         * Optional. The URIs of service account scopes to be included in Compute Engine instances. The following base set of scopes is always included: https://www.googleapis.com/auth/cloud.useraccounts.readonly https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/logging.writeIf no scopes are specified, the following defaults are also provided: https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigtable.admin.table https://www.googleapis.com/auth/bigtable.data https://www.googleapis.com/auth/devstorage.full_control
         */
        serviceAccountScopes?: string[] | null;
        /**
         * Optional. Shielded Instance Config for clusters using Compute Engine Shielded VMs (https://cloud.google.com/security/shielded-cloud/shielded-vm).
         */
        shieldedInstanceConfig?: Schema$ShieldedInstanceConfig;
        /**
         * Optional. The Compute Engine subnetwork to be used for machine communications. Cannot be specified with network_uri.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/regions/[region]/subnetworks/sub0 projects/[project_id]/regions/[region]/subnetworks/sub0 sub0
         */
        subnetworkUri?: string | null;
        /**
         * The Compute Engine network tags to add to all instances (see Tagging instances (https://cloud.google.com/vpc/docs/add-remove-network-tags)).
         */
        tags?: string[] | null;
        /**
         * Optional. The Compute Engine zone where the Dataproc cluster will be located. If omitted, the service will pick a zone in the cluster's Compute Engine region. On a get request, zone will always be present.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone] projects/[project_id]/zones/[zone] [zone]
         */
        zoneUri?: string | null;
    }
    /**
     * Request message for GetIamPolicy method.
     */
    export interface Schema$GetIamPolicyRequest {
        /**
         * OPTIONAL: A GetPolicyOptions object for specifying options to GetIamPolicy.
         */
        options?: Schema$GetPolicyOptions;
    }
    /**
     * Encapsulates settings provided to GetIamPolicy.
     */
    export interface Schema$GetPolicyOptions {
        /**
         * Optional. The maximum policy version that will be used to format the policy.Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected.Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset.The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1.To learn which resources support conditions in their IAM policies, see the IAM documentation (https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        requestedPolicyVersion?: number | null;
    }
    /**
     * The cluster's GKE config.
     */
    export interface Schema$GkeClusterConfig {
        /**
         * Optional. A target GKE cluster to deploy to. It must be in the same project and region as the Dataproc cluster (the GKE cluster can be zonal or regional). Format: 'projects/{project\}/locations/{location\}/clusters/{cluster_id\}'
         */
        gkeClusterTarget?: string | null;
        /**
         * Optional. Deprecated. Use gkeClusterTarget. Used only for the deprecated beta. A target for the deployment.
         */
        namespacedGkeDeploymentTarget?: Schema$NamespacedGkeDeploymentTarget;
        /**
         * Optional. GKE node pools where workloads will be scheduled. At least one node pool must be assigned the DEFAULT GkeNodePoolTarget.Role. If a GkeNodePoolTarget is not specified, Dataproc constructs a DEFAULT GkeNodePoolTarget. Each role can be given to only one GkeNodePoolTarget. All node pools must have the same location settings.
         */
        nodePoolTarget?: Schema$GkeNodePoolTarget[];
    }
    /**
     * Parameters that describe cluster nodes.
     */
    export interface Schema$GkeNodeConfig {
        /**
         * Optional. A list of hardware accelerators (https://cloud.google.com/compute/docs/gpus) to attach to each node.
         */
        accelerators?: Schema$GkeNodePoolAcceleratorConfig[];
        /**
         * Optional. The Customer Managed Encryption Key (CMEK) (https://cloud.google.com/kubernetes-engine/docs/how-to/using-cmek) used to encrypt the boot disk attached to each node in the node pool. Specify the key using the following format: projects/{project\}/locations/{location\}/keyRings/{key_ring\}/cryptoKeys/{crypto_key\}
         */
        bootDiskKmsKey?: string | null;
        /**
         * Optional. The number of local SSD disks to attach to the node, which is limited by the maximum number of disks allowable per zone (see Adding Local SSDs (https://cloud.google.com/compute/docs/disks/local-ssd)).
         */
        localSsdCount?: number | null;
        /**
         * Optional. The name of a Compute Engine machine type (https://cloud.google.com/compute/docs/machine-types).
         */
        machineType?: string | null;
        /**
         * Optional. Minimum CPU platform (https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform) to be used by this instance. The instance may be scheduled on the specified or a newer CPU platform. Specify the friendly names of CPU platforms, such as "Intel Haswell"` or Intel Sandy Bridge".
         */
        minCpuPlatform?: string | null;
        /**
         * Optional. Whether the nodes are created as legacy preemptible VM instances (https://cloud.google.com/compute/docs/instances/preemptible). Also see Spot VMs, preemptible VM instances without a maximum lifetime. Legacy and Spot preemptible nodes cannot be used in a node pool with the CONTROLLER role or in the DEFAULT node pool if the CONTROLLER role is not assigned (the DEFAULT node pool will assume the CONTROLLER role).
         */
        preemptible?: boolean | null;
        /**
         * Optional. Whether the nodes are created as Spot VM instances (https://cloud.google.com/compute/docs/instances/spot). Spot VMs are the latest update to legacy preemptible VMs. Spot VMs do not have a maximum lifetime. Legacy and Spot preemptible nodes cannot be used in a node pool with the CONTROLLER role or in the DEFAULT node pool if the CONTROLLER role is not assigned (the DEFAULT node pool will assume the CONTROLLER role).
         */
        spot?: boolean | null;
    }
    /**
     * A GkeNodeConfigAcceleratorConfig represents a Hardware Accelerator request for a node pool.
     */
    export interface Schema$GkeNodePoolAcceleratorConfig {
        /**
         * The number of accelerator cards exposed to an instance.
         */
        acceleratorCount?: string | null;
        /**
         * The accelerator type resource namename (see GPUs on Compute Engine).
         */
        acceleratorType?: string | null;
        /**
         * Size of partitions to create on the GPU. Valid values are described in the NVIDIA mig user guide (https://docs.nvidia.com/datacenter/tesla/mig-user-guide/#partitioning).
         */
        gpuPartitionSize?: string | null;
    }
    /**
     * GkeNodePoolAutoscaling contains information the cluster autoscaler needs to adjust the size of the node pool to the current cluster usage.
     */
    export interface Schema$GkeNodePoolAutoscalingConfig {
        /**
         * The maximum number of nodes in the node pool. Must be \>= min_node_count, and must be \> 0. Note: Quota must be sufficient to scale up the cluster.
         */
        maxNodeCount?: number | null;
        /**
         * The minimum number of nodes in the node pool. Must be \>= 0 and <= max_node_count.
         */
        minNodeCount?: number | null;
    }
    /**
     * The configuration of a GKE node pool used by a Dataproc-on-GKE cluster (https://cloud.google.com/dataproc/docs/concepts/jobs/dataproc-gke#create-a-dataproc-on-gke-cluster).
     */
    export interface Schema$GkeNodePoolConfig {
        /**
         * Optional. The autoscaler configuration for this node pool. The autoscaler is enabled only when a valid configuration is present.
         */
        autoscaling?: Schema$GkeNodePoolAutoscalingConfig;
        /**
         * Optional. The node pool configuration.
         */
        config?: Schema$GkeNodeConfig;
        /**
         * Optional. The list of Compute Engine zones (https://cloud.google.com/compute/docs/zones#available) where node pool nodes associated with a Dataproc on GKE virtual cluster will be located.Note: All node pools associated with a virtual cluster must be located in the same region as the virtual cluster, and they must be located in the same zone within that region.If a location is not specified during node pool creation, Dataproc on GKE will choose the zone.
         */
        locations?: string[] | null;
    }
    /**
     * GKE node pools that Dataproc workloads run on.
     */
    export interface Schema$GkeNodePoolTarget {
        /**
         * Required. The target GKE node pool. Format: 'projects/{project\}/locations/{location\}/clusters/{cluster\}/nodePools/{node_pool\}'
         */
        nodePool?: string | null;
        /**
         * Input only. The configuration for the GKE node pool.If specified, Dataproc attempts to create a node pool with the specified shape. If one with the same name already exists, it is verified against all specified fields. If a field differs, the virtual cluster creation will fail.If omitted, any node pool with the specified name is used. If a node pool with the specified name does not exist, Dataproc create a node pool with default values.This is an input only field. It will not be returned by the API.
         */
        nodePoolConfig?: Schema$GkeNodePoolConfig;
        /**
         * Required. The roles associated with the GKE node pool.
         */
        roles?: string[] | null;
    }
    /**
     * Encryption settings for encrypting workflow template job arguments.
     */
    export interface Schema$GoogleCloudDataprocV1WorkflowTemplateEncryptionConfig {
        /**
         * Optional. The Cloud KMS key name to use for encrypting workflow template job arguments.When this this key is provided, the following workflow template job arguments (https://cloud.google.com/dataproc/docs/concepts/workflows/use-workflows#adding_jobs_to_a_template), if present, are CMEK encrypted (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_workflow_template_data): FlinkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/FlinkJob) HadoopJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/HadoopJob) SparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkJob) SparkRJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkRJob) PySparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/PySparkJob) SparkSqlJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkSqlJob) scriptVariables and queryList.queries HiveJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/HiveJob) scriptVariables and queryList.queries PigJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PigJob) scriptVariables and queryList.queries PrestoJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PrestoJob) scriptVariables and queryList.queries
         */
        kmsKey?: string | null;
    }
    /**
     * A Dataproc job for running Apache Hadoop MapReduce (https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html) jobs on Apache Hadoop YARN (https://hadoop.apache.org/docs/r2.7.1/hadoop-yarn/hadoop-yarn-site/YARN.html).
     */
    export interface Schema$HadoopJob {
        /**
         * Optional. HCFS URIs of archives to be extracted in the working directory of Hadoop drivers and tasks. Supported file types: .jar, .tar, .tar.gz, .tgz, or .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments, such as -libjars or -Dfoo=bar, that can be set as job properties, since a collision might occur that causes an incorrect job submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS (Hadoop Compatible Filesystem) URIs of files to be copied to the working directory of Hadoop drivers and distributed tasks. Useful for naively parallel tasks.
         */
        fileUris?: string[] | null;
        /**
         * Optional. Jar file URIs to add to the CLASSPATHs of the Hadoop driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * The name of the driver's main class. The jar file containing the class must be in the default CLASSPATH or specified in jar_file_uris.
         */
        mainClass?: string | null;
        /**
         * The HCFS URI of the jar file containing the main class. Examples: 'gs://foo-bucket/analytics-binaries/extract-useful-metrics-mr.jar' 'hdfs:/tmp/test-samples/custom-wordcount.jar' 'file:///home/usr/lib/hadoop-mapreduce/hadoop-mapreduce-examples.jar'
         */
        mainJarFileUri?: string | null;
        /**
         * Optional. A mapping of property names to values, used to configure Hadoop. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/hadoop/conf/x-site and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A Dataproc job for running Apache Hive (https://hive.apache.org/) queries on YARN.
     */
    export interface Schema$HiveJob {
        /**
         * Optional. Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
         */
        continueOnFailure?: boolean | null;
        /**
         * Optional. HCFS URIs of jar files to add to the CLASSPATH of the Hive server and Hadoop MapReduce (MR) tasks. Can contain Hive SerDes and UDFs.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. A mapping of property names and values, used to configure Hive. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/hadoop/conf/x-site.xml, /etc/hive/conf/hive-site.xml, and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * The HCFS URI of the script that contains Hive queries.
         */
        queryFileUri?: string | null;
        /**
         * A list of queries.
         */
        queryList?: Schema$QueryList;
        /**
         * Optional. Mapping of query variable names to values (equivalent to the Hive command: SET name="value";).
         */
        scriptVariables?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Identity related configuration, including service account based secure multi-tenancy user mappings.
     */
    export interface Schema$IdentityConfig {
        /**
         * Required. Map of user to service account.
         */
        userServiceAccountMapping?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A request to inject credentials into a cluster.
     */
    export interface Schema$InjectCredentialsRequest {
        /**
         * Required. The cluster UUID.
         */
        clusterUuid?: string | null;
        /**
         * Required. The encrypted credentials being injected in to the cluster.The client is responsible for encrypting the credentials in a way that is supported by the cluster.A wrapped value is used here so that the actual contents of the encrypted credentials are not written to audit logs.
         */
        credentialsCiphertext?: string | null;
    }
    /**
     * Metrics about the input data read by the task.
     */
    export interface Schema$InputMetrics {
        bytesRead?: string | null;
        recordsRead?: string | null;
    }
    export interface Schema$InputQuantileMetrics {
        bytesRead?: Schema$Quantiles;
        recordsRead?: Schema$Quantiles;
    }
    /**
     * Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.
     */
    export interface Schema$InstanceFlexibilityPolicy {
        /**
         * Optional. List of instance selection options that the group will use when creating new VMs.
         */
        instanceSelectionList?: Schema$InstanceSelection[];
        /**
         * Output only. A list of instance selection results in the group.
         */
        instanceSelectionResults?: Schema$InstanceSelectionResult[];
        /**
         * Optional. Defines how the Group selects the provisioning model to ensure required reliability.
         */
        provisioningModelMix?: Schema$ProvisioningModelMix;
    }
    /**
     * Configuration for the size bounds of an instance group, including its proportional size to other groups.
     */
    export interface Schema$InstanceGroupAutoscalingPolicyConfig {
        /**
         * Required. Maximum number of instances for this group. Required for primary workers. Note that by default, clusters will not use secondary workers. Required for secondary workers if the minimum secondary instances is set.Primary workers - Bounds: [min_instances, ). Secondary workers - Bounds: [min_instances, ). Default: 0.
         */
        maxInstances?: number | null;
        /**
         * Optional. Minimum number of instances for this group.Primary workers - Bounds: 2, max_instances. Default: 2. Secondary workers - Bounds: 0, max_instances. Default: 0.
         */
        minInstances?: number | null;
        /**
         * Optional. Weight for the instance group, which is used to determine the fraction of total workers in the cluster from this instance group. For example, if primary workers have weight 2, and secondary workers have weight 1, the cluster will have approximately 2 primary workers for each secondary worker.The cluster may not reach the specified balance if constrained by min/max bounds or other autoscaling settings. For example, if max_instances for secondary workers is 0, then only primary workers will be added. The cluster can also be out of balance when created.If weight is not set on any instance group, the cluster will default to equal weight for all groups: the cluster will attempt to maintain an equal number of workers in each group within the configured size bounds for each group. If weight is set for one group only, the cluster will default to zero weight on the unset group. For example if weight is set only on primary workers, the cluster will use primary workers only and no secondary workers.
         */
        weight?: number | null;
    }
    /**
     * The config settings for Compute Engine resources in an instance group, such as a master or worker group.
     */
    export interface Schema$InstanceGroupConfig {
        /**
         * Optional. The Compute Engine accelerator configuration for these instances.
         */
        accelerators?: Schema$AcceleratorConfig[];
        /**
         * Optional. Disk option config settings.
         */
        diskConfig?: Schema$DiskConfig;
        /**
         * Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. Dataproc will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.
         */
        imageUri?: string | null;
        /**
         * Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.
         */
        instanceFlexibilityPolicy?: Schema$InstanceFlexibilityPolicy;
        /**
         * Output only. The list of instance names. Dataproc derives the names from cluster_name, num_instances, and the instance group.
         */
        instanceNames?: string[] | null;
        /**
         * Output only. List of references to Compute Engine instances.
         */
        instanceReferences?: Schema$InstanceReference[];
        /**
         * Output only. Specifies that this instance group contains preemptible instances.
         */
        isPreemptible?: boolean | null;
        /**
         * Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using the Dataproc Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement) feature, you must use the short name of the machine type resource, for example, n1-standard-2.
         */
        machineTypeUri?: string | null;
        /**
         * Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.
         */
        managedGroupConfig?: Schema$ManagedGroupConfig;
        /**
         * Optional. Specifies the minimum cpu platform for the Instance Group. See Dataproc -\> Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).
         */
        minCpuPlatform?: string | null;
        /**
         * Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.
         */
        minNumInstances?: number | null;
        /**
         * Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.
         */
        numInstances?: number | null;
        /**
         * Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.
         */
        preemptibility?: string | null;
        /**
         * Optional. Configuration to handle the startup of instances during cluster create and update process.
         */
        startupConfig?: Schema$StartupConfig;
    }
    /**
     * A reference to a Compute Engine instance.
     */
    export interface Schema$InstanceReference {
        /**
         * The unique identifier of the Compute Engine instance.
         */
        instanceId?: string | null;
        /**
         * The user-friendly name of the Compute Engine instance.
         */
        instanceName?: string | null;
        /**
         * The public ECIES key used for sharing data with this instance.
         */
        publicEciesKey?: string | null;
        /**
         * The public RSA key used for sharing data with this instance.
         */
        publicKey?: string | null;
    }
    /**
     * Defines machines types and a rank to which the machines types belong.
     */
    export interface Schema$InstanceSelection {
        /**
         * Optional. Full machine-type names, e.g. "n1-standard-16".
         */
        machineTypes?: string[] | null;
        /**
         * Optional. Preference of this instance selection. Lower number means higher preference. Dataproc will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.
         */
        rank?: number | null;
    }
    /**
     * Defines a mapping from machine types to the number of VMs that are created with each machine type.
     */
    export interface Schema$InstanceSelectionResult {
        /**
         * Output only. Full machine-type names, e.g. "n1-standard-16".
         */
        machineType?: string | null;
        /**
         * Output only. Number of VM provisioned with the machine_type.
         */
        vmCount?: number | null;
    }
    /**
     * A request to instantiate a workflow template.
     */
    export interface Schema$InstantiateWorkflowTemplateRequest {
        /**
         * Optional. Map from parameter names to values that should be used for those parameters. Values may not exceed 1000 characters.
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. A tag that prevents multiple concurrent workflow instances with the same tag from running. This mitigates risk of concurrent instances started due to retries.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The tag must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
        /**
         * Optional. The version of workflow template to instantiate. If specified, the workflow will be instantiated only if the current version of the workflow template has the supplied version.This option cannot be used to instantiate a previous version of workflow template.
         */
        version?: number | null;
    }
    /**
     * Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive).The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time.
     */
    export interface Schema$Interval {
        /**
         * Optional. Exclusive end of the interval.If specified, a Timestamp matching this interval will have to be before the end.
         */
        endTime?: string | null;
        /**
         * Optional. Inclusive start of the interval.If specified, a Timestamp matching this interval will have to be the same or after the start.
         */
        startTime?: string | null;
    }
    /**
     * A Dataproc job resource.
     */
    export interface Schema$Job {
        /**
         * Output only. Indicates whether the job is completed. If the value is false, the job is still in progress. If true, the job is completed, and status.state field will indicate if it was successful, failed, or cancelled.
         */
        done?: boolean | null;
        /**
         * Output only. If present, the location of miscellaneous control files which can be used as part of job setup and handling. If not present, control files might be placed in the same location as driver_output_uri.
         */
        driverControlFilesUri?: string | null;
        /**
         * Output only. A URI pointing to the location of the stdout of the job's driver program.
         */
        driverOutputResourceUri?: string | null;
        /**
         * Optional. Driver scheduling configuration.
         */
        driverSchedulingConfig?: Schema$DriverSchedulingConfig;
        /**
         * Optional. Job is a Flink job.
         */
        flinkJob?: Schema$FlinkJob;
        /**
         * Optional. Job is a Hadoop job.
         */
        hadoopJob?: Schema$HadoopJob;
        /**
         * Optional. Job is a Hive job.
         */
        hiveJob?: Schema$HiveJob;
        /**
         * Output only. A UUID that uniquely identifies a job within the project over time. This is in contrast to a user-settable reference.job_id that might be reused over time.
         */
        jobUuid?: string | null;
        /**
         * Optional. The labels to associate with this job. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a job.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Job is a Pig job.
         */
        pigJob?: Schema$PigJob;
        /**
         * Required. Job information, including how, when, and where to run the job.
         */
        placement?: Schema$JobPlacement;
        /**
         * Optional. Job is a Presto job.
         */
        prestoJob?: Schema$PrestoJob;
        /**
         * Optional. Job is a PySpark job.
         */
        pysparkJob?: Schema$PySparkJob;
        /**
         * Optional. The fully qualified reference to the job, which can be used to obtain the equivalent REST path of the job resource. If this property is not specified when a job is created, the server generates a job_id.
         */
        reference?: Schema$JobReference;
        /**
         * Optional. Job scheduling configuration.
         */
        scheduling?: Schema$JobScheduling;
        /**
         * Optional. Job is a Spark job.
         */
        sparkJob?: Schema$SparkJob;
        /**
         * Optional. Job is a SparkR job.
         */
        sparkRJob?: Schema$SparkRJob;
        /**
         * Optional. Job is a SparkSql job.
         */
        sparkSqlJob?: Schema$SparkSqlJob;
        /**
         * Output only. The job status. Additional application-specific status information might be contained in the type_job and yarn_applications fields.
         */
        status?: Schema$JobStatus;
        /**
         * Output only. The previous job status.
         */
        statusHistory?: Schema$JobStatus[];
        /**
         * Optional. Job is a Trino job.
         */
        trinoJob?: Schema$TrinoJob;
        /**
         * Output only. The collection of YARN applications spun up by this job.Beta Feature: This report is available for testing purposes only. It might be changed before final release.
         */
        yarnApplications?: Schema$YarnApplication[];
    }
    /**
     * Data corresponding to a spark job.
     */
    export interface Schema$JobData {
        completionTime?: string | null;
        description?: string | null;
        jobGroup?: string | null;
        jobId?: string | null;
        killTasksSummary?: {
            [key: string]: number;
        } | null;
        name?: string | null;
        numActiveStages?: number | null;
        numActiveTasks?: number | null;
        numCompletedIndices?: number | null;
        numCompletedStages?: number | null;
        numCompletedTasks?: number | null;
        numFailedStages?: number | null;
        numFailedTasks?: number | null;
        numKilledTasks?: number | null;
        numSkippedStages?: number | null;
        numSkippedTasks?: number | null;
        numTasks?: number | null;
        skippedStages?: number[] | null;
        sqlExecutionId?: string | null;
        stageIds?: string[] | null;
        status?: string | null;
        submissionTime?: string | null;
    }
    /**
     * Job Operation metadata.
     */
    export interface Schema$JobMetadata {
        /**
         * Output only. The job id.
         */
        jobId?: string | null;
        /**
         * Output only. Operation type.
         */
        operationType?: string | null;
        /**
         * Output only. Job submission time.
         */
        startTime?: string | null;
        /**
         * Output only. Most recent job status.
         */
        status?: Schema$JobStatus;
    }
    /**
     * Dataproc job config.
     */
    export interface Schema$JobPlacement {
        /**
         * Optional. Cluster labels to identify a cluster where the job will be submitted.
         */
        clusterLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The name of the cluster where the job will be submitted.
         */
        clusterName?: string | null;
        /**
         * Output only. A cluster UUID generated by the Dataproc service when the job is submitted.
         */
        clusterUuid?: string | null;
    }
    /**
     * Encapsulates the full scoping used to reference a job.
     */
    export interface Schema$JobReference {
        /**
         * Optional. The job ID, which must be unique within the project.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or hyphens (-). The maximum length is 100 characters.If not specified by the caller, the job ID will be provided by the server.
         */
        jobId?: string | null;
        /**
         * Optional. The ID of the Google Cloud Platform project that the job belongs to. If specified, must match the request project ID.
         */
        projectId?: string | null;
    }
    /**
     * Job scheduling options.
     */
    export interface Schema$JobScheduling {
        /**
         * Optional. Maximum number of times per hour a driver can be restarted as a result of driver exiting with non-zero code before job is reported failed.A job might be reported as thrashing if the driver exits with a non-zero code four times within a 10-minute window.Maximum value is 10.Note: This restartable job option is not supported in Dataproc workflow templates (https://cloud.google.com/dataproc/docs/concepts/workflows/using-workflows#adding_jobs_to_a_template).
         */
        maxFailuresPerHour?: number | null;
        /**
         * Optional. Maximum total number of times a driver can be restarted as a result of the driver exiting with a non-zero code. After the maximum number is reached, the job will be reported as failed.Maximum value is 240.Note: Currently, this restartable job option is not supported in Dataproc workflow templates (https://cloud.google.com/dataproc/docs/concepts/workflows/using-workflows#adding_jobs_to_a_template).
         */
        maxFailuresTotal?: number | null;
    }
    /**
     * Data related to Jobs page summary
     */
    export interface Schema$JobsSummary {
        /**
         * Number of active jobs
         */
        activeJobs?: number | null;
        /**
         * Spark Application Id
         */
        applicationId?: string | null;
        /**
         * Attempts info
         */
        attempts?: Schema$ApplicationAttemptInfo[];
        /**
         * Number of completed jobs
         */
        completedJobs?: number | null;
        /**
         * Number of failed jobs
         */
        failedJobs?: number | null;
        /**
         * Spark Scheduling mode
         */
        schedulingMode?: string | null;
    }
    /**
     * Dataproc job status.
     */
    export interface Schema$JobStatus {
        /**
         * Optional. Output only. Job state details, such as an error description if the state is ERROR.
         */
        details?: string | null;
        /**
         * Output only. A state message specifying the overall job state.
         */
        state?: string | null;
        /**
         * Output only. The time when this state was entered.
         */
        stateStartTime?: string | null;
        /**
         * Output only. Additional state information, which includes status reported by the agent.
         */
        substate?: string | null;
    }
    /**
     * Jupyter configuration for an interactive session.
     */
    export interface Schema$JupyterConfig {
        /**
         * Optional. Display name, shown in the Jupyter kernelspec card.
         */
        displayName?: string | null;
        /**
         * Optional. Kernel
         */
        kernel?: string | null;
    }
    /**
     * Specifies Kerberos related configuration.
     */
    export interface Schema$KerberosConfig {
        /**
         * Optional. The admin server (IP or hostname) for the remote trusted realm in a cross realm trust relationship.
         */
        crossRealmTrustAdminServer?: string | null;
        /**
         * Optional. The KDC (IP or hostname) for the remote trusted realm in a cross realm trust relationship.
         */
        crossRealmTrustKdc?: string | null;
        /**
         * Optional. The remote realm the Dataproc on-cluster KDC will trust, should the user enable cross realm trust.
         */
        crossRealmTrustRealm?: string | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the shared password between the on-cluster Kerberos realm and the remote trusted realm, in a cross realm trust relationship.
         */
        crossRealmTrustSharedPasswordUri?: string | null;
        /**
         * Optional. Flag to indicate whether to Kerberize the cluster (default: false). Set this field to true to enable Kerberos on a cluster.
         */
        enableKerberos?: boolean | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the master key of the KDC database.
         */
        kdcDbKeyUri?: string | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided key. For the self-signed certificate, this password is generated by Dataproc.
         */
        keyPasswordUri?: string | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided keystore. For the self-signed certificate, this password is generated by Dataproc.
         */
        keystorePasswordUri?: string | null;
        /**
         * Optional. The Cloud Storage URI of the keystore file used for SSL encryption. If not provided, Dataproc will provide a self-signed certificate.
         */
        keystoreUri?: string | null;
        /**
         * Optional. The URI of the KMS key used to encrypt sensitive files.
         */
        kmsKeyUri?: string | null;
        /**
         * Optional. The name of the on-cluster Kerberos realm. If not specified, the uppercased domain of hostnames will be the realm.
         */
        realm?: string | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the root principal password.
         */
        rootPrincipalPasswordUri?: string | null;
        /**
         * Optional. The lifetime of the ticket granting ticket, in hours. If not specified, or user specifies 0, then default value 10 will be used.
         */
        tgtLifetimeHours?: number | null;
        /**
         * Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided truststore. For the self-signed certificate, this password is generated by Dataproc.
         */
        truststorePasswordUri?: string | null;
        /**
         * Optional. The Cloud Storage URI of the truststore file used for SSL encryption. If not provided, Dataproc will provide a self-signed certificate.
         */
        truststoreUri?: string | null;
    }
    /**
     * The configuration for running the Dataproc cluster on Kubernetes.
     */
    export interface Schema$KubernetesClusterConfig {
        /**
         * Required. The configuration for running the Dataproc cluster on GKE.
         */
        gkeClusterConfig?: Schema$GkeClusterConfig;
        /**
         * Optional. A namespace within the Kubernetes cluster to deploy into. If this namespace does not exist, it is created. If it exists, Dataproc verifies that another Dataproc VirtualCluster is not installed into it. If not specified, the name of the Dataproc Cluster is used.
         */
        kubernetesNamespace?: string | null;
        /**
         * Optional. The software configuration for this Dataproc cluster running on Kubernetes.
         */
        kubernetesSoftwareConfig?: Schema$KubernetesSoftwareConfig;
    }
    /**
     * The software configuration for this Dataproc cluster running on Kubernetes.
     */
    export interface Schema$KubernetesSoftwareConfig {
        /**
         * The components that should be installed in this Dataproc cluster. The key must be a string from the KubernetesComponent enumeration. The value is the version of the software to be installed. At least one entry must be specified.
         */
        componentVersion?: {
            [key: string]: string;
        } | null;
        /**
         * The properties to set on daemon config files.Property keys are specified in prefix:property format, for example spark:spark.kubernetes.container.image. The following are supported prefixes and their mappings: spark: spark-defaults.confFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).
         */
        properties?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Specifies the cluster auto-delete schedule configuration.
     */
    export interface Schema$LifecycleConfig {
        /**
         * Optional. The time when cluster will be auto-deleted (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        autoDeleteTime?: string | null;
        /**
         * Optional. The lifetime duration of cluster. The cluster will be auto-deleted at the end of this period. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        autoDeleteTtl?: string | null;
        /**
         * Optional. The duration to keep the cluster alive while idling (when no jobs are running). Passing this threshold will cause the cluster to be deleted. Minimum value is 5 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        idleDeleteTtl?: string | null;
        /**
         * Output only. The time when cluster became idle (most recent job finished) and became eligible for deletion due to idleness (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        idleStartTime?: string | null;
    }
    /**
     * A response to a request to list autoscaling policies in a project.
     */
    export interface Schema$ListAutoscalingPoliciesResponse {
        /**
         * Output only. This token is included in the response if there are more results to fetch.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Autoscaling policies list.
         */
        policies?: Schema$AutoscalingPolicy[];
    }
    /**
     * A list of batch workloads.
     */
    export interface Schema$ListBatchesResponse {
        /**
         * Output only. The batches from the specified collection.
         */
        batches?: Schema$Batch[];
        /**
         * A token, which can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Output only. List of Batches that could not be included in the response. Attempting to get one of these resources may indicate why it was not included in the list response.
         */
        unreachable?: string[] | null;
    }
    /**
     * The list of all clusters in a project.
     */
    export interface Schema$ListClustersResponse {
        /**
         * Output only. The clusters in the project.
         */
        clusters?: Schema$Cluster[];
        /**
         * Output only. This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListClustersRequest.
         */
        nextPageToken?: string | null;
    }
    /**
     * A list of jobs in a project.
     */
    export interface Schema$ListJobsResponse {
        /**
         * Output only. Jobs list.
         */
        jobs?: Schema$Job[];
        /**
         * Optional. This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListJobsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. List of jobs with kms_key-encrypted parameters that could not be decrypted. A response to a jobs.get request may indicate the reason for the decryption failure for a specific job.
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
     * A list of interactive sessions.
     */
    export interface Schema$ListSessionsResponse {
        /**
         * A token, which can be sent as page_token, to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Output only. The sessions from the specified collection.
         */
        sessions?: Schema$Session[];
    }
    /**
     * A list of session templates.
     */
    export interface Schema$ListSessionTemplatesResponse {
        /**
         * A token, which can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Session template list
         */
        sessionTemplates?: Schema$SessionTemplate[];
    }
    /**
     * A response to a request to list workflow templates in a project.
     */
    export interface Schema$ListWorkflowTemplatesResponse {
        /**
         * Output only. This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListWorkflowTemplatesRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. WorkflowTemplates list.
         */
        templates?: Schema$WorkflowTemplate[];
        /**
         * Output only. List of workflow templates that could not be included in the response. Attempting to get one of these resources may indicate why it was not included in the list response.
         */
        unreachable?: string[] | null;
    }
    /**
     * The runtime logging config of the job.
     */
    export interface Schema$LoggingConfig {
        /**
         * The per-package log levels for the driver. This can include "root" package name to configure rootLogger. Examples: - 'com.google = FATAL' - 'root = INFO' - 'org.apache = DEBUG'
         */
        driverLogLevels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Cluster that is managed by the workflow.
     */
    export interface Schema$ManagedCluster {
        /**
         * Required. The cluster name prefix. A unique cluster name will be formed by appending a random suffix.The name must contain only lower-case letters (a-z), numbers (0-9), and hyphens (-). Must begin with a letter. Cannot begin or end with hyphen. Must consist of between 2 and 35 characters.
         */
        clusterName?: string | null;
        /**
         * Required. The cluster configuration.
         */
        config?: Schema$ClusterConfig;
        /**
         * Optional. The labels to associate with this cluster.Label keys must be between 1 and 63 characters long, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\}Label values must be between 1 and 63 characters long, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}\p{N\}_-{0,63\}No more than 32 labels can be associated with a given cluster.
         */
        labels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Specifies the resources used to actively manage an instance group.
     */
    export interface Schema$ManagedGroupConfig {
        /**
         * Output only. The name of the Instance Group Manager for this group.
         */
        instanceGroupManagerName?: string | null;
        /**
         * Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.
         */
        instanceGroupManagerUri?: string | null;
        /**
         * Output only. The name of the Instance Template used for the Managed Instance Group.
         */
        instanceTemplateName?: string | null;
    }
    export interface Schema$MemoryMetrics {
        totalOffHeapStorageMemory?: string | null;
        totalOnHeapStorageMemory?: string | null;
        usedOffHeapStorageMemory?: string | null;
        usedOnHeapStorageMemory?: string | null;
    }
    /**
     * Specifies a Metastore configuration.
     */
    export interface Schema$MetastoreConfig {
        /**
         * Required. Resource name of an existing Dataproc Metastore service.Example: projects/[project_id]/locations/[dataproc_region]/services/[service-name]
         */
        dataprocMetastoreService?: string | null;
    }
    /**
     * A Dataproc custom metric.
     */
    export interface Schema$Metric {
        /**
         * Optional. Specify one or more Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) to collect for the metric course (for the SPARK metric source (any Spark metric (https://spark.apache.org/docs/latest/monitoring.html#metrics) can be specified).Provide metrics in the following format: METRIC_SOURCE: INSTANCE:GROUP:METRIC Use camelcase as appropriate.Examples: yarn:ResourceManager:QueueMetrics:AppsCompleted spark:driver:DAGScheduler:job.allJobs sparkHistoryServer:JVM:Memory:NonHeapMemoryUsage.committed hiveserver2:JVM:Memory:NonHeapMemoryUsage.used Notes: Only the specified overridden metrics are collected for the metric source. For example, if one or more spark:executive metrics are listed as metric overrides, other SPARK metrics are not collected. The collection of the metrics for other enabled custom metric sources is unaffected. For example, if both SPARK and YARN metric sources are enabled, and overrides are provided for Spark metrics only, all YARN metrics are collected.
         */
        metricOverrides?: string[] | null;
        /**
         * Required. A standard set of metrics is collected unless metricOverrides are specified for the metric source (see Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) for more information).
         */
        metricSource?: string | null;
    }
    /**
     * Deprecated. Used only for the deprecated beta. A full, namespace-isolated deployment target for an existing GKE cluster.
     */
    export interface Schema$NamespacedGkeDeploymentTarget {
        /**
         * Optional. A namespace within the GKE cluster to deploy into.
         */
        clusterNamespace?: string | null;
        /**
         * Optional. The target GKE cluster to deploy to. Format: 'projects/{project\}/locations/{location\}/clusters/{cluster_id\}'
         */
        targetGkeCluster?: string | null;
    }
    export interface Schema$NativeBuildInfoUiData {
        /**
         * Optional. Build class of Native.
         */
        buildClass?: string | null;
        /**
         * Optional. Build related details.
         */
        buildInfo?: Schema$BuildInfo[];
    }
    /**
     * Native SQL Execution Data
     */
    export interface Schema$NativeSqlExecutionUiData {
        /**
         * Optional. Description of the execution.
         */
        description?: string | null;
        /**
         * Required. Execution ID of the Native SQL Execution.
         */
        executionId?: string | null;
        /**
         * Optional. Description of the fallback.
         */
        fallbackDescription?: string | null;
        /**
         * Optional. Fallback node to reason.
         */
        fallbackNodeToReason?: Schema$FallbackReason[];
        /**
         * Optional. Number of nodes fallen back to Spark.
         */
        numFallbackNodes?: number | null;
        /**
         * Optional. Number of nodes in Native.
         */
        numNativeNodes?: number | null;
    }
    /**
     * Dataproc Node Group. The Dataproc NodeGroup resource is not related to the Dataproc NodeGroupAffinity resource.
     */
    export interface Schema$NodeGroup {
        /**
         * Optional. Node group labels. Label keys must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty. If specified, they must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). The node group must have no more than 32 labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The Node group resource name (https://aip.dev/122).
         */
        name?: string | null;
        /**
         * Optional. The node group instance group configuration.
         */
        nodeGroupConfig?: Schema$InstanceGroupConfig;
        /**
         * Required. Node group roles.
         */
        roles?: string[] | null;
    }
    /**
     * Node Group Affinity for clusters using sole-tenant node groups. The Dataproc NodeGroupAffinity resource is not related to the Dataproc NodeGroup resource.
     */
    export interface Schema$NodeGroupAffinity {
        /**
         * Required. The URI of a sole-tenant node group resource (https://cloud.google.com/compute/docs/reference/rest/v1/nodeGroups) that the cluster will be created on.A full URL, partial URI, or node group name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 node-group-1
         */
        nodeGroupUri?: string | null;
    }
    /**
     * Metadata describing the node group operation.
     */
    export interface Schema$NodeGroupOperationMetadata {
        /**
         * Output only. Cluster UUID associated with the node group operation.
         */
        clusterUuid?: string | null;
        /**
         * Output only. Short description of operation.
         */
        description?: string | null;
        /**
         * Output only. Labels associated with the operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Node group ID for the operation.
         */
        nodeGroupId?: string | null;
        /**
         * The operation type.
         */
        operationType?: string | null;
        /**
         * Output only. Current operation status.
         */
        status?: Schema$ClusterOperationStatus;
        /**
         * Output only. The previous operation status.
         */
        statusHistory?: Schema$ClusterOperationStatus[];
        /**
         * Output only. Errors encountered during operation execution.
         */
        warnings?: string[] | null;
    }
    /**
     * Specifies an executable to run on a fully configured node and a timeout period for executable completion.
     */
    export interface Schema$NodeInitializationAction {
        /**
         * Required. Cloud Storage URI of executable file.
         */
        executableFile?: string | null;
        /**
         * Optional. Amount of time executable has to complete. Default is 10 minutes (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Cluster creation fails with an explanatory error message (the name of the executable that caused the error and the exceeded timeout period) if the executable is not completed at end of the timeout period.
         */
        executionTimeout?: string | null;
    }
    /**
     * indicating a list of workers of same type
     */
    export interface Schema$NodePool {
        /**
         * Required. A unique id of the node pool. Primary and Secondary workers can be specified using special reserved ids PRIMARY_WORKER_POOL and SECONDARY_WORKER_POOL respectively. Aux node pools can be referenced using corresponding pool id.
         */
        id?: string | null;
        /**
         * Name of instances to be repaired. These instances must belong to specified node pool.
         */
        instanceNames?: string[] | null;
        /**
         * Required. Repair action to take on specified resources of the node pool.
         */
        repairAction?: string | null;
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$Operation {
        /**
         * If the value is false, it means the operation is still in progress. If true, the operation is completed, and either error or response is available.
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
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the name should be a resource name ending with operations/{unique_id\}.
         */
        name?: string | null;
        /**
         * The normal, successful response of the operation. If the original method returns no data on success, such as Delete, the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. For other methods, the response should have the type XxxResponse, where Xxx is the original method name. For example, if the original method name is TakeSnapshot(), the inferred response type is TakeSnapshotResponse.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A job executed by the workflow.
     */
    export interface Schema$OrderedJob {
        /**
         * Optional. Job is a Flink job.
         */
        flinkJob?: Schema$FlinkJob;
        /**
         * Optional. Job is a Hadoop job.
         */
        hadoopJob?: Schema$HadoopJob;
        /**
         * Optional. Job is a Hive job.
         */
        hiveJob?: Schema$HiveJob;
        /**
         * Optional. The labels to associate with this job.Label keys must be between 1 and 63 characters long, and must conform to the following regular expression: \p{Ll\}\p{Lo\}{0,62\}Label values must be between 1 and 63 characters long, and must conform to the following regular expression: \p{Ll\}\p{Lo\}\p{N\}_-{0,63\}No more than 32 labels can be associated with a given job.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Job is a Pig job.
         */
        pigJob?: Schema$PigJob;
        /**
         * Optional. The optional list of prerequisite job step_ids. If not specified, the job will start at the beginning of workflow.
         */
        prerequisiteStepIds?: string[] | null;
        /**
         * Optional. Job is a Presto job.
         */
        prestoJob?: Schema$PrestoJob;
        /**
         * Optional. Job is a PySpark job.
         */
        pysparkJob?: Schema$PySparkJob;
        /**
         * Optional. Job scheduling configuration.
         */
        scheduling?: Schema$JobScheduling;
        /**
         * Optional. Job is a Spark job.
         */
        sparkJob?: Schema$SparkJob;
        /**
         * Optional. Job is a SparkR job.
         */
        sparkRJob?: Schema$SparkRJob;
        /**
         * Optional. Job is a SparkSql job.
         */
        sparkSqlJob?: Schema$SparkSqlJob;
        /**
         * Required. The step id. The id must be unique among all jobs within the template.The step id is used as prefix for job id, as job goog-dataproc-workflow-step-id label, and in prerequisiteStepIds field from other steps.The id must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of between 3 and 50 characters.
         */
        stepId?: string | null;
        /**
         * Optional. Job is a Trino job.
         */
        trinoJob?: Schema$TrinoJob;
    }
    /**
     * Metrics about the data written by the task.
     */
    export interface Schema$OutputMetrics {
        bytesWritten?: string | null;
        recordsWritten?: string | null;
    }
    export interface Schema$OutputQuantileMetrics {
        bytesWritten?: Schema$Quantiles;
        recordsWritten?: Schema$Quantiles;
    }
    /**
     * Configuration for parameter validation.
     */
    export interface Schema$ParameterValidation {
        /**
         * Validation based on regular expressions.
         */
        regex?: Schema$RegexValidation;
        /**
         * Validation based on a list of allowed values.
         */
        values?: Schema$ValueValidation;
    }
    /**
     * Auxiliary services configuration for a workload.
     */
    export interface Schema$PeripheralsConfig {
        /**
         * Optional. Resource name of an existing Dataproc Metastore service.Example: projects/[project_id]/locations/[region]/services/[service_id]
         */
        metastoreService?: string | null;
        /**
         * Optional. The Spark History Server configuration for the workload.
         */
        sparkHistoryServerConfig?: Schema$SparkHistoryServerConfig;
    }
    /**
     * A Dataproc job for running Apache Pig (https://pig.apache.org/) queries on YARN.
     */
    export interface Schema$PigJob {
        /**
         * Optional. Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
         */
        continueOnFailure?: boolean | null;
        /**
         * Optional. HCFS URIs of jar files to add to the CLASSPATH of the Pig Client and Hadoop MapReduce (MR) tasks. Can contain Pig UDFs.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Optional. A mapping of property names to values, used to configure Pig. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/hadoop/conf/x-site.xml, /etc/pig/conf/pig.properties, and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * The HCFS URI of the script that contains the Pig queries.
         */
        queryFileUri?: string | null;
        /**
         * A list of queries.
         */
        queryList?: Schema$QueryList;
        /**
         * Optional. Mapping of query variable names to values (equivalent to the Pig command: name=[value]).
         */
        scriptVariables?: {
            [key: string]: string;
        } | null;
    }
    /**
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources.A Policy is a collection of bindings. A binding binds one or more members, or principals, to a single role. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A role is a named list of permissions; each role can be an IAM predefined role or a user-created custom role.For some types of Google Cloud resources, a binding can also specify a condition, which is a logical expression that allows access to a resource only if the expression evaluates to true. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the IAM documentation (https://cloud.google.com/iam/help/conditions/resource-policies).JSON example: { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} YAML example: bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') etag: BwWWja0YfJA= version: 3 For a description of IAM and its features, see the IAM documentation (https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
        /**
         * Associates a list of members, or principals, with a role. Optionally, may specify a condition that determines how and when the bindings are applied. Each of the bindings must contain at least one principal.The bindings in a Policy can refer to up to 1,500 principals; up to 250 of these principals can be Google groups. Each occurrence of a principal counts towards these limits. For example, if the bindings grant 50 different roles to user:alice@example.com, and not to any other principal, then you can add another 1,450 principals to the bindings in the Policy.
         */
        bindings?: Schema$Binding[];
        /**
         * etag is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the etag in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An etag is returned in the response to getIamPolicy, and systems are expected to put that etag in the request to setIamPolicy to ensure that their change will be applied to the same version of the policy.Important: If you use IAM Conditions, you must include the etag field whenever you call setIamPolicy. If you omit this field, then IAM allows you to overwrite a version 3 policy with a version 1 policy, and all of the conditions in the version 3 policy are lost.
         */
        etag?: string | null;
        /**
         * Specifies the format of the policy.Valid values are 0, 1, and 3. Requests that specify an invalid value are rejected.Any operation that affects conditional role bindings must specify version 3. This requirement applies to the following operations: Getting a policy that includes a conditional role binding Adding a conditional role binding to a policy Changing a conditional role binding in a policy Removing any role binding, with or without a condition, from a policy that includes conditionsImportant: If you use IAM Conditions, you must include the etag field whenever you call setIamPolicy. If you omit this field, then IAM allows you to overwrite a version 3 policy with a version 1 policy, and all of the conditions in the version 3 policy are lost.If a policy does not include any conditions, operations on that policy may specify any valid version or leave the field unset.To learn which resources support conditions in their IAM policies, see the IAM documentation (https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        version?: number | null;
    }
    /**
     * Pool Data
     */
    export interface Schema$PoolData {
        name?: string | null;
        stageIds?: string[] | null;
    }
    /**
     * A Dataproc job for running Presto (https://prestosql.io/) queries. IMPORTANT: The Dataproc Presto Optional Component (https://cloud.google.com/dataproc/docs/concepts/components/presto) must be enabled when the cluster is created to submit a Presto job to the cluster.
     */
    export interface Schema$PrestoJob {
        /**
         * Optional. Presto client tags to attach to this query
         */
        clientTags?: string[] | null;
        /**
         * Optional. Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
         */
        continueOnFailure?: boolean | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Optional. The format in which query output will be displayed. See the Presto documentation for supported output formats
         */
        outputFormat?: string | null;
        /**
         * Optional. A mapping of property names to values. Used to set Presto session properties (https://prestodb.io/docs/current/sql/set-session.html) Equivalent to using the --session flag in the Presto CLI
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * The HCFS URI of the script that contains SQL queries.
         */
        queryFileUri?: string | null;
        /**
         * A list of queries.
         */
        queryList?: Schema$QueryList;
    }
    /**
     * Process Summary
     */
    export interface Schema$ProcessSummary {
        addTime?: string | null;
        hostPort?: string | null;
        isActive?: boolean | null;
        processId?: string | null;
        processLogs?: {
            [key: string]: string;
        } | null;
        removeTime?: string | null;
        totalCores?: number | null;
    }
    /**
     * Defines how Dataproc should create VMs with a mixture of provisioning models.
     */
    export interface Schema$ProvisioningModelMix {
        /**
         * Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. Dataproc will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, Dataproc will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances.
         */
        standardCapacityBase?: number | null;
        /**
         * Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, Dataproc will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.
         */
        standardCapacityPercentAboveBase?: number | null;
    }
    /**
     * Configuration for PyPi repository
     */
    export interface Schema$PyPiRepositoryConfig {
        /**
         * Optional. PyPi repository address
         */
        pypiRepository?: string | null;
    }
    /**
     * A configuration for running an Apache PySpark (https://spark.apache.org/docs/latest/api/python/getting_started/quickstart.html) batch workload.
     */
    export interface Schema$PySparkBatch {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments that can be set as batch properties, such as --conf, since a collision can occur that causes an incorrect batch submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor.
         */
        fileUris?: string[] | null;
        /**
         * Optional. HCFS URIs of jar files to add to the classpath of the Spark driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Required. The HCFS URI of the main Python file to use as the Spark driver. Must be a .py file.
         */
        mainPythonFileUri?: string | null;
        /**
         * Optional. HCFS file URIs of Python files to pass to the PySpark framework. Supported file types: .py, .egg, and .zip.
         */
        pythonFileUris?: string[] | null;
    }
    /**
     * A Dataproc job for running Apache PySpark (https://spark.apache.org/docs/latest/api/python/index.html#pyspark-overview) applications on YARN.
     */
    export interface Schema$PySparkJob {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor. Useful for naively parallel tasks.
         */
        fileUris?: string[] | null;
        /**
         * Optional. HCFS URIs of jar files to add to the CLASSPATHs of the Python driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Required. The HCFS URI of the main Python file to use as the driver. Must be a .py file.
         */
        mainPythonFileUri?: string | null;
        /**
         * Optional. A mapping of property names to values, used to configure PySpark. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. HCFS file URIs of Python files to pass to the PySpark framework. Supported file types: .py, .egg, and .zip.
         */
        pythonFileUris?: string[] | null;
    }
    /**
     * Quantile metrics data related to Tasks. Units can be seconds, bytes, milliseconds, etc depending on the message type.
     */
    export interface Schema$Quantiles {
        count?: string | null;
        maximum?: string | null;
        minimum?: string | null;
        percentile25?: string | null;
        percentile50?: string | null;
        percentile75?: string | null;
        sum?: string | null;
    }
    /**
     * A list of queries to run on a cluster.
     */
    export interface Schema$QueryList {
        /**
         * Required. The queries to execute. You do not need to end a query expression with a semicolon. Multiple queries can be specified in one string by separating each with a semicolon. Here is an example of a Dataproc API snippet that uses a QueryList to specify a HiveJob: "hiveJob": { "queryList": { "queries": [ "query1", "query2", "query3;query4", ] \} \}
         */
        queries?: string[] | null;
    }
    /**
     * Details about RDD usage.
     */
    export interface Schema$RddDataDistribution {
        address?: string | null;
        diskUsed?: string | null;
        memoryRemaining?: string | null;
        memoryUsed?: string | null;
        offHeapMemoryRemaining?: string | null;
        offHeapMemoryUsed?: string | null;
        onHeapMemoryRemaining?: string | null;
        onHeapMemoryUsed?: string | null;
    }
    /**
     * A grouping of nodes representing higher level constructs (stage, job etc.).
     */
    export interface Schema$RddOperationCluster {
        childClusters?: Schema$RddOperationCluster[];
        childNodes?: Schema$RddOperationNode[];
        name?: string | null;
        rddClusterId?: string | null;
    }
    /**
     * A directed edge representing dependency between two RDDs.
     */
    export interface Schema$RddOperationEdge {
        fromId?: number | null;
        toId?: number | null;
    }
    /**
     * Graph representing RDD dependencies. Consists of edges and a root cluster.
     */
    export interface Schema$RddOperationGraph {
        edges?: Schema$RddOperationEdge[];
        incomingEdges?: Schema$RddOperationEdge[];
        outgoingEdges?: Schema$RddOperationEdge[];
        rootCluster?: Schema$RddOperationCluster;
        stageId?: string | null;
    }
    /**
     * A node in the RDD operation graph. Corresponds to a single RDD.
     */
    export interface Schema$RddOperationNode {
        barrier?: boolean | null;
        cached?: boolean | null;
        callsite?: string | null;
        name?: string | null;
        nodeId?: number | null;
        outputDeterministicLevel?: string | null;
    }
    /**
     * Information about RDD partitions.
     */
    export interface Schema$RddPartitionInfo {
        blockName?: string | null;
        diskUsed?: string | null;
        executors?: string[] | null;
        memoryUsed?: string | null;
        storageLevel?: string | null;
    }
    /**
     * Overall data about RDD storage.
     */
    export interface Schema$RddStorageInfo {
        dataDistribution?: Schema$RddDataDistribution[];
        diskUsed?: string | null;
        memoryUsed?: string | null;
        name?: string | null;
        numCachedPartitions?: number | null;
        numPartitions?: number | null;
        partitions?: Schema$RddPartitionInfo[];
        rddStorageId?: number | null;
        storageLevel?: string | null;
    }
    /**
     * Validation based on regular expressions.
     */
    export interface Schema$RegexValidation {
        /**
         * Required. RE2 regular expressions used to validate the parameter's value. The value must match the regex in its entirety (substring matches are not sufficient).
         */
        regexes?: string[] | null;
    }
    /**
     * A request to repair a cluster.
     */
    export interface Schema$RepairClusterRequest {
        /**
         * Optional. Cluster to be repaired
         */
        cluster?: Schema$ClusterToRepair;
        /**
         * Optional. Specifying the cluster_uuid means the RPC will fail (with error NOT_FOUND) if a cluster with the specified UUID does not exist.
         */
        clusterUuid?: string | null;
        /**
         * Optional. Timeout for graceful YARN decommissioning. Graceful decommissioning facilitates the removal of cluster nodes without interrupting jobs in progress. The timeout specifies the amount of time to wait for jobs finish before forcefully removing nodes. The default timeout is 0 for forceful decommissioning, and the maximum timeout period is 1 day. (see JSON Mapping—Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).graceful_decommission_timeout is supported in Dataproc image versions 1.2+.
         */
        gracefulDecommissionTimeout?: string | null;
        /**
         * Optional. Node pools and corresponding repair action to be taken. All node pools should be unique in this request. i.e. Multiple entries for the same node pool id are not allowed.
         */
        nodePools?: Schema$NodePool[];
        /**
         * Optional. operation id of the parent operation sending the repair request
         */
        parentOperationId?: string | null;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two RepairClusterRequests with the same ID, the second request is ignored, and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    export interface Schema$RepairNodeGroupRequest {
        /**
         * Required. Name of instances to be repaired. These instances must belong to specified node pool.
         */
        instanceNames?: string[] | null;
        /**
         * Required. Repair action to take on specified resources of the node pool.
         */
        repairAction?: string | null;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two RepairNodeGroupRequest with the same ID, the second request is ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Configuration for dependency repositories
     */
    export interface Schema$RepositoryConfig {
        /**
         * Optional. Configuration for PyPi repository.
         */
        pypiRepositoryConfig?: Schema$PyPiRepositoryConfig;
    }
    /**
     * Reservation Affinity for consuming Zonal reservation.
     */
    export interface Schema$ReservationAffinity {
        /**
         * Optional. Type of reservation to consume
         */
        consumeReservationType?: string | null;
        /**
         * Optional. Corresponds to the label key of reservation resource.
         */
        key?: string | null;
        /**
         * Optional. Corresponds to the label values of reservation resource.
         */
        values?: string[] | null;
    }
    /**
     * A request to resize a node group.
     */
    export interface Schema$ResizeNodeGroupRequest {
        /**
         * Optional. Timeout for graceful YARN decommissioning. Graceful decommissioning (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/scaling-clusters#graceful_decommissioning) allows the removal of nodes from the Compute Engine node group without interrupting jobs in progress. This timeout specifies how long to wait for jobs in progress to finish before forcefully removing nodes (and potentially interrupting jobs). Default timeout is 0 (for forceful decommission), and the maximum allowed timeout is 1 day. (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Only supported on Dataproc image versions 1.2 and higher.
         */
        gracefulDecommissionTimeout?: string | null;
        /**
         * Optional. operation id of the parent operation sending the resize request
         */
        parentOperationId?: string | null;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two ResizeNodeGroupRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.ResizeNodeGroupRequests) with the same ID, the second request is ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
        /**
         * Required. The number of running instances for the node group to maintain. The group adds or removes instances to maintain the number of instances specified by this parameter.
         */
        size?: number | null;
    }
    export interface Schema$ResourceInformation {
        addresses?: string[] | null;
        name?: string | null;
    }
    /**
     * Resource profile that contains information about all the resources required by executors and tasks.
     */
    export interface Schema$ResourceProfileInfo {
        executorResources?: {
            [key: string]: Schema$ExecutorResourceRequest;
        } | null;
        resourceProfileId?: number | null;
        taskResources?: {
            [key: string]: Schema$TaskResourceRequest;
        } | null;
    }
    /**
     * Runtime configuration for a workload.
     */
    export interface Schema$RuntimeConfig {
        /**
         * Optional. Autotuning configuration of the workload.
         */
        autotuningConfig?: Schema$AutotuningConfig;
        /**
         * Optional. Cohort identifier. Identifies families of the workloads having the same shape, e.g. daily ETL jobs.
         */
        cohort?: string | null;
        /**
         * Optional. Optional custom container image for the job runtime environment. If not specified, a default container image will be used.
         */
        containerImage?: string | null;
        /**
         * Optional. A mapping of property names to values, which are used to configure workload execution.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Dependency repository configuration.
         */
        repositoryConfig?: Schema$RepositoryConfig;
        /**
         * Optional. Version of the batch runtime.
         */
        version?: string | null;
    }
    /**
     * Runtime information about workload execution.
     */
    export interface Schema$RuntimeInfo {
        /**
         * Output only. Approximate workload resource usage, calculated when the workload completes (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).Note: This metric calculation may change in the future, for example, to capture cumulative workload resource consumption during workload execution (see the Dataproc Serverless release notes (https://cloud.google.com/dataproc-serverless/docs/release-notes) for announcements, changes, fixes and other Dataproc developments).
         */
        approximateUsage?: Schema$UsageMetrics;
        /**
         * Output only. Snapshot of current workload resource usage.
         */
        currentUsage?: Schema$UsageSnapshot;
        /**
         * Output only. A URI pointing to the location of the diagnostics tarball.
         */
        diagnosticOutputUri?: string | null;
        /**
         * Output only. Map of remote access endpoints (such as web interfaces and APIs) to their URIs.
         */
        endpoints?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. A URI pointing to the location of the stdout and stderr of the workload.
         */
        outputUri?: string | null;
    }
    /**
     * List of Executors associated with a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationExecutorsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationExecutorsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Details about executors used by the application.
         */
        sparkApplicationExecutors?: Schema$ExecutorSummary[];
    }
    /**
     * List of Executors associated with a Spark Application Stage.
     */
    export interface Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationExecutorStageSummaryRequest.
         */
        nextPageToken?: string | null;
        /**
         * Details about executors used by the application stage.
         */
        sparkApplicationStageExecutors?: Schema$ExecutorStageSummary[];
    }
    /**
     * A list of Jobs associated with a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationJobsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationJobsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a spark job.
         */
        sparkApplicationJobs?: Schema$JobData[];
    }
    /**
     * List of all Native queries for a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationSqlQueriesRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Native SQL Execution Data
         */
        sparkApplicationNativeSqlQueries?: Schema$NativeSqlExecutionUiData[];
    }
    /**
     * List of all queries for a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationSqlQueriesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationSqlQueriesRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. SQL Execution Data
         */
        sparkApplicationSqlQueries?: Schema$SqlExecutionUiData[];
    }
    /**
     * A list of summary of Spark Applications
     */
    export interface Schema$SearchSessionSparkApplicationsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. High level information corresponding to an application.
         */
        sparkApplications?: Schema$SparkApplication[];
    }
    /**
     * A list of Stage Attempts for a Stage of a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationStageAttemptsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationStageAttemptsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a stage attempts
         */
        sparkApplicationStageAttempts?: Schema$StageData[];
    }
    /**
     * List of tasks for a stage of a Spark Application
     */
    export interface Schema$SearchSessionSparkApplicationStageAttemptTasksResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationStageAttemptTasksRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to tasks created by spark.
         */
        sparkApplicationStageAttemptTasks?: Schema$TaskData[];
    }
    /**
     * A list of stages associated with a Spark Application.
     */
    export interface Schema$SearchSessionSparkApplicationStagesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSessionSparkApplicationStages.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a stage.
         */
        sparkApplicationStages?: Schema$StageData[];
    }
    /**
     * List of Executors associated with a Spark Application.
     */
    export interface Schema$SearchSparkApplicationExecutorsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationExecutorsListRequest.
         */
        nextPageToken?: string | null;
        /**
         * Details about executors used by the application.
         */
        sparkApplicationExecutors?: Schema$ExecutorSummary[];
    }
    /**
     * List of Executors associated with a Spark Application Stage.
     */
    export interface Schema$SearchSparkApplicationExecutorStageSummaryResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationExecutorsListRequest.
         */
        nextPageToken?: string | null;
        /**
         * Details about executors used by the application stage.
         */
        sparkApplicationStageExecutors?: Schema$ExecutorStageSummary[];
    }
    /**
     * A list of Jobs associated with a Spark Application.
     */
    export interface Schema$SearchSparkApplicationJobsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationJobsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a spark job.
         */
        sparkApplicationJobs?: Schema$JobData[];
    }
    /**
     * List of all Native SQL queries details for a Spark Application.
     */
    export interface Schema$SearchSparkApplicationNativeSqlQueriesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationNativeSqlQueriesRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Native SQL Execution Data
         */
        sparkApplicationNativeSqlQueries?: Schema$NativeSqlExecutionUiData[];
    }
    /**
     * List of all queries for a Spark Application.
     */
    export interface Schema$SearchSparkApplicationSqlQueriesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationSqlQueriesRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. SQL Execution Data
         */
        sparkApplicationSqlQueries?: Schema$SqlExecutionUiData[];
    }
    /**
     * A list of summary of Spark Applications
     */
    export interface Schema$SearchSparkApplicationsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. High level information corresponding to an application.
         */
        sparkApplications?: Schema$SparkApplication[];
    }
    /**
     * A list of Stage Attempts for a Stage of a Spark Application.
     */
    export interface Schema$SearchSparkApplicationStageAttemptsResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListSparkApplicationStageAttemptsRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a stage attempts
         */
        sparkApplicationStageAttempts?: Schema$StageData[];
    }
    /**
     * List of tasks for a stage of a Spark Application
     */
    export interface Schema$SearchSparkApplicationStageAttemptTasksResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListSparkApplicationStageAttemptTasksRequest.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to tasks created by spark.
         */
        sparkApplicationStageAttemptTasks?: Schema$TaskData[];
    }
    /**
     * A list of stages associated with a Spark Application.
     */
    export interface Schema$SearchSparkApplicationStagesResponse {
        /**
         * This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent SearchSparkApplicationStages.
         */
        nextPageToken?: string | null;
        /**
         * Output only. Data corresponding to a stage.
         */
        sparkApplicationStages?: Schema$StageData[];
    }
    /**
     * Security related configuration, including encryption, Kerberos, etc.
     */
    export interface Schema$SecurityConfig {
        /**
         * Optional. Identity related configuration, including service account based secure multi-tenancy user mappings.
         */
        identityConfig?: Schema$IdentityConfig;
        /**
         * Optional. Kerberos related configuration.
         */
        kerberosConfig?: Schema$KerberosConfig;
    }
    /**
     * A representation of a session.
     */
    export interface Schema$Session {
        /**
         * Output only. The time when the session was created.
         */
        createTime?: string | null;
        /**
         * Output only. The email address of the user who created the session.
         */
        creator?: string | null;
        /**
         * Optional. Environment configuration for the session execution.
         */
        environmentConfig?: Schema$EnvironmentConfig;
        /**
         * Optional. Jupyter session config.
         */
        jupyterSession?: Schema$JupyterConfig;
        /**
         * Optional. The labels to associate with the session. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a session.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. The resource name of the session.
         */
        name?: string | null;
        /**
         * Optional. Runtime configuration for the session execution.
         */
        runtimeConfig?: Schema$RuntimeConfig;
        /**
         * Output only. Runtime information about session execution.
         */
        runtimeInfo?: Schema$RuntimeInfo;
        /**
         * Optional. The session template used by the session.Only resource names, including project ID and location, are valid.Example: * https://www.googleapis.com/compute/v1/projects/[project_id]/locations/[dataproc_region]/sessionTemplates/[template_id] * projects/[project_id]/locations/[dataproc_region]/sessionTemplates/[template_id]The template must be in the same project and Dataproc region as the session.
         */
        sessionTemplate?: string | null;
        /**
         * Optional. Spark connect session config.
         */
        sparkConnectSession?: Schema$SparkConnectConfig;
        /**
         * Output only. A state of the session.
         */
        state?: string | null;
        /**
         * Output only. Historical state information for the session.
         */
        stateHistory?: Schema$SessionStateHistory[];
        /**
         * Output only. Session state details, such as the failure description if the state is FAILED.
         */
        stateMessage?: string | null;
        /**
         * Output only. The time when the session entered the current state.
         */
        stateTime?: string | null;
        /**
         * Optional. The email address of the user who owns the session.
         */
        user?: string | null;
        /**
         * Output only. A session UUID (Unique Universal Identifier). The service generates this value when it creates the session.
         */
        uuid?: string | null;
    }
    /**
     * Metadata describing the Session operation.
     */
    export interface Schema$SessionOperationMetadata {
        /**
         * The time when the operation was created.
         */
        createTime?: string | null;
        /**
         * Short description of the operation.
         */
        description?: string | null;
        /**
         * The time when the operation was finished.
         */
        doneTime?: string | null;
        /**
         * Labels associated with the operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The operation type.
         */
        operationType?: string | null;
        /**
         * Name of the session for the operation.
         */
        session?: string | null;
        /**
         * Session UUID for the operation.
         */
        sessionUuid?: string | null;
        /**
         * Warnings encountered during operation execution.
         */
        warnings?: string[] | null;
    }
    /**
     * Historical state information.
     */
    export interface Schema$SessionStateHistory {
        /**
         * Output only. The state of the session at this point in the session history.
         */
        state?: string | null;
        /**
         * Output only. Details about the state at this point in the session history.
         */
        stateMessage?: string | null;
        /**
         * Output only. The time when the session entered the historical state.
         */
        stateStartTime?: string | null;
    }
    /**
     * A representation of a session template.
     */
    export interface Schema$SessionTemplate {
        /**
         * Output only. The time when the template was created.
         */
        createTime?: string | null;
        /**
         * Output only. The email address of the user who created the template.
         */
        creator?: string | null;
        /**
         * Optional. Brief description of the template.
         */
        description?: string | null;
        /**
         * Optional. Environment configuration for session execution.
         */
        environmentConfig?: Schema$EnvironmentConfig;
        /**
         * Optional. Jupyter session config.
         */
        jupyterSession?: Schema$JupyterConfig;
        /**
         * Optional. Labels to associate with sessions created using this template. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty, but, if present, must contain 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a session.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The resource name of the session template.
         */
        name?: string | null;
        /**
         * Optional. Runtime configuration for session execution.
         */
        runtimeConfig?: Schema$RuntimeConfig;
        /**
         * Optional. Spark connect session config.
         */
        sparkConnectSession?: Schema$SparkConnectConfig;
        /**
         * Output only. The time the template was last updated.
         */
        updateTime?: string | null;
        /**
         * Output only. A session template UUID (Unique Universal Identifier). The service generates this value when it creates the session template.
         */
        uuid?: string | null;
    }
    /**
     * Request message for SetIamPolicy method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the resource. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
    }
    /**
     * Shielded Instance Config for clusters using Compute Engine Shielded VMs (https://cloud.google.com/security/shielded-cloud/shielded-vm).
     */
    export interface Schema$ShieldedInstanceConfig {
        /**
         * Optional. Defines whether instances have integrity monitoring enabled.
         */
        enableIntegrityMonitoring?: boolean | null;
        /**
         * Optional. Defines whether instances have Secure Boot enabled.
         */
        enableSecureBoot?: boolean | null;
        /**
         * Optional. Defines whether instances have the vTPM enabled.
         */
        enableVtpm?: boolean | null;
    }
    export interface Schema$ShufflePushReadMetrics {
        corruptMergedBlockChunks?: string | null;
        localMergedBlocksFetched?: string | null;
        localMergedBytesRead?: string | null;
        localMergedChunksFetched?: string | null;
        mergedFetchFallbackCount?: string | null;
        remoteMergedBlocksFetched?: string | null;
        remoteMergedBytesRead?: string | null;
        remoteMergedChunksFetched?: string | null;
        remoteMergedReqsDuration?: string | null;
    }
    export interface Schema$ShufflePushReadQuantileMetrics {
        corruptMergedBlockChunks?: Schema$Quantiles;
        localMergedBlocksFetched?: Schema$Quantiles;
        localMergedBytesRead?: Schema$Quantiles;
        localMergedChunksFetched?: Schema$Quantiles;
        mergedFetchFallbackCount?: Schema$Quantiles;
        remoteMergedBlocksFetched?: Schema$Quantiles;
        remoteMergedBytesRead?: Schema$Quantiles;
        remoteMergedChunksFetched?: Schema$Quantiles;
        remoteMergedReqsDuration?: Schema$Quantiles;
    }
    /**
     * Shuffle data read by the task.
     */
    export interface Schema$ShuffleReadMetrics {
        fetchWaitTimeMillis?: string | null;
        localBlocksFetched?: string | null;
        localBytesRead?: string | null;
        recordsRead?: string | null;
        remoteBlocksFetched?: string | null;
        remoteBytesRead?: string | null;
        remoteBytesReadToDisk?: string | null;
        remoteReqsDuration?: string | null;
        shufflePushReadMetrics?: Schema$ShufflePushReadMetrics;
    }
    export interface Schema$ShuffleReadQuantileMetrics {
        fetchWaitTimeMillis?: Schema$Quantiles;
        localBlocksFetched?: Schema$Quantiles;
        readBytes?: Schema$Quantiles;
        readRecords?: Schema$Quantiles;
        remoteBlocksFetched?: Schema$Quantiles;
        remoteBytesRead?: Schema$Quantiles;
        remoteBytesReadToDisk?: Schema$Quantiles;
        remoteReqsDuration?: Schema$Quantiles;
        shufflePushReadMetrics?: Schema$ShufflePushReadQuantileMetrics;
        totalBlocksFetched?: Schema$Quantiles;
    }
    /**
     * Shuffle data written by task.
     */
    export interface Schema$ShuffleWriteMetrics {
        bytesWritten?: string | null;
        recordsWritten?: string | null;
        writeTimeNanos?: string | null;
    }
    export interface Schema$ShuffleWriteQuantileMetrics {
        writeBytes?: Schema$Quantiles;
        writeRecords?: Schema$Quantiles;
        writeTimeNanos?: Schema$Quantiles;
    }
    export interface Schema$SinkProgress {
        description?: string | null;
        metrics?: {
            [key: string]: string;
        } | null;
        numOutputRows?: string | null;
    }
    /**
     * Specifies the selection and config of software inside the cluster.
     */
    export interface Schema$SoftwareConfig {
        /**
         * Optional. The version of software inside the cluster. It must be one of the supported Dataproc Versions (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#supported-dataproc-image-versions), such as "1.2" (including a subminor version, such as "1.2.29"), or the "preview" version (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#other_versions). If unspecified, it defaults to the latest Debian version.
         */
        imageVersion?: string | null;
        /**
         * Optional. The set of components to activate on the cluster.
         */
        optionalComponents?: string[] | null;
        /**
         * Optional. The properties to set on daemon config files.Property keys are specified in prefix:property format, for example core:hadoop.tmp.dir. The following are supported prefixes and their mappings: capacity-scheduler: capacity-scheduler.xml core: core-site.xml distcp: distcp-default.xml hdfs: hdfs-site.xml hive: hive-site.xml mapred: mapred-site.xml pig: pig.properties spark: spark-defaults.conf yarn: yarn-site.xmlFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).
         */
        properties?: {
            [key: string]: string;
        } | null;
    }
    export interface Schema$SourceProgress {
        description?: string | null;
        endOffset?: string | null;
        inputRowsPerSecond?: number | null;
        latestOffset?: string | null;
        metrics?: {
            [key: string]: string;
        } | null;
        numInputRows?: string | null;
        processedRowsPerSecond?: number | null;
        startOffset?: string | null;
    }
    /**
     * A summary of Spark Application
     */
    export interface Schema$SparkApplication {
        /**
         * Output only. High level information corresponding to an application.
         */
        application?: Schema$ApplicationInfo;
        /**
         * Identifier. Name of the spark application
         */
        name?: string | null;
    }
    /**
     * A configuration for running an Apache Spark (https://spark.apache.org/) batch workload.
     */
    export interface Schema$SparkBatch {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments that can be set as batch properties, such as --conf, since a collision can occur that causes an incorrect batch submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor.
         */
        fileUris?: string[] | null;
        /**
         * Optional. HCFS URIs of jar files to add to the classpath of the Spark driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The name of the driver main class. The jar file that contains the class must be in the classpath or specified in jar_file_uris.
         */
        mainClass?: string | null;
        /**
         * Optional. The HCFS URI of the jar file that contains the main class.
         */
        mainJarFileUri?: string | null;
    }
    /**
     * Spark connect configuration for an interactive session.
     */
    export interface Schema$SparkConnectConfig {
    }
    /**
     * Spark History Server configuration for the workload.
     */
    export interface Schema$SparkHistoryServerConfig {
        /**
         * Optional. Resource name of an existing Dataproc Cluster to act as a Spark History Server for the workload.Example: projects/[project_id]/regions/[region]/clusters/[cluster_name]
         */
        dataprocCluster?: string | null;
    }
    /**
     * A Dataproc job for running Apache Spark (https://spark.apache.org/) applications on YARN.
     */
    export interface Schema$SparkJob {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor. Useful for naively parallel tasks.
         */
        fileUris?: string[] | null;
        /**
         * Optional. HCFS URIs of jar files to add to the CLASSPATHs of the Spark driver and tasks.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * The name of the driver's main class. The jar file that contains the class must be in the default CLASSPATH or specified in SparkJob.jar_file_uris.
         */
        mainClass?: string | null;
        /**
         * The HCFS URI of the jar file that contains the main class.
         */
        mainJarFileUri?: string | null;
        /**
         * Optional. A mapping of property names to values, used to configure Spark. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A graph used for storing information of an executionPlan of DataFrame.
     */
    export interface Schema$SparkPlanGraph {
        edges?: Schema$SparkPlanGraphEdge[];
        executionId?: string | null;
        nodes?: Schema$SparkPlanGraphNodeWrapper[];
    }
    /**
     * Represents a tree of spark plan.
     */
    export interface Schema$SparkPlanGraphCluster {
        desc?: string | null;
        metrics?: Schema$SqlPlanMetric[];
        name?: string | null;
        nodes?: Schema$SparkPlanGraphNodeWrapper[];
        sparkPlanGraphClusterId?: string | null;
    }
    /**
     * Represents a directed edge in the spark plan tree from child to parent.
     */
    export interface Schema$SparkPlanGraphEdge {
        fromId?: string | null;
        toId?: string | null;
    }
    /**
     * Represents a node in the spark plan tree.
     */
    export interface Schema$SparkPlanGraphNode {
        desc?: string | null;
        metrics?: Schema$SqlPlanMetric[];
        name?: string | null;
        sparkPlanGraphNodeId?: string | null;
    }
    /**
     * Wrapper user to represent either a node or a cluster.
     */
    export interface Schema$SparkPlanGraphNodeWrapper {
        cluster?: Schema$SparkPlanGraphCluster;
        node?: Schema$SparkPlanGraphNode;
    }
    /**
     * A configuration for running an Apache SparkR (https://spark.apache.org/docs/latest/sparkr.html) batch workload.
     */
    export interface Schema$SparkRBatch {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the Spark driver. Do not include arguments that can be set as batch properties, such as --conf, since a collision can occur that causes an incorrect batch submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor.
         */
        fileUris?: string[] | null;
        /**
         * Required. The HCFS URI of the main R file to use as the driver. Must be a .R or .r file.
         */
        mainRFileUri?: string | null;
    }
    /**
     * A Dataproc job for running Apache SparkR (https://spark.apache.org/docs/latest/sparkr.html) applications on YARN.
     */
    export interface Schema$SparkRJob {
        /**
         * Optional. HCFS URIs of archives to be extracted into the working directory of each executor. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
         */
        archiveUris?: string[] | null;
        /**
         * Optional. The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
         */
        args?: string[] | null;
        /**
         * Optional. HCFS URIs of files to be placed in the working directory of each executor. Useful for naively parallel tasks.
         */
        fileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Required. The HCFS URI of the main R file to use as the driver. Must be a .R file.
         */
        mainRFileUri?: string | null;
        /**
         * Optional. A mapping of property names to values, used to configure SparkR. Properties that conflict with values set by the Dataproc API might be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
         */
        properties?: {
            [key: string]: string;
        } | null;
    }
    export interface Schema$SparkRuntimeInfo {
        javaHome?: string | null;
        javaVersion?: string | null;
        scalaVersion?: string | null;
    }
    /**
     * A configuration for running Apache Spark SQL (https://spark.apache.org/sql/) queries as a batch workload.
     */
    export interface Schema$SparkSqlBatch {
        /**
         * Optional. HCFS URIs of jar files to be added to the Spark CLASSPATH.
         */
        jarFileUris?: string[] | null;
        /**
         * Required. The HCFS URI of the script that contains Spark SQL queries to execute.
         */
        queryFileUri?: string | null;
        /**
         * Optional. Mapping of query variable names to values (equivalent to the Spark SQL command: SET name="value";).
         */
        queryVariables?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A Dataproc job for running Apache Spark SQL (https://spark.apache.org/sql/) queries.
     */
    export interface Schema$SparkSqlJob {
        /**
         * Optional. HCFS URIs of jar files to be added to the Spark CLASSPATH.
         */
        jarFileUris?: string[] | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Optional. A mapping of property names to values, used to configure Spark SQL's SparkConf. Properties that conflict with values set by the Dataproc API might be overwritten.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * The HCFS URI of the script that contains SQL queries.
         */
        queryFileUri?: string | null;
        /**
         * A list of queries.
         */
        queryList?: Schema$QueryList;
        /**
         * Optional. Mapping of query variable names to values (equivalent to the Spark SQL command: SET name="value";).
         */
        scriptVariables?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Basic autoscaling configurations for Spark Standalone.
     */
    export interface Schema$SparkStandaloneAutoscalingConfig {
        /**
         * Required. Timeout for Spark graceful decommissioning of spark workers. Specifies the duration to wait for spark worker to complete spark decommissioning tasks before forcefully removing workers. Only applicable to downscaling operations.Bounds: 0s, 1d.
         */
        gracefulDecommissionTimeout?: string | null;
        /**
         * Optional. Remove only idle workers when scaling down cluster
         */
        removeOnlyIdleWorkers?: boolean | null;
        /**
         * Required. Fraction of required executors to remove from Spark Serverless clusters. A scale-down factor of 1.0 will result in scaling down so that there are no more executors for the Spark Job.(more aggressive scaling). A scale-down factor closer to 0 will result in a smaller magnitude of scaling donw (less aggressive scaling).Bounds: 0.0, 1.0.
         */
        scaleDownFactor?: number | null;
        /**
         * Optional. Minimum scale-down threshold as a fraction of total cluster size before scaling occurs. For example, in a 20-worker cluster, a threshold of 0.1 means the autoscaler must recommend at least a 2 worker scale-down for the cluster to scale. A threshold of 0 means the autoscaler will scale down on any recommended change.Bounds: 0.0, 1.0. Default: 0.0.
         */
        scaleDownMinWorkerFraction?: number | null;
        /**
         * Required. Fraction of required workers to add to Spark Standalone clusters. A scale-up factor of 1.0 will result in scaling up so that there are no more required workers for the Spark Job (more aggressive scaling). A scale-up factor closer to 0 will result in a smaller magnitude of scaling up (less aggressive scaling).Bounds: 0.0, 1.0.
         */
        scaleUpFactor?: number | null;
        /**
         * Optional. Minimum scale-up threshold as a fraction of total cluster size before scaling occurs. For example, in a 20-worker cluster, a threshold of 0.1 means the autoscaler must recommend at least a 2-worker scale-up for the cluster to scale. A threshold of 0 means the autoscaler will scale up on any recommended change.Bounds: 0.0, 1.0. Default: 0.0.
         */
        scaleUpMinWorkerFraction?: number | null;
    }
    /**
     * Outer message that contains the data obtained from spark listener, packaged with information that is required to process it.
     */
    export interface Schema$SparkWrapperObject {
        applicationEnvironmentInfo?: Schema$ApplicationEnvironmentInfo;
        /**
         * Application Id created by Spark.
         */
        applicationId?: string | null;
        applicationInfo?: Schema$ApplicationInfo;
        appSummary?: Schema$AppSummary;
        /**
         * VM Timestamp associated with the data object.
         */
        eventTimestamp?: string | null;
        executorStageSummary?: Schema$ExecutorStageSummary;
        executorSummary?: Schema$ExecutorSummary;
        jobData?: Schema$JobData;
        /**
         * Native Build Info
         */
        nativeBuildInfoUiData?: Schema$NativeBuildInfoUiData;
        /**
         * Native SQL Execution Info
         */
        nativeSqlExecutionUiData?: Schema$NativeSqlExecutionUiData;
        poolData?: Schema$PoolData;
        processSummary?: Schema$ProcessSummary;
        rddOperationGraph?: Schema$RddOperationGraph;
        rddStorageInfo?: Schema$RddStorageInfo;
        resourceProfileInfo?: Schema$ResourceProfileInfo;
        sparkPlanGraph?: Schema$SparkPlanGraph;
        speculationStageSummary?: Schema$SpeculationStageSummary;
        sqlExecutionUiData?: Schema$SqlExecutionUiData;
        stageData?: Schema$StageData;
        streamBlockData?: Schema$StreamBlockData;
        streamingQueryData?: Schema$StreamingQueryData;
        streamingQueryProgress?: Schema$StreamingQueryProgress;
        taskData?: Schema$TaskData;
    }
    /**
     * Details of the speculation task when speculative execution is enabled.
     */
    export interface Schema$SpeculationStageSummary {
        numActiveTasks?: number | null;
        numCompletedTasks?: number | null;
        numFailedTasks?: number | null;
        numKilledTasks?: number | null;
        numTasks?: number | null;
        stageAttemptId?: number | null;
        stageId?: string | null;
    }
    /**
     * SQL Execution Data
     */
    export interface Schema$SqlExecutionUiData {
        completionTime?: string | null;
        description?: string | null;
        details?: string | null;
        errorMessage?: string | null;
        executionId?: string | null;
        jobs?: {
            [key: string]: string;
        } | null;
        metrics?: Schema$SqlPlanMetric[];
        metricValues?: {
            [key: string]: string;
        } | null;
        metricValuesIsNull?: boolean | null;
        modifiedConfigs?: {
            [key: string]: string;
        } | null;
        physicalPlanDescription?: string | null;
        rootExecutionId?: string | null;
        stages?: string[] | null;
        submissionTime?: string | null;
    }
    /**
     * Metrics related to SQL execution.
     */
    export interface Schema$SqlPlanMetric {
        accumulatorId?: string | null;
        metricType?: string | null;
        name?: string | null;
    }
    /**
     * Data related to tasks summary for a Spark Stage Attempt
     */
    export interface Schema$StageAttemptTasksSummary {
        applicationId?: string | null;
        numFailedTasks?: number | null;
        numKilledTasks?: number | null;
        numPendingTasks?: number | null;
        numRunningTasks?: number | null;
        numSuccessTasks?: number | null;
        numTasks?: number | null;
        stageAttemptId?: number | null;
        stageId?: string | null;
    }
    /**
     * Data corresponding to a stage.
     */
    export interface Schema$StageData {
        accumulatorUpdates?: Schema$AccumulableInfo[];
        completionTime?: string | null;
        description?: string | null;
        details?: string | null;
        executorMetricsDistributions?: Schema$ExecutorMetricsDistributions;
        executorSummary?: {
            [key: string]: Schema$ExecutorStageSummary;
        } | null;
        failureReason?: string | null;
        firstTaskLaunchedTime?: string | null;
        isShufflePushEnabled?: boolean | null;
        jobIds?: string[] | null;
        killedTasksSummary?: {
            [key: string]: number;
        } | null;
        locality?: {
            [key: string]: string;
        } | null;
        name?: string | null;
        numActiveTasks?: number | null;
        numCompletedIndices?: number | null;
        numCompleteTasks?: number | null;
        numFailedTasks?: number | null;
        numKilledTasks?: number | null;
        numTasks?: number | null;
        parentStageIds?: string[] | null;
        peakExecutorMetrics?: Schema$ExecutorMetrics;
        rddIds?: string[] | null;
        resourceProfileId?: number | null;
        schedulingPool?: string | null;
        shuffleMergersCount?: number | null;
        speculationSummary?: Schema$SpeculationStageSummary;
        stageAttemptId?: number | null;
        stageId?: string | null;
        stageMetrics?: Schema$StageMetrics;
        status?: string | null;
        submissionTime?: string | null;
        /**
         * Summary metrics fields. These are included in response only if present in summary_metrics_mask field in request
         */
        taskQuantileMetrics?: Schema$TaskQuantileMetrics;
        tasks?: {
            [key: string]: Schema$TaskData;
        } | null;
    }
    /**
     * Metrics about the input read by the stage.
     */
    export interface Schema$StageInputMetrics {
        bytesRead?: string | null;
        recordsRead?: string | null;
    }
    /**
     * Stage Level Aggregated Metrics
     */
    export interface Schema$StageMetrics {
        diskBytesSpilled?: string | null;
        executorCpuTimeNanos?: string | null;
        executorDeserializeCpuTimeNanos?: string | null;
        executorDeserializeTimeMillis?: string | null;
        executorRunTimeMillis?: string | null;
        jvmGcTimeMillis?: string | null;
        memoryBytesSpilled?: string | null;
        peakExecutionMemoryBytes?: string | null;
        resultSerializationTimeMillis?: string | null;
        resultSize?: string | null;
        stageInputMetrics?: Schema$StageInputMetrics;
        stageOutputMetrics?: Schema$StageOutputMetrics;
        stageShuffleReadMetrics?: Schema$StageShuffleReadMetrics;
        stageShuffleWriteMetrics?: Schema$StageShuffleWriteMetrics;
    }
    /**
     * Metrics about the output written by the stage.
     */
    export interface Schema$StageOutputMetrics {
        bytesWritten?: string | null;
        recordsWritten?: string | null;
    }
    export interface Schema$StageShufflePushReadMetrics {
        corruptMergedBlockChunks?: string | null;
        localMergedBlocksFetched?: string | null;
        localMergedBytesRead?: string | null;
        localMergedChunksFetched?: string | null;
        mergedFetchFallbackCount?: string | null;
        remoteMergedBlocksFetched?: string | null;
        remoteMergedBytesRead?: string | null;
        remoteMergedChunksFetched?: string | null;
        remoteMergedReqsDuration?: string | null;
    }
    /**
     * Shuffle data read for the stage.
     */
    export interface Schema$StageShuffleReadMetrics {
        bytesRead?: string | null;
        fetchWaitTimeMillis?: string | null;
        localBlocksFetched?: string | null;
        localBytesRead?: string | null;
        recordsRead?: string | null;
        remoteBlocksFetched?: string | null;
        remoteBytesRead?: string | null;
        remoteBytesReadToDisk?: string | null;
        remoteReqsDuration?: string | null;
        stageShufflePushReadMetrics?: Schema$StageShufflePushReadMetrics;
    }
    /**
     * Shuffle data written for the stage.
     */
    export interface Schema$StageShuffleWriteMetrics {
        bytesWritten?: string | null;
        recordsWritten?: string | null;
        writeTimeNanos?: string | null;
    }
    /**
     * Data related to Stages page summary
     */
    export interface Schema$StagesSummary {
        applicationId?: string | null;
        numActiveStages?: number | null;
        numCompletedStages?: number | null;
        numFailedStages?: number | null;
        numPendingStages?: number | null;
        numSkippedStages?: number | null;
    }
    /**
     * A request to start a cluster.
     */
    export interface Schema$StartClusterRequest {
        /**
         * Optional. Specifying the cluster_uuid means the RPC will fail (with error NOT_FOUND) if a cluster with the specified UUID does not exist.
         */
        clusterUuid?: string | null;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two StartClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.StartClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Configuration to handle the startup of instances during cluster create and update process.
     */
    export interface Schema$StartupConfig {
        /**
         * Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).
         */
        requiredRegistrationFraction?: number | null;
    }
    /**
     * Historical state information.
     */
    export interface Schema$StateHistory {
        /**
         * Output only. The state of the batch at this point in history.
         */
        state?: string | null;
        /**
         * Output only. Details about the state at this point in history.
         */
        stateMessage?: string | null;
        /**
         * Output only. The time when the batch entered the historical state.
         */
        stateStartTime?: string | null;
    }
    export interface Schema$StateOperatorProgress {
        allRemovalsTimeMs?: string | null;
        allUpdatesTimeMs?: string | null;
        commitTimeMs?: string | null;
        customMetrics?: {
            [key: string]: string;
        } | null;
        memoryUsedBytes?: string | null;
        numRowsDroppedByWatermark?: string | null;
        numRowsRemoved?: string | null;
        numRowsTotal?: string | null;
        numRowsUpdated?: string | null;
        numShufflePartitions?: string | null;
        numStateStoreInstances?: string | null;
        operatorName?: string | null;
    }
    /**
     * The Status type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by gRPC (https://github.com/grpc). Each Status message contains three pieces of data: error code, error message, and error details.You can find out more about this error model and how to work with it in the API Design Guide (https://cloud.google.com/apis/design/errors).
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
     * A request to stop a cluster.
     */
    export interface Schema$StopClusterRequest {
        /**
         * Optional. Specifying the cluster_uuid means the RPC will fail (with error NOT_FOUND) if a cluster with the specified UUID does not exist.
         */
        clusterUuid?: string | null;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two StopClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.StopClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Stream Block Data.
     */
    export interface Schema$StreamBlockData {
        deserialized?: boolean | null;
        diskSize?: string | null;
        executorId?: string | null;
        hostPort?: string | null;
        memSize?: string | null;
        name?: string | null;
        storageLevel?: string | null;
        useDisk?: boolean | null;
        useMemory?: boolean | null;
    }
    /**
     * Streaming
     */
    export interface Schema$StreamingQueryData {
        endTimestamp?: string | null;
        exception?: string | null;
        isActive?: boolean | null;
        name?: string | null;
        runId?: string | null;
        startTimestamp?: string | null;
        streamingQueryId?: string | null;
    }
    export interface Schema$StreamingQueryProgress {
        batchDuration?: string | null;
        batchId?: string | null;
        durationMillis?: {
            [key: string]: string;
        } | null;
        eventTime?: {
            [key: string]: string;
        } | null;
        name?: string | null;
        observedMetrics?: {
            [key: string]: string;
        } | null;
        runId?: string | null;
        sink?: Schema$SinkProgress;
        sources?: Schema$SourceProgress[];
        stateOperators?: Schema$StateOperatorProgress[];
        streamingQueryProgressId?: string | null;
        timestamp?: string | null;
    }
    /**
     * A request to submit a job.
     */
    export interface Schema$SubmitJobRequest {
        /**
         * Required. The job resource.
         */
        job?: Schema$Job;
        /**
         * Optional. A unique id used to identify the request. If the server receives two SubmitJobRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.SubmitJobRequest)s with the same id, then the second request will be ignored and the first Job created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The id must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Consolidated summary of executors for a Spark Application.
     */
    export interface Schema$SummarizeSessionSparkApplicationExecutorsResponse {
        /**
         * Consolidated summary for active executors.
         */
        activeExecutorSummary?: Schema$ConsolidatedExecutorSummary;
        /**
         * Spark Application Id
         */
        applicationId?: string | null;
        /**
         * Consolidated summary for dead executors.
         */
        deadExecutorSummary?: Schema$ConsolidatedExecutorSummary;
        /**
         * Overall consolidated summary for all executors.
         */
        totalExecutorSummary?: Schema$ConsolidatedExecutorSummary;
    }
    /**
     * Summary of a Spark Application jobs.
     */
    export interface Schema$SummarizeSessionSparkApplicationJobsResponse {
        /**
         * Summary of a Spark Application Jobs
         */
        jobsSummary?: Schema$JobsSummary;
    }
    /**
     * Summary of tasks for a Spark Application stage attempt.
     */
    export interface Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse {
        /**
         * Summary of tasks for a Spark Application Stage Attempt
         */
        stageAttemptTasksSummary?: Schema$StageAttemptTasksSummary;
    }
    /**
     * Summary of a Spark Application stages.
     */
    export interface Schema$SummarizeSessionSparkApplicationStagesResponse {
        /**
         * Summary of a Spark Application Stages
         */
        stagesSummary?: Schema$StagesSummary;
    }
    /**
     * Consolidated summary of executors for a Spark Application.
     */
    export interface Schema$SummarizeSparkApplicationExecutorsResponse {
        /**
         * Consolidated summary for active executors.
         */
        activeExecutorSummary?: Schema$ConsolidatedExecutorSummary;
        /**
         * Spark Application Id
         */
        applicationId?: string | null;
        /**
         * Consolidated summary for dead executors.
         */
        deadExecutorSummary?: Schema$ConsolidatedExecutorSummary;
        /**
         * Overall consolidated summary for all executors.
         */
        totalExecutorSummary?: Schema$ConsolidatedExecutorSummary;
    }
    /**
     * Summary of a Spark Application jobs.
     */
    export interface Schema$SummarizeSparkApplicationJobsResponse {
        /**
         * Summary of a Spark Application Jobs
         */
        jobsSummary?: Schema$JobsSummary;
    }
    /**
     * Summary of tasks for a Spark Application stage attempt.
     */
    export interface Schema$SummarizeSparkApplicationStageAttemptTasksResponse {
        /**
         * Summary of tasks for a Spark Application Stage Attempt
         */
        stageAttemptTasksSummary?: Schema$StageAttemptTasksSummary;
    }
    /**
     * Summary of a Spark Application stages.
     */
    export interface Schema$SummarizeSparkApplicationStagesResponse {
        /**
         * Summary of a Spark Application Stages
         */
        stagesSummary?: Schema$StagesSummary;
    }
    /**
     * Data corresponding to tasks created by spark.
     */
    export interface Schema$TaskData {
        accumulatorUpdates?: Schema$AccumulableInfo[];
        attempt?: number | null;
        durationMillis?: string | null;
        errorMessage?: string | null;
        executorId?: string | null;
        executorLogs?: {
            [key: string]: string;
        } | null;
        gettingResultTimeMillis?: string | null;
        hasMetrics?: boolean | null;
        host?: string | null;
        index?: number | null;
        launchTime?: string | null;
        partitionId?: number | null;
        resultFetchStart?: string | null;
        schedulerDelayMillis?: string | null;
        speculative?: boolean | null;
        stageAttemptId?: number | null;
        stageId?: string | null;
        status?: string | null;
        taskId?: string | null;
        taskLocality?: string | null;
        taskMetrics?: Schema$TaskMetrics;
    }
    /**
     * Executor Task Metrics
     */
    export interface Schema$TaskMetrics {
        diskBytesSpilled?: string | null;
        executorCpuTimeNanos?: string | null;
        executorDeserializeCpuTimeNanos?: string | null;
        executorDeserializeTimeMillis?: string | null;
        executorRunTimeMillis?: string | null;
        inputMetrics?: Schema$InputMetrics;
        jvmGcTimeMillis?: string | null;
        memoryBytesSpilled?: string | null;
        outputMetrics?: Schema$OutputMetrics;
        peakExecutionMemoryBytes?: string | null;
        resultSerializationTimeMillis?: string | null;
        resultSize?: string | null;
        shuffleReadMetrics?: Schema$ShuffleReadMetrics;
        shuffleWriteMetrics?: Schema$ShuffleWriteMetrics;
    }
    export interface Schema$TaskQuantileMetrics {
        diskBytesSpilled?: Schema$Quantiles;
        durationMillis?: Schema$Quantiles;
        executorCpuTimeNanos?: Schema$Quantiles;
        executorDeserializeCpuTimeNanos?: Schema$Quantiles;
        executorDeserializeTimeMillis?: Schema$Quantiles;
        executorRunTimeMillis?: Schema$Quantiles;
        gettingResultTimeMillis?: Schema$Quantiles;
        inputMetrics?: Schema$InputQuantileMetrics;
        jvmGcTimeMillis?: Schema$Quantiles;
        memoryBytesSpilled?: Schema$Quantiles;
        outputMetrics?: Schema$OutputQuantileMetrics;
        peakExecutionMemoryBytes?: Schema$Quantiles;
        resultSerializationTimeMillis?: Schema$Quantiles;
        resultSize?: Schema$Quantiles;
        schedulerDelayMillis?: Schema$Quantiles;
        shuffleReadMetrics?: Schema$ShuffleReadQuantileMetrics;
        shuffleWriteMetrics?: Schema$ShuffleWriteQuantileMetrics;
    }
    /**
     * Resources used per task created by the application.
     */
    export interface Schema$TaskResourceRequest {
        amount?: number | null;
        resourceName?: string | null;
    }
    /**
     * A configurable parameter that replaces one or more fields in the template. Parameterizable fields: - Labels - File uris - Job properties - Job arguments - Script variables - Main class (in HadoopJob and SparkJob) - Zone (in ClusterSelector)
     */
    export interface Schema$TemplateParameter {
        /**
         * Optional. Brief description of the parameter. Must not exceed 1024 characters.
         */
        description?: string | null;
        /**
         * Required. Paths to all fields that the parameter replaces. A field is allowed to appear in at most one parameter's list of field paths.A field path is similar in syntax to a google.protobuf.FieldMask. For example, a field path that references the zone field of a workflow template's cluster selector would be specified as placement.clusterSelector.zone.Also, field paths can reference fields using the following syntax: Values in maps can be referenced by key: labels'key' placement.clusterSelector.clusterLabels'key' placement.managedCluster.labels'key' placement.clusterSelector.clusterLabels'key' jobs'step-id'.labels'key' Jobs in the jobs list can be referenced by step-id: jobs'step-id'.hadoopJob.mainJarFileUri jobs'step-id'.hiveJob.queryFileUri jobs'step-id'.pySparkJob.mainPythonFileUri jobs'step-id'.hadoopJob.jarFileUris0 jobs'step-id'.hadoopJob.archiveUris0 jobs'step-id'.hadoopJob.fileUris0 jobs'step-id'.pySparkJob.pythonFileUris0 Items in repeated fields can be referenced by a zero-based index: jobs'step-id'.sparkJob.args0 Other examples: jobs'step-id'.hadoopJob.properties'key' jobs'step-id'.hadoopJob.args0 jobs'step-id'.hiveJob.scriptVariables'key' jobs'step-id'.hadoopJob.mainJarFileUri placement.clusterSelector.zoneIt may not be possible to parameterize maps and repeated fields in their entirety since only individual map values and individual items in repeated fields can be referenced. For example, the following field paths are invalid: placement.clusterSelector.clusterLabels jobs'step-id'.sparkJob.args
         */
        fields?: string[] | null;
        /**
         * Required. Parameter name. The parameter name is used as the key, and paired with the parameter value, which are passed to the template when the template is instantiated. The name must contain only capital letters (A-Z), numbers (0-9), and underscores (_), and must not start with a number. The maximum length is 40 characters.
         */
        name?: string | null;
        /**
         * Optional. Validation rules to be applied to this parameter's value.
         */
        validation?: Schema$ParameterValidation;
    }
    /**
     * A request to terminate an interactive session.
     */
    export interface Schema$TerminateSessionRequest {
        /**
         * Optional. A unique ID used to identify the request. If the service receives two TerminateSessionRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.TerminateSessionRequest)s with the same ID, the second request is ignored.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The value must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string | null;
    }
    /**
     * Request message for TestIamPermissions method.
     */
    export interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the resource. Permissions with wildcards (such as * or storage.*) are not allowed. For more information see IAM Overview (https://cloud.google.com/iam/docs/overview#permissions).
         */
        permissions?: string[] | null;
    }
    /**
     * Response message for TestIamPermissions method.
     */
    export interface Schema$TestIamPermissionsResponse {
        /**
         * A subset of TestPermissionsRequest.permissions that the caller is allowed.
         */
        permissions?: string[] | null;
    }
    /**
     * A Dataproc job for running Trino (https://trino.io/) queries. IMPORTANT: The Dataproc Trino Optional Component (https://cloud.google.com/dataproc/docs/concepts/components/trino) must be enabled when the cluster is created to submit a Trino job to the cluster.
     */
    export interface Schema$TrinoJob {
        /**
         * Optional. Trino client tags to attach to this query
         */
        clientTags?: string[] | null;
        /**
         * Optional. Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
         */
        continueOnFailure?: boolean | null;
        /**
         * Optional. The runtime log config for job execution.
         */
        loggingConfig?: Schema$LoggingConfig;
        /**
         * Optional. The format in which query output will be displayed. See the Trino documentation for supported output formats
         */
        outputFormat?: string | null;
        /**
         * Optional. A mapping of property names to values. Used to set Trino session properties (https://trino.io/docs/current/sql/set-session.html) Equivalent to using the --session flag in the Trino CLI
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * The HCFS URI of the script that contains SQL queries.
         */
        queryFileUri?: string | null;
        /**
         * A list of queries.
         */
        queryList?: Schema$QueryList;
    }
    /**
     * Usage metrics represent approximate total resources consumed by a workload.
     */
    export interface Schema$UsageMetrics {
        /**
         * Optional. Accelerator type being used, if any
         */
        acceleratorType?: string | null;
        /**
         * Optional. Accelerator usage in (milliAccelerator x seconds) (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).
         */
        milliAcceleratorSeconds?: string | null;
        /**
         * Optional. DCU (Dataproc Compute Units) usage in (milliDCU x seconds) (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).
         */
        milliDcuSeconds?: string | null;
        /**
         * Optional. Slot usage in (milliSlot x seconds).
         */
        milliSlotSeconds?: string | null;
        /**
         * Optional. Shuffle storage usage in (GB x seconds) (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).
         */
        shuffleStorageGbSeconds?: string | null;
        /**
         * Optional. The timestamp of the usage metrics.
         */
        updateTime?: string | null;
    }
    /**
     * The usage snapshot represents the resources consumed by a workload at a specified time.
     */
    export interface Schema$UsageSnapshot {
        /**
         * Optional. Accelerator type being used, if any
         */
        acceleratorType?: string | null;
        /**
         * Optional. Milli (one-thousandth) accelerator. (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing))
         */
        milliAccelerator?: string | null;
        /**
         * Optional. Milli (one-thousandth) Dataproc Compute Units (DCUs) (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).
         */
        milliDcu?: string | null;
        /**
         * Optional. Milli (one-thousandth) Dataproc Compute Units (DCUs) charged at premium tier (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing)).
         */
        milliDcuPremium?: string | null;
        /**
         * Optional. Milli (one-thousandth) Slot usage of the workload.
         */
        milliSlot?: string | null;
        /**
         * Optional. Shuffle Storage in gigabytes (GB). (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing))
         */
        shuffleStorageGb?: string | null;
        /**
         * Optional. Shuffle Storage in gigabytes (GB) charged at premium tier. (see Dataproc Serverless pricing (https://cloud.google.com/dataproc-serverless/pricing))
         */
        shuffleStorageGbPremium?: string | null;
        /**
         * Optional. The timestamp of the usage snapshot.
         */
        snapshotTime?: string | null;
    }
    /**
     * Validation based on a list of allowed values.
     */
    export interface Schema$ValueValidation {
        /**
         * Required. List of allowed values for the parameter.
         */
        values?: string[] | null;
    }
    /**
     * The Dataproc cluster config for a cluster that does not directly control the underlying compute resources, such as a Dataproc-on-GKE cluster (https://cloud.google.com/dataproc/docs/guides/dpgke/dataproc-gke-overview).
     */
    export interface Schema$VirtualClusterConfig {
        /**
         * Optional. Configuration of auxiliary services used by this cluster.
         */
        auxiliaryServicesConfig?: Schema$AuxiliaryServicesConfig;
        /**
         * Required. The configuration for running the Dataproc cluster on Kubernetes.
         */
        kubernetesClusterConfig?: Schema$KubernetesClusterConfig;
        /**
         * Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, Cloud Dataproc will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see Dataproc staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.
         */
        stagingBucket?: string | null;
    }
    /**
     * The workflow graph.
     */
    export interface Schema$WorkflowGraph {
        /**
         * Output only. The workflow nodes.
         */
        nodes?: Schema$WorkflowNode[];
    }
    /**
     * A Dataproc workflow template resource.
     */
    export interface Schema$WorkflowMetadata {
        /**
         * Output only. The name of the target cluster.
         */
        clusterName?: string | null;
        /**
         * Output only. The UUID of target cluster.
         */
        clusterUuid?: string | null;
        /**
         * Output only. The create cluster operation metadata.
         */
        createCluster?: Schema$ClusterOperation;
        /**
         * Output only. DAG end time, only set for workflows with dag_timeout when DAG ends.
         */
        dagEndTime?: string | null;
        /**
         * Output only. DAG start time, only set for workflows with dag_timeout when DAG begins.
         */
        dagStartTime?: string | null;
        /**
         * Output only. The timeout duration for the DAG of jobs, expressed in seconds (see JSON representation of duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).
         */
        dagTimeout?: string | null;
        /**
         * Output only. The delete cluster operation metadata.
         */
        deleteCluster?: Schema$ClusterOperation;
        /**
         * Output only. Workflow end time.
         */
        endTime?: string | null;
        /**
         * Output only. The workflow graph.
         */
        graph?: Schema$WorkflowGraph;
        /**
         * Map from parameter names to values that were used for those parameters.
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Workflow start time.
         */
        startTime?: string | null;
        /**
         * Output only. The workflow state.
         */
        state?: string | null;
        /**
         * Output only. The resource name of the workflow template as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        template?: string | null;
        /**
         * Output only. The version of template at the time of workflow instantiation.
         */
        version?: number | null;
    }
    /**
     * The workflow node.
     */
    export interface Schema$WorkflowNode {
        /**
         * Output only. The error detail.
         */
        error?: string | null;
        /**
         * Output only. The job id; populated after the node enters RUNNING state.
         */
        jobId?: string | null;
        /**
         * Output only. Node's prerequisite nodes.
         */
        prerequisiteStepIds?: string[] | null;
        /**
         * Output only. The node state.
         */
        state?: string | null;
        /**
         * Output only. The name of the node.
         */
        stepId?: string | null;
    }
    /**
     * A Dataproc workflow template resource.
     */
    export interface Schema$WorkflowTemplate {
        /**
         * Output only. The time template was created.
         */
        createTime?: string | null;
        /**
         * Optional. Timeout duration for the DAG of jobs, expressed in seconds (see JSON representation of duration (https://developers.google.com/protocol-buffers/docs/proto3#json)). The timeout duration must be from 10 minutes ("600s") to 24 hours ("86400s"). The timer begins when the first job is submitted. If the workflow is running at the end of the timeout period, any remaining jobs are cancelled, the workflow is ended, and if the workflow was running on a managed cluster, the cluster is deleted.
         */
        dagTimeout?: string | null;
        /**
         * Optional. Encryption settings for encrypting workflow template job arguments.
         */
        encryptionConfig?: Schema$GoogleCloudDataprocV1WorkflowTemplateEncryptionConfig;
        id?: string | null;
        /**
         * Required. The Directed Acyclic Graph of Jobs to submit.
         */
        jobs?: Schema$OrderedJob[];
        /**
         * Optional. The labels to associate with this template. These labels will be propagated to all jobs and clusters created by the workflow instance.Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt).Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt).No more than 32 labels can be associated with a template.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string | null;
        /**
         * Optional. Template parameters whose values are substituted into the template. Values for parameters must be provided when the template is instantiated.
         */
        parameters?: Schema$TemplateParameter[];
        /**
         * Required. WorkflowTemplate scheduling information.
         */
        placement?: Schema$WorkflowTemplatePlacement;
        /**
         * Output only. The time template was last updated.
         */
        updateTime?: string | null;
        /**
         * Optional. Used to perform a consistent read-modify-write.This field should be left blank for a CreateWorkflowTemplate request. It is required for an UpdateWorkflowTemplate request, and must match the current server version. A typical update template flow would fetch the current template with a GetWorkflowTemplate request, which will return the current template with the version field filled in with the current server version. The user updates other fields in the template, then returns it as part of the UpdateWorkflowTemplate request.
         */
        version?: number | null;
    }
    /**
     * Specifies workflow execution target.Either managed_cluster or cluster_selector is required.
     */
    export interface Schema$WorkflowTemplatePlacement {
        /**
         * Optional. A selector that chooses target cluster for jobs based on metadata.The selector is evaluated at the time each job is submitted.
         */
        clusterSelector?: Schema$ClusterSelector;
        /**
         * A cluster that is managed by the workflow.
         */
        managedCluster?: Schema$ManagedCluster;
    }
    /**
     * Write Spark Application data to internal storage systems
     */
    export interface Schema$WriteSessionSparkApplicationContextRequest {
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string | null;
        /**
         * Required. The batch of spark application context objects sent for ingestion.
         */
        sparkWrapperObjects?: Schema$SparkWrapperObject[];
    }
    /**
     * Response returned as an acknowledgement of receipt of data.
     */
    export interface Schema$WriteSessionSparkApplicationContextResponse {
    }
    /**
     * Write Spark Application data to internal storage systems
     */
    export interface Schema$WriteSparkApplicationContextRequest {
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string | null;
        sparkWrapperObjects?: Schema$SparkWrapperObject[];
    }
    /**
     * Response returned as an acknowledgement of receipt of data.
     */
    export interface Schema$WriteSparkApplicationContextResponse {
    }
    /**
     * A YARN application created by a job. Application information is a subset of org.apache.hadoop.yarn.proto.YarnProtos.ApplicationReportProto.Beta Feature: This report is available for testing purposes only. It may be changed before final release.
     */
    export interface Schema$YarnApplication {
        /**
         * Required. The application name.
         */
        name?: string | null;
        /**
         * Required. The numerical progress of the application, from 1 to 100.
         */
        progress?: number | null;
        /**
         * Required. The application state.
         */
        state?: string | null;
        /**
         * Optional. The HTTP URL of the ApplicationMaster, HistoryServer, or TimelineServer that provides application-specific information. The URL uses the internal hostname, and requires a proxy server for resolution and, possibly, access.
         */
        trackingUrl?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        regions: Resource$Projects$Regions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        autoscalingPolicies: Resource$Projects$Locations$Autoscalingpolicies;
        batches: Resource$Projects$Locations$Batches;
        operations: Resource$Projects$Locations$Operations;
        sessions: Resource$Projects$Locations$Sessions;
        sessionTemplates: Resource$Projects$Locations$Sessiontemplates;
        workflowTemplates: Resource$Projects$Locations$Workflowtemplates;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Autoscalingpolicies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates new autoscaling policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        create(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Create, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        create(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Create, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        create(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        /**
         * Deletes an autoscaling policy. It is an error to delete an autoscaling policy that is in use by one or more clusters.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves autoscaling policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        get(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Get, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        get(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Get, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        get(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists autoscaling policies in the project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Autoscalingpolicies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAutoscalingPoliciesResponse>>;
        list(params: Params$Resource$Projects$Locations$Autoscalingpolicies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Autoscalingpolicies$List, options: MethodOptions | BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>, callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Autoscalingpolicies$List, callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Updates (replaces) autoscaling policy.Disabled check for update_mask, because all updates will be full replacements.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Autoscalingpolicies$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        update(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Update, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        update(params: Params$Resource$Projects$Locations$Autoscalingpolicies$Update, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        update(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Create extends StandardParameters {
        /**
         * Required. The "resource name" of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.create, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.autoscalingPolicies.create, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AutoscalingPolicy;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Delete extends StandardParameters {
        /**
         * Required. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.delete, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies.delete, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Get extends StandardParameters {
        /**
         * Required. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.get, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies.get, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return in each response. Must be less than or equal to 1000. Defaults to 100.
         */
        pageSize?: number;
        /**
         * Optional. The page token, returned by a previous call, to request the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The "resource name" of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.list, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.autoscalingPolicies.list, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Autoscalingpolicies$Update extends StandardParameters {
        /**
         * Output only. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AutoscalingPolicy;
    }
    export class Resource$Projects$Locations$Batches {
        context: APIRequestContext;
        sparkApplications: Resource$Projects$Locations$Batches$Sparkapplications;
        constructor(context: APIRequestContext);
        /**
         * Analyze a Batch for possible recommendations and insights.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        analyze(params: Params$Resource$Projects$Locations$Batches$Analyze, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        analyze(params?: Params$Resource$Projects$Locations$Batches$Analyze, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        analyze(params: Params$Resource$Projects$Locations$Batches$Analyze, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        analyze(params: Params$Resource$Projects$Locations$Batches$Analyze, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        analyze(params: Params$Resource$Projects$Locations$Batches$Analyze, callback: BodyResponseCallback<Schema$Operation>): void;
        analyze(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a batch workload that executes asynchronously.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Batches$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Batches$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Batches$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Batches$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Batches$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the batch workload resource. If the batch is not in a CANCELLED, SUCCEEDED or FAILED State, the delete operation fails and the response returns FAILED_PRECONDITION.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Batches$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Batches$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Batches$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Batches$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Batches$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the batch workload resource representation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Batches$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Batches$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Batch>>;
        get(params: Params$Resource$Projects$Locations$Batches$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Batches$Get, options: MethodOptions | BodyResponseCallback<Schema$Batch>, callback: BodyResponseCallback<Schema$Batch>): void;
        get(params: Params$Resource$Projects$Locations$Batches$Get, callback: BodyResponseCallback<Schema$Batch>): void;
        get(callback: BodyResponseCallback<Schema$Batch>): void;
        /**
         * Lists batch workloads.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Batches$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Batches$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBatchesResponse>>;
        list(params: Params$Resource$Projects$Locations$Batches$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Batches$List, options: MethodOptions | BodyResponseCallback<Schema$ListBatchesResponse>, callback: BodyResponseCallback<Schema$ListBatchesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Batches$List, callback: BodyResponseCallback<Schema$ListBatchesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBatchesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Batches$Analyze extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to analyze in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnalyzeBatchRequest;
    }
    export interface Params$Resource$Projects$Locations$Batches$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the batch, which will become the final component of the batch's resource name.This value must be 4-63 characters. Valid characters are /[a-z][0-9]-/.
         */
        batchId?: string;
        /**
         * Required. The parent resource where this batch will be created.
         */
        parent?: string;
        /**
         * Optional. A unique ID used to identify the request. If the service receives two CreateBatchRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateBatchRequest)s with the same request_id, the second request is ignored and the Operation that corresponds to the first Batch created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The value must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Batch;
    }
    export interface Params$Resource$Projects$Locations$Batches$Delete extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Get extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$List extends StandardParameters {
        /**
         * Optional. A filter for the batches to return in the response.A filter is a logical expression constraining the values of various fields in each batch resource. Filters are case sensitive, and may contain multiple clauses combined with logical operators (AND/OR). Supported fields are batch_id, batch_uuid, state, create_time, and labels.e.g. state = RUNNING and create_time < "2023-01-01T00:00:00Z" filters for batches in state RUNNING that were created before 2023-01-01. state = RUNNING and labels.environment=production filters for batches in state in a RUNNING state that have a production environment label.See https://google.aip.dev/assets/misc/ebnf-filtering.txt for a detailed description of the filter syntax and a list of supported comparisons.
         */
        filter?: string;
        /**
         * Optional. Field(s) on which to sort the list of batches.Currently the only supported sort orders are unspecified (empty) and create_time desc to sort by most recently created batches first.See https://google.aip.dev/132#ordering for more details.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of batches to return in each response. The service may return fewer than this value. The default page size is 20; the maximum page size is 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous ListBatches call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of batches.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Batches$Sparkapplications {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Obtain high level information corresponding to a single Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        access(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Access, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        access(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Access, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationResponse>>;
        access(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Access, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        access(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Access, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationResponse>): void;
        access(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Access, callback: BodyResponseCallback<Schema$AccessSparkApplicationResponse>): void;
        access(callback: BodyResponseCallback<Schema$AccessSparkApplicationResponse>): void;
        /**
         * Obtain environment details for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessEnvironmentInfo(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationEnvironmentInfoResponse>>;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationEnvironmentInfoResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationEnvironmentInfoResponse>): void;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo, callback: BodyResponseCallback<Schema$AccessSparkApplicationEnvironmentInfoResponse>): void;
        accessEnvironmentInfo(callback: BodyResponseCallback<Schema$AccessSparkApplicationEnvironmentInfoResponse>): void;
        /**
         * Obtain data corresponding to a spark job for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessJob(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessJob(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationJobResponse>>;
        accessJob(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessJob(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationJobResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationJobResponse>): void;
        accessJob(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob, callback: BodyResponseCallback<Schema$AccessSparkApplicationJobResponse>): void;
        accessJob(callback: BodyResponseCallback<Schema$AccessSparkApplicationJobResponse>): void;
        /**
         * Obtain build data for Native Job
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessNativeBuildInfo(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationNativeBuildInfoResponse>>;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationNativeBuildInfoResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeBuildInfoResponse>): void;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo, callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeBuildInfoResponse>): void;
        accessNativeBuildInfo(callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeBuildInfoResponse>): void;
        /**
         * Obtain data corresponding to a particular Native SQL Query for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessNativeSqlQuery(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationNativeSqlQueryResponse>>;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationNativeSqlQueryResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeSqlQueryResponse>): void;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery, callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeSqlQueryResponse>): void;
        accessNativeSqlQuery(callback: BodyResponseCallback<Schema$AccessSparkApplicationNativeSqlQueryResponse>): void;
        /**
         * Obtain Spark Plan Graph for a Spark Application SQL execution. Limits the number of clusters returned as part of the graph to 10000.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessSqlPlan(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessSqlPlan(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationSqlSparkPlanGraphResponse>>;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationSqlSparkPlanGraphResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlSparkPlanGraphResponse>): void;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan, callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlSparkPlanGraphResponse>): void;
        accessSqlPlan(callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlSparkPlanGraphResponse>): void;
        /**
         * Obtain data corresponding to a particular SQL Query for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessSqlQuery(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationSqlQueryResponse>>;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationSqlQueryResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlQueryResponse>): void;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery, callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlQueryResponse>): void;
        accessSqlQuery(callback: BodyResponseCallback<Schema$AccessSparkApplicationSqlQueryResponse>): void;
        /**
         * Obtain data corresponding to a spark stage attempt for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessStageAttempt(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessStageAttempt(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationStageAttemptResponse>>;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationStageAttemptResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationStageAttemptResponse>): void;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt, callback: BodyResponseCallback<Schema$AccessSparkApplicationStageAttemptResponse>): void;
        accessStageAttempt(callback: BodyResponseCallback<Schema$AccessSparkApplicationStageAttemptResponse>): void;
        /**
         * Obtain RDD operation graph for a Spark Application Stage. Limits the number of clusters returned as part of the graph to 10000.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessStageRddGraph(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSparkApplicationStageRddOperationGraphResponse>>;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph, options: MethodOptions | BodyResponseCallback<Schema$AccessSparkApplicationStageRddOperationGraphResponse>, callback: BodyResponseCallback<Schema$AccessSparkApplicationStageRddOperationGraphResponse>): void;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph, callback: BodyResponseCallback<Schema$AccessSparkApplicationStageRddOperationGraphResponse>): void;
        accessStageRddGraph(callback: BodyResponseCallback<Schema$AccessSparkApplicationStageRddOperationGraphResponse>): void;
        /**
         * Obtain high level information and list of Spark Applications corresponding to a batch
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationsResponse>>;
        search(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Search, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationsResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationsResponse>): void;
        search(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Search, callback: BodyResponseCallback<Schema$SearchSparkApplicationsResponse>): void;
        search(callback: BodyResponseCallback<Schema$SearchSparkApplicationsResponse>): void;
        /**
         * Obtain data corresponding to executors for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchExecutors(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationExecutorsResponse>>;
        searchExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationExecutorsResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorsResponse>): void;
        searchExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors, callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorsResponse>): void;
        searchExecutors(callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorsResponse>): void;
        /**
         * Obtain executor summary with respect to a spark stage attempt.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchExecutorStageSummary(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationExecutorStageSummaryResponse>>;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationExecutorStageSummaryResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorStageSummaryResponse>): void;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary, callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorStageSummaryResponse>): void;
        searchExecutorStageSummary(callback: BodyResponseCallback<Schema$SearchSparkApplicationExecutorStageSummaryResponse>): void;
        /**
         * Obtain list of spark jobs corresponding to a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchJobs(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationJobsResponse>>;
        searchJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationJobsResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationJobsResponse>): void;
        searchJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs, callback: BodyResponseCallback<Schema$SearchSparkApplicationJobsResponse>): void;
        searchJobs(callback: BodyResponseCallback<Schema$SearchSparkApplicationJobsResponse>): void;
        /**
         * Obtain data corresponding to Native SQL Queries for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchNativeSqlQueries(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationNativeSqlQueriesResponse>>;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationNativeSqlQueriesResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationNativeSqlQueriesResponse>): void;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries, callback: BodyResponseCallback<Schema$SearchSparkApplicationNativeSqlQueriesResponse>): void;
        searchNativeSqlQueries(callback: BodyResponseCallback<Schema$SearchSparkApplicationNativeSqlQueriesResponse>): void;
        /**
         * Obtain data corresponding to SQL Queries for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchSqlQueries(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationSqlQueriesResponse>>;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationSqlQueriesResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationSqlQueriesResponse>): void;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries, callback: BodyResponseCallback<Schema$SearchSparkApplicationSqlQueriesResponse>): void;
        searchSqlQueries(callback: BodyResponseCallback<Schema$SearchSparkApplicationSqlQueriesResponse>): void;
        /**
         * Obtain data corresponding to a spark stage attempts for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStageAttempts(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStageAttempts(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationStageAttemptsResponse>>;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptsResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptsResponse>): void;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts, callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptsResponse>): void;
        searchStageAttempts(callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptsResponse>): void;
        /**
         * Obtain data corresponding to tasks for a spark stage attempt for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStageAttemptTasks(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationStageAttemptTasksResponse>>;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptTasksResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptTasksResponse>): void;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks, callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptTasksResponse>): void;
        searchStageAttemptTasks(callback: BodyResponseCallback<Schema$SearchSparkApplicationStageAttemptTasksResponse>): void;
        /**
         * Obtain data corresponding to stages for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStages(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSparkApplicationStagesResponse>>;
        searchStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages, options: MethodOptions | BodyResponseCallback<Schema$SearchSparkApplicationStagesResponse>, callback: BodyResponseCallback<Schema$SearchSparkApplicationStagesResponse>): void;
        searchStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages, callback: BodyResponseCallback<Schema$SearchSparkApplicationStagesResponse>): void;
        searchStages(callback: BodyResponseCallback<Schema$SearchSparkApplicationStagesResponse>): void;
        /**
         * Obtain summary of Executor Summary for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeExecutors(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSparkApplicationExecutorsResponse>>;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSparkApplicationExecutorsResponse>, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationExecutorsResponse>): void;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationExecutorsResponse>): void;
        summarizeExecutors(callback: BodyResponseCallback<Schema$SummarizeSparkApplicationExecutorsResponse>): void;
        /**
         * Obtain summary of Jobs for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeJobs(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSparkApplicationJobsResponse>>;
        summarizeJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSparkApplicationJobsResponse>, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationJobsResponse>): void;
        summarizeJobs(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationJobsResponse>): void;
        summarizeJobs(callback: BodyResponseCallback<Schema$SummarizeSparkApplicationJobsResponse>): void;
        /**
         * Obtain summary of Tasks for a Spark Application Stage Attempt
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeStageAttemptTasks(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSparkApplicationStageAttemptTasksResponse>>;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSparkApplicationStageAttemptTasksResponse>, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStageAttemptTasksResponse>): void;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStageAttemptTasksResponse>): void;
        summarizeStageAttemptTasks(callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStageAttemptTasksResponse>): void;
        /**
         * Obtain summary of Stages for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeStages(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSparkApplicationStagesResponse>>;
        summarizeStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSparkApplicationStagesResponse>, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStagesResponse>): void;
        summarizeStages(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages, callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStagesResponse>): void;
        summarizeStages(callback: BodyResponseCallback<Schema$SummarizeSparkApplicationStagesResponse>): void;
        /**
         * Write wrapper objects from dataplane to spanner
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        write(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Write, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        write(params?: Params$Resource$Projects$Locations$Batches$Sparkapplications$Write, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WriteSparkApplicationContextResponse>>;
        write(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Write, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        write(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Write, options: MethodOptions | BodyResponseCallback<Schema$WriteSparkApplicationContextResponse>, callback: BodyResponseCallback<Schema$WriteSparkApplicationContextResponse>): void;
        write(params: Params$Resource$Projects$Locations$Batches$Sparkapplications$Write, callback: BodyResponseCallback<Schema$WriteSparkApplicationContextResponse>): void;
        write(callback: BodyResponseCallback<Schema$WriteSparkApplicationContextResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Access extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessenvironmentinfo extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessjob extends StandardParameters {
        /**
         * Required. Job ID to fetch data for.
         */
        jobId?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativebuildinfo extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessnativesqlquery extends StandardParameters {
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlplan extends StandardParameters {
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accesssqlquery extends StandardParameters {
        /**
         * Optional. Lists/ hides details of Spark plan nodes. True is set to list and false to hide.
         */
        details?: boolean;
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Optional. Enables/ disables physical plan description on demand
         */
        planDescription?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstageattempt extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Accessstagerddgraph extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Search extends StandardParameters {
        /**
         * Optional. Search only applications in the chosen state.
         */
        applicationStatus?: string;
        /**
         * Optional. Latest end timestamp to list.
         */
        maxEndTime?: string;
        /**
         * Optional. Latest start timestamp to list.
         */
        maxTime?: string;
        /**
         * Optional. Earliest end timestamp to list.
         */
        minEndTime?: string;
        /**
         * Optional. Earliest start timestamp to list.
         */
        minTime?: string;
        /**
         * Optional. Maximum number of applications to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSparkApplications call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutors extends StandardParameters {
        /**
         * Optional. Filter to select whether active/ dead or all executors should be selected.
         */
        executorStatus?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of executors to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous AccessSparkApplicationExecutorsList call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchexecutorstagesummary extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of executors to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous AccessSparkApplicationExecutorsList call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchjobs extends StandardParameters {
        /**
         * Optional. List only jobs in the specific state.
         */
        jobStatus?: string;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of jobs to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSparkApplicationJobs call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchnativesqlqueries extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of queries to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSparkApplicationNativeSqlQueries call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchsqlqueries extends StandardParameters {
        /**
         * Optional. Lists/ hides details of Spark plan nodes. True is set to list and false to hide.
         */
        details?: boolean;
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of queries to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSparkApplicationSqlQueries call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Optional. Enables/ disables physical plan description on demand
         */
        planDescription?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempts extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of stage attempts (paging based on stage_attempt_id) to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSparkApplicationStageAttempts call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage ID for which attempts are to be fetched
         */
        stageId?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstageattempttasks extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of tasks to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous ListSparkApplicationStageAttemptTasks call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Optional. Sort the tasks by runtime.
         */
        sortRuntime?: boolean;
        /**
         * Optional. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Optional. Stage ID
         */
        stageId?: string;
        /**
         * Optional. List only tasks in the state.
         */
        taskStatus?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Searchstages extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of stages (paging based on stage_id) to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous FetchSparkApplicationStagesList call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Optional. List only stages in the given state.
         */
        stageStatus?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizeexecutors extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizejobs extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestageattempttasks extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Summarizestages extends StandardParameters {
        /**
         * Required. The fully qualified name of the batch to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Batch) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Batches$Sparkapplications$Write extends StandardParameters {
        /**
         * Required. The fully qualified name of the spark application to write data about in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/batches/BATCH_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WriteSparkApplicationContextRequest;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns google.rpc.Code.UNIMPLEMENTED. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to Code.CANCELLED.
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
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns google.rpc.Code.UNIMPLEMENTED.
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
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
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
    export class Resource$Projects$Locations$Sessions {
        context: APIRequestContext;
        sparkApplications: Resource$Projects$Locations$Sessions$Sparkapplications;
        constructor(context: APIRequestContext);
        /**
         * Create an interactive session asynchronously.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Sessions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Sessions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Sessions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Sessions$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Sessions$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the interactive session resource. If the session is not in terminal state, it is terminated, and then deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Sessions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Sessions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Sessions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Sessions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Sessions$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the resource representation for an interactive session.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Sessions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Sessions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Session>>;
        get(params: Params$Resource$Projects$Locations$Sessions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Sessions$Get, options: MethodOptions | BodyResponseCallback<Schema$Session>, callback: BodyResponseCallback<Schema$Session>): void;
        get(params: Params$Resource$Projects$Locations$Sessions$Get, callback: BodyResponseCallback<Schema$Session>): void;
        get(callback: BodyResponseCallback<Schema$Session>): void;
        /**
         * Lists interactive sessions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Sessions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Sessions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSessionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Sessions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Sessions$List, options: MethodOptions | BodyResponseCallback<Schema$ListSessionsResponse>, callback: BodyResponseCallback<Schema$ListSessionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Sessions$List, callback: BodyResponseCallback<Schema$ListSessionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSessionsResponse>): void;
        /**
         * Terminates the interactive session.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        terminate(params: Params$Resource$Projects$Locations$Sessions$Terminate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        terminate(params?: Params$Resource$Projects$Locations$Sessions$Terminate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        terminate(params: Params$Resource$Projects$Locations$Sessions$Terminate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        terminate(params: Params$Resource$Projects$Locations$Sessions$Terminate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        terminate(params: Params$Resource$Projects$Locations$Sessions$Terminate, callback: BodyResponseCallback<Schema$Operation>): void;
        terminate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Create extends StandardParameters {
        /**
         * Required. The parent resource where this session will be created.
         */
        parent?: string;
        /**
         * Optional. A unique ID used to identify the request. If the service receives two CreateSessionRequests (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateSessionRequest)s with the same ID, the second request is ignored, and the first Session is created and stored in the backend.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The value must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Required. The ID to use for the session, which becomes the final component of the session's resource name.This value must be 4-63 characters. Valid characters are /a-z-/.
         */
        sessionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Session;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Delete extends StandardParameters {
        /**
         * Required. The name of the session resource to delete.
         */
        name?: string;
        /**
         * Optional. A unique ID used to identify the request. If the service receives two DeleteSessionRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.DeleteSessionRequest)s with the same ID, the second request is ignored.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The value must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Get extends StandardParameters {
        /**
         * Required. The name of the session to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$List extends StandardParameters {
        /**
         * Optional. A filter for the sessions to return in the response.A filter is a logical expression constraining the values of various fields in each session resource. Filters are case sensitive, and may contain multiple clauses combined with logical operators (AND, OR). Supported fields are session_id, session_uuid, state, create_time, and labels.Example: state = ACTIVE and create_time < "2023-01-01T00:00:00Z" is a filter for sessions in an ACTIVE state that were created before 2023-01-01. state = ACTIVE and labels.environment=production is a filter for sessions in an ACTIVE state that have a production environment label.See https://google.aip.dev/assets/misc/ebnf-filtering.txt for a detailed description of the filter syntax and a list of supported comparators.
         */
        filter?: string;
        /**
         * Optional. The maximum number of sessions to return in each response. The service may return fewer than this value.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous ListSessions call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of sessions.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Terminate extends StandardParameters {
        /**
         * Required. The name of the session resource to terminate.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TerminateSessionRequest;
    }
    export class Resource$Projects$Locations$Sessions$Sparkapplications {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Obtain high level information corresponding to a single Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        access(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        access(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationResponse>>;
        access(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        access(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationResponse>): void;
        access(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationResponse>): void;
        access(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationResponse>): void;
        /**
         * Obtain environment details for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessEnvironmentInfo(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationEnvironmentInfoResponse>>;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationEnvironmentInfoResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationEnvironmentInfoResponse>): void;
        accessEnvironmentInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationEnvironmentInfoResponse>): void;
        accessEnvironmentInfo(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationEnvironmentInfoResponse>): void;
        /**
         * Obtain data corresponding to a spark job for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessJob(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessJob(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationJobResponse>>;
        accessJob(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessJob(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationJobResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationJobResponse>): void;
        accessJob(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationJobResponse>): void;
        accessJob(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationJobResponse>): void;
        /**
         * Obtain data corresponding to Native Build Information for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessNativeBuildInfo(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationNativeBuildInfoResponse>>;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeBuildInfoResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeBuildInfoResponse>): void;
        accessNativeBuildInfo(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeBuildInfoResponse>): void;
        accessNativeBuildInfo(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeBuildInfoResponse>): void;
        /**
         * Obtain data corresponding to a particular Native SQL Query for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessNativeSqlQuery(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationNativeSqlQueryResponse>>;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeSqlQueryResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeSqlQueryResponse>): void;
        accessNativeSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeSqlQueryResponse>): void;
        accessNativeSqlQuery(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationNativeSqlQueryResponse>): void;
        /**
         * Obtain Spark Plan Graph for a Spark Application SQL execution. Limits the number of clusters returned as part of the graph to 10000.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessSqlPlan(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessSqlPlan(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse>>;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse>): void;
        accessSqlPlan(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse>): void;
        accessSqlPlan(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlSparkPlanGraphResponse>): void;
        /**
         * Obtain data corresponding to a particular SQL Query for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessSqlQuery(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationSqlQueryResponse>>;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlQueryResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlQueryResponse>): void;
        accessSqlQuery(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlQueryResponse>): void;
        accessSqlQuery(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationSqlQueryResponse>): void;
        /**
         * Obtain data corresponding to a spark stage attempt for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessStageAttempt(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessStageAttempt(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationStageAttemptResponse>>;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationStageAttemptResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageAttemptResponse>): void;
        accessStageAttempt(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageAttemptResponse>): void;
        accessStageAttempt(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageAttemptResponse>): void;
        /**
         * Obtain RDD operation graph for a Spark Application Stage. Limits the number of clusters returned as part of the graph to 10000.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accessStageRddGraph(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse>>;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph, options: MethodOptions | BodyResponseCallback<Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse>, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse>): void;
        accessStageRddGraph(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph, callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse>): void;
        accessStageRddGraph(callback: BodyResponseCallback<Schema$AccessSessionSparkApplicationStageRddOperationGraphResponse>): void;
        /**
         * Obtain high level information and list of Spark Applications corresponding to a batch
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationsResponse>>;
        search(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationsResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationsResponse>): void;
        search(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationsResponse>): void;
        search(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationsResponse>): void;
        /**
         * Obtain data corresponding to executors for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchExecutors(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationExecutorsResponse>>;
        searchExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorsResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorsResponse>): void;
        searchExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorsResponse>): void;
        searchExecutors(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorsResponse>): void;
        /**
         * Obtain executor summary with respect to a spark stage attempt.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchExecutorStageSummary(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse>>;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse>): void;
        searchExecutorStageSummary(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse>): void;
        searchExecutorStageSummary(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationExecutorStageSummaryResponse>): void;
        /**
         * Obtain list of spark jobs corresponding to a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchJobs(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationJobsResponse>>;
        searchJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationJobsResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationJobsResponse>): void;
        searchJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationJobsResponse>): void;
        searchJobs(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationJobsResponse>): void;
        /**
         * Obtain data corresponding to Native SQL Queries for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchNativeSqlQueries(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse>>;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse>): void;
        searchNativeSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse>): void;
        searchNativeSqlQueries(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationNativeSqlQueriesResponse>): void;
        /**
         * Obtain data corresponding to SQL Queries for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchSqlQueries(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationSqlQueriesResponse>>;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationSqlQueriesResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationSqlQueriesResponse>): void;
        searchSqlQueries(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationSqlQueriesResponse>): void;
        searchSqlQueries(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationSqlQueriesResponse>): void;
        /**
         * Obtain data corresponding to a spark stage attempts for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStageAttempts(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStageAttempts(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationStageAttemptsResponse>>;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptsResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptsResponse>): void;
        searchStageAttempts(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptsResponse>): void;
        searchStageAttempts(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptsResponse>): void;
        /**
         * Obtain data corresponding to tasks for a spark stage attempt for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStageAttemptTasks(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationStageAttemptTasksResponse>>;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptTasksResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptTasksResponse>): void;
        searchStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptTasksResponse>): void;
        searchStageAttemptTasks(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStageAttemptTasksResponse>): void;
        /**
         * Obtain data corresponding to stages for a Spark Application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchStages(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchSessionSparkApplicationStagesResponse>>;
        searchStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages, options: MethodOptions | BodyResponseCallback<Schema$SearchSessionSparkApplicationStagesResponse>, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStagesResponse>): void;
        searchStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages, callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStagesResponse>): void;
        searchStages(callback: BodyResponseCallback<Schema$SearchSessionSparkApplicationStagesResponse>): void;
        /**
         * Obtain summary of Executor Summary for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeExecutors(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSessionSparkApplicationExecutorsResponse>>;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSessionSparkApplicationExecutorsResponse>, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationExecutorsResponse>): void;
        summarizeExecutors(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationExecutorsResponse>): void;
        summarizeExecutors(callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationExecutorsResponse>): void;
        /**
         * Obtain summary of Jobs for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeJobs(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSessionSparkApplicationJobsResponse>>;
        summarizeJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSessionSparkApplicationJobsResponse>, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationJobsResponse>): void;
        summarizeJobs(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationJobsResponse>): void;
        summarizeJobs(callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationJobsResponse>): void;
        /**
         * Obtain summary of Tasks for a Spark Application Stage Attempt
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeStageAttemptTasks(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse>>;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse>, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse>): void;
        summarizeStageAttemptTasks(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse>): void;
        summarizeStageAttemptTasks(callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStageAttemptTasksResponse>): void;
        /**
         * Obtain summary of Stages for a Spark Application
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        summarizeStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        summarizeStages(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SummarizeSessionSparkApplicationStagesResponse>>;
        summarizeStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        summarizeStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages, options: MethodOptions | BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStagesResponse>, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStagesResponse>): void;
        summarizeStages(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages, callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStagesResponse>): void;
        summarizeStages(callback: BodyResponseCallback<Schema$SummarizeSessionSparkApplicationStagesResponse>): void;
        /**
         * Write wrapper objects from dataplane to spanner
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        write(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        write(params?: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WriteSessionSparkApplicationContextResponse>>;
        write(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        write(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write, options: MethodOptions | BodyResponseCallback<Schema$WriteSessionSparkApplicationContextResponse>, callback: BodyResponseCallback<Schema$WriteSessionSparkApplicationContextResponse>): void;
        write(params: Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write, callback: BodyResponseCallback<Schema$WriteSessionSparkApplicationContextResponse>): void;
        write(callback: BodyResponseCallback<Schema$WriteSessionSparkApplicationContextResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Access extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessenvironmentinfo extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessjob extends StandardParameters {
        /**
         * Required. Job ID to fetch data for.
         */
        jobId?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativebuildinfo extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessnativesqlquery extends StandardParameters {
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlplan extends StandardParameters {
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accesssqlquery extends StandardParameters {
        /**
         * Optional. Lists/ hides details of Spark plan nodes. True is set to list and false to hide.
         */
        details?: boolean;
        /**
         * Required. Execution ID
         */
        executionId?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Optional. Enables/ disables physical plan description on demand
         */
        planDescription?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstageattempt extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Accessstagerddgraph extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Search extends StandardParameters {
        /**
         * Optional. Search only applications in the chosen state.
         */
        applicationStatus?: string;
        /**
         * Optional. Latest end timestamp to list.
         */
        maxEndTime?: string;
        /**
         * Optional. Latest start timestamp to list.
         */
        maxTime?: string;
        /**
         * Optional. Earliest end timestamp to list.
         */
        minEndTime?: string;
        /**
         * Optional. Earliest start timestamp to list.
         */
        minTime?: string;
        /**
         * Optional. Maximum number of applications to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplications call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutors extends StandardParameters {
        /**
         * Optional. Filter to select whether active/ dead or all executors should be selected.
         */
        executorStatus?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of executors to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationExecutors call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchexecutorstagesummary extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of executors to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationExecutorStageSummary call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchjobs extends StandardParameters {
        /**
         * Optional. List only jobs in the specific state.
         */
        jobStatus?: string;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of jobs to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationJobs call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchnativesqlqueries extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of queries to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationSqlQueries call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchsqlqueries extends StandardParameters {
        /**
         * Optional. Lists/ hides details of Spark plan nodes. True is set to list and false to hide.
         */
        details?: boolean;
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of queries to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationSqlQueries call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Optional. Enables/ disables physical plan description on demand
         */
        planDescription?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempts extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of stage attempts (paging based on stage_attempt_id) to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationStageAttempts call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage ID for which attempts are to be fetched
         */
        stageId?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstageattempttasks extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of tasks to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationStageAttemptTasks call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Optional. Sort the tasks by runtime.
         */
        sortRuntime?: boolean;
        /**
         * Optional. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Optional. Stage ID
         */
        stageId?: string;
        /**
         * Optional. List only tasks in the state.
         */
        taskStatus?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Searchstages extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Optional. Maximum number of stages (paging based on stage_id) to return in each response. The service may return fewer than this. The default page size is 10; the maximum page size is 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous SearchSessionSparkApplicationStages call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Optional. List only stages in the given state.
         */
        stageStatus?: string;
        /**
         * Optional. The list of summary metrics fields to include. Empty list will default to skip all summary metrics fields. Example, if the response should include TaskQuantileMetrics, the request should have task_quantile_metrics in summary_metrics_mask field
         */
        summaryMetricsMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizeexecutors extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizejobs extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestageattempttasks extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
        /**
         * Required. Stage Attempt ID
         */
        stageAttemptId?: number;
        /**
         * Required. Stage ID
         */
        stageId?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Summarizestages extends StandardParameters {
        /**
         * Required. The fully qualified name of the session to retrieve in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Required. Parent (Session) resource reference.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessions$Sparkapplications$Write extends StandardParameters {
        /**
         * Required. The fully qualified name of the spark application to write data about in the format "projects/PROJECT_ID/locations/DATAPROC_REGION/sessions/SESSION_ID/sparkApplications/APPLICATION_ID"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WriteSessionSparkApplicationContextRequest;
    }
    export class Resource$Projects$Locations$Sessiontemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a session template synchronously.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Sessiontemplates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Sessiontemplates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SessionTemplate>>;
        create(params: Params$Resource$Projects$Locations$Sessiontemplates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Sessiontemplates$Create, options: MethodOptions | BodyResponseCallback<Schema$SessionTemplate>, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        create(params: Params$Resource$Projects$Locations$Sessiontemplates$Create, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        create(callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        /**
         * Deletes a session template.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Sessiontemplates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Sessiontemplates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Sessiontemplates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Sessiontemplates$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Sessiontemplates$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the resource representation for a session template.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Sessiontemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Sessiontemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SessionTemplate>>;
        get(params: Params$Resource$Projects$Locations$Sessiontemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Sessiontemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$SessionTemplate>, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        get(params: Params$Resource$Projects$Locations$Sessiontemplates$Get, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        get(callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        /**
         * Lists session templates.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Sessiontemplates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Sessiontemplates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSessionTemplatesResponse>>;
        list(params: Params$Resource$Projects$Locations$Sessiontemplates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Sessiontemplates$List, options: MethodOptions | BodyResponseCallback<Schema$ListSessionTemplatesResponse>, callback: BodyResponseCallback<Schema$ListSessionTemplatesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Sessiontemplates$List, callback: BodyResponseCallback<Schema$ListSessionTemplatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSessionTemplatesResponse>): void;
        /**
         * Updates the session template synchronously.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Sessiontemplates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Sessiontemplates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SessionTemplate>>;
        patch(params: Params$Resource$Projects$Locations$Sessiontemplates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Sessiontemplates$Patch, options: MethodOptions | BodyResponseCallback<Schema$SessionTemplate>, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        patch(params: Params$Resource$Projects$Locations$Sessiontemplates$Patch, callback: BodyResponseCallback<Schema$SessionTemplate>): void;
        patch(callback: BodyResponseCallback<Schema$SessionTemplate>): void;
    }
    export interface Params$Resource$Projects$Locations$Sessiontemplates$Create extends StandardParameters {
        /**
         * Required. The parent resource where this session template will be created.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SessionTemplate;
    }
    export interface Params$Resource$Projects$Locations$Sessiontemplates$Delete extends StandardParameters {
        /**
         * Required. The name of the session template resource to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessiontemplates$Get extends StandardParameters {
        /**
         * Required. The name of the session template to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessiontemplates$List extends StandardParameters {
        /**
         * Optional. A filter for the session templates to return in the response. Filters are case sensitive and have the following syntax:field = value AND field = value ...
         */
        filter?: string;
        /**
         * Optional. The maximum number of sessions to return in each response. The service may return fewer than this value.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous ListSessions call. Provide this token to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent that owns this collection of session templates.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Sessiontemplates$Patch extends StandardParameters {
        /**
         * Required. The resource name of the session template.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SessionTemplate;
    }
    export class Resource$Projects$Locations$Workflowtemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates new workflow template.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Workflowtemplates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Workflowtemplates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        create(params: Params$Resource$Projects$Locations$Workflowtemplates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Workflowtemplates$Create, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        create(params: Params$Resource$Projects$Locations$Workflowtemplates$Create, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        create(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        /**
         * Deletes a workflow template. It does not cancel in-progress workflows.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Workflowtemplates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Workflowtemplates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Workflowtemplates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Workflowtemplates$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Workflowtemplates$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the latest workflow template.Can retrieve previously instantiated template by specifying optional version parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Workflowtemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Workflowtemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        get(params: Params$Resource$Projects$Locations$Workflowtemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Workflowtemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        get(params: Params$Resource$Projects$Locations$Workflowtemplates$Get, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        get(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Instantiates a template and begins execution.The returned Operation can be used to track execution of workflow by polling operations.get. The Operation will complete when entire workflow is finished.The running workflow can be aborted via operations.cancel. This will cause any inflight jobs to be cancelled and workflow-owned clusters to be deleted.The Operation.metadata will be WorkflowMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#workflowmetadata). Also see Using WorkflowMetadata (https://cloud.google.com/dataproc/docs/concepts/workflows/debugging#using_workflowmetadata).On successful completion, Operation.response will be Empty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        instantiate(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        instantiate(params?: Params$Resource$Projects$Locations$Workflowtemplates$Instantiate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        instantiate(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        instantiate(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiate(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiate, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiate(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Instantiates a template and begins execution.This method is equivalent to executing the sequence CreateWorkflowTemplate, InstantiateWorkflowTemplate, DeleteWorkflowTemplate.The returned Operation can be used to track execution of workflow by polling operations.get. The Operation will complete when entire workflow is finished.The running workflow can be aborted via operations.cancel. This will cause any inflight jobs to be cancelled and workflow-owned clusters to be deleted.The Operation.metadata will be WorkflowMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#workflowmetadata). Also see Using WorkflowMetadata (https://cloud.google.com/dataproc/docs/concepts/workflows/debugging#using_workflowmetadata).On successful completion, Operation.response will be Empty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        instantiateInline(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        instantiateInline(params?: Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        instantiateInline(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        instantiateInline(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiateInline(params: Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiateInline(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists workflows that match the specified filter in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Workflowtemplates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Workflowtemplates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkflowTemplatesResponse>>;
        list(params: Params$Resource$Projects$Locations$Workflowtemplates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Workflowtemplates$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>, callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Workflowtemplates$List, callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Updates (replaces) workflow template. The updated template must contain version that matches the current server version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Workflowtemplates$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Workflowtemplates$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        update(params: Params$Resource$Projects$Locations$Workflowtemplates$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Workflowtemplates$Update, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        update(params: Params$Resource$Projects$Locations$Workflowtemplates$Update, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        update(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Create extends StandardParameters {
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.create, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.create, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Delete extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.delete, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Optional. The version of workflow template to delete. If specified, will only delete the template if the current server version matches specified version.
         */
        version?: number;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Get extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.get, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.get, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Optional. The version of workflow template to retrieve. Only previously instantiated versions can be retrieved.If unspecified, retrieves the current version.
         */
        version?: number;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Instantiate extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstantiateWorkflowTemplateRequest;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Instantiateinline extends StandardParameters {
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates,instantiateinline, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.instantiateinline, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Optional. A tag that prevents multiple concurrent workflow instances with the same tag from running. This mitigates risk of concurrent instances started due to retries.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The tag must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return in each response.
         */
        pageSize?: number;
        /**
         * Optional. The page token, returned by a previous call, to request the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates,list, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.list, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Workflowtemplates$Update extends StandardParameters {
        /**
         * Output only. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export class Resource$Projects$Regions {
        context: APIRequestContext;
        autoscalingPolicies: Resource$Projects$Regions$Autoscalingpolicies;
        clusters: Resource$Projects$Regions$Clusters;
        jobs: Resource$Projects$Regions$Jobs;
        operations: Resource$Projects$Regions$Operations;
        workflowTemplates: Resource$Projects$Regions$Workflowtemplates;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Regions$Autoscalingpolicies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates new autoscaling policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        create(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Create, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        create(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Create, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        create(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        /**
         * Deletes an autoscaling policy. It is an error to delete an autoscaling policy that is in use by one or more clusters.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves autoscaling policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        get(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Get, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        get(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Get, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        get(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists autoscaling policies in the project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Regions$Autoscalingpolicies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAutoscalingPoliciesResponse>>;
        list(params: Params$Resource$Projects$Regions$Autoscalingpolicies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Regions$Autoscalingpolicies$List, options: MethodOptions | BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>, callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        list(params: Params$Resource$Projects$Regions$Autoscalingpolicies$List, callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAutoscalingPoliciesResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Updates (replaces) autoscaling policy.Disabled check for update_mask, because all updates will be full replacements.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Regions$Autoscalingpolicies$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AutoscalingPolicy>>;
        update(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Update, options: MethodOptions | BodyResponseCallback<Schema$AutoscalingPolicy>, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        update(params: Params$Resource$Projects$Regions$Autoscalingpolicies$Update, callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
        update(callback: BodyResponseCallback<Schema$AutoscalingPolicy>): void;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Create extends StandardParameters {
        /**
         * Required. The "resource name" of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.create, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.autoscalingPolicies.create, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AutoscalingPolicy;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Delete extends StandardParameters {
        /**
         * Required. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.delete, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies.delete, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Get extends StandardParameters {
        /**
         * Required. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.get, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies.get, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return in each response. Must be less than or equal to 1000. Defaults to 100.
         */
        pageSize?: number;
        /**
         * Optional. The page token, returned by a previous call, to request the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The "resource name" of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies.list, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.autoscalingPolicies.list, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Regions$Autoscalingpolicies$Update extends StandardParameters {
        /**
         * Output only. The "resource name" of the autoscaling policy, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/regions/{region\}/autoscalingPolicies/{policy_id\} For projects.locations.autoscalingPolicies, the resource name of the policy has the following format: projects/{project_id\}/locations/{location\}/autoscalingPolicies/{policy_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AutoscalingPolicy;
    }
    export class Resource$Projects$Regions$Clusters {
        context: APIRequestContext;
        nodeGroups: Resource$Projects$Regions$Clusters$Nodegroups;
        constructor(context: APIRequestContext);
        /**
         * Creates a cluster in a project. The returned Operation.metadata will be ClusterOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#clusteroperationmetadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Regions$Clusters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Regions$Clusters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Regions$Clusters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Regions$Clusters$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Regions$Clusters$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a cluster in a project. The returned Operation.metadata will be ClusterOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#clusteroperationmetadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Regions$Clusters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Regions$Clusters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Regions$Clusters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Regions$Clusters$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Regions$Clusters$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets cluster diagnostic information. The returned Operation.metadata will be ClusterOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#clusteroperationmetadata). After the operation completes, Operation.response contains DiagnoseClusterResults (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#diagnoseclusterresults).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        diagnose(params: Params$Resource$Projects$Regions$Clusters$Diagnose, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        diagnose(params?: Params$Resource$Projects$Regions$Clusters$Diagnose, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        diagnose(params: Params$Resource$Projects$Regions$Clusters$Diagnose, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        diagnose(params: Params$Resource$Projects$Regions$Clusters$Diagnose, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        diagnose(params: Params$Resource$Projects$Regions$Clusters$Diagnose, callback: BodyResponseCallback<Schema$Operation>): void;
        diagnose(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the resource representation for a cluster in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Clusters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Clusters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Cluster>>;
        get(params: Params$Resource$Projects$Regions$Clusters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Clusters$Get, options: MethodOptions | BodyResponseCallback<Schema$Cluster>, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(params: Params$Resource$Projects$Regions$Clusters$Get, callback: BodyResponseCallback<Schema$Cluster>): void;
        get(callback: BodyResponseCallback<Schema$Cluster>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Regions$Clusters$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Inject encrypted credentials into all of the VMs in a cluster.The target cluster must be a personal auth cluster assigned to the user who is issuing the RPC.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        injectCredentials(params: Params$Resource$Projects$Regions$Clusters$Injectcredentials, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        injectCredentials(params?: Params$Resource$Projects$Regions$Clusters$Injectcredentials, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        injectCredentials(params: Params$Resource$Projects$Regions$Clusters$Injectcredentials, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        injectCredentials(params: Params$Resource$Projects$Regions$Clusters$Injectcredentials, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        injectCredentials(params: Params$Resource$Projects$Regions$Clusters$Injectcredentials, callback: BodyResponseCallback<Schema$Operation>): void;
        injectCredentials(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all regions/{region\}/clusters in a project alphabetically.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Regions$Clusters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Regions$Clusters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClustersResponse>>;
        list(params: Params$Resource$Projects$Regions$Clusters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Regions$Clusters$List, options: MethodOptions | BodyResponseCallback<Schema$ListClustersResponse>, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(params: Params$Resource$Projects$Regions$Clusters$List, callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClustersResponse>): void;
        /**
         * Updates a cluster in a project. The returned Operation.metadata will be ClusterOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#clusteroperationmetadata). The cluster must be in a RUNNING state or an error is returned.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Regions$Clusters$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Regions$Clusters$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Regions$Clusters$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Regions$Clusters$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Regions$Clusters$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Repairs a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        repair(params: Params$Resource$Projects$Regions$Clusters$Repair, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        repair(params?: Params$Resource$Projects$Regions$Clusters$Repair, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        repair(params: Params$Resource$Projects$Regions$Clusters$Repair, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        repair(params: Params$Resource$Projects$Regions$Clusters$Repair, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        repair(params: Params$Resource$Projects$Regions$Clusters$Repair, callback: BodyResponseCallback<Schema$Operation>): void;
        repair(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Regions$Clusters$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Clusters$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Starts a cluster in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        start(params: Params$Resource$Projects$Regions$Clusters$Start, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        start(params?: Params$Resource$Projects$Regions$Clusters$Start, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        start(params: Params$Resource$Projects$Regions$Clusters$Start, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        start(params: Params$Resource$Projects$Regions$Clusters$Start, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        start(params: Params$Resource$Projects$Regions$Clusters$Start, callback: BodyResponseCallback<Schema$Operation>): void;
        start(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Stops a cluster in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        stop(params: Params$Resource$Projects$Regions$Clusters$Stop, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stop(params?: Params$Resource$Projects$Regions$Clusters$Stop, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        stop(params: Params$Resource$Projects$Regions$Clusters$Stop, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stop(params: Params$Resource$Projects$Regions$Clusters$Stop, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        stop(params: Params$Resource$Projects$Regions$Clusters$Stop, callback: BodyResponseCallback<Schema$Operation>): void;
        stop(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Regions$Clusters$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Regions$Clusters$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Regions$Clusters$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Clusters$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Clusters$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Create extends StandardParameters {
        /**
         * Optional. Failure action when primary worker creation fails.
         */
        actionOnFailedPrimaryWorkers?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two CreateClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Cluster;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Delete extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Optional. Specifying the cluster_uuid means the RPC should fail (with error NOT_FOUND) if cluster with specified UUID does not exist.
         */
        clusterUuid?: string;
        /**
         * Optional. The graceful termination timeout for the deletion of the cluster. Indicate the time the request will wait to complete the running jobs on the cluster before its forceful deletion. Default value is 0 indicating that the user has not enabled the graceful termination. Value can be between 60 second and 6 Hours, in case the graceful termination is enabled. (There is no separate flag to check the enabling or disabling of graceful termination, it can be checked by the values in the field).
         */
        gracefulTerminationTimeout?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two DeleteClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.DeleteClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Diagnose extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DiagnoseClusterRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Get extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Injectcredentials extends StandardParameters {
        /**
         * Required. The cluster, in the form clusters/.
         */
        cluster?: string;
        /**
         * Required. The ID of the Google Cloud Platform project the cluster belongs to, of the form projects/.
         */
        project?: string;
        /**
         * Required. The region containing the cluster, of the form regions/.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InjectCredentialsRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$List extends StandardParameters {
        /**
         * Optional. A filter constraining the clusters to list. Filters are case-sensitive and have the following syntax:field = value AND field = value ...where field is one of status.state, clusterName, or labels.[KEY], and [KEY] is a label key. value can be * to match all values. status.state can be one of the following: ACTIVE, INACTIVE, CREATING, RUNNING, ERROR, DELETING, UPDATING, STOPPING, or STOPPED. ACTIVE contains the CREATING, UPDATING, and RUNNING states. INACTIVE contains the DELETING, ERROR, STOPPING, and STOPPED states. clusterName is the name of the cluster provided at creation time. Only the logical AND operator is supported; space-separated items are treated as having an implicit AND operator.Example filter:status.state = ACTIVE AND clusterName = mycluster AND labels.env = staging AND labels.starred = *
         */
        filter?: string;
        /**
         * Optional. The standard List page size.
         */
        pageSize?: number;
        /**
         * Optional. The standard List page token.
         */
        pageToken?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Patch extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Optional. Timeout for graceful YARN decommissioning. Graceful decommissioning allows removing nodes from the cluster without interrupting jobs in progress. Timeout specifies how long to wait for jobs in progress to finish before forcefully removing nodes (and potentially interrupting jobs). Default timeout is 0 (for forceful decommission), and the maximum allowed timeout is 1 day. (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Only supported on Dataproc image versions 1.2 and higher.
         */
        gracefulDecommissionTimeout?: string;
        /**
         * Required. The ID of the Google Cloud Platform project the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two UpdateClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.UpdateClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Required. Specifies the path, relative to Cluster, of the field to update. For example, to change the number of workers in a cluster to 5, the update_mask parameter would be specified as config.worker_config.num_instances, and the PATCH request body would specify the new value, as follows: { "config":{ "workerConfig":{ "numInstances":"5" \} \} \} Similarly, to change the number of preemptible workers in a cluster to 5, the update_mask parameter would be config.secondary_worker_config.num_instances, and the PATCH request body would be set as follows: { "config":{ "secondaryWorkerConfig":{ "numInstances":"5" \} \} \} *Note:* Currently, only the following fields can be updated: *Mask* *Purpose* *labels* Update labels *config.worker_config.num_instances* Resize primary worker group *config.secondary_worker_config.num_instances* Resize secondary worker group config.autoscaling_config.policy_uri Use, stop using, or change autoscaling policies
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Cluster;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Repair extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Required. The ID of the Google Cloud Platform project the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RepairClusterRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Start extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Required. The ID of the Google Cloud Platform project the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartClusterRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Stop extends StandardParameters {
        /**
         * Required. The cluster name.
         */
        clusterName?: string;
        /**
         * Required. The ID of the Google Cloud Platform project the cluster belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StopClusterRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Regions$Clusters$Nodegroups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a node group in a cluster. The returned Operation.metadata is NodeGroupOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#nodegroupoperationmetadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Regions$Clusters$Nodegroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the resource representation for a node group in a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Clusters$Nodegroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NodeGroup>>;
        get(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Get, options: MethodOptions | BodyResponseCallback<Schema$NodeGroup>, callback: BodyResponseCallback<Schema$NodeGroup>): void;
        get(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Get, callback: BodyResponseCallback<Schema$NodeGroup>): void;
        get(callback: BodyResponseCallback<Schema$NodeGroup>): void;
        /**
         * Repair nodes in a node group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        repair(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        repair(params?: Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        repair(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        repair(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        repair(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair, callback: BodyResponseCallback<Schema$Operation>): void;
        repair(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Resizes a node group in a cluster. The returned Operation.metadata is NodeGroupOperationMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#nodegroupoperationmetadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resize(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resize(params?: Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resize(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resize(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resize(params: Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize, callback: BodyResponseCallback<Schema$Operation>): void;
        resize(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Nodegroups$Create extends StandardParameters {
        /**
         * Optional. An optional node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.
         */
        nodeGroupId?: string;
        /**
         * Required. The parent resource where this node group will be created. Format: projects/{project\}/regions/{region\}/clusters/{cluster\}
         */
        parent?: string;
        /**
         * Optional. operation id of the parent operation sending the create request
         */
        parentOperationId?: string;
        /**
         * Optional. A unique ID used to identify the request. If the server receives two CreateNodeGroupRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateNodeGroupRequest) with the same ID, the second request is ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NodeGroup;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Nodegroups$Get extends StandardParameters {
        /**
         * Required. The name of the node group to retrieve. Format: projects/{project\}/regions/{region\}/clusters/{cluster\}/nodeGroups/{nodeGroup\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Nodegroups$Repair extends StandardParameters {
        /**
         * Required. The name of the node group to resize. Format: projects/{project\}/regions/{region\}/clusters/{cluster\}/nodeGroups/{nodeGroup\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RepairNodeGroupRequest;
    }
    export interface Params$Resource$Projects$Regions$Clusters$Nodegroups$Resize extends StandardParameters {
        /**
         * Required. The name of the node group to resize. Format: projects/{project\}/regions/{region\}/clusters/{cluster\}/nodeGroups/{nodeGroup\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResizeNodeGroupRequest;
    }
    export class Resource$Projects$Regions$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts a job cancellation request. To access the job resource after cancellation, call regions/{region\}/jobs.list (https://cloud.google.com/dataproc/docs/reference/rest/v1/projects.regions.jobs/list) or regions/{region\}/jobs.get (https://cloud.google.com/dataproc/docs/reference/rest/v1/projects.regions.jobs/get).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Regions$Jobs$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Regions$Jobs$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        cancel(params: Params$Resource$Projects$Regions$Jobs$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Regions$Jobs$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        cancel(params: Params$Resource$Projects$Regions$Jobs$Cancel, callback: BodyResponseCallback<Schema$Job>): void;
        cancel(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Deletes the job from the project. If the job is active, the delete fails, and the response returns FAILED_PRECONDITION.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Regions$Jobs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Regions$Jobs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Regions$Jobs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Regions$Jobs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Regions$Jobs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the resource representation for a job in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Projects$Regions$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Projects$Regions$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Regions$Jobs$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists regions/{region\}/jobs in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Regions$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Regions$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Projects$Regions$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Regions$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Projects$Regions$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        /**
         * Updates a job in a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Regions$Jobs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Regions$Jobs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        patch(params: Params$Resource$Projects$Regions$Jobs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Regions$Jobs$Patch, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        patch(params: Params$Resource$Projects$Regions$Jobs$Patch, callback: BodyResponseCallback<Schema$Job>): void;
        patch(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Regions$Jobs$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Jobs$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Submits a job to a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submit(params: Params$Resource$Projects$Regions$Jobs$Submit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submit(params?: Params$Resource$Projects$Regions$Jobs$Submit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        submit(params: Params$Resource$Projects$Regions$Jobs$Submit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submit(params: Params$Resource$Projects$Regions$Jobs$Submit, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        submit(params: Params$Resource$Projects$Regions$Jobs$Submit, callback: BodyResponseCallback<Schema$Job>): void;
        submit(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Submits job to a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submitAsOperation(params: Params$Resource$Projects$Regions$Jobs$Submitasoperation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submitAsOperation(params?: Params$Resource$Projects$Regions$Jobs$Submitasoperation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        submitAsOperation(params: Params$Resource$Projects$Regions$Jobs$Submitasoperation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submitAsOperation(params: Params$Resource$Projects$Regions$Jobs$Submitasoperation, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        submitAsOperation(params: Params$Resource$Projects$Regions$Jobs$Submitasoperation, callback: BodyResponseCallback<Schema$Operation>): void;
        submitAsOperation(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Regions$Jobs$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Regions$Jobs$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Regions$Jobs$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Jobs$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Jobs$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Cancel extends StandardParameters {
        /**
         * Required. The job ID.
         */
        jobId?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelJobRequest;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Delete extends StandardParameters {
        /**
         * Required. The job ID.
         */
        jobId?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Get extends StandardParameters {
        /**
         * Required. The job ID.
         */
        jobId?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Jobs$List extends StandardParameters {
        /**
         * Optional. If set, the returned jobs list includes only jobs that were submitted to the named cluster.
         */
        clusterName?: string;
        /**
         * Optional. A filter constraining the jobs to list. Filters are case-sensitive and have the following syntax:field = value AND field = value ...where field is status.state or labels.[KEY], and [KEY] is a label key. value can be * to match all values. status.state can be either ACTIVE or NON_ACTIVE. Only the logical AND operator is supported; space-separated items are treated as having an implicit AND operator.Example filter:status.state = ACTIVE AND labels.env = staging AND labels.starred = *
         */
        filter?: string;
        /**
         * Optional. Specifies enumerated categories of jobs to list. (default = match ALL jobs).If filter is provided, jobStateMatcher will be ignored.
         */
        jobStateMatcher?: string;
        /**
         * Optional. The number of results to return in each response.
         */
        pageSize?: number;
        /**
         * Optional. The page token, returned by a previous call, to request the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Patch extends StandardParameters {
        /**
         * Required. The job ID.
         */
        jobId?: string;
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Required. Specifies the path, relative to Job, of the field to update. For example, to update the labels of a Job the update_mask parameter would be specified as labels, and the PATCH request body would specify the new value. *Note:* Currently, labels is the only field that can be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Submit extends StandardParameters {
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SubmitJobRequest;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Submitasoperation extends StandardParameters {
        /**
         * Required. The ID of the Google Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Required. The Dataproc region in which to handle the request.
         */
        region?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SubmitJobRequest;
    }
    export interface Params$Resource$Projects$Regions$Jobs$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Regions$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns google.rpc.Code.UNIMPLEMENTED. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to Code.CANCELLED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Regions$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Regions$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Regions$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Regions$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Regions$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns google.rpc.Code.UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Regions$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Regions$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Regions$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Regions$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Regions$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Regions$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Regions$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Regions$Operations$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Regions$Operations$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Regions$Operations$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Operations$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Operations$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Regions$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Regions$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Projects$Regions$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Regions$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Regions$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Regions$Operations$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Regions$Operations$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Regions$Operations$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Operations$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Operations$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Regions$Operations$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Regions$Operations$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Regions$Operations$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Operations$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Operations$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Regions$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Regions$Operations$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Operations$List extends StandardParameters {
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
    export interface Params$Resource$Projects$Regions$Operations$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Operations$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Regions$Workflowtemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates new workflow template.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Regions$Workflowtemplates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Regions$Workflowtemplates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        create(params: Params$Resource$Projects$Regions$Workflowtemplates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Regions$Workflowtemplates$Create, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        create(params: Params$Resource$Projects$Regions$Workflowtemplates$Create, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        create(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        /**
         * Deletes a workflow template. It does not cancel in-progress workflows.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Regions$Workflowtemplates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Regions$Workflowtemplates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Regions$Workflowtemplates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Regions$Workflowtemplates$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Regions$Workflowtemplates$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the latest workflow template.Can retrieve previously instantiated template by specifying optional version parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Regions$Workflowtemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Regions$Workflowtemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        get(params: Params$Resource$Projects$Regions$Workflowtemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Regions$Workflowtemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        get(params: Params$Resource$Projects$Regions$Workflowtemplates$Get, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        get(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Instantiates a template and begins execution.The returned Operation can be used to track execution of workflow by polling operations.get. The Operation will complete when entire workflow is finished.The running workflow can be aborted via operations.cancel. This will cause any inflight jobs to be cancelled and workflow-owned clusters to be deleted.The Operation.metadata will be WorkflowMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#workflowmetadata). Also see Using WorkflowMetadata (https://cloud.google.com/dataproc/docs/concepts/workflows/debugging#using_workflowmetadata).On successful completion, Operation.response will be Empty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        instantiate(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        instantiate(params?: Params$Resource$Projects$Regions$Workflowtemplates$Instantiate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        instantiate(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        instantiate(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiate(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiate, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiate(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Instantiates a template and begins execution.This method is equivalent to executing the sequence CreateWorkflowTemplate, InstantiateWorkflowTemplate, DeleteWorkflowTemplate.The returned Operation can be used to track execution of workflow by polling operations.get. The Operation will complete when entire workflow is finished.The running workflow can be aborted via operations.cancel. This will cause any inflight jobs to be cancelled and workflow-owned clusters to be deleted.The Operation.metadata will be WorkflowMetadata (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#workflowmetadata). Also see Using WorkflowMetadata (https://cloud.google.com/dataproc/docs/concepts/workflows/debugging#using_workflowmetadata).On successful completion, Operation.response will be Empty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        instantiateInline(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        instantiateInline(params?: Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        instantiateInline(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        instantiateInline(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiateInline(params: Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline, callback: BodyResponseCallback<Schema$Operation>): void;
        instantiateInline(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists workflows that match the specified filter in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Regions$Workflowtemplates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Regions$Workflowtemplates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkflowTemplatesResponse>>;
        list(params: Params$Resource$Projects$Regions$Workflowtemplates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Regions$Workflowtemplates$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>, callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        list(params: Params$Resource$Projects$Regions$Workflowtemplates$List, callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkflowTemplatesResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Updates (replaces) workflow template. The updated template must contain version that matches the current server version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Regions$Workflowtemplates$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Regions$Workflowtemplates$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkflowTemplate>>;
        update(params: Params$Resource$Projects$Regions$Workflowtemplates$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Regions$Workflowtemplates$Update, options: MethodOptions | BodyResponseCallback<Schema$WorkflowTemplate>, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        update(params: Params$Resource$Projects$Regions$Workflowtemplates$Update, callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
        update(callback: BodyResponseCallback<Schema$WorkflowTemplate>): void;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Create extends StandardParameters {
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.create, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.create, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Delete extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.delete, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Optional. The version of workflow template to delete. If specified, will only delete the template if the current server version matches specified version.
         */
        version?: number;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Get extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.get, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.get, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Optional. The version of workflow template to retrieve. Only previously instantiated versions can be retrieved.If unspecified, retrieves the current version.
         */
        version?: number;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Instantiate extends StandardParameters {
        /**
         * Required. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates.instantiate, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstantiateWorkflowTemplateRequest;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Instantiateinline extends StandardParameters {
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates,instantiateinline, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.instantiateinline, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
        /**
         * Optional. A tag that prevents multiple concurrent workflow instances with the same tag from running. This mitigates risk of concurrent instances started due to retries.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The tag must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return in each response.
         */
        pageSize?: number;
        /**
         * Optional. The page token, returned by a previous call, to request the next page of results.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the region or location, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates,list, the resource name of the region has the following format: projects/{project_id\}/regions/{region\} For projects.locations.workflowTemplates.list, the resource name of the location has the following format: projects/{project_id\}/locations/{location\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Regions$Workflowtemplates$Update extends StandardParameters {
        /**
         * Output only. The resource name of the workflow template, as described in https://cloud.google.com/apis/design/resource_names. For projects.regions.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/regions/{region\}/workflowTemplates/{template_id\} For projects.locations.workflowTemplates, the resource name of the template has the following format: projects/{project_id\}/locations/{location\}/workflowTemplates/{template_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkflowTemplate;
    }
    export {};
}
