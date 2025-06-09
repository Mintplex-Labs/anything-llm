import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace logging_v2 {
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
     * Cloud Logging API
     *
     * Writes log entries and manages your Cloud Logging configuration.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const logging = google.logging('v2');
     * ```
     */
    export class Logging {
        context: APIRequestContext;
        billingAccounts: Resource$Billingaccounts;
        entries: Resource$Entries;
        exclusions: Resource$Exclusions;
        folders: Resource$Folders;
        locations: Resource$Locations;
        logs: Resource$Logs;
        monitoredResourceDescriptors: Resource$Monitoredresourcedescriptors;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        sinks: Resource$Sinks;
        v2: Resource$V2;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Metadata associated with App Hub.
     */
    export interface Schema$AppHub {
        /**
         * Metadata associated with the application.
         */
        application?: Schema$AppHubApplication;
        /**
         * Metadata associated with the service.
         */
        service?: Schema$AppHubService;
        /**
         * Metadata associated with the workload.
         */
        workload?: Schema$AppHubWorkload;
    }
    /**
     * Resource identifiers associated with an AppHub application AppHub resources are of the form projects//locations//applications/ projects//locations//applications//services/ projects//locations//applications//workloads/ These resources can be reconstructed from the components below.
     */
    export interface Schema$AppHubApplication {
        /**
         * Resource container that owns the application. Example: "projects/management_project"
         */
        container?: string | null;
        /**
         * Application Id. Example: "my-app"
         */
        id?: string | null;
        /**
         * Location associated with the Application. Example: "us-east1"
         */
        location?: string | null;
    }
    /**
     * Metadata associated with an App Hub service.
     */
    export interface Schema$AppHubService {
        /**
         * Service criticality type Example: "CRITICAL"
         */
        criticalityType?: string | null;
        /**
         * Service environment type Example: "DEV"
         */
        environmentType?: string | null;
        /**
         * Service Id. Example: "my-service"
         */
        id?: string | null;
    }
    /**
     * Metadata associated with an App Hub workload.
     */
    export interface Schema$AppHubWorkload {
        /**
         * Workload criticality type Example: "CRITICAL"
         */
        criticalityType?: string | null;
        /**
         * Workload environment type Example: "DEV"
         */
        environmentType?: string | null;
        /**
         * Workload Id. Example: "my-workload"
         */
        id?: string | null;
    }
    /**
     * Describes a BigQuery dataset that was created by a link.
     */
    export interface Schema$BigQueryDataset {
        /**
         * Output only. The full resource name of the BigQuery dataset. The DATASET_ID will match the ID of the link, so the link must match the naming restrictions of BigQuery datasets (alphanumeric characters and underscores only).The dataset will have a resource path of "bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATASET_ID"
         */
        datasetId?: string | null;
    }
    /**
     * Options that change functionality of a sink exporting data to BigQuery.
     */
    export interface Schema$BigQueryOptions {
        /**
         * Optional. Whether to use BigQuery's partition tables (https://cloud.google.com/bigquery/docs/partitioned-tables). By default, Cloud Logging creates dated tables based on the log entries' timestamps, e.g. syslog_20170523. With partitioned tables the date suffix is no longer present and special query syntax (https://cloud.google.com/bigquery/docs/querying-partitioned-tables) has to be used instead. In both cases, tables are sharded based on UTC timezone.
         */
        usePartitionedTables?: boolean | null;
        /**
         * Output only. True if new timestamp column based partitioning is in use, false if legacy ingress-time partitioning is in use.All new sinks will have this field set true and will use timestamp column based partitioning. If use_partitioned_tables is false, this value has no meaning and will be false. Legacy sinks using partitioned tables will have this field set to false.
         */
        usesTimestampColumnPartitioning?: boolean | null;
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
     * Metadata for LongRunningUpdateBucket Operations.
     */
    export interface Schema$BucketMetadata {
        /**
         * LongRunningCreateBucket RPC request.
         */
        createBucketRequest?: Schema$CreateBucketRequest;
        /**
         * The end time of an operation.
         */
        endTime?: string | null;
        /**
         * The create time of an operation.
         */
        startTime?: string | null;
        /**
         * Output only. State of an operation.
         */
        state?: string | null;
        /**
         * LongRunningUpdateBucket RPC request.
         */
        updateBucketRequest?: Schema$UpdateBucketRequest;
    }
    /**
     * BucketOptions describes the bucket boundaries used to create a histogram for the distribution. The buckets can be in a linear sequence, an exponential sequence, or each bucket can be specified explicitly. BucketOptions does not include the number of values in each bucket.A bucket has an inclusive lower bound and exclusive upper bound for the values that are counted for that bucket. The upper bound of a bucket must be strictly greater than the lower bound. The sequence of N buckets for a distribution consists of an underflow bucket (number 0), zero or more finite buckets (number 1 through N - 2) and an overflow bucket (number N - 1). The buckets are contiguous: the lower bound of bucket i (i \> 0) is the same as the upper bound of bucket i - 1. The buckets span the whole range of finite values: lower bound of the underflow bucket is -infinity and the upper bound of the overflow bucket is +infinity. The finite buckets are so-called because both bounds are finite.
     */
    export interface Schema$BucketOptions {
        /**
         * The explicit buckets.
         */
        explicitBuckets?: Schema$Explicit;
        /**
         * The exponential buckets.
         */
        exponentialBuckets?: Schema$Exponential;
        /**
         * The linear bucket.
         */
        linearBuckets?: Schema$Linear;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Describes the customer-managed encryption key (CMEK) settings associated with a project, folder, organization, billing account, or flexible resource.Note: CMEK for the Log Router can currently only be configured for Google Cloud organizations. Once configured, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
     */
    export interface Schema$CmekSettings {
        /**
         * Optional. The resource name for the configured Cloud KMS key.KMS key name format: "projects/[PROJECT_ID]/locations/[LOCATION]/keyRings/[KEYRING]/cryptoKeys/[KEY]" For example:"projects/my-project/locations/us-central1/keyRings/my-ring/cryptoKeys/my-key"To enable CMEK for the Log Router, set this field to a valid kms_key_name for which the associated service account has the needed cloudkms.cryptoKeyEncrypterDecrypter roles assigned for the key.The Cloud KMS key used by the Log Router can be updated by changing the kms_key_name to a new valid key name or disabled by setting the key name to an empty string. Encryption operations that are in progress will be completed with the key that was in use when they started. Decryption operations will be completed using the key that was used at the time of encryption unless access to that key has been revoked.To disable CMEK for the Log Router, set this field to an empty string.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         */
        kmsKeyName?: string | null;
        /**
         * Output only. The CryptoKeyVersion resource name for the configured Cloud KMS key.KMS key name format: "projects/[PROJECT_ID]/locations/[LOCATION]/keyRings/[KEYRING]/cryptoKeys/[KEY]/cryptoKeyVersions/[VERSION]" For example:"projects/my-project/locations/us-central1/keyRings/my-ring/cryptoKeys/my-key/cryptoKeyVersions/1"This is a read-only field used to convey the specific configured CryptoKeyVersion of kms_key that has been configured. It will be populated in cases where the CMEK settings are bound to a single key version.If this field is populated, the kms_key is tied to a specific CryptoKeyVersion.
         */
        kmsKeyVersionName?: string | null;
        /**
         * Output only. The resource name of the CMEK settings.
         */
        name?: string | null;
        /**
         * Output only. The service account that will be used by the Log Router to access your Cloud KMS key.Before enabling CMEK for Log Router, you must first assign the cloudkms.cryptoKeyEncrypterDecrypter role to the service account that the Log Router will use to access your Cloud KMS key. Use GetCmekSettings to obtain the service account ID.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         */
        serviceAccountId?: string | null;
    }
    /**
     * Metadata for CopyLogEntries long running operations.
     */
    export interface Schema$CopyLogEntriesMetadata {
        /**
         * Identifies whether the user has requested cancellation of the operation.
         */
        cancellationRequested?: boolean | null;
        /**
         * Destination to which to copy log entries.For example, a Cloud Storage bucket:"storage.googleapis.com/my-cloud-storage-bucket"
         */
        destination?: string | null;
        /**
         * The end time of an operation.
         */
        endTime?: string | null;
        /**
         * Estimated progress of the operation (0 - 100%).
         */
        progress?: number | null;
        /**
         * CopyLogEntries RPC request. This field is deprecated and not used.
         */
        request?: Schema$CopyLogEntriesRequest;
        /**
         * Source from which to copy log entries.For example, a log bucket:"projects/my-project/locations/global/buckets/my-source-bucket"
         */
        source?: string | null;
        /**
         * The create time of an operation.
         */
        startTime?: string | null;
        /**
         * Output only. State of an operation.
         */
        state?: string | null;
        /**
         * Name of the verb executed by the operation.For example,"copy"
         */
        verb?: string | null;
        /**
         * The IAM identity of a service account that must be granted access to the destination.If the service account is not granted permission to the destination within an hour, the operation will be cancelled.For example: "serviceAccount:foo@bar.com"
         */
        writerIdentity?: string | null;
    }
    /**
     * The parameters to CopyLogEntries.
     */
    export interface Schema$CopyLogEntriesRequest {
        /**
         * Required. Destination to which to copy log entries. For example: "storage.googleapis.com/GCS_BUCKET"
         */
        destination?: string | null;
        /**
         * Optional. A filter specifying which log entries to copy. The filter must be no more than 20k characters. An empty filter matches all log entries.
         */
        filter?: string | null;
        /**
         * Required. Log bucket from which to copy log entries.For example:"projects/my-project/locations/global/buckets/my-source-bucket"
         */
        name?: string | null;
    }
    /**
     * Response type for CopyLogEntries long running operations.
     */
    export interface Schema$CopyLogEntriesResponse {
        /**
         * Number of log entries copied.
         */
        logEntriesCopiedCount?: string | null;
    }
    /**
     * The parameters to CreateBucket.
     */
    export interface Schema$CreateBucketRequest {
        /**
         * Required. The new bucket. The region specified in the new bucket must be compliant with any Location Restriction Org Policy. The name field in the bucket is ignored.
         */
        bucket?: Schema$LogBucket;
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string | null;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string | null;
    }
    /**
     * The parameters to CreateLink.
     */
    export interface Schema$CreateLinkRequest {
        /**
         * Required. The new link.
         */
        link?: Schema$Link;
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string | null;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string | null;
    }
    /**
     * Describes the custom _Default sink configuration that is used to override the built-in _Default sink configuration in newly created resource containers, such as projects or folders.
     */
    export interface Schema$DefaultSinkConfig {
        /**
         * Optional. Specifies the set of exclusions to be added to the _Default sink in newly created resource containers.
         */
        exclusions?: Schema$LogExclusion[];
        /**
         * Optional. An advanced logs filter (https://cloud.google.com/logging/docs/view/advanced-queries). The only exported log entries are those that are in the resource owning the sink and that match the filter.For example:logName="projects/[PROJECT_ID]/logs/[LOG_ID]" AND severity\>=ERRORTo match all logs, don't add exclusions and use the following line as the value of filter:logName:*Cannot be empty or unset when the value of mode is OVERWRITE.
         */
        filter?: string | null;
        /**
         * Required. Determines the behavior to apply to the built-in _Default sink inclusion filter.Exclusions are always appended, as built-in _Default sinks have no exclusions.
         */
        mode?: string | null;
    }
    /**
     * The parameters to DeleteLink.
     */
    export interface Schema$DeleteLinkRequest {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Specifies a set of buckets with arbitrary widths.There are size(bounds) + 1 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): boundsi Lower bound (1 <= i < N); boundsi - 1The bounds field must contain at least one element. If bounds has only one element, then there are no finite buckets, and that single element is the common boundary of the overflow and underflow buckets.
     */
    export interface Schema$Explicit {
        /**
         * The values must be monotonically increasing.
         */
        bounds?: number[] | null;
    }
    /**
     * Specifies an exponential sequence of buckets that have a width that is proportional to the value of the lower bound. Each bucket represents a constant relative uncertainty on a specific value in the bucket.There are num_finite_buckets + 2 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): scale * (growth_factor ^ i).Lower bound (1 <= i < N): scale * (growth_factor ^ (i - 1)).
     */
    export interface Schema$Exponential {
        /**
         * Must be greater than 1.
         */
        growthFactor?: number | null;
        /**
         * Must be greater than 0.
         */
        numFiniteBuckets?: number | null;
        /**
         * Must be greater than 0.
         */
        scale?: number | null;
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
     * A common proto for logging HTTP requests. Only contains semantics defined by the HTTP specification. Product-specific logging information MUST be defined in a separate message.
     */
    export interface Schema$HttpRequest {
        /**
         * The number of HTTP response bytes inserted into cache. Set only when a cache fill was attempted.
         */
        cacheFillBytes?: string | null;
        /**
         * Whether or not an entity was served from cache (with or without validation).
         */
        cacheHit?: boolean | null;
        /**
         * Whether or not a cache lookup was attempted.
         */
        cacheLookup?: boolean | null;
        /**
         * Whether or not the response was validated with the origin server before being served from cache. This field is only meaningful if cache_hit is True.
         */
        cacheValidatedWithOriginServer?: boolean | null;
        /**
         * The request processing latency on the server, from the time the request was received until the response was sent. For WebSocket connections, this field refers to the entire time duration of the connection.
         */
        latency?: string | null;
        /**
         * Protocol used for the request. Examples: "HTTP/1.1", "HTTP/2"
         */
        protocol?: string | null;
        /**
         * The referer URL of the request, as defined in HTTP/1.1 Header Field Definitions (https://datatracker.ietf.org/doc/html/rfc2616#section-14.36).
         */
        referer?: string | null;
        /**
         * The IP address (IPv4 or IPv6) of the client that issued the HTTP request. This field can include port information. Examples: "192.168.1.1", "10.0.0.1:80", "FE80::0202:B3FF:FE1E:8329".
         */
        remoteIp?: string | null;
        /**
         * The request method. Examples: "GET", "HEAD", "PUT", "POST".
         */
        requestMethod?: string | null;
        /**
         * The size of the HTTP request message in bytes, including the request headers and the request body.
         */
        requestSize?: string | null;
        /**
         * The scheme (http, https), the host name, the path and the query portion of the URL that was requested. Example: "http://example.com/some/info?color=red".
         */
        requestUrl?: string | null;
        /**
         * The size of the HTTP response message sent back to the client, in bytes, including the response headers and the response body.
         */
        responseSize?: string | null;
        /**
         * The IP address (IPv4 or IPv6) of the origin server that the request was sent to. This field can include port information. Examples: "192.168.1.1", "10.0.0.1:80", "FE80::0202:B3FF:FE1E:8329".
         */
        serverIp?: string | null;
        /**
         * The response code indicating the status of response. Examples: 200, 404.
         */
        status?: number | null;
        /**
         * The user agent sent by the client. Example: "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; Q312461; .NET CLR 1.0.3705)".
         */
        userAgent?: string | null;
    }
    /**
     * Configuration for an indexed field.
     */
    export interface Schema$IndexConfig {
        /**
         * Output only. The timestamp when the index was last modified.This is used to return the timestamp, and will be ignored if supplied during update.
         */
        createTime?: string | null;
        /**
         * Required. The LogEntry field path to index.Note that some paths are automatically indexed, and other paths are not eligible for indexing. See indexing documentation( https://cloud.google.com/logging/docs/analyze/custom-index) for details.For example: jsonPayload.request.status
         */
        fieldPath?: string | null;
        /**
         * Required. The type of data in this index.
         */
        type?: string | null;
    }
    /**
     * A description of a label.
     */
    export interface Schema$LabelDescriptor {
        /**
         * A human-readable description for the label.
         */
        description?: string | null;
        /**
         * The label key.
         */
        key?: string | null;
        /**
         * The type of data that can be assigned to the label.
         */
        valueType?: string | null;
    }
    /**
     * Specifies a linear sequence of buckets that all have the same width (except overflow and underflow). Each bucket represents a constant absolute uncertainty on the specific value in the bucket.There are num_finite_buckets + 2 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): offset + (width * i).Lower bound (1 <= i < N): offset + (width * (i - 1)).
     */
    export interface Schema$Linear {
        /**
         * Must be greater than 0.
         */
        numFiniteBuckets?: number | null;
        /**
         * Lower bound of the first bucket.
         */
        offset?: number | null;
        /**
         * Must be greater than 0.
         */
        width?: number | null;
    }
    /**
     * Describes a link connected to an analytics enabled bucket.
     */
    export interface Schema$Link {
        /**
         * Optional. The information of a BigQuery Dataset. When a link is created, a BigQuery dataset is created along with it, in the same project as the LogBucket it's linked to. This dataset will also have BigQuery Views corresponding to the LogViews in the bucket.
         */
        bigqueryDataset?: Schema$BigQueryDataset;
        /**
         * Output only. The creation timestamp of the link.
         */
        createTime?: string | null;
        /**
         * Optional. Describes this link.The maximum length of the description is 8000 characters.
         */
        description?: string | null;
        /**
         * Output only. The resource lifecycle state.
         */
        lifecycleState?: string | null;
        /**
         * Output only. The resource name of the link. The name can have up to 100 characters. A valid link id (at the end of the link name) must only have alphanumeric characters and underscores within it. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" For example:`projects/my-project/locations/global/buckets/my-bucket/links/my_link
         */
        name?: string | null;
    }
    /**
     * Metadata for long running Link operations.
     */
    export interface Schema$LinkMetadata {
        /**
         * CreateLink RPC request.
         */
        createLinkRequest?: Schema$CreateLinkRequest;
        /**
         * DeleteLink RPC request.
         */
        deleteLinkRequest?: Schema$DeleteLinkRequest;
        /**
         * The end time of an operation.
         */
        endTime?: string | null;
        /**
         * The start time of an operation.
         */
        startTime?: string | null;
        /**
         * Output only. State of an operation.
         */
        state?: string | null;
    }
    /**
     * The response from ListBuckets.
     */
    export interface Schema$ListBucketsResponse {
        /**
         * A list of buckets.
         */
        buckets?: Schema$LogBucket[];
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
    }
    /**
     * Result returned from ListExclusions.
     */
    export interface Schema$ListExclusionsResponse {
        /**
         * A list of exclusions.
         */
        exclusions?: Schema$LogExclusion[];
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response from ListLinks.
     */
    export interface Schema$ListLinksResponse {
        /**
         * A list of links.
         */
        links?: Schema$Link[];
        /**
         * If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
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
     * The parameters to ListLogEntries.
     */
    export interface Schema$ListLogEntriesRequest {
        /**
         * Optional. A filter that chooses which log entries to return. For more information, see Logging query language (https://cloud.google.com/logging/docs/view/logging-query-language).Only log entries that match the filter are returned. An empty filter matches all log entries in the resources listed in resource_names. Referencing a parent resource that is not listed in resource_names will cause the filter to return no results. The maximum length of a filter is 20,000 characters.To make queries faster, you can make the filter more selective by using restrictions on indexed fields (https://cloud.google.com/logging/docs/view/logging-query-language#indexed-fields) as well as limit the time range of the query by adding range restrictions on the timestamp field.
         */
        filter?: string | null;
        /**
         * Optional. How the results should be sorted. Presently, the only permitted values are "timestamp asc" (default) and "timestamp desc". The first option returns entries in order of increasing values of LogEntry.timestamp (oldest first), and the second option returns entries in order of decreasing timestamps (newest first). Entries with equal timestamps are returned in order of their insert_id values.We recommend setting the order_by field to "timestamp desc" when listing recently ingested log entries. If not set, the default value of "timestamp asc" may take a long time to fetch matching logs that are only recently ingested.
         */
        orderBy?: string | null;
        /**
         * Optional. The maximum number of results to return from this request. Default is 50. If the value is negative, the request is rejected.The presence of next_page_token in the response indicates that more results might be available.
         */
        pageSize?: number | null;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. page_token must be the value of next_page_token from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string | null;
        /**
         * Optional. Deprecated. Use resource_names instead. One or more project identifiers or project numbers from which to retrieve log entries. Example: "my-project-1A".
         */
        projectIds?: string[] | null;
        /**
         * Required. Names of one or more parent resources from which to retrieve log entries. Resources may either be resource containers or specific LogViews. For the case of resource containers, all logs ingested into that container will be returned regardless of which LogBuckets they are actually stored in - i.e. these queries may fan out to multiple regions. In the event of region unavailability, specify a specific set of LogViews that do not include the unavailable region. projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID] projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]Projects listed in the project_ids field are added to this list. A maximum of 100 resources may be specified in a single request.
         */
        resourceNames?: string[] | null;
    }
    /**
     * Result returned from ListLogEntries.
     */
    export interface Schema$ListLogEntriesResponse {
        /**
         * A list of log entries. If entries is empty, nextPageToken may still be returned, indicating that more entries may exist. See nextPageToken for more information.
         */
        entries?: Schema$LogEntry[];
        /**
         * If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.If a value for next_page_token appears and the entries field is empty, it means that the search found no log entries so far but it did not have time to search all the possible log entries. Retry the method with this value for page_token to continue the search. Alternatively, consider speeding up the search by changing your filter to specify a single log name or resource type, or to narrow the time range of the search.
         */
        nextPageToken?: string | null;
    }
    /**
     * Result returned from ListLogMetrics.
     */
    export interface Schema$ListLogMetricsResponse {
        /**
         * A list of logs-based metrics.
         */
        metrics?: Schema$LogMetric[];
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response from ListLogScopes. Every project has a _Default log scope that cannot be modified or deleted.
     */
    export interface Schema$ListLogScopesResponse {
        /**
         * A list of log scopes.
         */
        logScopes?: Schema$LogScope[];
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
    }
    /**
     * Result returned from ListLogs.
     */
    export interface Schema$ListLogsResponse {
        /**
         * A list of log names. For example, "projects/my-project/logs/syslog" or "organizations/123/logs/cloudresourcemanager.googleapis.com%2Factivity".
         */
        logNames?: string[] | null;
        /**
         * If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
    }
    /**
     * Result returned from ListMonitoredResourceDescriptors.
     */
    export interface Schema$ListMonitoredResourceDescriptorsResponse {
        /**
         * If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
        /**
         * A list of resource descriptors.
         */
        resourceDescriptors?: Schema$MonitoredResourceDescriptor[];
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
     * The response from ListRecentQueries.
     */
    export interface Schema$ListRecentQueriesResponse {
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
        /**
         * A list of recent queries.
         */
        recentQueries?: Schema$RecentQuery[];
        /**
         * The unreachable resources. Each resource can be either 1) a saved query if a specific query is unreachable or 2) a location if a specific location is unreachable. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/recentQueries/[QUERY_ID]" "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global/recentQueries/12345678" "projects/my-project/locations/global"If there are unreachable resources, the response will first return pages that contain recent queries, and then return pages that contain the unreachable resources.
         */
        unreachable?: string[] | null;
    }
    /**
     * The response from ListSavedQueries.
     */
    export interface Schema$ListSavedQueriesResponse {
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
        /**
         * A list of saved queries.
         */
        savedQueries?: Schema$SavedQuery[];
        /**
         * The unreachable resources. It can be either 1) a saved query if a specific query is unreachable or 2) a location if a specific location is unreachabe. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/global/savedQueries/12345678" "projects/my-project/locations/global" If there are unreachable resources, the response will first return pages that contain saved queries, and then return pages that contain the unreachable resources.
         */
        unreachable?: string[] | null;
    }
    /**
     * Result returned from ListSinks.
     */
    export interface Schema$ListSinksResponse {
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
        /**
         * A list of sinks.
         */
        sinks?: Schema$LogSink[];
    }
    /**
     * The response from ListViews.
     */
    export interface Schema$ListViewsResponse {
        /**
         * If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
         */
        nextPageToken?: string | null;
        /**
         * A list of views.
         */
        views?: Schema$LogView[];
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
         * The canonical id for this location. For example: "us-east1".
         */
        locationId?: string | null;
        /**
         * Service-specific metadata. For example the available capacity at the given location.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Resource name for the location, which may vary between implementations. For example: "projects/example-project/locations/us-east1"
         */
        name?: string | null;
    }
    /**
     * Cloud Logging specific location metadata.
     */
    export interface Schema$LocationMetadata {
        /**
         * Indicates whether or not Log Analytics features are supported in the given location.
         */
        logAnalyticsEnabled?: boolean | null;
    }
    /**
     * Describes a repository in which log entries are stored.
     */
    export interface Schema$LogBucket {
        /**
         * Optional. Whether log analytics is enabled for this bucket.Once enabled, log analytics features cannot be disabled.
         */
        analyticsEnabled?: boolean | null;
        /**
         * Optional. The CMEK settings of the log bucket. If present, new log entries written to this log bucket are encrypted using the CMEK key provided in this configuration. If a log bucket has CMEK settings, the CMEK settings cannot be disabled later by updating the log bucket. Changing the KMS key is allowed.
         */
        cmekSettings?: Schema$CmekSettings;
        /**
         * Output only. The creation timestamp of the bucket. This is not set for any of the default buckets.
         */
        createTime?: string | null;
        /**
         * Optional. Describes this bucket.
         */
        description?: string | null;
        /**
         * Optional. A list of indexed fields and related configuration data.
         */
        indexConfigs?: Schema$IndexConfig[];
        /**
         * Output only. The bucket lifecycle state.
         */
        lifecycleState?: string | null;
        /**
         * Optional. Whether the bucket is locked.The retention period on a locked bucket cannot be changed. Locked buckets may only be deleted if they are empty.
         */
        locked?: boolean | null;
        /**
         * Output only. The resource name of the bucket.For example:projects/my-project/locations/global/buckets/my-bucketFor a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support)For the location of global it is unspecified where log entries are actually stored.After a bucket has been created, the location cannot be changed.
         */
        name?: string | null;
        /**
         * Optional. Log entry field paths that are denied access in this bucket.The following fields and their children are eligible: textPayload, jsonPayload, protoPayload, httpRequest, labels, sourceLocation.Restricting a repeated field will restrict all values. Adding a parent will block all child fields. (e.g. foo.bar will block foo.bar.baz)
         */
        restrictedFields?: string[] | null;
        /**
         * Optional. Logs will be retained by default for this amount of time, after which they will automatically be deleted. The minimum retention period is 1 day. If this value is set to zero at bucket creation time, the default time of 30 days will be used.
         */
        retentionDays?: number | null;
        /**
         * Output only. The last update timestamp of the bucket.
         */
        updateTime?: string | null;
    }
    /**
     * An individual entry in a log.
     */
    export interface Schema$LogEntry {
        /**
         * Output only. AppHub application metadata associated with this LogEntry. May be empty if there is no associated AppHub application or multiple associated applications (such as for VPC flow logs)
         */
        apphub?: Schema$AppHub;
        /**
         * Output only. The Error Reporting (https://cloud.google.com/error-reporting) error groups associated with this LogEntry. Error Reporting sets the values for this field during error group creation.For more information, see View error details( https://cloud.google.com/error-reporting/docs/viewing-errors#view_error_details)This field isn't available during log routing (https://cloud.google.com/logging/docs/routing/overview)
         */
        errorGroups?: Schema$LogErrorGroup[];
        /**
         * Optional. Information about the HTTP request associated with this log entry, if applicable.
         */
        httpRequest?: Schema$HttpRequest;
        /**
         * Optional. A unique identifier for the log entry. If you provide a value, then Logging considers other log entries in the same project, with the same timestamp, and with the same insert_id to be duplicates which are removed in a single query result. However, there are no guarantees of de-duplication in the export of logs.If the insert_id is omitted when writing a log entry, the Logging API assigns its own unique identifier in this field.In queries, the insert_id is also used to order log entries that have the same log_name and timestamp values.
         */
        insertId?: string | null;
        /**
         * The log entry payload, represented as a structure that is expressed as a JSON object.
         */
        jsonPayload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. A map of key, value pairs that provides additional information about the log entry. The labels can be user-defined or system-defined.User-defined labels are arbitrary key, value pairs that you can use to classify logs.System-defined labels are defined by GCP services for platform logs. They have two components - a service namespace component and the attribute name. For example: compute.googleapis.com/resource_name.Cloud Logging truncates label keys that exceed 512 B and label values that exceed 64 KB upon their associated log entry being written. The truncation is indicated by an ellipsis at the end of the character string.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The resource name of the log to which this log entry belongs: "projects/[PROJECT_ID]/logs/[LOG_ID]" "organizations/[ORGANIZATION_ID]/logs/[LOG_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID]" "folders/[FOLDER_ID]/logs/[LOG_ID]" A project number may be used in place of PROJECT_ID. The project number is translated to its corresponding PROJECT_ID internally and the log_name field will contain PROJECT_ID in queries and exports.[LOG_ID] must be URL-encoded within log_name. Example: "organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity".[LOG_ID] must be less than 512 characters long and can only include the following characters: upper and lower case alphanumeric characters, forward-slash, underscore, hyphen, and period.For backward compatibility, if log_name begins with a forward-slash, such as /projects/..., then the log entry is processed as usual, but the forward-slash is removed. Listing the log entry will not show the leading slash and filtering for a log name with a leading slash will never return any results.
         */
        logName?: string | null;
        /**
         * Output only. Deprecated. This field is not used by Logging. Any value written to it is cleared.
         */
        metadata?: Schema$MonitoredResourceMetadata;
        /**
         * Optional. Information about an operation associated with the log entry, if applicable.
         */
        operation?: Schema$LogEntryOperation;
        /**
         * The log entry payload, represented as a protocol buffer. Some Google Cloud Platform services use this field for their log entry payloads.The following protocol buffer types are supported; user-defined types are not supported:"type.googleapis.com/google.cloud.audit.AuditLog" "type.googleapis.com/google.appengine.logging.v1.RequestLog"
         */
        protoPayload?: {
            [key: string]: any;
        } | null;
        /**
         * Output only. The time the log entry was received by Logging.
         */
        receiveTimestamp?: string | null;
        /**
         * Required. The monitored resource that produced this log entry.Example: a log entry that reports a database error would be associated with the monitored resource designating the particular database that reported the error.
         */
        resource?: Schema$MonitoredResource;
        /**
         * Optional. The severity of the log entry. The default value is LogSeverity.DEFAULT.
         */
        severity?: string | null;
        /**
         * Optional. Source code location information associated with the log entry, if any.
         */
        sourceLocation?: Schema$LogEntrySourceLocation;
        /**
         * Optional. The ID of the Cloud Trace (https://cloud.google.com/trace) span associated with the current operation in which the log is being written. For example, if a span has the REST resource name of "projects/some-project/traces/some-trace/spans/some-span-id", then the span_id field is "some-span-id".A Span (https://cloud.google.com/trace/docs/reference/v2/rest/v2/projects.traces/batchWrite#Span) represents a single operation within a trace. Whereas a trace may involve multiple different microservices running on multiple different machines, a span generally corresponds to a single logical operation being performed in a single instance of a microservice on one specific machine. Spans are the nodes within the tree that is a trace.Applications that are instrumented for tracing (https://cloud.google.com/trace/docs/setup) will generally assign a new, unique span ID on each incoming request. It is also common to create and record additional spans corresponding to internal processing elements as well as issuing requests to dependencies.The span ID is expected to be a 16-character, hexadecimal encoding of an 8-byte array and should not be zero. It should be unique within the trace and should, ideally, be generated in a manner that is uniformly random.Example values: 000000000000004a 7a2190356c3fc94b 0000f00300090021 d39223e101960076
         */
        spanId?: string | null;
        /**
         * Optional. Information indicating this LogEntry is part of a sequence of multiple log entries split from a single LogEntry.
         */
        split?: Schema$LogSplit;
        /**
         * The log entry payload, represented as a Unicode string (UTF-8).
         */
        textPayload?: string | null;
        /**
         * Optional. The time the event described by the log entry occurred. This time is used to compute the log entry's age and to enforce the logs retention period. If this field is omitted in a new log entry, then Logging assigns it the current time. Timestamps have nanosecond accuracy, but trailing zeros in the fractional seconds might be omitted when the timestamp is displayed.Incoming log entries must have timestamps that don't exceed the logs retention period (https://cloud.google.com/logging/quotas#logs_retention_periods) in the past, and that don't exceed 24 hours in the future. Log entries outside those time boundaries are rejected by Logging.
         */
        timestamp?: string | null;
        /**
         * Optional. The REST resource name of the trace being written to Cloud Trace (https://cloud.google.com/trace) in association with this log entry. For example, if your trace data is stored in the Cloud project "my-trace-project" and if the service that is creating the log entry receives a trace header that includes the trace ID "12345", then the service should use "projects/my-trace-project/traces/12345".The trace field provides the link between logs and traces. By using this field, you can navigate from a log entry to a trace.
         */
        trace?: string | null;
        /**
         * Optional. The sampling decision of the span associated with the log entry at the time the log entry was created. This field corresponds to the sampled flag in the W3C trace-context specification (https://www.w3.org/TR/trace-context/#sampled-flag). A non-sampled trace value is still useful as a request correlation identifier. The default is False.
         */
        traceSampled?: boolean | null;
    }
    /**
     * Additional information about a potentially long-running operation with which a log entry is associated.
     */
    export interface Schema$LogEntryOperation {
        /**
         * Optional. Set this to True if this is the first log entry in the operation.
         */
        first?: boolean | null;
        /**
         * Optional. An arbitrary operation identifier. Log entries with the same identifier are assumed to be part of the same operation.
         */
        id?: string | null;
        /**
         * Optional. Set this to True if this is the last log entry in the operation.
         */
        last?: boolean | null;
        /**
         * Optional. An arbitrary producer identifier. The combination of id and producer must be globally unique. Examples for producer: "MyDivision.MyBigCompany.com", "github.com/MyProject/MyApplication".
         */
        producer?: string | null;
    }
    /**
     * Additional information about the source code location that produced the log entry.
     */
    export interface Schema$LogEntrySourceLocation {
        /**
         * Optional. Source file name. Depending on the runtime environment, this might be a simple name or a fully-qualified name.
         */
        file?: string | null;
        /**
         * Optional. Human-readable name of the function or method being invoked, with optional context such as the class or package name. This information may be used in contexts such as the logs viewer, where a file and line number are less meaningful. The format can vary by language. For example: qual.if.ied.Class.method (Java), dir/package.func (Go), function (Python).
         */
        function?: string | null;
        /**
         * Optional. Line within the source file. 1-based; 0 indicates no line number available.
         */
        line?: string | null;
    }
    /**
     * Contains metadata that associates the LogEntry to Error Reporting error groups.
     */
    export interface Schema$LogErrorGroup {
        /**
         * The id is a unique identifier for a particular error group; it is the last part of the error group resource name: /project/[PROJECT_ID]/errors/[ERROR_GROUP_ID]. Example: COShysOX0r_51QE. The id is derived from key parts of the error-log content and is treated as Service Data. For information about how Service Data is handled, see Google Cloud Privacy Notice (https://cloud.google.com/terms/cloud-privacy-notice).
         */
        id?: string | null;
    }
    /**
     * Specifies a set of log entries that are filtered out by a sink. If your Google Cloud resource receives a large volume of log entries, you can use exclusions to reduce your chargeable logs. Note that exclusions on organization-level and folder-level sinks don't apply to child resources. Note also that you cannot modify the _Required sink or exclude logs from it.
     */
    export interface Schema$LogExclusion {
        /**
         * Output only. The creation timestamp of the exclusion.This field may not be present for older exclusions.
         */
        createTime?: string | null;
        /**
         * Optional. A description of this exclusion.
         */
        description?: string | null;
        /**
         * Optional. If set to True, then this exclusion is disabled and it does not exclude any log entries. You can update an exclusion to change the value of this field.
         */
        disabled?: boolean | null;
        /**
         * Required. An advanced logs filter (https://cloud.google.com/logging/docs/view/advanced-queries) that matches the log entries to be excluded. By using the sample function (https://cloud.google.com/logging/docs/view/advanced-queries#sample), you can exclude less than 100% of the matching log entries.For example, the following query matches 99% of low-severity log entries from Google Cloud Storage buckets:resource.type=gcs_bucket severity<ERROR sample(insertId, 0.99)
         */
        filter?: string | null;
        /**
         * Output only. A client-assigned identifier, such as "load-balancer-exclusion". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.
         */
        name?: string | null;
        /**
         * Output only. The last update timestamp of the exclusion.This field may not be present for older exclusions.
         */
        updateTime?: string | null;
    }
    /**
     * Describes a Cloud Logging query that can be run in Logs Explorer UI or via the logging API.In addition to the query itself, additional information may be stored to capture the display configuration and other UI state used in association with analysis of query results.
     */
    export interface Schema$LoggingQuery {
        /**
         * Required. An advanced query using the Logging Query Language (https://cloud.google.com/logging/docs/view/logging-query-language). The maximum length of the filter is 20000 characters.
         */
        filter?: string | null;
        /**
         * Characters will be counted from the end of the string.
         */
        summaryFieldEnd?: number | null;
        /**
         * Optional. The set of summary fields to display for this saved query.
         */
        summaryFields?: Schema$SummaryField[];
        /**
         * Characters will be counted from the start of the string.
         */
        summaryFieldStart?: number | null;
    }
    /**
     * Application log line emitted while processing a request.
     */
    export interface Schema$LogLine {
        /**
         * App-provided log message.
         */
        logMessage?: string | null;
        /**
         * Severity of this log entry.
         */
        severity?: string | null;
        /**
         * Where in the source code this log message was written.
         */
        sourceLocation?: Schema$SourceLocation;
        /**
         * Approximate time when this log entry was made.
         */
        time?: string | null;
    }
    /**
     * Describes a logs-based metric. The value of the metric is the number of log entries that match a logs filter in a given time interval.Logs-based metrics can also be used to extract values from logs and create a distribution of the values. The distribution records the statistics of the extracted values along with an optional histogram of the values as specified by the bucket options.
     */
    export interface Schema$LogMetric {
        /**
         * Optional. The resource name of the Log Bucket that owns the Log Metric. Only Log Buckets in projects are supported. The bucket has to be in the same project as the metric.For example:projects/my-project/locations/global/buckets/my-bucketIf empty, then the Log Metric is considered a non-Bucket Log Metric.
         */
        bucketName?: string | null;
        /**
         * Optional. The bucket_options are required when the logs-based metric is using a DISTRIBUTION value type and it describes the bucket boundaries used to create a histogram of the extracted values.
         */
        bucketOptions?: Schema$BucketOptions;
        /**
         * Output only. The creation timestamp of the metric.This field may not be present for older metrics.
         */
        createTime?: string | null;
        /**
         * Optional. A description of this metric, which is used in documentation. The maximum length of the description is 8000 characters.
         */
        description?: string | null;
        /**
         * Optional. If set to True, then this metric is disabled and it does not generate any points.
         */
        disabled?: boolean | null;
        /**
         * Required. An advanced logs filter (https://cloud.google.com/logging/docs/view/advanced_filters) which is used to match log entries. Example: "resource.type=gae_app AND severity\>=ERROR" The maximum length of the filter is 20000 characters.
         */
        filter?: string | null;
        /**
         * Optional. A map from a label key string to an extractor expression which is used to extract data from a log entry field and assign as the label value. Each label key specified in the LabelDescriptor must have an associated extractor expression in this map. The syntax of the extractor expression is the same as for the value_extractor field.The extracted value is converted to the type defined in the label descriptor. If either the extraction or the type conversion fails, the label will have a default value. The default value for a string label is an empty string, for an integer label its 0, and for a boolean label its false.Note that there are upper bounds on the maximum number of labels and the number of active time series that are allowed in a project.
         */
        labelExtractors?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The metric descriptor associated with the logs-based metric. If unspecified, it uses a default metric descriptor with a DELTA metric kind, INT64 value type, with no labels and a unit of "1". Such a metric counts the number of log entries matching the filter expression.The name, type, and description fields in the metric_descriptor are output only, and is constructed using the name and description field in the LogMetric.To create a logs-based metric that records a distribution of log values, a DELTA metric kind with a DISTRIBUTION value type must be used along with a value_extractor expression in the LogMetric.Each label in the metric descriptor must have a matching label name as the key and an extractor expression as the value in the label_extractors map.The metric_kind and value_type fields in the metric_descriptor cannot be updated once initially configured. New labels can be added in the metric_descriptor, but existing labels cannot be modified except for their description.
         */
        metricDescriptor?: Schema$MetricDescriptor;
        /**
         * Required. The client-assigned metric identifier. Examples: "error_count", "nginx/requests".Metric identifiers are limited to 100 characters and can include only the following characters: A-Z, a-z, 0-9, and the special characters _-.,+!*',()%/. The forward-slash character (/) denotes a hierarchy of name pieces, and it cannot be the first character of the name.This field is the [METRIC_ID] part of a metric resource name in the format "projects/PROJECT_ID/metrics/METRIC_ID". Example: If the resource name of a metric is "projects/my-project/metrics/nginx%2Frequests", this field's value is "nginx/requests".
         */
        name?: string | null;
        /**
         * Output only. The resource name of the metric: "projects/[PROJECT_ID]/metrics/[METRIC_ID]"
         */
        resourceName?: string | null;
        /**
         * Output only. The last update timestamp of the metric.This field may not be present for older metrics.
         */
        updateTime?: string | null;
        /**
         * Optional. A value_extractor is required when using a distribution logs-based metric to extract the values to record from a log entry. Two functions are supported for value extraction: EXTRACT(field) or REGEXP_EXTRACT(field, regex). The arguments are: field: The name of the log entry field from which the value is to be extracted. regex: A regular expression using the Google RE2 syntax (https://github.com/google/re2/wiki/Syntax) with a single capture group to extract data from the specified log entry field. The value of the field is converted to a string before applying the regex. It is an error to specify a regex that does not include exactly one capture group.The result of the extraction must be convertible to a double type, as the distribution always records double values. If either the extraction or the conversion to double fails, then those values are not recorded in the distribution.Example: REGEXP_EXTRACT(jsonPayload.request, ".*quantity=(\d+).*")
         */
        valueExtractor?: string | null;
        /**
         * Deprecated. The API version that created or updated this metric. The v2 format is used by default and cannot be changed.
         */
        version?: string | null;
    }
    /**
     * Describes a group of resources to read log entries from.
     */
    export interface Schema$LogScope {
        /**
         * Output only. The creation timestamp of the log scope.
         */
        createTime?: string | null;
        /**
         * Optional. Describes this log scope.The maximum length of the description is 8000 characters.
         */
        description?: string | null;
        /**
         * Output only. The resource name of the log scope.Log scopes are only available in the global location. For example:projects/my-project/locations/global/logScopes/my-log-scope
         */
        name?: string | null;
        /**
         * Required. Names of one or more parent resources: projects/[PROJECT_ID]May alternatively be one or more views: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]A log scope can include a maximum of 5 projects and a maximum of 100 resources in total.
         */
        resourceNames?: string[] | null;
        /**
         * Output only. The last update timestamp of the log scope.
         */
        updateTime?: string | null;
    }
    /**
     * Describes a sink used to export log entries to one of the following destinations: a Cloud Logging log bucket, a Cloud Storage bucket, a BigQuery dataset, a Pub/Sub topic, a Cloud project.A logs filter controls which log entries are exported. The sink must be created within a project, organization, billing account, or folder.
     */
    export interface Schema$LogSink {
        /**
         * Optional. Options that affect sinks exporting data to BigQuery.
         */
        bigqueryOptions?: Schema$BigQueryOptions;
        /**
         * Output only. The creation timestamp of the sink.This field may not be present for older sinks.
         */
        createTime?: string | null;
        /**
         * Optional. A description of this sink.The maximum length of the description is 8000 characters.
         */
        description?: string | null;
        /**
         * Required. The export destination: "storage.googleapis.com/[GCS_BUCKET]" "bigquery.googleapis.com/projects/[PROJECT_ID]/datasets/[DATASET]" "pubsub.googleapis.com/projects/[PROJECT_ID]/topics/[TOPIC_ID]" "logging.googleapis.com/projects/[PROJECT_ID]" "logging.googleapis.com/projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" The sink's writer_identity, set when the sink is created, must have permission to write to the destination or else the log entries are not exported. For more information, see Exporting Logs with Sinks (https://cloud.google.com/logging/docs/api/tasks/exporting-logs).
         */
        destination?: string | null;
        /**
         * Optional. If set to true, then this sink is disabled and it does not export any log entries.
         */
        disabled?: boolean | null;
        /**
         * Optional. Log entries that match any of these exclusion filters will not be exported.If a log entry is matched by both filter and one of exclusion_filters it will not be exported.
         */
        exclusions?: Schema$LogExclusion[];
        /**
         * Optional. An advanced logs filter (https://cloud.google.com/logging/docs/view/advanced-queries). The only exported log entries are those that are in the resource owning the sink and that match the filter.For example:logName="projects/[PROJECT_ID]/logs/[LOG_ID]" AND severity\>=ERROR
         */
        filter?: string | null;
        /**
         * Optional. This field applies only to sinks owned by organizations and folders. If the field is false, the default, only the logs owned by the sink's parent resource are available for export. If the field is true, then log entries from all the projects, folders, and billing accounts contained in the sink's parent resource are also available for export. Whether a particular log entry from the children is exported depends on the sink's filter expression.For example, if this field is true, then the filter resource.type=gce_instance would export all Compute Engine VM instance log entries from all projects in the sink's parent.To only export entries from certain child projects, filter on the project part of the log name:logName:("projects/test-project1/" OR "projects/test-project2/") AND resource.type=gce_instance
         */
        includeChildren?: boolean | null;
        /**
         * Optional. This field applies only to sinks owned by organizations and folders.When the value of 'intercept_children' is true, the following restrictions apply: The sink must have the include_children flag set to true. The sink destination must be a Cloud project.Also, the following behaviors apply: Any logs matched by the sink won't be included by non-_Required sinks owned by child resources. The sink appears in the results of a ListSinks call from a child resource if the value of the filter field in its request is either 'in_scope("ALL")' or 'in_scope("ANCESTOR")'.
         */
        interceptChildren?: boolean | null;
        /**
         * Output only. The client-assigned sink identifier, unique within the project.For example: "my-syslog-errors-to-pubsub".Sink identifiers are limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.
         */
        name?: string | null;
        /**
         * Deprecated. This field is unused.
         */
        outputVersionFormat?: string | null;
        /**
         * Output only. The resource name of the sink. "projects/[PROJECT_ID]/sinks/[SINK_NAME] "organizations/[ORGANIZATION_ID]/sinks/[SINK_NAME] "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_NAME] "folders/[FOLDER_ID]/sinks/[SINK_NAME] For example: projects/my_project/sinks/SINK_NAME
         */
        resourceName?: string | null;
        /**
         * Output only. The last update timestamp of the sink.This field may not be present for older sinks.
         */
        updateTime?: string | null;
        /**
         * Output only. An IAM identity—a service account or group—under which Cloud Logging writes the exported log entries to the sink's destination. This field is either set by specifying custom_writer_identity or set automatically by sinks.create and sinks.update based on the value of unique_writer_identity in those methods.Until you grant this identity write-access to the destination, log entry exports from this sink will fail. For more information, see Granting Access for a Resource (https://cloud.google.com/iam/docs/granting-roles-to-service-accounts#granting_access_to_a_service_account_for_a_resource). Consult the destination service's documentation to determine the appropriate IAM roles to assign to the identity.Sinks that have a destination that is a log bucket in the same project as the sink cannot have a writer_identity and no additional permissions are required.
         */
        writerIdentity?: string | null;
    }
    /**
     * Additional information used to correlate multiple log entries. Used when a single LogEntry would exceed the Google Cloud Logging size limit and is split across multiple log entries.
     */
    export interface Schema$LogSplit {
        /**
         * The index of this LogEntry in the sequence of split log entries. Log entries are given |index| values 0, 1, ..., n-1 for a sequence of n log entries.
         */
        index?: number | null;
        /**
         * The total number of log entries that the original LogEntry was split into.
         */
        totalSplits?: number | null;
        /**
         * A globally unique identifier for all log entries in a sequence of split log entries. All log entries with the same |LogSplit.uid| are assumed to be part of the same sequence of split log entries.
         */
        uid?: string | null;
    }
    /**
     * Describes a view over log entries in a bucket.
     */
    export interface Schema$LogView {
        /**
         * Output only. The creation timestamp of the view.
         */
        createTime?: string | null;
        /**
         * Optional. Describes this view.
         */
        description?: string | null;
        /**
         * Optional. Filter that restricts which log entries in a bucket are visible in this view.Filters must be logical conjunctions that use the AND operator, and they can use any of the following qualifiers: SOURCE(), which specifies a project, folder, organization, or billing account of origin. resource.type, which specifies the resource type. LOG_ID(), which identifies the log.They can also use the negations of these qualifiers with the NOT operator.For example:SOURCE("projects/myproject") AND resource.type = "gce_instance" AND NOT LOG_ID("stdout")
         */
        filter?: string | null;
        /**
         * Output only. The resource name of the view.For example:projects/my-project/locations/global/buckets/my-bucket/views/my-view
         */
        name?: string | null;
        /**
         * Output only. The last update timestamp of the view.
         */
        updateTime?: string | null;
    }
    /**
     * Defines a metric type and its schema. Once a metric descriptor is created, deleting or altering it stops data collection and makes the metric type's existing data unusable.
     */
    export interface Schema$MetricDescriptor {
        /**
         * A detailed description of the metric, which can be used in documentation.
         */
        description?: string | null;
        /**
         * A concise name for the metric, which can be displayed in user interfaces. Use sentence case without an ending period, for example "Request count". This field is optional but it is recommended to be set for any metrics associated with user-visible concepts, such as Quota.
         */
        displayName?: string | null;
        /**
         * The set of labels that can be used to describe a specific instance of this metric type. For example, the appengine.googleapis.com/http/server/response_latencies metric type has a label for the HTTP response code, response_code, so you can look at latencies for successful responses or just for responses that failed.
         */
        labels?: Schema$LabelDescriptor[];
        /**
         * Optional. The launch stage of the metric definition.
         */
        launchStage?: string | null;
        /**
         * Optional. Metadata which can be used to guide usage of the metric.
         */
        metadata?: Schema$MetricDescriptorMetadata;
        /**
         * Whether the metric records instantaneous values, changes to a value, etc. Some combinations of metric_kind and value_type might not be supported.
         */
        metricKind?: string | null;
        /**
         * Read-only. If present, then a time series, which is identified partially by a metric type and a MonitoredResourceDescriptor, that is associated with this metric type can only be associated with one of the monitored resource types listed here.
         */
        monitoredResourceTypes?: string[] | null;
        /**
         * The resource name of the metric descriptor.
         */
        name?: string | null;
        /**
         * The metric type, including its DNS name prefix. The type is not URL-encoded. All user-defined metric types have the DNS name custom.googleapis.com or external.googleapis.com. Metric types should use a natural hierarchical grouping. For example: "custom.googleapis.com/invoice/paid/amount" "external.googleapis.com/prometheus/up" "appengine.googleapis.com/http/server/response_latencies"
         */
        type?: string | null;
        /**
         * The units in which the metric value is reported. It is only applicable if the value_type is INT64, DOUBLE, or DISTRIBUTION. The unit defines the representation of the stored metric values.Different systems might scale the values to be more easily displayed (so a value of 0.02kBy might be displayed as 20By, and a value of 3523kBy might be displayed as 3.5MBy). However, if the unit is kBy, then the value of the metric is always in thousands of bytes, no matter how it might be displayed.If you want a custom metric to record the exact number of CPU-seconds used by a job, you can create an INT64 CUMULATIVE metric whose unit is s{CPU\} (or equivalently 1s{CPU\} or just s). If the job uses 12,005 CPU-seconds, then the value is written as 12005.Alternatively, if you want a custom metric to record data in a more granular way, you can create a DOUBLE CUMULATIVE metric whose unit is ks{CPU\}, and then write the value 12.005 (which is 12005/1000), or use Kis{CPU\} and write 11.723 (which is 12005/1024).The supported units are a subset of The Unified Code for Units of Measure (https://unitsofmeasure.org/ucum.html) standard:Basic units (UNIT) bit bit By byte s second min minute h hour d day 1 dimensionlessPrefixes (PREFIX) k kilo (10^3) M mega (10^6) G giga (10^9) T tera (10^12) P peta (10^15) E exa (10^18) Z zetta (10^21) Y yotta (10^24) m milli (10^-3) u micro (10^-6) n nano (10^-9) p pico (10^-12) f femto (10^-15) a atto (10^-18) z zepto (10^-21) y yocto (10^-24) Ki kibi (2^10) Mi mebi (2^20) Gi gibi (2^30) Ti tebi (2^40) Pi pebi (2^50)GrammarThe grammar also includes these connectors: / division or ratio (as an infix operator). For examples, kBy/{email\} or MiBy/10ms (although you should almost never have /s in a metric unit; rates should always be computed at query time from the underlying cumulative or delta value). . multiplication or composition (as an infix operator). For examples, GBy.d or k{watt\}.h.The grammar for a unit is as follows: Expression = Component { "." Component \} { "/" Component \} ; Component = ( [ PREFIX ] UNIT | "%" ) [ Annotation ] | Annotation | "1" ; Annotation = "{" NAME "\}" ; Notes: Annotation is just a comment if it follows a UNIT. If the annotation is used alone, then the unit is equivalent to 1. For examples, {request\}/s == 1/s, By{transmitted\}/s == By/s. NAME is a sequence of non-blank printable ASCII characters not containing { or \}. 1 represents a unitary dimensionless unit (https://en.wikipedia.org/wiki/Dimensionless_quantity) of 1, such as in 1/s. It is typically used when none of the basic units are appropriate. For example, "new users per day" can be represented as 1/d or {new-users\}/d (and a metric value 5 would mean "5 new users). Alternatively, "thousands of page views per day" would be represented as 1000/d or k1/d or k{page_views\}/d (and a metric value of 5.3 would mean "5300 page views per day"). % represents dimensionless value of 1/100, and annotates values giving a percentage (so the metric values are typically in the range of 0..100, and a metric value 3 means "3 percent"). 10^2.% indicates a metric contains a ratio, typically in the range 0..1, that will be multiplied by 100 and displayed as a percentage (so a metric value 0.03 means "3 percent").
         */
        unit?: string | null;
        /**
         * Whether the measurement is an integer, a floating-point number, etc. Some combinations of metric_kind and value_type might not be supported.
         */
        valueType?: string | null;
    }
    /**
     * Additional annotations that can be used to guide the usage of a metric.
     */
    export interface Schema$MetricDescriptorMetadata {
        /**
         * The delay of data points caused by ingestion. Data points older than this age are guaranteed to be ingested and available to be read, excluding data loss due to errors.
         */
        ingestDelay?: string | null;
        /**
         * Deprecated. Must use the MetricDescriptor.launch_stage instead.
         */
        launchStage?: string | null;
        /**
         * The sampling period of metric data points. For metrics which are written periodically, consecutive data points are stored at this time interval, excluding data loss due to errors. Metrics with a higher granularity have a smaller sampling period.
         */
        samplePeriod?: string | null;
        /**
         * The scope of the timeseries data of the metric.
         */
        timeSeriesResourceHierarchyLevel?: string[] | null;
    }
    /**
     * An object representing a resource that can be used for monitoring, logging, billing, or other purposes. Examples include virtual machine instances, databases, and storage devices such as disks. The type field identifies a MonitoredResourceDescriptor object that describes the resource's schema. Information in the labels field identifies the actual resource and its attributes according to the schema. For example, a particular Compute Engine VM instance could be represented by the following object, because the MonitoredResourceDescriptor for "gce_instance" has labels "project_id", "instance_id" and "zone": { "type": "gce_instance", "labels": { "project_id": "my-project", "instance_id": "12345678901234", "zone": "us-central1-a" \}\}
     */
    export interface Schema$MonitoredResource {
        /**
         * Required. Values for all of the labels listed in the associated monitored resource descriptor. For example, Compute Engine VM instances use the labels "project_id", "instance_id", and "zone".
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The monitored resource type. This field must match the type field of a MonitoredResourceDescriptor object. For example, the type of a Compute Engine VM instance is gce_instance. Some descriptors include the service name in the type; for example, the type of a Datastream stream is datastream.googleapis.com/Stream.
         */
        type?: string | null;
    }
    /**
     * An object that describes the schema of a MonitoredResource object using a type name and a set of labels. For example, the monitored resource descriptor for Google Compute Engine VM instances has a type of "gce_instance" and specifies the use of the labels "instance_id" and "zone" to identify particular VM instances.Different APIs can support different monitored resource types. APIs generally provide a list method that returns the monitored resource descriptors used by the API.
     */
    export interface Schema$MonitoredResourceDescriptor {
        /**
         * Optional. A detailed description of the monitored resource type that might be used in documentation.
         */
        description?: string | null;
        /**
         * Optional. A concise name for the monitored resource type that might be displayed in user interfaces. It should be a Title Cased Noun Phrase, without any article or other determiners. For example, "Google Cloud SQL Database".
         */
        displayName?: string | null;
        /**
         * Required. A set of labels used to describe instances of this monitored resource type. For example, an individual Google Cloud SQL database is identified by values for the labels "database_id" and "zone".
         */
        labels?: Schema$LabelDescriptor[];
        /**
         * Optional. The launch stage of the monitored resource definition.
         */
        launchStage?: string | null;
        /**
         * Optional. The resource name of the monitored resource descriptor: "projects/{project_id\}/monitoredResourceDescriptors/{type\}" where {type\} is the value of the type field in this object and {project_id\} is a project ID that provides API-specific context for accessing the type. APIs that do not use project information can use the resource name format "monitoredResourceDescriptors/{type\}".
         */
        name?: string | null;
        /**
         * Required. The monitored resource type. For example, the type "cloudsql_database" represents databases in Google Cloud SQL. For a list of types, see Monitored resource types (https://cloud.google.com/monitoring/api/resources) and Logging resource types (https://cloud.google.com/logging/docs/api/v2/resource-list).
         */
        type?: string | null;
    }
    /**
     * Auxiliary metadata for a MonitoredResource object. MonitoredResource objects contain the minimum set of information to uniquely identify a monitored resource instance. There is some other useful auxiliary metadata. Monitoring and Logging use an ingestion pipeline to extract metadata for cloud resources of all types, and store the metadata in this message.
     */
    export interface Schema$MonitoredResourceMetadata {
        /**
         * Output only. Values for predefined system metadata labels. System labels are a kind of metadata extracted by Google, including "machine_image", "vpc", "subnet_id", "security_group", "name", etc. System label values can be only strings, Boolean values, or a list of strings. For example: { "name": "my-test-instance", "security_group": ["a", "b", "c"], "spot_instance": false \}
         */
        systemLabels?: {
            [key: string]: any;
        } | null;
        /**
         * Output only. A map of user-defined metadata labels.
         */
        userLabels?: {
            [key: string]: string;
        } | null;
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
     * Describes an analytics query that can be run in the Log Analytics page of Google Cloud console.Preview: This is a preview feature and may be subject to change before final release.
     */
    export interface Schema$OpsAnalyticsQuery {
        /**
         * Required. A logs analytics SQL query, which generally follows BigQuery format.This is the SQL query that appears in the Log Analytics UI's query editor.
         */
        sqlQueryText?: string | null;
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
     * Describes a recent query executed on the Logs Explorer or Log Analytics page within the last ~ 30 days.
     */
    export interface Schema$RecentQuery {
        /**
         * Output only. The timestamp when this query was last run.
         */
        lastRunTime?: string | null;
        /**
         * Logging query that can be executed in Logs Explorer or via Logging API.
         */
        loggingQuery?: Schema$LoggingQuery;
        /**
         * Output only. Resource name of the recent query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/recentQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support)The QUERY_ID is a system generated alphanumeric ID.
         */
        name?: string | null;
        /**
         * Analytics query that can be executed in Log Analytics.
         */
        opsAnalyticsQuery?: Schema$OpsAnalyticsQuery;
    }
    /**
     * Complete log information about a single HTTP request to an App Engine application.
     */
    export interface Schema$RequestLog {
        /**
         * App Engine release version.
         */
        appEngineRelease?: string | null;
        /**
         * Application that handled this request.
         */
        appId?: string | null;
        /**
         * An indication of the relative cost of serving this request.
         */
        cost?: number | null;
        /**
         * Time when the request finished.
         */
        endTime?: string | null;
        /**
         * Whether this request is finished or active.
         */
        finished?: boolean | null;
        /**
         * Whether this is the first RequestLog entry for this request. If an active request has several RequestLog entries written to Stackdriver Logging, then this field will be set for one of them.
         */
        first?: boolean | null;
        /**
         * Internet host and port number of the resource being requested.
         */
        host?: string | null;
        /**
         * HTTP version of request. Example: "HTTP/1.1".
         */
        httpVersion?: string | null;
        /**
         * An identifier for the instance that handled the request.
         */
        instanceId?: string | null;
        /**
         * If the instance processing this request belongs to a manually scaled module, then this is the 0-based index of the instance. Otherwise, this value is -1.
         */
        instanceIndex?: number | null;
        /**
         * Origin IP address.
         */
        ip?: string | null;
        /**
         * Latency of the request.
         */
        latency?: string | null;
        /**
         * A list of log lines emitted by the application while serving this request.
         */
        line?: Schema$LogLine[];
        /**
         * Number of CPU megacycles used to process request.
         */
        megaCycles?: string | null;
        /**
         * Request method. Example: "GET", "HEAD", "PUT", "POST", "DELETE".
         */
        method?: string | null;
        /**
         * Module of the application that handled this request.
         */
        moduleId?: string | null;
        /**
         * The logged-in user who made the request.Most likely, this is the part of the user's email before the @ sign. The field value is the same for different requests from the same user, but different users can have similar names. This information is also available to the application via the App Engine Users API.This field will be populated starting with App Engine 1.9.21.
         */
        nickname?: string | null;
        /**
         * Time this request spent in the pending request queue.
         */
        pendingTime?: string | null;
        /**
         * Referrer URL of request.
         */
        referrer?: string | null;
        /**
         * Globally unique identifier for a request, which is based on the request start time. Request IDs for requests which started later will compare greater as strings than those for requests which started earlier.
         */
        requestId?: string | null;
        /**
         * Contains the path and query portion of the URL that was requested. For example, if the URL was "http://example.com/app?name=val", the resource would be "/app?name=val". The fragment identifier, which is identified by the # character, is not included.
         */
        resource?: string | null;
        /**
         * Size in bytes sent back to client by request.
         */
        responseSize?: string | null;
        /**
         * Source code for the application that handled this request. There can be more than one source reference per deployed application if source code is distributed among multiple repositories.
         */
        sourceReference?: Schema$SourceReference[];
        /**
         * Stackdriver Trace span identifier for this request.
         */
        spanId?: string | null;
        /**
         * Time when the request started.
         */
        startTime?: string | null;
        /**
         * HTTP response status code. Example: 200, 404.
         */
        status?: number | null;
        /**
         * Task name of the request, in the case of an offline request.
         */
        taskName?: string | null;
        /**
         * Queue name of the request, in the case of an offline request.
         */
        taskQueueName?: string | null;
        /**
         * Stackdriver Trace identifier for this request.
         */
        traceId?: string | null;
        /**
         * If true, the value in the 'trace_id' field was sampled for storage in a trace backend.
         */
        traceSampled?: boolean | null;
        /**
         * File or class that handled the request.
         */
        urlMapEntry?: string | null;
        /**
         * User agent that made the request.
         */
        userAgent?: string | null;
        /**
         * Version of the application that handled this request.
         */
        versionId?: string | null;
        /**
         * Whether this was a loading request for the instance.
         */
        wasLoadingRequest?: boolean | null;
    }
    /**
     * Describes a query that has been saved by a user.
     */
    export interface Schema$SavedQuery {
        /**
         * Output only. The timestamp when the saved query was created.
         */
        createTime?: string | null;
        /**
         * Optional. A human readable description of the saved query.
         */
        description?: string | null;
        /**
         * Required. The user specified title for the SavedQuery.
         */
        displayName?: string | null;
        /**
         * Logging query that can be executed in Logs Explorer or via Logging API.
         */
        loggingQuery?: Schema$LoggingQuery;
        /**
         * Output only. Resource name of the saved query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support#bucket-regions)After the saved query is created, the location cannot be changed.If the user doesn't provide a QUERY_ID, the system will generate an alphanumeric ID.
         */
        name?: string | null;
        /**
         * Analytics query that can be executed in Log Analytics.
         */
        opsAnalyticsQuery?: Schema$OpsAnalyticsQuery;
        /**
         * Output only. The timestamp when the saved query was last updated.
         */
        updateTime?: string | null;
        /**
         * Required. The visibility status of this query, which determines its ownership.
         */
        visibility?: string | null;
    }
    /**
     * Request message for SetIamPolicy method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the resource. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
        /**
         * OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only the fields in the mask will be modified. If no mask is provided, the following default mask is used:paths: "bindings, etag"
         */
        updateMask?: string | null;
    }
    /**
     * Describes the settings associated with a project, folder, organization, or billing account.
     */
    export interface Schema$Settings {
        /**
         * Optional. Overrides the built-in configuration for _Default sink.
         */
        defaultSinkConfig?: Schema$DefaultSinkConfig;
        /**
         * Optional. If set to true, the _Default sink in newly created projects and folders will created in a disabled state. This can be used to automatically disable log storage if there is already an aggregated sink configured in the hierarchy. The _Default sink can be re-enabled manually if needed.
         */
        disableDefaultSink?: boolean | null;
        /**
         * Optional. The resource name for the configured Cloud KMS key.KMS key name format: "projects/[PROJECT_ID]/locations/[LOCATION]/keyRings/[KEYRING]/cryptoKeys/[KEY]" For example:"projects/my-project/locations/us-central1/keyRings/my-ring/cryptoKeys/my-key"To enable CMEK, set this field to a valid kms_key_name for which the associated service account has the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key.The Cloud KMS key used by the Log Router can be updated by changing the kms_key_name to a new valid key name.To disable CMEK for the Log Router, set this field to an empty string.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         */
        kmsKeyName?: string | null;
        /**
         * Output only. The service account that will be used by the Log Router to access your Cloud KMS key.Before enabling CMEK, you must first assign the role roles/cloudkms.cryptoKeyEncrypterDecrypter to the service account that will be used to access your Cloud KMS key. Use GetSettings to obtain the service account ID.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         */
        kmsServiceAccountId?: string | null;
        /**
         * Output only. The service account for the given resource container, such as project or folder. Log sinks use this service account as their writer_identity if no custom service account is provided in the request when calling the create sink method.
         */
        loggingServiceAccountId?: string | null;
        /**
         * Output only. The resource name of the settings.
         */
        name?: string | null;
        /**
         * Optional. The storage location for the _Default and _Required log buckets of newly created projects and folders, unless the storage location is explicitly provided.Example value: europe-west1.Note: this setting does not affect the location of resources where a location is explicitly provided when created, such as custom log buckets.
         */
        storageLocation?: string | null;
    }
    /**
     * Specifies a location in a source code file.
     */
    export interface Schema$SourceLocation {
        /**
         * Source file name. Depending on the runtime environment, this might be a simple name or a fully-qualified name.
         */
        file?: string | null;
        /**
         * Human-readable name of the function or method being invoked, with optional context such as the class or package name. This information is used in contexts such as the logs viewer, where a file and line number are less meaningful. The format can vary by language. For example: qual.if.ied.Class.method (Java), dir/package.func (Go), function (Python).
         */
        functionName?: string | null;
        /**
         * Line within the source file.
         */
        line?: string | null;
    }
    /**
     * A reference to a particular snapshot of the source tree used to build and deploy an application.
     */
    export interface Schema$SourceReference {
        /**
         * Optional. A URI string identifying the repository. Example: "https://github.com/GoogleCloudPlatform/kubernetes.git"
         */
        repository?: string | null;
        /**
         * The canonical and persistent identifier of the deployed revision. Example (git): "0035781c50ec7aa23385dc841529ce8a4b70db1b"
         */
        revisionId?: string | null;
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
     * A field from the LogEntry that is added to the summary line (https://cloud.google.com/logging/docs/view/logs-explorer-interface#add-summary-fields) for a query in the Logs Explorer.
     */
    export interface Schema$SummaryField {
        /**
         * Optional. The field from the LogEntry to include in the summary line, for example resource.type or jsonPayload.name.
         */
        field?: string | null;
    }
    /**
     * Information about entries that were omitted from the session.
     */
    export interface Schema$SuppressionInfo {
        /**
         * The reason that entries were omitted from the session.
         */
        reason?: string | null;
        /**
         * A lower bound on the count of entries omitted due to reason.
         */
        suppressedCount?: number | null;
    }
    /**
     * The parameters to TailLogEntries.
     */
    export interface Schema$TailLogEntriesRequest {
        /**
         * Optional. The amount of time to buffer log entries at the server before being returned to prevent out of order results due to late arriving log entries. Valid values are between 0-60000 milliseconds. Defaults to 2000 milliseconds.
         */
        bufferWindow?: string | null;
        /**
         * Optional. Only log entries that match the filter are returned. An empty filter matches all log entries in the resources listed in resource_names. Referencing a parent resource that is not listed in resource_names will cause the filter to return no results. The maximum length of a filter is 20,000 characters.
         */
        filter?: string | null;
        /**
         * Required. Name of a parent resource from which to retrieve log entries: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]May alternatively be one or more views: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]
         */
        resourceNames?: string[] | null;
    }
    /**
     * Result returned from TailLogEntries.
     */
    export interface Schema$TailLogEntriesResponse {
        /**
         * A list of log entries. Each response in the stream will order entries with increasing values of LogEntry.timestamp. Ordering is not guaranteed between separate responses.
         */
        entries?: Schema$LogEntry[];
        /**
         * If entries that otherwise would have been included in the session were not sent back to the client, counts of relevant entries omitted from the session with the reason that they were not included. There will be at most one of each reason per response. The counts represent the number of suppressed entries since the last streamed response.
         */
        suppressionInfo?: Schema$SuppressionInfo[];
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
     * The parameters to UndeleteBucket.
     */
    export interface Schema$UndeleteBucketRequest {
    }
    /**
     * The parameters to UpdateBucket.
     */
    export interface Schema$UpdateBucketRequest {
        /**
         * Required. The updated bucket.
         */
        bucket?: Schema$LogBucket;
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string | null;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string | null;
    }
    /**
     * The parameters to WriteLogEntries.
     */
    export interface Schema$WriteLogEntriesRequest {
        /**
         * Optional. If true, the request should expect normal response, but the entries won't be persisted nor exported. Useful for checking whether the logging API endpoints are working properly before sending valuable data.
         */
        dryRun?: boolean | null;
        /**
         * Required. The log entries to send to Logging. The order of log entries in this list does not matter. Values supplied in this method's log_name, resource, and labels fields are copied into those log entries in this list that do not include values for their corresponding fields. For more information, see the LogEntry type.If the timestamp or insert_id fields are missing in log entries, then this method supplies the current time or a unique identifier, respectively. The supplied values are chosen so that, among the log entries that did not supply their own values, the entries earlier in the list will sort before the entries later in the list. See the entries.list method.Log entries with timestamps that are more than the logs retention period (https://cloud.google.com/logging/quotas) in the past or more than 24 hours in the future will not be available when calling entries.list. However, those log entries can still be exported with LogSinks (https://cloud.google.com/logging/docs/api/tasks/exporting-logs).To improve throughput and to avoid exceeding the quota limit (https://cloud.google.com/logging/quotas) for calls to entries.write, you should try to include several log entries in this list, rather than calling this method for each individual log entry.
         */
        entries?: Schema$LogEntry[];
        /**
         * Optional. Default labels that are added to the labels field of all log entries in entries. If a log entry already has a label with the same key as a label in this parameter, then the log entry's label is not changed. See LogEntry.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. A default log resource name that is assigned to all log entries in entries that do not specify a value for log_name: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example: "projects/my-project-id/logs/syslog" "organizations/123/logs/cloudaudit.googleapis.com%2Factivity" The permission logging.logEntries.create is needed on each project, organization, billing account, or folder that is receiving new log entries, whether the resource is specified in logName or in an individual log entry.
         */
        logName?: string | null;
        /**
         * Optional. Whether a batch's valid entries should be written even if some other entry failed due to a permanent error such as INVALID_ARGUMENT or PERMISSION_DENIED. If any entry failed, then the response status is the response status of one of the failed entries. The response will include error details in WriteLogEntriesPartialErrors.log_entry_errors keyed by the entries' zero-based index in the entries. Failed requests for which no entries are written will not include per-entry errors.
         */
        partialSuccess?: boolean | null;
        /**
         * Optional. A default monitored resource object that is assigned to all log entries in entries that do not specify a value for resource. Example: { "type": "gce_instance", "labels": { "zone": "us-central1-a", "instance_id": "00000000000000000000" \}\} See LogEntry.
         */
        resource?: Schema$MonitoredResource;
    }
    /**
     * Result returned from WriteLogEntries.
     */
    export interface Schema$WriteLogEntriesResponse {
    }
    export class Resource$Billingaccounts {
        context: APIRequestContext;
        exclusions: Resource$Billingaccounts$Exclusions;
        locations: Resource$Billingaccounts$Locations;
        logs: Resource$Billingaccounts$Logs;
        sinks: Resource$Billingaccounts$Sinks;
        constructor(context: APIRequestContext);
        /**
         * Gets the Logging CMEK settings for the given resource.Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCmekSettings(params: Params$Resource$Billingaccounts$Getcmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCmekSettings(params?: Params$Resource$Billingaccounts$Getcmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        getCmekSettings(params: Params$Resource$Billingaccounts$Getcmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCmekSettings(params: Params$Resource$Billingaccounts$Getcmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(params: Params$Resource$Billingaccounts$Getcmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Gets the settings for the given resource.Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.See View default resource settings for Logging (https://cloud.google.com/logging/docs/default-settings#view-org-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSettings(params: Params$Resource$Billingaccounts$Getsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSettings(params?: Params$Resource$Billingaccounts$Getsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        getSettings(params: Params$Resource$Billingaccounts$Getsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSettings(params: Params$Resource$Billingaccounts$Getsettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(params: Params$Resource$Billingaccounts$Getsettings, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(callback: BodyResponseCallback<Schema$Settings>): void;
    }
    export interface Params$Resource$Billingaccounts$Getcmeksettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve CMEK settings. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Getsettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve settings. "projects/[PROJECT_ID]/settings" "organizations/[ORGANIZATION_ID]/settings" "billingAccounts/[BILLING_ACCOUNT_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.
         */
        name?: string;
    }
    export class Resource$Billingaccounts$Exclusions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new exclusion in the _Default sink in a specified parent resource. Only log entries belonging to that resource can be excluded. You can have up to 10 exclusions in a resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Exclusions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Exclusions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        create(params: Params$Resource$Billingaccounts$Exclusions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Exclusions$Create, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(params: Params$Resource$Billingaccounts$Exclusions$Create, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Deletes an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Exclusions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Exclusions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Exclusions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Exclusions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Exclusions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the description of an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Exclusions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Exclusions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        get(params: Params$Resource$Billingaccounts$Exclusions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Exclusions$Get, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(params: Params$Resource$Billingaccounts$Exclusions$Get, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Lists all the exclusions on the _Default sink in a parent resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Exclusions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Exclusions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListExclusionsResponse>>;
        list(params: Params$Resource$Billingaccounts$Exclusions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Exclusions$List, options: MethodOptions | BodyResponseCallback<Schema$ListExclusionsResponse>, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Exclusions$List, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        /**
         * Changes one or more properties of an existing exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Billingaccounts$Exclusions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Billingaccounts$Exclusions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        patch(params: Params$Resource$Billingaccounts$Exclusions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Billingaccounts$Exclusions$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(params: Params$Resource$Billingaccounts$Exclusions$Patch, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(callback: BodyResponseCallback<Schema$LogExclusion>): void;
    }
    export interface Params$Resource$Billingaccounts$Exclusions$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the exclusion: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-logging-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export interface Params$Resource$Billingaccounts$Exclusions$Delete extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion to delete: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Exclusions$Get extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Exclusions$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose exclusions are to be listed. "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Billingaccounts$Exclusions$Patch extends StandardParameters {
        /**
         * Required. The resource name of the exclusion to update: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing exclusion. New values for the fields are taken from the corresponding fields in the LogExclusion included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.For example, to change the filter and description of an exclusion, specify an update_mask of "filter,description".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export class Resource$Billingaccounts$Locations {
        context: APIRequestContext;
        buckets: Resource$Billingaccounts$Locations$Buckets;
        operations: Resource$Billingaccounts$Locations$Operations;
        recentQueries: Resource$Billingaccounts$Locations$Recentqueries;
        savedQueries: Resource$Billingaccounts$Locations$Savedqueries;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Billingaccounts$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in AIP-160 (https://google.aip.dev/160).
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
         * A page token received from the next_page_token field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Billingaccounts$Locations$Buckets {
        context: APIRequestContext;
        links: Resource$Billingaccounts$Locations$Buckets$Links;
        views: Resource$Billingaccounts$Locations$Buckets$Views;
        constructor(context: APIRequestContext);
        /**
         * Creates a log bucket that can be used to store log entries. After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Locations$Buckets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Create, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Create, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Creates a log bucket asynchronously that can be used to store log entries.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Createasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createAsync(params?: Params$Resource$Billingaccounts$Locations$Buckets$Createasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Createasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Createasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Createasync, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a log bucket.Changes the bucket's lifecycle_state to the DELETE_REQUESTED state. After 7 days, the bucket will be purged and all log entries in the bucket will be permanently deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Locations$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Get, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Lists log buckets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBucketsResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$ListBucketsResponse>, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$List, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        /**
         * Updates a log bucket.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Billingaccounts$Locations$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Patch, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Undeletes a log bucket. A bucket that has been deleted can be undeleted within the grace period of 7 days.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Billingaccounts$Locations$Buckets$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Billingaccounts$Locations$Buckets$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        undelete(params: Params$Resource$Billingaccounts$Locations$Buckets$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Billingaccounts$Locations$Buckets$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(params: Params$Resource$Billingaccounts$Locations$Buckets$Undelete, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a log bucket asynchronously.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Updateasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAsync(params?: Params$Resource$Billingaccounts$Locations$Buckets$Updateasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Updateasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Updateasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(params: Params$Resource$Billingaccounts$Locations$Buckets$Updateasync, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Createasync extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Get extends StandardParameters {
        /**
         * Required. The resource name of the bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose buckets are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" Note: The locations portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all buckets.
         */
        parent?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Undelete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to undelete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteBucketRequest;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Updateasync extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export class Resource$Billingaccounts$Locations$Buckets$Links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Asynchronously creates a linked dataset in BigQuery which makes it possible to use BigQuery to read the logs stored in the log bucket. A log bucket may currently only contain one link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Locations$Buckets$Links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a link. This will also delete the corresponding BigQuery linked dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Buckets$Links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Link>>;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Get, options: MethodOptions | BodyResponseCallback<Schema$Link>, callback: BodyResponseCallback<Schema$Link>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$Get, callback: BodyResponseCallback<Schema$Link>): void;
        get(callback: BodyResponseCallback<Schema$Link>): void;
        /**
         * Lists links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Buckets$Links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLinksResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$List, options: MethodOptions | BodyResponseCallback<Schema$ListLinksResponse>, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Links$List, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Links$Create extends StandardParameters {
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Link;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Links$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Links$Get extends StandardParameters {
        /**
         * Required. The resource name of the link: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Links$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose links are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export class Resource$Billingaccounts$Locations$Buckets$Views {
        context: APIRequestContext;
        logs: Resource$Billingaccounts$Locations$Buckets$Views$Logs;
        constructor(context: APIRequestContext);
        /**
         * Creates a view over log entries in a log bucket. A bucket may contain a maximum of 30 views.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Create, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Create, callback: BodyResponseCallback<Schema$LogView>): void;
        create(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Deletes a view on a log bucket. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can delete the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a view on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Get, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Get, callback: BodyResponseCallback<Schema$LogView>): void;
        get(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Lists views on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListViewsResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$List, options: MethodOptions | BodyResponseCallback<Schema$ListViewsResponse>, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$List, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        /**
         * Updates a view on a log bucket. This method replaces the value of the filter field from the existing view with the corresponding value from the new view. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can update the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(callback: BodyResponseCallback<Schema$LogView>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$Create extends StandardParameters {
        /**
         * Required. The bucket in which to create the view `"projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"` For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        parent?: string;
        /**
         * Required. A client-assigned identifier such as "my-view". Identifiers are limited to 100 characters and can include only letters, digits, underscores, and hyphens.
         */
        viewId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the view to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$Get extends StandardParameters {
        /**
         * Required. The resource name of the policy: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The bucket whose views are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the view to update "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in view that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export class Resource$Billingaccounts$Locations$Buckets$Views$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Buckets$Views$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Billingaccounts$Locations$Operations {
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
        cancel(params: Params$Resource$Billingaccounts$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Billingaccounts$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Billingaccounts$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Billingaccounts$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Billingaccounts$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Billingaccounts$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Billingaccounts$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Operations$List extends StandardParameters {
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
    export class Resource$Billingaccounts$Locations$Recentqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the RecentQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Recentqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Recentqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRecentQueriesResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Recentqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Recentqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListRecentQueriesResponse>, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Recentqueries$List, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Recentqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") of the recent queries to list. The only valid value for this field is one of the two allowable type function calls, which are the following: type("Logging") type("OpsAnalytics")
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example:projects/my-project/locations/us-central1Note: The location portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all recent queries.
         */
        parent?: string;
    }
    export class Resource$Billingaccounts$Locations$Savedqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new SavedQuery for the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Locations$Savedqueries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        create(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Create, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Create, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Deletes an existing SavedQuery that was created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Locations$Savedqueries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns all data associated with the requested query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Locations$Savedqueries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        get(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Get, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Get, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Lists the SavedQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Locations$Savedqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Locations$Savedqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSavedQueriesResponse>>;
        list(params: Params$Resource$Billingaccounts$Locations$Savedqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Savedqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListSavedQueriesResponse>, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(params: Params$Resource$Billingaccounts$Locations$Savedqueries$List, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        /**
         * Updates an existing SavedQuery.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Billingaccounts$Locations$Savedqueries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        patch(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Patch, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(params: Params$Resource$Billingaccounts$Locations$Savedqueries$Patch, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(callback: BodyResponseCallback<Schema$SavedQuery>): void;
    }
    export interface Params$Resource$Billingaccounts$Locations$Savedqueries$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the saved query: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/global" "organizations/123456789/locations/us-central1"
         */
        parent?: string;
        /**
         * Optional. The ID to use for the saved query, which will become the final component of the saved query's resource name.If the saved_query_id is not provided, the system will generate an alphanumeric ID.The saved_query_id is limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.
         */
        savedQueryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export interface Params$Resource$Billingaccounts$Locations$Savedqueries$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the saved query to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Savedqueries$Get extends StandardParameters {
        /**
         * Required. The resource name of the saved query. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Savedqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") and the visibility (PRIVATE or SHARED) of the saved queries to list. If provided, the filter must contain either the type function or a visibility token, or both. If both are chosen, they can be placed in any order, but they must be joined by the AND operator or the empty character.The two supported type function calls are: type("Logging") type("OpsAnalytics")The two supported visibility tokens are: visibility = PRIVATE visibility = SHAREDFor example:type("Logging") AND visibility = PRIVATE visibility=SHARED type("OpsAnalytics") type("OpsAnalytics)" visibility = PRIVATE visibility = SHARED
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/us-central1" Note: The locations portion of the resource must be specified. To get a list of all saved queries, a wildcard character - can be used for LOCATION_ID, for example: "projects/my-project/locations/-"
         */
        parent?: string;
    }
    export interface Params$Resource$Billingaccounts$Locations$Savedqueries$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the saved query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support#bucket-regions)After the saved query is created, the location cannot be changed.If the user doesn't provide a QUERY_ID, the system will generate an alphanumeric ID.
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing saved query. Fields are relative to the saved_query and new values for the fields are taken from the corresponding fields in the SavedQuery included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.To update all mutable fields, specify an update_mask of *.For example, to change the description and query filter text of a saved query, specify an update_mask of "description, query.filter".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export class Resource$Billingaccounts$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes all the log entries in a log for the _Default Log Bucket. The log reappears if it receives new entries. Log entries written shortly before the delete operation might not be deleted. Entries received after the delete operation with a timestamp before the operation will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Logs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Logs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Logs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Logs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Logs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Billingaccounts$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Billingaccounts$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Billingaccounts$Logs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log to delete: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/123/logs/cloudaudit.googleapis.com%2Factivity".For more information about log names, see LogEntry.
         */
        logName?: string;
    }
    export interface Params$Resource$Billingaccounts$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Billingaccounts$Sinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports specified log entries to a destination. The export begins upon ingress, unless the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Billingaccounts$Sinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Billingaccounts$Sinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        create(params: Params$Resource$Billingaccounts$Sinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Billingaccounts$Sinks$Create, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(params: Params$Resource$Billingaccounts$Sinks$Create, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Billingaccounts$Sinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Billingaccounts$Sinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Billingaccounts$Sinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Billingaccounts$Sinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Billingaccounts$Sinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Billingaccounts$Sinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billingaccounts$Sinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        get(params: Params$Resource$Billingaccounts$Sinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billingaccounts$Sinks$Get, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(params: Params$Resource$Billingaccounts$Sinks$Get, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Lists sinks.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Billingaccounts$Sinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billingaccounts$Sinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSinksResponse>>;
        list(params: Params$Resource$Billingaccounts$Sinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billingaccounts$Sinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListSinksResponse>, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(params: Params$Resource$Billingaccounts$Sinks$List, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Billingaccounts$Sinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Billingaccounts$Sinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        patch(params: Params$Resource$Billingaccounts$Sinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Billingaccounts$Sinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(params: Params$Resource$Billingaccounts$Sinks$Patch, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Billingaccounts$Sinks$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Billingaccounts$Sinks$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        update(params: Params$Resource$Billingaccounts$Sinks$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Billingaccounts$Sinks$Update, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(params: Params$Resource$Billingaccounts$Sinks$Update, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(callback: BodyResponseCallback<Schema$LogSink>): void;
    }
    export interface Params$Resource$Billingaccounts$Sinks$Create extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Billingaccounts$Sinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Billingaccounts$Sinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Billingaccounts$Sinks$List extends StandardParameters {
        /**
         * Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope("ALL")', 'in_scope("ANCESTOR")', 'in_scope("DEFAULT")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope("DEFAULT")' is applied.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Billingaccounts$Sinks$Patch extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Billingaccounts$Sinks$Update extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export class Resource$Entries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Copies a set of log entries from a log bucket to a Cloud Storage bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        copy(params: Params$Resource$Entries$Copy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        copy(params?: Params$Resource$Entries$Copy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        copy(params: Params$Resource$Entries$Copy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        copy(params: Params$Resource$Entries$Copy, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        copy(params: Params$Resource$Entries$Copy, callback: BodyResponseCallback<Schema$Operation>): void;
        copy(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists log entries. Use this method to retrieve log entries that originated from a project/folder/organization/billing account. For ways to export log entries, see Exporting Logs (https://cloud.google.com/logging/docs/export).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Entries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Entries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogEntriesResponse>>;
        list(params: Params$Resource$Entries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Entries$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogEntriesResponse>, callback: BodyResponseCallback<Schema$ListLogEntriesResponse>): void;
        list(params: Params$Resource$Entries$List, callback: BodyResponseCallback<Schema$ListLogEntriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogEntriesResponse>): void;
        /**
         * Streaming read of log entries as they are received. Until the stream is terminated, it will continue reading logs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        tail(params: Params$Resource$Entries$Tail, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        tail(params?: Params$Resource$Entries$Tail, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TailLogEntriesResponse>>;
        tail(params: Params$Resource$Entries$Tail, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        tail(params: Params$Resource$Entries$Tail, options: MethodOptions | BodyResponseCallback<Schema$TailLogEntriesResponse>, callback: BodyResponseCallback<Schema$TailLogEntriesResponse>): void;
        tail(params: Params$Resource$Entries$Tail, callback: BodyResponseCallback<Schema$TailLogEntriesResponse>): void;
        tail(callback: BodyResponseCallback<Schema$TailLogEntriesResponse>): void;
        /**
         * Writes log entries to Logging. This API method is the only way to send log entries to Logging. This method is used, directly or indirectly, by the Logging agent (fluentd) and all logging libraries configured to use Logging. A single request may contain log entries for a maximum of 1000 different resource names (projects, organizations, billing accounts or folders), where the resource name for a log entry is determined from its logName field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        write(params: Params$Resource$Entries$Write, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        write(params?: Params$Resource$Entries$Write, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WriteLogEntriesResponse>>;
        write(params: Params$Resource$Entries$Write, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        write(params: Params$Resource$Entries$Write, options: MethodOptions | BodyResponseCallback<Schema$WriteLogEntriesResponse>, callback: BodyResponseCallback<Schema$WriteLogEntriesResponse>): void;
        write(params: Params$Resource$Entries$Write, callback: BodyResponseCallback<Schema$WriteLogEntriesResponse>): void;
        write(callback: BodyResponseCallback<Schema$WriteLogEntriesResponse>): void;
    }
    export interface Params$Resource$Entries$Copy extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$CopyLogEntriesRequest;
    }
    export interface Params$Resource$Entries$List extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$ListLogEntriesRequest;
    }
    export interface Params$Resource$Entries$Tail extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$TailLogEntriesRequest;
    }
    export interface Params$Resource$Entries$Write extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$WriteLogEntriesRequest;
    }
    export class Resource$Exclusions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new exclusion in the _Default sink in a specified parent resource. Only log entries belonging to that resource can be excluded. You can have up to 10 exclusions in a resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Exclusions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Exclusions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        create(params: Params$Resource$Exclusions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Exclusions$Create, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(params: Params$Resource$Exclusions$Create, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Deletes an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Exclusions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Exclusions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Exclusions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Exclusions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Exclusions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the description of an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Exclusions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Exclusions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        get(params: Params$Resource$Exclusions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Exclusions$Get, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(params: Params$Resource$Exclusions$Get, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Lists all the exclusions on the _Default sink in a parent resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Exclusions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Exclusions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListExclusionsResponse>>;
        list(params: Params$Resource$Exclusions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Exclusions$List, options: MethodOptions | BodyResponseCallback<Schema$ListExclusionsResponse>, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(params: Params$Resource$Exclusions$List, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        /**
         * Changes one or more properties of an existing exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Exclusions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Exclusions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        patch(params: Params$Resource$Exclusions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Exclusions$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(params: Params$Resource$Exclusions$Patch, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(callback: BodyResponseCallback<Schema$LogExclusion>): void;
    }
    export interface Params$Resource$Exclusions$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the exclusion: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-logging-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export interface Params$Resource$Exclusions$Delete extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion to delete: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Exclusions$Get extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Exclusions$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose exclusions are to be listed. "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Exclusions$Patch extends StandardParameters {
        /**
         * Required. The resource name of the exclusion to update: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing exclusion. New values for the fields are taken from the corresponding fields in the LogExclusion included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.For example, to change the filter and description of an exclusion, specify an update_mask of "filter,description".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export class Resource$Folders {
        context: APIRequestContext;
        exclusions: Resource$Folders$Exclusions;
        locations: Resource$Folders$Locations;
        logs: Resource$Folders$Logs;
        sinks: Resource$Folders$Sinks;
        constructor(context: APIRequestContext);
        /**
         * Gets the Logging CMEK settings for the given resource.Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCmekSettings(params: Params$Resource$Folders$Getcmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCmekSettings(params?: Params$Resource$Folders$Getcmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        getCmekSettings(params: Params$Resource$Folders$Getcmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCmekSettings(params: Params$Resource$Folders$Getcmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(params: Params$Resource$Folders$Getcmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Gets the settings for the given resource.Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.See View default resource settings for Logging (https://cloud.google.com/logging/docs/default-settings#view-org-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSettings(params: Params$Resource$Folders$Getsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSettings(params?: Params$Resource$Folders$Getsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        getSettings(params: Params$Resource$Folders$Getsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSettings(params: Params$Resource$Folders$Getsettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(params: Params$Resource$Folders$Getsettings, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(callback: BodyResponseCallback<Schema$Settings>): void;
        /**
         * Updates the settings for the given resource. This method applies to all feature configurations for organization and folders.UpdateSettings fails when any of the following are true: The value of storage_location either isn't supported by Logging or violates the location OrgPolicy. The default_sink_config field is set, but it has an unspecified filter write mode. The value of kms_key_name is invalid. The associated service account doesn't have the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key. Access to the key is disabled.See Configure default settings for organizations and folders (https://cloud.google.com/logging/docs/default-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateSettings(params: Params$Resource$Folders$Updatesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSettings(params?: Params$Resource$Folders$Updatesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        updateSettings(params: Params$Resource$Folders$Updatesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSettings(params: Params$Resource$Folders$Updatesettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(params: Params$Resource$Folders$Updatesettings, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(callback: BodyResponseCallback<Schema$Settings>): void;
    }
    export interface Params$Resource$Folders$Getcmeksettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve CMEK settings. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Getsettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve settings. "projects/[PROJECT_ID]/settings" "organizations/[ORGANIZATION_ID]/settings" "billingAccounts/[BILLING_ACCOUNT_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Updatesettings extends StandardParameters {
        /**
         * Required. The resource name for the settings to update. "organizations/[ORGANIZATION_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"
         */
        name?: string;
        /**
         * Optional. Field mask identifying which fields from settings should be updated. A field will be overwritten if and only if it is in the update mask. Output only fields cannot be updated.See FieldMask for more information.For example: "updateMask=kmsKeyName"
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Settings;
    }
    export class Resource$Folders$Exclusions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new exclusion in the _Default sink in a specified parent resource. Only log entries belonging to that resource can be excluded. You can have up to 10 exclusions in a resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Exclusions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Exclusions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        create(params: Params$Resource$Folders$Exclusions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Exclusions$Create, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(params: Params$Resource$Folders$Exclusions$Create, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Deletes an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Exclusions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Exclusions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Exclusions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Exclusions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Exclusions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the description of an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Exclusions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Exclusions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        get(params: Params$Resource$Folders$Exclusions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Exclusions$Get, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(params: Params$Resource$Folders$Exclusions$Get, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Lists all the exclusions on the _Default sink in a parent resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Exclusions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Exclusions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListExclusionsResponse>>;
        list(params: Params$Resource$Folders$Exclusions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Exclusions$List, options: MethodOptions | BodyResponseCallback<Schema$ListExclusionsResponse>, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(params: Params$Resource$Folders$Exclusions$List, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        /**
         * Changes one or more properties of an existing exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Exclusions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Exclusions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        patch(params: Params$Resource$Folders$Exclusions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Exclusions$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(params: Params$Resource$Folders$Exclusions$Patch, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(callback: BodyResponseCallback<Schema$LogExclusion>): void;
    }
    export interface Params$Resource$Folders$Exclusions$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the exclusion: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-logging-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export interface Params$Resource$Folders$Exclusions$Delete extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion to delete: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Exclusions$Get extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Exclusions$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose exclusions are to be listed. "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Exclusions$Patch extends StandardParameters {
        /**
         * Required. The resource name of the exclusion to update: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing exclusion. New values for the fields are taken from the corresponding fields in the LogExclusion included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.For example, to change the filter and description of an exclusion, specify an update_mask of "filter,description".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export class Resource$Folders$Locations {
        context: APIRequestContext;
        buckets: Resource$Folders$Locations$Buckets;
        logScopes: Resource$Folders$Locations$Logscopes;
        operations: Resource$Folders$Locations$Operations;
        recentQueries: Resource$Folders$Locations$Recentqueries;
        savedQueries: Resource$Folders$Locations$Savedqueries;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Folders$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Folders$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Folders$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Folders$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in AIP-160 (https://google.aip.dev/160).
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
         * A page token received from the next_page_token field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Folders$Locations$Buckets {
        context: APIRequestContext;
        links: Resource$Folders$Locations$Buckets$Links;
        views: Resource$Folders$Locations$Buckets$Views;
        constructor(context: APIRequestContext);
        /**
         * Creates a log bucket that can be used to store log entries. After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Locations$Buckets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Locations$Buckets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        create(params: Params$Resource$Folders$Locations$Buckets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Create, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Create, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Creates a log bucket asynchronously that can be used to store log entries.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createAsync(params: Params$Resource$Folders$Locations$Buckets$Createasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createAsync(params?: Params$Resource$Folders$Locations$Buckets$Createasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createAsync(params: Params$Resource$Folders$Locations$Buckets$Createasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createAsync(params: Params$Resource$Folders$Locations$Buckets$Createasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(params: Params$Resource$Folders$Locations$Buckets$Createasync, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a log bucket.Changes the bucket's lifecycle_state to the DELETE_REQUESTED state. After 7 days, the bucket will be purged and all log entries in the bucket will be permanently deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Locations$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Locations$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Locations$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        get(params: Params$Resource$Folders$Locations$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Get, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Lists log buckets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBucketsResponse>>;
        list(params: Params$Resource$Folders$Locations$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$ListBucketsResponse>, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$List, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        /**
         * Updates a log bucket.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Locations$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Locations$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        patch(params: Params$Resource$Folders$Locations$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Locations$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(params: Params$Resource$Folders$Locations$Buckets$Patch, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Undeletes a log bucket. A bucket that has been deleted can be undeleted within the grace period of 7 days.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Folders$Locations$Buckets$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Folders$Locations$Buckets$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        undelete(params: Params$Resource$Folders$Locations$Buckets$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Folders$Locations$Buckets$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(params: Params$Resource$Folders$Locations$Buckets$Undelete, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a log bucket asynchronously.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAsync(params: Params$Resource$Folders$Locations$Buckets$Updateasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAsync(params?: Params$Resource$Folders$Locations$Buckets$Updateasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateAsync(params: Params$Resource$Folders$Locations$Buckets$Updateasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAsync(params: Params$Resource$Folders$Locations$Buckets$Updateasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(params: Params$Resource$Folders$Locations$Buckets$Updateasync, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Createasync extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Get extends StandardParameters {
        /**
         * Required. The resource name of the bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose buckets are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" Note: The locations portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all buckets.
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Undelete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to undelete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteBucketRequest;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Updateasync extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export class Resource$Folders$Locations$Buckets$Links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Asynchronously creates a linked dataset in BigQuery which makes it possible to use BigQuery to read the logs stored in the log bucket. A log bucket may currently only contain one link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Locations$Buckets$Links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Locations$Buckets$Links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Folders$Locations$Buckets$Links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Links$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Links$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a link. This will also delete the corresponding BigQuery linked dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Locations$Buckets$Links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Locations$Buckets$Links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Folders$Locations$Buckets$Links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Links$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Links$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Buckets$Links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Buckets$Links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Link>>;
        get(params: Params$Resource$Folders$Locations$Buckets$Links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Links$Get, options: MethodOptions | BodyResponseCallback<Schema$Link>, callback: BodyResponseCallback<Schema$Link>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Links$Get, callback: BodyResponseCallback<Schema$Link>): void;
        get(callback: BodyResponseCallback<Schema$Link>): void;
        /**
         * Lists links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Buckets$Links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Buckets$Links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLinksResponse>>;
        list(params: Params$Resource$Folders$Locations$Buckets$Links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Links$List, options: MethodOptions | BodyResponseCallback<Schema$ListLinksResponse>, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Links$List, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Links$Create extends StandardParameters {
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Link;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Links$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Links$Get extends StandardParameters {
        /**
         * Required. The resource name of the link: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Links$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose links are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export class Resource$Folders$Locations$Buckets$Views {
        context: APIRequestContext;
        logs: Resource$Folders$Locations$Buckets$Views$Logs;
        constructor(context: APIRequestContext);
        /**
         * Creates a view over log entries in a log bucket. A bucket may contain a maximum of 30 views.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Locations$Buckets$Views$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Locations$Buckets$Views$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        create(params: Params$Resource$Folders$Locations$Buckets$Views$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Views$Create, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        create(params: Params$Resource$Folders$Locations$Buckets$Views$Create, callback: BodyResponseCallback<Schema$LogView>): void;
        create(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Deletes a view on a log bucket. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can delete the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Locations$Buckets$Views$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Locations$Buckets$Views$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Locations$Buckets$Views$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Views$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Locations$Buckets$Views$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a view on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Buckets$Views$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Buckets$Views$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        get(params: Params$Resource$Folders$Locations$Buckets$Views$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Views$Get, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        get(params: Params$Resource$Folders$Locations$Buckets$Views$Get, callback: BodyResponseCallback<Schema$LogView>): void;
        get(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists views on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Buckets$Views$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Buckets$Views$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListViewsResponse>>;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$List, options: MethodOptions | BodyResponseCallback<Schema$ListViewsResponse>, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$List, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        /**
         * Updates a view on a log bucket. This method replaces the value of the filter field from the existing view with the corresponding value from the new view. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can update the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Locations$Buckets$Views$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Locations$Buckets$Views$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        patch(params: Params$Resource$Folders$Locations$Buckets$Views$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Locations$Buckets$Views$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(params: Params$Resource$Folders$Locations$Buckets$Views$Patch, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Create extends StandardParameters {
        /**
         * Required. The bucket in which to create the view `"projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"` For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        parent?: string;
        /**
         * Required. A client-assigned identifier such as "my-view". Identifiers are limited to 100 characters and can include only letters, digits, underscores, and hyphens.
         */
        viewId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the view to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Get extends StandardParameters {
        /**
         * Required. The resource name of the policy: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The bucket whose views are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the view to update "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in view that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Folders$Locations$Buckets$Views$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Buckets$Views$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Folders$Locations$Buckets$Views$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Buckets$Views$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Folders$Locations$Logscopes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Locations$Logscopes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Locations$Logscopes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        create(params: Params$Resource$Folders$Locations$Logscopes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Locations$Logscopes$Create, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(params: Params$Resource$Folders$Locations$Logscopes$Create, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Deletes a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Locations$Logscopes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Locations$Logscopes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Locations$Logscopes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Locations$Logscopes$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Locations$Logscopes$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Logscopes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Logscopes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        get(params: Params$Resource$Folders$Locations$Logscopes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Logscopes$Get, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(params: Params$Resource$Folders$Locations$Logscopes$Get, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Lists log scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Logscopes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Logscopes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogScopesResponse>>;
        list(params: Params$Resource$Folders$Locations$Logscopes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Logscopes$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogScopesResponse>, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(params: Params$Resource$Folders$Locations$Logscopes$List, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        /**
         * Updates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Locations$Logscopes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Locations$Logscopes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        patch(params: Params$Resource$Folders$Locations$Logscopes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Locations$Logscopes$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(params: Params$Resource$Folders$Locations$Logscopes$Patch, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(callback: BodyResponseCallback<Schema$LogScope>): void;
    }
    export interface Params$Resource$Folders$Locations$Logscopes$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "log-scope". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.
         */
        logScopeId?: string;
        /**
         * Required. The parent project in which to create the log scope "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
    }
    export interface Params$Resource$Folders$Locations$Logscopes$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log scope to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Logscopes$Get extends StandardParameters {
        /**
         * Required. The resource name of the log scope: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Logscopes$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose log scopes are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Locations$Logscopes$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the log scope.Log scopes are only available in the global location. For example:projects/my-project/locations/global/logScopes/my-log-scope
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in log_scope that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=description
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
    }
    export class Resource$Folders$Locations$Operations {
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
        cancel(params: Params$Resource$Folders$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Folders$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Folders$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Folders$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Folders$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Folders$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Folders$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Folders$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Folders$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Folders$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Operations$List extends StandardParameters {
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
    export class Resource$Folders$Locations$Recentqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the RecentQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Recentqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Recentqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRecentQueriesResponse>>;
        list(params: Params$Resource$Folders$Locations$Recentqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Recentqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListRecentQueriesResponse>, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(params: Params$Resource$Folders$Locations$Recentqueries$List, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
    }
    export interface Params$Resource$Folders$Locations$Recentqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") of the recent queries to list. The only valid value for this field is one of the two allowable type function calls, which are the following: type("Logging") type("OpsAnalytics")
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example:projects/my-project/locations/us-central1Note: The location portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all recent queries.
         */
        parent?: string;
    }
    export class Resource$Folders$Locations$Savedqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new SavedQuery for the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Locations$Savedqueries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Locations$Savedqueries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        create(params: Params$Resource$Folders$Locations$Savedqueries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Locations$Savedqueries$Create, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(params: Params$Resource$Folders$Locations$Savedqueries$Create, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Deletes an existing SavedQuery that was created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Locations$Savedqueries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Locations$Savedqueries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Locations$Savedqueries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Locations$Savedqueries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Locations$Savedqueries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns all data associated with the requested query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Locations$Savedqueries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Locations$Savedqueries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        get(params: Params$Resource$Folders$Locations$Savedqueries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Locations$Savedqueries$Get, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(params: Params$Resource$Folders$Locations$Savedqueries$Get, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Lists the SavedQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Locations$Savedqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Locations$Savedqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSavedQueriesResponse>>;
        list(params: Params$Resource$Folders$Locations$Savedqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Locations$Savedqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListSavedQueriesResponse>, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(params: Params$Resource$Folders$Locations$Savedqueries$List, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        /**
         * Updates an existing SavedQuery.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Locations$Savedqueries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Locations$Savedqueries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        patch(params: Params$Resource$Folders$Locations$Savedqueries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Locations$Savedqueries$Patch, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(params: Params$Resource$Folders$Locations$Savedqueries$Patch, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(callback: BodyResponseCallback<Schema$SavedQuery>): void;
    }
    export interface Params$Resource$Folders$Locations$Savedqueries$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the saved query: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/global" "organizations/123456789/locations/us-central1"
         */
        parent?: string;
        /**
         * Optional. The ID to use for the saved query, which will become the final component of the saved query's resource name.If the saved_query_id is not provided, the system will generate an alphanumeric ID.The saved_query_id is limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.
         */
        savedQueryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export interface Params$Resource$Folders$Locations$Savedqueries$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the saved query to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Savedqueries$Get extends StandardParameters {
        /**
         * Required. The resource name of the saved query. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Locations$Savedqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") and the visibility (PRIVATE or SHARED) of the saved queries to list. If provided, the filter must contain either the type function or a visibility token, or both. If both are chosen, they can be placed in any order, but they must be joined by the AND operator or the empty character.The two supported type function calls are: type("Logging") type("OpsAnalytics")The two supported visibility tokens are: visibility = PRIVATE visibility = SHAREDFor example:type("Logging") AND visibility = PRIVATE visibility=SHARED type("OpsAnalytics") type("OpsAnalytics)" visibility = PRIVATE visibility = SHARED
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/us-central1" Note: The locations portion of the resource must be specified. To get a list of all saved queries, a wildcard character - can be used for LOCATION_ID, for example: "projects/my-project/locations/-"
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Locations$Savedqueries$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the saved query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support#bucket-regions)After the saved query is created, the location cannot be changed.If the user doesn't provide a QUERY_ID, the system will generate an alphanumeric ID.
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing saved query. Fields are relative to the saved_query and new values for the fields are taken from the corresponding fields in the SavedQuery included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.To update all mutable fields, specify an update_mask of *.For example, to change the description and query filter text of a saved query, specify an update_mask of "description, query.filter".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export class Resource$Folders$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes all the log entries in a log for the _Default Log Bucket. The log reappears if it receives new entries. Log entries written shortly before the delete operation might not be deleted. Entries received after the delete operation with a timestamp before the operation will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Logs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Logs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Logs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Logs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Logs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Folders$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Folders$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Folders$Logs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log to delete: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/123/logs/cloudaudit.googleapis.com%2Factivity".For more information about log names, see LogEntry.
         */
        logName?: string;
    }
    export interface Params$Resource$Folders$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Folders$Sinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports specified log entries to a destination. The export begins upon ingress, unless the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Folders$Sinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Folders$Sinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        create(params: Params$Resource$Folders$Sinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Folders$Sinks$Create, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(params: Params$Resource$Folders$Sinks$Create, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Folders$Sinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Folders$Sinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Folders$Sinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Folders$Sinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Folders$Sinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Folders$Sinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Sinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        get(params: Params$Resource$Folders$Sinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Sinks$Get, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(params: Params$Resource$Folders$Sinks$Get, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Lists sinks.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Folders$Sinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Sinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSinksResponse>>;
        list(params: Params$Resource$Folders$Sinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Sinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListSinksResponse>, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(params: Params$Resource$Folders$Sinks$List, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Folders$Sinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Folders$Sinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        patch(params: Params$Resource$Folders$Sinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Folders$Sinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(params: Params$Resource$Folders$Sinks$Patch, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Folders$Sinks$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Folders$Sinks$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        update(params: Params$Resource$Folders$Sinks$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Folders$Sinks$Update, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(params: Params$Resource$Folders$Sinks$Update, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(callback: BodyResponseCallback<Schema$LogSink>): void;
    }
    export interface Params$Resource$Folders$Sinks$Create extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Folders$Sinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Folders$Sinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Folders$Sinks$List extends StandardParameters {
        /**
         * Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope("ALL")', 'in_scope("ANCESTOR")', 'in_scope("DEFAULT")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope("DEFAULT")' is applied.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Folders$Sinks$Patch extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Folders$Sinks$Update extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export class Resource$Locations {
        context: APIRequestContext;
        buckets: Resource$Locations$Buckets;
        operations: Resource$Locations$Operations;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in AIP-160 (https://google.aip.dev/160).
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
         * A page token received from the next_page_token field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Locations$Buckets {
        context: APIRequestContext;
        links: Resource$Locations$Buckets$Links;
        views: Resource$Locations$Buckets$Views;
        constructor(context: APIRequestContext);
        /**
         * Creates a log bucket that can be used to store log entries. After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Buckets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Buckets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        create(params: Params$Resource$Locations$Buckets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Buckets$Create, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(params: Params$Resource$Locations$Buckets$Create, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Creates a log bucket asynchronously that can be used to store log entries.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createAsync(params: Params$Resource$Locations$Buckets$Createasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createAsync(params?: Params$Resource$Locations$Buckets$Createasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createAsync(params: Params$Resource$Locations$Buckets$Createasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createAsync(params: Params$Resource$Locations$Buckets$Createasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(params: Params$Resource$Locations$Buckets$Createasync, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a log bucket.Changes the bucket's lifecycle_state to the DELETE_REQUESTED state. After 7 days, the bucket will be purged and all log entries in the bucket will be permanently deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Locations$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Buckets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Locations$Buckets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        get(params: Params$Resource$Locations$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(params: Params$Resource$Locations$Buckets$Get, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Lists log buckets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBucketsResponse>>;
        list(params: Params$Resource$Locations$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$ListBucketsResponse>, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(params: Params$Resource$Locations$Buckets$List, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        /**
         * Updates a log bucket.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Locations$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Locations$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        patch(params: Params$Resource$Locations$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Locations$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(params: Params$Resource$Locations$Buckets$Patch, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Undeletes a log bucket. A bucket that has been deleted can be undeleted within the grace period of 7 days.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Locations$Buckets$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Locations$Buckets$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        undelete(params: Params$Resource$Locations$Buckets$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Locations$Buckets$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(params: Params$Resource$Locations$Buckets$Undelete, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a log bucket asynchronously.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAsync(params: Params$Resource$Locations$Buckets$Updateasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAsync(params?: Params$Resource$Locations$Buckets$Updateasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateAsync(params: Params$Resource$Locations$Buckets$Updateasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAsync(params: Params$Resource$Locations$Buckets$Updateasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(params: Params$Resource$Locations$Buckets$Updateasync, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Buckets$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Locations$Buckets$Createasync extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Locations$Buckets$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$Get extends StandardParameters {
        /**
         * Required. The resource name of the bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose buckets are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" Note: The locations portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all buckets.
         */
        parent?: string;
    }
    export interface Params$Resource$Locations$Buckets$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Locations$Buckets$Undelete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to undelete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteBucketRequest;
    }
    export interface Params$Resource$Locations$Buckets$Updateasync extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export class Resource$Locations$Buckets$Links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Asynchronously creates a linked dataset in BigQuery which makes it possible to use BigQuery to read the logs stored in the log bucket. A log bucket may currently only contain one link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Buckets$Links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Buckets$Links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Locations$Buckets$Links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Buckets$Links$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Locations$Buckets$Links$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a link. This will also delete the corresponding BigQuery linked dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Buckets$Links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Buckets$Links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Buckets$Links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Buckets$Links$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Buckets$Links$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Buckets$Links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Buckets$Links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Link>>;
        get(params: Params$Resource$Locations$Buckets$Links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Buckets$Links$Get, options: MethodOptions | BodyResponseCallback<Schema$Link>, callback: BodyResponseCallback<Schema$Link>): void;
        get(params: Params$Resource$Locations$Buckets$Links$Get, callback: BodyResponseCallback<Schema$Link>): void;
        get(callback: BodyResponseCallback<Schema$Link>): void;
        /**
         * Lists links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Buckets$Links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Buckets$Links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLinksResponse>>;
        list(params: Params$Resource$Locations$Buckets$Links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Buckets$Links$List, options: MethodOptions | BodyResponseCallback<Schema$ListLinksResponse>, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(params: Params$Resource$Locations$Buckets$Links$List, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
    }
    export interface Params$Resource$Locations$Buckets$Links$Create extends StandardParameters {
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Link;
    }
    export interface Params$Resource$Locations$Buckets$Links$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$Links$Get extends StandardParameters {
        /**
         * Required. The resource name of the link: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$Links$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose links are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export class Resource$Locations$Buckets$Views {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a view over log entries in a log bucket. A bucket may contain a maximum of 30 views.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Locations$Buckets$Views$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Buckets$Views$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        create(params: Params$Resource$Locations$Buckets$Views$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Buckets$Views$Create, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        create(params: Params$Resource$Locations$Buckets$Views$Create, callback: BodyResponseCallback<Schema$LogView>): void;
        create(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Deletes a view on a log bucket. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can delete the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Locations$Buckets$Views$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Buckets$Views$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Locations$Buckets$Views$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Buckets$Views$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Locations$Buckets$Views$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a view on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Buckets$Views$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Buckets$Views$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        get(params: Params$Resource$Locations$Buckets$Views$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Buckets$Views$Get, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        get(params: Params$Resource$Locations$Buckets$Views$Get, callback: BodyResponseCallback<Schema$LogView>): void;
        get(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Locations$Buckets$Views$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Locations$Buckets$Views$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Locations$Buckets$Views$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists views on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Buckets$Views$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Buckets$Views$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListViewsResponse>>;
        list(params: Params$Resource$Locations$Buckets$Views$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Buckets$Views$List, options: MethodOptions | BodyResponseCallback<Schema$ListViewsResponse>, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(params: Params$Resource$Locations$Buckets$Views$List, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        /**
         * Updates a view on a log bucket. This method replaces the value of the filter field from the existing view with the corresponding value from the new view. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can update the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Locations$Buckets$Views$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Locations$Buckets$Views$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        patch(params: Params$Resource$Locations$Buckets$Views$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Locations$Buckets$Views$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(params: Params$Resource$Locations$Buckets$Views$Patch, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Locations$Buckets$Views$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Locations$Buckets$Views$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Locations$Buckets$Views$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Locations$Buckets$Views$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Locations$Buckets$Views$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Locations$Buckets$Views$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Locations$Buckets$Views$Create extends StandardParameters {
        /**
         * Required. The bucket in which to create the view `"projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"` For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        parent?: string;
        /**
         * Required. A client-assigned identifier such as "my-view". Identifiers are limited to 100 characters and can include only letters, digits, underscores, and hyphens.
         */
        viewId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Locations$Buckets$Views$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the view to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$Views$Get extends StandardParameters {
        /**
         * Required. The resource name of the policy: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Buckets$Views$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Locations$Buckets$Views$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The bucket whose views are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Locations$Buckets$Views$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the view to update "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in view that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Locations$Buckets$Views$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Locations$Buckets$Views$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Locations$Operations {
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
        cancel(params: Params$Resource$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Operations$List extends StandardParameters {
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
    export class Resource$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes all the log entries in a log for the _Default Log Bucket. The log reappears if it receives new entries. Log entries written shortly before the delete operation might not be deleted. Entries received after the delete operation with a timestamp before the operation will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Logs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Logs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Logs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Logs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Logs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Logs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log to delete: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/123/logs/cloudaudit.googleapis.com%2Factivity".For more information about log names, see LogEntry.
         */
        logName?: string;
    }
    export interface Params$Resource$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Monitoredresourcedescriptors {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the descriptors for monitored resource types used by Logging.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Monitoredresourcedescriptors$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Monitoredresourcedescriptors$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMonitoredResourceDescriptorsResponse>>;
        list(params: Params$Resource$Monitoredresourcedescriptors$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Monitoredresourcedescriptors$List, options: MethodOptions | BodyResponseCallback<Schema$ListMonitoredResourceDescriptorsResponse>, callback: BodyResponseCallback<Schema$ListMonitoredResourceDescriptorsResponse>): void;
        list(params: Params$Resource$Monitoredresourcedescriptors$List, callback: BodyResponseCallback<Schema$ListMonitoredResourceDescriptorsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMonitoredResourceDescriptorsResponse>): void;
    }
    export interface Params$Resource$Monitoredresourcedescriptors$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        exclusions: Resource$Organizations$Exclusions;
        locations: Resource$Organizations$Locations;
        logs: Resource$Organizations$Logs;
        sinks: Resource$Organizations$Sinks;
        constructor(context: APIRequestContext);
        /**
         * Gets the Logging CMEK settings for the given resource.Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCmekSettings(params: Params$Resource$Organizations$Getcmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCmekSettings(params?: Params$Resource$Organizations$Getcmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        getCmekSettings(params: Params$Resource$Organizations$Getcmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCmekSettings(params: Params$Resource$Organizations$Getcmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(params: Params$Resource$Organizations$Getcmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Gets the settings for the given resource.Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.See View default resource settings for Logging (https://cloud.google.com/logging/docs/default-settings#view-org-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSettings(params: Params$Resource$Organizations$Getsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSettings(params?: Params$Resource$Organizations$Getsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        getSettings(params: Params$Resource$Organizations$Getsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSettings(params: Params$Resource$Organizations$Getsettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(params: Params$Resource$Organizations$Getsettings, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(callback: BodyResponseCallback<Schema$Settings>): void;
        /**
         * Updates the Log Router CMEK settings for the given resource.Note: CMEK for the Log Router can currently only be configured for Google Cloud organizations. Once configured, it applies to all projects and folders in the Google Cloud organization.UpdateCmekSettings fails when any of the following are true: The value of kms_key_name is invalid. The associated service account doesn't have the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key. Access to the key is disabled.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateCmekSettings(params: Params$Resource$Organizations$Updatecmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateCmekSettings(params?: Params$Resource$Organizations$Updatecmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        updateCmekSettings(params: Params$Resource$Organizations$Updatecmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateCmekSettings(params: Params$Resource$Organizations$Updatecmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        updateCmekSettings(params: Params$Resource$Organizations$Updatecmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        updateCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Updates the settings for the given resource. This method applies to all feature configurations for organization and folders.UpdateSettings fails when any of the following are true: The value of storage_location either isn't supported by Logging or violates the location OrgPolicy. The default_sink_config field is set, but it has an unspecified filter write mode. The value of kms_key_name is invalid. The associated service account doesn't have the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key. Access to the key is disabled.See Configure default settings for organizations and folders (https://cloud.google.com/logging/docs/default-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateSettings(params: Params$Resource$Organizations$Updatesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSettings(params?: Params$Resource$Organizations$Updatesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        updateSettings(params: Params$Resource$Organizations$Updatesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSettings(params: Params$Resource$Organizations$Updatesettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(params: Params$Resource$Organizations$Updatesettings, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(callback: BodyResponseCallback<Schema$Settings>): void;
    }
    export interface Params$Resource$Organizations$Getcmeksettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve CMEK settings. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Getsettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve settings. "projects/[PROJECT_ID]/settings" "organizations/[ORGANIZATION_ID]/settings" "billingAccounts/[BILLING_ACCOUNT_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Updatecmeksettings extends StandardParameters {
        /**
         * Required. The resource name for the CMEK settings to update. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can currently only be configured for Google Cloud organizations. Once configured, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
        /**
         * Optional. Field mask identifying which fields from cmek_settings should be updated. A field will be overwritten if and only if it is in the update mask. Output only fields cannot be updated.See FieldMask for more information.For example: "updateMask=kmsKeyName"
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CmekSettings;
    }
    export interface Params$Resource$Organizations$Updatesettings extends StandardParameters {
        /**
         * Required. The resource name for the settings to update. "organizations/[ORGANIZATION_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"
         */
        name?: string;
        /**
         * Optional. Field mask identifying which fields from settings should be updated. A field will be overwritten if and only if it is in the update mask. Output only fields cannot be updated.See FieldMask for more information.For example: "updateMask=kmsKeyName"
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Settings;
    }
    export class Resource$Organizations$Exclusions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new exclusion in the _Default sink in a specified parent resource. Only log entries belonging to that resource can be excluded. You can have up to 10 exclusions in a resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Exclusions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Exclusions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        create(params: Params$Resource$Organizations$Exclusions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Exclusions$Create, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(params: Params$Resource$Organizations$Exclusions$Create, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Deletes an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Exclusions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Exclusions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Exclusions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Exclusions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Exclusions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the description of an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Exclusions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Exclusions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        get(params: Params$Resource$Organizations$Exclusions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Exclusions$Get, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(params: Params$Resource$Organizations$Exclusions$Get, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Lists all the exclusions on the _Default sink in a parent resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Exclusions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Exclusions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListExclusionsResponse>>;
        list(params: Params$Resource$Organizations$Exclusions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Exclusions$List, options: MethodOptions | BodyResponseCallback<Schema$ListExclusionsResponse>, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(params: Params$Resource$Organizations$Exclusions$List, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        /**
         * Changes one or more properties of an existing exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Exclusions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Exclusions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        patch(params: Params$Resource$Organizations$Exclusions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Exclusions$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(params: Params$Resource$Organizations$Exclusions$Patch, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(callback: BodyResponseCallback<Schema$LogExclusion>): void;
    }
    export interface Params$Resource$Organizations$Exclusions$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the exclusion: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-logging-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export interface Params$Resource$Organizations$Exclusions$Delete extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion to delete: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Exclusions$Get extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Exclusions$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose exclusions are to be listed. "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Exclusions$Patch extends StandardParameters {
        /**
         * Required. The resource name of the exclusion to update: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing exclusion. New values for the fields are taken from the corresponding fields in the LogExclusion included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.For example, to change the filter and description of an exclusion, specify an update_mask of "filter,description".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export class Resource$Organizations$Locations {
        context: APIRequestContext;
        buckets: Resource$Organizations$Locations$Buckets;
        logScopes: Resource$Organizations$Locations$Logscopes;
        operations: Resource$Organizations$Locations$Operations;
        recentQueries: Resource$Organizations$Locations$Recentqueries;
        savedQueries: Resource$Organizations$Locations$Savedqueries;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Organizations$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Organizations$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Organizations$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in AIP-160 (https://google.aip.dev/160).
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
         * A page token received from the next_page_token field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Organizations$Locations$Buckets {
        context: APIRequestContext;
        links: Resource$Organizations$Locations$Buckets$Links;
        views: Resource$Organizations$Locations$Buckets$Views;
        constructor(context: APIRequestContext);
        /**
         * Creates a log bucket that can be used to store log entries. After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Buckets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Buckets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        create(params: Params$Resource$Organizations$Locations$Buckets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Create, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Create, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Creates a log bucket asynchronously that can be used to store log entries.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createAsync(params: Params$Resource$Organizations$Locations$Buckets$Createasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createAsync(params?: Params$Resource$Organizations$Locations$Buckets$Createasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createAsync(params: Params$Resource$Organizations$Locations$Buckets$Createasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createAsync(params: Params$Resource$Organizations$Locations$Buckets$Createasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(params: Params$Resource$Organizations$Locations$Buckets$Createasync, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a log bucket.Changes the bucket's lifecycle_state to the DELETE_REQUESTED state. After 7 days, the bucket will be purged and all log entries in the bucket will be permanently deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        get(params: Params$Resource$Organizations$Locations$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Get, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Lists log buckets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBucketsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$ListBucketsResponse>, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$List, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        /**
         * Updates a log bucket.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Patch, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Undeletes a log bucket. A bucket that has been deleted can be undeleted within the grace period of 7 days.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Organizations$Locations$Buckets$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Organizations$Locations$Buckets$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        undelete(params: Params$Resource$Organizations$Locations$Buckets$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Organizations$Locations$Buckets$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(params: Params$Resource$Organizations$Locations$Buckets$Undelete, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a log bucket asynchronously.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAsync(params: Params$Resource$Organizations$Locations$Buckets$Updateasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAsync(params?: Params$Resource$Organizations$Locations$Buckets$Updateasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateAsync(params: Params$Resource$Organizations$Locations$Buckets$Updateasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAsync(params: Params$Resource$Organizations$Locations$Buckets$Updateasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(params: Params$Resource$Organizations$Locations$Buckets$Updateasync, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Createasync extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Get extends StandardParameters {
        /**
         * Required. The resource name of the bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose buckets are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" Note: The locations portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all buckets.
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Undelete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to undelete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteBucketRequest;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Updateasync extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export class Resource$Organizations$Locations$Buckets$Links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Asynchronously creates a linked dataset in BigQuery which makes it possible to use BigQuery to read the logs stored in the log bucket. A log bucket may currently only contain one link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Buckets$Links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Buckets$Links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Organizations$Locations$Buckets$Links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Links$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Links$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a link. This will also delete the corresponding BigQuery linked dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Buckets$Links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Buckets$Links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Links$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Links$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Buckets$Links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Buckets$Links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Link>>;
        get(params: Params$Resource$Organizations$Locations$Buckets$Links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Links$Get, options: MethodOptions | BodyResponseCallback<Schema$Link>, callback: BodyResponseCallback<Schema$Link>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Links$Get, callback: BodyResponseCallback<Schema$Link>): void;
        get(callback: BodyResponseCallback<Schema$Link>): void;
        /**
         * Lists links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Buckets$Links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Buckets$Links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLinksResponse>>;
        list(params: Params$Resource$Organizations$Locations$Buckets$Links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Links$List, options: MethodOptions | BodyResponseCallback<Schema$ListLinksResponse>, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Links$List, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Links$Create extends StandardParameters {
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Link;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Links$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Links$Get extends StandardParameters {
        /**
         * Required. The resource name of the link: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Links$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose links are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export class Resource$Organizations$Locations$Buckets$Views {
        context: APIRequestContext;
        logs: Resource$Organizations$Locations$Buckets$Views$Logs;
        constructor(context: APIRequestContext);
        /**
         * Creates a view over log entries in a log bucket. A bucket may contain a maximum of 30 views.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Buckets$Views$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Buckets$Views$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        create(params: Params$Resource$Organizations$Locations$Buckets$Views$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Views$Create, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        create(params: Params$Resource$Organizations$Locations$Buckets$Views$Create, callback: BodyResponseCallback<Schema$LogView>): void;
        create(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Deletes a view on a log bucket. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can delete the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Buckets$Views$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Buckets$Views$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Views$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Views$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Locations$Buckets$Views$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a view on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Buckets$Views$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Buckets$Views$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        get(params: Params$Resource$Organizations$Locations$Buckets$Views$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Views$Get, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        get(params: Params$Resource$Organizations$Locations$Buckets$Views$Get, callback: BodyResponseCallback<Schema$LogView>): void;
        get(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists views on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Buckets$Views$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListViewsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$List, options: MethodOptions | BodyResponseCallback<Schema$ListViewsResponse>, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$List, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        /**
         * Updates a view on a log bucket. This method replaces the value of the filter field from the existing view with the corresponding value from the new view. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can update the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Buckets$Views$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Buckets$Views$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Views$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Views$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(params: Params$Resource$Organizations$Locations$Buckets$Views$Patch, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Create extends StandardParameters {
        /**
         * Required. The bucket in which to create the view `"projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"` For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        parent?: string;
        /**
         * Required. A client-assigned identifier such as "my-view". Identifiers are limited to 100 characters and can include only letters, digits, underscores, and hyphens.
         */
        viewId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the view to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Get extends StandardParameters {
        /**
         * Required. The resource name of the policy: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The bucket whose views are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the view to update "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in view that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Organizations$Locations$Buckets$Views$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Buckets$Views$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Buckets$Views$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Buckets$Views$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Organizations$Locations$Logscopes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Logscopes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Logscopes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        create(params: Params$Resource$Organizations$Locations$Logscopes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Logscopes$Create, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(params: Params$Resource$Organizations$Locations$Logscopes$Create, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Deletes a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Logscopes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Logscopes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Locations$Logscopes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Logscopes$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Locations$Logscopes$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Logscopes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Logscopes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        get(params: Params$Resource$Organizations$Locations$Logscopes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Logscopes$Get, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(params: Params$Resource$Organizations$Locations$Logscopes$Get, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Lists log scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Logscopes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Logscopes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogScopesResponse>>;
        list(params: Params$Resource$Organizations$Locations$Logscopes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Logscopes$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogScopesResponse>, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Logscopes$List, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        /**
         * Updates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Logscopes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Logscopes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        patch(params: Params$Resource$Organizations$Locations$Logscopes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Logscopes$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(params: Params$Resource$Organizations$Locations$Logscopes$Patch, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(callback: BodyResponseCallback<Schema$LogScope>): void;
    }
    export interface Params$Resource$Organizations$Locations$Logscopes$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "log-scope". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.
         */
        logScopeId?: string;
        /**
         * Required. The parent project in which to create the log scope "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
    }
    export interface Params$Resource$Organizations$Locations$Logscopes$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log scope to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Logscopes$Get extends StandardParameters {
        /**
         * Required. The resource name of the log scope: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Logscopes$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose log scopes are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Logscopes$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the log scope.Log scopes are only available in the global location. For example:projects/my-project/locations/global/logScopes/my-log-scope
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in log_scope that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=description
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
    }
    export class Resource$Organizations$Locations$Operations {
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
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Organizations$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Organizations$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Organizations$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Organizations$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Operations$List extends StandardParameters {
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
    export class Resource$Organizations$Locations$Recentqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the RecentQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Recentqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Recentqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRecentQueriesResponse>>;
        list(params: Params$Resource$Organizations$Locations$Recentqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Recentqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListRecentQueriesResponse>, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Recentqueries$List, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
    }
    export interface Params$Resource$Organizations$Locations$Recentqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") of the recent queries to list. The only valid value for this field is one of the two allowable type function calls, which are the following: type("Logging") type("OpsAnalytics")
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example:projects/my-project/locations/us-central1Note: The location portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all recent queries.
         */
        parent?: string;
    }
    export class Resource$Organizations$Locations$Savedqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new SavedQuery for the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Locations$Savedqueries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Locations$Savedqueries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        create(params: Params$Resource$Organizations$Locations$Savedqueries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Locations$Savedqueries$Create, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(params: Params$Resource$Organizations$Locations$Savedqueries$Create, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Deletes an existing SavedQuery that was created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Locations$Savedqueries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Locations$Savedqueries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Locations$Savedqueries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Locations$Savedqueries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Locations$Savedqueries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns all data associated with the requested query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Locations$Savedqueries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Locations$Savedqueries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        get(params: Params$Resource$Organizations$Locations$Savedqueries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Locations$Savedqueries$Get, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(params: Params$Resource$Organizations$Locations$Savedqueries$Get, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Lists the SavedQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Locations$Savedqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Locations$Savedqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSavedQueriesResponse>>;
        list(params: Params$Resource$Organizations$Locations$Savedqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Locations$Savedqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListSavedQueriesResponse>, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(params: Params$Resource$Organizations$Locations$Savedqueries$List, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        /**
         * Updates an existing SavedQuery.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Locations$Savedqueries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Locations$Savedqueries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        patch(params: Params$Resource$Organizations$Locations$Savedqueries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Locations$Savedqueries$Patch, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(params: Params$Resource$Organizations$Locations$Savedqueries$Patch, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(callback: BodyResponseCallback<Schema$SavedQuery>): void;
    }
    export interface Params$Resource$Organizations$Locations$Savedqueries$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the saved query: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/global" "organizations/123456789/locations/us-central1"
         */
        parent?: string;
        /**
         * Optional. The ID to use for the saved query, which will become the final component of the saved query's resource name.If the saved_query_id is not provided, the system will generate an alphanumeric ID.The saved_query_id is limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.
         */
        savedQueryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export interface Params$Resource$Organizations$Locations$Savedqueries$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the saved query to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Savedqueries$Get extends StandardParameters {
        /**
         * Required. The resource name of the saved query. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Locations$Savedqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") and the visibility (PRIVATE or SHARED) of the saved queries to list. If provided, the filter must contain either the type function or a visibility token, or both. If both are chosen, they can be placed in any order, but they must be joined by the AND operator or the empty character.The two supported type function calls are: type("Logging") type("OpsAnalytics")The two supported visibility tokens are: visibility = PRIVATE visibility = SHAREDFor example:type("Logging") AND visibility = PRIVATE visibility=SHARED type("OpsAnalytics") type("OpsAnalytics)" visibility = PRIVATE visibility = SHARED
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/us-central1" Note: The locations portion of the resource must be specified. To get a list of all saved queries, a wildcard character - can be used for LOCATION_ID, for example: "projects/my-project/locations/-"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Locations$Savedqueries$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the saved query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support#bucket-regions)After the saved query is created, the location cannot be changed.If the user doesn't provide a QUERY_ID, the system will generate an alphanumeric ID.
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing saved query. Fields are relative to the saved_query and new values for the fields are taken from the corresponding fields in the SavedQuery included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.To update all mutable fields, specify an update_mask of *.For example, to change the description and query filter text of a saved query, specify an update_mask of "description, query.filter".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export class Resource$Organizations$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes all the log entries in a log for the _Default Log Bucket. The log reappears if it receives new entries. Log entries written shortly before the delete operation might not be deleted. Entries received after the delete operation with a timestamp before the operation will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Logs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Logs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Logs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Logs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Logs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Organizations$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Organizations$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Organizations$Logs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log to delete: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/123/logs/cloudaudit.googleapis.com%2Factivity".For more information about log names, see LogEntry.
         */
        logName?: string;
    }
    export interface Params$Resource$Organizations$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Organizations$Sinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports specified log entries to a destination. The export begins upon ingress, unless the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Organizations$Sinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Organizations$Sinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        create(params: Params$Resource$Organizations$Sinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Organizations$Sinks$Create, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(params: Params$Resource$Organizations$Sinks$Create, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Organizations$Sinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Sinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Sinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Sinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Sinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Organizations$Sinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Sinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        get(params: Params$Resource$Organizations$Sinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Sinks$Get, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(params: Params$Resource$Organizations$Sinks$Get, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Lists sinks.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Organizations$Sinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Sinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSinksResponse>>;
        list(params: Params$Resource$Organizations$Sinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Sinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListSinksResponse>, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(params: Params$Resource$Organizations$Sinks$List, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Organizations$Sinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Organizations$Sinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        patch(params: Params$Resource$Organizations$Sinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Organizations$Sinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(params: Params$Resource$Organizations$Sinks$Patch, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Organizations$Sinks$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Organizations$Sinks$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        update(params: Params$Resource$Organizations$Sinks$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Organizations$Sinks$Update, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(params: Params$Resource$Organizations$Sinks$Update, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(callback: BodyResponseCallback<Schema$LogSink>): void;
    }
    export interface Params$Resource$Organizations$Sinks$Create extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Organizations$Sinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Organizations$Sinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Organizations$Sinks$List extends StandardParameters {
        /**
         * Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope("ALL")', 'in_scope("ANCESTOR")', 'in_scope("DEFAULT")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope("DEFAULT")' is applied.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Organizations$Sinks$Patch extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Organizations$Sinks$Update extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        exclusions: Resource$Projects$Exclusions;
        locations: Resource$Projects$Locations;
        logs: Resource$Projects$Logs;
        metrics: Resource$Projects$Metrics;
        sinks: Resource$Projects$Sinks;
        constructor(context: APIRequestContext);
        /**
         * Gets the Logging CMEK settings for the given resource.Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCmekSettings(params: Params$Resource$Projects$Getcmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCmekSettings(params?: Params$Resource$Projects$Getcmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        getCmekSettings(params: Params$Resource$Projects$Getcmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCmekSettings(params: Params$Resource$Projects$Getcmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(params: Params$Resource$Projects$Getcmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Gets the settings for the given resource.Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.See View default resource settings for Logging (https://cloud.google.com/logging/docs/default-settings#view-org-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSettings(params: Params$Resource$Projects$Getsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSettings(params?: Params$Resource$Projects$Getsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        getSettings(params: Params$Resource$Projects$Getsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSettings(params: Params$Resource$Projects$Getsettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(params: Params$Resource$Projects$Getsettings, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(callback: BodyResponseCallback<Schema$Settings>): void;
    }
    export interface Params$Resource$Projects$Getcmeksettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve CMEK settings. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Getsettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve settings. "projects/[PROJECT_ID]/settings" "organizations/[ORGANIZATION_ID]/settings" "billingAccounts/[BILLING_ACCOUNT_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.
         */
        name?: string;
    }
    export class Resource$Projects$Exclusions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new exclusion in the _Default sink in a specified parent resource. Only log entries belonging to that resource can be excluded. You can have up to 10 exclusions in a resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Exclusions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Exclusions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        create(params: Params$Resource$Projects$Exclusions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Exclusions$Create, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(params: Params$Resource$Projects$Exclusions$Create, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        create(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Deletes an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Exclusions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Exclusions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Exclusions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Exclusions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Exclusions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the description of an exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Exclusions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Exclusions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        get(params: Params$Resource$Projects$Exclusions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Exclusions$Get, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(params: Params$Resource$Projects$Exclusions$Get, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        get(callback: BodyResponseCallback<Schema$LogExclusion>): void;
        /**
         * Lists all the exclusions on the _Default sink in a parent resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Exclusions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Exclusions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListExclusionsResponse>>;
        list(params: Params$Resource$Projects$Exclusions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Exclusions$List, options: MethodOptions | BodyResponseCallback<Schema$ListExclusionsResponse>, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(params: Params$Resource$Projects$Exclusions$List, callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListExclusionsResponse>): void;
        /**
         * Changes one or more properties of an existing exclusion in the _Default sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Exclusions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Exclusions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogExclusion>>;
        patch(params: Params$Resource$Projects$Exclusions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Exclusions$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogExclusion>, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(params: Params$Resource$Projects$Exclusions$Patch, callback: BodyResponseCallback<Schema$LogExclusion>): void;
        patch(callback: BodyResponseCallback<Schema$LogExclusion>): void;
    }
    export interface Params$Resource$Projects$Exclusions$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the exclusion: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-logging-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export interface Params$Resource$Projects$Exclusions$Delete extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion to delete: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Exclusions$Get extends StandardParameters {
        /**
         * Required. The resource name of an existing exclusion: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Exclusions$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose exclusions are to be listed. "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Exclusions$Patch extends StandardParameters {
        /**
         * Required. The resource name of the exclusion to update: "projects/[PROJECT_ID]/exclusions/[EXCLUSION_ID]" "organizations/[ORGANIZATION_ID]/exclusions/[EXCLUSION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/exclusions/[EXCLUSION_ID]" "folders/[FOLDER_ID]/exclusions/[EXCLUSION_ID]" For example:"projects/my-project/exclusions/my-exclusion"
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing exclusion. New values for the fields are taken from the corresponding fields in the LogExclusion included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.For example, to change the filter and description of an exclusion, specify an update_mask of "filter,description".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogExclusion;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        buckets: Resource$Projects$Locations$Buckets;
        logScopes: Resource$Projects$Locations$Logscopes;
        operations: Resource$Projects$Locations$Operations;
        recentQueries: Resource$Projects$Locations$Recentqueries;
        savedQueries: Resource$Projects$Locations$Savedqueries;
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
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in AIP-160 (https://google.aip.dev/160).
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
         * A page token received from the next_page_token field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Buckets {
        context: APIRequestContext;
        links: Resource$Projects$Locations$Buckets$Links;
        views: Resource$Projects$Locations$Buckets$Views;
        constructor(context: APIRequestContext);
        /**
         * Creates a log bucket that can be used to store log entries. After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Buckets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Buckets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        create(params: Params$Resource$Projects$Locations$Buckets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Create, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Create, callback: BodyResponseCallback<Schema$LogBucket>): void;
        create(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Creates a log bucket asynchronously that can be used to store log entries.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createAsync(params: Params$Resource$Projects$Locations$Buckets$Createasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createAsync(params?: Params$Resource$Projects$Locations$Buckets$Createasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        createAsync(params: Params$Resource$Projects$Locations$Buckets$Createasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createAsync(params: Params$Resource$Projects$Locations$Buckets$Createasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(params: Params$Resource$Projects$Locations$Buckets$Createasync, callback: BodyResponseCallback<Schema$Operation>): void;
        createAsync(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a log bucket.Changes the bucket's lifecycle_state to the DELETE_REQUESTED state. After 7 days, the bucket will be purged and all log entries in the bucket will be permanently deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        get(params: Params$Resource$Projects$Locations$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Get, callback: BodyResponseCallback<Schema$LogBucket>): void;
        get(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Lists log buckets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBucketsResponse>>;
        list(params: Params$Resource$Projects$Locations$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$ListBucketsResponse>, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$List, callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBucketsResponse>): void;
        /**
         * Updates a log bucket.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogBucket>>;
        patch(params: Params$Resource$Projects$Locations$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogBucket>, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(params: Params$Resource$Projects$Locations$Buckets$Patch, callback: BodyResponseCallback<Schema$LogBucket>): void;
        patch(callback: BodyResponseCallback<Schema$LogBucket>): void;
        /**
         * Undeletes a log bucket. A bucket that has been deleted can be undeleted within the grace period of 7 days.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        undelete(params: Params$Resource$Projects$Locations$Buckets$Undelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        undelete(params?: Params$Resource$Projects$Locations$Buckets$Undelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        undelete(params: Params$Resource$Projects$Locations$Buckets$Undelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        undelete(params: Params$Resource$Projects$Locations$Buckets$Undelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(params: Params$Resource$Projects$Locations$Buckets$Undelete, callback: BodyResponseCallback<Schema$Empty>): void;
        undelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a log bucket asynchronously.If the bucket has a lifecycle_state of DELETE_REQUESTED, then FAILED_PRECONDITION will be returned.After a bucket has been created, the bucket's location cannot be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAsync(params: Params$Resource$Projects$Locations$Buckets$Updateasync, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAsync(params?: Params$Resource$Projects$Locations$Buckets$Updateasync, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateAsync(params: Params$Resource$Projects$Locations$Buckets$Updateasync, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAsync(params: Params$Resource$Projects$Locations$Buckets$Updateasync, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(params: Params$Resource$Projects$Locations$Buckets$Updateasync, callback: BodyResponseCallback<Schema$Operation>): void;
        updateAsync(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Createasync extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "my-bucket". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. Bucket identifiers must start with an alphanumeric character.
         */
        bucketId?: string;
        /**
         * Required. The resource in which to create the log bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Get extends StandardParameters {
        /**
         * Required. The resource name of the bucket: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose buckets are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" Note: The locations portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all buckets.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Undelete extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to undelete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UndeleteBucketRequest;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Updateasync extends StandardParameters {
        /**
         * Required. The full resource name of the bucket to update. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        name?: string;
        /**
         * Required. Field mask that specifies the fields in bucket that need an update. A bucket field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=retention_days
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogBucket;
    }
    export class Resource$Projects$Locations$Buckets$Links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Asynchronously creates a linked dataset in BigQuery which makes it possible to use BigQuery to read the logs stored in the log bucket. A log bucket may currently only contain one link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Buckets$Links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Buckets$Links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Buckets$Links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Links$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Links$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a link. This will also delete the corresponding BigQuery linked dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Buckets$Links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Buckets$Links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Buckets$Links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Links$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Links$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Buckets$Links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Buckets$Links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Link>>;
        get(params: Params$Resource$Projects$Locations$Buckets$Links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Links$Get, options: MethodOptions | BodyResponseCallback<Schema$Link>, callback: BodyResponseCallback<Schema$Link>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Links$Get, callback: BodyResponseCallback<Schema$Link>): void;
        get(callback: BodyResponseCallback<Schema$Link>): void;
        /**
         * Lists links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Buckets$Links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Buckets$Links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLinksResponse>>;
        list(params: Params$Resource$Projects$Locations$Buckets$Links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Links$List, options: MethodOptions | BodyResponseCallback<Schema$ListLinksResponse>, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Links$List, callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLinksResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Links$Create extends StandardParameters {
        /**
         * Required. The ID to use for the link. The link_id can have up to 100 characters. A valid link_id must only have alphanumeric characters and underscores within it.
         */
        linkId?: string;
        /**
         * Required. The full resource name of the bucket to create a link for. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Link;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Links$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the link to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Links$Get extends StandardParameters {
        /**
         * Required. The resource name of the link: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/links/[LINK_ID]"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Links$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose links are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Buckets$Views {
        context: APIRequestContext;
        logs: Resource$Projects$Locations$Buckets$Views$Logs;
        constructor(context: APIRequestContext);
        /**
         * Creates a view over log entries in a log bucket. A bucket may contain a maximum of 30 views.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Buckets$Views$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Buckets$Views$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        create(params: Params$Resource$Projects$Locations$Buckets$Views$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Views$Create, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        create(params: Params$Resource$Projects$Locations$Buckets$Views$Create, callback: BodyResponseCallback<Schema$LogView>): void;
        create(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Deletes a view on a log bucket. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can delete the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Buckets$Views$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Buckets$Views$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Buckets$Views$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Views$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Buckets$Views$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a view on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Buckets$Views$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Buckets$Views$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        get(params: Params$Resource$Projects$Locations$Buckets$Views$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Views$Get, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        get(params: Params$Resource$Projects$Locations$Buckets$Views$Get, callback: BodyResponseCallback<Schema$LogView>): void;
        get(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists views on a log bucket.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Buckets$Views$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Buckets$Views$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListViewsResponse>>;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$List, options: MethodOptions | BodyResponseCallback<Schema$ListViewsResponse>, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$List, callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListViewsResponse>): void;
        /**
         * Updates a view on a log bucket. This method replaces the value of the filter field from the existing view with the corresponding value from the new view. If an UNAVAILABLE error is returned, this indicates that system is not in a state where it can update the view. If this occurs, please try again in a few minutes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Buckets$Views$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Buckets$Views$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogView>>;
        patch(params: Params$Resource$Projects$Locations$Buckets$Views$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Buckets$Views$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogView>, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(params: Params$Resource$Projects$Locations$Buckets$Views$Patch, callback: BodyResponseCallback<Schema$LogView>): void;
        patch(callback: BodyResponseCallback<Schema$LogView>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.Can return NOT_FOUND, INVALID_ARGUMENT, and PERMISSION_DENIED errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Create extends StandardParameters {
        /**
         * Required. The bucket in which to create the view `"projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"` For example:"projects/my-project/locations/global/buckets/my-bucket"
         */
        parent?: string;
        /**
         * Required. A client-assigned identifier such as "my-view". Identifiers are limited to 100 characters and can include only letters, digits, underscores, and hyphens.
         */
        viewId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the view to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Get extends StandardParameters {
        /**
         * Required. The resource name of the policy: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The bucket whose views are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Patch extends StandardParameters {
        /**
         * Required. The full resource name of the view to update "projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]" For example:"projects/my-project/locations/global/buckets/my-bucket/views/my-view"
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in view that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogView;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See Resource names (https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Buckets$Views$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Buckets$Views$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Buckets$Views$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Buckets$Views$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Projects$Locations$Logscopes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Logscopes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Logscopes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        create(params: Params$Resource$Projects$Locations$Logscopes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Logscopes$Create, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(params: Params$Resource$Projects$Locations$Logscopes$Create, callback: BodyResponseCallback<Schema$LogScope>): void;
        create(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Deletes a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Logscopes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Logscopes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Logscopes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Logscopes$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Logscopes$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Logscopes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Logscopes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        get(params: Params$Resource$Projects$Locations$Logscopes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Logscopes$Get, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(params: Params$Resource$Projects$Locations$Logscopes$Get, callback: BodyResponseCallback<Schema$LogScope>): void;
        get(callback: BodyResponseCallback<Schema$LogScope>): void;
        /**
         * Lists log scopes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Logscopes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Logscopes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogScopesResponse>>;
        list(params: Params$Resource$Projects$Locations$Logscopes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Logscopes$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogScopesResponse>, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Logscopes$List, callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogScopesResponse>): void;
        /**
         * Updates a log scope.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Logscopes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Logscopes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogScope>>;
        patch(params: Params$Resource$Projects$Locations$Logscopes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Logscopes$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogScope>, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(params: Params$Resource$Projects$Locations$Logscopes$Patch, callback: BodyResponseCallback<Schema$LogScope>): void;
        patch(callback: BodyResponseCallback<Schema$LogScope>): void;
    }
    export interface Params$Resource$Projects$Locations$Logscopes$Create extends StandardParameters {
        /**
         * Required. A client-assigned identifier such as "log-scope". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.
         */
        logScopeId?: string;
        /**
         * Required. The parent project in which to create the log scope "projects/[PROJECT_ID]/locations/[LOCATION_ID]" For example:"projects/my-project/locations/global"
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
    }
    export interface Params$Resource$Projects$Locations$Logscopes$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log scope to delete: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Logscopes$Get extends StandardParameters {
        /**
         * Required. The resource name of the log scope: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/logScopes/[LOG_SCOPE_ID]" For example:"projects/my-project/locations/global/logScopes/my-log-scope"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Logscopes$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose log scopes are to be listed: "projects/[PROJECT_ID]/locations/[LOCATION_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Logscopes$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the log scope.Log scopes are only available in the global location. For example:projects/my-project/locations/global/logScopes/my-log-scope
         */
        name?: string;
        /**
         * Optional. Field mask that specifies the fields in log_scope that need an update. A field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=description
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogScope;
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
    export class Resource$Projects$Locations$Recentqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the RecentQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Recentqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Recentqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRecentQueriesResponse>>;
        list(params: Params$Resource$Projects$Locations$Recentqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Recentqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListRecentQueriesResponse>, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Recentqueries$List, callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRecentQueriesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Recentqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") of the recent queries to list. The only valid value for this field is one of the two allowable type function calls, which are the following: type("Logging") type("OpsAnalytics")
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example:projects/my-project/locations/us-central1Note: The location portion of the resource must be specified, but supplying the character - in place of LOCATION_ID will return all recent queries.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Savedqueries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new SavedQuery for the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Savedqueries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Savedqueries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        create(params: Params$Resource$Projects$Locations$Savedqueries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Savedqueries$Create, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(params: Params$Resource$Projects$Locations$Savedqueries$Create, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        create(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Deletes an existing SavedQuery that was created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Savedqueries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Savedqueries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Savedqueries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Savedqueries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Savedqueries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns all data associated with the requested query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Savedqueries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Savedqueries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        get(params: Params$Resource$Projects$Locations$Savedqueries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Savedqueries$Get, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(params: Params$Resource$Projects$Locations$Savedqueries$Get, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        get(callback: BodyResponseCallback<Schema$SavedQuery>): void;
        /**
         * Lists the SavedQueries that were created by the user making the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Savedqueries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Savedqueries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSavedQueriesResponse>>;
        list(params: Params$Resource$Projects$Locations$Savedqueries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Savedqueries$List, options: MethodOptions | BodyResponseCallback<Schema$ListSavedQueriesResponse>, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Savedqueries$List, callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSavedQueriesResponse>): void;
        /**
         * Updates an existing SavedQuery.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Savedqueries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Savedqueries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SavedQuery>>;
        patch(params: Params$Resource$Projects$Locations$Savedqueries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Savedqueries$Patch, options: MethodOptions | BodyResponseCallback<Schema$SavedQuery>, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(params: Params$Resource$Projects$Locations$Savedqueries$Patch, callback: BodyResponseCallback<Schema$SavedQuery>): void;
        patch(callback: BodyResponseCallback<Schema$SavedQuery>): void;
    }
    export interface Params$Resource$Projects$Locations$Savedqueries$Create extends StandardParameters {
        /**
         * Required. The parent resource in which to create the saved query: "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/global" "organizations/123456789/locations/us-central1"
         */
        parent?: string;
        /**
         * Optional. The ID to use for the saved query, which will become the final component of the saved query's resource name.If the saved_query_id is not provided, the system will generate an alphanumeric ID.The saved_query_id is limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.
         */
        savedQueryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export interface Params$Resource$Projects$Locations$Savedqueries$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the saved query to delete. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Savedqueries$Get extends StandardParameters {
        /**
         * Required. The resource name of the saved query. "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For example: "projects/my-project/locations/global/savedQueries/my-saved-query"
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Savedqueries$List extends StandardParameters {
        /**
         * Optional. Specifies the type ("Logging" or "OpsAnalytics") and the visibility (PRIVATE or SHARED) of the saved queries to list. If provided, the filter must contain either the type function or a visibility token, or both. If both are chosen, they can be placed in any order, but they must be joined by the AND operator or the empty character.The two supported type function calls are: type("Logging") type("OpsAnalytics")The two supported visibility tokens are: visibility = PRIVATE visibility = SHAREDFor example:type("Logging") AND visibility = PRIVATE visibility=SHARED type("OpsAnalytics") type("OpsAnalytics)" visibility = PRIVATE visibility = SHARED
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request.Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource to which the listed queries belong. "projects/[PROJECT_ID]/locations/[LOCATION_ID]" "organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]" "folders/[FOLDER_ID]/locations/[LOCATION_ID]" For example: "projects/my-project/locations/us-central1" Note: The locations portion of the resource must be specified. To get a list of all saved queries, a wildcard character - can be used for LOCATION_ID, for example: "projects/my-project/locations/-"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Savedqueries$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the saved query.In the format: "projects/[PROJECT_ID]/locations/[LOCATION_ID]/savedQueries/[QUERY_ID]" For a list of supported locations, see Supported Regions (https://cloud.google.com/logging/docs/region-support#bucket-regions)After the saved query is created, the location cannot be changed.If the user doesn't provide a QUERY_ID, the system will generate an alphanumeric ID.
         */
        name?: string;
        /**
         * Required. A non-empty list of fields to change in the existing saved query. Fields are relative to the saved_query and new values for the fields are taken from the corresponding fields in the SavedQuery included in this request. Fields not mentioned in update_mask are not changed and are ignored in the request.To update all mutable fields, specify an update_mask of *.For example, to change the description and query filter text of a saved query, specify an update_mask of "description, query.filter".
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SavedQuery;
    }
    export class Resource$Projects$Logs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes all the log entries in a log for the _Default Log Bucket. The log reappears if it receives new entries. Log entries written shortly before the delete operation might not be deleted. Entries received after the delete operation with a timestamp before the operation will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Logs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Logs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Logs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Logs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Logs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the logs in projects, organizations, folders, or billing accounts. Only logs that have entries are listed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Logs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Logs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogsResponse>>;
        list(params: Params$Resource$Projects$Logs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Logs$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogsResponse>, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(params: Params$Resource$Projects$Logs$List, callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogsResponse>): void;
    }
    export interface Params$Resource$Projects$Logs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the log to delete: projects/[PROJECT_ID]/logs/[LOG_ID] organizations/[ORGANIZATION_ID]/logs/[LOG_ID] billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID] folders/[FOLDER_ID]/logs/[LOG_ID][LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/123/logs/cloudaudit.googleapis.com%2Factivity".For more information about log names, see LogEntry.
         */
        logName?: string;
    }
    export interface Params$Resource$Projects$Logs$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The resource name to list logs for: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]
         */
        parent?: string;
        /**
         * Optional. List of resource names to list logs for: projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] organizations/[ORGANIZATION_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] billingAccounts/[BILLING_ACCOUNT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID] folders/[FOLDER_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]/views/[VIEW_ID]To support legacy queries, it could also be: projects/[PROJECT_ID] organizations/[ORGANIZATION_ID] billingAccounts/[BILLING_ACCOUNT_ID] folders/[FOLDER_ID]The resource name in the parent field is added to this list.
         */
        resourceNames?: string[];
    }
    export class Resource$Projects$Metrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a logs-based metric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Metrics$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Metrics$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogMetric>>;
        create(params: Params$Resource$Projects$Metrics$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Metrics$Create, options: MethodOptions | BodyResponseCallback<Schema$LogMetric>, callback: BodyResponseCallback<Schema$LogMetric>): void;
        create(params: Params$Resource$Projects$Metrics$Create, callback: BodyResponseCallback<Schema$LogMetric>): void;
        create(callback: BodyResponseCallback<Schema$LogMetric>): void;
        /**
         * Deletes a logs-based metric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Metrics$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Metrics$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Metrics$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Metrics$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Metrics$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a logs-based metric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Metrics$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Metrics$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogMetric>>;
        get(params: Params$Resource$Projects$Metrics$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Metrics$Get, options: MethodOptions | BodyResponseCallback<Schema$LogMetric>, callback: BodyResponseCallback<Schema$LogMetric>): void;
        get(params: Params$Resource$Projects$Metrics$Get, callback: BodyResponseCallback<Schema$LogMetric>): void;
        get(callback: BodyResponseCallback<Schema$LogMetric>): void;
        /**
         * Lists logs-based metrics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Metrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Metrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLogMetricsResponse>>;
        list(params: Params$Resource$Projects$Metrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Metrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListLogMetricsResponse>, callback: BodyResponseCallback<Schema$ListLogMetricsResponse>): void;
        list(params: Params$Resource$Projects$Metrics$List, callback: BodyResponseCallback<Schema$ListLogMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLogMetricsResponse>): void;
        /**
         * Creates or updates a logs-based metric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Metrics$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Metrics$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogMetric>>;
        update(params: Params$Resource$Projects$Metrics$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Metrics$Update, options: MethodOptions | BodyResponseCallback<Schema$LogMetric>, callback: BodyResponseCallback<Schema$LogMetric>): void;
        update(params: Params$Resource$Projects$Metrics$Update, callback: BodyResponseCallback<Schema$LogMetric>): void;
        update(callback: BodyResponseCallback<Schema$LogMetric>): void;
    }
    export interface Params$Resource$Projects$Metrics$Create extends StandardParameters {
        /**
         * Required. The resource name of the project in which to create the metric: "projects/[PROJECT_ID]" The new metric must be provided in the request.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogMetric;
    }
    export interface Params$Resource$Projects$Metrics$Delete extends StandardParameters {
        /**
         * Required. The resource name of the metric to delete: "projects/[PROJECT_ID]/metrics/[METRIC_ID]"
         */
        metricName?: string;
    }
    export interface Params$Resource$Projects$Metrics$Get extends StandardParameters {
        /**
         * Required. The resource name of the desired metric: "projects/[PROJECT_ID]/metrics/[METRIC_ID]"
         */
        metricName?: string;
    }
    export interface Params$Resource$Projects$Metrics$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The name of the project containing the metrics: "projects/[PROJECT_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Metrics$Update extends StandardParameters {
        /**
         * Required. The resource name of the metric to update: "projects/[PROJECT_ID]/metrics/[METRIC_ID]" The updated metric must be provided in the request and it's name field must be the same as [METRIC_ID] If the metric does not exist in [PROJECT_ID], then a new metric is created.
         */
        metricName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogMetric;
    }
    export class Resource$Projects$Sinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports specified log entries to a destination. The export begins upon ingress, unless the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Sinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Sinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        create(params: Params$Resource$Projects$Sinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Sinks$Create, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(params: Params$Resource$Projects$Sinks$Create, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Sinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Sinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Sinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Sinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Sinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Sinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Sinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        get(params: Params$Resource$Projects$Sinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Sinks$Get, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(params: Params$Resource$Projects$Sinks$Get, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Lists sinks.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Sinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Sinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSinksResponse>>;
        list(params: Params$Resource$Projects$Sinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Sinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListSinksResponse>, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(params: Params$Resource$Projects$Sinks$List, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Sinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Sinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        patch(params: Params$Resource$Projects$Sinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Sinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(params: Params$Resource$Projects$Sinks$Patch, callback: BodyResponseCallback<Schema$LogSink>): void;
        patch(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Sinks$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Sinks$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        update(params: Params$Resource$Projects$Sinks$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Sinks$Update, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(params: Params$Resource$Projects$Sinks$Update, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(callback: BodyResponseCallback<Schema$LogSink>): void;
    }
    export interface Params$Resource$Projects$Sinks$Create extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Projects$Sinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Projects$Sinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Projects$Sinks$List extends StandardParameters {
        /**
         * Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope("ALL")', 'in_scope("ANCESTOR")', 'in_scope("DEFAULT")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope("DEFAULT")' is applied.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Sinks$Patch extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Projects$Sinks$Update extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export class Resource$Sinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a sink that exports specified log entries to a destination. The export begins upon ingress, unless the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Sinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Sinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        create(params: Params$Resource$Sinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Sinks$Create, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(params: Params$Resource$Sinks$Create, callback: BodyResponseCallback<Schema$LogSink>): void;
        create(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Sinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Sinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Sinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Sinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Sinks$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a sink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Sinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        get(params: Params$Resource$Sinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sinks$Get, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(params: Params$Resource$Sinks$Get, callback: BodyResponseCallback<Schema$LogSink>): void;
        get(callback: BodyResponseCallback<Schema$LogSink>): void;
        /**
         * Lists sinks.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Sinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Sinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSinksResponse>>;
        list(params: Params$Resource$Sinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Sinks$List, options: MethodOptions | BodyResponseCallback<Schema$ListSinksResponse>, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(params: Params$Resource$Sinks$List, callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSinksResponse>): void;
        /**
         * Updates a sink. This method replaces the values of the destination and filter fields of the existing sink with the corresponding values from the new sink.The updated sink might also have a new writer_identity; see the unique_writer_identity field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Sinks$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Sinks$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LogSink>>;
        update(params: Params$Resource$Sinks$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Sinks$Update, options: MethodOptions | BodyResponseCallback<Schema$LogSink>, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(params: Params$Resource$Sinks$Update, callback: BodyResponseCallback<Schema$LogSink>): void;
        update(callback: BodyResponseCallback<Schema$LogSink>): void;
    }
    export interface Params$Resource$Sinks$Create extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]" For examples:"projects/my-project" "organizations/123456789"
         */
        parent?: string;
        /**
         * Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export interface Params$Resource$Sinks$Delete extends StandardParameters {
        /**
         * Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Sinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
    }
    export interface Params$Resource$Sinks$List extends StandardParameters {
        /**
         * Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope("ALL")', 'in_scope("ANCESTOR")', 'in_scope("DEFAULT")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope("DEFAULT")' is applied.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
         */
        pageSize?: number;
        /**
         * Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
         */
        pageToken?: string;
        /**
         * Required. The parent resource whose sinks are to be listed: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]" "folders/[FOLDER_ID]"
         */
        parent?: string;
    }
    export interface Params$Resource$Sinks$Update extends StandardParameters {
        /**
         * Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.
         */
        customWriterIdentity?: string;
        /**
         * Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" "billingAccounts/[BILLING_ACCOUNT_ID]/sinks/[SINK_ID]" "folders/[FOLDER_ID]/sinks/[SINK_ID]" For example:"projects/my-project/sinks/my-sink"
         */
        sinkName?: string;
        /**
         * Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value is false and the new value is true, then writer_identity is changed to a service agent (https://cloud.google.com/iam/docs/service-account-types#service-agents) owned by Cloud Logging. It is an error if the old value is true and the new value is set to false or defaulted to false.
         */
        uniqueWriterIdentity?: boolean;
        /**
         * Optional. Field mask that specifies the fields in sink that need an update. A sink field will be overwritten if, and only if, it is in the update mask. name and output only fields cannot be updated.An empty updateMask is temporarily treated as using the following mask for backwards compatibility purposes:destination,filter,includeChildrenAt some point in the future, behavior will be removed and specifying an empty updateMask will be an error.For a detailed FieldMask definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.FieldMaskFor example: updateMask=filter
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LogSink;
    }
    export class Resource$V2 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the Logging CMEK settings for the given resource.Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getCmekSettings(params: Params$Resource$V2$Getcmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCmekSettings(params?: Params$Resource$V2$Getcmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        getCmekSettings(params: Params$Resource$V2$Getcmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCmekSettings(params: Params$Resource$V2$Getcmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(params: Params$Resource$V2$Getcmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        getCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Gets the settings for the given resource.Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.See View default resource settings for Logging (https://cloud.google.com/logging/docs/default-settings#view-org-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSettings(params: Params$Resource$V2$Getsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSettings(params?: Params$Resource$V2$Getsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        getSettings(params: Params$Resource$V2$Getsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSettings(params: Params$Resource$V2$Getsettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(params: Params$Resource$V2$Getsettings, callback: BodyResponseCallback<Schema$Settings>): void;
        getSettings(callback: BodyResponseCallback<Schema$Settings>): void;
        /**
         * Updates the Log Router CMEK settings for the given resource.Note: CMEK for the Log Router can currently only be configured for Google Cloud organizations. Once configured, it applies to all projects and folders in the Google Cloud organization.UpdateCmekSettings fails when any of the following are true: The value of kms_key_name is invalid. The associated service account doesn't have the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key. Access to the key is disabled.See Enabling CMEK for Log Router (https://cloud.google.com/logging/docs/routing/managed-encryption) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateCmekSettings(params: Params$Resource$V2$Updatecmeksettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateCmekSettings(params?: Params$Resource$V2$Updatecmeksettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CmekSettings>>;
        updateCmekSettings(params: Params$Resource$V2$Updatecmeksettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateCmekSettings(params: Params$Resource$V2$Updatecmeksettings, options: MethodOptions | BodyResponseCallback<Schema$CmekSettings>, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        updateCmekSettings(params: Params$Resource$V2$Updatecmeksettings, callback: BodyResponseCallback<Schema$CmekSettings>): void;
        updateCmekSettings(callback: BodyResponseCallback<Schema$CmekSettings>): void;
        /**
         * Updates the settings for the given resource. This method applies to all feature configurations for organization and folders.UpdateSettings fails when any of the following are true: The value of storage_location either isn't supported by Logging or violates the location OrgPolicy. The default_sink_config field is set, but it has an unspecified filter write mode. The value of kms_key_name is invalid. The associated service account doesn't have the required roles/cloudkms.cryptoKeyEncrypterDecrypter role assigned for the key. Access to the key is disabled.See Configure default settings for organizations and folders (https://cloud.google.com/logging/docs/default-settings) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateSettings(params: Params$Resource$V2$Updatesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSettings(params?: Params$Resource$V2$Updatesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Settings>>;
        updateSettings(params: Params$Resource$V2$Updatesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSettings(params: Params$Resource$V2$Updatesettings, options: MethodOptions | BodyResponseCallback<Schema$Settings>, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(params: Params$Resource$V2$Updatesettings, callback: BodyResponseCallback<Schema$Settings>): void;
        updateSettings(callback: BodyResponseCallback<Schema$Settings>): void;
    }
    export interface Params$Resource$V2$Getcmeksettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve CMEK settings. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can be configured for Google Cloud projects, folders, organizations, and billing accounts. Once configured for an organization, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
    }
    export interface Params$Resource$V2$Getsettings extends StandardParameters {
        /**
         * Required. The resource for which to retrieve settings. "projects/[PROJECT_ID]/settings" "organizations/[ORGANIZATION_ID]/settings" "billingAccounts/[BILLING_ACCOUNT_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"Note: Settings can be retrieved for Google Cloud projects, folders, organizations, and billing accounts.
         */
        name?: string;
    }
    export interface Params$Resource$V2$Updatecmeksettings extends StandardParameters {
        /**
         * Required. The resource name for the CMEK settings to update. "projects/[PROJECT_ID]/cmekSettings" "organizations/[ORGANIZATION_ID]/cmekSettings" "billingAccounts/[BILLING_ACCOUNT_ID]/cmekSettings" "folders/[FOLDER_ID]/cmekSettings" For example:"organizations/12345/cmekSettings"Note: CMEK for the Log Router can currently only be configured for Google Cloud organizations. Once configured, it applies to all projects and folders in the Google Cloud organization.
         */
        name?: string;
        /**
         * Optional. Field mask identifying which fields from cmek_settings should be updated. A field will be overwritten if and only if it is in the update mask. Output only fields cannot be updated.See FieldMask for more information.For example: "updateMask=kmsKeyName"
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CmekSettings;
    }
    export interface Params$Resource$V2$Updatesettings extends StandardParameters {
        /**
         * Required. The resource name for the settings to update. "organizations/[ORGANIZATION_ID]/settings" "folders/[FOLDER_ID]/settings" For example:"organizations/12345/settings"
         */
        name?: string;
        /**
         * Optional. Field mask identifying which fields from settings should be updated. A field will be overwritten if and only if it is in the update mask. Output only fields cannot be updated.See FieldMask for more information.For example: "updateMask=kmsKeyName"
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Settings;
    }
    export {};
}
