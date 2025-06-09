import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace acmedns_v1 {
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
     * ACME DNS API
     *
     * Google Domains ACME DNS API that allows users to complete ACME DNS-01 challenges for a domain.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const acmedns = google.acmedns('v1');
     * ```
     */
    export class Acmedns {
        context: APIRequestContext;
        acmeChallengeSets: Resource$Acmechallengesets;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The up-to-date ACME challenge set on a domain for an RPC. This contains all of the ACME TXT records that exist on the domain.
     */
    export interface Schema$AcmeChallengeSet {
        /**
         * The ACME challenges on the requested domain represented as individual TXT records.
         */
        record?: Schema$AcmeTxtRecord[];
    }
    /**
     * The TXT record message that represents an ACME DNS-01 challenge.
     */
    export interface Schema$AcmeTxtRecord {
        /**
         * Holds the ACME challenge data put in the TXT record. This will be checked to be a valid TXT record data entry.
         */
        digest?: string | null;
        /**
         * The domain/subdomain for the record. In a request, this MAY be Unicode or Punycode. In a response, this will be in Unicode. The fqdn MUST contain the root_domain field on the request.
         */
        fqdn?: string | null;
        /**
         * Output only. The time when this record was last updated. This will be in UTC time.
         */
        updateTime?: string | null;
    }
    /**
     * The request message for the RotateChallenges RPC. Requires an access token, a root domain, and either records_to_add or records_to_remove to be populated. Records may be set for multiple subdomains at once to support SAN requests for multiple subdomains in a single domain. By default, ACME TXT record challenges that are older than 30 days will be removed. Set `keep_expired_records` to false if this behavior is undesired. There is a record maximum of 100 records per domain including expired records. Any request sent that would exceed this maximum will result in a FAILED_PRECONDITION error. NEXT ID: 6
     */
    export interface Schema$RotateChallengesRequest {
        /**
         * Required. ACME DNS access token. This is a base64 token secret that is procured from the Google Domains website. It authorizes ACME TXT record updates for a domain.
         */
        accessToken?: string | null;
        /**
         * Keep records older than 30 days that were used for previous requests.
         */
        keepExpiredRecords?: boolean | null;
        /**
         * ACME TXT record challenges to add. Supports multiple challenges on the same FQDN.
         */
        recordsToAdd?: Schema$AcmeTxtRecord[];
        /**
         * ACME TXT record challenges to remove.
         */
        recordsToRemove?: Schema$AcmeTxtRecord[];
    }
    export class Resource$Acmechallengesets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the ACME challenge set for a given domain name. Domain names must be provided in Punycode.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Acmechallengesets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Acmechallengesets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AcmeChallengeSet>>;
        get(params: Params$Resource$Acmechallengesets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Acmechallengesets$Get, options: MethodOptions | BodyResponseCallback<Schema$AcmeChallengeSet>, callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
        get(params: Params$Resource$Acmechallengesets$Get, callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
        get(callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
        /**
         * Rotate the ACME challenges for a given domain name. By default, removes any challenges that are older than 30 days. Domain names must be provided in Punycode.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        rotateChallenges(params: Params$Resource$Acmechallengesets$Rotatechallenges, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rotateChallenges(params?: Params$Resource$Acmechallengesets$Rotatechallenges, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AcmeChallengeSet>>;
        rotateChallenges(params: Params$Resource$Acmechallengesets$Rotatechallenges, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rotateChallenges(params: Params$Resource$Acmechallengesets$Rotatechallenges, options: MethodOptions | BodyResponseCallback<Schema$AcmeChallengeSet>, callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
        rotateChallenges(params: Params$Resource$Acmechallengesets$Rotatechallenges, callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
        rotateChallenges(callback: BodyResponseCallback<Schema$AcmeChallengeSet>): void;
    }
    export interface Params$Resource$Acmechallengesets$Get extends StandardParameters {
        /**
         * Required. SLD + TLD domain name to list challenges. For example, this would be "google.com" for any FQDN under "google.com". That includes challenges for "subdomain.google.com". This MAY be Unicode or Punycode.
         */
        rootDomain?: string;
    }
    export interface Params$Resource$Acmechallengesets$Rotatechallenges extends StandardParameters {
        /**
         * Required. SLD + TLD domain name to update records for. For example, this would be "google.com" for any FQDN under "google.com". That includes challenges for "subdomain.google.com". This MAY be Unicode or Punycode.
         */
        rootDomain?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RotateChallengesRequest;
    }
    export {};
}
