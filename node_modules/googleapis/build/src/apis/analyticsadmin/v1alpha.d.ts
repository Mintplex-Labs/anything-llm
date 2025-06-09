import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace analyticsadmin_v1alpha {
    export interface Options extends GlobalOptions {
        version: 'v1alpha';
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
     * Google Analytics Admin API
     *
     * Manage properties in Google Analytics. Warning: Creating multiple Customer Applications, Accounts, or Projects to simulate or act as a single Customer Application, Account, or Project (respectively) or to circumvent Service-specific usage limits or quotas is a direct violation of Google Cloud Platform Terms of Service as well as Google APIs Terms of Service. These actions can result in immediate termination of your GCP project(s) without any warning.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const analyticsadmin = google.analyticsadmin('v1alpha');
     * ```
     */
    export class Analyticsadmin {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        accountSummaries: Resource$Accountsummaries;
        properties: Resource$Properties;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * To express that the result needs to be between two numbers (inclusive).
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessBetweenFilter {
        /**
         * Begins with this number.
         */
        fromValue?: Schema$GoogleAnalyticsAdminV1alphaNumericValue;
        /**
         * Ends with this number.
         */
        toValue?: Schema$GoogleAnalyticsAdminV1alphaNumericValue;
    }
    /**
     * A binding of a user to a set of roles.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessBinding {
        /**
         * Output only. Resource name of this binding. Format: accounts/{account\}/accessBindings/{access_binding\} or properties/{property\}/accessBindings/{access_binding\} Example: "accounts/100/accessBindings/200"
         */
        name?: string | null;
        /**
         * A list of roles for to grant to the parent resource. Valid values: predefinedRoles/viewer predefinedRoles/analyst predefinedRoles/editor predefinedRoles/admin predefinedRoles/no-cost-data predefinedRoles/no-revenue-data For users, if an empty list of roles is set, this AccessBinding will be deleted.
         */
        roles?: string[] | null;
        /**
         * If set, the email address of the user to set roles for. Format: "someuser@gmail.com"
         */
        user?: string | null;
    }
    /**
     * A contiguous range of days: startDate, startDate + 1, ..., endDate.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessDateRange {
        /**
         * The inclusive end date for the query in the format `YYYY-MM-DD`. Cannot be before `startDate`. The format `NdaysAgo`, `yesterday`, or `today` is also accepted, and in that case, the date is inferred based on the current time in the request's time zone.
         */
        endDate?: string | null;
        /**
         * The inclusive start date for the query in the format `YYYY-MM-DD`. Cannot be after `endDate`. The format `NdaysAgo`, `yesterday`, or `today` is also accepted, and in that case, the date is inferred based on the current time in the request's time zone.
         */
        startDate?: string | null;
    }
    /**
     * Dimensions are attributes of your data. For example, the dimension `userEmail` indicates the email of the user that accessed reporting data. Dimension values in report responses are strings.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessDimension {
        /**
         * The API name of the dimension. See [Data Access Schema](https://developers.google.com/analytics/devguides/config/admin/v1/access-api-schema) for the list of dimensions supported in this API. Dimensions are referenced by name in `dimensionFilter` and `orderBys`.
         */
        dimensionName?: string | null;
    }
    /**
     * Describes a dimension column in the report. Dimensions requested in a report produce column entries within rows and DimensionHeaders. However, dimensions used exclusively within filters or expressions do not produce columns in a report; correspondingly, those dimensions do not produce headers.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessDimensionHeader {
        /**
         * The dimension's name; for example 'userEmail'.
         */
        dimensionName?: string | null;
    }
    /**
     * The value of a dimension.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessDimensionValue {
        /**
         * The dimension value. For example, this value may be 'France' for the 'country' dimension.
         */
        value?: string | null;
    }
    /**
     * An expression to filter dimension or metric values.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessFilter {
        /**
         * A filter for two values.
         */
        betweenFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessBetweenFilter;
        /**
         * The dimension name or metric name.
         */
        fieldName?: string | null;
        /**
         * A filter for in list values.
         */
        inListFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessInListFilter;
        /**
         * A filter for numeric or date values.
         */
        numericFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessNumericFilter;
        /**
         * Strings related filter.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessStringFilter;
    }
    /**
     * Expresses dimension or metric filters. The fields in the same expression need to be either all dimensions or all metrics.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpression {
        /**
         * A primitive filter. In the same FilterExpression, all of the filter's field names need to be either all dimensions or all metrics.
         */
        accessFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessFilter;
        /**
         * Each of the FilterExpressions in the and_group has an AND relationship.
         */
        andGroup?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpressionList;
        /**
         * The FilterExpression is NOT of not_expression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpression;
        /**
         * Each of the FilterExpressions in the or_group has an OR relationship.
         */
        orGroup?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpressionList;
    }
    /**
     * A list of filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpressionList {
        /**
         * A list of filter expressions.
         */
        expressions?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpression[];
    }
    /**
     * The result needs to be in a list of string values.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessInListFilter {
        /**
         * If true, the string value is case sensitive.
         */
        caseSensitive?: boolean | null;
        /**
         * The list of string values. Must be non-empty.
         */
        values?: string[] | null;
    }
    /**
     * The quantitative measurements of a report. For example, the metric `accessCount` is the total number of data access records.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessMetric {
        /**
         * The API name of the metric. See [Data Access Schema](https://developers.google.com/analytics/devguides/config/admin/v1/access-api-schema) for the list of metrics supported in this API. Metrics are referenced by name in `metricFilter` & `orderBys`.
         */
        metricName?: string | null;
    }
    /**
     * Describes a metric column in the report. Visible metrics requested in a report produce column entries within rows and MetricHeaders. However, metrics used exclusively within filters or expressions do not produce columns in a report; correspondingly, those metrics do not produce headers.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessMetricHeader {
        /**
         * The metric's name; for example 'accessCount'.
         */
        metricName?: string | null;
    }
    /**
     * The value of a metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessMetricValue {
        /**
         * The measurement value. For example, this value may be '13'.
         */
        value?: string | null;
    }
    /**
     * Filters for numeric or date values.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessNumericFilter {
        /**
         * The operation type for this filter.
         */
        operation?: string | null;
        /**
         * A numeric value or a date value.
         */
        value?: Schema$GoogleAnalyticsAdminV1alphaNumericValue;
    }
    /**
     * Order bys define how rows will be sorted in the response. For example, ordering rows by descending access count is one ordering, and ordering rows by the country string is a different ordering.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessOrderBy {
        /**
         * If true, sorts by descending order. If false or unspecified, sorts in ascending order.
         */
        desc?: boolean | null;
        /**
         * Sorts results by a dimension's values.
         */
        dimension?: Schema$GoogleAnalyticsAdminV1alphaAccessOrderByDimensionOrderBy;
        /**
         * Sorts results by a metric's values.
         */
        metric?: Schema$GoogleAnalyticsAdminV1alphaAccessOrderByMetricOrderBy;
    }
    /**
     * Sorts by dimension values.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessOrderByDimensionOrderBy {
        /**
         * A dimension name in the request to order by.
         */
        dimensionName?: string | null;
        /**
         * Controls the rule for dimension value ordering.
         */
        orderType?: string | null;
    }
    /**
     * Sorts by metric values.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessOrderByMetricOrderBy {
        /**
         * A metric name in the request to order by.
         */
        metricName?: string | null;
    }
    /**
     * Current state of all quotas for this Analytics property. If any quota for a property is exhausted, all requests to that property will return Resource Exhausted errors.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessQuota {
        /**
         * Properties can use up to 50 concurrent requests.
         */
        concurrentRequests?: Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus;
        /**
         * Properties and cloud project pairs can have up to 50 server errors per hour.
         */
        serverErrorsPerProjectPerHour?: Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus;
        /**
         * Properties can use 250,000 tokens per day. Most requests consume fewer than 10 tokens.
         */
        tokensPerDay?: Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus;
        /**
         * Properties can use 50,000 tokens per hour. An API request consumes a single number of tokens, and that number is deducted from all of the hourly, daily, and per project hourly quotas.
         */
        tokensPerHour?: Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus;
        /**
         * Properties can use up to 25% of their tokens per project per hour. This amounts to Analytics 360 Properties can use 12,500 tokens per project per hour. An API request consumes a single number of tokens, and that number is deducted from all of the hourly, daily, and per project hourly quotas.
         */
        tokensPerProjectPerHour?: Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus;
    }
    /**
     * Current state for a particular quota group.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessQuotaStatus {
        /**
         * Quota consumed by this request.
         */
        consumed?: number | null;
        /**
         * Quota remaining after this request.
         */
        remaining?: number | null;
    }
    /**
     * Access report data for each row.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessRow {
        /**
         * List of dimension values. These values are in the same order as specified in the request.
         */
        dimensionValues?: Schema$GoogleAnalyticsAdminV1alphaAccessDimensionValue[];
        /**
         * List of metric values. These values are in the same order as specified in the request.
         */
        metricValues?: Schema$GoogleAnalyticsAdminV1alphaAccessMetricValue[];
    }
    /**
     * The filter for strings.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccessStringFilter {
        /**
         * If true, the string value is case sensitive.
         */
        caseSensitive?: boolean | null;
        /**
         * The match type for this filter.
         */
        matchType?: string | null;
        /**
         * The string value used for the matching.
         */
        value?: string | null;
    }
    /**
     * A resource message representing a Google Analytics account.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccount {
        /**
         * Output only. Time when this account was originally created.
         */
        createTime?: string | null;
        /**
         * Output only. Indicates whether this Account is soft-deleted or not. Deleted accounts are excluded from List results unless specifically requested.
         */
        deleted?: boolean | null;
        /**
         * Required. Human-readable display name for this account.
         */
        displayName?: string | null;
        /**
         * Output only. The URI for a Google Marketing Platform organization resource. Only set when this account is connected to a GMP organization. Format: marketingplatformadmin.googleapis.com/organizations/{org_id\}
         */
        gmpOrganization?: string | null;
        /**
         * Output only. Resource name of this account. Format: accounts/{account\} Example: "accounts/100"
         */
        name?: string | null;
        /**
         * Country of business. Must be a Unicode CLDR region code.
         */
        regionCode?: string | null;
        /**
         * Output only. Time when account payload fields were last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A virtual resource representing an overview of an account and all its child Google Analytics properties.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAccountSummary {
        /**
         * Resource name of account referred to by this account summary Format: accounts/{account_id\} Example: "accounts/1000"
         */
        account?: string | null;
        /**
         * Display name for the account referred to in this account summary.
         */
        displayName?: string | null;
        /**
         * Resource name for this account summary. Format: accountSummaries/{account_id\} Example: "accountSummaries/1000"
         */
        name?: string | null;
        /**
         * List of summaries for child accounts of this account.
         */
        propertySummaries?: Schema$GoogleAnalyticsAdminV1alphaPropertySummary[];
    }
    /**
     * Request message for AcknowledgeUserDataCollection RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionRequest {
        /**
         * Required. An acknowledgement that the caller of this method understands the terms of user data collection. This field must contain the exact value: "I acknowledge that I have the necessary privacy disclosures and rights from my end users for the collection and processing of their data, including the association of such data with the visitation information Google Analytics collects from my site and/or app property."
         */
        acknowledgement?: string | null;
    }
    /**
     * Response message for AcknowledgeUserDataCollection RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse {
    }
    /**
     * A link between a Google Analytics property and an AdSense for Content ad client.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAdSenseLink {
        /**
         * Immutable. The AdSense ad client code that the Google Analytics property is linked to. Example format: "ca-pub-1234567890"
         */
        adClientCode?: string | null;
        /**
         * Output only. The resource name for this AdSense Link resource. Format: properties/{propertyId\}/adSenseLinks/{linkId\} Example: properties/1234/adSenseLinks/6789
         */
        name?: string | null;
    }
    /**
     * Request message for ApproveDisplayVideo360AdvertiserLinkProposal RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalRequest {
    }
    /**
     * Response message for ApproveDisplayVideo360AdvertiserLinkProposal RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse {
        /**
         * The DisplayVideo360AdvertiserLink created as a result of approving the proposal.
         */
        displayVideo360AdvertiserLink?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink;
    }
    /**
     * Request message for ArchiveAudience RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaArchiveAudienceRequest {
    }
    /**
     * Request message for ArchiveCustomDimension RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaArchiveCustomDimensionRequest {
    }
    /**
     * Request message for ArchiveCustomMetric RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaArchiveCustomMetricRequest {
    }
    /**
     * The attribution settings used for a given property. This is a singleton resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAttributionSettings {
        /**
         * Required. The lookback window configuration for acquisition conversion events. The default window size is 30 days.
         */
        acquisitionConversionEventLookbackWindow?: string | null;
        /**
         * Required. The Conversion Export Scope for data exported to linked Ads Accounts.
         */
        adsWebConversionDataExportScope?: string | null;
        /**
         * Output only. Resource name of this attribution settings resource. Format: properties/{property_id\}/attributionSettings Example: "properties/1000/attributionSettings"
         */
        name?: string | null;
        /**
         * Required. The lookback window for all other, non-acquisition conversion events. The default window size is 90 days.
         */
        otherConversionEventLookbackWindow?: string | null;
        /**
         * Required. The reporting attribution model used to calculate conversion credit in this property's reports. Changing the attribution model will apply to both historical and future data. These changes will be reflected in reports with conversion and revenue data. User and session data will be unaffected.
         */
        reportingAttributionModel?: string | null;
    }
    /**
     * A resource message representing an Audience.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudience {
        /**
         * Output only. It is automatically set by GA to false if this is an NPA Audience and is excluded from ads personalization.
         */
        adsPersonalizationEnabled?: boolean | null;
        /**
         * Output only. Time when the Audience was created.
         */
        createTime?: string | null;
        /**
         * Required. The description of the Audience.
         */
        description?: string | null;
        /**
         * Required. The display name of the Audience.
         */
        displayName?: string | null;
        /**
         * Optional. Specifies an event to log when a user joins the Audience. If not set, no event is logged when a user joins the Audience.
         */
        eventTrigger?: Schema$GoogleAnalyticsAdminV1alphaAudienceEventTrigger;
        /**
         * Immutable. Specifies how long an exclusion lasts for users that meet the exclusion filter. It is applied to all EXCLUDE filter clauses and is ignored when there is no EXCLUDE filter clause in the Audience.
         */
        exclusionDurationMode?: string | null;
        /**
         * Required. Immutable. Unordered list. Filter clauses that define the Audience. All clauses will be AND’ed together.
         */
        filterClauses?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterClause[];
        /**
         * Required. Immutable. The duration a user should stay in an Audience. It cannot be set to more than 540 days.
         */
        membershipDurationDays?: number | null;
        /**
         * Output only. The resource name for this Audience resource. Format: properties/{propertyId\}/audiences/{audienceId\}
         */
        name?: string | null;
    }
    /**
     * A specific filter for a single dimension or metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilter {
        /**
         * Optional. Indicates whether this filter needs dynamic evaluation or not. If set to true, users join the Audience if they ever met the condition (static evaluation). If unset or set to false, user evaluation for an Audience is dynamic; users are added to an Audience when they meet the conditions and then removed when they no longer meet them. This can only be set when Audience scope is ACROSS_ALL_SESSIONS.
         */
        atAnyPointInTime?: boolean | null;
        /**
         * A filter for numeric or date values between certain values on a dimension or metric.
         */
        betweenFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterBetweenFilter;
        /**
         * Required. Immutable. The dimension name or metric name to filter. If the field name refers to a custom dimension or metric, a scope prefix will be added to the front of the custom dimensions or metric name. For more on scope prefixes or custom dimensions/metrics, reference the [Google Analytics Data API documentation] (https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#custom_dimensions).
         */
        fieldName?: string | null;
        /**
         * Optional. If set, specifies the time window for which to evaluate data in number of days. If not set, then audience data is evaluated against lifetime data (For example, infinite time window). For example, if set to 1 day, only the current day's data is evaluated. The reference point is the current day when at_any_point_in_time is unset or false. It can only be set when Audience scope is ACROSS_ALL_SESSIONS and cannot be greater than 60 days.
         */
        inAnyNDayPeriod?: number | null;
        /**
         * A filter for a string dimension that matches a particular list of options.
         */
        inListFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterInListFilter;
        /**
         * A filter for numeric or date values on a dimension or metric.
         */
        numericFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericFilter;
        /**
         * A filter for a string-type dimension that matches a particular pattern.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterStringFilter;
    }
    /**
     * A filter for numeric or date values between certain values on a dimension or metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterBetweenFilter {
        /**
         * Required. Begins with this number, inclusive.
         */
        fromValue?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericValue;
        /**
         * Required. Ends with this number, inclusive.
         */
        toValue?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericValue;
    }
    /**
     * A filter for a string dimension that matches a particular list of options.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterInListFilter {
        /**
         * Optional. If true, the match is case-sensitive. If false, the match is case-insensitive.
         */
        caseSensitive?: boolean | null;
        /**
         * Required. The list of possible string values to match against. Must be non-empty.
         */
        values?: string[] | null;
    }
    /**
     * A filter for numeric or date values on a dimension or metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericFilter {
        /**
         * Required. The operation applied to a numeric filter.
         */
        operation?: string | null;
        /**
         * Required. The numeric or date value to match against.
         */
        value?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericValue;
    }
    /**
     * To represent a number.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterNumericValue {
        /**
         * Double value.
         */
        doubleValue?: number | null;
        /**
         * Integer value.
         */
        int64Value?: string | null;
    }
    /**
     * A filter for a string-type dimension that matches a particular pattern.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilterStringFilter {
        /**
         * Optional. If true, the match is case-sensitive. If false, the match is case-insensitive.
         */
        caseSensitive?: boolean | null;
        /**
         * Required. The match type for the string filter.
         */
        matchType?: string | null;
        /**
         * Required. The string value to be matched against.
         */
        value?: string | null;
    }
    /**
     * A filter that matches events of a single event name. If an event parameter is specified, only the subset of events that match both the single event name and the parameter filter expressions match this event filter.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceEventFilter {
        /**
         * Required. Immutable. The name of the event to match against.
         */
        eventName?: string | null;
        /**
         * Optional. If specified, this filter matches events that match both the single event name and the parameter filter expressions. AudienceEventFilter inside the parameter filter expression cannot be set (For example, nested event filters are not supported). This should be a single and_group of dimension_or_metric_filter or not_expression; ANDs of ORs are not supported. Also, if it includes a filter for "eventCount", only that one will be considered; all the other filters will be ignored.
         */
        eventParameterFilterExpression?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression;
    }
    /**
     * Specifies an event to log when a user joins the Audience.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceEventTrigger {
        /**
         * Required. The event name that will be logged.
         */
        eventName?: string | null;
        /**
         * Required. When to log the event.
         */
        logCondition?: string | null;
    }
    /**
     * A clause for defining either a simple or sequence filter. A filter can be inclusive (For example, users satisfying the filter clause are included in the Audience) or exclusive (For example, users satisfying the filter clause are excluded from the Audience).
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceFilterClause {
        /**
         * Required. Specifies whether this is an include or exclude filter clause.
         */
        clauseType?: string | null;
        /**
         * Filters that must occur in a specific order for the user to be a member of the Audience.
         */
        sequenceFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceSequenceFilter;
        /**
         * A simple filter that a user must satisfy to be a member of the Audience.
         */
        simpleFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceSimpleFilter;
    }
    /**
     * A logical expression of Audience dimension, metric, or event filters.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression {
        /**
         * A list of expressions to be AND’ed together. It can only contain AudienceFilterExpressions with or_group. This must be set for the top level AudienceFilterExpression.
         */
        andGroup?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpressionList;
        /**
         * A filter on a single dimension or metric. This cannot be set on the top level AudienceFilterExpression.
         */
        dimensionOrMetricFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceDimensionOrMetricFilter;
        /**
         * Creates a filter that matches a specific event. This cannot be set on the top level AudienceFilterExpression.
         */
        eventFilter?: Schema$GoogleAnalyticsAdminV1alphaAudienceEventFilter;
        /**
         * A filter expression to be NOT'ed (For example, inverted, complemented). It can only include a dimension_or_metric_filter. This cannot be set on the top level AudienceFilterExpression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression;
        /**
         * A list of expressions to OR’ed together. It cannot contain AudienceFilterExpressions with and_group or or_group.
         */
        orGroup?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpressionList;
    }
    /**
     * A list of Audience filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpressionList {
        /**
         * A list of Audience filter expressions.
         */
        filterExpressions?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression[];
    }
    /**
     * Defines filters that must occur in a specific order for the user to be a member of the Audience.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceSequenceFilter {
        /**
         * Required. Immutable. Specifies the scope for this filter.
         */
        scope?: string | null;
        /**
         * Optional. Defines the time period in which the whole sequence must occur.
         */
        sequenceMaximumDuration?: string | null;
        /**
         * Required. An ordered sequence of steps. A user must complete each step in order to join the sequence filter.
         */
        sequenceSteps?: Schema$GoogleAnalyticsAdminV1alphaAudienceSequenceFilterAudienceSequenceStep[];
    }
    /**
     * A condition that must occur in the specified step order for this user to match the sequence.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceSequenceFilterAudienceSequenceStep {
        /**
         * Optional. When set, this step must be satisfied within the constraint_duration of the previous step (For example, t[i] - t[i-1] <= constraint_duration). If not set, there is no duration requirement (the duration is effectively unlimited). It is ignored for the first step.
         */
        constraintDuration?: string | null;
        /**
         * Required. Immutable. A logical expression of Audience dimension, metric, or event filters in each step.
         */
        filterExpression?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression;
        /**
         * Optional. If true, the event satisfying this step must be the very next event after the event satisfying the last step. If unset or false, this step indirectly follows the prior step; for example, there may be events between the prior step and this step. It is ignored for the first step.
         */
        immediatelyFollows?: boolean | null;
        /**
         * Required. Immutable. Specifies the scope for this step.
         */
        scope?: string | null;
    }
    /**
     * Defines a simple filter that a user must satisfy to be a member of the Audience.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaAudienceSimpleFilter {
        /**
         * Required. Immutable. A logical expression of Audience dimension, metric, or event filters.
         */
        filterExpression?: Schema$GoogleAnalyticsAdminV1alphaAudienceFilterExpression;
        /**
         * Required. Immutable. Specifies the scope for this filter.
         */
        scope?: string | null;
    }
    /**
     * Request message for BatchCreateAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsRequest {
        /**
         * Required. The requests specifying the access bindings to create. A maximum of 1000 access bindings can be created in a batch.
         */
        requests?: Schema$GoogleAnalyticsAdminV1alphaCreateAccessBindingRequest[];
    }
    /**
     * Response message for BatchCreateAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse {
        /**
         * The access bindings created.
         */
        accessBindings?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding[];
    }
    /**
     * Request message for BatchDeleteAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchDeleteAccessBindingsRequest {
        /**
         * Required. The requests specifying the access bindings to delete. A maximum of 1000 access bindings can be deleted in a batch.
         */
        requests?: Schema$GoogleAnalyticsAdminV1alphaDeleteAccessBindingRequest[];
    }
    /**
     * Response message for BatchGetAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse {
        /**
         * The requested access bindings.
         */
        accessBindings?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding[];
    }
    /**
     * Request message for BatchUpdateAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsRequest {
        /**
         * Required. The requests specifying the access bindings to update. A maximum of 1000 access bindings can be updated in a batch.
         */
        requests?: Schema$GoogleAnalyticsAdminV1alphaUpdateAccessBindingRequest[];
    }
    /**
     * Response message for BatchUpdateAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse {
        /**
         * The access bindings updated.
         */
        accessBindings?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding[];
    }
    /**
     * A link between a Google Analytics property and BigQuery project.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaBigQueryLink {
        /**
         * Output only. Time when the link was created.
         */
        createTime?: string | null;
        /**
         * If set true, enables daily data export to the linked Google Cloud project.
         */
        dailyExportEnabled?: boolean | null;
        /**
         * Required. Immutable. The geographic location where the created BigQuery dataset should reside. See https://cloud.google.com/bigquery/docs/locations for supported locations.
         */
        datasetLocation?: string | null;
        /**
         * The list of event names that will be excluded from exports.
         */
        excludedEvents?: string[] | null;
        /**
         * The list of streams under the parent property for which data will be exported. Format: properties/{property_id\}/dataStreams/{stream_id\} Example: ['properties/1000/dataStreams/2000']
         */
        exportStreams?: string[] | null;
        /**
         * If set true, enables fresh daily export to the linked Google Cloud project.
         */
        freshDailyExportEnabled?: boolean | null;
        /**
         * If set true, exported data will include advertising identifiers for mobile app streams.
         */
        includeAdvertisingId?: boolean | null;
        /**
         * Output only. Resource name of this BigQuery link. Format: 'properties/{property_id\}/bigQueryLinks/{bigquery_link_id\}' Format: 'properties/1234/bigQueryLinks/abc567'
         */
        name?: string | null;
        /**
         * Immutable. The linked Google Cloud project. When creating a BigQueryLink, you may provide this resource name using either a project number or project ID. Once this resource has been created, the returned project will always have a project that contains a project number. Format: 'projects/{project number\}' Example: 'projects/1234'
         */
        project?: string | null;
        /**
         * If set true, enables streaming export to the linked Google Cloud project.
         */
        streamingExportEnabled?: boolean | null;
    }
    /**
     * A definition for a calculated metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric {
        /**
         * Output only. The ID to use for the calculated metric. In the UI, this is referred to as the "API name." The calculated_metric_id is used when referencing this calculated metric from external APIs. For example, "calcMetric:{calculated_metric_id\}".
         */
        calculatedMetricId?: string | null;
        /**
         * Optional. Description for this calculated metric. Max length of 4096 characters.
         */
        description?: string | null;
        /**
         * Required. Display name for this calculated metric as shown in the Google Analytics UI. Max length 82 characters.
         */
        displayName?: string | null;
        /**
         * Required. The calculated metric's definition. Maximum number of unique referenced custom metrics is 5. Formulas supports the following operations: + (addition), - (subtraction), - (negative), * (multiplication), / (division), () (parenthesis). Any valid real numbers are acceptable that fit in a Long (64bit integer) or a Double (64 bit floating point number). Example formula: "( customEvent:parameter_name + cartPurchaseQuantity ) / 2.0"
         */
        formula?: string | null;
        /**
         * Output only. If true, this calculated metric has a invalid metric reference. Anything using a calculated metric with invalid_metric_reference set to true may fail, produce warnings, or produce unexpected results.
         */
        invalidMetricReference?: boolean | null;
        /**
         * Required. The type for the calculated metric's value.
         */
        metricUnit?: string | null;
        /**
         * Output only. Resource name for this CalculatedMetric. Format: 'properties/{property_id\}/calculatedMetrics/{calculated_metric_id\}'
         */
        name?: string | null;
        /**
         * Output only. Types of restricted data that this metric contains.
         */
        restrictedMetricType?: string[] | null;
    }
    /**
     * Request message for CancelDisplayVideo360AdvertiserLinkProposal RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCancelDisplayVideo360AdvertiserLinkProposalRequest {
    }
    /**
     * A description of a change to a single Google Analytics resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChangeHistoryChange {
        /**
         * The type of action that changed this resource.
         */
        action?: string | null;
        /**
         * Resource name of the resource whose changes are described by this entry.
         */
        resource?: string | null;
        /**
         * Resource contents from after the change was made. If this resource was deleted in this change, this field will be missing.
         */
        resourceAfterChange?: Schema$GoogleAnalyticsAdminV1alphaChangeHistoryChangeChangeHistoryResource;
        /**
         * Resource contents from before the change was made. If this resource was created in this change, this field will be missing.
         */
        resourceBeforeChange?: Schema$GoogleAnalyticsAdminV1alphaChangeHistoryChangeChangeHistoryResource;
    }
    /**
     * A snapshot of a resource as before or after the result of a change in change history.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChangeHistoryChangeChangeHistoryResource {
        /**
         * A snapshot of an Account resource in change history.
         */
        account?: Schema$GoogleAnalyticsAdminV1alphaAccount;
        /**
         * A snapshot of an AdSenseLink resource in change history.
         */
        adsenseLink?: Schema$GoogleAnalyticsAdminV1alphaAdSenseLink;
        /**
         * A snapshot of AttributionSettings resource in change history.
         */
        attributionSettings?: Schema$GoogleAnalyticsAdminV1alphaAttributionSettings;
        /**
         * A snapshot of an Audience resource in change history.
         */
        audience?: Schema$GoogleAnalyticsAdminV1alphaAudience;
        /**
         * A snapshot of a BigQuery link resource in change history.
         */
        bigqueryLink?: Schema$GoogleAnalyticsAdminV1alphaBigQueryLink;
        /**
         * A snapshot of a CalculatedMetric resource in change history.
         */
        calculatedMetric?: Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric;
        /**
         * A snapshot of a ChannelGroup resource in change history.
         */
        channelGroup?: Schema$GoogleAnalyticsAdminV1alphaChannelGroup;
        /**
         * A snapshot of a ConversionEvent resource in change history.
         */
        conversionEvent?: Schema$GoogleAnalyticsAdminV1alphaConversionEvent;
        /**
         * A snapshot of a CustomDimension resource in change history.
         */
        customDimension?: Schema$GoogleAnalyticsAdminV1alphaCustomDimension;
        /**
         * A snapshot of a CustomMetric resource in change history.
         */
        customMetric?: Schema$GoogleAnalyticsAdminV1alphaCustomMetric;
        /**
         * A snapshot of DataRedactionSettings resource in change history.
         */
        dataRedactionSettings?: Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings;
        /**
         * A snapshot of a data retention settings resource in change history.
         */
        dataRetentionSettings?: Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings;
        /**
         * A snapshot of a DataStream resource in change history.
         */
        dataStream?: Schema$GoogleAnalyticsAdminV1alphaDataStream;
        /**
         * A snapshot of a DisplayVideo360AdvertiserLink resource in change history.
         */
        displayVideo360AdvertiserLink?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink;
        /**
         * A snapshot of a DisplayVideo360AdvertiserLinkProposal resource in change history.
         */
        displayVideo360AdvertiserLinkProposal?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal;
        /**
         * A snapshot of EnhancedMeasurementSettings resource in change history.
         */
        enhancedMeasurementSettings?: Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings;
        /**
         * A snapshot of an EventCreateRule resource in change history.
         */
        eventCreateRule?: Schema$GoogleAnalyticsAdminV1alphaEventCreateRule;
        /**
         * A snapshot of an ExpandedDataSet resource in change history.
         */
        expandedDataSet?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet;
        /**
         * A snapshot of a FirebaseLink resource in change history.
         */
        firebaseLink?: Schema$GoogleAnalyticsAdminV1alphaFirebaseLink;
        /**
         * A snapshot of a GoogleAdsLink resource in change history.
         */
        googleAdsLink?: Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink;
        /**
         * A snapshot of a GoogleSignalsSettings resource in change history.
         */
        googleSignalsSettings?: Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings;
        /**
         * A snapshot of a KeyEvent resource in change history.
         */
        keyEvent?: Schema$GoogleAnalyticsAdminV1alphaKeyEvent;
        /**
         * A snapshot of a MeasurementProtocolSecret resource in change history.
         */
        measurementProtocolSecret?: Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret;
        /**
         * A snapshot of a Property resource in change history.
         */
        property?: Schema$GoogleAnalyticsAdminV1alphaProperty;
        /**
         * A snapshot of a ReportingDataAnnotation resource in change history.
         */
        reportingDataAnnotation?: Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation;
        /**
         * A snapshot of a SearchAds360Link resource in change history.
         */
        searchAds360Link?: Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link;
        /**
         * A snapshot of SKAdNetworkConversionValueSchema resource in change history.
         */
        skadnetworkConversionValueSchema?: Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema;
    }
    /**
     * A set of changes within a Google Analytics account or its child properties that resulted from the same cause. Common causes would be updates made in the Google Analytics UI, changes from customer support, or automatic Google Analytics system changes.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChangeHistoryEvent {
        /**
         * The type of actor that made this change.
         */
        actorType?: string | null;
        /**
         * A list of changes made in this change history event that fit the filters specified in SearchChangeHistoryEventsRequest.
         */
        changes?: Schema$GoogleAnalyticsAdminV1alphaChangeHistoryChange[];
        /**
         * If true, then the list of changes returned was filtered, and does not represent all changes that occurred in this event.
         */
        changesFiltered?: boolean | null;
        /**
         * Time when change was made.
         */
        changeTime?: string | null;
        /**
         * ID of this change history event. This ID is unique across Google Analytics.
         */
        id?: string | null;
        /**
         * Email address of the Google account that made the change. This will be a valid email address if the actor field is set to USER, and empty otherwise. Google accounts that have been deleted will cause an error.
         */
        userActorEmail?: string | null;
    }
    /**
     * A resource message representing a Channel Group.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroup {
        /**
         * The description of the Channel Group. Max length of 256 characters.
         */
        description?: string | null;
        /**
         * Required. The display name of the Channel Group. Max length of 80 characters.
         */
        displayName?: string | null;
        /**
         * Required. The grouping rules of channels. Maximum number of rules is 50.
         */
        groupingRule?: Schema$GoogleAnalyticsAdminV1alphaGroupingRule[];
        /**
         * Output only. The resource name for this Channel Group resource. Format: properties/{property\}/channelGroups/{channel_group\}
         */
        name?: string | null;
        /**
         * Optional. If true, this channel group will be used as the default channel group for reports. Only one channel group can be set as `primary` at any time. If the `primary` field gets set on a channel group, it will get unset on the previous primary channel group. The Google Analytics predefined channel group is the primary by default.
         */
        primary?: boolean | null;
        /**
         * Output only. If true, then this channel group is the Default Channel Group predefined by Google Analytics. Display name and grouping rules cannot be updated for this channel group.
         */
        systemDefined?: boolean | null;
    }
    /**
     * A specific filter for a single dimension.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilter {
        /**
         * Required. Immutable. The dimension name to filter.
         */
        fieldName?: string | null;
        /**
         * A filter for a string dimension that matches a particular list of options.
         */
        inListFilter?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterInListFilter;
        /**
         * A filter for a string-type dimension that matches a particular pattern.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterStringFilter;
    }
    /**
     * A logical expression of Channel Group dimension filters.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpression {
        /**
         * A list of expressions to be AND’ed together. It can only contain ChannelGroupFilterExpressions with or_group. This must be set for the top level ChannelGroupFilterExpression.
         */
        andGroup?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpressionList;
        /**
         * A filter on a single dimension. This cannot be set on the top level ChannelGroupFilterExpression.
         */
        filter?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilter;
        /**
         * A filter expression to be NOT'ed (that is inverted, complemented). It can only include a dimension_or_metric_filter. This cannot be set on the top level ChannelGroupFilterExpression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpression;
        /**
         * A list of expressions to OR’ed together. It cannot contain ChannelGroupFilterExpressions with and_group or or_group.
         */
        orGroup?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpressionList;
    }
    /**
     * A list of Channel Group filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpressionList {
        /**
         * A list of Channel Group filter expressions.
         */
        filterExpressions?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpression[];
    }
    /**
     * A filter for a string dimension that matches a particular list of options. The match is case insensitive.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterInListFilter {
        /**
         * Required. The list of possible string values to match against. Must be non-empty.
         */
        values?: string[] | null;
    }
    /**
     * Filter where the field value is a String. The match is case insensitive.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterStringFilter {
        /**
         * Required. The match type for the string filter.
         */
        matchType?: string | null;
        /**
         * Required. The string value to be matched against.
         */
        value?: string | null;
    }
    /**
     * Configuration for a specific Connected Site Tag.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaConnectedSiteTag {
        /**
         * Required. User-provided display name for the connected site tag. Must be less than 256 characters.
         */
        displayName?: string | null;
        /**
         * Required. "Tag ID to forward events to. Also known as the Measurement ID, or the "G-ID" (For example: G-12345).
         */
        tagId?: string | null;
    }
    /**
     * A conversion event in a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaConversionEvent {
        /**
         * Optional. The method by which conversions will be counted across multiple events within a session. If this value is not provided, it will be set to `ONCE_PER_EVENT`.
         */
        countingMethod?: string | null;
        /**
         * Output only. Time when this conversion event was created in the property.
         */
        createTime?: string | null;
        /**
         * Output only. If set to true, this conversion event refers to a custom event. If set to false, this conversion event refers to a default event in GA. Default events typically have special meaning in GA. Default events are usually created for you by the GA system, but in some cases can be created by property admins. Custom events count towards the maximum number of custom conversion events that may be created per property.
         */
        custom?: boolean | null;
        /**
         * Optional. Defines a default value/currency for a conversion event.
         */
        defaultConversionValue?: Schema$GoogleAnalyticsAdminV1alphaConversionEventDefaultConversionValue;
        /**
         * Output only. If set, this event can currently be deleted with DeleteConversionEvent.
         */
        deletable?: boolean | null;
        /**
         * Immutable. The event name for this conversion event. Examples: 'click', 'purchase'
         */
        eventName?: string | null;
        /**
         * Output only. Resource name of this conversion event. Format: properties/{property\}/conversionEvents/{conversion_event\}
         */
        name?: string | null;
    }
    /**
     * Defines a default value/currency for a conversion event. Both value and currency must be provided.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaConversionEventDefaultConversionValue {
        /**
         * When a conversion event for this event_name has no set currency, this currency will be applied as the default. Must be in ISO 4217 currency code format. See https://en.wikipedia.org/wiki/ISO_4217 for more information.
         */
        currencyCode?: string | null;
        /**
         * This value will be used to populate the value for all conversions of the specified event_name where the event "value" parameter is unset.
         */
        value?: number | null;
    }
    /**
     * Conversion value settings for a postback window for SKAdNetwork conversion value schema.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaConversionValues {
        /**
         * Required. A coarse grained conversion value. This value is not guaranteed to be unique.
         */
        coarseValue?: string | null;
        /**
         * Display name of the SKAdNetwork conversion value. The max allowed display name length is 50 UTF-16 code units.
         */
        displayName?: string | null;
        /**
         * Event conditions that must be met for this Conversion Value to be achieved. The conditions in this list are ANDed together. It must have minimum of 1 entry and maximum of 3 entries, if the postback window is enabled.
         */
        eventMappings?: Schema$GoogleAnalyticsAdminV1alphaEventMapping[];
        /**
         * The fine-grained conversion value. This is applicable only to the first postback window. Its valid values are [0,63], both inclusive. It must be set for postback window 1, and must not be set for postback window 2 & 3. This value is not guaranteed to be unique. If the configuration for the first postback window is re-used for second or third postback windows this field has no effect.
         */
        fineValue?: number | null;
        /**
         * If true, the SDK should lock to this conversion value for the current postback window.
         */
        lockEnabled?: boolean | null;
    }
    /**
     * Request message for CreateAccessBinding RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCreateAccessBindingRequest {
        /**
         * Required. The access binding to create.
         */
        accessBinding?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
        /**
         * Required. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string | null;
    }
    /**
     * Request message for CreateConnectedSiteTag RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagRequest {
        /**
         * Required. The tag to add to the Universal Analytics property
         */
        connectedSiteTag?: Schema$GoogleAnalyticsAdminV1alphaConnectedSiteTag;
        /**
         * The Universal Analytics property to create connected site tags for. This API does not support GA4 properties. Format: properties/{universalAnalyticsPropertyId\} Example: properties/1234
         */
        property?: string | null;
    }
    /**
     * Response message for CreateConnectedSiteTag RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse {
    }
    /**
     * Request message for CreateRollupProperty RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyRequest {
        /**
         * Required. The roll-up property to create.
         */
        rollupProperty?: Schema$GoogleAnalyticsAdminV1alphaProperty;
        /**
         * Optional. The resource names of properties that will be sources to the created roll-up property.
         */
        sourceProperties?: string[] | null;
    }
    /**
     * Response message for CreateRollupProperty RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse {
        /**
         * The created roll-up property.
         */
        rollupProperty?: Schema$GoogleAnalyticsAdminV1alphaProperty;
        /**
         * The created roll-up property source links.
         */
        rollupPropertySourceLinks?: Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink[];
    }
    /**
     * A definition for a CustomDimension.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCustomDimension {
        /**
         * Optional. Description for this custom dimension. Max length of 150 characters.
         */
        description?: string | null;
        /**
         * Optional. If set to true, sets this dimension as NPA and excludes it from ads personalization. This is currently only supported by user-scoped custom dimensions.
         */
        disallowAdsPersonalization?: boolean | null;
        /**
         * Required. Display name for this custom dimension as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter. Legacy system-generated display names may contain square brackets, but updates to this field will never permit square brackets.
         */
        displayName?: string | null;
        /**
         * Output only. Resource name for this CustomDimension resource. Format: properties/{property\}/customDimensions/{customDimension\}
         */
        name?: string | null;
        /**
         * Required. Immutable. Tagging parameter name for this custom dimension. If this is a user-scoped dimension, then this is the user property name. If this is an event-scoped dimension, then this is the event parameter name. If this is an item-scoped dimension, then this is the parameter name found in the eCommerce items array. May only contain alphanumeric and underscore characters, starting with a letter. Max length of 24 characters for user-scoped dimensions, 40 characters for event-scoped dimensions.
         */
        parameterName?: string | null;
        /**
         * Required. Immutable. The scope of this dimension.
         */
        scope?: string | null;
    }
    /**
     * A definition for a custom metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaCustomMetric {
        /**
         * Optional. Description for this custom dimension. Max length of 150 characters.
         */
        description?: string | null;
        /**
         * Required. Display name for this custom metric as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter. Legacy system-generated display names may contain square brackets, but updates to this field will never permit square brackets.
         */
        displayName?: string | null;
        /**
         * Required. The type for the custom metric's value.
         */
        measurementUnit?: string | null;
        /**
         * Output only. Resource name for this CustomMetric resource. Format: properties/{property\}/customMetrics/{customMetric\}
         */
        name?: string | null;
        /**
         * Required. Immutable. Tagging name for this custom metric. If this is an event-scoped metric, then this is the event parameter name. May only contain alphanumeric and underscore charactes, starting with a letter. Max length of 40 characters for event-scoped metrics.
         */
        parameterName?: string | null;
        /**
         * Optional. Types of restricted data that this metric may contain. Required for metrics with CURRENCY measurement unit. Must be empty for metrics with a non-CURRENCY measurement unit.
         */
        restrictedMetricType?: string[] | null;
        /**
         * Required. Immutable. The scope of this custom metric.
         */
        scope?: string | null;
    }
    /**
     * Settings for client-side data redaction. Singleton resource under a Web Stream.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings {
        /**
         * If enabled, any event parameter or user property values that look like an email will be redacted.
         */
        emailRedactionEnabled?: boolean | null;
        /**
         * Output only. Name of this Data Redaction Settings resource. Format: properties/{property_id\}/dataStreams/{data_stream\}/dataRedactionSettings Example: "properties/1000/dataStreams/2000/dataRedactionSettings"
         */
        name?: string | null;
        /**
         * The query parameter keys to apply redaction logic to if present in the URL. Query parameter matching is case-insensitive. Must contain at least one element if query_parameter_replacement_enabled is true. Keys cannot contain commas.
         */
        queryParameterKeys?: string[] | null;
        /**
         * Query Parameter redaction removes the key and value portions of a query parameter if it is in the configured set of query parameters. If enabled, URL query replacement logic will be run for the Stream. Any query parameters defined in query_parameter_keys will be redacted.
         */
        queryParameterRedactionEnabled?: boolean | null;
    }
    /**
     * Settings values for data retention. This is a singleton resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings {
        /**
         * Required. The length of time that event-level data is retained.
         */
        eventDataRetention?: string | null;
        /**
         * Output only. Resource name for this DataRetentionSetting resource. Format: properties/{property\}/dataRetentionSettings
         */
        name?: string | null;
        /**
         * If true, reset the retention period for the user identifier with every event from that user.
         */
        resetUserDataOnNewActivity?: boolean | null;
        /**
         * Required. The length of time that user-level data is retained.
         */
        userDataRetention?: string | null;
    }
    /**
     * A resource message representing data sharing settings of a Google Analytics account.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings {
        /**
         * Output only. Resource name. Format: accounts/{account\}/dataSharingSettings Example: "accounts/1000/dataSharingSettings"
         */
        name?: string | null;
        /**
         * Deprecated. This field is no longer used and always returns false.
         */
        sharingWithGoogleAnySalesEnabled?: boolean | null;
        /**
         * Allows Google access to your Google Analytics account data, including account usage and configuration data, product spending, and users associated with your Google Analytics account, so that Google can help you make the most of Google products, providing you with insights, offers, recommendations, and optimization tips across Google Analytics and other Google products for business. This field maps to the "Recommendations for your business" field in the Google Analytics Admin UI.
         */
        sharingWithGoogleAssignedSalesEnabled?: boolean | null;
        /**
         * Allows Google to use the data to improve other Google products or services. This fields maps to the "Google products & services" field in the Google Analytics Admin UI.
         */
        sharingWithGoogleProductsEnabled?: boolean | null;
        /**
         * Allows Google technical support representatives access to your Google Analytics data and account when necessary to provide service and find solutions to technical issues. This field maps to the "Technical support" field in the Google Analytics Admin UI.
         */
        sharingWithGoogleSupportEnabled?: boolean | null;
        /**
         * Enable features like predictions, modeled data, and benchmarking that can provide you with richer business insights when you contribute aggregated measurement data. The data you share (including information about the property from which it is shared) is aggregated and de-identified before being used to generate business insights. This field maps to the "Modeling contributions & business insights" field in the Google Analytics Admin UI.
         */
        sharingWithOthersEnabled?: boolean | null;
    }
    /**
     * A resource message representing a data stream.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataStream {
        /**
         * Data specific to Android app streams. Must be populated if type is ANDROID_APP_DATA_STREAM.
         */
        androidAppStreamData?: Schema$GoogleAnalyticsAdminV1alphaDataStreamAndroidAppStreamData;
        /**
         * Output only. Time when this stream was originally created.
         */
        createTime?: string | null;
        /**
         * Human-readable display name for the Data Stream. Required for web data streams. The max allowed display name length is 255 UTF-16 code units.
         */
        displayName?: string | null;
        /**
         * Data specific to iOS app streams. Must be populated if type is IOS_APP_DATA_STREAM.
         */
        iosAppStreamData?: Schema$GoogleAnalyticsAdminV1alphaDataStreamIosAppStreamData;
        /**
         * Output only. Resource name of this Data Stream. Format: properties/{property_id\}/dataStreams/{stream_id\} Example: "properties/1000/dataStreams/2000"
         */
        name?: string | null;
        /**
         * Required. Immutable. The type of this DataStream resource.
         */
        type?: string | null;
        /**
         * Output only. Time when stream payload fields were last updated.
         */
        updateTime?: string | null;
        /**
         * Data specific to web streams. Must be populated if type is WEB_DATA_STREAM.
         */
        webStreamData?: Schema$GoogleAnalyticsAdminV1alphaDataStreamWebStreamData;
    }
    /**
     * Data specific to Android app streams.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataStreamAndroidAppStreamData {
        /**
         * Output only. ID of the corresponding Android app in Firebase, if any. This ID can change if the Android app is deleted and recreated.
         */
        firebaseAppId?: string | null;
        /**
         * Immutable. The package name for the app being measured. Example: "com.example.myandroidapp"
         */
        packageName?: string | null;
    }
    /**
     * Data specific to iOS app streams.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataStreamIosAppStreamData {
        /**
         * Required. Immutable. The Apple App Store Bundle ID for the app Example: "com.example.myiosapp"
         */
        bundleId?: string | null;
        /**
         * Output only. ID of the corresponding iOS app in Firebase, if any. This ID can change if the iOS app is deleted and recreated.
         */
        firebaseAppId?: string | null;
    }
    /**
     * Data specific to web streams.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDataStreamWebStreamData {
        /**
         * Domain name of the web app being measured, or empty. Example: "http://www.google.com", "https://www.google.com"
         */
        defaultUri?: string | null;
        /**
         * Output only. ID of the corresponding web app in Firebase, if any. This ID can change if the web app is deleted and recreated.
         */
        firebaseAppId?: string | null;
        /**
         * Output only. Analytics Measurement ID. Example: "G-1A2BCD345E"
         */
        measurementId?: string | null;
    }
    /**
     * Request message for DeleteAccessBinding RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDeleteAccessBindingRequest {
        /**
         * Required. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        name?: string | null;
    }
    /**
     * Request message for DeleteConnectedSiteTag RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDeleteConnectedSiteTagRequest {
        /**
         * The Universal Analytics property to delete connected site tags for. This API does not support GA4 properties. Format: properties/{universalAnalyticsPropertyId\} Example: properties/1234
         */
        property?: string | null;
        /**
         * Tag ID to forward events to. Also known as the Measurement ID, or the "G-ID" (For example: G-12345).
         */
        tagId?: string | null;
    }
    /**
     * A link between a Google Analytics property and a Display & Video 360 advertiser.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink {
        /**
         * Enables personalized advertising features with this integration. If this field is not set on create/update, it will be defaulted to true.
         */
        adsPersonalizationEnabled?: boolean | null;
        /**
         * Output only. The display name of the Display & Video 360 Advertiser.
         */
        advertiserDisplayName?: string | null;
        /**
         * Immutable. The Display & Video 360 Advertiser's advertiser ID.
         */
        advertiserId?: string | null;
        /**
         * Immutable. Enables the import of campaign data from Display & Video 360 into the Google Analytics property. After link creation, this can only be updated from the Display & Video 360 product. If this field is not set on create, it will be defaulted to true.
         */
        campaignDataSharingEnabled?: boolean | null;
        /**
         * Immutable. Enables the import of cost data from Display & Video 360 into the Google Analytics property. This can only be enabled if `campaign_data_sharing_enabled` is true. After link creation, this can only be updated from the Display & Video 360 product. If this field is not set on create, it will be defaulted to true.
         */
        costDataSharingEnabled?: boolean | null;
        /**
         * Output only. The resource name for this DisplayVideo360AdvertiserLink resource. Format: properties/{propertyId\}/displayVideo360AdvertiserLinks/{linkId\} Note: linkId is not the Display & Video 360 Advertiser ID
         */
        name?: string | null;
    }
    /**
     * A proposal for a link between a Google Analytics property and a Display & Video 360 advertiser. A proposal is converted to a DisplayVideo360AdvertiserLink once approved. Google Analytics admins approve inbound proposals while Display & Video 360 admins approve outbound proposals.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal {
        /**
         * Immutable. Enables personalized advertising features with this integration. If this field is not set on create, it will be defaulted to true.
         */
        adsPersonalizationEnabled?: boolean | null;
        /**
         * Output only. The display name of the Display & Video Advertiser. Only populated for proposals that originated from Display & Video 360.
         */
        advertiserDisplayName?: string | null;
        /**
         * Immutable. The Display & Video 360 Advertiser's advertiser ID.
         */
        advertiserId?: string | null;
        /**
         * Immutable. Enables the import of campaign data from Display & Video 360. If this field is not set on create, it will be defaulted to true.
         */
        campaignDataSharingEnabled?: boolean | null;
        /**
         * Immutable. Enables the import of cost data from Display & Video 360. This can only be enabled if campaign_data_sharing_enabled is enabled. If this field is not set on create, it will be defaulted to true.
         */
        costDataSharingEnabled?: boolean | null;
        /**
         * Output only. The status information for this link proposal.
         */
        linkProposalStatusDetails?: Schema$GoogleAnalyticsAdminV1alphaLinkProposalStatusDetails;
        /**
         * Output only. The resource name for this DisplayVideo360AdvertiserLinkProposal resource. Format: properties/{propertyId\}/displayVideo360AdvertiserLinkProposals/{proposalId\} Note: proposalId is not the Display & Video 360 Advertiser ID
         */
        name?: string | null;
        /**
         * Input only. On a proposal being sent to Display & Video 360, this field must be set to the email address of an admin on the target advertiser. This is used to verify that the Google Analytics admin is aware of at least one admin on the Display & Video 360 Advertiser. This does not restrict approval of the proposal to a single user. Any admin on the Display & Video 360 Advertiser may approve the proposal.
         */
        validationEmail?: string | null;
    }
    /**
     * Singleton resource under a web DataStream, configuring measurement of additional site interactions and content.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings {
        /**
         * If enabled, capture a file download event each time a link is clicked with a common document, compressed file, application, video, or audio extension.
         */
        fileDownloadsEnabled?: boolean | null;
        /**
         * If enabled, capture a form interaction event each time a visitor interacts with a form on your website. False by default.
         */
        formInteractionsEnabled?: boolean | null;
        /**
         * Output only. Resource name of the Enhanced Measurement Settings. Format: properties/{property_id\}/dataStreams/{data_stream\}/enhancedMeasurementSettings Example: "properties/1000/dataStreams/2000/enhancedMeasurementSettings"
         */
        name?: string | null;
        /**
         * If enabled, capture an outbound click event each time a visitor clicks a link that leads them away from your domain.
         */
        outboundClicksEnabled?: boolean | null;
        /**
         * If enabled, capture a page view event each time the website changes the browser history state.
         */
        pageChangesEnabled?: boolean | null;
        /**
         * If enabled, capture scroll events each time a visitor gets to the bottom of a page.
         */
        scrollsEnabled?: boolean | null;
        /**
         * Required. URL query parameters to interpret as site search parameters. Max length is 1024 characters. Must not be empty.
         */
        searchQueryParameter?: string | null;
        /**
         * If enabled, capture a view search results event each time a visitor performs a search on your site (based on a query parameter).
         */
        siteSearchEnabled?: boolean | null;
        /**
         * Indicates whether Enhanced Measurement Settings will be used to automatically measure interactions and content on this web stream. Changing this value does not affect the settings themselves, but determines whether they are respected.
         */
        streamEnabled?: boolean | null;
        /**
         * Additional URL query parameters. Max length is 1024 characters.
         */
        uriQueryParameter?: string | null;
        /**
         * If enabled, capture video play, progress, and complete events as visitors view embedded videos on your site.
         */
        videoEngagementEnabled?: boolean | null;
    }
    /**
     * An Event Create Rule defines conditions that will trigger the creation of an entirely new event based upon matched criteria of a source event. Additional mutations of the parameters from the source event can be defined. Unlike Event Edit rules, Event Creation Rules have no defined order. They will all be run independently. Event Edit and Event Create rules can't be used to modify an event created from an Event Create rule.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaEventCreateRule {
        /**
         * Required. The name of the new event to be created. This value must: * be less than 40 characters * consist only of letters, digits or _ (underscores) * start with a letter
         */
        destinationEvent?: string | null;
        /**
         * Required. Must have at least one condition, and can have up to 10 max. Conditions on the source event must match for this rule to be applied.
         */
        eventConditions?: Schema$GoogleAnalyticsAdminV1alphaMatchingCondition[];
        /**
         * Output only. Resource name for this EventCreateRule resource. Format: properties/{property\}/dataStreams/{data_stream\}/eventCreateRules/{event_create_rule\}
         */
        name?: string | null;
        /**
         * Parameter mutations define parameter behavior on the new event, and are applied in order. A maximum of 20 mutations can be applied.
         */
        parameterMutations?: Schema$GoogleAnalyticsAdminV1alphaParameterMutation[];
        /**
         * If true, the source parameters are copied to the new event. If false, or unset, all non-internal parameters are not copied from the source event. Parameter mutations are applied after the parameters have been copied.
         */
        sourceCopyParameters?: boolean | null;
    }
    /**
     * An Event Edit Rule defines conditions that will trigger the creation of an entirely new event based upon matched criteria of a source event. Additional mutations of the parameters from the source event can be defined. Unlike Event Create rules, Event Edit Rules are applied in their defined order. Event Edit rules can't be used to modify an event created from an Event Create rule.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaEventEditRule {
        /**
         * Required. The display name of this event edit rule. Maximum of 255 characters.
         */
        displayName?: string | null;
        /**
         * Required. Conditions on the source event must match for this rule to be applied. Must have at least one condition, and can have up to 10 max.
         */
        eventConditions?: Schema$GoogleAnalyticsAdminV1alphaMatchingCondition[];
        /**
         * Identifier. Resource name for this EventEditRule resource. Format: properties/{property\}/dataStreams/{data_stream\}/eventEditRules/{event_edit_rule\}
         */
        name?: string | null;
        /**
         * Required. Parameter mutations define parameter behavior on the new event, and are applied in order. A maximum of 20 mutations can be applied.
         */
        parameterMutations?: Schema$GoogleAnalyticsAdminV1alphaParameterMutation[];
        /**
         * Output only. The order for which this rule will be processed. Rules with an order value lower than this will be processed before this rule, rules with an order value higher than this will be processed after this rule. New event edit rules will be assigned an order value at the end of the order. This value does not apply to event create rules.
         */
        processingOrder?: string | null;
    }
    /**
     * Event setting conditions to match an event.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaEventMapping {
        /**
         * Required. Name of the Google Analytics event. It must always be set. The max allowed display name length is 40 UTF-16 code units.
         */
        eventName?: string | null;
        /**
         * The maximum number of times the event occurred. If not set, maximum event count won't be checked.
         */
        maxEventCount?: string | null;
        /**
         * The maximum revenue generated due to the event. Revenue currency will be defined at the property level. If not set, maximum event value won't be checked.
         */
        maxEventValue?: number | null;
        /**
         * At least one of the following four min/max values must be set. The values set will be ANDed together to qualify an event. The minimum number of times the event occurred. If not set, minimum event count won't be checked.
         */
        minEventCount?: string | null;
        /**
         * The minimum revenue generated due to the event. Revenue currency will be defined at the property level. If not set, minimum event value won't be checked.
         */
        minEventValue?: number | null;
    }
    /**
     * A resource message representing an `ExpandedDataSet`.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet {
        /**
         * Output only. Time when expanded data set began (or will begin) collecing data.
         */
        dataCollectionStartTime?: string | null;
        /**
         * Optional. The description of the ExpandedDataSet. Max 50 chars.
         */
        description?: string | null;
        /**
         * Immutable. A logical expression of ExpandedDataSet filters applied to dimension included in the ExpandedDataSet. This filter is used to reduce the number of rows and thus the chance of encountering `other` row.
         */
        dimensionFilterExpression?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpression;
        /**
         * Immutable. The list of dimensions included in the ExpandedDataSet. See the [API Dimensions](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions) for the list of dimension names.
         */
        dimensionNames?: string[] | null;
        /**
         * Required. The display name of the ExpandedDataSet. Max 200 chars.
         */
        displayName?: string | null;
        /**
         * Immutable. The list of metrics included in the ExpandedDataSet. See the [API Metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics) for the list of dimension names.
         */
        metricNames?: string[] | null;
        /**
         * Output only. The resource name for this ExpandedDataSet resource. Format: properties/{property_id\}/expandedDataSets/{expanded_data_set\}
         */
        name?: string | null;
    }
    /**
     * A specific filter for a single dimension
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilter {
        /**
         * Required. The dimension name to filter.
         */
        fieldName?: string | null;
        /**
         * A filter for a string dimension that matches a particular list of options.
         */
        inListFilter?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterInListFilter;
        /**
         * A filter for a string-type dimension that matches a particular pattern.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterStringFilter;
    }
    /**
     * A logical expression of EnhancedDataSet dimension filters.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpression {
        /**
         * A list of expressions to be AND’ed together. It must contain a ExpandedDataSetFilterExpression with either not_expression or dimension_filter. This must be set for the top level ExpandedDataSetFilterExpression.
         */
        andGroup?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpressionList;
        /**
         * A filter on a single dimension. This cannot be set on the top level ExpandedDataSetFilterExpression.
         */
        filter?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilter;
        /**
         * A filter expression to be NOT'ed (that is, inverted, complemented). It must include a dimension_filter. This cannot be set on the top level ExpandedDataSetFilterExpression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpression;
    }
    /**
     * A list of ExpandedDataSet filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpressionList {
        /**
         * A list of ExpandedDataSet filter expressions.
         */
        filterExpressions?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterExpression[];
    }
    /**
     * A filter for a string dimension that matches a particular list of options.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterInListFilter {
        /**
         * Optional. If true, the match is case-sensitive. If false, the match is case-insensitive. Must be true.
         */
        caseSensitive?: boolean | null;
        /**
         * Required. The list of possible string values to match against. Must be non-empty.
         */
        values?: string[] | null;
    }
    /**
     * A filter for a string-type dimension that matches a particular pattern.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaExpandedDataSetFilterStringFilter {
        /**
         * Optional. If true, the match is case-sensitive. If false, the match is case-insensitive. Must be true when match_type is EXACT. Must be false when match_type is CONTAINS.
         */
        caseSensitive?: boolean | null;
        /**
         * Required. The match type for the string filter.
         */
        matchType?: string | null;
        /**
         * Required. The string value to be matched against.
         */
        value?: string | null;
    }
    /**
     * Request for fetching the opt out status for the automated GA4 setup process.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutRequest {
        /**
         * Required. The UA property to get the opt out status. Note this request uses the internal property ID, not the tracking ID of the form UA-XXXXXX-YY. Format: properties/{internalWebPropertyId\} Example: properties/1234
         */
        property?: string | null;
    }
    /**
     * Response message for fetching the opt out status for the automated GA4 setup process.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse {
        /**
         * The opt out status for the UA property.
         */
        optOut?: boolean | null;
    }
    /**
     * Response for looking up GA4 property connected to a UA property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse {
        /**
         * The GA4 property connected to the UA property. An empty string is returned when there is no connected GA4 property. Format: properties/{property_id\} Example: properties/1234
         */
        property?: string | null;
    }
    /**
     * A link between a Google Analytics property and a Firebase project.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaFirebaseLink {
        /**
         * Output only. Time when this FirebaseLink was originally created.
         */
        createTime?: string | null;
        /**
         * Output only. Example format: properties/1234/firebaseLinks/5678
         */
        name?: string | null;
        /**
         * Immutable. Firebase project resource name. When creating a FirebaseLink, you may provide this resource name using either a project number or project ID. Once this resource has been created, returned FirebaseLinks will always have a project_name that contains a project number. Format: 'projects/{project number\}' Example: 'projects/1234'
         */
        project?: string | null;
    }
    /**
     * Read-only resource with the tag for sending data from a website to a DataStream. Only present for web DataStream resources.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag {
        /**
         * Output only. Resource name for this GlobalSiteTag resource. Format: properties/{property_id\}/dataStreams/{stream_id\}/globalSiteTag Example: "properties/123/dataStreams/456/globalSiteTag"
         */
        name?: string | null;
        /**
         * Immutable. JavaScript code snippet to be pasted as the first item into the head tag of every webpage to measure.
         */
        snippet?: string | null;
    }
    /**
     * A link between a Google Analytics property and a Google Ads account.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink {
        /**
         * Enable personalized advertising features with this integration. Automatically publish my Google Analytics audience lists and Google Analytics remarketing events/parameters to the linked Google Ads account. If this field is not set on create/update, it will be defaulted to true.
         */
        adsPersonalizationEnabled?: boolean | null;
        /**
         * Output only. If true, this link is for a Google Ads manager account.
         */
        canManageClients?: boolean | null;
        /**
         * Output only. Time when this link was originally created.
         */
        createTime?: string | null;
        /**
         * Output only. Email address of the user that created the link. An empty string will be returned if the email address can't be retrieved.
         */
        creatorEmailAddress?: string | null;
        /**
         * Immutable. Google Ads customer ID.
         */
        customerId?: string | null;
        /**
         * Output only. Format: properties/{propertyId\}/googleAdsLinks/{googleAdsLinkId\} Note: googleAdsLinkId is not the Google Ads customer ID.
         */
        name?: string | null;
        /**
         * Output only. Time when this link was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Settings values for Google Signals. This is a singleton resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings {
        /**
         * Output only. Terms of Service acceptance.
         */
        consent?: string | null;
        /**
         * Output only. Resource name of this setting. Format: properties/{property_id\}/googleSignalsSettings Example: "properties/1000/googleSignalsSettings"
         */
        name?: string | null;
        /**
         * Status of this setting.
         */
        state?: string | null;
    }
    /**
     * The rules that govern how traffic is grouped into one channel.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaGroupingRule {
        /**
         * Required. Customer defined display name for the channel.
         */
        displayName?: string | null;
        /**
         * Required. The Filter Expression that defines the Grouping Rule.
         */
        expression?: Schema$GoogleAnalyticsAdminV1alphaChannelGroupFilterExpression;
    }
    /**
     * A key event in a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaKeyEvent {
        /**
         * Required. The method by which Key Events will be counted across multiple events within a session.
         */
        countingMethod?: string | null;
        /**
         * Output only. Time when this key event was created in the property.
         */
        createTime?: string | null;
        /**
         * Output only. If set to true, this key event refers to a custom event. If set to false, this key event refers to a default event in GA. Default events typically have special meaning in GA. Default events are usually created for you by the GA system, but in some cases can be created by property admins. Custom events count towards the maximum number of custom key events that may be created per property.
         */
        custom?: boolean | null;
        /**
         * Optional. Defines a default value/currency for a key event.
         */
        defaultValue?: Schema$GoogleAnalyticsAdminV1alphaKeyEventDefaultValue;
        /**
         * Output only. If set to true, this event can be deleted.
         */
        deletable?: boolean | null;
        /**
         * Immutable. The event name for this key event. Examples: 'click', 'purchase'
         */
        eventName?: string | null;
        /**
         * Output only. Resource name of this key event. Format: properties/{property\}/keyEvents/{key_event\}
         */
        name?: string | null;
    }
    /**
     * Defines a default value/currency for a key event.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaKeyEventDefaultValue {
        /**
         * Required. When an occurrence of this Key Event (specified by event_name) has no set currency this currency will be applied as the default. Must be in ISO 4217 currency code format. See https://en.wikipedia.org/wiki/ISO_4217 for more information.
         */
        currencyCode?: string | null;
        /**
         * Required. This will be used to populate the "value" parameter for all occurrences of this Key Event (specified by event_name) where that parameter is unset.
         */
        numericValue?: number | null;
    }
    /**
     * Status information for a link proposal.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaLinkProposalStatusDetails {
        /**
         * Output only. The source of this proposal.
         */
        linkProposalInitiatingProduct?: string | null;
        /**
         * Output only. The state of this proposal.
         */
        linkProposalState?: string | null;
        /**
         * Output only. The email address of the user that proposed this linkage.
         */
        requestorEmail?: string | null;
    }
    /**
     * Response message for ListAccessBindings RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse {
        /**
         * List of AccessBindings. These will be ordered stably, but in an arbitrary order.
         */
        accessBindings?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Request message for ListAccounts RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse {
        /**
         * Results that were accessible to the caller.
         */
        accounts?: Schema$GoogleAnalyticsAdminV1alphaAccount[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListAccountSummaries RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse {
        /**
         * Account summaries of all accounts the caller has access to.
         */
        accountSummaries?: Schema$GoogleAnalyticsAdminV1alphaAccountSummary[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListAdSenseLinks method.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse {
        /**
         * List of AdSenseLinks.
         */
        adsenseLinks?: Schema$GoogleAnalyticsAdminV1alphaAdSenseLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListAudiences RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse {
        /**
         * List of Audiences.
         */
        audiences?: Schema$GoogleAnalyticsAdminV1alphaAudience[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListBigQueryLinks RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse {
        /**
         * List of BigQueryLinks.
         */
        bigqueryLinks?: Schema$GoogleAnalyticsAdminV1alphaBigQueryLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCalculatedMetrics RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse {
        /**
         * List of CalculatedMetrics.
         */
        calculatedMetrics?: Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListChannelGroups RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse {
        /**
         * List of ChannelGroup. These will be ordered stably, but in an arbitrary order.
         */
        channelGroups?: Schema$GoogleAnalyticsAdminV1alphaChannelGroup[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Request message for ListConnectedSiteTags RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsRequest {
        /**
         * The Universal Analytics property to fetch connected site tags for. This does not work on GA4 properties. A maximum of 20 connected site tags will be returned. Example Format: `properties/1234`
         */
        property?: string | null;
    }
    /**
     * Response message for ListConnectedSiteTags RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse {
        /**
         * The site tags for the Universal Analytics property. A maximum of 20 connected site tags will be returned.
         */
        connectedSiteTags?: Schema$GoogleAnalyticsAdminV1alphaConnectedSiteTag[];
    }
    /**
     * Response message for ListConversionEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse {
        /**
         * The requested conversion events
         */
        conversionEvents?: Schema$GoogleAnalyticsAdminV1alphaConversionEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCustomDimensions RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse {
        /**
         * List of CustomDimensions.
         */
        customDimensions?: Schema$GoogleAnalyticsAdminV1alphaCustomDimension[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCustomMetrics RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse {
        /**
         * List of CustomMetrics.
         */
        customMetrics?: Schema$GoogleAnalyticsAdminV1alphaCustomMetric[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListDataStreams RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse {
        /**
         * List of DataStreams.
         */
        dataStreams?: Schema$GoogleAnalyticsAdminV1alphaDataStream[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListDisplayVideo360AdvertiserLinkProposals RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse {
        /**
         * List of DisplayVideo360AdvertiserLinkProposals.
         */
        displayVideo360AdvertiserLinkProposals?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListDisplayVideo360AdvertiserLinks RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse {
        /**
         * List of DisplayVideo360AdvertiserLinks.
         */
        displayVideo360AdvertiserLinks?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListEventCreateRules RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse {
        /**
         * List of EventCreateRules. These will be ordered stably, but in an arbitrary order.
         */
        eventCreateRules?: Schema$GoogleAnalyticsAdminV1alphaEventCreateRule[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListEventEditRules RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse {
        /**
         * List of EventEditRules. These will be ordered stably, but in an arbitrary order.
         */
        eventEditRules?: Schema$GoogleAnalyticsAdminV1alphaEventEditRule[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListExpandedDataSets RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse {
        /**
         * List of ExpandedDataSet. These will be ordered stably, but in an arbitrary order.
         */
        expandedDataSets?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListFirebaseLinks RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse {
        /**
         * List of FirebaseLinks. This will have at most one value.
         */
        firebaseLinks?: Schema$GoogleAnalyticsAdminV1alphaFirebaseLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. Currently, Google Analytics supports only one FirebaseLink per property, so this will never be populated.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListGoogleAdsLinks RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse {
        /**
         * List of GoogleAdsLinks.
         */
        googleAdsLinks?: Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListKeyEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse {
        /**
         * The requested Key Events
         */
        keyEvents?: Schema$GoogleAnalyticsAdminV1alphaKeyEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListMeasurementProtocolSecret RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse {
        /**
         * A list of secrets for the parent stream specified in the request.
         */
        measurementProtocolSecrets?: Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListProperties RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Results that matched the filter criteria and were accessible to the caller.
         */
        properties?: Schema$GoogleAnalyticsAdminV1alphaProperty[];
    }
    /**
     * Response message for ListReportingDataAnnotation RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of Reporting Data Annotations.
         */
        reportingDataAnnotations?: Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation[];
    }
    /**
     * Response message for ListRollupPropertySourceLinks RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of RollupPropertySourceLinks.
         */
        rollupPropertySourceLinks?: Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink[];
    }
    /**
     * Response message for ListSearchAds360Links RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of SearchAds360Links.
         */
        searchAds360Links?: Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link[];
    }
    /**
     * Response message for ListSKAdNetworkConversionValueSchemas RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. Currently, Google Analytics supports only one SKAdNetworkConversionValueSchema per dataStream, so this will never be populated.
         */
        nextPageToken?: string | null;
        /**
         * List of SKAdNetworkConversionValueSchemas. This will have at most one value.
         */
        skadnetworkConversionValueSchemas?: Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema[];
    }
    /**
     * Response message for ListSubpropertyEventFilter RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of subproperty event filters.
         */
        subpropertyEventFilters?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter[];
    }
    /**
     * Defines a condition for when an Event Edit or Event Creation rule applies to an event.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaMatchingCondition {
        /**
         * Required. The type of comparison to be applied to the value.
         */
        comparisonType?: string | null;
        /**
         * Required. The name of the field that is compared against for the condition. If 'event_name' is specified this condition will apply to the name of the event. Otherwise the condition will apply to a parameter with the specified name. This value cannot contain spaces.
         */
        field?: string | null;
        /**
         * Whether or not the result of the comparison should be negated. For example, if `negated` is true, then 'equals' comparisons would function as 'not equals'.
         */
        negated?: boolean | null;
        /**
         * Required. The value being compared against for this condition. The runtime implementation may perform type coercion of this value to evaluate this condition based on the type of the parameter value.
         */
        value?: string | null;
    }
    /**
     * A secret value used for sending hits to Measurement Protocol.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret {
        /**
         * Required. Human-readable display name for this secret.
         */
        displayName?: string | null;
        /**
         * Output only. Resource name of this secret. This secret may be a child of any type of stream. Format: properties/{property\}/dataStreams/{dataStream\}/measurementProtocolSecrets/{measurementProtocolSecret\}
         */
        name?: string | null;
        /**
         * Output only. The measurement protocol secret value. Pass this value to the api_secret field of the Measurement Protocol API when sending hits to this secret's parent property.
         */
        secretValue?: string | null;
    }
    /**
     * To represent a number.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaNumericValue {
        /**
         * Double value
         */
        doubleValue?: number | null;
        /**
         * Integer value
         */
        int64Value?: string | null;
    }
    /**
     * Defines an event parameter to mutate.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaParameterMutation {
        /**
         * Required. The name of the parameter to mutate. This value must: * be less than 40 characters. * be unique across across all mutations within the rule * consist only of letters, digits or _ (underscores) For event edit rules, the name may also be set to 'event_name' to modify the event_name in place.
         */
        parameter?: string | null;
        /**
         * Required. The value mutation to perform. * Must be less than 100 characters. * To specify a constant value for the param, use the value's string. * To copy value from another parameter, use syntax like "[[other_parameter]]" For more details, see this [help center article](https://support.google.com/analytics/answer/10085872#modify-an-event&zippy=%2Cin-this-article%2Cmodify-parameters).
         */
        parameterValue?: string | null;
    }
    /**
     * Settings for a SKAdNetwork conversion postback window.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaPostbackWindow {
        /**
         * Ordering of the repeated field will be used to prioritize the conversion value settings. Lower indexed entries are prioritized higher. The first conversion value setting that evaluates to true will be selected. It must have at least one entry if enable_postback_window_settings is set to true. It can have maximum of 128 entries.
         */
        conversionValues?: Schema$GoogleAnalyticsAdminV1alphaConversionValues[];
        /**
         * If enable_postback_window_settings is true, conversion_values must be populated and will be used for determining when and how to set the Conversion Value on a client device and exporting schema to linked Ads accounts. If false, the settings are not used, but are retained in case they may be used in the future. This must always be true for postback_window_one.
         */
        postbackWindowSettingsEnabled?: boolean | null;
    }
    /**
     * A resource message representing a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaProperty {
        /**
         * Immutable. The resource name of the parent account Format: accounts/{account_id\} Example: "accounts/123"
         */
        account?: string | null;
        /**
         * Output only. Time when the entity was originally created.
         */
        createTime?: string | null;
        /**
         * The currency type used in reports involving monetary values. Format: https://en.wikipedia.org/wiki/ISO_4217 Examples: "USD", "EUR", "JPY"
         */
        currencyCode?: string | null;
        /**
         * Output only. If set, the time at which this property was trashed. If not set, then this property is not currently in the trash can.
         */
        deleteTime?: string | null;
        /**
         * Required. Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units.
         */
        displayName?: string | null;
        /**
         * Output only. If set, the time at which this trashed property will be permanently deleted. If not set, then this property is not currently in the trash can and is not slated to be deleted.
         */
        expireTime?: string | null;
        /**
         * Industry associated with this property Example: AUTOMOTIVE, FOOD_AND_DRINK
         */
        industryCategory?: string | null;
        /**
         * Output only. Resource name of this property. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string | null;
        /**
         * Immutable. Resource name of this property's logical parent. Note: The Property-Moving UI can be used to change the parent. Format: accounts/{account\}, properties/{property\} Example: "accounts/100", "properties/101"
         */
        parent?: string | null;
        /**
         * Immutable. The property type for this Property resource. When creating a property, if the type is "PROPERTY_TYPE_UNSPECIFIED", then "ORDINARY_PROPERTY" will be implied.
         */
        propertyType?: string | null;
        /**
         * Output only. The Google Analytics service level that applies to this property.
         */
        serviceLevel?: string | null;
        /**
         * Required. Reporting Time Zone, used as the day boundary for reports, regardless of where the data originates. If the time zone honors DST, Analytics will automatically adjust for the changes. NOTE: Changing the time zone only affects data going forward, and is not applied retroactively. Format: https://www.iana.org/time-zones Example: "America/Los_Angeles"
         */
        timeZone?: string | null;
        /**
         * Output only. Time when entity payload fields were last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A virtual resource representing metadata for a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaPropertySummary {
        /**
         * Display name for the property referred to in this property summary.
         */
        displayName?: string | null;
        /**
         * Resource name of this property's logical parent. Note: The Property-Moving UI can be used to change the parent. Format: accounts/{account\}, properties/{property\} Example: "accounts/100", "properties/200"
         */
        parent?: string | null;
        /**
         * Resource name of property referred to by this property summary Format: properties/{property_id\} Example: "properties/1000"
         */
        property?: string | null;
        /**
         * The property's property type.
         */
        propertyType?: string | null;
    }
    /**
     * Request message for ProvisionAccountTicket RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketRequest {
        /**
         * The account to create.
         */
        account?: Schema$GoogleAnalyticsAdminV1alphaAccount;
        /**
         * Redirect URI where the user will be sent after accepting Terms of Service. Must be configured in Cloud Console as a Redirect URI.
         */
        redirectUri?: string | null;
    }
    /**
     * Response message for ProvisionAccountTicket RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse {
        /**
         * The param to be passed in the ToS link.
         */
        accountTicketId?: string | null;
    }
    /**
     * Request message for CreateSubproperty RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyRequest {
        /**
         * Required. The subproperty to create.
         */
        subproperty?: Schema$GoogleAnalyticsAdminV1alphaProperty;
        /**
         * Optional. The subproperty event filter to create on an ordinary property.
         */
        subpropertyEventFilter?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter;
    }
    /**
     * Response message for ProvisionSubproperty RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse {
        /**
         * The created subproperty.
         */
        subproperty?: Schema$GoogleAnalyticsAdminV1alphaProperty;
        /**
         * The created subproperty event filter.
         */
        subpropertyEventFilter?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter;
    }
    /**
     * Request message for ReorderEventEditRules RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaReorderEventEditRulesRequest {
        /**
         * Required. EventEditRule resource names for the specified data stream, in the needed processing order. All EventEditRules for the stream must be present in the list.
         */
        eventEditRules?: string[] | null;
    }
    /**
     * A Reporting Data Annotation is a comment connected to certain dates for reporting data.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation {
        /**
         * If set, the Reporting Data Annotation is for a specific date represented by this field. The date must be a valid date with year, month and day set. The date may be in the past, present, or future.
         */
        annotationDate?: Schema$GoogleTypeDate;
        /**
         * If set, the Reporting Data Annotation is for a range of dates represented by this field.
         */
        annotationDateRange?: Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotationDateRange;
        /**
         * Required. The color used for display of this Reporting Data Annotation.
         */
        color?: string | null;
        /**
         * Optional. Description for this Reporting Data Annotation.
         */
        description?: string | null;
        /**
         * Required. Identifier. Resource name of this Reporting Data Annotation. Format: 'properties/{property_id\}/reportingDataAnnotations/{reporting_data_annotation\}' Format: 'properties/123/reportingDataAnnotations/456'
         */
        name?: string | null;
        /**
         * Output only. If true, this annotation was generated by the Google Analytics system. System-generated annotations cannot be updated or deleted.
         */
        systemGenerated?: boolean | null;
        /**
         * Required. Human-readable title for this Reporting Data Annotation.
         */
        title?: string | null;
    }
    /**
     * Represents a Reporting Data Annotation's date range, both start and end dates are inclusive. Time zones are based on the parent property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotationDateRange {
        /**
         * Required. The end date for this range. Must be a valid date with year, month, and day set. This date must be greater than or equal to the start date.
         */
        endDate?: Schema$GoogleTypeDate;
        /**
         * Required. The start date for this range. Must be a valid date with year, month, and day set. The date may be in the past, present, or future.
         */
        startDate?: Schema$GoogleTypeDate;
    }
    /**
     * A link that references a source property under the parent rollup property.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink {
        /**
         * Output only. Resource name of this RollupPropertySourceLink. Format: 'properties/{property_id\}/rollupPropertySourceLinks/{rollup_property_source_link\}' Format: 'properties/123/rollupPropertySourceLinks/456'
         */
        name?: string | null;
        /**
         * Immutable. Resource name of the source property. Format: properties/{property_id\} Example: "properties/789"
         */
        sourceProperty?: string | null;
    }
    /**
     * The request for a Data Access Record Report.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaRunAccessReportRequest {
        /**
         * Date ranges of access records to read. If multiple date ranges are requested, each response row will contain a zero based date range index. If two date ranges overlap, the access records for the overlapping days is included in the response rows for both date ranges. Requests are allowed up to 2 date ranges.
         */
        dateRanges?: Schema$GoogleAnalyticsAdminV1alphaAccessDateRange[];
        /**
         * Dimension filters let you restrict report response to specific dimension values which match the filter. For example, filtering on access records of a single user. To learn more, see [Fundamentals of Dimension Filters](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#dimension_filters) for examples. Metrics cannot be used in this filter.
         */
        dimensionFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpression;
        /**
         * The dimensions requested and displayed in the response. Requests are allowed up to 9 dimensions.
         */
        dimensions?: Schema$GoogleAnalyticsAdminV1alphaAccessDimension[];
        /**
         * Optional. Decides whether to return the users within user groups. This field works only when include_all_users is set to true. If true, it will return all users with access to the specified property or account. If false, only the users with direct access will be returned.
         */
        expandGroups?: boolean | null;
        /**
         * Optional. Determines whether to include users who have never made an API call in the response. If true, all users with access to the specified property or account are included in the response, regardless of whether they have made an API call or not. If false, only the users who have made an API call will be included.
         */
        includeAllUsers?: boolean | null;
        /**
         * The number of rows to return. If unspecified, 10,000 rows are returned. The API returns a maximum of 100,000 rows per request, no matter how many you ask for. `limit` must be positive. The API may return fewer rows than the requested `limit`, if there aren't as many remaining rows as the `limit`. For instance, there are fewer than 300 possible values for the dimension `country`, so when reporting on only `country`, you can't get more than 300 rows, even if you set `limit` to a higher value. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        limit?: string | null;
        /**
         * Metric filters allow you to restrict report response to specific metric values which match the filter. Metric filters are applied after aggregating the report's rows, similar to SQL having-clause. Dimensions cannot be used in this filter.
         */
        metricFilter?: Schema$GoogleAnalyticsAdminV1alphaAccessFilterExpression;
        /**
         * The metrics requested and displayed in the response. Requests are allowed up to 10 metrics.
         */
        metrics?: Schema$GoogleAnalyticsAdminV1alphaAccessMetric[];
        /**
         * The row count of the start row. The first row is counted as row 0. If offset is unspecified, it is treated as 0. If offset is zero, then this method will return the first page of results with `limit` entries. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        offset?: string | null;
        /**
         * Specifies how rows are ordered in the response.
         */
        orderBys?: Schema$GoogleAnalyticsAdminV1alphaAccessOrderBy[];
        /**
         * Toggles whether to return the current state of this Analytics Property's quota. Quota is returned in [AccessQuota](#AccessQuota). For account-level requests, this field must be false.
         */
        returnEntityQuota?: boolean | null;
        /**
         * This request's time zone if specified. If unspecified, the property's time zone is used. The request's time zone is used to interpret the start & end dates of the report. Formatted as strings from the IANA Time Zone database (https://www.iana.org/time-zones); for example "America/New_York" or "Asia/Tokyo".
         */
        timeZone?: string | null;
    }
    /**
     * The customized Data Access Record Report response.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse {
        /**
         * The header for a column in the report that corresponds to a specific dimension. The number of DimensionHeaders and ordering of DimensionHeaders matches the dimensions present in rows.
         */
        dimensionHeaders?: Schema$GoogleAnalyticsAdminV1alphaAccessDimensionHeader[];
        /**
         * The header for a column in the report that corresponds to a specific metric. The number of MetricHeaders and ordering of MetricHeaders matches the metrics present in rows.
         */
        metricHeaders?: Schema$GoogleAnalyticsAdminV1alphaAccessMetricHeader[];
        /**
         * The quota state for this Analytics property including this request. This field doesn't work with account-level requests.
         */
        quota?: Schema$GoogleAnalyticsAdminV1alphaAccessQuota;
        /**
         * The total number of rows in the query result. `rowCount` is independent of the number of rows returned in the response, the `limit` request parameter, and the `offset` request parameter. For example if a query returns 175 rows and includes `limit` of 50 in the API request, the response will contain `rowCount` of 175 but only 50 rows. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        rowCount?: number | null;
        /**
         * Rows of dimension value combinations and metric values in the report.
         */
        rows?: Schema$GoogleAnalyticsAdminV1alphaAccessRow[];
    }
    /**
     * A link between a Google Analytics property and a Search Ads 360 entity.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link {
        /**
         * Enables personalized advertising features with this integration. If this field is not set on create, it will be defaulted to true.
         */
        adsPersonalizationEnabled?: boolean | null;
        /**
         * Output only. The display name of the Search Ads 360 Advertiser. Allows users to easily identify the linked resource.
         */
        advertiserDisplayName?: string | null;
        /**
         * Immutable. This field represents the Advertiser ID of the Search Ads 360 Advertiser. that has been linked.
         */
        advertiserId?: string | null;
        /**
         * Immutable. Enables the import of campaign data from Search Ads 360 into the Google Analytics property. After link creation, this can only be updated from the Search Ads 360 product. If this field is not set on create, it will be defaulted to true.
         */
        campaignDataSharingEnabled?: boolean | null;
        /**
         * Immutable. Enables the import of cost data from Search Ads 360 to the Google Analytics property. This can only be enabled if campaign_data_sharing_enabled is enabled. After link creation, this can only be updated from the Search Ads 360 product. If this field is not set on create, it will be defaulted to true.
         */
        costDataSharingEnabled?: boolean | null;
        /**
         * Output only. The resource name for this SearchAds360Link resource. Format: properties/{propertyId\}/searchAds360Links/{linkId\} Note: linkId is not the Search Ads 360 advertiser ID
         */
        name?: string | null;
        /**
         * Enables export of site stats with this integration. If this field is not set on create, it will be defaulted to true.
         */
        siteStatsSharingEnabled?: boolean | null;
    }
    /**
     * Request message for SearchChangeHistoryEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsRequest {
        /**
         * Optional. If set, only return changes that match one or more of these types of actions.
         */
        action?: string[] | null;
        /**
         * Optional. If set, only return changes if they are made by a user in this list.
         */
        actorEmail?: string[] | null;
        /**
         * Optional. If set, only return changes made after this time (inclusive).
         */
        earliestChangeTime?: string | null;
        /**
         * Optional. If set, only return changes made before this time (inclusive).
         */
        latestChangeTime?: string | null;
        /**
         * Optional. The maximum number of ChangeHistoryEvent items to return. If unspecified, at most 50 items will be returned. The maximum value is 200 (higher values will be coerced to the maximum). Note that the service may return a page with fewer items than this value specifies (potentially even zero), and that there still may be additional pages. If you want a particular number of items, you'll need to continue requesting additional pages using `page_token` until you get the needed number.
         */
        pageSize?: number | null;
        /**
         * Optional. A page token, received from a previous `SearchChangeHistoryEvents` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `SearchChangeHistoryEvents` must match the call that provided the page token.
         */
        pageToken?: string | null;
        /**
         * Optional. Resource name for a child property. If set, only return changes made to this property or its child resources. Format: properties/{propertyId\} Example: `properties/100`
         */
        property?: string | null;
        /**
         * Optional. If set, only return changes if they are for a resource that matches at least one of these types.
         */
        resourceType?: string[] | null;
    }
    /**
     * Response message for SearchAccounts RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse {
        /**
         * Results that were accessible to the caller.
         */
        changeHistoryEvents?: Schema$GoogleAnalyticsAdminV1alphaChangeHistoryEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Request for setting the opt out status for the automated GA4 setup process.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutRequest {
        /**
         * The status to set.
         */
        optOut?: boolean | null;
        /**
         * Required. The UA property to set the opt out status. Note this request uses the internal property ID, not the tracking ID of the form UA-XXXXXX-YY. Format: properties/{internalWebPropertyId\} Example: properties/1234
         */
        property?: string | null;
    }
    /**
     * Response message for setting the opt out status for the automated GA4 setup process.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse {
    }
    /**
     * SKAdNetwork conversion value schema of an iOS stream.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema {
        /**
         * If enabled, the GA SDK will set conversion values using this schema definition, and schema will be exported to any Google Ads accounts linked to this property. If disabled, the GA SDK will not automatically set conversion values, and also the schema will not be exported to Ads.
         */
        applyConversionValues?: boolean | null;
        /**
         * Output only. Resource name of the schema. This will be child of ONLY an iOS stream, and there can be at most one such child under an iOS stream. Format: properties/{property\}/dataStreams/{dataStream\}/sKAdNetworkConversionValueSchema
         */
        name?: string | null;
        /**
         * Required. The conversion value settings for the first postback window. These differ from values for postback window two and three in that they contain a "Fine" grained conversion value (a numeric value). Conversion values for this postback window must be set. The other windows are optional and may inherit this window's settings if unset or disabled.
         */
        postbackWindowOne?: Schema$GoogleAnalyticsAdminV1alphaPostbackWindow;
        /**
         * The conversion value settings for the third postback window. This field should only be set if the user chose to define different conversion values for this postback window. It is allowed to configure window 3 without setting window 2. In case window 1 & 2 settings are set and enable_postback_window_settings for this postback window is set to false, the schema will inherit settings from postback_window_two.
         */
        postbackWindowThree?: Schema$GoogleAnalyticsAdminV1alphaPostbackWindow;
        /**
         * The conversion value settings for the second postback window. This field should only be configured if there is a need to define different conversion values for this postback window. If enable_postback_window_settings is set to false for this postback window, the values from postback_window_one will be used.
         */
        postbackWindowTwo?: Schema$GoogleAnalyticsAdminV1alphaPostbackWindow;
    }
    /**
     * A resource message representing a Google Analytics subproperty event filter.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter {
        /**
         * Immutable. Resource name of the Subproperty that uses this filter.
         */
        applyToProperty?: string | null;
        /**
         * Required. Unordered list. Filter clauses that define the SubpropertyEventFilter. All clauses are AND'ed together to determine what data is sent to the subproperty.
         */
        filterClauses?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterClause[];
        /**
         * Output only. Format: properties/{ordinary_property_id\}/subpropertyEventFilters/{sub_property_event_filter\} Example: properties/1234/subpropertyEventFilters/5678
         */
        name?: string | null;
    }
    /**
     * A clause for defining a filter. A filter may be inclusive (events satisfying the filter clause are included in the subproperty's data) or exclusive (events satisfying the filter clause are excluded from the subproperty's data).
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterClause {
        /**
         * Required. The type for the filter clause.
         */
        filterClauseType?: string | null;
        /**
         * Required. The logical expression for what events are sent to the subproperty.
         */
        filterExpression?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpression;
    }
    /**
     * A specific filter expression
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterCondition {
        /**
         * Required. The field that is being filtered.
         */
        fieldName?: string | null;
        /**
         * A filter for null values.
         */
        nullFilter?: boolean | null;
        /**
         * A filter for a string-type dimension that matches a particular pattern.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterConditionStringFilter;
    }
    /**
     * A filter for a string-type dimension that matches a particular pattern.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterConditionStringFilter {
        /**
         * Optional. If true, the string value is case sensitive. If false, the match is case-insensitive.
         */
        caseSensitive?: boolean | null;
        /**
         * Required. The match type for the string filter.
         */
        matchType?: string | null;
        /**
         * Required. The string value used for the matching.
         */
        value?: string | null;
    }
    /**
     * A logical expression of Subproperty event filters.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpression {
        /**
         * Creates a filter that matches a specific event. This cannot be set on the top level SubpropertyEventFilterExpression.
         */
        filterCondition?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterCondition;
        /**
         * A filter expression to be NOT'ed (inverted, complemented). It can only include a filter. This cannot be set on the top level SubpropertyEventFilterExpression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpression;
        /**
         * A list of expressions to OR’ed together. Must only contain not_expression or filter_condition expressions.
         */
        orGroup?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpressionList;
    }
    /**
     * A list of Subproperty event filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpressionList {
        /**
         * Required. Unordered list. A list of Subproperty event filter expressions
         */
        filterExpressions?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilterExpression[];
    }
    /**
     * Request message for UpdateAccessBinding RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1alphaUpdateAccessBindingRequest {
        /**
         * Required. The access binding to update.
         */
        accessBinding?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$GoogleTypeDate {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        day?: number | null;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        month?: number | null;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        year?: number | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        accessBindings: Resource$Accounts$Accessbindings;
        constructor(context: APIRequestContext);
        /**
         * Marks target Account as soft-deleted (ie: "trashed") and returns it. This API does not have a method to restore soft-deleted accounts. However, they can be restored using the Trash Can UI. If the accounts are not restored before the expiration time, the account and all child resources (eg: Properties, GoogleAdsLinks, Streams, AccessBindings) will be permanently purged. https://support.google.com/analytics/answer/6154772 Returns an error if the target is not found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single Account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccount>>;
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        get(params: Params$Resource$Accounts$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        /**
         * Get data sharing settings on an account. Data sharing settings are singletons.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDataSharingSettings(params?: Params$Resource$Accounts$Getdatasharingsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings>>;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings>): void;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings>): void;
        getDataSharingSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataSharingSettings>): void;
        /**
         * Returns all accounts accessible by the caller. Note that these accounts might not currently have GA properties. Soft-deleted (ie: "trashed") accounts are excluded by default. Returns an empty list if no relevant accounts are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse>>;
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse>): void;
        list(params: Params$Resource$Accounts$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountsResponse>): void;
        /**
         * Updates an account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccount>>;
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        patch(params: Params$Resource$Accounts$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccount>): void;
        /**
         * Requests a ticket for creating an account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        provisionAccountTicket(params?: Params$Resource$Accounts$Provisionaccountticket, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse>>;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse>): void;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse>): void;
        provisionAccountTicket(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketResponse>): void;
        /**
         * Returns a customized report of data access records. The report provides records of each time a user reads Google Analytics reporting data. Access records are retained for up to 2 years. Data Access Reports can be requested for a property. Reports may be requested for any property, but dimensions that aren't related to quota can only be requested on Google Analytics 360 properties. This method is only available to Administrators. These data access records include GA UI Reporting, GA UI Explorations, GA Data API, and other products like Firebase & Admob that can retrieve data from Google Analytics through a linkage. These records don't include property configuration changes like adding a stream or changing a property's time zone. For configuration change history, see [searchChangeHistoryEvents](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/accounts/searchChangeHistoryEvents). To give your feedback on this API, complete the [Google Analytics Access Reports feedback](https://docs.google.com/forms/d/e/1FAIpQLSdmEBUrMzAEdiEKk5TV5dEHvDUZDRlgWYdQdAeSdtR4hVjEhw/viewform) form.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runAccessReport(params?: Params$Resource$Accounts$Runaccessreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>>;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        runAccessReport(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        /**
         * Searches through all changes to an account or its children given the specified set of filters. Only returns the subset of changes supported by the API. The UI may return additional changes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchChangeHistoryEvents(params?: Params$Resource$Accounts$Searchchangehistoryevents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse>>;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse>): void;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse>): void;
        searchChangeHistoryEvents(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsResponse>): void;
    }
    export interface Params$Resource$Accounts$Delete extends StandardParameters {
        /**
         * Required. The name of the Account to soft-delete. Format: accounts/{account\} Example: "accounts/100"
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Get extends StandardParameters {
        /**
         * Required. The name of the account to lookup. Format: accounts/{account\} Example: "accounts/100"
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Getdatasharingsettings extends StandardParameters {
        /**
         * Required. The name of the settings to lookup. Format: accounts/{account\}/dataSharingSettings Example: `accounts/1000/dataSharingSettings`
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$List extends StandardParameters {
        /**
         * The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAccounts` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAccounts` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Whether to include soft-deleted (ie: "trashed") Accounts in the results. Accounts can be inspected to determine whether they are deleted or not.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Accounts$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this account. Format: accounts/{account\} Example: "accounts/100"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (for example, "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAccount;
    }
    export interface Params$Resource$Accounts$Provisionaccountticket extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaProvisionAccountTicketRequest;
    }
    export interface Params$Resource$Accounts$Runaccessreport extends StandardParameters {
        /**
         * The Data Access Report supports requesting at the property level or account level. If requested at the account level, Data Access Reports include all access for all properties under that account. To request at the property level, entity should be for example 'properties/123' if "123" is your Google Analytics property ID. To request at the account level, entity should be for example 'accounts/1234' if "1234" is your Google Analytics Account ID.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaRunAccessReportRequest;
    }
    export interface Params$Resource$Accounts$Searchchangehistoryevents extends StandardParameters {
        /**
         * Required. The account resource for which to return change history resources. Format: accounts/{account\} Example: `accounts/100`
         */
        account?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSearchChangeHistoryEventsRequest;
    }
    export class Resource$Accounts$Accessbindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates information about multiple access bindings to an account or property. This method is transactional. If any AccessBinding cannot be created, none of the AccessBindings will be created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchCreate(params: Params$Resource$Accounts$Accessbindings$Batchcreate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchCreate(params?: Params$Resource$Accounts$Accessbindings$Batchcreate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>>;
        batchCreate(params: Params$Resource$Accounts$Accessbindings$Batchcreate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchCreate(params: Params$Resource$Accounts$Accessbindings$Batchcreate, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        batchCreate(params: Params$Resource$Accounts$Accessbindings$Batchcreate, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        batchCreate(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        /**
         * Deletes information about multiple users' links to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchDelete(params: Params$Resource$Accounts$Accessbindings$Batchdelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchDelete(params?: Params$Resource$Accounts$Accessbindings$Batchdelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        batchDelete(params: Params$Resource$Accounts$Accessbindings$Batchdelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchDelete(params: Params$Resource$Accounts$Accessbindings$Batchdelete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(params: Params$Resource$Accounts$Accessbindings$Batchdelete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about multiple access bindings to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchGet(params: Params$Resource$Accounts$Accessbindings$Batchget, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchGet(params?: Params$Resource$Accounts$Accessbindings$Batchget, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>>;
        batchGet(params: Params$Resource$Accounts$Accessbindings$Batchget, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchGet(params: Params$Resource$Accounts$Accessbindings$Batchget, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        batchGet(params: Params$Resource$Accounts$Accessbindings$Batchget, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        batchGet(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        /**
         * Updates information about multiple access bindings to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchUpdate(params: Params$Resource$Accounts$Accessbindings$Batchupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchUpdate(params?: Params$Resource$Accounts$Accessbindings$Batchupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>>;
        batchUpdate(params: Params$Resource$Accounts$Accessbindings$Batchupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchUpdate(params: Params$Resource$Accounts$Accessbindings$Batchupdate, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        batchUpdate(params: Params$Resource$Accounts$Accessbindings$Batchupdate, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        batchUpdate(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        /**
         * Creates an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Accessbindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Accessbindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        create(params: Params$Resource$Accounts$Accessbindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Accessbindings$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        create(params: Params$Resource$Accounts$Accessbindings$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        /**
         * Deletes an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Accessbindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Accessbindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Accessbindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Accessbindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Accessbindings$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about an access binding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Accessbindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Accessbindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        get(params: Params$Resource$Accounts$Accessbindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Accessbindings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        get(params: Params$Resource$Accounts$Accessbindings$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        /**
         * Lists all access bindings on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Accessbindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Accessbindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>>;
        list(params: Params$Resource$Accounts$Accessbindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Accessbindings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        list(params: Params$Resource$Accounts$Accessbindings$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        /**
         * Updates an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Accessbindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Accessbindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        patch(params: Params$Resource$Accounts$Accessbindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Accessbindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        patch(params: Params$Resource$Accounts$Accessbindings$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
    }
    export interface Params$Resource$Accounts$Accessbindings$Batchcreate extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent field in the CreateAccessBindingRequest messages must either be empty or match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsRequest;
    }
    export interface Params$Resource$Accounts$Accessbindings$Batchdelete extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided values for the 'names' field in DeleteAccessBindingRequest messages must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchDeleteAccessBindingsRequest;
    }
    export interface Params$Resource$Accounts$Accessbindings$Batchget extends StandardParameters {
        /**
         * Required. The names of the access bindings to retrieve. A maximum of 1000 access bindings can be retrieved in a batch. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        names?: string[];
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided values for the 'names' field must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Accessbindings$Batchupdate extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided AccessBinding in UpdateAccessBindingRequest messages must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsRequest;
    }
    export interface Params$Resource$Accounts$Accessbindings$Create extends StandardParameters {
        /**
         * Required. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
    }
    export interface Params$Resource$Accounts$Accessbindings$Delete extends StandardParameters {
        /**
         * Required. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Accessbindings$Get extends StandardParameters {
        /**
         * Required. The name of the access binding to retrieve. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Accessbindings$List extends StandardParameters {
        /**
         * The maximum number of access bindings to return. The service may return fewer than this value. If unspecified, at most 200 access bindings will be returned. The maximum value is 500; values above 500 will be coerced to 500.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAccessBindings` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAccessBindings` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Accessbindings$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this binding. Format: accounts/{account\}/accessBindings/{access_binding\} or properties/{property\}/accessBindings/{access_binding\} Example: "accounts/100/accessBindings/200"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
    }
    export class Resource$Accountsummaries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns summaries of all accounts accessible by the caller.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accountsummaries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accountsummaries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse>>;
        list(params: Params$Resource$Accountsummaries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accountsummaries$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse>): void;
        list(params: Params$Resource$Accountsummaries$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccountSummariesResponse>): void;
    }
    export interface Params$Resource$Accountsummaries$List extends StandardParameters {
        /**
         * The maximum number of AccountSummary resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAccountSummaries` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAccountSummaries` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export class Resource$Properties {
        context: APIRequestContext;
        accessBindings: Resource$Properties$Accessbindings;
        adSenseLinks: Resource$Properties$Adsenselinks;
        audiences: Resource$Properties$Audiences;
        bigQueryLinks: Resource$Properties$Bigquerylinks;
        calculatedMetrics: Resource$Properties$Calculatedmetrics;
        channelGroups: Resource$Properties$Channelgroups;
        conversionEvents: Resource$Properties$Conversionevents;
        customDimensions: Resource$Properties$Customdimensions;
        customMetrics: Resource$Properties$Custommetrics;
        dataStreams: Resource$Properties$Datastreams;
        displayVideo360AdvertiserLinkProposals: Resource$Properties$Displayvideo360advertiserlinkproposals;
        displayVideo360AdvertiserLinks: Resource$Properties$Displayvideo360advertiserlinks;
        expandedDataSets: Resource$Properties$Expandeddatasets;
        firebaseLinks: Resource$Properties$Firebaselinks;
        googleAdsLinks: Resource$Properties$Googleadslinks;
        keyEvents: Resource$Properties$Keyevents;
        reportingDataAnnotations: Resource$Properties$Reportingdataannotations;
        rollupPropertySourceLinks: Resource$Properties$Rolluppropertysourcelinks;
        searchAds360Links: Resource$Properties$Searchads360links;
        subpropertyEventFilters: Resource$Properties$Subpropertyeventfilters;
        constructor(context: APIRequestContext);
        /**
         * Acknowledges the terms of user data collection for the specified property. This acknowledgement must be completed (either in the Google Analytics UI or through this API) before MeasurementProtocolSecret resources may be created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        acknowledgeUserDataCollection(params?: Params$Resource$Properties$Acknowledgeuserdatacollection, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse>>;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse>): void;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse>): void;
        acknowledgeUserDataCollection(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionResponse>): void;
        /**
         * Creates a Google Analytics property with the specified location and attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProperty>>;
        create(params: Params$Resource$Properties$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        create(params: Params$Resource$Properties$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        /**
         * Creates a connected site tag for a Universal Analytics property. You can create a maximum of 20 connected site tags per property. Note: This API cannot be used on GA4 properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createConnectedSiteTag(params: Params$Resource$Properties$Createconnectedsitetag, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createConnectedSiteTag(params?: Params$Resource$Properties$Createconnectedsitetag, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse>>;
        createConnectedSiteTag(params: Params$Resource$Properties$Createconnectedsitetag, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createConnectedSiteTag(params: Params$Resource$Properties$Createconnectedsitetag, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse>): void;
        createConnectedSiteTag(params: Params$Resource$Properties$Createconnectedsitetag, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse>): void;
        createConnectedSiteTag(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagResponse>): void;
        /**
         * Create a roll-up property and all roll-up property source links.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createRollupProperty(params: Params$Resource$Properties$Createrollupproperty, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createRollupProperty(params?: Params$Resource$Properties$Createrollupproperty, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse>>;
        createRollupProperty(params: Params$Resource$Properties$Createrollupproperty, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createRollupProperty(params: Params$Resource$Properties$Createrollupproperty, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse>): void;
        createRollupProperty(params: Params$Resource$Properties$Createrollupproperty, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse>): void;
        createRollupProperty(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyResponse>): void;
        /**
         * Marks target Property as soft-deleted (ie: "trashed") and returns it. This API does not have a method to restore soft-deleted properties. However, they can be restored using the Trash Can UI. If the properties are not restored before the expiration time, the Property and all child resources (eg: GoogleAdsLinks, Streams, AccessBindings) will be permanently purged. https://support.google.com/analytics/answer/6154772 Returns an error if the target is not found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProperty>>;
        delete(params: Params$Resource$Properties$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        delete(params: Params$Resource$Properties$Delete, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        /**
         * Deletes a connected site tag for a Universal Analytics property. Note: this has no effect on GA4 properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deleteConnectedSiteTag(params: Params$Resource$Properties$Deleteconnectedsitetag, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteConnectedSiteTag(params?: Params$Resource$Properties$Deleteconnectedsitetag, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        deleteConnectedSiteTag(params: Params$Resource$Properties$Deleteconnectedsitetag, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteConnectedSiteTag(params: Params$Resource$Properties$Deleteconnectedsitetag, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        deleteConnectedSiteTag(params: Params$Resource$Properties$Deleteconnectedsitetag, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        deleteConnectedSiteTag(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Fetches the opt out status for the automated GA4 setup process for a UA property. Note: this has no effect on GA4 property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Fetchautomatedga4configurationoptout, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchAutomatedGa4ConfigurationOptOut(params?: Params$Resource$Properties$Fetchautomatedga4configurationoptout, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse>>;
        fetchAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Fetchautomatedga4configurationoptout, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Fetchautomatedga4configurationoptout, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse>): void;
        fetchAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Fetchautomatedga4configurationoptout, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse>): void;
        fetchAutomatedGa4ConfigurationOptOut(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutResponse>): void;
        /**
         * Given a specified UA property, looks up the GA4 property connected to it. Note: this cannot be used with GA4 properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchConnectedGa4Property(params: Params$Resource$Properties$Fetchconnectedga4property, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchConnectedGa4Property(params?: Params$Resource$Properties$Fetchconnectedga4property, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse>>;
        fetchConnectedGa4Property(params: Params$Resource$Properties$Fetchconnectedga4property, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchConnectedGa4Property(params: Params$Resource$Properties$Fetchconnectedga4property, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse>): void;
        fetchConnectedGa4Property(params: Params$Resource$Properties$Fetchconnectedga4property, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse>): void;
        fetchConnectedGa4Property(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFetchConnectedGa4PropertyResponse>): void;
        /**
         * Lookup for a single GA Property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProperty>>;
        get(params: Params$Resource$Properties$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        get(params: Params$Resource$Properties$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        /**
         * Lookup for a AttributionSettings singleton.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getAttributionSettings(params: Params$Resource$Properties$Getattributionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAttributionSettings(params?: Params$Resource$Properties$Getattributionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>>;
        getAttributionSettings(params: Params$Resource$Properties$Getattributionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAttributionSettings(params: Params$Resource$Properties$Getattributionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        getAttributionSettings(params: Params$Resource$Properties$Getattributionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        getAttributionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        /**
         * Returns the singleton data retention settings for this property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDataRetentionSettings(params?: Params$Resource$Properties$Getdataretentionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>>;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        getDataRetentionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        /**
         * Lookup for Google Signals settings for a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getGoogleSignalsSettings(params: Params$Resource$Properties$Getgooglesignalssettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getGoogleSignalsSettings(params?: Params$Resource$Properties$Getgooglesignalssettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>>;
        getGoogleSignalsSettings(params: Params$Resource$Properties$Getgooglesignalssettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getGoogleSignalsSettings(params: Params$Resource$Properties$Getgooglesignalssettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
        getGoogleSignalsSettings(params: Params$Resource$Properties$Getgooglesignalssettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
        getGoogleSignalsSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
        /**
         * Returns child Properties under the specified parent Account. Properties will be excluded if the caller does not have access. Soft-deleted (ie: "trashed") properties are excluded by default. Returns an empty list if no relevant properties are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse>>;
        list(params: Params$Resource$Properties$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse>): void;
        list(params: Params$Resource$Properties$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListPropertiesResponse>): void;
        /**
         * Lists the connected site tags for a Universal Analytics property. A maximum of 20 connected site tags will be returned. Note: this has no effect on GA4 property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listConnectedSiteTags(params: Params$Resource$Properties$Listconnectedsitetags, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listConnectedSiteTags(params?: Params$Resource$Properties$Listconnectedsitetags, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse>>;
        listConnectedSiteTags(params: Params$Resource$Properties$Listconnectedsitetags, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listConnectedSiteTags(params: Params$Resource$Properties$Listconnectedsitetags, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse>): void;
        listConnectedSiteTags(params: Params$Resource$Properties$Listconnectedsitetags, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse>): void;
        listConnectedSiteTags(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsResponse>): void;
        /**
         * Updates a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProperty>>;
        patch(params: Params$Resource$Properties$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        patch(params: Params$Resource$Properties$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProperty>): void;
        /**
         * Create a subproperty and a subproperty event filter that applies to the created subproperty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        provisionSubproperty(params: Params$Resource$Properties$Provisionsubproperty, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        provisionSubproperty(params?: Params$Resource$Properties$Provisionsubproperty, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse>>;
        provisionSubproperty(params: Params$Resource$Properties$Provisionsubproperty, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        provisionSubproperty(params: Params$Resource$Properties$Provisionsubproperty, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse>): void;
        provisionSubproperty(params: Params$Resource$Properties$Provisionsubproperty, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse>): void;
        provisionSubproperty(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyResponse>): void;
        /**
         * Returns a customized report of data access records. The report provides records of each time a user reads Google Analytics reporting data. Access records are retained for up to 2 years. Data Access Reports can be requested for a property. Reports may be requested for any property, but dimensions that aren't related to quota can only be requested on Google Analytics 360 properties. This method is only available to Administrators. These data access records include GA UI Reporting, GA UI Explorations, GA Data API, and other products like Firebase & Admob that can retrieve data from Google Analytics through a linkage. These records don't include property configuration changes like adding a stream or changing a property's time zone. For configuration change history, see [searchChangeHistoryEvents](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/accounts/searchChangeHistoryEvents). To give your feedback on this API, complete the [Google Analytics Access Reports feedback](https://docs.google.com/forms/d/e/1FAIpQLSdmEBUrMzAEdiEKk5TV5dEHvDUZDRlgWYdQdAeSdtR4hVjEhw/viewform) form.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runAccessReport(params?: Params$Resource$Properties$Runaccessreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>>;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        runAccessReport(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRunAccessReportResponse>): void;
        /**
         * Sets the opt out status for the automated GA4 setup process for a UA property. Note: this has no effect on GA4 property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Setautomatedga4configurationoptout, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAutomatedGa4ConfigurationOptOut(params?: Params$Resource$Properties$Setautomatedga4configurationoptout, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse>>;
        setAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Setautomatedga4configurationoptout, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Setautomatedga4configurationoptout, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse>): void;
        setAutomatedGa4ConfigurationOptOut(params: Params$Resource$Properties$Setautomatedga4configurationoptout, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse>): void;
        setAutomatedGa4ConfigurationOptOut(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutResponse>): void;
        /**
         * Updates attribution settings on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateAttributionSettings(params: Params$Resource$Properties$Updateattributionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAttributionSettings(params?: Params$Resource$Properties$Updateattributionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>>;
        updateAttributionSettings(params: Params$Resource$Properties$Updateattributionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAttributionSettings(params: Params$Resource$Properties$Updateattributionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        updateAttributionSettings(params: Params$Resource$Properties$Updateattributionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        updateAttributionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAttributionSettings>): void;
        /**
         * Updates the singleton data retention settings for this property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateDataRetentionSettings(params?: Params$Resource$Properties$Updatedataretentionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>>;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        updateDataRetentionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings>): void;
        /**
         * Updates Google Signals settings for a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateGoogleSignalsSettings(params: Params$Resource$Properties$Updategooglesignalssettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateGoogleSignalsSettings(params?: Params$Resource$Properties$Updategooglesignalssettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>>;
        updateGoogleSignalsSettings(params: Params$Resource$Properties$Updategooglesignalssettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateGoogleSignalsSettings(params: Params$Resource$Properties$Updategooglesignalssettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
        updateGoogleSignalsSettings(params: Params$Resource$Properties$Updategooglesignalssettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
        updateGoogleSignalsSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings>): void;
    }
    export interface Params$Resource$Properties$Acknowledgeuserdatacollection extends StandardParameters {
        /**
         * Required. The property for which to acknowledge user data collection.
         */
        property?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAcknowledgeUserDataCollectionRequest;
    }
    export interface Params$Resource$Properties$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaProperty;
    }
    export interface Params$Resource$Properties$Createconnectedsitetag extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCreateConnectedSiteTagRequest;
    }
    export interface Params$Resource$Properties$Createrollupproperty extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCreateRollupPropertyRequest;
    }
    export interface Params$Resource$Properties$Delete extends StandardParameters {
        /**
         * Required. The name of the Property to soft-delete. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Deleteconnectedsitetag extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDeleteConnectedSiteTagRequest;
    }
    export interface Params$Resource$Properties$Fetchautomatedga4configurationoptout extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaFetchAutomatedGa4ConfigurationOptOutRequest;
    }
    export interface Params$Resource$Properties$Fetchconnectedga4property extends StandardParameters {
        /**
         * Required. The UA property for which to look up the connected GA4 property. Note this request uses the internal property ID, not the tracking ID of the form UA-XXXXXX-YY. Format: properties/{internal_web_property_id\} Example: properties/1234
         */
        property?: string;
    }
    export interface Params$Resource$Properties$Get extends StandardParameters {
        /**
         * Required. The name of the property to lookup. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Getattributionsettings extends StandardParameters {
        /**
         * Required. The name of the attribution settings to retrieve. Format: properties/{property\}/attributionSettings
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Getdataretentionsettings extends StandardParameters {
        /**
         * Required. The name of the settings to lookup. Format: properties/{property\}/dataRetentionSettings Example: "properties/1000/dataRetentionSettings"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Getgooglesignalssettings extends StandardParameters {
        /**
         * Required. The name of the google signals settings to retrieve. Format: properties/{property\}/googleSignalsSettings
         */
        name?: string;
    }
    export interface Params$Resource$Properties$List extends StandardParameters {
        /**
         * Required. An expression for filtering the results of the request. Fields eligible for filtering are: `parent:`(The resource name of the parent account/property) or `ancestor:`(The resource name of the parent account) or `firebase_project:`(The id or number of the linked firebase project). Some examples of filters: ``` | Filter | Description | |-----------------------------|-------------------------------------------| | parent:accounts/123 | The account with account id: 123. | | parent:properties/123 | The property with property id: 123. | | ancestor:accounts/123 | The account with account id: 123. | | firebase_project:project-id | The firebase project with id: project-id. | | firebase_project:123 | The firebase project with number: 123. | ```
         */
        filter?: string;
        /**
         * The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListProperties` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListProperties` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Whether to include soft-deleted (ie: "trashed") Properties in the results. Properties can be inspected to determine whether they are deleted or not.
         */
        showDeleted?: boolean;
    }
    export interface Params$Resource$Properties$Listconnectedsitetags extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaListConnectedSiteTagsRequest;
    }
    export interface Params$Resource$Properties$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this property. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaProperty;
    }
    export interface Params$Resource$Properties$Provisionsubproperty extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaProvisionSubpropertyRequest;
    }
    export interface Params$Resource$Properties$Runaccessreport extends StandardParameters {
        /**
         * The Data Access Report supports requesting at the property level or account level. If requested at the account level, Data Access Reports include all access for all properties under that account. To request at the property level, entity should be for example 'properties/123' if "123" is your Google Analytics property ID. To request at the account level, entity should be for example 'accounts/1234' if "1234" is your Google Analytics Account ID.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaRunAccessReportRequest;
    }
    export interface Params$Resource$Properties$Setautomatedga4configurationoptout extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSetAutomatedGa4ConfigurationOptOutRequest;
    }
    export interface Params$Resource$Properties$Updateattributionsettings extends StandardParameters {
        /**
         * Output only. Resource name of this attribution settings resource. Format: properties/{property_id\}/attributionSettings Example: "properties/1000/attributionSettings"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAttributionSettings;
    }
    export interface Params$Resource$Properties$Updatedataretentionsettings extends StandardParameters {
        /**
         * Output only. Resource name for this DataRetentionSetting resource. Format: properties/{property\}/dataRetentionSettings
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDataRetentionSettings;
    }
    export interface Params$Resource$Properties$Updategooglesignalssettings extends StandardParameters {
        /**
         * Output only. Resource name of this setting. Format: properties/{property_id\}/googleSignalsSettings Example: "properties/1000/googleSignalsSettings"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaGoogleSignalsSettings;
    }
    export class Resource$Properties$Accessbindings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates information about multiple access bindings to an account or property. This method is transactional. If any AccessBinding cannot be created, none of the AccessBindings will be created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchCreate(params: Params$Resource$Properties$Accessbindings$Batchcreate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchCreate(params?: Params$Resource$Properties$Accessbindings$Batchcreate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>>;
        batchCreate(params: Params$Resource$Properties$Accessbindings$Batchcreate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchCreate(params: Params$Resource$Properties$Accessbindings$Batchcreate, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        batchCreate(params: Params$Resource$Properties$Accessbindings$Batchcreate, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        batchCreate(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsResponse>): void;
        /**
         * Deletes information about multiple users' links to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchDelete(params: Params$Resource$Properties$Accessbindings$Batchdelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchDelete(params?: Params$Resource$Properties$Accessbindings$Batchdelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        batchDelete(params: Params$Resource$Properties$Accessbindings$Batchdelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchDelete(params: Params$Resource$Properties$Accessbindings$Batchdelete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(params: Params$Resource$Properties$Accessbindings$Batchdelete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about multiple access bindings to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchGet(params: Params$Resource$Properties$Accessbindings$Batchget, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchGet(params?: Params$Resource$Properties$Accessbindings$Batchget, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>>;
        batchGet(params: Params$Resource$Properties$Accessbindings$Batchget, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchGet(params: Params$Resource$Properties$Accessbindings$Batchget, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        batchGet(params: Params$Resource$Properties$Accessbindings$Batchget, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        batchGet(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchGetAccessBindingsResponse>): void;
        /**
         * Updates information about multiple access bindings to an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchUpdate(params: Params$Resource$Properties$Accessbindings$Batchupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchUpdate(params?: Params$Resource$Properties$Accessbindings$Batchupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>>;
        batchUpdate(params: Params$Resource$Properties$Accessbindings$Batchupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchUpdate(params: Params$Resource$Properties$Accessbindings$Batchupdate, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        batchUpdate(params: Params$Resource$Properties$Accessbindings$Batchupdate, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        batchUpdate(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsResponse>): void;
        /**
         * Creates an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Accessbindings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Accessbindings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        create(params: Params$Resource$Properties$Accessbindings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Accessbindings$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        create(params: Params$Resource$Properties$Accessbindings$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        /**
         * Deletes an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Accessbindings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Accessbindings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Accessbindings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Accessbindings$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Accessbindings$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about an access binding.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Accessbindings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Accessbindings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        get(params: Params$Resource$Properties$Accessbindings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Accessbindings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        get(params: Params$Resource$Properties$Accessbindings$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        /**
         * Lists all access bindings on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Accessbindings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Accessbindings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>>;
        list(params: Params$Resource$Properties$Accessbindings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Accessbindings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        list(params: Params$Resource$Properties$Accessbindings$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAccessBindingsResponse>): void;
        /**
         * Updates an access binding on an account or property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Accessbindings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Accessbindings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>>;
        patch(params: Params$Resource$Properties$Accessbindings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Accessbindings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        patch(params: Params$Resource$Properties$Accessbindings$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAccessBinding>): void;
    }
    export interface Params$Resource$Properties$Accessbindings$Batchcreate extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent field in the CreateAccessBindingRequest messages must either be empty or match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchCreateAccessBindingsRequest;
    }
    export interface Params$Resource$Properties$Accessbindings$Batchdelete extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided values for the 'names' field in DeleteAccessBindingRequest messages must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchDeleteAccessBindingsRequest;
    }
    export interface Params$Resource$Properties$Accessbindings$Batchget extends StandardParameters {
        /**
         * Required. The names of the access bindings to retrieve. A maximum of 1000 access bindings can be retrieved in a batch. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        names?: string[];
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided values for the 'names' field must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Accessbindings$Batchupdate extends StandardParameters {
        /**
         * Required. The account or property that owns the access bindings. The parent of all provided AccessBinding in UpdateAccessBindingRequest messages must match this field. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBatchUpdateAccessBindingsRequest;
    }
    export interface Params$Resource$Properties$Accessbindings$Create extends StandardParameters {
        /**
         * Required. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
    }
    export interface Params$Resource$Properties$Accessbindings$Delete extends StandardParameters {
        /**
         * Required. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Accessbindings$Get extends StandardParameters {
        /**
         * Required. The name of the access binding to retrieve. Formats: - accounts/{account\}/accessBindings/{accessBinding\} - properties/{property\}/accessBindings/{accessBinding\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Accessbindings$List extends StandardParameters {
        /**
         * The maximum number of access bindings to return. The service may return fewer than this value. If unspecified, at most 200 access bindings will be returned. The maximum value is 500; values above 500 will be coerced to 500.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAccessBindings` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAccessBindings` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Formats: - accounts/{account\} - properties/{property\}
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Accessbindings$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this binding. Format: accounts/{account\}/accessBindings/{access_binding\} or properties/{property\}/accessBindings/{access_binding\} Example: "accounts/100/accessBindings/200"
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAccessBinding;
    }
    export class Resource$Properties$Adsenselinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an AdSenseLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Adsenselinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Adsenselinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>>;
        create(params: Params$Resource$Properties$Adsenselinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Adsenselinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        create(params: Params$Resource$Properties$Adsenselinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        /**
         * Deletes an AdSenseLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Adsenselinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Adsenselinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Adsenselinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Adsenselinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Adsenselinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Looks up a single AdSenseLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Adsenselinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Adsenselinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>>;
        get(params: Params$Resource$Properties$Adsenselinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Adsenselinks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        get(params: Params$Resource$Properties$Adsenselinks$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAdSenseLink>): void;
        /**
         * Lists AdSenseLinks on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Adsenselinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Adsenselinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse>>;
        list(params: Params$Resource$Properties$Adsenselinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Adsenselinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse>): void;
        list(params: Params$Resource$Properties$Adsenselinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAdSenseLinksResponse>): void;
    }
    export interface Params$Resource$Properties$Adsenselinks$Create extends StandardParameters {
        /**
         * Required. The property for which to create an AdSense Link. Format: properties/{propertyId\} Example: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAdSenseLink;
    }
    export interface Params$Resource$Properties$Adsenselinks$Delete extends StandardParameters {
        /**
         * Required. Unique identifier for the AdSense Link to be deleted. Format: properties/{propertyId\}/adSenseLinks/{linkId\} Example: properties/1234/adSenseLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Adsenselinks$Get extends StandardParameters {
        /**
         * Required. Unique identifier for the AdSense Link requested. Format: properties/{propertyId\}/adSenseLinks/{linkId\} Example: properties/1234/adSenseLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Adsenselinks$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token received from a previous `ListAdSenseLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAdSenseLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the parent property. Format: properties/{propertyId\} Example: properties/1234
         */
        parent?: string;
    }
    export class Resource$Properties$Audiences {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Archives an Audience on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        archive(params: Params$Resource$Properties$Audiences$Archive, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        archive(params?: Params$Resource$Properties$Audiences$Archive, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        archive(params: Params$Resource$Properties$Audiences$Archive, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        archive(params: Params$Resource$Properties$Audiences$Archive, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(params: Params$Resource$Properties$Audiences$Archive, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Creates an Audience.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Audiences$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Audiences$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAudience>>;
        create(params: Params$Resource$Properties$Audiences$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Audiences$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        create(params: Params$Resource$Properties$Audiences$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        /**
         * Lookup for a single Audience. Audiences created before 2020 may not be supported. Default audiences will not show filter definitions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Audiences$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Audiences$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAudience>>;
        get(params: Params$Resource$Properties$Audiences$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Audiences$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        get(params: Params$Resource$Properties$Audiences$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        /**
         * Lists Audiences on a property. Audiences created before 2020 may not be supported. Default audiences will not show filter definitions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Audiences$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Audiences$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse>>;
        list(params: Params$Resource$Properties$Audiences$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Audiences$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse>): void;
        list(params: Params$Resource$Properties$Audiences$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListAudiencesResponse>): void;
        /**
         * Updates an Audience on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Audiences$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Audiences$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaAudience>>;
        patch(params: Params$Resource$Properties$Audiences$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Audiences$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        patch(params: Params$Resource$Properties$Audiences$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaAudience>): void;
    }
    export interface Params$Resource$Properties$Audiences$Archive extends StandardParameters {
        /**
         * Required. Example format: properties/1234/audiences/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaArchiveAudienceRequest;
    }
    export interface Params$Resource$Properties$Audiences$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAudience;
    }
    export interface Params$Resource$Properties$Audiences$Get extends StandardParameters {
        /**
         * Required. The name of the Audience to get. Example format: properties/1234/audiences/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Audiences$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAudiences` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAudiences` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Audiences$Patch extends StandardParameters {
        /**
         * Output only. The resource name for this Audience resource. Format: properties/{propertyId\}/audiences/{audienceId\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaAudience;
    }
    export class Resource$Properties$Bigquerylinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a BigQueryLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Bigquerylinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Bigquerylinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>>;
        create(params: Params$Resource$Properties$Bigquerylinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Bigquerylinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        create(params: Params$Resource$Properties$Bigquerylinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        /**
         * Deletes a BigQueryLink on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Bigquerylinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Bigquerylinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Bigquerylinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Bigquerylinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Bigquerylinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single BigQuery Link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Bigquerylinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Bigquerylinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>>;
        get(params: Params$Resource$Properties$Bigquerylinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Bigquerylinks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        get(params: Params$Resource$Properties$Bigquerylinks$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        /**
         * Lists BigQuery Links on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Bigquerylinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Bigquerylinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse>>;
        list(params: Params$Resource$Properties$Bigquerylinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Bigquerylinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse>): void;
        list(params: Params$Resource$Properties$Bigquerylinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListBigQueryLinksResponse>): void;
        /**
         * Updates a BigQueryLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Bigquerylinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Bigquerylinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>>;
        patch(params: Params$Resource$Properties$Bigquerylinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Bigquerylinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        patch(params: Params$Resource$Properties$Bigquerylinks$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaBigQueryLink>): void;
    }
    export interface Params$Resource$Properties$Bigquerylinks$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBigQueryLink;
    }
    export interface Params$Resource$Properties$Bigquerylinks$Delete extends StandardParameters {
        /**
         * Required. The BigQueryLink to delete. Example format: properties/1234/bigQueryLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Bigquerylinks$Get extends StandardParameters {
        /**
         * Required. The name of the BigQuery link to lookup. Format: properties/{property_id\}/bigQueryLinks/{bigquery_link_id\} Example: properties/123/bigQueryLinks/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Bigquerylinks$List extends StandardParameters {
        /**
         * The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListBigQueryLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBigQueryLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The name of the property to list BigQuery links under. Format: properties/{property_id\} Example: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Bigquerylinks$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this BigQuery link. Format: 'properties/{property_id\}/bigQueryLinks/{bigquery_link_id\}' Format: 'properties/1234/bigQueryLinks/abc567'
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaBigQueryLink;
    }
    export class Resource$Properties$Calculatedmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a CalculatedMetric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Calculatedmetrics$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Calculatedmetrics$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>>;
        create(params: Params$Resource$Properties$Calculatedmetrics$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Calculatedmetrics$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        create(params: Params$Resource$Properties$Calculatedmetrics$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        /**
         * Deletes a CalculatedMetric on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Calculatedmetrics$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Calculatedmetrics$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Calculatedmetrics$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Calculatedmetrics$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Calculatedmetrics$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single CalculatedMetric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Calculatedmetrics$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Calculatedmetrics$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>>;
        get(params: Params$Resource$Properties$Calculatedmetrics$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Calculatedmetrics$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        get(params: Params$Resource$Properties$Calculatedmetrics$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        /**
         * Lists CalculatedMetrics on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Calculatedmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Calculatedmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse>>;
        list(params: Params$Resource$Properties$Calculatedmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Calculatedmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse>): void;
        list(params: Params$Resource$Properties$Calculatedmetrics$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCalculatedMetricsResponse>): void;
        /**
         * Updates a CalculatedMetric on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Calculatedmetrics$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Calculatedmetrics$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>>;
        patch(params: Params$Resource$Properties$Calculatedmetrics$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Calculatedmetrics$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        patch(params: Params$Resource$Properties$Calculatedmetrics$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric>): void;
    }
    export interface Params$Resource$Properties$Calculatedmetrics$Create extends StandardParameters {
        /**
         * Required. The ID to use for the calculated metric which will become the final component of the calculated metric's resource name. This value should be 1-80 characters and valid characters are /[a-zA-Z0-9_]/, no spaces allowed. calculated_metric_id must be unique between all calculated metrics under a property. The calculated_metric_id is used when referencing this calculated metric from external APIs, for example, "calcMetric:{calculated_metric_id\}".
         */
        calculatedMetricId?: string;
        /**
         * Required. Format: properties/{property_id\} Example: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric;
    }
    export interface Params$Resource$Properties$Calculatedmetrics$Delete extends StandardParameters {
        /**
         * Required. The name of the CalculatedMetric to delete. Format: properties/{property_id\}/calculatedMetrics/{calculated_metric_id\} Example: properties/1234/calculatedMetrics/Metric01
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Calculatedmetrics$Get extends StandardParameters {
        /**
         * Required. The name of the CalculatedMetric to get. Format: properties/{property_id\}/calculatedMetrics/{calculated_metric_id\} Example: properties/1234/calculatedMetrics/Metric01
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Calculatedmetrics$List extends StandardParameters {
        /**
         * Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListCalculatedMetrics` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListCalculatedMetrics` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Calculatedmetrics$Patch extends StandardParameters {
        /**
         * Output only. Resource name for this CalculatedMetric. Format: 'properties/{property_id\}/calculatedMetrics/{calculated_metric_id\}'
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCalculatedMetric;
    }
    export class Resource$Properties$Channelgroups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a ChannelGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Channelgroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Channelgroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>>;
        create(params: Params$Resource$Properties$Channelgroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Channelgroups$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        create(params: Params$Resource$Properties$Channelgroups$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        /**
         * Deletes a ChannelGroup on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Channelgroups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Channelgroups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Channelgroups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Channelgroups$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Channelgroups$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single ChannelGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Channelgroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Channelgroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>>;
        get(params: Params$Resource$Properties$Channelgroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Channelgroups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        get(params: Params$Resource$Properties$Channelgroups$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        /**
         * Lists ChannelGroups on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Channelgroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Channelgroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse>>;
        list(params: Params$Resource$Properties$Channelgroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Channelgroups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse>): void;
        list(params: Params$Resource$Properties$Channelgroups$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListChannelGroupsResponse>): void;
        /**
         * Updates a ChannelGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Channelgroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Channelgroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>>;
        patch(params: Params$Resource$Properties$Channelgroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Channelgroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        patch(params: Params$Resource$Properties$Channelgroups$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaChannelGroup>): void;
    }
    export interface Params$Resource$Properties$Channelgroups$Create extends StandardParameters {
        /**
         * Required. The property for which to create a ChannelGroup. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaChannelGroup;
    }
    export interface Params$Resource$Properties$Channelgroups$Delete extends StandardParameters {
        /**
         * Required. The ChannelGroup to delete. Example format: properties/1234/channelGroups/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Channelgroups$Get extends StandardParameters {
        /**
         * Required. The ChannelGroup to get. Example format: properties/1234/channelGroups/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Channelgroups$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListChannelGroups` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListChannelGroups` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The property for which to list ChannelGroups. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Channelgroups$Patch extends StandardParameters {
        /**
         * Output only. The resource name for this Channel Group resource. Format: properties/{property\}/channelGroups/{channel_group\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaChannelGroup;
    }
    export class Resource$Properties$Conversionevents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deprecated: Use `CreateKeyEvent` instead. Creates a conversion event with the specified attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Conversionevents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Conversionevents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>>;
        create(params: Params$Resource$Properties$Conversionevents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Conversionevents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        create(params: Params$Resource$Properties$Conversionevents$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        /**
         * Deprecated: Use `DeleteKeyEvent` instead. Deletes a conversion event in a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Conversionevents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Conversionevents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Conversionevents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Conversionevents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Conversionevents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Deprecated: Use `GetKeyEvent` instead. Retrieve a single conversion event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Conversionevents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Conversionevents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>>;
        get(params: Params$Resource$Properties$Conversionevents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Conversionevents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        get(params: Params$Resource$Properties$Conversionevents$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        /**
         * Deprecated: Use `ListKeyEvents` instead. Returns a list of conversion events in the specified parent property. Returns an empty list if no conversion events are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Conversionevents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Conversionevents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse>>;
        list(params: Params$Resource$Properties$Conversionevents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Conversionevents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse>): void;
        list(params: Params$Resource$Properties$Conversionevents$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListConversionEventsResponse>): void;
        /**
         * Deprecated: Use `UpdateKeyEvent` instead. Updates a conversion event with the specified attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Conversionevents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>>;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaConversionEvent>): void;
    }
    export interface Params$Resource$Properties$Conversionevents$Create extends StandardParameters {
        /**
         * Required. The resource name of the parent property where this conversion event will be created. Format: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaConversionEvent;
    }
    export interface Params$Resource$Properties$Conversionevents$Delete extends StandardParameters {
        /**
         * Required. The resource name of the conversion event to delete. Format: properties/{property\}/conversionEvents/{conversion_event\} Example: "properties/123/conversionEvents/456"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Conversionevents$Get extends StandardParameters {
        /**
         * Required. The resource name of the conversion event to retrieve. Format: properties/{property\}/conversionEvents/{conversion_event\} Example: "properties/123/conversionEvents/456"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Conversionevents$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListConversionEvents` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListConversionEvents` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the parent property. Example: 'properties/123'
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Conversionevents$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this conversion event. Format: properties/{property\}/conversionEvents/{conversion_event\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaConversionEvent;
    }
    export class Resource$Properties$Customdimensions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Archives a CustomDimension on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        archive(params: Params$Resource$Properties$Customdimensions$Archive, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        archive(params?: Params$Resource$Properties$Customdimensions$Archive, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        archive(params: Params$Resource$Properties$Customdimensions$Archive, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        archive(params: Params$Resource$Properties$Customdimensions$Archive, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(params: Params$Resource$Properties$Customdimensions$Archive, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Creates a CustomDimension.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Customdimensions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Customdimensions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>>;
        create(params: Params$Resource$Properties$Customdimensions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Customdimensions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        create(params: Params$Resource$Properties$Customdimensions$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        /**
         * Lookup for a single CustomDimension.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Customdimensions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Customdimensions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>>;
        get(params: Params$Resource$Properties$Customdimensions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Customdimensions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        get(params: Params$Resource$Properties$Customdimensions$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        /**
         * Lists CustomDimensions on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Customdimensions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Customdimensions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse>>;
        list(params: Params$Resource$Properties$Customdimensions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Customdimensions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse>): void;
        list(params: Params$Resource$Properties$Customdimensions$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomDimensionsResponse>): void;
        /**
         * Updates a CustomDimension on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Customdimensions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>>;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomDimension>): void;
    }
    export interface Params$Resource$Properties$Customdimensions$Archive extends StandardParameters {
        /**
         * Required. The name of the CustomDimension to archive. Example format: properties/1234/customDimensions/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaArchiveCustomDimensionRequest;
    }
    export interface Params$Resource$Properties$Customdimensions$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCustomDimension;
    }
    export interface Params$Resource$Properties$Customdimensions$Get extends StandardParameters {
        /**
         * Required. The name of the CustomDimension to get. Example format: properties/1234/customDimensions/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Customdimensions$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListCustomDimensions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListCustomDimensions` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Customdimensions$Patch extends StandardParameters {
        /**
         * Output only. Resource name for this CustomDimension resource. Format: properties/{property\}/customDimensions/{customDimension\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCustomDimension;
    }
    export class Resource$Properties$Custommetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Archives a CustomMetric on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        archive(params: Params$Resource$Properties$Custommetrics$Archive, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        archive(params?: Params$Resource$Properties$Custommetrics$Archive, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        archive(params: Params$Resource$Properties$Custommetrics$Archive, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        archive(params: Params$Resource$Properties$Custommetrics$Archive, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(params: Params$Resource$Properties$Custommetrics$Archive, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        archive(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Creates a CustomMetric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Custommetrics$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Custommetrics$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>>;
        create(params: Params$Resource$Properties$Custommetrics$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Custommetrics$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        create(params: Params$Resource$Properties$Custommetrics$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        /**
         * Lookup for a single CustomMetric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Custommetrics$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Custommetrics$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>>;
        get(params: Params$Resource$Properties$Custommetrics$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Custommetrics$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        get(params: Params$Resource$Properties$Custommetrics$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        /**
         * Lists CustomMetrics on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Custommetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Custommetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse>>;
        list(params: Params$Resource$Properties$Custommetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Custommetrics$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse>): void;
        list(params: Params$Resource$Properties$Custommetrics$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListCustomMetricsResponse>): void;
        /**
         * Updates a CustomMetric on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Custommetrics$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>>;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaCustomMetric>): void;
    }
    export interface Params$Resource$Properties$Custommetrics$Archive extends StandardParameters {
        /**
         * Required. The name of the CustomMetric to archive. Example format: properties/1234/customMetrics/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaArchiveCustomMetricRequest;
    }
    export interface Params$Resource$Properties$Custommetrics$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCustomMetric;
    }
    export interface Params$Resource$Properties$Custommetrics$Get extends StandardParameters {
        /**
         * Required. The name of the CustomMetric to get. Example format: properties/1234/customMetrics/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Custommetrics$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListCustomMetrics` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListCustomMetrics` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Custommetrics$Patch extends StandardParameters {
        /**
         * Output only. Resource name for this CustomMetric resource. Format: properties/{property\}/customMetrics/{customMetric\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCustomMetric;
    }
    export class Resource$Properties$Datastreams {
        context: APIRequestContext;
        eventCreateRules: Resource$Properties$Datastreams$Eventcreaterules;
        eventEditRules: Resource$Properties$Datastreams$Eventeditrules;
        measurementProtocolSecrets: Resource$Properties$Datastreams$Measurementprotocolsecrets;
        sKAdNetworkConversionValueSchema: Resource$Properties$Datastreams$Skadnetworkconversionvalueschema;
        constructor(context: APIRequestContext);
        /**
         * Creates a DataStream.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Datastreams$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Datastreams$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataStream>>;
        create(params: Params$Resource$Properties$Datastreams$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        create(params: Params$Resource$Properties$Datastreams$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        /**
         * Deletes a DataStream on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Datastreams$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Datastreams$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Datastreams$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Datastreams$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Datastreams$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single DataStream.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Datastreams$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Datastreams$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataStream>>;
        get(params: Params$Resource$Properties$Datastreams$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        get(params: Params$Resource$Properties$Datastreams$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        /**
         * Lookup for a single DataRedactionSettings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Getdataredactionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDataRedactionSettings(params?: Params$Resource$Properties$Datastreams$Getdataredactionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>>;
        getDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Getdataredactionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Getdataredactionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        getDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Getdataredactionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        getDataRedactionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        /**
         * Returns the enhanced measurement settings for this data stream. Note that the stream must enable enhanced measurement for these settings to take effect.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEnhancedMeasurementSettings(params?: Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>>;
        getEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
        getEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
        getEnhancedMeasurementSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
        /**
         * Returns the Site Tag for the specified web stream. Site Tags are immutable singletons.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getGlobalSiteTag(params: Params$Resource$Properties$Datastreams$Getglobalsitetag, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getGlobalSiteTag(params?: Params$Resource$Properties$Datastreams$Getglobalsitetag, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag>>;
        getGlobalSiteTag(params: Params$Resource$Properties$Datastreams$Getglobalsitetag, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getGlobalSiteTag(params: Params$Resource$Properties$Datastreams$Getglobalsitetag, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag>): void;
        getGlobalSiteTag(params: Params$Resource$Properties$Datastreams$Getglobalsitetag, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag>): void;
        getGlobalSiteTag(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGlobalSiteTag>): void;
        /**
         * Lists DataStreams on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse>>;
        list(params: Params$Resource$Properties$Datastreams$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDataStreamsResponse>): void;
        /**
         * Updates a DataStream on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataStream>>;
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        patch(params: Params$Resource$Properties$Datastreams$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataStream>): void;
        /**
         * Updates a DataRedactionSettings on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Updatedataredactionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateDataRedactionSettings(params?: Params$Resource$Properties$Datastreams$Updatedataredactionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>>;
        updateDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Updatedataredactionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Updatedataredactionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        updateDataRedactionSettings(params: Params$Resource$Properties$Datastreams$Updatedataredactionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        updateDataRedactionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings>): void;
        /**
         * Updates the enhanced measurement settings for this data stream. Note that the stream must enable enhanced measurement for these settings to take effect.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateEnhancedMeasurementSettings(params?: Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>>;
        updateEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
        updateEnhancedMeasurementSettings(params: Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
        updateEnhancedMeasurementSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDataStream;
    }
    export interface Params$Resource$Properties$Datastreams$Delete extends StandardParameters {
        /**
         * Required. The name of the DataStream to delete. Example format: properties/1234/dataStreams/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Get extends StandardParameters {
        /**
         * Required. The name of the DataStream to get. Example format: properties/1234/dataStreams/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Getdataredactionsettings extends StandardParameters {
        /**
         * Required. The name of the settings to lookup. Format: properties/{property\}/dataStreams/{data_stream\}/dataRedactionSettings Example: "properties/1000/dataStreams/2000/dataRedactionSettings"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Getenhancedmeasurementsettings extends StandardParameters {
        /**
         * Required. The name of the settings to lookup. Format: properties/{property\}/dataStreams/{data_stream\}/enhancedMeasurementSettings Example: "properties/1000/dataStreams/2000/enhancedMeasurementSettings"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Getglobalsitetag extends StandardParameters {
        /**
         * Required. The name of the site tag to lookup. Note that site tags are singletons and do not have unique IDs. Format: properties/{property_id\}/dataStreams/{stream_id\}/globalSiteTag Example: `properties/123/dataStreams/456/globalSiteTag`
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListDataStreams` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDataStreams` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this Data Stream. Format: properties/{property_id\}/dataStreams/{stream_id\} Example: "properties/1000/dataStreams/2000"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDataStream;
    }
    export interface Params$Resource$Properties$Datastreams$Updatedataredactionsettings extends StandardParameters {
        /**
         * Output only. Name of this Data Redaction Settings resource. Format: properties/{property_id\}/dataStreams/{data_stream\}/dataRedactionSettings Example: "properties/1000/dataStreams/2000/dataRedactionSettings"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDataRedactionSettings;
    }
    export interface Params$Resource$Properties$Datastreams$Updateenhancedmeasurementsettings extends StandardParameters {
        /**
         * Output only. Resource name of the Enhanced Measurement Settings. Format: properties/{property_id\}/dataStreams/{data_stream\}/enhancedMeasurementSettings Example: "properties/1000/dataStreams/2000/enhancedMeasurementSettings"
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaEnhancedMeasurementSettings;
    }
    export class Resource$Properties$Datastreams$Eventcreaterules {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an EventCreateRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Datastreams$Eventcreaterules$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>>;
        create(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        create(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        /**
         * Deletes an EventCreateRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Datastreams$Eventcreaterules$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single EventCreateRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Datastreams$Eventcreaterules$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>>;
        get(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        get(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        /**
         * Lists EventCreateRules on a web data stream.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$Eventcreaterules$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$Eventcreaterules$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse>>;
        list(params: Params$Resource$Properties$Datastreams$Eventcreaterules$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$Eventcreaterules$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$Eventcreaterules$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventCreateRulesResponse>): void;
        /**
         * Updates an EventCreateRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Eventcreaterules$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>>;
        patch(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        patch(params: Params$Resource$Properties$Datastreams$Eventcreaterules$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventCreateRule>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Eventcreaterules$Create extends StandardParameters {
        /**
         * Required. Example format: properties/123/dataStreams/456
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaEventCreateRule;
    }
    export interface Params$Resource$Properties$Datastreams$Eventcreaterules$Delete extends StandardParameters {
        /**
         * Required. Example format: properties/123/dataStreams/456/eventCreateRules/789
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventcreaterules$Get extends StandardParameters {
        /**
         * Required. The name of the EventCreateRule to get. Example format: properties/123/dataStreams/456/eventCreateRules/789
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventcreaterules$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListEventCreateRules` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListEventCreateRules` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/123/dataStreams/456
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventcreaterules$Patch extends StandardParameters {
        /**
         * Output only. Resource name for this EventCreateRule resource. Format: properties/{property\}/dataStreams/{data_stream\}/eventCreateRules/{event_create_rule\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaEventCreateRule;
    }
    export class Resource$Properties$Datastreams$Eventeditrules {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an EventEditRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Datastreams$Eventeditrules$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Datastreams$Eventeditrules$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>>;
        create(params: Params$Resource$Properties$Datastreams$Eventeditrules$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Eventeditrules$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        create(params: Params$Resource$Properties$Datastreams$Eventeditrules$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        /**
         * Deletes an EventEditRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Datastreams$Eventeditrules$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Datastreams$Eventeditrules$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Datastreams$Eventeditrules$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Datastreams$Eventeditrules$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Datastreams$Eventeditrules$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single EventEditRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Datastreams$Eventeditrules$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Datastreams$Eventeditrules$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>>;
        get(params: Params$Resource$Properties$Datastreams$Eventeditrules$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Eventeditrules$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        get(params: Params$Resource$Properties$Datastreams$Eventeditrules$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        /**
         * Lists EventEditRules on a web data stream.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$Eventeditrules$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$Eventeditrules$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse>>;
        list(params: Params$Resource$Properties$Datastreams$Eventeditrules$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$Eventeditrules$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$Eventeditrules$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListEventEditRulesResponse>): void;
        /**
         * Updates an EventEditRule.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Eventeditrules$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Eventeditrules$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>>;
        patch(params: Params$Resource$Properties$Datastreams$Eventeditrules$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Eventeditrules$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        patch(params: Params$Resource$Properties$Datastreams$Eventeditrules$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaEventEditRule>): void;
        /**
         * Changes the processing order of event edit rules on the specified stream.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reorder(params: Params$Resource$Properties$Datastreams$Eventeditrules$Reorder, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reorder(params?: Params$Resource$Properties$Datastreams$Eventeditrules$Reorder, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        reorder(params: Params$Resource$Properties$Datastreams$Eventeditrules$Reorder, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reorder(params: Params$Resource$Properties$Datastreams$Eventeditrules$Reorder, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        reorder(params: Params$Resource$Properties$Datastreams$Eventeditrules$Reorder, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        reorder(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$Create extends StandardParameters {
        /**
         * Required. Example format: properties/123/dataStreams/456
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaEventEditRule;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$Delete extends StandardParameters {
        /**
         * Required. Example format: properties/123/dataStreams/456/eventEditRules/789
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$Get extends StandardParameters {
        /**
         * Required. The name of the EventEditRule to get. Example format: properties/123/dataStreams/456/eventEditRules/789
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$List extends StandardParameters {
        /**
         * Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListEventEditRules` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListEventEditRules` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/123/dataStreams/456
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$Patch extends StandardParameters {
        /**
         * Identifier. Resource name for this EventEditRule resource. Format: properties/{property\}/dataStreams/{data_stream\}/eventEditRules/{event_edit_rule\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaEventEditRule;
    }
    export interface Params$Resource$Properties$Datastreams$Eventeditrules$Reorder extends StandardParameters {
        /**
         * Required. Example format: properties/123/dataStreams/456
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaReorderEventEditRulesRequest;
    }
    export class Resource$Properties$Datastreams$Measurementprotocolsecrets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a measurement protocol secret.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>>;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        /**
         * Deletes target MeasurementProtocolSecret.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single MeasurementProtocolSecret.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>>;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        /**
         * Returns child MeasurementProtocolSecrets under the specified parent Property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse>>;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListMeasurementProtocolSecretsResponse>): void;
        /**
         * Updates a measurement protocol secret.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>>;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create extends StandardParameters {
        /**
         * Required. The parent resource where this secret will be created. Format: properties/{property\}/dataStreams/{dataStream\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Delete extends StandardParameters {
        /**
         * Required. The name of the MeasurementProtocolSecret to delete. Format: properties/{property\}/dataStreams/{dataStream\}/measurementProtocolSecrets/{measurementProtocolSecret\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get extends StandardParameters {
        /**
         * Required. The name of the measurement protocol secret to lookup. Format: properties/{property\}/dataStreams/{dataStream\}/measurementProtocolSecrets/{measurementProtocolSecret\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 10 resources will be returned. The maximum value is 10. Higher values will be coerced to the maximum.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListMeasurementProtocolSecrets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListMeasurementProtocolSecrets` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the parent stream. Format: properties/{property\}/dataStreams/{dataStream\}/measurementProtocolSecrets
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this secret. This secret may be a child of any type of stream. Format: properties/{property\}/dataStreams/{dataStream\}/measurementProtocolSecrets/{measurementProtocolSecret\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaMeasurementProtocolSecret;
    }
    export class Resource$Properties$Datastreams$Skadnetworkconversionvalueschema {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a SKAdNetworkConversionValueSchema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>>;
        create(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        create(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        /**
         * Deletes target SKAdNetworkConversionValueSchema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Looks up a single SKAdNetworkConversionValueSchema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>>;
        get(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        get(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        /**
         * Lists SKAdNetworkConversionValueSchema on a stream. Properties can have at most one SKAdNetworkConversionValueSchema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse>>;
        list(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSKAdNetworkConversionValueSchemasResponse>): void;
        /**
         * Updates a SKAdNetworkConversionValueSchema.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>>;
        patch(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        patch(params: Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Create extends StandardParameters {
        /**
         * Required. The parent resource where this schema will be created. Format: properties/{property\}/dataStreams/{dataStream\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema;
    }
    export interface Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Delete extends StandardParameters {
        /**
         * Required. The name of the SKAdNetworkConversionValueSchema to delete. Format: properties/{property\}/dataStreams/{dataStream\}/sKAdNetworkConversionValueSchema/{skadnetwork_conversion_value_schema\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Get extends StandardParameters {
        /**
         * Required. The resource name of SKAdNetwork conversion value schema to look up. Format: properties/{property\}/dataStreams/{dataStream\}/sKAdNetworkConversionValueSchema/{skadnetwork_conversion_value_schema\}
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$List extends StandardParameters {
        /**
         * The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListSKAdNetworkConversionValueSchemas` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSKAdNetworkConversionValueSchema` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The DataStream resource to list schemas for. Format: properties/{property_id\}/dataStreams/{dataStream\} Example: properties/1234/dataStreams/5678
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Datastreams$Skadnetworkconversionvalueschema$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the schema. This will be child of ONLY an iOS stream, and there can be at most one such child under an iOS stream. Format: properties/{property\}/dataStreams/{dataStream\}/sKAdNetworkConversionValueSchema
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSKAdNetworkConversionValueSchema;
    }
    export class Resource$Properties$Displayvideo360advertiserlinkproposals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Approves a DisplayVideo360AdvertiserLinkProposal. The DisplayVideo360AdvertiserLinkProposal will be deleted and a new DisplayVideo360AdvertiserLink will be created.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        approve(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse>>;
        approve(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse>): void;
        approve(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse>): void;
        approve(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalResponse>): void;
        /**
         * Cancels a DisplayVideo360AdvertiserLinkProposal. Cancelling can mean either: - Declining a proposal initiated from Display & Video 360 - Withdrawing a proposal initiated from Google Analytics After being cancelled, a proposal will eventually be deleted automatically.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>>;
        cancel(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        cancel(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        /**
         * Creates a DisplayVideo360AdvertiserLinkProposal.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>>;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        /**
         * Deletes a DisplayVideo360AdvertiserLinkProposal on a property. This can only be used on cancelled proposals.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single DisplayVideo360AdvertiserLinkProposal.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>>;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal>): void;
        /**
         * Lists DisplayVideo360AdvertiserLinkProposals on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse>>;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse>): void;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinkProposalsResponse>): void;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Approve extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLinkProposal to approve. Example format: properties/1234/displayVideo360AdvertiserLinkProposals/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaApproveDisplayVideo360AdvertiserLinkProposalRequest;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Cancel extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLinkProposal to cancel. Example format: properties/1234/displayVideo360AdvertiserLinkProposals/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaCancelDisplayVideo360AdvertiserLinkProposalRequest;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLinkProposal;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Delete extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLinkProposal to delete. Example format: properties/1234/displayVideo360AdvertiserLinkProposals/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$Get extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLinkProposal to get. Example format: properties/1234/displayVideo360AdvertiserLinkProposals/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinkproposals$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListDisplayVideo360AdvertiserLinkProposals` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDisplayVideo360AdvertiserLinkProposals` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export class Resource$Properties$Displayvideo360advertiserlinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a DisplayVideo360AdvertiserLink. This can only be utilized by users who have proper authorization both on the Google Analytics property and on the Display & Video 360 advertiser. Users who do not have access to the Display & Video 360 advertiser should instead seek to create a DisplayVideo360LinkProposal.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Displayvideo360advertiserlinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>>;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        create(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        /**
         * Deletes a DisplayVideo360AdvertiserLink on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Displayvideo360advertiserlinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Look up a single DisplayVideo360AdvertiserLink
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Displayvideo360advertiserlinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>>;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        get(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        /**
         * Lists all DisplayVideo360AdvertiserLinks on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Displayvideo360advertiserlinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse>>;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse>): void;
        list(params: Params$Resource$Properties$Displayvideo360advertiserlinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListDisplayVideo360AdvertiserLinksResponse>): void;
        /**
         * Updates a DisplayVideo360AdvertiserLink on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Displayvideo360advertiserlinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>>;
        patch(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        patch(params: Params$Resource$Properties$Displayvideo360advertiserlinks$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink>): void;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinks$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinks$Delete extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLink to delete. Example format: properties/1234/displayVideo360AdvertiserLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinks$Get extends StandardParameters {
        /**
         * Required. The name of the DisplayVideo360AdvertiserLink to get. Example format: properties/1234/displayVideo360AdvertiserLink/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinks$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListDisplayVideo360AdvertiserLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDisplayVideo360AdvertiserLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Displayvideo360advertiserlinks$Patch extends StandardParameters {
        /**
         * Output only. The resource name for this DisplayVideo360AdvertiserLink resource. Format: properties/{propertyId\}/displayVideo360AdvertiserLinks/{linkId\} Note: linkId is not the Display & Video 360 Advertiser ID
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaDisplayVideo360AdvertiserLink;
    }
    export class Resource$Properties$Expandeddatasets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a ExpandedDataSet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Expandeddatasets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Expandeddatasets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>>;
        create(params: Params$Resource$Properties$Expandeddatasets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Expandeddatasets$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        create(params: Params$Resource$Properties$Expandeddatasets$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        /**
         * Deletes a ExpandedDataSet on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Expandeddatasets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Expandeddatasets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Expandeddatasets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Expandeddatasets$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Expandeddatasets$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single ExpandedDataSet.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Expandeddatasets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Expandeddatasets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>>;
        get(params: Params$Resource$Properties$Expandeddatasets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Expandeddatasets$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        get(params: Params$Resource$Properties$Expandeddatasets$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        /**
         * Lists ExpandedDataSets on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Expandeddatasets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Expandeddatasets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse>>;
        list(params: Params$Resource$Properties$Expandeddatasets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Expandeddatasets$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse>): void;
        list(params: Params$Resource$Properties$Expandeddatasets$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListExpandedDataSetsResponse>): void;
        /**
         * Updates a ExpandedDataSet on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Expandeddatasets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Expandeddatasets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>>;
        patch(params: Params$Resource$Properties$Expandeddatasets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Expandeddatasets$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        patch(params: Params$Resource$Properties$Expandeddatasets$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet>): void;
    }
    export interface Params$Resource$Properties$Expandeddatasets$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet;
    }
    export interface Params$Resource$Properties$Expandeddatasets$Delete extends StandardParameters {
        /**
         * Required. Example format: properties/1234/expandedDataSets/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Expandeddatasets$Get extends StandardParameters {
        /**
         * Required. The name of the ExpandedDataSet to get. Example format: properties/1234/expandedDataSets/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Expandeddatasets$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListExpandedDataSets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListExpandedDataSet` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Expandeddatasets$Patch extends StandardParameters {
        /**
         * Output only. The resource name for this ExpandedDataSet resource. Format: properties/{property_id\}/expandedDataSets/{expanded_data_set\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaExpandedDataSet;
    }
    export class Resource$Properties$Firebaselinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a FirebaseLink. Properties can have at most one FirebaseLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Firebaselinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Firebaselinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaFirebaseLink>>;
        create(params: Params$Resource$Properties$Firebaselinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Firebaselinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFirebaseLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFirebaseLink>): void;
        create(params: Params$Resource$Properties$Firebaselinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFirebaseLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaFirebaseLink>): void;
        /**
         * Deletes a FirebaseLink on a property
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Firebaselinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Firebaselinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Firebaselinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Firebaselinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Firebaselinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lists FirebaseLinks on a property. Properties can have at most one FirebaseLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Firebaselinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Firebaselinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse>>;
        list(params: Params$Resource$Properties$Firebaselinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Firebaselinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse>): void;
        list(params: Params$Resource$Properties$Firebaselinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListFirebaseLinksResponse>): void;
    }
    export interface Params$Resource$Properties$Firebaselinks$Create extends StandardParameters {
        /**
         * Required. Format: properties/{property_id\} Example: `properties/1234`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaFirebaseLink;
    }
    export interface Params$Resource$Properties$Firebaselinks$Delete extends StandardParameters {
        /**
         * Required. Format: properties/{property_id\}/firebaseLinks/{firebase_link_id\} Example: `properties/1234/firebaseLinks/5678`
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Firebaselinks$List extends StandardParameters {
        /**
         * The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListFirebaseLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListFirebaseLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Format: properties/{property_id\} Example: `properties/1234`
         */
        parent?: string;
    }
    export class Resource$Properties$Googleadslinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a GoogleAdsLink.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Googleadslinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Googleadslinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>>;
        create(params: Params$Resource$Properties$Googleadslinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Googleadslinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
        create(params: Params$Resource$Properties$Googleadslinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
        /**
         * Deletes a GoogleAdsLink on a property
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Googleadslinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Googleadslinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Googleadslinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Googleadslinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Googleadslinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lists GoogleAdsLinks on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Googleadslinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Googleadslinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse>>;
        list(params: Params$Resource$Properties$Googleadslinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Googleadslinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse>): void;
        list(params: Params$Resource$Properties$Googleadslinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListGoogleAdsLinksResponse>): void;
        /**
         * Updates a GoogleAdsLink on a property
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Googleadslinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>>;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink>): void;
    }
    export interface Params$Resource$Properties$Googleadslinks$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink;
    }
    export interface Params$Resource$Properties$Googleadslinks$Delete extends StandardParameters {
        /**
         * Required. Example format: properties/1234/googleAdsLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Googleadslinks$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListGoogleAdsLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListGoogleAdsLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Googleadslinks$Patch extends StandardParameters {
        /**
         * Output only. Format: properties/{propertyId\}/googleAdsLinks/{googleAdsLinkId\} Note: googleAdsLinkId is not the Google Ads customer ID.
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaGoogleAdsLink;
    }
    export class Resource$Properties$Keyevents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Key Event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Keyevents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Keyevents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>>;
        create(params: Params$Resource$Properties$Keyevents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Keyevents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        create(params: Params$Resource$Properties$Keyevents$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        /**
         * Deletes a Key Event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Keyevents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Keyevents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Keyevents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Keyevents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Keyevents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieve a single Key Event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Keyevents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Keyevents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>>;
        get(params: Params$Resource$Properties$Keyevents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Keyevents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        get(params: Params$Resource$Properties$Keyevents$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        /**
         * Returns a list of Key Events in the specified parent property. Returns an empty list if no Key Events are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Keyevents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Keyevents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse>>;
        list(params: Params$Resource$Properties$Keyevents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Keyevents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse>): void;
        list(params: Params$Resource$Properties$Keyevents$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListKeyEventsResponse>): void;
        /**
         * Updates a Key Event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Keyevents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>>;
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        patch(params: Params$Resource$Properties$Keyevents$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaKeyEvent>): void;
    }
    export interface Params$Resource$Properties$Keyevents$Create extends StandardParameters {
        /**
         * Required. The resource name of the parent property where this Key Event will be created. Format: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaKeyEvent;
    }
    export interface Params$Resource$Properties$Keyevents$Delete extends StandardParameters {
        /**
         * Required. The resource name of the Key Event to delete. Format: properties/{property\}/keyEvents/{key_event\} Example: "properties/123/keyEvents/456"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Keyevents$Get extends StandardParameters {
        /**
         * Required. The resource name of the Key Event to retrieve. Format: properties/{property\}/keyEvents/{key_event\} Example: "properties/123/keyEvents/456"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Keyevents$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListKeyEvents` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListKeyEvents` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the parent property. Example: 'properties/123'
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Keyevents$Patch extends StandardParameters {
        /**
         * Output only. Resource name of this key event. Format: properties/{property\}/keyEvents/{key_event\}
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Field names must be in snake case (e.g., "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaKeyEvent;
    }
    export class Resource$Properties$Reportingdataannotations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Reporting Data Annotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Reportingdataannotations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Reportingdataannotations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>>;
        create(params: Params$Resource$Properties$Reportingdataannotations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Reportingdataannotations$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        create(params: Params$Resource$Properties$Reportingdataannotations$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        /**
         * Deletes a Reporting Data Annotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Reportingdataannotations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Reportingdataannotations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Reportingdataannotations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Reportingdataannotations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Reportingdataannotations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup a single Reporting Data Annotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Reportingdataannotations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Reportingdataannotations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>>;
        get(params: Params$Resource$Properties$Reportingdataannotations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Reportingdataannotations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        get(params: Params$Resource$Properties$Reportingdataannotations$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        /**
         * List all Reporting Data Annotations on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Reportingdataannotations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Reportingdataannotations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse>>;
        list(params: Params$Resource$Properties$Reportingdataannotations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Reportingdataannotations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse>): void;
        list(params: Params$Resource$Properties$Reportingdataannotations$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListReportingDataAnnotationsResponse>): void;
        /**
         * Updates a Reporting Data Annotation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Reportingdataannotations$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Reportingdataannotations$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>>;
        patch(params: Params$Resource$Properties$Reportingdataannotations$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Reportingdataannotations$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        patch(params: Params$Resource$Properties$Reportingdataannotations$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation>): void;
    }
    export interface Params$Resource$Properties$Reportingdataannotations$Create extends StandardParameters {
        /**
         * Required. The property for which to create a Reporting Data Annotation. Format: properties/property_id Example: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation;
    }
    export interface Params$Resource$Properties$Reportingdataannotations$Delete extends StandardParameters {
        /**
         * Required. Resource name of the Reporting Data Annotation to delete. Format: properties/property_id/reportingDataAnnotations/reporting_data_annotation Example: properties/123/reportingDataAnnotations/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Reportingdataannotations$Get extends StandardParameters {
        /**
         * Required. Resource name of the Reporting Data Annotation to lookup. Format: properties/property_id/reportingDataAnnotations/reportingDataAnnotation Example: properties/123/reportingDataAnnotations/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Reportingdataannotations$List extends StandardParameters {
        /**
         * Optional. Filter that restricts which reporting data annotations under the parent property are listed. Supported fields are: * 'name' * `title` * `description` * `annotation_date` * `annotation_date_range` * `color` Additionally, this API provides the following helper functions: * annotation_duration() : the duration that this annotation marks, [durations](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/duration.proto). expect a numeric representation of seconds followed by an `s` suffix. * is_annotation_in_range(start_date, end_date) : if the annotation is in the range specified by the `start_date` and `end_date`. The dates are in ISO-8601 format, for example `2031-06-28`. Supported operations: * `=` : equals * `!=` : not equals * `<` : less than * `\>` : greater than * `<=` : less than or equals * `\>=` : greater than or equals * `:` : has operator * `=~` : [regular expression](https://github.com/google/re2/wiki/Syntax) match * `!~` : [regular expression](https://github.com/google/re2/wiki/Syntax) does not match * `NOT` : Logical not * `AND` : Logical and * `OR` : Logical or Examples: 1. `title="Holiday Sale"` 2. `description=~"[Bb]ig [Gg]ame.*[Ss]ale"` 3. `is_annotation_in_range("2025-12-25", "2026-01-16") = true` 4. `annotation_duration() \>= 172800s AND title:BOGO`
         */
        filter?: string;
        /**
         * Optional. The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListReportingDataAnnotations` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListReportingDataAnnotations` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the property. Format: properties/property_id Example: properties/123
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Reportingdataannotations$Patch extends StandardParameters {
        /**
         * Required. Identifier. Resource name of this Reporting Data Annotation. Format: 'properties/{property_id\}/reportingDataAnnotations/{reporting_data_annotation\}' Format: 'properties/123/reportingDataAnnotations/456'
         */
        name?: string;
        /**
         * Optional. The list of fields to update. Field names must be in snake case (for example, "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaReportingDataAnnotation;
    }
    export class Resource$Properties$Rolluppropertysourcelinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a roll-up property source link. Only roll-up properties can have source links, so this method will throw an error if used on other types of properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Rolluppropertysourcelinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Rolluppropertysourcelinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>>;
        create(params: Params$Resource$Properties$Rolluppropertysourcelinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Rolluppropertysourcelinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        create(params: Params$Resource$Properties$Rolluppropertysourcelinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        /**
         * Deletes a roll-up property source link. Only roll-up properties can have source links, so this method will throw an error if used on other types of properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Rolluppropertysourcelinks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Rolluppropertysourcelinks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Rolluppropertysourcelinks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Rolluppropertysourcelinks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Rolluppropertysourcelinks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single roll-up property source Link. Only roll-up properties can have source links, so this method will throw an error if used on other types of properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Rolluppropertysourcelinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Rolluppropertysourcelinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>>;
        get(params: Params$Resource$Properties$Rolluppropertysourcelinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Rolluppropertysourcelinks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        get(params: Params$Resource$Properties$Rolluppropertysourcelinks$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink>): void;
        /**
         * Lists roll-up property source Links on a property. Only roll-up properties can have source links, so this method will throw an error if used on other types of properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Rolluppropertysourcelinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Rolluppropertysourcelinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse>>;
        list(params: Params$Resource$Properties$Rolluppropertysourcelinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Rolluppropertysourcelinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse>): void;
        list(params: Params$Resource$Properties$Rolluppropertysourcelinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListRollupPropertySourceLinksResponse>): void;
    }
    export interface Params$Resource$Properties$Rolluppropertysourcelinks$Create extends StandardParameters {
        /**
         * Required. Format: properties/{property_id\} Example: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaRollupPropertySourceLink;
    }
    export interface Params$Resource$Properties$Rolluppropertysourcelinks$Delete extends StandardParameters {
        /**
         * Required. Format: properties/{property_id\}/rollupPropertySourceLinks/{rollup_property_source_link_id\} Example: properties/1234/rollupPropertySourceLinks/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Rolluppropertysourcelinks$Get extends StandardParameters {
        /**
         * Required. The name of the roll-up property source link to lookup. Format: properties/{property_id\}/rollupPropertySourceLinks/{rollup_property_source_link_id\} Example: properties/123/rollupPropertySourceLinks/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Rolluppropertysourcelinks$List extends StandardParameters {
        /**
         * Optional. The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListRollupPropertySourceLinks` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListRollupPropertySourceLinks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The name of the roll-up property to list roll-up property source links under. Format: properties/{property_id\} Example: properties/1234
         */
        parent?: string;
    }
    export class Resource$Properties$Searchads360links {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a SearchAds360Link.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Searchads360links$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Searchads360links$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>>;
        create(params: Params$Resource$Properties$Searchads360links$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Searchads360links$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        create(params: Params$Resource$Properties$Searchads360links$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        /**
         * Deletes a SearchAds360Link on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Searchads360links$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Searchads360links$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Searchads360links$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Searchads360links$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Searchads360links$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Look up a single SearchAds360Link
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Searchads360links$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Searchads360links$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>>;
        get(params: Params$Resource$Properties$Searchads360links$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Searchads360links$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        get(params: Params$Resource$Properties$Searchads360links$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        /**
         * Lists all SearchAds360Links on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Searchads360links$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Searchads360links$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse>>;
        list(params: Params$Resource$Properties$Searchads360links$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Searchads360links$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse>): void;
        list(params: Params$Resource$Properties$Searchads360links$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSearchAds360LinksResponse>): void;
        /**
         * Updates a SearchAds360Link on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Searchads360links$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Searchads360links$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>>;
        patch(params: Params$Resource$Properties$Searchads360links$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Searchads360links$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        patch(params: Params$Resource$Properties$Searchads360links$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link>): void;
    }
    export interface Params$Resource$Properties$Searchads360links$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link;
    }
    export interface Params$Resource$Properties$Searchads360links$Delete extends StandardParameters {
        /**
         * Required. The name of the SearchAds360Link to delete. Example format: properties/1234/SearchAds360Links/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Searchads360links$Get extends StandardParameters {
        /**
         * Required. The name of the SearchAds360Link to get. Example format: properties/1234/SearchAds360Link/5678
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Searchads360links$List extends StandardParameters {
        /**
         * The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200 (higher values will be coerced to the maximum).
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListSearchAds360Links` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSearchAds360Links` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Searchads360links$Patch extends StandardParameters {
        /**
         * Output only. The resource name for this SearchAds360Link resource. Format: properties/{propertyId\}/searchAds360Links/{linkId\} Note: linkId is not the Search Ads 360 advertiser ID
         */
        name?: string;
        /**
         * Required. The list of fields to be updated. Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSearchAds360Link;
    }
    export class Resource$Properties$Subpropertyeventfilters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a subproperty Event Filter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Subpropertyeventfilters$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Subpropertyeventfilters$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>>;
        create(params: Params$Resource$Properties$Subpropertyeventfilters$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Subpropertyeventfilters$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        create(params: Params$Resource$Properties$Subpropertyeventfilters$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        /**
         * Deletes a subproperty event filter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Subpropertyeventfilters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Subpropertyeventfilters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Properties$Subpropertyeventfilters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Subpropertyeventfilters$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Properties$Subpropertyeventfilters$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Lookup for a single subproperty Event Filter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Subpropertyeventfilters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Subpropertyeventfilters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>>;
        get(params: Params$Resource$Properties$Subpropertyeventfilters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Subpropertyeventfilters$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        get(params: Params$Resource$Properties$Subpropertyeventfilters$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        /**
         * List all subproperty Event Filters on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Subpropertyeventfilters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Subpropertyeventfilters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse>>;
        list(params: Params$Resource$Properties$Subpropertyeventfilters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Subpropertyeventfilters$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse>): void;
        list(params: Params$Resource$Properties$Subpropertyeventfilters$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaListSubpropertyEventFiltersResponse>): void;
        /**
         * Updates a subproperty Event Filter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Subpropertyeventfilters$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Subpropertyeventfilters$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>>;
        patch(params: Params$Resource$Properties$Subpropertyeventfilters$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Subpropertyeventfilters$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        patch(params: Params$Resource$Properties$Subpropertyeventfilters$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter>): void;
    }
    export interface Params$Resource$Properties$Subpropertyeventfilters$Create extends StandardParameters {
        /**
         * Required. The ordinary property for which to create a subproperty event filter. Format: properties/property_id Example: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter;
    }
    export interface Params$Resource$Properties$Subpropertyeventfilters$Delete extends StandardParameters {
        /**
         * Required. Resource name of the subproperty event filter to delete. Format: properties/property_id/subpropertyEventFilters/subproperty_event_filter Example: properties/123/subpropertyEventFilters/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Subpropertyeventfilters$Get extends StandardParameters {
        /**
         * Required. Resource name of the subproperty event filter to lookup. Format: properties/property_id/subpropertyEventFilters/subproperty_event_filter Example: properties/123/subpropertyEventFilters/456
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Subpropertyeventfilters$List extends StandardParameters {
        /**
         * Optional. The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; (higher values will be coerced to the maximum)
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListSubpropertyEventFilters` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSubpropertyEventFilters` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the ordinary property. Format: properties/property_id Example: properties/123
         */
        parent?: string;
    }
    export interface Params$Resource$Properties$Subpropertyeventfilters$Patch extends StandardParameters {
        /**
         * Output only. Format: properties/{ordinary_property_id\}/subpropertyEventFilters/{sub_property_event_filter\} Example: properties/1234/subpropertyEventFilters/5678
         */
        name?: string;
        /**
         * Required. The list of fields to update. Field names must be in snake case (for example, "field_to_update"). Omitted fields will not be updated. To replace the entire entity, use one path with the string "*" to match all fields.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1alphaSubpropertyEventFilter;
    }
    export {};
}
