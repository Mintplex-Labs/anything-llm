import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace datacatalog_v1beta1 {
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
     * Google Cloud Data Catalog API
     *
     * A fully managed and highly scalable data discovery and metadata management service.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const datacatalog = google.datacatalog('v1beta1');
     * ```
     */
    export class Datacatalog {
        context: APIRequestContext;
        catalog: Resource$Catalog;
        entries: Resource$Entries;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
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
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
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
     * Request message for `GetIamPolicy` method.
     */
    export interface Schema$GetIamPolicyRequest {
        /**
         * OPTIONAL: A `GetPolicyOptions` object for specifying options to `GetIamPolicy`.
         */
        options?: Schema$GetPolicyOptions;
    }
    /**
     * Encapsulates settings provided to GetIamPolicy.
     */
    export interface Schema$GetPolicyOptions {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        requestedPolicyVersion?: number | null;
    }
    /**
     * Spec for a group of BigQuery tables with name pattern `[prefix]YYYYMMDD`. Context: https://cloud.google.com/bigquery/docs/partitioned-tables#partitioning_versus_sharding
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1BigQueryDateShardedSpec {
        /**
         * Output only. The Data Catalog resource name of the dataset entry the current table belongs to, for example, `projects/{project_id\}/locations/{location\}/entrygroups/{entry_group_id\}/entries/{entry_id\}`.
         */
        dataset?: string | null;
        /**
         * Output only. Total number of shards.
         */
        shardCount?: string | null;
        /**
         * Output only. The table name prefix of the shards. The name of any given shard is `[table_prefix]YYYYMMDD`, for example, for shard `MyTable20180101`, the `table_prefix` is `MyTable`.
         */
        tablePrefix?: string | null;
    }
    /**
     * Describes a BigQuery table.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1BigQueryTableSpec {
        /**
         * Output only. The table source type.
         */
        tableSourceType?: string | null;
        /**
         * Spec of a BigQuery table. This field should only be populated if `table_source_type` is `BIGQUERY_TABLE`.
         */
        tableSpec?: Schema$GoogleCloudDatacatalogV1beta1TableSpec;
        /**
         * Table view specification. This field should only be populated if `table_source_type` is `BIGQUERY_VIEW`.
         */
        viewSpec?: Schema$GoogleCloudDatacatalogV1beta1ViewSpec;
    }
    /**
     * Representation of a column within a schema. Columns could be nested inside other columns.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ColumnSchema {
        /**
         * Required. Name of the column.
         */
        column?: string | null;
        /**
         * Optional. Description of the column. Default value is an empty string.
         */
        description?: string | null;
        /**
         * Optional. A column's mode indicates whether the values in this column are required, nullable, etc. Only `NULLABLE`, `REQUIRED` and `REPEATED` are supported. Default mode is `NULLABLE`.
         */
        mode?: string | null;
        /**
         * Optional. Schema of sub-columns. A column can have zero or more sub-columns.
         */
        subcolumns?: Schema$GoogleCloudDatacatalogV1beta1ColumnSchema[];
        /**
         * Required. Type of the column.
         */
        type?: string | null;
    }
    /**
     * Entry Metadata. A Data Catalog Entry resource represents another resource in Google Cloud Platform (such as a BigQuery dataset or a Pub/Sub topic), or outside of Google Cloud Platform. Clients can use the `linked_resource` field in the Entry resource to refer to the original resource ID of the source system. An Entry resource contains resource details, such as its schema. An Entry can also be used to attach flexible metadata, such as a Tag.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1Entry {
        /**
         * Specification for a group of BigQuery tables with name pattern `[prefix]YYYYMMDD`. Context: https://cloud.google.com/bigquery/docs/partitioned-tables#partitioning_versus_sharding.
         */
        bigqueryDateShardedSpec?: Schema$GoogleCloudDatacatalogV1beta1BigQueryDateShardedSpec;
        /**
         * Specification that applies to a BigQuery table. This is only valid on entries of type `TABLE`.
         */
        bigqueryTableSpec?: Schema$GoogleCloudDatacatalogV1beta1BigQueryTableSpec;
        /**
         * Entry description, which can consist of several sentences or paragraphs that describe entry contents. Default value is an empty string.
         */
        description?: string | null;
        /**
         * Display information such as title and description. A short name to identify the entry, for example, "Analytics Data - Jan 2011". Default value is an empty string.
         */
        displayName?: string | null;
        /**
         * Specification that applies to a Cloud Storage fileset. This is only valid on entries of type FILESET.
         */
        gcsFilesetSpec?: Schema$GoogleCloudDatacatalogV1beta1GcsFilesetSpec;
        /**
         * Output only. This field indicates the entry's source system that Data Catalog integrates with, such as BigQuery or Pub/Sub.
         */
        integratedSystem?: string | null;
        /**
         * The resource this metadata entry refers to. For Google Cloud Platform resources, `linked_resource` is the [full name of the resource](https://cloud.google.com/apis/design/resource_names#full_resource_name). For example, the `linked_resource` for a table resource from BigQuery is: * //bigquery.googleapis.com/projects/projectId/datasets/datasetId/tables/tableId Output only when Entry is of type in the EntryType enum. For entries with user_specified_type, this field is optional and defaults to an empty string.
         */
        linkedResource?: string | null;
        /**
         * Output only. Identifier. The Data Catalog resource name of the entry in URL format. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\} Note that this Entry and its child resources may not actually be stored in the location in this name.
         */
        name?: string | null;
        /**
         * Schema of the entry. An entry might not have any schema attached to it.
         */
        schema?: Schema$GoogleCloudDatacatalogV1beta1Schema;
        /**
         * Output only. Timestamps about the underlying resource, not about this Data Catalog entry. Output only when Entry is of type in the EntryType enum. For entries with user_specified_type, this field is optional and defaults to an empty timestamp.
         */
        sourceSystemTimestamps?: Schema$GoogleCloudDatacatalogV1beta1SystemTimestamps;
        /**
         * The type of the entry. Only used for Entries with types in the EntryType enum.
         */
        type?: string | null;
        /**
         * Output only. Statistics on the usage level of the resource.
         */
        usageSignal?: Schema$GoogleCloudDatacatalogV1beta1UsageSignal;
        /**
         * This field indicates the entry's source system that Data Catalog does not integrate with. `user_specified_system` strings must begin with a letter or underscore and can only contain letters, numbers, and underscores; are case insensitive; must be at least 1 character and at most 64 characters long.
         */
        userSpecifiedSystem?: string | null;
        /**
         * Entry type if it does not fit any of the input-allowed values listed in `EntryType` enum above. When creating an entry, users should check the enum values first, if nothing matches the entry to be created, then provide a custom value, for example "my_special_type". `user_specified_type` strings must begin with a letter or underscore and can only contain letters, numbers, and underscores; are case insensitive; must be at least 1 character and at most 64 characters long. Currently, only FILESET enum value is allowed. All other entries created through Data Catalog must use `user_specified_type`.
         */
        userSpecifiedType?: string | null;
    }
    /**
     * EntryGroup Metadata. An EntryGroup resource represents a logical grouping of zero or more Data Catalog Entry resources.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1EntryGroup {
        /**
         * Output only. Timestamps about this EntryGroup. Default value is empty timestamps.
         */
        dataCatalogTimestamps?: Schema$GoogleCloudDatacatalogV1beta1SystemTimestamps;
        /**
         * Entry group description, which can consist of several sentences or paragraphs that describe entry group contents. Default value is an empty string.
         */
        description?: string | null;
        /**
         * A short name to identify the entry group, for example, "analytics data - jan 2011". Default value is an empty string.
         */
        displayName?: string | null;
        /**
         * Identifier. The resource name of the entry group in URL format. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\} Note that this EntryGroup and its child resources may not actually be stored in the location in this name.
         */
        name?: string | null;
    }
    /**
     * Response message for ExportTaxonomies.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse {
        /**
         * List of taxonomies and policy tags in a tree structure.
         */
        taxonomies?: Schema$GoogleCloudDatacatalogV1beta1SerializedTaxonomy[];
    }
    export interface Schema$GoogleCloudDatacatalogV1beta1FieldType {
        /**
         * Represents an enum type.
         */
        enumType?: Schema$GoogleCloudDatacatalogV1beta1FieldTypeEnumType;
        /**
         * Represents primitive types - string, bool etc.
         */
        primitiveType?: string | null;
    }
    export interface Schema$GoogleCloudDatacatalogV1beta1FieldTypeEnumType {
        allowedValues?: Schema$GoogleCloudDatacatalogV1beta1FieldTypeEnumTypeEnumValue[];
    }
    export interface Schema$GoogleCloudDatacatalogV1beta1FieldTypeEnumTypeEnumValue {
        /**
         * Required. The display name of the enum value. Must not be an empty string.
         */
        displayName?: string | null;
    }
    /**
     * Describes a Cloud Storage fileset entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1GcsFilesetSpec {
        /**
         * Required. Patterns to identify a set of files in Google Cloud Storage. See [Cloud Storage documentation](https://cloud.google.com/storage/docs/wildcards) for more information. Note that bucket wildcards are currently not supported. Examples of valid file_patterns: * `gs://bucket_name/dir/x`: matches all files within `bucket_name/dir` directory. * `gs://bucket_name/dir/x*`: matches all files in `bucket_name/dir` spanning all subdirectories. * `gs://bucket_name/file*`: matches files prefixed by `file` in `bucket_name` * `gs://bucket_name/??.txt`: matches files with two characters followed by `.txt` in `bucket_name` * `gs://bucket_name/[aeiou].txt`: matches files that contain a single vowel character followed by `.txt` in `bucket_name` * `gs://bucket_name/[a-m].txt`: matches files that contain `a`, `b`, ... or `m` followed by `.txt` in `bucket_name` * `gs://bucket_name/a/x/b`: matches all files in `bucket_name` that match `a/x/b` pattern, such as `a/c/b`, `a/d/b` * `gs://another_bucket/a.txt`: matches `gs://another_bucket/a.txt` You can combine wildcards to provide more powerful matches, for example: * `gs://bucket_name/[a-m]??.j*g`
         */
        filePatterns?: string[] | null;
        /**
         * Output only. Sample files contained in this fileset, not all files contained in this fileset are represented here.
         */
        sampleGcsFileSpecs?: Schema$GoogleCloudDatacatalogV1beta1GcsFileSpec[];
    }
    /**
     * Specifications of a single file in Cloud Storage.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1GcsFileSpec {
        /**
         * Required. The full file path. Example: `gs://bucket_name/a/b.txt`.
         */
        filePath?: string | null;
        /**
         * Output only. Timestamps about the Cloud Storage file.
         */
        gcsTimestamps?: Schema$GoogleCloudDatacatalogV1beta1SystemTimestamps;
        /**
         * Output only. The size of the file, in bytes.
         */
        sizeBytes?: string | null;
    }
    /**
     * Request message for ImportTaxonomies.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesRequest {
        /**
         * Inline source used for taxonomies to be imported.
         */
        inlineSource?: Schema$GoogleCloudDatacatalogV1beta1InlineSource;
    }
    /**
     * Response message for ImportTaxonomies.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse {
        /**
         * Taxonomies that were imported.
         */
        taxonomies?: Schema$GoogleCloudDatacatalogV1beta1Taxonomy[];
    }
    /**
     * Inline source used for taxonomies import.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1InlineSource {
        /**
         * Required. Taxonomies to be imported.
         */
        taxonomies?: Schema$GoogleCloudDatacatalogV1beta1SerializedTaxonomy[];
    }
    /**
     * Response message for ListEntries.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse {
        /**
         * Entry details.
         */
        entries?: Schema$GoogleCloudDatacatalogV1beta1Entry[];
        /**
         * Token to retrieve the next page of results. It is set to empty if no items remain in results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListEntryGroups.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse {
        /**
         * EntryGroup details.
         */
        entryGroups?: Schema$GoogleCloudDatacatalogV1beta1EntryGroup[];
        /**
         * Token to retrieve the next page of results. It is set to empty if no items remain in results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListPolicyTags.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse {
        /**
         * Token used to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The policy tags that are in the requested taxonomy.
         */
        policyTags?: Schema$GoogleCloudDatacatalogV1beta1PolicyTag[];
    }
    /**
     * Response message for ListTags.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse {
        /**
         * Token to retrieve the next page of results. It is set to empty if no items remain in results.
         */
        nextPageToken?: string | null;
        /**
         * Tag details.
         */
        tags?: Schema$GoogleCloudDatacatalogV1beta1Tag[];
    }
    /**
     * Response message for ListTaxonomies.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse {
        /**
         * Token used to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * Taxonomies that the project contains.
         */
        taxonomies?: Schema$GoogleCloudDatacatalogV1beta1Taxonomy[];
    }
    /**
     * Denotes one policy tag in a taxonomy (e.g. ssn). Policy Tags can be defined in a hierarchy. For example, consider the following hierarchy: Geolocation -\> (LatLong, City, ZipCode). PolicyTag "Geolocation" contains three child policy tags: "LatLong", "City", and "ZipCode".
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1PolicyTag {
        /**
         * Output only. Resource names of child policy tags of this policy tag.
         */
        childPolicyTags?: string[] | null;
        /**
         * Description of this policy tag. It must: contain only unicode characters, tabs, newlines, carriage returns and page breaks; and be at most 2000 bytes long when encoded in UTF-8. If not set, defaults to an empty description. If not set, defaults to an empty description.
         */
        description?: string | null;
        /**
         * Required. User defined name of this policy tag. It must: be unique within the parent taxonomy; contain only unicode letters, numbers, underscores, dashes and spaces; not start or end with spaces; and be at most 200 bytes long when encoded in UTF-8.
         */
        displayName?: string | null;
        /**
         * Identifier. Resource name of this policy tag, whose format is: "projects/{project_number\}/locations/{location_id\}/taxonomies/{taxonomy_id\}/policyTags/{id\}".
         */
        name?: string | null;
        /**
         * Resource name of this policy tag's parent policy tag (e.g. for the "LatLong" policy tag in the example above, this field contains the resource name of the "Geolocation" policy tag). If empty, it means this policy tag is a top level policy tag (e.g. this field is empty for the "Geolocation" policy tag in the example above). If not set, defaults to an empty string.
         */
        parentPolicyTag?: string | null;
    }
    /**
     * Request message for RenameTagTemplateFieldEnumValue.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1RenameTagTemplateFieldEnumValueRequest {
        /**
         * Required. The new display name of the enum value. For example, `my_new_enum_value`.
         */
        newEnumValueDisplayName?: string | null;
    }
    /**
     * Request message for RenameTagTemplateField.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1RenameTagTemplateFieldRequest {
        /**
         * Required. The new ID of this tag template field. For example, `my_new_field`.
         */
        newTagTemplateFieldId?: string | null;
    }
    /**
     * Represents a schema (e.g. BigQuery, GoogleSQL, Avro schema).
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1Schema {
        /**
         * Required. Schema of columns. A maximum of 10,000 columns and sub-columns can be specified.
         */
        columns?: Schema$GoogleCloudDatacatalogV1beta1ColumnSchema[];
    }
    /**
     * Request message for SearchCatalog.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SearchCatalogRequest {
        /**
         * Specifies the ordering of results, currently supported case-sensitive choices are: * `relevance`, only supports descending * `last_modified_timestamp [asc|desc]`, defaults to descending if not specified * `default` that can only be descending If not specified, defaults to `relevance` descending.
         */
        orderBy?: string | null;
        /**
         * Number of results in the search page. If <=0 then defaults to 10. Max limit for page_size is 1000. Throws an invalid argument for page_size \> 1000.
         */
        pageSize?: number | null;
        /**
         * Optional. Pagination token returned in an earlier SearchCatalogResponse.next_page_token, which indicates that this is a continuation of a prior SearchCatalogRequest call, and that the system should return the next page of data. If empty, the first page is returned.
         */
        pageToken?: string | null;
        /**
         * Optional. The query string in search query syntax. An empty query string will result in all data assets (in the specified scope) that the user has access to. Query strings can be simple as "x" or more qualified as: * name:x * column:x * description:y Note: Query tokens need to have a minimum of 3 characters for substring matching to work correctly. See [Data Catalog Search Syntax](https://cloud.google.com/data-catalog/docs/how-to/search-reference) for more information.
         */
        query?: string | null;
        /**
         * Required. The scope of this search request. A `scope` that has empty `include_org_ids`, `include_project_ids` AND false `include_gcp_public_datasets` is considered invalid. Data Catalog will return an error in such a case.
         */
        scope?: Schema$GoogleCloudDatacatalogV1beta1SearchCatalogRequestScope;
    }
    /**
     * The criteria that select the subspace used for query matching.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SearchCatalogRequestScope {
        /**
         * If `true`, include Google Cloud public datasets in the search results. Info on Google Cloud public datasets is available at https://cloud.google.com/public-datasets/. By default, Google Cloud public datasets are excluded.
         */
        includeGcpPublicDatasets?: boolean | null;
        /**
         * The list of organization IDs to search within. To find your organization ID, follow instructions in https://cloud.google.com/resource-manager/docs/creating-managing-organization.
         */
        includeOrgIds?: string[] | null;
        /**
         * The list of project IDs to search within. To learn more about the distinction between project names/IDs/numbers, go to https://cloud.google.com/docs/overview/#projects.
         */
        includeProjectIds?: string[] | null;
        /**
         * Optional. The list of locations to search within. 1. If empty, search will be performed in all locations; 2. If any of the locations are NOT in the valid locations list, error will be returned; 3. Otherwise, search only the given locations for matching results. Typical usage is to leave this field empty. When a location is unreachable as returned in the `SearchCatalogResponse.unreachable` field, users can repeat the search request with this parameter set to get additional information on the error. Valid locations: * asia-east1 * asia-east2 * asia-northeast1 * asia-northeast2 * asia-northeast3 * asia-south1 * asia-southeast1 * australia-southeast1 * eu * europe-north1 * europe-west1 * europe-west2 * europe-west3 * europe-west4 * europe-west6 * global * northamerica-northeast1 * southamerica-east1 * us * us-central1 * us-east1 * us-east4 * us-west1 * us-west2
         */
        restrictedLocations?: string[] | null;
    }
    /**
     * Response message for SearchCatalog.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse {
        /**
         * The token that can be used to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * Search results.
         */
        results?: Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResult[];
        /**
         * The approximate total number of entries matched by the query.
         */
        totalSize?: number | null;
        /**
         * Unreachable locations. Search result does not include data from those locations. Users can get additional information on the error by repeating the search request with a more restrictive parameter -- setting the value for `SearchDataCatalogRequest.scope.restricted_locations`.
         */
        unreachable?: string[] | null;
    }
    /**
     * A result that appears in the response of a search request. Each result captures details of one entry that matches the search.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResult {
        /**
         * The full name of the cloud resource the entry belongs to. See: https://cloud.google.com/apis/design/resource_names#full_resource_name. Example: * `//bigquery.googleapis.com/projects/projectId/datasets/datasetId/tables/tableId`
         */
        linkedResource?: string | null;
        /**
         * Last-modified timestamp of the entry from the managing system.
         */
        modifyTime?: string | null;
        /**
         * The relative resource name of the resource in URL format. Examples: * `projects/{project_id\}/locations/{location_id\}/entryGroups/{entry_group_id\}/entries/{entry_id\}` * `projects/{project_id\}/tagTemplates/{tag_template_id\}`
         */
        relativeResourceName?: string | null;
        /**
         * Sub-type of the search result. This is a dot-delimited description of the resource's full type, and is the same as the value callers would provide in the "type" search facet. Examples: `entry.table`, `entry.dataStream`, `tagTemplate`.
         */
        searchResultSubtype?: string | null;
        /**
         * Type of the search result. This field can be used to determine which Get method to call to fetch the full resource.
         */
        searchResultType?: string | null;
    }
    /**
     * Message representing one policy tag when exported as a nested proto.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SerializedPolicyTag {
        /**
         * Children of the policy tag if any.
         */
        childPolicyTags?: Schema$GoogleCloudDatacatalogV1beta1SerializedPolicyTag[];
        /**
         * Description of the serialized policy tag. The length of the description is limited to 2000 bytes when encoded in UTF-8. If not set, defaults to an empty description.
         */
        description?: string | null;
        /**
         * Required. Display name of the policy tag. Max 200 bytes when encoded in UTF-8.
         */
        displayName?: string | null;
        /**
         * Resource name of the policy tag. This field will be ignored when calling ImportTaxonomies.
         */
        policyTag?: string | null;
    }
    /**
     * Message capturing a taxonomy and its policy tag hierarchy as a nested proto. Used for taxonomy import/export and mutation.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SerializedTaxonomy {
        /**
         * A list of policy types that are activated for a taxonomy.
         */
        activatedPolicyTypes?: string[] | null;
        /**
         * Description of the serialized taxonomy. The length of the description is limited to 2000 bytes when encoded in UTF-8. If not set, defaults to an empty description.
         */
        description?: string | null;
        /**
         * Required. Display name of the taxonomy. Max 200 bytes when encoded in UTF-8.
         */
        displayName?: string | null;
        /**
         * Top level policy tags associated with the taxonomy if any.
         */
        policyTags?: Schema$GoogleCloudDatacatalogV1beta1SerializedPolicyTag[];
    }
    /**
     * Timestamps about this resource according to a particular system.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1SystemTimestamps {
        /**
         * The creation time of the resource within the given system.
         */
        createTime?: string | null;
        /**
         * Output only. The expiration time of the resource within the given system. Currently only apllicable to BigQuery resources.
         */
        expireTime?: string | null;
        /**
         * The last-modified time of the resource within the given system.
         */
        updateTime?: string | null;
    }
    /**
     * Normal BigQuery table spec.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TableSpec {
        /**
         * Output only. If the table is a dated shard, i.e., with name pattern `[prefix]YYYYMMDD`, `grouped_entry` is the Data Catalog resource name of the date sharded grouped entry, for example, `projects/{project_id\}/locations/{location\}/entrygroups/{entry_group_id\}/entries/{entry_id\}`. Otherwise, `grouped_entry` is empty.
         */
        groupedEntry?: string | null;
    }
    /**
     * Tags are used to attach custom metadata to Data Catalog resources. Tags conform to the specifications within their tag template. See [Data Catalog IAM](https://cloud.google.com/data-catalog/docs/concepts/iam) for information on the permissions needed to create or view tags.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1Tag {
        /**
         * Resources like Entry can have schemas associated with them. This scope allows users to attach tags to an individual column based on that schema. For attaching a tag to a nested column, use `.` to separate the column names. Example: * `outer_column.inner_column`
         */
        column?: string | null;
        /**
         * Required. This maps the ID of a tag field to the value of and additional information about that field. Valid field IDs are defined by the tag's template. A tag must have at least 1 field and at most 500 fields.
         */
        fields?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1beta1TagField;
        } | null;
        /**
         * Identifier. The resource name of the tag in URL format. Example: * projects/{project_id\}/locations/{location\}/entrygroups/{entry_group_id\}/entries/{entry_id\}/tags/{tag_id\} where `tag_id` is a system-generated identifier. Note that this Tag may not actually be stored in the location in this name.
         */
        name?: string | null;
        /**
         * Required. The resource name of the tag template that this tag uses. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\} This field cannot be modified after creation.
         */
        template?: string | null;
        /**
         * Output only. The display name of the tag template.
         */
        templateDisplayName?: string | null;
    }
    /**
     * Contains the value and supporting information for a field within a Tag.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TagField {
        /**
         * Holds the value for a tag field with boolean type.
         */
        boolValue?: boolean | null;
        /**
         * Output only. The display name of this field.
         */
        displayName?: string | null;
        /**
         * Holds the value for a tag field with double type.
         */
        doubleValue?: number | null;
        /**
         * Holds the value for a tag field with enum type. This value must be one of the allowed values in the definition of this enum.
         */
        enumValue?: Schema$GoogleCloudDatacatalogV1beta1TagFieldEnumValue;
        /**
         * Output only. The order of this field with respect to other fields in this tag. It can be set in Tag. For example, a higher value can indicate a more important field. The value can be negative. Multiple fields can have the same order, and field orders within a tag do not have to be sequential.
         */
        order?: number | null;
        /**
         * Holds the value for a tag field with string type.
         */
        stringValue?: string | null;
        /**
         * Holds the value for a tag field with timestamp type.
         */
        timestampValue?: string | null;
    }
    /**
     * Holds an enum value.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TagFieldEnumValue {
        /**
         * The display name of the enum value.
         */
        displayName?: string | null;
    }
    /**
     * A tag template defines a tag, which can have one or more typed fields. The template is used to create and attach the tag to Google Cloud resources. [Tag template roles](https://cloud.google.com/iam/docs/understanding-roles#data-catalog-roles) provide permissions to create, edit, and use the template. See, for example, the [TagTemplate User](https://cloud.google.com/data-catalog/docs/how-to/template-user) role, which includes permission to use the tag template to tag resources.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TagTemplate {
        /**
         * Output only. Transfer status of the TagTemplate
         */
        dataplexTransferStatus?: string | null;
        /**
         * The display name for this template. Defaults to an empty string.
         */
        displayName?: string | null;
        /**
         * Required. Map of tag template field IDs to the settings for the field. This map is an exhaustive list of the allowed fields. This map must contain at least one field and at most 500 fields. The keys to this map are tag template field IDs. Field IDs can contain letters (both uppercase and lowercase), numbers (0-9) and underscores (_). Field IDs must be at least 1 character long and at most 64 characters long. Field IDs must start with a letter or underscore.
         */
        fields?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1beta1TagTemplateField;
        } | null;
        /**
         * Identifier. The resource name of the tag template in URL format. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\} Note that this TagTemplate and its child resources may not actually be stored in the location in this name.
         */
        name?: string | null;
    }
    /**
     * The template for an individual field within a tag template.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TagTemplateField {
        /**
         * The description for this field. Defaults to an empty string.
         */
        description?: string | null;
        /**
         * The display name for this field. Defaults to an empty string.
         */
        displayName?: string | null;
        /**
         * Whether this is a required field. Defaults to false.
         */
        isRequired?: boolean | null;
        /**
         * Output only. Identifier. The resource name of the tag template field in URL format. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template\}/fields/{field\} Note that this TagTemplateField may not actually be stored in the location in this name.
         */
        name?: string | null;
        /**
         * The order of this field with respect to other fields in this tag template. A higher value indicates a more important field. The value can be negative. Multiple fields can have the same order, and field orders within a tag do not have to be sequential.
         */
        order?: number | null;
        /**
         * Required. The type of value this tag field can contain.
         */
        type?: Schema$GoogleCloudDatacatalogV1beta1FieldType;
    }
    /**
     * A taxonomy is a collection of policy tags that classify data along a common axis. For instance a data *sensitivity* taxonomy could contain policy tags denoting PII such as age, zipcode, and SSN. A data *origin* taxonomy could contain policy tags to distinguish user data, employee data, partner data, public data.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1Taxonomy {
        /**
         * Optional. A list of policy types that are activated for this taxonomy. If not set, defaults to an empty list.
         */
        activatedPolicyTypes?: string[] | null;
        /**
         * Optional. Description of this taxonomy. It must: contain only unicode characters, tabs, newlines, carriage returns and page breaks; and be at most 2000 bytes long when encoded in UTF-8. If not set, defaults to an empty description.
         */
        description?: string | null;
        /**
         * Required. User defined name of this taxonomy. It must: contain only unicode letters, numbers, underscores, dashes and spaces; not start or end with spaces; and be at most 200 bytes long when encoded in UTF-8. The taxonomy display name must be unique within an organization.
         */
        displayName?: string | null;
        /**
         * Identifier. Resource name of this taxonomy, whose format is: "projects/{project_number\}/locations/{location_id\}/taxonomies/{id\}".
         */
        name?: string | null;
        /**
         * Output only. Number of policy tags contained in this taxonomy.
         */
        policyTagCount?: number | null;
        /**
         * Output only. Identity of the service which owns the Taxonomy. This field is only populated when the taxonomy is created by a Google Cloud service. Currently only 'DATAPLEX' is supported.
         */
        service?: Schema$GoogleCloudDatacatalogV1beta1TaxonomyService;
        /**
         * Output only. Timestamps about this taxonomy. Only create_time and update_time are used.
         */
        taxonomyTimestamps?: Schema$GoogleCloudDatacatalogV1beta1SystemTimestamps;
    }
    /**
     * The source system of the Taxonomy.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1TaxonomyService {
        /**
         * The service agent for the service.
         */
        identity?: string | null;
        /**
         * The Google Cloud service name.
         */
        name?: string | null;
    }
    /**
     * The set of all usage signals that we store in Data Catalog.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1UsageSignal {
        /**
         * The timestamp of the end of the usage statistics duration.
         */
        updateTime?: string | null;
        /**
         * Usage statistics over each of the pre-defined time ranges, supported strings for time ranges are {"24H", "7D", "30D"\}.
         */
        usageWithinTimeRange?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1beta1UsageStats;
        } | null;
    }
    /**
     * Detailed counts on the entry's usage. Caveats: - Only BigQuery tables have usage stats - The usage stats only include BigQuery query jobs - The usage stats might be underestimated, e.g. wildcard table references are not yet counted in usage computation https://cloud.google.com/bigquery/docs/querying-wildcard-tables
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1UsageStats {
        /**
         * The number of times that the underlying entry was attempted to be used but was cancelled by the user.
         */
        totalCancellations?: number | null;
        /**
         * The number of times that the underlying entry was successfully used.
         */
        totalCompletions?: number | null;
        /**
         * Total time spent (in milliseconds) during uses the resulted in completions.
         */
        totalExecutionTimeForCompletionsMillis?: number | null;
        /**
         * The number of times that the underlying entry was attempted to be used but failed.
         */
        totalFailures?: number | null;
    }
    /**
     * Table view specification.
     */
    export interface Schema$GoogleCloudDatacatalogV1beta1ViewSpec {
        /**
         * Output only. The query that defines the table view.
         */
        viewQuery?: string | null;
    }
    /**
     * Specification for the BigQuery connection.
     */
    export interface Schema$GoogleCloudDatacatalogV1BigQueryConnectionSpec {
        /**
         * Specification for the BigQuery connection to a Cloud SQL instance.
         */
        cloudSql?: Schema$GoogleCloudDatacatalogV1CloudSqlBigQueryConnectionSpec;
        /**
         * The type of the BigQuery connection.
         */
        connectionType?: string | null;
        /**
         * True if there are credentials attached to the BigQuery connection; false otherwise.
         */
        hasCredential?: boolean | null;
    }
    /**
     * Specification for a group of BigQuery tables with the `[prefix]YYYYMMDD` name pattern. For more information, see [Introduction to partitioned tables] (https://cloud.google.com/bigquery/docs/partitioned-tables#partitioning_versus_sharding).
     */
    export interface Schema$GoogleCloudDatacatalogV1BigQueryDateShardedSpec {
        /**
         * Output only. The Data Catalog resource name of the dataset entry the current table belongs to. For example: `projects/{PROJECT_ID\}/locations/{LOCATION\}/entrygroups/{ENTRY_GROUP_ID\}/entries/{ENTRY_ID\}`.
         */
        dataset?: string | null;
        /**
         * Output only. BigQuery resource name of the latest shard.
         */
        latestShardResource?: string | null;
        /**
         * Output only. Total number of shards.
         */
        shardCount?: string | null;
        /**
         * Output only. The table name prefix of the shards. The name of any given shard is `[table_prefix]YYYYMMDD`. For example, for the `MyTable20180101` shard, the `table_prefix` is `MyTable`.
         */
        tablePrefix?: string | null;
    }
    /**
     * Fields specific for BigQuery routines.
     */
    export interface Schema$GoogleCloudDatacatalogV1BigQueryRoutineSpec {
        /**
         * Paths of the imported libraries.
         */
        importedLibraries?: string[] | null;
    }
    /**
     * Describes a BigQuery table.
     */
    export interface Schema$GoogleCloudDatacatalogV1BigQueryTableSpec {
        /**
         * Output only. The table source type.
         */
        tableSourceType?: string | null;
        /**
         * Specification of a BigQuery table. Populated only if the `table_source_type` is `BIGQUERY_TABLE`.
         */
        tableSpec?: Schema$GoogleCloudDatacatalogV1TableSpec;
        /**
         * Table view specification. Populated only if the `table_source_type` is `BIGQUERY_VIEW`.
         */
        viewSpec?: Schema$GoogleCloudDatacatalogV1ViewSpec;
    }
    /**
     * Business Context of the entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1BusinessContext {
        /**
         * Contact people for the entry.
         */
        contacts?: Schema$GoogleCloudDatacatalogV1Contacts;
        /**
         * Entry overview fields for rich text descriptions of entries.
         */
        entryOverview?: Schema$GoogleCloudDatacatalogV1EntryOverview;
    }
    /**
     * Specification that applies to Instance entries that are part of `CLOUD_BIGTABLE` system. (user_specified_type)
     */
    export interface Schema$GoogleCloudDatacatalogV1CloudBigtableInstanceSpec {
        /**
         * The list of clusters for the Instance.
         */
        cloudBigtableClusterSpecs?: Schema$GoogleCloudDatacatalogV1CloudBigtableInstanceSpecCloudBigtableClusterSpec[];
    }
    /**
     * Spec that applies to clusters of an Instance of Cloud Bigtable.
     */
    export interface Schema$GoogleCloudDatacatalogV1CloudBigtableInstanceSpecCloudBigtableClusterSpec {
        /**
         * Name of the cluster.
         */
        displayName?: string | null;
        /**
         * A link back to the parent resource, in this case Instance.
         */
        linkedResource?: string | null;
        /**
         * Location of the cluster, typically a Cloud zone.
         */
        location?: string | null;
        /**
         * Type of the resource. For a cluster this would be "CLUSTER".
         */
        type?: string | null;
    }
    /**
     * Specification that applies to all entries that are part of `CLOUD_BIGTABLE` system (user_specified_type)
     */
    export interface Schema$GoogleCloudDatacatalogV1CloudBigtableSystemSpec {
        /**
         * Display name of the Instance. This is user specified and different from the resource name.
         */
        instanceDisplayName?: string | null;
    }
    /**
     * Specification for the BigQuery connection to a Cloud SQL instance.
     */
    export interface Schema$GoogleCloudDatacatalogV1CloudSqlBigQueryConnectionSpec {
        /**
         * Database name.
         */
        database?: string | null;
        /**
         * Cloud SQL instance ID in the format of `project:location:instance`.
         */
        instanceId?: string | null;
        /**
         * Type of the Cloud SQL database.
         */
        type?: string | null;
    }
    /**
     * A column within a schema. Columns can be nested inside other columns.
     */
    export interface Schema$GoogleCloudDatacatalogV1ColumnSchema {
        /**
         * Required. Name of the column. Must be a UTF-8 string without dots (.). The maximum size is 64 bytes.
         */
        column?: string | null;
        /**
         * Optional. Default value for the column.
         */
        defaultValue?: string | null;
        /**
         * Optional. Description of the column. Default value is an empty string. The description must be a UTF-8 string with the maximum size of 2000 bytes.
         */
        description?: string | null;
        /**
         * Optional. Garbage collection policy for the column or column family. Applies to systems like Cloud Bigtable.
         */
        gcRule?: string | null;
        /**
         * Optional. Most important inclusion of this column.
         */
        highestIndexingType?: string | null;
        /**
         * Looker specific column info of this column.
         */
        lookerColumnSpec?: Schema$GoogleCloudDatacatalogV1ColumnSchemaLookerColumnSpec;
        /**
         * Optional. A column's mode indicates whether values in this column are required, nullable, or repeated. Only `NULLABLE`, `REQUIRED`, and `REPEATED` values are supported. Default mode is `NULLABLE`.
         */
        mode?: string | null;
        /**
         * Optional. Ordinal position
         */
        ordinalPosition?: number | null;
        /**
         * Optional. The subtype of the RANGE, if the type of this field is RANGE. If the type is RANGE, this field is required. Possible values for the field element type of a RANGE include: * DATE * DATETIME * TIMESTAMP
         */
        rangeElementType?: Schema$GoogleCloudDatacatalogV1ColumnSchemaFieldElementType;
        /**
         * Optional. Schema of sub-columns. A column can have zero or more sub-columns.
         */
        subcolumns?: Schema$GoogleCloudDatacatalogV1ColumnSchema[];
        /**
         * Required. Type of the column. Must be a UTF-8 string with the maximum size of 128 bytes.
         */
        type?: string | null;
    }
    /**
     * Represents the type of a field element.
     */
    export interface Schema$GoogleCloudDatacatalogV1ColumnSchemaFieldElementType {
        /**
         * Required. The type of a field element. See ColumnSchema.type.
         */
        type?: string | null;
    }
    /**
     * Column info specific to Looker System.
     */
    export interface Schema$GoogleCloudDatacatalogV1ColumnSchemaLookerColumnSpec {
        /**
         * Looker specific column type of this column.
         */
        type?: string | null;
    }
    /**
     * Common statistics on the entry's usage. They can be set on any system.
     */
    export interface Schema$GoogleCloudDatacatalogV1CommonUsageStats {
        /**
         * View count in source system.
         */
        viewCount?: string | null;
    }
    /**
     * Contact people for the entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1Contacts {
        /**
         * The list of contact people for the entry.
         */
        people?: Schema$GoogleCloudDatacatalogV1ContactsPerson[];
    }
    /**
     * A contact person for the entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1ContactsPerson {
        /**
         * Designation of the person, for example, Data Steward.
         */
        designation?: string | null;
        /**
         * Email of the person in the format of `john.doe@xyz`, ``, or `John Doe`.
         */
        email?: string | null;
    }
    /**
     * Specification that applies to a table resource. Valid only for entries with the `TABLE` type.
     */
    export interface Schema$GoogleCloudDatacatalogV1DatabaseTableSpec {
        /**
         * Spec what applies to tables that are actually views. Not set for "real" tables.
         */
        databaseViewSpec?: Schema$GoogleCloudDatacatalogV1DatabaseTableSpecDatabaseViewSpec;
        /**
         * Output only. Fields specific to a Dataplex table and present only in the Dataplex table entries.
         */
        dataplexTable?: Schema$GoogleCloudDatacatalogV1DataplexTableSpec;
        /**
         * Type of this table.
         */
        type?: string | null;
    }
    /**
     * Specification that applies to database view.
     */
    export interface Schema$GoogleCloudDatacatalogV1DatabaseTableSpecDatabaseViewSpec {
        /**
         * Name of a singular table this view reflects one to one.
         */
        baseTable?: string | null;
        /**
         * SQL query used to generate this view.
         */
        sqlQuery?: string | null;
        /**
         * Type of this view.
         */
        viewType?: string | null;
    }
    /**
     * External table registered by Dataplex. Dataplex publishes data discovered from an asset into multiple other systems (BigQuery, DPMS) in form of tables. We call them "external tables". External tables are also synced into the Data Catalog. This message contains pointers to those external tables (fully qualified name, resource name et cetera) within the Data Catalog.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataplexExternalTable {
        /**
         * Name of the Data Catalog entry representing the external table.
         */
        dataCatalogEntry?: string | null;
        /**
         * Fully qualified name (FQN) of the external table.
         */
        fullyQualifiedName?: string | null;
        /**
         * Google Cloud resource name of the external table.
         */
        googleCloudResource?: string | null;
        /**
         * Service in which the external table is registered.
         */
        system?: string | null;
    }
    /**
     * Entry specyfication for a Dataplex fileset.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataplexFilesetSpec {
        /**
         * Common Dataplex fields.
         */
        dataplexSpec?: Schema$GoogleCloudDatacatalogV1DataplexSpec;
    }
    /**
     * Common Dataplex fields.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataplexSpec {
        /**
         * Fully qualified resource name of an asset in Dataplex, to which the underlying data source (Cloud Storage bucket or BigQuery dataset) of the entity is attached.
         */
        asset?: string | null;
        /**
         * Compression format of the data, e.g., zip, gzip etc.
         */
        compressionFormat?: string | null;
        /**
         * Format of the data.
         */
        dataFormat?: Schema$GoogleCloudDatacatalogV1PhysicalSchema;
        /**
         * Project ID of the underlying Cloud Storage or BigQuery data. Note that this may not be the same project as the correspondingly Dataplex lake / zone / asset.
         */
        projectId?: string | null;
    }
    /**
     * Entry specification for a Dataplex table.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataplexTableSpec {
        /**
         * Common Dataplex fields.
         */
        dataplexSpec?: Schema$GoogleCloudDatacatalogV1DataplexSpec;
        /**
         * List of external tables registered by Dataplex in other systems based on the same underlying data. External tables allow to query this data in those systems.
         */
        externalTables?: Schema$GoogleCloudDatacatalogV1DataplexExternalTable[];
        /**
         * Indicates if the table schema is managed by the user or not.
         */
        userManaged?: boolean | null;
    }
    /**
     * Specification that applies to a dataset. Valid only for entries with the `DATASET` type.
     */
    export interface Schema$GoogleCloudDatacatalogV1DatasetSpec {
        /**
         * Vertex AI Dataset specific fields
         */
        vertexDatasetSpec?: Schema$GoogleCloudDatacatalogV1VertexDatasetSpec;
    }
    /**
     * Physical location of an entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataSource {
        /**
         * Full name of a resource as defined by the service. For example: `//bigquery.googleapis.com/projects/{PROJECT_ID\}/locations/{LOCATION\}/datasets/{DATASET_ID\}/tables/{TABLE_ID\}`
         */
        resource?: string | null;
        /**
         * Service that physically stores the data.
         */
        service?: string | null;
        /**
         * Output only. Data Catalog entry name, if applicable.
         */
        sourceEntry?: string | null;
        /**
         * Detailed properties of the underlying storage.
         */
        storageProperties?: Schema$GoogleCloudDatacatalogV1StorageProperties;
    }
    /**
     * Specification that applies to a data source connection. Valid only for entries with the `DATA_SOURCE_CONNECTION` type. Only one of internal specs can be set at the time, and cannot be changed later.
     */
    export interface Schema$GoogleCloudDatacatalogV1DataSourceConnectionSpec {
        /**
         * Output only. Fields specific to BigQuery connections.
         */
        bigqueryConnectionSpec?: Schema$GoogleCloudDatacatalogV1BigQueryConnectionSpec;
    }
    /**
     * Wrapper for any item that can be contained in the dump.
     */
    export interface Schema$GoogleCloudDatacatalogV1DumpItem {
        /**
         * Entry and its tags.
         */
        taggedEntry?: Schema$GoogleCloudDatacatalogV1TaggedEntry;
    }
    /**
     * Entry metadata. A Data Catalog entry represents another resource in Google Cloud Platform (such as a BigQuery dataset or a Pub/Sub topic) or outside of it. You can use the `linked_resource` field in the entry resource to refer to the original resource ID of the source system. An entry resource contains resource details, for example, its schema. Additionally, you can attach flexible metadata to an entry in the form of a Tag.
     */
    export interface Schema$GoogleCloudDatacatalogV1Entry {
        /**
         * Output only. Specification for a group of BigQuery tables with the `[prefix]YYYYMMDD` name pattern. For more information, see [Introduction to partitioned tables] (https://cloud.google.com/bigquery/docs/partitioned-tables#partitioning_versus_sharding).
         */
        bigqueryDateShardedSpec?: Schema$GoogleCloudDatacatalogV1BigQueryDateShardedSpec;
        /**
         * Output only. Specification that applies to a BigQuery table. Valid only for entries with the `TABLE` type.
         */
        bigqueryTableSpec?: Schema$GoogleCloudDatacatalogV1BigQueryTableSpec;
        /**
         * Business Context of the entry. Not supported for BigQuery datasets
         */
        businessContext?: Schema$GoogleCloudDatacatalogV1BusinessContext;
        /**
         * Specification that applies to Cloud Bigtable system. Only settable when `integrated_system` is equal to `CLOUD_BIGTABLE`
         */
        cloudBigtableSystemSpec?: Schema$GoogleCloudDatacatalogV1CloudBigtableSystemSpec;
        /**
         * Specification that applies to a table resource. Valid only for entries with the `TABLE` or `EXPLORE` type.
         */
        databaseTableSpec?: Schema$GoogleCloudDatacatalogV1DatabaseTableSpec;
        /**
         * Specification that applies to a dataset.
         */
        datasetSpec?: Schema$GoogleCloudDatacatalogV1DatasetSpec;
        /**
         * Output only. Physical location of the entry.
         */
        dataSource?: Schema$GoogleCloudDatacatalogV1DataSource;
        /**
         * Specification that applies to a data source connection. Valid only for entries with the `DATA_SOURCE_CONNECTION` type.
         */
        dataSourceConnectionSpec?: Schema$GoogleCloudDatacatalogV1DataSourceConnectionSpec;
        /**
         * Entry description that can consist of several sentences or paragraphs that describe entry contents. The description must not contain Unicode non-characters as well as C0 and C1 control codes except tabs (HT), new lines (LF), carriage returns (CR), and page breaks (FF). The maximum size is 2000 bytes when encoded in UTF-8. Default value is an empty string.
         */
        description?: string | null;
        /**
         * Display name of an entry. The maximum size is 500 bytes when encoded in UTF-8. Default value is an empty string.
         */
        displayName?: string | null;
        /**
         * FeatureonlineStore spec for Vertex AI Feature Store.
         */
        featureOnlineStoreSpec?: Schema$GoogleCloudDatacatalogV1FeatureOnlineStoreSpec;
        /**
         * Specification that applies to a fileset resource. Valid only for entries with the `FILESET` type.
         */
        filesetSpec?: Schema$GoogleCloudDatacatalogV1FilesetSpec;
        /**
         * [Fully Qualified Name (FQN)](https://cloud.google.com//data-catalog/docs/fully-qualified-names) of the resource. Set automatically for entries representing resources from synced systems. Settable only during creation, and read-only later. Can be used for search and lookup of the entries.
         */
        fullyQualifiedName?: string | null;
        /**
         * Specification that applies to a Cloud Storage fileset. Valid only for entries with the `FILESET` type.
         */
        gcsFilesetSpec?: Schema$GoogleCloudDatacatalogV1GcsFilesetSpec;
        /**
         * Output only. Indicates the entry's source system that Data Catalog integrates with, such as BigQuery, Pub/Sub, or Dataproc Metastore.
         */
        integratedSystem?: string | null;
        /**
         * Cloud labels attached to the entry. In Data Catalog, you can create and modify labels attached only to custom entries. Synced entries have unmodifiable labels that come from the source system.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The resource this metadata entry refers to. For Google Cloud Platform resources, `linked_resource` is the [Full Resource Name] (https://cloud.google.com/apis/design/resource_names#full_resource_name). For example, the `linked_resource` for a table resource from BigQuery is: `//bigquery.googleapis.com/projects/{PROJECT_ID\}/datasets/{DATASET_ID\}/tables/{TABLE_ID\}` Output only when the entry is one of the types in the `EntryType` enum. For entries with a `user_specified_type`, this field is optional and defaults to an empty string. The resource string must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), periods (.), colons (:), slashes (/), dashes (-), and hashes (#). The maximum size is 200 bytes when encoded in UTF-8.
         */
        linkedResource?: string | null;
        /**
         * Specification that applies to Looker sysstem. Only settable when `user_specified_system` is equal to `LOOKER`
         */
        lookerSystemSpec?: Schema$GoogleCloudDatacatalogV1LookerSystemSpec;
        /**
         * Model specification.
         */
        modelSpec?: Schema$GoogleCloudDatacatalogV1ModelSpec;
        /**
         * Output only. Identifier. The resource name of an entry in URL format. Note: The entry itself and its child resources might not be stored in the location specified in its name.
         */
        name?: string | null;
        /**
         * Output only. Additional information related to the entry. Private to the current user.
         */
        personalDetails?: Schema$GoogleCloudDatacatalogV1PersonalDetails;
        /**
         * Specification that applies to a user-defined function or procedure. Valid only for entries with the `ROUTINE` type.
         */
        routineSpec?: Schema$GoogleCloudDatacatalogV1RoutineSpec;
        /**
         * Schema of the entry. An entry might not have any schema attached to it.
         */
        schema?: Schema$GoogleCloudDatacatalogV1Schema;
        /**
         * Specification that applies to a Service resource.
         */
        serviceSpec?: Schema$GoogleCloudDatacatalogV1ServiceSpec;
        /**
         * Timestamps from the underlying resource, not from the Data Catalog entry. Output only when the entry has a system listed in the `IntegratedSystem` enum. For entries with `user_specified_system`, this field is optional and defaults to an empty timestamp.
         */
        sourceSystemTimestamps?: Schema$GoogleCloudDatacatalogV1SystemTimestamps;
        /**
         * Specification that applies to a relational database system. Only settable when `user_specified_system` is equal to `SQL_DATABASE`
         */
        sqlDatabaseSystemSpec?: Schema$GoogleCloudDatacatalogV1SqlDatabaseSystemSpec;
        /**
         * The type of the entry. For details, see [`EntryType`](#entrytype).
         */
        type?: string | null;
        /**
         * Resource usage statistics.
         */
        usageSignal?: Schema$GoogleCloudDatacatalogV1UsageSignal;
        /**
         * Indicates the entry's source system that Data Catalog doesn't automatically integrate with. The `user_specified_system` string has the following limitations: * Is case insensitive. * Must begin with a letter or underscore. * Can only contain letters, numbers, and underscores. * Must be at least 1 character and at most 64 characters long.
         */
        userSpecifiedSystem?: string | null;
        /**
         * Custom entry type that doesn't match any of the values allowed for input and listed in the `EntryType` enum. When creating an entry, first check the type values in the enum. If there are no appropriate types for the new entry, provide a custom value, for example, `my_special_type`. The `user_specified_type` string has the following limitations: * Is case insensitive. * Must begin with a letter or underscore. * Can only contain letters, numbers, and underscores. * Must be at least 1 character and at most 64 characters long.
         */
        userSpecifiedType?: string | null;
    }
    /**
     * Entry overview fields for rich text descriptions of entries.
     */
    export interface Schema$GoogleCloudDatacatalogV1EntryOverview {
        /**
         * Entry overview with support for rich text. The overview must only contain Unicode characters, and should be formatted using HTML. The maximum length is 10 MiB as this value holds HTML descriptions including encoded images. The maximum length of the text without images is 100 KiB.
         */
        overview?: string | null;
    }
    /**
     * Detail description of the source information of a Vertex Feature Online Store.
     */
    export interface Schema$GoogleCloudDatacatalogV1FeatureOnlineStoreSpec {
        /**
         * Output only. Type of underlying storage for the FeatureOnlineStore.
         */
        storageType?: string | null;
    }
    /**
     * Specification that applies to a fileset. Valid only for entries with the 'FILESET' type.
     */
    export interface Schema$GoogleCloudDatacatalogV1FilesetSpec {
        /**
         * Fields specific to a Dataplex fileset and present only in the Dataplex fileset entries.
         */
        dataplexFileset?: Schema$GoogleCloudDatacatalogV1DataplexFilesetSpec;
    }
    /**
     * Describes a Cloud Storage fileset entry.
     */
    export interface Schema$GoogleCloudDatacatalogV1GcsFilesetSpec {
        /**
         * Required. Patterns to identify a set of files in Google Cloud Storage. For more information, see [Wildcard Names] (https://cloud.google.com/storage/docs/wildcards). Note: Currently, bucket wildcards are not supported. Examples of valid `file_patterns`: * `gs://bucket_name/dir/x`: matches all files in `bucket_name/dir` directory * `gs://bucket_name/dir/x*`: matches all files in `bucket_name/dir` and all subdirectories * `gs://bucket_name/file*`: matches files prefixed by `file` in `bucket_name` * `gs://bucket_name/??.txt`: matches files with two characters followed by `.txt` in `bucket_name` * `gs://bucket_name/[aeiou].txt`: matches files that contain a single vowel character followed by `.txt` in `bucket_name` * `gs://bucket_name/[a-m].txt`: matches files that contain `a`, `b`, ... or `m` followed by `.txt` in `bucket_name` * `gs://bucket_name/a/x/b`: matches all files in `bucket_name` that match the `a/x/b` pattern, such as `a/c/b`, `a/d/b` * `gs://another_bucket/a.txt`: matches `gs://another_bucket/a.txt` You can combine wildcards to match complex sets of files, for example: `gs://bucket_name/[a-m]??.j*g`
         */
        filePatterns?: string[] | null;
        /**
         * Output only. Sample files contained in this fileset, not all files contained in this fileset are represented here.
         */
        sampleGcsFileSpecs?: Schema$GoogleCloudDatacatalogV1GcsFileSpec[];
    }
    /**
     * Specification of a single file in Cloud Storage.
     */
    export interface Schema$GoogleCloudDatacatalogV1GcsFileSpec {
        /**
         * Required. Full file path. Example: `gs://bucket_name/a/b.txt`.
         */
        filePath?: string | null;
        /**
         * Output only. Creation, modification, and expiration timestamps of a Cloud Storage file.
         */
        gcsTimestamps?: Schema$GoogleCloudDatacatalogV1SystemTimestamps;
        /**
         * Output only. File size in bytes.
         */
        sizeBytes?: string | null;
    }
    /**
     * Metadata message for long-running operation returned by the ImportEntries.
     */
    export interface Schema$GoogleCloudDatacatalogV1ImportEntriesMetadata {
        /**
         * Partial errors that are encountered during the ImportEntries operation. There is no guarantee that all the encountered errors are reported. However, if no errors are reported, it means that no errors were encountered.
         */
        errors?: Schema$Status[];
        /**
         * State of the import operation.
         */
        state?: string | null;
    }
    /**
     * Response message for long-running operation returned by the ImportEntries.
     */
    export interface Schema$GoogleCloudDatacatalogV1ImportEntriesResponse {
        /**
         * Number of entries deleted as a result of import operation.
         */
        deletedEntriesCount?: string | null;
        /**
         * Cumulative number of entries created and entries updated as a result of import operation.
         */
        upsertedEntriesCount?: string | null;
    }
    /**
     * Specification that applies to entries that are part `LOOKER` system (user_specified_type)
     */
    export interface Schema$GoogleCloudDatacatalogV1LookerSystemSpec {
        /**
         * Name of the parent Looker Instance. Empty if it does not exist.
         */
        parentInstanceDisplayName?: string | null;
        /**
         * ID of the parent Looker Instance. Empty if it does not exist. Example value: `someinstance.looker.com`
         */
        parentInstanceId?: string | null;
        /**
         * Name of the parent Model. Empty if it does not exist.
         */
        parentModelDisplayName?: string | null;
        /**
         * ID of the parent Model. Empty if it does not exist.
         */
        parentModelId?: string | null;
        /**
         * Name of the parent View. Empty if it does not exist.
         */
        parentViewDisplayName?: string | null;
        /**
         * ID of the parent View. Empty if it does not exist.
         */
        parentViewId?: string | null;
    }
    /**
     * Specification that applies to a model. Valid only for entries with the `MODEL` type.
     */
    export interface Schema$GoogleCloudDatacatalogV1ModelSpec {
        /**
         * Specification for vertex model resources.
         */
        vertexModelSpec?: Schema$GoogleCloudDatacatalogV1VertexModelSpec;
    }
    /**
     * Entry metadata relevant only to the user and private to them.
     */
    export interface Schema$GoogleCloudDatacatalogV1PersonalDetails {
        /**
         * True if the entry is starred by the user; false otherwise.
         */
        starred?: boolean | null;
        /**
         * Set if the entry is starred; unset otherwise.
         */
        starTime?: string | null;
    }
    /**
     * Native schema used by a resource represented as an entry. Used by query engines for deserializing and parsing source data.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchema {
        /**
         * Schema in Avro JSON format.
         */
        avro?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaAvroSchema;
        /**
         * Marks a CSV-encoded data source.
         */
        csv?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaCsvSchema;
        /**
         * Marks an ORC-encoded data source.
         */
        orc?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaOrcSchema;
        /**
         * Marks a Parquet-encoded data source.
         */
        parquet?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaParquetSchema;
        /**
         * Schema in protocol buffer format.
         */
        protobuf?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaProtobufSchema;
        /**
         * Schema in Thrift format.
         */
        thrift?: Schema$GoogleCloudDatacatalogV1PhysicalSchemaThriftSchema;
    }
    /**
     * Schema in Avro JSON format.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaAvroSchema {
        /**
         * JSON source of the Avro schema.
         */
        text?: string | null;
    }
    /**
     * Marks a CSV-encoded data source.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaCsvSchema {
    }
    /**
     * Marks an ORC-encoded data source.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaOrcSchema {
    }
    /**
     * Marks a Parquet-encoded data source.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaParquetSchema {
    }
    /**
     * Schema in protocol buffer format.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaProtobufSchema {
        /**
         * Protocol buffer source of the schema.
         */
        text?: string | null;
    }
    /**
     * Schema in Thrift format.
     */
    export interface Schema$GoogleCloudDatacatalogV1PhysicalSchemaThriftSchema {
        /**
         * Thrift IDL source of the schema.
         */
        text?: string | null;
    }
    /**
     * Long-running operation metadata message returned by the ReconcileTags.
     */
    export interface Schema$GoogleCloudDatacatalogV1ReconcileTagsMetadata {
        /**
         * Maps the name of each tagged column (or empty string for a sole entry) to tagging operation status.
         */
        errors?: {
            [key: string]: Schema$Status;
        } | null;
        /**
         * State of the reconciliation operation.
         */
        state?: string | null;
    }
    /**
     * Long-running operation response message returned by ReconcileTags.
     */
    export interface Schema$GoogleCloudDatacatalogV1ReconcileTagsResponse {
        /**
         * Number of tags created in the request.
         */
        createdTagsCount?: string | null;
        /**
         * Number of tags deleted in the request.
         */
        deletedTagsCount?: string | null;
        /**
         * Number of tags updated in the request.
         */
        updatedTagsCount?: string | null;
    }
    /**
     * Specification that applies to a routine. Valid only for entries with the `ROUTINE` type.
     */
    export interface Schema$GoogleCloudDatacatalogV1RoutineSpec {
        /**
         * Fields specific for BigQuery routines.
         */
        bigqueryRoutineSpec?: Schema$GoogleCloudDatacatalogV1BigQueryRoutineSpec;
        /**
         * The body of the routine.
         */
        definitionBody?: string | null;
        /**
         * The language the routine is written in. The exact value depends on the source system. For BigQuery routines, possible values are: * `SQL` * `JAVASCRIPT`
         */
        language?: string | null;
        /**
         * Return type of the argument. The exact value depends on the source system and the language.
         */
        returnType?: string | null;
        /**
         * Arguments of the routine.
         */
        routineArguments?: Schema$GoogleCloudDatacatalogV1RoutineSpecArgument[];
        /**
         * The type of the routine.
         */
        routineType?: string | null;
    }
    /**
     * Input or output argument of a function or stored procedure.
     */
    export interface Schema$GoogleCloudDatacatalogV1RoutineSpecArgument {
        /**
         * Specifies whether the argument is input or output.
         */
        mode?: string | null;
        /**
         * The name of the argument. A return argument of a function might not have a name.
         */
        name?: string | null;
        /**
         * Type of the argument. The exact value depends on the source system and the language.
         */
        type?: string | null;
    }
    /**
     * Represents a schema, for example, a BigQuery, GoogleSQL, or Avro schema.
     */
    export interface Schema$GoogleCloudDatacatalogV1Schema {
        /**
         * The unified GoogleSQL-like schema of columns. The overall maximum number of columns and nested columns is 10,000. The maximum nested depth is 15 levels.
         */
        columns?: Schema$GoogleCloudDatacatalogV1ColumnSchema[];
    }
    /**
     * Specification that applies to a Service resource. Valid only for entries with the `SERVICE` type.
     */
    export interface Schema$GoogleCloudDatacatalogV1ServiceSpec {
        /**
         * Specification that applies to Instance entries of `CLOUD_BIGTABLE` system.
         */
        cloudBigtableInstanceSpec?: Schema$GoogleCloudDatacatalogV1CloudBigtableInstanceSpec;
    }
    /**
     * Specification that applies to entries that are part `SQL_DATABASE` system (user_specified_type)
     */
    export interface Schema$GoogleCloudDatacatalogV1SqlDatabaseSystemSpec {
        /**
         * Version of the database engine.
         */
        databaseVersion?: string | null;
        /**
         * Host of the SQL database enum InstanceHost { UNDEFINED = 0; SELF_HOSTED = 1; CLOUD_SQL = 2; AMAZON_RDS = 3; AZURE_SQL = 4; \} Host of the enclousing database instance.
         */
        instanceHost?: string | null;
        /**
         * SQL Database Engine. enum SqlEngine { UNDEFINED = 0; MY_SQL = 1; POSTGRE_SQL = 2; SQL_SERVER = 3; \} Engine of the enclosing database instance.
         */
        sqlEngine?: string | null;
    }
    /**
     * Details the properties of the underlying storage.
     */
    export interface Schema$GoogleCloudDatacatalogV1StorageProperties {
        /**
         * Patterns to identify a set of files for this fileset. Examples of a valid `file_pattern`: * `gs://bucket_name/dir/x`: matches all files in the `bucket_name/dir` directory * `gs://bucket_name/dir/x*`: matches all files in the `bucket_name/dir` and all subdirectories recursively * `gs://bucket_name/file*`: matches files prefixed by `file` in `bucket_name` * `gs://bucket_name/??.txt`: matches files with two characters followed by `.txt` in `bucket_name` * `gs://bucket_name/[aeiou].txt`: matches files that contain a single vowel character followed by `.txt` in `bucket_name` * `gs://bucket_name/[a-m].txt`: matches files that contain `a`, `b`, ... or `m` followed by `.txt` in `bucket_name` * `gs://bucket_name/a/x/b`: matches all files in `bucket_name` that match the `a/x/b` pattern, such as `a/c/b`, `a/d/b` * `gs://another_bucket/a.txt`: matches `gs://another_bucket/a.txt`
         */
        filePattern?: string[] | null;
        /**
         * File type in MIME format, for example, `text/plain`.
         */
        fileType?: string | null;
    }
    /**
     * Timestamps associated with this resource in a particular system.
     */
    export interface Schema$GoogleCloudDatacatalogV1SystemTimestamps {
        /**
         * Creation timestamp of the resource within the given system.
         */
        createTime?: string | null;
        /**
         * Output only. Expiration timestamp of the resource within the given system. Currently only applicable to BigQuery resources.
         */
        expireTime?: string | null;
        /**
         * Timestamp of the last modification of the resource or its metadata within a given system. Note: Depending on the source system, not every modification updates this timestamp. For example, BigQuery timestamps every metadata modification but not data or permission changes.
         */
        updateTime?: string | null;
    }
    /**
     * Normal BigQuery table specification.
     */
    export interface Schema$GoogleCloudDatacatalogV1TableSpec {
        /**
         * Output only. If the table is date-sharded, that is, it matches the `[prefix]YYYYMMDD` name pattern, this field is the Data Catalog resource name of the date-sharded grouped entry. For example: `projects/{PROJECT_ID\}/locations/{LOCATION\}/entrygroups/{ENTRY_GROUP_ID\}/entries/{ENTRY_ID\}`. Otherwise, `grouped_entry` is empty.
         */
        groupedEntry?: string | null;
    }
    /**
     * Tags contain custom metadata and are attached to Data Catalog resources. Tags conform with the specification of their tag template. See [Data Catalog IAM](https://cloud.google.com/data-catalog/docs/concepts/iam) for information on the permissions needed to create or view tags.
     */
    export interface Schema$GoogleCloudDatacatalogV1Tag {
        /**
         * Resources like entry can have schemas associated with them. This scope allows you to attach tags to an individual column based on that schema. To attach a tag to a nested column, separate column names with a dot (`.`). Example: `column.nested_column`.
         */
        column?: string | null;
        /**
         * Output only. Denotes the transfer status of the Tag Template.
         */
        dataplexTransferStatus?: string | null;
        /**
         * Required. Maps the ID of a tag field to its value and additional information about that field. Tag template defines valid field IDs. A tag must have at least 1 field and at most 500 fields.
         */
        fields?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1TagField;
        } | null;
        /**
         * Identifier. The resource name of the tag in URL format where tag ID is a system-generated identifier. Note: The tag itself might not be stored in the location specified in its name.
         */
        name?: string | null;
        /**
         * Required. The resource name of the tag template this tag uses. Example: `projects/{PROJECT_ID\}/locations/{LOCATION\}/tagTemplates/{TAG_TEMPLATE_ID\}` This field cannot be modified after creation.
         */
        template?: string | null;
        /**
         * Output only. The display name of the tag template.
         */
        templateDisplayName?: string | null;
    }
    /**
     * Contains the value and additional information on a field within a Tag.
     */
    export interface Schema$GoogleCloudDatacatalogV1TagField {
        /**
         * The value of a tag field with a boolean type.
         */
        boolValue?: boolean | null;
        /**
         * Output only. The display name of this field.
         */
        displayName?: string | null;
        /**
         * The value of a tag field with a double type.
         */
        doubleValue?: number | null;
        /**
         * The value of a tag field with an enum type. This value must be one of the allowed values listed in this enum.
         */
        enumValue?: Schema$GoogleCloudDatacatalogV1TagFieldEnumValue;
        /**
         * Output only. The order of this field with respect to other fields in this tag. Can be set by Tag. For example, a higher value can indicate a more important field. The value can be negative. Multiple fields can have the same order, and field orders within a tag don't have to be sequential.
         */
        order?: number | null;
        /**
         * The value of a tag field with a rich text type. The maximum length is 10 MiB as this value holds HTML descriptions including encoded images. The maximum length of the text without images is 100 KiB.
         */
        richtextValue?: string | null;
        /**
         * The value of a tag field with a string type. The maximum length is 2000 UTF-8 characters.
         */
        stringValue?: string | null;
        /**
         * The value of a tag field with a timestamp type.
         */
        timestampValue?: string | null;
    }
    /**
     * An enum value.
     */
    export interface Schema$GoogleCloudDatacatalogV1TagFieldEnumValue {
        /**
         * The display name of the enum value.
         */
        displayName?: string | null;
    }
    /**
     * Wrapper containing Entry and information about Tags that should and should not be attached to it.
     */
    export interface Schema$GoogleCloudDatacatalogV1TaggedEntry {
        /**
         * Optional. Tags that should be deleted from the Data Catalog. Caller should populate template name and column only.
         */
        absentTags?: Schema$GoogleCloudDatacatalogV1Tag[];
        /**
         * Optional. Tags that should be ingested into the Data Catalog. Caller should populate template name, column and fields.
         */
        presentTags?: Schema$GoogleCloudDatacatalogV1Tag[];
        /**
         * Non-encrypted Data Catalog v1 Entry.
         */
        v1Entry?: Schema$GoogleCloudDatacatalogV1Entry;
    }
    /**
     * The set of all usage signals that Data Catalog stores. Note: Usually, these signals are updated daily. In rare cases, an update may fail but will be performed again on the next day.
     */
    export interface Schema$GoogleCloudDatacatalogV1UsageSignal {
        /**
         * Common usage statistics over each of the predefined time ranges. Supported time ranges are `{"24H", "7D", "30D", "Lifetime"\}`.
         */
        commonUsageWithinTimeRange?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1CommonUsageStats;
        } | null;
        /**
         * Favorite count in the source system.
         */
        favoriteCount?: string | null;
        /**
         * The end timestamp of the duration of usage statistics.
         */
        updateTime?: string | null;
        /**
         * Output only. BigQuery usage statistics over each of the predefined time ranges. Supported time ranges are `{"24H", "7D", "30D"\}`.
         */
        usageWithinTimeRange?: {
            [key: string]: Schema$GoogleCloudDatacatalogV1UsageStats;
        } | null;
    }
    /**
     * Detailed statistics on the entry's usage. Usage statistics have the following limitations: - Only BigQuery tables have them. - They only include BigQuery query jobs. - They might be underestimated because wildcard table references are not yet counted. For more information, see [Querying multiple tables using a wildcard table] (https://cloud.google.com/bigquery/docs/querying-wildcard-tables)
     */
    export interface Schema$GoogleCloudDatacatalogV1UsageStats {
        /**
         * The number of cancelled attempts to use the underlying entry.
         */
        totalCancellations?: number | null;
        /**
         * The number of successful uses of the underlying entry.
         */
        totalCompletions?: number | null;
        /**
         * Total time spent only on successful uses, in milliseconds.
         */
        totalExecutionTimeForCompletionsMillis?: number | null;
        /**
         * The number of failed attempts to use the underlying entry.
         */
        totalFailures?: number | null;
    }
    /**
     * Specification for vertex dataset resources.
     */
    export interface Schema$GoogleCloudDatacatalogV1VertexDatasetSpec {
        /**
         * The number of DataItems in this Dataset. Only apply for non-structured Dataset.
         */
        dataItemCount?: string | null;
        /**
         * Type of the dataset.
         */
        dataType?: string | null;
    }
    /**
     * Detail description of the source information of a Vertex model.
     */
    export interface Schema$GoogleCloudDatacatalogV1VertexModelSourceInfo {
        /**
         * If this Model is copy of another Model. If true then source_type pertains to the original.
         */
        copy?: boolean | null;
        /**
         * Type of the model source.
         */
        sourceType?: string | null;
    }
    /**
     * Specification for vertex model resources.
     */
    export interface Schema$GoogleCloudDatacatalogV1VertexModelSpec {
        /**
         * URI of the Docker image to be used as the custom container for serving predictions.
         */
        containerImageUri?: string | null;
        /**
         * User provided version aliases so that a model version can be referenced via alias
         */
        versionAliases?: string[] | null;
        /**
         * The description of this version.
         */
        versionDescription?: string | null;
        /**
         * The version ID of the model.
         */
        versionId?: string | null;
        /**
         * Source of a Vertex model.
         */
        vertexModelSourceInfo?: Schema$GoogleCloudDatacatalogV1VertexModelSourceInfo;
    }
    /**
     * Table view specification.
     */
    export interface Schema$GoogleCloudDatacatalogV1ViewSpec {
        /**
         * Output only. The query that defines the table view.
         */
        viewQuery?: string | null;
    }
    /**
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** ``` { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} ``` **YAML example:** ``` bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') etag: BwWWja0YfJA= version: 3 ``` For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
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
     * Request message for `SetIamPolicy` method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
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
    export class Resource$Catalog {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Searches Data Catalog for multiple resources like entries, tags that match a query. This is a custom method (https://cloud.google.com/apis/design/custom_methods) and does not return the complete resource, only the resource identifier and high level fields. Clients can subsequently call `Get` methods. Note that Data Catalog search queries do not guarantee full recall. Query results that match your query may not be returned, even in subsequent result pages. Also note that results returned (and not returned) can vary across repeated search queries. See [Data Catalog Search Syntax](https://cloud.google.com/data-catalog/docs/how-to/search-reference) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Catalog$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Catalog$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse>>;
        search(params: Params$Resource$Catalog$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Catalog$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse>): void;
        search(params: Params$Resource$Catalog$Search, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1SearchCatalogResponse>): void;
    }
    export interface Params$Resource$Catalog$Search extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1SearchCatalogRequest;
    }
    export class Resource$Entries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get an entry by target resource name. This method allows clients to use the resource name from the source Google Cloud Platform service to get the Data Catalog Entry.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Entries$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Entries$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Entry>>;
        lookup(params: Params$Resource$Entries$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Entries$Lookup, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        lookup(params: Params$Resource$Entries$Lookup, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        lookup(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
    }
    export interface Params$Resource$Entries$Lookup extends StandardParameters {
        /**
         * The full name of the Google Cloud Platform resource the Data Catalog entry represents. See: https://cloud.google.com/apis/design/resource_names#full_resource_name. Full names are case-sensitive. Examples: * //bigquery.googleapis.com/projects/projectId/datasets/datasetId/tables/tableId * //pubsub.googleapis.com/projects/projectId/topics/topicId
         */
        linkedResource?: string;
        /**
         * The SQL name of the entry. SQL names are case-sensitive. Examples: * `pubsub.project_id.topic_id` * ``pubsub.project_id.`topic.id.with.dots` `` * `bigquery.table.project_id.dataset_id.table_id` * `bigquery.dataset.project_id.dataset_id` * `datacatalog.entry.project_id.location_id.entry_group_id.entry_id` `*_id`s should satisfy the GoogleSQL rules for identifiers. https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical.
         */
        sqlResource?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        entryGroups: Resource$Projects$Locations$Entrygroups;
        tagTemplates: Resource$Projects$Locations$Tagtemplates;
        taxonomies: Resource$Projects$Locations$Taxonomies;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Entrygroups {
        context: APIRequestContext;
        entries: Resource$Projects$Locations$Entrygroups$Entries;
        tags: Resource$Projects$Locations$Entrygroups$Tags;
        constructor(context: APIRequestContext);
        /**
         * A maximum of 10,000 entry groups may be created per organization across all locations. Users should enable the Data Catalog API in the project identified by the `parent` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Entrygroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Entrygroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>>;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        /**
         * Deletes an EntryGroup. Only entry groups that do not contain entries can be deleted. Users should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Entrygroups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an EntryGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Entrygroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Entrygroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>>;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        /**
         * Gets the access control policy for a resource. A `NOT_FOUND` error is returned if the resource does not exist. An empty policy is returned if the resource exists but does not have a policy set on it. Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. Callers must have following Google IAM permission - `datacatalog.tagTemplates.getIamPolicy` to get policies on tag templates. - `datacatalog.entries.getIamPolicy` to get policies on entries. - `datacatalog.entryGroups.getIamPolicy` to get policies on entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Entrygroups$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Entrygroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Entrygroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Entrygroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntryGroupsResponse>): void;
        /**
         * Updates an EntryGroup. The user should enable the Data Catalog API in the project identified by the `entry_group.name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Entrygroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>>;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1EntryGroup>): void;
        /**
         * Sets the access control policy for a resource. Replaces any existing policy. Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. Callers must have following Google IAM permission - `datacatalog.tagTemplates.setIamPolicy` to set policies on tag templates. - `datacatalog.entries.setIamPolicy` to set policies on entries. - `datacatalog.entryGroups.setIamPolicy` to set policies on entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Entrygroups$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the caller's permissions on a resource. If the resource does not exist, an empty set of permissions is returned (We don't return a `NOT_FOUND` error). Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. A caller is not required to have Google IAM permission to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Entrygroups$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Create extends StandardParameters {
        /**
         * Required. The id of the entry group to create. The id must begin with a letter or underscore, contain only English letters, numbers and underscores, and be at most 64 characters.
         */
        entryGroupId?: string;
        /**
         * Required. The name of the project this entry group is in. Example: * projects/{project_id\}/locations/{location\} Note that this EntryGroup and its child resources may not actually be stored in the location in this name.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1EntryGroup;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Delete extends StandardParameters {
        /**
         * Optional. If true, deletes all entries in the entry group.
         */
        force?: boolean;
        /**
         * Required. The name of the entry group. For example, `projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Get extends StandardParameters {
        /**
         * Required. The name of the entry group. For example, `projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}`.
         */
        name?: string;
        /**
         * The fields to return. If not set or empty, all fields are returned.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$List extends StandardParameters {
        /**
         * Optional. The maximum number of items to return. Default is 10. Max limit is 1000. Throws an invalid argument for `page_size \> 1000`.
         */
        pageSize?: number;
        /**
         * Optional. Token that specifies which page is requested. If empty, the first page is returned.
         */
        pageToken?: string;
        /**
         * Required. The name of the location that contains the entry groups, which can be provided in URL format. Example: * projects/{project_id\}/locations/{location\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the entry group in URL format. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\} Note that this EntryGroup and its child resources may not actually be stored in the location in this name.
         */
        name?: string;
        /**
         * Names of fields whose values to overwrite on an entry group. If this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1EntryGroup;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Entrygroups$Entries {
        context: APIRequestContext;
        tags: Resource$Projects$Locations$Entrygroups$Entries$Tags;
        constructor(context: APIRequestContext);
        /**
         * Creates an entry. Only entries of 'FILESET' type or user-specified type can be created. Users should enable the Data Catalog API in the project identified by the `parent` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information). A maximum of 100,000 entries may be created per entry group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Entry>>;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        /**
         * Deletes an existing entry. Only entries created through CreateEntry method can be deleted. Users should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an entry.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Entry>>;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        get(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        /**
         * Gets the access control policy for a resource. A `NOT_FOUND` error is returned if the resource does not exist. An empty policy is returned if the resource exists but does not have a policy set on it. Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. Callers must have following Google IAM permission - `datacatalog.tagTemplates.getIamPolicy` to get policies on tag templates. - `datacatalog.entries.getIamPolicy` to get policies on entries. - `datacatalog.entryGroups.getIamPolicy` to get policies on entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists entries.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse>>;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListEntriesResponse>): void;
        /**
         * Updates an existing entry. Users should enable the Data Catalog API in the project identified by the `entry.name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Entry>>;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Entry>): void;
        /**
         * Returns the caller's permissions on a resource. If the resource does not exist, an empty set of permissions is returned (We don't return a `NOT_FOUND` error). Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. A caller is not required to have Google IAM permission to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Create extends StandardParameters {
        /**
         * Required. The id of the entry to create.
         */
        entryId?: string;
        /**
         * Required. The name of the entry group this entry is in. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\} Note that this Entry and its child resources may not actually be stored in the location in this name.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Entry;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Delete extends StandardParameters {
        /**
         * Required. The name of the entry. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Get extends StandardParameters {
        /**
         * Required. The name of the entry. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$List extends StandardParameters {
        /**
         * The maximum number of items to return. Default is 10. Max limit is 1000. Throws an invalid argument for `page_size \> 1000`.
         */
        pageSize?: number;
        /**
         * Token that specifies which page is requested. If empty, the first page is returned.
         */
        pageToken?: string;
        /**
         * Required. The name of the entry group that contains the entries, which can be provided in URL format. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}
         */
        parent?: string;
        /**
         * The fields to return for each Entry. If not set or empty, all fields are returned. For example, setting read_mask to contain only one path "name" will cause ListEntries to return a list of Entries with only "name" field.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Patch extends StandardParameters {
        /**
         * Output only. Identifier. The Data Catalog resource name of the entry in URL format. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\} Note that this Entry and its child resources may not actually be stored in the location in this name.
         */
        name?: string;
        /**
         * Names of fields whose values to overwrite on an entry. If this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied. The following fields are modifiable: * For entries with type `DATA_STREAM`: * `schema` * For entries with type `FILESET`: * `schema` * `display_name` * `description` * `gcs_fileset_spec` * `gcs_fileset_spec.file_patterns` * For entries with `user_specified_type`: * `schema` * `display_name` * `description` * `user_specified_type` * `user_specified_system` * `linked_resource` * `source_system_timestamps`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Entry;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Entrygroups$Entries$Tags {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a tag on an Entry. Note: The project identified by the `parent` parameter for the [tag](https://cloud.google.com/data-catalog/docs/reference/rest/v1beta1/projects.locations.entryGroups.entries.tags/create#path-parameters) and the [tag template](https://cloud.google.com/data-catalog/docs/reference/rest/v1beta1/projects.locations.tagTemplates/create#path-parameters) used to create the tag must be from the same organization.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Tag>>;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        /**
         * Deletes a tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists tags assigned to an Entry. The columns in the response are lowercased.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>>;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        /**
         * Updates an existing tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Tag>>;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Create extends StandardParameters {
        /**
         * Required. The name of the resource to attach this tag to. Tags can be attached to Entries. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\} Note that this Tag and its child resources may not actually be stored in the location in this name.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Tag;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Delete extends StandardParameters {
        /**
         * Required. The name of the tag to delete. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}/tags/{tag_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$List extends StandardParameters {
        /**
         * The maximum number of tags to return. Default is 10. Max limit is 1000.
         */
        pageSize?: number;
        /**
         * Token that specifies which page is requested. If empty, the first page is returned.
         */
        pageToken?: string;
        /**
         * Required. The name of the Data Catalog resource to list the tags of. The resource could be an Entry or an EntryGroup. Examples: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\} * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Entries$Tags$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the tag in URL format. Example: * projects/{project_id\}/locations/{location\}/entrygroups/{entry_group_id\}/entries/{entry_id\}/tags/{tag_id\} where `tag_id` is a system-generated identifier. Note that this Tag may not actually be stored in the location in this name.
         */
        name?: string;
        /**
         * Note: Currently, this parameter can only take `"fields"` as value. Names of fields whose values to overwrite on a tag. Currently, a tag has the only modifiable field with the name `fields`. In general, if this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Tag;
    }
    export class Resource$Projects$Locations$Entrygroups$Tags {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a tag on an Entry. Note: The project identified by the `parent` parameter for the [tag](https://cloud.google.com/data-catalog/docs/reference/rest/v1beta1/projects.locations.entryGroups.entries.tags/create#path-parameters) and the [tag template](https://cloud.google.com/data-catalog/docs/reference/rest/v1beta1/projects.locations.tagTemplates/create#path-parameters) used to create the tag must be from the same organization.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Entrygroups$Tags$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Tag>>;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        create(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        /**
         * Deletes a tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Entrygroups$Tags$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists tags assigned to an Entry. The columns in the response are lowercased.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Entrygroups$Tags$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Entrygroups$Tags$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>>;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Tags$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Tags$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Entrygroups$Tags$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTagsResponse>): void;
        /**
         * Updates an existing tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Entrygroups$Tags$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Tag>>;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        patch(params: Params$Resource$Projects$Locations$Entrygroups$Tags$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Tag>): void;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Tags$Create extends StandardParameters {
        /**
         * Required. The name of the resource to attach this tag to. Tags can be attached to Entries. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\} Note that this Tag and its child resources may not actually be stored in the location in this name.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Tag;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Tags$Delete extends StandardParameters {
        /**
         * Required. The name of the tag to delete. Example: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}/tags/{tag_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Tags$List extends StandardParameters {
        /**
         * The maximum number of tags to return. Default is 10. Max limit is 1000.
         */
        pageSize?: number;
        /**
         * Token that specifies which page is requested. If empty, the first page is returned.
         */
        pageToken?: string;
        /**
         * Required. The name of the Data Catalog resource to list the tags of. The resource could be an Entry or an EntryGroup. Examples: * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\} * projects/{project_id\}/locations/{location\}/entryGroups/{entry_group_id\}/entries/{entry_id\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Entrygroups$Tags$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the tag in URL format. Example: * projects/{project_id\}/locations/{location\}/entrygroups/{entry_group_id\}/entries/{entry_id\}/tags/{tag_id\} where `tag_id` is a system-generated identifier. Note that this Tag may not actually be stored in the location in this name.
         */
        name?: string;
        /**
         * Note: Currently, this parameter can only take `"fields"` as value. Names of fields whose values to overwrite on a tag. Currently, a tag has the only modifiable field with the name `fields`. In general, if this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Tag;
    }
    export class Resource$Projects$Locations$Tagtemplates {
        context: APIRequestContext;
        fields: Resource$Projects$Locations$Tagtemplates$Fields;
        constructor(context: APIRequestContext);
        /**
         * Creates a tag template. The user should enable the Data Catalog API in the project identified by the `parent` parameter (see [Data Catalog Resource Project](https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Tagtemplates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>>;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        /**
         * Deletes a tag template and all tags using the template. Users should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Tagtemplates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a tag template.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Tagtemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Tagtemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>>;
        get(params: Params$Resource$Projects$Locations$Tagtemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Tagtemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        get(params: Params$Resource$Projects$Locations$Tagtemplates$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        /**
         * Gets the access control policy for a resource. A `NOT_FOUND` error is returned if the resource does not exist. An empty policy is returned if the resource exists but does not have a policy set on it. Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. Callers must have following Google IAM permission - `datacatalog.tagTemplates.getIamPolicy` to get policies on tag templates. - `datacatalog.entries.getIamPolicy` to get policies on entries. - `datacatalog.entryGroups.getIamPolicy` to get policies on entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Updates a tag template. This method cannot be used to update the fields of a template. The tag template fields are represented as separate resources and should be updated using their own create/update/delete methods. Users should enable the Data Catalog API in the project identified by the `tag_template.name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Tagtemplates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>>;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplate>): void;
        /**
         * Sets the access control policy for a resource. Replaces any existing policy. Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. Callers must have following Google IAM permission - `datacatalog.tagTemplates.setIamPolicy` to set policies on tag templates. - `datacatalog.entries.setIamPolicy` to set policies on entries. - `datacatalog.entryGroups.setIamPolicy` to set policies on entry groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the caller's permissions on a resource. If the resource does not exist, an empty set of permissions is returned (We don't return a `NOT_FOUND` error). Supported resources are: - Tag templates. - Entries. - Entry groups. Note, this method cannot be used to manage policies for BigQuery, Pub/Sub and any external Google Cloud Platform resources synced to Data Catalog. A caller is not required to have Google IAM permission to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Create extends StandardParameters {
        /**
         * Required. The name of the project and the template location [region](https://cloud.google.com/data-catalog/docs/concepts/regions. Example: * projects/{project_id\}/locations/us-central1
         */
        parent?: string;
        /**
         * Required. The id of the tag template to create.
         */
        tagTemplateId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1TagTemplate;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Delete extends StandardParameters {
        /**
         * Required. Currently, this field must always be set to `true`. This confirms the deletion of any possible tags using this template. `force = false` will be supported in the future.
         */
        force?: boolean;
        /**
         * Required. The name of the tag template to delete. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Get extends StandardParameters {
        /**
         * Required. The name of the tag template. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Patch extends StandardParameters {
        /**
         * Identifier. The resource name of the tag template in URL format. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\} Note that this TagTemplate and its child resources may not actually be stored in the location in this name.
         */
        name?: string;
        /**
         * Names of fields whose values to overwrite on a tag template. Currently, only `display_name` can be overwritten. In general, if this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1TagTemplate;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Tagtemplates$Fields {
        context: APIRequestContext;
        enumValues: Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues;
        constructor(context: APIRequestContext);
        /**
         * Creates a field in a tag template. The user should enable the Data Catalog API in the project identified by the `parent` parameter (see [Data Catalog Resource Project](https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Tagtemplates$Fields$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>>;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        create(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        /**
         * Deletes a field in a tag template and all uses of that field. Users should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a field in a tag template. This method cannot be used to update the field type. Users should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project] (https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>>;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        patch(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        /**
         * Renames a field in a tag template. The user should enable the Data Catalog API in the project identified by the `name` parameter (see [Data Catalog Resource Project](https://cloud.google.com/data-catalog/docs/concepts/resource-project) for more information).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rename(params?: Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>>;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        rename(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Fields$Create extends StandardParameters {
        /**
         * Required. The name of the project and the template location [region](https://cloud.google.com/data-catalog/docs/concepts/regions). Example: * projects/{project_id\}/locations/us-central1/tagTemplates/{tag_template_id\}
         */
        parent?: string;
        /**
         * Required. The ID of the tag template field to create. Field ids can contain letters (both uppercase and lowercase), numbers (0-9), underscores (_) and dashes (-). Field IDs must be at least 1 character long and at most 128 characters long. Field IDs must also be unique within their template.
         */
        tagTemplateFieldId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1TagTemplateField;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Fields$Delete extends StandardParameters {
        /**
         * Required. Currently, this field must always be set to `true`. This confirms the deletion of this field from any tags using this field. `force = false` will be supported in the future.
         */
        force?: boolean;
        /**
         * Required. The name of the tag template field to delete. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}/fields/{tag_template_field_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Fields$Patch extends StandardParameters {
        /**
         * Required. The name of the tag template field. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}/fields/{tag_template_field_id\}
         */
        name?: string;
        /**
         * Optional. Names of fields whose values to overwrite on an individual field of a tag template. The following fields are modifiable: * `display_name` * `type.enum_type` * `is_required` If this parameter is absent or empty, all modifiable fields are overwritten. If such fields are non-required and omitted in the request body, their values are emptied with one exception: when updating an enum type, the provided values are merged with the existing values. Therefore, enum values can only be added, existing enum values cannot be deleted or renamed. Additionally, updating a template field from optional to required is *not* allowed.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1TagTemplateField;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Fields$Rename extends StandardParameters {
        /**
         * Required. The name of the tag template. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}/fields/{tag_template_field_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1RenameTagTemplateFieldRequest;
    }
    export class Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Renames an enum value in a tag template. The enum values have to be unique within one enum field. Thus, an enum value cannot be renamed with a name used in any other enum value within the same enum field.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rename(params?: Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>>;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        rename(params: Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
        rename(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1TagTemplateField>): void;
    }
    export interface Params$Resource$Projects$Locations$Tagtemplates$Fields$Enumvalues$Rename extends StandardParameters {
        /**
         * Required. The name of the enum field value. Example: * projects/{project_id\}/locations/{location\}/tagTemplates/{tag_template_id\}/fields/{tag_template_field_id\}/enumValues/{enum_value_display_name\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1RenameTagTemplateFieldEnumValueRequest;
    }
    export class Resource$Projects$Locations$Taxonomies {
        context: APIRequestContext;
        policyTags: Resource$Projects$Locations$Taxonomies$Policytags;
        constructor(context: APIRequestContext);
        /**
         * Creates a taxonomy in the specified project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Taxonomies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Taxonomies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>>;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        /**
         * Deletes a taxonomy. This operation will also delete all policy tags in this taxonomy along with their associated policies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Taxonomies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Exports all taxonomies and their policy tags in a project. This method generates SerializedTaxonomy protos with nested policy tags that can be used as an input for future ImportTaxonomies calls.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Taxonomies$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Taxonomies$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse>>;
        export(params: Params$Resource$Projects$Locations$Taxonomies$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Taxonomies$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse>): void;
        export(params: Params$Resource$Projects$Locations$Taxonomies$Export, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse>): void;
        export(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ExportTaxonomiesResponse>): void;
        /**
         * Gets a taxonomy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Taxonomies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Taxonomies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>>;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        /**
         * Gets the IAM policy for a taxonomy or a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Taxonomies$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Imports all taxonomies and their policy tags to a project as new taxonomies. This method provides a bulk taxonomy / policy tag creation using nested proto structure.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Taxonomies$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Taxonomies$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse>>;
        import(params: Params$Resource$Projects$Locations$Taxonomies$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Taxonomies$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse>): void;
        import(params: Params$Resource$Projects$Locations$Taxonomies$Import, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse>): void;
        import(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesResponse>): void;
        /**
         * Lists all taxonomies in a project in a particular location that the caller has permission to view.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Taxonomies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Taxonomies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse>>;
        list(params: Params$Resource$Projects$Locations$Taxonomies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Taxonomies$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Taxonomies$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListTaxonomiesResponse>): void;
        /**
         * Updates a taxonomy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Taxonomies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>>;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1Taxonomy>): void;
        /**
         * Sets the IAM policy for a taxonomy or a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Taxonomies$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the permissions that a caller has on the specified taxonomy or policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Taxonomies$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Create extends StandardParameters {
        /**
         * Required. Resource name of the project that the taxonomy will belong to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Taxonomy;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Delete extends StandardParameters {
        /**
         * Required. Resource name of the taxonomy to be deleted. All policy tags in this taxonomy will also be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Export extends StandardParameters {
        /**
         * Required. Resource name of the project that taxonomies to be exported will share.
         */
        parent?: string;
        /**
         * Export taxonomies as serialized taxonomies.
         */
        serializedTaxonomies?: boolean;
        /**
         * Required. Resource names of the taxonomies to be exported.
         */
        taxonomies?: string[];
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Get extends StandardParameters {
        /**
         * Required. Resource name of the requested taxonomy.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Import extends StandardParameters {
        /**
         * Required. Resource name of project that the imported taxonomies will belong to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1ImportTaxonomiesRequest;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$List extends StandardParameters {
        /**
         * Supported field for filter is 'service' and value is 'dataplex'. Eg: service=dataplex.
         */
        filter?: string;
        /**
         * The maximum number of items to return. Must be a value between 1 and 1000. If not set, defaults to 50.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any. If not set, defaults to an empty string.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the project to list the taxonomies of.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of this taxonomy, whose format is: "projects/{project_number\}/locations/{location_id\}/taxonomies/{id\}".
         */
        name?: string;
        /**
         * The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If not set, defaults to all of the fields that are allowed to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1Taxonomy;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Taxonomies$Policytags {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a policy tag in the specified taxonomy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>>;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        create(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        /**
         * Deletes a policy tag. Also deletes all of its descendant policy tags.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>>;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        get(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        /**
         * Gets the IAM policy for a taxonomy or a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists all policy tags in a taxonomy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse>>;
        list(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$List, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1ListPolicyTagsResponse>): void;
        /**
         * Updates a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>>;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        patch(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatacatalogV1beta1PolicyTag>): void;
        /**
         * Sets the IAM policy for a taxonomy or a policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns the permissions that a caller has on the specified taxonomy or policy tag.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Create extends StandardParameters {
        /**
         * Required. Resource name of the taxonomy that the policy tag will belong to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1PolicyTag;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Delete extends StandardParameters {
        /**
         * Required. Resource name of the policy tag to be deleted. All of its descendant policy tags will also be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Get extends StandardParameters {
        /**
         * Required. Resource name of the requested policy tag.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$List extends StandardParameters {
        /**
         * The maximum number of items to return. Must be a value between 1 and 1000. If not set, defaults to 50.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any. If not set, defaults to an empty string.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the taxonomy to list the policy tags of.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of this policy tag, whose format is: "projects/{project_number\}/locations/{location_id\}/taxonomies/{taxonomy_id\}/policyTags/{id\}".
         */
        name?: string;
        /**
         * The update mask applies to the resource. Only display_name, description and parent_policy_tag can be updated and thus can be listed in the mask. If update_mask is not provided, all allowed fields (i.e. display_name, description and parent) will be updated. For more information including the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If not set, defaults to all of the fields that are allowed to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatacatalogV1beta1PolicyTag;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Taxonomies$Policytags$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export {};
}
