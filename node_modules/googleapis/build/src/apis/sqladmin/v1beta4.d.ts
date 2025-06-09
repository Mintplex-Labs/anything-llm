import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace sqladmin_v1beta4 {
    export interface Options extends GlobalOptions {
        version: 'v1beta4';
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
     * Cloud SQL Admin API
     *
     * API for Cloud SQL database instance management
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const sqladmin = google.sqladmin('v1beta4');
     * ```
     */
    export class Sqladmin {
        context: APIRequestContext;
        backupRuns: Resource$Backupruns;
        backups: Resource$Backups;
        connect: Resource$Connect;
        databases: Resource$Databases;
        flags: Resource$Flags;
        instances: Resource$Instances;
        operations: Resource$Operations;
        projects: Resource$Projects;
        sslCerts: Resource$Sslcerts;
        tiers: Resource$Tiers;
        users: Resource$Users;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An entry for an Access Control list.
     */
    export interface Schema$AclEntry {
        /**
         * The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        expirationTime?: string | null;
        /**
         * This is always `sql#aclEntry`.
         */
        kind?: string | null;
        /**
         * Optional. A label to identify this entry.
         */
        name?: string | null;
        /**
         * The allowlisted value for the access control list.
         */
        value?: string | null;
    }
    /**
     * Acquire SSRS lease context.
     */
    export interface Schema$AcquireSsrsLeaseContext {
        /**
         * Lease duration needed for the SSRS setup.
         */
        duration?: string | null;
        /**
         * The report database to be used for the SSRS setup.
         */
        reportDatabase?: string | null;
        /**
         * The username to be used as the service login to connect to the report database for SSRS setup.
         */
        serviceLogin?: string | null;
        /**
         * The username to be used as the setup login to connect to the database server for SSRS setup.
         */
        setupLogin?: string | null;
    }
    /**
     * Specifies options for controlling advanced machine features.
     */
    export interface Schema$AdvancedMachineFeatures {
        /**
         * The number of threads per physical core.
         */
        threadsPerCore?: number | null;
    }
    /**
     * An Admin API warning message.
     */
    export interface Schema$ApiWarning {
        /**
         * Code to uniquely identify the warning type.
         */
        code?: string | null;
        /**
         * The warning message.
         */
        message?: string | null;
        /**
         * The region name for REGION_UNREACHABLE warning.
         */
        region?: string | null;
    }
    /**
     * An available database version. It can be a major or a minor version.
     */
    export interface Schema$AvailableDatabaseVersion {
        /**
         * The database version's display name.
         */
        displayName?: string | null;
        /**
         * The version's major version name.
         */
        majorVersion?: string | null;
        /**
         * The database version name. For MySQL 8.0, this string provides the database major and minor version.
         */
        name?: string | null;
    }
    /**
     * A backup resource. Next ID: 30
     */
    export interface Schema$Backup {
        /**
         * Output only. This output contains the following values: start_time: All database writes up to this time are available. end_time: Any database writes after this time aren't available.
         */
        backupInterval?: Schema$Interval;
        /**
         * Output only. Specifies the kind of backup, PHYSICAL or DEFAULT_SNAPSHOT.
         */
        backupKind?: string | null;
        /**
         * Output only. The mapping to backup run resource used for IAM validations.
         */
        backupRun?: string | null;
        /**
         * Output only. The database version of the instance of at the time this backup was made.
         */
        databaseVersion?: string | null;
        /**
         * The description of this backup.
         */
        description?: string | null;
        /**
         * Output only. Information about why the backup operation fails (for example, when the backup state fails).
         */
        error?: Schema$OperationError;
        /**
         * Backup expiration time. A UTC timestamp of when this resource expired.
         */
        expiryTime?: string | null;
        /**
         * The name of the database instance.
         */
        instance?: string | null;
        /**
         * Optional. Output only. Timestamp in UTC of when the instance associated with this backup is deleted.
         */
        instanceDeletionTime?: string | null;
        /**
         * Optional. Output only. Instance setting of the source instance that's associated with this backup.
         */
        instanceSettings?: Schema$DatabaseInstance;
        /**
         * Output only. This is always `sql#backup`.
         */
        kind?: string | null;
        /**
         * Output only. This output contains the encryption configuration for a backup and the resource name of the KMS key for disk encryption.
         */
        kmsKey?: string | null;
        /**
         * Output only. This output contains the encryption status for a backup and the version of the KMS key that's used to encrypt the Cloud SQL instance.
         */
        kmsKeyVersion?: string | null;
        /**
         * The storage location of the backups. The location can be multi-regional.
         */
        location?: string | null;
        /**
         * Output only. The maximum chargeable bytes for the backup.
         */
        maxChargeableBytes?: string | null;
        /**
         * Output only. The resource name of the backup. Format: projects/{project\}/backups/{backup\}.
         */
        name?: string | null;
        /**
         * Output only. This status indicates whether the backup satisfies PZI. The status is reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. This status indicates whether the backup satisfies PZS. The status is reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Output only. The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * Output only. The state of this backup.
         */
        state?: string | null;
        /**
         * Output only. This output contains a backup time zone. If a Cloud SQL for SQL Server instance has a different time zone from the backup's time zone, then the restore to the instance doesn't happen.
         */
        timeZone?: string | null;
        /**
         * Input only. The time-to-live (TTL) interval for this resource (in days). For example: ttlDays:7, means 7 days from the current time. The expiration time can't exceed 365 days from the time that the backup is created.
         */
        ttlDays?: string | null;
        /**
         * Output only. The type of this backup. The type can be "AUTOMATED", "ON_DEMAND", or “FINAL”.
         */
        type?: string | null;
    }
    /**
     * Database instance backup configuration.
     */
    export interface Schema$BackupConfiguration {
        /**
         * Backup retention settings.
         */
        backupRetentionSettings?: Schema$BackupRetentionSettings;
        /**
         * Output only. Backup tier that manages the backups for the instance.
         */
        backupTier?: string | null;
        /**
         * (MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.
         */
        binaryLogEnabled?: boolean | null;
        /**
         * Whether this configuration is enabled.
         */
        enabled?: boolean | null;
        /**
         * This is always `sql#backupConfiguration`.
         */
        kind?: string | null;
        /**
         * Location of the backup
         */
        location?: string | null;
        /**
         * Whether point in time recovery is enabled.
         */
        pointInTimeRecoveryEnabled?: boolean | null;
        /**
         * Reserved for future use.
         */
        replicationLogArchivingEnabled?: boolean | null;
        /**
         * Start time for the daily backup configuration in UTC timezone in the 24 hour format - `HH:MM`.
         */
        startTime?: string | null;
        /**
         * Output only. This value contains the storage location of transactional logs for the database for point-in-time recovery.
         */
        transactionalLogStorageState?: string | null;
        /**
         * The number of days of transaction logs we retain for point in time restore, from 1-7.
         */
        transactionLogRetentionDays?: number | null;
    }
    /**
     * Backup context.
     */
    export interface Schema$BackupContext {
        /**
         * The identifier of the backup.
         */
        backupId?: string | null;
        /**
         * This is always `sql#backupContext`.
         */
        kind?: string | null;
        /**
         * The name of the backup. Format: projects/{project\}/backups/{backup\}
         */
        name?: string | null;
    }
    /**
     * Backup Reencryption Config
     */
    export interface Schema$BackupReencryptionConfig {
        /**
         * Backup re-encryption limit
         */
        backupLimit?: number | null;
        /**
         * Type of backups users want to re-encrypt.
         */
        backupType?: string | null;
    }
    /**
     * We currently only support backup retention by specifying the number of backups we will retain.
     */
    export interface Schema$BackupRetentionSettings {
        /**
         * Depending on the value of retention_unit, this is used to determine if a backup needs to be deleted. If retention_unit is 'COUNT', we will retain this many backups.
         */
        retainedBackups?: number | null;
        /**
         * The unit that 'retained_backups' represents.
         */
        retentionUnit?: string | null;
    }
    /**
     * A BackupRun resource.
     */
    export interface Schema$BackupRun {
        /**
         * Specifies the kind of backup, PHYSICAL or DEFAULT_SNAPSHOT.
         */
        backupKind?: string | null;
        /**
         * Output only. The instance database version at the time this backup was made.
         */
        databaseVersion?: string | null;
        /**
         * The description of this run, only applicable to on-demand backups.
         */
        description?: string | null;
        /**
         * Encryption configuration specific to a backup.
         */
        diskEncryptionConfiguration?: Schema$DiskEncryptionConfiguration;
        /**
         * Encryption status specific to a backup.
         */
        diskEncryptionStatus?: Schema$DiskEncryptionStatus;
        /**
         * The time the backup operation completed in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        endTime?: string | null;
        /**
         * The time the run was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        enqueuedTime?: string | null;
        /**
         * Information about why the backup operation failed. This is only present if the run has the FAILED status.
         */
        error?: Schema$OperationError;
        /**
         * The identifier for this backup run. Unique only for a specific Cloud SQL instance.
         */
        id?: string | null;
        /**
         * Name of the database instance.
         */
        instance?: string | null;
        /**
         * This is always `sql#backupRun`.
         */
        kind?: string | null;
        /**
         * Location of the backups.
         */
        location?: string | null;
        /**
         * Output only. The maximum chargeable bytes for the backup.
         */
        maxChargeableBytes?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * The time the backup operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        startTime?: string | null;
        /**
         * The status of this run.
         */
        status?: string | null;
        /**
         * Backup time zone to prevent restores to an instance with a different time zone. Now relevant only for SQL Server.
         */
        timeZone?: string | null;
        /**
         * The type of this run; can be either "AUTOMATED" or "ON_DEMAND" or "FINAL". This field defaults to "ON_DEMAND" and is ignored, when specified for insert requests.
         */
        type?: string | null;
        /**
         * The start time of the backup window during which this the backup was attempted in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        windowStartTime?: string | null;
    }
    /**
     * Backup run list results.
     */
    export interface Schema$BackupRunsListResponse {
        /**
         * A list of backup runs in reverse chronological order of the enqueued time.
         */
        items?: Schema$BackupRun[];
        /**
         * This is always `sql#backupRunsList`.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Binary log coordinates.
     */
    export interface Schema$BinLogCoordinates {
        /**
         * Name of the binary log file for a Cloud SQL instance.
         */
        binLogFileName?: string | null;
        /**
         * Position (offset) within the binary log file.
         */
        binLogPosition?: string | null;
        /**
         * This is always `sql#binLogCoordinates`.
         */
        kind?: string | null;
    }
    /**
     * Database instance clone context.
     */
    export interface Schema$CloneContext {
        /**
         * The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the cloned instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])?. Reserved for future use.
         */
        allocatedIpRange?: string | null;
        /**
         * Binary log coordinates, if specified, identify the position up to which the source instance is cloned. If not specified, the source instance is cloned up to the most recent binary log coordinates.
         */
        binLogCoordinates?: Schema$BinLogCoordinates;
        /**
         * (SQL Server only) Clone only the specified databases from the source instance. Clone all databases if empty.
         */
        databaseNames?: string[] | null;
        /**
         * Name of the Cloud SQL instance to be created as a clone.
         */
        destinationInstanceName?: string | null;
        /**
         * This is always `sql#cloneContext`.
         */
        kind?: string | null;
        /**
         * Reserved for future use.
         */
        pitrTimestampMs?: string | null;
        /**
         * Timestamp, if specified, identifies the time to which the source instance is cloned.
         */
        pointInTime?: string | null;
        /**
         * Optional. Copy clone and point-in-time recovery clone of a regional instance in the specified zones. If not specified, clone to the same secondary zone as the source instance. This value cannot be the same as the preferred_zone field.
         */
        preferredSecondaryZone?: string | null;
        /**
         * Optional. Copy clone and point-in-time recovery clone of an instance to the specified zone. If no zone is specified, clone to the same primary zone as the source instance.
         */
        preferredZone?: string | null;
    }
    /**
     * The managed connection pooling configuration.
     */
    export interface Schema$ConnectionPoolConfig {
        /**
         * Whether managed connection pooling is enabled.
         */
        connectionPoolingEnabled?: boolean | null;
        /**
         * Optional. List of connection pool configuration flags
         */
        flags?: Schema$ConnectionPoolFlags[];
    }
    /**
     * Connection pool flags for Cloud SQL instances managed connection pool configuration.
     */
    export interface Schema$ConnectionPoolFlags {
        /**
         * Required. The name of the flag.
         */
        name?: string | null;
        /**
         * Required. The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.
         */
        value?: string | null;
    }
    /**
     * Details of a single read pool node of a read pool.
     */
    export interface Schema$ConnectPoolNodeConfig {
        /**
         * Output only. The DNS name of the read pool node.
         */
        dnsName?: string | null;
        /**
         * Output only. The list of DNS names used by this read pool node.
         */
        dnsNames?: Schema$DnsNameMapping[];
        /**
         * Output only. Mappings containing IP addresses that can be used to connect to the read pool node.
         */
        ipAddresses?: Schema$IpMapping[];
        /**
         * Output only. The name of the read pool node. Doesn't include the project ID.
         */
        name?: string | null;
    }
    /**
     * Connect settings retrieval response.
     */
    export interface Schema$ConnectSettings {
        /**
         * `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.
         */
        backendType?: string | null;
        /**
         * Custom subject alternative names for the server certificate.
         */
        customSubjectAlternativeNames?: string[] | null;
        /**
         * The database engine type and version. The `databaseVersion` field cannot be changed after instance creation. MySQL instances: `MYSQL_8_0`, `MYSQL_5_7` (default), or `MYSQL_5_6`. PostgreSQL instances: `POSTGRES_9_6`, `POSTGRES_10`, `POSTGRES_11` or `POSTGRES_12` (default), `POSTGRES_13`, or `POSTGRES_14`. SQL Server instances: `SQLSERVER_2017_STANDARD` (default), `SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`, `SQLSERVER_2019_STANDARD`, `SQLSERVER_2019_ENTERPRISE`, `SQLSERVER_2019_EXPRESS`, or `SQLSERVER_2019_WEB`.
         */
        databaseVersion?: string | null;
        /**
         * The dns name of the instance.
         */
        dnsName?: string | null;
        /**
         * Output only. The list of DNS names used by this instance.
         */
        dnsNames?: Schema$DnsNameMapping[];
        /**
         * The assigned IP addresses for the instance.
         */
        ipAddresses?: Schema$IpMapping[];
        /**
         * This is always `sql#connectSettings`.
         */
        kind?: string | null;
        /**
         * The number of read pool nodes in a read pool.
         */
        nodeCount?: number | null;
        /**
         * Output only. Entries containing information about each read pool node of the read pool.
         */
        nodes?: Schema$ConnectPoolNodeConfig[];
        /**
         * Whether PSC connectivity is enabled for this instance.
         */
        pscEnabled?: boolean | null;
        /**
         * The cloud region for the instance. e.g. `us-central1`, `europe-west1`. The region cannot be changed after instance creation.
         */
        region?: string | null;
        /**
         * SSL configuration.
         */
        serverCaCert?: Schema$SslCert;
        /**
         * Specify what type of CA is used for the server certificate.
         */
        serverCaMode?: string | null;
    }
    /**
     * Represents a SQL database on the Cloud SQL instance.
     */
    export interface Schema$Database {
        /**
         * The Cloud SQL charset value.
         */
        charset?: string | null;
        /**
         * The Cloud SQL collation value.
         */
        collation?: string | null;
        /**
         * This field is deprecated and will be removed from a future version of the API.
         */
        etag?: string | null;
        /**
         * The name of the Cloud SQL instance. This does not include the project ID.
         */
        instance?: string | null;
        /**
         * This is always `sql#database`.
         */
        kind?: string | null;
        /**
         * The name of the database in the Cloud SQL instance. This does not include the project ID or instance name.
         */
        name?: string | null;
        /**
         * The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable.
         */
        project?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        sqlserverDatabaseDetails?: Schema$SqlServerDatabaseDetails;
    }
    /**
     * Database flags for Cloud SQL instances.
     */
    export interface Schema$DatabaseFlags {
        /**
         * The name of the flag. These flags are passed at instance startup, so include both server options and system variables. Flags are specified with underscores, not hyphens. For more information, see [Configuring Database Flags](https://cloud.google.com/sql/docs/mysql/flags) in the Cloud SQL documentation.
         */
        name?: string | null;
        /**
         * The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.
         */
        value?: string | null;
    }
    /**
     * A Cloud SQL instance resource.
     */
    export interface Schema$DatabaseInstance {
        /**
         * Output only. List all maintenance versions applicable on the instance
         */
        availableMaintenanceVersions?: string[] | null;
        /**
         * The backend type. `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.
         */
        backendType?: string | null;
        /**
         * Connection name of the Cloud SQL instance used in connection strings.
         */
        connectionName?: string | null;
        /**
         * Output only. The time when the instance was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        createTime?: string | null;
        /**
         * The current disk usage of the instance in bytes. This property has been deprecated. Use the "cloudsql.googleapis.com/database/disk/bytes_used" metric in Cloud Monitoring API instead. Please see [this announcement](https://groups.google.com/d/msg/google-cloud-sql-announce/I_7-F9EBhT0/BtvFtdFeAgAJ) for details.
         */
        currentDiskSize?: string | null;
        /**
         * Output only. Stores the current database version running on the instance including minor version such as `MYSQL_8_0_18`.
         */
        databaseInstalledVersion?: string | null;
        /**
         * The database engine type and version. The `databaseVersion` field cannot be changed after instance creation.
         */
        databaseVersion?: string | null;
        /**
         * Disk encryption configuration specific to an instance.
         */
        diskEncryptionConfiguration?: Schema$DiskEncryptionConfiguration;
        /**
         * Disk encryption status specific to an instance.
         */
        diskEncryptionStatus?: Schema$DiskEncryptionStatus;
        /**
         * Output only. The dns name of the instance.
         */
        dnsName?: string | null;
        /**
         * Output only. The list of DNS names used by this instance.
         */
        dnsNames?: Schema$DnsNameMapping[];
        /**
         * This field is deprecated and will be removed from a future version of the API. Use the `settings.settingsVersion` field instead.
         */
        etag?: string | null;
        /**
         * The name and status of the failover replica.
         */
        failoverReplica?: {
            available?: boolean;
            name?: string;
        } | null;
        /**
         * The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone. WARNING: Changing this might restart the instance.
         */
        gceZone?: string | null;
        /**
         * Gemini instance configuration.
         */
        geminiConfig?: Schema$GeminiInstanceConfig;
        /**
         * Input only. Determines whether an in-place major version upgrade of replicas happens when an in-place major version upgrade of a primary instance is initiated.
         */
        includeReplicasForMajorVersionUpgrade?: boolean | null;
        /**
         * The instance type.
         */
        instanceType?: string | null;
        /**
         * The assigned IP addresses for the instance.
         */
        ipAddresses?: Schema$IpMapping[];
        /**
         * The IPv6 address assigned to the instance. (Deprecated) This property was applicable only to First Generation instances.
         */
        ipv6Address?: string | null;
        /**
         * This is always `sql#instance`.
         */
        kind?: string | null;
        /**
         * The current software version on the instance.
         */
        maintenanceVersion?: string | null;
        /**
         * The name of the instance which will act as primary in the replication setup.
         */
        masterInstanceName?: string | null;
        /**
         * The maximum disk size of the instance in bytes.
         */
        maxDiskSize?: string | null;
        /**
         * Name of the Cloud SQL instance. This does not include the project ID.
         */
        name?: string | null;
        /**
         * The number of read pool nodes in a read pool.
         */
        nodeCount?: number | null;
        /**
         * Output only. Entries containing information about each read pool node of the read pool.
         */
        nodes?: Schema$PoolNodeConfig[];
        /**
         * Configuration specific to on-premises instances.
         */
        onPremisesConfiguration?: Schema$OnPremisesConfiguration;
        /**
         * This field represents the report generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job
         */
        outOfDiskReport?: Schema$SqlOutOfDiskReport;
        /**
         * Output only. DEPRECATED: please use write_endpoint instead.
         */
        primaryDnsName?: string | null;
        /**
         * The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.
         */
        project?: string | null;
        /**
         * Output only. The link to service attachment of PSC instance.
         */
        pscServiceAttachmentLink?: string | null;
        /**
         * The geographical region of the Cloud SQL instance. It can be one of the [regions](https://cloud.google.com/sql/docs/mysql/locations#location-r) where Cloud SQL operates: For example, `asia-east1`, `europe-west1`, and `us-central1`. The default value is `us-central1`.
         */
        region?: string | null;
        /**
         * Configuration specific to failover replicas and read replicas.
         */
        replicaConfiguration?: Schema$ReplicaConfiguration;
        /**
         * The replicas of the instance.
         */
        replicaNames?: string[] | null;
        /**
         * A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance experiences regional failure. Applicable to MySQL and PostgreSQL.
         */
        replicationCluster?: Schema$ReplicationCluster;
        /**
         * Initial root password. Use only on creation. You must set root passwords before you can connect to PostgreSQL instances.
         */
        rootPassword?: string | null;
        /**
         * Output only. This status indicates whether the instance satisfies PZI. The status is reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * This status indicates whether the instance satisfies PZS. The status is reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * The start time of any upcoming scheduled maintenance for this instance.
         */
        scheduledMaintenance?: Schema$SqlScheduledMaintenance;
        /**
         * The Compute Engine zone that the failover instance is currently serving from for a regional instance. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary/failover zone.
         */
        secondaryGceZone?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * SSL configuration.
         */
        serverCaCert?: Schema$SslCert;
        /**
         * The service account email address assigned to the instance. \This property is read-only.
         */
        serviceAccountEmailAddress?: string | null;
        /**
         * The user settings.
         */
        settings?: Schema$Settings;
        /**
         * The SQL network architecture for the instance.
         */
        sqlNetworkArchitecture?: string | null;
        /**
         * The current serving state of the Cloud SQL instance.
         */
        state?: string | null;
        /**
         * If the instance state is SUSPENDED, the reason for the suspension.
         */
        suspensionReason?: string[] | null;
        /**
         * Input only. Whether Cloud SQL is enabled to switch storing point-in-time recovery log files from a data disk to Cloud Storage.
         */
        switchTransactionLogsToCloudStorageEnabled?: boolean | null;
        /**
         * Optional. Input only. Immutable. Tag keys and tag values that are bound to this instance. You must represent each item in the map as: `"" : ""`. For example, a single resource can have the following tags: ``` "123/environment": "production", "123/costCenter": "marketing", ``` For more information on tag creation and management, see https://cloud.google.com/resource-manager/docs/tags/tags-overview.
         */
        tags?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. All database versions that are available for upgrade.
         */
        upgradableDatabaseVersions?: Schema$AvailableDatabaseVersion[];
        /**
         * Output only. The dns name of the primary instance in a replication group.
         */
        writeEndpoint?: string | null;
    }
    /**
     * Database list response.
     */
    export interface Schema$DatabasesListResponse {
        /**
         * List of database resources in the instance.
         */
        items?: Schema$Database[];
        /**
         * This is always `sql#databasesList`.
         */
        kind?: string | null;
    }
    /**
     * Data cache configurations.
     */
    export interface Schema$DataCacheConfig {
        /**
         * Whether data cache is enabled for the instance.
         */
        dataCacheEnabled?: boolean | null;
    }
    /**
     * This context is used to demote an existing standalone instance to be a Cloud SQL read replica for an external database server.
     */
    export interface Schema$DemoteContext {
        /**
         * This is always `sql#demoteContext`.
         */
        kind?: string | null;
        /**
         * Required. The name of the instance which acts as an on-premises primary instance in the replication setup.
         */
        sourceRepresentativeInstanceName?: string | null;
    }
    /**
     * Read-replica configuration for connecting to the on-premises primary instance.
     */
    export interface Schema$DemoteMasterConfiguration {
        /**
         * This is always `sql#demoteMasterConfiguration`.
         */
        kind?: string | null;
        /**
         * MySQL specific configuration when replicating from a MySQL on-premises primary instance. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named `master.info` in the data directory.
         */
        mysqlReplicaConfiguration?: Schema$DemoteMasterMySqlReplicaConfiguration;
    }
    /**
     * Database instance demote primary instance context.
     */
    export interface Schema$DemoteMasterContext {
        /**
         * This is always `sql#demoteMasterContext`.
         */
        kind?: string | null;
        /**
         * The name of the instance which will act as on-premises primary instance in the replication setup.
         */
        masterInstanceName?: string | null;
        /**
         * Configuration specific to read-replicas replicating from the on-premises primary instance.
         */
        replicaConfiguration?: Schema$DemoteMasterConfiguration;
        /**
         * Flag to skip replication setup on the instance.
         */
        skipReplicationSetup?: boolean | null;
        /**
         * Verify the GTID consistency for demote operation. Default value: `True`. Setting this flag to `false` enables you to bypass the GTID consistency check between on-premises primary instance and Cloud SQL instance during the demotion operation but also exposes you to the risk of future replication failures. Change the value only if you know the reason for the GTID divergence and are confident that doing so will not cause any replication issues.
         */
        verifyGtidConsistency?: boolean | null;
    }
    /**
     * Read-replica configuration specific to MySQL databases.
     */
    export interface Schema$DemoteMasterMySqlReplicaConfiguration {
        /**
         * PEM representation of the trusted CA's x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica's x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate. The format of the replica's private key can be either PKCS #1 or PKCS #8.
         */
        clientKey?: string | null;
        /**
         * This is always `sql#demoteMasterMysqlReplicaConfiguration`.
         */
        kind?: string | null;
        /**
         * The password for the replication connection.
         */
        password?: string | null;
        /**
         * The username for the replication connection.
         */
        username?: string | null;
    }
    /**
     * Deny Maintenance Periods. This specifies a date range during when all CSA rollout will be denied.
     */
    export interface Schema$DenyMaintenancePeriod {
        /**
         * "deny maintenance period" end date. If the year of the end date is empty, the year of the start date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01
         */
        endDate?: string | null;
        /**
         * "deny maintenance period" start date. If the year of the start date is empty, the year of the end date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01
         */
        startDate?: string | null;
        /**
         * Time in UTC when the "deny maintenance period" starts on start_date and ends on end_date. The time is in format: HH:mm:SS, i.e., 00:00:00
         */
        time?: string | null;
    }
    /**
     * Disk encryption configuration for an instance.
     */
    export interface Schema$DiskEncryptionConfiguration {
        /**
         * This is always `sql#diskEncryptionConfiguration`.
         */
        kind?: string | null;
        /**
         * Resource name of KMS key for disk encryption
         */
        kmsKeyName?: string | null;
    }
    /**
     * Disk encryption status for an instance.
     */
    export interface Schema$DiskEncryptionStatus {
        /**
         * This is always `sql#diskEncryptionStatus`.
         */
        kind?: string | null;
        /**
         * KMS key version used to encrypt the Cloud SQL instance resource
         */
        kmsKeyVersionName?: string | null;
    }
    /**
     * DNS metadata.
     */
    export interface Schema$DnsNameMapping {
        /**
         * Output only. The connection type of the DNS name.
         */
        connectionType?: string | null;
        /**
         * Output only. The scope that the DNS name applies to.
         */
        dnsScope?: string | null;
        /**
         * The DNS name.
         */
        name?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Database instance export context.
     */
    export interface Schema$ExportContext {
        /**
         * Options for exporting BAK files (SQL Server-only)
         */
        bakExportOptions?: {
            bakType?: string;
            copyOnly?: boolean;
            differentialBase?: boolean;
            exportLogEndTime?: string;
            exportLogStartTime?: string;
            stripeCount?: number;
            striped?: boolean;
        } | null;
        /**
         * Options for exporting data as CSV. `MySQL` and `PostgreSQL` instances only.
         */
        csvExportOptions?: {
            escapeCharacter?: string;
            fieldsTerminatedBy?: string;
            linesTerminatedBy?: string;
            quoteCharacter?: string;
            selectQuery?: string;
        } | null;
        /**
         * Databases to be exported. `MySQL instances:` If `fileType` is `SQL` and no database is specified, all databases are exported, except for the `mysql` system database. If `fileType` is `CSV`, you can specify one database, either by using this property or by using the `csvExportOptions.selectQuery` property, which takes precedence over this property. `PostgreSQL instances:` If you don't specify a database by name, all user databases in the instance are exported. This excludes system databases and Cloud SQL databases used to manage internal operations. Exporting all user databases is only available for directory-formatted parallel export. If `fileType` is `CSV`, this database must match the one specified in the `csvExportOptions.selectQuery` property. `SQL Server instances:` You must specify one database to be exported, and the `fileType` must be `BAK`.
         */
        databases?: string[] | null;
        /**
         * The file type for the specified uri.
         */
        fileType?: string | null;
        /**
         * This is always `sql#exportContext`.
         */
        kind?: string | null;
        /**
         * Whether to perform a serverless export.
         */
        offload?: boolean | null;
        /**
         * Options for exporting data as SQL statements.
         */
        sqlExportOptions?: {
            mysqlExportOptions?: {
                masterData?: number;
            };
            parallel?: boolean;
            postgresExportOptions?: {
                clean?: boolean;
                ifExists?: boolean;
            };
            schemaOnly?: boolean;
            tables?: string[];
            threads?: number;
        } | null;
        /**
         * Optional. Export parameters specific to SQL Server TDE certificates
         */
        tdeExportOptions?: {
            certificatePath?: string;
            name?: string;
            privateKeyPassword?: string;
            privateKeyPath?: string;
        } | null;
        /**
         * The path to the file in Google Cloud Storage where the export will be stored. The URI is in the form `gs://bucketName/fileName`. If the file already exists, the request succeeds, but the operation fails. If `fileType` is `SQL` and the filename ends with .gz, the contents are compressed.
         */
        uri?: string | null;
    }
    /**
     * The selected object that Cloud SQL migrates.
     */
    export interface Schema$ExternalSyncSelectedObject {
        /**
         * The name of the database that Cloud SQL migrates.
         */
        database?: string | null;
    }
    /**
     * Database instance failover context.
     */
    export interface Schema$FailoverContext {
        /**
         * This is always `sql#failoverContext`.
         */
        kind?: string | null;
        /**
         * The current settings version of this instance. Request will be rejected if this version doesn't match the current settings version.
         */
        settingsVersion?: string | null;
    }
    /**
     * A flag resource.
     */
    export interface Schema$Flag {
        /**
         * Use this field if only certain integers are accepted. Can be combined with min_value and max_value to add additional values.
         */
        allowedIntValues?: string[] | null;
        /**
         * For `STRING` flags, a list of strings that the value can be set to.
         */
        allowedStringValues?: string[] | null;
        /**
         * The database version this flag applies to. Can be MySQL instances: `MYSQL_8_0`, `MYSQL_8_0_18`, `MYSQL_8_0_26`, `MYSQL_5_7`, or `MYSQL_5_6`. PostgreSQL instances: `POSTGRES_9_6`, `POSTGRES_10`, `POSTGRES_11` or `POSTGRES_12`. SQL Server instances: `SQLSERVER_2017_STANDARD`, `SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`, `SQLSERVER_2019_STANDARD`, `SQLSERVER_2019_ENTERPRISE`, `SQLSERVER_2019_EXPRESS`, or `SQLSERVER_2019_WEB`. See [the complete list](/sql/docs/mysql/admin-api/rest/v1/SqlDatabaseVersion).
         */
        appliesTo?: string[] | null;
        /**
         * Scope of flag.
         */
        flagScope?: string | null;
        /**
         * Whether or not the flag is considered in beta.
         */
        inBeta?: boolean | null;
        /**
         * This is always `sql#flag`.
         */
        kind?: string | null;
        /**
         * For `INTEGER` flags, the maximum allowed value.
         */
        maxValue?: string | null;
        /**
         * For `INTEGER` flags, the minimum allowed value.
         */
        minValue?: string | null;
        /**
         * This is the name of the flag. Flag names always use underscores, not hyphens, for example: `max_allowed_packet`
         */
        name?: string | null;
        /**
         * Recommended flag value in integer format for UI display.
         */
        recommendedIntValue?: string | null;
        /**
         * Recommended flag value in string format for UI display.
         */
        recommendedStringValue?: string | null;
        /**
         * Indicates whether changing this flag will trigger a database restart. Only applicable to Second Generation instances.
         */
        requiresRestart?: boolean | null;
        /**
         * The type of the flag. Flags are typed to being `BOOLEAN`, `STRING`, `INTEGER` or `NONE`. `NONE` is used for flags which do not take a value, such as `skip_grant_tables`.
         */
        type?: string | null;
    }
    /**
     * Flags list response.
     */
    export interface Schema$FlagsListResponse {
        /**
         * List of flags.
         */
        items?: Schema$Flag[];
        /**
         * This is always `sql#flagsList`.
         */
        kind?: string | null;
    }
    /**
     * Gemini instance configuration.
     */
    export interface Schema$GeminiInstanceConfig {
        /**
         * Output only. Whether the active query is enabled.
         */
        activeQueryEnabled?: boolean | null;
        /**
         * Output only. Whether Gemini is enabled.
         */
        entitled?: boolean | null;
        /**
         * Output only. Whether the flag recommender is enabled.
         */
        flagRecommenderEnabled?: boolean | null;
        /**
         * Output only. Whether the vacuum management is enabled.
         */
        googleVacuumMgmtEnabled?: boolean | null;
        /**
         * Output only. Whether the index advisor is enabled.
         */
        indexAdvisorEnabled?: boolean | null;
        /**
         * Output only. Whether canceling the out-of-memory (OOM) session is enabled.
         */
        oomSessionCancelEnabled?: boolean | null;
    }
    /**
     * Ephemeral certificate creation request.
     */
    export interface Schema$GenerateEphemeralCertRequest {
        /**
         * Optional. Access token to include in the signed certificate.
         */
        access_token?: string | null;
        /**
         * PEM encoded public key to include in the signed certificate.
         */
        public_key?: string | null;
        /**
         * Optional. Optional snapshot read timestamp to trade freshness for performance.
         */
        readTime?: string | null;
        /**
         * Optional. If set, it will contain the cert valid duration.
         */
        validDuration?: string | null;
    }
    /**
     * Ephemeral certificate creation request.
     */
    export interface Schema$GenerateEphemeralCertResponse {
        /**
         * Generated cert
         */
        ephemeralCert?: Schema$SslCert;
    }
    /**
     * Database instance import context.
     */
    export interface Schema$ImportContext {
        /**
         * Import parameters specific to SQL Server .BAK files
         */
        bakImportOptions?: {
            bakType?: string;
            encryptionOptions?: {
                certPath?: string;
                keepEncrypted?: boolean;
                pvkPassword?: string;
                pvkPath?: string;
            };
            noRecovery?: boolean;
            recoveryOnly?: boolean;
            stopAt?: string;
            stopAtMark?: string;
            striped?: boolean;
        } | null;
        /**
         * Options for importing data as CSV.
         */
        csvImportOptions?: {
            columns?: string[];
            escapeCharacter?: string;
            fieldsTerminatedBy?: string;
            linesTerminatedBy?: string;
            quoteCharacter?: string;
            table?: string;
        } | null;
        /**
         * The target database for the import. If `fileType` is `SQL`, this field is required only if the import file does not specify a database, and is overridden by any database specification in the import file. For entire instance parallel import operations, the database is overridden by the database name stored in subdirectory name. If `fileType` is `CSV`, one database must be specified.
         */
        database?: string | null;
        /**
         * The file type for the specified uri. * `SQL`: The file contains SQL statements. * `CSV`: The file contains CSV data. * `BAK`: The file contains backup data for a SQL Server instance.
         */
        fileType?: string | null;
        /**
         * The PostgreSQL user for this import operation. PostgreSQL instances only.
         */
        importUser?: string | null;
        /**
         * This is always `sql#importContext`.
         */
        kind?: string | null;
        /**
         * Optional. Options for importing data from SQL statements.
         */
        sqlImportOptions?: {
            parallel?: boolean;
            postgresImportOptions?: {
                clean?: boolean;
                ifExists?: boolean;
            };
            threads?: number;
        } | null;
        /**
         * Optional. Import parameters specific to SQL Server .TDE files Import parameters specific to SQL Server TDE certificates
         */
        tdeImportOptions?: {
            certificatePath?: string;
            name?: string;
            privateKeyPassword?: string;
            privateKeyPath?: string;
        } | null;
        /**
         * Path to the import file in Cloud Storage, in the form `gs://bucketName/fileName`. Compressed gzip files (.gz) are supported when `fileType` is `SQL`. The instance must have write permissions to the bucket and read access to the file.
         */
        uri?: string | null;
    }
    /**
     * Insights configuration. This specifies when Cloud SQL Insights feature is enabled and optional configuration.
     */
    export interface Schema$InsightsConfig {
        /**
         * Whether Query Insights feature is enabled.
         */
        queryInsightsEnabled?: boolean | null;
        /**
         * Number of query execution plans captured by Insights per minute for all queries combined. Default is 5.
         */
        queryPlansPerMinute?: number | null;
        /**
         * Maximum query length stored in bytes. Default value: 1024 bytes. Range: 256-4500 bytes. Query length more than this field value will be truncated to this value. When unset, query length will be the default value. Changing query length will restart the database.
         */
        queryStringLength?: number | null;
        /**
         * Whether Query Insights will record application tags from query when enabled.
         */
        recordApplicationTags?: boolean | null;
        /**
         * Whether Query Insights will record client address when enabled.
         */
        recordClientAddress?: boolean | null;
    }
    /**
     * Reference to another Cloud SQL instance.
     */
    export interface Schema$InstanceReference {
        /**
         * The name of the Cloud SQL instance being referenced. This does not include the project ID.
         */
        name?: string | null;
        /**
         * The project ID of the Cloud SQL instance being referenced. The default is the same project ID as the instance references it.
         */
        project?: string | null;
        /**
         * The region of the Cloud SQL instance being referenced.
         */
        region?: string | null;
    }
    /**
     * Request to acquire an SSRS lease for an instance.
     */
    export interface Schema$InstancesAcquireSsrsLeaseRequest {
        /**
         * Contains details about the acquire SSRS lease operation.
         */
        acquireSsrsLeaseContext?: Schema$AcquireSsrsLeaseContext;
    }
    /**
     * Database instance clone request.
     */
    export interface Schema$InstancesCloneRequest {
        /**
         * Contains details about the clone operation.
         */
        cloneContext?: Schema$CloneContext;
    }
    /**
     * Database demote primary instance request.
     */
    export interface Schema$InstancesDemoteMasterRequest {
        /**
         * Contains details about the demoteMaster operation.
         */
        demoteMasterContext?: Schema$DemoteMasterContext;
    }
    /**
     * This request is used to demote an existing standalone instance to be a Cloud SQL read replica for an external database server.
     */
    export interface Schema$InstancesDemoteRequest {
        /**
         * Required. This context is used to demote an existing standalone instance to be a Cloud SQL read replica for an external database server.
         */
        demoteContext?: Schema$DemoteContext;
    }
    /**
     * Database instance export request.
     */
    export interface Schema$InstancesExportRequest {
        /**
         * Contains details about the export operation.
         */
        exportContext?: Schema$ExportContext;
    }
    /**
     * Instance failover request.
     */
    export interface Schema$InstancesFailoverRequest {
        /**
         * Failover Context.
         */
        failoverContext?: Schema$FailoverContext;
    }
    /**
     * Database instance import request.
     */
    export interface Schema$InstancesImportRequest {
        /**
         * Contains details about the import operation.
         */
        importContext?: Schema$ImportContext;
    }
    /**
     * Database instances list response.
     */
    export interface Schema$InstancesListResponse {
        /**
         * List of database instance resources.
         */
        items?: Schema$DatabaseInstance[];
        /**
         * This is always `sql#instancesList`.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * List of warnings that occurred while handling the request.
         */
        warnings?: Schema$ApiWarning[];
    }
    /**
     * Instances ListServerCas response.
     */
    export interface Schema$InstancesListServerCasResponse {
        activeVersion?: string | null;
        /**
         * List of server CA certificates for the instance.
         */
        certs?: Schema$SslCert[];
        /**
         * This is always `sql#instancesListServerCas`.
         */
        kind?: string | null;
    }
    /**
     * Instances ListServerCertificatess response.
     */
    export interface Schema$InstancesListServerCertificatesResponse {
        /**
         * The `sha1_fingerprint` of the active certificate from `server_certs`.
         */
        activeVersion?: string | null;
        /**
         * List of server CA certificates for the instance.
         */
        caCerts?: Schema$SslCert[];
        /**
         * This is always `sql#instancesListServerCertificates`.
         */
        kind?: string | null;
        /**
         * List of server certificates for the instance, signed by the corresponding CA from the `ca_certs` list.
         */
        serverCerts?: Schema$SslCert[];
    }
    /**
     * Database Instance reencrypt request.
     */
    export interface Schema$InstancesReencryptRequest {
        /**
         * Configuration specific to backup re-encryption
         */
        backupReencryptionConfig?: Schema$BackupReencryptionConfig;
    }
    /**
     * Database instance restore backup request.
     */
    export interface Schema$InstancesRestoreBackupRequest {
        /**
         * The name of the backup that's used to restore a Cloud SQL instance: Format: projects/{project-id\}/backups/{backup-uid\}. Only one of restore_backup_context, backup, backupdr_backup can be passed to the input.
         */
        backup?: string | null;
        /**
         * The name of the backup that's used to restore a Cloud SQL instance: Format: "projects/{project-id\}/locations/{location\}/backupVaults/{backupvault\}/dataSources/{datasource\}/backups/{backup-uid\}". Only one of restore_backup_context, backup, backupdr_backup can be passed to the input.
         */
        backupdrBackup?: string | null;
        /**
         * Parameters required to perform the restore backup operation.
         */
        restoreBackupContext?: Schema$RestoreBackupContext;
        /**
         * Optional. By using this parameter, Cloud SQL overrides any instance settings stored in the backup you are restoring from. You can't change the instance's major database version and you can only increase the disk size. You can use this field to restore new instances only. This field is not applicable for restore to existing instances.
         */
        restoreInstanceSettings?: Schema$DatabaseInstance;
    }
    /**
     * Rotate Server CA request.
     */
    export interface Schema$InstancesRotateServerCaRequest {
        /**
         * Contains details about the rotate server CA operation.
         */
        rotateServerCaContext?: Schema$RotateServerCaContext;
    }
    /**
     * Rotate Server Certificate request.
     */
    export interface Schema$InstancesRotateServerCertificateRequest {
        /**
         * Optional. Contains details about the rotate server CA operation.
         */
        rotateServerCertificateContext?: Schema$RotateServerCertificateContext;
    }
    /**
     * Instance truncate log request.
     */
    export interface Schema$InstancesTruncateLogRequest {
        /**
         * Contains details about the truncate log operation.
         */
        truncateLogContext?: Schema$TruncateLogContext;
    }
    /**
     * Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive). The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time.
     */
    export interface Schema$Interval {
        /**
         * Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end.
         */
        endTime?: string | null;
        /**
         * Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start.
         */
        startTime?: string | null;
    }
    /**
     * IP Management configuration.
     */
    export interface Schema$IpConfiguration {
        /**
         * The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?.`
         */
        allocatedIpRange?: string | null;
        /**
         * The list of external networks that are allowed to connect to the instance using the IP. In 'CIDR' notation, also known as 'slash' notation (for example: `157.197.200.0/24`).
         */
        authorizedNetworks?: Schema$AclEntry[];
        /**
         * Optional. Custom Subject Alternative Name(SAN)s for a Cloud SQL instance.
         */
        customSubjectAlternativeNames?: string[] | null;
        /**
         * Controls connectivity to private IP instances from Google services, such as BigQuery.
         */
        enablePrivatePathForGoogleCloudServices?: boolean | null;
        /**
         * Whether the instance is assigned a public IP address or not.
         */
        ipv4Enabled?: boolean | null;
        /**
         * The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.
         */
        privateNetwork?: string | null;
        /**
         * PSC settings for this instance.
         */
        pscConfig?: Schema$PscConfig;
        /**
         * Use `ssl_mode` instead. Whether SSL/TLS connections over IP are enforced. If set to false, then allow both non-SSL/non-TLS and SSL/TLS connections. For SSL/TLS connections, the client certificate won't be verified. If set to true, then only allow connections encrypted with SSL/TLS and with valid client certificates. If you want to enforce SSL/TLS without enforcing the requirement for valid client certificates, then use the `ssl_mode` flag instead of the legacy `require_ssl` flag.
         */
        requireSsl?: boolean | null;
        /**
         * Specify what type of CA is used for the server certificate.
         */
        serverCaMode?: string | null;
        /**
         * Optional. The resource name of the server CA pool for an instance with `CUSTOMER_MANAGED_CAS_CA` as the `server_ca_mode`. Format: projects/{PROJECT\}/locations/{REGION\}/caPools/{CA_POOL_ID\}
         */
        serverCaPool?: string | null;
        /**
         * Specify how SSL/TLS is enforced in database connections. If you must use the `require_ssl` flag for backward compatibility, then only the following value pairs are valid: For PostgreSQL and MySQL: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false` * `ssl_mode=TRUSTED_CLIENT_CERTIFICATE_REQUIRED` and `require_ssl=true` For SQL Server: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=true` The value of `ssl_mode` has priority over the value of `require_ssl`. For example, for the pair `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false`, `ssl_mode=ENCRYPTED_ONLY` means accept only SSL connections, while `require_ssl=false` means accept both non-SSL and SSL connections. In this case, MySQL and PostgreSQL databases respect `ssl_mode` and accepts only SSL connections.
         */
        sslMode?: string | null;
    }
    /**
     * Database instance IP mapping
     */
    export interface Schema$IpMapping {
        /**
         * The IP address assigned.
         */
        ipAddress?: string | null;
        /**
         * The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired.
         */
        timeToRetire?: string | null;
        /**
         * The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.
         */
        type?: string | null;
    }
    /**
     * The response payload containing a list of the backups.
     */
    export interface Schema$ListBackupsResponse {
        /**
         * A list of backups.
         */
        backups?: Schema$Backup[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, then there aren't subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * If a region isn't unavailable or if an unknown error occurs, then a warning message is returned.
         */
        warnings?: Schema$ApiWarning[];
    }
    /**
     * Preferred location. This specifies where a Cloud SQL instance is located. Note that if the preferred location is not available, the instance will be located as close as possible within the region. Only one location may be specified.
     */
    export interface Schema$LocationPreference {
        /**
         * The App Engine application to follow, it must be in the same region as the Cloud SQL instance. WARNING: Changing this might restart the instance.
         */
        followGaeApplication?: string | null;
        /**
         * This is always `sql#locationPreference`.
         */
        kind?: string | null;
        /**
         * The preferred Compute Engine zone for the secondary/failover (for example: us-central1-a, us-central1-b, etc.). To disable this field, set it to 'no_secondary_zone'.
         */
        secondaryZone?: string | null;
        /**
         * The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.). WARNING: Changing this might restart the instance.
         */
        zone?: string | null;
    }
    /**
     * Maintenance window. This specifies when a Cloud SQL instance is restarted for system maintenance purposes.
     */
    export interface Schema$MaintenanceWindow {
        /**
         * Day of week - `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, or `SUNDAY`. Specify in the UTC time zone. Returned in output as an integer, 1 to 7, where `1` equals Monday.
         */
        day?: number | null;
        /**
         * Hour of day - 0 to 23. Specify in the UTC time zone.
         */
        hour?: number | null;
        /**
         * This is always `sql#maintenanceWindow`.
         */
        kind?: string | null;
        /**
         * Maintenance timing settings: `canary`, `stable`, or `week5`. For more information, see [About maintenance on Cloud SQL instances](https://cloud.google.com/sql/docs/mysql/maintenance).
         */
        updateTrack?: string | null;
    }
    /**
     * Read-replica configuration specific to MySQL databases.
     */
    export interface Schema$MySqlReplicaConfiguration {
        /**
         * PEM representation of the trusted CA's x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica's x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.
         */
        clientKey?: string | null;
        /**
         * Seconds to wait between connect retries. MySQL's default is 60 seconds.
         */
        connectRetryInterval?: number | null;
        /**
         * Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.
         */
        dumpFilePath?: string | null;
        /**
         * This is always `sql#mysqlReplicaConfiguration`.
         */
        kind?: string | null;
        /**
         * Interval in milliseconds between replication heartbeats.
         */
        masterHeartbeatPeriod?: string | null;
        /**
         * The password for the replication connection.
         */
        password?: string | null;
        /**
         * A list of permissible ciphers to use for SSL encryption.
         */
        sslCipher?: string | null;
        /**
         * The username for the replication connection.
         */
        username?: string | null;
        /**
         * Whether or not to check the primary instance's Common Name value in the certificate that it sends during the SSL handshake.
         */
        verifyServerCertificate?: boolean | null;
    }
    /**
     * MySQL-specific external server sync settings.
     */
    export interface Schema$MySqlSyncConfig {
        /**
         * Flags to use for the initial dump.
         */
        initialSyncFlags?: Schema$SyncFlags[];
    }
    /**
     * On-premises instance configuration.
     */
    export interface Schema$OnPremisesConfiguration {
        /**
         * PEM representation of the trusted CA's x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica's x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.
         */
        clientKey?: string | null;
        /**
         * The dump file to create the Cloud SQL replica.
         */
        dumpFilePath?: string | null;
        /**
         * The host and port of the on-premises instance in host:port format
         */
        hostPort?: string | null;
        /**
         * This is always `sql#onPremisesConfiguration`.
         */
        kind?: string | null;
        /**
         * The password for connecting to on-premises instance.
         */
        password?: string | null;
        /**
         * Optional. A list of objects that the user selects for replication from an external source instance.
         */
        selectedObjects?: Schema$SelectedObjects[];
        /**
         * The reference to Cloud SQL instance if the source is Cloud SQL.
         */
        sourceInstance?: Schema$InstanceReference;
        /**
         * Optional. SslOption for replica connection to the on-premises source.
         */
        sslOption?: string | null;
        /**
         * The username for connecting to on-premises instance.
         */
        username?: string | null;
    }
    /**
     * An Operation resource. For successful operations that return an Operation resource, only the fields relevant to the operation are populated in the resource.
     */
    export interface Schema$Operation {
        /**
         * The context for acquire SSRS lease operation, if applicable.
         */
        acquireSsrsLeaseContext?: Schema$AcquireSsrsLeaseContext;
        /**
         * An Admin API warning message.
         */
        apiWarning?: Schema$ApiWarning;
        /**
         * The context for backup operation, if applicable.
         */
        backupContext?: Schema$BackupContext;
        /**
         * The time this operation finished in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        endTime?: string | null;
        /**
         * If errors occurred during processing of this operation, this field will be populated.
         */
        error?: Schema$OperationErrors;
        /**
         * The context for export operation, if applicable.
         */
        exportContext?: Schema$ExportContext;
        /**
         * The context for import operation, if applicable.
         */
        importContext?: Schema$ImportContext;
        /**
         * The time this operation was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        insertTime?: string | null;
        /**
         * This is always `sql#operation`.
         */
        kind?: string | null;
        /**
         * An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
         */
        name?: string | null;
        /**
         * The type of the operation. Valid values are: * `CREATE` * `DELETE` * `UPDATE` * `RESTART` * `IMPORT` * `EXPORT` * `BACKUP_VOLUME` * `RESTORE_VOLUME` * `CREATE_USER` * `DELETE_USER` * `CREATE_DATABASE` * `DELETE_DATABASE`
         */
        operationType?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * The time this operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        startTime?: string | null;
        /**
         * The status of an operation.
         */
        status?: string | null;
        /**
         * Optional. The sub operation based on the operation type.
         */
        subOperationType?: Schema$SqlSubOperationType;
        /**
         * Name of the resource on which this operation runs.
         */
        targetId?: string | null;
        targetLink?: string | null;
        /**
         * The project ID of the target instance related to this operation.
         */
        targetProject?: string | null;
        /**
         * The email address of the user who initiated this operation.
         */
        user?: string | null;
    }
    /**
     * Database instance operation error.
     */
    export interface Schema$OperationError {
        /**
         * Identifies the specific error that occurred.
         */
        code?: string | null;
        /**
         * This is always `sql#operationError`.
         */
        kind?: string | null;
        /**
         * Additional information about the error encountered.
         */
        message?: string | null;
    }
    /**
     * Database instance operation errors list wrapper.
     */
    export interface Schema$OperationErrors {
        /**
         * The list of errors encountered while processing this operation.
         */
        errors?: Schema$OperationError[];
        /**
         * This is always `sql#operationErrors`.
         */
        kind?: string | null;
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
     * Operations list response.
     */
    export interface Schema$OperationsListResponse {
        /**
         * List of operation resources.
         */
        items?: Schema$Operation[];
        /**
         * This is always `sql#operationsList`.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Read-only password status.
     */
    export interface Schema$PasswordStatus {
        /**
         * If true, user does not have login privileges.
         */
        locked?: boolean | null;
        /**
         * The expiration time of the current password.
         */
        passwordExpirationTime?: string | null;
    }
    /**
     * Database instance local user password validation policy
     */
    export interface Schema$PasswordValidationPolicy {
        /**
         * The complexity of the password.
         */
        complexity?: string | null;
        /**
         * This field is deprecated and will be removed in a future version of the API.
         */
        disallowCompromisedCredentials?: boolean | null;
        /**
         * Disallow username as a part of the password.
         */
        disallowUsernameSubstring?: boolean | null;
        /**
         * Whether the password policy is enabled or not.
         */
        enablePasswordPolicy?: boolean | null;
        /**
         * Minimum number of characters allowed.
         */
        minLength?: number | null;
        /**
         * Minimum interval after which the password can be changed. This flag is only supported for PostgreSQL.
         */
        passwordChangeInterval?: string | null;
        /**
         * Number of previous passwords that cannot be reused.
         */
        reuseInterval?: number | null;
    }
    /**
     * Perform disk shrink context.
     */
    export interface Schema$PerformDiskShrinkContext {
        /**
         * The target disk shrink size in GigaBytes.
         */
        targetSizeGb?: string | null;
    }
    /**
     * Context to perform a point-in-time restore of an instance managed by Google Cloud Backup and Disaster Recovery.
     */
    export interface Schema$PointInTimeRestoreContext {
        /**
         * Optional. The name of the allocated IP range for the internal IP Cloud SQL instance. For example: "google-managed-services-default". If you set this, then Cloud SQL creates the IP address for the cloned instance in the allocated range. This range must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035) standards. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])?. Reserved for future use. http://go/speckle-subnet-picker-clone
         */
        allocatedIpRange?: string | null;
        /**
         * The Google Cloud Backup and Disaster Recovery Datasource URI. Format: projects/{project\}/locations/{region\}/backupVaults/{backupvault\}/dataSources/{datasource\}.
         */
        datasource?: string | null;
        /**
         * Required. The date and time to which you want to restore the instance.
         */
        pointInTime?: string | null;
        /**
         * Optional. Point-in-time recovery of a regional instance in the specified zones. If not specified, clone to the same secondary zone as the source instance. This value cannot be the same as the preferred_zone field.
         */
        preferredSecondaryZone?: string | null;
        /**
         * Optional. Point-in-time recovery of an instance to the specified zone. If no zone is specified, then clone to the same primary zone as the source instance.
         */
        preferredZone?: string | null;
        /**
         * Optional. The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`.
         */
        privateNetwork?: string | null;
        /**
         * Target instance name.
         */
        targetInstance?: string | null;
    }
    /**
     * Details of a single read pool node of a read pool.
     */
    export interface Schema$PoolNodeConfig {
        /**
         * Output only. The DNS name of the read pool node.
         */
        dnsName?: string | null;
        /**
         * Output only. The list of DNS names used by this read pool node.
         */
        dnsNames?: Schema$DnsNameMapping[];
        /**
         * Output only. The zone of the read pool node.
         */
        gceZone?: string | null;
        /**
         * Output only. Mappings containing IP addresses that can be used to connect to the read pool node.
         */
        ipAddresses?: Schema$IpMapping[];
        /**
         * Output only. The name of the read pool node, to be used for retrieving metrics and logs.
         */
        name?: string | null;
        /**
         * Output only. The current state of the read pool node.
         */
        state?: string | null;
    }
    /**
     * Settings for an automatically-setup Private Service Connect consumer endpoint that is used to connect to a Cloud SQL instance.
     */
    export interface Schema$PscAutoConnectionConfig {
        /**
         * The consumer network of this consumer endpoint. This must be a resource path that includes both the host project and the network name. For example, `projects/project1/global/networks/network1`. The consumer host project of this network might be different from the consumer service project.
         */
        consumerNetwork?: string | null;
        /**
         * The connection policy status of the consumer network.
         */
        consumerNetworkStatus?: string | null;
        /**
         * This is the project ID of consumer service project of this consumer endpoint. Optional. This is only applicable if consumer_network is a shared vpc network.
         */
        consumerProject?: string | null;
        /**
         * The IP address of the consumer endpoint.
         */
        ipAddress?: string | null;
        /**
         * The connection status of the consumer endpoint.
         */
        status?: string | null;
    }
    /**
     * PSC settings for a Cloud SQL instance.
     */
    export interface Schema$PscConfig {
        /**
         * Optional. The list of consumer projects that are allow-listed for PSC connections to this instance. This instance can be connected to with PSC from any network in these projects. Each consumer project in this list may be represented by a project number (numeric) or by a project id (alphanumeric).
         */
        allowedConsumerProjects?: string[] | null;
        /**
         * Optional. The list of settings for requested Private Service Connect consumer endpoints that can be used to connect to this Cloud SQL instance.
         */
        pscAutoConnections?: Schema$PscAutoConnectionConfig[];
        /**
         * Whether PSC connectivity is enabled for this instance.
         */
        pscEnabled?: boolean | null;
    }
    /**
     * Read-replica configuration for connecting to the primary instance.
     */
    export interface Schema$ReplicaConfiguration {
        /**
         * Optional. Specifies if a SQL Server replica is a cascadable replica. A cascadable replica is a SQL Server cross region replica that supports replica(s) under it.
         */
        cascadableReplica?: boolean | null;
        /**
         * Specifies if the replica is the failover target. If the field is set to `true` the replica will be designated as a failover replica. In case the primary instance fails, the replica instance will be promoted as the new primary instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the primary instance.
         */
        failoverTarget?: boolean | null;
        /**
         * This is always `sql#replicaConfiguration`.
         */
        kind?: string | null;
        /**
         * MySQL specific configuration when replicating from a MySQL on-premises primary instance. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named `master.info` in the data directory.
         */
        mysqlReplicaConfiguration?: Schema$MySqlReplicaConfiguration;
    }
    /**
     * A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance has regional failure. Applicable to MySQL and PostgreSQL.
     */
    export interface Schema$ReplicationCluster {
        /**
         * Output only. Read-only field that indicates whether the replica is a DR replica. This field is not set if the instance is a primary instance.
         */
        drReplica?: boolean | null;
        /**
         * Optional. If the instance is a primary instance, then this field identifies the disaster recovery (DR) replica. A DR replica is an optional configuration for Enterprise Plus edition instances. If the instance is a read replica, then the field is not set. Set this field to a replica name to designate a DR replica for a primary instance. Remove the replica name to remove the DR replica designation.
         */
        failoverDrReplicaName?: string | null;
        /**
         * Output only. If set, this field indicates this instance has a private service access (PSA) DNS endpoint that is pointing to the primary instance of the cluster. If this instance is the primary, then the DNS endpoint points to this instance. After a switchover or replica failover operation, this DNS endpoint points to the promoted instance. This is a read-only field, returned to the user as information. This field can exist even if a standalone instance doesn't have a DR replica yet or the DR replica is deleted.
         */
        psaWriteEndpoint?: string | null;
    }
    export interface Schema$Reschedule {
        /**
         * Required. The type of the reschedule.
         */
        rescheduleType?: string | null;
        /**
         * Optional. Timestamp when the maintenance shall be rescheduled to if reschedule_type=SPECIFIC_TIME, in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        scheduleTime?: string | null;
    }
    /**
     * Database instance restore from backup context. Backup context contains source instance id and project id.
     */
    export interface Schema$RestoreBackupContext {
        /**
         * The ID of the backup run to restore from.
         */
        backupRunId?: string | null;
        /**
         * The ID of the instance that the backup was taken from.
         */
        instanceId?: string | null;
        /**
         * This is always `sql#restoreBackupContext`.
         */
        kind?: string | null;
        /**
         * The full project ID of the source instance.
         */
        project?: string | null;
    }
    /**
     * Instance rotate server CA context.
     */
    export interface Schema$RotateServerCaContext {
        /**
         * This is always `sql#rotateServerCaContext`.
         */
        kind?: string | null;
        /**
         * The fingerprint of the next version to be rotated to. If left unspecified, will be rotated to the most recently added server CA version.
         */
        nextVersion?: string | null;
    }
    /**
     * Instance rotate server certificate context.
     */
    export interface Schema$RotateServerCertificateContext {
        /**
         * Optional. This is always `sql#rotateServerCertificateContext`.
         */
        kind?: string | null;
        /**
         * Optional. The fingerprint of the next version to be rotated to. If left unspecified, will be rotated to the most recently added server certificate version.
         */
        nextVersion?: string | null;
    }
    /**
     * A list of objects that the user selects for replication from an external source instance.
     */
    export interface Schema$SelectedObjects {
        /**
         * Required. The name of the database to migrate.
         */
        database?: string | null;
    }
    /**
     * Database instance settings.
     */
    export interface Schema$Settings {
        /**
         * The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: * `ALWAYS`: The instance is on, and remains so even in the absence of connection requests. * `NEVER`: The instance is off; it is not activated, even if a connection request arrives.
         */
        activationPolicy?: string | null;
        /**
         * Active Directory configuration, relevant only for Cloud SQL for SQL Server.
         */
        activeDirectoryConfig?: Schema$SqlActiveDirectoryConfig;
        /**
         * Specifies advanced machine configuration for the instances relevant only for SQL Server.
         */
        advancedMachineFeatures?: Schema$AdvancedMachineFeatures;
        /**
         * The App Engine app IDs that can access this instance. (Deprecated) Applied to First Generation instances only.
         */
        authorizedGaeApplications?: string[] | null;
        /**
         * Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data accessibility. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available)./ For more information, see [Overview of the High Availability Configuration](https://cloud.google.com/sql/docs/mysql/high-availability).
         */
        availabilityType?: string | null;
        /**
         * The daily backup configuration for the instance.
         */
        backupConfiguration?: Schema$BackupConfiguration;
        /**
         * The name of server Instance collation.
         */
        collation?: string | null;
        /**
         * Optional. The managed connection pooling configuration for the instance.
         */
        connectionPoolConfig?: Schema$ConnectionPoolConfig;
        /**
         * Specifies if connections must use Cloud SQL connectors. Option values include the following: `NOT_REQUIRED` (Cloud SQL instances can be connected without Cloud SQL Connectors) and `REQUIRED` (Only allow connections that use Cloud SQL Connectors) Note that using REQUIRED disables all existing authorized networks. If this field is not specified when creating a new instance, NOT_REQUIRED is used. If this field is not specified when patching or updating an existing instance, it is left unchanged in the instance.
         */
        connectorEnforcement?: string | null;
        /**
         * Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.
         */
        crashSafeReplicationEnabled?: boolean | null;
        /**
         * The database flags passed to the instance at startup.
         */
        databaseFlags?: Schema$DatabaseFlags[];
        /**
         * Configuration specific to read replica instances. Indicates whether replication is enabled or not. WARNING: Changing this restarts the instance.
         */
        databaseReplicationEnabled?: boolean | null;
        /**
         * Configuration for data cache.
         */
        dataCacheConfig?: Schema$DataCacheConfig;
        /**
         * Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types.
         */
        dataDiskProvisionedIops?: string | null;
        /**
         * Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types.
         */
        dataDiskProvisionedThroughput?: string | null;
        /**
         * The size of data disk, in GB. The data disk size minimum is 10GB.
         */
        dataDiskSizeGb?: string | null;
        /**
         * The type of data disk: `PD_SSD` (default) or `PD_HDD`. Not used for First Generation instances.
         */
        dataDiskType?: string | null;
        /**
         * Configuration to protect against accidental instance deletion.
         */
        deletionProtectionEnabled?: boolean | null;
        /**
         * Deny maintenance periods
         */
        denyMaintenancePeriods?: Schema$DenyMaintenancePeriod[];
        /**
         * Optional. The edition of the instance.
         */
        edition?: string | null;
        /**
         * Optional. By default, Cloud SQL instances have schema extraction disabled for Dataplex. When this parameter is set to true, schema extraction for Dataplex on Cloud SQL instances is activated.
         */
        enableDataplexIntegration?: boolean | null;
        /**
         * Optional. When this parameter is set to true, Cloud SQL instances can connect to Vertex AI to pass requests for real-time predictions and insights to the AI. The default value is false. This applies only to Cloud SQL for MySQL and Cloud SQL for PostgreSQL instances.
         */
        enableGoogleMlIntegration?: boolean | null;
        /**
         * Insights configuration, for now relevant only for Postgres.
         */
        insightsConfig?: Schema$InsightsConfig;
        /**
         * The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled for Second Generation instances.
         */
        ipConfiguration?: Schema$IpConfiguration;
        /**
         * This is always `sql#settings`.
         */
        kind?: string | null;
        /**
         * The location preference settings. This allows the instance to be located as near as possible to either an App Engine app or Compute Engine zone for better performance. App Engine co-location was only applicable to First Generation instances.
         */
        locationPreference?: Schema$LocationPreference;
        /**
         * The maintenance window for this instance. This specifies when the instance can be restarted for maintenance purposes.
         */
        maintenanceWindow?: Schema$MaintenanceWindow;
        /**
         * The local user password validation policy of the instance.
         */
        passwordValidationPolicy?: Schema$PasswordValidationPolicy;
        /**
         * The pricing plan for this instance. This can be either `PER_USE` or `PACKAGE`. Only `PER_USE` is supported for Second Generation instances.
         */
        pricingPlan?: string | null;
        /**
         * Optional. Configuration value for recreation of replica after certain replication lag
         */
        replicationLagMaxSeconds?: number | null;
        /**
         * The type of replication this instance uses. This can be either `ASYNCHRONOUS` or `SYNCHRONOUS`. (Deprecated) This property was only applicable to First Generation instances.
         */
        replicationType?: string | null;
        /**
         * Optional. When this parameter is set to true, Cloud SQL retains backups of the instance even after the instance is deleted. The ON_DEMAND backup will be retained until customer deletes the backup or the project. The AUTOMATED backup will be retained based on the backups retention setting.
         */
        retainBackupsOnDelete?: boolean | null;
        /**
         * The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.
         */
        settingsVersion?: string | null;
        /**
         * SQL Server specific audit configuration.
         */
        sqlServerAuditConfig?: Schema$SqlServerAuditConfig;
        /**
         * Configuration to increase storage size automatically. The default value is true.
         */
        storageAutoResize?: boolean | null;
        /**
         * The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.
         */
        storageAutoResizeLimit?: string | null;
        /**
         * The tier (or machine type) for this instance, for example `db-custom-1-3840`. WARNING: Changing this restarts the instance.
         */
        tier?: string | null;
        /**
         * Server timezone, relevant only for Cloud SQL for SQL Server.
         */
        timeZone?: string | null;
        /**
         * User-provided labels, represented as a dictionary where each label is a single key value pair.
         */
        userLabels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Active Directory configuration, relevant only for Cloud SQL for SQL Server.
     */
    export interface Schema$SqlActiveDirectoryConfig {
        /**
         * The name of the domain (e.g., mydomain.com).
         */
        domain?: string | null;
        /**
         * This is always sql#activeDirectoryConfig.
         */
        kind?: string | null;
    }
    /**
     * External primary instance migration setting error/warning.
     */
    export interface Schema$SqlExternalSyncSettingError {
        /**
         * Additional information about the error encountered.
         */
        detail?: string | null;
        /**
         * Can be `sql#externalSyncSettingError` or `sql#externalSyncSettingWarning`.
         */
        kind?: string | null;
        /**
         * Identifies the specific error that occurred.
         */
        type?: string | null;
    }
    /**
     * Acquire SSRS lease response.
     */
    export interface Schema$SqlInstancesAcquireSsrsLeaseResponse {
        /**
         * The unique identifier for this operation.
         */
        operationId?: string | null;
    }
    /**
     * Instance get disk shrink config response.
     */
    export interface Schema$SqlInstancesGetDiskShrinkConfigResponse {
        /**
         * This is always `sql#getDiskShrinkConfig`.
         */
        kind?: string | null;
        /**
         * Additional message to customers.
         */
        message?: string | null;
        /**
         * The minimum size to which a disk can be shrunk in GigaBytes.
         */
        minimalTargetSizeGb?: string | null;
    }
    /**
     * Instance get latest recovery time response.
     */
    export interface Schema$SqlInstancesGetLatestRecoveryTimeResponse {
        /**
         * This is always `sql#getLatestRecoveryTime`.
         */
        kind?: string | null;
        /**
         * Timestamp, identifies the latest recovery time of the source instance.
         */
        latestRecoveryTime?: string | null;
    }
    /**
     * The response for the release of the SSRS lease.
     */
    export interface Schema$SqlInstancesReleaseSsrsLeaseResponse {
        /**
         * The operation ID.
         */
        operationId?: string | null;
    }
    /**
     * Reschedule options for maintenance windows.
     */
    export interface Schema$SqlInstancesRescheduleMaintenanceRequestBody {
        /**
         * Required. The type of the reschedule the user wants.
         */
        reschedule?: Schema$Reschedule;
    }
    /**
     * Instance reset replica size request.
     */
    export interface Schema$SqlInstancesResetReplicaSizeRequest {
    }
    export interface Schema$SqlInstancesStartExternalSyncRequest {
        /**
         * Optional. MigrationType configures the migration to use physical files or logical dump files. If not set, then the logical dump file configuration is used. Valid values are `LOGICAL` or `PHYSICAL`. Only applicable to MySQL.
         */
        migrationType?: string | null;
        /**
         * MySQL-specific settings for start external sync.
         */
        mysqlSyncConfig?: Schema$MySqlSyncConfig;
        /**
         * Whether to skip the verification step (VESS).
         */
        skipVerification?: boolean | null;
        /**
         * External sync mode.
         */
        syncMode?: string | null;
        /**
         * Optional. Parallel level for initial data sync. Currently only applicable for MySQL.
         */
        syncParallelLevel?: string | null;
    }
    export interface Schema$SqlInstancesVerifyExternalSyncSettingsRequest {
        /**
         * Optional. MigrationType configures the migration to use physical files or logical dump files. If not set, then the logical dump file configuration is used. Valid values are `LOGICAL` or `PHYSICAL`. Only applicable to MySQL.
         */
        migrationType?: string | null;
        /**
         * Optional. MySQL-specific settings for start external sync.
         */
        mysqlSyncConfig?: Schema$MySqlSyncConfig;
        /**
         * Optional. Migrate only the specified objects from the source instance. If this field is empty, then migrate all objects.
         */
        selectedObjects?: Schema$ExternalSyncSelectedObject[];
        /**
         * External sync mode
         */
        syncMode?: string | null;
        /**
         * Optional. Parallel level for initial data sync. Only applicable for PostgreSQL.
         */
        syncParallelLevel?: string | null;
        /**
         * Flag to enable verifying connection only
         */
        verifyConnectionOnly?: boolean | null;
        /**
         * Optional. Flag to verify settings required by replication setup only
         */
        verifyReplicationOnly?: boolean | null;
    }
    /**
     * Instance verify external sync settings response.
     */
    export interface Schema$SqlInstancesVerifyExternalSyncSettingsResponse {
        /**
         * List of migration violations.
         */
        errors?: Schema$SqlExternalSyncSettingError[];
        /**
         * This is always `sql#migrationSettingErrorList`.
         */
        kind?: string | null;
        /**
         * List of migration warnings.
         */
        warnings?: Schema$SqlExternalSyncSettingError[];
    }
    /**
     * This message wraps up the information written by out-of-disk detection job.
     */
    export interface Schema$SqlOutOfDiskReport {
        /**
         * The minimum recommended increase size in GigaBytes This field is consumed by the frontend * Writers: * the proactive database wellness job for OOD. * Readers:
         */
        sqlMinRecommendedIncreaseSizeGb?: number | null;
        /**
         * This field represents the state generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job
         */
        sqlOutOfDiskState?: string | null;
    }
    /**
     * Any scheduled maintenance for this instance.
     */
    export interface Schema$SqlScheduledMaintenance {
        canDefer?: boolean | null;
        /**
         * If the scheduled maintenance can be rescheduled.
         */
        canReschedule?: boolean | null;
        /**
         * Maintenance cannot be rescheduled to start beyond this deadline.
         */
        scheduleDeadlineTime?: string | null;
        /**
         * The start time of any upcoming scheduled maintenance for this instance.
         */
        startTime?: string | null;
    }
    /**
     * SQL Server specific audit configuration.
     */
    export interface Schema$SqlServerAuditConfig {
        /**
         * The name of the destination bucket (e.g., gs://mybucket).
         */
        bucket?: string | null;
        /**
         * This is always sql#sqlServerAuditConfig
         */
        kind?: string | null;
        /**
         * How long to keep generated audit files.
         */
        retentionInterval?: string | null;
        /**
         * How often to upload generated audit files.
         */
        uploadInterval?: string | null;
    }
    /**
     * Represents a Sql Server database on the Cloud SQL instance.
     */
    export interface Schema$SqlServerDatabaseDetails {
        /**
         * The version of SQL Server with which the database is to be made compatible
         */
        compatibilityLevel?: number | null;
        /**
         * The recovery model of a SQL Server database
         */
        recoveryModel?: string | null;
    }
    /**
     * Represents a Sql Server user on the Cloud SQL instance.
     */
    export interface Schema$SqlServerUserDetails {
        /**
         * If the user has been disabled
         */
        disabled?: boolean | null;
        /**
         * The server roles for this user
         */
        serverRoles?: string[] | null;
    }
    /**
     * The sub operation type based on the operation type.
     */
    export interface Schema$SqlSubOperationType {
        /**
         * The type of maintenance to be performed on the instance.
         */
        maintenanceType?: string | null;
    }
    /**
     * SslCerts Resource
     */
    export interface Schema$SslCert {
        /**
         * PEM representation.
         */
        cert?: string | null;
        /**
         * Serial number, as extracted from the certificate.
         */
        certSerialNumber?: string | null;
        /**
         * User supplied name. Constrained to [a-zA-Z.-_ ]+.
         */
        commonName?: string | null;
        /**
         * The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        createTime?: string | null;
        /**
         * The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.
         */
        expirationTime?: string | null;
        /**
         * Name of the database instance.
         */
        instance?: string | null;
        /**
         * This is always `sql#sslCert`.
         */
        kind?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * Sha1 Fingerprint.
         */
        sha1Fingerprint?: string | null;
    }
    /**
     * SslCertDetail.
     */
    export interface Schema$SslCertDetail {
        /**
         * The public information about the cert.
         */
        certInfo?: Schema$SslCert;
        /**
         * The private key for the client cert, in pem format. Keep private in order to protect your security.
         */
        certPrivateKey?: string | null;
    }
    /**
     * SslCerts create ephemeral certificate request.
     */
    export interface Schema$SslCertsCreateEphemeralRequest {
        /**
         * Access token to include in the signed certificate.
         */
        access_token?: string | null;
        /**
         * PEM encoded public key to include in the signed certificate.
         */
        public_key?: string | null;
    }
    /**
     * SslCerts insert request.
     */
    export interface Schema$SslCertsInsertRequest {
        /**
         * User supplied name. Must be a distinct name from the other certificates for this instance.
         */
        commonName?: string | null;
    }
    /**
     * SslCert insert response.
     */
    export interface Schema$SslCertsInsertResponse {
        /**
         * The new client certificate and private key.
         */
        clientCert?: Schema$SslCertDetail;
        /**
         * This is always `sql#sslCertsInsert`.
         */
        kind?: string | null;
        /**
         * The operation to track the ssl certs insert request.
         */
        operation?: Schema$Operation;
        /**
         * The server Certificate Authority's certificate. If this is missing you can force a new one to be generated by calling resetSslConfig method on instances resource.
         */
        serverCaCert?: Schema$SslCert;
    }
    /**
     * SslCerts list response.
     */
    export interface Schema$SslCertsListResponse {
        /**
         * List of client certificates for the instance.
         */
        items?: Schema$SslCert[];
        /**
         * This is always `sql#sslCertsList`.
         */
        kind?: string | null;
    }
    /**
     * Initial sync flags for certain Cloud SQL APIs. Currently used for the MySQL external server initial dump.
     */
    export interface Schema$SyncFlags {
        /**
         * The name of the flag.
         */
        name?: string | null;
        /**
         * The value of the flag. This field must be omitted if the flag doesn't take a value.
         */
        value?: string | null;
    }
    /**
     * A Google Cloud SQL service tier resource.
     */
    export interface Schema$Tier {
        /**
         * The maximum disk size of this tier in bytes.
         */
        DiskQuota?: string | null;
        /**
         * This is always `sql#tier`.
         */
        kind?: string | null;
        /**
         * The maximum RAM usage of this tier in bytes.
         */
        RAM?: string | null;
        /**
         * The applicable regions for this tier.
         */
        region?: string[] | null;
        /**
         * An identifier for the machine type, for example, `db-custom-1-3840`. For related information, see [Pricing](/sql/pricing).
         */
        tier?: string | null;
    }
    /**
     * Tiers list response.
     */
    export interface Schema$TiersListResponse {
        /**
         * List of tiers.
         */
        items?: Schema$Tier[];
        /**
         * This is always `sql#tiersList`.
         */
        kind?: string | null;
    }
    /**
     * Database Instance truncate log context.
     */
    export interface Schema$TruncateLogContext {
        /**
         * This is always `sql#truncateLogContext`.
         */
        kind?: string | null;
        /**
         * The type of log to truncate. Valid values are `MYSQL_GENERAL_TABLE` and `MYSQL_SLOW_TABLE`.
         */
        logType?: string | null;
    }
    /**
     * A Cloud SQL user resource.
     */
    export interface Schema$User {
        /**
         * Dual password status for the user.
         */
        dualPasswordType?: string | null;
        /**
         * This field is deprecated and will be removed from a future version of the API.
         */
        etag?: string | null;
        /**
         * Optional. The host from which the user can connect. For `insert` operations, host defaults to an empty string. For `update` operations, host is specified as part of the request URL. The host name cannot be updated after insertion. For a MySQL instance, it's required; for a PostgreSQL or SQL Server instance, it's optional.
         */
        host?: string | null;
        /**
         * The name of the Cloud SQL instance. This does not include the project ID. Can be omitted for *update* because it is already specified on the URL.
         */
        instance?: string | null;
        /**
         * This is always `sql#user`.
         */
        kind?: string | null;
        /**
         * The name of the user in the Cloud SQL instance. Can be omitted for `update` because it is already specified in the URL.
         */
        name?: string | null;
        /**
         * The password for the user.
         */
        password?: string | null;
        /**
         * User level password validation policy.
         */
        passwordPolicy?: Schema$UserPasswordValidationPolicy;
        /**
         * The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable. Can be omitted for *update* because it is already specified on the URL.
         */
        project?: string | null;
        sqlserverUserDetails?: Schema$SqlServerUserDetails;
        /**
         * The user type. It determines the method to authenticate the user during login. The default is the database's built-in user type.
         */
        type?: string | null;
    }
    /**
     * User level password validation policy.
     */
    export interface Schema$UserPasswordValidationPolicy {
        /**
         * Number of failed login attempts allowed before user get locked.
         */
        allowedFailedAttempts?: number | null;
        /**
         * If true, failed login attempts check will be enabled.
         */
        enableFailedAttemptsCheck?: boolean | null;
        /**
         * If true, the user must specify the current password before changing the password. This flag is supported only for MySQL.
         */
        enablePasswordVerification?: boolean | null;
        /**
         * Expiration duration after password is updated.
         */
        passwordExpirationDuration?: string | null;
        /**
         * Output only. Read-only password status.
         */
        status?: Schema$PasswordStatus;
    }
    /**
     * User list response.
     */
    export interface Schema$UsersListResponse {
        /**
         * List of user resources in the instance.
         */
        items?: Schema$User[];
        /**
         * This is always *sql#usersList*.
         */
        kind?: string | null;
        /**
         * Unused.
         */
        nextPageToken?: string | null;
    }
    export class Resource$Backupruns {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes the backup taken by a backup run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Backupruns$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Backupruns$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Backupruns$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Backupruns$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Backupruns$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a resource containing information about a backup run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Backupruns$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Backupruns$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupRun>>;
        get(params: Params$Resource$Backupruns$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Backupruns$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupRun>, callback: BodyResponseCallback<Schema$BackupRun>): void;
        get(params: Params$Resource$Backupruns$Get, callback: BodyResponseCallback<Schema$BackupRun>): void;
        get(callback: BodyResponseCallback<Schema$BackupRun>): void;
        /**
         * Creates a new backup run on demand.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Backupruns$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Backupruns$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Backupruns$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Backupruns$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Backupruns$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists all backup runs associated with the project or a given instance and configuration in the reverse chronological order of the backup initiation time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Backupruns$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Backupruns$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupRunsListResponse>>;
        list(params: Params$Resource$Backupruns$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Backupruns$List, options: MethodOptions | BodyResponseCallback<Schema$BackupRunsListResponse>, callback: BodyResponseCallback<Schema$BackupRunsListResponse>): void;
        list(params: Params$Resource$Backupruns$List, callback: BodyResponseCallback<Schema$BackupRunsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$BackupRunsListResponse>): void;
    }
    export interface Params$Resource$Backupruns$Delete extends StandardParameters {
        /**
         * The ID of the backup run to delete. To find a backup run ID, use the [list](https://cloud.google.com/sql/docs/mysql/admin-api/rest/v1beta4/backupRuns/list) method.
         */
        id?: string;
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Backupruns$Get extends StandardParameters {
        /**
         * The ID of this backup run.
         */
        id?: string;
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Backupruns$Insert extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupRun;
    }
    export interface Params$Resource$Backupruns$List extends StandardParameters {
        /**
         * Cloud SQL instance ID, or "-" for all instances. This does not include the project ID.
         */
        instance?: string;
        /**
         * Maximum number of backup runs per response.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export class Resource$Backups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a backup for a Cloud SQL instance. This API can be used only to create on-demand backups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createBackup(params: Params$Resource$Backups$Createbackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createBackup(params?: Params$Resource$Backups$Createbackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createBackup(params: Params$Resource$Backups$Createbackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createBackup(params: Params$Resource$Backups$Createbackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createBackup(params: Params$Resource$Backups$Createbackup, callback: BodyResponseCallback<Schema$Operation>): void;
        createBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deleteBackup(params: Params$Resource$Backups$Deletebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteBackup(params?: Params$Resource$Backups$Deletebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        deleteBackup(params: Params$Resource$Backups$Deletebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteBackup(params: Params$Resource$Backups$Deletebackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        deleteBackup(params: Params$Resource$Backups$Deletebackup, callback: BodyResponseCallback<Schema$Operation>): void;
        deleteBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a resource containing information about a backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getBackup(params: Params$Resource$Backups$Getbackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getBackup(params?: Params$Resource$Backups$Getbackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Backup>>;
        getBackup(params: Params$Resource$Backups$Getbackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getBackup(params: Params$Resource$Backups$Getbackup, options: MethodOptions | BodyResponseCallback<Schema$Backup>, callback: BodyResponseCallback<Schema$Backup>): void;
        getBackup(params: Params$Resource$Backups$Getbackup, callback: BodyResponseCallback<Schema$Backup>): void;
        getBackup(callback: BodyResponseCallback<Schema$Backup>): void;
        /**
         * Lists all backups associated with the project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listBackups(params: Params$Resource$Backups$Listbackups, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listBackups(params?: Params$Resource$Backups$Listbackups, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupsResponse>>;
        listBackups(params: Params$Resource$Backups$Listbackups, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listBackups(params: Params$Resource$Backups$Listbackups, options: MethodOptions | BodyResponseCallback<Schema$ListBackupsResponse>, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        listBackups(params: Params$Resource$Backups$Listbackups, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        listBackups(callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        /**
         * Updates the retention period and the description of the backup. You can use this API to update final backups only.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateBackup(params: Params$Resource$Backups$Updatebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateBackup(params?: Params$Resource$Backups$Updatebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateBackup(params: Params$Resource$Backups$Updatebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateBackup(params: Params$Resource$Backups$Updatebackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateBackup(params: Params$Resource$Backups$Updatebackup, callback: BodyResponseCallback<Schema$Operation>): void;
        updateBackup(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Backups$Createbackup extends StandardParameters {
        /**
         * Required. The parent resource where this backup is created. Format: projects/{project\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Backup;
    }
    export interface Params$Resource$Backups$Deletebackup extends StandardParameters {
        /**
         * Required. The name of the backup to delete. Format: projects/{project\}/backups/{backup\}
         */
        name?: string;
    }
    export interface Params$Resource$Backups$Getbackup extends StandardParameters {
        /**
         * Required. The name of the backup to retrieve. Format: projects/{project\}/backups/{backup\}
         */
        name?: string;
    }
    export interface Params$Resource$Backups$Listbackups extends StandardParameters {
        /**
         * Multiple filter queries are separated by spaces. For example, 'instance:abc AND type:FINAL, 'location:us', 'backupInterval.startTime\>=1950-01-01T01:01:25.771Z'. You can filter by type, instance, backupInterval.startTime (creation time), or location.
         */
        filter?: string;
        /**
         * The maximum number of backups to return per response. The service might return fewer backups than this value. If a value for this parameter isn't specified, then, at most, 500 backups are returned. The maximum value is 2,000. Any values that you set, which are greater than 2,000, are changed to 2,000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListBackups` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBackups` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent that owns this collection of backups. Format: projects/{project\}
         */
        parent?: string;
    }
    export interface Params$Resource$Backups$Updatebackup extends StandardParameters {
        /**
         * Output only. The resource name of the backup. Format: projects/{project\}/backups/{backup\}.
         */
        name?: string;
        /**
         * The list of fields that you can update. You can update only the description and retention period of the final backup.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Backup;
    }
    export class Resource$Connect {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateEphemeralCert(params: Params$Resource$Connect$Generateephemeralcert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateEphemeralCert(params?: Params$Resource$Connect$Generateephemeralcert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateEphemeralCertResponse>>;
        generateEphemeralCert(params: Params$Resource$Connect$Generateephemeralcert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateEphemeralCert(params: Params$Resource$Connect$Generateephemeralcert, options: MethodOptions | BodyResponseCallback<Schema$GenerateEphemeralCertResponse>, callback: BodyResponseCallback<Schema$GenerateEphemeralCertResponse>): void;
        generateEphemeralCert(params: Params$Resource$Connect$Generateephemeralcert, callback: BodyResponseCallback<Schema$GenerateEphemeralCertResponse>): void;
        generateEphemeralCert(callback: BodyResponseCallback<Schema$GenerateEphemeralCertResponse>): void;
        /**
         * Retrieves connect settings about a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Connect$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Connect$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConnectSettings>>;
        get(params: Params$Resource$Connect$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Connect$Get, options: MethodOptions | BodyResponseCallback<Schema$ConnectSettings>, callback: BodyResponseCallback<Schema$ConnectSettings>): void;
        get(params: Params$Resource$Connect$Get, callback: BodyResponseCallback<Schema$ConnectSettings>): void;
        get(callback: BodyResponseCallback<Schema$ConnectSettings>): void;
    }
    export interface Params$Resource$Connect$Generateephemeralcert extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GenerateEphemeralCertRequest;
    }
    export interface Params$Resource$Connect$Get extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Optional. Optional snapshot read timestamp to trade freshness for performance.
         */
        readTime?: string;
    }
    export class Resource$Databases {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a database from a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Databases$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Databases$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Databases$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Databases$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Databases$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a resource containing information about a database inside a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Databases$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Databases$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Database>>;
        get(params: Params$Resource$Databases$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Databases$Get, options: MethodOptions | BodyResponseCallback<Schema$Database>, callback: BodyResponseCallback<Schema$Database>): void;
        get(params: Params$Resource$Databases$Get, callback: BodyResponseCallback<Schema$Database>): void;
        get(callback: BodyResponseCallback<Schema$Database>): void;
        /**
         * Inserts a resource containing information about a database inside a Cloud SQL instance. **Note:** You can't modify the default character set and collation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Databases$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Databases$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Databases$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Databases$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Databases$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists databases in the specified Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Databases$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Databases$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DatabasesListResponse>>;
        list(params: Params$Resource$Databases$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Databases$List, options: MethodOptions | BodyResponseCallback<Schema$DatabasesListResponse>, callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        list(params: Params$Resource$Databases$List, callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        /**
         * Partially updates a resource containing information about a database inside a Cloud SQL instance. This method supports patch semantics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Databases$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Databases$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Databases$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Databases$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Databases$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates a resource containing information about a database inside a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Databases$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Databases$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Databases$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Databases$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Databases$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Databases$Delete extends StandardParameters {
        /**
         * Name of the database to be deleted in the instance.
         */
        database?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Databases$Get extends StandardParameters {
        /**
         * Name of the database in the instance.
         */
        database?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Databases$Insert extends StandardParameters {
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Database;
    }
    export interface Params$Resource$Databases$List extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Databases$Patch extends StandardParameters {
        /**
         * Name of the database to be updated in the instance.
         */
        database?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Database;
    }
    export interface Params$Resource$Databases$Update extends StandardParameters {
        /**
         * Name of the database to be updated in the instance.
         */
        database?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Database;
    }
    export class Resource$Flags {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all available database flags for Cloud SQL instances.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Flags$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Flags$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FlagsListResponse>>;
        list(params: Params$Resource$Flags$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Flags$List, options: MethodOptions | BodyResponseCallback<Schema$FlagsListResponse>, callback: BodyResponseCallback<Schema$FlagsListResponse>): void;
        list(params: Params$Resource$Flags$List, callback: BodyResponseCallback<Schema$FlagsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$FlagsListResponse>): void;
    }
    export interface Params$Resource$Flags$List extends StandardParameters {
        /**
         * Database type and version you want to retrieve flags for. By default, this method returns flags for all database types and versions.
         */
        databaseVersion?: string;
        /**
         * Optional. Specify the scope of flags to be returned by SqlFlagsListService. Return list of database flags if unspecified.
         */
        flagScope?: string;
    }
    export class Resource$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Acquire a lease for the setup of SQL Server Reporting Services (SSRS).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        acquireSsrsLease(params: Params$Resource$Instances$Acquiressrslease, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        acquireSsrsLease(params?: Params$Resource$Instances$Acquiressrslease, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesAcquireSsrsLeaseResponse>>;
        acquireSsrsLease(params: Params$Resource$Instances$Acquiressrslease, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acquireSsrsLease(params: Params$Resource$Instances$Acquiressrslease, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesAcquireSsrsLeaseResponse>, callback: BodyResponseCallback<Schema$SqlInstancesAcquireSsrsLeaseResponse>): void;
        acquireSsrsLease(params: Params$Resource$Instances$Acquiressrslease, callback: BodyResponseCallback<Schema$SqlInstancesAcquireSsrsLeaseResponse>): void;
        acquireSsrsLease(callback: BodyResponseCallback<Schema$SqlInstancesAcquireSsrsLeaseResponse>): void;
        /**
         * Add a new trusted Certificate Authority (CA) version for the specified instance. Required to prepare for a certificate rotation. If a CA version was previously added but never used in a certificate rotation, this operation replaces that version. There cannot be more than one CA version waiting to be rotated in. For instances that have enabled Certificate Authority Service (CAS) based server CA, use AddServerCertificate to add a new server certificate.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        addServerCa(params: Params$Resource$Instances$Addserverca, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addServerCa(params?: Params$Resource$Instances$Addserverca, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        addServerCa(params: Params$Resource$Instances$Addserverca, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addServerCa(params: Params$Resource$Instances$Addserverca, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCa(params: Params$Resource$Instances$Addserverca, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCa(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Add a new trusted server certificate version for the specified instance using Certificate Authority Service (CAS) server CA. Required to prepare for a certificate rotation. If a server certificate version was previously added but never used in a certificate rotation, this operation replaces that version. There cannot be more than one certificate version waiting to be rotated in. For instances not using CAS server CA, use AddServerCa instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        addServerCertificate(params: Params$Resource$Instances$Addservercertificate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addServerCertificate(params?: Params$Resource$Instances$Addservercertificate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        addServerCertificate(params: Params$Resource$Instances$Addservercertificate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addServerCertificate(params: Params$Resource$Instances$Addservercertificate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCertificate(params: Params$Resource$Instances$Addservercertificate, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCertificate(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a Cloud SQL instance as a clone of the source instance. Using this operation might cause your instance to restart.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        clone(params: Params$Resource$Instances$Clone, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        clone(params?: Params$Resource$Instances$Clone, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        clone(params: Params$Resource$Instances$Clone, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        clone(params: Params$Resource$Instances$Clone, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        clone(params: Params$Resource$Instances$Clone, callback: BodyResponseCallback<Schema$Operation>): void;
        clone(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Instances$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Demotes an existing standalone instance to be a Cloud SQL read replica for an external database server.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        demote(params: Params$Resource$Instances$Demote, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        demote(params?: Params$Resource$Instances$Demote, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        demote(params: Params$Resource$Instances$Demote, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        demote(params: Params$Resource$Instances$Demote, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        demote(params: Params$Resource$Instances$Demote, callback: BodyResponseCallback<Schema$Operation>): void;
        demote(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Demotes the stand-alone instance to be a Cloud SQL read replica for an external database server.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        demoteMaster(params?: Params$Resource$Instances$Demotemaster, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, callback: BodyResponseCallback<Schema$Operation>): void;
        demoteMaster(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Exports data from a Cloud SQL instance to a Cloud Storage bucket as a SQL dump or CSV file.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Instances$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Instances$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Instances$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Instances$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Instances$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Initiates a manual failover of a high availability (HA) primary instance to a standby instance, which becomes the primary instance. Users are then rerouted to the new primary. For more information, see the [Overview of high availability](https://cloud.google.com/sql/docs/mysql/high-availability) page in the Cloud SQL documentation. If using Legacy HA (MySQL only), this causes the instance to failover to its failover replica instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        failover(params: Params$Resource$Instances$Failover, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        failover(params?: Params$Resource$Instances$Failover, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        failover(params: Params$Resource$Instances$Failover, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        failover(params: Params$Resource$Instances$Failover, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(params: Params$Resource$Instances$Failover, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a resource containing information about a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DatabaseInstance>>;
        get(params: Params$Resource$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$DatabaseInstance>, callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        get(params: Params$Resource$Instances$Get, callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        get(callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        /**
         * Imports data into a Cloud SQL instance from a SQL dump or CSV file in Cloud Storage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Instances$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Instances$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Instances$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Instances$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Instances$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a new Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Instances$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Instances$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Instances$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Instances$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Instances$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists instances under a given project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstancesListResponse>>;
        list(params: Params$Resource$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$InstancesListResponse>, callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        list(params: Params$Resource$Instances$List, callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        /**
         * Lists all of the trusted Certificate Authorities (CAs) for the specified instance. There can be up to three CAs listed: the CA that was used to sign the certificate that is currently in use, a CA that has been added but not yet used to sign a certificate, and a CA used to sign a certificate that has previously rotated out.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listServerCas(params: Params$Resource$Instances$Listservercas, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listServerCas(params?: Params$Resource$Instances$Listservercas, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstancesListServerCasResponse>>;
        listServerCas(params: Params$Resource$Instances$Listservercas, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listServerCas(params: Params$Resource$Instances$Listservercas, options: MethodOptions | BodyResponseCallback<Schema$InstancesListServerCasResponse>, callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        listServerCas(params: Params$Resource$Instances$Listservercas, callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        listServerCas(callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        /**
         * Lists all versions of server certificates and certificate authorities (CAs) for the specified instance. There can be up to three sets of certs listed: the certificate that is currently in use, a future that has been added but not yet used to sign a certificate, and a certificate that has been rotated out. For instances not using Certificate Authority Service (CAS) server CA, use ListServerCas instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        ListServerCertificates(params: Params$Resource$Instances$Listservercertificates, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        ListServerCertificates(params?: Params$Resource$Instances$Listservercertificates, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstancesListServerCertificatesResponse>>;
        ListServerCertificates(params: Params$Resource$Instances$Listservercertificates, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        ListServerCertificates(params: Params$Resource$Instances$Listservercertificates, options: MethodOptions | BodyResponseCallback<Schema$InstancesListServerCertificatesResponse>, callback: BodyResponseCallback<Schema$InstancesListServerCertificatesResponse>): void;
        ListServerCertificates(params: Params$Resource$Instances$Listservercertificates, callback: BodyResponseCallback<Schema$InstancesListServerCertificatesResponse>): void;
        ListServerCertificates(callback: BodyResponseCallback<Schema$InstancesListServerCertificatesResponse>): void;
        /**
         * Partially updates settings of a Cloud SQL instance by merging the request with the current configuration. This method supports patch semantics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Instances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Instances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Instances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Instances$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Instances$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Point in time restore for an instance managed by Google Cloud Backup and Disaster Recovery.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        pointInTimeRestore(params: Params$Resource$Instances$Pointintimerestore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        pointInTimeRestore(params?: Params$Resource$Instances$Pointintimerestore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        pointInTimeRestore(params: Params$Resource$Instances$Pointintimerestore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        pointInTimeRestore(params: Params$Resource$Instances$Pointintimerestore, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        pointInTimeRestore(params: Params$Resource$Instances$Pointintimerestore, callback: BodyResponseCallback<Schema$Operation>): void;
        pointInTimeRestore(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Promotes the read replica instance to be an independent Cloud SQL primary instance. Using this operation might cause your instance to restart.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        promoteReplica(params?: Params$Resource$Instances$Promotereplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, callback: BodyResponseCallback<Schema$Operation>): void;
        promoteReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Reencrypt CMEK instance with latest key version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reencrypt(params: Params$Resource$Instances$Reencrypt, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reencrypt(params?: Params$Resource$Instances$Reencrypt, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        reencrypt(params: Params$Resource$Instances$Reencrypt, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reencrypt(params: Params$Resource$Instances$Reencrypt, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        reencrypt(params: Params$Resource$Instances$Reencrypt, callback: BodyResponseCallback<Schema$Operation>): void;
        reencrypt(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Release a lease for the setup of SQL Server Reporting Services (SSRS).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        releaseSsrsLease(params: Params$Resource$Instances$Releasessrslease, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        releaseSsrsLease(params?: Params$Resource$Instances$Releasessrslease, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesReleaseSsrsLeaseResponse>>;
        releaseSsrsLease(params: Params$Resource$Instances$Releasessrslease, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        releaseSsrsLease(params: Params$Resource$Instances$Releasessrslease, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesReleaseSsrsLeaseResponse>, callback: BodyResponseCallback<Schema$SqlInstancesReleaseSsrsLeaseResponse>): void;
        releaseSsrsLease(params: Params$Resource$Instances$Releasessrslease, callback: BodyResponseCallback<Schema$SqlInstancesReleaseSsrsLeaseResponse>): void;
        releaseSsrsLease(callback: BodyResponseCallback<Schema$SqlInstancesReleaseSsrsLeaseResponse>): void;
        /**
         * Deletes all client certificates and generates a new server SSL certificate for the instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetSslConfig(params?: Params$Resource$Instances$Resetsslconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, callback: BodyResponseCallback<Schema$Operation>): void;
        resetSslConfig(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Restarts a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restart(params: Params$Resource$Instances$Restart, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restart(params?: Params$Resource$Instances$Restart, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restart(params: Params$Resource$Instances$Restart, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restart(params: Params$Resource$Instances$Restart, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(params: Params$Resource$Instances$Restart, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Restores a backup of a Cloud SQL instance. Using this operation might cause your instance to restart.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restoreBackup(params?: Params$Resource$Instances$Restorebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Rotates the server certificate to one signed by the Certificate Authority (CA) version previously added with the addServerCA method. For instances that have enabled Certificate Authority Service (CAS) based server CA, use RotateServerCertificate to rotate the server certificate.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rotateServerCa(params?: Params$Resource$Instances$Rotateserverca, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, callback: BodyResponseCallback<Schema$Operation>): void;
        rotateServerCa(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Rotates the server certificate version to one previously added with the addServerCertificate method. For instances not using Certificate Authority Service (CAS) server CA, use RotateServerCa instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        RotateServerCertificate(params: Params$Resource$Instances$Rotateservercertificate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        RotateServerCertificate(params?: Params$Resource$Instances$Rotateservercertificate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        RotateServerCertificate(params: Params$Resource$Instances$Rotateservercertificate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        RotateServerCertificate(params: Params$Resource$Instances$Rotateservercertificate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        RotateServerCertificate(params: Params$Resource$Instances$Rotateservercertificate, callback: BodyResponseCallback<Schema$Operation>): void;
        RotateServerCertificate(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Starts the replication in the read replica instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startReplica(params: Params$Resource$Instances$Startreplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startReplica(params?: Params$Resource$Instances$Startreplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startReplica(params: Params$Resource$Instances$Startreplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startReplica(params: Params$Resource$Instances$Startreplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startReplica(params: Params$Resource$Instances$Startreplica, callback: BodyResponseCallback<Schema$Operation>): void;
        startReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Stops the replication in the read replica instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stopReplica(params?: Params$Resource$Instances$Stopreplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        stopReplica(params: Params$Resource$Instances$Stopreplica, callback: BodyResponseCallback<Schema$Operation>): void;
        stopReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Switches over from the primary instance to the DR replica instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        switchover(params: Params$Resource$Instances$Switchover, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        switchover(params?: Params$Resource$Instances$Switchover, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        switchover(params: Params$Resource$Instances$Switchover, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        switchover(params: Params$Resource$Instances$Switchover, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        switchover(params: Params$Resource$Instances$Switchover, callback: BodyResponseCallback<Schema$Operation>): void;
        switchover(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Truncate MySQL general and slow query log tables MySQL only.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        truncateLog(params?: Params$Resource$Instances$Truncatelog, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        truncateLog(params: Params$Resource$Instances$Truncatelog, callback: BodyResponseCallback<Schema$Operation>): void;
        truncateLog(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates settings of a Cloud SQL instance. Using this operation might cause your instance to restart.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Instances$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Instances$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Instances$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Instances$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Instances$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Instances$Acquiressrslease extends StandardParameters {
        /**
         * Required. Cloud SQL instance ID. This doesn't include the project ID. It's composed of lowercase letters, numbers, and hyphens, and it must start with a letter. The total length must be 98 characters or less (Example: instance-id).
         */
        instance?: string;
        /**
         * Required. ID of the project that contains the instance (Example: project-id).
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesAcquireSsrsLeaseRequest;
    }
    export interface Params$Resource$Instances$Addserverca extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Addservercertificate extends StandardParameters {
        /**
         * Required. Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Required. Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Clone extends StandardParameters {
        /**
         * The ID of the Cloud SQL instance to be cloned (source). This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the source as well as the clone Cloud SQL instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesCloneRequest;
    }
    export interface Params$Resource$Instances$Delete extends StandardParameters {
        /**
         * Flag to opt-in for final backup. By default, it is turned off.
         */
        enableFinalBackup?: boolean;
        /**
         * Optional. The description of the final backup.
         */
        finalBackupDescription?: string;
        /**
         * Optional. Final Backup expiration time. Timestamp in UTC of when this resource is considered expired.
         */
        finalBackupExpiryTime?: string;
        /**
         * Optional. Retention period of the final backup.
         */
        finalBackupTtlDays?: string;
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance to be deleted.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Demote extends StandardParameters {
        /**
         * Required. The name of the Cloud SQL instance.
         */
        instance?: string;
        /**
         * Required. The project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesDemoteRequest;
    }
    export interface Params$Resource$Instances$Demotemaster extends StandardParameters {
        /**
         * Cloud SQL instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesDemoteMasterRequest;
    }
    export interface Params$Resource$Instances$Export extends StandardParameters {
        /**
         * The Cloud SQL instance ID. This doesn't include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance to be exported.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesExportRequest;
    }
    export interface Params$Resource$Instances$Failover extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesFailoverRequest;
    }
    export interface Params$Resource$Instances$Get extends StandardParameters {
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Import extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesImportRequest;
    }
    export interface Params$Resource$Instances$Insert extends StandardParameters {
        /**
         * Project ID of the project to which the newly created Cloud SQL instances should belong.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DatabaseInstance;
    }
    export interface Params$Resource$Instances$List extends StandardParameters {
        /**
         * A filter expression that filters resources listed in the response. The expression is in the form of field:value. For example, 'instanceType:CLOUD_SQL_INSTANCE'. Fields can be nested as needed as per their JSON representation, such as 'settings.userLabels.auto_start:true'. Multiple filter queries are space-separated. For example. 'state:RUNNABLE instanceType:CLOUD_SQL_INSTANCE'. By default, each expression is an AND expression. However, you can include AND and OR expressions explicitly.
         */
        filter?: string;
        /**
         * The maximum number of instances to return. The service may return fewer than this value. If unspecified, at most 500 instances are returned. The maximum value is 1000; values above 1000 are coerced to 1000.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * Project ID of the project for which to list Cloud SQL instances.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Listservercas extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Listservercertificates extends StandardParameters {
        /**
         * Required. Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Required. Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Patch extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DatabaseInstance;
    }
    export interface Params$Resource$Instances$Pointintimerestore extends StandardParameters {
        /**
         * Required. The parent resource where you created this instance. Format: projects/{project\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PointInTimeRestoreContext;
    }
    export interface Params$Resource$Instances$Promotereplica extends StandardParameters {
        /**
         * Set to true to invoke a replica failover to the DR replica. As part of replica failover, the promote operation attempts to add the original primary instance as a replica of the promoted DR replica when the original primary instance comes back online. If set to false or not specified, then the original primary instance becomes an independent Cloud SQL primary instance.
         */
        failover?: boolean;
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Reencrypt extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesReencryptRequest;
    }
    export interface Params$Resource$Instances$Releasessrslease extends StandardParameters {
        /**
         * Required. The Cloud SQL instance ID. This doesn't include the project ID. It's composed of lowercase letters, numbers, and hyphens, and it must start with a letter. The total length must be 98 characters or less (Example: instance-id).
         */
        instance?: string;
        /**
         * Required. The ID of the project that contains the instance (Example: project-id).
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Resetsslconfig extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Restart extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance to be restarted.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Restorebackup extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesRestoreBackupRequest;
    }
    export interface Params$Resource$Instances$Rotateserverca extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesRotateServerCaRequest;
    }
    export interface Params$Resource$Instances$Rotateservercertificate extends StandardParameters {
        /**
         * Required. Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Required. Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesRotateServerCertificateRequest;
    }
    export interface Params$Resource$Instances$Startreplica extends StandardParameters {
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Stopreplica extends StandardParameters {
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Switchover extends StandardParameters {
        /**
         * Optional. (MySQL and PostgreSQL only) Cloud SQL instance operations timeout, which is a sum of all database operations. Default value is 10 minutes and can be modified to a maximum value of 24 hours.
         */
        dbTimeout?: string;
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the replica.
         */
        project?: string;
    }
    export interface Params$Resource$Instances$Truncatelog extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the Cloud SQL project.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InstancesTruncateLogRequest;
    }
    export interface Params$Resource$Instances$Update extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DatabaseInstance;
    }
    export class Resource$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Cancels an instance operation that has been performed on an instance.
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
         * Retrieves an instance operation that has been performed on an instance.
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
         * Lists all instance operations that have been performed on the given Cloud SQL instance in the reverse chronological order of the start time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OperationsListResponse>>;
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$OperationsListResponse>, callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
        list(params: Params$Resource$Operations$List, callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
    }
    export interface Params$Resource$Operations$Cancel extends StandardParameters {
        /**
         * Instance operation ID.
         */
        operation?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * Instance operation ID.
         */
        operation?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Operations$List extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Maximum number of operations per response.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        instances: Resource$Projects$Instances;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get Disk Shrink Config for a given instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDiskShrinkConfig(params: Params$Resource$Projects$Instances$Getdiskshrinkconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDiskShrinkConfig(params?: Params$Resource$Projects$Instances$Getdiskshrinkconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesGetDiskShrinkConfigResponse>>;
        getDiskShrinkConfig(params: Params$Resource$Projects$Instances$Getdiskshrinkconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDiskShrinkConfig(params: Params$Resource$Projects$Instances$Getdiskshrinkconfig, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesGetDiskShrinkConfigResponse>, callback: BodyResponseCallback<Schema$SqlInstancesGetDiskShrinkConfigResponse>): void;
        getDiskShrinkConfig(params: Params$Resource$Projects$Instances$Getdiskshrinkconfig, callback: BodyResponseCallback<Schema$SqlInstancesGetDiskShrinkConfigResponse>): void;
        getDiskShrinkConfig(callback: BodyResponseCallback<Schema$SqlInstancesGetDiskShrinkConfigResponse>): void;
        /**
         * Get Latest Recovery Time for a given instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getLatestRecoveryTime(params: Params$Resource$Projects$Instances$Getlatestrecoverytime, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getLatestRecoveryTime(params?: Params$Resource$Projects$Instances$Getlatestrecoverytime, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesGetLatestRecoveryTimeResponse>>;
        getLatestRecoveryTime(params: Params$Resource$Projects$Instances$Getlatestrecoverytime, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getLatestRecoveryTime(params: Params$Resource$Projects$Instances$Getlatestrecoverytime, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesGetLatestRecoveryTimeResponse>, callback: BodyResponseCallback<Schema$SqlInstancesGetLatestRecoveryTimeResponse>): void;
        getLatestRecoveryTime(params: Params$Resource$Projects$Instances$Getlatestrecoverytime, callback: BodyResponseCallback<Schema$SqlInstancesGetLatestRecoveryTimeResponse>): void;
        getLatestRecoveryTime(callback: BodyResponseCallback<Schema$SqlInstancesGetLatestRecoveryTimeResponse>): void;
        /**
         * Perform Disk Shrink on primary instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        performDiskShrink(params: Params$Resource$Projects$Instances$Performdiskshrink, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        performDiskShrink(params?: Params$Resource$Projects$Instances$Performdiskshrink, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        performDiskShrink(params: Params$Resource$Projects$Instances$Performdiskshrink, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        performDiskShrink(params: Params$Resource$Projects$Instances$Performdiskshrink, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        performDiskShrink(params: Params$Resource$Projects$Instances$Performdiskshrink, callback: BodyResponseCallback<Schema$Operation>): void;
        performDiskShrink(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Reschedules the maintenance on the given instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rescheduleMaintenance(params?: Params$Resource$Projects$Instances$Reschedulemaintenance, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Reset Replica Size to primary instance disk size.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetReplicaSize(params: Params$Resource$Projects$Instances$Resetreplicasize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetReplicaSize(params?: Params$Resource$Projects$Instances$Resetreplicasize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resetReplicaSize(params: Params$Resource$Projects$Instances$Resetreplicasize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetReplicaSize(params: Params$Resource$Projects$Instances$Resetreplicasize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resetReplicaSize(params: Params$Resource$Projects$Instances$Resetreplicasize, callback: BodyResponseCallback<Schema$Operation>): void;
        resetReplicaSize(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Start External primary instance migration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startExternalSync(params?: Params$Resource$Projects$Instances$Startexternalsync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, callback: BodyResponseCallback<Schema$Operation>): void;
        startExternalSync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Verify External primary instance external sync settings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        verifyExternalSyncSettings(params?: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>>;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>, callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
        verifyExternalSyncSettings(callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
    }
    export interface Params$Resource$Projects$Instances$Getdiskshrinkconfig extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Projects$Instances$Getlatestrecoverytime extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Projects$Instances$Performdiskshrink extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PerformDiskShrinkContext;
    }
    export interface Params$Resource$Projects$Instances$Reschedulemaintenance extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SqlInstancesRescheduleMaintenanceRequestBody;
    }
    export interface Params$Resource$Projects$Instances$Resetreplicasize extends StandardParameters {
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SqlInstancesResetReplicaSizeRequest;
    }
    export interface Params$Resource$Projects$Instances$Startexternalsync extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SqlInstancesStartExternalSyncRequest;
    }
    export interface Params$Resource$Projects$Instances$Verifyexternalsyncsettings extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SqlInstancesVerifyExternalSyncSettingsRequest;
    }
    export class Resource$Sslcerts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createEphemeral(params?: Params$Resource$Sslcerts$Createephemeral, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCert>>;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: MethodOptions | BodyResponseCallback<Schema$SslCert>, callback: BodyResponseCallback<Schema$SslCert>): void;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, callback: BodyResponseCallback<Schema$SslCert>): void;
        createEphemeral(callback: BodyResponseCallback<Schema$SslCert>): void;
        /**
         * Deletes the SSL certificate. For First Generation instances, the certificate remains valid until the instance is restarted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Sslcerts$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Sslcerts$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Sslcerts$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Sslcerts$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Sslcerts$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a particular SSL certificate. Does not include the private key (required for usage). The private key must be saved from the response to initial creation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Sslcerts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sslcerts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCert>>;
        get(params: Params$Resource$Sslcerts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sslcerts$Get, options: MethodOptions | BodyResponseCallback<Schema$SslCert>, callback: BodyResponseCallback<Schema$SslCert>): void;
        get(params: Params$Resource$Sslcerts$Get, callback: BodyResponseCallback<Schema$SslCert>): void;
        get(callback: BodyResponseCallback<Schema$SslCert>): void;
        /**
         * Creates an SSL certificate and returns it along with the private key and server certificate authority. The new certificate will not be usable until the instance is restarted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Sslcerts$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Sslcerts$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCertsInsertResponse>>;
        insert(params: Params$Resource$Sslcerts$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Sslcerts$Insert, options: MethodOptions | BodyResponseCallback<Schema$SslCertsInsertResponse>, callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        insert(params: Params$Resource$Sslcerts$Insert, callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        insert(callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        /**
         * Lists all of the current SSL certificates for the instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Sslcerts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Sslcerts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCertsListResponse>>;
        list(params: Params$Resource$Sslcerts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Sslcerts$List, options: MethodOptions | BodyResponseCallback<Schema$SslCertsListResponse>, callback: BodyResponseCallback<Schema$SslCertsListResponse>): void;
        list(params: Params$Resource$Sslcerts$List, callback: BodyResponseCallback<Schema$SslCertsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$SslCertsListResponse>): void;
    }
    export interface Params$Resource$Sslcerts$Createephemeral extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the Cloud SQL project.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SslCertsCreateEphemeralRequest;
    }
    export interface Params$Resource$Sslcerts$Delete extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Sha1 FingerPrint.
         */
        sha1Fingerprint?: string;
    }
    export interface Params$Resource$Sslcerts$Get extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Sha1 FingerPrint.
         */
        sha1Fingerprint?: string;
    }
    export interface Params$Resource$Sslcerts$Insert extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SslCertsInsertRequest;
    }
    export interface Params$Resource$Sslcerts$List extends StandardParameters {
        /**
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export class Resource$Tiers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all available machine types (tiers) for Cloud SQL, for example, `db-custom-1-3840`. For related information, see [Pricing](/sql/pricing).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Tiers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Tiers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TiersListResponse>>;
        list(params: Params$Resource$Tiers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Tiers$List, options: MethodOptions | BodyResponseCallback<Schema$TiersListResponse>, callback: BodyResponseCallback<Schema$TiersListResponse>): void;
        list(params: Params$Resource$Tiers$List, callback: BodyResponseCallback<Schema$TiersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$TiersListResponse>): void;
    }
    export interface Params$Resource$Tiers$List extends StandardParameters {
        /**
         * Project ID of the project for which to list tiers.
         */
        project?: string;
    }
    export class Resource$Users {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a user from a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Users$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Users$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Users$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a resource containing information about a user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Users$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Users$Get, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        get(params: Params$Resource$Users$Get, callback: BodyResponseCallback<Schema$User>): void;
        get(callback: BodyResponseCallback<Schema$User>): void;
        /**
         * Creates a new user in a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Users$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Users$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Users$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists users in the specified Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Users$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UsersListResponse>>;
        list(params: Params$Resource$Users$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$List, options: MethodOptions | BodyResponseCallback<Schema$UsersListResponse>, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(params: Params$Resource$Users$List, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        /**
         * Updates an existing user in a Cloud SQL instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Users$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Users$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Users$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Users$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Users$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Users$Delete extends StandardParameters {
        /**
         * Host of the user in the instance.
         */
        host?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Name of the user in the instance.
         */
        name?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Users$Get extends StandardParameters {
        /**
         * Host of a user of the instance.
         */
        host?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * User of the instance.
         */
        name?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Users$Insert extends StandardParameters {
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export interface Params$Resource$Users$List extends StandardParameters {
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
    }
    export interface Params$Resource$Users$Update extends StandardParameters {
        /**
         * Optional. Host of the user in the instance.
         */
        host?: string;
        /**
         * Database instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Name of the user in the instance.
         */
        name?: string;
        /**
         * Project ID of the project that contains the instance.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export {};
}
