import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudchannel_v1 {
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
     * Cloud Channel API
     *
     * The Cloud Channel API enables Google Cloud partners to have a single unified resale platform and APIs across all of Google Cloud including GCP, Workspace, Maps and Chrome.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudchannel = google.cloudchannel('v1');
     * ```
     */
    export class Cloudchannel {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        integrators: Resource$Integrators;
        operations: Resource$Operations;
        products: Resource$Products;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request message for CloudChannelService.ActivateEntitlement.
     */
    export interface Schema$GoogleCloudChannelV1ActivateEntitlementRequest {
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Information needed to create an Admin User for Google Workspace.
     */
    export interface Schema$GoogleCloudChannelV1AdminUser {
        /**
         * Primary email of the admin user.
         */
        email?: string | null;
        /**
         * Family name of the admin user.
         */
        familyName?: string | null;
        /**
         * Given name of the admin user.
         */
        givenName?: string | null;
    }
    /**
     * Association links that an entitlement has to other entitlements.
     */
    export interface Schema$GoogleCloudChannelV1alpha1AssociationInfo {
        /**
         * The name of the base entitlement, for which this entitlement is an add-on.
         */
        baseEntitlement?: string | null;
    }
    /**
     * Represents Pub/Sub messages about updates to a Channel Partner. You can retrieve updated values through the ChannelPartnerLinks API.
     */
    export interface Schema$GoogleCloudChannelV1alpha1ChannelPartnerEvent {
        /**
         * Resource name for the Channel Partner Link. Channel_partner uses the format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}
         */
        channelPartner?: string | null;
        /**
         * Type of event which happened for the channel partner.
         */
        eventType?: string | null;
    }
    /**
     * The definition of a report column. Specifies the data properties in the corresponding position of the report rows.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Column {
        /**
         * The unique name of the column (for example, customer_domain, channel_partner, customer_cost). You can use column IDs in RunReportJobRequest.filter. To see all reports and their columns, call CloudChannelReportsService.ListReports.
         */
        columnId?: string | null;
        /**
         * The type of the values for this column.
         */
        dataType?: string | null;
        /**
         * The column's display name.
         */
        displayName?: string | null;
    }
    /**
     * Commitment settings for commitment-based offers.
     */
    export interface Schema$GoogleCloudChannelV1alpha1CommitmentSettings {
        /**
         * Output only. Commitment end timestamp.
         */
        endTime?: string | null;
        /**
         * Optional. Renewal settings applicable for a commitment-based Offer.
         */
        renewalSettings?: Schema$GoogleCloudChannelV1alpha1RenewalSettings;
        /**
         * Output only. Commitment start timestamp.
         */
        startTime?: string | null;
    }
    /**
     * Represents Pub/Sub message content describing customer update.
     */
    export interface Schema$GoogleCloudChannelV1alpha1CustomerEvent {
        /**
         * Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        customer?: string | null;
        /**
         * Type of event which happened for the customer.
         */
        eventType?: string | null;
    }
    /**
     * A representation of usage or invoice date ranges.
     */
    export interface Schema$GoogleCloudChannelV1alpha1DateRange {
        /**
         * The latest invoice date (inclusive). If this value is not the last day of a month, this will move it forward to the last day of the given month.
         */
        invoiceEndDate?: Schema$GoogleTypeDate;
        /**
         * The earliest invoice date (inclusive). If this value is not the first day of a month, this will move it back to the first day of the given month.
         */
        invoiceStartDate?: Schema$GoogleTypeDate;
        /**
         * The latest usage date time (exclusive). If you use time groupings (daily, weekly, etc), each group uses midnight to midnight (Pacific time). The usage end date is rounded down to include all usage from the specified date. We recommend that clients pass `usage_start_date_time` in Pacific time.
         */
        usageEndDateTime?: Schema$GoogleTypeDateTime;
        /**
         * The earliest usage date time (inclusive). If you use time groupings (daily, weekly, etc), each group uses midnight to midnight (Pacific time). The usage start date is rounded down to include all usage from the specified date. We recommend that clients pass `usage_start_date_time` in Pacific time.
         */
        usageStartDateTime?: Schema$GoogleTypeDateTime;
    }
    /**
     * An entitlement is a representation of a customer's ability to use a service.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Entitlement {
        /**
         * The current number of users that are assigned a license for the product defined in provisioned_service.skuId. Read-only. Deprecated: Use `parameters` instead.
         */
        assignedUnits?: number | null;
        /**
         * Association information to other entitlements.
         */
        associationInfo?: Schema$GoogleCloudChannelV1alpha1AssociationInfo;
        /**
         * Optional. The billing account resource name that is used to pay for this entitlement.
         */
        billingAccount?: string | null;
        /**
         * Cloud Identity ID of a channel partner who will be the direct reseller for the customer's order. This field is generally used in 2-tier ordering, where the order is placed by a top-level distributor on behalf of their channel partner or reseller. Required for distributors. Deprecated: `channel_partner_id` has been moved to the Customer.
         */
        channelPartnerId?: string | null;
        /**
         * Commitment settings for a commitment-based Offer. Required for commitment based offers.
         */
        commitmentSettings?: Schema$GoogleCloudChannelV1alpha1CommitmentSettings;
        /**
         * Output only. The time at which the entitlement is created.
         */
        createTime?: string | null;
        /**
         * Maximum number of units for a non commitment-based Offer, such as Flexible, Trial or Free entitlements. For commitment-based entitlements, this is a read-only field, which only the internal support team can update. Deprecated: Use `parameters` instead.
         */
        maxUnits?: number | null;
        /**
         * Output only. Resource name of an entitlement in the form: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}.
         */
        name?: string | null;
        /**
         * Number of units for a commitment-based Offer. For example, for seat-based Offers, this would be the number of seats; for license-based Offers, this would be the number of licenses. Required for creating commitment-based Offers. Deprecated: Use `parameters` instead.
         */
        numUnits?: number | null;
        /**
         * Required. The offer resource name for which the entitlement is to be created. Takes the form: accounts/{account_id\}/offers/{offer_id\}.
         */
        offer?: string | null;
        /**
         * Extended entitlement parameters. When creating an entitlement, valid parameter names and values are defined in the Offer.parameter_definitions. For Google Workspace, the following Parameters may be accepted as input: - max_units: The maximum assignable units for a flexible offer OR - num_units: The total commitment for commitment-based offers The response may additionally include the following output-only Parameters: - assigned_units: The number of licenses assigned to users. For Google Cloud billing subaccounts, the following Parameter may be accepted as input: - display_name: The display name of the billing subaccount.
         */
        parameters?: Schema$GoogleCloudChannelV1alpha1Parameter[];
        /**
         * Optional. Price reference ID for the offer. Only for offers that require additional price information. Used to guarantee that the pricing is consistent between quoting the offer and placing the order.
         */
        priceReferenceId?: string | null;
        /**
         * Output only. Service provisioning details for the entitlement.
         */
        provisionedService?: Schema$GoogleCloudChannelV1alpha1ProvisionedService;
        /**
         * Output only. Current provisioning state of the entitlement.
         */
        provisioningState?: string | null;
        /**
         * Optional. This purchase order (PO) information is for resellers to use for their company tracking usage. If a purchaseOrderId value is given, it appears in the API responses and shows up in the invoice. The property accepts up to 80 plain text characters. This is only supported for Google Workspace entitlements.
         */
        purchaseOrderId?: string | null;
        /**
         * Output only. Enumerable of all current suspension reasons for an entitlement.
         */
        suspensionReasons?: string[] | null;
        /**
         * Output only. Settings for trial offers.
         */
        trialSettings?: Schema$GoogleCloudChannelV1alpha1TrialSettings;
        /**
         * Output only. The time at which the entitlement is updated.
         */
        updateTime?: string | null;
    }
    /**
     * Represents Pub/Sub message content describing entitlement update.
     */
    export interface Schema$GoogleCloudChannelV1alpha1EntitlementEvent {
        /**
         * Resource name of an entitlement of the form: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        entitlement?: string | null;
        /**
         * Type of event which happened for the entitlement.
         */
        eventType?: string | null;
    }
    /**
     * Provides contextual information about a google.longrunning.Operation.
     */
    export interface Schema$GoogleCloudChannelV1alpha1OperationMetadata {
        /**
         * The RPC that initiated this Long Running Operation.
         */
        operationType?: string | null;
    }
    /**
     * Represents Pub/Sub message content describing opportunity updates.
     */
    export interface Schema$GoogleCloudChannelV1alpha1OpportunityEvent {
        /**
         * Type of event which happened for the opportunity.
         */
        eventType?: string | null;
        /**
         * Resource name of the opportunity. Format: opportunities/{opportunity\}
         */
        opportunity?: string | null;
        /**
         * Resource name of the partner. Format: partners/{partner\}
         */
        partner?: string | null;
    }
    /**
     * Definition for extended entitlement parameters.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Parameter {
        /**
         * Output only. Specifies whether this parameter is allowed to be changed. For example, for a Google Workspace Business Starter entitlement in commitment plan, num_units is editable when entitlement is active.
         */
        editable?: boolean | null;
        /**
         * Name of the parameter.
         */
        name?: string | null;
        /**
         * Value of the parameter.
         */
        value?: Schema$GoogleCloudChannelV1alpha1Value;
    }
    /**
     * Represents period in days/months/years.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Period {
        /**
         * Total duration of Period Type defined.
         */
        duration?: number | null;
        /**
         * Period Type.
         */
        periodType?: string | null;
    }
    /**
     * Service provisioned for an entitlement.
     */
    export interface Schema$GoogleCloudChannelV1alpha1ProvisionedService {
        /**
         * Output only. The product pertaining to the provisioning resource as specified in the Offer.
         */
        productId?: string | null;
        /**
         * Output only. Provisioning ID of the entitlement. For Google Workspace, this is the underlying Subscription ID. For Google Cloud, this is the Billing Account ID of the billing subaccount.
         */
        provisioningId?: string | null;
        /**
         * Output only. The SKU pertaining to the provisioning resource as specified in the Offer.
         */
        skuId?: string | null;
    }
    /**
     * Renewal settings for renewable Offers.
     */
    export interface Schema$GoogleCloudChannelV1alpha1RenewalSettings {
        /**
         * If true, disables commitment-based offer on renewal and switches to flexible or pay as you go. Deprecated: Use `payment_plan` instead.
         */
        disableCommitment?: boolean | null;
        /**
         * If false, the plan will be completed at the end date.
         */
        enableRenewal?: boolean | null;
        /**
         * Describes how frequently the reseller will be billed, such as once per month.
         */
        paymentCycle?: Schema$GoogleCloudChannelV1alpha1Period;
        /**
         * Set if enable_renewal=true. Deprecated: Use `payment_cycle` instead.
         */
        paymentOption?: string | null;
        /**
         * Describes how a reseller will be billed.
         */
        paymentPlan?: string | null;
        /**
         * If true and enable_renewal = true, the unit (for example seats or licenses) will be set to the number of active units at renewal time.
         */
        resizeUnitCount?: boolean | null;
        /**
         * Output only. The offer resource name that the entitlement will renew on at the end date. Takes the form: accounts/{account_id\}/offers/{offer_id\}.
         */
        scheduledRenewalOffer?: string | null;
    }
    /**
     * The ID and description of a report that was used to generate report data. For example, "Google Cloud Daily Spend", "Google Workspace License Activity", etc.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Report {
        /**
         * The list of columns included in the report. This defines the schema of the report results.
         */
        columns?: Schema$GoogleCloudChannelV1alpha1Column[];
        /**
         * A description of other aspects of the report, such as the products it supports.
         */
        description?: string | null;
        /**
         * A human-readable name for this report.
         */
        displayName?: string | null;
        /**
         * Required. The report's resource name. Specifies the account and report used to generate report data. The report_id identifier is a UID (for example, `613bf59q`). Name uses the format: accounts/{account_id\}/reports/{report_id\}
         */
        name?: string | null;
    }
    /**
     * The result of a RunReportJob operation. Contains the name to use in FetchReportResultsRequest.report_job and the status of the operation.
     */
    export interface Schema$GoogleCloudChannelV1alpha1ReportJob {
        /**
         * Required. The resource name of a report job. Name uses the format: `accounts/{account_id\}/reportJobs/{report_job_id\}`
         */
        name?: string | null;
        /**
         * The current status of report generation.
         */
        reportStatus?: Schema$GoogleCloudChannelV1alpha1ReportStatus;
    }
    /**
     * The features describing the data. Returned by CloudChannelReportsService.RunReportJob and CloudChannelReportsService.FetchReportResults.
     */
    export interface Schema$GoogleCloudChannelV1alpha1ReportResultsMetadata {
        /**
         * The date range of reported usage.
         */
        dateRange?: Schema$GoogleCloudChannelV1alpha1DateRange;
        /**
         * The usage dates immediately preceding `date_range` with the same duration. Use this to calculate trending usage and costs. This is only populated if you request trending data. For example, if `date_range` is July 1-15, `preceding_date_range` will be June 16-30.
         */
        precedingDateRange?: Schema$GoogleCloudChannelV1alpha1DateRange;
        /**
         * Details of the completed report.
         */
        report?: Schema$GoogleCloudChannelV1alpha1Report;
        /**
         * The total number of rows of data in the final report.
         */
        rowCount?: string | null;
    }
    /**
     * Status of a report generation process.
     */
    export interface Schema$GoogleCloudChannelV1alpha1ReportStatus {
        /**
         * The report generation's completion time.
         */
        endTime?: string | null;
        /**
         * The report generation's start time.
         */
        startTime?: string | null;
        /**
         * The current state of the report generation process.
         */
        state?: string | null;
    }
    /**
     * Response message for CloudChannelReportsService.RunReportJob.
     */
    export interface Schema$GoogleCloudChannelV1alpha1RunReportJobResponse {
        /**
         * Pass `report_job.name` to FetchReportResultsRequest.report_job to retrieve the report's results.
         */
        reportJob?: Schema$GoogleCloudChannelV1alpha1ReportJob;
        /**
         * The metadata for the report's results (display name, columns, row count, and date range). If you view this before the operation finishes, you may see incomplete data.
         */
        reportMetadata?: Schema$GoogleCloudChannelV1alpha1ReportResultsMetadata;
    }
    /**
     * Represents information which resellers will get as part of notification from Pub/Sub.
     */
    export interface Schema$GoogleCloudChannelV1alpha1SubscriberEvent {
        /**
         * Channel Partner event sent as part of Pub/Sub event to partners.
         */
        channelPartnerEvent?: Schema$GoogleCloudChannelV1alpha1ChannelPartnerEvent;
        /**
         * Customer event sent as part of Pub/Sub event to partners.
         */
        customerEvent?: Schema$GoogleCloudChannelV1alpha1CustomerEvent;
        /**
         * Entitlement event sent as part of Pub/Sub event to partners.
         */
        entitlementEvent?: Schema$GoogleCloudChannelV1alpha1EntitlementEvent;
        /**
         * Opportunity event sent as part of Pub/Sub event to partners/integrators.
         */
        opportunityEvent?: Schema$GoogleCloudChannelV1alpha1OpportunityEvent;
    }
    /**
     * Response message for CloudChannelService.TransferEntitlements. This is put in the response field of google.longrunning.Operation.
     */
    export interface Schema$GoogleCloudChannelV1alpha1TransferEntitlementsResponse {
        /**
         * The transferred entitlements.
         */
        entitlements?: Schema$GoogleCloudChannelV1alpha1Entitlement[];
    }
    /**
     * Settings for trial offers.
     */
    export interface Schema$GoogleCloudChannelV1alpha1TrialSettings {
        /**
         * Date when the trial ends. The value is in milliseconds using the UNIX Epoch format. See an example [Epoch converter](https://www.epochconverter.com).
         */
        endTime?: string | null;
        /**
         * Determines if the entitlement is in a trial or not: * `true` - The entitlement is in trial. * `false` - The entitlement is not in trial.
         */
        trial?: boolean | null;
    }
    /**
     * Data type and value of a parameter.
     */
    export interface Schema$GoogleCloudChannelV1alpha1Value {
        /**
         * Represents a boolean value.
         */
        boolValue?: boolean | null;
        /**
         * Represents a double value.
         */
        doubleValue?: number | null;
        /**
         * Represents an int64 value.
         */
        int64Value?: string | null;
        /**
         * Represents an 'Any' proto value.
         */
        protoValue?: {
            [key: string]: any;
        } | null;
        /**
         * Represents a string value.
         */
        stringValue?: string | null;
    }
    /**
     * Association links that an entitlement has to other entitlements.
     */
    export interface Schema$GoogleCloudChannelV1AssociationInfo {
        /**
         * The name of the base entitlement, for which this entitlement is an add-on.
         */
        baseEntitlement?: string | null;
    }
    /**
     * Represents the Billable SKU information.
     */
    export interface Schema$GoogleCloudChannelV1BillableSku {
        /**
         * Resource name of Service which contains Repricing SKU. Format: services/{service\}. Example: "services/B7D9-FDCB-15D8".
         */
        service?: string | null;
        /**
         * Unique human readable name for the Service.
         */
        serviceDisplayName?: string | null;
        /**
         * Resource name of Billable SKU. Format: billableSkus/{sku\}. Example: billableSkus/6E1B-6634-470F".
         */
        sku?: string | null;
        /**
         * Unique human readable name for the SKU.
         */
        skuDisplayName?: string | null;
    }
    /**
     * Represents a billing account.
     */
    export interface Schema$GoogleCloudChannelV1BillingAccount {
        /**
         * Output only. The time when this billing account was created.
         */
        createTime?: string | null;
        /**
         * Output only. The 3-letter currency code defined in ISO 4217.
         */
        currencyCode?: string | null;
        /**
         * Display name of the billing account.
         */
        displayName?: string | null;
        /**
         * Output only. Resource name of the billing account. Format: accounts/{account_id\}/billingAccounts/{billing_account_id\}.
         */
        name?: string | null;
        /**
         * Output only. The CLDR region code.
         */
        regionCode?: string | null;
    }
    /**
     * Represents a billing account that can be used to make a purchase.
     */
    export interface Schema$GoogleCloudChannelV1BillingAccountPurchaseInfo {
        /**
         * The billing account resource.
         */
        billingAccount?: Schema$GoogleCloudChannelV1BillingAccount;
    }
    /**
     * Request message for CloudChannelService.CancelEntitlement.
     */
    export interface Schema$GoogleCloudChannelV1CancelEntitlementRequest {
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Request message for CloudChannelService.ChangeOffer.
     */
    export interface Schema$GoogleCloudChannelV1ChangeOfferRequest {
        /**
         * Optional. The billing account resource name that is used to pay for this entitlement when setting up billing on a trial subscription. This field is only relevant for multi-currency accounts. It should be left empty for single currency accounts.
         */
        billingAccount?: string | null;
        /**
         * Required. New Offer. Format: accounts/{account_id\}/offers/{offer_id\}.
         */
        offer?: string | null;
        /**
         * Optional. Parameters needed to purchase the Offer. To view the available Parameters refer to the Offer.parameter_definitions from the desired offer.
         */
        parameters?: Schema$GoogleCloudChannelV1Parameter[];
        /**
         * Optional. Price reference ID for the offer. Only for offers that require additional price information. Used to guarantee that the pricing is consistent between quoting the offer and placing the order.
         */
        priceReferenceId?: string | null;
        /**
         * Optional. Purchase order id provided by the reseller.
         */
        purchaseOrderId?: string | null;
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Request message for CloudChannelService.ChangeParameters.
     */
    export interface Schema$GoogleCloudChannelV1ChangeParametersRequest {
        /**
         * Required. Entitlement parameters to update. You can only change editable parameters. To view the available Parameters for a request, refer to the Offer.parameter_definitions from the desired offer.
         */
        parameters?: Schema$GoogleCloudChannelV1Parameter[];
        /**
         * Optional. Purchase order ID provided by the reseller.
         */
        purchaseOrderId?: string | null;
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Request message for CloudChannelService.ChangeRenewalSettings.
     */
    export interface Schema$GoogleCloudChannelV1ChangeRenewalSettingsRequest {
        /**
         * Required. New renewal settings.
         */
        renewalSettings?: Schema$GoogleCloudChannelV1RenewalSettings;
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Entity representing a link between distributors and their indirect resellers in an n-tier resale channel.
     */
    export interface Schema$GoogleCloudChannelV1ChannelPartnerLink {
        /**
         * Output only. Cloud Identity info of the channel partner (IR).
         */
        channelPartnerCloudIdentityInfo?: Schema$GoogleCloudChannelV1CloudIdentityInfo;
        /**
         * Output only. Timestamp of when the channel partner link is created.
         */
        createTime?: string | null;
        /**
         * Output only. URI of the web page where partner accepts the link invitation.
         */
        inviteLinkUri?: string | null;
        /**
         * Required. State of the channel partner link.
         */
        linkState?: string | null;
        /**
         * Output only. Resource name for the channel partner link, in the format accounts/{account_id\}/channelPartnerLinks/{id\}.
         */
        name?: string | null;
        /**
         * Output only. Public identifier that a customer must use to generate a transfer token to move to this distributor-reseller combination.
         */
        publicId?: string | null;
        /**
         * Required. Cloud Identity ID of the linked reseller.
         */
        resellerCloudIdentityId?: string | null;
        /**
         * Output only. Timestamp of when the channel partner link is updated.
         */
        updateTime?: string | null;
    }
    /**
     * Configuration for how a distributor will rebill a channel partner (also known as a distributor-authorized reseller).
     */
    export interface Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig {
        /**
         * Output only. Resource name of the ChannelPartnerRepricingConfig. Format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}/channelPartnerRepricingConfigs/{id\}.
         */
        name?: string | null;
        /**
         * Required. The configuration for bill modifications made by a reseller before sending it to ChannelPartner.
         */
        repricingConfig?: Schema$GoogleCloudChannelV1RepricingConfig;
        /**
         * Output only. Timestamp of an update to the repricing rule. If `update_time` is after RepricingConfig.effective_invoice_month then it indicates this was set mid-month.
         */
        updateTime?: string | null;
    }
    /**
     * Request message for CloudChannelService.CheckCloudIdentityAccountsExist.
     */
    export interface Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistRequest {
        /**
         * Required. Domain to fetch for Cloud Identity account customers, including domain and team customers. For team customers, please use the domain for their emails.
         */
        domain?: string | null;
        /**
         * Optional. Primary admin email to fetch for Cloud Identity account team customer.
         */
        primaryAdminEmail?: string | null;
    }
    /**
     * Response message for CloudChannelService.CheckCloudIdentityAccountsExist.
     */
    export interface Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse {
        /**
         * The Cloud Identity accounts associated with the domain.
         */
        cloudIdentityAccounts?: Schema$GoogleCloudChannelV1CloudIdentityCustomerAccount[];
    }
    /**
     * Entity representing a Cloud Identity account that may be associated with a Channel Services API partner.
     */
    export interface Schema$GoogleCloudChannelV1CloudIdentityCustomerAccount {
        /**
         * If existing = true, and is 2-tier customer, the channel partner of the customer.
         */
        channelPartnerCloudIdentityId?: string | null;
        /**
         * If existing = true, the Cloud Identity ID of the customer.
         */
        customerCloudIdentityId?: string | null;
        /**
         * If owned = true, the name of the customer that owns the Cloud Identity account. Customer_name uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        customerName?: string | null;
        /**
         * If existing = true, the type of the customer.
         */
        customerType?: string | null;
        /**
         * Returns true if a Cloud Identity account exists for a specific domain.
         */
        existing?: boolean | null;
        /**
         * Returns true if the Cloud Identity account is associated with a customer of the Channel Services partner (with active subscriptions or purchase consents).
         */
        owned?: boolean | null;
    }
    /**
     * Cloud Identity information for the Cloud Channel Customer.
     */
    export interface Schema$GoogleCloudChannelV1CloudIdentityInfo {
        /**
         * Output only. URI of Customer's Admin console dashboard.
         */
        adminConsoleUri?: string | null;
        /**
         * The alternate email.
         */
        alternateEmail?: string | null;
        /**
         * CustomerType indicates verification type needed for using services.
         */
        customerType?: string | null;
        /**
         * Edu information about the customer.
         */
        eduData?: Schema$GoogleCloudChannelV1EduData;
        /**
         * Output only. Whether the domain is verified. This field is not returned for a Customer's cloud_identity_info resource. Partners can use the domains.get() method of the Workspace SDK's Directory API, or listen to the PRIMARY_DOMAIN_VERIFIED Pub/Sub event in to track domain verification of their resolve Workspace customers.
         */
        isDomainVerified?: boolean | null;
        /**
         * Language code.
         */
        languageCode?: string | null;
        /**
         * Phone number associated with the Cloud Identity.
         */
        phoneNumber?: string | null;
        /**
         * Output only. The primary domain name.
         */
        primaryDomain?: string | null;
    }
    /**
     * The definition of a report column. Specifies the data properties in the corresponding position of the report rows.
     */
    export interface Schema$GoogleCloudChannelV1Column {
        /**
         * The unique name of the column (for example, customer_domain, channel_partner, customer_cost). You can use column IDs in RunReportJobRequest.filter. To see all reports and their columns, call CloudChannelReportsService.ListReports.
         */
        columnId?: string | null;
        /**
         * The type of the values for this column.
         */
        dataType?: string | null;
        /**
         * The column's display name.
         */
        displayName?: string | null;
    }
    /**
     * Commitment settings for commitment-based offers.
     */
    export interface Schema$GoogleCloudChannelV1CommitmentSettings {
        /**
         * Output only. Commitment end timestamp.
         */
        endTime?: string | null;
        /**
         * Optional. Renewal settings applicable for a commitment-based Offer.
         */
        renewalSettings?: Schema$GoogleCloudChannelV1RenewalSettings;
        /**
         * Output only. Commitment start timestamp.
         */
        startTime?: string | null;
    }
    /**
     * Specifies the override to conditionally apply.
     */
    export interface Schema$GoogleCloudChannelV1ConditionalOverride {
        /**
         * Required. Information about the applied override's adjustment.
         */
        adjustment?: Schema$GoogleCloudChannelV1RepricingAdjustment;
        /**
         * Required. The RebillingBasis to use for the applied override. Shows the relative cost based on your repricing costs.
         */
        rebillingBasis?: string | null;
        /**
         * Required. Specifies the condition which, if met, will apply the override.
         */
        repricingCondition?: Schema$GoogleCloudChannelV1RepricingCondition;
    }
    /**
     * Represents the constraints for buying the Offer.
     */
    export interface Schema$GoogleCloudChannelV1Constraints {
        /**
         * Represents constraints required to purchase the Offer for a customer.
         */
        customerConstraints?: Schema$GoogleCloudChannelV1CustomerConstraints;
    }
    /**
     * Contact information for a customer account.
     */
    export interface Schema$GoogleCloudChannelV1ContactInfo {
        /**
         * Output only. The customer account contact's display name, formatted as a combination of the customer's first and last name.
         */
        displayName?: string | null;
        /**
         * The customer account's contact email. Required for entitlements that create admin.google.com accounts, and serves as the customer's username for those accounts. Use this email to invite Team customers.
         */
        email?: string | null;
        /**
         * The customer account contact's first name. Optional for Team customers.
         */
        firstName?: string | null;
        /**
         * The customer account contact's last name. Optional for Team customers.
         */
        lastName?: string | null;
        /**
         * The customer account's contact phone number.
         */
        phone?: string | null;
        /**
         * Optional. The customer account contact's job title.
         */
        title?: string | null;
    }
    /**
     * Request message for CloudChannelService.CreateEntitlement
     */
    export interface Schema$GoogleCloudChannelV1CreateEntitlementRequest {
        /**
         * Required. The entitlement to create.
         */
        entitlement?: Schema$GoogleCloudChannelV1Entitlement;
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Entity representing a customer of a reseller or distributor.
     */
    export interface Schema$GoogleCloudChannelV1Customer {
        /**
         * Secondary contact email. You need to provide an alternate email to create different domains if a primary contact email already exists. Users will receive a notification with credentials when you create an admin.google.com account. Secondary emails are also recovery email addresses. Alternate emails are optional when you create Team customers.
         */
        alternateEmail?: string | null;
        /**
         * Cloud Identity ID of the customer's channel partner. Populated only if a channel partner exists for this customer.
         */
        channelPartnerId?: string | null;
        /**
         * Output only. The customer's Cloud Identity ID if the customer has a Cloud Identity resource.
         */
        cloudIdentityId?: string | null;
        /**
         * Output only. Cloud Identity information for the customer. Populated only if a Cloud Identity account exists for this customer.
         */
        cloudIdentityInfo?: Schema$GoogleCloudChannelV1CloudIdentityInfo;
        /**
         * Optional. External CRM ID for the customer. Populated only if a CRM ID exists for this customer.
         */
        correlationId?: string | null;
        /**
         * Output only. Time when the customer was created.
         */
        createTime?: string | null;
        /**
         * Optional. Indicate if a customer is attesting about the correctness of provided information. Only required if creating a GCP Entitlement.
         */
        customerAttestationState?: string | null;
        /**
         * Required. The customer's primary domain. Must match the primary contact email's domain.
         */
        domain?: string | null;
        /**
         * Optional. The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see https://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Output only. Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        name?: string | null;
        /**
         * Required. Name of the organization that the customer entity represents.
         */
        orgDisplayName?: string | null;
        /**
         * Required. The organization address for the customer. To enforce US laws and embargoes, we require a region, postal code, and address lines. You must provide valid addresses for every customer. To set the customer's language, use the Customer-level language code.
         */
        orgPostalAddress?: Schema$GoogleTypePostalAddress;
        /**
         * Primary contact info.
         */
        primaryContactInfo?: Schema$GoogleCloudChannelV1ContactInfo;
        /**
         * Output only. Time when the customer was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Represents constraints required to purchase the Offer for a customer.
     */
    export interface Schema$GoogleCloudChannelV1CustomerConstraints {
        /**
         * Allowed Customer Type.
         */
        allowedCustomerTypes?: string[] | null;
        /**
         * Allowed geographical regions of the customer.
         */
        allowedRegions?: string[] | null;
        /**
         * Allowed Promotional Order Type. Present for Promotional offers.
         */
        promotionalOrderTypes?: string[] | null;
    }
    /**
     * Represents Pub/Sub message content describing customer update.
     */
    export interface Schema$GoogleCloudChannelV1CustomerEvent {
        /**
         * Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        customer?: string | null;
        /**
         * Type of event which happened for the customer.
         */
        eventType?: string | null;
    }
    /**
     * Configuration for how a reseller will reprice a Customer.
     */
    export interface Schema$GoogleCloudChannelV1CustomerRepricingConfig {
        /**
         * Output only. Resource name of the CustomerRepricingConfig. Format: accounts/{account_id\}/customers/{customer_id\}/customerRepricingConfigs/{id\}.
         */
        name?: string | null;
        /**
         * Required. The configuration for bill modifications made by a reseller before sending it to customers.
         */
        repricingConfig?: Schema$GoogleCloudChannelV1RepricingConfig;
        /**
         * Output only. Timestamp of an update to the repricing rule. If `update_time` is after RepricingConfig.effective_invoice_month then it indicates this was set mid-month.
         */
        updateTime?: string | null;
    }
    /**
     * A representation of usage or invoice date ranges.
     */
    export interface Schema$GoogleCloudChannelV1DateRange {
        /**
         * The latest invoice date (inclusive). If this value is not the last day of a month, this will move it forward to the last day of the given month.
         */
        invoiceEndDate?: Schema$GoogleTypeDate;
        /**
         * The earliest invoice date (inclusive). If this value is not the first day of a month, this will move it back to the first day of the given month.
         */
        invoiceStartDate?: Schema$GoogleTypeDate;
        /**
         * The latest usage date time (exclusive). If you use time groupings (daily, weekly, etc), each group uses midnight to midnight (Pacific time). The usage end date is rounded down to include all usage from the specified date. We recommend that clients pass `usage_start_date_time` in Pacific time.
         */
        usageEndDateTime?: Schema$GoogleTypeDateTime;
        /**
         * The earliest usage date time (inclusive). If you use time groupings (daily, weekly, etc), each group uses midnight to midnight (Pacific time). The usage start date is rounded down to include all usage from the specified date. We recommend that clients pass `usage_start_date_time` in Pacific time.
         */
        usageStartDateTime?: Schema$GoogleTypeDateTime;
    }
    /**
     * Required Edu Attributes
     */
    export interface Schema$GoogleCloudChannelV1EduData {
        /**
         * Size of the institute.
         */
        instituteSize?: string | null;
        /**
         * Designated institute type of customer.
         */
        instituteType?: string | null;
        /**
         * Web address for the edu customer's institution.
         */
        website?: string | null;
    }
    /**
     * An entitlement is a representation of a customer's ability to use a service.
     */
    export interface Schema$GoogleCloudChannelV1Entitlement {
        /**
         * Association information to other entitlements.
         */
        associationInfo?: Schema$GoogleCloudChannelV1AssociationInfo;
        /**
         * Optional. The billing account resource name that is used to pay for this entitlement.
         */
        billingAccount?: string | null;
        /**
         * Commitment settings for a commitment-based Offer. Required for commitment based offers.
         */
        commitmentSettings?: Schema$GoogleCloudChannelV1CommitmentSettings;
        /**
         * Output only. The time at which the entitlement is created.
         */
        createTime?: string | null;
        /**
         * Output only. Resource name of an entitlement in the form: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}.
         */
        name?: string | null;
        /**
         * Required. The offer resource name for which the entitlement is to be created. Takes the form: accounts/{account_id\}/offers/{offer_id\}.
         */
        offer?: string | null;
        /**
         * Extended entitlement parameters. When creating an entitlement, valid parameter names and values are defined in the Offer.parameter_definitions. For Google Workspace, the following Parameters may be accepted as input: - max_units: The maximum assignable units for a flexible offer OR - num_units: The total commitment for commitment-based offers The response may additionally include the following output-only Parameters: - assigned_units: The number of licenses assigned to users. For Google Cloud billing subaccounts, the following Parameter may be accepted as input: - display_name: The display name of the billing subaccount.
         */
        parameters?: Schema$GoogleCloudChannelV1Parameter[];
        /**
         * Optional. Price reference ID for the offer. Only for offers that require additional price information. Used to guarantee that the pricing is consistent between quoting the offer and placing the order.
         */
        priceReferenceId?: string | null;
        /**
         * Output only. Service provisioning details for the entitlement.
         */
        provisionedService?: Schema$GoogleCloudChannelV1ProvisionedService;
        /**
         * Output only. Current provisioning state of the entitlement.
         */
        provisioningState?: string | null;
        /**
         * Optional. This purchase order (PO) information is for resellers to use for their company tracking usage. If a purchaseOrderId value is given, it appears in the API responses and shows up in the invoice. The property accepts up to 80 plain text characters. This is only supported for Google Workspace entitlements.
         */
        purchaseOrderId?: string | null;
        /**
         * Output only. Enumerable of all current suspension reasons for an entitlement.
         */
        suspensionReasons?: string[] | null;
        /**
         * Output only. Settings for trial offers.
         */
        trialSettings?: Schema$GoogleCloudChannelV1TrialSettings;
        /**
         * Output only. The time at which the entitlement is updated.
         */
        updateTime?: string | null;
    }
    /**
     * Change event entry for Entitlement order history
     */
    export interface Schema$GoogleCloudChannelV1EntitlementChange {
        /**
         * The Entitlement's activation reason
         */
        activationReason?: string | null;
        /**
         * Cancellation reason for the Entitlement.
         */
        cancellationReason?: string | null;
        /**
         * The change action type.
         */
        changeType?: string | null;
        /**
         * The submitted time of the change.
         */
        createTime?: string | null;
        /**
         * Required. Resource name of an entitlement in the form: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        entitlement?: string | null;
        /**
         * Required. Resource name of the Offer at the time of change. Takes the form: accounts/{account_id\}/offers/{offer_id\}.
         */
        offer?: string | null;
        /**
         * Human-readable identifier that shows what operator made a change. When the operator_type is RESELLER, this is the user's email address. For all other operator types, this is empty.
         */
        operator?: string | null;
        /**
         * Operator type responsible for the change.
         */
        operatorType?: string | null;
        /**
         * e.g. purchase_number change reason, entered by CRS.
         */
        otherChangeReason?: string | null;
        /**
         * Extended parameters, such as: purchase_order_number, gcp_details; internal_correlation_id, long_running_operation_id, order_id; etc.
         */
        parameters?: Schema$GoogleCloudChannelV1Parameter[];
        /**
         * Service provisioned for an Entitlement.
         */
        provisionedService?: Schema$GoogleCloudChannelV1ProvisionedService;
        /**
         * Suspension reason for the Entitlement.
         */
        suspensionReason?: string | null;
    }
    /**
     * Represents Pub/Sub message content describing entitlement update.
     */
    export interface Schema$GoogleCloudChannelV1EntitlementEvent {
        /**
         * Resource name of an entitlement of the form: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        entitlement?: string | null;
        /**
         * Type of event which happened for the entitlement.
         */
        eventType?: string | null;
    }
    /**
     * Request message for CloudChannelReportsService.FetchReportResults.
     */
    export interface Schema$GoogleCloudChannelV1FetchReportResultsRequest {
        /**
         * Optional. Requested page size of the report. The server may return fewer results than requested. If you don't specify a page size, the server uses a sensible default (may change over time). The maximum value is 30,000; the server will change larger values to 30,000.
         */
        pageSize?: number | null;
        /**
         * Optional. A token that specifies a page of results beyond the first page. Obtained through FetchReportResultsResponse.next_page_token of the previous CloudChannelReportsService.FetchReportResults call.
         */
        pageToken?: string | null;
        /**
         * Optional. List of keys specifying which report partitions to return. If empty, returns all partitions.
         */
        partitionKeys?: string[] | null;
    }
    /**
     * Response message for CloudChannelReportsService.FetchReportResults. Contains a tabular representation of the report results.
     */
    export interface Schema$GoogleCloudChannelV1FetchReportResultsResponse {
        /**
         * Pass this token to FetchReportResultsRequest.page_token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The metadata for the report results (display name, columns, row count, and date ranges).
         */
        reportMetadata?: Schema$GoogleCloudChannelV1ReportResultsMetadata;
        /**
         * The report's lists of values. Each row follows the settings and ordering of the columns from `report_metadata`.
         */
        rows?: Schema$GoogleCloudChannelV1Row[];
    }
    /**
     * Request message for CloudChannelService.ImportCustomer
     */
    export interface Schema$GoogleCloudChannelV1ImportCustomerRequest {
        /**
         * Optional. The super admin of the resold customer generates this token to authorize a reseller to access their Cloud Identity and purchase entitlements on their behalf. You can omit this token after authorization. See https://support.google.com/a/answer/7643790 for more details.
         */
        authToken?: string | null;
        /**
         * Optional. Cloud Identity ID of a channel partner who will be the direct reseller for the customer's order. This field is required for 2-tier transfer scenarios and can be provided via the request Parent binding as well.
         */
        channelPartnerId?: string | null;
        /**
         * Required. Customer's Cloud Identity ID
         */
        cloudIdentityId?: string | null;
        /**
         * Optional. Specifies the customer that will receive imported Cloud Identity information. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        customer?: string | null;
        /**
         * Required. Customer domain.
         */
        domain?: string | null;
        /**
         * Required. Choose to overwrite an existing customer if found. This must be set to true if there is an existing customer with a conflicting region code or domain.
         */
        overwriteIfExists?: boolean | null;
        /**
         * Required. Customer's primary admin email.
         */
        primaryAdminEmail?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListChannelPartnerLinks.
     */
    export interface Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse {
        /**
         * The Channel partner links for a reseller.
         */
        channelPartnerLinks?: Schema$GoogleCloudChannelV1ChannelPartnerLink[];
        /**
         * A token to retrieve the next page of results. Pass to ListChannelPartnerLinksRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListChannelPartnerRepricingConfigs.
     */
    export interface Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse {
        /**
         * The repricing configs for this channel partner.
         */
        channelPartnerRepricingConfigs?: Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig[];
        /**
         * A token to retrieve the next page of results. Pass to ListChannelPartnerRepricingConfigsRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListCustomerRepricingConfigs.
     */
    export interface Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse {
        /**
         * The repricing configs for this channel partner.
         */
        customerRepricingConfigs?: Schema$GoogleCloudChannelV1CustomerRepricingConfig[];
        /**
         * A token to retrieve the next page of results. Pass to ListCustomerRepricingConfigsRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListCustomers.
     */
    export interface Schema$GoogleCloudChannelV1ListCustomersResponse {
        /**
         * The customers belonging to a reseller or distributor.
         */
        customers?: Schema$GoogleCloudChannelV1Customer[];
        /**
         * A token to retrieve the next page of results. Pass to ListCustomersRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListEntitlementChanges
     */
    export interface Schema$GoogleCloudChannelV1ListEntitlementChangesResponse {
        /**
         * The list of entitlement changes.
         */
        entitlementChanges?: Schema$GoogleCloudChannelV1EntitlementChange[];
        /**
         * A token to list the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListEntitlements.
     */
    export interface Schema$GoogleCloudChannelV1ListEntitlementsResponse {
        /**
         * The reseller customer's entitlements.
         */
        entitlements?: Schema$GoogleCloudChannelV1Entitlement[];
        /**
         * A token to list the next page of results. Pass to ListEntitlementsRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListOffers.
     */
    export interface Schema$GoogleCloudChannelV1ListOffersResponse {
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of Offers requested. The pricing information for each Offer only includes the base price. Effective prices and discounts aren't populated.
         */
        offers?: Schema$GoogleCloudChannelV1Offer[];
    }
    /**
     * Response message for ListProducts.
     */
    export interface Schema$GoogleCloudChannelV1ListProductsResponse {
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * List of Products requested.
         */
        products?: Schema$GoogleCloudChannelV1Product[];
    }
    /**
     * Response message for ListPurchasableOffers.
     */
    export interface Schema$GoogleCloudChannelV1ListPurchasableOffersResponse {
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of Offers requested.
         */
        purchasableOffers?: Schema$GoogleCloudChannelV1PurchasableOffer[];
    }
    /**
     * Response message for ListPurchasableSkus.
     */
    export interface Schema$GoogleCloudChannelV1ListPurchasableSkusResponse {
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of SKUs requested.
         */
        purchasableSkus?: Schema$GoogleCloudChannelV1PurchasableSku[];
    }
    /**
     * Response message for CloudChannelReportsService.ListReports.
     */
    export interface Schema$GoogleCloudChannelV1ListReportsResponse {
        /**
         * Pass this token to FetchReportResultsRequest.page_token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The reports available to the partner.
         */
        reports?: Schema$GoogleCloudChannelV1Report[];
    }
    /**
     * Response message for ListSkuGroupBillableSkus.
     */
    export interface Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse {
        /**
         * The list of billable SKUs in the requested SKU group.
         */
        billableSkus?: Schema$GoogleCloudChannelV1BillableSku[];
        /**
         * A token to retrieve the next page of results. Pass to ListSkuGroupBillableSkusRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListSkuGroups.
     */
    export interface Schema$GoogleCloudChannelV1ListSkuGroupsResponse {
        /**
         * A token to retrieve the next page of results. Pass to ListSkuGroupsRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
        /**
         * The list of SKU groups requested.
         */
        skuGroups?: Schema$GoogleCloudChannelV1SkuGroup[];
    }
    /**
     * Response message for ListSkus.
     */
    export interface Schema$GoogleCloudChannelV1ListSkusResponse {
        /**
         * A token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of SKUs requested.
         */
        skus?: Schema$GoogleCloudChannelV1Sku[];
    }
    /**
     * Response Message for ListSubscribers.
     */
    export interface Schema$GoogleCloudChannelV1ListSubscribersResponse {
        /**
         * A token that can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * List of service accounts which have subscriber access to the topic.
         */
        serviceAccounts?: string[] | null;
        /**
         * Name of the topic registered with the reseller.
         */
        topic?: string | null;
    }
    /**
     * Request message for CloudChannelService.ListTransferableOffers
     */
    export interface Schema$GoogleCloudChannelV1ListTransferableOffersRequest {
        /**
         * Optional. The Billing Account to look up Offers for. Format: accounts/{account_id\}/billingAccounts/{billing_account_id\}. This field is only relevant for multi-currency accounts. It should be left empty for single currency accounts.
         */
        billingAccount?: string | null;
        /**
         * Customer's Cloud Identity ID
         */
        cloudIdentityId?: string | null;
        /**
         * A reseller should create a customer and use the resource name of that customer here.
         */
        customerName?: string | null;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string | null;
        /**
         * Requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 offers. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number | null;
        /**
         * A token for a page of results other than the first page. Obtained using ListTransferableOffersResponse.next_page_token of the previous CloudChannelService.ListTransferableOffers call.
         */
        pageToken?: string | null;
        /**
         * Required. The SKU to look up Offers for.
         */
        sku?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListTransferableOffers.
     */
    export interface Schema$GoogleCloudChannelV1ListTransferableOffersResponse {
        /**
         * A token to retrieve the next page of results. Pass to ListTransferableOffersRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
        /**
         * Information about Offers for a customer that can be used for transfer.
         */
        transferableOffers?: Schema$GoogleCloudChannelV1TransferableOffer[];
    }
    /**
     * Request message for CloudChannelService.ListTransferableSkus
     */
    export interface Schema$GoogleCloudChannelV1ListTransferableSkusRequest {
        /**
         * Optional. The super admin of the resold customer generates this token to authorize a reseller to access their Cloud Identity and purchase entitlements on their behalf. You can omit this token after authorization. See https://support.google.com/a/answer/7643790 for more details.
         */
        authToken?: string | null;
        /**
         * Customer's Cloud Identity ID
         */
        cloudIdentityId?: string | null;
        /**
         * A reseller is required to create a customer and use the resource name of the created customer here. Customer_name uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        customerName?: string | null;
        /**
         * The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US". Optional.
         */
        languageCode?: string | null;
        /**
         * The requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 SKUs. The maximum value is 1000; the server will coerce values above 1000. Optional.
         */
        pageSize?: number | null;
        /**
         * A token for a page of results other than the first page. Obtained using ListTransferableSkusResponse.next_page_token of the previous CloudChannelService.ListTransferableSkus call. Optional.
         */
        pageToken?: string | null;
    }
    /**
     * Response message for CloudChannelService.ListTransferableSkus.
     */
    export interface Schema$GoogleCloudChannelV1ListTransferableSkusResponse {
        /**
         * A token to retrieve the next page of results. Pass to ListTransferableSkusRequest.page_token to obtain that page.
         */
        nextPageToken?: string | null;
        /**
         * Information about existing SKUs for a customer that needs a transfer.
         */
        transferableSkus?: Schema$GoogleCloudChannelV1TransferableSku[];
    }
    /**
     * Represents the marketing information for a Product, SKU or Offer.
     */
    export interface Schema$GoogleCloudChannelV1MarketingInfo {
        /**
         * Default logo.
         */
        defaultLogo?: Schema$GoogleCloudChannelV1Media;
        /**
         * Human readable description. Description can contain HTML.
         */
        description?: string | null;
        /**
         * Human readable name.
         */
        displayName?: string | null;
    }
    /**
     * Represents media information.
     */
    export interface Schema$GoogleCloudChannelV1Media {
        /**
         * URL of the media.
         */
        content?: string | null;
        /**
         * Title of the media.
         */
        title?: string | null;
        /**
         * Type of the media.
         */
        type?: string | null;
    }
    /**
     * Represents an offer made to resellers for purchase. An offer is associated with a Sku, has a plan for payment, a price, and defines the constraints for buying.
     */
    export interface Schema$GoogleCloudChannelV1Offer {
        /**
         * Constraints on transacting the Offer.
         */
        constraints?: Schema$GoogleCloudChannelV1Constraints;
        /**
         * The deal code of the offer to get a special promotion or discount.
         */
        dealCode?: string | null;
        /**
         * Output only. End of the Offer validity time.
         */
        endTime?: string | null;
        /**
         * Marketing information for the Offer.
         */
        marketingInfo?: Schema$GoogleCloudChannelV1MarketingInfo;
        /**
         * Resource Name of the Offer. Format: accounts/{account_id\}/offers/{offer_id\}
         */
        name?: string | null;
        /**
         * Parameters required to use current Offer to purchase.
         */
        parameterDefinitions?: Schema$GoogleCloudChannelV1ParameterDefinition[];
        /**
         * Describes the payment plan for the Offer.
         */
        plan?: Schema$GoogleCloudChannelV1Plan;
        /**
         * Price for each monetizable resource type.
         */
        priceByResources?: Schema$GoogleCloudChannelV1PriceByResource[];
        /**
         * SKU the offer is associated with.
         */
        sku?: Schema$GoogleCloudChannelV1Sku;
        /**
         * Start of the Offer validity time.
         */
        startTime?: string | null;
    }
    /**
     * Provides contextual information about a google.longrunning.Operation.
     */
    export interface Schema$GoogleCloudChannelV1OperationMetadata {
        /**
         * The RPC that initiated this Long Running Operation.
         */
        operationType?: string | null;
    }
    /**
     * Definition for extended entitlement parameters.
     */
    export interface Schema$GoogleCloudChannelV1Parameter {
        /**
         * Output only. Specifies whether this parameter is allowed to be changed. For example, for a Google Workspace Business Starter entitlement in commitment plan, num_units is editable when entitlement is active.
         */
        editable?: boolean | null;
        /**
         * Name of the parameter.
         */
        name?: string | null;
        /**
         * Value of the parameter.
         */
        value?: Schema$GoogleCloudChannelV1Value;
    }
    /**
     * Parameter's definition. Specifies what parameter is required to use the current Offer to purchase.
     */
    export interface Schema$GoogleCloudChannelV1ParameterDefinition {
        /**
         * If not empty, parameter values must be drawn from this list. For example, [us-west1, us-west2, ...] Applicable to STRING parameter type.
         */
        allowedValues?: Schema$GoogleCloudChannelV1Value[];
        /**
         * Maximum value of the parameter, if applicable. Inclusive. For example, maximum seats when purchasing Google Workspace Business Standard. Applicable to INT64 and DOUBLE parameter types.
         */
        maxValue?: Schema$GoogleCloudChannelV1Value;
        /**
         * Minimal value of the parameter, if applicable. Inclusive. For example, minimal commitment when purchasing Anthos is 0.01. Applicable to INT64 and DOUBLE parameter types.
         */
        minValue?: Schema$GoogleCloudChannelV1Value;
        /**
         * Name of the parameter.
         */
        name?: string | null;
        /**
         * If set to true, parameter is optional to purchase this Offer.
         */
        optional?: boolean | null;
        /**
         * Data type of the parameter. Minimal value, Maximum value and allowed values will use specified data type here.
         */
        parameterType?: string | null;
    }
    /**
     * An adjustment that applies a flat markup or markdown to an entire bill.
     */
    export interface Schema$GoogleCloudChannelV1PercentageAdjustment {
        /**
         * The percentage of the bill to adjust. For example: Mark down by 1% =\> "-1.00" Mark up by 1% =\> "1.00" Pass-Through =\> "0.00"
         */
        percentage?: Schema$GoogleTypeDecimal;
    }
    /**
     * Represents period in days/months/years.
     */
    export interface Schema$GoogleCloudChannelV1Period {
        /**
         * Total duration of Period Type defined.
         */
        duration?: number | null;
        /**
         * Period Type.
         */
        periodType?: string | null;
    }
    /**
     * The payment plan for the Offer. Describes how to make a payment.
     */
    export interface Schema$GoogleCloudChannelV1Plan {
        /**
         * Reseller Billing account to charge after an offer transaction. Only present for Google Cloud offers.
         */
        billingAccount?: string | null;
        /**
         * Describes how frequently the reseller will be billed, such as once per month.
         */
        paymentCycle?: Schema$GoogleCloudChannelV1Period;
        /**
         * Describes how a reseller will be billed.
         */
        paymentPlan?: string | null;
        /**
         * Specifies when the payment needs to happen.
         */
        paymentType?: string | null;
        /**
         * Present for Offers with a trial period. For trial-only Offers, a paid service needs to start before the trial period ends for continued service. For Regular Offers with a trial period, the regular pricing goes into effect when trial period ends, or if paid service is started before the end of the trial period.
         */
        trialPeriod?: Schema$GoogleCloudChannelV1Period;
    }
    /**
     * Represents the price of the Offer.
     */
    export interface Schema$GoogleCloudChannelV1Price {
        /**
         * Base price.
         */
        basePrice?: Schema$GoogleTypeMoney;
        /**
         * Discount percentage, represented as decimal. For example, a 20% discount will be represent as 0.2.
         */
        discount?: number | null;
        /**
         * Effective Price after applying the discounts.
         */
        effectivePrice?: Schema$GoogleTypeMoney;
        /**
         * Link to external price list, such as link to Google Voice rate card.
         */
        externalPriceUri?: string | null;
    }
    /**
     * Represents price by resource type.
     */
    export interface Schema$GoogleCloudChannelV1PriceByResource {
        /**
         * Price of the Offer. Present if there are no price phases.
         */
        price?: Schema$GoogleCloudChannelV1Price;
        /**
         * Specifies the price by time range.
         */
        pricePhases?: Schema$GoogleCloudChannelV1PricePhase[];
        /**
         * Resource Type. Example: SEAT
         */
        resourceType?: string | null;
    }
    /**
     * Specifies the price by the duration of months. For example, a 20% discount for the first six months, then a 10% discount starting on the seventh month.
     */
    export interface Schema$GoogleCloudChannelV1PricePhase {
        /**
         * Defines first period for the phase.
         */
        firstPeriod?: number | null;
        /**
         * Defines first period for the phase.
         */
        lastPeriod?: number | null;
        /**
         * Defines the phase period type.
         */
        periodType?: string | null;
        /**
         * Price of the phase. Present if there are no price tiers.
         */
        price?: Schema$GoogleCloudChannelV1Price;
        /**
         * Price by the resource tiers.
         */
        priceTiers?: Schema$GoogleCloudChannelV1PriceTier[];
    }
    /**
     * Defines price at resource tier level. For example, an offer with following definition : * Tier 1: Provide 25% discount for all seats between 1 and 25. * Tier 2: Provide 10% discount for all seats between 26 and 100. * Tier 3: Provide flat 15% discount for all seats above 100. Each of these tiers is represented as a PriceTier.
     */
    export interface Schema$GoogleCloudChannelV1PriceTier {
        /**
         * First resource for which the tier price applies.
         */
        firstResource?: number | null;
        /**
         * Last resource for which the tier price applies.
         */
        lastResource?: number | null;
        /**
         * Price of the tier.
         */
        price?: Schema$GoogleCloudChannelV1Price;
    }
    /**
     * A Product is the entity a customer uses when placing an order. For example, Google Workspace, Google Voice, etc.
     */
    export interface Schema$GoogleCloudChannelV1Product {
        /**
         * Marketing information for the product.
         */
        marketingInfo?: Schema$GoogleCloudChannelV1MarketingInfo;
        /**
         * Resource Name of the Product. Format: products/{product_id\}
         */
        name?: string | null;
    }
    /**
     * Request message for CloudChannelService.ProvisionCloudIdentity
     */
    export interface Schema$GoogleCloudChannelV1ProvisionCloudIdentityRequest {
        /**
         * CloudIdentity-specific customer information.
         */
        cloudIdentityInfo?: Schema$GoogleCloudChannelV1CloudIdentityInfo;
        /**
         * Admin user information.
         */
        user?: Schema$GoogleCloudChannelV1AdminUser;
        /**
         * Validate the request and preview the review, but do not post it.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Service provisioned for an entitlement.
     */
    export interface Schema$GoogleCloudChannelV1ProvisionedService {
        /**
         * Output only. The product pertaining to the provisioning resource as specified in the Offer.
         */
        productId?: string | null;
        /**
         * Output only. Provisioning ID of the entitlement. For Google Workspace, this is the underlying Subscription ID. For Google Cloud, this is the Billing Account ID of the billing subaccount.
         */
        provisioningId?: string | null;
        /**
         * Output only. The SKU pertaining to the provisioning resource as specified in the Offer.
         */
        skuId?: string | null;
    }
    /**
     * Offer that you can purchase for a customer. This is used in the ListPurchasableOffer API response.
     */
    export interface Schema$GoogleCloudChannelV1PurchasableOffer {
        /**
         * Offer.
         */
        offer?: Schema$GoogleCloudChannelV1Offer;
        /**
         * Optional. Price reference ID for the offer. Only for offers that require additional price information. Used to guarantee that the pricing is consistent between quoting the offer and placing the order.
         */
        priceReferenceId?: string | null;
    }
    /**
     * SKU that you can purchase. This is used in ListPurchasableSku API response.
     */
    export interface Schema$GoogleCloudChannelV1PurchasableSku {
        /**
         * SKU
         */
        sku?: Schema$GoogleCloudChannelV1Sku;
    }
    /**
     * Response message for QueryEligibleBillingAccounts.
     */
    export interface Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse {
        /**
         * List of SKU purchase groups where each group represents a set of SKUs that must be purchased using the same billing account. Each SKU from [QueryEligibleBillingAccountsRequest.skus] will appear in exactly one SKU group.
         */
        skuPurchaseGroups?: Schema$GoogleCloudChannelV1SkuPurchaseGroup[];
    }
    /**
     * Request Message for RegisterSubscriber.
     */
    export interface Schema$GoogleCloudChannelV1RegisterSubscriberRequest {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string | null;
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string | null;
        /**
         * Required. Service account that provides subscriber access to the registered topic.
         */
        serviceAccount?: string | null;
    }
    /**
     * Response Message for RegisterSubscriber.
     */
    export interface Schema$GoogleCloudChannelV1RegisterSubscriberResponse {
        /**
         * Name of the topic the subscriber will listen to.
         */
        topic?: string | null;
    }
    /**
     * Renewal settings for renewable Offers.
     */
    export interface Schema$GoogleCloudChannelV1RenewalSettings {
        /**
         * If false, the plan will be completed at the end date.
         */
        enableRenewal?: boolean | null;
        /**
         * Describes how frequently the reseller will be billed, such as once per month.
         */
        paymentCycle?: Schema$GoogleCloudChannelV1Period;
        /**
         * Describes how a reseller will be billed.
         */
        paymentPlan?: string | null;
        /**
         * If true and enable_renewal = true, the unit (for example seats or licenses) will be set to the number of active units at renewal time.
         */
        resizeUnitCount?: boolean | null;
    }
    /**
     * The ID and description of a report that was used to generate report data. For example, "Google Cloud Daily Spend", "Google Workspace License Activity", etc.
     */
    export interface Schema$GoogleCloudChannelV1Report {
        /**
         * The list of columns included in the report. This defines the schema of the report results.
         */
        columns?: Schema$GoogleCloudChannelV1Column[];
        /**
         * A description of other aspects of the report, such as the products it supports.
         */
        description?: string | null;
        /**
         * A human-readable name for this report.
         */
        displayName?: string | null;
        /**
         * Required. The report's resource name. Specifies the account and report used to generate report data. The report_id identifier is a UID (for example, `613bf59q`). Name uses the format: accounts/{account_id\}/reports/{report_id\}
         */
        name?: string | null;
    }
    /**
     * The result of a RunReportJob operation. Contains the name to use in FetchReportResultsRequest.report_job and the status of the operation.
     */
    export interface Schema$GoogleCloudChannelV1ReportJob {
        /**
         * Required. The resource name of a report job. Name uses the format: `accounts/{account_id\}/reportJobs/{report_job_id\}`
         */
        name?: string | null;
        /**
         * The current status of report generation.
         */
        reportStatus?: Schema$GoogleCloudChannelV1ReportStatus;
    }
    /**
     * The features describing the data. Returned by CloudChannelReportsService.RunReportJob and CloudChannelReportsService.FetchReportResults.
     */
    export interface Schema$GoogleCloudChannelV1ReportResultsMetadata {
        /**
         * The date range of reported usage.
         */
        dateRange?: Schema$GoogleCloudChannelV1DateRange;
        /**
         * The usage dates immediately preceding `date_range` with the same duration. Use this to calculate trending usage and costs. This is only populated if you request trending data. For example, if `date_range` is July 1-15, `preceding_date_range` will be June 16-30.
         */
        precedingDateRange?: Schema$GoogleCloudChannelV1DateRange;
        /**
         * Details of the completed report.
         */
        report?: Schema$GoogleCloudChannelV1Report;
        /**
         * The total number of rows of data in the final report.
         */
        rowCount?: string | null;
    }
    /**
     * Status of a report generation process.
     */
    export interface Schema$GoogleCloudChannelV1ReportStatus {
        /**
         * The report generation's completion time.
         */
        endTime?: string | null;
        /**
         * The report generation's start time.
         */
        startTime?: string | null;
        /**
         * The current state of the report generation process.
         */
        state?: string | null;
    }
    /**
     * A single report value.
     */
    export interface Schema$GoogleCloudChannelV1ReportValue {
        /**
         * A value of type `google.type.DateTime` (year, month, day, hour, minute, second, and UTC offset or timezone.)
         */
        dateTimeValue?: Schema$GoogleTypeDateTime;
        /**
         * A value of type `google.type.Date` (year, month, day).
         */
        dateValue?: Schema$GoogleTypeDate;
        /**
         * A value of type `google.type.Decimal`, representing non-integer numeric values.
         */
        decimalValue?: Schema$GoogleTypeDecimal;
        /**
         * A value of type `int`.
         */
        intValue?: string | null;
        /**
         * A value of type `google.type.Money` (currency code, whole units, decimal units).
         */
        moneyValue?: Schema$GoogleTypeMoney;
        /**
         * A value of type `string`.
         */
        stringValue?: string | null;
    }
    /**
     * A type that represents the various adjustments you can apply to a bill.
     */
    export interface Schema$GoogleCloudChannelV1RepricingAdjustment {
        /**
         * Flat markup or markdown on an entire bill.
         */
        percentageAdjustment?: Schema$GoogleCloudChannelV1PercentageAdjustment;
    }
    /**
     * Represents the various repricing conditions you can use for a conditional override.
     */
    export interface Schema$GoogleCloudChannelV1RepricingCondition {
        /**
         * SKU Group condition for override.
         */
        skuGroupCondition?: Schema$GoogleCloudChannelV1SkuGroupCondition;
    }
    /**
     * Configuration for repricing a Google bill over a period of time.
     */
    export interface Schema$GoogleCloudChannelV1RepricingConfig {
        /**
         * Required. Information about the adjustment.
         */
        adjustment?: Schema$GoogleCloudChannelV1RepricingAdjustment;
        /**
         * Applies the repricing configuration at the channel partner level. Only ChannelPartnerRepricingConfig supports this value. Deprecated: This is no longer supported. Use RepricingConfig.entitlement_granularity instead.
         */
        channelPartnerGranularity?: Schema$GoogleCloudChannelV1RepricingConfigChannelPartnerGranularity;
        /**
         * The conditional overrides to apply for this configuration. If you list multiple overrides, only the first valid override is used. If you don't list any overrides, the API uses the normal adjustment and rebilling basis.
         */
        conditionalOverrides?: Schema$GoogleCloudChannelV1ConditionalOverride[];
        /**
         * Required. The YearMonth when these adjustments activate. The Day field needs to be "0" since we only accept YearMonth repricing boundaries.
         */
        effectiveInvoiceMonth?: Schema$GoogleTypeDate;
        /**
         * Applies the repricing configuration at the entitlement level. Note: If a ChannelPartnerRepricingConfig using RepricingConfig.EntitlementGranularity becomes effective, then no existing or future RepricingConfig.ChannelPartnerGranularity will apply to the RepricingConfig.EntitlementGranularity.entitlement. This is the recommended value for both CustomerRepricingConfig and ChannelPartnerRepricingConfig.
         */
        entitlementGranularity?: Schema$GoogleCloudChannelV1RepricingConfigEntitlementGranularity;
        /**
         * Required. The RebillingBasis to use for this bill. Specifies the relative cost based on repricing costs you will apply.
         */
        rebillingBasis?: string | null;
    }
    /**
     * Applies the repricing configuration at the channel partner level. The channel partner value is derived from the resource name. Takes an empty json object. Deprecated: This is no longer supported. Use RepricingConfig.EntitlementGranularity instead.
     */
    export interface Schema$GoogleCloudChannelV1RepricingConfigChannelPartnerGranularity {
    }
    /**
     * Applies the repricing configuration at the entitlement level.
     */
    export interface Schema$GoogleCloudChannelV1RepricingConfigEntitlementGranularity {
        /**
         * Resource name of the entitlement. Format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        entitlement?: string | null;
    }
    /**
     * A row of report values.
     */
    export interface Schema$GoogleCloudChannelV1Row {
        /**
         * The key for the partition this row belongs to. This field is empty if the report is not partitioned.
         */
        partitionKey?: string | null;
        /**
         * The list of values in the row.
         */
        values?: Schema$GoogleCloudChannelV1ReportValue[];
    }
    /**
     * Request message for CloudChannelReportsService.RunReportJob.
     */
    export interface Schema$GoogleCloudChannelV1RunReportJobRequest {
        /**
         * Optional. The range of usage or invoice dates to include in the result.
         */
        dateRange?: Schema$GoogleCloudChannelV1DateRange;
        /**
         * Optional. A structured string that defines conditions on dimension columns to restrict the report output. Filters support logical operators (AND, OR, NOT) and conditional operators (=, !=, <, \>, <=, and \>=) using `column_id` as keys. For example: `(customer:"accounts/C123abc/customers/S456def" OR customer:"accounts/C123abc/customers/S789ghi") AND invoice_start_date.year \>= 2022`
         */
        filter?: string | null;
        /**
         * Optional. The BCP-47 language code, such as "en-US". If specified, the response is localized to the corresponding language code if the original data sources support it. Default is "en-US".
         */
        languageCode?: string | null;
    }
    /**
     * Response message for CloudChannelReportsService.RunReportJob.
     */
    export interface Schema$GoogleCloudChannelV1RunReportJobResponse {
        /**
         * Pass `report_job.name` to FetchReportResultsRequest.report_job to retrieve the report's results.
         */
        reportJob?: Schema$GoogleCloudChannelV1ReportJob;
        /**
         * The metadata for the report's results (display name, columns, row count, and date range). If you view this before the operation finishes, you may see incomplete data.
         */
        reportMetadata?: Schema$GoogleCloudChannelV1ReportResultsMetadata;
    }
    /**
     * Represents a product's purchasable Stock Keeping Unit (SKU). SKUs represent the different variations of the product. For example, Google Workspace Business Standard and Google Workspace Business Plus are Google Workspace product SKUs.
     */
    export interface Schema$GoogleCloudChannelV1Sku {
        /**
         * Marketing information for the SKU.
         */
        marketingInfo?: Schema$GoogleCloudChannelV1MarketingInfo;
        /**
         * Resource Name of the SKU. Format: products/{product_id\}/skus/{sku_id\}
         */
        name?: string | null;
        /**
         * Product the SKU is associated with.
         */
        product?: Schema$GoogleCloudChannelV1Product;
    }
    /**
     * Represents the SKU group information.
     */
    export interface Schema$GoogleCloudChannelV1SkuGroup {
        /**
         * Unique human readable identifier for the SKU group.
         */
        displayName?: string | null;
        /**
         * Resource name of SKU group. Format: accounts/{account\}/skuGroups/{sku_group\}. Example: "accounts/C01234/skuGroups/3d50fd57-3157-4577-a5a9-a219b8490041".
         */
        name?: string | null;
    }
    /**
     * A condition that applies the override if a line item SKU is found in the SKU group.
     */
    export interface Schema$GoogleCloudChannelV1SkuGroupCondition {
        /**
         * Specifies a SKU group (https://cloud.google.com/skus/sku-groups). Resource name of SKU group. Format: accounts/{account\}/skuGroups/{sku_group\}. Example: "accounts/C01234/skuGroups/3d50fd57-3157-4577-a5a9-a219b8490041".
         */
        skuGroup?: string | null;
    }
    /**
     * Represents a set of SKUs that must be purchased using the same billing account.
     */
    export interface Schema$GoogleCloudChannelV1SkuPurchaseGroup {
        /**
         * List of billing accounts that are eligible to purhcase these SKUs.
         */
        billingAccountPurchaseInfos?: Schema$GoogleCloudChannelV1BillingAccountPurchaseInfo[];
        /**
         * Resource names of the SKUs included in this group. Format: products/{product_id\}/skus/{sku_id\}.
         */
        skus?: string[] | null;
    }
    /**
     * Request message for CloudChannelService.StartPaidService.
     */
    export interface Schema$GoogleCloudChannelV1StartPaidServiceRequest {
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Represents information which resellers will get as part of notification from Pub/Sub.
     */
    export interface Schema$GoogleCloudChannelV1SubscriberEvent {
        /**
         * Customer event sent as part of Pub/Sub event to partners.
         */
        customerEvent?: Schema$GoogleCloudChannelV1CustomerEvent;
        /**
         * Entitlement event sent as part of Pub/Sub event to partners.
         */
        entitlementEvent?: Schema$GoogleCloudChannelV1EntitlementEvent;
    }
    /**
     * Request message for CloudChannelService.SuspendEntitlement.
     */
    export interface Schema$GoogleCloudChannelV1SuspendEntitlementRequest {
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * TransferableOffer represents an Offer that can be used in Transfer. Read-only.
     */
    export interface Schema$GoogleCloudChannelV1TransferableOffer {
        /**
         * Offer with parameter constraints updated to allow the Transfer.
         */
        offer?: Schema$GoogleCloudChannelV1Offer;
        /**
         * Optional. Price reference ID for the offer. Only for offers that require additional price information. Used to guarantee that the pricing is consistent between quoting the offer and placing the order.
         */
        priceReferenceId?: string | null;
    }
    /**
     * TransferableSku represents information a reseller needs to view existing provisioned services for a customer that they do not own. Read-only.
     */
    export interface Schema$GoogleCloudChannelV1TransferableSku {
        /**
         * Optional. The customer to transfer has an entitlement with the populated legacy SKU.
         */
        legacySku?: Schema$GoogleCloudChannelV1Sku;
        /**
         * The SKU pertaining to the provisioning resource as specified in the Offer.
         */
        sku?: Schema$GoogleCloudChannelV1Sku;
        /**
         * Describes the transfer eligibility of a SKU.
         */
        transferEligibility?: Schema$GoogleCloudChannelV1TransferEligibility;
    }
    /**
     * Specifies transfer eligibility of a SKU.
     */
    export interface Schema$GoogleCloudChannelV1TransferEligibility {
        /**
         * Localized description if reseller is not eligible to transfer the SKU.
         */
        description?: string | null;
        /**
         * Specified the reason for ineligibility.
         */
        ineligibilityReason?: string | null;
        /**
         * Whether reseller is eligible to transfer the SKU.
         */
        isEligible?: boolean | null;
    }
    /**
     * Request message for CloudChannelService.TransferEntitlements.
     */
    export interface Schema$GoogleCloudChannelV1TransferEntitlementsRequest {
        /**
         * The super admin of the resold customer generates this token to authorize a reseller to access their Cloud Identity and purchase entitlements on their behalf. You can omit this token after authorization. See https://support.google.com/a/answer/7643790 for more details.
         */
        authToken?: string | null;
        /**
         * Required. The new entitlements to create or transfer.
         */
        entitlements?: Schema$GoogleCloudChannelV1Entitlement[];
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Response message for CloudChannelService.TransferEntitlements. This is put in the response field of google.longrunning.Operation.
     */
    export interface Schema$GoogleCloudChannelV1TransferEntitlementsResponse {
        /**
         * The transferred entitlements.
         */
        entitlements?: Schema$GoogleCloudChannelV1Entitlement[];
    }
    /**
     * Request message for CloudChannelService.TransferEntitlementsToGoogle.
     */
    export interface Schema$GoogleCloudChannelV1TransferEntitlementsToGoogleRequest {
        /**
         * Required. The entitlements to transfer to Google.
         */
        entitlements?: Schema$GoogleCloudChannelV1Entitlement[];
        /**
         * Optional. You can specify an optional unique request ID, and if you need to retry your request, the server will know to ignore the request if it's complete. For example, you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if it received the original operation with the same request ID. If it did, it will ignore the second request. The request ID must be a valid [UUID](https://tools.ietf.org/html/rfc4122) with the exception that zero UUID is not supported (`00000000-0000-0000-0000-000000000000`).
         */
        requestId?: string | null;
    }
    /**
     * Settings for trial offers.
     */
    export interface Schema$GoogleCloudChannelV1TrialSettings {
        /**
         * Date when the trial ends. The value is in milliseconds using the UNIX Epoch format. See an example [Epoch converter](https://www.epochconverter.com).
         */
        endTime?: string | null;
        /**
         * Determines if the entitlement is in a trial or not: * `true` - The entitlement is in trial. * `false` - The entitlement is not in trial.
         */
        trial?: boolean | null;
    }
    /**
     * Request Message for UnregisterSubscriber.
     */
    export interface Schema$GoogleCloudChannelV1UnregisterSubscriberRequest {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string | null;
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string | null;
        /**
         * Required. Service account to unregister from subscriber access to the topic.
         */
        serviceAccount?: string | null;
    }
    /**
     * Response Message for UnregisterSubscriber.
     */
    export interface Schema$GoogleCloudChannelV1UnregisterSubscriberResponse {
        /**
         * Name of the topic the service account subscriber access was removed from.
         */
        topic?: string | null;
    }
    /**
     * Request message for CloudChannelService.UpdateChannelPartnerLink
     */
    export interface Schema$GoogleCloudChannelV1UpdateChannelPartnerLinkRequest {
        /**
         * Required. The channel partner link to update. Only channel_partner_link.link_state is allowed for updates.
         */
        channelPartnerLink?: Schema$GoogleCloudChannelV1ChannelPartnerLink;
        /**
         * Required. The update mask that applies to the resource. The only allowable value for an update mask is channel_partner_link.link_state.
         */
        updateMask?: string | null;
    }
    /**
     * Data type and value of a parameter.
     */
    export interface Schema$GoogleCloudChannelV1Value {
        /**
         * Represents a boolean value.
         */
        boolValue?: boolean | null;
        /**
         * Represents a double value.
         */
        doubleValue?: number | null;
        /**
         * Represents an int64 value.
         */
        int64Value?: string | null;
        /**
         * Represents an 'Any' proto value.
         */
        protoValue?: {
            [key: string]: any;
        } | null;
        /**
         * Represents a string value.
         */
        stringValue?: string | null;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$GoogleLongrunningCancelOperationRequest {
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$GoogleLongrunningListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$GoogleLongrunningOperation[];
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id\}`.
         */
        name?: string | null;
        /**
         * The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$GoogleRpcStatus {
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
    /**
     * Represents civil time (or occasionally physical time). This type can represent a civil time in one of a few possible ways: * When utc_offset is set and time_zone is unset: a civil time on a calendar day with a particular offset from UTC. * When time_zone is set and utc_offset is unset: a civil time on a calendar day in a particular time zone. * When neither time_zone nor utc_offset is set: a civil time on a calendar day in local time. The date is relative to the Proleptic Gregorian Calendar. If year, month, or day are 0, the DateTime is considered not to have a specific year, month, or day respectively. This type may also be used to represent a physical time if all the date and time fields are set and either case of the `time_offset` oneof is set. Consider using `Timestamp` message for physical time instead. If your use case also would like to store the user's timezone, that can be done in another field. This type is more flexible than some applications may want. Make sure to document and validate your application's limitations.
     */
    export interface Schema$GoogleTypeDateTime {
        /**
         * Optional. Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a datetime without a day.
         */
        day?: number | null;
        /**
         * Optional. Hours of day in 24 hour format. Should be from 0 to 23, defaults to 0 (midnight). An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Optional. Minutes of hour of day. Must be from 0 to 59, defaults to 0.
         */
        minutes?: number | null;
        /**
         * Optional. Month of year. Must be from 1 to 12, or 0 if specifying a datetime without a month.
         */
        month?: number | null;
        /**
         * Optional. Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999, defaults to 0.
         */
        nanos?: number | null;
        /**
         * Optional. Seconds of minutes of the time. Must normally be from 0 to 59, defaults to 0. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
        /**
         * Time zone.
         */
        timeZone?: Schema$GoogleTypeTimeZone;
        /**
         * UTC offset. Must be whole seconds, between -18 hours and +18 hours. For example, a UTC offset of -4:00 would be represented as { seconds: -14400 \}.
         */
        utcOffset?: string | null;
        /**
         * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a datetime without a year.
         */
        year?: number | null;
    }
    /**
     * A representation of a decimal value, such as 2.5. Clients may convert values into language-native decimal formats, such as Java's [BigDecimal](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/math/BigDecimal.html) or Python's [decimal.Decimal](https://docs.python.org/3/library/decimal.html).
     */
    export interface Schema$GoogleTypeDecimal {
        /**
         * The decimal value, as a string. The string representation consists of an optional sign, `+` (`U+002B`) or `-` (`U+002D`), followed by a sequence of zero or more decimal digits ("the integer"), optionally followed by a fraction, optionally followed by an exponent. An empty string **should** be interpreted as `0`. The fraction consists of a decimal point followed by zero or more decimal digits. The string must contain at least one digit in either the integer or the fraction. The number formed by the sign, the integer and the fraction is referred to as the significand. The exponent consists of the character `e` (`U+0065`) or `E` (`U+0045`) followed by one or more decimal digits. Services **should** normalize decimal values before storing them by: - Removing an explicitly-provided `+` sign (`+2.5` -\> `2.5`). - Replacing a zero-length integer value with `0` (`.5` -\> `0.5`). - Coercing the exponent character to upper-case, with explicit sign (`2.5e8` -\> `2.5E+8`). - Removing an explicitly-provided zero exponent (`2.5E0` -\> `2.5`). Services **may** perform additional normalization based on its own needs and the internal decimal implementation selected, such as shifting the decimal point and exponent value together (example: `2.5E-1` <-\> `0.25`). Additionally, services **may** preserve trailing zeroes in the fraction to indicate increased precision, but are not required to do so. Note that only the `.` character is supported to divide the integer and the fraction; `,` **should not** be supported regardless of locale. Additionally, thousand separators **should not** be supported. If a service does support them, values **must** be normalized. The ENBF grammar is: DecimalString = '' | [Sign] Significand [Exponent]; Sign = '+' | '-'; Significand = Digits '.' | [Digits] '.' Digits; Exponent = ('e' | 'E') [Sign] Digits; Digits = { '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' \}; Services **should** clearly document the range of supported values, the maximum supported precision (total number of digits), and, if applicable, the scale (number of digits after the decimal point), as well as how it behaves when receiving out-of-bounds values. Services **may** choose to accept values passed as input even when the value has a higher precision or scale than the service supports, and **should** round the value to fit the supported scale. Alternatively, the service **may** error with `400 Bad Request` (`INVALID_ARGUMENT` in gRPC) if precision would be lost. Services **should** error with `400 Bad Request` (`INVALID_ARGUMENT` in gRPC) if the service receives a value outside of the supported range.
         */
        value?: string | null;
    }
    /**
     * Represents an amount of money with its currency type.
     */
    export interface Schema$GoogleTypeMoney {
        /**
         * The three-letter currency code defined in ISO 4217.
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
     * Represents a postal address (for example, for postal delivery or payments addresses). Given a postal address, a postal service can deliver items to a premise, P.O. box or similar. It is not intended to model geographical locations (roads, towns, mountains). In typical usage, an address would be created by user input or from importing existing data, depending on the type of process. Advice on address input or editing: - Use an internationalization-ready address widget such as https://github.com/google/libaddressinput. - Users should not be presented with UI elements for input or editing of fields outside countries where that field is used. For more guidance on how to use this schema, see: https://support.google.com/business/answer/6397478.
     */
    export interface Schema$GoogleTypePostalAddress {
        /**
         * Unstructured address lines describing the lower levels of an address. Because values in `address_lines` do not have type information and may sometimes contain multiple values in a single field (for example, "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country or region of the address. In places where this can vary (for example, Japan), `address_language` is used to make it explicit (for example, "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). In this way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a `region_code` with all remaining information placed in the `address_lines`. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a `region_code` and `address_lines` and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).
         */
        addressLines?: string[] | null;
        /**
         * Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. For Spain, this is the province and not the autonomous community (for example, "Barcelona" and not "Catalonia"). Many countries don't use an administrative area in postal addresses. For example, in Switzerland, this should be left unpopulated.
         */
        administrativeArea?: string | null;
        /**
         * Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".
         */
        languageCode?: string | null;
        /**
         * Optional. Generally refers to the city or town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave `locality` empty and use `address_lines`.
         */
        locality?: string | null;
        /**
         * Optional. The name of the organization at the address.
         */
        organization?: string | null;
        /**
         * Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (for example, state or zip code validation in the United States).
         */
        postalCode?: string | null;
        /**
         * Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.
         */
        recipients?: string[] | null;
        /**
         * Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See https://cldr.unicode.org/ and https://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.
         */
        regionCode?: string | null;
        /**
         * The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.
         */
        revision?: number | null;
        /**
         * Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (for example, "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (Côte d'Ivoire).
         */
        sortingCode?: string | null;
        /**
         * Optional. Sublocality of the address. For example, this can be a neighborhood, borough, or district.
         */
        sublocality?: string | null;
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
    export class Resource$Accounts {
        context: APIRequestContext;
        channelPartnerLinks: Resource$Accounts$Channelpartnerlinks;
        customers: Resource$Accounts$Customers;
        offers: Resource$Accounts$Offers;
        reportJobs: Resource$Accounts$Reportjobs;
        reports: Resource$Accounts$Reports;
        skuGroups: Resource$Accounts$Skugroups;
        constructor(context: APIRequestContext);
        /**
         * Confirms the existence of Cloud Identity accounts based on the domain and if the Cloud Identity accounts are owned by the reseller. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * INVALID_VALUE: Invalid domain value in the request. Return value: A list of CloudIdentityCustomerAccount resources for the domain (may be empty) Note: in the v1alpha1 version of the API, a NOT_FOUND error returns if no CloudIdentityCustomerAccount resources match the domain.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkCloudIdentityAccountsExist(params: Params$Resource$Accounts$Checkcloudidentityaccountsexist, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkCloudIdentityAccountsExist(params?: Params$Resource$Accounts$Checkcloudidentityaccountsexist, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse>>;
        checkCloudIdentityAccountsExist(params: Params$Resource$Accounts$Checkcloudidentityaccountsexist, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkCloudIdentityAccountsExist(params: Params$Resource$Accounts$Checkcloudidentityaccountsexist, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse>): void;
        checkCloudIdentityAccountsExist(params: Params$Resource$Accounts$Checkcloudidentityaccountsexist, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse>): void;
        checkCloudIdentityAccountsExist(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistResponse>): void;
        /**
         * Lists service accounts with subscriber privileges on the Pub/Sub topic created for this Channel Services account or integrator. Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The topic resource doesn't exist. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: A list of service email addresses.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listSubscribers(params: Params$Resource$Accounts$Listsubscribers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listSubscribers(params?: Params$Resource$Accounts$Listsubscribers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListSubscribersResponse>>;
        listSubscribers(params: Params$Resource$Accounts$Listsubscribers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listSubscribers(params: Params$Resource$Accounts$Listsubscribers, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        listSubscribers(params: Params$Resource$Accounts$Listsubscribers, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        listSubscribers(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        /**
         * List TransferableOffers of a customer based on Cloud Identity ID or Customer Name in the request. Use this method when a reseller gets the entitlement information of an unowned customer. The reseller should provide the customer's Cloud Identity ID or Customer Name. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller and has no auth token. * The customer provided incorrect reseller information when generating auth token. * The reseller account making the request is different from the reseller account in the query. * The reseller is not authorized to transact on this Product. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: List of TransferableOffer for the given customer and SKU.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listTransferableOffers(params: Params$Resource$Accounts$Listtransferableoffers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listTransferableOffers(params?: Params$Resource$Accounts$Listtransferableoffers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListTransferableOffersResponse>>;
        listTransferableOffers(params: Params$Resource$Accounts$Listtransferableoffers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listTransferableOffers(params: Params$Resource$Accounts$Listtransferableoffers, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableOffersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableOffersResponse>): void;
        listTransferableOffers(params: Params$Resource$Accounts$Listtransferableoffers, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableOffersResponse>): void;
        listTransferableOffers(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableOffersResponse>): void;
        /**
         * List TransferableSkus of a customer based on the Cloud Identity ID or Customer Name in the request. Use this method to list the entitlements information of an unowned customer. You should provide the customer's Cloud Identity ID or Customer Name. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller and has no auth token. * The supplied auth token is invalid. * The reseller account making the request is different from the reseller account in the query. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: A list of the customer's TransferableSku.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listTransferableSkus(params: Params$Resource$Accounts$Listtransferableskus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listTransferableSkus(params?: Params$Resource$Accounts$Listtransferableskus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListTransferableSkusResponse>>;
        listTransferableSkus(params: Params$Resource$Accounts$Listtransferableskus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listTransferableSkus(params: Params$Resource$Accounts$Listtransferableskus, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableSkusResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableSkusResponse>): void;
        listTransferableSkus(params: Params$Resource$Accounts$Listtransferableskus, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableSkusResponse>): void;
        listTransferableSkus(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListTransferableSkusResponse>): void;
        /**
         * Registers a service account with subscriber privileges on the Pub/Sub topic for this Channel Services account or integrator. After you create a subscriber, you get the events through SubscriberEvent Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The topic name with the registered service email address.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        register(params: Params$Resource$Accounts$Register, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        register(params?: Params$Resource$Accounts$Register, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>>;
        register(params: Params$Resource$Accounts$Register, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        register(params: Params$Resource$Accounts$Register, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        register(params: Params$Resource$Accounts$Register, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        register(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        /**
         * Unregisters a service account with subscriber privileges on the Pub/Sub topic created for this Channel Services account or integrator. If there are no service accounts left with subscriber privileges, this deletes the topic. You can call ListSubscribers to check for these accounts. Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The topic resource doesn't exist. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The topic name that unregistered the service email address. Returns a success response if the service email address wasn't registered with the topic.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unregister(params: Params$Resource$Accounts$Unregister, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unregister(params?: Params$Resource$Accounts$Unregister, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>>;
        unregister(params: Params$Resource$Accounts$Unregister, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unregister(params: Params$Resource$Accounts$Unregister, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
        unregister(params: Params$Resource$Accounts$Unregister, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
        unregister(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
    }
    export interface Params$Resource$Accounts$Checkcloudidentityaccountsexist extends StandardParameters {
        /**
         * Required. The reseller account's resource name. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1CheckCloudIdentityAccountsExistRequest;
    }
    export interface Params$Resource$Accounts$Listsubscribers extends StandardParameters {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string;
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string;
        /**
         * Optional. The maximum number of service accounts to return. The service may return fewer than this value. If unspecified, returns at most 100 service accounts. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListSubscribers` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSubscribers` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Listtransferableoffers extends StandardParameters {
        /**
         * Required. The resource name of the reseller's account.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ListTransferableOffersRequest;
    }
    export interface Params$Resource$Accounts$Listtransferableskus extends StandardParameters {
        /**
         * Required. The reseller account's resource name. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ListTransferableSkusRequest;
    }
    export interface Params$Resource$Accounts$Register extends StandardParameters {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1RegisterSubscriberRequest;
    }
    export interface Params$Resource$Accounts$Unregister extends StandardParameters {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1UnregisterSubscriberRequest;
    }
    export class Resource$Accounts$Channelpartnerlinks {
        context: APIRequestContext;
        channelPartnerRepricingConfigs: Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs;
        customers: Resource$Accounts$Channelpartnerlinks$Customers;
        constructor(context: APIRequestContext);
        /**
         * Initiates a channel partner link between a distributor and a reseller, or between resellers in an n-tier reseller channel. Invited partners need to follow the invite_link_uri provided in the response to accept. After accepting the invitation, a link is set up between the two parties. You must be a distributor to call this method. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * ALREADY_EXISTS: The ChannelPartnerLink sent in the request already exists. * NOT_FOUND: No Cloud Identity customer exists for provided domain. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The new ChannelPartnerLink resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Channelpartnerlinks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerLink>>;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Create, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        /**
         * Returns the requested ChannelPartnerLink resource. You must be a distributor to call this method. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: ChannelPartnerLink resource not found because of an invalid channel partner link name. Return value: The ChannelPartnerLink resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Channelpartnerlinks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerLink>>;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        /**
         * List ChannelPartnerLinks belonging to a distributor. You must be a distributor to call this method. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: The list of the distributor account's ChannelPartnerLink resources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Channelpartnerlinks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Channelpartnerlinks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse>>;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerLinksResponse>): void;
        /**
         * Updates a channel partner link. Distributors call this method to change a link's status. For example, to suspend a partner link. You must be a distributor to call this method. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: * Required request parameters are missing or invalid. * Link state cannot change from invited to active or suspended. * Cannot send reseller_cloud_identity_id, invite_url, or name in update mask. * NOT_FOUND: ChannelPartnerLink resource not found. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The updated ChannelPartnerLink resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Channelpartnerlinks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerLink>>;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Patch, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerLink>): void;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Create extends StandardParameters {
        /**
         * Required. Create a channel partner link for the provided reseller account's resource name. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChannelPartnerLink;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Get extends StandardParameters {
        /**
         * Required. The resource name of the channel partner link to retrieve. Name uses the format: accounts/{account_id\}/channelPartnerLinks/{id\} where {id\} is the Cloud Identity ID of the partner.
         */
        name?: string;
        /**
         * Optional. The level of granularity the ChannelPartnerLink will display.
         */
        view?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$List extends StandardParameters {
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, server will pick a default size (25). The maximum value is 200; the server will coerce values above 200.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page. Obtained using ListChannelPartnerLinksResponse.next_page_token of the previous CloudChannelService.ListChannelPartnerLinks call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the reseller account for listing channel partner links. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Optional. The level of granularity the ChannelPartnerLink will display.
         */
        view?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Patch extends StandardParameters {
        /**
         * Required. The resource name of the channel partner link to cancel. Name uses the format: accounts/{account_id\}/channelPartnerLinks/{id\} where {id\} is the Cloud Identity ID of the partner.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1UpdateChannelPartnerLinkRequest;
    }
    export class Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a ChannelPartnerRepricingConfig. Call this method to set modifications for a specific ChannelPartner's bill. You can only create configs if the RepricingConfig.effective_invoice_month is a future month. If needed, you can create a config for the current month, with some restrictions. When creating a config for a future month, make sure there are no existing configs for that RepricingConfig.effective_invoice_month. The following restrictions are for creating configs in the current month. * This functionality is reserved for recovering from an erroneous config, and should not be used for regular business cases. * The new config will not modify exports used with other configs. Changes to the config may be immediate, but may take up to 24 hours. * There is a limit of ten configs for any ChannelPartner or RepricingConfig.EntitlementGranularity.entitlement, for any RepricingConfig.effective_invoice_month. * The contained ChannelPartnerRepricingConfig.repricing_config value must be different from the value used in the current config for a ChannelPartner. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * INVALID_ARGUMENT: Missing or invalid required parameters in the request. Also displays if the updated config is for the current month or past months. * NOT_FOUND: The ChannelPartnerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the updated ChannelPartnerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>>;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        /**
         * Deletes the given ChannelPartnerRepricingConfig permanently. You can only delete configs if their RepricingConfig.effective_invoice_month is set to a date after the current month. Possible error codes: * PERMISSION_DENIED: The account making the request does not own this customer. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * FAILED_PRECONDITION: The ChannelPartnerRepricingConfig is active or in the past. * NOT_FOUND: No ChannelPartnerRepricingConfig found for the name in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about how a Distributor modifies their bill before sending it to a ChannelPartner. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * NOT_FOUND: The ChannelPartnerRepricingConfig was not found. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the ChannelPartnerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>>;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        /**
         * Lists information about how a Reseller modifies their bill before sending it to a ChannelPartner. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * NOT_FOUND: The ChannelPartnerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the ChannelPartnerRepricingConfig resources. The data for each resource is displayed in the ascending order of: * Channel Partner ID * RepricingConfig.effective_invoice_month * ChannelPartnerRepricingConfig.update_time If unsuccessful, returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse>>;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListChannelPartnerRepricingConfigsResponse>): void;
        /**
         * Updates a ChannelPartnerRepricingConfig. Call this method to set modifications for a specific ChannelPartner's bill. This method overwrites the existing CustomerRepricingConfig. You can only update configs if the RepricingConfig.effective_invoice_month is a future month. To make changes to configs for the current month, use CreateChannelPartnerRepricingConfig, taking note of its restrictions. You cannot update the RepricingConfig.effective_invoice_month. When updating a config in the future: * This config must already exist. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * INVALID_ARGUMENT: Missing or invalid required parameters in the request. Also displays if the updated config is for the current month or past months. * NOT_FOUND: The ChannelPartnerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the updated ChannelPartnerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>>;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig>): void;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Create extends StandardParameters {
        /**
         * Required. The resource name of the ChannelPartner that will receive the repricing config. Parent uses the format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the channel partner repricing config rule to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Get extends StandardParameters {
        /**
         * Required. The resource name of the ChannelPartnerRepricingConfig Format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}/channelPartnerRepricingConfigs/{id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$List extends StandardParameters {
        /**
         * Optional. A filter for [CloudChannelService.ListChannelPartnerRepricingConfigs] results (channel_partner_link only). You can use this filter when you support a BatchGet-like query. To use the filter, you must set `parent=accounts/{account_id\}/channelPartnerLinks/-`. Example: `channel_partner_link = accounts/account_id/channelPartnerLinks/c1` OR `channel_partner_link = accounts/account_id/channelPartnerLinks/c2`.
         */
        filter?: string;
        /**
         * Optional. The maximum number of repricing configs to return. The service may return fewer than this value. If unspecified, returns a maximum of 50 rules. The maximum value is 100; values above 100 will be coerced to 100.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results beyond the first page. Obtained through ListChannelPartnerRepricingConfigsResponse.next_page_token of the previous CloudChannelService.ListChannelPartnerRepricingConfigs call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the account's ChannelPartnerLink. Parent uses the format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}. Supports accounts/{account_id\}/channelPartnerLinks/- to retrieve configs for all channel partners.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Channelpartnerrepricingconfigs$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the ChannelPartnerRepricingConfig. Format: accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}/channelPartnerRepricingConfigs/{id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChannelPartnerRepricingConfig;
    }
    export class Resource$Accounts$Channelpartnerlinks$Customers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Customer resource under the reseller or distributor account. Possible error codes: * PERMISSION_DENIED: * The reseller account making the request is different from the reseller account in the API request. * You are not authorized to create a customer. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: * Required request parameters are missing or invalid. * Domain field value doesn't match the primary email domain. Return value: The newly created Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        create(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Create, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * Deletes the given Customer permanently. Possible error codes: * PERMISSION_DENIED: The account making the request does not own this customer. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * FAILED_PRECONDITION: The customer has existing entitlements. * NOT_FOUND: No Customer resource found for the name in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Returns the requested Customer resource. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer resource doesn't exist. Usually the result of an invalid name parameter. Return value: The Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        get(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * Imports a Customer from the Cloud Identity associated with the provided Cloud Identity ID or domain before a TransferEntitlements call. If a linked Customer already exists and overwrite_if_exists is true, it will update that Customer's data. Possible error codes: * PERMISSION_DENIED: * The reseller account making the request is different from the reseller account in the API request. * You are not authorized to import the customer. See https://support.google.com/channelservices/answer/9759265 * NOT_FOUND: Cloud Identity doesn't exist or was deleted. * INVALID_ARGUMENT: Required parameters are missing, or the auth_token is expired or invalid. * ALREADY_EXISTS: A customer already exists and has conflicting critical fields. Requires an overwrite. Return value: The Customer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        import(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        import(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Import, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        import(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * List Customers. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: List of Customers, or an empty list if there are no customers.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListCustomersResponse>>;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        list(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        /**
         * Updates an existing Customer resource for the reseller or distributor. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: No Customer resource found for the name in the request. Return value: The updated Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        patch(params: Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$Create extends StandardParameters {
        /**
         * Required. The resource name of reseller account in which to create the customer. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1Customer;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$Delete extends StandardParameters {
        /**
         * Required. The resource name of the customer to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$Get extends StandardParameters {
        /**
         * Required. The resource name of the customer to retrieve. Name uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$Import extends StandardParameters {
        /**
         * Required. The resource name of the reseller's account. Parent takes the format: accounts/{account_id\} or accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ImportCustomerRequest;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$List extends StandardParameters {
        /**
         * Optional. Filters applied to the [CloudChannelService.ListCustomers] results. See https://cloud.google.com/channel/docs/concepts/google-cloud/filter-customers for more information.
         */
        filter?: string;
        /**
         * Optional. The maximum number of customers to return. The service may return fewer than this value. If unspecified, returns at most 10 customers. The maximum value is 50.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results other than the first page. Obtained through ListCustomersResponse.next_page_token of the previous CloudChannelService.ListCustomers call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the reseller account to list customers from. Parent uses the format: accounts/{account_id\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Channelpartnerlinks$Customers$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        name?: string;
        /**
         * The update mask that applies to the resource. Optional.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1Customer;
    }
    export class Resource$Accounts$Customers {
        context: APIRequestContext;
        customerRepricingConfigs: Resource$Accounts$Customers$Customerrepricingconfigs;
        entitlements: Resource$Accounts$Customers$Entitlements;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Customer resource under the reseller or distributor account. Possible error codes: * PERMISSION_DENIED: * The reseller account making the request is different from the reseller account in the API request. * You are not authorized to create a customer. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: * Required request parameters are missing or invalid. * Domain field value doesn't match the primary email domain. Return value: The newly created Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Customers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Customers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        create(params: Params$Resource$Accounts$Customers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Customers$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        create(params: Params$Resource$Accounts$Customers$Create, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * Deletes the given Customer permanently. Possible error codes: * PERMISSION_DENIED: The account making the request does not own this customer. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * FAILED_PRECONDITION: The customer has existing entitlements. * NOT_FOUND: No Customer resource found for the name in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Customers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Customers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Customers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Customers$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Customers$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Returns the requested Customer resource. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer resource doesn't exist. Usually the result of an invalid name parameter. Return value: The Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Customers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Customers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        get(params: Params$Resource$Accounts$Customers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Customers$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        get(params: Params$Resource$Accounts$Customers$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * Imports a Customer from the Cloud Identity associated with the provided Cloud Identity ID or domain before a TransferEntitlements call. If a linked Customer already exists and overwrite_if_exists is true, it will update that Customer's data. Possible error codes: * PERMISSION_DENIED: * The reseller account making the request is different from the reseller account in the API request. * You are not authorized to import the customer. See https://support.google.com/channelservices/answer/9759265 * NOT_FOUND: Cloud Identity doesn't exist or was deleted. * INVALID_ARGUMENT: Required parameters are missing, or the auth_token is expired or invalid. * ALREADY_EXISTS: A customer already exists and has conflicting critical fields. Requires an overwrite. Return value: The Customer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Accounts$Customers$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Accounts$Customers$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        import(params: Params$Resource$Accounts$Customers$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Accounts$Customers$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        import(params: Params$Resource$Accounts$Customers$Import, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        import(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * List Customers. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: List of Customers, or an empty list if there are no customers.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Customers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Customers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListCustomersResponse>>;
        list(params: Params$Resource$Accounts$Customers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Customers$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        list(params: Params$Resource$Accounts$Customers$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomersResponse>): void;
        /**
         * Lists the following: * Offers that you can purchase for a customer. * Offers that you can change for an entitlement. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller * The reseller is not authorized to transact on this Product. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: Required request parameters are missing or invalid.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listPurchasableOffers(params: Params$Resource$Accounts$Customers$Listpurchasableoffers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listPurchasableOffers(params?: Params$Resource$Accounts$Customers$Listpurchasableoffers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListPurchasableOffersResponse>>;
        listPurchasableOffers(params: Params$Resource$Accounts$Customers$Listpurchasableoffers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listPurchasableOffers(params: Params$Resource$Accounts$Customers$Listpurchasableoffers, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableOffersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableOffersResponse>): void;
        listPurchasableOffers(params: Params$Resource$Accounts$Customers$Listpurchasableoffers, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableOffersResponse>): void;
        listPurchasableOffers(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableOffersResponse>): void;
        /**
         * Lists the following: * SKUs that you can purchase for a customer * SKUs that you can upgrade or downgrade for an entitlement. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listPurchasableSkus(params: Params$Resource$Accounts$Customers$Listpurchasableskus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listPurchasableSkus(params?: Params$Resource$Accounts$Customers$Listpurchasableskus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListPurchasableSkusResponse>>;
        listPurchasableSkus(params: Params$Resource$Accounts$Customers$Listpurchasableskus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listPurchasableSkus(params: Params$Resource$Accounts$Customers$Listpurchasableskus, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableSkusResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableSkusResponse>): void;
        listPurchasableSkus(params: Params$Resource$Accounts$Customers$Listpurchasableskus, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableSkusResponse>): void;
        listPurchasableSkus(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListPurchasableSkusResponse>): void;
        /**
         * Updates an existing Customer resource for the reseller or distributor. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: No Customer resource found for the name in the request. Return value: The updated Customer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Customers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Customers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Customer>>;
        patch(params: Params$Resource$Accounts$Customers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Customers$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        patch(params: Params$Resource$Accounts$Customers$Patch, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Customer>): void;
        /**
         * Creates a Cloud Identity for the given customer using the customer's information, or the information provided here. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller. * You are not authorized to provision cloud identity id. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer was not found. * ALREADY_EXISTS: The customer's primary email already exists. Retry after changing the customer's primary contact email. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata contains an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        provisionCloudIdentity(params: Params$Resource$Accounts$Customers$Provisioncloudidentity, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        provisionCloudIdentity(params?: Params$Resource$Accounts$Customers$Provisioncloudidentity, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        provisionCloudIdentity(params: Params$Resource$Accounts$Customers$Provisioncloudidentity, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        provisionCloudIdentity(params: Params$Resource$Accounts$Customers$Provisioncloudidentity, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        provisionCloudIdentity(params: Params$Resource$Accounts$Customers$Provisioncloudidentity, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        provisionCloudIdentity(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists the billing accounts that are eligible to purchase particular SKUs for a given customer. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: Based on the provided list of SKUs, returns a list of SKU groups that must be purchased using the same billing account and the billing accounts eligible to purchase each SKU group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        queryEligibleBillingAccounts(params: Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        queryEligibleBillingAccounts(params?: Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse>>;
        queryEligibleBillingAccounts(params: Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        queryEligibleBillingAccounts(params: Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse>): void;
        queryEligibleBillingAccounts(params: Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse>): void;
        queryEligibleBillingAccounts(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1QueryEligibleBillingAccountsResponse>): void;
        /**
         * Transfers customer entitlements to new reseller. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller. * The reseller is not authorized to transact on this Product. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer or offer resource was not found. * ALREADY_EXISTS: The SKU was already transferred for the customer. * CONDITION_NOT_MET or FAILED_PRECONDITION: * The SKU requires domain verification to transfer, but the domain is not verified. * An Add-On SKU (example, Vault or Drive) is missing the pre-requisite SKU (example, G Suite Basic). * (Developer accounts only) Reseller and resold domain must meet the following naming requirements: * Domain names must start with goog-test. * Domain names must include the reseller domain. * Specify all transferring entitlements. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        transferEntitlements(params: Params$Resource$Accounts$Customers$Transferentitlements, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        transferEntitlements(params?: Params$Resource$Accounts$Customers$Transferentitlements, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        transferEntitlements(params: Params$Resource$Accounts$Customers$Transferentitlements, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        transferEntitlements(params: Params$Resource$Accounts$Customers$Transferentitlements, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        transferEntitlements(params: Params$Resource$Accounts$Customers$Transferentitlements, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        transferEntitlements(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Transfers customer entitlements from their current reseller to Google. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer or offer resource was not found. * ALREADY_EXISTS: The SKU was already transferred for the customer. * CONDITION_NOT_MET or FAILED_PRECONDITION: * The SKU requires domain verification to transfer, but the domain is not verified. * An Add-On SKU (example, Vault or Drive) is missing the pre-requisite SKU (example, G Suite Basic). * (Developer accounts only) Reseller and resold domain must meet the following naming requirements: * Domain names must start with goog-test. * Domain names must include the reseller domain. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The response will contain google.protobuf.Empty on success. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        transferEntitlementsToGoogle(params: Params$Resource$Accounts$Customers$Transferentitlementstogoogle, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        transferEntitlementsToGoogle(params?: Params$Resource$Accounts$Customers$Transferentitlementstogoogle, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        transferEntitlementsToGoogle(params: Params$Resource$Accounts$Customers$Transferentitlementstogoogle, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        transferEntitlementsToGoogle(params: Params$Resource$Accounts$Customers$Transferentitlementstogoogle, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        transferEntitlementsToGoogle(params: Params$Resource$Accounts$Customers$Transferentitlementstogoogle, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        transferEntitlementsToGoogle(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Accounts$Customers$Create extends StandardParameters {
        /**
         * Required. The resource name of reseller account in which to create the customer. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1Customer;
    }
    export interface Params$Resource$Accounts$Customers$Delete extends StandardParameters {
        /**
         * Required. The resource name of the customer to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Customers$Get extends StandardParameters {
        /**
         * Required. The resource name of the customer to retrieve. Name uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Customers$Import extends StandardParameters {
        /**
         * Required. The resource name of the reseller's account. Parent takes the format: accounts/{account_id\} or accounts/{account_id\}/channelPartnerLinks/{channel_partner_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ImportCustomerRequest;
    }
    export interface Params$Resource$Accounts$Customers$List extends StandardParameters {
        /**
         * Optional. Filters applied to the [CloudChannelService.ListCustomers] results. See https://cloud.google.com/channel/docs/concepts/google-cloud/filter-customers for more information.
         */
        filter?: string;
        /**
         * Optional. The maximum number of customers to return. The service may return fewer than this value. If unspecified, returns at most 10 customers. The maximum value is 50.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results other than the first page. Obtained through ListCustomersResponse.next_page_token of the previous CloudChannelService.ListCustomers call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the reseller account to list customers from. Parent uses the format: accounts/{account_id\}.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Customers$Listpurchasableoffers extends StandardParameters {
        /**
         * Optional. Resource name of the new target Billing Account. Provide this Billing Account when setting up billing for a trial subscription. Format: accounts/{account_id\}/billingAccounts/{billing_account_id\}. This field is only relevant for multi-currency accounts. It should be left empty for single currency accounts.
         */
        'changeOfferPurchase.billingAccount'?: string;
        /**
         * Required. Resource name of the entitlement. Format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        'changeOfferPurchase.entitlement'?: string;
        /**
         * Optional. Resource name of the new target SKU. Provide this SKU when upgrading or downgrading an entitlement. Format: products/{product_id\}/skus/{sku_id\}
         */
        'changeOfferPurchase.newSku'?: string;
        /**
         * Optional. Billing account that the result should be restricted to. Format: accounts/{account_id\}/billingAccounts/{billing_account_id\}.
         */
        'createEntitlementPurchase.billingAccount'?: string;
        /**
         * Required. SKU that the result should be restricted to. Format: products/{product_id\}/skus/{sku_id\}.
         */
        'createEntitlementPurchase.sku'?: string;
        /**
         * Required. The resource name of the customer to list Offers for. Format: accounts/{account_id\}/customers/{customer_id\}.
         */
        customer?: string;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 Offers. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Customers$Listpurchasableskus extends StandardParameters {
        /**
         * Required. Change Type for the entitlement.
         */
        'changeOfferPurchase.changeType'?: string;
        /**
         * Required. Resource name of the entitlement. Format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        'changeOfferPurchase.entitlement'?: string;
        /**
         * Required. List SKUs belonging to this Product. Format: products/{product_id\}. Supports products/- to retrieve SKUs for all products.
         */
        'createEntitlementPurchase.product'?: string;
        /**
         * Required. The resource name of the customer to list SKUs for. Format: accounts/{account_id\}/customers/{customer_id\}.
         */
        customer?: string;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 SKUs. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Customers$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        name?: string;
        /**
         * The update mask that applies to the resource. Optional.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1Customer;
    }
    export interface Params$Resource$Accounts$Customers$Provisioncloudidentity extends StandardParameters {
        /**
         * Required. Resource name of the customer. Format: accounts/{account_id\}/customers/{customer_id\}
         */
        customer?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ProvisionCloudIdentityRequest;
    }
    export interface Params$Resource$Accounts$Customers$Queryeligiblebillingaccounts extends StandardParameters {
        /**
         * Required. The resource name of the customer to list eligible billing accounts for. Format: accounts/{account_id\}/customers/{customer_id\}.
         */
        customer?: string;
        /**
         * Required. List of SKUs to list eligible billing accounts for. At least one SKU is required. Format: products/{product_id\}/skus/{sku_id\}.
         */
        skus?: string[];
    }
    export interface Params$Resource$Accounts$Customers$Transferentitlements extends StandardParameters {
        /**
         * Required. The resource name of the reseller's customer account that will receive transferred entitlements. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1TransferEntitlementsRequest;
    }
    export interface Params$Resource$Accounts$Customers$Transferentitlementstogoogle extends StandardParameters {
        /**
         * Required. The resource name of the reseller's customer account where the entitlements transfer from. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1TransferEntitlementsToGoogleRequest;
    }
    export class Resource$Accounts$Customers$Customerrepricingconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a CustomerRepricingConfig. Call this method to set modifications for a specific customer's bill. You can only create configs if the RepricingConfig.effective_invoice_month is a future month. If needed, you can create a config for the current month, with some restrictions. When creating a config for a future month, make sure there are no existing configs for that RepricingConfig.effective_invoice_month. The following restrictions are for creating configs in the current month. * This functionality is reserved for recovering from an erroneous config, and should not be used for regular business cases. * The new config will not modify exports used with other configs. Changes to the config may be immediate, but may take up to 24 hours. * There is a limit of ten configs for any RepricingConfig.EntitlementGranularity.entitlement, for any RepricingConfig.effective_invoice_month. * The contained CustomerRepricingConfig.repricing_config value must be different from the value used in the current config for a RepricingConfig.EntitlementGranularity.entitlement. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * INVALID_ARGUMENT: Missing or invalid required parameters in the request. Also displays if the updated config is for the current month or past months. * NOT_FOUND: The CustomerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the updated CustomerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1CustomerRepricingConfig>>;
        create(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        create(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        /**
         * Deletes the given CustomerRepricingConfig permanently. You can only delete configs if their RepricingConfig.effective_invoice_month is set to a date after the current month. Possible error codes: * PERMISSION_DENIED: The account making the request does not own this customer. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * FAILED_PRECONDITION: The CustomerRepricingConfig is active or in the past. * NOT_FOUND: No CustomerRepricingConfig found for the name in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets information about how a Reseller modifies their bill before sending it to a Customer. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * NOT_FOUND: The CustomerRepricingConfig was not found. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the CustomerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1CustomerRepricingConfig>>;
        get(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        get(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        /**
         * Lists information about how a Reseller modifies their bill before sending it to a Customer. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * NOT_FOUND: The CustomerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the CustomerRepricingConfig resources. The data for each resource is displayed in the ascending order of: * Customer ID * RepricingConfig.EntitlementGranularity.entitlement * RepricingConfig.effective_invoice_month * CustomerRepricingConfig.update_time If unsuccessful, returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Customers$Customerrepricingconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse>>;
        list(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse>): void;
        list(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListCustomerRepricingConfigsResponse>): void;
        /**
         * Updates a CustomerRepricingConfig. Call this method to set modifications for a specific customer's bill. This method overwrites the existing CustomerRepricingConfig. You can only update configs if the RepricingConfig.effective_invoice_month is a future month. To make changes to configs for the current month, use CreateCustomerRepricingConfig, taking note of its restrictions. You cannot update the RepricingConfig.effective_invoice_month. When updating a config in the future: * This config must already exist. Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different. * INVALID_ARGUMENT: Missing or invalid required parameters in the request. Also displays if the updated config is for the current month or past months. * NOT_FOUND: The CustomerRepricingConfig specified does not exist or is not associated with the given account. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the updated CustomerRepricingConfig resource, otherwise returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1CustomerRepricingConfig>>;
        patch(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        patch(params: Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1CustomerRepricingConfig>): void;
    }
    export interface Params$Resource$Accounts$Customers$Customerrepricingconfigs$Create extends StandardParameters {
        /**
         * Required. The resource name of the customer that will receive this repricing config. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1CustomerRepricingConfig;
    }
    export interface Params$Resource$Accounts$Customers$Customerrepricingconfigs$Delete extends StandardParameters {
        /**
         * Required. The resource name of the customer repricing config rule to delete. Format: accounts/{account_id\}/customers/{customer_id\}/customerRepricingConfigs/{id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Customers$Customerrepricingconfigs$Get extends StandardParameters {
        /**
         * Required. The resource name of the CustomerRepricingConfig. Format: accounts/{account_id\}/customers/{customer_id\}/customerRepricingConfigs/{id\}.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Customers$Customerrepricingconfigs$List extends StandardParameters {
        /**
         * Optional. A filter for [CloudChannelService.ListCustomerRepricingConfigs] results (customer only). You can use this filter when you support a BatchGet-like query. To use the filter, you must set `parent=accounts/{account_id\}/customers/-`. Example: customer = accounts/account_id/customers/c1 OR customer = accounts/account_id/customers/c2.
         */
        filter?: string;
        /**
         * Optional. The maximum number of repricing configs to return. The service may return fewer than this value. If unspecified, returns a maximum of 50 rules. The maximum value is 100; values above 100 will be coerced to 100.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results beyond the first page. Obtained through ListCustomerRepricingConfigsResponse.next_page_token of the previous CloudChannelService.ListCustomerRepricingConfigs call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the customer. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}. Supports accounts/{account_id\}/customers/- to retrieve configs for all customers.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Customers$Customerrepricingconfigs$Patch extends StandardParameters {
        /**
         * Output only. Resource name of the CustomerRepricingConfig. Format: accounts/{account_id\}/customers/{customer_id\}/customerRepricingConfigs/{id\}.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1CustomerRepricingConfig;
    }
    export class Resource$Accounts$Customers$Entitlements {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Activates a previously suspended entitlement. Entitlements suspended for pending ToS acceptance can't be activated using this method. An entitlement activation is a long-running operation and it updates the state of the customer entitlement. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement resource not found. * SUSPENSION_NOT_RESELLER_INITIATED: Can only activate reseller-initiated suspensions and entitlements that have accepted the TOS. * NOT_SUSPENDED: Can only activate suspended entitlements not in an ACTIVE state. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        activate(params: Params$Resource$Accounts$Customers$Entitlements$Activate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        activate(params?: Params$Resource$Accounts$Customers$Entitlements$Activate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        activate(params: Params$Resource$Accounts$Customers$Entitlements$Activate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        activate(params: Params$Resource$Accounts$Customers$Entitlements$Activate, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        activate(params: Params$Resource$Accounts$Customers$Entitlements$Activate, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        activate(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Cancels a previously fulfilled entitlement. An entitlement cancellation is a long-running operation. Possible error codes: * PERMISSION_DENIED: The reseller account making the request is different from the reseller account in the API request. * FAILED_PRECONDITION: There are Google Cloud projects linked to the Google Cloud entitlement's Cloud Billing subaccount. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement resource not found. * DELETION_TYPE_NOT_ALLOWED: Cancel is only allowed for Google Workspace add-ons, or entitlements for Google Cloud's development platform. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The response will contain google.protobuf.Empty on success. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Accounts$Customers$Entitlements$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Accounts$Customers$Entitlements$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        cancel(params: Params$Resource$Accounts$Customers$Entitlements$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Accounts$Customers$Entitlements$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        cancel(params: Params$Resource$Accounts$Customers$Entitlements$Cancel, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Updates the Offer for an existing customer entitlement. An entitlement update is a long-running operation and it updates the entitlement as a result of fulfillment. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Offer or Entitlement resource not found. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changeOffer(params: Params$Resource$Accounts$Customers$Entitlements$Changeoffer, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changeOffer(params?: Params$Resource$Accounts$Customers$Entitlements$Changeoffer, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        changeOffer(params: Params$Resource$Accounts$Customers$Entitlements$Changeoffer, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changeOffer(params: Params$Resource$Accounts$Customers$Entitlements$Changeoffer, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeOffer(params: Params$Resource$Accounts$Customers$Entitlements$Changeoffer, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeOffer(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Change parameters of the entitlement. An entitlement update is a long-running operation and it updates the entitlement as a result of fulfillment. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. For example, the number of seats being changed is greater than the allowed number of max seats, or decreasing seats for a commitment based plan. * NOT_FOUND: Entitlement resource not found. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changeParameters(params: Params$Resource$Accounts$Customers$Entitlements$Changeparameters, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changeParameters(params?: Params$Resource$Accounts$Customers$Entitlements$Changeparameters, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        changeParameters(params: Params$Resource$Accounts$Customers$Entitlements$Changeparameters, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changeParameters(params: Params$Resource$Accounts$Customers$Entitlements$Changeparameters, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeParameters(params: Params$Resource$Accounts$Customers$Entitlements$Changeparameters, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeParameters(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Updates the renewal settings for an existing customer entitlement. An entitlement update is a long-running operation and it updates the entitlement as a result of fulfillment. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement resource not found. * NOT_COMMITMENT_PLAN: Renewal Settings are only applicable for a commitment plan. Can't enable or disable renewals for non-commitment plans. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changeRenewalSettings(params: Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changeRenewalSettings(params?: Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        changeRenewalSettings(params: Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changeRenewalSettings(params: Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeRenewalSettings(params: Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        changeRenewalSettings(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Creates an entitlement for a customer. Possible error codes: * PERMISSION_DENIED: * The customer doesn't belong to the reseller. * The reseller is not authorized to transact on this Product. See https://support.google.com/channelservices/answer/9759265 * INVALID_ARGUMENT: * Required request parameters are missing or invalid. * There is already a customer entitlement for a SKU from the same product family. * INVALID_VALUE: Make sure the OfferId is valid. If it is, contact Google Channel support for further troubleshooting. * NOT_FOUND: The customer or offer resource was not found. * ALREADY_EXISTS: * The SKU was already purchased for the customer. * The customer's primary email already exists. Retry after changing the customer's primary contact email. * CONDITION_NOT_MET or FAILED_PRECONDITION: * The domain required for purchasing a SKU has not been verified. * A pre-requisite SKU required to purchase an Add-On SKU is missing. For example, Google Workspace Business Starter is required to purchase Vault or Drive. * (Developer accounts only) Reseller and resold domain must meet the following naming requirements: * Domain names must start with goog-test. * Domain names must include the reseller domain. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Customers$Entitlements$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Customers$Entitlements$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Accounts$Customers$Entitlements$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Customers$Entitlements$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Accounts$Customers$Entitlements$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Returns the requested Entitlement resource. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The customer entitlement was not found. Return value: The requested Entitlement resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Customers$Entitlements$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Customers$Entitlements$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Entitlement>>;
        get(params: Params$Resource$Accounts$Customers$Entitlements$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Customers$Entitlements$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Entitlement>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Entitlement>): void;
        get(params: Params$Resource$Accounts$Customers$Entitlements$Get, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Entitlement>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Entitlement>): void;
        /**
         * Lists Entitlements belonging to a customer. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. Return value: A list of the customer's Entitlements.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Customers$Entitlements$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Customers$Entitlements$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListEntitlementsResponse>>;
        list(params: Params$Resource$Accounts$Customers$Entitlements$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Customers$Entitlements$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementsResponse>): void;
        list(params: Params$Resource$Accounts$Customers$Entitlements$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementsResponse>): void;
        /**
         * List entitlement history. Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different. * INVALID_ARGUMENT: Missing or invalid required fields in the request. * NOT_FOUND: The parent resource doesn't exist. Usually the result of an invalid name parameter. * INTERNAL: Any non-user error related to a technical issue in the backend. In this case, contact CloudChannel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. In this case, contact Cloud Channel support. Return value: List of EntitlementChanges.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listEntitlementChanges(params: Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listEntitlementChanges(params?: Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListEntitlementChangesResponse>>;
        listEntitlementChanges(params: Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listEntitlementChanges(params: Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementChangesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementChangesResponse>): void;
        listEntitlementChanges(params: Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementChangesResponse>): void;
        listEntitlementChanges(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListEntitlementChangesResponse>): void;
        /**
         * Returns the requested Offer resource. Possible error codes: * PERMISSION_DENIED: The entitlement doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement or offer was not found. Return value: The Offer resource.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookupOffer(params: Params$Resource$Accounts$Customers$Entitlements$Lookupoffer, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookupOffer(params?: Params$Resource$Accounts$Customers$Entitlements$Lookupoffer, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1Offer>>;
        lookupOffer(params: Params$Resource$Accounts$Customers$Entitlements$Lookupoffer, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookupOffer(params: Params$Resource$Accounts$Customers$Entitlements$Lookupoffer, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1Offer>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Offer>): void;
        lookupOffer(params: Params$Resource$Accounts$Customers$Entitlements$Lookupoffer, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Offer>): void;
        lookupOffer(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1Offer>): void;
        /**
         * Starts paid service for a trial entitlement. Starts paid service for a trial entitlement immediately. This method is only applicable if a plan is set up for a trial entitlement but has some trial days remaining. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement resource not found. * FAILED_PRECONDITION/NOT_IN_TRIAL: This method only works for entitlement on trial plans. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startPaidService(params: Params$Resource$Accounts$Customers$Entitlements$Startpaidservice, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startPaidService(params?: Params$Resource$Accounts$Customers$Entitlements$Startpaidservice, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        startPaidService(params: Params$Resource$Accounts$Customers$Entitlements$Startpaidservice, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startPaidService(params: Params$Resource$Accounts$Customers$Entitlements$Startpaidservice, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        startPaidService(params: Params$Resource$Accounts$Customers$Entitlements$Startpaidservice, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        startPaidService(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Suspends a previously fulfilled entitlement. An entitlement suspension is a long-running operation. Possible error codes: * PERMISSION_DENIED: The customer doesn't belong to the reseller. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: Entitlement resource not found. * NOT_ACTIVE: Entitlement is not active. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata will contain an instance of OperationMetadata.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        suspend(params: Params$Resource$Accounts$Customers$Entitlements$Suspend, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        suspend(params?: Params$Resource$Accounts$Customers$Entitlements$Suspend, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        suspend(params: Params$Resource$Accounts$Customers$Entitlements$Suspend, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        suspend(params: Params$Resource$Accounts$Customers$Entitlements$Suspend, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        suspend(params: Params$Resource$Accounts$Customers$Entitlements$Suspend, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        suspend(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Activate extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to activate. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ActivateEntitlementRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Cancel extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to cancel. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1CancelEntitlementRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Changeoffer extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to update. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChangeOfferRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Changeparameters extends StandardParameters {
        /**
         * Required. The name of the entitlement to update. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChangeParametersRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Changerenewalsettings extends StandardParameters {
        /**
         * Required. The name of the entitlement to update. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1ChangeRenewalSettingsRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Create extends StandardParameters {
        /**
         * Required. The resource name of the reseller's customer account in which to create the entitlement. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1CreateEntitlementRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Get extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to retrieve. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$List extends StandardParameters {
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, return at most 50 entitlements. The maximum value is 100; the server will coerce values above 100.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page. Obtained using ListEntitlementsResponse.next_page_token of the previous CloudChannelService.ListEntitlements call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the reseller's customer account to list entitlements for. Parent uses the format: accounts/{account_id\}/customers/{customer_id\}
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Listentitlementchanges extends StandardParameters {
        /**
         * Optional. Filters applied to the list results.
         */
        filter?: string;
        /**
         * Optional. The maximum number of entitlement changes to return. The service may return fewer than this value. If unspecified, returns at most 10 entitlement changes. The maximum value is 50; the server will coerce values above 50.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous CloudChannelService.ListEntitlementChanges call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to CloudChannelService.ListEntitlementChanges must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the entitlement for which to list entitlement changes. The `-` wildcard may be used to match entitlements across a customer. Formats: * accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\} * accounts/{account_id\}/customers/{customer_id\}/entitlements/-
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Lookupoffer extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to retrieve the Offer. Entitlement uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        entitlement?: string;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Startpaidservice extends StandardParameters {
        /**
         * Required. The name of the entitlement to start a paid service for. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1StartPaidServiceRequest;
    }
    export interface Params$Resource$Accounts$Customers$Entitlements$Suspend extends StandardParameters {
        /**
         * Required. The resource name of the entitlement to suspend. Name uses the format: accounts/{account_id\}/customers/{customer_id\}/entitlements/{entitlement_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1SuspendEntitlementRequest;
    }
    export class Resource$Accounts$Offers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the Offers the reseller can sell. Possible error codes: * INVALID_ARGUMENT: Required request parameters are missing or invalid.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Offers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Offers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListOffersResponse>>;
        list(params: Params$Resource$Accounts$Offers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Offers$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListOffersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListOffersResponse>): void;
        list(params: Params$Resource$Accounts$Offers$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListOffersResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListOffersResponse>): void;
    }
    export interface Params$Resource$Accounts$Offers$List extends StandardParameters {
        /**
         * Optional. The expression to filter results by name (name of the Offer), sku.name (name of the SKU), or sku.product.name (name of the Product). Example 1: sku.product.name=products/p1 AND sku.name!=products/p1/skus/s1 Example 2: name=accounts/a1/offers/o1
         */
        filter?: string;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, returns at most 500 Offers. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the reseller account from which to list Offers. Parent uses the format: accounts/{account_id\}.
         */
        parent?: string;
        /**
         * Optional. A boolean flag that determines if a response returns future offers 30 days from now. If the show_future_offers is true, the response will only contain offers that are scheduled to be available 30 days from now.
         */
        showFutureOffers?: boolean;
    }
    export class Resource$Accounts$Reportjobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves data generated by CloudChannelReportsService.RunReportJob. Deprecated: Please use [Export Channel Services data to BigQuery](https://cloud.google.com/channel/docs/rebilling/export-data-to-bigquery) instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fetchReportResults(params: Params$Resource$Accounts$Reportjobs$Fetchreportresults, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetchReportResults(params?: Params$Resource$Accounts$Reportjobs$Fetchreportresults, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1FetchReportResultsResponse>>;
        fetchReportResults(params: Params$Resource$Accounts$Reportjobs$Fetchreportresults, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetchReportResults(params: Params$Resource$Accounts$Reportjobs$Fetchreportresults, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1FetchReportResultsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1FetchReportResultsResponse>): void;
        fetchReportResults(params: Params$Resource$Accounts$Reportjobs$Fetchreportresults, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1FetchReportResultsResponse>): void;
        fetchReportResults(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1FetchReportResultsResponse>): void;
    }
    export interface Params$Resource$Accounts$Reportjobs$Fetchreportresults extends StandardParameters {
        /**
         * Required. The report job created by CloudChannelReportsService.RunReportJob. Report_job uses the format: accounts/{account_id\}/reportJobs/{report_job_id\}
         */
        reportJob?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1FetchReportResultsRequest;
    }
    export class Resource$Accounts$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the reports that RunReportJob can run. These reports include an ID, a description, and the list of columns that will be in the result. Deprecated: Please use [Export Channel Services data to BigQuery](https://cloud.google.com/channel/docs/rebilling/export-data-to-bigquery) instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Reports$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Reports$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListReportsResponse>>;
        list(params: Params$Resource$Accounts$Reports$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Reports$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListReportsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListReportsResponse>): void;
        list(params: Params$Resource$Accounts$Reports$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListReportsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListReportsResponse>): void;
        /**
         * Begins generation of data for a given report. The report identifier is a UID (for example, `613bf59q`). Possible error codes: * PERMISSION_DENIED: The user doesn't have access to this report. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The report identifier was not found. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The ID of a long-running operation. To get the results of the operation, call the GetOperation method of CloudChannelOperationsService. The Operation metadata contains an instance of OperationMetadata. To get the results of report generation, call CloudChannelReportsService.FetchReportResults with the RunReportJobResponse.report_job. Deprecated: Please use [Export Channel Services data to BigQuery](https://cloud.google.com/channel/docs/rebilling/export-data-to-bigquery) instead.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        run(params: Params$Resource$Accounts$Reports$Run, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        run(params?: Params$Resource$Accounts$Reports$Run, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        run(params: Params$Resource$Accounts$Reports$Run, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        run(params: Params$Resource$Accounts$Reports$Run, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        run(params: Params$Resource$Accounts$Reports$Run, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        run(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Accounts$Reports$List extends StandardParameters {
        /**
         * Optional. The BCP-47 language code, such as "en-US". If specified, the response is localized to the corresponding language code if the original data sources support it. Default is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size of the report. The server might return fewer results than requested. If unspecified, returns 20 reports. The maximum value is 100.
         */
        pageSize?: number;
        /**
         * Optional. A token that specifies a page of results beyond the first page. Obtained through ListReportsResponse.next_page_token of the previous CloudChannelReportsService.ListReports call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the partner account to list available reports for. Parent uses the format: accounts/{account_id\}
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Reports$Run extends StandardParameters {
        /**
         * Required. The report's resource name. Specifies the account and report used to generate report data. The report_id identifier is a UID (for example, `613bf59q`). Name uses the format: accounts/{account_id\}/reports/{report_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1RunReportJobRequest;
    }
    export class Resource$Accounts$Skugroups {
        context: APIRequestContext;
        billableSkus: Resource$Accounts$Skugroups$Billableskus;
        constructor(context: APIRequestContext);
        /**
         * Lists the Rebilling supported SKU groups the account is authorized to sell. Reference: https://cloud.google.com/skus/sku-groups Possible Error Codes: * PERMISSION_DENIED: If the account making the request and the account being queried are different, or the account doesn't exist. * INTERNAL: Any non-user error related to technical issues in the backend. In this case, contact Cloud Channel support. Return Value: If successful, the SkuGroup resources. The data for each resource is displayed in the alphabetical order of SKU group display name. The data for each resource is displayed in the ascending order of SkuGroup.display_name If unsuccessful, returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Skugroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Skugroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListSkuGroupsResponse>>;
        list(params: Params$Resource$Accounts$Skugroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Skugroups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupsResponse>): void;
        list(params: Params$Resource$Accounts$Skugroups$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupsResponse>): void;
    }
    export interface Params$Resource$Accounts$Skugroups$List extends StandardParameters {
        /**
         * Optional. The maximum number of SKU groups to return. The service may return fewer than this value. If unspecified, returns a maximum of 1000 SKU groups. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results beyond the first page. Obtained through ListSkuGroupsResponse.next_page_token of the previous CloudChannelService.ListSkuGroups call.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the account from which to list SKU groups. Parent uses the format: accounts/{account\}.
         */
        parent?: string;
    }
    export class Resource$Accounts$Skugroups$Billableskus {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the Billable SKUs in a given SKU group. Possible error codes: PERMISSION_DENIED: If the account making the request and the account being queried for are different, or the account doesn't exist. INVALID_ARGUMENT: Missing or invalid required parameters in the request. INTERNAL: Any non-user error related to technical issue in the backend. In this case, contact cloud channel support. Return Value: If successful, the BillableSku resources. The data for each resource is displayed in the ascending order of: * BillableSku.service_display_name * BillableSku.sku_display_name If unsuccessful, returns an error.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Skugroups$Billableskus$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Skugroups$Billableskus$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse>>;
        list(params: Params$Resource$Accounts$Skugroups$Billableskus$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Skugroups$Billableskus$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse>): void;
        list(params: Params$Resource$Accounts$Skugroups$Billableskus$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkuGroupBillableSkusResponse>): void;
    }
    export interface Params$Resource$Accounts$Skugroups$Billableskus$List extends StandardParameters {
        /**
         * Optional. The maximum number of SKUs to return. The service may return fewer than this value. If unspecified, returns a maximum of 100000 SKUs. The maximum value is 100000; values above 100000 will be coerced to 100000.
         */
        pageSize?: number;
        /**
         * Optional. A token identifying a page of results beyond the first page. Obtained through ListSkuGroupBillableSkusResponse.next_page_token of the previous CloudChannelService.ListSkuGroupBillableSkus call.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the SKU group. Format: accounts/{account\}/skuGroups/{sku_group\}.
         */
        parent?: string;
    }
    export class Resource$Integrators {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists service accounts with subscriber privileges on the Pub/Sub topic created for this Channel Services account or integrator. Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The topic resource doesn't exist. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: A list of service email addresses.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listSubscribers(params: Params$Resource$Integrators$Listsubscribers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listSubscribers(params?: Params$Resource$Integrators$Listsubscribers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListSubscribersResponse>>;
        listSubscribers(params: Params$Resource$Integrators$Listsubscribers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listSubscribers(params: Params$Resource$Integrators$Listsubscribers, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        listSubscribers(params: Params$Resource$Integrators$Listsubscribers, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        listSubscribers(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSubscribersResponse>): void;
        /**
         * Registers a service account with subscriber privileges on the Pub/Sub topic for this Channel Services account or integrator. After you create a subscriber, you get the events through SubscriberEvent Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The topic name with the registered service email address.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        registerSubscriber(params: Params$Resource$Integrators$Registersubscriber, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        registerSubscriber(params?: Params$Resource$Integrators$Registersubscriber, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>>;
        registerSubscriber(params: Params$Resource$Integrators$Registersubscriber, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        registerSubscriber(params: Params$Resource$Integrators$Registersubscriber, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        registerSubscriber(params: Params$Resource$Integrators$Registersubscriber, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        registerSubscriber(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1RegisterSubscriberResponse>): void;
        /**
         * Unregisters a service account with subscriber privileges on the Pub/Sub topic created for this Channel Services account or integrator. If there are no service accounts left with subscriber privileges, this deletes the topic. You can call ListSubscribers to check for these accounts. Possible error codes: * PERMISSION_DENIED: The reseller account making the request and the provided reseller account are different, or the impersonated user is not a super admin. * INVALID_ARGUMENT: Required request parameters are missing or invalid. * NOT_FOUND: The topic resource doesn't exist. * INTERNAL: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. * UNKNOWN: Any non-user error related to a technical issue in the backend. Contact Cloud Channel support. Return value: The topic name that unregistered the service email address. Returns a success response if the service email address wasn't registered with the topic.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unregisterSubscriber(params: Params$Resource$Integrators$Unregistersubscriber, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unregisterSubscriber(params?: Params$Resource$Integrators$Unregistersubscriber, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>>;
        unregisterSubscriber(params: Params$Resource$Integrators$Unregistersubscriber, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unregisterSubscriber(params: Params$Resource$Integrators$Unregistersubscriber, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
        unregisterSubscriber(params: Params$Resource$Integrators$Unregistersubscriber, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
        unregisterSubscriber(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1UnregisterSubscriberResponse>): void;
    }
    export interface Params$Resource$Integrators$Listsubscribers extends StandardParameters {
        /**
         * Optional. Resource name of the account. Required if integrator is not provided. Otherwise, leave this field empty/unset.
         */
        account?: string;
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string;
        /**
         * Optional. The maximum number of service accounts to return. The service may return fewer than this value. If unspecified, returns at most 100 service accounts. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListSubscribers` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSubscribers` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Integrators$Registersubscriber extends StandardParameters {
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1RegisterSubscriberRequest;
    }
    export interface Params$Resource$Integrators$Unregistersubscriber extends StandardParameters {
        /**
         * Optional. Resource name of the integrator. Required if account is not provided. Otherwise, leave this field empty/unset.
         */
        integrator?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudChannelV1UnregisterSubscriberRequest;
    }
    export class Resource$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of `1`, corresponding to `Code.CANCELLED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(params: Params$Resource$Operations$Cancel, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Operations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleLongrunningCancelOperationRequest;
    }
    export interface Params$Resource$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export class Resource$Products {
        context: APIRequestContext;
        skus: Resource$Products$Skus;
        constructor(context: APIRequestContext);
        /**
         * Lists the Products the reseller is authorized to sell. Possible error codes: * INVALID_ARGUMENT: Required request parameters are missing or invalid.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Products$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Products$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListProductsResponse>>;
        list(params: Params$Resource$Products$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Products$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListProductsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListProductsResponse>): void;
        list(params: Params$Resource$Products$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListProductsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListProductsResponse>): void;
    }
    export interface Params$Resource$Products$List extends StandardParameters {
        /**
         * Required. The resource name of the reseller account. Format: accounts/{account_id\}.
         */
        account?: string;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 Products. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page.
         */
        pageToken?: string;
    }
    export class Resource$Products$Skus {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the SKUs for a product the reseller is authorized to sell. Possible error codes: * INVALID_ARGUMENT: Required request parameters are missing or invalid.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Products$Skus$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Products$Skus$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudChannelV1ListSkusResponse>>;
        list(params: Params$Resource$Products$Skus$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Products$Skus$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkusResponse>, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkusResponse>): void;
        list(params: Params$Resource$Products$Skus$List, callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkusResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudChannelV1ListSkusResponse>): void;
    }
    export interface Params$Resource$Products$Skus$List extends StandardParameters {
        /**
         * Required. Resource name of the reseller. Format: accounts/{account_id\}.
         */
        account?: string;
        /**
         * Optional. The BCP-47 language code. For example, "en-US". The response will localize in the corresponding language code, if specified. The default value is "en-US".
         */
        languageCode?: string;
        /**
         * Optional. Requested page size. Server might return fewer results than requested. If unspecified, returns at most 100 SKUs. The maximum value is 1000; the server will coerce values above 1000.
         */
        pageSize?: number;
        /**
         * Optional. A token for a page of results other than the first page. Optional.
         */
        pageToken?: string;
        /**
         * Required. The resource name of the Product to list SKUs for. Parent uses the format: products/{product_id\}. Supports products/- to retrieve SKUs for all products.
         */
        parent?: string;
    }
    export {};
}
