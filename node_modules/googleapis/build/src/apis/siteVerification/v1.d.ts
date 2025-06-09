import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace siteVerification_v1 {
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
     * Google Site Verification API
     *
     * Verifies ownership of websites or domains with Google.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const siteVerification = google.siteVerification('v1');
     * ```
     */
    export class Siteverification {
        context: APIRequestContext;
        webResource: Resource$Webresource;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$SiteVerificationWebResourceGettokenRequest {
        /**
         * The site for which a verification token will be generated.
         */
        site?: {
            identifier?: string;
            type?: string;
        } | null;
        /**
         * The verification method that will be used to verify this site. For sites, 'FILE' or 'META' methods may be used. For domains, only 'DNS' may be used.
         */
        verificationMethod?: string | null;
    }
    export interface Schema$SiteVerificationWebResourceGettokenResponse {
        /**
         * The verification method to use in conjunction with this token. For FILE, the token should be placed in the top-level directory of the site, stored inside a file of the same name. For META, the token should be placed in the HEAD tag of the default page that is loaded for the site. For DNS, the token should be placed in a TXT record of the domain.
         */
        method?: string | null;
        /**
         * The verification token. The token must be placed appropriately in order for verification to succeed.
         */
        token?: string | null;
    }
    export interface Schema$SiteVerificationWebResourceListResponse {
        /**
         * The list of sites that are owned by the authenticated user.
         */
        items?: Schema$SiteVerificationWebResourceResource[];
    }
    export interface Schema$SiteVerificationWebResourceResource {
        /**
         * The string used to identify this site. This value should be used in the "id" portion of the REST URL for the Get, Update, and Delete operations.
         */
        id?: string | null;
        /**
         * The email addresses of all verified owners.
         */
        owners?: string[] | null;
        /**
         * The address and type of a site that is verified or will be verified.
         */
        site?: {
            identifier?: string;
            type?: string;
        } | null;
    }
    export class Resource$Webresource {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Relinquish ownership of a website or domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Webresource$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Webresource$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Webresource$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Webresource$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Webresource$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Get the most current data for a website or domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Webresource$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Webresource$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceResource>>;
        get(params: Params$Resource$Webresource$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Webresource$Get, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceResource>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        get(params: Params$Resource$Webresource$Get, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        get(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        /**
         * Get a verification token for placing on a website or domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getToken(params: Params$Resource$Webresource$Gettoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getToken(params?: Params$Resource$Webresource$Gettoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceGettokenResponse>>;
        getToken(params: Params$Resource$Webresource$Gettoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getToken(params: Params$Resource$Webresource$Gettoken, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceGettokenResponse>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceGettokenResponse>): void;
        getToken(params: Params$Resource$Webresource$Gettoken, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceGettokenResponse>): void;
        getToken(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceGettokenResponse>): void;
        /**
         * Attempt verification of a website or domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Webresource$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Webresource$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceResource>>;
        insert(params: Params$Resource$Webresource$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Webresource$Insert, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceResource>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        insert(params: Params$Resource$Webresource$Insert, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        insert(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        /**
         * Get the list of your verified websites and domains.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Webresource$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Webresource$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceListResponse>>;
        list(params: Params$Resource$Webresource$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Webresource$List, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceListResponse>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceListResponse>): void;
        list(params: Params$Resource$Webresource$List, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceListResponse>): void;
        list(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceListResponse>): void;
        /**
         * Modify the list of owners for your website or domain. This method supports patch semantics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Webresource$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Webresource$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceResource>>;
        patch(params: Params$Resource$Webresource$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Webresource$Patch, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceResource>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        patch(params: Params$Resource$Webresource$Patch, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        patch(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        /**
         * Modify the list of owners for your website or domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Webresource$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Webresource$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SiteVerificationWebResourceResource>>;
        update(params: Params$Resource$Webresource$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Webresource$Update, options: MethodOptions | BodyResponseCallback<Schema$SiteVerificationWebResourceResource>, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        update(params: Params$Resource$Webresource$Update, callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
        update(callback: BodyResponseCallback<Schema$SiteVerificationWebResourceResource>): void;
    }
    export interface Params$Resource$Webresource$Delete extends StandardParameters {
        /**
         * The id of a verified site or domain.
         */
        id?: string;
    }
    export interface Params$Resource$Webresource$Get extends StandardParameters {
        /**
         * The id of a verified site or domain.
         */
        id?: string;
    }
    export interface Params$Resource$Webresource$Gettoken extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$SiteVerificationWebResourceGettokenRequest;
    }
    export interface Params$Resource$Webresource$Insert extends StandardParameters {
        /**
         * The method to use for verifying a site or domain.
         */
        verificationMethod?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SiteVerificationWebResourceResource;
    }
    export interface Params$Resource$Webresource$List extends StandardParameters {
    }
    export interface Params$Resource$Webresource$Patch extends StandardParameters {
        /**
         * The id of a verified site or domain.
         */
        id?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SiteVerificationWebResourceResource;
    }
    export interface Params$Resource$Webresource$Update extends StandardParameters {
        /**
         * The id of a verified site or domain.
         */
        id?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SiteVerificationWebResourceResource;
    }
    export {};
}
