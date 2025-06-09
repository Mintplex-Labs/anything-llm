import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace sql_v1beta4 {
    export interface Options extends GlobalOptions {
        version: 'v1beta4';
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
     * Cloud SQL Admin API
     *
     * API for Cloud SQL database instance management
     *
     * @example
     * const {google} = require('googleapis');
     * const sql = google.sql('v1beta4');
     *
     * @namespace sql
     * @type {Function}
     * @version v1beta4
     * @variation v1beta4
     * @param {object=} options Options for Sql
     */
    export class Sql {
        context: APIRequestContext;
        backupRuns: Resource$Backupruns;
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
         * The time when this access control entry expires in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        expirationTime?: string | null;
        /**
         * This is always *sql#aclEntry*.
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
    }
    /**
     * Database instance backup configuration.
     */
    export interface Schema$BackupConfiguration {
        /**
         * (MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.
         */
        binaryLogEnabled?: boolean | null;
        /**
         * Whether this configuration is enabled.
         */
        enabled?: boolean | null;
        /**
         * This is always *sql#backupConfiguration*.
         */
        kind?: string | null;
        /**
         * Location of the backup
         */
        location?: string | null;
        /**
         * Reserved for future use.
         */
        pointInTimeRecoveryEnabled?: boolean | null;
        /**
         * Reserved for future use.
         */
        replicationLogArchivingEnabled?: boolean | null;
        /**
         * Start time for the daily backup configuration in UTC timezone in the 24 hour format - *HH:MM*.
         */
        startTime?: string | null;
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
         * The description of this run, only applicable to on-demand backups.
         */
        description?: string | null;
        /**
         * Encryption configuration specific to a backup. Applies only to Second Generation instances.
         */
        diskEncryptionConfiguration?: Schema$DiskEncryptionConfiguration;
        /**
         * Encryption status specific to a backup. Applies only to Second Generation instances.
         */
        diskEncryptionStatus?: Schema$DiskEncryptionStatus;
        /**
         * The time the backup operation completed in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        endTime?: string | null;
        /**
         * The time the run was enqueued in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
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
         * This is always *sql#backupRun*.
         */
        kind?: string | null;
        /**
         * Location of the backups.
         */
        location?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * The time the backup operation actually started in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        startTime?: string | null;
        /**
         * The status of this run.
         */
        status?: string | null;
        /**
         * The type of this run; can be either &quot;AUTOMATED&quot; or &quot;ON_DEMAND&quot;.
         */
        type?: string | null;
        /**
         * The start time of the backup window during which this the backup was attempted in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
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
         * This is always *sql#backupRunsList*.
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
         * This is always *sql#binLogCoordinates*.
         */
        kind?: string | null;
    }
    /**
     * Database instance clone context.
     */
    export interface Schema$CloneContext {
        /**
         * Binary log coordinates, if specified, identify the position up to which the source instance is cloned. If not specified, the source instance is cloned up to the most recent binary log coordinates.
         */
        binLogCoordinates?: Schema$BinLogCoordinates;
        /**
         * Name of the Cloud SQL instance to be created as a clone.
         */
        destinationInstanceName?: string | null;
        /**
         * This is always *sql#cloneContext*.
         */
        kind?: string | null;
        /**
         * Reserved for future use.
         */
        pitrTimestampMs?: string | null;
        /**
         * Reserved for future use.
         */
        pointInTime?: string | null;
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
         * This is always *sql#database*.
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
         * The name of the flag. These flags are passed at instance startup, so include both server options and system variables for MySQL. Flags are specified with underscores, not hyphens. For more information, see Configuring Database Flags in the Cloud SQL documentation.
         */
        name?: string | null;
        /**
         * The value of the flag. Booleans are set to *on* for true and *off* for false. This field must be omitted if the flag doesn&#39;t take a value.
         */
        value?: string | null;
    }
    /**
     * A Cloud SQL instance resource. Next field: 34
     */
    export interface Schema$DatabaseInstance {
        /**
         *  *SECOND_GEN*: Cloud SQL database instance. *EXTERNAL*: A database server that is not managed by Google. This property is read-only; use the *tier* property in the *settings* object to determine the database type.
         */
        backendType?: string | null;
        /**
         * Connection name of the Cloud SQL instance used in connection strings.
         */
        connectionName?: string | null;
        /**
         * The current disk usage of the instance in bytes. This property has been deprecated. Use the &quot;cloudsql.googleapis.com/database/disk/bytes_used&quot; metric in Cloud Monitoring API instead. Please see this announcement for details.
         */
        currentDiskSize?: string | null;
        /**
         * The database engine type and version. The *databaseVersion* field cannot be changed after instance creation. MySQL instances: *MYSQL_5_7* (default), or *MYSQL_5_6*. PostgreSQL instances: *POSTGRES_9_6*, *POSTGRES_10*, *POSTGRES_11* or *POSTGRES_12* (default). SQL Server instances: *SQLSERVER_2017_STANDARD* (default), *SQLSERVER_2017_ENTERPRISE*, *SQLSERVER_2017_EXPRESS*, or *SQLSERVER_2017_WEB*.
         */
        databaseVersion?: string | null;
        /**
         * Disk encryption configuration specific to an instance. Applies only to Second Generation instances.
         */
        diskEncryptionConfiguration?: Schema$DiskEncryptionConfiguration;
        /**
         * Disk encryption status specific to an instance. Applies only to Second Generation instances.
         */
        diskEncryptionStatus?: Schema$DiskEncryptionStatus;
        /**
         * This field is deprecated and will be removed from a future version of the API. Use the *settings.settingsVersion* field instead.
         */
        etag?: string | null;
        /**
         * The name and status of the failover replica. This property is applicable only to Second Generation instances.
         */
        failoverReplica?: {
            available?: boolean;
            name?: string;
        } | null;
        /**
         * The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone.
         */
        gceZone?: string | null;
        /**
         * The instance type. This can be one of the following. *CLOUD_SQL_INSTANCE*: A Cloud SQL instance that is not replicating from a master. *ON_PREMISES_INSTANCE*: An instance running on the customer&#39;s premises. *READ_REPLICA_INSTANCE*: A Cloud SQL instance configured as a read-replica.
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
         * This is always *sql#instance*.
         */
        kind?: string | null;
        /**
         * The name of the instance which will act as master in the replication setup.
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
         * Configuration specific to on-premises instances.
         */
        onPremisesConfiguration?: Schema$OnPremisesConfiguration;
        /**
         * The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.
         */
        project?: string | null;
        /**
         * The geographical region. Can be *us-central* (*FIRST_GEN* instances only) *us-central1* (*SECOND_GEN* instances only) *asia-east1* or *europe-west1*. Defaults to *us-central* or *us-central1* depending on the instance type. The region cannot be changed after instance creation.
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
         * Initial root password. Use only on creation.
         */
        rootPassword?: string | null;
        /**
         * The start time of any upcoming scheduled maintenance for this instance.
         */
        scheduledMaintenance?: Schema$SqlScheduledMaintenance;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * SSL configuration.
         */
        serverCaCert?: Schema$SslCert;
        /**
         * The service account email address assigned to the instance. This property is applicable only to Second Generation instances.
         */
        serviceAccountEmailAddress?: string | null;
        /**
         * The user settings.
         */
        settings?: Schema$Settings;
        /**
         * The current serving state of the Cloud SQL instance. This can be one of the following. *RUNNABLE*: The instance is running, or is ready to run when accessed. *SUSPENDED*: The instance is not available, for example due to problems with billing. *PENDING_CREATE*: The instance is being created. *MAINTENANCE*: The instance is down for maintenance. *FAILED*: The instance creation failed. *UNKNOWN_STATE*: The state of the instance is unknown.
         */
        state?: string | null;
        /**
         * If the instance state is SUSPENDED, the reason for the suspension.
         */
        suspensionReason?: string[] | null;
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
         * This is always *sql#databasesList*.
         */
        kind?: string | null;
    }
    /**
     * Read-replica configuration for connecting to the on-premises master.
     */
    export interface Schema$DemoteMasterConfiguration {
        /**
         * This is always *sql#demoteMasterConfiguration*.
         */
        kind?: string | null;
        /**
         * MySQL specific configuration when replicating from a MySQL on-premises master. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named *master.info* in the data directory.
         */
        mysqlReplicaConfiguration?: Schema$DemoteMasterMySqlReplicaConfiguration;
    }
    /**
     * Database instance demote master context.
     */
    export interface Schema$DemoteMasterContext {
        /**
         * This is always *sql#demoteMasterContext*.
         */
        kind?: string | null;
        /**
         * The name of the instance which will act as on-premises master in the replication setup.
         */
        masterInstanceName?: string | null;
        /**
         * Configuration specific to read-replicas replicating from the on-premises master.
         */
        replicaConfiguration?: Schema$DemoteMasterConfiguration;
        /**
         * Verify GTID consistency for demote operation. Default value: *True*. Second Generation instances only. Setting this flag to false enables you to bypass GTID consistency check between on-premises master and Cloud SQL instance during the demotion operation but also exposes you to the risk of future replication failures. Change the value only if you know the reason for the GTID divergence and are confident that doing so will not cause any replication issues.
         */
        verifyGtidConsistency?: boolean | null;
    }
    /**
     * Read-replica configuration specific to MySQL databases.
     */
    export interface Schema$DemoteMasterMySqlReplicaConfiguration {
        /**
         * PEM representation of the trusted CA&#39;s x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s private key. The corresponsing public key is encoded in the client&#39;s certificate. The format of the replica&#39;s private key can be either PKCS #1 or PKCS #8.
         */
        clientKey?: string | null;
        /**
         * This is always *sql#demoteMasterMysqlReplicaConfiguration*.
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
     * Disk encryption configuration for an instance.
     */
    export interface Schema$DiskEncryptionConfiguration {
        /**
         * This is always *sql#diskEncryptionConfiguration*.
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
         * This is always *sql#diskEncryptionStatus*.
         */
        kind?: string | null;
        /**
         * KMS key version used to encrypt the Cloud SQL instance resource
         */
        kmsKeyVersionName?: string | null;
    }
    /**
     * Database instance export context.
     */
    export interface Schema$ExportContext {
        /**
         * Options for exporting data as CSV.
         */
        csvExportOptions?: {
            selectQuery?: string;
        } | null;
        /**
         * Databases to be exported. *MySQL instances:* If *fileType* is *SQL* and no database is specified, all databases are exported, except for the *mysql* system database. If *fileType* is *CSV*, you can specify one database, either by using this property or by using the *csvExportOptions.selectQuery* property, which takes precedence over this property. *PostgreSQL instances:* You must specify one database to be exported. If *fileType* is *CSV*, this database must match the one specified in the *csvExportOptions.selectQuery* property.
         */
        databases?: string[] | null;
        /**
         * The file type for the specified uri. *SQL*: The file contains SQL statements. *CSV*: The file contains CSV data.
         */
        fileType?: string | null;
        /**
         * This is always *sql#exportContext*.
         */
        kind?: string | null;
        /**
         * Option for export offload.
         */
        offload?: boolean | null;
        /**
         * Options for exporting data as SQL statements.
         */
        sqlExportOptions?: {
            mysqlExportOptions?: {
                masterData?: number;
            };
            schemaOnly?: boolean;
            tables?: string[];
        } | null;
        /**
         * The path to the file in Google Cloud Storage where the export will be stored. The URI is in the form *gs: //bucketName/fileName*. If the file already exists, the requests // succeeds, but the operation fails. If *fileType* is // *SQL* and the filename ends with .gz, the contents are // compressed.
         */
        uri?: string | null;
    }
    /**
     * Database instance failover context.
     */
    export interface Schema$FailoverContext {
        /**
         * This is always *sql#failoverContext*.
         */
        kind?: string | null;
        /**
         * The current settings version of this instance. Request will be rejected if this version doesn&#39;t match the current settings version.
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
         * For *STRING* flags, a list of strings that the value can be set to.
         */
        allowedStringValues?: string[] | null;
        /**
         * The database version this flag applies to. Can be *MYSQL_5_5*, *MYSQL_5_6*, or *MYSQL_5_7*. *MYSQL_5_7* is applicable only to Second Generation instances.
         */
        appliesTo?: string[] | null;
        /**
         * Whether or not the flag is considered in beta.
         */
        inBeta?: boolean | null;
        /**
         * This is always *sql#flag*.
         */
        kind?: string | null;
        /**
         * For *INTEGER* flags, the maximum allowed value.
         */
        maxValue?: string | null;
        /**
         * For *INTEGER* flags, the minimum allowed value.
         */
        minValue?: string | null;
        /**
         * This is the name of the flag. Flag names always use underscores, not hyphens, for example: *max_allowed_packet*
         */
        name?: string | null;
        /**
         * Indicates whether changing this flag will trigger a database restart. Only applicable to Second Generation instances.
         */
        requiresRestart?: boolean | null;
        /**
         * The type of the flag. Flags are typed to being *BOOLEAN*, *STRING*, *INTEGER* or *NONE*. *NONE* is used for flags which do not take a value, such as *skip_grant_tables*.
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
         * This is always *sql#flagsList*.
         */
        kind?: string | null;
    }
    /**
     * Database instance import context.
     */
    export interface Schema$ImportContext {
        /**
         * Import parameters specific to SQL Server .BAK files
         */
        bakImportOptions?: {
            encryptionOptions?: {
                certPath?: string;
                pvkPassword?: string;
                pvkPath?: string;
            };
        } | null;
        /**
         * Options for importing data as CSV.
         */
        csvImportOptions?: {
            columns?: string[];
            table?: string;
        } | null;
        /**
         * The target database for the import. If *fileType* is *SQL*, this field is required only if the import file does not specify a database, and is overridden by any database specification in the import file. If *fileType* is *CSV*, one database must be specified.
         */
        database?: string | null;
        /**
         * The file type for the specified uri. *SQL*: The file contains SQL statements. *CSV*: The file contains CSV data.
         */
        fileType?: string | null;
        /**
         * The PostgreSQL user for this import operation. PostgreSQL instances only.
         */
        importUser?: string | null;
        /**
         * This is always *sql#importContext*.
         */
        kind?: string | null;
        /**
         * Path to the import file in Cloud Storage, in the form *gs: //bucketName/fileName*. Compressed gzip files (.gz) are supported // when *fileType* is *SQL*. The instance must have // write permissions to the bucket and read access to the file.
         */
        uri?: string | null;
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
     * Database demote master request.
     */
    export interface Schema$InstancesDemoteMasterRequest {
        /**
         * Contains details about the demoteMaster operation.
         */
        demoteMasterContext?: Schema$DemoteMasterContext;
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
         * This is always *sql#instancesList*.
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
         * This is always *sql#instancesListServerCas*.
         */
        kind?: string | null;
    }
    /**
     * Database instance restore backup request.
     */
    export interface Schema$InstancesRestoreBackupRequest {
        /**
         * Parameters required to perform the restore backup operation.
         */
        restoreBackupContext?: Schema$RestoreBackupContext;
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
     * Instance truncate log request.
     */
    export interface Schema$InstancesTruncateLogRequest {
        /**
         * Contains details about the truncate log operation.
         */
        truncateLogContext?: Schema$TruncateLogContext;
    }
    /**
     * IP Management configuration.
     */
    export interface Schema$IpConfiguration {
        /**
         * The list of external networks that are allowed to connect to the instance using the IP. In &#39;CIDR&#39; notation, also known as &#39;slash&#39; notation (for example: *192.168.100.0/24*).
         */
        authorizedNetworks?: Schema$AclEntry[];
        /**
         * Whether the instance is assigned a public IP address or not.
         */
        ipv4Enabled?: boolean | null;
        /**
         * The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, x/projects/myProject/global/networks/default*. This setting can be updated, but it cannot be removed after it is set.
         */
        privateNetwork?: string | null;
        /**
         * Whether SSL connections over IP are enforced or not.
         */
        requireSsl?: boolean | null;
    }
    /**
     * Database instance IP Mapping.
     */
    export interface Schema$IpMapping {
        /**
         * The IP address assigned.
         */
        ipAddress?: string | null;
        /**
         * The due time for this IP to be retired in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*. This field is only available when the IP is scheduled to be retired.
         */
        timeToRetire?: string | null;
        /**
         * The type of this IP address. A *PRIMARY* address is a public address that can accept incoming connections. A *PRIVATE* address is a private address that can accept incoming connections. An *OUTGOING* address is the source address of connections originating from the instance, if supported.
         */
        type?: string | null;
    }
    /**
     * Preferred location. This specifies where a Cloud SQL instance is located, either in a specific Compute Engine zone, or co-located with an App Engine application. Note that if the preferred location is not available, the instance will be located as close as possible within the region. Only one location may be specified.
     */
    export interface Schema$LocationPreference {
        /**
         * The App Engine application to follow, it must be in the same region as the Cloud SQL instance.
         */
        followGaeApplication?: string | null;
        /**
         * This is always *sql#locationPreference*.
         */
        kind?: string | null;
        /**
         * The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.).
         */
        zone?: string | null;
    }
    /**
     * Maintenance window. This specifies when a Cloud SQL instance is restarted for system maintenance purposes.
     */
    export interface Schema$MaintenanceWindow {
        /**
         * day of week (1-7), starting on Monday.
         */
        day?: number | null;
        /**
         * hour of day - 0 to 23.
         */
        hour?: number | null;
        /**
         * This is always *sql#maintenanceWindow*.
         */
        kind?: string | null;
        /**
         * Maintenance timing setting: *canary* (Earlier) or *stable* (Later). Learn more.
         */
        updateTrack?: string | null;
    }
    /**
     * Read-replica configuration specific to MySQL databases.
     */
    export interface Schema$MySqlReplicaConfiguration {
        /**
         * PEM representation of the trusted CA&#39;s x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s private key. The corresponsing public key is encoded in the client&#39;s certificate.
         */
        clientKey?: string | null;
        /**
         * Seconds to wait between connect retries. MySQL&#39;s default is 60 seconds.
         */
        connectRetryInterval?: number | null;
        /**
         * Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.
         */
        dumpFilePath?: string | null;
        /**
         * This is always *sql#mysqlReplicaConfiguration*.
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
         * Whether or not to check the master&#39;s Common Name value in the certificate that it sends during the SSL handshake.
         */
        verifyServerCertificate?: boolean | null;
    }
    /**
     * On-premises instance configuration.
     */
    export interface Schema$OnPremisesConfiguration {
        /**
         * PEM representation of the trusted CA&#39;s x509 certificate.
         */
        caCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s x509 certificate.
         */
        clientCertificate?: string | null;
        /**
         * PEM representation of the replica&#39;s private key. The corresponsing public key is encoded in the client&#39;s certificate.
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
         * This is always *sql#onPremisesConfiguration*.
         */
        kind?: string | null;
        /**
         * The password for connecting to on-premises instance.
         */
        password?: string | null;
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
         * The time this operation finished in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
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
         * The time this operation was enqueued in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        insertTime?: string | null;
        /**
         * This is always *sql#operation*.
         */
        kind?: string | null;
        /**
         * An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
         */
        name?: string | null;
        /**
         * The type of the operation. Valid values are: *CREATE* *DELETE* *UPDATE* *RESTART* *IMPORT* *EXPORT* *BACKUP_VOLUME* *RESTORE_VOLUME* *CREATE_USER* *DELETE_USER* *CREATE_DATABASE* *DELETE_DATABASE*
         */
        operationType?: string | null;
        /**
         * The URI of this resource.
         */
        selfLink?: string | null;
        /**
         * The time this operation actually started in UTC timezone in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        startTime?: string | null;
        /**
         * The status of an operation. Valid values are: *PENDING* *RUNNING* *DONE* *SQL_OPERATION_STATUS_UNSPECIFIED*
         */
        status?: string | null;
        /**
         * Name of the database instance related to this operation.
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
         * This is always *sql#operationError*.
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
         * This is always *sql#operationErrors*.
         */
        kind?: string | null;
    }
    /**
     * Database instance list operations response.
     */
    export interface Schema$OperationsListResponse {
        /**
         * List of operation resources.
         */
        items?: Schema$Operation[];
        /**
         * This is always *sql#operationsList*.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Read-replica configuration for connecting to the master.
     */
    export interface Schema$ReplicaConfiguration {
        /**
         * Specifies if the replica is the failover target. If the field is set to *true* the replica will be designated as a failover replica. In case the master instance fails, the replica instance will be promoted as the new master instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the master instance.
         */
        failoverTarget?: boolean | null;
        /**
         * This is always *sql#replicaConfiguration*.
         */
        kind?: string | null;
        /**
         * MySQL specific configuration when replicating from a MySQL on-premises master. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named *master.info* in the data directory.
         */
        mysqlReplicaConfiguration?: Schema$MySqlReplicaConfiguration;
    }
    export interface Schema$Reschedule {
        /**
         * Required. The type of the reschedule.
         */
        rescheduleType?: string | null;
        /**
         * Optional. Timestamp when the maintenance shall be rescheduled to if reschedule_type=SPECIFIC_TIME, in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
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
         * This is always *sql#restoreBackupContext*.
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
         * This is always *sql#rotateServerCaContext*.
         */
        kind?: string | null;
        /**
         * The fingerprint of the next version to be rotated to. If left unspecified, will be rotated to the most recently added server CA version.
         */
        nextVersion?: string | null;
    }
    /**
     * Database instance settings.
     */
    export interface Schema$Settings {
        /**
         * The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: *ALWAYS*: The instance is on, and remains so even in the absence of connection requests. *NEVER*: The instance is off; it is not activated, even if a connection request arrives.
         */
        activationPolicy?: string | null;
        /**
         * The App Engine app IDs that can access this instance. (Deprecated) Applied to First Generation instances only.
         */
        authorizedGaeApplications?: string[] | null;
        /**
         * Availability type. Potential values: *ZONAL*: The instance serves data from only one zone. Outages in that zone affect data accessibility. *REGIONAL*: The instance can serve data from more than one zone in a region (it is highly available). For more information, see Overview of the High Availability Configuration.
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
         * Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.
         */
        crashSafeReplicationEnabled?: boolean | null;
        /**
         * The database flags passed to the instance at startup.
         */
        databaseFlags?: Schema$DatabaseFlags[];
        /**
         * Configuration specific to read replica instances. Indicates whether replication is enabled or not.
         */
        databaseReplicationEnabled?: boolean | null;
        /**
         * The size of data disk, in GB. The data disk size minimum is 10GB.
         */
        dataDiskSizeGb?: string | null;
        /**
         * The type of data disk: PD_SSD (default) or PD_HDD. Not used for First Generation instances.
         */
        dataDiskType?: string | null;
        /**
         * The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled for Second Generation instances.
         */
        ipConfiguration?: Schema$IpConfiguration;
        /**
         * This is always *sql#settings*.
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
         * The pricing plan for this instance. This can be either *PER_USE* or *PACKAGE*. Only *PER_USE* is supported for Second Generation instances.
         */
        pricingPlan?: string | null;
        /**
         * The type of replication this instance uses. This can be either *ASYNCHRONOUS* or *SYNCHRONOUS*. (Deprecated_ This property was only applicable to First Generation instances.
         */
        replicationType?: string | null;
        /**
         * The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.
         */
        settingsVersion?: string | null;
        /**
         * Configuration to increase storage size automatically. The default value is true.
         */
        storageAutoResize?: boolean | null;
        /**
         * The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.
         */
        storageAutoResizeLimit?: string | null;
        /**
         * The tier (or machine type) for this instance, for example *db-n1-standard-1* (MySQL instances) or *db-custom-1-3840* (PostgreSQL instances).
         */
        tier?: string | null;
        /**
         * User-provided labels, represented as a dictionary where each label is a single key value pair.
         */
        userLabels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * External master migration setting error.
     */
    export interface Schema$SqlExternalSyncSettingError {
        /**
         * Additional information about the error encountered.
         */
        detail?: string | null;
        /**
         * This is always *sql#migrationSettingError*.
         */
        kind?: string | null;
        /**
         * Identifies the specific error that occurred.
         */
        type?: string | null;
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
     * Instance verify external sync settings response.
     */
    export interface Schema$SqlInstancesVerifyExternalSyncSettingsResponse {
        /**
         * List of migration violations.
         */
        errors?: Schema$SqlExternalSyncSettingError[];
        /**
         * This is always *sql#migrationSettingErrorList*.
         */
        kind?: string | null;
    }
    /**
     * Any scheduled maintenancce for this instance.
     */
    export interface Schema$SqlScheduledMaintenance {
        canDefer?: boolean | null;
        /**
         * If the scheduled maintenance can be rescheduled.
         */
        canReschedule?: boolean | null;
        /**
         * The start time of any upcoming scheduled maintenance for this instance.
         */
        startTime?: string | null;
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
         * The time when the certificate was created in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*
         */
        createTime?: string | null;
        /**
         * The time when the certificate expires in RFC 3339 format, for example *2012-11-15T16:19:00.094Z*.
         */
        expirationTime?: string | null;
        /**
         * Name of the database instance.
         */
        instance?: string | null;
        /**
         * This is always *sql#sslCert*.
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
         * This is always *sql#sslCertsInsert*.
         */
        kind?: string | null;
        /**
         * The operation to track the ssl certs insert request.
         */
        operation?: Schema$Operation;
        /**
         * The server Certificate Authority&#39;s certificate. If this is missing you can force a new one to be generated by calling resetSslConfig method on instances resource.
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
         * This is always *sql#sslCertsList*.
         */
        kind?: string | null;
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
         * This is always *sql#tier*.
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
         * An identifier for the machine type, for example, db-n1-standard-1. For related information, see Pricing.
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
         * This is always *sql#tiersList*.
         */
        kind?: string | null;
    }
    /**
     * Database Instance truncate log context.
     */
    export interface Schema$TruncateLogContext {
        /**
         * This is always *sql#truncateLogContext*.
         */
        kind?: string | null;
        /**
         * The type of log to truncate. Valid values are *MYSQL_GENERAL_TABLE* and *MYSQL_SLOW_TABLE*.
         */
        logType?: string | null;
    }
    /**
     * A Cloud SQL user resource.
     */
    export interface Schema$User {
        /**
         * This field is deprecated and will be removed from a future version of the API.
         */
        etag?: string | null;
        /**
         * The host name from which the user can connect. For *insert* operations, host defaults to an empty string. For *update* operations, host is specified as part of the request URL. The host name cannot be updated after insertion.
         */
        host?: string | null;
        /**
         * The name of the Cloud SQL instance. This does not include the project ID. Can be omitted for *update* since it is already specified on the URL.
         */
        instance?: string | null;
        /**
         * This is always *sql#user*.
         */
        kind?: string | null;
        /**
         * The name of the user in the Cloud SQL instance. Can be omitted for *update* since it is already specified in the URL.
         */
        name?: string | null;
        /**
         * The password for the user.
         */
        password?: string | null;
        /**
         * The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable. Can be omitted for *update* since it is already specified on the URL.
         */
        project?: string | null;
        sqlserverUserDetails?: Schema$SqlServerUserDetails;
        /**
         * The user type. It determines the method to authenticate the user during login. The default is the database&#39;s built-in user type.
         */
        type?: string | null;
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
         * An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
         */
        nextPageToken?: string | null;
    }
    export class Resource$Backupruns {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * sql.backupRuns.delete
         * @desc Deletes the backup taken by a backup run.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.backupRuns.delete({
         *     // The ID of the Backup Run to delete. To find a Backup Run ID, use the list method.
         *     id: 'placeholder-value',
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.backupRuns.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.id The ID of the Backup Run to delete. To find a Backup Run ID, use the list method.
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Backupruns$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Backupruns$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Backupruns$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Backupruns$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Backupruns$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.backupRuns.get
         * @desc Retrieves a resource containing information about a backup run.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.backupRuns.get({
         *     // The ID of this Backup Run.
         *     id: 'placeholder-value',
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "backupKind": "my_backupKind",
         *   //   "description": "my_description",
         *   //   "diskEncryptionConfiguration": {},
         *   //   "diskEncryptionStatus": {},
         *   //   "endTime": "my_endTime",
         *   //   "enqueuedTime": "my_enqueuedTime",
         *   //   "error": {},
         *   //   "id": "my_id",
         *   //   "instance": "my_instance",
         *   //   "kind": "my_kind",
         *   //   "location": "my_location",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "type": "my_type",
         *   //   "windowStartTime": "my_windowStartTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.backupRuns.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.id The ID of this Backup Run.
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Backupruns$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Backupruns$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupRun>>;
        get(params: Params$Resource$Backupruns$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Backupruns$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupRun>, callback: BodyResponseCallback<Schema$BackupRun>): void;
        get(params: Params$Resource$Backupruns$Get, callback: BodyResponseCallback<Schema$BackupRun>): void;
        get(callback: BodyResponseCallback<Schema$BackupRun>): void;
        /**
         * sql.backupRuns.insert
         * @desc Creates a new backup run on demand. This method is applicable only to Second Generation instances.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.backupRuns.insert({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "backupKind": "my_backupKind",
         *       //   "description": "my_description",
         *       //   "diskEncryptionConfiguration": {},
         *       //   "diskEncryptionStatus": {},
         *       //   "endTime": "my_endTime",
         *       //   "enqueuedTime": "my_enqueuedTime",
         *       //   "error": {},
         *       //   "id": "my_id",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "location": "my_location",
         *       //   "selfLink": "my_selfLink",
         *       //   "startTime": "my_startTime",
         *       //   "status": "my_status",
         *       //   "type": "my_type",
         *       //   "windowStartTime": "my_windowStartTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.backupRuns.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().BackupRun} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Backupruns$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Backupruns$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Backupruns$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Backupruns$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Backupruns$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.backupRuns.list
         * @desc Lists all backup runs associated with a given instance and configuration in the reverse chronological order of the backup initiation time.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.backupRuns.list({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Maximum number of backup runs per response.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.backupRuns.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {integer=} params.maxResults Maximum number of backup runs per response.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * The ID of the Backup Run to delete. To find a Backup Run ID, use the list method.
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
         * The ID of this Backup Run.
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
         * Cloud SQL instance ID. This does not include the project ID.
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
    export class Resource$Databases {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * sql.databases.delete
         * @desc Deletes a database from a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.delete({
         *     // Name of the database to be deleted in the instance.
         *     database: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.database Name of the database to be deleted in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Databases$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Databases$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Databases$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Databases$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Databases$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.databases.get
         * @desc Retrieves a resource containing information about a database inside a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.get({
         *     // Name of the database in the instance.
         *     database: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "charset": "my_charset",
         *   //   "collation": "my_collation",
         *   //   "etag": "my_etag",
         *   //   "instance": "my_instance",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "project": "my_project",
         *   //   "selfLink": "my_selfLink",
         *   //   "sqlserverDatabaseDetails": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.database Name of the database in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Databases$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Databases$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Database>>;
        get(params: Params$Resource$Databases$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Databases$Get, options: MethodOptions | BodyResponseCallback<Schema$Database>, callback: BodyResponseCallback<Schema$Database>): void;
        get(params: Params$Resource$Databases$Get, callback: BodyResponseCallback<Schema$Database>): void;
        get(callback: BodyResponseCallback<Schema$Database>): void;
        /**
         * sql.databases.insert
         * @desc Inserts a resource containing information about a database inside a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.insert({
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "charset": "my_charset",
         *       //   "collation": "my_collation",
         *       //   "etag": "my_etag",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "project": "my_project",
         *       //   "selfLink": "my_selfLink",
         *       //   "sqlserverDatabaseDetails": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().Database} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Databases$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Databases$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Databases$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Databases$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Databases$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.databases.list
         * @desc Lists databases in the specified Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.list({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Databases$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Databases$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DatabasesListResponse>>;
        list(params: Params$Resource$Databases$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Databases$List, options: MethodOptions | BodyResponseCallback<Schema$DatabasesListResponse>, callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        list(params: Params$Resource$Databases$List, callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$DatabasesListResponse>): void;
        /**
         * sql.databases.patch
         * @desc Partially updates a resource containing information about a database inside a Cloud SQL instance. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.patch({
         *     // Name of the database to be updated in the instance.
         *     database: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "charset": "my_charset",
         *       //   "collation": "my_collation",
         *       //   "etag": "my_etag",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "project": "my_project",
         *       //   "selfLink": "my_selfLink",
         *       //   "sqlserverDatabaseDetails": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.database Name of the database to be updated in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().Database} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Databases$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Databases$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Databases$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Databases$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Databases$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.databases.update
         * @desc Updates a resource containing information about a database inside a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.databases.update({
         *     // Name of the database to be updated in the instance.
         *     database: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "charset": "my_charset",
         *       //   "collation": "my_collation",
         *       //   "etag": "my_etag",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "project": "my_project",
         *       //   "selfLink": "my_selfLink",
         *       //   "sqlserverDatabaseDetails": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.databases.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.database Name of the database to be updated in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().Database} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * sql.flags.list
         * @desc List all available database flags for Cloud SQL instances.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.flags.list({
         *     // Database type and version you want to retrieve flags for. By default, this method returns flags for all database types and versions.
         *     databaseVersion: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.flags.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.databaseVersion Database type and version you want to retrieve flags for. By default, this method returns flags for all database types and versions.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
    }
    export class Resource$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * sql.instances.addServerCa
         * @desc Add a new trusted Certificate Authority (CA) version for the specified instance. Required to prepare for a certificate rotation. If a CA version was previously added but never used in a certificate rotation, this operation replaces that version. There cannot be more than one CA version waiting to be rotated in.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.addServerCa({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.addServerCa
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        addServerCa(params: Params$Resource$Instances$Addserverca, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addServerCa(params?: Params$Resource$Instances$Addserverca, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        addServerCa(params: Params$Resource$Instances$Addserverca, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addServerCa(params: Params$Resource$Instances$Addserverca, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCa(params: Params$Resource$Instances$Addserverca, callback: BodyResponseCallback<Schema$Operation>): void;
        addServerCa(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.clone
         * @desc Creates a Cloud SQL instance as a clone of the source instance. Using this operation might cause your instance to restart.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.clone({
         *     // The ID of the Cloud SQL instance to be cloned (source). This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the source as well as the clone Cloud SQL instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cloneContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.clone
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance The ID of the Cloud SQL instance to be cloned (source). This does not include the project ID.
         * @param {string} params.project Project ID of the source as well as the clone Cloud SQL instance.
         * @param {().InstancesCloneRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        clone(params: Params$Resource$Instances$Clone, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        clone(params?: Params$Resource$Instances$Clone, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        clone(params: Params$Resource$Instances$Clone, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        clone(params: Params$Resource$Instances$Clone, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        clone(params: Params$Resource$Instances$Clone, callback: BodyResponseCallback<Schema$Operation>): void;
        clone(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.delete
         * @desc Deletes a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.delete({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance to be deleted.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance to be deleted.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Instances$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.demoteMaster
         * @desc Demotes the stand-alone instance to be a Cloud SQL read replica for an external database server.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.demoteMaster({
         *     // Cloud SQL instance name.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "demoteMasterContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.demoteMaster
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance name.
         * @param {string} params.project ID of the project that contains the instance.
         * @param {().InstancesDemoteMasterRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        demoteMaster(params?: Params$Resource$Instances$Demotemaster, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        demoteMaster(params: Params$Resource$Instances$Demotemaster, callback: BodyResponseCallback<Schema$Operation>): void;
        demoteMaster(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.export
         * @desc Exports data from a Cloud SQL instance to a Cloud Storage bucket as a SQL dump or CSV file.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
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
         *   const res = await sql.instances.export({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance to be exported.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "exportContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.export
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance to be exported.
         * @param {().InstancesExportRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        export(params: Params$Resource$Instances$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Instances$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Instances$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Instances$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Instances$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.failover
         * @desc Failover the instance to its failover replica instance. Using this operation might cause your instance to restart.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.failover({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the read replica.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "failoverContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.failover
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project ID of the project that contains the read replica.
         * @param {().InstancesFailoverRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        failover(params: Params$Resource$Instances$Failover, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        failover(params?: Params$Resource$Instances$Failover, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        failover(params: Params$Resource$Instances$Failover, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        failover(params: Params$Resource$Instances$Failover, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(params: Params$Resource$Instances$Failover, callback: BodyResponseCallback<Schema$Operation>): void;
        failover(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.get
         * @desc Retrieves a resource containing information about a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.get({
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "backendType": "my_backendType",
         *   //   "connectionName": "my_connectionName",
         *   //   "currentDiskSize": "my_currentDiskSize",
         *   //   "databaseVersion": "my_databaseVersion",
         *   //   "diskEncryptionConfiguration": {},
         *   //   "diskEncryptionStatus": {},
         *   //   "etag": "my_etag",
         *   //   "failoverReplica": {},
         *   //   "gceZone": "my_gceZone",
         *   //   "instanceType": "my_instanceType",
         *   //   "ipAddresses": [],
         *   //   "ipv6Address": "my_ipv6Address",
         *   //   "kind": "my_kind",
         *   //   "masterInstanceName": "my_masterInstanceName",
         *   //   "maxDiskSize": "my_maxDiskSize",
         *   //   "name": "my_name",
         *   //   "onPremisesConfiguration": {},
         *   //   "project": "my_project",
         *   //   "region": "my_region",
         *   //   "replicaConfiguration": {},
         *   //   "replicaNames": [],
         *   //   "rootPassword": "my_rootPassword",
         *   //   "scheduledMaintenance": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "serverCaCert": {},
         *   //   "serviceAccountEmailAddress": "my_serviceAccountEmailAddress",
         *   //   "settings": {},
         *   //   "state": "my_state",
         *   //   "suspensionReason": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DatabaseInstance>>;
        get(params: Params$Resource$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$DatabaseInstance>, callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        get(params: Params$Resource$Instances$Get, callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        get(callback: BodyResponseCallback<Schema$DatabaseInstance>): void;
        /**
         * sql.instances.import
         * @desc Imports data into a Cloud SQL instance from a SQL dump or CSV file in Cloud Storage.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
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
         *   const res = await sql.instances.import({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "importContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.import
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().InstancesImportRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        import(params: Params$Resource$Instances$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Instances$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Instances$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Instances$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Instances$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.insert
         * @desc Creates a new Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.insert({
         *     // Project ID of the project to which the newly created Cloud SQL instances should belong.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "backendType": "my_backendType",
         *       //   "connectionName": "my_connectionName",
         *       //   "currentDiskSize": "my_currentDiskSize",
         *       //   "databaseVersion": "my_databaseVersion",
         *       //   "diskEncryptionConfiguration": {},
         *       //   "diskEncryptionStatus": {},
         *       //   "etag": "my_etag",
         *       //   "failoverReplica": {},
         *       //   "gceZone": "my_gceZone",
         *       //   "instanceType": "my_instanceType",
         *       //   "ipAddresses": [],
         *       //   "ipv6Address": "my_ipv6Address",
         *       //   "kind": "my_kind",
         *       //   "masterInstanceName": "my_masterInstanceName",
         *       //   "maxDiskSize": "my_maxDiskSize",
         *       //   "name": "my_name",
         *       //   "onPremisesConfiguration": {},
         *       //   "project": "my_project",
         *       //   "region": "my_region",
         *       //   "replicaConfiguration": {},
         *       //   "replicaNames": [],
         *       //   "rootPassword": "my_rootPassword",
         *       //   "scheduledMaintenance": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "serverCaCert": {},
         *       //   "serviceAccountEmailAddress": "my_serviceAccountEmailAddress",
         *       //   "settings": {},
         *       //   "state": "my_state",
         *       //   "suspensionReason": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.project Project ID of the project to which the newly created Cloud SQL instances should belong.
         * @param {().DatabaseInstance} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Instances$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Instances$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Instances$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Instances$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Instances$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.list
         * @desc Lists instances under a given project.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.list({
         *     // A filter expression that filters resources listed in the response. The expression is in the form of field:value. For example, 'instanceType:CLOUD_SQL_INSTANCE'. Fields can be nested as needed as per their JSON representation, such as 'settings.userLabels.auto_start:true'. Multiple filter queries are space-separated. For example. 'state:RUNNABLE instanceType:CLOUD_SQL_INSTANCE'. By default, each expression is an AND expression. However, you can include AND and OR expressions explicitly.
         *     filter: 'placeholder-value',
         *     // The maximum number of results to return per response.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // Project ID of the project for which to list Cloud SQL instances.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "warnings": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter A filter expression that filters resources listed in the response. The expression is in the form of field:value. For example, 'instanceType:CLOUD_SQL_INSTANCE'. Fields can be nested as needed as per their JSON representation, such as 'settings.userLabels.auto_start:true'. Multiple filter queries are space-separated. For example. 'state:RUNNABLE instanceType:CLOUD_SQL_INSTANCE'. By default, each expression is an AND expression. However, you can include AND and OR expressions explicitly.
         * @param {integer=} params.maxResults The maximum number of results to return per response.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string} params.project Project ID of the project for which to list Cloud SQL instances.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstancesListResponse>>;
        list(params: Params$Resource$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$InstancesListResponse>, callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        list(params: Params$Resource$Instances$List, callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$InstancesListResponse>): void;
        /**
         * sql.instances.listServerCas
         * @desc Lists all of the trusted Certificate Authorities (CAs) for the specified instance. There can be up to three CAs listed: the CA that was used to sign the certificate that is currently in use, a CA that has been added but not yet used to sign a certificate, and a CA used to sign a certificate that has previously rotated out.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.listServerCas({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "activeVersion": "my_activeVersion",
         *   //   "certs": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.listServerCas
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        listServerCas(params: Params$Resource$Instances$Listservercas, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listServerCas(params?: Params$Resource$Instances$Listservercas, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstancesListServerCasResponse>>;
        listServerCas(params: Params$Resource$Instances$Listservercas, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listServerCas(params: Params$Resource$Instances$Listservercas, options: MethodOptions | BodyResponseCallback<Schema$InstancesListServerCasResponse>, callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        listServerCas(params: Params$Resource$Instances$Listservercas, callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        listServerCas(callback: BodyResponseCallback<Schema$InstancesListServerCasResponse>): void;
        /**
         * sql.instances.patch
         * @desc Updates settings of a Cloud SQL instance. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.patch({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "backendType": "my_backendType",
         *       //   "connectionName": "my_connectionName",
         *       //   "currentDiskSize": "my_currentDiskSize",
         *       //   "databaseVersion": "my_databaseVersion",
         *       //   "diskEncryptionConfiguration": {},
         *       //   "diskEncryptionStatus": {},
         *       //   "etag": "my_etag",
         *       //   "failoverReplica": {},
         *       //   "gceZone": "my_gceZone",
         *       //   "instanceType": "my_instanceType",
         *       //   "ipAddresses": [],
         *       //   "ipv6Address": "my_ipv6Address",
         *       //   "kind": "my_kind",
         *       //   "masterInstanceName": "my_masterInstanceName",
         *       //   "maxDiskSize": "my_maxDiskSize",
         *       //   "name": "my_name",
         *       //   "onPremisesConfiguration": {},
         *       //   "project": "my_project",
         *       //   "region": "my_region",
         *       //   "replicaConfiguration": {},
         *       //   "replicaNames": [],
         *       //   "rootPassword": "my_rootPassword",
         *       //   "scheduledMaintenance": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "serverCaCert": {},
         *       //   "serviceAccountEmailAddress": "my_serviceAccountEmailAddress",
         *       //   "settings": {},
         *       //   "state": "my_state",
         *       //   "suspensionReason": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().DatabaseInstance} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Instances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Instances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Instances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Instances$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Instances$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.promoteReplica
         * @desc Promotes the read replica instance to be a stand-alone Cloud SQL instance. Using this operation might cause your instance to restart.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.promoteReplica({
         *     // Cloud SQL read replica instance name.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the read replica.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.promoteReplica
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL read replica instance name.
         * @param {string} params.project ID of the project that contains the read replica.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        promoteReplica(params?: Params$Resource$Instances$Promotereplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        promoteReplica(params: Params$Resource$Instances$Promotereplica, callback: BodyResponseCallback<Schema$Operation>): void;
        promoteReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.resetSslConfig
         * @desc Deletes all client certificates and generates a new server SSL certificate for the instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.resetSslConfig({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.resetSslConfig
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetSslConfig(params?: Params$Resource$Instances$Resetsslconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resetSslConfig(params: Params$Resource$Instances$Resetsslconfig, callback: BodyResponseCallback<Schema$Operation>): void;
        resetSslConfig(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.restart
         * @desc Restarts a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.restart({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance to be restarted.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.restart
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance to be restarted.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        restart(params: Params$Resource$Instances$Restart, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restart(params?: Params$Resource$Instances$Restart, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restart(params: Params$Resource$Instances$Restart, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restart(params: Params$Resource$Instances$Restart, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(params: Params$Resource$Instances$Restart, callback: BodyResponseCallback<Schema$Operation>): void;
        restart(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.restoreBackup
         * @desc Restores a backup of a Cloud SQL instance. Using this operation might cause your instance to restart.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.restoreBackup({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "restoreBackupContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.restoreBackup
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().InstancesRestoreBackupRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restoreBackup(params?: Params$Resource$Instances$Restorebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreBackup(params: Params$Resource$Instances$Restorebackup, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.rotateServerCa
         * @desc Rotates the server certificate to one signed by the Certificate Authority (CA) version previously added with the addServerCA method.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.rotateServerCa({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "rotateServerCaContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.rotateServerCa
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().InstancesRotateServerCaRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rotateServerCa(params?: Params$Resource$Instances$Rotateserverca, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rotateServerCa(params: Params$Resource$Instances$Rotateserverca, callback: BodyResponseCallback<Schema$Operation>): void;
        rotateServerCa(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.startReplica
         * @desc Starts the replication in the read replica instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.startReplica({
         *     // Cloud SQL read replica instance name.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the read replica.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.startReplica
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL read replica instance name.
         * @param {string} params.project ID of the project that contains the read replica.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        startReplica(params: Params$Resource$Instances$Startreplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startReplica(params?: Params$Resource$Instances$Startreplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startReplica(params: Params$Resource$Instances$Startreplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startReplica(params: Params$Resource$Instances$Startreplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startReplica(params: Params$Resource$Instances$Startreplica, callback: BodyResponseCallback<Schema$Operation>): void;
        startReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.stopReplica
         * @desc Stops the replication in the read replica instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.stopReplica({
         *     // Cloud SQL read replica instance name.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the read replica.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.stopReplica
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL read replica instance name.
         * @param {string} params.project ID of the project that contains the read replica.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stopReplica(params?: Params$Resource$Instances$Stopreplica, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stopReplica(params: Params$Resource$Instances$Stopreplica, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        stopReplica(params: Params$Resource$Instances$Stopreplica, callback: BodyResponseCallback<Schema$Operation>): void;
        stopReplica(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.truncateLog
         * @desc Truncate MySQL general and slow query log tables
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.truncateLog({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the Cloud SQL project.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "truncateLogContext": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.truncateLog
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the Cloud SQL project.
         * @param {().InstancesTruncateLogRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        truncateLog(params?: Params$Resource$Instances$Truncatelog, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        truncateLog(params: Params$Resource$Instances$Truncatelog, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        truncateLog(params: Params$Resource$Instances$Truncatelog, callback: BodyResponseCallback<Schema$Operation>): void;
        truncateLog(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.instances.update
         * @desc Updates settings of a Cloud SQL instance. Using this operation might cause your instance to restart.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.instances.update({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "backendType": "my_backendType",
         *       //   "connectionName": "my_connectionName",
         *       //   "currentDiskSize": "my_currentDiskSize",
         *       //   "databaseVersion": "my_databaseVersion",
         *       //   "diskEncryptionConfiguration": {},
         *       //   "diskEncryptionStatus": {},
         *       //   "etag": "my_etag",
         *       //   "failoverReplica": {},
         *       //   "gceZone": "my_gceZone",
         *       //   "instanceType": "my_instanceType",
         *       //   "ipAddresses": [],
         *       //   "ipv6Address": "my_ipv6Address",
         *       //   "kind": "my_kind",
         *       //   "masterInstanceName": "my_masterInstanceName",
         *       //   "maxDiskSize": "my_maxDiskSize",
         *       //   "name": "my_name",
         *       //   "onPremisesConfiguration": {},
         *       //   "project": "my_project",
         *       //   "region": "my_region",
         *       //   "replicaConfiguration": {},
         *       //   "replicaNames": [],
         *       //   "rootPassword": "my_rootPassword",
         *       //   "scheduledMaintenance": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "serverCaCert": {},
         *       //   "serviceAccountEmailAddress": "my_serviceAccountEmailAddress",
         *       //   "settings": {},
         *       //   "state": "my_state",
         *       //   "suspensionReason": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.instances.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().DatabaseInstance} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Instances$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Instances$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Instances$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Instances$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Instances$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
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
         * Cloud SQL instance ID. This does not include the project ID.
         */
        instance?: string;
        /**
         * Project ID of the project that contains the instance to be deleted.
         */
        project?: string;
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
         * Cloud SQL instance ID. This does not include the project ID.
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
         * The maximum number of results to return per response.
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
    export interface Params$Resource$Instances$Promotereplica extends StandardParameters {
        /**
         * Cloud SQL read replica instance name.
         */
        instance?: string;
        /**
         * ID of the project that contains the read replica.
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
         * sql.operations.get
         * @desc Retrieves an instance operation that has been performed on an instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.operations.get({
         *     // Instance operation ID.
         *     operation: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.operations.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.operation Instance operation ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.operations.list
         * @desc Lists all instance operations that have been performed on the given Cloud SQL instance in the reverse chronological order of the start time.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.operations.list({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Maximum number of operations per response.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.operations.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {integer=} params.maxResults Maximum number of operations per response.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$OperationsListResponse>>;
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$OperationsListResponse>, callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
        list(params: Params$Resource$Operations$List, callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$OperationsListResponse>): void;
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
         * sql.projects.instances.rescheduleMaintenance
         * @desc Reschedules the maintenance on the given instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.projects.instances.rescheduleMaintenance({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "reschedule": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.projects.instances.rescheduleMaintenance
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project ID of the project that contains the instance.
         * @param {().SqlInstancesRescheduleMaintenanceRequestBody} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rescheduleMaintenance(params?: Params$Resource$Projects$Instances$Reschedulemaintenance, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(params: Params$Resource$Projects$Instances$Reschedulemaintenance, callback: BodyResponseCallback<Schema$Operation>): void;
        rescheduleMaintenance(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.projects.instances.startExternalSync
         * @desc Start External master migration.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.projects.instances.startExternalSync({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *     // External sync mode
         *     syncMode: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.projects.instances.startExternalSync
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project ID of the project that contains the instance.
         * @param {string=} params.syncMode External sync mode
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startExternalSync(params?: Params$Resource$Projects$Instances$Startexternalsync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        startExternalSync(params: Params$Resource$Projects$Instances$Startexternalsync, callback: BodyResponseCallback<Schema$Operation>): void;
        startExternalSync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.projects.instances.verifyExternalSyncSettings
         * @desc Verify External master external sync settings.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.projects.instances.verifyExternalSyncSettings({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *     // External sync mode
         *     syncMode: 'placeholder-value',
         *     // Flag to enable verifying connection only
         *     verifyConnectionOnly: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "errors": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.projects.instances.verifyExternalSyncSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {string=} params.syncMode External sync mode
         * @param {boolean=} params.verifyConnectionOnly Flag to enable verifying connection only
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        verifyExternalSyncSettings(params?: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>>;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, options: MethodOptions | BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>, callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
        verifyExternalSyncSettings(params: Params$Resource$Projects$Instances$Verifyexternalsyncsettings, callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
        verifyExternalSyncSettings(callback: BodyResponseCallback<Schema$SqlInstancesVerifyExternalSyncSettingsResponse>): void;
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
         * External sync mode
         */
        syncMode?: string;
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
         * External sync mode
         */
        syncMode?: string;
        /**
         * Flag to enable verifying connection only
         */
        verifyConnectionOnly?: boolean;
    }
    export class Resource$Sslcerts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * sql.sslCerts.createEphemeral
         * @desc Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.sslCerts.createEphemeral({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the Cloud SQL project.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "public_key": "my_public_key"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cert": "my_cert",
         *   //   "certSerialNumber": "my_certSerialNumber",
         *   //   "commonName": "my_commonName",
         *   //   "createTime": "my_createTime",
         *   //   "expirationTime": "my_expirationTime",
         *   //   "instance": "my_instance",
         *   //   "kind": "my_kind",
         *   //   "selfLink": "my_selfLink",
         *   //   "sha1Fingerprint": "my_sha1Fingerprint"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.sslCerts.createEphemeral
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the Cloud SQL project.
         * @param {().SslCertsCreateEphemeralRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createEphemeral(params?: Params$Resource$Sslcerts$Createephemeral, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCert>>;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, options: MethodOptions | BodyResponseCallback<Schema$SslCert>, callback: BodyResponseCallback<Schema$SslCert>): void;
        createEphemeral(params: Params$Resource$Sslcerts$Createephemeral, callback: BodyResponseCallback<Schema$SslCert>): void;
        createEphemeral(callback: BodyResponseCallback<Schema$SslCert>): void;
        /**
         * sql.sslCerts.delete
         * @desc Deletes the SSL certificate. For First Generation instances, the certificate remains valid until the instance is restarted.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.sslCerts.delete({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *     // Sha1 FingerPrint.
         *     sha1Fingerprint: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.sslCerts.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {string} params.sha1Fingerprint Sha1 FingerPrint.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Sslcerts$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Sslcerts$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Sslcerts$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Sslcerts$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Sslcerts$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.sslCerts.get
         * @desc Retrieves a particular SSL certificate. Does not include the private key (required for usage). The private key must be saved from the response to initial creation.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.sslCerts.get({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *     // Sha1 FingerPrint.
         *     sha1Fingerprint: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cert": "my_cert",
         *   //   "certSerialNumber": "my_certSerialNumber",
         *   //   "commonName": "my_commonName",
         *   //   "createTime": "my_createTime",
         *   //   "expirationTime": "my_expirationTime",
         *   //   "instance": "my_instance",
         *   //   "kind": "my_kind",
         *   //   "selfLink": "my_selfLink",
         *   //   "sha1Fingerprint": "my_sha1Fingerprint"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.sslCerts.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {string} params.sha1Fingerprint Sha1 FingerPrint.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Sslcerts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sslcerts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCert>>;
        get(params: Params$Resource$Sslcerts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sslcerts$Get, options: MethodOptions | BodyResponseCallback<Schema$SslCert>, callback: BodyResponseCallback<Schema$SslCert>): void;
        get(params: Params$Resource$Sslcerts$Get, callback: BodyResponseCallback<Schema$SslCert>): void;
        get(callback: BodyResponseCallback<Schema$SslCert>): void;
        /**
         * sql.sslCerts.insert
         * @desc Creates an SSL certificate and returns it along with the private key and server certificate authority. The new certificate will not be usable until the instance is restarted.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.sslCerts.insert({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "commonName": "my_commonName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "clientCert": {},
         *   //   "kind": "my_kind",
         *   //   "operation": {},
         *   //   "serverCaCert": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.sslCerts.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().SslCertsInsertRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Sslcerts$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Sslcerts$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SslCertsInsertResponse>>;
        insert(params: Params$Resource$Sslcerts$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Sslcerts$Insert, options: MethodOptions | BodyResponseCallback<Schema$SslCertsInsertResponse>, callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        insert(params: Params$Resource$Sslcerts$Insert, callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        insert(callback: BodyResponseCallback<Schema$SslCertsInsertResponse>): void;
        /**
         * sql.sslCerts.list
         * @desc Lists all of the current SSL certificates for the instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.sslCerts.list({
         *     // Cloud SQL instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.sslCerts.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * sql.tiers.list
         * @desc Lists all available machine types (tiers) for Cloud SQL, for example, db-n1-standard-1. For related information, see Pricing.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.tiers.list({
         *     // Project ID of the project for which to list tiers.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.tiers.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.project Project ID of the project for which to list tiers.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * sql.users.delete
         * @desc Deletes a user from a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.users.delete({
         *     // Host of the user in the instance.
         *     host: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Name of the user in the instance.
         *     name: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.users.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.host Host of the user in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string=} params.name Name of the user in the instance.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Users$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Users$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Users$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.users.insert
         * @desc Creates a new user in a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.users.insert({
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "etag": "my_etag",
         *       //   "host": "my_host",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "password": "my_password",
         *       //   "project": "my_project",
         *       //   "sqlserverUserDetails": {},
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.users.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().User} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Users$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Users$Insert, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(params: Params$Resource$Users$Insert, callback: BodyResponseCallback<Schema$Operation>): void;
        insert(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * sql.users.list
         * @desc Lists users in the specified Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.users.list({
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.users.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Users$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UsersListResponse>>;
        list(params: Params$Resource$Users$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$List, options: MethodOptions | BodyResponseCallback<Schema$UsersListResponse>, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(params: Params$Resource$Users$List, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        /**
         * sql.users.update
         * @desc Updates an existing user in a Cloud SQL instance.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/sql.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const sql = google.sql('v1beta4');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/sqlservice.admin',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await sql.users.update({
         *     // Optional. Host of the user in the instance.
         *     host: 'placeholder-value',
         *     // Database instance ID. This does not include the project ID.
         *     instance: 'placeholder-value',
         *     // Name of the user in the instance.
         *     name: 'placeholder-value',
         *     // Project ID of the project that contains the instance.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "etag": "my_etag",
         *       //   "host": "my_host",
         *       //   "instance": "my_instance",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "password": "my_password",
         *       //   "project": "my_project",
         *       //   "sqlserverUserDetails": {},
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "endTime": "my_endTime",
         *   //   "error": {},
         *   //   "exportContext": {},
         *   //   "importContext": {},
         *   //   "insertTime": "my_insertTime",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "operationType": "my_operationType",
         *   //   "selfLink": "my_selfLink",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "targetId": "my_targetId",
         *   //   "targetLink": "my_targetLink",
         *   //   "targetProject": "my_targetProject",
         *   //   "user": "my_user"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias sql.users.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.host Optional. Host of the user in the instance.
         * @param {string} params.instance Database instance ID. This does not include the project ID.
         * @param {string=} params.name Name of the user in the instance.
         * @param {string} params.project Project ID of the project that contains the instance.
         * @param {().User} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
