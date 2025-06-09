import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace apihub_v1 {
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
     * API hub API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const apihub = google.apihub('v1');
     * ```
     */
    export class Apihub {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The details for the action to execute.
     */
    export interface Schema$GoogleCloudApihubV1ActionExecutionDetail {
        /**
         * Required. The action id of the plugin to execute.
         */
        actionId?: string | null;
    }
    /**
     * The value that can be assigned to the attribute when the data type is enum.
     */
    export interface Schema$GoogleCloudApihubV1AllowedValue {
        /**
         * Optional. The detailed description of the allowed value.
         */
        description?: string | null;
        /**
         * Required. The display name of the allowed value.
         */
        displayName?: string | null;
        /**
         * Required. The ID of the allowed value. * If provided, the same will be used. The service will throw an error if the specified id is already used by another allowed value in the same attribute resource. * If not provided, a system generated id derived from the display name will be used. In this case, the service will handle conflict resolution by adding a system generated suffix in case of duplicates. This value should be 4-63 characters, and valid characters are /a-z-/.
         */
        id?: string | null;
        /**
         * Optional. When set to true, the allowed value cannot be updated or deleted by the user. It can only be true for System defined attributes.
         */
        immutable?: boolean | null;
    }
    /**
     * An API resource in the API Hub.
     */
    export interface Schema$GoogleCloudApihubV1Api {
        /**
         * Optional. The api functional requirements associated with the API resource. Carinality is 1 for this attribute.
         */
        apiFunctionalRequirements?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The api requirement doc associated with the API resource. Carinality is 1 for this attribute.
         */
        apiRequirements?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The style of the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-api-style` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        apiStyle?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The api technical requirements associated with the API resource. Carinality is 1 for this attribute.
         */
        apiTechnicalRequirements?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The list of user defined attributes associated with the API resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Optional. The business unit owning the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-business-unit` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        businessUnit?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The time at which the API resource was created.
         */
        createTime?: string | null;
        /**
         * Optional. The description of the API resource.
         */
        description?: string | null;
        /**
         * Required. The display name of the API resource.
         */
        displayName?: string | null;
        /**
         * Optional. The documentation for the API resource.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Optional. Fingerprint of the API resource.
         */
        fingerprint?: string | null;
        /**
         * Optional. The maturity level of the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-maturity-level` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        maturityLevel?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Identifier. The name of the API resource in the API Hub. Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        name?: string | null;
        /**
         * Optional. Owner details for the API resource.
         */
        owner?: Schema$GoogleCloudApihubV1Owner;
        /**
         * Optional. The selected version for an API resource. This can be used when special handling is needed on client side for particular version of the API. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        selectedVersion?: string | null;
        /**
         * Output only. The list of sources and metadata from the sources of the API resource.
         */
        sourceMetadata?: Schema$GoogleCloudApihubV1SourceMetadata[];
        /**
         * Optional. The target users for the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-target-user` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        targetUser?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The team owning the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-team` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        team?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The time at which the API resource was last updated.
         */
        updateTime?: string | null;
        /**
         * Output only. The list of versions present in an API resource. Note: An API resource can be associated with more than 1 version. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        versions?: string[] | null;
    }
    /**
     * The API data to be collected.
     */
    export interface Schema$GoogleCloudApihubV1ApiData {
        /**
         * Optional. The list of API metadata.
         */
        apiMetadataList?: Schema$GoogleCloudApihubV1ApiMetadataList;
    }
    /**
     * An ApiHubInstance represents the instance resources of the API Hub. Currently, only one ApiHub instance is allowed for each project.
     */
    export interface Schema$GoogleCloudApihubV1ApiHubInstance {
        /**
         * Required. Config of the ApiHub instance.
         */
        config?: Schema$GoogleCloudApihubV1Config;
        /**
         * Output only. Creation timestamp.
         */
        createTime?: string | null;
        /**
         * Optional. Description of the ApiHub instance.
         */
        description?: string | null;
        /**
         * Optional. Instance labels to represent user-provided metadata. Refer to cloud documentation on labels for more details. https://cloud.google.com/compute/docs/labeling-resources
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Identifier. Format: `projects/{project\}/locations/{location\}/apiHubInstances/{apiHubInstance\}`.
         */
        name?: string | null;
        /**
         * Output only. The current state of the ApiHub instance.
         */
        state?: string | null;
        /**
         * Output only. Extra information about ApiHub instance state. Currently the message would be populated when state is `FAILED`.
         */
        stateMessage?: string | null;
        /**
         * Output only. Last update timestamp.
         */
        updateTime?: string | null;
    }
    /**
     * ApiHubResource is one of the resources such as Api, Operation, Deployment, Definition, Spec and Version resources stored in API-Hub.
     */
    export interface Schema$GoogleCloudApihubV1ApiHubResource {
        /**
         * This represents Api resource in search results. Only name, display_name, description and owner fields are populated in search results.
         */
        api?: Schema$GoogleCloudApihubV1Api;
        /**
         * This represents Definition resource in search results. Only name field is populated in search results.
         */
        definition?: Schema$GoogleCloudApihubV1Definition;
        /**
         * This represents Deployment resource in search results. Only name, display_name, description, deployment_type and api_versions fields are populated in search results.
         */
        deployment?: Schema$GoogleCloudApihubV1Deployment;
        /**
         * This represents ApiOperation resource in search results. Only name, description, spec and details fields are populated in search results.
         */
        operation?: Schema$GoogleCloudApihubV1ApiOperation;
        /**
         * This represents Spec resource in search results. Only name, display_name, description, spec_type and documentation fields are populated in search results.
         */
        spec?: Schema$GoogleCloudApihubV1Spec;
        /**
         * This represents Version resource in search results. Only name, display_name, description, lifecycle, compliance and accreditation fields are populated in search results.
         */
        version?: Schema$GoogleCloudApihubV1Version;
    }
    /**
     * Config for authentication with API key.
     */
    export interface Schema$GoogleCloudApihubV1ApiKeyConfig {
        /**
         * Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project\}/secrets/{secrete\}/versions/{version\}`. The `secretmanager.versions.access` permission should be granted to the service account accessing the secret.
         */
        apiKey?: Schema$GoogleCloudApihubV1Secret;
        /**
         * Required. The location of the API key. The default value is QUERY.
         */
        httpElementLocation?: string | null;
        /**
         * Required. The parameter name of the API key. E.g. If the API request is "https://example.com/act?api_key=", "api_key" would be the parameter name.
         */
        name?: string | null;
    }
    /**
     * The API metadata.
     */
    export interface Schema$GoogleCloudApihubV1APIMetadata {
        /**
         * Required. The API resource to be pushed to Hub's collect layer. The ID of the API resource will be generated by Hub to ensure uniqueness across all APIs across systems.
         */
        api?: Schema$GoogleCloudApihubV1Api;
        /**
         * Optional. Timestamp indicating when the API was created at the source.
         */
        originalCreateTime?: string | null;
        /**
         * Optional. The unique identifier of the API in the system where it was originally created.
         */
        originalId?: string | null;
        /**
         * Required. Timestamp indicating when the API was last updated at the source.
         */
        originalUpdateTime?: string | null;
        /**
         * Optional. The list of versions present in an API resource.
         */
        versions?: Schema$GoogleCloudApihubV1VersionMetadata[];
    }
    /**
     * The message to hold repeated API metadata.
     */
    export interface Schema$GoogleCloudApihubV1ApiMetadataList {
        /**
         * Required. The list of API metadata.
         */
        apiMetadata?: Schema$GoogleCloudApihubV1APIMetadata[];
    }
    /**
     * Represents an operation contained in an API version in the API Hub. An operation is added/updated/deleted in an API version when a new spec is added or an existing spec is updated/deleted in a version. Currently, an operation will be created only corresponding to OpenAPI spec as parsing is supported for OpenAPI spec. Alternatively operations can be managed via create,update and delete APIs, creation of apiOperation can be possible only for version with no parsed operations and update/delete can be possible only for operations created via create API.
     */
    export interface Schema$GoogleCloudApihubV1ApiOperation {
        /**
         * Optional. The list of user defined attributes associated with the API operation resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Output only. The time at which the operation was created.
         */
        createTime?: string | null;
        /**
         * Optional. Operation details. Note: Even though this field is optional, it is required for CreateApiOperation API and we will fail the request if not provided.
         */
        details?: Schema$GoogleCloudApihubV1OperationDetails;
        /**
         * Identifier. The name of the operation. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        name?: string | null;
        /**
         * Output only. The list of sources and metadata from the sources of the API operation.
         */
        sourceMetadata?: Schema$GoogleCloudApihubV1SourceMetadata[];
        /**
         * Output only. The name of the spec will be of the format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}` Note:The name of the spec will be empty if the operation is created via CreateApiOperation API.
         */
        spec?: string | null;
        /**
         * Output only. The time at which the operation was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The details of the Application Integration endpoint to be triggered for curation.
     */
    export interface Schema$GoogleCloudApihubV1ApplicationIntegrationEndpointDetails {
        /**
         * Required. The API trigger ID of the Application Integration workflow.
         */
        triggerId?: string | null;
        /**
         * Required. The endpoint URI should be a valid REST URI for triggering an Application Integration. Format: `https://integrations.googleapis.com/v1/{name=projects/x/locations/x/integrations/x\}:execute` or `https://{location\}-integrations.googleapis.com/v1/{name=projects/x/locations/x/integrations/x\}:execute`
         */
        uri?: string | null;
    }
    /**
     * An attribute in the API Hub. An attribute is a name value pair which can be attached to different resources in the API hub based on the scope of the attribute. Attributes can either be pre-defined by the API Hub or created by users.
     */
    export interface Schema$GoogleCloudApihubV1Attribute {
        /**
         * Optional. The list of allowed values when the attribute value is of type enum. This is required when the data_type of the attribute is ENUM. The maximum number of allowed values of an attribute will be 1000.
         */
        allowedValues?: Schema$GoogleCloudApihubV1AllowedValue[];
        /**
         * Optional. The maximum number of values that the attribute can have when associated with an API Hub resource. Cardinality 1 would represent a single-valued attribute. It must not be less than 1 or greater than 20. If not specified, the cardinality would be set to 1 by default and represent a single-valued attribute.
         */
        cardinality?: number | null;
        /**
         * Output only. The time at which the attribute was created.
         */
        createTime?: string | null;
        /**
         * Required. The type of the data of the attribute.
         */
        dataType?: string | null;
        /**
         * Output only. The definition type of the attribute.
         */
        definitionType?: string | null;
        /**
         * Optional. The description of the attribute.
         */
        description?: string | null;
        /**
         * Required. The display name of the attribute.
         */
        displayName?: string | null;
        /**
         * Output only. When mandatory is true, the attribute is mandatory for the resource specified in the scope. Only System defined attributes can be mandatory.
         */
        mandatory?: boolean | null;
        /**
         * Identifier. The name of the attribute in the API Hub. Format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`
         */
        name?: string | null;
        /**
         * Required. The scope of the attribute. It represents the resource in the API Hub to which the attribute can be linked.
         */
        scope?: string | null;
        /**
         * Output only. The time at which the attribute was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The attribute values associated with resource.
     */
    export interface Schema$GoogleCloudApihubV1AttributeValues {
        /**
         * Output only. The name of the attribute. Format: projects/{project\}/locations/{location\}/attributes/{attribute\}
         */
        attribute?: string | null;
        /**
         * The attribute values associated with a resource in case attribute data type is enum.
         */
        enumValues?: Schema$GoogleCloudApihubV1EnumAttributeValues;
        /**
         * The attribute values associated with a resource in case attribute data type is JSON.
         */
        jsonValues?: Schema$GoogleCloudApihubV1StringAttributeValues;
        /**
         * The attribute values associated with a resource in case attribute data type is string.
         */
        stringValues?: Schema$GoogleCloudApihubV1StringAttributeValues;
        /**
         * The attribute values associated with a resource in case attribute data type is URL, URI or IP, like gs://bucket-name/object-name.
         */
        uriValues?: Schema$GoogleCloudApihubV1StringAttributeValues;
    }
    /**
     * AuthConfig represents the authentication information.
     */
    export interface Schema$GoogleCloudApihubV1AuthConfig {
        /**
         * Api Key Config.
         */
        apiKeyConfig?: Schema$GoogleCloudApihubV1ApiKeyConfig;
        /**
         * Required. The authentication type.
         */
        authType?: string | null;
        /**
         * Google Service Account.
         */
        googleServiceAccountConfig?: Schema$GoogleCloudApihubV1GoogleServiceAccountConfig;
        /**
         * Oauth2.0 Client Credentials.
         */
        oauth2ClientCredentialsConfig?: Schema$GoogleCloudApihubV1Oauth2ClientCredentialsConfig;
        /**
         * User Password.
         */
        userPasswordConfig?: Schema$GoogleCloudApihubV1UserPasswordConfig;
    }
    /**
     * AuthConfigTemplate represents the authentication template for a plugin.
     */
    export interface Schema$GoogleCloudApihubV1AuthConfigTemplate {
        /**
         * Optional. The service account of the plugin hosting service. This service account should be granted the required permissions on the Auth Config parameters provided while creating the plugin instances corresponding to this plugin. For example, if the plugin instance auth config requires a secret manager secret, the service account should be granted the secretmanager.versions.access permission on the corresponding secret, if the plugin instance auth config contains a service account, the service account should be granted the iam.serviceAccounts.getAccessToken permission on the corresponding service account.
         */
        serviceAccount?: Schema$GoogleCloudApihubV1GoogleServiceAccountConfig;
        /**
         * Required. The list of authentication types supported by the plugin.
         */
        supportedAuthTypes?: string[] | null;
    }
    /**
     * The CollectApiData method's request.
     */
    export interface Schema$GoogleCloudApihubV1CollectApiDataRequest {
        /**
         * Required. The action ID to be used for collecting the API data. This should map to one of the action IDs specified in action configs in the plugin.
         */
        actionId?: string | null;
        /**
         * Required. The API data to be collected.
         */
        apiData?: Schema$GoogleCloudApihubV1ApiData;
        /**
         * Required. The type of collection. Applies to all entries in api_data.
         */
        collectionType?: string | null;
        /**
         * Required. The plugin instance collecting the API data. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`.
         */
        pluginInstance?: string | null;
    }
    /**
     * Available configurations to provision an ApiHub Instance.
     */
    export interface Schema$GoogleCloudApihubV1Config {
        /**
         * Optional. The Customer Managed Encryption Key (CMEK) used for data encryption. The CMEK name should follow the format of `projects/([^/]+)/locations/([^/]+)/keyRings/([^/]+)/cryptoKeys/([^/]+)`, where the location must match the instance location. If the CMEK is not provided, a GMEK will be created for the instance.
         */
        cmekKeyName?: string | null;
        /**
         * Optional. If true, the search will be disabled for the instance. The default value is false.
         */
        disableSearch?: boolean | null;
        /**
         * Optional. Encryption type for the region. If the encryption type is CMEK, the cmek_key_name must be provided. If no encryption type is provided, GMEK will be used.
         */
        encryptionType?: string | null;
        /**
         * Optional. The name of the Vertex AI location where the data store is stored.
         */
        vertexLocation?: string | null;
    }
    /**
     * ConfigTemplate represents the configuration template for a plugin.
     */
    export interface Schema$GoogleCloudApihubV1ConfigTemplate {
        /**
         * Optional. The list of additional configuration variables for the plugin's configuration.
         */
        additionalConfigTemplate?: Schema$GoogleCloudApihubV1ConfigVariableTemplate[];
        /**
         * Optional. The authentication template for the plugin.
         */
        authConfigTemplate?: Schema$GoogleCloudApihubV1AuthConfigTemplate;
    }
    /**
     * ConfigValueOption represents an option for a config variable of type enum or multi select.
     */
    export interface Schema$GoogleCloudApihubV1ConfigValueOption {
        /**
         * Optional. Description of the option.
         */
        description?: string | null;
        /**
         * Required. Display name of the option.
         */
        displayName?: string | null;
        /**
         * Required. Id of the option.
         */
        id?: string | null;
    }
    /**
     * ConfigVariable represents a additional configuration variable present in a PluginInstance Config or AuthConfig, based on a ConfigVariableTemplate.
     */
    export interface Schema$GoogleCloudApihubV1ConfigVariable {
        /**
         * Optional. The config variable value in case of config variable of type boolean.
         */
        boolValue?: boolean | null;
        /**
         * Optional. The config variable value in case of config variable of type enum.
         */
        enumValue?: Schema$GoogleCloudApihubV1ConfigValueOption;
        /**
         * Optional. The config variable value in case of config variable of type integer.
         */
        intValue?: string | null;
        /**
         * Output only. Key will be the id to uniquely identify the config variable.
         */
        key?: string | null;
        /**
         * Optional. The config variable value in case of config variable of type multi integer.
         */
        multiIntValues?: Schema$GoogleCloudApihubV1MultiIntValues;
        /**
         * Optional. The config variable value in case of config variable of type multi select.
         */
        multiSelectValues?: Schema$GoogleCloudApihubV1MultiSelectValues;
        /**
         * Optional. The config variable value in case of config variable of type multi string.
         */
        multiStringValues?: Schema$GoogleCloudApihubV1MultiStringValues;
        /**
         * Optional. The config variable value in case of config variable of type secret.
         */
        secretValue?: Schema$GoogleCloudApihubV1Secret;
        /**
         * Optional. The config variable value in case of config variable of type string.
         */
        stringValue?: string | null;
    }
    /**
     * ConfigVariableTemplate represents a configuration variable template present in a Plugin Config.
     */
    export interface Schema$GoogleCloudApihubV1ConfigVariableTemplate {
        /**
         * Optional. Description.
         */
        description?: string | null;
        /**
         * Optional. Enum options. To be populated if `ValueType` is `ENUM`.
         */
        enumOptions?: Schema$GoogleCloudApihubV1ConfigValueOption[];
        /**
         * Required. ID of the config variable. Must be unique within the configuration.
         */
        id?: string | null;
        /**
         * Optional. Multi select options. To be populated if `ValueType` is `MULTI_SELECT`.
         */
        multiSelectOptions?: Schema$GoogleCloudApihubV1ConfigValueOption[];
        /**
         * Optional. Flag represents that this `ConfigVariable` must be provided for a PluginInstance.
         */
        required?: boolean | null;
        /**
         * Optional. Regular expression in RE2 syntax used for validating the `value` of a `ConfigVariable`.
         */
        validationRegex?: string | null;
        /**
         * Required. Type of the parameter: string, int, bool etc.
         */
        valueType?: string | null;
    }
    /**
     * A curation resource in the API Hub.
     */
    export interface Schema$GoogleCloudApihubV1Curation {
        /**
         * Output only. The time at which the curation was created.
         */
        createTime?: string | null;
        /**
         * Optional. The description of the curation.
         */
        description?: string | null;
        /**
         * Required. The display name of the curation.
         */
        displayName?: string | null;
        /**
         * Required. The endpoint to be triggered for curation.
         */
        endpoint?: Schema$GoogleCloudApihubV1Endpoint;
        /**
         * Output only. The error code of the last execution of the curation. The error code is populated only when the last execution state is failed.
         */
        lastExecutionErrorCode?: string | null;
        /**
         * Output only. Error message describing the failure, if any, during the last execution of the curation.
         */
        lastExecutionErrorMessage?: string | null;
        /**
         * Output only. The last execution state of the curation.
         */
        lastExecutionState?: string | null;
        /**
         * Identifier. The name of the curation. Format: `projects/{project\}/locations/{location\}/curations/{curation\}`
         */
        name?: string | null;
        /**
         * Output only. The plugin instances and associated actions that are using the curation. Note: A particular curation could be used by multiple plugin instances or multiple actions in a plugin instance.
         */
        pluginInstanceActions?: Schema$GoogleCloudApihubV1PluginInstanceActionID[];
        /**
         * Output only. The time at which the curation was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The curation information for this plugin instance.
     */
    export interface Schema$GoogleCloudApihubV1CurationConfig {
        /**
         * Required. The curation type for this plugin instance.
         */
        curationType?: string | null;
        /**
         * Optional. Custom curation information for this plugin instance.
         */
        customCuration?: Schema$GoogleCloudApihubV1CustomCuration;
    }
    /**
     * Custom curation information for this plugin instance.
     */
    export interface Schema$GoogleCloudApihubV1CustomCuration {
        /**
         * Required. The unique name of the curation resource. This will be the name of the curation resource in the format: `projects/{project\}/locations/{location\}/curations/{curation\}`
         */
        curation?: string | null;
    }
    /**
     * Represents a definition for example schema, request, response definitions contained in an API version. A definition is added/updated/deleted in an API version when a new spec is added or an existing spec is updated/deleted in a version. Currently, definition will be created only corresponding to OpenAPI spec as parsing is supported for OpenAPI spec. Also, within OpenAPI spec, only `schema` object is supported.
     */
    export interface Schema$GoogleCloudApihubV1Definition {
        /**
         * Optional. The list of user defined attributes associated with the definition resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Output only. The time at which the definition was created.
         */
        createTime?: string | null;
        /**
         * Identifier. The name of the definition. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/definitions/{definition\}`
         */
        name?: string | null;
        /**
         * Output only. The value of a schema definition.
         */
        schema?: Schema$GoogleCloudApihubV1Schema;
        /**
         * Output only. The name of the spec from where the definition was parsed. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        spec?: string | null;
        /**
         * Output only. The type of the definition.
         */
        type?: string | null;
        /**
         * Output only. The time at which the definition was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A dependency resource defined in the API hub describes a dependency directed from a consumer to a supplier entity. A dependency can be defined between two Operations or between an Operation and External API.
     */
    export interface Schema$GoogleCloudApihubV1Dependency {
        /**
         * Optional. The list of user defined attributes associated with the dependency resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Required. Immutable. The entity acting as the consumer in the dependency.
         */
        consumer?: Schema$GoogleCloudApihubV1DependencyEntityReference;
        /**
         * Output only. The time at which the dependency was created.
         */
        createTime?: string | null;
        /**
         * Optional. Human readable description corresponding of the dependency.
         */
        description?: string | null;
        /**
         * Output only. Discovery mode of the dependency.
         */
        discoveryMode?: string | null;
        /**
         * Output only. Error details of a dependency if the system has detected it internally.
         */
        errorDetail?: Schema$GoogleCloudApihubV1DependencyErrorDetail;
        /**
         * Identifier. The name of the dependency in the API Hub. Format: `projects/{project\}/locations/{location\}/dependencies/{dependency\}`
         */
        name?: string | null;
        /**
         * Output only. State of the dependency.
         */
        state?: string | null;
        /**
         * Required. Immutable. The entity acting as the supplier in the dependency.
         */
        supplier?: Schema$GoogleCloudApihubV1DependencyEntityReference;
        /**
         * Output only. The time at which the dependency was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Reference to an entity participating in a dependency.
     */
    export interface Schema$GoogleCloudApihubV1DependencyEntityReference {
        /**
         * Output only. Display name of the entity.
         */
        displayName?: string | null;
        /**
         * The resource name of an external API in the API Hub. Format: `projects/{project\}/locations/{location\}/externalApis/{external_api\}`
         */
        externalApiResourceName?: string | null;
        /**
         * The resource name of an operation in the API Hub. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        operationResourceName?: string | null;
    }
    /**
     * Details describing error condition of a dependency.
     */
    export interface Schema$GoogleCloudApihubV1DependencyErrorDetail {
        /**
         * Optional. Error in the dependency.
         */
        error?: string | null;
        /**
         * Optional. Timestamp at which the error was found.
         */
        errorTime?: string | null;
    }
    /**
     * Details of the deployment where APIs are hosted. A deployment could represent an Apigee proxy, API gateway, other Google Cloud services or non-Google Cloud services as well. A deployment entity is a root level entity in the API hub and exists independent of any API.
     */
    export interface Schema$GoogleCloudApihubV1Deployment {
        /**
         * Output only. The API versions linked to this deployment. Note: A particular deployment could be linked to multiple different API versions (of same or different APIs).
         */
        apiVersions?: string[] | null;
        /**
         * Optional. The list of user defined attributes associated with the deployment resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Output only. The time at which the deployment was created.
         */
        createTime?: string | null;
        /**
         * Required. The type of deployment. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-deployment-type` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        deploymentType?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Optional. The description of the deployment.
         */
        description?: string | null;
        /**
         * Required. The display name of the deployment.
         */
        displayName?: string | null;
        /**
         * Optional. The documentation of the deployment.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Required. The endpoints at which this deployment resource is listening for API requests. This could be a list of complete URIs, hostnames or an IP addresses.
         */
        endpoints?: string[] | null;
        /**
         * Optional. The environment mapping to this deployment. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-environment` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        environment?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Identifier. The name of the deployment. Format: `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        name?: string | null;
        /**
         * Required. A URI to the runtime resource. This URI can be used to manage the resource. For example, if the runtime resource is of type APIGEE_PROXY, then this field will contain the URI to the management UI of the proxy.
         */
        resourceUri?: string | null;
        /**
         * Optional. The SLO for this deployment. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-slo` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        slo?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The list of sources and metadata from the sources of the deployment.
         */
        sourceMetadata?: Schema$GoogleCloudApihubV1SourceMetadata[];
        /**
         * Output only. The time at which the deployment was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The metadata associated with a deployment.
     */
    export interface Schema$GoogleCloudApihubV1DeploymentMetadata {
        /**
         * Required. The deployment resource to be pushed to Hub's collect layer. The ID of the deployment will be generated by Hub.
         */
        deployment?: Schema$GoogleCloudApihubV1Deployment;
        /**
         * Optional. Timestamp indicating when the deployment was created at the source.
         */
        originalCreateTime?: string | null;
        /**
         * Optional. The unique identifier of the deployment in the system where it was originally created.
         */
        originalId?: string | null;
        /**
         * Required. Timestamp indicating when the deployment was last updated at the source.
         */
        originalUpdateTime?: string | null;
    }
    /**
     * The DisablePluginInstanceAction method's request.
     */
    export interface Schema$GoogleCloudApihubV1DisablePluginInstanceActionRequest {
        /**
         * Required. The action id to disable.
         */
        actionId?: string | null;
    }
    /**
     * The DisablePlugin method's request.
     */
    export interface Schema$GoogleCloudApihubV1DisablePluginRequest {
    }
    /**
     * Documentation details.
     */
    export interface Schema$GoogleCloudApihubV1Documentation {
        /**
         * Optional. The uri of the externally hosted documentation.
         */
        externalUri?: string | null;
    }
    /**
     * The EnablePluginInstanceAction method's request.
     */
    export interface Schema$GoogleCloudApihubV1EnablePluginInstanceActionRequest {
        /**
         * Required. The action id to enable.
         */
        actionId?: string | null;
    }
    /**
     * The EnablePlugin method's request.
     */
    export interface Schema$GoogleCloudApihubV1EnablePluginRequest {
    }
    /**
     * The endpoint to be triggered for curation. The endpoint will be invoked with a request payload containing ApiMetadata. Response should contain curated data in the form of ApiMetadata.
     */
    export interface Schema$GoogleCloudApihubV1Endpoint {
        /**
         * Required. The details of the Application Integration endpoint to be triggered for curation.
         */
        applicationIntegrationEndpointDetails?: Schema$GoogleCloudApihubV1ApplicationIntegrationEndpointDetails;
    }
    /**
     * The attribute values of data type enum.
     */
    export interface Schema$GoogleCloudApihubV1EnumAttributeValues {
        /**
         * Required. The attribute values in case attribute data type is enum.
         */
        values?: Schema$GoogleCloudApihubV1AllowedValue[];
    }
    /**
     * The ExecutePluginInstanceAction method's request.
     */
    export interface Schema$GoogleCloudApihubV1ExecutePluginInstanceActionRequest {
        /**
         * Required. The execution details for the action to execute.
         */
        actionExecutionDetail?: Schema$GoogleCloudApihubV1ActionExecutionDetail;
    }
    /**
     * The execution status for the plugin instance.
     */
    export interface Schema$GoogleCloudApihubV1ExecutionStatus {
        /**
         * Output only. The current state of the execution.
         */
        currentExecutionState?: string | null;
        /**
         * Output only. The last execution of the plugin instance.
         */
        lastExecution?: Schema$GoogleCloudApihubV1LastExecution;
    }
    /**
     * An external API represents an API being provided by external sources. This can be used to model third-party APIs and can be used to define dependencies.
     */
    export interface Schema$GoogleCloudApihubV1ExternalApi {
        /**
         * Optional. The list of user defined attributes associated with the Version resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Output only. Creation timestamp.
         */
        createTime?: string | null;
        /**
         * Optional. Description of the external API. Max length is 2000 characters (Unicode Code Points).
         */
        description?: string | null;
        /**
         * Required. Display name of the external API. Max length is 63 characters (Unicode Code Points).
         */
        displayName?: string | null;
        /**
         * Optional. Documentation of the external API.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Optional. List of endpoints on which this API is accessible.
         */
        endpoints?: string[] | null;
        /**
         * Identifier. Format: `projects/{project\}/locations/{location\}/externalApi/{externalApi\}`.
         */
        name?: string | null;
        /**
         * Optional. List of paths served by this API.
         */
        paths?: string[] | null;
        /**
         * Output only. Last update timestamp.
         */
        updateTime?: string | null;
    }
    /**
     * Config for Google service account authentication.
     */
    export interface Schema$GoogleCloudApihubV1GoogleServiceAccountConfig {
        /**
         * Required. The service account to be used for authenticating request. The `iam.serviceAccounts.getAccessToken` permission should be granted on this service account to the impersonator service account.
         */
        serviceAccount?: string | null;
    }
    /**
     * The information related to the service implemented by the plugin developer, used to invoke the plugin's functionality.
     */
    export interface Schema$GoogleCloudApihubV1HostingService {
        /**
         * Optional. The URI of the service implemented by the plugin developer, used to invoke the plugin's functionality. This information is only required for user defined plugins.
         */
        serviceUri?: string | null;
    }
    /**
     * Host project registration refers to the registration of a Google cloud project with Api Hub as a host project. This is the project where Api Hub is provisioned. It acts as the consumer project for the Api Hub instance provisioned. Multiple runtime projects can be attached to the host project and these attachments define the scope of Api Hub.
     */
    export interface Schema$GoogleCloudApihubV1HostProjectRegistration {
        /**
         * Output only. The time at which the host project registration was created.
         */
        createTime?: string | null;
        /**
         * Required. Immutable. Google cloud project name in the format: "projects/abc" or "projects/123". As input, project name with either project id or number are accepted. As output, this field will contain project number.
         */
        gcpProject?: string | null;
        /**
         * Identifier. The name of the host project registration. Format: "projects/{project\}/locations/{location\}/hostProjectRegistrations/{host_project_registration\}".
         */
        name?: string | null;
    }
    /**
     * The HTTP Operation.
     */
    export interface Schema$GoogleCloudApihubV1HttpOperation {
        /**
         * Optional. Operation method Note: Even though this field is optional, it is required for CreateApiOperation API and we will fail the request if not provided.
         */
        method?: string | null;
        /**
         * Optional. The path details for the Operation. Note: Even though this field is optional, it is required for CreateApiOperation API and we will fail the request if not provided.
         */
        path?: Schema$GoogleCloudApihubV1Path;
    }
    /**
     * Issue contains the details of a single issue found by the linter.
     */
    export interface Schema$GoogleCloudApihubV1Issue {
        /**
         * Required. Rule code unique to each rule defined in linter.
         */
        code?: string | null;
        /**
         * Required. Human-readable message describing the issue found by the linter.
         */
        message?: string | null;
        /**
         * Required. An array of strings indicating the location in the analyzed document where the rule was triggered.
         */
        path?: string[] | null;
        /**
         * Required. Object describing where in the file the issue was found.
         */
        range?: Schema$GoogleCloudApihubV1Range;
        /**
         * Required. Severity level of the rule violation.
         */
        severity?: string | null;
    }
    /**
     * The result of the last execution of the plugin instance.
     */
    export interface Schema$GoogleCloudApihubV1LastExecution {
        /**
         * Output only. The last execution end time of the plugin instance.
         */
        endTime?: string | null;
        /**
         * Output only. Error message describing the failure, if any, during the last execution.
         */
        errorMessage?: string | null;
        /**
         * Output only. The result of the last execution of the plugin instance.
         */
        result?: string | null;
        /**
         * Output only. The last execution start time of the plugin instance.
         */
        startTime?: string | null;
    }
    /**
     * LintResponse contains the response from the linter.
     */
    export interface Schema$GoogleCloudApihubV1LintResponse {
        /**
         * Required. Timestamp when the linting response was generated.
         */
        createTime?: string | null;
        /**
         * Optional. Array of issues found in the analyzed document.
         */
        issues?: Schema$GoogleCloudApihubV1Issue[];
        /**
         * Required. Name of the linter used.
         */
        linter?: string | null;
        /**
         * Required. Name of the linting application.
         */
        source?: string | null;
        /**
         * Required. Lint state represents success or failure for linting.
         */
        state?: string | null;
        /**
         * Optional. Summary of all issue types and counts for each severity level.
         */
        summary?: Schema$GoogleCloudApihubV1SummaryEntry[];
    }
    /**
     * The LintSpec method's request.
     */
    export interface Schema$GoogleCloudApihubV1LintSpecRequest {
    }
    /**
     * The ListApiOperations method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListApiOperationsResponse {
        /**
         * The operations corresponding to an API version.
         */
        apiOperations?: Schema$GoogleCloudApihubV1ApiOperation[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListApis method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListApisResponse {
        /**
         * The API resources present in the API hub.
         */
        apis?: Schema$GoogleCloudApihubV1Api[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListAttributes method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListAttributesResponse {
        /**
         * The list of all attributes.
         */
        attributes?: Schema$GoogleCloudApihubV1Attribute[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListCurations method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListCurationsResponse {
        /**
         * The curation resources present in the API hub.
         */
        curations?: Schema$GoogleCloudApihubV1Curation[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListDependencies method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListDependenciesResponse {
        /**
         * The dependency resources present in the API hub.
         */
        dependencies?: Schema$GoogleCloudApihubV1Dependency[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListDeployments method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListDeploymentsResponse {
        /**
         * The deployment resources present in the API hub.
         */
        deployments?: Schema$GoogleCloudApihubV1Deployment[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListExternalApis method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListExternalApisResponse {
        /**
         * The External API resources present in the API hub.
         */
        externalApis?: Schema$GoogleCloudApihubV1ExternalApi[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListHostProjectRegistrations method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse {
        /**
         * The list of host project registrations.
         */
        hostProjectRegistrations?: Schema$GoogleCloudApihubV1HostProjectRegistration[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The ListPluginInstances method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListPluginInstancesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The plugin instances from the specified parent resource.
         */
        pluginInstances?: Schema$GoogleCloudApihubV1PluginInstance[];
    }
    /**
     * The ListPlugins method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListPluginsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The plugins from the specified parent resource.
         */
        plugins?: Schema$GoogleCloudApihubV1Plugin[];
    }
    /**
     * The ListRuntimeProjectAttachments method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of runtime project attachments.
         */
        runtimeProjectAttachments?: Schema$GoogleCloudApihubV1RuntimeProjectAttachment[];
    }
    /**
     * The ListSpecs method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListSpecsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The specs corresponding to an API Version.
         */
        specs?: Schema$GoogleCloudApihubV1Spec[];
    }
    /**
     * The ListVersions method's response.
     */
    export interface Schema$GoogleCloudApihubV1ListVersionsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The versions corresponding to an API.
         */
        versions?: Schema$GoogleCloudApihubV1Version[];
    }
    /**
     * The LookupApiHubInstance method's response.`
     */
    export interface Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse {
        /**
         * API Hub instance for a project if it exists, empty otherwise.
         */
        apiHubInstance?: Schema$GoogleCloudApihubV1ApiHubInstance;
    }
    /**
     * The ListRuntimeProjectAttachments method's response.
     */
    export interface Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse {
        /**
         * Runtime project attachment for a project if exists, empty otherwise.
         */
        runtimeProjectAttachment?: Schema$GoogleCloudApihubV1RuntimeProjectAttachment;
    }
    /**
     * The config variable value of data type multi int.
     */
    export interface Schema$GoogleCloudApihubV1MultiIntValues {
        /**
         * Optional. The config variable value of data type multi int.
         */
        values?: number[] | null;
    }
    /**
     * The config variable value of data type multi select.
     */
    export interface Schema$GoogleCloudApihubV1MultiSelectValues {
        /**
         * Optional. The config variable value of data type multi select.
         */
        values?: Schema$GoogleCloudApihubV1ConfigValueOption[];
    }
    /**
     * The config variable value of data type multi string.
     */
    export interface Schema$GoogleCloudApihubV1MultiStringValues {
        /**
         * Optional. The config variable value of data type multi string.
         */
        values?: string[] | null;
    }
    /**
     * Parameters to support Oauth 2.0 client credentials grant authentication. See https://tools.ietf.org/html/rfc6749#section-1.3.4 for more details.
     */
    export interface Schema$GoogleCloudApihubV1Oauth2ClientCredentialsConfig {
        /**
         * Required. The client identifier.
         */
        clientId?: string | null;
        /**
         * Required. Secret version reference containing the client secret. The `secretmanager.versions.access` permission should be granted to the service account accessing the secret.
         */
        clientSecret?: Schema$GoogleCloudApihubV1Secret;
    }
    /**
     * OpenApiSpecDetails contains the details parsed from an OpenAPI spec in addition to the fields mentioned in SpecDetails.
     */
    export interface Schema$GoogleCloudApihubV1OpenApiSpecDetails {
        /**
         * Output only. The format of the spec.
         */
        format?: string | null;
        /**
         * Output only. Owner details for the spec. This maps to `info.contact` in OpenAPI spec.
         */
        owner?: Schema$GoogleCloudApihubV1Owner;
        /**
         * Output only. The version in the spec. This maps to `info.version` in OpenAPI spec.
         */
        version?: string | null;
    }
    /**
     * The operation details parsed from the spec.
     */
    export interface Schema$GoogleCloudApihubV1OperationDetails {
        /**
         * Optional. For OpenAPI spec, this will be set if `operation.deprecated`is marked as `true` in the spec.
         */
        deprecated?: boolean | null;
        /**
         * Optional. Description of the operation behavior. For OpenAPI spec, this will map to `operation.description` in the spec, in case description is empty, `operation.summary` will be used.
         */
        description?: string | null;
        /**
         * Optional. Additional external documentation for this operation. For OpenAPI spec, this will map to `operation.documentation` in the spec.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * The HTTP Operation.
         */
        httpOperation?: Schema$GoogleCloudApihubV1HttpOperation;
    }
    /**
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$GoogleCloudApihubV1OperationMetadata {
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
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have been cancelled successfully have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
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
     * Owner details.
     */
    export interface Schema$GoogleCloudApihubV1Owner {
        /**
         * Optional. The name of the owner.
         */
        displayName?: string | null;
        /**
         * Required. The email of the owner.
         */
        email?: string | null;
    }
    /**
     * The path details derived from the spec.
     */
    export interface Schema$GoogleCloudApihubV1Path {
        /**
         * Optional. A short description for the path applicable to all operations.
         */
        description?: string | null;
        /**
         * Optional. Complete path relative to server endpoint. Note: Even though this field is optional, it is required for CreateApiOperation API and we will fail the request if not provided.
         */
        path?: string | null;
    }
    /**
     * A plugin resource in the API Hub.
     */
    export interface Schema$GoogleCloudApihubV1Plugin {
        /**
         * Optional. The configuration of actions supported by the plugin.
         */
        actionsConfig?: Schema$GoogleCloudApihubV1PluginActionConfig[];
        /**
         * Optional. The configuration template for the plugin.
         */
        configTemplate?: Schema$GoogleCloudApihubV1ConfigTemplate;
        /**
         * Output only. Timestamp indicating when the plugin was created.
         */
        createTime?: string | null;
        /**
         * Optional. The plugin description. Max length is 2000 characters (Unicode code points).
         */
        description?: string | null;
        /**
         * Required. The display name of the plugin. Max length is 50 characters (Unicode code points).
         */
        displayName?: string | null;
        /**
         * Optional. The documentation of the plugin, that explains how to set up and use the plugin.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Optional. This field is optional. It is used to notify the plugin hosting service for any lifecycle changes of the plugin instance and trigger execution of plugin instance actions in case of API hub managed actions. This field should be provided if the plugin instance lifecycle of the developed plugin needs to be managed from API hub. Also, in this case the plugin hosting service interface needs to be implemented. This field should not be provided if the plugin wants to manage plugin instance lifecycle events outside of hub interface and use plugin framework for only registering of plugin and plugin instances to capture the source of data into hub. Note, in this case the plugin hosting service interface is not required to be implemented. Also, the plugin instance lifecycle actions will be disabled from API hub's UI.
         */
        hostingService?: Schema$GoogleCloudApihubV1HostingService;
        /**
         * Identifier. The name of the plugin. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`
         */
        name?: string | null;
        /**
         * Output only. The type of the plugin, indicating whether it is 'SYSTEM_OWNED' or 'USER_OWNED'.
         */
        ownershipType?: string | null;
        /**
         * Optional. The category of the plugin, identifying its primary category or purpose. This field is required for all plugins.
         */
        pluginCategory?: string | null;
        /**
         * Output only. Represents the state of the plugin. Note this field will not be set for plugins developed via plugin framework as the state will be managed at plugin instance level.
         */
        state?: string | null;
        /**
         * Optional. The type of the API. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-plugin-type` attribute. The number of allowed values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute. Note this field is not required for plugins developed via plugin framework.
         */
        type?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. Timestamp indicating when the plugin was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * PluginActionConfig represents the configuration of an action supported by a plugin.
     */
    export interface Schema$GoogleCloudApihubV1PluginActionConfig {
        /**
         * Required. The description of the operation performed by the action.
         */
        description?: string | null;
        /**
         * Required. The display name of the action.
         */
        displayName?: string | null;
        /**
         * Required. The id of the action.
         */
        id?: string | null;
        /**
         * Required. The trigger mode supported by the action.
         */
        triggerMode?: string | null;
    }
    /**
     * Represents a plugin instance resource in the API Hub. A PluginInstance is a specific instance of a hub plugin with its own configuration, state, and execution details.
     */
    export interface Schema$GoogleCloudApihubV1PluginInstance {
        /**
         * Required. The action status for the plugin instance.
         */
        actions?: Schema$GoogleCloudApihubV1PluginInstanceAction[];
        /**
         * Optional. The additional information for this plugin instance corresponding to the additional config template of the plugin. This information will be sent to plugin hosting service on each call to plugin hosted service. The key will be the config_variable_template.display_name to uniquely identify the config variable.
         */
        additionalConfig?: {
            [key: string]: Schema$GoogleCloudApihubV1ConfigVariable;
        } | null;
        /**
         * Optional. The authentication information for this plugin instance.
         */
        authConfig?: Schema$GoogleCloudApihubV1AuthConfig;
        /**
         * Output only. Timestamp indicating when the plugin instance was created.
         */
        createTime?: string | null;
        /**
         * Required. The display name for this plugin instance. Max length is 255 characters.
         */
        displayName?: string | null;
        /**
         * Output only. Error message describing the failure, if any, during Create, Delete or ApplyConfig operation corresponding to the plugin instance.This field will only be populated if the plugin instance is in the ERROR or FAILED state.
         */
        errorMessage?: string | null;
        /**
         * Identifier. The unique name of the plugin instance resource. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        name?: string | null;
        /**
         * Output only. The current state of the plugin instance (e.g., enabled, disabled, provisioning).
         */
        state?: string | null;
        /**
         * Output only. Timestamp indicating when the plugin instance was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * PluginInstanceAction represents an action which can be executed in the plugin instance.
     */
    export interface Schema$GoogleCloudApihubV1PluginInstanceAction {
        /**
         * Required. This should map to one of the action id specified in actions_config in the plugin.
         */
        actionId?: string | null;
        /**
         * Optional. This configuration should be provided if the plugin action is publishing data to API hub curate layer.
         */
        curationConfig?: Schema$GoogleCloudApihubV1CurationConfig;
        /**
         * Optional. The execution information for the plugin instance action done corresponding to an API hub instance.
         */
        hubInstanceAction?: Schema$GoogleCloudApihubV1ExecutionStatus;
        /**
         * Optional. The schedule for this plugin instance action. This can only be set if the plugin supports API_HUB_SCHEDULE_TRIGGER mode for this action.
         */
        scheduleCronExpression?: string | null;
        /**
         * Optional. The time zone for the schedule cron expression. If not provided, UTC will be used.
         */
        scheduleTimeZone?: string | null;
        /**
         * Output only. The current state of the plugin action in the plugin instance.
         */
        state?: string | null;
    }
    /**
     * The plugin instance and associated action that is using the curation.
     */
    export interface Schema$GoogleCloudApihubV1PluginInstanceActionID {
        /**
         * Output only. The action ID that is using the curation. This should map to one of the action IDs specified in action configs in the plugin.
         */
        actionId?: string | null;
        /**
         * Output only. Plugin instance that is using the curation. Format is `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        pluginInstance?: string | null;
    }
    /**
     * PluginInstanceActionSource represents the plugin instance action source.
     */
    export interface Schema$GoogleCloudApihubV1PluginInstanceActionSource {
        /**
         * Output only. The id of the plugin instance action.
         */
        actionId?: string | null;
        /**
         * Output only. The resource name of the source plugin instance. Format is `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        pluginInstance?: string | null;
    }
    /**
     * Point within the file (line and character).
     */
    export interface Schema$GoogleCloudApihubV1Point {
        /**
         * Required. Character position within the line (zero-indexed).
         */
        character?: number | null;
        /**
         * Required. Line number (zero-indexed).
         */
        line?: number | null;
    }
    /**
     * Object describing where in the file the issue was found.
     */
    export interface Schema$GoogleCloudApihubV1Range {
        /**
         * Required. End of the issue.
         */
        end?: Schema$GoogleCloudApihubV1Point;
        /**
         * Required. Start of the issue.
         */
        start?: Schema$GoogleCloudApihubV1Point;
    }
    /**
     * Runtime project attachment represents an attachment from the runtime project to the host project. Api Hub looks for deployments in the attached runtime projects and creates corresponding resources in Api Hub for the discovered deployments.
     */
    export interface Schema$GoogleCloudApihubV1RuntimeProjectAttachment {
        /**
         * Output only. Create time.
         */
        createTime?: string | null;
        /**
         * Identifier. The resource name of a runtime project attachment. Format: "projects/{project\}/locations/{location\}/runtimeProjectAttachments/{runtime_project_attachment\}".
         */
        name?: string | null;
        /**
         * Required. Immutable. Google cloud project name in the format: "projects/abc" or "projects/123". As input, project name with either project id or number are accepted. As output, this field will contain project number.
         */
        runtimeProject?: string | null;
    }
    /**
     * The schema details derived from the spec. Currently, this entity is supported for OpenAPI spec only. For OpenAPI spec, this maps to the schema defined in the `definitions` section for OpenAPI 2.0 version and in `components.schemas` section for OpenAPI 3.0 and 3.1 version.
     */
    export interface Schema$GoogleCloudApihubV1Schema {
        /**
         * Output only. The display name of the schema. This will map to the name of the schema in the spec.
         */
        displayName?: string | null;
        /**
         * Output only. The raw value of the schema definition corresponding to the schema name in the spec.
         */
        rawValue?: string | null;
    }
    /**
     * The SearchResources method's request.
     */
    export interface Schema$GoogleCloudApihubV1SearchResourcesRequest {
        /**
         * Optional. An expression that filters the list of search results. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string, a number, or a boolean. The comparison operator must be `=`. Filters are not case sensitive. The following field names are eligible for filtering: * `resource_type` - The type of resource in the search results. Must be one of the following: `Api`, `ApiOperation`, `Deployment`, `Definition`, `Spec` or `Version`. This field can only be specified once in the filter. Here are is an example: * `resource_type = Api` - The resource_type is _Api_.
         */
        filter?: string | null;
        /**
         * Optional. The maximum number of search results to return. The service may return fewer than this value. If unspecified at most 10 search results will be returned. If value is negative then `INVALID_ARGUMENT` error is returned. The maximum value is 25; values above 25 will be coerced to 25. While paginating, you can specify a new page size parameter for each page of search results to be listed.
         */
        pageSize?: number | null;
        /**
         * Optional. A page token, received from a previous SearchResources call. Specify this parameter to retrieve the next page of transactions. When paginating, you must specify the `page_token` parameter and all the other parameters except page_size should be specified with the same value which was used in the previous call. If the other fields are set with a different value than the previous call then `INVALID_ARGUMENT` error is returned.
         */
        pageToken?: string | null;
        /**
         * Required. The free text search query. This query can contain keywords which could be related to any detail of the API-Hub resources such display names, descriptions, attributes etc.
         */
        query?: string | null;
    }
    /**
     * Response for the SearchResources method.
     */
    export interface Schema$GoogleCloudApihubV1SearchResourcesResponse {
        /**
         * Pass this token in the SearchResourcesRequest to continue to list results. If all results have been returned, this field is an empty string or not present in the response.
         */
        nextPageToken?: string | null;
        /**
         * List of search results according to the filter and search query specified. The order of search results represents the ranking.
         */
        searchResults?: Schema$GoogleCloudApihubV1SearchResult[];
    }
    /**
     * Represents the search results.
     */
    export interface Schema$GoogleCloudApihubV1SearchResult {
        /**
         * This represents the ApiHubResource. Note: Only selected fields of the resources are populated in response.
         */
        resource?: Schema$GoogleCloudApihubV1ApiHubResource;
    }
    /**
     * Secret provides a reference to entries in Secret Manager.
     */
    export interface Schema$GoogleCloudApihubV1Secret {
        /**
         * Required. The resource name of the secret version in the format, format as: `projects/x/secrets/x/versions/x`.
         */
        secretVersion?: string | null;
    }
    /**
     * SourceMetadata represents the metadata for a resource at the source.
     */
    export interface Schema$GoogleCloudApihubV1SourceMetadata {
        /**
         * Output only. The time at which the resource was created at the source.
         */
        originalResourceCreateTime?: string | null;
        /**
         * Output only. The unique identifier of the resource at the source.
         */
        originalResourceId?: string | null;
        /**
         * Output only. The time at which the resource was last updated at the source.
         */
        originalResourceUpdateTime?: string | null;
        /**
         * Output only. The source of the resource is a plugin instance action.
         */
        pluginInstanceActionSource?: Schema$GoogleCloudApihubV1PluginInstanceActionSource;
        /**
         * Output only. The type of the source.
         */
        sourceType?: string | null;
    }
    /**
     * Represents a spec associated with an API version in the API Hub. Note that specs of various types can be uploaded, however parsing of details is supported for OpenAPI spec currently.
     */
    export interface Schema$GoogleCloudApihubV1Spec {
        /**
         * Optional. The list of user defined attributes associated with the spec. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Optional. Input only. The contents of the uploaded spec.
         */
        contents?: Schema$GoogleCloudApihubV1SpecContents;
        /**
         * Output only. The time at which the spec was created.
         */
        createTime?: string | null;
        /**
         * Output only. Details parsed from the spec.
         */
        details?: Schema$GoogleCloudApihubV1SpecDetails;
        /**
         * Required. The display name of the spec. This can contain the file name of the spec.
         */
        displayName?: string | null;
        /**
         * Optional. The documentation of the spec. For OpenAPI spec, this will be populated from `externalDocs` in OpenAPI spec.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Optional. The lint response for the spec.
         */
        lintResponse?: Schema$GoogleCloudApihubV1LintResponse;
        /**
         * Identifier. The name of the spec. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string | null;
        /**
         * Optional. Input only. Enum specifying the parsing mode for OpenAPI Specification (OAS) parsing.
         */
        parsingMode?: string | null;
        /**
         * Output only. The list of sources and metadata from the sources of the spec.
         */
        sourceMetadata?: Schema$GoogleCloudApihubV1SourceMetadata[];
        /**
         * Optional. The URI of the spec source in case file is uploaded from an external version control system.
         */
        sourceUri?: string | null;
        /**
         * Required. The type of spec. The value should be one of the allowed values defined for `projects/{project\}/locations/{location\}/attributes/system-spec-type` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. Note, this field is mandatory if content is provided.
         */
        specType?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The time at which the spec was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The spec contents.
     */
    export interface Schema$GoogleCloudApihubV1SpecContents {
        /**
         * Required. The contents of the spec.
         */
        contents?: string | null;
        /**
         * Required. The mime type of the content for example application/json, application/yaml, application/wsdl etc.
         */
        mimeType?: string | null;
    }
    /**
     * SpecDetails contains the details parsed from supported spec types.
     */
    export interface Schema$GoogleCloudApihubV1SpecDetails {
        /**
         * Output only. The description of the spec.
         */
        description?: string | null;
        /**
         * Output only. Additional details apart from `OperationDetails` parsed from an OpenAPI spec. The OperationDetails parsed from the spec can be obtained by using ListAPIOperations method.
         */
        openApiSpecDetails?: Schema$GoogleCloudApihubV1OpenApiSpecDetails;
    }
    /**
     * The metadata associated with a spec of the API version.
     */
    export interface Schema$GoogleCloudApihubV1SpecMetadata {
        /**
         * Optional. Timestamp indicating when the spec was created at the source.
         */
        originalCreateTime?: string | null;
        /**
         * Optional. The unique identifier of the spec in the system where it was originally created.
         */
        originalId?: string | null;
        /**
         * Required. Timestamp indicating when the spec was last updated at the source.
         */
        originalUpdateTime?: string | null;
        /**
         * Required. The spec resource to be pushed to Hub's collect layer. The ID of the spec will be generated by Hub.
         */
        spec?: Schema$GoogleCloudApihubV1Spec;
    }
    /**
     * The attribute values of data type string or JSON.
     */
    export interface Schema$GoogleCloudApihubV1StringAttributeValues {
        /**
         * Required. The attribute values in case attribute data type is string or JSON.
         */
        values?: string[] | null;
    }
    /**
     * Represents a singleton style guide resource to be used for linting Open API specs.
     */
    export interface Schema$GoogleCloudApihubV1StyleGuide {
        /**
         * Required. Input only. The contents of the uploaded style guide.
         */
        contents?: Schema$GoogleCloudApihubV1StyleGuideContents;
        /**
         * Required. Target linter for the style guide.
         */
        linter?: string | null;
        /**
         * Identifier. The name of the style guide. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/styleGuide`
         */
        name?: string | null;
    }
    /**
     * The style guide contents.
     */
    export interface Schema$GoogleCloudApihubV1StyleGuideContents {
        /**
         * Required. The contents of the style guide.
         */
        contents?: string | null;
        /**
         * Required. The mime type of the content.
         */
        mimeType?: string | null;
    }
    /**
     * Count of issues with a given severity.
     */
    export interface Schema$GoogleCloudApihubV1SummaryEntry {
        /**
         * Required. Count of issues with the given severity.
         */
        count?: number | null;
        /**
         * Required. Severity of the issue.
         */
        severity?: string | null;
    }
    /**
     * Parameters to support Username and Password Authentication.
     */
    export interface Schema$GoogleCloudApihubV1UserPasswordConfig {
        /**
         * Required. Secret version reference containing the password. The `secretmanager.versions.access` permission should be granted to the service account accessing the secret.
         */
        password?: Schema$GoogleCloudApihubV1Secret;
        /**
         * Required. Username.
         */
        username?: string | null;
    }
    /**
     * Represents a version of the API resource in API hub. This is also referred to as the API version.
     */
    export interface Schema$GoogleCloudApihubV1Version {
        /**
         * Optional. The accreditations associated with the API version. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-accreditation` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        accreditation?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The operations contained in the API version. These operations will be added to the version when a new spec is added or when an existing spec is updated. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        apiOperations?: string[] | null;
        /**
         * Optional. The list of user defined attributes associated with the Version resource. The key is the attribute name. It will be of the format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`. The value is the attribute values associated with the resource.
         */
        attributes?: {
            [key: string]: Schema$GoogleCloudApihubV1AttributeValues;
        } | null;
        /**
         * Optional. The compliance associated with the API version. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-compliance` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        compliance?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Output only. The time at which the version was created.
         */
        createTime?: string | null;
        /**
         * Output only. The definitions contained in the API version. These definitions will be added to the version when a new spec is added or when an existing spec is updated. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/definitions/{definition\}`
         */
        definitions?: string[] | null;
        /**
         * Optional. The deployments linked to this API version. Note: A particular API version could be deployed to multiple deployments (for dev deployment, UAT deployment, etc) Format is `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        deployments?: string[] | null;
        /**
         * Optional. The description of the version.
         */
        description?: string | null;
        /**
         * Required. The display name of the version.
         */
        displayName?: string | null;
        /**
         * Optional. The documentation of the version.
         */
        documentation?: Schema$GoogleCloudApihubV1Documentation;
        /**
         * Optional. The lifecycle of the API version. This maps to the following system defined attribute: `projects/{project\}/locations/{location\}/attributes/system-lifecycle` attribute. The number of values for this attribute will be based on the cardinality of the attribute. The same can be retrieved via GetAttribute API. All values should be from the list of allowed values defined for the attribute.
         */
        lifecycle?: Schema$GoogleCloudApihubV1AttributeValues;
        /**
         * Identifier. The name of the version. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        name?: string | null;
        /**
         * Optional. The selected deployment for a Version resource. This can be used when special handling is needed on client side for a particular deployment linked to the version. Format is `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        selectedDeployment?: string | null;
        /**
         * Output only. The list of sources and metadata from the sources of the version.
         */
        sourceMetadata?: Schema$GoogleCloudApihubV1SourceMetadata[];
        /**
         * Output only. The specs associated with this version. Note that an API version can be associated with multiple specs. Format is `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        specs?: string[] | null;
        /**
         * Output only. The time at which the version was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The metadata associated with a version of the API resource.
     */
    export interface Schema$GoogleCloudApihubV1VersionMetadata {
        /**
         * Optional. The deployments linked to this API version. Note: A particular API version could be deployed to multiple deployments (for dev deployment, UAT deployment, etc.)
         */
        deployments?: Schema$GoogleCloudApihubV1DeploymentMetadata[];
        /**
         * Optional. Timestamp indicating when the version was created at the source.
         */
        originalCreateTime?: string | null;
        /**
         * Optional. The unique identifier of the version in the system where it was originally created.
         */
        originalId?: string | null;
        /**
         * Required. Timestamp indicating when the version was last updated at the source.
         */
        originalUpdateTime?: string | null;
        /**
         * Optional. The specs associated with this version. Note that an API version can be associated with multiple specs.
         */
        specs?: Schema$GoogleCloudApihubV1SpecMetadata[];
        /**
         * Required. Represents a version of the API resource in API hub. The ID of the version will be generated by Hub.
         */
        version?: Schema$GoogleCloudApihubV1Version;
    }
    /**
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$GoogleCloudCommonOperationMetadata {
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
     * The response message for Locations.ListLocations.
     */
    export interface Schema$GoogleCloudLocationListLocationsResponse {
        /**
         * A list of locations that matches the specified filter in the request.
         */
        locations?: Schema$GoogleCloudLocationLocation[];
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * A resource that represents a Google Cloud location.
     */
    export interface Schema$GoogleCloudLocationLocation {
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
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$GoogleLongrunningCancelOperationRequest {
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$GoogleLongrunningListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$GoogleLongrunningOperation[];
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
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        apiHubInstances: Resource$Projects$Locations$Apihubinstances;
        apis: Resource$Projects$Locations$Apis;
        attributes: Resource$Projects$Locations$Attributes;
        curations: Resource$Projects$Locations$Curations;
        dependencies: Resource$Projects$Locations$Dependencies;
        deployments: Resource$Projects$Locations$Deployments;
        externalApis: Resource$Projects$Locations$Externalapis;
        hostProjectRegistrations: Resource$Projects$Locations$Hostprojectregistrations;
        operations: Resource$Projects$Locations$Operations;
        plugins: Resource$Projects$Locations$Plugins;
        runtimeProjectAttachments: Resource$Projects$Locations$Runtimeprojectattachments;
        constructor(context: APIRequestContext);
        /**
         * Collect API data from a source and push it to Hub's collect layer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        collectApiData(params: Params$Resource$Projects$Locations$Collectapidata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        collectApiData(params?: Params$Resource$Projects$Locations$Collectapidata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        collectApiData(params: Params$Resource$Projects$Locations$Collectapidata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        collectApiData(params: Params$Resource$Projects$Locations$Collectapidata, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        collectApiData(params: Params$Resource$Projects$Locations$Collectapidata, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        collectApiData(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudLocationLocation>>;
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudLocationLocation>, callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        get(params: Params$Resource$Projects$Locations$Get, callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudLocationListLocationsResponse>>;
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$List, callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
        /**
         * Look up a runtime project attachment. This API can be called in the context of any project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookupRuntimeProjectAttachment(params: Params$Resource$Projects$Locations$Lookupruntimeprojectattachment, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookupRuntimeProjectAttachment(params?: Params$Resource$Projects$Locations$Lookupruntimeprojectattachment, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse>>;
        lookupRuntimeProjectAttachment(params: Params$Resource$Projects$Locations$Lookupruntimeprojectattachment, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookupRuntimeProjectAttachment(params: Params$Resource$Projects$Locations$Lookupruntimeprojectattachment, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse>): void;
        lookupRuntimeProjectAttachment(params: Params$Resource$Projects$Locations$Lookupruntimeprojectattachment, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse>): void;
        lookupRuntimeProjectAttachment(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupRuntimeProjectAttachmentResponse>): void;
        /**
         * Search across API-Hub resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchResources(params: Params$Resource$Projects$Locations$Searchresources, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchResources(params?: Params$Resource$Projects$Locations$Searchresources, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1SearchResourcesResponse>>;
        searchResources(params: Params$Resource$Projects$Locations$Searchresources, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchResources(params: Params$Resource$Projects$Locations$Searchresources, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1SearchResourcesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SearchResourcesResponse>): void;
        searchResources(params: Params$Resource$Projects$Locations$Searchresources, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SearchResourcesResponse>): void;
        searchResources(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SearchResourcesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Collectapidata extends StandardParameters {
        /**
         * Required. The regional location of the API hub instance and its resources. Format: `projects/{project\}/locations/{location\}`
         */
        location?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1CollectApiDataRequest;
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
    export interface Params$Resource$Projects$Locations$Lookupruntimeprojectattachment extends StandardParameters {
        /**
         * Required. Runtime project ID to look up runtime project attachment for. Lookup happens across all regions. Expected format: `projects/{project\}/locations/{location\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Searchresources extends StandardParameters {
        /**
         * Required. The resource name of the location which will be of the type `projects/{project_id\}/locations/{location_id\}`. This field is used to identify the instance of API-Hub in which resources should be searched.
         */
        location?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1SearchResourcesRequest;
    }
    export class Resource$Projects$Locations$Apihubinstances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Provisions instance resources for the API Hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Apihubinstances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Apihubinstances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Apihubinstances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Apihubinstances$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Apihubinstances$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes the API hub instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Apihubinstances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Apihubinstances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Apihubinstances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Apihubinstances$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Apihubinstances$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets details of a single API Hub instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apihubinstances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apihubinstances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ApiHubInstance>>;
        get(params: Params$Resource$Projects$Locations$Apihubinstances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apihubinstances$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ApiHubInstance>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiHubInstance>): void;
        get(params: Params$Resource$Projects$Locations$Apihubinstances$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiHubInstance>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiHubInstance>): void;
        /**
         * Looks up an Api Hub instance in a given GCP project. There will always be only one Api Hub instance for a GCP project across all locations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Projects$Locations$Apihubinstances$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Projects$Locations$Apihubinstances$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse>>;
        lookup(params: Params$Resource$Projects$Locations$Apihubinstances$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Projects$Locations$Apihubinstances$Lookup, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse>): void;
        lookup(params: Params$Resource$Projects$Locations$Apihubinstances$Lookup, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse>): void;
        lookup(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1LookupApiHubInstanceResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Apihubinstances$Create extends StandardParameters {
        /**
         * Optional. Identifier to assign to the Api Hub instance. Must be unique within scope of the parent resource. If the field is not provided, system generated id will be used. This value should be 4-40 characters, and valid characters are `/a-z[0-9]-_/`.
         */
        apiHubInstanceId?: string;
        /**
         * Required. The parent resource for the Api Hub instance resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ApiHubInstance;
    }
    export interface Params$Resource$Projects$Locations$Apihubinstances$Delete extends StandardParameters {
        /**
         * Required. The name of the Api Hub instance to delete. Format: `projects/{project\}/locations/{location\}/apiHubInstances/{apiHubInstance\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apihubinstances$Get extends StandardParameters {
        /**
         * Required. The name of the Api Hub instance to retrieve. Format: `projects/{project\}/locations/{location\}/apiHubInstances/{apiHubInstance\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apihubinstances$Lookup extends StandardParameters {
        /**
         * Required. There will always be only one Api Hub instance for a GCP project across all locations. The parent resource for the Api Hub instance resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Apis {
        context: APIRequestContext;
        versions: Resource$Projects$Locations$Apis$Versions;
        constructor(context: APIRequestContext);
        /**
         * Create an API resource in the API hub. Once an API resource is created, versions can be added to it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Apis$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Apis$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Api>>;
        create(params: Params$Resource$Projects$Locations$Apis$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Api>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        /**
         * Delete an API resource in the API hub. API can only be deleted if all underlying versions are deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Apis$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Apis$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Apis$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get API resource details including the API versions contained in it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apis$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apis$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Api>>;
        get(params: Params$Resource$Projects$Locations$Apis$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Api>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        /**
         * List API resources in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Apis$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Apis$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListApisResponse>>;
        list(params: Params$Resource$Projects$Locations$Apis$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Apis$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListApisResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApisResponse>): void;
        list(params: Params$Resource$Projects$Locations$Apis$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApisResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApisResponse>): void;
        /**
         * Update an API resource in the API hub. The following fields in the API can be updated: * display_name * description * owner * documentation * target_user * team * business_unit * maturity_level * api_style * attributes The update_mask should be used to specify the fields being updated. Updating the owner field requires complete owner message and updates both owner and email fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Apis$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Apis$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Api>>;
        patch(params: Params$Resource$Projects$Locations$Apis$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Api>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Api>): void;
    }
    export interface Params$Resource$Projects$Locations$Apis$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the API resource, which will become the final component of the API's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another API resource in the API hub. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        apiId?: string;
        /**
         * Required. The parent resource for the API resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Api;
    }
    export interface Params$Resource$Projects$Locations$Apis$Delete extends StandardParameters {
        /**
         * Optional. If set to true, any versions from this API will also be deleted. Otherwise, the request will only work if the API has no versions.
         */
        force?: boolean;
        /**
         * Required. The name of the API resource to delete. Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Get extends StandardParameters {
        /**
         * Required. The name of the API resource to retrieve. Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of ApiResources. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>`, `:` or `=`. Filters are not case sensitive. The following fields in the `ApiResource` are eligible for filtering: * `owner.email` - The email of the team which owns the ApiResource. Allowed comparison operators: `=`. * `create_time` - The time at which the ApiResource was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `display_name` - The display name of the ApiResource. Allowed comparison operators: `=`. * `target_user.enum_values.values.id` - The allowed value id of the target users attribute associated with the ApiResource. Allowed comparison operator is `:`. * `target_user.enum_values.values.display_name` - The allowed value display name of the target users attribute associated with the ApiResource. Allowed comparison operator is `:`. * `team.enum_values.values.id` - The allowed value id of the team attribute associated with the ApiResource. Allowed comparison operator is `:`. * `team.enum_values.values.display_name` - The allowed value display name of the team attribute associated with the ApiResource. Allowed comparison operator is `:`. * `business_unit.enum_values.values.id` - The allowed value id of the business unit attribute associated with the ApiResource. Allowed comparison operator is `:`. * `business_unit.enum_values.values.display_name` - The allowed value display name of the business unit attribute associated with the ApiResource. Allowed comparison operator is `:`. * `maturity_level.enum_values.values.id` - The allowed value id of the maturity level attribute associated with the ApiResource. Allowed comparison operator is `:`. * `maturity_level.enum_values.values.display_name` - The allowed value display name of the maturity level attribute associated with the ApiResource. Allowed comparison operator is `:`. * `api_style.enum_values.values.id` - The allowed value id of the api style attribute associated with the ApiResource. Allowed comparison operator is `:`. * `api_style.enum_values.values.display_name` - The allowed value display name of the api style attribute associated with the ApiResource. Allowed comparison operator is `:`. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.id` - The allowed value id of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-id is a placeholder that can be replaced with any user defined enum attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.display_name` - The allowed value display name of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-display-name is a placeholder that can be replaced with any user defined enum attribute enum name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.string_values.values` - The allowed value of the user defined string attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-string is a placeholder that can be replaced with any user defined string attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.json_values.values` - The allowed value of the user defined JSON attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-json is a placeholder that can be replaced with any user defined JSON attribute name. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `owner.email = \"apihub@google.com\"` - - The owner team email is _apihub@google.com_. * `owner.email = \"apihub@google.com\" AND create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The owner team email is _apihub@google.com_ and the api was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `owner.email = \"apihub@google.com\" OR team.enum_values.values.id: apihub-team-id` - The filter string specifies the APIs where the owner team email is _apihub@google.com_ or the id of the allowed value associated with the team attribute is _apihub-team-id_. * `owner.email = \"apihub@google.com\" OR team.enum_values.values.display_name: ApiHub Team` - The filter string specifies the APIs where the owner team email is _apihub@google.com_ or the display name of the allowed value associated with the team attribute is `ApiHub Team`. * `owner.email = \"apihub@google.com\" AND attributes.projects/test-project-id/locations/test-location-id/ attributes/17650f90-4a29-4971-b3c0-d5532da3764b.enum_values.values.id: test_enum_id AND attributes.projects/test-project-id/locations/test-location-id/ attributes/1765\0f90-4a29-5431-b3d0-d5532da3764c.string_values.values: test_string_value` - The filter string specifies the APIs where the owner team email is _apihub@google.com_ and the id of the allowed value associated with the user defined attribute of type enum is _test_enum_id_ and the value of the user defined attribute of type string is _test_..
         */
        filter?: string;
        /**
         * Optional. The maximum number of API resources to return. The service may return fewer than this value. If unspecified, at most 50 Apis will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListApis` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListApis` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of API resources. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Patch extends StandardParameters {
        /**
         * Identifier. The name of the API resource in the API Hub. Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Api;
    }
    export class Resource$Projects$Locations$Apis$Versions {
        context: APIRequestContext;
        definitions: Resource$Projects$Locations$Apis$Versions$Definitions;
        operations: Resource$Projects$Locations$Apis$Versions$Operations;
        specs: Resource$Projects$Locations$Apis$Versions$Specs;
        constructor(context: APIRequestContext);
        /**
         * Create an API version for an API resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Apis$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Version>>;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Version>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        /**
         * Delete an API version. Version can only be deleted if all underlying specs, operations, definitions and linked deployments are deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Apis$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about the API version of an API resource. This will include information about the specs and operations present in the API version as well as the deployments linked to it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apis$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Version>>;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Version>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        /**
         * List API versions of an API resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Apis$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Apis$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListVersionsResponse>): void;
        /**
         * Update API version. The following fields in the version can be updated currently: * display_name * description * documentation * deployments * lifecycle * compliance * accreditation * attributes The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Apis$Versions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Version>>;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Version>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Version>): void;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Create extends StandardParameters {
        /**
         * Required. The parent resource for API version. Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        parent?: string;
        /**
         * Optional. The ID to use for the API version, which will become the final component of the version's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another version in the API resource. * If not provided, a system generated id will be used. This value should be 4-500 characters, overall resource name which will be of format `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`, its length is limited to 700 characters and valid characters are /a-z[0-9]-_/.
         */
        versionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Version;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Delete extends StandardParameters {
        /**
         * Optional. If set to true, any specs from this version will also be deleted. Otherwise, the request will only work if the version has no specs.
         */
        force?: boolean;
        /**
         * Required. The name of the version to delete. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Get extends StandardParameters {
        /**
         * Required. The name of the API version to retrieve. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of Versions. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string, a number, or a boolean. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `Version` are eligible for filtering: * `display_name` - The display name of the Version. Allowed comparison operators: `=`. * `create_time` - The time at which the Version was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `lifecycle.enum_values.values.id` - The allowed value id of the lifecycle attribute associated with the Version. Allowed comparison operators: `:`. * `lifecycle.enum_values.values.display_name` - The allowed value display name of the lifecycle attribute associated with the Version. Allowed comparison operators: `:`. * `compliance.enum_values.values.id` - The allowed value id of the compliances attribute associated with the Version. Allowed comparison operators: `:`. * `compliance.enum_values.values.display_name` - The allowed value display name of the compliances attribute associated with the Version. Allowed comparison operators: `:`. * `accreditation.enum_values.values.id` - The allowed value id of the accreditations attribute associated with the Version. Allowed comparison operators: `:`. * `accreditation.enum_values.values.display_name` - The allowed value display name of the accreditations attribute associated with the Version. Allowed comparison operators: `:`. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.id` - The allowed value id of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-id is a placeholder that can be replaced with any user defined enum attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.display_name` - The allowed value display name of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-display-name is a placeholder that can be replaced with any user defined enum attribute enum name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.string_values.values` - The allowed value of the user defined string attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-string is a placeholder that can be replaced with any user defined string attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.json_values.values` - The allowed value of the user defined JSON attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-json is a placeholder that can be replaced with any user defined JSON attribute name. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `lifecycle.enum_values.values.id: preview-id` - The filter string specifies that the id of the allowed value associated with the lifecycle attribute of the Version is _preview-id_. * `lifecycle.enum_values.values.display_name: \"Preview Display Name\"` - The filter string specifies that the display name of the allowed value associated with the lifecycle attribute of the Version is `Preview Display Name`. * `lifecycle.enum_values.values.id: preview-id AND create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The id of the allowed value associated with the lifecycle attribute of the Version is _preview-id_ and it was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `compliance.enum_values.values.id: gdpr-id OR compliance.enum_values.values.id: pci-dss-id` - The id of the allowed value associated with the compliance attribute is _gdpr-id_ or _pci-dss-id_. * `lifecycle.enum_values.values.id: preview-id AND attributes.projects/test-project-id/locations/test-location-id/ attributes/17650f90-4a29-4971-b3c0-d5532da3764b.string_values.values: test` - The filter string specifies that the id of the allowed value associated with the lifecycle attribute of the Version is _preview-id_ and the value of the user defined attribute of type string is _test_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of versions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListVersions` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent which owns this collection of API versions i.e., the API resource Format: `projects/{project\}/locations/{location\}/apis/{api\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Patch extends StandardParameters {
        /**
         * Identifier. The name of the version. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Version;
    }
    export class Resource$Projects$Locations$Apis$Versions$Definitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get details about a definition in an API version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Definition>>;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Definition>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Definition>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Definition>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Definition>): void;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Definitions$Get extends StandardParameters {
        /**
         * Required. The name of the definition to retrieve. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/definitions/{definition\}`
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Apis$Versions$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an apiOperation in an API version. An apiOperation can be created only if the version has no apiOperations which were created by parsing a spec.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Apis$Versions$Operations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ApiOperation>>;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        /**
         * Delete an operation in an API version and we can delete only the operations created via create API. If the operation was created by parsing the spec, then it can be deleted by editing or deleting the spec.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about a particular operation in API version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apis$Versions$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ApiOperation>>;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        /**
         * List operations in an API version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Apis$Versions$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListApiOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListApiOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApiOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApiOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListApiOperationsResponse>): void;
        /**
         * Update an operation in an API version. The following fields in the ApiOperation resource can be updated: * details.description * details.documentation * details.http_operation.path * details.http_operation.method * details.deprecated * attributes The update_mask should be used to specify the fields being updated. An operation can be updated only if the operation was created via CreateApiOperation API. If the operation was created by parsing the spec, then it can be edited by updating the spec.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ApiOperation>>;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ApiOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Operations$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the operation resource, which will become the final component of the operation's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another operation resource in the API hub. * If not provided, a system generated id will be used. This value should be 4-500 characters, overall resource name which will be of format `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`, its length is limited to 700 characters, and valid characters are /a-z[0-9]-_/.
         */
        apiOperationId?: string;
        /**
         * Required. The parent resource for the operation resource. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ApiOperation;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Operations$Delete extends StandardParameters {
        /**
         * Required. The name of the operation resource to delete. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Operations$Get extends StandardParameters {
        /**
         * Required. The name of the operation to retrieve. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Operations$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of ApiOperations. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string or a boolean. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `ApiOperation` are eligible for filtering: * `name` - The ApiOperation resource name. Allowed comparison operators: `=`. * `details.http_operation.path.path` - The http operation's complete path relative to server endpoint. Allowed comparison operators: `=`. * `details.http_operation.method` - The http operation method type. Allowed comparison operators: `=`. * `details.deprecated` - Indicates if the ApiOperation is deprecated. Allowed values are True / False indicating the deprycation status of the ApiOperation. Allowed comparison operators: `=`. * `create_time` - The time at which the ApiOperation was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.id` - The allowed value id of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-id is a placeholder that can be replaced with any user defined enum attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.display_name` - The allowed value display name of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-display-name is a placeholder that can be replaced with any user defined enum attribute enum name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.string_values.values` - The allowed value of the user defined string attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-string is a placeholder that can be replaced with any user defined string attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.json_values.values` - The allowed value of the user defined JSON attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-json is a placeholder that can be replaced with any user defined JSON attribute name. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `details.deprecated = True` - The ApiOperation is deprecated. * `details.http_operation.method = GET AND create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The method of the http operation of the ApiOperation is _GET_ and the spec was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `details.http_operation.method = GET OR details.http_operation.method = POST`. - The http operation of the method of ApiOperation is _GET_ or _POST_. * `details.deprecated = True AND attributes.projects/test-project-id/locations/test-location-id/ attributes/17650f90-4a29-4971-b3c0-d5532da3764b.string_values.values: test` - The filter string specifies that the ApiOperation is deprecated and the value of the user defined attribute of type string is _test_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of operations to return. The service may return fewer than this value. If unspecified, at most 50 operations will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListApiOperations` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListApiOperations` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent which owns this collection of operations i.e., the API version. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Operations$Patch extends StandardParameters {
        /**
         * Identifier. The name of the operation. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/operations/{operation\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ApiOperation;
    }
    export class Resource$Projects$Locations$Apis$Versions$Specs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Add a spec to an API version in the API hub. Multiple specs can be added to an API version. Note, while adding a spec, at least one of `contents` or `source_uri` must be provided. If `contents` is provided, then `spec_type` must also be provided. On adding a spec with contents to the version, the operations present in it will be added to the version.Note that the file contents in the spec should be of the same type as defined in the `projects/{project\}/locations/{location\}/attributes/system-spec-type` attribute associated with spec resource. Note that specs of various types can be uploaded, however parsing of details is supported for OpenAPI spec currently. In order to access the information parsed from the spec, use the GetSpec method. In order to access the raw contents for a particular spec, use the GetSpecContents method. In order to access the operations parsed from the spec, use the ListAPIOperations method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Spec>>;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        create(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        /**
         * Delete a spec. Deleting a spec will also delete the associated operations from the version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about the information parsed from a spec. Note that this method does not return the raw spec contents. Use GetSpecContents method to retrieve the same.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Spec>>;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        get(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        /**
         * Get spec contents.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getContents(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getContents(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1SpecContents>>;
        getContents(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getContents(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1SpecContents>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SpecContents>): void;
        getContents(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SpecContents>): void;
        getContents(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1SpecContents>): void;
        /**
         * Lints the requested spec and updates the corresponding API Spec with the lint response. This lint response will be available in all subsequent Get and List Spec calls to Core service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lint(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lint(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        lint(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lint(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        lint(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint, callback: BodyResponseCallback<Schema$Empty>): void;
        lint(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * List specs corresponding to a particular API resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListSpecsResponse>>;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListSpecsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListSpecsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListSpecsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListSpecsResponse>): void;
        /**
         * Update spec. The following fields in the spec can be updated: * display_name * source_uri * lint_response * attributes * contents * spec_type In case of an OAS spec, updating spec contents can lead to: 1. Creation, deletion and update of operations. 2. Creation, deletion and update of definitions. 3. Update of other info parsed out from the new spec. In case of contents or source_uri being present in update mask, spec_type must also be present. Also, spec_type can not be present in update mask if contents or source_uri is not present. The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Spec>>;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        patch(params: Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Spec>): void;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Create extends StandardParameters {
        /**
         * Required. The parent resource for Spec. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        parent?: string;
        /**
         * Optional. The ID to use for the spec, which will become the final component of the spec's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another spec in the API resource. * If not provided, a system generated id will be used. This value should be 4-500 characters, overall resource name which will be of format `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`, its length is limited to 1000 characters and valid characters are /a-z[0-9]-_/.
         */
        specId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Spec;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Delete extends StandardParameters {
        /**
         * Required. The name of the spec to delete. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Get extends StandardParameters {
        /**
         * Required. The name of the spec to retrieve. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Getcontents extends StandardParameters {
        /**
         * Required. The name of the spec whose contents need to be retrieved. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Lint extends StandardParameters {
        /**
         * Required. The name of the spec to be linted. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1LintSpecRequest;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of Specs. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>`, `:` or `=`. Filters are not case sensitive. The following fields in the `Spec` are eligible for filtering: * `display_name` - The display name of the Spec. Allowed comparison operators: `=`. * `create_time` - The time at which the Spec was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `spec_type.enum_values.values.id` - The allowed value id of the spec_type attribute associated with the Spec. Allowed comparison operators: `:`. * `spec_type.enum_values.values.display_name` - The allowed value display name of the spec_type attribute associated with the Spec. Allowed comparison operators: `:`. * `lint_response.json_values.values` - The json value of the lint_response attribute associated with the Spec. Allowed comparison operators: `:`. * `mime_type` - The MIME type of the Spec. Allowed comparison operators: `=`. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.id` - The allowed value id of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-id is a placeholder that can be replaced with any user defined enum attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.display_name` - The allowed value display name of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-display-name is a placeholder that can be replaced with any user defined enum attribute enum name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.string_values.values` - The allowed value of the user defined string attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-string is a placeholder that can be replaced with any user defined string attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.json_values.values` - The allowed value of the user defined JSON attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-json is a placeholder that can be replaced with any user defined JSON attribute name. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `spec_type.enum_values.values.id: rest-id` - The filter string specifies that the id of the allowed value associated with the spec_type attribute is _rest-id_. * `spec_type.enum_values.values.display_name: \"Rest Display Name\"` - The filter string specifies that the display name of the allowed value associated with the spec_type attribute is `Rest Display Name`. * `spec_type.enum_values.values.id: grpc-id AND create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The id of the allowed value associated with the spec_type attribute is _grpc-id_ and the spec was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `spec_type.enum_values.values.id: rest-id OR spec_type.enum_values.values.id: grpc-id` - The id of the allowed value associated with the spec_type attribute is _rest-id_ or _grpc-id_. * `spec_type.enum_values.values.id: rest-id AND attributes.projects/test-project-id/locations/test-location-id/ attributes/17650f90-4a29-4971-b3c0-d5532da3764b.enum_values.values.id: test` - The filter string specifies that the id of the allowed value associated with the spec_type attribute is _rest-id_ and the id of the allowed value associated with the user defined attribute of type enum is _test_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of specs to return. The service may return fewer than this value. If unspecified, at most 50 specs will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListSpecs` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSpecs` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of specs. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Apis$Versions$Specs$Patch extends StandardParameters {
        /**
         * Identifier. The name of the spec. Format: `projects/{project\}/locations/{location\}/apis/{api\}/versions/{version\}/specs/{spec\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Spec;
    }
    export class Resource$Projects$Locations$Attributes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a user defined attribute. Certain pre defined attributes are already created by the API hub. These attributes will have type as `SYSTEM_DEFINED` and can be listed via ListAttributes method. Allowed values for the same can be updated via UpdateAttribute method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Attributes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Attributes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Attribute>>;
        create(params: Params$Resource$Projects$Locations$Attributes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Attributes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        create(params: Params$Resource$Projects$Locations$Attributes$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        /**
         * Delete an attribute. Note: System defined attributes cannot be deleted. All associations of the attribute being deleted with any API hub resource will also get deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Attributes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Attributes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Attributes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Attributes$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Attributes$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about the attribute.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Attributes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Attributes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Attribute>>;
        get(params: Params$Resource$Projects$Locations$Attributes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Attributes$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        get(params: Params$Resource$Projects$Locations$Attributes$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        /**
         * List all attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Attributes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Attributes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListAttributesResponse>>;
        list(params: Params$Resource$Projects$Locations$Attributes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Attributes$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListAttributesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListAttributesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Attributes$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListAttributesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListAttributesResponse>): void;
        /**
         * Update the attribute. The following fields in the Attribute resource can be updated: * display_name The display name can be updated for user defined attributes only. * description The description can be updated for user defined attributes only. * allowed_values To update the list of allowed values, clients need to use the fetched list of allowed values and add or remove values to or from the same list. The mutable allowed values can be updated for both user defined and System defined attributes. The immutable allowed values cannot be updated or deleted. The updated list of allowed values cannot be empty. If an allowed value that is already used by some resource's attribute is deleted, then the association between the resource and the attribute value will also be deleted. * cardinality The cardinality can be updated for user defined attributes only. Cardinality can only be increased during an update. The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Attributes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Attributes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Attribute>>;
        patch(params: Params$Resource$Projects$Locations$Attributes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Attributes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        patch(params: Params$Resource$Projects$Locations$Attributes$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Attribute>): void;
    }
    export interface Params$Resource$Projects$Locations$Attributes$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the attribute, which will become the final component of the attribute's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another attribute resource in the API hub. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        attributeId?: string;
        /**
         * Required. The parent resource for Attribute. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Attribute;
    }
    export interface Params$Resource$Projects$Locations$Attributes$Delete extends StandardParameters {
        /**
         * Required. The name of the attribute to delete. Format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Attributes$Get extends StandardParameters {
        /**
         * Required. The name of the attribute to retrieve. Format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Attributes$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of Attributes. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string or a boolean. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `Attribute` are eligible for filtering: * `display_name` - The display name of the Attribute. Allowed comparison operators: `=`. * `definition_type` - The definition type of the attribute. Allowed comparison operators: `=`. * `scope` - The scope of the attribute. Allowed comparison operators: `=`. * `data_type` - The type of the data of the attribute. Allowed comparison operators: `=`. * `mandatory` - Denotes whether the attribute is mandatory or not. Allowed comparison operators: `=`. * `create_time` - The time at which the Attribute was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `display_name = production` - - The display name of the attribute is _production_. * `(display_name = production) AND (create_time < \"2021-08-15T14:50:00Z\") AND (create_time \> \"2021-08-10T12:00:00Z\")` - The display name of the attribute is _production_ and the attribute was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `display_name = production OR scope = api` - The attribute where the display name is _production_ or the scope is _api_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of attribute resources to return. The service may return fewer than this value. If unspecified, at most 50 attributes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListAttributes` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAttributes` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource for Attribute. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Attributes$Patch extends StandardParameters {
        /**
         * Identifier. The name of the attribute in the API Hub. Format: `projects/{project\}/locations/{location\}/attributes/{attribute\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Attribute;
    }
    export class Resource$Projects$Locations$Curations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a curation resource in the API hub. Once a curation resource is created, plugin instances can start using it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Curations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Curations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Curation>>;
        create(params: Params$Resource$Projects$Locations$Curations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Curations$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        create(params: Params$Resource$Projects$Locations$Curations$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        /**
         * Delete a curation resource in the API hub. A curation can only be deleted if it's not being used by any plugin instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Curations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Curations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Curations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Curations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Curations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get curation resource details.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Curations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Curations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Curation>>;
        get(params: Params$Resource$Projects$Locations$Curations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Curations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        get(params: Params$Resource$Projects$Locations$Curations$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        /**
         * List curation resources in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Curations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Curations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListCurationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Curations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Curations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListCurationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListCurationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Curations$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListCurationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListCurationsResponse>): void;
        /**
         * Update a curation resource in the API hub. The following fields in the curation can be updated: * display_name * description The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Curations$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Curations$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Curation>>;
        patch(params: Params$Resource$Projects$Locations$Curations$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Curations$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        patch(params: Params$Resource$Projects$Locations$Curations$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Curation>): void;
    }
    export interface Params$Resource$Projects$Locations$Curations$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the curation resource, which will become the final component of the curations's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified ID is already used by another curation resource in the API hub. * If not provided, a system generated ID will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        curationId?: string;
        /**
         * Required. The parent resource for the curation resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Curation;
    }
    export interface Params$Resource$Projects$Locations$Curations$Delete extends StandardParameters {
        /**
         * Required. The name of the curation resource to delete. Format: `projects/{project\}/locations/{location\}/curations/{curation\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Curations$Get extends StandardParameters {
        /**
         * Required. The name of the curation resource to retrieve. Format: `projects/{project\}/locations/{location\}/curations/{curation\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Curations$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of curation resources. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>`, `:` or `=`. Filters are case insensitive. The following fields in the `curation resource` are eligible for filtering: * `create_time` - The time at which the curation was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `display_name` - The display name of the curation. Allowed comparison operators: `=`. * `state` - The state of the curation. Allowed comparison operators: `=`. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The curation resource was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of curation resources to return. The service may return fewer than this value. If unspecified, at most 50 curations will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListCurations` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListCurations` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of curation resources. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Curations$Patch extends StandardParameters {
        /**
         * Identifier. The name of the curation. Format: `projects/{project\}/locations/{location\}/curations/{curation\}`
         */
        name?: string;
        /**
         * Optional. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Curation;
    }
    export class Resource$Projects$Locations$Dependencies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a dependency between two entities in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Dependencies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Dependencies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Dependency>>;
        create(params: Params$Resource$Projects$Locations$Dependencies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Dependencies$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        create(params: Params$Resource$Projects$Locations$Dependencies$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        /**
         * Delete the dependency resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Dependencies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Dependencies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Dependencies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Dependencies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Dependencies$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about a dependency resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Dependencies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Dependencies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Dependency>>;
        get(params: Params$Resource$Projects$Locations$Dependencies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Dependencies$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        get(params: Params$Resource$Projects$Locations$Dependencies$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        /**
         * List dependencies based on the provided filter and pagination parameters.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Dependencies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Dependencies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListDependenciesResponse>>;
        list(params: Params$Resource$Projects$Locations$Dependencies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Dependencies$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListDependenciesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDependenciesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Dependencies$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDependenciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDependenciesResponse>): void;
        /**
         * Update a dependency based on the update_mask provided in the request. The following fields in the dependency can be updated: * description
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Dependencies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Dependencies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Dependency>>;
        patch(params: Params$Resource$Projects$Locations$Dependencies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Dependencies$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        patch(params: Params$Resource$Projects$Locations$Dependencies$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Dependency>): void;
    }
    export interface Params$Resource$Projects$Locations$Dependencies$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the dependency resource, which will become the final component of the dependency's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if duplicate id is provided by the client. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are `a-z[0-9]-_`.
         */
        dependencyId?: string;
        /**
         * Required. The parent resource for the dependency resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Dependency;
    }
    export interface Params$Resource$Projects$Locations$Dependencies$Delete extends StandardParameters {
        /**
         * Required. The name of the dependency resource to delete. Format: `projects/{project\}/locations/{location\}/dependencies/{dependency\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Dependencies$Get extends StandardParameters {
        /**
         * Required. The name of the dependency resource to retrieve. Format: `projects/{project\}/locations/{location\}/dependencies/{dependency\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Dependencies$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of Dependencies. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. Allowed comparison operator is `=`. Filters are not case sensitive. The following fields in the `Dependency` are eligible for filtering: * `consumer.operation_resource_name` - The operation resource name for the consumer entity involved in a dependency. Allowed comparison operators: `=`. * `consumer.external_api_resource_name` - The external api resource name for the consumer entity involved in a dependency. Allowed comparison operators: `=`. * `supplier.operation_resource_name` - The operation resource name for the supplier entity involved in a dependency. Allowed comparison operators: `=`. * `supplier.external_api_resource_name` - The external api resource name for the supplier entity involved in a dependency. Allowed comparison operators: `=`. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. For example, `consumer.operation_resource_name = \"projects/p1/locations/global/apis/a1/versions/v1/operations/o1\" OR supplier.operation_resource_name = \"projects/p1/locations/global/apis/a1/versions/v1/operations/o1\"` - The dependencies with either consumer or supplier operation resource name as _projects/p1/locations/global/apis/a1/versions/v1/operations/o1_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of dependency resources to return. The service may return fewer than this value. If unspecified, at most 50 dependencies will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListDependencies` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDependencies` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent which owns this collection of dependency resources. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Dependencies$Patch extends StandardParameters {
        /**
         * Identifier. The name of the dependency in the API Hub. Format: `projects/{project\}/locations/{location\}/dependencies/{dependency\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Dependency;
    }
    export class Resource$Projects$Locations$Deployments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a deployment resource in the API hub. Once a deployment resource is created, it can be associated with API versions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Deployments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Deployments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Deployment>>;
        create(params: Params$Resource$Projects$Locations$Deployments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Deployments$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        create(params: Params$Resource$Projects$Locations$Deployments$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        /**
         * Delete a deployment resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Deployments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Deployments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Deployments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Deployments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Deployments$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about a deployment and the API versions linked to it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Deployments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Deployments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Deployment>>;
        get(params: Params$Resource$Projects$Locations$Deployments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Deployments$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        get(params: Params$Resource$Projects$Locations$Deployments$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        /**
         * List deployment resources in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Deployments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Deployments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListDeploymentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Deployments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Deployments$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListDeploymentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDeploymentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Deployments$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDeploymentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListDeploymentsResponse>): void;
        /**
         * Update a deployment resource in the API hub. The following fields in the deployment resource can be updated: * display_name * description * documentation * deployment_type * resource_uri * endpoints * slo * environment * attributes The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Deployments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Deployments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Deployment>>;
        patch(params: Params$Resource$Projects$Locations$Deployments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Deployments$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        patch(params: Params$Resource$Projects$Locations$Deployments$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Deployment>): void;
    }
    export interface Params$Resource$Projects$Locations$Deployments$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the deployment resource, which will become the final component of the deployment's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another deployment resource in the API hub. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        deploymentId?: string;
        /**
         * Required. The parent resource for the deployment resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Deployment;
    }
    export interface Params$Resource$Projects$Locations$Deployments$Delete extends StandardParameters {
        /**
         * Required. The name of the deployment resource to delete. Format: `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Deployments$Get extends StandardParameters {
        /**
         * Required. The name of the deployment resource to retrieve. Format: `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Deployments$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of Deployments. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `Deployments` are eligible for filtering: * `display_name` - The display name of the Deployment. Allowed comparison operators: `=`. * `create_time` - The time at which the Deployment was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. Allowed comparison operators: `\>` and `<`. * `resource_uri` - A URI to the deployment resource. Allowed comparison operators: `=`. * `api_versions` - The API versions linked to this deployment. Allowed comparison operators: `:`. * `deployment_type.enum_values.values.id` - The allowed value id of the deployment_type attribute associated with the Deployment. Allowed comparison operators: `:`. * `deployment_type.enum_values.values.display_name` - The allowed value display name of the deployment_type attribute associated with the Deployment. Allowed comparison operators: `:`. * `slo.string_values.values` -The allowed string value of the slo attribute associated with the deployment. Allowed comparison operators: `:`. * `environment.enum_values.values.id` - The allowed value id of the environment attribute associated with the deployment. Allowed comparison operators: `:`. * `environment.enum_values.values.display_name` - The allowed value display name of the environment attribute associated with the deployment. Allowed comparison operators: `:`. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.id` - The allowed value id of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-id is a placeholder that can be replaced with any user defined enum attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.enum_values.values.display_name` - The allowed value display name of the user defined enum attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-enum-display-name is a placeholder that can be replaced with any user defined enum attribute enum name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.string_values.values` - The allowed value of the user defined string attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-string is a placeholder that can be replaced with any user defined string attribute name. * `attributes.projects/test-project-id/locations/test-location-id/ attributes/user-defined-attribute-id.json_values.values` - The allowed value of the user defined JSON attribute associated with the Resource. Allowed comparison operator is `:`. Here user-defined-attribute-json is a placeholder that can be replaced with any user defined JSON attribute name. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `environment.enum_values.values.id: staging-id` - The allowed value id of the environment attribute associated with the Deployment is _staging-id_. * `environment.enum_values.values.display_name: \"Staging Deployment\"` - The allowed value display name of the environment attribute associated with the Deployment is `Staging Deployment`. * `environment.enum_values.values.id: production-id AND create_time < \"2021-08-15T14:50:00Z\" AND create_time \> \"2021-08-10T12:00:00Z\"` - The allowed value id of the environment attribute associated with the Deployment is _production-id_ and Deployment was created before _2021-08-15 14:50:00 UTC_ and after _2021-08-10 12:00:00 UTC_. * `environment.enum_values.values.id: production-id OR slo.string_values.values: \"99.99%\"` - The allowed value id of the environment attribute Deployment is _production-id_ or string value of the slo attribute is _99.99%_. * `environment.enum_values.values.id: staging-id AND attributes.projects/test-project-id/locations/test-location-id/ attributes/17650f90-4a29-4971-b3c0-d5532da3764b.string_values.values: test` - The filter string specifies that the allowed value id of the environment attribute associated with the Deployment is _staging-id_ and the value of the user defined attribute of type string is _test_.
         */
        filter?: string;
        /**
         * Optional. The maximum number of deployment resources to return. The service may return fewer than this value. If unspecified, at most 50 deployments will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListDeployments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListDeployments` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of deployment resources. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Deployments$Patch extends StandardParameters {
        /**
         * Identifier. The name of the deployment. Format: `projects/{project\}/locations/{location\}/deployments/{deployment\}`
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Deployment;
    }
    export class Resource$Projects$Locations$Externalapis {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an External API resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Externalapis$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Externalapis$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ExternalApi>>;
        create(params: Params$Resource$Projects$Locations$Externalapis$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Externalapis$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        create(params: Params$Resource$Projects$Locations$Externalapis$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        /**
         * Delete an External API resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Externalapis$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Externalapis$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Externalapis$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Externalapis$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Externalapis$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get details about an External API resource in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Externalapis$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Externalapis$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ExternalApi>>;
        get(params: Params$Resource$Projects$Locations$Externalapis$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Externalapis$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        get(params: Params$Resource$Projects$Locations$Externalapis$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        /**
         * List External API resources in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Externalapis$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Externalapis$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListExternalApisResponse>>;
        list(params: Params$Resource$Projects$Locations$Externalapis$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Externalapis$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListExternalApisResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListExternalApisResponse>): void;
        list(params: Params$Resource$Projects$Locations$Externalapis$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListExternalApisResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListExternalApisResponse>): void;
        /**
         * Update an External API resource in the API hub. The following fields can be updated: * display_name * description * documentation * endpoints * paths The update_mask should be used to specify the fields being updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Externalapis$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Externalapis$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ExternalApi>>;
        patch(params: Params$Resource$Projects$Locations$Externalapis$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Externalapis$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        patch(params: Params$Resource$Projects$Locations$Externalapis$Patch, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ExternalApi>): void;
    }
    export interface Params$Resource$Projects$Locations$Externalapis$Create extends StandardParameters {
        /**
         * Optional. The ID to use for the External API resource, which will become the final component of the External API's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another External API resource in the API hub. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        externalApiId?: string;
        /**
         * Required. The parent resource for the External API resource. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ExternalApi;
    }
    export interface Params$Resource$Projects$Locations$Externalapis$Delete extends StandardParameters {
        /**
         * Required. The name of the External API resource to delete. Format: `projects/{project\}/locations/{location\}/externalApis/{externalApi\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Externalapis$Get extends StandardParameters {
        /**
         * Required. The name of the External API resource to retrieve. Format: `projects/{project\}/locations/{location\}/externalApis/{externalApi\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Externalapis$List extends StandardParameters {
        /**
         * Optional. The maximum number of External API resources to return. The service may return fewer than this value. If unspecified, at most 50 ExternalApis will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListExternalApis` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListExternalApis` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of External API resources. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Externalapis$Patch extends StandardParameters {
        /**
         * Identifier. Format: `projects/{project\}/locations/{location\}/externalApi/{externalApi\}`.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ExternalApi;
    }
    export class Resource$Projects$Locations$Hostprojectregistrations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a host project registration. A Google cloud project can be registered as a host project if it is not attached as a runtime project to another host project. A project can be registered as a host project only once. Subsequent register calls for the same project will fail.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Hostprojectregistrations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1HostProjectRegistration>>;
        create(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        create(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        /**
         * Get a host project registration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Hostprojectregistrations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1HostProjectRegistration>>;
        get(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        get(params: Params$Resource$Projects$Locations$Hostprojectregistrations$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1HostProjectRegistration>): void;
        /**
         * Lists host project registrations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Hostprojectregistrations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Hostprojectregistrations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Hostprojectregistrations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Hostprojectregistrations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Hostprojectregistrations$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListHostProjectRegistrationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Hostprojectregistrations$Create extends StandardParameters {
        /**
         * Required. The ID to use for the Host Project Registration, which will become the final component of the host project registration's resource name. The ID must be the same as the Google cloud project specified in the host_project_registration.gcp_project field.
         */
        hostProjectRegistrationId?: string;
        /**
         * Required. The parent resource for the host project. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1HostProjectRegistration;
    }
    export interface Params$Resource$Projects$Locations$Hostprojectregistrations$Get extends StandardParameters {
        /**
         * Required. Host project registration resource name. projects/{project\}/locations/{location\}/hostProjectRegistrations/{host_project_registration_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Hostprojectregistrations$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of HostProjectRegistrations. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. All standard operators as documented at https://google.aip.dev/160 are supported. The following fields in the `HostProjectRegistration` are eligible for filtering: * `name` - The name of the HostProjectRegistration. * `create_time` - The time at which the HostProjectRegistration was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. * `gcp_project` - The Google cloud project associated with the HostProjectRegistration.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of host project registrations to return. The service may return fewer than this value. If unspecified, at most 50 host project registrations will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListHostProjectRegistrations` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListHostProjectRegistrations` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of host projects. Format: `projects/x/locations/x`
         */
        parent?: string;
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
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleLongrunningCancelOperationRequest;
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
    export class Resource$Projects$Locations$Plugins {
        context: APIRequestContext;
        instances: Resource$Projects$Locations$Plugins$Instances;
        styleGuide: Resource$Projects$Locations$Plugins$Styleguide;
        constructor(context: APIRequestContext);
        /**
         * Create an API Hub plugin resource in the API hub. Once a plugin is created, it can be used to create plugin instances.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Plugins$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Plugins$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Plugin>>;
        create(params: Params$Resource$Projects$Locations$Plugins$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Plugins$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        create(params: Params$Resource$Projects$Locations$Plugins$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        /**
         * Delete a Plugin in API hub. Note, only user owned plugins can be deleted via this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Plugins$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Plugins$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Plugins$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Plugins$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Plugins$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Disables a plugin. The `state` of the plugin after disabling is `DISABLED`
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        disable(params: Params$Resource$Projects$Locations$Plugins$Disable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        disable(params?: Params$Resource$Projects$Locations$Plugins$Disable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Plugin>>;
        disable(params: Params$Resource$Projects$Locations$Plugins$Disable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        disable(params: Params$Resource$Projects$Locations$Plugins$Disable, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        disable(params: Params$Resource$Projects$Locations$Plugins$Disable, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        disable(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        /**
         * Enables a plugin. The `state` of the plugin after enabling is `ENABLED`
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enable(params: Params$Resource$Projects$Locations$Plugins$Enable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enable(params?: Params$Resource$Projects$Locations$Plugins$Enable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Plugin>>;
        enable(params: Params$Resource$Projects$Locations$Plugins$Enable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enable(params: Params$Resource$Projects$Locations$Plugins$Enable, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        enable(params: Params$Resource$Projects$Locations$Plugins$Enable, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        enable(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        /**
         * Get an API Hub plugin.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Plugins$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Plugins$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1Plugin>>;
        get(params: Params$Resource$Projects$Locations$Plugins$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Plugins$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        get(params: Params$Resource$Projects$Locations$Plugins$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1Plugin>): void;
        /**
         * Get the style guide being used for linting.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Getstyleguide, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getStyleGuide(params?: Params$Resource$Projects$Locations$Plugins$Getstyleguide, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1StyleGuide>>;
        getStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Getstyleguide, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Getstyleguide, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
        getStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Getstyleguide, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
        getStyleGuide(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
        /**
         * List all the plugins in a given project and location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Plugins$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Plugins$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListPluginsResponse>>;
        list(params: Params$Resource$Projects$Locations$Plugins$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Plugins$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Plugins$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginsResponse>): void;
        /**
         * Update the styleGuide to be used for liniting in by API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Updatestyleguide, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateStyleGuide(params?: Params$Resource$Projects$Locations$Plugins$Updatestyleguide, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1StyleGuide>>;
        updateStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Updatestyleguide, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Updatestyleguide, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
        updateStyleGuide(params: Params$Resource$Projects$Locations$Plugins$Updatestyleguide, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
        updateStyleGuide(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuide>): void;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Create extends StandardParameters {
        /**
         * Required. The parent resource where this plugin will be created. Format: `projects/{project\}/locations/{location\}`.
         */
        parent?: string;
        /**
         * Optional. The ID to use for the Plugin resource, which will become the final component of the Plugin's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another Plugin resource in the API hub instance. * If not provided, a system generated id will be used. This value should be 4-500 characters, overall resource name which will be of format `projects/{project\}/locations/{location\}/plugins/{plugin\}`, its length is limited to 1000 characters and valid characters are /a-z[0-9]-_/.
         */
        pluginId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1Plugin;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Delete extends StandardParameters {
        /**
         * Required. The name of the Plugin resource to delete. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Disable extends StandardParameters {
        /**
         * Required. The name of the plugin to disable. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1DisablePluginRequest;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Enable extends StandardParameters {
        /**
         * Required. The name of the plugin to enable. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1EnablePluginRequest;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Get extends StandardParameters {
        /**
         * Required. The name of the plugin to retrieve. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Getstyleguide extends StandardParameters {
        /**
         * Required. The name of the spec to retrieve. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/styleGuide`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of plugins. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `Plugins` are eligible for filtering: * `plugin_category` - The category of the Plugin. Allowed comparison operators: `=`. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `plugin_category = ON_RAMP` - The plugin is of category on ramp.
         */
        filter?: string;
        /**
         * Optional. The maximum number of hub plugins to return. The service may return fewer than this value. If unspecified, at most 50 hub plugins will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListPlugins` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListPlugins` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource where this plugin will be created. Format: `projects/{project\}/locations/{location\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Updatestyleguide extends StandardParameters {
        /**
         * Identifier. The name of the style guide. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/styleGuide`
         */
        name?: string;
        /**
         * Optional. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1StyleGuide;
    }
    export class Resource$Projects$Locations$Plugins$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Plugin instance in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Plugins$Instances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Plugins$Instances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Plugins$Instances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Plugins$Instances$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Plugins$Instances$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes a plugin instance in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Plugins$Instances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Plugins$Instances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        delete(params: Params$Resource$Projects$Locations$Plugins$Instances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Plugins$Instances$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(params: Params$Resource$Projects$Locations$Plugins$Instances$Delete, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Disables a plugin instance in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        disableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Disableaction, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        disableAction(params?: Params$Resource$Projects$Locations$Plugins$Instances$Disableaction, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        disableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Disableaction, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        disableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Disableaction, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        disableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Disableaction, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        disableAction(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Enables a plugin instance in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Enableaction, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enableAction(params?: Params$Resource$Projects$Locations$Plugins$Instances$Enableaction, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        enableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Enableaction, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Enableaction, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        enableAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Enableaction, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        enableAction(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Executes a plugin instance in the API hub.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        executeAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Executeaction, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        executeAction(params?: Params$Resource$Projects$Locations$Plugins$Instances$Executeaction, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        executeAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Executeaction, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        executeAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Executeaction, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        executeAction(params: Params$Resource$Projects$Locations$Plugins$Instances$Executeaction, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        executeAction(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Get an API Hub plugin instance.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Plugins$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Plugins$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1PluginInstance>>;
        get(params: Params$Resource$Projects$Locations$Plugins$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Plugins$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1PluginInstance>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1PluginInstance>): void;
        get(params: Params$Resource$Projects$Locations$Plugins$Instances$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1PluginInstance>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1PluginInstance>): void;
        /**
         * List all the plugins in a given project and location. `-` can be used as wildcard value for {plugin_id\}
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Plugins$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Plugins$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListPluginInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Plugins$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Plugins$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginInstancesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Plugins$Instances$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListPluginInstancesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Create extends StandardParameters {
        /**
         * Required. The parent of the plugin instance resource. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`
         */
        parent?: string;
        /**
         * Optional. The ID to use for the plugin instance, which will become the final component of the plugin instance's resource name. This field is optional. * If provided, the same will be used. The service will throw an error if the specified id is already used by another plugin instance in the plugin resource. * If not provided, a system generated id will be used. This value should be 4-500 characters, and valid characters are /a-z[0-9]-_/.
         */
        pluginInstanceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1PluginInstance;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Delete extends StandardParameters {
        /**
         * Required. The name of the plugin instance to delete. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Disableaction extends StandardParameters {
        /**
         * Required. The name of the plugin instance to disable. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1DisablePluginInstanceActionRequest;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Enableaction extends StandardParameters {
        /**
         * Required. The name of the plugin instance to enable. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1EnablePluginInstanceActionRequest;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Executeaction extends StandardParameters {
        /**
         * Required. The name of the plugin instance to execute. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1ExecutePluginInstanceActionRequest;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$Get extends StandardParameters {
        /**
         * Required. The name of the plugin instance to retrieve. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}/instances/{instance\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Instances$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of plugin instances. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. The comparison operator must be one of: `<`, `\>` or `=`. Filters are not case sensitive. The following fields in the `PluginInstances` are eligible for filtering: * `state` - The state of the Plugin Instance. Allowed comparison operators: `=`. Expressions are combined with either `AND` logic operator or `OR` logical operator but not both of them together i.e. only one of the `AND` or `OR` operator can be used throughout the filter string and both the operators cannot be used together. No other logical operators are supported. At most three filter fields are allowed in the filter string and if provided more than that then `INVALID_ARGUMENT` error is returned by the API. Here are a few examples: * `state = ENABLED` - The plugin instance is in enabled state.
         */
        filter?: string;
        /**
         * Optional. The maximum number of hub plugins to return. The service may return fewer than this value. If unspecified, at most 50 hub plugins will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListPluginInstances` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListPluginInstances` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource where this plugin will be created. Format: `projects/{project\}/locations/{location\}/plugins/{plugin\}`. To list plugin instances for multiple plugins, use the - character instead of the plugin ID.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Plugins$Styleguide {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get the contents of the style guide.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getContents(params: Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getContents(params?: Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1StyleGuideContents>>;
        getContents(params: Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getContents(params: Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuideContents>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuideContents>): void;
        getContents(params: Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuideContents>): void;
        getContents(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1StyleGuideContents>): void;
    }
    export interface Params$Resource$Projects$Locations$Plugins$Styleguide$Getcontents extends StandardParameters {
        /**
         * Required. The name of the StyleGuide whose contents need to be retrieved. There is exactly one style guide resource per project per location. The expected format is `projects/{project\}/locations/{location\}/plugins/{plugin\}/styleGuide`.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Runtimeprojectattachments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Attaches a runtime project to the host project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Runtimeprojectattachments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>>;
        create(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        create(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Create, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        /**
         * Delete a runtime project attachment in the API Hub. This call will detach the runtime project from the host project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a runtime project attachment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Runtimeprojectattachments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>>;
        get(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        get(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$Get, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1RuntimeProjectAttachment>): void;
        /**
         * List runtime projects attached to the host project.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Runtimeprojectattachments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Runtimeprojectattachments$List, callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudApihubV1ListRuntimeProjectAttachmentsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Runtimeprojectattachments$Create extends StandardParameters {
        /**
         * Required. The parent resource for the Runtime Project Attachment. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Required. The ID to use for the Runtime Project Attachment, which will become the final component of the Runtime Project Attachment's name. The ID must be the same as the project ID of the Google cloud project specified in the runtime_project_attachment.runtime_project field.
         */
        runtimeProjectAttachmentId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudApihubV1RuntimeProjectAttachment;
    }
    export interface Params$Resource$Projects$Locations$Runtimeprojectattachments$Delete extends StandardParameters {
        /**
         * Required. The name of the Runtime Project Attachment to delete. Format: `projects/{project\}/locations/{location\}/runtimeProjectAttachments/{runtime_project_attachment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Runtimeprojectattachments$Get extends StandardParameters {
        /**
         * Required. The name of the API resource to retrieve. Format: `projects/{project\}/locations/{location\}/runtimeProjectAttachments/{runtime_project_attachment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Runtimeprojectattachments$List extends StandardParameters {
        /**
         * Optional. An expression that filters the list of RuntimeProjectAttachments. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string. All standard operators as documented at https://google.aip.dev/160 are supported. The following fields in the `RuntimeProjectAttachment` are eligible for filtering: * `name` - The name of the RuntimeProjectAttachment. * `create_time` - The time at which the RuntimeProjectAttachment was created. The value should be in the (RFC3339)[https://tools.ietf.org/html/rfc3339] format. * `runtime_project` - The Google cloud project associated with the RuntimeProjectAttachment.
         */
        filter?: string;
        /**
         * Optional. Hint for how to order the results.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of runtime project attachments to return. The service may return fewer than this value. If unspecified, at most 50 runtime project attachments will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListRuntimeProjectAttachments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters (except page_size) provided to `ListRuntimeProjectAttachments` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of runtime project attachments. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export {};
}
