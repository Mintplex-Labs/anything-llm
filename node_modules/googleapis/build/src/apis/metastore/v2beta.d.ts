import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace metastore_v2beta {
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
     * Dataproc Metastore API
     *
     * The Dataproc Metastore API is used to manage the lifecycle and configuration of metastore services.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const metastore = google.metastore('v2beta');
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
    export interface Schema$GoogleCloudMetastoreV2betaAlterMetadataResourceLocationRequest {
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
    export interface Schema$GoogleCloudMetastoreV2betaAlterTablePropertiesRequest {
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
     * Represents the autoscaling configuration of a metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2betaAutoscalingConfig {
        /**
         * Optional. Whether or not autoscaling is enabled for this service.
         */
        autoscalingEnabled?: boolean | null;
        /**
         * Output only. The scaling factor of a service with autoscaling enabled.
         */
        autoscalingFactor?: number | null;
        /**
         * Optional. The LimitConfig of the service.
         */
        limitConfig?: Schema$GoogleCloudMetastoreV2betaLimitConfig;
    }
    /**
     * Configuration information for the auxiliary service versions.
     */
    export interface Schema$GoogleCloudMetastoreV2betaAuxiliaryVersionConfig {
        /**
         * A mapping of Hive metastore configuration key-value pairs to apply to the auxiliary Hive metastore (configured in hive-site.xml) in addition to the primary version's overrides. If keys are present in both the auxiliary version's overrides and the primary version's overrides, the value from the auxiliary version's overrides takes precedence.
         */
        configOverrides?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The list of endpoints used to access the auxiliary metastore service, includes version and region data.
         */
        endpoints?: Schema$GoogleCloudMetastoreV2betaEndpoint[];
        /**
         * The Hive metastore version of the auxiliary service. It must be less than the primary Hive metastore service's version.
         */
        version?: string | null;
    }
    /**
     * The details of a backup resource.
     */
    export interface Schema$GoogleCloudMetastoreV2betaBackup {
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
        serviceRevision?: Schema$GoogleCloudMetastoreV2betaService;
        /**
         * Output only. The current state of the backup.
         */
        state?: string | null;
    }
    /**
     * Request message for DataprocMetastore.CancelMigration.
     */
    export interface Schema$GoogleCloudMetastoreV2betaCancelMigrationRequest {
    }
    /**
     * Configuration information to start the Change Data Capture (CDC) streams from customer database to backend database of Dataproc Metastore.
     */
    export interface Schema$GoogleCloudMetastoreV2betaCdcConfig {
        /**
         * Optional. The bucket to write the intermediate stream event data in. The bucket name must be without any prefix like "gs://". See the bucket naming requirements (https://cloud.google.com/storage/docs/buckets#naming). This field is optional. If not set, the Artifacts Cloud Storage bucket will be used.
         */
        bucket?: string | null;
        /**
         * Required. Input only. The password for the user that Datastream service should use for the MySQL connection. This field is not returned on request.
         */
        password?: string | null;
        /**
         * Required. The URL of the subnetwork resource to create the VM instance hosting the reverse proxy in. More context in https://cloud.google.com/datastream/docs/private-connectivity#reverse-csql-proxy The subnetwork should reside in the network provided in the request that Datastream will peer to and should be in the same region as Datastream, in the following format. projects/{project_id\}/regions/{region_id\}/subnetworks/{subnetwork_id\}
         */
        reverseProxySubnet?: string | null;
        /**
         * Optional. The root path inside the Cloud Storage bucket. The stream event data will be written to this path. The default value is /migration.
         */
        rootPath?: string | null;
        /**
         * Required. A /29 CIDR IP range for peering with datastream.
         */
        subnetIpRange?: string | null;
        /**
         * Required. The username that the Datastream service should use for the MySQL connection.
         */
        username?: string | null;
        /**
         * Required. Fully qualified name of the Cloud SQL instance's VPC network or the shared VPC network that Datastream will peer to, in the following format: projects/{project_id\}/locations/global/networks/{network_id\}. More context in https://cloud.google.com/datastream/docs/network-connectivity-options#privateconnectivity
         */
        vpcNetwork?: string | null;
    }
    /**
     * Configuration information to establish customer database connection before the cutover phase of migration
     */
    export interface Schema$GoogleCloudMetastoreV2betaCloudSQLConnectionConfig {
        /**
         * Required. The hive database name.
         */
        hiveDatabaseName?: string | null;
        /**
         * Required. Cloud SQL database connection name (project_id:region:instance_name)
         */
        instanceConnectionName?: string | null;
        /**
         * Required. The private IP address of the Cloud SQL instance.
         */
        ipAddress?: string | null;
        /**
         * Required. The relative resource name of the subnetwork to be used for Private Service Connect. Note that this cannot be a regular subnet and is used only for NAT. (https://cloud.google.com/vpc/docs/about-vpc-hosted-services#psc-subnets) This subnet is used to publish the SOCKS5 proxy service. The subnet size must be at least /29 and it should reside in a network through which the Cloud SQL instance is accessible. The resource name should be in the format, projects/{project_id\}/regions/{region_id\}/subnetworks/{subnetwork_id\}
         */
        natSubnet?: string | null;
        /**
         * Required. Input only. The password for the user that Dataproc Metastore service will be using to connect to the database. This field is not returned on request.
         */
        password?: string | null;
        /**
         * Required. The network port of the database.
         */
        port?: number | null;
        /**
         * Required. The relative resource name of the subnetwork to deploy the SOCKS5 proxy service in. The subnetwork should reside in a network through which the Cloud SQL instance is accessible. The resource name should be in the format, projects/{project_id\}/regions/{region_id\}/subnetworks/{subnetwork_id\}
         */
        proxySubnet?: string | null;
        /**
         * Required. The username that Dataproc Metastore service will use to connect to the database.
         */
        username?: string | null;
    }
    /**
     * Configuration information for migrating from self-managed hive metastore on Google Cloud using Cloud SQL as the backend database to Dataproc Metastore.
     */
    export interface Schema$GoogleCloudMetastoreV2betaCloudSQLMigrationConfig {
        /**
         * Required. Configuration information to start the Change Data Capture (CDC) streams from customer database to backend database of Dataproc Metastore. Dataproc Metastore switches to using its backend database after the cutover phase of migration.
         */
        cdcConfig?: Schema$GoogleCloudMetastoreV2betaCdcConfig;
        /**
         * Required. Configuration information to establish customer database connection before the cutover phase of migration
         */
        cloudSqlConnectionConfig?: Schema$GoogleCloudMetastoreV2betaCloudSQLConnectionConfig;
    }
    /**
     * Request message for DataprocMetastore.CompleteMigration.
     */
    export interface Schema$GoogleCloudMetastoreV2betaCompleteMigrationRequest {
    }
    /**
     * A specification of the location and metadata type for a database dump from a relational database management system.
     */
    export interface Schema$GoogleCloudMetastoreV2betaDatabaseDump {
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
    export interface Schema$GoogleCloudMetastoreV2betaDataCatalogConfig {
        /**
         * Optional. Defines whether the metastore metadata should be synced to Data Catalog. The default value is to disable syncing metastore metadata to Data Catalog.
         */
        enabled?: boolean | null;
    }
    /**
     * Encryption settings for the service.
     */
    export interface Schema$GoogleCloudMetastoreV2betaEncryptionConfig {
    }
    /**
     * An endpoint used to access the metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2betaEndpoint {
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
    export interface Schema$GoogleCloudMetastoreV2betaExportMetadataRequest {
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
    export interface Schema$GoogleCloudMetastoreV2betaHiveMetastoreConfig {
        /**
         * Optional. A mapping of Hive metastore version to the auxiliary version configuration. When specified, a secondary Hive metastore service is created along with the primary service. All auxiliary versions must be less than the service's primary version. The key is the auxiliary service name and it must match the regular expression a-z?. This means that the first character must be a lowercase letter, and all the following characters must be hyphens, lowercase letters, or digits, except the last character, which cannot be a hyphen.
         */
        auxiliaryVersions?: {
            [key: string]: Schema$GoogleCloudMetastoreV2betaAuxiliaryVersionConfig;
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
    export interface Schema$GoogleCloudMetastoreV2betaImportMetadataRequest {
        /**
         * Immutable. A database dump from a pre-existing metastore's database.
         */
        databaseDump?: Schema$GoogleCloudMetastoreV2betaDatabaseDump;
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
    export interface Schema$GoogleCloudMetastoreV2betaLatestBackup {
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
     * Represents the autoscaling limit configuration of a metastore service.
     */
    export interface Schema$GoogleCloudMetastoreV2betaLimitConfig {
        /**
         * Optional. The highest scaling factor that the service should be autoscaled to.
         */
        maxScalingFactor?: number | null;
        /**
         * Optional. The lowest scaling factor that the service should be autoscaled to.
         */
        minScalingFactor?: number | null;
    }
    /**
     * Response message for DataprocMetastore.ListBackups.
     */
    export interface Schema$GoogleCloudMetastoreV2betaListBackupsResponse {
        /**
         * The backups of the specified service.
         */
        backups?: Schema$GoogleCloudMetastoreV2betaBackup[];
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
     * Response message for DataprocMetastore.ListMigrationExecutions.
     */
    export interface Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse {
        /**
         * The migration executions on the specified service.
         */
        migrationExecutions?: Schema$GoogleCloudMetastoreV2betaMigrationExecution[];
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
    export interface Schema$GoogleCloudMetastoreV2betaListServicesResponse {
        /**
         * A token that can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The services in the specified location.
         */
        services?: Schema$GoogleCloudMetastoreV2betaService[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Specifies how metastore metadata should be integrated with external services.
     */
    export interface Schema$GoogleCloudMetastoreV2betaMetadataIntegration {
        /**
         * Optional. The integration config for the Data Catalog service.
         */
        dataCatalogConfig?: Schema$GoogleCloudMetastoreV2betaDataCatalogConfig;
    }
    /**
     * The details of a migration execution resource.
     */
    export interface Schema$GoogleCloudMetastoreV2betaMigrationExecution {
        /**
         * Configuration information specific to migrating from self-managed hive metastore on Google Cloud using Cloud SQL as the backend database to Dataproc Metastore.
         */
        cloudSqlMigrationConfig?: Schema$GoogleCloudMetastoreV2betaCloudSQLMigrationConfig;
        /**
         * Output only. The time when the migration execution was started.
         */
        createTime?: string | null;
        /**
         * Output only. The time when the migration execution finished.
         */
        endTime?: string | null;
        /**
         * Output only. The relative resource name of the migration execution, in the following form: projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}
         */
        name?: string | null;
        /**
         * Output only. The current phase of the migration execution.
         */
        phase?: string | null;
        /**
         * Output only. The current state of the migration execution.
         */
        state?: string | null;
        /**
         * Output only. Additional information about the current state of the migration execution.
         */
        stateMessage?: string | null;
    }
    /**
     * Request message for DataprocMetastore.MoveTableToDatabase.
     */
    export interface Schema$GoogleCloudMetastoreV2betaMoveTableToDatabaseRequest {
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
    export interface Schema$GoogleCloudMetastoreV2betaQueryMetadataRequest {
        /**
         * Required. A read-only SQL query to execute against the metadata database. The query cannot change or mutate the data.
         */
        query?: string | null;
    }
    /**
     * Request message for DataprocMetastore.RemoveIamPolicy.
     */
    export interface Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyRequest {
        /**
         * Optional. Removes IAM policy attached to database or table asynchronously when it is set. The default is false.
         */
        asynchronous?: boolean | null;
    }
    /**
     * Response message for DataprocMetastore.RemoveIamPolicy.
     */
    export interface Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse {
        /**
         * True if the policy is successfully removed.
         */
        success?: boolean | null;
    }
    /**
     * Request message for DataprocMetastore.Restore.
     */
    export interface Schema$GoogleCloudMetastoreV2betaRestoreServiceRequest {
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
    export interface Schema$GoogleCloudMetastoreV2betaScalingConfig {
        /**
         * Optional. The autoscaling configuration.
         */
        autoscalingConfig?: Schema$GoogleCloudMetastoreV2betaAutoscalingConfig;
        /**
         * Optional. Scaling factor from 1 to 5, increments of 1.
         */
        scalingFactor?: number | null;
    }
    /**
     * This specifies the configuration of scheduled backup.
     */
    export interface Schema$GoogleCloudMetastoreV2betaScheduledBackup {
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
        latestBackup?: Schema$GoogleCloudMetastoreV2betaLatestBackup;
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
    export interface Schema$GoogleCloudMetastoreV2betaService {
        /**
         * Output only. The time when the metastore service was created.
         */
        createTime?: string | null;
        /**
         * Immutable. Information used to configure the Dataproc Metastore service to encrypt customer data at rest. Cannot be updated.
         */
        encryptionConfig?: Schema$GoogleCloudMetastoreV2betaEncryptionConfig;
        /**
         * Output only. The list of endpoints used to access the metastore service.
         */
        endpoints?: Schema$GoogleCloudMetastoreV2betaEndpoint[];
        /**
         * Configuration information specific to running Hive metastore software as the metastore service.
         */
        hiveMetastoreConfig?: Schema$GoogleCloudMetastoreV2betaHiveMetastoreConfig;
        /**
         * User-defined labels for the metastore service.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The setting that defines how metastore metadata should be integrated with external services and systems.
         */
        metadataIntegration?: Schema$GoogleCloudMetastoreV2betaMetadataIntegration;
        /**
         * Immutable. The relative resource name of the metastore service, in the following format:projects/{project_number\}/locations/{location_id\}/services/{service_id\}.
         */
        name?: string | null;
        /**
         * Optional. Scaling configuration of the metastore service.
         */
        scalingConfig?: Schema$GoogleCloudMetastoreV2betaScalingConfig;
        /**
         * Optional. The configuration of scheduled backup for the metastore service.
         */
        scheduledBackup?: Schema$GoogleCloudMetastoreV2betaScheduledBackup;
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
     * Request message for DataprocMetastore.StartMigration.
     */
    export interface Schema$GoogleCloudMetastoreV2betaStartMigrationRequest {
        /**
         * Required. The configuration details for the migration.
         */
        migrationExecution?: Schema$GoogleCloudMetastoreV2betaMigrationExecution;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string | null;
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
        migrationExecutions: Resource$Projects$Locations$Services$Migrationexecutions;
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
         * Cancels the ongoing Managed Migration process.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancelMigration(params: Params$Resource$Projects$Locations$Services$Cancelmigration, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancelMigration(params?: Params$Resource$Projects$Locations$Services$Cancelmigration, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        cancelMigration(params: Params$Resource$Projects$Locations$Services$Cancelmigration, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancelMigration(params: Params$Resource$Projects$Locations$Services$Cancelmigration, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        cancelMigration(params: Params$Resource$Projects$Locations$Services$Cancelmigration, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        cancelMigration(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Completes the managed migration process. The Dataproc Metastore service will switch to using its own backend database after successful migration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeMigration(params: Params$Resource$Projects$Locations$Services$Completemigration, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeMigration(params?: Params$Resource$Projects$Locations$Services$Completemigration, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        completeMigration(params: Params$Resource$Projects$Locations$Services$Completemigration, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeMigration(params: Params$Resource$Projects$Locations$Services$Completemigration, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        completeMigration(params: Params$Resource$Projects$Locations$Services$Completemigration, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        completeMigration(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
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
        get(params?: Params$Resource$Projects$Locations$Services$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaService>>;
        get(params: Params$Resource$Projects$Locations$Services$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Services$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaService>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaService>): void;
        get(params: Params$Resource$Projects$Locations$Services$Get, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaService>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaService>): void;
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
        list(params?: Params$Resource$Projects$Locations$Services$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaListServicesResponse>>;
        list(params: Params$Resource$Projects$Locations$Services$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Services$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListServicesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListServicesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Services$List, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListServicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListServicesResponse>): void;
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
         * Removes the attached IAM policies for a resource
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        removeIamPolicy(params: Params$Resource$Projects$Locations$Services$Removeiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        removeIamPolicy(params?: Params$Resource$Projects$Locations$Services$Removeiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse>>;
        removeIamPolicy(params: Params$Resource$Projects$Locations$Services$Removeiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        removeIamPolicy(params: Params$Resource$Projects$Locations$Services$Removeiampolicy, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse>): void;
        removeIamPolicy(params: Params$Resource$Projects$Locations$Services$Removeiampolicy, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse>): void;
        removeIamPolicy(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyResponse>): void;
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
        /**
         * Starts the Managed Migration process.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startMigration(params: Params$Resource$Projects$Locations$Services$Startmigration, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startMigration(params?: Params$Resource$Projects$Locations$Services$Startmigration, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        startMigration(params: Params$Resource$Projects$Locations$Services$Startmigration, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startMigration(params: Params$Resource$Projects$Locations$Services$Startmigration, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        startMigration(params: Params$Resource$Projects$Locations$Services$Startmigration, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        startMigration(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Services$Alterlocation extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to mutate metadata, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaAlterMetadataResourceLocationRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Altertableproperties extends StandardParameters {
        /**
         * Required. The relative resource name of the Dataproc Metastore service that's being used to mutate metadata table properties, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaAlterTablePropertiesRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Cancelmigration extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to cancel the ongoing migration to, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaCancelMigrationRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Completemigration extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to complete the migration to, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaCompleteMigrationRequest;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaService;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaExportMetadataRequest;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaImportMetadataRequest;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaMoveTableToDatabaseRequest;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaService;
    }
    export interface Params$Resource$Projects$Locations$Services$Querymetadata extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to query metadata, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaQueryMetadataRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Removeiampolicy extends StandardParameters {
        /**
         * Required. The relative resource name of the dataplane resource to remove IAM policy, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}/databases/{database_id\} or projects/{project_id\}/locations/{location_id\}/services/{service_id\}/databases/{database_id\}/tables/{table_id\}.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaRemoveIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Restore extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to run restore, in the following form:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaRestoreServiceRequest;
    }
    export interface Params$Resource$Projects$Locations$Services$Startmigration extends StandardParameters {
        /**
         * Required. The relative resource name of the metastore service to start migrating to, in the following format:projects/{project_id\}/locations/{location_id\}/services/{service_id\}.
         */
        service?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudMetastoreV2betaStartMigrationRequest;
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
        get(params?: Params$Resource$Projects$Locations$Services$Backups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaBackup>>;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaBackup>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaBackup>): void;
        get(params: Params$Resource$Projects$Locations$Services$Backups$Get, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaBackup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaBackup>): void;
        /**
         * Lists backups in a service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Services$Backups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaListBackupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListBackupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListBackupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Services$Backups$List, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListBackupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListBackupsResponse>): void;
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
        requestBody?: Schema$GoogleCloudMetastoreV2betaBackup;
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
    export class Resource$Projects$Locations$Services$Migrationexecutions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a single migration execution.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single migration execution.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Services$Migrationexecutions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaMigrationExecution>>;
        get(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaMigrationExecution>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaMigrationExecution>): void;
        get(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$Get, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaMigrationExecution>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaMigrationExecution>): void;
        /**
         * Lists migration executions on a service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Services$Migrationexecutions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Services$Migrationexecutions$List, callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudMetastoreV2betaListMigrationExecutionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Services$Migrationexecutions$Delete extends StandardParameters {
        /**
         * Required. The relative resource name of the migrationExecution to delete, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        name?: string;
        /**
         * Optional. A request ID. Specify a unique request ID to allow the server to ignore the request if it has completed. The server will ignore subsequent requests that provide a duplicate request ID for at least 60 minutes after the first request.For example, if an initial request times out, followed by another request with the same request ID, the server ignores the second request to prevent the creation of duplicate commitments.The request ID must be a valid UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) A zero UUID (00000000-0000-0000-0000-000000000000) is not supported.
         */
        requestId?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Migrationexecutions$Get extends StandardParameters {
        /**
         * Required. The relative resource name of the migration execution to retrieve, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions/{migration_execution_id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Services$Migrationexecutions$List extends StandardParameters {
        /**
         * Optional. The filter to apply to list results.
         */
        filter?: string;
        /**
         * Optional. Specify the ordering of results as described in Sorting Order (https://cloud.google.com/apis/design/design_patterns#sorting_order). If not specified, the results will be sorted in the default order.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of migration executions to return. The response may contain less than the maximum number. If unspecified, no more than 500 migration executions are returned. The maximum value is 1000; values above 1000 are changed to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous DataprocMetastore.ListMigrationExecutions call. Provide this token to retrieve the subsequent page.To retrieve the first page, supply an empty page token.When paginating, other parameters provided to DataprocMetastore.ListMigrationExecutions must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The relative resource name of the service whose migration executions to list, in the following form:projects/{project_number\}/locations/{location_id\}/services/{service_id\}/migrationExecutions.
         */
        parent?: string;
    }
    export {};
}
