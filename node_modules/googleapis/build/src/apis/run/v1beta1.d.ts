import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace run_v1beta1 {
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
     * Cloud Run Admin API
     *
     * Deploy and manage user provided container images that scale automatically based on HTTP traffic.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const run = google.run('v1beta1');
     * ```
     */
    export class Run {
        context: APIRequestContext;
        customresourcedefinitions: Resource$Customresourcedefinitions;
        namespaces: Resource$Namespaces;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * CustomResourceColumnDefinition specifies a column for server side printing.
     */
    export interface Schema$CustomResourceColumnDefinition {
        /**
         * description is a human readable description of this column. +optional
         */
        description?: string | null;
        /**
         * format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for more. +optional
         */
        format?: string | null;
        /**
         * JSONPath is a simple JSON path, i.e. with array notation.
         */
        jsonPath?: string | null;
        /**
         * name is a human readable name for the column.
         */
        name?: string | null;
        /**
         * priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a higher priority. +optional
         */
        priority?: number | null;
        /**
         * type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for more.
         */
        type?: string | null;
    }
    /**
     * CustomResourceDefinition represents a resource that should be exposed on the API server. Its name MUST be in the format <.spec.name\>.<.spec.group\>.
     */
    export interface Schema$CustomResourceDefinition {
        /**
         * The API version for this call such as "k8s.apiextensions.io/v1beta1".
         */
        apiVersion?: string | null;
        /**
         * The kind of resource, in this case always "CustomResourceDefinition".
         */
        kind?: string | null;
        /**
         * Metadata associated with this CustomResourceDefinition.
         */
        metadata?: Schema$ObjectMeta;
        /**
         * Spec describes how the user wants the resources to appear
         */
        spec?: Schema$CustomResourceDefinitionSpec;
    }
    /**
     * CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition
     */
    export interface Schema$CustomResourceDefinitionNames {
        /**
         * Categories is a list of grouped resources custom resources belong to (e.g. 'all') +optional
         */
        categories?: string[] | null;
        /**
         * Kind is the serialized kind of the resource. It is normally CamelCase and singular.
         */
        kind?: string | null;
        /**
         * ListKind is the serialized kind of the list for this resource. Defaults to List. +optional
         */
        listKind?: string | null;
        /**
         * Plural is the plural name of the resource to serve. It must match the name of the CustomResourceDefinition-registration too: plural.group and it must be all lowercase.
         */
        plural?: string | null;
        /**
         * ShortNames are short names for the resource. It must be all lowercase. +optional
         */
        shortNames?: string[] | null;
        /**
         * Singular is the singular name of the resource. It must be all lowercase Defaults to lowercased +optional
         */
        singular?: string | null;
    }
    /**
     * CustomResourceDefinitionSpec describes how a user wants their resource to appear
     */
    export interface Schema$CustomResourceDefinitionSpec {
        /**
         * AdditionalPrinterColumns are additional columns shown e.g. in kubectl next to the name. Defaults to a created-at column. +optional
         */
        additionalPrinterColumns?: Schema$CustomResourceColumnDefinition[];
        /**
         * Group is the group this resource belongs in
         */
        group?: string | null;
        /**
         * Names are the names used to describe this custom resource
         */
        names?: Schema$CustomResourceDefinitionNames;
        /**
         * Scope indicates whether this resource is cluster or namespace scoped. Default is namespaced
         */
        scope?: string | null;
        /**
         * Subresources describes the subresources for CustomResources +optional
         */
        subresources?: Schema$CustomResourceSubresources;
        /**
         * Validation describes the validation methods for CustomResources +optional
         */
        validation?: Schema$CustomResourceValidation;
        /**
         * Version is the version this resource belongs in Should be always first item in Versions field if provided. Optional, but at least one of Version or Versions must be set. Deprecated: Please use `Versions`. +optional
         */
        version?: string | null;
        /**
         * Versions is the list of all supported versions for this resource. If Version field is provided, this field is optional. Validation: All versions must use the same validation schema for now. i.e., top level Validation field is applied to all of these versions. Order: The version name will be used to compute the order. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA \> beta \> alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10. +optional
         */
        versions?: Schema$CustomResourceDefinitionVersion[];
    }
    export interface Schema$CustomResourceDefinitionVersion {
        /**
         * Name is the version name, e.g. “v1”, “v2beta1”, etc.
         */
        name?: string | null;
        /**
         * Served is a flag enabling/disabling this version from being served via REST APIs
         */
        served?: boolean | null;
        /**
         * Storage flags the version as storage version. There must be exactly one flagged as storage version.
         */
        storage?: boolean | null;
    }
    /**
     * CustomResourceSubresources defines the status and scale subresources for CustomResources.
     */
    export interface Schema$CustomResourceSubresources {
        /**
         * Scale denotes the scale subresource for CustomResources +optional
         */
        scale?: Schema$CustomResourceSubresourceScale;
        /**
         * Status denotes the status subresource for CustomResources +optional
         */
        status?: Schema$CustomResourceSubresourceStatus;
    }
    /**
     * CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources.
     */
    export interface Schema$CustomResourceSubresourceScale {
        /**
         * LabelSelectorPath defines the JSON path inside of a CustomResource that corresponds to Scale.Status.Selector. Only JSON paths without the array notation are allowed. Must be a JSON Path under .status. Must be set to work with HPA. If there is no value under the given path in the CustomResource, the status label selector value in the /scale subresource will default to the empty string. +optional
         */
        labelSelectorPath?: string | null;
        /**
         * SpecReplicasPath defines the JSON path inside of a CustomResource that corresponds to Scale.Spec.Replicas. Only JSON paths without the array notation are allowed. Must be a JSON Path under .spec. If there is no value under the given path in the CustomResource, the /scale subresource will return an error on GET.
         */
        specReplicasPath?: string | null;
        /**
         * StatusReplicasPath defines the JSON path inside of a CustomResource that corresponds to Scale.Status.Replicas. Only JSON paths without the array notation are allowed. Must be a JSON Path under .status. If there is no value under the given path in the CustomResource, the status replica value in the /scale subresource will default to 0.
         */
        statusReplicasPath?: string | null;
    }
    /**
     * CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza
     */
    export interface Schema$CustomResourceSubresourceStatus {
    }
    /**
     * CustomResourceValidation is a list of validation methods for CustomResources.
     */
    export interface Schema$CustomResourceValidation {
        /**
         * OpenAPIV3Schema is the OpenAPI v3 schema to be validated against. +optional
         */
        openAPIV3Schema?: Schema$JSONSchemaProps;
    }
    /**
     * ExternalDocumentation allows referencing an external resource for extended documentation.
     */
    export interface Schema$ExternalDocumentation {
        description?: string | null;
        url?: string | null;
    }
    /**
     * JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{\}, map[string]interface{\} and nil.
     */
    export interface Schema$JSON {
        raw?: string | null;
    }
    /**
     * JSONSchemaProps is a JSON-Schema following Specification Draft 4 (http://json-schema.org/).
     */
    export interface Schema$JSONSchemaProps {
        additionalItems?: Schema$JSONSchemaPropsOrBool;
        additionalProperties?: Schema$JSONSchemaPropsOrBool;
        allOf?: Schema$JSONSchemaProps[];
        anyOf?: Schema$JSONSchemaProps[];
        default?: Schema$JSON;
        definitions?: {
            [key: string]: Schema$JSONSchemaProps;
        } | null;
        dependencies?: {
            [key: string]: Schema$JSONSchemaPropsOrStringArray;
        } | null;
        description?: string | null;
        enum?: string[] | null;
        example?: Schema$JSON;
        exclusiveMaximum?: boolean | null;
        exclusiveMinimum?: boolean | null;
        externalDocs?: Schema$ExternalDocumentation;
        format?: string | null;
        id?: string | null;
        items?: Schema$JSONSchemaPropsOrArray;
        maximum?: number | null;
        maxItems?: string | null;
        maxLength?: string | null;
        maxProperties?: string | null;
        minimum?: number | null;
        minItems?: string | null;
        minLength?: string | null;
        minProperties?: string | null;
        multipleOf?: number | null;
        not?: Schema$JSONSchemaProps;
        oneOf?: Schema$JSONSchemaProps[];
        pattern?: string | null;
        patternProperties?: {
            [key: string]: Schema$JSONSchemaProps;
        } | null;
        properties?: {
            [key: string]: Schema$JSONSchemaProps;
        } | null;
        ref?: string | null;
        required?: string[] | null;
        schema?: string | null;
        title?: string | null;
        type?: string | null;
        uniqueItems?: boolean | null;
    }
    /**
     * JSONSchemaPropsOrArray represents a value that can either be a JSONSchemaProps or an array of JSONSchemaProps. Mainly here for serialization purposes.
     */
    export interface Schema$JSONSchemaPropsOrArray {
        jsonSchemas?: Schema$JSONSchemaProps[];
        schema?: Schema$JSONSchemaProps;
    }
    /**
     * JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.
     */
    export interface Schema$JSONSchemaPropsOrBool {
        allows?: boolean | null;
        schema?: Schema$JSONSchemaProps;
    }
    /**
     * JSONSchemaPropsOrStringArray represents a JSONSchemaProps or a string array.
     */
    export interface Schema$JSONSchemaPropsOrStringArray {
        property?: string[] | null;
        schema?: Schema$JSONSchemaProps;
    }
    export interface Schema$ListCustomResourceDefinitionsResponse {
        /**
         * The API version for this call such as "k8s.apiextensions.io/v1beta1".
         */
        apiVersion?: string | null;
        /**
         * List of CustomResourceDefinitions.
         */
        items?: Schema$CustomResourceDefinition[];
        /**
         * The kind of this resource, in this case "CustomResourceDefinitionList".
         */
        kind?: string | null;
        /**
         * Metadata associated with this CustomResourceDefinition list.
         */
        metadata?: Schema$ListMeta;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta\}.
     */
    export interface Schema$ListMeta {
        /**
         * continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response.
         */
        continue?: string | null;
        /**
         * String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#concurrency-control-and-consistency +optional
         */
        resourceVersion?: string | null;
        /**
         * SelfLink is a URL representing this object. Populated by the system. Read-only. +optional
         */
        selfLink?: string | null;
    }
    /**
     * k8s.io.apimachinery.pkg.apis.meta.v1.ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
     */
    export interface Schema$ObjectMeta {
        /**
         * (Optional) Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported The name of the cluster which the object belongs to. This is used to distinguish resources with same name and namespace in different clusters. This field is not set anywhere right now and apiserver is going to ignore it if set in create or update request.
         */
        clusterName?: string | null;
        /**
         * (Optional) CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC. Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
         */
        creationTimestamp?: string | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
         */
        deletionGracePeriodSeconds?: number | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested. Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
         */
        deletionTimestamp?: string | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. +patchStrategy=merge
         */
        finalizers?: string[] | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server. If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header). Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#idempotency string generateName = 2;
         */
        generateName?: string | null;
        /**
         * (Optional) A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
         */
        generation?: number | null;
        /**
         * (Optional) Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and routes. More info: http://kubernetes.io/docs/user-guide/labels
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Name must be unique within a namespace, within a Cloud Run region. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names +optional
         */
        name?: string | null;
        /**
         * Namespace defines the space within each name must be unique, within a Cloud Run region. In Cloud Run the namespace must be equal to either the project ID or project number.
         */
        namespace?: string | null;
        /**
         * (Optional) Cloud Run fully managed: not supported Cloud Run for Anthos: supported List of objects that own this object. If ALL objects in the list have been deleted, this object will be garbage collected.
         */
        ownerReferences?: Schema$OwnerReference[];
        /**
         * (Optional) An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources. Populated by the system. Read-only. Value must be treated as opaque by clients. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
         */
        resourceVersion?: string | null;
        /**
         * (Optional) SelfLink is a URL representing this object. Populated by the system. Read-only. string selfLink = 4;
         */
        selfLink?: string | null;
        /**
         * (Optional) UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations. Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/identifiers#uids
         */
        uid?: string | null;
    }
    /**
     * OwnerReference contains enough information to let you identify an owning object. Currently, an owning object must be in the same namespace, so there is no namespace field.
     */
    export interface Schema$OwnerReference {
        /**
         * API version of the referent.
         */
        apiVersion?: string | null;
        /**
         * If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned. +optional
         */
        blockOwnerDeletion?: boolean | null;
        /**
         * If true, this reference points to the managing controller. +optional
         */
        controller?: boolean | null;
        /**
         * Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
         */
        kind?: string | null;
        /**
         * Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names
         */
        name?: string | null;
        /**
         * UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids
         */
        uid?: string | null;
    }
    export class Resource$Customresourcedefinitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Rpc to list custom resource definitions.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1beta1');
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
         *   const res = await run.customresourcedefinitions.list({
         *     // Optional encoded string to continue paging.
         *     continue: 'placeholder-value',
         *     // Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         *     fieldSelector: 'placeholder-value',
         *     // Not currently used by Cloud Run.
         *     includeUninitialized: 'placeholder-value',
         *     // Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         *     labelSelector: 'placeholder-value',
         *
         *     limit: 'placeholder-value',
         *     // The project ID or project number from which the storages should be listed.
         *     parent: 'placeholder-value',
         *     // The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         *     resourceVersion: 'placeholder-value',
         *     // Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         *     watch: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "unreachable": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Customresourcedefinitions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Customresourcedefinitions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCustomResourceDefinitionsResponse>>;
        list(params: Params$Resource$Customresourcedefinitions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Customresourcedefinitions$List, options: MethodOptions | BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>, callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
        list(params: Params$Resource$Customresourcedefinitions$List, callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
    }
    export interface Params$Resource$Customresourcedefinitions$List extends StandardParameters {
        /**
         * Optional encoded string to continue paging.
         */
        continue?: string;
        /**
         * Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         */
        fieldSelector?: string;
        /**
         * Not currently used by Cloud Run.
         */
        includeUninitialized?: boolean;
        /**
         * Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         */
        labelSelector?: string;
        /**
         *
         */
        limit?: number;
        /**
         * The project ID or project number from which the storages should be listed.
         */
        parent?: string;
        /**
         * The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         */
        resourceVersion?: string;
        /**
         * Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         */
        watch?: boolean;
    }
    export class Resource$Namespaces {
        context: APIRequestContext;
        customresourcedefinitions: Resource$Namespaces$Customresourcedefinitions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Namespaces$Customresourcedefinitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Rpc to get information about a CustomResourceDefinition.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1beta1');
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
         *   const res = await run.namespaces.customresourcedefinitions.get({
         *     // The name of the CustomResourceDefinition being retrieved. If needed, replace {namespace_id\} with the project ID.
         *     name: 'namespaces/my-namespace/customresourcedefinitions/my-customresourcedefinition',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "spec": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Namespaces$Customresourcedefinitions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Namespaces$Customresourcedefinitions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomResourceDefinition>>;
        get(params: Params$Resource$Namespaces$Customresourcedefinitions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Namespaces$Customresourcedefinitions$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomResourceDefinition>, callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
        get(params: Params$Resource$Namespaces$Customresourcedefinitions$Get, callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
        get(callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
    }
    export interface Params$Resource$Namespaces$Customresourcedefinitions$Get extends StandardParameters {
        /**
         * The name of the CustomResourceDefinition being retrieved. If needed, replace {namespace_id\} with the project ID.
         */
        name?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        customresourcedefinitions: Resource$Projects$Locations$Customresourcedefinitions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Customresourcedefinitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Rpc to get information about a CustomResourceDefinition.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1beta1');
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
         *   const res = await run.projects.locations.customresourcedefinitions.get({
         *     // The name of the CustomResourceDefinition being retrieved. If needed, replace {namespace_id\} with the project ID.
         *     name: 'projects/my-project/locations/my-location/customresourcedefinitions/my-customresourcedefinition',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "spec": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Customresourcedefinitions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Customresourcedefinitions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomResourceDefinition>>;
        get(params: Params$Resource$Projects$Locations$Customresourcedefinitions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Customresourcedefinitions$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomResourceDefinition>, callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
        get(params: Params$Resource$Projects$Locations$Customresourcedefinitions$Get, callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
        get(callback: BodyResponseCallback<Schema$CustomResourceDefinition>): void;
        /**
         * Rpc to list custom resource definitions.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1beta1');
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
         *   const res = await run.projects.locations.customresourcedefinitions.list({
         *     // Optional encoded string to continue paging.
         *     continue: 'placeholder-value',
         *     // Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         *     fieldSelector: 'placeholder-value',
         *     // Not currently used by Cloud Run.
         *     includeUninitialized: 'placeholder-value',
         *     // Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         *     labelSelector: 'placeholder-value',
         *
         *     limit: 'placeholder-value',
         *     // The project ID or project number from which the storages should be listed.
         *     parent: 'projects/my-project/locations/my-location',
         *     // The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         *     resourceVersion: 'placeholder-value',
         *     // Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         *     watch: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "unreachable": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Customresourcedefinitions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Customresourcedefinitions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCustomResourceDefinitionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Customresourcedefinitions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Customresourcedefinitions$List, options: MethodOptions | BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>, callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Customresourcedefinitions$List, callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCustomResourceDefinitionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Customresourcedefinitions$Get extends StandardParameters {
        /**
         * The name of the CustomResourceDefinition being retrieved. If needed, replace {namespace_id\} with the project ID.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Customresourcedefinitions$List extends StandardParameters {
        /**
         * Optional encoded string to continue paging.
         */
        continue?: string;
        /**
         * Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         */
        fieldSelector?: string;
        /**
         * Not currently used by Cloud Run.
         */
        includeUninitialized?: boolean;
        /**
         * Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         */
        labelSelector?: string;
        /**
         *
         */
        limit?: number;
        /**
         * The project ID or project number from which the storages should be listed.
         */
        parent?: string;
        /**
         * The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         */
        resourceVersion?: string;
        /**
         * Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         */
        watch?: boolean;
    }
    export {};
}
