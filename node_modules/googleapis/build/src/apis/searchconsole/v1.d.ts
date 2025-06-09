import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace searchconsole_v1 {
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
     * Google Search Console API
     *
     * The Search Console API provides access to both Search Console data (verified users only) and to public information on an URL basis (anyone)
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const searchconsole = google.searchconsole('v1');
     * ```
     */
    export class Searchconsole {
        context: APIRequestContext;
        searchanalytics: Resource$Searchanalytics;
        sitemaps: Resource$Sitemaps;
        sites: Resource$Sites;
        urlInspection: Resource$Urlinspection;
        urlTestingTools: Resource$Urltestingtools;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * AMP inspection result of the live page or the current information from Google's index, depending on whether you requested a live inspection or not.
     */
    export interface Schema$AmpInspectionResult {
        /**
         * Index status of the AMP URL.
         */
        ampIndexStatusVerdict?: string | null;
        /**
         * URL of the AMP that was inspected. If the submitted URL is a desktop page that refers to an AMP version, the AMP version will be inspected.
         */
        ampUrl?: string | null;
        /**
         * Whether or not the page blocks indexing through a noindex rule.
         */
        indexingState?: string | null;
        /**
         * A list of zero or more AMP issues found for the inspected URL.
         */
        issues?: Schema$AmpIssue[];
        /**
         * Last time this AMP version was crawled by Google. Absent if the URL was never crawled successfully.
         */
        lastCrawlTime?: string | null;
        /**
         * Whether or not Google could fetch the AMP.
         */
        pageFetchState?: string | null;
        /**
         * Whether or not the page is blocked to Google by a robots.txt rule.
         */
        robotsTxtState?: string | null;
        /**
         * The status of the most severe error on the page. If a page has both warnings and errors, the page status is error. Error status means the page cannot be shown in Search results.
         */
        verdict?: string | null;
    }
    /**
     * AMP issue.
     */
    export interface Schema$AmpIssue {
        /**
         * Brief description of this issue.
         */
        issueMessage?: string | null;
        /**
         * Severity of this issue: WARNING or ERROR.
         */
        severity?: string | null;
    }
    export interface Schema$ApiDataRow {
        clicks?: number | null;
        ctr?: number | null;
        impressions?: number | null;
        keys?: string[] | null;
        position?: number | null;
    }
    /**
     * A filter test to be applied to each row in the data set, where a match can return the row. Filters are string comparisons, and values and dimension names are not case-sensitive. Individual filters are either AND'ed or OR'ed within their parent filter group, according to the group's group type. You do not need to group by a specified dimension to filter against it.
     */
    export interface Schema$ApiDimensionFilter {
        dimension?: string | null;
        expression?: string | null;
        operator?: string | null;
    }
    /**
     * A set of dimension value filters to test against each row. Only rows that pass all filter groups will be returned. All results within a filter group are either AND'ed or OR'ed together, depending on the group type selected. All filter groups are AND'ed together.
     */
    export interface Schema$ApiDimensionFilterGroup {
        filters?: Schema$ApiDimensionFilter[];
        groupType?: string | null;
    }
    /**
     * Blocked resource.
     */
    export interface Schema$BlockedResource {
        /**
         * URL of the blocked resource.
         */
        url?: string | null;
    }
    /**
     * Rich Results items grouped by type.
     */
    export interface Schema$DetectedItems {
        /**
         * List of Rich Results items.
         */
        items?: Schema$Item[];
        /**
         * Rich Results type
         */
        richResultType?: string | null;
    }
    /**
     * Describe image data.
     */
    export interface Schema$Image {
        /**
         * Image data in format determined by the mime type. Currently, the format will always be "image/png", but this might change in the future.
         */
        data?: string | null;
        /**
         * The mime-type of the image data.
         */
        mimeType?: string | null;
    }
    /**
     * Results of index status inspection for either the live page or the version in Google's index, depending on whether you requested a live inspection or not. For more information, see the [Index coverage report documentation](https://support.google.com/webmasters/answer/7440203).
     */
    export interface Schema$IndexStatusInspectionResult {
        /**
         * Could Google find and index the page. More details about page indexing appear in 'indexing_state'.
         */
        coverageState?: string | null;
        /**
         * Primary crawler that was used by Google to crawl your site.
         */
        crawledAs?: string | null;
        /**
         * The URL of the page that Google selected as canonical. If the page was not indexed, this field is absent.
         */
        googleCanonical?: string | null;
        /**
         * Whether or not the page blocks indexing through a noindex rule.
         */
        indexingState?: string | null;
        /**
         * Last time this URL was crawled by Google using the [primary crawler](https://support.google.com/webmasters/answer/7440203#primary_crawler). Absent if the URL was never crawled successfully.
         */
        lastCrawlTime?: string | null;
        /**
         * Whether or not Google could retrieve the page from your server. Equivalent to ["page fetch"](https://support.google.com/webmasters/answer/9012289#index_coverage) in the URL inspection report.
         */
        pageFetchState?: string | null;
        /**
         * URLs that link to the inspected URL, directly and indirectly.
         */
        referringUrls?: string[] | null;
        /**
         * Whether or not the page is blocked to Google by a robots.txt rule.
         */
        robotsTxtState?: string | null;
        /**
         * Any sitemaps that this URL was listed in, as known by Google. Not guaranteed to be an exhaustive list, especially if Google did not discover this URL through a sitemap. Absent if no sitemaps were found.
         */
        sitemap?: string[] | null;
        /**
         * The URL that your page or site [declares as canonical](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?#define-canonical). If you did not declare a canonical URL, this field is absent.
         */
        userCanonical?: string | null;
        /**
         * High level verdict about whether the URL *is* indexed (indexed status), or *can be* indexed (live inspection).
         */
        verdict?: string | null;
    }
    /**
     * Index inspection request.
     */
    export interface Schema$InspectUrlIndexRequest {
        /**
         * Required. URL to inspect. Must be under the property specified in "site_url".
         */
        inspectionUrl?: string | null;
        /**
         * Optional. An [IETF BCP-47](https://en.wikipedia.org/wiki/IETF_language_tag) language code representing the requested language for translated issue messages, e.g. "en-US", "or "de-CH". Default value is "en-US".
         */
        languageCode?: string | null;
        /**
         * Required. The URL of the property as defined in Search Console. **Examples:** `http://www.example.com/` for a URL-prefix property, or `sc-domain:example.com` for a Domain property.
         */
        siteUrl?: string | null;
    }
    /**
     * Index-Status inspection response.
     */
    export interface Schema$InspectUrlIndexResponse {
        /**
         * URL inspection results.
         */
        inspectionResult?: Schema$UrlInspectionResult;
    }
    /**
     * A specific rich result found on the page.
     */
    export interface Schema$Item {
        /**
         * A list of zero or more rich result issues found for this instance.
         */
        issues?: Schema$RichResultsIssue[];
        /**
         * The user-provided name of this item.
         */
        name?: string | null;
    }
    /**
     * Mobile-friendly issue.
     */
    export interface Schema$MobileFriendlyIssue {
        /**
         * Rule violated.
         */
        rule?: string | null;
    }
    /**
     * Mobile-usability inspection results.
     */
    export interface Schema$MobileUsabilityInspectionResult {
        /**
         * A list of zero or more mobile-usability issues detected for this URL.
         */
        issues?: Schema$MobileUsabilityIssue[];
        /**
         * High-level mobile-usability inspection result for this URL.
         */
        verdict?: string | null;
    }
    /**
     * Mobile-usability issue.
     */
    export interface Schema$MobileUsabilityIssue {
        /**
         * Mobile-usability issue type.
         */
        issueType?: string | null;
        /**
         * Additional information regarding the issue.
         */
        message?: string | null;
        /**
         * Not returned; reserved for future use.
         */
        severity?: string | null;
    }
    /**
     * Information about a resource with issue.
     */
    export interface Schema$ResourceIssue {
        /**
         * Describes a blocked resource issue.
         */
        blockedResource?: Schema$BlockedResource;
    }
    /**
     * Rich-Results inspection result, including any rich results found at this URL.
     */
    export interface Schema$RichResultsInspectionResult {
        /**
         * A list of zero or more rich results detected on this page. Rich results that cannot even be parsed due to syntactic issues will not be listed here.
         */
        detectedItems?: Schema$DetectedItems[];
        /**
         * High-level rich results inspection result for this URL.
         */
        verdict?: string | null;
    }
    /**
     * Severity and status of a single issue affecting a single rich result instance on a page.
     */
    export interface Schema$RichResultsIssue {
        /**
         * Rich Results issue type.
         */
        issueMessage?: string | null;
        /**
         * Severity of this issue: WARNING, or ERROR. Items with an issue of status ERROR cannot appear with rich result features in Google Search results.
         */
        severity?: string | null;
    }
    /**
     * Mobile-friendly test request.
     */
    export interface Schema$RunMobileFriendlyTestRequest {
        /**
         * Whether or not screenshot is requested. Default is false.
         */
        requestScreenshot?: boolean | null;
        /**
         * URL for inspection.
         */
        url?: string | null;
    }
    /**
     * Mobile-friendly test response, including mobile-friendly issues and resource issues.
     */
    export interface Schema$RunMobileFriendlyTestResponse {
        /**
         * Test verdict, whether the page is mobile friendly or not.
         */
        mobileFriendliness?: string | null;
        /**
         * List of mobile-usability issues.
         */
        mobileFriendlyIssues?: Schema$MobileFriendlyIssue[];
        /**
         * Information about embedded resources issues.
         */
        resourceIssues?: Schema$ResourceIssue[];
        /**
         * Screenshot of the requested URL.
         */
        screenshot?: Schema$Image;
        /**
         * Final state of the test, can be either complete or an error.
         */
        testStatus?: Schema$TestStatus;
    }
    export interface Schema$SearchAnalyticsQueryRequest {
        /**
         * [Optional; Default is \"auto\"] How data is aggregated. If aggregated by property, all data for the same property is aggregated; if aggregated by page, all data is aggregated by canonical URI. If you filter or group by page, choose AUTO; otherwise you can aggregate either by property or by page, depending on how you want your data calculated; see the help documentation to learn how data is calculated differently by site versus by page. **Note:** If you group or filter by page, you cannot aggregate by property. If you specify any value other than AUTO, the aggregation type in the result will match the requested type, or if you request an invalid type, you will get an error. The API will never change your aggregation type if the requested type is invalid.
         */
        aggregationType?: string | null;
        /**
         * The data state to be fetched, can be full or all, the latter including full and partial data.
         */
        dataState?: string | null;
        /**
         * [Optional] Zero or more filters to apply to the dimension grouping values; for example, 'query contains \"buy\"' to see only data where the query string contains the substring \"buy\" (not case-sensitive). You can filter by a dimension without grouping by it.
         */
        dimensionFilterGroups?: Schema$ApiDimensionFilterGroup[];
        /**
         * [Optional] Zero or more dimensions to group results by. Dimensions are the group-by values in the Search Analytics page. Dimensions are combined to create a unique row key for each row. Results are grouped in the order that you supply these dimensions.
         */
        dimensions?: string[] | null;
        /**
         * [Required] End date of the requested date range, in YYYY-MM-DD format, in PST (UTC - 8:00). Must be greater than or equal to the start date. This value is included in the range.
         */
        endDate?: string | null;
        /**
         * [Optional; Default is 1000] The maximum number of rows to return. Must be a number from 1 to 25,000 (inclusive).
         */
        rowLimit?: number | null;
        /**
         * [Optional; Default is \"web\"] The search type to filter for.
         */
        searchType?: string | null;
        /**
         *  [Required] Start date of the requested date range, in YYYY-MM-DD format, in PST time (UTC - 8:00). Must be less than or equal to the end date. This value is included in the range.
         */
        startDate?: string | null;
        /**
         * [Optional; Default is 0] Zero-based index of the first row in the response. Must be a non-negative number.
         */
        startRow?: number | null;
        /**
         * Optional. [Optional; Default is \"web\"] Type of report: search type, or either Discover or Gnews.
         */
        type?: string | null;
    }
    /**
     * A list of rows, one per result, grouped by key. Metrics in each row are aggregated for all data grouped by that key either by page or property, as specified by the aggregation type parameter.
     */
    export interface Schema$SearchAnalyticsQueryResponse {
        /**
         * How the results were aggregated.
         */
        responseAggregationType?: string | null;
        /**
         * A list of rows grouped by the key values in the order given in the query.
         */
        rows?: Schema$ApiDataRow[];
    }
    /**
     * List of sitemaps.
     */
    export interface Schema$SitemapsListResponse {
        /**
         * Contains detailed information about a specific URL submitted as a [sitemap](https://support.google.com/webmasters/answer/156184).
         */
        sitemap?: Schema$WmxSitemap[];
    }
    /**
     * List of sites with access level information.
     */
    export interface Schema$SitesListResponse {
        /**
         * Contains permission level information about a Search Console site. For more information, see [Permissions in Search Console](https://support.google.com/webmasters/answer/2451999).
         */
        siteEntry?: Schema$WmxSite[];
    }
    /**
     * Final state of the test, including error details if necessary.
     */
    export interface Schema$TestStatus {
        /**
         * Error details if applicable.
         */
        details?: string | null;
        /**
         * Status of the test.
         */
        status?: string | null;
    }
    /**
     * URL inspection result, including all inspection results.
     */
    export interface Schema$UrlInspectionResult {
        /**
         * Result of the AMP analysis. Absent if the page is not an AMP page.
         */
        ampResult?: Schema$AmpInspectionResult;
        /**
         * Result of the index status analysis.
         */
        indexStatusResult?: Schema$IndexStatusInspectionResult;
        /**
         * Link to Search Console URL inspection.
         */
        inspectionResultLink?: string | null;
        /**
         * Result of the Mobile usability analysis.
         */
        mobileUsabilityResult?: Schema$MobileUsabilityInspectionResult;
        /**
         * Result of the Rich Results analysis. Absent if there are no rich results found.
         */
        richResultsResult?: Schema$RichResultsInspectionResult;
    }
    /**
     * Contains permission level information about a Search Console site. For more information, see [Permissions in Search Console](https://support.google.com/webmasters/answer/2451999).
     */
    export interface Schema$WmxSite {
        /**
         * The user's permission level for the site.
         */
        permissionLevel?: string | null;
        /**
         * The URL of the site.
         */
        siteUrl?: string | null;
    }
    /**
     * Contains detailed information about a specific URL submitted as a [sitemap](https://support.google.com/webmasters/answer/156184).
     */
    export interface Schema$WmxSitemap {
        /**
         * The various content types in the sitemap.
         */
        contents?: Schema$WmxSitemapContent[];
        /**
         * Number of errors in the sitemap. These are issues with the sitemap itself that need to be fixed before it can be processed correctly.
         */
        errors?: string | null;
        /**
         * If true, the sitemap has not been processed.
         */
        isPending?: boolean | null;
        /**
         * If true, the sitemap is a collection of sitemaps.
         */
        isSitemapsIndex?: boolean | null;
        /**
         * Date & time in which this sitemap was last downloaded. Date format is in RFC 3339 format (yyyy-mm-dd).
         */
        lastDownloaded?: string | null;
        /**
         * Date & time in which this sitemap was submitted. Date format is in RFC 3339 format (yyyy-mm-dd).
         */
        lastSubmitted?: string | null;
        /**
         * The url of the sitemap.
         */
        path?: string | null;
        /**
         * The type of the sitemap. For example: `rssFeed`.
         */
        type?: string | null;
        /**
         * Number of warnings for the sitemap. These are generally non-critical issues with URLs in the sitemaps.
         */
        warnings?: string | null;
    }
    /**
     * Information about the various content types in the sitemap.
     */
    export interface Schema$WmxSitemapContent {
        /**
         * *Deprecated; do not use.*
         */
        indexed?: string | null;
        /**
         * The number of URLs in the sitemap (of the content type).
         */
        submitted?: string | null;
        /**
         * The specific type of content in this sitemap. For example: `web`.
         */
        type?: string | null;
    }
    export class Resource$Searchanalytics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Query your data with filters and parameters that you define. Returns zero or more rows grouped by the row keys that you define. You must define a date range of one or more days. When date is one of the group by values, any days without data are omitted from the result list. If you need to know which days have data, issue a broad date range query grouped by date for any metric, and see which day rows are returned.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        query(params: Params$Resource$Searchanalytics$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Searchanalytics$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchAnalyticsQueryResponse>>;
        query(params: Params$Resource$Searchanalytics$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Searchanalytics$Query, options: MethodOptions | BodyResponseCallback<Schema$SearchAnalyticsQueryResponse>, callback: BodyResponseCallback<Schema$SearchAnalyticsQueryResponse>): void;
        query(params: Params$Resource$Searchanalytics$Query, callback: BodyResponseCallback<Schema$SearchAnalyticsQueryResponse>): void;
        query(callback: BodyResponseCallback<Schema$SearchAnalyticsQueryResponse>): void;
    }
    export interface Params$Resource$Searchanalytics$Query extends StandardParameters {
        /**
         * The site's URL, including protocol. For example: `http://www.example.com/`.
         */
        siteUrl?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchAnalyticsQueryRequest;
    }
    export class Resource$Sitemaps {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a sitemap from the Sitemaps report. Does not stop Google from crawling this sitemap or the URLs that were previously crawled in the deleted sitemap.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Sitemaps$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Sitemaps$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Sitemaps$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Sitemaps$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Sitemaps$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves information about a specific sitemap.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Sitemaps$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sitemaps$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WmxSitemap>>;
        get(params: Params$Resource$Sitemaps$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sitemaps$Get, options: MethodOptions | BodyResponseCallback<Schema$WmxSitemap>, callback: BodyResponseCallback<Schema$WmxSitemap>): void;
        get(params: Params$Resource$Sitemaps$Get, callback: BodyResponseCallback<Schema$WmxSitemap>): void;
        get(callback: BodyResponseCallback<Schema$WmxSitemap>): void;
        /**
         *  Lists the [sitemaps-entries](/webmaster-tools/v3/sitemaps) submitted for this site, or included in the sitemap index file (if `sitemapIndex` is specified in the request).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Sitemaps$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Sitemaps$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SitemapsListResponse>>;
        list(params: Params$Resource$Sitemaps$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Sitemaps$List, options: MethodOptions | BodyResponseCallback<Schema$SitemapsListResponse>, callback: BodyResponseCallback<Schema$SitemapsListResponse>): void;
        list(params: Params$Resource$Sitemaps$List, callback: BodyResponseCallback<Schema$SitemapsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$SitemapsListResponse>): void;
        /**
         * Submits a sitemap for a site.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submit(params: Params$Resource$Sitemaps$Submit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submit(params?: Params$Resource$Sitemaps$Submit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        submit(params: Params$Resource$Sitemaps$Submit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submit(params: Params$Resource$Sitemaps$Submit, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        submit(params: Params$Resource$Sitemaps$Submit, callback: BodyResponseCallback<void>): void;
        submit(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Sitemaps$Delete extends StandardParameters {
        /**
         * The URL of the actual sitemap. For example: `http://www.example.com/sitemap.xml`.
         */
        feedpath?: string;
        /**
         * The site's URL, including protocol. For example: `http://www.example.com/`.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sitemaps$Get extends StandardParameters {
        /**
         * The URL of the actual sitemap. For example: `http://www.example.com/sitemap.xml`.
         */
        feedpath?: string;
        /**
         * The site's URL, including protocol. For example: `http://www.example.com/`.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sitemaps$List extends StandardParameters {
        /**
         *  A URL of a site's sitemap index. For example: `http://www.example.com/sitemapindex.xml`.
         */
        sitemapIndex?: string;
        /**
         * The site's URL, including protocol. For example: `http://www.example.com/`.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sitemaps$Submit extends StandardParameters {
        /**
         * The URL of the actual sitemap. For example: `http://www.example.com/sitemap.xml`.
         */
        feedpath?: string;
        /**
         * The site's URL, including protocol. For example: `http://www.example.com/`.
         */
        siteUrl?: string;
    }
    export class Resource$Sites {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         *  Adds a site to the set of the user's sites in Search Console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        add(params: Params$Resource$Sites$Add, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        add(params?: Params$Resource$Sites$Add, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        add(params: Params$Resource$Sites$Add, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        add(params: Params$Resource$Sites$Add, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        add(params: Params$Resource$Sites$Add, callback: BodyResponseCallback<void>): void;
        add(callback: BodyResponseCallback<void>): void;
        /**
         *  Removes a site from the set of the user's Search Console sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Sites$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Sites$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Sites$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Sites$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Sites$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         *  Retrieves information about specific site.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Sites$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sites$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WmxSite>>;
        get(params: Params$Resource$Sites$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sites$Get, options: MethodOptions | BodyResponseCallback<Schema$WmxSite>, callback: BodyResponseCallback<Schema$WmxSite>): void;
        get(params: Params$Resource$Sites$Get, callback: BodyResponseCallback<Schema$WmxSite>): void;
        get(callback: BodyResponseCallback<Schema$WmxSite>): void;
        /**
         *  Lists the user's Search Console sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Sites$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Sites$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SitesListResponse>>;
        list(params: Params$Resource$Sites$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Sites$List, options: MethodOptions | BodyResponseCallback<Schema$SitesListResponse>, callback: BodyResponseCallback<Schema$SitesListResponse>): void;
        list(params: Params$Resource$Sites$List, callback: BodyResponseCallback<Schema$SitesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$SitesListResponse>): void;
    }
    export interface Params$Resource$Sites$Add extends StandardParameters {
        /**
         * The URL of the site to add.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sites$Delete extends StandardParameters {
        /**
         * The URI of the property as defined in Search Console. **Examples:** `http://www.example.com/` or `sc-domain:example.com`.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sites$Get extends StandardParameters {
        /**
         * The URI of the property as defined in Search Console. **Examples:** `http://www.example.com/` or `sc-domain:example.com`.
         */
        siteUrl?: string;
    }
    export interface Params$Resource$Sites$List extends StandardParameters {
    }
    export class Resource$Urlinspection {
        context: APIRequestContext;
        index: Resource$Urlinspection$Index;
        constructor(context: APIRequestContext);
    }
    export class Resource$Urlinspection$Index {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Index inspection.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        inspect(params: Params$Resource$Urlinspection$Index$Inspect, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        inspect(params?: Params$Resource$Urlinspection$Index$Inspect, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InspectUrlIndexResponse>>;
        inspect(params: Params$Resource$Urlinspection$Index$Inspect, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        inspect(params: Params$Resource$Urlinspection$Index$Inspect, options: MethodOptions | BodyResponseCallback<Schema$InspectUrlIndexResponse>, callback: BodyResponseCallback<Schema$InspectUrlIndexResponse>): void;
        inspect(params: Params$Resource$Urlinspection$Index$Inspect, callback: BodyResponseCallback<Schema$InspectUrlIndexResponse>): void;
        inspect(callback: BodyResponseCallback<Schema$InspectUrlIndexResponse>): void;
    }
    export interface Params$Resource$Urlinspection$Index$Inspect extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$InspectUrlIndexRequest;
    }
    export class Resource$Urltestingtools {
        context: APIRequestContext;
        mobileFriendlyTest: Resource$Urltestingtools$Mobilefriendlytest;
        constructor(context: APIRequestContext);
    }
    export class Resource$Urltestingtools$Mobilefriendlytest {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Runs Mobile-Friendly Test for a given URL.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        run(params: Params$Resource$Urltestingtools$Mobilefriendlytest$Run, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        run(params?: Params$Resource$Urltestingtools$Mobilefriendlytest$Run, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RunMobileFriendlyTestResponse>>;
        run(params: Params$Resource$Urltestingtools$Mobilefriendlytest$Run, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        run(params: Params$Resource$Urltestingtools$Mobilefriendlytest$Run, options: MethodOptions | BodyResponseCallback<Schema$RunMobileFriendlyTestResponse>, callback: BodyResponseCallback<Schema$RunMobileFriendlyTestResponse>): void;
        run(params: Params$Resource$Urltestingtools$Mobilefriendlytest$Run, callback: BodyResponseCallback<Schema$RunMobileFriendlyTestResponse>): void;
        run(callback: BodyResponseCallback<Schema$RunMobileFriendlyTestResponse>): void;
    }
    export interface Params$Resource$Urltestingtools$Mobilefriendlytest$Run extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunMobileFriendlyTestRequest;
    }
    export {};
}
