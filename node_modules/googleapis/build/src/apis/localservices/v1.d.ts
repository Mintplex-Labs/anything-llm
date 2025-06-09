import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace localservices_v1 {
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
     * Local Services API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const localservices = google.localservices('v1');
     * ```
     */
    export class Localservices {
        context: APIRequestContext;
        accountReports: Resource$Accountreports;
        detailedLeadReports: Resource$Detailedleadreports;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An Account Report of a GLS account identified by their account id containing aggregate data gathered from a particular date range. Next ID: 18
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1AccountReport {
        /**
         * Unique identifier of the GLS account.
         */
        accountId?: string | null;
        /**
         * Aggregator specific information related to the account.
         */
        aggregatorInfo?: Schema$GoogleAdsHomeservicesLocalservicesV1AggregatorInfo;
        /**
         * Average review rating score from 1-5 stars.
         */
        averageFiveStarRating?: number | null;
        /**
         * Average weekly budget in the currency code of the account.
         */
        averageWeeklyBudget?: number | null;
        /**
         * Business name of the account.
         */
        businessName?: string | null;
        /**
         * Currency code of the account.
         */
        currencyCode?: string | null;
        /**
         * Number of charged leads the account received in current specified period.
         */
        currentPeriodChargedLeads?: string | null;
        /**
         * Number of connected phone calls (duration over 30s) in current specified period.
         */
        currentPeriodConnectedPhoneCalls?: string | null;
        /**
         * Number of phone calls in current specified period, including both connected and unconnected calls.
         */
        currentPeriodPhoneCalls?: string | null;
        /**
         * Total cost of the account in current specified period in the account's specified currency.
         */
        currentPeriodTotalCost?: number | null;
        /**
         * Number of impressions that customers have had in the past 2 days.
         */
        impressionsLastTwoDays?: string | null;
        /**
         * Phone lead responsiveness of the account for the past 90 days from current date. This is computed by taking the total number of connected calls from charged phone leads and dividing by the total number of calls received.
         */
        phoneLeadResponsiveness?: number | null;
        /**
         * Number of charged leads the account received in previous specified period.
         */
        previousPeriodChargedLeads?: string | null;
        /**
         * Number of connected phone calls (duration over 30s) in previous specified period.
         */
        previousPeriodConnectedPhoneCalls?: string | null;
        /**
         * Number of phone calls in previous specified period, including both connected and unconnected calls.
         */
        previousPeriodPhoneCalls?: string | null;
        /**
         * Total cost of the account in previous specified period in the account's specified currency.
         */
        previousPeriodTotalCost?: number | null;
        /**
         * Total number of reviews the account has up to current date.
         */
        totalReview?: number | null;
    }
    /**
     * Conatiner for aggregator specific information if lead is for an aggregator GLS account.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1AggregatorInfo {
        /**
         * Provider id (listed in aggregator system) which maps to a account id in GLS system.
         */
        aggregatorProviderId?: string | null;
    }
    /**
     * Container for booking lead specific information.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1BookingLead {
        /**
         * Timestamp of when service is provided by advertiser.
         */
        bookingAppointmentTimestamp?: string | null;
        /**
         * Consumer email associated with the booking lead.
         */
        consumerEmail?: string | null;
        /**
         * Consumer phone number associated with the booking lead.
         */
        consumerPhoneNumber?: string | null;
        /**
         * Name of the customer who created the lead.
         */
        customerName?: string | null;
        /**
         * The job type of the specified lead.
         */
        jobType?: string | null;
    }
    /**
     * A Detailed Lead Report of a lead identified by their lead id and contains consumer, account, monetization, and lead data.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1DetailedLeadReport {
        /**
         * Identifies account that received the lead.
         */
        accountId?: string | null;
        /**
         * Aggregator specific information related to the lead.
         */
        aggregatorInfo?: Schema$GoogleAdsHomeservicesLocalservicesV1AggregatorInfo;
        /**
         * More information associated to only booking leads.
         */
        bookingLead?: Schema$GoogleAdsHomeservicesLocalservicesV1BookingLead;
        /**
         * Business name associated to the account.
         */
        businessName?: string | null;
        /**
         * Whether the lead has been charged.
         */
        chargeStatus?: string | null;
        /**
         * Currency code.
         */
        currencyCode?: string | null;
        /**
         * Dispute status related to the lead.
         */
        disputeStatus?: string | null;
        /**
         * Location of the associated account's home city.
         */
        geo?: string | null;
        /**
         * Unique identifier of a Detailed Lead Report.
         */
        googleAdsLeadId?: string | null;
        /**
         * Lead category (e.g. hvac, plumber)
         */
        leadCategory?: string | null;
        /**
         * Timestamp of when the lead was created.
         */
        leadCreationTimestamp?: string | null;
        /**
         * Deprecated in favor of google_ads_lead_id. Unique identifier of a Detailed Lead Report.
         */
        leadId?: string | null;
        /**
         * Price of the lead (available only after it has been charged).
         */
        leadPrice?: number | null;
        /**
         * Lead type.
         */
        leadType?: string | null;
        /**
         * More information associated to only message leads.
         */
        messageLead?: Schema$GoogleAdsHomeservicesLocalservicesV1MessageLead;
        /**
         * More information associated to only phone leads.
         */
        phoneLead?: Schema$GoogleAdsHomeservicesLocalservicesV1PhoneLead;
        /**
         * Timezone of the particular provider associated to a lead.
         */
        timezone?: Schema$GoogleTypeTimeZone;
    }
    /**
     * Container for message lead specific information.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1MessageLead {
        /**
         * Consumer phone number associated with the message lead.
         */
        consumerPhoneNumber?: string | null;
        /**
         * Name of the customer who created the lead.
         */
        customerName?: string | null;
        /**
         * The job type of the specified lead.
         */
        jobType?: string | null;
        /**
         * The postal code of the customer who created the lead.
         */
        postalCode?: string | null;
    }
    /**
     * Container for phone lead specific information.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1PhoneLead {
        /**
         * Timestamp of the phone call which resulted in a charged phone lead.
         */
        chargedCallTimestamp?: string | null;
        /**
         * Duration of the charged phone call in seconds.
         */
        chargedConnectedCallDurationSeconds?: string | null;
        /**
         * Consumer phone number associated with the phone lead.
         */
        consumerPhoneNumber?: string | null;
    }
    /**
     * A page of the response received from the SearchAccountReports method. A paginated response where more pages are available has `next_page_token` set. This token can be used in a subsequent request to retrieve the next request page.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse {
        /**
         * List of account reports which maps 1:1 to a particular linked GLS account.
         */
        accountReports?: Schema$GoogleAdsHomeservicesLocalservicesV1AccountReport[];
        /**
         * Pagination token to retrieve the next page of results. When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.
         */
        nextPageToken?: string | null;
    }
    /**
     * A page of the response received from the SearchDetailedLeadReports method. A paginated response where more pages are available has `next_page_token` set. This token can be used in a subsequent request to retrieve the next request page.
     */
    export interface Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse {
        /**
         * List of detailed lead reports uniquely identified by external lead id.
         */
        detailedLeadReports?: Schema$GoogleAdsHomeservicesLocalservicesV1DetailedLeadReport[];
        /**
         * Pagination token to retrieve the next page of results. When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.
         */
        nextPageToken?: string | null;
    }
    /**
     * Represents a time zone from the [IANA Time Zone Database](https://www.iana.org/time-zones).
     */
    export interface Schema$GoogleTypeTimeZone {
        /**
         * IANA Time Zone Database time zone. For example "America/New_York".
         */
        id?: string | null;
        /**
         * Optional. IANA Time Zone Database version number. For example "2019a".
         */
        version?: string | null;
    }
    export class Resource$Accountreports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get account reports containing aggregate account data of all linked GLS accounts. Caller needs to provide their manager customer id and the associated auth credential that allows them read permissions on their linked accounts.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Accountreports$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Accountreports$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse>>;
        search(params: Params$Resource$Accountreports$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Accountreports$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse>, callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse>): void;
        search(params: Params$Resource$Accountreports$Search, callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchAccountReportsResponse>): void;
    }
    export interface Params$Resource$Accountreports$Search extends StandardParameters {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        'endDate.day'?: number;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        'endDate.month'?: number;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        'endDate.year'?: number;
        /**
         * The maximum number of accounts to return. If the page size is unset, page size will default to 1000. Maximum page_size is 10000. Optional.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous request to SearchAccountReports that indicates where listing should continue. Optional.
         */
        pageToken?: string;
        /**
         * A query string for searching for account reports. Caller must provide a customer id of their MCC account with an associated Gaia Mint that allows read permission on their linked accounts. Search expressions are case insensitive. Example query: | Query | Description | |-------------------------|-----------------------------------------------| | manager_customer_id:123 | Get Account Report for Manager with id 123. | Required.
         */
        query?: string;
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        'startDate.day'?: number;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        'startDate.month'?: number;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        'startDate.year'?: number;
    }
    export class Resource$Detailedleadreports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get detailed lead reports containing leads that have been received by all linked GLS accounts. Caller needs to provide their manager customer id and the associated auth credential that allows them read permissions on their linked accounts.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Detailedleadreports$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Detailedleadreports$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse>>;
        search(params: Params$Resource$Detailedleadreports$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Detailedleadreports$Search, options: MethodOptions | BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse>, callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse>): void;
        search(params: Params$Resource$Detailedleadreports$Search, callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse>): void;
        search(callback: BodyResponseCallback<Schema$GoogleAdsHomeservicesLocalservicesV1SearchDetailedLeadReportsResponse>): void;
    }
    export interface Params$Resource$Detailedleadreports$Search extends StandardParameters {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        'endDate.day'?: number;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        'endDate.month'?: number;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        'endDate.year'?: number;
        /**
         * The maximum number of accounts to return. If the page size is unset, page size will default to 1000. Maximum page_size is 10000. Optional.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous request to SearchDetailedLeadReports that indicates where listing should continue. Optional.
         */
        pageToken?: string;
        /**
         * A query string for searching for account reports. Caller must provide a customer id of their MCC account with an associated Gaia Mint that allows read permission on their linked accounts. Search expressions are case insensitive. Example query: | Query | Description | |-------------------------|-----------------------------------------------| | manager_customer_id:123 | Get Detailed Lead Report for Manager with id | | | 123. | Required.
         */
        query?: string;
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        'startDate.day'?: number;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        'startDate.month'?: number;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        'startDate.year'?: number;
    }
    export {};
}
