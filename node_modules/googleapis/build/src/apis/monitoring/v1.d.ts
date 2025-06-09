import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace monitoring_v1 {
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
     * Cloud Monitoring API
     *
     * Manages your Cloud Monitoring data and configurations.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const monitoring = google.monitoring('v1');
     * ```
     */
    export class Monitoring {
        context: APIRequestContext;
        locations: Resource$Locations;
        operations: Resource$Operations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Describes how to combine multiple time series to provide a different view of the data. Aggregation of time series is done in two steps. First, each time series in the set is aligned to the same time interval boundaries, then the set of time series is optionally reduced in number.Alignment consists of applying the per_series_aligner operation to each time series after its data has been divided into regular alignment_period time intervals. This process takes all of the data points in an alignment period, applies a mathematical transformation such as averaging, minimum, maximum, delta, etc., and converts them into a single data point per period.Reduction is when the aligned and transformed time series can optionally be combined, reducing the number of time series through similar mathematical transformations. Reduction involves applying a cross_series_reducer to all the time series, optionally sorting the time series into subsets with group_by_fields, and applying the reducer to each subset.The raw time series data can contain a huge amount of information from multiple sources. Alignment and reduction transforms this mass of data into a more manageable and representative collection of data, for example "the 95% latency across the average of all tasks in a cluster". This representative data can be more easily graphed and comprehended, and the individual time series data is still available for later drilldown. For more details, see Filtering and aggregation (https://cloud.google.com/monitoring/api/v3/aggregation).
     */
    export interface Schema$Aggregation {
        /**
         * The alignment_period specifies a time interval, in seconds, that is used to divide the data in all the time series into consistent blocks of time. This will be done before the per-series aligner can be applied to the data.The value must be at least 60 seconds. If a per-series aligner other than ALIGN_NONE is specified, this field is required or an error is returned. If no per-series aligner is specified, or the aligner ALIGN_NONE is specified, then this field is ignored.The maximum value of the alignment_period is 2 years, or 104 weeks.
         */
        alignmentPeriod?: string | null;
        /**
         * The reduction operation to be used to combine time series into a single time series, where the value of each data point in the resulting series is a function of all the already aligned values in the input time series.Not all reducer operations can be applied to all time series. The valid choices depend on the metric_kind and the value_type of the original time series. Reduction can yield a time series with a different metric_kind or value_type than the input time series.Time series data must first be aligned (see per_series_aligner) in order to perform cross-time series reduction. If cross_series_reducer is specified, then per_series_aligner must be specified, and must not be ALIGN_NONE. An alignment_period must also be specified; otherwise, an error is returned.
         */
        crossSeriesReducer?: string | null;
        /**
         * The set of fields to preserve when cross_series_reducer is specified. The group_by_fields determine how the time series are partitioned into subsets prior to applying the aggregation operation. Each subset contains time series that have the same value for each of the grouping fields. Each individual time series is a member of exactly one subset. The cross_series_reducer is applied to each subset of time series. It is not possible to reduce across different resource types, so this field implicitly contains resource.type. Fields not specified in group_by_fields are aggregated away. If group_by_fields is not specified and all the time series have the same resource type, then the time series are aggregated into a single output time series. If cross_series_reducer is not defined, this field is ignored.
         */
        groupByFields?: string[] | null;
        /**
         * An Aligner describes how to bring the data points in a single time series into temporal alignment. Except for ALIGN_NONE, all alignments cause all the data points in an alignment_period to be mathematically grouped together, resulting in a single data point for each alignment_period with end timestamp at the end of the period.Not all alignment operations may be applied to all time series. The valid choices depend on the metric_kind and value_type of the original time series. Alignment can change the metric_kind or the value_type of the time series.Time series data must be aligned in order to perform cross-time series reduction. If cross_series_reducer is specified, then per_series_aligner must be specified and not equal to ALIGN_NONE and alignment_period must be specified; otherwise, an error is returned.
         */
        perSeriesAligner?: string | null;
    }
    /**
     * A chart that displays alert policy data.
     */
    export interface Schema$AlertChart {
        /**
         * Required. The resource name of the alert policy. The format is: projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[ALERT_POLICY_ID]
         */
        name?: string | null;
    }
    /**
     * A chart axis.
     */
    export interface Schema$Axis {
        /**
         * The label of the axis.
         */
        label?: string | null;
        /**
         * The axis scale. By default, a linear scale is used.
         */
        scale?: string | null;
    }
    /**
     * Options to control visual rendering of a chart.
     */
    export interface Schema$ChartOptions {
        /**
         * The chart mode.
         */
        mode?: string | null;
    }
    /**
     * A widget that groups the other widgets. All widgets that are within the area spanned by the grouping widget are considered member widgets.
     */
    export interface Schema$CollapsibleGroup {
        /**
         * The collapsed state of the widget on first page load.
         */
        collapsed?: boolean | null;
    }
    /**
     * Defines the layout properties and content for a column.
     */
    export interface Schema$Column {
        /**
         * The relative weight of this column. The column weight is used to adjust the width of columns on the screen (relative to peers). Greater the weight, greater the width of the column on the screen. If omitted, a value of 1 is used while rendering.
         */
        weight?: string | null;
        /**
         * The display widgets arranged vertically in this column.
         */
        widgets?: Schema$Widget[];
    }
    /**
     * A simplified layout that divides the available space into vertical columns and arranges a set of widgets vertically in each column.
     */
    export interface Schema$ColumnLayout {
        /**
         * The columns of content to display.
         */
        columns?: Schema$Column[];
    }
    /**
     * A Google Stackdriver dashboard. Dashboards define the content and layout of pages in the Stackdriver web application.
     */
    export interface Schema$Dashboard {
        /**
         * The content is divided into equally spaced columns and the widgets are arranged vertically.
         */
        columnLayout?: Schema$ColumnLayout;
        /**
         * Filters to reduce the amount of data charted based on the filter criteria.
         */
        dashboardFilters?: Schema$DashboardFilter[];
        /**
         * Required. The mutable, human-readable name.
         */
        displayName?: string | null;
        /**
         * etag is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. An etag is returned in the response to GetDashboard, and users are expected to put that etag in the request to UpdateDashboard to ensure that their change will be applied to the same version of the Dashboard configuration. The field should not be passed during dashboard creation.
         */
        etag?: string | null;
        /**
         * Content is arranged with a basic layout that re-flows a simple list of informational elements like widgets or tiles.
         */
        gridLayout?: Schema$GridLayout;
        /**
         * Labels applied to the dashboard
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The content is arranged as a grid of tiles, with each content widget occupying one or more grid blocks.
         */
        mosaicLayout?: Schema$MosaicLayout;
        /**
         * Immutable. The resource name of the dashboard.
         */
        name?: string | null;
        /**
         * The content is divided into equally spaced rows and the widgets are arranged horizontally.
         */
        rowLayout?: Schema$RowLayout;
    }
    /**
     * A filter to reduce the amount of data charted in relevant widgets.
     */
    export interface Schema$DashboardFilter {
        /**
         * The specified filter type
         */
        filterType?: string | null;
        /**
         * Required. The key for the label
         */
        labelKey?: string | null;
        /**
         * A variable-length string value.
         */
        stringValue?: string | null;
        /**
         * The placeholder text that can be referenced in a filter string or MQL query. If omitted, the dashboard filter will be applied to all relevant widgets in the dashboard.
         */
        templateVariable?: string | null;
    }
    /**
     * Groups a time series query definition with charting options.
     */
    export interface Schema$DataSet {
        /**
         * A template string for naming TimeSeries in the resulting data set. This should be a string with interpolations of the form ${label_name\}, which will resolve to the label's value.
         */
        legendTemplate?: string | null;
        /**
         * Optional. The lower bound on data point frequency for this data set, implemented by specifying the minimum alignment period to use in a time series query For example, if the data is published once every 10 minutes, the min_alignment_period should be at least 10 minutes. It would not make sense to fetch and align data at one minute intervals.
         */
        minAlignmentPeriod?: string | null;
        /**
         * How this data should be plotted on the chart.
         */
        plotType?: string | null;
        /**
         * Optional. The target axis to use for plotting the metric.
         */
        targetAxis?: string | null;
        /**
         * Required. Fields for querying time series data from the Stackdriver metrics API.
         */
        timeSeriesQuery?: Schema$TimeSeriesQuery;
    }
    /**
     * A set of (label, value) pairs that were removed from a Distribution time series during aggregation and then added as an attachment to a Distribution.Exemplar.The full label set for the exemplars is constructed by using the dropped pairs in combination with the label values that remain on the aggregated Distribution time series. The constructed full label set can be used to identify the specific entity, such as the instance or job, which might be contributing to a long-tail. However, with dropped labels, the storage requirements are reduced because only the aggregated distribution values for a large group of time series are stored.Note that there are no guarantees on ordering of the labels from exemplar-to-exemplar and from distribution-to-distribution in the same stream, and there may be duplicates. It is up to clients to resolve any ambiguities.
     */
    export interface Schema$DroppedLabels {
        /**
         * Map from label to its value, for all labels dropped in any aggregation.
         */
        label?: {
            [key: string]: string;
        } | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * A single field of a message type.
     */
    export interface Schema$Field {
        /**
         * The field cardinality.
         */
        cardinality?: string | null;
        /**
         * The string value of the default value of this field. Proto2 syntax only.
         */
        defaultValue?: string | null;
        /**
         * The field JSON name.
         */
        jsonName?: string | null;
        /**
         * The field type.
         */
        kind?: string | null;
        /**
         * The field name.
         */
        name?: string | null;
        /**
         * The field number.
         */
        number?: number | null;
        /**
         * The index of the field type in Type.oneofs, for message or enumeration types. The first type has index 1; zero means the type is not in the list.
         */
        oneofIndex?: number | null;
        /**
         * The protocol buffer options.
         */
        options?: Schema$Option[];
        /**
         * Whether to use alternative packed wire representation.
         */
        packed?: boolean | null;
        /**
         * The field type URL, without the scheme, for message or enumeration types. Example: "type.googleapis.com/google.protobuf.Timestamp".
         */
        typeUrl?: string | null;
    }
    /**
     * A gauge chart shows where the current value sits within a pre-defined range. The upper and lower bounds should define the possible range of values for the scorecard's query (inclusive).
     */
    export interface Schema$GaugeView {
        /**
         * The lower bound for this gauge chart. The value of the chart should always be greater than or equal to this.
         */
        lowerBound?: number | null;
        /**
         * The upper bound for this gauge chart. The value of the chart should always be less than or equal to this.
         */
        upperBound?: number | null;
    }
    /**
     * A basic layout divides the available space into vertical columns of equal width and arranges a list of widgets using a row-first strategy.
     */
    export interface Schema$GridLayout {
        /**
         * The number of columns into which the view's width is divided. If omitted or set to zero, a system default will be used while rendering.
         */
        columns?: string | null;
        /**
         * The informational elements that are arranged into the columns row-first.
         */
        widgets?: Schema$Widget[];
    }
    /**
     * Message that represents an arbitrary HTTP body. It should only be used for payload formats that can't be represented as JSON, such as raw binary or an HTML page.This message can be used both in streaming and non-streaming API methods in the request as well as the response.It can be used as a top-level request field, which is convenient if one wants to extract parameters from either the URL or HTTP template into the request fields and also want access to the raw HTTP body.Example: message GetResourceRequest { // A unique request id. string request_id = 1; // The raw HTTP body is bound to this field. google.api.HttpBody http_body = 2; \} service ResourceService { rpc GetResource(GetResourceRequest) returns (google.api.HttpBody); rpc UpdateResource(google.api.HttpBody) returns (google.protobuf.Empty); \} Example with streaming methods: service CaldavService { rpc GetCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); rpc UpdateCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); \} Use of this type only changes how the request and response bodies are handled, all other features will continue to work unchanged.
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
     * The ListDashboards request.
     */
    export interface Schema$ListDashboardsResponse {
        /**
         * The list of requested dashboards.
         */
        dashboards?: Schema$Dashboard[];
        /**
         * If there are more results than have been returned, then this field is set to a non-empty value. To see the additional results, use that value as page_token in the next call to this method.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for the ListMetricsScopesByMonitoredProject method.
     */
    export interface Schema$ListMetricsScopesByMonitoredProjectResponse {
        /**
         * A set of all metrics scopes that the specified monitored project has been added to.
         */
        metricsScopes?: Schema$MetricsScope[];
    }
    /**
     * A widget that displays a stream of log.
     */
    export interface Schema$LogsPanel {
        /**
         * A filter that chooses which log entries to return. See Advanced Logs Queries (https://cloud.google.com/logging/docs/view/advanced-queries). Only log entries that match the filter are returned. An empty filter matches all log entries.
         */
        filter?: string | null;
        /**
         * The names of logging resources to collect logs for. Currently only projects are supported. If empty, the widget will default to the host project.
         */
        resourceNames?: string[] | null;
    }
    /**
     * Represents a Metrics Scope (https://cloud.google.com/monitoring/settings#concept-scope) in Cloud Monitoring, which specifies one or more Google projects and zero or more AWS accounts to monitor together.
     */
    export interface Schema$MetricsScope {
        /**
         * Output only. The time when this Metrics Scope was created.
         */
        createTime?: string | null;
        /**
         * Output only. The list of projects monitored by this Metrics Scope.
         */
        monitoredProjects?: Schema$MonitoredProject[];
        /**
         * Immutable. The resource name of the Monitoring Metrics Scope. On input, the resource name can be specified with the scoping project ID or number. On output, the resource name is specified with the scoping project number. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}
         */
        name?: string | null;
        /**
         * Output only. The time when this Metrics Scope record was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A project being monitored (https://cloud.google.com/monitoring/settings/multiple-projects#create-multi) by a Metrics Scope.
     */
    export interface Schema$MonitoredProject {
        /**
         * Output only. The time when this MonitoredProject was created.
         */
        createTime?: string | null;
        /**
         * Immutable. The resource name of the MonitoredProject. On input, the resource name includes the scoping project ID and monitored project ID. On output, it contains the equivalent project numbers. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}/projects/{MONITORED_PROJECT_ID_OR_NUMBER\}
         */
        name?: string | null;
    }
    /**
     * A mosaic layout divides the available space into a grid of blocks, and overlays the grid with tiles. Unlike GridLayout, tiles may span multiple grid blocks and can be placed at arbitrary locations in the grid.
     */
    export interface Schema$MosaicLayout {
        /**
         * The number of columns in the mosaic grid. The number of columns must be between 1 and 12, inclusive.
         */
        columns?: number | null;
        /**
         * The tiles to display.
         */
        tiles?: Schema$Tile[];
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$Operation {
        /**
         * If the value is false, it means the operation is still in progress. If true, the operation is completed, and either error or response is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$Status;
        /**
         * Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the name should be a resource name ending with operations/{unique_id\}.
         */
        name?: string | null;
        /**
         * The normal response of the operation in case of success. If the original method returns no data on success, such as Delete, the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. For other methods, the response should have the type XxxResponse, where Xxx is the original method name. For example, if the original method name is TakeSnapshot(), the inferred response type is TakeSnapshotResponse.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Contains metadata for longrunning operation for the edit Metrics Scope endpoints.
     */
    export interface Schema$OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A protocol buffer option, which can be attached to a message, field, enumeration, etc.
     */
    export interface Schema$Option {
        /**
         * The option's name. For protobuf built-in options (options defined in descriptor.proto), this is the short name. For example, "map_entry". For custom options, it should be the fully-qualified name. For example, "google.api.http".
         */
        name?: string | null;
        /**
         * The option's value packed in an Any message. If the value is a primitive, the corresponding wrapper type defined in google/protobuf/wrappers.proto should be used. If the value is an enum, it should be stored as an int32 value using the google.protobuf.Int32Value type.
         */
        value?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Describes a ranking-based time series filter. Each input time series is ranked with an aligner. The filter will allow up to num_time_series time series to pass through it, selecting them based on the relative ranking.For example, if ranking_method is METHOD_MEAN,direction is BOTTOM, and num_time_series is 3, then the 3 times series with the lowest mean values will pass through the filter.
     */
    export interface Schema$PickTimeSeriesFilter {
        /**
         * How to use the ranking to select time series that pass through the filter.
         */
        direction?: string | null;
        /**
         * How many time series to allow to pass through the filter.
         */
        numTimeSeries?: number | null;
        /**
         * ranking_method is applied to each time series independently to produce the value which will be used to compare the time series to other time series.
         */
        rankingMethod?: string | null;
    }
    /**
     * QueryInstantRequest holds all parameters of the Prometheus upstream instant query API plus GCM specific parameters.
     */
    export interface Schema$QueryInstantRequest {
        /**
         * A PromQL query string. Query lanauge documentation: https://prometheus.io/docs/prometheus/latest/querying/basics/.
         */
        query?: string | null;
        /**
         * The single point in time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        time?: string | null;
        /**
         * An upper bound timeout for the query. Either a Prometheus duration string (https://prometheus.io/docs/prometheus/latest/querying/basics/#time-durations) or floating point seconds. This non-standard encoding must be used for compatibility with the open source API. Clients may still implement timeouts at the connection level while ignoring this field.
         */
        timeout?: string | null;
    }
    /**
     * QueryRangeRequest holds all parameters of the Prometheus upstream range query API plus GCM specific parameters.
     */
    export interface Schema$QueryRangeRequest {
        /**
         * The end time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        end?: string | null;
        /**
         * A PromQL query string. Query lanauge documentation: https://prometheus.io/docs/prometheus/latest/querying/basics/.
         */
        query?: string | null;
        /**
         * The start time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        start?: string | null;
        /**
         * The resolution of query result. Either a Prometheus duration string (https://prometheus.io/docs/prometheus/latest/querying/basics/#time-durations) or floating point seconds. This non-standard encoding must be used for compatibility with the open source API. Clients may still implement timeouts at the connection level while ignoring this field.
         */
        step?: string | null;
        /**
         * An upper bound timeout for the query. Either a Prometheus duration string (https://prometheus.io/docs/prometheus/latest/querying/basics/#time-durations) or floating point seconds. This non-standard encoding must be used for compatibility with the open source API. Clients may still implement timeouts at the connection level while ignoring this field.
         */
        timeout?: string | null;
    }
    /**
     * QuerySeries holds all parameters of the Prometheus upstream API for querying series.
     */
    export interface Schema$QuerySeriesRequest {
        /**
         * The end time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        end?: string | null;
        /**
         * The start time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        start?: string | null;
    }
    /**
     * Describes a query to build the numerator or denominator of a TimeSeriesFilterRatio.
     */
    export interface Schema$RatioPart {
        /**
         * By default, the raw time series data is returned. Use this field to combine multiple time series for different views of the data.
         */
        aggregation?: Schema$Aggregation;
        /**
         * Required. The monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) that identifies the metric types, resources, and projects to query.
         */
        filter?: string | null;
    }
    /**
     * Defines the layout properties and content for a row.
     */
    export interface Schema$Row {
        /**
         * The relative weight of this row. The row weight is used to adjust the height of rows on the screen (relative to peers). Greater the weight, greater the height of the row on the screen. If omitted, a value of 1 is used while rendering.
         */
        weight?: string | null;
        /**
         * The display widgets arranged horizontally in this row.
         */
        widgets?: Schema$Widget[];
    }
    /**
     * A simplified layout that divides the available space into rows and arranges a set of widgets horizontally in each row.
     */
    export interface Schema$RowLayout {
        /**
         * The rows of content to display.
         */
        rows?: Schema$Row[];
    }
    /**
     * A widget showing the latest value of a metric, and how this value relates to one or more thresholds.
     */
    export interface Schema$Scorecard {
        /**
         * Will cause the scorecard to show a gauge chart.
         */
        gaugeView?: Schema$GaugeView;
        /**
         * Will cause the scorecard to show a spark chart.
         */
        sparkChartView?: Schema$SparkChartView;
        /**
         * The thresholds used to determine the state of the scorecard given the time series' current value. For an actual value x, the scorecard is in a danger state if x is less than or equal to a danger threshold that triggers below, or greater than or equal to a danger threshold that triggers above. Similarly, if x is above/below a warning threshold that triggers above/below, then the scorecard is in a warning state - unless x also puts it in a danger state. (Danger trumps warning.)As an example, consider a scorecard with the following four thresholds: { value: 90, category: 'DANGER', trigger: 'ABOVE', \}, { value: 70, category: 'WARNING', trigger: 'ABOVE', \}, { value: 10, category: 'DANGER', trigger: 'BELOW', \}, { value: 20, category: 'WARNING', trigger: 'BELOW', \}Then: values less than or equal to 10 would put the scorecard in a DANGER state, values greater than 10 but less than or equal to 20 a WARNING state, values strictly between 20 and 70 an OK state, values greater than or equal to 70 but less than 90 a WARNING state, and values greater than or equal to 90 a DANGER state.
         */
        thresholds?: Schema$Threshold[];
        /**
         * Required. Fields for querying time series data from the Stackdriver metrics API.
         */
        timeSeriesQuery?: Schema$TimeSeriesQuery;
    }
    /**
     * SourceContext represents information about the source of a protobuf element, like the file in which it is defined.
     */
    export interface Schema$SourceContext {
        /**
         * The path-qualified name of the .proto file that contained the associated protobuf element. For example: "google/protobuf/source_context.proto".
         */
        fileName?: string | null;
    }
    /**
     * The context of a span. This is attached to an Exemplar in Distribution values during aggregation.It contains the name of a span with format: projects/[PROJECT_ID_OR_NUMBER]/traces/[TRACE_ID]/spans/[SPAN_ID]
     */
    export interface Schema$SpanContext {
        /**
         * The resource name of the span. The format is: projects/[PROJECT_ID_OR_NUMBER]/traces/[TRACE_ID]/spans/[SPAN_ID] [TRACE_ID] is a unique identifier for a trace within a project; it is a 32-character hexadecimal encoding of a 16-byte array.[SPAN_ID] is a unique identifier for a span within a trace; it is a 16-character hexadecimal encoding of an 8-byte array.
         */
        spanName?: string | null;
    }
    /**
     * A sparkChart is a small chart suitable for inclusion in a table-cell or inline in text. This message contains the configuration for a sparkChart to show up on a Scorecard, showing recent trends of the scorecard's timeseries.
     */
    export interface Schema$SparkChartView {
        /**
         * The lower bound on data point frequency in the chart implemented by specifying the minimum alignment period to use in a time series query. For example, if the data is published once every 10 minutes it would not make sense to fetch and align data at one minute intervals. This field is optional and exists only as a hint.
         */
        minAlignmentPeriod?: string | null;
        /**
         * Required. The type of sparkchart to show in this chartView.
         */
        sparkChartType?: string | null;
    }
    /**
     * A filter that ranks streams based on their statistical relation to other streams in a request. Note: This field is deprecated and completely ignored by the API.
     */
    export interface Schema$StatisticalTimeSeriesFilter {
        /**
         * How many time series to output.
         */
        numTimeSeries?: number | null;
        /**
         * rankingMethod is applied to a set of time series, and then the produced value for each individual time series is used to compare a given time series to others. These are methods that cannot be applied stream-by-stream, but rather require the full context of a request to evaluate time series.
         */
        rankingMethod?: string | null;
    }
    /**
     * The Status type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by gRPC (https://github.com/grpc). Each Status message contains three pieces of data: error code, error message, and error details.You can find out more about this error model and how to work with it in the API Design Guide (https://cloud.google.com/apis/design/errors).
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
     * Groups a time series query definition with table options.
     */
    export interface Schema$TableDataSet {
        /**
         * Optional. The lower bound on data point frequency for this data set, implemented by specifying the minimum alignment period to use in a time series query For example, if the data is published once every 10 minutes, the min_alignment_period should be at least 10 minutes. It would not make sense to fetch and align data at one minute intervals.
         */
        minAlignmentPeriod?: string | null;
        /**
         * Optional. Table display options for configuring how the table is rendered.
         */
        tableDisplayOptions?: Schema$TableDisplayOptions;
        /**
         * Optional. A template string for naming TimeSeries in the resulting data set. This should be a string with interpolations of the form ${label_name\}, which will resolve to the label's value i.e. "${resource.labels.project_id\}."
         */
        tableTemplate?: string | null;
        /**
         * Required. Fields for querying time series data from the Stackdriver metrics API.
         */
        timeSeriesQuery?: Schema$TimeSeriesQuery;
    }
    /**
     * Table display options that can be reused.
     */
    export interface Schema$TableDisplayOptions {
        /**
         * Optional. Columns to display in the table. Leave empty to display all available columns. Note: This field is for future features and is not currently used.
         */
        shownColumns?: string[] | null;
    }
    /**
     * A widget that displays textual content.
     */
    export interface Schema$Text {
        /**
         * The text content to be displayed.
         */
        content?: string | null;
        /**
         * How the text content is formatted.
         */
        format?: string | null;
    }
    /**
     * Defines a threshold for categorizing time series values.
     */
    export interface Schema$Threshold {
        /**
         * The state color for this threshold. Color is not allowed in a XyChart.
         */
        color?: string | null;
        /**
         * The direction for the current threshold. Direction is not allowed in a XyChart.
         */
        direction?: string | null;
        /**
         * A label for the threshold.
         */
        label?: string | null;
        /**
         * The target axis to use for plotting the threshold. Target axis is not allowed in a Scorecard.
         */
        targetAxis?: string | null;
        /**
         * The value of the threshold. The value should be defined in the native scale of the metric.
         */
        value?: number | null;
    }
    /**
     * A single tile in the mosaic. The placement and size of the tile are configurable.
     */
    export interface Schema$Tile {
        /**
         * The height of the tile, measured in grid blocks. Tiles must have a minimum height of 1.
         */
        height?: number | null;
        /**
         * The informational widget contained in the tile. For example an XyChart.
         */
        widget?: Schema$Widget;
        /**
         * The width of the tile, measured in grid blocks. Tiles must have a minimum width of 1.
         */
        width?: number | null;
        /**
         * The zero-indexed position of the tile in grid blocks relative to the left edge of the grid. Tiles must be contained within the specified number of columns. x_pos cannot be negative.
         */
        xPos?: number | null;
        /**
         * The zero-indexed position of the tile in grid blocks relative to the top edge of the grid. y_pos cannot be negative.
         */
        yPos?: number | null;
    }
    /**
     * A filter that defines a subset of time series data that is displayed in a widget. Time series data is fetched using the ListTimeSeries (https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list) method.
     */
    export interface Schema$TimeSeriesFilter {
        /**
         * By default, the raw time series data is returned. Use this field to combine multiple time series for different views of the data.
         */
        aggregation?: Schema$Aggregation;
        /**
         * Required. The monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) that identifies the metric types, resources, and projects to query.
         */
        filter?: string | null;
        /**
         * Ranking based time series filter.
         */
        pickTimeSeriesFilter?: Schema$PickTimeSeriesFilter;
        /**
         * Apply a second aggregation after aggregation is applied.
         */
        secondaryAggregation?: Schema$Aggregation;
        /**
         * Statistics based time series filter. Note: This field is deprecated and completely ignored by the API.
         */
        statisticalTimeSeriesFilter?: Schema$StatisticalTimeSeriesFilter;
    }
    /**
     * A pair of time series filters that define a ratio computation. The output time series is the pair-wise division of each aligned element from the numerator and denominator time series.
     */
    export interface Schema$TimeSeriesFilterRatio {
        /**
         * The denominator of the ratio.
         */
        denominator?: Schema$RatioPart;
        /**
         * The numerator of the ratio.
         */
        numerator?: Schema$RatioPart;
        /**
         * Ranking based time series filter.
         */
        pickTimeSeriesFilter?: Schema$PickTimeSeriesFilter;
        /**
         * Apply a second aggregation after the ratio is computed.
         */
        secondaryAggregation?: Schema$Aggregation;
        /**
         * Statistics based time series filter. Note: This field is deprecated and completely ignored by the API.
         */
        statisticalTimeSeriesFilter?: Schema$StatisticalTimeSeriesFilter;
    }
    /**
     * TimeSeriesQuery collects the set of supported methods for querying time series data from the Stackdriver metrics API.
     */
    export interface Schema$TimeSeriesQuery {
        /**
         * Filter parameters to fetch time series.
         */
        timeSeriesFilter?: Schema$TimeSeriesFilter;
        /**
         * Parameters to fetch a ratio between two time series filters.
         */
        timeSeriesFilterRatio?: Schema$TimeSeriesFilterRatio;
        /**
         * A query used to fetch time series with MQL.
         */
        timeSeriesQueryLanguage?: string | null;
        /**
         * The unit of data contained in fetched time series. If non-empty, this unit will override any unit that accompanies fetched data. The format is the same as the unit (https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors) field in MetricDescriptor.
         */
        unitOverride?: string | null;
    }
    /**
     * A table that displays time series data.
     */
    export interface Schema$TimeSeriesTable {
        /**
         * Required. The data displayed in this table.
         */
        dataSets?: Schema$TableDataSet[];
    }
    /**
     * A protocol buffer message type.
     */
    export interface Schema$Type {
        /**
         * The list of fields.
         */
        fields?: Schema$Field[];
        /**
         * The fully qualified message name.
         */
        name?: string | null;
        /**
         * The list of types appearing in oneof definitions in this type.
         */
        oneofs?: string[] | null;
        /**
         * The protocol buffer options.
         */
        options?: Schema$Option[];
        /**
         * The source context.
         */
        sourceContext?: Schema$SourceContext;
        /**
         * The source syntax.
         */
        syntax?: string | null;
    }
    /**
     * Widget contains a single dashboard component and configuration of how to present the component in the dashboard.
     */
    export interface Schema$Widget {
        /**
         * A chart of alert policy data.
         */
        alertChart?: Schema$AlertChart;
        /**
         * A blank space.
         */
        blank?: Schema$Empty;
        /**
         * A widget that groups the other widgets. All widgets that are within the area spanned by the grouping widget are considered member widgets.
         */
        collapsibleGroup?: Schema$CollapsibleGroup;
        /**
         * A widget that shows a stream of logs.
         */
        logsPanel?: Schema$LogsPanel;
        /**
         * A scorecard summarizing time series data.
         */
        scorecard?: Schema$Scorecard;
        /**
         * A raw string or markdown displaying textual content.
         */
        text?: Schema$Text;
        /**
         * A widget that displays time series data in a tabular format.
         */
        timeSeriesTable?: Schema$TimeSeriesTable;
        /**
         * Optional. The title of the widget.
         */
        title?: string | null;
        /**
         * A chart of time series data.
         */
        xyChart?: Schema$XyChart;
    }
    /**
     * A chart that displays data on a 2D (X and Y axes) plane.
     */
    export interface Schema$XyChart {
        /**
         * Display options for the chart.
         */
        chartOptions?: Schema$ChartOptions;
        /**
         * Required. The data displayed in this chart.
         */
        dataSets?: Schema$DataSet[];
        /**
         * Threshold lines drawn horizontally across the chart.
         */
        thresholds?: Schema$Threshold[];
        /**
         * The duration used to display a comparison chart. A comparison chart simultaneously shows values from two similar-length time periods (e.g., week-over-week metrics). The duration must be positive, and it can only be applied to charts with data sets of LINE plot type.
         */
        timeshiftDuration?: string | null;
        /**
         * The properties applied to the X axis.
         */
        xAxis?: Schema$Axis;
        /**
         * The properties applied to the Y2 axis.
         */
        y2Axis?: Schema$Axis;
        /**
         * The properties applied to the Y axis.
         */
        yAxis?: Schema$Axis;
    }
    export class Resource$Locations {
        context: APIRequestContext;
        global: Resource$Locations$Global;
        constructor(context: APIRequestContext);
    }
    export class Resource$Locations$Global {
        context: APIRequestContext;
        metricsScopes: Resource$Locations$Global$Metricsscopes;
        constructor(context: APIRequestContext);
    }
    export class Resource$Locations$Global$Metricsscopes {
        context: APIRequestContext;
        projects: Resource$Locations$Global$Metricsscopes$Projects;
        constructor(context: APIRequestContext);
        /**
         * Returns a specific Metrics Scope, including the list of projects monitored by the specified Metrics Scope.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.locations.global.metricsScopes.get({
         *     // Required. The resource name of the Metrics Scope. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}
         *     name: 'locations/global/metricsScopes/my-metricsScope',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "monitoredProjects": [],
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Locations$Global$Metricsscopes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Locations$Global$Metricsscopes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$MetricsScope>>;
        get(params: Params$Resource$Locations$Global$Metricsscopes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Locations$Global$Metricsscopes$Get, options: MethodOptions | BodyResponseCallback<Schema$MetricsScope>, callback: BodyResponseCallback<Schema$MetricsScope>): void;
        get(params: Params$Resource$Locations$Global$Metricsscopes$Get, callback: BodyResponseCallback<Schema$MetricsScope>): void;
        get(callback: BodyResponseCallback<Schema$MetricsScope>): void;
        /**
         * Returns a list of every Metrics Scope that a specific MonitoredProject has been added to. The metrics scope representing the specified monitored project will always be the first entry in the response.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await monitoring.locations.global.metricsScopes.listMetricsScopesByMonitoredProject(
         *       {
         *         // Required. The resource name of the Monitored Project being requested. Example: projects/{MONITORED_PROJECT_ID_OR_NUMBER\}
         *         monitoredResourceContainer: 'placeholder-value',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "metricsScopes": []
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
        listMetricsScopesByMonitoredProject(params: Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listMetricsScopesByMonitoredProject(params?: Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMetricsScopesByMonitoredProjectResponse>>;
        listMetricsScopesByMonitoredProject(params: Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listMetricsScopesByMonitoredProject(params: Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject, options: MethodOptions | BodyResponseCallback<Schema$ListMetricsScopesByMonitoredProjectResponse>, callback: BodyResponseCallback<Schema$ListMetricsScopesByMonitoredProjectResponse>): void;
        listMetricsScopesByMonitoredProject(params: Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject, callback: BodyResponseCallback<Schema$ListMetricsScopesByMonitoredProjectResponse>): void;
        listMetricsScopesByMonitoredProject(callback: BodyResponseCallback<Schema$ListMetricsScopesByMonitoredProjectResponse>): void;
    }
    export interface Params$Resource$Locations$Global$Metricsscopes$Get extends StandardParameters {
        /**
         * Required. The resource name of the Metrics Scope. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}
         */
        name?: string;
    }
    export interface Params$Resource$Locations$Global$Metricsscopes$Listmetricsscopesbymonitoredproject extends StandardParameters {
        /**
         * Required. The resource name of the Monitored Project being requested. Example: projects/{MONITORED_PROJECT_ID_OR_NUMBER\}
         */
        monitoredResourceContainer?: string;
    }
    export class Resource$Locations$Global$Metricsscopes$Projects {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Adds a MonitoredProject with the given project ID to the specified Metrics Scope.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.locations.global.metricsScopes.projects.create({
         *     // Required. The resource name of the existing Metrics Scope that will monitor this project. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}
         *     parent: 'locations/global/metricsScopes/my-metricsScope',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        create(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Locations$Global$Metricsscopes$Projects$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a MonitoredProject from the specified Metrics Scope.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.locations.global.metricsScopes.projects.delete({
         *     // Required. The resource name of the MonitoredProject. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}/projects/{MONITORED_PROJECT_ID_OR_NUMBER\}Authorization requires the following Google IAM (https://cloud.google.com/iam) permissions on both the Metrics Scope and on the MonitoredProject: monitoring.metricsScopes.link
         *     name: 'locations/global/metricsScopes/my-metricsScope/projects/my-project',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        delete(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Locations$Global$Metricsscopes$Projects$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Locations$Global$Metricsscopes$Projects$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Locations$Global$Metricsscopes$Projects$Create extends StandardParameters {
        /**
         * Required. The resource name of the existing Metrics Scope that will monitor this project. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$MonitoredProject;
    }
    export interface Params$Resource$Locations$Global$Metricsscopes$Projects$Delete extends StandardParameters {
        /**
         * Required. The resource name of the MonitoredProject. Example: locations/global/metricsScopes/{SCOPING_PROJECT_ID_OR_NUMBER\}/projects/{MONITORED_PROJECT_ID_OR_NUMBER\}Authorization requires the following Google IAM (https://cloud.google.com/iam) permissions on both the Metrics Scope and on the MonitoredProject: monitoring.metricsScopes.link
         */
        name?: string;
    }
    export class Resource$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.operations.get({
         *     // The name of the operation resource.
         *     name: 'operations/.*',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        dashboards: Resource$Projects$Dashboards;
        location: Resource$Projects$Location;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Dashboards {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new custom dashboard. For examples on how you can use this API to create dashboards, see Managing dashboards by API (https://cloud.google.com/monitoring/dashboards/api-dashboard). This method requires the monitoring.dashboards.create permission on the specified project. For more information about permissions, see Cloud Identity and Access Management (https://cloud.google.com/iam).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.dashboards.create({
         *     // Required. The project on which to execute the request. The format is: projects/[PROJECT_ID_OR_NUMBER] The [PROJECT_ID_OR_NUMBER] must match the dashboard resource name.
         *     parent: 'projects/my-project',
         *     // If set, validate the request and preview the review, but do not actually save it.
         *     validateOnly: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "columnLayout": {},
         *       //   "dashboardFilters": [],
         *       //   "displayName": "my_displayName",
         *       //   "etag": "my_etag",
         *       //   "gridLayout": {},
         *       //   "labels": {},
         *       //   "mosaicLayout": {},
         *       //   "name": "my_name",
         *       //   "rowLayout": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "columnLayout": {},
         *   //   "dashboardFilters": [],
         *   //   "displayName": "my_displayName",
         *   //   "etag": "my_etag",
         *   //   "gridLayout": {},
         *   //   "labels": {},
         *   //   "mosaicLayout": {},
         *   //   "name": "my_name",
         *   //   "rowLayout": {}
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
        create(params: Params$Resource$Projects$Dashboards$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Dashboards$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Dashboard>>;
        create(params: Params$Resource$Projects$Dashboards$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Dashboards$Create, options: MethodOptions | BodyResponseCallback<Schema$Dashboard>, callback: BodyResponseCallback<Schema$Dashboard>): void;
        create(params: Params$Resource$Projects$Dashboards$Create, callback: BodyResponseCallback<Schema$Dashboard>): void;
        create(callback: BodyResponseCallback<Schema$Dashboard>): void;
        /**
         * Deletes an existing custom dashboard.This method requires the monitoring.dashboards.delete permission on the specified dashboard. For more information, see Cloud Identity and Access Management (https://cloud.google.com/iam).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.dashboards.delete({
         *     // Required. The resource name of the Dashboard. The format is: projects/[PROJECT_ID_OR_NUMBER]/dashboards/[DASHBOARD_ID]
         *     name: 'projects/my-project/dashboards/my-dashboard',
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
        delete(params: Params$Resource$Projects$Dashboards$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Dashboards$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Dashboards$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Dashboards$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Dashboards$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Fetches a specific dashboard.This method requires the monitoring.dashboards.get permission on the specified dashboard. For more information, see Cloud Identity and Access Management (https://cloud.google.com/iam).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.dashboards.get({
         *     // Required. The resource name of the Dashboard. The format is one of: dashboards/[DASHBOARD_ID] (for system dashboards) projects/[PROJECT_ID_OR_NUMBER]/dashboards/[DASHBOARD_ID] (for custom dashboards).
         *     name: 'projects/my-project/dashboards/my-dashboard',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "columnLayout": {},
         *   //   "dashboardFilters": [],
         *   //   "displayName": "my_displayName",
         *   //   "etag": "my_etag",
         *   //   "gridLayout": {},
         *   //   "labels": {},
         *   //   "mosaicLayout": {},
         *   //   "name": "my_name",
         *   //   "rowLayout": {}
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
        get(params: Params$Resource$Projects$Dashboards$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Dashboards$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Dashboard>>;
        get(params: Params$Resource$Projects$Dashboards$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Dashboards$Get, options: MethodOptions | BodyResponseCallback<Schema$Dashboard>, callback: BodyResponseCallback<Schema$Dashboard>): void;
        get(params: Params$Resource$Projects$Dashboards$Get, callback: BodyResponseCallback<Schema$Dashboard>): void;
        get(callback: BodyResponseCallback<Schema$Dashboard>): void;
        /**
         * Lists the existing dashboards.This method requires the monitoring.dashboards.list permission on the specified project. For more information, see Cloud Identity and Access Management (https://cloud.google.com/iam).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.dashboards.list({
         *     // A positive number that is the maximum number of results to return. If unspecified, a default of 1000 is used.
         *     pageSize: 'placeholder-value',
         *     // If this field is not empty then it must contain the nextPageToken value returned by a previous call to this method. Using this field causes the method to return additional results from the previous method call.
         *     pageToken: 'placeholder-value',
         *     // Required. The scope of the dashboards to list. The format is: projects/[PROJECT_ID_OR_NUMBER]
         *     parent: 'projects/my-project',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dashboards": [],
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
        list(params: Params$Resource$Projects$Dashboards$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Dashboards$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDashboardsResponse>>;
        list(params: Params$Resource$Projects$Dashboards$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Dashboards$List, options: MethodOptions | BodyResponseCallback<Schema$ListDashboardsResponse>, callback: BodyResponseCallback<Schema$ListDashboardsResponse>): void;
        list(params: Params$Resource$Projects$Dashboards$List, callback: BodyResponseCallback<Schema$ListDashboardsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDashboardsResponse>): void;
        /**
         * Replaces an existing custom dashboard with a new definition.This method requires the monitoring.dashboards.update permission on the specified dashboard. For more information, see Cloud Identity and Access Management (https://cloud.google.com/iam).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.dashboards.patch({
         *     // Immutable. The resource name of the dashboard.
         *     name: 'projects/my-project/dashboards/my-dashboard',
         *     // If set, validate the request and preview the review, but do not actually save it.
         *     validateOnly: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "columnLayout": {},
         *       //   "dashboardFilters": [],
         *       //   "displayName": "my_displayName",
         *       //   "etag": "my_etag",
         *       //   "gridLayout": {},
         *       //   "labels": {},
         *       //   "mosaicLayout": {},
         *       //   "name": "my_name",
         *       //   "rowLayout": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "columnLayout": {},
         *   //   "dashboardFilters": [],
         *   //   "displayName": "my_displayName",
         *   //   "etag": "my_etag",
         *   //   "gridLayout": {},
         *   //   "labels": {},
         *   //   "mosaicLayout": {},
         *   //   "name": "my_name",
         *   //   "rowLayout": {}
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
        patch(params: Params$Resource$Projects$Dashboards$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Dashboards$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Dashboard>>;
        patch(params: Params$Resource$Projects$Dashboards$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Dashboards$Patch, options: MethodOptions | BodyResponseCallback<Schema$Dashboard>, callback: BodyResponseCallback<Schema$Dashboard>): void;
        patch(params: Params$Resource$Projects$Dashboards$Patch, callback: BodyResponseCallback<Schema$Dashboard>): void;
        patch(callback: BodyResponseCallback<Schema$Dashboard>): void;
    }
    export interface Params$Resource$Projects$Dashboards$Create extends StandardParameters {
        /**
         * Required. The project on which to execute the request. The format is: projects/[PROJECT_ID_OR_NUMBER] The [PROJECT_ID_OR_NUMBER] must match the dashboard resource name.
         */
        parent?: string;
        /**
         * If set, validate the request and preview the review, but do not actually save it.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Dashboard;
    }
    export interface Params$Resource$Projects$Dashboards$Delete extends StandardParameters {
        /**
         * Required. The resource name of the Dashboard. The format is: projects/[PROJECT_ID_OR_NUMBER]/dashboards/[DASHBOARD_ID]
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Dashboards$Get extends StandardParameters {
        /**
         * Required. The resource name of the Dashboard. The format is one of: dashboards/[DASHBOARD_ID] (for system dashboards) projects/[PROJECT_ID_OR_NUMBER]/dashboards/[DASHBOARD_ID] (for custom dashboards).
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Dashboards$List extends StandardParameters {
        /**
         * A positive number that is the maximum number of results to return. If unspecified, a default of 1000 is used.
         */
        pageSize?: number;
        /**
         * If this field is not empty then it must contain the nextPageToken value returned by a previous call to this method. Using this field causes the method to return additional results from the previous method call.
         */
        pageToken?: string;
        /**
         * Required. The scope of the dashboards to list. The format is: projects/[PROJECT_ID_OR_NUMBER]
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Dashboards$Patch extends StandardParameters {
        /**
         * Immutable. The resource name of the dashboard.
         */
        name?: string;
        /**
         * If set, validate the request and preview the review, but do not actually save it.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Dashboard;
    }
    export class Resource$Projects$Location {
        context: APIRequestContext;
        prometheus: Resource$Projects$Location$Prometheus;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Location$Prometheus {
        context: APIRequestContext;
        api: Resource$Projects$Location$Prometheus$Api;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Location$Prometheus$Api {
        context: APIRequestContext;
        v1: Resource$Projects$Location$Prometheus$Api$V1;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Location$Prometheus$Api$V1 {
        context: APIRequestContext;
        label: Resource$Projects$Location$Prometheus$Api$V1$Label;
        metadata: Resource$Projects$Location$Prometheus$Api$V1$Metadata;
        constructor(context: APIRequestContext);
        /**
         * Evaluate a PromQL query at a single point in time.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.location.prometheus.api.v1.query({
         *     // Location of the resource information. Has to be "global" now.
         *     location: 'placeholder-value',
         *     // The project on which to execute the request. Data associcated with the project's workspace stored under the The format is: projects/PROJECT_ID_OR_NUMBER. Open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine.
         *     name: 'projects/my-project',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "query": "my_query",
         *       //   "time": "my_time",
         *       //   "timeout": "my_timeout"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "contentType": "my_contentType",
         *   //   "data": "my_data",
         *   //   "extensions": []
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
        query(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query(params?: Params$Resource$Projects$Location$Prometheus$Api$V1$Query, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        query(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        query(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query, callback: BodyResponseCallback<Schema$HttpBody>): void;
        query(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Evaluate a PromQL query with start, end time range.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.location.prometheus.api.v1.query_range({
         *     // Location of the resource information. Has to be "global" now.
         *     location: 'placeholder-value',
         *     // The project on which to execute the request. Data associcated with the project's workspace stored under the The format is: projects/PROJECT_ID_OR_NUMBER. Open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine.
         *     name: 'projects/my-project',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "end": "my_end",
         *       //   "query": "my_query",
         *       //   "start": "my_start",
         *       //   "step": "my_step",
         *       //   "timeout": "my_timeout"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "contentType": "my_contentType",
         *   //   "data": "my_data",
         *   //   "extensions": []
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
        query_range(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        query_range(params?: Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        query_range(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        query_range(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        query_range(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range, callback: BodyResponseCallback<Schema$HttpBody>): void;
        query_range(callback: BodyResponseCallback<Schema$HttpBody>): void;
        /**
         * Lists metadata for metrics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.location.prometheus.api.v1.series({
         *     // Location of the resource information. Has to be "global" for now.
         *     location: 'placeholder-value',
         *     // Required. The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         *     name: 'projects/my-project',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "end": "my_end",
         *       //   "start": "my_start"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "contentType": "my_contentType",
         *   //   "data": "my_data",
         *   //   "extensions": []
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
        series(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Series, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        series(params?: Params$Resource$Projects$Location$Prometheus$Api$V1$Series, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        series(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Series, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        series(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Series, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        series(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Series, callback: BodyResponseCallback<Schema$HttpBody>): void;
        series(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Location$Prometheus$Api$V1$Query extends StandardParameters {
        /**
         * Location of the resource information. Has to be "global" now.
         */
        location?: string;
        /**
         * The project on which to execute the request. Data associcated with the project's workspace stored under the The format is: projects/PROJECT_ID_OR_NUMBER. Open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryInstantRequest;
    }
    export interface Params$Resource$Projects$Location$Prometheus$Api$V1$Query_range extends StandardParameters {
        /**
         * Location of the resource information. Has to be "global" now.
         */
        location?: string;
        /**
         * The project on which to execute the request. Data associcated with the project's workspace stored under the The format is: projects/PROJECT_ID_OR_NUMBER. Open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$QueryRangeRequest;
    }
    export interface Params$Resource$Projects$Location$Prometheus$Api$V1$Series extends StandardParameters {
        /**
         * Location of the resource information. Has to be "global" for now.
         */
        location?: string;
        /**
         * Required. The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$QuerySeriesRequest;
    }
    export class Resource$Projects$Location$Prometheus$Api$V1$Label {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists possible values for a given label name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await monitoring.projects.location.prometheus.api.v1.label.values(
         *     {
         *       // The end time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         *       end: 'placeholder-value',
         *       // The label name for which values are queried.
         *       label: 'placeholder-value',
         *       // Location of the resource information. Has to be "global" now.
         *       location: 'placeholder-value',
         *       // A list of matchers encoded in the Prometheus label matcher format to constrain the values to series that satisfy them.
         *       match: 'placeholder-value',
         *       // The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         *       name: 'projects/my-project',
         *       // The start time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         *       start: 'placeholder-value',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "contentType": "my_contentType",
         *   //   "data": "my_data",
         *   //   "extensions": []
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
        values(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        values(params?: Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        values(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        values(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        values(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values, callback: BodyResponseCallback<Schema$HttpBody>): void;
        values(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Location$Prometheus$Api$V1$Label$Values extends StandardParameters {
        /**
         * The end time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        end?: string;
        /**
         * The label name for which values are queried.
         */
        label?: string;
        /**
         * Location of the resource information. Has to be "global" now.
         */
        location?: string;
        /**
         * A list of matchers encoded in the Prometheus label matcher format to constrain the values to series that satisfy them.
         */
        match?: string;
        /**
         * The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         */
        name?: string;
        /**
         * The start time to evaluate the query for. Either floating point UNIX seconds or RFC3339 formatted timestamp.
         */
        start?: string;
    }
    export class Resource$Projects$Location$Prometheus$Api$V1$Metadata {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists metadata for metrics.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/monitoring.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const monitoring = google.monitoring('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/monitoring',
         *       'https://www.googleapis.com/auth/monitoring.read',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await monitoring.projects.location.prometheus.api.v1.metadata.list({
         *       // Maximum number of metrics to return.
         *       limit: 'placeholder-value',
         *       // Location of the resource information. Has to be "global" for now.
         *       location: 'placeholder-value',
         *       // The metric name for which to query metadata. If unset, all metric metadata is returned.
         *       metric: 'placeholder-value',
         *       // Required. The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         *       name: 'projects/my-project',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "contentType": "my_contentType",
         *   //   "data": "my_data",
         *   //   "extensions": []
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
        list(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        list(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        list(params: Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List, callback: BodyResponseCallback<Schema$HttpBody>): void;
        list(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Projects$Location$Prometheus$Api$V1$Metadata$List extends StandardParameters {
        /**
         * Maximum number of metrics to return.
         */
        limit?: string;
        /**
         * Location of the resource information. Has to be "global" for now.
         */
        location?: string;
        /**
         * The metric name for which to query metadata. If unset, all metric metadata is returned.
         */
        metric?: string;
        /**
         * Required. The workspace on which to execute the request. It is not part of the open source API but used as a request path prefix to distinguish different virtual Prometheus instances of Google Prometheus Engine. The format is: projects/PROJECT_ID_OR_NUMBER.
         */
        name?: string;
    }
    export {};
}
