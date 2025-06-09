import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace analyticsdata_v1alpha {
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
     * Google Analytics Data API
     *
     * Accesses report data in Google Analytics.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const analyticsdata = google.analyticsdata('v1alpha');
     * ```
     */
    export class Analyticsdata {
        context: APIRequestContext;
        properties: Resource$Properties;
        v1alpha: Resource$V1alpha;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The batch request containing multiple pivot report requests.
     */
    export interface Schema$BatchRunPivotReportsRequest {
        /**
         * A property whose events are tracked. This entity must be specified for the batch. The entity within RunPivotReportRequest may either be unspecified or consistent with this entity.
         */
        entity?: Schema$Entity;
        /**
         * Individual requests. Each request has a separate pivot report response. Each batch request is allowed up to 5 requests.
         */
        requests?: Schema$RunPivotReportRequest[];
    }
    /**
     * The batch response containing multiple pivot reports.
     */
    export interface Schema$BatchRunPivotReportsResponse {
        /**
         * Individual responses. Each response has a separate pivot report request.
         */
        pivotReports?: Schema$RunPivotReportResponse[];
    }
    /**
     * The batch request containing multiple report requests.
     */
    export interface Schema$BatchRunReportsRequest {
        /**
         * A property whose events are tracked. This entity must be specified for the batch. The entity within RunReportRequest may either be unspecified or consistent with this entity.
         */
        entity?: Schema$Entity;
        /**
         * Individual requests. Each request has a separate report response. Each batch request is allowed up to 5 requests.
         */
        requests?: Schema$RunReportRequest[];
    }
    /**
     * The batch response containing multiple reports.
     */
    export interface Schema$BatchRunReportsResponse {
        /**
         * Individual responses. Each response has a separate report request.
         */
        reports?: Schema$RunReportResponse[];
    }
    /**
     * To express that the result needs to be between two numbers (inclusive).
     */
    export interface Schema$BetweenFilter {
        /**
         * Begins with this number.
         */
        fromValue?: Schema$NumericValue;
        /**
         * Ends with this number.
         */
        toValue?: Schema$NumericValue;
    }
    /**
     * Used to convert a dimension value to a single case.
     */
    export interface Schema$CaseExpression {
        /**
         * Name of a dimension. The name must refer back to a name in dimensions field of the request.
         */
        dimensionName?: string | null;
    }
    /**
     * Defines a cohort selection criteria. A cohort is a group of users who share a common characteristic. For example, users with the same `firstSessionDate` belong to the same cohort.
     */
    export interface Schema$Cohort {
        /**
         * The cohort selects users whose first touch date is between start date and end date defined in the `dateRange`. This `dateRange` does not specify the full date range of event data that is present in a cohort report. In a cohort report, this `dateRange` is extended by the granularity and offset present in the `cohortsRange`; event data for the extended reporting date range is present in a cohort report. In a cohort request, this `dateRange` is required and the `dateRanges` in the `RunReportRequest` or `RunPivotReportRequest` must be unspecified. This `dateRange` should generally be aligned with the cohort's granularity. If `CohortsRange` uses daily granularity, this `dateRange` can be a single day. If `CohortsRange` uses weekly granularity, this `dateRange` can be aligned to a week boundary, starting at Sunday and ending Saturday. If `CohortsRange` uses monthly granularity, this `dateRange` can be aligned to a month, starting at the first and ending on the last day of the month.
         */
        dateRange?: Schema$DateRange;
        /**
         * Dimension used by the cohort. Required and only supports `firstSessionDate`.
         */
        dimension?: string | null;
        /**
         * Assigns a name to this cohort. The dimension `cohort` is valued to this name in a report response. If set, cannot begin with `cohort_` or `RESERVED_`. If not set, cohorts are named by their zero based index `cohort_0`, `cohort_1`, etc.
         */
        name?: string | null;
    }
    /**
     * Optional settings of a cohort report.
     */
    export interface Schema$CohortReportSettings {
        /**
         * If true, accumulates the result from first touch day to the end day. Not supported in `RunReportRequest`.
         */
        accumulate?: boolean | null;
    }
    /**
     * The specification of cohorts for a cohort report. Cohort reports create a time series of user retention for the cohort. For example, you could select the cohort of users that were acquired in the first week of September and follow that cohort for the next six weeks. Selecting the users acquired in the first week of September cohort is specified in the `cohort` object. Following that cohort for the next six weeks is specified in the `cohortsRange` object. For examples, see [Cohort Report Examples](https://developers.google.com/analytics/devguides/reporting/data/v1/advanced#cohort_report_examples). The report response could show a weekly time series where say your app has retained 60% of this cohort after three weeks and 25% of this cohort after six weeks. These two percentages can be calculated by the metric `cohortActiveUsers/cohortTotalUsers` and will be separate rows in the report.
     */
    export interface Schema$CohortSpec {
        /**
         * Optional settings for a cohort report.
         */
        cohortReportSettings?: Schema$CohortReportSettings;
        /**
         * Defines the selection criteria to group users into cohorts. Most cohort reports define only a single cohort. If multiple cohorts are specified, each cohort can be recognized in the report by their name.
         */
        cohorts?: Schema$Cohort[];
        /**
         * Cohort reports follow cohorts over an extended reporting date range. This range specifies an offset duration to follow the cohorts over.
         */
        cohortsRange?: Schema$CohortsRange;
    }
    /**
     * Configures the extended reporting date range for a cohort report. Specifies an offset duration to follow the cohorts over.
     */
    export interface Schema$CohortsRange {
        /**
         * Required. `endOffset` specifies the end date of the extended reporting date range for a cohort report. `endOffset` can be any positive integer but is commonly set to 5 to 10 so that reports contain data on the cohort for the next several granularity time periods. If `granularity` is `DAILY`, the `endDate` of the extended reporting date range is `endDate` of the cohort plus `endOffset` days. If `granularity` is `WEEKLY`, the `endDate` of the extended reporting date range is `endDate` of the cohort plus `endOffset * 7` days. If `granularity` is `MONTHLY`, the `endDate` of the extended reporting date range is `endDate` of the cohort plus `endOffset * 30` days.
         */
        endOffset?: number | null;
        /**
         * Required. The granularity used to interpret the `startOffset` and `endOffset` for the extended reporting date range for a cohort report.
         */
        granularity?: string | null;
        /**
         * `startOffset` specifies the start date of the extended reporting date range for a cohort report. `startOffset` is commonly set to 0 so that reports contain data from the acquisition of the cohort forward. If `granularity` is `DAILY`, the `startDate` of the extended reporting date range is `startDate` of the cohort plus `startOffset` days. If `granularity` is `WEEKLY`, the `startDate` of the extended reporting date range is `startDate` of the cohort plus `startOffset * 7` days. If `granularity` is `MONTHLY`, the `startDate` of the extended reporting date range is `startDate` of the cohort plus `startOffset * 30` days.
         */
        startOffset?: number | null;
    }
    /**
     * Used to combine dimension values to a single dimension.
     */
    export interface Schema$ConcatenateExpression {
        /**
         * The delimiter placed between dimension names. Delimiters are often single characters such as "|" or "," but can be longer strings. If a dimension value contains the delimiter, both will be present in response with no distinction. For example if dimension 1 value = "US,FR", dimension 2 value = "JP", and delimiter = ",", then the response will contain "US,FR,JP".
         */
        delimiter?: string | null;
        /**
         * Names of dimensions. The names must refer back to names in the dimensions field of the request.
         */
        dimensionNames?: string[] | null;
    }
    /**
     * A contiguous set of days: startDate, startDate + 1, ..., endDate. Requests are allowed up to 4 date ranges.
     */
    export interface Schema$DateRange {
        /**
         * The inclusive end date for the query in the format `YYYY-MM-DD`. Cannot be before `start_date`. The format `NdaysAgo`, `yesterday`, or `today` is also accepted, and in that case, the date is inferred based on the property's reporting time zone.
         */
        endDate?: string | null;
        /**
         * Assigns a name to this date range. The dimension `dateRange` is valued to this name in a report response. If set, cannot begin with `date_range_` or `RESERVED_`. If not set, date ranges are named by their zero based index in the request: `date_range_0`, `date_range_1`, etc.
         */
        name?: string | null;
        /**
         * The inclusive start date for the query in the format `YYYY-MM-DD`. Cannot be after `end_date`. The format `NdaysAgo`, `yesterday`, or `today` is also accepted, and in that case, the date is inferred based on the property's reporting time zone.
         */
        startDate?: string | null;
    }
    /**
     * Dimensions are attributes of your data. For example, the dimension city indicates the city from which an event originates. Dimension values in report responses are strings; for example, city could be "Paris" or "New York". Requests are allowed up to 8 dimensions.
     */
    export interface Schema$Dimension {
        /**
         * One dimension can be the result of an expression of multiple dimensions. For example, dimension "country, city": concatenate(country, ", ", city).
         */
        dimensionExpression?: Schema$DimensionExpression;
        /**
         * The name of the dimension. See the [API Dimensions](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions) for the list of dimension names. If `dimensionExpression` is specified, `name` can be any string that you would like. For example if a `dimensionExpression` concatenates `country` and `city`, you could call that dimension `countryAndCity`. Dimensions are referenced by `name` in `dimensionFilter`, `orderBys`, `dimensionExpression`, and `pivots`.
         */
        name?: string | null;
    }
    /**
     * Used to express a dimension which is the result of a formula of multiple dimensions. Example usages: 1) lower_case(dimension) 2) concatenate(dimension1, symbol, dimension2).
     */
    export interface Schema$DimensionExpression {
        /**
         * Used to combine dimension values to a single dimension. For example, dimension "country, city": concatenate(country, ", ", city).
         */
        concatenate?: Schema$ConcatenateExpression;
        /**
         * Used to convert a dimension value to lower case.
         */
        lowerCase?: Schema$CaseExpression;
        /**
         * Used to convert a dimension value to upper case.
         */
        upperCase?: Schema$CaseExpression;
    }
    /**
     * Describes a dimension column in the report. Dimensions requested in a report produce column entries within rows and DimensionHeaders. However, dimensions used exclusively within filters or expressions do not produce columns in a report; correspondingly, those dimensions do not produce headers.
     */
    export interface Schema$DimensionHeader {
        /**
         * The dimension's name.
         */
        name?: string | null;
    }
    /**
     * Explains a dimension.
     */
    export interface Schema$DimensionMetadata {
        /**
         * This dimension's name. Useable in [Dimension](#Dimension)'s `name`. For example, `eventName`.
         */
        apiName?: string | null;
        /**
         * True if the dimension is a custom dimension for this property.
         */
        customDefinition?: boolean | null;
        /**
         * Still usable but deprecated names for this dimension. If populated, this dimension is available by either `apiName` or one of `deprecatedApiNames` for a period of time. After the deprecation period, the dimension will be available only by `apiName`.
         */
        deprecatedApiNames?: string[] | null;
        /**
         * Description of how this dimension is used and calculated.
         */
        description?: string | null;
        /**
         * This dimension's name within the Google Analytics user interface. For example, `Event name`.
         */
        uiName?: string | null;
    }
    /**
     * Sorts by dimension values.
     */
    export interface Schema$DimensionOrderBy {
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
     * The value of a dimension.
     */
    export interface Schema$DimensionValue {
        /**
         * Value as a string if the dimension type is a string.
         */
        value?: string | null;
    }
    /**
     * The unique identifier of the property whose events are tracked.
     */
    export interface Schema$Entity {
        /**
         * A Google Analytics GA4 property id. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id).
         */
        propertyId?: string | null;
    }
    /**
     * An expression to filter dimension or metric values.
     */
    export interface Schema$Filter {
        /**
         * A filter for two values.
         */
        betweenFilter?: Schema$BetweenFilter;
        /**
         * The dimension name or metric name. Must be a name defined in dimensions or metrics.
         */
        fieldName?: string | null;
        /**
         * A filter for in list values.
         */
        inListFilter?: Schema$InListFilter;
        /**
         * A filter for numeric or date values.
         */
        numericFilter?: Schema$NumericFilter;
        /**
         * Strings related filter.
         */
        stringFilter?: Schema$StringFilter;
    }
    /**
     * To express dimension or metric filters. The fields in the same FilterExpression need to be either all dimensions or all metrics.
     */
    export interface Schema$FilterExpression {
        /**
         * The FilterExpressions in and_group have an AND relationship.
         */
        andGroup?: Schema$FilterExpressionList;
        /**
         * A primitive filter. All fields in filter in same FilterExpression needs to be either all dimensions or metrics.
         */
        filter?: Schema$Filter;
        /**
         * The FilterExpression is NOT of not_expression.
         */
        notExpression?: Schema$FilterExpression;
        /**
         * The FilterExpressions in or_group have an OR relationship.
         */
        orGroup?: Schema$FilterExpressionList;
    }
    /**
     * A list of filter expressions.
     */
    export interface Schema$FilterExpressionList {
        /**
         * A list of filter expressions.
         */
        expressions?: Schema$FilterExpression[];
    }
    /**
     * The result needs to be in a list of string values.
     */
    export interface Schema$InListFilter {
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
     * The dimensions and metrics currently accepted in reporting methods.
     */
    export interface Schema$Metadata {
        /**
         * The dimension descriptions.
         */
        dimensions?: Schema$DimensionMetadata[];
        /**
         * The metric descriptions.
         */
        metrics?: Schema$MetricMetadata[];
        /**
         * Resource name of this metadata.
         */
        name?: string | null;
    }
    /**
     * The quantitative measurements of a report. For example, the metric `eventCount` is the total number of events. Requests are allowed up to 10 metrics.
     */
    export interface Schema$Metric {
        /**
         * A mathematical expression for derived metrics. For example, the metric Event count per user is `eventCount/totalUsers`.
         */
        expression?: string | null;
        /**
         * Indicates if a metric is invisible in the report response. If a metric is invisible, the metric will not produce a column in the response, but can be used in `metricFilter`, `orderBys`, or a metric `expression`.
         */
        invisible?: boolean | null;
        /**
         * The name of the metric. See the [API Metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics) for the list of metric names. If `expression` is specified, `name` can be any string that you would like. For example if `expression` is `screenPageViews/sessions`, you could call that metric's name = `viewsPerSession`. Metrics are referenced by `name` in `metricFilter`, `orderBys`, and metric `expression`.
         */
        name?: string | null;
    }
    /**
     * Describes a metric column in the report. Visible metrics requested in a report produce column entries within rows and MetricHeaders. However, metrics used exclusively within filters or expressions do not produce columns in a report; correspondingly, those metrics do not produce headers.
     */
    export interface Schema$MetricHeader {
        /**
         * The metric's name.
         */
        name?: string | null;
        /**
         * The metric's data type.
         */
        type?: string | null;
    }
    /**
     * Explains a metric.
     */
    export interface Schema$MetricMetadata {
        /**
         * A metric name. Useable in [Metric](#Metric)'s `name`. For example, `eventCount`.
         */
        apiName?: string | null;
        /**
         * True if the metric is a custom metric for this property.
         */
        customDefinition?: boolean | null;
        /**
         * Still usable but deprecated names for this metric. If populated, this metric is available by either `apiName` or one of `deprecatedApiNames` for a period of time. After the deprecation period, the metric will be available only by `apiName`.
         */
        deprecatedApiNames?: string[] | null;
        /**
         * Description of how this metric is used and calculated.
         */
        description?: string | null;
        /**
         * The mathematical expression for this derived metric. Can be used in [Metric](#Metric)'s `expression` field for equivalent reports. Most metrics are not expressions, and for non-expressions, this field is empty.
         */
        expression?: string | null;
        /**
         * The type of this metric.
         */
        type?: string | null;
        /**
         * This metric's name within the Google Analytics user interface. For example, `Event count`.
         */
        uiName?: string | null;
    }
    /**
     * Sorts by metric values.
     */
    export interface Schema$MetricOrderBy {
        /**
         * A metric name in the request to order by.
         */
        metricName?: string | null;
    }
    /**
     * The value of a metric.
     */
    export interface Schema$MetricValue {
        /**
         * Measurement value. See MetricHeader for type.
         */
        value?: string | null;
    }
    /**
     * Filters for numeric or date values.
     */
    export interface Schema$NumericFilter {
        /**
         * The operation type for this filter.
         */
        operation?: string | null;
        /**
         * A numeric value or a date value.
         */
        value?: Schema$NumericValue;
    }
    /**
     * To represent a number.
     */
    export interface Schema$NumericValue {
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
     * The sort options.
     */
    export interface Schema$OrderBy {
        /**
         * If true, sorts by descending order.
         */
        desc?: boolean | null;
        /**
         * Sorts results by a dimension's values.
         */
        dimension?: Schema$DimensionOrderBy;
        /**
         * Sorts results by a metric's values.
         */
        metric?: Schema$MetricOrderBy;
        /**
         * Sorts results by a metric's values within a pivot column group.
         */
        pivot?: Schema$PivotOrderBy;
    }
    /**
     * Describes the visible dimension columns and rows in the report response.
     */
    export interface Schema$Pivot {
        /**
         * Dimension names for visible columns in the report response. Including "dateRange" produces a date range column; for each row in the response, dimension values in the date range column will indicate the corresponding date range from the request.
         */
        fieldNames?: string[] | null;
        /**
         * The number of rows to return in this pivot. If the `limit` parameter is unspecified, up to 10,000 rows are returned. The product of the `limit` for each `pivot` in a `RunPivotReportRequest` must not exceed 100,000. For example, a two pivot request with `limit: 1000` in each pivot will fail because the product is `1,000,000`.
         */
        limit?: string | null;
        /**
         * Aggregate the metrics by dimensions in this pivot using the specified metric_aggregations.
         */
        metricAggregations?: string[] | null;
        /**
         * The row count of the start row. The first row is counted as row 0.
         */
        offset?: string | null;
        /**
         * Specifies how dimensions are ordered in the pivot. In the first Pivot, the OrderBys determine Row and PivotDimensionHeader ordering; in subsequent Pivots, the OrderBys determine only PivotDimensionHeader ordering. Dimensions specified in these OrderBys must be a subset of Pivot.field_names.
         */
        orderBys?: Schema$OrderBy[];
    }
    /**
     * Summarizes dimension values from a row for this pivot.
     */
    export interface Schema$PivotDimensionHeader {
        /**
         * Values of multiple dimensions in a pivot.
         */
        dimensionValues?: Schema$DimensionValue[];
    }
    /**
     * Dimensions' values in a single pivot.
     */
    export interface Schema$PivotHeader {
        /**
         * The size is the same as the cardinality of the corresponding dimension combinations.
         */
        pivotDimensionHeaders?: Schema$PivotDimensionHeader[];
        /**
         * The cardinality of the pivot. The total number of rows for this pivot's fields regardless of how the parameters `offset` and `limit` are specified in the request.
         */
        rowCount?: number | null;
    }
    /**
     * Sorts by a pivot column group.
     */
    export interface Schema$PivotOrderBy {
        /**
         * In the response to order by, order rows by this column. Must be a metric name from the request.
         */
        metricName?: string | null;
        /**
         * Used to select a dimension name and value pivot. If multiple pivot selections are given, the sort occurs on rows where all pivot selection dimension name and value pairs match the row's dimension name and value pair.
         */
        pivotSelections?: Schema$PivotSelection[];
    }
    /**
     * A pair of dimension names and values. Rows with this dimension pivot pair are ordered by the metric's value. For example if pivots = {{"browser", "Chrome"\}\} and metric_name = "Sessions", then the rows will be sorted based on Sessions in Chrome. ---------|----------|----------------|----------|---------------- | Chrome | Chrome | Safari | Safari ---------|----------|----------------|----------|---------------- Country | Sessions | Pages/Sessions | Sessions | Pages/Sessions ---------|----------|----------------|----------|---------------- US | 2 | 2 | 3 | 1 ---------|----------|----------------|----------|---------------- Canada | 3 | 1 | 4 | 1 ---------|----------|----------------|----------|----------------
     */
    export interface Schema$PivotSelection {
        /**
         * Must be a dimension name from the request.
         */
        dimensionName?: string | null;
        /**
         * Order by only when the named dimension is this value.
         */
        dimensionValue?: string | null;
    }
    /**
     * Current state of all quotas for this Analytics Property. If any quota for a property is exhausted, all requests to that property will return Resource Exhausted errors.
     */
    export interface Schema$PropertyQuota {
        /**
         * Standard Analytics Properties can send up to 10 concurrent requests; Analytics 360 Properties can use up to 50 concurrent requests.
         */
        concurrentRequests?: Schema$QuotaStatus;
        /**
         * Standard Analytics Properties and cloud project pairs can have up to 10 server errors per hour; Analytics 360 Properties and cloud project pairs can have up to 50 server errors per hour.
         */
        serverErrorsPerProjectPerHour?: Schema$QuotaStatus;
        /**
         * Standard Analytics Properties can use up to 25,000 tokens per day; Analytics 360 Properties can use 250,000 tokens per day. Most requests consume fewer than 10 tokens.
         */
        tokensPerDay?: Schema$QuotaStatus;
        /**
         * Standard Analytics Properties can use up to 5,000 tokens per hour; Analytics 360 Properties can use 50,000 tokens per hour. An API request consumes a single number of tokens, and that number is deducted from both the hourly and daily quotas.
         */
        tokensPerHour?: Schema$QuotaStatus;
    }
    /**
     * Current state for a particular quota group.
     */
    export interface Schema$QuotaStatus {
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
     * Response's metadata carrying additional information about the report content.
     */
    export interface Schema$ResponseMetaData {
        /**
         * If true, indicates some buckets of dimension combinations are rolled into "(other)" row. This can happen for high cardinality reports.
         */
        dataLossFromOtherRow?: boolean | null;
    }
    /**
     * Report data for each row. For example if RunReportRequest contains: ```none "dimensions": [ { "name": "eventName" \}, { "name": "countryId" \} ], "metrics": [ { "name": "eventCount" \} ] ``` One row with 'in_app_purchase' as the eventName, 'JP' as the countryId, and 15 as the eventCount, would be: ```none "dimensionValues": [ { "value": "in_app_purchase" \}, { "value": "JP" \} ], "metricValues": [ { "value": "15" \} ] ```
     */
    export interface Schema$Row {
        /**
         * List of requested dimension values. In a PivotReport, dimension_values are only listed for dimensions included in a pivot.
         */
        dimensionValues?: Schema$DimensionValue[];
        /**
         * List of requested visible metric values.
         */
        metricValues?: Schema$MetricValue[];
    }
    /**
     * The request to generate a pivot report.
     */
    export interface Schema$RunPivotReportRequest {
        /**
         * Cohort group associated with this request. If there is a cohort group in the request the 'cohort' dimension must be present.
         */
        cohortSpec?: Schema$CohortSpec;
        /**
         * A currency code in ISO4217 format, such as "AED", "USD", "JPY". If the field is empty, the report uses the entity's default currency.
         */
        currencyCode?: string | null;
        /**
         * The date range to retrieve event data for the report. If multiple date ranges are specified, event data from each date range is used in the report. A special dimension with field name "dateRange" can be included in a Pivot's field names; if included, the report compares between date ranges. In a cohort request, this `dateRanges` must be unspecified.
         */
        dateRanges?: Schema$DateRange[];
        /**
         * The filter clause of dimensions. Dimensions must be requested to be used in this filter. Metrics cannot be used in this filter.
         */
        dimensionFilter?: Schema$FilterExpression;
        /**
         * The dimensions requested. All defined dimensions must be used by one of the following: dimension_expression, dimension_filter, pivots, order_bys.
         */
        dimensions?: Schema$Dimension[];
        /**
         * A property whose events are tracked. Within a batch request, this entity should either be unspecified or consistent with the batch-level entity.
         */
        entity?: Schema$Entity;
        /**
         * If false or unspecified, each row with all metrics equal to 0 will not be returned. If true, these rows will be returned if they are not separately removed by a filter.
         */
        keepEmptyRows?: boolean | null;
        /**
         * The filter clause of metrics. Applied at post aggregation phase, similar to SQL having-clause. Metrics must be requested to be used in this filter. Dimensions cannot be used in this filter.
         */
        metricFilter?: Schema$FilterExpression;
        /**
         * The metrics requested, at least one metric needs to be specified. All defined metrics must be used by one of the following: metric_expression, metric_filter, order_bys.
         */
        metrics?: Schema$Metric[];
        /**
         * Describes the visual format of the report's dimensions in columns or rows. The union of the fieldNames (dimension names) in all pivots must be a subset of dimension names defined in Dimensions. No two pivots can share a dimension. A dimension is only visible if it appears in a pivot.
         */
        pivots?: Schema$Pivot[];
        /**
         * Toggles whether to return the current state of this Analytics Property's quota. Quota is returned in [PropertyQuota](#PropertyQuota).
         */
        returnPropertyQuota?: boolean | null;
    }
    /**
     * The response pivot report table corresponding to a pivot request.
     */
    export interface Schema$RunPivotReportResponse {
        /**
         * Aggregation of metric values. Can be totals, minimums, or maximums. The returned aggregations are controlled by the metric_aggregations in the pivot. The type of aggregation returned in each row is shown by the dimension_values which are set to "RESERVED_".
         */
        aggregates?: Schema$Row[];
        /**
         * Describes dimension columns. The number of DimensionHeaders and ordering of DimensionHeaders matches the dimensions present in rows.
         */
        dimensionHeaders?: Schema$DimensionHeader[];
        /**
         * Metadata for the report.
         */
        metadata?: Schema$ResponseMetaData;
        /**
         * Describes metric columns. The number of MetricHeaders and ordering of MetricHeaders matches the metrics present in rows.
         */
        metricHeaders?: Schema$MetricHeader[];
        /**
         * Summarizes the columns and rows created by a pivot. Each pivot in the request produces one header in the response. If we have a request like this: "pivots": [{ "fieldNames": ["country", "city"] \}, { "fieldNames": "eventName" \}] We will have the following `pivotHeaders` in the response: "pivotHeaders" : [{ "dimensionHeaders": [{ "dimensionValues": [ { "value": "United Kingdom" \}, { "value": "London" \} ] \}, { "dimensionValues": [ { "value": "Japan" \}, { "value": "Osaka" \} ] \}] \}, { "dimensionHeaders": [{ "dimensionValues": [{ "value": "session_start" \}] \}, { "dimensionValues": [{ "value": "scroll" \}] \}] \}]
         */
        pivotHeaders?: Schema$PivotHeader[];
        /**
         * This Analytics Property's quota state including this request.
         */
        propertyQuota?: Schema$PropertyQuota;
        /**
         * Rows of dimension value combinations and metric values in the report.
         */
        rows?: Schema$Row[];
    }
    /**
     * The request to generate a realtime report.
     */
    export interface Schema$RunRealtimeReportRequest {
        /**
         * The filter clause of dimensions. Dimensions must be requested to be used in this filter. Metrics cannot be used in this filter.
         */
        dimensionFilter?: Schema$FilterExpression;
        /**
         * The dimensions requested and displayed.
         */
        dimensions?: Schema$Dimension[];
        /**
         * The number of rows to return. If the `limit` parameter is unspecified, 10,000 rows are returned. The API returns a maximum of 100,000 rows per request, no matter how many you ask for.
         */
        limit?: string | null;
        /**
         * Aggregation of metrics. Aggregated metric values will be shown in rows where the dimension_values are set to "RESERVED_(MetricAggregation)".
         */
        metricAggregations?: string[] | null;
        /**
         * The filter clause of metrics. Applied at post aggregation phase, similar to SQL having-clause. Metrics must be requested to be used in this filter. Dimensions cannot be used in this filter.
         */
        metricFilter?: Schema$FilterExpression;
        /**
         * The metrics requested and displayed.
         */
        metrics?: Schema$Metric[];
        /**
         * Specifies how rows are ordered in the response.
         */
        orderBys?: Schema$OrderBy[];
        /**
         * Toggles whether to return the current state of this Analytics Property's Realtime quota. Quota is returned in [PropertyQuota](#PropertyQuota).
         */
        returnPropertyQuota?: boolean | null;
    }
    /**
     * The response realtime report table corresponding to a request.
     */
    export interface Schema$RunRealtimeReportResponse {
        /**
         * Describes dimension columns. The number of DimensionHeaders and ordering of DimensionHeaders matches the dimensions present in rows.
         */
        dimensionHeaders?: Schema$DimensionHeader[];
        /**
         * If requested, the maximum values of metrics.
         */
        maximums?: Schema$Row[];
        /**
         * Describes metric columns. The number of MetricHeaders and ordering of MetricHeaders matches the metrics present in rows.
         */
        metricHeaders?: Schema$MetricHeader[];
        /**
         * If requested, the minimum values of metrics.
         */
        minimums?: Schema$Row[];
        /**
         * This Analytics Property's Realtime quota state including this request.
         */
        propertyQuota?: Schema$PropertyQuota;
        /**
         * The total number of rows in the query result, regardless of the number of rows returned in the response. For example if a query returns 175 rows and includes limit = 50 in the API request, the response will contain row_count = 175 but only 50 rows.
         */
        rowCount?: number | null;
        /**
         * Rows of dimension value combinations and metric values in the report.
         */
        rows?: Schema$Row[];
        /**
         * If requested, the totaled values of metrics.
         */
        totals?: Schema$Row[];
    }
    /**
     * The request to generate a report.
     */
    export interface Schema$RunReportRequest {
        /**
         * Cohort group associated with this request. If there is a cohort group in the request the 'cohort' dimension must be present.
         */
        cohortSpec?: Schema$CohortSpec;
        /**
         * A currency code in ISO4217 format, such as "AED", "USD", "JPY". If the field is empty, the report uses the entity's default currency.
         */
        currencyCode?: string | null;
        /**
         * Date ranges of data to read. If multiple date ranges are requested, each response row will contain a zero based date range index. If two date ranges overlap, the event data for the overlapping days is included in the response rows for both date ranges. In a cohort request, this `dateRanges` must be unspecified.
         */
        dateRanges?: Schema$DateRange[];
        /**
         * The filter clause of dimensions. Dimensions must be requested to be used in this filter. Metrics cannot be used in this filter.
         */
        dimensionFilter?: Schema$FilterExpression;
        /**
         * The dimensions requested and displayed.
         */
        dimensions?: Schema$Dimension[];
        /**
         * A property whose events are tracked. Within a batch request, this entity should either be unspecified or consistent with the batch-level entity.
         */
        entity?: Schema$Entity;
        /**
         * If false or unspecified, each row with all metrics equal to 0 will not be returned. If true, these rows will be returned if they are not separately removed by a filter.
         */
        keepEmptyRows?: boolean | null;
        /**
         * The number of rows to return. If the `limit` parameter is unspecified, 10,000 rows are returned. The API returns a maximum of 100,000 rows per request, no matter how many you ask for.
         */
        limit?: string | null;
        /**
         * Aggregation of metrics. Aggregated metric values will be shown in rows where the dimension_values are set to "RESERVED_(MetricAggregation)".
         */
        metricAggregations?: string[] | null;
        /**
         * The filter clause of metrics. Applied at post aggregation phase, similar to SQL having-clause. Metrics must be requested to be used in this filter. Dimensions cannot be used in this filter.
         */
        metricFilter?: Schema$FilterExpression;
        /**
         * The metrics requested and displayed.
         */
        metrics?: Schema$Metric[];
        /**
         * The row count of the start row. The first row is counted as row 0.
         */
        offset?: string | null;
        /**
         * Specifies how rows are ordered in the response.
         */
        orderBys?: Schema$OrderBy[];
        /**
         * Toggles whether to return the current state of this Analytics Property's quota. Quota is returned in [PropertyQuota](#PropertyQuota).
         */
        returnPropertyQuota?: boolean | null;
    }
    /**
     * The response report table corresponding to a request.
     */
    export interface Schema$RunReportResponse {
        /**
         * Describes dimension columns. The number of DimensionHeaders and ordering of DimensionHeaders matches the dimensions present in rows.
         */
        dimensionHeaders?: Schema$DimensionHeader[];
        /**
         * If requested, the maximum values of metrics.
         */
        maximums?: Schema$Row[];
        /**
         * Metadata for the report.
         */
        metadata?: Schema$ResponseMetaData;
        /**
         * Describes metric columns. The number of MetricHeaders and ordering of MetricHeaders matches the metrics present in rows.
         */
        metricHeaders?: Schema$MetricHeader[];
        /**
         * If requested, the minimum values of metrics.
         */
        minimums?: Schema$Row[];
        /**
         * This Analytics Property's quota state including this request.
         */
        propertyQuota?: Schema$PropertyQuota;
        /**
         * The total number of rows in the query result, regardless of the number of rows returned in the response. For example if a query returns 175 rows and includes limit = 50 in the API request, the response will contain row_count = 175 but only 50 rows. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        rowCount?: number | null;
        /**
         * Rows of dimension value combinations and metric values in the report.
         */
        rows?: Schema$Row[];
        /**
         * If requested, the totaled values of metrics.
         */
        totals?: Schema$Row[];
    }
    /**
     * The filter for string
     */
    export interface Schema$StringFilter {
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
    export class Resource$Properties {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns metadata for dimensions and metrics available in reporting methods. Used to explore the dimensions and metrics. In this method, a Google Analytics GA4 Property Identifier is specified in the request, and the metadata response includes Custom dimensions and metrics as well as Universal metadata. For example if a custom metric with parameter name `levels_unlocked` is registered to a property, the Metadata response will contain `customEvent:levels_unlocked`. Universal metadata are dimensions and metrics applicable to any property such as `country` and `totalUsers`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.properties.getMetadata({
         *     // Required. The resource name of the metadata to retrieve. This name field is specified in the URL path and not URL parameters. Property is a numeric Google Analytics GA4 Property identifier. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Example: properties/1234/metadata Set the Property ID to 0 for dimensions and metrics common to all properties. In this special mode, this method will not return custom dimensions and metrics.
         *     name: 'properties/my-propertie/metadata',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dimensions": [],
         *   //   "metrics": [],
         *   //   "name": "my_name"
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
        getMetadata(params: Params$Resource$Properties$Getmetadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMetadata(params?: Params$Resource$Properties$Getmetadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Metadata>>;
        getMetadata(params: Params$Resource$Properties$Getmetadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMetadata(params: Params$Resource$Properties$Getmetadata, options: MethodOptions | BodyResponseCallback<Schema$Metadata>, callback: BodyResponseCallback<Schema$Metadata>): void;
        getMetadata(params: Params$Resource$Properties$Getmetadata, callback: BodyResponseCallback<Schema$Metadata>): void;
        getMetadata(callback: BodyResponseCallback<Schema$Metadata>): void;
        /**
         * The Google Analytics Realtime API returns a customized report of realtime event data for your property. These reports show events and usage from the last 30 minutes.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.properties.runRealtimeReport({
         *     // A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Example: properties/1234
         *     property: 'properties/my-propertie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dimensionFilter": {},
         *       //   "dimensions": [],
         *       //   "limit": "my_limit",
         *       //   "metricAggregations": [],
         *       //   "metricFilter": {},
         *       //   "metrics": [],
         *       //   "orderBys": [],
         *       //   "returnPropertyQuota": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dimensionHeaders": [],
         *   //   "maximums": [],
         *   //   "metricHeaders": [],
         *   //   "minimums": [],
         *   //   "propertyQuota": {},
         *   //   "rowCount": 0,
         *   //   "rows": [],
         *   //   "totals": []
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
        runRealtimeReport(params: Params$Resource$Properties$Runrealtimereport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runRealtimeReport(params?: Params$Resource$Properties$Runrealtimereport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RunRealtimeReportResponse>>;
        runRealtimeReport(params: Params$Resource$Properties$Runrealtimereport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runRealtimeReport(params: Params$Resource$Properties$Runrealtimereport, options: MethodOptions | BodyResponseCallback<Schema$RunRealtimeReportResponse>, callback: BodyResponseCallback<Schema$RunRealtimeReportResponse>): void;
        runRealtimeReport(params: Params$Resource$Properties$Runrealtimereport, callback: BodyResponseCallback<Schema$RunRealtimeReportResponse>): void;
        runRealtimeReport(callback: BodyResponseCallback<Schema$RunRealtimeReportResponse>): void;
    }
    export interface Params$Resource$Properties$Getmetadata extends StandardParameters {
        /**
         * Required. The resource name of the metadata to retrieve. This name field is specified in the URL path and not URL parameters. Property is a numeric Google Analytics GA4 Property identifier. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Example: properties/1234/metadata Set the Property ID to 0 for dimensions and metrics common to all properties. In this special mode, this method will not return custom dimensions and metrics.
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Runrealtimereport extends StandardParameters {
        /**
         * A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Example: properties/1234
         */
        property?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunRealtimeReportRequest;
    }
    export class Resource$V1alpha {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns multiple pivot reports in a batch. All reports must be for the same Entity.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.batchRunPivotReports({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "entity": {},
         *       //   "requests": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "pivotReports": []
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
        batchRunPivotReports(params: Params$Resource$V1alpha$Batchrunpivotreports, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchRunPivotReports(params?: Params$Resource$V1alpha$Batchrunpivotreports, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BatchRunPivotReportsResponse>>;
        batchRunPivotReports(params: Params$Resource$V1alpha$Batchrunpivotreports, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchRunPivotReports(params: Params$Resource$V1alpha$Batchrunpivotreports, options: MethodOptions | BodyResponseCallback<Schema$BatchRunPivotReportsResponse>, callback: BodyResponseCallback<Schema$BatchRunPivotReportsResponse>): void;
        batchRunPivotReports(params: Params$Resource$V1alpha$Batchrunpivotreports, callback: BodyResponseCallback<Schema$BatchRunPivotReportsResponse>): void;
        batchRunPivotReports(callback: BodyResponseCallback<Schema$BatchRunPivotReportsResponse>): void;
        /**
         * Returns multiple reports in a batch. All reports must be for the same Entity.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.batchRunReports({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "entity": {},
         *       //   "requests": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "reports": []
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
        batchRunReports(params: Params$Resource$V1alpha$Batchrunreports, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchRunReports(params?: Params$Resource$V1alpha$Batchrunreports, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BatchRunReportsResponse>>;
        batchRunReports(params: Params$Resource$V1alpha$Batchrunreports, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchRunReports(params: Params$Resource$V1alpha$Batchrunreports, options: MethodOptions | BodyResponseCallback<Schema$BatchRunReportsResponse>, callback: BodyResponseCallback<Schema$BatchRunReportsResponse>): void;
        batchRunReports(params: Params$Resource$V1alpha$Batchrunreports, callback: BodyResponseCallback<Schema$BatchRunReportsResponse>): void;
        batchRunReports(callback: BodyResponseCallback<Schema$BatchRunReportsResponse>): void;
        /**
         * Returns a customized pivot report of your Google Analytics event data. Pivot reports are more advanced and expressive formats than regular reports. In a pivot report, dimensions are only visible if they are included in a pivot. Multiple pivots can be specified to further dissect your data.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.runPivotReport({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cohortSpec": {},
         *       //   "currencyCode": "my_currencyCode",
         *       //   "dateRanges": [],
         *       //   "dimensionFilter": {},
         *       //   "dimensions": [],
         *       //   "entity": {},
         *       //   "keepEmptyRows": false,
         *       //   "metricFilter": {},
         *       //   "metrics": [],
         *       //   "pivots": [],
         *       //   "returnPropertyQuota": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "aggregates": [],
         *   //   "dimensionHeaders": [],
         *   //   "metadata": {},
         *   //   "metricHeaders": [],
         *   //   "pivotHeaders": [],
         *   //   "propertyQuota": {},
         *   //   "rows": []
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
        runPivotReport(params: Params$Resource$V1alpha$Runpivotreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runPivotReport(params?: Params$Resource$V1alpha$Runpivotreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RunPivotReportResponse>>;
        runPivotReport(params: Params$Resource$V1alpha$Runpivotreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runPivotReport(params: Params$Resource$V1alpha$Runpivotreport, options: MethodOptions | BodyResponseCallback<Schema$RunPivotReportResponse>, callback: BodyResponseCallback<Schema$RunPivotReportResponse>): void;
        runPivotReport(params: Params$Resource$V1alpha$Runpivotreport, callback: BodyResponseCallback<Schema$RunPivotReportResponse>): void;
        runPivotReport(callback: BodyResponseCallback<Schema$RunPivotReportResponse>): void;
        /**
         * Returns a customized report of your Google Analytics event data. Reports contain statistics derived from data collected by the Google Analytics tracking code. The data returned from the API is as a table with columns for the requested dimensions and metrics. Metrics are individual measurements of user activity on your property, such as active users or event count. Dimensions break down metrics across some common criteria, such as country or event name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/analyticsdata.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const analyticsdata = google.analyticsdata('v1alpha');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/analytics',
         *       'https://www.googleapis.com/auth/analytics.readonly',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await analyticsdata.runReport({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cohortSpec": {},
         *       //   "currencyCode": "my_currencyCode",
         *       //   "dateRanges": [],
         *       //   "dimensionFilter": {},
         *       //   "dimensions": [],
         *       //   "entity": {},
         *       //   "keepEmptyRows": false,
         *       //   "limit": "my_limit",
         *       //   "metricAggregations": [],
         *       //   "metricFilter": {},
         *       //   "metrics": [],
         *       //   "offset": "my_offset",
         *       //   "orderBys": [],
         *       //   "returnPropertyQuota": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dimensionHeaders": [],
         *   //   "maximums": [],
         *   //   "metadata": {},
         *   //   "metricHeaders": [],
         *   //   "minimums": [],
         *   //   "propertyQuota": {},
         *   //   "rowCount": 0,
         *   //   "rows": [],
         *   //   "totals": []
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
        runReport(params: Params$Resource$V1alpha$Runreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runReport(params?: Params$Resource$V1alpha$Runreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RunReportResponse>>;
        runReport(params: Params$Resource$V1alpha$Runreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runReport(params: Params$Resource$V1alpha$Runreport, options: MethodOptions | BodyResponseCallback<Schema$RunReportResponse>, callback: BodyResponseCallback<Schema$RunReportResponse>): void;
        runReport(params: Params$Resource$V1alpha$Runreport, callback: BodyResponseCallback<Schema$RunReportResponse>): void;
        runReport(callback: BodyResponseCallback<Schema$RunReportResponse>): void;
    }
    export interface Params$Resource$V1alpha$Batchrunpivotreports extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$BatchRunPivotReportsRequest;
    }
    export interface Params$Resource$V1alpha$Batchrunreports extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$BatchRunReportsRequest;
    }
    export interface Params$Resource$V1alpha$Runpivotreport extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunPivotReportRequest;
    }
    export interface Params$Resource$V1alpha$Runreport extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunReportRequest;
    }
    export {};
}
