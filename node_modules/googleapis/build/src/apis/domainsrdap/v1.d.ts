import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace domainsrdap_v1 {
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
     * Domains RDAP API
     *
     * Read-only public API that lets users search for information about domain names.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const domainsrdap = google.domainsrdap('v1');
     * ```
     */
    export class Domainsrdap {
        context: APIRequestContext;
        autnum: Resource$Autnum;
        domain: Resource$Domain;
        entity: Resource$Entity;
        ip: Resource$Ip;
        nameserver: Resource$Nameserver;
        v1: Resource$V1;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
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
     * Links object defined in [section 4.2 of RFC 7483](https://tools.ietf.org/html/rfc7483#section-4.2).
     */
    export interface Schema$Link {
        /**
         * Target URL of a link. Example: "http://example.com/previous".
         */
        href?: string | null;
        /**
         * Language code of a link. Example: "en".
         */
        hreflang?: string | null;
        /**
         * Media type of the link destination. Example: "screen".
         */
        media?: string | null;
        /**
         * Relation type of a link. Example: "previous".
         */
        rel?: string | null;
        /**
         * Title of this link. Example: "title".
         */
        title?: string | null;
        /**
         * Content type of the link. Example: "application/json".
         */
        type?: string | null;
        /**
         * URL giving context for the link. Example: "http://example.com/current".
         */
        value?: string | null;
    }
    /**
     * Notices object defined in [section 4.3 of RFC 7483](https://tools.ietf.org/html/rfc7483#section-4.3).
     */
    export interface Schema$Notice {
        /**
         * Description of the notice.
         */
        description?: string[] | null;
        /**
         * Link to a document containing more information.
         */
        links?: Schema$Link[];
        /**
         * Title of a notice. Example: "Terms of Service".
         */
        title?: string | null;
        /**
         * Type values defined in [section 10.2.1 of RFC 7483](https://tools.ietf.org/html/rfc7483#section-10.2.1) specific to a whole response: "result set truncated due to authorization", "result set truncated due to excessive load", "result set truncated due to unexplainable reasons".
         */
        type?: string | null;
    }
    /**
     * Response to a general RDAP query.
     */
    export interface Schema$RdapResponse {
        /**
         * Error description.
         */
        description?: string[] | null;
        /**
         * Error HTTP code. Example: "501".
         */
        errorCode?: number | null;
        /**
         * HTTP response with content type set to "application/json+rdap".
         */
        jsonResponse?: Schema$HttpBody;
        /**
         * Error language code. Error response info fields are defined in [section 6 of RFC 7483](https://tools.ietf.org/html/rfc7483#section-6).
         */
        lang?: string | null;
        /**
         * Notices applying to this response.
         */
        notices?: Schema$Notice[];
        /**
         * RDAP conformance level.
         */
        rdapConformance?: string[] | null;
        /**
         * Error title.
         */
        title?: string | null;
    }
    export class Resource$Autnum {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Autnum$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Autnum$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        get(params: Params$Resource$Autnum$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Autnum$Get, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(params: Params$Resource$Autnum$Get, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(callback: BodyResponseCallback<Schema$RdapResponse>): void;
    }
    export interface Params$Resource$Autnum$Get extends StandardParameters {
        /**
         *
         */
        autnumId?: string;
    }
    export class Resource$Domain {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Look up RDAP information for a domain by name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Domain$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Domain$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        get(params: Params$Resource$Domain$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Domain$Get, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        get(params: Params$Resource$Domain$Get, callback: BodyResponseCallback<Schema$HttpBody>): void;
        get(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Domain$Get extends StandardParameters {
        /**
         * Full domain name to look up. Example: "example.com"
         */
        domainName?: string;
    }
    export class Resource$Entity {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Entity$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Entity$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        get(params: Params$Resource$Entity$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Entity$Get, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(params: Params$Resource$Entity$Get, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(callback: BodyResponseCallback<Schema$RdapResponse>): void;
    }
    export interface Params$Resource$Entity$Get extends StandardParameters {
        /**
         *
         */
        entityId?: string;
    }
    export class Resource$Ip {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Ip$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Ip$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        get(params: Params$Resource$Ip$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Ip$Get, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(params: Params$Resource$Ip$Get, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(callback: BodyResponseCallback<Schema$RdapResponse>): void;
    }
    export interface Params$Resource$Ip$Get extends StandardParameters {
        /**
         *
         */
        ipId?: string;
        /**
         *
         */
        ipId1?: string;
    }
    export class Resource$Nameserver {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Nameserver$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Nameserver$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        get(params: Params$Resource$Nameserver$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Nameserver$Get, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(params: Params$Resource$Nameserver$Get, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        get(callback: BodyResponseCallback<Schema$RdapResponse>): void;
    }
    export interface Params$Resource$Nameserver$Get extends StandardParameters {
        /**
         *
         */
        nameserverId?: string;
    }
    export class Resource$V1 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDomains(params: Params$Resource$V1$Getdomains, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDomains(params?: Params$Resource$V1$Getdomains, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        getDomains(params: Params$Resource$V1$Getdomains, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDomains(params: Params$Resource$V1$Getdomains, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getDomains(params: Params$Resource$V1$Getdomains, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getDomains(callback: BodyResponseCallback<Schema$RdapResponse>): void;
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEntities(params: Params$Resource$V1$Getentities, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEntities(params?: Params$Resource$V1$Getentities, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        getEntities(params: Params$Resource$V1$Getentities, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEntities(params: Params$Resource$V1$Getentities, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getEntities(params: Params$Resource$V1$Getentities, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getEntities(callback: BodyResponseCallback<Schema$RdapResponse>): void;
        /**
         * Get help information for the RDAP API, including links to documentation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getHelp(params: Params$Resource$V1$Gethelp, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getHelp(params?: Params$Resource$V1$Gethelp, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        getHelp(params: Params$Resource$V1$Gethelp, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getHelp(params: Params$Resource$V1$Gethelp, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getHelp(params: Params$Resource$V1$Gethelp, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getHelp(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIp(params: Params$Resource$V1$Getip, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIp(params?: Params$Resource$V1$Getip, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        getIp(params: Params$Resource$V1$Getip, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIp(params: Params$Resource$V1$Getip, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getIp(params: Params$Resource$V1$Getip, callback: BodyResponseCallback<Schema$HttpBody>): void;
        getIp(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * The RDAP API recognizes this command from the RDAP specification but does not support it. The response is a formatted 501 error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getNameservers(params: Params$Resource$V1$Getnameservers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getNameservers(params?: Params$Resource$V1$Getnameservers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RdapResponse>>;
        getNameservers(params: Params$Resource$V1$Getnameservers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getNameservers(params: Params$Resource$V1$Getnameservers, options: MethodOptions | BodyResponseCallback<Schema$RdapResponse>, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getNameservers(params: Params$Resource$V1$Getnameservers, callback: BodyResponseCallback<Schema$RdapResponse>): void;
        getNameservers(callback: BodyResponseCallback<Schema$RdapResponse>): void;
    }
    export interface Params$Resource$V1$Getdomains extends StandardParameters {
    }
    export interface Params$Resource$V1$Getentities extends StandardParameters {
    }
    export interface Params$Resource$V1$Gethelp extends StandardParameters {
    }
    export interface Params$Resource$V1$Getip extends StandardParameters {
    }
    export interface Params$Resource$V1$Getnameservers extends StandardParameters {
    }
    export {};
}
