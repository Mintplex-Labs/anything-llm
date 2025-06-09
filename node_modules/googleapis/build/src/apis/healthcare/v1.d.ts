import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace healthcare_v1 {
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
     * Cloud Healthcare API
     *
     * Manage, store, and access healthcare data in Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const healthcare = google.healthcare('v1');
     * ```
     */
    export class Healthcare {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Configures consent audit log config for FHIR create, read, update, and delete (CRUD) operations. Cloud audit log for healthcare API must be [enabled](https://cloud.google.com/logging/docs/audit/configure-data-access#config-console-enable). The consent-related logs are included as part of `protoPayload.metadata`.
     */
    export interface Schema$AccessDeterminationLogConfig {
        /**
         * Optional. Controls the amount of detail to include as part of the audit logs.
         */
        logLevel?: string | null;
    }
    /**
     * Activates the latest revision of the specified Consent by committing a new revision with `state` updated to `ACTIVE`. If the latest revision of the given Consent is in the `ACTIVE` state, no new revision is committed. A FAILED_PRECONDITION error occurs if the latest revision of the given consent is in the `REJECTED` or `REVOKED` state.
     */
    export interface Schema$ActivateConsentRequest {
        /**
         * Required. The resource name of the Consent artifact that contains documentation of the user's consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consentArtifacts/{consent_artifact_id\}`. If the draft Consent had a Consent artifact, this Consent artifact overwrites it.
         */
        consentArtifact?: string | null;
        /**
         * Timestamp in UTC of when this Consent is considered expired.
         */
        expireTime?: string | null;
        /**
         * The time to live for this Consent from when it is marked as active.
         */
        ttl?: string | null;
    }
    /**
     * List of admin Consent resources to be applied.
     */
    export interface Schema$AdminConsents {
        /**
         * Optional. The versioned names of the admin Consent resource(s), in the format `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}/_history/{version_id\}`. For FHIR stores with `disable_resource_versioning=true`, the format is `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}`.
         */
        names?: string[] | null;
    }
    /**
     * The request to analyze healthcare entities in a document.
     */
    export interface Schema$AnalyzeEntitiesRequest {
        /**
         * Optional. Alternative output format to be generated based on the results of analysis.
         */
        alternativeOutputFormat?: string | null;
        /**
         * document_content is a document to be annotated.
         */
        documentContent?: string | null;
        /**
         * A list of licensed vocabularies to use in the request, in addition to the default unlicensed vocabularies.
         */
        licensedVocabularies?: string[] | null;
    }
    /**
     * Includes recognized entity mentions and relationships between them.
     */
    export interface Schema$AnalyzeEntitiesResponse {
        /**
         * The union of all the candidate entities that the entity_mentions in this response could link to. These are UMLS concepts or normalized mention content.
         */
        entities?: Schema$Entity[];
        /**
         * The `entity_mentions` field contains all the annotated medical entities that were mentioned in the provided document.
         */
        entityMentions?: Schema$EntityMention[];
        /**
         * The FHIR bundle ([`R4`](http://hl7.org/fhir/R4/bundle.html)) that includes all the entities, the entity mentions, and the relationships in JSON format.
         */
        fhirBundle?: string | null;
        /**
         * relationships contains all the binary relationships that were identified between entity mentions within the provided document.
         */
        relationships?: Schema$EntityMentionRelationship[];
    }
    /**
     * Contains the error details of the unsupported admin Consent resources for when the ApplyAdminConsents method fails to apply one or more Consent resources.
     */
    export interface Schema$ApplyAdminConsentsErrorDetail {
        /**
         * The list of Consent resources that are unsupported or cannot be applied and the error associated with each of them.
         */
        consentErrors?: Schema$ConsentErrors[];
        /**
         * The currently in progress non-validate-only ApplyAdminConsents operation ID if exist.
         */
        existingOperationId?: string | null;
    }
    /**
     * Request to apply the admin Consent resources for the specified FHIR store.
     */
    export interface Schema$ApplyAdminConsentsRequest {
        /**
         * A new list of admin Consent resources to be applied. Any existing enforced Consents, which are specified in `consent_config.enforced_admin_consents` of the FhirStore, that are not part of this list will be disabled. An empty list is equivalent to clearing or disabling all Consents enforced on the FHIR store. When a FHIR store has `disable_resource_versioning=true` and this list contains a Consent resource that exists in `consent_config.enforced_admin_consents`, the method enforces any updates to the existing resource since the last enforcement. If the existing resource hasn't been updated since the last enforcement, the resource is unaffected. After the method finishes, the resulting consent enforcement model is determined by the contents of the Consent resource(s) when the method was called: * When `disable_resource_versioning=true`, the result is identical to the current resource(s) in the FHIR store. * When `disable_resource_versioning=false`, the result is based on the historical version(s) of the Consent resource(s) at the point in time when the method was called. At most 200 Consents can be specified.
         */
        newConsentsList?: Schema$AdminConsents;
        /**
         * Optional. If true, the method only validates Consent resources to make sure they are supported. Otherwise, the method applies the aggregate consent information to update the enforcement model and reindex the FHIR resources. If all Consent resources can be applied successfully, the ApplyAdminConsentsResponse is returned containing the following fields: * `consent_apply_success` to indicate the number of Consent resources applied. * `affected_resources` to indicate the number of resources that might have had their consent access changed. If, however, one or more Consent resources are unsupported or cannot be applied, the method fails and ApplyAdminConsentsErrorDetail is is returned with details about the unsupported Consent resources.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Response when all admin Consent resources in scope were processed and all affected resources were reindexed successfully. This structure will be included in the response when the operation finishes successfully.
     */
    export interface Schema$ApplyAdminConsentsResponse {
        /**
         * The number of resources (including the Consent resources) that may have consent access change.
         */
        affectedResources?: string | null;
        /**
         * If `validate_only=false` in ApplyAdminConsentsRequest, this counter contains the number of Consent resources that were successfully applied. Otherwise, it is the number of Consent resources that are supported.
         */
        consentApplySuccess?: string | null;
        /**
         * The number of resources (including the Consent resources) that ApplyAdminConsents failed to re-index.
         */
        failedResources?: string | null;
    }
    /**
     * Request to apply the Consent resources for the specified FHIR store.
     */
    export interface Schema$ApplyConsentsRequest {
        /**
         * Optional. Scope down to a list of patients.
         */
        patientScope?: Schema$PatientScope;
        /**
         * Optional. Scope down to patients whose most recent consent changes are in the time range. Can only be used with a versioning store (i.e. when disable_resource_versioning is set to false).
         */
        timeRange?: Schema$TimeRange;
        /**
         * Optional. If true, the method only validates Consent resources to make sure they are supported. When the operation completes, ApplyConsentsResponse is returned where `consent_apply_success` and `consent_apply_failure` indicate supported and unsupported (or invalid) Consent resources, respectively. Otherwise, the method propagates the aggregate consensual information to the patient's resources. Upon success, `affected_resources` in the ApplyConsentsResponse indicates the number of resources that may have consensual access changed.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Response when all Consent resources in scope were processed and all affected resources were reindexed successfully. This structure is included in the response when the operation finishes successfully.
     */
    export interface Schema$ApplyConsentsResponse {
        /**
         * The number of resources (including the Consent resources) that may have consensual access change.
         */
        affectedResources?: string | null;
        /**
         * If `validate_only = false` in ApplyConsentsRequest, this counter is the number of Consent resources that were failed to apply. Otherwise, it is the number of Consent resources that are not supported or invalid.
         */
        consentApplyFailure?: string | null;
        /**
         * If `validate_only = false` in ApplyConsentsRequest, this counter is the number of Consent resources that were successfully applied. Otherwise, it is the number of Consent resources that are supported.
         */
        consentApplySuccess?: string | null;
        /**
         * The number of resources (including the Consent resources) that ApplyConsents failed to re-index.
         */
        failedResources?: string | null;
    }
    /**
     * Archives the specified User data mapping.
     */
    export interface Schema$ArchiveUserDataMappingRequest {
    }
    /**
     * Archives the specified User data mapping.
     */
    export interface Schema$ArchiveUserDataMappingResponse {
    }
    /**
     * An attribute value for a Consent or User data mapping. Each Attribute must have a corresponding AttributeDefinition in the consent store that defines the default and allowed values.
     */
    export interface Schema$Attribute {
        /**
         * Indicates the name of an attribute defined in the consent store.
         */
        attributeDefinitionId?: string | null;
        /**
         * Required. The value of the attribute. Must be an acceptable value as defined in the consent store. For example, if the consent store defines "data type" with acceptable values "questionnaire" and "step-count", when the attribute name is data type, this field must contain one of those values.
         */
        values?: string[] | null;
    }
    /**
     * A client-defined consent attribute.
     */
    export interface Schema$AttributeDefinition {
        /**
         * Required. Possible values for the attribute. The number of allowed values must not exceed 500. An empty list is invalid. The list can only be expanded after creation.
         */
        allowedValues?: string[] | null;
        /**
         * Required. The category of the attribute. The value of this field cannot be changed after creation.
         */
        category?: string | null;
        /**
         * Optional. Default values of the attribute in Consents. If no default values are specified, it defaults to an empty value.
         */
        consentDefaultValues?: string[] | null;
        /**
         * Optional. Default value of the attribute in User data mappings. If no default value is specified, it defaults to an empty value. This field is only applicable to attributes of the category `RESOURCE`.
         */
        dataMappingDefaultValue?: string | null;
        /**
         * Optional. A description of the attribute.
         */
        description?: string | null;
        /**
         * Identifier. Resource name of the Attribute definition, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/attributeDefinitions/{attribute_definition_id\}`. Cannot be changed after creation.
         */
        name?: string | null;
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
     * BlobStorageInfo contains details about the data stored in Blob Storage for the referenced resource. Note: Storage class is only valid for DICOM and hence will only be populated for DICOM resources.
     */
    export interface Schema$BlobStorageInfo {
        /**
         * Size in bytes of data stored in Blob Storage.
         */
        sizeBytes?: string | null;
        /**
         * The storage class in which the Blob data is stored.
         */
        storageClass?: string | null;
        /**
         * The time at which the storage class was updated. This is used to compute early deletion fees of the resource.
         */
        storageClassUpdateTime?: string | null;
    }
    /**
     * Settings for data stored in Blob storage.
     */
    export interface Schema$BlobStorageSettings {
        /**
         * The Storage class in which the Blob data is stored.
         */
        blobStorageClass?: string | null;
    }
    /**
     * The configuration for exporting to Cloud Storage using the bulk export API.
     */
    export interface Schema$BulkExportGcsDestination {
        /**
         * Optional. URI for a Cloud Storage directory where the server writes result files, in the format `gs://{bucket-id\}/{path/to/destination/dir\}`. If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket referenced in `uri_prefix`.
         */
        uriPrefix?: string | null;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Mask a string by replacing its characters with a fixed character.
     */
    export interface Schema$CharacterMaskConfig {
        /**
         * Optional. Character to mask the sensitive values. If not supplied, defaults to "*".
         */
        maskingCharacter?: string | null;
    }
    /**
     * Checks if a particular data_id of a User data mapping in the given consent store is consented for a given use.
     */
    export interface Schema$CheckDataAccessRequest {
        /**
         * Optional. Specific Consents to evaluate the access request against. These Consents must have the same `user_id` as the evaluated User data mapping, must exist in the current `consent_store`, and have a `state` of either `ACTIVE` or `DRAFT`. A maximum of 100 Consents can be provided here. If no selection is specified, the access request is evaluated against all `ACTIVE` unexpired Consents with the same `user_id` as the evaluated User data mapping.
         */
        consentList?: Schema$ConsentList;
        /**
         * Required. The unique identifier of the resource to check access for. This identifier must correspond to a User data mapping in the given consent store.
         */
        dataId?: string | null;
        /**
         * The values of request attributes associated with this access request.
         */
        requestAttributes?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The view for CheckDataAccessResponse. If unspecified, defaults to `BASIC` and returns `consented` as `TRUE` or `FALSE`.
         */
        responseView?: string | null;
    }
    /**
     * Checks if a particular data_id of a User data mapping in the given consent store is consented for a given use.
     */
    export interface Schema$CheckDataAccessResponse {
        /**
         * The resource names of all evaluated Consents mapped to their evaluation.
         */
        consentDetails?: {
            [key: string]: Schema$ConsentEvaluation;
        } | null;
        /**
         * Whether the requested resource is consented for the given use.
         */
        consented?: boolean | null;
    }
    /**
     * Represents a user's consent.
     */
    export interface Schema$Consent {
        /**
         * Required. The resource name of the Consent artifact that contains proof of the end user's consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consentArtifacts/{consent_artifact_id\}`.
         */
        consentArtifact?: string | null;
        /**
         * Timestamp in UTC of when this Consent is considered expired.
         */
        expireTime?: string | null;
        /**
         * Optional. User-supplied key-value pairs used to organize Consent resources. Metadata keys must: - be between 1 and 63 characters long - have a UTF-8 encoding of maximum 128 bytes - begin with a letter - consist of up to 63 characters including lowercase letters, numeric characters, underscores, and dashes Metadata values must be: - be between 1 and 63 characters long - have a UTF-8 encoding of maximum 128 bytes - consist of up to 63 characters including lowercase letters, numeric characters, underscores, and dashes No more than 64 metadata entries can be associated with a given consent.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Resource name of the Consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. Cannot be changed after creation.
         */
        name?: string | null;
        /**
         * Optional. Represents a user's consent in terms of the resources that can be accessed and under what conditions.
         */
        policies?: Schema$GoogleCloudHealthcareV1ConsentPolicy[];
        /**
         * Output only. The timestamp that the revision was created.
         */
        revisionCreateTime?: string | null;
        /**
         * Output only. The revision ID of the Consent. The format is an 8-character hexadecimal string. Refer to a specific revision of a Consent by appending `@{revision_id\}` to the Consent's resource name.
         */
        revisionId?: string | null;
        /**
         * Required. Indicates the current state of this Consent.
         */
        state?: string | null;
        /**
         * Input only. The time to live for this Consent from when it is created.
         */
        ttl?: string | null;
        /**
         * Required. User's UUID provided by the client.
         */
        userId?: string | null;
    }
    /**
     * The accessor scope that describes who can access, for what purpose, in which environment.
     */
    export interface Schema$ConsentAccessorScope {
        /**
         * An individual, group, or access role that identifies the accessor or a characteristic of the accessor. This can be a resource ID (such as `{resourceType\}/{id\}`) or an external URI. This value must be present.
         */
        actor?: string | null;
        /**
         * An abstract identifier that describes the environment or conditions under which the accessor is acting. If it's not specified, it applies to all environments.
         */
        environment?: string | null;
        /**
         * The intent of data use. If it's not specified, it applies to all purposes.
         */
        purpose?: string | null;
    }
    /**
     * Documentation of a user's consent.
     */
    export interface Schema$ConsentArtifact {
        /**
         * Optional. Screenshots, PDFs, or other binary information documenting the user's consent.
         */
        consentContentScreenshots?: Schema$Image[];
        /**
         * Optional. An string indicating the version of the consent information shown to the user.
         */
        consentContentVersion?: string | null;
        /**
         * Optional. A signature from a guardian.
         */
        guardianSignature?: Schema$Signature;
        /**
         * Optional. Metadata associated with the Consent artifact. For example, the consent locale or user agent version.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Resource name of the Consent artifact, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consentArtifacts/{consent_artifact_id\}`. Cannot be changed after creation.
         */
        name?: string | null;
        /**
         * Required. User's UUID provided by the client.
         */
        userId?: string | null;
        /**
         * Optional. User's signature.
         */
        userSignature?: Schema$Signature;
        /**
         * Optional. A signature from a witness.
         */
        witnessSignature?: Schema$Signature;
    }
    /**
     * Configures whether to enforce consent for the FHIR store and which consent enforcement version is being used.
     */
    export interface Schema$ConsentConfig {
        /**
         * Optional. Specifies how the server logs the consent-aware requests. If not specified, the `AccessDeterminationLogConfig.LogLevel.MINIMUM` option is used.
         */
        accessDeterminationLogConfig?: Schema$AccessDeterminationLogConfig;
        /**
         * Optional. The default value is false. If set to true, when accessing FHIR resources, the consent headers will be verified against consents given by patients. See the ConsentEnforcementVersion for the supported consent headers.
         */
        accessEnforced?: boolean | null;
        /**
         * Optional. Different options to configure the behaviour of the server when handling the `X-Consent-Scope` header.
         */
        consentHeaderHandling?: Schema$ConsentHeaderHandling;
        /**
         * Output only. The versioned names of the enforced admin Consent resource(s), in the format `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}/_history/{version_id\}`. For FHIR stores with `disable_resource_versioning=true`, the format is `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}`. This field can only be updated using ApplyAdminConsents.
         */
        enforcedAdminConsents?: string[] | null;
        /**
         * Required. Specifies which consent enforcement version is being used for this FHIR store. This field can only be set once by either CreateFhirStore or UpdateFhirStore. After that, you must call ApplyConsents to change the version.
         */
        version?: string | null;
    }
    /**
     * The Consent resource name and error.
     */
    export interface Schema$ConsentErrors {
        /**
         * The error code and message.
         */
        error?: Schema$Status;
        /**
         * The versioned name of the admin Consent resource, in the format `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}/_history/{version_id\}`. For FHIR stores with `disable_resource_versioning=true`, the format is `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}`.
         */
        name?: string | null;
    }
    /**
     * The detailed evaluation of a particular Consent.
     */
    export interface Schema$ConsentEvaluation {
        /**
         * The evaluation result.
         */
        evaluationResult?: string | null;
    }
    /**
     * How the server handles the consent header.
     */
    export interface Schema$ConsentHeaderHandling {
        /**
         * Optional. Specifies the default server behavior when the header is empty. If not specified, the `ScopeProfile.PERMIT_EMPTY_SCOPE` option is used.
         */
        profile?: string | null;
    }
    /**
     * List of resource names of Consent resources.
     */
    export interface Schema$ConsentList {
        /**
         * The resource names of the Consents to evaluate against, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`.
         */
        consents?: string[] | null;
    }
    /**
     * Represents a consent store.
     */
    export interface Schema$ConsentStore {
        /**
         * Optional. Default time to live for Consents created in this store. Must be at least 24 hours. Updating this field will not affect the expiration time of existing consents.
         */
        defaultConsentTtl?: string | null;
        /**
         * Optional. If `true`, UpdateConsent creates the Consent if it does not already exist. If unspecified, defaults to `false`.
         */
        enableConsentCreateOnUpdate?: boolean | null;
        /**
         * Optional. User-supplied key-value pairs used to organize consent stores. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\}. Label values must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\}. No more than 64 labels can be associated with a given store. For more information: https://cloud.google.com/healthcare/docs/how-tos/labeling-resources
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Resource name of the consent store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}`. Cannot be changed after creation.
         */
        name?: string | null;
    }
    /**
     * Creates a new message.
     */
    export interface Schema$CreateMessageRequest {
        /**
         * Required. HL7v2 message.
         */
        message?: Schema$Message;
    }
    /**
     * Pseudonymization method that generates surrogates via cryptographic hashing. Uses SHA-256. Outputs a base64-encoded representation of the hashed output (for example, `L7k0BHmF1ha5U3NfGykjro4xWi1MPVQPjhMAZbSV9mM=`).
     */
    export interface Schema$CryptoHashConfig {
        /**
         * An AES 128/192/256 bit key. Causes the hash to be computed based on this key. A default key is generated for each Deidentify operation and is used when neither `crypto_key` nor `kms_wrapped` is specified. Must not be set if `kms_wrapped` is set.
         */
        cryptoKey?: string | null;
        /**
         * KMS wrapped key. Must not be set if `crypto_key` is set.
         */
        kmsWrapped?: Schema$KmsWrappedCryptoKey;
    }
    /**
     * A message representing a health dataset. A health dataset represents a collection of healthcare data pertaining to one or more patients. This may include multiple modalities of healthcare data, such as electronic medical records or medical imaging data.
     */
    export interface Schema$Dataset {
        /**
         * Optional. Customer-managed encryption key spec for a Dataset. If set, this Dataset and all of its sub-resources will be secured by this key. If empty, the Dataset is secured by the default Google encryption key.
         */
        encryptionSpec?: Schema$EncryptionSpec;
        /**
         * Identifier. Resource name of the dataset, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}`.
         */
        name?: string | null;
        /**
         * Output only. Whether the dataset satisfies zone isolation.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. Whether the dataset satisfies zone separation.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Optional. The default timezone used by this dataset. Must be a either a valid IANA time zone name such as "America/New_York" or empty, which defaults to UTC. This is used for parsing times in resources, such as HL7 messages, where no explicit timezone is specified.
         */
        timeZone?: string | null;
    }
    /**
     * Shift a date forward or backward in time by a random amount which is consistent for a given patient and crypto key combination.
     */
    export interface Schema$DateShiftConfig {
        /**
         * An AES 128/192/256 bit key. The date shift is computed based on this key and the patient ID. If the patient ID is empty for a DICOM resource, the date shift is computed based on this key and the study instance UID. If `crypto_key` is not set, then `kms_wrapped` is used to calculate the date shift. If neither is set, a default key is generated for each de-identify operation. Must not be set if `kms_wrapped` is set.
         */
        cryptoKey?: string | null;
        /**
         * KMS wrapped key. If `kms_wrapped` is not set, then `crypto_key` is used to calculate the date shift. If neither is set, a default key is generated for each de-identify operation. Must not be set if `crypto_key` is set.
         */
        kmsWrapped?: Schema$KmsWrappedCryptoKey;
    }
    /**
     * Contains configuration for streaming de-identified FHIR export.
     */
    export interface Schema$DeidentifiedStoreDestination {
        /**
         * Optional. The configuration to use when de-identifying resources that are added to this store.
         */
        config?: Schema$DeidentifyConfig;
        /**
         * Optional. The full resource name of a Cloud Healthcare FHIR store, for example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        store?: string | null;
    }
    /**
     * Configures de-id options specific to different types of content. Each submessage customizes the handling of an https://tools.ietf.org/html/rfc6838 media type or subtype. Configs are applied in a nested manner at runtime.
     */
    export interface Schema$DeidentifyConfig {
        /**
         * Optional. Configures de-id of application/DICOM content.
         */
        dicom?: Schema$DicomConfig;
        /**
         * Optional. Configures de-id of application/FHIR content.
         */
        fhir?: Schema$FhirConfig;
        /**
         * Optional. Configures de-identification of image pixels wherever they are found in the source_dataset.
         */
        image?: Schema$ImageConfig;
        /**
         * Optional. Configures de-identification of text wherever it is found in the source_dataset.
         */
        text?: Schema$TextConfig;
        /**
         * Optional. Ensures in-flight data remains in the region of origin during de-identification. The default value is false. Using this option results in a significant reduction of throughput, and is not compatible with `LOCATION` or `ORGANIZATION_NAME` infoTypes. `LOCATION` must be excluded within TextConfig, and must also be excluded within ImageConfig if image redaction is required.
         */
        useRegionalDataProcessing?: boolean | null;
    }
    /**
     * Redacts identifying information from the specified dataset.
     */
    export interface Schema$DeidentifyDatasetRequest {
        /**
         * Deidentify configuration. Only one of `config` and `gcs_config_uri` can be specified.
         */
        config?: Schema$DeidentifyConfig;
        /**
         * Required. The name of the dataset resource to create and write the redacted data to. * The destination dataset must not exist. * The destination dataset must be in the same location as the source dataset. De-identifying data across multiple locations is not supported.
         */
        destinationDataset?: string | null;
        /**
         * Cloud Storage location to read the JSON cloud.healthcare.deidentify.DeidentifyConfig from, overriding the default config. Must be of the form `gs://{bucket_id\}/path/to/object`. The Cloud Storage location must grant the Cloud IAM role `roles/storage.objectViewer` to the project's Cloud Healthcare Service Agent service account. Only one of `config` and `gcs_config_uri` can be specified.
         */
        gcsConfigUri?: string | null;
    }
    /**
     * Creates a new DICOM store with sensitive information de-identified.
     */
    export interface Schema$DeidentifyDicomStoreRequest {
        /**
         * Deidentify configuration. Only one of `config` and `gcs_config_uri` can be specified.
         */
        config?: Schema$DeidentifyConfig;
        /**
         * Required. The name of the DICOM store to create and write the redacted data to. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`. * The destination dataset must exist. * The source dataset and destination dataset must both reside in the same location. De-identifying data across multiple locations is not supported. * The destination DICOM store must not exist. * The caller must have the necessary permissions to create the destination DICOM store.
         */
        destinationStore?: string | null;
        /**
         * Filter configuration.
         */
        filterConfig?: Schema$DicomFilterConfig;
        /**
         * Cloud Storage location to read the JSON cloud.healthcare.deidentify.DeidentifyConfig from, overriding the default config. Must be of the form `gs://{bucket_id\}/path/to/object`. The Cloud Storage location must grant the Cloud IAM role `roles/storage.objectViewer` to the project's Cloud Healthcare Service Agent service account. Only one of `config` and `gcs_config_uri` can be specified.
         */
        gcsConfigUri?: string | null;
    }
    /**
     * Creates a new FHIR store with sensitive information de-identified.
     */
    export interface Schema$DeidentifyFhirStoreRequest {
        /**
         * Deidentify configuration. Only one of `config` and `gcs_config_uri` can be specified.
         */
        config?: Schema$DeidentifyConfig;
        /**
         * Required. The name of the FHIR store to create and write the redacted data to. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`. * The destination dataset must exist. * The source dataset and destination dataset must both reside in the same location. De-identifying data across multiple locations is not supported. * The destination FHIR store must exist. * The caller must have the healthcare.fhirResources.update permission to write to the destination FHIR store.
         */
        destinationStore?: string | null;
        /**
         * Cloud Storage location to read the JSON cloud.healthcare.deidentify.DeidentifyConfig from, overriding the default config. Must be of the form `gs://{bucket_id\}/path/to/object`. The Cloud Storage location must grant the Cloud IAM role `roles/storage.objectViewer` to the project's Cloud Healthcare Service Agent service account. Only one of `config` and `gcs_config_uri` can be specified.
         */
        gcsConfigUri?: string | null;
        /**
         * A filter specifying the resources to include in the output. If not specified, all resources are included in the output.
         */
        resourceFilter?: Schema$FhirFilter;
        /**
         * If true, skips resources that are created or modified after the de-identify operation is created.
         */
        skipModifiedResources?: boolean | null;
    }
    /**
     * Contains a summary of the Deidentify operation.
     */
    export interface Schema$DeidentifySummary {
    }
    /**
     * Specifies the parameters needed for de-identification of DICOM stores.
     */
    export interface Schema$DicomConfig {
        /**
         * Tag filtering profile that determines which tags to keep/remove.
         */
        filterProfile?: string | null;
        /**
         * List of tags to keep. Remove all other tags.
         */
        keepList?: Schema$TagFilterList;
        /**
         * List of tags to remove. Keep all other tags.
         */
        removeList?: Schema$TagFilterList;
        /**
         * Optional. If true, skip replacing StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, and MediaStorageSOPInstanceUID and leave them untouched. The Cloud Healthcare API regenerates these UIDs by default based on the DICOM Standard's reasoning: "Whilst these UIDs cannot be mapped directly to an individual out of context, given access to the original images, or to a database of the original images containing the UIDs, it would be possible to recover the individual's identity." http://dicom.nema.org/medical/dicom/current/output/chtml/part15/sect_E.3.9.html
         */
        skipIdRedaction?: boolean | null;
    }
    /**
     * Specifies the filter configuration for DICOM resources.
     */
    export interface Schema$DicomFilterConfig {
        /**
         * The Cloud Storage location of the filter configuration file. The `gcs_uri` must be in the format `gs://bucket/path/to/object`. The filter configuration file must contain a list of resource paths separated by newline characters (\n or \r\n). Each resource path must be in the format "/studies/{studyUID\}[/series/{seriesUID\}[/instances/{instanceUID\}]]" The Cloud Healthcare API service account must have the `roles/storage.objectViewer` Cloud IAM role for this Cloud Storage location.
         */
        resourcePathsGcsUri?: string | null;
    }
    /**
     * Represents a DICOM store.
     */
    export interface Schema$DicomStore {
        /**
         * User-supplied key-value pairs used to organize DICOM stores. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\} Label values are optional, must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\} No more than 64 labels can be associated with a given store.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Resource name of the DICOM store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        name?: string | null;
        /**
         * Optional. Notification destination for new DICOM instances. Supplied by the client.
         */
        notificationConfig?: Schema$NotificationConfig;
        /**
         * Optional. A list of streaming configs used to configure the destination of streaming exports for every DICOM instance insertion in this DICOM store. After a new config is added to `stream_configs`, DICOM instance insertions are streamed to the new destination. When a config is removed from `stream_configs`, the server stops streaming to that destination. Each config must contain a unique destination.
         */
        streamConfigs?: Schema$GoogleCloudHealthcareV1DicomStreamConfig[];
    }
    /**
     * DicomStoreMetrics contains metrics describing a DICOM store.
     */
    export interface Schema$DicomStoreMetrics {
        /**
         * Total blob storage bytes for all instances in the store.
         */
        blobStorageSizeBytes?: string | null;
        /**
         * Number of instances in the store.
         */
        instanceCount?: string | null;
        /**
         * Resource name of the DICOM store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        name?: string | null;
        /**
         * Number of series in the store.
         */
        seriesCount?: string | null;
        /**
         * Total structured storage bytes for all instances in the store.
         */
        structuredStorageSizeBytes?: string | null;
        /**
         * Number of studies in the store.
         */
        studyCount?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Represents a customer-managed encryption key spec that can be applied to a resource.
     */
    export interface Schema$EncryptionSpec {
        /**
         * Required. The resource name of customer-managed encryption key that is used to secure a resource and its sub-resources. Only the key in the same location as this Dataset is allowed to be used for encryption. Format is: `projects/{project\}/locations/{location\}/keyRings/{keyRing\}/cryptoKeys/{key\}`
         */
        kmsKeyName?: string | null;
    }
    /**
     * The candidate entities that an entity mention could link to.
     */
    export interface Schema$Entity {
        /**
         * entity_id is a first class field entity_id uniquely identifies this concept and its meta-vocabulary. For example, "UMLS/C0000970".
         */
        entityId?: string | null;
        /**
         * preferred_term is the preferred term for this concept. For example, "Acetaminophen". For ad hoc entities formed by normalization, this is the most popular unnormalized string.
         */
        preferredTerm?: string | null;
        /**
         * Vocabulary codes are first-class fields and differentiated from the concept unique identifier (entity_id). vocabulary_codes contains the representation of this concept in particular vocabularies, such as ICD-10, SNOMED-CT and RxNORM. These are prefixed by the name of the vocabulary, followed by the unique code within that vocabulary. For example, "RXNORM/A10334543".
         */
        vocabularyCodes?: string[] | null;
    }
    /**
     * An entity mention in the document.
     */
    export interface Schema$EntityMention {
        /**
         * The certainty assessment of the entity mention. Its value is one of: LIKELY, SOMEWHAT_LIKELY, UNCERTAIN, SOMEWHAT_UNLIKELY, UNLIKELY, CONDITIONAL
         */
        certaintyAssessment?: Schema$Feature;
        /**
         * The model's confidence in this entity mention annotation. A number between 0 and 1.
         */
        confidence?: number | null;
        /**
         * linked_entities are candidate ontological concepts that this entity mention may refer to. They are sorted by decreasing confidence.
         */
        linkedEntities?: Schema$LinkedEntity[];
        /**
         * mention_id uniquely identifies each entity mention in a single response.
         */
        mentionId?: string | null;
        /**
         * The subject this entity mention relates to. Its value is one of: PATIENT, FAMILY_MEMBER, OTHER
         */
        subject?: Schema$Feature;
        /**
         * How this entity mention relates to the subject temporally. Its value is one of: CURRENT, CLINICAL_HISTORY, FAMILY_HISTORY, UPCOMING, ALLERGY
         */
        temporalAssessment?: Schema$Feature;
        /**
         * text is the location of the entity mention in the document.
         */
        text?: Schema$TextSpan;
        /**
         * The semantic type of the entity: UNKNOWN_ENTITY_TYPE, ALONE, ANATOMICAL_STRUCTURE, ASSISTED_LIVING, BF_RESULT, BM_RESULT, BM_UNIT, BM_VALUE, BODY_FUNCTION, BODY_MEASUREMENT, COMPLIANT, DOESNOT_FOLLOWUP, FAMILY, FOLLOWSUP, LABORATORY_DATA, LAB_RESULT, LAB_UNIT, LAB_VALUE, MEDICAL_DEVICE, MEDICINE, MED_DOSE, MED_DURATION, MED_FORM, MED_FREQUENCY, MED_ROUTE, MED_STATUS, MED_STRENGTH, MED_TOTALDOSE, MED_UNIT, NON_COMPLIANT, OTHER_LIVINGSTATUS, PROBLEM, PROCEDURE, PROCEDURE_RESULT, PROC_METHOD, REASON_FOR_NONCOMPLIANCE, SEVERITY, SUBSTANCE_ABUSE, UNCLEAR_FOLLOWUP.
         */
        type?: string | null;
    }
    /**
     * Defines directed relationship from one entity mention to another.
     */
    export interface Schema$EntityMentionRelationship {
        /**
         * The model's confidence in this annotation. A number between 0 and 1.
         */
        confidence?: number | null;
        /**
         * object_id is the id of the object entity mention.
         */
        objectId?: string | null;
        /**
         * subject_id is the id of the subject entity mention.
         */
        subjectId?: string | null;
    }
    /**
     * Evaluate a user's Consents for all matching User data mappings. Note: User data mappings are indexed asynchronously, causing slight delays between the time mappings are created or updated and when they are included in EvaluateUserConsents results.
     */
    export interface Schema$EvaluateUserConsentsRequest {
        /**
         * Optional. Specific Consents to evaluate the access request against. These Consents must have the same `user_id` as the User data mappings being evalauted, must exist in the current `consent_store`, and must have a `state` of either `ACTIVE` or `DRAFT`. A maximum of 100 Consents can be provided here. If unspecified, all `ACTIVE` unexpired Consents in the current `consent_store` will be evaluated.
         */
        consentList?: Schema$ConsentList;
        /**
         * Optional. Limit on the number of User data mappings to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number | null;
        /**
         * Optional. Token to retrieve the next page of results, or empty to get the first page.
         */
        pageToken?: string | null;
        /**
         * Required. The values of request attributes associated with this access request.
         */
        requestAttributes?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The values of resource attributes associated with the resources being requested. If no values are specified, then all resources are queried.
         */
        resourceAttributes?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The view for EvaluateUserConsentsResponse. If unspecified, defaults to `BASIC` and returns `consented` as `TRUE` or `FALSE`.
         */
        responseView?: string | null;
        /**
         * Required. User ID to evaluate consents for.
         */
        userId?: string | null;
    }
    export interface Schema$EvaluateUserConsentsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list. This token is valid for 72 hours after it is created.
         */
        nextPageToken?: string | null;
        /**
         * The consent evaluation result for each `data_id`.
         */
        results?: Schema$Result[];
    }
    /**
     * The enforcing consent's metadata.
     */
    export interface Schema$ExplainDataAccessConsentInfo {
        /**
         * The compartment base resources that matched a cascading policy. Each resource has the following format: `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/{resource_type\}/{resource_id\}`
         */
        cascadeOrigins?: string[] | null;
        /**
         * The resource name of this consent resource, in the format: `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{resource_id\}`.
         */
        consentResource?: string | null;
        /**
         * Last enforcement timestamp of this consent resource.
         */
        enforcementTime?: string | null;
        /**
         * A list of all the matching accessor scopes of this consent policy that enforced ExplainDataAccessConsentScope.accessor_scope.
         */
        matchingAccessorScopes?: Schema$ConsentAccessorScope[];
        /**
         * The patient owning the consent (only applicable for patient consents), in the format: `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Patient/{patient_id\}`
         */
        patientConsentOwner?: string | null;
        /**
         * The policy type of consent resource (e.g. PATIENT, ADMIN).
         */
        type?: string | null;
        /**
         * The consent's variant combinations. A single consent may have multiple variants.
         */
        variants?: string[] | null;
    }
    /**
     * A single consent scope that provides info on who has access to the requested resource scope for a particular purpose and environment, enforced by which consent.
     */
    export interface Schema$ExplainDataAccessConsentScope {
        /**
         * The accessor scope that describes who can access, for what purpose, and in which environment.
         */
        accessorScope?: Schema$ConsentAccessorScope;
        /**
         * Whether the current consent scope is permitted or denied access on the requested resource.
         */
        decision?: string | null;
        /**
         * Metadata of the consent resources that enforce the consent scope's access.
         */
        enforcingConsents?: Schema$ExplainDataAccessConsentInfo[];
        /**
         * Other consent scopes that created exceptions within this scope.
         */
        exceptions?: Schema$ExplainDataAccessConsentScope[];
    }
    /**
     * List of consent scopes that are applicable to the explained access on a given resource.
     */
    export interface Schema$ExplainDataAccessResponse {
        /**
         * List of applicable consent scopes. Sorted in order of actor such that scopes belonging to the same actor will be adjacent to each other in the list.
         */
        consentScopes?: Schema$ExplainDataAccessConsentScope[];
        /**
         * Warnings associated with this response. It inform user with exceeded scope limit errors.
         */
        warning?: string | null;
    }
    /**
     * Exports data from the specified DICOM store. If a given resource, such as a DICOM object with the same SOPInstance UID, already exists in the output, it is overwritten with the version in the source dataset. Exported DICOM data persists when the DICOM store from which it was exported is deleted.
     */
    export interface Schema$ExportDicomDataRequest {
        /**
         * The BigQuery output destination. You can only export to a BigQuery dataset that's in the same project as the DICOM store you're exporting from. The Cloud Healthcare Service Agent requires two IAM roles on the BigQuery location: `roles/bigquery.dataEditor` and `roles/bigquery.jobUser`.
         */
        bigqueryDestination?: Schema$GoogleCloudHealthcareV1DicomBigQueryDestination;
        /**
         * The Cloud Storage output destination. The Cloud Healthcare Service Agent requires the `roles/storage.objectAdmin` Cloud IAM roles on the Cloud Storage location.
         */
        gcsDestination?: Schema$GoogleCloudHealthcareV1DicomGcsDestination;
    }
    /**
     * Returns additional information in regards to a completed DICOM store export.
     */
    export interface Schema$ExportDicomDataResponse {
    }
    /**
     * Request to schedule an export.
     */
    export interface Schema$ExportMessagesRequest {
        /**
         * The end of the range in `send_time` (MSH.7, https://www.hl7.org/documentcenter/public_temp_2E58C1F9-1C23-BA17-0C6126475344DA9D/wg/conf/HL7MSH.htm) to process. If not specified, the time when the export is scheduled is used. This value has to come after the `start_time` defined below. Only messages whose `send_time` lies in the range `start_time` (inclusive) to `end_time` (exclusive) are exported.
         */
        endTime?: string | null;
        /**
         * Restricts messages exported to those matching a filter, only applicable to PubsubDestination and GcsDestination. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in the `yyyy-mm-dd` format. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, and is just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. The following fields and functions are available for filtering: * `message_type`, from the MSH-9.1 field. For example, `NOT message_type = "ADT"`. * `send_date` or `sendDate`, the `yyyy-mm-dd` date the message was sent in the dataset's time_zone, from the MSH-7 segment. For example, `send_date < "2017-01-02"`. * `send_time`, the timestamp when the message was sent, using the RFC3339 time format for comparisons, from the MSH-7 segment. For example, `send_time < "2017-01-02T00:00:00-05:00"`. * `create_time`, the timestamp when the message was created in the HL7v2 store. Use the RFC3339 time format for comparisons. For example, `create_time < "2017-01-02T00:00:00-05:00"`. * `send_facility`, the care center that the message came from, from the MSH-4 segment. For example, `send_facility = "ABC"`. Note: The filter will be applied to every message in the HL7v2 store whose `send_time` lies in the range defined by the `start_time` and the `end_time`. Even if the filter only matches a small set of messages, the export operation can still take a long time to finish when a lot of messages are between the specified `start_time` and `end_time` range.
         */
        filter?: string | null;
        /**
         * Export to a Cloud Storage destination.
         */
        gcsDestination?: Schema$GcsDestination;
        /**
         * Export messages to a Pub/Sub topic.
         */
        pubsubDestination?: Schema$PubsubDestination;
        /**
         * The start of the range in `send_time` (MSH.7, https://www.hl7.org/documentcenter/public_temp_2E58C1F9-1C23-BA17-0C6126475344DA9D/wg/conf/HL7MSH.htm) to process. If not specified, the UNIX epoch (1970-01-01T00:00:00Z) is used. This value has to come before the `end_time` defined below. Only messages whose `send_time` lies in the range `start_time` (inclusive) to `end_time` (exclusive) are exported.
         */
        startTime?: string | null;
    }
    /**
     * Final response for the export operation. This structure is included in the response to describe the detailed outcome.
     */
    export interface Schema$ExportMessagesResponse {
    }
    /**
     * Request to export resources.
     */
    export interface Schema$ExportResourcesRequest {
        /**
         * The BigQuery output destination. The Cloud Healthcare Service Agent requires two IAM roles on the BigQuery location: `roles/bigquery.dataEditor` and `roles/bigquery.jobUser`. The output is one BigQuery table per resource type. Unlike when setting `BigQueryDestination` for `StreamConfig`, `ExportResources` does not create BigQuery views.
         */
        bigqueryDestination?: Schema$GoogleCloudHealthcareV1FhirBigQueryDestination;
        /**
         * The Cloud Storage output destination. The Healthcare Service Agent account requires the `roles/storage.objectAdmin` role on the Cloud Storage location. The exported outputs are organized by FHIR resource types. The server creates one object per resource type. Each object contains newline delimited JSON, and each line is a FHIR resource.
         */
        gcsDestination?: Schema$GoogleCloudHealthcareV1FhirGcsDestination;
        /**
         * If provided, only resources updated after this time are exported. The time uses the format YYYY-MM-DDThh:mm:ss.sss+zz:zz. For example, `2015-02-07T13:28:17.239+02:00` or `2017-01-01T00:00:00Z`. The time must be specified to the second and include a time zone.
         */
        _since?: string | null;
        /**
         * String of comma-delimited FHIR resource types. If provided, only resources of the specified resource type(s) are exported.
         */
        _type?: string | null;
    }
    /**
     * Response when all resources export successfully. This structure is included in the response to describe the detailed outcome after the operation finishes successfully.
     */
    export interface Schema$ExportResourcesResponse {
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
     * A feature of an entity mention.
     */
    export interface Schema$Feature {
        /**
         * The model's confidence in this feature annotation. A number between 0 and 1.
         */
        confidence?: number | null;
        /**
         * The value of this feature annotation. Its range depends on the type of the feature.
         */
        value?: string | null;
    }
    /**
     * Specifies how to handle de-identification of a FHIR store.
     */
    export interface Schema$FhirConfig {
        /**
         * Optional. The behaviour for handling FHIR extensions that aren't otherwise specified for de-identification. If true, all extensions are preserved during de-identification by default. If false or unspecified, all extensions are removed during de-identification by default.
         */
        defaultKeepExtensions?: boolean | null;
        /**
         * Optional. Specifies FHIR paths to match and how to transform them. Any field that is not matched by a FieldMetadata is passed through to the output dataset unmodified. All extensions will be processed according to `default_keep_extensions`.
         */
        fieldMetadataList?: Schema$FieldMetadata[];
    }
    /**
     * Filter configuration.
     */
    export interface Schema$FhirFilter {
        /**
         * List of resources to include in the output. If this list is empty or not specified, all resources are included in the output.
         */
        resources?: Schema$Resources;
    }
    /**
     * Contains the configuration for FHIR notifications.
     */
    export interface Schema$FhirNotificationConfig {
        /**
         * Optional. The [Pub/Sub](https://cloud.google.com/pubsub/docs/) topic that notifications of changes are published on. Supplied by the client. The notification is a `PubsubMessage` with the following fields: * `PubsubMessage.Data` contains the resource name. * `PubsubMessage.MessageId` is the ID of this notification. It is guaranteed to be unique within the topic. * `PubsubMessage.PublishTime` is the time when the message was published. Note that notifications are only sent if the topic is non-empty. [Topic names](https://cloud.google.com/pubsub/docs/overview#names) must be scoped to a project. The Cloud Healthcare API service account, service-@gcp-sa-healthcare.iam.gserviceaccount.com, must have publisher permissions on the given Pub/Sub topic. Not having adequate permissions causes the calls that send notifications to fail (https://cloud.google.com/healthcare-api/docs/permissions-healthcare-api-gcp-products#dicom_fhir_and_hl7v2_store_cloud_pubsub_permissions). If a notification can't be published to Pub/Sub, errors are logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare-api/docs/how-tos/logging).
         */
        pubsubTopic?: string | null;
        /**
         * Optional. Whether to send full FHIR resource to this Pub/Sub topic. The default value is false.
         */
        sendFullResource?: boolean | null;
        /**
         * Optional. Whether to send full FHIR resource to this Pub/Sub topic for deleting FHIR resource. The default value is false. Note that setting this to true does not guarantee that all previous resources will be sent in the format of full FHIR resource. When a resource change is too large or during heavy traffic, only the resource name will be sent. Clients should always check the "payloadType" label from a Pub/Sub message to determine whether it needs to fetch the full previous resource as a separate operation.
         */
        sendPreviousResourceOnDelete?: boolean | null;
    }
    /**
     * Represents a FHIR store.
     */
    export interface Schema$FhirStore {
        /**
         * Optional. FHIR bulk export exports resources to the specified Cloud Storage destination. A Cloud Storage destination is a URI for a Cloud Storage directory where result files will be written. Only used in the spec-defined bulk $export methods. The Cloud Healthcare Service Agent requires the `roles/storage.objectAdmin` Cloud IAM role on the destination.
         */
        bulkExportGcsDestination?: Schema$BulkExportGcsDestination;
        /**
         * Optional. Enable parsing of references within complex FHIR data types such as Extensions. If this value is set to ENABLED, then features like referential integrity and Bundle reference rewriting apply to all references. If this flag has not been specified the behavior of the FHIR store will not change, references in complex data types will not be parsed. New stores will have this value set to ENABLED after a notification period. Warning: turning on this flag causes processing existing resources to fail if they contain references to non-existent resources.
         */
        complexDataTypeReferenceParsing?: string | null;
        /**
         * Optional. Specifies whether this store has consent enforcement. Not available for DSTU2 FHIR version due to absence of Consent resources.
         */
        consentConfig?: Schema$ConsentConfig;
        /**
         * Optional. If true, overrides the default search behavior for this FHIR store to `handling=strict` which returns an error for unrecognized search parameters. If false, uses the FHIR specification default `handling=lenient` which ignores unrecognized search parameters. The handling can always be changed from the default on an individual API call by setting the HTTP header `Prefer: handling=strict` or `Prefer: handling=lenient`. Defaults to false.
         */
        defaultSearchHandlingStrict?: boolean | null;
        /**
         * Immutable. Whether to disable referential integrity in this FHIR store. This field is immutable after FHIR store creation. The default value is false, meaning that the API enforces referential integrity and fails the requests that result in inconsistent state in the FHIR store. When this field is set to true, the API skips referential integrity checks. Consequently, operations that rely on references, such as GetPatientEverything, do not return all the results if broken references exist.
         */
        disableReferentialIntegrity?: boolean | null;
        /**
         * Immutable. Whether to disable resource versioning for this FHIR store. This field can not be changed after the creation of FHIR store. If set to false, all write operations cause historical versions to be recorded automatically. The historical versions can be fetched through the history APIs, but cannot be updated. If set to true, no historical versions are kept. The server sends errors for attempts to read the historical versions. Defaults to false.
         */
        disableResourceVersioning?: boolean | null;
        /**
         * Optional. Whether this FHIR store has the [updateCreate capability](https://www.hl7.org/fhir/capabilitystatement-definitions.html#CapabilityStatement.rest.resource.updateCreate). This determines if the client can use an Update operation to create a new resource with a client-specified ID. If false, all IDs are server-assigned through the Create operation and attempts to update a non-existent resource return errors. It is strongly advised not to include or encode any sensitive data such as patient identifiers in client-specified resource IDs. Those IDs are part of the FHIR resource path recorded in Cloud audit logs and Pub/Sub notifications. Those IDs can also be contained in reference fields within other resources. Defaults to false.
         */
        enableUpdateCreate?: boolean | null;
        /**
         * User-supplied key-value pairs used to organize FHIR stores. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\} Label values are optional, must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\} No more than 64 labels can be associated with a given store.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Identifier. Resource name of the FHIR store, of the form `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string | null;
        /**
         * Deprecated. Use `notification_configs` instead. If non-empty, publish all resource modifications of this FHIR store to this destination. The Pub/Sub message attributes contain a map with a string describing the action that has triggered the notification. For example, "action":"CreateResource".
         */
        notificationConfig?: Schema$NotificationConfig;
        /**
         * Optional. Specifies where and whether to send notifications upon changes to a FHIR store.
         */
        notificationConfigs?: Schema$FhirNotificationConfig[];
        /**
         * Optional. A list of streaming configs that configure the destinations of streaming export for every resource mutation in this FHIR store. Each store is allowed to have up to 10 streaming configs. After a new config is added, the next resource mutation is streamed to the new location in addition to the existing ones. When a location is removed from the list, the server stops streaming to that location. Before adding a new config, you must add the required [`bigquery.dataEditor`](https://cloud.google.com/bigquery/docs/access-control#bigquery.dataEditor) role to your project's **Cloud Healthcare Service Agent** [service account](https://cloud.google.com/iam/docs/service-accounts). Some lag (typically on the order of dozens of seconds) is expected before the results show up in the streaming destination.
         */
        streamConfigs?: Schema$StreamConfig[];
        /**
         * Optional. Configuration for how to validate incoming FHIR resources against configured profiles.
         */
        validationConfig?: Schema$ValidationConfig;
        /**
         * Required. Immutable. The FHIR specification version that this FHIR store supports natively. This field is immutable after store creation. Requests are rejected if they contain FHIR resources of a different version. Version is required for every FHIR store.
         */
        version?: string | null;
    }
    /**
     * Count of resources and total storage size by type for a given FHIR store.
     */
    export interface Schema$FhirStoreMetric {
        /**
         * The total count of FHIR resources in the store of this resource type.
         */
        count?: string | null;
        /**
         * The FHIR resource type this metric applies to.
         */
        resourceType?: string | null;
        /**
         * The total amount of structured storage used by FHIR resources of this resource type in the store.
         */
        structuredStorageSizeBytes?: string | null;
    }
    /**
     * List of metrics for a given FHIR store.
     */
    export interface Schema$FhirStoreMetrics {
        /**
         * List of FhirStoreMetric by resource type.
         */
        metrics?: Schema$FhirStoreMetric[];
        /**
         * The resource name of the FHIR store to get metrics for, in the format `projects/{project_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string | null;
    }
    /**
     * A (sub) field of a type.
     */
    export interface Schema$Field {
        /**
         * The maximum number of times this field can be repeated. 0 or -1 means unbounded.
         */
        maxOccurs?: number | null;
        /**
         * The minimum number of times this field must be present/repeated.
         */
        minOccurs?: number | null;
        /**
         * The name of the field. For example, "PID-1" or just "1".
         */
        name?: string | null;
        /**
         * The HL7v2 table this field refers to. For example, PID-15 (Patient's Primary Language) usually refers to table "0296".
         */
        table?: string | null;
        /**
         * The type of this field. A Type with this name must be defined in an Hl7TypesConfig.
         */
        type?: string | null;
    }
    /**
     * Specifies FHIR paths to match, and how to handle de-identification of matching fields.
     */
    export interface Schema$FieldMetadata {
        /**
         * Optional. Deidentify action for one field.
         */
        action?: string | null;
        /**
         * Optional. List of paths to FHIR fields to be redacted. Each path is a period-separated list where each component is either a field name or FHIR type name, for example: Patient, HumanName. For "choice" types (those defined in the FHIR spec with the form: field[x]) we use two separate components. For example, "deceasedAge.unit" is matched by "Deceased.Age.unit". Supported types are: AdministrativeGenderCode, Base64Binary, Boolean, Code, Date, DateTime, Decimal, HumanName, Id, Instant, Integer, LanguageCode, Markdown, Oid, PositiveInt, String, UnsignedInt, Uri, Uuid, Xhtml.
         */
        paths?: string[] | null;
    }
    /**
     * The Cloud Storage output destination. The Cloud Healthcare Service Agent requires the `roles/storage.objectAdmin` Cloud IAM roles on the Cloud Storage location.
     */
    export interface Schema$GcsDestination {
        /**
         * The format of the exported HL7v2 message files.
         */
        contentStructure?: string | null;
        /**
         * Specifies the parts of the Message resource to include in the export. If not specified, FULL is used.
         */
        messageView?: string | null;
        /**
         * URI of an existing Cloud Storage directory where the server writes result files, in the format `gs://{bucket-id\}/{path/to/destination/dir\}`. If there is no trailing slash, the service appends one when composing the object path.
         */
        uriPrefix?: string | null;
    }
    /**
     * Specifies the configuration for importing data from Cloud Storage.
     */
    export interface Schema$GcsSource {
        /**
         * Points to a Cloud Storage URI containing file(s) to import. The URI must be in the following format: `gs://{bucket_id\}/{object_id\}`. The URI can include wildcards in `object_id` and thus identify multiple files. Supported wildcards: * `*` to match 0 or more non-separator characters * `**` to match 0 or more characters (including separators). Must be used at the end of a path and with no other wildcards in the path. Can also be used with a file extension (such as .ndjson), which imports all files with the extension in the specified directory and its sub-directories. For example, `gs://my-bucket/my-directory/x*.ndjson` imports all files with `.ndjson` extensions in `my-directory/` and its sub-directories. * `?` to match 1 character Files matching the wildcard are expected to contain content only, no metadata.
         */
        uri?: string | null;
    }
    /**
     * The Cloud Storage location for export.
     */
    export interface Schema$GoogleCloudHealthcareV1ConsentGcsDestination {
        /**
         * URI for a Cloud Storage directory where the server writes result files, in the format `gs://{bucket-id\}/{path/to/destination/dir\}`. If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket and directory referenced in `uri_prefix`.
         */
        uriPrefix?: string | null;
    }
    /**
     * Represents a user's consent in terms of the resources that can be accessed and under what conditions.
     */
    export interface Schema$GoogleCloudHealthcareV1ConsentPolicy {
        /**
         * Required. The request conditions to meet to grant access. In addition to any supported comparison operators, authorization rules may have `IN` operator as well as at most 10 logical operators that are limited to `AND` (`&&`), `OR` (`||`).
         */
        authorizationRule?: Schema$Expr;
        /**
         * The resources that this policy applies to. A resource is a match if it matches all the attributes listed here. If empty, this policy applies to all User data mappings for the given user.
         */
        resourceAttributes?: Schema$Attribute[];
    }
    /**
     * Contains a summary of the DeidentifyDicomStore operation.
     */
    export interface Schema$GoogleCloudHealthcareV1DeidentifyDeidentifyDicomStoreSummary {
    }
    /**
     * Contains a summary of the DeidentifyFhirStore operation.
     */
    export interface Schema$GoogleCloudHealthcareV1DeidentifyDeidentifyFhirStoreSummary {
    }
    /**
     * The BigQuery table where the server writes the output.
     */
    export interface Schema$GoogleCloudHealthcareV1DicomBigQueryDestination {
        /**
         * Optional. Use `write_disposition` instead. If `write_disposition` is specified, this parameter is ignored. force=false is equivalent to write_disposition=WRITE_EMPTY and force=true is equivalent to write_disposition=WRITE_TRUNCATE.
         */
        force?: boolean | null;
        /**
         * Optional. BigQuery URI to a table, up to 2000 characters long, in the format `bq://projectId.bqDatasetId.tableId`
         */
        tableUri?: string | null;
        /**
         * Optional. Determines whether the existing table in the destination is to be overwritten or appended to. If a write_disposition is specified, the `force` parameter is ignored.
         */
        writeDisposition?: string | null;
    }
    /**
     * The Cloud Storage location where the server writes the output and the export configuration.
     */
    export interface Schema$GoogleCloudHealthcareV1DicomGcsDestination {
        /**
         * MIME types supported by DICOM spec. Each file is written in the following format: `.../{study_id\}/{series_id\}/{instance_id\}[/{frame_number\}].{extension\}` The frame_number component exists only for multi-frame instances. Supported MIME types are consistent with supported formats in DICOMweb: https://cloud.google.com/healthcare/docs/dicom#retrieve_transaction. Specifically, the following are supported: - application/dicom; transfer-syntax=1.2.840.10008.1.2.1 (uncompressed DICOM) - application/dicom; transfer-syntax=1.2.840.10008.1.2.4.50 (DICOM with embedded JPEG Baseline) - application/dicom; transfer-syntax=1.2.840.10008.1.2.4.90 (DICOM with embedded JPEG 2000 Lossless Only) - application/dicom; transfer-syntax=1.2.840.10008.1.2.4.91 (DICOM with embedded JPEG 2000) - application/dicom; transfer-syntax=* (DICOM with no transcoding) - application/octet-stream; transfer-syntax=1.2.840.10008.1.2.1 (raw uncompressed PixelData) - application/octet-stream; transfer-syntax=* (raw PixelData in whatever format it was uploaded in) - image/jpeg; transfer-syntax=1.2.840.10008.1.2.4.50 (Consumer JPEG) - image/png The following extensions are used for output files: - application/dicom -\> .dcm - image/jpeg -\> .jpg - image/png -\> .png - application/octet-stream -\> no extension If unspecified, the instances are exported in the original DICOM format they were uploaded in.
         */
        mimeType?: string | null;
        /**
         * The Cloud Storage destination to export to. URI for a Cloud Storage directory where the server writes the result files, in the format `gs://{bucket-id\}/{path/to/destination/dir\}`). If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket referenced in `uri_prefix`.
         */
        uriPrefix?: string | null;
    }
    /**
     * Specifies the configuration for importing data from Cloud Storage.
     */
    export interface Schema$GoogleCloudHealthcareV1DicomGcsSource {
        /**
         * Points to a Cloud Storage URI containing file(s) with content only. The URI must be in the following format: `gs://{bucket_id\}/{object_id\}`. The URI can include wildcards in `object_id` and thus identify multiple files. Supported wildcards: * '*' to match 0 or more non-separator characters * '**' to match 0 or more characters (including separators). Must be used at the end of a path and with no other wildcards in the path. Can also be used with a file extension (such as .dcm), which imports all files with the extension in the specified directory and its sub-directories. For example, `gs://my-bucket/my-directory/x*.dcm` imports all files with .dcm extensions in `my-directory/` and its sub-directories. * '?' to match 1 character. All other URI formats are invalid. Files matching the wildcard are expected to contain content only, no metadata.
         */
        uri?: string | null;
    }
    /**
     * StreamConfig specifies configuration for a streaming DICOM export.
     */
    export interface Schema$GoogleCloudHealthcareV1DicomStreamConfig {
        /**
         * Results are appended to this table. The server creates a new table in the given BigQuery dataset if the specified table does not exist. To enable the Cloud Healthcare API to write to your BigQuery table, you must give the Cloud Healthcare API service account the bigquery.dataEditor role. The service account is: `service-{PROJECT_NUMBER\}@gcp-sa-healthcare.iam.gserviceaccount.com`. The PROJECT_NUMBER identifies the project that the DICOM store resides in. To get the project number, go to the Cloud Console Dashboard. It is recommended to not have a custom schema in the destination table which could conflict with the schema created by the Cloud Healthcare API. Instance deletions are not applied to the destination table. The destination's table schema will be automatically updated in case a new instance's data is incompatible with the current schema. The schema should not be updated manually as this can cause incompatibilies that cannot be resolved automatically. One resolution in this case is to delete the incompatible table and let the server recreate one, though the newly created table only contains data after the table recreation. BigQuery imposes a 1 MB limit on streaming insert row size, therefore any instance that generates more than 1 MB of BigQuery data will not be streamed. If an instance cannot be streamed to BigQuery, errors will be logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         */
        bigqueryDestination?: Schema$GoogleCloudHealthcareV1DicomBigQueryDestination;
    }
    /**
     * The configuration for exporting to BigQuery.
     */
    export interface Schema$GoogleCloudHealthcareV1FhirBigQueryDestination {
        /**
         * Optional. BigQuery URI to an existing dataset, up to 2000 characters long, in the format `bq://projectId.bqDatasetId`.
         */
        datasetUri?: string | null;
        /**
         * Optional. The default value is false. If this flag is `TRUE`, all tables are deleted from the dataset before the new exported tables are written. If the flag is not set and the destination dataset contains tables, the export call returns an error. If `write_disposition` is specified, this parameter is ignored. force=false is equivalent to write_disposition=WRITE_EMPTY and force=true is equivalent to write_disposition=WRITE_TRUNCATE.
         */
        force?: boolean | null;
        /**
         * Optional. The configuration for the exported BigQuery schema.
         */
        schemaConfig?: Schema$SchemaConfig;
        /**
         * Optional. Determines if existing data in the destination dataset is overwritten, appended to, or not written if the tables contain data. If a write_disposition is specified, the `force` parameter is ignored.
         */
        writeDisposition?: string | null;
    }
    /**
     * The configuration for exporting to Cloud Storage.
     */
    export interface Schema$GoogleCloudHealthcareV1FhirGcsDestination {
        /**
         * URI for a Cloud Storage directory where result files should be written, in the format of `gs://{bucket-id\}/{path/to/destination/dir\}`. If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket referenced in `uri_prefix`.
         */
        uriPrefix?: string | null;
    }
    /**
     * Specifies the configuration for importing data from Cloud Storage.
     */
    export interface Schema$GoogleCloudHealthcareV1FhirGcsSource {
        /**
         * Points to a Cloud Storage URI containing file(s) to import. The URI must be in the following format: `gs://{bucket_id\}/{object_id\}`. The URI can include wildcards in `object_id` and thus identify multiple files. Supported wildcards: * `*` to match 0 or more non-separator characters * `**` to match 0 or more characters (including separators). Must be used at the end of a path and with no other wildcards in the path. Can also be used with a file extension (such as .ndjson), which imports all files with the extension in the specified directory and its sub-directories. For example, `gs://my-bucket/my-directory/x*.ndjson` imports all files with `.ndjson` extensions in `my-directory/` and its sub-directories. * `?` to match 1 character Files matching the wildcard are expected to contain content only, no metadata.
         */
        uri?: string | null;
    }
    /**
     * Construct representing a logical group or a segment.
     */
    export interface Schema$GroupOrSegment {
        group?: Schema$SchemaGroup;
        segment?: Schema$SchemaSegment;
    }
    /**
     * Root config message for HL7v2 schema. This contains a schema structure of groups and segments, and filters that determine which messages to apply the schema structure to.
     */
    export interface Schema$Hl7SchemaConfig {
        /**
         * Map from each HL7v2 message type and trigger event pair, such as ADT_A04, to its schema configuration root group.
         */
        messageSchemaConfigs?: {
            [key: string]: Schema$SchemaGroup;
        } | null;
        /**
         * Each VersionSource is tested and only if they all match is the schema used for the message.
         */
        version?: Schema$VersionSource[];
    }
    /**
     * Root config for HL7v2 datatype definitions for a specific HL7v2 version.
     */
    export interface Schema$Hl7TypesConfig {
        /**
         * The HL7v2 type definitions.
         */
        type?: Schema$Type[];
        /**
         * The version selectors that this config applies to. A message must match ALL version sources to apply.
         */
        version?: Schema$VersionSource[];
    }
    /**
     * Specifies where and whether to send notifications upon changes to a data store.
     */
    export interface Schema$Hl7V2NotificationConfig {
        /**
         * Optional. Restricts notifications sent for messages matching a filter. If this is empty, all messages are matched. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. The following fields and functions are available for filtering: * `message_type`, from the MSH-9.1 field. For example, `NOT message_type = "ADT"`. * `send_date` or `sendDate`, the YYYY-MM-DD date the message was sent in the dataset's time_zone, from the MSH-7 segment. For example, `send_date < "2017-01-02"`. * `send_time`, the timestamp when the message was sent, using the RFC3339 time format for comparisons, from the MSH-7 segment. For example, `send_time < "2017-01-02T00:00:00-05:00"`. * `create_time`, the timestamp when the message was created in the HL7v2 store. Use the RFC3339 time format for comparisons. For example, `create_time < "2017-01-02T00:00:00-05:00"`. * `send_facility`, the care center that the message came from, from the MSH-4 segment. For example, `send_facility = "ABC"`. * `PatientId(value, type)`, which matches if the message lists a patient having an ID of the given value and type in the PID-2, PID-3, or PID-4 segments. For example, `PatientId("123456", "MRN")`. * `labels.x`, a string value of the label with key `x` as set using the Message.labels map. For example, `labels."priority"="high"`. The operator `:*` can be used to assert the existence of a label. For example, `labels."priority":*`.
         */
        filter?: string | null;
        /**
         * The [Pub/Sub](https://cloud.google.com/pubsub/docs/) topic that notifications of changes are published on. Supplied by the client. The notification is a `PubsubMessage` with the following fields: * `PubsubMessage.Data` contains the resource name. * `PubsubMessage.MessageId` is the ID of this notification. It's guaranteed to be unique within the topic. * `PubsubMessage.PublishTime` is the time when the message was published. Note that notifications are only sent if the topic is non-empty. [Topic names](https://cloud.google.com/pubsub/docs/overview#names) must be scoped to a project. The Cloud Healthcare API service account, service-PROJECT_NUMBER@gcp-sa-healthcare.iam.gserviceaccount.com, must have publisher permissions on the given Pub/Sub topic. Not having adequate permissions causes the calls that send notifications to fail. If a notification cannot be published to Pub/Sub, errors are logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         */
        pubsubTopic?: string | null;
    }
    /**
     * Represents an HL7v2 store.
     */
    export interface Schema$Hl7V2Store {
        /**
         * User-supplied key-value pairs used to organize HL7v2 stores. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\} Label values are optional, must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\} No more than 64 labels can be associated with a given store.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Resource name of the HL7v2 store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7v2_store_id\}`.
         */
        name?: string | null;
        /**
         * Optional. A list of notification configs. Each configuration uses a filter to determine whether to publish a message (both Ingest & Create) on the corresponding notification destination. Only the message name is sent as part of the notification. Supplied by the client.
         */
        notificationConfigs?: Schema$Hl7V2NotificationConfig[];
        /**
         * Optional. The configuration for the parser. It determines how the server parses the messages.
         */
        parserConfig?: Schema$ParserConfig;
        /**
         * Optional. Determines whether to reject duplicate messages. A duplicate message is a message with the same raw bytes as a message that has already been ingested/created in this HL7v2 store. The default value is false, meaning that the store accepts the duplicate messages and it also returns the same ACK message in the IngestMessageResponse as has been returned previously. Note that only one resource is created in the store. When this field is set to true, CreateMessage/IngestMessage requests with a duplicate message will be rejected by the store, and IngestMessageErrorDetail returns a NACK message upon rejection.
         */
        rejectDuplicateMessage?: boolean | null;
    }
    /**
     * Count of messages and total storage size by type for a given HL7 store.
     */
    export interface Schema$Hl7V2StoreMetric {
        /**
         * The total count of HL7v2 messages in the store for the given message type.
         */
        count?: string | null;
        /**
         * The Hl7v2 message type this metric applies to, such as `ADT` or `ORU`.
         */
        messageType?: string | null;
        /**
         * The total amount of structured storage used by HL7v2 messages of this message type in the store.
         */
        structuredStorageSizeBytes?: string | null;
    }
    /**
     * List of metrics for a given HL7v2 store.
     */
    export interface Schema$Hl7V2StoreMetrics {
        /**
         * List of HL7v2 store metrics by message type.
         */
        metrics?: Schema$Hl7V2StoreMetric[];
        /**
         * The resource name of the HL7v2 store to get metrics for, in the format `projects/{project_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7v2_store_id\}`.
         */
        name?: string | null;
    }
    /**
     * Message that represents an arbitrary HTTP body. It should only be used for payload formats that can't be represented as JSON, such as raw binary or an HTML page. This message can be used both in streaming and non-streaming API methods in the request as well as the response. It can be used as a top-level request field, which is convenient if one wants to extract parameters from either the URL or HTTP template into the request fields and also want access to the raw HTTP body. Example: message GetResourceRequest { // A unique request id. string request_id = 1; // The raw HTTP body is bound to this field. google.api.HttpBody http_body = 2; \} service ResourceService { rpc GetResource(GetResourceRequest) returns (google.api.HttpBody); rpc UpdateResource(google.api.HttpBody) returns (google.protobuf.Empty); \} Example with streaming methods: service CaldavService { rpc GetCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); rpc UpdateCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); \} Use of this type only changes how the request and response bodies are handled, all other features will continue to work unchanged.
     */
    export interface Schema$HttpBody {
        /**
         * The HTTP Content-Type header value specifying the content type of the body.
         */
        contentType?: string | null;
        /**
         * The HTTP request/response body as raw binary.
         */
        data?: string | null;
        /**
         * Application specific response metadata. Must be set in the first response for streaming APIs.
         */
        extensions?: Array<{
            [key: string]: any;
        }> | null;
    }
    /**
     * Raw bytes representing consent artifact content.
     */
    export interface Schema$Image {
        /**
         * Input only. Points to a Cloud Storage URI containing the consent artifact content. The URI must be in the following format: `gs://{bucket_id\}/{object_id\}`. The Cloud Healthcare API service account must have the `roles/storage.objectViewer` Cloud IAM role for this Cloud Storage location. The consent artifact content at this URI is copied to a Cloud Storage location managed by the Cloud Healthcare API. Responses to fetching requests return the consent artifact content in raw_bytes.
         */
        gcsUri?: string | null;
        /**
         * Consent artifact content represented as a stream of bytes. This field is populated when returned in GetConsentArtifact response, but not included in CreateConsentArtifact and ListConsentArtifact response.
         */
        rawBytes?: string | null;
    }
    /**
     * Specifies how to handle de-identification of image pixels.
     */
    export interface Schema$ImageConfig {
        /**
         * Optional. Determines how to redact text from image.
         */
        textRedactionMode?: string | null;
    }
    /**
     * Imports data into the specified DICOM store. Returns an error if any of the files to import are not DICOM files. This API accepts duplicate DICOM instances by ignoring the newly-pushed instance. It does not overwrite.
     */
    export interface Schema$ImportDicomDataRequest {
        /**
         * Optional. The blob storage settings for the data imported by this operation.
         */
        blobStorageSettings?: Schema$BlobStorageSettings;
        /**
         * Cloud Storage source data location and import configuration. The Cloud Healthcare Service Agent requires the `roles/storage.objectViewer` Cloud IAM roles on the Cloud Storage location.
         */
        gcsSource?: Schema$GoogleCloudHealthcareV1DicomGcsSource;
    }
    /**
     * Returns additional information in regards to a completed DICOM store import.
     */
    export interface Schema$ImportDicomDataResponse {
    }
    /**
     * Request to import messages.
     */
    export interface Schema$ImportMessagesRequest {
        /**
         * Cloud Storage source data location and import configuration. The Cloud Healthcare Service Agent requires the `roles/storage.objectViewer` Cloud IAM roles on the Cloud Storage location.
         */
        gcsSource?: Schema$GcsSource;
    }
    /**
     * Final response of importing messages. This structure is included in the response to describe the detailed outcome. It is only included when the operation finishes successfully.
     */
    export interface Schema$ImportMessagesResponse {
    }
    /**
     * Request to import resources.
     */
    export interface Schema$ImportResourcesRequest {
        /**
         * The content structure in the source location. If not specified, the server treats the input source files as BUNDLE.
         */
        contentStructure?: string | null;
        /**
         * Cloud Storage source data location and import configuration. The Healthcare Service Agent account requires the `roles/storage.objectAdmin` role on the Cloud Storage location. Each Cloud Storage object should be a text file that contains the format specified in ContentStructure.
         */
        gcsSource?: Schema$GoogleCloudHealthcareV1FhirGcsSource;
    }
    /**
     * Final response of importing resources. This structure is included in the response to describe the detailed outcome after the operation finishes successfully.
     */
    export interface Schema$ImportResourcesResponse {
    }
    /**
     * A transformation to apply to text that is identified as a specific info_type.
     */
    export interface Schema$InfoTypeTransformation {
        /**
         * Config for character mask.
         */
        characterMaskConfig?: Schema$CharacterMaskConfig;
        /**
         * Config for crypto hash.
         */
        cryptoHashConfig?: Schema$CryptoHashConfig;
        /**
         * Config for date shift.
         */
        dateShiftConfig?: Schema$DateShiftConfig;
        /**
         * Optional. InfoTypes to apply this transformation to. If this is not specified, the transformation applies to any info_type.
         */
        infoTypes?: string[] | null;
        /**
         * Config for text redaction.
         */
        redactConfig?: Schema$RedactConfig;
        /**
         * Config for replace with InfoType.
         */
        replaceWithInfoTypeConfig?: Schema$ReplaceWithInfoTypeConfig;
    }
    /**
     * Ingests a message into the specified HL7v2 store.
     */
    export interface Schema$IngestMessageRequest {
        /**
         * Required. HL7v2 message to ingest.
         */
        message?: Schema$Message;
    }
    /**
     * Acknowledges that a message has been ingested into the specified HL7v2 store.
     */
    export interface Schema$IngestMessageResponse {
        /**
         * HL7v2 ACK message.
         */
        hl7Ack?: string | null;
        /**
         * Created message resource.
         */
        message?: Schema$Message;
    }
    /**
     * Include to use an existing data crypto key wrapped by KMS. The wrapped key must be a 128-, 192-, or 256-bit key. The key must grant the Cloud IAM permission `cloudkms.cryptoKeyVersions.useToDecrypt` to the project's Cloud Healthcare Service Agent service account. For more information, see [Creating a wrapped key] (https://cloud.google.com/dlp/docs/create-wrapped-key).
     */
    export interface Schema$KmsWrappedCryptoKey {
        /**
         * Required. The resource name of the KMS CryptoKey to use for unwrapping. For example, `projects/{project_id\}/locations/{location_id\}/keyRings/{keyring\}/cryptoKeys/{key\}`.
         */
        cryptoKey?: string | null;
        /**
         * Required. The wrapped data crypto key.
         */
        wrappedKey?: string | null;
    }
    /**
     * EntityMentions can be linked to multiple entities using a LinkedEntity message lets us add other fields, e.g. confidence.
     */
    export interface Schema$LinkedEntity {
        /**
         * entity_id is a concept unique identifier. These are prefixed by a string that identifies the entity coding system, followed by the unique identifier within that system. For example, "UMLS/C0000970". This also supports ad hoc entities, which are formed by normalizing entity mention content.
         */
        entityId?: string | null;
    }
    export interface Schema$ListAttributeDefinitionsResponse {
        /**
         * The returned Attribute definitions. The maximum number of attributes returned is determined by the value of page_size in the ListAttributeDefinitionsRequest.
         */
        attributeDefinitions?: Schema$AttributeDefinition[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListConsentArtifactsResponse {
        /**
         * The returned Consent artifacts. The maximum number of artifacts returned is determined by the value of page_size in the ListConsentArtifactsRequest.
         */
        consentArtifacts?: Schema$ConsentArtifact[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListConsentRevisionsResponse {
        /**
         * The returned Consent revisions. The maximum number of revisions returned is determined by the value of `page_size` in the ListConsentRevisionsRequest.
         */
        consents?: Schema$Consent[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListConsentsResponse {
        /**
         * The returned Consents. The maximum number of Consents returned is determined by the value of page_size in the ListConsentsRequest.
         */
        consents?: Schema$Consent[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListConsentStoresResponse {
        /**
         * The returned consent stores. The maximum number of stores returned is determined by the value of page_size in the ListConsentStoresRequest.
         */
        consentStores?: Schema$ConsentStore[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * Lists the available datasets.
     */
    export interface Schema$ListDatasetsResponse {
        /**
         * The first page of datasets.
         */
        datasets?: Schema$Dataset[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * Lists the DICOM stores in the given dataset.
     */
    export interface Schema$ListDicomStoresResponse {
        /**
         * The returned DICOM stores. Won't be more DICOM stores than the value of page_size in the request.
         */
        dicomStores?: Schema$DicomStore[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * Lists the FHIR stores in the given dataset.
     */
    export interface Schema$ListFhirStoresResponse {
        /**
         * The returned FHIR stores. Won't be more FHIR stores than the value of page_size in the request.
         */
        fhirStores?: Schema$FhirStore[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * Lists the HL7v2 stores in the given dataset.
     */
    export interface Schema$ListHl7V2StoresResponse {
        /**
         * The returned HL7v2 stores. Won't be more HL7v2 stores than the value of page_size in the request.
         */
        hl7V2Stores?: Schema$Hl7V2Store[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
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
     * Lists the messages in the specified HL7v2 store.
     */
    export interface Schema$ListMessagesResponse {
        /**
         * The returned Messages. Won't be more Messages than the value of page_size in the request. See view for populated fields.
         */
        hl7V2Messages?: Schema$Message[];
        /**
         * Token to retrieve the next page of results or empty if there are no more results in the list.
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
    export interface Schema$ListUserDataMappingsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The returned User data mappings. The maximum number of User data mappings returned is determined by the value of page_size in the ListUserDataMappingsRequest.
         */
        userDataMappings?: Schema$UserDataMapping[];
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
     * A complete HL7v2 message. See [Introduction to HL7 Standards] (https://www.hl7.org/implement/standards/index.cfm?ref=common) for details on the standard.
     */
    export interface Schema$Message {
        /**
         * Output only. The datetime when the message was created. Set by the server.
         */
        createTime?: string | null;
        /**
         * Required. Raw message bytes.
         */
        data?: string | null;
        /**
         * User-supplied key-value pairs used to organize HL7v2 stores. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: \p{Ll\}\p{Lo\}{0,62\} Label values are optional, must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\} No more than 64 labels can be associated with a given store.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The message type for this message. MSH-9.1.
         */
        messageType?: string | null;
        /**
         * Output only. Resource name of the Message, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7_v2_store_id\}/messages/{message_id\}`.
         */
        name?: string | null;
        /**
         * Output only. The parsed version of the raw message data.
         */
        parsedData?: Schema$ParsedData;
        /**
         * Output only. All patient IDs listed in the PID-2, PID-3, and PID-4 segments of this message.
         */
        patientIds?: Schema$PatientId[];
        /**
         * Output only. The parsed version of the raw message data schematized according to this store's schemas and type definitions.
         */
        schematizedData?: Schema$SchematizedData;
        /**
         * Output only. The hospital that this message came from. MSH-4.
         */
        sendFacility?: string | null;
        /**
         * Output only. The datetime the sending application sent this message. MSH-7.
         */
        sendTime?: string | null;
    }
    /**
     * Specifies where to send notifications upon changes to a data store.
     */
    export interface Schema$NotificationConfig {
        /**
         * The [Pub/Sub](https://cloud.google.com/pubsub/docs/) topic that notifications of changes are published on. Supplied by the client. PubsubMessage.Data contains the resource name. PubsubMessage.MessageId is the ID of this message. It is guaranteed to be unique within the topic. PubsubMessage.PublishTime is the time at which the message was published. Notifications are only sent if the topic is non-empty. [Topic names](https://cloud.google.com/pubsub/docs/overview#names) must be scoped to a project. Cloud Healthcare API service account must have publisher permissions on the given Pub/Sub topic. Not having adequate permissions causes the calls that send notifications to fail. If a notification can't be published to Pub/Sub, errors are logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). If the number of errors exceeds a certain rate, some aren't submitted. Note that not all operations trigger notifications, see [Configuring Pub/Sub notifications](https://cloud.google.com/healthcare/docs/how-tos/pubsub) for specific details.
         */
        pubsubTopic?: string | null;
        /**
         * Indicates whether or not to send Pub/Sub notifications on bulk import. Only supported for DICOM imports.
         */
        sendForBulkImport?: boolean | null;
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
     * OperationMetadata provides information about the operation execution. Returned in the long-running operation's metadata field.
     */
    export interface Schema$OperationMetadata {
        /**
         * The name of the API method that initiated the operation.
         */
        apiMethodName?: string | null;
        /**
         * Specifies if cancellation was requested for the operation.
         */
        cancelRequested?: boolean | null;
        counter?: Schema$ProgressCounter;
        /**
         * The time at which the operation was created by the API.
         */
        createTime?: string | null;
        /**
         * The time at which execution was completed.
         */
        endTime?: string | null;
        /**
         * A link to audit and error logs in the log viewer. Error logs are generated only by some operations, listed at [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging).
         */
        logsUrl?: string | null;
    }
    /**
     * The content of a HL7v2 message in a structured format.
     */
    export interface Schema$ParsedData {
        segments?: Schema$Segment[];
    }
    /**
     * The configuration for the parser. It determines how the server parses the messages.
     */
    export interface Schema$ParserConfig {
        /**
         * Optional. Determines whether messages with no header are allowed.
         */
        allowNullHeader?: boolean | null;
        /**
         * Optional. Schemas used to parse messages in this store, if schematized parsing is desired.
         */
        schema?: Schema$SchemaPackage;
        /**
         * Optional. Byte(s) to use as the segment terminator. If this is unset, '\r' is used as segment terminator, matching the HL7 version 2 specification.
         */
        segmentTerminator?: string | null;
        /**
         * Immutable. Determines the version of both the default parser to be used when `schema` is not given, as well as the schematized parser used when `schema` is specified. This field is immutable after HL7v2 store creation.
         */
        version?: string | null;
    }
    /**
     * A patient identifier and associated type.
     */
    export interface Schema$PatientId {
        /**
         * ID type. For example, MRN or NHS.
         */
        type?: string | null;
        /**
         * The patient's unique identifier.
         */
        value?: string | null;
    }
    /**
     * Apply consents given by a list of patients.
     */
    export interface Schema$PatientScope {
        /**
         * Optional. The list of patient IDs whose Consent resources will be enforced. At most 10,000 patients can be specified. An empty list is equivalent to all patients (meaning the entire FHIR store).
         */
        patientIds?: string[] | null;
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
     * ProgressCounter provides counters to describe an operation's progress.
     */
    export interface Schema$ProgressCounter {
        /**
         * The number of units that failed in the operation.
         */
        failure?: string | null;
        /**
         * The number of units that are pending in the operation.
         */
        pending?: string | null;
        /**
         * The number of units that succeeded in the operation.
         */
        success?: string | null;
    }
    /**
     * The Pub/Sub output destination. The Cloud Healthcare Service Agent requires the `roles/pubsub.publisher` Cloud IAM role on the Pub/Sub topic.
     */
    export interface Schema$PubsubDestination {
        /**
         * The [Pub/Sub](https://cloud.google.com/pubsub/docs/) topic that Pub/Sub messages are published on. Supplied by the client. The `PubsubMessage` contains the following fields: * `PubsubMessage.Data` contains the resource name. * `PubsubMessage.MessageId` is the ID of this notification. It is guaranteed to be unique within the topic. * `PubsubMessage.PublishTime` is the time when the message was published. [Topic names](https://cloud.google.com/pubsub/docs/overview#names) must be scoped to a project. The Cloud Healthcare API service account, service-PROJECT_NUMBER@gcp-sa-healthcare.iam.gserviceaccount.com, must have publisher permissions on the given Pub/Sub topic. Not having adequate permissions causes the calls that send notifications to fail.
         */
        pubsubTopic?: string | null;
    }
    /**
     * Queries all data_ids that are consented for a given use in the given consent store and writes them to a specified destination. The returned Operation includes a progress counter for the number of User data mappings processed. Errors are logged to Cloud Logging (see [Viewing error logs in Cloud Logging] (https://cloud.google.com/healthcare/docs/how-tos/logging) and [QueryAccessibleData] for a sample log entry).
     */
    export interface Schema$QueryAccessibleDataRequest {
        /**
         * The Cloud Storage destination. The Cloud Healthcare API service account must have the `roles/storage.objectAdmin` Cloud IAM role for this Cloud Storage location.
         */
        gcsDestination?: Schema$GoogleCloudHealthcareV1ConsentGcsDestination;
        /**
         * The values of request attributes associated with this access request.
         */
        requestAttributes?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The values of resource attributes associated with the type of resources being requested. If no values are specified, then all resource types are included in the output.
         */
        resourceAttributes?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Response for successful QueryAccessibleData operations. This structure is included in the response upon operation completion.
     */
    export interface Schema$QueryAccessibleDataResponse {
        /**
         * List of files, each of which contains a list of data_id(s) that are consented for a specified use in the request.
         */
        gcsUris?: string[] | null;
    }
    /**
     * Define how to redact sensitive values. Default behaviour is erase. For example, "My name is Jane." becomes "My name is ."
     */
    export interface Schema$RedactConfig {
    }
    /**
     * Rejects the latest revision of the specified Consent by committing a new revision with `state` updated to `REJECTED`. If the latest revision of the given Consent is in the `REJECTED` state, no new revision is committed.
     */
    export interface Schema$RejectConsentRequest {
        /**
         * Optional. The resource name of the Consent artifact that contains documentation of the user's rejection of the draft Consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consentArtifacts/{consent_artifact_id\}`. If the draft Consent had a Consent artifact, this Consent artifact overwrites it.
         */
        consentArtifact?: string | null;
    }
    /**
     * When using the INSPECT_AND_TRANSFORM action, each match is replaced with the name of the info_type. For example, "My name is Jane" becomes "My name is [PERSON_NAME]." The TRANSFORM action is equivalent to redacting.
     */
    export interface Schema$ReplaceWithInfoTypeConfig {
    }
    /**
     * A list of FHIR resources.
     */
    export interface Schema$Resources {
        /**
         * List of resources IDs. For example, "Patient/1234".
         */
        resources?: string[] | null;
    }
    /**
     * The consent evaluation result for a single `data_id`.
     */
    export interface Schema$Result {
        /**
         * The resource names of all evaluated Consents mapped to their evaluation.
         */
        consentDetails?: {
            [key: string]: Schema$ConsentEvaluation;
        } | null;
        /**
         * Whether the resource is consented for the given use.
         */
        consented?: boolean | null;
        /**
         * The unique identifier of the evaluated resource.
         */
        dataId?: string | null;
    }
    /**
     * Revokes the latest revision of the specified Consent by committing a new revision with `state` updated to `REVOKED`. If the latest revision of the given Consent is in the `REVOKED` state, no new revision is committed.
     */
    export interface Schema$RevokeConsentRequest {
        /**
         * Optional. The resource name of the Consent artifact that contains proof of the user's revocation of the Consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consentArtifacts/{consent_artifact_id\}`.
         */
        consentArtifact?: string | null;
    }
    export interface Schema$RollbackFhirResourceFilteringFields {
        /**
         * Optional. A filter expression that matches data in the `Resource.meta` element. Supports all filters in [AIP-160](https://google.aip.dev/160) except the "has" (`:`) operator. Supports the following custom functions: * `tag("") = ""` for tag filtering. * `extension_value_ts("") = ` for filtering extensions with a timestamp, where `` is a Unix timestamp. Supports the `\>`, `<`, `<=`, `\>=`, and `!=` comparison operators.
         */
        metadataFilter?: string | null;
        /**
         * Optional. A list of operation IDs to roll back.
         */
        operationIds?: string[] | null;
    }
    export interface Schema$RollbackFhirResourcesRequest {
        /**
         * Optional. CREATE/UPDATE/DELETE/ALL for reverting all txns of a certain type.
         */
        changeType?: string | null;
        /**
         * Optional. Specifies whether to exclude earlier rollbacks.
         */
        excludeRollbacks?: boolean | null;
        /**
         * Optional. Parameters for filtering resources
         */
        filteringFields?: Schema$RollbackFhirResourceFilteringFields;
        /**
         * Optional. When enabled, changes will be reverted without explicit confirmation
         */
        force?: boolean | null;
        /**
         * Optional. Cloud Storage object containing list of {resourceType\}/{resourceId\} lines, identifying resources to be reverted
         */
        inputGcsObject?: string | null;
        /**
         * Required. Bucket to deposit result
         */
        resultGcsBucket?: string | null;
        /**
         * Required. Time point to rollback to.
         */
        rollbackTime?: string | null;
        /**
         * Optional. If specified, revert only resources of these types
         */
        type?: string[] | null;
    }
    /**
     * Final response of rollback FIHR resources request.
     */
    export interface Schema$RollbackFhirResourcesResponse {
        /**
         * The name of the FHIR store to rollback, in the format of "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\} /fhirStores/{fhir_store_id\}".
         */
        fhirStore?: string | null;
    }
    /**
     * Filtering fields for an HL7v2 rollback. Currently only supports a list of operation ids to roll back.
     */
    export interface Schema$RollbackHL7MessagesFilteringFields {
        /**
         * Optional. A list of operation IDs to roll back.
         */
        operationIds?: string[] | null;
    }
    /**
     * Point in time recovery rollback request.
     */
    export interface Schema$RollbackHl7V2MessagesRequest {
        /**
         * Optional. CREATE/UPDATE/DELETE/ALL for reverting all txns of a certain type.
         */
        changeType?: string | null;
        /**
         * Optional. Specifies whether to exclude earlier rollbacks.
         */
        excludeRollbacks?: boolean | null;
        /**
         * Optional. Parameters for filtering.
         */
        filteringFields?: Schema$RollbackHL7MessagesFilteringFields;
        /**
         * Optional. When enabled, changes will be reverted without explicit confirmation.
         */
        force?: boolean | null;
        /**
         * Optional. Cloud storage object containing list of {resourceId\} lines, identifying resources to be reverted
         */
        inputGcsObject?: string | null;
        /**
         * Required. Bucket to deposit result
         */
        resultGcsBucket?: string | null;
        /**
         * Required. Times point to rollback to.
         */
        rollbackTime?: string | null;
    }
    /**
     * Final response of rollback HL7v2 messages request.
     */
    export interface Schema$RollbackHl7V2MessagesResponse {
        /**
         * The name of the HL7v2 store to rollback, in the format of "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\} /hl7v2Stores/{hl7v2_store_id\}".
         */
        hl7v2Store?: string | null;
    }
    /**
     * Configuration for the FHIR BigQuery schema. Determines how the server generates the schema.
     */
    export interface Schema$SchemaConfig {
        /**
         * The configuration for exported BigQuery tables to be partitioned by FHIR resource's last updated time column.
         */
        lastUpdatedPartitionConfig?: Schema$TimePartitioning;
        /**
         * The depth for all recursive structures in the output analytics schema. For example, `concept` in the CodeSystem resource is a recursive structure; when the depth is 2, the CodeSystem table will have a column called `concept.concept` but not `concept.concept.concept`. If not specified or set to 0, the server will use the default value 2. The maximum depth allowed is 5.
         */
        recursiveStructureDepth?: string | null;
        /**
         * Specifies the output schema type. Schema type is required.
         */
        schemaType?: string | null;
    }
    /**
     * An HL7v2 logical group construct.
     */
    export interface Schema$SchemaGroup {
        /**
         * True indicates that this is a choice group, meaning that only one of its segments can exist in a given message.
         */
        choice?: boolean | null;
        /**
         * The maximum number of times this group can be repeated. 0 or -1 means unbounded.
         */
        maxOccurs?: number | null;
        /**
         * Nested groups and/or segments.
         */
        members?: Schema$GroupOrSegment[];
        /**
         * The minimum number of times this group must be present/repeated.
         */
        minOccurs?: number | null;
        /**
         * The name of this group. For example, "ORDER_DETAIL".
         */
        name?: string | null;
    }
    /**
     * A schema package contains a set of schemas and type definitions.
     */
    export interface Schema$SchemaPackage {
        /**
         * Optional. Flag to ignore all min_occurs restrictions in the schema. This means that incoming messages can omit any group, segment, field, component, or subcomponent.
         */
        ignoreMinOccurs?: boolean | null;
        /**
         * Optional. Schema configs that are layered based on their VersionSources that match the incoming message. Schema configs present in higher indices override those in lower indices with the same message type and trigger event if their VersionSources all match an incoming message.
         */
        schemas?: Schema$Hl7SchemaConfig[];
        /**
         * Optional. Determines how messages that fail to parse are handled.
         */
        schematizedParsingType?: string | null;
        /**
         * Optional. Schema type definitions that are layered based on their VersionSources that match the incoming message. Type definitions present in higher indices override those in lower indices with the same type name if their VersionSources all match an incoming message.
         */
        types?: Schema$Hl7TypesConfig[];
        /**
         * Optional. Determines how unexpected segments (segments not matched to the schema) are handled.
         */
        unexpectedSegmentHandling?: string | null;
    }
    /**
     * An HL7v2 Segment.
     */
    export interface Schema$SchemaSegment {
        /**
         * The maximum number of times this segment can be present in this group. 0 or -1 means unbounded.
         */
        maxOccurs?: number | null;
        /**
         * The minimum number of times this segment can be present in this group.
         */
        minOccurs?: number | null;
        /**
         * The Segment type. For example, "PID".
         */
        type?: string | null;
    }
    /**
     * The content of an HL7v2 message in a structured format as specified by a schema.
     */
    export interface Schema$SchematizedData {
        /**
         * JSON output of the parser.
         */
        data?: string | null;
        /**
         * The error output of the parser.
         */
        error?: string | null;
    }
    /**
     * Request to search the resources in the specified FHIR store.
     */
    export interface Schema$SearchResourcesRequest {
        /**
         * Optional. The FHIR resource type to search, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](http://hl7.org/implement/standards/fhir/R4/resourcelist.html)).
         */
        resourceType?: string | null;
    }
    /**
     * A segment in a structured format.
     */
    export interface Schema$Segment {
        /**
         * A mapping from the positional location to the value. The key string uses zero-based indexes separated by dots to identify Fields, components and sub-components. A bracket notation is also used to identify different instances of a repeated field. Regex for key: (\d+)(\[\d+\])?(.\d+)?(.\d+)? Examples of (key, value) pairs: * (0.1, "hemoglobin") denotes that the first component of Field 0 has the value "hemoglobin". * (1.1.2, "CBC") denotes that the second sub-component of the first component of Field 1 has the value "CBC". * (1[0].1, "HbA1c") denotes that the first component of the first Instance of Field 1, which is repeated, has the value "HbA1c".
         */
        fields?: {
            [key: string]: string;
        } | null;
        /**
         * A string that indicates the type of segment. For example, EVN or PID.
         */
        segmentId?: string | null;
        /**
         * Set ID for segments that can be in a set. This can be empty if it's missing or isn't applicable.
         */
        setId?: string | null;
    }
    /**
     * SeriesMetrics contains metrics describing a DICOM series.
     */
    export interface Schema$SeriesMetrics {
        /**
         * Total blob storage bytes for all instances in the series.
         */
        blobStorageSizeBytes?: string | null;
        /**
         * Number of instances in the series.
         */
        instanceCount?: string | null;
        /**
         * The series resource path. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}/dicomWeb/studies/{study_uid\}/series/{series_uid\}`.
         */
        series?: string | null;
        /**
         * Total structured storage bytes for all instances in the series.
         */
        structuredStorageSizeBytes?: string | null;
    }
    /**
     * Request message for `SetBlobStorageSettings` method.
     */
    export interface Schema$SetBlobStorageSettingsRequest {
        /**
         * The blob storage settings to update for the specified resources. Only fields listed in `update_mask` are applied.
         */
        blobStorageSettings?: Schema$BlobStorageSettings;
        /**
         * Optional. A filter configuration. If `filter_config` is specified, set the value of `resource` to the resource name of a DICOM store in the format `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}`.
         */
        filterConfig?: Schema$DicomFilterConfig;
    }
    /**
     * Returns additional info in regards to a completed set blob storage settings API.
     */
    export interface Schema$SetBlobStorageSettingsResponse {
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
     * User signature.
     */
    export interface Schema$Signature {
        /**
         * Optional. An image of the user's signature.
         */
        image?: Schema$Image;
        /**
         * Optional. Metadata associated with the user's signature. For example, the user's name or the user's title.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Timestamp of the signature.
         */
        signatureTime?: string | null;
        /**
         * Required. User's UUID provided by the client.
         */
        userId?: string | null;
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
     * StorageInfo encapsulates all the storage info of a resource.
     */
    export interface Schema$StorageInfo {
        /**
         * Info about the data stored in blob storage for the resource.
         */
        blobStorageInfo?: Schema$BlobStorageInfo;
        /**
         * The resource whose storage info is returned. For example: `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/instances/{instanceUID\}`
         */
        referencedResource?: string | null;
        /**
         * Info about the data stored in structured storage for the resource.
         */
        structuredStorageInfo?: Schema$StructuredStorageInfo;
    }
    /**
     * Contains configuration for streaming FHIR export.
     */
    export interface Schema$StreamConfig {
        /**
         * Optional. The destination BigQuery structure that contains both the dataset location and corresponding schema config. The output is organized in one table per resource type. The server reuses the existing tables (if any) that are named after the resource types. For example, "Patient", "Observation". When there is no existing table for a given resource type, the server attempts to create one. When a table schema doesn't align with the schema config, either because of existing incompatible schema or out of band incompatible modification, the server does not stream in new data. BigQuery imposes a 1 MB limit on streaming insert row size, therefore any resource mutation that generates more than 1 MB of BigQuery data is not streamed. One resolution in this case is to delete the incompatible table and let the server recreate one, though the newly created table only contains data after the table recreation. Results are written to BigQuery tables according to the parameters in BigQueryDestination.WriteDisposition. Different versions of the same resource are distinguishable by the meta.versionId and meta.lastUpdated columns. The operation (CREATE/UPDATE/DELETE) that results in the new version is recorded in the meta.tag. The tables contain all historical resource versions since streaming was enabled. For query convenience, the server also creates one view per table of the same name containing only the current resource version. The streamed data in the BigQuery dataset is not guaranteed to be completely unique. The combination of the id and meta.versionId columns should ideally identify a single unique row. But in rare cases, duplicates may exist. At query time, users may use the SQL select statement to keep only one of the duplicate rows given an id and meta.versionId pair. Alternatively, the server created view mentioned above also filters out duplicates. If a resource mutation cannot be streamed to BigQuery, errors are logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         */
        bigqueryDestination?: Schema$GoogleCloudHealthcareV1FhirBigQueryDestination;
        /**
         * The destination FHIR store for de-identified resources. After this field is added, all subsequent creates/updates/patches to the source store will be de-identified using the provided configuration and applied to the destination store. Resources deleted from the source store will be deleted from the destination store. Importing resources to the source store will not trigger the streaming. If the source store already contains resources when this option is enabled, those resources will not be copied to the destination store unless they are subsequently updated. This may result in invalid references in the destination store. Before adding this config, you must grant the healthcare.fhirResources.update permission on the destination store to your project's **Cloud Healthcare Service Agent** [service account](https://cloud.google.com/healthcare/docs/how-tos/permissions-healthcare-api-gcp-products#the_cloud_healthcare_service_agent). The destination store must set enable_update_create to true. The destination store must have disable_referential_integrity set to true. If a resource cannot be de-identified, errors will be logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         */
        deidentifiedStoreDestination?: Schema$DeidentifiedStoreDestination;
        /**
         * Optional. Supply a FHIR resource type (such as "Patient" or "Observation"). See https://www.hl7.org/fhir/valueset-resource-types.html for a list of all FHIR resource types. The server treats an empty list as an intent to stream all the supported resource types in this FHIR store.
         */
        resourceTypes?: string[] | null;
    }
    /**
     * StructuredStorageInfo contains details about the data stored in Structured Storage for the referenced resource.
     */
    export interface Schema$StructuredStorageInfo {
        /**
         * Size in bytes of data stored in structured storage.
         */
        sizeBytes?: string | null;
    }
    /**
     * StudyMetrics contains metrics describing a DICOM study.
     */
    export interface Schema$StudyMetrics {
        /**
         * Total blob storage bytes for all instances in the study.
         */
        blobStorageSizeBytes?: string | null;
        /**
         * Number of instances in the study.
         */
        instanceCount?: string | null;
        /**
         * Number of series in the study.
         */
        seriesCount?: string | null;
        /**
         * Total structured storage bytes for all instances in the study.
         */
        structuredStorageSizeBytes?: string | null;
        /**
         * The study resource path. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}/dicomWeb/studies/{study_uid\}`.
         */
        study?: string | null;
    }
    /**
     * List of tags to be filtered.
     */
    export interface Schema$TagFilterList {
        /**
         * Optional. Tags to be filtered. Tags must be DICOM Data Elements, File Meta Elements, or Directory Structuring Elements, as defined at: http://dicom.nema.org/medical/dicom/current/output/html/part06.html#table_6-1,. They may be provided by "Keyword" or "Tag". For example "PatientID", "00100010".
         */
        tags?: string[] | null;
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
    export interface Schema$TextConfig {
        /**
         * Optional. Transformations to apply to the detected data, overridden by `exclude_info_types`.
         */
        additionalTransformations?: Schema$InfoTypeTransformation[];
        /**
         * Optional. InfoTypes to skip transforming, overriding `additional_transformations`.
         */
        excludeInfoTypes?: string[] | null;
        /**
         * Optional. The transformations to apply to the detected data. Deprecated. Use `additional_transformations` instead.
         */
        transformations?: Schema$InfoTypeTransformation[];
    }
    /**
     * A span of text in the provided document.
     */
    export interface Schema$TextSpan {
        /**
         * The unicode codepoint index of the beginning of this span.
         */
        beginOffset?: number | null;
        /**
         * The original text contained in this span.
         */
        content?: string | null;
    }
    /**
     * Configuration for FHIR BigQuery time-partitioned tables.
     */
    export interface Schema$TimePartitioning {
        /**
         * Number of milliseconds for which to keep the storage for a partition.
         */
        expirationMs?: string | null;
        /**
         * Type of partitioning.
         */
        type?: string | null;
    }
    /**
     * Apply consents given by patients whose most recent consent changes are in the time range. Note that after identifying these patients, the server applies all Consent resources given by those patients, not just the Consent resources within the timestamp in the range.
     */
    export interface Schema$TimeRange {
        /**
         * Optional. The latest consent change time, in format YYYY-MM-DDThh:mm:ss.sss+zz:zz If not specified, the system uses the time when ApplyConsents was called.
         */
        end?: string | null;
        /**
         * Optional. The earliest consent change time, in format YYYY-MM-DDThh:mm:ss.sss+zz:zz If not specified, the system uses the FHIR store creation time.
         */
        start?: string | null;
    }
    /**
     * A type definition for some HL7v2 type (incl. Segments and Datatypes).
     */
    export interface Schema$Type {
        /**
         * The (sub) fields this type has (if not primitive).
         */
        fields?: Schema$Field[];
        /**
         * The name of this type. This would be the segment or datatype name. For example, "PID" or "XPN".
         */
        name?: string | null;
        /**
         * If this is a primitive type then this field is the type of the primitive For example, STRING. Leave unspecified for composite types.
         */
        primitive?: string | null;
    }
    /**
     * Maps a resource to the associated user and Attributes.
     */
    export interface Schema$UserDataMapping {
        /**
         * Output only. Indicates whether this mapping is archived.
         */
        archived?: boolean | null;
        /**
         * Output only. Indicates the time when this mapping was archived.
         */
        archiveTime?: string | null;
        /**
         * Required. A unique identifier for the mapped resource.
         */
        dataId?: string | null;
        /**
         * Resource name of the User data mapping, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/userDataMappings/{user_data_mapping_id\}`.
         */
        name?: string | null;
        /**
         * Attributes of the resource. Only explicitly set attributes are displayed here. Attribute definitions with defaults set implicitly apply to these User data mappings. Attributes listed here must be single valued, that is, exactly one value is specified for the field "values" in each Attribute.
         */
        resourceAttributes?: Schema$Attribute[];
        /**
         * Required. User's UUID provided by the client.
         */
        userId?: string | null;
    }
    /**
     * Contains the configuration for FHIR profiles and validation.
     */
    export interface Schema$ValidationConfig {
        /**
         * Optional. Whether to disable FHIRPath validation for incoming resources. The default value is false. Set this to true to disable checking incoming resources for conformance against FHIRPath requirement defined in the FHIR specification. This property only affects resource types that do not have profiles configured for them, any rules in enabled implementation guides will still be enforced.
         */
        disableFhirpathValidation?: boolean | null;
        /**
         * Optional. Whether to disable profile validation for this FHIR store. The default value is false. Set this to true to disable checking incoming resources for conformance against structure definitions in this FHIR store.
         */
        disableProfileValidation?: boolean | null;
        /**
         * Optional. Whether to disable reference type validation for incoming resources. The default value is false. Set this to true to disable checking incoming resources for conformance against reference type requirement defined in the FHIR specification. This property only affects resource types that do not have profiles configured for them, any rules in enabled implementation guides will still be enforced.
         */
        disableReferenceTypeValidation?: boolean | null;
        /**
         * Optional. Whether to disable required fields validation for incoming resources. The default value is false. Set this to true to disable checking incoming resources for conformance against required fields requirement defined in the FHIR specification. This property only affects resource types that do not have profiles configured for them, any rules in enabled implementation guides will still be enforced.
         */
        disableRequiredFieldValidation?: boolean | null;
        /**
         * Optional. A list of implementation guide URLs in this FHIR store that are used to configure the profiles to use for validation. For example, to use the US Core profiles for validation, set `enabled_implementation_guides` to `["http://hl7.org/fhir/us/core/ImplementationGuide/ig"]`. If `enabled_implementation_guides` is empty or omitted, then incoming resources are only required to conform to the base FHIR profiles. Otherwise, a resource must conform to at least one profile listed in the `global` property of one of the enabled ImplementationGuides. The Cloud Healthcare API does not currently enforce all of the rules in a StructureDefinition. The following rules are supported: - min/max - minValue/maxValue - maxLength - type - fixed[x] - pattern[x] on simple types - slicing, when using "value" as the discriminator type When a URL cannot be resolved (for example, in a type assertion), the server does not return an error.
         */
        enabledImplementationGuides?: string[] | null;
    }
    /**
     * Describes a selector for extracting and matching an MSH field to a value.
     */
    export interface Schema$VersionSource {
        /**
         * The field to extract from the MSH segment. For example, "3.1" or "18[1].1".
         */
        mshField?: string | null;
        /**
         * The value to match with the field. For example, "My Application Name" or "2.3".
         */
        value?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        datasets: Resource$Projects$Locations$Datasets;
        services: Resource$Projects$Locations$Services;
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
    export class Resource$Projects$Locations$Datasets {
        context: APIRequestContext;
        consentStores: Resource$Projects$Locations$Datasets$Consentstores;
        dataMapperWorkspaces: Resource$Projects$Locations$Datasets$Datamapperworkspaces;
        dicomStores: Resource$Projects$Locations$Datasets$Dicomstores;
        fhirStores: Resource$Projects$Locations$Datasets$Fhirstores;
        hl7V2Stores: Resource$Projects$Locations$Datasets$Hl7v2stores;
        operations: Resource$Projects$Locations$Datasets$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new health dataset. Results are returned through the Operation interface which returns either an `Operation.response` which contains a Dataset or `Operation.error`. The metadata field type is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a new dataset containing de-identified data from the source dataset. The metadata field type is OperationMetadata. If the request is successful, the response field type is DeidentifySummary. If errors occur, error is set. The LRO result may still be successful if de-identification fails for some DICOM instances. The new de-identified dataset will not contain these failed resources. Failed resource totals are tracked in Operation.metadata. Error details are also logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Deidentify, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deidentify(params?: Params$Resource$Projects$Locations$Datasets$Deidentify, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Deidentify, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Deidentify, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Deidentify, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the specified health dataset and all data contained in the dataset. Deleting a dataset does not affect the sources from which the dataset was imported (if any).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets any metadata associated with a dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Dataset>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Get, options: MethodOptions | BodyResponseCallback<Schema$Dataset>, callback: BodyResponseCallback<Schema$Dataset>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Get, callback: BodyResponseCallback<Schema$Dataset>): void;
        get(callback: BodyResponseCallback<Schema$Dataset>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists the health datasets in the current project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDatasetsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$List, options: MethodOptions | BodyResponseCallback<Schema$ListDatasetsResponse>, callback: BodyResponseCallback<Schema$ListDatasetsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$List, callback: BodyResponseCallback<Schema$ListDatasetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDatasetsResponse>): void;
        /**
         * Updates dataset metadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Dataset>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Patch, options: MethodOptions | BodyResponseCallback<Schema$Dataset>, callback: BodyResponseCallback<Schema$Dataset>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Patch, callback: BodyResponseCallback<Schema$Dataset>): void;
        patch(callback: BodyResponseCallback<Schema$Dataset>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Create extends StandardParameters {
        /**
         * Required. The ID of the dataset that is being created. The string must match the following regex: `[\p{L\}\p{N\}_\-\.]{1,256\}`.
         */
        datasetId?: string;
        /**
         * Required. The name of the project where the server creates the dataset. For example, `projects/{project_id\}/locations/{location_id\}`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Dataset;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Deidentify extends StandardParameters {
        /**
         * Required. Source dataset resource name. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}`.
         */
        sourceDataset?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeidentifyDatasetRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Delete extends StandardParameters {
        /**
         * Required. The name of the dataset to delete. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Get extends StandardParameters {
        /**
         * Required. The name of the dataset to read. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$List extends StandardParameters {
        /**
         * The maximum number of items to return. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The name of the project whose datasets should be listed. For example, `projects/{project_id\}/locations/{location_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the dataset, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Dataset;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Consentstores {
        context: APIRequestContext;
        attributeDefinitions: Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions;
        consentArtifacts: Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts;
        consents: Resource$Projects$Locations$Datasets$Consentstores$Consents;
        userDataMappings: Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings;
        constructor(context: APIRequestContext);
        /**
         * Checks if a particular data_id of a User data mapping in the specified consent store is consented for the specified use.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkDataAccess(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkDataAccess(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckDataAccessResponse>>;
        checkDataAccess(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkDataAccess(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess, options: MethodOptions | BodyResponseCallback<Schema$CheckDataAccessResponse>, callback: BodyResponseCallback<Schema$CheckDataAccessResponse>): void;
        checkDataAccess(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess, callback: BodyResponseCallback<Schema$CheckDataAccessResponse>): void;
        checkDataAccess(callback: BodyResponseCallback<Schema$CheckDataAccessResponse>): void;
        /**
         * Creates a new consent store in the parent dataset. Attempting to create a consent store with the same ID as an existing store fails with an ALREADY_EXISTS error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConsentStore>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Create, options: MethodOptions | BodyResponseCallback<Schema$ConsentStore>, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Create, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        create(callback: BodyResponseCallback<Schema$ConsentStore>): void;
        /**
         * Deletes the specified consent store and removes all the consent store's data.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Evaluates the user's Consents for all matching User data mappings. Note: User data mappings are indexed asynchronously, which can cause a slight delay between the time mappings are created or updated and when they are included in EvaluateUserConsents results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        evaluateUserConsents(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        evaluateUserConsents(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EvaluateUserConsentsResponse>>;
        evaluateUserConsents(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        evaluateUserConsents(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents, options: MethodOptions | BodyResponseCallback<Schema$EvaluateUserConsentsResponse>, callback: BodyResponseCallback<Schema$EvaluateUserConsentsResponse>): void;
        evaluateUserConsents(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents, callback: BodyResponseCallback<Schema$EvaluateUserConsentsResponse>): void;
        evaluateUserConsents(callback: BodyResponseCallback<Schema$EvaluateUserConsentsResponse>): void;
        /**
         * Gets the specified consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConsentStore>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Get, options: MethodOptions | BodyResponseCallback<Schema$ConsentStore>, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Get, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        get(callback: BodyResponseCallback<Schema$ConsentStore>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists the consent stores in the specified dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListConsentStoresResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$List, options: MethodOptions | BodyResponseCallback<Schema$ListConsentStoresResponse>, callback: BodyResponseCallback<Schema$ListConsentStoresResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$List, callback: BodyResponseCallback<Schema$ListConsentStoresResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListConsentStoresResponse>): void;
        /**
         * Updates the specified consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConsentStore>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Patch, options: MethodOptions | BodyResponseCallback<Schema$ConsentStore>, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Patch, callback: BodyResponseCallback<Schema$ConsentStore>): void;
        patch(callback: BodyResponseCallback<Schema$ConsentStore>): void;
        /**
         * Queries all data_ids that are consented for a specified use in the given consent store and writes them to a specified destination. The returned Operation includes a progress counter for the number of User data mappings processed. If the request is successful, a detailed response is returned of type QueryAccessibleDataResponse, contained in the response field when the operation finishes. The metadata field type is OperationMetadata. Errors are logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). For example, the following sample log entry shows a `failed to evaluate consent policy` error that occurred during a QueryAccessibleData call to consent store `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}`. ```json jsonPayload: { @type: "type.googleapis.com/google.cloud.healthcare.logging.QueryAccessibleDataLogEntry" error: { code: 9 message: "failed to evaluate consent policy" \} resourceName: "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}" \} logName: "projects/{project_id\}/logs/healthcare.googleapis.com%2Fquery_accessible_data" operation: { id: "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/operations/{operation_id\}" producer: "healthcare.googleapis.com/QueryAccessibleData" \} receiveTimestamp: "TIMESTAMP" resource: { labels: { consent_store_id: "{consent_store_id\}" dataset_id: "{dataset_id\}" location: "{location_id\}" project_id: "{project_id\}" \} type: "healthcare_consent_store" \} severity: "ERROR" timestamp: "TIMESTAMP" ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryAccessibleData(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryAccessibleData(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        queryAccessibleData(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryAccessibleData(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        queryAccessibleData(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata, callback: BodyResponseCallback<Schema$Operation>): void;
        queryAccessibleData(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Checkdataaccess extends StandardParameters {
        /**
         * Required. Name of the consent store where the requested data_id is stored, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}`.
         */
        consentStore?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CheckDataAccessRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Create extends StandardParameters {
        /**
         * Required. The ID of the consent store to create. The string must match the following regex: `[\p{L\}\p{N\}_\-\.]{1,256\}`. Cannot be changed after creation.
         */
        consentStoreId?: string;
        /**
         * Required. The name of the dataset this consent store belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ConsentStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Delete extends StandardParameters {
        /**
         * Required. The resource name of the consent store to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Evaluateuserconsents extends StandardParameters {
        /**
         * Required. Name of the consent store to retrieve User data mappings from.
         */
        consentStore?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EvaluateUserConsentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Get extends StandardParameters {
        /**
         * Required. The resource name of the consent store to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$List extends StandardParameters {
        /**
         * Optional. Restricts the stores returned to those matching a filter. Only filtering on labels is supported. For example, `filter=labels.key=value`.
         */
        filter?: string;
        /**
         * Optional. Limit on the number of consent stores to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. Token to retrieve the next page of results, or empty to get the first page.
         */
        pageToken?: string;
        /**
         * Required. Name of the dataset.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the consent store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}`. Cannot be changed after creation.
         */
        name?: string;
        /**
         * Required. The update mask that applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask. Only the `labels`, `default_consent_ttl`, and `enable_consent_create_on_update` fields are allowed to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ConsentStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Queryaccessibledata extends StandardParameters {
        /**
         * Required. Name of the consent store to retrieve User data mappings from.
         */
        consentStore?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryAccessibleDataRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Attribute definition in the parent consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AttributeDefinition>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create, options: MethodOptions | BodyResponseCallback<Schema$AttributeDefinition>, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        create(callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        /**
         * Deletes the specified Attribute definition. Fails if the Attribute definition is referenced by any User data mapping, or the latest revision of any Consent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the specified Attribute definition.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AttributeDefinition>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get, options: MethodOptions | BodyResponseCallback<Schema$AttributeDefinition>, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        get(callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        /**
         * Lists the Attribute definitions in the specified consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAttributeDefinitionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List, options: MethodOptions | BodyResponseCallback<Schema$ListAttributeDefinitionsResponse>, callback: BodyResponseCallback<Schema$ListAttributeDefinitionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List, callback: BodyResponseCallback<Schema$ListAttributeDefinitionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAttributeDefinitionsResponse>): void;
        /**
         * Updates the specified Attribute definition.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AttributeDefinition>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch, options: MethodOptions | BodyResponseCallback<Schema$AttributeDefinition>, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch, callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
        patch(callback: BodyResponseCallback<Schema$AttributeDefinition>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Create extends StandardParameters {
        /**
         * Required. The ID of the Attribute definition to create. The string must match the following regex: `_a-zA-Z{0,255\}` and must not be a reserved keyword within the Common Expression Language as listed on https://github.com/google/cel-spec/blob/master/doc/langdef.md.
         */
        attributeDefinitionId?: string;
        /**
         * Required. The name of the consent store that this Attribute definition belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AttributeDefinition;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Delete extends StandardParameters {
        /**
         * Required. The resource name of the Attribute definition to delete. To preserve referential integrity, Attribute definitions referenced by a User data mapping or the latest revision of a Consent cannot be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Get extends StandardParameters {
        /**
         * Required. The resource name of the Attribute definition to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$List extends StandardParameters {
        /**
         * Optional. Restricts the attributes returned to those matching a filter. The only field available for filtering is `category`. For example, `filter=category=\"REQUEST\"`.
         */
        filter?: string;
        /**
         * Optional. Limit on the number of Attribute definitions to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. Token to retrieve the next page of results or empty to get the first page.
         */
        pageToken?: string;
        /**
         * Required. Name of the consent store to retrieve Attribute definitions from.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Attributedefinitions$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the Attribute definition, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/attributeDefinitions/{attribute_definition_id\}`. Cannot be changed after creation.
         */
        name?: string;
        /**
         * Required. The update mask that applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask. Only the `description`, `allowed_values`, `consent_default_values` and `data_mapping_default_value` fields can be updated. The updated `allowed_values` must contain all values from the previous `allowed_values`.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AttributeDefinition;
    }
    export class Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Consent artifact in the parent consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConsentArtifact>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create, options: MethodOptions | BodyResponseCallback<Schema$ConsentArtifact>, callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create, callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        create(callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        /**
         * Deletes the specified Consent artifact. Fails if the artifact is referenced by the latest revision of any Consent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the specified Consent artifact.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ConsentArtifact>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get, options: MethodOptions | BodyResponseCallback<Schema$ConsentArtifact>, callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get, callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        get(callback: BodyResponseCallback<Schema$ConsentArtifact>): void;
        /**
         * Lists the Consent artifacts in the specified consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListConsentArtifactsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List, options: MethodOptions | BodyResponseCallback<Schema$ListConsentArtifactsResponse>, callback: BodyResponseCallback<Schema$ListConsentArtifactsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List, callback: BodyResponseCallback<Schema$ListConsentArtifactsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListConsentArtifactsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Create extends StandardParameters {
        /**
         * Required. The name of the consent store this Consent artifact belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ConsentArtifact;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Delete extends StandardParameters {
        /**
         * Required. The resource name of the Consent artifact to delete. To preserve referential integrity, Consent artifacts referenced by the latest revision of a Consent cannot be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$Get extends StandardParameters {
        /**
         * Required. The resource name of the Consent artifact to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consentartifacts$List extends StandardParameters {
        /**
         * Optional. Restricts the artifacts returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. The fields available for filtering are: - user_id. For example, `filter=user_id=\"user123\"`. - consent_content_version - metadata. For example, `filter=Metadata(\"testkey\")=\"value\"` or `filter=HasMetadata(\"testkey\")`.
         */
        filter?: string;
        /**
         * Optional. Limit on the number of consent artifacts to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the consent store to retrieve consent artifacts from.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Datasets$Consentstores$Consents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Activates the latest revision of the specified Consent by committing a new revision with `state` updated to `ACTIVE`. If the latest revision of the specified Consent is in the `ACTIVE` state, no new revision is committed. A FAILED_PRECONDITION error occurs if the latest revision of the specified Consent is in the `REJECTED` or `REVOKED` state.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        activate(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        activate(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        activate(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        activate(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        activate(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate, callback: BodyResponseCallback<Schema$Consent>): void;
        activate(callback: BodyResponseCallback<Schema$Consent>): void;
        /**
         * Creates a new Consent in the parent consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create, callback: BodyResponseCallback<Schema$Consent>): void;
        create(callback: BodyResponseCallback<Schema$Consent>): void;
        /**
         * Deletes the Consent and its revisions. To keep a record of the Consent but mark it inactive, see [RevokeConsent]. To delete a revision of a Consent, see [DeleteConsentRevision]. This operation does not delete the related Consent artifact.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes the specified revision of a Consent. An INVALID_ARGUMENT error occurs if the specified revision is the latest revision.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deleteRevision(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteRevision(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        deleteRevision(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteRevision(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteRevision(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteRevision(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the specified revision of a Consent, or the latest revision if `revision_id` is not specified in the resource name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get, callback: BodyResponseCallback<Schema$Consent>): void;
        get(callback: BodyResponseCallback<Schema$Consent>): void;
        /**
         * Lists the Consent in the given consent store, returning each Consent's latest revision.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListConsentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List, options: MethodOptions | BodyResponseCallback<Schema$ListConsentsResponse>, callback: BodyResponseCallback<Schema$ListConsentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List, callback: BodyResponseCallback<Schema$ListConsentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListConsentsResponse>): void;
        /**
         * Lists the revisions of the specified Consent in reverse chronological order.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listRevisions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listRevisions(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListConsentRevisionsResponse>>;
        listRevisions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listRevisions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions, options: MethodOptions | BodyResponseCallback<Schema$ListConsentRevisionsResponse>, callback: BodyResponseCallback<Schema$ListConsentRevisionsResponse>): void;
        listRevisions(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions, callback: BodyResponseCallback<Schema$ListConsentRevisionsResponse>): void;
        listRevisions(callback: BodyResponseCallback<Schema$ListConsentRevisionsResponse>): void;
        /**
         * Updates the latest revision of the specified Consent by committing a new revision with the changes. A FAILED_PRECONDITION error occurs if the latest revision of the specified Consent is in the `REJECTED` or `REVOKED` state.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch, callback: BodyResponseCallback<Schema$Consent>): void;
        patch(callback: BodyResponseCallback<Schema$Consent>): void;
        /**
         * Rejects the latest revision of the specified Consent by committing a new revision with `state` updated to `REJECTED`. If the latest revision of the specified Consent is in the `REJECTED` state, no new revision is committed. A FAILED_PRECONDITION error occurs if the latest revision of the specified Consent is in the `ACTIVE` or `REVOKED` state.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reject(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reject(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        reject(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reject(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        reject(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject, callback: BodyResponseCallback<Schema$Consent>): void;
        reject(callback: BodyResponseCallback<Schema$Consent>): void;
        /**
         * Revokes the latest revision of the specified Consent by committing a new revision with `state` updated to `REVOKED`. If the latest revision of the specified Consent is in the `REVOKED` state, no new revision is committed. A FAILED_PRECONDITION error occurs if the latest revision of the given consent is in `DRAFT` or `REJECTED` state.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        revoke(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        revoke(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Consent>>;
        revoke(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        revoke(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke, options: MethodOptions | BodyResponseCallback<Schema$Consent>, callback: BodyResponseCallback<Schema$Consent>): void;
        revoke(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke, callback: BodyResponseCallback<Schema$Consent>): void;
        revoke(callback: BodyResponseCallback<Schema$Consent>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Activate extends StandardParameters {
        /**
         * Required. The resource name of the Consent to activate, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. An INVALID_ARGUMENT error occurs if `revision_id` is specified in the name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ActivateConsentRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Create extends StandardParameters {
        /**
         * Required. Name of the consent store.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Consent;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Delete extends StandardParameters {
        /**
         * Required. The resource name of the Consent to delete, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. An INVALID_ARGUMENT error occurs if `revision_id` is specified in the name.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Deleterevision extends StandardParameters {
        /**
         * Required. The resource name of the Consent revision to delete, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}@{revision_id\}`. An INVALID_ARGUMENT error occurs if `revision_id` is not specified in the name.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Get extends StandardParameters {
        /**
         * Required. The resource name of the Consent to retrieve, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. In order to retrieve a previous revision of the Consent, also provide the revision ID: `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}@{revision_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$List extends StandardParameters {
        /**
         * Optional. Restricts the Consents returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. The fields available for filtering are: - user_id. For example, `filter='user_id="user123"'`. - consent_artifact - state - revision_create_time - metadata. For example, `filter=Metadata(\"testkey\")=\"value\"` or `filter=HasMetadata(\"testkey\")`.
         */
        filter?: string;
        /**
         * Optional. Limit on the number of Consents to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the consent store to retrieve Consents from.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Listrevisions extends StandardParameters {
        /**
         * Optional. Restricts the revisions returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. Fields available for filtering are: - user_id. For example, `filter='user_id="user123"'`. - consent_artifact - state - revision_create_time - metadata. For example, `filter=Metadata(\"testkey\")=\"value\"` or `filter=HasMetadata(\"testkey\")`.
         */
        filter?: string;
        /**
         * Required. The resource name of the Consent to retrieve revisions for.
         */
        name?: string;
        /**
         * Optional. Limit on the number of revisions to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. Token to retrieve the next page of results or empty if there are no more results in the list.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the Consent, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. Cannot be changed after creation.
         */
        name?: string;
        /**
         * Required. The update mask to apply to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask. Only the `user_id`, `policies`, `consent_artifact`, and `metadata` fields can be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Consent;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Reject extends StandardParameters {
        /**
         * Required. The resource name of the Consent to reject, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. An INVALID_ARGUMENT error occurs if `revision_id` is specified in the name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RejectConsentRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Consents$Revoke extends StandardParameters {
        /**
         * Required. The resource name of the Consent to revoke, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/consents/{consent_id\}`. An INVALID_ARGUMENT error occurs if `revision_id` is specified in the name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RevokeConsentRequest;
    }
    export class Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Archives the specified User data mapping.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        archive(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        archive(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ArchiveUserDataMappingResponse>>;
        archive(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        archive(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive, options: MethodOptions | BodyResponseCallback<Schema$ArchiveUserDataMappingResponse>, callback: BodyResponseCallback<Schema$ArchiveUserDataMappingResponse>): void;
        archive(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive, callback: BodyResponseCallback<Schema$ArchiveUserDataMappingResponse>): void;
        archive(callback: BodyResponseCallback<Schema$ArchiveUserDataMappingResponse>): void;
        /**
         * Creates a new User data mapping in the parent consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UserDataMapping>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create, options: MethodOptions | BodyResponseCallback<Schema$UserDataMapping>, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        create(callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        /**
         * Deletes the specified User data mapping.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the specified User data mapping.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UserDataMapping>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get, options: MethodOptions | BodyResponseCallback<Schema$UserDataMapping>, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        get(callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        /**
         * Lists the User data mappings in the specified consent store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListUserDataMappingsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List, options: MethodOptions | BodyResponseCallback<Schema$ListUserDataMappingsResponse>, callback: BodyResponseCallback<Schema$ListUserDataMappingsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List, callback: BodyResponseCallback<Schema$ListUserDataMappingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListUserDataMappingsResponse>): void;
        /**
         * Updates the specified User data mapping.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UserDataMapping>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch, options: MethodOptions | BodyResponseCallback<Schema$UserDataMapping>, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch, callback: BodyResponseCallback<Schema$UserDataMapping>): void;
        patch(callback: BodyResponseCallback<Schema$UserDataMapping>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Archive extends StandardParameters {
        /**
         * Required. The resource name of the User data mapping to archive.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ArchiveUserDataMappingRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Create extends StandardParameters {
        /**
         * Required. Name of the consent store.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UserDataMapping;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Delete extends StandardParameters {
        /**
         * Required. The resource name of the User data mapping to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Get extends StandardParameters {
        /**
         * Required. The resource name of the User data mapping to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$List extends StandardParameters {
        /**
         * Optional. Restricts the User data mappings returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. The fields available for filtering are: - data_id - user_id. For example, `filter=user_id=\"user123\"`. - archived - archive_time
         */
        filter?: string;
        /**
         * Optional. Limit on the number of User data mappings to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * Optional. Token to retrieve the next page of results, or empty to get the first page.
         */
        pageToken?: string;
        /**
         * Required. Name of the consent store to retrieve User data mappings from.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Consentstores$Userdatamappings$Patch extends StandardParameters {
        /**
         * Resource name of the User data mapping, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/consentStores/{consent_store_id\}/userDataMappings/{user_data_mapping_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask that applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask. Only the `data_id`, `user_id` and `resource_attributes` fields can be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UserDataMapping;
    }
    export class Resource$Projects$Locations$Datasets$Datamapperworkspaces {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Datamapperworkspaces$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores {
        context: APIRequestContext;
        dicomWeb: Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb;
        studies: Resource$Projects$Locations$Datasets$Dicomstores$Studies;
        constructor(context: APIRequestContext);
        /**
         * Creates a new DICOM store within the parent dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DicomStore>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Create, options: MethodOptions | BodyResponseCallback<Schema$DicomStore>, callback: BodyResponseCallback<Schema$DicomStore>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Create, callback: BodyResponseCallback<Schema$DicomStore>): void;
        create(callback: BodyResponseCallback<Schema$DicomStore>): void;
        /**
         * De-identifies data from the source store and writes it to the destination store. The metadata field type is OperationMetadata. If the request is successful, the response field type is DeidentifyDicomStoreSummary. If errors occur, error is set. The LRO result may still be successful if de-identification fails for some DICOM instances. The output DICOM store will not contain these failed resources. Failed resource totals are tracked in Operation.metadata. Error details are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deidentify(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the specified DICOM store and removes all images that are contained within it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Exports data to the specified destination by copying it from the DICOM store. Errors are also logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging). The metadata field type is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the specified DICOM store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DicomStore>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Get, options: MethodOptions | BodyResponseCallback<Schema$DicomStore>, callback: BodyResponseCallback<Schema$DicomStore>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Get, callback: BodyResponseCallback<Schema$DicomStore>): void;
        get(callback: BodyResponseCallback<Schema$DicomStore>): void;
        /**
         * Gets metrics associated with the DICOM store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDICOMStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDICOMStoreMetrics(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DicomStoreMetrics>>;
        getDICOMStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDICOMStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics, options: MethodOptions | BodyResponseCallback<Schema$DicomStoreMetrics>, callback: BodyResponseCallback<Schema$DicomStoreMetrics>): void;
        getDICOMStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics, callback: BodyResponseCallback<Schema$DicomStoreMetrics>): void;
        getDICOMStoreMetrics(callback: BodyResponseCallback<Schema$DicomStoreMetrics>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Imports data into the DICOM store by copying it from the specified source. Errors are logged to Cloud Logging. For more information, see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging). The metadata field type is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists the DICOM stores in the given dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDicomStoresResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$List, options: MethodOptions | BodyResponseCallback<Schema$ListDicomStoresResponse>, callback: BodyResponseCallback<Schema$ListDicomStoresResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$List, callback: BodyResponseCallback<Schema$ListDicomStoresResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDicomStoresResponse>): void;
        /**
         * Updates the specified DICOM store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DicomStore>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch, options: MethodOptions | BodyResponseCallback<Schema$DicomStore>, callback: BodyResponseCallback<Schema$DicomStore>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch, callback: BodyResponseCallback<Schema$DicomStore>): void;
        patch(callback: BodyResponseCallback<Schema$DicomStore>): void;
        /**
         * SearchForInstances returns a list of matching instances. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForInstances, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForInstances, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForInstances(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SearchForSeries returns a list of matching series. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForSeries, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForSeries, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForSeries(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForSeries(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SearchForStudies returns a list of matching studies. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForStudies, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForStudies, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForStudies(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForStudies(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForStudies(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForStudies(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForStudies(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForStudies(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SetBlobStorageSettings sets the blob storage settings of the specified resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setBlobStorageSettings(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings, callback: BodyResponseCallback<Schema$Operation>): void;
        setBlobStorageSettings(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * StoreInstances stores DICOM instances associated with study instance unique identifiers (SUID). See [Store Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.5). For details on the implementation of StoreInstances, see [Store transaction](https://cloud.google.com/healthcare/docs/dicom#store_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call StoreInstances, see [Store DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#store-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        storeInstances(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances, callback: BodyResponseCallback<Schema$HttpBody>): void;
        storeInstances(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Create extends StandardParameters {
        /**
         * Required. The ID of the DICOM store that is being created. Any string value up to 256 characters in length.
         */
        dicomStoreId?: string;
        /**
         * Required. The name of the dataset this DICOM store belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DicomStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Deidentify extends StandardParameters {
        /**
         * Required. Source DICOM store resource name. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        sourceStore?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeidentifyDicomStoreRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Delete extends StandardParameters {
        /**
         * Required. The resource name of the DICOM store to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Export extends StandardParameters {
        /**
         * Required. The DICOM store resource name from which to export the data. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportDicomDataRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Get extends StandardParameters {
        /**
         * Required. The resource name of the DICOM store to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Getdicomstoremetrics extends StandardParameters {
        /**
         * Required. The resource name of the DICOM store to get metrics for.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Import extends StandardParameters {
        /**
         * Required. The name of the DICOM store resource into which the data is imported. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportDicomDataRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$List extends StandardParameters {
        /**
         * Restricts stores returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. Only filtering on labels is supported. For example, `labels.key=value`.
         */
        filter?: string;
        /**
         * Limit on the number of DICOM stores to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the dataset.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the DICOM store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DicomStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforinstances extends StandardParameters {
        /**
         * Required. The path of the SearchForInstancesRequest DICOMweb request. For example, `instances`, `series/{series_uid\}/instances`, or `studies/{study_uid\}/instances`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforseries extends StandardParameters {
        /**
         * Required. The path of the SearchForSeries DICOMweb request. For example, `series` or `studies/{study_uid\}/series`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Searchforstudies extends StandardParameters {
        /**
         * Required. The path of the SearchForStudies DICOMweb request. For example, `studies`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Setblobstoragesettings extends StandardParameters {
        /**
         * Required. The path of the resource to update the blob storage settings in the format of `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}`, `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/`, or `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/instances/{instanceUID\}`. If `filter_config` is specified, set the value of `resource` to the resource name of a DICOM store in the format `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}`.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetBlobStorageSettingsRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Storeinstances extends StandardParameters {
        /**
         * Required. The path of the StoreInstances DICOMweb request. For example, `studies/[{study_uid\}]`. Note that the `study_uid` is optional.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb {
        context: APIRequestContext;
        studies: Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies {
        context: APIRequestContext;
        series: Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series;
        constructor(context: APIRequestContext);
        /**
         * GetStudyMetrics returns metrics for a study.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getStudyMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getStudyMetrics(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StudyMetrics>>;
        getStudyMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getStudyMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics, options: MethodOptions | BodyResponseCallback<Schema$StudyMetrics>, callback: BodyResponseCallback<Schema$StudyMetrics>): void;
        getStudyMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics, callback: BodyResponseCallback<Schema$StudyMetrics>): void;
        getStudyMetrics(callback: BodyResponseCallback<Schema$StudyMetrics>): void;
        /**
         * SetBlobStorageSettings sets the blob storage settings of the specified resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setBlobStorageSettings(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        setBlobStorageSettings(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings, callback: BodyResponseCallback<Schema$Operation>): void;
        setBlobStorageSettings(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Getstudymetrics extends StandardParameters {
        /**
         * Required. The study resource path. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}/dicomWeb/studies/{study_uid\}`.
         */
        study?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Setblobstoragesettings extends StandardParameters {
        /**
         * Required. The path of the resource to update the blob storage settings in the format of `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}`, `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/`, or `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/instances/{instanceUID\}`. If `filter_config` is specified, set the value of `resource` to the resource name of a DICOM store in the format `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}`.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetBlobStorageSettingsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series {
        context: APIRequestContext;
        instances: Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances;
        constructor(context: APIRequestContext);
        /**
         * GetSeriesMetrics returns metrics for a series.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSeriesMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSeriesMetrics(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SeriesMetrics>>;
        getSeriesMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSeriesMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics, options: MethodOptions | BodyResponseCallback<Schema$SeriesMetrics>, callback: BodyResponseCallback<Schema$SeriesMetrics>): void;
        getSeriesMetrics(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics, callback: BodyResponseCallback<Schema$SeriesMetrics>): void;
        getSeriesMetrics(callback: BodyResponseCallback<Schema$SeriesMetrics>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Getseriesmetrics extends StandardParameters {
        /**
         * Required. The series resource path. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}/dicomWeb/studies/{study_uid\}/series/{series_uid\}`.
         */
        series?: string;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * GetStorageInfo returns the storage info of the specified resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getStorageInfo(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getStorageInfo(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StorageInfo>>;
        getStorageInfo(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getStorageInfo(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo, options: MethodOptions | BodyResponseCallback<Schema$StorageInfo>, callback: BodyResponseCallback<Schema$StorageInfo>): void;
        getStorageInfo(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo, callback: BodyResponseCallback<Schema$StorageInfo>): void;
        getStorageInfo(callback: BodyResponseCallback<Schema$StorageInfo>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Dicomweb$Studies$Series$Instances$Getstorageinfo extends StandardParameters {
        /**
         * Required. The path of the instance to return storage info for, in the form: `projects/{projectID\}/locations/{locationID\}/datasets/{datasetID\}/dicomStores/{dicomStoreID\}/dicomWeb/studies/{studyUID\}/series/{seriesUID\}/instances/{instanceUID\}`
         */
        resource?: string;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Studies {
        context: APIRequestContext;
        series: Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series;
        constructor(context: APIRequestContext);
        /**
         * DeleteStudy deletes all instances within the given study. Delete requests are equivalent to the GET requests specified in the Retrieve transaction. The method returns an Operation which will be marked successful when the deletion is complete. Warning: Instances cannot be inserted into a study that is being deleted by an operation until the operation completes. For samples that show how to call DeleteStudy, see [Delete a study, series, or instance](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#delete-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * RetrieveStudyMetadata returns instance associated with the given study presented as metadata with the bulk data removed. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveStudyMetadata, see [Metadata resources](https://cloud.google.com/healthcare/docs/dicom#metadata_resources) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveStudyMetadata, see [Retrieve metadata](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-metadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveMetadata(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * RetrieveStudy returns all instances within the given study. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveStudy, see [DICOM study/series/instances](https://cloud.google.com/healthcare/docs/dicom#dicom_studyseriesinstances) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveStudy, see [Retrieve DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveStudy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveStudy(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveStudy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveStudy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveStudy(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveStudy(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SearchForInstances returns a list of matching instances. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForInstances, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForInstances, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForInstances(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SearchForSeries returns a list of matching series. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForSeries, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForSeries, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForSeries(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForSeries(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * StoreInstances stores DICOM instances associated with study instance unique identifiers (SUID). See [Store Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.5). For details on the implementation of StoreInstances, see [Store transaction](https://cloud.google.com/healthcare/docs/dicom#store_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call StoreInstances, see [Store DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#store-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        storeInstances(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        storeInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances, callback: BodyResponseCallback<Schema$HttpBody>): void;
        storeInstances(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Delete extends StandardParameters {
        /**
         * Required. The path of the DeleteStudy request. For example, `studies/{study_uid\}`.
         */
        dicomWebPath?: string;
        /**
         *
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievemetadata extends StandardParameters {
        /**
         * Required. The path of the RetrieveStudyMetadata DICOMweb request. For example, `studies/{study_uid\}/metadata`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Retrievestudy extends StandardParameters {
        /**
         * Required. The path of the RetrieveStudy DICOMweb request. For example, `studies/{study_uid\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforinstances extends StandardParameters {
        /**
         * Required. The path of the SearchForInstancesRequest DICOMweb request. For example, `instances`, `series/{series_uid\}/instances`, or `studies/{study_uid\}/instances`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Searchforseries extends StandardParameters {
        /**
         * Required. The path of the SearchForSeries DICOMweb request. For example, `series` or `studies/{study_uid\}/series`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Storeinstances extends StandardParameters {
        /**
         * Required. The path of the StoreInstances DICOMweb request. For example, `studies/[{study_uid\}]`. Note that the `study_uid` is optional.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series {
        context: APIRequestContext;
        instances: Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances;
        constructor(context: APIRequestContext);
        /**
         * DeleteSeries deletes all instances within the given study and series. Delete requests are equivalent to the GET requests specified in the Retrieve transaction. The method returns an Operation which will be marked successful when the deletion is complete. Warning: Instances cannot be inserted into a series that is being deleted by an operation until the operation completes. For samples that show how to call DeleteSeries, see [Delete a study, series, or instance](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#delete-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * RetrieveSeriesMetadata returns instance associated with the given study and series, presented as metadata with the bulk data removed. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveSeriesMetadata, see [Metadata resources](https://cloud.google.com/healthcare/docs/dicom#metadata_resources) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveSeriesMetadata, see [Retrieve metadata](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-metadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveMetadata(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * RetrieveSeries returns all instances within the given study and series. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveSeries, see [DICOM study/series/instances](https://cloud.google.com/healthcare/docs/dicom#dicom_studyseriesinstances) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveSeries, see [Retrieve DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveSeries(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveSeries(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveSeries(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * SearchForInstances returns a list of matching instances. See [Search Transaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6). For details on the implementation of SearchForInstances, see [Search transaction](https://cloud.google.com/healthcare/docs/dicom#search_transaction) in the Cloud Healthcare API conformance statement. For samples that show how to call SearchForInstances, see [Search for DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#search-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForInstances(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchForInstances(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Delete extends StandardParameters {
        /**
         * Required. The path of the DeleteSeries request. For example, `studies/{study_uid\}/series/{series_uid\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrievemetadata extends StandardParameters {
        /**
         * Required. The path of the RetrieveSeriesMetadata DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/metadata`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Retrieveseries extends StandardParameters {
        /**
         * Required. The path of the RetrieveSeries DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Searchforinstances extends StandardParameters {
        /**
         * Required. The path of the SearchForInstancesRequest DICOMweb request. For example, `instances`, `series/{series_uid\}/instances`, or `studies/{study_uid\}/instances`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances {
        context: APIRequestContext;
        frames: Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames;
        constructor(context: APIRequestContext);
        /**
         * DeleteInstance deletes an instance associated with the given study, series, and SOP Instance UID. Delete requests are equivalent to the GET requests specified in the Retrieve transaction. Study and series search results can take a few seconds to be updated after an instance is deleted using DeleteInstance. For samples that show how to call DeleteInstance, see [Delete a study, series, or instance](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#delete-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * RetrieveInstance returns instance associated with the given study, series, and SOP Instance UID. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveInstance, see [DICOM study/series/instances](https://cloud.google.com/healthcare/docs/dicom#dicom_studyseriesinstances) and [DICOM instances](https://cloud.google.com/healthcare/docs/dicom#dicom_instances) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveInstance, see [Retrieve an instance](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-instance).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveInstance(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveInstance(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveInstance(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveInstance(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveInstance(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveInstance(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * RetrieveInstanceMetadata returns instance associated with the given study, series, and SOP Instance UID presented as metadata with the bulk data removed. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveInstanceMetadata, see [Metadata resources](https://cloud.google.com/healthcare/docs/dicom#metadata_resources) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveInstanceMetadata, see [Retrieve metadata](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-metadata).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveMetadata(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveMetadata(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * RetrieveRenderedInstance returns instance associated with the given study, series, and SOP Instance UID in an acceptable Rendered Media Type. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveRenderedInstance, see [Rendered resources](https://cloud.google.com/healthcare/docs/dicom#rendered_resources) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveRenderedInstance, see [Retrieve consumer image formats](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-consumer).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveRendered(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveRendered(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Delete extends StandardParameters {
        /**
         * Required. The path of the DeleteInstance request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieveinstance extends StandardParameters {
        /**
         * Required. The path of the RetrieveInstance DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrievemetadata extends StandardParameters {
        /**
         * Required. The path of the RetrieveInstanceMetadata DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}/metadata`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Retrieverendered extends StandardParameters {
        /**
         * Required. The path of the RetrieveRenderedInstance DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}/rendered`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
        /**
         * Optional. The viewport setting to use as specified in https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_8.3.5.html#sect_8.3.5.1.3
         */
        viewport?: string;
    }
    export class Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * RetrieveFrames returns instances associated with the given study, series, SOP Instance UID and frame numbers. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4\}. For details on the implementation of RetrieveFrames, see [DICOM frames](https://cloud.google.com/healthcare/docs/dicom#dicom_frames) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveFrames, see [Retrieve DICOM data](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-dicom).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveFrames(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveFrames(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveFrames(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveFrames(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveFrames(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveFrames(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * RetrieveRenderedFrames returns instances associated with the given study, series, SOP Instance UID and frame numbers in an acceptable Rendered Media Type. See [RetrieveTransaction] (http://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.4). For details on the implementation of RetrieveRenderedFrames, see [Rendered resources](https://cloud.google.com/healthcare/docs/dicom#rendered_resources) in the Cloud Healthcare API conformance statement. For samples that show how to call RetrieveRenderedFrames, see [Retrieve consumer image formats](https://cloud.google.com/healthcare/docs/how-tos/dicomweb#retrieve-consumer).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveRendered(params?: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveRendered(params: Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered, callback: BodyResponseCallback<Schema$HttpBody>): void;
        retrieveRendered(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieveframes extends StandardParameters {
        /**
         * Required. The path of the RetrieveFrames DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}/frames/{frame_list\}`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Dicomstores$Studies$Series$Instances$Frames$Retrieverendered extends StandardParameters {
        /**
         * Required. The path of the RetrieveRenderedFrames DICOMweb request. For example, `studies/{study_uid\}/series/{series_uid\}/instances/{instance_uid\}/frames/{frame_list\}/rendered`.
         */
        dicomWebPath?: string;
        /**
         * Required. The name of the DICOM store that is being accessed. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/dicomStores/{dicom_store_id\}`.
         */
        parent?: string;
        /**
         * Optional. The viewport setting to use as specified in https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_8.3.5.html#sect_8.3.5.1.3
         */
        viewport?: string;
    }
    export class Resource$Projects$Locations$Datasets$Fhirstores {
        context: APIRequestContext;
        fhir: Resource$Projects$Locations$Datasets$Fhirstores$Fhir;
        operations: Resource$Projects$Locations$Datasets$Fhirstores$Operations;
        constructor(context: APIRequestContext);
        /**
         * Applies the admin Consent resources for the FHIR store and reindexes the underlying resources in the FHIR store according to the aggregate consents. This method also updates the `consent_config.enforced_admin_consents` field of the FhirStore unless `validate_only=true` in ApplyAdminConsentsRequest. Any admin Consent resource change after this operation execution (including deletion) requires you to call ApplyAdminConsents again for the change to take effect. This method returns an Operation that can be used to track the progress of the resources that were reindexed, by calling GetOperation. Upon completion, the ApplyAdminConsentsResponse additionally contains the number of resources that were reindexed. If at least one Consent resource contains an error or fails be be enforced for any reason, the method returns an error instead of an Operation. No resources will be reindexed and the `consent_config.enforced_admin_consents` field will be unchanged. To enforce a consent check for data access, `consent_config.access_enforced` must be set to true for the FhirStore.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        applyAdminConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        applyAdminConsents(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        applyAdminConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        applyAdminConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        applyAdminConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents, callback: BodyResponseCallback<Schema$Operation>): void;
        applyAdminConsents(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Apply the Consent resources for the FHIR store and reindex the underlying resources in the FHIR store according to the aggregate consent. The aggregate consent of the patient in scope in this request replaces any previous call of this method. Any Consent resource change after this operation execution (including deletion) requires you to call ApplyConsents again to have effect. This method returns an Operation that can be used to track the progress of the consent resources that were processed by calling GetOperation. Upon completion, the ApplyConsentsResponse additionally contains the number of resources that was reindexed. Errors are logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). To enforce consent check for data access, `consent_config.access_enforced` must be set to true for the FhirStore.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        applyConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        applyConsents(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        applyConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        applyConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        applyConsents(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents, callback: BodyResponseCallback<Schema$Operation>): void;
        applyConsents(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Bulk exports a Group resource and resources in the member field, including related resources for each Patient member. The export for each Patient is identical to a GetPatientEverything request. Implements the FHIR implementation guide [$export group of patients](https://build.fhir.org/ig/HL7/bulk-data/export.html#endpoint---group-of-patients). The following headers must be set in the request: * `Accept`: specifies the format of the `OperationOutcome` response. Only `application/fhir+json` is supported. * `Prefer`: specifies whether the response is immediate or asynchronous. Must be to `respond-async` because only asynchronous responses are supported. Specify the destination for the server to write result files by setting the Cloud Storage location bulk_export_gcs_destination on the FHIR store. URI of an existing Cloud Storage directory where the server writes result files, in the format gs://{bucket-id\}/{path/to/destination/dir\}. If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket referenced. Supports the following query parameters: * `_type`: string of comma-delimited FHIR resource types. If provided, only resources of the specified type(s) are exported. * `_since`: if provided, only resources updated after the specified time are exported. * `_outputFormat`: optional, specify ndjson to export data in NDJSON format. Exported file names use the format: {export_id\}_{resource_type\}.ndjson. * `organizeOutputBy`: resource type to organize the output by. Required and must be set to `Patient`. When specified, output files are organized by instances of the specified resource type, including the resource, referenced resources, and resources that contain references to that resource. On success, the `Content-Location` header of response is set to a URL that you can use to query the status of the export. The URL is in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/operations/{export_id\}`. See get-fhir-operation-status for more information. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkExportGroup(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkExportGroup(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        bulkExportGroup(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkExportGroup(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        bulkExportGroup(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup, callback: BodyResponseCallback<Schema$HttpBody>): void;
        bulkExportGroup(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Creates a new FHIR store within the parent dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FhirStore>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Create, options: MethodOptions | BodyResponseCallback<Schema$FhirStore>, callback: BodyResponseCallback<Schema$FhirStore>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Create, callback: BodyResponseCallback<Schema$FhirStore>): void;
        create(callback: BodyResponseCallback<Schema$FhirStore>): void;
        /**
         * De-identifies data from the source store and writes it to the destination store. The metadata field type is OperationMetadata. If the request is successful, the response field type is DeidentifyFhirStoreSummary. If errors occur, error is set. Error details are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deidentify(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify, callback: BodyResponseCallback<Schema$Operation>): void;
        deidentify(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the specified FHIR store and removes all resources within it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Explains all the permitted/denied actor, purpose and environment for a given resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        explainDataAccess(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        explainDataAccess(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ExplainDataAccessResponse>>;
        explainDataAccess(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        explainDataAccess(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess, options: MethodOptions | BodyResponseCallback<Schema$ExplainDataAccessResponse>, callback: BodyResponseCallback<Schema$ExplainDataAccessResponse>): void;
        explainDataAccess(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess, callback: BodyResponseCallback<Schema$ExplainDataAccessResponse>): void;
        explainDataAccess(callback: BodyResponseCallback<Schema$ExplainDataAccessResponse>): void;
        /**
         * Export resources from the FHIR store to the specified destination. This method returns an Operation that can be used to track the status of the export by calling GetOperation. Immediate fatal errors appear in the error field, errors are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). Otherwise, when the operation finishes, a detailed response of type ExportResourcesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the configuration of the specified FHIR store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FhirStore>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Get, options: MethodOptions | BodyResponseCallback<Schema$FhirStore>, callback: BodyResponseCallback<Schema$FhirStore>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Get, callback: BodyResponseCallback<Schema$FhirStore>): void;
        get(callback: BodyResponseCallback<Schema$FhirStore>): void;
        /**
         * Gets metrics associated with the FHIR store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getFHIRStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getFHIRStoreMetrics(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FhirStoreMetrics>>;
        getFHIRStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getFHIRStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics, options: MethodOptions | BodyResponseCallback<Schema$FhirStoreMetrics>, callback: BodyResponseCallback<Schema$FhirStoreMetrics>): void;
        getFHIRStoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics, callback: BodyResponseCallback<Schema$FhirStoreMetrics>): void;
        getFHIRStoreMetrics(callback: BodyResponseCallback<Schema$FhirStoreMetrics>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Imports resources to the FHIR store by loading data from the specified sources. This method is optimized to load large quantities of data using import semantics that ignore some FHIR store configuration options and are not suitable for all use cases. It is primarily intended to load data into an empty FHIR store that is not being used by other clients. In cases where this method is not appropriate, consider using ExecuteBundle to load data. Every resource in the input must contain a client-supplied ID. Each resource is stored using the supplied ID regardless of the enable_update_create setting on the FHIR store. It is strongly advised not to include or encode any sensitive data such as patient identifiers in client-specified resource IDs. Those IDs are part of the FHIR resource path recorded in Cloud Audit Logs and Cloud Pub/Sub notifications. Those IDs can also be contained in reference fields within other resources. The import process does not enforce referential integrity, regardless of the disable_referential_integrity setting on the FHIR store. This allows the import of resources with arbitrary interdependencies without considering grouping or ordering, but if the input data contains invalid references or if some resources fail to be imported, the FHIR store might be left in a state that violates referential integrity. The import process does not trigger Pub/Sub notification or BigQuery streaming update, regardless of how those are configured on the FHIR store. If a resource with the specified ID already exists, the most recent version of the resource is overwritten without creating a new historical version, regardless of the disable_resource_versioning setting on the FHIR store. If transient failures occur during the import, it's possible that successfully imported resources will be overwritten more than once. The import operation is idempotent unless the input data contains multiple valid resources with the same ID but different contents. In that case, after the import completes, the store contains exactly one resource with that ID but there is no ordering guarantee on which version of the contents it will have. The operation result counters do not count duplicate IDs as an error and count one success for each resource in the input, which might result in a success count larger than the number of resources in the FHIR store. This often occurs when importing data organized in bundles produced by Patient-everything where each bundle contains its own copy of a resource such as Practitioner that might be referred to by many patients. If some resources fail to import, for example due to parsing errors, successfully imported resources are not rolled back. The location and format of the input data is specified by the parameters in ImportResourcesRequest. Note that if no format is specified, this method assumes the `BUNDLE` format. When using the `BUNDLE` format this method ignores the `Bundle.type` field, except that `history` bundles are rejected, and does not apply any of the bundle processing semantics for batch or transaction bundles. Unlike in ExecuteBundle, transaction bundles are not executed as a single transaction and bundle-internal references are not rewritten. The bundle is treated as a collection of resources to be written as provided in `Bundle.entry.resource`, ignoring `Bundle.entry.request`. As an example, this allows the import of `searchset` bundles produced by a FHIR search or Patient-everything operation. This method returns an Operation that can be used to track the status of the import by calling GetOperation. Immediate fatal errors appear in the error field, errors are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). Otherwise, when the operation finishes, a detailed response of type ImportResourcesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists the FHIR stores in the given dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFhirStoresResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$List, options: MethodOptions | BodyResponseCallback<Schema$ListFhirStoresResponse>, callback: BodyResponseCallback<Schema$ListFhirStoresResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$List, callback: BodyResponseCallback<Schema$ListFhirStoresResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFhirStoresResponse>): void;
        /**
         * Updates the configuration of the specified FHIR store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FhirStore>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch, options: MethodOptions | BodyResponseCallback<Schema$FhirStore>, callback: BodyResponseCallback<Schema$FhirStore>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch, callback: BodyResponseCallback<Schema$FhirStore>): void;
        patch(callback: BodyResponseCallback<Schema$FhirStore>): void;
        /**
         * Rolls back resources from the FHIR store to the specified time. This method returns an Operation that can be used to track the status of the rollback by calling GetOperation. Immediate fatal errors appear in the error field, errors are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). Otherwise, when the operation finishes, a detailed response of type RollbackFhirResourcesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rollback(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rollback(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyadminconsents extends StandardParameters {
        /**
         * Required. The name of the FHIR store to enforce, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ApplyAdminConsentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Applyconsents extends StandardParameters {
        /**
         * Required. The name of the FHIR store to enforce, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ApplyConsentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Bulkexportgroup extends StandardParameters {
        /**
         * Required. Name of the Group resource that is exported, in format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Group/{group_id\}`.
         */
        name?: string;
        /**
         * Optional. Required. The FHIR resource type used to organize exported resources. Only supports "Patient". When organized by Patient resource, output files are grouped as follows: * Patient file(s) containing the Patient resources. Each Patient is sequentially followed by all resources the Patient references, and all resources that reference the Patient (equivalent to a GetPatientEverything request). * Individual files grouped by resource type for resources in the Group's member field and the Group resource itself. Resources may be duplicated across multiple Patients. For example, if two Patient resources reference the same Organization resource, it will appear twice, once after each Patient. The Group resource from the request does not appear in the Patient files.
         */
        organizeOutputBy?: string;
        /**
         * Optional. Output format of the export. This field is optional and only `application/fhir+ndjson` is supported.
         */
        outputFormat?: string;
        /**
         * Optional. If provided, only resources updated after this time are exported. The time uses the format YYYY-MM-DDThh:mm:ss.sss+zz:zz. For example, `2015-02-07T13:28:17.239+02:00` or `2017-01-01T00:00:00Z`. The time must be specified to the second and include a time zone.
         */
        _since?: string;
        /**
         * Optional. String of comma-delimited FHIR resource types. If provided, only resources of the specified resource type(s) are exported.
         */
        _type?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Create extends StandardParameters {
        /**
         * Required. The ID of the FHIR store that is being created. The string must match the following regex: `[\p{L\}\p{N\}_\-\.]{1,256\}`.
         */
        fhirStoreId?: string;
        /**
         * Required. The name of the dataset this FHIR store belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FhirStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Deidentify extends StandardParameters {
        /**
         * Required. Source FHIR store resource name. For example, `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        sourceStore?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeidentifyFhirStoreRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Delete extends StandardParameters {
        /**
         * Required. The resource name of the FHIR store to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Explaindataaccess extends StandardParameters {
        /**
         * Required. The name of the FHIR store to enforce, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Required. The ID (`{resourceType\}/{id\}`) of the resource to explain data access on.
         */
        resourceId?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Export extends StandardParameters {
        /**
         * Required. The name of the FHIR store to export resource from, in the format of `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportResourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Get extends StandardParameters {
        /**
         * Required. The resource name of the FHIR store to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Getfhirstoremetrics extends StandardParameters {
        /**
         * Required. The resource name of the FHIR store to get metrics for.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Import extends StandardParameters {
        /**
         * Required. The name of the FHIR store to import FHIR resources to, in the format of `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportResourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$List extends StandardParameters {
        /**
         * Restricts stores returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. Only filtering on labels is supported, for example `labels.key=value`.
         */
        filter?: string;
        /**
         * Limit on the number of FHIR stores to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the dataset.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Patch extends StandardParameters {
        /**
         * Output only. Identifier. Resource name of the FHIR store, of the form `projects/{project_id\}/locations/{location\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FhirStore;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Rollback extends StandardParameters {
        /**
         * Required. The name of the FHIR store to rollback, in the format of "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\} /fhirStores/{fhir_store_id\}".
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RollbackFhirResourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Fhirstores$Fhir {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a FHIR Binary resource. This method can be used to create a Binary resource either by using one of the accepted FHIR JSON content types, or as a raw data stream. If a resource is created with this method using the FHIR content type this method's behavior is the same as [`fhir.create`](https://cloud.google.com/healthcare-api/docs/reference/rest/v1/projects.locations.datasets.fhirStores.fhir/create). If a resource type other than Binary is used in the request it's treated in the same way as non-FHIR data (e.g., images, zip archives, pdf files, documents). When a non-FHIR content type is used in the request, a Binary resource will be generated, and the uploaded data will be stored in the `content` field (`DSTU2` and `STU3`), or the `data` field (`R4`). The Binary resource's `contentType` will be filled in using the value of the `Content-Type` header, and the `securityContext` field (not present in `DSTU2`) will be populated from the `X-Security-Context` header if it exists. At this time `securityContext` has no special behavior in the Cloud Healthcare API. Note: the limit on data ingested through this method is 1 GB. For best performance, use a non-FHIR data type instead of wrapping the data in a Binary resource. Some of the Healthcare API features, such as [exporting to BigQuery](https://cloud.google.com/healthcare-api/docs/how-tos/fhir-export-bigquery) or [Pub/Sub notifications](https://cloud.google.com/healthcare-api/docs/fhir-pubsub#behavior_when_a_fhir_resource_is_too_large_or_traffic_is_high) with full resource content, do not support Binary resources that are larger than 10 MB. In these cases the resource's `data` field will be omitted. Instead, the "http://hl7.org/fhir/StructureDefinition/data-absent-reason" extension will be present to indicate that including the data is `unsupported`. On success, an empty `201 Created` response is returned. The newly created resource's ID and version are returned in the Location header. Using `Prefer: representation=resource` is not allowed for this method. The definition of the Binary REST API can be found at https://hl7.org/fhir/binary.html#rest.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        BinaryCreate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        BinaryCreate(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        BinaryCreate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        BinaryCreate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryCreate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryCreate(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the contents of a FHIR Binary resource. This method can be used to retrieve a Binary resource either by using the FHIR JSON mimetype as the value for the Accept header, or as a raw data stream. If the FHIR Accept type is used this method will return a Binary resource with the data base64-encoded, regardless of how the resource was created. The resource data can be retrieved in base64-decoded form if the Accept type of the request matches the value of the resource's `contentType` field. The definition of the Binary REST API can be found at https://hl7.org/fhir/binary.html#rest.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        BinaryRead(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        BinaryRead(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        BinaryRead(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        BinaryRead(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryRead(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryRead(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Updates the entire contents of a Binary resource. If the specified resource does not exist and the FHIR store has enable_update_create set, creates the resource with the client-specified ID. It is strongly advised not to include or encode any sensitive data such as patient identifiers in client-specified resource IDs. Those IDs are part of the FHIR resource path recorded in Cloud Audit Logs and Pub/Sub notifications. Those IDs can also be contained in reference fields within other resources. This method can be used to update a Binary resource either by using one of the accepted FHIR JSON content types, or as a raw data stream. If a resource is updated with this method using the FHIR content type this method's behavior is the same as `update`. If a resource type other than Binary is used in the request it will be treated in the same way as non-FHIR data. When a non-FHIR content type is used in the request, a Binary resource will be generated using the ID from the resource path, and the uploaded data will be stored in the `content` field (`DSTU2` and `STU3`), or the `data` field (`R4`). The Binary resource's `contentType` will be filled in using the value of the `Content-Type` header, and the `securityContext` field (not present in `DSTU2`) will be populated from the `X-Security-Context` header if it exists. At this time `securityContext` has no special behavior in the Cloud Healthcare API. Note: the limit on data ingested through this method is 2 GB. For best performance, use a non-FHIR data type instead of wrapping the data in a Binary resource. Some of the Healthcare API features, such as [exporting to BigQuery](https://cloud.google.com/healthcare-api/docs/how-tos/fhir-export-bigquery) or [Pub/Sub notifications](https://cloud.google.com/healthcare-api/docs/fhir-pubsub#behavior_when_a_fhir_resource_is_too_large_or_traffic_is_high) with full resource content, do not support Binary resources that are larger than 10 MB. In these cases the resource's `data` field will be omitted. Instead, the "http://hl7.org/fhir/StructureDefinition/data-absent-reason" extension will be present to indicate that including the data is `unsupported`. On success, an empty 200 OK response will be returned, or a 201 Created if the resource did not exit. The resource's ID and version are returned in the Location header. Using `Prefer: representation=resource` is not allowed for this method. The definition of the Binary REST API can be found at https://hl7.org/fhir/binary.html#rest.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        BinaryUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        BinaryUpdate(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        BinaryUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        BinaryUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryUpdate(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the contents of a version (current or historical) of a FHIR Binary resource by version ID. This method can be used to retrieve a Binary resource version either by using the FHIR JSON mimetype as the value for the Accept header, or as a raw data stream. If the FHIR Accept type is used this method will return a Binary resource with the data base64-encoded, regardless of how the resource version was created. The resource data can be retrieved in base64-decoded form if the Accept type of the request matches the value of the resource version's `contentType` field. The definition of the Binary REST API can be found at https://hl7.org/fhir/binary.html#rest.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        BinaryVread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        BinaryVread(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        BinaryVread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        BinaryVread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryVread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread, callback: BodyResponseCallback<Schema$HttpBody>): void;
        BinaryVread(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Bulk exports all resources from the FHIR store to the specified destination. Implements the FHIR implementation guide [system level $export](https://build.fhir.org/ig/HL7/bulk-data/export.html#endpoint---system-level-export. The following headers must be set in the request: * `Accept`: specifies the format of the `OperationOutcome` response. Only `application/fhir+json` is supported. * `Prefer`: specifies whether the response is immediate or asynchronous. Must be to `respond-async` because only asynchronous responses are supported. Specify the destination for the server to write result files by setting the Cloud Storage location bulk_export_gcs_destination on the FHIR store. URI of an existing Cloud Storage directory where the server writes result files, in the format gs://{bucket-id\}/{path/to/destination/dir\}. If there is no trailing slash, the service appends one when composing the object path. The user is responsible for creating the Cloud Storage bucket referenced. Supports the following query parameters: * `_type`: string of comma-delimited FHIR resource types. If provided, only the resources of the specified type(s) are exported. * `_since`: if provided, only the resources that are updated after the specified time are exported. * `_outputFormat`: optional, specify ndjson to export data in NDJSON format. Exported file names use the format: {export_id\}_{resource_type\}.ndjson. On success, the `Content-Location` header of the response is set to a URL that the user can use to query the status of the export. The URL is in the format: `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/operations/{export_id\}`. See get-fhir-operation-status for more information. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkExport(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkExport(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        bulkExport(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkExport(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        bulkExport(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport, callback: BodyResponseCallback<Schema$HttpBody>): void;
        bulkExport(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the FHIR capability statement ([STU3](http://hl7.org/implement/standards/fhir/STU3/capabilitystatement.html), [R4](http://hl7.org/implement/standards/fhir/R4/capabilitystatement.html)), or the [conformance statement](http://hl7.org/implement/standards/fhir/DSTU2/conformance.html) in the DSTU2 case for the store, which contains a description of functionality supported by the server. Implements the FHIR standard capabilities interaction ([STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#capabilities), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#capabilities)), or the [conformance interaction](http://hl7.org/implement/standards/fhir/DSTU2/http.html#conformance) in the DSTU2 case. On success, the response body contains a JSON-encoded representation of a `CapabilityStatement` resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        capabilities(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        capabilities(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        capabilities(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        capabilities(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        capabilities(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities, callback: BodyResponseCallback<Schema$HttpBody>): void;
        capabilities(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Deletes a FHIR resource that match an identifier search query. Implements the FHIR standard conditional delete interaction, limited to searching by resource identifier. If multiple resources match, 412 Precondition Failed error will be returned. Search term for identifier should be in the pattern `identifier=system|value` or `identifier=value` - similar to the `search` method on resources with a specific identifier. Note: Unless resource versioning is disabled by setting the disable_resource_versioning flag on the FHIR store, the deleted resource is moved to a history repository that can still be retrieved through vread and related methods, unless they are removed by the purge method. For samples that show how to call `conditionalDelete`, see [Conditionally deleting a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#conditionally_deleting_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        conditionalDelete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        conditionalDelete(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        conditionalDelete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        conditionalDelete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        conditionalDelete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete, callback: BodyResponseCallback<Schema$Empty>): void;
        conditionalDelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * If a resource is found with the identifier specified in the query parameters, updates part of that resource by applying the operations specified in a [JSON Patch](http://jsonpatch.com/) document. Implements the FHIR standard conditional patch interaction, limited to searching by resource identifier. DSTU2 doesn't define a conditional patch method, but the server supports it in the same way it supports STU3. Search term for identifier should be in the pattern `identifier=system|value` or `identifier=value` - similar to the `search` method on resources with a specific identifier. If the search criteria identify more than one match, the request returns a `412 Precondition Failed` error. The request body must contain a JSON Patch document, and the request headers must contain `Content-Type: application/json-patch+json`. On success, the response body contains a JSON-encoded representation of the updated resource, including the server-assigned version ID. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `conditionalPatch`, see [Conditionally patching a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#conditionally_patching_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        conditionalPatch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        conditionalPatch(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        conditionalPatch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        conditionalPatch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        conditionalPatch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch, callback: BodyResponseCallback<Schema$HttpBody>): void;
        conditionalPatch(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * If a resource is found with the identifier specified in the query parameters, updates the entire contents of that resource. Implements the FHIR standard conditional update interaction, limited to searching by resource identifier. Search term for identifier should be in the pattern `identifier=system|value` or `identifier=value` - similar to the `search` method on resources with a specific identifier. If the search criteria identify more than one match, the request returns a `412 Precondition Failed` error. If the search criteria identify zero matches, and the supplied resource body contains an `id`, and the FHIR store has enable_update_create set, creates the resource with the client-specified ID. It is strongly advised not to include or encode any sensitive data such as patient identifiers in client-specified resource IDs. Those IDs are part of the FHIR resource path recorded in Cloud Audit Logs and Pub/Sub notifications. Those IDs can also be contained in reference fields within other resources. If the search criteria identify zero matches, and the supplied resource body does not contain an `id`, the resource is created with a server-assigned ID as per the create method. The request body must contain a JSON-encoded FHIR resource, and the request headers must contain `Content-Type: application/fhir+json`. On success, the response body contains a JSON-encoded representation of the updated resource, including the server-assigned version ID. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `conditionalUpdate`, see [Conditionally updating a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#conditionally_updating_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        conditionalUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        conditionalUpdate(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        conditionalUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        conditionalUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        conditionalUpdate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate, callback: BodyResponseCallback<Schema$HttpBody>): void;
        conditionalUpdate(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Returns the consent enforcement status of a single consent resource. On success, the response body contains a JSON-encoded representation of a `Parameters` (http://hl7.org/fhir/parameters.html) FHIR resource, containing the current enforcement status. Does not support DSTU2.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        ConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        ConsentEnforcementStatus(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        ConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        ConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        ConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus, callback: BodyResponseCallback<Schema$HttpBody>): void;
        ConsentEnforcementStatus(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Creates a FHIR resource. Implements the FHIR standard create interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#create), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#create), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#create)), which creates a new resource with a server-assigned resource ID. Also supports the FHIR standard conditional create interaction ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/http.html#ccreate), [STU3](https://hl7.org/implement/standards/fhir/STU3/http.html#ccreate), [R4](https://hl7.org/implement/standards/fhir/R4/http.html#ccreate)), specified by supplying an `If-None-Exist` header containing a FHIR search query, limited to searching by resource identifier. If no resources match this search query, the server processes the create operation as normal. When using conditional create, the search term for identifier should be in the pattern `identifier=system|value` or `identifier=value` - similar to the `search` method on resources with a specific identifier. The request body must contain a JSON-encoded FHIR resource, and the request headers must contain `Content-Type: application/fhir+json`. On success, the response body contains a JSON-encoded representation of the resource as it was created on the server, including the server-assigned resource ID and version ID. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `create`, see [Creating a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#creating_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create, callback: BodyResponseCallback<Schema$HttpBody>): void;
        create(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Deletes a FHIR resource. Implements the FHIR standard delete interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#delete), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#delete), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#delete)). Note: Unless resource versioning is disabled by setting the disable_resource_versioning flag on the FHIR store, the deleted resources will be moved to a history repository that can still be retrieved through vread and related methods, unless they are removed by the purge method. For samples that show how to call `delete`, see [Deleting a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#deleting_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete, callback: BodyResponseCallback<Schema$HttpBody>): void;
        delete(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Executes all the requests in the given Bundle. Implements the FHIR standard batch/transaction interaction ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/http.html#transaction), [STU3](https://hl7.org/implement/standards/fhir/STU3/http.html#transaction), [R4](https://hl7.org/implement/standards/fhir/R4/http.html#transaction)). Supports all interactions within a bundle, except search. This method accepts Bundles of type `batch` and `transaction`, processing them according to the batch processing rules ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/http.html#2.1.0.16.1), [STU3](https://hl7.org/implement/standards/fhir/STU3/http.html#2.21.0.17.1), [R4](https://hl7.org/implement/standards/fhir/R4/http.html#brules)) and transaction processing rules ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/http.html#2.1.0.16.2), [STU3](https://hl7.org/implement/standards/fhir/STU3/http.html#2.21.0.17.2), [R4](https://hl7.org/implement/standards/fhir/R4/http.html#trules)). The request body must contain a JSON-encoded FHIR `Bundle` resource, and the request headers must contain `Content-Type: application/fhir+json`. For a batch bundle or a successful transaction, the response body contains a JSON-encoded representation of a `Bundle` resource of type `batch-response` or `transaction-response` containing one entry for each entry in the request, with the outcome of processing the entry. In the case of an error for a transaction bundle, the response body contains a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. This method checks permissions for each request in the bundle. The `executeBundle` permission is required to call this method, but you must also grant sufficient permissions to execute the individual requests in the bundle. For example, if the bundle contains a request to create a FHIR resource, the caller must also have been granted the `healthcare.fhirResources.create` permission. You can use audit logs to view the permissions for `executeBundle` and each request in the bundle. For more information, see [Viewing Cloud Audit logs](https://cloud.google.com/healthcare-api/docs/how-tos/audit-logging). For samples that show how to call `executeBundle`, see [Managing FHIR resources using FHIR bundles](https://cloud.google.com/healthcare/docs/how-tos/fhir-bundles).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        executeBundle(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        executeBundle(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        executeBundle(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        executeBundle(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        executeBundle(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle, callback: BodyResponseCallback<Schema$HttpBody>): void;
        executeBundle(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Lists all the versions of a resource (including the current version and deleted versions) from the FHIR store. Implements the per-resource form of the FHIR standard history interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#history), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#history), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#history)). On success, the response body contains a JSON-encoded representation of a `Bundle` resource of type `history`, containing the version history sorted from most recent to oldest versions. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `history`, see [Listing FHIR resource versions](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#listing_fhir_resource_versions).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        history(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        history(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        history(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        history(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        history(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History, callback: BodyResponseCallback<Schema$HttpBody>): void;
        history(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Updates part of an existing resource by applying the operations specified in a [JSON Patch](http://jsonpatch.com/) document. Implements the FHIR standard patch interaction ([STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#patch), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#patch)). DSTU2 doesn't define a patch method, but the server supports it in the same way it supports STU3. The request body must contain a JSON Patch document, and the request headers must contain `Content-Type: application/json-patch+json`. On success, the response body contains a JSON-encoded representation of the updated resource, including the server-assigned version ID. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `patch`, see [Patching a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#patching_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch, callback: BodyResponseCallback<Schema$HttpBody>): void;
        patch(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Returns the consent enforcement status of all consent resources for a patient. On success, the response body contains a JSON-encoded representation of a bundle of `Parameters` (http://hl7.org/fhir/parameters.html) FHIR resources, containing the current enforcement status for each consent resource of the patient. Does not support DSTU2.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        PatientConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        PatientConsentEnforcementStatus(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        PatientConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        PatientConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        PatientConsentEnforcementStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus, callback: BodyResponseCallback<Schema$HttpBody>): void;
        PatientConsentEnforcementStatus(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Retrieves a Patient resource and resources related to that patient. Implements the FHIR extended operation Patient-everything ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/patient-operations.html#everything), [STU3](http://hl7.org/implement/standards/fhir/STU3/patient-operations.html#everything), [R4](http://hl7.org/implement/standards/fhir/R4/patient-operations.html#everything)). On success, the response body contains a JSON-encoded representation of a `Bundle` resource of type `searchset`, containing the results of the operation. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. The resources in scope for the response are: * The patient resource itself. * All the resources directly referenced by the patient resource. * Resources directly referencing the patient resource that meet the inclusion criteria. The inclusion criteria are based on the membership rules in the patient compartment definition ([DSTU2](http://hl7.org/fhir/DSTU2/compartment-patient.html), [STU3](http://www.hl7.org/fhir/stu3/compartmentdefinition-patient.html), [R4](http://hl7.org/fhir/R4/compartmentdefinition-patient.html)), which details the eligible resource types and referencing search parameters. For samples that show how to call `Patient-everything`, see [Getting all patient compartment resources](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#getting_all_patient_compartment_resources).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        PatientEverything(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        PatientEverything(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        PatientEverything(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        PatientEverything(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        PatientEverything(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything, callback: BodyResponseCallback<Schema$HttpBody>): void;
        PatientEverything(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the contents of a FHIR resource. Implements the FHIR standard read interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#read), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#read), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#read)). Also supports the FHIR standard conditional read interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#cread), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#cread), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#cread)) specified by supplying an `If-Modified-Since` header with a date/time value or an `If-None-Match` header with an ETag value. On success, the response body contains a JSON-encoded representation of the resource. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `read`, see [Getting a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#getting_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        read(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        read(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        read(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        read(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        read(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read, callback: BodyResponseCallback<Schema$HttpBody>): void;
        read(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Deletes all the historical versions of a resource (excluding the current version) from the FHIR store. To remove all versions of a resource, first delete the current version and then call this method. This is not a FHIR standard operation. For samples that show how to call `Resource-purge`, see [Deleting historical versions of a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#deleting_historical_versions_of_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        ResourcePurge(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        ResourcePurge(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        ResourcePurge(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        ResourcePurge(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        ResourcePurge(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge, callback: BodyResponseCallback<Schema$Empty>): void;
        ResourcePurge(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Validates an input FHIR resource's conformance to its profiles and the profiles configured on the FHIR store. Implements the FHIR extended operation $validate ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/resource-operations.html#validate), [STU3](http://hl7.org/implement/standards/fhir/STU3/resource-operations.html#validate), or [R4](http://hl7.org/implement/standards/fhir/R4/resource-operation-validate.html)). The request body must contain a JSON-encoded FHIR resource, and the request headers must contain `Content-Type: application/fhir+json`. The `Parameters` input syntax is not supported. The `profile` query parameter can be used to request that the resource only be validated against a specific profile. If a profile with the given URL cannot be found in the FHIR store then an error is returned. Errors generated by validation contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        ResourceValidate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        ResourceValidate(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        ResourceValidate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        ResourceValidate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        ResourceValidate(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate, callback: BodyResponseCallback<Schema$HttpBody>): void;
        ResourceValidate(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Searches for resources in the given FHIR store according to criteria specified as query parameters. Implements the FHIR standard search interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#search), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#search), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#search)) using the search semantics described in the FHIR Search specification ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/search.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/search.html), [R4](http://hl7.org/implement/standards/fhir/R4/search.html)). Supports four methods of search defined by the specification: * `GET [base]?[parameters]` to search across all resources. * `GET [base]/[type]?[parameters]` to search resources of a specified type. * `POST [base]/_search?[parameters]` as an alternate form having the same semantics as the `GET` method across all resources. * `POST [base]/[type]/_search?[parameters]` as an alternate form having the same semantics as the `GET` method for the specified type. The `GET` and `POST` methods do not support compartment searches. The `POST` method does not support `application/x-www-form-urlencoded` search parameters. On success, the response body contains a JSON-encoded representation of a `Bundle` resource of type `searchset`, containing the results of the search. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. The server's capability statement, retrieved through capabilities, indicates what search parameters are supported on each FHIR resource. A list of all search parameters defined by the specification can be found in the FHIR Search Parameter Registry ([STU3](http://hl7.org/implement/standards/fhir/STU3/searchparameter-registry.html), [R4](http://hl7.org/implement/standards/fhir/R4/searchparameter-registry.html)). FHIR search parameters for DSTU2 can be found on each resource's definition page. Supported search modifiers: `:missing`, `:exact`, `:contains`, `:text`, `:in`, `:not-in`, `:above`, `:below`, `:[type]`, `:not`, and `recurse` (DSTU2 and STU3) or `:iterate` (R4). Supported search result parameters: `_sort`, `_count`, `_include`, `_revinclude`, `_summary=text`, `_summary=data`, and `_elements`. The maximum number of search results returned defaults to 100, which can be overridden by the `_count` parameter up to a maximum limit of 1000. The server might return fewer resources than requested to prevent excessively large responses. If there are additional results, the returned `Bundle` contains a link of `relation` "next", which has a `_page_token` parameter for an opaque pagination token that can be used to retrieve the next page. Resources with a total size larger than 5MB or a field count larger than 50,000 might not be fully searchable as the server might trim its generated search index in those cases. Note: FHIR resources are indexed asynchronously, so there might be a slight delay between the time a resource is created or changed, and the time when the change reflects in search results. The only exception is resource identifier data, which is indexed synchronously as a special index. As a result, searching using resource identifier is not subject to indexing delay. To use the special synchronous index, the search term for identifier should be in the pattern `identifier=[system]|[value]` or `identifier=[value]`, and any of the following search result parameters can be used: * `_count` * `_include` * `_revinclude` * `_summary` * `_elements` If your query contains any other search parameters, the standard asynchronous index will be used instead. Note that searching against the special index is optimized for resolving a small number of matches. The search isn't optimized if your identifier search criteria matches a large number (i.e. more than 2,000) of resources. For a search query that will match a large number of resources, you can avoiding using the special synchronous index by including an additional `_sort` parameter in your query. Use `_sort=-_lastUpdated` if you want to keep the default sorting order. Note: The special synchronous identifier index are currently disabled for DocumentReference and DocumentManifest searches. For samples and detailed information, see [Searching for FHIR resources](https://cloud.google.com/healthcare/docs/how-tos/fhir-search) and [Advanced FHIR search features](https://cloud.google.com/healthcare/docs/how-tos/fhir-advanced-search).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        search(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        search(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search, callback: BodyResponseCallback<Schema$HttpBody>): void;
        search(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Searches for resources in the given FHIR store according to criteria specified as query parameters. Implements the FHIR standard search interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#search), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#search), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#search)) using the search semantics described in the FHIR Search specification ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/search.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/search.html), [R4](http://hl7.org/implement/standards/fhir/R4/search.html)). Supports four methods of search defined by the specification: * `GET [base]?[parameters]` to search across all resources. * `GET [base]/[type]?[parameters]` to search resources of a specified type. * `POST [base]/_search?[parameters]` as an alternate form having the same semantics as the `GET` method across all resources. * `POST [base]/[type]/_search?[parameters]` as an alternate form having the same semantics as the `GET` method for the specified type. The `GET` and `POST` methods do not support compartment searches. The `POST` method does not support `application/x-www-form-urlencoded` search parameters. On success, the response body contains a JSON-encoded representation of a `Bundle` resource of type `searchset`, containing the results of the search. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. The server's capability statement, retrieved through capabilities, indicates what search parameters are supported on each FHIR resource. A list of all search parameters defined by the specification can be found in the FHIR Search Parameter Registry ([STU3](http://hl7.org/implement/standards/fhir/STU3/searchparameter-registry.html), [R4](http://hl7.org/implement/standards/fhir/R4/searchparameter-registry.html)). FHIR search parameters for DSTU2 can be found on each resource's definition page. Supported search modifiers: `:missing`, `:exact`, `:contains`, `:text`, `:in`, `:not-in`, `:above`, `:below`, `:[type]`, `:not`, and `recurse` (DSTU2 and STU3) or `:iterate` (R4). Supported search result parameters: `_sort`, `_count`, `_include`, `_revinclude`, `_summary=text`, `_summary=data`, and `_elements`. The maximum number of search results returned defaults to 100, which can be overridden by the `_count` parameter up to a maximum limit of 1000. The server might return fewer resources than requested to prevent excessively large responses. If there are additional results, the returned `Bundle` contains a link of `relation` "next", which has a `_page_token` parameter for an opaque pagination token that can be used to retrieve the next page. Resources with a total size larger than 5MB or a field count larger than 50,000 might not be fully searchable as the server might trim its generated search index in those cases. Note: FHIR resources are indexed asynchronously, so there might be a slight delay between the time a resource is created or changed, and the time when the change reflects in search results. The only exception is resource identifier data, which is indexed synchronously as a special index. As a result, searching using resource identifier is not subject to indexing delay. To use the special synchronous index, the search term for identifier should be in the pattern `identifier=[system]|[value]` or `identifier=[value]`, and any of the following search result parameters can be used: * `_count` * `_include` * `_revinclude` * `_summary` * `_elements` If your query contains any other search parameters, the standard asynchronous index will be used instead. Note that searching against the special index is optimized for resolving a small number of matches. The search isn't optimized if your identifier search criteria matches a large number (i.e. more than 2,000) of resources. For a search query that will match a large number of resources, you can avoiding using the special synchronous index by including an additional `_sort` parameter in your query. Use `_sort=-_lastUpdated` if you want to keep the default sorting order. Note: The special synchronous identifier index are currently disabled for DocumentReference and DocumentManifest searches. For samples and detailed information, see [Searching for FHIR resources](https://cloud.google.com/healthcare/docs/how-tos/fhir-search) and [Advanced FHIR search features](https://cloud.google.com/healthcare/docs/how-tos/fhir-advanced-search).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchType(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchType(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        searchType(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchType(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchType(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype, callback: BodyResponseCallback<Schema$HttpBody>): void;
        searchType(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Updates the entire contents of a resource. Implements the FHIR standard update interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#update), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#update), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#update)). If the specified resource does not exist and the FHIR store has enable_update_create set, creates the resource with the client-specified ID. It is strongly advised not to include or encode any sensitive data such as patient identifiers in client-specified resource IDs. Those IDs are part of the FHIR resource path recorded in Cloud Audit Logs and Pub/Sub notifications. Those IDs can also be contained in reference fields within other resources. The request body must contain a JSON-encoded FHIR resource, and the request headers must contain `Content-Type: application/fhir+json`. The resource must contain an `id` element having an identical value to the ID in the REST path of the request. On success, the response body contains a JSON-encoded representation of the updated resource, including the server-assigned version ID. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `update`, see [Updating a FHIR resource](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#updating_a_fhir_resource).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        update(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        update(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update, callback: BodyResponseCallback<Schema$HttpBody>): void;
        update(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the contents of a version (current or historical) of a FHIR resource by version ID. Implements the FHIR standard vread interaction ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/http.html#vread), [STU3](http://hl7.org/implement/standards/fhir/STU3/http.html#vread), [R4](http://hl7.org/implement/standards/fhir/R4/http.html#vread)). On success, the response body contains a JSON-encoded representation of the resource. Errors generated by the FHIR store contain a JSON-encoded `OperationOutcome` resource describing the reason for the error. If the request cannot be mapped to a valid API method on a FHIR store, a generic GCP error might be returned instead. For samples that show how to call `vread`, see [Retrieving a FHIR resource version](https://cloud.google.com/healthcare/docs/how-tos/fhir-resources#retrieving_a_fhir_resource_version).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        vread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        vread(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        vread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        vread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        vread(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread, callback: BodyResponseCallback<Schema$HttpBody>): void;
        vread(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binarycreate extends StandardParameters {
        /**
         * Required. The name of the FHIR store this resource belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryread extends StandardParameters {
        /**
         * Required. The name of the Binary resource to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryupdate extends StandardParameters {
        /**
         * Required. The name of the resource to update.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Binaryvread extends StandardParameters {
        /**
         * Required. The name of the Binary resource version to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Bulkexport extends StandardParameters {
        /**
         * Required. The name of the FHIR store to export resources from, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}`.
         */
        name?: string;
        /**
         * Optional. Output format of the export. This field is optional and only `application/fhir+ndjson` is supported.
         */
        outputFormat?: string;
        /**
         * Optional. If provided, only resources updated after this time are exported. The time uses the format YYYY-MM-DDThh:mm:ss.sss+zz:zz. For example, `2015-02-07T13:28:17.239+02:00` or `2017-01-01T00:00:00Z`. The time must be specified to the second and include a time zone.
         */
        _since?: string;
        /**
         * Optional. String of comma-delimited FHIR resource types. If provided, only resources of the specified resource type(s) are exported.
         */
        _type?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Capabilities extends StandardParameters {
        /**
         * Required. Name of the FHIR store to retrieve the capabilities for.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionaldelete extends StandardParameters {
        /**
         * Required. The name of the FHIR store this resource belongs to.
         */
        parent?: string;
        /**
         * Required. The FHIR resource type to delete, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](https://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](https://hl7.org/implement/standards/fhir/R4/resourcelist.html)).
         */
        type?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalpatch extends StandardParameters {
        /**
         * Required. The name of the FHIR store this resource belongs to.
         */
        parent?: string;
        /**
         * Required. The FHIR resource type to update, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](https://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](https://hl7.org/implement/standards/fhir/R4/resourcelist.html)).
         */
        type?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Conditionalupdate extends StandardParameters {
        /**
         * Required. The name of the FHIR store this resource belongs to.
         */
        parent?: string;
        /**
         * Required. The FHIR resource type to update, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](https://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](https://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](https://hl7.org/implement/standards/fhir/R4/resourcelist.html)). Must match the resource type in the provided content.
         */
        type?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Consentenforcementstatus extends StandardParameters {
        /**
         * Required. The name of the consent resource to find enforcement status, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Consent/{consent_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Create extends StandardParameters {
        /**
         * Required. The name of the FHIR store this resource belongs to.
         */
        parent?: string;
        /**
         * Required. The FHIR resource type to create, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](http://hl7.org/implement/standards/fhir/R4/resourcelist.html)). Must match the resource type in the provided content.
         */
        type?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Delete extends StandardParameters {
        /**
         * Required. The name of the resource to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Executebundle extends StandardParameters {
        /**
         * Required. Name of the FHIR store in which this bundle will be executed.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$History extends StandardParameters {
        /**
         * Required. The name of the resource to retrieve.
         */
        name?: string;
        /**
         * Only include resource versions that were current at some point during the time period specified in the date time value. The date parameter format is yyyy-mm-ddThh:mm:ss[Z|(+|-)hh:mm] Clients may specify any of the following: * An entire year: `_at=2019` * An entire month: `_at=2019-01` * A specific day: `_at=2019-01-20` * A specific second: `_at=2018-12-31T23:59:58Z`
         */
        _at?: string;
        /**
         * The maximum number of search results on a page. If not specified, 100 is used. May not be larger than 1000.
         */
        _count?: number;
        /**
         * Used to retrieve the first, previous, next, or last page of resource versions when using pagination. Value should be set to the value of `_page_token` set in next or previous page links' URLs. Next and previous page are returned in the response bundle's links field, where `link.relation` is "previous" or "next". Omit `_page_token` if no previous request has been made.
         */
        _page_token?: string;
        /**
         * Only include resource versions that were created at or after the given instant in time. The instant in time uses the format YYYY-MM-DDThh:mm:ss.sss+zz:zz (for example 2015-02-07T13:28:17.239+02:00 or 2017-01-01T00:00:00Z). The time must be specified to the second and include a time zone.
         */
        _since?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patch extends StandardParameters {
        /**
         * Required. The name of the resource to update.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patientconsentenforcementstatus extends StandardParameters {
        /**
         * Required. The name of the patient to find enforcement statuses, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/fhir/Patient/{patient_id\}`
         */
        name?: string;
        /**
         * Optional. The maximum number of results on a page. If not specified, 100 is used. May not be larger than 1000.
         */
        _count?: number;
        /**
         * Optional. Used to retrieve the first, previous, next, or last page of consent enforcement statuses when using pagination. Value should be set to the value of `_page_token` set in next or previous page links' URLs. Next and previous page are returned in the response bundle's links field, where `link.relation` is "previous" or "next". Omit `_page_token` if no previous request has been made.
         */
        _page_token?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Patienteverything extends StandardParameters {
        /**
         * Optional. The response includes records prior to the end date. The date uses the format YYYY-MM-DD. If no end date is provided, all records subsequent to the start date are in scope.
         */
        end?: string;
        /**
         * Required. Name of the `Patient` resource for which the information is required.
         */
        name?: string;
        /**
         * Optional. The response includes records subsequent to the start date. The date uses the format YYYY-MM-DD. If no start date is provided, all records prior to the end date are in scope.
         */
        start?: string;
        /**
         * Optional. Maximum number of resources in a page. If not specified, 100 is used. May not be larger than 1000.
         */
        _count?: number;
        /**
         * Used to retrieve the next or previous page of results when using pagination. Set `_page_token` to the value of _page_token set in next or previous page links' url. Next and previous page are returned in the response bundle's links field, where `link.relation` is "previous" or "next". Omit `_page_token` if no previous request has been made.
         */
        _page_token?: string;
        /**
         * Optional. If provided, only resources updated after this time are returned. The time uses the format YYYY-MM-DDThh:mm:ss.sss+zz:zz. For example, `2015-02-07T13:28:17.239+02:00` or `2017-01-01T00:00:00Z`. The time must be specified to the second and include a time zone.
         */
        _since?: string;
        /**
         * Optional. String of comma-delimited FHIR resource types. If provided, only resources of the specified resource type(s) are returned. Specifying multiple `_type` parameters isn't supported. For example, the result of `_type=Observation&_type=Encounter` is undefined. Use `_type=Observation,Encounter` instead.
         */
        _type?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Read extends StandardParameters {
        /**
         * Required. The name of the resource to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcepurge extends StandardParameters {
        /**
         * Required. The name of the resource to purge.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Resourcevalidate extends StandardParameters {
        /**
         * Required. The name of the FHIR store that holds the profiles being used for validation.
         */
        parent?: string;
        /**
         * Optional. The canonical URL of a profile that this resource should be validated against. For example, to validate a Patient resource against the US Core Patient profile this parameter would be `http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient`. A StructureDefinition with this canonical URL must exist in the FHIR store.
         */
        profile?: string;
        /**
         * Required. The FHIR resource type of the resource being validated. For a complete list, see the FHIR Resource Index ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/resourcelist.html), or [R4](http://hl7.org/implement/standards/fhir/R4/resourcelist.html)). Must match the resource type in the provided content.
         */
        type?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Search extends StandardParameters {
        /**
         * Required. Name of the FHIR store to retrieve resources from.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchResourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Searchtype extends StandardParameters {
        /**
         * Required. Name of the FHIR store to retrieve resources from.
         */
        parent?: string;
        /**
         * Optional. The FHIR resource type to search, such as Patient or Observation. For a complete list, see the FHIR Resource Index ([DSTU2](http://hl7.org/implement/standards/fhir/DSTU2/resourcelist.html), [STU3](http://hl7.org/implement/standards/fhir/STU3/resourcelist.html), [R4](http://hl7.org/implement/standards/fhir/R4/resourcelist.html)).
         */
        resourceType?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchResourcesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Update extends StandardParameters {
        /**
         * Required. The name of the resource to update.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$HttpBody;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Fhir$Vread extends StandardParameters {
        /**
         * Required. The name of the resource version to retrieve.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Datasets$Fhirstores$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes operations as defined in the FHIR specification. Implements the FHIR implementation guide [bulk data delete request](https://build.fhir.org/ig/HL7/bulk-data/export.html#bulk-data-delete-request). Returns success if the operation was successfully cancelled. If the operation is complete, or has already been cancelled, returns an error response.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deleteFhirOperation(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteFhirOperation(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        deleteFhirOperation(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteFhirOperation(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        deleteFhirOperation(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation, callback: BodyResponseCallback<Schema$HttpBody>): void;
        deleteFhirOperation(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Gets the status of operations as defined in the FHIR specification. Implements the FHIR implementation guide [bulk data status request](https://build.fhir.org/ig/HL7/bulk-data/export.html#bulk-data-status-request). Operations can have one of these states: * in-progress: response status code is `202` and `X-Progress` header is set to `in progress`. * complete: response status code is `200` and the body is a JSON-encoded operation response as defined by the spec. For a bulk export, this response is defined in https://build.fhir.org/ig/HL7/bulk-data/export.html#response---complete-status. * error: response status code is `5XX`, and the body is a JSON-encoded `OperationOutcome` resource describing the reason for the error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getFhirOperationStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getFhirOperationStatus(params?: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        getFhirOperationStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getFhirOperationStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getFhirOperationStatus(params: Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getFhirOperationStatus(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Deletefhiroperation extends StandardParameters {
        /**
         * Required. Name of the operation to be deleted, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/operations/{operation_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Fhirstores$Operations$Getfhiroperationstatus extends StandardParameters {
        /**
         * Required. Name of the operation to query, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/fhirStores/{fhir_store_id\}/operations/{operation_id\}`.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Datasets$Hl7v2stores {
        context: APIRequestContext;
        messages: Resource$Projects$Locations$Datasets$Hl7v2stores$Messages;
        constructor(context: APIRequestContext);
        /**
         * Creates a new HL7v2 store within the parent dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Hl7V2Store>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create, options: MethodOptions | BodyResponseCallback<Schema$Hl7V2Store>, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        create(callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        /**
         * Deletes the specified HL7v2 store and removes all messages that it contains.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Exports the messages to a destination. To filter messages to be exported, define a filter using the start and end time, relative to the message generation time (MSH.7). This API returns an Operation that can be used to track the status of the job by calling GetOperation. Immediate fatal errors appear in the error field. Otherwise, when the operation finishes, a detailed response of type ExportMessagesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        export(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        export(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export, callback: BodyResponseCallback<Schema$Operation>): void;
        export(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets the specified HL7v2 store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Hl7V2Store>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get, options: MethodOptions | BodyResponseCallback<Schema$Hl7V2Store>, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        get(callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        /**
         * Gets metrics associated with the HL7v2 store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getHL7v2StoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getHL7v2StoreMetrics(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Hl7V2StoreMetrics>>;
        getHL7v2StoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getHL7v2StoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics, options: MethodOptions | BodyResponseCallback<Schema$Hl7V2StoreMetrics>, callback: BodyResponseCallback<Schema$Hl7V2StoreMetrics>): void;
        getHL7v2StoreMetrics(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics, callback: BodyResponseCallback<Schema$Hl7V2StoreMetrics>): void;
        getHL7v2StoreMetrics(callback: BodyResponseCallback<Schema$Hl7V2StoreMetrics>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Import messages to the HL7v2 store by loading data from the specified sources. This method is optimized to load large quantities of data using import semantics that ignore some HL7v2 store configuration options and are not suitable for all use cases. It is primarily intended to load data into an empty HL7v2 store that is not being used by other clients. An existing message will be overwritten if a duplicate message is imported. A duplicate message is a message with the same raw bytes as a message that already exists in this HL7v2 store. When a message is overwritten, its labels will also be overwritten. The import operation is idempotent unless the input data contains multiple valid messages with the same raw bytes but different labels. In that case, after the import completes, the store contains exactly one message with those raw bytes but there is no ordering guarantee on which version of the labels it has. The operation result counters do not count duplicated raw bytes as an error and count one success for each message in the input, which might result in a success count larger than the number of messages in the HL7v2 store. If some messages fail to import, for example due to parsing errors, successfully imported messages are not rolled back. This method returns an Operation that can be used to track the status of the import by calling GetOperation. Immediate fatal errors appear in the error field, errors are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). Otherwise, when the operation finishes, a response of type ImportMessagesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists the HL7v2 stores in the given dataset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListHl7V2StoresResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List, options: MethodOptions | BodyResponseCallback<Schema$ListHl7V2StoresResponse>, callback: BodyResponseCallback<Schema$ListHl7V2StoresResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List, callback: BodyResponseCallback<Schema$ListHl7V2StoresResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListHl7V2StoresResponse>): void;
        /**
         * Updates the HL7v2 store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Hl7V2Store>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch, options: MethodOptions | BodyResponseCallback<Schema$Hl7V2Store>, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch, callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        patch(callback: BodyResponseCallback<Schema$Hl7V2Store>): void;
        /**
         * Rolls back messages from the HL7v2 store to the specified time. This method returns an Operation that can be used to track the status of the rollback by calling GetOperation. Immediate fatal errors appear in the error field, errors are also logged to Cloud Logging (see [Viewing error logs in Cloud Logging](https://cloud.google.com/healthcare/docs/how-tos/logging)). Otherwise, when the operation finishes, a detailed response of type RollbackHl7V2MessagesResponse is returned in the response field. The metadata field type for this operation is OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rollback(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rollback(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback, callback: BodyResponseCallback<Schema$Operation>): void;
        rollback(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy. Can return `NOT_FOUND`, `INVALID_ARGUMENT`, and `PERMISSION_DENIED` errors.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a `NOT_FOUND` error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Create extends StandardParameters {
        /**
         * Required. The ID of the HL7v2 store that is being created. The string must match the following regex: `[\p{L\}\p{N\}_\-\.]{1,256\}`.
         */
        hl7V2StoreId?: string;
        /**
         * Required. The name of the dataset this HL7v2 store belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hl7V2Store;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Delete extends StandardParameters {
        /**
         * Required. The resource name of the HL7v2 store to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Export extends StandardParameters {
        /**
         * Required. The name of the source HL7v2 store, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7v2Stores/{hl7v2_store_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ExportMessagesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Get extends StandardParameters {
        /**
         * Required. The resource name of the HL7v2 store to get.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Gethl7v2storemetrics extends StandardParameters {
        /**
         * Required. The resource name of the HL7v2 store to get metrics for, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7v2_store_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Getiampolicy extends StandardParameters {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Import extends StandardParameters {
        /**
         * Required. The name of the target HL7v2 store, in the format `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7v2Stores/{hl7v2_store_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportMessagesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$List extends StandardParameters {
        /**
         * Restricts stores returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. Only filtering on labels is supported. For example, `labels.key=value`.
         */
        filter?: string;
        /**
         * Limit on the number of HL7v2 stores to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the dataset.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Patch extends StandardParameters {
        /**
         * Identifier. Resource name of the HL7v2 store, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7v2_store_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Hl7V2Store;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Rollback extends StandardParameters {
        /**
         * Required. The name of the HL7v2 store to rollback, in the format of "projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\} /hl7V2Stores/{hl7v2_store_id\}".
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RollbackHl7V2MessagesRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Datasets$Hl7v2stores$Messages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Parses and stores an HL7v2 message. This method triggers an asynchronous notification to any Pub/Sub topic configured in Hl7V2Store.Hl7V2NotificationConfig, if the filtering matches the message. If an MLLP adapter is configured to listen to a Pub/Sub topic, the adapter transmits the message when a notification is received.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Message>>;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create, options: MethodOptions | BodyResponseCallback<Schema$Message>, callback: BodyResponseCallback<Schema$Message>): void;
        create(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create, callback: BodyResponseCallback<Schema$Message>): void;
        create(callback: BodyResponseCallback<Schema$Message>): void;
        /**
         * Deletes an HL7v2 message.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an HL7v2 message.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Message>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get, options: MethodOptions | BodyResponseCallback<Schema$Message>, callback: BodyResponseCallback<Schema$Message>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get, callback: BodyResponseCallback<Schema$Message>): void;
        get(callback: BodyResponseCallback<Schema$Message>): void;
        /**
         * Parses and stores an HL7v2 message. This method triggers an asynchronous notification to any Pub/Sub topic configured in Hl7V2Store.Hl7V2NotificationConfig, if the filtering matches the message. If an MLLP adapter is configured to listen to a Pub/Sub topic, the adapter transmits the message when a notification is received. If the method is successful, it generates a response containing an HL7v2 acknowledgment (`ACK`) message. If the method encounters an error, it returns a negative acknowledgment (`NACK`) message. This behavior is suitable for replying to HL7v2 interface systems that expect these acknowledgments.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        ingest(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        ingest(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$IngestMessageResponse>>;
        ingest(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        ingest(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest, options: MethodOptions | BodyResponseCallback<Schema$IngestMessageResponse>, callback: BodyResponseCallback<Schema$IngestMessageResponse>): void;
        ingest(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest, callback: BodyResponseCallback<Schema$IngestMessageResponse>): void;
        ingest(callback: BodyResponseCallback<Schema$IngestMessageResponse>): void;
        /**
         * Lists all the messages in the given HL7v2 store with support for filtering. Note: HL7v2 messages are indexed asynchronously, so there might be a slight delay between the time a message is created and when it can be found through a filter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMessagesResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List, options: MethodOptions | BodyResponseCallback<Schema$ListMessagesResponse>, callback: BodyResponseCallback<Schema$ListMessagesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List, callback: BodyResponseCallback<Schema$ListMessagesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMessagesResponse>): void;
        /**
         * Update the message. The contents of the message in Message.data and data extracted from the contents such as Message.create_time cannot be altered. Only the Message.labels field is allowed to be updated. The labels in the request are merged with the existing set of labels. Existing labels with the same keys are updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Message>>;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch, options: MethodOptions | BodyResponseCallback<Schema$Message>, callback: BodyResponseCallback<Schema$Message>): void;
        patch(params: Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch, callback: BodyResponseCallback<Schema$Message>): void;
        patch(callback: BodyResponseCallback<Schema$Message>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Create extends StandardParameters {
        /**
         * Required. The name of the HL7v2 store this message belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateMessageRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Delete extends StandardParameters {
        /**
         * Required. The resource name of the HL7v2 message to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Get extends StandardParameters {
        /**
         * Required. The resource name of the HL7v2 message to retrieve.
         */
        name?: string;
        /**
         * Specifies which parts of the Message resource to return in the response. When unspecified, equivalent to FULL.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Ingest extends StandardParameters {
        /**
         * Required. The name of the HL7v2 store this message belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IngestMessageRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$List extends StandardParameters {
        /**
         * Restricts messages returned to those matching a filter. The following syntax is available: * A string field value can be written as text inside quotation marks, for example `"query text"`. The only valid relational operation for text fields is equality (`=`), where text is searched within the field, rather than having the field be equal to the text. For example, `"Comment = great"` returns messages with `great` in the comment field. * A number field value can be written as an integer, a decimal, or an exponential. The valid relational operators for number fields are the equality operator (`=`), along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * A date field value must be written in `yyyy-mm-dd` form. Fields with date and time use the RFC3339 time format. Leading zeros are required for one-digit months and days. The valid relational operators for date fields are the equality operator (`=`) , along with the less than/greater than operators (`<`, `<=`, `\>`, `\>=`). Note that there is no inequality (`!=`) operator. You can prepend the `NOT` operator to an expression to negate it. * Multiple field query expressions can be combined in one query by adding `AND` or `OR` operators between the expressions. If a boolean operator appears within a quoted string, it is not treated as special, it's just another part of the character string to be matched. You can prepend the `NOT` operator to an expression to negate it. Fields/functions available for filtering are: * `message_type`, from the MSH-9.1 field. For example, `NOT message_type = "ADT"`. * `send_date` or `sendDate`, the YYYY-MM-DD date the message was sent in the dataset's time_zone, from the MSH-7 segment. For example, `send_date < "2017-01-02"`. * `send_time`, the timestamp when the message was sent, using the RFC3339 time format for comparisons, from the MSH-7 segment. For example, `send_time < "2017-01-02T00:00:00-05:00"`. * `create_time`, the timestamp when the message was created in the HL7v2 store. Use the RFC3339 time format for comparisons. For example, `create_time < "2017-01-02T00:00:00-05:00"`. * `send_facility`, the care center that the message came from, from the MSH-4 segment. For example, `send_facility = "ABC"`. * `PatientId(value, type)`, which matches if the message lists a patient having an ID of the given value and type in the PID-2, PID-3, or PID-4 segments. For example, `PatientId("123456", "MRN")`. * `labels.x`, a string value of the label with key `x` as set using the Message.labels map. For example, `labels."priority"="high"`. The operator `:*` can be used to assert the existence of a label. For example, `labels."priority":*`.
         */
        filter?: string;
        /**
         * Orders messages returned by the specified order_by clause. Syntax: https://cloud.google.com/apis/design/design_patterns#sorting_order Fields available for ordering are: * `send_time`
         */
        orderBy?: string;
        /**
         * Limit on the number of messages to return in a single response. If not specified, 100 is used. May not be larger than 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from the previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Name of the HL7v2 store to retrieve messages from.
         */
        parent?: string;
        /**
         * Specifies the parts of the Message to return in the response. When unspecified, equivalent to BASIC. Setting this to anything other than BASIC with a `page_size` larger than the default can generate a large response, which impacts the performance of this method.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Hl7v2stores$Messages$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the Message, of the form `projects/{project_id\}/locations/{location_id\}/datasets/{dataset_id\}/hl7V2Stores/{hl7_v2_store_id\}/messages/{message_id\}`.
         */
        name?: string;
        /**
         * Required. The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Message;
    }
    export class Resource$Projects$Locations$Datasets$Operations {
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
        cancel(params: Params$Resource$Projects$Locations$Datasets$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Datasets$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Locations$Datasets$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Datasets$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Locations$Datasets$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Datasets$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Datasets$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Datasets$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Datasets$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Datasets$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Datasets$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Datasets$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Datasets$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Datasets$Operations$List extends StandardParameters {
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
    export class Resource$Projects$Locations$Services {
        context: APIRequestContext;
        nlp: Resource$Projects$Locations$Services$Nlp;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Services$Nlp {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Analyze heathcare entity in a document. Its response includes the recognized entity mentions and the relationships between them. AnalyzeEntities uses context aware models to detect entities.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        analyzeEntities(params: Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        analyzeEntities(params?: Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AnalyzeEntitiesResponse>>;
        analyzeEntities(params: Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        analyzeEntities(params: Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities, options: MethodOptions | BodyResponseCallback<Schema$AnalyzeEntitiesResponse>, callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
        analyzeEntities(params: Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities, callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
        analyzeEntities(callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Services$Nlp$Analyzeentities extends StandardParameters {
        /**
         * The resource name of the service of the form: "projects/{project_id\}/locations/{location_id\}/services/nlp".
         */
        nlpService?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnalyzeEntitiesRequest;
    }
    export {};
}
