/**
 * These are a collection of interfaces that represent the GoogleApis
 * Discovery json formats.
 */
export interface Schemas {
    discoveryVersion: string;
    kind: string;
    items: Schema[];
}
export interface Schema {
    auth: {
        oauth2: {
            scopes: {
                [index: string]: {
                    description: string;
                };
            };
        };
    };
    basePath: string;
    baseUrl: string;
    batchPath: string;
    description: string;
    discoveryVersion: string;
    discoveryRestUrl: string;
    documentationLink: string;
    etag: string;
    icons: {
        x16: string;
        x32: string;
    };
    id: string;
    kind: string;
    methods: SchemaMethods;
    name: string;
    ownerDomain: string;
    ownerName: string;
    parameters: SchemaParameters;
    protocol: string;
    resources: SchemaResources;
    revision: string;
    rootUrl: string;
    schemas: SchemaItems;
    servicePath: string;
    title: string;
    version: string;
}
export interface SchemaResources {
    [index: string]: SchemaResource;
}
export interface SchemaResource {
    methods?: SchemaMethods;
    resources?: SchemaResources;
}
export interface SchemaItems {
    [index: string]: SchemaItem;
}
export interface SchemaItem {
    description?: string;
    default?: string;
    id?: string;
    properties?: {
        [index: string]: SchemaItem;
    };
    additionalProperties?: {
        [index: string]: SchemaItem;
    };
    items?: {
        [index: string]: SchemaItem;
    };
    type?: SchemaType;
    format?: ParameterFormat;
    $ref?: string;
}
export interface SchemaParameters {
    [index: string]: SchemaParameter;
}
export interface SchemaParameter {
    default: string;
    description: string;
    location: string;
    enum: string[];
    enumDescription: string[];
    type: SchemaType;
    format: ParameterFormat;
    required: boolean;
}
export interface SchemaMethods {
    [index: string]: SchemaMethod;
}
export interface SchemaMethod {
    description: string;
    httpMethod: HttpMethod;
    id: string;
    parameterOrder?: string[];
    parameters?: {
        [index: string]: SchemaParameter;
    };
    path: string;
    request: {
        $ref: string;
    };
    response: {
        $ref: string;
    };
    sampleUrl: string;
    scopes: string[];
    fragment: string;
    mediaUpload: {
        protocols: {
            simple: {
                path: string;
            };
        };
    };
    supportsMediaDownload?: boolean;
    apiVersion?: string;
}
export interface FragmentResponse {
    codeFragment: {
        [index: string]: {
            fragment: string;
        };
    };
}
export type ParameterFormat = 'int32';
export type HttpMethod = 'GET' | 'PATCH' | 'PUT';
export type SchemaType = 'object' | 'integer' | 'string' | 'array' | 'boolean';
