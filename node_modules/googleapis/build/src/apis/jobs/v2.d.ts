import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace jobs_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
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
     * Cloud Talent Solution API
     *
     * Cloud Talent Solution provides the capability to create, read, update, and delete job postings, as well as search jobs based on keywords and filters.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const jobs = google.jobs('v2');
     * ```
     */
    export class Jobs {
        context: APIRequestContext;
        companies: Resource$Companies;
        jobs: Resource$Jobs;
        v2: Resource$V2;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Input only. Batch delete jobs request.
     */
    export interface Schema$BatchDeleteJobsRequest {
        /**
         * Required. The filter string specifies the jobs to be deleted. Supported operator: =, AND The fields eligible for filtering are: * `companyName` (Required) * `requisitionId` (Required) Sample Query: companyName = "companies/123" AND requisitionId = "req-1"
         */
        filter?: string | null;
    }
    /**
     * Represents count of jobs within one bucket.
     */
    export interface Schema$BucketizedCount {
        /**
         * Number of jobs whose numeric field value fall into `range`.
         */
        count?: number | null;
        /**
         * Bucket range on which histogram was performed for the numeric field, that is, the count represents number of jobs in this range.
         */
        range?: Schema$BucketRange;
    }
    /**
     * Represents starting and ending value of a range in double.
     */
    export interface Schema$BucketRange {
        /**
         * Starting value of the bucket range.
         */
        from?: number | null;
        /**
         * Ending value of the bucket range.
         */
        to?: number | null;
    }
    /**
     * Output only. Commute details related to this job.
     */
    export interface Schema$CommuteInfo {
        /**
         * Location used as the destination in the commute calculation.
         */
        jobLocation?: Schema$JobLocation;
        /**
         * The number of seconds required to travel to the job location from the query location. A duration of 0 seconds indicates that the job is not reachable within the requested duration, but was returned as part of an expanded query.
         */
        travelDuration?: string | null;
    }
    /**
     * Input only. Parameters needed for commute search.
     */
    export interface Schema$CommutePreference {
        /**
         * Optional. If `true`, jobs without street level addresses may also be returned. For city level addresses, the city center is used. For state and coarser level addresses, text matching is used. If this field is set to `false` or is not specified, only jobs that include street level addresses will be returned by commute search.
         */
        allowNonStreetLevelAddress?: boolean | null;
        /**
         * Optional. The departure hour to use to calculate traffic impact. Accepts an integer between 0 and 23, representing the hour in the time zone of the start_location. Must not be present if road_traffic is specified.
         */
        departureHourLocal?: number | null;
        /**
         * Required. The method of transportation for which to calculate the commute time.
         */
        method?: string | null;
        /**
         * Optional. Specifies the traffic density to use when calculating commute time. Must not be present if departure_hour_local is specified.
         */
        roadTraffic?: string | null;
        /**
         * Required. The latitude and longitude of the location from which to calculate the commute time.
         */
        startLocation?: Schema$LatLng;
        /**
         * Required. The maximum travel time in seconds. The maximum allowed value is `3600s` (one hour). Format is `123s`.
         */
        travelTime?: string | null;
    }
    /**
     * A Company resource represents a company in the service. A company is the entity that owns job listings, that is, the hiring entity responsible for employing applicants for the job position.
     */
    export interface Schema$Company {
        /**
         * Optional. The URL to employer's career site or careers page on the employer's web site.
         */
        careerPageLink?: string | null;
        /**
         * Optional. Identifiers external to the application that help to further identify the employer.
         */
        companyInfoSources?: Schema$CompanyInfoSource[];
        /**
         * Optional. The employer's company size.
         */
        companySize?: string | null;
        /**
         * Deprecated. Do not use this field. Optional. This field is no longer used. Any value set to it is ignored.
         */
        disableLocationOptimization?: boolean | null;
        /**
         * Required. The name of the employer to be displayed with the job, for example, "Google, LLC.".
         */
        displayName?: string | null;
        /**
         * Optional. The unique company identifier provided by the client to identify an employer for billing purposes. Recommended practice is to use the distributor_company_id. Defaults to same value as distributor_company_id when a value is not provided.
         */
        distributorBillingCompanyId?: string | null;
        /**
         * Required. A client's company identifier, used to uniquely identify the company. If an employer has a subsidiary or sub-brand, such as "Alphabet" and "Google", which the client wishes to use as the company displayed on the job. Best practice is to create a distinct company identifier for each distinct brand displayed. The maximum number of allowed characters is 255.
         */
        distributorCompanyId?: string | null;
        /**
         * Optional. Equal Employment Opportunity legal disclaimer text to be associated with all jobs, and typically to be displayed in all roles. The maximum number of allowed characters is 500.
         */
        eeoText?: string | null;
        /**
         * Optional. Set to true if it is the hiring agency that post jobs for other employers. Defaults to false if not provided.
         */
        hiringAgency?: boolean | null;
        /**
         * Optional. The street address of the company's main headquarters, which may be different from the job location. The service attempts to geolocate the provided address, and populates a more specific location wherever possible in structured_company_hq_location.
         */
        hqLocation?: string | null;
        /**
         * Optional. A URL that hosts the employer's company logo. If provided, the logo image should be squared at 80x80 pixels. The url must be a Google Photos or Google Album url. Only images in these Google sub-domains are accepted.
         */
        imageUrl?: string | null;
        /**
         * Optional. A list of keys of filterable Job.custom_attributes, whose corresponding `string_values` are used in keyword search. Jobs with `string_values` under these specified field keys are returned if any of the values matches the search keyword. Custom field values with parenthesis, brackets and special symbols might not be properly searchable, and those keyword queries need to be surrounded by quotes.
         */
        keywordSearchableCustomAttributes?: string[] | null;
        /**
         * Deprecated. Use keyword_searchable_custom_attributes instead. Optional. A list of filterable custom fields that should be used in keyword search. The jobs of this company are returned if any of these custom fields matches the search keyword. Custom field values with parenthesis, brackets and special symbols might not be properly searchable, and those keyword queries need to be surrounded by quotes.
         */
        keywordSearchableCustomFields?: number[] | null;
        /**
         * Required during company update. The resource name for a company. This is generated by the service when a company is created, for example, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         */
        name?: string | null;
        /**
         * Output only. A structured headquarters location of the company, resolved from hq_location if possible.
         */
        structuredCompanyHqLocation?: Schema$JobLocation;
        /**
         * Output only. Indicates whether a company is flagged to be suspended from public availability by the service when job content appears suspicious, abusive, or spammy.
         */
        suspended?: boolean | null;
        /**
         * Deprecated. Use display_name instead. Required. The name of the employer to be displayed with the job, for example, "Google, LLC.".
         */
        title?: string | null;
        /**
         * Optional. The URL representing the company's primary web site or home page, such as, "www.google.com".
         */
        website?: string | null;
    }
    /**
     * A resource that represents an external Google identifier for a company, for example, a Google+ business page or a Google Maps business page. For unsupported types, use `unknown_type_id`.
     */
    export interface Schema$CompanyInfoSource {
        /**
         * Optional. The Google's Knowledge Graph value for the employer's company.
         */
        freebaseMid?: string | null;
        /**
         * Optional. The numeric identifier for the employer's Google+ business page.
         */
        gplusId?: string | null;
        /**
         * Optional. The numeric identifier for the employer's headquarters on Google Maps, namely, the Google Maps CID (cell id).
         */
        mapsCid?: string | null;
        /**
         * Optional. A Google identifier that does not match any of the other types.
         */
        unknownTypeId?: string | null;
    }
    /**
     * A compensation entry that represents one component of compensation, such as base pay, bonus, or other compensation type. Annualization: One compensation entry can be annualized if - it contains valid amount or range. - and its expected_units_per_year is set or can be derived. Its annualized range is determined as (amount or range) times expected_units_per_year.
     */
    export interface Schema$CompensationEntry {
        /**
         * Optional. Compensation amount.
         */
        amount?: Schema$Money;
        /**
         * Optional. Compensation description. For example, could indicate equity terms or provide additional context to an estimated bonus.
         */
        description?: string | null;
        /**
         * Optional. Expected number of units paid each year. If not specified, when Job.employment_types is FULLTIME, a default value is inferred based on unit. Default values: - HOURLY: 2080 - DAILY: 260 - WEEKLY: 52 - MONTHLY: 12 - ANNUAL: 1
         */
        expectedUnitsPerYear?: number | null;
        /**
         * Optional. Compensation range.
         */
        range?: Schema$CompensationRange;
        /**
         * Required. Compensation type.
         */
        type?: string | null;
        /**
         * Optional. Frequency of the specified amount. Default is CompensationUnit.COMPENSATION_UNIT_UNSPECIFIED.
         */
        unit?: string | null;
    }
    /**
     * Input only. Filter on job compensation type and amount.
     */
    export interface Schema$CompensationFilter {
        /**
         * Optional. Whether to include jobs whose compensation range is unspecified.
         */
        includeJobsWithUnspecifiedCompensationRange?: boolean | null;
        /**
         * Optional. Compensation range.
         */
        range?: Schema$CompensationRange;
        /**
         * Required. Type of filter.
         */
        type?: string | null;
        /**
         * Required. Specify desired `base compensation entry's` CompensationInfo.CompensationUnit.
         */
        units?: string[] | null;
    }
    /**
     * Input only. Compensation based histogram request.
     */
    export interface Schema$CompensationHistogramRequest {
        /**
         * Required. Numeric histogram options, like buckets, whether include min or max value.
         */
        bucketingOption?: Schema$NumericBucketingOption;
        /**
         * Required. Type of the request, representing which field the histogramming should be performed over. A single request can only specify one histogram of each `CompensationHistogramRequestType`.
         */
        type?: string | null;
    }
    /**
     * Output only. Compensation based histogram result.
     */
    export interface Schema$CompensationHistogramResult {
        /**
         * Histogram result.
         */
        result?: Schema$NumericBucketingResult;
        /**
         * Type of the request, corresponding to CompensationHistogramRequest.type.
         */
        type?: string | null;
    }
    /**
     * Job compensation details.
     */
    export interface Schema$CompensationInfo {
        /**
         * Deprecated. Use entries instead. Optional. The amount of compensation or pay for the job. As an alternative, compensation_amount_min and compensation_amount_max may be used to define a range of compensation.
         */
        amount?: Schema$Money;
        /**
         * Output only. Annualized base compensation range. Computed as base compensation entry's CompensationEntry.compensation times CompensationEntry.expected_units_per_year. See CompensationEntry for explanation on compensation annualization.
         */
        annualizedBaseCompensationRange?: Schema$CompensationRange;
        /**
         * Output only. Annualized total compensation range. Computed as all compensation entries' CompensationEntry.compensation times CompensationEntry.expected_units_per_year. See CompensationEntry for explanation on compensation annualization.
         */
        annualizedTotalCompensationRange?: Schema$CompensationRange;
        /**
         * Optional. Job compensation information. At most one entry can be of type CompensationInfo.CompensationType.BASE, which is referred as ** base compensation entry ** for the job.
         */
        entries?: Schema$CompensationEntry[];
        /**
         * Deprecated. Use entries instead. Optional. An upper bound on a range for compensation or pay for the job. The currency type is specified in compensation_amount.
         */
        max?: Schema$Money;
        /**
         * Deprecated. Use entries instead. Optional. A lower bound on a range for compensation or pay for the job. The currency type is specified in compensation_amount.
         */
        min?: Schema$Money;
        /**
         * Deprecated. Use entries instead. Optional. Type of job compensation.
         */
        type?: string | null;
    }
    /**
     * Compensation range.
     */
    export interface Schema$CompensationRange {
        /**
         * Optional. The maximum amount of compensation. If left empty, the value is set to a maximal compensation value and the currency code is set to match the currency code of min_compensation.
         */
        max?: Schema$Money;
        /**
         * Optional. The minimum amount of compensation. If left empty, the value is set to zero and the currency code is set to match the currency code of max_compensation.
         */
        min?: Schema$Money;
    }
    /**
     * Output only. Response of auto-complete query.
     */
    export interface Schema$CompleteQueryResponse {
        /**
         * Results of the matching job/company candidates.
         */
        completionResults?: Schema$CompletionResult[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
    }
    /**
     * Output only. Resource that represents completion results.
     */
    export interface Schema$CompletionResult {
        /**
         * The URL for the company logo if `type=COMPANY_NAME`.
         */
        imageUrl?: string | null;
        /**
         * The suggestion for the query.
         */
        suggestion?: string | null;
        /**
         * The completion topic.
         */
        type?: string | null;
    }
    /**
     * Input only. Create job request.
     */
    export interface Schema$CreateJobRequest {
        /**
         * Deprecated. Please use processing_options. This flag is ignored if processing_options is set. Optional. If set to `true`, the service does not attempt to resolve a more precise address for the job.
         */
        disableStreetAddressResolution?: boolean | null;
        /**
         * Required. The Job to be created.
         */
        job?: Schema$Job;
        /**
         * Optional. Options for job processing.
         */
        processingOptions?: Schema$JobProcessingOptions;
    }
    /**
     * Custom attribute values that are either filterable or non-filterable.
     */
    export interface Schema$CustomAttribute {
        /**
         * Optional. If the `filterable` flag is true, custom field values are searchable. If false, values are not searchable. Default is false.
         */
        filterable?: boolean | null;
        /**
         * Optional but at least one of string_values or long_value must be specified. This field is used to perform number range search. (`EQ`, `GT`, `GE`, `LE`, `LT`) over filterable `long_value`. For `long_value`, a value between Long.MIN and Long.MAX is allowed.
         */
        longValue?: string | null;
        /**
         * Optional but at least one of string_values or long_value must be specified. This field is used to perform a string match (`CASE_SENSITIVE_MATCH` or `CASE_INSENSITIVE_MATCH`) search. For filterable `string_values`, a maximum total number of 200 values is allowed, with each `string_value` has a byte size of no more than 255B. For unfilterable `string_values`, the maximum total byte size of unfilterable `string_values` is 50KB. Empty strings are not allowed.
         */
        stringValues?: Schema$StringValues;
    }
    /**
     * Custom attributes histogram request. An error will be thrown if neither string_value_histogram or long_value_histogram_bucketing_option has been defined.
     */
    export interface Schema$CustomAttributeHistogramRequest {
        /**
         * Required. Specifies the custom field key to perform a histogram on. If specified without `long_value_histogram_bucketing_option`, histogram on string values of the given `key` is triggered, otherwise histogram is performed on long values.
         */
        key?: string | null;
        /**
         * Optional. Specifies buckets used to perform a range histogram on Job's filterable long custom field values, or min/max value requirements.
         */
        longValueHistogramBucketingOption?: Schema$NumericBucketingOption;
        /**
         * Optional. If set to true, the response will include the histogram value for each key as a string.
         */
        stringValueHistogram?: boolean | null;
    }
    /**
     * Output only. Custom attribute histogram result.
     */
    export interface Schema$CustomAttributeHistogramResult {
        /**
         * Stores the key of custom attribute the histogram is performed on.
         */
        key?: string | null;
        /**
         * Stores bucketed histogram counting result or min/max values for custom attribute long values associated with `key`.
         */
        longValueHistogramResult?: Schema$NumericBucketingResult;
        /**
         * Stores a map from the values of string custom field associated with `key` to the number of jobs with that value in this histogram result.
         */
        stringValueHistogramResult?: {
            [key: string]: number;
        } | null;
    }
    /**
     * Resource that represents the custom data not captured by the standard fields.
     */
    export interface Schema$CustomField {
        /**
         * Optional. The values of the custom data.
         */
        values?: string[] | null;
    }
    /**
     * Input only. Custom field filter of the search.
     */
    export interface Schema$CustomFieldFilter {
        /**
         * Required. The query strings for the filter.
         */
        queries?: string[] | null;
        /**
         * Optional. The type of filter. Defaults to FilterType.OR.
         */
        type?: string | null;
    }
    /**
     * Represents a whole or partial calendar date, e.g. a birthday. The time of day and time zone are either specified elsewhere or are not significant. The date is relative to the Proleptic Gregorian Calendar. This can represent: * A full date, with non-zero year, month and day values * A month and day value, with a zero year, e.g. an anniversary * A year on its own, with zero month and day values * A year and month value, with a zero day, e.g. a credit card expiration date Related types are google.type.TimeOfDay and `google.protobuf.Timestamp`.
     */
    export interface Schema$Date {
        /**
         * Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a year by itself or a year and month where the day is not significant.
         */
        day?: number | null;
        /**
         * Month of year. Must be from 1 to 12, or 0 if specifying a year without a month and day.
         */
        month?: number | null;
        /**
         * Year of date. Must be from 1 to 9999, or 0 if specifying a date without a year.
         */
        year?: number | null;
    }
    /**
     * Deprecated. Use BatchDeleteJobsRequest instead. Input only. Delete job by filter request. The job typically becomes unsearchable within 10 seconds, but it may take up to 5 minutes.
     */
    export interface Schema$DeleteJobsByFilterRequest {
        /**
         * Optional. If set to true, this call waits for all processing steps to complete before the job is cleaned up. Otherwise, the call returns while some steps are still taking place asynchronously, hence faster.
         */
        disableFastProcess?: boolean | null;
        /**
         * Required. Restrictions on the scope of the delete request.
         */
        filter?: Schema$Filter;
    }
    /**
     * Input only. Device information collected from the job seeker, candidate, or other entity conducting the job search. Providing this information improves the quality of the search results across devices.
     */
    export interface Schema$DeviceInfo {
        /**
         * Optional. Type of the device.
         */
        deviceType?: string | null;
        /**
         * Optional. A device-specific ID. The ID must be a unique identifier that distinguishes the device from other devices.
         */
        id?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Deprecated. Always use CompensationFilter. Input only. Filter on job compensation type and amount.
     */
    export interface Schema$ExtendedCompensationFilter {
        /**
         * Optional. Compensation range.
         */
        compensationRange?: Schema$ExtendedCompensationInfoCompensationRange;
        /**
         * Required. Specify desired `base compensation entry's` ExtendedCompensationInfo.CompensationUnit.
         */
        compensationUnits?: string[] | null;
        /**
         * Optional. Specify currency in 3-letter [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) format. If unspecified, jobs are returned regardless of currency.
         */
        currency?: string | null;
        /**
         * Optional. Whether to include jobs whose compensation range is unspecified.
         */
        includeJobWithUnspecifiedCompensationRange?: boolean | null;
        /**
         * Required. Type of filter.
         */
        type?: string | null;
    }
    /**
     * Deprecated. Use CompensationInfo. Describes job compensation.
     */
    export interface Schema$ExtendedCompensationInfo {
        /**
         * Output only. Annualized base compensation range.
         */
        annualizedBaseCompensationRange?: Schema$ExtendedCompensationInfoCompensationRange;
        /**
         * Output only. Indicates annualized base compensation range cannot be derived, due to the job's base compensation entry cannot be annualized. See CompensationEntry for explanation on annualization and base compensation entry.
         */
        annualizedBaseCompensationUnspecified?: boolean | null;
        /**
         * Output only. Annualized total compensation range.
         */
        annualizedTotalCompensationRange?: Schema$ExtendedCompensationInfoCompensationRange;
        /**
         * Output only. Indicates annualized total compensation range cannot be derived, due to the job's all CompensationEntry cannot be annualized. See CompensationEntry for explanation on annualization and base compensation entry.
         */
        annualizedTotalCompensationUnspecified?: boolean | null;
        /**
         * Optional. A 3-letter [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) currency code.
         */
        currency?: string | null;
        /**
         * Optional. Job compensation information. At most one entry can be of type ExtendedCompensationInfo.CompensationType.BASE, which is referred as ** base compensation entry ** for the job.
         */
        entries?: Schema$ExtendedCompensationInfoCompensationEntry[];
    }
    /**
     * Deprecated. See CompensationInfo. A compensation entry that represents one component of compensation, such as base pay, bonus, or other compensation type. Annualization: One compensation entry can be annualized if - it contains valid amount or range. - and its expected_units_per_year is set or can be derived. Its annualized range is determined as (amount or range) times expected_units_per_year.
     */
    export interface Schema$ExtendedCompensationInfoCompensationEntry {
        /**
         * Optional. Monetary amount.
         */
        amount?: Schema$ExtendedCompensationInfoDecimal;
        /**
         * Optional. Compensation description.
         */
        description?: string | null;
        /**
         * Optional. Expected number of units paid each year. If not specified, when Job.employment_types is FULLTIME, a default value is inferred based on unit. Default values: - HOURLY: 2080 - DAILY: 260 - WEEKLY: 52 - MONTHLY: 12 - ANNUAL: 1
         */
        expectedUnitsPerYear?: Schema$ExtendedCompensationInfoDecimal;
        /**
         * Optional. Compensation range.
         */
        range?: Schema$ExtendedCompensationInfoCompensationRange;
        /**
         * Required. Compensation type.
         */
        type?: string | null;
        /**
         * Optional. Frequency of the specified amount. Default is CompensationUnit.COMPENSATION_UNIT_UNSPECIFIED.
         */
        unit?: string | null;
        /**
         * Optional. Indicates compensation amount and range are unset.
         */
        unspecified?: boolean | null;
    }
    /**
     * Deprecated. See CompensationInfo. Compensation range.
     */
    export interface Schema$ExtendedCompensationInfoCompensationRange {
        /**
         * Required. Maximum value.
         */
        max?: Schema$ExtendedCompensationInfoDecimal;
        /**
         * Required. Minimum value.
         */
        min?: Schema$ExtendedCompensationInfoDecimal;
    }
    /**
     * Deprecated. See CompensationInfo. Decimal number.
     */
    export interface Schema$ExtendedCompensationInfoDecimal {
        /**
         * Micro (10^-6) units. The value must be between -999,999 and +999,999 inclusive. If `units` is positive, `micros` must be positive or zero. If `units` is zero, `micros` can be positive, zero, or negative. If `units` is negative, `micros` must be negative or zero. For example -1.75 is represented as `units`=-1 and `micros`=-750,000.
         */
        micros?: number | null;
        /**
         * Whole units.
         */
        units?: string | null;
    }
    /**
     * Deprecated. Use BatchDeleteJobsRequest instead. Input only. Filter for jobs to be deleted.
     */
    export interface Schema$Filter {
        /**
         * Required. The requisition ID (or posting ID) assigned by the client to identify a job. This is intended for client identification and tracking of listings. name takes precedence over this field The maximum number of allowed characters is 225.
         */
        requisitionId?: string | null;
    }
    /**
     * Deprecated. Use SearchJobsRequest.histogram_facets instead to make a single call with both search and histogram. Input only. A request for the `GetHistogram` method.
     */
    export interface Schema$GetHistogramRequest {
        /**
         * Optional. Controls whether to broaden the search to avoid too few results for a given query in instances where a search has sparse results. Results from a broadened query is a superset of the results from the original query. Defaults to false.
         */
        allowBroadening?: boolean | null;
        /**
         * Deprecated. Use query instead. Optional. Restrictions on the scope of the histogram.
         */
        filters?: Schema$JobFilters;
        /**
         * Optional. Query used to search against jobs, such as keyword, location filters, etc.
         */
        query?: Schema$JobQuery;
        /**
         * Meta information, such as `user_id`, collected from the job searcher or other entity conducting a job search, is used to improve the service's search quality. Users determine identifier values, which must be unique and consist.
         */
        requestMetadata?: Schema$RequestMetadata;
        /**
         * Required. A list of facets that specify the histogram data to be calculated against and returned. Histogram response times can be slow, and counts can be approximations. This call may be temporarily or permanently removed prior to the production release of Cloud Talent Solution.
         */
        searchTypes?: string[] | null;
    }
    /**
     * Deprecated. Use SearchJobsRequest.histogram_facets instead to make a single call with both search and histogram. Output only. The response of the GetHistogram method.
     */
    export interface Schema$GetHistogramResponse {
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
        /**
         * The Histogram results.
         */
        results?: Schema$HistogramResult[];
    }
    /**
     * The result of JobService.BatchCreateJobs. It's used to replace google.longrunning.Operation.response in case of success.
     */
    export interface Schema$GoogleCloudTalentV4BatchCreateJobsResponse {
        /**
         * List of job mutation results from a batch create operation. It can change until operation status is FINISHED, FAILED or CANCELLED.
         */
        jobResults?: Schema$GoogleCloudTalentV4JobResult[];
    }
    /**
     * The result of JobService.BatchDeleteJobs. It's used to replace google.longrunning.Operation.response in case of success.
     */
    export interface Schema$GoogleCloudTalentV4BatchDeleteJobsResponse {
        /**
         * List of job mutation results from a batch delete operation. It can change until operation status is FINISHED, FAILED or CANCELLED.
         */
        jobResults?: Schema$GoogleCloudTalentV4JobResult[];
    }
    /**
     * Metadata used for long running operations returned by CTS batch APIs. It's used to replace google.longrunning.Operation.metadata.
     */
    export interface Schema$GoogleCloudTalentV4BatchOperationMetadata {
        /**
         * The time when the batch operation is created.
         */
        createTime?: string | null;
        /**
         * The time when the batch operation is finished and google.longrunning.Operation.done is set to `true`.
         */
        endTime?: string | null;
        /**
         * Count of failed item(s) inside an operation.
         */
        failureCount?: number | null;
        /**
         * The state of a long running operation.
         */
        state?: string | null;
        /**
         * More detailed information about operation state.
         */
        stateDescription?: string | null;
        /**
         * Count of successful item(s) inside an operation.
         */
        successCount?: number | null;
        /**
         * Count of total item(s) inside an operation.
         */
        totalCount?: number | null;
        /**
         * The time when the batch operation status is updated. The metadata and the update_time is refreshed every minute otherwise cached data is returned.
         */
        updateTime?: string | null;
    }
    /**
     * The result of JobService.BatchUpdateJobs. It's used to replace google.longrunning.Operation.response in case of success.
     */
    export interface Schema$GoogleCloudTalentV4BatchUpdateJobsResponse {
        /**
         * List of job mutation results from a batch update operation. It can change until operation status is FINISHED, FAILED or CANCELLED.
         */
        jobResults?: Schema$GoogleCloudTalentV4JobResult[];
    }
    /**
     * Job compensation details.
     */
    export interface Schema$GoogleCloudTalentV4CompensationInfo {
        /**
         * Output only. Annualized base compensation range. Computed as base compensation entry's CompensationEntry.amount times CompensationEntry.expected_units_per_year. See CompensationEntry for explanation on compensation annualization.
         */
        annualizedBaseCompensationRange?: Schema$GoogleCloudTalentV4CompensationInfoCompensationRange;
        /**
         * Output only. Annualized total compensation range. Computed as all compensation entries' CompensationEntry.amount times CompensationEntry.expected_units_per_year. See CompensationEntry for explanation on compensation annualization.
         */
        annualizedTotalCompensationRange?: Schema$GoogleCloudTalentV4CompensationInfoCompensationRange;
        /**
         * Job compensation information. At most one entry can be of type CompensationInfo.CompensationType.BASE, which is referred as **base compensation entry** for the job.
         */
        entries?: Schema$GoogleCloudTalentV4CompensationInfoCompensationEntry[];
    }
    /**
     * A compensation entry that represents one component of compensation, such as base pay, bonus, or other compensation type. Annualization: One compensation entry can be annualized if - it contains valid amount or range. - and its expected_units_per_year is set or can be derived. Its annualized range is determined as (amount or range) times expected_units_per_year.
     */
    export interface Schema$GoogleCloudTalentV4CompensationInfoCompensationEntry {
        /**
         * Compensation amount.
         */
        amount?: Schema$Money;
        /**
         * Compensation description. For example, could indicate equity terms or provide additional context to an estimated bonus.
         */
        description?: string | null;
        /**
         * Expected number of units paid each year. If not specified, when Job.employment_types is FULLTIME, a default value is inferred based on unit. Default values: - HOURLY: 2080 - DAILY: 260 - WEEKLY: 52 - MONTHLY: 12 - ANNUAL: 1
         */
        expectedUnitsPerYear?: number | null;
        /**
         * Compensation range.
         */
        range?: Schema$GoogleCloudTalentV4CompensationInfoCompensationRange;
        /**
         * Compensation type. Default is CompensationType.COMPENSATION_TYPE_UNSPECIFIED.
         */
        type?: string | null;
        /**
         * Frequency of the specified amount. Default is CompensationUnit.COMPENSATION_UNIT_UNSPECIFIED.
         */
        unit?: string | null;
    }
    /**
     * Compensation range.
     */
    export interface Schema$GoogleCloudTalentV4CompensationInfoCompensationRange {
        /**
         * The maximum amount of compensation. If left empty, the value is set to a maximal compensation value and the currency code is set to match the currency code of min_compensation.
         */
        maxCompensation?: Schema$Money;
        /**
         * The minimum amount of compensation. If left empty, the value is set to zero and the currency code is set to match the currency code of max_compensation.
         */
        minCompensation?: Schema$Money;
    }
    /**
     * Custom attribute values that are either filterable or non-filterable.
     */
    export interface Schema$GoogleCloudTalentV4CustomAttribute {
        /**
         * If the `filterable` flag is true, the custom field values may be used for custom attribute filters JobQuery.custom_attribute_filter. If false, these values may not be used for custom attribute filters. Default is false.
         */
        filterable?: boolean | null;
        /**
         * If the `keyword_searchable` flag is true, the keywords in custom fields are searchable by keyword match. If false, the values are not searchable by keyword match. Default is false.
         */
        keywordSearchable?: boolean | null;
        /**
         * Exactly one of string_values or long_values must be specified. This field is used to perform number range search. (`EQ`, `GT`, `GE`, `LE`, `LT`) over filterable `long_value`. Currently at most 1 long_values is supported.
         */
        longValues?: string[] | null;
        /**
         * Exactly one of string_values or long_values must be specified. This field is used to perform a string match (`CASE_SENSITIVE_MATCH` or `CASE_INSENSITIVE_MATCH`) search. For filterable `string_value`s, a maximum total number of 200 values is allowed, with each `string_value` has a byte size of no more than 500B. For unfilterable `string_values`, the maximum total byte size of unfilterable `string_values` is 50KB. Empty string isn't allowed.
         */
        stringValues?: string[] | null;
    }
    /**
     * A Job resource represents a job posting (also referred to as a "job listing" or "job requisition"). A job belongs to a Company, which is the hiring entity responsible for the job.
     */
    export interface Schema$GoogleCloudTalentV4Job {
        /**
         * Strongly recommended for the best service experience. Location(s) where the employer is looking to hire for this job posting. Specifying the full street address(es) of the hiring location enables better API results, especially job searches by commute time. At most 50 locations are allowed for best search performance. If a job has more locations, it is suggested to split it into multiple jobs with unique requisition_ids (e.g. 'ReqA' becomes 'ReqA-1', 'ReqA-2', and so on.) as multiple jobs with the same company, language_code and requisition_id are not allowed. If the original requisition_id must be preserved, a custom field should be used for storage. It is also suggested to group the locations that close to each other in the same job for better search experience. The maximum number of allowed characters is 500.
         */
        addresses?: string[] | null;
        /**
         * Job application information.
         */
        applicationInfo?: Schema$GoogleCloudTalentV4JobApplicationInfo;
        /**
         * Required. The resource name of the company listing the job. The format is "projects/{project_id\}/tenants/{tenant_id\}/companies/{company_id\}". For example, "projects/foo/tenants/bar/companies/baz".
         */
        company?: string | null;
        /**
         * Output only. Display name of the company listing the job.
         */
        companyDisplayName?: string | null;
        /**
         * Job compensation information (a.k.a. "pay rate") i.e., the compensation that will paid to the employee.
         */
        compensationInfo?: Schema$GoogleCloudTalentV4CompensationInfo;
        /**
         * A map of fields to hold both filterable and non-filterable custom job attributes that are not covered by the provided structured fields. The keys of the map are strings up to 64 bytes and must match the pattern: a-zA-Z*. For example, key0LikeThis or KEY_1_LIKE_THIS. At most 100 filterable and at most 100 unfilterable keys are supported. For filterable `string_values`, across all keys at most 200 values are allowed, with each string no more than 255 characters. For unfilterable `string_values`, the maximum total size of `string_values` across all keys is 50KB.
         */
        customAttributes?: {
            [key: string]: Schema$GoogleCloudTalentV4CustomAttribute;
        } | null;
        /**
         * The desired education degrees for the job, such as Bachelors, Masters.
         */
        degreeTypes?: string[] | null;
        /**
         * The department or functional area within the company with the open position. The maximum number of allowed characters is 255.
         */
        department?: string | null;
        /**
         * Output only. Derived details about the job posting.
         */
        derivedInfo?: Schema$GoogleCloudTalentV4JobDerivedInfo;
        /**
         * Required. The description of the job, which typically includes a multi-paragraph description of the company and related information. Separate fields are provided on the job object for responsibilities, qualifications, and other job characteristics. Use of these separate job fields is recommended. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 100,000.
         */
        description?: string | null;
        /**
         * The employment type(s) of a job, for example, full time or part time.
         */
        employmentTypes?: string[] | null;
        /**
         * A description of bonus, commission, and other compensation incentives associated with the job not including salary or pay. The maximum number of allowed characters is 10,000.
         */
        incentives?: string | null;
        /**
         * The benefits included with the job.
         */
        jobBenefits?: string[] | null;
        /**
         * The end timestamp of the job. Typically this field is used for contracting engagements. Invalid timestamps are ignored.
         */
        jobEndTime?: string | null;
        /**
         * The experience level associated with the job, such as "Entry Level".
         */
        jobLevel?: string | null;
        /**
         * The start timestamp of the job in UTC time zone. Typically this field is used for contracting engagements. Invalid timestamps are ignored.
         */
        jobStartTime?: string | null;
        /**
         * The language of the posting. This field is distinct from any requirements for fluency that are associated with the job. Language codes must be in BCP-47 format, such as "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47){: class="external" target="_blank" \}. If this field is unspecified and Job.description is present, detected language code based on Job.description is assigned, otherwise defaults to 'en_US'.
         */
        languageCode?: string | null;
        /**
         * Required during job update. The resource name for the job. This is generated by the service when a job is created. The format is "projects/{project_id\}/tenants/{tenant_id\}/jobs/{job_id\}". For example, "projects/foo/tenants/bar/jobs/baz". Use of this field in job queries and API calls is preferred over the use of requisition_id since this value is unique.
         */
        name?: string | null;
        /**
         * Output only. The timestamp when this job posting was created.
         */
        postingCreateTime?: string | null;
        /**
         * Strongly recommended for the best service experience. The expiration timestamp of the job. After this timestamp, the job is marked as expired, and it no longer appears in search results. The expired job can't be listed by the ListJobs API, but it can be retrieved with the GetJob API or updated with the UpdateJob API or deleted with the DeleteJob API. An expired job can be updated and opened again by using a future expiration timestamp. Updating an expired job fails if there is another existing open job with same company, language_code and requisition_id. The expired jobs are retained in our system for 90 days. However, the overall expired job count cannot exceed 3 times the maximum number of open jobs over previous 7 days. If this threshold is exceeded, expired jobs are cleaned out in order of earliest expire time. Expired jobs are no longer accessible after they are cleaned out. Invalid timestamps are ignored, and treated as expire time not provided. If the timestamp is before the instant request is made, the job is treated as expired immediately on creation. This kind of job can not be updated. And when creating a job with past timestamp, the posting_publish_time must be set before posting_expire_time. The purpose of this feature is to allow other objects, such as Application, to refer a job that didn't exist in the system prior to becoming expired. If you want to modify a job that was expired on creation, delete it and create a new one. If this value isn't provided at the time of job creation or is invalid, the job posting expires after 30 days from the job's creation time. For example, if the job was created on 2017/01/01 13:00AM UTC with an unspecified expiration date, the job expires after 2017/01/31 13:00AM UTC. If this value isn't provided on job update, it depends on the field masks set by UpdateJobRequest.update_mask. If the field masks include job_end_time, or the masks are empty meaning that every field is updated, the job posting expires after 30 days from the job's last update time. Otherwise the expiration date isn't updated.
         */
        postingExpireTime?: string | null;
        /**
         * The timestamp this job posting was most recently published. The default value is the time the request arrives at the server. Invalid timestamps are ignored.
         */
        postingPublishTime?: string | null;
        /**
         * The job PostingRegion (for example, state, country) throughout which the job is available. If this field is set, a LocationFilter in a search query within the job region finds this job posting if an exact location match isn't specified. If this field is set to PostingRegion.NATION or PostingRegion.ADMINISTRATIVE_AREA, setting job Job.addresses to the same location level as this field is strongly recommended.
         */
        postingRegion?: string | null;
        /**
         * Output only. The timestamp when this job posting was last updated.
         */
        postingUpdateTime?: string | null;
        /**
         * Options for job processing.
         */
        processingOptions?: Schema$GoogleCloudTalentV4JobProcessingOptions;
        /**
         * A promotion value of the job, as determined by the client. The value determines the sort order of the jobs returned when searching for jobs using the featured jobs search call, with higher promotional values being returned first and ties being resolved by relevance sort. Only the jobs with a promotionValue \>0 are returned in a FEATURED_JOB_SEARCH. Default value is 0, and negative values are treated as 0.
         */
        promotionValue?: number | null;
        /**
         * A description of the qualifications required to perform the job. The use of this field is recommended as an alternative to using the more general description field. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 10,000.
         */
        qualifications?: string | null;
        /**
         * Required. The requisition ID, also referred to as the posting ID, is assigned by the client to identify a job. This field is intended to be used by clients for client identification and tracking of postings. A job isn't allowed to be created if there is another job with the same company, language_code and requisition_id. The maximum number of allowed characters is 255.
         */
        requisitionId?: string | null;
        /**
         * A description of job responsibilities. The use of this field is recommended as an alternative to using the more general description field. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 10,000.
         */
        responsibilities?: string | null;
        /**
         * Required. The title of the job, such as "Software Engineer" The maximum number of allowed characters is 500.
         */
        title?: string | null;
        /**
         * Deprecated. The job is only visible to the owner. The visibility of the job. Defaults to Visibility.ACCOUNT_ONLY if not specified.
         */
        visibility?: string | null;
    }
    /**
     * Application related details of a job posting.
     */
    export interface Schema$GoogleCloudTalentV4JobApplicationInfo {
        /**
         * Use this field to specify email address(es) to which resumes or applications can be sent. The maximum number of allowed characters for each entry is 255.
         */
        emails?: string[] | null;
        /**
         * Use this field to provide instructions, such as "Mail your application to ...", that a candidate can follow to apply for the job. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 3,000.
         */
        instruction?: string | null;
        /**
         * Use this URI field to direct an applicant to a website, for example to link to an online application form. The maximum number of allowed characters for each entry is 2,000.
         */
        uris?: string[] | null;
    }
    /**
     * Derived details about the job posting.
     */
    export interface Schema$GoogleCloudTalentV4JobDerivedInfo {
        /**
         * Job categories derived from Job.title and Job.description.
         */
        jobCategories?: string[] | null;
        /**
         * Structured locations of the job, resolved from Job.addresses. locations are exactly matched to Job.addresses in the same order.
         */
        locations?: Schema$GoogleCloudTalentV4Location[];
    }
    /**
     * Options for job processing.
     */
    export interface Schema$GoogleCloudTalentV4JobProcessingOptions {
        /**
         * If set to `true`, the service does not attempt to resolve a more precise address for the job.
         */
        disableStreetAddressResolution?: boolean | null;
        /**
         * Option for job HTML content sanitization. Applied fields are: * description * applicationInfo.instruction * incentives * qualifications * responsibilities HTML tags in these fields may be stripped if sanitiazation isn't disabled. Defaults to HtmlSanitization.SIMPLE_FORMATTING_ONLY.
         */
        htmlSanitization?: string | null;
    }
    /**
     * Mutation result of a job from a batch operation.
     */
    export interface Schema$GoogleCloudTalentV4JobResult {
        /**
         * Here Job only contains basic information including name, company, language_code and requisition_id, use getJob method to retrieve detailed information of the created/updated job.
         */
        job?: Schema$GoogleCloudTalentV4Job;
        /**
         * The status of the job processed. This field is populated if the processing of the job fails.
         */
        status?: Schema$Status;
    }
    /**
     * A resource that represents a location with full geographic information.
     */
    export interface Schema$GoogleCloudTalentV4Location {
        /**
         * An object representing a latitude/longitude pair.
         */
        latLng?: Schema$LatLng;
        /**
         * The type of a location, which corresponds to the address lines field of google.type.PostalAddress. For example, "Downtown, Atlanta, GA, USA" has a type of LocationType.NEIGHBORHOOD, and "Kansas City, KS, USA" has a type of LocationType.LOCALITY.
         */
        locationType?: string | null;
        /**
         * Postal address of the location that includes human readable information, such as postal delivery and payments addresses. Given a postal address, a postal service can deliver items to a premises, P.O. Box, or other delivery location.
         */
        postalAddress?: Schema$PostalAddress;
        /**
         * Radius in miles of the job location. This value is derived from the location bounding box in which a circle with the specified radius centered from google.type.LatLng covers the area associated with the job location. For example, currently, "Mountain View, CA, USA" has a radius of 6.17 miles.
         */
        radiusMiles?: number | null;
    }
    /**
     * Input only. Histogram facets to be specified in SearchJobsRequest.
     */
    export interface Schema$HistogramFacets {
        /**
         * Optional. Specifies compensation field-based histogram requests. Duplicate values of CompensationHistogramRequest.type are not allowed.
         */
        compensationHistogramFacets?: Schema$CompensationHistogramRequest[];
        /**
         * Optional. Specifies the custom attributes histogram requests. Duplicate values of CustomAttributeHistogramRequest.key are not allowed.
         */
        customAttributeHistogramFacets?: Schema$CustomAttributeHistogramRequest[];
        /**
         * Optional. Specifies the simple type of histogram facets, for example, `COMPANY_SIZE`, `EMPLOYMENT_TYPE` etc. This field is equivalent to GetHistogramRequest.
         */
        simpleHistogramFacets?: string[] | null;
    }
    /**
     * Output only. Result of a histogram call. The response contains the histogram map for the search type specified by HistogramResult.field. The response is a map of each filter value to the corresponding count of jobs for that filter.
     */
    export interface Schema$HistogramResult {
        /**
         * The Histogram search filters.
         */
        searchType?: string | null;
        /**
         * A map from the values of field to the number of jobs with that value in this search result. Key: search type (filter names, such as the companyName). Values: the count of jobs that match the filter for this search.
         */
        values?: {
            [key: string]: number;
        } | null;
    }
    /**
     * Output only. Histogram results that matches HistogramFacets specified in SearchJobsRequest.
     */
    export interface Schema$HistogramResults {
        /**
         * Specifies compensation field-based histogram results that matches HistogramFacets.compensation_histogram_requests.
         */
        compensationHistogramResults?: Schema$CompensationHistogramResult[];
        /**
         * Specifies histogram results for custom attributes that matches HistogramFacets.custom_attribute_histogram_facets.
         */
        customAttributeHistogramResults?: Schema$CustomAttributeHistogramResult[];
        /**
         * Specifies histogram results that matches HistogramFacets.simple_histogram_facets.
         */
        simpleHistogramResults?: Schema$HistogramResult[];
    }
    /**
     * A Job resource represents a job posting (also referred to as a "job listing" or "job requisition"). A job belongs to a Company, which is the hiring entity responsible for the job.
     */
    export interface Schema$Job {
        /**
         * Optional but at least one of application_urls, application_email_list or application_instruction must be specified. Use this field to specify email address(es) to which resumes or applications can be sent. The maximum number of allowed characters is 255.
         */
        applicationEmailList?: string[] | null;
        /**
         * Optional but at least one of application_urls, application_email_list or application_instruction must be specified. Use this field to provide instructions, such as "Mail your application to ...", that a candidate can follow to apply for the job. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 3,000.
         */
        applicationInstruction?: string | null;
        /**
         * Optional but at least one of application_urls, application_email_list or application_instruction must be specified. Use this URL field to direct an applicant to a website, for example to link to an online application form. The maximum number of allowed characters is 2,000.
         */
        applicationUrls?: string[] | null;
        /**
         * Optional. The benefits included with the job.
         */
        benefits?: string[] | null;
        /**
         * Output only. The name of the company listing the job.
         */
        companyDisplayName?: string | null;
        /**
         * Optional but one of company_name or distributor_company_id must be provided. The resource name of the company listing the job, such as /companies/foo. This field takes precedence over the distributor-assigned company identifier, distributor_company_id.
         */
        companyName?: string | null;
        /**
         * Deprecated. Use company_display_name instead. Output only. The name of the company listing the job.
         */
        companyTitle?: string | null;
        /**
         * Optional. Job compensation information.
         */
        compensationInfo?: Schema$CompensationInfo;
        /**
         * Output only. The timestamp when this job was created.
         */
        createTime?: string | null;
        /**
         * Optional. A map of fields to hold both filterable and non-filterable custom job attributes that are not covered by the provided structured fields. This field is a more general combination of the deprecated id-based filterable_custom_fields and string-based non_filterable_custom_fields. The keys of the map are strings up to 64 bytes and must match the pattern: a-zA-Z*. At most 100 filterable and at most 100 unfilterable keys are supported. For filterable `string_values`, across all keys at most 200 values are allowed, with each string no more than 255 characters. For unfilterable `string_values`, the maximum total size of `string_values` across all keys is 50KB.
         */
        customAttributes?: {
            [key: string]: Schema$CustomAttribute;
        } | null;
        /**
         * Optional. The department or functional area within the company with the open position. The maximum number of allowed characters is 255.
         */
        department?: string | null;
        /**
         * Required. The description of the job, which typically includes a multi-paragraph description of the company and related information. Separate fields are provided on the job object for responsibilities, qualifications, and other job characteristics. Use of these separate job fields is recommended. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 100,000.
         */
        description?: string | null;
        /**
         * Optional but one of company_name or distributor_company_id must be provided. A unique company identifier used by job distributors to identify an employer's company entity. company_name takes precedence over this field, and is the recommended field to use to identify companies. The maximum number of allowed characters is 255.
         */
        distributorCompanyId?: string | null;
        /**
         * Optional. The desired education level for the job, such as "Bachelors", "Masters", "Doctorate".
         */
        educationLevels?: string[] | null;
        /**
         * Optional. The employment type(s) of a job, for example, full time or part time.
         */
        employmentTypes?: string[] | null;
        /**
         * Optional. The end date of the job in UTC time zone. Typically this field is used for contracting engagements. Dates prior to 1970/1/1 and invalid date formats are ignored.
         */
        endDate?: Schema$Date;
        /**
         * Optional but strongly recommended for the best service experience. The expiration timestamp of the job. After this timestamp, the job is marked as expired, and it no longer appears in search results. The expired job can't be deleted or listed by the DeleteJob and ListJobs APIs, but it can be retrieved with the GetJob API or updated with the UpdateJob API. An expired job can be updated and opened again by using a future expiration timestamp. Updating an expired job fails if there is another existing open job with same requisition_id, company_name and language_code. The expired jobs are retained in our system for 90 days. However, the overall expired job count cannot exceed 3 times the maximum of open jobs count over the past week, otherwise jobs with earlier expire time are cleaned first. Expired jobs are no longer accessible after they are cleaned out. The format of this field is RFC 3339 date strings. Example: 2000-01-01T00:00:00.999999999Z See [https://www.ietf.org/rfc/rfc3339.txt](https://www.ietf.org/rfc/rfc3339.txt). A valid date range is between 1970-01-01T00:00:00.0Z and 2100-12-31T23:59:59.999Z. Invalid dates are ignored and treated as expire time not provided. If this value is not provided at the time of job creation or is invalid, the job posting expires after 30 days from the job's creation time. For example, if the job was created on 2017/01/01 13:00AM UTC with an unspecified expiration date, the job expires after 2017/01/31 13:00AM UTC. If this value is not provided but expiry_date is, expiry_date is used. If this value is not provided on job update, it depends on the field masks set by UpdateJobRequest.update_job_fields. If the field masks include expiry_time, or the masks are empty meaning that every field is updated, the job posting expires after 30 days from the job's last update time. Otherwise the expiration date isn't updated.
         */
        expireTime?: string | null;
        /**
         * Deprecated. Use expire_time instead. Optional but strongly recommended to be provided for the best service experience. The expiration date of the job in UTC time. After 12 am on this date, the job is marked as expired, and it no longer appears in search results. The expired job can't be deleted or listed by the DeleteJob and ListJobs APIs, but it can be retrieved with the GetJob API or updated with the UpdateJob API. An expired job can be updated and opened again by using a future expiration date. It can also remain expired. Updating an expired job to be open fails if there is another existing open job with same requisition_id, company_name and language_code. The expired jobs are retained in our system for 90 days. However, the overall expired job count cannot exceed 3 times the maximum of open jobs count over the past week, otherwise jobs with earlier expire time are removed first. Expired jobs are no longer accessible after they are cleaned out. A valid date range is between 1970/1/1 and 2100/12/31. Invalid dates are ignored and treated as expiry date not provided. If this value is not provided on job creation or is invalid, the job posting expires after 30 days from the job's creation time. For example, if the job was created on 2017/01/01 13:00AM UTC with an unspecified expiration date, the job expires after 2017/01/31 13:00AM UTC. If this value is not provided on job update, it depends on the field masks set by UpdateJobRequest.update_job_fields. If the field masks include expiry_date, or the masks are empty meaning that every field is updated, the job expires after 30 days from the job's last update time. Otherwise the expiration date isn't updated.
         */
        expiryDate?: Schema$Date;
        /**
         * Deprecated. Always use compensation_info. Optional. Job compensation information. This field replaces compensation_info. Only CompensationInfo.entries or extended_compensation_info can be set, otherwise an exception is thrown.
         */
        extendedCompensationInfo?: Schema$ExtendedCompensationInfo;
        /**
         * Deprecated. Use custom_attributes instead. Optional. A map of fields to hold filterable custom job attributes not captured by the standard fields such as job_title, company_name, or level. These custom fields store arbitrary string values, and can be used for purposes not covered by the structured fields. For the best search experience, use of the structured rather than custom fields is recommended. Data stored in these custom fields fields are indexed and searched against by keyword searches (see SearchJobsRequest.custom_field_filters][]). The map key must be a number between 1-20. If an invalid key is provided on job create or update, an error is returned.
         */
        filterableCustomFields?: {
            [key: string]: Schema$CustomField;
        } | null;
        /**
         * Optional. A description of bonus, commission, and other compensation incentives associated with the job not including salary or pay. The maximum number of allowed characters is 10,000.
         */
        incentives?: string | null;
        /**
         * Output only. Structured locations of the job, resolved from locations.
         */
        jobLocations?: Schema$JobLocation[];
        /**
         * Required. The title of the job, such as "Software Engineer" The maximum number of allowed characters is 500.
         */
        jobTitle?: string | null;
        /**
         * Optional. The language of the posting. This field is distinct from any requirements for fluency that are associated with the job. Language codes must be in BCP-47 format, such as "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47){: class="external" target="_blank" \}. If this field is unspecified and Job.description is present, detected language code based on Job.description is assigned, otherwise defaults to 'en_US'.
         */
        languageCode?: string | null;
        /**
         * Optional. The experience level associated with the job, such as "Entry Level".
         */
        level?: string | null;
        /**
         * Optional but strongly recommended for the best service experience. Location(s) where the emploeyer is looking to hire for this job posting. Specifying the full street address(es) of the hiring location enables better API results, especially job searches by commute time. At most 50 locations are allowed for best search performance. If a job has more locations, it is suggested to split it into multiple jobs with unique requisition_ids (e.g. 'ReqA' becomes 'ReqA-1', 'ReqA-2', etc.) as multiple jobs with the same requisition_id, company_name and language_code are not allowed. If the original requisition_id must be preserved, a custom field should be used for storage. It is also suggested to group the locations that close to each other in the same job for better search experience. The maximum number of allowed characters is 500.
         */
        locations?: string[] | null;
        /**
         * Required during job update. Resource name assigned to a job by the API, for example, "/jobs/foo". Use of this field in job queries and API calls is preferred over the use of requisition_id since this value is unique.
         */
        name?: string | null;
        /**
         * Optional. A promotion value of the job, as determined by the client. The value determines the sort order of the jobs returned when searching for jobs using the featured jobs search call, with higher promotional values being returned first and ties being resolved by relevance sort. Only the jobs with a promotionValue \>0 are returned in a FEATURED_JOB_SEARCH. Default value is 0, and negative values are treated as 0.
         */
        promotionValue?: number | null;
        /**
         * Optional. The date this job was most recently published in UTC format. The default value is the time the request arrives at the server.
         */
        publishDate?: Schema$Date;
        /**
         * Optional. A description of the qualifications required to perform the job. The use of this field is recommended as an alternative to using the more general description field. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 10,000.
         */
        qualifications?: string | null;
        /**
         * Output only. The URL of a web page that displays job details.
         */
        referenceUrl?: string | null;
        /**
         * Optional. The job Region (for example, state, country) throughout which the job is available. If this field is set, a LocationFilter in a search query within the job region finds this job if an exact location match is not specified. If this field is set, setting job locations to the same location level as this field is strongly recommended.
         */
        region?: string | null;
        /**
         * Required. The requisition ID, also referred to as the posting ID, assigned by the client to identify a job. This field is intended to be used by clients for client identification and tracking of listings. A job is not allowed to be created if there is another job with the same requisition_id, company_name and language_code. The maximum number of allowed characters is 255.
         */
        requisitionId?: string | null;
        /**
         * Optional. A description of job responsibilities. The use of this field is recommended as an alternative to using the more general description field. This field accepts and sanitizes HTML input, and also accepts bold, italic, ordered list, and unordered list markup tags. The maximum number of allowed characters is 10,000.
         */
        responsibilities?: string | null;
        /**
         * Optional. The start date of the job in UTC time zone. Typically this field is used for contracting engagements. Dates prior to 1970/1/1 and invalid date formats are ignored.
         */
        startDate?: Schema$Date;
        /**
         * Deprecated. Use custom_attributes instead. Optional. A map of fields to hold non-filterable custom job attributes, similar to filterable_custom_fields. These fields are distinct in that the data in these fields are not indexed. Therefore, the client cannot search against them, nor can the client use them to list jobs. The key of the map can be any valid string.
         */
        unindexedCustomFields?: {
            [key: string]: Schema$CustomField;
        } | null;
        /**
         * Output only. The timestamp when this job was last updated.
         */
        updateTime?: string | null;
        /**
         * Optional. The visibility of the job. Defaults to JobVisibility.PRIVATE if not specified. Currently only JobVisibility.PRIVATE is supported.
         */
        visibility?: string | null;
    }
    /**
     * Input only. Deprecated. Use JobQuery instead. The filters required to perform a search query or histogram.
     */
    export interface Schema$JobFilters {
        /**
         * Optional. The category filter specifies the categories of jobs to search against. See Category for more information. If a value is not specified, jobs from any category are searched against. If multiple values are specified, jobs from any of the specified categories are searched against.
         */
        categories?: string[] | null;
        /**
         * Optional. Allows filtering jobs by commute time with different travel methods (e.g. driving or public transit). Note: this only works with COMMUTE MODE. When specified, [JobFilters.location_filters] will be ignored. Currently we do not support sorting by commute time.
         */
        commuteFilter?: Schema$CommutePreference;
        /**
         * Optional. The company names filter specifies the company entities to search against. If a value is not specified, jobs are searched for against all companies. If multiple values are specified, jobs are searched against the specified companies. At most 20 company filters are allowed.
         */
        companyNames?: string[] | null;
        /**
         * Optional. This filter specifies the exact company titles of jobs to search against. If a value is not specified, jobs within the search results can be associated with any company. If multiple values are specified, jobs within the search results may be associated with any of the specified companies. At most 20 company title filters are allowed.
         */
        companyTitles?: string[] | null;
        /**
         * Optional. This search filter is applied only to Job.compensation_info. For example, if the filter is specified as "Hourly job with per-hour compensation \> $15", only jobs that meet this criteria are searched. If a filter is not defined, all open jobs are searched.
         */
        compensationFilter?: Schema$CompensationFilter;
        /**
         * Optional. This filter specifies a structured syntax to match against the Job.custom_attributes that are marked as `filterable`. The syntax for this expression is a subset of Google SQL syntax. Supported operators are: =, !=, <, <=, \>, \>= where the left of the operator is a custom field key and the right of the operator is a number or string (surrounded by quotes) value. Supported functions are LOWER() to perform case insensitive match and EMPTY() to filter on the existence of a key. Boolean expressions (AND/OR/NOT) are supported up to 3 levels of nesting (For example, "((A AND B AND C) OR NOT D) AND E"), and there can be a maximum of 100 comparisons/functions in the expression. The expression must be < 3000 bytes in length. Sample Query: (key1 = "TEST" OR LOWER(key1)="test" OR NOT EMPTY(key1)) AND key2 \> 100
         */
        customAttributeFilter?: string | null;
        /**
         * Deprecated. Use custom_attribute_filter instead. Optional. This filter specifies searching against custom field values. See Job.filterable_custom_fields for information. The key value specifies a number between 1-20 (the service supports 20 custom fields) corresponding to the desired custom field map value. If an invalid key is provided or specified together with custom_attribute_filter, an error is thrown.
         */
        customFieldFilters?: {
            [key: string]: Schema$CustomFieldFilter;
        } | null;
        /**
         * Optional. This flag controls the spell-check feature. If false, the service attempts to correct a misspelled query, for example, "enginee" is corrected to "engineer". Defaults to false: a spell check is performed.
         */
        disableSpellCheck?: boolean | null;
        /**
         * Optional. The employment type filter specifies the employment type of jobs to search against, such as EmploymentType.FULL_TIME. If a value is not specified, jobs in the search results include any employment type. If multiple values are specified, jobs in the search results include any of the specified employment types.
         */
        employmentTypes?: string[] | null;
        /**
         * Deprecated. Always use compensation_filter. Optional. This search filter is applied only to Job.extended_compensation_info. For example, if the filter is specified as "Hourly job with per-hour compensation \> $15", only jobs that meet these criteria are searched. If a filter is not defined, all open jobs are searched.
         */
        extendedCompensationFilter?: Schema$ExtendedCompensationFilter;
        /**
         * Optional. This filter specifies the locale of jobs to search against, for example, "en-US". If a value is not specified, the search results may contain jobs in any locale. Language codes should be in BCP-47 format, for example, "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47). At most 10 language code filters are allowed.
         */
        languageCodes?: string[] | null;
        /**
         * Optional. The location filter specifies geo-regions containing the jobs to search against. See LocationFilter for more information. If a location value is not specified, jobs are retrieved from all locations. If multiple values are specified, jobs are retrieved from any of the specified locations. If different values are specified for the LocationFilter.distance_in_miles parameter, the maximum provided distance is used for all locations. At most 5 location filters are allowed.
         */
        locationFilters?: Schema$LocationFilter[];
        /**
         * Optional. Jobs published within a range specified by this filter are searched against, for example, DateRange.PAST_MONTH. If a value is not specified, all open jobs are searched against regardless of the date they were published.
         */
        publishDateRange?: string | null;
        /**
         * Optional. The query filter contains the keywords that match against the job title, description, and location fields. The maximum query size is 255 bytes/characters.
         */
        query?: string | null;
        /**
         * Deprecated. Do not use this field. This flag controls whether the job search should be restricted to jobs owned by the current user. Defaults to false where all jobs accessible to the user are searched against.
         */
        tenantJobOnly?: boolean | null;
    }
    /**
     * Output only. A resource that represents a location with full geographic information.
     */
    export interface Schema$JobLocation {
        /**
         * An object representing a latitude/longitude pair.
         */
        latLng?: Schema$LatLng;
        /**
         * The type of a location, which corresponds to the address lines field of PostalAddress. For example, "Downtown, Atlanta, GA, USA" has a type of LocationType#NEIGHBORHOOD, and "Kansas City, KS, USA" has a type of LocationType#LOCALITY.
         */
        locationType?: string | null;
        /**
         * Postal address of the location that includes human readable information, such as postal delivery and payments addresses. Given a postal address, a postal service can deliver items to a premises, P.O. Box, or other delivery location.
         */
        postalAddress?: Schema$PostalAddress;
        /**
         * Radius in meters of the job location. This value is derived from the location bounding box in which a circle with the specified radius centered from LatLng coves the area associated with the job location. For example, currently, "Mountain View, CA, USA" has a radius of 7885.79 meters.
         */
        radiusMeters?: number | null;
    }
    /**
     * Input only. Options for job processing.
     */
    export interface Schema$JobProcessingOptions {
        /**
         * Optional. If set to `true`, the service does not attempt to resolve a more precise address for the job.
         */
        disableStreetAddressResolution?: boolean | null;
        /**
         * Optional. Option for job HTML content sanitization. Applied fields are: * description * applicationInstruction * incentives * qualifications * responsibilities HTML tags in these fields may be stripped if sanitiazation is not disabled. Defaults to HtmlSanitization.SIMPLE_FORMATTING_ONLY.
         */
        htmlSanitization?: string | null;
    }
    /**
     * Input only. The query required to perform a search query or histogram.
     */
    export interface Schema$JobQuery {
        /**
         * Optional. The category filter specifies the categories of jobs to search against. See Category for more information. If a value is not specified, jobs from any category are searched against. If multiple values are specified, jobs from any of the specified categories are searched against.
         */
        categories?: string[] | null;
        /**
         * Optional. Allows filtering jobs by commute time with different travel methods (for example, driving or public transit). Note: This only works with COMMUTE MODE. When specified, [JobQuery.location_filters] is ignored. Currently we don't support sorting by commute time.
         */
        commuteFilter?: Schema$CommutePreference;
        /**
         * Optional. This filter specifies the exact company display name of the jobs to search against. If a value isn't specified, jobs within the search results are associated with any company. If multiple values are specified, jobs within the search results may be associated with any of the specified companies. At most 20 company display name filters are allowed.
         */
        companyDisplayNames?: string[] | null;
        /**
         * Optional. This filter specifies the company entities to search against. If a value isn't specified, jobs are searched for against all companies. If multiple values are specified, jobs are searched against the companies specified. At most 20 company filters are allowed.
         */
        companyNames?: string[] | null;
        /**
         * Optional. This search filter is applied only to Job.compensation_info. For example, if the filter is specified as "Hourly job with per-hour compensation \> $15", only jobs meeting these criteria are searched. If a filter isn't defined, all open jobs are searched.
         */
        compensationFilter?: Schema$CompensationFilter;
        /**
         * Optional. This filter specifies a structured syntax to match against the Job.custom_attributes marked as `filterable`. The syntax for this expression is a subset of Google SQL syntax. Supported operators are: =, !=, <, <=, \>, \>= where the left of the operator is a custom field key and the right of the operator is a number or string (surrounded by quotes) value. Supported functions are LOWER() to perform case insensitive match and EMPTY() to filter on the existence of a key. Boolean expressions (AND/OR/NOT) are supported up to 3 levels of nesting (for example, "((A AND B AND C) OR NOT D) AND E"), a maximum of 50 comparisons/functions are allowed in the expression. The expression must be < 2000 characters in length. Sample Query: (key1 = "TEST" OR LOWER(key1)="test" OR NOT EMPTY(key1)) AND key2 \> 100
         */
        customAttributeFilter?: string | null;
        /**
         * Optional. This flag controls the spell-check feature. If false, the service attempts to correct a misspelled query, for example, "enginee" is corrected to "engineer". Defaults to false: a spell check is performed.
         */
        disableSpellCheck?: boolean | null;
        /**
         * Optional. The employment type filter specifies the employment type of jobs to search against, such as EmploymentType.FULL_TIME. If a value is not specified, jobs in the search results include any employment type. If multiple values are specified, jobs in the search results include any of the specified employment types.
         */
        employmentTypes?: string[] | null;
        /**
         * Optional. This filter specifies the locale of jobs to search against, for example, "en-US". If a value isn't specified, the search results can contain jobs in any locale. Language codes should be in BCP-47 format, such as "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47). At most 10 language code filters are allowed.
         */
        languageCodes?: string[] | null;
        /**
         * Optional. The location filter specifies geo-regions containing the jobs to search against. See LocationFilter for more information. If a location value isn't specified, jobs fitting the other search criteria are retrieved regardless of where they're located. If multiple values are specified, jobs are retrieved from any of the specified locations. If different values are specified for the LocationFilter.distance_in_miles parameter, the maximum provided distance is used for all locations. At most 5 location filters are allowed.
         */
        locationFilters?: Schema$LocationFilter[];
        /**
         * Optional. Jobs published within a range specified by this filter are searched against, for example, DateRange.PAST_MONTH. If a value isn't specified, all open jobs are searched against regardless of their published date.
         */
        publishDateRange?: string | null;
        /**
         * Optional. The query string that matches against the job title, description, and location fields. The maximum query size is 255 bytes.
         */
        query?: string | null;
    }
    /**
     * An object representing a latitude/longitude pair. This is expressed as a pair of doubles representing degrees latitude and degrees longitude. Unless specified otherwise, this must conform to the WGS84 standard. Values must be within normalized ranges.
     */
    export interface Schema$LatLng {
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        latitude?: number | null;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        longitude?: number | null;
    }
    /**
     * Output only. The List companies response object.
     */
    export interface Schema$ListCompaniesResponse {
        /**
         * Companies for the current client.
         */
        companies?: Schema$Company[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Deprecated. Use ListJobsResponse instead. Output only. The List jobs response object.
     */
    export interface Schema$ListCompanyJobsResponse {
        /**
         * The Jobs for a given company. The maximum number of items returned is based on the limit field provided in the request.
         */
        jobs?: Schema$Job[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The total number of open jobs. The result will be empty if ListCompanyJobsRequest.include_jobs_count is not enabled or if no open jobs are available.
         */
        totalSize?: string | null;
    }
    /**
     * Output only. List jobs response.
     */
    export interface Schema$ListJobsResponse {
        /**
         * The Jobs for a given company. The maximum number of items returned is based on the limit field provided in the request.
         */
        jobs?: Schema$Job[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Input only. Geographic region of the search.
     */
    export interface Schema$LocationFilter {
        /**
         * Optional. The distance_in_miles is applied when the location being searched for is identified as a city or smaller. When the location being searched for is a state or larger, this field is ignored.
         */
        distanceInMiles?: number | null;
        /**
         * Optional. Allows the client to return jobs without a set location, specifically, telecommuting jobs (telecomuting is considered by the service as a special location. Job.allow_telecommute indicates if a job permits telecommuting. If this field is true, telecommuting jobs are searched, and name and lat_lng are ignored. This filter can be used by itself to search exclusively for telecommuting jobs, or it can be combined with another location filter to search for a combination of job locations, such as "Mountain View" or "telecommuting" jobs. However, when used in combination with other location filters, telecommuting jobs can be treated as less relevant than other jobs in the search response.
         */
        isTelecommute?: boolean | null;
        /**
         * Optional. The latitude and longitude of the geographic center from which to search. This field is ignored if `location_name` is provided.
         */
        latLng?: Schema$LatLng;
        /**
         * Optional. The address name, such as "Mountain View" or "Bay Area".
         */
        name?: string | null;
        /**
         * Optional. CLDR region code of the country/region of the address. This will be used to address ambiguity of the user-input location, e.g. "Liverpool" against "Liverpool, NY, US" or "Liverpool, UK". Set this field if all the jobs to search against are from a same region, or jobs are world-wide but the job seeker is from a specific region. See http://cldr.unicode.org/ and http://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.
         */
        regionCode?: string | null;
    }
    /**
     * Output only. Job entry with metadata inside SearchJobsResponse.
     */
    export interface Schema$MatchingJob {
        /**
         * Commute information which is generated based on specified CommutePreference.
         */
        commuteInfo?: Schema$CommuteInfo;
        /**
         * Job resource that matches the specified SearchJobsRequest.
         */
        job?: Schema$Job;
        /**
         * A summary of the job with core information that's displayed on the search results listing page.
         */
        jobSummary?: string | null;
        /**
         * Contains snippets of text from the Job.job_title field most closely matching a search query's keywords, if available. The matching query keywords are enclosed in HTML bold tags.
         */
        jobTitleSnippet?: string | null;
        /**
         * Contains snippets of text from the Job.description and similar fields that most closely match a search query's keywords, if available. All HTML tags in the original fields are stripped when returned in this field, and matching query keywords are enclosed in HTML bold tags.
         */
        searchTextSnippet?: string | null;
    }
    /**
     * Message representing input to a Mendel server for debug forcing. See go/mendel-debug-forcing for more details. Next ID: 2
     */
    export interface Schema$MendelDebugInput {
        /**
         * When a request spans multiple servers, a MendelDebugInput may travel with the request and take effect in all the servers. This field is a map of namespaces to NamespacedMendelDebugInput protos. In a single server, up to two NamespacedMendelDebugInput protos are applied: 1. NamespacedMendelDebugInput with the global namespace (key == ""). 2. NamespacedMendelDebugInput with the server's namespace. When both NamespacedMendelDebugInput protos are present, they are merged. See go/mendel-debug-forcing for more details.
         */
        namespacedDebugInput?: {
            [key: string]: Schema$NamespacedDebugInput;
        } | null;
    }
    /**
     * Represents an amount of money with its currency type.
     */
    export interface Schema$Money {
        /**
         * The 3-letter currency code defined in ISO 4217.
         */
        currencyCode?: string | null;
        /**
         * Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
         */
        nanos?: number | null;
        /**
         * The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
         */
        units?: string | null;
    }
    /**
     * Next ID: 15
     */
    export interface Schema$NamespacedDebugInput {
        /**
         * Set of experiment names to be absolutely forced. These experiments will be forced without evaluating the conditions.
         */
        absolutelyForcedExpNames?: string[] | null;
        /**
         * Set of experiment ids to be absolutely forced. These ids will be forced without evaluating the conditions.
         */
        absolutelyForcedExps?: number[] | null;
        /**
         * Set of experiment tags to be absolutely forced. The experiments with these tags will be forced without evaluating the conditions.
         */
        absolutelyForcedExpTags?: string[] | null;
        /**
         * Set of experiment names to be conditionally forced. These experiments will be forced only if their conditions and their parent domain's conditions are true.
         */
        conditionallyForcedExpNames?: string[] | null;
        /**
         * Set of experiment ids to be conditionally forced. These ids will be forced only if their conditions and their parent domain's conditions are true.
         */
        conditionallyForcedExps?: number[] | null;
        /**
         * Set of experiment tags to be conditionally forced. The experiments with these tags will be forced only if their conditions and their parent domain's conditions are true.
         */
        conditionallyForcedExpTags?: string[] | null;
        /**
         * If true, disable automatic enrollment selection (at all diversion points). Automatic enrollment selection means experiment selection process based on the experiment's automatic enrollment condition. This does not disable selection of forced experiments.
         */
        disableAutomaticEnrollmentSelection?: boolean | null;
        /**
         * Set of experiment names to be disabled. If an experiment is disabled, it is never selected nor forced. If an aggregate experiment is disabled, its partitions are disabled together. If an experiment with an enrollment is disabled, the enrollment is disabled together. If a name corresponds to a domain, the domain itself and all descendant experiments and domains are disabled together.
         */
        disableExpNames?: string[] | null;
        /**
         * Set of experiment ids to be disabled. If an experiment is disabled, it is never selected nor forced. If an aggregate experiment is disabled, its partitions are disabled together. If an experiment with an enrollment is disabled, the enrollment is disabled together. If an ID corresponds to a domain, the domain itself and all descendant experiments and domains are disabled together.
         */
        disableExps?: number[] | null;
        /**
         * Set of experiment tags to be disabled. All experiments that are tagged with one or more of these tags are disabled. If an experiment is disabled, it is never selected nor forced. If an aggregate experiment is disabled, its partitions are disabled together. If an experiment with an enrollment is disabled, the enrollment is disabled together.
         */
        disableExpTags?: string[] | null;
        /**
         * If true, disable manual enrollment selection (at all diversion points). Manual enrollment selection means experiment selection process based on the request's manual enrollment states (a.k.a. opt-in experiments). This does not disable selection of forced experiments.
         */
        disableManualEnrollmentSelection?: boolean | null;
        /**
         * If true, disable organic experiment selection (at all diversion points). Organic selection means experiment selection process based on traffic allocation and diversion condition evaluation. This does not disable selection of forced experiments. This is useful in cases when it is not known whether experiment selection behavior is responsible for a error or breakage. Disabling organic selection may help to isolate the cause of a given problem.
         */
        disableOrganicSelection?: boolean | null;
        /**
         * Flags to force in a particular experiment state. Map from flag name to flag value.
         */
        forcedFlags?: {
            [key: string]: string;
        } | null;
        /**
         * Rollouts to force in a particular experiment state. Map from rollout name to rollout value.
         */
        forcedRollouts?: {
            [key: string]: boolean;
        } | null;
    }
    /**
     * Input only. Use this field to specify bucketing option for the histogram search response.
     */
    export interface Schema$NumericBucketingOption {
        /**
         * Required. Two adjacent values form a histogram bucket. Values should be in ascending order. For example, if [5, 10, 15] are provided, four buckets are created: (-inf, 5), 5, 10), [10, 15), [15, inf). At most 20 [buckets_bound is supported.
         */
        bucketBounds?: number[] | null;
        /**
         * Optional. If set to true, the histogram result includes minimum/maximum value of the numeric field.
         */
        requiresMinMax?: boolean | null;
    }
    /**
     * Output only. Custom numeric bucketing result.
     */
    export interface Schema$NumericBucketingResult {
        /**
         * Count within each bucket. Its size is the length of NumericBucketingOption.bucket_bounds plus 1.
         */
        counts?: Schema$BucketizedCount[];
        /**
         * Stores the maximum value of the numeric field. Will be populated only if [NumericBucketingOption.requires_min_max] is set to true.
         */
        maxValue?: number | null;
        /**
         * Stores the minimum value of the numeric field. Will be populated only if [NumericBucketingOption.requires_min_max] is set to true.
         */
        minValue?: number | null;
    }
    /**
     * Represents a postal address, e.g. for postal delivery or payments addresses. Given a postal address, a postal service can deliver items to a premise, P.O. Box or similar. It is not intended to model geographical locations (roads, towns, mountains). In typical usage an address would be created via user input or from importing existing data, depending on the type of process. Advice on address input / editing: - Use an i18n-ready address widget such as https://github.com/google/libaddressinput) - Users should not be presented with UI elements for input or editing of fields outside countries where that field is used. For more guidance on how to use this schema, please see: https://support.google.com/business/answer/6397478
     */
    export interface Schema$PostalAddress {
        /**
         * Unstructured address lines describing the lower levels of an address. Because values in address_lines do not have type information and may sometimes contain multiple values in a single field (e.g. "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country/region of the address. In places where this can vary (e.g. Japan), address_language is used to make it explicit (e.g. "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). This way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a region_code with all remaining information placed in the address_lines. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a region_code and address_lines, and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).
         */
        addressLines?: string[] | null;
        /**
         * Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. Specifically, for Spain this is the province and not the autonomous community (e.g. "Barcelona" and not "Catalonia"). Many countries don't use an administrative area in postal addresses. E.g. in Switzerland this should be left unpopulated.
         */
        administrativeArea?: string | null;
        /**
         * Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".
         */
        languageCode?: string | null;
        /**
         * Optional. Generally refers to the city/town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave locality empty and use address_lines.
         */
        locality?: string | null;
        /**
         * Optional. The name of the organization at the address.
         */
        organization?: string | null;
        /**
         * Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (e.g. state/zip validation in the U.S.A.).
         */
        postalCode?: string | null;
        /**
         * Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.
         */
        recipients?: string[] | null;
        /**
         * Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See http://cldr.unicode.org/ and http://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.
         */
        regionCode?: string | null;
        /**
         * The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.
         */
        revision?: number | null;
        /**
         * Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (e.g. "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (e.g. Côte d'Ivoire).
         */
        sortingCode?: string | null;
        /**
         * Optional. Sublocality of the address. For example, this can be neighborhoods, boroughs, districts.
         */
        sublocality?: string | null;
    }
    /**
     * Input only. Meta information related to the job searcher or entity conducting the job search. This information is used to improve the performance of the service.
     */
    export interface Schema$RequestMetadata {
        /**
         * Optional. The type of device used by the job seeker at the time of the call to the service.
         */
        deviceInfo?: Schema$DeviceInfo;
        /**
         * Required. The client-defined scope or source of the service call, which typically is the domain on which the service has been implemented and is currently being run. For example, if the service is being run by client *Foo, Inc.*, on job board www.foo.com and career site www.bar.com, then this field is set to "foo.com" for use on the job board, and "bar.com" for use on the career site. If this field is not available for some reason, send "UNKNOWN". Note that any improvements to the service model for a particular tenant site rely on this field being set correctly to some domain.
         */
        domain?: string | null;
        /**
         * Required. A unique session identification string. A session is defined as the duration of an end user's interaction with the service over a period. Obfuscate this field for privacy concerns before providing it to the API. If this field is not available for some reason, please send "UNKNOWN". Note that any improvements to the service model for a particular tenant site, rely on this field being set correctly to some unique session_id.
         */
        sessionId?: string | null;
        /**
         * Required. A unique user identification string, as determined by the client. The client is responsible for ensuring client-level uniqueness of this value in order to have the strongest positive impact on search quality. Obfuscate this field for privacy concerns before providing it to the service. If this field is not available for some reason, please send "UNKNOWN". Note that any improvements to the service model for a particular tenant site, rely on this field being set correctly to some unique user_id.
         */
        userId?: string | null;
    }
    /**
     * Output only. Additional information returned to client, such as debugging information.
     */
    export interface Schema$ResponseMetadata {
        /**
         * Identifiers for the versions of the search algorithm used during this API invocation if multiple algorithms are used. The default value is empty. For search response only.
         */
        experimentIdList?: number[] | null;
        /**
         * For search response only. Indicates the mode of a performed search.
         */
        mode?: string | null;
        /**
         * A unique id associated with this call. This id is logged for tracking purposes.
         */
        requestId?: string | null;
    }
    /**
     * Input only. The Request body of the `SearchJobs` call.
     */
    export interface Schema$SearchJobsRequest {
        /**
         * Optional. Controls whether to disable relevance thresholding. Relevance thresholding removes jobs that have low relevance in search results, for example, removing "Assistant to the CEO" positions from the search results of a search for "CEO". Disabling relevance thresholding improves the accuracy of subsequent search requests. Defaults to false.
         */
        disableRelevanceThresholding?: boolean | null;
        /**
         * Optional. Controls whether to broaden the search when it produces sparse results. Broadened queries append results to the end of the matching results list. Defaults to false.
         */
        enableBroadening?: boolean | null;
        /**
         * Optional. Controls if the search job request requires the return of a precise count of the first 300 results. Setting this to `true` ensures consistency in the number of results per page. Best practice is to set this value to true if a client allows users to jump directly to a non-sequential search results page. Enabling this flag may adversely impact performance. Defaults to false.
         */
        enablePreciseResultSize?: boolean | null;
        /**
         * Deprecated. Use query instead. Optional. Restrictions on the scope of the search request, such as filtering by location.
         */
        filters?: Schema$JobFilters;
        /**
         * Optional. Restrictions on what fields to perform histogram on, such as `COMPANY_SIZE` etc.
         */
        histogramFacets?: Schema$HistogramFacets;
        /**
         * Optional. The number of job attributes returned for jobs in the search response. Defaults to JobView.SMALL if no value is specified.
         */
        jobView?: string | null;
        /**
         * Required. Mode of a search.
         */
        mode?: string | null;
        /**
         * Optional. An integer that specifies the current offset (that is, starting result location, amongst the jobs deemed by the API as relevant) in search results. This field is only considered if page_token is unset. For example, 0 means to return results starting from the first matching job, and 10 means to return from the 11th job. This can be used for pagination, (for example, pageSize = 10 and offset = 10 means to return from the second page).
         */
        offset?: number | null;
        /**
         * Deprecated. Use sort_by instead. Optional. The criteria determining how search results are sorted. Defaults to SortBy.RELEVANCE_DESC if no value is specified.
         */
        orderBy?: string | null;
        /**
         * Optional. A limit on the number of jobs returned in the search results. Increasing this value above the default value of 10 can increase search response time. The value can be between 1 and 100.
         */
        pageSize?: number | null;
        /**
         * Optional. The token specifying the current offset within search results. See SearchJobsResponse.next_page_token for an explanation of how to obtain the next set of query results.
         */
        pageToken?: string | null;
        /**
         * Optional. Query used to search against jobs, such as keyword, location filters, etc.
         */
        query?: Schema$JobQuery;
        /**
         * Required. The meta information collected about the job searcher, used to improve the search quality of the service. The identifiers, (such as `user_id`) are provided by users, and must be unique and consistent.
         */
        requestMetadata?: Schema$RequestMetadata;
        /**
         * Optional. The criteria determining how search results are sorted. Defaults to SortBy.RELEVANCE_DESC if no value is specified.
         */
        sortBy?: string | null;
    }
    /**
     * Output only. Response for SearchJob method.
     */
    export interface Schema$SearchJobsResponse {
        /**
         * The commute filter the service applied to the specified query. This information is only available when query has a valid CommutePreference.
         */
        appliedCommuteFilter?: Schema$CommutePreference;
        /**
         * The location filters that the service applied to the specified query. If any filters are lat-lng based, the JobLocation.location_type is JobLocation.LocationType#LOCATION_TYPE_UNSPECIFIED.
         */
        appliedJobLocationFilters?: Schema$JobLocation[];
        /**
         * An estimation of the number of jobs that match the specified query. This number is not guaranteed to be accurate. For accurate results, seenenable_precise_result_size.
         */
        estimatedTotalSize?: string | null;
        /**
         * The histogram results that match specified SearchJobsRequest.HistogramFacets.
         */
        histogramResults?: Schema$HistogramResults;
        /**
         * Corresponds to SearchJobsRequest.job_view.
         */
        jobView?: string | null;
        /**
         * The Job entities that match the specified SearchJobsRequest.
         */
        matchingJobs?: Schema$MatchingJob[];
        /**
         * Additional information for the API invocation, such as the request tracking id.
         */
        metadata?: Schema$ResponseMetadata;
        /**
         * The token that specifies the starting position of the next page of results. This field is empty if there are no more results.
         */
        nextPageToken?: string | null;
        /**
         * If query broadening is enabled, we may append additional results from the broadened query. This number indicates how many of the jobs returned in the jobs field are from the broadened query. These results are always at the end of the jobs list. In particular, a value of 0 means all the jobs in the jobs list are from the original (without broadening) query. If this field is non-zero, subsequent requests with offset after this result set should contain all broadened results.
         */
        numJobsFromBroadenedQuery?: number | null;
        /**
         * The spell checking result, and correction.
         */
        spellResult?: Schema$SpellingCorrection;
        /**
         * The precise result count, which is available only if the client set enable_precise_result_size to `true` or if the response is the last page of results. Otherwise, the value will be `-1`.
         */
        totalSize?: string | null;
    }
    /**
     * Output only. Spell check result.
     */
    export interface Schema$SpellingCorrection {
        /**
         * Indicates if the query was corrected by the spell checker.
         */
        corrected?: boolean | null;
        /**
         * Correction output consisting of the corrected keyword string.
         */
        correctedText?: string | null;
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$Status {
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
    /**
     * Represents array of string values.
     */
    export interface Schema$StringValues {
        /**
         * Required. String values.
         */
        values?: string[] | null;
    }
    /**
     * Input only. Update job request.
     */
    export interface Schema$UpdateJobRequest {
        /**
         * Deprecated. Please use processing_options. This flag is ignored if processing_options is set. Optional. If set to `true`, the service does not attempt resolve a more precise address for the job.
         */
        disableStreetAddressResolution?: boolean | null;
        /**
         * Required. The Job to be updated.
         */
        job?: Schema$Job;
        /**
         * Optional. Options for job processing. UpdateJobRequest.disable_street_address_resolution is ignored if this flag is set.
         */
        processingOptions?: Schema$JobProcessingOptions;
        /**
         * Optional but strongly recommended to be provided for the best service experience. If update_job_fields is provided, only the specified fields in job are updated. Otherwise all the fields are updated. A field mask to restrict the fields that are updated. Valid values are: * jobTitle * employmentTypes * description * applicationUrls * applicationEmailList * applicationInstruction * responsibilities * qualifications * educationLevels * level * department * startDate * endDate * compensationInfo * incentives * languageCode * benefits * expireTime * customAttributes * visibility * publishDate * promotionValue * locations * region * expiryDate (deprecated) * filterableCustomFields (deprecated) * unindexedCustomFields (deprecated)
         */
        updateJobFields?: string | null;
    }
    export class Resource$Companies {
        context: APIRequestContext;
        jobs: Resource$Companies$Jobs;
        constructor(context: APIRequestContext);
        /**
         * Creates a new company entity.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.create({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "careerPageLink": "my_careerPageLink",
         *       //   "companyInfoSources": [],
         *       //   "companySize": "my_companySize",
         *       //   "disableLocationOptimization": false,
         *       //   "displayName": "my_displayName",
         *       //   "distributorBillingCompanyId": "my_distributorBillingCompanyId",
         *       //   "distributorCompanyId": "my_distributorCompanyId",
         *       //   "eeoText": "my_eeoText",
         *       //   "hiringAgency": false,
         *       //   "hqLocation": "my_hqLocation",
         *       //   "imageUrl": "my_imageUrl",
         *       //   "keywordSearchableCustomAttributes": [],
         *       //   "keywordSearchableCustomFields": [],
         *       //   "name": "my_name",
         *       //   "structuredCompanyHqLocation": {},
         *       //   "suspended": false,
         *       //   "title": "my_title",
         *       //   "website": "my_website"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "careerPageLink": "my_careerPageLink",
         *   //   "companyInfoSources": [],
         *   //   "companySize": "my_companySize",
         *   //   "disableLocationOptimization": false,
         *   //   "displayName": "my_displayName",
         *   //   "distributorBillingCompanyId": "my_distributorBillingCompanyId",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "eeoText": "my_eeoText",
         *   //   "hiringAgency": false,
         *   //   "hqLocation": "my_hqLocation",
         *   //   "imageUrl": "my_imageUrl",
         *   //   "keywordSearchableCustomAttributes": [],
         *   //   "keywordSearchableCustomFields": [],
         *   //   "name": "my_name",
         *   //   "structuredCompanyHqLocation": {},
         *   //   "suspended": false,
         *   //   "title": "my_title",
         *   //   "website": "my_website"
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
        create(params: Params$Resource$Companies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Companies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Company>>;
        create(params: Params$Resource$Companies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Companies$Create, options: MethodOptions | BodyResponseCallback<Schema$Company>, callback: BodyResponseCallback<Schema$Company>): void;
        create(params: Params$Resource$Companies$Create, callback: BodyResponseCallback<Schema$Company>): void;
        create(callback: BodyResponseCallback<Schema$Company>): void;
        /**
         * Deletes the specified company.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.delete({
         *     // Required. The resource name of the company to be deleted, such as, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         *     name: 'companies/my-companie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        delete(params: Params$Resource$Companies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Companies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Companies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Companies$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Companies$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the specified company.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.get({
         *     // Required. Resource name of the company to retrieve, such as "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         *     name: 'companies/my-companie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "careerPageLink": "my_careerPageLink",
         *   //   "companyInfoSources": [],
         *   //   "companySize": "my_companySize",
         *   //   "disableLocationOptimization": false,
         *   //   "displayName": "my_displayName",
         *   //   "distributorBillingCompanyId": "my_distributorBillingCompanyId",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "eeoText": "my_eeoText",
         *   //   "hiringAgency": false,
         *   //   "hqLocation": "my_hqLocation",
         *   //   "imageUrl": "my_imageUrl",
         *   //   "keywordSearchableCustomAttributes": [],
         *   //   "keywordSearchableCustomFields": [],
         *   //   "name": "my_name",
         *   //   "structuredCompanyHqLocation": {},
         *   //   "suspended": false,
         *   //   "title": "my_title",
         *   //   "website": "my_website"
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
        get(params: Params$Resource$Companies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Companies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Company>>;
        get(params: Params$Resource$Companies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Companies$Get, options: MethodOptions | BodyResponseCallback<Schema$Company>, callback: BodyResponseCallback<Schema$Company>): void;
        get(params: Params$Resource$Companies$Get, callback: BodyResponseCallback<Schema$Company>): void;
        get(callback: BodyResponseCallback<Schema$Company>): void;
        /**
         * Lists all companies associated with a Cloud Talent Solution account.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.list({
         *     // Optional. Set to true if the companies request must have open jobs. Defaults to false. If true, at most page_size of companies are fetched, among which only those with open jobs are returned.
         *     mustHaveOpenJobs: 'placeholder-value',
         *     // Optional. The maximum number of companies to be returned, at most 100. Default is 100 if a non-positive number is provided.
         *     pageSize: 'placeholder-value',
         *     // Optional. The starting indicator from which to return results.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "companies": [],
         *   //   "metadata": {},
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
        list(params: Params$Resource$Companies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Companies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCompaniesResponse>>;
        list(params: Params$Resource$Companies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Companies$List, options: MethodOptions | BodyResponseCallback<Schema$ListCompaniesResponse>, callback: BodyResponseCallback<Schema$ListCompaniesResponse>): void;
        list(params: Params$Resource$Companies$List, callback: BodyResponseCallback<Schema$ListCompaniesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCompaniesResponse>): void;
        /**
         * Updates the specified company. Company names can't be updated. To update a company name, delete the company and all jobs associated with it, and only then re-create them.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.patch({
         *     // Required during company update. The resource name for a company. This is generated by the service when a company is created, for example, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         *     name: 'companies/my-companie',
         *     // Optional but strongly recommended to be provided for the best service experience. If update_company_fields is provided, only the specified fields in company are updated. Otherwise all the fields are updated. A field mask to specify the company fields to update. Valid values are: * displayName * website * imageUrl * companySize * distributorBillingCompanyId * companyInfoSources * careerPageLink * hiringAgency * hqLocation * eeoText * keywordSearchableCustomAttributes * title (deprecated) * keywordSearchableCustomFields (deprecated)
         *     updateCompanyFields: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "careerPageLink": "my_careerPageLink",
         *       //   "companyInfoSources": [],
         *       //   "companySize": "my_companySize",
         *       //   "disableLocationOptimization": false,
         *       //   "displayName": "my_displayName",
         *       //   "distributorBillingCompanyId": "my_distributorBillingCompanyId",
         *       //   "distributorCompanyId": "my_distributorCompanyId",
         *       //   "eeoText": "my_eeoText",
         *       //   "hiringAgency": false,
         *       //   "hqLocation": "my_hqLocation",
         *       //   "imageUrl": "my_imageUrl",
         *       //   "keywordSearchableCustomAttributes": [],
         *       //   "keywordSearchableCustomFields": [],
         *       //   "name": "my_name",
         *       //   "structuredCompanyHqLocation": {},
         *       //   "suspended": false,
         *       //   "title": "my_title",
         *       //   "website": "my_website"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "careerPageLink": "my_careerPageLink",
         *   //   "companyInfoSources": [],
         *   //   "companySize": "my_companySize",
         *   //   "disableLocationOptimization": false,
         *   //   "displayName": "my_displayName",
         *   //   "distributorBillingCompanyId": "my_distributorBillingCompanyId",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "eeoText": "my_eeoText",
         *   //   "hiringAgency": false,
         *   //   "hqLocation": "my_hqLocation",
         *   //   "imageUrl": "my_imageUrl",
         *   //   "keywordSearchableCustomAttributes": [],
         *   //   "keywordSearchableCustomFields": [],
         *   //   "name": "my_name",
         *   //   "structuredCompanyHqLocation": {},
         *   //   "suspended": false,
         *   //   "title": "my_title",
         *   //   "website": "my_website"
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
        patch(params: Params$Resource$Companies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Companies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Company>>;
        patch(params: Params$Resource$Companies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Companies$Patch, options: MethodOptions | BodyResponseCallback<Schema$Company>, callback: BodyResponseCallback<Schema$Company>): void;
        patch(params: Params$Resource$Companies$Patch, callback: BodyResponseCallback<Schema$Company>): void;
        patch(callback: BodyResponseCallback<Schema$Company>): void;
    }
    export interface Params$Resource$Companies$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$Company;
    }
    export interface Params$Resource$Companies$Delete extends StandardParameters {
        /**
         * Required. The resource name of the company to be deleted, such as, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         */
        name?: string;
    }
    export interface Params$Resource$Companies$Get extends StandardParameters {
        /**
         * Required. Resource name of the company to retrieve, such as "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         */
        name?: string;
    }
    export interface Params$Resource$Companies$List extends StandardParameters {
        /**
         * Optional. Set to true if the companies request must have open jobs. Defaults to false. If true, at most page_size of companies are fetched, among which only those with open jobs are returned.
         */
        mustHaveOpenJobs?: boolean;
        /**
         * Optional. The maximum number of companies to be returned, at most 100. Default is 100 if a non-positive number is provided.
         */
        pageSize?: number;
        /**
         * Optional. The starting indicator from which to return results.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Companies$Patch extends StandardParameters {
        /**
         * Required during company update. The resource name for a company. This is generated by the service when a company is created, for example, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         */
        name?: string;
        /**
         * Optional but strongly recommended to be provided for the best service experience. If update_company_fields is provided, only the specified fields in company are updated. Otherwise all the fields are updated. A field mask to specify the company fields to update. Valid values are: * displayName * website * imageUrl * companySize * distributorBillingCompanyId * companyInfoSources * careerPageLink * hiringAgency * hqLocation * eeoText * keywordSearchableCustomAttributes * title (deprecated) * keywordSearchableCustomFields (deprecated)
         */
        updateCompanyFields?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Company;
    }
    export class Resource$Companies$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deprecated. Use ListJobs instead. Lists all jobs associated with a company.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.companies.jobs.list({
         *     // Required. The resource name of the company that owns the jobs to be listed, such as, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         *     companyName: 'companies/my-companie',
         *     // Optional. If set to `true`, only job ID, job requisition ID and language code will be returned. A typical use is to synchronize job repositories. Defaults to false.
         *     idsOnly: 'placeholder-value',
         *     // Deprecated. Please DO NOT use this field except for small companies. Suggest counting jobs page by page instead. Optional. Set to true if the total number of open jobs is to be returned. Defaults to false.
         *     includeJobsCount: 'placeholder-value',
         *     // Optional. The requisition ID, also known as posting ID, assigned by the company to the job. The maximum number of allowable characters is 225.
         *     jobRequisitionId: 'placeholder-value',
         *     // Optional. The maximum number of jobs to be returned per page of results. If ids_only is set to true, the maximum allowed page size is 1000. Otherwise, the maximum allowed page size is 100. Default is 100 if empty or a number < 1 is specified.
         *     pageSize: 'placeholder-value',
         *     // Optional. The starting point of a query result.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "jobs": [],
         *   //   "metadata": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "totalSize": "my_totalSize"
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
        list(params: Params$Resource$Companies$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Companies$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCompanyJobsResponse>>;
        list(params: Params$Resource$Companies$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Companies$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListCompanyJobsResponse>, callback: BodyResponseCallback<Schema$ListCompanyJobsResponse>): void;
        list(params: Params$Resource$Companies$Jobs$List, callback: BodyResponseCallback<Schema$ListCompanyJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCompanyJobsResponse>): void;
    }
    export interface Params$Resource$Companies$Jobs$List extends StandardParameters {
        /**
         * Required. The resource name of the company that owns the jobs to be listed, such as, "companies/0000aaaa-1111-bbbb-2222-cccc3333dddd".
         */
        companyName?: string;
        /**
         * Optional. If set to `true`, only job ID, job requisition ID and language code will be returned. A typical use is to synchronize job repositories. Defaults to false.
         */
        idsOnly?: boolean;
        /**
         * Deprecated. Please DO NOT use this field except for small companies. Suggest counting jobs page by page instead. Optional. Set to true if the total number of open jobs is to be returned. Defaults to false.
         */
        includeJobsCount?: boolean;
        /**
         * Optional. The requisition ID, also known as posting ID, assigned by the company to the job. The maximum number of allowable characters is 225.
         */
        jobRequisitionId?: string;
        /**
         * Optional. The maximum number of jobs to be returned per page of results. If ids_only is set to true, the maximum allowed page size is 1000. Otherwise, the maximum allowed page size is 100. Default is 100 if empty or a number < 1 is specified.
         */
        pageSize?: number;
        /**
         * Optional. The starting point of a query result.
         */
        pageToken?: string;
    }
    export class Resource$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a list of Job postings by filter.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.batchDelete({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "filter": "my_filter"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        batchDelete(params: Params$Resource$Jobs$Batchdelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchDelete(params?: Params$Resource$Jobs$Batchdelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        batchDelete(params: Params$Resource$Jobs$Batchdelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchDelete(params: Params$Resource$Jobs$Batchdelete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        batchDelete(params: Params$Resource$Jobs$Batchdelete, callback: BodyResponseCallback<Schema$Empty>): void;
        batchDelete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Creates a new job. Typically, the job becomes searchable within 10 seconds, but it may take up to 5 minutes.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.create({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "disableStreetAddressResolution": false,
         *       //   "job": {},
         *       //   "processingOptions": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "applicationEmailList": [],
         *   //   "applicationInstruction": "my_applicationInstruction",
         *   //   "applicationUrls": [],
         *   //   "benefits": [],
         *   //   "companyDisplayName": "my_companyDisplayName",
         *   //   "companyName": "my_companyName",
         *   //   "companyTitle": "my_companyTitle",
         *   //   "compensationInfo": {},
         *   //   "createTime": "my_createTime",
         *   //   "customAttributes": {},
         *   //   "department": "my_department",
         *   //   "description": "my_description",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "educationLevels": [],
         *   //   "employmentTypes": [],
         *   //   "endDate": {},
         *   //   "expireTime": "my_expireTime",
         *   //   "expiryDate": {},
         *   //   "extendedCompensationInfo": {},
         *   //   "filterableCustomFields": {},
         *   //   "incentives": "my_incentives",
         *   //   "jobLocations": [],
         *   //   "jobTitle": "my_jobTitle",
         *   //   "languageCode": "my_languageCode",
         *   //   "level": "my_level",
         *   //   "locations": [],
         *   //   "name": "my_name",
         *   //   "promotionValue": 0,
         *   //   "publishDate": {},
         *   //   "qualifications": "my_qualifications",
         *   //   "referenceUrl": "my_referenceUrl",
         *   //   "region": "my_region",
         *   //   "requisitionId": "my_requisitionId",
         *   //   "responsibilities": "my_responsibilities",
         *   //   "startDate": {},
         *   //   "unindexedCustomFields": {},
         *   //   "updateTime": "my_updateTime",
         *   //   "visibility": "my_visibility"
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
        create(params: Params$Resource$Jobs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Jobs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Jobs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Jobs$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Jobs$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Deletes the specified job. Typically, the job becomes unsearchable within 10 seconds, but it may take up to 5 minutes.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.delete({
         *     // Deprecated. This field is not working anymore. Optional. If set to true, this call waits for all processing steps to complete before the job is cleaned up. Otherwise, the call returns while some steps are still taking place asynchronously, hence faster.
         *     disableFastProcess: 'placeholder-value',
         *     // Required. The resource name of the job to be deleted, such as "jobs/11111111".
         *     name: 'jobs/my-job',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        delete(params: Params$Resource$Jobs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Jobs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Jobs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Jobs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Jobs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deprecated. Use BatchDeleteJobs instead. Deletes the specified job by filter. You can specify whether to synchronously wait for validation, indexing, and general processing to be completed before the response is returned.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.deleteByFilter({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "disableFastProcess": false,
         *       //   "filter": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
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
        deleteByFilter(params: Params$Resource$Jobs$Deletebyfilter, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteByFilter(params?: Params$Resource$Jobs$Deletebyfilter, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        deleteByFilter(params: Params$Resource$Jobs$Deletebyfilter, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteByFilter(params: Params$Resource$Jobs$Deletebyfilter, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteByFilter(params: Params$Resource$Jobs$Deletebyfilter, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteByFilter(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the specified job, whose status is OPEN or recently EXPIRED within the last 90 days.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.get({
         *     // Required. The resource name of the job to retrieve, such as "jobs/11111111".
         *     name: 'jobs/my-job',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "applicationEmailList": [],
         *   //   "applicationInstruction": "my_applicationInstruction",
         *   //   "applicationUrls": [],
         *   //   "benefits": [],
         *   //   "companyDisplayName": "my_companyDisplayName",
         *   //   "companyName": "my_companyName",
         *   //   "companyTitle": "my_companyTitle",
         *   //   "compensationInfo": {},
         *   //   "createTime": "my_createTime",
         *   //   "customAttributes": {},
         *   //   "department": "my_department",
         *   //   "description": "my_description",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "educationLevels": [],
         *   //   "employmentTypes": [],
         *   //   "endDate": {},
         *   //   "expireTime": "my_expireTime",
         *   //   "expiryDate": {},
         *   //   "extendedCompensationInfo": {},
         *   //   "filterableCustomFields": {},
         *   //   "incentives": "my_incentives",
         *   //   "jobLocations": [],
         *   //   "jobTitle": "my_jobTitle",
         *   //   "languageCode": "my_languageCode",
         *   //   "level": "my_level",
         *   //   "locations": [],
         *   //   "name": "my_name",
         *   //   "promotionValue": 0,
         *   //   "publishDate": {},
         *   //   "qualifications": "my_qualifications",
         *   //   "referenceUrl": "my_referenceUrl",
         *   //   "region": "my_region",
         *   //   "requisitionId": "my_requisitionId",
         *   //   "responsibilities": "my_responsibilities",
         *   //   "startDate": {},
         *   //   "unindexedCustomFields": {},
         *   //   "updateTime": "my_updateTime",
         *   //   "visibility": "my_visibility"
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
        get(params: Params$Resource$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Deprecated. Use SearchJobsRequest.histogram_facets instead to make a single call with both search and histogram. Retrieves a histogram for the given GetHistogramRequest. This call provides a structured count of jobs that match against the search query, grouped by specified facets. This call constrains the visibility of jobs present in the database, and only counts jobs the caller has permission to search against. For example, use this call to generate the number of jobs in the U.S. by state.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.histogram({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "allowBroadening": false,
         *       //   "filters": {},
         *       //   "query": {},
         *       //   "requestMetadata": {},
         *       //   "searchTypes": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "metadata": {},
         *   //   "results": []
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
        histogram(params: Params$Resource$Jobs$Histogram, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        histogram(params?: Params$Resource$Jobs$Histogram, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetHistogramResponse>>;
        histogram(params: Params$Resource$Jobs$Histogram, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        histogram(params: Params$Resource$Jobs$Histogram, options: MethodOptions | BodyResponseCallback<Schema$GetHistogramResponse>, callback: BodyResponseCallback<Schema$GetHistogramResponse>): void;
        histogram(params: Params$Resource$Jobs$Histogram, callback: BodyResponseCallback<Schema$GetHistogramResponse>): void;
        histogram(callback: BodyResponseCallback<Schema$GetHistogramResponse>): void;
        /**
         * Lists jobs by filter.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.list({
         *     // Required. The filter string specifies the jobs to be enumerated. Supported operator: =, AND The fields eligible for filtering are: * `companyName` (Required) * `requisitionId` (Optional) Sample Query: * companyName = "companies/123" * companyName = "companies/123" AND requisitionId = "req-1"
         *     filter: 'placeholder-value',
         *     // Optional. If set to `true`, only Job.name, Job.requisition_id and Job.language_code will be returned. A typical use case is to synchronize job repositories. Defaults to false.
         *     idsOnly: 'placeholder-value',
         *     // Optional. The maximum number of jobs to be returned per page of results. If ids_only is set to true, the maximum allowed page size is 1000. Otherwise, the maximum allowed page size is 100. Default is 100 if empty or a number < 1 is specified.
         *     pageSize: 'placeholder-value',
         *     // Optional. The starting point of a query result.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "jobs": [],
         *   //   "metadata": {},
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
        list(params: Params$Resource$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        /**
         * Updates specified job. Typically, updated contents become visible in search results within 10 seconds, but it may take up to 5 minutes.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.patch({
         *     // Required during job update. Resource name assigned to a job by the API, for example, "/jobs/foo". Use of this field in job queries and API calls is preferred over the use of requisition_id since this value is unique.
         *     name: 'jobs/my-job',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "disableStreetAddressResolution": false,
         *       //   "job": {},
         *       //   "processingOptions": {},
         *       //   "updateJobFields": "my_updateJobFields"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "applicationEmailList": [],
         *   //   "applicationInstruction": "my_applicationInstruction",
         *   //   "applicationUrls": [],
         *   //   "benefits": [],
         *   //   "companyDisplayName": "my_companyDisplayName",
         *   //   "companyName": "my_companyName",
         *   //   "companyTitle": "my_companyTitle",
         *   //   "compensationInfo": {},
         *   //   "createTime": "my_createTime",
         *   //   "customAttributes": {},
         *   //   "department": "my_department",
         *   //   "description": "my_description",
         *   //   "distributorCompanyId": "my_distributorCompanyId",
         *   //   "educationLevels": [],
         *   //   "employmentTypes": [],
         *   //   "endDate": {},
         *   //   "expireTime": "my_expireTime",
         *   //   "expiryDate": {},
         *   //   "extendedCompensationInfo": {},
         *   //   "filterableCustomFields": {},
         *   //   "incentives": "my_incentives",
         *   //   "jobLocations": [],
         *   //   "jobTitle": "my_jobTitle",
         *   //   "languageCode": "my_languageCode",
         *   //   "level": "my_level",
         *   //   "locations": [],
         *   //   "name": "my_name",
         *   //   "promotionValue": 0,
         *   //   "publishDate": {},
         *   //   "qualifications": "my_qualifications",
         *   //   "referenceUrl": "my_referenceUrl",
         *   //   "region": "my_region",
         *   //   "requisitionId": "my_requisitionId",
         *   //   "responsibilities": "my_responsibilities",
         *   //   "startDate": {},
         *   //   "unindexedCustomFields": {},
         *   //   "updateTime": "my_updateTime",
         *   //   "visibility": "my_visibility"
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
        patch(params: Params$Resource$Jobs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Jobs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        patch(params: Params$Resource$Jobs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Jobs$Patch, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        patch(params: Params$Resource$Jobs$Patch, callback: BodyResponseCallback<Schema$Job>): void;
        patch(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Searches for jobs using the provided SearchJobsRequest. This call constrains the visibility of jobs present in the database, and only returns jobs that the caller has permission to search against.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.search({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "disableRelevanceThresholding": false,
         *       //   "enableBroadening": false,
         *       //   "enablePreciseResultSize": false,
         *       //   "filters": {},
         *       //   "histogramFacets": {},
         *       //   "jobView": "my_jobView",
         *       //   "mode": "my_mode",
         *       //   "offset": 0,
         *       //   "orderBy": "my_orderBy",
         *       //   "pageSize": 0,
         *       //   "pageToken": "my_pageToken",
         *       //   "query": {},
         *       //   "requestMetadata": {},
         *       //   "sortBy": "my_sortBy"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "appliedCommuteFilter": {},
         *   //   "appliedJobLocationFilters": [],
         *   //   "estimatedTotalSize": "my_estimatedTotalSize",
         *   //   "histogramResults": {},
         *   //   "jobView": "my_jobView",
         *   //   "matchingJobs": [],
         *   //   "metadata": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "numJobsFromBroadenedQuery": 0,
         *   //   "spellResult": {},
         *   //   "totalSize": "my_totalSize"
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
        search(params: Params$Resource$Jobs$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Jobs$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchJobsResponse>>;
        search(params: Params$Resource$Jobs$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Jobs$Search, options: MethodOptions | BodyResponseCallback<Schema$SearchJobsResponse>, callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
        search(params: Params$Resource$Jobs$Search, callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
        search(callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
        /**
         * Searches for jobs using the provided SearchJobsRequest. This API call is intended for the use case of targeting passive job seekers (for example, job seekers who have signed up to receive email alerts about potential job opportunities), and has different algorithmic adjustments that are targeted to passive job seekers. This call constrains the visibility of jobs present in the database, and only returns jobs the caller has permission to search against.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.jobs.searchForAlert({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "disableRelevanceThresholding": false,
         *       //   "enableBroadening": false,
         *       //   "enablePreciseResultSize": false,
         *       //   "filters": {},
         *       //   "histogramFacets": {},
         *       //   "jobView": "my_jobView",
         *       //   "mode": "my_mode",
         *       //   "offset": 0,
         *       //   "orderBy": "my_orderBy",
         *       //   "pageSize": 0,
         *       //   "pageToken": "my_pageToken",
         *       //   "query": {},
         *       //   "requestMetadata": {},
         *       //   "sortBy": "my_sortBy"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "appliedCommuteFilter": {},
         *   //   "appliedJobLocationFilters": [],
         *   //   "estimatedTotalSize": "my_estimatedTotalSize",
         *   //   "histogramResults": {},
         *   //   "jobView": "my_jobView",
         *   //   "matchingJobs": [],
         *   //   "metadata": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "numJobsFromBroadenedQuery": 0,
         *   //   "spellResult": {},
         *   //   "totalSize": "my_totalSize"
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
        searchForAlert(params: Params$Resource$Jobs$Searchforalert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchForAlert(params?: Params$Resource$Jobs$Searchforalert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchJobsResponse>>;
        searchForAlert(params: Params$Resource$Jobs$Searchforalert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchForAlert(params: Params$Resource$Jobs$Searchforalert, options: MethodOptions | BodyResponseCallback<Schema$SearchJobsResponse>, callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
        searchForAlert(params: Params$Resource$Jobs$Searchforalert, callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
        searchForAlert(callback: BodyResponseCallback<Schema$SearchJobsResponse>): void;
    }
    export interface Params$Resource$Jobs$Batchdelete extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$BatchDeleteJobsRequest;
    }
    export interface Params$Resource$Jobs$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateJobRequest;
    }
    export interface Params$Resource$Jobs$Delete extends StandardParameters {
        /**
         * Deprecated. This field is not working anymore. Optional. If set to true, this call waits for all processing steps to complete before the job is cleaned up. Otherwise, the call returns while some steps are still taking place asynchronously, hence faster.
         */
        disableFastProcess?: boolean;
        /**
         * Required. The resource name of the job to be deleted, such as "jobs/11111111".
         */
        name?: string;
    }
    export interface Params$Resource$Jobs$Deletebyfilter extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeleteJobsByFilterRequest;
    }
    export interface Params$Resource$Jobs$Get extends StandardParameters {
        /**
         * Required. The resource name of the job to retrieve, such as "jobs/11111111".
         */
        name?: string;
    }
    export interface Params$Resource$Jobs$Histogram extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetHistogramRequest;
    }
    export interface Params$Resource$Jobs$List extends StandardParameters {
        /**
         * Required. The filter string specifies the jobs to be enumerated. Supported operator: =, AND The fields eligible for filtering are: * `companyName` (Required) * `requisitionId` (Optional) Sample Query: * companyName = "companies/123" * companyName = "companies/123" AND requisitionId = "req-1"
         */
        filter?: string;
        /**
         * Optional. If set to `true`, only Job.name, Job.requisition_id and Job.language_code will be returned. A typical use case is to synchronize job repositories. Defaults to false.
         */
        idsOnly?: boolean;
        /**
         * Optional. The maximum number of jobs to be returned per page of results. If ids_only is set to true, the maximum allowed page size is 1000. Otherwise, the maximum allowed page size is 100. Default is 100 if empty or a number < 1 is specified.
         */
        pageSize?: number;
        /**
         * Optional. The starting point of a query result.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Jobs$Patch extends StandardParameters {
        /**
         * Required during job update. Resource name assigned to a job by the API, for example, "/jobs/foo". Use of this field in job queries and API calls is preferred over the use of requisition_id since this value is unique.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateJobRequest;
    }
    export interface Params$Resource$Jobs$Search extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchJobsRequest;
    }
    export interface Params$Resource$Jobs$Searchforalert extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchJobsRequest;
    }
    export class Resource$V2 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Completes the specified prefix with job keyword suggestions. Intended for use by a job search auto-complete search box.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/jobs.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const jobs = google.jobs('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/jobs',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await jobs.complete({
         *     // Optional. If provided, restricts completion to the specified company.
         *     companyName: 'placeholder-value',
         *     // Required. The language of the query. This is the BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47). For CompletionType.JOB_TITLE type, only open jobs with same language_code are returned. For CompletionType.COMPANY_NAME type, only companies having open jobs with same language_code are returned. For CompletionType.COMBINED type, only open jobs with same language_code or companies having open jobs with same language_code are returned.
         *     languageCode: 'placeholder-value',
         *     // Required. Completion result count. The maximum allowed page size is 10.
         *     pageSize: 'placeholder-value',
         *     // Required. The query used to generate suggestions.
         *     query: 'placeholder-value',
         *     // Optional. The scope of the completion. The defaults is CompletionScope.PUBLIC.
         *     scope: 'placeholder-value',
         *     // Optional. The completion topic. The default is CompletionType.COMBINED.
         *     type: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "completionResults": [],
         *   //   "metadata": {}
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
        complete(params: Params$Resource$V2$Complete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        complete(params?: Params$Resource$V2$Complete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CompleteQueryResponse>>;
        complete(params: Params$Resource$V2$Complete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        complete(params: Params$Resource$V2$Complete, options: MethodOptions | BodyResponseCallback<Schema$CompleteQueryResponse>, callback: BodyResponseCallback<Schema$CompleteQueryResponse>): void;
        complete(params: Params$Resource$V2$Complete, callback: BodyResponseCallback<Schema$CompleteQueryResponse>): void;
        complete(callback: BodyResponseCallback<Schema$CompleteQueryResponse>): void;
    }
    export interface Params$Resource$V2$Complete extends StandardParameters {
        /**
         * Optional. If provided, restricts completion to the specified company.
         */
        companyName?: string;
        /**
         * Required. The language of the query. This is the BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see [Tags for Identifying Languages](https://tools.ietf.org/html/bcp47). For CompletionType.JOB_TITLE type, only open jobs with same language_code are returned. For CompletionType.COMPANY_NAME type, only companies having open jobs with same language_code are returned. For CompletionType.COMBINED type, only open jobs with same language_code or companies having open jobs with same language_code are returned.
         */
        languageCode?: string;
        /**
         * Required. Completion result count. The maximum allowed page size is 10.
         */
        pageSize?: number;
        /**
         * Required. The query used to generate suggestions.
         */
        query?: string;
        /**
         * Optional. The scope of the completion. The defaults is CompletionScope.PUBLIC.
         */
        scope?: string;
        /**
         * Optional. The completion topic. The default is CompletionType.COMBINED.
         */
        type?: string;
    }
    export {};
}
