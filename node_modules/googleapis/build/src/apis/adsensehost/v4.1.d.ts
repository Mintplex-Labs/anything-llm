import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace adsensehost_v4_1 {
    export interface Options extends GlobalOptions {
        version: 'v4.1';
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
     * AdSense Host API
     *
     * Generates performance reports, generates ad codes, and provides publisher management capabilities for AdSense Hosts.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const adsensehost = google.adsensehost('v4.1');
     * ```
     */
    export class Adsensehost {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        adclients: Resource$Adclients;
        associationsessions: Resource$Associationsessions;
        customchannels: Resource$Customchannels;
        reports: Resource$Reports;
        urlchannels: Resource$Urlchannels;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$Account {
        /**
         * Unique identifier of this account.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#account.
         */
        kind?: string | null;
        /**
         * Name of this account.
         */
        name?: string | null;
        /**
         * Approval status of this account. One of: PENDING, APPROVED, DISABLED.
         */
        status?: string | null;
    }
    export interface Schema$Accounts {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The accounts returned in this list response.
         */
        items?: Schema$Account[];
        /**
         * Kind of list this is, in this case adsensehost#accounts.
         */
        kind?: string | null;
    }
    export interface Schema$AdClient {
        /**
         * Whether this ad client is opted in to ARC.
         */
        arcOptIn?: boolean | null;
        /**
         * Unique identifier of this ad client.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#adClient.
         */
        kind?: string | null;
        /**
         * This ad client's product code, which corresponds to the PRODUCT_CODE report dimension.
         */
        productCode?: string | null;
        /**
         * Whether this ad client supports being reported on.
         */
        supportsReporting?: boolean | null;
    }
    export interface Schema$AdClients {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The ad clients returned in this list response.
         */
        items?: Schema$AdClient[];
        /**
         * Kind of list this is, in this case adsensehost#adClients.
         */
        kind?: string | null;
        /**
         * Continuation token used to page through ad clients. To retrieve the next page of results, set the next request's "pageToken" value to this.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$AdCode {
        /**
         * The ad code snippet.
         */
        adCode?: string | null;
        /**
         * Kind this is, in this case adsensehost#adCode.
         */
        kind?: string | null;
    }
    export interface Schema$AdStyle {
        /**
         * The colors included in the style. These are represented as six hexadecimal characters, similar to HTML color codes, but without the leading hash.
         */
        colors?: {
            background?: string;
            border?: string;
            text?: string;
            title?: string;
            url?: string;
        } | null;
        /**
         * The style of the corners in the ad (deprecated: never populated, ignored).
         */
        corners?: string | null;
        /**
         * The font which is included in the style.
         */
        font?: {
            family?: string;
            size?: string;
        } | null;
        /**
         * Kind this is, in this case adsensehost#adStyle.
         */
        kind?: string | null;
    }
    export interface Schema$AdUnit {
        /**
         * Identity code of this ad unit, not necessarily unique across ad clients.
         */
        code?: string | null;
        /**
         * Settings specific to content ads (AFC) and highend mobile content ads (AFMC - deprecated).
         */
        contentAdsSettings?: {
            backupOption?: {
                color?: string;
                type?: string;
                url?: string;
            };
            size?: string;
            type?: string;
        } | null;
        /**
         * Custom style information specific to this ad unit.
         */
        customStyle?: Schema$AdStyle;
        /**
         * Unique identifier of this ad unit. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#adUnit.
         */
        kind?: string | null;
        /**
         * Settings specific to WAP mobile content ads (AFMC - deprecated).
         */
        mobileContentAdsSettings?: {
            markupLanguage?: string;
            scriptingLanguage?: string;
            size?: string;
            type?: string;
        } | null;
        /**
         * Name of this ad unit.
         */
        name?: string | null;
        /**
         * Status of this ad unit. Possible values are:
         * NEW: Indicates that the ad unit was created within the last seven days and does not yet have any activity associated with it.
         *
         * ACTIVE: Indicates that there has been activity on this ad unit in the last seven days.
         *
         * INACTIVE: Indicates that there has been no activity on this ad unit in the last seven days.
         */
        status?: string | null;
    }
    export interface Schema$AdUnits {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The ad units returned in this list response.
         */
        items?: Schema$AdUnit[];
        /**
         * Kind of list this is, in this case adsensehost#adUnits.
         */
        kind?: string | null;
        /**
         * Continuation token used to page through ad units. To retrieve the next page of results, set the next request's "pageToken" value to this.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$AssociationSession {
        /**
         * Hosted account id of the associated publisher after association. Present if status is ACCEPTED.
         */
        accountId?: string | null;
        /**
         * Unique identifier of this association session.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#associationSession.
         */
        kind?: string | null;
        /**
         * The products to associate with the user. Options: AFC, AFG, AFV, AFS (deprecated), AFMC (deprecated)
         */
        productCodes?: string[] | null;
        /**
         * Redirect URL of this association session. Used to redirect users into the AdSense association flow.
         */
        redirectUrl?: string | null;
        /**
         * Status of the completed association, available once the association callback token has been verified. One of ACCEPTED, REJECTED, or ERROR.
         */
        status?: string | null;
        /**
         * The preferred locale of the user themselves when going through the AdSense association flow.
         */
        userLocale?: string | null;
        /**
         * The locale of the user's hosted website.
         */
        websiteLocale?: string | null;
        /**
         * The URL of the user's hosted website.
         */
        websiteUrl?: string | null;
    }
    export interface Schema$CustomChannel {
        /**
         * Code of this custom channel, not necessarily unique across ad clients.
         */
        code?: string | null;
        /**
         * Unique identifier of this custom channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#customChannel.
         */
        kind?: string | null;
        /**
         * Name of this custom channel.
         */
        name?: string | null;
    }
    export interface Schema$CustomChannels {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The custom channels returned in this list response.
         */
        items?: Schema$CustomChannel[];
        /**
         * Kind of list this is, in this case adsensehost#customChannels.
         */
        kind?: string | null;
        /**
         * Continuation token used to page through custom channels. To retrieve the next page of results, set the next request's "pageToken" value to this.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$Report {
        /**
         * The averages of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
         */
        averages?: string[] | null;
        /**
         * The header information of the columns requested in the report. This is a list of headers; one for each dimension in the request, followed by one for each metric in the request.
         */
        headers?: Array<{
            currency?: string;
            name?: string;
            type?: string;
        }> | null;
        /**
         * Kind this is, in this case adsensehost#report.
         */
        kind?: string | null;
        /**
         * The output rows of the report. Each row is a list of cells; one for each dimension in the request, followed by one for each metric in the request. The dimension cells contain strings, and the metric cells contain numbers.
         */
        rows?: string[][] | null;
        /**
         * The total number of rows matched by the report request. Fewer rows may be returned in the response due to being limited by the row count requested or the report row limit.
         */
        totalMatchedRows?: string | null;
        /**
         * The totals of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
         */
        totals?: string[] | null;
        /**
         * Any warnings associated with generation of the report.
         */
        warnings?: string[] | null;
    }
    export interface Schema$UrlChannel {
        /**
         * Unique identifier of this URL channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
         */
        id?: string | null;
        /**
         * Kind of resource this is, in this case adsensehost#urlChannel.
         */
        kind?: string | null;
        /**
         * URL Pattern of this URL channel. Does not include "http://" or "https://". Example: www.example.com/home
         */
        urlPattern?: string | null;
    }
    export interface Schema$UrlChannels {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The URL channels returned in this list response.
         */
        items?: Schema$UrlChannel[];
        /**
         * Kind of list this is, in this case adsensehost#urlChannels.
         */
        kind?: string | null;
        /**
         * Continuation token used to page through URL channels. To retrieve the next page of results, set the next request's "pageToken" value to this.
         */
        nextPageToken?: string | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        adclients: Resource$Accounts$Adclients;
        adunits: Resource$Accounts$Adunits;
        reports: Resource$Accounts$Reports;
        constructor(context: APIRequestContext);
        /**
         * Get information about the selected associated AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Account>>;
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Get, options: MethodOptions | BodyResponseCallback<Schema$Account>, callback: BodyResponseCallback<Schema$Account>): void;
        get(params: Params$Resource$Accounts$Get, callback: BodyResponseCallback<Schema$Account>): void;
        get(callback: BodyResponseCallback<Schema$Account>): void;
        /**
         * List hosted accounts associated with this AdSense account by ad client id.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Accounts>>;
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$List, options: MethodOptions | BodyResponseCallback<Schema$Accounts>, callback: BodyResponseCallback<Schema$Accounts>): void;
        list(params: Params$Resource$Accounts$List, callback: BodyResponseCallback<Schema$Accounts>): void;
        list(callback: BodyResponseCallback<Schema$Accounts>): void;
    }
    export interface Params$Resource$Accounts$Get extends StandardParameters {
        /**
         * Account to get information about.
         */
        accountId?: string;
    }
    export interface Params$Resource$Accounts$List extends StandardParameters {
        /**
         * Ad clients to list accounts for.
         */
        filterAdClientId?: string[];
    }
    export class Resource$Accounts$Adclients {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get information about one of the ad clients in the specified publisher's AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Adclients$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Adclients$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdClient>>;
        get(params: Params$Resource$Accounts$Adclients$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Adclients$Get, options: MethodOptions | BodyResponseCallback<Schema$AdClient>, callback: BodyResponseCallback<Schema$AdClient>): void;
        get(params: Params$Resource$Accounts$Adclients$Get, callback: BodyResponseCallback<Schema$AdClient>): void;
        get(callback: BodyResponseCallback<Schema$AdClient>): void;
        /**
         * List all hosted ad clients in the specified hosted account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Adclients$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Adclients$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdClients>>;
        list(params: Params$Resource$Accounts$Adclients$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Adclients$List, options: MethodOptions | BodyResponseCallback<Schema$AdClients>, callback: BodyResponseCallback<Schema$AdClients>): void;
        list(params: Params$Resource$Accounts$Adclients$List, callback: BodyResponseCallback<Schema$AdClients>): void;
        list(callback: BodyResponseCallback<Schema$AdClients>): void;
    }
    export interface Params$Resource$Accounts$Adclients$Get extends StandardParameters {
        /**
         * Account which contains the ad client.
         */
        accountId?: string;
        /**
         * Ad client to get.
         */
        adClientId?: string;
    }
    export interface Params$Resource$Accounts$Adclients$List extends StandardParameters {
        /**
         * Account for which to list ad clients.
         */
        accountId?: string;
        /**
         * The maximum number of ad clients to include in the response, used for paging.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export class Resource$Accounts$Adunits {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Delete the specified ad unit from the specified publisher AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Adunits$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Adunits$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnit>>;
        delete(params: Params$Resource$Accounts$Adunits$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Adunits$Delete, options: MethodOptions | BodyResponseCallback<Schema$AdUnit>, callback: BodyResponseCallback<Schema$AdUnit>): void;
        delete(params: Params$Resource$Accounts$Adunits$Delete, callback: BodyResponseCallback<Schema$AdUnit>): void;
        delete(callback: BodyResponseCallback<Schema$AdUnit>): void;
        /**
         * Get the specified host ad unit in this AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Adunits$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Adunits$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnit>>;
        get(params: Params$Resource$Accounts$Adunits$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Adunits$Get, options: MethodOptions | BodyResponseCallback<Schema$AdUnit>, callback: BodyResponseCallback<Schema$AdUnit>): void;
        get(params: Params$Resource$Accounts$Adunits$Get, callback: BodyResponseCallback<Schema$AdUnit>): void;
        get(callback: BodyResponseCallback<Schema$AdUnit>): void;
        /**
         * Get ad code for the specified ad unit, attaching the specified host custom channels.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getAdCode(params: Params$Resource$Accounts$Adunits$Getadcode, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAdCode(params?: Params$Resource$Accounts$Adunits$Getadcode, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdCode>>;
        getAdCode(params: Params$Resource$Accounts$Adunits$Getadcode, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAdCode(params: Params$Resource$Accounts$Adunits$Getadcode, options: MethodOptions | BodyResponseCallback<Schema$AdCode>, callback: BodyResponseCallback<Schema$AdCode>): void;
        getAdCode(params: Params$Resource$Accounts$Adunits$Getadcode, callback: BodyResponseCallback<Schema$AdCode>): void;
        getAdCode(callback: BodyResponseCallback<Schema$AdCode>): void;
        /**
         * Insert the supplied ad unit into the specified publisher AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Accounts$Adunits$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Accounts$Adunits$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnit>>;
        insert(params: Params$Resource$Accounts$Adunits$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Accounts$Adunits$Insert, options: MethodOptions | BodyResponseCallback<Schema$AdUnit>, callback: BodyResponseCallback<Schema$AdUnit>): void;
        insert(params: Params$Resource$Accounts$Adunits$Insert, callback: BodyResponseCallback<Schema$AdUnit>): void;
        insert(callback: BodyResponseCallback<Schema$AdUnit>): void;
        /**
         * List all ad units in the specified publisher's AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Adunits$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Adunits$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnits>>;
        list(params: Params$Resource$Accounts$Adunits$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Adunits$List, options: MethodOptions | BodyResponseCallback<Schema$AdUnits>, callback: BodyResponseCallback<Schema$AdUnits>): void;
        list(params: Params$Resource$Accounts$Adunits$List, callback: BodyResponseCallback<Schema$AdUnits>): void;
        list(callback: BodyResponseCallback<Schema$AdUnits>): void;
        /**
         * Update the supplied ad unit in the specified publisher AdSense account. This method supports patch semantics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Adunits$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Adunits$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnit>>;
        patch(params: Params$Resource$Accounts$Adunits$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Adunits$Patch, options: MethodOptions | BodyResponseCallback<Schema$AdUnit>, callback: BodyResponseCallback<Schema$AdUnit>): void;
        patch(params: Params$Resource$Accounts$Adunits$Patch, callback: BodyResponseCallback<Schema$AdUnit>): void;
        patch(callback: BodyResponseCallback<Schema$AdUnit>): void;
        /**
         * Update the supplied ad unit in the specified publisher AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Adunits$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Adunits$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdUnit>>;
        update(params: Params$Resource$Accounts$Adunits$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Adunits$Update, options: MethodOptions | BodyResponseCallback<Schema$AdUnit>, callback: BodyResponseCallback<Schema$AdUnit>): void;
        update(params: Params$Resource$Accounts$Adunits$Update, callback: BodyResponseCallback<Schema$AdUnit>): void;
        update(callback: BodyResponseCallback<Schema$AdUnit>): void;
    }
    export interface Params$Resource$Accounts$Adunits$Delete extends StandardParameters {
        /**
         * Account which contains the ad unit.
         */
        accountId?: string;
        /**
         * Ad client for which to get ad unit.
         */
        adClientId?: string;
        /**
         * Ad unit to delete.
         */
        adUnitId?: string;
    }
    export interface Params$Resource$Accounts$Adunits$Get extends StandardParameters {
        /**
         * Account which contains the ad unit.
         */
        accountId?: string;
        /**
         * Ad client for which to get ad unit.
         */
        adClientId?: string;
        /**
         * Ad unit to get.
         */
        adUnitId?: string;
    }
    export interface Params$Resource$Accounts$Adunits$Getadcode extends StandardParameters {
        /**
         * Account which contains the ad client.
         */
        accountId?: string;
        /**
         * Ad client with contains the ad unit.
         */
        adClientId?: string;
        /**
         * Ad unit to get the code for.
         */
        adUnitId?: string;
        /**
         * Host custom channel to attach to the ad code.
         */
        hostCustomChannelId?: string[];
    }
    export interface Params$Resource$Accounts$Adunits$Insert extends StandardParameters {
        /**
         * Account which will contain the ad unit.
         */
        accountId?: string;
        /**
         * Ad client into which to insert the ad unit.
         */
        adClientId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AdUnit;
    }
    export interface Params$Resource$Accounts$Adunits$List extends StandardParameters {
        /**
         * Account which contains the ad client.
         */
        accountId?: string;
        /**
         * Ad client for which to list ad units.
         */
        adClientId?: string;
        /**
         * Whether to include inactive ad units. Default: true.
         */
        includeInactive?: boolean;
        /**
         * The maximum number of ad units to include in the response, used for paging.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through ad units. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Adunits$Patch extends StandardParameters {
        /**
         * Account which contains the ad client.
         */
        accountId?: string;
        /**
         * Ad client which contains the ad unit.
         */
        adClientId?: string;
        /**
         * Ad unit to get.
         */
        adUnitId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AdUnit;
    }
    export interface Params$Resource$Accounts$Adunits$Update extends StandardParameters {
        /**
         * Account which contains the ad client.
         */
        accountId?: string;
        /**
         * Ad client which contains the ad unit.
         */
        adClientId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AdUnit;
    }
    export class Resource$Accounts$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generate(params: Params$Resource$Accounts$Reports$Generate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generate(params?: Params$Resource$Accounts$Reports$Generate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Report>>;
        generate(params: Params$Resource$Accounts$Reports$Generate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generate(params: Params$Resource$Accounts$Reports$Generate, options: MethodOptions | BodyResponseCallback<Schema$Report>, callback: BodyResponseCallback<Schema$Report>): void;
        generate(params: Params$Resource$Accounts$Reports$Generate, callback: BodyResponseCallback<Schema$Report>): void;
        generate(callback: BodyResponseCallback<Schema$Report>): void;
    }
    export interface Params$Resource$Accounts$Reports$Generate extends StandardParameters {
        /**
         * Hosted account upon which to report.
         */
        accountId?: string;
        /**
         * Dimensions to base the report on.
         */
        dimension?: string[];
        /**
         * End of the date range to report on in "YYYY-MM-DD" format, inclusive.
         */
        endDate?: string;
        /**
         * Filters to be run on the report.
         */
        filter?: string[];
        /**
         * Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
         */
        locale?: string;
        /**
         * The maximum number of rows of report data to return.
         */
        maxResults?: number;
        /**
         * Numeric columns to include in the report.
         */
        metric?: string[];
        /**
         * The name of a dimension or metric to sort the resulting report on, optionally prefixed with "+" to sort ascending or "-" to sort descending. If no prefix is specified, the column is sorted ascending.
         */
        sort?: string[];
        /**
         * Start of the date range to report on in "YYYY-MM-DD" format, inclusive.
         */
        startDate?: string;
        /**
         * Index of the first row of report data to return.
         */
        startIndex?: number;
    }
    export class Resource$Adclients {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get information about one of the ad clients in the Host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Adclients$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Adclients$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdClient>>;
        get(params: Params$Resource$Adclients$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Adclients$Get, options: MethodOptions | BodyResponseCallback<Schema$AdClient>, callback: BodyResponseCallback<Schema$AdClient>): void;
        get(params: Params$Resource$Adclients$Get, callback: BodyResponseCallback<Schema$AdClient>): void;
        get(callback: BodyResponseCallback<Schema$AdClient>): void;
        /**
         * List all host ad clients in this AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Adclients$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Adclients$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdClients>>;
        list(params: Params$Resource$Adclients$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Adclients$List, options: MethodOptions | BodyResponseCallback<Schema$AdClients>, callback: BodyResponseCallback<Schema$AdClients>): void;
        list(params: Params$Resource$Adclients$List, callback: BodyResponseCallback<Schema$AdClients>): void;
        list(callback: BodyResponseCallback<Schema$AdClients>): void;
    }
    export interface Params$Resource$Adclients$Get extends StandardParameters {
        /**
         * Ad client to get.
         */
        adClientId?: string;
    }
    export interface Params$Resource$Adclients$List extends StandardParameters {
        /**
         * The maximum number of ad clients to include in the response, used for paging.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export class Resource$Associationsessions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an association session for initiating an association with an AdSense user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        start(params: Params$Resource$Associationsessions$Start, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        start(params?: Params$Resource$Associationsessions$Start, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssociationSession>>;
        start(params: Params$Resource$Associationsessions$Start, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        start(params: Params$Resource$Associationsessions$Start, options: MethodOptions | BodyResponseCallback<Schema$AssociationSession>, callback: BodyResponseCallback<Schema$AssociationSession>): void;
        start(params: Params$Resource$Associationsessions$Start, callback: BodyResponseCallback<Schema$AssociationSession>): void;
        start(callback: BodyResponseCallback<Schema$AssociationSession>): void;
        /**
         * Verify an association session after the association callback returns from AdSense signup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        verify(params: Params$Resource$Associationsessions$Verify, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        verify(params?: Params$Resource$Associationsessions$Verify, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssociationSession>>;
        verify(params: Params$Resource$Associationsessions$Verify, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        verify(params: Params$Resource$Associationsessions$Verify, options: MethodOptions | BodyResponseCallback<Schema$AssociationSession>, callback: BodyResponseCallback<Schema$AssociationSession>): void;
        verify(params: Params$Resource$Associationsessions$Verify, callback: BodyResponseCallback<Schema$AssociationSession>): void;
        verify(callback: BodyResponseCallback<Schema$AssociationSession>): void;
    }
    export interface Params$Resource$Associationsessions$Start extends StandardParameters {
        /**
         * The URL to redirect the user to once association is completed. It receives a token parameter that can then be used to retrieve the associated account.
         */
        callbackUrl?: string;
        /**
         * Products to associate with the user.
         */
        productCode?: string[];
        /**
         * The preferred locale of the user.
         */
        userLocale?: string;
        /**
         * The locale of the user's hosted website.
         */
        websiteLocale?: string;
        /**
         * The URL of the user's hosted website.
         */
        websiteUrl?: string;
    }
    export interface Params$Resource$Associationsessions$Verify extends StandardParameters {
        /**
         * The token returned to the association callback URL.
         */
        token?: string;
    }
    export class Resource$Customchannels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Delete a specific custom channel from the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Customchannels$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Customchannels$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannel>>;
        delete(params: Params$Resource$Customchannels$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Customchannels$Delete, options: MethodOptions | BodyResponseCallback<Schema$CustomChannel>, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        delete(params: Params$Resource$Customchannels$Delete, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        delete(callback: BodyResponseCallback<Schema$CustomChannel>): void;
        /**
         * Get a specific custom channel from the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Customchannels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Customchannels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannel>>;
        get(params: Params$Resource$Customchannels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Customchannels$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomChannel>, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        get(params: Params$Resource$Customchannels$Get, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        get(callback: BodyResponseCallback<Schema$CustomChannel>): void;
        /**
         * Add a new custom channel to the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Customchannels$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Customchannels$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannel>>;
        insert(params: Params$Resource$Customchannels$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Customchannels$Insert, options: MethodOptions | BodyResponseCallback<Schema$CustomChannel>, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        insert(params: Params$Resource$Customchannels$Insert, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        insert(callback: BodyResponseCallback<Schema$CustomChannel>): void;
        /**
         * List all host custom channels in this AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Customchannels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Customchannels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannels>>;
        list(params: Params$Resource$Customchannels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Customchannels$List, options: MethodOptions | BodyResponseCallback<Schema$CustomChannels>, callback: BodyResponseCallback<Schema$CustomChannels>): void;
        list(params: Params$Resource$Customchannels$List, callback: BodyResponseCallback<Schema$CustomChannels>): void;
        list(callback: BodyResponseCallback<Schema$CustomChannels>): void;
        /**
         * Update a custom channel in the host AdSense account. This method supports patch semantics.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Customchannels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Customchannels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannel>>;
        patch(params: Params$Resource$Customchannels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Customchannels$Patch, options: MethodOptions | BodyResponseCallback<Schema$CustomChannel>, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        patch(params: Params$Resource$Customchannels$Patch, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        patch(callback: BodyResponseCallback<Schema$CustomChannel>): void;
        /**
         * Update a custom channel in the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Customchannels$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Customchannels$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomChannel>>;
        update(params: Params$Resource$Customchannels$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Customchannels$Update, options: MethodOptions | BodyResponseCallback<Schema$CustomChannel>, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        update(params: Params$Resource$Customchannels$Update, callback: BodyResponseCallback<Schema$CustomChannel>): void;
        update(callback: BodyResponseCallback<Schema$CustomChannel>): void;
    }
    export interface Params$Resource$Customchannels$Delete extends StandardParameters {
        /**
         * Ad client from which to delete the custom channel.
         */
        adClientId?: string;
        /**
         * Custom channel to delete.
         */
        customChannelId?: string;
    }
    export interface Params$Resource$Customchannels$Get extends StandardParameters {
        /**
         * Ad client from which to get the custom channel.
         */
        adClientId?: string;
        /**
         * Custom channel to get.
         */
        customChannelId?: string;
    }
    export interface Params$Resource$Customchannels$Insert extends StandardParameters {
        /**
         * Ad client to which the new custom channel will be added.
         */
        adClientId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomChannel;
    }
    export interface Params$Resource$Customchannels$List extends StandardParameters {
        /**
         * Ad client for which to list custom channels.
         */
        adClientId?: string;
        /**
         * The maximum number of custom channels to include in the response, used for paging.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through custom channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Customchannels$Patch extends StandardParameters {
        /**
         * Ad client in which the custom channel will be updated.
         */
        adClientId?: string;
        /**
         * Custom channel to get.
         */
        customChannelId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomChannel;
    }
    export interface Params$Resource$Customchannels$Update extends StandardParameters {
        /**
         * Ad client in which the custom channel will be updated.
         */
        adClientId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomChannel;
    }
    export class Resource$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generate(params: Params$Resource$Reports$Generate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generate(params?: Params$Resource$Reports$Generate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Report>>;
        generate(params: Params$Resource$Reports$Generate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generate(params: Params$Resource$Reports$Generate, options: MethodOptions | BodyResponseCallback<Schema$Report>, callback: BodyResponseCallback<Schema$Report>): void;
        generate(params: Params$Resource$Reports$Generate, callback: BodyResponseCallback<Schema$Report>): void;
        generate(callback: BodyResponseCallback<Schema$Report>): void;
    }
    export interface Params$Resource$Reports$Generate extends StandardParameters {
        /**
         * Dimensions to base the report on.
         */
        dimension?: string[];
        /**
         * End of the date range to report on in "YYYY-MM-DD" format, inclusive.
         */
        endDate?: string;
        /**
         * Filters to be run on the report.
         */
        filter?: string[];
        /**
         * Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
         */
        locale?: string;
        /**
         * The maximum number of rows of report data to return.
         */
        maxResults?: number;
        /**
         * Numeric columns to include in the report.
         */
        metric?: string[];
        /**
         * The name of a dimension or metric to sort the resulting report on, optionally prefixed with "+" to sort ascending or "-" to sort descending. If no prefix is specified, the column is sorted ascending.
         */
        sort?: string[];
        /**
         * Start of the date range to report on in "YYYY-MM-DD" format, inclusive.
         */
        startDate?: string;
        /**
         * Index of the first row of report data to return.
         */
        startIndex?: number;
    }
    export class Resource$Urlchannels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Delete a URL channel from the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Urlchannels$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Urlchannels$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UrlChannel>>;
        delete(params: Params$Resource$Urlchannels$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Urlchannels$Delete, options: MethodOptions | BodyResponseCallback<Schema$UrlChannel>, callback: BodyResponseCallback<Schema$UrlChannel>): void;
        delete(params: Params$Resource$Urlchannels$Delete, callback: BodyResponseCallback<Schema$UrlChannel>): void;
        delete(callback: BodyResponseCallback<Schema$UrlChannel>): void;
        /**
         * Add a new URL channel to the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Urlchannels$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Urlchannels$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UrlChannel>>;
        insert(params: Params$Resource$Urlchannels$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Urlchannels$Insert, options: MethodOptions | BodyResponseCallback<Schema$UrlChannel>, callback: BodyResponseCallback<Schema$UrlChannel>): void;
        insert(params: Params$Resource$Urlchannels$Insert, callback: BodyResponseCallback<Schema$UrlChannel>): void;
        insert(callback: BodyResponseCallback<Schema$UrlChannel>): void;
        /**
         * List all host URL channels in the host AdSense account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Urlchannels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Urlchannels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UrlChannels>>;
        list(params: Params$Resource$Urlchannels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Urlchannels$List, options: MethodOptions | BodyResponseCallback<Schema$UrlChannels>, callback: BodyResponseCallback<Schema$UrlChannels>): void;
        list(params: Params$Resource$Urlchannels$List, callback: BodyResponseCallback<Schema$UrlChannels>): void;
        list(callback: BodyResponseCallback<Schema$UrlChannels>): void;
    }
    export interface Params$Resource$Urlchannels$Delete extends StandardParameters {
        /**
         * Ad client from which to delete the URL channel.
         */
        adClientId?: string;
        /**
         * URL channel to delete.
         */
        urlChannelId?: string;
    }
    export interface Params$Resource$Urlchannels$Insert extends StandardParameters {
        /**
         * Ad client to which the new URL channel will be added.
         */
        adClientId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UrlChannel;
    }
    export interface Params$Resource$Urlchannels$List extends StandardParameters {
        /**
         * Ad client for which to list URL channels.
         */
        adClientId?: string;
        /**
         * The maximum number of URL channels to include in the response, used for paging.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through URL channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export {};
}
