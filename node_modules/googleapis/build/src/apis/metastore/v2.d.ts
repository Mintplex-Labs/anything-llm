import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace metastore_v2 {
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
     * Dataproc Metastore API
     *
     * The Dataproc Metastore API is used to manage the lifecycle and configuration of metastore services.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const metastore = google.metastore('v2');
     * ```
     */
    export class Metastore {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Response message for DataprocMetastore.AlterMetadataResourceLocation.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaAlterMetadataResourceLocationResponse {
    }
    /**
     * Response message for DataprocMetastore.CancelMigration.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaCancelMigrationResponse {
        /**
         * The relative resource name of the migration execution, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        migrationExecution?: string | null;
    }
    /**
     * Response message for DataprocMetastore.CompleteMigration.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaCompleteMigrationResponse {
        /**
         * The relative resource name of the migration execution, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        migrationExecution?: string | null;
    }
    /**
     * Metadata about a custom region. This is only populated if the region is a custom region. For single/multi regions, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaCustomRegionMetadata {
        /**
         * The read-only regions for this custom region.
         */
        optionalReadOnlyRegions?: string[] | null;
        /**
         * The read-write regions for this custom region.
         */
        requiredReadWriteRegions?: string[] | null;
        /**
         * The Spanner witness region for this custom region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Error details in public error message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaErrorDetails {
        /**
         * Additional structured details about this error.Keys define the failure items. Value describes the exception or details of the item.
         */
        details?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A specification of a supported version of the Hive Metastore software.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaHiveMetastoreVersion {
        /**
         * Whether version will be chosen by the server if a metastore service is created with a HiveMetastoreConfig that omits the version.
         */
        isDefault?: boolean | null;
        /**
         * The semantic version of the Hive Metastore software.
         */
        version?: string | null;
    }
    /**
     * Metadata about the service in a location.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaLocationMetadata {
        /**
         * Possible configurations supported if the current region is a custom region.
         */
        customRegionMetadata?: Schema$GoogleCloudMetastoreV1alphaCustomRegionMetadata[];
        /**
         * The multi-region metadata if the current region is a multi-region.
         */
        multiRegionMetadata?: Schema$GoogleCloudMetastoreV1alphaMultiRegionMetadata;
        /**
         * The versions of Hive Metastore that can be used when creating a new metastore service in this location. The server guarantees that exactly one HiveMetastoreVersion in the list will set is_default.
         */
        supportedHiveMetastoreVersions?: Schema$GoogleCloudMetastoreV1alphaHiveMetastoreVersion[];
    }
    /**
     * Response message for DataprocMetastore.MoveTableToDatabase.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaMoveTableToDatabaseResponse {
    }
    /**
     * The metadata for the multi-region that includes the constituent regions. The metadata is only populated if the region is multi-region. For single region or custom dual region, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaMultiRegionMetadata {
        /**
         * The regions constituting the multi-region.
         */
        constituentRegions?: string[] | null;
        /**
         * The continent for this multi-region.
         */
        continent?: string | null;
        /**
         * The Spanner witness region for this multi-region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Represents the metadata of a long-running operation.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaOperationMetadata {
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
         * Output only. Identifies whether the caller has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to Code.CANCELLED.
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
     * Response message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1alphaQueryMetadataResponse {
        /**
         * The manifest URI is link to a JSON instance in Cloud Storage. This instance manifests immediately along with QueryMetadataResponse. The content of the URI is not retriable until the long-running operation query against the metadata finishes.
         */
        resultManifestUri?: string | null;
    }
    /**
     * Response message for DataprocMetastore.AlterMetadataResourceLocation.
     */
    export interface Schema$GoogleCloudMetastoreV1AlterMetadataResourceLocationResponse {
    }
    /**
     * Response message for DataprocMetastore.AlterMetadataResourceLocation.
     */
    export interface Schema$GoogleCloudMetastoreV1betaAlterMetadataResourceLocationResponse {
    }
    /**
     * Response message for DataprocMetastore.CancelMigration.
     */
    export interface Schema$GoogleCloudMetastoreV1betaCancelMigrationResponse {
        /**
         * The relative resource name of the migration execution, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        migrationExecution?: string | null;
    }
    /**
     * Response message for DataprocMetastore.CompleteMigration.
     */
    export interface Schema$GoogleCloudMetastoreV1betaCompleteMigrationResponse {
        /**
         * The relative resource name of the migration execution, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        migrationExecution?: string | null;
    }
    /**
     * Metadata about a custom region. This is only populated if the region is a custom region. For single/multi regions, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1betaCustomRegionMetadata {
        /**
         * The read-only regions for this custom region.
         */
        optionalReadOnlyRegions?: string[] | null;
        /**
         * The read-write regions for this custom region.
         */
        requiredReadWriteRegions?: string[] | null;
        /**
         * The Spanner witness region for this custom region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Error details in public error message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1betaErrorDetails {
        /**
         * Additional structured details about this error.Keys define the failure items. Value describes the exception or details of the item.
         */
        details?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A specification of a supported version of the Hive Metastore software.
     */
    export interface Schema$GoogleCloudMetastoreV1betaHiveMetastoreVersion {
        /**
         * Whether version will be chosen by the server if a metastore service is created with a HiveMetastoreConfig that omits the version.
         */
        isDefault?: boolean | null;
        /**
         * The semantic version of the Hive Metastore software.
         */
        version?: string | null;
    }
    /**
     * Metadata about the service in a location.
     */
    export interface Schema$GoogleCloudMetastoreV1betaLocationMetadata {
        /**
         * Possible configurations supported if the current region is a custom region.
         */
        customRegionMetadata?: Schema$GoogleCloudMetastoreV1betaCustomRegionMetadata[];
        /**
         * The multi-region metadata if the current region is a multi-region.
         */
        multiRegionMetadata?: Schema$GoogleCloudMetastoreV1betaMultiRegionMetadata;
        /**
         * The versions of Hive Metastore that can be used when creating a new metastore service in this location. The server guarantees that exactly one HiveMetastoreVersion in the list will set is_default.
         */
        supportedHiveMetastoreVersions?: Schema$GoogleCloudMetastoreV1betaHiveMetastoreVersion[];
    }
    /**
     * Response message for DataprocMetastore.MoveTableToDatabase.
     */
    export interface Schema$GoogleCloudMetastoreV1betaMoveTableToDatabaseResponse {
    }
    /**
     * The metadata for the multi-region that includes the constituent regions. The metadata is only populated if the region is multi-region. For single region or custom dual region, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1betaMultiRegionMetadata {
        /**
         * The regions constituting the multi-region.
         */
        constituentRegions?: string[] | null;
        /**
         * The continent for this multi-region.
         */
        continent?: string | null;
        /**
         * The Spanner witness region for this multi-region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Represents the metadata of a long-running operation.
     */
    export interface Schema$GoogleCloudMetastoreV1betaOperationMetadata {
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
         * Output only. Identifies whether the caller has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to Code.CANCELLED.
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
     * Response message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1betaQueryMetadataResponse {
        /**
         * The manifest URI is link to a JSON instance in Cloud Storage. This instance manifests immediately along with QueryMetadataResponse. The content of the URI is not retriable until the long-running operation query against the metadata finishes.
         */
        resultManifestUri?: string | null;
    }
    /**
     * Metadata about a custom region. This is only populated if the region is a custom region. For single/multi regions, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1CustomRegionMetadata {
        /**
         * The read-only regions for this custom region.
         */
        optionalReadOnlyRegions?: string[] | null;
        /**
         * The read-write regions for this custom region.
         */
        requiredReadWriteRegions?: string[] | null;
        /**
         * The Spanner witness region for this custom region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Error details in public error message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1ErrorDetails {
        /**
         * Additional structured details about this error.Keys define the failure items. Value describes the exception or details of the item.
         */
        details?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A specification of a supported version of the Hive Metastore software.
     */
    export interface Schema$GoogleCloudMetastoreV1HiveMetastoreVersion {
        /**
         * Whether version will be chosen by the server if a metastore service is created with a HiveMetastoreConfig that omits the version.
         */
        isDefault?: boolean | null;
        /**
         * The semantic version of the Hive Metastore software.
         */
        version?: string | null;
    }
    /**
     * Metadata about the service in a location.
     */
    export interface Schema$GoogleCloudMetastoreV1LocationMetadata {
        /**
         * Possible configurations supported if the current region is a custom region.
         */
        customRegionMetadata?: Schema$GoogleCloudMetastoreV1CustomRegionMetadata[];
        /**
         * The multi-region metadata if the current region is a multi-region.
         */
        multiRegionMetadata?: Schema$GoogleCloudMetastoreV1MultiRegionMetadata;
        /**
         * The versions of Hive Metastore that can be used when creating a new metastore service in this location. The server guarantees that exactly one HiveMetastoreVersion in the list will set is_default.
         */
        supportedHiveMetastoreVersions?: Schema$GoogleCloudMetastoreV1HiveMetastoreVersion[];
    }
    /**
     * Response message for DataprocMetastore.MoveTableToDatabase.
     */
    export interface Schema$GoogleCloudMetastoreV1MoveTableToDatabaseResponse {
    }
    /**
     * The metadata for the multi-region that includes the constituent regions. The metadata is only populated if the region is multi-region. For single region or custom dual region, it will be empty.
     */
    export interface Schema$GoogleCloudMetastoreV1MultiRegionMetadata {
        /**
         * The regions constituting the multi-region.
         */
        constituentRegions?: string[] | null;
        /**
         * The continent for this multi-region.
         */
        continent?: string | null;
        /**
         * The Spanner witness region for this multi-region.
         */
        witnessRegion?: string | null;
    }
    /**
     * Represents the metadata of a long-running operation.
     */
    export interface Schema$GoogleCloudMetastoreV1OperationMetadata {
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
         * Output only. Identifies whether the caller has requested cancellation of the operation. Operations that have successfully been cancelled have google.longrunning.Operation.error value with a google.rpc.Status.code of 1, corresponding to Code.CANCELLED.
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
     * Response message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV1QueryMetadataResponse {
        /**
         * The manifest URI is link to a JSON instance in Cloud Storage. This instance manifests immediately along with QueryMetadataResponse. The content of the URI is not retriable until the long-running operation query against the metadata finishes.
         */
        resultManifestUri?: string | null;
    }
    /**
     * Request message for DataprocMetastore.AlterMetadataResourceLocation.
     */
    export interface Schema$GoogleCloudMetastoreV2AlterMetadataResourceLocationRequest {
        /**
         * Required. The new location URI for the metadata resource.
         */
        locationUri?: string | null;
        /**
         * Required. The relative metadata resource name in the following format.databases/{database_id\} or databases/{database_id\}/tables/{table_id\} or databases/{database_id\}/tables/{table_id\}/partitions/{partition_id\}
         */
        resourceName?: string | null;
    }
    /**
     * Request message for DataprocMetastore.AlterTableProperties.
     */
    export interface Schema$GoogleCloudMetastoreV2AlterTablePropertiesRequest {
        /**
         * A map that describes the desired values to mutate. If update_mask is empty, the properties will not update. Otherwise, the properties only alters the value whose associated paths exist in the update mask
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The name of the table containing the properties you're altering in the following format.databases/{database_id\}/tables/{table_id\}
         */
        tableName?: string | null;
        /**
         * A field mask that specifies the metadata table properties that are overwritten by the update. Fields specified in the update_mask are relative to the resource (not to the full request). A field is overwritten if it is in the mask.For example, given the target properties: properties { a: 1 b: 2 \} And an update properties: properties { a: 2 b: 3 c: 4 \} then if the field mask is:paths: "properties.b", "properties.c"then the result will be: properties { a: 1 b: 3 c: 4 \}
         */
        updateMask?: string | null;
    }
    /**
     * Configuration information for the auxiliary service versions.
     */
    export interface Schema$GoogleCloudMetastoreV2AuxiliaryVersionConfig {
        /**
         * A mapping of Hive metastore configuration key-value pairs to apply to the auxiliary Hive metastore (configured in hive-site.xml) in addition to the primary version's overrides. If keys are present in both the auxiliary version's overrides and the primary version's overrides, the value from the auxiliary version's overrides takes precedence.
         */
        configOverrides?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The list of endpoints used to access the auxiliary metastore service, includes version and region data.
         */
        endpoints?: Schema$GoogleCloudMetastoreV2Endpoint[];
        /**
         * The Hive metastore version of the auxiliary service. It must be less than the primary Hive metastore service's version.
         */
        version?: string | null;
    }
    /**
     * The details of a backup resource.
     */
    export interface Schema$GoogleCloudMetastoreV2Backup {
        /**
         * Output only. The time when the backup was started.
         */
        createTime?: string | null;
        /**
         * The description of the backup.
         */
        description?: string | null;
        /**
         * Output only. The time when the backup finished creating.
         */
        endTime?: string | null;
        /**
         * Immutable. The relative resource name of the backup, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/backups/{backup_id\}
         */
        name?: string | null;
        /**
         * Output only. Services that are restoring from the backup.
         */
        restoringServices?: string[] | null;
        /**
         * Output only. The revision of the service at the time of backup.
         */
        serviceRevision?: Schema$GoogleCloudMetastoreV2Service;
        /**
         * Output only. The current state of the backup.
         */
        state?: string | null;
    }
    /**
     * A specification of the location and metadata type for a database dump from a relational database management system.
     */
    export interface Schema$GoogleCloudMetastoreV2DatabaseDump {
        /**
         * Required. A Cloud Storage object or folder URI that specifies the source from which to import metadata. It must begin with gs://.
         */
        gcsUri?: string | null;
        /**
         * Optional. The type of the database dump. If unspecified, defaults to MYSQL.
         */
        type?: string | null;
    }
    /**
     * Specifies how metastore metadata should be integrated with the Data Catalog service.
     */
    export interface Schema$GoogleCloudMetastoreV2DataCatalogConfig {
        /**
         * Optional. Defines whether the metastore metadata should be synced to Data Catalog. The default value is to disable syncing metastore metadata to Data Catalog.
         */
        enabled?: boolean | null;
    }
    /**
     * Encryption settings for the service.
     */
    export interface Schema$GoogleCloudMetastoreV2EncryptionConfig {
    }
    /**
     * An endpoint used to access the metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2Endpoint {
        /**
         * Output only. The URI of the endpoint used to access the metastore service.
         */
        endpointUri?: string | null;
        /**
         * Output only. The region where the endpoint is located.
         */
        region?: string | null;
    }
    /**
     * Request message for DataprocMetastore.ExportMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV2ExportMetadataRequest {
        /**
         * Optional. The type of the database dump. If unspecified, defaults to MYSQL.
         */
        databaseDumpType?: string | null;
        /**
         * A Cloud Storage URI of a folder, in the format gs:///. A sub-folder containing exported files will be created below it.
         */
        destinationGcsFolder?: string | null;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format). A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string | null;
    }
    /**
     * Specifies configuration information specific to running Hive metastore software as the metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2HiveMetastoreConfig {
        /**
         * Optional. A mapping of Hive metastore version to the auxiliary version configuration. When specified, a secondary Hive metastore service is created along with the primary service. All auxiliary versions must be less than the service's primary version. The key is the auxiliary service name and it must match the regular expression a-z?. This means that the first character must be a lowercase letter, and all the following characters must be hyphens, lowercase letters, or digits, except the last character, which cannot be a hyphen.
         */
        auxiliaryVersions?: {
            [key: string]: Schema$GoogleCloudMetastoreV2AuxiliaryVersionConfig;
        } | null;
        /**
         * Optional. A mapping of Hive metastore configuration key-value pairs to apply to the Hive metastore (configured in hive-site.xml). The mappings override system defaults (some keys cannot be overridden). These overrides are also applied to auxiliary versions and can be further customized in the auxiliary version's AuxiliaryVersionConfig.
         */
        configOverrides?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The protocol to use for the metastore service endpoint. If unspecified, defaults to GRPC.
         */
        endpointProtocol?: string | null;
        /**
         * Immutable. The Hive metastore schema version.
         */
        version?: string | null;
    }
    /**
     * Request message for DataprocMetastore.CreateMetadataImport.
     */
    export interface Schema$GoogleCloudMetastoreV2ImportMetadataRequest {
        /**
         * Immutable. A database dump from a pre-existing metastore's database.
         */
        databaseDump?: Schema$GoogleCloudMetastoreV2DatabaseDump;
        /**
         * Optional. The description of the metadata import.
         */
        description?: string | null;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format). A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string | null;
    }
    /**
     * The details of the latest scheduled backup.
     */
    export interface Schema$GoogleCloudMetastoreV2LatestBackup {
        /**
         * Output only. The ID of an in-progress scheduled backup. Empty if no backup is in progress.
         */
        backupId?: string | null;
        /**
         * Output only. The duration of the backup completion.
         */
        duration?: string | null;
        /**
         * Output only. The time when the backup was started.
         */
        startTime?: string | null;
        /**
         * Output only. The current state of the backup.
         */
        state?: string | null;
    }
    /**
     * Response message for DataprocMetastore.ListBackups.
     */
    export interface Schema$GoogleCloudMetastoreV2ListBackupsResponse {
        /**
         * The backups of the specified service.
         */
        backups?: Schema$GoogleCloudMetastoreV2Backup[];
        /**
         * A token that can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for DataprocMetastore.ListServices.
     */
    export interface Schema$GoogleCloudMetastoreV2ListServicesResponse {
        /**
         * A token that can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The services in the specified location.
         */
        services?: Schema$GoogleCloudMetastoreV2Service[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Specifies how metastore metadata should be integrated with external services.
     */
    export interface Schema$GoogleCloudMetastoreV2MetadataIntegration {
        /**
         * Optional. The integration config for the Data Catalog service.
         */
        dataCatalogConfig?: Schema$GoogleCloudMetastoreV2DataCatalogConfig;
    }
    /**
     * Request message for DataprocMetastore.MoveTableToDatabase.
     */
    export interface Schema$GoogleCloudMetastoreV2MoveTableToDatabaseRequest {
        /**
         * Required. The name of the database where the table resides.
         */
        dbName?: string | null;
        /**
         * Required. The name of the database where the table should be moved.
         */
        destinationDbName?: string | null;
        /**
         * Required. The name of the table to be moved.
         */
        tableName?: string | null;
    }
    /**
     * Request message for DataprocMetastore.QueryMetadata.
     */
    export interface Schema$GoogleCloudMetastoreV2QueryMetadataRequest {
        /**
         * Required. A read-only SQL query to execute against the metadata database. The query cannot change or mutate the data.
         */
        query?: string | null;
    }
    /**
     * Request message for DataprocMetastore.Restore.
     */
    export interface Schema$GoogleCloudMetastoreV2RestoreServiceRequest {
        /**
         * Optional. The relative resource name of the metastore service backup to restore from, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}/backups/{backup_id\}. Mutually exclusive with backup_location, and exactly one of the two must be set.
         */
        backup?: string | null;
        /**
         * Optional. A Cloud Storage URI specifying the location of the backup artifacts, namely - backup avro files under "avro/", backup_metastore.json and service.json, in the following form:gs://. Mutually exclusive with backup, and exactly one of the two must be set.
         */
        backupLocation?: string | null;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format). A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string | null;
        /**
         * Optional. The type of restore. If unspecified, defaults to METADATA_ONLY.
         */
        restoreType?: string | null;
    }
    /**
     * Represents the scaling configuration of a metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2ScalingConfig {
        /**
         * Optional. Scaling factor from 1 to 5, increments of 1.
         */
        scalingFactor?: number | null;
    }
    /**
     * This specifies the configuration of scheduled backup.
     */
    export interface Schema$GoogleCloudMetastoreV2ScheduledBackup {
        /**
         * Optional. A Cloud Storage URI of a folder, in the format gs:///. A sub-folder containing backup files will be stored below it.
         */
        backupLocation?: string | null;
        /**
         * Optional. The scheduled interval in Cron format, see https://en.wikipedia.org/wiki/Cron The default is empty: scheduled backup is not enabled. Must be specified to enable scheduled backups.
         */
        cronSchedule?: string | null;
        /**
         * Optional. Defines whether the scheduled backup is enabled. The default value is false.
         */
        enabled?: boolean | null;
        /**
         * Output only. The details of the latest scheduled backup.
         */
        latestBackup?: Schema$GoogleCloudMetastoreV2LatestBackup;
        /**
         * Output only. The time when the next backups execution is scheduled to start.
         */
        nextScheduledTime?: string | null;
        /**
         * Optional. Specifies the time zone to be used when interpreting cron_schedule. Must be a time zone name from the time zone database (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g. America/Los_Angeles or Africa/Abidjan. If left unspecified, the default is UTC.
         */
        timeZone?: string | null;
    }
    /**
     * A managed metastore service that serves metadata queries.
     */
    export interface Schema$GoogleCloudMetastoreV2Service {
        /**
         * Output only. The time when the metastore service was created.
         */
        createTime?: string | null;
        /**
         * Immutable. Information used to configure the Dataproc Metastore service to encrypt customer data at rest. Cannot be updated.
         */
        encryptionConfig?: Schema$GoogleCloudMetastoreV2EncryptionConfig;
        /**
         * Output only. The list of endpoints used to access the metastore service.
         */
        endpoints?: Schema$GoogleCloudMetastoreV2Endpoint[];
        /**
         * Configuration information specific to running Hive metastore software as the metastore service.
         */
        hiveMetastoreConfig?: Schema$GoogleCloudMetastoreV2HiveMetastoreConfig;
        /**
         * User-defined labels for the metastore service.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The setting that defines how metastore metadata should be integrated with external services and systems.
         */
        metadataIntegration?: Schema$GoogleCloudMetastoreV2MetadataIntegration;
        /**
         * Immutable. The relative resource name of the metastore service, in the following format:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string | null;
        /**
         * Optional. Scaling configuration of the metastore service.
         */
        scalingConfig?: Schema$GoogleCloudMetastoreV2ScalingConfig;
        /**
         * Optional. The configuration of scheduled backup for the metastore service.
         */
        scheduledBackup?: Schema$GoogleCloudMetastoreV2ScheduledBackup;
        /**
         * Output only. The current state of the metastore service.
         */
        state?: string | null;
        /**
         * Output only. Additional information about the current state of the metastore service, if available.
         */
        stateMessage?: string | null;
        /**
         * Output only. The globally unique resource identifier of the metastore service.
         */
        uid?: string | null;
        /**
         * Output only. The time when the metastore service was last updated.
         */
        updateTime?: string | null;
        /**
         * Required. A Cloud Storage URI (starting with gs://) that specifies the default warehouse directory of the Hive Metastore.
         */
        warehouseGcsUri?: string | null;
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is false, it means the operation is still in progress. If true, the operation is completed, and either error or response is available.
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
     * The Status type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by gRPC (https://github.com/grpc). Each Status message contains three pieces of data: error code, error message, and error details.You can find out more about this error model and how to work with it in the API Design Guide (https://cloud.google.com/apis/design/errors).
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
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        services: Resource$Projects$Locations$Services;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Services {
        context: APIRequestContext;
        backups: Resource$Projects$Locations$Services$Backups;
        constructor(context: APIRequestContext);
        /**
         * Alter metadata resource location. The metadata resource can be a database, table, or partition. This functionality only updates the parent directory for the respective metadata resource and does not transfer any existing data to the new location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        alterLocation(params: Params$Resource$Projects$Locations$Services$Alterlocation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        alterLocation(params?: Params$Resource$Projects$Locations$Services$Alterlocation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        alterLocation(params: Params$Resource$Projects$Locations$Services$Alterlocation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        alterLocation(params: Params$Resource$Projects$Locations$Services$Alterlocation, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        alterLocation(params: Params$Resource$Projects$Locations$Services$Alterlocation, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        alterLocation(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Alter metadata table properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        alterTableProperties(params: Params$Resource$Projects$Locations$Services$Altertableproperties, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        alterTableProperties(params?: Params$Resource$Projects$Locations$Services$Altertableproperties, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        alterTableProperties(params: Params$Resource$Projects$Locations$Services$Altertableproperties, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        alterTableProperties(params: Params$Resource$Projects$Locations$Services$Altertableproperties, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        alterTableProperties(params: Params$Resource$Projects$Locations$Services$Altertableproperties, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        alterTableProperties(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Creates a metastore service in a project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Services$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Services$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Services$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Services$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Services$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Services$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Services$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Services$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Exports metadata from a service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        exportMetadata(params: Params$Resource$Projects$Locations$Services$Exportmetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        exportMetadata(params?: Params$Resource$Projects$Locations$Services$Exportmetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        exportMetadata(params: Params$Resource$Projects$Locations$Services$Exportmetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        exportMetadata(params: Params$Resource$Projects$Locations$Services$Exportmetadata, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        exportMetadata(params: Params$Resource$Projects$Locations$Services$Exportmetadata, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        exportMetadata(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets the details of a single service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Services$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Services$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2Service>>;
        get(params: Params$Resource$Projects$Locations$Services$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Services$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2Service>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Service>): void;
        get(params: Params$Resource$Projects$Locations$Services$Get, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Service>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Service>): void;
        /**
         * Imports Metadata into a Dataproc Metastore service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        importMetadata(params: Params$Resource$Projects$Locations$Services$Importmetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        importMetadata(params?: Params$Resource$Projects$Locations$Services$Importmetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        importMetadata(params: Params$Resource$Projects$Locations$Services$Importmetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        importMetadata(params: Params$Resource$Projects$Locations$Services$Importmetadata, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        importMetadata(params: Params$Resource$Projects$Locations$Services$Importmetadata, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        importMetadata(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists services in a project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Services$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Services$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2ListServicesResponse>>;
        list(params: Params$Resource$Projects$Locations$Services$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Services$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListServicesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListServicesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Services$List, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListServicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListServicesResponse>): void;
        /**
         * Move a table to another database.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        moveTableToDatabase(params: Params$Resource$Projects$Locations$Services$Movetabletodatabase, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        moveTableToDatabase(params?: Params$Resource$Projects$Locations$Services$Movetabletodatabase, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        moveTableToDatabase(params: Params$Resource$Projects$Locations$Services$Movetabletodatabase, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        moveTableToDatabase(params: Params$Resource$Projects$Locations$Services$Movetabletodatabase, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        moveTableToDatabase(params: Params$Resource$Projects$Locations$Services$Movetabletodatabase, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        moveTableToDatabase(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Updates the parameters of a single service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Services$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Services$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Services$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Services$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Services$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Query Dataproc Metastore metadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryMetadata(params: Params$Resource$Projects$Locations$Services$Querymetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryMetadata(params?: Params$Resource$Projects$Locations$Services$Querymetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        queryMetadata(params: Params$Resource$Projects$Locations$Services$Querymetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryMetadata(params: Params$Resource$Projects$Locations$Services$Querymetadata, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        queryMetadata(params: Params$Resource$Projects$Locations$Services$Querymetadata, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        queryMetadata(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Restores a service from a backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restore(params: Params$Resource$Projects$Locations$Services$Restore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restore(params?: Params$Resource$Projects$Locations$Services$Restore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        restore(params: Params$Resource$Projects$Locations$Services$Restore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restore(params: Params$Resource$Projects$Locations$Services$Restore, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        restore(params: Params$Resource$Projects$Locations$Services$Restore, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        restore(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Services$Alterlocation extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to mutate metadata, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2AlterMetadataResourceLocationRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Altertableproperties extends StandardParameters {
        /**
         * Required. The relative resource name of the Dataproc Metastore service that's being used to mutate metadata table properties, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2AlterTablePropertiesRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Create extends StandardParameters {
        /**
         * Required. The relative resource name of the location in which to create a metastore service, in the following form:projects/{project_number\}/locations/{location_id\}.
         */
        parent?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
        /**
         * Required. The ID of the metastore service, which is used as the final component of the metastore service's name.This value must be between 2 and 63 characters long inclusive, begin with a letter, end with a letter or number, and consist of alpha-numeric ASCII characters or hyphens.
         */
        serviceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2Service;
    }
    export interface Params$Resource$Projects$Locations$Services$Delete extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to delete, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Exportmetadata extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to run export, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2ExportMetadataRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Get extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to retrieve, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Importmetadata extends StandardParameters {
        /**
         * Immutable. The relative resource name of the metastore service to run import, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2ImportMetadataRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$List extends StandardParameters {
        /**
         * Optional. The filter to apply to list results.
         */
        filter?: string;
        /**
         * Optional. Specify the ordering of results as described in Sorting Order (https://cloud.google.com/apis/design/design_patterns#sorting_order). If not specified, the results will be sorted in the default order.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of services to return. The response may contain less than the maximum number. If unspecified, no more than 500 services are returned. The maximum value is 1000; values above 1000 are changed to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous DataprocMetastore.ListServices call. Provide this token to retrieve the subsequent page.To retrieve the first page, supply an empty page token.When paginating, other parameters provided to DataprocMetastore.ListServices must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The relative resource name of the location of metastore services to list, in the following form:projects/{project_number\}/locations/{location_id\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Movetabletodatabase extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to mutate metadata, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2MoveTableToDatabaseRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Patch extends StandardParameters {
        /**
         * Immutable. The relative resource name of the metastore service, in the following format:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
        /**
         * Required. A field mask used to specify the fields to be overwritten in the metastore service resource by the update. Fields specified in the update_mask are relative to the resource (not to the full request). A field is overwritten if it is in the mask.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2Service;
    }
    export interface Params$Resource$Projects$Locations$Services$Querymetadata extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to query metadata, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2QueryMetadataRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Restore extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to run restore, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2RestoreServiceRequest;
    }
    export class Resource$Projects$Locations$Services$Backups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new backup in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Services$Backups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Services$Backups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Services$Backups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Services$Backups$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Services$Backups$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a single backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Services$Backups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Services$Backups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Services$Backups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Backups$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Backups$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single backup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Services$Backups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2Backup>>;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2Backup>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Backup>): void;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Backup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2Backup>): void;
        /**
         * Lists backups in a service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Services$Backups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2ListBackupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListBackupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListBackupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListBackupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2ListBackupsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Services$Backups$Create extends StandardParameters {
        /**
         * Required. The ID of the backup, which is used as the final component of the backup's name.This value must be between 1 and 64 characters long, begin with a letter, end with a letter or number, and consist of alpha-numeric ASCII characters or hyphens.
         */
        backupId?: string;
        /**
         * Required. The relative resource name of the service in which to create a backup of the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        parent?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2Backup;
    }
    export interface Params$Resource$Projects$Locations$Services$Backups$Delete extends StandardParameters {
        /**
         * Required. The relative resource name of the backup to delete, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/backups/{backup_id\}.
         */
        name?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Backups$Get extends StandardParameters {
        /**
         * Required. The relative resource name of the backup to retrieve, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/backups/{backup_id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Backups$List extends StandardParameters {
        /**
         * Optional. The filter to apply to list results.
         */
        filter?: string;
        /**
         * Optional. Specify the ordering of results as described in Sorting Order (https://cloud.google.com/apis/design/design_patterns#sorting_order). If not specified, the results will be sorted in the default order.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of backups to return. The response may contain less than the maximum number. If unspecified, no more than 500 backups are returned. The maximum value is 1000; values above 1000 are changed to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous DataprocMetastore.ListBackups call. Provide this token to retrieve the subsequent page.To retrieve the first page, supply an empty page token.When paginating, other parameters provided to DataprocMetastore.ListBackups must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The relative resource name of the service whose backups to list, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/backups.
         */
        parent?: string;
    }
    export {};
}
