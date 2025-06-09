import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace redis_v1 {
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
     * Google Cloud Memorystore for Redis API
     *
     * Creates and manages Redis instances on the Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const redis = google.redis('v1');
     * ```
     */
    export class Redis {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Configuration of the AOF based persistence.
     */
    export interface Schema$AOFConfig {
        /**
         * Optional. fsync configuration.
         */
        appendFsync?: string | null;
    }
    /**
     * The automated backup config for a cluster.
     */
    export interface Schema$AutomatedBackupConfig {
        /**
         * Optional. The automated backup mode. If the mode is disabled, the other fields will be ignored.
         */
        automatedBackupMode?: string | null;
        /**
         * Optional. Trigger automated backups at a fixed frequency.
         */
        fixedFrequencySchedule?: Schema$FixedFrequencySchedule;
        /**
         * Optional. How long to keep automated backups before the backups are deleted. The value should be between 1 day and 365 days. If not specified, the default value is 35 days.
         */
        retention?: string | null;
    }
    /**
     * Configuration for availability of database instance
     */
    export interface Schema$AvailabilityConfiguration {
        /**
         * Checks for existence of (multi-cluster) routing configuration that allows automatic failover to a different zone/region in case of an outage. Applicable to Bigtable resources.
         */
        automaticFailoverRoutingConfigured?: boolean | null;
        /**
         * Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data accessibility. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available).
         */
        availabilityType?: string | null;
        /**
         * Checks for resources that are configured to have redundancy, and ongoing replication across regions
         */
        crossRegionReplicaConfigured?: boolean | null;
        externalReplicaConfigured?: boolean | null;
        promotableReplicaConfigured?: boolean | null;
    }
    /**
     * Backup of a cluster.
     */
    export interface Schema$Backup {
        /**
         * Output only. List of backup files of the backup.
         */
        backupFiles?: Schema$BackupFile[];
        /**
         * Output only. Type of the backup.
         */
        backupType?: string | null;
        /**
         * Output only. Cluster resource path of this backup.
         */
        cluster?: string | null;
        /**
         * Output only. Cluster uid of this backup.
         */
        clusterUid?: string | null;
        /**
         * Output only. The time when the backup was created.
         */
        createTime?: string | null;
        /**
         * Output only. Encryption information of the backup.
         */
        encryptionInfo?: Schema$EncryptionInfo;
        /**
         * Output only. redis-7.2, valkey-7.5
         */
        engineVersion?: string | null;
        /**
         * Output only. The time when the backup will expire.
         */
        expireTime?: string | null;
        /**
         * Identifier. Full resource path of the backup. the last part of the name is the backup id with the following format: [YYYYMMDDHHMMSS]_[Shorted Cluster UID] OR customer specified while backup cluster. Example: 20240515123000_1234
         */
        name?: string | null;
        /**
         * Output only. Node type of the cluster.
         */
        nodeType?: string | null;
        /**
         * Output only. Number of replicas for the cluster.
         */
        replicaCount?: number | null;
        /**
         * Output only. Number of shards for the cluster.
         */
        shardCount?: number | null;
        /**
         * Output only. State of the backup.
         */
        state?: string | null;
        /**
         * Output only. Total size of the backup in bytes.
         */
        totalSizeBytes?: string | null;
        /**
         * Output only. System assigned unique identifier of the backup.
         */
        uid?: string | null;
    }
    /**
     * Request for [BackupCluster].
     */
    export interface Schema$BackupClusterRequest {
        /**
         * Optional. The id of the backup to be created. If not specified, the default value ([YYYYMMDDHHMMSS]_[Shortened Cluster UID] is used.
         */
        backupId?: string | null;
        /**
         * Optional. TTL for the backup to expire. Value range is 1 day to 100 years. If not specified, the default value is 100 years.
         */
        ttl?: string | null;
    }
    /**
     * BackupCollection of a cluster.
     */
    export interface Schema$BackupCollection {
        /**
         * Output only. The full resource path of the cluster the backup collection belongs to. Example: projects/{project\}/locations/{location\}/clusters/{cluster\}
         */
        cluster?: string | null;
        /**
         * Output only. The cluster uid of the backup collection.
         */
        clusterUid?: string | null;
        /**
         * Output only. The time when the backup collection was created.
         */
        createTime?: string | null;
        /**
         * Output only. The KMS key used to encrypt the backups under this backup collection.
         */
        kmsKey?: string | null;
        /**
         * Identifier. Full resource path of the backup collection.
         */
        name?: string | null;
        /**
         * Output only. System assigned unique identifier of the backup collection.
         */
        uid?: string | null;
    }
    /**
     * Configuration for automatic backups
     */
    export interface Schema$BackupConfiguration {
        /**
         * Whether customer visible automated backups are enabled on the instance.
         */
        automatedBackupEnabled?: boolean | null;
        /**
         * Backup retention settings.
         */
        backupRetentionSettings?: Schema$RetentionSettings;
        /**
         * Whether point-in-time recovery is enabled. This is optional field, if the database service does not have this feature or metadata is not available in control plane, this can be omitted.
         */
        pointInTimeRecoveryEnabled?: boolean | null;
    }
    /**
     * Backup is consisted of multiple backup files.
     */
    export interface Schema$BackupFile {
        /**
         * Output only. The time when the backup file was created.
         */
        createTime?: string | null;
        /**
         * Output only. e.g: .rdb
         */
        fileName?: string | null;
        /**
         * Output only. Size of the backup file in bytes.
         */
        sizeBytes?: string | null;
    }
    /**
     * A backup run.
     */
    export interface Schema$BackupRun {
        /**
         * The time the backup operation completed. REQUIRED
         */
        endTime?: string | null;
        /**
         * Information about why the backup operation failed. This is only present if the run has the FAILED status. OPTIONAL
         */
        error?: Schema$OperationError;
        /**
         * The time the backup operation started. REQUIRED
         */
        startTime?: string | null;
        /**
         * The status of this run. REQUIRED
         */
        status?: string | null;
    }
    export interface Schema$CertChain {
        /**
         * The certificates that form the CA chain, from leaf to root order.
         */
        certificates?: string[] | null;
    }
    /**
     * Redis cluster certificate authority
     */
    export interface Schema$CertificateAuthority {
        managedServerCa?: Schema$ManagedCertificateAuthority;
        /**
         * Identifier. Unique name of the resource in this scope including project, location and cluster using the form: `projects/{project\}/locations/{location\}/clusters/{cluster\}/certificateAuthority`
         */
        name?: string | null;
    }
    /**
     * A cluster instance.
     */
    export interface Schema$Cluster {
        /**
         * Optional. If true, cluster endpoints that are created and registered by customers can be deleted asynchronously. That is, such a cluster endpoint can be de-registered before the forwarding rules in the cluster endpoint are deleted.
         */
        asyncClusterEndpointsDeletionEnabled?: boolean | null;
        /**
         * Optional. The authorization mode of the Redis cluster. If not provided, auth feature is disabled for the cluster.
         */
        authorizationMode?: string | null;
        /**
         * Optional. The automated backup config for the cluster.
         */
        automatedBackupConfig?: Schema$AutomatedBackupConfig;
        /**
         * Optional. Output only. The backup collection full resource name. Example: projects/{project\}/locations/{location\}/backupCollections/{collection\}
         */
        backupCollection?: string | null;
        /**
         * Optional. A list of cluster endpoints.
         */
        clusterEndpoints?: Schema$ClusterEndpoint[];
        /**
         * Output only. The timestamp associated with the cluster creation request.
         */
        createTime?: string | null;
        /**
         * Optional. Cross cluster replication config.
         */
        crossClusterReplicationConfig?: Schema$CrossClusterReplicationConfig;
        /**
         * Optional. The delete operation will fail when the value is set to true.
         */
        deletionProtectionEnabled?: boolean | null;
        /**
         * Output only. Endpoints created on each given network, for Redis clients to connect to the cluster. Currently only one discovery endpoint is supported.
         */
        discoveryEndpoints?: Schema$DiscoveryEndpoint[];
        /**
         * Output only. Encryption information of the data at rest of the cluster.
         */
        encryptionInfo?: Schema$EncryptionInfo;
        /**
         * Optional. Backups stored in Cloud Storage buckets. The Cloud Storage buckets need to be the same region as the clusters. Read permission is required to import from the provided Cloud Storage objects.
         */
        gcsSource?: Schema$GcsBackupSource;
        /**
         * Optional. The KMS key used to encrypt the at-rest data of the cluster.
         */
        kmsKey?: string | null;
        /**
         * Optional. ClusterMaintenancePolicy determines when to allow or deny updates.
         */
        maintenancePolicy?: Schema$ClusterMaintenancePolicy;
        /**
         * Output only. ClusterMaintenanceSchedule Output only Published maintenance schedule.
         */
        maintenanceSchedule?: Schema$ClusterMaintenanceSchedule;
        /**
         * Optional. Backups generated and managed by memorystore service.
         */
        managedBackupSource?: Schema$ManagedBackupSource;
        /**
         * Required. Identifier. Unique name of the resource in this scope including project and location using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}`
         */
        name?: string | null;
        /**
         * Optional. The type of a redis node in the cluster. NodeType determines the underlying machine-type of a redis node.
         */
        nodeType?: string | null;
        /**
         * Optional. Input only. Ondemand maintenance for the cluster. This field can be used to trigger ondemand critical update on the cluster.
         */
        ondemandMaintenance?: boolean | null;
        /**
         * Optional. Persistence config (RDB, AOF) for the cluster.
         */
        persistenceConfig?: Schema$ClusterPersistenceConfig;
        /**
         * Output only. Precise value of redis memory size in GB for the entire cluster.
         */
        preciseSizeGb?: number | null;
        /**
         * Optional. Each PscConfig configures the consumer network where IPs will be designated to the cluster for client access through Private Service Connect Automation. Currently, only one PscConfig is supported.
         */
        pscConfigs?: Schema$PscConfig[];
        /**
         * Output only. The list of PSC connections that are auto-created through service connectivity automation.
         */
        pscConnections?: Schema$PscConnection[];
        /**
         * Output only. Service attachment details to configure Psc connections
         */
        pscServiceAttachments?: Schema$PscServiceAttachment[];
        /**
         * Optional. Key/Value pairs of customer overrides for mutable Redis Configs
         */
        redisConfigs?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The number of replica nodes per shard.
         */
        replicaCount?: number | null;
        /**
         * Optional. Number of shards for the Redis cluster.
         */
        shardCount?: number | null;
        /**
         * Output only. Redis memory size in GB for the entire cluster rounded up to the next integer.
         */
        sizeGb?: number | null;
        /**
         * Output only. The current state of this cluster. Can be CREATING, READY, UPDATING, DELETING and SUSPENDED
         */
        state?: string | null;
        /**
         * Output only. Additional information about the current state of the cluster.
         */
        stateInfo?: Schema$StateInfo;
        /**
         * Optional. The in-transit encryption for the Redis cluster. If not provided, encryption is disabled for the cluster.
         */
        transitEncryptionMode?: string | null;
        /**
         * Output only. System assigned, unique identifier for the cluster.
         */
        uid?: string | null;
        /**
         * Optional. This config will be used to determine how the customer wants us to distribute cluster resources within the region.
         */
        zoneDistributionConfig?: Schema$ZoneDistributionConfig;
    }
    /**
     * ClusterEndpoint consists of PSC connections that are created as a group in each VPC network for accessing the cluster. In each group, there shall be one connection for each service attachment in the cluster.
     */
    export interface Schema$ClusterEndpoint {
        /**
         * Required. A group of PSC connections. They are created in the same VPC network, one for each service attachment in the cluster.
         */
        connections?: Schema$ConnectionDetail[];
    }
    /**
     * Maintenance policy per cluster.
     */
    export interface Schema$ClusterMaintenancePolicy {
        /**
         * Output only. The time when the policy was created i.e. Maintenance Window or Deny Period was assigned.
         */
        createTime?: string | null;
        /**
         * Output only. The time when the policy was updated i.e. Maintenance Window or Deny Period was updated.
         */
        updateTime?: string | null;
        /**
         * Optional. Maintenance window that is applied to resources covered by this policy. Minimum 1. For the current version, the maximum number of weekly_maintenance_window is expected to be one.
         */
        weeklyMaintenanceWindow?: Schema$ClusterWeeklyMaintenanceWindow[];
    }
    /**
     * Upcoming maintenance schedule.
     */
    export interface Schema$ClusterMaintenanceSchedule {
        /**
         * Output only. The end time of any upcoming scheduled maintenance for this instance.
         */
        endTime?: string | null;
        /**
         * Output only. The start time of any upcoming scheduled maintenance for this instance.
         */
        startTime?: string | null;
    }
    /**
     * Configuration of the persistence functionality.
     */
    export interface Schema$ClusterPersistenceConfig {
        /**
         * Optional. AOF configuration. This field will be ignored if mode is not AOF.
         */
        aofConfig?: Schema$AOFConfig;
        /**
         * Optional. The mode of persistence.
         */
        mode?: string | null;
        /**
         * Optional. RDB configuration. This field will be ignored if mode is not RDB.
         */
        rdbConfig?: Schema$RDBConfig;
    }
    /**
     * Time window specified for weekly operations.
     */
    export interface Schema$ClusterWeeklyMaintenanceWindow {
        /**
         * Allows to define schedule that runs specified day of the week.
         */
        day?: string | null;
        /**
         * Start time of the window in UTC.
         */
        startTime?: Schema$TimeOfDay;
    }
    /**
     * Contains compliance information about a security standard indicating unmet recommendations.
     */
    export interface Schema$Compliance {
        /**
         * Industry-wide compliance standards or benchmarks, such as CIS, PCI, and OWASP.
         */
        standard?: string | null;
        /**
         * Version of the standard or benchmark, for example, 1.1
         */
        version?: string | null;
    }
    /**
     * Detailed information of each PSC connection.
     */
    export interface Schema$ConnectionDetail {
        /**
         * Detailed information of a PSC connection that is created through service connectivity automation.
         */
        pscAutoConnection?: Schema$PscAutoConnection;
        /**
         * Detailed information of a PSC connection that is created by the customer who owns the cluster.
         */
        pscConnection?: Schema$PscConnection;
    }
    /**
     * Cross cluster replication config.
     */
    export interface Schema$CrossClusterReplicationConfig {
        /**
         * The role of the cluster in cross cluster replication.
         */
        clusterRole?: string | null;
        /**
         * Output only. An output only view of all the member clusters participating in the cross cluster replication. This view will be provided by every member cluster irrespective of its cluster role(primary or secondary). A primary cluster can provide information about all the secondary clusters replicating from it. However, a secondary cluster only knows about the primary cluster from which it is replicating. However, for scenarios, where the primary cluster is unavailable(e.g. regional outage), a GetCluster request can be sent to any other member cluster and this field will list all the member clusters participating in cross cluster replication.
         */
        membership?: Schema$Membership;
        /**
         * Details of the primary cluster that is used as the replication source for this secondary cluster. This field is only set for a secondary cluster.
         */
        primaryCluster?: Schema$RemoteCluster;
        /**
         * List of secondary clusters that are replicating from this primary cluster. This field is only set for a primary cluster.
         */
        secondaryClusters?: Schema$RemoteCluster[];
        /**
         * Output only. The last time cross cluster replication config was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Any custom metadata associated with the resource. e.g. A spanner instance can have multiple databases with its own unique metadata. Information for these individual databases can be captured in custom metadata data
     */
    export interface Schema$CustomMetadataData {
        /**
         * Metadata for individual internal resources in an instance. e.g. spanner instance can have multiple databases with unique configuration.
         */
        internalResourceMetadata?: Schema$InternalResourceMetadata[];
    }
    /**
     * DatabaseResourceFeed is the top level proto to be used to ingest different database resource level events into Condor platform.
     */
    export interface Schema$DatabaseResourceFeed {
        /**
         * Required. Timestamp when feed is generated.
         */
        feedTimestamp?: string | null;
        /**
         * Required. Type feed to be ingested into condor
         */
        feedType?: string | null;
        observabilityMetricData?: Schema$ObservabilityMetricData;
        recommendationSignalData?: Schema$DatabaseResourceRecommendationSignalData;
        resourceHealthSignalData?: Schema$DatabaseResourceHealthSignalData;
        /**
         * Primary key associated with the Resource. resource_id is available in individual feed level as well.
         */
        resourceId?: Schema$DatabaseResourceId;
        resourceMetadata?: Schema$DatabaseResourceMetadata;
    }
    /**
     * Common model for database resource health signal data.
     */
    export interface Schema$DatabaseResourceHealthSignalData {
        /**
         * Any other additional metadata
         */
        additionalMetadata?: {
            [key: string]: any;
        } | null;
        /**
         * Industry standards associated with this signal; if this signal is an issue, that could be a violation of the associated industry standard(s). For example, AUTO_BACKUP_DISABLED signal is associated with CIS GCP 1.1, CIS GCP 1.2, CIS GCP 1.3, NIST 800-53 and ISO-27001 compliance standards. If a database resource does not have automated backup enable, it will violate these following industry standards.
         */
        compliance?: Schema$Compliance[];
        /**
         * Description associated with signal
         */
        description?: string | null;
        /**
         * Required. The last time at which the event described by this signal took place
         */
        eventTime?: string | null;
        /**
         * The external-uri of the signal, using which more information about this signal can be obtained. In GCP, this will take user to SCC page to get more details about signals.
         */
        externalUri?: string | null;
        /**
         * Required. The name of the signal, ex: PUBLIC_SQL_INSTANCE, SQL_LOG_ERROR_VERBOSITY etc.
         */
        name?: string | null;
        /**
         * Cloud provider name. Ex: GCP/AWS/Azure/OnPrem/SelfManaged
         */
        provider?: string | null;
        /**
         * Closest parent container of this resource. In GCP, 'container' refers to a Cloud Resource Manager project. It must be resource name of a Cloud Resource Manager project with the format of "provider//", such as "projects/123". For GCP provided resources, number should be project number.
         */
        resourceContainer?: string | null;
        /**
         * Required. Database resource name associated with the signal. Resource name to follow CAIS resource_name format as noted here go/condor-common-datamodel
         */
        resourceName?: string | null;
        /**
         * Required. The class of the signal, such as if it's a THREAT or VULNERABILITY.
         */
        signalClass?: string | null;
        /**
         * Required. Unique identifier for the signal. This is an unique id which would be mainatined by partner to identify a signal.
         */
        signalId?: string | null;
        /**
         * The severity of the signal, such as if it's a HIGH or LOW severity.
         */
        signalSeverity?: string | null;
        /**
         * Required. Type of signal, for example, `AVAILABLE_IN_MULTIPLE_ZONES`, `LOGGING_MOST_ERRORS`, etc.
         */
        signalType?: string | null;
        state?: string | null;
    }
    /**
     * DatabaseResourceId will serve as primary key for any resource ingestion event.
     */
    export interface Schema$DatabaseResourceId {
        /**
         * Required. Cloud provider name. Ex: GCP/AWS/Azure/OnPrem/SelfManaged
         */
        provider?: string | null;
        /**
         * Optional. Needs to be used only when the provider is PROVIDER_OTHER.
         */
        providerDescription?: string | null;
        /**
         * Required. The type of resource this ID is identifying. Ex redis.googleapis.com/Instance, redis.googleapis.com/Cluster, alloydb.googleapis.com/Cluster, alloydb.googleapis.com/Instance, spanner.googleapis.com/Instance, spanner.googleapis.com/Database, firestore.googleapis.com/Database, sqladmin.googleapis.com/Instance, bigtableadmin.googleapis.com/Cluster, bigtableadmin.googleapis.com/Instance REQUIRED Please refer go/condor-common-datamodel
         */
        resourceType?: string | null;
        /**
         * Required. A service-local token that distinguishes this resource from other resources within the same service.
         */
        uniqueId?: string | null;
    }
    /**
     * Common model for database resource instance metadata. Next ID: 25
     */
    export interface Schema$DatabaseResourceMetadata {
        /**
         * Availability configuration for this instance
         */
        availabilityConfiguration?: Schema$AvailabilityConfiguration;
        /**
         * Backup configuration for this instance
         */
        backupConfiguration?: Schema$BackupConfiguration;
        /**
         * Latest backup run information for this instance
         */
        backupRun?: Schema$BackupRun;
        /**
         * The creation time of the resource, i.e. the time when resource is created and recorded in partner service.
         */
        creationTime?: string | null;
        /**
         * Current state of the instance.
         */
        currentState?: string | null;
        /**
         * Any custom metadata associated with the resource
         */
        customMetadata?: Schema$CustomMetadataData;
        /**
         * Optional. Edition represents whether the instance is ENTERPRISE or ENTERPRISE_PLUS. This information is core to Cloud SQL only and is used to identify the edition of the instance.
         */
        edition?: string | null;
        /**
         * Entitlements associated with the resource
         */
        entitlements?: Schema$Entitlement[];
        /**
         * The state that the instance is expected to be in. For example, an instance state can transition to UNHEALTHY due to wrong patch update, while the expected state will remain at the HEALTHY.
         */
        expectedState?: string | null;
        /**
         * GCBDR configuration for the resource.
         */
        gcbdrConfiguration?: Schema$GCBDRConfiguration;
        /**
         * Required. Unique identifier for a Database resource
         */
        id?: Schema$DatabaseResourceId;
        /**
         * The type of the instance. Specified at creation time.
         */
        instanceType?: string | null;
        /**
         * The resource location. REQUIRED
         */
        location?: string | null;
        /**
         * Machine configuration for this resource.
         */
        machineConfiguration?: Schema$MachineConfiguration;
        /**
         * Identifier for this resource's immediate parent/primary resource if the current resource is a replica or derived form of another Database resource. Else it would be NULL. REQUIRED if the immediate parent exists when first time resource is getting ingested, otherwise optional.
         */
        primaryResourceId?: Schema$DatabaseResourceId;
        /**
         * Primary resource location. REQUIRED if the immediate parent exists when first time resource is getting ingested, otherwise optional.
         */
        primaryResourceLocation?: string | null;
        /**
         * The product this resource represents.
         */
        product?: Schema$Product;
        /**
         * Closest parent Cloud Resource Manager container of this resource. It must be resource name of a Cloud Resource Manager project with the format of "/", such as "projects/123". For GCP provided resources, number should be project number.
         */
        resourceContainer?: string | null;
        /**
         * Required. Different from DatabaseResourceId.unique_id, a resource name can be reused over time. That is, after a resource named "ABC" is deleted, the name "ABC" can be used to to create a new resource within the same source. Resource name to follow CAIS resource_name format as noted here go/condor-common-datamodel
         */
        resourceName?: string | null;
        /**
         * Optional. Suspension reason for the resource.
         */
        suspensionReason?: string | null;
        /**
         * Optional. Tags associated with this resources.
         */
        tagsSet?: Schema$Tags;
        /**
         * The time at which the resource was updated and recorded at partner service.
         */
        updationTime?: string | null;
        /**
         * User-provided labels associated with the resource
         */
        userLabelSet?: Schema$UserLabels;
    }
    /**
     * Common model for database resource recommendation signal data.
     */
    export interface Schema$DatabaseResourceRecommendationSignalData {
        /**
         * Optional. Any other additional metadata specific to recommendation
         */
        additionalMetadata?: {
            [key: string]: any;
        } | null;
        /**
         * Required. last time recommendationw as refreshed
         */
        lastRefreshTime?: string | null;
        /**
         * Required. Recommendation state
         */
        recommendationState?: string | null;
        /**
         * Required. Name of recommendation. Examples: organizations/1234/locations/us-central1/recommenders/google.cloudsql.instance.PerformanceRecommender/recommendations/9876
         */
        recommender?: string | null;
        /**
         * Required. ID of recommender. Examples: "google.cloudsql.instance.PerformanceRecommender"
         */
        recommenderId?: string | null;
        /**
         * Required. Contains an identifier for a subtype of recommendations produced for the same recommender. Subtype is a function of content and impact, meaning a new subtype might be added when significant changes to `content` or `primary_impact.category` are introduced. See the Recommenders section to see a list of subtypes for a given Recommender. Examples: For recommender = "google.cloudsql.instance.PerformanceRecommender", recommender_subtype can be "MYSQL_HIGH_NUMBER_OF_OPEN_TABLES_BEST_PRACTICE"/"POSTGRES_HIGH_TRANSACTION_ID_UTILIZATION_BEST_PRACTICE"
         */
        recommenderSubtype?: string | null;
        /**
         * Required. Database resource name associated with the signal. Resource name to follow CAIS resource_name format as noted here go/condor-common-datamodel
         */
        resourceName?: string | null;
        /**
         * Required. Type of signal, for example, `SIGNAL_TYPE_IDLE`, `SIGNAL_TYPE_HIGH_NUMBER_OF_TABLES`, etc.
         */
        signalType?: string | null;
    }
    /**
     * Endpoints on each network, for Redis clients to connect to the cluster.
     */
    export interface Schema$DiscoveryEndpoint {
        /**
         * Output only. Address of the exposed Redis endpoint used by clients to connect to the service. The address could be either IP or hostname.
         */
        address?: string | null;
        /**
         * Output only. The port number of the exposed Redis endpoint.
         */
        port?: number | null;
        /**
         * Output only. Customer configuration for where the endpoint is created and accessed from.
         */
        pscConfig?: Schema$PscConfig;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * EncryptionInfo describes the encryption information of a cluster or a backup.
     */
    export interface Schema$EncryptionInfo {
        /**
         * Output only. Type of encryption.
         */
        encryptionType?: string | null;
        /**
         * Output only. The state of the primary version of the KMS key perceived by the system. This field is not populated in backups.
         */
        kmsKeyPrimaryState?: string | null;
        /**
         * Output only. KMS key versions that are being used to protect the data at-rest.
         */
        kmsKeyVersions?: string[] | null;
        /**
         * Output only. The most recent time when the encryption info was updated.
         */
        lastUpdateTime?: string | null;
    }
    /**
     * Proto representing the access that a user has to a specific feature/service. NextId: 3.
     */
    export interface Schema$Entitlement {
        /**
         * The current state of user's accessibility to a feature/benefit.
         */
        entitlementState?: string | null;
        /**
         * An enum that represents the type of this entitlement.
         */
        type?: string | null;
    }
    /**
     * Request for [ExportBackup].
     */
    export interface Schema$ExportBackupRequest {
        /**
         * Google Cloud Storage bucket, like "my-bucket".
         */
        gcsBucket?: string | null;
    }
    /**
     * Request for Export.
     */
    export interface Schema$ExportInstanceRequest {
        /**
         * Required. Specify data to be exported.
         */
        outputConfig?: Schema$OutputConfig;
    }
    /**
     * Request for Failover.
     */
    export interface Schema$FailoverInstanceRequest {
        /**
         * Optional. Available data protection modes that the user can choose. If it's unspecified, data protection mode will be LIMITED_DATA_LOSS by default.
         */
        dataProtectionMode?: string | null;
    }
    /**
     * This schedule allows the backup to be triggered at a fixed frequency (currently only daily is supported).
     */
    export interface Schema$FixedFrequencySchedule {
        /**
         * Required. The start time of every automated backup in UTC. It must be set to the start of an hour. This field is required.
         */
        startTime?: Schema$TimeOfDay;
    }
    /**
     * GCBDR Configuration for the resource.
     */
    export interface Schema$GCBDRConfiguration {
        /**
         * Whether the resource is managed by GCBDR.
         */
        gcbdrManaged?: boolean | null;
    }
    /**
     * Backups stored in Cloud Storage buckets. The Cloud Storage buckets need to be the same region as the clusters.
     */
    export interface Schema$GcsBackupSource {
        /**
         * Optional. URIs of the Cloud Storage objects to import. Example: gs://bucket1/object1, gs://bucket2/folder2/object2
         */
        uris?: string[] | null;
    }
    /**
     * The Cloud Storage location for the output content
     */
    export interface Schema$GcsDestination {
        /**
         * Required. Data destination URI (e.g. 'gs://my_bucket/my_object'). Existing files will be overwritten.
         */
        uri?: string | null;
    }
    /**
     * The Cloud Storage location for the input content
     */
    export interface Schema$GcsSource {
        /**
         * Required. Source data URI. (e.g. 'gs://my_bucket/my_object').
         */
        uri?: string | null;
    }
    /**
     * This location metadata represents additional configuration options for a given location where a Redis instance may be created. All fields are output only. It is returned as content of the `google.cloud.location.Location.metadata` field.
     */
    export interface Schema$GoogleCloudRedisV1LocationMetadata {
        /**
         * Output only. The set of available zones in the location. The map is keyed by the lowercase ID of each zone, as defined by GCE. These keys can be specified in `location_id` or `alternative_location_id` fields when creating a Redis instance.
         */
        availableZones?: {
            [key: string]: Schema$GoogleCloudRedisV1ZoneMetadata;
        } | null;
    }
    /**
     * Represents the v1 metadata of the long-running operation.
     */
    export interface Schema$GoogleCloudRedisV1OperationMetadata {
        /**
         * API version.
         */
        apiVersion?: string | null;
        /**
         * Specifies if cancellation was requested for the operation.
         */
        cancelRequested?: boolean | null;
        /**
         * Creation timestamp.
         */
        createTime?: string | null;
        /**
         * End timestamp.
         */
        endTime?: string | null;
        /**
         * Operation status details.
         */
        statusDetail?: string | null;
        /**
         * Operation target.
         */
        target?: string | null;
        /**
         * Operation verb.
         */
        verb?: string | null;
    }
    /**
     * Defines specific information for a particular zone. Currently empty and reserved for future use only.
     */
    export interface Schema$GoogleCloudRedisV1ZoneMetadata {
    }
    /**
     * Request for Import.
     */
    export interface Schema$ImportInstanceRequest {
        /**
         * Required. Specify data to be imported.
         */
        inputConfig?: Schema$InputConfig;
    }
    /**
     * The input content
     */
    export interface Schema$InputConfig {
        /**
         * Google Cloud Storage location where input content is located.
         */
        gcsSource?: Schema$GcsSource;
    }
    /**
     * A Memorystore for Redis instance.
     */
    export interface Schema$Instance {
        /**
         * Optional. If specified, at least one node will be provisioned in this zone in addition to the zone specified in location_id. Only applicable to standard tier. If provided, it must be a different zone from the one provided in [location_id]. Additional nodes beyond the first 2 will be placed in zones selected by the service.
         */
        alternativeLocationId?: string | null;
        /**
         * Optional. Indicates whether OSS Redis AUTH is enabled for the instance. If set to "true" AUTH is enabled on the instance. Default value is "false" meaning AUTH is disabled.
         */
        authEnabled?: boolean | null;
        /**
         * Optional. The full name of the Google Compute Engine [network](https://cloud.google.com/vpc/docs/vpc) to which the instance is connected. If left unspecified, the `default` network will be used.
         */
        authorizedNetwork?: string | null;
        /**
         * Optional. The available maintenance versions that an instance could update to.
         */
        availableMaintenanceVersions?: string[] | null;
        /**
         * Optional. The network connect mode of the Redis instance. If not provided, the connect mode defaults to DIRECT_PEERING.
         */
        connectMode?: string | null;
        /**
         * Output only. The time the instance was created.
         */
        createTime?: string | null;
        /**
         * Output only. The current zone where the Redis primary node is located. In basic tier, this will always be the same as [location_id]. In standard tier, this can be the zone of any node in the instance.
         */
        currentLocationId?: string | null;
        /**
         * Optional. The KMS key reference that the customer provides when trying to create the instance.
         */
        customerManagedKey?: string | null;
        /**
         * An arbitrary and optional user-provided name for the instance.
         */
        displayName?: string | null;
        /**
         * Output only. Hostname or IP address of the exposed Redis endpoint used by clients to connect to the service.
         */
        host?: string | null;
        /**
         * Resource labels to represent user provided metadata
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The zone where the instance will be provisioned. If not provided, the service will choose a zone from the specified region for the instance. For standard tier, additional nodes will be added across multiple zones for protection against zonal failures. If specified, at least one node will be provisioned in this zone.
         */
        locationId?: string | null;
        /**
         * Optional. The maintenance policy for the instance. If not provided, maintenance events can be performed at any time.
         */
        maintenancePolicy?: Schema$MaintenancePolicy;
        /**
         * Output only. Date and time of upcoming maintenance events which have been scheduled.
         */
        maintenanceSchedule?: Schema$MaintenanceSchedule;
        /**
         * Optional. The self service update maintenance version. The version is date based such as "20210712_00_00".
         */
        maintenanceVersion?: string | null;
        /**
         * Required. Redis memory size in GiB.
         */
        memorySizeGb?: number | null;
        /**
         * Required. Unique name of the resource in this scope including project and location using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` Note: Redis instances are managed and addressed at regional level so location_id here refers to a GCP region; however, users may choose which specific zone (or collection of zones for cross-zone instances) an instance should be provisioned in. Refer to location_id and alternative_location_id fields for more details.
         */
        name?: string | null;
        /**
         * Output only. Info per node.
         */
        nodes?: Schema$NodeInfo[];
        /**
         * Optional. Persistence configuration parameters
         */
        persistenceConfig?: Schema$PersistenceConfig;
        /**
         * Output only. Cloud IAM identity used by import / export operations to transfer data to/from Cloud Storage. Format is "serviceAccount:". The value may change over time for a given instance so should be checked before each import/export operation.
         */
        persistenceIamIdentity?: string | null;
        /**
         * Output only. The port number of the exposed Redis endpoint.
         */
        port?: number | null;
        /**
         * Output only. Hostname or IP address of the exposed readonly Redis endpoint. Standard tier only. Targets all healthy replica nodes in instance. Replication is asynchronous and replica nodes will exhibit some lag behind the primary. Write requests must target 'host'.
         */
        readEndpoint?: string | null;
        /**
         * Output only. The port number of the exposed readonly redis endpoint. Standard tier only. Write requests should target 'port'.
         */
        readEndpointPort?: number | null;
        /**
         * Optional. Read replicas mode for the instance. Defaults to READ_REPLICAS_DISABLED.
         */
        readReplicasMode?: string | null;
        /**
         * Optional. Redis configuration parameters, according to http://redis.io/topics/config. Currently, the only supported parameters are: Redis version 3.2 and newer: * maxmemory-policy * notify-keyspace-events Redis version 4.0 and newer: * activedefrag * lfu-decay-time * lfu-log-factor * maxmemory-gb Redis version 5.0 and newer: * stream-node-max-bytes * stream-node-max-entries
         */
        redisConfigs?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The version of Redis software. If not provided, the default version will be used. Currently, the supported values are: * `REDIS_3_2` for Redis 3.2 compatibility * `REDIS_4_0` for Redis 4.0 compatibility * `REDIS_5_0` for Redis 5.0 compatibility * `REDIS_6_X` for Redis 6.x compatibility * `REDIS_7_0` for Redis 7.0 compatibility (default) * `REDIS_7_2` for Redis 7.2 compatibility
         */
        redisVersion?: string | null;
        /**
         * Optional. The number of replica nodes. The valid range for the Standard Tier with read replicas enabled is [1-5] and defaults to 2. If read replicas are not enabled for a Standard Tier instance, the only valid value is 1 and the default is 1. The valid value for basic tier is 0 and the default is also 0.
         */
        replicaCount?: number | null;
        /**
         * Optional. For DIRECT_PEERING mode, the CIDR range of internal addresses that are reserved for this instance. Range must be unique and non-overlapping with existing subnets in an authorized network. For PRIVATE_SERVICE_ACCESS mode, the name of one allocated IP address ranges associated with this private service access connection. If not provided, the service will choose an unused /29 block, for example, 10.0.0.0/29 or 192.168.0.0/29. For READ_REPLICAS_ENABLED the default block size is /28.
         */
        reservedIpRange?: string | null;
        /**
         * Optional. Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Optional. Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Optional. Additional IP range for node placement. Required when enabling read replicas on an existing instance. For DIRECT_PEERING mode value must be a CIDR range of size /28, or "auto". For PRIVATE_SERVICE_ACCESS mode value must be the name of an allocated address range associated with the private service access connection, or "auto".
         */
        secondaryIpRange?: string | null;
        /**
         * Output only. List of server CA certificates for the instance.
         */
        serverCaCerts?: Schema$TlsCertificate[];
        /**
         * Output only. The current state of this instance.
         */
        state?: string | null;
        /**
         * Output only. Additional information about the current status of this instance, if available.
         */
        statusMessage?: string | null;
        /**
         * Optional. reasons that causes instance in "SUSPENDED" state.
         */
        suspensionReasons?: string[] | null;
        /**
         * Required. The service tier of the instance.
         */
        tier?: string | null;
        /**
         * Optional. The TLS mode of the Redis instance. If not provided, TLS is disabled for the instance.
         */
        transitEncryptionMode?: string | null;
    }
    /**
     * Instance AUTH string details.
     */
    export interface Schema$InstanceAuthString {
        /**
         * AUTH string set on the instance.
         */
        authString?: string | null;
    }
    /**
     * Metadata for individual internal resources in an instance. e.g. spanner instance can have multiple databases with unique configuration settings. Similarly bigtable can have multiple clusters within same bigtable instance.
     */
    export interface Schema$InternalResourceMetadata {
        /**
         * Backup configuration for this database
         */
        backupConfiguration?: Schema$BackupConfiguration;
        /**
         * Information about the last backup attempt for this database
         */
        backupRun?: Schema$BackupRun;
        /**
         * Whether deletion protection is enabled for this internal resource.
         */
        isDeletionProtectionEnabled?: boolean | null;
        product?: Schema$Product;
        resourceId?: Schema$DatabaseResourceId;
        /**
         * Required. internal resource name for spanner this will be database name e.g."spanner.googleapis.com/projects/123/abc/instances/inst1/databases/db1"
         */
        resourceName?: string | null;
    }
    /**
     * Response for [ListBackupCollections].
     */
    export interface Schema$ListBackupCollectionsResponse {
        /**
         * A list of backupCollections in the project. If the `location_id` in the parent field of the request is "-", all regions available to the project are queried, and the results aggregated. If in such an aggregated query a location is unavailable, a placeholder backupCollection entry is included in the response with the `name` field set to a value of the form `projects/{project_id\}/locations/{location_id\}/backupCollections/`- and the `status` field set to ERROR and `status_message` field set to "location not available for ListBackupCollections".
         */
        backupCollections?: Schema$BackupCollection[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for [ListBackups].
     */
    export interface Schema$ListBackupsResponse {
        /**
         * A list of backups in the project.
         */
        backups?: Schema$Backup[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * Backups that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListClusters.
     */
    export interface Schema$ListClustersResponse {
        /**
         * A list of Redis clusters in the project in the specified location, or across all locations. If the `location_id` in the parent field of the request is "-", all regions available to the project are queried, and the results aggregated. If in such an aggregated query a location is unavailable, a placeholder Redis entry is included in the response with the `name` field set to a value of the form `projects/{project_id\}/locations/{location_id\}/clusters/`- and the `status` field set to ERROR and `status_message` field set to "location not available for ListClusters".
         */
        clusters?: Schema$Cluster[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response for ListInstances.
     */
    export interface Schema$ListInstancesResponse {
        /**
         * A list of Redis instances in the project in the specified location, or across all locations. If the `location_id` in the parent field of the request is "-", all regions available to the project are queried, and the results aggregated. If in such an aggregated query a location is unavailable, a placeholder Redis entry is included in the response with the `name` field set to a value of the form `projects/{project_id\}/locations/{location_id\}/instances/`- and the `status` field set to ERROR and `status_message` field set to "location not available for ListInstances".
         */
        instances?: Schema$Instance[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
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
         * Resource ID for the region. For example: "us-east1".
         */
        locationId?: string | null;
        /**
         * Output only. The set of available zones in the location. The map is keyed by the lowercase ID of each zone, as defined by Compute Engine. These keys can be specified in `location_id` or `alternative_location_id` fields when creating a Redis instance.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Full resource name for the region. For example: "projects/example-project/locations/us-east1".
         */
        name?: string | null;
    }
    /**
     * MachineConfiguration describes the configuration of a machine specific to Database Resource.
     */
    export interface Schema$MachineConfiguration {
        /**
         * The number of CPUs. Deprecated. Use vcpu_count instead. TODO(b/342344482) add proto validations again after bug fix.
         */
        cpuCount?: number | null;
        /**
         * Memory size in bytes. TODO(b/342344482) add proto validations again after bug fix.
         */
        memorySizeInBytes?: string | null;
        /**
         * Optional. Number of shards (if applicable).
         */
        shardCount?: number | null;
        /**
         * Optional. The number of vCPUs. TODO(b/342344482) add proto validations again after bug fix.
         */
        vcpuCount?: number | null;
    }
    /**
     * Maintenance policy for an instance.
     */
    export interface Schema$MaintenancePolicy {
        /**
         * Output only. The time when the policy was created.
         */
        createTime?: string | null;
        /**
         * Optional. Description of what this policy is for. Create/Update methods return INVALID_ARGUMENT if the length is greater than 512.
         */
        description?: string | null;
        /**
         * Output only. The time when the policy was last updated.
         */
        updateTime?: string | null;
        /**
         * Optional. Maintenance window that is applied to resources covered by this policy. Minimum 1. For the current version, the maximum number of weekly_window is expected to be one.
         */
        weeklyMaintenanceWindow?: Schema$WeeklyMaintenanceWindow[];
    }
    /**
     * Upcoming maintenance schedule. If no maintenance is scheduled, fields are not populated.
     */
    export interface Schema$MaintenanceSchedule {
        /**
         * If the scheduled maintenance can be rescheduled, default is true.
         */
        canReschedule?: boolean | null;
        /**
         * Output only. The end time of any upcoming scheduled maintenance for this instance.
         */
        endTime?: string | null;
        /**
         * Output only. The deadline that the maintenance schedule start time can not go beyond, including reschedule.
         */
        scheduleDeadlineTime?: string | null;
        /**
         * Output only. The start time of any upcoming scheduled maintenance for this instance.
         */
        startTime?: string | null;
    }
    /**
     * Backups that generated and managed by memorystore.
     */
    export interface Schema$ManagedBackupSource {
        /**
         * Optional. Example: //redis.googleapis.com/projects/{project\}/locations/{location\}/backupCollections/{collection\}/backups/{backup\} A shorter version (without the prefix) of the backup name is also supported, like projects/{project\}/locations/{location\}/backupCollections/{collection\}/backups/{backup_id\} In this case, it assumes the backup is under redis.googleapis.com.
         */
        backup?: string | null;
    }
    export interface Schema$ManagedCertificateAuthority {
        /**
         * The PEM encoded CA certificate chains for redis managed server authentication
         */
        caCerts?: Schema$CertChain[];
    }
    /**
     * An output only view of all the member clusters participating in the cross cluster replication.
     */
    export interface Schema$Membership {
        /**
         * Output only. The primary cluster that acts as the source of replication for the secondary clusters.
         */
        primaryCluster?: Schema$RemoteCluster;
        /**
         * Output only. The list of secondary clusters replicating from the primary cluster.
         */
        secondaryClusters?: Schema$RemoteCluster[];
    }
    /**
     * Node specific properties.
     */
    export interface Schema$NodeInfo {
        /**
         * Output only. Node identifying string. e.g. 'node-0', 'node-1'
         */
        id?: string | null;
        /**
         * Output only. Location of the node.
         */
        zone?: string | null;
    }
    export interface Schema$ObservabilityMetricData {
        /**
         * Required. Type of aggregation performed on the metric.
         */
        aggregationType?: string | null;
        /**
         * Required. Type of metric like CPU, Memory, etc.
         */
        metricType?: string | null;
        /**
         * Required. The time the metric value was observed.
         */
        observationTime?: string | null;
        /**
         * Required. Database resource name associated with the signal. Resource name to follow CAIS resource_name format as noted here go/condor-common-datamodel
         */
        resourceName?: string | null;
        /**
         * Required. Value of the metric type.
         */
        value?: Schema$TypedValue;
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
         * { `createTime`: The time the operation was created. `endTime`: The time the operation finished running. `target`: Server-defined resource path for the target of the operation. `verb`: Name of the verb executed by the operation. `statusDetail`: Human-readable status of the operation, if any. `cancelRequested`: Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`. `apiVersion`: API version used to start the operation. \}
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
     * An error that occurred during a backup creation operation.
     */
    export interface Schema$OperationError {
        /**
         * Identifies the specific error that occurred. REQUIRED
         */
        code?: string | null;
        errorType?: string | null;
        /**
         * Additional information about the error encountered. REQUIRED
         */
        message?: string | null;
    }
    /**
     * Pre-defined metadata fields.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        requestedCancellation?: boolean | null;
        /**
         * Output only. Human-readable status of the operation, if any.
         */
        statusMessage?: string | null;
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
     * The output content
     */
    export interface Schema$OutputConfig {
        /**
         * Google Cloud Storage destination for output content.
         */
        gcsDestination?: Schema$GcsDestination;
    }
    /**
     * Configuration of the persistence functionality.
     */
    export interface Schema$PersistenceConfig {
        /**
         * Optional. Controls whether Persistence features are enabled. If not provided, the existing value will be used.
         */
        persistenceMode?: string | null;
        /**
         * Output only. The next time that a snapshot attempt is scheduled to occur.
         */
        rdbNextSnapshotTime?: string | null;
        /**
         * Optional. Period between RDB snapshots. Snapshots will be attempted every period starting from the provided snapshot start time. For example, a start time of 01/01/2033 06:45 and SIX_HOURS snapshot period will do nothing until 01/01/2033, and then trigger snapshots every day at 06:45, 12:45, 18:45, and 00:45 the next day, and so on. If not provided, TWENTY_FOUR_HOURS will be used as default.
         */
        rdbSnapshotPeriod?: string | null;
        /**
         * Optional. Date and time that the first snapshot was/will be attempted, and to which future snapshots will be aligned. If not provided, the current time will be used.
         */
        rdbSnapshotStartTime?: string | null;
    }
    /**
     * Product specification for Condor resources.
     */
    export interface Schema$Product {
        /**
         * The specific engine that the underlying database is running.
         */
        engine?: string | null;
        /**
         * Type of specific database product. It could be CloudSQL, AlloyDB etc..
         */
        type?: string | null;
        /**
         * Version of the underlying database engine. Example values: For MySQL, it could be "8.0", "5.7" etc.. For Postgres, it could be "14", "15" etc..
         */
        version?: string | null;
    }
    /**
     * Details of consumer resources in a PSC connection that is created through Service Connectivity Automation.
     */
    export interface Schema$PscAutoConnection {
        /**
         * Output only. The IP allocated on the consumer network for the PSC forwarding rule.
         */
        address?: string | null;
        /**
         * Output only. Type of the PSC connection.
         */
        connectionType?: string | null;
        /**
         * Output only. The URI of the consumer side forwarding rule. Example: projects/{projectNumOrId\}/regions/us-east1/forwardingRules/{resourceId\}.
         */
        forwardingRule?: string | null;
        /**
         * Required. The consumer network where the IP address resides, in the form of projects/{project_id\}/global/networks/{network_id\}.
         */
        network?: string | null;
        /**
         * Required. The consumer project_id where the forwarding rule is created from.
         */
        projectId?: string | null;
        /**
         * Output only. The PSC connection id of the forwarding rule connected to the service attachment.
         */
        pscConnectionId?: string | null;
        /**
         * Output only. The status of the PSC connection. Please note that this value is updated periodically. Please use Private Service Connect APIs for the latest status.
         */
        pscConnectionStatus?: string | null;
        /**
         * Output only. The service attachment which is the target of the PSC connection, in the form of projects/{project-id\}/regions/{region\}/serviceAttachments/{service-attachment-id\}.
         */
        serviceAttachment?: string | null;
    }
    export interface Schema$PscConfig {
        /**
         * Required. The network where the IP address of the discovery endpoint will be reserved, in the form of projects/{network_project\}/global/networks/{network_id\}.
         */
        network?: string | null;
    }
    /**
     * Details of consumer resources in a PSC connection.
     */
    export interface Schema$PscConnection {
        /**
         * Required. The IP allocated on the consumer network for the PSC forwarding rule.
         */
        address?: string | null;
        /**
         * Output only. Type of the PSC connection.
         */
        connectionType?: string | null;
        /**
         * Required. The URI of the consumer side forwarding rule. Example: projects/{projectNumOrId\}/regions/us-east1/forwardingRules/{resourceId\}.
         */
        forwardingRule?: string | null;
        /**
         * Required. The consumer network where the IP address resides, in the form of projects/{project_id\}/global/networks/{network_id\}.
         */
        network?: string | null;
        /**
         * Output only. The port number of the exposed discovery endpoint.
         */
        port?: number | null;
        /**
         * Optional. Project ID of the consumer project where the forwarding rule is created in.
         */
        projectId?: string | null;
        /**
         * Required. The PSC connection id of the forwarding rule connected to the service attachment.
         */
        pscConnectionId?: string | null;
        /**
         * Output only. The status of the PSC connection. Please note that this value is updated periodically. To get the latest status of a PSC connection, follow https://cloud.google.com/vpc/docs/configure-private-service-connect-services#endpoint-details.
         */
        pscConnectionStatus?: string | null;
        /**
         * Required. The service attachment which is the target of the PSC connection, in the form of projects/{project-id\}/regions/{region\}/serviceAttachments/{service-attachment-id\}.
         */
        serviceAttachment?: string | null;
    }
    /**
     * Configuration of a service attachment of the cluster, for creating PSC connections.
     */
    export interface Schema$PscServiceAttachment {
        /**
         * Output only. Type of a PSC connection targeting this service attachment.
         */
        connectionType?: string | null;
        /**
         * Output only. Service attachment URI which your self-created PscConnection should use as target
         */
        serviceAttachment?: string | null;
    }
    /**
     * Configuration of the RDB based persistence.
     */
    export interface Schema$RDBConfig {
        /**
         * Optional. Period between RDB snapshots.
         */
        rdbSnapshotPeriod?: string | null;
        /**
         * Optional. The time that the first snapshot was/will be attempted, and to which future snapshots will be aligned. If not provided, the current time will be used.
         */
        rdbSnapshotStartTime?: string | null;
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
     * Details of the remote cluster associated with this cluster in a cross cluster replication setup.
     */
    export interface Schema$RemoteCluster {
        /**
         * The full resource path of the remote cluster in the format: projects//locations//clusters/
         */
        cluster?: string | null;
        /**
         * Output only. The unique identifier of the remote cluster.
         */
        uid?: string | null;
    }
    /**
     * Request for rescheduling a cluster maintenance.
     */
    export interface Schema$RescheduleClusterMaintenanceRequest {
        /**
         * Required. If reschedule type is SPECIFIC_TIME, must set up schedule_time as well.
         */
        rescheduleType?: string | null;
        /**
         * Optional. Timestamp when the maintenance shall be rescheduled to if reschedule_type=SPECIFIC_TIME, in RFC 3339 format, for example `2012-11-15T16:19:00.094Z`.
         */
        scheduleTime?: string | null;
    }
    /**
     * Request for RescheduleMaintenance.
     */
    export interface Schema$RescheduleMaintenanceRequest {
        /**
         * Required. If reschedule type is SPECIFIC_TIME, must set up schedule_time as well.
         */
        rescheduleType?: string | null;
        /**
         * Optional. Timestamp when the maintenance shall be rescheduled to if reschedule_type=SPECIFIC_TIME, in RFC 3339 format, for example `2012-11-15T16:19:00.094Z`.
         */
        scheduleTime?: string | null;
    }
    export interface Schema$RetentionSettings {
        /**
         * Duration based retention period i.e. 172800 seconds (2 days)
         */
        durationBasedRetention?: string | null;
        quantityBasedRetention?: number | null;
        /**
         * The unit that 'retained_backups' represents.
         */
        retentionUnit?: string | null;
        timeBasedRetention?: string | null;
        /**
         * Timestamp based retention period i.e. 2024-05-01T00:00:00Z
         */
        timestampBasedRetentionTime?: string | null;
    }
    /**
     * Represents additional information about the state of the cluster.
     */
    export interface Schema$StateInfo {
        /**
         * Describes ongoing update on the cluster when cluster state is UPDATING.
         */
        updateInfo?: Schema$UpdateInfo;
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
     * Message type for storing tags. Tags provide a way to create annotations for resources, and in some cases conditionally allow or deny policies based on whether a resource has a specific tag.
     */
    export interface Schema$Tags {
        /**
         * The Tag key/value mappings.
         */
        tags?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Represents a time of day. The date and time zone are either not significant or are specified elsewhere. An API may choose to allow leap seconds. Related types are google.type.Date and `google.protobuf.Timestamp`.
     */
    export interface Schema$TimeOfDay {
        /**
         * Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.
         */
        minutes?: number | null;
        /**
         * Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.
         */
        nanos?: number | null;
        /**
         * Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
    }
    /**
     * TlsCertificate Resource
     */
    export interface Schema$TlsCertificate {
        /**
         * PEM representation.
         */
        cert?: string | null;
        /**
         * Output only. The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2020-05-18T00:00:00.094Z`.
         */
        createTime?: string | null;
        /**
         * Output only. The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2020-05-18T00:00:00.094Z`.
         */
        expireTime?: string | null;
        /**
         * Serial number, as extracted from the certificate.
         */
        serialNumber?: string | null;
        /**
         * Sha1 Fingerprint of the certificate.
         */
        sha1Fingerprint?: string | null;
    }
    /**
     * TypedValue represents the value of a metric type. It can either be a double, an int64, a string or a bool.
     */
    export interface Schema$TypedValue {
        /**
         * For boolean value
         */
        boolValue?: boolean | null;
        /**
         * For double value
         */
        doubleValue?: number | null;
        /**
         * For integer value
         */
        int64Value?: string | null;
        /**
         * For string value
         */
        stringValue?: string | null;
    }
    /**
     * Represents information about an updating cluster.
     */
    export interface Schema$UpdateInfo {
        /**
         * Target node type for redis cluster.
         */
        targetNodeType?: string | null;
        /**
         * Target number of replica nodes per shard.
         */
        targetReplicaCount?: number | null;
        /**
         * Target number of shards for redis cluster
         */
        targetShardCount?: number | null;
    }
    /**
     * Request for UpgradeInstance.
     */
    export interface Schema$UpgradeInstanceRequest {
        /**
         * Required. Specifies the target version of Redis software to upgrade to.
         */
        redisVersion?: string | null;
    }
    /**
     * Message type for storing user labels. User labels are used to tag App Engine resources, allowing users to search for resources matching a set of labels and to aggregate usage data by labels.
     */
    export interface Schema$UserLabels {
        labels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Time window in which disruptive maintenance updates occur. Non-disruptive updates can occur inside or outside this window.
     */
    export interface Schema$WeeklyMaintenanceWindow {
        /**
         * Required. The day of week that maintenance updates occur.
         */
        day?: string | null;
        /**
         * Output only. Duration of the maintenance window. The current window is fixed at 1 hour.
         */
        duration?: string | null;
        /**
         * Required. Start time of the window in UTC time.
         */
        startTime?: Schema$TimeOfDay;
    }
    /**
     * Zone distribution config for allocation of cluster resources.
     */
    export interface Schema$ZoneDistributionConfig {
        /**
         * Optional. The mode of zone distribution. Defaults to MULTI_ZONE, when not specified.
         */
        mode?: string | null;
        /**
         * Optional. When SINGLE ZONE distribution is selected, zone field would be used to allocate all resources in that zone. This is not applicable to MULTI_ZONE, and would be ignored for MULTI_ZONE clusters.
         */
        zone?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        backupCollections: Resource$Projects$Locations$Backupcollections;
        clusters: Resource$Projects$Locations$Clusters;
        instances: Resource$Projects$Locations$Instances;
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
    export class Resource$Projects$Locations$Backupcollections {
        context: APIRequestContext;
        backups: Resource$Projects$Locations$Backupcollections$Backups;
        constructor(context: APIRequestContext);
        /**
         * Get a backup collection.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupcollections$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupcollections$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupCollection>>;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupCollection>, callback: BodyResponseCallback<Schema$BackupCollection>): void;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Get, callback: BodyResponseCallback<Schema$BackupCollection>): void;
        get(callback: BodyResponseCallback<Schema$BackupCollection>): void;
        /**
         * Lists all backup collections owned by a consumer project in either the specified location (region) or all locations. If `location_id` is specified as `-` (wildcard), then all regions available to the project are queried, and the results are aggregated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupcollections$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupcollections$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupCollectionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupcollections$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupcollections$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupCollectionsResponse>, callback: BodyResponseCallback<Schema$ListBackupCollectionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupcollections$List, callback: BodyResponseCallback<Schema$ListBackupCollectionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupCollectionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$Get extends StandardParameters {
        /**
         * Required. Redis backupCollection resource name using the form: `projects/{project_id\}/locations/{location_id\}/backupCollections/{backup_collection_id\}` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$List extends StandardParameters {
        /**
         * Optional. The maximum number of items to return. If not specified, a default value of 1000 will be used by the service. Regardless of the page_size value, the response may include a partial list and a caller should only rely on response's `next_page_token` to determine if there are more clusters left to be queried.
         */
        pageSize?: number;
        /**
         * Optional. The `next_page_token` value returned from a previous [ListBackupCollections] request, if any.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the backupCollection location using the form: `projects/{project_id\}/locations/{location_id\}` where `location_id` refers to a Google Cloud region.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Backupcollections$Backups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a specific backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Backupcollections$Backups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Exports a specific backup to a customer target Cloud Storage URI.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Backupcollections$Backups$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the details of a specific backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupcollections$Backups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Backup>>;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Get, options: MethodOptions | BodyResponseCallback<Schema$Backup>, callback: BodyResponseCallback<Schema$Backup>): void;
        get(params: Params$Resource$Projects$Locations$Backupcollections$Backups$Get, callback: BodyResponseCallback<Schema$Backup>): void;
        get(callback: BodyResponseCallback<Schema$Backup>): void;
        /**
         * Lists all backups owned by a backup collection.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupcollections$Backups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupcollections$Backups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupcollections$Backups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupcollections$Backups$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupsResponse>, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupcollections$Backups$List, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$Backups$Delete extends StandardParameters {
        /**
         * Required. Redis backup resource name using the form: `projects/{project_id\}/locations/{location_id\}/backupCollections/{backup_collection_id\}/backups/{backup_id\}`
         */
        name?: string;
        /**
         * Optional. Idempotent request UUID.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$Backups$Export extends StandardParameters {
        /**
         * Required. Redis backup resource name using the form: `projects/{project_id\}/locations/{location_id\}/backupCollections/{backup_collection_id\}/backups/{backup_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportBackupRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$Backups$Get extends StandardParameters {
        /**
         * Required. Redis backup resource name using the form: `projects/{project_id\}/locations/{location_id\}/backupCollections/{backup_collection_id\}/backups/{backup_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupcollections$Backups$List extends StandardParameters {
        /**
         * Optional. The maximum number of items to return. If not specified, a default value of 1000 will be used by the service. Regardless of the page_size value, the response may include a partial list and a caller should only rely on response's `next_page_token` to determine if there are more clusters left to be queried.
         */
        pageSize?: number;
        /**
         * Optional. The `next_page_token` value returned from a previous [ListBackupCollections] request, if any.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the backupCollection using the form: `projects/{project_id\}/locations/{location_id\}/backupCollections/{backup_collection_id\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Clusters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Backup Redis Cluster. If this is the first time a backup is being created, a backup collection will be created at the backend, and this backup belongs to this collection. Both collection and backup will have a resource name. Backup will be executed for each shard. A replica (primary if nonHA) will be selected to perform the execution. Backup call will be rejected if there is an ongoing backup or update operation. Be aware that during preview, if the cluster's internal software version is too old, critical update will be performed before actual backup. Once the internal software version is updated to the minimum version required by the backup feature, subsequent backups will not require critical update. After preview, there will be no critical update needed for backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        backup(params: Params$Resource$Projects$Locations$Clusters$Backup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        backup(params?: Params$Resource$Projects$Locations$Clusters$Backup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        backup(params: Params$Resource$Projects$Locations$Clusters$Backup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        backup(params: Params$Resource$Projects$Locations$Clusters$Backup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        backup(params: Params$Resource$Projects$Locations$Clusters$Backup, callback: BodyResponseCallback<Schema$Operation>): void;
        backup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a Redis cluster based on the specified properties. The creation is executed asynchronously and callers may check the returned operation to track its progress. Once the operation is completed the Redis cluster will be fully functional. The completed longrunning.Operation will contain the new cluster object in the response field. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
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
         * Deletes a specific Redis cluster. Cluster stops serving and data is deleted.
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
         * Gets the details of a specific Redis cluster.
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
         * Gets the details of certificate authority information for Redis cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCertificateAuthority(params: Params$Resource$Projects$Locations$Clusters$Getcertificateauthority, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCertificateAuthority(params?: Params$Resource$Projects$Locations$Clusters$Getcertificateauthority, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CertificateAuthority>>;
        getCertificateAuthority(params: Params$Resource$Projects$Locations$Clusters$Getcertificateauthority, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCertificateAuthority(params: Params$Resource$Projects$Locations$Clusters$Getcertificateauthority, options: MethodOptions | BodyResponseCallback<Schema$CertificateAuthority>, callback: BodyResponseCallback<Schema$CertificateAuthority>): void;
        getCertificateAuthority(params: Params$Resource$Projects$Locations$Clusters$Getcertificateauthority, callback: BodyResponseCallback<Schema$CertificateAuthority>): void;
        getCertificateAuthority(callback: BodyResponseCallback<Schema$CertificateAuthority>): void;
        /**
         * Lists all Redis clusters owned by a project in either the specified location (region) or all locations. The location should have the following format: * `projects/{project_id\}/locations/{location_id\}` If `location_id` is specified as `-` (wildcard), then all regions available to the project are queried, and the results are aggregated.
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
         * Updates the metadata and configuration of a specific Redis cluster. Completed longrunning.Operation will contain the new cluster object in the response field. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Clusters$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Clusters$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Clusters$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Clusters$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Clusters$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Reschedules upcoming maintenance event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rescheduleClusterMaintenance(params: Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rescheduleClusterMaintenance(params?: Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rescheduleClusterMaintenance(params: Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rescheduleClusterMaintenance(params: Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleClusterMaintenance(params: Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleClusterMaintenance(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Backup extends StandardParameters {
        /**
         * Required. Redis cluster resource name using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupClusterRequest;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Create extends StandardParameters {
        /**
         * Required. The logical name of the Redis cluster in the customer project with the following restrictions: * Must contain only lowercase letters, numbers, and hyphens. * Must start with a letter. * Must be between 1-63 characters. * Must end with a number or a letter. * Must be unique within the customer project / location
         */
        clusterId?: string;
        /**
         * Required. The resource name of the cluster location using the form: `projects/{project_id\}/locations/{location_id\}` where `location_id` refers to a Google Cloud region.
         */
        parent?: string;
        /**
         * Optional. Idempotent request UUID.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Cluster;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Delete extends StandardParameters {
        /**
         * Required. Redis cluster resource name using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
        /**
         * Optional. Idempotent request UUID.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Get extends StandardParameters {
        /**
         * Required. Redis cluster resource name using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Getcertificateauthority extends StandardParameters {
        /**
         * Required. Redis cluster certificate authority resource name using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}/certificateAuthority` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$List extends StandardParameters {
        /**
         * The maximum number of items to return. If not specified, a default value of 1000 will be used by the service. Regardless of the page_size value, the response may include a partial list and a caller should only rely on response's `next_page_token` to determine if there are more clusters left to be queried.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous ListClusters request, if any.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the cluster location using the form: `projects/{project_id\}/locations/{location_id\}` where `location_id` refers to a Google Cloud region.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Patch extends StandardParameters {
        /**
         * Required. Identifier. Unique name of the resource in this scope including project and location using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}`
         */
        name?: string;
        /**
         * Optional. Idempotent request UUID.
         */
        requestId?: string;
        /**
         * Required. Mask of fields to update. At least one path must be supplied in this field. The elements of the repeated paths field may only include these fields from Cluster: * `size_gb` * `replica_count` * `cluster_endpoints`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Cluster;
    }
    export interface Params$Resource$Projects$Locations$Clusters$Rescheduleclustermaintenance extends StandardParameters {
        /**
         * Required. Redis Cluster instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/clusters/{cluster_id\}` where `location_id` refers to a Google Cloud region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RescheduleClusterMaintenanceRequest;
    }
    export class Resource$Projects$Locations$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Redis instance based on the specified tier and memory size. By default, the instance is accessible from the project's [default network](https://cloud.google.com/vpc/docs/vpc). The creation is executed asynchronously and callers may check the returned operation to track its progress. Once the operation is completed the Redis instance will be fully functional. Completed longrunning.Operation will contain the new instance object in the response field. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
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
         * Deletes a specific Redis instance. Instance stops serving and data is deleted.
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
         * Export Redis instance data into a Redis RDB format file in Cloud Storage. Redis will continue serving during this operation. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Instances$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Instances$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Projects$Locations$Instances$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Instances$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Projects$Locations$Instances$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Initiates a failover of the primary node to current replica node for a specific STANDARD tier Cloud Memorystore for Redis instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        failover(params: Params$Resource$Projects$Locations$Instances$Failover, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        failover(params?: Params$Resource$Projects$Locations$Instances$Failover, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        failover(params: Params$Resource$Projects$Locations$Instances$Failover, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        failover(params: Params$Resource$Projects$Locations$Instances$Failover, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(params: Params$Resource$Projects$Locations$Instances$Failover, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the details of a specific Redis instance.
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
         * Gets the AUTH string for a Redis instance. If AUTH is not enabled for the instance the response will be empty. This information is not included in the details returned to GetInstance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getAuthString(params: Params$Resource$Projects$Locations$Instances$Getauthstring, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAuthString(params?: Params$Resource$Projects$Locations$Instances$Getauthstring, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstanceAuthString>>;
        getAuthString(params: Params$Resource$Projects$Locations$Instances$Getauthstring, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAuthString(params: Params$Resource$Projects$Locations$Instances$Getauthstring, options: MethodOptions | BodyResponseCallback<Schema$InstanceAuthString>, callback: BodyResponseCallback<Schema$InstanceAuthString>): void;
        getAuthString(params: Params$Resource$Projects$Locations$Instances$Getauthstring, callback: BodyResponseCallback<Schema$InstanceAuthString>): void;
        getAuthString(callback: BodyResponseCallback<Schema$InstanceAuthString>): void;
        /**
         * Import a Redis RDB snapshot file from Cloud Storage into a Redis instance. Redis may stop serving during this operation. Instance state will be IMPORTING for entire operation. When complete, the instance will contain only data from the imported file. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Instances$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Instances$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Instances$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Instances$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Instances$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all Redis instances owned by a project in either the specified location (region) or all locations. The location should have the following format: * `projects/{project_id\}/locations/{location_id\}` If `location_id` is specified as `-` (wildcard), then all regions available to the project are queried, and the results are aggregated.
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
         * Updates the metadata and configuration of a specific Redis instance. Completed longrunning.Operation will contain the new instance object in the response field. The returned operation is automatically deleted after a few hours, so there is no need to call DeleteOperation.
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
         * Reschedule maintenance for a given instance in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rescheduleMaintenance(params: Params$Resource$Projects$Locations$Instances$Reschedulemaintenance, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rescheduleMaintenance(params?: Params$Resource$Projects$Locations$Instances$Reschedulemaintenance, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rescheduleMaintenance(params: Params$Resource$Projects$Locations$Instances$Reschedulemaintenance, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Locations$Instances$Reschedulemaintenance, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Locations$Instances$Reschedulemaintenance, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Upgrades Redis instance to the newer Redis version specified in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        upgrade(params: Params$Resource$Projects$Locations$Instances$Upgrade, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upgrade(params?: Params$Resource$Projects$Locations$Instances$Upgrade, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        upgrade(params: Params$Resource$Projects$Locations$Instances$Upgrade, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upgrade(params: Params$Resource$Projects$Locations$Instances$Upgrade, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        upgrade(params: Params$Resource$Projects$Locations$Instances$Upgrade, callback: BodyResponseCallback<Schema$Operation>): void;
        upgrade(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Instances$Create extends StandardParameters {
        /**
         * Required. The logical name of the Redis instance in the customer project with the following restrictions: * Must contain only lowercase letters, numbers, and hyphens. * Must start with a letter. * Must be between 1-40 characters. * Must end with a number or a letter. * Must be unique within the customer project / location
         */
        instanceId?: string;
        /**
         * Required. The resource name of the instance location using the form: `projects/{project_id\}/locations/{location_id\}` where `location_id` refers to a GCP region.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Delete extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Export extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Failover extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FailoverInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Get extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Getauthstring extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Import extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$List extends StandardParameters {
        /**
         * The maximum number of items to return. If not specified, a default value of 1000 will be used by the service. Regardless of the page_size value, the response may include a partial list and a caller should only rely on response's `next_page_token` to determine if there are more instances left to be queried.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous ListInstances request, if any.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the instance location using the form: `projects/{project_id\}/locations/{location_id\}` where `location_id` refers to a GCP region.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Patch extends StandardParameters {
        /**
         * Required. Unique name of the resource in this scope including project and location using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` Note: Redis instances are managed and addressed at regional level so location_id here refers to a GCP region; however, users may choose which specific zone (or collection of zones for cross-zone instances) an instance should be provisioned in. Refer to location_id and alternative_location_id fields for more details.
         */
        name?: string;
        /**
         * Required. Mask of fields to update. At least one path must be supplied in this field. The elements of the repeated paths field may only include these fields from Instance: * `displayName` * `labels` * `memorySizeGb` * `redisConfig` * `replica_count`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Reschedulemaintenance extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RescheduleMaintenanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Upgrade extends StandardParameters {
        /**
         * Required. Redis instance resource name using the form: `projects/{project_id\}/locations/{location_id\}/instances/{instance_id\}` where `location_id` refers to a GCP region.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpgradeInstanceRequest;
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
    export {};
}
