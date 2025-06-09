import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace discovery_v1 {
    export interface Options extends GlobalOptions {
        version: 'v1';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | BaseExternalAccountClient | GoogleAuth;
        /**
         * Data format for the response.
         */
        alt?: string;
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
         * An opaque string that represents a user for quota purposes. Must not exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Deprecated. Please use quotaUser instead.
         */
        userIp?: string;
    }
    /**
     * API Discovery Service
     *
     * Provides information about other Google APIs, such as what APIs are available, the resource, and method details for each API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const discovery = google.discovery('v1');
     * ```
     */
    export class Discovery {
        context: APIRequestContext;
        apis: Resource$Apis;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$DirectoryList {
        /**
         * Indicate the version of the Discovery API used to generate this doc.
         */
        discoveryVersion?: string | null;
        /**
         * The individual directory entries. One entry per api/version pair.
         */
        items?: Array<{
            description?: string;
            discoveryLink?: string;
            discoveryRestUrl?: string;
            documentationLink?: string;
            icons?: {
                x16?: string;
                x32?: string;
            };
            id?: string;
            kind?: string;
            labels?: string[];
            name?: string;
            preferred?: boolean;
            title?: string;
            version?: string;
        }> | null;
        /**
         * The kind for this response.
         */
        kind?: string | null;
    }
    export interface Schema$JsonSchema {
        /**
         * A reference to another schema. The value of this property is the "id" of another schema.
         */
        $ref?: string | null;
        /**
         * If this is a schema for an object, this property is the schema for any additional properties with dynamic keys on this object.
         */
        additionalProperties?: Schema$JsonSchema;
        /**
         * Additional information about this property.
         */
        annotations?: {
            required?: string[];
        } | null;
        /**
         * The default value of this property (if one exists).
         */
        default?: string | null;
        /**
         * Whether the parameter is deprecated.
         */
        deprecated?: boolean | null;
        /**
         * A description of this object.
         */
        description?: string | null;
        /**
         * Values this parameter may take (if it is an enum).
         */
        enum?: string[] | null;
        /**
         * The deprecation status for the enums. Each position maps to the corresponding value in the "enum" array.
         */
        enumDeprecated?: boolean[] | null;
        /**
         * The descriptions for the enums. Each position maps to the corresponding value in the "enum" array.
         */
        enumDescriptions?: string[] | null;
        /**
         * An additional regular expression or key that helps constrain the value. For more details see: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.23
         */
        format?: string | null;
        /**
         * Unique identifier for this schema.
         */
        id?: string | null;
        /**
         * If this is a schema for an array, this property is the schema for each element in the array.
         */
        items?: Schema$JsonSchema;
        /**
         * Whether this parameter goes in the query or the path for REST requests.
         */
        location?: string | null;
        /**
         * The maximum value of this parameter.
         */
        maximum?: string | null;
        /**
         * The minimum value of this parameter.
         */
        minimum?: string | null;
        /**
         * The regular expression this parameter must conform to. Uses Java 6 regex format: http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html
         */
        pattern?: string | null;
        /**
         * If this is a schema for an object, list the schema for each property of this object.
         */
        properties?: {
            [key: string]: Schema$JsonSchema;
        } | null;
        /**
         * The value is read-only, generated by the service. The value cannot be modified by the client. If the value is included in a POST, PUT, or PATCH request, it is ignored by the service.
         */
        readOnly?: boolean | null;
        /**
         * Whether this parameter may appear multiple times.
         */
        repeated?: boolean | null;
        /**
         * Whether the parameter is required.
         */
        required?: boolean | null;
        /**
         * The value type for this schema. A list of values can be found here: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1
         */
        type?: string | null;
        /**
         * In a variant data type, the value of one property is used to determine how to interpret the entire entity. Its value must exist in a map of descriminant values to schema names.
         */
        variant?: {
            discriminant?: string;
            map?: Array<{
                $ref?: string;
                type_value?: string;
            }>;
        } | null;
    }
    export interface Schema$RestDescription {
        /**
         * Authentication information.
         */
        auth?: {
            oauth2?: {
                scopes?: {
                    [key: string]: {
                        description?: string;
                    };
                };
            };
        } | null;
        /**
         * [DEPRECATED] The base path for REST requests.
         */
        basePath?: string | null;
        /**
         * [DEPRECATED] The base URL for REST requests.
         */
        baseUrl?: string | null;
        /**
         * The path for REST batch requests.
         */
        batchPath?: string | null;
        /**
         * Indicates how the API name should be capitalized and split into various parts. Useful for generating pretty class names.
         */
        canonicalName?: string | null;
        /**
         * The description of this API.
         */
        description?: string | null;
        /**
         * Indicate the version of the Discovery API used to generate this doc.
         */
        discoveryVersion?: string | null;
        /**
         * A link to human readable documentation for the API.
         */
        documentationLink?: string | null;
        /**
         * A list of location-based endpoint objects for this API. Each object contains the endpoint URL, location, description and deprecation status.
         */
        endpoints?: Array<{
            deprecated?: boolean;
            description?: string;
            endpointUrl?: string;
            location?: string;
        }> | null;
        /**
         * The ETag for this response.
         */
        etag?: string | null;
        /**
         * Enable exponential backoff for suitable methods in the generated clients.
         */
        exponentialBackoffDefault?: boolean | null;
        /**
         * A list of supported features for this API.
         */
        features?: string[] | null;
        /**
         * Links to 16x16 and 32x32 icons representing the API.
         */
        icons?: {
            x16?: string;
            x32?: string;
        } | null;
        /**
         * The ID of this API.
         */
        id?: string | null;
        /**
         * The kind for this response.
         */
        kind?: string | null;
        /**
         * Labels for the status of this API, such as labs or deprecated.
         */
        labels?: string[] | null;
        /**
         * API-level methods for this API.
         */
        methods?: {
            [key: string]: Schema$RestMethod;
        } | null;
        /**
         * The name of this API.
         */
        name?: string | null;
        /**
         * The domain of the owner of this API. Together with the ownerName and a packagePath values, this can be used to generate a library for this API which would have a unique fully qualified name.
         */
        ownerDomain?: string | null;
        /**
         * The name of the owner of this API. See ownerDomain.
         */
        ownerName?: string | null;
        /**
         * The package of the owner of this API. See ownerDomain.
         */
        packagePath?: string | null;
        /**
         * Common parameters that apply across all apis.
         */
        parameters?: {
            [key: string]: Schema$JsonSchema;
        } | null;
        /**
         * The protocol described by this document.
         */
        protocol?: string | null;
        /**
         * The resources in this API.
         */
        resources?: {
            [key: string]: Schema$RestResource;
        } | null;
        /**
         * The version of this API.
         */
        revision?: string | null;
        /**
         * The root URL under which all API services live.
         */
        rootUrl?: string | null;
        /**
         * The schemas for this API.
         */
        schemas?: {
            [key: string]: Schema$JsonSchema;
        } | null;
        /**
         * The base path for all REST requests.
         */
        servicePath?: string | null;
        /**
         * The title of this API.
         */
        title?: string | null;
        /**
         * The version of this API.
         */
        version?: string | null;
        version_module?: boolean | null;
    }
    export interface Schema$RestMethod {
        /**
         * The API Version of this method, as passed in via the `X-Goog-Api-Version` header or `$apiVersion` query parameter.
         */
        apiVersion?: string | null;
        /**
         * Whether this method is deprecated.
         */
        deprecated?: boolean | null;
        /**
         * Description of this method.
         */
        description?: string | null;
        /**
         * Whether this method requires an ETag to be specified. The ETag is sent as an HTTP If-Match or If-None-Match header.
         */
        etagRequired?: boolean | null;
        /**
         * The URI path of this REST method in (RFC 6570) format without level 2 features ({+var\}). Supplementary to the path property.
         */
        flatPath?: string | null;
        /**
         * HTTP method used by this method.
         */
        httpMethod?: string | null;
        /**
         * A unique ID for this method. This property can be used to match methods between different versions of Discovery.
         */
        id?: string | null;
        /**
         * Media upload parameters.
         */
        mediaUpload?: {
            accept?: string[];
            maxSize?: string;
            protocols?: {
                resumable?: {
                    multipart?: boolean;
                    path?: string;
                };
                simple?: {
                    multipart?: boolean;
                    path?: string;
                };
            };
        } | null;
        /**
         * Ordered list of required parameters, serves as a hint to clients on how to structure their method signatures. The array is ordered such that the "most-significant" parameter appears first.
         */
        parameterOrder?: string[] | null;
        /**
         * Details for all parameters in this method.
         */
        parameters?: {
            [key: string]: Schema$JsonSchema;
        } | null;
        /**
         * The URI path of this REST method. Should be used in conjunction with the basePath property at the api-level.
         */
        path?: string | null;
        /**
         * The schema for the request.
         */
        request?: {
            $ref?: string;
            parameterName?: string;
        } | null;
        /**
         * The schema for the response.
         */
        response?: {
            $ref?: string;
        } | null;
        /**
         * OAuth 2.0 scopes applicable to this method.
         */
        scopes?: string[] | null;
        /**
         * Whether this method supports media downloads.
         */
        supportsMediaDownload?: boolean | null;
        /**
         * Whether this method supports media uploads.
         */
        supportsMediaUpload?: boolean | null;
        /**
         * Whether this method supports subscriptions.
         */
        supportsSubscription?: boolean | null;
        /**
         * Indicates that downloads from this method should use the download service URL (i.e. "/download"). Only applies if the method supports media download.
         */
        useMediaDownloadService?: boolean | null;
    }
    export interface Schema$RestResource {
        /**
         * Whether this resource is deprecated.
         */
        deprecated?: boolean | null;
        /**
         * Methods on this resource.
         */
        methods?: {
            [key: string]: Schema$RestMethod;
        } | null;
        /**
         * Sub-resources on this resource.
         */
        resources?: {
            [key: string]: Schema$RestResource;
        } | null;
    }
    export class Resource$Apis {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieve the description of a particular version of an api.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getRest(params: Params$Resource$Apis$Getrest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getRest(params?: Params$Resource$Apis$Getrest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RestDescription>>;
        getRest(params: Params$Resource$Apis$Getrest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getRest(params: Params$Resource$Apis$Getrest, options: MethodOptions | BodyResponseCallback<Schema$RestDescription>, callback: BodyResponseCallback<Schema$RestDescription>): void;
        getRest(params: Params$Resource$Apis$Getrest, callback: BodyResponseCallback<Schema$RestDescription>): void;
        getRest(callback: BodyResponseCallback<Schema$RestDescription>): void;
        /**
         * Retrieve the list of APIs supported at this endpoint.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Apis$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Apis$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DirectoryList>>;
        list(params: Params$Resource$Apis$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Apis$List, options: MethodOptions | BodyResponseCallback<Schema$DirectoryList>, callback: BodyResponseCallback<Schema$DirectoryList>): void;
        list(params: Params$Resource$Apis$List, callback: BodyResponseCallback<Schema$DirectoryList>): void;
        list(callback: BodyResponseCallback<Schema$DirectoryList>): void;
    }
    export interface Params$Resource$Apis$Getrest extends StandardParameters {
        /**
         * The name of the API.
         */
        api?: string;
        /**
         * The version of the API.
         */
        version?: string;
    }
    export interface Params$Resource$Apis$List extends StandardParameters {
        /**
         * Only include APIs with the given name.
         */
        name?: string;
        /**
         * Return only the preferred version of an API.
         */
        preferred?: boolean;
    }
    export {};
}
