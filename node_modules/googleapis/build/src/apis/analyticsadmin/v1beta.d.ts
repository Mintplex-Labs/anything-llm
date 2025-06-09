import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace analyticsadmin_v1beta {
    export interface Options extends GlobalOptions {
        version: 'v1beta';
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
     * const analyticsadmin = google.analyticsadmin('v1beta');
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccessBetweenFilter {
        /**
         * Begins with this number.
         */
        fromValue?: Schema$GoogleAnalyticsAdminV1betaNumericValue;
        /**
         * Ends with this number.
         */
        toValue?: Schema$GoogleAnalyticsAdminV1betaNumericValue;
    }
    /**
     * A contiguous range of days: startDate, startDate + 1, ..., endDate.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessDateRange {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccessDimension {
        /**
         * The API name of the dimension. See [Data Access Schema](https://developers.google.com/analytics/devguides/config/admin/v1/access-api-schema) for the list of dimensions supported in this API. Dimensions are referenced by name in `dimensionFilter` and `orderBys`.
         */
        dimensionName?: string | null;
    }
    /**
     * Describes a dimension column in the report. Dimensions requested in a report produce column entries within rows and DimensionHeaders. However, dimensions used exclusively within filters or expressions do not produce columns in a report; correspondingly, those dimensions do not produce headers.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessDimensionHeader {
        /**
         * The dimension's name; for example 'userEmail'.
         */
        dimensionName?: string | null;
    }
    /**
     * The value of a dimension.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessDimensionValue {
        /**
         * The dimension value. For example, this value may be 'France' for the 'country' dimension.
         */
        value?: string | null;
    }
    /**
     * An expression to filter dimension or metric values.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessFilter {
        /**
         * A filter for two values.
         */
        betweenFilter?: Schema$GoogleAnalyticsAdminV1betaAccessBetweenFilter;
        /**
         * The dimension name or metric name.
         */
        fieldName?: string | null;
        /**
         * A filter for in list values.
         */
        inListFilter?: Schema$GoogleAnalyticsAdminV1betaAccessInListFilter;
        /**
         * A filter for numeric or date values.
         */
        numericFilter?: Schema$GoogleAnalyticsAdminV1betaAccessNumericFilter;
        /**
         * Strings related filter.
         */
        stringFilter?: Schema$GoogleAnalyticsAdminV1betaAccessStringFilter;
    }
    /**
     * Expresses dimension or metric filters. The fields in the same expression need to be either all dimensions or all metrics.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessFilterExpression {
        /**
         * A primitive filter. In the same FilterExpression, all of the filter's field names need to be either all dimensions or all metrics.
         */
        accessFilter?: Schema$GoogleAnalyticsAdminV1betaAccessFilter;
        /**
         * Each of the FilterExpressions in the and_group has an AND relationship.
         */
        andGroup?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpressionList;
        /**
         * The FilterExpression is NOT of not_expression.
         */
        notExpression?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpression;
        /**
         * Each of the FilterExpressions in the or_group has an OR relationship.
         */
        orGroup?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpressionList;
    }
    /**
     * A list of filter expressions.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessFilterExpressionList {
        /**
         * A list of filter expressions.
         */
        expressions?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpression[];
    }
    /**
     * The result needs to be in a list of string values.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessInListFilter {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccessMetric {
        /**
         * The API name of the metric. See [Data Access Schema](https://developers.google.com/analytics/devguides/config/admin/v1/access-api-schema) for the list of metrics supported in this API. Metrics are referenced by name in `metricFilter` & `orderBys`.
         */
        metricName?: string | null;
    }
    /**
     * Describes a metric column in the report. Visible metrics requested in a report produce column entries within rows and MetricHeaders. However, metrics used exclusively within filters or expressions do not produce columns in a report; correspondingly, those metrics do not produce headers.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessMetricHeader {
        /**
         * The metric's name; for example 'accessCount'.
         */
        metricName?: string | null;
    }
    /**
     * The value of a metric.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessMetricValue {
        /**
         * The measurement value. For example, this value may be '13'.
         */
        value?: string | null;
    }
    /**
     * Filters for numeric or date values.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessNumericFilter {
        /**
         * The operation type for this filter.
         */
        operation?: string | null;
        /**
         * A numeric value or a date value.
         */
        value?: Schema$GoogleAnalyticsAdminV1betaNumericValue;
    }
    /**
     * Order bys define how rows will be sorted in the response. For example, ordering rows by descending access count is one ordering, and ordering rows by the country string is a different ordering.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessOrderBy {
        /**
         * If true, sorts by descending order. If false or unspecified, sorts in ascending order.
         */
        desc?: boolean | null;
        /**
         * Sorts results by a dimension's values.
         */
        dimension?: Schema$GoogleAnalyticsAdminV1betaAccessOrderByDimensionOrderBy;
        /**
         * Sorts results by a metric's values.
         */
        metric?: Schema$GoogleAnalyticsAdminV1betaAccessOrderByMetricOrderBy;
    }
    /**
     * Sorts by dimension values.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessOrderByDimensionOrderBy {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccessOrderByMetricOrderBy {
        /**
         * A metric name in the request to order by.
         */
        metricName?: string | null;
    }
    /**
     * Current state of all quotas for this Analytics property. If any quota for a property is exhausted, all requests to that property will return Resource Exhausted errors.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessQuota {
        /**
         * Properties can use up to 50 concurrent requests.
         */
        concurrentRequests?: Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus;
        /**
         * Properties and cloud project pairs can have up to 50 server errors per hour.
         */
        serverErrorsPerProjectPerHour?: Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus;
        /**
         * Properties can use 250,000 tokens per day. Most requests consume fewer than 10 tokens.
         */
        tokensPerDay?: Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus;
        /**
         * Properties can use 50,000 tokens per hour. An API request consumes a single number of tokens, and that number is deducted from all of the hourly, daily, and per project hourly quotas.
         */
        tokensPerHour?: Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus;
        /**
         * Properties can use up to 25% of their tokens per project per hour. This amounts to Analytics 360 Properties can use 12,500 tokens per project per hour. An API request consumes a single number of tokens, and that number is deducted from all of the hourly, daily, and per project hourly quotas.
         */
        tokensPerProjectPerHour?: Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus;
    }
    /**
     * Current state for a particular quota group.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessQuotaStatus {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccessRow {
        /**
         * List of dimension values. These values are in the same order as specified in the request.
         */
        dimensionValues?: Schema$GoogleAnalyticsAdminV1betaAccessDimensionValue[];
        /**
         * List of metric values. These values are in the same order as specified in the request.
         */
        metricValues?: Schema$GoogleAnalyticsAdminV1betaAccessMetricValue[];
    }
    /**
     * The filter for strings.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAccessStringFilter {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccount {
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
    export interface Schema$GoogleAnalyticsAdminV1betaAccountSummary {
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
        propertySummaries?: Schema$GoogleAnalyticsAdminV1betaPropertySummary[];
    }
    /**
     * Request message for AcknowledgeUserDataCollection RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionRequest {
        /**
         * Required. An acknowledgement that the caller of this method understands the terms of user data collection. This field must contain the exact value: "I acknowledge that I have the necessary privacy disclosures and rights from my end users for the collection and processing of their data, including the association of such data with the visitation information Google Analytics collects from my site and/or app property."
         */
        acknowledgement?: string | null;
    }
    /**
     * Response message for AcknowledgeUserDataCollection RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse {
    }
    /**
     * Request message for ArchiveCustomDimension RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaArchiveCustomDimensionRequest {
    }
    /**
     * Request message for ArchiveCustomMetric RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaArchiveCustomMetricRequest {
    }
    /**
     * A description of a change to a single Google Analytics resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaChangeHistoryChange {
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
        resourceAfterChange?: Schema$GoogleAnalyticsAdminV1betaChangeHistoryChangeChangeHistoryResource;
        /**
         * Resource contents from before the change was made. If this resource was created in this change, this field will be missing.
         */
        resourceBeforeChange?: Schema$GoogleAnalyticsAdminV1betaChangeHistoryChangeChangeHistoryResource;
    }
    /**
     * A snapshot of a resource as before or after the result of a change in change history.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaChangeHistoryChangeChangeHistoryResource {
        /**
         * A snapshot of an Account resource in change history.
         */
        account?: Schema$GoogleAnalyticsAdminV1betaAccount;
        /**
         * A snapshot of a ConversionEvent resource in change history.
         */
        conversionEvent?: Schema$GoogleAnalyticsAdminV1betaConversionEvent;
        /**
         * A snapshot of a data retention settings resource in change history.
         */
        dataRetentionSettings?: Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings;
        /**
         * A snapshot of a DataStream resource in change history.
         */
        dataStream?: Schema$GoogleAnalyticsAdminV1betaDataStream;
        /**
         * A snapshot of a FirebaseLink resource in change history.
         */
        firebaseLink?: Schema$GoogleAnalyticsAdminV1betaFirebaseLink;
        /**
         * A snapshot of a GoogleAdsLink resource in change history.
         */
        googleAdsLink?: Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink;
        /**
         * A snapshot of a MeasurementProtocolSecret resource in change history.
         */
        measurementProtocolSecret?: Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret;
        /**
         * A snapshot of a Property resource in change history.
         */
        property?: Schema$GoogleAnalyticsAdminV1betaProperty;
    }
    /**
     * A set of changes within a Google Analytics account or its child properties that resulted from the same cause. Common causes would be updates made in the Google Analytics UI, changes from customer support, or automatic Google Analytics system changes.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaChangeHistoryEvent {
        /**
         * The type of actor that made this change.
         */
        actorType?: string | null;
        /**
         * A list of changes made in this change history event that fit the filters specified in SearchChangeHistoryEventsRequest.
         */
        changes?: Schema$GoogleAnalyticsAdminV1betaChangeHistoryChange[];
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
     * A conversion event in a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaConversionEvent {
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
        defaultConversionValue?: Schema$GoogleAnalyticsAdminV1betaConversionEventDefaultConversionValue;
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
    export interface Schema$GoogleAnalyticsAdminV1betaConversionEventDefaultConversionValue {
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
     * A definition for a CustomDimension.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaCustomDimension {
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
    export interface Schema$GoogleAnalyticsAdminV1betaCustomMetric {
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
     * Settings values for data retention. This is a singleton resource.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings {
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
    export interface Schema$GoogleAnalyticsAdminV1betaDataSharingSettings {
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
    export interface Schema$GoogleAnalyticsAdminV1betaDataStream {
        /**
         * Data specific to Android app streams. Must be populated if type is ANDROID_APP_DATA_STREAM.
         */
        androidAppStreamData?: Schema$GoogleAnalyticsAdminV1betaDataStreamAndroidAppStreamData;
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
        iosAppStreamData?: Schema$GoogleAnalyticsAdminV1betaDataStreamIosAppStreamData;
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
        webStreamData?: Schema$GoogleAnalyticsAdminV1betaDataStreamWebStreamData;
    }
    /**
     * Data specific to Android app streams.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaDataStreamAndroidAppStreamData {
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
    export interface Schema$GoogleAnalyticsAdminV1betaDataStreamIosAppStreamData {
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
    export interface Schema$GoogleAnalyticsAdminV1betaDataStreamWebStreamData {
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
     * A link between a Google Analytics property and a Firebase project.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaFirebaseLink {
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
     * A link between a Google Analytics property and a Google Ads account.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink {
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
     * A key event in a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaKeyEvent {
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
        defaultValue?: Schema$GoogleAnalyticsAdminV1betaKeyEventDefaultValue;
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
    export interface Schema$GoogleAnalyticsAdminV1betaKeyEventDefaultValue {
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
     * Request message for ListAccounts RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListAccountsResponse {
        /**
         * Results that were accessible to the caller.
         */
        accounts?: Schema$GoogleAnalyticsAdminV1betaAccount[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListAccountSummaries RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse {
        /**
         * Account summaries of all accounts the caller has access to.
         */
        accountSummaries?: Schema$GoogleAnalyticsAdminV1betaAccountSummary[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListConversionEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse {
        /**
         * The requested conversion events
         */
        conversionEvents?: Schema$GoogleAnalyticsAdminV1betaConversionEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCustomDimensions RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse {
        /**
         * List of CustomDimensions.
         */
        customDimensions?: Schema$GoogleAnalyticsAdminV1betaCustomDimension[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCustomMetrics RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse {
        /**
         * List of CustomMetrics.
         */
        customMetrics?: Schema$GoogleAnalyticsAdminV1betaCustomMetric[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListDataStreams RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse {
        /**
         * List of DataStreams.
         */
        dataStreams?: Schema$GoogleAnalyticsAdminV1betaDataStream[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListFirebaseLinks RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse {
        /**
         * List of FirebaseLinks. This will have at most one value.
         */
        firebaseLinks?: Schema$GoogleAnalyticsAdminV1betaFirebaseLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. Currently, Google Analytics supports only one FirebaseLink per property, so this will never be populated.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListGoogleAdsLinks RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse {
        /**
         * List of GoogleAdsLinks.
         */
        googleAdsLinks?: Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListKeyEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse {
        /**
         * The requested Key Events
         */
        keyEvents?: Schema$GoogleAnalyticsAdminV1betaKeyEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListMeasurementProtocolSecret RPC
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse {
        /**
         * A list of secrets for the parent stream specified in the request.
         */
        measurementProtocolSecrets?: Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListProperties RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Results that matched the filter criteria and were accessible to the caller.
         */
        properties?: Schema$GoogleAnalyticsAdminV1betaProperty[];
    }
    /**
     * A secret value used for sending hits to Measurement Protocol.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret {
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
    export interface Schema$GoogleAnalyticsAdminV1betaNumericValue {
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
     * A resource message representing a Google Analytics property.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaProperty {
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
    export interface Schema$GoogleAnalyticsAdminV1betaPropertySummary {
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
    export interface Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketRequest {
        /**
         * The account to create.
         */
        account?: Schema$GoogleAnalyticsAdminV1betaAccount;
        /**
         * Redirect URI where the user will be sent after accepting Terms of Service. Must be configured in Cloud Console as a Redirect URI.
         */
        redirectUri?: string | null;
    }
    /**
     * Response message for ProvisionAccountTicket RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse {
        /**
         * The param to be passed in the ToS link.
         */
        accountTicketId?: string | null;
    }
    /**
     * The request for a Data Access Record Report.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaRunAccessReportRequest {
        /**
         * Date ranges of access records to read. If multiple date ranges are requested, each response row will contain a zero based date range index. If two date ranges overlap, the access records for the overlapping days is included in the response rows for both date ranges. Requests are allowed up to 2 date ranges.
         */
        dateRanges?: Schema$GoogleAnalyticsAdminV1betaAccessDateRange[];
        /**
         * Dimension filters let you restrict report response to specific dimension values which match the filter. For example, filtering on access records of a single user. To learn more, see [Fundamentals of Dimension Filters](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#dimension_filters) for examples. Metrics cannot be used in this filter.
         */
        dimensionFilter?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpression;
        /**
         * The dimensions requested and displayed in the response. Requests are allowed up to 9 dimensions.
         */
        dimensions?: Schema$GoogleAnalyticsAdminV1betaAccessDimension[];
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
        metricFilter?: Schema$GoogleAnalyticsAdminV1betaAccessFilterExpression;
        /**
         * The metrics requested and displayed in the response. Requests are allowed up to 10 metrics.
         */
        metrics?: Schema$GoogleAnalyticsAdminV1betaAccessMetric[];
        /**
         * The row count of the start row. The first row is counted as row 0. If offset is unspecified, it is treated as 0. If offset is zero, then this method will return the first page of results with `limit` entries. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        offset?: string | null;
        /**
         * Specifies how rows are ordered in the response.
         */
        orderBys?: Schema$GoogleAnalyticsAdminV1betaAccessOrderBy[];
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
    export interface Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse {
        /**
         * The header for a column in the report that corresponds to a specific dimension. The number of DimensionHeaders and ordering of DimensionHeaders matches the dimensions present in rows.
         */
        dimensionHeaders?: Schema$GoogleAnalyticsAdminV1betaAccessDimensionHeader[];
        /**
         * The header for a column in the report that corresponds to a specific metric. The number of MetricHeaders and ordering of MetricHeaders matches the metrics present in rows.
         */
        metricHeaders?: Schema$GoogleAnalyticsAdminV1betaAccessMetricHeader[];
        /**
         * The quota state for this Analytics property including this request. This field doesn't work with account-level requests.
         */
        quota?: Schema$GoogleAnalyticsAdminV1betaAccessQuota;
        /**
         * The total number of rows in the query result. `rowCount` is independent of the number of rows returned in the response, the `limit` request parameter, and the `offset` request parameter. For example if a query returns 175 rows and includes `limit` of 50 in the API request, the response will contain `rowCount` of 175 but only 50 rows. To learn more about this pagination parameter, see [Pagination](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination).
         */
        rowCount?: number | null;
        /**
         * Rows of dimension value combinations and metric values in the report.
         */
        rows?: Schema$GoogleAnalyticsAdminV1betaAccessRow[];
    }
    /**
     * Request message for SearchChangeHistoryEvents RPC.
     */
    export interface Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsRequest {
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
    export interface Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse {
        /**
         * Results that were accessible to the caller.
         */
        changeHistoryEvents?: Schema$GoogleAnalyticsAdminV1betaChangeHistoryEvent[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    export class Resource$Accounts {
        context: APIRequestContext;
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
        get(params?: Params$Resource$Accounts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaAccount>>;
        get(params: Params$Resource$Accounts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        get(params: Params$Resource$Accounts$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        /**
         * Get data sharing settings on an account. Data sharing settings are singletons.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDataSharingSettings(params?: Params$Resource$Accounts$Getdatasharingsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataSharingSettings>>;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataSharingSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataSharingSettings>): void;
        getDataSharingSettings(params: Params$Resource$Accounts$Getdatasharingsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataSharingSettings>): void;
        getDataSharingSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataSharingSettings>): void;
        /**
         * Returns all accounts accessible by the caller. Note that these accounts might not currently have GA properties. Soft-deleted (ie: "trashed") accounts are excluded by default. Returns an empty list if no relevant accounts are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListAccountsResponse>>;
        list(params: Params$Resource$Accounts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountsResponse>): void;
        list(params: Params$Resource$Accounts$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountsResponse>): void;
        /**
         * Updates an account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaAccount>>;
        patch(params: Params$Resource$Accounts$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        patch(params: Params$Resource$Accounts$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAccount>): void;
        /**
         * Requests a ticket for creating an account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        provisionAccountTicket(params?: Params$Resource$Accounts$Provisionaccountticket, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse>>;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse>): void;
        provisionAccountTicket(params: Params$Resource$Accounts$Provisionaccountticket, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse>): void;
        provisionAccountTicket(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketResponse>): void;
        /**
         * Returns a customized report of data access records. The report provides records of each time a user reads Google Analytics reporting data. Access records are retained for up to 2 years. Data Access Reports can be requested for a property. Reports may be requested for any property, but dimensions that aren't related to quota can only be requested on Google Analytics 360 properties. This method is only available to Administrators. These data access records include GA UI Reporting, GA UI Explorations, GA Data API, and other products like Firebase & Admob that can retrieve data from Google Analytics through a linkage. These records don't include property configuration changes like adding a stream or changing a property's time zone. For configuration change history, see [searchChangeHistoryEvents](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/accounts/searchChangeHistoryEvents). To give your feedback on this API, complete the [Google Analytics Access Reports feedback](https://docs.google.com/forms/d/e/1FAIpQLSdmEBUrMzAEdiEKk5TV5dEHvDUZDRlgWYdQdAeSdtR4hVjEhw/viewform) form.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runAccessReport(params?: Params$Resource$Accounts$Runaccessreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>>;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        runAccessReport(params: Params$Resource$Accounts$Runaccessreport, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        runAccessReport(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        /**
         * Searches through all changes to an account or its children given the specified set of filters. Only returns the subset of changes supported by the API. The UI may return additional changes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchChangeHistoryEvents(params?: Params$Resource$Accounts$Searchchangehistoryevents, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse>>;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse>): void;
        searchChangeHistoryEvents(params: Params$Resource$Accounts$Searchchangehistoryevents, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse>): void;
        searchChangeHistoryEvents(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsResponse>): void;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaAccount;
    }
    export interface Params$Resource$Accounts$Provisionaccountticket extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaProvisionAccountTicketRequest;
    }
    export interface Params$Resource$Accounts$Runaccessreport extends StandardParameters {
        /**
         * The Data Access Report supports requesting at the property level or account level. If requested at the account level, Data Access Reports include all access for all properties under that account. To request at the property level, entity should be for example 'properties/123' if "123" is your Google Analytics property ID. To request at the account level, entity should be for example 'accounts/1234' if "1234" is your Google Analytics Account ID.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaRunAccessReportRequest;
    }
    export interface Params$Resource$Accounts$Searchchangehistoryevents extends StandardParameters {
        /**
         * Required. The account resource for which to return change history resources. Format: accounts/{account\} Example: `accounts/100`
         */
        account?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaSearchChangeHistoryEventsRequest;
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
        list(params?: Params$Resource$Accountsummaries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse>>;
        list(params: Params$Resource$Accountsummaries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accountsummaries$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse>): void;
        list(params: Params$Resource$Accountsummaries$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListAccountSummariesResponse>): void;
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
        conversionEvents: Resource$Properties$Conversionevents;
        customDimensions: Resource$Properties$Customdimensions;
        customMetrics: Resource$Properties$Custommetrics;
        dataStreams: Resource$Properties$Datastreams;
        firebaseLinks: Resource$Properties$Firebaselinks;
        googleAdsLinks: Resource$Properties$Googleadslinks;
        keyEvents: Resource$Properties$Keyevents;
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
        acknowledgeUserDataCollection(params?: Params$Resource$Properties$Acknowledgeuserdatacollection, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse>>;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse>): void;
        acknowledgeUserDataCollection(params: Params$Resource$Properties$Acknowledgeuserdatacollection, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse>): void;
        acknowledgeUserDataCollection(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionResponse>): void;
        /**
         * Creates a Google Analytics property with the specified location and attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Properties$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Properties$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaProperty>>;
        create(params: Params$Resource$Properties$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        create(params: Params$Resource$Properties$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        /**
         * Marks target Property as soft-deleted (ie: "trashed") and returns it. This API does not have a method to restore soft-deleted properties. However, they can be restored using the Trash Can UI. If the properties are not restored before the expiration time, the Property and all child resources (eg: GoogleAdsLinks, Streams, AccessBindings) will be permanently purged. https://support.google.com/analytics/answer/6154772 Returns an error if the target is not found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Properties$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Properties$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaProperty>>;
        delete(params: Params$Resource$Properties$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Properties$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        delete(params: Params$Resource$Properties$Delete, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        /**
         * Lookup for a single GA Property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaProperty>>;
        get(params: Params$Resource$Properties$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        get(params: Params$Resource$Properties$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        /**
         * Returns the singleton data retention settings for this property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getDataRetentionSettings(params?: Params$Resource$Properties$Getdataretentionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>>;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
        getDataRetentionSettings(params: Params$Resource$Properties$Getdataretentionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
        getDataRetentionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
        /**
         * Returns child Properties under the specified parent Account. Properties will be excluded if the caller does not have access. Soft-deleted (ie: "trashed") properties are excluded by default. Returns an empty list if no relevant properties are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse>>;
        list(params: Params$Resource$Properties$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse>): void;
        list(params: Params$Resource$Properties$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListPropertiesResponse>): void;
        /**
         * Updates a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaProperty>>;
        patch(params: Params$Resource$Properties$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        patch(params: Params$Resource$Properties$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaProperty>): void;
        /**
         * Returns a customized report of data access records. The report provides records of each time a user reads Google Analytics reporting data. Access records are retained for up to 2 years. Data Access Reports can be requested for a property. Reports may be requested for any property, but dimensions that aren't related to quota can only be requested on Google Analytics 360 properties. This method is only available to Administrators. These data access records include GA UI Reporting, GA UI Explorations, GA Data API, and other products like Firebase & Admob that can retrieve data from Google Analytics through a linkage. These records don't include property configuration changes like adding a stream or changing a property's time zone. For configuration change history, see [searchChangeHistoryEvents](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/accounts/searchChangeHistoryEvents). To give your feedback on this API, complete the [Google Analytics Access Reports feedback](https://docs.google.com/forms/d/e/1FAIpQLSdmEBUrMzAEdiEKk5TV5dEHvDUZDRlgWYdQdAeSdtR4hVjEhw/viewform) form.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runAccessReport(params?: Params$Resource$Properties$Runaccessreport, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>>;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        runAccessReport(params: Params$Resource$Properties$Runaccessreport, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        runAccessReport(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaRunAccessReportResponse>): void;
        /**
         * Updates the singleton data retention settings for this property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateDataRetentionSettings(params?: Params$Resource$Properties$Updatedataretentionsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>>;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
        updateDataRetentionSettings(params: Params$Resource$Properties$Updatedataretentionsettings, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
        updateDataRetentionSettings(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings>): void;
    }
    export interface Params$Resource$Properties$Acknowledgeuserdatacollection extends StandardParameters {
        /**
         * Required. The property for which to acknowledge user data collection.
         */
        property?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaAcknowledgeUserDataCollectionRequest;
    }
    export interface Params$Resource$Properties$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaProperty;
    }
    export interface Params$Resource$Properties$Delete extends StandardParameters {
        /**
         * Required. The name of the Property to soft-delete. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Get extends StandardParameters {
        /**
         * Required. The name of the property to lookup. Format: properties/{property_id\} Example: "properties/1000"
         */
        name?: string;
    }
    export interface Params$Resource$Properties$Getdataretentionsettings extends StandardParameters {
        /**
         * Required. The name of the settings to lookup. Format: properties/{property\}/dataRetentionSettings Example: "properties/1000/dataRetentionSettings"
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaProperty;
    }
    export interface Params$Resource$Properties$Runaccessreport extends StandardParameters {
        /**
         * The Data Access Report supports requesting at the property level or account level. If requested at the account level, Data Access Reports include all access for all properties under that account. To request at the property level, entity should be for example 'properties/123' if "123" is your Google Analytics property ID. To request at the account level, entity should be for example 'accounts/1234' if "1234" is your Google Analytics Account ID.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaRunAccessReportRequest;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaDataRetentionSettings;
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
        create(params?: Params$Resource$Properties$Conversionevents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaConversionEvent>>;
        create(params: Params$Resource$Properties$Conversionevents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Conversionevents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        create(params: Params$Resource$Properties$Conversionevents$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
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
        get(params?: Params$Resource$Properties$Conversionevents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaConversionEvent>>;
        get(params: Params$Resource$Properties$Conversionevents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Conversionevents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        get(params: Params$Resource$Properties$Conversionevents$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        /**
         * Deprecated: Use `ListKeyEvents` instead. Returns a list of conversion events in the specified parent property. Returns an empty list if no conversion events are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Conversionevents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Conversionevents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse>>;
        list(params: Params$Resource$Properties$Conversionevents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Conversionevents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse>): void;
        list(params: Params$Resource$Properties$Conversionevents$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListConversionEventsResponse>): void;
        /**
         * Deprecated: Use `UpdateKeyEvent` instead. Updates a conversion event with the specified attributes.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Conversionevents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaConversionEvent>>;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        patch(params: Params$Resource$Properties$Conversionevents$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaConversionEvent>): void;
    }
    export interface Params$Resource$Properties$Conversionevents$Create extends StandardParameters {
        /**
         * Required. The resource name of the parent property where this conversion event will be created. Format: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaConversionEvent;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaConversionEvent;
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
        create(params?: Params$Resource$Properties$Customdimensions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomDimension>>;
        create(params: Params$Resource$Properties$Customdimensions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Customdimensions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        create(params: Params$Resource$Properties$Customdimensions$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        /**
         * Lookup for a single CustomDimension.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Customdimensions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Customdimensions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomDimension>>;
        get(params: Params$Resource$Properties$Customdimensions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Customdimensions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        get(params: Params$Resource$Properties$Customdimensions$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        /**
         * Lists CustomDimensions on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Customdimensions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Customdimensions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse>>;
        list(params: Params$Resource$Properties$Customdimensions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Customdimensions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse>): void;
        list(params: Params$Resource$Properties$Customdimensions$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomDimensionsResponse>): void;
        /**
         * Updates a CustomDimension on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Customdimensions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomDimension>>;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        patch(params: Params$Resource$Properties$Customdimensions$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomDimension>): void;
    }
    export interface Params$Resource$Properties$Customdimensions$Archive extends StandardParameters {
        /**
         * Required. The name of the CustomDimension to archive. Example format: properties/1234/customDimensions/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaArchiveCustomDimensionRequest;
    }
    export interface Params$Resource$Properties$Customdimensions$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaCustomDimension;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaCustomDimension;
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
        create(params?: Params$Resource$Properties$Custommetrics$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomMetric>>;
        create(params: Params$Resource$Properties$Custommetrics$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Custommetrics$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        create(params: Params$Resource$Properties$Custommetrics$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        /**
         * Lookup for a single CustomMetric.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Properties$Custommetrics$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Properties$Custommetrics$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomMetric>>;
        get(params: Params$Resource$Properties$Custommetrics$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Custommetrics$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        get(params: Params$Resource$Properties$Custommetrics$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        /**
         * Lists CustomMetrics on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Custommetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Custommetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse>>;
        list(params: Params$Resource$Properties$Custommetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Custommetrics$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse>): void;
        list(params: Params$Resource$Properties$Custommetrics$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListCustomMetricsResponse>): void;
        /**
         * Updates a CustomMetric on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Custommetrics$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaCustomMetric>>;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        patch(params: Params$Resource$Properties$Custommetrics$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaCustomMetric>): void;
    }
    export interface Params$Resource$Properties$Custommetrics$Archive extends StandardParameters {
        /**
         * Required. The name of the CustomMetric to archive. Example format: properties/1234/customMetrics/5678
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaArchiveCustomMetricRequest;
    }
    export interface Params$Resource$Properties$Custommetrics$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaCustomMetric;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaCustomMetric;
    }
    export class Resource$Properties$Datastreams {
        context: APIRequestContext;
        measurementProtocolSecrets: Resource$Properties$Datastreams$Measurementprotocolsecrets;
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
        create(params?: Params$Resource$Properties$Datastreams$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataStream>>;
        create(params: Params$Resource$Properties$Datastreams$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        create(params: Params$Resource$Properties$Datastreams$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
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
        get(params?: Params$Resource$Properties$Datastreams$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataStream>>;
        get(params: Params$Resource$Properties$Datastreams$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        get(params: Params$Resource$Properties$Datastreams$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        /**
         * Lists DataStreams on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse>>;
        list(params: Params$Resource$Properties$Datastreams$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListDataStreamsResponse>): void;
        /**
         * Updates a DataStream on a property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaDataStream>>;
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        patch(params: Params$Resource$Properties$Datastreams$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaDataStream>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaDataStream;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaDataStream;
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
        create(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>>;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        create(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
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
        get(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>>;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        get(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        /**
         * Returns child MeasurementProtocolSecrets under the specified parent Property.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse>>;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse>): void;
        list(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListMeasurementProtocolSecretsResponse>): void;
        /**
         * Updates a measurement protocol secret.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>>;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        patch(params: Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret>): void;
    }
    export interface Params$Resource$Properties$Datastreams$Measurementprotocolsecrets$Create extends StandardParameters {
        /**
         * Required. The parent resource where this secret will be created. Format: properties/{property\}/dataStreams/{dataStream\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaMeasurementProtocolSecret;
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
        create(params?: Params$Resource$Properties$Firebaselinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaFirebaseLink>>;
        create(params: Params$Resource$Properties$Firebaselinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Firebaselinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaFirebaseLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaFirebaseLink>): void;
        create(params: Params$Resource$Properties$Firebaselinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaFirebaseLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaFirebaseLink>): void;
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
        list(params?: Params$Resource$Properties$Firebaselinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse>>;
        list(params: Params$Resource$Properties$Firebaselinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Firebaselinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse>): void;
        list(params: Params$Resource$Properties$Firebaselinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListFirebaseLinksResponse>): void;
    }
    export interface Params$Resource$Properties$Firebaselinks$Create extends StandardParameters {
        /**
         * Required. Format: properties/{property_id\} Example: `properties/1234`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaFirebaseLink;
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
        create(params?: Params$Resource$Properties$Googleadslinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>>;
        create(params: Params$Resource$Properties$Googleadslinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Googleadslinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
        create(params: Params$Resource$Properties$Googleadslinks$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
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
        list(params?: Params$Resource$Properties$Googleadslinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse>>;
        list(params: Params$Resource$Properties$Googleadslinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Googleadslinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse>): void;
        list(params: Params$Resource$Properties$Googleadslinks$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListGoogleAdsLinksResponse>): void;
        /**
         * Updates a GoogleAdsLink on a property
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Googleadslinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>>;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
        patch(params: Params$Resource$Properties$Googleadslinks$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink>): void;
    }
    export interface Params$Resource$Properties$Googleadslinks$Create extends StandardParameters {
        /**
         * Required. Example format: properties/1234
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaGoogleAdsLink;
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
        create(params?: Params$Resource$Properties$Keyevents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaKeyEvent>>;
        create(params: Params$Resource$Properties$Keyevents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Properties$Keyevents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        create(params: Params$Resource$Properties$Keyevents$Create, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
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
        get(params?: Params$Resource$Properties$Keyevents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaKeyEvent>>;
        get(params: Params$Resource$Properties$Keyevents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Properties$Keyevents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        get(params: Params$Resource$Properties$Keyevents$Get, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        /**
         * Returns a list of Key Events in the specified parent property. Returns an empty list if no Key Events are found.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Properties$Keyevents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Properties$Keyevents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse>>;
        list(params: Params$Resource$Properties$Keyevents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Properties$Keyevents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse>): void;
        list(params: Params$Resource$Properties$Keyevents$List, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaListKeyEventsResponse>): void;
        /**
         * Updates a Key Event.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Properties$Keyevents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAnalyticsAdminV1betaKeyEvent>>;
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Properties$Keyevents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        patch(params: Params$Resource$Properties$Keyevents$Patch, callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleAnalyticsAdminV1betaKeyEvent>): void;
    }
    export interface Params$Resource$Properties$Keyevents$Create extends StandardParameters {
        /**
         * Required. The resource name of the parent property where this Key Event will be created. Format: properties/123
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAnalyticsAdminV1betaKeyEvent;
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
        requestBody?: Schema$GoogleAnalyticsAdminV1betaKeyEvent;
    }
    export {};
}
