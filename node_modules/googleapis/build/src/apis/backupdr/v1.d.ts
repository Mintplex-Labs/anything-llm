import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace backupdr_v1 {
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
     * Backup and DR Service API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const backupdr = google.backupdr('v1');
     * ```
     */
    export class Backupdr {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * request message for AbandonBackup.
     */
    export interface Schema$AbandonBackupRequest {
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
    }
    /**
     * A specification of the type and number of accelerator cards attached to the instance.
     */
    export interface Schema$AcceleratorConfig {
        /**
         * Optional. The number of the guest accelerator cards exposed to this instance.
         */
        acceleratorCount?: number | null;
        /**
         * Optional. Full or partial URL of the accelerator type resource to attach to this instance.
         */
        acceleratorType?: string | null;
    }
    /**
     * An access configuration attached to an instance's network interface. Only one access config per instance is supported.
     */
    export interface Schema$AccessConfig {
        /**
         * Optional. The external IPv6 address of this access configuration.
         */
        externalIpv6?: string | null;
        /**
         * Optional. The prefix length of the external IPv6 range.
         */
        externalIpv6PrefixLength?: number | null;
        /**
         * Optional. The name of this access configuration.
         */
        name?: string | null;
        /**
         * Optional. The external IP address of this access configuration.
         */
        natIP?: string | null;
        /**
         * Optional. This signifies the networking tier used for configuring this access
         */
        networkTier?: string | null;
        /**
         * Optional. The DNS domain name for the public PTR record.
         */
        publicPtrDomainName?: string | null;
        /**
         * Optional. Specifies whether a public DNS 'PTR' record should be created to map the external IP address of the instance to a DNS domain name.
         */
        setPublicPtr?: boolean | null;
        /**
         * Optional. In accessConfigs (IPv4), the default and only option is ONE_TO_ONE_NAT. In ipv6AccessConfigs, the default and only option is DIRECT_IPV6.
         */
        type?: string | null;
    }
    /**
     * Specifies options for controlling advanced machine features.
     */
    export interface Schema$AdvancedMachineFeatures {
        /**
         * Optional. Whether to enable nested virtualization or not (default is false).
         */
        enableNestedVirtualization?: boolean | null;
        /**
         * Optional. Whether to enable UEFI networking for instance creation.
         */
        enableUefiNetworking?: boolean | null;
        /**
         * Optional. The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed.
         */
        threadsPerCore?: number | null;
        /**
         * Optional. The number of physical cores to expose to an instance. Multiply by the number of threads per core to compute the total number of virtual CPUs to expose to the instance. If unset, the number of cores is inferred from the instance's nominal CPU count and the underlying platform's SMT width.
         */
        visibleCoreCount?: number | null;
    }
    /**
     * An alias IP range attached to an instance's network interface.
     */
    export interface Schema$AliasIpRange {
        /**
         * Optional. The IP alias ranges to allocate for this interface.
         */
        ipCidrRange?: string | null;
        /**
         * Optional. The name of a subnetwork secondary IP range from which to allocate an IP alias range. If not specified, the primary range of the subnetwork is used.
         */
        subnetworkRangeName?: string | null;
    }
    /**
     * Specifies the reservations that this instance can consume from.
     */
    export interface Schema$AllocationAffinity {
        /**
         * Optional. Specifies the type of reservation from which this instance can consume
         */
        consumeReservationType?: string | null;
        /**
         * Optional. Corresponds to the label key of a reservation resource.
         */
        key?: string | null;
        /**
         * Optional. Corresponds to the label values of a reservation resource.
         */
        values?: string[] | null;
    }
    /**
     * An instance-attached disk resource.
     */
    export interface Schema$AttachedDisk {
        /**
         * Optional. Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).
         */
        autoDelete?: boolean | null;
        /**
         * Optional. Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.
         */
        boot?: boolean | null;
        /**
         * Optional. This is used as an identifier for the disks. This is the unique name has to provided to modify disk parameters like disk_name and replica_zones (in case of RePDs)
         */
        deviceName?: string | null;
        /**
         * Optional. Encrypts or decrypts a disk using a customer-supplied encryption key.
         */
        diskEncryptionKey?: Schema$CustomerEncryptionKey;
        /**
         * Optional. Specifies the disk interface to use for attaching this disk.
         */
        diskInterface?: string | null;
        /**
         * Optional. The size of the disk in GB.
         */
        diskSizeGb?: string | null;
        /**
         * Optional. Output only. The URI of the disk type resource. For example: projects/project/zones/zone/diskTypes/pd-standard or pd-ssd
         */
        diskType?: string | null;
        /**
         * Specifies the type of the disk.
         */
        diskTypeDeprecated?: string | null;
        /**
         * Optional. A list of features to enable on the guest operating system. Applicable only for bootable images.
         */
        guestOsFeature?: Schema$GuestOsFeature[];
        /**
         * Optional. A zero-based index to this disk, where 0 is reserved for the boot disk.
         */
        index?: string | null;
        /**
         * Optional. Specifies the parameters to initialize this disk.
         */
        initializeParams?: Schema$InitializeParams;
        /**
         * Optional. Type of the resource.
         */
        kind?: string | null;
        /**
         * Optional. Any valid publicly visible licenses.
         */
        license?: string[] | null;
        /**
         * Optional. The mode in which to attach this disk.
         */
        mode?: string | null;
        /**
         * Optional. Output only. The state of the disk.
         */
        savedState?: string | null;
        /**
         * Optional. Specifies a valid partial or full URL to an existing Persistent Disk resource.
         */
        source?: string | null;
        /**
         * Optional. Specifies the type of the disk.
         */
        type?: string | null;
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
     * Message describing a Backup object.
     */
    export interface Schema$Backup {
        /**
         * Output only. Backup Appliance specific backup properties.
         */
        backupApplianceBackupProperties?: Schema$BackupApplianceBackupProperties;
        /**
         * Optional. The list of BackupLocks taken by the accessor Backup Appliance.
         */
        backupApplianceLocks?: Schema$BackupLock[];
        /**
         * Output only. Type of the backup, unspecified, scheduled or ondemand.
         */
        backupType?: string | null;
        /**
         * Output only. Compute Engine specific backup properties.
         */
        computeInstanceBackupProperties?: Schema$ComputeInstanceBackupProperties;
        /**
         * Output only. The point in time when this backup was captured from the source.
         */
        consistencyTime?: string | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * Output only. The description of the Backup instance (2048 characters or less).
         */
        description?: string | null;
        /**
         * Optional. The backup can not be deleted before this time.
         */
        enforcedRetentionEndTime?: string | null;
        /**
         * Optional. Server specified ETag to prevent updates from overwriting each other.
         */
        etag?: string | null;
        /**
         * Optional. When this backup is automatically expired.
         */
        expireTime?: string | null;
        /**
         * Output only. Configuration for a Google Cloud resource.
         */
        gcpBackupPlanInfo?: Schema$GCPBackupPlanInfo;
        /**
         * Optional. Resource labels to represent user provided metadata. No labels currently defined.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Identifier. Name of the backup to create. It must have the format`"projects//locations//backupVaults//dataSources/{datasource\}/backups/{backup\}"`. `{backup\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the datasource.
         */
        name?: string | null;
        /**
         * Output only. source resource size in bytes at the time of the backup.
         */
        resourceSizeBytes?: string | null;
        /**
         * Optional. Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Optional. Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Output only. The list of BackupLocks taken by the service to prevent the deletion of the backup.
         */
        serviceLocks?: Schema$BackupLock[];
        /**
         * Output only. The Backup resource instance state.
         */
        state?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
    }
    /**
     * BackupApplianceBackupConfig captures the backup configuration for applications that are protected by Backup Appliances.
     */
    export interface Schema$BackupApplianceBackupConfig {
        /**
         * The name of the application.
         */
        applicationName?: string | null;
        /**
         * The ID of the backup appliance.
         */
        backupApplianceId?: string | null;
        /**
         * The name of the backup appliance.
         */
        backupApplianceName?: string | null;
        /**
         * The name of the host where the application is running.
         */
        hostName?: string | null;
        /**
         * The ID of the SLA of this application.
         */
        slaId?: string | null;
        /**
         * The name of the SLP associated with the application.
         */
        slpName?: string | null;
        /**
         * The name of the SLT associated with the application.
         */
        sltName?: string | null;
    }
    /**
     * BackupApplianceBackupProperties represents BackupDR backup appliance's properties.
     */
    export interface Schema$BackupApplianceBackupProperties {
        /**
         * Output only. The time when this backup object was finalized (if none, backup is not finalized).
         */
        finalizeTime?: string | null;
        /**
         * Output only. The numeric generation ID of the backup (monotonically increasing).
         */
        generationId?: number | null;
        /**
         * Optional. The latest timestamp of data available in this Backup.
         */
        recoveryRangeEndTime?: string | null;
        /**
         * Optional. The earliest timestamp of data available in this Backup.
         */
        recoveryRangeStartTime?: string | null;
    }
    /**
     * BackupApplianceLockInfo contains metadata about the backupappliance that created the lock.
     */
    export interface Schema$BackupApplianceLockInfo {
        /**
         * Required. The ID of the backup/recovery appliance that created this lock.
         */
        backupApplianceId?: string | null;
        /**
         * Required. The name of the backup/recovery appliance that created this lock.
         */
        backupApplianceName?: string | null;
        /**
         * The image name that depends on this Backup.
         */
        backupImage?: string | null;
        /**
         * The job name on the backup/recovery appliance that created this lock.
         */
        jobName?: string | null;
        /**
         * Required. The reason for the lock: e.g. MOUNT/RESTORE/BACKUP/etc. The value of this string is only meaningful to the client and it is not interpreted by the BackupVault service.
         */
        lockReason?: string | null;
        /**
         * The SLA on the backup/recovery appliance that owns the lock.
         */
        slaId?: string | null;
    }
    /**
     * BackupConfigDetails has information about how the resource is configured for backups and about the most recent backup taken for this configuration.
     */
    export interface Schema$BackupConfigDetails {
        /**
         * Output only. The [full resource name](https://cloud.google.com/asset-inventory/docs/resource-name-format) of the resource that is applicable for the backup configuration. Example: "//compute.googleapis.com/projects/{project\}/zones/{zone\}/instances/{instance\}"
         */
        applicableResource?: string | null;
        /**
         * Output only. The full resource name of the backup config source resource. For example, "//backupdr.googleapis.com/v1/projects/{project\}/locations/{region\}/backupPlans/{backupplanId\}" or "//compute.googleapis.com/projects/{project\}/locations/{region\}/resourcePolicies/{resourcePolicyId\}".
         */
        backupConfigSource?: string | null;
        /**
         * Output only. The display name of the backup config source resource.
         */
        backupConfigSourceDisplayName?: string | null;
        /**
         * Backup and DR's Backup Plan specific data.
         */
        backupDrPlanConfig?: Schema$BackupDrPlanConfig;
        /**
         * Backup and DR's Template specific data.
         */
        backupDrTemplateConfig?: Schema$BackupDrTemplateConfig;
        /**
         * The locations where the backups are to be stored.
         */
        backupLocations?: Schema$BackupLocation[];
        /**
         * Output only. The [full resource name](https://cloud.google.com/asset-inventory/docs/resource-name-format) of the backup vault that will store the backups generated through this backup configuration. Example: "//backupdr.googleapis.com/v1/projects/{project\}/locations/{region\}/backupVaults/{backupvaultId\}"
         */
        backupVault?: string | null;
        /**
         * Output only. Timestamp of the latest successful backup created via this backup configuration.
         */
        latestSuccessfulBackupTime?: string | null;
        /**
         * Output only. Point in time recovery settings of the backup configuration resource.
         */
        pitrSettings?: Schema$PitrSettings;
        /**
         * Output only. The state of the backup config resource.
         */
        state?: string | null;
        /**
         * Output only. The type of the backup config resource.
         */
        type?: string | null;
    }
    /**
     * BackupConfigInfo has information about how the resource is configured for Backup and about the most recent backup to this vault.
     */
    export interface Schema$BackupConfigInfo {
        /**
         * Configuration for an application backed up by a Backup Appliance.
         */
        backupApplianceBackupConfig?: Schema$BackupApplianceBackupConfig;
        /**
         * Configuration for a Google Cloud resource.
         */
        gcpBackupConfig?: Schema$GcpBackupConfig;
        /**
         * Output only. If the last backup failed, this field has the error message.
         */
        lastBackupError?: Schema$Status;
        /**
         * Output only. The status of the last backup to this BackupVault
         */
        lastBackupState?: string | null;
        /**
         * Output only. If the last backup were successful, this field has the consistency date.
         */
        lastSuccessfulBackupConsistencyTime?: string | null;
        /**
         * Output only. If the last log backup were successful, this field has the consistency date.
         */
        lastSuccessfulLogBackupConsistencyTime?: string | null;
    }
    /**
     * BackupDrPlanConfig has additional information about Backup and DR's Plan backup configuration.
     */
    export interface Schema$BackupDrPlanConfig {
        /**
         * Backup rules of the backup plan resource.
         */
        backupDrPlanRules?: Schema$BackupDrPlanRule[];
    }
    /**
     * BackupDrPlanRule has rule specific information of the backup plan resource.
     */
    export interface Schema$BackupDrPlanRule {
        /**
         * Output only. Timestamp of the latest successful backup created via this backup rule.
         */
        lastSuccessfulBackupTime?: string | null;
        /**
         * Output only. Unique Id of the backup rule.
         */
        ruleId?: string | null;
    }
    /**
     * BackupDrTemplateConfig has additional information about Backup and DR's Template backup configuration.
     */
    export interface Schema$BackupDrTemplateConfig {
        /**
         * Output only. The URI of the BackupDr template resource for the first party identity users.
         */
        firstPartyManagementUri?: string | null;
        /**
         * Output only. The URI of the BackupDr template resource for the third party identity users.
         */
        thirdPartyManagementUri?: string | null;
    }
    /**
     * BackupLocation represents a cloud location where a backup can be stored.
     */
    export interface Schema$BackupLocation {
        /**
         * Output only. The id of the cloud location. Example: "us-central1"
         */
        locationId?: string | null;
        /**
         * Output only. The type of the location.
         */
        type?: string | null;
    }
    /**
     * BackupLock represents a single lock on a Backup resource. An unexpired lock on a Backup prevents the Backup from being deleted.
     */
    export interface Schema$BackupLock {
        /**
         * If the client is a backup and recovery appliance, this contains metadata about why the lock exists.
         */
        backupApplianceLockInfo?: Schema$BackupApplianceLockInfo;
        /**
         * Required. The time after which this lock is not considered valid and will no longer protect the Backup from deletion.
         */
        lockUntilTime?: string | null;
        /**
         * Output only. Contains metadata about the lock exist for Google Cloud native backups.
         */
        serviceLockInfo?: Schema$ServiceLockInfo;
    }
    /**
     * A `BackupPlan` specifies some common fields, such as `description` as well as one or more `BackupRule` messages. Each `BackupRule` has a retention policy and defines a schedule by which the system is to perform backup workloads.
     */
    export interface Schema$BackupPlan {
        /**
         * Required. The backup rules for this `BackupPlan`. There must be at least one `BackupRule` message.
         */
        backupRules?: Schema$BackupRule[];
        /**
         * Required. Resource name of backup vault which will be used as storage location for backups. Format: projects/{project\}/locations/{location\}/backupVaults/{backupvault\}
         */
        backupVault?: string | null;
        /**
         * Output only. The Google Cloud Platform Service Account to be used by the BackupVault for taking backups. Specify the email address of the Backup Vault Service Account.
         */
        backupVaultServiceAccount?: string | null;
        /**
         * Output only. When the `BackupPlan` was created.
         */
        createTime?: string | null;
        /**
         * Optional. The description of the `BackupPlan` resource. The description allows for additional details about `BackupPlan` and its use cases to be provided. An example description is the following: "This is a backup plan that performs a daily backup at 6pm and retains data for 3 months". The description must be at most 2048 characters.
         */
        description?: string | null;
        /**
         * Optional. `etag` is returned from the service in the response. As a user of the service, you may provide an etag value in this field to prevent stale resources.
         */
        etag?: string | null;
        /**
         * Optional. This collection of key/value pairs allows for custom labels to be supplied by the user. Example, {"tag": "Weekly"\}.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Identifier. The resource name of the `BackupPlan`. Format: `projects/{project\}/locations/{location\}/backupPlans/{backup_plan\}`
         */
        name?: string | null;
        /**
         * Required.
         */
        resourceType?: string | null;
        /**
         * Output only. The `State` for the `BackupPlan`.
         */
        state?: string | null;
        /**
         * Output only. When the `BackupPlan` was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A BackupPlanAssociation represents a single BackupPlanAssociation which contains details like workload, backup plan etc
     */
    export interface Schema$BackupPlanAssociation {
        /**
         * Required. Resource name of backup plan which needs to be applied on workload. Format: projects/{project\}/locations/{location\}/backupPlans/{backupPlanId\}
         */
        backupPlan?: string | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * Output only. Resource name of data source which will be used as storage location for backups taken. Format : projects/{project\}/locations/{location\}/backupVaults/{backupvault\}/dataSources/{datasource\}
         */
        dataSource?: string | null;
        /**
         * Output only. Identifier. The resource name of BackupPlanAssociation in below format Format : projects/{project\}/locations/{location\}/backupPlanAssociations/{backupPlanAssociationId\}
         */
        name?: string | null;
        /**
         * Required. Immutable. Resource name of workload on which backupplan is applied
         */
        resource?: string | null;
        /**
         * Required. Immutable.
         */
        resourceType?: string | null;
        /**
         * Output only. The config info related to backup rules.
         */
        rulesConfigInfo?: Schema$RuleConfigInfo[];
        /**
         * Output only. The BackupPlanAssociation resource state.
         */
        state?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
    }
    /**
     * `BackupRule` binds the backup schedule to a retention policy.
     */
    export interface Schema$BackupRule {
        /**
         * Required. Configures the duration for which backup data will be kept. It is defined in “days”. The value should be greater than or equal to minimum enforced retention of the backup vault. Minimum value is 1 and maximum value is 90 for hourly backups. Minimum value is 1 and maximum value is 186 for daily backups. Minimum value is 7 and maximum value is 366 for weekly backups. Minimum value is 30 and maximum value is 732 for monthly backups. Minimum value is 365 and maximum value is 36159 for yearly backups.
         */
        backupRetentionDays?: number | null;
        /**
         * Required. Immutable. The unique id of this `BackupRule`. The `rule_id` is unique per `BackupPlan`.The `rule_id` must start with a lowercase letter followed by up to 62 lowercase letters, numbers, or hyphens. Pattern, /a-z{,62\}/.
         */
        ruleId?: string | null;
        /**
         * Required. Defines a schedule that runs within the confines of a defined window of time.
         */
        standardSchedule?: Schema$StandardSchedule;
    }
    /**
     * Message describing a BackupVault object.
     */
    export interface Schema$BackupVault {
        /**
         * Optional. Note: This field is added for future use case and will not be supported in the current release. Access restriction for the backup vault. Default value is WITHIN_ORGANIZATION if not provided during creation.
         */
        accessRestriction?: string | null;
        /**
         * Optional. User annotations. See https://google.aip.dev/128#annotations Stores small amounts of arbitrary data.
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The number of backups in this backup vault.
         */
        backupCount?: string | null;
        /**
         * Required. The default and minimum enforced retention for each backup within the backup vault. The enforced retention for each backup can be extended.
         */
        backupMinimumEnforcedRetentionDuration?: string | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * Output only. Set to true when there are no backups nested under this resource.
         */
        deletable?: boolean | null;
        /**
         * Optional. The description of the BackupVault instance (2048 characters or less).
         */
        description?: string | null;
        /**
         * Optional. Time after which the BackupVault resource is locked.
         */
        effectiveTime?: string | null;
        /**
         * Optional. Server specified ETag for the backup vault resource to prevent simultaneous updates from overwiting each other.
         */
        etag?: string | null;
        /**
         * Optional. Resource labels to represent user provided metadata. No labels currently defined:
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Identifier. Name of the backup vault to create. It must have the format`"projects/{project\}/locations/{location\}/backupVaults/{backupvault\}"`. `{backupvault\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the project and location.
         */
        name?: string | null;
        /**
         * Output only. Service account used by the BackupVault Service for this BackupVault. The user should grant this account permissions in their workload project to enable the service to run backups and restores there.
         */
        serviceAccount?: string | null;
        /**
         * Output only. The BackupVault resource instance state.
         */
        state?: string | null;
        /**
         * Output only. Total size of the storage used by all backup resources.
         */
        totalStoredBytes?: string | null;
        /**
         * Output only. Immutable after resource creation until resource deletion.
         */
        uid?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
    }
    /**
     * `BackupWindow` defines a window of the day during which backup jobs will run.
     */
    export interface Schema$BackupWindow {
        /**
         * Required. The hour of day (1-24) when the window end for e.g. if value of end hour of day is 10 that mean backup window end time is 10:00. End hour of day should be greater than start hour of day. 0 <= start_hour_of_day < end_hour_of_day <= 24 End hour of day is not include in backup window that mean if end_hour_of_day= 10 jobs should start before 10:00.
         */
        endHourOfDay?: number | null;
        /**
         * Required. The hour of day (0-23) when the window starts for e.g. if value of start hour of day is 6 that mean backup window start at 6:00.
         */
        startHourOfDay?: number | null;
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
     * ComputeInstanceBackupProperties represents Compute Engine instance backup properties.
     */
    export interface Schema$ComputeInstanceBackupProperties {
        /**
         * Enables instances created based on these properties to send packets with source IP addresses other than their own and receive packets with destination IP addresses other than their own. If these instances will be used as an IP gateway or it will be set as the next-hop in a Route resource, specify `true`. If unsure, leave this set to `false`. See the https://cloud.google.com/vpc/docs/using-routes#canipforward documentation for more information.
         */
        canIpForward?: boolean | null;
        /**
         * An optional text description for the instances that are created from these properties.
         */
        description?: string | null;
        /**
         * An array of disks that are associated with the instances that are created from these properties.
         */
        disk?: Schema$AttachedDisk[];
        /**
         * A list of guest accelerator cards' type and count to use for instances created from these properties.
         */
        guestAccelerator?: Schema$AcceleratorConfig[];
        /**
         * KeyRevocationActionType of the instance. Supported options are "STOP" and "NONE". The default value is "NONE" if it is not specified.
         */
        keyRevocationActionType?: string | null;
        /**
         * Labels to apply to instances that are created from these properties.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The machine type to use for instances that are created from these properties.
         */
        machineType?: string | null;
        /**
         * The metadata key/value pairs to assign to instances that are created from these properties. These pairs can consist of custom metadata or predefined keys. See https://cloud.google.com/compute/docs/metadata/overview for more information.
         */
        metadata?: Schema$Metadata;
        /**
         * Minimum cpu/platform to be used by instances. The instance may be scheduled on the specified or newer cpu/platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: Intel Haswell` or `minCpuPlatform: Intel Sandy Bridge`. For more information, read https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform.
         */
        minCpuPlatform?: string | null;
        /**
         * An array of network access configurations for this interface.
         */
        networkInterface?: Schema$NetworkInterface[];
        /**
         * Specifies the scheduling options for the instances that are created from these properties.
         */
        scheduling?: Schema$Scheduling;
        /**
         * A list of service accounts with specified scopes. Access tokens for these service accounts are available to the instances that are created from these properties. Use metadata queries to obtain the access tokens for these instances.
         */
        serviceAccount?: Schema$ServiceAccount[];
        /**
         * The source instance used to create this backup. This can be a partial or full URL to the resource. For example, the following are valid values: -https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance -projects/project/zones/zone/instances/instance
         */
        sourceInstance?: string | null;
        /**
         * A list of tags to apply to the instances that are created from these properties. The tags identify valid sources or targets for network firewalls. The setTags method can modify this list of tags. Each tag within the list must comply with RFC1035 (https://www.ietf.org/rfc/rfc1035.txt).
         */
        tags?: Schema$Tags;
    }
    /**
     * ComputeInstanceDataSourceProperties represents the properties of a ComputeEngine resource that are stored in the DataSource.
     */
    export interface Schema$ComputeInstanceDataSourceProperties {
        /**
         * The description of the Compute Engine instance.
         */
        description?: string | null;
        /**
         * The machine type of the instance.
         */
        machineType?: string | null;
        /**
         * Name of the compute instance backed up by the datasource.
         */
        name?: string | null;
        /**
         * The total number of disks attached to the Instance.
         */
        totalDiskCount?: string | null;
        /**
         * The sum of all the disk sizes.
         */
        totalDiskSizeGb?: string | null;
    }
    /**
     * ComputeInstanceRestoreProperties represents Compute Engine instance properties to be overridden during restore.
     */
    export interface Schema$ComputeInstanceRestoreProperties {
        /**
         * Optional. Controls for advanced machine-related behavior features.
         */
        advancedMachineFeatures?: Schema$AdvancedMachineFeatures;
        /**
         * Optional. Allows this instance to send and receive packets with non-matching destination or source IPs.
         */
        canIpForward?: boolean | null;
        /**
         * Optional. Controls Confidential compute options on the instance
         */
        confidentialInstanceConfig?: Schema$ConfidentialInstanceConfig;
        /**
         * Optional. Whether the resource should be protected against deletion.
         */
        deletionProtection?: boolean | null;
        /**
         * Optional. An optional description of this resource. Provide this property when you create the resource.
         */
        description?: string | null;
        /**
         * Optional. Array of disks associated with this instance. Persistent disks must be created before you can assign them.
         */
        disks?: Schema$AttachedDisk[];
        /**
         * Optional. Enables display device for the instance.
         */
        displayDevice?: Schema$DisplayDevice;
        /**
         * Optional. A list of the type and count of accelerator cards attached to the instance.
         */
        guestAccelerators?: Schema$AcceleratorConfig[];
        /**
         * Optional. Specifies the hostname of the instance. The specified hostname must be RFC1035 compliant. If hostname is not specified, the default hostname is [INSTANCE_NAME].c.[PROJECT_ID].internal when using the global DNS, and [INSTANCE_NAME].[ZONE].c.[PROJECT_ID].internal when using zonal DNS.
         */
        hostname?: string | null;
        /**
         * Optional. Encrypts suspended data for an instance with a customer-managed encryption key.
         */
        instanceEncryptionKey?: Schema$CustomerEncryptionKey;
        /**
         * Optional. KeyRevocationActionType of the instance.
         */
        keyRevocationActionType?: string | null;
        /**
         * Optional. Labels to apply to this instance.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Full or partial URL of the machine type resource to use for this instance.
         */
        machineType?: string | null;
        /**
         * Optional. This includes custom metadata and predefined keys.
         */
        metadata?: Schema$Metadata;
        /**
         * Optional. Minimum CPU platform to use for this instance.
         */
        minCpuPlatform?: string | null;
        /**
         * Required. Name of the compute instance.
         */
        name?: string | null;
        /**
         * Optional. An array of network configurations for this instance. These specify how interfaces are configured to interact with other network services, such as connecting to the internet. Multiple interfaces are supported per instance.
         */
        networkInterfaces?: Schema$NetworkInterface[];
        /**
         * Optional. Configure network performance such as egress bandwidth tier.
         */
        networkPerformanceConfig?: Schema$NetworkPerformanceConfig;
        /**
         * Input only. Additional params passed with the request, but not persisted as part of resource payload.
         */
        params?: Schema$InstanceParams;
        /**
         * Optional. The private IPv6 google access type for the VM. If not specified, use INHERIT_FROM_SUBNETWORK as default.
         */
        privateIpv6GoogleAccess?: string | null;
        /**
         * Optional. Specifies the reservations that this instance can consume from.
         */
        reservationAffinity?: Schema$AllocationAffinity;
        /**
         * Optional. Resource policies applied to this instance.
         */
        resourcePolicies?: string[] | null;
        /**
         * Optional. Sets the scheduling options for this instance.
         */
        scheduling?: Schema$Scheduling;
        /**
         * Optional. A list of service accounts, with their specified scopes, authorized for this instance. Only one service account per VM instance is supported.
         */
        serviceAccounts?: Schema$ServiceAccount[];
        /**
         * Optional. Tags to apply to this instance. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during instance creation.
         */
        tags?: Schema$Tags;
    }
    /**
     * ComputeInstanceTargetEnvironment represents Compute Engine target environment to be used during restore.
     */
    export interface Schema$ComputeInstanceTargetEnvironment {
        /**
         * Required. Target project for the Compute Engine instance.
         */
        project?: string | null;
        /**
         * Required. The zone of the Compute Engine instance.
         */
        zone?: string | null;
    }
    /**
     * A set of Confidential Instance options.
     */
    export interface Schema$ConfidentialInstanceConfig {
        /**
         * Optional. Defines whether the instance should have confidential compute enabled.
         */
        enableConfidentialCompute?: boolean | null;
    }
    /**
     * A customer-supplied encryption key.
     */
    export interface Schema$CustomerEncryptionKey {
        /**
         * Optional. The name of the encryption key that is stored in Google Cloud KMS.
         */
        kmsKeyName?: string | null;
        /**
         * Optional. The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used.
         */
        kmsKeyServiceAccount?: string | null;
        /**
         * Optional. Specifies a 256-bit customer-supplied encryption key.
         */
        rawKey?: string | null;
        /**
         * Optional. RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource.
         */
        rsaEncryptedKey?: string | null;
    }
    /**
     * Message describing a DataSource object. Datasource object used to represent Datasource details for both admin and basic view.
     */
    export interface Schema$DataSource {
        /**
         * Output only. Details of how the resource is configured for backup.
         */
        backupConfigInfo?: Schema$BackupConfigInfo;
        /**
         * Number of backups in the data source.
         */
        backupCount?: string | null;
        /**
         * Output only. The backup configuration state.
         */
        configState?: string | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * The backed up resource is a backup appliance application.
         */
        dataSourceBackupApplianceApplication?: Schema$DataSourceBackupApplianceApplication;
        /**
         * The backed up resource is a Google Cloud resource. The word 'DataSource' was included in the names to indicate that this is the representation of the Google Cloud resource used within the DataSource object.
         */
        dataSourceGcpResource?: Schema$DataSourceGcpResource;
        /**
         * Server specified ETag for the ManagementServer resource to prevent simultaneous updates from overwiting each other.
         */
        etag?: string | null;
        /**
         * Optional. Resource labels to represent user provided metadata. No labels currently defined:
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Identifier. Name of the datasource to create. It must have the format`"projects/{project\}/locations/{location\}/backupVaults/{backupvault\}/dataSources/{datasource\}"`. `{datasource\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the backup vault.
         */
        name?: string | null;
        /**
         * Output only. The DataSource resource instance state.
         */
        state?: string | null;
        /**
         * The number of bytes (metadata and data) stored in this datasource.
         */
        totalStoredBytes?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
    }
    /**
     * BackupApplianceApplication describes a Source Resource when it is an application backed up by a BackupAppliance.
     */
    export interface Schema$DataSourceBackupApplianceApplication {
        /**
         * Appliance Id of the Backup Appliance.
         */
        applianceId?: string | null;
        /**
         * The appid field of the application within the Backup Appliance.
         */
        applicationId?: string | null;
        /**
         * The name of the Application as known to the Backup Appliance.
         */
        applicationName?: string | null;
        /**
         * Appliance name.
         */
        backupAppliance?: string | null;
        /**
         * Hostid of the application host.
         */
        hostId?: string | null;
        /**
         * Hostname of the host where the application is running.
         */
        hostname?: string | null;
        /**
         * The type of the application. e.g. VMBackup
         */
        type?: string | null;
    }
    /**
     * DataSourceGcpResource is used for protected resources that are Google Cloud Resources. This name is easeier to understand than GcpResourceDataSource or GcpDataSourceResource
     */
    export interface Schema$DataSourceGcpResource {
        /**
         * ComputeInstanceDataSourceProperties has a subset of Compute Instance properties that are useful at the Datasource level.
         */
        computeInstanceDatasourceProperties?: Schema$ComputeInstanceDataSourceProperties;
        /**
         * Output only. Full resource pathname URL of the source Google Cloud resource.
         */
        gcpResourcename?: string | null;
        /**
         * Location of the resource: //"global"/"unspecified".
         */
        location?: string | null;
        /**
         * The type of the Google Cloud resource. Use the Unified Resource Type, eg. compute.googleapis.com/Instance.
         */
        type?: string | null;
    }
    /**
     * A set of Display Device options
     */
    export interface Schema$DisplayDevice {
        /**
         * Optional. Enables display for the Compute Engine VM
         */
        enableDisplay?: boolean | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * A key/value pair to be used for storing metadata.
     */
    export interface Schema$Entry {
        /**
         * Optional. Key for the metadata entry.
         */
        key?: string | null;
        /**
         * Optional. Value for the metadata entry. These are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on values is that their size must be less than or equal to 262144 bytes (256 KiB).
         */
        value?: string | null;
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
     * Request message for FetchAccessToken.
     */
    export interface Schema$FetchAccessTokenRequest {
        /**
         * Required. The generation of the backup to update.
         */
        generationId?: number | null;
    }
    /**
     * Response message for FetchAccessToken.
     */
    export interface Schema$FetchAccessTokenResponse {
        /**
         * The token is valid until this time.
         */
        expireTime?: string | null;
        /**
         * The location in bucket that can be used for reading.
         */
        readLocation?: string | null;
        /**
         * The downscoped token that was created.
         */
        token?: string | null;
        /**
         * The location in bucket that can be used for writing.
         */
        writeLocation?: string | null;
    }
    /**
     * Response message for fetching usable BackupVaults.
     */
    export interface Schema$FetchUsableBackupVaultsResponse {
        /**
         * The list of BackupVault instances in the project for the specified location. If the '{location\}' value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return backup vaults in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        backupVaults?: Schema$BackupVault[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Message for finalizing a Backup.
     */
    export interface Schema$FinalizeBackupRequest {
        /**
         * Required. Resource ID of the Backup resource to be finalized. This must be the same backup_id that was used in the InitiateBackupRequest.
         */
        backupId?: string | null;
        /**
         * The point in time when this backup was captured from the source. This will be assigned to the consistency_time field of the newly created Backup.
         */
        consistencyTime?: string | null;
        /**
         * This will be assigned to the description field of the newly created Backup.
         */
        description?: string | null;
        /**
         * The latest timestamp of data available in this Backup. This will be set on the newly created Backup.
         */
        recoveryRangeEndTime?: string | null;
        /**
         * The earliest timestamp of data available in this Backup. This will set on the newly created Backup.
         */
        recoveryRangeStartTime?: string | null;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * The ExpireTime on the backup will be set to FinalizeTime plus this duration. If the resulting ExpireTime is less than EnforcedRetentionEndTime, then ExpireTime is set to EnforcedRetentionEndTime.
         */
        retentionDuration?: string | null;
    }
    /**
     * GcpBackupConfig captures the Backup configuration details for Google Cloud resources. All Google Cloud resources regardless of type are protected with backup plan associations.
     */
    export interface Schema$GcpBackupConfig {
        /**
         * The name of the backup plan.
         */
        backupPlan?: string | null;
        /**
         * The name of the backup plan association.
         */
        backupPlanAssociation?: string | null;
        /**
         * The description of the backup plan.
         */
        backupPlanDescription?: string | null;
        /**
         * The names of the backup plan rules which point to this backupvault
         */
        backupPlanRules?: string[] | null;
    }
    /**
     * GCPBackupPlanInfo captures the plan configuration details of Google Cloud resources at the time of backup.
     */
    export interface Schema$GCPBackupPlanInfo {
        /**
         * Resource name of backup plan by which workload is protected at the time of the backup. Format: projects/{project\}/locations/{location\}/backupPlans/{backupPlanId\}
         */
        backupPlan?: string | null;
        /**
         * The rule id of the backup plan which triggered this backup in case of scheduled backup or used for
         */
        backupPlanRuleId?: string | null;
    }
    /**
     * Minimum details to identify a Google Cloud resource
     */
    export interface Schema$GcpResource {
        /**
         * Name of the Google Cloud resource.
         */
        gcpResourcename?: string | null;
        /**
         * Location of the resource: //"global"/"unspecified".
         */
        location?: string | null;
        /**
         * Type of the resource. Use the Unified Resource Type, eg. compute.googleapis.com/Instance.
         */
        type?: string | null;
    }
    /**
     * Feature type of the Guest OS.
     */
    export interface Schema$GuestOsFeature {
        /**
         * The ID of a supported feature.
         */
        type?: string | null;
    }
    /**
     * Specifies the parameters to initialize this disk.
     */
    export interface Schema$InitializeParams {
        /**
         * Optional. Specifies the disk name. If not specified, the default is to use the name of the instance.
         */
        diskName?: string | null;
        /**
         * Optional. URL of the zone where the disk should be created. Required for each regional disk associated with the instance.
         */
        replicaZones?: string[] | null;
    }
    /**
     * Request message for initializing the service.
     */
    export interface Schema$InitializeServiceRequest {
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and t he request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The resource type to which the default service config will be applied. Examples include, "compute.googleapis.com/Instance" and "storage.googleapis.com/Bucket".
         */
        resourceType?: string | null;
    }
    /**
     * request message for InitiateBackup.
     */
    export interface Schema$InitiateBackupRequest {
        /**
         * Required. Resource ID of the Backup resource.
         */
        backupId?: string | null;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
    }
    /**
     * Response message for InitiateBackup.
     */
    export interface Schema$InitiateBackupResponse {
        /**
         * The name of the backup that was created.
         */
        backup?: string | null;
        /**
         * The generation id of the base backup. It is needed for the incremental backups.
         */
        baseBackupGenerationId?: number | null;
        /**
         * The generation id of the new backup.
         */
        newBackupGenerationId?: number | null;
    }
    /**
     * Additional instance params.
     */
    export interface Schema$InstanceParams {
        /**
         * Optional. Resource manager tags to be bound to the instance.
         */
        resourceManagerTags?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Response message for List BackupPlanAssociation
     */
    export interface Schema$ListBackupPlanAssociationsResponse {
        /**
         * The list of Backup Plan Associations in the project for the specified location. If the `{location\}` value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return backup plan associations in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        backupPlanAssociations?: Schema$BackupPlanAssociation[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * The response message for getting a list of `BackupPlan`.
     */
    export interface Schema$ListBackupPlansResponse {
        /**
         * The list of `BackupPlans` in the project for the specified location. If the `{location\}` value in the request is "-", the response contains a list of resources from all locations. In case any location is unreachable, the response will only return backup plans in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations. BackupPlan
         */
        backupPlans?: Schema$BackupPlan[];
        /**
         * A token which may be sent as page_token in a subsequent `ListBackupPlans` call to retrieve the next page of results. If this field is omitted or empty, then there are no more results to return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for listing Backups.
     */
    export interface Schema$ListBackupsResponse {
        /**
         * The list of Backup instances in the project for the specified location. If the '{location\}' value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return data sources in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        backups?: Schema$Backup[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for listing BackupVaults.
     */
    export interface Schema$ListBackupVaultsResponse {
        /**
         * The list of BackupVault instances in the project for the specified location. If the '{location\}' value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return backup vaults in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        backupVaults?: Schema$BackupVault[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for listing DataSources.
     */
    export interface Schema$ListDataSourcesResponse {
        /**
         * The list of DataSource instances in the project for the specified location. If the '{location\}' value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return data sources in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        dataSources?: Schema$DataSource[];
        /**
         * A token identifying a page of results the server should return.
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
     * Response message for listing management servers.
     */
    export interface Schema$ListManagementServersResponse {
        /**
         * The list of ManagementServer instances in the project for the specified location. If the '{location\}' value in the request is "-", the response contains a list of instances from all locations. In case any location is unreachable, the response will only return management servers in reachable locations and the 'unreachable' field will be populated with a list of unreachable locations.
         */
        managementServers?: Schema$ManagementServer[];
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
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
     * Response for ListResourceBackupConfigs.
     */
    export interface Schema$ListResourceBackupConfigsResponse {
        /**
         * A token identifying a page of results the server should return.
         */
        nextPageToken?: string | null;
        /**
         * The list of ResourceBackupConfigs for the specified scope.
         */
        resourceBackupConfigs?: Schema$ResourceBackupConfig[];
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
     * ManagementServer describes a single BackupDR ManagementServer instance.
     */
    export interface Schema$ManagementServer {
        /**
         * Output only. The hostname or ip address of the exposed AGM endpoints, used by BAs to connect to BA proxy.
         */
        baProxyUri?: string[] | null;
        /**
         * Output only. The time when the instance was created.
         */
        createTime?: string | null;
        /**
         * Optional. The description of the ManagementServer instance (2048 characters or less).
         */
        description?: string | null;
        /**
         * Optional. Server specified ETag for the ManagementServer resource to prevent simultaneous updates from overwiting each other.
         */
        etag?: string | null;
        /**
         * Optional. Resource labels to represent user provided metadata. Labels currently defined: 1. migrate_from_go= If set to true, the MS is created in migration ready mode.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The hostname or ip address of the exposed AGM endpoints, used by clients to connect to AGM/RD graphical user interface and APIs.
         */
        managementUri?: Schema$ManagementURI;
        /**
         * Output only. Identifier. The resource name.
         */
        name?: string | null;
        /**
         * Optional. VPC networks to which the ManagementServer instance is connected. For this version, only a single network is supported. This field is optional if MS is created without PSA
         */
        networks?: Schema$NetworkConfig[];
        /**
         * Output only. The OAuth 2.0 client id is required to make API calls to the BackupDR instance API of this ManagementServer. This is the value that should be provided in the 'aud' field of the OIDC ID Token (see openid specification https://openid.net/specs/openid-connect-core-1_0.html#IDToken).
         */
        oauth2ClientId?: string | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Output only. The ManagementServer state.
         */
        state?: string | null;
        /**
         * Optional. The type of the ManagementServer resource.
         */
        type?: string | null;
        /**
         * Output only. The time when the instance was updated.
         */
        updateTime?: string | null;
        /**
         * Output only. The hostnames of the exposed AGM endpoints for both types of user i.e. 1p and 3p, used to connect AGM/RM UI.
         */
        workforceIdentityBasedManagementUri?: Schema$WorkforceIdentityBasedManagementURI;
        /**
         * Output only. The OAuth client IDs for both types of user i.e. 1p and 3p.
         */
        workforceIdentityBasedOauth2ClientId?: Schema$WorkforceIdentityBasedOAuth2ClientID;
    }
    /**
     * ManagementURI for the Management Server resource.
     */
    export interface Schema$ManagementURI {
        /**
         * Output only. The ManagementServer AGM/RD API URL.
         */
        api?: string | null;
        /**
         * Output only. The ManagementServer AGM/RD WebUI URL.
         */
        webUi?: string | null;
    }
    /**
     * A metadata key/value entry.
     */
    export interface Schema$Metadata {
        /**
         * Optional. Array of key/value pairs. The total size of all keys and values must be less than 512 KB.
         */
        items?: Schema$Entry[];
    }
    /**
     * Network configuration for ManagementServer instance.
     */
    export interface Schema$NetworkConfig {
        /**
         * Optional. The resource name of the Google Compute Engine VPC network to which the ManagementServer instance is connected.
         */
        network?: string | null;
        /**
         * Optional. The network connect mode of the ManagementServer instance. For this version, only PRIVATE_SERVICE_ACCESS is supported.
         */
        peeringMode?: string | null;
    }
    /**
     * A network interface resource attached to an instance. s
     */
    export interface Schema$NetworkInterface {
        /**
         * Optional. An array of configurations for this interface. Currently, only one access config,ONE_TO_ONE_NAT is supported. If there are no accessConfigs specified, then this instance will have no external internet access.
         */
        accessConfigs?: Schema$AccessConfig[];
        /**
         * Optional. An array of alias IP ranges for this network interface. You can only specify this field for network interfaces in VPC networks.
         */
        aliasIpRanges?: Schema$AliasIpRange[];
        /**
         * Optional. The prefix length of the primary internal IPv6 range.
         */
        internalIpv6PrefixLength?: number | null;
        /**
         * Optional. An array of IPv6 access configurations for this interface. Currently, only one IPv6 access config, DIRECT_IPV6, is supported. If there is no ipv6AccessConfig specified, then this instance will have no external IPv6 Internet access.
         */
        ipv6AccessConfigs?: Schema$AccessConfig[];
        /**
         * Optional. [Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be accessed from the Internet. This field is always inherited from its subnetwork.
         */
        ipv6AccessType?: string | null;
        /**
         * Optional. An IPv6 internal network address for this network interface. To use a static internal IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an internal IPv6 address from the instance's subnetwork.
         */
        ipv6Address?: string | null;
        /**
         * Output only. [Output Only] The name of the network interface, which is generated by the server.
         */
        name?: string | null;
        /**
         * Optional. URL of the VPC network resource for this instance.
         */
        network?: string | null;
        /**
         * Optional. The URL of the network attachment that this interface should connect to in the following format: projects/{project_number\}/regions/{region_name\}/networkAttachments/{network_attachment_name\}.
         */
        networkAttachment?: string | null;
        /**
         * Optional. An IPv4 internal IP address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.
         */
        networkIP?: string | null;
        /**
         * Optional. The type of vNIC to be used on this interface. This may be gVNIC or VirtioNet.
         */
        nicType?: string | null;
        /**
         * Optional. The networking queue count that's specified by users for the network interface. Both Rx and Tx queues will be set to this number. It'll be empty if not specified by the users.
         */
        queueCount?: number | null;
        /**
         * The stack type for this network interface.
         */
        stackType?: string | null;
        /**
         * Optional. The URL of the Subnetwork resource for this instance.
         */
        subnetwork?: string | null;
    }
    /**
     * Network performance configuration.
     */
    export interface Schema$NetworkPerformanceConfig {
        /**
         * Optional. The tier of the total egress bandwidth.
         */
        totalEgressBandwidthTier?: string | null;
    }
    /**
     * Node Affinity: the configuration of desired nodes onto which this Instance could be scheduled.
     */
    export interface Schema$NodeAffinity {
        /**
         * Optional. Corresponds to the label key of Node resource.
         */
        key?: string | null;
        /**
         * Optional. Defines the operation of node selection.
         */
        operator?: string | null;
        /**
         * Optional. Corresponds to the label values of Node resource.
         */
        values?: string[] | null;
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
         * Output only. AdditionalInfo contains additional Info related to backup plan association resource.
         */
        additionalInfo?: {
            [key: string]: string;
        } | null;
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
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to 'Code.CANCELLED'.
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
     * Point in time recovery settings of the backup configuration resource.
     */
    export interface Schema$PitrSettings {
        /**
         * Output only. Number of days to retain the backup.
         */
        retentionDays?: number | null;
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
     * Message for deleting a DataSource.
     */
    export interface Schema$RemoveDataSourceRequest {
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
    }
    /**
     * ResourceBackupConfig represents a resource along with its backup configurations.
     */
    export interface Schema$ResourceBackupConfig {
        /**
         * Backup configurations applying to the target resource, including those targeting its related/child resources. For example, backup configuration applicable to Compute Engine disks will be populated in this field for a Compute Engine VM which has the disk associated.
         */
        backupConfigsDetails?: Schema$BackupConfigDetails[];
        /**
         * Output only. Whether the target resource is configured for backup. This is true if the backup_configs_details is not empty.
         */
        backupConfigured?: boolean | null;
        /**
         * Identifier. The resource name of the ResourceBackupConfig. Format: projects/{project\}/locations/{location\}/resourceBackupConfigs/{uid\}
         */
        name?: string | null;
        /**
         * Output only. The [full resource name](https://cloud.google.com/asset-inventory/docs/resource-name-format) of the cloud resource that this configuration applies to. Supported resource types are ResourceBackupConfig.ResourceType.
         */
        targetResource?: string | null;
        /**
         * Output only. The human friendly name of the target resource.
         */
        targetResourceDisplayName?: string | null;
        /**
         * Labels associated with the target resource.
         */
        targetResourceLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The type of the target resource.
         */
        targetResourceType?: string | null;
        /**
         * Output only. The unique identifier of the resource backup config.
         */
        uid?: string | null;
        /**
         * Output only. Whether the target resource is protected by a backup vault. This is true if the backup_configs_details is not empty and any of the ResourceBackupConfig.backup_configs_details has a backup configuration with BackupConfigDetails.backup_vault set. set.
         */
        vaulted?: boolean | null;
    }
    /**
     * Request message for restoring from a Backup.
     */
    export interface Schema$RestoreBackupRequest {
        /**
         * Compute Engine instance properties to be overridden during restore.
         */
        computeInstanceRestoreProperties?: Schema$ComputeInstanceRestoreProperties;
        /**
         * Compute Engine target environment to be used during restore.
         */
        computeInstanceTargetEnvironment?: Schema$ComputeInstanceTargetEnvironment;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
    }
    /**
     * Response message for restoring from a Backup.
     */
    export interface Schema$RestoreBackupResponse {
        /**
         * Details of the target resource created/modified as part of restore.
         */
        targetResource?: Schema$TargetResource;
    }
    /**
     * Message for rules config info.
     */
    export interface Schema$RuleConfigInfo {
        /**
         * Output only. google.rpc.Status object to store the last backup error.
         */
        lastBackupError?: Schema$Status;
        /**
         * Output only. The last backup state for rule.
         */
        lastBackupState?: string | null;
        /**
         * Output only. The point in time when the last successful backup was captured from the source.
         */
        lastSuccessfulBackupConsistencyTime?: string | null;
        /**
         * Output only. Backup Rule id fetched from backup plan.
         */
        ruleId?: string | null;
    }
    /**
     * Sets the scheduling options for an Instance.
     */
    export interface Schema$Scheduling {
        /**
         * Optional. Specifies whether the instance should be automatically restarted if it is terminated by Compute Engine (not terminated by a user).
         */
        automaticRestart?: boolean | null;
        /**
         * Optional. Specifies the termination action for the instance.
         */
        instanceTerminationAction?: string | null;
        /**
         * Optional. Specifies the maximum amount of time a Local Ssd Vm should wait while recovery of the Local Ssd state is attempted. Its value should be in between 0 and 168 hours with hour granularity and the default value being 1 hour.
         */
        localSsdRecoveryTimeout?: Schema$SchedulingDuration;
        /**
         * Optional. The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node.
         */
        minNodeCpus?: number | null;
        /**
         * Optional. A set of node affinity and anti-affinity configurations. Overrides reservationAffinity.
         */
        nodeAffinities?: Schema$NodeAffinity[];
        /**
         * Optional. Defines the maintenance behavior for this instance.
         */
        onHostMaintenance?: string | null;
        /**
         * Optional. Defines whether the instance is preemptible.
         */
        preemptible?: boolean | null;
        /**
         * Optional. Specifies the provisioning model of the instance.
         */
        provisioningModel?: string | null;
    }
    /**
     * A SchedulingDuration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.
     */
    export interface Schema$SchedulingDuration {
        /**
         * Optional. Span of time that's a fraction of a second at nanosecond resolution.
         */
        nanos?: number | null;
        /**
         * Optional. Span of time at a resolution of a second.
         */
        seconds?: string | null;
    }
    /**
     * A service account.
     */
    export interface Schema$ServiceAccount {
        /**
         * Optional. Email address of the service account.
         */
        email?: string | null;
        /**
         * Optional. The list of scopes to be made available for this service account.
         */
        scopes?: string[] | null;
    }
    /**
     * ServiceLockInfo represents the details of a lock taken by the service on a Backup resource.
     */
    export interface Schema$ServiceLockInfo {
        /**
         * Output only. The name of the operation that created this lock. The lock will automatically be released when the operation completes.
         */
        operation?: string | null;
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
     * Request message for SetStatusInternal method.
     */
    export interface Schema$SetInternalStatusRequest {
        /**
         * Required. Output only. The new BackupConfigState to set for the DataSource.
         */
        backupConfigState?: string | null;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. The value required for this method to work. This field must be the 32-byte SHA256 hash of the DataSourceID. The DataSourceID used here is only the final piece of the fully qualified resource path for this DataSource (i.e. the part after '.../dataSources/'). This field exists to make this method difficult to call since it is intended for use only by Backup Appliances.
         */
        value?: string | null;
    }
    /**
     * Response message from SetStatusInternal method.
     */
    export interface Schema$SetInternalStatusResponse {
    }
    /**
     * `StandardSchedule` defines a schedule that run within the confines of a defined window of days. We can define recurrence type for schedule as HOURLY, DAILY, WEEKLY, MONTHLY or YEARLY.
     */
    export interface Schema$StandardSchedule {
        /**
         * Required. A BackupWindow defines the window of day during which backup jobs will run. Jobs are queued at the beginning of the window and will be marked as `NOT_RUN` if they do not start by the end of the window. Note: running jobs will not be cancelled at the end of the window.
         */
        backupWindow?: Schema$BackupWindow;
        /**
         * Optional. Specifies days of months like 1, 5, or 14 on which jobs will run. Values for `days_of_month` are only applicable for `recurrence_type`, `MONTHLY` and `YEARLY`. A validation error will occur if other values are supplied.
         */
        daysOfMonth?: number[] | null;
        /**
         * Optional. Specifies days of week like, MONDAY or TUESDAY, on which jobs will run. This is required for `recurrence_type`, `WEEKLY` and is not applicable otherwise. A validation error will occur if a value is supplied and `recurrence_type` is not `WEEKLY`.
         */
        daysOfWeek?: string[] | null;
        /**
         * Optional. Specifies frequency for hourly backups. A hourly frequency of 2 means jobs will run every 2 hours from start time till end time defined. This is required for `recurrence_type`, `HOURLY` and is not applicable otherwise. A validation error will occur if a value is supplied and `recurrence_type` is not `HOURLY`. Value of hourly frequency should be between 4 and 23. Reason for limit : We found that there is bandwidth limitation of 3GB/S for GMI while taking a backup and 5GB/S while doing a restore. Given the amount of parallel backups and restore we are targeting, this will potentially take the backup time to mins and hours (in worst case scenario).
         */
        hourlyFrequency?: number | null;
        /**
         * Optional. Specifies the months of year, like `FEBRUARY` and/or `MAY`, on which jobs will run. This field is only applicable when `recurrence_type` is `YEARLY`. A validation error will occur if other values are supplied.
         */
        months?: string[] | null;
        /**
         * Required. Specifies the `RecurrenceType` for the schedule.
         */
        recurrenceType?: string | null;
        /**
         * Required. The time zone to be used when interpreting the schedule. The value of this field must be a time zone name from the IANA tz database. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for the list of valid timezone names. For e.g., Europe/Paris.
         */
        timeZone?: string | null;
        /**
         * Optional. Specifies a week day of the month like, FIRST SUNDAY or LAST MONDAY, on which jobs will run. This will be specified by two fields in `WeekDayOfMonth`, one for the day, e.g. `MONDAY`, and one for the week, e.g. `LAST`. This field is only applicable for `recurrence_type`, `MONTHLY` and `YEARLY`. A validation error will occur if other values are supplied.
         */
        weekDayOfMonth?: Schema$WeekDayOfMonth;
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
     * A set of instance tags.
     */
    export interface Schema$Tags {
        /**
         * Optional. An array of tags. Each tag must be 1-63 characters long, and comply with RFC1035.
         */
        items?: string[] | null;
    }
    /**
     * Details of the target resource created/modified as part of restore.
     */
    export interface Schema$TargetResource {
        /**
         * Details of the native Google Cloud resource created as part of restore.
         */
        gcpResource?: Schema$GcpResource;
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
     * Request message for triggering a backup.
     */
    export interface Schema$TriggerBackupRequest {
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string | null;
        /**
         * Required. backup rule_id for which a backup needs to be triggered.
         */
        ruleId?: string | null;
    }
    /**
     * `WeekDayOfMonth` defines the week day of the month on which the backups will run. The message combines a `WeekOfMonth` and `DayOfWeek` to produce values like `FIRST`/`MONDAY` or `LAST`/`FRIDAY`.
     */
    export interface Schema$WeekDayOfMonth {
        /**
         * Required. Specifies the day of the week.
         */
        dayOfWeek?: string | null;
        /**
         * Required. Specifies the week of the month.
         */
        weekOfMonth?: string | null;
    }
    /**
     * ManagementURI depending on the Workforce Identity i.e. either 1p or 3p.
     */
    export interface Schema$WorkforceIdentityBasedManagementURI {
        /**
         * Output only. First party Management URI for Google Identities.
         */
        firstPartyManagementUri?: string | null;
        /**
         * Output only. Third party Management URI for External Identity Providers.
         */
        thirdPartyManagementUri?: string | null;
    }
    /**
     * OAuth Client ID depending on the Workforce Identity i.e. either 1p or 3p,
     */
    export interface Schema$WorkforceIdentityBasedOAuth2ClientID {
        /**
         * Output only. First party OAuth Client ID for Google Identities.
         */
        firstPartyOauth2ClientId?: string | null;
        /**
         * Output only. Third party OAuth Client ID for External Identity Providers.
         */
        thirdPartyOauth2ClientId?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        backupPlanAssociations: Resource$Projects$Locations$Backupplanassociations;
        backupPlans: Resource$Projects$Locations$Backupplans;
        backupVaults: Resource$Projects$Locations$Backupvaults;
        managementServers: Resource$Projects$Locations$Managementservers;
        operations: Resource$Projects$Locations$Operations;
        resourceBackupConfigs: Resource$Projects$Locations$Resourcebackupconfigs;
        serviceConfig: Resource$Projects$Locations$Serviceconfig;
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
    export class Resource$Projects$Locations$Backupplanassociations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a BackupPlanAssociation
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Backupplanassociations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Backupplanassociations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Backupplanassociations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Backupplanassociations$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Backupplanassociations$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single BackupPlanAssociation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Backupplanassociations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Backupplanassociations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Backupplanassociations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Backupplanassociations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Backupplanassociations$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single BackupPlanAssociation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupplanassociations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupplanassociations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupPlanAssociation>>;
        get(params: Params$Resource$Projects$Locations$Backupplanassociations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupplanassociations$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupPlanAssociation>, callback: BodyResponseCallback<Schema$BackupPlanAssociation>): void;
        get(params: Params$Resource$Projects$Locations$Backupplanassociations$Get, callback: BodyResponseCallback<Schema$BackupPlanAssociation>): void;
        get(callback: BodyResponseCallback<Schema$BackupPlanAssociation>): void;
        /**
         * Lists BackupPlanAssociations in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupplanassociations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupplanassociations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupPlanAssociationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupplanassociations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupplanassociations$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupPlanAssociationsResponse>, callback: BodyResponseCallback<Schema$ListBackupPlanAssociationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupplanassociations$List, callback: BodyResponseCallback<Schema$ListBackupPlanAssociationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupPlanAssociationsResponse>): void;
        /**
         * Triggers a new Backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        triggerBackup(params: Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        triggerBackup(params?: Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        triggerBackup(params: Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        triggerBackup(params: Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        triggerBackup(params: Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup, callback: BodyResponseCallback<Schema$Operation>): void;
        triggerBackup(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupplanassociations$Create extends StandardParameters {
        /**
         * Required. The name of the backup plan association to create. The name must be unique for the specified project and location.
         */
        backupPlanAssociationId?: string;
        /**
         * Required. The backup plan association project and location in the format `projects/{project_id\}/locations/{location\}`. In Cloud BackupDR locations map to GCP regions, for example **us-central1**.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and t he request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupPlanAssociation;
    }
    export interface Params$Resource$Projects$Locations$Backupplanassociations$Delete extends StandardParameters {
        /**
         * Required. Name of the backup plan association resource, in the format `projects/{project\}/locations/{location\}/backupPlanAssociations/{backupPlanAssociationId\}`
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupplanassociations$Get extends StandardParameters {
        /**
         * Required. Name of the backup plan association resource, in the format `projects/{project\}/locations/{location\}/backupPlanAssociations/{backupPlanAssociationId\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupplanassociations$List extends StandardParameters {
        /**
         * Optional. Filtering results
         */
        filter?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve backup Plan Associations information, in the format `projects/{project_id\}/locations/{location\}`. In Cloud BackupDR, locations map to GCP regions, for example **us-central1**. To retrieve backup plan associations for all locations, use "-" for the `{location\}` value.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupplanassociations$Triggerbackup extends StandardParameters {
        /**
         * Required. Name of the backup plan association resource, in the format `projects/{project\}/locations/{location\}/backupPlanAssociations/{backupPlanAssociationId\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TriggerBackupRequest;
    }
    export class Resource$Projects$Locations$Backupplans {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a BackupPlan
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Backupplans$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Backupplans$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Backupplans$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Backupplans$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Backupplans$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single BackupPlan.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Backupplans$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Backupplans$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Backupplans$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Backupplans$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Backupplans$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single BackupPlan.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupplans$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupplans$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupPlan>>;
        get(params: Params$Resource$Projects$Locations$Backupplans$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupplans$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupPlan>, callback: BodyResponseCallback<Schema$BackupPlan>): void;
        get(params: Params$Resource$Projects$Locations$Backupplans$Get, callback: BodyResponseCallback<Schema$BackupPlan>): void;
        get(callback: BodyResponseCallback<Schema$BackupPlan>): void;
        /**
         * Lists BackupPlans in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupplans$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupplans$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupPlansResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupplans$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupplans$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupPlansResponse>, callback: BodyResponseCallback<Schema$ListBackupPlansResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupplans$List, callback: BodyResponseCallback<Schema$ListBackupPlansResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupPlansResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupplans$Create extends StandardParameters {
        /**
         * Required. The name of the `BackupPlan` to create. The name must be unique for the specified project and location.The name must start with a lowercase letter followed by up to 62 lowercase letters, numbers, or hyphens. Pattern, /a-z{,62\}/.
         */
        backupPlanId?: string;
        /**
         * Required. The `BackupPlan` project and location in the format `projects/{project\}/locations/{location\}`. In Cloud BackupDR locations map to GCP regions, for example **us-central1**.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and t he request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupPlan;
    }
    export interface Params$Resource$Projects$Locations$Backupplans$Delete extends StandardParameters {
        /**
         * Required. The resource name of the `BackupPlan` to delete. Format: `projects/{project\}/locations/{location\}/backupPlans/{backup_plan\}`
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupplans$Get extends StandardParameters {
        /**
         * Required. The resource name of the `BackupPlan` to retrieve. Format: `projects/{project\}/locations/{location\}/backupPlans/{backup_plan\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupplans$List extends StandardParameters {
        /**
         * Optional. Field match expression used to filter the results.
         */
        filter?: string;
        /**
         * Optional. Field by which to sort the results.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of `BackupPlans` to return in a single response. If not specified, a default value will be chosen by the service. Note that the response may include a partial list and a caller should only rely on the response's next_page_token to determine if there are more instances left to be queried.
         */
        pageSize?: number;
        /**
         * Optional. The value of next_page_token received from a previous `ListBackupPlans` call. Provide this to retrieve the subsequent page in a multi-page list of results. When paginating, all other parameters provided to `ListBackupPlans` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve `BackupPlans` information. Format: `projects/{project\}/locations/{location\}`. In Cloud BackupDR, locations map to GCP regions, for e.g. **us-central1**. To retrieve backup plans for all locations, use "-" for the `{location\}` value.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Backupvaults {
        context: APIRequestContext;
        dataSources: Resource$Projects$Locations$Backupvaults$Datasources;
        constructor(context: APIRequestContext);
        /**
         * Creates a new BackupVault in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Backupvaults$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Backupvaults$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Backupvaults$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Backupvaults$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Backupvaults$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a BackupVault.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Backupvaults$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * FetchUsableBackupVaults lists usable BackupVaults in a given project and location. Usable BackupVault are the ones that user has backupdr.backupVaults.get permission.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchUsable(params: Params$Resource$Projects$Locations$Backupvaults$Fetchusable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchUsable(params?: Params$Resource$Projects$Locations$Backupvaults$Fetchusable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FetchUsableBackupVaultsResponse>>;
        fetchUsable(params: Params$Resource$Projects$Locations$Backupvaults$Fetchusable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchUsable(params: Params$Resource$Projects$Locations$Backupvaults$Fetchusable, options: MethodOptions | BodyResponseCallback<Schema$FetchUsableBackupVaultsResponse>, callback: BodyResponseCallback<Schema$FetchUsableBackupVaultsResponse>): void;
        fetchUsable(params: Params$Resource$Projects$Locations$Backupvaults$Fetchusable, callback: BodyResponseCallback<Schema$FetchUsableBackupVaultsResponse>): void;
        fetchUsable(callback: BodyResponseCallback<Schema$FetchUsableBackupVaultsResponse>): void;
        /**
         * Gets details of a BackupVault.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupvaults$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupvaults$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BackupVault>>;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Get, options: MethodOptions | BodyResponseCallback<Schema$BackupVault>, callback: BodyResponseCallback<Schema$BackupVault>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Get, callback: BodyResponseCallback<Schema$BackupVault>): void;
        get(callback: BodyResponseCallback<Schema$BackupVault>): void;
        /**
         * Lists BackupVaults in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupvaults$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupvaults$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupVaultsResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupvaults$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupVaultsResponse>, callback: BodyResponseCallback<Schema$ListBackupVaultsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$List, callback: BodyResponseCallback<Schema$ListBackupVaultsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupVaultsResponse>): void;
        /**
         * Updates the settings of a BackupVault.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Backupvaults$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Returns the caller's permissions on a BackupVault resource. A caller is not required to have Google IAM permission to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Backupvaults$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Backupvaults$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Backupvaults$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Backupvaults$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Backupvaults$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Create extends StandardParameters {
        /**
         * Required. ID of the requesting object If auto-generating ID server-side, remove this field and backup_vault_id from the method_signature of Create RPC
         */
        backupVaultId?: string;
        /**
         * Required. Value for parent.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Only validate the request, but do not perform mutations. The default is 'false'.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupVault;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Delete extends StandardParameters {
        /**
         * Optional. If true and the BackupVault is not found, the request will succeed but no action will be taken.
         */
        allowMissing?: boolean;
        /**
         * The current etag of the backup vault. If an etag is provided and does not match the current etag of the connection, deletion will be blocked.
         */
        etag?: string;
        /**
         * Optional. If set to true, any data source from this backup vault will also be deleted.
         */
        force?: boolean;
        /**
         * Optional. If set to true, backupvault deletion will proceed even if there are backup plans referencing the backupvault. The default is 'false'.
         */
        ignoreBackupPlanReferences?: boolean;
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Optional. Only validate the request, but do not perform mutations. The default is 'false'.
         */
        validateOnly?: boolean;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Fetchusable extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve backupvault stores information, in the format 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR, locations map to Google Cloud regions, for example **us-central1**. To retrieve backupvault stores for all locations, use "-" for the '{location\}' value.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Get extends StandardParameters {
        /**
         * Required. Name of the backupvault store resource name, in the format 'projects/{project_id\}/locations/{location\}/backupVaults/{resource_name\}'
         */
        name?: string;
        /**
         * Optional. Reserved for future use to provide a BASIC & FULL view of Backup Vault
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve backupvault stores information, in the format 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR, locations map to Google Cloud regions, for example **us-central1**. To retrieve backupvault stores for all locations, use "-" for the '{location\}' value.
         */
        parent?: string;
        /**
         * Optional. Reserved for future use to provide a BASIC & FULL view of Backup Vault.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Patch extends StandardParameters {
        /**
         * Optional. If set to true, will not check plan duration against backup vault enforcement duration.
         */
        force?: boolean;
        /**
         * Output only. Identifier. Name of the backup vault to create. It must have the format`"projects/{project\}/locations/{location\}/backupVaults/{backupvault\}"`. `{backupvault\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the project and location.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Field mask is used to specify the fields to be overwritten in the BackupVault resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then the request will fail.
         */
        updateMask?: string;
        /**
         * Optional. Only validate the request, but do not perform mutations. The default is 'false'.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BackupVault;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Backupvaults$Datasources {
        context: APIRequestContext;
        backups: Resource$Projects$Locations$Backupvaults$Datasources$Backups;
        constructor(context: APIRequestContext);
        /**
         * Internal only. Abandons a backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        abandonBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        abandonBackup(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        abandonBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        abandonBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        abandonBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup, callback: BodyResponseCallback<Schema$Operation>): void;
        abandonBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Internal only. Fetch access token for a given data source.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchAccessToken(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchAccessToken(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FetchAccessTokenResponse>>;
        fetchAccessToken(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchAccessToken(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken, options: MethodOptions | BodyResponseCallback<Schema$FetchAccessTokenResponse>, callback: BodyResponseCallback<Schema$FetchAccessTokenResponse>): void;
        fetchAccessToken(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken, callback: BodyResponseCallback<Schema$FetchAccessTokenResponse>): void;
        fetchAccessToken(callback: BodyResponseCallback<Schema$FetchAccessTokenResponse>): void;
        /**
         * Internal only. Finalize a backup that was started by a call to InitiateBackup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        finalizeBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        finalizeBackup(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        finalizeBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        finalizeBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        finalizeBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup, callback: BodyResponseCallback<Schema$Operation>): void;
        finalizeBackup(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a DataSource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DataSource>>;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Get, options: MethodOptions | BodyResponseCallback<Schema$DataSource>, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Get, callback: BodyResponseCallback<Schema$DataSource>): void;
        get(callback: BodyResponseCallback<Schema$DataSource>): void;
        /**
         * Internal only. Initiates a backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        initiateBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        initiateBackup(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InitiateBackupResponse>>;
        initiateBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        initiateBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup, options: MethodOptions | BodyResponseCallback<Schema$InitiateBackupResponse>, callback: BodyResponseCallback<Schema$InitiateBackupResponse>): void;
        initiateBackup(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup, callback: BodyResponseCallback<Schema$InitiateBackupResponse>): void;
        initiateBackup(callback: BodyResponseCallback<Schema$InitiateBackupResponse>): void;
        /**
         * Lists DataSources in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDataSourcesResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$List, options: MethodOptions | BodyResponseCallback<Schema$ListDataSourcesResponse>, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$List, callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDataSourcesResponse>): void;
        /**
         * Updates the settings of a DataSource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a DataSource. This is a custom method instead of a standard delete method because external clients will not delete DataSources except for BackupDR backup appliances.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        remove(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        remove(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        remove(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        remove(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        remove(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove, callback: BodyResponseCallback<Schema$Operation>): void;
        remove(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the internal status of a DataSource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setInternalStatus(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setInternalStatus(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setInternalStatus(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setInternalStatus(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setInternalStatus(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus, callback: BodyResponseCallback<Schema$Operation>): void;
        setInternalStatus(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Abandonbackup extends StandardParameters {
        /**
         * Required. The resource name of the instance, in the format 'projects/x/locations/x/backupVaults/x/dataSources/'.
         */
        dataSource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AbandonBackupRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Fetchaccesstoken extends StandardParameters {
        /**
         * Required. The resource name for the location for which static IPs should be returned. Must be in the format 'projects/x/locations/x/backupVaults/x/dataSources'.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FetchAccessTokenRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Finalizebackup extends StandardParameters {
        /**
         * Required. The resource name of the instance, in the format 'projects/x/locations/x/backupVaults/x/dataSources/'.
         */
        dataSource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FinalizeBackupRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Get extends StandardParameters {
        /**
         * Required. Name of the data source resource name, in the format 'projects/{project_id\}/locations/{location\}/backupVaults/{resource_name\}/dataSource/{resource_name\}'
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Initiatebackup extends StandardParameters {
        /**
         * Required. The resource name of the instance, in the format 'projects/x/locations/x/backupVaults/x/dataSources/'.
         */
        dataSource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InitiateBackupRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve data sources information, in the format 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR, locations map to Google Cloud regions, for example **us-central1**. To retrieve data sources for all locations, use "-" for the '{location\}' value.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Patch extends StandardParameters {
        /**
         * Optional. Enable upsert.
         */
        allowMissing?: boolean;
        /**
         * Output only. Identifier. Name of the datasource to create. It must have the format`"projects/{project\}/locations/{location\}/backupVaults/{backupvault\}/dataSources/{datasource\}"`. `{datasource\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the backup vault.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Field mask is used to specify the fields to be overwritten in the DataSource resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then the request will fail.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DataSource;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Remove extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RemoveDataSourceRequest;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Setinternalstatus extends StandardParameters {
        /**
         * Required. The resource name of the instance, in the format 'projects/x/locations/x/backupVaults/x/dataSources/'.
         */
        dataSource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetInternalStatusRequest;
    }
    export class Resource$Projects$Locations$Backupvaults$Datasources$Backups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a Backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a Backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Backup>>;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get, options: MethodOptions | BodyResponseCallback<Schema$Backup>, callback: BodyResponseCallback<Schema$Backup>): void;
        get(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get, callback: BodyResponseCallback<Schema$Backup>): void;
        get(callback: BodyResponseCallback<Schema$Backup>): void;
        /**
         * Lists Backups in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBackupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List, options: MethodOptions | BodyResponseCallback<Schema$ListBackupsResponse>, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List, callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBackupsResponse>): void;
        /**
         * Updates the settings of a Backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Restore from a Backup
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restore(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restore(params?: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restore(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restore(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restore(params: Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore, callback: BodyResponseCallback<Schema$Operation>): void;
        restore(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Delete extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Get extends StandardParameters {
        /**
         * Required. Name of the data source resource name, in the format 'projects/{project_id\}/locations/{location\}/backupVaults/{backupVault\}/dataSources/{datasource\}/backups/{backup\}'
         */
        name?: string;
        /**
         * Optional. Reserved for future use to provide a BASIC & FULL view of Backup resource.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve backup information, in the format 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR, locations map to Google Cloud regions, for example **us-central1**. To retrieve data sources for all locations, use "-" for the '{location\}' value.
         */
        parent?: string;
        /**
         * Optional. Reserved for future use to provide a BASIC & FULL view of Backup resource.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Patch extends StandardParameters {
        /**
         * Output only. Identifier. Name of the backup to create. It must have the format`"projects//locations//backupVaults//dataSources/{datasource\}/backups/{backup\}"`. `{backup\}` cannot be changed after creation. It must be between 3-63 characters long and must be unique within the datasource.
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Required. Field mask is used to specify the fields to be overwritten in the Backup resource by the update. The fields specified in the update_mask are relative to the resource, not the full request. A field will be overwritten if it is in the mask. If the user does not provide a mask then the request will fail.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Backup;
    }
    export interface Params$Resource$Projects$Locations$Backupvaults$Datasources$Backups$Restore extends StandardParameters {
        /**
         * Required. The resource name of the Backup instance, in the format 'projects/x/locations/x/backupVaults/x/dataSources/x/backups/'.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RestoreBackupRequest;
    }
    export class Resource$Projects$Locations$Managementservers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ManagementServer in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Managementservers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Managementservers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Managementservers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Managementservers$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Managementservers$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a single ManagementServer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Managementservers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Managementservers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Managementservers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Managementservers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Managementservers$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets details of a single ManagementServer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Managementservers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Managementservers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagementServer>>;
        get(params: Params$Resource$Projects$Locations$Managementservers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Managementservers$Get, options: MethodOptions | BodyResponseCallback<Schema$ManagementServer>, callback: BodyResponseCallback<Schema$ManagementServer>): void;
        get(params: Params$Resource$Projects$Locations$Managementservers$Get, callback: BodyResponseCallback<Schema$ManagementServer>): void;
        get(callback: BodyResponseCallback<Schema$ManagementServer>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Managementservers$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists ManagementServers in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Managementservers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Managementservers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListManagementServersResponse>>;
        list(params: Params$Resource$Projects$Locations$Managementservers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Managementservers$List, options: MethodOptions | BodyResponseCallback<Schema$ListManagementServersResponse>, callback: BodyResponseCallback<Schema$ListManagementServersResponse>): void;
        list(params: Params$Resource$Projects$Locations$Managementservers$List, callback: BodyResponseCallback<Schema$ListManagementServersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListManagementServersResponse>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Managementservers$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Managementservers$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Managementservers$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Managementservers$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Managementservers$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Managementservers$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Managementservers$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Create extends StandardParameters {
        /**
         * Required. The name of the management server to create. The name must be unique for the specified project and location.
         */
        managementServerId?: string;
        /**
         * Required. The management server project and location in the format 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR locations map to Google Cloud regions, for example **us-central1**.
         */
        parent?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes since the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagementServer;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Delete extends StandardParameters {
        /**
         * Required. Name of the resource
         */
        name?: string;
        /**
         * Optional. An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. The server will guarantee that for at least 60 minutes after the first request. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Get extends StandardParameters {
        /**
         * Required. Name of the management server resource name, in the format 'projects/{project_id\}/locations/{location\}/managementServers/{resource_name\}'
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve management servers information, in the format 'projects/{project_id\}/locations/{location\}'. In Cloud BackupDR, locations map to Google Cloud regions, for example **us-central1**. To retrieve management servers for all locations, use "-" for the '{location\}' value.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Managementservers$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
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
    export class Resource$Projects$Locations$Resourcebackupconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists ResourceBackupConfigs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Resourcebackupconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Resourcebackupconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListResourceBackupConfigsResponse>>;
        list(params: Params$Resource$Projects$Locations$Resourcebackupconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Resourcebackupconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$ListResourceBackupConfigsResponse>, callback: BodyResponseCallback<Schema$ListResourceBackupConfigsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Resourcebackupconfigs$List, callback: BodyResponseCallback<Schema$ListResourceBackupConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListResourceBackupConfigsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Resourcebackupconfigs$List extends StandardParameters {
        /**
         * Optional. Filtering results.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will use 100 as default. Maximum value is 500 and values above 500 will be coerced to 500.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results the server should return.
         */
        pageToken?: string;
        /**
         * Required. The project and location for which to retrieve resource backup configs. Format: 'projects/{project_id\}/locations/{location\}'. In Cloud Backup and DR, locations map to Google Cloud regions, for example **us-central1**.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Serviceconfig {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Initializes the service related config for a project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        initialize(params: Params$Resource$Projects$Locations$Serviceconfig$Initialize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        initialize(params?: Params$Resource$Projects$Locations$Serviceconfig$Initialize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        initialize(params: Params$Resource$Projects$Locations$Serviceconfig$Initialize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        initialize(params: Params$Resource$Projects$Locations$Serviceconfig$Initialize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        initialize(params: Params$Resource$Projects$Locations$Serviceconfig$Initialize, callback: BodyResponseCallback<Schema$Operation>): void;
        initialize(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Serviceconfig$Initialize extends StandardParameters {
        /**
         * Required. The resource name of the serviceConfig used to initialize the service. Format: `projects/{project_id\}/locations/{location\}/serviceConfig`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InitializeServiceRequest;
    }
    export {};
}
