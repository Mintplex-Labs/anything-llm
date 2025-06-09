import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace adexchangebuyer_v1_3 {
    export interface Options extends GlobalOptions {
        version: 'v1.3';
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
     * Ad Exchange Buyer API
     *
     * Accesses your bidding-account information, submits creatives for validation, finds available direct deals, and retrieves performance reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const adexchangebuyer = google.adexchangebuyer('v1.3');
     * ```
     */
    export class Adexchangebuyer {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        billingInfo: Resource$Billinginfo;
        budget: Resource$Budget;
        creatives: Resource$Creatives;
        directDeals: Resource$Directdeals;
        performanceReport: Resource$Performancereport;
        pretargetingConfig: Resource$Pretargetingconfig;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Configuration data for an Ad Exchange buyer account.
     */
    export interface Schema$Account {
        /**
         * Your bidder locations that have distinct URLs.
         */
        bidderLocation?: Array<{
            maximumQps?: number;
            region?: string;
            url?: string;
        }> | null;
        /**
         * The nid parameter value used in cookie match requests. Please contact your technical account manager if you need to change this.
         */
        cookieMatchingNid?: string | null;
        /**
         * The base URL used in cookie match requests.
         */
        cookieMatchingUrl?: string | null;
        /**
         * Account id.
         */
        id?: number | null;
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * The maximum number of active creatives that an account can have, where a creative is active if it was inserted or bid with in the last 30 days. Please contact your technical account manager if you need to change this.
         */
        maximumActiveCreatives?: number | null;
        /**
         * The sum of all bidderLocation.maximumQps values cannot exceed this. Please contact your technical account manager if you need to change this.
         */
        maximumTotalQps?: number | null;
        /**
         * The number of creatives that this account inserted or bid with in the last 30 days.
         */
        numberActiveCreatives?: number | null;
    }
    /**
     * An account feed lists Ad Exchange buyer accounts that the user has access to. Each entry in the feed corresponds to a single buyer account.
     */
    export interface Schema$AccountsList {
        /**
         * A list of accounts.
         */
        items?: Schema$Account[];
        /**
         * Resource type.
         */
        kind?: string | null;
    }
    /**
     * The configuration data for an Ad Exchange billing info.
     */
    export interface Schema$BillingInfo {
        /**
         * Account id.
         */
        accountId?: number | null;
        /**
         * Account name.
         */
        accountName?: string | null;
        /**
         * A list of adgroup IDs associated with this particular account. These IDs may show up as part of a realtime bidding BidRequest, which indicates a bid request for this account.
         */
        billingId?: string[] | null;
        /**
         * Resource type.
         */
        kind?: string | null;
    }
    /**
     * A billing info feed lists Billing Info the Ad Exchange buyer account has access to. Each entry in the feed corresponds to a single billing info.
     */
    export interface Schema$BillingInfoList {
        /**
         * A list of billing info relevant for your account.
         */
        items?: Schema$BillingInfo[];
        /**
         * Resource type.
         */
        kind?: string | null;
    }
    /**
     * The configuration data for Ad Exchange RTB - Budget API.
     */
    export interface Schema$Budget {
        /**
         * The id of the account. This is required for get and update requests.
         */
        accountId?: string | null;
        /**
         * The billing id to determine which adgroup to provide budget information for. This is required for get and update requests.
         */
        billingId?: string | null;
        /**
         * The daily budget amount in unit amount of the account currency to apply for the billingId provided. This is required for update requests.
         */
        budgetAmount?: string | null;
        /**
         * The currency code for the buyer. This cannot be altered here.
         */
        currencyCode?: string | null;
        /**
         * The unique id that describes this item.
         */
        id?: string | null;
        /**
         * The kind of the resource, i.e. "adexchangebuyer#budget".
         */
        kind?: string | null;
    }
    /**
     * A creative and its classification data.
     */
    export interface Schema$Creative {
        /**
         * Account id.
         */
        accountId?: number | null;
        adTechnologyProviders?: {
            detectedProviderIds?: string[];
            hasUnidentifiedProvider?: boolean;
        } | null;
        /**
         * Detected advertiser id, if any. Read-only. This field should not be set in requests.
         */
        advertiserId?: string[] | null;
        /**
         * The name of the company being advertised in the creative.
         */
        advertiserName?: string | null;
        /**
         * The agency id for this creative.
         */
        agencyId?: string | null;
        /**
         * The last upload timestamp of this creative if it was uploaded via API. Read-only. The value of this field is generated, and will be ignored for uploads. (formatted RFC 3339 timestamp).
         */
        apiUploadTimestamp?: string | null;
        /**
         * All attributes for the ads that may be shown from this snippet.
         */
        attribute?: number[] | null;
        /**
         * A buyer-specific id identifying the creative in this ad.
         */
        buyerCreativeId?: string | null;
        /**
         * The set of destination urls for the snippet.
         */
        clickThroughUrl?: string[] | null;
        /**
         * Shows any corrections that were applied to this creative. Read-only. This field should not be set in requests.
         */
        corrections?: Array<{
            details?: string[];
            reason?: string;
        }> | null;
        /**
         * The reasons for disapproval, if any. Note that not all disapproval reasons may be categorized, so it is possible for the creative to have a status of DISAPPROVED with an empty list for disapproval_reasons. In this case, please reach out to your TAM to help debug the issue. Read-only. This field should not be set in requests.
         */
        disapprovalReasons?: Array<{
            details?: string[];
            reason?: string;
        }> | null;
        /**
         * The filtering reasons for the creative. Read-only. This field should not be set in requests.
         */
        filteringReasons?: {
            date?: string;
            reasons?: Array<{
                filteringCount?: string;
                filteringStatus?: number;
            }>;
        } | null;
        /**
         * Ad height.
         */
        height?: number | null;
        /**
         * The HTML snippet that displays the ad when inserted in the web page. If set, videoURL should not be set.
         */
        HTMLSnippet?: string | null;
        /**
         * The set of urls to be called to record an impression.
         */
        impressionTrackingUrl?: string[] | null;
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * If nativeAd is set, HTMLSnippet and videoURL should not be set.
         */
        nativeAd?: {
            advertiser?: string;
            appIcon?: {
                height?: number;
                url?: string;
                width?: number;
            };
            body?: string;
            callToAction?: string;
            clickTrackingUrl?: string;
            headline?: string;
            image?: {
                height?: number;
                url?: string;
                width?: number;
            };
            impressionTrackingUrl?: string[];
            logo?: {
                height?: number;
                url?: string;
                width?: number;
            };
            price?: string;
            starRating?: number;
        } | null;
        /**
         * Detected product categories, if any. Read-only. This field should not be set in requests.
         */
        productCategories?: number[] | null;
        /**
         * All restricted categories for the ads that may be shown from this snippet.
         */
        restrictedCategories?: number[] | null;
        /**
         * Detected sensitive categories, if any. Read-only. This field should not be set in requests.
         */
        sensitiveCategories?: number[] | null;
        /**
         * Creative serving status. Read-only. This field should not be set in requests.
         */
        status?: string | null;
        /**
         * All vendor types for the ads that may be shown from this snippet.
         */
        vendorType?: number[] | null;
        /**
         * The version for this creative. Read-only. This field should not be set in requests.
         */
        version?: number | null;
        /**
         * The URL to fetch a video ad. If set, HTMLSnippet and the nativeAd should not be set.
         */
        videoURL?: string | null;
        /**
         * Ad width.
         */
        width?: number | null;
    }
    /**
     * The creatives feed lists the active creatives for the Ad Exchange buyer accounts that the user has access to. Each entry in the feed corresponds to a single creative.
     */
    export interface Schema$CreativesList {
        /**
         * A list of creatives.
         */
        items?: Schema$Creative[];
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * Continuation token used to page through creatives. To retrieve the next page of results, set the next request's "pageToken" value to this.
         */
        nextPageToken?: string | null;
    }
    /**
     * The configuration data for an Ad Exchange direct deal.
     */
    export interface Schema$DirectDeal {
        /**
         * The account id of the buyer this deal is for.
         */
        accountId?: number | null;
        /**
         * The name of the advertiser this deal is for.
         */
        advertiser?: string | null;
        /**
         * Whether the publisher for this deal is eligible for alcohol ads.
         */
        allowsAlcohol?: boolean | null;
        /**
         * The account id that this deal was negotiated for. It is either the buyer or the client that this deal was negotiated on behalf of.
         */
        buyerAccountId?: string | null;
        /**
         * The currency code that applies to the fixed_cpm value. If not set then assumed to be USD.
         */
        currencyCode?: string | null;
        /**
         * The deal type such as programmatic reservation or fixed price and so on.
         */
        dealTier?: string | null;
        /**
         * End time for when this deal stops being active. If not set then this deal is valid until manually disabled by the publisher. In seconds since the epoch.
         */
        endTime?: string | null;
        /**
         * The fixed price for this direct deal. In cpm micros of currency according to currency_code. If set, then this deal is eligible for the fixed price tier of buying (highest priority, pay exactly the configured fixed price).
         */
        fixedCpm?: string | null;
        /**
         * Deal id.
         */
        id?: string | null;
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * Deal name.
         */
        name?: string | null;
        /**
         * The minimum price for this direct deal. In cpm micros of currency according to currency_code. If set, then this deal is eligible for the private exchange tier of buying (below fixed price priority, run as a second price auction).
         */
        privateExchangeMinCpm?: string | null;
        /**
         * If true, the publisher has opted to have their blocks ignored when a creative is bid with for this deal.
         */
        publisherBlocksOverriden?: boolean | null;
        /**
         * The name of the publisher offering this direct deal.
         */
        sellerNetwork?: string | null;
        /**
         * Start time for when this deal becomes active. If not set then this deal is active immediately upon creation. In seconds since the epoch.
         */
        startTime?: string | null;
    }
    /**
     * A direct deals feed lists Direct Deals the Ad Exchange buyer account has access to. This includes direct deals set up for the buyer account as well as its merged stream seats.
     */
    export interface Schema$DirectDealsList {
        /**
         * A list of direct deals relevant for your account.
         */
        directDeals?: Schema$DirectDeal[];
        /**
         * Resource type.
         */
        kind?: string | null;
    }
    /**
     * The configuration data for an Ad Exchange performance report list.
     */
    export interface Schema$PerformanceReport {
        /**
         * The number of bid responses with an ad.
         */
        bidRate?: number | null;
        /**
         * The number of bid requests sent to your bidder.
         */
        bidRequestRate?: number | null;
        /**
         * Rate of various prefiltering statuses per match. Please refer to the callout-status-codes.txt file for different statuses.
         */
        calloutStatusRate?: any[] | null;
        /**
         * Average QPS for cookie matcher operations.
         */
        cookieMatcherStatusRate?: any[] | null;
        /**
         * Rate of ads with a given status. Please refer to the creative-status-codes.txt file for different statuses.
         */
        creativeStatusRate?: any[] | null;
        /**
         * The number of bid responses that were filtered due to a policy violation or other errors.
         */
        filteredBidRate?: number | null;
        /**
         * Average QPS for hosted match operations.
         */
        hostedMatchStatusRate?: any[] | null;
        /**
         * The number of potential queries based on your pretargeting settings.
         */
        inventoryMatchRate?: number | null;
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * The 50th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
         */
        latency50thPercentile?: number | null;
        /**
         * The 85th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
         */
        latency85thPercentile?: number | null;
        /**
         * The 95th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
         */
        latency95thPercentile?: number | null;
        /**
         * Rate of various quota account statuses per quota check.
         */
        noQuotaInRegion?: number | null;
        /**
         * Rate of various quota account statuses per quota check.
         */
        outOfQuota?: number | null;
        /**
         * Average QPS for pixel match requests from clients.
         */
        pixelMatchRequests?: number | null;
        /**
         * Average QPS for pixel match responses from clients.
         */
        pixelMatchResponses?: number | null;
        /**
         * The configured quota limits for this account.
         */
        quotaConfiguredLimit?: number | null;
        /**
         * The throttled quota limits for this account.
         */
        quotaThrottledLimit?: number | null;
        /**
         * The trading location of this data.
         */
        region?: string | null;
        /**
         * The number of properly formed bid responses received by our servers within the deadline.
         */
        successfulRequestRate?: number | null;
        /**
         * The unix timestamp of the starting time of this performance data.
         */
        timestamp?: string | null;
        /**
         * The number of bid responses that were unsuccessful due to timeouts, incorrect formatting, etc.
         */
        unsuccessfulRequestRate?: number | null;
    }
    /**
     * The configuration data for an Ad Exchange performance report list.
     */
    export interface Schema$PerformanceReportList {
        /**
         * Resource type.
         */
        kind?: string | null;
        /**
         * A list of performance reports relevant for the account.
         */
        performanceReport?: Schema$PerformanceReport[];
    }
    export interface Schema$PretargetingConfig {
        /**
         * The id for billing purposes, provided for reference. Leave this field blank for insert requests; the id will be generated automatically.
         */
        billingId?: string | null;
        /**
         * The config id; generated automatically. Leave this field blank for insert requests.
         */
        configId?: string | null;
        /**
         * The name of the config. Must be unique. Required for all requests.
         */
        configName?: string | null;
        /**
         * List must contain exactly one of PRETARGETING_CREATIVE_TYPE_HTML or PRETARGETING_CREATIVE_TYPE_VIDEO.
         */
        creativeType?: string[] | null;
        /**
         * Requests which allow one of these (width, height) pairs will match. All pairs must be supported ad dimensions.
         */
        dimensions?: Array<{
            height?: string;
            width?: string;
        }> | null;
        /**
         * Requests with any of these content labels will not match. Values are from content-labels.txt in the downloadable files section.
         */
        excludedContentLabels?: string[] | null;
        /**
         * Requests containing any of these geo criteria ids will not match.
         */
        excludedGeoCriteriaIds?: string[] | null;
        /**
         * Requests containing any of these placements will not match.
         */
        excludedPlacements?: Array<{
            token?: string;
            type?: string;
        }> | null;
        /**
         * Requests containing any of these users list ids will not match.
         */
        excludedUserLists?: string[] | null;
        /**
         * Requests containing any of these vertical ids will not match. Values are from the publisher-verticals.txt file in the downloadable files section.
         */
        excludedVerticals?: string[] | null;
        /**
         * Requests containing any of these geo criteria ids will match.
         */
        geoCriteriaIds?: string[] | null;
        /**
         * Whether this config is active. Required for all requests.
         */
        isActive?: boolean | null;
        /**
         * The kind of the resource, i.e. "adexchangebuyer#pretargetingConfig".
         */
        kind?: string | null;
        /**
         * Request containing any of these language codes will match.
         */
        languages?: string[] | null;
        /**
         * The maximum QPS allocated to this pretargeting configuration, used for pretargeting-level QPS limits. By default, this is not set, which indicates that there is no QPS limit at the configuration level (a global or account-level limit may still be imposed).
         */
        maximumQps?: string | null;
        /**
         * Requests containing any of these mobile carrier ids will match. Values are from mobile-carriers.csv in the downloadable files section.
         */
        mobileCarriers?: string[] | null;
        /**
         * Requests containing any of these mobile device ids will match. Values are from mobile-devices.csv in the downloadable files section.
         */
        mobileDevices?: string[] | null;
        /**
         * Requests containing any of these mobile operating system version ids will match. Values are from mobile-os.csv in the downloadable files section.
         */
        mobileOperatingSystemVersions?: string[] | null;
        /**
         * Requests containing any of these placements will match.
         */
        placements?: Array<{
            token?: string;
            type?: string;
        }> | null;
        /**
         * Requests matching any of these platforms will match. Possible values are PRETARGETING_PLATFORM_MOBILE, PRETARGETING_PLATFORM_DESKTOP, and PRETARGETING_PLATFORM_TABLET.
         */
        platforms?: string[] | null;
        /**
         * Creative attributes should be declared here if all creatives corresponding to this pretargeting configuration have that creative attribute. Values are from pretargetable-creative-attributes.txt in the downloadable files section.
         */
        supportedCreativeAttributes?: string[] | null;
        /**
         * Requests containing any of these user list ids will match.
         */
        userLists?: string[] | null;
        /**
         * Requests that allow any of these vendor ids will match. Values are from vendors.txt in the downloadable files section.
         */
        vendorTypes?: string[] | null;
        /**
         * Requests containing any of these vertical ids will match.
         */
        verticals?: string[] | null;
    }
    export interface Schema$PretargetingConfigList {
        /**
         * A list of pretargeting configs
         */
        items?: Schema$PretargetingConfig[];
        /**
         * Resource type.
         */
        kind?: string | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets one account by ID.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.accounts.get({
         *     // The account id
         *     id: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bidderLocation": [],
         *   //   "cookieMatchingNid": "my_cookieMatchingNid",
         *   //   "cookieMatchingUrl": "my_cookieMatchingUrl",
         *   //   "id": 0,
         *   //   "kind": "my_kind",
         *   //   "maximumActiveCreatives": 0,
         *   //   "maximumTotalQps": 0,
         *   //   "numberActiveCreatives": 0
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
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Account>>;
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Get, options: MethodOptions | BodyResponseCallback<Schema$Account>, callback: BodyResponseCallback<Schema$Account>): void;
        get(params: Params$Resource$Accounts$Get, callback: BodyResponseCallback<Schema$Account>): void;
        get(callback: BodyResponseCallback<Schema$Account>): void;
        /**
         * Retrieves the authenticated user's list of accounts.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.accounts.list({});
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
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
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccountsList>>;
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$List, options: MethodOptions | BodyResponseCallback<Schema$AccountsList>, callback: BodyResponseCallback<Schema$AccountsList>): void;
        list(params: Params$Resource$Accounts$List, callback: BodyResponseCallback<Schema$AccountsList>): void;
        list(callback: BodyResponseCallback<Schema$AccountsList>): void;
        /**
         * Updates an existing account. This method supports patch semantics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.accounts.patch({
         *     // The account id
         *     id: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bidderLocation": [],
         *       //   "cookieMatchingNid": "my_cookieMatchingNid",
         *       //   "cookieMatchingUrl": "my_cookieMatchingUrl",
         *       //   "id": 0,
         *       //   "kind": "my_kind",
         *       //   "maximumActiveCreatives": 0,
         *       //   "maximumTotalQps": 0,
         *       //   "numberActiveCreatives": 0
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bidderLocation": [],
         *   //   "cookieMatchingNid": "my_cookieMatchingNid",
         *   //   "cookieMatchingUrl": "my_cookieMatchingUrl",
         *   //   "id": 0,
         *   //   "kind": "my_kind",
         *   //   "maximumActiveCreatives": 0,
         *   //   "maximumTotalQps": 0,
         *   //   "numberActiveCreatives": 0
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
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Account>>;
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Patch, options: MethodOptions | BodyResponseCallback<Schema$Account>, callback: BodyResponseCallback<Schema$Account>): void;
        patch(params: Params$Resource$Accounts$Patch, callback: BodyResponseCallback<Schema$Account>): void;
        patch(callback: BodyResponseCallback<Schema$Account>): void;
        /**
         * Updates an existing account.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.accounts.update({
         *     // The account id
         *     id: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bidderLocation": [],
         *       //   "cookieMatchingNid": "my_cookieMatchingNid",
         *       //   "cookieMatchingUrl": "my_cookieMatchingUrl",
         *       //   "id": 0,
         *       //   "kind": "my_kind",
         *       //   "maximumActiveCreatives": 0,
         *       //   "maximumTotalQps": 0,
         *       //   "numberActiveCreatives": 0
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bidderLocation": [],
         *   //   "cookieMatchingNid": "my_cookieMatchingNid",
         *   //   "cookieMatchingUrl": "my_cookieMatchingUrl",
         *   //   "id": 0,
         *   //   "kind": "my_kind",
         *   //   "maximumActiveCreatives": 0,
         *   //   "maximumTotalQps": 0,
         *   //   "numberActiveCreatives": 0
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
        update(params: Params$Resource$Accounts$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Account>>;
        update(params: Params$Resource$Accounts$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Update, options: MethodOptions | BodyResponseCallback<Schema$Account>, callback: BodyResponseCallback<Schema$Account>): void;
        update(params: Params$Resource$Accounts$Update, callback: BodyResponseCallback<Schema$Account>): void;
        update(callback: BodyResponseCallback<Schema$Account>): void;
    }
    export interface Params$Resource$Accounts$Get extends StandardParameters {
        /**
         * The account id
         */
        id?: number;
    }
    export interface Params$Resource$Accounts$List extends StandardParameters {
    }
    export interface Params$Resource$Accounts$Patch extends StandardParameters {
        /**
         * The account id
         */
        id?: number;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Account;
    }
    export interface Params$Resource$Accounts$Update extends StandardParameters {
        /**
         * The account id
         */
        id?: number;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Account;
    }
    export class Resource$Billinginfo {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns the billing information for one account specified by account ID.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.billingInfo.get({
         *     // The account id.
         *     accountId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "accountId": 0,
         *   //   "accountName": "my_accountName",
         *   //   "billingId": [],
         *   //   "kind": "my_kind"
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
        get(params: Params$Resource$Billinginfo$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Billinginfo$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BillingInfo>>;
        get(params: Params$Resource$Billinginfo$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Billinginfo$Get, options: MethodOptions | BodyResponseCallback<Schema$BillingInfo>, callback: BodyResponseCallback<Schema$BillingInfo>): void;
        get(params: Params$Resource$Billinginfo$Get, callback: BodyResponseCallback<Schema$BillingInfo>): void;
        get(callback: BodyResponseCallback<Schema$BillingInfo>): void;
        /**
         * Retrieves a list of billing information for all accounts of the authenticated user.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.billingInfo.list({});
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
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
        list(params: Params$Resource$Billinginfo$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Billinginfo$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BillingInfoList>>;
        list(params: Params$Resource$Billinginfo$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Billinginfo$List, options: MethodOptions | BodyResponseCallback<Schema$BillingInfoList>, callback: BodyResponseCallback<Schema$BillingInfoList>): void;
        list(params: Params$Resource$Billinginfo$List, callback: BodyResponseCallback<Schema$BillingInfoList>): void;
        list(callback: BodyResponseCallback<Schema$BillingInfoList>): void;
    }
    export interface Params$Resource$Billinginfo$Get extends StandardParameters {
        /**
         * The account id.
         */
        accountId?: number;
    }
    export interface Params$Resource$Billinginfo$List extends StandardParameters {
    }
    export class Resource$Budget {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns the budget information for the adgroup specified by the accountId and billingId.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.budget.get({
         *     // The account id to get the budget information for.
         *     accountId: 'placeholder-value',
         *     // The billing id to get the budget information for.
         *     billingId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "accountId": "my_accountId",
         *   //   "billingId": "my_billingId",
         *   //   "budgetAmount": "my_budgetAmount",
         *   //   "currencyCode": "my_currencyCode",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind"
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
        get(params: Params$Resource$Budget$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Budget$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Budget>>;
        get(params: Params$Resource$Budget$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Budget$Get, options: MethodOptions | BodyResponseCallback<Schema$Budget>, callback: BodyResponseCallback<Schema$Budget>): void;
        get(params: Params$Resource$Budget$Get, callback: BodyResponseCallback<Schema$Budget>): void;
        get(callback: BodyResponseCallback<Schema$Budget>): void;
        /**
         * Updates the budget amount for the budget of the adgroup specified by the accountId and billingId, with the budget amount in the request. This method supports patch semantics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.budget.patch({
         *     // The account id associated with the budget being updated.
         *     accountId: 'placeholder-value',
         *     // The billing id associated with the budget being updated.
         *     billingId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "accountId": "my_accountId",
         *       //   "billingId": "my_billingId",
         *       //   "budgetAmount": "my_budgetAmount",
         *       //   "currencyCode": "my_currencyCode",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "accountId": "my_accountId",
         *   //   "billingId": "my_billingId",
         *   //   "budgetAmount": "my_budgetAmount",
         *   //   "currencyCode": "my_currencyCode",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind"
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
        patch(params: Params$Resource$Budget$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Budget$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Budget>>;
        patch(params: Params$Resource$Budget$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Budget$Patch, options: MethodOptions | BodyResponseCallback<Schema$Budget>, callback: BodyResponseCallback<Schema$Budget>): void;
        patch(params: Params$Resource$Budget$Patch, callback: BodyResponseCallback<Schema$Budget>): void;
        patch(callback: BodyResponseCallback<Schema$Budget>): void;
        /**
         * Updates the budget amount for the budget of the adgroup specified by the accountId and billingId, with the budget amount in the request.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.budget.update({
         *     // The account id associated with the budget being updated.
         *     accountId: 'placeholder-value',
         *     // The billing id associated with the budget being updated.
         *     billingId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "accountId": "my_accountId",
         *       //   "billingId": "my_billingId",
         *       //   "budgetAmount": "my_budgetAmount",
         *       //   "currencyCode": "my_currencyCode",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "accountId": "my_accountId",
         *   //   "billingId": "my_billingId",
         *   //   "budgetAmount": "my_budgetAmount",
         *   //   "currencyCode": "my_currencyCode",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind"
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
        update(params: Params$Resource$Budget$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Budget$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Budget>>;
        update(params: Params$Resource$Budget$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Budget$Update, options: MethodOptions | BodyResponseCallback<Schema$Budget>, callback: BodyResponseCallback<Schema$Budget>): void;
        update(params: Params$Resource$Budget$Update, callback: BodyResponseCallback<Schema$Budget>): void;
        update(callback: BodyResponseCallback<Schema$Budget>): void;
    }
    export interface Params$Resource$Budget$Get extends StandardParameters {
        /**
         * The account id to get the budget information for.
         */
        accountId?: string;
        /**
         * The billing id to get the budget information for.
         */
        billingId?: string;
    }
    export interface Params$Resource$Budget$Patch extends StandardParameters {
        /**
         * The account id associated with the budget being updated.
         */
        accountId?: string;
        /**
         * The billing id associated with the budget being updated.
         */
        billingId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Budget;
    }
    export interface Params$Resource$Budget$Update extends StandardParameters {
        /**
         * The account id associated with the budget being updated.
         */
        accountId?: string;
        /**
         * The billing id associated with the budget being updated.
         */
        billingId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Budget;
    }
    export class Resource$Creatives {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the status for a single creative. A creative will be available 30-40 minutes after submission.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.creatives.get({
         *     // The id for the account that will serve this creative.
         *     accountId: 'placeholder-value',
         *     // The buyer-specific id for this creative.
         *     buyerCreativeId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "HTMLSnippet": "my_HTMLSnippet",
         *   //   "accountId": 0,
         *   //   "adTechnologyProviders": {},
         *   //   "advertiserId": [],
         *   //   "advertiserName": "my_advertiserName",
         *   //   "agencyId": "my_agencyId",
         *   //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *   //   "attribute": [],
         *   //   "buyerCreativeId": "my_buyerCreativeId",
         *   //   "clickThroughUrl": [],
         *   //   "corrections": [],
         *   //   "disapprovalReasons": [],
         *   //   "filteringReasons": {},
         *   //   "height": 0,
         *   //   "impressionTrackingUrl": [],
         *   //   "kind": "my_kind",
         *   //   "nativeAd": {},
         *   //   "productCategories": [],
         *   //   "restrictedCategories": [],
         *   //   "sensitiveCategories": [],
         *   //   "status": "my_status",
         *   //   "vendorType": [],
         *   //   "version": 0,
         *   //   "videoURL": "my_videoURL",
         *   //   "width": 0
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
        get(params: Params$Resource$Creatives$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Creatives$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        get(params: Params$Resource$Creatives$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Creatives$Get, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        get(params: Params$Resource$Creatives$Get, callback: BodyResponseCallback<Schema$Creative>): void;
        get(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Submit a new creative.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.creatives.insert({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "HTMLSnippet": "my_HTMLSnippet",
         *       //   "accountId": 0,
         *       //   "adTechnologyProviders": {},
         *       //   "advertiserId": [],
         *       //   "advertiserName": "my_advertiserName",
         *       //   "agencyId": "my_agencyId",
         *       //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *       //   "attribute": [],
         *       //   "buyerCreativeId": "my_buyerCreativeId",
         *       //   "clickThroughUrl": [],
         *       //   "corrections": [],
         *       //   "disapprovalReasons": [],
         *       //   "filteringReasons": {},
         *       //   "height": 0,
         *       //   "impressionTrackingUrl": [],
         *       //   "kind": "my_kind",
         *       //   "nativeAd": {},
         *       //   "productCategories": [],
         *       //   "restrictedCategories": [],
         *       //   "sensitiveCategories": [],
         *       //   "status": "my_status",
         *       //   "vendorType": [],
         *       //   "version": 0,
         *       //   "videoURL": "my_videoURL",
         *       //   "width": 0
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "HTMLSnippet": "my_HTMLSnippet",
         *   //   "accountId": 0,
         *   //   "adTechnologyProviders": {},
         *   //   "advertiserId": [],
         *   //   "advertiserName": "my_advertiserName",
         *   //   "agencyId": "my_agencyId",
         *   //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *   //   "attribute": [],
         *   //   "buyerCreativeId": "my_buyerCreativeId",
         *   //   "clickThroughUrl": [],
         *   //   "corrections": [],
         *   //   "disapprovalReasons": [],
         *   //   "filteringReasons": {},
         *   //   "height": 0,
         *   //   "impressionTrackingUrl": [],
         *   //   "kind": "my_kind",
         *   //   "nativeAd": {},
         *   //   "productCategories": [],
         *   //   "restrictedCategories": [],
         *   //   "sensitiveCategories": [],
         *   //   "status": "my_status",
         *   //   "vendorType": [],
         *   //   "version": 0,
         *   //   "videoURL": "my_videoURL",
         *   //   "width": 0
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
        insert(params: Params$Resource$Creatives$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Creatives$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        insert(params: Params$Resource$Creatives$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Creatives$Insert, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        insert(params: Params$Resource$Creatives$Insert, callback: BodyResponseCallback<Schema$Creative>): void;
        insert(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Retrieves a list of the authenticated user's active creatives. A creative will be available 30-40 minutes after submission.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.creatives.list({
         *     // When specified, only creatives for the given account ids are returned.
         *     accountId: 'placeholder-value',
         *     // When specified, only creatives for the given buyer creative ids are returned.
         *     buyerCreativeId: 'placeholder-value',
         *     // Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         *     maxResults: 'placeholder-value',
         *     // A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         *     pageToken: 'placeholder-value',
         *     // When specified, only creatives having the given status are returned.
         *     statusFilter: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken"
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
        list(params: Params$Resource$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CreativesList>>;
        list(params: Params$Resource$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$CreativesList>, callback: BodyResponseCallback<Schema$CreativesList>): void;
        list(params: Params$Resource$Creatives$List, callback: BodyResponseCallback<Schema$CreativesList>): void;
        list(callback: BodyResponseCallback<Schema$CreativesList>): void;
    }
    export interface Params$Resource$Creatives$Get extends StandardParameters {
        /**
         * The id for the account that will serve this creative.
         */
        accountId?: number;
        /**
         * The buyer-specific id for this creative.
         */
        buyerCreativeId?: string;
    }
    export interface Params$Resource$Creatives$Insert extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$Creative;
    }
    export interface Params$Resource$Creatives$List extends StandardParameters {
        /**
         * When specified, only creatives for the given account ids are returned.
         */
        accountId?: number[];
        /**
         * When specified, only creatives for the given buyer creative ids are returned.
         */
        buyerCreativeId?: string[];
        /**
         * Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         */
        pageToken?: string;
        /**
         * When specified, only creatives having the given status are returned.
         */
        statusFilter?: string;
    }
    export class Resource$Directdeals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets one direct deal by ID.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.directDeals.get({
         *     // The direct deal id
         *     id: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "accountId": 0,
         *   //   "advertiser": "my_advertiser",
         *   //   "allowsAlcohol": false,
         *   //   "buyerAccountId": "my_buyerAccountId",
         *   //   "currencyCode": "my_currencyCode",
         *   //   "dealTier": "my_dealTier",
         *   //   "endTime": "my_endTime",
         *   //   "fixedCpm": "my_fixedCpm",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "privateExchangeMinCpm": "my_privateExchangeMinCpm",
         *   //   "publisherBlocksOverriden": false,
         *   //   "sellerNetwork": "my_sellerNetwork",
         *   //   "startTime": "my_startTime"
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
        get(params: Params$Resource$Directdeals$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Directdeals$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DirectDeal>>;
        get(params: Params$Resource$Directdeals$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Directdeals$Get, options: MethodOptions | BodyResponseCallback<Schema$DirectDeal>, callback: BodyResponseCallback<Schema$DirectDeal>): void;
        get(params: Params$Resource$Directdeals$Get, callback: BodyResponseCallback<Schema$DirectDeal>): void;
        get(callback: BodyResponseCallback<Schema$DirectDeal>): void;
        /**
         * Retrieves the authenticated user's list of direct deals.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.directDeals.list({});
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "directDeals": [],
         *   //   "kind": "my_kind"
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
        list(params: Params$Resource$Directdeals$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Directdeals$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DirectDealsList>>;
        list(params: Params$Resource$Directdeals$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Directdeals$List, options: MethodOptions | BodyResponseCallback<Schema$DirectDealsList>, callback: BodyResponseCallback<Schema$DirectDealsList>): void;
        list(params: Params$Resource$Directdeals$List, callback: BodyResponseCallback<Schema$DirectDealsList>): void;
        list(callback: BodyResponseCallback<Schema$DirectDealsList>): void;
    }
    export interface Params$Resource$Directdeals$Get extends StandardParameters {
        /**
         * The direct deal id
         */
        id?: string;
    }
    export interface Params$Resource$Directdeals$List extends StandardParameters {
    }
    export class Resource$Performancereport {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the authenticated user's list of performance metrics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.performanceReport.list({
         *     // The account id to get the reports.
         *     accountId: 'placeholder-value',
         *     // The end time of the report in ISO 8601 timestamp format using UTC.
         *     endDateTime: 'placeholder-value',
         *     // Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         *     maxResults: 'placeholder-value',
         *     // A continuation token, used to page through performance reports. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         *     pageToken: 'placeholder-value',
         *     // The start time of the report in ISO 8601 timestamp format using UTC.
         *     startDateTime: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "performanceReport": []
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
        list(params: Params$Resource$Performancereport$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Performancereport$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PerformanceReportList>>;
        list(params: Params$Resource$Performancereport$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Performancereport$List, options: MethodOptions | BodyResponseCallback<Schema$PerformanceReportList>, callback: BodyResponseCallback<Schema$PerformanceReportList>): void;
        list(params: Params$Resource$Performancereport$List, callback: BodyResponseCallback<Schema$PerformanceReportList>): void;
        list(callback: BodyResponseCallback<Schema$PerformanceReportList>): void;
    }
    export interface Params$Resource$Performancereport$List extends StandardParameters {
        /**
         * The account id to get the reports.
         */
        accountId?: string;
        /**
         * The end time of the report in ISO 8601 timestamp format using UTC.
         */
        endDateTime?: string;
        /**
         * Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         */
        maxResults?: number;
        /**
         * A continuation token, used to page through performance reports. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         */
        pageToken?: string;
        /**
         * The start time of the report in ISO 8601 timestamp format using UTC.
         */
        startDateTime?: string;
    }
    export class Resource$Pretargetingconfig {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes an existing pretargeting config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.delete({
         *     // The account id to delete the pretargeting config for.
         *     accountId: 'placeholder-value',
         *     // The specific id of the configuration to delete.
         *     configId: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Pretargetingconfig$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Pretargetingconfig$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Pretargetingconfig$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Pretargetingconfig$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Pretargetingconfig$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Gets a specific pretargeting configuration
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.get({
         *     // The account id to get the pretargeting config for.
         *     accountId: 'placeholder-value',
         *     // The specific id of the configuration to retrieve.
         *     configId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billingId": "my_billingId",
         *   //   "configId": "my_configId",
         *   //   "configName": "my_configName",
         *   //   "creativeType": [],
         *   //   "dimensions": [],
         *   //   "excludedContentLabels": [],
         *   //   "excludedGeoCriteriaIds": [],
         *   //   "excludedPlacements": [],
         *   //   "excludedUserLists": [],
         *   //   "excludedVerticals": [],
         *   //   "geoCriteriaIds": [],
         *   //   "isActive": false,
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "maximumQps": "my_maximumQps",
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": []
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
        get(params: Params$Resource$Pretargetingconfig$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Pretargetingconfig$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PretargetingConfig>>;
        get(params: Params$Resource$Pretargetingconfig$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Pretargetingconfig$Get, options: MethodOptions | BodyResponseCallback<Schema$PretargetingConfig>, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        get(params: Params$Resource$Pretargetingconfig$Get, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        get(callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        /**
         * Inserts a new pretargeting configuration.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.insert({
         *     // The account id to insert the pretargeting config for.
         *     accountId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "billingId": "my_billingId",
         *       //   "configId": "my_configId",
         *       //   "configName": "my_configName",
         *       //   "creativeType": [],
         *       //   "dimensions": [],
         *       //   "excludedContentLabels": [],
         *       //   "excludedGeoCriteriaIds": [],
         *       //   "excludedPlacements": [],
         *       //   "excludedUserLists": [],
         *       //   "excludedVerticals": [],
         *       //   "geoCriteriaIds": [],
         *       //   "isActive": false,
         *       //   "kind": "my_kind",
         *       //   "languages": [],
         *       //   "maximumQps": "my_maximumQps",
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billingId": "my_billingId",
         *   //   "configId": "my_configId",
         *   //   "configName": "my_configName",
         *   //   "creativeType": [],
         *   //   "dimensions": [],
         *   //   "excludedContentLabels": [],
         *   //   "excludedGeoCriteriaIds": [],
         *   //   "excludedPlacements": [],
         *   //   "excludedUserLists": [],
         *   //   "excludedVerticals": [],
         *   //   "geoCriteriaIds": [],
         *   //   "isActive": false,
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "maximumQps": "my_maximumQps",
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": []
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
        insert(params: Params$Resource$Pretargetingconfig$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Pretargetingconfig$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PretargetingConfig>>;
        insert(params: Params$Resource$Pretargetingconfig$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Pretargetingconfig$Insert, options: MethodOptions | BodyResponseCallback<Schema$PretargetingConfig>, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        insert(params: Params$Resource$Pretargetingconfig$Insert, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        insert(callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        /**
         * Retrieves a list of the authenticated user's pretargeting configurations.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.list({
         *     // The account id to get the pretargeting configs for.
         *     accountId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
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
        list(params: Params$Resource$Pretargetingconfig$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Pretargetingconfig$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PretargetingConfigList>>;
        list(params: Params$Resource$Pretargetingconfig$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Pretargetingconfig$List, options: MethodOptions | BodyResponseCallback<Schema$PretargetingConfigList>, callback: BodyResponseCallback<Schema$PretargetingConfigList>): void;
        list(params: Params$Resource$Pretargetingconfig$List, callback: BodyResponseCallback<Schema$PretargetingConfigList>): void;
        list(callback: BodyResponseCallback<Schema$PretargetingConfigList>): void;
        /**
         * Updates an existing pretargeting config. This method supports patch semantics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.patch({
         *     // The account id to update the pretargeting config for.
         *     accountId: 'placeholder-value',
         *     // The specific id of the configuration to update.
         *     configId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "billingId": "my_billingId",
         *       //   "configId": "my_configId",
         *       //   "configName": "my_configName",
         *       //   "creativeType": [],
         *       //   "dimensions": [],
         *       //   "excludedContentLabels": [],
         *       //   "excludedGeoCriteriaIds": [],
         *       //   "excludedPlacements": [],
         *       //   "excludedUserLists": [],
         *       //   "excludedVerticals": [],
         *       //   "geoCriteriaIds": [],
         *       //   "isActive": false,
         *       //   "kind": "my_kind",
         *       //   "languages": [],
         *       //   "maximumQps": "my_maximumQps",
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billingId": "my_billingId",
         *   //   "configId": "my_configId",
         *   //   "configName": "my_configName",
         *   //   "creativeType": [],
         *   //   "dimensions": [],
         *   //   "excludedContentLabels": [],
         *   //   "excludedGeoCriteriaIds": [],
         *   //   "excludedPlacements": [],
         *   //   "excludedUserLists": [],
         *   //   "excludedVerticals": [],
         *   //   "geoCriteriaIds": [],
         *   //   "isActive": false,
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "maximumQps": "my_maximumQps",
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": []
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
        patch(params: Params$Resource$Pretargetingconfig$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Pretargetingconfig$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PretargetingConfig>>;
        patch(params: Params$Resource$Pretargetingconfig$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Pretargetingconfig$Patch, options: MethodOptions | BodyResponseCallback<Schema$PretargetingConfig>, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        patch(params: Params$Resource$Pretargetingconfig$Patch, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        patch(callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        /**
         * Updates an existing pretargeting config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/adexchangebuyer.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const adexchangebuyer = google.adexchangebuyer('v1.3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/adexchange.buyer'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await adexchangebuyer.pretargetingConfig.update({
         *     // The account id to update the pretargeting config for.
         *     accountId: 'placeholder-value',
         *     // The specific id of the configuration to update.
         *     configId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "billingId": "my_billingId",
         *       //   "configId": "my_configId",
         *       //   "configName": "my_configName",
         *       //   "creativeType": [],
         *       //   "dimensions": [],
         *       //   "excludedContentLabels": [],
         *       //   "excludedGeoCriteriaIds": [],
         *       //   "excludedPlacements": [],
         *       //   "excludedUserLists": [],
         *       //   "excludedVerticals": [],
         *       //   "geoCriteriaIds": [],
         *       //   "isActive": false,
         *       //   "kind": "my_kind",
         *       //   "languages": [],
         *       //   "maximumQps": "my_maximumQps",
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billingId": "my_billingId",
         *   //   "configId": "my_configId",
         *   //   "configName": "my_configName",
         *   //   "creativeType": [],
         *   //   "dimensions": [],
         *   //   "excludedContentLabels": [],
         *   //   "excludedGeoCriteriaIds": [],
         *   //   "excludedPlacements": [],
         *   //   "excludedUserLists": [],
         *   //   "excludedVerticals": [],
         *   //   "geoCriteriaIds": [],
         *   //   "isActive": false,
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "maximumQps": "my_maximumQps",
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": []
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
        update(params: Params$Resource$Pretargetingconfig$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Pretargetingconfig$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PretargetingConfig>>;
        update(params: Params$Resource$Pretargetingconfig$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Pretargetingconfig$Update, options: MethodOptions | BodyResponseCallback<Schema$PretargetingConfig>, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        update(params: Params$Resource$Pretargetingconfig$Update, callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
        update(callback: BodyResponseCallback<Schema$PretargetingConfig>): void;
    }
    export interface Params$Resource$Pretargetingconfig$Delete extends StandardParameters {
        /**
         * The account id to delete the pretargeting config for.
         */
        accountId?: string;
        /**
         * The specific id of the configuration to delete.
         */
        configId?: string;
    }
    export interface Params$Resource$Pretargetingconfig$Get extends StandardParameters {
        /**
         * The account id to get the pretargeting config for.
         */
        accountId?: string;
        /**
         * The specific id of the configuration to retrieve.
         */
        configId?: string;
    }
    export interface Params$Resource$Pretargetingconfig$Insert extends StandardParameters {
        /**
         * The account id to insert the pretargeting config for.
         */
        accountId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PretargetingConfig;
    }
    export interface Params$Resource$Pretargetingconfig$List extends StandardParameters {
        /**
         * The account id to get the pretargeting configs for.
         */
        accountId?: string;
    }
    export interface Params$Resource$Pretargetingconfig$Patch extends StandardParameters {
        /**
         * The account id to update the pretargeting config for.
         */
        accountId?: string;
        /**
         * The specific id of the configuration to update.
         */
        configId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PretargetingConfig;
    }
    export interface Params$Resource$Pretargetingconfig$Update extends StandardParameters {
        /**
         * The account id to update the pretargeting config for.
         */
        accountId?: string;
        /**
         * The specific id of the configuration to update.
         */
        configId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PretargetingConfig;
    }
    export {};
}
