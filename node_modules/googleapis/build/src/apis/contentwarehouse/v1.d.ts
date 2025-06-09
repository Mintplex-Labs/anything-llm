import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace contentwarehouse_v1 {
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
     * Document AI Warehouse API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const contentwarehouse = google.contentwarehouse('v1');
     * ```
     */
    export class Contentwarehouse {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The identity to configure a CloudSQL instance provisioned via SLM Terraform.
     */
    export interface Schema$CloudAiPlatformTenantresourceCloudSqlInstanceConfig {
        /**
         * Output only. The CloudSQL instance connection name.
         */
        cloudSqlInstanceConnectionName?: string | null;
        /**
         * Input/Output [Optional]. The CloudSQL instance name within SLM instance. If not set, a random UUIC will be generated as instance name.
         */
        cloudSqlInstanceName?: string | null;
        /**
         * Input [Optional]. The KMS key name or the KMS grant name used for CMEK encryption. Only set this field when provisioning new CloudSQL instances. For existing CloudSQL instances, this field will be ignored because CMEK re-encryption is not supported.
         */
        kmsKeyReference?: string | null;
        /**
         * Input [Optional]. MDB roles for corp access to CloudSQL instance.
         */
        mdbRolesForCorpAccess?: string[] | null;
        /**
         * Output only. The SLM instance's full resource name.
         */
        slmInstanceName?: string | null;
        /**
         * Input [Required]. The SLM instance template to provision CloudSQL.
         */
        slmInstanceTemplate?: string | null;
        /**
         * Input [Required]. The SLM instance type to provision CloudSQL.
         */
        slmInstanceType?: string | null;
    }
    /**
     * The identity to configure a GCS bucket.
     */
    export interface Schema$CloudAiPlatformTenantresourceGcsBucketConfig {
        admins?: string[] | null;
        /**
         * Input/Output [Optional]. The name of a GCS bucket with max length of 63 chars. If not set, a random UUID will be generated as bucket name.
         */
        bucketName?: string | null;
        /**
         * Input/Output [Optional]. Only needed for per-entity tenant GCP resources. During Deprovision API, the on-demand deletion will only cover the tenant GCP resources with the specified entity name.
         */
        entityName?: string | null;
        /**
         * Input/Output [Optional]. The KMS key name or the KMS grant name used for CMEK encryption. Only set this field when provisioning new GCS bucket. For existing GCS bucket, this field will be ignored because CMEK re-encryption is not supported.
         */
        kmsKeyReference?: string | null;
        /**
         * Input/Output [Optional]. Only needed when the content in bucket need to be garbage collected within some amount of days.
         */
        ttlDays?: number | null;
        /**
         * Input/Output [Required]. IAM roles (viewer/admin) put on the bucket.
         */
        viewers?: string[] | null;
    }
    /**
     * The dynamic IAM bindings to be granted after tenant projects are created.
     */
    export interface Schema$CloudAiPlatformTenantresourceIamPolicyBinding {
        /**
         * Input/Output [Required]. The member service accounts with the roles above. Note: placeholders are same as the resource above.
         */
        members?: string[] | null;
        /**
         * Input/Output [Required]. The resource name that will be accessed by members, which also depends on resource_type. Note: placeholders are supported in resource names. For example, ${tpn\} will be used when the tenant project number is not ready.
         */
        resource?: string | null;
        /**
         * Input/Output [Required]. Specifies the type of resource that will be accessed by members.
         */
        resourceType?: string | null;
        /**
         * Input/Output [Required]. The role for members below.
         */
        role?: string | null;
    }
    /**
     * The configuration for a spanner database provisioning. Next ID: 8
     */
    export interface Schema$CloudAiPlatformTenantresourceInfraSpannerConfig {
        /**
         * Input [Optional]. The options to create a spanner database. Note: give the right options to ensure the right KMS key access audit logging and AxT logging in expected logging category.
         */
        createDatabaseOptions?: Schema$CloudAiPlatformTenantresourceInfraSpannerConfigCreateDatabaseOptions;
        /**
         * Input [Optional]. The KMS key name or the KMS grant name used for CMEK encryption. Only set this field when provisioning new Infra Spanner databases. For existing Infra Spanner databases, this field will be ignored because CMEK re-encryption is not supported. For example, projects//locations//keyRings//cryptoKeys/
         */
        kmsKeyReference?: string | null;
        /**
         * Input [Required]. The file path to the spanner SDL bundle.
         */
        sdlBundlePath?: string | null;
        /**
         * Input [Optional]. The spanner borg service account for delegating the kms key to. For example, spanner-infra-cmek-nonprod@system.gserviceaccount.com, for the nonprod universe.
         */
        spannerBorgServiceAccount?: string | null;
        spannerLocalNamePrefix?: string | null;
        spannerNamespace?: string | null;
        /**
         * Input [Required]. Every database in Spanner can be identified by the following path name: /span//:
         */
        spannerUniverse?: string | null;
    }
    /**
     * The options to create a spanner database. KMS key access audit logging and AxT logging will be associated with the given resource name, resource type and service name. Please ensure to give right options to enable correct audit logging and AxT logging.
     */
    export interface Schema$CloudAiPlatformTenantresourceInfraSpannerConfigCreateDatabaseOptions {
        /**
         * The cloud resource name for the CMEK encryption. For example, projects//locations/
         */
        cmekCloudResourceName?: string | null;
        /**
         * The cloud resource type for the CMEK encryption. For example, contentwarehouse.googleapis.com/Location
         */
        cmekCloudResourceType?: string | null;
        /**
         * The service name for the CMEK encryption. For example, contentwarehouse.googleapis.com
         */
        cmekServiceName?: string | null;
    }
    /**
     * The identity to configure a service account.
     */
    export interface Schema$CloudAiPlatformTenantresourceServiceAccountIdentity {
        /**
         * Output only. The service account email that has been created.
         */
        serviceAccountEmail?: string | null;
        /**
         * Input/Output [Optional]. The tag that configures the service account, as defined in google3/configs/production/cdpush/acl-zanzibar-cloud-prod/activation_grants/activation_grants.gcl. Note: The default P4 service account has the empty tag.
         */
        tag?: string | null;
    }
    /**
     * The identity to configure a tenant project.
     */
    export interface Schema$CloudAiPlatformTenantresourceTenantProjectConfig {
        /**
         * Input/Output [Required]. The billing account properties to create the tenant project.
         */
        billingConfig?: Schema$GoogleApiServiceconsumermanagementV1BillingConfig;
        /**
         * Input/Output [Required]. The folder that holds tenant projects and folder-level permissions will be automatically granted to all tenant projects under the folder. Note: the valid folder format is `folders/{folder_number\}`.
         */
        folder?: string | null;
        /**
         * Input/Output [Required]. The policy bindings that are applied to the tenant project during creation. At least one binding must have the role `roles/owner` with either `user` or `group` type.
         */
        policyBindings?: Schema$GoogleApiServiceconsumermanagementV1PolicyBinding[];
        /**
         * Input/Output [Required]. The API services that are enabled on the tenant project during creation.
         */
        services?: string[] | null;
    }
    /**
     * The tenant project and tenant resources. Next ID: 10
     */
    export interface Schema$CloudAiPlatformTenantresourceTenantProjectResource {
        /**
         * The CloudSQL instances that are provisioned under the tenant project.
         */
        cloudSqlInstances?: Schema$CloudAiPlatformTenantresourceCloudSqlInstanceConfig[];
        /**
         * The GCS buckets that are provisioned under the tenant project.
         */
        gcsBuckets?: Schema$CloudAiPlatformTenantresourceGcsBucketConfig[];
        /**
         * The dynamic IAM bindings that are granted under the tenant project. Note: this should only add new bindings to the project if they don't exist and the existing bindings won't be affected.
         */
        iamPolicyBindings?: Schema$CloudAiPlatformTenantresourceIamPolicyBinding[];
        /**
         * The Infra Spanner databases that are provisioned under the tenant project. Note: this is an experimental feature.
         */
        infraSpannerConfigs?: Schema$CloudAiPlatformTenantresourceInfraSpannerConfig[];
        /**
         * Input/Output [Required]. The tag that uniquely identifies a tenant project within a tenancy unit. Note: for the same tenant project tag, all tenant manager operations should be idempotent.
         */
        tag?: string | null;
        /**
         * The configurations of a tenant project.
         */
        tenantProjectConfig?: Schema$CloudAiPlatformTenantresourceTenantProjectConfig;
        /**
         * Output only. The tenant project ID that has been created.
         */
        tenantProjectId?: string | null;
        /**
         * Output only. The tenant project number that has been created.
         */
        tenantProjectNumber?: string | null;
        /**
         * The service account identities (or enabled API service's P4SA) that are expclicitly created under the tenant project (before JIT provisioning during enabled API services).
         */
        tenantServiceAccounts?: Schema$CloudAiPlatformTenantresourceTenantServiceAccountIdentity[];
    }
    /**
     * A collection of tenant resources.
     */
    export interface Schema$CloudAiPlatformTenantresourceTenantResource {
        /**
         * A list of P4 service accounts (go/p4sa) to provision or deprovision.
         */
        p4ServiceAccounts?: Schema$CloudAiPlatformTenantresourceServiceAccountIdentity[];
        /**
         * A list of tenant projects and tenant resources to provision or deprovision.
         */
        tenantProjectResources?: Schema$CloudAiPlatformTenantresourceTenantProjectResource[];
    }
    /**
     * The identity of service accounts that have been explicitly created under tenant projects.
     */
    export interface Schema$CloudAiPlatformTenantresourceTenantServiceAccountIdentity {
        /**
         * Output only. The email address of the generated service account.
         */
        serviceAccountEmail?: string | null;
        /**
         * Input/Output [Required]. The service that the service account belongs to. (e.g. cloudbuild.googleapis.com for GCB service accounts)
         */
        serviceName?: string | null;
    }
    /**
     * Describes the billing configuration for a new tenant project.
     */
    export interface Schema$GoogleApiServiceconsumermanagementV1BillingConfig {
        /**
         * Name of the billing account. For example `billingAccounts/012345-567890-ABCDEF`.
         */
        billingAccount?: string | null;
    }
    /**
     * Translates to IAM Policy bindings (without auditing at this level)
     */
    export interface Schema$GoogleApiServiceconsumermanagementV1PolicyBinding {
        /**
         * Uses the same format as in IAM policy. `member` must include both a prefix and ID. For example, `user:{emailId\}`, `serviceAccount:{emailId\}`, `group:{emailId\}`.
         */
        members?: string[] | null;
        /**
         * Role. (https://cloud.google.com/iam/docs/understanding-roles) For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
         */
        role?: string | null;
    }
    /**
     * Represents the action responsible for access control list management operations.
     */
    export interface Schema$GoogleCloudContentwarehouseV1AccessControlAction {
        /**
         * Identifies the type of operation.
         */
        operationType?: string | null;
        /**
         * Represents the new policy from which bindings are added, removed or replaced based on the type of the operation. the policy is limited to a few 10s of KB.
         */
        policy?: Schema$GoogleIamV1Policy;
    }
    /**
     * Represents the action triggered by Rule Engine when the rule is true.
     */
    export interface Schema$GoogleCloudContentwarehouseV1Action {
        /**
         * Action triggering access control operations.
         */
        accessControl?: Schema$GoogleCloudContentwarehouseV1AccessControlAction;
        /**
         * ID of the action. Managed internally.
         */
        actionId?: string | null;
        /**
         * Action triggering create document link operation.
         */
        addToFolder?: Schema$GoogleCloudContentwarehouseV1AddToFolderAction;
        /**
         * Action triggering data update operations.
         */
        dataUpdate?: Schema$GoogleCloudContentwarehouseV1DataUpdateAction;
        /**
         * Action triggering data validation operations.
         */
        dataValidation?: Schema$GoogleCloudContentwarehouseV1DataValidationAction;
        /**
         * Action deleting the document.
         */
        deleteDocumentAction?: Schema$GoogleCloudContentwarehouseV1DeleteDocumentAction;
        /**
         * Action publish to Pub/Sub operation.
         */
        publishToPubSub?: Schema$GoogleCloudContentwarehouseV1PublishAction;
        /**
         * Action removing a document from a folder.
         */
        removeFromFolderAction?: Schema$GoogleCloudContentwarehouseV1RemoveFromFolderAction;
    }
    /**
     * Represents the output of the Action Executor.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ActionExecutorOutput {
        /**
         * List of rule and corresponding actions result.
         */
        ruleActionsPairs?: Schema$GoogleCloudContentwarehouseV1RuleActionsPair[];
    }
    /**
     * Represents the result of executing an action.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ActionOutput {
        /**
         * ID of the action.
         */
        actionId?: string | null;
        /**
         * State of an action.
         */
        actionState?: string | null;
        /**
         * Action execution output message.
         */
        outputMessage?: string | null;
    }
    /**
     * Represents the action responsible for adding document under a folder.
     */
    export interface Schema$GoogleCloudContentwarehouseV1AddToFolderAction {
        /**
         * Names of the folder under which new document is to be added. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        folders?: string[] | null;
    }
    /**
     * Metadata object for CreateDocument request (currently empty).
     */
    export interface Schema$GoogleCloudContentwarehouseV1beta1CreateDocumentMetadata {
    }
    /**
     * Response message for projectService.InitializeProject
     */
    export interface Schema$GoogleCloudContentwarehouseV1beta1InitializeProjectResponse {
        /**
         * The message of the project initialization process.
         */
        message?: string | null;
        /**
         * The state of the project initialization process.
         */
        state?: string | null;
    }
    /**
     * Metadata object for UpdateDocument request (currently empty).
     */
    export interface Schema$GoogleCloudContentwarehouseV1beta1UpdateDocumentMetadata {
    }
    /**
     * Request Option for processing Cloud AI Document in CW Document.
     */
    export interface Schema$GoogleCloudContentwarehouseV1CloudAIDocumentOption {
        /**
         * If set, only selected entities will be converted to properties.
         */
        customizedEntitiesPropertiesConversions?: {
            [key: string]: string;
        } | null;
        /**
         * Whether to convert all the entities to properties.
         */
        enableEntitiesConversions?: boolean | null;
    }
    /**
     * Request message for DocumentLinkService.CreateDocumentLink.
     */
    export interface Schema$GoogleCloudContentwarehouseV1CreateDocumentLinkRequest {
        /**
         * Required. Document links associated with the source documents (source_document_id).
         */
        documentLink?: Schema$GoogleCloudContentwarehouseV1DocumentLink;
        /**
         * The meta information collected about the document creator, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Metadata object for CreateDocument request (currently empty).
     */
    export interface Schema$GoogleCloudContentwarehouseV1CreateDocumentMetadata {
    }
    /**
     * Request message for DocumentService.CreateDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1CreateDocumentRequest {
        /**
         * Request Option for processing Cloud AI Document in Document Warehouse. This field offers limited support for mapping entities from Cloud AI Document to Warehouse Document. Please consult with product team before using this field and other available options.
         */
        cloudAiDocumentOption?: Schema$GoogleCloudContentwarehouseV1CloudAIDocumentOption;
        /**
         * Field mask for creating Document fields. If mask path is empty, it means all fields are masked. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask.
         */
        createMask?: string | null;
        /**
         * Required. The document to create.
         */
        document?: Schema$GoogleCloudContentwarehouseV1Document;
        /**
         * Default document policy during creation. This refers to an Identity and Access (IAM) policy, which specifies access controls for the Document. Conditions defined in the policy will be ignored.
         */
        policy?: Schema$GoogleIamV1Policy;
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Response message for DocumentService.CreateDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse {
        /**
         * Document created after executing create request.
         */
        document?: Schema$GoogleCloudContentwarehouseV1Document;
        /**
         * post-processing LROs
         */
        longRunningOperations?: Schema$GoogleLongrunningOperation[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$GoogleCloudContentwarehouseV1ResponseMetadata;
        /**
         * Output from Rule Engine recording the rule evaluator and action executor's output. Refer format in: google/cloud/contentwarehouse/v1/rule_engine.proto
         */
        ruleEngineOutput?: Schema$GoogleCloudContentwarehouseV1RuleEngineOutput;
    }
    /**
     * To support the custom weighting across document schemas.
     */
    export interface Schema$GoogleCloudContentwarehouseV1CustomWeightsMetadata {
        /**
         * List of schema and property name. Allows a maximum of 10 schemas to be specified for relevance boosting.
         */
        weightedSchemaProperties?: Schema$GoogleCloudContentwarehouseV1WeightedSchemaProperty[];
    }
    /**
     * Represents the action responsible for properties update operations.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DataUpdateAction {
        /**
         * Map of (K, V) -\> (valid name of the field, new value of the field) E.g., ("age", "60") entry triggers update of field age with a value of 60. If the field is not present then new entry is added. During update action execution, value strings will be casted to appropriate types.
         */
        entries?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Represents the action responsible for data validation operations.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DataValidationAction {
        /**
         * Map of (K, V) -\> (field, string condition to be evaluated on the field) E.g., ("age", "age \> 18 && age < 60") entry triggers validation of field age with the given condition. Map entries will be ANDed during validation.
         */
        conditions?: {
            [key: string]: string;
        } | null;
    }
    /**
     * DateTime values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DateTimeArray {
        /**
         * List of datetime values. Both OffsetDateTime and ZonedDateTime are supported.
         */
        values?: Schema$GoogleTypeDateTime[];
    }
    /**
     * Configurations for a date time property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DateTimeTypeOptions {
    }
    /**
     * Represents the action responsible for deleting the document.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DeleteDocumentAction {
        /**
         * Boolean field to select between hard vs soft delete options. Set 'true' for 'hard delete' and 'false' for 'soft delete'.
         */
        enableHardDelete?: boolean | null;
    }
    /**
     * Request message for DocumentLinkService.DeleteDocumentLink.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DeleteDocumentLinkRequest {
        /**
         * The meta information collected about the document creator, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Request message for DocumentService.DeleteDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DeleteDocumentRequest {
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Defines the structure for content warehouse document proto.
     */
    export interface Schema$GoogleCloudContentwarehouseV1Document {
        /**
         * Document AI format to save the structured content, including OCR.
         */
        cloudAiDocument?: Schema$GoogleCloudDocumentaiV1Document;
        /**
         * Indicates the category (image, audio, video etc.) of the original content.
         */
        contentCategory?: string | null;
        /**
         * Output only. The time when the document is created.
         */
        createTime?: string | null;
        /**
         * The user who creates the document.
         */
        creator?: string | null;
        /**
         * Required. Display name of the document given by the user. This name will be displayed in the UI. Customer can populate this field with the name of the document. This differs from the 'title' field as 'title' is optional and stores the top heading in the document.
         */
        displayName?: string | null;
        /**
         * Uri to display the document, for example, in the UI.
         */
        displayUri?: string | null;
        /**
         * Output only. If linked to a Collection with RetentionPolicy, the date when the document becomes mutable.
         */
        dispositionTime?: string | null;
        /**
         * The Document schema name. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        documentSchemaName?: string | null;
        /**
         * Raw document content.
         */
        inlineRawDocument?: string | null;
        /**
         * Output only. Indicates if the document has a legal hold on it.
         */
        legalHold?: boolean | null;
        /**
         * The resource name of the document. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}. The name is ignored when creating a document.
         */
        name?: string | null;
        /**
         * Other document format, such as PPTX, XLXS
         */
        plainText?: string | null;
        /**
         * List of values that are user supplied metadata.
         */
        properties?: Schema$GoogleCloudContentwarehouseV1Property[];
        /**
         * This is used when DocAI was not used to load the document and parsing/ extracting is needed for the inline_raw_document. For example, if inline_raw_document is the byte representation of a PDF file, then this should be set to: RAW_DOCUMENT_FILE_TYPE_PDF.
         */
        rawDocumentFileType?: string | null;
        /**
         * Raw document file in Cloud Storage path.
         */
        rawDocumentPath?: string | null;
        /**
         * The reference ID set by customers. Must be unique per project and location.
         */
        referenceId?: string | null;
        /**
         * If true, text extraction will not be performed.
         */
        textExtractionDisabled?: boolean | null;
        /**
         * If true, text extraction will be performed.
         */
        textExtractionEnabled?: boolean | null;
        /**
         * Title that describes the document. This can be the top heading or text that describes the document.
         */
        title?: string | null;
        /**
         * The user who lastly updates the document.
         */
        updater?: string | null;
        /**
         * Output only. The time when the document is last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A document-link between source and target document.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DocumentLink {
        /**
         * Output only. The time when the documentLink is created.
         */
        createTime?: string | null;
        /**
         * Description of this document-link.
         */
        description?: string | null;
        /**
         * Name of this document-link. It is required that the parent derived form the name to be consistent with the source document reference. Otherwise an exception will be thrown. Format: projects/{project_number\}/locations/{location\}/documents/{source_document_id\}/documentLinks/{document_link_id\}.
         */
        name?: string | null;
        /**
         * Document references of the source document.
         */
        sourceDocumentReference?: Schema$GoogleCloudContentwarehouseV1DocumentReference;
        /**
         * The state of the documentlink. If target node has been deleted, the link is marked as invalid. Removing a source node will result in removal of all associated links.
         */
        state?: string | null;
        /**
         * Document references of the target document.
         */
        targetDocumentReference?: Schema$GoogleCloudContentwarehouseV1DocumentReference;
        /**
         * Output only. The time when the documentLink is last updated.
         */
        updateTime?: string | null;
    }
    export interface Schema$GoogleCloudContentwarehouseV1DocumentQuery {
        /**
         * This filter specifies a structured syntax to match against the [PropertyDefinition].is_filterable marked as `true`. The syntax for this expression is a subset of SQL syntax. Supported operators are: `=`, `!=`, `<`, `<=`, `\>`, and `\>=` where the left of the operator is a property name and the right of the operator is a number or a quoted string. You must escape backslash (\\) and quote (\") characters. Supported functions are `LOWER([property_name])` to perform a case insensitive match and `EMPTY([property_name])` to filter on the existence of a key. Boolean expressions (AND/OR/NOT) are supported up to 3 levels of nesting (for example, "((A AND B AND C) OR NOT D) AND E"), a maximum of 100 comparisons or functions are allowed in the expression. The expression must be < 6000 bytes in length. Sample Query: `(LOWER(driving_license)="class \"a\"" OR EMPTY(driving_license)) AND driving_years \> 10`
         */
        customPropertyFilter?: string | null;
        /**
         * To support the custom weighting across document schemas, customers need to provide the properties to be used to boost the ranking in the search request. For a search query with CustomWeightsMetadata specified, only the RetrievalImportance for the properties in the CustomWeightsMetadata will be honored.
         */
        customWeightsMetadata?: Schema$GoogleCloudContentwarehouseV1CustomWeightsMetadata;
        /**
         * The exact creator(s) of the documents to search against. If a value isn't specified, documents within the search results are associated with any creator. If multiple values are specified, documents within the search results may be associated with any of the specified creators.
         */
        documentCreatorFilter?: string[] | null;
        /**
         * Search the documents in the list. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        documentNameFilter?: string[] | null;
        /**
         * This filter specifies the exact document schema Document.document_schema_name of the documents to search against. If a value isn't specified, documents within the search results are associated with any schema. If multiple values are specified, documents within the search results may be associated with any of the specified schemas. At most 20 document schema names are allowed.
         */
        documentSchemaNames?: string[] | null;
        /**
         * This filter specifies the types of files to return: ALL, FOLDER, or FILE. If FOLDER or FILE is specified, then only either folders or files will be returned, respectively. If ALL is specified, both folders and files will be returned. If no value is specified, ALL files will be returned.
         */
        fileTypeFilter?: Schema$GoogleCloudContentwarehouseV1FileTypeFilter;
        /**
         * Search all the documents under this specified folder. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        folderNameFilter?: string | null;
        /**
         * Experimental, do not use. If the query is a natural language question. False by default. If true, then the question-answering feature will be used instead of search, and `result_count` in SearchDocumentsRequest must be set. In addition, all other input fields related to search (pagination, histograms, etc.) will be ignored.
         */
        isNlQuery?: boolean | null;
        /**
         * This filter specifies a structured syntax to match against the PropertyDefinition.is_filterable marked as `true`. The relationship between the PropertyFilters is OR.
         */
        propertyFilter?: Schema$GoogleCloudContentwarehouseV1PropertyFilter[];
        /**
         * The query string that matches against the full text of the document and the searchable properties. The query partially supports [Google AIP style syntax](https://google.aip.dev/160). Specifically, the query supports literals, logical operators, negation operators, comparison operators, and functions. Literals: A bare literal value (examples: "42", "Hugo") is a value to be matched against. It searches over the full text of the document and the searchable properties. Logical operators: "AND", "and", "OR", and "or" are binary logical operators (example: "engineer OR developer"). Negation operators: "NOT" and "!" are negation operators (example: "NOT software"). Comparison operators: support the binary comparison operators =, !=, <, \>, <= and \>= for string, numeric, enum, boolean. Also support like operator `~~` for string. It provides semantic search functionality by parsing, stemming and doing synonyms expansion against the input query. To specify a property in the query, the left hand side expression in the comparison must be the property ID including the parent. The right hand side must be literals. For example: "\"projects/123/locations/us\".property_a < 1" matches results whose "property_a" is less than 1 in project 123 and us location. The literals and comparison expression can be connected in a single query (example: "software engineer \"projects/123/locations/us\".salary \> 100"). Functions: supported functions are `LOWER([property_name])` to perform a case insensitive match and `EMPTY([property_name])` to filter on the existence of a key. Support nested expressions connected using parenthesis and logical operators. The default logical operators is `AND` if there is no operators between expressions. The query can be used with other filters e.g. `time_filters` and `folder_name_filter`. They are connected with `AND` operator under the hood. The maximum number of allowed characters is 255.
         */
        query?: string | null;
        /**
         * For custom synonyms. Customers provide the synonyms based on context. One customer can provide multiple set of synonyms based on different context. The search query will be expanded based on the custom synonyms of the query context set. By default, no custom synonyms wll be applied if no query context is provided. It is not supported for CMEK compliant deployment.
         */
        queryContext?: string[] | null;
        /**
         * Documents created/updated within a range specified by this filter are searched against.
         */
        timeFilters?: Schema$GoogleCloudContentwarehouseV1TimeFilter[];
    }
    /**
     * References to the documents.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DocumentReference {
        /**
         * Output only. The time when the document is created.
         */
        createTime?: string | null;
        /**
         * Output only. The time when the document is deleted.
         */
        deleteTime?: string | null;
        /**
         * display_name of the referenced document; this name does not need to be consistent to the display_name in the Document proto, depending on the ACL constraint.
         */
        displayName?: string | null;
        /**
         * The document type of the document being referenced.
         */
        documentIsFolder?: boolean | null;
        /**
         * Document is a folder with legal hold.
         */
        documentIsLegalHoldFolder?: boolean | null;
        /**
         * Document is a folder with retention policy.
         */
        documentIsRetentionFolder?: boolean | null;
        /**
         * Required. Name of the referenced document.
         */
        documentName?: string | null;
        /**
         * Stores the subset of the referenced document's content. This is useful to allow user peek the information of the referenced document.
         */
        snippet?: string | null;
        /**
         * Output only. The time when the document is last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A document schema used to define document structure.
     */
    export interface Schema$GoogleCloudContentwarehouseV1DocumentSchema {
        /**
         * Output only. The time when the document schema is created.
         */
        createTime?: string | null;
        /**
         * Schema description.
         */
        description?: string | null;
        /**
         * Required. Name of the schema given by the user. Must be unique per project.
         */
        displayName?: string | null;
        /**
         * Document Type, true refers the document is a folder, otherwise it is a typical document.
         */
        documentIsFolder?: boolean | null;
        /**
         * The resource name of the document schema. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}. The name is ignored when creating a document schema.
         */
        name?: string | null;
        /**
         * Document details.
         */
        propertyDefinitions?: Schema$GoogleCloudContentwarehouseV1PropertyDefinition[];
        /**
         * Output only. The time when the document schema is last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Enum values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1EnumArray {
        /**
         * List of enum values.
         */
        values?: string[] | null;
    }
    /**
     * Configurations for an enum/categorical property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1EnumTypeOptions {
        /**
         * Required. List of possible enum values.
         */
        possibleValues?: string[] | null;
        /**
         * Make sure the Enum property value provided in the document is in the possile value list during document creation. The validation check runs by default.
         */
        validationCheckDisabled?: boolean | null;
    }
    /**
     * Represents the string value of the enum field.
     */
    export interface Schema$GoogleCloudContentwarehouseV1EnumValue {
        /**
         * String value of the enum field. This must match defined set of enums in document schema using EnumTypeOptions.
         */
        value?: string | null;
    }
    /**
     * The configuration of exporting documents from the Document Warehouse to CDW pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ExportToCdwPipeline {
        /**
         * Optional. The CDW dataset resource name. This field is optional. If not set, the documents will be exported to Cloud Storage only. Format: projects/{project\}/locations/{location\}/processors/{processor\}/dataset
         */
        docAiDataset?: string | null;
        /**
         * The list of all the resource names of the documents to be processed. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        documents?: string[] | null;
        /**
         * The Cloud Storage folder path used to store the exported documents before being sent to CDW. Format: `gs:///`.
         */
        exportFolderPath?: string | null;
        /**
         * Ratio of training dataset split. When importing into Document AI Workbench, documents will be automatically split into training and test split category with the specified ratio. This field is required if doc_ai_dataset is set.
         */
        trainingSplitRatio?: number | null;
    }
    /**
     * Request message for DocumentService.FetchAcl
     */
    export interface Schema$GoogleCloudContentwarehouseV1FetchAclRequest {
        /**
         * For Get Project ACL only. Authorization check for end user will be ignored when project_owner=true.
         */
        projectOwner?: boolean | null;
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Response message for DocumentService.FetchAcl.
     */
    export interface Schema$GoogleCloudContentwarehouseV1FetchAclResponse {
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$GoogleCloudContentwarehouseV1ResponseMetadata;
        /**
         * The IAM policy.
         */
        policy?: Schema$GoogleIamV1Policy;
    }
    /**
     * Filter for the specific types of documents returned.
     */
    export interface Schema$GoogleCloudContentwarehouseV1FileTypeFilter {
        /**
         * The type of files to return.
         */
        fileType?: string | null;
    }
    /**
     * Float values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1FloatArray {
        /**
         * List of float values.
         */
        values?: number[] | null;
    }
    /**
     * Configurations for a float property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1FloatTypeOptions {
    }
    /**
     * The configuration of the Cloud Storage Ingestion pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1GcsIngestPipeline {
        /**
         * The input Cloud Storage folder. All files under this folder will be imported to Document Warehouse. Format: `gs:///`.
         */
        inputPath?: string | null;
        /**
         * Optional. The config for the Cloud Storage Ingestion pipeline. It provides additional customization options to run the pipeline and can be skipped if it is not applicable.
         */
        pipelineConfig?: Schema$GoogleCloudContentwarehouseV1IngestPipelineConfig;
        /**
         * The Doc AI processor type name. Only used when the format of ingested files is Doc AI Document proto format.
         */
        processorType?: string | null;
        /**
         * The Document Warehouse schema resource name. All documents processed by this pipeline will use this schema. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        schemaName?: string | null;
        /**
         * The flag whether to skip ingested documents. If it is set to true, documents in Cloud Storage contains key "status" with value "status=ingested" in custom metadata will be skipped to ingest.
         */
        skipIngestedDocuments?: boolean | null;
    }
    /**
     * The configuration of the Cloud Storage Ingestion with DocAI Processors pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1GcsIngestWithDocAiProcessorsPipeline {
        /**
         * The extract processors information. One matched extract processor will be used to process documents based on the classify processor result. If no classify processor is specified, the first extract processor will be used.
         */
        extractProcessorInfos?: Schema$GoogleCloudContentwarehouseV1ProcessorInfo[];
        /**
         * The input Cloud Storage folder. All files under this folder will be imported to Document Warehouse. Format: `gs:///`.
         */
        inputPath?: string | null;
        /**
         * Optional. The config for the Cloud Storage Ingestion with DocAI Processors pipeline. It provides additional customization options to run the pipeline and can be skipped if it is not applicable.
         */
        pipelineConfig?: Schema$GoogleCloudContentwarehouseV1IngestPipelineConfig;
        /**
         * The Cloud Storage folder path used to store the raw results from processors. Format: `gs:///`.
         */
        processorResultsFolderPath?: string | null;
        /**
         * The flag whether to skip ingested documents. If it is set to true, documents in Cloud Storage contains key "status" with value "status=ingested" in custom metadata will be skipped to ingest.
         */
        skipIngestedDocuments?: boolean | null;
        /**
         * The split and classify processor information. The split and classify result will be used to find a matched extract processor.
         */
        splitClassifyProcessorInfo?: Schema$GoogleCloudContentwarehouseV1ProcessorInfo;
    }
    /**
     * Request message for DocumentService.GetDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1GetDocumentRequest {
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * The histogram request.
     */
    export interface Schema$GoogleCloudContentwarehouseV1HistogramQuery {
        /**
         * Optional. Filter the result of histogram query by the property names. It only works with histogram query count('FilterableProperties'). It is an optional. It will perform histogram on all the property names for all the document schemas. Setting this field will have a better performance.
         */
        filters?: Schema$GoogleCloudContentwarehouseV1HistogramQueryPropertyNameFilter;
        /**
         * An expression specifies a histogram request against matching documents for searches. See SearchDocumentsRequest.histogram_queries for details about syntax.
         */
        histogramQuery?: string | null;
        /**
         * Controls if the histogram query requires the return of a precise count. Enable this flag may adversely impact performance. Defaults to true.
         */
        requirePreciseResultSize?: boolean | null;
    }
    export interface Schema$GoogleCloudContentwarehouseV1HistogramQueryPropertyNameFilter {
        /**
         * This filter specifies the exact document schema(s) Document.document_schema_name to run histogram query against. It is optional. It will perform histogram for property names for all the document schemas if it is not set. At most 10 document schema names are allowed. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        documentSchemas?: string[] | null;
        /**
         * It is optional. It will perform histogram for all the property names if it is not set. The properties need to be defined with the is_filterable flag set to true and the name of the property should be in the format: "schemaId.propertyName". The property needs to be defined in the schema. Example: the schema id is abc. Then the name of property for property MORTGAGE_TYPE will be "abc.MORTGAGE_TYPE".
         */
        propertyNames?: string[] | null;
        /**
         * By default, the y_axis is HISTOGRAM_YAXIS_DOCUMENT if this field is not set.
         */
        yAxis?: string | null;
    }
    /**
     * Histogram result that matches HistogramQuery specified in searches.
     */
    export interface Schema$GoogleCloudContentwarehouseV1HistogramQueryResult {
        /**
         * A map from the values of the facet associated with distinct values to the number of matching entries with corresponding value. The key format is: * (for string histogram) string values stored in the field.
         */
        histogram?: {
            [key: string]: string;
        } | null;
        /**
         * Requested histogram expression.
         */
        histogramQuery?: string | null;
    }
    /**
     * The ingestion pipeline config.
     */
    export interface Schema$GoogleCloudContentwarehouseV1IngestPipelineConfig {
        /**
         * The Cloud Function resource name. The Cloud Function needs to live inside consumer project and is accessible to Document AI Warehouse P4SA. Only Cloud Functions V2 is supported. Cloud function execution should complete within 5 minutes or this file ingestion may fail due to timeout. Format: `https://{region\}-{project_id\}.cloudfunctions.net/{cloud_function\}` The following keys are available the request json payload. * display_name * properties * plain_text * reference_id * document_schema_name * raw_document_path * raw_document_file_type The following keys from the cloud function json response payload will be ingested to the Document AI Warehouse as part of Document proto content and/or related information. The original values will be overridden if any key is present in the response. * display_name * properties * plain_text * document_acl_policy * folder
         */
        cloudFunction?: string | null;
        /**
         * The document level acl policy config. This refers to an Identity and Access (IAM) policy, which specifies access controls for all documents ingested by the pipeline. The role and members under the policy needs to be specified. The following roles are supported for document level acl control: * roles/contentwarehouse.documentAdmin * roles/contentwarehouse.documentEditor * roles/contentwarehouse.documentViewer The following members are supported for document level acl control: * user:user-email@example.com * group:group-email@example.com Note that for documents searched with LLM, only single level user or group acl check is supported.
         */
        documentAclPolicy?: Schema$GoogleIamV1Policy;
        /**
         * The document text extraction enabled flag. If the flag is set to true, DWH will perform text extraction on the raw document.
         */
        enableDocumentTextExtraction?: boolean | null;
        /**
         * Optional. The name of the folder to which all ingested documents will be linked during ingestion process. Format is `projects/{project\}/locations/{location\}/documents/{folder_id\}`
         */
        folder?: string | null;
    }
    /**
     * Request message for projectService.InitializeProject
     */
    export interface Schema$GoogleCloudContentwarehouseV1InitializeProjectRequest {
        /**
         * Required. The access control mode for accessing the customer data
         */
        accessControlMode?: string | null;
        /**
         * Required. The type of database used to store customer data
         */
        databaseType?: string | null;
        /**
         * Optional. The default role for the person who create a document.
         */
        documentCreatorDefaultRole?: string | null;
        /**
         * Optional. Whether to enable CAL user email logging.
         */
        enableCalUserEmailLogging?: boolean | null;
        /**
         * Optional. The KMS key used for CMEK encryption. It is required that the kms key is in the same region as the endpoint. The same key will be used for all provisioned resources, if encryption is available. If the kms_key is left empty, no encryption will be enforced.
         */
        kmsKey?: string | null;
    }
    /**
     * Response message for projectService.InitializeProject
     */
    export interface Schema$GoogleCloudContentwarehouseV1InitializeProjectResponse {
        /**
         * The message of the project initialization process.
         */
        message?: string | null;
        /**
         * The state of the project initialization process.
         */
        state?: string | null;
    }
    /**
     * Integer values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1IntegerArray {
        /**
         * List of integer values.
         */
        values?: number[] | null;
    }
    /**
     * Configurations for an integer property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1IntegerTypeOptions {
    }
    /**
     * A triggered rule that failed the validation check(s) after parsing.
     */
    export interface Schema$GoogleCloudContentwarehouseV1InvalidRule {
        /**
         * Validation error on a parsed expression.
         */
        error?: string | null;
        /**
         * Triggered rule.
         */
        rule?: Schema$GoogleCloudContentwarehouseV1Rule;
    }
    /**
     * Response message for DocumentSchemaService.ListDocumentSchemas.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse {
        /**
         * The document schemas from the specified parent.
         */
        documentSchemas?: Schema$GoogleCloudContentwarehouseV1DocumentSchema[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for DocumentLinkService.ListLinkedSources.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesRequest {
        /**
         * The maximum number of document-links to return. The service may return fewer than this value. If unspecified, at most 50 document-links will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number | null;
        /**
         * A page token, received from a previous `ListLinkedSources` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListLinkedSources` must match the call that provided the page token.
         */
        pageToken?: string | null;
        /**
         * The meta information collected about the document creator, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Response message for DocumentLinkService.ListLinkedSources.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse {
        /**
         * Source document-links.
         */
        documentLinks?: Schema$GoogleCloudContentwarehouseV1DocumentLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Request message for DocumentLinkService.ListLinkedTargets.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsRequest {
        /**
         * The meta information collected about the document creator, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Response message for DocumentLinkService.ListLinkedTargets.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse {
        /**
         * Target document-links.
         */
        documentLinks?: Schema$GoogleCloudContentwarehouseV1DocumentLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for RuleSetService.ListRuleSets.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The rule sets from the specified parent.
         */
        ruleSets?: Schema$GoogleCloudContentwarehouseV1RuleSet[];
    }
    /**
     * Response message for SynonymSetService.ListSynonymSets.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse {
        /**
         * A page token, received from a previous `ListSynonymSets` call. Provide this to retrieve the subsequent page.
         */
        nextPageToken?: string | null;
        /**
         * The synonymSets from the specified parent.
         */
        synonymSets?: Schema$GoogleCloudContentwarehouseV1SynonymSet[];
    }
    /**
     * Request message for DocumentService.LockDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1LockDocumentRequest {
        /**
         * The collection the document connects to.
         */
        collectionId?: string | null;
        /**
         * The user information who locks the document.
         */
        lockingUser?: Schema$GoogleCloudContentwarehouseV1UserInfo;
    }
    /**
     * Map property value. Represents a structured entries of key value pairs, consisting of field names which map to dynamically typed values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1MapProperty {
        /**
         * Unordered map of dynamically typed values.
         */
        fields?: {
            [key: string]: Schema$GoogleCloudContentwarehouseV1Value;
        } | null;
    }
    /**
     * Configurations for a Map property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1MapTypeOptions {
    }
    /**
     * Options for merging updated fields.
     */
    export interface Schema$GoogleCloudContentwarehouseV1MergeFieldsOptions {
        /**
         * When merging message fields, the default behavior is to merge the content of two message fields together. If you instead want to use the field from the source message to replace the corresponding field in the destination message, set this flag to true. When this flag is set, specified submessage fields that are missing in source will be cleared in destination.
         */
        replaceMessageFields?: boolean | null;
        /**
         * When merging repeated fields, the default behavior is to append entries from the source repeated field to the destination repeated field. If you instead want to keep only the entries from the source repeated field, set this flag to true. If you want to replace a repeated field within a message field on the destination message, you must set both replace_repeated_fields and replace_message_fields to true, otherwise the repeated fields will be appended.
         */
        replaceRepeatedFields?: boolean | null;
    }
    /**
     * The DocAI processor information.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ProcessorInfo {
        /**
         * The processor will process the documents with this document type.
         */
        documentType?: string | null;
        /**
         * The processor resource name. Format is `projects/{project\}/locations/{location\}/processors/{processor\}`, or `projects/{project\}/locations/{location\}/processors/{processor\}/processorVersions/{processorVersion\}`
         */
        processorName?: string | null;
        /**
         * The Document schema resource name. All documents processed by this processor will use this schema. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        schemaName?: string | null;
    }
    /**
     * The configuration of processing documents in Document Warehouse with DocAi processors pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ProcessWithDocAiPipeline {
        /**
         * The list of all the resource names of the documents to be processed. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        documents?: string[] | null;
        /**
         * The Cloud Storage folder path used to store the exported documents before being sent to CDW. Format: `gs:///`.
         */
        exportFolderPath?: string | null;
        /**
         * The CDW processor information.
         */
        processorInfo?: Schema$GoogleCloudContentwarehouseV1ProcessorInfo;
        /**
         * The Cloud Storage folder path used to store the raw results from processors. Format: `gs:///`.
         */
        processorResultsFolderPath?: string | null;
    }
    /**
     * Status of a project, including the project state, dbType, aclMode and etc.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ProjectStatus {
        /**
         * Access control mode.
         */
        accessControlMode?: string | null;
        /**
         * Database type.
         */
        databaseType?: string | null;
        /**
         * The default role for the person who create a document.
         */
        documentCreatorDefaultRole?: string | null;
        /**
         * The location of the queried project.
         */
        location?: string | null;
        /**
         * If the qa is enabled on this project.
         */
        qaEnabled?: boolean | null;
        /**
         * State of the project.
         */
        state?: string | null;
    }
    /**
     * Property of a document.
     */
    export interface Schema$GoogleCloudContentwarehouseV1Property {
        /**
         * Date time property values. It is not supported by CMEK compliant deployment.
         */
        dateTimeValues?: Schema$GoogleCloudContentwarehouseV1DateTimeArray;
        /**
         * Enum property values.
         */
        enumValues?: Schema$GoogleCloudContentwarehouseV1EnumArray;
        /**
         * Float property values.
         */
        floatValues?: Schema$GoogleCloudContentwarehouseV1FloatArray;
        /**
         * Integer property values.
         */
        integerValues?: Schema$GoogleCloudContentwarehouseV1IntegerArray;
        /**
         * Map property values.
         */
        mapProperty?: Schema$GoogleCloudContentwarehouseV1MapProperty;
        /**
         * Required. Must match the name of a PropertyDefinition in the DocumentSchema.
         */
        name?: string | null;
        /**
         * Nested structured data property values.
         */
        propertyValues?: Schema$GoogleCloudContentwarehouseV1PropertyArray;
        /**
         * String/text property values.
         */
        textValues?: Schema$GoogleCloudContentwarehouseV1TextArray;
        /**
         * Timestamp property values. It is not supported by CMEK compliant deployment.
         */
        timestampValues?: Schema$GoogleCloudContentwarehouseV1TimestampArray;
    }
    /**
     * Property values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1PropertyArray {
        /**
         * List of property values.
         */
        properties?: Schema$GoogleCloudContentwarehouseV1Property[];
    }
    /**
     * Defines the metadata for a schema property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1PropertyDefinition {
        /**
         * Date time property. It is not supported by CMEK compliant deployment.
         */
        dateTimeTypeOptions?: Schema$GoogleCloudContentwarehouseV1DateTimeTypeOptions;
        /**
         * The display-name for the property, used for front-end.
         */
        displayName?: string | null;
        /**
         * Enum/categorical property.
         */
        enumTypeOptions?: Schema$GoogleCloudContentwarehouseV1EnumTypeOptions;
        /**
         * Float property.
         */
        floatTypeOptions?: Schema$GoogleCloudContentwarehouseV1FloatTypeOptions;
        /**
         * Integer property.
         */
        integerTypeOptions?: Schema$GoogleCloudContentwarehouseV1IntegerTypeOptions;
        /**
         * Whether the property can be filtered. If this is a sub-property, all the parent properties must be marked filterable.
         */
        isFilterable?: boolean | null;
        /**
         * Whether the property is user supplied metadata. This out-of-the box placeholder setting can be used to tag derived properties. Its value and interpretation logic should be implemented by API user.
         */
        isMetadata?: boolean | null;
        /**
         * Whether the property can have multiple values.
         */
        isRepeatable?: boolean | null;
        /**
         * Whether the property is mandatory. Default is 'false', i.e. populating property value can be skipped. If 'true' then user must populate the value for this property.
         */
        isRequired?: boolean | null;
        /**
         * Indicates that the property should be included in a global search.
         */
        isSearchable?: boolean | null;
        /**
         * Map property.
         */
        mapTypeOptions?: Schema$GoogleCloudContentwarehouseV1MapTypeOptions;
        /**
         * Required. The name of the metadata property. Must be unique within a document schema and is case insensitive. Names must be non-blank, start with a letter, and can contain alphanumeric characters and: /, :, -, _, and .
         */
        name?: string | null;
        /**
         * Nested structured data property.
         */
        propertyTypeOptions?: Schema$GoogleCloudContentwarehouseV1PropertyTypeOptions;
        /**
         * The retrieval importance of the property during search.
         */
        retrievalImportance?: string | null;
        /**
         * The mapping information between this property to another schema source.
         */
        schemaSources?: Schema$GoogleCloudContentwarehouseV1PropertyDefinitionSchemaSource[];
        /**
         * Text/string property.
         */
        textTypeOptions?: Schema$GoogleCloudContentwarehouseV1TextTypeOptions;
        /**
         * Timestamp property. It is not supported by CMEK compliant deployment.
         */
        timestampTypeOptions?: Schema$GoogleCloudContentwarehouseV1TimestampTypeOptions;
    }
    /**
     * The schema source information.
     */
    export interface Schema$GoogleCloudContentwarehouseV1PropertyDefinitionSchemaSource {
        /**
         * The schema name in the source.
         */
        name?: string | null;
        /**
         * The Doc AI processor type name.
         */
        processorType?: string | null;
    }
    export interface Schema$GoogleCloudContentwarehouseV1PropertyFilter {
        /**
         * The filter condition. The syntax for this expression is a subset of SQL syntax. Supported operators are: `=`, `!=`, `<`, `<=`, `\>`, `\>=`, and `~~` where the left of the operator is a property name and the right of the operator is a number or a quoted string. You must escape backslash (\\) and quote (\") characters. `~~` is the LIKE operator. The right of the operator must be a string. The only supported property data type for LIKE is text_values. It provides semantic search functionality by parsing, stemming and doing synonyms expansion against the input query. It matches if the property contains semantic similar content to the query. It is not regex matching or wildcard matching. For example, "property.company ~~ \"google\"" will match records whose property `property.compnay` have values like "Google Inc.", "Google LLC" or "Google Company". Supported functions are `LOWER([property_name])` to perform a case insensitive match and `EMPTY([property_name])` to filter on the existence of a key. Boolean expressions (AND/OR/NOT) are supported up to 3 levels of nesting (for example, "((A AND B AND C) OR NOT D) AND E"), a maximum of 100 comparisons or functions are allowed in the expression. The expression must be < 6000 bytes in length. Only properties that are marked filterable are allowed (PropertyDefinition.is_filterable). Property names do not need to be prefixed by the document schema id (as is the case with histograms), however property names will need to be prefixed by its parent hierarchy, if any. For example: top_property_name.sub_property_name. Sample Query: `(LOWER(driving_license)="class \"a\"" OR EMPTY(driving_license)) AND driving_years \> 10` CMEK compliant deployment only supports: * Operators: `=`, `<`, `<=`, `\>`, and `\>=`. * Boolean expressions: AND and OR.
         */
        condition?: string | null;
        /**
         * The Document schema name Document.document_schema_name. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        documentSchemaName?: string | null;
    }
    /**
     * Configurations for a nested structured data property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1PropertyTypeOptions {
        /**
         * Required. List of property definitions.
         */
        propertyDefinitions?: Schema$GoogleCloudContentwarehouseV1PropertyDefinition[];
    }
    /**
     * Represents the action responsible for publishing messages to a Pub/Sub topic.
     */
    export interface Schema$GoogleCloudContentwarehouseV1PublishAction {
        /**
         * Messages to be published.
         */
        messages?: string[] | null;
        /**
         * The topic id in the Pub/Sub service for which messages will be published to.
         */
        topicId?: string | null;
    }
    /**
     * Additional result info for the question-answering feature.
     */
    export interface Schema$GoogleCloudContentwarehouseV1QAResult {
        /**
         * The calibrated confidence score for this document, in the range [0., 1.]. This represents the confidence level for whether the returned document and snippet answers the user's query.
         */
        confidenceScore?: number | null;
        /**
         * Highlighted sections in the snippet.
         */
        highlights?: Schema$GoogleCloudContentwarehouseV1QAResultHighlight[];
    }
    /**
     * A text span in the search text snippet that represents a highlighted section (answer context, highly relevant sentence, etc.).
     */
    export interface Schema$GoogleCloudContentwarehouseV1QAResultHighlight {
        /**
         * End index of the highlight, exclusive.
         */
        endIndex?: number | null;
        /**
         * Start index of the highlight.
         */
        startIndex?: number | null;
    }
    /**
     * Represents the action responsible for remove a document from a specific folder.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RemoveFromFolderAction {
        /**
         * Condition of the action to be executed.
         */
        condition?: string | null;
        /**
         * Name of the folder under which new document is to be added. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\}.
         */
        folder?: string | null;
    }
    /**
     * Meta information is used to improve the performance of the service.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RequestMetadata {
        /**
         * Provides user unique identification and groups information.
         */
        userInfo?: Schema$GoogleCloudContentwarehouseV1UserInfo;
    }
    /**
     * Additional information returned to client, such as debugging information.
     */
    export interface Schema$GoogleCloudContentwarehouseV1ResponseMetadata {
        /**
         * A unique id associated with this call. This id is logged for tracking purpose.
         */
        requestId?: string | null;
    }
    /**
     * Represents the rule for a content warehouse trigger.
     */
    export interface Schema$GoogleCloudContentwarehouseV1Rule {
        /**
         * List of actions that are executed when the rule is satisfied.
         */
        actions?: Schema$GoogleCloudContentwarehouseV1Action[];
        /**
         * Represents the conditional expression to be evaluated. Expression should evaluate to a boolean result. When the condition is true actions are executed. Example: user_role = "hsbc_role_1" AND doc.salary \> 20000
         */
        condition?: string | null;
        /**
         * Short description of the rule and its context.
         */
        description?: string | null;
        /**
         * ID of the rule. It has to be unique across all the examples. This is managed internally.
         */
        ruleId?: string | null;
        /**
         * Identifies the trigger type for running the policy.
         */
        triggerType?: string | null;
    }
    /**
     * Represents a rule and outputs of associated actions.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RuleActionsPair {
        /**
         * Outputs of executing the actions associated with the above rule.
         */
        actionOutputs?: Schema$GoogleCloudContentwarehouseV1ActionOutput[];
        /**
         * Represents the rule.
         */
        rule?: Schema$GoogleCloudContentwarehouseV1Rule;
    }
    /**
     * Records the output of Rule Engine including rule evaluation and actions result.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RuleEngineOutput {
        /**
         * Output from Action Executor containing rule and corresponding actions execution result.
         */
        actionExecutorOutput?: Schema$GoogleCloudContentwarehouseV1ActionExecutorOutput;
        /**
         * Name of the document against which the rules and actions were evaluated.
         */
        documentName?: string | null;
        /**
         * Output from Rule Evaluator containing matched, unmatched and invalid rules.
         */
        ruleEvaluatorOutput?: Schema$GoogleCloudContentwarehouseV1RuleEvaluatorOutput;
    }
    /**
     * Represents the output of the Rule Evaluator.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RuleEvaluatorOutput {
        /**
         * A subset of triggered rules that failed the validation check(s) after parsing.
         */
        invalidRules?: Schema$GoogleCloudContentwarehouseV1InvalidRule[];
        /**
         * A subset of triggered rules that are evaluated true for a given request.
         */
        matchedRules?: Schema$GoogleCloudContentwarehouseV1Rule[];
        /**
         * List of rules fetched from database for the given request trigger type.
         */
        triggeredRules?: Schema$GoogleCloudContentwarehouseV1Rule[];
    }
    /**
     * Represents a set of rules from a single customer.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RuleSet {
        /**
         * Short description of the rule-set.
         */
        description?: string | null;
        /**
         * The resource name of the rule set. Managed internally. Format: projects/{project_number\}/locations/{location\}/ruleSet/{rule_set_id\}. The name is ignored when creating a rule set.
         */
        name?: string | null;
        /**
         * List of rules given by the customer.
         */
        rules?: Schema$GoogleCloudContentwarehouseV1Rule[];
        /**
         * Source of the rules i.e., customer name.
         */
        source?: string | null;
    }
    /**
     * Metadata message of RunPipeline method.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineMetadata {
        /**
         * The pipeline metadata for Export-to-CDW pipeline.
         */
        exportToCdwPipelineMetadata?: Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataExportToCdwPipelineMetadata;
        /**
         * Number of files that have failed at some point in the pipeline.
         */
        failedFileCount?: number | null;
        /**
         * The pipeline metadata for GcsIngest pipeline.
         */
        gcsIngestPipelineMetadata?: Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataGcsIngestPipelineMetadata;
        /**
         * The list of response details of each document.
         */
        individualDocumentStatuses?: Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataIndividualDocumentStatus[];
        /**
         * The pipeline metadata for Process-with-DocAi pipeline.
         */
        processWithDocAiPipelineMetadata?: Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataProcessWithDocAiPipelineMetadata;
        /**
         * Number of files that were processed by the pipeline.
         */
        totalFileCount?: number | null;
        /**
         * User unique identification and groups information.
         */
        userInfo?: Schema$GoogleCloudContentwarehouseV1UserInfo;
    }
    /**
     * The metadata message for Export-to-CDW pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataExportToCdwPipelineMetadata {
        /**
         * The output CDW dataset resource name.
         */
        docAiDataset?: string | null;
        /**
         * The input list of all the resource names of the documents to be exported.
         */
        documents?: string[] | null;
        /**
         * The output Cloud Storage folder in this pipeline.
         */
        outputPath?: string | null;
    }
    /**
     * The metadata message for GcsIngest pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataGcsIngestPipelineMetadata {
        /**
         * The input Cloud Storage folder in this pipeline. Format: `gs:///`.
         */
        inputPath?: string | null;
    }
    /**
     * The status of processing a document.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataIndividualDocumentStatus {
        /**
         * Document identifier of an existing document.
         */
        documentId?: string | null;
        /**
         * The status processing the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The metadata message for Process-with-DocAi pipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineMetadataProcessWithDocAiPipelineMetadata {
        /**
         * The input list of all the resource names of the documents to be processed.
         */
        documents?: string[] | null;
        /**
         * The DocAI processor to process the documents with.
         */
        processorInfo?: Schema$GoogleCloudContentwarehouseV1ProcessorInfo;
    }
    /**
     * Request message for DocumentService.RunPipeline.
     */
    export interface Schema$GoogleCloudContentwarehouseV1RunPipelineRequest {
        /**
         * Export docuemnts from Document Warehouse to CDW for training purpose.
         */
        exportCdwPipeline?: Schema$GoogleCloudContentwarehouseV1ExportToCdwPipeline;
        /**
         * Cloud Storage ingestion pipeline.
         */
        gcsIngestPipeline?: Schema$GoogleCloudContentwarehouseV1GcsIngestPipeline;
        /**
         * Use DocAI processors to process documents in Cloud Storage and ingest them to Document Warehouse.
         */
        gcsIngestWithDocAiProcessorsPipeline?: Schema$GoogleCloudContentwarehouseV1GcsIngestWithDocAiProcessorsPipeline;
        /**
         * Use a DocAI processor to process documents in Document Warehouse, and re-ingest the updated results into Document Warehouse.
         */
        processWithDocAiPipeline?: Schema$GoogleCloudContentwarehouseV1ProcessWithDocAiPipeline;
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Request message for DocumentService.SearchDocuments.
     */
    export interface Schema$GoogleCloudContentwarehouseV1SearchDocumentsRequest {
        /**
         * Query used to search against documents (keyword, filters, etc.).
         */
        documentQuery?: Schema$GoogleCloudContentwarehouseV1DocumentQuery;
        /**
         * An expression specifying a histogram request against matching documents. Expression syntax is an aggregation function call with histogram facets and other options. The following aggregation functions are supported: * `count(string_histogram_facet)`: Count the number of matching entities for each distinct attribute value. Data types: * Histogram facet (aka filterable properties): Facet names with format <schema id\>.<facet\>. Facets will have the format of: `a-zA-Z`. If the facet is a child facet, then the parent hierarchy needs to be specified separated by dots in the prefix after the schema id. Thus, the format for a multi- level facet is: <schema id\>.<parent facet name\>. <child facet name\>. Example: schema123.root_parent_facet.middle_facet.child_facet * DocumentSchemaId: (with no schema id prefix) to get histograms for each document type (returns the schema id path, e.g. projects/12345/locations/us-west/documentSchemas/abc123). Example expression: * Document type counts: count('DocumentSchemaId') * For schema id, abc123, get the counts for MORTGAGE_TYPE: count('abc123.MORTGAGE_TYPE')
         */
        histogramQueries?: Schema$GoogleCloudContentwarehouseV1HistogramQuery[];
        /**
         * An integer that specifies the current offset (that is, starting result location, amongst the documents deemed by the API as relevant) in search results. This field is only considered if page_token is unset. The maximum allowed value is 5000. Otherwise an error is thrown. For example, 0 means to return results starting from the first matching document, and 10 means to return from the 11th document. This can be used for pagination, (for example, pageSize = 10 and offset = 10 means to return from the second page).
         */
        offset?: number | null;
        /**
         * The criteria determining how search results are sorted. For non-empty query, default is `"relevance desc"`. For empty query, default is `"upload_date desc"`. Supported options are: * `"relevance desc"`: By relevance descending, as determined by the API algorithms. * `"upload_date desc"`: By upload date descending. * `"upload_date"`: By upload date ascending. * `"update_date desc"`: By last updated date descending. * `"update_date"`: By last updated date ascending. * `"retrieval_importance desc"`: By retrieval importance of properties descending. This feature is still under development, please do not use unless otherwise instructed to do so.
         */
        orderBy?: string | null;
        /**
         * A limit on the number of documents returned in the search results. Increasing this value above the default value of 10 can increase search response time. The value can be between 1 and 100.
         */
        pageSize?: number | null;
        /**
         * The token specifying the current offset within search results. See SearchDocumentsResponse.next_page_token for an explanation of how to obtain the next set of query results.
         */
        pageToken?: string | null;
        /**
         * Experimental, do not use. The limit on the number of documents returned for the question-answering feature. To enable the question-answering feature, set [DocumentQuery].is_nl_query to true.
         */
        qaSizeLimit?: number | null;
        /**
         * The meta information collected about the end user, used to enforce access control and improve the search quality of the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
        /**
         * Controls if the search document request requires the return of a total size of matched documents. See SearchDocumentsResponse.total_size. Enabling this flag may adversely impact performance. Hint: If this is used with pagination, set this flag on the initial query but set this to false on subsequent page calls (keep the total count locally). Defaults to false.
         */
        requireTotalSize?: boolean | null;
        /**
         * Controls if the search document request requires the return of a total size of matched documents. See SearchDocumentsResponse.total_size.
         */
        totalResultSize?: string | null;
    }
    /**
     * Response message for DocumentService.SearchDocuments.
     */
    export interface Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse {
        /**
         * The histogram results that match with the specified SearchDocumentsRequest.histogram_queries.
         */
        histogramQueryResults?: Schema$GoogleCloudContentwarehouseV1HistogramQueryResult[];
        /**
         * The document entities that match the specified SearchDocumentsRequest.
         */
        matchingDocuments?: Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponseMatchingDocument[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$GoogleCloudContentwarehouseV1ResponseMetadata;
        /**
         * The token that specifies the starting position of the next page of results. This field is empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * Experimental. Question answer from the query against the document.
         */
        questionAnswer?: string | null;
        /**
         * The total number of matched documents which is available only if the client set SearchDocumentsRequest.require_total_size to `true` or set SearchDocumentsRequest.total_result_size to `ESTIMATED_SIZE` or `ACTUAL_SIZE`. Otherwise, the value will be `-1`. Typically a UI would handle this condition by displaying "of many", for example: "Displaying 10 of many".
         */
        totalSize?: number | null;
    }
    /**
     * Document entry with metadata inside SearchDocumentsResponse
     */
    export interface Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponseMatchingDocument {
        /**
         * Document that matches the specified SearchDocumentsRequest. This document only contains indexed metadata information.
         */
        document?: Schema$GoogleCloudContentwarehouseV1Document;
        /**
         * Return the 1-based page indices where those pages have one or more matched tokens.
         */
        matchedTokenPageIndices?: string[] | null;
        /**
         * Experimental. Additional result info if the question-answering feature is enabled.
         */
        qaResult?: Schema$GoogleCloudContentwarehouseV1QAResult;
        /**
         * Contains snippets of text from the document full raw text that most closely match a search query's keywords, if available. All HTML tags in the original fields are stripped when returned in this field, and matching query keywords are enclosed in HTML bold tags. If the question-answering feature is enabled, this field will instead contain a snippet that answers the user's natural-language query. No HTML bold tags will be present, and highlights in the answer snippet can be found in QAResult.highlights.
         */
        searchTextSnippet?: string | null;
    }
    /**
     * Request message for DocumentService.SetAcl.
     */
    export interface Schema$GoogleCloudContentwarehouseV1SetAclRequest {
        /**
         * Required. REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. This refers to an Identity and Access (IAM) policy, which specifies access controls for the Document. You can set ACL with condition for projects only. Supported operators are: `=`, `!=`, `<`, `<=`, `\>`, and `\>=` where the left of the operator is `DocumentSchemaId` or property name and the right of the operator is a number or a quoted string. You must escape backslash (\\) and quote (\") characters. Boolean expressions (AND/OR) are supported up to 3 levels of nesting (for example, "((A AND B AND C) OR D) AND E"), a maximum of 10 comparisons are allowed in the expression. The expression must be < 6000 bytes in length. Sample condition: `"DocumentSchemaId = \"some schema id\" OR SchemaId.floatPropertyName \>= 10"`
         */
        policy?: Schema$GoogleIamV1Policy;
        /**
         * For Set Project ACL only. Authorization check for end user will be ignored when project_owner=true.
         */
        projectOwner?: boolean | null;
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
    }
    /**
     * Response message for DocumentService.SetAcl.
     */
    export interface Schema$GoogleCloudContentwarehouseV1SetAclResponse {
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$GoogleCloudContentwarehouseV1ResponseMetadata;
        /**
         * The policy will be attached to a resource (e.g. projecct, document).
         */
        policy?: Schema$GoogleIamV1Policy;
    }
    /**
     * Represents a list of synonyms for a given context. For example a context "sales" could contain: Synonym 1: sale, invoice, bill, order Synonym 2: money, credit, finance, payment Synonym 3: shipping, freight, transport Each SynonymSets should be disjoint
     */
    export interface Schema$GoogleCloudContentwarehouseV1SynonymSet {
        /**
         * This is a freeform field. Example contexts can be "sales," "engineering," "real estate," "accounting," etc. The context can be supplied during search requests.
         */
        context?: string | null;
        /**
         * The resource name of the SynonymSet This is mandatory for google.api.resource. Format: projects/{project_number\}/locations/{location\}/synonymSets/{context\}.
         */
        name?: string | null;
        /**
         * List of Synonyms for the context.
         */
        synonyms?: Schema$GoogleCloudContentwarehouseV1SynonymSetSynonym[];
    }
    /**
     * Represents a list of words given by the customer All these words are synonyms of each other.
     */
    export interface Schema$GoogleCloudContentwarehouseV1SynonymSetSynonym {
        /**
         * For example: sale, invoice, bill, order
         */
        words?: string[] | null;
    }
    /**
     * String/text values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TextArray {
        /**
         * List of text values.
         */
        values?: string[] | null;
    }
    /**
     * Configurations for a text property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TextTypeOptions {
    }
    /**
     * Filter on create timestamp or update timestamp of documents.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TimeFilter {
        /**
         * Specifies which time field to filter documents on. Defaults to TimeField.UPLOAD_TIME.
         */
        timeField?: string | null;
        timeRange?: Schema$GoogleTypeInterval;
    }
    /**
     * Timestamp values.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TimestampArray {
        /**
         * List of timestamp values.
         */
        values?: Schema$GoogleCloudContentwarehouseV1TimestampValue[];
    }
    /**
     * Configurations for a timestamp property.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TimestampTypeOptions {
    }
    /**
     * Timestamp value type.
     */
    export interface Schema$GoogleCloudContentwarehouseV1TimestampValue {
        /**
         * The string must represent a valid instant in UTC and is parsed using java.time.format.DateTimeFormatter.ISO_INSTANT. e.g. "2013-09-29T18:46:19Z"
         */
        textValue?: string | null;
        /**
         * Timestamp value
         */
        timestampValue?: string | null;
    }
    /**
     * Metadata object for UpdateDocument request (currently empty).
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateDocumentMetadata {
    }
    /**
     * Request message for DocumentService.UpdateDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateDocumentRequest {
        /**
         * Request Option for processing Cloud AI Document in Document Warehouse. This field offers limited support for mapping entities from Cloud AI Document to Warehouse Document. Please consult with product team before using this field and other available options.
         */
        cloudAiDocumentOption?: Schema$GoogleCloudContentwarehouseV1CloudAIDocumentOption;
        /**
         * Required. The document to update.
         */
        document?: Schema$GoogleCloudContentwarehouseV1Document;
        /**
         * The meta information collected about the end user, used to enforce access control for the service.
         */
        requestMetadata?: Schema$GoogleCloudContentwarehouseV1RequestMetadata;
        /**
         * Options for the update operation.
         */
        updateOptions?: Schema$GoogleCloudContentwarehouseV1UpdateOptions;
    }
    /**
     * Response message for DocumentService.UpdateDocument.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse {
        /**
         * Updated document after executing update request.
         */
        document?: Schema$GoogleCloudContentwarehouseV1Document;
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$GoogleCloudContentwarehouseV1ResponseMetadata;
        /**
         * Output from Rule Engine recording the rule evaluator and action executor's output. Refer format in: google/cloud/contentwarehouse/v1/rule_engine.proto
         */
        ruleEngineOutput?: Schema$GoogleCloudContentwarehouseV1RuleEngineOutput;
    }
    /**
     * Request message for DocumentSchemaService.UpdateDocumentSchema.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateDocumentSchemaRequest {
        /**
         * Required. The document schema to update with.
         */
        documentSchema?: Schema$GoogleCloudContentwarehouseV1DocumentSchema;
    }
    /**
     * Options for Update operations.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateOptions {
        /**
         * Options for merging.
         */
        mergeFieldsOptions?: Schema$GoogleCloudContentwarehouseV1MergeFieldsOptions;
        /**
         * Field mask for merging Document fields. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string | null;
        /**
         * Type for update.
         */
        updateType?: string | null;
    }
    /**
     * Request message for RuleSetService.UpdateRuleSet.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UpdateRuleSetRequest {
        /**
         * Required. The rule set to update.
         */
        ruleSet?: Schema$GoogleCloudContentwarehouseV1RuleSet;
    }
    /**
     * The user information.
     */
    export interface Schema$GoogleCloudContentwarehouseV1UserInfo {
        /**
         * The unique group identifications which the user is belong to. The format is "group:yyyy@example.com";
         */
        groupIds?: string[] | null;
        /**
         * A unique user identification string, as determined by the client. The maximum number of allowed characters is 255. Allowed characters include numbers 0 to 9, uppercase and lowercase letters, and restricted special symbols (:, @, +, -, _, ~) The format is "user:xxxx@example.com";
         */
        id?: string | null;
    }
    /**
     * `Value` represents a dynamically typed value which can be either be a float, a integer, a string, or a datetime value. A producer of value is expected to set one of these variants. Absence of any variant indicates an error.
     */
    export interface Schema$GoogleCloudContentwarehouseV1Value {
        /**
         * Represents a boolean value.
         */
        booleanValue?: boolean | null;
        /**
         * Represents a datetime value.
         */
        datetimeValue?: Schema$GoogleTypeDateTime;
        /**
         * Represents an enum value.
         */
        enumValue?: Schema$GoogleCloudContentwarehouseV1EnumValue;
        /**
         * Represents a float value.
         */
        floatValue?: number | null;
        /**
         * Represents a integer value.
         */
        intValue?: number | null;
        /**
         * Represents a string value.
         */
        stringValue?: string | null;
        /**
         * Represents a timestamp value.
         */
        timestampValue?: Schema$GoogleCloudContentwarehouseV1TimestampValue;
    }
    /**
     * Specifies the schema property name.
     */
    export interface Schema$GoogleCloudContentwarehouseV1WeightedSchemaProperty {
        /**
         * The document schema name.
         */
        documentSchemaName?: string | null;
        /**
         * The property definition names in the schema.
         */
        propertyNames?: string[] | null;
    }
    /**
     * Encodes the detailed information of a barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1Barcode {
        /**
         * Format of a barcode. The supported formats are: - `CODE_128`: Code 128 type. - `CODE_39`: Code 39 type. - `CODE_93`: Code 93 type. - `CODABAR`: Codabar type. - `DATA_MATRIX`: 2D Data Matrix type. - `ITF`: ITF type. - `EAN_13`: EAN-13 type. - `EAN_8`: EAN-8 type. - `QR_CODE`: 2D QR code type. - `UPC_A`: UPC-A type. - `UPC_E`: UPC-E type. - `PDF417`: PDF417 type. - `AZTEC`: 2D Aztec code type. - `DATABAR`: GS1 DataBar code type.
         */
        format?: string | null;
        /**
         * Raw value encoded in the barcode. For example: `'MEBKM:TITLE:Google;URL:https://www.google.com;;'`.
         */
        rawValue?: string | null;
        /**
         * Value format describes the format of the value that a barcode encodes. The supported formats are: - `CONTACT_INFO`: Contact information. - `EMAIL`: Email address. - `ISBN`: ISBN identifier. - `PHONE`: Phone number. - `PRODUCT`: Product. - `SMS`: SMS message. - `TEXT`: Text string. - `URL`: URL address. - `WIFI`: Wifi information. - `GEO`: Geo-localization. - `CALENDAR_EVENT`: Calendar event. - `DRIVER_LICENSE`: Driver's license.
         */
        valueFormat?: string | null;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudDocumentaiV1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudDocumentaiV1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudDocumentaiV1Vertex[];
    }
    /**
     * Document represents the canonical document resource in Document AI. It is an interchange format that provides insights into documents and allows for collaboration between users and Document AI to iterate and optimize for quality.
     */
    export interface Schema$GoogleCloudDocumentaiV1Document {
        /**
         * Document chunked based on chunking config.
         */
        chunkedDocument?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocument;
        /**
         * Optional. Inline document content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64.
         */
        content?: string | null;
        /**
         * Parsed layout of the document.
         */
        documentLayout?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayout;
        /**
         * A list of entities detected on Document.text. For document shards, entities in this list may cross shard boundaries.
         */
        entities?: Schema$GoogleCloudDocumentaiV1DocumentEntity[];
        /**
         * Placeholder. Relationship among Document.entities.
         */
        entityRelations?: Schema$GoogleCloudDocumentaiV1DocumentEntityRelation[];
        /**
         * Any error that occurred while processing this document.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * An IANA published [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml).
         */
        mimeType?: string | null;
        /**
         * Visual page layout for the Document.
         */
        pages?: Schema$GoogleCloudDocumentaiV1DocumentPage[];
        /**
         * Placeholder. Revision history of this document.
         */
        revisions?: Schema$GoogleCloudDocumentaiV1DocumentRevision[];
        /**
         * Information about the sharding if this document is sharded part of a larger document. If the document is not sharded, this message is not specified.
         */
        shardInfo?: Schema$GoogleCloudDocumentaiV1DocumentShardInfo;
        /**
         * Optional. UTF-8 encoded text in reading order from the document.
         */
        text?: string | null;
        /**
         * Placeholder. A list of text corrections made to Document.text. This is usually used for annotating corrections to OCR mistakes. Text changes for a given revision may not overlap with each other.
         */
        textChanges?: Schema$GoogleCloudDocumentaiV1DocumentTextChange[];
        /**
         * Styles for the Document.text.
         */
        textStyles?: Schema$GoogleCloudDocumentaiV1DocumentStyle[];
        /**
         * Optional. Currently supports Google Cloud Storage URI of the form `gs://bucket_name/object_name`. Object versioning is not supported. For more information, refer to [Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris).
         */
        uri?: string | null;
    }
    /**
     * Represents the chunks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentChunkedDocument {
        /**
         * List of chunks.
         */
        chunks?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunk[];
    }
    /**
     * Represents a chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunk {
        /**
         * ID of the chunk.
         */
        chunkId?: string | null;
        /**
         * Text content of the chunk.
         */
        content?: string | null;
        /**
         * Page footers associated with the chunk.
         */
        pageFooters?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageFooter[];
        /**
         * Page headers associated with the chunk.
         */
        pageHeaders?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageHeader[];
        /**
         * Page span of the chunk.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Unused.
         */
        sourceBlockIds?: string[] | null;
    }
    /**
     * Represents the page footer associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageFooter {
        /**
         * Page span of the footer.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Footer in text format.
         */
        text?: string | null;
    }
    /**
     * Represents the page header associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageHeader {
        /**
         * Page span of the header.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Header in text format.
         */
        text?: string | null;
    }
    /**
     * Represents where the chunk starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentChunkedDocumentChunkChunkPageSpan {
        /**
         * Page where chunk ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where chunk starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents the parsed layout of a document as a collection of blocks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayout {
        /**
         * List of blocks in the document.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents a block. A block could be one of the various types (text, table, list) supported.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlock {
        /**
         * ID of the block.
         */
        blockId?: string | null;
        /**
         * Block consisting of list content/structure.
         */
        listBlock?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock;
        /**
         * Page span of the block.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan;
        /**
         * Block consisting of table content/structure.
         */
        tableBlock?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock;
        /**
         * Block consisting of text content.
         */
        textBlock?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock;
    }
    /**
     * Represents a list type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock {
        /**
         * List entries that constitute a list block.
         */
        listEntries?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry[];
        /**
         * Type of the list_entries (if exist). Available options are `ordered` and `unordered`.
         */
        type?: string | null;
    }
    /**
     * Represents an entry in the list.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry {
        /**
         * A list entry is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents where the block starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan {
        /**
         * Page where block ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where block starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents a table type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock {
        /**
         * Body rows containing main table content.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
        /**
         * Table caption/title.
         */
        caption?: string | null;
        /**
         * Header rows at the top of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
    }
    /**
     * Represents a cell in a table row.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell {
        /**
         * A table cell is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * Represents a row in a table.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow {
        /**
         * A table row is a list of table cells.
         */
        cells?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell[];
    }
    /**
     * Represents a text type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock {
        /**
         * A text block could further have child blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * Text content stored in the block.
         */
        text?: string | null;
        /**
         * Type of the text in the block. Available options are: `paragraph`, `subtitle`, `heading-1`, `heading-2`, `heading-3`, `heading-4`, `heading-5`, `header`, `footer`.
         */
        type?: string | null;
    }
    /**
     * An entity that could be a phrase in the text or a property that belongs to the document. It is a known entity type, such as a person, an organization, or location.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentEntity {
        /**
         * Optional. Confidence of detected Schema entity. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Canonical id. This will be a unique value in the entity list for this document.
         */
        id?: string | null;
        /**
         * Optional. Deprecated. Use `id` field instead.
         */
        mentionId?: string | null;
        /**
         * Optional. Text value of the entity e.g. `1600 Amphitheatre Pkwy`.
         */
        mentionText?: string | null;
        /**
         * Optional. Normalized entity value. Absent if the extracted value could not be converted or the type (e.g. address) is not supported for certain parsers. This field is also only populated for certain supported document types.
         */
        normalizedValue?: Schema$GoogleCloudDocumentaiV1DocumentEntityNormalizedValue;
        /**
         * Optional. Represents the provenance of this entity wrt. the location on the page where it was found.
         */
        pageAnchor?: Schema$GoogleCloudDocumentaiV1DocumentPageAnchor;
        /**
         * Optional. Entities can be nested to form a hierarchical data structure representing the content in the document.
         */
        properties?: Schema$GoogleCloudDocumentaiV1DocumentEntity[];
        /**
         * Optional. The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
        /**
         * Optional. Whether the entity will be redacted for de-identification purposes.
         */
        redacted?: boolean | null;
        /**
         * Optional. Provenance of the entity. Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1DocumentTextAnchor;
        /**
         * Required. Entity type from a schema e.g. `Address`.
         */
        type?: string | null;
    }
    /**
     * Parsed and normalized entity value.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentEntityNormalizedValue {
        /**
         * Postal address. See also: https://github.com/googleapis/googleapis/blob/master/google/type/postal_address.proto
         */
        addressValue?: Schema$GoogleTypePostalAddress;
        /**
         * Boolean value. Can be used for entities with binary values, or for checkboxes.
         */
        booleanValue?: boolean | null;
        /**
         * DateTime value. Includes date, time, and timezone. See also: https://github.com/googleapis/googleapis/blob/master/google/type/datetime.proto
         */
        datetimeValue?: Schema$GoogleTypeDateTime;
        /**
         * Date value. Includes year, month, day. See also: https://github.com/googleapis/googleapis/blob/master/google/type/date.proto
         */
        dateValue?: Schema$GoogleTypeDate;
        /**
         * Float value.
         */
        floatValue?: number | null;
        /**
         * Integer value.
         */
        integerValue?: number | null;
        /**
         * Money value. See also: https://github.com/googleapis/googleapis/blob/master/google/type/money.proto
         */
        moneyValue?: Schema$GoogleTypeMoney;
        /**
         * Optional. An optional field to store a normalized string. For some entity types, one of respective `structured_value` fields may also be populated. Also not all the types of `structured_value` will be normalized. For example, some processors may not generate `float` or `integer` normalized text by default. Below are sample formats mapped to structured values. - Money/Currency type (`money_value`) is in the ISO 4217 text format. - Date type (`date_value`) is in the ISO 8601 text format. - Datetime type (`datetime_value`) is in the ISO 8601 text format.
         */
        text?: string | null;
    }
    /**
     * Relationship between Entities.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentEntityRelation {
        /**
         * Object entity id.
         */
        objectId?: string | null;
        /**
         * Relationship description.
         */
        relation?: string | null;
        /**
         * Subject entity id.
         */
        subjectId?: string | null;
    }
    /**
     * A page in a Document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPage {
        /**
         * A list of visually detected text blocks on the page. A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1DocumentPageBlock[];
        /**
         * A list of detected barcodes.
         */
        detectedBarcodes?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedBarcode[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Physical dimension of the page.
         */
        dimension?: Schema$GoogleCloudDocumentaiV1DocumentPageDimension;
        /**
         * A list of visually detected form fields on the page.
         */
        formFields?: Schema$GoogleCloudDocumentaiV1DocumentPageFormField[];
        /**
         * Rendered image for this page. This image is preprocessed to remove any skew, rotation, and distortions such that the annotation bounding boxes can be upright and axis-aligned.
         */
        image?: Schema$GoogleCloudDocumentaiV1DocumentPageImage;
        /**
         * Image quality scores.
         */
        imageQualityScores?: Schema$GoogleCloudDocumentaiV1DocumentPageImageQualityScores;
        /**
         * Layout for the page.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * A list of visually detected text lines on the page. A collection of tokens that a human would perceive as a line.
         */
        lines?: Schema$GoogleCloudDocumentaiV1DocumentPageLine[];
        /**
         * 1-based index for current Page in a parent Document. Useful when a page is taken out of a Document for individual processing.
         */
        pageNumber?: number | null;
        /**
         * A list of visually detected text paragraphs on the page. A collection of lines that a human would perceive as a paragraph.
         */
        paragraphs?: Schema$GoogleCloudDocumentaiV1DocumentPageParagraph[];
        /**
         * The history of this page.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
        /**
         * A list of visually detected symbols on the page.
         */
        symbols?: Schema$GoogleCloudDocumentaiV1DocumentPageSymbol[];
        /**
         * A list of visually detected tables on the page.
         */
        tables?: Schema$GoogleCloudDocumentaiV1DocumentPageTable[];
        /**
         * A list of visually detected tokens on the page.
         */
        tokens?: Schema$GoogleCloudDocumentaiV1DocumentPageToken[];
        /**
         * Transformation matrices that were applied to the original document image to produce Page.image.
         */
        transforms?: Schema$GoogleCloudDocumentaiV1DocumentPageMatrix[];
        /**
         * A list of detected non-text visual elements e.g. checkbox, signature etc. on the page.
         */
        visualElements?: Schema$GoogleCloudDocumentaiV1DocumentPageVisualElement[];
    }
    /**
     * Referencing the visual context of the entity in the Document.pages. Page anchors can be cross-page, consist of multiple bounding polygons and optionally reference specific layout element types.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageAnchor {
        /**
         * One or more references to visual page elements
         */
        pageRefs?: Schema$GoogleCloudDocumentaiV1DocumentPageAnchorPageRef[];
    }
    /**
     * Represents a weak reference to a page element within a document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageAnchorPageRef {
        /**
         * Optional. Identifies the bounding polygon of a layout element on the page. If `layout_type` is set, the bounding polygon must be exactly the same to the layout element it's referring to.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1BoundingPoly;
        /**
         * Optional. Confidence of detected page element, if applicable. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Deprecated. Use PageRef.bounding_poly instead.
         */
        layoutId?: string | null;
        /**
         * Optional. The type of the layout element that is being referenced if any.
         */
        layoutType?: string | null;
        /**
         * Required. Index into the Document.pages element, for example using `Document.pages` to locate the related page element. This field is skipped when its value is the default `0`. See https://developers.google.com/protocol-buffers/docs/proto3#json.
         */
        page?: string | null;
    }
    /**
     * A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageBlock {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for Block.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
    }
    /**
     * A detected barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageDetectedBarcode {
        /**
         * Detailed barcode information of the DetectedBarcode.
         */
        barcode?: Schema$GoogleCloudDocumentaiV1Barcode;
        /**
         * Layout for DetectedBarcode.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage {
        /**
         * Confidence of detected language. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * The [BCP-47 language code](https://www.unicode.org/reports/tr35/#Unicode_locale_identifier), such as `en-US` or `sr-Latn`.
         */
        languageCode?: string | null;
    }
    /**
     * Dimension for the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageDimension {
        /**
         * Page height.
         */
        height?: number | null;
        /**
         * Dimension unit.
         */
        unit?: string | null;
        /**
         * Page width.
         */
        width?: number | null;
    }
    /**
     * A form field detected on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageFormField {
        /**
         * Created for Labeling UI to export key text. If corrections were made to the text identified by the `field_name.text_anchor`, this field will contain the correction.
         */
        correctedKeyText?: string | null;
        /**
         * Created for Labeling UI to export value text. If corrections were made to the text identified by the `field_value.text_anchor`, this field will contain the correction.
         */
        correctedValueText?: string | null;
        /**
         * Layout for the FormField name. e.g. `Address`, `Email`, `Grand total`, `Phone number`, etc.
         */
        fieldName?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * Layout for the FormField value.
         */
        fieldValue?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * A list of detected languages for name together with confidence.
         */
        nameDetectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
        /**
         * A list of detected languages for value together with confidence.
         */
        valueDetectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * If the value is non-textual, this field represents the type. Current valid values are: - blank (this indicates the `field_value` is normal text) - `unfilled_checkbox` - `filled_checkbox`
         */
        valueType?: string | null;
    }
    /**
     * Rendered image contents for this page.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageImage {
        /**
         * Raw byte content of the image.
         */
        content?: string | null;
        /**
         * Height of the image in pixels.
         */
        height?: number | null;
        /**
         * Encoding [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml) for the image.
         */
        mimeType?: string | null;
        /**
         * Width of the image in pixels.
         */
        width?: number | null;
    }
    /**
     * Image quality scores for the page image.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageImageQualityScores {
        /**
         * A list of detected defects.
         */
        detectedDefects?: Schema$GoogleCloudDocumentaiV1DocumentPageImageQualityScoresDetectedDefect[];
        /**
         * The overall quality score. Range `[0, 1]` where `1` is perfect quality.
         */
        qualityScore?: number | null;
    }
    /**
     * Image Quality Defects
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageImageQualityScoresDetectedDefect {
        /**
         * Confidence of detected defect. Range `[0, 1]` where `1` indicates strong confidence that the defect exists.
         */
        confidence?: number | null;
        /**
         * Name of the defect type. Supported values are: - `quality/defect_blurry` - `quality/defect_noisy` - `quality/defect_dark` - `quality/defect_faint` - `quality/defect_text_too_small` - `quality/defect_document_cutoff` - `quality/defect_text_cutoff` - `quality/defect_glare`
         */
        type?: string | null;
    }
    /**
     * Visual element describing a layout unit on a page.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageLayout {
        /**
         * The bounding polygon for the Layout.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1BoundingPoly;
        /**
         * Confidence of the current Layout within context of the object this layout is for. e.g. confidence can be for a single token, a table, a visual element, etc. depending on context. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Detected orientation for the Layout.
         */
        orientation?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1DocumentTextAnchor;
    }
    /**
     * A collection of tokens that a human would perceive as a line. Does not cross column boundaries, can be horizontal, vertical, etc.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageLine {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for Line.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
    }
    /**
     * Representation for transformation matrix, intended to be compatible and used with OpenCV format for image manipulation.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageMatrix {
        /**
         * Number of columns in the matrix.
         */
        cols?: number | null;
        /**
         * The matrix data.
         */
        data?: string | null;
        /**
         * Number of rows in the matrix.
         */
        rows?: number | null;
        /**
         * This encodes information about what data type the matrix uses. For example, 0 (CV_8U) is an unsigned 8-bit image. For the full list of OpenCV primitive data types, please refer to https://docs.opencv.org/4.3.0/d1/d1b/group__core__hal__interface.html
         */
        type?: number | null;
    }
    /**
     * A collection of lines that a human would perceive as a paragraph.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageParagraph {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for Paragraph.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
    }
    /**
     * A detected symbol.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageSymbol {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for Symbol.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
    }
    /**
     * A table representation similar to HTML table structure.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageTable {
        /**
         * Body rows of the table.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1DocumentPageTableTableRow[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Header rows of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1DocumentPageTableTableRow[];
        /**
         * Layout for Table.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * The history of this table.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
    }
    /**
     * A cell representation inside the table.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageTableTableCell {
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for TableCell.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * A row of table cells.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageTableTableRow {
        /**
         * Cells that make up this row.
         */
        cells?: Schema$GoogleCloudDocumentaiV1DocumentPageTableTableCell[];
    }
    /**
     * A detected token.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageToken {
        /**
         * Detected break at the end of a Token.
         */
        detectedBreak?: Schema$GoogleCloudDocumentaiV1DocumentPageTokenDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for Token.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance;
        /**
         * Text style attributes.
         */
        styleInfo?: Schema$GoogleCloudDocumentaiV1DocumentPageTokenStyleInfo;
    }
    /**
     * Detected break at the end of a Token.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageTokenDetectedBreak {
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Font and other text style attributes.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageTokenStyleInfo {
        /**
         * Color of the background.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is bold (equivalent to font_weight is at least `700`).
         */
        bold?: boolean | null;
        /**
         * Font size in points (`1` point is `¹⁄₇₂` inches).
         */
        fontSize?: number | null;
        /**
         * Name or style of the font.
         */
        fontType?: string | null;
        /**
         * TrueType weight on a scale `100` (thin) to `1000` (ultra-heavy). Normal is `400`, bold is `700`.
         */
        fontWeight?: number | null;
        /**
         * Whether the text is handwritten.
         */
        handwritten?: boolean | null;
        /**
         * Whether the text is italic.
         */
        italic?: boolean | null;
        /**
         * Letter spacing in points.
         */
        letterSpacing?: number | null;
        /**
         * Font size in pixels, equal to _unrounded font_size_ * _resolution_ ÷ `72.0`.
         */
        pixelFontSize?: number | null;
        /**
         * Whether the text is in small caps. This feature is not supported yet.
         */
        smallcaps?: boolean | null;
        /**
         * Whether the text is strikethrough. This feature is not supported yet.
         */
        strikeout?: boolean | null;
        /**
         * Whether the text is a subscript. This feature is not supported yet.
         */
        subscript?: boolean | null;
        /**
         * Whether the text is a superscript. This feature is not supported yet.
         */
        superscript?: boolean | null;
        /**
         * Color of the text.
         */
        textColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is underlined.
         */
        underlined?: boolean | null;
    }
    /**
     * Detected non-text visual elements e.g. checkbox, signature etc. on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentPageVisualElement {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1DocumentPageDetectedLanguage[];
        /**
         * Layout for VisualElement.
         */
        layout?: Schema$GoogleCloudDocumentaiV1DocumentPageLayout;
        /**
         * Type of the VisualElement.
         */
        type?: string | null;
    }
    /**
     * Structure to identify provenance relationships between annotations in different revisions.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentProvenance {
        /**
         * The Id of this operation. Needs to be unique within the scope of the revision.
         */
        id?: number | null;
        /**
         * References to the original elements that are replaced.
         */
        parents?: Schema$GoogleCloudDocumentaiV1DocumentProvenanceParent[];
        /**
         * The index of the revision that produced this element.
         */
        revision?: number | null;
        /**
         * The type of provenance operation.
         */
        type?: string | null;
    }
    /**
     * The parent element the current element is based on. Used for referencing/aligning, removal and replacement operations.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentProvenanceParent {
        /**
         * The id of the parent provenance.
         */
        id?: number | null;
        /**
         * The index of the parent item in the corresponding item list (eg. list of entities, properties within entities, etc.) in the parent revision.
         */
        index?: number | null;
        /**
         * The index of the index into current revision's parent_ids list.
         */
        revision?: number | null;
    }
    /**
     * Contains past or forward revisions of this document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentRevision {
        /**
         * If the change was made by a person specify the name or id of that person.
         */
        agent?: string | null;
        /**
         * The time that the revision was created, internally generated by doc proto storage at the time of create.
         */
        createTime?: string | null;
        /**
         * Human Review information of this revision.
         */
        humanReview?: Schema$GoogleCloudDocumentaiV1DocumentRevisionHumanReview;
        /**
         * Id of the revision, internally generated by doc proto storage. Unique within the context of the document.
         */
        id?: string | null;
        /**
         * The revisions that this revision is based on. This can include one or more parent (when documents are merged.) This field represents the index into the `revisions` field.
         */
        parent?: number[] | null;
        /**
         * The revisions that this revision is based on. Must include all the ids that have anything to do with this revision - eg. there are `provenance.parent.revision` fields that index into this field.
         */
        parentIds?: string[] | null;
        /**
         * If the annotation was made by processor identify the processor by its resource name.
         */
        processor?: string | null;
    }
    /**
     * Human Review information of the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentRevisionHumanReview {
        /**
         * Human review state. e.g. `requested`, `succeeded`, `rejected`.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the rejection reason when the state is `rejected`.
         */
        stateMessage?: string | null;
    }
    /**
     * For a large document, sharding may be performed to produce several document shards. Each document shard contains this field to detail which shard it is.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentShardInfo {
        /**
         * Total number of shards.
         */
        shardCount?: string | null;
        /**
         * The 0-based index of this shard.
         */
        shardIndex?: string | null;
        /**
         * The index of the first character in Document.text in the overall document global text.
         */
        textOffset?: string | null;
    }
    /**
     * Annotation for common text style attributes. This adheres to CSS conventions as much as possible.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentStyle {
        /**
         * Text background color.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Text color.
         */
        color?: Schema$GoogleTypeColor;
        /**
         * Font family such as `Arial`, `Times New Roman`. https://www.w3schools.com/cssref/pr_font_font-family.asp
         */
        fontFamily?: string | null;
        /**
         * Font size.
         */
        fontSize?: Schema$GoogleCloudDocumentaiV1DocumentStyleFontSize;
        /**
         * [Font weight](https://www.w3schools.com/cssref/pr_font_weight.asp). Possible values are `normal`, `bold`, `bolder`, and `lighter`.
         */
        fontWeight?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1DocumentTextAnchor;
        /**
         * [Text decoration](https://www.w3schools.com/cssref/pr_text_text-decoration.asp). Follows CSS standard.
         */
        textDecoration?: string | null;
        /**
         * [Text style](https://www.w3schools.com/cssref/pr_font_font-style.asp). Possible values are `normal`, `italic`, and `oblique`.
         */
        textStyle?: string | null;
    }
    /**
     * Font size with unit.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentStyleFontSize {
        /**
         * Font size for the text.
         */
        size?: number | null;
        /**
         * Unit for the font size. Follows CSS naming (such as `in`, `px`, and `pt`).
         */
        unit?: string | null;
    }
    /**
     * Text reference indexing into the Document.text.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentTextAnchor {
        /**
         * Contains the content of the text span so that users do not have to look it up in the text_segments. It is always populated for formFields.
         */
        content?: string | null;
        /**
         * The text segments from the Document.text.
         */
        textSegments?: Schema$GoogleCloudDocumentaiV1DocumentTextAnchorTextSegment[];
    }
    /**
     * A text segment in the Document.text. The indices may be out of bounds which indicate that the text extends into another document shard for large sharded documents. See ShardInfo.text_offset
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentTextAnchorTextSegment {
        /**
         * TextSegment half open end UTF-8 char index in the Document.text.
         */
        endIndex?: string | null;
        /**
         * TextSegment start UTF-8 char index in the Document.text.
         */
        startIndex?: string | null;
    }
    /**
     * This message is used for text changes aka. OCR corrections.
     */
    export interface Schema$GoogleCloudDocumentaiV1DocumentTextChange {
        /**
         * The text that replaces the text identified in the `text_anchor`.
         */
        changedText?: string | null;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1DocumentProvenance[];
        /**
         * Provenance of the correction. Text anchor indexing into the Document.text. There can only be a single `TextAnchor.text_segments` element. If the start and end index of the text segment are the same, the text change is inserted before that index.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1DocumentTextAnchor;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudDocumentaiV1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudDocumentaiV1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    /**
     * Specifies the audit configuration for a service. The configuration determines which permission types are logged, and what identities, if any, are exempted from logging. An AuditConfig must have one or more AuditLogConfigs. If there are AuditConfigs for both `allServices` and a specific service, the union of the two AuditConfigs is used for that service: the log_types specified in each AuditConfig are enabled, and the exempted_members in each AuditLogConfig are exempted. Example Policy with multiple AuditConfigs: { "audit_configs": [ { "service": "allServices", "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members": [ "user:jose@example.com" ] \}, { "log_type": "DATA_WRITE" \}, { "log_type": "ADMIN_READ" \} ] \}, { "service": "sampleservice.googleapis.com", "audit_log_configs": [ { "log_type": "DATA_READ" \}, { "log_type": "DATA_WRITE", "exempted_members": [ "user:aliya@example.com" ] \} ] \} ] \} For sampleservice, this policy enables DATA_READ, DATA_WRITE and ADMIN_READ logging. It also exempts `jose@example.com` from DATA_READ logging, and `aliya@example.com` from DATA_WRITE logging.
     */
    export interface Schema$GoogleIamV1AuditConfig {
        /**
         * The configuration for logging of each type of permission.
         */
        auditLogConfigs?: Schema$GoogleIamV1AuditLogConfig[];
        /**
         * Specifies a service that will be enabled for audit logging. For example, `storage.googleapis.com`, `cloudsql.googleapis.com`. `allServices` is a special value that covers all services.
         */
        service?: string | null;
    }
    /**
     * Provides the configuration for logging a type of permissions. Example: { "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members": [ "user:jose@example.com" ] \}, { "log_type": "DATA_WRITE" \} ] \} This enables 'DATA_READ' and 'DATA_WRITE' logging, while exempting jose@example.com from DATA_READ logging.
     */
    export interface Schema$GoogleIamV1AuditLogConfig {
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
     * Associates `members`, or principals, with a `role`.
     */
    export interface Schema$GoogleIamV1Binding {
        /**
         * The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the principals in this binding. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$GoogleTypeExpr;
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
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** ``` { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} ``` **YAML example:** ``` bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') etag: BwWWja0YfJA= version: 3 ``` For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$GoogleIamV1Policy {
        /**
         * Specifies cloud audit logging configuration for this policy.
         */
        auditConfigs?: Schema$GoogleIamV1AuditConfig[];
        /**
         * Associates a list of `members`, or principals, with a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one principal. The `bindings` in a `Policy` can refer to up to 1,500 principals; up to 250 of these principals can be Google groups. Each occurrence of a principal counts towards these limits. For example, if the `bindings` grant 50 different roles to `user:alice@example.com`, and not to any other principal, then you can add another 1,450 principals to the `bindings` in the `Policy`.
         */
        bindings?: Schema$GoogleIamV1Binding[];
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
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
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
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
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
    /**
     * Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. For example, the fields of this representation can be trivially provided to the constructor of `java.awt.Color` in Java; it can also be trivially provided to UIColor's `+colorWithRed:green:blue:alpha` method in iOS; and, with just a little work, it can be easily formatted into a CSS `rgba()` string in JavaScript. This reference page doesn't have information about the absolute color space that should be used to interpret the RGB value—for example, sRGB, Adobe RGB, DCI-P3, and BT.2020. By default, applications should assume the sRGB color space. When color equality needs to be decided, implementations, unless documented otherwise, treat two colors as equal if all their red, green, blue, and alpha values each differ by at most `1e-5`. Example (Java): import com.google.type.Color; // ... public static java.awt.Color fromProto(Color protocolor) { float alpha = protocolor.hasAlpha() ? protocolor.getAlpha().getValue() : 1.0; return new java.awt.Color( protocolor.getRed(), protocolor.getGreen(), protocolor.getBlue(), alpha); \} public static Color toProto(java.awt.Color color) { float red = (float) color.getRed(); float green = (float) color.getGreen(); float blue = (float) color.getBlue(); float denominator = 255.0; Color.Builder resultBuilder = Color .newBuilder() .setRed(red / denominator) .setGreen(green / denominator) .setBlue(blue / denominator); int alpha = color.getAlpha(); if (alpha != 255) { result.setAlpha( FloatValue .newBuilder() .setValue(((float) alpha) / denominator) .build()); \} return resultBuilder.build(); \} // ... Example (iOS / Obj-C): // ... static UIColor* fromProto(Color* protocolor) { float red = [protocolor red]; float green = [protocolor green]; float blue = [protocolor blue]; FloatValue* alpha_wrapper = [protocolor alpha]; float alpha = 1.0; if (alpha_wrapper != nil) { alpha = [alpha_wrapper value]; \} return [UIColor colorWithRed:red green:green blue:blue alpha:alpha]; \} static Color* toProto(UIColor* color) { CGFloat red, green, blue, alpha; if (![color getRed:&red green:&green blue:&blue alpha:&alpha]) { return nil; \} Color* result = [[Color alloc] init]; [result setRed:red]; [result setGreen:green]; [result setBlue:blue]; if (alpha <= 0.9999) { [result setAlpha:floatWrapperWithValue(alpha)]; \} [result autorelease]; return result; \} // ... Example (JavaScript): // ... var protoToCssColor = function(rgb_color) { var redFrac = rgb_color.red || 0.0; var greenFrac = rgb_color.green || 0.0; var blueFrac = rgb_color.blue || 0.0; var red = Math.floor(redFrac * 255); var green = Math.floor(greenFrac * 255); var blue = Math.floor(blueFrac * 255); if (!('alpha' in rgb_color)) { return rgbToCssColor(red, green, blue); \} var alphaFrac = rgb_color.alpha.value || 0.0; var rgbParams = [red, green, blue].join(','); return ['rgba(', rgbParams, ',', alphaFrac, ')'].join(''); \}; var rgbToCssColor = function(red, green, blue) { var rgbNumber = new Number((red << 16) | (green << 8) | blue); var hexString = rgbNumber.toString(16); var missingZeros = 6 - hexString.length; var resultBuilder = ['#']; for (var i = 0; i < missingZeros; i++) { resultBuilder.push('0'); \} resultBuilder.push(hexString); return resultBuilder.join(''); \}; // ...
     */
    export interface Schema$GoogleTypeColor {
        /**
         * The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a completely transparent color. This uses a wrapper message rather than a simple float scalar so that it is possible to distinguish between a default value and the value being unset. If omitted, this color object is rendered as a solid color (as if the alpha value had been explicitly given a value of 1.0).
         */
        alpha?: number | null;
        /**
         * The amount of blue in the color as a value in the interval [0, 1].
         */
        blue?: number | null;
        /**
         * The amount of green in the color as a value in the interval [0, 1].
         */
        green?: number | null;
        /**
         * The amount of red in the color as a value in the interval [0, 1].
         */
        red?: number | null;
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$GoogleTypeDate {
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
     * Represents civil time (or occasionally physical time). This type can represent a civil time in one of a few possible ways: * When utc_offset is set and time_zone is unset: a civil time on a calendar day with a particular offset from UTC. * When time_zone is set and utc_offset is unset: a civil time on a calendar day in a particular time zone. * When neither time_zone nor utc_offset is set: a civil time on a calendar day in local time. The date is relative to the Proleptic Gregorian Calendar. If year, month, or day are 0, the DateTime is considered not to have a specific year, month, or day respectively. This type may also be used to represent a physical time if all the date and time fields are set and either case of the `time_offset` oneof is set. Consider using `Timestamp` message for physical time instead. If your use case also would like to store the user's timezone, that can be done in another field. This type is more flexible than some applications may want. Make sure to document and validate your application's limitations.
     */
    export interface Schema$GoogleTypeDateTime {
        /**
         * Optional. Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a datetime without a day.
         */
        day?: number | null;
        /**
         * Optional. Hours of day in 24 hour format. Should be from 0 to 23, defaults to 0 (midnight). An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Optional. Minutes of hour of day. Must be from 0 to 59, defaults to 0.
         */
        minutes?: number | null;
        /**
         * Optional. Month of year. Must be from 1 to 12, or 0 if specifying a datetime without a month.
         */
        month?: number | null;
        /**
         * Optional. Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999, defaults to 0.
         */
        nanos?: number | null;
        /**
         * Optional. Seconds of minutes of the time. Must normally be from 0 to 59, defaults to 0. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
        /**
         * Time zone.
         */
        timeZone?: Schema$GoogleTypeTimeZone;
        /**
         * UTC offset. Must be whole seconds, between -18 hours and +18 hours. For example, a UTC offset of -4:00 would be represented as { seconds: -14400 \}.
         */
        utcOffset?: string | null;
        /**
         * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a datetime without a year.
         */
        year?: number | null;
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
     */
    export interface Schema$GoogleTypeExpr {
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
     * Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive). The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time.
     */
    export interface Schema$GoogleTypeInterval {
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
     * Represents an amount of money with its currency type.
     */
    export interface Schema$GoogleTypeMoney {
        /**
         * The three-letter currency code defined in ISO 4217.
         */
        currencyCode?: string | null;
        /**
         * Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
         */
        nanos?: number | null;
        /**
         * The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
         */
        units?: string | null;
    }
    /**
     * Represents a postal address. For example for postal delivery or payments addresses. Given a postal address, a postal service can deliver items to a premise, P.O. Box or similar. It is not intended to model geographical locations (roads, towns, mountains). In typical usage an address would be created by user input or from importing existing data, depending on the type of process. Advice on address input / editing: - Use an internationalization-ready address widget such as https://github.com/google/libaddressinput) - Users should not be presented with UI elements for input or editing of fields outside countries where that field is used. For more guidance on how to use this schema, see: https://support.google.com/business/answer/6397478
     */
    export interface Schema$GoogleTypePostalAddress {
        /**
         * Unstructured address lines describing the lower levels of an address. Because values in address_lines do not have type information and may sometimes contain multiple values in a single field (For example "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country/region of the address. In places where this can vary (For example Japan), address_language is used to make it explicit (For example "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). This way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a region_code with all remaining information placed in the address_lines. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a region_code and address_lines, and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).
         */
        addressLines?: string[] | null;
        /**
         * Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. Specifically, for Spain this is the province and not the autonomous community (For example "Barcelona" and not "Catalonia"). Many countries don't use an administrative area in postal addresses. For example in Switzerland this should be left unpopulated.
         */
        administrativeArea?: string | null;
        /**
         * Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".
         */
        languageCode?: string | null;
        /**
         * Optional. Generally refers to the city/town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave locality empty and use address_lines.
         */
        locality?: string | null;
        /**
         * Optional. The name of the organization at the address.
         */
        organization?: string | null;
        /**
         * Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (For example state/zip validation in the U.S.A.).
         */
        postalCode?: string | null;
        /**
         * Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.
         */
        recipients?: string[] | null;
        /**
         * Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See https://cldr.unicode.org/ and https://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.
         */
        regionCode?: string | null;
        /**
         * The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.
         */
        revision?: number | null;
        /**
         * Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (For example "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (For example Côte d'Ivoire).
         */
        sortingCode?: string | null;
        /**
         * Optional. Sublocality of the address. For example, this can be neighborhoods, boroughs, districts.
         */
        sublocality?: string | null;
    }
    /**
     * Represents a time zone from the [IANA Time Zone Database](https://www.iana.org/time-zones).
     */
    export interface Schema$GoogleTypeTimeZone {
        /**
         * IANA Time Zone Database time zone. For example "America/New_York".
         */
        id?: string | null;
        /**
         * Optional. IANA Time Zone Database version number. For example "2019a".
         */
        version?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
        /**
         * Gets the access control policy for a resource. Returns NOT_FOUND error if the resource does not exist. Returns an empty policy if the resource exists but does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchAcl(params: Params$Resource$Projects$Fetchacl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchAcl(params?: Params$Resource$Projects$Fetchacl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>>;
        fetchAcl(params: Params$Resource$Projects$Fetchacl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchAcl(params: Params$Resource$Projects$Fetchacl, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        fetchAcl(params: Params$Resource$Projects$Fetchacl, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        fetchAcl(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        /**
         * Sets the access control policy for a resource. Replaces any existing policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAcl(params: Params$Resource$Projects$Setacl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAcl(params?: Params$Resource$Projects$Setacl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SetAclResponse>>;
        setAcl(params: Params$Resource$Projects$Setacl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAcl(params: Params$Resource$Projects$Setacl, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
        setAcl(params: Params$Resource$Projects$Setacl, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
        setAcl(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
    }
    export interface Params$Resource$Projects$Fetchacl extends StandardParameters {
        /**
         * Required. REQUIRED: The resource for which the policy is being requested. Format for document: projects/{project_number\}/locations/{location\}/documents/{document_id\}. Format for collection: projects/{project_number\}/locations/{location\}/collections/{collection_id\}. Format for project: projects/{project_number\}.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1FetchAclRequest;
    }
    export interface Params$Resource$Projects$Setacl extends StandardParameters {
        /**
         * Required. REQUIRED: The resource for which the policy is being requested. Format for document: projects/{project_number\}/locations/{location\}/documents/{document_id\}. Format for collection: projects/{project_number\}/locations/{location\}/collections/{collection_id\}. Format for project: projects/{project_number\}.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1SetAclRequest;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        documents: Resource$Projects$Locations$Documents;
        documentSchemas: Resource$Projects$Locations$Documentschemas;
        operations: Resource$Projects$Locations$Operations;
        ruleSets: Resource$Projects$Locations$Rulesets;
        synonymSets: Resource$Projects$Locations$Synonymsets;
        constructor(context: APIRequestContext);
        /**
         * Get the project status.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getStatus(params: Params$Resource$Projects$Locations$Getstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getStatus(params?: Params$Resource$Projects$Locations$Getstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ProjectStatus>>;
        getStatus(params: Params$Resource$Projects$Locations$Getstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getStatus(params: Params$Resource$Projects$Locations$Getstatus, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ProjectStatus>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ProjectStatus>): void;
        getStatus(params: Params$Resource$Projects$Locations$Getstatus, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ProjectStatus>): void;
        getStatus(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ProjectStatus>): void;
        /**
         * Provisions resources for given tenant project. Returns a long running operation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        initialize(params: Params$Resource$Projects$Locations$Initialize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        initialize(params?: Params$Resource$Projects$Locations$Initialize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        initialize(params: Params$Resource$Projects$Locations$Initialize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        initialize(params: Params$Resource$Projects$Locations$Initialize, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        initialize(params: Params$Resource$Projects$Locations$Initialize, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        initialize(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Run a predefined pipeline.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runPipeline(params: Params$Resource$Projects$Locations$Runpipeline, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runPipeline(params?: Params$Resource$Projects$Locations$Runpipeline, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        runPipeline(params: Params$Resource$Projects$Locations$Runpipeline, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runPipeline(params: Params$Resource$Projects$Locations$Runpipeline, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        runPipeline(params: Params$Resource$Projects$Locations$Runpipeline, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        runPipeline(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Getstatus extends StandardParameters {
        /**
         * Required. The location to be queried Format: projects/{project_number\}/locations/{location\}.
         */
        location?: string;
    }
    export interface Params$Resource$Projects$Locations$Initialize extends StandardParameters {
        /**
         * Required. The location to be initialized Format: projects/{project_number\}/locations/{location\}.
         */
        location?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1InitializeProjectRequest;
    }
    export interface Params$Resource$Projects$Locations$Runpipeline extends StandardParameters {
        /**
         * Required. The resource name which owns the resources of the pipeline. Format: projects/{project_number\}/locations/{location\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1RunPipelineRequest;
    }
    export class Resource$Projects$Locations$Documents {
        context: APIRequestContext;
        documentLinks: Resource$Projects$Locations$Documents$Documentlinks;
        referenceId: Resource$Projects$Locations$Documents$Referenceid;
        constructor(context: APIRequestContext);
        /**
         * Creates a document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Documents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Documents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse>>;
        create(params: Params$Resource$Projects$Locations$Documents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Documents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse>): void;
        create(params: Params$Resource$Projects$Locations$Documents$Create, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1CreateDocumentResponse>): void;
        /**
         * Deletes a document. Returns NOT_FOUND if the document does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Documents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Documents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Documents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the access control policy for a resource. Returns NOT_FOUND error if the resource does not exist. Returns an empty policy if the resource exists but does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchAcl(params: Params$Resource$Projects$Locations$Documents$Fetchacl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchAcl(params?: Params$Resource$Projects$Locations$Documents$Fetchacl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>>;
        fetchAcl(params: Params$Resource$Projects$Locations$Documents$Fetchacl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchAcl(params: Params$Resource$Projects$Locations$Documents$Fetchacl, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        fetchAcl(params: Params$Resource$Projects$Locations$Documents$Fetchacl, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        fetchAcl(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1FetchAclResponse>): void;
        /**
         * Gets a document. Returns NOT_FOUND if the document does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Documents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Documents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1Document>>;
        get(params: Params$Resource$Projects$Locations$Documents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Documents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        get(params: Params$Resource$Projects$Locations$Documents$Get, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        /**
         * Return all source document-links from the document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        linkedSources(params: Params$Resource$Projects$Locations$Documents$Linkedsources, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        linkedSources(params?: Params$Resource$Projects$Locations$Documents$Linkedsources, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse>>;
        linkedSources(params: Params$Resource$Projects$Locations$Documents$Linkedsources, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        linkedSources(params: Params$Resource$Projects$Locations$Documents$Linkedsources, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse>): void;
        linkedSources(params: Params$Resource$Projects$Locations$Documents$Linkedsources, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse>): void;
        linkedSources(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesResponse>): void;
        /**
         * Return all target document-links from the document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        linkedTargets(params: Params$Resource$Projects$Locations$Documents$Linkedtargets, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        linkedTargets(params?: Params$Resource$Projects$Locations$Documents$Linkedtargets, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse>>;
        linkedTargets(params: Params$Resource$Projects$Locations$Documents$Linkedtargets, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        linkedTargets(params: Params$Resource$Projects$Locations$Documents$Linkedtargets, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse>): void;
        linkedTargets(params: Params$Resource$Projects$Locations$Documents$Linkedtargets, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse>): void;
        linkedTargets(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsResponse>): void;
        /**
         * Lock the document so the document cannot be updated by other users.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lock(params: Params$Resource$Projects$Locations$Documents$Lock, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lock(params?: Params$Resource$Projects$Locations$Documents$Lock, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1Document>>;
        lock(params: Params$Resource$Projects$Locations$Documents$Lock, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lock(params: Params$Resource$Projects$Locations$Documents$Lock, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        lock(params: Params$Resource$Projects$Locations$Documents$Lock, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        lock(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        /**
         * Updates a document. Returns INVALID_ARGUMENT if the name of the document is non-empty and does not equal the existing name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Documents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Documents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>>;
        patch(params: Params$Resource$Projects$Locations$Documents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Documents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
        patch(params: Params$Resource$Projects$Locations$Documents$Patch, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
        /**
         * Searches for documents using provided SearchDocumentsRequest. This call only returns documents that the caller has permission to search against.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Projects$Locations$Documents$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Projects$Locations$Documents$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse>>;
        search(params: Params$Resource$Projects$Locations$Documents$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Projects$Locations$Documents$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse>): void;
        search(params: Params$Resource$Projects$Locations$Documents$Search, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SearchDocumentsResponse>): void;
        /**
         * Sets the access control policy for a resource. Replaces any existing policy.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAcl(params: Params$Resource$Projects$Locations$Documents$Setacl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAcl(params?: Params$Resource$Projects$Locations$Documents$Setacl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SetAclResponse>>;
        setAcl(params: Params$Resource$Projects$Locations$Documents$Setacl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAcl(params: Params$Resource$Projects$Locations$Documents$Setacl, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
        setAcl(params: Params$Resource$Projects$Locations$Documents$Setacl, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
        setAcl(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SetAclResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Documents$Create extends StandardParameters {
        /**
         * Required. The parent name. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1CreateDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Delete extends StandardParameters {
        /**
         * Required. The name of the document to delete. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1DeleteDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Fetchacl extends StandardParameters {
        /**
         * Required. REQUIRED: The resource for which the policy is being requested. Format for document: projects/{project_number\}/locations/{location\}/documents/{document_id\}. Format for collection: projects/{project_number\}/locations/{location\}/collections/{collection_id\}. Format for project: projects/{project_number\}.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1FetchAclRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Get extends StandardParameters {
        /**
         * Required. The name of the document to retrieve. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1GetDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Linkedsources extends StandardParameters {
        /**
         * Required. The name of the document, for which all source links are returned. Format: projects/{project_number\}/locations/{location\}/documents/{source_document_id\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1ListLinkedSourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Linkedtargets extends StandardParameters {
        /**
         * Required. The name of the document, for which all target links are returned. Format: projects/{project_number\}/locations/{location\}/documents/{target_document_id\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1ListLinkedTargetsRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Lock extends StandardParameters {
        /**
         * Required. The name of the document to lock. Format: projects/{project_number\}/locations/{location\}/documents/{document\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1LockDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Patch extends StandardParameters {
        /**
         * Required. The name of the document to update. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1UpdateDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Search extends StandardParameters {
        /**
         * Required. The parent, which owns this collection of documents. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1SearchDocumentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Setacl extends StandardParameters {
        /**
         * Required. REQUIRED: The resource for which the policy is being requested. Format for document: projects/{project_number\}/locations/{location\}/documents/{document_id\}. Format for collection: projects/{project_number\}/locations/{location\}/collections/{collection_id\}. Format for project: projects/{project_number\}.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1SetAclRequest;
    }
    export class Resource$Projects$Locations$Documents$Documentlinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a link between a source document and a target document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Documents$Documentlinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1DocumentLink>>;
        create(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentLink>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentLink>): void;
        create(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Create, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentLink>): void;
        /**
         * Remove the link between the source and target documents.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Documents$Documentlinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Documentlinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
    }
    export interface Params$Resource$Projects$Locations$Documents$Documentlinks$Create extends StandardParameters {
        /**
         * Required. Parent of the document-link to be created. parent of document-link should be a document. Format: projects/{project_number\}/locations/{location\}/documents/{source_document_id\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1CreateDocumentLinkRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Documentlinks$Delete extends StandardParameters {
        /**
         * Required. The name of the document-link to be deleted. Format: projects/{project_number\}/locations/{location\}/documents/{source_document_id\}/documentLinks/{document_link_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1DeleteDocumentLinkRequest;
    }
    export class Resource$Projects$Locations$Documents$Referenceid {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a document. Returns NOT_FOUND if the document does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Documents$Referenceid$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Documents$Referenceid$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Documents$Referenceid$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Referenceid$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Documents$Referenceid$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a document. Returns NOT_FOUND if the document does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Documents$Referenceid$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Documents$Referenceid$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1Document>>;
        get(params: Params$Resource$Projects$Locations$Documents$Referenceid$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Documents$Referenceid$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        get(params: Params$Resource$Projects$Locations$Documents$Referenceid$Get, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1Document>): void;
        /**
         * Updates a document. Returns INVALID_ARGUMENT if the name of the document is non-empty and does not equal the existing name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Documents$Referenceid$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Documents$Referenceid$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>>;
        patch(params: Params$Resource$Projects$Locations$Documents$Referenceid$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Documents$Referenceid$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
        patch(params: Params$Resource$Projects$Locations$Documents$Referenceid$Patch, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1UpdateDocumentResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Documents$Referenceid$Delete extends StandardParameters {
        /**
         * Required. The name of the document to delete. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1DeleteDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Referenceid$Get extends StandardParameters {
        /**
         * Required. The name of the document to retrieve. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1GetDocumentRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Referenceid$Patch extends StandardParameters {
        /**
         * Required. The name of the document to update. Format: projects/{project_number\}/locations/{location\}/documents/{document_id\} or projects/{project_number\}/locations/{location\}/documents/referenceId/{reference_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1UpdateDocumentRequest;
    }
    export class Resource$Projects$Locations$Documentschemas {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a document schema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Documentschemas$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Documentschemas$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1DocumentSchema>>;
        create(params: Params$Resource$Projects$Locations$Documentschemas$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Documentschemas$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        create(params: Params$Resource$Projects$Locations$Documentschemas$Create, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        /**
         * Deletes a document schema. Returns NOT_FOUND if the document schema does not exist. Returns BAD_REQUEST if the document schema has documents depending on it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Documentschemas$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Documentschemas$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Documentschemas$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Documentschemas$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Documentschemas$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a document schema. Returns NOT_FOUND if the document schema does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Documentschemas$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Documentschemas$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1DocumentSchema>>;
        get(params: Params$Resource$Projects$Locations$Documentschemas$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Documentschemas$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        get(params: Params$Resource$Projects$Locations$Documentschemas$Get, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        /**
         * Lists document schemas.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Documentschemas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Documentschemas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse>>;
        list(params: Params$Resource$Projects$Locations$Documentschemas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Documentschemas$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse>): void;
        list(params: Params$Resource$Projects$Locations$Documentschemas$List, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListDocumentSchemasResponse>): void;
        /**
         * Updates a Document Schema. Returns INVALID_ARGUMENT if the name of the Document Schema is non-empty and does not equal the existing name. Supports only appending new properties, adding new ENUM possible values, and updating the EnumTypeOptions.validation_check_disabled flag for ENUM possible values. Updating existing properties will result into INVALID_ARGUMENT.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Documentschemas$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Documentschemas$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1DocumentSchema>>;
        patch(params: Params$Resource$Projects$Locations$Documentschemas$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Documentschemas$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        patch(params: Params$Resource$Projects$Locations$Documentschemas$Patch, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1DocumentSchema>): void;
    }
    export interface Params$Resource$Projects$Locations$Documentschemas$Create extends StandardParameters {
        /**
         * Required. The parent name.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1DocumentSchema;
    }
    export interface Params$Resource$Projects$Locations$Documentschemas$Delete extends StandardParameters {
        /**
         * Required. The name of the document schema to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Documentschemas$Get extends StandardParameters {
        /**
         * Required. The name of the document schema to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Documentschemas$List extends StandardParameters {
        /**
         * The maximum number of document schemas to return. The service may return fewer than this value. If unspecified, at most 50 document schemas will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListDocumentSchemas` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDocumentSchemas` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of document schemas. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Documentschemas$Patch extends StandardParameters {
        /**
         * Required. The name of the document schema to update. Format: projects/{project_number\}/locations/{location\}/documentSchemas/{document_schema_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1UpdateDocumentSchemaRequest;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Rulesets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a ruleset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Rulesets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Rulesets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1RuleSet>>;
        create(params: Params$Resource$Projects$Locations$Rulesets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Rulesets$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        create(params: Params$Resource$Projects$Locations$Rulesets$Create, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        /**
         * Deletes a ruleset. Returns NOT_FOUND if the document does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Rulesets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Rulesets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Rulesets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Rulesets$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Rulesets$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a ruleset. Returns NOT_FOUND if the ruleset does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Rulesets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Rulesets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1RuleSet>>;
        get(params: Params$Resource$Projects$Locations$Rulesets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Rulesets$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        get(params: Params$Resource$Projects$Locations$Rulesets$Get, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        /**
         * Lists rulesets.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Rulesets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Rulesets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse>>;
        list(params: Params$Resource$Projects$Locations$Rulesets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Rulesets$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Rulesets$List, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListRuleSetsResponse>): void;
        /**
         * Updates a ruleset. Returns INVALID_ARGUMENT if the name of the ruleset is non-empty and does not equal the existing name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Rulesets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Rulesets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1RuleSet>>;
        patch(params: Params$Resource$Projects$Locations$Rulesets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Rulesets$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        patch(params: Params$Resource$Projects$Locations$Rulesets$Patch, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1RuleSet>): void;
    }
    export interface Params$Resource$Projects$Locations$Rulesets$Create extends StandardParameters {
        /**
         * Required. The parent name. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1RuleSet;
    }
    export interface Params$Resource$Projects$Locations$Rulesets$Delete extends StandardParameters {
        /**
         * Required. The name of the rule set to delete. Format: projects/{project_number\}/locations/{location\}/ruleSets/{rule_set_id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Rulesets$Get extends StandardParameters {
        /**
         * Required. The name of the rule set to retrieve. Format: projects/{project_number\}/locations/{location\}/ruleSets/{rule_set_id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Rulesets$List extends StandardParameters {
        /**
         * The maximum number of rule sets to return. The service may return fewer than this value. If unspecified, at most 50 rule sets will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListRuleSets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListRuleSets` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of document. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Rulesets$Patch extends StandardParameters {
        /**
         * Required. The name of the rule set to update. Format: projects/{project_number\}/locations/{location\}/ruleSets/{rule_set_id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1UpdateRuleSetRequest;
    }
    export class Resource$Projects$Locations$Synonymsets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a SynonymSet for a single context. Throws an ALREADY_EXISTS exception if a synonymset already exists for the context.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Synonymsets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Synonymsets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SynonymSet>>;
        create(params: Params$Resource$Projects$Locations$Synonymsets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Synonymsets$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        create(params: Params$Resource$Projects$Locations$Synonymsets$Create, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        /**
         * Deletes a SynonymSet for a given context. Throws a NOT_FOUND exception if the SynonymSet is not found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Synonymsets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Synonymsets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Synonymsets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Synonymsets$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Synonymsets$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a SynonymSet for a particular context. Throws a NOT_FOUND exception if the Synonymset does not exist
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Synonymsets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Synonymsets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SynonymSet>>;
        get(params: Params$Resource$Projects$Locations$Synonymsets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Synonymsets$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        get(params: Params$Resource$Projects$Locations$Synonymsets$Get, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        /**
         * Returns all SynonymSets (for all contexts) for the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Synonymsets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Synonymsets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse>>;
        list(params: Params$Resource$Projects$Locations$Synonymsets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Synonymsets$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Synonymsets$List, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1ListSynonymSetsResponse>): void;
        /**
         * Remove the existing SynonymSet for the context and replaces it with a new one. Throws a NOT_FOUND exception if the SynonymSet is not found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Synonymsets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Synonymsets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudContentwarehouseV1SynonymSet>>;
        patch(params: Params$Resource$Projects$Locations$Synonymsets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Synonymsets$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        patch(params: Params$Resource$Projects$Locations$Synonymsets$Patch, callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudContentwarehouseV1SynonymSet>): void;
    }
    export interface Params$Resource$Projects$Locations$Synonymsets$Create extends StandardParameters {
        /**
         * Required. The parent name. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1SynonymSet;
    }
    export interface Params$Resource$Projects$Locations$Synonymsets$Delete extends StandardParameters {
        /**
         * Required. The name of the synonymSet to delete Format: projects/{project_number\}/locations/{location\}/synonymSets/{context\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Synonymsets$Get extends StandardParameters {
        /**
         * Required. The name of the synonymSet to retrieve Format: projects/{project_number\}/locations/{location\}/synonymSets/{context\}.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Synonymsets$List extends StandardParameters {
        /**
         * The maximum number of synonymSets to return. The service may return fewer than this value. If unspecified, at most 50 rule sets will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListSynonymSets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSynonymSets` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent name. Format: projects/{project_number\}/locations/{location\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Synonymsets$Patch extends StandardParameters {
        /**
         * Required. The name of the synonymSet to update Format: projects/{project_number\}/locations/{location\}/synonymSets/{context\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudContentwarehouseV1SynonymSet;
    }
    export {};
}
